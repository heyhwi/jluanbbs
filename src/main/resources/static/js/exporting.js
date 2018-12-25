/*
 Highcharts JS v7.0.1 (2018-12-19)
 Exporting module

 (c) 2010-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (l) {
    "object" === typeof module && module.exports ? module.exports = l : "function" === typeof define && define.amd ? define(function () {
        return l
    }) : l("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (l) {
    (function (g) {
        var y = g.defaultOptions, z = g.doc, l = g.Chart, q = g.addEvent, I = g.removeEvent, C = g.fireEvent,
            t = g.createElement, D = g.discardElement, r = g.css, p = g.merge, u = g.pick, E = g.objectEach,
            x = g.extend, J = g.isTouchDevice, A = g.win, G = A.navigator.userAgent, F = g.SVGRenderer,
            H = g.Renderer.prototype.symbols, K = /Edge\/|Trident\/|MSIE /.test(G),
            L = /firefox/i.test(G);
        x(y.lang, {
            printChart: "Print chart",
            downloadPNG: "Download PNG image",
            downloadJPEG: "Download JPEG image",
            downloadPDF: "Download PDF document",
            downloadSVG: "Download SVG vector image",
            contextButtonTitle: "Chart context menu"
        });
        y.navigation || (y.navigation = {});
        p(!0, y.navigation, {
            buttonOptions: {
                theme: {},
                symbolSize: 14,
                symbolX: 12.5,
                symbolY: 10.5,
                align: "right",
                buttonSpacing: 3,
                height: 22,
                verticalAlign: "top",
                width: 24
            }
        });
        p(!0, y.navigation, {
            menuStyle: {
                border: "1px solid #999999", background: "#ffffff",
                padding: "5px 0"
            },
            menuItemStyle: {
                padding: "0.5em 1em",
                color: "#333333",
                background: "none",
                fontSize: J ? "14px" : "11px",
                transition: "background 250ms, color 250ms"
            },
            menuItemHoverStyle: {background: "#335cad", color: "#ffffff"},
            buttonOptions: {symbolFill: "#666666", symbolStroke: "#666666", symbolStrokeWidth: 3, theme: {padding: 5}}
        });
        y.exporting = {
            type: "image/png", url: "https://export.highcharts.com/", printMaxWidth: 780, scale: 2, buttons: {
                contextButton: {
                    className: "highcharts-contextbutton",
                    menuClassName: "highcharts-contextmenu",
                    symbol: "menu",
                    titleKey: "contextButtonTitle",
                    menuItems: "printChart separator downloadPNG downloadJPEG downloadPDF downloadSVG".split(" ")
                }
            }, menuItemDefinitions: {
                printChart: {
                    textKey: "printChart", onclick: function () {
                        this.print()
                    }
                }, separator: {separator: !0}, downloadPNG: {
                    textKey: "downloadPNG", onclick: function () {
                        this.exportChart()
                    }
                }, downloadJPEG: {
                    textKey: "downloadJPEG", onclick: function () {
                        this.exportChart({type: "image/jpeg"})
                    }
                }, downloadPDF: {
                    textKey: "downloadPDF", onclick: function () {
                        this.exportChart({type: "application/pdf"})
                    }
                },
                downloadSVG: {
                    textKey: "downloadSVG", onclick: function () {
                        this.exportChart({type: "image/svg+xml"})
                    }
                }
            }
        };
        g.post = function (b, a, d) {
            var c = t("form", p({
                method: "post",
                action: b,
                enctype: "multipart/form-data"
            }, d), {display: "none"}, z.body);
            E(a, function (a, b) {
                t("input", {type: "hidden", name: b, value: a}, null, c)
            });
            c.submit();
            D(c)
        };
        x(l.prototype, {
            sanitizeSVG: function (b, a) {
                if (a && a.exporting && a.exporting.allowHTML) {
                    var d = b.match(/<\/svg>(.*?$)/);
                    d && d[1] && (d = '\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"' + a.chart.width + '" height\x3d"' +
                        a.chart.height + '"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e' + d[1] + "\x3c/body\x3e\x3c/foreignObject\x3e", b = b.replace("\x3c/svg\x3e", d + "\x3c/svg\x3e"))
                }
                b = b.replace(/zIndex="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (|NS[0-9]+\:)href=/g, " xlink:href\x3d").replace(/\n/, " ").replace(/<\/svg>.*?$/,
                    "\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g, "\u00a0").replace(/&shy;/g, "\u00ad");
                this.ieSanitizeSVG && (b = this.ieSanitizeSVG(b));
                return b
            }, getChartHTML: function () {
                this.styledMode && this.inlineStyles();
                return this.container.innerHTML
            }, getSVG: function (b) {
                var a, d, c, w, m, h = p(this.options, b);
                d = t("div", null, {
                    position: "absolute",
                    top: "-9999em",
                    width: this.chartWidth + "px",
                    height: this.chartHeight + "px"
                }, z.body);
                c =
                    this.renderTo.style.width;
                m = this.renderTo.style.height;
                c = h.exporting.sourceWidth || h.chart.width || /px$/.test(c) && parseInt(c, 10) || (h.isGantt ? 800 : 600);
                m = h.exporting.sourceHeight || h.chart.height || /px$/.test(m) && parseInt(m, 10) || 400;
                x(h.chart, {animation: !1, renderTo: d, forExport: !0, renderer: "SVGRenderer", width: c, height: m});
                h.exporting.enabled = !1;
                delete h.data;
                h.series = [];
                this.series.forEach(function (a) {
                    w = p(a.userOptions, {
                        animation: !1,
                        enableMouseTracking: !1,
                        showCheckbox: !1,
                        visible: a.visible
                    });
                    w.isInternal ||
                    h.series.push(w)
                });
                this.axes.forEach(function (a) {
                    a.userOptions.internalKey || (a.userOptions.internalKey = g.uniqueKey())
                });
                a = new g.Chart(h, this.callback);
                b && ["xAxis", "yAxis", "series"].forEach(function (c) {
                    var d = {};
                    b[c] && (d[c] = b[c], a.update(d))
                });
                this.axes.forEach(function (b) {
                    var c = g.find(a.axes, function (a) {
                        return a.options.internalKey === b.userOptions.internalKey
                    }), d = b.getExtremes(), e = d.userMin, d = d.userMax;
                    c && (void 0 !== e && e !== c.min || void 0 !== d && d !== c.max) && c.setExtremes(e, d, !0, !1)
                });
                c = a.getChartHTML();
                C(this, "getSVG", {chartCopy: a});
                c = this.sanitizeSVG(c, h);
                h = null;
                a.destroy();
                D(d);
                return c
            }, getSVGForExport: function (b, a) {
                var d = this.options.exporting;
                return this.getSVG(p({chart: {borderRadius: 0}}, d.chartOptions, a, {
                    exporting: {
                        sourceWidth: b && b.sourceWidth || d.sourceWidth,
                        sourceHeight: b && b.sourceHeight || d.sourceHeight
                    }
                }))
            }, getFilename: function () {
                var b = this.userOptions.title && this.userOptions.title.text, a = this.options.exporting.filename;
                if (a) return a;
                "string" === typeof b && (a = b.toLowerCase().replace(/<\/?[^>]+(>|$)/g,
                    "").replace(/[\s_]+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/^[\-]+/g, "").replace(/[\-]+/g, "-").substr(0, 24).replace(/[\-]+$/g, ""));
                if (!a || 5 > a.length) a = "chart";
                return a
            }, exportChart: function (b, a) {
                a = this.getSVGForExport(b, a);
                b = p(this.options.exporting, b);
                g.post(b.url, {
                    filename: b.filename || this.getFilename(),
                    type: b.type,
                    width: b.width || 0,
                    scale: b.scale,
                    svg: a
                }, b.formAttributes)
            }, print: function () {
                function b(b) {
                    (a.fixedDiv ? [a.fixedDiv, a.scrollingContainer] : [a.container]).forEach(function (a) {
                        b.appendChild(a)
                    })
                }

                var a = this, d = [], c = z.body, g = c.childNodes, m = a.options.exporting.printMaxWidth, h, e;
                if (!a.isPrinting) {
                    a.isPrinting = !0;
                    a.pointer.reset(null, 0);
                    C(a, "beforePrint");
                    if (e = m && a.chartWidth > m) h = [a.options.chart.width, void 0, !1], a.setSize(m, void 0, !1);
                    g.forEach(function (a, b) {
                        1 === a.nodeType && (d[b] = a.style.display, a.style.display = "none")
                    });
                    b(c);
                    setTimeout(function () {
                        A.focus();
                        A.print();
                        setTimeout(function () {
                            b(a.renderTo);
                            g.forEach(function (a, b) {
                                1 === a.nodeType && (a.style.display = d[b])
                            });
                            a.isPrinting = !1;
                            e && a.setSize.apply(a,
                                h);
                            C(a, "afterPrint")
                        }, 1E3)
                    }, 1)
                }
            }, contextMenu: function (b, a, d, c, w, m, h) {
                var e = this, n = e.options.navigation, k = e.chartWidth, v = e.chartHeight, l = "cache-" + b, f = e[l],
                    B = Math.max(w, m), p;
                f || (e.exportContextMenu = e[l] = f = t("div", {className: b}, {
                    position: "absolute",
                    zIndex: 1E3,
                    padding: B + "px",
                    pointerEvents: "auto"
                }, e.fixedDiv || e.container), p = t("div", {className: "highcharts-menu"}, null, f), e.styledMode || r(p, x({
                    MozBoxShadow: "3px 3px 10px #888",
                    WebkitBoxShadow: "3px 3px 10px #888",
                    boxShadow: "3px 3px 10px #888"
                }, n.menuStyle)),
                    f.hideMenu = function () {
                        r(f, {display: "none"});
                        h && h.setState(0);
                        e.openMenu = !1;
                        g.clearTimeout(f.hideTimer)
                    }, e.exportEvents.push(q(f, "mouseleave", function () {
                    f.hideTimer = setTimeout(f.hideMenu, 500)
                }), q(f, "mouseenter", function () {
                    g.clearTimeout(f.hideTimer)
                }), q(z, "mouseup", function (a) {
                    e.pointer.inClass(a.target, b) || f.hideMenu()
                }), q(f, "click", function () {
                    e.openMenu && f.hideMenu()
                })), a.forEach(function (a) {
                    "string" === typeof a && (a = e.options.exporting.menuItemDefinitions[a]);
                    if (g.isObject(a, !0)) {
                        var b;
                        a.separator ?
                            b = t("hr", null, null, p) : (b = t("div", {
                                className: "highcharts-menu-item",
                                onclick: function (b) {
                                    b && b.stopPropagation();
                                    f.hideMenu();
                                    a.onclick && a.onclick.apply(e, arguments)
                                },
                                innerHTML: a.text || e.options.lang[a.textKey]
                            }, null, p), e.styledMode || (b.onmouseover = function () {
                                r(this, n.menuItemHoverStyle)
                            }, b.onmouseout = function () {
                                r(this, n.menuItemStyle)
                            }, r(b, x({cursor: "pointer"}, n.menuItemStyle))));
                        e.exportDivElements.push(b)
                    }
                }), e.exportDivElements.push(p, f), e.exportMenuWidth = f.offsetWidth, e.exportMenuHeight = f.offsetHeight);
                a = {display: "block"};
                d + e.exportMenuWidth > k ? a.right = k - d - w - B + "px" : a.left = d - B + "px";
                c + m + e.exportMenuHeight > v && "top" !== h.alignOptions.verticalAlign ? a.bottom = v - c - B + "px" : a.top = c + m - B + "px";
                r(f, a);
                e.openMenu = !0
            }, addButton: function (b) {
                var a = this, d = a.renderer, c = p(a.options.navigation.buttonOptions, b), g = c.onclick,
                    m = c.menuItems, h, e, n = c.symbolSize || 12;
                a.btnCount || (a.btnCount = 0);
                a.exportDivElements || (a.exportDivElements = [], a.exportSVGElements = []);
                if (!1 !== c.enabled) {
                    var k = c.theme, v = k.states, l = v && v.hover, v = v && v.select,
                        f;
                    a.styledMode || (k.fill = u(k.fill, "#ffffff"), k.stroke = u(k.stroke, "none"));
                    delete k.states;
                    g ? f = function (b) {
                        b && b.stopPropagation();
                        g.call(a, b)
                    } : m && (f = function (b) {
                        b && b.stopPropagation();
                        a.contextMenu(e.menuClassName, m, e.translateX, e.translateY, e.width, e.height, e);
                        e.setState(2)
                    });
                    c.text && c.symbol ? k.paddingLeft = u(k.paddingLeft, 25) : c.text || x(k, {
                        width: c.width,
                        height: c.height,
                        padding: 0
                    });
                    a.styledMode || (k["stroke-linecap"] = "round", k.fill = u(k.fill, "#ffffff"), k.stroke = u(k.stroke, "none"));
                    e = d.button(c.text, 0,
                        0, f, k, l, v).addClass(b.className).attr({title: u(a.options.lang[c._titleKey || c.titleKey], "")});
                    e.menuClassName = b.menuClassName || "highcharts-menu-" + a.btnCount++;
                    c.symbol && (h = d.symbol(c.symbol, c.symbolX - n / 2, c.symbolY - n / 2, n, n, {
                        width: n,
                        height: n
                    }).addClass("highcharts-button-symbol").attr({zIndex: 1}).add(e), a.styledMode || h.attr({
                        stroke: c.symbolStroke,
                        fill: c.symbolFill,
                        "stroke-width": c.symbolStrokeWidth || 1
                    }));
                    e.add(a.exportingGroup).align(x(c, {width: e.width, x: u(c.x, a.buttonOffset)}), !0, "spacingBox");
                    a.buttonOffset +=
                        (e.width + c.buttonSpacing) * ("right" === c.align ? -1 : 1);
                    a.exportSVGElements.push(e, h)
                }
            }, destroyExport: function (b) {
                var a = b ? b.target : this;
                b = a.exportSVGElements;
                var d = a.exportDivElements, c = a.exportEvents, l;
                b && (b.forEach(function (b, c) {
                    b && (b.onclick = b.ontouchstart = null, l = "cache-" + b.menuClassName, a[l] && delete a[l], a.exportSVGElements[c] = b.destroy())
                }), b.length = 0);
                a.exportingGroup && (a.exportingGroup.destroy(), delete a.exportingGroup);
                d && (d.forEach(function (b, c) {
                    g.clearTimeout(b.hideTimer);
                    I(b, "mouseleave");
                    a.exportDivElements[c] =
                        b.onmouseout = b.onmouseover = b.ontouchstart = b.onclick = null;
                    D(b)
                }), d.length = 0);
                c && (c.forEach(function (a) {
                    a()
                }), c.length = 0)
            }
        });
        F.prototype.inlineToAttributes = "fill stroke strokeLinecap strokeLinejoin strokeWidth textAnchor x y".split(" ");
        F.prototype.inlineBlacklist = [/-/, /^(clipPath|cssText|d|height|width)$/, /^font$/, /[lL]ogical(Width|Height)$/, /perspective/, /TapHighlightColor/, /^transition/, /^length$/];
        F.prototype.unstyledElements = ["clipPath", "defs", "desc"];
        l.prototype.inlineStyles = function () {
            function b(a) {
                return a.replace(/([A-Z])/g,
                    function (a, b) {
                        return "-" + b.toLowerCase()
                    })
            }

            function a(d) {
                function m(a, f) {
                    q = t = !1;
                    if (l) {
                        for (r = l.length; r-- && !t;) t = l[r].test(f);
                        q = !t
                    }
                    "transform" === f && "none" === a && (q = !0);
                    for (r = g.length; r-- && !q;) q = g[r].test(f) || "function" === typeof a;
                    q || v[f] === a && "svg" !== d.nodeName || e[d.nodeName][f] === a || (-1 !== c.indexOf(f) ? d.setAttribute(b(f), a) : u += b(f) + ":" + a + ";")
                }

                var f, v, u = "", w, q, t, r;
                if (1 === d.nodeType && -1 === h.indexOf(d.nodeName)) {
                    f = A.getComputedStyle(d, null);
                    v = "svg" === d.nodeName ? {} : A.getComputedStyle(d.parentNode, null);
                    e[d.nodeName] || (n = k.getElementsByTagName("svg")[0], w = k.createElementNS(d.namespaceURI, d.nodeName), n.appendChild(w), e[d.nodeName] = p(A.getComputedStyle(w, null)), "text" === d.nodeName && delete e.text.fill, n.removeChild(w));
                    if (L || K) for (var x in f) m(f[x], x); else E(f, m);
                    u && (f = d.getAttribute("style"), d.setAttribute("style", (f ? f + ";" : "") + u));
                    "svg" === d.nodeName && d.setAttribute("stroke-width", "1px");
                    "text" !== d.nodeName && [].forEach.call(d.children || d.childNodes, a)
                }
            }

            var d = this.renderer, c = d.inlineToAttributes, g = d.inlineBlacklist,
                l = d.inlineWhitelist, h = d.unstyledElements, e = {}, n, k, d = z.createElement("iframe");
            r(d, {width: "1px", height: "1px", visibility: "hidden"});
            z.body.appendChild(d);
            k = d.contentWindow.document;
            k.open();
            k.write('\x3csvg xmlns\x3d"http://www.w3.org/2000/svg"\x3e\x3c/svg\x3e');
            k.close();
            a(this.container.querySelector("svg"));
            n.parentNode.removeChild(n)
        };
        H.menu = function (b, a, d, c) {
            return ["M", b, a + 2.5, "L", b + d, a + 2.5, "M", b, a + c / 2 + .5, "L", b + d, a + c / 2 + .5, "M", b, a + c - 1.5, "L", b + d, a + c - 1.5]
        };
        H.menuball = function (b, a, d, c) {
            b = [];
            c = c / 3 -
                2;
            return b = b.concat(this.circle(d - c, a, c, c), this.circle(d - c, a + c + 4, c, c), this.circle(d - c, a + 2 * (c + 4), c, c))
        };
        l.prototype.renderExporting = function () {
            var b = this, a = b.options.exporting, d = a.buttons, c = b.isDirtyExporting || !b.exportSVGElements;
            b.buttonOffset = 0;
            b.isDirtyExporting && b.destroyExport();
            c && !1 !== a.enabled && (b.exportEvents = [], b.exportingGroup = b.exportingGroup || b.renderer.g("exporting-group").attr({zIndex: 3}).add(), E(d, function (a) {
                b.addButton(a)
            }), b.isDirtyExporting = !1);
            q(b, "destroy", b.destroyExport)
        };
        q(l, "init", function () {
            var b = this;
            ["exporting", "navigation"].forEach(function (a) {
                b[a] = {
                    update: function (d, c) {
                        b.isDirtyExporting = !0;
                        p(!0, b.options[a], d);
                        u(c, !0) && b.redraw()
                    }
                }
            })
        });
        l.prototype.callbacks.push(function (b) {
            b.renderExporting();
            q(b, "redraw", b.renderExporting)
        })
    })(l)
});
//# sourceMappingURL=exporting.js.map