//util
J.$package(function(J){
    var $D = J.dom,
        $E = J.event,
        $T = J.type;

    var preventScroll = function(e){
        if (e.target.type === 'range') { return; }
            e.preventDefault();
    }
    var hideScroll = function(){
        setTimeout(function(){
            if(!location.hash){
                var ph = window.innerHeight + 60;
                if(document.documentElement.clientHeight < ph){
                    $D.setStyle(document.body,"minHeight", ph + "px");
                }
                window.scrollTo(0,1);
            }
        },200);
    }
        

    var util = {
        /**
         * 隐藏Url栏
         * 
         * @name hideUrlBar
         * @function
         * @memberOf J.util
         */
        hideUrlBar:function(){
            $E.on(window ,"load" ,hideScroll);
        },
        /**
         * 禁止滚动
         * 
         * @name preventScrolling
         * @function
         * @memberOf J.util
         */
        preventScrolling : function() {
             $E.on(document ,'touchmove' ,preventScroll);
        },
        /**
         * 启用滚动
         * 
         * @name activeScrolling
         * @function
         * @memberOf J.util
         */
        activeScrolling:function(){
            $E.off(document ,'touchmove' ,preventScroll);
        },
        /**
         * 滚动到顶部动画(css3动画)
         * 
         * @name activeScrolling
         * @function
         * @memberOf J.util
         */
        scrollToTop:function(duration,runType){
            var $A = J.Animation;
            var body = document.body;
            var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            $D.setStyle(body, $D.getVendorPropertyName("transform"), "translate3d(0,"+ (- scrollTop) + "px,0)");
            body.scrollTop ? body.scrollTop = 0:document.documentElement.scrollTop = 0;    
        
            new $A({
                selector:body,
                duration:duration,
                runType:runType,
                use3d:true
            }).translateY(0).transit();
        
        },
        /**
         * 兼容浏览器的fixed定位
         * 
         * @name fixElement
         * @function
         * @memberOf J.util
         */
        fixElement:function(ele,options){
            var iu = $T.isUndefined;
            var wh = window.innerHeight;
            var ww = window.innerWidth;
            var eh = ele.clientHeight;
            var ew = ele.clientWidth;
            var top;
            var left;

            //支持原生fixed
            if(J.support.fixed){
                $D.setStyle(ele,{
                    position:"fixed",
                    top:options.top + "px",
                    left:options.left + "px",
                    bottom:options.bottom + "px",
                    right:options.right + "px"
                });
                return;
            }
            //fixed模拟
            $E.on(window,"scrollend",function(){

                top = window.pageYOffset + ( iu(options.top) ? (iu(options.bottom) ? "" : wh - options.bottom - eh) : options.top );
                left = window.pageXOffset + ( iu(options.left) ? (iu(options.right) ? "" : ww - options.right - ew) : options.left );
            
                $D.setStyle(ele,{
                    position:"absolute",
                    top:top + "px",
                    left:left + "px"
                });
            });
        }
        //hover效果
        // hoverEffect:function(ele,className){
        //     var startEvt,moveEvt,endEvt;
        //     var touchDevice = J.platform.touchDevice;
        //     var upTarget;

        //     //选择不同事件
        //     if(touchDevice){
        //         startEvt="touchstart";
        //         moveEvt="touchmove";
        //         endEvt="touchend";
        //         upTarget = ele;
        //     }
        //     else{
        //         startEvt="mousedown";
        //         moveEvt="mousemove";
        //         endEvt="mouseup";    
        //         upTarget = document.body;    
        //     }
        //     $E.on(ele,startEvt,function(){
        //         $D.addClass(ele,className);
        //     });
        //     $E.on(ele,moveEvt,function(e){
        //         e.preventDefault();
        //     });
        //     $E.on(upTarget,endEvt,function(){
        //         $D.removeClass(ele,className);
        //     });
        // }
        
    }
    J.util = util;
});
