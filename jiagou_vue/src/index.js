/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-01 22:45:55
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-01 23:27:11
 */

 //Vue核心代码

import {initMixin} from './init'

function Vue(options){
    //进行vue的初始化操作
    this._init(options);
}

initMixin(Vue);


export default Vue;