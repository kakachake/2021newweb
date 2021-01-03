/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-01 22:42:41
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-01 23:19:19
 */
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default{
    input: './src/index.js', //入口
    output: {
        file:'dist/umd/vue.js', //V出口路径
        name: 'Vue', //指定打包后全局变量的名字
        format: 'umd', //统一模块规范
        sourcemap:true, //开启源码提示
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        process.env.ENV === 'development'?serve({
            open:true, 
            openPage:'/public/index.html',
            port:3030,
            contentBase:''
        }):null
    ]
}