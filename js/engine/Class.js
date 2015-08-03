/**
 * Class
 * Utility to make objects behave like in class-based language
 */

var noop = function () {};

var Class = function (proto, parent) {
    var tmp = function () {};
    tmp.prototype = parent.prototype;

    var ctor = function () {
        (this.initialize || noop).apply(this, arguments);
    };

    ctor.prototype = new tmp();
    ctor.superconstructor = parent;
    ctor.prototype.constructor = ctor;
    _.extend(ctor.prototype, proto);
    return ctor;
};

module.exports = function (proto) {
    //Class is the parent class of all
    var klass = new Class(proto, Class);
    klass.extend = function (proto) {
        return Class(proto, this);
    };
    return klass;
};