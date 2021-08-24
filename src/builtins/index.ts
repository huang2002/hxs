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
import { clone, includes, indexOf, lastIndexOf, print, remove, set, sizeOf, slice } from './misc';
import { builtinRaise, builtinTry } from './error';
import { builtinClass } from './class';
import { export_, getExports, import_ } from './module';

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
    import: import_,

    forEach: builtinArray.forEach,
    map: builtinArray.map,
    filter: builtinArray.filter,
    join: builtinString.join,
    keys: builtinDict.keys,
    assign: builtinDict.assign,
    invoke: builtinFunction.invoke,
    bind: builtinFunction.bind,
    isNaN: builtinNumber.isNaN,

});
