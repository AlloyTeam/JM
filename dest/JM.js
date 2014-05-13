//animation time, runType ,scale, rotate, rotateX, rotateY, translateX, translateY, skewX, skewY
J.$package(function(J){
    var $D = J.dom,
        $E = J.event,
        $T = J.type;
    
     //3d支持
     var support3d = $D.isSupprot3d();
     var finishedCount = 0;

    var Animation = J.Class({
        init:function(options){
        
            this.setElems(options.selector);
            this.setDuration(options.duration || 1000);
            this.setRunType(options.runType || "ease-in-out");
            this.setDelay(options.delay || 0);
            this.setUsed3d(options.use3d);
            this.transformArr = [];
        },
        setDuration:function(duration){
            this.duration = duration;
            return this;
        },
        setDelay:function(delay){
            this.delay = delay;
            return this;
        },
        setElems:function(selector){
            if($T.isString(selector)){
                this.elems = $D.$(selector);
            }
            else if($T.isArray(selector)){
                this.elems = selector;
            }
            else if(selector.tagName){
                this.elems = [selector];
            }
            return this;
        },
        setRunType:function(runType){
            this.runType = runType;
            return this;
        },
        setUsed3d:function(use3d){
            this.use3d = use3d;
            return this;
        },
        scale:function(scale){
            this.transformArr.push("scale(" + scale + ")");
            return this;
        },
        scaleX:function(scaleX){
            this.transformArr.push("scalex(" + scaleX + ")");
            return this;
        },
        scaleY:function(scaleY){
            this.transformArr.push("scaley(" + scaleY + ")");
            return this;
        },
        rotate:function(rotate){
            this.transformArr.push("rotate(" + rotate + "deg)");
            return this;
        },
        rotateX:function(rotateX){
            this.transformArr.push("rotatex(" + rotateX + "deg)");
            return this;
        },
        rotateY:function(rotateX){
            this.transformArr.push("rotatey(" + rotateY + "deg)");
            return this;
        },
        rotateZ:function(rotateZ){
            this.transformArr.push("rotatez(" + rotateZ + "deg)");
            return this;
        },
        translate:function(translateX,translateY,translateZ){
            if(support3d && translateZ)
                this.transformArr.push("translate3d" + '(' + translateX + ',' + translateY + ','+ translateZ +')');
            else
                this.transformArr.push("translate" + '(' + translateX + ',' + translateY + ')');
            return this;
        },
        translateX:function(translateX){
            this.translate(translateX,0);
            return this;
        },
        translateY:function(translateY){
            this.translate(0,translateY);
            return this;
        },    
        skew:function(x,y){
            this.transformArr.push("skew(" + x + "deg," + y + "deg)");
            return this;
        },
        skewX:function(x){
            this.transformArr.push("skewx(" + x + "deg)");
            return this;
        },    
        skewY:function(y){
            this.transformArr.push("skewy(" + y + "deg)");
            return this;
        },    
        setStyle:function(styleName,styleValue){
            var s = "";
            if($T.isUndefined(this.styleStr)) this.styleStr = "";
            //样式变化
            if($T.isObject(styleName)){
                J.each(styleName ,function(sv,sn){
                    s += $D.toCssStyle($D.getVendorPropertyName(sn)) + ":" + sv + ";";
                });
            }
            else if($T.isString(styleName)){
                s += $D.toCssStyle($D.getVendorPropertyName(styleName)) + ":" + styleValue + ";";
            }
            this.styleStr += s;
            return this;
            
        },
        toOrigin:function(){
            this.transformArr = [];
            return this;
        },
        transit:function(onFinished){
            var self = this;
            var elems = this.elems;
            J.each(elems ,function(e){
                self._transit(e);
            });
            window.setTimeout(function(){
                $E.fire(self,"end");
                J.each(elems,function(elem){
                    $D.setStyle(elem ,$D.getVendorPropertyName("transition") ,"");
                });
                onFinished && onFinished.call(self);
            },this.duration);
            return this;
        },
        _transit:function(elem){
        
            var self = this;
            var transformStr = this.transformArr.join(" ");
            if(support3d && this.use3d){
                transformStr += " translatez(0)";
            }

            var aStr =  "all"
                        + ' ' + this.duration/1000 + 's ' 
                        + this.runType
                        + ' ' + this.delay/1000 + 's';
                
            $D.setStyle(elem ,$D.getVendorPropertyName("transition") ,aStr);
            
            elem.style[$D.getVendorPropertyName("transform")] = transformStr;
            elem.style.cssText += this.styleStr;

            $E.fire(this ,"start");
        }
    });
    J.Animation = Animation;
});;J.$package('J', function(J){ 
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        $B = J.browser;

    var AUDIO_OBJECT = '../../../audio/jmAudioObject.swf',
        EMPTY_FUNC = function(){ return 0; },
        AUDIO_MODE = {
            NONE : 0,
            NATIVE : 1,
            WMP : 2,
            FLASH : 3,
            MOBILE : 4
        };

    var BaseAudio = J.Class({
        init : function(){ throw 'BaseAudio does not implement a required interface'; },
        play : EMPTY_FUNC,
        pause : EMPTY_FUNC,
        stop : EMPTY_FUNC,

        getVolume : EMPTY_FUNC,
        setVolume : EMPTY_FUNC,
        getLoop : EMPTY_FUNC,
        setLoop : EMPTY_FUNC,
        setMute : EMPTY_FUNC,
        getMute : EMPTY_FUNC,
        getPosition : EMPTY_FUNC,
        setPosition : EMPTY_FUNC,

        getBuffered : EMPTY_FUNC,
        getDuration : EMPTY_FUNC,
        free : EMPTY_FUNC,

        on : EMPTY_FUNC,
        off : EMPTY_FUNC
    });

    /**
     * @ignore
     */
    var audioModeDetector = function(){
        // if(0){
        if(window.Audio && (new Audio).canPlayType('audio/mpeg')){ //支持audio
            if((/\bmobile\b/i).test(navigator.userAgent)){
                return AUDIO_MODE.MOBILE;
            }
            return AUDIO_MODE.NATIVE;
        }else if(J.browser.plugins.flash>=9){ //支持flash控件
            return AUDIO_MODE.FLASH;
        }else if(!!window.ActiveXObject && (function(){
                try{
                    new ActiveXObject("WMPlayer.OCX.7");
                }catch(e){
                    return false;
                }
                return true;
            })()){ //支持wmp控件
            return AUDIO_MODE.WMP;
        }else{
            return AUDIO_MODE.NONE; //啥都不支持
        }
    };

    var getContainer = function(){
        var _container;
        return function(mode){
            if(!_container){
                var node = document.createElement('div');
                node.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;margin:0;padding:0;left:0;top:0;';
                (document.body || document.documentElement).appendChild(node);
                if(mode == AUDIO_MODE.FLASH){
                    node.innerHTML = '<object id="jmAudioObject" name="jmAudioObject" ' + 
                        (J.browser.ie ?
                            'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' :
                            'type="application/x-shockwave-flash" data="' + AUDIO_OBJECT + '"') +
                        ' width="1" height="1" align="top"><param name="movie" value="' +
                        AUDIO_OBJECT + '" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="quality" value="high" /><param name="wmode" value="opaque" /></object>';
                    _container = J.dom.id('jmAudioObject') || window['jmAudioObject'] || document['jmAudioObject'];
                }else{
                    _container = node;
                }
            }
            return _container;
        }
    }();
    var getSequence = function(){
        var _seq = 0;
        return function(){
            return _seq++;
        }
    }();

    var audioMode = audioModeDetector();
    switch(audioMode){
        case AUDIO_MODE.NATIVE:
        case AUDIO_MODE.MOBILE:
            var NativeAudio = J.Class({extend:BaseAudio},{
                init : function(option){
                    option = option || {};
                    var el = this._el = new Audio();
                    el.loop = Boolean(option.loop); //default by false
                    /*el.autoplay = option.autoplay !== false; //defalut by true*/
                    if(option.src){
                        // el.src = option.src;
                        this.play(option.src);
                    }
                },
                play : function(url){
                    if(url){
                        this._el.src = url;
                    }
                    if(this._el.paused){
                        this._el.play();
                    }
                },
                pause : function(){
                    this._el.pause();
                },
                stop : function(){
                    this._el.currentTime = Infinity;
                },

                getVolume : function(){
                    return !this._el.muted && this._el.volume || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        this._el.volume = Math.max(0,Math.min(value,1));
                        this._el.muted = false;
                    }
                },
                getLoop : function(){
                    return this._el.loop;
                },
                setLoop : function(value){
                    this._el.loop = value !== false;
                },
                /*getAutoplay : function(){
                    return thie._el.autoplay;
                },
                setAutoplay : function(value){
                    this._el.autoplay = value !== false;
                },*/
                getMute : function(){
                    return this._el.muted;
                },
                setMute : function(value){
                    this._el.muted = value !== false;
                },
                getPosition : function(){
                    return this._el.currentTime;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        this._el.currentTime = Math.max(0,value);
                    }
                },
                getBuffered : function(){
                    return this._el.buffered.length && this._el.buffered.end(0) || 0;
                },
                getDuration : function(){
                    return this._el.duration;
                },
                free : function(){
                    this._el.pause();
                    this._el = null;
                },
                on : function(event, handler){
                    this._el.addEventListener(event,handler,false);
                },
                off : function(event, handler){
                    this._el.removeEventListener(event,handler,false);
                }
            });
            if(audioMode = AUDIO_MODE.NATIVE){
                J.Audio = NativeAudio;
                break;
            }
            var playingStack = [];
            var stackPop = function(){
                var len = playingStack.length;
                playingStack.pop().off('ended', stackPop);
                if(len >= 2){
                    playingStack[len - 2]._el.play();
                }
            };
            J.Audio = J.Class({extend:NativeAudio},{
                init : function(option){
                    NativeAudio.prototype.init.call(this, option);
                },
                play : function(url){
                    var len = playingStack.length;
                    if(len && playingStack[len - 1] !== this){
                        var index = J.indexOf(playingStack, this);
                        if(-1 !== index){
                            playingStack.splice(index, 1);
                        }else{
                            this.on('ended', stackPop);
                        }
                    }
                    playingStack.push(this);

                    if(url){
                        this._el.src = url;
                        // this._el.load();
                    }
                    if(this._el.paused){
                        this._el.play();
                    }
                },
                pause : function(){
                    for(var i = 0, len = playingStack.length; i < len; i++){
                        playingStack[i].off('ended', stackPop);
                    }
                    playingStack = [];
                    this._el.pause();
                }
            });

            break;
        case AUDIO_MODE.FLASH :
            var addToQueue = function(audioObject){
                var tryInvokeCount = 0,
                    queue = [],
                    flashReady = false;
                var tryInvoke = function(){
                    ++tryInvokeCount;
                    var container = getContainer();
                    if(container.audioLoad && typeof container.audioLoad === 'function'){
                        flashReady = true;
                        for(var i=0,len=queue.length;i<len;i++){
                            queue[i]._sync();
                        }
                        queue = null;
                    }else if(tryInvokeCount < 30000){
                        setTimeout(tryInvoke, 100);
                    }
                }
                return function(audioObject){
                    if(flashReady){
                        audioObject._sync();
                        return;
                    }
                    if(-1 === J.indexOf(queue, audioObject)){
                        queue.push(audioObject);
                    }
                    if(tryInvokeCount === 0){
                        tryInvoke();
                    }
                }
            }();
            var registerEvent, unregisterEvent;
            (function(){
                var list = [];
                window.J['AudioEventDispatcher'] = function(seq, event, param){
                    var audioObject = list[seq],events;
                    audioObject && audioObject._handler && (events = audioObject._handler[event]);
                    for(var i=0,len=events && events.length;i<len;i++){
                        events[i].call(audioObject, param);
                    }
                };
                registerEvent = function(audioObject){
                    list[audioObject._seq] = audioObject;
                };
                unregisterEvent = function(audioObject){
                    list[audioObject._seq] = null;
                };
            })();
            J.Audio = J.Class({
                init : function(option){
                    this._seq = getSequence();
                    this._volume = 1;
                    this._muted = false;
                    option = option || {};
                    this._loop = Boolean(option.loop); //default by false
                    this._paused = true;
                    var container = getContainer(AUDIO_MODE.FLASH);
                    if(option.src){
                        this.play(option.src);
                    }
                },
                play : function(url){
                    var container = getContainer();
                    if(url){
                        this._src = url;
                        this._paused = false;
                        if(container.audioLoad){
                            this._sync();
                        }else{
                            addToQueue(this);
                        }
                    }else{
                        this._paused = false;
                        container.audioPlay && container.audioPlay(this._seq);
                    }
                },
                pause : function(){
                    var container = getContainer();
                    this._paused = true;
                    container.audioPause && container.audioPause(this._seq);
                },
                stop : function(){
                    this._paused = true;
                    var container = getContainer();
                    container.audioStop && container.audioStop(this._seq);
                },

                getVolume : function(){
                    return !this._muted && this._volume || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        this._volume = Math.max(0,Math.min(value,1));
                        this._muted = false;
                        var container = getContainer();
                        container.audioSetVolume && container.audioSetVolume(this._seq, this._volume);
                    }
                },
                getLoop : function(){
                    return this._loop;
                },
                setLoop : function(value){
                    this._loop = value !== false;
                    var container = getContainer();
                    container.audioSetLoop && container.audioSetLoop(this._loop);
                },
                getMute : function(){
                    return this._muted;
                },
                setMute : function(value){
                    this._muted = value !== false;
                    var container = getContainer();
                    container.audioSetVolume && container.audioSetVolume(this._seq, this.getVolume());
                },
                getPosition : function(){
                    var container = getContainer();
                    return container.audioGetPosition && container.audioGetPosition(this._seq)/1000 || 0;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        var container = getContainer();
                        container.audioSetPosition(this._seq, Math.max(0,value)*1000);
                    }
                },

                getBuffered : function(){
                    var container = getContainer();
                    return container.audioGetBuffered && container.audioGetBuffered(this._seq)/1000 || 0;
                },
                getDuration : function(){
                    var container = getContainer();
                    return container.audioGetDuration && container.audioGetDuration(this._seq)/1000 || 0;
                },
                free : function(){
                    this._paused = true;
                    var container = getContainer();
                    container.audioFree && container.audioFree(this._seq);
                },

                on : function(event, handler){
                    if(!this._handler){
                        this._handler = {};
                        registerEvent(this);
                    }
                    if(!this._handler[event] || !this._handler[event].length){
                        this._handler[event] = [handler];
                        var container = getContainer();
                        container.audioOn && container.audioOn(this._seq, event);
                    }else{
                        if(-1 === J.indexOf(this._handler[event],handler)){
                            this._handler[event].push(handler);
                        }
                    }
                },
                off : function(event, handler){
                    var index;
                    if(this._handler && this._handler[event] && -1 !== (index = J.indexOf(this._handler[event],handler))){
                        this._handler[event].splice(index,1);
                        if(!this._handler[event].length){
                            var container = getContainer();
                            container.audioOff && container.audioOff(this._seq, event);
                            delete this._handler[event];
                        }
                    }
                },

                _sync : function(){
                    if(this._src){
                        var container = getContainer(),
                            seq = this._seq;
                        container.audioLoad(seq, this._src);
                        var volume = this.getVolume();
                        if(volume != 1){
                            container.audioSetVolume(seq, volume);
                        }
                        if(this._loop){
                            container.audioSetLoop(seq, true);
                        }
                        for(var event in this._handler){
                            container.audioOn(seq, event);
                        }
                        if(!this._paused){
                            container.audioPlay(seq);
                        }
                    }
                }
            });
            break;
        case AUDIO_MODE.WMP:
            J.Audio = J.Class({extend:BaseAudio},{
                init : function(option){
                    this._seq = getSequence();
                    option = option || {};
                    var wrap = document.createElement('div');
                    getContainer(AUDIO_MODE.WMP).appendChild(wrap);
                    wrap.innerHTML = '<object id="WMPObject'+this._seq+'" classid="CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6" standby="" type="application/x-oleobject" width="0" height="0">\
                        <param name="AutoStart" value="true"><param name="ShowControls" value="0"><param name="uiMode" value="none"></object>';
                    var el = this._el = J.dom.id('WMPObject'+this._seq) || window['WMPObject'+this._seq];
                    if(option.loop){ //default by false
                        this._el.settings.setMode('loop', true);
                    }
                    if(option.src){
                        // el.src = option.src;
                        this.play(option.src);
                    }
                },
                play : function(url){
                    if(url){
                        var a = document.createElement('a');
                        a.href = url;
                        url = J.dom.getHref(a);
                        this._isPlaying = false;
                        this._isBuffering = false;
                        // this._duration = 0;
                        this._canPlayThroughFired = false;
                        this._el.URL = J.dom.getHref(a);
                    }
                    if(this._el.playState !== 3){ //not playing
                        this._el.controls.play();
                    }
                    if(this._hasPoll()){
                        this._startPoll();
                    }
                },
                pause : function(){
                    this._el.controls.pause();
                },
                stop : function(){
                    this._el.controls.stop();
                },

                getVolume : function(){
                    return !this._el.settings.mute && this._el.settings.volume / 100 || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        var newVolume = Math.max(0,Math.min(value,1)) * 100;
                        if(this._el.settings.volume !== newVolume || this._el.settings.mute){
                            this._el.settings.volume = newVolume;
                            this._el.settings.mute = false;
                            this._fire('volumechange');
                        }
                    }
                },
                getLoop : function(){
                    return this._el.settings.getMode('loop');
                },
                setLoop : function(value){
                    this._el.settings.setMode('loop', value !== false);
                },
                getMute : function(){
                    return this._el.settings.mute;
                },
                setMute : function(value){
                    var newMute = value !== false;
                    if(this._el.settings.mute !== newMute){
                        this._el.settings.mute = newMute;
                        this._fire('volumechange');
                    }
                },
                getPosition : function(){
                    return this._el.controls.currentPosition;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        this._fire('seeking');
                        this._el.controls.currentPosition = Math.max(0,value);
                    }
                },
                getBuffered : function(){
                    return this._el.network.downloadProgress * .01 * this.getDuration();
                },
                getDuration : function(){
                    return (this._el.currentMedia || 0).duration || 0;
                },
                free : function(){
                    this._el.controls.stop();
                    this._el = null;
                },

                on : function(event, handler){
                    if(!this._handler){
                        this._handler = {};
                    }
                    var context = this;
                    switch(event){
                        case 'timeupdate':
                            this._startPoll();
                        case 'seeked':
                            if(!this._hasPositionChange()){
                                this._onPositionChange = function(position){
                                    context._fire('timeupdate');
                                    context._fire('seeked');
                                }
                                this._el.attachEvent('PositionChange', this._onPositionChange);
                            }
                            break;
                        case 'waiting':
                        case 'playing':
                            if(!this._hasBuffering()){
                                this._onBuffering = function(isStart){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(isStart){
                                        context._isBuffering = true;
                                        context._fire('waiting');
                                    }else{
                                        context._isBuffering = false;
                                        context._fire('playing');
                                    }
                                };
                                this._el.attachEvent('Buffering', this._onBuffering);
                            }
                            break;
                        case 'error':
                            // this._el.attachEvent('MediaError',handler);
                            this._el.attachEvent('Error',handler);
                            break;
                        case 'progress':
                        case 'ended':
                        case 'play':
                        case 'pause':
                            if(!this._hasPlayStateChange()){
                                this._onPlayStateChange = function(state){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(state === 2){
                                        context._isPlaying = false;
                                        context._fire('pause');
                                    }else if(state === 3){
                                        if(!context._isPlaying){
                                            context._isPlaying = true;
                                            context._fire('play');
                                        }
                                    }else if(state === 6){ //Buffering
                                        context._fire('progress');
                                    }else if(state === 1){ //MediaEnded, Stopped
                                        if(context._isPlaying){
                                            context._isPlaying = false;
                                            context._fire('ended');
                                            context._stopPoll();
                                        }
                                    }/*else{
                                        console.log('playstate:',state);
                                    }*/
                                }
                                this._el.attachEvent('PlayStateChange', this._onPlayStateChange);
                            }
                            break;
                        case 'loadstart':
                        case 'loadeddata':
                        case 'canplay':
                            if(!this._hasOpenStateChange()){
                                this._onOpenStateChange = function(state){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(state === 21){
                                        context._fire('loadstart');
                                    }else if(state === 13){
                                        context._fire('loadeddata');
                                        context._fire('canplay');
                                    }/*else{
                                        console.log('openstate:',state);
                                    }*/
                                }
                                this._el.attachEvent('OpenStateChange', this._onOpenStateChange);
                            }
                            break;
                        case 'canplaythrough':
                        case 'durationchange':
                            this._startPoll();
                            break;
                        default:
                            break;
                    }
                    (this._handler[event] || (this._handler[event] = [])).push(handler);
                },
                off : function(event, handler){
                    if(!this._handler){
                        return;
                    }
                    var index;
                    if(this._handler && this._handler[event] && -1 !== (index = J.indexOf(this._handler[event],handler))){
                        this._handler[event].splice(index,1);
                    }

                    switch(event){
                        case 'timeupdate':
                            if(!this._hasPoll()){
                                this._stopPoll();
                            }
                        case 'seeked':
                            if(!this._hasPositionChange()){
                                this._el.detachEvent('PositionChange', this._onPositionChange);
                            }
                            break;
                        case 'waiting':
                        case 'playing':
                            if(!this._hasBuffering()){
                                this._el.detachEvent('Buffering', this._onBuffering);
                            }
                            break;
                        case 'error':
                            this._el.detachEvent('Error', handler);
                            break;
                        case 'progress':
                        case 'ended':
                        case 'play':
                        case 'pause':
                            if(!this._hasPlayStateChange()){
                                this._el.detachEvent('PlayStateChange', this._onPlayStateChange);
                            }
                            break;
                        case 'loadstart':
                        case 'loadeddata':
                        case 'canplay':
                            if(!this._hasOpenStateChange()){
                                this._el.detachEvent('OpenStateChange', this._onOpenStateChange);
                            }
                            break;
                        case 'canplaythrough':
                        case 'durationchange':
                            if(!this._hasPoll()){
                                this._stopPoll();
                            }
                            break;
                        default:
                            break;
                    }
                },
                _fire : function(event){
                    var events;
                    if(!this._handler || !(events = this._handler[event])){
                        return;
                    }
                    for(var i=0,len=events.length;i<len;i++){
                        events[i].call(this);
                    }
                },
                _startPoll : function(){
                    if(this._timer !== undefined){
                        return;
                    }
                    this._canPlayThroughFired = this._canPlayThroughFired || this._el.network.downloadProgress === 100;
                    this._duration = this.getDuration();
                    var context = this;
                    this._timer = setInterval(function(){
                        if(context._isPlaying && !context._isBuffering && (context._handler['timeupdate'] || 0).length && (context._el.currentMedia || 0).sourceURL){
                            context._fire('timeupdate');
                        }

                        var duration = context.getDuration();
                        if(context._duration !== duration){
                            context._duration = duration;
                            context._fire('durationchange');
                        }
                        if(!context._canPlayThroughFired){
                            if(context._el.network.downloadProgress === 100){
                                context._canPlayThroughFired = true;
                                context._fire('canplaythrough');
                            }
                        }
                    },1000);
                },
                _stopPoll : function(){
                    clearInterval(this._timer);
                    delete this._timer;
                },
                _hasPositionChange : function(){
                    return (this._handler['timeupdate'] && this._handler['timeupdate'].length) ||
                        (this._handler['seeked'] && this._handler['seeked'].length);
                },
                _hasBuffering : function(){
                    return (this._handler['waiting'] && this._handler['waiting'].length) ||
                        (this._handler['playing'] && this._handler['playing'].length);
                },
                _hasPlayStateChange : function(){
                    return (this._handler['progress'] && this._handler['progress'].length) ||
                        (this._handler['ended'] && this._handler['ended'].length) ||
                        (this._handler['play'] && this._handler['play'].length) ||
                        (this._handler['pause'] && this._handler['pause'].length);
                },
                _hasOpenStateChange : function(){
                    return (this._handler['loadstart'] && this._handler['loadstart'].length) ||
                        (this._handler['loadeddata'] && this._handler['loadeddata'].length) ||
                        (this._handler['canplay'] && this._handler['canplay'].length);
                },
                _hasPoll : function(){
                    return (this._handler['timeupdate'] && this._handler['timeupdate'].length) ||
                        (this._handler['canplaythrough'] && this._handler['canplaythrough'].length) ||
                        (this._handler['durationchange'] && this._handler['durationchange'].length);
                }
            });
            break;
        case AUDIO_MODE.NONE:
            J.Audio = J.Class({extend:BaseAudio},{
                init : function(option){
                    console.log('Audio is not supported','Audio');
                }
            });
            break;
        default:
            break;
    }
});
;(function(){
    var J={
        $namespace: function(name) {
            if ( !name ) {
                return window;
            }

            nsArr = name.split(".");
            var ns=window;

            for(i = 0 , l = nsArr.length; i < l; i++){
                var n = nsArr[i];
                  ns[n] = ns[n] || {};
                  ns = ns[n];
            }

            return ns;
        },
        $package:function(ns,func){
            var target;
            if(typeof ns == "function"){
                func=ns;
                target = window; 
            }
            else if(typeof ns == "string"){
                target = this.$namespace(ns);
            }
            else if(typeof ns == "object"){
                target  = ns;
            }
            func.call(target,this);
        },
        extend:function(destination,source){
            for(var n in source){
                if(source.hasOwnProperty(n)){
                    destination[n]=source[n];
                }
            }
            return destination;
        },
        bind:function(func, context, var_args) {
            var slice = [].slice;
            var a = slice.call(arguments, 2);
            return function(){
                return func.apply(context, a.concat(slice.call(arguments)));
            };
        },
        Class:function(){
            var length = arguments.length;
            var option = arguments[length-1];
            option.init = option.init || function(){};
   
            if(length === 2){
                var superClass = arguments[0].extend;
    
                var tempClass = function() {};
                tempClass.prototype = superClass.prototype;

                var subClass = function() {
                    return new subClass.prototype._init(arguments);
                }
              
                subClass.superClass = superClass.prototype;
                subClass.callSuper = function(context,func){
                    var slice = Array.prototype.slice;
                    var a = slice.call(arguments, 2);
                    var func = subClass.superClass[func];
               
                    if(func){
                        func.apply(context, a.concat(slice.call(arguments)));
                    }
                };
                subClass.prototype = new tempClass();
                subClass.prototype.constructor = subClass;
                
                J.extend(subClass.prototype, option);

                subClass.prototype._init = function(args){
                    this.init.apply(this, args);
                };
                subClass.prototype._init.prototype = subClass.prototype;
                return subClass;

            }else if(length === 1){
                var newClass = function() {
                    return new newClass.prototype._init(arguments);
                }
                newClass.prototype = option;
                newClass.prototype._init = function(arg){
                    this.init.apply(this,arg);
                };
                newClass.prototype.constructor = newClass;
                newClass.prototype._init.prototype = newClass.prototype;
                return newClass;
            }   
        },
        // Convert pseudo array object to real array
        toArray: function(pseudoArrayObj){
            var arr = [], i, l;
            try{
                return arr.slice.call(pseudoArrayObj);
            }
            catch(e){
                arr = [];
                for(i = 0, l = pseudoArrayObj.length; i < l; ++i){
                    arr[i] = pseudoArrayObj[i];
                }
                return arr;
            }
        },
        indexOf:function(arr,elem){
            var $T= J.type;
            //数组或类数组对象
            if(arr.length){
                return [].indexOf.call(arr,elem);
            }
            else if($T.isObject(arr)){
                for(var i in arr){
                    if(arr.hasOwnProperty(i) && arr[i] === elem){
                        return i;
                    }    
                }
            }
        },
        every:function(arr,callback){
            if(arr.length){
                return [].every.call(arr,callback);
            }
            else if($T.isObject(arr)){
                var flag = true;
                this.each(arr,function(e,i,arr){
                    if(!callback(e,i,arr)) flag = false;
                });
                return flag;
            }
        },
        some:function(arr,callback){
            if(arr.length){
                return [].some.call(arr,callback);
            }
            else if($T.isObject(arr)){
                var flag = false;
                this.each(arr,function(e,i,arr){
                    if(callback(e,i,arr)) flag = true;
                });
                return flag;
            }
        },
        each:function(arr,callback){
            var $T = J.type;
            if(arr.length){
                return [].forEach.call(arr,callback);
            }
            else if($T.isObject(arr)){
                for(var i in arr){
                    if(arr.hasOwnProperty(i))
                        if(callback.call(arr[i],arr[i],i,arr) === false) return;
                }
            }
        },
        map:function(arr,callback){
            var $T = J.type;
            if(arr.length){
                [].map.call(arr,callback);
            }
            else if($T.isObject(arr)){
                for(var i in arr){
                    if(arr.hasOwnProperty(i))
                        arr[i] = callback.call(arr[i],arr[i],i,arr);
                }                
            }
        },
        filter:function(arr,callback){
            var $T = J.type;
            if(arr.length){
                return [].filter.call(arr,callback);
            }
            else if($T.isObject(arr)){
                var newObj={};
                this.each(arr,function(e,i){
                    if(callback(e,i)){
                        newObj[i] = e;
                    }
                });
                return newObj;
            }
        },
        isEmptyObject:function(obj){
            for(var n in obj){
                return false;
            }
            return true;
        },
        random : function(min, max){
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        $default: function(value, defaultValue){
            if(typeof value === 'undefined'){
                return defaultValue;
            }
            return value;
        }

    }
    window.JM = window.J = J;

    if ( typeof define === "function") {
        define(function() {
            return J;
        });
    }
})();;//browser
J.$package(function(J){
    var s, browser,
        ua = navigator.userAgent.toLowerCase(),
        plug = navigator.plugins;

    /**
     * @ignore
     * @param String ver
     * @param Number floatLength
     * @return Number 
     */
    var toFixedVersion = function(ver, floatLength){
        ver= (""+ver).replace(/_/g,".");
        floatLength = floatLength || 1;
        ver = String(ver).split(".");
        ver = ver[0] + "." + (ver[1] || "0");
        ver = Number(ver).toFixed(floatLength);
        return ver;
    };
    /**
     * browser 名字空间
     * 
     * @namespace
     * @name browser
     */
    browser = {
        /**
         * @namespace
         * @name features
         * @memberOf browser
         */
        features: 
        /**
         * @lends browser.features
         */    
        {
            /**
             * @property xpath
             */
            xpath: !!(document.evaluate),
            
            /**
             * @property air
             */
            air: !!(window.runtime),
            
            /**
             * @property query
             */
            query: !!(document.querySelector)
        },

        /**
         * @namespace
         * @name plugins
         * @memberOf browser
         */
        plugins: 
        /**
         * @lends browser.plugins
         */    
        {
            flash: (function(){
                //var ver = "none";
                var ver = 0;
                if (plug && plug.length) {
                    var flash = plug['Shockwave Flash'];
                    if (flash && flash.description) {
                        ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
                    }
                } else {
                    var startVer = 13;
                    while (startVer--) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
                            ver = toFixedVersion(startVer);
                            break;
                        } catch(e) {}
                    }
                }
                
                return ver;
            })()
        },
        
        /**
         * 获取浏览器的userAgent信息
         * 
         * @memberOf browser
         */
        getUserAgent: function(){
            return ua;
        },
        
        /**
         * 用户使用的浏览器的名称，如：chrome
         * 
         * 
         * @description {String} 用户使用的浏览器的名称，如：chrome
         * @type Number
         */
        name: "unknown",
        
        /**
         * @property version
         * @lends browser
         */
        version: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        ie: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        firefox: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        chrome: 0,
        
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        opera: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        safari: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        mobileSafari: 0,
        
        /**
         * 用户使用的是否是adobe 的air内嵌浏览器
         */
        adobeAir: 0,
        
        /**
         * 是否支持css3的borderimage
         * 
         * @description {boolean} 检测是否支持css3属性borderimage
         */
        //borderimage: false,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    // 探测浏览器并存入 browser 对象
    (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",toFixedVersion(s[1])):
    (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",toFixedVersion(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",toFixedVersion(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",toFixedVersion(s[1])) :
    (s = ua.match(/adobeair\/([\d.]+)/)) ? browser.set("adobeAir",toFixedVersion(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",toFixedVersion(s[1])) : 0;


    J.browser = browser;

});;J.$package(function(J){
    var c = navigator.connection || {type:0};
    var ct = ["unknow","ethernet","wifi","cell_2g","cell_3g"];
    J.connectType = ct[c.type]; 
});;//cookie
J.$package(function(J){
    var domainPrefix = window.location.hostname;
    var cookie = {
        set : function(name, value, domain, path, hour) {
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + 3600000 * hour);
            }
            window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
            return true;
        },
        get : function(name) {
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        remove : function(name, domain, path) {
            window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        }
    };
    J.cookie = cookie;

});
;//dom
J.$package(function(J){
    var doc = document,
    $T = J.type,
    tagNameExpr = /^[\w-]+$/,
    idExpr = /^#([\w-]*)$/,
    classExpr = /^\.([\w-]+)$/,
    selectorEngine;

    var hasClassListProperty = 'classList' in document.documentElement;
    var vendors = ['o', 'ms' ,'moz' ,'webkit'];
    var div = document.createElement('div');

    var $D={

        $:function(selector,context){
            var result;
            var qsa;
            context = context || doc;
            
            //优先使用原始的
            if(idExpr.test(selector)) {
                result = this.id(selector.replace("#",""));
                if(result)  return [result] ;
                else return [] ;
            }
            else if(tagNameExpr.test(selector)){
                result = this.tagName(selector,context);
            }
            else if(classExpr.test(selector)){
                result = this.className(selector.replace(".",""),context);
            }
            // //自定义选择器
            // else if(selectorEngine) result = selectorEngine(selector,context);
            //querySelectorAll
            else result = context.querySelectorAll(selector);
        

            //nodeList转为array
            return J.toArray(result);
                
        },
        id:function(id){
            return doc.getElementById(id);
        },
        tagName:function(tagName,context){
            context=context||doc;
            return context.getElementsByTagName(tagName);
        },
        node:function(name){
            return doc.createElement(name);
        },
        className:function(className,context){
            var children, elements, i, l, classNames;
            context=context||doc;
            if(context.getElementsByClassName){
                return context.getElementsByClassName(className);
            }
            else{
                children = context.getElementsByTagName('*');
                elements = [];
                for(i = 0, l = children.length; i < l; ++i){
                    if(classNames = children[i].className
                        && J.indexOf(classNames.split(' '), className) >= 0){
                        elements.push(children[i]);
                    }
                }
                return elements;
            }
        },
        remove:function(node){
            var context = node.parentNode;
            if(context) context.removeChild(node);
        },
        setSelectorEngine:function(func){
            selectorEngine=func;
        },
        matchesSelector:function(ele,selector){
            if(!ele || !selector) return;
            var matchesSelector = ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.oMatchesSelector || ele.matchesSelector;
            if(matchesSelector) return matchesSelector.call(ele,selector);
            var list = this.$(selector);
            if(J.indexOf(list,ele) > 0) return true;
            return false;
        },
        closest:function(elem,selector){
            while(elem){
                if($D.matchesSelector(elem,selector)){
                    return elem;
                }
                elem = elem.parentNode;
            }
        },
        toDomStyle:function(cssStyle){
            if(!$T.isString(cssStyle)) return;
                return cssStyle.replace(/\-[a-z]/g,function(m) { return m.charAt(1).toUpperCase(); });
        },
        toCssStyle:function(domStyle){
            if(!$T.isString(domStyle)) return;
                  return domStyle.replace(/[A-Z]/g, function(m) { return '-'+m.toLowerCase(); });
        },
        setStyle:function(elem ,styleName,styleValue){
            var self = this;
            if(elem.length){
                J.each(elem ,function(e){
                    self.setStyle(e,styleName,styleValue);
                });
                return;
            }
            if($T.isObject(styleName)){
                for(var n in styleName){
                    if(styleName.hasOwnProperty(n)){
                        elem.style[n] = styleName[n];
                    }
                }
                return;
            }
            if($T.isString(styleName)){
                elem.style[styleName] = styleValue;
            }
        },
        /**
         * 
         * 获取元素的当前实际样式，css 属性需要用驼峰式写法，如：fontFamily
         * 
         * @method getStyle
         * @memberOf dom
         * 
         * @param {Element} el 元素
         * @param {String} styleName css 属性名称
         * @return {String} 返回元素样式
         */
        getStyle: function(el, styleName){
            if(!el){
                return;
            }
            if(styleName === "float"){
                styleName = "cssFloat";
            }
            if(el.style[styleName]){
                return el.style[styleName];
            }else if(window.getComputedStyle){
                return window.getComputedStyle(el, null)[styleName];
            }else if(document.defaultView && document.defaultView.getComputedStyle){
                styleName = styleName.replace(/([/A-Z])/g, "-$1");
                styleName = styleName.toLowerCase();
                var style = document.defaultView.getComputedStyle(el, "");
                return style && style.getPropertyValue(styleName);
            }else if(el.currentStyle){
                return el.currentStyle[styleName];
            }

        },
        //获取带有出产商的属性名
        getVendorPropertyName : function(prop) {
            var style = div.style;
            var _prop;
            if (prop in style) return prop;
            // _prop = prop;
            _prop = prop.charAt(0).toUpperCase() + prop.substr(1);
            for(var i = vendors.length; i--;){
                var v = vendors[i];
                var vendorProp = v + _prop;
                if (vendorProp in style) {
                    return vendorProp;
                }
            }
        },
         //检测是否支持3D属性
         isSupprot3d : function(){
             // var transformStr = $D.getVendorPropertyName("transform");
             // $D.setStyle(div ,transformStr ,"rotatex(90deg)");
             // if(div.style[transformStr] == "") return false;
             // return true;
             var p_prop = $D.getVendorPropertyName("perspective");
             return p_prop && p_prop in div.style;
         },
        filterSelector:function(arr,selector){
            return J.filter(arr,function(elem){
                return $D.matchesSelector(elem,selector);
            });
        },
        addClass: (function(){
            if(hasClassListProperty){
                return function (elem, className) {
                    if (!elem || !className || $D.hasClass(elem, className)){
                        return;
                    }
                    elem.classList.add(className);
                };
            }
            else{
                return function(elem, className){
                    if (!elem || !className || $D.hasClass(elem, className)) {
                        return;
                    }
                    elem.className += " "+ className;
                }    
            }
        })(),
        hasClass: (function(){
            if (hasClassListProperty) {
                return function (elem, className) {
                    if (!elem || !className) {
                        return false;
                    }
                    return elem.classList.contains(className);
                };
            } else {
                return function (elem, className) {
                    if (!elem || !className) {
                        return false;
                    }
                    return -1 < (' ' + elem.className + ' ').indexOf(' ' + className + ' ');
                };
            }
        })(),
        removeClass: (function(){
            if (hasClassListProperty) {
                return function (elem, className) {
                    if (!elem || !className || !$D.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.remove(className);
                };
            } else {
                return function (elem, className) {
                    if (!elem || !className || !$D.hasClass(elem, className)) {
                        return;
                    }
                    elem.className = elem.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
                };
            }
        })(),
        toggleClass:function(ele,className){
            if($D.hasClass(ele,className)){
                $D.removeClass(ele,className);
            }
            else{
                $D.addClass(ele,className);
            }
        },
        // 类似源生方法 `insertBefore`
        insertAfter: function(parentElement, newElement, refernceElement){
            var next = refernceElement.nextSibling;
            if(next){
                parentElement.insertBefore(newElement, next);
            }
            else{
                parentElement.appendChild(newElement);
            }
            return newElement;
        }
    };

    J.dom=$D;
});
;//event
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
        bindCommands : function(targetElement, eventName, commends, commendName){
            var defaultEvent = J.platform.touchDevice ? "tap":"click";
            if(arguments.length === 1){
                commends = targetElement;
                targetElement = document.body;
                eventName = defaultEvent;
            }else if(arguments.length === 2){
                commends = eventName;
                eventName = defaultEvent;
            }
            if(!targetElement._commends){
                targetElement._commends = {};
            }
            if(targetElement._commends[eventName]){//已经有commends 就合并
                J.extend(targetElement._commends[eventName], commends);
                return;
            }
            targetElement._commends[eventName] = commends;
            commendName = commendName || 'cmd';
            if(!targetElement.getAttribute(commendName)){
                targetElement.setAttribute(commendName, 'void');
            }
            J.event.on(targetElement, eventName, function(e){
                var target = J.event.getActionTarget(e, -1, commendName, this.parentNode);
                if(target){
                    var cmd = target.getAttribute(commendName);
                    var param = target.getAttribute('param');
                    if(target.href && target.getAttribute('href').indexOf('#') === 0){
                        e.preventDefault();
                    }
                    if(this._commends[eventName][cmd]){
                        this._commends[eventName][cmd](param, target, e);
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
                var dx = p2.x - p1.x;
                var dy = -p2.y + p1.y;    
                var angle = Math.atan2(dy , dx) * 180 / Math.PI;

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
                        rotate:rotate
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
});;//format
J.$package(function(J){
    J.format = J.format || {};

    /**
     * 让日期和时间按照指定的格式显示的方法
     * @method date
     * @memberOf format
     * @param {String} format 格式字符串
     * @return {String} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var d = new Date();
     *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
     *     J.format.date(d, "YYYY-MM-DD hh:mm:ss");
     * };
     * 
     */
    var date = function(date, formatString){
        /*
         * eg:formatString="YYYY-MM-DD hh:mm:ss";
         */
        var o = {
            "M+" : date.getMonth()+1,    //month
            "D+" : date.getDate(),    //day
            "h+" : date.getHours(),    //hour
            "m+" : date.getMinutes(),    //minute
            "s+" : date.getSeconds(),    //second
            "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
            "S" : date.getMilliseconds()    //millisecond
        }
    
        if(/(Y+)/.test(formatString)){
            formatString = formatString.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
    
        for(var k in o){
            if(new RegExp("("+ k +")").test(formatString)){
                formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return formatString;
    };

    J.format.date = date;
    
});
;//http
J.$package(function(J){
    // var localData;
    // var saveDataLocal = function(data){
    //     if(!localdata) localdata = {};
    //     else localdata = JSON.parse(localStorage.getItem("localdata"));

    //     localdata[Date.now()] = data;
    //     localStorage.setItem("localdata",JSON.stringify(localData));
    // }
    // var getLocalData = function(){
    //     var localdataStr = localStorage.getItem("localdata");
    //     if(localdataStr){
    //         localdata = JSON.parse(localdataStr);
    //     }
    //     return localdata;
    // }

    // $E.on(window,"online",function(){
    //     var data = getLocalData();
    //     for(var n in data){
    //         var opt = data[n];
    //         http.ajax(opt);
    //     }
    // });
    // $E.on(window,"offline",function(){
        
    // });


    var http = {
        /**
         * 生成参数串
         * 
         * @name serializeParam
         * @function
         * @memberOf J.http
         * @param {Object} param 参数对象
         * @return {string} 生成的参数串
         */  
        serializeParam : function ( param ) {
            if ( !param ) return '';
            var qstr = [];
            for ( var key in  param ) {
                qstr.push( encodeURIComponent(key) + '=' + encodeURIComponent(param[key]) );
            };
            return  qstr.join('&');
        },
        /**
         * 获取url参数值
         * 
         * @name getUrlParam
         * @function
         * @memberOf J.http
         * @param {string} name 参数名
         * @param {string} href url地址
         * @param {Object} noDecode 禁用decode
         * @return {string} 参数值
         */ 
        getUrlParam :  function ( name ,href ,noDecode ) {
            var re = new RegExp( '(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)',  'i' ), m = re.exec( href );
            var ret = m ? m[1] : '' ;
            return !noDecode ? decodeURIComponent( ret ) : ret;
        },
        ajax : function ( option ) {
            var o = option;
            var m = o.method.toLocaleUpperCase();
            var isPost = 'POST' == m;
            var isComplete = false;
            var timeout = o.timeout;
            var withCredentials = o.withCredentials;//跨域ajax
            var async = ('async' in option) ? option.async : true;//默认为异步请求, 可以设置为同步

            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : false;
            if ( !xhr ) {
                 o.error && o.error.call( null, { ret : 999 , msg : 'Create XHR Error!' } );
                 return false;
            }

            var qstr = http.serializeParam( o.param );

            // get 请求 参数处理
            !isPost && ( o.url += ( o.url.indexOf( '?' ) > -1 ?  '&' : '?' ) + qstr );
            
            xhr.open( m, o.url, async );
            if(withCredentials) xhr.withCredentials = true;

            isPost && xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
            var timer = 0;

            xhr.onreadystatechange = function(){
                if ( 4 == xhr.readyState ) {
                    var status = xhr.status;
                    if ( (status >= 200 && status < 300) || status == 304 ||status == 0) {
                        var response = xhr.responseText.replace( /(\r|\n|\t)/gi, '' );
                        // var m = /callback\((.+)\)/gi.exec( response );
                        // var result = { ret : 998, msg : '解析数据出错，请稍后再试' };
                        // try{ result = eval( '(' + m[1] + ')' ) } catch ( e ) {};
                        // result = eval( '(' + m[1] + ')' )
                        var json = null;
                        try{
                            json = JSON.parse(response);
                        }catch(e){}
                        o.onSuccess && o.onSuccess(json,xhr);
                    }else{
                        o.onError && o.onError(xhr, +new Date - startTime);
                    };
                    isComplete = true;
                    if(timer){
                        clearTimeout(timer);
                    }
                }
                
            };
            
            var startTime = +new Date;
            xhr.send( isPost ? qstr : void(0) );
    
            if(timeout){
                timer = setTimeout(function(){
                    if(!isComplete){
                        xhr.abort();//不abort同一url无法重新发送请求？
                        o.onTimeout && o.onTimeout(xhr);
                    }
                },timeout);
            }

            return xhr;
        }
        // offlineSend:function(options){
        //     if(navigator.onLine){
        //         http.ajax(options);
        //     }
        //     else{
        //         saveDataLocal(options);        
        //     }
        // }
    }
    J.http = http;
});;//platform
J.$package(function(J){
    var ua = navigator.userAgent;
    var platform = {};

    // return the IE version or -1
    function getIeVersion(){
        var retVal = -1,
            ua, re;
        if(navigator.appName === 'Microsoft Internet Explorer'){
            ua = navigator.userAgent;
            re = new RegExp('MSIE ([0-9]{1,})');
            if(re.exec(ua) !== null){
                retVal = parseInt(RegExp.$1);
            }
        }
        return retVal;
    }

    platform.ieVersion = getIeVersion();
    platform.ie = platform.ieVersion !== -1;
    platform.android = ua.match(/Android/i) === null ? false : true;
    platform.iPhone = ua.match(/iPhone/i) === null ? false : true;
    platform.iPad = ua.match(/iPad/i) === null ? false : true;
    platform.iPod = ua.match(/iPod/i) === null ? false : true;
    platform.winPhone = ua.match(/Windows Phone/i) === null ? false : true;
    platform.IOS = platform.iPad || platform.iPhone;
    platform.touchDevice = "ontouchstart" in window;

    J.platform = platform;
});;// detect vender prefix
J.$package(function(J){
    var styles, pre, dom;

    if(window.getComputedStyle){
        styles = window.getComputedStyle(document.documentElement, '');
        pre = (Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1];
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

        J.prefix = {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre
        };
    }
    // IE8- don't support `getComputedStyle`, so there is no prefix
    else{
        J.prefix = {
            dom: '',
            lowercase: '',
            css: '',
            js: ''
        }
    }
});;//string
J.$package(function(J){
    
    var cache = {};
    var template = function(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            template(document.getElementById(str).innerHTML) :
          
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
        
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
    J.string = J.string || {};
    J.string.template = template;

    //html正文编码：对需要出现在HTML正文里(除了HTML属性外)的不信任输入进行编码
    var encodeHtml = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        return sStr;
    };

    J.string.encodeHtml = encodeHtml;

    /**
     * 判断是否是一个可接受的 url 串
     * 
     * @method isURL
     * @memberOf string
     * 
     * @param {String} str 要检测的字符串
     * @return {Boolean} 如果是可接受的 url 则返回 true
     */
    var isURL = function(str) {
        return isURL.RE.test(str);
    };
        
    /**
     * @ignore
     */
    isURL.RE = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;


    /**
     * 分解 URL 为一个对象，成员为：scheme, user, pass, host, port, path, query, fragment
     * 
     * @method parseURL
     * @memberOf string
     * 
     * @param {String} str URL 地址
     * @return {Object} 如果解析失败则返回 null
     */
    var parseURL = function(str) {
        var ret = null;

        if (null !== (ret = parseURL.RE.exec(str))) {
            var specObj = {};
            for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
                var curSpec = parseURL.SPEC[i];
                specObj[curSpec] = ret[i + 1];
            }
            ret = specObj;
            specObj = null;
        }

        return ret;
    };


    /**
     * 将一个对象（成员为：scheme, user, pass, host, port, path, query, fragment）重新组成为一个字符串
     * 
     * @method buildURL
     * @memberOf string
     * 
     * @param {Object} obj URl 对象
     * @return {String} 如果是可接受的 url 则返回 true
     */
    var buildURL = function(obj) {
        var ret = '';

        // prefix & surffix
        var prefix = {},
            surffix = {};

        for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
            var curSpec = parseURL.SPEC[i];
            if (!obj[curSpec]) {
                continue;
            }
            switch (curSpec) {
            case 'scheme':
                surffix[curSpec] = '://';
                break;
            case 'pass':
                prefix[curSpec] = ':';
            case 'user':
                prefix['host'] = '@';
                break;
            //case 'host':
            case 'port':
                prefix[curSpec] = ':';
                break;
            //case 'path':
            case 'query':
                prefix[curSpec] = '?';
                break;
            case 'fragment':
                prefix[curSpec] = '#';
                break;
            }

            // rebuild
            if (curSpec in prefix) {
                ret += prefix[curSpec];
            }
            if (curSpec in obj) {
                ret += obj[curSpec];
            }
            if (curSpec in surffix) {
                ret += surffix[curSpec];
            }
        }

        prefix = null;
        surffix = null;
        obj = null;

        return ret;
    };
    
    /**
     * @ignore
     */
    parseURL.SPEC = ['scheme', 'user', 'pass', 'host', 'port', 'path', 'query', 'fragment'];
    parseURL.RE = /^([^:]+):\/\/(?:([^:@]+):?([^@]*)@)?(?:([^/?#:]+):?(\d*))([^?#]*)(?:\?([^#]+))?(?:#(.+))?$/;
    
    J.string.parseURL = parseURL;
    J.string.buildURL = buildURL;

});;//support
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
});;//type
J.$package(function(J){

    var ots=Object.prototype.toString;

    var type={
        /**
         * 判断是否数组
         * 
         * @name isArray
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否数组
         */   
        isArray : function(o){
            return o && (o.constructor === Array || ots.call(o) === "[object Array]");
        },
        /**
         * 判断是否Object
         * 
         * @name isObject 
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否Object
         */   
        isObject : function(o) {
            return o && (o.constructor === Object || ots.call(o) === "[object Object]");
        },
        /**
         * 判断是否布尔类型
         * 
         * @name isBoolean 
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否布尔类型
         */  
        isBoolean : function(o) {
            return (o === false || o) && (o.constructor === Boolean);
        },
        /**
         * 判断是否数值类型
         * 
         * @name isNumber
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否数值类型
         */  
        isNumber : function(o) {
            return (o === 0 || o) && o.constructor === Number;
        },
        /**
         * 判断是否undefined
         * 
         * @name isUndefined
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否undefined
         */ 
        isUndefined : function(o) {
               return typeof(o) === "undefined";
        },
        /**
         * 判断是否Null
         * 
         * @name isNull
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否Null
         */ 
        isNull : function(o) {
               return o === null;
        },
       /**
         * 判断是否function
         * 
         * @name isFunction
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否function
         */ 
        isFunction : function(o) {
               return o && (o.constructor === Function);
        },
       /**
         * 判断是否字符串
         * 
         * @name isString
         * @function
         * @memberOf J.type
         * @param {Object} o 判断对象
         * @return {boolean} 是否字符串
         */ 
        isString : function(o) {
            return (o === "" || o) && (o.constructor === String);
        }
    }
    J.type=type;
});;//util
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
