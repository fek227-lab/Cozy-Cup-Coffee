# Motion log

**Student:**
**Shop name:**
**Live site:** https://

## Motion sentences

Write one row for every animation. Fill in all six parts:

> When **[trigger]**, the **[element]** changes **[property]** over **[duration and delay]** with **[easing]**, so that **[job]**.

Jobs: feedback, orientation, continuity, status, storytelling, delight.

| # | Req | Trigger | Element | Property | Duration / delay | Easing | Job | Tool |
|---|-----|---------|---------|----------|------------------|--------|-----|------|
| 1 | R1 | hover or focus | menu card | translateY 0 → -6px | 450ms | ease-out | feedback | transition |
| 2 | R2 | | | | | | | |
| 3 | R3 | | | | | | | |
| 4 | R3 | | | | | | | |
| 5 | R4 | | | | | | | |
| 6 | R5 | | | | | | | |
| 7 | R6 | | | | | | | |
| 8 | R6 | | | | | | | |

Tool = transition, @keyframes, IntersectionObserver, scroll progress, element.animate(), SVG, View Transition.

## Easing choices (R7)

Name three different easing curves you used. For each, say in one sentence why it fits that motion.

1. **Ease-out, `cubic-bezier(.2, .8, .2, 1)`** on the headline words, the menu cards rising into view, and the card hover lift. It starts fast and slows gently at the end, so things arrive quickly and settle softly into place, like setting a cup down on a table.
2. **Spring, `cubic-bezier(.34, 1.56, .64, 1)`** on the shop door opening and the cart count popping. The second number goes above 1, so the motion overshoots a little and bounces back. That gives the door and the count a playful, bouncy "yes, that happened!" feeling.
3. **Ease-in-out** on the looping storefront parts: the awning sway, the sign swing and the mascot bounce. They slow down at both ends of each swing, like a real pendulum or fabric in a breeze, so the loops feel calm and natural instead of mechanical.

## What I saw in the X-ray

Pick one animation and describe what the Motion X-ray or the Chrome Animations panel showed you that you couldn't see at normal speed.

## Checks

- [ ] (R8) Reduced motion emulated in DevTools: what still moves, and what stops?
- [ ] (R8) Pause button stops every infinite loop, and works from the keyboard
- [ ] (R8) Every :hover effect also happens on :focus-visible
- [ ] (R8) Nothing flashes more than 3 times per second
- [ ] (R9) Paint flashing checked: my animations use transform and opacity
- [ ] (R9) No `transition: all` anywhere
- [ ] (R4) With JavaScript disabled, every card is still visible
