import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

export default function Plant({ state, onPulse=false }) {
  // state: {level, mood, hydration, nutrients, spray, size}
  const color = state.mood==='sad' ? '#84cc16' : '#22c55e';
  const face = state.mood==='sad' ? 'M12 18 q8 6 16 0' : 'M12 22 q8 -6 16 0';
  const size = 0.9 + (state.size ?? 0) * 0.12; // rast s levelom

  const pot = useMemo(()=>(
    <motion.path d="M4 44 h56 a6 6 0 0 1 6 6 v6 a14 14 0 0 1 -14 14 h-40 a14 14 0 0 1 -14 -14 v-6 a6 6 0 0 1 6 -6 z"
      fill="#5b3b2e" initial={false}/>
  ),[]);

  return (
    <div style={{display:'grid',placeItems:'center'}}>
      <motion.svg width="320" height="260" viewBox="0 0 80 60"
        initial={{scale:0.9, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{type:'spring', stiffness:120, damping:12}}>
        {/* tieň */}
        <motion.ellipse cx="40" cy="52" rx="22" ry="4" fill="rgba(0,0,0,.25)" />
        {/* kvetináč */}
        {pot}
        {/* stonka */}
        <motion.rect x="38" y="18" width="4" height="24" rx="2" fill="#15803d"
          animate={onPulse?{scaleY:[1,1.1,1]}:{}} transition={{duration:.35}}/>
        {/* listy */}
        <AnimatePresence>
          <motion.path
            key={`leaf-L-${state.level}`}
            d="M30 20 q-12 8 0 16 q14 -4 10 -14 q-6 -8 -10 -2 z"
            fill={color}
            initial={{scale:.8, opacity:.0, rotate:-12, transformOrigin:'40% 40%'}}
            animate={{scale:1, opacity:1, rotate:0}}
            exit={{opacity:0}}
            transition={{type:'spring', stiffness:130, damping:10}}
          />
        </AnimatePresence>
        <motion.path d="M50 18 q14 6 8 18 q-14 2 -16 -8 q2 -10 8 -10 z"
          fill={color}
          animate={onPulse?{scale:[1,1.06,1]}:{}}
          transition={{duration:.35}} />
        {/* tvárička */}
        <motion.circle cx="34" cy="40" r="1.2" fill="#0b0b0b"/>
        <motion.circle cx="46" cy="40" r="1.2" fill="#0b0b0b"/>
        <motion.path d={face} stroke="#0b0b0b" strokeWidth="1.5" fill="none" />
      </motion.svg>
    </div>
  );
}
