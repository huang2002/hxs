// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            assert = @(a, b) {
                if (a !== b) {
                    raise(String('assertion failed: ', a, ' !== ', b));
                };
            };

            V = Class({
                #__init -> @(value) {
                    this:set(#_v, value);
                },
                #__plus -> (value) => (this._v + value),
                #__minus -> @(value, reverse) {
                    if (reverse) {
                        return(value - this._v);
                    } (true) {
                        return(this._v - value);
                    };
                },
                #__multiply -> (value) => (this._v * value),
                #__divide -> @(value, reverse) {
                    if (reverse) {
                        return(value / this._v);
                    } (true) {
                        return(this._v / value);
                    };
                },
                #__mod -> @(value, reverse) {
                    if (reverse) {
                        return(value % this._v);
                    } (true) {
                        return(this._v % value);
                    };
                },
                #__pow -> @(value, reverse) {
                    if (reverse) {
                        return(value ** this._v);
                    } (true) {
                        return(this._v ** value);
                    };
                },
                #__opposite -> () => (-this._v),
                #__bitAnd -> (value) => (this._v & value),
                #__bitOr -> (value) => (this._v | value),
                #__bitXor -> (value) => (this._v ^ value),
                #__bitNot -> () => (~this._v),
                #__leftShift -> @(value, reverse) {
                    if (reverse) {
                        return(value << this._v);
                    } (true) {
                        return(this._v << value);
                    };
                },
                #__rightShift -> @(value, reverse) {
                    if (reverse) {
                        return(value >> this._v);
                    } (true) {
                        return(this._v >> value);
                    };
                },
                #__unsignedRightShift -> @(value, reverse) {
                    if (reverse) {
                        return(value >>> this._v);
                    } (true) {
                        return(this._v >>> value);
                    };
                },
                #__and -> (value) => (this._v && value),
                #__or -> (value) => (this._v || value),
                #__not -> () => (!this._v),
                #__nullOr -> @(value, reverse) {
                    if (reverse) {
                        return(value ?? this._v);
                    } (true) {
                        return(this._v ?? value);
                    };
                },
                #__gt -> @(value, reverse) {
                    if (reverse) {
                        return(value > this._v);
                    } (true) {
                        return(this._v > value);
                    };
                },
                #__gte -> @(value, reverse) {
                    if (reverse) {
                        return(value >= this._v);
                    } (true) {
                        return(this._v >= value);
                    };
                },
                #__lt -> @(value, reverse) {
                    if (reverse) {
                        return(value < this._v);
                    } (true) {
                        return(this._v < value);
                    };
                },
                #__lte -> @(value, reverse) {
                    if (reverse) {
                        return(value <= this._v);
                    } (true) {
                        return(this._v <= value);
                    };
                },
                #__equal -> (value) => (this._v == value),
                #__notEqual -> (value) => (this._v != value),
            });

            assert(V(1) + 1, 2);
            assert(V(1) + V(1), 2);
            assert(1 + V(1), 2);

            assert(V(1) - 1, 0);
            assert(V(1) - V(1), 0);
            assert(1 - V(1), 0);

            assert(V(2) * 6, 12);
            assert(V(2) * V(6), 12);
            assert(2 * V(6), 12);

            assert(V(6) / 2, 3);
            assert(V(6) / V(2), 3);
            assert(6 / V(2), 3);

            assert(V(2) % 6, 2);
            assert(V(2) % V(6), 2);
            assert(2 % V(6), 2);

            assert(V(2) ** 6, 64);
            assert(V(2) ** V(6), 64);
            assert(2 ** V(6), 64);

            assert(-V(2), -2);

            assert(V(2) & 6, 2);
            assert(V(2) & V(6), 2);
            assert(2 & V(6), 2);

            assert(V(2) | 6, 6);
            assert(V(2) | V(6), 6);
            assert(2 | V(6), 6);

            assert(V(2) ^ 6, 4);
            assert(V(2) ^ V(6), 4);
            assert(2 ^ V(6), 4);

            assert(~V(6), ~6);

            assert(V(2) << 1, 4);
            assert(V(2) << V(1), 4);
            assert(2 << V(1), 4);

            assert(V(2) >> 1, 1);
            assert(V(2) >> V(1), 1);
            assert(2 >> V(1), 1);

            assert(V(-2) >>> 1, -2 >>> 1);
            assert(V(-2) >>> V(1), -2 >>> 1);
            assert(-2 >>> V(1), -2 >>> 1);

            assert(V(true) && true, true);
            assert(V(true) && V(false), false);
            assert(false && V(true), false);

            assert(V(false) || false, false);
            assert(V(true) || V(false), true);
            assert(false || V(true), true);

            assert(!V(true), false);
            assert(!V(false), true);

            assert(V(null) ?? false, false);
            assert(V(false) ?? V(true), false);
            assert(false ?? V(true), false);

            assert(V(2) > 6, false);
            assert(V(2) > V(6), false);
            assert(2 > V(6), false);

            assert(V(2) < 6, true);
            assert(V(2) < V(6), true);
            assert(2 < V(6), true);

            assert(V(2) >= 6, false);
            assert(V(2) >= V(6), false);
            assert(2 >= V(2), true);

            assert(V(2) <= 6, true);
            assert(V(2) <= V(6), true);
            assert(2 <= V(2), true);

            assert(V(2) == 6, false);
            assert(V(2) == V(2), true);
            assert(2 == V(6), false);

            assert(V(2) != 6, true);
            assert(V(2) != V(2), false);
            assert(2 != V(6), true);

            assert(V(2) === 6, false);
            assert(V(2) === V(2), false);
            assert(2 === V(6), false);

            assert(V(2) !== 6, true);
            assert(V(2) !== V(2), true);
            assert(2 !== V(6), true);

            666
        `),
        666
    );

};
