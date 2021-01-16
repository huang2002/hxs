import babel from "@rollup/plugin-babel";

const input = './js/index.js';

export default [
    {
        input,
        external: ['3h-ast'],
        plugins: [
            babel({
                babelHelpers: 'bundled'
            })
        ],
        output: {
            globals: {
                '3h-ast': 'HA',
            },
            format: 'umd',
            name: 'HXS',
            file: './dist/hxs.umd.js'
        }
    },
    {
        input,
        external: ['3h-ast'],
        output: {
            format: 'esm',
            file: './dist/hxs.js'
        }
    }
];
