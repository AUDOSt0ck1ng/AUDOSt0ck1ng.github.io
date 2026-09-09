const root = document.documentElement;
const progress = document.querySelector('.scroll-progress span');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelector('#year').textContent = new Date().getFullYear();

let ticking = false;
function paintScroll() {
  const max = root.scrollHeight - innerHeight;
  const ratio = max > 0 ? scrollY / max : 0;
  progress.style.width = `${ratio * 100}%`;

  ticking = false;
}

function schedulePaint() {
  if (!ticking) { requestAnimationFrame(paintScroll); ticking = true; }
}
addEventListener('scroll', schedulePaint, { passive: true });
addEventListener('resize', schedulePaint);
paintScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

// Project imagery enters softly, then responds to the pointer without reducing clarity.
const interactiveMedia = document.querySelectorAll('.project-shot, .project-card');
interactiveMedia.forEach((media, index) => {
  media.style.setProperty('--reveal-delay', `${index * 90}ms`);
  if (motionPreference.matches) return;
  media.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const rect = media.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    media.style.setProperty('--pointer-x', `${x * 100}%`);
    media.style.setProperty('--pointer-y', `${y * 100}%`);
    media.style.setProperty('--tilt-x', `${(0.5 - y) * 2.2}deg`);
    media.style.setProperty('--tilt-y', `${(x - 0.5) * 2.8}deg`);
  });
  media.addEventListener('pointerleave', () => {
    media.style.setProperty('--tilt-x', '0deg');
    media.style.setProperty('--tilt-y', '0deg');
  });
});

// A project's screenshots are a deck: clicking a card behind the front one
// rotates it forward. The image itself is never a link — an accidental click
// on a screenshot must never navigate away.
document.querySelectorAll('.deck').forEach(deck => {
  const cards = Array.from(deck.querySelectorAll('.deck-card'));
  if (cards.length < 2) return;

  deck.style.setProperty('--count', cards.length);
  deck.classList.add('is-deck');

  const counter = document.createElement('span');
  counter.className = 'deck-counter';
  deck.append(counter);

  const pad = value => String(value).padStart(2, '0');
  const label = card => card.querySelector('img').alt || 'project screenshot';
  let order = cards.slice(); // order[0] is whichever card is currently in front

  function paint() {
    order.forEach((card, depth) => {
      const number = cards.indexOf(card) + 1;
      card.style.setProperty('--i', depth);
      card.toggleAttribute('data-front', depth === 0);
      // Only the cards you can actually act on are focusable controls.
      if (depth === 0) {
        card.removeAttribute('role');
        card.removeAttribute('aria-label');
        card.setAttribute('tabindex', '-1');
      } else {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Bring image ${number} of ${cards.length} to the front: ${label(card)}`);
      }
    });
    counter.textContent = `${pad(cards.indexOf(order[0]) + 1)} / ${pad(cards.length)}`;
  }

  function bringToFront(card) {
    const depth = order.indexOf(card);
    if (depth < 1) return;
    order = order.slice(depth).concat(order.slice(0, depth));
    paint();
  }

  deck.addEventListener('click', event => {
    const card = event.target.closest('.deck-card');
    if (card) bringToFront(card);
  });
  deck.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.deck-card');
    if (!card || card === order[0]) return;
    event.preventDefault();
    bringToFront(card);
    card.focus();
  });

  paint();
});

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
