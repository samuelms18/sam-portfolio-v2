'use client';

import { Environment, Float, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
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
const TUBULAR = 420;
const RADIAL = 24;
const TUBE = 0.075;

/**
 * "The Untangling": a torus knot (complex workflow) with a morph target that is
 * a clean ring (simple experience) built with the exact same vertex layout.
 * Scrolling the hero drives the morph from knot to ring.
 */
function useKnotToRing() {
  return useMemo(() => {
    const geo = new THREE.TorusKnotGeometry(1, TUBE, TUBULAR, RADIAL, 2, 3);
    const ringPos: number[] = [];
    const ringNor: number[] = [];
    const R = 1.25;
    const tube = TUBE;
    const P1 = new THREE.Vector3();
    const P2 = new THREE.Vector3();
    const T = new THREE.Vector3();
    const N = new THREE.Vector3();
    const B = new THREE.Vector3();
    const v3 = new THREE.Vector3();
    // Mirrors TorusKnotGeometry's loop (same i/j order) but walks a circle.
    for (let i = 0; i <= TUBULAR; i++) {
      const a = (i / TUBULAR) * Math.PI * 2;
      P1.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      P2.set(Math.cos(a + 0.01) * R, Math.sin(a + 0.01) * R, 0);
      T.subVectors(P2, P1);
      N.addVectors(P2, P1);
      B.crossVectors(T, N);
      N.crossVectors(B, T);
      B.normalize();
      N.normalize();
      for (let j = 0; j <= RADIAL; j++) {
        const v = (j / RADIAL) * Math.PI * 2;
        const cx = -tube * Math.cos(v);
        const cy = tube * Math.sin(v);
        v3.set(P1.x + cx * N.x + cy * B.x, P1.y + cx * N.y + cy * B.y, P1.z + cx * N.z + cy * B.z);
        ringPos.push(v3.x, v3.y, v3.z);
        v3.sub(P1).normalize();
        ringNor.push(v3.x, v3.y, v3.z);
      }
    }
    geo.morphAttributes.position = [new THREE.Float32BufferAttribute(ringPos, 3)];
    geo.morphAttributes.normal = [new THREE.Float32BufferAttribute(ringNor, 3)];
    return geo;
  }, []);
}

/** Converts the anchor's on-screen box into world units every frame. */
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
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.7}>
      {children}
    </Float>
  );
}

const BAR_HEIGHTS = [0.45, 0.8, 0.6, 1.05];
const BAR_COLORS = ['#0f7f6c', '#17a88f', TEAL, CORAL];

/** Mini dashboard bar chart. */
function BarChart({ still }: { still: boolean }) {
  const bars = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (still || !bars.current) return;
    bars.current.children.forEach((b, i) => {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4 + i) * 0.12;
      b.scale.y = s;
      b.position.y = (BAR_HEIGHTS[i] * s) / 2 + 0.04;
    });
  });
  return (
    <group rotation={[0.25, 0.5, 0]}>
      <RoundedBox args={[1.3, 0.08, 0.55]} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial color="#eaf6f2" roughness={0.2} transmission={0.6} thickness={0.5} clearcoat={1} />
      </RoundedBox>
      <group ref={bars} position={[-0.42, 0, 0]}>
        {BAR_HEIGHTS.map((h, i) => (
          <RoundedBox key={i} args={[0.2, h, 0.2]} radius={0.06} smoothness={4} position={[i * 0.28, h / 2 + 0.04, 0]}>
            <meshPhysicalMaterial color={BAR_COLORS[i]} roughness={0.25} clearcoat={1} />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

/** A toggle switch that flips on and off. */
function Toggle({ still }: { still: boolean }) {
  const knob = useRef<THREE.Mesh>(null);
  const track = useRef<THREE.MeshPhysicalMaterial>(null);
  const off = useMemo(() => new THREE.Color('#5d7570'), []);
  const on = useMemo(() => new THREE.Color(CORAL), []);
  useFrame((state, delta) => {
    const isOn = still || Math.sin(state.clock.elapsedTime * 1.2) > 0;
    if (!knob.current) return;
    knob.current.position.x = THREE.MathUtils.damp(knob.current.position.x, isOn ? 0.25 : -0.25, 8, delta);
    track.current?.color.lerpColors(off, on, THREE.MathUtils.clamp(knob.current.position.x / 0.5 + 0.5, 0, 1));
  });
  return (
    <group rotation={[0.2, -0.4, 0.05]}>
      <RoundedBox args={[1, 0.5, 0.28]} radius={0.24} smoothness={6}>
        <meshPhysicalMaterial ref={track} color={CORAL} roughness={0.25} clearcoat={1} />
      </RoundedBox>
      <mesh ref={knob} position={[0.25, 0, 0.12]}>
        <sphereGeometry args={[0.19, 32, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} />
      </mesh>
    </group>
  );
}

/** A mouse pointer that "clicks". */
function Cursor({ still }: { still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, -1);
    s.lineTo(0.27, -0.76);
    s.lineTo(0.46, -1.16);
    s.lineTo(0.61, -1.09);
    s.lineTo(0.42, -0.7);
    s.lineTo(0.76, -0.7);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.035, bevelSegments: 4 });
    g.center();
    return g;
  }, []);
  useFrame((state) => {
    if (still || !ref.current) return;
    const k = (state.clock.elapsedTime * 0.9) % 2;
    ref.current.scale.setScalar(k > 1.8 ? 0.88 : 1); // a quick "click"
  });
  return (
    <group ref={ref} rotation={[0.1, -0.3, 0.25]}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Scene({ anchor, reduceMotion }: Pick<Props, 'anchor' | 'reduceMotion'>) {
  const box = useAnchorBox(anchor);
  const knotGeo = useKnotToRing();
  const narrow = useThree((s) => s.size.width < 768);
  const rig = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const chart = useRef<THREE.Group>(null);
  const toggle = useRef<THREE.Group>(null);
  const cursor = useRef<THREE.Group>(null);
  const morph = useRef(0);

  useLayoutEffect(() => knot.current?.updateMorphTargets(), []);

  useFrame((state, delta) => {
    const { x, y, w, h } = box.current;

    // Scrolling through the hero untangles the knot into a ring.
    const target = reduceMotion ? 0 : THREE.MathUtils.smoothstep(window.scrollY / (window.innerHeight * 0.35), 0, 1);
    morph.current = THREE.MathUtils.damp(morph.current, target, 4, delta);
    const m = morph.current;

    if (rig.current) {
      rig.current.position.set(x, y, 0);
      if (!reduceMotion) {
        rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, state.pointer.x * 0.18, 3, delta);
        rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -state.pointer.y * 0.12, 3, delta);
      }
    }

    const k = knot.current;
    if (k) {
      if (k.morphTargetInfluences) k.morphTargetInfluences[0] = m;
      // Tilted like a planetary ring around the card: tangled loops cross on both
      // sides of the photo, and the untangled ring reads as a clean orbit.
      k.position.set(w * (narrow ? 0.04 : 0.16), -h * 0.02, -1.6);
      k.scale.setScalar(w * (narrow ? 0.5 : 0.68));
      k.rotation.x = 1.12 + (reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.4) * 0.06 * (1 - m));
      k.rotation.y = -0.18 * (1 - m);
      if (!reduceMotion) k.rotation.z += delta * (0.12 + 0.22 * (1 - m));
    }

    // UI objects sit in the free space around the card, clear of the headline.
    chart.current?.position.set(-w * 0.36, h * 0.62, 0.6);
    chart.current?.scale.setScalar(w * 0.15);
    toggle.current?.position.set(w * 0.4, -h * 0.63, 0.4);
    toggle.current?.scale.setScalar(w * 0.13);
    cursor.current?.position.set(w * (narrow ? 0.42 : -0.6), -h * (narrow ? 0.5 : 0.6), 0.9);
    cursor.current?.scale.setScalar(w * (narrow ? 0.1 : 0.12));
  });

  return (
    <group ref={rig}>
      <mesh ref={knot} geometry={knotGeo}>
        <meshPhysicalMaterial
          color={TEAL}
          roughness={0.12}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[200, 600]}
          transmission={0.35}
          thickness={1.2}
          ior={1.4}
          emissive="#0a5c50"
          emissiveIntensity={0.25}
        />
      </mesh>
      {!narrow && (
        <>
          <group ref={chart}>
            <Floaty still={reduceMotion}>
              <BarChart still={reduceMotion} />
            </Floaty>
          </group>
          <group ref={toggle}>
            <Floaty still={reduceMotion} speed={1.1}>
              <Toggle still={reduceMotion} />
            </Floaty>
          </group>
        </>
      )}
      <group ref={cursor}>
        <Floaty still={reduceMotion} speed={1.6}>
          <Cursor still={reduceMotion} />
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
