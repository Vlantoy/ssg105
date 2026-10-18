(() => {
 'use strict';
 const $=id=>document.getElementById(id),canvas=$('scene'),ctx=canvas.getContext('2d'),E=window.StickEngine;
 const bg=new Image();bg.src='../assets/background/Background.png';
 const hero=new Image();hero.src='assets/fighter-woman-v4.png';const rival=new Image();rival.src='assets/fighter-veteran-v4.png';
 const spectators=['../assets/character/p1/body.png','../assets/character/p2/body.png'].map(src=>{const im=new Image();im.src=src;return im;});
 const resize=()=>{canvas.width=960;canvas.height=Math.round(canvas.clientHeight/canvas.clientWidth*960);};new ResizeObserver(resize).observe(canvas);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let mode='bot',level='normal',state=E.create(),phase='menu',score=[0,0],round=1,countdown=0,last=0,held=[false,false],pausedFrom='play',sound=false,audio=null,particles=[],flash=0,visualTime=0;
 const inputSources=[new Set(),new Set()];
 const tones=(frequency=220,duration=.08)=>{if(!sound)return;try{audio??=new AudioContext();audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.setValueAtTime(frequency,audio.currentTime);gain.gain.setValueAtTime(.055,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}};
 function clearInput(){inputSources.forEach(s=>s.clear());held=[false,false];$('hold1').classList.remove('active');$('hold2').classList.remove('active');}
 function setInput(i,key,on){if(on&&phase!=='play')return;on?inputSources[i].add(key):inputSources[i].delete(key);held[i]=inputSources[i].size>0;$('hold'+(i+1)).classList.toggle('active',held[i]);}
 function configure(){const vs=mode==='versus';$('control2').hidden=!vs;$('difficulty').hidden=vs;$('name1').textContent=vs?'NGƯỜI CHƠI 1':'BẠN';$('name2').textContent=vs?'NGƯỜI CHƠI 2':'ĐỐI THỦ';$('label1').textContent=vs?'NGƯỜI CHƠI 1':'LỰC CỦA BẠN';$('hold1').querySelector('kbd').textContent=vs?'A':'SPACE';}
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));configure();});
 document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=b.dataset.level;document.querySelectorAll('[data-level]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
 function begin(){clearInput();state=E.create(mode==='versus'?'normal':level);phase='countdown';countdown=3.1;particles=[];$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='Tạm dừng';$('round').textContent='HIỆP '+round;$('callout').textContent='';configure();updateHud();}
 function scoreboard(){score.forEach((v,i)=>$('score'+(i+1)).textContent=Array.from({length:2},(_,j)=>j<v?'●':'○').join(' '));}
 function panel(title,copy,label){$('panel-title').innerHTML=title;$('panel-copy').textContent=copy;$('start').textContent=label;$('setup').hidden=true;$('menu').hidden=false;$('overlay').hidden=false;}
 function finish(){clearInput();phase='result';$('pause').disabled=true;const w=state.winner;if(w<2)score[w]++;scoreboard();const match=score.some(v=>v===2);const name=w===0?(mode==='bot'?'Bạn':'Người chơi 1'):'Người chơi 2';const winnerName=w===1&&mode==='bot'?'Đối thủ':name;
 
 const explanation=state.reason==='ring'?'Đối phương đã bước khỏi vòng.':'Hết giờ: bên đẩy xa hơn giành hiệp thắng.';
 panel(w===2?'Bất phân<br>thắng bại.':winnerName+(match?' thắng trận!':' thắng hiệp!'),w===2?'Hai bên ngang sức. Cùng đấu lại hiệp này!':explanation+' Tỉ số '+score[0]+' – '+score[1]+'.',match?'Đấu lại →':'Hiệp tiếp theo →');
 
 tones(w===0?660:180,.28);if(w===0)for(let i=0;i<65;i++)particles.push({x:480,y:160,vx:(Math.random()-.5)*330,vy:-Math.random()*230,life:3,color:['#f6cf70','#74c4b4','#d97156'][i%3]});
 }
 $('start').onclick=()=>{if(phase==='paused'){resume();return;}if(phase==='result'){if(score.some(v=>v===2)){score=[0,0];round=1;}else if(state.winner!==2)round++;}else{score=[0,0];round=1;}scoreboard();begin();};
 $('menu').onclick=()=>{phase='menu';clearInput();$('setup').hidden=false;$('panel-title').innerHTML='Giữ thế.<br>Chớp thời cơ.';$('panel-copy').textContent='Bám vùng vàng để đẩy đối thủ khỏi vòng. Thắng 2 hiệp để thắng trận.';$('start').textContent='Vào sân →';$('menu').hidden=true;$('pause').disabled=true;};
 function pause(){if(!['play','countdown'].includes(phase))return;pausedFrom=phase;phase='paused';clearInput();panel('Tạm nghỉ.', 'Trận đấu đang chờ bạn.','Tiếp tục →');$('pause').textContent='Tiếp tục';}
 function resume(){phase=pausedFrom;clearInput();$('overlay').hidden=true;$('pause').textContent='Tạm dừng';}
 $('pause').onclick=()=>phase==='paused'?resume():pause();
 $('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♫':'♪';$('sound').title=sound?'Tắt âm thanh':'Bật âm thanh';$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'Tắt âm thanh':'Bật âm thanh');tones(440);};
 $('help').onclick=()=>{pause();$('guide').showModal();};$('close-guide').onclick=()=>$('guide').close();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',pause);
 function keyIndex(code){if(code==='Space'&&mode==='bot')return 0;if(code==='KeyA')return 0;if(code==='ArrowUp'&&mode==='versus')return 1;return -1;}
 window.addEventListener('keydown',e=>{if($('guide').open)return;if(e.code==='Escape'){if(phase==='paused')resume();else pause();return;}if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const i=keyIndex(e.code);if(i>=0){e.preventDefault();setInput(i,e.code,true);}});
 window.addEventListener('keyup',e=>{const i=keyIndex(e.code);if(i>=0){e.preventDefault();setInput(i,e.code,false);}});
 [0,1].forEach(i=>{const b=$('hold'+(i+1));b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);setInput(i,'p'+e.pointerId,true);};const release=e=>setInput(i,'p'+e.pointerId,false);b.onpointerup=release;b.onpointercancel=release;b.onlostpointercapture=release;b.onkeydown=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();setInput(i,'button',true);}};b.onkeyup=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();setInput(i,'button',false);}};b.onblur=()=>setInput(i,'button',false);});
 function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
 function fighter(x,floor,facing,height,time,force){
  const width=height*.753,bob=reduced?0:Math.sin(time*8)*Math.min(force,.7)*1.4;
  ctx.save();ctx.translate(Math.round(x),Math.round(floor));ctx.scale(facing,1);
  ctx.fillStyle='#26382a48';ctx.beginPath();ctx.ellipse(0,0,width*.5,8,0,0,Math.PI*2);ctx.fill();
  const art=facing===1?hero:rival;
  if(art.complete&&art.naturalWidth){ctx.rotate(reduced?0:(force-.5)*-.018);ctx.drawImage(art,0,75,1024,1360,-width/2,-height+bob,width,height);}
  ctx.restore();
 }
 function crowd(floor){for(let i=0;i<24;i++){const im=spectators[i%2];if(!im.complete||!im.naturalWidth)continue;const height=47+(i%4)*3,x=17+i*40;ctx.globalAlpha=.78;ctx.drawImage(im,x-19,floor-height,38,height);}ctx.globalAlpha=1;}
 function draw(){
  const H=canvas.height,W=960,portrait=H>W,floor=H*(portrait?.62:.69),actorHeight=portrait?Math.min(H*.31,480):Math.min(H*.43,295),radius=380,center=480+state.position*140;
  ctx.imageSmoothingEnabled=false;
  if(bg.complete&&bg.naturalWidth){const scale=Math.max(W/bg.naturalWidth,H/bg.naturalHeight),dw=bg.naturalWidth*scale,dh=bg.naturalHeight*scale;ctx.drawImage(bg,(W-dw)/2,(H-dh)*.7,dw,dh);}else rect(0,0,W,H,'#8db9a1');
  // Existing detailed costume assets replace the old block-shaped crowd.
  crowd(floor-actorHeight*.34);
  ctx.fillStyle='#b58b52';ctx.beginPath();ctx.ellipse(480,floor-3,radius+12,Math.min(H*.115,65),0,0,Math.PI*2);ctx.fill();
  for(let i=0;i<130;i++){const x=115+(i*83)%730,y=floor-35+(i*31)%65;if(((x-480)/380)**2+((y-floor)/55)**2<.95)rect(x,y,i%3+2,1,i%2?'#c9a66a':'#a57d46');}
  ctx.strokeStyle='#f4dfab';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(480,floor-3,radius,Math.min(H*.10,55),0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#e7d09c55';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(480,floor-3,radius-8,Math.min(H*.10,55)-4,0,0,Math.PI*2);ctx.stroke();
  // Two discreet colored markers distinguish players without recoloring skin.
  [center-actorHeight*.45,center+actorHeight*.45].forEach((x,i)=>{ctx.fillStyle=i?'#ce725b80':'#4a9b9680';ctx.beginPath();ctx.ellipse(x,floor,actorHeight*.32,6,0,0,Math.PI*2);ctx.fill();});
  const gripY=floor-actorHeight*.55,shake=flash&&!reduced?Math.sin(visualTime*90)*flash*2:0;
  ctx.save();ctx.translate(shake,0);rect(center-85,gripY,170,7,'#65472b');rect(center-85,gripY,170,2,'#e1c089');rect(center-2,gripY-2,4,12,'#af4d39');
  fighter(center-actorHeight*.45,floor,1,actorHeight,visualTime,state.players[0].quality);fighter(center+actorHeight*.45,floor,-1,actorHeight,visualTime+.8,state.players[1].quality);
  ctx.restore();
  for(const p of particles)rect(p.x,p.y/540*H,4,4,p.color);
  if(phase==='countdown'){ctx.fillStyle='#fff0bd';ctx.font='bold 58px Arial';ctx.textAlign='center';ctx.strokeStyle='#254036';ctx.lineWidth=5;const text=countdown>.6?String(Math.ceil(countdown-.6)):'VÀO TRẬN!';ctx.strokeText(text,480,H*.35);ctx.fillText(text,480,H*.35);}
 }
 function updateHud(){state.players.forEach((p,i)=>{const n=i+1,w=E.levels[state.level].width;$('needle'+n).style.left=(p.force*100)+'%';$('target'+n).style.left=((p.target-w/2)*100)+'%';$('target'+n).style.width=(w*100)+'%';$('quality'+n).textContent=p.cooldown>0?'Hồi thế '+Math.ceil(p.cooldown)+'s':p.quality>.95?'Dồn lực '+Math.min(100,Math.round(p.focus/.85*100))+'%':p.quality>.5?'Đang giữ thế':'Lệch lực!';});$('clock').textContent=Math.ceil(state.time);}
 function loop(now){const dt=Math.min((now-last)/1000||0,.05);last=now;visualTime+=dt;flash=Math.max(0,flash-dt*2);if(phase==='countdown'){const previous=Math.ceil(countdown);countdown-=dt;if(Math.ceil(countdown)!==previous)tones(330,.06);if(countdown<=0){phase='play';$('callout').textContent='';}}
 if(phase==='play'){const bursts=E.step(state,dt,held,mode==='bot');if(bursts.length){flash=1;$('callout').textContent=bursts.includes(0)?'DỒN LỰC!':'ĐỐI THỦ DỒN LỰC!';tones(bursts.includes(0)?520:220,.15);for(let i=0;i<12;i++)particles.push({x:480+state.position*200,y:445,vx:(Math.random()-.5)*120,vy:-Math.random()*85,life:.6,color:'#efd292'});}else if(flash===0)$('callout').textContent=Math.abs(state.position)>.7?'SÁT MÉP VÒNG!':'';updateHud();if(state.winner!==null)finish();}
 if(phase!=='paused'){particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=180*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);}draw();requestAnimationFrame(loop);}
 configure();resize();updateHud();requestAnimationFrame(loop);
})();
