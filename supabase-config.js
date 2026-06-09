// ===== MLF NEWS24 - CONFIG =====

const SUPABASE_URL = 'https://crltkbziyghpaqphdnzo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybHRrYnppeWdocGFxcGhkbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzUyMzksImV4cCI6MjA5NTE1MTIzOX0.eM_hobjbUW4j-yLX7n5YSxj1uLEoRAbU9TgxmW6cHYI';

const CLOUDINARY_CLOUD_NAME = 'dfenmdfjo';
const CLOUDINARY_API_KEY = '812945665998148';
const CLOUDINARY_UPLOAD_PRESET = 'mlf24news';

// Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== CLOUDINARY UPLOAD =====
async function uploadToCloudinary(file, folder = 'articles') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', `mlf24news/${folder}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  return data.secure_url;
}

// PDF upload
async function uploadPDFToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'mlf24news/epapers');
  formData.append('resource_type', 'raw');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  return data.secure_url;
}

// ===== DB HELPERS =====

// Articles
async function getArticles(options = {}) {
  let query = db.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false });
  if (options.category) query = query.eq('category', options.category);
  if (options.featured) query = query.eq('is_featured', true);
  if (options.limit) query = query.limit(options.limit);
  const { data } = await query;
  return data || [];
}

async function getArticleBySlug(slug) {
  const { data } = await db.from('articles').select('*').eq('slug', slug).single();
  return data;
}

async function getArticleById(id) {
  const { data } = await db.from('articles').select('*').eq('id', id).single();
  return data;
}

async function incrementViews(id) {
  await db.rpc('increment_views', { article_id: id });
}

// Videos
async function getVideos(limit = 10) {
  const { data } = await db.from('videos').select('*').order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

// Epapers
async function getEpapers(limit = 12) {
  const { data } = await db.from('epapers').select('*').order('edition_date', { ascending: false }).limit(limit);
  return data || [];
}

// Breaking ticker
async function getTicker() {
  const { data } = await db.from('breaking_ticker').select('*').eq('is_active', true).order('sort_order');
  return data || [];
}

// Reporters
async function getReporters() {
  const { data } = await db.from('reporters').select('*').eq('is_active', true).order('name');
  return data || [];
}

// Categories
async function getCategories() {
  const { data } = await db.from('categories').select('*').order('name');
  return data || [];
}

// Ads
async function getAds(position) {
  let query = db.from('ads').select('*').eq('is_active', true);
  if (position) query = query.eq('position', position);
  const { data } = await query;
  return data || [];
}

// Settings
async function getSiteSettings() {
  const { data } = await db.from('site_settings').select('*');
  if (!data) return {};
  return Object.fromEntries(data.map(row => [row.key, row.value]));
}

// Slug generator
function makeSlug(title) {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now();
}

// Date formatter
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('or-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}
