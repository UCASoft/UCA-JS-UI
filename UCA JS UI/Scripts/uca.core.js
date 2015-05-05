﻿(function ($) {

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
                var action = typeof options == "string";
                var data = $this.data(name);
                if (!data) {
                    data = new object();
                    if (!action)
                        data.options = $.extend({}, data.options, options);
                    $this.data(name, data);
                    data._init(this, data.options);
                }
                if (action) {
                    data[options](this, args);
                } else {
                    $.extend(data.options, options);
                }

            });
        }
    }

}(jQuery));