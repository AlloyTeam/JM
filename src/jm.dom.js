//dom
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
