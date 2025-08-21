export function awardCoupon({ tier="10OFF25", percent=10, min=25 }){
  const code = `GB-${tier}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  const entry = { code, percent, min, createdAt: Date.now() };
  try{
    const all = JSON.parse(localStorage.getItem("gb_coupons") || "[]");
    all.push(entry);
    localStorage.setItem("gb_coupons", JSON.stringify(all));
  }catch{}
  return entry;
}
export function listCoupons(){
  try{ return JSON.parse(localStorage.getItem("gb_coupons") || "[]"); }
  catch{ return []; }
}
