# WebGL Cube
This is a Rubik's Cube simulation I wrote in JavaScript with WebGL.
This project is primarily to demonstrate what I've learned studying 3D graphics & web programming,
involving concepts such as 3D Graphics, Shaders, Matrices, Linear Algebra, Generators & Concurrency, and much more.

It incorporates the following features:
- An interactive 3x3 Rubik's Cube that can
  - be viewed at all angles by rotating it with a drag of the mouse
  - have its faces turned with key/button presses to yield the any of its 43 quintillion combinations
  - be scrambled through 50 random moves that can pose a serious challenge to undo
- The quintessential "checkerboard" pattern is automated via yet another key/button
- All of the above-mentioned actions are beautifully animated using an ease-in-out function

Besides these, here are some features that I've wished to implement but haven't had the time for:
- Cube Algorithm Interpreter
  - This takes an input string of Rubik's Cube moves and executes them on the Cube, automating the process of what would have been tediously pushing buttons in sequence
  - A complimentary feature to this would be a list of Rubik's Cube patterns, besides the checkerboard, with their corresponding algorithms
- Cube Solver
  - This uses group theory & graph theory to compute an optimal algorithm to return the cube to its unscrambled state, which could then be executed in the above-mentioned algorithm interpreter, thus solving the cube

The cube can be found at [freddycoppa.github.io/webgl_cube](https://freddycoppa.github.io/webgl_cube/)
