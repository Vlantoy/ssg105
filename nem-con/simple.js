window.addEventListener('DOMContentLoaded',()=>{
 const game=window.game;if(!game)return;
 game.setGameMode('single');
 document.getElementById('card-mode-single').classList.add('active');
 for(const id of ['card-mode-bot','card-mode-versus'])document.getElementById(id)?.classList.remove('active');
 document.getElementById('btn-start-game').textContent='BẮT ĐẦU →';
 const guide=document.createElement('a');guide.href='tro-choi/?game=nem-con';guide.className='menu-opt-btn';guide.textContent='Hướng dẫn & câu chuyện ↗';guide.style.cssText='display:block;text-align:center;text-decoration:none;padding:12px';document.getElementById('hud-menu-dropdown').append(guide);
});
