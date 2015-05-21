(function ($) {

    $.uca.control.subclass("uca.datepicker", {

        _buildCalendar: function (element, selectedMonth) {
            var $element = $(element);
            $element.addClass("datepicker");
            var currentDate = new Date();
            var self = $element.data("datepicker");
            var data = self;
            var calendar = $element.children("table");
            if (calendar.length === 1) {
                calendar.empty();
            } else {
                calendar = $("<table style=\"position: absolute;\"></table>");
            }
            var monthWidth = 0;
            var span = $("<span></span>");
            $element.append(span);
            for (var i = 0; i < data.options.local.months.length; i++) {
                span.text(data.options.local.months[i]);
                if (monthWidth < span.width()) {
                    monthWidth = span.width();
                }
            }
            monthWidth += 20;
            span.remove();
            var header = $("<thead></thead>").append("<tr><th class=\"glyphicon glyphicon-chevron-left\"></th><th colspan=\"5\"><table style=\"width: 100%;\"><tbody><tr><td style=\"width: " + monthWidth + "px; text-align:center;\">" + data.options.local.months[selectedMonth.getMonth()] + "</td><td style=\"text-align: center;\">" + selectedMonth.getFullYear() + "</td></tr></tbody></table></th><th class=\"glyphicon glyphicon-chevron-right\"></th></tr>");
            header.find("th.glyphicon").bind("click", function () {
                var $this = $(this);
                var newMonth = selectedMonth.getMonth();
                var newYear = selectedMonth.getFullYear();
                if ($this.hasClass("glyphicon-chevron-left")) {
                    newMonth -= 1;
                    if (newMonth < 0) {
                        newMonth = 11;
                        newYear -= 1;
                    }
                    
                } else {
                    newMonth += 1;
                    if (newMonth > 11) {
                        newMonth = 0;
                        newYear += 1;
                    }
                }
                self._buildCalendar(element, new Date(newYear, newMonth));
            });
            var number;
            var weekRow = $("<tr></tr>");
            for (var dn = 0; dn < 7; dn++) {
                number = dn + data.options.local.firstWeekDay;
                if (number > 6) {
                    number -= 7;
                }
                weekRow.append($("<th>" + data.options.local.weekDays[number] + "</th>"));
            }
            header.append(weekRow);
            var body = $("<tbody></tbody>");
            var d = 1;
            for (var w = 0; w < 6; w++) {
                var tr = $("<tr></tr>");
                for (var n = 0; n < 7; n++) {
                    var td = $("<td></td>");
                    if (w === 0) {
                        number = selectedMonth.firstDayOfMonth() - data.options.local.firstWeekDay;
                        if (number < 0)
                            number += 7;
                        if (n >= number) {
                            td.text(d++);
                        }
                    } else if (d <= selectedMonth.lastDateOfMonth()) {
                        td.text(d++);
                    }
                    if (td.text()) {                        
                        td.addClass("dates");
                        if (selectedMonth.getFullYear() === currentDate.getFullYear() && selectedMonth.getMonth() === currentDate.getMonth() && currentDate.getDate() == td.text()) {
                            td.addClass("current-date");
                        }
                    }
                    tr.append(td);
                }
                if (tr.text() === "") {
                    tr.height(27);
                }
                body.append(tr);
            }
            var footer = $("<tfoot><tr><td colspan=\"7\">" + data.options.local.today + "</td></tr></tfoot>");
            footer.find("td").bind("click", function () {
                self._buildCalendar(element, new Date());
            });
            calendar.append(header);
            calendar.append(body);
            calendar.append(footer);
            $element.append(calendar);
        },

        _init: function (element, options) {
            var $element = $(element);
            var cover = $element;
            cover.addClass("input-group");
            var input = $("<input type=\"text\" class=\"form-control\" />").attr("placeholder", options.placeholder);
            cover.append(input);
            var button = $("<span class=\"input-group-addon\" />").append("<span class=\"glyphicon glyphicon-calendar\" />");
            cover.append(button);
            this._buildCalendar(element, new Date());
            var calendar = $(element).children("table");
            button.click(function() {
                calendar.toggle("fast", "linear");
            });
            var resize = function() {                
                calendar.offset({
                    left: button.position().left + button.width()
                });
            };
            $(window).resize(resize);
            resize();
            calendar.css("display", "none");
        },

        options: {
            placeholder: "Select date",
            local: {
                firstWeekDay: 0,
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                weekDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                today: "Today"
            }
        }
    });

    $.uca.control.subclass("uca.combobox", {

        _bindUlClick: function(ul, input, hidden, data) {
            ul.on("click", "li a", function () {
                var a = $(this);
                ul.add("li a").removeClass("selected");
                a.addClass("selected");
                input.val(a.text());
                hidden.val(a.attr("value"));
                if ($.uca.angular._isConnected()) {
                    input.change();
                    hidden.change();
                }
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
                if ($element.attr("aria-autocomplete")) {
                    input.bind("keyup", function () {
                        var text = $(this).val();
                        var items = $(this).parent().find("ul li");
                        items.show();
                        if (text !== '') {
                            items.filter(function() {
                                return $(this).text().indexOf(text) < 0;
                            }).hide();
                        }
                    });
                } else {
                    input.attr("readonly", "readonly");
                }
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
        _widthCorrection: [63, 96, 130, 160, 195, 225], //TODO Need to find some function!!!

        _resize: function (element) {
            var $element = $(element);
            var panels = $element.children(".accordion-panel");
            var headers = panels.children(".accordion-header");
            var bodies = panels.children(".accordion-body");
            var data = $element.data("accordion");

            var wCorr = this._widthCorrection[panels.length - 1];
            var hCorr = 35;

            var maxHeight;
            if (data && data.options.height) {
                if (data.options.height === "fill_parent") {
                    if ($element.hasClass("accordion-horizontal")) {
                        maxHeight = $element.parent().height();
                    } else {
                        var headersHeight = headers.length * (headers.height() + hCorr);
                        panels.hide();
                        maxHeight = $element.parent().height() - headersHeight;
                        panels.show();
                    }
                    bodies.css("overflow-y", "auto");
                } else {
                    maxHeight = data.options.height;
                }
            } else {
                maxHeight = 0;
            }
            if (maxHeight === 0) {                
                bodies.each(function() {
                    var $this = $(this);
                    if (maxHeight < $this.height()) {
                        maxHeight = $this.height();
                    }
                });
            }

            if ($element.hasClass("accordion-horizontal")) {
                panels.not(0).css("margin-top", "-2px");                
                var div = $("<div style=\"overflow-x: auto;\"></div>");
                var span = $("<span></span>");
                div.append(span);
                $element.append(div);
                headers.children().each(function () {
                    var $this = $(this);
                    span.text($this.text());
                    if (maxHeight < span.width()) {
                        maxHeight = span.width();
                    }
                });
                div.remove();
                var coeff = Math.floor(maxHeight / 100);
                var headerHeightCorrection = (coeff + 1) * 10;
                var headerMarginCorrection = 5 + 20 * ((coeff - 1) / 2);
                headers.height(maxHeight + headerHeightCorrection).children().css("margin-top", maxHeight + headerMarginCorrection + "px");
                headers.children(".panel-title").each(function () {
                    var $this = $(this);
                    $this.html($.trim($this.text()).replace(/\s/g, "&nbsp;"));
                });
                var maxWidth = 0;
                if (data && data.options.width === "fill_parent") {
                    var headersWidth = headers.length * headers.width() + wCorr;
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
            self._resize(element);
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

    $.plugin("datepicker", $.uca.datepicker);
    $.plugin("combobox", $.uca.combobox);
    $.plugin("accordion", $.uca.accordion);

}(jQuery));