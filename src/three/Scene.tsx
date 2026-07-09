import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Group } from 'three'

import { RifleModel } from './RifleModel'
import type { MeshKey } from '../types'

interface SceneProps {
  highlight: MeshKey[]
  configured: MeshKey[]
  showBcg: boolean
}

/** Respect the user's reduced-motion preference (kills the auto-spin). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Gently auto-spins its children while idle; pauses during interaction. */
function SpinRig({
  paused,
  reduced,
  children,
}: {
  paused: { current: boolean }
  reduced: boolean
  children: ReactNode
}) {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (reduced || paused.current || !ref.current) return
    ref.current.rotation.y += delta * 0.25
  })
  return <group ref={ref}>{children}</group>
}

export function Scene({ highlight, configured, showBcg }: SceneProps) {
  const reduced = usePrefersReducedMotion()
  const paused = useRef(false)
  const resumeTimer = useRef<number | null>(null)

  const pause = () => {
    paused.current = true
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
  }
  // Resume the gentle spin after a short idle once the drag ends.
  const scheduleResume = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      paused.current = false
    }, 2500)
  }

  useEffect(() => {
    return () => {
      if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
    }
  }, [])

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [5, 2.6, 7.5], fov: 40 }}
      aria-label="3D schematic of the rifle build. Drag to rotate."
    >
      <color attach="background" args={['#121417']} />
      <fog attach="fog" args={['#121417', 12, 26]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 5]} intensity={1.15} castShadow />
      <directionalLight position={[-7, 3, -4]} intensity={0.4} color="#9fb2c9" />
      <pointLight position={[0, 2, 6]} intensity={0.18} color="#c8963e" />

      <SpinRig paused={paused} reduced={reduced}>
        <RifleModel highlight={highlight} configured={configured} showBcg={showBcg} />
      </SpinRig>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={4.5}
        maxDistance={16}
        target={[0, 0.2, 0]}
        onStart={pause}
        onEnd={scheduleResume}
      />
    </Canvas>
  )
}
