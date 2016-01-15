var C_vec2 = vec2.fromValues(1.0/6.0, 1.0/3.0);
var D_vec4 = vec4.fromValues(0.0, 0.5, 1.0, 2.0);

var SimplexNoise_GV1 = 1.0 / 289.0;
var ip = vec4.fromValues(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);
var ones = vec3.fromValues(1.0, 1.0, 1.0);
var lhs = vec4.fromValues(1.79284291400159, 1.79284291400159, 1.79284291400159, 1.79284291400159);
/*vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}*/

function mod289_vec4(x) {
    var temp = vec4.create();
    temp = vec4.scale(temp, x, SimplexNoise_GV1);
    temp = vec4.floor(temp, temp);
    temp = vec4.mul(temp, temp, vec4.fromValues(289.0, 289.0, 289.0, 289.0 ));
    temp = vec4.sub(temp, x, temp);

    return temp;
}

function mod289_vec3(x) {
    var temp = vec3.create();
    temp = vec3.scale(temp, x, SimplexNoise_GV1);
    temp = vec3.floor(temp, temp);
    temp = vec3.mul(temp, temp, vec3.fromValues(289.0, 289.0, 289.0 ));
    temp = vec3.sub(temp, x, temp);

    return temp;
}

/*
float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}*/

function mod289_float(x) {
    return x - Math.floor(x * (1.0 / 289.0)) * 289.0;
}

/*
vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}*/

function permute_vec4(x) {
    var temp = vec4.create();
    temp = vec4.scale(temp, x, 34.0);
    temp = vec4.addScalar(temp, temp, 1.0);
    temp = vec4.mul(temp, temp, x);

    return mod289_vec4(temp);
}

/*
float permute(float x) {
    return mod289(((x*34.0)+1.0)*x);
}
*/

function permute_float(x) {
    return mod289_float( ((x*34.0)+1.0)*x );
}

/*
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}*/

function taylorInvSqrt_vec4(r) {
    var temp = vec4.create();
    temp = vec4.scale(temp, r, 0.85373472095314);
    temp = vec4.sub(temp, lhs, temp);

    return temp;
}

function fract_float(x) {
    return x - Math.floor(x);
}

function snoise_vec3(v) {

    // First corner
    // vec3 i = floor(v + dot(v, C.yyy) );
    // vec3 x0 = v - i + dot(i, C.xxx) ;

    var i = vec3.dot(v, vec3.fromValues(C_vec2[1], C_vec2[1], C_vec2[1]));
    var temp = vec3.create();
    i = vec3.floor(temp, vec3.addScalar(temp, v, i));

    var x0 = vec3.create();
    x0 = vec3.sub(x0, v, i);
    x0 = vec3.addScalar(x0, x0, vec3.dot(i, vec3.fromValues(C_vec2[0], C_vec2[0], C_vec2[0])) );

    // vec3 g = step(x0.yzx, x0.xyz);
    var g = vec3.create();
    g = vec3.step(g, vec3.fromValues(x0[1], x0[2], x0[0]), vec3.fromValues(x0[0], x0[1], x0[2]));

    // vec3 l = 1.0 - g;
    var l = vec3.create();
    l = vec3.sub(l, vec3.fromValues(1.0, 1.0, 1.0), g);

    // vec3 i1 = min( g.xyz, l.zxy );
    var i1 = vec3.create();
    i1 = vec3.min(i1, vec3.fromValues( g[0], g[1], g[2] ), vec3.fromValues( l[2], l[0], l[1] ) );

    // vec3 i2 = max( g.xyz, l.zxy );
    var i2 = vec3.create();
    i2 = vec3.max(i2, vec3.fromValues(g[0], g[1], g[2]), vec3.fromValues(l[2], l[0], l[1]));

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    
    // vec3 x1 = x0 - i1 + C.xxx;
    var x1 = vec3.create();
    x1 = vec3.sub(x1, x0, i1);
    x1 = vec3.add(x1, x1, vec3.fromValues( C_vec2[0], C_vec2[0], C_vec2[0] ));

    // vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    var x2 = vec3.create();
    x2 = vec3.sub(x2, x0, i2);
    x2 = vec3.add(x2, x2, vec3.fromValues(C_vec2[1], C_vec2[1], C_vec2[1]));

    // vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    var x3 = vec3.create();
    x3 = vec3.sub(x3, x0, vec3.fromValues(D_vec4[1], D_vec4[1], D_vec4[1]));

    // Permutations
    // i = mod289(i);
    i = mod289_vec3(i);

    // vec4 p = permute( permute( permute(
    //          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
    //        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
    //        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    var temp1 = vec4.create();
    temp1 = vec4.addScalar(temp1, vec4.fromValues(0.0, i1[2], i2[2], 1.0), i[2]);

    var temp2 = vec4.create();
    temp2 = vec4.addScalar(temp2, vec4.fromValues(0.0, i1[1], i2[1], 1.0), i[1]);

    var temp3 = vec4.create();
    temp3 = vec4.addScalar(temp3, vec4.fromValues(0.0, i1[0], i2[0], 1.0), i[0]);

    var p = vec4.create();
    p = vec4.add(p, temp1, temp2);
    p = vec4.add(p, temp2, temp3);

    p = permute_vec4( permute_vec4( permute_vec4( p ) ) );
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    // float n_ = 0.142857142857; // 1.0/7.0
    // vec3  ns = n_ * D.wyz - D.xzx;
    var n_ = 0.142857142857; // 1.0/7.0
    var ns = vec3.fromValues(n_ * D_vec4[3], n_ * D_vec4[1], n_ * D_vec4[2]);
    ns = vec3.sub(ns, ns, vec3.fromValues( D_vec4[0], D_vec4[2], D_vec4[0] ));

    // vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    var ns_z2 = ns[2] * ns[2];

    var j = vec4.create();
    j = vec4.floor(j, vec4.fromValues(p[0] * ns_z2, p[1] * ns_z2, p[2] * ns_z2, p[3] * ns_z2))
    j = vec4.scale(j, j, 49.0);
    j = vec4.sub(j, p, j);


    // vec4 x_ = floor(j * ns.z);
    var x_ = vec4.create();
    x_ = vec4.scale(x_, j, ns[2]);
    x_ = vec4.floor(x_, x_);

    // vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    var y_ = vec4.create();
    y_ = vec4.scale(y_, x_, 7.0);
    y_ = vec4.sub(y_, j, y_);
    y_ = vec4.floor(y_, y_);

    // vec4 x = x_ *ns.x + ns.yyyy;
    var x = vec4.create();
    x = vec4.scale(x, x_, ns[0]);
    x = vec4.add(x, x, vec4.fromValues(ns[1], ns[1], ns[1], ns[1]));

    // vec4 y = y_ *ns.x + ns.yyyy;
    var y = vec4.create();
    y = vec4.scale(y, y_, ns[0]);
    y = vec4.add(y, y, vec4.fromValues(ns[1], ns[1], ns[1], ns[1]));

    // vec4 h = 1.0 - abs(x) - abs(y);
    var h = vec4.create();
    var temp4 = vec4.create();
    var temp5 = vec4.create();

    temp4 = vec4.abs(temp4, x);
    temp5 = vec4.abs(temp5, y);

    h = vec4.sub(h, temp4, temp5);
    h = vec4.sub(h, vec4.fromValues(1.0, 1.0, 1.0, 1.0), h);

    // vec4 b0 = vec4( x.xy, y.xy );
    var b0 = vec4.fromValues(x[0], x[1], y[0], y[1]);

    // vec4 b1 = vec4( x.zw, y.zw );
    var b1 = vec4.fromValues(x[2], x[3], y[2], y[3]);

    // vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    var s0 = vec4.create();
    s0 = vec4.lessThan(s0, b0, vec4.fromValues(0.0, 0.0, 0.0, 0.0));
    s0 = vec4.scale(s0, s0, 2.0);
    s0 = vec4.sub(s0, s0, vec4.fromValues(1.0, 1.0, 1.0, 1.0));

    // vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    var s1 = vec4.create();
    s1 = vec4.lessThan(s1, b1, vec4.fromValues(0.0, 0.0, 0.0, 0.0));
    s1 = vec4.scale(s1, s1, 2.0);
    s1 = vec4.sub(s1, s1, vec4.fromValues(1.0, 1.0, 1.0, 1.0));

    // vec4 s0 = floor(b0)*2.0 + 1.0;
    var s0 = vec4.create();
    s0 = vec4.floor(s0, b0);
    s0 = vec4.scale(s0, s0, 2.0);
    s0 = vec4.addScalar(s0, s0, 1.0);

    // vec4 s1 = floor(b1)*2.0 + 1.0;
    var s1 = vec4.create();
    s1 = vec4.floor(s1, b1);
    s1 = vec4.scale(s1, s1, 2.0);
    s1 = vec4.addScalar(s1, s1, 1.0);

    // vec4 sh = -step(h, vec4(0.0));
    var sh = vec4.create();
    sh = vec4.step(sh, h, vec4.fromValues(0.0, 0.0, 0.0, 0.0));
    sh = vec4.scale(sh, sh, -1.0);

    // vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    var a0 = vec4.create();
    a0 = vec4.mul(a0, vec4.fromValues(s0[0], s0[2], s0[1], s0[3]), vec4.fromValues(sh[0], sh[0], sh[1], sh[1]));
    a0 = vec4.add(a0, vec4.fromValues(b0[0], b0[2], b0[1], b0[3]), a0);

    // vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    var a1 = vec4.create();
    a1 = vec4.mul(a1, vec4.fromValues(s1[0], s1[2], s1[1], s1[3]), vec4.fromValues(sh[2], sh[2], sh[3], sh[3]));
    a1 = vec4.add(a1, vec4.fromValues(b1[0], b1[2], b1[1], b1[3]), a1);

    // vec3 p0 = vec3(a0.xy,h.x);
    var p0 = vec3.fromValues(a0[0], a0[1], h[0]);

    // vec3 p1 = vec3(a0.zw,h.y);
    var p1 = vec3.fromValues(a0[2], a0[3], h[1]);

    // vec3 p2 = vec3(a1.xy,h.z);
    var p2 = vec3.fromValues(a1[0], a1[1], h[2]);

    // vec3 p3 = vec3(a1.zw,h.w);
    var p3 = vec3.fromValues(a1[2], a1[3], h[3]);

    //Normalise gradients
    // vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    var norm = vec4.create();

    norm = taylorInvSqrt_vec4(vec4.fromValues(vec3.dot(p0,p0), vec3.dot(p1,p1), vec3.dot(p2, p2), vec3.dot(p3,p3)));

    // p0 *= norm.x;
    // p1 *= norm.y;
    // p2 *= norm.z;
    // p3 *= norm.w;
    p0 = vec3.scale(p0, p0, norm[0]);
    p1 = vec3.scale(p1, p1, norm[1]);
    p2 = vec3.scale(p2, p2, norm[2]);
    p3 = vec3.scale(p3, p3, norm[3]);

    // Mix final noise value
    // vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    var m = vec4.create();
    m = vec4.fromValues(vec3.dot(x0,x0), vec3.dot(x1,x1), vec3.dot(x2,x2), vec3.dot(x3,x3));
    m = vec4.sub(m, vec4.fromValues(0.6, 0.6, 0.6, 0.6), m);
    m = vec4.maxNum(m, m, 0.0);

    // m = m * m;
    m = vec4.mul(m, m, m);

    var temp5 = vec4.fromValues(vec3.dot(p0,x0), vec3.dot(p1,x1), vec3.dot(p2, x2), vec3.dot(p3,x3));
    var temp6 = vec4.create();
    temp6 = vec4.mul(temp6, m, m);

    // return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
    //                            dot(p2,x2), dot(p3,x3) ) );
    return 42.0 * vec4.dot(temp6, temp5);
}