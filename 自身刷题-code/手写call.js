Function.prototype.myCall=function (context){
    if(typeof this !=='function'){
        console.error('type error')
    }
    let args=[...arguments].slice(1)
    let result=null;
    context=context||window
    context.fn=this
    result=context.fn(...args)
    delete context.fn
    return result
}
// call

Function.prototype.call1=function (context,...args){
    context=context||window
    const fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}

// 测试
function greet(name) {
    console.log(`Hello, ${name}!`);
}

// 定义一个对象作为上下文
const person = {
    name: 'Alice',
};

// 使用修改后的 call 方法
greet.call1(person, 'Bob');  // 输出: Hello, Bob!
//这里不用变换了，直接转即可。