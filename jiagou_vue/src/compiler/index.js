/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-02 15:28:36
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-05 00:16:09
 */
import { parseHTML } from './paser-html'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genChildren(el){
    let children = el;
    if(children&&children.length > 0){
        return `${children.map(c=>
            gen(c)
        ).join(',')}`
    }else{
        
    }
}

function gen(node){
    if(node.type == 1){
        //元素标签
        return generate(node); //递归
    }else{
        let text = node.text;   // a{{name}} b{{age}} c
        let tokens = [];
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0;
        while(match = defaultTagRE.exec(text)){
            index = match.index;
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length;
        }
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join('+')})`;
    }
}

function genProps(attrs){ //处理属性
    let str = '';
    for(let i = 0; i < attrs.length; i++){
        let attr = attrs[i];
        if(attr.name === 'style'){
            // style="color: red;fontSize: 14px" => {style:{color: 'red'}}
            let obj="{";
            attr.value.split(';').forEach(item=>{
                let [key, value] = item.split(':');
                // obj[key] = value;
                obj+=`"${key}":"${value}",`
            })
            obj = obj.slice(0,-1);
            attr.value = obj+"}";
        }
        str+=`${attr.name}:${attr.value},`
    }
    return `{${str.slice(0, -1)}}`;
}

function generate(el){
    let code = `_c("${el.tag}", ${
        el.attrs.length>0?genProps(el.attrs):'undefined'
    }${el.children?`,${genChildren(el.children)}`:''
    })
    `

    return code;
}

export function compileToFunction(template){
    let root = parseHTML(template);

    //需要将ast语法树生成最终的render函数 就是字符串拼接（模板引擎）
    //console.log(root);

    let code = generate(root);
    //console.log(code);
    //<div id= "app"><p>hello{{name}}</p>hello</div>
    //将ast语法树转化为js语法
    //_c("div", {id:app},_c("p", undefined, _v('hello')))

    let renderFn = new Function(`with(this){return ${code}}`);

    //返回的虚拟dom
    return renderFn;
}