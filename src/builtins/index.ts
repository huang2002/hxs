import { builtinArray } from './array';
import { builtinIf } from './if';
import { builtinFor } from './for';
import { builtinWhile } from "./while";
import { Utils } from '../common';
import { builtinString } from './string';
import { builtinDict } from './dict';
import { builtinFunction } from './function';
import { builtinMath } from './math';
import { builtinNumber } from './number';
import { boolean, number, string, typeOf } from './types';
import { help, injectHelp } from './help';
import { delete_, exist, getContextStore } from './variable';
import { clone, same, includes, indexOf, lastIndexOf, print, remove, set, sizeOf, slice } from './misc';
import { builtinRaise, builtinTry } from './error';
import { builtinClass } from './class';
import { export_, getExports } from './module';
import { builtinJSON } from './json';

export const builtins = Utils.createDict({

    true: true,
    false: false,
    Infinity,
    NaN,
    null: null,
    _: null,

    if: builtinIf,
    while: builtinWhile,
    for: builtinFor,
    raise: builtinRaise,
    try: builtinTry,
    class: builtinClass,

    Array: builtinArray,
    String: builtinString,
    Dict: builtinDict,
    Function: builtinFunction,
    Number: builtinNumber,
    Math: builtinMath,
    JSON: builtinJSON,

    help,
    injectHelp,

    exist,
    delete: delete_,
    getContextStore,

    typeOf,
    number,
    string,
    boolean,

    print,
    same,
    set,
    remove,
    sizeOf,
    slice,
    clone,
    indexOf,
    lastIndexOf,
    includes,

    getExports,
    export: export_,

    forEach: builtinArray.forEach,
    map: builtinArray.map,
    filter: builtinArray.filter,
    keys: builtinDict.keys,
    assign: builtinDict.assign,
    isInvocable: builtinFunction.isInvocable,
    invoke: builtinFunction.invoke,
    bind: builtinFunction.bind,
    isNaN: builtinNumber.isNaN,

});
