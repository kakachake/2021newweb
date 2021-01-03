/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-01 23:23:17
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-02 15:33:51
 */
import { initState } from './state'

import { compileToFunction } from './compiler/index'

//在原型上添加一个init方法
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        //数据的劫持
        const vm = this; //vue中的this.$options 指代的就是用户传递的属性
        vm.$options = options;
    

        //初始化状态
        initState(vm);

        //如果用户传入el属性 需要将页面渲染出来
        //如果用户传入el 就要实现挂载流程

        if(vm.$options.el){
            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function(el){
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);

        //默认先会查找render,没有会采用template,没有用el中的内容

        if(!options.render){
            //对模板进行编译

            let template = options.template;
            if(!template && el){
                template = el.outerHTML;
            }
            
            //将template转化为render方法  虚拟dom
            const render = compileToFunction(template)
            console.log(template);
        }
    }
}