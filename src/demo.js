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
  const compiled = compile([
    loadsvg('NRN'),
    loadsvg('AND'), 
    loadsvg('OR'), 
    loadsvg('REG'),
    // loadsvg('NOT')
 ])


  /*
   * When the nodes_temp object is loaded, extract the SVG and replace it in the DOM.
   * The SVG should be a child of the section with id="butterfly".
   * FIXME: waits 10 milliseconds because otherwise sometimes the SVG does not show up
   */
  setTimeout(() => {
    let nodes_temp = document.getElementById("nodes_temp");
    let nodes_svg = nodes_temp.contentDocument.getElementById("nodes_svg");
    nodes_temp.remove();
    document.getElementById("graphics").appendChild(nodes_svg);

    var neuron_solid = document.getElementsByClassName('neuron_solid');
    var neuron_gradient =  document.getElementsByClassName('neuron_gradient');

    for (var i = 0; i < neuron_solid.length; i++) {
    // for (var i = 0; i < 1; i++) {
      neuron_solid[i].setAttribute('gate', anime.random(1, 3));
      neuron_gradient[i].setAttribute('gate', neuron_solid[i].getAttribute('gate'));
      neuron_solid[i].setAttribute('progress', 0);
      neuron_gradient[i].setAttribute('progress', 0);

      // Make sure that paths are relative and start at zero 
      var path = Snap.path.toRelative(neuron_solid[i].getAttribute('d')).flat().join(" ");
      neuron_solid[i].setAttribute('d', path);
      neuron_gradient[i].setAttribute('d', path);

      var delay = 100 * ((i % 4) + Math.floor(i / 4)) + anime.random(0, 5000);

      anime({
        targets: [neuron_solid[i], neuron_gradient[i]],
        // scale: 1.2,
        // fill: 'url(#neuron_gradient2)',
        progress: 1,
        delay: delay,
        // fill: "url(#neuron_gradient2)",
        // fill: '#ff0000',
        // opacity: 0.5,
        d: function(el, i, l) {
          let gate = el.getAttribute('gate');
          let weights = getGate(gate, 1);
          let newpath = morph(compiled, weights);

          // make sure that el's start is preserved
          let old_start = el.getAttribute('d').split("c")[0];
          let new_end = newpath.split("c").slice(1);
          return old_start + "c" + new_end.join("c");
        }, 
        duration: 1000,
      })
    }
  }, 10);
})
