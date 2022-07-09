import { ContextValue, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { invoke, isInvocable } from '../function/common';

export const builtinPromise = Utils.injectHelp(
    'A dict providing APIs of promises.',
    Utils.createDict({

        __invoke: Utils.injectHelp(
            'Promise.__invoke(initializer)',
            createFunctionHandler(
                1,
                1,
                (args) => (
                    args.slice()
                )
            )
        ),

    })
);
