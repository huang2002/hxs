import { SpanNode } from '3h-ast';
import { SyntaxHandler, Utils } from '../common';
import { evalList } from "../eval/evalList";
import { evalExpression } from "../eval/evalExpression";
import { evalBufferNode } from "../eval/evalBufferNode";
import { getProperty } from '../builtins/common';

export const braceHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // array creation

        const value = evalList((buffer[index] as SpanNode).body, context);
        buffer[index] = Utils.createValueNode(value, buffer[index]);

    } else { // key access

        const target = evalBufferNode(buffer, index - 1, buffer[index], context);
        const key = evalExpression((buffer[index] as SpanNode).body, context);
        const value = getProperty(
            target,
            key,
            true,
            buffer[index - 1],
            buffer[index],
            context,
        );

        const valueNode = Utils.createValueNode(value, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
