# Changelog

## 0.48.0

- Modify `this` in magic methods
- Improve docs

## 0.47.0

- Add `assert`
- Fix variable naming in help info

## 0.46.0

- Add `Time`
- Add `Promise.timeout`
- Add `wrapPromise` helper
- Fix some internal issues

## 0.45.0

- Add `Promise.finally`
- Fix return value handling of reject callback

## 0.44.0

- Add `Promise.all/any/race`
- Add `Array.reverse`
- Add `Array.findIndex/find`
- Add `Array.every/some`
- Strict indicator type in `Array.filter`
- Fix some internal issues

## 0.43.0

- Add basic promise APIs
- Add `String.startsWith/endsWith`
- Add `Utils.filterValue`
- Make `referrer` & `context` optional in `Utils.raise` & `createClass`
- Fix some type issues

## 0.42.1

- Fix babel config

## 0.42.0

- Restrict conditions of property magic methods
- Fix stack tracing

## 0.41.2

- Improve REPL displaying
- Improve introduction

## 0.41.1

- Fix line end escaping

## 0.41.0

- Add `scriptContext.stack`
- Fix CLI error display
- Bump `3h-ast` to `0.13.0`

## 0.40.0

- Add property assignment syntax
- Add magic methods: `__set`, `__get`, `__remove`, `__has` & `__keys`
- Add `Dict.get`
- Remove `Array.set`, `Dict.diff` & `set`
- Refactor property related APIs

## 0.39.0

- Add simpler function declaration syntax
- Refactor internal function APIs

## 0.38.0

- Add magic methods for operators
- Refactor `getConstructorOf` & `isInstanceOf`

## 0.37.0

- Refactor Class APIs
- Refactor internal APIs

## 0.36.0

- Add `String.__invoke`
- Add `Array.__invoke`
- Add `Dict.__invoke`
- Remove `String.join` & `join`
- Remove `Dict.create` & `Dict.from`

## 0.35.0

- Add invocable type
- Add shortcut syntax to dict creation
- Add `same`

## 0.34.0

- Add `Dict.diff`
- Add `Utils.extendContext` & `Utils.diffDict`
- Fix help info

## 0.33.0

- Remove default `import`(a placeholder)
- Add `JSON`
- Add `String.repeat` & `String.codePointAt`

## 0.32.0

- Make `forward` effect immediately
- Fix evaluation of arg defaults
- Improve expression evaluation APIs

## 0.31.0

- Add module support
- Fix display of error messages

## 0.30.0

- Add `>>>` & `>>>=`

## 0.29.0

- Add `getContextStore`
- Change context stores to dicts
- Rename some internal identifiers

## 0.28.0

- Add `??` & `??=`
- Add optional args without defaults
- Improve internal APIs

## 0.27.0

- Add `indexOf`, `lastIndexOf` & `includes`
- Add shortcut syntax

## 0.26.0

- Add `Number.isNaN` & `isNaN`
- Add `Number.parseInt`

## 0.25.0

- Pack `3h-ast` into final bundle

## 0.24.0

- Improve `Function.invoke`
- Fix internal flag catching
- Optimize evaluation

## 0.23.0

- Add `class`
- Add `this` to expressions
- Improve value display
- Fix evaluation result

## 0.22.0

- Add `clone`
- Add rest arguments
- Add expansion syntax
- Add more assignment operators
- Add type checking to not operator
- Add `createAdditionalAssignmentOperator`
- Fix error referrer

## 0.21.0

- Add default-argument syntax

## 0.20.0

- Add `raise` & `try`
- Add `Dict.assign` & `assign`

## 0.19.0

- Use `->` for dict entries
- Add `Function.bind`
- Add utility function `slice`
- Add shortcut `invoke` & `bind`

## 0.18.0

- Add expressions

## 0.17.0

- Add `Dict.remove`
- Add `Array.forEach/map/filter`
- Add utility functions

## 0.16.0

- Add `Number`
- Add help info to builtin dicts

## 0.15.0

- Fix combination order

## 0.14.0

- Add placeholder(`_`)

## 0.13.0

- Improve performance
- Refactor source code

## 0.12.0

- Add bit shifting operators
- Improve error info

## 0.11.0

- Add `Math`
- Add `injectHelp`
- Fix null checking in `help`

## 0.10.0

- Rewrite
