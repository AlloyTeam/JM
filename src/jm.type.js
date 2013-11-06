//type
J.$package(function(J){

    var ots=Object.prototype.toString;

    var type={
        isArray : function(o){
            return o && (o.constructor === Array || ots.call(o) === "[object Array]");
        },
        isObject : function(o) {
            return o && (o.constructor === Object || ots.call(o) === "[object Object]");
        },
        isBoolean : function(o) {
            return (o === false || o) && (o.constructor === Boolean);
        },
        isNumber : function(o) {
            return (o === 0 || o) && o.constructor === Number;
        },
        isUndefined : function(o) {
               return typeof(o) === "undefined";
        },
        isNull : function(o) {
               return o === null;
        },
        isFunction : function(o) {
               return o && (o.constructor === Function);
        },
        isString : function(o) {
            return (o === "" || o) && (o.constructor === String);
        }
    }
    J.type=type;
});