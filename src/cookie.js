/**
 * CookieUtil
 * @path: JM/src/cookie.js
 * @version: 1.0.0
 * @author tennylv
 * @date 2014-12-07
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
        root.cookieUtil = factory();
    }
})(this, function() {

    var cookieUtil = {
    	/**
    	 * 设置cookie中对应key的到对应的value
    	 * 
    	 * @param {string} 对应的key值 必须
    	 * @param {string} 对应的value值 必须
    	 * @param {object} options的cookie 可选项
    	 * @options {string} options.path cookie的对应路径默认为当前路径
    	 * @options {number} options.expiresTime cookie的过期时间
    	 * @options {string} options.domain cookie的对应域名
    	 * @return {} 
    	 */
    	setCookie : function(key, value, options){
    		var opt = options || {};
    		opt.path = opt.path || "/";
    		if ('number' == typeof opt.expires) {
    		    opt.expiresTime = new Date();
    		    opt.expiresTime.setTime(opt.expiresTime.getTime() + opt.expires);
    		}
    		document.cookie =
    		    encodeURIComponent(key) + "=" + encodeURIComponent(value)
    		    + (opt.path ? "; path=" + opt.path : "")
    		    + (opt.expiresTime ? "; expires=" + opt.expiresTime.toGMTString() : "")
    		    + (opt.domain ? "; domain=" + opt.domain : "")
		},
		/**
		 * 获取cookie中对应key的值
		 * @param {string} 对应的key值 必须
		 * @return {string} 对应的value 
		 *
		 */
		getCookie : function(key){
			key = encodeURIComponent(key);
			var reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)");
			var value = document.cookie.match(reg);
			var result;
			if (value) {
			    result = decodeURIComponent(value[2]) || null;
			} else {
			    result = null;
			}
			return result;
		},
		/**
		 * 删除cookie中对应key的value值
		 * @param {string} 对应的key值 必须
		 * @return {} 
		 *
		 */
		removeCookie : function(key){
			var opt = {
			    expires : 0
			};
			this.setCookie(key, '', opt);
		}
    };
    return cookieUtil;
    
});

