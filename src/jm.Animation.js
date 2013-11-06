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
});