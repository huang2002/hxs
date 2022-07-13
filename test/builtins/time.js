// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    const ACCEPTANCE = 2;
    /**
     * @param {number} a
     * @param {number} b
     */
    const assertApproximate = (a, b) => {
        ctx.assert(
            Math.abs(a - b) <= ACCEPTANCE
        );
    };

    /**
     * @param {string} label
     * @param {number} milliseconds
     * @param {() => void} callback
     */
    const checkTimeout = (label, milliseconds, callback) => {
        ctx.addPendingLabel(label);
        setTimeout(() => {
            try {
                callback();
            } finally {
                ctx.deletePendingLabel(label);
            }
        }, milliseconds);
    };

    assertApproximate(
        evalCode(`Time.now()`),
        Date.now(),
    );

    const flags_1 = evalCode(`
        flags = [];
        cancel_1 = Time.setTimeout(50, @() {
            flags:push(50);
            cancel_2();
        });
        cancel_2 = Time.setTimeout(100, @() {
            flags:push(100);
            cancel_3();
        });
        cancel_3 = Time.setTimeout(150, @() {
            flags:push(150);
            cancel_1();
        });
        flags
    `);
    checkTimeout('timeout_1_25', 25, () => {
        ctx.assertDeepEqual(flags_1, []);
    });
    checkTimeout('timeout_1_75', 75, () => {
        ctx.assertDeepEqual(flags_1, [50]);
    });
    checkTimeout('timeout_1_125', 125, () => {
        ctx.assertDeepEqual(flags_1, [50]);
    });
    checkTimeout('timeout_1_175', 175, () => {
        ctx.assertDeepEqual(flags_1, [50, 150]);
    });

    const flags_2 = evalCode(`
        flags = [];
        count = 0;
        cancelInterval = Time.setInterval(50, @() {
            flags:push(count);
            count += 1;
            forward([#count]);
            if (count >= 3) {
                cancelInterval();
            };
        });
        flags
    `);
    checkTimeout('interval', 200, () => {
        ctx.assertDeepEqual(flags_2, [0, 1, 2]);
    });

};
