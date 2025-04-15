// ------------------------------------------------------------------------------
// Module Name: aria_NOS_E2E.js
//
// Author : 류재욱(juryu@webcash.co.kr)
// Copyright (c) 2017-2020 Webcash Corporation. All rights reserved.
//
// Last Update : 2020-07-31  v1.00   by juryu - 최초 작성
// ------------------------------------------------------------------------------
var CryptoJS = CryptoJS || function(u, m) {
    var d = {},
        l = d.lib = {},
        s = l.Base = function() {
            function b() {}
            return {
                extend: function(r) {
                    b.prototype = this;
                    var a = new b;
                    r && a.mixIn(r);
                    a.hasOwnProperty("init") || (a.init = function() {
                        a.$super.init.apply(this, arguments)
                    });
                    a.init.prototype = a;
                    a.$super = this;
                    return a
                },
                create: function() {
                    var b = this.extend();
                    b.init.apply(b, arguments);
                    return b
                },
                init: function() {},
                mixIn: function(b) {
                    for (var a in b) b.hasOwnProperty(a) && (this[a] = b[a]);
                    b.hasOwnProperty("toString") && (this.toString = b.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            }
        }(),
        t = l.WordArray = s.extend({
            init: function(b, a) {
                b = this.words = b || [];
                this.sigBytes = a != m ? a : 4 * b.length
            },
            toString: function(b) {
                return (b || p).stringify(this)
            },
            concat: function(b) {
                var a = this.words,
                    e = b.words,
                    n = this.sigBytes;
                b = b.sigBytes;
                this.clamp();
                if (n % 4)
                    for (var q = 0; q < b; q++) a[n + q >>> 2] |= (e[q >>> 2] >>> 24 - 8 * (q % 4) & 255) << 24 - 8 * ((n + q) % 4);
                else if (65535 < e.length)
                    for (q = 0; q < b; q += 4) a[n + q >>> 2] = e[q >>> 2];
                else a.push.apply(a, e);
                this.sigBytes += b;
                return this
            },
            clamp: function() {
                var b =
                    this.words,
                    a = this.sigBytes;
                b[a >>> 2] &= 4294967295 << 32 - 8 * (a % 4);
                b.length = u.ceil(a / 4)
            },
            clone: function() {
                var b = s.clone.call(this);
                b.words = this.words.slice(0);
                return b
            },
            random: function(b) {
                for (var a = [], e = 0; e < b; e += 4) a.push(4294967296 * u.random() | 0);
                return new t.init(a, b)
            }
        }),
        c = d.enc = {},
        p = c.Hex = {
            stringify: function(b) {
                var a = b.words;
                b = b.sigBytes;
                for (var e = [], n = 0; n < b; n++) {
                    var q = a[n >>> 2] >>> 24 - 8 * (n % 4) & 255;
                    e.push((q >>> 4).toString(16));
                    e.push((q & 15).toString(16))
                }
                return e.join("")
            },
            parse: function(b) {
                for (var a = b.length,
                        e = [], n = 0; n < a; n += 2) e[n >>> 3] |= parseInt(b.substr(n, 2), 16) << 24 - 4 * (n % 8);
                return new t.init(e, a / 2)
            }
        },
        v = c.Latin1 = {
            stringify: function(b) {
                var a = b.words;
                b = b.sigBytes;
                for (var e = [], n = 0; n < b; n++) e.push(String.fromCharCode(a[n >>> 2] >>> 24 - 8 * (n % 4) & 255));
                return e.join("")
            },
            parse: function(b) {
                for (var a = b.length, e = [], n = 0; n < a; n++) e[n >>> 2] |= (b.charCodeAt(n) & 255) << 24 - 8 * (n % 4);
                return new t.init(e, a)
            }
        },
        a = c.Utf8 = {
            stringify: function(b) {
                try {
                    return decodeURIComponent(escape(v.stringify(b)))
                } catch (a) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(b) {
                return v.parse(unescape(encodeURIComponent(b)))
            }
        },
        e = l.BufferedBlockAlgorithm = s.extend({
            reset: function() {
                this._data = new t.init;
                this._nDataBytes = 0
            },
            _append: function(b) {
                "string" == typeof b && (b = a.parse(b));
                this._data.concat(b);
                this._nDataBytes += b.sigBytes
            },
            _process: function(b) {
                var a = this._data,
                    e = a.words,
                    n = a.sigBytes,
                    q = this.blockSize,
                    w = n / (4 * q),
                    w = b ? u.ceil(w) : u.max((w | 0) - this._minBufferSize, 0);
                b = w * q;
                n = u.min(4 * b, n);
                if (b) {
                    for (var c = 0; c < b; c += q) this._doProcessBlock(e, c);
                    c = e.splice(0, b);
                    a.sigBytes -=
                        n
                }
                return new t.init(c, n)
            },
            clone: function() {
                var b = s.clone.call(this);
                b._data = this._data.clone();
                return b
            },
            _minBufferSize: 0
        });
    l.Hasher = e.extend({
        cfg: s.extend(),
        init: function(b) {
            this.cfg = this.cfg.extend(b);
            this.reset()
        },
        reset: function() {
            e.reset.call(this);
            this._doReset()
        },
        update: function(b) {
            this._append(b);
            this._process();
            return this
        },
        finalize: function(b) {
            b && this._append(b);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(b) {
            return function(a, e) {
                return (new b.init(e)).finalize(a)
            }
        },
        _createHmacHelper: function(a) {
            return function(e,
                c) {
                return (new w.HMAC.init(a, c)).finalize(e)
            }
        }
    });
    var w = d.algo = {};
    return d
}(Math);
(function() {
    var u = CryptoJS,
        m = u.lib.WordArray;
    u.enc.Base64 = {
        stringify: function(d) {
            var l = d.words,
                m = d.sigBytes,
                t = this._map;
            d.clamp();
            d = [];
            for (var c = 0; c < m; c += 3)
                for (var p = (l[c >>> 2] >>> 24 - 8 * (c % 4) & 255) << 16 | (l[c + 1 >>> 2] >>> 24 - 8 * ((c + 1) % 4) & 255) << 8 | l[c + 2 >>> 2] >>> 24 - 8 * ((c + 2) % 4) & 255, v = 0; 4 > v && c + 0.75 * v < m; v++) d.push(t.charAt(p >>> 6 * (3 - v) & 63));
            if (l = t.charAt(64))
                for (; d.length % 4;) d.push(l);
            return d.join("")
        },
        parse: function(d) {
            var l = d.length,
                s = this._map,
                t = s.charAt(64);
            t && (t = d.indexOf(t), -1 != t && (l = t));
            for (var t = [], c = 0, p = 0; p <
                l; p++)
                if (p % 4) {
                    var v = s.indexOf(d.charAt(p - 1)) << 2 * (p % 4),
                        a = s.indexOf(d.charAt(p)) >>> 6 - 2 * (p % 4);
                    t[c >>> 2] |= (v | a) << 24 - 8 * (c % 4);
                    c++
                } return m.create(t, c)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function(u) {
    function m(a, w, b, c, d, n, q) {
        a = a + (w & b | ~w & c) + d + q;
        return (a << n | a >>> 32 - n) + w
    }

    function d(a, w, b, c, d, n, q) {
        a = a + (w & c | b & ~c) + d + q;
        return (a << n | a >>> 32 - n) + w
    }

    function l(a, w, b, c, d, n, q) {
        a = a + (w ^ b ^ c) + d + q;
        return (a << n | a >>> 32 - n) + w
    }

    function s(a, c, b, d, m, n, q) {
        a = a + (b ^ (c | ~d)) + m + q;
        return (a << n | a >>> 32 - n) + c
    }
    var t = CryptoJS,
        c = t.lib,
        p = c.WordArray,
        v = c.Hasher,
        c = t.algo,
        a = [];
    (function() {
        for (var e = 0; 64 > e; e++) a[e] = 4294967296 * u.abs(u.sin(e + 1)) | 0
    })();
    c = c.MD5 = v.extend({
        _doReset: function() {
            this._hash = new p.init([1732584193, 4023233417,
                2562383102, 271733878
            ])
        },
        _doProcessBlock: function(e, c) {
            for (var b = 0; 16 > b; b++) {
                var r = c + b,
                    p = e[r];
                e[r] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360
            }
            var b = this._hash.words,
                r = e[c + 0],
                p = e[c + 1],
                n = e[c + 2],
                q = e[c + 3],
                x = e[c + 4],
                y = e[c + 5],
                t = e[c + 6],
                v = e[c + 7],
                u = e[c + 8],
                z = e[c + 9],
                A = e[c + 10],
                B = e[c + 11],
                C = e[c + 12],
                D = e[c + 13],
                E = e[c + 14],
                F = e[c + 15],
                f = b[0],
                g = b[1],
                h = b[2],
                k = b[3],
                f = m(f, g, h, k, r, 7, a[0]),
                k = m(k, f, g, h, p, 12, a[1]),
                h = m(h, k, f, g, n, 17, a[2]),
                g = m(g, h, k, f, q, 22, a[3]),
                f = m(f, g, h, k, x, 7, a[4]),
                k = m(k, f, g, h, y, 12, a[5]),
                h = m(h, k, f, g, t, 17, a[6]),
                g = m(g, h, k, f, v, 22, a[7]),
                f = m(f, g, h, k, u, 7, a[8]),
                k = m(k, f, g, h, z, 12, a[9]),
                h = m(h, k, f, g, A, 17, a[10]),
                g = m(g, h, k, f, B, 22, a[11]),
                f = m(f, g, h, k, C, 7, a[12]),
                k = m(k, f, g, h, D, 12, a[13]),
                h = m(h, k, f, g, E, 17, a[14]),
                g = m(g, h, k, f, F, 22, a[15]),
                f = d(f, g, h, k, p, 5, a[16]),
                k = d(k, f, g, h, t, 9, a[17]),
                h = d(h, k, f, g, B, 14, a[18]),
                g = d(g, h, k, f, r, 20, a[19]),
                f = d(f, g, h, k, y, 5, a[20]),
                k = d(k, f, g, h, A, 9, a[21]),
                h = d(h, k, f, g, F, 14, a[22]),
                g = d(g, h, k, f, x, 20, a[23]),
                f = d(f, g, h, k, z, 5, a[24]),
                k = d(k, f, g, h, E, 9, a[25]),
                h = d(h, k, f, g, q, 14, a[26]),
                g = d(g, h, k, f, u, 20, a[27]),
                f = d(f, g,
                    h, k, D, 5, a[28]),
                k = d(k, f, g, h, n, 9, a[29]),
                h = d(h, k, f, g, v, 14, a[30]),
                g = d(g, h, k, f, C, 20, a[31]),
                f = l(f, g, h, k, y, 4, a[32]),
                k = l(k, f, g, h, u, 11, a[33]),
                h = l(h, k, f, g, B, 16, a[34]),
                g = l(g, h, k, f, E, 23, a[35]),
                f = l(f, g, h, k, p, 4, a[36]),
                k = l(k, f, g, h, x, 11, a[37]),
                h = l(h, k, f, g, v, 16, a[38]),
                g = l(g, h, k, f, A, 23, a[39]),
                f = l(f, g, h, k, D, 4, a[40]),
                k = l(k, f, g, h, r, 11, a[41]),
                h = l(h, k, f, g, q, 16, a[42]),
                g = l(g, h, k, f, t, 23, a[43]),
                f = l(f, g, h, k, z, 4, a[44]),
                k = l(k, f, g, h, C, 11, a[45]),
                h = l(h, k, f, g, F, 16, a[46]),
                g = l(g, h, k, f, n, 23, a[47]),
                f = s(f, g, h, k, r, 6, a[48]),
                k = s(k, f, g, h,
                    v, 10, a[49]),
                h = s(h, k, f, g, E, 15, a[50]),
                g = s(g, h, k, f, y, 21, a[51]),
                f = s(f, g, h, k, C, 6, a[52]),
                k = s(k, f, g, h, q, 10, a[53]),
                h = s(h, k, f, g, A, 15, a[54]),
                g = s(g, h, k, f, p, 21, a[55]),
                f = s(f, g, h, k, u, 6, a[56]),
                k = s(k, f, g, h, F, 10, a[57]),
                h = s(h, k, f, g, t, 15, a[58]),
                g = s(g, h, k, f, D, 21, a[59]),
                f = s(f, g, h, k, x, 6, a[60]),
                k = s(k, f, g, h, B, 10, a[61]),
                h = s(h, k, f, g, n, 15, a[62]),
                g = s(g, h, k, f, z, 21, a[63]);
            b[0] = b[0] + f | 0;
            b[1] = b[1] + g | 0;
            b[2] = b[2] + h | 0;
            b[3] = b[3] + k | 0
        },
        _doFinalize: function() {
            var a = this._data,
                c = a.words,
                b = 8 * this._nDataBytes,
                d = 8 * a.sigBytes;
            c[d >>> 5] |= 128 <<
                24 - d % 32;
            var p = u.floor(b / 4294967296);
            c[(d + 64 >>> 9 << 4) + 15] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360;
            c[(d + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
            a.sigBytes = 4 * (c.length + 1);
            this._process();
            a = this._hash;
            c = a.words;
            for (b = 0; 4 > b; b++) d = c[b], c[b] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
            return a
        },
        clone: function() {
            var a = v.clone.call(this);
            a._hash = this._hash.clone();
            return a
        }
    });
    t.MD5 = v._createHelper(c);
    t.HmacMD5 = v._createHmacHelper(c)
})(Math);
(function() {
    var u = CryptoJS,
        m = u.lib,
        d = m.Base,
        l = m.WordArray,
        m = u.algo,
        s = m.EvpKDF = d.extend({
            cfg: d.extend({
                keySize: 4,
                hasher: m.MD5,
                iterations: 1
            }),
            init: function(d) {
                this.cfg = this.cfg.extend(d)
            },
            compute: function(d, c) {
                for (var p = this.cfg, m = p.hasher.create(), a = l.create(), e = a.words, w = p.keySize, p = p.iterations; e.length < w;) {
                    b && m.update(b);
                    var b = m.update(d).finalize(c);
                    m.reset();
                    for (var r = 1; r < p; r++) b = m.finalize(b), m.reset();
                    a.concat(b)
                }
                a.sigBytes = 4 * w;
                return a
            }
        });
    u.EvpKDF = function(d, c, p) {
        return s.create(p).compute(d,
            c)
    }
})();
CryptoJS.lib.Cipher || function(u) {
    var m = CryptoJS,
        d = m.lib,
        l = d.Base,
        s = d.WordArray,
        t = d.BufferedBlockAlgorithm,
        c = m.enc.Base64,
        p = m.algo.EvpKDF,
        v = d.Cipher = t.extend({
            cfg: l.extend(),
            createEncryptor: function(a, b) {
                return this.create(this._ENC_XFORM_MODE, a, b)
            },
            createDecryptor: function(a, b) {
                return this.create(this._DEC_XFORM_MODE, a, b)
            },
            init: function(a, b, c) {
                this.cfg = this.cfg.extend(c);
                this._xformMode = a;
                this._key = b;
                this.reset()
            },
            reset: function() {
                t.reset.call(this);
                this._doReset()
            },
            process: function(a) {
                this._append(a);
                return this._process()
            },
            finalize: function(a) {
                a && this._append(a);
                return this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function() {
                return function(a) {
                    return {
                        encrypt: function(b, c, d) {
                            return ("string" == typeof c ? G : r).encrypt(a, b, c, d)
                        },
                        decrypt: function(b, c, d) {
                            return ("string" == typeof c ? G : r).decrypt(a, b, c, d)
                        }
                    }
                }
            }()
        });
    d.StreamCipher = v.extend({
        _doFinalize: function() {
            return this._process(!0)
        },
        blockSize: 1
    });
    var a = m.mode = {},
        e = d.BlockCipherMode = l.extend({
            createEncryptor: function(a,
                b) {
                return this.Encryptor.create(a, b)
            },
            createDecryptor: function(a, b) {
                return this.Decryptor.create(a, b)
            },
            init: function(a, b) {
                this._cipher = a;
                this._iv = b
            }
        }),
        a = a.CBC = function() {
            function a(b, n, c) {
                var d = this._iv;
                d ? this._iv = u : d = this._prevBlock;
                for (var q = 0; q < c; q++) b[n + q] ^= d[q]
            }
            var b = e.extend();
            b.Encryptor = b.extend({
                processBlock: function(b, c) {
                    var d = this._cipher,
                        q = d.blockSize;
                    a.call(this, b, c, q);
                    d.encryptBlock(b, c);
                    this._prevBlock = b.slice(c, c + q)
                }
            });
            b.Decryptor = b.extend({
                processBlock: function(b, c) {
                    var d = this._cipher,
                        q = d.blockSize,
                        e = b.slice(c, c + q);
                    d.decryptBlock(b, c);
                    a.call(this, b, c, q);
                    this._prevBlock = e
                }
            });
            return b
        }(),
        w = (m.pad = {}).Pkcs7 = {
            pad: function(a, b) {
                for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, e = [], p = 0; p < c; p += 4) e.push(d);
                c = s.create(e, c);
                a.concat(c)
            },
            unpad: function(a) {
                a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
            }
        };
    d.BlockCipher = v.extend({
        cfg: v.cfg.extend({
            mode: a,
            padding: w
        }),
        reset: function() {
            v.reset.call(this);
            var a = this.cfg,
                b = a.iv,
                a = a.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
            else c = a.createDecryptor, this._minBufferSize = 1;
            this._mode = c.call(a, this, b && b.words)
        },
        _doProcessBlock: function(a, b) {
            this._mode.processBlock(a, b)
        },
        _doFinalize: function() {
            var a = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                a.pad(this._data, this.blockSize);
                var b = this._process(!0)
            } else b = this._process(!0), a.unpad(b);
            return b
        },
        blockSize: 4
    });
    var b = d.CipherParams = l.extend({
            init: function(a) {
                this.mixIn(a)
            },
            toString: function(a) {
                return (a || this.formatter).stringify(this)
            }
        }),
        a = (m.format = {}).OpenSSL = {
            stringify: function(a) {
                var b = a.ciphertext;
                a = a.salt;
                return (a ? s.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(c)
            },
            parse: function(a) {
                a = c.parse(a);
                var d = a.words;
                if (1398893684 == d[0] && 1701076831 == d[1]) {
                    var e = s.create(d.slice(2, 4));
                    d.splice(0, 4);
                    a.sigBytes -= 16
                }
                return b.create({
                    ciphertext: a,
                    salt: e
                })
            }
        },
        r = d.SerializableCipher = l.extend({
            cfg: l.extend({
                format: a
            }),
            encrypt: function(a, c, d, e) {
                e = this.cfg.extend(e);
                var p = a.createEncryptor(d, e);
                c = p.finalize(c);
                p = p.cfg;
                return b.create({
                    ciphertext: c,
                    key: d,
                    iv: p.iv,
                    algorithm: a,
                    mode: p.mode,
                    padding: p.padding,
                    blockSize: a.blockSize,
                    formatter: e.format
                })
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                return a.createDecryptor(c, d).finalize(b.ciphertext)
            },
            _parse: function(a, b) {
                return "string" == typeof a ? b.parse(a, this) : a
            }
        }),
        m = (m.kdf = {}).OpenSSL = {
            execute: function(a, c, d, e) {
                e || (e = s.random(8));
                a = p.create({
                    keySize: c + d
                }).compute(a, e);
                d = s.create(a.words.slice(c), 4 * d);
                a.sigBytes = 4 * c;
                return b.create({
                    key: a,
                    iv: d,
                    salt: e
                })
            }
        },
        G = d.PasswordBasedCipher =
        r.extend({
            cfg: r.cfg.extend({
                kdf: m
            }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                c = d.kdf.execute(c, a.keySize, a.ivSize);
                d.iv = c.iv;
                a = r.encrypt.call(this, a, b, c.key, d);
                a.mixIn(c);
                return a
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt);
                d.iv = c.iv;
                return r.decrypt.call(this, a, b, c.key, d)
            }
        })
}();
//TODO: ARIA
(function() {
    function DL(i, o) {
        var T;

        T = i[ 3] ^ i[ 4] ^ i[ 9] ^ i[14];
        o[ 0] = i[ 6] ^ i[ 8] ^ i[13] ^ T;
        o[ 5] = i[ 1] ^ i[10] ^ i[15] ^ T;
        o[11] = i[ 2] ^ i[ 7] ^ i[12] ^ T;
        o[14] = i[ 0] ^ i[ 5] ^ i[11] ^ T;
        T = i[ 2] ^ i[ 5] ^ i[ 8] ^ i[15];
        o[ 1] = i[ 7] ^ i[ 9] ^ i[12] ^ T;
        o[ 4] = i[ 0] ^ i[11] ^ i[14] ^ T;
        o[10] = i[ 3] ^ i[ 6] ^ i[13] ^ T;
        o[15] = i[ 1] ^ i[ 4] ^ i[10] ^ T;
        T = i[ 1] ^ i[ 6] ^ i[11] ^ i[12];
        o[ 2] = i[ 4] ^ i[10] ^ i[15] ^ T;
        o[ 7] = i[ 3] ^ i[ 8] ^ i[13] ^ T;
        o[ 9] = i[ 0] ^ i[ 5] ^ i[14] ^ T;
        o[12] = i[ 2] ^ i[ 7] ^ i[ 9] ^ T;
        T = i[ 0] ^ i[ 7] ^ i[10] ^ i[13];
        o[ 3] = i[ 5] ^ i[11] ^ i[14] ^ T;
        o[ 6] = i[ 2] ^ i[ 9] ^ i[12] ^ T;
        o[ 8] = i[ 1] ^ i[ 4] ^ i[15] ^ T;
        o[13] = i[ 3] ^ i[ 6] ^ i[ 8] ^ T;
    }
    function RotXOR(s, n, t, offset)
    {
        var i, q;
        q = Math.floor(n/8); n %= 8;
        for (i = 0; i < 16; i++) {
            t[offset + ((q+i) % 16)] ^= ((s[i] >> n) & 0xff);
            if (n != 0){
                t[offset + ((q+i+1) % 16)] ^= ((s[i] << (8-n))  & 0xff);
            }
        }
    }
    function EncKeySetup(w0, e, keyBits) 
    {
        var ARIA_KRK = [
            [0x51, 0x7c, 0xc1, 0xb7, 0x27, 0x22, 0x0a, 0x94, 0xfe, 0x13, 0xab, 0xe8, 0xfa, 0x9a, 0x6e, 0xe0],
            [0x6d, 0xb1, 0x4a, 0xcc, 0x9e, 0x21, 0xc8, 0x20, 0xff, 0x28, 0xb1, 0xd5, 0xef, 0x5d, 0xe2, 0xb0], 
            [0xdb, 0x92, 0x37, 0x1d, 0x21, 0x26, 0xe9, 0x70, 0x03, 0x24, 0x97, 0x75, 0x04, 0xe8, 0xc9, 0x0e]
        ];

        var i, R=(keyBits+256)/32, q;
        var t = [], w1 = [], w2 = [], w3 = [];
      
        q = (keyBits - 128) / 64;
        for (i = 0; i < 16; i++){
            t[i] = ARIA_SS[i  % 4][ARIA_KRK[q][i] ^ w0[i]];
        } 
        DL (t, w1);
        
        if (R==14)
            for (i = 0; i <  8; i++) w1[i] ^= w0[16+i];
        else if (R==16)
            for (i = 0; i < 16; i++) w1[i] ^= w0[16+i];
    
        q = (q==2)? 0 : (q+1);
        for (i = 0; i < 16; i++) t[i] = ARIA_SS[(2 + i) % 4][ARIA_KRK[q][i] ^ w1[i]];
        DL (t, w2);
        for (i = 0; i < 16; i++) w2[i] ^= w0[i];
      
        q = (q==2)? 0 : (q+1);
        for (i = 0; i < 16; i++) t[i] = ARIA_SS[     i  % 4][ARIA_KRK[q][i] ^ w2[i]];
        DL (t, w3);
        for (i = 0; i < 16; i++) w3[i] ^= w1[i];
      
        for (i = 0; i < 16*(R+1); i++) e[i] = 0;
      
        RotXOR (w0, 0, e,    0); 
        RotXOR (w1,  19, e,    0);
        
        RotXOR (w1, 0, e,   16); RotXOR (w2,  19, e,   16);
        RotXOR (w2, 0, e,   32); RotXOR (w3,  19, e,   32);
        RotXOR (w3, 0, e,   48); RotXOR (w0,  19, e,   48);
        RotXOR (w0, 0, e,   64); RotXOR (w1,  31, e,   64);
        RotXOR (w1, 0, e,   80); RotXOR (w2,  31, e,   80);
        RotXOR (w2, 0, e,   96); RotXOR (w3,  31, e,   96);
        RotXOR (w3, 0, e,  112); RotXOR (w0,  31, e,  112);
        RotXOR (w0, 0, e,  128); RotXOR (w1,  67, e,  128);
        RotXOR (w1, 0, e,  144); RotXOR (w2,  67, e,  144);
        RotXOR (w2, 0, e,  160); RotXOR (w3,  67, e,  160);
        RotXOR (w3, 0, e,  176); RotXOR (w0,  67, e,  176);
        RotXOR (w0, 0, e,  192); RotXOR (w1,  97, e,  192);
        if (R > 12) {
            RotXOR (w1, 0, e,  208); RotXOR (w2,  97, e,  208);
            RotXOR (w2, 0, e,  224); RotXOR (w3,  97, e,  224);
        }
        if (R > 14) {
            RotXOR (w3, 0, e,  240); RotXOR (w0,  97, e,  240);
            RotXOR (w0, 0, e,  256); RotXOR (w1, 109, e,  256);
        }
        return R;
    }
    function DecKeySetup(w0, d, keyBits) 
    {
        var  i, j, R;
        var t = [], dd2 = [];
      
        R = EncKeySetup(w0, d, keyBits);
        for (j = 0; j < 16; j++){
            t[j] = d[j];
            d[j] = d[16*R + j];
            d[16*R + j] = t[j];
        }
        
        for (i = 1; i <= Math.floor(R/2); i++){
            DL(d.slice(i*16, (i*16)+16), t);
    
            dd2 = d.slice(i*16, (i*16)+16);
            DL(d.slice(((R-i)*16), ((R-i)*16) + 16), dd2);
            Array.prototype.splice.apply(d, [(i*16), 16].concat(dd2));
            Array.prototype.splice.apply(d, [(R-i)*16, 16].concat(t));
        }
        return R;
    }
    /* Converts a cryptjs WordArray to native Uint8Array */                                                                                  
    function CryptJsWordArrayToUint8Array(wordArray) {
        const l = wordArray.length * 4;
        const words = wordArray;
        const result = [];                                                                                                    
        var i=0 /*dst*/, j=0 /*src*/;
        while(true) {
            // here i is a multiple of 4
            if (i==l)
                break;
            var w = words[j++];
            result[i++] = (w & 0xff000000) >>> 24;
            if (i==l)
                break;
            result[i++] = (w & 0x00ff0000) >>> 16;                                                                                            
            if (i==l)                                                                                                                        
                break;                                                                                                                       
            result[i++] = (w & 0x0000ff00) >>> 8;
            if (i==l)
                break;
            result[i++] = (w & 0x000000ff);                                                                                                  
        }
        return result;
    }
    function Uint8ArrayToCryptJsWordArray(wordArray) {
        const l = wordArray.length;
        const words = wordArray;
        const result = [];                                                                                                    
        var i=0 /*dst*/, j=0 /*src*/;
        while(true) {
            // here i is a multiple of 4
            if (i==l)
                break;
            var w = (words[i++] << 24);
            if (i==l)
                break;
                w += (words[i++] << 16);
                //result[i++] = (w & 0x00ff0000) >>> 16;                                                                                            
            if (i==l)                                                                                                                        
                break;                                                                                                                       
                w += (words[i++] << 8);
                //result[i++] = (w & 0x0000ff00) >>> 8;
            if (i==l)
                break;
                w += words[i++];
            //result[i++] = (w & 0x000000ff);
            result[j++] = w;
        }
        return result;
    }
    var m = CryptoJS,
        d = m.lib.BlockCipher,
        ARIA_SS = [
            // S-box type 1
            [
                0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
                0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
                0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
                0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
                0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
                0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
                0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
                0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
                0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
                0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
                0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
                0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
                0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
                0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
                0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
                0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
            ],
            // S-box type 2
            [
                0xe2, 0x4e, 0x54, 0xfc, 0x94, 0xc2, 0x4a, 0xcc, 0x62, 0x0d, 0x6a, 0x46, 0x3c, 0x4d, 0x8b, 0xd1,
                0x5e, 0xfa, 0x64, 0xcb, 0xb4, 0x97, 0xbe, 0x2b, 0xbc, 0x77, 0x2e, 0x03, 0xd3, 0x19, 0x59, 0xc1,
                0x1d, 0x06, 0x41, 0x6b, 0x55, 0xf0, 0x99, 0x69, 0xea, 0x9c, 0x18, 0xae, 0x63, 0xdf, 0xe7, 0xbb,
                0x00, 0x73, 0x66, 0xfb, 0x96, 0x4c, 0x85, 0xe4, 0x3a, 0x09, 0x45, 0xaa, 0x0f, 0xee, 0x10, 0xeb,
                0x2d, 0x7f, 0xf4, 0x29, 0xac, 0xcf, 0xad, 0x91, 0x8d, 0x78, 0xc8, 0x95, 0xf9, 0x2f, 0xce, 0xcd,
                0x08, 0x7a, 0x88, 0x38, 0x5c, 0x83, 0x2a, 0x28, 0x47, 0xdb, 0xb8, 0xc7, 0x93, 0xa4, 0x12, 0x53,
                0xff, 0x87, 0x0e, 0x31, 0x36, 0x21, 0x58, 0x48, 0x01, 0x8e, 0x37, 0x74, 0x32, 0xca, 0xe9, 0xb1,
                0xb7, 0xab, 0x0c, 0xd7, 0xc4, 0x56, 0x42, 0x26, 0x07, 0x98, 0x60, 0xd9, 0xb6, 0xb9, 0x11, 0x40,
                0xec, 0x20, 0x8c, 0xbd, 0xa0, 0xc9, 0x84, 0x04, 0x49, 0x23, 0xf1, 0x4f, 0x50, 0x1f, 0x13, 0xdc,
                0xd8, 0xc0, 0x9e, 0x57, 0xe3, 0xc3, 0x7b, 0x65, 0x3b, 0x02, 0x8f, 0x3e, 0xe8, 0x25, 0x92, 0xe5,
                0x15, 0xdd, 0xfd, 0x17, 0xa9, 0xbf, 0xd4, 0x9a, 0x7e, 0xc5, 0x39, 0x67, 0xfe, 0x76, 0x9d, 0x43,
                0xa7, 0xe1, 0xd0, 0xf5, 0x68, 0xf2, 0x1b, 0x34, 0x70, 0x05, 0xa3, 0x8a, 0xd5, 0x79, 0x86, 0xa8,
                0x30, 0xc6, 0x51, 0x4b, 0x1e, 0xa6, 0x27, 0xf6, 0x35, 0xd2, 0x6e, 0x24, 0x16, 0x82, 0x5f, 0xda,
                0xe6, 0x75, 0xa2, 0xef, 0x2c, 0xb2, 0x1c, 0x9f, 0x5d, 0x6f, 0x80, 0x0a, 0x72, 0x44, 0x9b, 0x6c,
                0x90, 0x0b, 0x5b, 0x33, 0x7d, 0x5a, 0x52, 0xf3, 0x61, 0xa1, 0xf7, 0xb0, 0xd6, 0x3f, 0x7c, 0x6d,
                0xed, 0x14, 0xe0, 0xa5, 0x3d, 0x22, 0xb3, 0xf8, 0x89, 0xde, 0x71, 0x1a, 0xaf, 0xba, 0xb5, 0x81
            ],
            // inverse of S-box type 1
            [
                0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
                0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
                0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
                0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
                0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
                0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
                0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
                0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
                0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
                0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
                0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
                0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
                0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
                0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
                0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
                0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
            ],
            // inverse of S-box type 2
            [
                0x30, 0x68, 0x99, 0x1b, 0x87, 0xb9, 0x21, 0x78, 0x50, 0x39, 0xdb, 0xe1, 0x72, 0x09, 0x62, 0x3c,
                0x3e, 0x7e, 0x5e, 0x8e, 0xf1, 0xa0, 0xcc, 0xa3, 0x2a, 0x1d, 0xfb, 0xb6, 0xd6, 0x20, 0xc4, 0x8d,
                0x81, 0x65, 0xf5, 0x89, 0xcb, 0x9d, 0x77, 0xc6, 0x57, 0x43, 0x56, 0x17, 0xd4, 0x40, 0x1a, 0x4d,
                0xc0, 0x63, 0x6c, 0xe3, 0xb7, 0xc8, 0x64, 0x6a, 0x53, 0xaa, 0x38, 0x98, 0x0c, 0xf4, 0x9b, 0xed,
                0x7f, 0x22, 0x76, 0xaf, 0xdd, 0x3a, 0x0b, 0x58, 0x67, 0x88, 0x06, 0xc3, 0x35, 0x0d, 0x01, 0x8b,
                0x8c, 0xc2, 0xe6, 0x5f, 0x02, 0x24, 0x75, 0x93, 0x66, 0x1e, 0xe5, 0xe2, 0x54, 0xd8, 0x10, 0xce,
                0x7a, 0xe8, 0x08, 0x2c, 0x12, 0x97, 0x32, 0xab, 0xb4, 0x27, 0x0a, 0x23, 0xdf, 0xef, 0xca, 0xd9,
                0xb8, 0xfa, 0xdc, 0x31, 0x6b, 0xd1, 0xad, 0x19, 0x49, 0xbd, 0x51, 0x96, 0xee, 0xe4, 0xa8, 0x41,
                0xda, 0xff, 0xcd, 0x55, 0x86, 0x36, 0xbe, 0x61, 0x52, 0xf8, 0xbb, 0x0e, 0x82, 0x48, 0x69, 0x9a,
                0xe0, 0x47, 0x9e, 0x5c, 0x04, 0x4b, 0x34, 0x15, 0x79, 0x26, 0xa7, 0xde, 0x29, 0xae, 0x92, 0xd7,
                0x84, 0xe9, 0xd2, 0xba, 0x5d, 0xf3, 0xc5, 0xb0, 0xbf, 0xa4, 0x3b, 0x71, 0x44, 0x46, 0x2b, 0xfc,
                0xeb, 0x6f, 0xd5, 0xf6, 0x14, 0xfe, 0x7c, 0x70, 0x5a, 0x7d, 0xfd, 0x2f, 0x18, 0x83, 0x16, 0xa5,
                0x91, 0x1f, 0x05, 0x95, 0x74, 0xa9, 0xc1, 0x5b, 0x4a, 0x85, 0x6d, 0x13, 0x07, 0x4f, 0x4e, 0x45,
                0xb2, 0x0f, 0xc9, 0x1c, 0xa6, 0xbc, 0xec, 0x73, 0x90, 0x7b, 0xcf, 0x59, 0x8f, 0xa1, 0xf9, 0x2d,
                0xf2, 0xb1, 0x00, 0x94, 0x37, 0x9f, 0xd0, 0x2e, 0x9c, 0x6e, 0x28, 0x3f, 0x80, 0xf0, 0x3d, 0xd3,
                0x25, 0x8a, 0xb5, 0xe7, 0x42, 0xb3, 0xc7, 0xea, 0xf7, 0x4c, 0x11, 0x33, 0x03, 0xa2, 0xac, 0x60
            ]
        ],
        t = m.algo.ARIA = d.extend({
            _doReset: function() {
               var key = [];

               //*
               var keys = this._key + '';
               // Key 를 문자열로 받았을때 처리
               for(var i=0;i<Math.floor(keys.length / 2);i++){
                   var subHexValue = keys.substr(i*2, 2);
                   key[i] = parseInt(subHexValue, 16);
               }
               //*/
               var roundKey, R;

               roundKey = [];
               R = EncKeySetup(key, roundKey, key.length * 8);
               this._roundKeys = {rk:roundKey, R:R};

               roundKey = [];
               R = DecKeySetup(key, roundKey, key.length * 8);
               this._invRoundKeys = {rk:roundKey, R:R};
            },
            encryptBlock: function(c, d) {
                this._doCryptBlock(c, d, this._roundKeys)
            },
            decryptBlock: function(c, d) {
                this._doCryptBlock(c, d, this._invRoundKeys)
            },
            _doCryptBlock: function (M, offset, roundKeys) {
                // Get input
                var L = M.slice(offset, offset + 4);
                var p = CryptJsWordArrayToUint8Array(L);
                var R = roundKeys.R;
                var e = roundKeys.rk;
                var c = [];
                var i, j;
                var t = [];
                
                var blockIndex = 0;
                for (j = 0; j < 16; j++) 
                    c[j] = p[j];
                
                for (i = 0; i < Math.floor(R/2); i++)
                {
                    for (j = 0; j < 16; j++) t[j] = ARIA_SS[     j  % 4][e[blockIndex+j] ^ c[j]];
                    DL(t, c); blockIndex += 16;
                    for (j = 0; j < 16; j++) t[j] = ARIA_SS[(2 + j) % 4][e[blockIndex+j] ^ c[j]];
                    DL(t, c); blockIndex += 16;
                }
                DL(c, t);
                for (j = 0; j < 16; j++)
                    c[j] = e[blockIndex+j] ^ t[j];
                var LR = Uint8ArrayToCryptJsWordArray(c);
                // Set output
                M.splice(offset, 4, LR[0], LR[1], LR[2], LR[3]);
            },
            keySize: 4,
            ivSize: 4,
            blockSize: 4
        });
    m.ARIA = d._createHelper(t)
})();

var NOS_E2E = function() {
    this.serverKey  = "75908D6897DC69F57BC8480A8D251DBC1487C74723194C949473B3F99DFD2358";
    this.serverIv   = "";
    this.clientKey  = "";
    this.E2E_RESULT = "";
    this.dummy      = "";
    this.rsaKey     = null;
    this.keyType    = null;
}

NOS_E2E.prototype.importLibrary = function() {
    try {
        system.include("sas/skt_rsa/jsbn");
        system.include("sas/skt_rsa/rsa");
        system.include("sas/skt_rsa/prng4");
        system.include("sas/skt_rsa/rng");
    } catch (e) {
        console.log("Exception importLibrary : [" + e.message + "]");
        return false;
    }
    return true;
}

NOS_E2E.prototype.init = function (encryptedCert){
    //라이브러리 include
    if(!this.importLibrary()){
        return false;
    }

    this.serverIv = encryptedCert.substring(0,32);
    encryptedCert = encryptedCert.substring(32);
    // console.log("encryptedCert :[" + encryptedCert + "]");
    // console.log("this.serverKey:[" + this.serverKey + "]");
    // console.log("this.serverIv :[" + this.serverIv + "]");

    var arrKey = CryptoJS.enc.Hex.parse(this.serverKey);
    var arrIV  = CryptoJS.enc.Hex.parse(this.serverIv);
    var reb64 = CryptoJS.enc.Hex.parse(encryptedCert);
    var encryptedCert = reb64.toString(CryptoJS.enc.Base64);

    var pubKey = CryptoJS.ARIA.decrypt(encryptedCert, arrKey, { iv: arrIV, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);    
    var serverSecureKey = pubKey.substring(0,64);
    
    if(!this.doPublic(pubKey)){
        return false;
    }

    // RSA 암호화 시작
    var rsa = new RSAKey();
    rsa.setPublic(this.rsaKey, this.keyType);
    
    var clientRandom = Number(Math.floor((new Date()).getTime() /1000)) + "";
    clientRandom = certManager.Hash("SHA256", clientRandom);
    
    this.E2E_RESULT = rsa.encryptOAEP(clientRandom);
    
    // __E2E__ 암호화 키
    var saltKey = this.makeSalt(serverSecureKey);
    var encryptSourceKey = saltKey + clientRandom;
    this.clientKey = this.makeKey(encryptSourceKey);
}

//고정으로 설정된 서버키가 아닐 경우에만 사용
NOS_E2E.prototype.setServerKey = function(serverKey){
    this.serverKey = serverKey;
}

NOS_E2E.prototype.doPublic = function (pubKey){
    
    if(!pubKey){
        return false;
    }
    
    pubKey = StrGrab(pubKey, "-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----");
    pubKey = pubKey.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
    
    var resultJson = {};
    var pubKeyHex = certManager.Base64ToHex(pubKey);
    var rsaKey = ""
    if (rsaKey.indexOf("02818100") > -1) {
        rsaKey = pubKeyHex.substr(pubKeyHex.indexOf("02818100") + 8 , 256); //1024bit 
    } else {
        rsaKey = pubKeyHex.substr(pubKeyHex.indexOf("0282010100") + 10, 512);   //2048bit
    }
    
    if (rsaKey == "") {
        return false;
    } 
    var rsaKeySize = rsaKey.length;
    if (rsaKeySize != 256 && rsaKeySize != 512 ) {
        return false;
    } 
    var keyType = pubKeyHex.substring(pubKeyHex.indexOf(rsaKey) + (rsaKeySize + 4), pubKeyHex.indexOf(rsaKey) + (rsaKeySize + 10));
    this.rsaKey  = rsaKey;
    this.keyType = keyType;
    
    return true;
    
}

NOS_E2E.prototype.makeSalt = function (str){
    str = parseHexStringToString(str);
    var br = parseToHexArray(str);
    var len = br.length;
    var brNew = [];
    for (var i = 0; i < br.length; i++) {
        var brint = br[i] & 255;
        brNew[i] = br[Math.abs(brint%len)]

    }
    return parseByteToHexString(brNew);
}

NOS_E2E.prototype.makeKey = function (str){
    var key = str;
    for (var i = 0; i < 256; i++) {
        key = certManager.hashFromHex("SHA256", key).toUpperCase();
    }
    return key;
}

NOS_E2E.prototype._E2E_Encrypt = function (plain){
    var result = "";
    this.dummy = "";
    for(var i = 0; i < plain.length; i++){
        var char = plain[i];
        var random = Number(Math.floor((new Date()).getTime() /1000)) + "";
        var randomKey = certManager.Hash("SHA256", random); 
        randomKey = randomKey.substring(0,32);
      
        var arrKey = CryptoJS.enc.Hex.parse(this.clientKey);
        var arrIV  = CryptoJS.enc.Hex.parse(randomKey);
        var encrypted = CryptoJS.ARIA.encrypt(char, arrKey, { iv: arrIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
        var e64 = CryptoJS.enc.Base64.parse(encrypted);
        encrypted = e64.toString(CryptoJS.enc.Hex);

        encrypted = randomKey + encrypted;
        result += encrypted.toLowerCase();
        if(isNaN(char)){
            this.dummy += "a";
        } else {
            this.dummy += "1";
        }
    }
    return result;
}

NOS_E2E.prototype._Encrypt = function (plain) {
    //1. UTF16 처럼 보이게 변환 - juryu 2020-08-05
    var wordArray;
    {
        var char = plain.split("");
        var array = char, i = 1;

        while (i <= array.length) {
            array.splice(i, 0, '\0');
            i += 2;
        }
        wordArray = array.join("");
    }

    //2. IV 고정값 - juryu 2020-08-05
    var encryptIV = "6befdc7ae9f4dcf3ce28da7bc84b7b94";

    //3. 암호화 - juryu 2020-08-05
    var arrKey = CryptoJS.enc.Hex.parse(this.clientKey);
    var arrIV = CryptoJS.enc.Hex.parse(encryptIV);
    var encrypted = CryptoJS.ARIA.encrypt(wordArray, arrKey, { iv: arrIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
    var e64 = CryptoJS.enc.Base64.parse(encrypted);
    encrypted = e64.toString(CryptoJS.enc.Hex);

    return encrypted.toLowerCase();
}