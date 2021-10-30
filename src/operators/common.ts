import { WordNode } from '3h-ast';
import { ContextValue, SyntaxHandler, Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { evalExpression } from '../eval/evalExpression';
import { invoke, isInvocable, ScriptContext, SyntaxNode } from '../index';

export interface OperatorDefinition {
    symbol: string;
    priority: number;
    ltr: boolean; // left to right
    handler: SyntaxHandler;
}

export const evalBinaryOperation = <
    T extends ContextValue,
    U extends ContextValue
>(
    a: ContextValue,
    b: ContextValue,
    magicName: string | null,
    typeA: string | null,
    typeB: string | null,
    defaultHandler: (a: T, b: U) => ContextValue,
    buffer: SyntaxNode[],
    index: number,
    context: ScriptContext,
) => {

    if (magicName) {
        if (Utils.isDict(a) && (magicName in a)) {
            const magicMethod = a[magicName];
            if (!isInvocable(magicMethod)) {
                Utils.raise(TypeError, `expect an invocable as ${magicName}`, buffer[index - 1], context);
            }
            return invoke(
                magicMethod,
                Utils.createRawArray([b, false], buffer[index]),
                buffer[index],
                context,
                null,
            );
        } else if (Utils.isDict(b) && (magicName in b)) {
            const magicMethod = b[magicName];
            if (!isInvocable(magicMethod)) {
                Utils.raise(TypeError, `expect an invocable as ${magicName}`, buffer[index + 1], context);
            }
            return invoke(
                magicMethod,
                Utils.createRawArray([a, true], buffer[index]),
                buffer[index],
                context,
                null,
            );
        }
    }

    if (typeA && typeof a !== typeA) {
        Utils.raise(TypeError, `expect a ${typeA}`, buffer[index - 1], context);
    }
    if (typeB && typeof b !== typeB) {
        Utils.raise(TypeError, `expect a ${typeB}`, buffer[index + 1], context);
    }
    return defaultHandler((a as T), (b as U));

};

export const evalUnaryOperation = <
    T extends ContextValue
>(
    value: ContextValue,
    magicName: string | null,
    type: string | null,
    defaultHandler: (value: T) => ContextValue,
    buffer: SyntaxNode[],
    index: number,
    context: ScriptContext,
) => {
    if (magicName && Utils.isDict(value) && (magicName in value)) {
        const magicMethod = value[magicName];
        if (!isInvocable(magicMethod)) {
            Utils.raise(TypeError, `expect an invocable as ${magicName}`, buffer[index - 1], context);
        }
        return invoke(
            magicMethod,
            [Utils.createValueNode(value, buffer[index])],
            buffer[index],
            context,
            null,
        );
    } else {
        if (type && typeof value !== type) {
            Utils.raise(TypeError, `expect a ${type}`, buffer[index - 1], context);
        }
        return defaultHandler(value as T);
    }
};

export const createBinaryOperator = <
    T extends ContextValue,
    U extends ContextValue
>(
    magicName: string | null,
    typeA: string | null,
    typeB: string | null,
    defaultHandler: (a: T, b: U) => ContextValue,
): SyntaxHandler => (
    (buffer, index, context) => {

        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);

        const valueNode = Utils.createValueNode(
            evalBinaryOperation(
                a,
                b,
                magicName,
                typeA,
                typeB,
                defaultHandler,
                buffer,
                index,
                context,
            ),
            buffer[index],
        );

        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

    }
);


export const createUnaryOperator = <T extends ContextValue>(
    magicName: string | null,
    type: string | null,
    defaultHandler: (value: T) => ContextValue,
): SyntaxHandler => (
    (buffer, index, context) => {
        const value = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(
            evalUnaryOperation(
                value,
                magicName,
                type,
                defaultHandler,
                buffer,
                index,
                context,
            ),
            buffer[index],
        );
        Utils.replaceBuffer(buffer, index, 2, valueNode);
    }
);

export const createAdditionalAssignmentOperator = <
    T extends ContextValue,
    U extends ContextValue
>(
    magicName: string | null,
    typeA: string | null,
    typeB: string | null,
    defaultHandler: (a: T, b: U) => ContextValue,
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
        if (!(name in context.store)) {
            Utils.raise(SyntaxError, `${Utils.toDisplay(name)} is not defined`, buffer[index - 1], context);
        }

        const a = context.store[name];
        const b = evalExpression(buffer, context, index + 1);

        const value = evalBinaryOperation(
            a,
            b,
            magicName,
            typeA,
            typeB,
            defaultHandler,
            buffer,
            index,
            context,
        );

        context.store[name] = value;

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    }
);
