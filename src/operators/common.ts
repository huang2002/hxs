import { WordNode } from '3h-ast';
import { ContextValue, SyntaxHandler, Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { evalExpression } from '../eval/evalExpression';

export interface OperatorDefinition {
    symbol: string;
    priority: number;
    ltr: boolean; // left to right
    handler: SyntaxHandler;
}

export const createBinaryOperator = <
    T extends ContextValue,
    U extends ContextValue
>(
    typeA: string,
    typeB: string,
    handler: (a: T, b: U) => ContextValue,
): SyntaxHandler => (
    (buffer, index, context) => {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        if (typeof a !== typeA) {
            Utils.raise(TypeError, `expect a ${typeA}`, buffer[index - 1], context);
        }
        if (typeof b !== typeB) {
            Utils.raise(TypeError, `expect a ${typeB}`, buffer[index + 1], context);
        }
        const valueNode = Utils.createValueNode(
            handler((a as T), (b as U)),
            buffer[index]
        );
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    }
);

export const createAdditionalAssignmentOperator = <
    T extends ContextValue,
    U extends ContextValue
>(
    typeA: string,
    typeB: string,
    handler: (a: T, b: U) => ContextValue,
): SyntaxHandler => (
    (buffer, index, context) => {

        if (index === 0) {
            Utils.raise(SyntaxError, 'expect a variable name preceding', buffer[index], context);
        }

        const nameNode = buffer[index - 1];
        if (nameNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word as variable name', buffer[index - 1], context);
        }

        const name = (nameNode as WordNode).value;
        if (!context.store.has(name)) {
            Utils.raise(SyntaxError, `"${name}" is not defined`, buffer[index - 1], context);
        }

        const a = context.store.get(name) as T;
        if (typeof a !== typeA) {
            Utils.raise(SyntaxError, `expect a ${typeA}`, buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1) as U;
        if (typeof b !== typeB) {
            Utils.raise(SyntaxError, `expect a ${typeB}`, buffer[index + 1], context);
        }

        const value = handler(a, b);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    }
);
