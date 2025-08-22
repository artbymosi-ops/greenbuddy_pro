import { useEffect, useMemo } from "react";

/**
 * Milý kvetináč s očami, úsmevom a žmurkaním.
 * props: size, mood: "happy" | "sad" | "speaking"
 */
export default function PotBuddy({ size = 240, mood = "happy" }) {
  const eyeY = mood === "sad" ? 2 : 0;
  const mouthCurve = mood === "sad" ? -10 : 14;
  const mouthOpen = mood === "speaking" ? 10 : 4;

  // drobné náhodné hýbanie zreničiek
  const pupils = useMemo(
    () => ({
      left:  { x: Math.random() * 3 - 1.5, y: Math.random() * 2 - 1 },
      right: { x: Math.random() * 3 - 1.5, y: Math.random() * 2 - 1 },
    }),
    [mood]
  );

  return (
    <div style={{ width: size, height: size, position: "relative", margin: "0 auto" }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* tieň */}
        <ellipse cx="100" cy="186" rx="56" ry="10" fill="#d7e6d7"/>

        {/* črepník (trapez) */}
        <path
          d="M35 70 L165 70 L150 175 Q100 185 50 175 Z"
          fill="#8d5126"
        />
        {/* horný okraj */}
        <ellipse cx="100" cy="70" rx="70" ry="16" fill="#a76433"/>

        {/* zemina */}
        <ellipse cx="100" cy="74" rx="62" ry="12" fill="#5b3d26"/>

        {/* oči */}
        <g>
          <circle cx="70" cy={120 + eyeY} r="16" fill="#fff"/>
          <circle cx="130" cy={120 + eyeY} r="16" fill="#fff"/>
          <circle cx={70 + pupils.left.x}  cy={120 + eyeY + pupils.left.y}  r="7" fill="#121212"/>
          <circle cx={130 + pupils.right.x} cy={120 + eyeY + pupils.right.y} r="7" fill="#121212"/>
          {/* viečka na žmurkanie */}
          <rect className="lid" x="54" y="104" width="32" height="32" fill="#8d5126" rx="16"/>
          <rect className="lid" x="114" y="104" width="32" height="32" fill="#8d5126" rx="16"/>
        </g>

        {/* úsmev */}
        <path
          d={`M70 150 Q100 ${150 + mouthCurve} 130 150`}
          stroke="#111" strokeWidth="6" fill="none" strokeLinecap="round"
        />
        {/* jazyk keď „rozpráva“ */}
        {mood === "speaking" && (
          <path d={`M93 ${150 - mouthOpen/2} q7 ${mouthOpen} 14 0`} fill="#e84e5b"/>
        )}
      </svg>

      <style jsx>{`
        .lid {
          animation: blink 4.5s infinite;
          transform-origin: center top;
          opacity: 0; /* skryté, len počas žmurknutia viditeľné */
        }
        @keyframes blink {
          0%, 92%, 100% { opacity: 0; transform: scaleY(0.0); }
          93%, 95%      { opacity: 1; transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  );
}
