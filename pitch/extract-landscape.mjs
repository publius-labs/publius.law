import { readFileSync, writeFileSync } from 'fs';
import { gunzipSync } from 'zlib';

const html = readFileSync('market-landscape.html', 'utf8');

const manifestMatch = html.match(/<script type="__bundler\/manifest">\s*([\s\S]*?)\s*<\/script>/);
const templateMatch = html.match(/<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/);
if (!manifestMatch || !templateMatch) throw new Error('Missing bundle data');

const manifest = JSON.parse(manifestMatch[1]);
let template = JSON.parse(templateMatch[1]);

const dataUrls = {};
for (const [uuid, entry] of Object.entries(manifest)) {
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) bytes = gunzipSync(bytes);
  dataUrls[uuid] = `data:${entry.mime};base64,${bytes.toString('base64')}`;
}

for (const [uuid, url] of Object.entries(dataUrls)) {
  template = template.split(uuid).join(url);
}

// Pull styles from <helmet> and matrix markup from div.ui
const styleBlocks = [...template.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
const matrixMatch = template.match(/<div class="ui" style="width:1280px;[\s\S]*<\/div>\s*<\/x-dc>/);
if (!matrixMatch) throw new Error('Matrix div not found');

let matrixHtml = matrixMatch[0].replace(/\s*<\/x-dc>\s*$/, '');

// Pitch-page color alignment (safe hex swaps only)
const pitchColors = `
:root {
  --paper-50: #EFEADB;
  --paper-100: #EFEADB;
  --surface-page: #EFEADB;
  --brass-300: #CBA05B;
  --brass-400: #A5813C;
  --brass-500: #A5813C;
  --brass-600: #8A6D33;
  --accent: #A5813C;
}
`;

const styles = pitchColors + styleBlocks.join('\n');

const fragment = `<!-- competitive landscape (from Market Landscape.html) -->
<style>
.competitive-matrix{
  border:1px solid var(--line);
  background:var(--paper-2);
  overflow:hidden;
  width:100%;
  position:relative;
}
.competitive-matrix__scale{
  width:1280px;
  transform-origin:top left;
}
${styles}
.competitive-matrix .ui{
  width:1280px !important;
  max-width:none;
}
</style>
<div class="competitive-matrix rise" style="margin-top:48px;">
  <div class="competitive-matrix__scale" id="competitiveMatrixScale">
${matrixHtml}
  </div>
</div>
<script>
(function(){
  function fit(){
    var wrap=document.querySelector('.competitive-matrix');
    var inner=document.getElementById('competitiveMatrixScale');
    if(!wrap||!inner)return;
    var w=wrap.clientWidth;
    var s=w/1280;
    inner.style.transform='scale('+s+')';
    wrap.style.height=(760*s)+'px';
  }
  fit();
  window.addEventListener('resize',fit);
})();
</script>`;

writeFileSync('competitive-landscape-fragment.html', fragment);
console.log('wrote fragment', fragment.length, 'bytes');
