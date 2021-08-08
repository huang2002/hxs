import { WordNode } from '3h-ast';
import { ContextValue, Dict, Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { OperatorDefinition } from './common';

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
