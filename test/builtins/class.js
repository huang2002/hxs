// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(
        evalCode(`
            _id = 0;
            Animal = class({
                #__init -> @(type = 'animal') {
                    forward([#_id]);
                    set(this, #id, _id);
                    set(this, #type, type);
                    _id += 1;
                },
                #eat -> () => ('eating'),
                #sleep -> () => ('sleeping'),
            });
            Person = class({
                #__init -> @(name) {
                    invoke(Animal, ['people'], this);
                    set(this, #name, name);
                },
                #speak -> (sign) => (
                    join('This is ', this.name, sign)
                ),
                #sleep -> () => ('zzzzz'),
            });
            animal = Animal();
            Tom = Animal('cat');
            Peter = Person('Peter');
            [
                animal.id,
                animal.type,
                Tom.id,
                Tom.type,
                Tom.eat(),
                Tom.sleep(),
                Peter.id,
                Peter.type,
                Peter.name,
                Peter.eat(),
                Peter.sleep(),
                Peter.speak('!'),
            ]
        `),
        [
            0,
            'animal',
            1,
            'cat',
            'eating',
            'sleeping',
            2,
            'people',
            'Peter',
            'eating',
            'zzzzz',
            'This is Peter!'
        ]
    );

};
