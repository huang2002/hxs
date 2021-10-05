import { FunctionHandler, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinFor: FunctionHandler = Utils.injectHelp(
    'for (iteratorName, begin, end, step?) { ... }',
    createFunctionHandler(3, 4, (args, referrer, context) => {

        const iteratorName = args[0] as string;
        if (typeof iteratorName !== 'string') {
            Utils.raise(TypeError, 'expect a string as iterator name', referrer, context);
        }

        const begin = args[1] as number;
        if (!Number.isFinite(begin)) {
            Utils.raise(TypeError, 'expect a finite number as begin value', referrer, context);
        }

        const end = args[2] as number;
        if (!Number.isFinite(end)) {
            Utils.raise(TypeError, 'expect a finite number as end value', referrer, context);
        }

        const defaultStep = begin <= end ? 1 : -1;
        const step = args.length === 4
            ? args[3] as number
            : defaultStep;
        if (!Number.isFinite(step)) {
            Utils.raise(TypeError, 'expect a finite number as step', referrer, context);
        }
        if (
            begin !== end
            && Math.sign(defaultStep) !== Math.sign(step)
        ) {
            Utils.raise(RangeError, 'invalid step', referrer, context);
        }

        return createFunctionHandler(1, 1, (_args, _referrer, _context) => {

            const callback = _args[0];
            if (!Utils.isInvocable(callback)) {
                Utils.raise(TypeError, 'expect an invocable as callback', _referrer, _context);
            }

            const BREAK_FLAG = Symbol('hxs-break-flag');
            const CONTINUE_FLAG = Symbol('hxs-break-flag');

            Utils.injectTemp(
                _context.store,
                {
                    break: createFunctionHandler(0, 0, () => {
                        throw BREAK_FLAG;
                    }),
                    continue: createFunctionHandler(0, 0, () => {
                        throw CONTINUE_FLAG;
                    }),
                },
                () => {
                    if (step > 0) {
                        for (let iterator = begin; iterator < end; iterator += step) {
                            try {
                                _context.store[iteratorName] = iterator;
                                Utils.invoke(callback, [], referrer, _context, null);
                            } catch (error) {
                                if (error === BREAK_FLAG) {
                                    break;
                                } else if (error !== CONTINUE_FLAG) {
                                    throw error;
                                }
                            }
                        }
                    } else {
                        for (let iterator = begin; iterator > end; iterator += step) {
                            try {
                                _context.store[iteratorName] = iterator;
                                Utils.invoke(callback, [], referrer, _context, null);
                            } catch (error) {
                                if (error === BREAK_FLAG) {
                                    break;
                                } else if (error !== CONTINUE_FLAG) {
                                    throw error;
                                }
                            }
                        }
                    }
                },
            );

            return null;

        });

    })
);
