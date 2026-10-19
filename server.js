// Optional AI judge server. Run:  node server.js   then open http://localhost:3000
// Key comes from a .env file (ANTHROPIC_API_KEY=...) or the terminal environment.
// Without a key (or under Live Server) the game falls back to its built-in judges.
const http=require('http'),fs=require('fs'),path=require('path');
try{fs.readFileSync(path.join(__dirname,'.env'),'utf8').split(/\r?\n/).forEach(l=>{const m=l.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/);if(m&&!(m[1] in process.env))process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')})}catch(e){}
const KEY=process.env.ANTHROPIC_API_KEY,MODEL=process.env.CLAUDE_MODEL||'claude-sonnet-5-5';
const SYS=`You are a panel of five fashion-contest judges, in this order:
1 Dame Margaux: icy senior magazine editor, terse, barely impressed, never raises her voice.
2 Dante Laurent: theatrical, savage, sharp-tongued critic who loves accessories; roasts outfits, never the person.
3 Brooklyn Starr: bubbly, dramatic blonde Hollywood actress who loves colour and glamour.
4 Lin Mei-Hua: deadpan minimalist designer who judges construction and proportion.
5 Rosa Delgado: loud, fun street-style queen obsessed with shoes and swagger.
You get JSON: theme, themeTags, outfit (dress, dressTags, shoes, accessory), and base scores. Reward overlap between themeTags and outfit tags. Each score is the base score plus or minus 1 at most, integer 1-10.
Reply ONLY with JSON: {"scores":[5 ints],"comments":[5 strings]}. Each comment max 14 words, in character, funny, about the outfit only.`;
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
http.createServer(async(req,res)=>{
 if(req.method==='POST'&&req.url==='/api/judge'){
  let b='';for await(const c of req)b+=c;
  try{
   const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:MODEL,max_tokens:500,system:SYS,messages:[{role:'user',content:b}]})});
   const d=await r.json();if(!r.ok)console.log('Anthropic error:',r.status,JSON.stringify(d.error||d));const o=JSON.parse(d.content[0].text.replace(/```json|```/g,'').trim());
   res.writeHead(200,{'content-type':'application/json'});return res.end(JSON.stringify(o));
  }catch(e){console.log('Judge call failed:',e.message);res.writeHead(500);return res.end('{}')}}
 const rel=req.url==='/'?'index.html':decodeURIComponent(req.url.split('?')[0]);
 if(/(^|[\\/])\./.test(rel)||/server\.js$/.test(rel)){res.writeHead(404);return res.end('Not found')}
 const f=path.join(__dirname,rel);
 if(!f.startsWith(__dirname)){res.writeHead(403);return res.end()}
 fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'content-type':T[path.extname(f)]||'text/plain'});res.end(d)});
}).listen(3000,()=>console.log('Runway Rivals on http://localhost:3000 | API key found:',KEY?('yes, length '+KEY.length):'NO - set ANTHROPIC_API_KEY in this same terminal first'));