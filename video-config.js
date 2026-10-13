// Accept only Loom sharing/embed links. Never embed arbitrary URLs from config.
export function loomLinks(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  let parsed;
  try { parsed = new URL(value.trim()); } catch { return null; }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port) return null;
  if (!['loom.com', 'www.loom.com'].includes(parsed.hostname)) return null;
  const match = parsed.pathname.match(/^\/(?:share|embed)\/([a-f0-9]{32})\/?$/i);
  if (!match) return null;
  const id = match[1].toLowerCase();
  return { embed: `https://www.loom.com/embed/${id}`, share: `https://www.loom.com/share/${id}` };
}

export function validateVideos(data) {
  if (!data || !Array.isArray(data.videos) || data.videos.length !== 3) {
    throw new Error('videos.json must contain exactly three videos.');
  }
  return data.videos.map((video, index) => {
    if (video.id !== index + 1 || typeof video.title !== 'string' || !video.title.trim()) {
      throw new Error('Video IDs must be 1, 2, 3, in order, with titles.');
    }
    if (typeof video.url !== 'string') throw new Error('Video URLs must be strings (empty is allowed).');
    const links = loomLinks(video.url);
    if (video.url.trim() && !links) throw new Error(`Video ${video.id} must use a valid HTTPS Loom URL.`);
    return { id: video.id, title: video.title.trim(), links };
  });
}
