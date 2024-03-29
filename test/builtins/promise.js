// @ts-check
const { evalCode, builtins, createFunctionHandler, PROMISE_SYMBOL, Utils } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    const CHECK_TIMEOUT = 100; // ms

    const flags = new Set();

    /**
     * @returns {Partial<import('../..').ScriptContext>}
     */
    const createContextOption = () => ({
        store: Utils.createDict({
            ...builtins,
            addFlag: createFunctionHandler(
                1,
                1,
                (args) => {
                    flags.add(args[0]);
                },
            ),
        }),
    });

    evalCode(
        `
        promise = Promise(@(resolve, reject) {
            resolve('foo');
        });
        promise.then(@(data) {
            if (data !== 'foo') {
                raise(String('wrong data: ', string(data)));
            } (true) {
                addFlag('resolve_1');
            };
        }, @(reason) {
            addFlag('reject_1');
            raise(String('unexpected reason: ', string(reason)));
        });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(flags.has('resolve_1'));
        ctx.assert(!flags.has('reject_1'));
    }, CHECK_TIMEOUT, 'promise_1');
    ctx.expectResolved;

    evalCode(
        `
        promise = Promise(@(resolve, reject) {
            reject('bar');
        });
        promise.then(@(data) {
            addFlag('resolve_2');
            raise(String('unexpected data: ', string(data)));
        }, @(reason) {
            if (reason !== 'bar') {
                raise(String('wrong reason: ', string(reason)));
            } (true) {
                addFlag('reject_2');
            };
        });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(!flags.has('resolve_2'));
        ctx.assert(flags.has('reject_2'));
    }, CHECK_TIMEOUT, 'promise_2');

    evalCode(
        `
        promise = Promise(@(resolve, reject) {
            reject('baz');
        });
        promise.catch(@(reason) {
            if (reason !== 'baz') {
                raise(String('wrong reason: ', string(reason)));
            } (true) {
                addFlag('reject_3');
            };
        });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(flags.has('reject_3'));
    }, CHECK_TIMEOUT, 'promise_3');

    ctx.expectResolved(
        evalCode(`Promise.resolve('data')`)[PROMISE_SYMBOL],
        'promise_4',
        (data) => {
            ctx.assertStrictEqual(data, 'data');
        },
    );

    ctx.expectResolved(
        evalCode(`
            Promise.resolve('foo')
                .then(() => (Promise.resolve('bar')))
        `)[PROMISE_SYMBOL],
        'promise_4.5',
        (data) => {
            ctx.assertStrictEqual(data, 'bar');
        },
    );

    ctx.expectRejected(
        evalCode(`Promise.reject('reason')`)[PROMISE_SYMBOL],
        'promise_5',
        (reason) => {
            ctx.assertStrictEqual(reason, 'reason');
        },
    );

    ctx.expectResolved(
        evalCode(`
            Promise.reject('foo')
                .catch(() => (Promise.resolve('bar')))
        `)[PROMISE_SYMBOL],
        'promise_5.5',
        (data) => {
            ctx.assertStrictEqual(data, 'bar');
        },
    );

    evalCode(
        `
        Promise.reject('baz')
            .catch(@(reason) {
                if (reason !== 'baz') {
                    raise(String('wrong reason: ', string(reason)));
                } (true) {
                    addFlag('reject_6');
                    return('zab');
                };
            })
            .then(@(data) {
                addFlag('resolve_6');
                if (data !== 'zab') {
                    raise(String('wrong data: ', string(data)));
                };
            });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(flags.has('reject_6'));
        ctx.assert(flags.has('resolve_6'));
    }, CHECK_TIMEOUT, 'promise_6');

    evalCode(
        `
        Promise.resolve('blah')
            .catch(@(reason) {
                addFlag('reject_7');
                raise(String('unexpected reason: ', string(reason)));
            })
            .then(@(data) {
                addFlag('resolve_7');
                if (data !== 'blah') {
                    raise(String('wrong data: ', string(data)));
                };
            });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(!flags.has('reject_7'));
        ctx.assert(flags.has('resolve_7'));
    }, CHECK_TIMEOUT, 'promise_7');

    evalCode(
        `
        Promise.reject('a')
            .catch(@(reason) {
                if (reason !== 'a') {
                    raise(String('wrong reason: ', string(reason)));
                } (true) {
                    addFlag('reject_8_1');
                    raise('b')
                };
            })
            .then(@(data) {
                addFlag('resolve_8');
                raise(String('unexpected data: ', string(data)));
            }, @(reason) {
                if (reason:indexOf('Error: b') !== 0) {
                    raise(String('wrong reason: ', string(reason)));
                } (true) {
                    addFlag('reject_8_2');
                };
            });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(!flags.has('resolve_8'));
        ctx.assert(flags.has('reject_8_1'));
        ctx.assert(flags.has('reject_8_2'));
    }, CHECK_TIMEOUT, 'promise_8');

    evalCode(
        `
        Promise.resolve('a')
            .finally(@() {
                if (arguments:sizeOf() > 0) {
                    raise('unexpected arguments');
                } (true) {
                    addFlag('finally_8.25');
                    return('b');
                };
            })
            .then(@(data) {
                addFlag('resolve_8.25');
                if (data !== 'a') {
                    raise(String('wrong data: ', string(data)));
                };
            }, @(reason) {
                addFlag('reject_8.25');
                raise(String('unexpected reason: ', string(reason)));
            });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(flags.has('finally_8.25'));
        ctx.assert(flags.has('resolve_8.25'));
        ctx.assert(!flags.has('reject_8.25'));
    }, CHECK_TIMEOUT, 'promise_8.25');

    evalCode(
        `
        Promise.reject('a')
            .finally(@() {
                if (arguments:sizeOf() > 0) {
                    raise('unexpected arguments');
                } (true) {
                    addFlag('finally_8.5');
                    return('b');
                };
            })
            .then(@(data) {
                addFlag('resolve_8.5');
                raise(String('unexpected data: ', string(data)));
            }, @(reason) {
                addFlag('reject_8.5');
                if (reason !== 'a') {
                    raise(String('wrong reason: ', string(reason)));
                };
            });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(flags.has('finally_8.5'));
        ctx.assert(!flags.has('resolve_8.5'));
        ctx.assert(flags.has('reject_8.5'));
    }, CHECK_TIMEOUT, 'promise_8.5');

    evalCode(
        `
        Promise.resolve('a')
            .finally(@() {
                if (arguments:sizeOf() > 0) {
                    raise('unexpected arguments');
                } (true) {
                    addFlag('finally_8.75');
                    raise('b');
                };
            })
            .then(@(data) {
                addFlag('resolve_8.75');
                raise(String('unexpected data: ', string(data)));
            }, @(reason) {
                addFlag('reject_8.75');
                if (!reason:includes('Error: b')) {
                    raise(String('wrong reason: ', string(reason)));
                };
            });
        `,
        createContextOption(),
    );
    ctx.setTimeout(() => {
        ctx.assert(flags.has('finally_8.75'));
        ctx.assert(!flags.has('resolve_8.75'));
        ctx.assert(flags.has('reject_8.75'));
    }, CHECK_TIMEOUT, 'promise_8.75');

    ctx.expectResolved(
        evalCode(`
            Promise.all([
                Promise.resolve(0),
                Promise.resolve(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_9',
        (data) => {
            ctx.assertDeepEqual(data, [0, 1]);
        },
    );
    ctx.expectRejected(
        evalCode(`
            Promise.all([
                Promise.reject(0),
                Promise.resolve(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_10',
        (reason) => {
            ctx.assertStrictEqual(reason, 0);
        },
    );
    ctx.expectRejected(
        evalCode(`
            Promise.all([
                Promise.resolve(0),
                Promise.reject(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_11',
        (reason) => {
            ctx.assertStrictEqual(reason, 1);
        },
    );
    ctx.expectRejected(
        evalCode(`
            Promise.all([
                Promise.reject(0),
                Promise.reject(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_12',
        (reason) => {
            ctx.assertStrictEqual(reason, 0);
        },
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.all('abc')`]
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.all([0, Promise.resolve(1)])`]
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.all([Promise.resolve(0), 1])`]
    );

    ctx.expectResolved(
        evalCode(`
            Promise.any([
                Promise.resolve(0),
                Promise.resolve(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_13',
        (data) => {
            ctx.assertStrictEqual(data, 0);
        },
    );
    ctx.expectResolved(
        evalCode(`
            Promise.any([
                Promise.reject(0),
                Promise.resolve(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_14',
        (data) => {
            ctx.assertStrictEqual(data, 1);
        },
    );
    ctx.expectResolved(
        evalCode(`
            Promise.any([
                Promise.resolve(0),
                Promise.reject(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_15',
        (data) => {
            ctx.assertStrictEqual(data, 0);
        },
    );
    ctx.expectRejected(
        evalCode(`
            Promise.any([
                Promise.reject(0),
                Promise.reject(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_16',
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.any('abc')`]
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.any([0, Promise.resolve(1)])`]
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.any([Promise.resolve(0), 1])`]
    );

    ctx.expectResolved(
        evalCode(`
            Promise.race([
                Promise.resolve(0),
                Promise.resolve(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_17',
        (data) => {
            ctx.assertStrictEqual(data, 0);
        },
    );
    ctx.expectRejected(
        evalCode(`
            Promise.race([
                Promise.reject(0),
                Promise.resolve(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_18',
        (reason) => {
            ctx.assertStrictEqual(reason, 0);
        },
    );
    ctx.expectResolved(
        evalCode(`
            Promise.race([
                Promise.resolve(0),
                Promise.reject(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_19',
        (data) => {
            ctx.assertStrictEqual(data, 0);
        },
    );
    ctx.expectRejected(
        evalCode(`
            Promise.race([
                Promise.reject(0),
                Promise.reject(1),
            ])
        `)[PROMISE_SYMBOL],
        'promise_20',
        (reason) => {
            ctx.assertStrictEqual(reason, 0);
        },
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.race('abc')`]
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.race([0, Promise.resolve(1)])`]
    );
    ctx.expectThrow(
        TypeError,
        evalCode,
        [`Promise.race([Promise.resolve(0), 1])`]
    );

    const timeoutFlag = evalCode(`
        timeoutFlag = { #resolved -> false };
        Promise.timeout(${(CHECK_TIMEOUT / 2).toFixed()})
            .then(@(data) {
                if (data !== null) {
                    raise(String('unexpected data: ', string(data)));
                } (true) {
                    timeoutFlag.resolved = true;
                };
            })
            .catch(@(reason) {
                raise(String('unexpected reason: ', string(reason)));
            });
        timeoutFlag
    `);
    ctx.assertDeepEqual(timeoutFlag, { resolved: false });
    ctx.setTimeout(() => {
        ctx.assertDeepEqual(timeoutFlag, { resolved: true });
    }, CHECK_TIMEOUT, 'Promise.timeout');

};
