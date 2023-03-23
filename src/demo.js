import { compile, morph } from '../'
// TODO: instead of loading snapsvg as a script, package it with webpack
// import Snap from 'snapsvg';

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

/**
 * Assumes that the DOM has already loaded an SVG and returns the path
 * in the SVG. Assumes that there is only one path inside it.
 * Converts the path to a relative path.
 */
const loadsvg = (id) => {
  const svg = document.getElementById(id).contentDocument
  const path = svg.getElementsByTagName('path')[0].getAttribute('d')
  const relpath = Snap.path.toRelative(path)

  relpath[0] = ["m", 0, 0]

  return relpath.flat().join(" ")
}

window.addEventListener("load", function() {
  morphed = document.getElementById('alphasvg').contentDocument.getElementById('neuron31')

  paths = {
    NRN: loadsvg('NRN'),
    AND: loadsvg('AND'), 
    OR:  loadsvg('OR'), 
    REG: loadsvg('REG'),
    NOT: loadsvg('NOT') 
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
