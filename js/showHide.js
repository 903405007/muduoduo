(function($){
    'use strict'
    // 检测浏览器是否支持transitionend的，css3的事件
    var transition=window.md.transition;
    // 共用初始化函数
    function init($elem,hiddenCallback){
        if($elem.is(':hidden')){
            $elem.data('status','hidden');
            if(typeof hiddenCallback==='function') hiddenCallback();
        }else{
            $elem.data('status','shown');
        }
    }
    // 共用show()函数
    function show($elem,callback){
        if($elem.data('status')==='show') return;
        if($elem.data('status')==='shown') return;
        $elem.data('status','show').trigger('show');
        callback();
    }
    //共用hide()函数
    function hide($elem,callback){
        if($elem.data('status')==='hide') return;
        if($elem.data('status')==='hidden') return;
        $elem.data('status','hide').trigger('hide');
        callback();
    }
    // 无过度效果的动画
    var silent={
        // 回调方式
        // show:function($elem,showCallBack,shownCallBack){
            // if(typeof showCallBack==='function') showCallBack();
            // $elem.show();
            // if(typeof shownCallBack==='function') shownCallBack();
            // setTimeout(function(){
            //     $elem.html($elem.html()+"已经显示"+"<br>");
            // },1000);
        // },
        // 发布订阅方式,利于多人协作,如多人订阅
        init:init,
        show:function($elem){//先判断目前状态，再执行发布事件，同时修改data的状态
            show($elem,function(){
                $elem.show();
                $elem.data('status','shown').trigger('shown');
            });
        },
        hide:function($elem){
            hide($elem,function(){
                $elem.hide();
                $elem.data('status','hidden').trigger('hidden');
            });
        }
    };
    // css3动画

    // 在dropdown-layer的内容懒加载时，height的值为0，不能获取显示时的高度值，实现css3的动画
    
    var css3={
            fade:{
                init:function($elem){//初始化函数
                    css3._init($elem,'fadeOut');
                },
                show:function($elem){
                    css3._show($elem,'fadeOut');
                },
                hide:function($elem){
                    css3._hide($elem,'fadeOut');
                }
            },
            // 如果对象的高度由内容撑开，需要先获取对象的高度，同时对象的HTML处要有overflow：hidden属性。
            slideUpDown:{
                init:function($elem){//初始化函数
                    $elem.height($elem.height());//如果对象的高度由内容撑开，需要先获取对象的高度
                    css3._init($elem,'slideUpDownCollapse');
                },
                show:function($elem){
                    css3._show($elem,'slideUpDownCollapse');
                },
                hide:function($elem){
                    css3._hide($elem,'slideUpDownCollapse');
                }
            },
            slideLeftRight:{
                init:function($elem){//初始化函数
                    $elem.width($elem.width());//如果对象的宽度由内容撑开，需要先获取对象的宽度
                    css3._init($elem,'slideLeftRightCollapse');
                },
                show:function($elem){
                    css3._show($elem,'slideLeftRightCollapse');
                },
                hide:function($elem){
                    css3._hide($elem,'slideLeftRightCollapse');
                }
            },
            fadeSlideUpDown:{
                init:function($elem){//初始化函数
                    $elem.height($elem.height());//如果对象的高度由内容撑开，需要先获取对象的高度
                    css3._init($elem,'fadeOut slideUpDownCollapse');
                },
                show:function($elem){
                    css3._show($elem,'fadeOut slideUpDownCollapse');
                },
                hide:function($elem){
                    css3._hide($elem,'fadeOut slideUpDownCollapse');
                }
            },
            fadeSlidLeftRight:{
                init:function($elem){//初始化函数
                    $elem.width($elem.width());//如果对象的宽度由内容撑开，需要先获取对象的宽度
                    css3._init($elem,'fadeOut slideLeftRightCollapse');
                },
                show:function($elem){
                    css3._show($elem,'fadeOut slideLeftRightCollapse');
                },
                hide:function($elem){
                    css3._hide($elem,'fadeOut slideLeftRightCollapse');
                }
            }
        };
    css3._init=function($elem,className){
        $elem.addClass('transition');
        init($elem,function(){
            $elem.addClass(className);
        });
    };
    css3._show=function($elem,className){
        show($elem,function(){
            $elem.off(transition.end).one(transition.end,function(){
                $elem.data('status','shown').trigger('shown');
            })
            $elem.show();
            setTimeout(function(){
                $elem.removeClass(className);
            },10);
        });
    };  
    css3._hide=function($elem,className){
        // 先绑定事件，再添加class后，再触发事件隐藏
        //one，由于是事件中绑定事件，每次触发外部事件时，内部事件都会绑定一次，造成重复绑定，one可以只绑定一次
        //off，先阻止正在进行的'transitionend'事件，再执行新的'transitionend'事件。
        hide($elem,function(){
            $elem.off(transition.end).one(transition.end,function(){
                $elem.hide();
                $elem.data('status','hidden').trigger('hidden');
            });
            $elem.addClass(className);
        });
    };
    // js动画
    var js={
            fade:{
                init:function($elem){
                    js._init($elem);
                },
                show:function($elem){
                    js._show($elem,'fadeIn');
                },
                hide:function($elem){
                    js._hide($elem,'fadeOut');
                }
            },
            slideUpDown:{
                init:function($elem){
                    js._init($elem);
                },
                show:function($elem){
                    js._show($elem,'slideDown');
                },
                hide:function($elem){
                    js._hide($elem,'slideUp');
                }
            },
            slidLeftRight:{
                init:function($elem){
                    js._customInit($elem,{
                        'width': 0,
                        'padding-left': 0,
                        'padding-right': 0
                    });
                },
                show:function($elem){
                    js._customShow($elem);
                },
                hide:function($elem){
                    js._customHide($elem,{
                        'width': 0,
                        'padding-left': 0,
                        'padding-right': 0
                    });
                }
            },
            fadeSlidUpDown:{
                init:function($elem){                
                    js._customInit($elem,{
                        'opacity': 0,
                        'height': 0,
                        'padding-top': 0,
                        'padding-bottom': 0
                    });
                },
                show:function($elem){
                    js._customShow($elem);
                },
                hide:function($elem){
                    js._customHide($elem,{
                        'opacity': 0,
                        'height': 0,
                        'padding-top': 0,
                        'padding-bottom': 0
                    });
                }
            },
            fadeSlidLeftRight:{
                init:function($elem){
                    js._customInit($elem,{
                        'opacity': 0,
                        'width': 0,
                        'padding-left': 0,
                        'padding-right': 0
                    });
                },
                show:function($elem){
                    js._customShow($elem);
                },
                hide:function($elem){
                    js._customHide($elem,{
                        'opacity': 0,
                        'width': 0,
                        'padding-left': 0,
                        'padding-right': 0
                    });
                }
            }
        };
    js._init=function($elem,hiddenCallback){
        $elem.removeClass('transition');
        init($elem,hiddenCallback);
    };
    js._customInit=function($elem,options){
        var styles={};
        for(var p in options){
            styles[p]=$elem.css(p);
        }
        $elem.data('styles',styles);
        js._init($elem,function(){
            $elem.css(options);
        });
    };
    js._show=function($elem,mode){
        show($elem,function(){
            $elem.stop()[mode](function(){//先停止进行的动画，再进行新的动画
                $elem.data('status','shown').trigger('shown');
            });
        })
    };
    js._customShow=function($elem){
        show($elem,function(){
            $elem.show();
            $elem.stop().animate($elem.data('styles'),function(){
                $elem.data('status','shown').trigger('shown');
            });
        
        });
    };
    js._hide=function($elem,mode){
        hide($elem,function(){
            $elem.stop()[mode](function(){//先停止进行的动画，再进行新的动画
                $elem.data('status','hidden').trigger('hidden');
            });
        })
    };
    js._customHide=function($elem,options){
        hide($elem,function(){
            $elem.stop().animate(options,function(){
                $elem.hide();
                $elem.data('status','hidden').trigger('hidden');
            });
        });
    };

    var defaults={
        css3:true,
        js:false,
        animation:'fade'
    };
    function showHide($elem,options){//通过综合后的参数，确认使用哪种动画方式，同时初始化dom，并返回含有方法的对象
        var mode=null;
        if(options.css3&&transition.isSupport){
            mode=css3[options.animation]||css3[defaults.animation];
        }else if(options.js){
            mode=js[options.animation]||js[defaults.animation];
        }else{
            mode=silent;
        }
        mode.init($elem);
        return {
            show:$.proxy(mode.show,this,$elem),
            hide:$.proxy(mode.hide,this,$elem),
        };
    }

    // 参数传递过程：
    // 用户自定义参数，
    // 自定义参数，判断类型，执行对应行为


    $.fn.extend({//1、jQuery的扩展函数
        //1 增加的方法或属性
        showHide:function(option){//参数：1、为空时：调用该方法；2、为对象时：传入自定义参数；3、为有效的字符串时：调用其暴露出来的子方法（子方法：也可通过父方法调用时传入参数）
        // 2 使用遍历，可以使类数组中的每个对象都调用该方法
        return this.each(function(index,elem){
                
                console.log( this);//值
                console.log( index);//索引
                console.log( elem);//值

                var $this=$(this),
                //3 extend()可以将后面的参数覆盖前面的参数（参数为数组或者对象），并返回新的参数
                // 输入：$.extend({a:1},[2],[3],4,5);
                // 输出：Object { 0: 3, a: 1 }
                options=$.extend({},defaults,typeof option==='object' && option);//判断自定义参数是否为空，然后以自定义、默认、新建空对象的从高到低的优先级将参数合并
                var mode=$this.data('showHide');//5 从data里捞取保存的数据（数据，可以是方法、属性值、对象等），此处为方法
                if(!mode){//如果data里没有数据
                    //就进行第一次的数据保存，
                    //4  此处保存showHide方法的返回值，含有方法的对象
                    $this.data('showHide',mode=showHide($this,options));
                }
                // option为自定义的传入参数，options为综合之后的参数
                //6 如果传入参数，为该对象暴露出来的方法名，则调用该方法
                if(typeof mode[option]==='function'){
                    // 子方法调用，可传入参数
                    mode[option]();
                }
            });
        }
    });
})(jQuery);
