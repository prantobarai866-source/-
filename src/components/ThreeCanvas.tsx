import React, { useEffect, useRef, useState } from 'react';

interface ThreeCanvasProps {
  isDarkMode: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);

  useEffect(() => {
    let checkInterval: any = null;
    let attempts = 0;
    const maxAttempts = 60; // 3 seconds total

    const checkThree = () => {
      attempts++;
      const THREE = (window as unknown as { THREE?: any }).THREE;
      if (THREE) {
        setIsThreeLoaded(true);
        if (checkInterval) clearInterval(checkInterval);
      } else if (attempts >= maxAttempts) {
        if (checkInterval) clearInterval(checkInterval);
      }
    };

    if ((window as unknown as { THREE?: any }).THREE) {
      setIsThreeLoaded(true);
    } else {
      checkInterval = setInterval(checkThree, 50);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  useEffect(() => {
    if (!isThreeLoaded) return;
    const container = containerRef.current;
    if (!container) return;

    const THREE = (window as unknown as { THREE?: any }).THREE;
    if (!THREE) return;

    let animationFrameId: number;

    const getDimensions = () => {
      const width = container.clientWidth || window.innerWidth || 800;
      const height = container.clientHeight || 280;
      return { width, height };
    };

    let { width, height } = getDimensions();

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 160;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central 3D Geometric Polyhedron (Academic & Science Motif)
    const icosahedronGeo = new THREE.IcosahedronGeometry(32, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x6366f1 : 0x4f46e5, // Indigo
      wireframe: true,
      transparent: true,
      opacity: isDarkMode ? 0.35 : 0.25,
    });
    const icosahedronMesh = new THREE.Mesh(icosahedronGeo, wireframeMat);
    mainGroup.add(icosahedronMesh);

    // Inner orbiting rings (like atomic structure / engineering sphere)
    const ringGeo = new THREE.TorusGeometry(38, 0.6, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x06b6d4 : 0x0284c7, // Cyan / Sky
      transparent: true,
      opacity: isDarkMode ? 0.45 : 0.3,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    ringMesh2.rotation.y = Math.PI / 3;
    mainGroup.add(ringMesh1);
    mainGroup.add(ringMesh2);

    // 2. Ambient Particle Constellation
    const particleCount = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    const spread = 260;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * (spread * 0.7);

      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointMaterial = new THREE.PointsMaterial({
      color: isDarkMode ? 0x38bdf8 : 0x0284c7,
      size: 4,
      transparent: true,
      opacity: isDarkMode ? 0.75 : 0.6,
    });

    const particles = new THREE.Points(geometry, pointMaterial);
    mainGroup.add(particles);

    // 3. Dynamic Connecting Lines
    const maxLineSegments = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x818cf8 : 0x6366f1,
      transparent: true,
      opacity: isDarkMode ? 0.22 : 0.14,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    mainGroup.add(lines);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let clock = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.01;

      // Slow elegant rotation of the 3D core
      icosahedronMesh.rotation.x += 0.003;
      icosahedronMesh.rotation.y += 0.005;
      ringMesh1.rotation.z += 0.004;
      ringMesh2.rotation.x += 0.004;

      // Smooth camera / group parallax with mouse
      mainGroup.rotation.y += (mouseX * 0.4 - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (mouseY * 0.3 - mainGroup.rotation.x) * 0.05;

      // Update particles
      const pos = geometry.attributes.position.array as Float32Array;
      let lineIndex = 0;
      const linePos = lineGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        // Bounce
        if (Math.abs(pos[i * 3]) > spread / 2) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > (spread * 0.55) / 2) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > (spread * 0.7) / 2) velocities[i].z *= -1;

        // Connections
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 48) {
            linePos[lineIndex * 6] = pos[i * 3];
            linePos[lineIndex * 6 + 1] = pos[i * 3 + 1];
            linePos[lineIndex * 6 + 2] = pos[i * 3 + 2];
            linePos[lineIndex * 6 + 3] = pos[j * 3];
            linePos[lineIndex * 6 + 4] = pos[j * 3 + 1];
            linePos[lineIndex * 6 + 5] = pos[j * 3 + 2];
            lineIndex++;
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex * 2);
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const dims = getDimensions();
      camera.aspect = dims.width / dims.height;
      camera.updateProjectionMatrix();
      renderer.setSize(dims.width, dims.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      icosahedronGeo.dispose();
      wireframeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      geometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, [isThreeLoaded, isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full min-h-[220px]"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
