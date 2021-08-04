import { WordNode } from '3h-ast';
import { Utils } from '../common';
import { evalExpression } from "../eval/evalExpression";
import { OperatorDefinition } from './common';

export const assignmentOperators: OperatorDefinition[] = [{
    symbol: '=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

        if (index === 0) {
            Utils.raise(SyntaxError, 'expect a variable name preceding', buffer[index], context);
        }

        const nameNode = buffer[index - 1];
        if (nameNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word as variable name', buffer[index - 1], context);
        }

        const value = evalExpression(buffer, context, index + 1);
        context.store.set((nameNode as WordNode).value, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '+=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) + (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '-=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) - (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '*=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) * (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '/=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) / (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '&=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) & (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '^=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) ^ (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '|=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

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

        const a = context.store.get(name);
        if (typeof a !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index - 1], context);
        }

        const b = evalExpression(buffer, context, index + 1);
        if (typeof b !== 'number') {
            Utils.raise(SyntaxError, 'expect a number', buffer[index + 1], context);
        }

        const value = (a as number) | (b as number);
        context.store.set(name, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}];
