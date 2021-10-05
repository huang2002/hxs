import { Dict, Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const builtinClass = Utils.injectHelp(
    'class({ description... })',
    createFunctionHandler(1, 1, (args, referrer, context) => {

        const description = args[0] as Dict;
        if (!Utils.isDict(description)) {
            Utils.raise(TypeError, 'expect a dict as class description', referrer, context);
        }

        if (('__init' in description) && !Utils.isInvocable(description.__init)) {
            Utils.raise(TypeError, 'expect an invocable as initializer', referrer, context);
        }

        return (_rawArgs, _referrer, _context, _thisArg) => {
            let object = _thisArg as Dict;
            if (!Utils.isDict(object)) { // no prototype
                if (object !== null) {
                    Utils.raise(TypeError, 'expect only null or dict as this arg for class constructor', referrer, context);
                }
                object = Object.create(null);
            }
            for (const key in description) {
                if (key in object) {
                    continue;
                }
                const value = description[key];
                if (typeof value === 'function') {
                    object[key] = (rawArgs, referrer, context) => (
                        value(rawArgs, referrer, context, object)
                    );
                } else {
                    object[key] = value;
                }
            }
            if (description.__init) {
                Utils.invoke(description.__init, _rawArgs, _referrer, _context, object);
            }
            return object;
        };

    })
);
