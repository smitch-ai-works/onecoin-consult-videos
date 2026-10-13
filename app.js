import { validateVideos } from './video-config.js';

const numbers = ['①', '②', '③'];

function createVideo(video, index) {
  const section = document.createElement('section');
  section.id = `video-${video.id}`;
  section.className = 'video-section';
  section.setAttribute('aria-labelledby', `title-${video.id}`);
  const heading = document.createElement('h2');
  heading.id = `title-${video.id}`;
  const number = document.createElement('span');
  number.className = 'number';
  number.textContent = numbers[index];
  const title = document.createElement('span');
  title.textContent = video.title;
  heading.append(number, title);
  section.append(heading);

  if (video.links) {
    const frame = document.createElement('iframe');
    frame.className = 'player-frame';
    frame.src = video.links.embed;
    frame.title = `動画${video.id}：${video.title}`;
    frame.loading = 'lazy';
    frame.allow = 'fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const fallback = document.createElement('a');
    fallback.className = 'external-video';
    fallback.href = video.links.share;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = '動画が表示されない場合は、Loomで見る';
    section.append(frame, fallback);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'player-placeholder';
    const state = document.createElement('p');
    state.textContent = '公開準備中';
    const message = document.createElement('span');
    message.textContent = '動画の公開まで、もう少しお待ちください。';
    placeholder.append(state, message);
    section.append(placeholder);
  }
  return section;
}

async function loadVideos() {
  try {
    const response = await fetch('./videos.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Video config could not be loaded.');
    const videos = validateVideos(await response.json());
    document.querySelector('#videos').replaceChildren(...videos.map(createVideo));
    document.querySelectorAll('.video-nav a').forEach((link, index) => {
      const number = document.createElement('span');
      number.textContent = numbers[index];
      link.setAttribute('aria-label', `動画${videos[index].id}：${videos[index].title}`);
      link.replaceChildren(number, document.createTextNode(`動画${videos[index].id}`));
    });
  } catch {
    const status = document.querySelector('#load-status');
    status.textContent = '動画の情報を読み込めませんでした。少し時間をおいて、このページを開き直してください。';
    status.hidden = false;
    document.querySelectorAll('.player-placeholder span').forEach(message => {
      message.textContent = 'ページを開き直してからご確認ください。';
    });
  }
}

loadVideos();
