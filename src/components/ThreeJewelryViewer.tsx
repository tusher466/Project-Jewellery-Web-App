import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, ZoomIn, ZoomOut, Camera, Sun, Eye } from 'lucide-react';

interface ThreeJewelryViewerProps {
  type: 'ring' | 'pendant' | 'gemstone' | 'bracelet';
  primaryColor?: string;
  gemstoneColor?: string;
  metalFinish?: 'gold' | 'white-gold' | 'rose-gold' | 'platinum';
  height?: number | string;
  autoRotate?: boolean;
  onSnapshotGenerated?: (dataUrl: string) => void;
  showControls?: boolean;
}

const METAL_PRESETS = {
  gold: { color: 0xdeb841, metalness: 0.96, roughness: 0.15, label: '18K Yellow Gold' },
  'rose-gold': { color: 0xe6a894, metalness: 0.94, roughness: 0.16, label: '18K Rose Gold' },
  'white-gold': { color: 0xe5e7eb, metalness: 0.95, roughness: 0.14, label: '18K White Gold' },
  platinum: { color: 0xd6d9e0, metalness: 0.98, roughness: 0.12, label: 'Platinum 950' },
};

export const ThreeJewelryViewer: React.FC<ThreeJewelryViewerProps> = ({
  type = 'ring',
  gemstoneColor = '#60a5fa',
  metalFinish = 'gold',
  height = 420,
  autoRotate: defaultAutoRotate = true,
  onSnapshotGenerated,
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const jewelryGroupRef = useRef<THREE.Group | null>(null);
  const metalMeshRefs = useRef<THREE.Mesh[]>([]);

  const [isRotating, setIsRotating] = useState(defaultAutoRotate);
  const [activeMetal, setActiveMetal] = useState<'gold' | 'rose-gold' | 'white-gold' | 'platinum'>(metalFinish);
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'atelier' | 'dramatic' | 'pure'>('atelier');
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const heightPx = typeof height === 'number' ? height : container.clientHeight || 420;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e0f15);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);
    cameraRef.current = camera;

    // 3. Renderer with antialias and tone mapping for photorealism
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e6, 2.8);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.6);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    rimLight.position.set(0, -4, -4);
    scene.add(rimLight);

    const centerPointLight = new THREE.PointLight(0xffffff, 1.8, 10);
    centerPointLight.position.set(0, 2, 1.5);
    scene.add(centerPointLight);

    // 5. Build Procedural Jewelry Object
    const jewelryGroup = new THREE.Group();
    jewelryGroupRef.current = jewelryGroup;
    scene.add(jewelryGroup);
    metalMeshRefs.current = [];

    const preset = METAL_PRESETS[activeMetal];
    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      wireframe: wireframe,
    });

    const gemColorVal = new THREE.Color(gemstoneColor);
    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: gemColorVal,
      metalness: 0.05,
      roughness: 0.03,
      transmission: 0.88,
      ior: 2.417, // Diamond refractive index
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      wireframe: wireframe,
    });

    if (type === 'ring') {
      // Band (Torus)
      const bandGeometry = new THREE.TorusGeometry(1.2, 0.16, 32, 100);
      const band = new THREE.Mesh(bandGeometry, metalMaterial);
      band.rotation.x = Math.PI / 2.2;
      jewelryGroup.add(band);
      metalMeshRefs.current.push(band);

      // Crown / Prongs
      const crownBaseGeom = new THREE.CylinderGeometry(0.55, 0.35, 0.35, 16);
      const crownBase = new THREE.Mesh(crownBaseGeom, metalMaterial);
      crownBase.position.set(0, 1.35, 0);
      jewelryGroup.add(crownBase);
      metalMeshRefs.current.push(crownBase);

      for (let i = 0; i < 4; i++) {
        const prongGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.45, 12);
        const prong = new THREE.Mesh(prongGeom, metalMaterial);
        const angle = (i * Math.PI) / 2;
        prong.position.set(Math.cos(angle) * 0.48, 1.45, Math.sin(angle) * 0.48);
        jewelryGroup.add(prong);
        metalMeshRefs.current.push(prong);
      }

      // Solitaire Center Brilliant Gemstone
      const gemGeometry = new THREE.OctahedronGeometry(0.62, 2);
      const gem = new THREE.Mesh(gemGeometry, gemMaterial);
      gem.position.set(0, 1.5, 0);
      gem.rotation.y = Math.PI / 4;
      jewelryGroup.add(gem);
    } else if (type === 'pendant') {
      // Pendant Bail / Ring
      const bailGeom = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
      const bail = new THREE.Mesh(bailGeom, metalMaterial);
      bail.position.set(0, 1.3, 0);
      jewelryGroup.add(bail);
      metalMeshRefs.current.push(bail);

      // Bezel Frame
      const frameGeom = new THREE.TorusGeometry(0.85, 0.12, 24, 48);
      const frame = new THREE.Mesh(frameGeom, metalMaterial);
      frame.position.set(0, 0.35, 0);
      jewelryGroup.add(frame);
      metalMeshRefs.current.push(frame);

      // Graduated Center Stone
      const gemGeom = new THREE.DodecahedronGeometry(0.78, 1);
      const gem = new THREE.Mesh(gemGeom, gemMaterial);
      gem.position.set(0, 0.35, 0);
      gem.scale.set(1, 1.3, 0.7);
      jewelryGroup.add(gem);
    } else if (type === 'bracelet') {
      // Architectural Oval Cuff
      const cuffGeom = new THREE.TorusGeometry(1.4, 0.22, 28, 80, Math.PI * 1.75);
      const cuff = new THREE.Mesh(cuffGeom, metalMaterial);
      cuff.rotation.z = Math.PI / 8;
      cuff.rotation.x = Math.PI / 3;
      jewelryGroup.add(cuff);
      metalMeshRefs.current.push(cuff);

      // Channel Stones on the front arc
      for (let i = -4; i <= 4; i++) {
        const stoneGeom = new THREE.BoxGeometry(0.12, 0.16, 0.12);
        const stone = new THREE.Mesh(stoneGeom, gemMaterial);
        const theta = (i * Math.PI) / 14;
        stone.position.set(Math.cos(theta) * 1.4, Math.sin(theta) * 1.4, 0.15);
        jewelryGroup.add(stone);
      }
    } else {
      // Gemstone Solitaire Specimen
      const jewelGeom = new THREE.IcosahedronGeometry(1.2, 1);
      const gem = new THREE.Mesh(jewelGeom, gemMaterial);
      jewelryGroup.add(gem);

      const seatGeom = new THREE.TorusGeometry(0.9, 0.08, 16, 32);
      const seat = new THREE.Mesh(seatGeom, metalMaterial);
      seat.position.set(0, -0.6, 0);
      seat.rotation.x = Math.PI / 2;
      jewelryGroup.add(seat);
      metalMeshRefs.current.push(seat);
    }

    // Sparkle Dust Particles
    const sparklesCount = 45;
    const sparkleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(sparklesCount * 3);
    for (let i = 0; i < sparklesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.5;
      positions[i + 1] = (Math.random() - 0.5) * 4.5;
      positions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const sparkleSystem = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkleSystem);

    // 6. User Orbit Controls (Drag to rotate)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !jewelryGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      jewelryGroupRef.current.rotation.y += deltaX * 0.01;
      jewelryGroupRef.current.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.003;
      cameraRef.current.position.z = Math.max(2.0, Math.min(6.5, newZ));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && jewelryGroupRef.current && !isDragging) {
        jewelryGroupRef.current.rotation.y += 0.008;
      }

      sparkleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = typeof height === 'number' ? height : container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('wheel', handleWheel);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [type, gemstoneColor, height, isRotating, wireframe]);

  // Update metal materials smoothly when user toggles finish
  useEffect(() => {
    const preset = METAL_PRESETS[activeMetal];
    metalMeshRefs.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
        mesh.material.color.setHex(preset.color);
        mesh.material.metalness = preset.metalness;
        mesh.material.roughness = preset.roughness;
        mesh.material.needsUpdate = true;
      }
    });
  }, [activeMetal]);

  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    if (onSnapshotGenerated) {
      onSnapshotGenerated(dataUrl);
    }
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2400);
  };

  const resetCamera = (view: 'angled' | 'top' | 'front') => {
    if (!jewelryGroupRef.current || !cameraRef.current) return;
    cameraRef.current.position.set(0, 1.2, 4.2);
    if (view === 'angled') {
      jewelryGroupRef.current.rotation.set(0.3, 0.4, 0);
    } else if (view === 'top') {
      jewelryGroupRef.current.rotation.set(Math.PI / 2, 0, 0);
    } else {
      jewelryGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#0e0f15] shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing touch-none select-none"
        title="Click and drag to orbit in 3D. Scroll to zoom."
      />

      {/* Floating Interactive 3D Toolbar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg bg-[#141620]/80 px-2.5 py-1 text-xs backdrop-blur-md border border-[#d4af37]/25 text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="font-serif-luxury tracking-wider uppercase text-[#e5c158]">Photorealistic 3D Viewport</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1 bg-[#141620]/90 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
                isRotating ? 'bg-[#d4af37]/20 text-[#e5c158]' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isRotating ? 'Pause Turntable' : 'Spin Turntable'}
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
            <button
              onClick={() => resetCamera('angled')}
              className="px-2 py-1 text-[11px] rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset angle view"
            >
              Perspective
            </button>
            <button
              onClick={() => resetCamera('top')}
              className="px-2 py-1 text-[11px] rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Top view"
            >
              Zenith
            </button>
            <button
              onClick={handleCaptureSnapshot}
              className={`p-1.5 rounded transition-colors text-xs ${
                snapshotTaken ? 'bg-emerald-900/60 text-emerald-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Capture 3D Render Snapshot"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Metal & Finish Selector */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#141620]/90 px-2 py-1 rounded-lg border border-slate-800 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 mr-1">Metal Finish:</span>
            {(['gold', 'platinum', 'rose-gold', 'white-gold'] as const).map((metal) => (
              <button
                key={metal}
                onClick={() => setActiveMetal(metal)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all ${
                  activeMetal === metal
                    ? 'bg-[#d4af37]/25 text-[#f3e5ab] border border-[#d4af37]/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {metal === 'gold' && '18K Yellow'}
                {metal === 'platinum' && 'Pt 950'}
                {metal === 'rose-gold' && '18K Rose'}
                {metal === 'white-gold' && '18K White'}
              </button>
            ))}
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#141620]/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <span>Drag 360° · Scroll Zoom</span>
          </div>
        </div>
      )}
    </div>
  );
};
