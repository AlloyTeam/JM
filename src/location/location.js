/**
 * Location
 * @path: JM/src/location.js
 * @version: 1.0.0
 * @author tennylv
 * @date 2014-12-21
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
        root.Location = factory();
    }
})(this, function() {

    var Location = {
        /**
         * 返回是否支持location的api
         * 
         * @param {} 
         * @return {bool} true：支持 fasle：不支持
         */

        isSupportGeo:function(){
            return window.navigator.geolocation ? true : false;
        },

        /**
         * 获取当前的经纬度
         * 
         * @param {object} 获取经纬度的配置项 必须
         * @opt.success {function} 获取经纬度成功的回调函数 必须
         * @param opt.success {object} 获取的经纬度信息position
         * @position.coords.latitude {number}   十进制数的纬度
         * @position.coords.longitude {number}  十进制数的经度
         * @position.coords.accuracy {number}   位置精度 以 m 为单位制定纬度和经度值与实际位置间的差距
         * @position.coords.altitude {number}   海拔，海平面以上以米计 没有则为null
         * @position.coords.altitudeAccuracy {number}   位置的海拔精度 没有则为null
         * @position.coords.heading {number} 方向，从正北开始以度计 0° ≤ heading < 360° 没有则为null  
         * @position.coords.speed  {number} 速度，需要高精度的设备支持 以米/每秒计 没有则为null
         * @position.timestamp  响应的日期/时间
         * @opt.error {function} 获取经纬度失败的回调函数 必须
         * @param opt.error {object} 获取的经纬度信息error
         * @error.code   {number} 错误代码 -1: 不支持此api 0: 不包括在其它错误编号中的错误，需要通过 message 参数查找错误的详细信息 1: 用户禁止获取经纬度 2:获取经纬度信息失败 3:触发timetout设定的时间超时
         * @error.message {string} 错误描述
         * @error.NOT_SUPPORT {number} 错误代码 -1
         * @error.UNKNOWN_ERROR  {number} 错误代码 0
         * @error.PERMISSION_DENIED   {number} 错误代码 1
         * @error.POSITION_UNVAILABLE {number} 错误代码 2
         * @error.TIMEOUT  {number} 错误代码 3
         * @opt.enableHighAccuracy {bool} 是否启用高精确度模式，这将导致机器花费更多的时间和资源来确定位置。默认值为 false
         * @opt.timeout {number} 获取位置信息的超时时间，当实际的时间超过设定的时间时会触发error方法。默认值为Infinity 单位为 ms
         * @opt.maximumAge {number} 位置信息的最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置，否则会从缓存中读取上次的信息。默认为0，单位为 ms
         * @return {} 
         */

        getLocation:function(opt){
            opt = opt || {};
            if (!this.isSupportGeo) {
                opt.error && opt.error({
                    code:-1,
                    message:'Not support',
                    NOT_SUPPORT:-1
                });
                return;
            }
            var option = {
                success : opt.success,
                error : opt.error,
                enableHighAccuracy : opt.enableHighAccuracy || false,
                timeout : opt.timeout || Infinity,
                maximumAge : opt.maximumAge || 0
            };
            window.navigator.geolocation.getCurrentPosition(option.success,option.error,{
                enableHighAccuracy:option.enableHighAccuracy,
                timeout:option.timeout,
                maximumAge:option.maximumAge
            });
        },

        /**
         * 监听当前的经纬度变化，变化时候触发
         * 
         * @param {object} 获取经纬度的配置项 必须
         * @opt.success {function} 获取经纬度成功的回调函数 必须
         * @param opt.success {object} 获取的经纬度信息position
         * @position.coords.latitude {number}   十进制数的纬度
         * @position.coords.longitude {number}  十进制数的经度
         * @position.coords.accuracy {number}   位置精度 以 m 为单位制定纬度和经度值与实际位置间的差距
         * @position.coords.altitude {number}   海拔，海平面以上以米计 没有则为null
         * @position.coords.altitudeAccuracy {number}   位置的海拔精度 没有则为null
         * @position.coords.heading {number} 方向，从正北开始以度计 0° ≤ heading < 360° 没有则为null  
         * @position.coords.speed  {number} 速度，需要高精度的设备支持 以米/每秒计 没有则为null
         * @position.timestamp  响应的日期/时间
         * @opt.error {function} 获取经纬度失败的回调函数 必须
         * @param opt.error {object} 获取的经纬度信息error
         * @error.code   {number} 错误代码 -1: 不支持此api 0: 不包括在其它错误编号中的错误，需要通过 message 参数查找错误的详细信息 1: 用户禁止获取经纬度 2:获取经纬度信息失败 3:触发timetout设定的时间超时
         * @error.message {string} 错误描述
         * @error.NOT_SUPPORT {number} 错误代码 -1
         * @error.UNKNOWN_ERROR  {number} 错误代码 0
         * @error.PERMISSION_DENIED   {number} 错误代码 1
         * @error.POSITION_UNVAILABLE {number} 错误代码 2
         * @error.TIMEOUT  {number} 错误代码 3
         * @opt.enableHighAccuracy {bool} 是否启用高精确度模式，这将导致机器花费更多的时间和资源来确定位置。默认值为 false
         * @opt.timeout {number} 获取位置信息的超时时间，当实际的时间超过设定的时间时会触发error方法。默认值为Infinity 单位为 ms
         * @opt.maximumAge {number} 位置信息的最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置，否则会从缓存中读取上次的信息。默认为0，单位为 ms
         * @return {string} watchId 用来标示当前监听的位置ID
         */

        watchLocation:function(opt){
            opt = opt || {};
            if (!this.isSupportGeo) {
                opt.error && opt.error({
                    code:-1,
                    message:'Not support',
                    NOT_SUPPORT:-1
                });
                return;
            }
            var option = {
                success : opt.success,
                error : opt.error,
                enableHighAccuracy : opt.enableHighAccuracy || false,
                timeout : opt.timeout || Infinity,
                maximumAge : opt.maximumAge || 0
            };
            var watchId = window.navigator.geolocation.watchPosition(option.success,option.error,{
                enableHighAccuracy:option.enableHighAccuracy,
                timeout:option.timeout,
                maximumAge:option.maximumAge
            });
            return watchId;
        },

        /**
         * 清除当前监听的位置的ID
         * 
         * @param {string} 监听的位置ID 必须
         * @return {} 
         */

        clearWatch:function(watchId){
            window.navigator.geolocation.clearWatch(watchId);
        },

        /**
         * 根据两个经纬度来获取 直线距离(Haversine)
         * 
         * @param opt1 {object} 起点经纬度 必须
         * @opt1.longitude {number} 起点经度 必须
         * @opt1.latitude {number} 起点纬度 必须
         * @param opt2 {object} 终点经纬度 必须
         * @opt2.longitude {number} 终点经度 必须
         * @opt2.latitude {number} 终点纬度 必须
         * @return {number} 距离
         */

        caculateDistance:function(opt1,opt2){

            if (opt1.longitude && opt1.latitude && opt2.longitude && opt2.latitude) {
                var R = 6371; 

                var deltaLatitude = (opt2.latitude2-opt1.latitude1)* Math.PI / 180;
                var deltaLongitude = (opt2.longitude2-opt1.longitude1)* Math.PI / 180;
                var latitude1 = opt1.latitude1* Math.PI / 180;
                var latitude2 = opt2.latitude2* Math.PI / 180;

                var a = Math.sin(deltaLatitude/2) * 
                        Math.sin(deltaLatitude/2) + 
                        Math.cos(latitude1) * 
                        Math.cos(latitude2) * 
                        Math.sin(deltaLongitude/2) * 
                        Math.sin(deltaLongitude/2); 

                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c; 
                return d; 
            }
            
        }
    };

    return Lacation;
    
});

