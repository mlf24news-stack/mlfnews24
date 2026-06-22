// ===== MLF NEWS 24 - MASTER SCRIPT (Supabase) =====

// ===== LIVE CLOCK =====
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = now.toLocaleString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  update();
  setInterval(update, 1000);
}

// ===== BREAKING TICKER =====
async function loadTicker() {
  const el = document.getElementById('breakingTicker');
  if (!el) return;
  const items = await getTicker();
  if (!items.length) {
    // fallback: latest articles
    const arts = await getArticles({ limit: 6 });
    el.innerHTML = arts.map(a => `<span class="ticker-item">${a.title}</span>`).join('');
  } else {
    el.innerHTML = items.map(t =>
      `<span class="ticker-item">${t.link_url ? `<a href="${t.link_url}" style="color:inherit;text-decoration:none">${t.text}</a>` : t.text}</span>`
    ).join('');
  }
  el.innerHTML += el.innerHTML; // duplicate for seamless loop
}

// ===== HERO SLIDER =====
let heroIdx = 0;
async function loadHero() {
  const container = document.getElementById('heroSlider');
  const dots = document.getElementById('heroDots');
  if (!container) return;

  const featured = await getArticles({ featured: true, limit: 5 });
  if (!featured.length) return;

  container.innerHTML = featured.map(a => `
    <div class="hero-slide" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/' + a.id + '/1280/720'})"
         onclick="location.href='article.html?id=${a.id}'">
      <div class="hero-content">
        <span class="hero-category">${a.category}</span>
        <h1 class="hero-title">${a.title}</h1>
        <p class="hero-excerpt">${a.excerpt || ''}</p>
        <div class="hero-meta">
          <span class="reporter">✍ ${a.reporter_name || ''}</span> &nbsp;|&nbsp;
          📅 ${formatDate(a.published_at)} &nbsp;|&nbsp;
          👁 ${(a.views || 0).toLocaleString()}
        </div>
        <a href="article.html?id=${a.id}" class="hero-read-btn">ସଂପୂର୍ଣ ଖବର ପଢ଼ନ୍ତୁ →</a>
      </div>
    </div>
  `).join('');

  if (dots) {
    dots.innerHTML = featured.map((_, i) =>
      `<button class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goSlide(${i})"></button>`
    ).join('');
  }
  setInterval(() => goSlide((heroIdx + 1) % featured.length), 5000);
}

function goSlide(idx) {
  heroIdx = idx;
  const slider = document.getElementById('heroSlider');
  if (slider) slider.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// ===== TOP STORIES =====
async function loadTopStories() {
  const grid = document.getElementById('topStoriesGrid');
  if (!grid) return;
  const articles = await getArticles({ limit: 5 });
  grid.innerHTML = articles.map((a, i) => `
    <a href="article.html?id=${a.id}" class="story-card ${i === 0 ? 'featured' : ''}">
      <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/' + a.id + '/800/500'})">
        <span class="card-category">${a.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${a.title}</h3>
        <p class="card-excerpt">${a.excerpt || ''}</p>
        <div class="card-meta">
          <span class="card-reporter">✍ ${a.reporter_name || ''}</span>
          <span>📅 ${formatDate(a.published_at)}</span>
        </div>
      </div>
    </a>
  `).join('');
}

// ===== TRENDING =====
async function loadTrending() {
  const list = document.getElementById('trendingList');
  if (!list) return;
  const { data } = await db.from('articles')
    .select('id,title,views').eq('status', 'published')
    .order('views', { ascending: false }).limit(6);
  const articles = data || [];
  list.innerHTML = articles.map(a => `
    <li onclick="location.href='article.html?id=${a.id}'">${a.title}</li>
  `).join('');
}

// ===== CATEGORY SECTIONS =====
async function loadCategorySections() {
  const el = document.getElementById('categorySections');
  if (!el) return;
  const cats = ['ରାଜନୀତି', 'ଖେଳ', 'ମନୋରଞ୍ଜନ', 'ବ୍ୟବସାୟ'];
  const sections = await Promise.all(cats.map(cat => getArticles({ category: cat, limit: 4 })));

  el.innerHTML = cats.map((cat, ci) => {
    const catArticles = sections[ci];
    if (!catArticles.length) return '';
    return `
      <section class="cat-section">
        <h2 class="section-title"><span>${cat}</span></h2>
        <div class="cat-grid">
          ${catArticles.map(a => `
            <a href="article.html?id=${a.id}" class="story-card">
              <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/' + a.id + '/800/500'})">
                <span class="card-category">${a.category}</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">${a.title}</h3>
                <div class="card-meta">
                  <span class="card-reporter">✍ ${a.reporter_name || ''}</span>
                  <span>${formatDate(a.published_at)}</span>
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
}

// ===== HOME VIDEOS =====
async function loadHomeVideos() {
  const grid = document.getElementById('homeVideoGrid');
  if (!grid) return;
  const videos = await getVideos(4);
  if (!videos.length) { grid.innerHTML = '<p style="color:#888;padding:20px">No videos yet.</p>'; return; }
  grid.innerHTML = videos.map(v => `
    <a href="video.html?id=${v.id}" class="video-card">
      <div class="video-thumb" style="background-image:url(${v.thumb_url || 'https://img.youtube.com/vi/' + v.youtube_id + '/hqdefault.jpg'})">
        <div class="play-icon">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">✍ ${v.reporter_name || ''} • 👁 ${(v.views || 0).toLocaleString()}</div>
      </div>
    </a>
  `).join('');
}

// ===== ARTICLE PAGE =====
async function loadArticlePage() {
  if (!document.querySelector('.article-page')) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const article = await getArticleById(id);
  if (!article) {
    document.querySelector('.article-page').innerHTML = '<p style="padding:40px">ଲେଖା ମିଳିଲା ନାହିଁ।</p>';
    return;
  }

  await incrementViews(id);

  document.title = article.title + ' - MLF News 24';
  const catEl = document.getElementById('artCategory');
  const titleEl = document.getElementById('artTitle');
  const repEl = document.getElementById('artReporter');
  const dateEl = document.getElementById('artDate');
  const viewsEl = document.getElementById('artViews');
  const imgEl = document.getElementById('artHeroImg');
  const bodyEl = document.getElementById('artBody');

  if (catEl) catEl.textContent = article.category;
  if (titleEl) titleEl.textContent = article.title;
  if (repEl) repEl.textContent = '✍ ' + (article.reporter_name || '');
  if (dateEl) dateEl.textContent = '📅 ' + formatDate(article.published_at);
  if (viewsEl) viewsEl.textContent = '👁 ' + (article.views || 0).toLocaleString();
  if (imgEl) imgEl.style.backgroundImage = `url(${article.image_url || ''})`;
  if (bodyEl) bodyEl.innerHTML = (article.body || '').split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');

  // Related articles
  const { data: related } = await db.from('articles')
    .select('id,title,image_url,category,reporter_name')
    .eq('status', 'published')
    .eq('category', article.category)
    .neq('id', id)
    .limit(3);
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid && related?.length) {
    relGrid.innerHTML = related.map(a => `
      <a href="article.html?id=${a.id}" class="story-card">
        <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/' + a.id + '/800/500'})">
          <span class="card-category">${a.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.title}</h3>
          <div class="card-meta"><span class="card-reporter">✍ ${a.reporter_name || ''}</span></div>
        </div>
      </a>
    `).join('');
  }
}

// ===== CATEGORY PAGE =====
async function loadCategoryPage() {
  if (!document.querySelector('.category-page')) return;
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || '';
  const titleEl = document.getElementById('catTitle');
  if (titleEl) titleEl.textContent = cat || 'ସମସ୍ତ ଖବର';
  document.title = (cat || 'ଖବର') + ' - MLF News 24';

  const articles = await getArticles(cat ? { category: cat } : {});
  const grid = document.getElementById('catArticlesGrid');
  if (!grid) return;
  if (!articles.length) { grid.innerHTML = '<p style="padding:20px;color:#888">କୋଣସି ଖବର ନାହିଁ।</p>'; return; }
  grid.innerHTML = articles.map(a => `
    <a href="article.html?id=${a.id}" class="story-card">
      <div class="card-img" style="background-image:url(${a.image_url || 'https://picsum.photos/seed/' + a.id + '/800/500'})">
        <span class="card-category">${a.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${a.title}</h3>
        <p class="card-excerpt">${a.excerpt || ''}</p>
        <div class="card-meta">
          <span class="card-reporter">✍ ${a.reporter_name || ''}</span>
          <span>📅 ${formatDate(a.published_at)}</span>
        </div>
      </div>
    </a>
  `).join('');
}

// ===== VIDEO PAGE =====
async function loadVideoPage() {
  const grid = document.getElementById('videoPageGrid');
  if (!grid) return;
  const videos = await getVideos(20);
  if (!videos.length) { grid.innerHTML = '<p style="color:#888;padding:20px">No videos yet.</p>'; return; }
  grid.innerHTML = videos.map(v => `
    <div class="video-card" onclick="playVideo('${v.youtube_id}', '${v.title.replace(/'/g, "\\'")}')">
      <div class="video-thumb" style="background-image:url(${v.thumb_url || 'https://img.youtube.com/vi/' + v.youtube_id + '/hqdefault.jpg'})">
        <div class="play-icon">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">✍ ${v.reporter_name || ''} | 📅 ${formatDate(v.published_at)} | 👁 ${(v.views || 0).toLocaleString()}</div>
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

// ===== EPAPER PAGE =====
async function loadEpaperPage() {
  const grid = document.getElementById('epaperGrid');
  if (!grid) return;
  const epapers = await getEpapers();
  if (!epapers.length) { grid.innerHTML = '<p style="padding:20px;color:#888">E-Paper ଉପଲବ୍ଧ ନାହିଁ।</p>'; return; }
  grid.innerHTML = epapers.map(ep => `
    <div class="epaper-card">
      <div class="epaper-thumb">
        ${ep.thumbnail_url
          ? `<img src="${ep.thumbnail_url}" style="width:100%;height:100%;object-fit:cover">`
          : '📰'}
      </div>
      <div class="epaper-info">
        <div class="epaper-date">${ep.edition_date}</div>
        <div class="epaper-title">${ep.title}</div>
        <div style="font-size:12px;color:#888;margin-top:4px">ପୃଷ୍ଠା: ${ep.pages || 12}</div>
        ${ep.file_url
          ? `<a href="${ep.file_url}" target="_blank" class="epaper-download">📥 PDF ଡାଉନଲୋଡ</a>`
          : '<span style="color:#888;font-size:12px">PDF ଆସୁଛି</span>'}
      </div>
    </div>
  `).join('');
}

// ===== ADS =====
async function loadAds() {
  const sidebarAds = await getAds('sidebar');
  const sidebarEl = document.getElementById('sidebarAd');
  if (sidebarAds.length && sidebarEl) {
    const ad = sidebarAds[0];
    sidebarEl.innerHTML = `
      <a href="${ad.link_url || '#'}" target="_blank">
        <img src="${ad.image_url}" alt="${ad.title}" style="width:100%;border-radius:6px;display:block;">
      </a>`;
  }

  const bottomAds = await getAds('header');
  const bottomEl = document.getElementById('bottomAd');
  if (bottomAds.length && bottomEl) {
    const ad = bottomAds[0];
    bottomEl.innerHTML = `
      <a href="${ad.link_url || '#'}" target="_blank">
        <img src="${ad.image_url}" alt="${ad.title}" style="max-width:100%;border-radius:6px;display:block;margin:0 auto;">
      </a>`;
  }
}

// ===== SOCIAL LINKS =====
async function loadSocialLinks() {
  const settings = await getSiteSettings();
  const map = { socialFb: 'facebook_url', socialWa: 'whatsapp_number', socialIg: 'instagram_url', socialYt: 'youtube_url' };
  Object.entries(map).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if (!el || !settings[key]) return;
    if (key === 'whatsapp_number') {
      el.href = 'https://wa.me/' + settings[key].replace(/[^0-9]/g, '');
    } else {
      el.href = settings[key];
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  startClock();
  // Run all loaders in parallel for speed
  await Promise.all([
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
