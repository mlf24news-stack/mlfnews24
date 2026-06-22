// ===== MLF NEWS 24 - SUPABASE CONFIG =====

const SUPABASE_URL = 'https://crltkbziyghpaqphdnzo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybHRrYnppeWdocGFxcGhkbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzUyMzksImV4cCI6MjA5NTE1MTIzOX0.eM_hobjbUW4j-yLX7n5YSxj1uLEoRAbU9TgxmW6cHYI';

const CLOUDINARY_CLOUD_NAME = 'dfenmdfjo';
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
    method: 'POST', body: formData
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

async function uploadPDFToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'mlf24news/epapers');
  formData.append('resource_type', 'raw');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
    method: 'POST', body: formData
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error(data.error?.message || 'PDF upload failed');
  return data.secure_url;
}

// ===== ARTICLES =====
async function getArticles(options = {}) {
  let query = db.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false });
  if (options.category) query = query.eq('category', options.category);
  if (options.featured) query = query.eq('is_featured', true);
  if (options.breaking) query = query.eq('is_breaking', true);
  if (options.limit)    query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) console.error('getArticles:', error.message);
  return data || [];
}

async function getArticleById(id) {
  const { data } = await db.from('articles').select('*').eq('id', id).single();
  return data;
}

async function getArticleBySlug(slug) {
  const { data } = await db.from('articles').select('*').eq('slug', slug).single();
  return data;
}

async function incrementViews(id) {
  await db.rpc('increment_views', { article_id: id });
}

// ===== VIDEOS =====
// DB column: thumb_url
async function getVideos(limit = 10) {
  const { data } = await db.from('videos').select('*').order('published_at', { ascending: false }).limit(limit);
  return data || [];
}

// ===== EPAPERS =====
// DB column: file_url
async function getEpapers(limit = 12) {
  const { data } = await db.from('epapers').select('*').order('edition_date', { ascending: false }).limit(limit);
  return data || [];
}

// ===== BREAKING TICKER =====
async function getTicker() {
  const { data } = await db.from('breaking_ticker').select('*').eq('is_active', true).order('sort_order');
  return data || [];
}

// ===== REPORTERS =====
async function getReporters() {
  const { data } = await db.from('reporters').select('*').eq('is_active', true).order('name');
  return data || [];
}

// ===== CATEGORIES =====
async function getCategories() {
  const { data } = await db.from('categories').select('*').order('sort_order');
  return data || [];
}

// ===== ADS =====
async function getAds(position) {
  let query = db.from('ads').select('*').eq('is_active', true);
  if (position) query = query.eq('position', position);
  const { data } = await query;
  return data || [];
}

// ===== SITE SETTINGS =====
async function getSiteSettings() {
  const { data } = await db.from('site_settings').select('*');
  if (!data) return {};
  return Object.fromEntries(data.map(row => [row.key, row.value]));
}

// ===== HELPERS =====
function makeSlug(title) {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('or-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}
