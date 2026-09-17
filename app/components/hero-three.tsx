'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
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

    const animation = { progress: 0 };
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .to(animation, { progress: 1, duration: 2.4 })
      .to(camera.position, { z: 5.2, duration: 2.4 }, 0)
      .to(lineMaterial, { opacity: 0.33, duration: 1.1 }, 1.15)
      .fromTo('[data-hero-lockup]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.85 }, 1.72)
      .fromTo('[data-hero-copy]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.95);

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    updateSize();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      if (!active || disposed) return;
      const elapsed = clock.getElapsedTime();
      const p = animation.progress;
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
      if (active) clock.start();
    }, { threshold: 0.01 });
    observer.observe(canvas);

    const onVisibility = () => { active = !document.hidden && canvas.getBoundingClientRect().bottom > 0; };
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      intro.kill();
      observer.disconnect();
      resizeObserver.disconnect();
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
