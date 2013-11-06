// detect vender prefix
J.$package(function(J){
    var styles, pre, dom;

    if(window.getComputedStyle){
        styles = window.getComputedStyle(document.documentElement, '');
        pre = (Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1];
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

        J.prefix = {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre
        };
    }
    // IE8- don't support `getComputedStyle`, so there is no prefix
    else{
        J.prefix = {
            dom: '',
            lowercase: '',
            css: '',
            js: ''
        }
    }
});