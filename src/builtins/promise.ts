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
                    const result = invoke(
                        rejectCallback,
                        Utils.createRawArray(
                            [Utils.filterValue(reason)],
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

                const thisPromise = (thisArg as Dict)[PROMISE_SYMBOL]!;

                const nextPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    null,
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
                    const result = invoke(
                        rejectCallback,
                        Utils.createRawArray(
                            [Utils.filterValue(reason)],
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

                const thisPromise = (thisArg as Dict)[PROMISE_SYMBOL]!;

                const nextPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    null,
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

Object.assign(builtinPromise, {

    all: Utils.injectHelp(
        'Promise.all(promises)',
        createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {

                const promises = args[0] as Dict[];
                if (
                    !Array.isArray(promises)
                    || !promises.every((promise) => (
                        Utils.isDict(promise)
                        && isInstanceOf(builtinPromise, promise)
                    ))
                ) {
                    Utils.raise(
                        TypeError,
                        'expect an array of promises',
                        referrer,
                        context,
                    );
                }

                const resultPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    null,
                ) as Dict;

                resultPromise[PROMISE_SYMBOL] = Promise.all(
                    promises.map(
                        (promise) => promise[PROMISE_SYMBOL]!
                    )
                );

                return resultPromise;

            },
        ),
    ),

    any: Utils.injectHelp(
        'Promise.any(promises)',
        createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {

                const promises = args[0] as Dict[];
                if (
                    !Array.isArray(promises)
                    || !promises.every((promise) => (
                        Utils.isDict(promise)
                        && isInstanceOf(builtinPromise, promise)
                    ))
                ) {
                    Utils.raise(
                        TypeError,
                        'expect an array of promises',
                        referrer,
                        context,
                    );
                }

                const resultPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    null,
                ) as Dict;

                resultPromise[PROMISE_SYMBOL] = Promise.any(
                    promises.map(
                        (promise) => promise[PROMISE_SYMBOL]!
                    )
                );

                return resultPromise;

            },
        ),
    ),

    race: Utils.injectHelp(
        'Promise.race(promises)',
        createFunctionHandler(
            1,
            1,
            (args, referrer, context, thisArg) => {

                const promises = args[0] as Dict[];
                if (
                    !Array.isArray(promises)
                    || !promises.every((promise) => (
                        Utils.isDict(promise)
                        && isInstanceOf(builtinPromise, promise)
                    ))
                ) {
                    Utils.raise(
                        TypeError,
                        'expect an array of promises',
                        referrer,
                        context,
                    );
                }

                const resultPromise = invoke(
                    builtinPromise,
                    Utils.createRawArray(
                        [() => null],
                        referrer,
                    ),
                    referrer,
                    context,
                    null,
                ) as Dict;

                resultPromise[PROMISE_SYMBOL] = Promise.race(
                    promises.map(
                        (promise) => promise[PROMISE_SYMBOL]!
                    )
                );

                return resultPromise;

            },
        ),
    ),

});
