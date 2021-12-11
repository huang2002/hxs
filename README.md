# hxs

> A simple programming language written in JavaScript.

## Introduction

*hxs* is an experimental language written in JavaScript.
You can give it a try if you are interested in programming languages,
but it is NOT ready for production use.

## Links

- [Documentation](https://github.com/huang2002/hxs/wiki)
- [Changelog](./CHANGELOG.md)
- [License (MIT)](./LICENSE)
- [Online REPL](https://hxs-repl-hhhjs.vercel.app/)

## Example Code

```txt
Human = Class({
    @__init(name = 'anonymous') {
        this.name = name;
    },
    #age -> 0,
    @speak() {
        print(
            'This is ',
            this.name,
            ', aged ',
            this.age,
            '.'
        );
    },
});

tom = Human('Tom');
tom.age = 19;
tom.speak(); "Prints: This is Tom, aged 19.";
```
