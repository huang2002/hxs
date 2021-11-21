import { BASE_SYMBOL, CONSTRUCTOR_SYMBOL, ContextValue, Dict, ScriptContext, SyntaxNode, Utils } from '../common';
import { invoke, isInvocable } from '../function/common';

export const getKeysOf = (
    dict: Dict,
    referrer: SyntaxNode,
    context: ScriptContext,
) => {
    const keys = isInvocable(dict.__keys)
        ? invoke(dict.__keys, [], referrer, context, null) as ContextValue[]
        : Object.keys(dict);
    if (!Array.isArray(keys)) {
        Utils.raise(TypeError, '`__keys` should return an array', referrer, context);
    }
    return keys;
};

export const hasProperty = (
    dict: Dict,
    key: ContextValue,
    keyReferrer: SyntaxNode,
    operationReferrer: SyntaxNode,
    context: ScriptContext,
): ContextValue => {
    if (isInvocable(dict.__has)) {
        return invoke(
            dict.__has,
            [Utils.createValueNode(key, keyReferrer)],
            operationReferrer,
            context,
            null,
        );
    } else {
        if (typeof key !== 'string') {
            Utils.raise(TypeError, 'expect a string as key', keyReferrer, context);
        }
        const keys = getKeysOf(dict, operationReferrer, context);
        return keys.includes(key as string);
    }
};

export const removeProperty = (
    target: ContextValue,
    key: ContextValue,
    keyReferrer: SyntaxNode,
    operationReferrer: SyntaxNode,
    context: ScriptContext,
): void => {

    if (Array.isArray(target)) {

        if (typeof key !== 'number') {
            Utils.raise(TypeError, 'expect a number as index', keyReferrer, context);
        }

        const normalizedIndex = Utils.normalizeIndex(
            key as number,
            target.length,
            keyReferrer,
            context,
        );
        Utils.removeElements(target, normalizedIndex, 1);

    } else if (Utils.isDict(target)) {

        if (isInvocable(target.__remove)) {
            invoke(
                target.__remove,
                [Utils.createValueNode(key, keyReferrer)],
                operationReferrer,
                context,
                null,
            );
        } else {
            if (typeof key !== 'string') {
                Utils.raise(TypeError, 'expect a string as key', keyReferrer, context);
            }
            if ((key as string) in target) { // Don't use `hasProperty` here!
                delete target[key as string];
            }
        }

    } else {
        Utils.raise(TypeError, 'invalid property removal', operationReferrer, context);
    }

};

export const getProperty = (
    target: ContextValue,
    key: ContextValue,
    keyReferrer: SyntaxNode,
    operationReferrer: SyntaxNode,
    context: ScriptContext,
): ContextValue => {

    if (Array.isArray(target) || typeof target === 'string') {

        if (typeof key !== 'number') {
            Utils.raise(TypeError, 'expect a number as index', keyReferrer, context);
        }

        const normalizedIndex = Utils.normalizeIndex(
            key as number,
            target.length,
            keyReferrer,
            context,
        );
        return target[normalizedIndex];

    } else if (Utils.isDict(target)) {

        if (isInvocable(target.__get)) {
            return invoke(
                target.__get,
                [Utils.createValueNode(key, keyReferrer)],
                operationReferrer,
                context,
                null,
            );
        } else {
            if (typeof key !== 'string') {
                Utils.raise(TypeError, 'expect a string as key', keyReferrer, context);
            }
            if ((key as string) in target) { // Don't use `hasProperty` here!
                return target[key as string];
            } else {
                return null;
            }
        }

    } else {
        Utils.raise(TypeError, 'invalid property access', operationReferrer, context);
        return null; // for type checking
    }

};

export const setProperty = (
    target: ContextValue,
    key: ContextValue,
    value: ContextValue,
    keyReferrer: SyntaxNode,
    operationReferrer: SyntaxNode,
    context: ScriptContext,
): void => {

    if (Array.isArray(target)) {

        if (typeof key !== 'number') {
            Utils.raise(TypeError, 'expect a number as index', keyReferrer, context);
        }

        const normalizedIndex = Utils.normalizeIndex(
            key as number,
            target.length,
            keyReferrer,
            context,
        );
        target[normalizedIndex] = value;

    } else if (Utils.isDict(target)) {

        if (isInvocable(target.__set)) {
            invoke(
                target.__set,
                Utils.createRawArray([key, value], operationReferrer),
                operationReferrer,
                context,
                target,
            );
        } else {
            if (typeof key !== 'string') {
                Utils.raise(TypeError, 'expect a string as key', keyReferrer, context);
            }
            target[key as string] = value;
        }

    } else {
        Utils.raise(TypeError, 'invalid property assignment', operationReferrer, context);
    }

};

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
