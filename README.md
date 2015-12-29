# javascript-noise
I ported [Ashima webgl-noise](https://github.com/ashima/webgl-noise) to JavaScript using glMatrix. Could be useful if you need to replicate the noise on the CPU for collision checks or other cool things.
I've only ported the 4D Simplex noise, and I only plan to port the 3D one. Feel free to port the rest if you're interested.
My future vision is to look into the performance benefits of using SIMD with glMatrix and Web Workers for threading.

### Demo ###

Currently there's only one demo that shows the output from a given 4D vector. I have plans to add more visual demos.