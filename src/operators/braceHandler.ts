import { SpanNode } from '3h-ast';
import { Dict, ContextValue, SyntaxHandler, Utils } from '../common';
import { evalList } from "../eval/evalList";
import { evalExpression } from "../eval/evalExpression";
import { evalBufferNode } from "../eval/evalBufferNode";

export const braceHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // array creation

        const value = evalList((buffer[index] as SpanNode).body, context);
        buffer[index] = Utils.createValueNode(value, buffer[index]);

    } else { // key access

        const target = evalBufferNode(buffer, index - 1, buffer[index], context);
        const key = evalExpression((buffer[index] as SpanNode).body, context);

        if (Array.isArray(target) || typeof target === 'string') {

            if (typeof key !== 'number') {
                Utils.raise(TypeError, 'expect a number as index', buffer[index], context);
            }

            const normalizedkey = Utils.normalizeIndex(
                key as number,
                target.length,
                buffer[index],
                context,
            );

            const valueNode = Utils.createValueNode(target[normalizedkey], buffer[index]);
            Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

        } else if (Utils.isDict(target)) {

            if (typeof key !== 'string') {
                Utils.raise(TypeError, 'expect a string as key', buffer[index], context);
            }

            let value: ContextValue;
            if ((key as string) in (target as Dict)) {
                value = (target as Dict)[key as string];
            } else {
                value = null;
            }

            const valueNode = Utils.createValueNode(value, buffer[index]);
            Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

        } else {

            Utils.raise(TypeError, 'expect a dict or array or string', buffer[index - 1], context);

        }

    }

};
