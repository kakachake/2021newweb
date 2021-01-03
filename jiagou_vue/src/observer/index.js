/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-01 23:52:40
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-02 12:11:28
 */
// 把data中的数据 都使用Object.defineProperty重新定义
import { isObject, def } from '../util/index'
import { arrayMethods } from './array.js'

class Observer{
    constructor(value){
        //如果数据层次过多，需要递归解析对象中的属性，依次增加set和get方法

        //每一个监控过的属性添加一个ob属性
        def(value, '__ob__', this);
        if(Array.isArray(value)){
            //数组不会对索引进行观测，会导致性能问题
            //前端开发很少操作索引
            value.__proto__ = arrayMethods;
            //如果数组里为对象，再监控
            this.ObserverArray(value);
        }else{
            this.walk(value);
        }

    }

    ObserverArray(value){//数组对每个数据项内的元素进行劫持
        value.forEach((key)=>{
            observe(key)
        })
    }

    walk(data){ //对象对每一个数据项进行递归劫持
        let keys = Object.keys(data); //[name, age, address]

        keys.forEach((key)=>{
            defineReactive(data, key, data[key]); //定义响应式数据
        })

    }
}

/**
 * //对数据进行劫持
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
function defineReactive(data, key, value){
    observe(value); //递归
    console.log(value, key);
    Object.defineProperty(data, key, {
        get(){
            return value;
        },
        set(newValue){
            console.log(key+'发生改变：'+newValue);
            if(newValue === value) return;
            observe(newValue);//继续劫持新的对象
            value = newValue;
        }
    })
}

/**
 * 对对象中的每个数据进行监测，不包括对象本身
 * @param {*} data 
 */
export function observe(data){
    let isObj = isObject(data);
    console.log(isObj);
    if(!isObj){
        return false;
    }
    return new Observer(data); // 用来观测数据
}