import { SpanNode, SymbolNode } from '3h-ast';

export type OperatorNode = SymbolNode | SpanNode;

export const getOperatorSymbol = (node: OperatorNode) => (
    node.type === 'symbol' ? node.value : node.start
);
