class LRU{
    constructor(length){
        this.data=new Map()
        this.length=length
    }
    get(key){
        const data=this.data
        if (!data.has(key)){
            return null
        }
        const val=data.get(key)
        data.delete(key)
        data.set(key,val)
        return val
    }
    set(key,value){
        const data=this.data
        if (data.has(key)){
            data.delete(key)
        }
        data.set(key,value)
        if (data.size>this.length) {
            const deleteKey = data.keys().next().value
            data.delete(deleteKey)
        }
    }

}
const cache = new LRU(3);
cache.set(1, 'A');
cache.set(2, 'B');
cache.set(3, 'C');

console.log(cache.get(1)); // 输出: 'A', 1变成最常使用

cache.set(4, 'D'); // 超过了容量，删除最久未使用的键 2
console.log(cache.get(2)); // 输出: null，因为 2 被删除了
console.log(cache.get(3)); // 输出: 'C'
console.log(cache.get(1)); // 输出: 'A'
console.log(cache.get(4)); // 输出: 'D'
