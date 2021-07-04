import { SpanNode } from '3h-ast';
import { Dict, ContextValue, SyntaxHandler, Utils } from '../common';
import { evalBufferNode, evalExpression, evalList } from '../eval';

export const braceHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // array creation

        const value = evalList((buffer[index] as SpanNode).body, context);
        buffer[index] = Utils.createValueNode(value, buffer[index]);

    } else { // index access

        const target = evalBufferNode(buffer, index - 1, buffer[index], context);
        if (!Utils.isDict(target)) {
            Utils.raise(TypeError, 'expect a dict', buffer[index - 1], context);
        }

        const name = evalExpression((buffer[index] as SpanNode).body, context);
        if (typeof name !== 'string') {
            Utils.raise(TypeError, 'expect a string inside', buffer[index], context);
        }

        let value: ContextValue;
        if ((name as string) in (target as Dict)) {
            value = (target as Dict)[name as string];
        } else {
            value = null;
        }

        const valueNode = Utils.createValueNode(value, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
