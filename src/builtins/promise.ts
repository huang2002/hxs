import { ContextValue, Dict, PROMISE_SYMBOL, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { invoke, isInvocable } from '../function/common';
import { createClass, isInstanceOf } from './common';

export const builtinPromise: Dict = Utils.injectHelp(
    'A dict providing APIs of promises.',
    createClass({

        __init: createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {

                const initializer = args[0];
                if (!isInvocable(initializer)) {
                    Utils.raise(
                        TypeError,
                        'expect an invocable as promise initializer',
                        referrer,
                        context,
                    );
                }

                const promise = new Promise<ContextValue>((resolve, reject) => {

                    const _resolve = createFunctionHandler(
                        1,
                        1,
                        (_args, _referrer, _context, _thisArg) => {
                            resolve(_args[0]);
                            return null;
                        }
                    );

                    const _reject = createFunctionHandler(
                        1,
                        1,
                        (_args, _referrer, _context, _thisArg) => {
                            reject(_args[0]);
                            return null;
                        }
                    );

                    invoke(
                        initializer,
                        Utils.createRawArray(
                            [_resolve, _reject],
                            referrer,
                        ),
                        referrer,
                        context,
                        null,
                    );

                });

                (thisArg as Dict)[PROMISE_SYMBOL] = promise;

                return null;

            },
        ),

        then: createFunctionHandler(
            1,
            2,
            (args, referrer, context, thisArg) => {

                const resolveCallback = args[0];
                if (!isInvocable(resolveCallback)) {
                    Utils.raise(
                        TypeError,
                        'expect an invocable as resolve callback',
                        referrer,
                        context,
                    );
                }

                const rejectCallback = args[1];
                if ((args.length > 1) && !isInvocable(rejectCallback)) {
                    Utils.raise(
                        TypeError,
                        'expect an invocable as reject callback',
                        referrer,
                        context,
                    );
                }

                const _resolveCallback = (data: ContextValue) => {
                    const result = invoke(
                        resolveCallback,
                        Utils.createRawArray(
                            [Utils.filterValue(data)],
                            referrer,
                        ),
                        referrer,
                        context,
                        null,
                    );
                    if (
                        Utils.isDict(result)
                        && isInstanceOf(builtinPromise, result)
                    ) {
                        return result[PROMISE_SYMBOL]!;
                    } else {
                        return result;
                    }
                };

                const _rejectCallback = (reason: unknown) => {
                    invoke(
                        rejectCallback,
                        Utils.createRawArray(
                            [Utils.filterValue(reason)],
                            referrer,
                        ),
                        referrer,
                        context,
                        null,
                    );
                };

                const thisPromise = (thisArg as Dict)[PROMISE_SYMBOL]!;

                const nextPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    thisArg,
                ) as Dict;

                nextPromise[PROMISE_SYMBOL] = thisPromise.then(
                    _resolveCallback,
                    _rejectCallback,
                ) as Promise<ContextValue>;

                return nextPromise;

            },
        ),

        catch: createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {

                const rejectCallback = args[0];
                if (!isInvocable(rejectCallback)) {
                    Utils.raise(
                        TypeError,
                        'expect an invocable as reject callback',
                        referrer,
                        context,
                    );
                }

                const _rejectCallback = (reason: unknown) => {
                    invoke(
                        rejectCallback,
                        Utils.createRawArray(
                            [Utils.filterValue(reason)],
                            referrer,
                        ),
                        referrer,
                        context,
                        null,
                    );
                };

                const thisPromise = (thisArg as Dict)[PROMISE_SYMBOL]!;

                const nextPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    thisArg,
                ) as Dict;

                nextPromise[PROMISE_SYMBOL] = thisPromise.catch(
                    _rejectCallback,
                ) as Promise<ContextValue>;

                return nextPromise;

            },
        ),

    },
        null,
        null,
    )
);

Object.assign(builtinPromise, {

    resolve: Utils.injectHelp(
        'Promise.resolve(data)',
        createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {
                const initializer = createFunctionHandler(
                    2,
                    2,
                    (_args, _referrer, _context, _thisArg) => {
                        invoke(
                            _args[0], // resolve
                            Utils.createRawArray(
                                [args[0]],
                                referrer,
                            ),
                            referrer,
                            context,
                            null,
                        );
                        return null;
                    }
                );
                return invoke(
                    builtinPromise,
                    Utils.createRawArray([initializer], referrer),
                    referrer,
                    context,
                    thisArg,
                );
            },
        )
    ),

    reject: Utils.injectHelp(
        'Promise.reject(reason)',
        createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {
                const initializer = createFunctionHandler(
                    2,
                    2,
                    (_args, _referrer, _context, _thisArg) => {
                        invoke(
                            _args[1], // reject
                            Utils.createRawArray(
                                [args[0]],
                                referrer,
                            ),
                            referrer,
                            context,
                            null,
                        );
                        return null;
                    }
                );
                return invoke(
                    builtinPromise,
                    Utils.createRawArray([initializer], referrer),
                    referrer,
                    context,
                    thisArg,
                );
            },
        )
    ),

});
