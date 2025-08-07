function jsonToTree(data){
    const map={}
    const roots=[]
    data.forEach(item=>{
        map[item.id]=item
        item.children=[]
    })
    data.forEach(item=>{
        if(item.parentId===null){
            roots.push(item)
        }else{
            map[item.parentId].children.push(item)
        }
    })
    return roots
}
