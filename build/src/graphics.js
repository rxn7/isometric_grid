export var Graphics;
(function (Graphics) {
    Graphics.canvas = document.getElementById('canvas');
    Graphics.ctx = Graphics.canvas.getContext('2d');
    function init() {
        if (!Graphics.ctx)
            throw new Error('Failed to get canvas context');
    }
    Graphics.init = init;
    function clear() {
        Graphics.ctx.fillStyle = `rgb(255, 255, 255)`;
        Graphics.ctx.fillRect(0.0, 0.0, Graphics.canvas.clientWidth, Graphics.canvas.clientHeight);
    }
    Graphics.clear = clear;
})(Graphics || (Graphics = {}));
