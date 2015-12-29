var C = vec4.fromValues(0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958)  // -1 + 4 * G4

var SimplexNoise_GV1 = 1.0 / 289.0;
var SimplexNoise_GV2 = vec4.fromValues(0.309016994374947451, 0.309016994374947451, 0.309016994374947451, 0.309016994374947451);
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

function taylorInvSqrt_float(r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

function fract_vec3(x) {
    var temp = vec3.create();

    return vec3.sub(temp, x, vec3.floor(temp, x))
}

function fract_float(x) {
    return x - Math.floor(x);
}

function grad4(j) {
    //p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    var temp = vec3.create();
    temp = vec3.mul(temp, vec3.fromValues(j, j, j), vec3.fromValues(ip[0], ip[1], ip[2]));
    temp = fract_vec3(temp);
    temp = vec3.scale(temp, temp, 7.0);
    temp = vec3.floor(temp, temp);
    temp = vec3.mul(temp, temp, vec3.fromValues(ip[2], ip[2], ip[2]));
    temp = vec3.subScalar(temp, temp, 1.0);

    //p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    var temp2 = vec3.create();
    temp2 = vec3.abs(temp2, vec3.fromValues(temp[0], temp[1], temp[2]));
    temp2 = 1.5 - vec3.dot(temp2, ones);

    var p = vec4.fromValues(temp[0], temp[1], temp[2], temp2);

    //s = vec4(lessThan(p, vec4(0.0)));

    var s = vec4.create();
    s = vec4.lessThan(s, p, vec4.fromValues(0, 0, 0, 0));

    //p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    var temp3 = vec3.create();
    temp3 = vec3.scale(temp3, vec3.fromValues(s[0], s[1], s[2]), 2.0);
    temp3 = vec3.sub(temp3, temp3, ones);
    temp3 = vec3.mul(temp3, temp3, vec3.fromValues(s[3], s[3], s[3]));
    temp3 = vec3.add(temp3, vec3.fromValues(p[0], p[1], p[2]), temp3);

    p[0] = temp3[0];
    p[1] = temp3[1];
    p[2] = temp3[2];
    
    return p;
}

function snoise(v) {
    var i = vec4.dot(v, SimplexNoise_GV2);
    var temp = vec4.create();

    i = vec4.floor(temp, vec4.addScalar(temp, v, i));

    var x0 = vec4.create();
    x0 = vec4.sub(x0, v, i);
    x0 = vec4.addScalar(x0, x0, vec4.dot(i, vec4.fromValues(C[0], C[0], C[0], C[0])) );

    var isX = vec3.create();
    var isYZ = vec3.create();
    var i0 = vec4.create();
    isX = vec3.step(isX, vec3.fromValues(x0[1], x0[2], x0[3]), vec3.fromValues(x0[0], x0[0], x0[0]));
    isYZ = vec3.step(isYZ, vec3.fromValues(x0[2], x0[3], x0[3]), vec3.fromValues(x0[1], x0[1], x0[2]));

    i0[0] = isX[0] + isX[1] + isX[2];
    var temp1 = vec3.create();
    temp1 = vec3.sub(temp1, ones, isX);
    i0[1] = temp1[0];
    i0[2] = temp1[1];
    i0[3] = temp1[2];
    i0[1] += isYZ[0] + isYZ[1];
    var temp2 = vec2.create();
    temp2 = vec2.sub(temp2, vec2.fromValues(1.0, 1.0), vec2.fromValues(isYZ[0], isYZ[1]));
    i0[2] += temp2[0];
    i0[3] += temp2[1];
    i0[2] += isYZ[2];
    i0[3] += 1.0 - isYZ[2];

    /*// i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );*/

    var i3 = vec4.create();
    var i2 = vec4.create();
    var i1 = vec4.create();
    i3 = vec4.clamp(i3, i0, 0.0, 1.0);
    i2 = vec4.clamp(i2, vec4.subScalar(i2, i0, 1.0), 0.0, 1.0);
    i1 = vec4.clamp(i1, vec4.subScalar(i1, i0, 2.0), 0.0, 1.0);

    var x1 = vec4.create();
    var x2 = vec4.create();
    var x3 = vec4.create();
    var x4 = vec4.create();

    x1 = vec4.addScalar(x1, vec4.sub(x1, x0, i1), C[0] );
    x2 = vec4.addScalar(x2, vec4.sub(x2, x0, i2), C[1] );
    x3 = vec4.addScalar(x3, vec4.sub(x3, x0, i3), C[2] );
    x4 = vec4.addScalar(x4, x0, C[3] );

    // Permutations
    //i = mod289(i);
    i = mod289_vec4(i);

//.log    console.log(i);

    //float j0 = permute( permute( permute( permute(i.w) + i[2]) + i[1]) + i[0]);
    var j0 = permute_float( permute_float( permute_float( permute_float(i[3]) + i[2]) + i[1]) + i[0]);

  /*  vec4 j1 = permute( permute( permute( permute (
            i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                                         + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                                + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                       + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));*/

  /*  vec4 j1_tmp1 = permute( vec4(i.w, i.w, i.w, i.w) + vec4(i1.w, i2.w, i3.w, 1.0 ) );
    vec4 j1_tmp2 = permute( j1_tmp1 + vec4(i.z, i.z, i.z, i.z) + vec4(i1.z, i2.z, i3.z, 1.0) );
    vec4 j1_tmp3 = permute( j1_tmp2 + vec4(i.y, i.y, i.y, i.y) + vec4(i1.y, i2.y, i3.y, 1.0) );
    vec4 j1 = permute( j1_tmp3 + vec4(i.x, i.x, i.x, i.x) + vec4(i1.x, i2.x, i3.x, 1.0) );*/

    var j1_tmp1 = vec4.create();
    var j1_tmp2 = vec4.create();
    var j1_tmp3 = vec4.create();
    var j1 = vec4.create();

    j1_tmp1 = permute_vec4( vec4.addScalar(j1_tmp1, vec4.fromValues(i1[3], i2[3], i3[3], 1.0 ), i[3]) );
    j1_tmp2 = permute_vec4( vec4.add(j1_tmp2, vec4.addScalar(j1_tmp2, j1_tmp1, i[2]), vec4.fromValues(i1[2], i2[2], i3[2], 1.0) ));
    j1_tmp3 = permute_vec4( vec4.add(j1_tmp3, vec4.addScalar(j1_tmp3, j1_tmp2, i[1]), vec4.fromValues(i1[1], i2[1], i3[1], 1.0) ));
    j1 = permute_vec4( vec4.add(j1, vec4.addScalar(j1, j1_tmp3, i[0]), vec4.fromValues(i1[0], i2[0], i3[0], 1.0) ));

    // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
    /*vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);*/

    
    var p0 = grad4(j0);
    var p1 = grad4(j1[0]);
    var p2 = grad4(j1[1]);
    var p3 = grad4(j1[2]);
    var p4 = grad4(j1[3]);

    // Normalise gradients
   /* vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));*/

    var norm = taylorInvSqrt_vec4(vec4.fromValues(vec4.dot(p0,p0), vec4.dot(p1,p1), vec4.dot(p2, p2), vec4.dot(p3,p3)));

    p0 = vec4.scale(p0, p0, norm[0]);
    p1 = vec4.scale(p1, p1, norm[1]);
    p2 = vec4.scale(p2, p2, norm[2]);
    p3 = vec4.scale(p3, p3, norm[3]);
    p4 = vec4.scale(p4, p4, taylorInvSqrt_float(vec4.dot(p4,p4)) );

    var m0 = vec3.create();
    var m1 = vec2.create();
    m0 = vec3.maxNum(m0, vec3.sub(m0, vec3.fromValues(0.6, 0.6, 0.6), vec3.fromValues(vec4.dot(x0,x0), vec4.dot(x1,x1), vec4.dot(x2,x2)) ), 0.0);
    m1 = vec2.maxNum(m1, vec2.sub(m1, vec2.fromValues(0.6, 0.6), vec2.fromValues(vec4.dot(x3,x3), vec4.dot(x4,x4)) ), 0.0);

    /*m0 = m0 * m0;
    m1 = m1 * m1;*/

    m0 = vec3.mul(m0, m0, m0);
    m1 = vec2.mul(m1, m1, m1);

    return 49.0 * ( vec3.dot(vec3.mul(m0, m0, m0), vec3.fromValues( vec4.dot( p0, x0 ), vec4.dot( p1, x1 ), vec4.dot( p2, x2 )))
                    + vec2.dot(vec2.mul(m1, m1, m1), vec2.fromValues( vec4.dot( p3, x3 ), vec4.dot( p4, x4 ) ) ) ) ;
}
