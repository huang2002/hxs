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
                raise('wrong data');
            } (true) {
                addFlag('resolve_1');
            };
        }, @(reason) {
            addFlag('reject_1');
            raise(reason);
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
            raise(data);
        }, @(reason) {
            if (reason !== 'bar') {
                raise('wrong reason');
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
                raise('wrong reason');
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

};
