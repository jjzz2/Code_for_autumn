class PubSub {
    constructor() {
        this.subscribers = {};
    }
    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    }
    unsubscribe(event, callback) {
        if (this.subscribers[event]) {
            this.subscribers[event] = this.subscribers[event].filter(subCallback => subCallback !== callback);
        }
    }
    publish(event, data) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => callback(data));
        }
    }
}

const pubsub = new PubSub();
//必须要有callback函数才能完成其的调用
const callback = (data) => console.log('Received data:', data);
pubsub.subscribe('myEvent', callback);

pubsub.publish('myEvent', 'Hello, world!');

pubsub.unsubscribe('myEvent', callback);

pubsub.publish('myEvent', 'Hello again!'); // 不会输出任何内容
