(function($){
    'use strict';


    var cache={
        data:{},
        count:0,
        addData:function(key,data){
            if(!this.data[key]){
                this.data[key]=data;
                this.count++;
            }
        },
        readData:function(key){
            return this.data[key];
        },
        deleteDataByKey:function(key){
            delete this.data[key];
            this.count--;
        },
        deleteDataByOrder:function(num){
            var count=0;
            for(var p in this.data){
                if(count>=num){
                    break;
                }
                count++;
                this.deleteDataByKey(p);
            }
        },
    };
    
    
    
    function Search($elem,options){
        this.$elem=$elem;
        this.$form=this.$elem.find('.search-form'),
        this.$input=this.$elem.find('.search-inputbox'),
        this.$layer=this.$elem.find('.search-layer'),
        this.options=options,
        this.loaded=false;

        // console.log(options);

        this.$elem.on('click','.search-btn',$.proxy(this.submit,this));
        if (this.options.autocomplete) {
            this.autocomplete();
        }
    }

    Search.DEFAULTS={
        autocomplete:false,
        url:'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1563458384133_752&callback=jsonp753&k=1&area=c2c&bucketid=17&q=',
        css3:false,
        js:false,
        animation:'fade',
        getDataInterval:200
    };
    
    Search.prototype.submit=function(){
        if(this.getInputVal()===''){
            return false;
        }
        this.$form.submit();
    };    
    Search.prototype.autocomplete=function(){
        var timer=null;
        var self=this;
        this.$input
            .on('input',function(){
                clearTimeout(timer);
                if(self.options.getDataInterval){
                    timer=setTimeout(function(){
                        self.getData();
                    },self.options.getDataInterval);
                }else{
                    self.getData();
                }
            })
            .on('focus',$.proxy(this.showLayer,this))
            .on('click',function(){
                return false;
            });
        this.$layer.showHide(this.options);
        $(document).on('click',$.proxy(this.hideLayer,this));
    };    
    Search.prototype.getData=function(){
        var self=this,
            inputVal=this.getInputVal();

        if(inputVal==='') return self.$elem.trigger('search-noData');
        // 判断缓存中有无数据，无数据再进行ajax请求
        if(cache.readData(inputVal)) return self.$elem.trigger('search-getData',[cache.readData(inputVal)]);

        if(this.jqXHR) this.jqXHR.abort();
        this.jqXHR=$.ajax({
            url:this.options.url+inputVal,
            dataType:'jsonp'
        }).done(function(data){
            // console.log(self.options.url);
            cache.addData(inputVal,data);
            console.log(cache.data);
            console.log(cache.count);
            self.$elem.trigger('search-getData',[data]);
        }).fail(function(){
            self.$elem.trigger('search-noData');
        }).always(function(){
            self.jqXHR=null;
        });
    };    
    Search.prototype.showLayer=function(){
        if(!this.loaded) return;
        this.$layer.showHide('show');
    };    
    Search.prototype.hideLayer=function(){
        this.$layer.showHide('hide');
    };  
    Search.prototype.getInputVal=function(){
        return $.trim(this.$input.val());
    };      
    Search.prototype.setInputVal=function(val){
        this.$input.val(removeHtmlTags(val));
    };     
    Search.prototype.appendLayer=function(html){
        this.$layer.html(html);
        this.loaded=!!html;
    };
    // 去除返回的data里带有的HTML结构
    function removeHtmlTags(str){
        return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g,'');
    }  

    $.fn.extend({
        search:function(option,value){
            // console.log("search()");
            return this.each(function(){
                var $this=$(this),
                    search=$this.data('search'),
                    options=$.extend({},Search.DEFAULTS,$this.data(),typeof option==='object'&& option);//$this.data()获取data-的对象，active的数值
                // console.log(search);
                // console.log(options);
                if(!search){
                    $this.data('search',search=new Search($this,options));
                    // console.log(search);
                }
                if(typeof search[option]==='function'){
                    search[option](value);
                }
            })
        }
    });
})(jQuery);



// (function($){
//     'use strict';

//     var $search=$('.search'),
//         $form=$search.find('.search-form'),
//         $input=$search.find('.search-inputbox'),
//         $btn=$search.find('.search-btn'),
//         $layer=$search.find('.search-layer');
//     // 提交时验证功能
//     // $btn.on('click',function(){
//     //     if($.trim($input.val())===''){
//     //         return false;
//     //     }
//     // });
//     // 当表单提交时，做验证，无论是按钮触发或者是js触发
//     $form.on('submit',function(){
//         if($.trim($input.val())===''){
//             return false;
//         }
//     });

//     // 自动完成功能
//     $input.on('input',function(){
//         var url='https://suggest.taobao.com/sug?code=utf-8&_ksTS=1563458384133_752&callback=jsonp753&k=1&area=c2c&bucketid=17&q='+encodeURIComponent($.trim($input.val()));
//         $.ajax({
//             url:url,
//             dataType:'jsonp'
//         }).done(function(data){
//             var html='',
//                 dataNum=data['result'].length,
//                 maxNum=6;
//             if(dataNum===0){
//                 $layer.hide().html('');
//                 return; 
//             }
//             for(var i=0;i<dataNum;i++){
//                 if(i>=maxNum) break;
//                 html+='<li class="search-layer-item text-ellipsis">'+data['result'][i][0]+'</li>';
//                 $layer.html(html).show();
//             }
//             console.log(data);
//         }).fail(function(){
//             $layer.hide().html('');
//             console.log('fail');
//         }).always(function(){
//             console.log('always');
//         });
//     });

//     $layer.on('click','.search-layer-item',function(){
//         $input.val(removeHtmlTag($(this).html()));
//         $form.submit();
//     });
//     $input.on('focus',function(){
//         $layer.show();
//     }).on('click',function(){
//         return false;
//     });
//     $(document).on('click',function(){
//         $layer.hide();
//     });
//     // 去除返回的data里带有的HTML结构
//     function removeHtmlTag(str){
//         return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g,'');
//     }
    
// })(jQuery);