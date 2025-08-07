function add(a, b) {
    return this.x + a + b;
}

const obj1 = { x: 10 };

const boundAdd = add.bind(obj1);
console.log(boundAdd(5, 3));  // 输出 18
Function.prototype.bind=function (context,...args){
    context=context||this
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    return function (...args2){
        args=args2.concat(...args2)
        context[fnSymbol](...args2)
        delete context[fnSymbol]
    }
}

class EventEmitter{
    constructor(){
        this.events={}
    }
    on(event,callback){
        if (!this.events[event]){
            this.events[event]=[]
        }
        this.events[event].push(callback)
    }
    emit(event,...args){
        if (this.events[event]){
            this.events[event].forEach(fn=>fn(...args))
        }
    }
}
const emitter = new EventEmitter();
emitter.on('event1', (message) => console.log('Event 1 received:', message));
emitter.emit('event1', 'Hello World!');
//
// function deepClone(obj,...args){
//
// }
//
// const obj = {
//     name: "John",
//     address: { city: "New York" },
//     hobbies: ["Reading", "Swimming"]
// };
//
// const clonedObj = deepClone(obj);
// clonedObj.address.city = "Los Angeles";
// clonedObj.hobbies.push("Cycling");
//
// console.log(obj);  // { name: "John", address: { city: "New York" }, hobbies: ["Reading", "Swimming"] }
// console.log(clonedObj);  // { name: "John", address: { city: "Los Angeles" }, hobbies: ["Reading", "Swimming", "Cycling"] }
//手写事件委托
//dom这块还需要加强
function myPromiseAll(promises){
    let cnt=0
    let res=[]
    return new Promise((resolve,reject)=>{
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value => {
                res[i]=value
                cnt++
                if (cnt===promises.length){
                    resolve(res)
                }
            }).catch(err=>{
                reject(err)
            })
        }
    })

}
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

myPromiseAll([p1, p2, p3]).then(result => {
    console.log(result); // [1, 2, 3]
});
