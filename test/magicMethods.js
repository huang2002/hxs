// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            V = Class({
                @__init(value) {
                    this._v = value;
                },
                #__plus -> (value) => (this._v + value),
                @__minus(value, right) {
                    if (right) {
                        return(value - this._v);
                    } (true) {
                        return(this._v - value);
                    };
                },
                #__multiply -> (value) => (this._v * value),
                @__divide(value, right) {
                    if (right) {
                        return(value / this._v);
                    } (true) {
                        return(this._v / value);
                    };
                },
                @__mod(value, right) {
                    if (right) {
                        return(value % this._v);
                    } (true) {
                        return(this._v % value);
                    };
                },
                @__pow(value, right) {
                    if (right) {
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
                @__leftShift(value, right) {
                    if (right) {
                        return(value << this._v);
                    } (true) {
                        return(this._v << value);
                    };
                },
                @__rightShift(value, right) {
                    if (right) {
                        return(value >> this._v);
                    } (true) {
                        return(this._v >> value);
                    };
                },
                @__unsignedRightShift(value, right) {
                    if (right) {
                        return(value >>> this._v);
                    } (true) {
                        return(this._v >>> value);
                    };
                },
                #__and -> (value) => (this._v && value),
                #__or -> (value) => (this._v || value),
                #__not -> () => (!this._v),
                @__nullOr(value, right) {
                    if (right) {
                        return(value ?? this._v);
                    } (true) {
                        return(this._v ?? value);
                    };
                },
                @__gt(value, right) {
                    if (right) {
                        return(value > this._v);
                    } (true) {
                        return(this._v > value);
                    };
                },
                @__gte(value, right) {
                    if (right) {
                        return(value >= this._v);
                    } (true) {
                        return(this._v >= value);
                    };
                },
                @__lt(value, right) {
                    if (right) {
                        return(value < this._v);
                    } (true) {
                        return(this._v < value);
                    };
                },
                @__lte(value, right) {
                    if (right) {
                        return(value <= this._v);
                    } (true) {
                        return(this._v <= value);
                    };
                },
                #__equal -> (value) => (this._v == value),
                #__notEqual -> (value) => (this._v != value),
            });

            assert(V(1) + 1 === 2);
            assert(V(1) + V(1) === 2);
            assert(1 + V(1) === 2);

            assert(V(1) - 1 === 0);
            assert(V(1) - V(1) === 0);
            assert(1 - V(1) === 0);

            assert(V(2) * 6 === 12);
            assert(V(2) * V(6) === 12);
            assert(2 * V(6) === 12);

            assert(V(6) / 2 === 3);
            assert(V(6) / V(2) === 3);
            assert(6 / V(2) === 3);

            assert(V(2) % 6 === 2);
            assert(V(2) % V(6) === 2);
            assert(2 % V(6) === 2);

            assert(V(2) ** 6 === 64);
            assert(V(2) ** V(6) === 64);
            assert(2 ** V(6) === 64);

            assert(-V(2) === -2);

            assert((V(2) & 6) === 2);
            assert((V(2) & V(6)) === 2);
            assert((2 & V(6)) === 2);

            assert((V(2) | 6) === 6);
            assert((V(2) | V(6)) === 6);
            assert((2 | V(6)) === 6);

            assert((V(2) ^ 6) === 4);
            assert((V(2) ^ V(6)) === 4);
            assert((2 ^ V(6)) === 4);

            assert(~V(6) === ~6);

            assert(V(2) << 1 === 4);
            assert(V(2) << V(1) === 4);
            assert(2 << V(1) === 4);

            assert(V(2) >> 1 === 1);
            assert(V(2) >> V(1) === 1);
            assert(2 >> V(1) === 1);

            assert(V(-2) >>> 1 === -2 >>> 1);
            assert(V(-2) >>> V(1) === -2 >>> 1);
            assert(-2 >>> V(1) === -2 >>> 1);

            assert((V(true) && true) === true);
            assert((V(true) && V(false)) === false);
            assert((false && V(true)) === false);

            assert((V(false) || false) === false);
            assert((V(true) || V(false)) === true);
            assert((false || V(true)) === true);

            assert(!V(true) === false);
            assert(!V(false) === true);

            assert((V(null) ?? false) === false);
            assert((V(false) ?? V(true)) === false);
            assert((false ?? V(true)) === false);

            assert((V(2) > 6) === false);
            assert((V(2) > V(6)) === false);
            assert((2 > V(6)) === false);

            assert((V(2) < 6) === true);
            assert((V(2) < V(6)) === true);
            assert((2 < V(6)) === true);

            assert((V(2) >= 6) === false);
            assert((V(2) >= V(6)) === false);
            assert((2 >= V(2)) === true);

            assert((V(2) <= 6) === true);
            assert((V(2) <= V(6)) === true);
            assert((2 <= V(2)) === true);

            assert((V(2) == 6) === false);
            assert((V(2) == V(2)) === true);
            assert((2 == V(6)) === false);

            assert((V(2) != 6) === true);
            assert((V(2) != V(2)) === false);
            assert((2 != V(6)) === true);

            assert((V(2) === 6) === false);
            assert((V(2) === V(2)) === false);
            assert((2 === V(6)) === false);

            assert((V(2) !== 6) === true);
            assert((V(2) !== V(2)) === true);
            assert((2 !== V(6)) === true);

            Map = Class({
                @__init() {
                    this.keys = [];
                    this.values = [];
                },
                #__keys -> () => (this.keys),
                @__has(key) {
                    return(this.keys:includes(key));
                },
                @__remove(key) {
                    index = this.keys:indexOf(key);
                    if (index !== -1) {
                        this.keys:remove(index);
                        this.values:remove(index);
                    };
                },
                @__get(key) {
                    index = this.keys:indexOf(key);
                    if (index === -1) {
                        return(null);
                    } (true) {
                        return(this.values[index]);
                    };
                },
                @__set(key, value) {
                    index = this.keys:indexOf(key);
                    if (index === -1) {
                        this.keys:push(key);
                        this.values:push(value);
                    } (true) {
                        this.values[index] = value;
                    };
                },
            });

            map = Map();
            o = {};

            assert(typeOf(map.keys) === 'array');

            map.a = 0;
            map[#b] = 1;
            map[o] = 6;

            assert(map.a === 0);
            assert(map[#a] === null);
            assert(map.b === null);
            assert(map[#b] === 1);
            assert(map.c === null);
            assert(map[#c] === null);
            assert(map.o === null);
            assert(map[o] === 6);
            assert(map[{}] === null);

            assert(map:has(#a) === true);
            assert(map:has(#c) === false);
            assert(map:keys():sizeOf() === 9);
            assert(keys(map):sizeOf() === 2);

            map[#a] = 2;
            assert(map.a === 0);
            assert(map[#a] === 2);

            a = {
                @__set(key, value) {
                    if (typeOf(key) === 'string') {
                        a:set(key, value);
                    };
                },
            };
            b = Map();
            b[#foo] = 'bar';
            b[a] = b;
            a:assign(b);
            assert(a.foo === 'bar');

            b:unpack([#foo]);
            assert(foo === 'bar');

            666
        `),
        666
    );

};
