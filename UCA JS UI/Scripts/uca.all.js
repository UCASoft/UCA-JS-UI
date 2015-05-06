(function ($) {

    $.uca.control.subclass("uca.accordion", {

        _resize: function (element) {
            var $element = $(element);
            var panels = $element.children(".accordion-panel");

            var maxHeight = 0;
            var bodies = panels.children(".accordion-body");
            bodies.each(function () {
                var $this = $(this);
                if (maxHeight < $this.height()) {
                    maxHeight = $this.height();
                }
            });

            if ($element.hasClass("accordion-horizontal")) {
                panels.not(0).css("margin-top", "-2px");
                var headers = panels.children(".accordion-header");
                var div = $("<div style=\"overflow-x: auto;\"></div>");
                var span = $("<span></span>");
                div.append(span);
                $element.append(div);
                headers.children().each(function () {
                    var $this = $(this);
                    span.text($this.text());
                    if (maxHeight < span.width() + 10) {
                        maxHeight = span.width() + 10;
                    }
                });
                div.remove();
                headers.height(maxHeight + 10);
                headers.children(".panel-title").each(function () {
                    var $this = $(this);
                    $this.html($.trim($this.text()).replace(/\s/g, "&nbsp;"));
                });
                var maxWidth = 0;
                var data = $element.data("accordion");
                if (data && data.options.width === "fill_parent") {
                    var headersWidth = headers.length * (headers.width() + 50);
                    maxWidth = $element.parent().width() - headersWidth;
                } else {                    
                    bodies.each(function () {
                        var $this = $(this);
                        if (maxWidth < $this.width()) {
                            maxWidth = $this.width();
                        }
                    });
                }
                bodies.width(maxWidth);
            }

            bodies.height(maxHeight);
        },

        _preparePanels: function (element, panels) {
            var $element = $(element);
            var self = this;
            panels.each(function () {
                var panel = $(this);
                panel.addClass("panel");
                var header = panel.children(".accordion-header");
                header.addClass("panel-heading");
                header.children().addClass("panel-title");
                if (panel.hasClass("disabled")) {
                    panel.addClass("panel-default");
                } else {
                    panel.addClass("panel-success");
                    header.click(function () {
                        if (!panel.hasClass("panel-primary")) {
                            self._togglePanel($element.children(".panel-primary"), "slow");
                            self._togglePanel(panel, "slow");
                        }
                    });
                }
                var body = panel.children(".accordion-body");
                body.addClass("panel-body");
            });

            setTimeout(function () {
                self._resize(element);
            }, 50);
        },

        _togglePanel: function (panel, style) {
            panel.toggleClass("panel-primary panel-success");
            panel.children(".accordion-body").toggle(style);
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
                $element.empty();
                this.addItems(element, items);
            }
            var panels = $element.children(".accordion-panel");
            this._preparePanels(element, panels);

            var bodies = panels.children(".accordion-body");
            bodies.css("display", "none");

            var started = $element.children(".accordion-panel[aria-expanded = 'true']");
            if (started.length === 0) {
                started = panels.first();
            }

            this._togglePanel(started);
            $(window).resize(function () {
                self._resize($element);
            });
        },

        changeEnabled: function (element, options) {
            var self = this;
            var $element = $(element);
            var panel = $element.children(".accordion-panel").eq(options.index);
            var header = panel.children(".accordion-header");
            if (options.enabled) {
                panel.removeClass("panel-default disabled").addClass("panel-success");
                header.click(function () {
                    if (!panel.hasClass("panel-primary")) {
                        self._togglePanel($element.children(".panel-primary"), "slow");
                        self._togglePanel(panel, "slow");
                    }
                });
            } else {
                panel.removeClass("panel-success").addClass("panel-default disabled");
                header.unbind("click");
            }
        },

        addItems: function (element, items) {
            var $element = $(element);
            var panels = [];
            for (var i in items) {
                if (items.hasOwnProperty(i)) {
                    var item = items[i];
                    var panel = $("<div class=\"accordion-panel\"></div>");
                    var header = $("<div class=\"accordion-header\"></div>");
                    header.append($("<h4></h4>").text(item.header));
                    panel.append(header);
                    var body = $("<div class=\"accordion-body\" style=\"display: none;\"></div>");
                    body.html(item.body);
                    panel.append(body);
                    $element.append(panel);
                    panels.push(panel);
                }
            }
            this._preparePanels(element, $(panels));
        },

        options: {
            orientation: "vertical",
            items: [],
            width: "fill_parent"
        }
    });

    $.plugin("accordion", $.uca.accordion);

}(jQuery));