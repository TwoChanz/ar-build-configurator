import { useMemo } from 'react'
import type { ReactNode } from 'react'

import type { MeshKey } from '../types'

interface RifleModelProps {
  /** Mesh groups to light up in brass (from selection / open category / insight). */
  highlight: MeshKey[]
  /** Mesh groups that have a configured part — get a faint brass tint. */
  configured: MeshKey[]
  /** BCG rides inside the upper — only render it when it's actually selected. */
  showBcg: boolean
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
  // Configured parts: cool steel with just a faint warm lean — NOT full brass.
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
    <mesh position={position} rotation={rotation} castShadow>
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

/**
 * A blocked-out AR-15 schematic — abstract "where does each part go", not a
 * dimensioned or photoreal model. Each component group is keyed to a meshKey.
 */
export function RifleModel({ highlight, configured, showBcg }: RifleModelProps) {
  const hi = useMemo(() => new Set(highlight), [highlight])
  const cfg = useMemo(() => new Set(configured), [configured])

  return (
    <group position={[0, 0, 0]}>
      {/* Stock */}
      <Piece meshKey="stock" hi={hi} cfg={cfg} position={[-3.05, 0.06, 0]}>
        <boxGeometry args={[1.05, 0.58, 0.5]} />
      </Piece>

      {/* Buffer tube (buffer system) */}
      <Piece meshKey="buffer" hi={hi} cfg={cfg} position={[-2.25, 0.12, 0]} rotation={[0, 0, HALF_PI]}>
        <cylinderGeometry args={[0.15, 0.15, 1.05, 20]} />
      </Piece>

      {/* Lower receiver + magwell (same group) */}
      <Piece meshKey="lower" hi={hi} cfg={cfg} position={[-1.35, 0.0, 0]}>
        <boxGeometry args={[1.05, 0.44, 0.42]} />
      </Piece>
      <Piece meshKey="lower" hi={hi} cfg={cfg} position={[-1.28, -0.5, 0]}>
        <boxGeometry args={[0.4, 0.72, 0.4]} />
      </Piece>

      {/* Trigger */}
      <Piece meshKey="trigger" hi={hi} cfg={cfg} position={[-1.5, -0.34, 0]}>
        <boxGeometry args={[0.14, 0.2, 0.22]} />
      </Piece>

      {/* Safety selector (side of lower) */}
      <Piece
        meshKey="selector"
        hi={hi}
        cfg={cfg}
        position={[-1.15, 0.02, 0.24]}
        rotation={[HALF_PI, 0, 0]}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.16, 16]} />
      </Piece>

      {/* Pistol grip */}
      <Piece
        meshKey="grip"
        hi={hi}
        cfg={cfg}
        position={[-1.72, -0.5, 0]}
        rotation={[0, 0, 0.42]}
      >
        <boxGeometry args={[0.24, 0.66, 0.36]} />
      </Piece>

      {/* Upper receiver */}
      <Piece meshKey="upper" hi={hi} cfg={cfg} position={[-0.55, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.42, 0.44]} />
      </Piece>

      {/* Bolt carrier group — only shown when selected, nested inside the upper */}
      {showBcg && (
        <Piece meshKey="bcg" hi={hi} cfg={cfg} position={[-0.55, 0.3, 0]}>
          <boxGeometry args={[0.9, 0.22, 0.22]} />
        </Piece>
      )}

      {/* Charging handle (rear top of upper) */}
      <Piece meshKey="chargingHandle" hi={hi} cfg={cfg} position={[-1.05, 0.46, 0]}>
        <boxGeometry args={[0.32, 0.1, 0.26]} />
      </Piece>

      {/* Optic + mount (top rail) */}
      <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.5, 0.64, 0]}>
        <boxGeometry args={[0.62, 0.26, 0.3]} />
      </Piece>
      <Piece meshKey="optic" hi={hi} cfg={cfg} position={[-0.5, 0.52, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.18]} />
      </Piece>

      {/* Handguard (hex tube around the barrel) */}
      <Piece
        meshKey="handguard"
        hi={hi}
        cfg={cfg}
        position={[0.85, 0.3, 0]}
        rotation={[0, 0, HALF_PI]}
      >
        <cylinderGeometry args={[0.22, 0.22, 1.7, 6]} />
      </Piece>

      {/* Barrel (runs through the handguard, out the front) */}
      <Piece
        meshKey="barrel"
        hi={hi}
        cfg={cfg}
        position={[1.35, 0.3, 0]}
        rotation={[0, 0, HALF_PI]}
      >
        <cylinderGeometry args={[0.08, 0.08, 3.4, 20]} />
      </Piece>

      {/* Muzzle device */}
      <Piece
        meshKey="muzzle"
        hi={hi}
        cfg={cfg}
        position={[3.0, 0.3, 0]}
        rotation={[0, 0, HALF_PI]}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.4, 18]} />
      </Piece>
    </group>
  )
}
