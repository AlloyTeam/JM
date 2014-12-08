/**
 * Deferred
 * @path: JM/src/deferred.js
 * @version: 1.0.0
 * @author tennylv
 * @date 2014-12-08
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
        root.Deferred = factory();
    }
})(this, function() {
    
    /**
     * 延迟对象，用来解决异步回调方法嵌套
     * 
     * @function Deferred.when() 接收一个延迟对象 并提供相应的回调方法
     * @function Deferred.promise() 返回一个延迟对象的承诺供调用者调用
     * @function Promise.resolve() 标记当前对象为已经完成
     * @function Promise.reject() 标记当前对象为已经拒绝
     * @function Promise.then() 当前延迟对象为已经完成或者已经拒绝时调用
     * @function Promise.done() 当前延迟对象为已经完成时调用
     * @function Promise.fail() 当前延迟对象为已经拒绝时调用
     * @function Deferred.isReject() 返回当前的延迟对象是否为已经拒绝
     * @function Deferred.isResolve() 返回当前的延迟对象是否为已经完成
     */

    var Deferred = function() {
        this.state = 'pending';
        this.resolveValue;
        this.rejectValue;
        this.deferred = [];
        this.isPromise = true;
    };

    /**
     * 接收一个延迟对象 并提供相应的回调方法，判断是否为延迟对象，否则不做任何操作
     * @param {Promise} 延迟对象的承诺
     * @return {string} 延迟对象
     *
     */

    Deferred.when = function(promise){
        if (promise.promise) {
            return promise;
        }
    };

    /**
     * 标记当前对象为已经完成，state为resolve，只能通过Deferred调用，外部Promise无法调用
     * @param {} 
     * @return {} 
     *
     */

    Deferred.prototype.resolve = function(newValue){
        this.resolveValue = newValue;
        this.state = 'resolve';
        if (this.deferred.length !== 0) {
            this.handler(this.deferred);
        }
    };

    /**
     * 返回一个延迟对象的承诺，包括then，done，done，供调用者调用，只能通过Deferred.promise来获取
     * @param {} 
     * @return {} 
     *
     */

    Deferred.prototype.promise = function(){
        var self = this;
        return {
            promise : true,

            /**
             * 当前延迟对象为已经完成或者已经拒绝时调用支持链式调用
             * @param {function} onResolve当延迟对象完成时调用的回调
             * @param {function} onReject当延迟对象拒绝时调用的回调
             * @return {Promise} 新的Deferred对象的promise
             *
             */

            then : function(onResolve,onReject){
                var newPro = new Deferred();
                self.handler({
                    onResolve: onResolve,
                    onReject: onReject,
                    newPro:newPro
                });
                return newPro.promise();
            },

            /**
             * 当前延迟对象为已经完成时调用
             * @param {function} onDone当延迟对象完成时调用的回调
             * @return {Promise} 当前的Deferred对象的promise
             *
             */

            done : function(onDone){
                self.handler({
                    onResolve: onDone
                });
                return self.promise();
            },

            /**
             * 当前延迟对象为已经拒绝时调用
             * @param {function} onFail当延迟对象完成时调用的回调
             * @return {Promise} 当前的Deferred对象的promise
             *
             */

            fail : function(onFail){
                self.handler({
                    onReject: onFail
                });
                return self.promise();
            }
        };
        
    
    };
    
    /**
     * 延迟对象处理所有方法的handler
     * @param {object} handler
     * @param {handler} onResolve 当延迟对象已经完成时调用
     * @param {handler} onReject 当延迟对象已经拒绝时调用
     * @param {handler} newPro 新的延迟对象的promise
     * @return {} 
     *
     */

    Deferred.prototype.handler = function(handler) {
        if (this.state === 'pending') {
            this.deferred.push(handler);
            return;
        }
        for (var i = 0 ; i < handler.length ; i++) {
            var handlerCallback;
            if(this.state === 'resolve') {
                handlerCallback = handler[i].onResolve;
            } else {
                handlerCallback = handler[i].onReject;
            }
            
            var _value = this[this.state + 'Value'];
            
            if (!handlerCallback) continue;
            var ret = handlerCallback(_value);
            handler[i].newPro && handler[i].newPro[this.state](ret);
        }
        

    };

    /**
     * 返回当前的延迟对象是否为已经拒绝
     * @param {} 
     * @return {} 
     *
     */

    Deferred.prototype.isReject = function() {
        return this.state === 'reject' ? true : false;
    };

    /**
     * 返回当前的延迟对象是否为已经完成
     * @param {} 
     * @return {} 
     *
     */

    Deferred.prototype.isResolve = function() {
        return this.state === 'resolve' ? true : false;
    };
    
    /**
     * 标记当前对象为已经拒绝，state为reject，只能通过Deferred调用，外部Promise无法调用
     * @param {} 
     * @return {} 
     *
     */

    Deferred.prototype.reject = function(newValue) {
        this.rejectValue = newValue;
        this.state = 'reject';
        if (this.deferred) {
            this.handler(this.deferred);
        }
    };

    return Deferred
});

