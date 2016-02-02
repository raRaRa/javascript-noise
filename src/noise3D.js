"use strict";

function SimplexNoise3D() {
    this.perm = new Int32Array ([0, 35, 138, 20, 259, 277, 74, 228, 161, 162, 231, 79, 284, 268, 31, 151, 50, 17, 52, 155, 37, 276, 5, 91, 245, 178, 179, 248, 96, 12, 285, 48, 168, 67, 34, 69, 172, 54, 4, 22, 108, 262, 195, 196, 265, 113, 29, 13, 65, 185, 84, 51, 86, 189, 71, 21, 39, 125, 279, 212, 213, 282, 130, 46, 30, 82, 202, 101, 68, 103, 206, 88, 38, 56, 142, 7, 229, 230, 10, 147, 63, 47, 99, 219, 118, 85, 120, 223, 105, 55, 73, 159, 24, 246, 247, 27, 164, 80, 64, 116, 236, 135, 102, 137, 240, 122, 72, 90, 176, 41, 263, 264, 44, 181, 97, 81, 133, 253, 152, 119, 154, 257, 139, 89, 107, 193, 58, 280, 281, 61, 198, 114, 98, 150, 270, 169, 136, 171, 274, 156, 106, 124, 210, 75, 8, 9, 78, 215, 131, 115, 167, 287, 186, 153, 188, 2, 173, 123, 141, 227, 92, 25, 26, 95, 232, 148, 132, 184, 15, 203, 170, 205, 19, 190, 140, 158, 244, 109, 42, 43, 112, 249, 165, 149, 201, 32, 220, 187, 222, 36, 207, 157, 175, 261, 126, 59, 60, 129, 266, 182, 166, 218, 49, 237, 204, 239, 53, 224, 174, 192, 278, 143, 76, 77, 146, 283, 199, 183, 235, 66, 254, 221, 256, 70, 241, 191, 209, 6, 160, 93, 94, 163, 11, 216, 200, 252, 83, 271, 238, 273, 87, 258, 208, 226, 23, 177, 110, 111, 180, 28, 233, 217, 269, 100, 288, 255, 1, 104, 275, 225, 243, 40, 194, 127, 128, 197, 45, 250, 234, 286, 117, 16, 272, 18, 121, 3, 242, 260, 57, 211, 144, 145, 214, 62, 267, 251, 14, 134, 33, 0, 35, 138, 20, 259, 277, 74, 228, 161, 162, 231, 79, 284, 268, 31, 151, 50, 17, 52, 155, 37, 276, 5, 91, 245, 178, 179, 248, 96, 12, 285, 48, 168, 67, 34, 69, 172, 54, 4, 22, 108, 262, 195, 196, 265, 113, 29, 13, 65, 185, 84, 51, 86, 189, 71, 21, 39, 125, 279, 212, 213, 282, 130, 46, 30, 82, 202, 101, 68, 103, 206, 88, 38, 56, 142, 7, 229, 230, 10, 147, 63, 47, 99, 219, 118, 85, 120, 223, 105, 55, 73, 159, 24, 246, 247, 27, 164, 80, 64, 116, 236, 135, 102, 137, 240, 122, 72, 90, 176, 41, 263, 264, 44, 181, 97, 81, 133, 253, 152, 119, 154, 257, 139, 89, 107, 193, 58, 280, 281, 61, 198, 114, 98, 150, 270, 169, 136, 171, 274, 156, 106, 124, 210, 75, 8, 9, 78, 215, 131, 115, 167, 287, 186, 153, 188, 2, 173, 123, 141, 227, 92, 25, 26, 95, 232, 148, 132, 184, 15, 203, 170, 205, 19, 190, 140, 158, 244, 109, 42, 43, 112, 249, 165, 149, 201, 32, 220, 187, 222, 36, 207, 157, 175, 261, 126, 59, 60, 129, 266, 182, 166, 218, 49, 237, 204, 239, 53, 224, 174, 192, 278, 143, 76, 77, 146, 283, 199, 183, 235, 66, 254, 221, 256]);
    this.C_0 = 0.1666666716337204;//1.0/6.0;
    this.C_1 = 0.3333333432674408;//1.0/3.0;
    this.mod289_temp0 = 0.0034602077212184668;//1.0 / 289.0;
    this.n_ = 0.142857142857; //1.0/7.0;
    this.ns = new Float32Array([0, 0, 0]);
}

SimplexNoise3D.prototype.snoise = function(inX, inY, inZ) {
    var perm = this.perm,
        C_0 = this.C_0,
        C_1 = this.C_1,
        mod289_temp0 = this.mod289_temp0,
        n_ = this.n_,
        ns = this.ns;
    // GLSL code:
    // const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    // const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    // GLSL code:
    // vec3 i = floor(v + dot(v, C.yyy) );
    // vec3 i = floor(v + (v.x + v.y + v.z) * C_1)
    //var temp_dot0 = inX * C_1 + inY * C_1 + inZ * C_1;
    var temp_dot0 = (inX + inY + inZ) * C_1;

    var i_0 = Math.floor(inX + temp_dot0);
    var i_1 = Math.floor(inY + temp_dot0);
    var i_2 = Math.floor(inZ + temp_dot0);

    // GLSL code:
    // vec3 x0 = v - i + dot(i, C.xxx);
    var temp_dot1 = i_0 * C_0 + i_1 * C_0 + i_2 * C_0;

    var x0_0 = inX - i_0 + temp_dot1;
    var x0_1 = inY - i_1 + temp_dot1;
    var x0_2 = inZ - i_2 + temp_dot1;

    // GLSL code:
    // vec3 g = step(x0.yzx, x0.xyz);
    var g_0 = x0_0 <  x0_1 ? 0.0 : 1.0;
    var g_1 = x0_1 <= x0_2 ? 0.0 : 1.0; // Having '<=' here fixes the pixel artefacts.
    var g_2 = x0_2 <  x0_0 ? 0.0 : 1.0;

    // GLSL code:
    // vec3 l = 1.0 - g;
    var l_0 = 1.0 - g_0;
    var l_1 = 1.0 - g_1;
    var l_2 = 1.0 - g_2;

    // GLSL code:
    // vec3 i1 = min( g.xyz, l.zxy );
    var i1_0 = Math.min(g_0, l_2);
    var i1_1 = Math.min(g_1, l_0);
    var i1_2 = Math.min(g_2, l_1);

    // GLSL code:
    // vec3 i2 = max( g.xyz, l.zxy );
    var i2_0 = Math.max(g_0, l_2);
    var i2_1 = Math.max(g_1, l_0);
    var i2_2 = Math.max(g_2, l_1);

    // GLSL code:
    // vec3 x1 = x0 - i1 + C.xxx;
    var x1_0 = x0_0 - i1_0 + C_0;
    var x1_1 = x0_1 - i1_1 + C_0;
    var x1_2 = x0_2 - i1_2 + C_0;

    // GLSL code:
    // vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    var x2_0 = x0_0 - i2_0 + C_1;
    var x2_1 = x0_1 - i2_1 + C_1;
    var x2_2 = x0_2 - i2_2 + C_1;

    // GLSL code:
    // vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    var x3_0 = x0_0 - 0.5;
    var x3_1 = x0_1 - 0.5;
    var x3_2 = x0_2 - 0.5;

    // Permutations
    // GLSL code:
    // i = mod289(i);
    //mod289_vec3(i); // return x - floor(x * (1.0 / 289.0)) * 289.0;
    i_0 = i_0 - Math.floor(i_0 * (mod289_temp0)) * 289.0;
    i_1 = i_1 - Math.floor(i_1 * (mod289_temp0)) * 289.0;
    i_2 = i_2 - Math.floor(i_2 * (mod289_temp0)) * 289.0;

    // GLSL code:
    // vec4 p = permute( permute( permute(
    //          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
    //        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
    //        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    var p_0 = perm[ (perm[ perm[i_2 + 0.0  ] + i_1 + 0.0  ] + i_0 + 0.0  ) & 511 ];
    var p_1 = perm[ (perm[ perm[i_2 + i1_2 ] + i_1 + i1_1 ] + i_0 + i1_0 ) & 511 ];
    var p_2 = perm[ (perm[ perm[i_2 + i2_2 ] + i_1 + i2_1 ] + i_0 + i2_0 ) & 511 ];
    var p_3 = perm[ (perm[ perm[i_2 + 1.0  ] + i_1 + 1.0  ] + i_0 + 1.0  ) & 511 ];

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
    var j_0 = p_0 - 49.0 * Math.floor(p_0 * ns_z2);
    var j_1 = p_1 - 49.0 * Math.floor(p_1 * ns_z2);
    var j_2 = p_2 - 49.0 * Math.floor(p_2 * ns_z2);
    var j_3 = p_3 - 49.0 * Math.floor(p_3 * ns_z2);

    // GLSL code:
    // vec4 x_ = floor(j * ns.z);
    var x__0 = Math.floor(j_0 * ns[2]);
    var x__1 = Math.floor(j_1 * ns[2]);
    var x__2 = Math.floor(j_2 * ns[2]);
    var x__3 = Math.floor(j_3 * ns[2]);

    // GLSL code:
    // vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    var y__0 = Math.floor(j_0 - 7.0 * x__0);
    var y__1 = Math.floor(j_1 - 7.0 * x__1);
    var y__2 = Math.floor(j_2 - 7.0 * x__2);
    var y__3 = Math.floor(j_3 - 7.0 * x__3);

    // GLSL code:
    // vec4 x = x_ *ns.x + ns.yyyy;
    var x_0 = x__0 * ns[0] + ns[1];
    var x_1 = x__1 * ns[0] + ns[1];
    var x_2 = x__2 * ns[0] + ns[1];
    var x_3 = x__3 * ns[0] + ns[1];

    // GLSL code:
    // vec4 y = y_ *ns.x + ns.yyyy;
    var y_0 = y__0 * ns[0] + ns[1];
    var y_1 = y__1 * ns[0] + ns[1];
    var y_2 = y__2 * ns[0] + ns[1];
    var y_3 = y__3 * ns[0] + ns[1];

    // GLSL code:
    // vec4 h = 1.0 - abs(x) - abs(y);
    var h_0 = 1.0 - Math.abs(x_0) - Math.abs(y_0);
    var h_1 = 1.0 - Math.abs(x_1) - Math.abs(y_1);
    var h_2 = 1.0 - Math.abs(x_2) - Math.abs(y_2);
    var h_3 = 1.0 - Math.abs(x_3) - Math.abs(y_3);

    // GLSL code:
    // vec4 b0 = vec4( x.xy, y.xy );
    // Commented out, not needed, since we can simply use the x and y vectors below.
    //b0[0] = x_0;
    //b0[1] = x_1;
    //b0[2] = y_0;
    //b0[3] = y_1;

    // GLSL code:
    // vec4 b1 = vec4( x.zw, y.zw );
    // Commented out, not needed, since we can simply use the x and y vectors below.
    //b1[0] = x_2;
    //b1[1] = x_3;
    //b1[2] = y_2;
    //b1[3] = y_3;

    // GLSL code:
    // vec4 s0 = floor(b0)*2.0 + 1.0;
    //s0[0] = Math.floor(x_0) * 2.0 + 1.0;
    //s0[1] = Math.floor(x_1) * 2.0 + 1.0;
    //s0[2] = Math.floor(y_0) * 2.0 + 1.0;
    //s0[3] = Math.floor(y_1) * 2.0 + 1.0;

    // GLSL code:
    // vec4 s1 = floor(b1)*2.0 + 1.0;
    //s1[0] = Math.floor(x_2) * 2.0 + 1.0;
    //s1[1] = Math.floor(x_3) * 2.0 + 1.0;
    //s1[2] = Math.floor(y_2) * 2.0 + 1.0;
    //s1[3] = Math.floor(y_3) * 2.0 + 1.0;

    // GLSL code:
    // vec4 sh = -step(h, vec4(0.0));
    var sh_0 = 0.0 < h_0 ? -0.0 : -1.0;
    var sh_1 = 0.0 < h_1 ? -0.0 : -1.0;
    var sh_2 = 0.0 < h_2 ? -0.0 : -1.0;
    var sh_3 = 0.0 < h_3 ? -0.0 : -1.0;

    // GLSL code:
    // vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    var a0_0 = x_0 + (Math.floor(x_0) * 2.0 + 1.0) * sh_0;
    var a0_1 = y_0 + (Math.floor(y_0) * 2.0 + 1.0) * sh_0;
    var a0_2 = x_1 + (Math.floor(x_1) * 2.0 + 1.0) * sh_1;
    var a0_3 = y_1 + (Math.floor(y_1) * 2.0 + 1.0) * sh_1;

    // GLSL code:
    // vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    var a1_0 = x_2 + (Math.floor(x_2) * 2.0 + 1.0) * sh_2;
    var a1_1 = y_2 + (Math.floor(y_2) * 2.0 + 1.0) * sh_2;
    var a1_2 = x_3 + (Math.floor(x_3) * 2.0 + 1.0) * sh_3;
    var a1_3 = y_3 + (Math.floor(y_3) * 2.0 + 1.0) * sh_3;


    // Normalise gradients
    // GLSL code:
    // vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    //norm_0 = a0_0 * a0_0 + a0_1 * a0_1 + h_0 * h_0;//vec3.dot(p0, p0);
    //norm_1 = a0_2 * a0_2 + a0_3 * a0_3 + h_1 * h_1;//vec3.dot(p1, p1);
    //norm_2 = a1_0 * a1_0 + a1_1 * a1_1 + h_2 * h_2;//vec3.dot(p2, p2);
    //norm_3 = a1_2 * a1_2 + a1_3 * a1_3 + h_3 * h_3;//vec3.dot(p3, p3);

    // taylorInvSqrt_vec4(norm);
    // Moving the function to here:

    var norm_0 = 1.79284291400159 - 0.85373472095314 * (a0_0 * a0_0 + a0_1 * a0_1 + h_0 * h_0);//vec3.dot(p0, p0);
    var norm_1 = 1.79284291400159 - 0.85373472095314 * (a0_2 * a0_2 + a0_3 * a0_3 + h_1 * h_1);//vec3.dot(p1, p1);
    var norm_2 = 1.79284291400159 - 0.85373472095314 * (a1_0 * a1_0 + a1_1 * a1_1 + h_2 * h_2);//vec3.dot(p2, p2);
    var norm_3 = 1.79284291400159 - 0.85373472095314 * (a1_2 * a1_2 + a1_3 * a1_3 + h_3 * h_3);

    // GLSL code:
    // p0 *= norm.x;
    // p1 *= norm.y;
    // p2 *= norm.z;
    // p3 *= norm.w;

    // GLSL code:
    // vec3 p0 = vec3(a0.xy,h.x);
    //p0[0] = a0_0 * norm_0;
    //p0[1] = a0_1 * norm_0;
    //p0[2] =  h_0 * norm_0;
    var temp1_0 = a0_0 * norm_0 * x0_0 + a0_1 * norm_0 * x0_1 + h_0 * norm_0 * x0_2;

    // GLSL code:
    // vec3 p1 = vec3(a0.zw,h.y);
    //p1[0] = a0_2 * norm_1;
    //p1[1] = a0_3 * norm_1;
    //p1[2] =  h_1 * norm_1;
    var temp1_1 = a0_2 * norm_1 * x1_0 + a0_3 * norm_1 * x1_1 + h_1 * norm_1 * x1_2;

    // GLSL code:
    // vec3 p2 = vec3(a1.xy,h.z);
    //p2[0] = a1_0 * norm_2;
    //p2[1] = a1_1 * norm_2;
    //p2[2] =  h_2 * norm_2;*
    var temp1_2 = a1_0 * norm_2 * x2_0 + a1_1 * norm_2 * x2_1 + h_2 * norm_2 * x2_2;

    // GLSL code:
    // vec3 p3 = vec3(a1.zw,h.w);
    //p3[0] = a1_2 * norm_3;
    //p3[1] = a1_3 * norm_3;
    //p3[2] =  h_3 * norm_3;
    var temp1_3 = a1_2 * norm_3 * x3_0 + a1_3 * norm_3 * x3_1 + h_3 * norm_3 * x3_2;

    //p0 = vec3.scale(p0, p0, norm_0);
    //p1 = vec3.scale(p1, p1, norm_1);
    //p2 = vec3.scale(p2, p2, norm_2);
    //p3 = vec3.scale(p3, p3, norm_3);

    // Mix final noise value
    // GLSL code:
    // vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    var m_0 = Math.max(0.6 - (x0_0 * x0_0 + x0_1 * x0_1 + x0_2 * x0_2), 0.0);
    var m_1 = Math.max(0.6 - (x1_0 * x1_0 + x1_1 * x1_1 + x1_2 * x1_2), 0.0);
    var m_2 = Math.max(0.6 - (x2_0 * x2_0 + x2_1 * x2_1 + x2_2 * x2_2), 0.0);
    var m_3 = Math.max(0.6 - (x3_0 * x3_0 + x3_1 * x3_1 + x3_2 * x3_2), 0.0);

    // GLSL code:
    // m = m * m * m;
    /*m_0 = m_0 * m_0 * m_0 * m_0;
    m_1 = m_1 * m_1 * m_1 * m_1;
    m_2 = m_2 * m_2 * m_2 * m_2;
    m_3 = m_3 * m_3 * m_3 * m_3;*/

    //var res = m_0 * m_0 * m_0 * m_0 * temp1_0 + m_1 * m_1 * m_1 * m_1 * temp1_1 + m_2 * m_2 * m_2 * m_2 * temp1_2 + m_3 * m_3 * m_3 * m_3 * temp1_3;

    // GLSL code:
    // return 42.0 * dot( m, vec4( dot(p0,x0), dot(p1,x1), 
    //                            dot(p2,x2), dot(p3,x3) ) );
    //temp1_0 = vec3.dot(p0, x0);
    //temp1_1 = vec3.dot(p1, x1);
    //temp1_2 = vec3.dot(p2, x2);
    //temp1_3 = vec3.dot(p3, x3);

    //return 42.0 * vec4.dot(m, temp1);
    return 42.0 * (m_0 * m_0 * m_0 * m_0 * temp1_0 + m_1 * m_1 * m_1 * m_1 * temp1_1 + m_2 * m_2 * m_2 * m_2 * temp1_2 + m_3 * m_3 * m_3 * m_3 * temp1_3);
}