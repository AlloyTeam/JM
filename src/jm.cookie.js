//cookie
J.$package(function(J){
    var domainPrefix = window.location.hostname;
    var cookie = {
        set : function(name, value, domain, path, hour) {
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + 3600000 * hour);
            }
            window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
            return true;
        },
        get : function(name) {
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        remove : function(name, domain, path) {
            window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        }
    };
    J.cookie = cookie;

});
