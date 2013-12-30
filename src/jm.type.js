//type
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
});