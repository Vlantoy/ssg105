(() => {
'use strict';
const $=id=>document.getElementById(id), canvas=$('scene'),ctx=canvas.getContext('2d');
const R=window.Rhythm,E=window.SapEndless, W=960,H=540,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const bg=(window.GameLoader?.track(new Image()) || new Image());bg.src='../assets/background/Background.png';
let roundState=null,round=1,lives=3,roundWait=0,countdownAt=0;
let level='easy',state='menu',notes=[],score=0,combo=0,maxCombo=0,counts={},origin=0,frozen=0,nextBeat=0,muted=false,feedbackUntil=0,pose=1,hopAt=-10,now=0,particles=[];
const storage={get(k,d){try{return localStorage.getItem(k)??d;}catch{return d;}},set(k,v){try{localStorage.setItem(k,v);}catch{}}};
let ac=null,master=null,voices=new Set();
function clock(){return ac?ac.currentTime:performance.now()/1000;}
function tone(freq,time,duration=.09,type='triangle',volume=.08){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);g.gain.setValueAtTime(volume,time);g.gain.exponentialRampToValueAtTime(.001,time+duration);o.connect(g);g.connect(master);o.start(time);o.stop(time+duration);voices.add(o);o.onended=()=>{voices.delete(o);g.disconnect();};}
function silence(){for(const o of voices){try{o.stop();}catch{}}voices.clear();}
async function unlock(){try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=muted?0:1;master.connect(ac.destination);}await ac.resume();}catch{/* A silent session still uses the performance clock. */}}
function beatLength(){return 60/E.config(round).bpm;}
function elapsed(){return state==='playing'?clock()-origin:frozen;}
function panels(id){for(const name of ['menu','paused','result'])$(name).classList.toggle('hidden',name!==id);}
function controls(enabled){for(const id of ['in','out','up','down','commit'])$(id).disabled=!enabled;$('pause').disabled=!enabled;}
function best(){return Number(storage.get('sap_endless_best','0'))||0;}
function hud(){$('score').textContent=String(score).padStart(5,'0');$('combo').textContent='×'+combo;$('best').textContent=String(best()).padStart(5,'0');}
function newRound(t){roundState=E.create(round,t);notes=[{time:roundState.target,kind:round%2}];roundWait=0;nextBeat=0;}
async function start(){if(state==='starting')return;state='starting';await unlock();score=combo=maxCombo=0;lives=3;round=1;counts={perfect:0,good:0,miss:0};particles=[];pose=1;frozen=0;hopAt=-10;origin=clock();countdownAt=clock()+3;roundState=null;state='countdown';panels(null);controls(false);hud();$('feedback').classList.toggle('countdown',true);$('feedback').textContent='3';}
function pause(){if(state!=='playing')return;frozen=elapsed();silence();state='paused';panels('paused');controls(false);$('announcement').textContent='Đã tạm dừng.';}
async function resume(){if(state!=='paused')return;state='resuming';await unlock();origin=clock()-frozen;nextBeat=Math.ceil((frozen-roundState.start+.025)/beatLength());state='playing';panels(null);controls(true);}
function menu(){silence();state='ready';roundState=null;frozen=0;notes=[];particles=[];pose=1;panels('menu');controls(false);$('pause').disabled=true;$('feedback').textContent='';$('feedback').classList.toggle('countdown',false);$('phase').textContent='LƯỢT 1 · ♥♥♥';hud();}
function finish(){frozen=elapsed();state='result';silence();controls(false);if(score>best())storage.set('sap_endless_best',score);hud();$('rank').textContent='Hẹn một điệu múa nữa!';$('final-score').textContent=score.toLocaleString('vi-VN');$('summary').textContent='Đạt lượt '+round+' · Chuỗi tốt nhất ×'+maxCombo;panels('result');}
function feedback(text,color){$('feedback').textContent=text;$('feedback').style.color=color;feedbackUntil=performance.now()/1000+.65;}
function resolve(quality){counts[quality]++;roundWait=elapsed()+.45;roundState.resolved=true;roundState.result=quality;if(quality==='miss'){combo=0;lives--;feedback('LỠ NHỊP','#ffad8c');pose=1;}else{combo++;maxCombo=Math.max(combo,maxCombo);score+=R.points(quality,combo)+round*10;feedback(quality==='perfect'?'CHUẨN!':'ĐÚNG NHỊP','#ffe69a');pose=round%2;hopAt=elapsed();for(let i=0;i<12;i++)particles.push({x:480,y:360,vx:(Math.random()-.5)*100,vy:-30-Math.random()*80,life:.7,color:'#f4d37c'});}hud();if(lives===0)finish();}
function step(kind){if(state==='ready')return;if(state!=='playing'||roundState.resolved)return;const result=E.input(roundState,kind);if(result==='wrong')feedback('SAI HƯỚNG · NHẬP LẠI','#ffad8c');else if(result==='ready')feedback('SPACE · CHỐT NHỊP','#ffe69a');}
function commit(){if(state==='ready')return;if(state!=='playing'||roundState.resolved)return;resolve(E.commit(roundState,elapsed()));}
function schedule(t){const beat=beatLength(),relative=t-roundState.start;while(nextBeat*beat<=relative+.1){const b=nextBeat++,at=origin+roundState.start+b*beat;if(at<clock()-.04)continue;tone(b%4===0?240:180,Math.max(clock(),at),.06,'triangle',.12);if(b%2===0)tone([523,659,784,659][Math.floor(b/2)%4],Math.max(clock(),at),beat*.5,'sine',.04);}}
// Complete pixel sprites: face, costume and limbs share one grid and palette.
const spriteCache=new Map();
function danceSprite(female,seated,frame,facing){
 const key=[female,seated,frame,facing].join(':');if(spriteCache.has(key))return spriteCache.get(key);
 const c=document.createElement('canvas');c.width=80;c.height=104;const g=c.getContext('2d');
 const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
 const poly=(p,color)=>{g.fillStyle=color;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();};
 const dark='#23313c',indigo='#304853',shade='#1c303b',skin='#dda67c',light='#f0c69a',ivory='#e8e0c6',red='#aa4350',gold='#d6b879';
 g.save();if(facing<0){g.translate(80,0);g.scale(-1,1);}
 const lift=seated?0:[0,5,11,6,0,5,11,6][frame],footA=frame<4?lift:0,footB=frame>=4?lift:0,bob=seated?0:[0,1,2,1,0,1,2,1][frame];
 if(seated){
  // Kneeling side view: bent thighs, calves tucked back, feet kept under the body.
  poly([[33,86],[43,85],[56,91],[57,96],[46,99],[27,99],[25,95],[43,93]],dark);
  poly([[28,85],[37,86],[47,91],[46,96],[33,101],[19,101],[18,97],[33,94]],indigo);
  poly([[31,89],[37,90],[41,93],[30,97],[24,97]],'#4b626c');
  r(22,98,15,4,'#192931');r(17,99,12,3,'#283b40');r(23,101,13,1,'#a38d6b');
 }else{
  poly([[28,66],[39,66],[37,82-footA],[31,96-footA],[22,96-footA],[27,80-footA]],dark);
  poly([[41,66],[51,66],[51,80-footB],[58,96-footB],[48,96-footB],[42,82-footB]],indigo);
  r(29,78-footA,3,12,'#47616a');r(46,79-footB,3,12,'#547079');
  r(22,94-footA,9,4,skin);r(48,94-footB,10,4,skin);r(18,98-footA,16,4,'#1d2c33');r(47,98-footB,17,4,'#1d2c33');r(19,101-footA,14,1,'#b3a082');r(48,101-footB,15,1,'#b3a082');
 }
 g.translate(0,(seated?17:0)-bob);
 // Far arm is drawn behind the torso. Operators reach toward the pole ends.
 if(seated){poly([[48,37],[54,41],[57,55],[69,60],[67,66],[50,61],[44,45]],'#a8b9ad');r(65,60,9,6,skin);}
 else{const h=[0,2,4,2,0,-2,-4,-2][frame];poly([[49,36],[55,40],[60,48+h],[69,43+h],[72,49+h],[59,56+h],[49,48]],'#a4b6ab');r(68,43+h,6,6,skin);}
 poly([[28,33],[39,30],[50,34],[54,45],[50,63],[54,74],[26,74],[29,60],[24,44]],shade);
 poly([[32,34],[41,33],[47,36],[47,61],[32,61]],ivory);r(34,35,3,24,'#fff0d4');r(44,36,3,25,'#b8bca8');
 poly([[27,35],[32,33],[31,62],[27,69],[24,63],[25,43]],indigo);poly([[47,34],[51,37],[53,63],[49,69],[46,62]],dark);
 r(30,36,2,26,red);r(48,37,2,26,red);r(40,35,2,25,red);
 for(let i=0;i<5;i++){r(30,39+i*5,2,2,gold);r(48,40+i*5,2,2,ivory);r(40,40+i*4,4,1,'#6c5550');}
 r(27,62,25,5,female?'#56836a':red);r(29,63,20,1,gold);
 if(female&&!seated){poly([[28,67],[50,67],[55,84],[52,87],[23,87],[22,83]],'#2b454d');poly([[28,69],[33,69],[29,82],[24,83]],'#49646a');r(24,79,29,3,red);r(24,84,29,2,gold);for(let i=26;i<52;i+=5){r(i,74,3,3,gold);r(i+1,73,1,5,gold);}}
 else{r(44,67,5,15,red);r(45,69,2,12,gold);}
 // Near sleeve and forearm use stepped silhouettes, never smooth vector tubes.
 if(seated){poly([[27,37],[22,41],[24,56],[40,63],[42,58],[31,51],[33,41]],ivory);poly([[38,57],[43,58],[51,62],[50,67],[42,65],[38,63]],skin);r(47,62,8,5,light);}
 else{const h=[0,-2,-4,-2,0,2,4,2][frame];poly([[27,36],[22,39],[17,50+h],[8,45+h],[5,51+h],[18,58+h],[28,48]],ivory);poly([[24,40],[21,49+h],[17,53+h],[19,55+h],[26,47]],'#bfc9b8');r(7,46+h,7,6,skin);r(5,47+h,3,4,light);r(17,50+h,4,4,red);}
 // Neck and expressive face with a compact head-to-body ratio.
 r(35,25,10,9,'#bd865f');r(37,26,7,7,skin);poly([[30,11],[38,7],[49,11],[53,18],[50,26],[44,30],[34,26],[29,19]],skin);poly([[36,12],[46,12],[50,18],[47,25],[42,27],[35,23]],light);r(31,19,3,5,'#c08965');r(40,18,2,2,'#263136');r(47,18,2,2,'#263136');r(40,17,3,1,'#665044');r(46,17,3,1,'#665044');r(44,21,2,3,'#cf9871');r(43,26,4,1,'#9f5e52');
 poly([[29,12],[31,7],[39,4],[48,7],[52,13],[50,17],[45,12],[39,12],[34,17],[33,24],[29,21]],'#252b34');r(34,8,11,2,'#444650');
 if(female){poly([[31,8],[29,5],[32,1],[40,0],[45,4],[43,8]],'#252b34');r(32,3,8,2,'#484651');r(29,10,22,3,red);r(33,10,5,2,gold);r(31,24,2,6,gold);}else{r(30,9,21,3,'#4e4651');r(31,9,18,1,red);}
 g.restore();spriteCache.set(key,c);return c;
}
function person(x,y,scale=2.3,female=false,phase=0,seated=false,facing=1){
 const frame=reduced?0:((Math.floor(phase*1.5)%8)+8)%8,im=danceSprite(female,seated,frame,facing),size=scale*.8;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(im,Math.round(x-40*size),Math.round(y-104*size),80*size,104*size);
}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function text(str,x,y,size=14,color='#fff1cb',align='center'){ctx.font=`bold ${size}px Trebuchet MS, Arial`;ctx.textAlign=align;ctx.fillStyle='#26372d';ctx.fillText(str,x+1,y+2);ctx.fillStyle=color;ctx.fillText(str,x,y);}
function bamboo(x,y,w){
 rect(x+2,y+5,w,3,'#4c482c55');rect(x,y,w,6,'#596d35');rect(x+1,y,w-2,2,'#ded18a');rect(x+1,y+2,w-2,2,'#acb968');rect(x+1,y+5,w-2,1,'#485c32');
 for(let j=17;j<w-5;j+=49){rect(x+j,y,2,6,'#6b773a');rect(x+j+2,y,1,5,'#e2d795');}
}
function scene(t,dt){ctx.imageSmoothingEnabled=false;if(bg.complete&&bg.naturalWidth)ctx.drawImage(bg,0,80,bg.naturalWidth,bg.naturalHeight-80,0,0,W,H);else{rect(0,0,W,H,'#6faed0');rect(0,280,W,260,'#a9a65a');}
 // Pixel festival bunting.
 for(let i=0;i<16;i++){let x=50+i*58,y=59+Math.sin(i/15*Math.PI)*20;rect(x,y,50,2,'#514633');const colors=['#d65a52','#e4bb58','#547f71'];for(let j=0;j<10;j++)rect(x+18+j,y+2+j,20-j*2,2,colors[i%3]);}
 const running=['playing','paused','result'].includes(state),bt=running?Math.max(0,t)/beatLength():now*.7;
 const active=notes.find(n=>Math.abs(n.time-t)<beatLength()*.45),kind=active?active.kind:Math.floor(bt)%2;
 const pulse=Math.max(0,1-Math.abs((bt%1)-.05)*5),desiredOpening=kind===0?38+6*(1-pulse):6+4*(1-pulse);if(state!=='paused')bambooOpening+=(desiredOpening-bambooOpening)*(1-Math.exp(-24*dt));const opening=bambooOpening;
 // Audience on the edges, operators beyond both ends of the bamboo.
 for(const [x,y,f] of [[105,337,true],[177,345,false],[825,334,true],[895,345,false]])person(x,y,.92,f,reduced?0:bt*.4,false,x>480?-1:1);
 // Two clearly separated pairs; support beams run under the ends, across the poles.
 for(const x of [290,670]){rect(x+3,319,10,126,'#53462f55');rect(x,317,8,126,'#6f5d38');rect(x,317,3,126,'#b49c62');for(let y=326;y<440;y+=24)rect(x,y,8,2,'#4f4c2e');}
 for(let row=0;row<2;row++){const y=346+row*67;
  person(259,y+21,1.04,row===0,bt,true,1);person(703,y+21,1.04,row!==0,bt,true,-1);
  bamboo(280,y-opening/2,400);bamboo(280,y+opening/2,400);
 }
 // Ground shadows and two dancing partners.
 ctx.fillStyle='#414b3366';ctx.beginPath();ctx.ellipse(dancerVisualX,dancerVisualY+2,29,6,0,0,Math.PI*2);ctx.fill();
 const hop=running?Math.max(0,1-(t-hopAt)/.32):0, jump=reduced?0:Math.sin(hop*Math.PI)*32;
 const targetX=pose===0?475:545;dancerVisualX+=(targetX-dancerVisualX)*(1-Math.exp(-12*dt));const dancerX=dancerVisualX;

 dancerVisualY+=((pose===0?405:449)-dancerVisualY)*(1-Math.exp(-12*dt));person(dancerX,dancerVisualY-jump,2.15,true,reduced?0:bt*3);

 for(const p of particles){if(state==='playing'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=80*dt;p.life-=dt;}rect(p.x,p.y,3,3,p.color);}particles=particles.filter(p=>p.life>0);
 // Only show the phrase after the countdown has completed.
 if(!roundState)return;
 rect(39,451,882,79,'#172e28f2');rect(39,451,882,2,'#bd9c57');
 const seq=roundState?roundState.sequence:[],index=roundState?roundState.index:0,symbols=['←','→','↑','↓'];
 const size=Math.min(38,360/seq.length),left=480-seq.length*(size+7)/2;
 seq.forEach((k,i)=>{const x=left+i*(size+7);rect(x,461,size,size,i<index?'#5d9276':'#344a3c');rect(x+2,463,size-4,size-4,i<index?'#326650':'#1c382f');text(symbols[k],x+size/2,461+size*.73,Math.min(24,size*.7),i<index?'#c9f2ca':'#f4d89a');});
 const x0=240,width=480,target=.84;rect(x0,513,width,4,'#5e7251');
 const duration=roundState?.duration||6,good=roundState?.good||.24,windowWidth=width*good/(duration/target);rect(x0+width*target-windowWidth,506,windowWidth*2,16,'#be9c4e');rect(x0+width*target-2,504,4,20,'#ffe4a0');
 const fraction=roundState?Math.min(1,Math.max(0,(t-roundState.start)/(duration/target))):0;rect(x0+width*fraction-2,508,4,12,'#e9f1d0');text('SPACE',790,521,12,'#f2d690');

}
let dancerVisualX=545,dancerVisualY=449,bambooOpening=38;
let previous=performance.now()/1000;
function frame(){now=performance.now()/1000;const dt=Math.min(.05,now-previous);previous=now;if(state==='countdown'){const remaining=countdownAt-clock();if(remaining>0){$('feedback').textContent=String(Math.ceil(remaining));$('feedback').style.color='#ffe69a';}else{origin=clock();newRound(0);state='playing';$('feedback').classList.toggle('countdown',false);$('feedback').textContent='';feedbackUntil=0;controls(true);}}const t=elapsed();if(state==='playing'){schedule(t);if(!roundState.resolved&&t>roundState.target+roundState.good)resolve('miss');if(state==='playing'&&roundState.resolved&&t>=roundWait){round++;newRound(t);}const cfg=E.config(round);$('phase').textContent='LƯỢT '+round+' · '+'♥'.repeat(lives);}if(state!=='countdown'&&now>feedbackUntil)$('feedback').textContent='';scene(t,dt);requestAnimationFrame(frame);}
$('start').onclick=start;$('retry').onclick=start;$('choose').onclick=menu;$('back').onclick=menu;$('pause').onclick=pause;$('resume').onclick=resume;
for(const [id,kind] of [['in',0],['out',1],['up',2],['down',3]]){$(id).addEventListener('pointerdown',e=>{e.preventDefault();step(kind);});$(id).onclick=e=>{if(e.detail===0)step(kind);};}
$('commit').addEventListener('pointerdown',e=>{e.preventDefault();commit();});$('commit').onclick=e=>{if(e.detail===0)commit();};
window.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea')||$('help-dialog').open)return;if(e.key==='Escape'){if(state==='playing')pause();else if(state==='paused')resume();return;}const keys={ArrowLeft:0,ArrowRight:1,ArrowUp:2,ArrowDown:3,a:0,d:1,w:2,s:3};if(e.code==='Space'){e.preventDefault();if(!e.repeat)commit();}else if(keys[e.key]!==undefined){e.preventDefault();if(!e.repeat)step(keys[e.key]);}});
$('sound').onclick=()=>{muted=!muted;if(master)master.gain.value=muted?0:1;$('sound').textContent=muted?'Âm: Tắt':'Âm: Bật';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Bật âm thanh':'Tắt âm thanh');};
$('help').onclick=()=>{pause();$('help-dialog').showModal();};$('close-help').onclick=()=>$('help-dialog').close();document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state==='countdown')menu();else pause();}});window.addEventListener('blur',()=>{if(state==='countdown')menu();else pause();});
menu();requestAnimationFrame(frame);
})();
