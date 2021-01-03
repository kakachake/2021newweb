/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-02 10:57:49
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-02 12:02:02
 */
//我要重写数组的哪些方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化

let oldArrayMethods = Array.prototype;
 export let arrayMethods = Object.create(oldArrayMethods)

 const methods = [
     'push',
     'shift',
     'unshift',
     'pop',
     'sort',
     'splice',
     'reverse'
 ]
 methods.forEach(method=>{
     arrayMethods[method] = function(...args){
        console.log('用户调用了'+method+'方法');

        const result = oldArrayMethods[method].apply(this, args);//调用原生的数组方法

        let inserted;

        let ob = this.__ob__;
        

        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice': 
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if(inserted){
            console.log(ob);
            ob.ObserverArray(inserted) //将新增属性继续观测
        }
        return result;
     }
 })