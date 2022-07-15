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
    ctx.setTimeout(() => {
        ctx.assertDeepEqual(flags_1, []);
    }, 25, 'timeout_1_25');
    ctx.setTimeout(() => {
        ctx.assertDeepEqual(flags_1, [50]);
    }, 75, 'timeout_1_75');
    ctx.setTimeout(() => {
        ctx.assertDeepEqual(flags_1, [50]);
    }, 125, 'timeout_1_125');
    ctx.setTimeout(() => {
        ctx.assertDeepEqual(flags_1, [50, 150]);
    }, 175, 'timeout_1_175');

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
    ctx.setTimeout(() => {
        ctx.assertDeepEqual(flags_2, [0, 1, 2]);
    }, 200, 'interval');

};
