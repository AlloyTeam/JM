/**
 * 增强型本地存储
 *
 * 功能：
 * 1.  配置命名空间。不同业务就算用同一个域名也可以避免key值相互覆盖
 * 2.  存储时带上有效期。取值的时候如果发现数据过期会自动干掉
 * 3.  存储的时候如果发现存储空间满了，会自动干掉过期的key，如果没有过期的key，
 *     则把当前命名空间下的key最旧的1/3干掉
 * 4.  覆盖localStorage.clear函数
 * 5.  配置重要键值，重要键值只有过期或用户明确remove才会被删除，clear正常释放空间时不会被清除
 * 
 * 建议：页面初始化的时候执行一次清除过期数据
 */

;
(function () {

    // 配置
    var nameSpace = 'QQ';                   // 命名空间
    var storageSpace = window.localStorage; // 使用的存储空间
    var metaName = '_Meta';


    // 底层set函数
    var _set = function(key, value) {
        try{
            storageSpace.setItem(key, value);
        } catch(err) {
            // 没有空间了？清理空间，再试
            clear(false);
            try{
                // 此时还是可能失败报错
                // 有可能是因为上一步没有空出空间
                // 也有可能是一些定制机的磁盘配额为0导致不能写(IOS没开启LS)
                storageSpace.setItem(key, value);
            } catch(err) {
                // 如果空间还是不够，就清掉比较旧的数据，清掉1/3
                deepClear();

                try{
                    storageSpace.setItem(key, value);
                } catch(err) { 
                    // 如果还是不够，就把全部都清掉。
                    for(var len = localStorage.length; len--;) {
                        var keyname = localStorage.key(len);
                        localStorage.removeItem(keyname);
                    }
                    try {
                        var meta = {};
                        meta[key] = {};
                        meta[key].update = +new Date();
                        setMeta(meta);
                        storageSpace.setItem(key, value);
                    } catch(err) {
                        throw new Error('Content is too large');
                    }           
                }
            }
        }
    };

    //set的同时更新Meta状态
    var set = function (key, value, opt) {
        console.log('set: ' + key);
        var opt = opt || {},
            data = JSON.stringify(value);

        var storageMeta = getMeta();
        storageMeta[key] = {};
        if(opt.expire) {
            storageMeta[key].expire =  +new Date() + opt.expire;
        }
        if(opt.important) {
            storageMeta[key].important = true;
        }
        storageMeta[key].update = +new Date();
        setMeta(storageMeta);
        _set(nameSpace + ':' + key, data);
    };

    //
    var get = function (key, opt) {
        var storageMeta = getMeta(),
            expireTime = storageMeta[key] ? storageMeta[key].expire : '';
        if(expireTime && +new Date() > expireTime) {
            remove(key);
            return null;
        }

        var data = storageSpace.getItem(nameSpace + ':' + key);
        if(data !== 'null' && data !== 'false') {
            try{
                data = JSON.parse(data);
            } catch(err) {
                
            }
        }
        !storageMeta[key] && (storageMeta[key] = {}); 
        storageMeta[key].update = +new Date();
        setMeta(storageMeta);
        return data;
    };

    var remove = function(key, updateMeta) {
        console.log('remove: ' + key);
        storageSpace.removeItem(nameSpace + ':' + key);
        var storageMeta = getMeta();
        delete storageMeta[key];
        setMeta(storageMeta);
    };

    var getMeta = function () {
        return JSON.parse(storageSpace.getItem(nameSpace + ':' + metaName)) || {};
    }

    var setMeta = function (obj) {       
        _set(nameSpace + ':' + metaName, JSON.stringify(obj));
    }

    var clear = function(onlyExpire, userClear){
        var now = +new Date();
        var storageMeta = getMeta();
        for(var o in storageMeta) {
          if(storageMeta[o] && storageMeta[o].expire < now) {
            remove(o);
          }
        }
    };

    var deepClear = function () {       
        var storageMeta = getMeta();
        var len = Math.ceil(Object.keys(storageMeta).length/3);
        var temp = [];
        for(var o in storageMeta) {
            var time = storageMeta[o].update;
            var important = storageMeta[o].important;
            if(time && !important) {
                for(var i = 0; i < len ; i++) {
                   if(!temp[i] || time < temp[i]) {
                       break; 
                   }
                }
                temp.splice(i, 0, o);
            }
        }
        for(var i = 0; i < len; i++) {
            remove(temp[i]);
        }
    }

    var storage = window.storage = window.storage || {};
    var emptyFunc = function(){};

    if(!storageSpace) {
        storage.set =
        storage.get =
        storage.remove =
        storage.clear = emptyFunc;
    } else {
        storage.set = set;
        storage.get = get;
        storage.remove = remove;
        storage.deepClear = deepClear;
        storage.enable = true;
        storage.clear = storageSpace.clear = clear;
    }
})();