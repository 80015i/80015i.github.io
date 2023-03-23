# BoolSi website: 

# Installation
- TODO: webpack
- Install Snap
  - `npm -i -D imports-loader`
  - `npm install snapsvg`

## Notes: 
- requires hosting with a server since some SVGs have to be dynamically loaded
- adding new shapes from Figma requires rewriting them with relative positioning and wrapping them in SVG tags where the SVG tags carry the absolute position using the `x` and `y` attributes
    - also, the first two numbers after "m" in the path data set the starting position of the path, and they should be zeroed out
    - some SVGs may start at their right or bottom corner, so they may underflow. That is why the SVG tag has the overflow attribute set

# `svg-path-morph`
![ci](https://github.com/Minibrams/svg-path-morph/workflows/ci/badge.svg)
![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/Minibrams/52a42b0e3eb35095e2f81e12d63dc374/raw/svg-path-morph__master.json)
[![size](https://packagephobia.now.sh/badge?p=svg-path-morph)](https://packagephobia.now.sh/result?p=svg-path-morph)
[![version](http://img.shields.io/npm/v/svg-path-morph.svg?style=flat)](https://www.npmjs.org/package/svg-path-morph)

A simple library for morphing between variations of SVG paths.
Use `svg-path-morph` to smoothly morph between X variations of the same SVG path (i.e. same commands, different values).

# Installation
```
npm install svg-path-morph
```

# Demo

A live demo is also available on [my website](https://abrams.dk).

https://user-images.githubusercontent.com/8108085/172227481-1e1e1e9b-6868-41f9-81e0-dfb52ec32e3d.mp4

> See [demo.html](./demo.html) and [src/demo.js](./src/demo.js) for the implementation of the above demonstration

# Usage
```typescript

import { compile, morph } from 'svg-path-morph'


// Get the d attributes of the <path> elements you want to morph between
const happy = document.getElemenyById('happy').getAttribute('d')
const angry = document.getElemenyById('angry').getAttribute('d')

// Compile the morph base (average path embedding)
const compiled = compile([ 
  happy, 
  angry 
])

// Morph between the happy/angry faces
const slightlyAngry = morph(
  compiled,
  [
    0.80,  // 80% happy
    0.20   // 20% angry
  ]
)

// Use the face is the d attribute of a <path> element
document.getElementById('the-face').setAttribute('d', slightlyAngry)
```
