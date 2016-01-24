# javascript-noise

### JavaScript Simplex Noise

I ported [Ashima webgl-noise](https://github.com/ashima/webgl-noise) to JavaScript. It could be useful if you need to replicate the noise on the CPU for collision checks, and other cool things.
I've only ported the 2D, 3D and 4D noise functions. Feel free to port the rest if you're interested.
My future vision is to look into the performance benefits of using SIMD with glMatrix and Web Workers for multithreading.

I've only optimized the 2D and 3D noise functions.

### Demo ###

There are 3 demos available, one that shows the output from calling the 2D, 3D and 4D noise functions, and 2D and 3D noise demos that show something more visual.

[Demo page](http://rarara.github.io/javascript-noise/)
