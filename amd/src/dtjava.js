define([], function() {

    var dtjava = function() {
        function u(d) {
            return (d != undefined && d != null)
        }

        function v(d) {
            return (d != null && typeof d != "undefined")
        }

        function D(d, a2) {
            for (var w = 0; w < d.length; w++) {
                if (a2.indexOf(d[w]) != -1) {
                    return true
                }
            }
            return false
        }
        var z = (function() {
            var d = document.getElementsByTagName("script");
            var w = d[d.length - 1].getAttribute("src");
            return w ? w.substring(0, w.lastIndexOf("/") + 1) : ""
        })();
        var an = false;
        postponeNativePluginInstallation = false;
        var aG = "1.7.0_06";
        var aa = document;
        var R = window;
        var aN = false;
        var j = [];
        var C = [];
        var ad = null;

        function T(d) {
            if (aN) {
                d()
            } else {
                j[j.length] = d
            }
        }

        function n(d) {
            if (aN) {
                d()
            } else {
                C[C.length] = d
            }
        }

        function L() {
            if (!aN) {
                try {
                    var w = aa.getElementsByTagName("body")[0].appendChild(aa.createElement("div"));
                    w.parentNode.removeChild(w)
                } catch (a2) {
                    return
                }
                aN = true;
                for (var d = 0; d < j.length; d++) {
                    j[d]()
                }
                for (var d = 0; d < C.length; d++) {
                    C[d]()
                }
            }
        }

        function a(w) {
            if (v(R.addEventListener)) {
                R.addEventListener("load", w, false)
            } else {
                if (v(aa.addEventListener)) {
                    aa.addEventListener("load", w, false)
                } else {
                    if (v(R.attachEvent)) {
                        R.attachEvent("onload", w)
                    } else {
                        if (typeof R.onload == "function") {
                            var d = R.onload;
                            R.onload = function() {
                                d();
                                w()
                            }
                        } else {
                            R.onload = w
                        }
                    }
                }
            }
        }

        function aA() {
            var bm = v(aa.getElementById) && v(aa.getElementsByTagName) && v(aa.createElement);
            var be = navigator.userAgent.toLowerCase(),
                bi = navigator.platform.toLowerCase();
            var bp = bi ? /win/.test(bi) : /win/.test(be),
                a4 = bi ? /mac/.test(bi) : /mac/.test(be),
                bb = bi ? /linux/.test(bi) : /linux/.test(be),
                bg = /chrome/.test(be),
                d = !bg && /webkit/.test(be) ? parseFloat(be.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
                bn = /opera/.test(be),
                a5 = null,
                w = null;
            var bh = false;
            try {
                bh = v(window.execScript);
                if (!bh) {
                    bh = (navigator.userAgent.match(/Trident/i) != null)
                }
            } catch (a6) {
                bh = false
            }
            var a8 = false;
            var bk = false;
            a8 = (navigator.userAgent.match(/Edge/i) != null);
            if (bh && navigator.userAgent.match(/Windows NT 6\.[23]/i) != null) {
                try {
                    new ActiveXObject("htmlfile")
                } catch (bo) {
                    bk = true
                }
            }
            if (a8 || bk) {
                bh = false
            }
            if (a4) {
                if ((bi && /intel/.test(bi)) || /intel/.test(be)) {
                    a5 = "intel"
                }
                var bf = be.match(/mac os x (10[0-9_\.]+)/);
                w = u(bf) ? bf[0].replace("mac os x ", "").replace(/_/g, ".") : null
            }
            if (typeof String.prototype.trim !== "function") {
                String.prototype.trim = function() {
                    return this.replace(/^\s+|\s+$/g, "")
                }
            }
            if (typeof String.prototype.startsWith !== "function") {
                String.prototype.startsWith = function(br, bq) {
                    bq = bq || 0;
                    return this.indexOf(br, bq) === bq
                }
            }
            var bl = navigator.mimeTypes;
            var a9 = null;
            var a3 = null;
            var a2 = null;
            var bc = false;
            if (typeof __dtjavaTestHook__ !== "undefined" && __dtjavaTestHook__ != null && __dtjavaTestHook__.jre != null && __dtjavaTestHook__.jfx != null && __dtjavaTestHook__.deploy != null) {
                a9 = __dtjavaTestHook__.jre;
                a3 = __dtjavaTestHook__.deploy;
                a2 = __dtjavaTestHook__.jfx;
                bc = true
            } else {
                for (var bf = 0; bf < bl.length; bf++) {
                    var bj = navigator.mimeTypes[bf].type;
                    if (bj.indexOf("application/x-java-applet;version") != -1 && bj.indexOf("=") != -1) {
                        var bd = bj.substring(bj.indexOf("=") + 1);
                        if (a9 == null || aY(a9 + "+", bd)) {
                            a9 = bd
                        }
                    }
                    if (bj.indexOf("application/x-java-applet;deploy") != -1 && bj.indexOf("=") != -1) {
                        a3 = bj.substring(bj.indexOf("=") + 1)
                    }
                    if (bj.indexOf("application/x-java-applet;javafx") != -1 && bj.indexOf("=") != -1) {
                        a2 = bj.substring(bj.indexOf("=") + 1)
                    }
                }
            }
            var ba = (navigator.userAgent.match(/Firefox/i) != null);
            var a7 = a8 || bg || bk || (ba && (a9 == null));
            return {
                haveDom: bm,
                wk: d,
                ie: bh,
                win: bp,
                linux: bb,
                mac: a4,
                op: bn,
                chrome: bg,
                edge: a8,
                jre: a9,
                deploy: a3,
                fx: a2,
                noPluginWebBrowser: a7,
                cputype: a5,
                osVersion: w,
                override: bc
            }
        }

        function m() {
            var a2 = 'Java Plug-in is not supported by this browser. <a href="https://java.com/dt-redirect">More info</a>';
            var w = "background-color: #ffffce;text-align: left;border: solid 1px #f0c000; padding: 1.65em 1.65em .75em 0.5em; font-family: Helvetica, Arial, sans-serif; font-size: 75%; bottom:0; left:0; right:0; position:fixed; margin:auto; opacity:0.9; width:400px;";
            var a5 = "border: .85px; margin:-2.2em 0 0.55em 2.5em;";
            var d = "margin-left:10px;font-weight:bold;float:right;font-size:22px;line-height:20px;cursor:pointer;color:red;";
            var a3 = '<span style="' + d + '" onclick="this.parentElement.style.display=\'none\';">&times;</span><img src="https://java.com/js/alert_16.png"><div style="' + a5 + '"><p>' + a2 + "</p>";
            var a4 = document.createElement("div");
            a4.id = "messagebox";
            a4.setAttribute("style", w);
            a4.innerHTML = a3;
            document.body.appendChild(a4)
        }
        var aB = false;

        function ap() {
            if (typeof __dtjavaTestHook__ !== "undefined") {
                jre = null;
                jfx = null;
                deploy = null;
                if ((__dtjavaTestHook__ != null) && (__dtjavaTestHook__.args != null)) {
                    jre = __dtjavaTestHook__.args.jre;
                    jfx = __dtjavaTestHook__.args.jfx;
                    deploy = __dtjavaTestHook__.args.deploy
                }
                if ((window.location.href.indexOf("http://localhost") == 0) || (window.location.href.indexOf("file:///") == 0)) {
                    __dtjavaTestHook__ = {
                        detectEnv: aA,
                        Version: l,
                        checkFXSupport: aL,
                        versionCheck: aY,
                        versionCheckFX: i,
                        jre: jre,
                        jfx: jfx,
                        deploy: deploy
                    }
                }
            }
            if (aB) {
                return
            }
            ad = aA();
            if (!ad.haveDom) {
                return
            }
            if ((v(aa.readyState) && aa.readyState == "complete") || (!v(aa.readyState) && (aa.getElementsByTagName("body")[0] || aa.body))) {
                L()
            }
            if (!aN) {
                if (v(aa.addEventListener)) {
                    aa.addEventListener("DOMContentLoaded", L, false)
                }
                if (ad.ie && ad.win) {
                    if (v(aa.addEventListener)) {
                        aa.addEventListener("onreadystatechange", function() {
                            if (aa.readyState == "complete") {
                                aa.removeEventListener("onreadystatechange", arguments.callee, false);
                                L()
                            }
                        }, false)
                    } else {
                        aa.attachEvent("onreadystatechange", function() {
                            if (aa.readyState == "complete") {
                                aa.detachEvent("onreadystatechange", arguments.callee);
                                L()
                            }
                        })
                    }
                    if (R == top) {
                        (function() {
                            if (aN) {
                                return
                            }
                            try {
                                aa.documentElement.doScroll("left")
                            } catch (d) {
                                setTimeout(arguments.callee, 0);
                                return
                            }
                            L()
                        })()
                    }
                }
                if (ad.wk) {
                    (function() {
                        if (aN) {
                            return
                        }
                        if (!/loaded|complete/.test(aa.readyState)) {
                            setTimeout(arguments.callee, 0);
                            return
                        }
                        L()
                    })()
                }
                a(L)
            }
            if (!am()) {
                X()
            }
        }

        function Y(a2) {
            var a3;
            if (x(a2)) {
                a3 = a2
            } else {
                var d = window.location.href;
                var a4 = d.lastIndexOf("/");
                var w = a4 > -1 ? d.substring(0, a4 + 1) : d + "/";
                a3 = w + a2
            }
            return a3
        }

        function J(d) {
            document.location = "jnlp:" + Y(d)
        }

        function x(d) {
            var a2 = ["http://", "https://", "file://"];
            for (var w = 0; w < a2.length; w++) {
                if (d.toLowerCase().startsWith(a2[w])) {
                    return true
                }
            }
            return false
        }

        function H(d) {
            for (var w in d) {
                this[w] = d[w]
            }
            this.toString = function() {
                return "MISMATCH [os=" + this.os + ", browser=" + this.browser + ", jre=" + this.jre + ", fx=" + this.fx + ", relaunch=" + this.relaunch + ", platform=" + this.platform + "]"
            };
            this.isUnsupportedPlatform = function() {
                return this.os
            };
            this.isUnsupportedBrowser = function() {
                return this.browser
            };
            this.jreStatus = function() {
                return this.jre
            };
            this.jreInstallerURL = function(a2) {
                if (!this.os && (this.jre == "old" || this.jre == "none")) {
                    return ar(a2)
                }
                return null
            };
            this.javafxStatus = function() {
                return this.fx
            };
            this.javafxInstallerURL = function(a2) {
                if (!this.os && (this.fx == "old" || this.fx == "none")) {
                    return V(a2)
                }
                return null
            };
            this.canAutoInstall = function() {
                return I(this.platform, this.jre, this.fx)
            };
            this.isRelaunchNeeded = function() {
                return this.relaunch
            }
        }

        function aP(a2) {
            if (ad.fx != null && i(a2, ad.fx)) {
                return ad.fx
            }
            var w = e();
            if (u(w)) {
                try {
                    return w.getInstalledFXVersion(a2)
                } catch (d) {}
            }
            return null
        }

        function E(d) {
            if (d != null) {
                return d.join(" ")
            } else {
                return null
            }
        }

        function Z(w, d) {
            if (u(w)) {
                w.push(d);
                return w
            } else {
                var a2 = [d];
                return a2
            }
        }

        function U(a3, w, d) {
            var a5 = au(a3, true);
            if (ad.noPluginWebBrowser) {
                J(a5.url);
                return
            }
            if (!(u(a5) && u(a5.url))) {
                throw "Required attribute missing! (application url need to be specified)"
            }
            w = new dtjava.Platform(w);
            d = new dtjava.Callbacks(d);
            var a2 = function() {
                var a9 = u(w.jvmargs) ? w.jvmargs : null;
                if (u(w.javafx)) {
                    var bf = aP(w.javafx);
                    a9 = Z(a9, " -Djnlp.fx=" + bf);
                    if (!u(a3.toolkit) || a3.toolkit == "fx") {
                        a9 = Z(a9, " -Djnlp.tk=jfx")
                    }
                }
                if (am() && !(ad.linux && ad.chrome)) {
                    if (aU(a5, a9, d)) {
                        return
                    }
                }
                var a6 = e();
                if (u(a6)) {
                    try {
                        try {
                            if (aY("10.6+", ad.deploy, false)) {
                                var bc = {
                                    url: a5.url
                                };
                                if (u(a9)) {
                                    bc.vmargs = a9
                                }
                                if (u(a5.params)) {
                                    var a8 = {};
                                    for (var bb in a5.params) {
                                        a8[bb] = String(a5.params[bb])
                                    }
                                    bc.params = a8
                                }
                                if (u(a5.jnlp_content)) {
                                    bc.jnlp_content = a5.jnlp_content
                                }
                                var ba = a6.launchApp(bc);
                                if (ba == 0) {
                                    if (v(d.onRuntimeError)) {
                                        d.onRuntimeError(a5.id)
                                    }
                                }
                            } else {
                                if (!a6.launchApp(a5.url, a5.jnlp_content, E(a9))) {
                                    if (v(d.onRuntimeError)) {
                                        d.onRuntimeError(a5.id)
                                    }
                                }
                            }
                            return
                        } catch (bd) {
                            if (!a6.launchApp(a5.url, a5.jnlp_content)) {
                                if (v(d.onRuntimeError)) {
                                    d.onRuntimeError(a5.id)
                                }
                            }
                            return
                        }
                    } catch (be) {}
                }
                var a7 = al(a5.url);
                if (u(aa.body)) {
                    aa.body.appendChild(a7)
                } else {
                    aa.write(a7.innerHTML)
                }
            };
            var a4 = Q(w);
            if (a4 != null) {
                ab(a5, w, a4, d, a2)
            } else {
                a2()
            }
        }

        function N(a2, w, d) {
            if (v(d.onDeployError)) {
                d.onDeployError(a2, w)
            }
        }

        function aT(d) {
            return d != null && v(d.version)
        }

        function ag(d, a2) {
            var a3 = e();
            if (a3 == null) {
                return
            }
            if (aT(a3)) {
                a2(a3)
            } else {
                var w = null;
                if (!v(dtjava.dtPendingCnt) || dtjava.dtPendingCnt == 0) {
                    w = function() {
                        if (aT(a3)) {
                            if (u(dtjava.dtPending)) {
                                for (var a4 in dtjava.dtPending) {
                                    dtjava.dtPending[a4]()
                                }
                            }
                            return
                        }
                        if (dtjava.dtPendingCnt > 0) {
                            dtjava.dtPendingCnt--;
                            setTimeout(w, 500)
                        }
                    }
                }
                if (!u(dtjava.dtPending) || dtjava.dtPendingCnt == 0) {
                    dtjava.dtPending = {}
                }
                dtjava.dtPending[d] = a2;
                dtjava.dtPendingCnt = 1000;
                if (w != null) {
                    w()
                }
            }
        }

        function ab(a4, a3, ba, a5, a7) {
            var w = e();
            if (w == null && ad.noPluginWebBrowser) {
                var bd = setInterval(function() {
                    if (document.readyState == "complete") {
                        clearInterval(bd);
                        m()
                    }
                }, 15);
                return
            }
            if (ad.chrome && ad.win && w != null && !aT(w)) {
                var d;
                if (u(a4.placeholder)) {
                    var a6 = function() {
                        R.open("https://www.java.com/en/download/faq/chrome.xml");
                        return false
                    };
                    var a9 = "Please give Java permission to run on this browser web page.";
                    var a8 = "Click for more information.";
                    var bb = "";
                    aF(a4, a9, a8, bb, "javafx-chrome.png", a6);
                    d = a4.id + "-embed"
                } else {
                    ba.jre = "blocked";
                    N(a4, ba, a5);
                    d = "launch"
                }
                var a2 = function() {
                    var be = Q(a3);
                    if (be == null) {
                        a7()
                    } else {
                        ab(a4, a3, be, a5, a7)
                    }
                };
                ag(d, a2);
                return
            }
            if (!ba.isUnsupportedPlatform() && !ba.isUnsupportedBrowser()) {
                if (at(ba) && v(a5.onInstallNeeded)) {
                    var bc = function() {
                        var be = Q(a3);
                        if (be == null) {
                            a7()
                        } else {
                            N(a4, be, a5)
                        }
                    };
                    a5.onInstallNeeded(a4, a3, a5, ba.canAutoInstall(), ba.isRelaunchNeeded(), bc);
                    return
                }
            }
            N(a4, ba, a5)
        }

        function am() {
            if (ad.deploy != null && !ad.ie) {
                return aY("10.6+", ad.deploy, false)
            }
            return false
        }

        function ai(d) {
            return d != null && v(d.version)
        }

        function aX() {
            return document.getElementById("dtlite")
        }

        function k() {
            if (aX() != null) {
                return
            }
            var w = document.createElement("embed");
            w.width = "10px";
            w.height = "10px";
            w.id = "dtlite";
            w.type = "application/x-java-applet";
            var a2 = document.createElement("div");
            a2.style.position = "relative";
            a2.style.left = "-10000px";
            a2.appendChild(w);
            var d = document.getElementsByTagName("body");
            d[0].appendChild(a2)
        }

        function A(w) {
            var a2 = aX();
            if (a2 == null) {
                k();
                a2 = aX()
            }
            if (ai(a2)) {
                w(a2)
            } else {
                var d = null;
                if (!v(dtjava.dtlitePendingCnt) || dtjava.dtlitePendingCnt == 0) {
                    d = function() {
                        if (v(a2.version)) {
                            if (dtjava.pendingLaunch != null) {
                                dtjava.pendingLaunch(a2)
                            }
                            dtjava.pendingLaunch = null;
                            return
                        }
                        if (dtjava.dtlitePendingCnt > 0) {
                            dtjava.dtlitePendingCnt--;
                            setTimeout(d, 500)
                        }
                    }
                }
                dtjava.pendingLaunch = w;
                dtjava.dtlitePendingCnt = 1000;
                if (d != null) {
                    d()
                }
            }
        }

        function aU(a3, w, d) {
            var a2 = function() {
                var a4 = aX();
                if (a4 == null) {
                    if (v(d.onRuntimeError)) {
                        d.onRuntimeError(a3.id)
                    }
                }
                var a7 = {
                    url: a3.url
                };
                if (u(w)) {
                    a7.vmargs = w
                }
                if (u(a3.params)) {
                    var a8 = {};
                    for (var a5 in a3.params) {
                        a8[a5] = String(a3.params[a5])
                    }
                    a7.params = a8
                }
                if (u(a3.jnlp_content)) {
                    a7.jnlp_content = a3.jnlp_content
                }
                var a6 = a4.launchApp(a7);
                if (a6 == 0) {
                    if (v(d.onRuntimeError)) {
                        d.onRuntimeError(a3.id)
                    }
                }
            };
            if (aY("10.4+", ad.deploy, false)) {
                A(a2);
                return true
            }
            return false
        }

        function al(w) {
            var d = null;
            if (ad.ie) {
                d = aa.createElement("object");
                d.width = "1px";
                d.height = "1px";
                var a2 = aa.createElement("param");
                a2.name = "launchjnlp";
                a2.value = w;
                d.appendChild(a2);
                a2 = aa.createElement("param");
                a2.name = "docbase";
                a2.value = u(aa.documentURI) ? aa.documentURI : aa.URL;
                d.appendChild(a2);
                if (!ad.ie) {
                    d.type = "application/x-java-applet;version=1.7"
                } else {
                    d.classid = "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"
                }
            } else {
                d = aa.createElement("embed");
                d.width = "0px";
                d.height = "0px";
                d.setAttribute("launchjnlp", w);
                d.setAttribute("docbase", (u(aa.documentURI) ? aa.documentURI : aa.URL));
                d.type = "application/x-java-applet;version=1.7"
            }
            var a3 = aa.createElement("div");
            a3.style.position = "relative";
            a3.style.left = "-10000px";
            a3.appendChild(d);
            return a3
        }
        var aD = {
            Exact: {
                value: 0
            },
            Family: {
                value: 1
            },
            Above: {
                value: 2
            }
        };
        var ay = {
            Uninitialized: {
                value: -2
            },
            Unknown: {
                value: -1
            },
            Identifier: {
                value: 0
            },
            Alpha: {
                value: 1
            },
            Digits: {
                value: 2
            },
            Plus: {
                value: 3
            },
            Minus: {
                value: 4
            },
            Underbar: {
                value: 5
            },
            Star: {
                value: 6
            },
            Dot: {
                value: 7
            },
            End: {
                value: 8
            }
        };
        var l = function(a6, bi) {
            if (typeof bi === "undefined") {
                var bi = true
            }
            var a3 = 4;
            var bc = null;
            var bk = false;
            var bl = null;
            var bm = null;
            var a8 = null;
            var bg = null;
            var bp = null;
            var a5 = null;
            var ba = null;
            var bb = null;
            if (!a6) {
                return null
            } else {
                bc = a6;
                var be = d(a6, bi);
                bk = be.old;
                bl = be.version;
                bm = be.build;
                bg = be.match;
                a8 = be.pre;
                var bh = w(be.version);
                bp = bh.major;
                a5 = bh.minor;
                ba = bh.security;
                bb = bh.patch
            }
            return {
                VersionString: a6,
                old: bk,
                major: bp,
                minor: a5,
                security: ba,
                patch: bb,
                version: bl,
                build: bm,
                pre: a8,
                match: bg,
                check: function(bq) {
                    return bn(bq, this)
                },
                equals: function(bq) {
                    return bd(bq, this)
                }
            };

            function w(br) {
                var bt = null;
                var bu = null;
                var bq = null;
                var bs = null;
                if (br.length >= 1) {
                    bt = br[0]
                }
                if (br.length >= 2) {
                    bu = br[1]
                }
                if (br.length >= 3) {
                    bq = br[2]
                }
                if (br.length >= 4) {
                    bs = br[3]
                }
                return {
                    major: bt,
                    minor: bu,
                    security: bq,
                    patch: bs
                }
            }

            function bj(bA) {
                var bt = bA.toLowerCase().trim();
                var bv;
                var br = null;
                var bz = Array();

                function bw(bC) {
                    var bB = false;
                    switch (bC) {
                        case "0":
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                        case "5":
                        case "6":
                        case "7":
                        case "8":
                        case "9":
                            bB = true;
                            break
                    }
                    return bB
                }

                function by(bF) {
                    var bB = false;
                    var bC = "a".charCodeAt(0);
                    var bE = "z".charCodeAt(0);
                    var bD = bF.charCodeAt(0);
                    if (bC <= bD && bD <= bE) {
                        bB = true
                    }
                    return bB
                }

                function bq() {
                    bv = 0
                }

                function bu() {
                    return br
                }

                function bx(bB) {
                    if (br != null) {
                        bz.unshift(br)
                    }
                    br = bB
                }

                function bs() {
                    var bC = ay.Uninitialized;
                    var bB = "";
                    if (bz.length > 0) {
                        bC = bz[0].tokenID;
                        bB = bz[0].token;
                        bz.shift()
                    } else {
                        if (bv >= bt.length) {
                            bC = ay.End
                        } else {
                            while (bv < bt.length) {
                                var bD = bt.charAt(bv);
                                if ((bC == ay.Uninitialized || bC == ay.Alpha) && by(bD) == true) {
                                    bC = ay.Alpha;
                                    bv++;
                                    bB += bD
                                } else {
                                    if ((bC == ay.Uninitialized || bC == ay.Digits) && bw(bD) == true) {
                                        if (parseInt(bD) == 0 && parseInt(bB) == 0) {
                                            bC = ay.Unknown;
                                            bB += bD;
                                            bv++;
                                            break
                                        } else {
                                            bC = ay.Digits;
                                            bB += bD;
                                            bv++
                                        }
                                    } else {
                                        if ((bC == ay.Alpha || bC == ay.Identifier) && bw(bD) == true && by(bD) == false) {
                                            bC = ay.Identifier;
                                            bv++;
                                            bB += bD
                                        } else {
                                            if (bC == ay.Uninitialized) {
                                                switch (bD) {
                                                    case "-":
                                                        bC = ay.Minus;
                                                        bv++;
                                                        bB = bD;
                                                        break;
                                                    case "+":
                                                        bC = ay.Plus;
                                                        bv++;
                                                        bB = bD;
                                                        break;
                                                    case "*":
                                                        bC = ay.Star;
                                                        bv++;
                                                        bB = bD;
                                                        break;
                                                    case ".":
                                                        bC = ay.Dot;
                                                        bv++;
                                                        bB = bD;
                                                        break;
                                                    case "_":
                                                        bC = ay.Underbar;
                                                        bv++;
                                                        bB = bD;
                                                        break;
                                                    default:
                                                        bC = ay.Unknown;
                                                        bv++;
                                                        break
                                                }
                                                break
                                            } else {
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    br = {
                        token: bB,
                        tokenID: bC
                    };
                    return br
                }
                return {
                    start: bq,
                    nextToken: bs,
                    pushToken: bx,
                    currentToken: bu,
                    isDigit: bw,
                    isLetter: by
                }
            }

            function bf() {
                function bq(bA) {
                    var by = new Array();
                    var bB = bA.currentToken();
                    if (bB.tokenID == ay.Digits) {
                        by.push(parseInt(bB.token));
                        bB = bA.nextToken();
                        for (var bz = 0; bz < (a3 - 1); bz++) {
                            if (bB.tokenID == ay.Dot) {
                                bB = bA.nextToken();
                                if (bB.tokenID == ay.Digits) {
                                    by.push(parseInt(bB.token));
                                    bB = bA.nextToken()
                                } else {
                                    if (bB.tokenID == ay.Star || bB.tokenID == ay.Plus) {
                                        break
                                    } else {
                                        by = null;
                                        break
                                    }
                                }
                            } else {
                                if (bB.tokenID == ay.Star || bB.tokenID == ay.Plus || bB.tokenID == ay.End || bB.tokenID == ay.Minus || bB.tokenID == ay.Underbar || bB.tokenID == ay.Identifier || (bB.tokenID == ay.Alpha && bB.token == "u")) {
                                    break
                                } else {
                                    by = null;
                                    break
                                }
                            }
                        }
                    }
                    return by
                }

                function bu(bz, bB) {
                    var by = aD.Exact;
                    var bA = bz.currentToken();
                    if (bA.tokenID == ay.Dot) {
                        bA = bz.nextToken();
                        if (bA.tokenID == ay.Star) {
                            by = aD.Family;
                            bz.nextToken()
                        } else {
                            if (bA.tokenID == ay.Plus) {
                                by = aD.Above;
                                bz.nextToken()
                            }
                        }
                    } else {
                        if (bA.tokenID == ay.Star) {
                            by = aD.Family;
                            bz.nextToken()
                        } else {
                            if (bA.tokenID == ay.Plus) {
                                by = aD.Above;
                                bz.nextToken()
                            }
                        }
                    }
                    return by
                }

                function bt(bz) {
                    var by = null;
                    var bB = bz.currentToken();
                    if (bB.tokenID == ay.Minus) {
                        var bA = bB;
                        var bB = bz.nextToken();
                        if (bB.tokenID == ay.Alpha) {
                            by = bB.token;
                            bz.nextToken()
                        } else {
                            bz.pushToken(bA)
                        }
                    }
                    return by
                }

                function bw(bz, bD) {
                    var by = null;
                    var bB = bz.currentToken();
                    if (bB.tokenID == ay.Plus) {
                        var bA = bB;
                        var bB = bz.nextToken();
                        if (bB.tokenID == ay.Digits) {
                            by = parseInt(bB.token);
                            bz.nextToken()
                        } else {
                            bz.pushToken(bA)
                        }
                    } else {
                        if (bD == true) {
                            if (bB.tokenID == ay.Minus || bB.tokenID == ay.Underbar) {
                                var bA = bB;
                                bB = bz.nextToken();
                                if (bB.tokenID == ay.Identifier && bB.token[0] == "b") {
                                    var bC = parseInt(bB.token.substr(1));
                                    if (bC != null && isNaN(bC) == false) {
                                        bz.nextToken();
                                        by = bC
                                    }
                                } else {
                                    bz.pushToken(bA)
                                }
                            }
                        }
                    }
                    return by
                }

                function bs(bz, bA) {
                    var by = false;
                    if (bz.length == 1 && parseInt(bz[0]) <= 8 && bA.tokenID == ay.Identifier && bA.token.length > 0 && bA.token.charAt(0) == "u") {
                        by = true
                    }
                    return by
                }

                function br(bz) {
                    var by = null;
                    var bA = bz.currentToken();
                    if (bA.tokenID == ay.Identifier) {
                        by = parseInt(bA.token.substr(1));
                        bz.nextToken()
                    } else {
                        if (bA.tokenID == ay.Star) {
                            lmatch = aD.Family;
                            bz.nextToken()
                        } else {
                            if (bA.tokenID == ay.Plus) {
                                lmatch = aD.Above;
                                bz.nextToken()
                            }
                        }
                    }
                    return by
                }

                function bx(bz) {
                    var by = null;
                    var bA = bz.currentToken();
                    if (bA.tokenID == ay.Alpha) {
                        by = bA.token;
                        bz.nextToken()
                    }
                    return by
                }

                function bv(bD) {
                    var bI = null;
                    var bF = false;
                    var by = false;
                    var bz = null;
                    var bH = null;
                    var bC = aD.Exact;
                    var bA = false;
                    var bG = null;
                    bD.start();
                    var bB = bD.nextToken();
                    if (bB.tokenID == ay.Digits) {
                        bz = bq(bD);
                        if (bz != null && bz.length > 0) {
                            bB = bD.currentToken();
                            if (bz[0] == 1) {
                                if (bz.length >= 2 && bz[1] == 9) {
                                    return null
                                }
                                by = true
                            } else {
                                if (bB.token == "u") {
                                    bB = bD.nextToken()
                                }
                            }
                            if (bs(bz, bB) == true) {
                                by = true;
                                var bE = br(bD);
                                if (bE != null) {
                                    bB = bD.currentToken();
                                    bz.push(parseInt(bE));
                                    by = true;
                                    if (bB.tokenID == ay.End) {
                                        bF = true
                                    } else {
                                        bC = bu(bD);
                                        bB = bD.currentToken();
                                        if (bB.tokenID == ay.End) {
                                            bF = true
                                        }
                                    }
                                }
                            } else {
                                bB = bD.currentToken();
                                if (by == true && bB.tokenID == ay.Underbar) {
                                    bB = bD.nextToken();
                                    if (bB.tokenID == ay.Digits && bz.length < a3) {
                                        bz.push(parseInt(bB.token));
                                        bD.nextToken()
                                    }
                                }
                                bA = bt(bD);
                                bB = bD.currentToken();
                                bH = bw(bD, by);
                                bG = bx(bD);
                                bC = bu(bD, by);
                                bB = bD.currentToken();
                                if (bB.tokenID == ay.End) {
                                    bF = true
                                }
                            }
                            if (bF == true) {
                                bI = {
                                    old: by,
                                    version: bz,
                                    build: bH,
                                    match: bC,
                                    pre: bA,
                                    opt: bG
                                }
                            }
                        }
                    }
                    return bI
                }
                return {
                    parse: bv
                }
            }

            function d(by, bv) {
                var bq = false;
                var br = new Array;
                var bA = null;
                var bu = null;
                var bt = false;
                var bx = null;
                if (by == null || by.length == 0) {
                    br = [0, 0, 0, 0]
                } else {
                    var bw = bj(by);
                    var bs = bf();
                    var bz = bs.parse(bw);
                    if (bz != null) {
                        if (bv == true && bz.old == true) {
                            if (bz.version.length > 0 && bz.version[0] == 1) {
                                br = bz.version.splice(1, bz.version.length - 1)
                            } else {
                                br = bz.version
                            }
                            bq = true
                        } else {
                            br = bz.version
                        }
                        bA = bz.build;
                        bu = bz.match;
                        bt = bz.pre
                    }
                }
                return {
                    old: bq,
                    version: br,
                    build: bA,
                    match: bu,
                    pre: bt,
                    opt: bx
                }
            }

            function a7(bt, bs) {
                var br = false;
                var bq = bt;
                if (bq == null) {
                    bq = 0
                }
                if (parseInt(bq) == parseInt(bs)) {
                    br = true
                }
                return br
            }

            function a2(bs, br) {
                var bq = false;
                if ((bs.major != null) && (br.major != null) && a7(bs.major, br.major) && a7(bs.minor, br.minor) && a7(bs.security, br.security) && a7(bs.patch, br.patch) && (bs.old == br.old) && (bs.pre == br.pre) && ((parseInt(bs.build) == parseInt(br.build)) || (bs.build == null && br.build == null))) {
                    bq = true
                }
                return bq
            }

            function a4(bu, br) {
                var bq = false;
                if (bu.old == true && bu.version.length == 0 && br.old == true) {
                    bq = true
                } else {
                    for (index = 0; index < bu.version.length && index < br.version.length; index++) {
                        var bt = bu.version[index];
                        var bs = br.version[index];
                        if (parseInt(bt) == parseInt(bs)) {
                            bq = true
                        } else {
                            bq = false;
                            break
                        }
                    }
                }
                return bq
            }

            function bo(bv, br) {
                var bq = false;
                if (bv.old == true && bv.version.length == 0) {
                    bq = true
                } else {
                    if (bv.old == true && br.old == false) {
                        bq = true
                    } else {
                        if (bv.major == 0) {
                            bq = true
                        } else {
                            if ((bv.major != null) && (br.major != null) && ((parseInt(bv.build) == parseInt(br.build)) || (bv.build == null && br.build == null))) {
                                for (var bt = 0; bt < bv.version.length; bt++) {
                                    var bu = bv.version[bt];
                                    var bs = br.version[bt];
                                    if (parseInt(bu) == parseInt(bs)) {
                                        bq = true
                                    } else {
                                        if (parseInt(bu) < parseInt(bs)) {
                                            if ((bv.old == true && br.old == true) || (bv.old == false && br.old == false)) {
                                                bq = true
                                            }
                                            break
                                        } else {
                                            bq = false;
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return bq
            }

            function a9(bq) {
                var bs = bq.version.slice(0);
                for (var br = bs.length; br < 4; br++) {
                    bs.push(0)
                }
                var bt = w(bs);
                return {
                    old: bq.old,
                    major: bt.major,
                    minor: bt.minor,
                    security: bt.security,
                    patch: bt.patch,
                    version: bs,
                    build: bq.build,
                    pre: bq.pre
                }
            }

            function bn(bt, br) {
                var bq = false;
                if (bt.VersionString == null || bt.VersionString.length == 0) {
                    bq = true
                } else {
                    if (bt.build == null && br.build == null) {
                        var bs = a9(br);
                        if (bt.match == aD.Exact) {
                            bq = a2(bt, bs)
                        } else {
                            if (bt.match == aD.Family) {
                                bq = a4(bt, bs)
                            } else {
                                if (bt.match == aD.Above) {
                                    bq = bo(bt, bs)
                                }
                            }
                        }
                    }
                }
                return bq
            }

            function bd(bu, bs) {
                var br = false;
                if (query.VersionString == null || query.VersionString.length == 0) {
                    br = true
                } else {
                    var bt = a9(bs);
                    var bq = a9(query);
                    br = a2(bq, bt)
                }
                return br
            }
        };

        function aY(a3, d, a4) {
            var a2 = new l(a3, a4);
            var w = new l(d, a4);
            return w.check(a2)
        }

        function i(a3, d) {
            var a2 = new l(a3, false);
            if (parseInt(a2.major) >= 3 && parseInt(a2.major) <= 7 && a3.substr(-1) !== "+") {
                return false
            }
            if (a2.match == aD.Exact) {
                a2 = new l(a3 + "+", false)
            }
            var w = new l(d, false);
            return w.check(a2)
        }

        function aQ() {
            if (!am()) {
                if (postponeNativePluginInstallation && u(aa.body)) {
                    X();
                    postponeNativePluginInstallation = false
                }
                var d = e();
                if (d != null) {
                    return true
                }
                return false
            }
            return true
        }

        function y(a7) {
            if (ad.jre != null) {
                if (aY(a7, ad.jre)) {
                    return "ok"
                }
            }
            var a6 = e();
            if (a6 != null) {
                var a3 = a6.jvms;
                for (var a5 = 0; a3 != null && a5 < a3.getLength(); a5++) {
                    if (aY(a7, a3.get(a5).version)) {
                        if (!ad.ie && u(navigator.mimeTypes)) {
                            if (!u(navigator.mimeTypes["application/x-java-applet"])) {
                                return "disabled"
                            }
                        }
                        return "ok"
                    }
                }
                return "none"
            }
            if (ad.ie) {
                var d = ["1.8.0", "1.7.0", "1.6.0", "1.5.0"];
                for (var a2 = 0; a2 < d.length; a2++) {
                    if (aY(a7, d[a2])) {
                        try {
                            var a4 = new ActiveXObject("JavaWebStart.isInstalled." + d[a2] + ".0");
                            return "ok"
                        } catch (w) {}
                    }
                }
            }
            return "none"
        }

        function F() {
            var w = ["iPhone", "iPod"];
            var a2 = D(w, navigator.userAgent);
            var d = (ad.mac && ad.chrome && ad.cputype == "intel");
            auto = a2 || (e() != null);
            return {
                os: a2,
                browser: d,
                auto: auto
            }
        }

        function ao() {
            if (ad.ie) {
                try {
                    var d = 10 * ScriptEngineMajorVersion() + ScriptEngineMinorVersion();
                    if (d < 57) {
                        return true
                    }
                } catch (w) {
                    return true
                }
            }
            return false
        }

        function aL() {
            var d;
            if (ad.win) {
                d = ad.op || ad.wk || ao();
                return {
                    os: false,
                    browser: d
                }
            } else {
                if (ad.mac && ad.cputype == "intel") {
                    var w = !aY("10.7.3+", ad.osVersion, false);
                    d = ad.op || (ad.mac && ad.chrome);
                    return {
                        os: w,
                        browser: d
                    }
                } else {
                    if (ad.linux) {
                        d = ad.op;
                        return {
                            os: false,
                            browser: d
                        }
                    } else {
                        return {
                            os: true,
                            browser: false
                        }
                    }
                }
            }
        }

        function aw(d) {
            if (u(d) && d.length > 0) {
                var w = d.charAt(d.length - 1);
                if (w == "*") {
                    d = d.substring(0, d.length - 1) + "+"
                } else {
                    if (w != "+") {
                        d = d + "+"
                    }
                }
            }
            return d
        }

        function Q(d) {
            var w = new dtjava.Platform(d);
            w.jvm = aw(w.jvm);
            return g(w)
        }

        function g(a2, a8) {
            a2 = new dtjava.Platform(a2);
            var a3 = "ok",
                bb = "ok",
                ba = false,
                a5 = false,
                a6 = false,
                w, d;
            if (u(a2.jvm) && y(a2.jvm) != "ok") {
                var a7 = y("1+");
                if (a7 == "ok") {
                    bb = "old"
                } else {
                    bb = a7
                }
                d = F();
                if (d.os) {
                    bb = "unsupported";
                    a5 = true
                } else {
                    if (a8) {
                        bb = "ok"
                    } else {
                        a6 = d.browser
                    }
                }
            }
            if (u(a2.javafx)) {
                d = aL();
                if (d.os) {
                    a3 = "unsupported";
                    a5 = a5 || d.os
                } else {
                    if (a8) {
                        a3 = "ok"
                    } else {
                        if (d.browser) {
                            a6 = a6 || d.browser
                        } else {
                            if (ad.fx != null) {
                                if (i(a2.javafx, ad.fx)) {
                                    a3 = "ok"
                                } else {
                                    if (i("2.0+", ad.fx)) {
                                        a3 = "old"
                                    }
                                }
                            } else {
                                if (ad.win) {
                                    try {
                                        w = e();
                                        var a9 = w.getInstalledFXVersion(a2.javafx);
                                        if (a9 == "" || a9 == null) {
                                            a9 = w.getInstalledFXVersion(a2.javafx + "+")
                                        }
                                        if (a9 == "" || a9 == null) {
                                            a9 = w.getInstalledFXVersion("2.0+");
                                            if (a9 == null || a9 == "") {
                                                a3 = "none"
                                            } else {
                                                a3 = "old"
                                            }
                                        }
                                    } catch (a4) {
                                        a3 = "none"
                                    }
                                } else {
                                    if (ad.mac || ad.linux) {
                                        a3 = "none"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ba = ba || (!a5 && a6);
            if (a3 != "ok" || bb != "ok" || ba || a5 || a6) {
                return new H({
                    fx: a3,
                    jre: bb,
                    relaunch: ba,
                    os: a5,
                    browser: a6,
                    platform: a2
                })
            } else {
                if (ad.override == false && !a8 && !aQ()) {
                    return new H({
                        fx: a3,
                        jre: "none",
                        relaunch: ba,
                        os: a5,
                        browser: a6,
                        platform: a2
                    })
                }
            }
            return null
        }

        function W() {
            var d = null;
            d = navigator.userLanguage;
            if (d == null) {
                d = navigator.systemLanguage
            }
            if (d == null) {
                d = navigator.language
            }
            if (d != null) {
                d = d.replace("-", "_")
            }
            return d
        }

        function ar(d) {
            if (!u(d)) {
                d = W()
            }
            return "https://java.com/dt-redirect?" + ((u(window.location) && u(window.location.href)) ? ("&returnPage=" + window.location.href) : "") + (u(d) ? ("&locale=" + d) : "")
        }

        function V(d) {
            return "http://www.oracle.com/technetwork/java/javafx/downloads/index.html"
        }

        function at(d) {
            if (d != null) {
                var a2 = d.jreStatus();
                var w = d.javafxStatus();
                return (a2 == "none" || w == "none" || a2 == "old" || w == "old") && (w != "disabled" && a2 != "disabled")
            }
            return false
        }

        function aE(w, a2, a3, a8, a6, ba) {
            var a9, d;
            if (a2) {
                a9 = "Java";
                d = "java"
            } else {
                a9 = "JavaFX";
                d = "javafx"
            }
            var a5, a4, a7;
            if (a3) {
                a5 = "A newer version of " + a9 + "is required to view the content on this page.";
                a4 = "Please click here to update " + a9;
                a7 = "upgrade_" + d + ".png"
            } else {
                a5 = "View the content on this page.";
                a4 = "Please click here to install " + a9;
                a7 = "get_" + d + ".png"
            }
            var bb = "Click to install " + a9;
            aF(w, a5, a4, bb, a7, ba)
        }

        function aF(w, a5, a4, a8, a6, a7) {
            var d = aa.createElement("div");
            d.width = aS(w.width);
            d.height = aS(w.height);
            var a3 = aa.createElement("a");
            a3.href = "";
            a3.onclick = function() {
                a7();
                return false
            };
            if (w.width < 250 || w.height < 160) {
                d.appendChild(aa.createElement("p").appendChild(aa.createTextNode(a5)));
                a3.appendChild(aa.createTextNode(a4));
                d.appendChild(a3)
            } else {
                var a2 = aa.createElement("img");
                a2.src = z + a6;
                a2.alt = a8;
                a2.style.borderWidth = "0px";
                a2.style.borderStyle = "none";
                a3.appendChild(a2);
                d.appendChild(a3)
            }
            q(w.placeholder);
            w.placeholder.appendChild(d)
        }

        function ax(d) {
            if (aY(d.jvm, aG, false) && i(d.javafx, "2.2.0")) {
                return true
            }
            return false
        }

        function o(a3, w, a4, a7, a8, a9) {
            var a6 = function() {
                f(a3, w, a4, a9)
            };
            var ba = g(w);
            if (!u(ba)) {
                if (u(a9)) {
                    a9()
                }
            }
            var a5 = u(ba) && (ba.javafxStatus() == "old" || ba.jreStatus() == "old");
            if (u(a3.placeholder)) {
                if (ax(w)) {
                    aE(a3, true, a5, a7, a8, a6)
                } else {
                    aE(a3, (ba.jreStatus() != "ok"), a5, a7, a8, a6)
                }
            } else {
                var d = a7;
                var a2 = null;
                if (!d) {
                    if (ax(w)) {
                        if (a5) {
                            a2 = "A newer version of Java is required to view the content on this page. Please click here to update Java."
                        } else {
                            a2 = "To view the content on this page, please click here to install Java."
                        }
                        d = confirm(a2)
                    } else {
                        if (a5) {
                            a2 = "A newer version of JavaFX is required to view the content on this page. Please click here to update JavaFX."
                        } else {
                            a2 = "To view the content on this page, please click here to install JavaFX."
                        }
                        d = confirm(a2)
                    }
                }
                if (d) {
                    a6()
                }
            }
        }

        function r(d) {
            if (!ad.ie) {
                return true
            }
            if (aY("10.0.0+", e().version, false)) {
                return true
            }
            if (d == null) {
                return false
            }
            return !aY("1.6.0_33+", d)
        }

        function I(d, a3, w) {
            if (!ad.win) {
                return false
            }
            var a2 = e();
            if (a2 == null || !v(a2.version)) {
                return false
            }
            if (a3 != "ok") {
                if (!r(d.jvm)) {
                    return false
                }
            }
            if (w != "ok") {
                if (!ax(d)) {
                    if (!aY("10.0.0+", e().version, false)) {
                        return false
                    }
                } else {
                    if (!r(aG)) {
                        return false
                    }
                }
            }
            return true
        }

        function f(a7, a2, w, d) {
            var a5 = g(a2);
            w = new dtjava.Callbacks(w);
            if (u(a5) && a5.isUnsupportedPlatform()) {
                N(a7, a5, w);
                return false
            }
            var a6 = (a7 != null) ? a7.placeholder : null;
            var a4, a3;
            if (at(a5)) {
                if (a5.jre != "ok") {
                    if (v(w.onInstallStarted)) {
                        w.onInstallStarted(a6, "Java", false, e() != null)
                    }
                    aW()
                } else {
                    N(a7, a5, w)
                }
            } else {
                if (d != null) {
                    d()
                }
                return true
            }
            return false
        }

        function aW() {
            R.open(ar())
        }

        function aR() {
            R.open(ah)
        }

        function a0(a5) {
            if (a5.placeholder != null) {
                var a3 = a5.width,
                    a7 = a5.height;
                var a6 = !(a3 < 100 && a7 < 100);
                var a2 = a6 ? "javafx-loading-100x100.gif" : "javafx-loading-25x25.gif";
                var d = a6 ? 80 : 25;
                var a4 = a6 ? 80 : 25;
                var w = aa.createElement("img");
                w.src = z + a2;
                w.alt = "";
                w.style.position = "relative";
                w.style.top = "50%";
                w.style.left = "50%";
                w.style.marginTop = aS(-a4 / 2);
                w.style.marginLeft = aS(-d / 2);
                return w
            } else {
                return null
            }
        }

        function aK(w) {
            if (w.placeholder != null) {
                var d = aa.createElement("p");
                d.appendChild(aa.createTextNode("FIXME - add real message!"));
                return d
            }
            return null
        }

        function q(d) {
            while (d.hasChildNodes()) {
                d.removeChild(d.firstChild)
            }
        }

        function aj(a4, a2, d, w) {
            if (a4 != null) {
                var a3 = null;
                if (d) {
                    a3 = (a2 == "JavaFX") ? "install:inprogress:javafx" : "install:inprogress:jre"
                } else {
                    a3 = (a2 == "JavaFX") ? "install:inprogress:javafx:manual" : "install:inprogress:jre:manual"
                }
                aV(a3)
            }
        }

        function s(a5, w, d, a4) {
            var a2;
            if (d != "success") {
                var a3 = null;
                if (w == "javafx") {
                    if (!aQ()) {
                        a3 = "install:fx:error:nojre"
                    } else {
                        a3 = "install:fx:" + d
                    }
                } else {
                    a3 = "install:jre:" + d
                }
                if (a5 != null) {
                    a2 = S(a3, null);
                    q(a5);
                    a5.appendChild(a2)
                } else {
                    R.alert(az(a3))
                }
            } else {
                if (a4) {
                    a2 = aV("install:fx:restart");
                    q(a5);
                    a5.appendChild(a2)
                }
            }
        }

        function a1(w, d) {
            if (d == null) {
                code = "success"
            } else {
                if (d.isUnsupportedBrowser()) {
                    code = "browser"
                } else {
                    if (d.jreStatus() != "ok") {
                        code = "jre:" + d.jreStatus()
                    } else {
                        if (d.javafxStatus() != "ok") {
                            code = "javafx:" + d.javafxStatus()
                        } else {
                            if (d.isRelaunchNeeded()) {
                                code = "relaunch"
                            } else {
                                code = "unknown " + d.toString()
                            }
                        }
                    }
                }
            }
            if (w.placeholder != null) {
                G(w.id, code, null)
            } else {
                R.alert(az(code))
            }
        }

        function ac(w) {
            var d = P(w);
            if (O(w) != null) {
                G(w, "launch:fx:generic:embedded", function() {
                    av(P(w), false);
                    return false
                })
            } else {
                R.alert(az("launch:fx:generic"))
            }
        }

        function e() {
            var d = null;
            if (ad.override == false) {
                navigator.plugins.refresh(false);
                d = document.getElementById("dtjavaPlugin")
            }
            return d
        }

        function X() {
            if (e() != null) {
                return
            }
            if (!u(aa.body) && !aN) {
                T(function() {
                    X()
                });
                postponeNativePluginInstallation = true;
                return
            }
            var a2 = null;
            if (ad.ie) {
                a2 = aa.createElement("object");
                a2.width = "1px";
                a2.height = "1px";
                a2.classid = "clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA"
            } else {
                if (!ad.wk && !ad.op && navigator.mimeTypes != null) {
                    var a4 = "application/java-deployment-toolkit";
                    var a3 = false;
                    for (var w = 0; w < navigator.mimeTypes.length; w++) {
                        var d = navigator.mimeTypes[w];
                        a3 = a3 || ((d.type == a4) && d.enabledPlugin)
                    }
                    if (a3) {
                        a2 = aa.createElement("embed");
                        a2.setAttribute("type", a3 ? a4 : oldMimeType);
                        a2.setAttribute("hidden", "true")
                    }
                }
            }
            if (a2 != null) {
                a2.setAttribute("id", "dtjavaPlugin");
                aa.body.appendChild(a2);
                if (ad.deploy == null && v(a2.version)) {
                    ad.deploy = a2.version
                }
            }
        }
        var B = 0;

        function aH(d) {
            if (u(d.id)) {
                return d.id
            } else {
                B++;
                return ("dtjava-app-" + B)
            }
        }

        function K(a2, a4, a5) {
            var w = aa.createElement("div");
            w.width = aS(a2.width);
            w.height = aS(a2.height);
            w.id = a2.id + "-app";
            w.style.position = "relative";
            var d = aa.createElement("applet");
            d.code = "dummy.class";
            d.id = a2.id;
            d.width = aS(a2.width);
            d.height = aS(a2.height);
            var a6 = {
                jnlp_href: a2.url,
                java_status_events: true,
                type: "application/x-java-applet"
            };
            if (u(a2.jnlp_content)) {
                a6.jnlp_embedded = a2.jnlp_content
            }
            if (u(a4.javafx)) {
                if (!u(a2.toolkit) || a2.toolkit == "fx") {
                    a6.javafx_version = ((a4.javafx == "*") ? "2.0+" : a4.javafx)
                }
                a6.separate_jvm = true;
                a6.javafx_applet_id = d.id;
                a6.scriptable = true
            } else {
                if (a2.scriptable) {
                    a6.scriptable = true
                }
                if (a2.sharedjvm) {
                    a6.separate_jvm = true
                }
            }
            if (u(a4.jvmargs)) {
                a6.java_arguments = E(a4.jvmargs)
            }
            var a7, a3;
            for (a7 in a2.params) {
                if (!u(a6[a7])) {
                    a3 = aa.createElement("param");
                    a3.name = a7;
                    a3.value = a2.params[a7];
                    d.appendChild(a3)
                }
            }
            for (a7 in a6) {
                a3 = aa.createElement("param");
                a3.name = a7;
                a3.value = a6[a7];
                d.appendChild(a3)
            }
            if (v(a5.onGetNoPluginMessage)) {
                a3 = aa.createElement("noapplet");
                var a8 = a5.onGetNoPluginMessage(a2);
                a3.appendChild(a8)
            }
            w.appendChild(d);
            return w
        }

        function P(w) {
            var d = aa.getElementById(w + "-app");
            if (d == null) {
                d = aa.getElementById(w)
            }
            return d
        }

        function av(w, d) {
            if (!u(w)) {
                return
            }
            if (d) {
                w.style.left = -10000
            } else {
                w.style.left = "0px"
            }
        }

        function ae(w, d) {
            if (!u(w)) {
                return
            }
            if (d) {
                w.style.visibility = "hidden"
            } else {
                w.style.visibility = "visible"
            }
        }

        function h(a3) {
            try {
                var a2 = O(a3);
                if (a2 != null && a2.style != null && a2.style.visibility == "visible") {
                    return
                }
                var d = P(a3);
                av(d, false);
                ae(aa.getElementById(a3 + "-splash"), true)
            } catch (w) {}
        }
        var ah = "https://java.com/javafx";
        var aq = {
            "launch:fx:generic": ["JavaFX application could not launch due to system configuration.", " See ", "a", "https://java.com/javafx", "java.com/javafx", " for troubleshooting information."],
            "launch:fx:generic:embedded": ["JavaFX application could not launch due to system configuration ", "(", "onclick", "show error details", ").", " See ", "a", "https://java.com/javafx", "java.com/javafx", " for troubleshooting information."],
            "install:fx:restart": ["Restart your browser to complete the JavaFX installation,", " then return to this page."],
            "install:fx:error:generic": ["JavaFX install not completed.", " See ", "a", "https://java.com/javafx", "java.com/javafx", " for troubleshooting information."],
            "install:fx:error:download": ["JavaFX install could not start because of a download error.", " See ", "a", "https://java.com/javafx", "java.com/javafx", " for troubleshooting information."],
            "install:fx:error:cancelled": ["JavaFX install was cancelled.", " Reload the page and click on the download button to try again."],
            "install:jre:error:cancelled": ["Java install was cancelled.", " Reload the page and click on the download button to try again."],
            "install:jre:error:generic": ["Java install not completed.", " See ", "a", "https://java.com/", "java.com", " for troubleshooting information."],
            "install:jre:error:download": ["Java install could not start because of a download error.", " See ", "a", "https://java.com/", "java.com/", " for troubleshooting information."],
            "install:inprogress:jre": ["Java install in progress."],
            "install:inprogress:javafx": ["JavaFX install in progress."],
            "install:inprogress:javafx:manual": ["Please download and run JavaFX Setup from ", "a", V(null), "java.com/javafx", ". When complete, restart your browser to finish the installation,", " then return to this page."],
            "install:inprogress:jre:manual": ["Please download and run Java Setup from ", "a", ar(), "java.com/download", ". When complete, reload the page."],
            "install:fx:error:nojre": ["b", "Installation failed.", "br", "Java Runtime is required to install JavaFX and view this content. ", "a", ar(), "Download Java Runtime", " and run the installer. Then reload the page to install JavaFX."],
            browser: ["Content can not be displayed using your Web browser. Please open this page using another browser."],
            "jre:none": ["JavaFX application requires a recent Java runtime. Please download and install the latest JRE from ", "a", "https://java.com", "java.com", "."],
            "jre:old": ["JavaFX application requires a recent Java runtime. Please download and install the latest JRE from ", "a", "https://java.com", "java.com", "."],
            "jre:plugin": ["b", "A Java plugin is required to view this content.", "br", "Make sure that ", "a", "https://java.com", "a recent Java runtime", " is installed, and the Java plugin is enabled."],
            "jre:blocked": ["Please give Java permission to run. This will allow Java to present content provided on this page."],
            "jre:unsupported": ["b", "Java is required to view this content but Java is currently unsupported on this platform.", "br", "Please consult ", "a", "https://java.com", "the Java documentation", " for list of supported platforms."],
            "jre:browser": ["b", "Java plugin is required to view this content but Java plugin is currently unsupported in this browser.", "br", "Please try to launch this application using other browser. Please consult ", "a", "https://java.com", "the Java documentation", " for list of supported browsers for your OS."],
            "javafx:unsupported": ["b", "JavaFX 2.0 is required to view this content but JavaFX is currently unsupported on this platform.", "br", "Please consult ", "a", ah, "the JavaFX documentation", " for list of supported platforms."],
            "javafx:old": ["This application requires newer version of JavaFX runtime. ", "Please download and install the latest JavaFX Runtime from ", "a", ah, "java.com/javafx", "."],
            "javafx:none": ["b", "JavaFX 2.0 is required to view this content.", "br", "a", ah, "Get the JavaFX runtime from java.com/javafx", " and run the installer. Then restart the browser."],
            "javafx:disabled": ["JavaFX is disabled. Please open Java Control Panel, switch to Advanced tab and enable it. ", "Then restart the browser."],
            "jre:oldplugin": ["New generation Java plugin is required to view this content. Please open Java Control Panel and enable New Generation Java Plugin."],
            "jre:disabled": ["Java plugin appear to be disabled in your browser. ", " Please enable Java in the browser options."]
        };

        function aJ(w, d, a5) {
            var a3 = 0;
            var a2 = aa.createElement("p");
            if (d != null) {
                a2.appendChild(d)
            }
            var a4;
            while (a3 < w.length) {
                switch (w[a3]) {
                    case "a":
                        a4 = aa.createElement(w[a3]);
                        a4.href = w[a3 + 1];
                        a4.appendChild(aa.createTextNode(w[a3 + 2]));
                        a3 = a3 + 2;
                        break;
                    case "br":
                        a4 = aa.createElement(w[a3]);
                        break;
                    case "b":
                        a4 = aa.createElement(w[a3]);
                        a4.appendChild(aa.createTextNode(w[a3 + 1]));
                        a3++;
                        break;
                    case "onclick":
                        a4 = aa.createElement("a");
                        a4.href = "";
                        if (a5 == null) {
                            a5 = function() {
                                return false
                            }
                        }
                        a4.onclick = a5;
                        a4.appendChild(aa.createTextNode(w[a3 + 1]));
                        a3 = a3 + 1;
                        break;
                    default:
                        a4 = aa.createTextNode(w[a3]);
                        break
                }
                a2.appendChild(a4);
                a3++
            }
            return a2
        }

        function az(a3) {
            var w = "";
            var d = aq[a3];
            var a2 = 0;
            if (u(d)) {
                while (a2 < d.length) {
                    if (d[a2] != "a" && d[a2] != "br" && d[a2] != "b") {
                        w += d[a2]
                    } else {
                        if (d[a2] == "a") {
                            a2++
                        }
                    }
                    a2++
                }
            } else {
                w = "Unknown error: [" + a3 + "]"
            }
            return w
        }

        function O(d) {
            return aa.getElementById(d + "-error")
        }

        function G(a3, d, w) {
            var a2 = O(a3);
            if (!u(a2)) {
                return
            }
            q(a2);
            a2.appendChild(S(d, w));
            a2.style.visibility = "visible";
            ae(aa.getElementById(a3 + "-splash"), true);
            av(P(a3), true)
        }

        function S(a3, a4) {
            var a2 = aa.createElement("div");
            var w = aa.createElement("img");
            w.src = z + "error.png";
            w.width = "16px";
            w.height = "16px";
            w.alt = "";
            w.style.cssFloat = "left";
            w.style.styleFloat = "left";
            w.style.margin = "0px 10px 60px 10px";
            w.style.verticalAlign = "text-top";
            var d = aq[a3];
            if (!u(d)) {
                d = [a3]
            }
            var a5 = null;
            if (v(a4)) {
                a5 = function() {
                    if (u(a2.parentNode)) {
                        a2.parentNode.removeChild(a2)
                    }
                    try {
                        a4()
                    } catch (a6) {}
                    return false
                }
            }
            a2.appendChild(aJ(d, w, a5));
            return a2
        }

        function aV(a2) {
            var w = aa.createElement("div");
            var d = aq[a2];
            if (!u(d)) {
                d = [a2]
            }
            w.appendChild(aJ(d, null, null));
            return w
        }

        function au(w, d) {
            var a2 = null;
            if (u(w)) {
                if (d && typeof w === "string") {
                    a2 = new dtjava.App(w, null)
                } else {
                    if (w instanceof dtjava.App) {
                        a2 = w
                    } else {
                        a2 = new dtjava.App(w.url, w)
                    }
                }
            }
            return a2
        }

        function ak(w, a2) {
            var d = new dtjava.Callbacks(a2);
            if (w.javafx == null && d.onGetSplash === a0) {
                d.onGetSplash = null
            }
            return d
        }

        function aS(d) {
            if (isFinite(d)) {
                return d + "px"
            } else {
                return d
            }
        }

        function af(a2, w, a3) {
            var d = a2.id + "-" + a3;
            var a4 = aa.createElement("div");
            a4.id = d;
            a4.style.width = aS(a2.width);
            a4.style.height = aS(a2.height);
            a4.style.position = "absolute";
            a4.style.backgroundColor = "white";
            if (w != null) {
                a4.appendChild(w)
            }
            return a4
        }
        var b = {};

        function aI(a3, d) {
            if (d == null) {
                d = b[a3];
                if (u(d)) {
                    b[a3] = null
                } else {
                    return
                }
            }
            var w = document.getElementById(a3);
            if (!u(w)) {
                return
            }
            if (v(d.onJavascriptReady)) {
                var a2 = d.onJavascriptReady;
                if (w.status < 2) {
                    w.onLoad = function() {
                        a2(a3);
                        w.onLoad = null
                    }
                }
            }
            if (v(d.onRuntimeError)) {
                if (w.status < 3) {
                    w.onError = function() {
                        d.onRuntimeError(a3)
                    }
                } else {
                    if (w.status == 3) {
                        d.onRuntimeError(a3)
                    }
                }
            }
        }

        function aM(a2, d) {
            if (!u(d) || !(v(d.onDeployError) || v(d.onJavascriptReady))) {
                return null
            }
            var w = aa.createElement("script");
            b[a2] = d;
            w.text = "dtjava.installCallbacks('" + a2 + "')";
            return w
        }

        function aZ(w) {
            var d = af(w, null, "error");
            d.style.visibility = "hidden";
            return d
        }

        function M(a3, w, a4) {
            var a7 = au(a3, false);
            if (!(u(a7) && u(a7.url) && u(a7.width) && u(a7.height) && u(a7.placeholder))) {
                throw "Required attributes are missing! (url, width, height and placeholder are required)"
            }
            a7.id = aH(a7);
            if ((typeof a7.placeholder == "string")) {
                var a5 = aa.getElementById(a7.placeholder);
                if (a5 == null) {
                    throw "Application placeholder [id=" + a7.placeholder + "] not found."
                }
                a7.placeholder = a5
            }
            a7.placeholder.appendChild(aZ(a7));
            w = new dtjava.Platform(w);
            var d = ak(w, a4);
            var a2 = Q(w);
            var a6 = function() {
                var a9 = K(a7, w, d);
                var ba = (d.onGetSplash == null) ? null : d.onGetSplash(a3);
                a7.placeholder.style.position = "relative";
                if (ba != null) {
                    var a8 = af(a7, ba, "splash");
                    ae(a8, false);
                    av(a9, true);
                    q(a7.placeholder);
                    a7.placeholder.appendChild(aZ(a7));
                    a7.placeholder.appendChild(a8);
                    a7.placeholder.appendChild(a9)
                } else {
                    q(a7.placeholder);
                    a7.placeholder.appendChild(aZ(a7));
                    a7.placeholder.appendChild(a9)
                }
                setTimeout(function() {
                    aI(a7.id, d)
                }, 0)
            };
            if (a2 != null) {
                ab(a7, w, a2, d, a6)
            } else {
                a6()
            }
        }

        function t(a4) {
            if (u(a4)) {
                var d = a4.width;
                var a3 = a4.height;
                var a2 = "dummy";
                return new dtjava.App(a2, {
                    id: a4.id,
                    width: d,
                    height: a3,
                    placeholder: a4.parentNode
                })
            } else {
                throw "Can not find applet with null id"
            }
        }

        function aO(a7, w, a5) {
            var a2 = aa.getElementById(a7);
            var a6 = t(a2);
            var d = ak(w, a5);
            w = new dtjava.Platform(w);
            var a4 = function() {
                a6.placeholder.insertBefore(aZ(a6), a2);
                if (d.onGetSplash != null) {
                    var a9 = d.onGetSplash(a6);
                    if (u(a9)) {
                        var a8 = af(a6, a9, "splash");
                        if (u(a8)) {
                            a6.placeholder.style.position = "relative";
                            a6.placeholder.insertBefore(a8, a2);
                            av(a2, true)
                        }
                    }
                }
            };
            var a3 = Q(w);
            if (a3 != null) {
                ab(a6, w, a3, d, a4)
            } else {
                a4()
            }
        }

        function aC(a2, w, d) {
            n(function() {
                aO(a2, w, d)
            })
        }
        ap();
        return {
            version: "20150817",
            validate: function(d) {
                return g(d, ad.noPluginWebBrowser)
            },
            install: function(d, w) {
                return f(null, d, w, null)
            },
            launch: function(w, d, a2) {
                return U(w, d, a2)
            },
            embed: function(a2, w, d) {
                return M(a2, w, d)
            },
            register: function(a2, d, w) {
                return aC(a2, d, w)
            },
            hideSplash: function(d) {
                return h(d)
            },
            addOnloadCallback: function(w, d) {
                if (d || (ad.chrome && !ad.win)) {
                    a(w)
                } else {
                    n(w)
                }
            },
            installCallbacks: function(w, d) {
                aI(w, d)
            },
            Platform: function(w) {
                this.jvm = "1.6+";
                this.javafx = null;
                this.plugin = "*";
                this.jvmargs = null;
                for (var d in w) {
                    this[d] = w[d];
                    if (this["jvmargs"] != null && typeof this.jvmargs == "string") {
                        this["jvmargs"] = this["jvmargs"].split(" ")
                    }
                }
                this.toString = function() {
                    return "Platform [jvm=" + this.jvm + ", javafx=" + this.javafx + ", plugin=" + this.plugin + ", jvmargs=" + this.jvmargs + "]"
                }
            },
            App: function(d, w) {
                this.url = d;
                this.scriptable = true;
                this.sharedjvm = true;
                if (w != undefined && w != null) {
                    this.id = w.id;
                    this.jnlp_content = w.jnlp_content;
                    this.width = w.width;
                    this.height = w.height;
                    this.params = w.params;
                    this.scriptable = w.scriptable;
                    this.sharedjvm = w.sharedjvm;
                    this.placeholder = w.placeholder;
                    this.toolkit = w.toolkit
                }
                this.toString = function() {
                    var a2 = "null";
                    var a3 = true;
                    if (u(this.params)) {
                        a2 = "{";
                        for (p in this.params) {
                            a2 += ((a3) ? "" : ", ") + p + " => " + this.params[p];
                            a3 = false
                        }
                        a2 += "}"
                    }
                    return "dtjava.App: [url=" + this.url + ", id=" + this.id + ", dimensions=(" + this.width + "," + this.height + "), toolkit=" + this.toolkit + ", embedded_jnlp=" + (u(this.jnlp_content) ? (this.jnlp_content.length + " bytes") : "NO") + ", params=" + a2 + "]"
                }
            },
            Callbacks: function(d) {
                this.onGetSplash = a0;
                this.onInstallNeeded = o;
                this.onInstallStarted = aj;
                this.onInstallFinished = s;
                this.onDeployError = a1;
                this.onGetNoPluginMessage = aK;
                this.onJavascriptReady = null;
                this.onRuntimeError = ac;
                for (c in d) {
                    this[c] = d[c]
                }
            }
        }
    }();
    return {dtjava: dtjava};
})