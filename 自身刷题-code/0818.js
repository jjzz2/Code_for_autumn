//1.instanceOf
function myInstanceOf(obj, tar) {
    let __proto__ = Object.getPrototypeOf(obj)
    let prototype = tar.prototype
    while (__proto__) {
        if (__proto__ === prototype) {
            return true
        }
        __proto__=Object.getPrototypeOf(__proto__)
    }
    return false
}
//new
function myNew(constructor, ...args) {
    let obj = {}
    obj.__proto__ = constructor.prototype
    let result = obj.apply(obj, ...args)
    return result instanceof Object?result:obj
}
//all,race
function myPromiseRace(promises) {
    return new Promise((resolve, reject) => {
        for (let item of promises) {
            Promise.resolve(item).then((val) => {
                resolve(val)
            }).catch((err) => {
                reject(err)
            })
        }
    })
}
function myPromiseAll(promises) {
    let count = 0
    const res=[]
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++){
            Promise.resolve(promises[i]).then((val) => {
                res[i] = val
                count++
                if (count === promises.length - 1) {
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        }
    })
}
//柯里化
function myCurry() {
    
}
//ajax
function ajax(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.status === 4) {
                if (xhr.code === 200) {
                    resolve(JSON.stringify(xhr.responseText))
                } else {
                    reject(err)
                }
            }
        }
    })
}
class Event{
    constructor() {
        this.events={}
    }
    on(callback, event) {
        if (!this.events[event]) {
            this.events[event]=[]
        }
        this.events[event].push(callback)
    }
    off(callback, event) {
        if (this.events[event]) {
            this.events[event]=this.events[event].filter((fn)=>fn!==callback)
        }
    }
    emit(event, ...args) {
        this.events[event].forEach((callback)=>callback(...args))
    }
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args)
            this.off(callback)
        }
        this.on(event,wrapper)
    }
}