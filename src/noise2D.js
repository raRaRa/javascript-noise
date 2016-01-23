var SimplexNoise2D = (function () {
    
    var perm = [0, 35, 138, 20, 259, 277, 74, 228, 161, 162, 231, 79, 284, 268, 31, 151, 50, 17, 52, 155, 37, 276, 5, 91, 245, 178, 179, 248, 96, 12, 285, 48, 168, 67, 34, 69, 172, 54, 4, 22, 108, 262, 195, 196, 265, 113, 29, 13, 65, 185, 84, 51, 86, 189, 71, 21, 39, 125, 279, 212, 213, 282, 130, 46, 30, 82, 202, 101, 68, 103, 206, 88, 38, 56, 142, 7, 229, 230, 10, 147, 63, 47, 99, 219, 118, 85, 120, 223, 105, 55, 73, 159, 24, 246, 247, 27, 164, 80, 64, 116, 236, 135, 102, 137, 240, 122, 72, 90, 176, 41, 263, 264, 44, 181, 97, 81, 133, 253, 152, 119, 154, 257, 139, 89, 107, 193, 58, 280, 281, 61, 198, 114, 98, 150, 270, 169, 136, 171, 274, 156, 106, 124, 210, 75, 8, 9, 78, 215, 131, 115, 167, 287, 186, 153, 188, 2, 173, 123, 141, 227, 92, 25, 26, 95, 232, 148, 132, 184, 15, 203, 170, 205, 19, 190, 140, 158, 244, 109, 42, 43, 112, 249, 165, 149, 201, 32, 220, 187, 222, 36, 207, 157, 175, 261, 126, 59, 60, 129, 266, 182, 166, 218, 49, 237, 204, 239, 53, 224, 174, 192, 278, 143, 76, 77, 146, 283, 199, 183, 235, 66, 254, 221, 256, 70, 241, 191, 209, 6, 160, 93, 94, 163, 11, 216, 200, 252, 83, 271, 238, 273, 87, 258, 208, 226, 23, 177, 110, 111, 180, 28, 233, 217, 269, 100, 288, 255, 1, 104, 275, 225, 243, 40, 194, 127, 128, 197, 45, 250, 234, 286, 117, 16, 272, 18, 121, 3, 242, 260, 57, 211, 144, 145, 214, 62, 267, 251, 14, 134, 33];

    var C_0 = 1.0/6.0,
        C_1 = 1.0/3.0,
        mod289_temp0 = 1.0 / 289.0,
        i = vec2.create(),
        x0 = vec2.create(),
        i1 = vec2.create(),
        x12 = vec4.create(),
        p = vec3.create(),
        a0 = vec3.create(),
        x = vec3.create(),
        h = vec3.create(),
        a0 = vec3.create(),
        m = vec3.create(),
        g = vec3.create();

    // Optimization? All D variables in the code have been replaced with the actual number, so the variables below are not being used.
    // var D_vec4 = vec4.fromValues(0.0, 0.5, 1.0, 2.0);
    // var D_0 = 0.0;
    // var D_1 = 0.5;
    // var D_2 = 1.0;
    // var D_3 = 2.0;*/


    /*function mod289_vec4(x) {
        // GLSL code:
        // return x - floor(x * (1.0 / 289.0)) * 289.0;
        x[0] = x[0] - Math.floor(x[0] * mod289_temp0) * 289.0;
        x[1] = x[1] - Math.floor(x[1] * mod289_temp0) * 289.0;
        x[2] = x[2] - Math.floor(x[2] * mod289_temp0) * 289.0;
        x[3] = x[3] - Math.floor(x[3] * mod289_temp0) * 289.0;

        return x;
    };*/

    function mod289_vec2(inx) {
        // GLSL code:
        // return x - floor(x * (1.0 / 289.0)) * 289.0;
        inx[0] = inx[0] - Math.floor(inx[0] * (mod289_temp0)) * 289.0;
        inx[1] = inx[1] - Math.floor(inx[1] * (mod289_temp0)) * 289.0;
    };

    function snoise_vec2(inX, inY) {
        // For some reason it's a lot cheaper to pass in three variables, rather than using a vec2.
        // Need to investigate further.

/*        vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                              0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                             -0.577350269189626,  // -1.0 + 2.0 * C.x
                              0.024390243902439); // 1.0 / 41.0*/

        // First corner
        // GLSL code:
        // vec2 i = floor(v + dot(v, C.yy) );
        // Optimization? Taken from https://www.shadertoy.com/view/4sdGD8
        // vec2 i = floor(v + (v.x+v.y) * Y);
        i[0] = Math.floor(inX + (inX + inY) * 0.366025403784439);
        i[1] = Math.floor(inY + (inX + inY) * 0.366025403784439);
        // Old code:
        // var temp_dot0 = inX * 0.366025403784439 + inY * 0.366025403784439;
        // i[0] = Math.floor(inX + temp_dot0);
        // i[1] = Math.floor(inY + temp_dot0);

        // GLSL code:
        // vec2 x0 = v - i + dot(i, C.xx);
        // Optimization? Taken from https://www.shadertoy.com/view/4sdGD8
        // vec2 x0 = v - i + (i.x+i.y) * X;
        x0[0] = inX - i[0] + (i[0] + i[1]) * 0.211324865405187;
        x0[1] = inY - i[1] + (i[0] + i[1]) * 0.211324865405187;
        // Old code:
        //var temp_dot1 = i[0] * 0.211324865405187 + i[1] * 0.211324865405187;
        //x0[0] = inX - i[0] + temp_dot1;
        //x0[1] = inY - i[1] + temp_dot1;

        // GLSL code:
        // vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

        // Not sure which method is faster, using if or ? condition statement.
        //if (x0[0] > x0[1]) {
        //    i1[0] = 1.0;
        //    i1[1] = 0.0;
        //}
        //else {
        //    i1[0] = 0.0;
        //    i1[1] = 1.0; 
        //}
        i1[0] = (x0[0] > x0[1]) ? 1.0 : 0.0;
        i1[1] = (x0[0] > x0[1]) ? 0.0 : 1.0;

        // GLSL code:
        // vec4 x12 = x0.xyxy + C.xxzz;
        // x12.xy -= i1;
        x12[0] = x0[0] + 0.211324865405187 - i1[0];
        x12[1] = x0[1] + 0.211324865405187 - i1[1];
        x12[2] = x0[0] -0.577350269189626;
        x12[3] = x0[1] -0.577350269189626;

        // Permutations
        // GLSL code:
        // i = mod289(i);
        mod289_vec2(i);

        // GLSL code:
        // vec3 p = permute( permute( 
        //              i.y + vec3(0.0, i1.y, 1.0 ))
        //            + i.x + vec3(0.0, i1.x, 1.0 ));

        var sum = i[1] + i[0];

        p[0] = perm[perm[sum]] * 0.024390243902439;
        p[1] = perm[perm[sum + i1[1] + i1[0]]] * 0.024390243902439;
        p[2] = perm[perm[sum + 2.0]] * 0.024390243902439;



        // Optimized below, to save lines
        //m[0] = m[0] * m[0] * m[0] * m[0];
        //m[1] = m[1] * m[1] * m[1] * m[1];
        //m[2] = m[2] * m[2] * m[2] * m[2];

        // GLSL code:
        // vec3 x = 2.0 * fract(p * C.www) - 1.0;
        // fract(x) = x - floor(x)
        x[0] = 2.0 * (p[0] - Math.floor(p[0])) - 1.0;
        x[1] = 2.0 * (p[1] - Math.floor(p[1])) - 1.0;
        x[2] = 2.0 * (p[2] - Math.floor(p[2])) - 1.0;

        // GLSL code:
        // vec3 h = abs(x) - 0.5;
        h[0] = Math.abs(x[0]) - 0.5;
        h[1] = Math.abs(x[1]) - 0.5;
        h[2] = Math.abs(x[2]) - 0.5;

        // GLSL code:
        // vec3 ox = floor(x + 0.5);
       // ox[0] = Math.floor(x[0] + 0.5);
       // ox[1] = Math.floor(x[1] + 0.5);
       // ox[2] = Math.floor(x[2] + 0.5);

        // GLSL code:
        // vec3 a0 = x - ox;
        a0[0] = x[0] - Math.floor(x[0] + 0.5);
        a0[1] = x[1] - Math.floor(x[1] + 0.5);
        a0[2] = x[2] - Math.floor(x[2] + 0.5);

       /* p = permute_vec3(permute_vec3(p));
        p[0] *= 0.024390243902439;
        p[1] *= 0.024390243902439;
        p[2] *= 0.024390243902439;*/
       // p[1]  =permute_vec3(permute_vec3()) * 0.024390243902439;

        // GLSL code:
        // vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        // m = m*m ;
        // m = m*m ;

        m[0] = Math.max(0.5 - (x0[0] * x0[0] + x0[1] * x0[1]), 0.0);
        m[1] = Math.max(0.5 - (x12[0] * x12[0] + x12[1] * x12[1]), 0.0);
        m[2] = Math.max(0.5 - (x12[2] * x12[2] + x12[3] * x12[3]), 0.0);


        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        // GLSL code:
        // m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        m[0] = m[0] * m[0] * m[0] * m[0] * ( 1.79284291400159 - 0.85373472095314 * ( a0[0] * a0[0] + h[0] * h[0] ) );
        m[1] = m[1] * m[1] * m[1] * m[1] * ( 1.79284291400159 - 0.85373472095314 * ( a0[1] * a0[1] + h[1] * h[1] ) );
        m[2] = m[2] * m[2] * m[2] * m[2] * ( 1.79284291400159 - 0.85373472095314 * ( a0[2] * a0[2] + h[2] * h[2] ) );

        // Compute final noise value at P
        // GLSL code:
        // vec3 g;
        // g.x  = a0.x  * x0.x  + h.x  * x0.y;
        // g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        g[0] = a0[0]  * x0[0]  + h[0] * x0[1];
        g[1] = a0[1]  * x12[0] + h[1] * x12[1];
        g[2] = a0[2]  * x12[2] + h[2] * x12[3];

        // GLSL code:
        // return 130.0 * dot(m, g);

        return 130.0 * (m[0] * g[0] + m[1] * g[1] + m[2] * g[2]);//vec3.dot(m, g);
    };

    return {
        snoise_vec2: snoise_vec2
    };

}());