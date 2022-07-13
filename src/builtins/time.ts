import { Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';
import { invoke, isInvocable } from '../function/common';

export const builtinTime = Utils.injectHelp(
    'A dict providing time related APIs.',
    Utils.createDict({

        now: Utils.injectHelp(
            `Time.now()`,
            createFunctionHandler(
                0,
                0,
                (args, referrer, context, thisArg) => {
                    return Date.now();
                },
            )
        ),

        setTimeout: Utils.injectHelp(
            `Time.setTimeout(milliseconds, callback)`,
            createFunctionHandler(
                2,
                2,
                (args, referrer, context, thisArg) => {

                    const milliseconds = args[0] as number;
                    if (typeof milliseconds !== 'number') {
                        Utils.raise(
                            TypeError,
                            'expect a number as timeout',
                            referrer,
                            context,
                        );
                    }

                    const callback = args[1];
                    if (!isInvocable(callback)) {
                        Utils.raise(
                            TypeError,
                            'expect an invocable as callback',
                            referrer,
                            context,
                        );
                    }

                    const _callback = () => {
                        invoke(
                            callback,
                            [],
                            referrer,
                            context,
                            null,
                        );
                    };

                    const timeoutHandle = setTimeout(_callback, milliseconds);

                    const cancelCallback = createFunctionHandler(
                        0,
                        0,
                        (_args, _referrer, _context, _thisArg) => {
                            clearTimeout(timeoutHandle);
                            return null;
                        },
                    );
                    return cancelCallback;

                },
            ),
        ),

        setInterval: Utils.injectHelp(
            `Time.setInterval(milliseconds, callback)`,
            createFunctionHandler(
                2,
                2,
                (args, referrer, context, thisArg) => {

                    const milliseconds = args[0] as number;
                    if (typeof milliseconds !== 'number') {
                        Utils.raise(
                            TypeError,
                            'expect a number as timeout',
                            referrer,
                            context,
                        );
                    }

                    const callback = args[1];
                    if (!isInvocable(callback)) {
                        Utils.raise(
                            TypeError,
                            'expect an invocable as callback',
                            referrer,
                            context,
                        );
                    }

                    const _callback = () => {
                        invoke(
                            callback,
                            [],
                            referrer,
                            context,
                            null,
                        );
                    };

                    const timeoutHandle = setInterval(_callback, milliseconds);

                    const cancelCallback = createFunctionHandler(
                        0,
                        0,
                        (_args, _referrer, _context, _thisArg) => {
                            clearInterval(timeoutHandle);
                            return null;
                        },
                    );
                    return cancelCallback;

                },
            ),
        ),

    }),
);
