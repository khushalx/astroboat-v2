(function () {
  "use strict";

  function initializeStarfield() {
    const canvas = document.querySelector("#starfield");
    if (!canvas || typeof window.THREE === "undefined") return;

    const THREE = window.THREE;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x07080f, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.set(0, 0, 1000);

    function createStarLayer(count, spreadX, spreadY, minZ, maxZ, materialOptions) {
      const positions = new Float32Array(count * 3);

      for (let index = 0; index < count; index += 1) {
        const offset = index * 3;
        positions[offset] = (Math.random() * 2 - 1) * spreadX;
        positions[offset + 1] = (Math.random() * 2 - 1) * spreadY;
        positions[offset + 2] = minZ + Math.random() * (maxZ - minZ);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial(materialOptions);
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      return { points, geometry, material };
    }

    const distantLayer = createStarLayer(
      isMobile ? 1500 : 3000,
      1200,
      1200,
      -2000,
      0,
      {
        size: 1,
        color: 0xc8d8f5,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
      }
    );

    const nearLayer = createStarLayer(800, 800, 800, -500, 200, {
      size: 1.8,
      color: 0xfff8ee,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let currentScrollY = window.scrollY;
    let rafId = null;
    let disposed = false;

    function onMouseMove(event) {
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function onScroll() {
      currentScrollY = window.scrollY;
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (prefersReducedMotion || isMobile) {
        renderer.render(scene, camera);
      }
    }

    function animate() {
      scene.rotation.y += 0.00008;
      scene.rotation.x += 0.00003;

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      distantLayer.points.rotation.y = currentMouseX * 0.05;
      distantLayer.points.rotation.x = currentMouseY * 0.03;
      nearLayer.points.rotation.y = currentMouseX * 0.09;
      nearLayer.points.rotation.x = currentMouseY * 0.05;

      distantLayer.points.position.y = -currentScrollY * 0.03;
      nearLayer.points.position.y = -currentScrollY * 0.06;

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    }

    function cleanup() {
      if (disposed) return;
      disposed = true;

      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pagehide", cleanup);

      renderer.dispose();
      distantLayer.geometry.dispose();
      distantLayer.material.dispose();
      nearLayer.geometry.dispose();
      nearLayer.material.dispose();
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("pagehide", cleanup, { once: true });

    if (prefersReducedMotion || isMobile) {
      renderer.render(scene, camera);
      return;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    animate();
  }

  document.addEventListener("DOMContentLoaded", initializeStarfield, { once: true });
})();
