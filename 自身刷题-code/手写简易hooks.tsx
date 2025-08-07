//1.举例：useState是一个函数
// useState执行返回一个数组，数组第一项是内部维护的数据（通过函数第一次调用的参数传入，可被修改），数组第二项是一个能修改内部数据的函数
// 当触发修改数据修改的方法时，会修改数据，并且会再次渲染组件
// 再次渲染组件时，会再次执行useState，获取修改后新值而不是初始值
import React from "react";
import ReactDOM from 'react-dom'

let value
function useState(initValue){
    value = value===undefined?initValue:value
    function dispatch(newValue){
        value=newValue
        scheduleWork()
    }
    return [value, dispatch]
}
function Counter() {
    let [count, setCount] = useState(0);
    return (
        <>
            <p>Clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}> Add count</button>
        </>
    );
}
//直接调用ReactDom来直接渲染
function scheduleWork(){
    ReactDOM.render(<Counter></Counter>,document.querySelector('#root'))
}
scheduleWork()

