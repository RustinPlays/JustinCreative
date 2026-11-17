/* Justin Creative: optimised browser-side gallery photo uploads.
 * This script is loaded before gallery-admin.js. Original local files are never modified.
 */
window.JCPhotoPrep = (() => {
  const MAX_UPLOAD = 9 * 1024 * 1024; // under API's 10 MiB file limit
  const ACCEPT = new Set(['image/jpeg','image/png','image/webp','image/avif']);
  const EXT = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'image/avif':'avif' };

  function fail(message) { throw Error(message); }

  async function prepare(file, progress) {
    if (!ACCEPT.has(file.type)) fail(`${file.name}: use JPG, PNG, WebP or AVIF. HEIC/RAW files must be exported as JPEG first.`);
    if (file.size <= MAX_UPLOAD) return { file, note: 'Original uploaded unchanged' };
    progress?.(`Optimising ${file.name} (${(file.size / 1048576).toFixed(1)} MB original)…`);

    let bitmap;
    try {
      if (typeof createImageBitmap !== 'function') fail('Your browser does not support photo optimisation. Try the latest Chrome, Edge or Brave.');
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch (e) { fail(`${file.name}: browser cannot decode this image (${e.message}). Export it as JPEG and try again.`); }
    try {
      const originalLong = Math.max(bitmap.width, bitmap.height);
      if (!originalLong) fail('Could not read image dimensions.');
      for (const maxEdge of [3200, 2800, 2400, 2000, 1600, 1280]) {
        const scale = Math.min(1, maxEdge / originalLong);
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) fail('Unable to create image canvas.');
        // JPEG has no alpha; a white background prevents transparent source pixels rendering black.
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(bitmap, 0, 0, width, height);
        for (const quality of [0.88, 0.78, 0.68]) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
          if (!blob) fail('Browser failed to encode the photo.');
          if (blob.size <= MAX_UPLOAD) {
            const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^\w. -]/g, '_').slice(0, 120) || 'photo';
            const optimised = new File([blob], `${safeName}.jpg`, {type: 'image/jpeg', lastModified: file.lastModified});
            return { file: optimised, note: `Optimised ${(file.size / 1048576).toFixed(1)} → ${(blob.size / 1048576).toFixed(1)} MB (${width}×${height})` };
          }
        }
      }
      fail(`${file.name}: unable to make a gallery-sized copy smaller than 9 MB.`);
    } finally { bitmap.close(); }
  }
  return {prepare};
})();
