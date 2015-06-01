if (!Date.prototype.firstDayOfMonth) {
    (function () {
        Date['prototype'].firstDayOfMonth = function () {
            var year = this.getFullYear();
            var monthNumber = this.getMonth();
            return (new Date(year, monthNumber, 1)).getDay();
        };

        Date['prototype'].lastDateOfMonth = function () {
            var year = this.getFullYear();
            var monthNumber = this.getMonth();
            return (new Date(year, monthNumber + 1, 0)).getDate();
        }
    }());
}

(function ($) {
    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

(function ($) {

    $.uca = $.uca || {};

    $.uca.angular = {

        _isConnected: function () {
            return window.angular && true;
        },

        _compile: function (element) {
            if (this._isConnected()) {
                angular.element(element).injector().invoke(function ($compile) {
                    var scope = angular.element(element).scope();
                    $compile(element)(scope);
                });
            }
        }
    }

    $.uca.control = function () {
        this._init = function () {};
        this.options = {};
    };

    $.uca.control.subclass = function subclass(name, object) {
        name = name.split(".");
        var superclass = this;
        var childclass = function () {
            this._super = new superclass();
        }
        childclass.prototype = $.extend(true, {}, new this(), object);
        childclass.subclass = subclass;
        $[name[0]][name[1]] = childclass;
    };

    $.uca.plugin = function (name, object) {
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

    $("body").append("<div style=\"position: absolute; top: 0; right: 0;\" id=\"uca-log\"></div>");

    $.uca.log = function (message) {
        $("#uca-log").append("<p>" + message + "</p>");
    }

}(jQuery));