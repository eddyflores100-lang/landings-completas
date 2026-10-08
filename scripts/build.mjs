import {readFileSync,writeFileSync,mkdirSync,rmSync,cpSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(readFileSync(join(root,'data/templates.json'),'utf8'));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const render=(source,values)=>source.replace(/\{\{([a-z]+)\}\}/g,(_,key)=>{if(!(key in values))throw new Error(`Missing value: ${key}`);return values[key]});
const seen=new Set();
if(!Array.isArray(data)||data.length!==7)throw new Error('Expected seven template configurations');
for(const t of data){
 if(!/^[a-z][a-z0-9-]+$/.test(t.slug)||['assets','archive','dist'].includes(t.slug)||seen.has(t.slug))throw new Error('Unsafe or duplicate slug');seen.add(t.slug);
 for(const key of ['sector','brand','eyebrow','headline','intro','audience','goal','scope'])if(typeof t[key]!=='string'||!t[key].trim())throw new Error(`Missing ${key}`);
 for(const key of ['color','ink'])if(!/^#[0-9a-f]{6}$/i.test(t[key]))throw new Error('Use a six-digit hex color');
 if(!Array.isArray(t.services)||t.services.length!==3||t.services.some(x=>!Array.isArray(x)||x.length!==2||x.some(v=>typeof v!=='string')))throw new Error('Expected three service title/body pairs');
 if(!Array.isArray(t.notes)||t.notes.length!==3||t.notes.some(v=>typeof v!=='string'))throw new Error('Expected three brief notes');
}
const out=join(root,'dist');rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});cpSync(join(root,'assets'),join(out,'assets'),{recursive:true});
const template=readFileSync(join(root,'templates/page.html'),'utf8');
const mailto=t=>'mailto:contact@alicelabs.site?subject='+encodeURIComponent(`Adaptación de plantilla · ${t.sector}`)+'&body='+encodeURIComponent(`Hola AliceLabs, me interesa adaptar la plantilla ${t.slug}.\n\nMi negocio:\nObjetivo de la página:\nMaterial disponible:\nPlazo deseado:\n`);
for(const t of data){
 const values=Object.fromEntries(Object.entries(t).filter(([,v])=>typeof v==='string').map(([k,v])=>[k,esc(v)]));
 values.title=esc(`${t.sector} · Demo de plantilla AliceLabs`);values.description=esc(`Demo editable para ${t.audience.toLowerCase()}. Marca ficticia; solicita una adaptación a AliceLabs.`);values.mailto=esc(mailto(t));
 values.notes=t.notes.map(n=>`<li>${esc(n)}</li>`).join('');values.services=t.services.map(([title,body],i)=>`<article><span>0${i+1}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('');
 mkdirSync(join(out,t.slug),{recursive:true});writeFileSync(join(out,t.slug,'index.html'),render(template,values));
}
const cards=data.map(t=>`<article class="template-card" data-sector="${esc(t.slug)}" style="--accent:${t.color};--theme-ink:${t.ink}"><div class="preview"><span>DEMO / ${esc(t.sector.toUpperCase())}</span><strong>${esc(t.headline)}</strong><span>${esc(t.brand)} · MARCA FICTICIA</span></div><div class="template-details"><h3>${esc(t.sector)}</h3><p>${esc(t.audience)}. Objetivo: ${esc(t.goal.toLowerCase())}.</p><div class="card-links"><a class="primary" href="${t.slug}/">Ver demo ↗</a><a href="${esc(mailto(t))}">Pedir adaptación</a></div></div></article>`).join('');
const catalog=render(readFileSync(join(root,'templates/catalog.html'),'utf8'),{cards,options:data.map(t=>`<option value="${t.slug}">${esc(t.sector)}</option>`).join('')});writeFileSync(join(out,'index.html'),catalog);
writeFileSync(join(out,'catalog.json'),JSON.stringify(data.map(({slug,sector,audience,goal,scope})=>({slug,sector,audience,goal,scope,status:'editable_demo'})),null,2)+'\n');
console.log(`Built catalogue and ${data.length} editable demos in dist/ (legacy bundles excluded).`);
