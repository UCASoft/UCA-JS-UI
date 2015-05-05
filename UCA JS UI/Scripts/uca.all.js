(function ($) {

    $.uca.control.subclass("uca.accordion", {

        _togglePanel: function (panel, style) {
            panel.toggleClass("panel-primary panel-success");
            $(".accordion-body", panel).toggle(style);
        },

        _init: function (element, options) {
            var $element = $(element);
            if (options.orientation === "horizontal") {
                $element.addClass("accordion-horizontal");
            }
            $element.addClass("panel-group");
            var self = this;

            var items = options.items;
            if (items.length > 0) {
                for (var i in items) {
                    if (items.hasOwnProperty(i)) {
                        var item = items[i];
                        var panel = $("<div class=\"accordion-panel\"></div>");
                        var header = $("<div class=\"accordion-header\"></div>");
                        header.append($("<h4></h4>").text(item.header));
                        panel.append(header);
                        var body = $("<div class=\"accordion-body\"></div>");
                        body.html(item.body);
                        panel.append(body);
                        $element.append(panel);
                    }
                }
            }

            $(".accordion-panel", $element).each(function () {
                var panel = $(this);
                panel.addClass("panel");
                var header = $(".accordion-header", panel);
                header.addClass("panel-heading");
                header.children().addClass("panel-title");
                if (panel.hasClass("disabled")) {
                    panel.addClass("panel-default");
                } else {
                    panel.addClass("panel-success");
                    header.click(function () {
                        if (!panel.hasClass("panel-primary")) {
                            self._togglePanel($(".panel-primary", $element), "slow");
                            self._togglePanel(panel, "slow");
                        }
                    });
                }
                var body = $(".accordion-body", panel);
                body.addClass("panel-body");
            });

            var maxHeight = 0;
            var bodies = $(".accordion-body", $element);
            bodies.each(function () {
                var $this = $(this);
                if (maxHeight < $this.height()) {
                    maxHeight = $this.height();
                }
            });            

            if ($element.hasClass("accordion-horizontal")) {
                $(".accordion-panel", $element).not(0).css("margin-top", "-2px");
                var headers = $(".accordion-header", $element);
                headers.children().each(function () {
                    var $this = $(this);
                    var span = $("<span></span>");
                    span.text($this.text());
                    $element.append(span);
                    if (maxHeight < span.width() + 10) {
                        maxHeight = span.width() + 10;
                    }
                    span.remove();
                });
                headers.height(maxHeight + 10);
                $(".panel-title", $element).each(function () {
                    var $this = $(this);
                    $this.html($.trim($this.text()).replace(/\s/g, "&nbsp;"));
                });
                var maxWidth = 0;
                bodies.each(function () {
                    var $this = $(this);
                    if (maxWidth < $this.width()) {
                        maxWidth = $this.width();
                    }
                });
                bodies.width(maxWidth);
            }

            bodies.height(maxHeight);

            bodies.css("display", "none");

            var started = $(".accordion-panel[aria-expanded = 'true']", $element);
            if (started.length === 0) {
                started = $(".accordion-panel", $element).first();
            }

            this._togglePanel(started);
        },

        changeEnabled: function (element, options) {
            var self = this;
            var panel = $(".accordion-panel", element).eq(options.index);
            var header = $(".accordion-header", panel);
            if (options.enabled) {
                panel.removeClass("panel-default disabled").addClass("panel-success");
                header.click(function () {
                    if (!panel.hasClass("panel-primary")) {
                        self._togglePanel($(".panel-primary", element), "slow");
                        self._togglePanel(panel, "slow");
                    }
                });
            } else {
                panel.removeClass("panel-success").addClass("panel-default disabled");
                header.unbind("click");
            }
        },

        options: {
            orientation: "vertical",
            items: []
        }
    });

    $.plugin("accordion", $.uca.accordion);

}(jQuery));