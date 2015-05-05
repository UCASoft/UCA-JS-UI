(function ($) {

    $.uca = $.uca || {};

    $.uca.control = function () {
        this._init = function () {};
        this.options = {};
    };

    $.uca.control.subclass = function subclass(name, object) {
        name = name.split(".");
        var superclass = this;
        var childclass = function () {
            this._super = superclass;
        }
        childclass.prototype = $.extend(true, {}, new this(), object);
        childclass.subclass = subclass;
        $[name[0]][name[1]] = childclass;
    };

    $.plugin = function (name, object) {
        $.fn[name] = function (options, args) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data(name);
                if (!data) {
                    var instance = new object();
                    instance.options = $.extend({}, instance.options, options);
                    $this.data(name, instance);
                    instance._init(this, instance.options);
                } else {
                    if (options && typeof options == "string") {
                        data[options](this, args);
                    } else {
                        $.extend(data.options, options);
                    }
                }
            });
        }
    }

}(jQuery));