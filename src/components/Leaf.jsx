// Jednoduchý generátor listov – čím vyšší level, tým „monstera“ s dierami
export default function Leaf({ level=1, side="left", fill="#34a56f" }){
  // základný tvar
  let d = "M120 70 C 90 10, 20 20, 30 70 C 40 110, 95 120, 120 70 Z";
  if(side==="right") d = "M120 70 C 150 10, 220 20, 210 70 C 200 110, 145 120, 120 70 Z";

  // fenestrácie – pre level 3+
  const holes = [];
  if(level >= 3){
    holes.push(<path key="h1" d={side==="left" ? "M78 68 q-14 -10 -10 -26" : "M162 68 q14 -10 10 -26"}
                    stroke="none" fill="#000" opacity=".085"/>);
    holes.push(<path key="h2" d={side==="left" ? "M90 86 q-16 -10 -16 -26" : "M150 86 q16 -10 16 -26"}
                    stroke="none" fill="#000" opacity=".085"/>);
  }
  if(level >= 5){
    holes.push(<path key="h3" d={side==="left" ? "M96 54 q-10 -8 -6 -18" : "M144 54 q10 -8 6 -18"}
                    stroke="none" fill="#000" opacity=".085"/>);
  }

  return (
    <g className="sway slow">
      <path d={d} fill={fill}/>
      {/* „žilky“ */}
      <path d={side==="left"
          ? "M70 60 l15 10 M86 46 l18 14"
          : "M170 60 l-15 10 M154 46 l-18 14"}
        stroke="#2b8d5e" strokeWidth="6" strokeLinecap="round"/>
      {holes}
    </g>
  );
}
