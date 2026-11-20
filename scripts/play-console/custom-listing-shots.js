// Play Console 맞춤 스토어 등록정보 — 스크린샷 6장 + 글(texts-2.80.json)을 언어마다 바꾸고 저장. 앱 브라우저의 Play Console 창에서 실행.
// API에 맞춤 등록정보가 없어서(fastlane 못 씀) 화면을 대신 누른다. 사용: 등록정보 편집 화면(/store-listings/<id>/edit)을 열고 이 파일을 붙여 넣은 뒤 __listing() → __log. 글만 바꿀 땐 window.__noShots=true.
// 언어마다 예전 스크린샷을 지우고 fastlane/metadata/android/<언어>/images/phoneScreenshots 6장(04-lesson 뺌), 14개 앱 언어 밖은 en-US.
(()=>{
if(!window.__origClick){window.__origClick=HTMLInputElement.prototype.click; HTMLInputElement.prototype.click=function(){ if(this.type==='file'){window.__fileInput=this; return;} return window.__origClick.call(this);} }
if(!window.__wk){const src="onmessage=e=>{setTimeout(()=>postMessage(e.data),e.data.ms)}"; const pol=trustedTypes.createPolicy('lbwk'+Date.now(),{createScriptURL:x=>x}); window.__wk=new Worker(pol.createScriptURL(URL.createObjectURL(new Blob([src],{type:'text/javascript'})))); window.__wkn=0; window.__wkp=new Map(); window.__wk.onmessage=e=>{const f=__wkp.get(e.data.id); __wkp.delete(e.data.id); f&&f();};}
const S=ms=>new Promise(r=>{const id=++window.__wkn; __wkp.set(id,r); __wk.postMessage({id,ms});}); window.__sleep=S;
window.__fields=()=>{const f=[...document.querySelectorAll('input, textarea')].filter(e=>!['hidden','file','radio','checkbox'].includes(e.type)&&e.getAttribute('aria-label')!=='애셋 검색'&&!e.closest('[role=dialog], aside, material-drawer')&&e.getBoundingClientRect().height>0); return {title:f[0], short:f[1], full:document.querySelector('textarea')};};
window.__setv=(el,v)=>{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); el.dispatchEvent(new Event('blur',{bubbles:true}));};
window.__textKey=c=>c==='pt-BR'?'pt-BR':(__MAP[c]||'en-US');
window.__setText=async(c)=>{const lid=location.pathname.match(/store-listings\/(\d+)/)[1]; const v=(__TX.O[lid]||{})[c]||__TX.T[__textKey(c)]; const f=__fields(); __setv(f.title,v.title); __setv(f.short,v.short); __setv(f.full,v.full); await S(600); return f.title.value===v.title && f.short.value===v.short && f.full.value===v.full;};
window.__findSec=()=>{const h=[...document.querySelectorAll('*')].find(e=>e.childElementCount<3 && /^휴대전화 스크린샷/.test(e.textContent.trim())); let s=h; for(let i=0;i<8&&s;i++){s=s.parentElement; if(s && /애셋 추가/.test(s.textContent) && s.className.includes('pc-card')) break;} return s;};
window.__closePanel=async()=>{const c=[...document.querySelectorAll('button')].filter(b=>/^(close|닫기|close닫기)$/.test(b.textContent.trim())||b.getAttribute('aria-label')==='닫기'); for(const b of c){ if(b.closest('[role=dialog], .side-panel, aside, material-drawer, .pc-side-panel')) b.click(); } document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await S(500);};
window.__names=()=>[...(__findSec()?.querySelectorAll('button[debug-id=delete-button]')||[])].map(b=>b.getAttribute('aria-label').replace(/ 삭제$/,''));
window.__sig=()=>[...__findSec().querySelectorAll('img')].map(i=>i.src).join('|');
window.__KO=null;
window.__isFallback=()=>{if(!__KO) return false; const srcs=[...__findSec().querySelectorAll('img')].map(i=>i.src); return srcs.length>0 && __KO.every(k=>srcs.some(s=>s.includes(k)));};
window.__clear=async()=>{for(let k=0;k<12;k++){ if(__isFallback()||!__names().length) return 0; const d=__findSec().querySelector('button[debug-id=delete-button]'); if(!d) break; const n=__names().length; d.click(); for(let i=0;i<15&&__names().length===n&&!__isFallback();i++) await S(150);} return (__isFallback()||!__names().length)?0:__names().length;};
window.__blobs=window.__blobs||{};
window.__get=async(folder,name)=>{const key=folder+'/'+name; if(!__blobs[key]){const r=await fetch(`https://raw.githubusercontent.com/a20031314-ux/english-chat-mvp-android/main/fastlane/metadata/android/${folder}/images/phoneScreenshots/${name}`); if(!r.ok) throw new Error('fetch '+key+' '+r.status); __blobs[key]=await r.blob();} return new File([__blobs[key]], name, {type:'image/png'});};
window.__addOne=async(file)=>{const before=__sig(); window.__fileInput=null; const add=[...__findSec().querySelectorAll('button')].find(b=>/애셋 추가/.test(b.textContent)); add.click(); await S(1100); const up=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='upload업로드'); if(!up) throw new Error('no upload btn'); up.click(); for(let i=0;i<30&&!window.__fileInput;i++) await S(100); let fi=window.__fileInput; if(!fi){ await S(800); up.click(); for(let i=0;i<30&&!window.__fileInput;i++) await S(100); fi=window.__fileInput;} if(!fi) throw new Error('no input'); const dt=new DataTransfer(); dt.items.add(file); fi.files=dt.files; fi.dispatchEvent(new Event('change',{bubbles:true})); for(let i=0;i<80;i++){await S(300); if(__sig()!==before) break;} await __closePanel(); return __names().length;};
window.__SHOTS=['01-call.png','02-quiz.png','03-lang.png','05-chat.png','06-people.png','07-log.png'];
window.__doLang=async(folder)=>{await __closePanel(); const left=await __clear(); if(left) return 'clear fail '+left; for(const n of __SHOTS){await __addOne(await __get(folder,n));} return __names().length;};
window.__MAP={'ko-KR':'ko-KR','ru-RU':'ru-RU','vi':'vi','es-419':'es-ES','es-ES':'es-ES','ar':'ar','it-IT':'it-IT','id':'id','ja-JP':'ja-JP','zh-CN':'zh-CN','th':'th','pt-BR':'pt-PT','pt-PT':'pt-PT','fr-FR':'fr-FR','fr-CA':'fr-FR','hi-IN':'hi-IN','en-US':'en-US','en-GB':'en-US'};
window.__folderOf=c=>__MAP[c]||'en-US';
window.__dd=()=>[...document.querySelectorAll('[role=button],[role=combobox],dropdown-button,material-dropdown-select')].find(e=>/(– [A-Za-z0-9-]+|^언어 선택)\s*arrow_drop_down$/.test(e.textContent.replace(/\s+/g,' ').trim().replace(/^(warning|error)\s*/,''))&&e.textContent.length<80);
window.__curLang=()=>__dd()?.textContent.trim().match(/– ([A-Za-z]+(?:-[A-Za-z0-9]+)?)(?=arrow|\s|$)/)?.[1];
window.__visibleOpts=()=>[...document.querySelectorAll('material-select-item[role=option]')].some(o=>o.getBoundingClientRect().height>0);
window.__switch=async(code)=>{if(__curLang()===code) return code; if(!__visibleOpts()){__dd().click(); await S(1200);} const opt=[...document.querySelectorAll('material-select-item[role=option]')].find(o=>o.textContent.replace(/\s+/g,' ').includes('– '+code)); if(!opt) throw new Error('no opt '+code); opt.click(); await S(2500); return __curLang();};
window.__langs=async()=>{__dd().click(); await S(1200); const O=[...document.querySelectorAll('material-select-item[role=option]')].map(o=>o.textContent.replace(/\s+/g,' ')); O.sort((x,y)=>(/기본값/.test(y)?1:0)-(/기본값/.test(x)?1:0)); const L=O.map(t=>t.match(/– ([A-Za-z]+(?:-[A-Za-z0-9]+)?)/)?.[1]).filter(Boolean); __dd().click(); await S(600); return L;};
window.__btn=t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===t);
window.__listing=async()=>{window.__TX=window.__TX||await fetch('https://raw.githubusercontent.com/a20031314-ux/english-chat-mvp-android/main/scripts/play-console/texts-2.80.json').then(r=>r.json()); window.__log=[]; window.__done=false; window.__KO=null;
 try{
  for(let i=0;i<60&&!__btn('다음');i++) await S(500);
  await S(3000); for(let k=0;k<6&&!__findSec();k++){ __btn('다음')?.click(); for(let i=0;i<16&&!__findSec();i++) await S(500); }
  for(let i=0;i<20&&!__dd();i++) await S(500);
  const L=await __langs(); __log.push('langs '+L.length+' default '+L[0]);
  const def=L[0]; await __switch(def); const t0=await __setText(def); const r0=window.__noShots?6:await __doLang(__folderOf(def)); __log.push(def+' '+(t0?'':'TEXTFAIL ')+r0);
  await S(1500); window.__KO=[...__findSec().querySelectorAll('img')].slice(0,3).map(i=>i.src.split('/').pop().slice(0,16));
  for(const c of L.slice(1)){ let ok=false; for(let a=0;a<2&&!ok;a++){ try{ const g=await __switch(c); if(g!==c){__log.push(c+' switch fail '+g); continue;} const t=await __setText(c); const r=window.__noShots?(__names().length||6):await __doLang(__folderOf(c)); __log.push(c+' '+(t?'':'TEXTFAIL ')+r); ok=(r===6&&t);}catch(e){__log.push(c+' ERR '+e.message); await __closePanel();} } }
  const bad=__log.filter(x=>!/ 6$/.test(x)&&!/^langs/.test(x)); window.__bad=bad;
  if(bad.length===0){ __btn('다음').click(); for(let i=0;i<20&&!__btn('저장');i++) await S(500); const rad=document.querySelector('material-radio[debug-id=no-ai-radio] input'); if(rad&&!rad.checked){rad.click(); await S(800);} __btn('저장').click(); await S(8000); __log.push('SAVED '+/변경사항을 전송하여 검토받을 수 있음|저장됨/.test(document.body.textContent)); }
  else __log.push('NOT SAVED');
 }catch(e){__log.push('FATAL '+e.message);} window.__done=true;};
})(); 'ok'
