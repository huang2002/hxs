import { FunctionHandler, Utils } from '../common';
import { evalExpression } from "../eval/evalExpression";
import { createFunctionHandler } from "../function/createFunctionHandler";
import { invoke, isInvocable } from '../function/common';

export const builtinWhile: FunctionHandler = Utils.injectHelp(
    'while (condition) { ... }',
    (rawArgs, referrer, context) => (

        createFunctionHandler(1, 1, (_args, _referrer, _context) => {

            const callback = _args[0];
            if (!isInvocable(callback)) {
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

                    while (true) {

                        const condition = evalExpression(rawArgs, context);
                        if (typeof condition !== 'boolean') {
                            Utils.raise(TypeError, 'expect a boolean as condition', referrer, context);
                        }

                        if (!condition) {
                            break;
                        }

                        try {
                            invoke(callback, [], referrer, _context, null);
                        } catch (error) {
                            if (error === BREAK_FLAG) {
                                break;
                            } else if (error !== CONTINUE_FLAG) {
                                throw error;
                            }
                        }

                    }

                }
            );

            return null;

        })

    )
);
