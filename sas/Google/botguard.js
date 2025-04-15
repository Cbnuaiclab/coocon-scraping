
//try{
//(function() {
var botguard = function ()
{
    var Qj = function(Q) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(Q)[1]
    },
    B = function(Q, E) {
        return Q < E ? -1 : Q > E ? 1 : 0
    },
    e = {},
    p = function(Q, E) {
        return "object" == (E = typeof Q, E) && null != Q || "function" == E
    },
    K = this || self,
    Ep = function() {},
    LG = function(Q) {
        for (Q = 0; 64 > Q; ++Q) U[Q] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(Q), e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(Q)] = Q;
        e[e[U[64] = "", "+"] = 62, "/"] = 63, e["="] = 64
    },
    P = function(Q, E, D) {
        if ("object" == (E = typeof Q, E))
            if (Q) {
                if (Q instanceof Array) return "array";
                if (Q instanceof Object) return E;
                if ("[object Window]" == (D = Object.prototype.toString.call(Q), D)) return "object";
                if ("[object Array]" == D || "number" == typeof Q.length && "undefined" != typeof Q.splice && "undefined" != typeof Q.propertyIsEnumerable && !Q.propertyIsEnumerable("splice")) return "array";
                if ("[object Function]" == D || "undefined" != typeof Q.call && "undefined" != typeof Q.propertyIsEnumerable && !Q.propertyIsEnumerable("call")) return "function"
            } else return "null";
        else if ("function" == E && "undefined" == typeof Q.call) return "object";
        return E
    },
    I, U = {},
    oc = function(Q, E, D, d, Z) {
        for (d = (E = [], D = 0); d < Q.length; d++) Z = Q.charCodeAt(d), 128 > Z ? E[D++] = Z : (2048 > Z ? E[D++] = Z >> 6 | 192 : (55296 == (Z & 64512) && d + 1 < Q.length && 56320 == (Q.charCodeAt(d + 1) & 64512) ? (Z = 65536 + ((Z & 1023) << 10) + (Q.charCodeAt(++d) & 1023), E[D++] = Z >> 18 | 240, E[D++] = Z >> 12 & 63 | 128) : E[D++] = Z >> 12 | 224, E[D++] = Z >> 6 & 63 | 128), E[D++] = Z & 63 | 128);
        return E
    },
    D7 = function(Q, E) {
        function D() {}(((D.prototype = E.prototype, Q).f = E.prototype, Q).prototype = new D, Q).prototype.constructor = Q, Q.zL = function(d, Z, L) {
            for (var n = Array(arguments.length - 2), w = 2; w < arguments.length; w++) n[w - 2] = arguments[w];
            return E.prototype[Z].apply(d, n)
        }
    },
    t;
    a: {
    var d_ = K.navigator;
    if (d_) {
        var j8 = d_.userAgent;
        if (j8) {
            I = j8;
            break a
        }
    }
    I = ""
    }
    var $X = function(Q) {
        return (Q = K.document) ? Q.documentMode : void 0
    },
    nG = function(Q, E, D) {
        for (D in Q)
            if (E.call(void 0, Q[D], D, Q)) return true;
        return false
    },
    w_ = function(Q, E, D) {
        return Object.prototype.hasOwnProperty.call((D = Z7, D), Q) ? D[Q] : D[Q] = E(Q)
    },
    M = "",
    F = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(I),
    T = (F && (M = F ? F[1] : ""), $X)(),
    lN = null != T && T > parseFloat(M) ? String(T) : M,
    Wt, Z7 = {},
    iN = K.document,
    Y = 9 <= Number((Wt = iN ? $X() || ("CSS1Compat" == iN.compatMode ? parseInt(lN, 10) : 5) : void 0, Wt)),
    e8 = ! function(Q) {
        return w_(Q, function(E, D, d, Z, L, n, w) {
            for (L = (D = Qj(String((E = 0, lN))).split((d = Qj(String(Q)).split("."), ".")), Z = Math.max(D.length, d.length), 0); 0 == E && L < Z; L++) {
                n = (w = d[L] || "", D[L] || "");
                do {
                    if ((n = /(\d*)(\D*)(.*)/.exec(n) || ["", "", "", ""], w = /(\d*)(\D*)(.*)/.exec(w) || ["", "", "", ""], 0 == n[0].length) && 0 == w[0].length) break;
                    w = (n = (E = B(0 == n[1].length ? 0 : parseInt(n[1], 10), 0 == w[1].length ? 0 : parseInt(w[1], 10)) || B(0 == n[2].length, 0 == w[2].length) || B(n[2], w[2]), n[3]), w)[3]
                } while (0 == E)
            }
            return 0 <= E
        })
    }("9"),
    Gm = function(Q, E) {
        if (!K.addEventListener || !Object.defineProperty) return false;
        Q = false, E = Object.defineProperty({}, "passive", {
            get: function() {
                Q = true
            }
        });
        try {
            K.addEventListener("test", Ep, E), K.removeEventListener("test", Ep, E)
        } catch (D) {}
        return Q
    }(),
    h = function(Q, E) {
        ((this.type = Q, this).currentTarget = this.target = E, this).defaultPrevented = false
    },
    X = ((h.prototype.preventDefault = function() {
        this.defaultPrevented = true
    }, h.prototype).stopPropagation = function() {}, function(Q, E, D, d) {
        ((this.pointerType = (this.pointerId = (this.state = (this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = (this.key = (this.button = this.screenY = (this.relatedTarget = this.currentTarget = (h.call(this, Q ? Q.type : ""), this).target = null, this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0), ""), this.charCode = this.keyCode = 0, false), null), 0), ""), this).F = null, Q) && (D = this.type = Q.type, d = Q.changedTouches && Q.changedTouches.length ? Q.changedTouches[0] : null, this.target = Q.target || Q.srcElement, this.currentTarget = E, E = Q.relatedTarget, E || ("mouseover" == D ? E = Q.fromElement : "mouseout" == D && (E = Q.toElement)), this.relatedTarget = E, d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.offsetX = void 0 !== Q.offsetX ? Q.offsetX : Q.layerX, this.offsetY = void 0 !== Q.offsetY ? Q.offsetY : Q.layerY, this.clientX = void 0 !== Q.clientX ? Q.clientX : Q.pageX, this.clientY = void 0 !== Q.clientY ? Q.clientY : Q.pageY, this.screenX = Q.screenX || 0, this.screenY = Q.screenY || 0), this.button = Q.button, this.keyCode = Q.keyCode || 0, this.key = Q.key || "", this.charCode = Q.charCode || ("keypress" == D ? Q.keyCode : 0), this.ctrlKey = Q.ctrlKey, this.altKey = Q.altKey, this.shiftKey = Q.shiftKey, this.metaKey = Q.metaKey, this.pointerId = Q.pointerId || 0, this.pointerType = "string" == typeof Q.pointerType ? Q.pointerType : pG[Q.pointerType] || "", this.state = Q.state, this.F = Q, Q.defaultPrevented && this.preventDefault())
    }),
    pG = {
        2: "touch",
        3: "pen",
        4: (D7(X, h), "mouse")
    },
    S = (X.prototype.stopPropagation = function() {
        (X.f.stopPropagation.call(this), this.F.stopPropagation) ? this.F.stopPropagation(): this.F.cancelBubble = true
    }, X.prototype.preventDefault = function(Q) {
        if (Q = (X.f.preventDefault.call(this), this.F), Q.preventDefault) Q.preventDefault();
        else if (Q.returnValue = false, e8) try {
            if (Q.ctrlKey || 112 <= Q.keyCode && 123 >= Q.keyCode) Q.keyCode = -1
        } catch (E) {}
    }, "closure_listenable_") + (1E6 * Math.random() | 0),
    KG = function(Q, E, D, d, Z) {
        this.type = (this.K = Z, (this.src = E, this).listener = (this.A = (this.capture = !!d, this.L = this.l = false, this.key = ++mL, null), Q), D)
    },
    Up = function(Q) {
        Q.L = (Q.A = null, !(Q.K = null, Q.src = null, Q.listener = null, 0))
    },
    g = function(Q) {
        (this.v = (this.src = Q, 0), this).a = {}
    },
    mL = 0,
    Pt = (g.prototype.remove = (g.prototype.hasListener = function(Q, E, D, d, Z) {
        return nG(this.a, (d = (D = void 0 !== (Z = void 0 !== E, Q)) ? Q.toString() : "", function(L, n) {
            for (n = 0; n < L.length; ++n)
                if (!(D && L[n].type != d || Z && L[n].capture != E)) return true;
            return false
        }))
    }, g.prototype.add = function(Q, E, D, d, Z, L, n) {
        return (n = Pt((L = Q.toString(), Q = this.a[L], Q || (Q = this.a[L] = [], this.v++), Q), E, d, Z), -1) < n ? (E = Q[n], D || (E.l = false)) : (E = new KG(E, this.src, L, !!d, Z), E.l = D, Q.push(E)), E
    }, function(Q, E, D, d, Z) {
        if (Q = Q.toString(), !(Q in this.a)) return false;
        return -1 < (E = Pt((Z = this.a[Q], Z), E, D, d), E) ? (Up(Z[E]), Array.prototype.splice.call(Z, E, 1), 0 == Z.length && (delete this.a[Q], this.v--), true) : false
    }), function(Q, E, D, d, Z, L) {
        for (Z = 0; Z < Q.length; ++Z)
            if (L = Q[Z], !L.L && L.listener == E && L.capture == !!D && L.K == d) return Z;
        return -1
    }),
    Ic = "closure_lm_" + (1E6 * Math.random() | 0),
    tV = {},
    Op = function(Q, E, D, d, Z, L) {
        if ("array" == P(E))
            for (L = 0; L < E.length; L++) Op(Q, E[L], D, d, Z);
        else D = My(D), Q && Q[S] ? Q.YW(E, D, p(d) ? !!d.capture : !!d, Z) : F4(Q, E, D, true, d, Z)
    },
    Tm = function(Q, E, D, d, Z, L) {
        if (d && d.once) Op(Q, E, D, d, Z);
        else if ("array" == P(E))
            for (L = 0; L < E.length; L++) Tm(Q, E[L], D, d, Z);
        else D = My(D), Q && Q[S] ? Q.kW(E, D, p(d) ? !!d.capture : !!d, Z) : F4(Q, E, D, false, d, Z)
    },
    YX = function(Q, E, D, d) {
        return ((d = Q.K || Q.src, D = Q.listener, Q).l && sp(Q), D).call(d, E)
    },
    X4 = function(Q, E) {
        return E = (Q = hV, Y ? function(D) {
            return Q.call(E.src, E.listener, D)
        } : function(D) {
            if (D = Q.call(E.src, E.listener, D), !D) return D
        })
    },
    S8 = function(Q, E, D, d, Z, L) {
        if ("array" == P(E))
            for (L = 0; L < E.length; L++) S8(Q, E[L], D, d, Z);
        else(d = p(d) ? !!d.capture : !!d, D = My(D), Q && Q[S]) ? Q.Iu(E, D, d, Z) : Q && (Q = g_(Q)) && (E = Q.a[E.toString()], Q = -1, E && (Q = Pt(E, D, d, Z)), (D = -1 < Q ? E[Q] : null) && sp(D))
    },
    hV = function(Q, E, D, d) {
        if (Q.L) return true;
        if (!Y) {
            if (!E) a: {
                for (D = (E = (d = 0, ["window", "event"]), K); d < E.length; d++)
                    if (D = D[E[d]], null == D) {
                        E = null;
                        break a
                    } E = D
            }
            return (E = new X(E, this), YX)(Q, E)
        }
        return YX(Q, new X(E, this))
    },
    g_ = function(Q) {
        return (Q = Q[Ic], Q instanceof g) ? Q : null
    },
    yj = function(Q) {
        return Q in tV ? tV[Q] : tV[Q] = "on" + Q
    },
    F4 = function(Q, E, D, d, Z, L, n, w) {
        if (!E) throw Error("Invalid event type");
        if (!(n = p(Z) ? !!Z.capture : !!Z, n) || Y)
            if ((w = g_(Q)) || (Q[Ic] = w = new g(Q)), D = w.add(E, D, d, n, L), !D.A) {
                if (((D.A = (d = X4(), d), d).src = Q, d).listener = D, Q.addEventListener) Gm || (Z = n), void 0 === Z && (Z = false), Q.addEventListener(E.toString(), d, Z);
                else if (Q.attachEvent) Q.attachEvent(yj(E.toString()), d);
                else if (Q.addListener && Q.removeListener) Q.addListener(d);
                else throw Error("addEventListener and attachEvent are unavailable.");
                fG++
            }
    },
    fG = 0,
    sp = function(Q, E, D, d, Z, L, n) {
        if ("number" != typeof Q && Q && !Q.L)
            if ((E = Q.src) && E[S]) E.Ag(Q);
            else if (D = Q.type, d = Q.A, E.removeEventListener ? E.removeEventListener(D, d, Q.capture) : E.detachEvent ? E.detachEvent(yj(D), d) : E.addListener && E.removeListener && E.removeListener(d), fG--, D = g_(E)) {
            if (d = Q.type, d in D.a) {
                Z = D.a[d];
                b: if ("string" == typeof Z) L = "string" == typeof Q && 1 == Q.length ? Z.indexOf(Q, 0) : -1;
                    else {
                        for (L = 0; L < Z.length; L++)
                            if (L in Z && Z[L] === Q) break b;
                        L = -1
                    }((n = 0 <= L) && Array.prototype.splice.call(Z, L, 1), n) && (Up(Q), 0 == D.a[d].length && (delete D.a[d], D.v--))
            }
            0 == D.v && (D.src = null, E[Ic] = null)
        } else Up(Q)
    },
    xX = "__closure_events_fn_" + (1E9 * Math.random() >>> 0),
    qy = {},
    My = function(Q) {
        if ("function" == P(Q)) return Q;
        return Q[Q[xX] || (Q[xX] = function(E) {
            return Q.handleEvent(E)
        }), xX]
    },
    AV = {},
    JV = function(Q, E, D, d, Z) {
        for (Q.i = (((((Q.$ = (Q.$W = function(L, n, w) {
                return (n = function() {
                    return w()
                }, w = function() {
                    return L
                }, n)[this.c] = function(l) {
                    L = l
                }, n
            }, Q.S = false, void 0), Q).Wm = [], d = [], Q).H = function(L, n, w, l, R, k) {
                return (k = (w = (l = function() {
                    return l[w.b + (R[w.M] === n) - !k[w.M]]
                }, R = function() {
                    return l()
                }, this), w).C, R[w.c] = function(W) {
                    l[w.O] = W
                }, R)[w.c](L), L = R
            }, Q.w = !(Z = 0, 1), Q).I = (Q.G = 25, void 0), Q).U = 0, 0); 128 > Z; Z++) d[Z] = String.fromCharCode(Z);
        (Z = (((((Q.D = ((((((((((((((((((((Q.Ni = (((((A(Q, ((Q.o = [], Q).j = [], 22), 0), A)(Q, 206, 0), A)(Q, 119, function(L) {
            bN(L, 1)
        }), null /*window.performance*/) || {}).timing || {}).navigationStart || 0, A)(Q, 218, function(L) {
            bN(L, 4)
        }), A)(Q, 59, function(L, n, w) {
            w = (n = L.W(), L).W(), A(L, w, L.B(w) + L.B(n))
        }), A)(Q, 155, function(L) {
            uN(L, 1)
        }), A)(Q, 54, function(L, n, w, l, R, k, W) {
            b(L, 1, 5) || (n = Vj(L), l = n.h, R = n.P, w = n.N, W = w.length, 0 == W ? k = new l[R] : 1 == W ? k = new l[R](w[0]) : 2 == W ? k = new l[R](w[0], w[1]) : 3 == W ? k = new l[R](w[0], w[1], w[2]) : 4 == W ? k = new l[R](w[0], w[1], w[2], w[3]) : u(L, 22), A(L, n.J, k))
        }), A(Q, 34, 0), Q.Cy = function(L, n) {
            n.push(L[0] << 24 | L[1] << 16 | L[2] << 8 | L[3]), n.push(L[4] << 24 | L[5] << 16 | L[6] << 8 | L[7]), n.push(L[8] << 24 | L[9] << 16 | L[10] << 8 | L[11])
        }, A)(Q, 98, []), A(Q, 195, function(L, n, w) {
            (n = (w = (n = L.W(), L.W()), L.o)[n] && L.B(n), A)(L, w, n)
        }), A)(Q, 198, Q), A(Q, 147, function(L, n, w, l) {
            (l = (w = (n = L.W(), L.W()), L).W(), A)(L, l, L.B(n) >> w)
        }), A(Q, 132, 0), A(Q, 51, function(L, n, w, l, R, k, W) {
            b(L, 1, 5) || (n = Vj(L), R = n.P, w = n.N, l = n.h, W = w.length, 0 == W ? k = l[R]() : 1 == W ? k = l[R](w[0]) : 2 == W ? k = l[R](w[0], w[1]) : 3 == W ? k = l[R](w[0], w[1], w[2]) : u(L, 22), A(L, n.J, k))
        }), A)(Q, 228, function(L, n, w, l) {
            l = (w = (n = L.W(), L.W()), L).W(), L.B(n)[L.B(w)] = L.B(l)
        }), A)(Q, 137, function(L, n, w, l) {
            (l = (w = (n = L.W(), L.W()), L.W()), A)(L, l, L.B(n) || L.B(w))
        }), A)(Q, 183, function(L, n, w, l) {
            l = (w = (n = L.W(), L.W()), L).W(), n = L.B(n) == L.B(w), A(L, l, +n)
        }), A)(Q, 205, 0), A(Q, 122, K), A)(Q, 173, function(L, n, w, l) {
            n = (w = (l = (w = (n = L.W(), L.W()), L.W()), L).B(w), L.B(n)), A(L, l, n[w])
        }), A(Q, 166, 188), Q).X = [], A)(Q, 194, function(L, n, w) {
            0 != (n = L.W(), w = L.W(), L.B(n)) && A(L, 22, L.B(w))
        }), A(Q, 121, function(L, n, w) {
            b(L, 1, 5) || (n = L.W(), w = L.W(), A(L, w, function(l) {
                return eval(l)
            }(L.B(n))))
        }), A(Q, 79, function(L, n, w, l, R, k, W, y, f, G, Bt, H, Rc) {
            for (G = (y = (W = (k = (R = (l = (n = L.W(), w = 0), function(m, O) {
                    for (; l < m;) w |= L.W() << l, l += 8;
                    return O = (l -= m, w & (1 << m) - 1), w >>= m, O
                }), R(3) + 1), R(5)), []), f = 0); G < W; G++) Bt = R(1), y.push(Bt), f += Bt ? 0 : 1;
            for (H = (G = 0, f = (f - 1).toString(2).length, []); G < W; G++) y[G] || (H[G] = R(f));
            for (G = 0; G < W; G++) y[G] && (H[G] = L.W());
            for (Rc = (G = k, []); G--;) Rc.push(L.B(L.W()));
            A(L, n, function(m, O, kX, x, q) {
                for (x = (m.i++, kX = (O = [], []), 0); x < W; x++) {
                    if (!y[q = H[x], x]) {
                        for (; q >= O.length;) O.push(m.W());
                        q = O[q]
                    }
                    kX.push(q)
                }
                m.I = (m.$ = m.H(Rc.slice(), m.W), m.H(kX, m.W))
            })
        }), A(Q, 232, function(L) {
            uN(L, 4)
        }), A(Q, 124, function() {}), A(Q, 55, 0), A)(Q, 100, function(L, n, w) {
            w = (n = L.W(), L).W(), n = L.B(n), A(L, w, P(n))
        }), A(Q, 2, function(L, n, w) {
            w = (n = L.W(), L).W(), A(L, w, "" + L.B(n))
        }), A)(Q, 62, function(L, n) {
            n = L.B(L.W()), Ht(L, n)
        }), A(Q, 126, function(L) {
            L.dN(4)
        }), A)(Q, 89, function(L, n, w, l, R) {
            w = (R = (n = (l = (w = (n = L.W(), L.W()), L.W()), L.B(n)), L).B(L.W()), L.B(w)), l = L.B(l), 0 !== n && (l = vt(L, l, R, 1, n, w), Tm(n, w, l), A(L, 55, [n, w, l]))
        }), A)(Q, 254, function(L, n) {
            b(L, 1, 5) || (n = Vj(L), A(L, n.J, n.P.apply(n.h, n.N)))
        }), A)(Q, 108, function(L, n, w, l) {
            if (n = L.X.pop()) {
                for (w = L.W(); 0 < w; w--) l = L.W(), n[l] = L.o[l];
                L.o = (n[242] = (n[60] = L.o[60], L.o[242]), n)
            } else A(L, 22, L.s.length)
        }), A)(Q, 242, 2048), A(Q, 32, function(L, n, w, l) {
            l = (w = (n = L.W(), L).W(), L.W()), A(L, l, (L.B(n) in L.B(w)) + 0)
        }), A(Q, 60, []), []), A(Q, 145, function(L, n, w, l, R) {
            for (l = (R = (n = L.W(), w = ac(L), 0), []); R < w; R++) l.push(L.W());
            A(L, n, l)
        }), A)(Q, 68, {}), A)(Q, 209, function(L, n) {
            L = (n = L.W(), L.B(n)), S8(L[0], L[1], L[2])
        }), A(Q, 24, function(L, n, w, l, R) {
            (w = (R = (l = (w = (n = L.W(), L).W(), L.B(L.W())), L.B(L.W())), L.B(w)), A)(L, n, vt(L, w, l, R))
        }), A(Q, 116, function(L, n, w, l, R, k, W) {
            if ((l = (w = (n = L.W(), ac(L)), ""), L).o[158])
                for (R = L.B(158), k = 0, W = R.length; w--;) k = (k + ac(L)) % W, l += d[R[k]];
            else
                for (; w--;) l += d[L.W()];
            A(L, n, l)
        }), A(Q, 64, [160, 0, 0]), A)(Q, 29, zm(4)), A)(Q, 235, function(L, n, w, l, R, k) {
            if (!b(L, 1, 255)) {
                if ("object" == P((L = (l = (w = (n = (R = (w = (n = L.W(), L.W()), l = L.W(), L.W()), L.B(n)), L).B(w), L.B(l)), L.B(R)), n))) {
                    for (k in R = [], n) R.push(k);
                    n = R
                }
                for (R = (k = n.length, 0); R < k; R += l) w(n.slice(R, R + l), L)
            }
        }), D.V || function() {}), A)(Q, 9, function(L) {
            uN(L, 2)
        }), LG(), E && "!" == E.charAt(0) ? (Q.Y = E, Z()) : (D = !!D.V, Q.s = [], V(Q, [qy, E]), V(Q, [Ny, Z]), v(Q, false, D, true))
    },






    Ny = {},
    CG = function(Q, E) {
        return Q[E] << 24 | Q[E + 1] << 16 | Q[E + 2] << 8 | Q[E + 3]
    },
    a = function(Q, E, D, d, Z, L) {
        for (d = (((Z = Q.B(E), 29 == E) ? (E = function(n, w, l, R) {
                if ((l = (w = Z.length, w - 4) >> 3, Z.xW) != l) {
                    l = (Z.xW = l, (l << (R = [0, 0, 0, L], 3)) - 4);
                    try {
                        Z.au = ct(CG(Z, l), CG(Z, l + 4), R)
                    } catch (k) {
                        throw k;
                    }
                }
                Z.push(Z.au[w & 7] ^ n)
            }, L = Q.B(34)) : E = function(n) {
                Z.push(n)
            }, d) && E(d & 255), 0), Q = D.length; d < Q; d++) E(D[d])
    },
    r_ = {},
    z = ["botguard"],
    N = function(Q, E) {
        Q.Y = ("E:" + E.message + ":" + E.stack).slice(0, 2048)
    },
    Qv = {},
    Lk = function(Q, E, D) {
        return (D = Q.B(22), Q.s) && D < Q.s.length ? (A(Q, 22, Q.s.length), Ht(Q, E)) : A(Q, 22, E), En(Q, D)
    },
    En = function(Q, E, D, d, Z, L, n) {
        Q.i++;
        try {
            for (L = (D = (Z = void 0, (d = 5001, Q).s.length), 0);
                (Q.ou || --d) && (Q.$ || (L = Q.B(22)) < D);) try {
                Q.$ ? Z = Q.W(true) : (A(Q, 206, L), n = Q.W(), Z = Q.B(n)), Z && Z.call ? Z(Q) : u(Q, 21, 0, n), Q.w = true, b(Q, 0, 2)
            } catch (w) {
                w != Q.T && (Q.B(166) ? u(Q, 22, w) : A(Q, 166, w))
            }
            d || u(Q, 33)
        } catch (w) {
            try {
                u(Q, 22, w)
            } catch (l) {
                N(Q, l)
            }
        }
        return D = Q.B(68), E && A(Q, 22, E), Q.i--, D
    },
    Ht = function(Q, E) {
        ((Q.X.push(Q.o.slice()), Q).o[22] = void 0, A)(Q, 22, E)
    },
    J = function(Q, E) {
        try {
            JV(this, Q, E)
        } catch (D) {
            N(this, D)
        }
    },
    o$ = (J.prototype.Z = ((J.prototype.B = function(Q, E) {
        if (E = this.o[Q], void 0 === E) throw u(this, 30, 0, Q), this.T;
        return E()
    }, J.prototype).c = (J.prototype.im = function(Q, E, D, d) {
        for (; D--;) 22 != D && 206 != D && E.o[D] && (E.o[D] = E[d](E[Q](D), this));
        E[Q] = this
    }, "toString"), J.prototype.M = "caller", (null/*window.performance*/ || {}).now ? function() {
        return this.Ni + (window.performance.now() | 0)
    } : function() {
        return +new Date
    }), {}),
    Vj = (J.prototype.y8 = function(Q, E, D, d) {
        try {
            d = Q[(E + 2) % 3], Q[E] = Q[E] - Q[(E + 1) % 3] - d ^ (1 == E ? d << D : d >>> D)
        } catch (Z) {
            throw Z;
        }
    }, J.prototype.Ep = function(Q, E, D, d, Z) {
        for (Z = d = 0; Z < Q.length; Z++) d += Q.charCodeAt(Z), d += d << 10, d ^= d >> 6;
        return (d = new Number((Q = (d += d << 3, d ^= d >> 11, d) + (d << 15) >>> 0, Q & (1 << E) - 1)), d)[0] = (Q >>> E) % D, d
    }, function(Q, E, D, d, Z, L) {
        for (L = (d = (((E = {}, D = Q.W(), E).J = Q.W(), E).N = [], Q.W() - 1), Z = Q.W(), 0); L < d; L++) E.N.push(Q.W());
        for ((E.P = Q.B(D), E).h = Q.B(Z); d--;) E.N[d] = Q.B(E.N[d]);
        return E
    }),
    u = (J.prototype.b = 35, function(Q, E, D, d, Z) {
        ((D = ((d = (((E = (Z = Q.B(206), [E, Z >> 8 & 255, Z & 255]), void 0 != d) && E.push(d), 0) == Q.B(60).length && (Q.o[60] = void 0, A(Q, 60, E)), ""), D) && (D.message && (d += D.message), D.stack && (d += ":" + D.stack)), Q.B(242)), 3) < D && (d = d.slice(0, D - 3), D -= d.length + 3, d = oc(d.replace(/\r\n/g, "\n")), a(Q, 29, C(d.length, 2).concat(d), 9)), A)(Q, 242, D)
    }),
    DE = function(Q, E, D, d, Z) {
        if (Q.w = !(D = E[0], 1), D == o$) Q.G = 25, Q.C(E);
        else if (D == Qv) {
            D = E[3], d = E[1];
            try {
                Z = Q.C(E)
            } catch (L) {
                N(Q, L), Z = Q.Y
            }
            d && d(Z), D.push(Z)
        } else if (D == AV) Q.C(E);
        else if (D == qy) Q.C(E);
        else if (D == Ny) {
            try {
                for (Z = 0; Z < Q.j.length; Z++) try {
                    d = Q.j[Z], d[0][d[1]](d[2])
                } catch (L) {}
            } catch (L) {}(0, E[Q.j = [], 1])()
        } else if (D == r_) return Z = E[2], d = E[6], A(Q, 210, E[4] ? [d[0].F] : d), A(Q, 68, Z), Q.C(E)
    },
    ct = (J.prototype.O = 36, function(Q, E, D, d) {
        try {
            for (d = 0; 101513633568 != d;) Q += (E << 4 ^ E >>> 5) + E ^ d + D[d & 3], d += 3172301049, E += (Q << 4 ^ Q >>> 5) + Q ^ d + D[d >>> 11 & 3];
            return [Q >>> 24, Q >> 16 & 255, Q >> 8 & 255, Q & 255, E >>> 24, E >> 16 & 255, E >> 8 & 255, E & 255]
        } catch (Z) {
            throw Z;
        }
    }),
    zm = (J.prototype.T = {}, function(Q, E) {
        for (E = []; Q--;) E.push(255 * Math.random() | 0);
        return E
    }),
    uN = (J.prototype.Bm = function(Q, E, D, d, Z, L) {
        if (this.Y) return this.Y;
        try {
            d = !!Q, L = [], Z = [], V(this, [o$, Z, E]), V(this, [Qv, Q, Z, L]), v(this, false, d, true), D = L[0]
        } catch (n) {
            N(this, n), D = this.Y, Q && Q(D)
        }
        return D
    }, J.prototype.C = function(Q, E, D, d, Z, L, n, w, l, R) {
        if (E = Q[0], E == qy) {
            Q = Q[1];
            try {
                for (D = (E = [], 0); D < Q.length;) {
                    if ((n = (Z = (d = e[Q.charAt(D++)], D < Q.length ? e[Q.charAt(D)] : 0), ++D, L = D < Q.length ? e[Q.charAt(D)] : 64, ++D, D) < Q.length ? e[Q.charAt(D)] : 64, ++D, null == d) || null == Z || null == L || null == n) throw Error();
                    (E.push(d << 2 | Z >> 4), 64 != L) && (E.push(Z << 4 & 240 | L >> 2), 64 != n && E.push(L << 6 & 192 | n))
                }
                this.s = E
            } catch (k) {
                u(this, 17, k)
            }
            En(this)
        } else if (E == o$) d = Q[1], d.push(this.B(64).length, this.B(29).length, this.B(98).length, this.B(242)), A(this, 68, Q[2]), this.o[106] && Lk(this, this.B(106));
        else {
            if (E == Qv) {
                for (n = ((Z = ((4 < (n = (Z = ((Z = (d = Q[2], L = C(this.B(64).length + 2, 2), this.B(60)), 0) < Z.length && a(this, 64, C(Z.length, 2).concat(Z), 10), this.B(132) & 511), Z -= this.B(64).length + 5, this).B(29), n).length && (Z -= n.length + 3), 0 < Z && a(this, 64, C(Z, 2).concat(zm(Z)), 15), 4) < n.length && a(this, 64, C(n.length, 2).concat(n), 156), zm(2).concat(this.B(64))), Z[1] = Z[0] ^ 6, Z)[3] = Z[1] ^ L[0], Z[4] = Z[1] ^ L[1], 0), L = []; n < Z.length; n += 3) w = Z[n], l = (Q = n + 1 < Z.length) ? Z[n + 1] : 0, R = (E = n + 2 < Z.length) ? Z[n + 2] : 0, D = w >> 2, w = (w & 3) << 4 | l >> 4, l = (l & 15) << 2 | R >> 6, R &= 63, E || (R = 64, Q || (l = 64)), L.push(U[D], U[w], U[l], U[R]);
                if (L = L.join("")) L = "!" + L;
                else
                    for (L = "", n = 0; n < Z.length; n++) Q = Z[n][this.c](16), 1 == Q.length && (Q = "0" + Q), L += Q;
                return ((this.B((Z = L, 64)).length = d[0], this.B(29)).length = d[1], this.B(98).length = d[2], A)(this, 242, d[3]), Z
            }
            if (E == AV) Lk(this, Q[1]);
            else if (E == r_) return Lk(this, Q[1])
        }
    }, function(Q, E, D, d) {
        for (d = (D = Q.W(), 0); 0 < E; E--) d = d << 8 | Q.W();
        A(Q, D, d)
    }),
    jv = function(Q, E, D, d, Z) {
        for (; Q.D.length;) {
            if (D = D && E) Q.U && Q.S ? (D = 0 != document.hidden ? false : true, Q.S = false) : D = false;
            if (D) {
                (Z = Q, Q).D_(function() {
                    v(Z, false, E, false)
                });
                break
            }
            d = (d = (D = true, Q.D).pop(), DE)(Q, d)
        }
        return d
    },
    ac = (J.prototype.D_ = (J.prototype.dN = function(Q, E, D, d) {
        a(this, (((D = (d = (D = (Q &= (E = Q & 4, 3), this.W()), this.W()), this).B(D), E) && (D = oc(("" + D).replace(/\r\n/g, "\n"))), Q) && a(this, d, C(D.length, 2)), d), D)
    }, K.requestIdleCallback ? function(Q) {
        requestIdleCallback(Q, {
            timeout: 4
        })
    } : K.setImmediate ? function(Q) {
        setImmediate(Q)
    } : function(Q) {
        setTimeout(Q, 0)
    }), function(Q, E) {
        return (E = Q.W(), E & 128) && (E = E & 127 | Q.W() << 7), E
    }),
    V = function(Q, E) {
        Q.D.splice(0, 0, E)
    },
    b = function(Q, E, D) {
        if (0 >= Q.U || 1 < Q.i || !Q.w && 0 < E || 0 != document.hidden || Q.Z() - Q.m < Q.U - D) return false;
        return ((E = (Q.S = true, Q.B(22) - E), A)(Q, 22, Q.s.length), Q.D).push([AV, E]), true
    },
    v = function(Q, E, D, d, Z) {
        if (0 != Q.D.length) {
            if (Z = 0 == Q.i) Q.m = Q.Z();
            return D = jv(Q, D, d), Z && (Z = Q.Z() - Q.m, Z < (E ? 10 : 0) || 0 >= Q.G-- || Q.Wm.push(254 >= Z ? Z : 254)), D
        }
    },
    A = (J.prototype.Fs = (J.prototype.rN = function(Q, E, D) {
        if (3 == Q.length) {
            for (D = 0; 3 > D; D++) E[D] += Q[D];
            for (Q = [13, 8, 13, 12, 16, 5, 3, 10, 15], D = 0; 9 > D; D++) E[3](E, D % 3, Q[D])
        }
    }, function(Q, E, D) {
        return ((E = (E ^= E << 13, E ^= E >> 17, E ^ E << 5) & D) || (E = 1), Q) ^ E
    }), function(Q, E, D) {
        if (22 == E || 206 == E)
            if (Q.o[E]) Q.o[E][Q.c](D);
            else Q.o[E] = Q.$W(D);
        else if (64 != E && 29 != E && 98 != E && 60 != E || !Q.o[E]) Q.o[E] = Q.H(D, Q.B);
        205 == E && (Q.g = void 0, A(Q, 22, Q.B(22) + 4))
    }),
    C = function(Q, E, D, d) {
        for (d = E - (D = [], 1); 0 <= d; d--) D[E - 1 - d] = Q >> 8 * d & 255;
        return D
    },
    bN = (J.prototype.cm = function(Q, E, D, d, Z, L) {
        for (L = d = (D = [], 0); L < Q.length; L++)
            for (Z = Z << E | Q[L], d += E; 7 < d;) d -= 8, D.push(Z >> d & 255);
        return D
    }, (J.prototype.W = function(Q, E) {
        if (this.$) return Q = Q ? this.$().shift() : this.I().shift(), this.$().length || this.I().length || (this.I = this.$ = void 0, this.i--), Q;
        if (!((Q = this.B(22), Q) in this.s)) throw u(this, 31), this.T;
        return (void 0 == this.g && (this.g = CG(this.s, Q - 4), this.R = void 0), this).R != Q >> 3 && (this.R = Q >> 3, E = [0, 0, 0, this.B(205)], this.sp = ct(this.g, this.R, E)), A(this, 22, Q + 1), this.s[Q] ^ this.sp[Q % 8]
    }, J).prototype.ou = false, function(Q, E, D, d) {
        d = (D = Q.W(), Q.W()), a(Q, d, C(Q.B(D), E))
    }),
    vt = function(Q, E, D, d, Z, L) {
        return function() {
            var n = d & 1,
                w = [r_, E, D, void 0, Z, L, arguments];
            if (d & 2) var l = (V(Q, w), v(Q, true, false, false));
            else n && Q.D.length ? V(Q, w) : n ? (V(Q, w), v(Q, true, false, false)) : l = DE(Q, w);
            return l
        }
    },
    c = K;
    z[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + z[0]);
    for (var r; z.length && (r = z.shift());) c = c[r] && c[r] !== Object.prototype[r] ? c[r] : c[r] = {};
    t = K.botguard, t.bg = function(Q, E, D) {
    	var rtn;
    	if(Q && Q.substring && (D = t[Q.substring(0, 3)]))
    		rtn = new D(Q.substring(3), E);
    	else rtn = new t.rLL(Q, E);

    	return rtn;
    }, t.rLL = function(Q, E, D) {
    this.invoke = (D = new J(Q, {
        V: E
    }), function(d, Z, L) {
        return L = D.Bm(Z && d, L), d && !Z && d(L), L
    })
    };
    botguard.prototype.getBG = function (bgData)
    {
        var botguard_bg = new t.bg(bgData);
        return botguard_bg.invoke();
    };
}    
//}).call(this);
// }catch(e){
//     console.log("exception " + e.message);
//     console.trace();
// }