// ===== MLF NEWS 24 - MASTER SCRIPT =====
// Primary: Supabase | Language: Odia + English

// ===== LOCAL STORAGE (Admin only fallback) =====
const DB = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('mlf24_' + key)) || []; } catch { return []; } },
  set: (key, val) => localStorage.setItem('mlf24_' + key, JSON.stringify(val)),
  getObj: (key, def = {}) => { try { return JSON.parse(localStorage.getItem('mlf24_' + key)) || def; } catch { return def; } },
  setObj: (key, val) => localStorage.setItem('mlf24_' + key, JSON.stringify(val)),
};

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
async function loadTicker() {
  const el = document.getElementById('breakingTicker');
  if (!el) return;
  try {
    const items = await getTicker();
    if (items.length > 0) {
      el.innerHTML = items.map(t => `<span class="ticker-item">${t.text}</span>`).join('');
    } else {
      // fallback: latest articles
      const articles = await getArticles({ limit: 6 });
      el.innerHTML = articles.map(a => `<span class="ticker-item">${a.title}</span>`).join('');
    }
    el.innerHTML += el.innerHTML;
  } catch(e) {
    console.error('Ticker load failed:', e);
  }
}

// ===== HERO SLIDER =====
let heroIdx = 0;
async function loadHero() {
  const container = document.getElementById('heroSlider');
  const dots = document.getElementById('heroDots');
  if (!container) return;
  try {
    const featured = await getArticles({ featured: true, limit: 5 });
    if (!featured.length) return;

    container.innerHTML = featured.map(a => `
      <div class="hero-slide" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/'+a.id+'/800/500'})" onclick="goArticle('${a.slug || a.id}')">
        <div class="hero-content">
          <span class="hero-category">${a.category}</span>
          <h1 class="hero-title">${a.title}</h1>
          <p class="hero-excerpt">${a.excerpt || ''}</p>
          <div class="hero-meta">
            <span class="reporter">✍ ${a.reporter_name || ''}</span> &nbsp;|&nbsp;
            📅 ${formatDate(a.published_at || a.created_at)} &nbsp;|&nbsp;
            👁 ${(a.views || 0).toLocaleString()}
          </div>
          <a href="article.html?id=${a.id}" class="hero-read-btn">ସଂପୂର୍ଣ ଖବର ପଢ଼ନ୍ତୁ →</a>
        </div>
      </div>
    `).join('');

    if (dots) {
      dots.innerHTML = featured.map((_, i) => `<button class="hero-dot ${i===0?'active':''}" onclick="goSlide(${i})"></button>`).join('');
    }
    setInterval(() => goSlide((heroIdx + 1) % featured.length), 5000);
  } catch(e) {
    console.error('Hero load failed:', e);
  }
}

function goSlide(idx) {
  heroIdx = idx;
  const slider = document.getElementById('heroSlider');
  if (slider) slider.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

function goArticle(idOrSlug) {
  window.location.href = `article.html?id=${idOrSlug}`;
}

// ===== TOP STORIES =====
async function loadTopStories() {
  const grid = document.getElementById('topStoriesGrid');
  if (!grid) return;
  try {
    const articles = await getArticles({ limit: 5 });
    grid.innerHTML = articles.map((a, i) => `
      <a href="article.html?id=${a.id}" class="story-card ${i===0?'featured':''}">
        <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/'+a.id+'/800/500'})">
          <span class="card-category">${a.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.title}</h3>
          <p class="card-excerpt">${a.excerpt || ''}</p>
          <div class="card-meta">
            <span class="card-reporter">✍ ${a.reporter_name || ''}</span>
            <span>📅 ${formatDate(a.published_at || a.created_at)}</span>
          </div>
        </div>
      </a>
    `).join('');
  } catch(e) {
    console.error('Top stories load failed:', e);
  }
}

// ===== TRENDING =====
async function loadTrending() {
  const list = document.getElementById('trendingList');
  if (!list) return;
  try {
    const { data } = await db.from('articles')
      .select('id, title, views')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(6);
    const articles = data || [];
    list.innerHTML = articles.map(a => `
      <li onclick="goArticle('${a.id}')" style="cursor:pointer">${a.title}</li>
    `).join('');
  } catch(e) {
    console.error('Trending load failed:', e);
  }
}

// ===== CATEGORY SECTIONS =====
async function loadCategorySections() {
  const el = document.getElementById('categorySections');
  if (!el) return;
  try {
    const cats = ['ରାଜନୀତି', 'ଖେଳ', 'ମନୋରଞ୍ଜନ', 'ବ୍ୟବସାୟ'];
    const { data: allArticles } = await db.from('articles')
      .select('*')
      .eq('status', 'published')
      .in('category', cats)
      .order('created_at', { ascending: false })
      .limit(40);

    const articles = allArticles || [];
    el.innerHTML = cats.map(cat => {
      const catArticles = articles.filter(a => a.category === cat).slice(0, 4);
      if (!catArticles.length) return '';
      return `
        <section class="cat-section">
          <h2 class="section-title"><span>${cat}</span></h2>
          <div class="cat-grid">
            ${catArticles.map(a => `
              <a href="article.html?id=${a.id}" class="story-card">
                <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/'+a.id+'/800/500'})">
                  <span class="card-category">${a.category}</span>
                </div>
                <div class="card-body">
                  <h3 class="card-title">${a.title}</h3>
                  <div class="card-meta">
                    <span class="card-reporter">✍ ${a.reporter_name || ''}</span>
                    <span>${formatDate(a.published_at || a.created_at)}</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
          <div style="text-align:right;margin-top:12px">
            <a href="category.html?cat=${encodeURIComponent(cat)}" class="see-all-btn">${cat} ର ସମସ୍ତ ଖବର →</a>
          </div>
        </section>
      `;
    }).join('');
  } catch(e) {
    console.error('Category sections load failed:', e);
  }
}

// ===== HOME VIDEO GRID =====
async function loadHomeVideos() {
  const grid = document.getElementById('homeVideoGrid');
  if (!grid) return;
  try {
    const videos = await getVideos(4);
    if (!videos.length) { grid.innerHTML = '<p style="color:#888;padding:20px">କୌଣସି Video ନାହିଁ।</p>'; return; }
    grid.innerHTML = videos.map(v => `
      <a href="video.html?id=${v.id}" class="video-card">
        <div class="video-thumb" style="background-image:url(${v.thumbnail_url || 'https://img.youtube.com/vi/'+v.youtube_id+'/hqdefault.jpg'})">
          <div class="play-icon">▶</div>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-meta">✍ ${v.reporter_name || ''} • 👁 ${(v.views || 0).toLocaleString()}</div>
        </div>
      </a>
    `).join('');
  } catch(e) {
    console.error('Home videos load failed:', e);
  }
}

// ===== LOAD ADS =====
async function loadAds() {
  try {
    const ads = await getAds();

    // Sidebar ad
    const sidebarAd = ads.find(a => a.position === 'sidebar');
    const sidebarEl = document.getElementById('sidebarAd');
    if (sidebarAd && sidebarEl && sidebarAd.image_url) {
      sidebarEl.innerHTML = `
        <a href="${sidebarAd.link_url || '#'}" target="_blank">
          <img src="${sidebarAd.image_url}" alt="${sidebarAd.title}"
               style="width:100%;height:250px;object-fit:cover;border-radius:6px;display:block;">
        </a>`;
    }

    // Bottom ad
    const bottomAd = ads.find(a => a.position === 'header' || a.position === 'footer');
    const bottomEl = document.getElementById('bottomAd');
    if (bottomAd && bottomEl && bottomAd.image_url) {
      bottomEl.innerHTML = `
        <a href="${bottomAd.link_url || '#'}" target="_blank">
          <img src="${bottomAd.image_url}" alt="${bottomAd.title}"
               style="width:100%;max-width:970px;height:90px;object-fit:cover;border-radius:6px;display:block;margin:0 auto;">
        </a>`;
    }

    // Article middle ad
    const midAd = ads.find(a => a.position === 'article-middle');
    const midEl = document.getElementById('articleMidAd');
    if (midAd && midEl && midAd.image_url) {
      midEl.innerHTML = `
        <a href="${midAd.link_url || '#'}" target="_blank">
          <img src="${midAd.image_url}" alt="${midAd.title}"
               style="width:100%;max-width:728px;height:90px;object-fit:cover;border-radius:6px;display:block;margin:0 auto;">
        </a>`;
    }
  } catch(e) {
    console.error('Ads load failed:', e);
  }
}

// ===== SOCIAL LINKS FROM SUPABASE =====
async function loadSocialLinks() {
  try {
    const settings = await getSiteSettings();
    const map = {
      'facebook_url': 'socialFb',
      'youtube_url': 'socialYt',
      'instagram_url': 'socialIg',
      'whatsapp_number': 'socialWa',
    };
    Object.entries(map).forEach(([key, elId]) => {
      const el = document.getElementById(elId);
      if (!el || !settings[key]) return;
      if (key === 'whatsapp_number') {
        el.href = 'https://wa.me/' + settings[key].replace(/[^0-9]/g, '');
      } else {
        el.href = settings[key];
      }
    });
  } catch(e) {
    console.error('Social links load failed:', e);
  }
}

// ===== ARTICLE PAGE =====
async function loadArticlePage() {
  if (!document.querySelector('.article-page')) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  try {
    const article = await getArticleById(id);
    if (!article) {
      document.querySelector('.article-page').innerHTML = '<p style="padding:40px;color:#888">ଲେଖା ମିଳିଲା ନାହିଁ।</p>';
      return;
    }

    // Increment views
    try { await incrementViews(id); } catch(e) {}

    document.title = article.title + ' - MLF News 24';
    const setEl = (elId, val) => { const el = document.getElementById(elId); if (el) el.textContent = val; };
    setEl('artCategory', article.category);
    setEl('artTitle', article.title);
    setEl('artReporter', '✍ ' + (article.reporter_name || ''));
    setEl('artDate', '📅 ' + formatDate(article.published_at || article.created_at));
    setEl('artViews', '👁 ' + (article.views || 0).toLocaleString());

    const heroImg = document.getElementById('artHeroImg');
    if (heroImg) heroImg.style.backgroundImage = `url(${article.image_url || ''})`;

    const body = document.getElementById('artBody');
    if (body) body.innerHTML = (article.body || '').split('\n').map(p => p ? `<p>${p}</p>` : '').join('');

    // Related articles
    const { data: related } = await db.from('articles')
      .select('*')
      .eq('status', 'published')
      .neq('id', id)
      .eq('category', article.category)
      .limit(3);

    const relGrid = document.getElementById('relatedGrid');
    if (relGrid && related?.length) {
      relGrid.innerHTML = related.map(a => `
        <a href="article.html?id=${a.id}" class="story-card">
          <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/'+a.id+'/800/500'})">
            <span class="card-category">${a.category}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${a.title}</h3>
            <div class="card-meta"><span class="card-reporter">✍ ${a.reporter_name || ''}</span></div>
          </div>
        </a>
      `).join('');
    }
  } catch(e) {
    console.error('Article page load failed:', e);
  }
}

// ===== CATEGORY PAGE =====
async function loadCategoryPage() {
  if (!document.querySelector('.category-page')) return;
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || '';

  const titleEl = document.getElementById('catTitle');
  if (titleEl) titleEl.textContent = cat || 'ସମସ୍ତ ଖବର';
  document.title = (cat || 'ସମସ୍ତ') + ' - MLF News 24';

  try {
    let query = db.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false });
    if (cat) query = query.eq('category', cat);
    const { data } = await query;
    const articles = data || [];

    const grid = document.getElementById('catArticlesGrid');
    if (!grid) return;
    if (!articles.length) { grid.innerHTML = '<p style="color:#888;padding:20px">କୌଣସି ଖବର ନାହିଁ।</p>'; return; }

    grid.innerHTML = articles.map(a => `
      <a href="article.html?id=${a.id}" class="story-card">
        <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/'+a.id+'/800/500'})">
          <span class="card-category">${a.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.title}</h3>
          <p class="card-excerpt">${a.excerpt || ''}</p>
          <div class="card-meta">
            <span class="card-reporter">✍ ${a.reporter_name || ''}</span>
            <span>📅 ${formatDate(a.published_at || a.created_at)}</span>
          </div>
        </div>
      </a>
    `).join('');
  } catch(e) {
    console.error('Category page load failed:', e);
  }
}

// ===== VIDEO PAGE =====
async function loadVideoPage() {
  const grid = document.getElementById('videoPageGrid');
  if (!grid) return;
  try {
    const videos = await getVideos(50);
    if (!videos.length) { grid.innerHTML = '<p style="color:#888;padding:20px">କୌଣସି Video ନାହିଁ।</p>'; return; }
    grid.innerHTML = videos.map(v => `
      <div class="video-card" onclick="playVideo('${v.youtube_id}', '${v.title.replace(/'/g,"\\'")}')">
        <div class="video-thumb" style="background-image:url(${v.thumbnail_url || 'https://img.youtube.com/vi/'+v.youtube_id+'/hqdefault.jpg'})">
          <div class="play-icon">▶</div>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-meta">✍ ${v.reporter_name || ''} | 📅 ${formatDate(v.published_at || v.created_at)} | 👁 ${(v.views || 0).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
  } catch(e) {
    console.error('Video page load failed:', e);
  }
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
async function loadEpaperPage() {
  const grid = document.getElementById('epaperGrid');
  if (!grid) return;
  try {
    const epapers = await getEpapers(24);
    if (!epapers.length) { grid.innerHTML = '<p style="color:#888;padding:20px">କୌଣସି E-Paper ନାହିଁ।</p>'; return; }
    grid.innerHTML = epapers.map(ep => `
      <div class="epaper-card">
        <div class="epaper-thumb">📰</div>
        <div class="epaper-info">
          <div class="epaper-date">${ep.edition_date || ''}</div>
          <div class="epaper-title">${ep.title}</div>
          <div style="font-size:12px;color:#888;margin-top:4px">ପୃଷ୍ଠା: ${ep.pages || 12}</div>
          <a href="${ep.pdf_url || '#'}" target="_blank" class="epaper-download">📥 PDF Download</a>
        </div>
      </div>
    `).join('');
  } catch(e) {
    console.error('Epaper page load failed:', e);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  startClock();
  await Promise.allSettled([
    loadTicker(),
    loadHero(),
    loadTopStories(),
    loadTrending(),
    loadCategorySections(),
    loadHomeVideos(),
    loadArticlePage(),
    loadCategoryPage(),
    loadVideoPage(),
    loadEpaperPage(),
    loadAds(),
    loadSocialLinks(),
  ]);
});
