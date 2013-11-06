//support
J.$package(function(J){
    var win = window,
        doc = win.document,
        nav = win.navigator,
        $D = J.dom,
        $E = J.event;
    var support = {
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
        // 如果支持 `transitionend` 事件返回真正的事件名，如果不支持，返回布尔值 `false`
        // 检测结果可能需要异步进行，所以不要缓存此检测结果，每次需要用到此事件时再访问
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
        // 如果支持 `audio` 标签，返回一个对象，其属性有ogg, mp3, wav, m4a，表示这些格式的支持情况。
        // 可能的属性值有 `"", "maybe", "probably"` ，
        // 分别表示不支持，可能支持，很可能支持
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
        // 是否安装了flash插件
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