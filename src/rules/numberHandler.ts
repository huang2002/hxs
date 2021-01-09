import { NumberNode } from '3h-ast';
import { Common } from '../common';
import { RuleHandler } from './rule';

export const numberHandler: RuleHandler = (parts, context, env) => {
    let { value, suffix } = parts[0] as NumberNode;
    if (suffix.length > 1) {
        value += suffix.slice(0, -1);
        suffix = suffix[suffix.length - 1];
    }
    let result;
    switch (suffix) {
        case '':
        case 'D': {
            result = +value;
            break;
        }
        case 'H': {
            result = Number.parseInt(value, 16);
            break;
        }
        case 'B': {
            result = Number.parseInt(value, 2);
            break;
        }
        case 'O': {
            result = Number.parseInt(value, 8);
            break;
        }
        default: {
            Common.raise(SyntaxError, `unrecognized number suffix "${suffix}"`, env);
        }
    }
    if (result !== result) { // NaN
        Common.raise(SyntaxError, `invalid number "${value}${suffix}"`, env);
    }
    return result;
};
