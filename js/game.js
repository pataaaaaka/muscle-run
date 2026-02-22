// ========== ゲームメイン ==========
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const W=800,H=600,GROUND=550;
const keys={},keyPressed={};
let scene='title',stage=null,menuIdx=0,stageIdx=0;
const stages=[
  {id:'1-1',name:'Hamburger Alley',unlocked:true},
  {id:'1-2',name:'Fried Avenue',unlocked:false},
  {id:'1-3',name:'Pizza Plaza',unlocked:false},
  {id:'1-4',name:'Donut Park',unlocked:false},
  {id:'1-5',name:'Final Boss',unlocked:false},
  {id:'H-1',name:'Muscle Paradise',unlocked:false}
];

class GameStage {
  constructor(id) {
    this.id=id;
    this.data=getStageData(id);
    this.player={
      x:100,y:GROUND-PLAYER_HEIGHT,w:PLAYER_WIDTH,h:PLAYER_HEIGHT,
      vx:0,vy:0,grounded:false,dir:1,
      fat:0,muscle:0,body:'NORMAL',
      hp:3,invincible:false,invTimer:0,anim:0,dashCD:0
    };
    this.state={score:0,coins:0,time:this.data.timeLimit,clear:false,over:false};
    this.cam=0;
    this.enemies=new EnemyManager(this);
    this.items=new ItemManager(this);
    this.blocks=new BlockManager(this);
    this.load();
  }
  
  load() {
    if(this.data.blocks) {
      this.data.blocks.forEach(b=>{
        const C={
          solid:SolidBlock,breakable:BreakableBlock,platform:PlatformBlock,
          question:QuestionBlock,ice:IceBlock,trampoline:TrampolineBlock,
          lava:LavaBlock,moving_horizontal:MovingBlockHorizontal,
          moving_vertical:MovingBlockVertical,disappearing:DisappearingBlock
        }[b.type];
        if(C) this.blocks.spawnBlock(C,b.x,b.y,b.width||50,b.height||50);
      });
    }
    if(this.data.enemies) {
      this.data.enemies.forEach(e=>{
        setTimeout(()=>{
          const C={Hamburger,FrenchFries,Pizza,Donut,Soda,Virus,Bacteria,PoisonMushroom,Pathogen,DecayGerm}[e.type];
          if(C) this.enemies.spawnEnemy(C,e.x,e.y);
        },e.delay||0);
      });
    }
    if(this.data.items) {
      this.data.items.forEach(i=>this.items.spawnItem(i.type,i.x,i.y));
    }
  }
  
  update() {
    if(this.state.clear||this.state.over) return;
    const p=this.player;
    const td=getBodyTypeData(p.body);
    
    p.vy+=GRAVITY;
    if(p.invincible){p.invTimer--;if(p.invTimer<=0)p.invincible=false;}
    
    const spd=PLAYER_SPEED*td.speedMultiplier;
    if(keys.ArrowLeft||keys.KeyA){p.vx=-spd;p.dir=-1;}
    else if(keys.ArrowRight||keys.KeyD){p.vx=spd;p.dir=1;}
    else{p.vx*=0.8;if(Math.abs(p.vx)<0.1)p.vx=0;}
    
    if((keys.Space||keys.ArrowUp)&&!keyPressed.Space&&!keyPressed.ArrowUp){
      if(p.grounded){
        p.vy=JUMP_POWER*td.jumpMultiplier;
        p.grounded=false;
        keyPressed.Space=keyPressed.ArrowUp=true;
      }
    }
    
    if((keys.ShiftLeft||keys.ShiftRight||keys.KeyX)&&p.dashCD===0){
      p.vx=p.dir*DASH_SPEED*td.dashMultiplier;
      p.dashCD=60;
    }
    if(p.dashCD>0)p.dashCD--;
    
    if(keys.KeyQ)p.fat=Math.min(100,p.fat+1);
    if(keys.KeyE)p.muscle=Math.min(100,p.muscle+1);
    if(keys.KeyR){p.fat=0;p.muscle=0;}
    
    p.body=determineBodyType(p.fat,p.muscle);
    
    p.x+=p.vx;
    p.y+=p.vy;
    p.grounded=false;
    
    if(p.y+p.h>=GROUND){p.y=GROUND-p.h;p.vy=0;p.grounded=true;}
    p.x=Math.max(0,p.x);
    if(p.vx!==0)p.anim+=0.2;
    if(p.y>H+100)this.state.over=true;
    
    this.blocks.blocks.forEach(b=>{
      if(!b.isActive)return;
      if(p.x<b.x+b.width&&p.x+p.w>b.x&&p.y<b.y+b.height&&p.y+p.h>b.y){
        if(p.vy>0&&p.y+p.h-p.vy<b.y+10){p.y=b.y-p.h;p.vy=0;p.grounded=true;}
      }
    });
    
    this.enemies.enemies.forEach(e=>{
      if(!e.isAlive)return;
      if(p.x<e.x+e.width&&p.x+p.w>e.x&&p.y<e.y+e.height&&p.y+p.h>e.y){
        if(p.vy>0&&p.y+p.h-p.vy<e.y+10){
          e.takeDamage(e.hp);p.vy=-8;this.state.score+=100;
        }else if(!p.invincible){
          p.hp--;p.invincible=true;p.invTimer=90;
          p.vx=-p.dir*5;p.vy=-5;
          if(p.hp<=0)this.state.over=true;
        }
      }
    });
    
    this.items.items.forEach(i=>{
      if(!i.isActive)return;
      if(p.x<i.x+i.width&&p.x+p.w>i.x&&p.y<i.y+i.height&&p.y+p.h>i.y){
        if(i.type==='coin'){this.state.coins++;this.state.score+=100;}
        else if(i.type==='protein')p.muscle=Math.min(100,p.muscle+30);
        i.isActive=false;
      }
    });
    
    this.cam+=((p.x-W/3)-this.cam)*0.1;
    this.cam=Math.max(0,this.cam);
    
    this.enemies.update();
    this.items.update();
    this.blocks.update();
    
    this.state.time-=1/60;
    if(this.state.time<=0)this.state.over=true;
    
    const cond=this.data.clearCondition;
    if(cond.type==='reach_goal'&&p.x>=cond.x)this.state.clear=true;
  }
  
  draw() {
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#87CEEB');
    g.addColorStop(1,'#E0F6FF');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H);
    
    ctx.save();
    ctx.translate(-this.cam,0);
    
    ctx.fillStyle='#8B4513';
    ctx.fillRect(0,GROUND,10000,50);
    ctx.fillStyle='#228B22';
    ctx.fillRect(0,GROUND-5,10000,5);
    
    this.blocks.draw(ctx);
    this.items.draw(ctx);
    this.enemies.draw(ctx);
    
    const p=this.player;
    const td=getBodyTypeData(p.body);
    
    if(p.invincible&&Math.floor(p.invTimer/5)%2===0)ctx.globalAlpha=0.5;
    
    const bounce=Math.sin(p.anim)*2;
    ctx.fillStyle=td.color;
    ctx.fillRect(p.x,p.y+bounce,p.w,p.h);
    ctx.strokeStyle='#000';
    ctx.lineWidth=2;
    ctx.strokeRect(p.x,p.y+bounce,p.w,p.h);
    
    ctx.fillStyle='#FFE4C4';
    ctx.beginPath();
    ctx.arc(p.x+p.w/2,p.y+12+bounce,10,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle='#000';
    const eyeX=p.dir>0?4:-4;
    ctx.beginPath();
    ctx.arc(p.x+p.w/2+eyeX,p.y+10+bounce,3,0,Math.PI*2);
    ctx.fill();
    
    ctx.font='bold 10px "Press Start 2P"';
    ctx.fillStyle=td.color;
    ctx.textAlign='center';
    ctx.fillText(p.body,p.x+p.w/2,p.y-10+bounce);
    
    ctx.globalAlpha=1;
    
    if(this.data.goal){
      const go=this.data.goal;
      ctx.fillStyle='#FFD700';
      ctx.fillRect(go.x,go.y,go.width,go.height);
      ctx.strokeStyle='#000';
      ctx.lineWidth=3;
      ctx.strokeRect(go.x,go.y,go.width,go.height);
    }
    
    ctx.restore();
    
    ctx.fillStyle='rgba(0,0,0,0.8)';
    ctx.fillRect(0,0,W,60);
    
    ctx.font='16px Arial';
    ctx.textAlign='left';
    for(let i=0;i<3;i++)ctx.fillText(i<p.hp?'❤️':'🖤',10+i*25,25);
    
    ctx.font='bold 12px "Press Start 2P"';
    ctx.fillStyle=td.color;
    ctx.fillText(p.body,100,25);
    
    this.drawGauge(ctx,200,8,150,18,p.fat,'#FFA500','FAT');
    this.drawGauge(ctx,200,34,150,18,p.muscle,'#FF4444','MUSCLE');
    
    ctx.fillStyle='#FFD700';
    ctx.textAlign='right';
    ctx.fillText(`SCORE: ${Math.floor(this.state.score)}`,W-10,20);
    ctx.fillStyle='#87CEEB';
    ctx.fillText(`TIME: ${Math.ceil(this.state.time)}`,W-10,45);
    
    if(this.state.clear){
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(0,0,W,H);
      ctx.font='48px "Press Start 2P"';
      ctx.fillStyle='#FFD700';
      ctx.textAlign='center';
      ctx.fillText('STAGE CLEAR!',W/2,H/2);
    }
    
    if(this.state.over){
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(0,0,W,H);
      ctx.font='48px "Press Start 2P"';
      ctx.fillStyle='#FF4444';
      ctx.textAlign='center';
      ctx.fillText('GAME OVER',W/2,H/2);
    }
  }
  
  drawGauge(ctx,x,y,w,h,val,color,label) {
    ctx.font='8px "Press Start 2P"';
    ctx.fillStyle='#FFF';
    ctx.textAlign='left';
    ctx.fillText(label,x-50,y+h-4);
    
    ctx.fillStyle='#333';
    ctx.fillRect(x,y,w,h);
    
    const fill=w*(val/100);
    ctx.fillStyle=color;
    ctx.fillRect(x+1,y+1,fill-2,h-2);
    
    ctx.strokeStyle='#FFF';
    ctx.lineWidth=2;
    ctx.strokeRect(x,y,w,h);
    
    ctx.font='10px "Press Start 2P"';
    ctx.fillStyle='#FFF';
    ctx.textAlign='center';
    ctx.fillText(Math.floor(val),x+w/2,y+h-5);
  }
}

document.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter','Escape','ShiftLeft','ShiftRight','KeyQ','KeyE','KeyR','KeyX','KeyA','KeyD'].includes(e.code))
    e.preventDefault();
});

document.addEventListener('keyup',e=>{
  keys[e.code]=false;
  keyPressed[e.code]=false;
});

const menu=['START GAME','SETTINGS','HOW TO PLAY'];

function update(){
  if(scene==='title'){
    if(keys.ArrowUp&&!keyPressed.ArrowUp){menuIdx--;if(menuIdx<0)menuIdx=menu.length-1;keyPressed.ArrowUp=true;}
    if(keys.ArrowDown&&!keyPressed.ArrowDown){menuIdx++;if(menuIdx>=menu.length)menuIdx=0;keyPressed.ArrowDown=true;}
    if((keys.Space||keys.Enter)&&!keyPressed.Space&&!keyPressed.Enter){
      keyPressed.Space=keyPressed.Enter=true;
      if(menuIdx===0)scene='map';
    }
  }else if(scene==='map'){
    if(keys.ArrowLeft&&!keyPressed.ArrowLeft){stageIdx--;if(stageIdx<0)stageIdx=stages.length-1;keyPressed.ArrowLeft=true;}
    if(keys.ArrowRight&&!keyPressed.ArrowRight){stageIdx++;if(stageIdx>=stages.length)stageIdx=0;keyPressed.ArrowRight=true;}
    if((keys.Space||keys.Enter)&&!keyPressed.Space&&!keyPressed.Enter){
      keyPressed.Space=keyPressed.Enter=true;
      if(stages[stageIdx].unlocked){scene='stage';stage=new GameStage(stages[stageIdx].id);}
    }
    if(keys.Escape&&!keyPressed.Escape){scene='title';keyPressed.Escape=true;}
  }else if(scene==='stage'){
    if(stage){
      stage.update();
      if(stage.state.clear){
        const idx=stages.findIndex(s=>s.id===stage.id);
        if(idx>=0&&idx<stages.length-1)stages[idx+1].unlocked=true;
        setTimeout(()=>{scene='map';stage=null;},2000);
      }
      if(stage.state.over)setTimeout(()=>{scene='map';stage=null;},2000);
    }
  }
}

function draw(){
  if(scene==='title'){
    ctx.fillStyle='#0a0a1a';
    ctx.fillRect(0,0,W,H);
    ctx.font='bold 48px "Press Start 2P"';
    ctx.fillStyle='#ff4444';
    ctx.textAlign='center';
    ctx.fillText('MUSCLE',W/2,120);
    ctx.fillText('TRAINER',W/2,180);
    ctx.font='12px "Press Start 2P"';
    ctx.fillStyle='#00ff88';
    ctx.fillText('GET FIT OR GET FAT',W/2,220);
    ctx.font='16px "Press Start 2P"';
    menu.forEach((m,i)=>{
      const y=300+i*50;
      if(i===menuIdx){
        ctx.fillStyle='rgba(0,255,136,0.3)';
        ctx.fillRect(200,y-25,400,45);
        ctx.strokeStyle='#00ff88';
        ctx.lineWidth=2;
        ctx.strokeRect(200,y-25,400,45);
        ctx.fillStyle='#00ff88';
        ctx.fillText('▶ '+m+' ◀',W/2,y);
      }else{
        ctx.fillStyle='#fff';
        ctx.fillText(m,W/2,y);
      }
    });
    ctx.font='10px "Press Start 2P"';
    ctx.fillStyle='#666';
    ctx.fillText('↑↓: SELECT   SPACE: DECIDE',W/2,550);
  }else if(scene==='map'){
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#87CEEB');
    g.addColorStop(1,'#E0F6FF');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H);
    ctx.font='24px "Press Start 2P"';
    ctx.fillStyle='#000';
    ctx.textAlign='center';
    ctx.fillText('WORLD MAP',W/2,50);
    stages.forEach((s,i)=>{
      const x=100+(i%3)*200;
      const y=200+Math.floor(i/3)*150;
      ctx.fillStyle=s.unlocked?'#00ff88':'#666';
      ctx.fillRect(x-30,y-30,60,60);
      ctx.strokeStyle='#000';
      ctx.lineWidth=3;
      ctx.strokeRect(x-30,y-30,60,60);
      if(i===stageIdx){
        ctx.strokeStyle='#ff4444';
        ctx.lineWidth=4;
        ctx.strokeRect(x-35,y-35,70,70);
      }
      ctx.font='14px "Press Start 2P"';
      ctx.fillStyle=s.unlocked?'#000':'#333';
      ctx.textAlign='center';
      ctx.fillText(s.id,x,y+5);
      ctx.font='8px "Press Start 2P"';
      ctx.fillText(s.name,x,y+50);
    });
    ctx.font='10px "Press Start 2P"';
    ctx.fillStyle='#000';
    ctx.fillText('←→: SELECT   SPACE: START   ESC: BACK',W/2,550);
  }else if(scene==='stage'){
    if(stage)stage.draw();
  }
}

function loop(){update();draw();requestAnimationFrame(loop);}
loop();
console.log('🎮 MUSCLE TRAINER - Ready!');
console.log('Q: FAT+  E: MUSCLE+  R: Reset  ←→: Move  Space: Jump  Shift: Dash');