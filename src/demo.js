import { compile, morph } from '../'
// TODO: instead of loading snapsvg as a script, package it with webpack
// import Snap from 'snapsvg';

/**
 * Assumes that the DOM has already loaded an SVG and returns the path
 * in the SVG. Assumes that there is only one path inside it.
 * Converts the path to a relative path.
 */
const loadsvg = (id) => {
  const svg = document.getElementById(id).contentDocument;
  const path = svg.getElementsByTagName('path')[0].getAttribute('d');
  const relpath = Snap.path.toRelative(path);

  relpath[0] = ["m", 0, 0];

  return relpath.flat().join(" ");
}

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

/*
 * Function that returns the weight array based on gate idx and progress value
 */
const getGate = (idx, progress) => {
  let gate = [0, 0, 0, 0, 0];
  gate[idx] = Number(progress);
  return gate;
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
    loadsvg('NOT'),
  ]);


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
      neuron_solid[i].setAttribute('gate', anime.random(1, 4));
      neuron_gradient[i].setAttribute('gate', neuron_solid[i].getAttribute('gate'));
      neuron_solid[i].setAttribute('progress', 0);
      neuron_gradient[i].setAttribute('progress', 0);

      // Make sure that paths are relative and start at zero 
      let path = Snap.path.toRelative(neuron_solid[i].getAttribute('d')).flat().join(" ");
      neuron_solid[i].setAttribute('d', path);
      neuron_gradient[i].setAttribute('d', path);

      let delay = 100 * ((i % 4) + Math.floor(i / 4)) + anime.random(0, 10000);
      let duration = 3000;
      let easing = "easeInOutExpo";

      // TODO: to create a loop where all nodes go back to neurons **together**,
      // look at https://animejs.com/documentation/#TLParamsInheritance
      anime.timeline({
        targets: [neuron_solid[i], neuron_gradient[i]],
        progress: 1,
        delay: delay,
        easing: easing,
        d: function(el, i, l) {
          let gate = el.getAttribute('gate');
          let weights = getGate(gate, 1);
          let newpath = morph(compiled, weights);

          // make sure that el's start is preserved
          let old_start = el.getAttribute('d').split("c")[0];
          let new_end = newpath.split("c").slice(1);
          return old_start + "c" + new_end.join("c");
        }, 
        // opacity: anime.random(0, 2),
        duration: duration,
        // endDelay: 10000, 
        // direction: 'alternate',
        // loop: true,
      }).add({
        // Make nodes disappear a shortly before changing shape, in order to not confuse
        easing: easing,
        delay: delay - 500,
        opacity: anime.random(0, 0.8),
        duration: duration,
      });

      anime({
        easing: easing,
        targets: neuron_solid[i],
        delay: delay,
        fill: "#2DBD89",
        duration: duration,
        // endDelay: 10000, 
        // direction: 'alternate',
        // loop: true,
      });

    }
  }, 10);
})
