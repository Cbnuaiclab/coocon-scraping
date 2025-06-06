// ------------------------------------------------------------------------------
// Module Name: aria_SEED_256_Test.js
//
// Author : 류재욱(juryu@webcash.co.kr)
// Copyright (c) 2017-2020 Webcash Corporation. All rights reserved.
//
// Last Update : 2021-05-27  v1.00   by juryu - 최초 작성
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
//TODO: SEED256
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

    function toULong(x) {
        return x >>> 0;  // The >>> operator does ToUint32
    }

    function GetB0(A){return toULong(A) & 0x000000FF}         //( (BYTE)((A)    ) )
    function GetB1(A){return (A >>> 8) & 0x000000FF}    //( (BYTE)((A)>> 8) )
    function GetB2(A){return (A >>> 16) & 0x000000FF}   //( (BYTE)((A)>>16) )
    function GetB3(A){return (A >>> 24) & 0x000000FF}   //( (BYTE)((A)>>24) )
    
    function EncRoundKeyUpdate0(K, i, KC, rot) {  
        this.T0 = this.D;

        this.D = (this.D>>>rot) ^ (this.C<<(32-rot));
        this.C = (this.C>>>rot) ^ (this.B<<(32-rot));
        this.B = (this.B>>>rot) ^ (this.A<<(32-rot));
        this.A = (this.A>>>rot) ^ (this.T0<<(32-rot));
    
        this.T0 = (((this.A + this.C) ^ this.E ) - this.F) ^ KC;
        this.T1 = (((this.B - this.D) ^ this.G ) + this.H) ^ KC;
    
        K[i] = SEED_256_SS0[GetB0(this.T0)] ^ SEED_256_SS1[GetB1(this.T0)] ^   
               SEED_256_SS2[GetB2(this.T0)] ^ SEED_256_SS3[GetB3(this.T0)];    

        K[i+1] = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^   
               SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];    
    }

    function EncRoundKeyUpdate1(K, i, KC, rot) {  
        this.T0 = this.E;                                      
        this.E = (this.E<<rot) ^ (this.F>>>(32-rot));
        this.F = (this.F<<rot) ^ (this.G>>>(32-rot));
        this.G = (this.G<<rot) ^ (this.H>>>(32-rot));
        this.H = (this.H<<rot) ^ (this.T0>>>(32-rot));
        this.T0 = (((this.A + this.C) ^ this.E ) - this.F) ^ KC;              
        this.T1 = (((this.B - this.D) ^ this.G ) + this.H) ^ KC;              
        K[i] = SEED_256_SS0[GetB0(this.T0)] ^ SEED_256_SS1[GetB1(this.T0)] ^   
                 SEED_256_SS2[GetB2(this.T0)] ^ SEED_256_SS3[GetB3(this.T0)];    

        K[i+1] = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^   
               SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];    
    }    
       
    //SEED256 Key Setup - juryu 2021-05-27
    function EncKeySetup(pbUserKey, pdwRoundKey) 
    {
        const KC0 = 0x9e3779b9;
        const KC1 = 0x3c6ef373;
        const KC2 = 0x78dde6e6;
        const KC3 = 0xf1bbcdcc;
        const KC4 = 0xe3779b99;
        const KC5 = 0xc6ef3733;
        const KC6 = 0x8dde6e67;
        const KC7 = 0x1bbcdccf;
        const KC8 = 0x3779b99e;
        const KC9 = 0x6ef3733c;
        const KC10 = 0xdde6e678;
        const KC11 = 0xbbcdccf1;
        const KC12 = 0x779b99e3;
        const KC13 = 0xef3733c6;
        const KC14 = 0xde6e678d;
        const KC15 = 0xbcdccf1b;
        const KC16 = 0x79b99e37;
        const KC17 = 0xf3733c6e;
        const KC18 = 0xe6e678dd;
        const KC19 = 0xcdccf1bb;
        const KC20 = 0x9b99e377;
        const KC21 = 0x3733c6ef;
        const KC22 = 0x6e678dde;
        const KC23 = 0xdccf1bbc;
        
        //SEED256
        this.A = (pbUserKey[ 0] << 24) | (pbUserKey[ 1] << 16) | (pbUserKey[ 2] << 8) | (pbUserKey[ 3]);
        this.B = (pbUserKey[ 4] << 24) | (pbUserKey[ 5] << 16) | (pbUserKey[ 6] << 8) | (pbUserKey[ 7]);
        this.C = (pbUserKey[ 8] << 24) | (pbUserKey[ 9] << 16) | (pbUserKey[10] << 8) | (pbUserKey[11]);
        this.D = (pbUserKey[12] << 24) | (pbUserKey[13] << 16) | (pbUserKey[14] << 8) | (pbUserKey[15]);
        this.E = (pbUserKey[16] << 24) | (pbUserKey[17] << 16) | (pbUserKey[18] << 8) | (pbUserKey[19]);
        this.F = (pbUserKey[20] << 24) | (pbUserKey[21] << 16) | (pbUserKey[22] << 8) | (pbUserKey[23]);
        this.G = (pbUserKey[24] << 24) | (pbUserKey[25] << 16) | (pbUserKey[26] << 8) | (pbUserKey[27]);
        this.H = (pbUserKey[28] << 24) | (pbUserKey[29] << 16) | (pbUserKey[30] << 8) | (pbUserKey[31]);

        this.T0 = (((this.A + this.C) ^ this.E ) - this.F) ^ KC0;
        this.T1 = (((this.B - this.D) ^ this.G ) + this.H) ^ KC0;

        pdwRoundKey[0] = SEED_256_SS0[GetB0(this.T0)] ^ SEED_256_SS1[GetB1(this.T0)] ^
                         SEED_256_SS2[GetB2(this.T0)] ^ SEED_256_SS3[GetB3(this.T0)];

        pdwRoundKey[1] = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^
                         SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];

        EncRoundKeyUpdate0(pdwRoundKey,  2, KC1 ,  9);
        EncRoundKeyUpdate1(pdwRoundKey,  4, KC2 ,  9);
        EncRoundKeyUpdate0(pdwRoundKey,  6, KC3 , 11);
        EncRoundKeyUpdate1(pdwRoundKey,  8, KC4 , 11);
        EncRoundKeyUpdate0(pdwRoundKey, 10, KC5 , 12);
        EncRoundKeyUpdate1(pdwRoundKey, 12, KC6 , 12);
        EncRoundKeyUpdate0(pdwRoundKey, 14, KC7 ,  9);
        EncRoundKeyUpdate1(pdwRoundKey, 16, KC8 ,  9);
        EncRoundKeyUpdate0(pdwRoundKey, 18, KC9 , 11);
        EncRoundKeyUpdate1(pdwRoundKey, 20, KC10, 11);
        EncRoundKeyUpdate0(pdwRoundKey, 22, KC11, 12);
        EncRoundKeyUpdate1(pdwRoundKey, 24, KC12, 12);
        EncRoundKeyUpdate0(pdwRoundKey, 26, KC13,  9);
        EncRoundKeyUpdate1(pdwRoundKey, 28, KC14,  9);
        EncRoundKeyUpdate0(pdwRoundKey, 30, KC15, 11);
        EncRoundKeyUpdate1(pdwRoundKey, 32, KC16, 11);
        EncRoundKeyUpdate0(pdwRoundKey, 34, KC17, 12);
        EncRoundKeyUpdate1(pdwRoundKey, 36, KC18, 12);
        EncRoundKeyUpdate0(pdwRoundKey, 38, KC19,  9);
        EncRoundKeyUpdate1(pdwRoundKey, 40, KC20,  9);
        EncRoundKeyUpdate0(pdwRoundKey, 42, KC21, 11);
        EncRoundKeyUpdate1(pdwRoundKey, 44, KC22, 11);
        EncRoundKeyUpdate0(pdwRoundKey, 46, KC23, 12);
        return 0;
    }
    
    function SeedRound1(L0, L1, R0, R1, K, Ki) {             
        this.T0 = this.R0 ^ K[Ki + 0];                              
        this.T1 = this.R1 ^ K[Ki + 1];                              
        this.T1 ^= this.T0;                                      
        this.T1 = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^         
                  SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];          
        this.T0 += this.T1;                                      
        this.T0 = SEED_256_SS0[GetB0(this.T0)] ^ SEED_256_SS1[GetB1(this.T0)] ^         
                  SEED_256_SS2[GetB2(this.T0)] ^ SEED_256_SS3[GetB3(this.T0)];          
        this.T1 += this.T0;                                      
        this.T1 = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^         
                  SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];          
        this.T0 += this.T1;                                      
        this.L0 ^= this.T0; this.L1 ^= this.T1;                            
    }

    function SeedRound2(R0, R1, L0, L1, K, Ki) {             
        this.T0 = this.L0 ^ K[Ki + 0];                              
        this.T1 = this.L1 ^ K[Ki + 1];                              
        this.T1 ^= this.T0;                                      
        this.T1 = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^         
                  SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];          
        this.T0 += this.T1;                                      
        this.T0 = SEED_256_SS0[GetB0(this.T0)] ^ SEED_256_SS1[GetB1(this.T0)] ^         
                  SEED_256_SS2[GetB2(this.T0)] ^ SEED_256_SS3[GetB3(this.T0)];          
        this.T1 += this.T0;                                      
        this.T1 = SEED_256_SS0[GetB0(this.T1)] ^ SEED_256_SS1[GetB1(this.T1)] ^         
                  SEED_256_SS2[GetB2(this.T1)] ^ SEED_256_SS3[GetB3(this.T1)];          
        this.T0 += this.T1;                                      
        this.R0 ^= this.T0; this.R1 ^= this.T1;                            
    }

    function seed256EncryptBlock(M, offset, roundKeys) {
        // Get input
        var L = M.slice(offset, offset + 4);
        var p = CryptJsWordArrayToUint8Array(L);
        var c = [];
        var j;
        // end of Get input

        //1. round Key 설정
        var K = roundKeys.rk;   //실제 키 배열

        //2. Block 복사
        for (j = 0; j < 16; j++) 
            c[j] = p[j];

        this.L0 = (c[ 0] << 24) | (c[ 1] << 16) | (c[ 2] << 8) | (c[ 3]);
        this.L1 = (c[ 4] << 24) | (c[ 5] << 16) | (c[ 6] << 8) | (c[ 7]);
        this.R0 = (c[ 8] << 24) | (c[ 9] << 16) | (c[10] << 8) | (c[11]);
        this.R1 = (c[12] << 24) | (c[13] << 16) | (c[14] << 8) | (c[15]);

    // #ifndef SEED_BIG_ENDIAN
    //     L0 = EndianChange(L0);
    //     L1 = EndianChange(L1);
    //     R0 = EndianChange(R0);
    //     R1 = EndianChange(R1);
    // #endif
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 0); //*   1 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 2); //*   2 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 4); //*   3 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 6); //*   4 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 8); //*   5 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,10); //*   6 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,12); //*   7 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,14); //*   8 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,16); //*   9 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,18); //*  10 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,20); //*  11 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,22); //*  12 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,24); //*  13 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,26); //*  14 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,28); //*  15 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,30); //*  16 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,32); //*  17 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,34); //*  18 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,36); //*  19 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,38); //*  20 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,40); //*  21 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,42); //*  22 * /
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,44); //*  23 * /
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,46); //*  24 * /
    
    // #ifndef SEED_BIG_ENDIAN
    //     L0 = EndianChange(L0);
    //     L1 = EndianChange(L1);
    //     R0 = EndianChange(R0);
    //     R1 = EndianChange(R1);
    // #endif
        // Set output
        M.splice(offset, 4, R0, R1, L0, L1);
    }

    function seed256DecryptBlock(M, offset, roundKeys) {
        // Get input
        var L = M.slice(offset, offset + 4);
        var p = CryptJsWordArrayToUint8Array(L);
        var c = [];
        var j;
        // end of Get input

        //1. round Key 설정
        var K = roundKeys.rk;   //실제 키 배열
        // this.L0, this.L1, this.R0, this.R1, this.T0, this.T1

        //2. Block 복사
        for (j = 0; j < 16; j++) {
            c[j] = p[j];
        }

        this.L0 = (c[ 0] << 24) | (c[ 1] << 16) | (c[ 2] << 8) | (c[ 3]);
        this.L1 = (c[ 4] << 24) | (c[ 5] << 16) | (c[ 6] << 8) | (c[ 7]);
        this.R0 = (c[ 8] << 24) | (c[ 9] << 16) | (c[10] << 8) | (c[11]);
        this.R1 = (c[12] << 24) | (c[13] << 16) | (c[14] << 8) | (c[15]);

    // #ifndef SEED_BIG_ENDIAN
    //     L0 = EndianChange(L0);
    //     L1 = EndianChange(L1);
    //     R0 = EndianChange(R0);
    //     R1 = EndianChange(R1);
    // #endif
    
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 46); /*   1 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 44); /*   2 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 42); /*   3 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 40); /*   4 */    
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 38); /*   5 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 36); /*   6 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 34); /*   7 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 32); /*   8 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 30); /*   9 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 28); /*  10 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 26); /*  11 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 24); /*  12 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 22); /*  13 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 20); /*  14 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 18); /*  15 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 16); /*  16 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 14); /*  17 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K, 12); /*  18 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K, 10); /*  19 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,  8); /*  20 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,  6); /*  21 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,  4); /*  22 */
        SeedRound1(this.L0, this.L1, this.R0, this.R1, K,  2); /*  23 */
        SeedRound2(this.R0, this.R1, this.L0, this.L1, K,  0); /*  24 */
    
    // #ifndef SEED_BIG_ENDIAN
    //     this.L0 = EndianChange(this.L0);
    //     this.L1 = EndianChange(this.L1);
    //     this.R0 = EndianChange(this.R0);
    //     this.R1 = EndianChange(this.R1);
    // #endif
        M.splice(offset, 4, this.R0, this.R1, this.L0, this.L1);
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
        //static DWORD SS0[256] = {
        SEED_256_SS0 = [
            0x2989a1a8, 0x05858184, 0x16c6d2d4, 0x13c3d3d0, 0x14445054, 0x1d0d111c, 0x2c8ca0ac, 0x25052124,
            0x1d4d515c, 0x03434340, 0x18081018, 0x1e0e121c, 0x11415150, 0x3cccf0fc, 0x0acac2c8, 0x23436360,
            0x28082028, 0x04444044, 0x20002020, 0x1d8d919c, 0x20c0e0e0, 0x22c2e2e0, 0x08c8c0c8, 0x17071314,
            0x2585a1a4, 0x0f8f838c, 0x03030300, 0x3b4b7378, 0x3b8bb3b8, 0x13031310, 0x12c2d2d0, 0x2ecee2ec,
            0x30407070, 0x0c8c808c, 0x3f0f333c, 0x2888a0a8, 0x32023230, 0x1dcdd1dc, 0x36c6f2f4, 0x34447074,
            0x2ccce0ec, 0x15859194, 0x0b0b0308, 0x17475354, 0x1c4c505c, 0x1b4b5358, 0x3d8db1bc, 0x01010100,
            0x24042024, 0x1c0c101c, 0x33437370, 0x18889098, 0x10001010, 0x0cccc0cc, 0x32c2f2f0, 0x19c9d1d8,
            0x2c0c202c, 0x27c7e3e4, 0x32427270, 0x03838380, 0x1b8b9398, 0x11c1d1d0, 0x06868284, 0x09c9c1c8,
            0x20406060, 0x10405050, 0x2383a3a0, 0x2bcbe3e8, 0x0d0d010c, 0x3686b2b4, 0x1e8e929c, 0x0f4f434c,
            0x3787b3b4, 0x1a4a5258, 0x06c6c2c4, 0x38487078, 0x2686a2a4, 0x12021210, 0x2f8fa3ac, 0x15c5d1d4,
            0x21416160, 0x03c3c3c0, 0x3484b0b4, 0x01414140, 0x12425250, 0x3d4d717c, 0x0d8d818c, 0x08080008,
            0x1f0f131c, 0x19899198, 0x00000000, 0x19091118, 0x04040004, 0x13435350, 0x37c7f3f4, 0x21c1e1e0,
            0x3dcdf1fc, 0x36467274, 0x2f0f232c, 0x27072324, 0x3080b0b0, 0x0b8b8388, 0x0e0e020c, 0x2b8ba3a8,
            0x2282a2a0, 0x2e4e626c, 0x13839390, 0x0d4d414c, 0x29496168, 0x3c4c707c, 0x09090108, 0x0a0a0208,
            0x3f8fb3bc, 0x2fcfe3ec, 0x33c3f3f0, 0x05c5c1c4, 0x07878384, 0x14041014, 0x3ecef2fc, 0x24446064,
            0x1eced2dc, 0x2e0e222c, 0x0b4b4348, 0x1a0a1218, 0x06060204, 0x21012120, 0x2b4b6368, 0x26466264,
            0x02020200, 0x35c5f1f4, 0x12829290, 0x0a8a8288, 0x0c0c000c, 0x3383b3b0, 0x3e4e727c, 0x10c0d0d0,
            0x3a4a7278, 0x07474344, 0x16869294, 0x25c5e1e4, 0x26062224, 0x00808080, 0x2d8da1ac, 0x1fcfd3dc,
            0x2181a1a0, 0x30003030, 0x37073334, 0x2e8ea2ac, 0x36063234, 0x15051114, 0x22022220, 0x38083038,
            0x34c4f0f4, 0x2787a3a4, 0x05454144, 0x0c4c404c, 0x01818180, 0x29c9e1e8, 0x04848084, 0x17879394,
            0x35053134, 0x0bcbc3c8, 0x0ecec2cc, 0x3c0c303c, 0x31417170, 0x11011110, 0x07c7c3c4, 0x09898188,
            0x35457174, 0x3bcbf3f8, 0x1acad2d8, 0x38c8f0f8, 0x14849094, 0x19495158, 0x02828280, 0x04c4c0c4,
            0x3fcff3fc, 0x09494148, 0x39093138, 0x27476364, 0x00c0c0c0, 0x0fcfc3cc, 0x17c7d3d4, 0x3888b0b8,
            0x0f0f030c, 0x0e8e828c, 0x02424240, 0x23032320, 0x11819190, 0x2c4c606c, 0x1bcbd3d8, 0x2484a0a4,
            0x34043034, 0x31c1f1f0, 0x08484048, 0x02c2c2c0, 0x2f4f636c, 0x3d0d313c, 0x2d0d212c, 0x00404040,
            0x3e8eb2bc, 0x3e0e323c, 0x3c8cb0bc, 0x01c1c1c0, 0x2a8aa2a8, 0x3a8ab2b8, 0x0e4e424c, 0x15455154,
            0x3b0b3338, 0x1cccd0dc, 0x28486068, 0x3f4f737c, 0x1c8c909c, 0x18c8d0d8, 0x0a4a4248, 0x16465254,
            0x37477374, 0x2080a0a0, 0x2dcde1ec, 0x06464244, 0x3585b1b4, 0x2b0b2328, 0x25456164, 0x3acaf2f8,
            0x23c3e3e0, 0x3989b1b8, 0x3181b1b0, 0x1f8f939c, 0x1e4e525c, 0x39c9f1f8, 0x26c6e2e4, 0x3282b2b0,
            0x31013130, 0x2acae2e8, 0x2d4d616c, 0x1f4f535c, 0x24c4e0e4, 0x30c0f0f0, 0x0dcdc1cc, 0x08888088,
            0x16061214, 0x3a0a3238, 0x18485058, 0x14c4d0d4, 0x22426260, 0x29092128, 0x07070304, 0x33033330,
            0x28c8e0e8, 0x1b0b1318, 0x05050104, 0x39497178, 0x10809090, 0x2a4a6268, 0x2a0a2228, 0x1a8a9298
        ],
        //static DWORD SS1[256] = {
        SEED_256_SS1 = [
            0x38380830, 0xe828c8e0, 0x2c2d0d21, 0xa42686a2, 0xcc0fcfc3, 0xdc1eced2, 0xb03383b3, 0xb83888b0,
            0xac2f8fa3, 0x60204060, 0x54154551, 0xc407c7c3, 0x44044440, 0x6c2f4f63, 0x682b4b63, 0x581b4b53,
            0xc003c3c3, 0x60224262, 0x30330333, 0xb43585b1, 0x28290921, 0xa02080a0, 0xe022c2e2, 0xa42787a3,
            0xd013c3d3, 0x90118191, 0x10110111, 0x04060602, 0x1c1c0c10, 0xbc3c8cb0, 0x34360632, 0x480b4b43,
            0xec2fcfe3, 0x88088880, 0x6c2c4c60, 0xa82888a0, 0x14170713, 0xc404c4c0, 0x14160612, 0xf434c4f0,
            0xc002c2c2, 0x44054541, 0xe021c1e1, 0xd416c6d2, 0x3c3f0f33, 0x3c3d0d31, 0x8c0e8e82, 0x98188890,
            0x28280820, 0x4c0e4e42, 0xf436c6f2, 0x3c3e0e32, 0xa42585a1, 0xf839c9f1, 0x0c0d0d01, 0xdc1fcfd3,
            0xd818c8d0, 0x282b0b23, 0x64264662, 0x783a4a72, 0x24270723, 0x2c2f0f23, 0xf031c1f1, 0x70324272,
            0x40024242, 0xd414c4d0, 0x40014141, 0xc000c0c0, 0x70334373, 0x64274763, 0xac2c8ca0, 0x880b8b83,
            0xf437c7f3, 0xac2d8da1, 0x80008080, 0x1c1f0f13, 0xc80acac2, 0x2c2c0c20, 0xa82a8aa2, 0x34340430,
            0xd012c2d2, 0x080b0b03, 0xec2ecee2, 0xe829c9e1, 0x5c1d4d51, 0x94148490, 0x18180810, 0xf838c8f0,
            0x54174753, 0xac2e8ea2, 0x08080800, 0xc405c5c1, 0x10130313, 0xcc0dcdc1, 0x84068682, 0xb83989b1,
            0xfc3fcff3, 0x7c3d4d71, 0xc001c1c1, 0x30310131, 0xf435c5f1, 0x880a8a82, 0x682a4a62, 0xb03181b1,
            0xd011c1d1, 0x20200020, 0xd417c7d3, 0x00020202, 0x20220222, 0x04040400, 0x68284860, 0x70314171,
            0x04070703, 0xd81bcbd3, 0x9c1d8d91, 0x98198991, 0x60214161, 0xbc3e8eb2, 0xe426c6e2, 0x58194951,
            0xdc1dcdd1, 0x50114151, 0x90108090, 0xdc1cccd0, 0x981a8a92, 0xa02383a3, 0xa82b8ba3, 0xd010c0d0,
            0x80018181, 0x0c0f0f03, 0x44074743, 0x181a0a12, 0xe023c3e3, 0xec2ccce0, 0x8c0d8d81, 0xbc3f8fb3,
            0x94168692, 0x783b4b73, 0x5c1c4c50, 0xa02282a2, 0xa02181a1, 0x60234363, 0x20230323, 0x4c0d4d41,
            0xc808c8c0, 0x9c1e8e92, 0x9c1c8c90, 0x383a0a32, 0x0c0c0c00, 0x2c2e0e22, 0xb83a8ab2, 0x6c2e4e62,
            0x9c1f8f93, 0x581a4a52, 0xf032c2f2, 0x90128292, 0xf033c3f3, 0x48094941, 0x78384870, 0xcc0cccc0,
            0x14150511, 0xf83bcbf3, 0x70304070, 0x74354571, 0x7c3f4f73, 0x34350531, 0x10100010, 0x00030303,
            0x64244460, 0x6c2d4d61, 0xc406c6c2, 0x74344470, 0xd415c5d1, 0xb43484b0, 0xe82acae2, 0x08090901,
            0x74364672, 0x18190911, 0xfc3ecef2, 0x40004040, 0x10120212, 0xe020c0e0, 0xbc3d8db1, 0x04050501,
            0xf83acaf2, 0x00010101, 0xf030c0f0, 0x282a0a22, 0x5c1e4e52, 0xa82989a1, 0x54164652, 0x40034343,
            0x84058581, 0x14140410, 0x88098981, 0x981b8b93, 0xb03080b0, 0xe425c5e1, 0x48084840, 0x78394971,
            0x94178793, 0xfc3cccf0, 0x1c1e0e12, 0x80028282, 0x20210121, 0x8c0c8c80, 0x181b0b13, 0x5c1f4f53,
            0x74374773, 0x54144450, 0xb03282b2, 0x1c1d0d11, 0x24250521, 0x4c0f4f43, 0x00000000, 0x44064642,
            0xec2dcde1, 0x58184850, 0x50124252, 0xe82bcbe3, 0x7c3e4e72, 0xd81acad2, 0xc809c9c1, 0xfc3dcdf1,
            0x30300030, 0x94158591, 0x64254561, 0x3c3c0c30, 0xb43686b2, 0xe424c4e0, 0xb83b8bb3, 0x7c3c4c70,
            0x0c0e0e02, 0x50104050, 0x38390931, 0x24260622, 0x30320232, 0x84048480, 0x68294961, 0x90138393,
            0x34370733, 0xe427c7e3, 0x24240420, 0xa42484a0, 0xc80bcbc3, 0x50134353, 0x080a0a02, 0x84078783,
            0xd819c9d1, 0x4c0c4c40, 0x80038383, 0x8c0f8f83, 0xcc0ecec2, 0x383b0b33, 0x480a4a42, 0xb43787b3
        ],
        //static DWORD SS2[256] = {
        SEED_256_SS2 = [
            0xa1a82989, 0x81840585, 0xd2d416c6, 0xd3d013c3, 0x50541444, 0x111c1d0d, 0xa0ac2c8c, 0x21242505,
            0x515c1d4d, 0x43400343, 0x10181808, 0x121c1e0e, 0x51501141, 0xf0fc3ccc, 0xc2c80aca, 0x63602343,
            0x20282808, 0x40440444, 0x20202000, 0x919c1d8d, 0xe0e020c0, 0xe2e022c2, 0xc0c808c8, 0x13141707,
            0xa1a42585, 0x838c0f8f, 0x03000303, 0x73783b4b, 0xb3b83b8b, 0x13101303, 0xd2d012c2, 0xe2ec2ece,
            0x70703040, 0x808c0c8c, 0x333c3f0f, 0xa0a82888, 0x32303202, 0xd1dc1dcd, 0xf2f436c6, 0x70743444,
            0xe0ec2ccc, 0x91941585, 0x03080b0b, 0x53541747, 0x505c1c4c, 0x53581b4b, 0xb1bc3d8d, 0x01000101,
            0x20242404, 0x101c1c0c, 0x73703343, 0x90981888, 0x10101000, 0xc0cc0ccc, 0xf2f032c2, 0xd1d819c9,
            0x202c2c0c, 0xe3e427c7, 0x72703242, 0x83800383, 0x93981b8b, 0xd1d011c1, 0x82840686, 0xc1c809c9,
            0x60602040, 0x50501040, 0xa3a02383, 0xe3e82bcb, 0x010c0d0d, 0xb2b43686, 0x929c1e8e, 0x434c0f4f,
            0xb3b43787, 0x52581a4a, 0xc2c406c6, 0x70783848, 0xa2a42686, 0x12101202, 0xa3ac2f8f, 0xd1d415c5,
            0x61602141, 0xc3c003c3, 0xb0b43484, 0x41400141, 0x52501242, 0x717c3d4d, 0x818c0d8d, 0x00080808,
            0x131c1f0f, 0x91981989, 0x00000000, 0x11181909, 0x00040404, 0x53501343, 0xf3f437c7, 0xe1e021c1,
            0xf1fc3dcd, 0x72743646, 0x232c2f0f, 0x23242707, 0xb0b03080, 0x83880b8b, 0x020c0e0e, 0xa3a82b8b,
            0xa2a02282, 0x626c2e4e, 0x93901383, 0x414c0d4d, 0x61682949, 0x707c3c4c, 0x01080909, 0x02080a0a,
            0xb3bc3f8f, 0xe3ec2fcf, 0xf3f033c3, 0xc1c405c5, 0x83840787, 0x10141404, 0xf2fc3ece, 0x60642444,
            0xd2dc1ece, 0x222c2e0e, 0x43480b4b, 0x12181a0a, 0x02040606, 0x21202101, 0x63682b4b, 0x62642646,
            0x02000202, 0xf1f435c5, 0x92901282, 0x82880a8a, 0x000c0c0c, 0xb3b03383, 0x727c3e4e, 0xd0d010c0,
            0x72783a4a, 0x43440747, 0x92941686, 0xe1e425c5, 0x22242606, 0x80800080, 0xa1ac2d8d, 0xd3dc1fcf,
            0xa1a02181, 0x30303000, 0x33343707, 0xa2ac2e8e, 0x32343606, 0x11141505, 0x22202202, 0x30383808,
            0xf0f434c4, 0xa3a42787, 0x41440545, 0x404c0c4c, 0x81800181, 0xe1e829c9, 0x80840484, 0x93941787,
            0x31343505, 0xc3c80bcb, 0xc2cc0ece, 0x303c3c0c, 0x71703141, 0x11101101, 0xc3c407c7, 0x81880989,
            0x71743545, 0xf3f83bcb, 0xd2d81aca, 0xf0f838c8, 0x90941484, 0x51581949, 0x82800282, 0xc0c404c4,
            0xf3fc3fcf, 0x41480949, 0x31383909, 0x63642747, 0xc0c000c0, 0xc3cc0fcf, 0xd3d417c7, 0xb0b83888,
            0x030c0f0f, 0x828c0e8e, 0x42400242, 0x23202303, 0x91901181, 0x606c2c4c, 0xd3d81bcb, 0xa0a42484,
            0x30343404, 0xf1f031c1, 0x40480848, 0xc2c002c2, 0x636c2f4f, 0x313c3d0d, 0x212c2d0d, 0x40400040,
            0xb2bc3e8e, 0x323c3e0e, 0xb0bc3c8c, 0xc1c001c1, 0xa2a82a8a, 0xb2b83a8a, 0x424c0e4e, 0x51541545,
            0x33383b0b, 0xd0dc1ccc, 0x60682848, 0x737c3f4f, 0x909c1c8c, 0xd0d818c8, 0x42480a4a, 0x52541646,
            0x73743747, 0xa0a02080, 0xe1ec2dcd, 0x42440646, 0xb1b43585, 0x23282b0b, 0x61642545, 0xf2f83aca,
            0xe3e023c3, 0xb1b83989, 0xb1b03181, 0x939c1f8f, 0x525c1e4e, 0xf1f839c9, 0xe2e426c6, 0xb2b03282,
            0x31303101, 0xe2e82aca, 0x616c2d4d, 0x535c1f4f, 0xe0e424c4, 0xf0f030c0, 0xc1cc0dcd, 0x80880888,
            0x12141606, 0x32383a0a, 0x50581848, 0xd0d414c4, 0x62602242, 0x21282909, 0x03040707, 0x33303303,
            0xe0e828c8, 0x13181b0b, 0x01040505, 0x71783949, 0x90901080, 0x62682a4a, 0x22282a0a, 0x92981a8a
        ],
        //static DWORD SS3[256] = {
        SEED_256_SS3 = [
            0x08303838, 0xc8e0e828, 0x0d212c2d, 0x86a2a426, 0xcfc3cc0f, 0xced2dc1e, 0x83b3b033, 0x88b0b838,
            0x8fa3ac2f, 0x40606020, 0x45515415, 0xc7c3c407, 0x44404404, 0x4f636c2f, 0x4b63682b, 0x4b53581b,
            0xc3c3c003, 0x42626022, 0x03333033, 0x85b1b435, 0x09212829, 0x80a0a020, 0xc2e2e022, 0x87a3a427,
            0xc3d3d013, 0x81919011, 0x01111011, 0x06020406, 0x0c101c1c, 0x8cb0bc3c, 0x06323436, 0x4b43480b,
            0xcfe3ec2f, 0x88808808, 0x4c606c2c, 0x88a0a828, 0x07131417, 0xc4c0c404, 0x06121416, 0xc4f0f434,
            0xc2c2c002, 0x45414405, 0xc1e1e021, 0xc6d2d416, 0x0f333c3f, 0x0d313c3d, 0x8e828c0e, 0x88909818,
            0x08202828, 0x4e424c0e, 0xc6f2f436, 0x0e323c3e, 0x85a1a425, 0xc9f1f839, 0x0d010c0d, 0xcfd3dc1f,
            0xc8d0d818, 0x0b23282b, 0x46626426, 0x4a72783a, 0x07232427, 0x0f232c2f, 0xc1f1f031, 0x42727032,
            0x42424002, 0xc4d0d414, 0x41414001, 0xc0c0c000, 0x43737033, 0x47636427, 0x8ca0ac2c, 0x8b83880b,
            0xc7f3f437, 0x8da1ac2d, 0x80808000, 0x0f131c1f, 0xcac2c80a, 0x0c202c2c, 0x8aa2a82a, 0x04303434,
            0xc2d2d012, 0x0b03080b, 0xcee2ec2e, 0xc9e1e829, 0x4d515c1d, 0x84909414, 0x08101818, 0xc8f0f838,
            0x47535417, 0x8ea2ac2e, 0x08000808, 0xc5c1c405, 0x03131013, 0xcdc1cc0d, 0x86828406, 0x89b1b839,
            0xcff3fc3f, 0x4d717c3d, 0xc1c1c001, 0x01313031, 0xc5f1f435, 0x8a82880a, 0x4a62682a, 0x81b1b031,
            0xc1d1d011, 0x00202020, 0xc7d3d417, 0x02020002, 0x02222022, 0x04000404, 0x48606828, 0x41717031,
            0x07030407, 0xcbd3d81b, 0x8d919c1d, 0x89919819, 0x41616021, 0x8eb2bc3e, 0xc6e2e426, 0x49515819,
            0xcdd1dc1d, 0x41515011, 0x80909010, 0xccd0dc1c, 0x8a92981a, 0x83a3a023, 0x8ba3a82b, 0xc0d0d010,
            0x81818001, 0x0f030c0f, 0x47434407, 0x0a12181a, 0xc3e3e023, 0xcce0ec2c, 0x8d818c0d, 0x8fb3bc3f,
            0x86929416, 0x4b73783b, 0x4c505c1c, 0x82a2a022, 0x81a1a021, 0x43636023, 0x03232023, 0x4d414c0d,
            0xc8c0c808, 0x8e929c1e, 0x8c909c1c, 0x0a32383a, 0x0c000c0c, 0x0e222c2e, 0x8ab2b83a, 0x4e626c2e,
            0x8f939c1f, 0x4a52581a, 0xc2f2f032, 0x82929012, 0xc3f3f033, 0x49414809, 0x48707838, 0xccc0cc0c,
            0x05111415, 0xcbf3f83b, 0x40707030, 0x45717435, 0x4f737c3f, 0x05313435, 0x00101010, 0x03030003,
            0x44606424, 0x4d616c2d, 0xc6c2c406, 0x44707434, 0xc5d1d415, 0x84b0b434, 0xcae2e82a, 0x09010809,
            0x46727436, 0x09111819, 0xcef2fc3e, 0x40404000, 0x02121012, 0xc0e0e020, 0x8db1bc3d, 0x05010405,
            0xcaf2f83a, 0x01010001, 0xc0f0f030, 0x0a22282a, 0x4e525c1e, 0x89a1a829, 0x46525416, 0x43434003,
            0x85818405, 0x04101414, 0x89818809, 0x8b93981b, 0x80b0b030, 0xc5e1e425, 0x48404808, 0x49717839,
            0x87939417, 0xccf0fc3c, 0x0e121c1e, 0x82828002, 0x01212021, 0x8c808c0c, 0x0b13181b, 0x4f535c1f,
            0x47737437, 0x44505414, 0x82b2b032, 0x0d111c1d, 0x05212425, 0x4f434c0f, 0x00000000, 0x46424406,
            0xcde1ec2d, 0x48505818, 0x42525012, 0xcbe3e82b, 0x4e727c3e, 0xcad2d81a, 0xc9c1c809, 0xcdf1fc3d,
            0x00303030, 0x85919415, 0x45616425, 0x0c303c3c, 0x86b2b436, 0xc4e0e424, 0x8bb3b83b, 0x4c707c3c,
            0x0e020c0e, 0x40505010, 0x09313839, 0x06222426, 0x02323032, 0x84808404, 0x49616829, 0x83939013,
            0x07333437, 0xc7e3e427, 0x04202424, 0x84a0a424, 0xcbc3c80b, 0x43535013, 0x0a02080a, 0x87838407,
            0xc9d1d819, 0x4c404c0c, 0x83838003, 0x8f838c0f, 0xcec2cc0e, 0x0b33383b, 0x4a42480a, 0x87b3b437
        ],
            
        t = m.algo.SEED256 = d.extend({
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
               R = EncKeySetup(key, roundKey);
               this._roundKeys = {rk:roundKey, R:R};
            },

            encryptBlock: function(c, d) {
                seed256EncryptBlock(c, d, this._roundKeys)
            },

            decryptBlock: function(c, d) {
                seed256DecryptBlock(c, d, this._roundKeys)
            },

            keySize: 4,
            ivSize: 4,
            blockSize: 4
        });
    m.SEED256 = d._createHelper(t)
})();

var SEED_256 = function() {
    //TODO:
}

SEED_256.prototype.enc = function (userKey, char, userIV){
    console.log("SEED_256.enc::plain:[" + char + "]");
    console.log("userKey:[" + userKey + "]");
    console.log("userIV:[" + userIV + "]");
    
    var arrKey = CryptoJS.enc.Hex.parse(userKey);
    var arrIV  = CryptoJS.enc.Hex.parse(userIV);
    var encrypted = CryptoJS.SEED256.encrypt(char, arrKey, { iv: arrIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
    console.log("encrypted:[" + encrypted + "]")
    return encrypted;
}

SEED_256.prototype.dec = function (userKey, char, userIV){
    console.log("SEED_256.dec:::char[" + char + "]");
    console.log("userKey:[" + userKey + "]");
    console.log("userIV:[" + userIV + "]");
    
    var arrKey = CryptoJS.enc.Hex.parse(userKey);
    var arrIV  = CryptoJS.enc.Hex.parse(userIV);
    var decrypted = CryptoJS.SEED256.decrypt(char, arrKey, { iv: arrIV, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
    console.log("decrypted:[" + decrypted + "]")
    return decrypted;
}
