// <div>
//   <span>
//     <a></a>
//   </span>
//     <span>
//     <a></a>
//     <a></a>
//   </span>
// </div>
//
// 把上诉dom结构转成下面的JSON格式
//
// {
//     tag: 'DIV',
//         children: [
//     {
//         tag: 'SPAN',
//         children: [
//             { tag: 'A', children: [] }
//         ]
//     },
//     {
//         tag: 'SPAN',
//         children: [
//             { tag: 'A', children: [] },
//             { tag: 'A', children: [] }
//         ]
//     }
function domToTree(dom){
    let obj={}
    obj.name=dom.tagName
    obj.children=[]
    dom.childNodes.forEach((child)=>obj.children.push(domToTree(child)))
    return obj
}
// {
//     tag: 'DIV',
//         attrs:{
//     id:'app'
// },
//     children: [
//         {
//             tag: 'SPAN',
//             children: [
//                 { tag: 'A', children: [] }
//             ]
//         },
//         {
//             tag: 'SPAN',
//             children: [
//                 { tag: 'A', children: [] },
//                 { tag: 'A', children: [] }
//             ]
//         }
//     ]
// }
// 把上诉虚拟Dom转化成下方真实Dom
// <div id="app">
//     <span>
//     <a></a>
// </span>
// <span>
//     <a></a>
//     <a></a>
//   </span>
// </div>
function render(vnode){
    if (typeof vnode==='number'){
        vnode=String(vnode)
    }
    if (typeof vnode==='string'){
        return document.createElement(vnode)
    }
    const dom=document.createElement(vnode.tag)
    if (vnode.attrs){
        Object.keys(vnode.attrs).forEach((key)=>{
            const val=vnode.attrs[key]
            dom.setAttribute(key,val)
        })
    }
    vnode.children.forEach((child)=>dom.appendChild(render(child)))
    return dom
}
// [
//     {
//         id: 1,
//         text: '节点1',
//         parentId: 0,
//         children: [
//             {
//                 id:2,
//                 text: '节点1_1',
//                 parentId:1
//             }
//         ]
//     }
// ]
// 转成
//     [
//     {
//         id: 1,
//         text: '节点1',
//         parentId: 0 //这里用0表示为顶级节点
//     },
//         {
//             id: 2,
//             text: '节点1_1',
//             parentId: 1 //通过这个字段来确定子父级
//         }
// ...
// ]
function treeToList(tree){
    let list=[]
    for (let item of tree){
        list.push(item)
        if (item.children){
            //将其打平来加入
            list.push(...treeToList(item.children))
        }
    }
    return list
}
function limits(tasks,limit,callback){
    let runningTasks=0
    let cnt=0
    let res=[]
    return new Promise((resolve,reject)=>{
        function run(){
            if (cnt===tasks.length&&runningTasks===0){
                resolve(callback(res))
                return
            }
            while(runningTasks<limit&&cnt<tasks.length){
                runningTasks++
                let index=cnt
                cnt++
                Promise.resolve(tasks[index]).then((value)=>{
                    runningTasks--
                    res[index]=value
                    run()
                }).catch(reject)
            }
        }
        run()
    })
}