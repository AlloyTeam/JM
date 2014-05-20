//event
J.$package(function(J){

    var $T=J.type,
        $S = J.support,
        win = window;

    // 如果是DOM事件，返回正确的事件名；否则返回布尔值 `false`
    var isDomEvent=function(obj,evtType){
        if(("on" + evtType).toLowerCase() in obj){
            return evtType;
        }
        else if($S.transitionend && (evtType === 'transitionend' || evtType === $S.transitionend)){
            return $S.transitionend;
        }
        return false;
    };
    // 封装绑定和解除绑定DOM事件的方法以兼容低版本IE
    var bindDomEvent = function(obj, evtType, handler){
        var oldHandler;
        if(obj.addEventListener){
            obj.addEventListener(evtType, handler, false);
        }
        else{
            evtType = evtType.toLowerCase();
            if(obj.attachEvent){
                obj.attachEvent('on' + evtType, handler);
            }
            else{
                oldHandler = obj['on' + evtType];
                obj['on' + evtType] = function(){
                    if(oldHandler){
                        oldHandler.apply(this, arguments);
                    }
                    return handler.apply(this, arguments);
                }
            }
        }
    };
    var unbindDomEvent = function(obj, evtType, handler){
        if(obj.removeEventListener){
            obj.removeEventListener(evtType, handler, false);
        }
        else{
            evtType = evtType.toLowerCase();
            if(obj.detachEvent){
                obj.detachEvent('on' + evtType, handler);
            }
            else{
                // TODO: 对特定handler的去除
                obj['on' + evtType] = null;
            }
        }
    };

    var $E={
        on:function(obj, evtType, handler){
            var tmpEvtType;
            if($T.isArray(obj)){
                for(var i=obj.length;i--;){
                    $E.on(obj[i], evtType, handler);
                }
                return;
            }
            //evtType is a string split by space
            if($T.isString(evtType)&&evtType.indexOf(" ")>0){
                evtType = evtType.split(" ");
                for(var i=evtType.length;i--;){
                    $E.on(obj, evtType[i], handler);
                }
                return;
            }
            //handler is an array
            if($T.isArray(handler)){
                for(var i=handler.length;i--;){
                    $E.on(obj, evtType, handler[i]);
                }
                return;
            }
            //evtType is an object
            if($T.isObject(evtType)){
                for(var eName in evtType){
                    $E.on(obj, eName, evtType[eName]);
                }
                return;
            }
            //is dom event support
            if(tmpEvtType = isDomEvent(obj,evtType)){
                evtType = tmpEvtType;
                bindDomEvent(obj, evtType, handler);
                return;
            }
            //dom event in origin element
            if(obj.elem && (tmpEvtType = isDomEvent(obj.elem,evtType))){
                evtType = tmpEvtType;
                bindDomEvent(obj.elem, evtType, handler);
                return;
            }
            //is specific custom event
            if(customEvent[evtType]){
                customEvent[evtType](obj,handler);
                return;
            }
            //other custom event
            if(!obj.events) obj.events={};
            if(!obj.events[evtType]) obj.events[evtType]=[];

            obj.events[evtType].push(handler);
            

        },
        once:function(obj,evtType,handler){
            var f = function(){
                handler.apply(win, arguments);
                $E.off(obj ,evtType ,f);
            }
            $E.on(obj ,evtType ,f);
        },
        off:function(obj,evtType,handler){
            //evtType is a string split by space
            if($T.isString(evtType)&&evtType.indexOf(" ")>0){
                evtType = evtType.split(" ");
                for(var i=evtType.length;i--;){
                    $E.off(obj, evtType[i], handler);
                }
                return;
            }
            //handler is an array
            if($T.isArray(handler)){
                for(var i=handler.length;i--;){
                    $E.off(obj, evtType, handler[i]);
                }
                return;
            }
            //evtType is an object
            if($T.isObject(evtType)){
                for(var eName in evtType){
                    $E.off(obj, eName, evtType[eName]);
                }
                return;
            }

            if(tmpEvtType = isDomEvent(obj,evtType)){
                evtType = tmpEvtType;
                unbindDomEvent(obj, evtType, handler);
                return;
            }    
            //dom event in origin element
            if(obj.elem && (tmpEvtType = isDomEvent(obj.elem,evtType))){
                evtType = tmpEvtType;
                unbindDomEvent(obj.elem, evtType, handler);
                return;
            }
            //is specific custom event
            if(customEvent[evtType]){
                customEvent._off(obj,evtType,handler);
                return;
            }    
            
            if(!evtType) {
                obj.events={}; 
                return;
            }
    
            if(obj.events){
                if(!handler) {
                    obj.events[evtType]=[];
                    return;
                }
                if(obj.events[evtType]){
                    var evtArr=obj.events[evtType];
                    for(var i=evtArr.length;i--;){
                        if(evtArr[i]==handler){
                            evtArr.splice(i,1);
                            return;
                        }
                    }
                }
            }
        },
        fire:function(obj,evtType){
            var arg = [].slice.call(arguments,2),
                tmpEvtType;
            //obj is dom element
            if(tmpEvtType = isDomEvent(obj,evtType)){
                evtType = tmpEvtType;
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(evtType, true, true);
                obj.dispatchEvent(evt);
                return;
            }
            //dom event in origin element
            if(obj.elem && (tmpEvtType = isDomEvent(obj.elem,evtType))){
                evtType = tmpEvtType;
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(evtType, true, true);
                obj.elem.dispatchEvent(evt);
                return;
            }
            if(obj.events&&obj.events[evtType]){
                var handler=obj.events[evtType];
                for(var i=0,l=handler.length;i<l;i++){
                    // if(!arg[0]) arg[0] = {};
                    // arg[0].type = evtType;
                    // try{ 
                        handler[i].apply(window,arg); 
                    // } catch(e){ window.console && console.log && console.log(e.message); };
                    
                }
            }
        },
        /**
         * 获取点击的事件源, 该事件源是有 cmd 属性的 默认从 event.target 往上找三层,找不到就返回null
         * 
         * @param {Event}
         *            event
         * @param {Int}
         *            level 指定寻找的层次
         * @param {String}
         *            property 查找具有特定属性的target,默认为cmd
         * @param {HTMLElement} parent 指定查找结束点, 默认为document.body
         * @return {HTMLElement} | null
         */
        getActionTarget : function(event, level, property, parent){
            var t = event.target,
                l = level || 3,
                s = level !== -1,
                p = property || 'cmd',
                end = parent || document.body;
            if(t === end){
                return t.getAttribute(p) ? t : null;
            }
            while(t && (t !== end) && (s ? (l-- > 0) : true)){
                if(t.getAttribute(p)){
                    return t;
                }else{
                    t = t.parentNode;
                }
            }
            return null;
        },
        /**
         * @example
         * bindCommands(cmds);
         * bindCommands(el, cmds);
         * bindCommands(el, 'click', cmds);
         * 
         * function(param, target, event){
         * }
         */
        bindCommands : function(targetElement, eventName, commands, commandName){
            var defaultEvent = J.platform.touchDevice ? "tap":"click";
            if(arguments.length === 1){
                commands = targetElement;
                targetElement = document.body;
                eventName = defaultEvent;
            }else if(arguments.length === 2){
                commands = eventName;
                eventName = defaultEvent;
            }
            if(!targetElement._commands){
                targetElement._commands = {};
            }
            if(targetElement._commands[eventName]){//已经有commands 就合并
                J.extend(targetElement._commands[eventName], commands);
                return;
            }
            targetElement._commands[eventName] = commands;
            commandName = commandName || 'cmd';
            if(!targetElement.getAttribute(commandName)){
                targetElement.setAttribute(commandName, 'void');
            }
            J.event.on(targetElement, eventName, function(e){
                var target = J.event.getActionTarget(e, -1, commandName, this.parentNode);
                if(target){
                    var cmd = target.getAttribute(commandName);
                    var param = target.getAttribute('param');
                    if(target.href && target.getAttribute('href').indexOf('#') === 0){
                        e.preventDefault();
                    }
                    if(this._commands[eventName][cmd]){
                        this._commands[eventName][cmd](param, target, e);
                    }
                }
            });
        }

    };

    var startEvt,moveEvt,endEvt;
    //选择不同事件
    if(J.platform.touchDevice){
        startEvt="touchstart";
        moveEvt="touchmove";
        endEvt="touchend";
    }
    else{
        startEvt="mousedown";
        moveEvt="mousemove";
        endEvt="mouseup";            
    }

    var getTouchPos = function(e){
        var t = e.touches;
        if(t && t[0]) {
            return { x : t[0].clientX , y : t[0].clientY };
        }
        return { x : e.clientX , y: e.clientY };
    }
    //计算两点之间距离
    var getDist = function(p1 , p2){
        if(!p1 || !p2) return 0;
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));

    }
    //计算两点之间所成角度
    var getAngle = function(p1 , p2){
        var r = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a = r * 180 / Math.PI;
        return a;
    };


    var customEventHandlers = [];
    var isCustomEvtMatch = function(ch,ele,evtType,handler){
        return ch.ele == ele && evtType == ch.evtType && handler == ch.handler
    }
    //自定义事件
    var customEvent = {
        _fire:function(ele,evtType,handler){
            J.each(customEventHandlers,function(ch){
                if(isCustomEvtMatch(ch,ele,evtType,handler)){
                    handler.call(ele,{
                        type:evtType
                    });
                }
            });            
        },
        _off:function(ele,evtType,handler){
            J.each(customEventHandlers,function(ch,i){
                var at = ch.actions;
                if(isCustomEvtMatch(ch,ele,evtType,handler)){
                    //删除辅助处理程序
                    for(var n in at){
                        var h = at[n];
                        if($T.isObject(h)){
                            //非绑定在该元素的handler
                            $E.off(h.ele ,n ,h.handler);
                        }
                        else{
                            $E.off(ele ,n ,h);
                        }
                    }
                    //删除本处理程序数据
                    customEventHandlers.splice(i,1);
                    return;
                }
            });
        },
        tap:function(ele,handler){
            //按下松开之间的移动距离小于20，认为发生了tap
            var TAP_DISTANCE = 20;
            //双击之间最大耗时
            var DOUBLE_TAP_TIME = 300;
            var pt_pos;
            var ct_pos;
            var pt_up_pos;
            var pt_up_time;
            var evtType;
            var startEvtHandler = function(e){
                // e.stopPropagation();
                var touches = e.touches;
                if(!touches || touches.length == 1){//鼠标点击或者单指点击
                    ct_pos = pt_pos = getTouchPos(e);
                }
            }
            var moveEvtHandler = function(e){
                // e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            }
            var endEvtHandler = function(e){
                // e.stopPropagation();
                var now = Date.now(); 
                var dist = getDist(ct_pos , pt_pos);
                var up_dist = getDist(ct_pos , pt_up_pos);

                if(dist < TAP_DISTANCE){
                    if(pt_up_time && now - pt_up_time < DOUBLE_TAP_TIME && up_dist < TAP_DISTANCE){
                        evtType = "doubletap";
                    }
                    else{
                        evtType = "tap";
                    }
                    handler.call(ele,{
                        target:e.target,
                        oriEvt:e,
                        type:evtType
                    });
                }
                pt_up_pos = ct_pos;
                pt_up_time = now;
            }
        
            $E.on(ele,startEvt,startEvtHandler);
            $E.on(ele,moveEvt,moveEvtHandler);
            $E.on(ele,endEvt,endEvtHandler);

            var evtOpt = {
                ele:ele,
                evtType:"tap",
                handler:handler
            }
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;

            customEventHandlers.push(evtOpt);
            
        },
        hold:function(ele,handler){
            //按下松开之间的移动距离小于20，认为点击生效
            var HOLD_DISTANCE = 20;
            //按下两秒后hold触发
            var HOLD_TIME = 2000;
            var holdTimeId;
            var pt_pos;
            var ct_pos;
            var startEvtHandler = function(e){
                e.stopPropagation();
                var touches = e.touches;
                if(!touches || touches.length == 1){//鼠标点击或者单指点击
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();

                    holdTimeId = setTimeout(function(){
                        if(touches && touches.length != 1) return;
                        if(getDist(pt_pos,ct_pos) < HOLD_DISTANCE){
                            handler.call(ele,{
                                oriEvt:e,
                                target:e.target,
                                type:"hold"
                            });
                        }
                    },HOLD_TIME);
                }
            }
            var moveEvtHandler = function(e){
                e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            }
            var endEvtHandler = function(e){
                e.stopPropagation();
                clearTimeout(holdTimeId);
            }
                
            $E.on(ele,startEvt,startEvtHandler);
            $E.on(ele,moveEvt,moveEvtHandler);
            $E.on(ele,endEvt,endEvtHandler);    

            var evtOpt = {
                ele:ele,
                evtType:"hold",
                handler:handler
            }
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;

            customEventHandlers.push(evtOpt);    
        },
        swipe:function(ele,handler){
            //按下之后移动30px之后就认为swipe开始
            var SWIPE_DISTANCE = 30;
            //swipe最大经历时间
            var SWIPE_TIME = 500;
            var pt_pos;
            var ct_pos;
            var pt_time;
            var pt_up_time;
            var pt_up_pos;
            //获取swipe的方向
            var getSwipeDirection = function(p2,p1){
                var angle = getAngle(p1, p2);

                if(angle < 45 && angle > -45) return "right";
                if(angle >= 45 && angle < 135) return "top";
                if(angle >= 135 || angle < -135) return "left";
                if(angle >= -135 && angle <= -45) return "bottom";

            }
            var startEvtHandler = function(e){
                // e.stopPropagation();
                var touches = e.touches;
                if(!touches || touches.length == 1){//鼠标点击或者单指点击
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();

                }
            }
            var moveEvtHandler = function(e){
                // e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            }
            var endEvtHandler = function(e){
                // e.stopPropagation();
                var dir;
                pt_up_pos = ct_pos;
                pt_up_time = Date.now();

                if(getDist(pt_pos,pt_up_pos) > SWIPE_DISTANCE && pt_up_time - pt_time < SWIPE_TIME){
                    dir = getSwipeDirection(pt_up_pos,pt_pos);
                    handler.call(ele,{
                        oriEvt:e,
                        target:e.target,
                        type:"swipe",
                        direction:dir
                    });
                }
            }    

            $E.on(ele,startEvt,startEvtHandler);
            $E.on(ele,moveEvt,moveEvtHandler);
            $E.on(ele,endEvt,endEvtHandler);    

            var evtOpt = {
                ele:ele,
                evtType:"swipe",
                handler:handler
            }
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;

            customEventHandlers.push(evtOpt);                
        },
        transform:function(ele,handler){
            var pt_pos1;
            var pt_pos2;
            var pt_len;//初始两指距离
            var pt_angle;//初始两指所成角度
            var startEvtHandler = function(e){
                var touches = e.touches;
                if(!touches) return;

                if(touches.length == 2){//双指点击
                    pt_pos1 = getTouchPos( e.touches[0]);
                    pt_pos2 = getTouchPos( e.touches[1]);
                    pt_len = getDist(pt_pos1,pt_pos2);
                    pt_angle = getAngle(pt_pos1,pt_pos2);
                }
            }
            var moveEvtHandler = function(e){
                e.preventDefault();
                var touches = e.touches;
                if(!touches) return;
                if(touches.length == 2){//双指点击

                    var ct_pos1 = getTouchPos( e.touches[0]);
                    var ct_pos2 = getTouchPos( e.touches[1]);
                    var ct_len = getDist(ct_pos1 , ct_pos2);
                    var ct_angle = getAngle(ct_pos1,ct_pos2);
                    var scale = ct_len / pt_len; 
                    var rotation = ct_angle - pt_angle;

                    handler.call(ele,{
                        oriEvt:e,
                        target:e.target,
                        type:"transform",
                        scale:scale,
                        rotate:rotation
                    });
                }
            }

            $E.on(ele,startEvt,startEvtHandler);
            $E.on(ele,moveEvt,moveEvtHandler);
            var evtOpt = {
                ele:ele,
                evtType:"transform",
                handler:handler
            }
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;

            customEventHandlers.push(evtOpt);        
        },
        scrollstart:function(ele,handler){
            var isScrolling;
            var scrollTimeId;
            var scrollHandler = function(e){
                if(!isScrolling){
                    isScrolling = true;
                    handler.call(ele,{
                        oriEvt:e,
                        target:e.target,
                        type:"scrollstart"
                    });
                }
                clearTimeout(scrollTimeId);
                scrollTimeId = setTimeout(function(){
                    isScrolling = false;
                },250);
            }    

            $E.on(ele,"scroll",scrollHandler);    

            var evtOpt = {
                ele:ele,
                evtType:"scrollstart",
                handler:handler
            };    
            evtOpt.actions = {};
            evtOpt.actions["scroll"] = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        scrollend:function(ele,handler){
            var scrollTimeId;
            var scrollHandler = function(e){
                clearTimeout(scrollTimeId);
                scrollTimeId = setTimeout(function(){
                    handler.call(ele,{
                        oriEvt:e,
                        target:e.target,
                        type:"scrollend"
                    });        
                },250);
            }    
            $E.on(ele,"scroll",scrollHandler);        

            var evtOpt = {
                ele:ele,
                evtType:"scrollend",
                handler:handler
            };    
            evtOpt.actions = {};
            evtOpt.actions["scroll"] = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        scrolltobottom:function(ele,handler){
            var body = document.body;
            var scrollHandler = function(e){
                if(body.scrollHeight <= body.scrollTop + window.innerHeight){
                    handler.call(ele,{
                        oriEvt:e,
                        target:e.target,
                        type:"scrolltobottom"
                    });

                }
            }
            $E.on(ele,"scroll",scrollHandler);    

            var evtOpt = {
                ele:ele,
                evtType:"scrolltobottom",
                handler:handler
            };    
            evtOpt.actions = {};
            evtOpt.actions["scroll"] = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        //兼容性更好的orientationchange事件，这里使用resize实现。不覆盖原生orientation change 和 resize事件
        ortchange:function(ele,handler){
            var pre_w = window.innerWidth;
            var resizeHandler = function(e){
                var current_w = window.innerWidth,
                    current_h = window.innerHeight,
                    orientation;

                if(pre_w == current_w) return;
                if(current_w > current_h){
                    orientation = "landscape";
                }
                else{
                    orientation = "portrait";
                }
                handler.call(ele,{
                    oriEvt:e,
                    target:e.target,
                    type:"ortchange",
                    orientation:orientation
                });
                pre_w = current_w;
            }
            $E.on(window,"resize",resizeHandler);

            var evtOpt = {
                ele:ele,
                evtType:"ortchange",
                handler:handler
            };    
            evtOpt.actions = {};
            evtOpt.actions["resize"] = resizeHandler;
            customEventHandlers.push(evtOpt);
        }
    }

    var transitionEndNames = [
        'transitionend',
        'webkitTransitionEnd',
        'MozTransitionEnd',
        'MSTransitionEnd'
    ];

    J.event = $E;
});