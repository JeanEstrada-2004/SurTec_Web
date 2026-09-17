'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MARK_BRIDGES, MARK_EDGES, MARK_NODES } from '../lib/brand-network';

type HeroThreeProps = {
  reducedMotion: boolean;
};

function toScenePoint(x: number, y: number, z = 0) {
  return new THREE.Vector3((x - 130) / 46, -(y - 160) / 48, z);
}

export function HeroThree({ reducedMotion }: HeroThreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(reducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) {
      setFallback(true);
      return;
    }

    const forceFallback = new URLSearchParams(window.location.search).has('no-webgl');
    const context = forceFallback ? null : canvas.getContext('webgl2', { alpha: true, antialias: false });
    if (!context) {
      setFallback(true);
      return;
    }

    let active = true;
    let disposed = false;
    const compact = window.innerWidth < 760;
    const count = compact ? 180 : 420;
    const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const geometry = new THREE.BufferGeometry();
    const starts = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const allSegments = [
      ...MARK_EDGES.map(([a, b]) => [MARK_NODES[a], MARK_NODES[b]] as const),
      ...MARK_BRIDGES,
    ];

    for (let i = 0; i < count; i += 1) {
      const radius = 2.8 + Math.random() * 4.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starts[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starts[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starts[i * 3 + 2] = radius * Math.cos(phi) - 1.2;

      const segment = allSegments[i % allSegments.length];
      const t = Math.random();
      const a = toScenePoint(segment[0][0], segment[0][1]);
      const b = toScenePoint(segment[1][0], segment[1][1]);
      targets[i * 3] = THREE.MathUtils.lerp(a.x, b.x, t) + (Math.random() - 0.5) * 0.035;
      targets[i * 3 + 1] = THREE.MathUtils.lerp(a.y, b.y, t) + (Math.random() - 0.5) * 0.035;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      positions[i * 3] = starts[i * 3];
      positions[i * 3 + 1] = starts[i * 3 + 1];
      positions[i * 3 + 2] = starts[i * 3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x4aa3ee,
      size: compact ? 0.045 : 0.055,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    const lineValues: number[] = [];
    allSegments.forEach(([start, end]) => {
      const a = toScenePoint(start[0], start[1], -0.03);
      const b = toScenePoint(end[0], end[1], -0.03);
      lineValues.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineValues, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4aa3ee, transparent: true, opacity: 0 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const introAnimations = [
      document.querySelector<HTMLElement>('[data-hero-lockup]')?.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 850, delay: 1700, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' },
      ),
      document.querySelector<HTMLElement>('[data-hero-copy]')?.animate(
        [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 900, delay: 1950, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' },
      ),
    ];

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    updateSize();

    const startTime = performance.now();
    renderer.setAnimationLoop(() => {
      if (!active || disposed) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const rawProgress = Math.min(elapsed / 2.4, 1);
      const p = 1 - Math.pow(1 - rawProgress, 3);
      camera.position.z = THREE.MathUtils.lerp(7.4, 5.2, p);
      lineMaterial.opacity = Math.max(0, Math.min((rawProgress - 0.46) * 0.65, 0.33));
      const attribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = attribute.array as Float32Array;
      for (let i = 0; i < count; i += 1) {
        const wobble = (1 - p) * Math.sin(elapsed * 0.7 + i * 0.19) * 0.018;
        array[i * 3] = THREE.MathUtils.lerp(starts[i * 3], targets[i * 3], p) + wobble;
        array[i * 3 + 1] = THREE.MathUtils.lerp(starts[i * 3 + 1], targets[i * 3 + 1], p);
        array[i * 3 + 2] = THREE.MathUtils.lerp(starts[i * 3 + 2], targets[i * 3 + 2], p);
      }
      attribute.needsUpdate = true;
      pointCloud.rotation.z = (1 - p) * elapsed * 0.025;
      renderer.render(scene, camera);
    });

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting && !document.hidden;
    }, { threshold: 0.01 });
    observer.observe(canvas);

    const onVisibility = () => { active = !document.hidden && canvas.getBoundingClientRect().bottom > 0; };
    window.addEventListener('resize', updateSize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      introAnimations.forEach((animation) => animation?.cancel());
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.setAnimationLoop(null);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className={`hero-canvas-shell ${fallback ? 'is-fallback' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-fallback-network">
        {Array.from({ length: 22 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}
      </div>
    </div>
  );
}
