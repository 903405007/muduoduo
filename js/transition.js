// 兼容性判断，并返回可兼容的值，及状态
// 整个为立即执行函数，在打开网页时，就执行，并将执行的结果保存在一个全局变量中，可供其他模块调用其执行的结果
(function(){
    // 创建多个可能兼容的属性对象
    var transitionEventName={
        // 属性名：用于判断是都存在，属性值：调用时使用的值（此处为事件名）
        transition:'transitionend',
        MozTransition:'transitionend',
        WebkitTransition:'webkitTransitionEnd',
        OTransition:'oTransitionEnd otransitionend'
    };
    // 待填入支持的值
    // 默认不支持
    var transitionEnd='',
        isSupport=false;

    // 遍历对象的属性，判断是否存在，存在则填入支持的变量中，同时修改为支持
    // 若遍历完都不存在则不支持
    for(var name in transitionEventName){
        if(document.body.style[name]!==undefined){
            transitionEnd=transitionEventName[name];
            isSupport=true;
            break;
        }
    }

    window.md=window.md||{};//如果对象存在就用存在的，如果不存在就新建新的对象
    // 将遍历的结果保存在该全局变量中。
    window.md.transition={
        end:transitionEnd,
        isSupport:isSupport
    }
})();