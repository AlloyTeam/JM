//support
J.$package(function(J){
    var win = window,
        doc = win.document,
        nav = win.navigator,
        $D = J.dom,
        $E = J.event;
    var support = {
        /**
         * 判断是否支持fixed
         * 
         * @name fixed
         * @function
         * @memberOf J.support
         * @return {boolean} 是否支持fixed
         */  
        fixed:(function(){
            var container = document.body;
            var el = $D.node('div');                
            $D.setStyle(el,{
                position:"fixed",
                top:"100px"
            });
            container.appendChild(el);

            var originalHeight = container.style.height,
                originalScrollTop = container.scrollTop;

            $D.setStyle(container,"height","3000px");
            container.scrollTop = 500;

            var elementTop = el.getBoundingClientRect().top;
            if(originalHeight)
                $D.setStyle(container,"height",originalHeight + "px");
            else
                $D.setStyle(container,"height","");

            container.removeChild(el);
            container.scrollTop = originalScrollTop;
            return elementTop === 100;
        })(),
        /**
         * 判断是否支持transitionend并返回可用事件名
         * 
         * @name transitionend
         * @function
         * @memberOf J.support
         * @return {string} 可用事件名
         */  
        transitionend: (function(){
            var ret, endEventNames, div, handler, i;

            if('ontransitionend' in win){
                return 'transitionend';
            }
            else if('onwebkittransitionend' in win){
                return 'webkitTransitionEnd';
            }
            // IE10+
            else if('transition' in doc.body.style){
                return 'transitionend';
            }
            // 模拟transition，异步得出检测结果
            else if('addEventListener' in win){
                endEventNames = [
                    'transitionend',
                    'webkitTransitionEnd',
                    'MozTransitionEnd',
                    'MSTransitionEnd',
                    'otransitionend',
                    'oTransitionEnd'
                ];
                div = doc.createElement('div');
                handler = function(e){
                    var i = endEventNames.length;
                    while(i--){
                        this.removeEventListener(endEventNames[i], handler);
                    }
                    support.transitionend = e.type;
                    handler = null;
                };
                $D.setStyle(div, {
                    'position': 'absolute',
                    'top': '0px',
                    'left': '-99999px',
                    'transition': 'top 1ms',
                    'WebkitTransition': 'top 1ms',
                    'MozTransition': 'top 1ms',
                    'MSTransitionEnd': 'top 1ms',
                    'OTransitionEnd': 'top 1ms'
                });
                i = endEventNames.length;
                while(i--){
                    div.addEventListener(endEventNames[i], handler, false);
                }
                doc.documentElement.appendChild(div);
                setTimeout(function(){
                    div.style.top = '100px';
                    setTimeout(function(){
                        div.parentNode.removeChild(div);
                        div = null;
                        handler = null;
                    }, 100);
                }, 0);
            }
            return false;
        })(),
        /**
         * 判断支持的audio格式列表
         * 
         * @name audio
         * @function
         * @memberOf J.support
         * @return {Object} 可用audio格式列表
         */  
        audio: (function(){
            var elem = document.createElement('audio'),
                result,
                NOT_SUPPORT_RE = /^no$/i,
                EMPTY_STR = '';

            try{
                if(elem.canPlayType){
                    result = {};
                    result.mp3 = elem.canPlayType('audio/mpeg;').replace(NOT_SUPPORT_RE, EMPTY_STR);
                    result.wav = elem.canPlayType('audio/wav; codecs="1"').replace(NOT_SUPPORT_RE, EMPTY_STR);
                    result.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(NOT_SUPPORT_RE, EMPTY_STR);
                    result.m4a = (elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;')).replace(NOT_SUPPORT_RE, EMPTY_STR);
                }
            }
            catch(e){}

            return result;
        })(),
        /**
         * 判断是否安装了flash插件
         * 
         * @name flash
         * @function
         * @memberOf J.support
         * @return {boolean} 是否安装了flash插件
         */  
        flash: (function() {
            if(nav.plugins && nav.plugins.length && nav.plugins['Shockwave Flash']){
                return true;
            }
            else if(nav.mimeTypes && nav.mimeTypes.length){
                var mimeType = nav.mimeTypes['application/x-shockwave-flash'];
                return mimeType && mimeType.enabledPlugin;
            }
            else{
                var ax;
                try{
                    if(ActiveXObject){
                        ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                        return true;
                    }
                }
                catch(e){}
            }
            return false;
        })()
    }
    J.support = support;
});