'use client';

import { Environment, Float, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

type Props = {
  /** Element the scene is arranged around (the photo card). */
  anchor: HTMLElement;
  active: boolean;
  reduceMotion: boolean;
  lightTheme: boolean;
  onReady: () => void;
};

const TEAL = '#1fd1b2';
const CORAL = '#ff7a59';

/**
 * Converts the anchor's on-screen box into world units every frame, so the
 * scene stays wrapped around the photo card at any viewport size.
 */
function useAnchorBox(anchor: HTMLElement) {
  const { viewport, size, gl } = useThree();
  const box = useRef({ x: 0, y: 0, w: 2, h: 2.6 });
  useFrame(() => {
    const a = anchor.getBoundingClientRect();
    const c = gl.domElement.getBoundingClientRect();
    if (!a.width || !size.width) return;
    box.current.x = ((a.left - c.left + a.width / 2) / size.width - 0.5) * viewport.width;
    box.current.y = -((a.top - c.top + a.height / 2) / size.height - 0.5) * viewport.height;
    box.current.w = (a.width / size.width) * viewport.width;
    box.current.h = (a.height / size.height) * viewport.height;
  });
  return box;
}

function Floaty({ children, still, speed = 1.4 }: { children: ReactNode; still: boolean; speed?: number }) {
  if (still) return <>{children}</>;
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      {children}
    </Float>
  );
}

function Scene({ anchor, reduceMotion }: Pick<Props, 'anchor' | 'reduceMotion'>) {
  const box = useAnchorBox(anchor);
  const rig = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const orbiter = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const glassA = useRef<THREE.Group>(null);
  const glassB = useRef<THREE.Group>(null);
  const pearl = useRef<THREE.Group>(null);
  const ringTilt = useMemo(() => new THREE.Euler(1.28, -0.22, 0.18), []);
  const narrow = useThree((s) => s.size.width < 768);
  const orbitPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const { x, y, w, h } = box.current;
    const t = state.clock.elapsedTime;

    // Whole scene follows the card and leans toward the pointer.
    if (rig.current) {
      rig.current.position.set(x, y, 0);
      if (!reduceMotion) {
        rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, state.pointer.x * 0.18, 3, delta);
        rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -state.pointer.y * 0.12, 3, delta);
      }
    }

    // Planet: behind the card, top-right.
    planet.current?.position.set(w * (narrow ? 0.4 : 0.62), h * (narrow ? 0.12 : 0.28), -2.4);
    planet.current?.scale.setScalar(w * (narrow ? 0.5 : 0.78));
    if (planet.current && !reduceMotion) planet.current.rotation.y += delta * 0.08;

    // Orbit ring and the coral sphere riding it (passes behind the card).
    const R = w * 0.78;
    ring.current?.scale.setScalar(R);
    if (orbiter.current) {
      const a = reduceMotion ? 2.4 : t * 0.45;
      orbiter.current.position.copy(orbitPos.set(Math.cos(a) * R, Math.sin(a) * R, 0).applyEuler(ringTilt));
      orbiter.current.scale.setScalar(w * 0.13);
    }

    glassA.current?.position.set(w * 0.56, -h * 0.6, 0.4);
    glassA.current?.scale.setScalar(w * 0.075);
    glassB.current?.position.set(-w * 0.72, h * 0.44, 0.4);
    glassB.current?.scale.setScalar(w * 0.06);
    pearl.current?.position.set(-w * 1.15, -h * 0.5, -0.5);
    pearl.current?.scale.setScalar(w * 0.05);
  });

  return (
    <group ref={rig}>
      <mesh ref={planet}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial color={TEAL} roughness={0.22} metalness={0.05} clearcoat={1} clearcoatRoughness={0.15} emissive="#0a5c50" emissiveIntensity={0.35} />
      </mesh>

      <mesh ref={ring} rotation={ringTilt}>
        <torusGeometry args={[1, 0.0035, 12, 160]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.35} />
      </mesh>

      <group ref={orbiter}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial color={CORAL} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} emissive="#8a2a17" emissiveIntensity={0.25} />
        </mesh>
      </group>

      <group ref={glassA}>
        <Floaty still={reduceMotion}>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial transmissionSampler thickness={1.2} roughness={0.05} ior={1.35} chromaticAberration={0.08} backside color="#bff7ea" iridescence={0.6} />
          </mesh>
        </Floaty>
      </group>
      <group ref={glassB}>
        <Floaty still={reduceMotion} speed={1.1}>
          <mesh>
            <sphereGeometry args={[1, 48, 48]} />
            <MeshTransmissionMaterial transmissionSampler thickness={1} roughness={0.08} ior={1.3} chromaticAberration={0.06} color="#c9faee" iridescence={0.5} />
          </mesh>
        </Floaty>
      </group>
      <group ref={pearl}>
        <Floaty still={reduceMotion} speed={0.9}>
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial color="#e9fffa" roughness={0.3} clearcoat={1} />
          </mesh>
        </Floaty>
      </group>
    </group>
  );
}

/** Procedural studio lighting: no downloads, tinted with the brand colours. */
function Studio({ lightTheme }: { lightTheme: boolean }) {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="ring" intensity={4} color={TEAL} position={[-4, 3, 3]} scale={3} />
      <Lightformer form="rect" intensity={3} color={CORAL} position={[5, -2, 2]} scale={[3, 5, 1]} />
      <Lightformer form="rect" intensity={lightTheme ? 3 : 2} color="#ffffff" position={[0, 5, -3]} scale={[8, 1, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="circle" intensity={1.5} color="#8ff5df" position={[0, 0, 6]} scale={4} />
    </Environment>
  );
}

export default function HeroScene({ anchor, active, reduceMotion, lightTheme, onReady }: Props) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? (reduceMotion ? 'demand' : 'always') : 'never'}
      eventSource={document.body}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        onReady();
      }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <ambientLight intensity={lightTheme ? 0.6 : 0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <Studio lightTheme={lightTheme} />
      <Scene anchor={anchor} reduceMotion={reduceMotion} />
    </Canvas>
  );
}
