import { SpanNode } from '3h-ast';
import { FunctionHandler, SyntaxHandler, Utils } from '../common';
import { evalExpression } from "../eval/evalExpression";
import { evalNode } from "../eval/evalNode";

export const parathesisHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // pure paratheses

        const value = evalExpression((buffer[index] as SpanNode).body, context);
        buffer[index] = Utils.createValueNode(value, buffer[index]);

    } else { // function call

        const handler = evalNode(buffer[index - 1], context);
        if (typeof handler !== 'function') {
            Utils.raise(TypeError, 'expect a function', buffer[index], context);
        }

        const value = (handler as FunctionHandler)(
            (buffer[index] as SpanNode).body,
            buffer[index],
            context
        );

        const valueNode = Utils.createValueNode(value, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
