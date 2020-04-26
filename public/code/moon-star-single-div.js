/**
 * 🌙 & ⭐️ (Single <div>) - @davejs
 * https://codepen.io/davejs/pen/mdeWdaL
 */

appendHtml('<div id="demo"></div>')

appendCss(`
#mountNode {
  perspective: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 100vh; */
  overflow: hidden;
  background-image: radial-gradient(navy, #002);
}

#demo {
  --color: lightgoldenrodyellow;
  position: relative;
  font-size: 2rem;
  height: 5em;
  width: 5em;
  border-radius: 50%;
  box-shadow: inset -0.4em -0.55em 0.5em -0.25em #0007, inset -0.75em -0.5em 0.075em 0.25em var(--color), 2em 0.05em 3em -1.5em var(--color);
}

@keyframes orbit {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

#demo::before, #demo::after {
  position: absolute;
  top: 200%;
  left: -1000%;
  display: block;
  height: 200rem;
  width: 200rem;
  content: '';
  border-radius: 50%;
  z-index: -1;
  animation: orbit 300s infinite linear;
  box-shadow:
    -40rem -106rem 1rem -99.5rem #fff6,
    -40rem -106rem 1px -99.65rem #c568,
    -32rem -96rem 1.5rem -99.5rem #ffe8,
    -32rem -96rem 1px -99.9rem #ffc9,
    -31rem -110rem 1.5rem -99.5rem #ffe6,
    -31rem -110rem 1px -99.9rem #ffc6,
    -11rem -115rem 1.5rem -99.5rem #ffe8,
    -11rem -115rem 1px -99.9rem #ffc6,
    11rem -105rem 1.5rem -99.5rem #ffe6,
    11rem -105rem 1px -99.9rem #ffc6,
    -11rem -135rem 1.5rem -99.5rem #ffe4,
    -11rem -135rem 1px -99.9rem #ffc5,
    31rem -115rem 1.5rem -99.5rem #ffe6,
    31rem -115rem 1px -99.9rem #ffc6,
    -51rem -115rem 1.5rem -99.5rem #ffe9,
    -51rem -115rem 1px -99.9rem #ffc6,
    21rem -125rem 1.5rem -99.5rem #ffe6,
    21rem -125rem 1px -99.9rem #ffc6,
    5rem -115rem 1.5rem -99.5rem #ffe9,
    5rem -115rem 1px -99.9rem #ffc6,

    -96rem  -32rem 1.5rem -99.5rem #ffe8,
    -96rem  -32rem 1px -99.9rem #ffc9,
    -110rem -31rem  1.5rem -99.5rem #ffe6,
    -110rem -31rem  1px -99.9rem #ffc6,
    -115rem -11rem  1.5rem -99.5rem #ffe8,
    -115rem -11rem  1px -99.9rem #ffc6,
    -105rem 11rem  1.5rem -99.5rem #ffe6,
    -105rem 11rem  1px -99.9rem #ffc6,
    -135rem -11rem  1.5rem -99.5rem #ffe4,
    -135rem -11rem  1px -99.9rem #ffc5,
    -115rem 31rem  1.5rem -99.5rem #ffe6,
    -115rem 31rem  1px -99.9rem #ffc6,
    -115rem -51rem  1.5rem -99.5rem #ffe9,
    -115rem -51rem  1px -99.9rem #ffc6,
    -125rem 21rem  1.5rem -99.5rem #ffe6,
    -125rem 21rem  1px -99.9rem #ffc6,
    -115rem 5rem  1.5rem -99.5rem #ffe9,
    -115rem 5rem  1px -99.9rem #ffc6,

    96rem  32rem 1.5rem -99.5rem #ffe8,
    96rem  32rem 1px -99.9rem #ffc9,
    110rem 31rem  1.5rem -99.5rem #ffe6,
    110rem 31rem  1px -99.9rem #ffc6,
    115rem 11rem  1.5rem -99.5rem #ffe8,
    115rem 11rem  1px -99.9rem #ffc6,
    105rem -11rem  1.5rem -99.5rem #ffe6,
    105rem -11rem  1px -99.9rem #ffc6,
    135rem 11rem  1.5rem -99.5rem #ffe4,
    135rem 11rem  1px -99.9rem #ffc5,
    115rem -31rem  1.5rem -99.5rem #ffe6,
    115rem -31rem  1px -99.9rem #ffc6,
    115rem 51rem  1.5rem -99.5rem #ffe9,
    115rem 51rem  1px -99.9rem #ffc6,
    125rem -21rem  1.5rem -99.5rem #ffe6,
    125rem -21rem  1px -99.9rem #ffc6,
    115rem -5rem  1.5rem -99.5rem #ffe9,
    115rem -5rem  1px -99.9rem #ffc6,

    -21rem -125rem 1.5rem -99.5rem #ffe8,
    -21rem -125rem 1px -99.9rem #ffc6,
    -61rem -105rem 1.5rem -99.5rem #ffe3,
    -61rem -105rem 1px -99.9rem #ffc6,
    -61rem -95rem 1.5rem -99.5rem #ffe4,
    -61rem -95rem 1px -99.9rem #ffc6,
    -71rem -75rem 1.5rem -99.5rem #ffe7,
    -71rem -75rem 1px -99.9rem #ffc6,
    -55rem -85rem 1.5rem -99.5rem #ffe6,
    -55rem -85rem 1px -99.9rem #ffc6,
    -125rem -21rem  1.5rem -99.5rem #ffe8,
    -125rem -21rem  1px -99.9rem #ffc6,
    -105rem -61rem  1.5rem -99.5rem #ffe3,
    -105rem -61rem  1px -99.9rem #ffc6,
    -95rem -61rem 1.5rem -99.5rem #ffe4,
    -95rem -61rem 1px -99.9rem #ffc6,
    75rem 71rem 1.5rem -99.5rem #ffe7,
    75rem 71rem 1px -99.9rem #ffc6,
    85rem 55rem 1.5rem -99.5rem #ffe6,
    85rem 55rem 1px -99.9rem #ffc6,
    125rem 21rem  1.5rem -99.5rem #ffe8,
    125rem 21rem  1px -99.9rem #ffc6,
    105rem 61rem  1.5rem -99.5rem #ffe3,
    105rem 61rem  1px -99.9rem #ffc6,
    95rem 61rem 1.5rem -99.5rem #ffe4,
    95rem 61rem 1px -99.9rem #ffc6,
    75rem 71rem 1.5rem -99.5rem #ffe7,
    75rem 71rem 1px -99.9rem #ffc6,
    85rem 55rem 1.5rem -99.5rem #ffe6,
    85rem 55rem 1px -99.9rem #ffc6,
    32rem 96rem 1.5rem -99.5rem #ffe8,
    32rem 96rem 1px -99.9rem #ffc9,
    31rem 110rem 1.5rem -99.5rem #ffe6,
    31rem 110rem 1px -99.9rem #ffc6,
    11rem 115rem 1.5rem -99.5rem #ffe8,
    11rem 115rem 1px -99.9rem #ffc6,
    -11rem 105rem 1.5rem -99.5rem #ffe6,
    -11rem 105rem 1px -99.9rem #ffc6,
    11rem 135rem 1.5rem -99.5rem #ffe4,
    11rem 135rem 1px -99.9rem #ffc5,
    -31rem 115rem 1.5rem -99.5rem #ffe6,
    -31rem 115rem 1px -99.9rem #ffc6,
    51rem 115rem 1.5rem -99.5rem #ffe9,
    51rem 115rem 1px -99.9rem #ffc6,
    -21rem 125rem 1.5rem -99.5rem #ffe6,
    -21rem 125rem 1px -99.9rem #ffc6,
    -5rem 115rem 1.5rem -99.5rem #ffe9,
    -5rem 115rem 1px -99.9rem #ffc6,
    21rem 125rem 1.5rem -99.5rem #ffe8,
    21rem 125rem 1px -99.9rem #ffc6,
    61rem 105rem 1.5rem -99.5rem #ffe3,
    61rem 105rem 1px -99.9rem #ffc6,
    61rem 95rem 1.5rem -99.5rem #ffe4,
    61rem 95rem 1px -99.9rem #ffc6,
    71rem 75rem 1.5rem -99.5rem #ffe7,
    71rem 75rem 1px -99.9rem #ffc6,
    55rem 85rem 1.5rem -99.5rem #ffe6,
    55rem 85rem 1px -99.9rem #ffc6;
}

#demo::after {
  opacity: 0.35;
  animation-delay: -100s;
  animation-duration: 600s;
  top: 10vh;
}
`)
