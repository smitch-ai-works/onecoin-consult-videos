import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loomLinks, validateVideos } from '../video-config.js';

const id = '1234567890abcdef1234567890abcdef';

test('Loom share URLs become canonical embeds without tracking/autoplay parameters', () => {
  assert.deepEqual(loomLinks(`https://www.loom.com/share/${id}?sid=example&autoplay=1`), {
    embed: `https://www.loom.com/embed/${id}`,
    share: `https://www.loom.com/share/${id}`
  });
  assert.equal(loomLinks(`https://loom.com/embed/${id}/`).embed, `https://www.loom.com/embed/${id}`);
});

test('rejects unsafe, unrelated, or invalid video URLs', () => {
  for (const value of [
    `http://www.loom.com/share/${id}`, `https://loom.com.evil.example/share/${id}`,
    `https://evil.example/loom.com/share/${id}`, `https://user:pass@loom.com/share/${id}`,
    'javascript:alert(1)', `https://loom.com/share/not-a-video`, `https://loom.com:444/share/${id}`,
    `https://loom.aione.co.jp.evil.example/v/${id}`, `http://loom.aione.co.jp/v/${id}`,
    `https://loom.aione.co.jp/share/${id}`, `https://loom.com/v/${id}`
  ]) assert.equal(loomLinks(value), null, value);
  assert.equal(loomLinks(''), null);
});

test('Aione wrapper URLs become the embed used by the actual source pages', () => {
  assert.deepEqual(loomLinks(`https://loom.aione.co.jp/v/${id}`), {
    embed: `https://www.loom.com/embed/${id}?hideEmbedTopBar=true`,
    share: `https://www.loom.com/share/${id}`
  });
});

test('shipping config always contains three valid video slots', async () => {
  const data = JSON.parse(await readFile(new URL('../videos.json', import.meta.url), 'utf8'));
  const videos = validateVideos(data);
  assert.deepEqual(videos.map(video => video.id), [1, 2, 3]);
  assert.ok(videos.every(video => video.links !== null));
});

test('configured links validate and wrong order or malformed links are rejected', () => {
  const data = { videos: [1, 2, 3].map(idNumber => ({ id: idNumber, title: '動画', url: `https://www.loom.com/share/${id}` })) };
  assert.ok(validateVideos(data).every(video => video.links.embed));
  assert.throws(() => validateVideos({ videos: data.videos.slice(0, 2) }));
  assert.throws(() => validateVideos({ videos: [data.videos[1], data.videos[0], data.videos[2]] }));
  assert.throws(() => validateVideos({ videos: data.videos.map(video => ({ ...video, url: 'invalid' })) }));
});
