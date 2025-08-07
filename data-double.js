// 1. 创建一个用于存储订阅者的类  
class Dep {
    constructor() {
        this.subs = [];
    }

    // 添加订阅者  
    addSub(sub) {
        this.subs.push(sub);
    }

    // 通知订阅者更新  
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

// 2. 创建一个Watcher类，用于观察数据变化并更新视图  
class Watcher {
    constructor(vm, exp, cb) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.value = this.get(); // 初始化时获取一次值  
    }

    // 获取当前属性的值  
    get() {
        Dep.target = this; // 将当前watcher设为Dep的target  
        let value = this.vm[this.exp]; // 触发getter，添加订阅者  
        Dep.target = null; // 清除target  
        return value;
    }

    // 更新视图  
    update() {
        let newValue = this.vm[this.exp];
        if (newValue !== this.value) {
            this.value = newValue;
            this.cb(newValue);
        }
    }
}

// 3. 创建一个Vue实例类  
class Vue {
    constructor(data) {
        this.data = data;
        Object.keys(data).forEach(key => {
            this[key] = this._proxyData(key);
        });
        this._initWatch();
    }

    // 初始化watcher  
    _initWatch() {
        this._watchers = [];
        let updateComponent = () => {
            console.log('组件更新');
        };
        Object.keys(this.data).forEach(key => {
            new Watcher(this, key, updateComponent);
        });
    }

    // 数据代理，用于实现双向绑定  
    _proxyData(key) {
        let self = this;
        return new Proxy(this.data[key], {
            get(target, prop) {
                if (Dep.target) {
                    let dep = target.__dep__ || (target.__dep__ = new Dep());
                    dep.addSub(Dep.target);
                }
                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                let result = Reflect.set(target, prop, value);
                let dep = target.__dep__;
                if (dep) {
                    dep.notify();
                }
                return result;
            }
        });
    }
}

// 使用示例  
let vm = new Vue({
    data: {
        message: 'Hello, Vue!'
    }
});

// 修改message属性，视图和模型都会自动更新  
vm.message = 'Hello, World!';
