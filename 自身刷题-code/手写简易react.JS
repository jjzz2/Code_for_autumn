let nextFiberReconcileWork=null
let winRoot=null
function workLoop(deadline){
    let shouldYield=false
    //使用这个perform来得到
    while(nextFiberReconcileWork&&!shouldYield){
        //继续调度
        nextFiberReconcileWork=performNextWork(nextFiberReconcileWork)
        shouldYield=deadline.timeRemaining()<1
    }
    //完成调度更新
    if (!nextFiberReconcileWork){
        commitRoot()
    }
    //使用回调函数来完成
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

//对fiber节点进行处理
function performNextWork(fiber){
    reconcile(fiber)
    if (fiber.child){
        return fiber.child
    }
    //对fiber上的节点继续处理
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.return;
    }
}