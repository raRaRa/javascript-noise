vec2.maxNum = function(out, a, b) {
    out[0] = Math.max(a[0], b);
    out[1] = Math.max(a[1], b);
    return out;
};

/**
 * Floors the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
vec3.floor = function(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
};

/**
 * Subtracts from a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to add
 * @param {Number} b amount to add to the vector
 * @returns {vec3} out
 */
vec3.subScalar = function(out, a, b) {
    out[0] = a[0] - b;
    out[1] = a[1] - b;
    out[2] = a[2] - b;
    return out;
};

vec3.step = function(out, a, b) {
    out[0] = b[0] < a[0] ? 0.0 : 1.0;
    out[1] = b[1] < a[1] ? 0.0 : 1.0;
    out[2] = b[2] < a[2] ? 0.0 : 1.0;
    return out;
};


/**
 * Adds to a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to add
 * @param {Number} b amount to add to the vector
 * @returns {vec3} out
 */
vec3.addScalar = function(out, a, b) {
    out[0] = a[0] + b;
    out[1] = a[1] + b;
    out[2] = a[2] + b;
    return out;
};

/**
 * Returns the absolute value of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to absolute value
 * @returns {vec3} out
 */
vec3.abs = function(out, a) {
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    out[2] = Math.abs(a[2]);
    return out;
};

vec3.clamp = function(out, a, min, max) {
    out[0] = (a[0] < min ? min : (a[0] > max ? max : a[0]) );
    out[1] = (a[1] < min ? min : (a[1] > max ? max : a[1]) );
    out[2] = (a[2] < min ? min : (a[2] > max ? max : a[2]) );
    return out;
};

vec3.maxNum = function(out, a, b) {
    out[0] = Math.max(a[0], b);
    out[1] = Math.max(a[1], b);
    out[2] = Math.max(a[2], b);
    return out;
};

vec4.maxNum = function(out, a, b) {
    out[0] = Math.max(a[0], b);
    out[1] = Math.max(a[1], b);
    out[2] = Math.max(a[2], b);
    out[3] = Math.max(a[3], b);
    return out;
};

vec4.clamp = function(out, a, min, max) {
    out[0] = (a[0] < min ? min : (a[0] > max ? max : a[0]) );
    out[1] = (a[1] < min ? min : (a[1] > max ? max : a[1]) );
    out[2] = (a[2] < min ? min : (a[2] > max ? max : a[2]) );
    out[3] = (a[3] < min ? min : (a[3] > max ? max : a[3]) );
    return out;
};

vec4.step = function(out, a, b) {
    out[0] = b[0] < a[0] ? 0.0 : 1.0;
    out[1] = b[1] < a[1] ? 0.0 : 1.0;
    out[2] = b[2] < a[2] ? 0.0 : 1.0;
    out[3] = b[3] < a[3] ? 0.0 : 1.0;
    return out;
};

vec4.lessThan = function(out, a, b) {
    out[0] = a[0] < b[0] ? 1 : 0;
    out[1] = a[1] < b[1] ? 1 : 0;
    out[2] = a[2] < b[2] ? 1 : 0;
    out[3] = a[3] < b[3] ? 1 : 0;
    return out;
};

/**
 * Subtracts from a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to add
 * @param {Number} b amount to add to the vector
 * @returns {vec4} out
 */
vec4.subScalar = function(out, a, b) {
    out[0] = a[0] - b;
    out[1] = a[1] - b;
    out[2] = a[2] - b;
    out[3] = a[3] - b;
    return out;
};

/**
 * Adds to a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to add
 * @param {Number} b amount to add to the vector
 * @returns {vec4} out
 */
vec4.addScalar = function(out, a, b) {
    out[0] = a[0] + b;
    out[1] = a[1] + b;
    out[2] = a[2] + b;
    out[3] = a[3] + b;
    return out;
};

/**
 * Floors the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
vec4.floor = function(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
};

/**
 * Returns the absolute value of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to absolute value
 * @returns {vec4} out
 */
vec4.abs = function(out, a) {
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    out[2] = Math.abs(a[2]);
    out[3] = Math.abs(a[3]);
    return out;
};