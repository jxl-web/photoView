var total = 17;
var zWin = $(window);
var render = function() {
    var padding = 2;
    var winWidth = zWin.width();
    var picWidth = Math.floor(winWidth-padding*3)/4; //单张图片的宽度
    var tmpl = '';
    for(var i = 1;i<=total; i++){
        var p = padding;
        var imgSrc = 'images/'+i+ '.jpg';
        if(i % 4 == 1) {
            p = 0;
        }
        tmpl += '<li data-id="'+i+'" class="animated bounceIn" style="width: '+picWidth+'px; height: '+picWidth+';padding-left: '+p+'px; padding-top: '+padding+'px"> ' +
            '<canvas id = "cvs_'+i+'"> </li>';
        var imageObj = new Image();
        imageObj.index = i;
        imageObj.onload = function() {
            var cvs = $('#cvs_'+this.index)[0].getContext("2d");
            cvs.width = this.width;
            cvs.height = this.height;
            cvs.drawImage(this,0,0);
        };
        imageObj.src = imgSrc;
    }
    $('#container').html(tmpl);
};
render();
//加载大图
var wImage = $('#large_img');
var domImage = wImage[0];
var loadImg = function(id, callback) {
    $('#large_container').css({
        width: zWin.width(),
        height: zWin.height()
    }).show();
    var imgsrc = 'images/'+id+'.large.jpg';
    var imageObj = new Image();
    imageObj.onload = function() {
        var w = this.width;
        var h = this.height;
        var winWidth = zWin.width();
        var winHieght = zWin.height();
        var realW = winHieght * w / h;
        var realH = winWidth * h / w;
        var paddingLeft = parseInt((winWidth - realW)/2);
        var paddingTop = parseInt((winHieght - realH)/2);
        wImage.css('width', 'auto').css('height', 'auto');
        wImage.css('padding-left', '0px').css('padding-top', '0px');
        if(h / w > 1.2){ //竖图
            wImage.attr('src', imgsrc).css('height', winHieght).css('padding-left', paddingLeft);
        }else{
            wImage.attr('src', imgsrc).css('width', winWidth).css('padding-top',paddingTop);
        }
        callback&&callback();
    };
    imageObj.src = imgsrc;
};
var cid;
//事件代理
$('#container').delegate('li', 'tap', function() {
    var _id = cid = $(this).attr('data-id');
    loadImg(_id);
});
$('#large_container').tap(function() {
    $(this).hide();
}).swipeLeft(function() {
    cid ++;
    if(cid > total) {
        cid = total;
    }else{
        loadImg(cid, function() {
            domImage.addEventListener('webkitAnimationEnd', function() {
                wImage.removeClass('animated bounceInRight');
                domImage.removeEventListener('webkitAnimationEnd');
            },false);
            wImage.addClass('animated bounceInRight');
        });
    }
}).swipeRight(function() {
    cid --;
    if(cid < 1) {
        cid = 1;
    }else{
        loadImg(cid, function () {
            domImage.addEventListener('webkitAnimationEnd', function() {
                wImage.removeClass('animated bounceInLeft');
                domImage.removeEventListener('webkitAnimationEnd');
            },false);
            wImage.addClass('animated bounceInLeft');
        });
    }
});