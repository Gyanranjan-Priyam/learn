"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import ReactCanvasConfetti from "react-canvas-confetti"
import type { CreateTypes } from "canvas-confetti"

interface ConfettiBlastProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiBlast({ trigger, onComplete }: ConfettiBlastProps) {
  const refAnimationInstance = useRef<CreateTypes | null>(null)

  const handleInit = useCallback(({ confetti }: { confetti: CreateTypes }) => {
    refAnimationInstance.current = confetti
  }, [])

  useEffect(() => {
    if (trigger && refAnimationInstance.current) {
      const fire = refAnimationInstance.current

      // Fire confetti from left
      fire({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ["#F97316", "#EF4444", "#F59E0B", "#22C55E", "#3B82F6"],
      })

      // Fire confetti from right
      setTimeout(() => {
        fire({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#F97316", "#EF4444", "#F59E0B", "#22C55E", "#3B82F6"],
        })
      }, 200)

      // Fire confetti from center
      setTimeout(() => {
        fire({
          particleCount: 150,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#FFD700", "#FFA500", "#FF6347", "#FF4500", "#DC143C"],
        })
      }, 400)

      // Call onComplete after animation
      setTimeout(() => {
        onComplete?.()
      }, 2000)
    }
  }, [trigger, onComplete])

  return (
    <ReactCanvasConfetti
      onInit={handleInit}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    />
  )
}
