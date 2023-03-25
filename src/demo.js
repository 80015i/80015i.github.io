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

    var neuron_fill = document.getElementsByClassName('neuron_fill');
    var neuron_grad = document.getElementsByClassName('neuron_grad');
    var neuron_edge = document.getElementsByClassName('neuron_edge');

    for (var i = 0; i < neuron_fill.length; i++) {
    // for (var i = 0; i < 1; i++) {
      neuron_fill[i].setAttribute('gate', anime.random(1, 3));
      neuron_grad[i].setAttribute('gate', neuron_fill[i].getAttribute('gate'));
      neuron_edge[i].setAttribute('gate', neuron_fill[i].getAttribute('gate'));
      neuron_fill[i].setAttribute('progress', 0);
      neuron_grad[i].setAttribute('progress', 0);
      neuron_edge[i].setAttribute('progress', 0);

      // Make sure that paths are relative and start at zero 
      let path = Snap.path.toRelative(neuron_fill[i].getAttribute('d')).flat().join(" ");

      neuron_fill[i].setAttribute('d', path);
      neuron_grad[i].setAttribute('d', path);
      neuron_edge[i].setAttribute('d', path);

      const delay = 100 * ((i % 4) + Math.floor(i / 4)) + anime.random(0, 10000);
      const duration = 3000;
      const easing = "easeInOutExpo";
      const opacity_perc = 80;

      // TODO: to create a loop where all nodes go back to neurons **together**,
      // look at https://animejs.com/documentation/#TLParamsInheritance
      anime.timeline({
        targets: [neuron_fill[i], neuron_grad[i], neuron_edge[i]],
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
        opacity: anime.random(0, opacity_perc / 100),
        duration: duration,
      });

      anime({
        easing: easing,
        targets: neuron_fill[i],
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
