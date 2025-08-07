function myNew(constructor,...args){
    const obj={}
    obj.__proto__=constructor.prototype
    //将其指向函数
    let result=constructor.apply(obj,args)
    return result instanceof Object?result:obj
}
//构造函数
function Person(name,age){
    this.name=name
    this.age=age
}
Person.prototype.greet=function (){
    console.log('hello')
}
const person=myNew(Person,'Alice',30)
console.log(person.name)
console.log(person.age)
person.greet()