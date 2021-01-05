/*
 * @Description: 将html转为ast语法树
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2021-01-04 14:41:19
 * @LastEditors: kakachake
 * @LastEditTime: 2021-01-04 14:42:05
 */

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

 //ast语法树，是用对象来描述js语法的， 虚拟dom用来对象来描述dom节点
let root = null; //ast语法树树根
let currentParent;//标识当前父亲
let stack = []; //栈
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement(tagName, attrs){
    return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children:[],
        attrs,
        parent:null
    }
}

 function start(tagName, attrs){
    let element = createASTElement(tagName, attrs);
    if(!root){
        root = element;
    }
    currentParent = element; //把当前元素标记为父ast树
    stack.push(element); //将开始标签存放到栈中
}

function end(tagName){
    let element = stack.pop();
    currentParent = stack[stack.length-1];
    if(currentParent){
        console.log(element);
        element.parent = currentParent;
        currentParent.children.push(element);
    }
}

 function chars(text){
    text = text.replace(/\s/g,'');
    if(text){
        currentParent.children.push({
            text,
            type:TEXT_TYPE
        })
    }
 }

 export function parseHTML(html){
     while(html){
         let textEnd = html.indexOf('<');
         if(textEnd == 0){
             let startTagMatch = parseStartTag();
             if(startTagMatch){ //匹配开始标签
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
             }else{ //匹配结束标签
                let endTagMatch = html.match(endTag);
                if(endTagMatch){
                    advance(endTagMatch[0].length);
                    end(endTagMatch[1]);
                    continue;
                }
             }
         }
         let text; //匹配字符串
         if(textEnd >= 0){
             text = html.substring(0, textEnd);

         }
         if(text){
             advance(text.length);
             chars(text);
         }

     }

     function advance(n){
        html = html.substring(n);
     }

     function parseStartTag(){
         let start = html.match(startTagOpen);
         if(start){
             var match = {
                 tagName: start[1],
                 attrs:[]
             }
            advance(start[0].length);
            let end, attr;
            while(!(end = html.match(startTagClose))&&(attr = html.match(attribute))){
               advance(attr[0].length);
               match.attrs.push({
                   name:attr[1],
                   value:attr[3] ||attr[4] || attr[5]
               })
            }
            if(end){
                advance(end[0].length);
                return match;
            }
         }
     }
     return root
 }