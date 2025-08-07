function curry(fn){
    if(typeof fn!=="function"){
        console.error('it must be an function')
    }
    return function curried(...args){
        if(args.length>=fn.length){
            return fn.apply(this,args)
        }else{
            return function (...args2){
                //记住这里还要连接
                return curried.apply(this,args.concat(args2))
            }
        }
    }
}

function sum(a, b, c) {
    return a + b + c;
}
//这是以类的方式然后进行长度的测量，如果不够的话继续以子函数然后继续拼接，超过了就使用原函数执行
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));
console.log(curriedSum(1, 2)(3));