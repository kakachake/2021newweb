(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-02 10:57:49
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-02 12:02:02
   */
  //我要重写数组的哪些方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('用户调用了' + method + '方法');

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); //调用原生的数组方法

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        console.log(ob);
        ob.ObserverArray(inserted); //将新增属性继续观测
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      //如果数据层次过多，需要递归解析对象中的属性，依次增加set和get方法
      //每一个监控过的属性添加一个ob属性
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        //数组不会对索引进行观测，会导致性能问题
        //前端开发很少操作索引
        value.__proto__ = arrayMethods; //如果数组里为对象，再监控

        this.ObserverArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "ObserverArray",
      value: function ObserverArray(value) {
        //数组对每个数据项内的元素进行劫持
        value.forEach(function (key) {
          observe(key);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        //对象对每一个数据项进行递归劫持
        var keys = Object.keys(data); //[name, age, address]

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]); //定义响应式数据
        });
      }
    }]);

    return Observer;
  }();
  /**
   * //对数据进行劫持
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */


  function defineReactive(data, key, value) {
    observe(value); //递归

    console.log(value, key);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        console.log(key + '发生改变：' + newValue);
        if (newValue === value) return;
        observe(newValue); //继续劫持新的对象

        value = newValue;
      }
    });
  }
  /**
   * 对对象中的每个数据进行监测，不包括对象本身
   * @param {*} data 
   */


  function observe(data) {
    var isObj = isObject(data);
    console.log(isObj);

    if (!isObj) {
      return false;
    }

    return new Observer(data); // 用来观测数据
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-01 23:30:30
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-01 23:53:01
   */
  function initState(vm) {
    var opts = vm.$options; //vue数据来源 属性 方法 数据 计算属性 watch

    if (opts.props) ;

    if (opts.method) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    //数据初始化
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //对象劫持 用户改变了数据 我希望得到通知 => 刷新页面
    //mvvm模式,数据变化驱动视图变化
    //object.defineProperty() 给属性增加get和set方法

    observe(data); //响应式原理
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-02 15:28:36
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-02 15:34:46
   */
  //ast语法树，是用对象来描述js语法的， 虚拟dom用来对象来描述dom节点
  function compileToFunction(template) {
    console.log(template, '---');
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-01 23:23:17
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-02 15:33:51
   */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      //数据的劫持
      var vm = this; //vue中的this.$options 指代的就是用户传递的属性

      vm.$options = options; //初始化状态

      initState(vm); //如果用户传入el属性 需要将页面渲染出来
      //如果用户传入el 就要实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //默认先会查找render,没有会采用template,没有用el中的内容

      if (!options.render) {
        //对模板进行编译
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } //将template转化为render方法  虚拟dom


        var render = compileToFunction(template);
        console.log(template);
      }
    };
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-01 22:45:55
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-01 23:27:11
   */

  function Vue(options) {
    //进行vue的初始化操作
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
