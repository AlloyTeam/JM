J.$package(function(J){
    var c = navigator.connection || {type:0};
    var ct = ["unknow","ethernet","wifi","cell_2g","cell_3g"];
    J.connectType = ct[c.type]; 
});