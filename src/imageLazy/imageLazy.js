/**
 * ImageLazy
 * @path: JM/src/imageLazy.js
 * @version: 1.0.0
 * @author tennylv
 * @date 2015-01-08
 *
 */
'use strict';
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
        //CMD
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
        //AMD
    } else {
    	//WINDOW
        root.ImageLazy = factory();
    }
})(this, function() {

    /**
     * 使用example
     * 
     * <img style="width:60px;height:60px;" lazy-src="http://tp2.sinaimg.cn/3306361973/50/22875318196/0">
     *
     * 调用
     * ImageLazy.lazy(window);
     */

    /**
     * 图片懒加载组件，支持全屏滚动图片和局部滚动图片懒加载
     * 
     * @function lazy(container,object) 初始化懒加载
     */

    var ImageLazy = {

        /**
         * init初始化懒加载
         * 
         * @param {string,object} 
         * @container {string} 需要进行懒加载的容器，遵循zepto选择器
         * @object.event {string} 触发懒加载的事件 默认为touchmove
         * @object.threshold {number} 懒加载图片的偏移量即进入可是区域之前的px值默认值为 0
         * @object.placeholderImage {string} 懒加载图片的占位图url
         * @object.useFadeIn {bool} 是否使用fadeIn效果
         * @object.loadErrorImage {string} 懒加载图片加载失败的url
         * @object.noSize {object} 默认图片都有宽高，如果没有获取到图片宽高的值 
         * @noSize.w {object}  获取不到图片时 占位图的宽 默认值50
         * @noSize.h {object}  获取不到图片时 占位图的高 默认值50
         * @imgLoadSuccess {function}  每张图片获取成功时的回调
         * @imgLoadError {function}  每张图片获取失败时的回调
         */

        lazy:function(container,opt){
            if (opt) {
                opt.container = container;
            }
            var settings = {
                container:container || window,
                event:'touchmove',
                threshold:0,
                placeholderImage:'',
                loadErrorImage:'',
                useFadeIn:false,
                noSize:{w:50,h:50},
                imgLoadSuccess:function(){},
                imgLoadError:function(){}
            };

            $.extend(settings,opt);
            
            var $container = settings.container === window ? $(document) : $(settings.container);

            var imgArray = $container.find('img[lazy-src]');

            $(settings.container).on(settings.event,function(){
                dealWithImg();
            });

            /**
             * 判断图片是否进入可视区域目前支持从上往下滑动
             * 
             */

            var scrolledIntoView = function (element) {
                var distance;
                if (settings.container === undefined || settings.container === window) {
                    distance = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
                } else {
                    distance = $container.offset().top + $container.height();
                }
                return distance <= $(element).offset().top - settings.threshold;
            };
            
            
            imgArray.on('load',function(){
                imgArray = imgArray.not(this);

                if ($(this).data('noHeight')) {
                    $(this).height('auto');
                }
                if ($(this).data('noWidth')) {
                    $(this).width('auto');
                }

                if (settings.useFadeIn) {
                    $(this).hide();
                    $(this).fadeIn();
                }
                settings.imgLoadSuccess(this);
            });

            imgArray.on('error',function(){
                imgArray = imgArray.not(this);
                if (settings.loadErrorImage) {
                    $(this).attr('src',settings.loadErrorImage);
                }
                settings.imgLoadError(this);
            });

            var setSrc = function(item){
                if (!scrolledIntoView(item)) {
                    $(item).attr('src',$(item).attr('lazy-src'));
                } 
            };
            
            var dealWithImg = function(){
                $.each(imgArray, function(index, item){
                    checkImage(item);
                    setSrc(item);
                });
            };

            /**
             * 检查图片是否有宽高 如果没有应用noSize逻辑
             * 
             */

            var checkImage = function(item){
                
                var height = $(item).height();
                var width = $(item).width();
                if (!height) {
                    $(item).data('noHeight',true);
                    $(item).height(settings.noSize.h);
                }
                if (!width) {
                    $(item).data('noWidth',true);
                    $(item).width(settings.noSize.w);
                }
                
                if (settings.placeholderImage) {
                    $(item).attr('src',settings.placeholderImage);
                }
                
            };
            
            /**
             * 初始化时触发处于屏幕可视区域的图片
             * 
             */

            dealWithImg();
        }
    }

});

