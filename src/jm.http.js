//http
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
});