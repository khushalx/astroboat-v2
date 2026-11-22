"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { Matrix4, NoToneMapping, OrthographicCamera, Quaternion, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector3 } from "three";
import type { ShaderMaterial, Texture } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { lunarViewBasis } from "@/lib/moon-observatory";
import type { LunarSnapshot } from "@/lib/moon-observatory";
import { lunarFragmentShader, lunarVertexShader } from "./lunar-surface";

export type MoonCommand = { sequence: number; action: "reset" | "in" | "out" | "left" | "right" | "up" | "down" };
export type MoonCanvasProps = {
  snapshot: LunarSnapshot;
  explore: boolean;
  active: boolean;
  reducedMotion: boolean;
  command: MoonCommand;
  onReady: () => void;
  onFailure: () => void;
};
type Maps = { color: Texture; height: Texture; normal: Texture };

function LunarSurface({ snapshot, onReady, onFailure, reducedMotion }: Pick<MoonCanvasProps, "snapshot" | "onReady" | "onFailure" | "reducedMotion">) {
  const { gl, invalidate } = useThree();
  const [maps, setMaps] = useState<Maps | null>(null);
  const [detailed, setDetailed] = useState(false);
  const light = useRef(new Vector3(...snapshot.sunDirection));
  const uniforms = useMemo(() => ({
    colorMap: { value: maps?.color }, heightMap: { value: maps?.height },
    normalMap: { value: maps?.normal }, sunDirection: { value: light.current }
  }), [maps]);
  const targetSun = useMemo(() => new Vector3(...snapshot.sunDirection), [snapshot.sunDirection]);
  const targetOrientation = useMemo(() => {
    const { right, up, forward } = lunarViewBasis(snapshot.libration.longitude, snapshot.libration.latitude);
    return new Quaternion().setFromRotationMatrix(new Matrix4().set(
      ...right, 0, ...up, 0, ...forward, 0, 0, 0, 0, 1
    ));
  }, [snapshot.libration.latitude, snapshot.libration.longitude]);
  const orientation = useRef(targetOrientation.clone());
  const mesh = useRef<import("three").Group>(null);
  const material = useRef<ShaderMaterial>(null);

  useEffect(() => {
    let disposed = false;
    const textures: Texture[] = [];
    const loader = new TextureLoader();
    async function loadMap(name: string, color = false) {
      const texture = await loader.loadAsync("/textures/moon/" + name);
      if (disposed) { texture.dispose(); throw new Error("Disposed lunar scene"); }
      texture.wrapS = RepeatWrapping;
      texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
      if (color) texture.colorSpace = SRGBColorSpace;
      textures.push(texture);
      return texture;
    }
    async function level(colorWidth: number, reliefWidth: number) {
      const [color, height, normal] = await Promise.all([
        loadMap(`color-${colorWidth}.webp`, true), loadMap(`height-${reliefWidth}.webp`), loadMap(`normal-${reliefWidth}.webp`)
      ]);
      if (!disposed) { setMaps({ color, height, normal }); invalidate(); }
    }
    void level(1024, 1024).then(() => {
      if (disposed) return;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (connection?.saveData || gl.capabilities.maxTextureSize < 2048) return;
      const colorWidth = window.innerWidth >= 1000 && gl.capabilities.maxTextureSize >= 4096 ? 4096 : 2048;
      // A failed detail upgrade must retain the complete low-resolution scene.
      void level(colorWidth, 2048).then(() => { if (!disposed) setDetailed(true); }).catch(() => {});
    }).catch(() => { if (!disposed) onFailure(); });
    return () => { disposed = true; textures.forEach((texture) => texture.dispose()); };
  }, [gl, invalidate, onFailure]);

  useEffect(() => {
    if (!maps) return;
    invalidate();
    // Keep the reference image until a textured frame has actually been drawn.
    let nextFrame = 0;
    const frame = requestAnimationFrame(() => { nextFrame = requestAnimationFrame(onReady); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame); };
  }, [maps, invalidate, onReady]);

  useEffect(() => {
    if (reducedMotion) {
      light.current.copy(targetSun);
      orientation.current.copy(targetOrientation);
    }
    invalidate();
  }, [targetSun, targetOrientation, invalidate, reducedMotion]);

  useFrame((_, delta) => {
    const amount = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 12);
    light.current.lerp(targetSun, amount).normalize();
    material.current?.uniforms.sunDirection.value.copy(light.current);
    orientation.current.slerp(targetOrientation, amount);
    if (mesh.current) mesh.current.quaternion.copy(orientation.current);
    if (light.current.distanceToSquared(targetSun) > 0.000001 || orientation.current.angleTo(targetOrientation) > 0.0001) invalidate();
  });
  if (!maps) return null;
  return <group ref={mesh} quaternion={orientation.current}>
    <mesh rotation={[0, -Math.PI / 2, 0]}>
      <sphereGeometry args={[1, detailed ? 256 : 128, detailed ? 128 : 64]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={lunarVertexShader} fragmentShader={lunarFragmentShader} />
    </mesh>
  </group>;
}

function Scene(props: MoonCanvasProps) {
  const { camera, size, gl, invalidate } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const revealing = useRef(!props.reducedMotion);
  const initial = useRef(true);
  const [surfaceReady, setSurfaceReady] = useState(false);
  const notifyReady = props.onReady;
  const surfaceDidRender = useCallback(() => { setSurfaceReady(true); notifyReady(); }, [notifyReady]);
  const { onFailure } = props;
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.touchAction = "pan-y";
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const halfHeight = Math.max(1.17, 1.17 / aspect);
    ortho.left = -halfHeight * aspect; ortho.right = halfHeight * aspect;
    ortho.top = halfHeight; ortho.bottom = -halfHeight;
    ortho.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  useEffect(() => {
    const c = controls.current;
    if (c) { c.enableDamping = false; c.update(); }
    camera.position.set(0, 0, 4);
    camera.up.set(0, 1, 0);
    camera.zoom = initial.current && !props.reducedMotion ? 0.96 : 1;
    initial.current = false;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    if (c) c.enableDamping = !props.reducedMotion;
    invalidate();
  }, [camera, props.explore, props.reducedMotion, invalidate]);
  useEffect(() => {
    const c = controls.current;
    if (!c || !props.command.sequence) return;
    revealing.current = false;
    const action = props.command.action;
    if (action === "reset") {
      c.enableDamping = false; c.update();
      camera.position.set(0, 0, 4); camera.up.set(0, 1, 0); camera.zoom = 1; c.target.set(0, 0, 0);
    } else if (action === "in" || action === "out") {
      camera.zoom = Math.max(0.8, Math.min(2.6, camera.zoom * (action === "in" ? 1.15 : 1 / 1.15)));
    } else if (props.explore) {
      if (action === "left" || action === "right") c.setAzimuthalAngle(c.getAzimuthalAngle() + (action === "left" ? -0.2 : 0.2));
      else c.setPolarAngle(Math.max(0.1, Math.min(Math.PI - 0.1, c.getPolarAngle() + (action === "up" ? -0.15 : 0.15))));
    }
    camera.updateProjectionMatrix(); c.update(); invalidate();
    c.enableDamping = !props.reducedMotion;
  }, [props.command, props.explore, props.reducedMotion, camera, invalidate]);
  useFrame((_, delta) => {
    if (!revealing.current || !surfaceReady) return;
    if (props.reducedMotion) { revealing.current = false; return; }
    camera.zoom += (1 - camera.zoom) * (1 - Math.exp(-Math.min(delta, 0.05) * 8));
    camera.updateProjectionMatrix();
    if (Math.abs(1 - camera.zoom) < 0.0001) revealing.current = false;
    else invalidate();
  });
  return <>
    <LunarSurface {...props} onReady={surfaceDidRender} />
    <OrbitControls ref={controls} makeDefault enableRotate={props.explore} enablePan={false}
      enableDamping={!props.reducedMotion} dampingFactor={0.12} rotateSpeed={0.55} zoomSpeed={0.65}
      minZoom={0.8} maxZoom={2.6} minPolarAngle={0.1} maxPolarAngle={Math.PI - 0.1}
      onStart={() => { revealing.current = false; }} />
  </>;
}

export default function MoonCanvas(props: MoonCanvasProps) {
  return <Canvas orthographic camera={{ position: [0, 0, 4], near: 0.1, far: 30, zoom: 1 }}
    frameloop={props.active ? "demand" : "never"} dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: NoToneMapping }}
    onCreated={({ gl }) => { gl.setClearColor(0x0b1016, 0); gl.domElement.setAttribute("aria-hidden", "true"); }}>
    <Scene {...props} />
  </Canvas>;
}
