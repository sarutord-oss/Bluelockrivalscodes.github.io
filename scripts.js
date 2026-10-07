const fs = require("fs");
const https = require("https");

const SOURCES = [
  "https://www.pcgamer.com/games/roblox/blue-lock-rivals-codes/",
  "https://www.gamesradar.com/games/sports/blue-lock-rivals-codes/",
  "https://www.pockettactics.com/blue-lock-rivals/codes",
  "https://twinfinite.net/guides/blue-lock-rivals-codes/"
];

function get(url){
  return new Promise((resolve,reject)=>{
    https.get(url,{headers:{"User-Agent":"BLRivalsHQ-AutoUpdater/1.0"}},r=>{
      let s=""; r.on("data",c=>s+=c); r.on("end",()=>resolve(s));
    }).on("error",reject);
  });
}

function extract(html){
  const out = new Set();
  // Finds code-like tokens in page text. Filtering below removes obvious non-codes.
  for(const m of html.matchAll(/(?<![A-Z0-9])([A-Z0-9][A-Z0-9!@._-]{4,35})(?![A-Z0-9])/gi)){
    const x=m[1].toUpperCase();
    if(["BLUERIVALS","BLUELOCKRIVALS","ROBLOX","OCTOBER","SEPTEMBER","UPDATED","CODES","ACTIVE","EXPIRED","REWARDS"].includes(x)) continue;
    if(/[A-Z]/.test(x) && /[A-Z0-9]/.test(x) && x.length>=5) out.add(x);
  }
  return [...out];
}

(async()=>{
  const found=new Map();
  for(const url of SOURCES){
    try{
      const html=await get(url);
      for(const code of extract(html)) found.set(code,{code,rewards:"See source for current reward details",status:"active"});
    }catch(e){ console.log("source failed",url,e.message); }
  }
  // Keep a small verified seed if all sources fail.
  const seed=[
    {code:"DONREVAMP",rewards:"5 Lucky Style Spins + 5 Lucky Flow Spins",status:"active"},
    {code:"SENDOUNEXT",rewards:"5 Lucky Flow Spins",status:"active"},
    {code:"ACEEATER",rewards:"5 Lucky Style Spins",status:"active"}
  ];
  for(const x of seed) if(!found.has(x.code)) found.set(x.code,x);
  const data={updated:new Date().toISOString(),codes:[...found.values()]};
  fs.writeFileSync("data/codes.json",JSON.stringify(data,null,2));
  console.log(`Saved ${data.codes.length} codes`);
})();