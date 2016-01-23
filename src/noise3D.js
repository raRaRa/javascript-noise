var SimplexNoise3D = (function () {
    
    var perm = [0, 35, 138, 20, 259, 277, 74, 228, 161, 162, 231, 79, 284, 268, 31, 151, 50, 17, 52, 155, 37, 276, 5, 91, 245, 178, 179, 248, 96, 12, 285, 48, 168, 67, 34, 69, 172, 54, 4, 22, 108, 262, 195, 196, 265, 113, 29, 13, 65, 185, 84, 51, 86, 189, 71, 21, 39, 125, 279, 212, 213, 282, 130, 46, 30, 82, 202, 101, 68, 103, 206, 88, 38, 56, 142, 7, 229, 230, 10, 147, 63, 47, 99, 219, 118, 85, 120, 223, 105, 55, 73, 159, 24, 246, 247, 27, 164, 80, 64, 116, 236, 135, 102, 137, 240, 122, 72, 90, 176, 41, 263, 264, 44, 181, 97, 81, 133, 253, 152, 119, 154, 257, 139, 89, 107, 193, 58, 280, 281, 61, 198, 114, 98, 150, 270, 169, 136, 171, 274, 156, 106, 124, 210, 75, 8, 9, 78, 215, 131, 115, 167, 287, 186, 153, 188, 2, 173, 123, 141, 227, 92, 25, 26, 95, 232, 148, 132, 184, 15, 203, 170, 205, 19, 190, 140, 158, 244, 109, 42, 43, 112, 249, 165, 149, 201, 32, 220, 187, 222, 36, 207, 157, 175, 261, 126, 59, 60, 129, 266, 182, 166, 218, 49, 237, 204, 239, 53, 224, 174, 192, 278, 143, 76, 77, 146, 283, 199, 183, 235, 66, 254, 221, 256, 70, 241, 191, 209, 6, 160, 93, 94, 163, 11, 216, 200, 252, 83, 271, 238, 273, 87, 258, 208, 226, 23, 177, 110, 111, 180, 28, 233, 217, 269, 100, 288, 255, 1, 104, 275, 225, 243, 40, 194, 127, 128, 197, 45, 250, 234, 286, 117, 16, 272, 18, 121, 3, 242, 260, 57, 211, 144, 145, 214, 62, 267, 251, 14, 134, 33];

    var C_0 = 1.0/6.0,
        C_1 = 1.0/3.0,
        mod289_vec3_temp0 = 1.0 / 289.0,
        i = vec3.create(),
        x0 = vec3.create(),
        n_ = 0.142857142857, // 1.0/7.0
        v = vec3.create(),
        g = vec3.create(),
        l = vec3.create(),
        i1 = vec3.create(),
        i2 = vec3.create(),
        x1 = vec3.create(),
        x2 = vec3.create(),
        x3 = vec3.create(),
        p = vec4.create(),
        ns = vec3.create(),
        j = vec4.create(),
        x_ = vec4.create(),
        y_ = vec4.create(),
        x = vec4.create(),
        y = vec4.create(),
        h = vec4.create(),
        s1 = vec4.create(),
        s0 = vec4.create(),
        sh = vec4.create(),
        a0 = vec4.create(),
        a1 = vec4.create(),
        p0 = vec3.create(),
        p1 = vec3.create(),
        p2 = vec3.create(),
        p3 = vec3.create(),
        norm = vec4.create(),
        m = vec4.create(),
        temp1 = vec4.create();

    // Optimization? All D variables in the code have been replaced with the actual number, so the variables below are not being used.
    // var D_vec4 = vec4.fromValues(0.0, 0.5, 1.0, 2.0);
    // var D_0 = 0.0;
    // var D_1 = 0.5;
    // var D_2 = 1.0;
    // var D_3 = 2.0;*/


    /*function mod289_vec4(x) {
        // GLSL code:
        // return x - floor(x * (1.0 / 289.0)) * 289.0;
        x[0] = x[0] - Math.floor(x[0] * mod289_vec3_temp0) * 289.0;
        x[1] = x[1] - Math.floor(x[1] * mod289_vec3_temp0) * 289.0;
        x[2] = x[2] - Math.floor(x[2] * mod289_vec3_temp0) * 289.0;
        x[3] = x[3] - Math.floor(x[3] * mod289_vec3_temp0) * 289.0;

        return x;
    };*/

    function mod289_vec3(inx) {
        // GLSL code:
        // return x - floor(x * (1.0 / 289.0)) * 289.0;
        inx[0] = inx[0] - Math.floor(inx[0] * (mod289_vec3_temp0)) * 289.0;
        inx[1] = inx[1] - Math.floor(inx[1] * (mod289_vec3_temp0)) * 289.0;
        inx[2] = inx[2] - Math.floor(inx[2] * (mod289_vec3_temp0)) * 289.0;
    };

/*
    function permute_vec4(x) {
        // GLSL code:
        // return mod289(((x*34.0)+1.0)*x);

        // Optimization? ( x*34.0 + 1.0 )*x == x*x*34.0 + x

        x[0] = x[0] * x[0] * 34.0 + x[0];
        //((x[0] * 34.0) + 1.0) * x[0];
        x[1] = x[1] * x[1] * 34.0 + x[1];
        //((x[1] * 34.0) + 1.0) * x[1];
        x[2] = x[2] * x[2] * 34.0 + x[2];
        //((x[2] * 34.0) + 1.0) * x[2];
        x[3] = x[3] * x[3] * 34.0 + x[3];
        //((x[3] * 34.0) + 1.0) * x[3];

        // Moved the code from mod289_vec4(x) to here below:
        x[0] = x[0] - Math.floor(x[0] * mod289_vec3_temp0) * 289.0;
        x[1] = x[1] - Math.floor(x[1] * mod289_vec3_temp0) * 289.0;
        x[2] = x[2] - Math.floor(x[2] * mod289_vec3_temp0) * 289.0;
        x[3] = x[3] - Math.floor(x[3] * mod289_vec3_temp0) * 289.0;

        return x;
        //return mod289_vec4(x);
    };*/

    function taylorInvSqrt_vec4(inr) {
        // GLSL code:
        // return 1.79284291400159 - 0.85373472095314 * r;
        inr[0] = 1.79284291400159 - 0.85373472095314 * inr[0];
        inr[1] = 1.79284291400159 - 0.85373472095314 * inr[1];
        inr[2] = 1.79284291400159 - 0.85373472095314 * inr[2];
        inr[3] = 1.79284291400159 - 0.85373472095314 * inr[3];
    };

    function snoise_vec3(inX, inY, inZ) {
        // For some reason it's a lot cheaper to pass in three variables, rather than using a vec3.
        // Need to investigate further.
        v[0] = inX;
        v[1] = inY;
        v[2] = inZ;

        // First corner
        // GLSL code:
        // vec3 i = floor(v + dot(v, C.yyy) );
        var temp_dot0 = inX * C_1 + inY * C_1 + inZ * C_1;
        i[0] = Math.floor(inX + temp_dot0);
        i[1] = Math.floor(inY + temp_dot0);
        i[2] = Math.floor(inZ + temp_dot0);

        // GLSL code:
        // vec3 x0 = v - i + dot(i, C.xxx);
        var temp_dot1 = i[0] * C_0 + i[1] * C_0 + i[2] * C_0;
        x0[0] = v[0] - i[0] + temp_dot1;
        x0[1] = v[1] - i[1] + temp_dot1;
        x0[2] = v[2] - i[2] + temp_dot1;

        // GLSL code:
        // vec3 g = step(x0.yzx, x0.xyz);
        g[0] = x0[0] < x0[1] ? 0.0 : 1.0;
        g[1] = x0[1] < x0[2] ? 0.0 : 1.0;
        g[2] = x0[2] < x0[0] ? 0.0 : 1.0;

        // GLSL code:
        // vec3 l = 1.0 - g;
        l[0] = 1.0 - g[0];
        l[1] = 1.0 - g[1];
        l[2] = 1.0 - g[2];

        // GLSL code:
        // vec3 i1 = min( g.xyz, l.zxy );
        i1[0] = Math.min(g[0], l[2]);
        i1[1] = Math.min(g[1], l[0]);
        i1[2] = Math.min(g[2], l[1]);
        
        // GLSL code:
        // vec3 i2 = max( g.xyz, l.zxy );
        i2[0] = Math.max(g[0], l[2]);
        i2[1] = Math.max(g[1], l[0]);
        i2[2] = Math.max(g[2], l[1]);

        // GLSL code:
        // vec3 x1 = x0 - i1 + C.xxx;
        x1[0] = x0[0] - i1[0] + C_0;
        x1[1] = x0[1] - i1[1] + C_0;
        x1[2] = x0[2] - i1[2] + C_0;
        
        // GLSL code:
        // vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        x2[0] = x0[0] - i2[0] + C_1;
        x2[1] = x0[1] - i2[1] + C_1;
        x2[2] = x0[2] - i2[2] + C_1;
        
        // GLSL code:
        // vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
        x3[0] = x0[0] - 0.5;
        x3[1] = x0[1] - 0.5;
        x3[2] = x0[2] - 0.5;

        // Permutations
        // GLSL code:
        // i = mod289(i);
        mod289_vec3(i);

        // GLSL code:
        // vec4 p = permute( permute( permute(
        //          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
        //        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
        //        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        var sum = i[2] + i[1] + i[0];
        // Passing this straight to the perm array lookup seems to be faster. Part of performance update #2
        //p[0] = sum;
        //p[1] = sum + i1[2] + i1[1] + i1[0];
        //p[2] = sum + i2[2] + i2[1] + i2[0];
        //p[3] = sum + 3.0;

        //p = permute_vec4( permute_vec4( permute_vec4( p ) ) );

        // Performance update #1
        //p[0] = perm[perm[perm[p[0]]]];
        //p[1] = perm[perm[perm[p[1]]]];
        //p[2] = perm[perm[perm[p[2]]]];
        //p[3] = perm[perm[perm[p[3]]]];

        // Performance update #2
        p[0] = perm[perm[perm[sum]]];
        p[1] = perm[perm[perm[sum + i1[2] + i1[1] + i1[0]]]];
        p[2] = perm[perm[perm[sum + i2[2] + i2[1] + i2[0]]]];
        p[3] = perm[perm[perm[sum + 3.0]]];

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        // GLSL code:
        // vec3  ns = n_ * D.wyz - D.xzx;
        // float n_ = 0.142857142857; // 1.0/7.0
        ns[0] = n_ * 2.0 - 0.0;
        ns[1] = n_ * 0.5 - 1.0;
        ns[2] = n_ * 1.0 - 0.0;

        // GLSL code:
        // vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
        var ns_z2 = ns[2] * ns[2];
        j[0] = p[0] - 49.0 * Math.floor(p[0] * ns_z2);
        j[1] = p[1] - 49.0 * Math.floor(p[1] * ns_z2);
        j[2] = p[2] - 49.0 * Math.floor(p[2] * ns_z2);
        j[3] = p[3] - 49.0 * Math.floor(p[3] * ns_z2);

        // GLSL code:
        // vec4 x_ = floor(j * ns.z);
        x_[0] = Math.floor(j[0] * ns[2]);
        x_[1] = Math.floor(j[1] * ns[2]);
        x_[2] = Math.floor(j[2] * ns[2]);
        x_[3] = Math.floor(j[3] * ns[2]);

        // GLSL code:
        // vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        y_[0] = Math.floor(j[0] - 7.0 * x_[0]);
        y_[1] = Math.floor(j[1] - 7.0 * x_[1]);
        y_[2] = Math.floor(j[2] - 7.0 * x_[2]);
        y_[3] = Math.floor(j[3] - 7.0 * x_[3]);

        // GLSL code:
        // vec4 x = x_ *ns.x + ns.yyyy;
        x[0] = x_[0] * ns[0] + ns[1];
        x[1] = x_[1] * ns[0] + ns[1];
        x[2] = x_[2] * ns[0] + ns[1];
        x[3] = x_[3] * ns[0] + ns[1];

        // GLSL code:
        // vec4 y = y_ *ns.x + ns.yyyy;
        y[0] = y_[0] * ns[0] + ns[1];
        y[1] = y_[1] * ns[0] + ns[1];
        y[2] = y_[2] * ns[0] + ns[1];
        y[3] = y_[3] * ns[0] + ns[1];

        // GLSL code:
        // vec4 h = 1.0 - abs(x) - abs(y);
        h[0] = 1.0 - Math.abs(x[0]) - Math.abs(y[0]);
        h[1] = 1.0 - Math.abs(x[1]) - Math.abs(y[1]);
        h[2] = 1.0 - Math.abs(x[2]) - Math.abs(y[2]);
        h[3] = 1.0 - Math.abs(x[3]) - Math.abs(y[3]);

        // GLSL code:
        // vec4 b0 = vec4( x.xy, y.xy );
        // Commented out, not needed, since we can simply use the x and y vectors below.
        //b0[0] = x[0];
        //b0[1] = x[1];
        //b0[2] = y[0];
        //b0[3] = y[1];

        // GLSL code:
        // vec4 b1 = vec4( x.zw, y.zw );
        // Commented out, not needed, since we can simply use the x and y vectors below.
        //b1[0] = x[2];
        //b1[1] = x[3];
        //b1[2] = y[2];
        //b1[3] = y[3];

        // GLSL code:
        // vec4 s0 = floor(b0)*2.0 + 1.0;
        s0[0] = Math.floor(x[0]) * 2.0 + 1.0;
        s0[1] = Math.floor(x[1]) * 2.0 + 1.0;
        s0[2] = Math.floor(y[0]) * 2.0 + 1.0;
        s0[3] = Math.floor(y[1]) * 2.0 + 1.0;

        // GLSL code:
        // vec4 s1 = floor(b1)*2.0 + 1.0;
        s1[0] = Math.floor(x[2]) * 2.0 + 1.0;
        s1[1] = Math.floor(x[3]) * 2.0 + 1.0;
        s1[2] = Math.floor(y[2]) * 2.0 + 1.0;
        s1[3] = Math.floor(y[3]) * 2.0 + 1.0;

        // GLSL code:
        // vec4 sh = -step(h, vec4(0.0));
        sh[0] = 0 < h[0] ? -0.0 : -1.0;
        sh[1] = 0 < h[1] ? -0.0 : -1.0;
        sh[2] = 0 < h[2] ? -0.0 : -1.0;
        sh[3] = 0 < h[3] ? -0.0 : -1.0;
        
        // GLSL code:
        // vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        a0[0] = x[0] + s0[0] * sh[0];
        a0[1] = y[0] + s0[2] * sh[0];
        a0[2] = x[1] + s0[1] * sh[1];
        a0[3] = y[1] + s0[3] * sh[1];

        // GLSL code:
        // vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        a1[0] = x[2] + s1[0] * sh[2];
        a1[1] = y[2] + s1[2] * sh[2];
        a1[2] = x[3] + s1[1] * sh[3];
        a1[3] = y[3] + s1[3] * sh[3];


        // Normalise gradients
        // GLSL code:
        // vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        norm[0] = a0[0] * a0[0] + a0[1] * a0[1] + h[0] * h[0];//vec3.dot(p0, p0);
        norm[1] = a0[2] * a0[2] + a0[3] * a0[3] + h[1] * h[1];//vec3.dot(p1, p1);
        norm[2] = a1[0] * a1[0] + a1[1] * a1[1] + h[2] * h[2];//vec3.dot(p2, p2);
        norm[3] = a1[2] * a1[2] + a1[3] * a1[3] + h[3] * h[3];//vec3.dot(p3, p3);

        taylorInvSqrt_vec4(norm);

        // GLSL code:
        // p0 *= norm.x;
        // p1 *= norm.y;
        // p2 *= norm.z;
        // p3 *= norm.w;

        // GLSL code:
        // vec3 p0 = vec3(a0.xy,h.x);
        //p0[0] = a0[0] * norm[0];
        //p0[1] = a0[1] * norm[0];
        //p0[2] =  h[0] * norm[0];
        temp1[0] = a0[0] * norm[0] * x0[0] + a0[1] * norm[0] * x0[1] + h[0] * norm[0] * x0[2];

        // GLSL code:
        // vec3 p1 = vec3(a0.zw,h.y);
        //p1[0] = a0[2] * norm[1];
        //p1[1] = a0[3] * norm[1];
        //p1[2] =  h[1] * norm[1];
        temp1[1] = a0[2] * norm[1] * x1[0] + a0[3] * norm[1] * x1[1] + h[1] * norm[1] * x1[2];

        // GLSL code:
        // vec3 p2 = vec3(a1.xy,h.z);
        //p2[0] = a1[0] * norm[2];
        //p2[1] = a1[1] * norm[2];
        //p2[2] =  h[2] * norm[2];*
        temp1[2] = a1[0] * norm[2] * x2[0] + a1[1] * norm[2] * x2[1] + h[2] * norm[2] * x2[2];

        // GLSL code:
        // vec3 p3 = vec3(a1.zw,h.w);
        //p3[0] = a1[2] * norm[3];
        //p3[1] = a1[3] * norm[3];
        //p3[2] =  h[3] * norm[3];
        temp1[3] = a1[2] * norm[3] * x3[0] + a1[3] * norm[3] * x3[1] + h[3] * norm[3] * x3[2];

        //p0 = vec3.scale(p0, p0, norm[0]);
        //p1 = vec3.scale(p1, p1, norm[1]);
        //p2 = vec3.scale(p2, p2, norm[2]);
        //p3 = vec3.scale(p3, p3, norm[3]);

        // Mix final noise value
        // GLSL code:
        // vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m[0] = Math.max(0.6 - vec3.dot(x0, x0), 0.0);
        m[1] = Math.max(0.6 - vec3.dot(x1, x1), 0.0);
        m[2] = Math.max(0.6 - vec3.dot(x2, x2), 0.0);
        m[3] = Math.max(0.6 - vec3.dot(x3, x3), 0.0);

        // GLSL code:
        // m = m * m * m;
        /*m[0] = m[0] * m[0] * m[0] * m[0];
        m[1] = m[1] * m[1] * m[1] * m[1];
        m[2] = m[2] * m[2] * m[2] * m[2];
        m[3] = m[3] * m[3] * m[3] * m[3];*/

        //var res = m[0] * m[0] * m[0] * m[0] * temp1[0] + m[1] * m[1] * m[1] * m[1] * temp1[1] + m[2] * m[2] * m[2] * m[2] * temp1[2] + m[3] * m[3] * m[3] * m[3] * temp1[3];

        // GLSL code:
        // return 42.0 * dot( m, vec4( dot(p0,x0), dot(p1,x1), 
        //                            dot(p2,x2), dot(p3,x3) ) );
        //temp1[0] = vec3.dot(p0, x0);
        //temp1[1] = vec3.dot(p1, x1);
        //temp1[2] = vec3.dot(p2, x2);
        //temp1[3] = vec3.dot(p3, x3);

        //return 42.0 * vec4.dot(m, temp1);
        return 42.0 * (m[0] * m[0] * m[0] * m[0] * temp1[0] + m[1] * m[1] * m[1] * m[1] * temp1[1] + m[2] * m[2] * m[2] * m[2] * temp1[2] + m[3] * m[3] * m[3] * m[3] * temp1[3]);
    };

    return {
        snoise_vec3: snoise_vec3
    };

}());