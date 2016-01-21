# javascript-noise
I ported [Ashima webgl-noise](https://github.com/ashima/webgl-noise) to JavaScript using glMatrix. Could be useful if you need to replicate the noise on the CPU for collision checks or other cool things.
I've only ported the 3D and 4D noise methods. Feel free to port the rest if you're interested.
My future vision is to look into the performance benefits of using SIMD with glMatrix and Web Workers for multithreading.

I have only optimized the 3D noise function (about 12x faster than before).

### Demo ###

There are two demos available, one that shows the output from calling the 3D and 4D noise functions, and another 3D noise demo that shows something more visual.