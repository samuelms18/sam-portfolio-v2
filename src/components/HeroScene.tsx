'use client';

import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { makeScreenTexture, SCREEN_ASPECT, type ScreenKind } from '@/lib/screenTextures';

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

type V3 = [number, number, number];
type Slot = {
  kind: ScreenKind;
  /** Width as a fraction of the photo card's width. */
  size: number;
  /** Loose, layered arrangement (top of the page). x/y are fractions of the card's width/height. */
  scatter: { p: V3; r: V3 };
  /** Neatly aligned arrangement (after scrolling). */
  order: V3;
  /** How strongly it follows the pointer (closer = more). */
  depth: number;
  phones?: boolean;
};

// Screens peek out from behind the photo card on every side, clear of the headline.
const SLOTS: Slot[] = [
  { kind: 'dashboard', size: 0.72, scatter: { p: [-0.3, 0.46, -1.5], r: [0.12, 0.38, -0.08] }, order: [-0.34, 0.4, -1], depth: 0.5, phones: true },
  { kind: 'planner', size: 0.62, scatter: { p: [-0.4, -0.5, -0.8], r: [-0.18, 0.32, 0.06] }, order: [-0.34, -0.46, -1], depth: 0.8 },
  { kind: 'mobile', size: 0.28, scatter: { p: [0.68, 0.1, -0.4], r: [-0.06, -0.5, 0.1] }, order: [0.62, 0.04, -1], depth: 1.1, phones: true },
  { kind: 'approval', size: 0.36, scatter: { p: [0.34, 0.6, 0.3], r: [0.14, -0.34, -0.06] }, order: [0.42, 0.62, -1], depth: 1.4 },
  { kind: 'chart', size: 0.32, scatter: { p: [0.56, -0.44, 0.2], r: [-0.12, -0.4, 0.05] }, order: [0.6, -0.42, -1], depth: 1.3 },
];

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

/** A glass device slab with a UI screen on its face (1 unit wide). */
function Screen({ kind, light }: { kind: ScreenKind; light: boolean }) {
  const gl = useThree((s) => s.gl);
  const tex = useMemo(() => makeScreenTexture(kind, light, gl.capabilities.getMaxAnisotropy()), [kind, light, gl]);
  useEffect(() => () => tex.dispose(), [tex]);
  const h = 1 / SCREEN_ASPECT[kind];
  const pad = 0.035;
  const radius = kind === 'mobile' ? 0.08 : 0.04;
  return (
    <group>
      <RoundedBox args={[1 + pad * 2, h + pad * 2, 0.035]} radius={Math.min(radius + 0.01, 0.017)} smoothness={4}>
        <meshPhysicalMaterial
          color={light ? '#ffffff' : '#bfeee4'}
          roughness={0.18}
          metalness={0.1}
          transmission={0.45}
          thickness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={light ? 0.75 : 0.5}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.019]}>
        <planeGeometry args={[1, h]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
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
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.08;
  });
  return (
    <group ref={ref} rotation={[0.1, -0.3, 0.25]}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Scene({ anchor, reduceMotion, lightTheme }: Pick<Props, 'anchor' | 'reduceMotion' | 'lightTheme'>) {
  const box = useAnchorBox(anchor);
  const narrow = useThree((s) => s.size.width < 768);
  const rig = useRef<THREE.Group>(null);
  const screens = useRef<(THREE.Group | null)[]>([]);
  const cursor = useRef<THREE.Group>(null);
  const order = useRef(0);
  const slots = useMemo(() => SLOTS.filter((s) => !narrow || s.phones), [narrow]);

  useFrame((state, delta) => {
    const { x, y, w, h } = box.current;
    const t = state.clock.elapsedTime;

    // Scrolling the hero snaps the loose screens into an aligned layout.
    const target = reduceMotion ? 0 : THREE.MathUtils.smoothstep(window.scrollY / (window.innerHeight * 0.4), 0, 1);
    order.current = THREE.MathUtils.damp(order.current, target, 5, delta);
    const m = order.current;
    const px = reduceMotion ? 0 : state.pointer.x;
    const py = reduceMotion ? 0 : state.pointer.y;

    rig.current?.position.set(x, y, 0);

    slots.forEach((s, i) => {
      const g = screens.current[i];
      if (!g) return;
      const loose = 1 - m;
      const bob = reduceMotion ? 0 : Math.sin(t * 0.8 + i * 1.7) * 0.06 * loose;
      const sx = narrow ? s.scatter.p[0] * 0.7 : s.scatter.p[0];
      const ox = narrow ? s.order[0] * 0.7 : s.order[0];
      g.position.set(
        THREE.MathUtils.lerp(sx, ox, m) * w + px * 0.12 * s.depth,
        THREE.MathUtils.lerp(s.scatter.p[1], s.order[1], m) * h + py * 0.1 * s.depth + bob,
        THREE.MathUtils.lerp(s.scatter.p[2], s.order[2], m)
      );
      g.rotation.set(
        s.scatter.r[0] * loose - py * 0.08 * s.depth * loose,
        s.scatter.r[1] * loose + px * 0.1 * s.depth * loose,
        s.scatter.r[2] * loose
      );
      g.scale.setScalar(w * s.size * (narrow ? 0.85 : 1));
    });

    cursor.current?.position.set(w * (narrow ? 0.4 : -0.58), -h * (narrow ? 0.52 : 0.62), 0.9);
    cursor.current?.scale.setScalar(w * (narrow ? 0.1 : 0.11));
  });

  return (
    <group ref={rig}>
      {slots.map((s, i) => (
        <group
          key={s.kind}
          ref={(el) => {
            screens.current[i] = el;
          }}
        >
          <Screen kind={s.kind} light={lightTheme} />
        </group>
      ))}
      <group ref={cursor}>
        <Cursor still={reduceMotion} />
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
      <Scene anchor={anchor} reduceMotion={reduceMotion} lightTheme={lightTheme} />
    </Canvas>
  );
}
