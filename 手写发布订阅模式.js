// 发布订阅模式：
// 发布订阅模式是软件开发者常见的一种设计模式。
// 该模式中存在一个或多个发布者，一个或多个订阅者，
// 当发布者发布消息时，参与订阅的订阅者就会收到相应的消息通知。
//观察者模式就是比发布-订阅模式少了个归类的地方，其他的没有区别。
class EventEmitter{
    //首先，还是写一个constructor
    constructor(){
        this.events={}
    }
    //开始写on方法,将一个函数绑定到name属性上，
    on(name,callback){
        if(this.events[name]){
            this.events[name].push(callback)
        }else{
            this.events[name]=[callback]
        }
    }
    off(name,callback){
        if (!this.events[name])return
        if (!callback){
            this.events[name]=undefined
        }else{
            //解除绑定，只要使得其filter一下即可
            this.events[name]=this.events[name].filter((item)=>item!==callback)
        }
    }
    once(name,callback){
        //执行了一次之后，就将其取消订阅
        function fn(){
            callback()
            this.off(name, fn)
        }
        //使用bind来绑定，否则在常规情况下会推出
        this.on(name, fn.bind(this))
    }
    emit(name,...args){
        if (this.events[name]){
            for (let i=0;i<this.events[name].length;i++){
                this.events[name][i](...args)
            }
        }
    }
}
// 创建一个 EventEmitter 实例
const emitter = new EventEmitter();

// Example 1: 使用 on 方法注册事件监听
function callback1() {
    console.log("Callback 1 triggered!");
}

function callback2(message) {
    console.log(`Callback 2 triggered with message: ${message}`);
}

// 注册回调函数到 "event1" 事件
emitter.on("event1", callback1);
emitter.on("event1", callback2);

// 触发 "event1" 事件
emitter.emit("event1", "Hello, EventEmitter!");

// Example 2: 使用 once 方法注册一次性事件监听
function callbackOnce() {
    console.log("This will be triggered only once!");
}

// 注册一次性监听器
emitter.once("event2", callbackOnce);

// 触发 "event2" 事件
emitter.emit("event2");

// 再次触发 "event2" 事件，确保一次性监听器已被移除
emitter.emit("event2");

// Example 3: 使用 off 方法移除事件监听
emitter.off("event1", callback1);

// 再次触发 "event1" 事件，确保 callback1 已被移除
emitter.emit("event1", "Callback 1 should not trigger!");
// 触发 "event1" 事件，确保 callback2 仍然触发
emitter.emit("event1", "Callback 2 should still trigger!");
// //(eventBus就是发布-订阅模式的体现)
// on、off、emit 和 once 的基本含义
// 在发布订阅模式中，这四个方法分别有不同的作用，它们是事件管理的核心。让我们逐个了解它们的基本含义：
//
// on：
// 这个方法用于 订阅 一个事件。当某个事件被发布时，所有订阅了该事件的回调函数会被触发并执行。
//
// 作用：订阅事件，注册回调。
// 用法：
// javascript
// 复制代码
// eventEmitter.on(eventName, callback);
// off：
// 这个方法用于 取消订阅 事件。当你不再希望处理某个事件时，使用 off 方法注销指定的事件和回调函数。
//
// 作用：取消事件的订阅，移除指定的回调。
// 用法：
// javascript
// 复制代码
// eventEmitter.off(eventName, callback);
// emit：
// 这个方法用于 触发 事件。当事件被触发时，所有订阅了该事件的回调函数都会执行。emit 还可以传递一些参数给回调函数。
//
// 作用：触发事件，通知所有订阅者。
// 用法：
// javascript
// 复制代码
// eventEmitter.emit(eventName, ...args);
// once：
// 这个方法用于 订阅只触发一次的事件。当事件触发时，回调函数执行一次后会自动被移除，不会再次执行。
//
// 作用：订阅一次性事件，只会触发一次的事件。
// 用法：
// javascript
// 复制代码
// eventEmitter.once(eventName, callback);
// 在 Vue 框架中的定义
// Vue 是基于 发布订阅模式 来实现组件之间的通信和事件管理的，尤其是在 Vue 的内部实现中，Vue 的事件系统就是通过 on、off、emit 等方法来进行管理的。下面是 Vue 事件系统的简要解释以及如何实现这些方法：
//
// Vue 的事件系统：
// Vue 中的事件系统其实是基于 EventEmitter 实现的，它可以用于在组件实例之间传递自定义事件。在 Vue 中，$on、$off、$emit 和 $once 这些方法允许我们在 Vue 实例（或组件）中监听和触发事件。
//
// $on：用于注册监听器，监听某个事件的发生。
// $off：用于注销事件的监听器，取消某个事件的订阅。
// $emit：用于触发事件，可以传递自定义的参数给事件监听器。
// $once：用于注册一次性事件监听器，监听器只会在事件触发一次后自动移除。
// Vue 中的 on、off、emit、once
// 在 Vue 组件或实例中，这些方法通常会被定义为实例的方法，可以通过 this 访问。
//
// $on
//
// 作用：订阅一个事件，监听该事件并执行回调函数。
// 用法：this.$on('event', callback);
// 例子：
// javascript
// 复制代码
// this.$on('customEvent', (data) => {
//     console.log(data);
// });
// $off
//
// 作用：取消订阅一个事件，移除事件的监听器。如果传递了特定的回调函数，那么只有这个回调函数会被移除。如果没有传递回调函数，则会移除该事件的所有回调。
// 用法：this.$off('event', callback);
// 例子：
// javascript
// 复制代码
// this.$off('customEvent', callback); // 移除特定回调
// this.$off('customEvent'); // 移除该事件的所有回调
// $emit
//
// 作用：触发一个自定义事件，可以传递参数给事件的监听器。
// 用法：this.$emit('event', data);
// 例子：
// javascript
// 复制代码
// this.$emit('customEvent', { message: 'Hello, Vue!' });
// $once
//
// 作用：订阅一个只会触发一次的事件。事件触发后，回调函数会被自动移除。
// 用法：this.$once('event', callback);
// 例子：
// javascript
// 复制代码
// this.$once('customEvent', () => {
//     console.log('This will only be triggered once');
// });
// // Vue 事件系统的实现原理
// // 在 Vue 中，事件系统是基于观察者模式的，也可以理解为是 发布订阅模式 的一种实现。Vue 实例或组件会维护一个事件池（通常是一个对象），这个事件池中包含了各个事件及其对应的回调。以下是 Vue 的一些实现细节：
// //
// // 事件池
// // 每个 Vue 实例都有一个 events 对象，事件的名称作为键，事件的回调函数作为值（通常是一个数组，存储多个回调函数）。当调用 $on 方法时，回调函数会被添加到对应事件的数组中。
// //
// // 触发事件
// // 当调用 $emit 时，Vue 会根据事件名称从事件池中取出所有的回调函数并执行它们，传递相应的参数。
// //
// // 一次性事件
// // Vue 的 $once 方法会通过 once 标志来实现回调只执行一次。触发一次后，Vue 会自动移除这个事件的回调。
// //
// // 移除事件监听器
// // $off 方法会从事件池中删除指定事件的回调函数。
// //
// // 总结
// // 这些方法（on、off、emit、once）在 Vue 中的核心作用与它们在发布订阅模式中的作用一致：管理事件的注册、触发和移除。它们允许 Vue 实例之间进行松耦合的通信，使得事件系统成为 Vue 的重要组成部分。这种模式使得组件之间的交互变得更简单且模块化，也使得 Vue 的响应式系统能够与用户界面交互得更加灵活。