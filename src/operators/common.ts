import { ContextValue, SyntaxHandler, Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";

export interface OperatorDefinition {
    symbol: string;
    priority: number;
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
