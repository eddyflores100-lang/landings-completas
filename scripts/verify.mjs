import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,resolve,dirname,relative,sep} from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const data=JSON.parse(readFileSync(join(root,'catalog.json'),'utf8'));
assert.equal(data.length,7);assert.equal(existsSync(join(root,'archive')),false);
const pages=['index.html',...data.map(t=>`${t.slug}/index.html`)];
for(const file of pages){
 const html=readFileSync(join(root,file),'utf8');assert(!html.includes('{{'),'Unresolved template tokens');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' needs one h1');
 if(file!=='index.html'){assert(html.includes('MARCA FICTICIA'));assert(html.includes('name="robots" content="noindex,follow"'));assert(html.includes('mailto:contact@alicelabs.site?subject='));}
 for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const link=raw.replaceAll('&amp;','&');if(/^(?:mailto:|https:)/.test(link))continue;
  assert(!link.startsWith('/'),`Root-relative URL breaks subpath hosting: ${link}`);
  const [url,hash]=link.split('#');let target=resolve(dirname(join(root,file)),url||'index.html');
  assert(!relative(root,target).startsWith('..'+sep),`Link escapes output: ${link}`);
  assert(existsSync(target),`${file}: missing ${link}`);if(statSync(target).isDirectory())target=join(target,'index.html');assert(existsSync(target));
  if(hash){const content=readFileSync(target,'utf8');assert(content.includes(`id="${hash}"`),`${file}: missing anchor ${hash}`)}
 }
}
for(const dir of readdirSync(root)){assert(!dir.endsWith('.zip'))}
console.log('PASS: seven demos, no legacy exports, single h1, noindex demo labels, contact drafts and all local links/anchors resolve.');
