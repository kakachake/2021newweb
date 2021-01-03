/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-01 23:30:30
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-01 23:53:01
 */
import {observe} from './observer/index'
export function initState(vm){
    const opts = vm.$options;

    //vue数据来源 属性 方法 数据 计算属性 watch

    if(opts.props){
        initProps(vm);
    }
    if(opts.method){
        initMethod(vm);
    }
    if(opts.data){
        initData(vm);
    }
    if(opts.computed){
        initComputed(vm);
    }
    if(opts.watch){
        initWatch(vm);
    }
}

function initProps(){}
function initMethod(){}
function initData(vm){
    //数据初始化
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function'?data.call(vm):data;
    //对象劫持 用户改变了数据 我希望得到通知 => 刷新页面
    //mvvm模式,数据变化驱动视图变化
    //object.defineProperty() 给属性增加get和set方法
    observe(data); //响应式原理
}
function initComputed(){}
function initWatch(){}