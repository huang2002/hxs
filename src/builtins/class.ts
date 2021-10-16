import { BASE_SYMBOL, ContextValue, Dict, FunctionHandler, Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const builtinClass = Utils.injectHelp(
    'A dict providing class APIs.',
    Utils.createDict({

        __invoke: Utils.injectHelp(
            'Class.__invoke(description)',
            createFunctionHandler(1, 1, (args, referrer, context) => {

                const description = args[0] as Dict;
                if (!Utils.isDict(description)) {
                    Utils.raise(TypeError, 'expect a dict as class description', referrer, context);
                }

                if (('__init' in description) && !Utils.isInvocable(description.__init)) {
                    Utils.raise(TypeError, 'expect an invocable as initializer', referrer, context);
                }

                return Utils.createClass(description, referrer, context);

            })
        ),

        extend: Utils.injectHelp(
            'Class.extend(baseClass, baseArgs = [])(description)',
            createFunctionHandler(1, 2, (args, referrer, context) => {

                const baseClass = args[0] as Dict;
                if (!Utils.isInvocable(baseClass)) {
                    Utils.raise(TypeError, 'expect an invocable as base class', referrer, context);
                }

                const baseArgs = args.length > 1 ? args[1] as ContextValue[] : [];
                if (!Array.isArray(baseArgs)) {
                    Utils.raise(TypeError, 'expect an array as base args', referrer, context);
                }

                return createFunctionHandler(1, 1, (_args, _referrer, _context) => {

                    const description = _args[0] as Dict;
                    if (!Utils.isDict(description)) {
                        Utils.raise(TypeError, 'expect a dict as class description', referrer, context);
                    }

                    if (('__init' in description) && !Utils.isInvocable(description.__init)) {
                        Utils.raise(TypeError, 'expect an invocable as initializer', referrer, context);
                    }

                    if ('__init' in description) {

                        const oldInit = description.__init as FunctionHandler;
                        const newInit: FunctionHandler = (rawArgs, ref, ctx, thisArg) => {
                            Utils.invoke(
                                baseClass,
                                Utils.createRawArray(baseArgs, ref),
                                referrer,
                                context,
                                thisArg,
                            );
                            return Utils.invoke(oldInit, rawArgs, ref, ctx, thisArg);
                        };

                        description.__init = newInit;

                    } else {

                        const init: FunctionHandler = (rawArgs, ref, ctx, thisArg) => {
                            Utils.invoke(
                                baseClass,
                                Utils.createRawArray(baseArgs, ref),
                                referrer,
                                context,
                                thisArg,
                            );
                            return null;
                        };

                        description.__init = init;

                    }

                    const constructor = Utils.createClass(description, _referrer, _context);
                    constructor[BASE_SYMBOL] = baseClass;

                    return constructor;

                });

            })
        ),

        getConstructorOf: Utils.injectHelp(
            'Class.getConstructorOf(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, 'expect a dict', referrer, context);
                }
                return Utils.getConstructorOf(dict);
            })
        ),

        isInstanceOf: Utils.injectHelp(
            'Class.isInstanceOf(class, dict)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const dict = args[1] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, 'expect a dict to check', referrer, context);
                }
                return Utils.isInstanceOf(args[0], dict);
            })
        ),

    })
);
