﻿(function ($) {

    $.uca.control.subclass("uca.comboBox", {

        _bindUlClick: function(ul, input, hidden, data) {
            ul.on("click", "li a", function () {
                var a = $(this);
                ul.add("li a").removeClass("selected");
                a.addClass("selected");
                if ($.uca.angular._isConnected()) {
                    input.keydown();
                    hidden.keydown();
                }
                input.val(a.text());
                hidden.val(a.attr("value"));
                var item = data.items[a.attr("value")];
                if (data.seletedItem !== item) {
                    data.seletedItem = item;
                    if (data.options.onSelectIndexChanged) {
                        data.options.onSelectIndexChanged(item);
                    }
                }
            });
        },

        _bindDropDownScroll: function(cover) {
            cover.children("[data-toggle='dropdown']").click(function () {
                var $this = $(this);
                var selected = $("a.selected", $this.parent());
                if (selected.length > 0) {
                    setTimeout(function () {
                        $("ul", $this.parent()).animate({
                            scrollTop: selected.position().top - 5
                        }, 250);
                    }, 100);
                }
            });
        },
        
        _init: function (element, options) {
            var $element = $(element);
            var self = this;
            var data = this;
            if ($element[0].tagName === "SELECT") {
                var $parent = $element.parent();
                var cover = $("<div></div>").addClass("input-group dropdown").attr("style", $element.attr("style")).attr("data-id", $element.attr("id"));
                var input = $("<input type=\"text\" class=\"form-control\" data-toggle=\"dropdown\" />").attr("placeholder", options.placeholder);
                var hidden = $("<input type=\"text\" style=\"display: none;\" />");
                cover.append(input);
                cover.append(hidden);
                cover.append($("<span class=\"input-group-addon\" data-toggle=\"dropdown\" />").append("<span class=\"caret\" />"));
                var items = $element.children("option");
                if (items.length > 0) {
                    var ul = $("<ul/>").addClass("dropdown-menu").attr("role", "menu").css("max-height", "250px").css("overflow-y", "auto");
                    data.items = [];
                    items.each(function () {
                        var $item = $(this);
                        var item = { value: $item.attr("value"), text: $item.text(), data: null };
                        data.items[item.value] = item;
                        ul.append($("<li/>").addClass("presentation").append(self._createItem(item)));
                    });
                    self._bindUlClick(ul, input, hidden, data);
                    cover.append(ul);
                    cover.bind("click", function () {
                        ul.css("width", input.width() + 25 + "px");
                    });
                }
                $parent.append(cover);
                if ($.uca.angular._isConnected()) {
                    if ($element.is("[uca-text-ng-model]")) {
                        input.attr("ng-model", $element.attr("uca-text-ng-model"));
                        $.uca.angular._compile(input);
                    }
                    if ($element.is("[uca-value-ng-model]")) {
                        hidden.attr("ng-model", $element.attr("uca-value-ng-model"));
                        $.uca.angular._compile(hidden);
                    }
                }
                $element.css("display", "none");
                self._bindDropDownScroll(cover);
            }
        },

        _createItem: function(item) {
            var a = $("<a/>").addClass("menuitem").attr("value", item.value);
            if (item.text) {
                a.text(item.text);
            } else {
                a.html('&nbsp;');
            }
            return a;
        },

        options: {
            placeholder: "Choose a list item"
        }

    });

    $.uca.control.subclass("uca.accordion", {
        _resize: function (element, correction) {
            var corr = 50;
            if (correction)
                corr = correction;
            var $element = $(element);
            var panels = $element.children(".accordion-panel");
            var data = $element.data("accordion");

            var maxHeight;
            if (data && data.options.height) {
                maxHeight = data.options.height;
            } else {
                maxHeight = 0;
            }
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
                if (data && data.options.width === "fill_parent") {
                    var headersWidth = headers.length * (headers.width() + corr);
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
            self._resize(element, 65);
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
            width: "fill_parent",
            height: 0
        }
    });

    $.plugin("comboBox", $.uca.comboBox);
    $.plugin("accordion", $.uca.accordion);

}(jQuery));