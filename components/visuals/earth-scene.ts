import * as THREE from "three";

export type EarthController = {
  setPaused: (value: boolean) => void;
  setVisible: (value: boolean) => void;
  rotate: (amount: number) => void;
  dispose: () => void;
};

type EarthOptions = { paused: boolean; onReady: () => void; onError: () => void };

/** A decorative Earth illustration; orbital scale and lighting are artistic, not live telemetry. */
export function mountEarth(host: HTMLDivElement, options: EarthOptions): EarthController {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 50);
  camera.position.set(0, 0, 4.6);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    options.onError();
    return { setPaused() {}, setVisible() {}, rotate() {}, dispose() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const world = new THREE.Group();
  world.rotation.z = 0.16;
  scene.add(world);
  const textures: THREE.Texture[] = [];
  const geometry = new THREE.SphereGeometry(1, 64, 48);
  const sunlight = new THREE.Vector3(-3, 3, 4).normalize();
  let disposed = false;
  let loaded = false;
  let paused = options.paused;
  let visible = true;
  let dragging = false;
  let previousX = 0;
  let previousTime = 0;
  let earth: THREE.Mesh | undefined;
  let clouds: THREE.Mesh | undefined;

  const orbitPoints = Array.from({ length: 161 }, (_, index) => {
    const angle = (index / 160) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * 1.62, Math.sin(angle) * 1.62, 0);
  });
  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(orbitPoints),
    new THREE.LineBasicMaterial({ color: 0xbbe58a, transparent: true, opacity: 0.3 })
  );
  orbit.rotation.set(1.2, -0.2, -0.4);
  scene.add(orbit);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), new THREE.MeshBasicMaterial({ color: 0xd2f79b }));
  marker.position.copy(orbitPoints[15]);
  orbit.add(marker);

  const atmosphere = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { lightDirection: { value: sunlight } },
    vertexShader: `varying vec3 vNormal; varying vec3 vPosition;
      void main() {
        vNormal = normalize(mat3(modelMatrix) * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `varying vec3 vNormal; varying vec3 vPosition; uniform vec3 lightDirection;
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float rim = pow(clamp(1.0 + dot(normalize(vNormal), viewDirection), 0.0, 1.0), 3.5);
        float light = 0.3 + 0.7 * max(dot(normalize(vNormal), lightDirection), 0.0);
        gl_FragColor = vec4(vec3(0.25, 0.6, 0.85) * rim * light, rim * 0.7);
      }`
  }));
  atmosphere.scale.setScalar(1.055);
  world.add(atmosphere);

  const loader = new THREE.TextureLoader();
  async function texture(path: string, color = false) {
    const result = await loader.loadAsync(path);
    if (disposed) { result.dispose(); throw new Error("Scene disposed"); }
    if (color) result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.push(result);
    return result;
  }

  void Promise.all([
    texture("/textures/earth-day.webp", true),
    texture("/textures/earth-night.webp", true),
    texture("/textures/earth-clouds.webp")
  ]).then(([day, night, cloudMap]) => {
    if (disposed) return;
    earth = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
      uniforms: { dayMap: { value: day }, nightMap: { value: night }, lightDirection: { value: sunlight } },
      vertexShader: `varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(mat3(modelMatrix) * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `uniform sampler2D dayMap; uniform sampler2D nightMap; uniform vec3 lightDirection;
        varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
        void main() {
          vec3 normal = normalize(vNormal);
          float sun = dot(normal, lightDirection);
          vec3 day = texture2D(dayMap, vUv).rgb;
          vec3 night = texture2D(nightMap, vUv).rgb;
          float daylight = smoothstep(-0.18, 0.3, sun);
          vec3 surface = day * (0.075 + max(sun, 0.0) * 1.3);
          surface += night * (1.0 - daylight) * 1.15;
          float rim = pow(1.0 - max(dot(normal, normalize(cameraPosition - vPosition)), 0.0), 3.0);
          surface += vec3(0.12, 0.36, 0.55) * rim * daylight * 0.5;
          gl_FragColor = vec4(surface, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    }));
    earth.rotation.y = 3.4;
    world.add(earth);
    clouds = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: 0xe7f4fa, alphaMap: cloudMap, transparent: true, opacity: 0.64, depthWrite: false
    }));
    clouds.scale.setScalar(1.008);
    clouds.rotation.y = earth.rotation.y;
    world.add(clouds);
    scene.add(new THREE.AmbientLight(0x9eb9d1, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.copy(sunlight.clone().multiplyScalar(5));
    scene.add(light);
    loaded = true;
    render();
    options.onReady();
    syncAnimation();
  }).catch(() => { if (!disposed) options.onError(); });

  function render() {
    if (!disposed) renderer.render(scene, camera);
  }
  function syncAnimation() {
    previousTime = 0;
    renderer.setAnimationLoop(loaded && visible && !document.hidden && !paused ? (time: number) => {
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      if (!dragging && earth && clouds) {
        earth.rotation.y += elapsed * 0.035;
        clouds.rotation.y += elapsed * 0.042;
      }
      render();
    } : null);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
  }
  function rotate(amount: number) {
    if (!earth || !clouds) return;
    earth.rotation.y += amount;
    clouds.rotation.y += amount;
    render();
  }
  function pointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    dragging = true;
    previousX = event.clientX;
    host.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (!dragging) return;
    rotate((event.clientX - previousX) * 0.006);
    previousX = event.clientX;
  }
  function pointerUp() { dragging = false; }
  function contextLost(event: Event) {
    event.preventDefault();
    loaded = false;
    renderer.setAnimationLoop(null);
    options.onError();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  document.addEventListener("visibilitychange", syncAnimation);
  host.addEventListener("pointerdown", pointerDown);
  host.addEventListener("pointermove", pointerMove);
  host.addEventListener("pointerup", pointerUp);
  host.addEventListener("pointercancel", pointerUp);
  host.addEventListener("lostpointercapture", pointerUp);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  resize();

  return {
    setPaused(value) { paused = value; syncAnimation(); },
    setVisible(value) { visible = value; syncAnimation(); },
    rotate,
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      host.removeEventListener("pointerdown", pointerDown);
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerup", pointerUp);
      host.removeEventListener("pointercancel", pointerUp);
      host.removeEventListener("lostpointercapture", pointerUp);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      geometries.forEach((item) => item.dispose());
      textures.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  };
}
