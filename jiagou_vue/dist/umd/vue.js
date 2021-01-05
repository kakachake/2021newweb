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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-02 10:06:11
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-05 00:06:46
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
  function proxy(vm, source, key) {
    //代理取值
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
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
   * @LastEditTime: 2021-01-05 00:07:17
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
    //为了让用户更好的使用，我希望可以直接vm.xxx获取data

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); //响应式原理
  }

  /*
   * @Description: 将html转为ast语法树
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-04 14:41:19
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-04 14:42:05
   */
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  var root = null; //ast语法树树根

  var currentParent; //标识当前父亲

  var stack = []; //栈

  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element; //把当前元素标记为父ast树

    stack.push(element); //将开始标签存放到栈中
  }

  function end(tagName) {
    var element = stack.pop();
    currentParent = stack[stack.length - 1];

    if (currentParent) {
      console.log(element);
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, '');

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function parseHTML(html) {
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          //匹配开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } else {
          //匹配结束标签
          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
            continue;
          }
        }
      }

      var text = void 0; //匹配字符串

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genChildren(el) {
    var children = el;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    }
  }

  function gen(node) {
    if (node.type == 1) {
      //元素标签
      return generate(node); //递归
    } else {
      var text = node.text; // a{{name}} b{{age}} c

      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genProps(attrs) {
    //处理属性
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        // style="color: red;fontSize: 14px" => {style:{color: 'red'}}
        var obj = "{";
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1]; // obj[key] = value;


          obj += "\"".concat(key, "\":\"").concat(value, "\",");
        });
        obj = obj.slice(0, -1);
        attr.value = obj + "}";
      }

      str += "".concat(attr.name, ":").concat(attr.value, ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function generate(el) {
    var code = "_c(\"".concat(el.tag, "\", ").concat(el.attrs.length > 0 ? genProps(el.attrs) : 'undefined').concat(el.children ? ",".concat(genChildren(el.children)) : '', ")\n    ");
    return code;
  }

  function compileToFunction(template) {
    var root = parseHTML(template); //需要将ast语法树生成最终的render函数 就是字符串拼接（模板引擎）
    //console.log(root);

    var code = generate(root); //console.log(code);
    //<div id= "app"><p>hello{{name}}</p>hello</div>
    //将ast语法树转化为js语法
    //_c("div", {id:app},_c("p", undefined, _v('hello')))

    var renderFn = new Function("with(this){return ".concat(code, "}")); //返回的虚拟dom

    return renderFn;
  }

  /*
   * @Description: 
   * @Version: 2.0
   * @Autor: kakachake
   * @Date: 2021-01-01 23:23:17
   * @LastEditors: kakachake
   * @LastEditTime: 2021-01-05 00:15:57
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
        options.render = render;
      }

      console.log(vm.$options.render);
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
