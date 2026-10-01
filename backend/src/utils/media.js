const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MEDIA_ROOT = path.join(__dirname, '..', '..', 'uploads');
const DATA_URL_RE = /^data:image\/(png|jpe?g|webp|gif|avif);base64,([A-Za-z0-9+/=\s]+)$/i;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isBase64Image(value) {
  return typeof value === 'string' && DATA_URL_RE.test(value);
}

function saveImage(value, folder = 'images') {
  if (!isBase64Image(value)) return value;
  const match = value.match(DATA_URL_RE);
  if (!match) return value;

  const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
  const data = Buffer.from(match[2], 'base64');
  const dir = path.join(MEDIA_ROOT, folder);
  ensureDir(dir);

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), data);
  return `/api/media/${folder}/${filename}`;
}

function saveImages(list, folder = 'images') {
  if (!Array.isArray(list)) return [];
  return list.map((value) => saveImage(value, folder));
}

function removeImage(value) {
  if (typeof value !== 'string') return;
  const match = value.match(/^\/api\/media\/([A-Za-z0-9_-]+)\/([A-Za-z0-9._-]+)$/);
  if (!match) return;
  const file = path.join(MEDIA_ROOT, match[1], match[2]);
  if (!file.startsWith(MEDIA_ROOT)) return;
  fs.unlink(file, () => {});
}

function removeImages(list) {
  if (!Array.isArray(list)) return;
  list.forEach(removeImage);
}

module.exports = { saveImage, saveImages, removeImage, removeImages, isBase64Image, MEDIA_ROOT };
