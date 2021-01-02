import { NumberNode } from '3h-ast';
import { RuleHandler } from './rule';

export const numberHandler: RuleHandler = (parts, context, fileName, line) => {
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
            throw new SyntaxError(
                `unrecognized number suffix "${suffix}" (file ${fileName} line ${line})`
            );
        }
    }
    if (result !== result) { // NaN
        throw new SyntaxError(
            `invalid number "${value}${suffix}" (file ${fileName} line ${line})`
        );
    }
    return result;
};
