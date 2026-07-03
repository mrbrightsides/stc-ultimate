'use client';

/**
 * STC Ultimate - Particle Effects System
 * Birds, butterflies, falling leaves, fireflies
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffectsProps {
  type: 'birds' | 'butterflies' | 'leaves' | 'fireflies' | 'rain' | 'snow';
  count: number;
  enabled: boolean;
  areaSize: number;
}

export function ParticleEffects({ type, count, enabled, areaSize }: ParticleEffectsProps): JSX.Element | null {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));

  // Generate particle positions and velocities
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions within area
      positions[i3] = (Math.random() - 0.5) * areaSize;
      positions[i3 + 1] = (Math.random() - 0.5) * areaSize;
      positions[i3 + 2] = (Math.random() - 0.5) * areaSize;

      // Set velocities based on type
      switch (type) {
        case 'birds':
          velocities[i3] = (Math.random() - 0.5) * 0.1;
          velocities[i3 + 1] = Math.random() * 0.02;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
          // Birds - dark silhouettes
          colors[i3] = 0.1;
          colors[i3 + 1] = 0.1;
          colors[i3 + 2] = 0.1;
          break;
        
        case 'butterflies':
          velocities[i3] = (Math.random() - 0.5) * 0.05;
          velocities[i3 + 1] = Math.sin(i) * 0.03;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
          // Butterflies - colorful
          colors[i3] = Math.random();
          colors[i3 + 1] = Math.random() * 0.5 + 0.5;
          colors[i3 + 2] = Math.random();
          break;
        
        case 'leaves':
          velocities[i3] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 1] = -Math.random() * 0.05;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
          // Leaves - autumn colors
          colors[i3] = Math.random() * 0.3 + 0.7;
          colors[i3 + 1] = Math.random() * 0.3 + 0.3;
          colors[i3 + 2] = 0.1;
          break;
        
        case 'fireflies':
          velocities[i3] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
          // Fireflies - yellow glow
          colors[i3] = 1.0;
          colors[i3 + 1] = 1.0;
          colors[i3 + 2] = 0.3;
          break;
        
        case 'rain':
          velocities[i3] = 0;
          velocities[i3 + 1] = -0.3;
          velocities[i3 + 2] = 0;
          // Rain - blue-gray
          colors[i3] = 0.7;
          colors[i3 + 1] = 0.8;
          colors[i3 + 2] = 0.9;
          break;
        
        case 'snow':
          velocities[i3] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 1] = -Math.random() * 0.05;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
          // Snow - white
          colors[i3] = 1.0;
          colors[i3 + 1] = 1.0;
          colors[i3 + 2] = 1.0;
          break;
      }
    }

    return { positions, colors };
  }, [count, areaSize, type]);

  // Animate particles
  useFrame((state, delta) => {
    if (!particlesRef.current || !enabled) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update position based on velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Add some oscillation for natural movement
      if (type === 'butterflies' || type === 'fireflies') {
        positions[i3] += Math.sin(time + i) * 0.001;
        positions[i3 + 1] += Math.cos(time + i) * 0.001;
      }

      // Wrap around boundaries
      const halfSize = areaSize / 2;
      if (Math.abs(positions[i3]) > halfSize) {
        positions[i3] = (Math.random() - 0.5) * areaSize;
      }
      if (Math.abs(positions[i3 + 2]) > halfSize) {
        positions[i3 + 2] = (Math.random() - 0.5) * areaSize;
      }

      // Reset particles that fall too low (except birds)
      if (type !== 'birds' && positions[i3 + 1] < -halfSize) {
        positions[i3 + 1] = halfSize;
      }
      // Reset birds that fly too high
      if (type === 'birds' && positions[i3 + 1] > halfSize) {
        positions[i3 + 1] = -halfSize;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!enabled) return null;

  // Determine particle size based on type
  const particleSize = type === 'fireflies' ? 0.1 : type === 'rain' ? 0.05 : 0.2;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={type === 'fireflies' ? 0.8 : 0.7}
        blending={type === 'fireflies' ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Multiple particle systems manager
 */
interface ParticleSystemProps {
  weather: string;
  locationId: string;
  enabled: boolean;
}

export function ParticleSystem({ weather, locationId, enabled }: ParticleSystemProps): JSX.Element {
  // Determine which particles to show based on weather and location
  const particleConfig = useMemo(() => {
    const config: Array<{ type: ParticleEffectsProps['type']; count: number; enabled: boolean }> = [];

    // Weather-based particles
    if (weather === 'rain' || weather === 'rainy') {
      config.push({ type: 'rain', count: 500, enabled: true });
    }

    // Location-based particles
    if (locationId === 'bali' || locationId === 'lombok') {
      config.push({ type: 'birds', count: 15, enabled: true });
      config.push({ type: 'butterflies', count: 20, enabled: true });
    }

    if (locationId === 'yogyakarta') {
      config.push({ type: 'birds', count: 10, enabled: true });
      config.push({ type: 'leaves', count: 30, enabled: true });
    }

    if (locationId === 'jakarta') {
      config.push({ type: 'birds', count: 5, enabled: true });
    }

    // Night effects
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6) {
      config.push({ type: 'fireflies', count: 25, enabled: true });
    }

    return config;
  }, [weather, locationId]);

  if (!enabled) return <></>;

  return (
    <>
      {particleConfig.map((config, idx) => (
        <ParticleEffects
          key={`${config.type}-${idx}`}
          type={config.type}
          count={config.count}
          enabled={config.enabled}
          areaSize={100}
        />
      ))}
    </>
  );
}
