// const data = [
//     { val: 1, children: [
//             { val: 2, children: [
//                     { val: 3 },
//                     { val: 4 }
//                 ]},
//             { val: 5 }
//         ]},
//     { val: 6 },
//     { val: 7 }
// ]
// // 1
// // 2
// // 3
// // 4
// // 5
// // 6
// // 7
// let res=[]
// function printVals(data,depth=0) {
//     // 实现逻辑
//     for (let item of data){
//         if (item.children){
//             res.push({val:item.val,depth})
//             printVals(item.children,depth+1)
//         }else{
//             res.push({val:item.val,depth})
//         }
//     }
// }
// printVals(data)
// res.forEach(item=>console.log(item))
// const list = [
//     { id: 1, parentId: 0, name: 'A' },
//     { id: 2, parentId: 1, name: 'B' },
//     { id: 3, parentId: 1, name: 'C' },
//     { id: 4, parentId: 2, name: 'D' },
//     { id: 5, parentId: 0, name: 'E' },
//     { id: 6, parentId: 5, name: 'F' }
// ]
//
// function buildTree(list) {
//     let map = {}
//     let res = []
//
//     for (let item of list) {
//         map[item.id] = item
//     }
//
//     for (let i = 0; i < list.length; i++) {
//         let pid = list[i].parentId
//         if (map[pid]) {
//             if (map[pid].children) {
//                 map[pid].children.push(list[i])
//             } else {
//                 map[pid].children = [list[i]] // ✅ 关键：首次直接放进去
//             }
//         } else {
//             res.push(list[i])
//         }
//     }
//
//     console.log(JSON.stringify(res, null, 2))
//     return res
// }
// buildTree(list)
const tree = [
    {
        id: 1,
        parentId: 0,
        name: 'A',
        children: [
            {
                id: 2,
                parentId: 1,
                name: 'B',
                children: [
                    { id: 4, parentId: 2, name: 'D' }
                ]
            },
            {
                id: 3,
                parentId: 1,
                name: 'C'
            }
        ]
    },
    {
        id: 5,
        parentId: 0,
        name: 'E',
        children: [
            {
                id: 6,
                parentId: 5,
                name: 'F'
            }
        ]
    }
]
    // [
    // { id: 1, parentId: 0, name: 'A' },
    //     { id: 2, parentId: 1, name: 'B' },
    //     { id: 4, parentId: 2, name: 'D' },
    //     { id: 3, parentId: 1, name: 'C' },
    //     { id: 5, parentId: 0, name: 'E' },
    //     { id: 6, parentId: 5, name: 'F' }
    // ]
function flattenTree(tree,res=[]) {
    for (let item of tree){
        if (item.children){
            res.push({id:item.id,parentId:item.parentId,name:item.name})
            flattenTree(item.children,res)
        }else{
            //也可以解构
            const { id, parentId, name } = item
            res.push({ id, parentId, name })

            res.push(item)
        }
    }
    return res
}
console.log(flattenTree(tree))