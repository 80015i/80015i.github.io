import { compile, morph } from '../'

const templates = document.getElementById('templates')
const bounds = templates.getBoundingClientRect()

const topLeftPercentage = document.getElementById('top-left-percentage')
const topRightPercentage = document.getElementById('top-right-percentage')
const botLeftPercentage = document.getElementById('bot-left-percentage')
const botRightPercentage = document.getElementById('bot-right-percentage')

// const morphed = document.getElementById('neuron31')
// const paths = {
//   topLeft: document.getElementById('top-left').getAttribute('d'),
//   topRight: document.getElementById('top-right').getAttribute('d'),
//   botLeft: document.getElementById('bot-left').getAttribute('d'),
//   botRight: document.getElementById('bot-right').getAttribute('d')
// }

// const compiled = compile([
//   paths.NRN,
//   paths.,
//   paths.botLeft,
//   paths.botRight
// ])


var morphed = null;
var paths = null;
var compiled = null;

window.addEventListener("load", function() {
  morphed = document.getElementById('alphasvg').contentDocument.getElementById('neuron31')

  paths = {
    NRN: document.getElementById('NRN').contentDocument
        .getElementsByTagName('path')[0].getAttribute('d'),
    AND: document.getElementById('AND').contentDocument
        .getElementsByTagName('path')[0].getAttribute('d'),
    OR:  document.getElementById('OR') .contentDocument
        .getElementsByTagName('path')[0].getAttribute('d'),
    REG: document.getElementById('REG').contentDocument
        .getElementsByTagName('path')[0].getAttribute('d'),
    NOT: document.getElementById('NOT').contentDocument
        .getElementsByTagName('path')[0].getAttribute('d'),
  }

  compiled = compile([
    paths.NRN,
    paths.AND,
    paths.OR,
    paths.REG
  ])
})

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

window.addEventListener('mousemove', (e) => {
  let x = (e.clientX - bounds.left) / bounds.width
  let y = (e.clientY - bounds.top) / bounds.height

  if (x < 0 || x > 1 || y < 0 || y > 1) {
    x = 0
    y = 0
  }

  const distToMiddle = Math.sqrt(2) / 2

  const topRightPct = 1 - clamp(dist(x, y, 0, 0) / distToMiddle, 0, 1)
  const topLeftPct = 1 - clamp(dist(x, y, 1, 0) / distToMiddle, 0, 1)
  const botLeftPct = 1 - clamp(dist(x, y, 0, 1) / distToMiddle, 0, 1)
  const botRightPct = 1 - clamp(dist(x, y, 1, 1) / distToMiddle, 0, 1)

  topLeftPercentage.innerText = `${Math.round(topRightPct * 100)}%`
  topRightPercentage.innerText = `${Math.round(topLeftPct * 100)}%`
  botLeftPercentage.innerText = `${Math.round(botLeftPct * 100)}%`
  botRightPercentage.innerText = `${Math.round(botRightPct * 100)}%`

  morphed.setAttribute('d', morph(compiled, [
    topRightPct,
    topLeftPct,
    botLeftPct,
    botRightPct
  ]))
})
