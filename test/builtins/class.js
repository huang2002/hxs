// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(
        evalCode(`
            _id = 0;

            Animal = Class({
                #__init -> {
                    #__invoke -> @(type = 'animal') {
                        set(this, #id, _id);
                        set(this, #type, type);
                        _id += 1;
                        forward([#_id]);
                    },
                },
                #eat -> () => ('eating'),
                #sleep -> () => ('sleeping'),
            });

            Human = Class.extend(Animal, ['people'])({
                #__init -> @(name) {
                    set(this, #name, name);
                },
                #speak -> (sign) => (
                    String('This is ', this.name, sign)
                ),
                #sleep -> () => ('zzzzz'),
            });

            animal = Animal();
            Tom = Animal('cat');
            Peter = Human('Peter');

            [
                animal.id,
                animal.type,
                getConstructorOf(animal) == Animal,
                Tom.id,
                Tom.type,
                Tom.eat(),
                Tom.sleep(),
                isInstanceOf(Tom, Animal),
                Peter.id,
                Peter.type,
                Peter.name,
                Peter.eat(),
                Peter.sleep(),
                Peter.speak('!'),
                Peter:getConstructorOf() == Human,
                Peter:isInstanceOf(Animal),
            ]
        `),
        [
            0,
            'animal',
            true,
            1,
            'cat',
            'eating',
            'sleeping',
            true,
            2,
            'people',
            'Peter',
            'eating',
            'zzzzz',
            'This is Peter!',
            true,
            true,
        ]
    );

    ctx.assertStrictEqual(evalCode(`{}:isInstanceOf(null)`), true);

};
