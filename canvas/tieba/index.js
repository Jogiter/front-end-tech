// https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_usage
// https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/touches
// https://developer.mozilla.org/zh-CN/docs/Web/API/Touch
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#Example
// [canvas画图--流畅没有齿痕的线，图像画线](http://www.cnblogs.com/muzijia/archive/2013/01/02/2841967.html)
// [understanding-save-and-restore-for-the-canvas-context](http://html5.litten.com/understanding-save-and-restore-for-the-canvas-context/)
// [实现绘制一个像素宽的细线](http://www.jb51.net/html5/95741.html)
// [demo](https://jsfiddle.net/0wwy04he/)
(function(factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Commonjs || nodejs
        module.exports = factory;
    } else if (typeof define == 'function' && define.amd) {
        // amd
        define(['canvas'], factory);
    } else {
        // browser
        window['canvas'] = factory();
    }
})(function() {
    // canvas code here
    function Canvas(option) {
        this.init(option);
    }

    Canvas.prototype = {
        init: function(option) {
            this.setOption(option);
            this.cvs = document.querySelector(this.option.selector);
            this.ctx = this.cvs.getContext('2d');
            // 设置全屏
            // this.cvs.setAttribute('width', this.option.width || document.body.clientWidth - 20);
            // this.cvs.setAttribute('height', this.option.height || document.body.clientWidth - 20);
            this.handleEvent();
        },
        setOption: function(option) {

            /**
             * [DEFAULT_OPTITON description]
             * @type {Object}
                fillStyle: "#000000"
                font: "10px sans-serif"
                globalAlpha: 1
                globalCompositeOperation: "source-over"
                imageSmoothingEnabled: true
                lineCap: "butt"
                lineDashOffset: 0
                lineJoin: "miter"
                lineWidth: 1
                miterLimit: 10
                shadowBlur: 0
                shadowColor: "rgba(0, 0, 0, 0)"
                shadowOffsetX: 0
                shadowOffsetY: 0
                strokeStyle: "#000000"
                textAlign: "start"
                textBaseline: "alphabetic"
                webkitImageSmoothingEnabled: true
             */
            var DEFAULT_OPTITON = {
                selector: '#canvas',
                quality: 1
            };
            // 修改画布的画笔
            // TODO：模拟jquery的extend扩展option对象
            this.option = option;
        },
        line: function() {
            // 画线

        },
        img: function() {
            // 画图

        },
        txt: function() {
            // 画文字

        },
        erase: function() {
            // 橡皮擦

        },
        clean: function() {


        },
        save: function(type) {
            // 保存成图片或者svg

        },
        handleEvent: function() {
            var _this = this,
                drawFlag = false;

            // 绘画开始
            function drawStart(e) {
                if (e.which === 1 || e.which === 0) {
                    // 禁止页面的滚动和滑动等事件
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    drawFlag = true;
                    var ex0 = e.pageX || e.touches.item(0).pageX,
                        ey0 = e.pageY || e.touches.item(0).pageY;
                    _this.ctx.beginPath();
                    _this.ctx.moveTo(ex0, ey0);
                }
            }

            // 绘画结束
            function drawEnd(e) {
                drawFlag = false;
            }

            // 绘画
            function draw(e) {
                if (drawFlag) {
                    var ex1 = e.pageX || e.touches[0].pageX,
                        ey1 = e.pageY || e.touches[0].pageY;
                    _this.ctx.strokeStyle = '#ba55d3';
                    _this.ctx.lineWidth = 3;
                    _this.ctx.lineTo(ex1, ey1);
                    _this.ctx.stroke();
                }
            }


            this.cvs.addEventListener('mousedown', drawStart, false);
            this.cvs.addEventListener('mouseup', drawEnd, false);
            this.cvs.addEventListener('mouseleave', drawEnd, false);
            this.cvs.addEventListener('mousemove', draw, false);


            this.cvs.addEventListener('touchstart', drawStart, false);
            this.cvs.addEventListener('touchend', drawEnd, false);
            this.cvs.addEventListener('touchmove', draw, false);

            // 清空画布
            document.querySelector('#cvs-clean').onclick = function(e) {
                _this.ctx.beginPath();
                // 清空画布
                _this.ctx.clearRect(0, 0, _this.cvs.getAttribute('width'), _this.cvs.getAttribute('height'));
                _this.ctx.closePath();
            };

            // 保存canvas，将其保存成jpeg图片
            document.querySelector('#cvs-save').onclick = function(e) {
                var imgData = _this.cvs.toDataURL('img/jpeg', _this.option.quality),
                    img = document.createElement('img');
                img.src = imgData;
                img.style.border = '2px solid #ba55d3';
                img.classList.add('canvas-img');
                var canvasImg = document.querySelectorAll('.canvas-img');
                if (canvasImg && canvasImg.length) {
                    canvasImg[0].setAttribute('src', imgData);
                } else {
                    document.body.appendChild(img);
                }
            };

        }
    }

    return Canvas;
});