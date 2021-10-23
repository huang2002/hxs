import { ContextValue, Dict, ScriptContext, SyntaxNode, Utils } from '../common';
import { invoke } from '../function/common';

export const HELP_SYMBOL = Symbol('hxs-help-symbol');
export const CONSTRUCTOR_SYMBOL = Symbol('hxs-constructor-symbol');
export const BASE_SYMBOL = Symbol('hxs-base-symbol');

export const createClass = (
    description: Dict,
    referrer: SyntaxNode,
    context: ScriptContext,
) => {

    const constructor: Dict = Utils.createDict({

        __invoke(_rawArgs, _referrer, _context, _thisArg) {

            let object = _thisArg as Dict;
            if (!Utils.isDict(object)) { // no prototype
                if (object !== null) {
                    Utils.raise(TypeError, 'expect only null or dict as this arg for class constructor', referrer, context);
                }
                object = Object.create(null);
                object[CONSTRUCTOR_SYMBOL] = constructor;
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
                invoke(description.__init, _rawArgs, _referrer, _context, object);
            }

            return object;

        },

    });

    return constructor;

};

export const getConstructorOf = (dict: Dict): ContextValue => (
    (CONSTRUCTOR_SYMBOL in dict)
        ? dict[CONSTRUCTOR_SYMBOL]!
        : null
);

export const isInstanceOf = (constructor: ContextValue, dict: Dict) => {
    let dictConstructor = getConstructorOf(dict);
    if (constructor === dictConstructor) {
        return true;
    }
    while (dictConstructor) {
        if (Utils.isDict(dictConstructor) && (BASE_SYMBOL in dictConstructor)) {
            dictConstructor = dictConstructor[BASE_SYMBOL]!;
            if (constructor === dictConstructor) {
                return true;
            }
        } else {
            break;
        }
    }
    return false;
};
