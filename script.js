// ===== MLF NEWS 24 - MASTER SCRIPT =====

// ===== LOCAL STORAGE DATA STORE =====
// DB = localStorage (replaced by Supabase)
const _DB_UNUSED = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('mlf24_' + key)) || []; } catch { return []; } },
  set: (key, val) => localStorage.setItem('mlf24_' + key, JSON.stringify(val)),
  getObj: (key, def = {}) => { try { return JSON.parse(localStorage.getItem('mlf24_' + key)) || def; } catch { return def; } },
  setObj: (key, val) => localStorage.setItem('mlf24_' + key, JSON.stringify(val)),
};

// ===== SEED DEFAULT DATA =====
function seedData() {
  if (DB.get('seeded').length > 0) return;

  const articles = [
    { id: 1, title: 'भारत-पाक सीमा पर तनाव, सेना अलर्ट पर', excerpt: 'पाकिस्तान की तरफ से लगातार उकसावे के बाद भारतीय सेना ने पूर्ण तैयारी कर ली है। रक्षा मंत्री ने संसद में बयान दिया।', body: 'सीमा पर स्थिति तनावपूर्ण बनी हुई है। भारतीय सुरक्षा बलों ने अपनी तैनाती बढ़ा दी है और हाई अलर्ट जारी किया गया है। रक्षा मंत्री राजनाथ सिंह ने कहा कि भारत हर परिस्थिति के लिए तैयार है और देश की संप्रभुता से कोई समझौता नहीं होगा। सेना प्रमुख ने भी कहा कि सीमावर्ती इलाकों में चौकसी बढ़ाई गई है।', category: 'राजनीति', reporter: 'रोहित शर्मा', date: '2024-04-29', image: 'https://picsum.photos/seed/news1/800/500', status: 'published', featured: true, views: 15420 },
    { id: 2, title: 'IPL 2024: मुंबई इंडियंस की शानदार जीत', excerpt: 'मुंबई इंडियंस ने दिल्ली कैपिटल्स को 8 विकेट से हराया। रोहित शर्मा की धुआंधार बल्लेबाज़ी।', body: 'मुंबई इंडियंस ने एक शानदार प्रदर्शन में दिल्ली कैपिटल्स को 8 विकेट से हरा दिया। रोहित शर्मा ने 65 गेंदों में 89 रन बनाए और टीम को जीत दिलाई। यह मुंबई की इस सीजन की पांचवीं जीत है।', category: 'खेल', reporter: 'अनिल कुमार', date: '2024-04-28', image: 'https://picsum.photos/seed/news2/800/500', status: 'published', featured: true, views: 22100 },
    { id: 3, title: 'बॉलीवुड: शाहरुख की नई फिल्म का ट्रेलर रिलीज़', excerpt: '"किंग" का ट्रेलर देखकर फैंस हुए दीवाने। 24 घंटे में 50 मिलियन व्यूज़।', body: 'शाहरुख खान की नई फिल्म "किंग" का ट्रेलर रिलीज़ हो गया है और इसने 24 घंटों में 50 मिलियन से अधिक व्यूज़ हासिल कर लिए हैं। फैंस ट्विटर पर इसकी जमकर तारीफ कर रहे हैं।', category: 'मनोरंजन', reporter: 'प्रिया सिंह', date: '2024-04-27', image: 'https://picsum.photos/seed/news3/800/500', status: 'published', featured: true, views: 31500 },
    { id: 4, title: 'शेयर बाज़ार: सेंसेक्स 1200 अंक ऊपर, निवेशकों में खुशी', excerpt: 'विदेशी निवेशकों की वापसी से बाज़ार में उछाल। निफ्टी ने भी नया रिकॉर्ड बनाया।', body: 'मुंबई शेयर बाज़ार में आज जबरदस्त तेजी देखी गई। सेंसेक्स 1200 अंक की बढ़त के साथ बंद हुआ। विदेशी संस्थागत निवेशकों ने इस महीने अब तक 15000 करोड़ रुपये से अधिक का निवेश किया है।', category: 'व्यापार', reporter: 'संजय गुप्ता', date: '2024-04-26', image: 'https://picsum.photos/seed/news4/800/500', status: 'published', featured: false, views: 9800 },
    { id: 5, title: 'AI क्रांति: भारत में 10 लाख नौकरियाँ खत्म होने का डर', excerpt: 'आर्टिफिशियल इंटेलिजेंस से IT सेक्टर में बड़े बदलाव की आशंका। सरकार सतर्क।', body: 'देश में आर्टिफिशियल इंटेलिजेंस के बढ़ते प्रभाव को लेकर एक नई रिपोर्ट सामने आई है जिसमें कहा गया है कि अगले पांच साल में भारत में 10 लाख से अधिक नौकरियाँ खतरे में पड़ सकती हैं।', category: 'तकनीक', reporter: 'राहुल वर्मा', date: '2024-04-25', image: 'https://picsum.photos/seed/news5/800/500', status: 'published', featured: false, views: 18200 },
    { id: 6, title: 'यूक्रेन युद्ध: अमेरिका देगा 60 अरब डॉलर की मदद', excerpt: 'अमेरिकी कांग्रेस ने यूक्रेन के लिए सहायता पैकेज मंजूर किया। रूस ने जताई कड़ी आपत्ति।', body: 'अमेरिकी कांग्रेस ने यूक्रेन के लिए 60 अरब डॉलर के सहायता पैकेज को मंजूरी दे दी है। इसमें सैन्य और आर्थिक दोनों तरह की सहायता शामिल है। रूस ने इस फैसले पर कड़ी आपत्ति जताई है।', category: 'अंतरराष्ट्रीय', reporter: 'नेहा मिश्रा', date: '2024-04-24', image: 'https://picsum.photos/seed/news6/800/500', status: 'published', featured: false, views: 12300 },
    { id: 7, title: 'मोदी सरकार का बड़ा ऐलान: 5 करोड़ मकान बनेंगे', excerpt: 'प्रधानमंत्री आवास योजना के तहत अगले 5 साल में 5 करोड़ मकान बनाने का लक्ष्य।', body: 'प्रधानमंत्री नरेंद्र मोदी ने आज एक बड़ी घोषणा करते हुए कहा कि सरकार अगले पांच वर्षों में 5 करोड़ मकान बनाएगी। यह प्रधानमंत्री आवास योजना का विस्तार होगा।', category: 'राजनीति', reporter: 'अमित पांडे', date: '2024-04-23', image: 'https://picsum.photos/seed/news7/800/500', status: 'published', featured: false, views: 7600 },
    { id: 8, title: 'विराट कोहली ने की शतकों की शतकी, बने महान', excerpt: '100वां अंतरराष्ट्रीय शतक पूरा कर विराट ने सचिन की बराबरी की।', body: 'भारत के महान बल्लेबाज विराट कोहली ने अपना 100वां अंतरराष्ट्रीय शतक पूरा कर एक नया इतिहास रच दिया है। इसके साथ ही उन्होंने सचिन तेंदुलकर की बराबरी कर ली है।', category: 'खेल', reporter: 'सुमित राय', date: '2024-04-22', image: 'https://picsum.photos/seed/news8/800/500', status: 'published', featured: false, views: 45000 },
  ];

  const videos = [
    { id: 1, title: 'सीमा पर तनाव: देखिए पूरी रिपोर्ट', thumb: 'https://picsum.photos/seed/vid1/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'रोहित शर्मा', date: '2024-04-29', views: 8500 },
    { id: 2, title: 'IPL 2024 हाइलाइट्स: मुंबई vs दिल्ली', thumb: 'https://picsum.photos/seed/vid2/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'अनिल कुमार', date: '2024-04-28', views: 12000 },
    { id: 3, title: 'शाहरुख की "किंग": ट्रेलर रिव्यू', thumb: 'https://picsum.photos/seed/vid3/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'प्रिया सिंह', date: '2024-04-27', views: 21000 },
    { id: 4, title: 'शेयर बाज़ार में उछाल: क्या निवेश करें?', thumb: 'https://picsum.photos/seed/vid4/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'संजय गुप्ता', date: '2024-04-26', views: 5600 },
  ];

  const reporters = [
    { id: 1, name: 'रोहित शर्मा', role: 'वरिष्ठ संवाददाता', category: 'राजनीति', email: 'rohit@mlf24.com', articles: 145, photo: 'https://picsum.photos/seed/rep1/100/100' },
    { id: 2, name: 'प्रिया सिंह', role: 'मनोरंजन संपादक', category: 'मनोरंजन', email: 'priya@mlf24.com', articles: 89, photo: 'https://picsum.photos/seed/rep2/100/100' },
    { id: 3, name: 'अनिल कुमार', role: 'खेल संवाददाता', category: 'खेल', email: 'anil@mlf24.com', articles: 201, photo: 'https://picsum.photos/seed/rep3/100/100' },
    { id: 4, name: 'संजय गुप्ता', role: 'बिज़नेस रिपोर्टर', category: 'व्यापार', email: 'sanjay@mlf24.com', articles: 67, photo: 'https://picsum.photos/seed/rep4/100/100' },
  ];

  const epapers = [
    { id: 1, title: 'MLF News 24 - 29 अप्रैल 2024', date: '29 April 2024', pages: 12, file: '#' },
    { id: 2, title: 'MLF News 24 - 28 अप्रैल 2024', date: '28 April 2024', pages: 10, file: '#' },
    { id: 3, title: 'MLF News 24 - 27 अप्रैल 2024', date: '27 April 2024', pages: 14, file: '#' },
    { id: 4, title: 'MLF News 24 - 26 अप्रैल 2024', date: '26 April 2024', pages: 12, file: '#' },
    { id: 5, title: 'MLF News 24 - 25 अप्रैल 2024', date: '25 April 2024', pages: 8, file: '#' },
    { id: 6, title: 'MLF News 24 - 24 अप्रैल 2024', date: '24 April 2024', pages: 10, file: '#' },
    { id: 7, title: 'MLF News 24 - 23 अप्रैल 2024', date: '23 April 2024', pages: 12, file: '#' },
    { id: 8, title: 'MLF News 24 - 22 अप्रैल 2024', date: '22 April 2024', pages: 10, file: '#' },
  ];

  const ads = [
    { id: 1, title: 'Amazon Summer Sale', position: 'header', imageUrl: 'https://picsum.photos/seed/ad1/970/90', linkUrl: '#', active: true },
    { id: 2, title: 'Flipkart Big Sale', position: 'sidebar', imageUrl: 'https://picsum.photos/seed/ad2/300/250', linkUrl: '#', active: true },
    { id: 3, title: 'JioCinema Promo', position: 'article-middle', imageUrl: 'https://picsum.photos/seed/ad3/728/90', linkUrl: '#', active: false },
  ];

  DB.set('articles', articles);
  DB.set('videos', videos);
  DB.set('reporters', reporters);
  DB.set('epapers', epapers);
  DB.set('ads', ads);
  DB.set('seeded', [1]);
}

// ===== LIVE CLOCK =====
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = now.toLocaleString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  update();
  setInterval(update, 1000);
}

// ===== BREAKING TICKER =====
function loadTicker() {
  const el = document.getElementById('breakingTicker');
  if (!el) return;
  const articles = DB.get('articles').filter(a => a.status === 'published').slice(0, 6);
  el.innerHTML = articles.map(a => `<span class="ticker-item">${a.title}</span>`).join('');
  // duplicate for loop
  el.innerHTML += el.innerHTML;
}

// ===== HERO SLIDER =====
let heroIdx = 0;
function loadHero() {
  const container = document.getElementById('heroSlider');
  const dots = document.getElementById('heroDots');
  if (!container) return;
  const featured = DB.get('articles').filter(a => a.status === 'published' && a.featured);
  if (!featured.length) return;

  container.innerHTML = featured.map(a => `
    <div class="hero-slide" style="background-image:url(${a.image})" onclick="goArticle(${a.id})">
      <div class="hero-content">
        <span class="hero-category">${a.category}</span>
        <h1 class="hero-title">${a.title}</h1>
        <p class="hero-excerpt">${a.excerpt}</p>
        <div class="hero-meta">
          <span class="reporter">✍ ${a.reporter}</span> &nbsp;|&nbsp; 📅 ${a.date} &nbsp;|&nbsp; 👁 ${a.views.toLocaleString()}
        </div>
        <a href="article.html?id=${a.id}" class="hero-read-btn">Read Full Story →</a>
      </div>
    </div>
  `).join('');

  if (dots) {
    dots.innerHTML = featured.map((_, i) => `<button class="hero-dot ${i===0?'active':''}" onclick="goSlide(${i})"></button>`).join('');
  }

  setInterval(() => goSlide((heroIdx + 1) % featured.length), 5000);
}

function goSlide(idx) {
  heroIdx = idx;
  const slider = document.getElementById('heroSlider');
  if (slider) slider.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

function goArticle(id) {
  window.location.href = `article.html?id=${id}`;
}

// ===== TOP STORIES =====
function loadTopStories() {
  const grid = document.getElementById('topStoriesGrid');
  if (!grid) return;
  const articles = DB.get('articles').filter(a => a.status === 'published').slice(0, 5);
  grid.innerHTML = articles.map((a, i) => `
    <a href="article.html?id=${a.id}" class="story-card ${i===0?'featured':''}">
      <div class="card-img" style="background-image:url(${a.image})">
        <span class="card-category">${a.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${a.title}</h3>
        <p class="card-excerpt">${a.excerpt}</p>
        <div class="card-meta">
          <span class="card-reporter">✍ ${a.reporter}</span>
          <span>📅 ${a.date}</span>
        </div>
      </div>
    </a>
  `).join('');
}

// ===== TRENDING =====
function loadTrending() {
  const list = document.getElementById('trendingList');
  if (!list) return;
  const articles = DB.get('articles').filter(a => a.status === 'published').sort((a,b) => b.views - a.views).slice(0, 6);
  list.innerHTML = articles.map(a => `
    <li onclick="goArticle(${a.id})">${a.title}</li>
  `).join('');
}

// ===== CATEGORY SECTIONS =====
function loadCategorySections() {
  const el = document.getElementById('categorySections');
  if (!el) return;
  const cats = ['राजनीति', 'खेल', 'मनोरंजन', 'व्यापार'];
  const articles = DB.get('articles').filter(a => a.status === 'published');
  el.innerHTML = cats.map(cat => {
    const catArticles = articles.filter(a => a.category === cat).slice(0, 4);
    if (!catArticles.length) return '';
    return `
      <section class="cat-section">
        <h2 class="section-title"><span>${cat}</span></h2>
        <div class="cat-grid">
          ${catArticles.map(a => `
            <a href="article.html?id=${a.id}" class="story-card">
              <div class="card-img" style="background-image:url(${a.image})">
                <span class="card-category">${a.category}</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">${a.title}</h3>
                <div class="card-meta">
                  <span class="card-reporter">✍ ${a.reporter}</span>
                  <span>${a.date}</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
        <div style="text-align:right;margin-top:12px">
          <a href="category.html?cat=${cat}" class="see-all-btn">${cat} All News →</a>
        </div>
      </section>
    `;
  }).join('');
}

// ===== HOME VIDEO GRID =====
function loadHomeVideos() {
  const grid = document.getElementById('homeVideoGrid');
  if (!grid) return;
  const videos = DB.get('videos').slice(0, 4);
  grid.innerHTML = videos.map(v => `
    <a href="video.html?id=${v.id}" class="video-card">
      <div class="video-thumb" style="background-image:url(${v.thumb})">
        <div class="play-icon">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">✍ ${v.reporter} • 👁 ${v.views.toLocaleString()}</div>
      </div>
    </a>
  `).join('');
}

// ===== ARTICLE PAGE =====
function loadArticlePage() {
  if (!document.querySelector('.article-page')) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const article = DB.get('articles').find(a => a.id === id);
  if (!article) { document.querySelector('.article-page').innerHTML = '<p>Article not found।</p>'; return; }

  // increment views
  const articles = DB.get('articles');
  const idx = articles.findIndex(a => a.id === id);
  if (idx > -1) { articles[idx].views++; DB.set('articles', articles); }

  document.title = article.title + ' - MLF News 24';
  document.getElementById('artCategory').textContent = article.category;
  document.getElementById('artTitle').textContent = article.title;
  document.getElementById('artReporter').textContent = '✍ ' + article.reporter;
  document.getElementById('artDate').textContent = '📅 ' + article.date;
  document.getElementById('artViews').textContent = '👁 ' + article.views.toLocaleString();
  document.getElementById('artHeroImg').style.backgroundImage = `url(${article.image})`;
  document.getElementById('artBody').innerHTML = article.body.split('\n').map(p => `<p>${p}</p>`).join('');

  // Related
  const related = DB.get('articles').filter(a => a.id !== id && a.status === 'published').slice(0, 3);
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid) {
    relGrid.innerHTML = related.map(a => `
      <a href="article.html?id=${a.id}" class="story-card">
        <div class="card-img" style="background-image:url(${a.image})">
          <span class="card-category">${a.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.title}</h3>
          <div class="card-meta"><span class="card-reporter">✍ ${a.reporter}</span></div>
        </div>
      </a>
    `).join('');
  }
}

// ===== CATEGORY PAGE =====
function loadCategoryPage() {
  if (!document.querySelector('.category-page')) return;
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'सभी';
  document.getElementById('catTitle').textContent = cat;
  document.title = cat + ' - MLF News 24';

  let articles = DB.get('articles').filter(a => a.status === 'published');
  if (cat !== 'सभी') articles = articles.filter(a => a.category === cat);

  const grid = document.getElementById('catArticlesGrid');
  if (grid) {
    grid.innerHTML = articles.map(a => `
      <a href="article.html?id=${a.id}" class="story-card">
        <div class="card-img" style="background-image:url(${a.image})">
          <span class="card-category">${a.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.title}</h3>
          <p class="card-excerpt">${a.excerpt}</p>
          <div class="card-meta">
            <span class="card-reporter">✍ ${a.reporter}</span>
            <span>📅 ${a.date}</span>
          </div>
        </div>
      </a>
    `).join('');
  }
}

// ===== VIDEO PAGE =====
function loadVideoPage() {
  const grid = document.getElementById('videoPageGrid');
  if (!grid) return;
  const videos = DB.get('videos');
  grid.innerHTML = videos.map(v => `
    <div class="video-card" onclick="playVideo('${v.youtubeId}', '${v.title}')">
      <div class="video-thumb" style="background-image:url(${v.thumb})">
        <div class="play-icon">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">✍ ${v.reporter} | 📅 ${v.date} | 👁 ${v.views.toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

function playVideo(ytId, title) {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  const titleEl = document.getElementById('videoModalTitle');
  if (!modal) return;
  frame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  if (titleEl) titleEl.textContent = title;
  modal.style.display = 'flex';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  if (modal) modal.style.display = 'none';
  if (frame) frame.src = '';
}

// ===== E-PAPER PAGE =====
function loadEpaperPage() {
  const grid = document.getElementById('epaperGrid');
  if (!grid) return;
  const epapers = DB.get('epapers');
  grid.innerHTML = epapers.map((ep, i) => `
    <div class="epaper-card">
      <div class="epaper-thumb">📰</div>
      <div class="epaper-info">
        <div class="epaper-date">${ep.date}</div>
        <div class="epaper-title">${ep.title}</div>
        <div style="font-size:12px;color:#888;margin-top:4px">पृष्ठ: ${ep.pages}</div>
        <a href="${ep.file}" class="epaper-download">📥 PDF डाउनलोड करें</a>
      </div>
    </div>
  `).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  seedData();
  startClock();
  loadTicker();
  loadHero();
  loadTopStories();
  loadTrending();
  loadCategorySections();
  loadHomeVideos();
  loadArticlePage();
  loadCategoryPage();
  loadVideoPage();
  loadEpaperPage();
});
