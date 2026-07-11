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
  const cat = decodeURIComponent(params.get('cat') || '');
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
  // Sidebar ad
  const sidebarAds = await getAds('sidebar');
  const sidebarEl = document.getElementById('sidebarAd');
  if (sidebarAds.length && sidebarEl) {
    const ad = sidebarAds[0];
    sidebarEl.innerHTML = `
      <a href="${ad.link_url || '#'}" target="_blank">
        <img src="${ad.image_url}" alt="${ad.title}" style="width:100%;border-radius:6px;display:block;">
      </a>`;
  }

  // Header banner ad
  const headerAds = await getAds('header');
  const headerEl = document.getElementById('headerAdBanner');
  if (headerAds.length && headerEl) {
    const ad = headerAds[0];
    headerEl.innerHTML = `
      <a href="${ad.link_url || '#'}" target="_blank" style="display:block;width:100%;height:100%;">
        <img src="${ad.image_url}" alt="${ad.title}" style="width:100%;height:100%;object-fit:cover;display:block;">
      </a>`;
  }

  // Bottom ad
  const bottomAds = await getAds('bottom');
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
    loadWeather(),
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

// ============================================================
// WHATSAPP AUTO-SHARE FEATURE — MLF News 24
// script.js mein existing code ke BAAD yeh add karo
// ============================================================

// ---- WhatsApp Share Utility --------------------------------

/**
 * Breaking news ka WhatsApp share link banata hai
 * @param {string} text  - News text
 * @param {string} url   - Article URL (optional)
 * @returns {string}     - WhatsApp share URL
 */
function generateWhatsAppLink(text, url = '') {
  const siteUrl = 'https://mlfnews24.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const message = `🔴 *ବ୍ରେକିଂ ନ୍ୟୁଜ୍ | MLF News 24*\n\n${text}\n\n🔗 ${fullUrl}\n\n📲 _MLF News 24 ପଢ଼ନ୍ତୁ_`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp Channel/Group mein share karta hai (direct number pe)
 * site_settings se whatsapp_number fetch karke
 * @param {string} text
 * @param {string} url
 */
async function shareToWhatsApp(text, url = '') {
  try {
    // site_settings se WhatsApp number fetch karo
    const { data, error } = await window.supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'whatsapp_number')
      .single();

    const link = generateWhatsAppLink(text, url);

    if (!error && data?.value) {
      // Direct number pe share
      const number = data.value.replace(/[^0-9]/g, '');
      const directLink = `https://wa.me/${number}?text=${encodeURIComponent(
        `🔴 *ବ୍ରେକିଂ ନ୍ୟୁଜ୍ | MLF News 24*\n\n${text}\n\n🔗 ${url ? 'https://mlfnews24.vercel.app' + url : 'https://mlfnews24.vercel.app'}`
      )}`;
      window.open(directLink, '_blank');
    } else {
      // Generic share link (kisi bhi WhatsApp pe)
      window.open(link, '_blank');
    }
  } catch (e) {
    // Fallback
    window.open(generateWhatsAppLink(text, url), '_blank');
  }
}

// ---- Breaking Ticker Save + WhatsApp ----------------------

/**
 * Breaking ticker save karo aur WhatsApp share option dikhao
 * Admin panel ke breaking ticker form se call hota hai
 */
async function saveBreakingTickerWithWhatsApp(tickerText, linkUrl = '') {
  try {
    const { data, error } = await window.supabase
      .from('breaking_ticker')
      .insert([{
        text: tickerText,
        link_url: linkUrl || null,
        is_active: true,
        sort_order: 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Save successful — WhatsApp share prompt dikhao
    showWhatsAppPrompt(tickerText, linkUrl, 'ticker');
    return { success: true, data };

  } catch (err) {
    console.error('Ticker save error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Article publish hone par — agar is_breaking = true hai
 * toh WhatsApp share prompt dikhao
 */
async function onArticlePublished(article) {
  if (article.is_breaking) {
    const articleUrl = `/article.html?slug=${article.slug}`;
    showWhatsAppPrompt(article.title, articleUrl, 'article');
  }
}

// ---- WhatsApp Share Prompt UI -----------------------------

/**
 * WhatsApp share ka beautiful popup dikhata hai
 * @param {string} text
 * @param {string} url
 * @param {string} type - 'ticker' ya 'article'
 */
function showWhatsAppPrompt(text, url, type = 'ticker') {
  // Existing modal remove karo agar hai
  const existing = document.getElementById('wa-share-modal');
  if (existing) existing.remove();

  const articleUrl = url ? `/article.html?slug=${url}` : '';
  const shareLink = generateWhatsAppLink(text, type === 'article' ? url : articleUrl);

  const modal = document.createElement('div');
  modal.id = 'wa-share-modal';
  modal.innerHTML = `
    <div style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Noto Serif Odia', serif;
    ">
      <div style="
        background: #1a1a2e; border: 1px solid #25d366;
        border-radius: 12px; padding: 28px; max-width: 480px; width: 90%;
        box-shadow: 0 0 30px rgba(37,211,102,0.3);
        animation: slideUp 0.3s ease;
      ">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
          <span style="font-size:28px;">📲</span>
          <h3 style="color:#25d366; margin:0; font-size:18px;">WhatsApp ରେ Share କରନ୍ତୁ?</h3>
        </div>

        <div style="
          background: #0d1117; border-radius: 8px; padding: 14px;
          margin-bottom: 18px; border-left: 3px solid #ff0040;
        ">
          <p style="color:#ff0040; font-size:11px; margin:0 0 6px; font-weight:700; letter-spacing:1px;">
            🔴 BREAKING NEWS
          </p>
          <p style="color:#e0e0e0; margin:0; font-size:14px; line-height:1.5;">${text}</p>
        </div>

        <p style="color:#888; font-size:12px; margin-bottom:18px;">
          ଏହି ଖବର WhatsApp ରେ share କଲେ ଅଧିକ ଲୋକ ପଢ଼ିପାରିବେ
        </p>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="${shareLink}" target="_blank"
            onclick="document.getElementById('wa-share-modal').remove()"
            style="
              flex:1; min-width:140px;
              background: #25d366; color: #fff;
              padding: 12px 16px; border-radius: 8px;
              text-decoration: none; text-align: center;
              font-weight: 700; font-size: 14px;
              display: flex; align-items: center; justify-content: center; gap: 8px;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#1db954'"
            onmouseout="this.style.background='#25d366'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Share
          </a>
          <button
            onclick="document.getElementById('wa-share-modal').remove()"
            style="
              background: #333; color: #aaa; border: 1px solid #444;
              padding: 12px 20px; border-radius: 8px; cursor: pointer;
              font-size: 14px; transition: background 0.2s;
            "
            onmouseover="this.style.background='#444'"
            onmouseout="this.style.background='#333'"
          >
            ପରେ Share କରିବ
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
    </style>
  `;

  document.body.appendChild(modal);

  // Background click se close
  modal.querySelector('div').addEventListener('click', function(e) {
    if (e.target === this) modal.remove();
  });
}

// ---- Export (agar module use ho) --------------------------
// Browser mein directly available rahega as global functions
window.generateWhatsAppLink     = generateWhatsAppLink;
window.shareToWhatsApp          = shareToWhatsApp;
window.saveBreakingTickerWithWhatsApp = saveBreakingTickerWithWhatsApp;
window.onArticlePublished       = onArticlePublished;
window.showWhatsAppPrompt       = showWhatsAppPrompt;

// ===== WEATHER =====
async function loadWeather() {
  const API_KEY = 'dfedbb651b409f66c685444993985c9e';
  const cityEl = document.getElementById('weatherCity');
  if (!cityEl) return;

  const iconMap = { Clear:'☀️', Clouds:'☁️', Rain:'🌧', Drizzle:'🌦', Thunderstorm:'⛈', Snow:'❄️', Mist:'🌫', Haze:'🌫', Fog:'🌫' };

  async function setWeather(data) {
    document.getElementById('weatherCity').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('weatherTemp').textContent = Math.round(data.main.temp) + '°C';
    document.getElementById('weatherDesc').textContent = data.weather[0].description;
    document.getElementById('weatherHumidity').textContent = data.main.humidity + '%';
    document.getElementById('weatherFeels').textContent = Math.round(data.main.feels_like) + '°C';
    document.getElementById('weatherWind').textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
    document.getElementById('weatherIcon').textContent = iconMap[data.weather[0].main] || '🌤';
  }

  try {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}&units=metric`);
      setWeather(await res.json());
    }, async () => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bhubaneswar&appid=${API_KEY}&units=metric`);
      setWeather(await res.json());
    });
  } catch (e) {
    document.getElementById('weatherDesc').textContent = 'Data unavailable';
  }
}
