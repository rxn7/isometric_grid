export var StringHelper;
(function (StringHelper) {
    function basename(path) {
        return path.substring(path.lastIndexOf('/') + 1);
    }
    StringHelper.basename = basename;
    function stripExtension(path) {
        return path.substring(0, path.lastIndexOf('.'));
    }
    StringHelper.stripExtension = stripExtension;
})(StringHelper || (StringHelper = {}));
