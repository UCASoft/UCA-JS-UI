if (!Date.prototype.weeksCount) {
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

        Date['prototype'].weeksCount = function () {
            var used = this.firstDayOfMonth() + this.lastDateOfMonth();
            return Math.ceil(used / 7);
        };
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
            return angular && true;
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