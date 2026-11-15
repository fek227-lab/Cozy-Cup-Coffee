/* ==========================================================================
   Crumbs & Co. starter  ·  ITE 270 Module 5
   Rule for this whole file: JavaScript decides WHEN. CSS decides HOW IT LOOKS.
   Most of your JavaScript should only add or remove a class, set a data
   attribute, or set a CSS custom property. The exception is STEP 7.
   ========================================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Small helper for STEP 7: shows a message and announces it to screen readers */
const toast = $('#toast');
let toastTimer;
function announce(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}


/* ---------- STEP 5: reveal on scroll (R4) ----------------------------------
   1. Make an IntersectionObserver. When an entry isIntersecting, remove
      'pending' from entry.target and stop observing it.
   2. Loop over $$('.reveal'). If an element's getBoundingClientRect().top is
      greater than innerHeight (below the fold), add 'pending' and observe it.
   3. Skip all of this if `reduced` is true.                                 */

// Cards start visible in the HTML. Only JS hides them, and only the ones below
// the fold, so if this script fails nothing is ever stuck invisible.
if (!reduced && 'IntersectionObserver' in window) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.classList.add('entering');          // turn on the slow, staggered transition
      card.classList.remove('pending');        // ...and let it rise into place
      revealer.unobserve(card);                // reveal once, never hide again
      setTimeout(() => card.classList.remove('entering'), 1400); // after it lands, hovers are instant again
    });
  }, { rootMargin: '0px 0px -10% 0px' });      // wait until the card is a little way onto the screen

  $$('.reveal').forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {  // below the fold only
      el.classList.add('pending');
      revealer.observe(el);
    }
  });
}


/* ---------- STEP 6, OPTION A: steps that change a sticky picture (R5) ------
   1. const STORY_MARGIN = '-45% 0px -45% 0px';   (a band in the middle of the screen)
   2. Observe every .step with { rootMargin: STORY_MARGIN }.
   3. When one isIntersecting, set $('#stage').dataset.step = entry.target.dataset.step
      and update #stageLabel's text.
   4. So you can SEE the band: window.motionXray && motionXray.zone(STORY_MARGIN);  */

// JS only decides WHICH step is current; CSS decides how the dough looks for each one.
// This still runs with reduced motion: the picture changes, it just doesn't animate.
const STORY_MARGIN = '-45% 0px -45% 0px';      // a thin band across the middle of the screen
const stage = $('#stage');
const stageLabel = $('#stageLabel');

if (stage && 'IntersectionObserver' in window) {
  const storyWatcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      stage.dataset.step = entry.target.dataset.step;                       // "mix", "shape", "rise", "bake"
      stageLabel.textContent = $('h3', entry.target).textContent.replace(/^\d+\.\s*/, ''); // "1. Mix" → "Mix"
    });
  }, { rootMargin: STORY_MARGIN });

  $$('.step').forEach((step) => storyWatcher.observe(step));
  window.motionXray && motionXray.zone(STORY_MARGIN);
}


/* ---------- SVG line drawing: scroll progress sets --draw ------------------
   0 when the drawing's top enters the bottom of the screen,
   1 when its middle reaches the middle of the screen. CSS does the drawing. */
const sketch = $('#sketch');
if (sketch && !reduced) {
  const art = $('.sketch-art', sketch);
  let ticking = false;
  const updateDraw = () => {
    ticking = false;
    const r = art.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.5 + r.height * 0.5)));
    sketch.style.setProperty('--draw', p.toFixed(3));
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateDraw); }  // at most once per frame
  }, { passive: true });
  updateDraw();
}


/* ---------- STEP 6, OPTION B: scroll progress for a product zoom (R5) ------
   On scroll (inside requestAnimationFrame):
     const r = zoom.getBoundingClientRect();
     const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
     zoom.style.setProperty('--p', p.toFixed(3));
   If `reduced`, set --p to 1 and skip the listener.                         */

// your code here


/* ---------- STEP 7: click interaction with element.animate() (R6) ----------
   For every .add button:
     1. Update the count and announce(`${name} added. ${count} in your order.`)
     2. Animate something with element.animate([...keyframes], { duration, easing }).
        Ideas: fly a copy of the card's .art to #cart; pop the button; wiggle the cart.
     3. Chain a second animation with .finished.then(() => ...),
        for example a bounce on #count.
     4. If `reduced`, skip the travel and just update the count.             */

let count = 0;
const cart = $('#cart');
const countEl = $('#count');

function showCount() {
  countEl.textContent = count;
  countEl.hidden = false;
}

$$('.add').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const name = card.dataset.name;
    count += 1;

    // The message goes out straight away, whatever the animation does
    announce(`${name} added. ${count} in your order.`);

    // Reduced motion: no travel, just update the number
    if (reduced) { showCount(); return; }

    // ANIMATION 1: a copy of the card's art flies in an arc up to the cart
    const art = $('.art', card);
    const from = art.getBoundingClientRect();
    const to = cart.getBoundingClientRect();
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);

    const flyer = art.cloneNode(true);
    flyer.classList.add('flyer');
    Object.assign(flyer.style, {
      left: `${from.left}px`, top: `${from.top}px`,
      width: `${from.width}px`, height: `${from.height}px`,
    });
    document.body.append(flyer);

    flyer.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(.7)`, opacity: 1, offset: 0.45 }, // top of the arc
      { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0.4 },                            // drops into the cart
    ], { duration: 700, easing: 'cubic-bezier(.5, 0, .5, 1)' })
      .finished
      .then(() => {
        // ANIMATION 2 (chained): when the art lands, the count pops and the cart wiggles
        flyer.remove();
        showCount();
        cart.animate([
          { transform: 'rotate(0)' }, { transform: 'rotate(-12deg)' },
          { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' },
        ], { duration: 400, easing: 'ease-in-out' });
        return countEl.animate([
          { transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' },
        ], { duration: 450, easing: 'cubic-bezier(.34, 1.56, .64, 1)' }).finished;
      })
      .catch(() => { flyer.remove(); showCount(); }); // if an animation is cancelled, still show the count
  });
});


/* ---------- STEP 9: pause button (R8) ---------------------------------------
   Toggle the class 'paused' on document.documentElement, flip aria-pressed,
   and change the button text between "Pause motion" and "Play motion".     */

// It's a real <button>, so Enter and Space work from the keyboard automatically.
const pauseBtn = $('#pauseBtn');
pauseBtn.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('paused');  // CSS freezes every animation
  pauseBtn.setAttribute('aria-pressed', String(paused));               // tells screen readers it's on/off
  pauseBtn.textContent = paused ? 'Play motion' : 'Pause motion';
});


/* ---------- STEP 13: filter the menu with the View Transitions API ---------
   JS only decides WHICH cards are hidden. The browser animates the change.
   Fallback: no View Transitions support, reduced motion, or motion paused →
   the same update runs instantly, so the filter always works. */
const chips = $$('.chip');
const menuCards = $$('#menu .card');

// Checked on every click, so it reacts if the user changes the setting or presses Pause
const calm = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.classList.contains('paused');

chips.forEach((chip) => chip.addEventListener('click', () => {
  const filter = chip.dataset.filter;

  chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));

  const update = () => menuCards.forEach((card) => {
    card.classList.remove('pending', 'entering');   // never leave a filtered card half-revealed
    const tags = (card.dataset.tags || '').split(' ');
    card.hidden = !(filter === 'all' || tags.includes(filter));
  });

  if (document.startViewTransition && !calm()) {
    document.startViewTransition(update);           // animated: cards glide to their new places
  } else {
    update();                                       // fallback: instant, still correct
  }

  // Count from the tags, not from .hidden: inside a View Transition the update runs a moment later
  const shown = menuCards.filter((c) =>
    filter === 'all' || (c.dataset.tags || '').split(' ').includes(filter)).length;
  announce(`Showing ${shown} ${shown === 1 ? 'item' : 'items'}.`);  // screen readers hear the result
}));
