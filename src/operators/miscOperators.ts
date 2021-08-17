import { SymbolNode, WordNode } from '3h-ast';
import { builtinArray } from '../builtins/array';
import { builtinDict } from '../builtins/dict';
import { builtinFunction } from '../builtins/function';
import { builtinNumber } from '../builtins/number';
import { builtinString } from '../builtins/string';
import { ContextValue, Dict, FunctionHandler, Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { createBinaryOperator, OperatorDefinition } from './common';

export const miscOperators: OperatorDefinition[] = [{
    symbol: '.',
    priority: 1,
    ltr: true,
    handler(buffer, index, context) {

        const target = evalBufferNode(buffer, index - 1, buffer[index], context);
        if (!Utils.isDict(target)) {
            Utils.raise(TypeError, 'expect a dict', buffer[index - 1], context);
        }

        const nameNode = buffer[index + 1];
        if (!nameNode || nameNode.type !== 'word') {
            Utils.raise(TypeError, 'expect a word following', buffer[index], context);
        }

        const name = (nameNode as WordNode).value;
        let value: ContextValue;
        if (name in (target as Dict)) {
            value = (target as Dict)[name];
        } else {
            value = null;
        }

        const valueNode = Utils.createValueNode(value, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

    },
}, {
    symbol: ':',
    priority: 1,
    ltr: true,
    handler(buffer, index, context) {

        const target = evalBufferNode(buffer, index - 1, buffer[index], context);

        const nameNode = buffer[index + 1];
        if (!nameNode || nameNode.type !== 'word') {
            Utils.raise(TypeError, 'expect a word following', buffer[index], context);
        }

        let dict: Dict | null = null;
        switch (typeof target) {
            case 'number': {
                dict = builtinNumber;
                break;
            }
            case 'string': {
                dict = builtinString;
                break;
            }
            case 'boolean': {
                dict = null;
                break;
            }
            case 'function': {
                dict = builtinFunction;
                break;
            }
            case 'object': {
                if (!target) {
                    dict = null;
                } else if (Array.isArray(target)) {
                    dict = builtinArray;
                } else if (Utils.isDict(target)) {
                    dict = builtinDict;
                }
                break;
            }
            default: {
                dict = null;
            }
        }

        const name = (nameNode as WordNode).value;
        let callback: ContextValue;
        if (dict && name in dict) {
            callback = dict[name];
        } else {
            callback = null;
        }

        if (typeof callback !== 'function') {
            Utils.raise(TypeError, 'expect a function', buffer[index], context);
        }

        const COMMA_NODE: SymbolNode = {
            type: 'symbol',
            value: ',',
            line: buffer[index].line,
            column: buffer[index].column,
            offset: buffer[index].offset,
        };

        const handler: FunctionHandler = (rawArgs, referrer, _context, thisArg) => {
            return (callback as FunctionHandler)(
                [
                    Utils.createValueNode(target, referrer),
                    COMMA_NODE,
                    ...rawArgs,
                ],
                referrer,
                _context,
                thisArg,
            );
        };

        const valueNode = Utils.createValueNode(handler, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

    },
}, {
    symbol: '??',
    priority: 12,
    ltr: true,
    handler: createBinaryOperator<ContextValue, ContextValue>(
        null,
        null,
        (a, b) => (a ?? b)
    ),
}, {
    symbol: '#',
    priority: 2,
    ltr: true,
    handler(buffer, index, context) {
        const wordNode = buffer[index + 1];
        if (index + 1 === buffer.length || wordNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word following', buffer[index], context);
        }
        const valueNode = Utils.createValueNode((wordNode as WordNode).value, buffer[index]);
        Utils.replaceBuffer(buffer, index, 2, valueNode);
    },
}];
