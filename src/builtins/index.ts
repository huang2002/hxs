import { builtinArray } from './array';
import { builtinIf } from './if';
import { builtinFor } from './for';
import { builtinWhile } from "./while";
import { ContextStore, ContextValue } from '../common';
import { builtinString } from './string';
import { builtinDict } from './dict';
import { builtinFunction } from './function';
import { builtinMath } from './math';
import { builtinNumber } from './number';
import { boolean, number, string, typeOf } from './types';
import { help, injectHelp } from './help';
import { delete_, exist } from './variable';
import { print, remove, set, sizeOf } from './misc';

export const builtins: ContextStore = new Map<string, ContextValue>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['null', null],
    ['_', null],

    ['if', builtinIf],
    ['while', builtinWhile],
    ['for', builtinFor],

    ['Array', builtinArray],
    ['String', builtinString],
    ['Dict', builtinDict],
    ['Function', builtinFunction],
    ['Number', builtinNumber],
    ['Math', builtinMath],

    ['help', help],
    ['injectHelp', injectHelp],

    ['exist', exist],
    ['delete', delete_],

    ['typeOf', typeOf],
    ['number', number],
    ['string', string],
    ['boolean', boolean],

    ['print', print],
    ['set', set],
    ['remove', remove],
    ['sizeOf', sizeOf],

    ['forEach', builtinArray.forEach],
    ['map', builtinArray.map],
    ['filter', builtinArray.filter],
    ['join', builtinString.join],
    ['keys', builtinDict.keys],
    ['invoke', builtinFunction.invoke],
    ['bind', builtinFunction.bind],

]);
