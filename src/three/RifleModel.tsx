import { useMemo } from 'react'
import type { ReactNode } from 'react'

import type { MeshKey } from '../types'

export type OpticStyle = 'reddot' | 'lpvo'

interface RifleModelProps {
  /** Mesh groups to light up in brass (from selection / open category / insight). */
  highlight: MeshKey[]
  /** Mesh groups that have a configured part — get a faint brass tint. */
  configured: MeshKey[]
  /** BCG rides inside the upper — only render it when it's actually selected. */
  showBcg: boolean
  /** Barrel length in inches — drives barrel + muzzle position. */
  barrelIn: number
  /** Handguard rail length in inches — drives handguard reach. */
  handguardIn: number
  /** Optic silhouette to render based on the selected optic. */
  opticStyle: OpticStyle
}

/* machined-steel + brass material states */
type Mat = {
  color: string
  emissive: string
  emissiveIntensity: number
  metalness: number
  roughness: number
}

const STEEL: Mat = {
  color: '#3d434c',
  emissive: '#000000',
  emissiveIntensity: 0,
  metalness: 0.9,
  roughness: 0.52,
}
const TINT: Mat = {
  color: '#47484a',
  emissive: '#c8963e',
  emissiveIntensity: 0.035,
  metalness: 0.85,
  roughness: 0.48,
}
const BRASS: Mat = {
  color: '#e2ad4d',
  emissive: '#c8963e',
  emissiveIntensity: 0.75,
  metalness: 0.55,
  roughness: 0.28,
}

function matFor(key: MeshKey, hi: Set<MeshKey>, cfg: Set<MeshKey>): Mat {
  if (hi.has(key)) return BRASS
  if (cfg.has(key)) return TINT
  return STEEL
}

/** One mesh tied to a mesh group, with the geometry passed as children. */
function Piece({
  meshKey,
  hi,
  cfg,
  position,
  rotation,
  children,
}: {
  meshKey: MeshKey
  hi: Set<MeshKey>
  cfg: Set<MeshKey>
  position: [number, number, number]
  rotation?: [number, number, number]
  children: ReactNode
}) {
  const m = matFor(meshKey, hi, cfg)
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      {children}
      <meshStandardMaterial
        color={m.color}
        emissive={m.emissive}
        emissiveIntensity={m.emissiveIntensity}
        metalness={m.metalness}
        roughness={m.roughness}
      />
    </mesh>
  )
}

const HALF_PI = Math.PI / 2
const IN = 0.19 // 3D units per inch of barrel/handguard
const X0 = 0.05 // chamber: front face of the upper receiver
const BORE_Y = 0.3 // barrel centerline height

/**
 * A blocked-out but recognizably-shaped AR-15 schematic — abstract, not
 * photoreal. Each component group is keyed to a meshKey. Barrel + handguard
 * geometry is parametric: longer parts push the model out further.
 */
export function RifleModel({
  highlight,
  configured,
  showBcg,
  barrelIn,
  handguardIn,
  opticStyle,
}: RifleModelProps) {
  const hi = useMemo(() => new Set(highlight), [highlight])
  const cfg = useMemo(() => new Set(configured), [configured])

  const bl = barrelIn * IN // barrel length in units
  const hl = handguardIn * IN // handguard length in units
  const barrelCenter = X0 + bl / 2
  const muzzleX = X0 + bl + 0.2
  const hgStart = X0 + 0.04
  const hgCenter = hgStart + hl / 2
  const gasBlockX = X0 + bl * 0.52
  const gasTubeRear = -0.35
  const gasTubeCenter = (gasBlockX + gasTubeRear) / 2
  const gasTubeLen = gasBlockX - gasTubeRear

  return (
    <group position={[0, -0.1, 0]}>
      {/* ---------- Stock (buttstock body + comb + buttpad) ---------- */}
      <Piece meshKey="stock" hi={hi} cfg={cfg} position={[-3.0, 0.12, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.5]} />
      </Piece>
      <Piece meshKey="stock" hi={hi} cfg={cfg} position={[-2.82, 0.42, 0]}>
        <boxGeometry args={[0.55, 0.12, 0.32]} />
      </Piece>
      <Piece meshKey="stock" hi={hi} cfg={cfg} position={[-3.38, 0.06, 0]}>
        <boxGeometry args={[0.12, 0.62, 0.5]} />
      </Piece>

      {/* ---------- Buffer tube ---------- */}
      <Piece meshKey="buffer" hi={hi} cfg={cfg} position={[-2.28, 0.16, 0]} rotation={[0, 0, HALF_PI]}>
        <cylinderGeometry args={[0.13, 0.13, 1.05, 20]} />
      </Piece>

      {/* ---------- Lower receiver + magwell ---------- */}
      <Piece meshKey="lower" hi={hi} cfg={cfg} position={[-1.35, 0.0, 0]}>
        <boxGeometry args={[1.1, 0.44, 0.42]} />
      </Piece>
      <Piece meshKey="lower" hi={hi} cfg={cfg} position={[-1.24, -0.42, 0]}>
        <boxGeometry args={[0.44, 0.66, 0.4]} />
      </Piece>
      {/* Magazine (curved-ish, canted forward) */}
      <Piece meshKey="lower" hi={hi} cfg={cfg} position={[-1.18, -1.02, 0]} rotation={[0, 0, -0.14]}>
        <boxGeometry args={[0.34, 0.95, 0.36]} />
      </Piece>

      {/* ---------- Trigger + guard ---------- */}
      <Piece meshKey="trigger" hi={hi} cfg={cfg} position={[-1.5, -0.3, 0]}>
        <boxGeometry args={[0.12, 0.2, 0.2]} />
      </Piece>
      <Piece meshKey="trigger" hi={hi} cfg={cfg} position={[-1.46, -0.46, 0]}>
        <boxGeometry args={[0.38, 0.05, 0.24]} />
      </Piece>

      {/* ---------- Safety selector ---------- */}
      <Piece
        meshKey="selector"
        hi={hi}
        cfg={cfg}
        position={[-1.12, 0.02, 0.24]}
        rotation={[HALF_PI, 0, 0]}
      >
        <cylinderGeometry args={[0.09, 0.09, 0.16, 16]} />
      </Piece>

      {/* ---------- Pistol grip (body + backstrap) ---------- */}
      <Piece meshKey="grip" hi={hi} cfg={cfg} position={[-1.72, -0.44, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.24, 0.6, 0.34]} />
      </Piece>
      <Piece meshKey="grip" hi={hi} cfg={cfg} position={[-1.82, -0.5, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.1, 0.52, 0.34]} />
      </Piece>

      {/* ---------- Upper receiver + ejection port + forward assist + top rail ---------- */}
      <Piece meshKey="upper" hi={hi} cfg={cfg} position={[-0.55, 0.3, 0]}>
        <boxGeometry args={[1.25, 0.42, 0.44]} />
      </Piece>
      <Piece meshKey="upper" hi={hi} cfg={cfg} position={[-0.4, 0.33, 0.24]}>
        <boxGeometry args={[0.42, 0.16, 0.05]} />
      </Piece>
      <Piece meshKey="upper" hi={hi} cfg={cfg} position={[0.02, 0.34, 0.18]}>
        <boxGeometry args={[0.1, 0.12, 0.12]} />
      </Piece>
      <Piece meshKey="upper" hi={hi} cfg={cfg} position={[-0.55, 0.54, 0]}>
        <boxGeometry args={[1.15, 0.05, 0.16]} />
      </Piece>

      {/* ---------- BCG (inside the upper; only when selected) ---------- */}
      {showBcg && (
        <Piece meshKey="bcg" hi={hi} cfg={cfg} position={[-0.55, 0.3, 0]}>
          <boxGeometry args={[0.98, 0.2, 0.2]} />
        </Piece>
      )}

      {/* ---------- Charging handle (T at the rear of the upper) ---------- */}
      <Piece meshKey="chargingHandle" hi={hi} cfg={cfg} position={[-1.02, 0.5, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.16]} />
      </Piece>
      <Piece meshKey="chargingHandle" hi={hi} cfg={cfg} position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.28]} />
      </Piece>

      {/* ---------- Optic (style depends on the selected optic) ---------- */}
      <Optic style={opticStyle} hi={hi} cfg={cfg} />

      {/* ---------- Handguard (hex M-LOK tube + top rail), parametric length ---------- */}
      <Piece
        meshKey="handguard"
        hi={hi}
        cfg={cfg}
        position={[hgCenter, BORE_Y, 0]}
        rotation={[HALF_PI, 0, 0]}
      >
        <cylinderGeometry args={[0.2, 0.2, hl, 6]} />
      </Piece>
      <Piece meshKey="handguard" hi={hi} cfg={cfg} position={[hgCenter, BORE_Y + 0.2, 0]}>
        <boxGeometry args={[hl * 0.94, 0.05, 0.14]} />
      </Piece>

      {/* ---------- Barrel + gas block + gas tube, parametric length ---------- */}
      <Piece
        meshKey="barrel"
        hi={hi}
        cfg={cfg}
        position={[barrelCenter, BORE_Y, 0]}
        rotation={[0, 0, HALF_PI]}
      >
        <cylinderGeometry args={[0.07, 0.07, bl, 20]} />
      </Piece>
      <Piece meshKey="barrel" hi={hi} cfg={cfg} position={[gasBlockX, BORE_Y + 0.14, 0]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
      </Piece>
      <Piece
        meshKey="barrel"
        hi={hi}
        cfg={cfg}
        position={[gasTubeCenter, BORE_Y + 0.17, 0]}
        rotation={[0, 0, HALF_PI]}
      >
        <cylinderGeometry args={[0.02, 0.02, gasTubeLen, 10]} />
      </Piece>

      {/* ---------- Muzzle device (brake body + port slots) ---------- */}
      <Piece
        meshKey="muzzle"
        hi={hi}
        cfg={cfg}
        position={[muzzleX, BORE_Y, 0]}
        rotation={[0, 0, HALF_PI]}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.4, 18]} />
      </Piece>
      <Piece meshKey="muzzle" hi={hi} cfg={cfg} position={[muzzleX - 0.06, BORE_Y + 0.05, 0]}>
        <boxGeometry args={[0.03, 0.16, 0.16]} />
      </Piece>
      <Piece meshKey="muzzle" hi={hi} cfg={cfg} position={[muzzleX + 0.06, BORE_Y + 0.05, 0]}>
        <boxGeometry args={[0.03, 0.16, 0.16]} />
      </Piece>
    </group>
  )
}

/** Optic silhouette: a compact red dot, or a longer LPVO with turret + bells. */
function Optic({
  style,
  hi,
  cfg,
}: {
  style: OpticStyle
  hi: Set<MeshKey>
  cfg: Set<MeshKey>
}) {
  const OPTIC_Y = 0.68
  if (style === 'lpvo') {
    return (
      <>
        {/* main tube */}
        <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.5, OPTIC_Y, 0]} rotation={[0, 0, HALF_PI]}>
          <cylinderGeometry args={[0.09, 0.09, 0.9, 20]} />
        </Piece>
        {/* ocular + objective bells */}
        <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.95, OPTIC_Y, 0]} rotation={[0, 0, HALF_PI]}>
          <cylinderGeometry args={[0.12, 0.1, 0.14, 20]} />
        </Piece>
        <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.05, OPTIC_Y, 0]} rotation={[0, 0, HALF_PI]}>
          <cylinderGeometry args={[0.1, 0.12, 0.14, 20]} />
        </Piece>
        {/* elevation turret */}
        <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.5, OPTIC_Y + 0.14, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        </Piece>
        {/* rings */}
        <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.78, OPTIC_Y - 0.08, 0]}>
          <boxGeometry args={[0.08, 0.2, 0.16]} />
        </Piece>
        <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.22, OPTIC_Y - 0.08, 0]}>
          <boxGeometry args={[0.08, 0.2, 0.16]} />
        </Piece>
      </>
    )
  }
  // red dot: riser + short tube + hood
  return (
    <>
      <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.5, 0.58, 0]}>
        <boxGeometry args={[0.34, 0.14, 0.2]} />
      </Piece>
      <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.5, 0.72, 0]} rotation={[0, 0, HALF_PI]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 20]} />
      </Piece>
    </>
  )
}
