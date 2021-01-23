import { Common } from '../common';
import { evalList } from '../eval';
import { ExpressionPart, RuleHandler } from '../rules/rule';

export const func_tools = Common.createDict({

    invoke: Common.injectHelp(
        'invoke(func, args)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'exist', 2, 2);
            const func = args[0] as RuleHandler;
            if (typeof func !== 'function') {
                Common.raise(TypeError, `expect a function as the first argument`, env);
            }
            const rawArgList = args[1] as unknown[];
            if (!Array.isArray(rawArgList)) {
                Common.raise(TypeError, `expect an array as argument list`, env);
            }
            const argList = new Array<ExpressionPart>();
            for (let i = 0; i < rawArgList.length; i++) {
                if (i) {
                    argList.push({
                        type: 'symbol',
                        value: ',',
                        offset: NaN,
                        line: env.line,
                        column: NaN,
                    });
                }
                argList.push({
                    type: 'value',
                    value: rawArgList[i],
                    offset: NaN,
                    line: env.line,
                    column: NaN,
                });
            }
            return func(argList, context, env);
        }
    ),

    combine: Common.injectHelp(
        'combine(functions)',
        (rawArgs, context, env): RuleHandler => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'combine', 1, 1);
            const functions = args[0] as RuleHandler[];
            if (!Array.isArray(functions)) {
                Common.raise(TypeError, `expect an array of functions`, env);
            }
            if (!functions.length) {
                Common.raise(RangeError, `no functions provided`, env);
            }
            for (let i = 0; i < functions.length; i++) {
                if (typeof functions[i] !== 'function') {
                    Common.raise(TypeError, `expect an array of functions`, env);
                }
            }
            return (_rawArgs, _context, _env) => {
                let data = functions[0](_rawArgs, _context, _env);
                for (let i = 1; i < functions.length; i++) {
                    data = functions[i](
                        [{
                            type: 'value',
                            value: data !== undefined ? data : null,
                            offset: NaN,
                            line: env.line,
                            column: NaN,
                        }],
                        _context,
                        _env,
                    );
                }
                return data !== undefined ? data : null;
            };
        }
    ),

});
