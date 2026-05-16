"use client";

import { motion } from "framer-motion";

/**
 * BDO Mascot — "Cakey" 🎂
 * A friendly birthday cake character that IS the brand.
 * The cake body = brand pink, candle flame = gold, face = cute.
 * Used on hero, 404, loading states, and social sharing assets.
 */

interface BdoCakeProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function BdoCake({ size = 180, animate = true, className = "" }: BdoCakeProps) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { y: 0 },
        animate: { y: [-4, 4, -4] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className={`inline-block select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BDO 生日蛋糕吉祥物"
      >
        {/* ── Confetti dots (background) ─────────────────── */}
        <circle cx="30"  cy="40"  r="5" fill="#fcd34d" opacity="0.7" />
        <circle cx="170" cy="55"  r="4" fill="#fda4b5" opacity="0.8" />
        <circle cx="20"  cy="140" r="3" fill="#f43f6e" opacity="0.5" />
        <circle cx="175" cy="150" r="5" fill="#fbbf24" opacity="0.6" />
        <circle cx="155" cy="30"  r="3" fill="#fda4b5" opacity="0.7" />
        <circle cx="45"  cy="170" r="4" fill="#fcd34d" opacity="0.6" />

        {/* ── Candle ─────────────────────────────────────── */}
        <rect x="93" y="52" width="14" height="32" rx="4" fill="#fda4b5" />
        {/* candle stripe */}
        <rect x="93" y="60" width="14" height="4" rx="1" fill="#f43f6e" opacity="0.5" />
        <rect x="93" y="72" width="14" height="4" rx="1" fill="#f43f6e" opacity="0.5" />

        {/* ── Flame (animated) ───────────────────────────── */}
        {animate ? (
          <motion.g
            animate={{ scaleY: [1, 1.15, 0.9, 1], scaleX: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 48px" }}
          >
            <ellipse cx="100" cy="46" rx="7" ry="10" fill="#fbbf24" />
            <ellipse cx="100" cy="48" rx="4" ry="6"  fill="#f59e0b" />
            <ellipse cx="100" cy="50" rx="2" ry="3"  fill="#ef4444" opacity="0.7" />
          </motion.g>
        ) : (
          <g>
            <ellipse cx="100" cy="46" rx="7" ry="10" fill="#fbbf24" />
            <ellipse cx="100" cy="48" rx="4" ry="6"  fill="#f59e0b" />
            <ellipse cx="100" cy="50" rx="2" ry="3"  fill="#ef4444" opacity="0.7" />
          </g>
        )}

        {/* ── Cake top layer (cream) ─────────────────────── */}
        <rect x="50" y="82" width="100" height="26" rx="10" fill="#fff" />
        {/* cream drip waves */}
        <path
          d="M50 96 Q60 108 70 96 Q80 108 90 96 Q100 108 110 96 Q120 108 130 96 Q140 108 150 96"
          stroke="#fda4b5"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* ── Cake body (main pink) ──────────────────────── */}
        <rect x="48" y="106" width="104" height="52" rx="12" fill="#f43f6e" />
        {/* body detail stripe */}
        <rect x="48" y="120" width="104" height="8" fill="#e11d55" opacity="0.3" />
        {/* sprinkles on cake body */}
        <rect x="65"  y="112" width="8" height="3" rx="1.5" fill="#fcd34d" transform="rotate(-20 65 112)" />
        <rect x="90"  y="126" width="8" height="3" rx="1.5" fill="#fff"    transform="rotate(15 90 126)" />
        <rect x="118" y="113" width="8" height="3" rx="1.5" fill="#fcd34d" transform="rotate(-10 118 113)" />
        <rect x="75"  y="138" width="8" height="3" rx="1.5" fill="#fbbf24" transform="rotate(25 75 138)" />
        <rect x="130" y="135" width="8" height="3" rx="1.5" fill="#fff"    transform="rotate(-15 130 135)" />

        {/* ── Cake base plate ────────────────────────────── */}
        <rect x="40" y="154" width="120" height="14" rx="7" fill="#fda4b5" />
        <rect x="36" y="162" width="128" height="6"  rx="3" fill="#fb7093" opacity="0.5" />

        {/* ── Cute face ──────────────────────────────────── */}
        {/* Eyes */}
        <ellipse cx="86"  cy="131" rx="5" ry="6" fill="#1a0a14" />
        <ellipse cx="114" cy="131" rx="5" ry="6" fill="#1a0a14" />
        {/* Eye shine */}
        <circle cx="88"  cy="129" r="2" fill="white" />
        <circle cx="116" cy="129" r="2" fill="white" />
        {/* Smile */}
        <path
          d="M90 142 Q100 150 110 142"
          stroke="#1a0a14"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Rosy cheeks */}
        <ellipse cx="78"  cy="140" rx="6" ry="4" fill="#fda4b5" opacity="0.6" />
        <ellipse cx="122" cy="140" rx="6" ry="4" fill="#fda4b5" opacity="0.6" />
      </svg>
    </Wrapper>
  );
}
