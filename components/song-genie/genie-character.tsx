"use client"

import Image from "next/image"
import type { GenieState } from "./types"

interface GenieCharacterProps {
  state: GenieState
}

export function GenieCharacter({ state }: GenieCharacterProps) {
  const isThinking = state === "thinking"
  const isYes = state === "yes"
  const isNo = state === "no"
  const isUnsure = state === "unsure"

  const glowColor = isYes
    ? "rgba(34, 197, 94, 0.5)"
    : isNo
    ? "rgba(239, 68, 68, 0.5)"
    : isUnsure
    ? "rgba(245, 158, 11, 0.5)"
    : "rgba(139, 92, 246, 0.45)"

  const borderGlow = isYes
    ? "rgba(34, 197, 94, 0.7)"
    : isNo
    ? "rgba(239, 68, 68, 0.7)"
    : isUnsure
    ? "rgba(245, 158, 11, 0.7)"
    : "rgba(139, 92, 246, 0.6)"

  const auraColor = isYes
    ? "#22c55e"
    : isNo
    ? "#ef4444"
    : isUnsure
    ? "#f59e0b"
    : "#8b5cf6"

  return (
    <div
      className={`relative flex items-center justify-center ${
        isUnsure ? "animate-genie-wobble" : "animate-genie-float"
      }`}
      style={{
        animationDuration: isThinking ? "2s" : "4s",
      }}
    >
      {/* Outer aura */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: "340px",
          height: "380px",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Inner aura */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: "220px",
          height: "260px",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 50%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Portrait */}
      <div
        className="relative z-10 overflow-hidden"
        style={{
          width: "240px",
          height: "300px",
          borderRadius: "30% 30% 50% 50% / 20% 20% 40% 40%",
          border: `2px solid ${borderGlow}`,
          boxShadow: `
            0 0 30px 8px ${glowColor},
            inset 0 0 40px 5px rgba(0, 0, 0, 0.5)
          `,
          maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 55%, transparent 100%)",
        }}
      >
        <Image
          src="/genie-face.jpg"
          alt="Mystical genie oracle"
          width={240}
          height={300}
          className="object-cover object-top"
          style={{
            filter: isThinking
              ? "brightness(0.7) saturate(1.4)"
              : isYes
              ? "brightness(1.15)"
              : isNo
              ? "brightness(0.85)"
              : isUnsure
              ? "brightness(1.05)"
              : "brightness(1)",
          }}
          priority
        />

        {isThinking && (
          <div
            className="absolute inset-0 animate-pulse-glow"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, transparent 30%, rgba(88, 28, 175, 0.35) 100%)",
            }}
          />
        )}
      </div>

      {/* Stable spark particles (no randomness in render) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-drift"
          style={{
            width: "3px",
            height: "3px",
            backgroundColor: auraColor,
            opacity: 0.4,
            top: `${15 + i * 8}%`,
            left: `${10 + i * 9}%`,
          }}
        />
      ))}

      {/* Side orbs */}
      <div
        className="absolute z-20 rounded-full animate-pulse-glow"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: auraColor,
          left: "-10px",
          top: "50%",
          boxShadow: `0 0 12px 4px ${glowColor}`,
        }}
      />
      <div
        className="absolute z-20 rounded-full animate-pulse-glow"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: auraColor,
          right: "-10px",
          top: "50%",
          boxShadow: `0 0 12px 4px ${glowColor}`,
        }}
      />
    </div>
  )
}
