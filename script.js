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
    { id: 1, title: 'ଭାରତ-ପାକ ସୀମାରେ ଉତ୍ତେଜନା, ସୈନ୍ୟ ସତର୍କ', excerpt: 'ପାକିସ୍ତାନ ଆଡ଼ୁ ବାରମ୍ବାର ଉସ୍କାଣି ପରେ ଭାରତୀୟ ସେନା ସଂପୂର୍ଣ ପ୍ରସ୍ତୁତ। ରକ୍ଷା ମନ୍ତ୍ରୀ ସଂସଦରେ ବୟାନ ଦେଲେ।', body: 'ସୀମାରେ ସ୍ଥିତି ଉତ୍ତେଜନାପୂର୍ଣ ରହିଛି। ଭାରତୀୟ ସୁରକ୍ଷା ବଳ ନିଯୁକ୍ତି ବଢ଼ାଇ ହାଇ ଆଲର୍ଟ ଜାରି କରିଛନ୍ତି। ରକ୍ଷା ମନ୍ତ୍ରୀ ରାଜନାଥ ସିଂ କହିଛନ୍ତି ଯେ ଭାରତ ପ୍ରତ୍ୟେକ ପରିସ୍ଥିତି ପାଇଁ ପ୍ରସ୍ତୁତ। ସୀମାବର୍ତ୍ତୀ ଅଞ୍ଚଳରେ ନଜରଦାରି ବଢ଼ାଯାଇଛି।', category: 'ରାଜନୀତି', reporter: 'ସୁଭଙ୍ଗ ପ୍ରଧାନ', date: '2024-04-29', image: 'https://picsum.photos/seed/news1/800/500', status: 'published', featured: true, views: 15420 },
    { id: 2, title: 'IPL 2024: ମୁମ୍ବାଇ ଇଣ୍ଡିଆନ୍ସର ଅଭୂତପୂର୍ବ ଜୟ', excerpt: 'ମୁମ୍ବାଇ ଇଣ୍ଡିଆନ୍ସ ଦିଲ୍ଲୀ କ୍ୟାପିଟାଲ୍ସକୁ ୮ ୱିକେଟରେ ହରାଇଲା। ରୋହିତ ଶର୍ମାଙ୍କ ଝଡ଼ ବ୍ୟାଟିଂ।', body: 'ମୁମ୍ବାଇ ଇଣ୍ଡିଆନ୍ସ ଏକ ଅଭୂତପୂର୍ବ ପ୍ରଦର୍ଶନରେ ଦିଲ୍ଲୀ କ୍ୟାପିଟାଲ୍ସକୁ ୮ ୱିକେଟରେ ହରାଇଲା। ରୋହିତ ଶର୍ମା ୬୫ ବଲରେ ୮୯ ରନ ସ୍କୋର କଲେ। ଏହା ମୁମ୍ବାଇର ଏହି ସିଜନର ପଞ୍ଚମ ଜୟ।', category: 'ଖେଳ', reporter: 'ଅନୁଜ ନାୟକ', date: '2024-04-28', image: 'https://picsum.photos/seed/news2/800/500', status: 'published', featured: true, views: 22100 },
    { id: 3, title: 'ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର: ନୂଆ ଚଳଚ୍ଚିତ୍ରର ଟ୍ରେଲର ମୁକ୍ତ', excerpt: '"କିଙ୍ଗ" ଟ୍ରେଲର ଦେଖି ଭକ୍ତ ଦୀୱାନା। ୨୪ ଘଣ୍ଟାରେ ୫ କୋଟି ଭ୍ୟୁ।', body: 'ନୂଆ ଚଳଚ୍ଚିତ୍ର "କିଙ୍ଗ"ର ଟ୍ରେଲର ମୁକ୍ତ ପାଇଛି ଏବଂ ୨୪ ଘଣ୍ଟାରେ ୫ କୋଟିରୁ ଅଧିକ ଭ୍ୟୁ ମିଳିଛି। ଭକ୍ତ ସୋସିଆଲ ମିଡ଼ିଆରେ ଏହାର ପ୍ରଶଂସା କରୁଛନ୍ତି।', category: 'ମନୋରଞ୍ଜନ', reporter: 'ସ୍ୱପ୍ନା ଦାଶ', date: '2024-04-27', image: 'https://picsum.photos/seed/news3/800/500', status: 'published', featured: true, views: 31500 },
    { id: 4, title: 'ଶେୟାର ବଜାର: ସେନ୍ସେକ୍ସ ୧୨୦୦ ପଏଣ୍ଟ ଉପରେ, ବିନିଯୋଗକାରୀ ଖୁସି', excerpt: 'ବିଦେଶୀ ବିନିଯୋଗକାରୀଙ୍କ ଫେରାରୁ ବଜାରରେ ଉଛୁଳ। ନିଫ୍ଟି ମଧ୍ୟ ନୂଆ ରେକର୍ଡ ଗଢ଼ିଲା।', body: 'ଆଜି ମୁମ୍ବାଇ ଶେୟାର ବଜାରରେ ବ୍ୟାପକ ଉଲ୍ଲମ୍ଫ ଦେଖାଗଲା। ସେନ୍ସେକ୍ସ ୧୨୦୦ ପଏଣ୍ଟ ବୃଦ୍ଧି ସହ ବନ୍ଦ ହେଲା। ବିଦେଶୀ ସଂସ୍ଥାଗତ ବିନିଯୋଗକାରୀ ଏ ମାସ ୧୫ ହଜାର କୋଟି ଟଙ୍କାରୁ ଅଧିକ ବିନିଯୋଗ କରିଛନ୍ତି।', category: 'ବ୍ୟବସାୟ', reporter: 'ସଂଜୟ ମହାପାତ୍ର', date: '2024-04-26', image: 'https://picsum.photos/seed/news4/800/500', status: 'published', featured: false, views: 9800 },
    { id: 5, title: 'AI ବିପ୍ଲବ: ଭାରତରେ ୧୦ ଲକ୍ଷ ଚାକିରି ସଙ୍କଟ', excerpt: 'ଆର୍ଟିଫିସିଆଲ ଇଣ୍ଟେଲିଜେନ୍ସ IT କ୍ଷେତ୍ରରେ ବଡ଼ ପରିବର୍ତ୍ତନ ଆଣିବ ବୋଲି ଆଶଙ୍କା। ସରକାର ସଚେଷ୍ଟ।', body: 'ଦେଶରେ ଆର୍ଟିଫିସିଆଲ ଇଣ୍ଟେଲିଜେନ୍ସର ବଢ଼ୁଥିବା ପ୍ରଭାବ ନେଇ ଏକ ନୂଆ ରିପୋର୍ଟ ଆସିଛି ଯେଉଁଥିରେ କୁହାଯାଇଛି ଅଗଲା ପାଞ୍ଚ ବର୍ଷରେ ୧୦ ଲକ୍ଷରୁ ଅଧିକ ଚାକିରି ସଙ୍କଟରେ ପଡ଼ିପାରେ।', category: 'ପ୍ରଯୁକ୍ତି', reporter: 'ରାହୁଲ ବର୍ମା', date: '2024-04-25', image: 'https://picsum.photos/seed/news5/800/500', status: 'published', featured: false, views: 18200 },
    { id: 6, title: 'ୟୁକ୍ରେନ ଯୁଦ୍ଧ: ଆମେରିକା ଦେବ ୬୦ ଅରବ ଡଲାର ସାହାଯ୍ୟ', excerpt: 'ଆମେରିକୀ କଂଗ୍ରେସ ୟୁକ୍ରେନ ପାଇଁ ସାହାଯ୍ୟ ପ୍ୟାକେଜ ମଞ୍ଜୁର କଲା। ରୁଷ କଡ଼ା ଆପତ୍ତି ଜଣାଇଲା।', body: 'ଆମେରିକୀ କଂଗ୍ରେସ ୟୁକ୍ରେନ ପାଇଁ ୬୦ ଅରବ ଡଲାର ସାହାଯ୍ୟ ପ୍ୟାକେଜ ଅନୁମୋଦନ ଦେଇଛି। ଏଥିରେ ସାମରିକ ଓ ଆର୍ଥିକ ଉଭୟ ସାହାଯ୍ୟ ଅଛି। ରୁଷ ଏହି ସିଦ୍ଧାନ୍ତ ଉପରେ କଡ଼ା ଆପତ୍ତି ଜଣାଇଛି।', category: 'ଅନ୍ତର୍ଜାତୀୟ', reporter: 'ନେହା ମିଶ୍ର', date: '2024-04-24', image: 'https://picsum.photos/seed/news6/800/500', status: 'published', featured: false, views: 12300 },
    { id: 7, title: 'ଓଡ଼ିଶା ସରକାରଙ୍କ ବଡ଼ ଘୋଷଣା: ୫ ଲକ୍ଷ ଘର ତିଆରି ହେବ', excerpt: 'ଆବାସ ଯୋଜନା ଅଧୀନରେ ଅଗଲା ୫ ବର୍ଷ ଭିତରେ ୫ ଲକ୍ଷ ଘର ତିଆରି ଲକ୍ଷ୍ୟ।', body: 'ଓଡ଼ିଶା ମୁଖ୍ୟମନ୍ତ୍ରୀ ଆଜି ଏକ ବଡ଼ ଘୋଷଣା କରି କହିଛନ୍ତି ଯେ ସରକାର ଅଗଲା ପାଞ୍ଚ ବର୍ଷରେ ୫ ଲକ୍ଷ ଘର ତିଆରି କରିବ। ଏହା ଆବାସ ଯୋଜନାର ବିସ୍ତାର ହେବ।', category: 'ରାଜନୀତି', reporter: 'ଅମିତ ପଣ୍ଡା', date: '2024-04-23', image: 'https://picsum.photos/seed/news7/800/500', status: 'published', featured: false, views: 7600 },
    { id: 8, title: 'ଭୁବନେଶ୍ୱର ଓଡ଼ିଶା ବ୍ଲାଷ୍ଟର୍ସ: IPL ରୁ ନୂଆ ଇତିହାସ', excerpt: 'ଓଡ଼ିଶା ବ୍ଲାଷ୍ଟର୍ସ ପ୍ଲେ-ଅଫ ରଉଣ୍ଡ ଗଲା। ରାଜ୍ୟ ବ୍ୟାପୀ ଉତ୍ସାହ।', body: 'ଓଡ଼ିଶା ବ୍ଲାଷ୍ଟର୍ସ ଏକ ଐତିହାସିକ ଜୟ ସହ IPL ପ୍ଲେ-ଅଫ ଗଲେ। ସ୍ଥାନୀୟ ଖେଳାଳୀ ସୁଭଙ୍ଗ ପ୍ରଧାନ ୬୫ ବଲରେ ୯୨ ରନ ସ୍କୋର କଲେ। ରାଜ୍ୟ ଭରି ଖୁସି ତରଙ୍ଗ ଖେଳିଗଲା।', category: 'ଖେଳ', reporter: 'ସୁମିତ ରାୟ', date: '2024-04-22', image: 'https://picsum.photos/seed/news8/800/500', status: 'published', featured: false, views: 45000 },
  ];

  const videos = [
    { id: 1, title: 'ସୀମାରେ ଉତ୍ତେଜନା: ସମ୍ପୂର୍ଣ ରିପୋର୍ଟ ଦେଖନ୍ତୁ', thumb: 'https://picsum.photos/seed/vid1/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'ସୁଭଙ୍ଗ ପ୍ରଧାନ', date: '2024-04-29', views: 8500 },
    { id: 2, title: 'IPL 2024 ହାଇଲାଇଟ୍ସ: ମୁମ୍ବାଇ vs ଦିଲ୍ଲୀ', thumb: 'https://picsum.photos/seed/vid2/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'ଅନୁଜ ନାୟକ', date: '2024-04-28', views: 12000 },
    { id: 3, title: 'ନୂଆ ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର "ଜୟ ଓଡ଼ିଶା": ଟ୍ରେଲର ରିଭ୍ୟୁ', thumb: 'https://picsum.photos/seed/vid3/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'ସ୍ୱପ୍ନା ଦାଶ', date: '2024-04-27', views: 21000 },
    { id: 4, title: 'ଶେୟାର ବଜାରରେ ଉଲ୍ଲମ୍ଫ: କଣ ବିନିଯୋଗ କରିବେ?', thumb: 'https://picsum.photos/seed/vid4/400/250', youtubeId: 'dQw4w9WgXcQ', reporter: 'ସଂଜୟ ମହାପାତ୍ର', date: '2024-04-26', views: 5600 },
  ];

  const reporters = [
    { id: 1, name: 'ସୁଭଙ୍ଗ ପ୍ରଧାନ', role: 'ବରିଷ୍ଠ ସଂବାଦଦାତା', category: 'ରାଜନୀତି', email: 'rohit@mlf24.com', articles: 145, photo: 'https://picsum.photos/seed/rep1/100/100' },
    { id: 2, name: 'ସ୍ୱପ୍ନା ଦାଶ', role: 'ମନୋରଞ୍ଜନ ସଂପାଦକ', category: 'ମନୋରଞ୍ଜନ', email: 'priya@mlf24.com', articles: 89, photo: 'https://picsum.photos/seed/rep2/100/100' },
    { id: 3, name: 'ଅନୁଜ ନାୟକ', role: 'ଖେଳ ସଂବାଦଦାତା', category: 'ଖେଳ', email: 'anil@mlf24.com', articles: 201, photo: 'https://picsum.photos/seed/rep3/100/100' },
    { id: 4, name: 'ସଂଜୟ ମହାପାତ୍ର', role: 'ବ୍ୟବସାୟ ସଂବାଦଦାତା', category: 'ବ୍ୟବସାୟ', email: 'sanjay@mlf24.com', articles: 67, photo: 'https://picsum.photos/seed/rep4/100/100' },
  ];

  const epapers = [
    { id: 1, title: 'MLF News 24 - 29 April 2024', date: '29 April 2024', pages: 12, file: '#' },
    { id: 2, title: 'MLF News 24 - 28 April 2024', date: '28 April 2024', pages: 10, file: '#' },
    { id: 3, title: 'MLF News 24 - 27 April 2024', date: '27 April 2024', pages: 14, file: '#' },
    { id: 4, title: 'MLF News 24 - 26 April 2024', date: '26 April 2024', pages: 12, file: '#' },
    { id: 5, title: 'MLF News 24 - 25 April 2024', date: '25 April 2024', pages: 8, file: '#' },
    { id: 6, title: 'MLF News 24 - 24 April 2024', date: '24 April 2024', pages: 10, file: '#' },
    { id: 7, title: 'MLF News 24 - 23 April 2024', date: '23 April 2024', pages: 12, file: '#' },
    { id: 8, title: 'MLF News 24 - 22 April 2024', date: '22 April 2024', pages: 10, file: '#' },
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
    el.textContent = now.toLocaleString('or-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
        <a href="article.html?id=${a.id}" class="hero-read-btn">ସଂପୂର୍ଣ ଖବର ପଢ଼ନ୍ତୁ →</a>
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
  const cats = ['ରାଜନୀତି', 'ଖେଳ', 'ମନୋରଞ୍ଜନ', 'ବ୍ୟବସାୟ'];
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
          <a href="category.html?cat=${cat}" class="see-all-btn">${cat} ର ସମସ୍ତ ଖବର →</a>
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
  if (!article) { document.querySelector('.article-page').innerHTML = '<p>ଲେଖା ମିଳିଲା ନାହିଁ।</p>'; return; }

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
  const cat = params.get('cat') || 'ସବୁ';
  document.getElementById('catTitle').textContent = cat;
  document.title = cat + ' - MLF News 24';

  let articles = DB.get('articles').filter(a => a.status === 'published');
  if (cat !== 'ସବୁ') articles = articles.filter(a => a.category === cat);

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
        <div style="font-size:12px;color:#888;margin-top:4px">ପୃଷ୍ଠା: ${ep.pages}</div>
        <a href="${ep.file}" class="epaper-download">📥 PDF ଡାଉନଲୋଡ</a>
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
