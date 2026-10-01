const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const tabList = document.querySelector('[data-tabs]');
const tabs = [...tabList.querySelectorAll('.now-tab')];
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

tabList.setAttribute('role', 'tablist');
tabList.setAttribute('aria-label', 'Ситуация');

function select(index, { focus = false, animate = true } = {}) {
  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[i].hidden = !active;
  });
  if (focus) tabs[index].focus();
  if (animate && window.gsap && !reduceMotion.matches) {
    gsap.fromTo(panels[index].children,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: .32, ease: 'power2.out', stagger: .04, overwrite: true, clearProps: 'all' });
  }
}

tabs.forEach((tab, i) => {
  tab.setAttribute('role', 'tab');
  panels[i].setAttribute('role', 'tabpanel');
  panels[i].tabIndex = 0;
  tab.addEventListener('click', () => {
    select(i);
    const top = panels[i].getBoundingClientRect().top;
    if (top > innerHeight * .6) {
      panels[i].scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }
  });
  tab.addEventListener('keydown', event => {
    const last = tabs.length - 1;
    const keys = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowRight: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], { focus: true });
  });
});

select(0, { animate: false });

window.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('h1 .line > span', { yPercent: 105, duration: .9, stagger: .12 })
      .from('.hero-label, .hero-lede, .hero-actions', { autoAlpha: 0, y: 14, duration: .6, stagger: .08 }, .35)
      .from('.hero-plate', { scaleY: 0, transformOrigin: 'bottom', duration: .9, ease: 'power4.out' }, .1)
      .from('.hero-figure img', { autoAlpha: 0, y: 40, duration: 1 }, .3)
      .from('.hero-figure figcaption', { autoAlpha: 0, duration: .5 }, .9);

    gsap.fromTo('.rail-fill', { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.rail-wrap', start: 'top 75%', end: 'bottom 55%', scrub: .6 },
    });
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
