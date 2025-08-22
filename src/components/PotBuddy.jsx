// src/components/PotBuddy.jsx
import { useEffect, useMemo, useState } from "react";

export default function PotBuddy({
  size = 260,
  mood = "happy",
  speak = "",            // ak má niečo povedať, pošli reťazec
}) {
  const [blinking, setBlinking] = useState(false);
  const [talking, setTalking] = useState(false);

  // žmurkanie
  useEffect(() => {
    let t;
    const loop = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 120);
      t = setTimeout(loop, 2200 + Math.random() * 1800);
    };
    t = setTimeout(loop, 1200);
    return () => clearTimeout(t);
  }, []);

  // „rozprávanie“ – podľa dĺžky textu
  useEffect(() => {
    if (!speak) return;
    setTalking(true);
    const dur = Math.min(3500, 500 + speak.length * 70);
    const t = setTimeout(() => setTalking(false), dur);
    return () => clearTimeout(t);
  }, [speak]);

  const eyeY = blinking ? 6 : 0;          // padne viečko
  const mouthH = talking ? 14 : 4;        // otvorí sa ústa

  return (
    <div style={{ position: "absolute", inset: "auto 0 0 0", height: size }}>
      <svg viewBox="0 0 400 260" width="100%" height="100%">
        {/* črepník – trochu vyšší */}
        <defs>
          <radialGradient id="sh" cx="50%" cy="10%" r="80%">
            <stop offset="0" stopColor="#9c5a2d" stopOpacity="0.35" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="240" rx="120" ry="18" fill="url(#sh)" />

        <path
          d="M40 40 h320 l-36 180 a32 32 0 0 1-32 24 H108 a32 32 0 0 1-32-24 Z"
          fill="#8a4f26"
        />
        <path
          d="M40 40c20 22 360 22 320 0 0 0-18-30-160-30S40 40 40 40Z"
          fill="#a15a2c"
        />

        {/* oči */}
        <g transform="translate(110,150)">
          <g transform={`translate(0,${eyeY})`}>
            <circle cx="0" cy="0" r="26" fill="#fff" />
            <circle cx="0" cy="0" r="12" fill="#222" />
          </g>
          <g transform={`translate(180,${eyeY})`}>
            <circle cx="0" cy="0" r="26" fill="#fff" />
            <circle cx="0" cy="0" r="12" fill="#222" />
          </g>
        </g>

        {/* ústa */}
        <path
          d={`M135 ${190} q65 ${mouthH} 130 0`}
          fill="none"
          stroke="#111"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {talking && (
          <path d={`M200 ${196 + mouthH / 2} q16 10 32 0`} fill="#f25" />
        )}
      </svg>
    </div>
  );
      }
