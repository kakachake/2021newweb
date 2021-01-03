/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-02 10:06:11
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-02 12:07:23
 */

 /**
  * 
  * @param {*} data 当前数据是不是对象 
  */
export function isObject(data){
    return typeof data === 'object' && data !== null;
}

export function def(data, key, value){
    Object.defineProperty(data, key,{
        enumerable:false,
        configurable: false,
        value
    })
}