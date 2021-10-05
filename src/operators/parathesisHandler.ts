import { SpanNode } from '3h-ast';
import { SyntaxHandler, Utils } from '../common';
import { evalExpression } from "../eval/evalExpression";
import { evalNode } from "../eval/evalNode";

export const parathesisHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // pure paratheses

        const value = evalExpression((buffer[index] as SpanNode).body, context);
        buffer[index] = Utils.createValueNode(value, buffer[index]);

    } else { // function call

        const handler = evalNode(buffer[index - 1], context);
        if (!Utils.isInvocable(handler)) {
            Utils.raise(TypeError, 'expect an invocable', buffer[index], context);
        }

        const value = Utils.invoke(
            handler,
            (buffer[index] as SpanNode).body,
            buffer[index],
            context,
            null,
        );

        const valueNode = Utils.createValueNode(value, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
