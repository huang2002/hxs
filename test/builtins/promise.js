// @ts-check
const { evalCode, builtins, createFunctionHandler, PROMISE_SYMBOL } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    const CHECK_TIMEOUT = 100; // ms

    /**
     * @param {string} label
     * @param {() => void} callback
     */
    const check = (label, callback) => {
        ctx.addPendingLabel(label);
        setTimeout(() => {
            try {
                callback();
            } finally {
                ctx.deletePendingLabel(label);
            }
        }, CHECK_TIMEOUT);
    };

    const flags = new Set();

    /**
     * @returns {Partial<import('../..').ScriptContext>}
     */
    const createContextOption = () => ({
        store: {
            ...builtins,
            addFlag: createFunctionHandler(
                1,
                1,
                (args) => {
                    flags.add(args[0]);
                },
            ),
        },
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
    check('promise_1', () => {
        ctx.assert(flags.has('resolve_1'));
        ctx.assert(!flags.has('reject_1'));
    });
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
    check('promise_2', () => {
        ctx.assert(!flags.has('resolve_2'));
        ctx.assert(flags.has('reject_2'));
    });

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
    check('promise_3', () => {
        ctx.assert(flags.has('reject_3'));
    });

    ctx.expectResolved(
        evalCode(`Promise.resolve('data')`)[PROMISE_SYMBOL],
        'promise_4',
        (data) => {
            ctx.assertStrictEqual(data, 'data');
        },
    );

    ctx.expectRejected(
        evalCode(`Promise.reject('reason')`)[PROMISE_SYMBOL],
        'promise_5',
        (reason) => {
            ctx.assertStrictEqual(reason, 'reason');
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
                };
            })
            .then(@(data) {
                addFlag('resolve_6');
                if (data !== null) {
                    raise(String('wrong data: ', string(data)));
                };
            });
        `,
        createContextOption(),
    );
    check('promise_6', () => {
        ctx.assert(flags.has('reject_6'));
        ctx.assert(flags.has('resolve_6'));
    });

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
    check('promise_7', () => {
        ctx.assert(!flags.has('reject_7'));
        ctx.assert(flags.has('resolve_7'));
    });

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
    check('promise_8', () => {
        ctx.assert(!flags.has('resolve_8'));
        ctx.assert(flags.has('reject_8_1'));
        ctx.assert(flags.has('reject_8_2'));
    });

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

};
