(() => {
 const {games,galleries}=window.SONMACH;
 document.getElementById('home-dance').src=games['nhay-sap'].photo;
 document.getElementById('home-throw').src=games['nem-con'].photo;
 const grid=document.getElementById('game-grid');
 for(const [slug,g] of Object.entries(games)){
  const card=document.createElement('article');card.className='game-card';card.dataset.reveal='';
  card.innerHTML=`<a class="game-image" href="tro-choi/?game=${slug}" aria-label="Tìm hiểu ${g.title}"><img src="${g.photo}" alt="${g.photoAlt}" loading="lazy"><span class="image-open" aria-hidden="true">↗</span></a><div class="game-content"><h3>${g.title}</h3><p>${g.description}</p><div class="card-actions"><a class="text-link" href="tro-choi/?game=${slug}">Tìm hiểu trò chơi <span aria-hidden="true">↗</span></a><a class="button small" href="${g.play.replace('../','')}">Chơi ngay <span aria-hidden="true">→</span></a></div></div>`;
  grid.append(card);
 }
 const duel=document.createElement('article');duel.className='game-card';duel.dataset.reveal='';
 duel.innerHTML=`<a class="game-image" href="day-gay/" aria-label="Chơi Đẩy gậy"><img src="portal/assets/photos/day-gay.jpg" style="object-position:center 64%" alt="Hai vận động viên thi đấu đẩy gậy, ảnh tư liệu từ Cổng thông tin Lai Châu" loading="lazy"><span class="image-open" aria-hidden="true">↗</span></a><div class="game-content"><h3>Đẩy gậy</h3><p>Giữ thế, chớp thời cơ và dồn lực. Thử sức với máy hoặc rủ một người bạn cùng bước vào sân hội pixel.</p><div class="card-actions"><span>Đấu máy · 2 người</span><a class="button small" href="day-gay/">Chơi ngay <span aria-hidden="true">→</span></a></div></div>`;
 grid.append(duel);
 const topCard=document.createElement('article');topCard.className='game-card';topCard.dataset.reveal='';
 topCard.innerHTML=`<a class="game-image" href="danh-quay/" aria-label="Chơi Đánh quay 3D"><img src="portal/assets/photos/danh-quay.jpg" alt="Người Mông tung quay trong ngày hội, ảnh tư liệu từ SCOV" loading="lazy"><span class="image-open" aria-hidden="true">↗</span></a><div class="game-content"><h3>Đánh quay</h3><p>Giữ lấy đà, thả lao tới. Canh hướng, né đòn và hất đối thủ khỏi vòng. Thắng hai hiệp để giành trận đấu quay 3D.</p><div class="card-actions"><span>3D · Đấu trực tiếp</span><a class="button small" href="danh-quay/">Chơi ngay <span aria-hidden="true">→</span></a></div></div>`;
 grid.append(topCard);
 const stilts=document.createElement('article');stilts.className='game-card';stilts.dataset.reveal='';
 stilts.innerHTML=`<a class="game-image" href="ca-kheo/" aria-label="Chơi Đi cà kheo"><img src="portal/assets/photos/ca-kheo.jpg" alt="Người dân và trẻ em tập đi cà kheo, ảnh tư liệu Báo Dân trí" loading="lazy"><span class="image-open" aria-hidden="true">↗</span></a><div class="game-content"><h3>Đi cà kheo</h3><p>Giữ đưa chân, thả đặt bước. Qua bậc đá và khe suối để về đích trên đôi cà kheo tre.</p><div class="card-actions"><span>Pixel · Từng bước về đích</span><a class="button small" href="ca-kheo/">Chơi ngay →</a></div></div>`;grid.append(stilts);
 const crossbow=document.createElement('article');crossbow.className='game-card';crossbow.dataset.reveal='';
 crossbow.innerHTML=`<a class="game-image" href="ban-no/" aria-label="Chơi Bắn nỏ"><img src="portal/assets/photos/ban-no.jpg" alt="Người Chơro hướng dẫn trải nghiệm bắn nỏ, ảnh Minh Anh / VietNamNet" loading="lazy"><span class="image-open" aria-hidden="true">↗</span></a><div class="game-content"><h3>Bắn nỏ</h3><p>Ngắm bia, kéo dây và thả tên. Quan sát độ rơi để chỉnh từng cú bắn trong thử thách 3D năm mũi tên.</p><div class="card-actions"><span>3D · Ngắm bia tính điểm</span><a class="button small" href="ban-no/">Chơi ngay →</a></div></div>`;grid.append(crossbow);
 const scenes=[{...galleries['nem-con'][0],title:'Gặp nhau trong ngày hội',text:'Không gian lễ hội Roóng Poọc ở Sa Pa.',href:'tro-choi/?game=nem-con#cau-chuyen'}, {...galleries['nhay-sap'][0],title:'Cùng nghe, cùng bước',text:'Nhảy sạp cộng đồng tại Thái Nguyên năm 2026.',href:'tro-choi/?game=nhay-sap#hinh-anh'}];
 for(const scene of scenes){const figure=document.createElement('figure');figure.dataset.reveal='';figure.innerHTML=`<a href="${scene.href}"><img src="${scene.src}" alt="${scene.caption}" loading="lazy"></a><figcaption><h3><a href="${scene.href}">${scene.title} ↗</a></h3><p>${scene.text}</p><a class="credit" href="${scene.source}" target="_blank" rel="noopener">Ảnh: ${scene.credit} ↗</a></figcaption>`;document.getElementById('festival-grid').append(figure);}
})();
