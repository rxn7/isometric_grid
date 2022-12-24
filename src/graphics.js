export var Graphics;
(function (Graphics) {
    Graphics.canvas = document.getElementById('canvas');
    Graphics.ctx = Graphics.canvas.getContext('2d', { alpha: false });
    function init() {
        if (!Graphics.ctx)
            throw new Error('Failed to get canvas context');
        Graphics.ctx.save();
    }
    Graphics.init = init;
    function clear() {
        Graphics.ctx.fillStyle = 'skyblue';
        Graphics.ctx.fillRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
    }
    Graphics.clear = clear;
})(Graphics || (Graphics = {}));
