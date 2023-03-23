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
        

