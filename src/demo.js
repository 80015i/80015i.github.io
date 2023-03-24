import { compile, morph } from '../'
// TODO: instead of loading snapsvg as a script, package it with webpack
// import Snap from 'snapsvg';

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

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

window.addEventListener('mousemove', (e) => {
  // let x = (e.clientX - bounds.left) / bounds.width
  // let y = (e.clientY - bounds.top) / bounds.height
  //
  // if (x < 0 || x > 1 || y < 0 || y > 1) {
  //   x = 0
  //   y = 0
  // }
  //
  // const distToMiddle = Math.sqrt(2) / 2
  //
  // const topRightPct = 1 - clamp(dist(x, y, 0, 0) / distToMiddle, 0, 1)
  // const topLeftPct = 1 - clamp(dist(x, y, 1, 0) / distToMiddle, 0, 1)
  // const botLeftPct = 1 - clamp(dist(x, y, 0, 1) / distToMiddle, 0, 1)
  // const botRightPct = 1 - clamp(dist(x, y, 1, 1) / distToMiddle, 0, 1)
  //
  // topLeftPercentage.innerText = `${Math.round(topRightPct * 100)}%`
  // topRightPercentage.innerText = `${Math.round(topLeftPct * 100)}%`
  // botLeftPercentage.innerText = `${Math.round(botLeftPct * 100)}%`
  // botRightPercentage.innerText = `${Math.round(botRightPct * 100)}%`
  //
  // morphed.setAttribute('d', morph(compiled, [
  //   topRightPct,
  //   topLeftPct,
  //   botLeftPct,
  //   botRightPct
  // ]))
})

/*
 * Function that returns the weight array based on gate idx and progress value
 */
const getGate = (idx, progress) => {
  let gate = [0, 0, 0, 0]
  gate[idx] = Number(progress)
  return gate
}

/**
 * Animation function
 */
window.addEventListener("load", function() {

  /*
   * When the topology boject is loaded, extract the SVG and replace it in the DOM.
   * The SVG should be a child of the section with id="butterfly".
   * FIXME: waits 10 milliseconds because otherwise sometimes the SVG does not show up
   */
  setTimeout(() => {
    let topology = document.getElementById("topology");
    let topology_svg = topology.contentDocument.getElementById("butterflysvg");
    topology.remove();
    document.getElementById("graphics").appendChild(topology_svg);
  }, 10);
  anime({
    targets: ".neuron",
    // scale: 1.2,
    fill: '#F0F',
    delay: function(el, i, l) {
      let x = i % 4
      let y = Math.floor(i / 4)
      return 100 * (x + y) + anime.random(0, 5000);
    },
    // update: function() {
    //   morphed.setAttribute('d', morph(compiled, [
    //     0.5,
    //     0.5,
    //     0.5,
    //     0.5
    //   ]))
    // },
  })
})
