(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
        module.exports = factory();
    } else if (typeof Package !== 'undefined') {
        CanvasClock = factory();
    } else {
        window.CanvasClock = factory();
    }
})(function() {
    'use strict';
    // 绘制旋转的长方形
    /** rectWidth: 150,
     *  rectHeight: 1,
     *  rotate: 0,
     *  top: 150,
     *  left: 150,
     *  fillStyle: '#F44336',
     *  strokeStyle: '#03A9F4',
     *  baseFlag: 'top'
     */
    function draw(option) {
        // 全局的配置项
        var cvs = document.querySelector(option.el || '#canvas');
        if (cvs.getContext) {
            var ctx = cvs.getContext('2d');
            var rectWidth = option.rectWidth || ctxWidth / 2,
                rectHeight = option.rectHeight || 1,
                rotateDeg = Math.PI * 2 / 360 * (option.rotate || 0) - Math.PI / 2,
                translateX = rectHeight * Math.sin(rotateDeg),
                translateY = rectWidth * Math.sin(rotateDeg),
                top = option.top || ctxWidth / 2,
                left = option.left || ctxWidth / 2,
                fillStyle = option.fillStyle || '#F44336',
                strokeStyle = option.strokeStyle || '#03A9F4',
                baseFlag = option.baseFlag || 'top'; // top || left || default: all

            ctx.save();
            ctx.beginPath();
            if (baseFlag === 'all') {
                translateX = rectHeight * Math.sin(rotateDeg);
                translateY = 0;
            } else if (baseFlag === 'top') {
                translateX = 0;
                translateY = 0;
            } else if (baseFlag === 'left') {
                translateX = rectHeight * Math.sin(rotateDeg);
                translateY = -rectHeight * Math.cos(rotateDeg);
            }
            ctx.translate(translateX + left, translateY + top);
            ctx.rotate(rotateDeg);
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = strokeStyle;
            /** 这里应该用lineTo()来画直线
             *  ctx.lineCap = 'round';
             */
            ctx.fillRect(0, 0, rectWidth, rectHeight);
            ctx.restore();
        } else {
            console.log('sorry! not support!');
        }
    }


    var cvs,
        ctx,
        ctxWidth,
        ctxHeight,
        line_width_hour,
        line_height_hour,
        line_width_min,
        line_height_min,
        line_width_sec,
        line_height_sec,
        option;




    function drawTime(H, m, S) {
        // 绘画秒针
        draw({
            el: '#clock',
            rotate: S * 6,
            rectWidth: ctxWidth * 0.5 * option.second.width,
            rectHeight: option.second.height,
            fillStyle: option.second.fillStyle
        });
        // 绘画分针
        draw({
            el: '#clock',
            rotate: m * 6,
            rectWidth: ctxWidth * 0.5 * option.minite.width,
            rectHeight: option.minite.height,
            fillStyle: option.minite.fillStyle
        });
        // 绘画时针
        draw({
            el: '#clock',
            rotate: H * 30,
            rectWidth: ctxWidth * 0.5 * option.hour.width,
            rectHeight: option.hour.height,
            fillStyle: option.hour.fillStyle
        });
    }

    // 绘制圆心的连接点
    function drawDot() {
        var radialGradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 6);
        radialGradient.addColorStop(0, '#fff');
        radialGradient.addColorStop(1, '#000');
        ctx.fillStyle = radialGradient;
        ctx.arc(150, 150, 6, 0, Math.PI * 2);
        ctx.fill();
    }


    function CanvasClock(opt) {
        // TODO:el选项会报错
        cvs = document.querySelector(opt.el || '#clock');
        // 重置canvas属性
        cvs.setAttribute('width', 300);
        cvs.setAttribute('height', 300);
        cvs.style.background = 'url(' + (opt.img || 'http://7xisxb.com1.z0.glb.clouddn.com/Clock_background.png?imageMogr2/thumbnail/300x300') + ') no-repeat center center';
        cvs.style.backgroundSize = '100% 100%';
        if (cvs.getContext) {
            ctx = cvs.getContext('2d');
            ctxWidth = cvs.getAttribute('width');
            ctxHeight = cvs.getAttribute('height'); // 默认宽高相等
            line_width_hour = 0.48; // canvas宽度的一半乘以改基数
            line_height_hour = 3;
            line_width_min = 0.64; // canvas宽度的一半乘以改基数
            line_height_min = 2;
            line_width_sec = 0.9; // canvas宽度的一半乘以改基数
            line_height_sec = 1;
            option = {
                second: {
                    height: line_height_sec,
                    width: line_width_sec,
                    fillStyle: '#464646'
                },
                minite: {
                    height: line_height_min,
                    width: line_width_min,
                    fillStyle: '#464646'
                },
                hour: {
                    height: line_height_hour,
                    width: line_width_hour,
                    fillStyle: '#464646'
                },
                fillStyle: '#F44336',
                baseFlag: 'top'
            };
        } else {
            throw new Error('sorry! your browser do not support canvas');
        }
        Object.assign(option, opt);

    }

    CanvasClock.prototype.init = function() {
        setInterval(function() {
            var time = new Date(),
                H = time.getHours(),
                m = time.getMinutes(),
                S = time.getSeconds();

            ctx.clearRect(0, 0, ctxWidth, ctxHeight); // 清除毛边
            // drawCenter(); // 因为图片会在加载完后再绘制到canvas中，有延迟闪烁，因此通过css设置成canvas的背景图片
            drawTime(H, m, S);
            drawDot();
        }, 1000);

    };

    return CanvasClock;
});
