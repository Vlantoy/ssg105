import * as T from './vendor/three.module.min.js';
const $=id=>document.getElementById(id),D=window.TopDuel,canvas=$('scene'),stage=$('stage');
if($('error'))$('error').hidden=true;
window.TopDuelRunning=true;

let is3D=false,renderer=null,scene=null,camera=null;
let models=[],aim=null,dots=[],arrow=null,spawnRing=null,boundary=null,inner=null;
const visualTops=[{angle:0,tilt:0},{angle:0,tilt:0}];
const hitSparks=[];

try{
  renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'default',failIfMajorPerformanceCaveat:false});
  if(renderer&&renderer.getContext()){is3D=true;}
}catch(e1){
  try{
    renderer=new T.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'default',failIfMajorPerformanceCaveat:false});
    if(renderer&&renderer.getContext()){is3D=true;}
  }catch(e2){
    is3D=false;
  }
}

if(is3D){
  try{
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.12;

    scene=new T.Scene();
    scene.background=new T.Color('#b7cec0');
    scene.fog=new T.Fog('#b7cec0',22,58);
    camera=new T.PerspectiveCamera(40,1,.1,120);
    camera.position.set(9,12.7,14.5);
    camera.lookAt(0,0,0);

    scene.add(new T.HemisphereLight('#e5f2df','#68603d',2.4));
    const sun=new T.DirectionalLight('#ffe5b5',3);
    sun.position.set(-7,16,7);
    sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});
    sun.shadow.bias=-.0008;
    scene.add(sun);

    const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.88,...extra});
    const dirt=mat('#b39161'),grass=mat('#6b8952'),wood=mat('#86613d'),bamboo=mat('#a99d61'),ink=mat('#21443d'),cream=mat('#f1d99f');
    function mesh(geo,material,x=0,y=0,z=0,parent=scene){
      const m=new T.Mesh(geo,material);
      m.position.set(x,y,z);
      m.castShadow=true;
      m.receiveShadow=true;
      parent.add(m);
      return m;
    }
    mesh(new T.CylinderGeometry(30,30,.3,64),grass,0,-.27,0);
    mesh(new T.CylinderGeometry(5.15,5.3,.18,80),dirt,0,-.08,0);

    boundary=mesh(new T.TorusGeometry(D.RADIUS,.028,6,100),cream,0,.025,0);
    boundary.rotation.x=Math.PI/2;
    inner=mesh(new T.TorusGeometry(D.RADIUS-.09,.012,4,100),mat('#d3b77b'),0,.03,0);
    inner.rotation.x=Math.PI/2;

    let seed=843;
    function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
    for(let i=0;i<330;i++){
      const a=random()*Math.PI*2,r=Math.sqrt(random())*4.4;
      mesh(new T.BoxGeometry(.025+random()*.07,.007,.025+random()*.05),mat(i%3?'#c0a06b':'#96764e'),Math.cos(a)*r,.025,Math.sin(a)*r);
    }
    for(let i=0;i<75;i++){
      const a=random()*Math.PI*2,r=5.6+random()*12;
      const rock=mesh(new T.DodecahedronGeometry(.13+random()*.28,0),mat(['#7b8667','#849075','#69775e'][i%3]),Math.cos(a)*r,0,Math.sin(a)*r);
      rock.scale.y=.55;
    }
    function tree(x,z,size){
      mesh(new T.CylinderGeometry(.11,.2,size*1.8,5),wood,x,size*.8,z);
      for(let i=0;i<3;i++)mesh(new T.ConeGeometry(size*(1-i*.18),size*1.4,7),mat(['#3a6553','#4b7655','#608553'][i]),x,size*(1.5+i*.5),z);
    }
    for(let i=0;i<23;i++){
      const a=i/23*Math.PI*2,r=10+random()*12;
      if(Math.sin(a)<.4)tree(Math.cos(a)*r,Math.sin(a)*r,1+random());
    }
    for(let i=0;i<10;i++){
      const mountain=mesh(new T.ConeGeometry(5+random()*5,7+random()*7,5),mat(i%2?'#739a8b':'#89a99a'),-28+i*6,1,-24-random()*8);
      mountain.rotation.y=i*.7;
    }
    const house=new T.Group();
    house.position.set(-8,0,-7);
    scene.add(house);
    mesh(new T.BoxGeometry(3,1.6,2.2),wood,0,1.8,0,house);
    for(const x of [-1.1,1.1])for(const z of [-.8,.8])mesh(new T.CylinderGeometry(.09,.1,1.3,5),ink,x,.6,z,house);
    const roof=mesh(new T.ConeGeometry(2.4,1.5,4),mat('#ac8750'),0,3.25,0,house);
    roof.rotation.y=Math.PI/4;
    roof.scale.z=.9;
    for(let i=0;i<4;i++)mesh(new T.BoxGeometry(.05,1.1,.04),cream,-.8+i*.5,1.8,1.12,house);
    for(let i=0;i<23;i++){
      const x=-11+i;mesh(new T.CylinderGeometry(.035,.045,1.2,5),bamboo,x,.6,-6.2);
    }
    for(const y of [.4,.85]){
      const bar=mesh(new T.CylinderGeometry(.035,.035,22,5),bamboo,0,y,-6.2);
      bar.rotation.z=Math.PI/2;
    }
    for(let i=0;i<15;i++){
      const x=-9+i*1.3;
      const flagGeo=new T.BufferGeometry();
      flagGeo.setAttribute('position',new T.Float32BufferAttribute([x,3.8,-6.1,x+.6,3.72,-6.1,x+.25,3.1,-6.1],3));
      const flag=mesh(flagGeo,new T.MeshStandardMaterial({color:['#c66f50','#dbc180','#548f83'][i%3],side:T.DoubleSide}));
      flag.castShadow=false;
    }
    function woodTexture(){
      const c=document.createElement('canvas');c.width=256;c.height=128;
      const g=c.getContext('2d');g.fillStyle='#ad7849';g.fillRect(0,0,256,128);
      for(let i=0;i<50;i++){
        g.strokeStyle=i%2?'#80533470':'#ddad6955';g.lineWidth=i%4+1;g.beginPath();
        for(let x=0;x<257;x+=4){const y=i*2.7+Math.sin(x*.03+i)*2;x?g.lineTo(x,y):g.moveTo(x,y);}
        g.stroke();
      }
      const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;
    }
    const topWood=new T.MeshStandardMaterial({map:woodTexture(),roughness:.66,color:'#e1be8d'});
    function makeTop(color){
      const root=new T.Group(),body=new T.Group();
      root.add(body);
      const points=[[0,0],[.07,.03],[.12,.2],[.35,.4],[.54,.65],[.55,.83],[.45,1.04],[.22,1.14],[.12,1.15]].map(([r,y])=>new T.Vector2(r,y));
      mesh(new T.LatheGeometry(points,40),topWood,0,0,0,body);
      mesh(new T.CylinderGeometry(.105,.12,.19,16),wood,0,1.21,0,body);
      mesh(new T.ConeGeometry(.065,.18,12),mat('#566265',{metalness:.7,roughness:.35}),0,.07,0,body).rotation.z=Math.PI;
      const band=mesh(new T.CylinderGeometry(.556,.556,.12,40),mat(color),0,.79,0,body);
      for(const y of [.714,.866]){const ring=mesh(new T.TorusGeometry(.548,.016,6,40),cream,0,y,0,body);ring.rotation.x=Math.PI/2;}
      for(let i=0;i<12;i++){
        const angle=i*Math.PI/6;
        const jewel=mesh(new T.BoxGeometry(.042,.065,.012),cream,Math.sin(angle)*.56,.79,Math.cos(angle)*.56,body);
        jewel.rotation.y=angle;jewel.rotation.z=Math.PI/4;
      }
      scene.add(root);
      return {root,body,angle:0,tilt:0};
    }
    models=[makeTop('#3b998e'),makeTop('#b85f44')];
    spawnRing=mesh(new T.TorusGeometry(.7,.018,6,60),new T.MeshBasicMaterial({color:'#69c8b6',transparent:true,opacity:.8}),0,.035,3.25);
    spawnRing.rotation.x=Math.PI/2;
    aim=new T.Group();
    scene.add(aim);
    dots=[];
    for(let i=0;i<18;i++)dots.push(mesh(new T.SphereGeometry(.045,6,4),new T.MeshBasicMaterial({color:'#fff1ad'}),0,.05,0,aim));
    arrow=mesh(new T.ConeGeometry(.14,.4,8),new T.MeshBasicMaterial({color:'#fff1ad'}),0,.05,0,aim);
    arrow.rotation.x=-Math.PI/2;
    aim.visible=false;
  }catch(err3d){
    console.warn('Three.js setup fallback to Canvas 2D:',err3d);
    is3D=false;
  }
}

const ctx2d=canvas.getContext('2d');
let state=D.create(),phase='menu',wins=[0,0],round=1,last=0,time=0,held=false,input=new Set(),sound=false,audio=null;

function tone(f=260){
  if(!sound)return;
  try{
    audio??=new AudioContext();
    audio.resume();
    const o=audio.createOscillator(),g=audio.createGain();
    o.frequency.value=f;
    g.gain.setValueAtTime(.06,audio.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.15);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime+.15);
  }catch{}
}

function clear(){input.clear();held=false;state.tops[0].charge=0;state.tops[0].holdTime=0;}
function press(key){if(phase!=='play')return;input.add(key);held=true;}
function release(key){
  if(!input.has(key))return;
  input.delete(key);
  if(input.size===0){
    held=false;
    if(phase==='play'&&D.release(state,0))tone(420);
  }
}

function panel(title,copy,label){
  $('title').innerHTML=title;
  $('copy').textContent=copy;
  $('start').textContent=label;
  $('overlay').hidden=false;
}

function start(){
  clear();
  state=D.create();
  phase='play';
  $('overlay').hidden=true;
  $('pause').disabled=false;
  $('pause').textContent='Tạm dừng';
  if(is3D&&aim&&spawnRing){aim.visible=true;spawnRing.visible=true;}
}

$('start').onclick=()=>{
  if(phase==='paused'){
    phase='play';
    $('overlay').hidden=true;
    $('pause').textContent='Tạm dừng';
  }else{
    if(phase==='result'){
      if(wins.some(n=>n===2)){wins=[0,0];round=1;}
      else if(state.winner!==2)round++;
    }
    start();
  }
};

function pause(){
  if(phase!=='play')return;
  clear();
  phase='paused';
  panel('Tạm nghỉ.','Tiếp tục khi bạn sẵn sàng.','Tiếp tục →');
  $('pause').textContent='Tiếp tục';
}
$('pause').onclick=()=>{if(phase==='paused')$('start').click();else pause();};

canvas.addEventListener('pointerdown',e=>{
  if(phase!=='play')return;
  e.preventDefault();
  canvas.setPointerCapture(e.pointerId);
  press('p'+e.pointerId);
});
canvas.addEventListener('pointerup',e=>release('p'+e.pointerId));
canvas.addEventListener('pointercancel',clear);
canvas.addEventListener('lostpointercapture',e=>{if(input.has('p'+e.pointerId))clear();});

window.addEventListener('keydown',e=>{
  if($('guide').open)return;
  if(e.code==='Space'&&phase==='play'&&!/BUTTON|INPUT/.test(e.target.tagName)){
    e.preventDefault();
    press('space');
  }
  if(e.code==='Escape')pause();
});
window.addEventListener('keyup',e=>{
  if(e.code==='Space'){
    if(input.has('space'))e.preventDefault();
    release('space');
  }
});
window.addEventListener('blur',pause);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});

$('help').onclick=()=>{pause();$('guide').showModal();};
$('close-help').onclick=()=>$('guide').close();
$('sound').onclick=()=>{
  sound=!sound;
  $('sound').textContent=sound?'♫':'♪';
  $('sound').setAttribute('aria-pressed',String(sound));
  $('sound').setAttribute('aria-label',sound?'Tắt âm thanh':'Bật âm thanh');
  tone();
};

function resize(){
  const w=stage.clientWidth||window.innerWidth||800;
  const h=stage.clientHeight||window.innerHeight||600;
  if(is3D&&renderer&&camera){
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    const distance=Math.max(17,11.7/(2*Math.tan(Math.PI/9)*(w/h)));
    camera.position.set(0,distance*.73,distance*.68);
    camera.fov=40;
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
  }else{
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
  }
}
new ResizeObserver(resize).observe(stage);
resize();

canvas.addEventListener('webglcontextlost',e=>{
  e.preventDefault();
  is3D=false;
  resize();
});

function addHitSparks(x,z){
  for(let i=0;i<14;i++){
    const a=Math.random()*Math.PI*2,sp=2.5+Math.random()*4.5;
    hitSparks.push({
      x,z,
      vx:Math.cos(a)*sp,
      vz:Math.sin(a)*sp,
      life:.25+Math.random()*.2,
      maxLife:.4,
      color:i%2===0?'#fff2b2':'#e89358'
    });
  }
}

function render2D(dt,nowTime){
  if(!ctx2d)return;
  const w=canvas.width,h=canvas.height;
  ctx2d.save();
  ctx2d.clearRect(0,0,w,h);

  const cx=w*0.5,cy=h*0.52;
  const baseScale=Math.min(w,h)/(D.RADIUS*2.65);
  const aspectY=0.74;

  const toX=x=>cx+x*baseScale;
  const toY=z=>cy+z*baseScale*aspectY;

  // 1. Sân cỏ nền
  const bgGrad=ctx2d.createRadialGradient(cx,cy,baseScale*2,cx,cy,baseScale*6.5);
  bgGrad.addColorStop(0,'#58784d');
  bgGrad.addColorStop(0.7,'#3c5b36');
  bgGrad.addColorStop(1,'#263f23');
  ctx2d.fillStyle=bgGrad;
  ctx2d.fillRect(0,0,w,h);

  // 2. Thềm đất cát nén
  ctx2d.beginPath();
  ctx2d.ellipse(cx,cy,D.RADIUS*1.15*baseScale,D.RADIUS*1.15*baseScale*aspectY,0,0,Math.PI*2);
  const dirtGrad=ctx2d.createRadialGradient(cx,cy,0,cx,cy,D.RADIUS*1.15*baseScale);
  dirtGrad.addColorStop(0,'#c8aa74');
  dirtGrad.addColorStop(0.7,'#b3915c');
  dirtGrad.addColorStop(0.95,'#947242');
  dirtGrad.addColorStop(1,'#6d512a');
  ctx2d.fillStyle=dirtGrad;
  ctx2d.fill();

  // 3. Vòng tròn ranh giới chiến đấu (state.radius)
  const ringRx=state.radius*baseScale;
  const ringRy=state.radius*baseScale*aspectY;
  const urgent=state.time<10;

  ctx2d.beginPath();
  ctx2d.ellipse(cx,cy,ringRx,ringRy,0,0,Math.PI*2);
  ctx2d.lineWidth=Math.max(3,baseScale*0.045);
  ctx2d.strokeStyle=urgent?`rgba(235,90,55,${0.65+Math.sin(nowTime*12)*0.35})`:'#f1d99f';
  ctx2d.shadowColor=urgent?'#ff4d2e':'#ffe89c';
  ctx2d.shadowBlur=urgent?16:8;
  ctx2d.stroke();
  ctx2d.shadowBlur=0;

  // Viền chỉ đôi truyền thống
  ctx2d.beginPath();
  ctx2d.ellipse(cx,cy,Math.max(1,ringRx-7),Math.max(1,ringRy-5),0,0,Math.PI*2);
  ctx2d.lineWidth=1.5;
  ctx2d.strokeStyle=urgent?'rgba(255,200,160,0.6)':'rgba(211,183,123,0.7)';
  ctx2d.stroke();

  // 4. Vòng xuất phát của người chơi & Hướng ngắm
  const p0=state.tops[0];
  if(phase==='play'){
    const p0x=toX(p0.x),p0y=toY(p0.z);
    ctx2d.beginPath();
    ctx2d.ellipse(p0x,p0y,0.75*baseScale,0.75*baseScale*aspectY,0,0,Math.PI*2);
    ctx2d.lineWidth=2;
    ctx2d.setLineDash([6,6]);
    ctx2d.strokeStyle='rgba(105,200,182,0.85)';
    ctx2d.stroke();
    ctx2d.setLineDash([]);

    const aimLen=(1.1+p0.charge*2.4)*baseScale;
    const sinA=Math.sin(p0.angle),cosA=Math.cos(p0.angle);
    for(let i=2;i<=18;i++){
      const f=i/18;
      const dotX=p0x+sinA*aimLen*f;
      const dotY=p0y+cosA*aimLen*f*aspectY;
      ctx2d.beginPath();
      ctx2d.arc(dotX,dotY,Math.max(2,3.5*f),0,Math.PI*2);
      ctx2d.fillStyle=p0.charge>=0.95?'#ff6a42':'#fff1ad';
      ctx2d.fill();
    }
    const tipX=p0x+sinA*aimLen;
    const tipY=p0y+cosA*aimLen*aspectY;
    ctx2d.save();
    ctx2d.translate(tipX,tipY);
    ctx2d.rotate(-p0.angle+Math.PI/2);
    ctx2d.beginPath();
    ctx2d.moveTo(12,0);
    ctx2d.lineTo(-6,-7);
    ctx2d.lineTo(-3,0);
    ctx2d.lineTo(-6,7);
    ctx2d.closePath();
    ctx2d.fillStyle=p0.charge>=0.95?'#ff4c28':'#fff1ad';
    ctx2d.fill();
    ctx2d.restore();
  }

  // 5. Vẽ 2 con quay dân gian
  state.tops.forEach((p,i)=>{
    const sx=toX(p.x),sy=toY(p.z);
    const vis=visualTops[i];
    const wobbleOffset=Math.sin(nowTime*30)*(p.wobble||0)*baseScale*0.18;
    const drawX=sx+wobbleOffset;
    const drawY=sy;
    const r=0.55*baseScale;
    const themeColor=i===0?'#3b998e':'#b85f44';
    const ringBorder=i===0?'#78dfd2':'#e88b72';

    // Bóng đổ tiếp đất
    ctx2d.beginPath();
    ctx2d.ellipse(drawX+4,drawY+8,r*0.9,r*0.48,0,0,Math.PI*2);
    ctx2d.fillStyle='rgba(15,28,18,0.45)';
    ctx2d.fill();

    ctx2d.save();
    ctx2d.translate(drawX,drawY);
    if(p.fallen){
      ctx2d.scale(1.2,0.55);
      ctx2d.rotate(vis.angle*0.25);
    }

    // Thân gỗ con quay
    const woodGrad=ctx2d.createRadialGradient(0,0,r*0.1,0,0,r);
    woodGrad.addColorStop(0,'#f3d7a8');
    woodGrad.addColorStop(0.55,'#be8c53');
    woodGrad.addColorStop(0.95,'#805328');
    ctx2d.beginPath();
    ctx2d.arc(0,0,r,0,Math.PI*2);
    ctx2d.fillStyle=woodGrad;
    ctx2d.fill();

    // Vành sơn màu dân tộc (Xanh Ngọc / Đỏ Son)
    ctx2d.beginPath();
    ctx2d.arc(0,0,r*0.82,0,Math.PI*2);
    ctx2d.lineWidth=Math.max(3,r*0.22);
    ctx2d.strokeStyle=themeColor;
    ctx2d.stroke();

    ctx2d.beginPath();
    ctx2d.arc(0,0,r*0.93,0,Math.PI*2);
    ctx2d.lineWidth=1.5;
    ctx2d.strokeStyle=ringBorder;
    ctx2d.stroke();

    // Họa tiết đinh đồng quay tròn
    const spokes=8;
    ctx2d.fillStyle='#fff0c2';
    for(let s=0;s<spokes;s++){
      const ang=vis.angle+s*(Math.PI*2/spokes);
      const jx=Math.cos(ang)*r*0.82;
      const jy=Math.sin(ang)*r*0.82;
      ctx2d.beginPath();
      ctx2d.arc(jx,jy,Math.max(1.5,r*0.06),0,Math.PI*2);
      ctx2d.fill();
    }

    // Tim đinh thép trung tâm
    ctx2d.beginPath();
    ctx2d.arc(0,0,r*0.2,0,Math.PI*2);
    ctx2d.fillStyle='#2c3639';
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.arc(0,0,r*0.09,0,Math.PI*2);
    ctx2d.fillStyle='#ffeaa7';
    ctx2d.fill();

    ctx2d.restore();
  });

  // 6. Hiệu ứng tia lửa va chạm
  for(let i=hitSparks.length-1;i>=0;i--){
    const sp=hitSparks[i];
    sp.x+=sp.vx*dt;
    sp.z+=sp.vz*dt;
    sp.life-=dt;
    if(sp.life<=0){hitSparks.splice(i,1);continue;}
    const spX=toX(sp.x),spY=toY(sp.z);
    ctx2d.beginPath();
    ctx2d.arc(spX,spY,Math.max(1.5,3*(sp.life/sp.maxLife)),0,Math.PI*2);
    ctx2d.fillStyle=sp.color;
    ctx2d.shadowColor=sp.color;
    ctx2d.shadowBlur=8;
    ctx2d.fill();
    ctx2d.shadowBlur=0;
  }

  ctx2d.restore();
}

function loop(now){
  const dt=Math.min((now-last)/1000||0,.05);
  last=now;

  if(phase==='play'){
    time+=dt;
    const events=D.step(state,dt,held);
    if(events.includes('hit')){
      tone(140);
      const a=state.tops[0],b=state.tops[1];
      addHitSparks((a.x+b.x)/2,(a.z+b.z)/2);
    }
    if(state.winner!==null){
      clear();
      phase='result';
      $('pause').disabled=true;
      const w=state.winner;
      if(w<2)wins[w]++;
      const match=wins.some(n=>n===2);
      panel(
        w===2?'Ngang tài,<br>ngang sức.':w===0?(match?'Bạn thắng trận!':'Bạn thắng hiệp!'):(match?'Đối thủ thắng trận!':'Đối thủ thắng hiệp!'),
        D.resultMessage(state)+(w<2?' Tỉ số '+wins[0]+' – '+wins[1]+'.':''),
        match?'Đấu lại →':'Hiệp tiếp theo →'
      );
    }
  }

  state.tops.forEach((p,i)=>{
    const vis=visualTops[i];
    if(phase==='play'||phase==='menu'){
      vis.angle+=dt*(p.fallen?1:12);
      vis.tilt+=((p.fallen?1.45:p.wobble)-vis.tilt)*(1-Math.exp(-8*dt));
    }
    if(is3D&&models[i]){
      const m=models[i];
      m.root.position.set(p.x,.02,p.z);
      m.angle=vis.angle;
      m.tilt=vis.tilt;
      m.root.rotation.set(Math.sin(time*3)*m.tilt,0,Math.cos(time*3)*m.tilt);
      m.body.rotation.y=m.angle;
    }
  });

  const p=state.tops[0];
  if(is3D&&aim&&dots.length&&arrow&&spawnRing&&boundary&&inner){
    const length=1.1+p.charge*2.4;
    aim.visible=phase==='play';
    dots.forEach((d,i)=>d.position.set(p.x+Math.sin(p.angle)*length*i/18,.08,p.z+Math.cos(p.angle)*length*i/18));
    arrow.position.set(p.x+Math.sin(p.angle)*length,.08,p.z+Math.cos(p.angle)*length);
    arrow.rotation.set(-Math.PI/2,0,Math.atan2(-Math.sin(p.angle),-Math.cos(p.angle)));
    spawnRing.position.set(p.x,.035,p.z);
    spawnRing.visible=phase==='play';
    boundary.scale.setScalar(state.radius/D.RADIUS);
    inner.scale.setScalar(state.radius/D.RADIUS);
    boundary.material.color.set(state.time<10?'#e39a60':'#f1d99f');
    renderer.render(scene,camera);
  }else if(!is3D){
    render2D(dt,time);
  }

  $('score1').textContent='●'.repeat(wins[0])+'○'.repeat(2-wins[0]);
  $('score2').textContent='●'.repeat(wins[1])+'○'.repeat(2-wins[1]);
  $('turn').textContent=Math.ceil(state.time)+' GIÂY';
  $('status').textContent=state.practice?'Thử một cú tung trước':state.time<10?'Vòng đang thu nhỏ!':p.cooldown>0?'Hồi đà':p.charge>=.98?'Max lực — khó ngắm!':held?'Đang lấy đà':'Canh hướng mũi tên';
  $('power-fill').style.width=p.charge*100+'%';
  $('power-fill').classList.toggle('overheat',p.charge>=.85);
  $('power-value').textContent=Math.round(p.charge*100)+'%';
  $('power').hidden=phase!=='play';

  requestAnimationFrame(loop);
}

$('start').disabled=false;
$('start').textContent='Vào sân →';
requestAnimationFrame(loop);
