Array.prototype.myFlat=function (depth){
    if (depth<=0)return [...this]
    return this.reduce((p,c)=>{
       if (Array.isArray(c)){
           p.push(...c.myFlat(depth-1))
       }else{
           p.push(c)
       }
        return p
    },[])
}
//一样的递归实现，只不过加了参数
