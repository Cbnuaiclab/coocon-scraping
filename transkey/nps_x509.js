function _asnhex_getByteLengthOfL_AtObj(s, a) {
    if (s.substring(a + 2, a + 3) != '8')
        return 1;
    var i = parseInt(s.substring(a + 3, a + 4));
    if (i == 0)
        return -1;
    if (0 < i && i < 10)
        return i + 1;
    return -2
}

function _asnhex_getHexOfL_AtObj(s, a) {
    var b = _asnhex_getByteLengthOfL_AtObj(s, a);
    if (b < 1)
        return '';
    return s.substring(a + 2, a + 2 + b * 2)
}

function _asnhex_getIntOfL_AtObj(s, a) {
    
    var b = _asnhex_getHexOfL_AtObj(s, a);
    if (b == '')
        return -1;
    var c;
    if (parseInt(b.substring(0, 1)) < 8) {
        c = parseBigInt(b, 16)
    } else {
        c = parseBigInt(b.substring(2), 16)
    }
    return c.intValue()
}

function _asnhex_getStartPosOfV_AtObj(s, a) {
    var b = _asnhex_getByteLengthOfL_AtObj(s, a);
    if (b < 0)
        return b;
    return a + (b + 1) * 2
}

function _asnhex_getHexOfV_AtObj(s, a) {
    var b = _asnhex_getStartPosOfV_AtObj(s, a);
    var c = _asnhex_getIntOfL_AtObj(s, a);
    return s.substring(b, b + c * 2)
}

function _asnhex_getHexOfTLV_AtObj(s, a) {
    var b = s.substr(a, 2);
    var c = _asnhex_getHexOfL_AtObj(s, a);
    var d = _asnhex_getHexOfV_AtObj(s, a);
    return b + c + d
}

function _asnhex_getPosOfNextSibling_AtObj(s, a) {
    var b = _asnhex_getStartPosOfV_AtObj(s, a);
    var c = _asnhex_getIntOfL_AtObj(s, a);
    return b + c * 2
}

function _asnhex_getPosArrayOfChildren_AtObj(h, b) {
    var a = new Array();
    var c = _asnhex_getStartPosOfV_AtObj(h, b);
    
    a.push(c);
    
    
    var d = _asnhex_getIntOfL_AtObj(h, b);
    var p = c;
    var k = 0;
    while (1) {
        var e = _asnhex_getPosOfNextSibling_AtObj(h, p);
        if (e == null || (e - c >= (d * 2)))
            break;
        if (k >= 200)
            break;
        a.push(e);
        p = e;
        k++
    }
    d;
    p;
    k;
    return a
}

function _asnhex_getNthChildIndex_AtObj(h, b, c) {
    var a = _asnhex_getPosArrayOfChildren_AtObj(h, b);
    return a[c]
}

function _asnhex_getDecendantIndexByNthList(h, b, c) {
    if (c.length == 0) {
        return b
    }
    var d = c.shift();
    var a = _asnhex_getPosArrayOfChildren_AtObj(h, b);
    return _asnhex_getDecendantIndexByNthList(h, a[d], c)
}

function _asnhex_getDecendantHexTLVByNthList(h, a, b) {
    var c = _asnhex_getDecendantIndexByNthList(h, a, b);
    return _asnhex_getHexOfTLV_AtObj(h, c)
}

function _asnhex_getDecendantHexVByNthList(h, a, b) {
    var c = _asnhex_getDecendantIndexByNthList(h, a, b);
    return _asnhex_getHexOfV_AtObj(h, c)
}

function ASN1HEX() {
    return ASN1HEX
}

ASN1HEX.getByteLengthOfL_AtObj = _asnhex_getByteLengthOfL_AtObj;
ASN1HEX.getHexOfL_AtObj = _asnhex_getHexOfL_AtObj;
ASN1HEX.getIntOfL_AtObj = _asnhex_getIntOfL_AtObj;
ASN1HEX.getStartPosOfV_AtObj = _asnhex_getStartPosOfV_AtObj;
ASN1HEX.getHexOfV_AtObj = _asnhex_getHexOfV_AtObj;
ASN1HEX.getHexOfTLV_AtObj = _asnhex_getHexOfTLV_AtObj;
ASN1HEX.getPosOfNextSibling_AtObj = _asnhex_getPosOfNextSibling_AtObj;
ASN1HEX.getPosArrayOfChildren_AtObj = _asnhex_getPosArrayOfChildren_AtObj;
ASN1HEX.getNthChildIndex_AtObj = _asnhex_getNthChildIndex_AtObj;
ASN1HEX.getDecendantIndexByNthList = _asnhex_getDecendantIndexByNthList;
ASN1HEX.getDecendantHexVByNthList = _asnhex_getDecendantHexVByNthList;
ASN1HEX.getDecendantHexTLVByNthList = _asnhex_getDecendantHexTLVByNthList;
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";

function hex2b64(h) {
    var i;
    var c;
    var a = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        a += b64map.charAt(c >> 6) + b64map.charAt(c & 63)
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        a += b64map.charAt(c << 2)
    } else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        a += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4)
    }
    while ((a.length & 3) > 0)
        a += b64pad;
    return a
}

function b64tohex(s) {
    var a = "";
    var i;
    var k = 0;
    var b = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad)
            break;
        v = b64map.indexOf(s.charAt(i));
        if (v < 0)
            continue;
        if (k == 0) {
            a += int2char(v >> 2);
            b = v & 3;
            k = 1
        } else if (k == 1) {
            a += int2char((b << 2) | (v >> 4));
            b = v & 0xf;
            k = 2
        } else if (k == 2) {
            a += int2char(b);
            a += int2char(v >> 2);
            b = v & 3;
            k = 3
        } else {
            a += int2char((b << 2) | (v >> 4));
            a += int2char(v & 0xf);
            k = 0
        }
    }
    if (k == 1)
        a += int2char(b << 2);
    return a
}

function b64toBA(s) {
    var h = b64tohex(s);
    var i;
    var a = new Array();
    for (i = 0; 2 * i < h.length; ++i) {
        a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16)
    }
    return a
}

function ECFieldElementFp(q, x) {
    this.x = x;
    this.q = q
}

function feFpEquals(a) {
    if (a == this)
        return true;
    return (this.q.equals(a.q) && this.x.equals(a.x))
}

function feFpToBigInteger() {
    return this.x
}

function feFpNegate() {
    return new ECFieldElementFp(this.q, this.x.negate().mod(this.q))
}

function feFpAdd(b) {
    return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q))
}

function feFpSubtract(b) {
    return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q))
}

function feFpMultiply(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q))
}

function feFpSquare() {
    return new ECFieldElementFp(this.q, this.x.square().mod(this.q))
}

function feFpDivide(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q))
}

ECFieldElementFp.prototype.equals = feFpEquals;
ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
ECFieldElementFp.prototype.negate = feFpNegate;
ECFieldElementFp.prototype.add = feFpAdd;
ECFieldElementFp.prototype.subtract = feFpSubtract;
ECFieldElementFp.prototype.multiply = feFpMultiply;
ECFieldElementFp.prototype.square = feFpSquare;
ECFieldElementFp.prototype.divide = feFpDivide;

function ECPointFp(a, x, y, z) {
    this.curve = a;
    this.x = x;
    this.y = y;
    if (z == null) {
        this.z = BigInteger.ONE
    } else {
        this.z = z
    }
    this.zinv = null
}

function pointFpGetX() {
    if (this.zinv == null) {
        this.zinv = this.z.modInverse(this.curve.q)
    }
    return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))
}

function pointFpGetY() {
    if (this.zinv == null) {
        this.zinv = this.z.modInverse(this.curve.q)
    }
    return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))
}

function pointFpEquals(a) {
    if (a == this)
        return true;
    if (this.isInfinity())
        return a.isInfinity();
    if (a.isInfinity())
        return this.isInfinity();
    var u, v;
    u = a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q);
    if (!u.equals(BigInteger.ZERO))
        return false;
    v = a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q);
    return v.equals(BigInteger.ZERO)
}

function pointFpIsInfinity() {
    if ((this.x == null) && (this.y == null))
        return true;
    return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO)
}

function pointFpNegate() {
    return new ECPointFp(this.curve, this.x, this.y.negate(), this.z)
}

function pointFpAdd(b) {
    if (this.isInfinity())
        return b;
    if (b.isInfinity())
        return this;
    var u = b.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(b.z)).mod(this.curve.q);
    var v = b.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(b.z)).mod(this.curve.q);
    if (BigInteger.ZERO.equals(v)) {
        if (BigInteger.ZERO.equals(u)) {
            return this.twice()
        }
        return this.curve.getInfinity()
    }
    var a = new BigInteger("3");
    var c = this.x.toBigInteger();
    var d = this.y.toBigInteger();
    var e = v.square();
    var f = e.multiply(v);
    var g = c.multiply(e);
    var h = u.square().multiply(this.z);
    var i = h.subtract(g.shiftLeft(1)).multiply(b.z).subtract(f).multiply(v).mod(this.curve.q);
    var j = g.multiply(a).multiply(u).subtract(d.multiply(f)).subtract(h.multiply(u)).multiply(b.z).add(u.multiply(f)).mod(this.curve.q);
    var k = f.multiply(this.z).multiply(b.z).mod(this.curve.q);
    return new ECPointFp(this.curve, this.curve.fromBigInteger(i), this.curve.fromBigInteger(j), k)
}

function pointFpTwice() {
    if (this.isInfinity())
        return this;
    if (this.y.toBigInteger().signum() == 0)
        return this.curve.getInfinity();
    var b = new BigInteger("3");
    var c = this.x.toBigInteger();
    var d = this.y.toBigInteger();
    var e = d.multiply(this.z);
    var f = e.multiply(d).mod(this.curve.q);
    var a = this.curve.a.toBigInteger();
    var w = c.square().multiply(b);
    if (!BigInteger.ZERO.equals(a)) {
        w = w.add(this.z.square().multiply(a))
    }
    w = w.mod(this.curve.q);
    var g = w.square().subtract(c.shiftLeft(3).multiply(f)).shiftLeft(1).multiply(e).mod(this.curve.q);
    var h = w.multiply(b).multiply(c).subtract(f.shiftLeft(1)).shiftLeft(2).multiply(f).subtract(w.square().multiply(w)).mod(this.curve.q);
    var i = e.square().multiply(e).shiftLeft(3).mod(this.curve.q);
    return new ECPointFp(this.curve, this.curve.fromBigInteger(g), this.curve.fromBigInteger(h), i)
}

function pointFpMultiply(k) {
    if (this.isInfinity())
        return this;
    if (k.signum() == 0)
        return this.curve.getInfinity();
    var e = k;
    var h = e.multiply(new BigInteger("3"));
    var a = this.negate();
    var R = this;
    var i;
    for (i = h.bitLength() - 2; i > 0; --i) {
        R = R.twice();
        var b = h.testBit(i);
        var c = e.testBit(i);
        if (b != c) {
            R = R.add(b ? this : a)
        }
    }
    return R
}

function pointFpMultiplyTwo(j, x, k) {
    var i;
    if (j.bitLength() > k.bitLength())
        i = j.bitLength() - 1;
    else
        i = k.bitLength() - 1;
    var R = this.curve.getInfinity();
    var a = this.add(x);
    while (i >= 0) {
        R = R.twice();
        if (j.testBit(i)) {
            if (k.testBit(i)) {
                R = R.add(a)
            } else {
                R = R.add(this)
            }
        } else {
            if (k.testBit(i)) {
                R = R.add(x)
            }
        }
        --i
    }
    return R
}

ECPointFp.prototype.getX = pointFpGetX;
ECPointFp.prototype.getY = pointFpGetY;
ECPointFp.prototype.equals = pointFpEquals;
ECPointFp.prototype.isInfinity = pointFpIsInfinity;
ECPointFp.prototype.negate = pointFpNegate;
ECPointFp.prototype.add = pointFpAdd;
ECPointFp.prototype.twice = pointFpTwice;
ECPointFp.prototype.multiply = pointFpMultiply;
ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;

function ECCurveFp(q, a, b) {
    this.q = q;
    this.a = this.fromBigInteger(a);
    this.b = this.fromBigInteger(b);
    this.infinity = new ECPointFp(this, null, null)
}

function curveFpGetQ() {
    return this.q
}

function curveFpGetA() {
    return this.a
}

function curveFpGetB() {
    return this.b
}

function curveFpEquals(a) {
    if (a == this)
        return true;
    return (this.q.equals(a.q) && this.a.equals(a.a) && this.b.equals(a.b))
}

function curveFpGetInfinity() {
    return this.infinity
}

function curveFpFromBigInteger(x) {
    return new ECFieldElementFp(this.q, x)
}

function curveFpDecodePointHex(s) {
    switch (parseInt(s.substr(0, 2), 16)) {
        case 0:
            return this.infinity;
        case 2:
        case 3:
            return null;
        case 4:
        case 6:
        case 7:
            var a = (s.length - 2) / 2;
            var b = s.substr(2, a);
            var c = s.substr(a + 2, a);
            return new ECPointFp(this, this.fromBigInteger(new BigInteger(b, 16)), this.fromBigInteger(new BigInteger(c, 16)));
        default:
            return null
    }
}

ECCurveFp.prototype.getQ = curveFpGetQ;
ECCurveFp.prototype.getA = curveFpGetA;
ECCurveFp.prototype.getB = curveFpGetB;
ECCurveFp.prototype.equals = curveFpEquals;
ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

function BigInteger(a, b, c) {
    if (a != null)
        if ("number" == typeof a)
            this.fromNumber(a, b, c);
        else if (b == null && "string" != typeof a)
            this.fromString(a, 256);
        else
            this.fromString(a, b)
}

function nbi() {
    return new BigInteger(null)
}

function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 0x4000000);
        w[j++] = v & 0x3ffffff
    }
    return c
}

function am2(i, x, w, j, c, n) {
    var a = x & 0x7fff
        , xh = x >> 15;
    while (--n >= 0) {
        var l = this[i] & 0x7fff;
        var h = this[i++] >> 15;
        var m = xh * l + h * a;
        l = a * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w[j++] = l & 0x3fffffff
    }
    return c
}

function am3(i, x, w, j, c, n) {
    var a = x & 0x3fff
        , xh = x >> 14;
    while (--n >= 0) {
        var l = this[i] & 0x3fff;
        var h = this[i++] >> 14;
        var m = xh * l + h * a;
        l = a * l + ((m & 0x3fff) << 14) + w[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w[j++] = l & 0xfffffff
    }
    return c
}

//if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
BigInteger.prototype.am = am2;
dbits = 30
//} else if (j_lm && (navigator.appName != "Netscape")) {
//    BigInteger.prototype.am = am1;
//    dbits = 26
//} else {
//    BigInteger.prototype.am = am3;
//    dbits = 28
//}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv)
    BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;

function int2char(n) {
    return BI_RM.charAt(n)
}

function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c
}

function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i)
        r[i] = this[i];
    r.t = this.t;
    r.s = this.s
}

function bnpFromInt(x) {
    this.t = 1;
    this.s = (x < 0) ? -1 : 0;
    if (x > 0)
        this[0] = x;
    else if (x < -1)
        this[0] = x + DV;
    else
        this.t = 0
}

function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r
}

function bnpFromString(s, b) {
    var k;
    if (b == 16)
        k = 4;
    else if (b == 8)
        k = 3;
    else if (b == 256)
        k = 8;
    else if (b == 2)
        k = 1;
    else if (b == 32)
        k = 5;
    else if (b == 4)
        k = 2;
    else {
        this.fromRadix(s, b);
        return
    }
    this.t = 0;
    this.s = 0;
    var i = s.length
        , mi = false
        , sh = 0;
    while (--i >= 0) {
        var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-")
                mi = true;
            continue
        }
        mi = false;
        if (sh == 0)
            this[this.t++] = x;
        else if (sh + k > this.DB) {
            this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
            this[this.t++] = (x >> (this.DB - sh))
        } else
            this[this.t - 1] |= x << sh;
        sh += k;
        if (sh >= this.DB)
            sh -= this.DB
    }
    if (k == 8 && (s[0] & 0x80) != 0) {
        this.s = -1;
        if (sh > 0)
            this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh
    }
    this.clamp();
    if (mi)
        BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c)
        --this.t
}

function bnToString(b) {
    if (this.s < 0)
        return "-" + this.negate().toString(b);
    var k;
    if (b == 16)
        k = 4;
    else if (b == 8)
        k = 3;
    else if (b == 2)
        k = 1;
    else if (b == 32)
        k = 5;
    else if (b == 4)
        k = 2;
    else
        return this.toRadix(b);
    var a = (1 << k) - 1, d, m = false, r = "", i = this.t;
    var p = this.DB - (i * this.DB) % k;
    if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) > 0) {
            m = true;
            r = int2char(d)
        }
        while (i >= 0) {
            if (p < k) {
                d = (this[i] & ((1 << p) - 1)) << (k - p);
                d |= this[--i] >> (p += this.DB - k)
            } else {
                d = (this[i] >> (p -= k)) & a;
                if (p <= 0) {
                    p += this.DB;
                    --i
                }
            }
            if (d > 0)
                m = true;
            if (m)
                r += int2char(d)
        }
    }
    return m ? r : "0"
}

function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r
}

function bnAbs() {
    return (this.s < 0) ? this.negate() : this
}

function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0)
        return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0)
        return (this.s < 0) ? -r : r;
    while (--i >= 0)
        if ((r = this[i] - a[i]) != 0)
            return r;
    return 0
}

function nbits(x) {
    var r = 1, t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1
    }
    return r
}

function bnBitLength() {
    if (this.t <= 0)
        return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM))
}

function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i)
        r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i)
        r[i] = 0;
    r.t = this.t + n;
    r.s = this.s
}

function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i)
        r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s
}

function bnpLShiftTo(n, r) {
    var a = n % this.DB;
    var b = this.DB - a;
    var d = (1 << b) - 1;
    var e = Math.floor(n / this.DB), c = (this.s << a) & this.DM, i;
    for (i = this.t - 1; i >= 0; --i) {
        r[i + e + 1] = (this[i] >> b) | c;
        c = (this[i] & d) << a
    }
    for (i = e - 1; i >= 0; --i)
        r[i] = 0;
    r[e] = c;
    r.t = this.t + e + 1;
    r.s = this.s;
    r.clamp()
}

function bnpRShiftTo(n, r) {
    r.s = this.s;
    var a = Math.floor(n / this.DB);
    if (a >= this.t) {
        r.t = 0;
        return
    }
    var b = n % this.DB;
    var c = this.DB - b;
    var d = (1 << b) - 1;
    r[0] = this[a] >> b;
    for (var i = a + 1; i < this.t; ++i) {
        r[i - a - 1] |= (this[i] & d) << c;
        r[i - a] = this[i] >> b
    }
    if (b > 0)
        r[this.t - a - 1] |= (this.s & d) << c;
    r.t = this.t - a;
    r.clamp()
}

function bnpSubTo(a, r) {
    var i = 0
        , c = 0
        , m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] - a[i];
        r[i++] = c & this.DM;
        c >>= this.DB
    }
    if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c += this.s
    } else {
        c += this.s;
        while (i < a.t) {
            c -= a[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c -= a.s
    }
    r.s = (c < 0) ? -1 : 0;
    if (c < -1)
        r[i++] = this.DV + c;
    else if (c > 0)
        r[i++] = c;
    r.t = i;
    r.clamp()
}

function bnpMultiplyTo(a, r) {
    var x = this.abs()
        , y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0)
        r[i] = 0;
    for (i = 0; i < y.t; ++i)
        r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s)
        BigInteger.ZERO.subTo(r, r)
}

function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0)
        r[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x[i], r, 2 * i, 0, 1);
        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
            r[i + x.t] -= x.DV;
            r[i + x.t + 1] = 1
        }
    }
    if (r.t > 0)
        r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp()
}

function bnpDivRemTo(m, q, r) {
    var a = m.abs();
    if (a.t <= 0)
        return;
    var b = this.abs();
    if (b.t < a.t) {
        if (q != null)
            q.fromInt(0);
        if (r != null)
            this.copyTo(r);
        return
    }
    if (r == null)
        r = nbi();
    var y = nbi()
        , ts = this.s
        , ms = m.s;
    var c = this.DB - nbits(a[a.t - 1]);
    if (c > 0) {
        a.lShiftTo(c, y);
        b.lShiftTo(c, r)
    } else {
        a.copyTo(y);
        b.copyTo(r)
    }
    var d = y.t;
    var f = y[d - 1];
    if (f == 0)
        return;
    var g = f * (1 << this.F1) + ((d > 1) ? y[d - 2] >> this.F2 : 0);
    var h = this.FV / g
        , d2 = (1 << this.F1) / g
        , e = 1 << this.F2;
    var i = r.t
        , j = i - d
        , t = (q == null) ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r)
    }
    BigInteger.ONE.dlShiftTo(d, t);
    t.subTo(y, y);
    while (y.t < d)
        y[y.t++] = 0;
    while (--j >= 0) {
        var k = (r[--i] == f) ? this.DM : Math.floor(r[i] * h + (r[i - 1] + e) * d2);
        if ((r[i] += y.am(0, k, r, j, 0, d)) < k) {
            y.dlShiftTo(j, t);
            r.subTo(t, r);
            while (r[i] < --k)
                r.subTo(t, r)
        }
    }
    if (q != null) {
        r.drShiftTo(d, q);
        if (ts != ms)
            BigInteger.ZERO.subTo(q, q)
    }
    r.t = d;
    r.clamp();
    if (c > 0)
        r.rShiftTo(c, r);
    if (ts < 0)
        BigInteger.ZERO.subTo(r, r)
}

function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        a.subTo(r, r);
    return r
}

function Classic(m) {
    this.m = m
}

function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0)
        return x.mod(this.m);
    else
        return x
}

function cRevert(x) {
    return x
}

function cReduce(x) {
    x.divRemTo(this.m, null, x)
}

function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r)
}

function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r)
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
    if (this.t < 1)
        return 0;
    var x = this[0];
    if ((x & 1) == 0)
        return 0;
    var y = x & 3;
    y = (y * (2 - (x & 0xf) * y)) & 0xf;
    y = (y * (2 - (x & 0xff) * y)) & 0xff;
    y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
    y = (y * (2 - x * y % this.DV)) % this.DV;
    return (y > 0) ? this.DV - y : -y
}

function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << (m.DB - 15)) - 1;
    this.mt2 = 2 * m.t
}

function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        this.m.subTo(r, r);
    return r
}

function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r
}

function montReduce(x) {
    while (x.t <= this.mt2)
        x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
        var j = x[i] & 0x7fff;
        var a = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
        j = i + this.m.t;
        x[j] += this.m.am(0, a, x, i, 0, this.m.t);
        while (x[j] >= x.DV) {
            x[j] -= x.DV;
            x[++j]++
        }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x)
}

function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r)
}

function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r)
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
    return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
}

function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1)
        return BigInteger.ONE;
    var r = nbi()
        , r2 = nbi()
        , g = z.convert(this)
        , i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & (1 << i)) > 0)
            z.mulTo(r2, g, r);
        else {
            var t = r;
            r = r2;
            r2 = t
        }
    }
    return z.revert(r)
}

function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven())
        z = new Classic(m);
    else
        z = new Montgomery(m);
    return this.exp(e, z)
}

BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r
}

function bnIntValue() {
    if (this.s < 0) {
        if (this.t == 1)
            return this[0] - this.DV;
        else if (this.t == 0)
            return -1
    } else if (this.t == 1)
        return this[0];
    else if (this.t == 0)
        return 0;
    return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
}

function bnByteValue() {
    return (this.t == 0) ? this.s : (this[0] << 24) >> 24
}

function bnShortValue() {
    return (this.t == 0) ? this.s : (this[0] << 16) >> 16
}

function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r))
}

function bnSigNum() {
    if (this.s < 0)
        return -1;
    else if (this.t <= 0 || (this.t == 1 && this[0] <= 0))
        return 0;
    else
        return 1
}

function bnpToRadix(b) {
    if (b == null)
        b = 10;
    if (this.signum() == 0 || b < 2 || b > 36)
        return "0";
    var c = this.chunkSize(b);
    var a = Math.pow(b, c);
    var d = nbv(a)
        , y = nbi()
        , z = nbi()
        , r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z)
    }
    return z.intValue().toString(b) + r
}

function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null)
        b = 10;
    var a = this.chunkSize(b);
    var d = Math.pow(b, a)
        , mi = false
        , j = 0
        , w = 0;
    for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-" && this.signum() == 0)
                mi = true;
            continue
        }
        w = b * w + x;
        if (++j >= a) {
            this.dMultiply(d);
            this.dAddOffset(w, 0);
            j = 0;
            w = 0
        }
    }
    if (j > 0) {
        this.dMultiply(Math.pow(b, j));
        this.dAddOffset(w, 0)
    }
    if (mi)
        BigInteger.ZERO.subTo(this, this)
}

function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) {
        if (a < 2)
            this.fromInt(1);
        else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1))
                this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
            if (this.isEven())
                this.dAddOffset(1, 0);
            while (!this.isProbablePrime(b)) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > a)
                    this.subTo(BigInteger.ONE.shiftLeft(a - 1), this)
            }
        }
    } else {
        var x = new Array()
            , t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0)
            x[0] &= ((1 << t) - 1);
        else
            x[0] = 0;
        this.fromString(x, 256)
    }
}

function bnToByteArray() {
    var i = this.t
        , r = new Array();
    r[0] = this.s;
    var p = this.DB - (i * this.DB) % 8, d, k = 0;
    if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
            r[k++] = d | (this.s << (this.DB - p));
        while (i >= 0) {
            if (p < 8) {
                d = (this[i] & ((1 << p) - 1)) << (8 - p);
                d |= this[--i] >> (p += this.DB - 8)
            } else {
                d = (this[i] >> (p -= 8)) & 0xff;
                if (p <= 0) {
                    p += this.DB;
                    --i
                }
            }
            if ((d & 0x80) != 0)
                d |= -256;
            if (k == 0 && (this.s & 0x80) != (d & 0x80))
                ++k;
            if (k > 0 || d != this.s)
                r[k++] = d
        }
    }
    return r
}

function bnEquals(a) {
    return (this.compareTo(a) == 0)
}

function bnMin(a) {
    return (this.compareTo(a) < 0) ? this : a
}

function bnMax(a) {
    return (this.compareTo(a) > 0) ? this : a
}

function bnpBitwiseTo(a, b, r) {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i)
        r[i] = b(this[i], a[i]);
    if (a.t < this.t) {
        f = a.s & this.DM;
        for (i = m; i < this.t; ++i)
            r[i] = b(this[i], f);
        r.t = this.t
    } else {
        f = this.s & this.DM;
        for (i = m; i < a.t; ++i)
            r[i] = b(f, a[i]);
        r.t = a.t
    }
    r.s = b(this.s, a.s);
    r.clamp()
}

function op_and(x, y) {
    return x & y
}

function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r
}

function op_or(x, y) {
    return x | y
}

function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r
}

function op_xor(x, y) {
    return x ^ y
}

function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r
}

function op_andnot(x, y) {
    return x & ~y
}

function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r
}

function bnNot() {
    var r = nbi();
    for (var i = 0; i < this.t; ++i)
        r[i] = this.DM & ~this[i];
    r.t = this.t;
    r.s = ~this.s;
    return r
}

function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0)
        this.rShiftTo(-n, r);
    else
        this.lShiftTo(n, r);
    return r
}

function bnShiftRight(n) {
    var r = nbi();
    if (n < 0)
        this.lShiftTo(-n, r);
    else
        this.rShiftTo(n, r);
    return r
}

function lbit(x) {
    if (x == 0)
        return -1;
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2
    }
    if ((x & 1) == 0)
        ++r;
    return r
}

function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i)
        if (this[i] != 0)
            return i * this.DB + lbit(this[i]);
    if (this.s < 0)
        return this.t * this.DB;
    return -1
}

function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r
    }
    return r
}

function bnBitCount() {
    var r = 0
        , x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i)
        r += cbit(this[i] ^ x);
    return r
}

function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t)
        return (this.s != 0);
    return ((this[j] & (1 << (n % this.DB))) != 0)
}

function bnpChangeBit(n, a) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, a, r);
    return r
}

function bnSetBit(n) {
    return this.changeBit(n, op_or)
}

function bnClearBit(n) {
    return this.changeBit(n, op_andnot)
}

function bnFlipBit(n) {
    return this.changeBit(n, op_xor)
}

function bnpAddTo(a, r) {
    var i = 0
        , c = 0
        , m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] + a[i];
        r[i++] = c & this.DM;
        c >>= this.DB
    }
    if (a.t < this.t) {
        c += a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c += this.s
    } else {
        c += this.s;
        while (i < a.t) {
            c += a[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c += a.s
    }
    r.s = (c < 0) ? -1 : 0;
    if (c > 0)
        r[i++] = c;
    else if (c < -1)
        r[i++] = this.DV + c;
    r.t = i;
    r.clamp()
}

function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r
}

function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r
}

function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r
}

function bnSquare() {
    var r = nbi();
    this.squareTo(r);
    return r
}

function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r
}

function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r
}

function bnDivideAndRemainder(a) {
    var q = nbi()
        , r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r)
}

function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp()
}

function bnpDAddOffset(n, w) {
    if (n == 0)
        return;
    while (this.t <= w)
        this[this.t++] = 0;
    this[w] += n;
    while (this[w] >= this.DV) {
        this[w] -= this.DV;
        if (++w >= this.t)
            this[this.t++] = 0;
        ++this[w]
    }
}

function NullExp() {
}

function nNop(x) {
    return x
}

function nMulTo(x, y, r) {
    x.multiplyTo(y, r)
}

function nSqrTo(x, r) {
    x.squareTo(r)
}

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow(e) {
    return this.exp(e, new NullExp())
}

function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0;
    r.t = i;
    while (i > 0)
        r[--i] = 0;
    var j;
    for (j = r.t - this.t; i < j; ++i)
        r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n); i < j; ++i)
        this.am(0, a[i], r, i, 0, n - i);
    r.clamp()
}

function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0;
    while (--i >= 0)
        r[i] = 0;
    for (i = Math.max(n - this.t, 0); i < a.t; ++i)
        r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r)
}

function Barrett(m) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m
}

function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t)
        return x.mod(this.m);
    else if (x.compareTo(this.m) < 0)
        return x;
    else {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r
    }
}

function barrettRevert(x) {
    return x
}

function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp()
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0)
        x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x)
}

function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r)
}

function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r)
}

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow(e, m) {
    var i = e.bitLength(), k, r = nbv(1), z;
    if (i <= 0)
        return r;
    else if (i < 18)
        k = 1;
    else if (i < 48)
        k = 3;
    else if (i < 144)
        k = 4;
    else if (i < 768)
        k = 5;
    else
        k = 6;
    if (i < 8)
        z = new Classic(m);
    else if (m.isEven())
        z = new Barrett(m);
    else
        z = new Montgomery(m);
    var g = new Array()
        , n = 3
        , k1 = k - 1
        , km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
        var a = nbi();
        z.sqrTo(g[1], a);
        while (n <= km) {
            g[n] = nbi();
            z.mulTo(a, g[n - 2], g[n]);
            n += 2
        }
    }
    var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
    i = nbits(e[j]) - 1;
    while (j >= 0) {
        if (i >= k1)
            w = (e[j] >> (i - k1)) & km;
        else {
            w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
            if (j > 0)
                w |= e[j - 1] >> (this.DB + i - k1)
        }
        n = k;
        while ((w & 1) == 0) {
            w >>= 1;
            --n
        }
        if ((i -= n) < 0) {
            i += this.DB;
            --j
        }
        if (is1) {
            g[w].copyTo(r);
            is1 = false
        } else {
            while (n > 1) {
                z.sqrTo(r, r2);
                z.sqrTo(r2, r);
                n -= 2
            }
            if (n > 0)
                z.sqrTo(r, r2);
            else {
                t = r;
                r = r2;
                r2 = t
            }
            z.mulTo(r2, g[w], r)
        }
        while (j >= 0 && (e[j] & (1 << i)) == 0) {
            z.sqrTo(r, r2);
            t = r;
            r = r2;
            r2 = t;
            if (--i < 0) {
                i = this.DB - 1;
                --j
            }
        }
    }
    return z.revert(r)
}

function bnGCD(a) {
    var x = (this.s < 0) ? this.negate() : this.clone();
    var y = (a.s < 0) ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t
    }
    var i = x.getLowestSetBit()
        , g = y.getLowestSetBit();
    if (g < 0)
        return x;
    if (i < g)
        g = i;
    if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y)
    }
    while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0)
            x.rShiftTo(i, x);
        if ((i = y.getLowestSetBit()) > 0)
            y.rShiftTo(i, y);
        if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x)
        } else {
            y.subTo(x, y);
            y.rShiftTo(1, y)
        }
    }
    if (g > 0)
        y.lShiftTo(g, y);
    return y
}

function bnpModInt(n) {
    if (n <= 0)
        return 0;
    var d = this.DV % n
        , r = (this.s < 0) ? n - 1 : 0;
    if (this.t > 0)
        if (d == 0)
            r = this[0] % n;
        else
            for (var i = this.t - 1; i >= 0; --i)
                r = (d * r + this[i]) % n;
    return r
}

function bnModInverse(m) {
    var e = m.isEven();
    if ((this.isEven() && e) || m.signum() == 0)
        return BigInteger.ZERO;
    var u = m.clone()
        , v = this.clone();
    var a = nbv(1)
        , b = nbv(0)
        , c = nbv(0)
        , d = nbv(1);
    while (u.signum() != 0) {
        while (u.isEven()) {
            u.rShiftTo(1, u);
            if (e) {
                if (!a.isEven() || !b.isEven()) {
                    a.addTo(this, a);
                    b.subTo(m, b)
                }
                a.rShiftTo(1, a)
            } else if (!b.isEven())
                b.subTo(m, b);
            b.rShiftTo(1, b)
        }
        while (v.isEven()) {
            v.rShiftTo(1, v);
            if (e) {
                if (!c.isEven() || !d.isEven()) {
                    c.addTo(this, c);
                    d.subTo(m, d)
                }
                c.rShiftTo(1, c)
            } else if (!d.isEven())
                d.subTo(m, d);
            d.rShiftTo(1, d)
        }
        if (u.compareTo(v) >= 0) {
            u.subTo(v, u);
            if (e)
                a.subTo(c, a);
            b.subTo(d, b)
        } else {
            v.subTo(u, v);
            if (e)
                c.subTo(a, c);
            d.subTo(b, d)
        }
    }
    if (v.compareTo(BigInteger.ONE) != 0)
        return BigInteger.ZERO;
    if (d.compareTo(m) >= 0)
        return d.subtract(m);
    if (d.signum() < 0)
        d.addTo(m, d);
    else
        return d;
    if (d.signum() < 0)
        return d.add(m);
    else
        return d
}

var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

function bnIsProbablePrime(t) {
    var i, x = this.abs();
    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i)
            if (x[0] == lowprimes[i])
                return true;
        return false
    }
    if (x.isEven())
        return false;
    i = 1;
    while (i < lowprimes.length) {
        var m = lowprimes[i]
            , j = i + 1;
        while (j < lowprimes.length && m < lplim)
            m *= lowprimes[j++];
        m = x.modInt(m);
        while (i < j)
            if (m % lowprimes[i++] == 0)
                return false
    }
    return x.millerRabin(t)
}

function bnpMillerRabin(t) {
    var b = this.subtract(BigInteger.ONE);
    var k = b.getLowestSetBit();
    if (k <= 0)
        return false;
    var r = b.shiftRight(k);
    t = (t + 1) >> 1;
    if (t > lowprimes.length)
        t = lowprimes.length;
    var a = nbi();
    for (var i = 0; i < t; ++i) {
        a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var y = a.modPow(r, this);
        if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(b) != 0) {
            var j = 1;
            while (j++ < k && y.compareTo(b) != 0) {
                y = y.modPowInt(2, this);
                if (y.compareTo(BigInteger.ONE) == 0)
                    return false
            }
            if (y.compareTo(b) != 0)
                return false
        }
    }
    return true
}

BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;
var hexcase = 0;
var b64pad = "";

function hex_md5(s) {
    return rstr2hex(rstr_md5(str2rstr_utf8(s)))
}

function b64_md5(s) {
    return rstr2b64(rstr_md5(str2rstr_utf8(s)))
}

function any_md5(s, e) {
    return rstr2any(rstr_md5(str2rstr_utf8(s)), e)
}

function hex_hmac_md5(k, d) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function b64_hmac_md5(k, d) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function any_hmac_md5(k, d, e) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}

function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}

function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
}

function rstr_hmac_md5(a, b) {
    var c = rstr2binl(a);
    if (c.length > 16)
        c = binl_md5(c, a.length * 8);
    var d = Array(16)
        , opad = Array(16);
    for (var i = 0; i < 16; i++) {
        d[i] = c[i] ^ 0x36363636;
        opad[i] = c[i] ^ 0x5C5C5C5C
    }
    var e = binl_md5(d.concat(rstr2binl(b)), 512 + b.length * 8);
    return binl2rstr(binl_md5(opad.concat(e), 512 + 128))
}

function rstr2hex(a) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var c = "";
    var x;
    for (var i = 0; i < a.length; i++) {
        x = a.charCodeAt(i);
        c += b.charAt((x >>> 4) & 0x0F) + b.charAt(x & 0x0F)
    }
    return c
}

function rstr2b64(a) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var c = "";
    var d = a.length;
    for (var i = 0; i < d; i += 3) {
        var f = (a.charCodeAt(i) << 16) | (i + 1 < d ? a.charCodeAt(i + 1) << 8 : 0) | (i + 2 < d ? a.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > a.length * 8)
                c += b64pad;
            else
                c += b.charAt((f >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return c
}

function rstr2any(a, b) {
    var c = b.length;
    var i, j, q, x, quotient;
    var d = Array(Math.ceil(a.length / 2));
    for (i = 0; i < d.length; i++) {
        d[i] = (a.charCodeAt(i * 2) << 8) | a.charCodeAt(i * 2 + 1)
    }
    var e = Math.ceil(a.length * 8 / (Math.log(b.length) / Math.log(2)));
    var f = Array(e);
    for (j = 0; j < e; j++) {
        quotient = Array();
        x = 0;
        for (i = 0; i < d.length; i++) {
            x = (x << 16) + d[i];
            q = Math.floor(x / c);
            x -= q * c;
            if (quotient.length > 0 || q > 0)
                quotient[quotient.length] = q
        }
        f[j] = x;
        d = quotient
    }
    var g = "";
    for (i = f.length - 1; i >= 0; i--)
        g += b.charAt(f[i]);
    return g
}

function str2rstr_utf8(a) {
    var b = "";
    var i = -1;
    var x, y;
    while (++i < a.length) {
        x = a.charCodeAt(i);
        y = i + 1 < a.length ? a.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            b += String.fromCharCode(x);
        else if (x <= 0x7FF)
            b += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            b += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            b += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return b
}

function str2rstr_utf16le(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode(a.charCodeAt(i) & 0xFF, (a.charCodeAt(i) >>> 8) & 0xFF);
    return b
}

function str2rstr_utf16be(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode((a.charCodeAt(i) >>> 8) & 0xFF, a.charCodeAt(i) & 0xFF);
    return b
}

function rstr2binl(a) {
    var b = Array(a.length >> 2);
    for (var i = 0; i < b.length; i++)
        b[i] = 0;
    for (var i = 0; i < a.length * 8; i += 8)
        b[i >> 5] |= (a.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return b
}

function binl2rstr(a) {
    var b = "";
    for (var i = 0; i < a.length * 32; i += 8)
        b += String.fromCharCode((a[i >> 5] >>> (i % 32)) & 0xFF);
    return b
}

function binl_md5(x, e) {
    x[e >> 5] |= 0x80 << ((e) % 32);
    x[(((e + 64) >>> 9) << 4) + 14] = e;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var f = a;
        var g = b;
        var h = c;
        var j = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, f);
        b = safe_add(b, g);
        c = safe_add(c, h);
        d = safe_add(d, j)
    }
    return Array(a, b, c, d)
}

function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}

function safe_add(x, y) {
    var a = (x & 0xFFFF) + (y & 0xFFFF);
    var b = (x >> 16) + (y >> 16) + (a >> 16);
    return (b << 16) | (a & 0xFFFF)
}

function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b))
}

function Arcfour() {
    this.i = 0;
    this.j = 0;
    this.S = new Array()
}

function ARC4init(a) {
    var i, j, t;
    for (i = 0; i < 256; ++i)
        this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; ++i) {
        j = (j + this.S[i] + a[i % a.length]) & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t
    }
    this.i = 0;
    this.j = 0
}

function ARC4next() {
    var t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255]
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

function prng_newstate() {
    return new Arcfour()
}

var rng_psize = 256;
var hexcase = 0;
var b64pad = "";

function hex_rmd160(s) {
    return rstr2hex(rstr_rmd160(str2rstr_utf8(s)))
}

function b64_rmd160(s) {
    return rstr2b64(rstr_rmd160(str2rstr_utf8(s)))
}

function any_rmd160(s, e) {
    return rstr2any(rstr_rmd160(str2rstr_utf8(s)), e)
}

function hex_hmac_rmd160(k, d) {
    return rstr2hex(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function b64_hmac_rmd160(k, d) {
    return rstr2b64(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function any_hmac_rmd160(k, d, e) {
    return rstr2any(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}

function rmd160_vm_test() {
    return hex_rmd160("abc").toLowerCase() == "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"
}

function rstr_rmd160(s) {
    return binl2rstr(binl_rmd160(rstr2binl(s), s.length * 8))
}

function rstr_hmac_rmd160(a, b) {
    var c = rstr2binl(a);
    if (c.length > 16)
        c = binl_rmd160(c, a.length * 8);
    var d = Array(16)
        , opad = Array(16);
    for (var i = 0; i < 16; i++) {
        d[i] = c[i] ^ 0x36363636;
        opad[i] = c[i] ^ 0x5C5C5C5C
    }
    var e = binl_rmd160(d.concat(rstr2binl(b)), 512 + b.length * 8);
    return binl2rstr(binl_rmd160(opad.concat(e), 512 + 160))
}

function rstr2hex(a) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var c = "";
    var x;
    for (var i = 0; i < a.length; i++) {
        x = a.charCodeAt(i);
        c += b.charAt((x >>> 4) & 0x0F) + b.charAt(x & 0x0F)
    }
    return c
}

function rstr2b64(a) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var c = "";
    var d = a.length;
    for (var i = 0; i < d; i += 3) {
        var f = (a.charCodeAt(i) << 16) | (i + 1 < d ? a.charCodeAt(i + 1) << 8 : 0) | (i + 2 < d ? a.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > a.length * 8)
                c += b64pad;
            else
                c += b.charAt((f >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return c
}

function rstr2any(a, b) {
    var c = b.length;
    var d = Array();
    var i, q, x, quotient;
    var e = Array(Math.ceil(a.length / 2));
    for (i = 0; i < e.length; i++) {
        e[i] = (a.charCodeAt(i * 2) << 8) | a.charCodeAt(i * 2 + 1)
    }
    while (e.length > 0) {
        quotient = Array();
        x = 0;
        for (i = 0; i < e.length; i++) {
            x = (x << 16) + e[i];
            q = Math.floor(x / c);
            x -= q * c;
            if (quotient.length > 0 || q > 0)
                quotient[quotient.length] = q
        }
        d[d.length] = x;
        e = quotient
    }
    var f = "";
    for (i = d.length - 1; i >= 0; i--)
        f += b.charAt(d[i]);
    var g = Math.ceil(a.length * 8 / (Math.log(b.length) / Math.log(2)));
    for (i = f.length; i < g; i++)
        f = b[0] + f;
    return f
}

function str2rstr_utf8(a) {
    var b = "";
    var i = -1;
    var x, y;
    while (++i < a.length) {
        x = a.charCodeAt(i);
        y = i + 1 < a.length ? a.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            b += String.fromCharCode(x);
        else if (x <= 0x7FF)
            b += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            b += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            b += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return b
}

function str2rstr_utf16le(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode(a.charCodeAt(i) & 0xFF, (a.charCodeAt(i) >>> 8) & 0xFF);
    return b
}

function str2rstr_utf16be(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode((a.charCodeAt(i) >>> 8) & 0xFF, a.charCodeAt(i) & 0xFF);
    return b
}

function rstr2binl(a) {
    var b = Array(a.length >> 2);
    for (var i = 0; i < b.length; i++)
        b[i] = 0;
    for (var i = 0; i < a.length * 8; i += 8)
        b[i >> 5] |= (a.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return b
}

function binl2rstr(a) {
    var b = "";
    for (var i = 0; i < a.length * 32; i += 8)
        b += String.fromCharCode((a[i >> 5] >>> (i % 32)) & 0xFF);
    return b
}

function binl_rmd160(x, a) {
    x[a >> 5] |= 0x80 << (a % 32);
    x[(((a + 64) >>> 9) << 4) + 14] = a;
    var b = 0x67452301;
    var c = 0xefcdab89;
    var d = 0x98badcfe;
    var e = 0x10325476;
    var f = 0xc3d2e1f0;
    for (var i = 0; i < x.length; i += 16) {
        var T;
        var g = b
            , B1 = c
            , C1 = d
            , D1 = e
            , E1 = f;
        var h = b
            , B2 = c
            , C2 = d
            , D2 = e
            , E2 = f;
        for (var j = 0; j <= 79; ++j) {
            T = safe_add(g, rmd160_f(j, B1, C1, D1));
            T = safe_add(T, x[i + rmd160_r1[j]]);
            T = safe_add(T, rmd160_K1(j));
            T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
            g = E1;
            E1 = D1;
            D1 = bit_rol(C1, 10);
            C1 = B1;
            B1 = T;
            T = safe_add(h, rmd160_f(79 - j, B2, C2, D2));
            T = safe_add(T, x[i + rmd160_r2[j]]);
            T = safe_add(T, rmd160_K2(j));
            T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
            h = E2;
            E2 = D2;
            D2 = bit_rol(C2, 10);
            C2 = B2;
            B2 = T
        }
        T = safe_add(c, safe_add(C1, D2));
        c = safe_add(d, safe_add(D1, E2));
        d = safe_add(e, safe_add(E1, h));
        e = safe_add(f, safe_add(g, B2));
        f = safe_add(b, safe_add(B1, C2));
        b = T
    }
    return [b, c, d, e, f]
}

function rmd160_f(j, x, y, z) {
    return (0 <= j && j <= 15) ? (x ^ y ^ z) : (16 <= j && j <= 31) ? (x & y) | (~x & z) : (32 <= j && j <= 47) ? (x | ~y) ^ z : (48 <= j && j <= 63) ? (x & z) | (y & ~z) : (64 <= j && j <= 79) ? x ^ (y | ~z) : "rmd160_f: j out of range"
}

function rmd160_K1(j) {
    return (0 <= j && j <= 15) ? 0x00000000 : (16 <= j && j <= 31) ? 0x5a827999 : (32 <= j && j <= 47) ? 0x6ed9eba1 : (48 <= j && j <= 63) ? 0x8f1bbcdc : (64 <= j && j <= 79) ? 0xa953fd4e : "rmd160_K1: j out of range"
}

function rmd160_K2(j) {
    return (0 <= j && j <= 15) ? 0x50a28be6 : (16 <= j && j <= 31) ? 0x5c4dd124 : (32 <= j && j <= 47) ? 0x6d703ef3 : (48 <= j && j <= 63) ? 0x7a6d76e9 : (64 <= j && j <= 79) ? 0x00000000 : "rmd160_K2: j out of range"
}

var rmd160_r1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
var rmd160_r2 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
var rmd160_s1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
var rmd160_s2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

function safe_add(x, y) {
    var a = (x & 0xFFFF) + (y & 0xFFFF);
    var b = (x >> 16) + (y >> 16) + (a >> 16);
    return (b << 16) | (a & 0xFFFF)
}

function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b))
}

var hexcase = 0;
var b64pad = "";

function hex_rmd160(s) {
    return rstr2hex(rstr_rmd160(str2rstr_utf8(s)))
}

function b64_rmd160(s) {
    return rstr2b64(rstr_rmd160(str2rstr_utf8(s)))
}

function any_rmd160(s, e) {
    return rstr2any(rstr_rmd160(str2rstr_utf8(s)), e)
}

function hex_hmac_rmd160(k, d) {
    return rstr2hex(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function b64_hmac_rmd160(k, d) {
    return rstr2b64(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function any_hmac_rmd160(k, d, e) {
    return rstr2any(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}

function rmd160_vm_test() {
    return hex_rmd160("abc").toLowerCase() == "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"
}

function rstr_rmd160(s) {
    return binl2rstr(binl_rmd160(rstr2binl(s), s.length * 8))
}

function rstr_hmac_rmd160(a, b) {
    var c = rstr2binl(a);
    if (c.length > 16)
        c = binl_rmd160(c, a.length * 8);
    var d = Array(16)
        , opad = Array(16);
    for (var i = 0; i < 16; i++) {
        d[i] = c[i] ^ 0x36363636;
        opad[i] = c[i] ^ 0x5C5C5C5C
    }
    var e = binl_rmd160(d.concat(rstr2binl(b)), 512 + b.length * 8);
    return binl2rstr(binl_rmd160(opad.concat(e), 512 + 160))
}

function rstr2hex(a) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var c = "";
    var x;
    for (var i = 0; i < a.length; i++) {
        x = a.charCodeAt(i);
        c += b.charAt((x >>> 4) & 0x0F) + b.charAt(x & 0x0F)
    }
    return c
}

function rstr2b64(a) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var c = "";
    var d = a.length;
    for (var i = 0; i < d; i += 3) {
        var f = (a.charCodeAt(i) << 16) | (i + 1 < d ? a.charCodeAt(i + 1) << 8 : 0) | (i + 2 < d ? a.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > a.length * 8)
                c += b64pad;
            else
                c += b.charAt((f >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return c
}

function rstr2any(a, b) {
    var c = b.length;
    var d = Array();
    var i, q, x, quotient;
    var e = Array(Math.ceil(a.length / 2));
    for (i = 0; i < e.length; i++) {
        e[i] = (a.charCodeAt(i * 2) << 8) | a.charCodeAt(i * 2 + 1)
    }
    while (e.length > 0) {
        quotient = Array();
        x = 0;
        for (i = 0; i < e.length; i++) {
            x = (x << 16) + e[i];
            q = Math.floor(x / c);
            x -= q * c;
            if (quotient.length > 0 || q > 0)
                quotient[quotient.length] = q
        }
        d[d.length] = x;
        e = quotient
    }
    var f = "";
    for (i = d.length - 1; i >= 0; i--)
        f += b.charAt(d[i]);
    var g = Math.ceil(a.length * 8 / (Math.log(b.length) / Math.log(2)));
    for (i = f.length; i < g; i++)
        f = b[0] + f;
    return f
}

function str2rstr_utf8(a) {
    var b = "";
    var i = -1;
    var x, y;
    while (++i < a.length) {
        x = a.charCodeAt(i);
        y = i + 1 < a.length ? a.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            b += String.fromCharCode(x);
        else if (x <= 0x7FF)
            b += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            b += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            b += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return b
}

function str2rstr_utf16le(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode(a.charCodeAt(i) & 0xFF, (a.charCodeAt(i) >>> 8) & 0xFF);
    return b
}

function str2rstr_utf16be(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode((a.charCodeAt(i) >>> 8) & 0xFF, a.charCodeAt(i) & 0xFF);
    return b
}

function rstr2binl(a) {
    var b = Array(a.length >> 2);
    for (var i = 0; i < b.length; i++)
        b[i] = 0;
    for (var i = 0; i < a.length * 8; i += 8)
        b[i >> 5] |= (a.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return b
}

function binl2rstr(a) {
    var b = "";
    for (var i = 0; i < a.length * 32; i += 8)
        b += String.fromCharCode((a[i >> 5] >>> (i % 32)) & 0xFF);
    return b
}

function binl_rmd160(x, a) {
    x[a >> 5] |= 0x80 << (a % 32);
    x[(((a + 64) >>> 9) << 4) + 14] = a;
    var b = 0x67452301;
    var c = 0xefcdab89;
    var d = 0x98badcfe;
    var e = 0x10325476;
    var f = 0xc3d2e1f0;
    for (var i = 0; i < x.length; i += 16) {
        var T;
        var g = b
            , B1 = c
            , C1 = d
            , D1 = e
            , E1 = f;
        var h = b
            , B2 = c
            , C2 = d
            , D2 = e
            , E2 = f;
        for (var j = 0; j <= 79; ++j) {
            T = safe_add(g, rmd160_f(j, B1, C1, D1));
            T = safe_add(T, x[i + rmd160_r1[j]]);
            T = safe_add(T, rmd160_K1(j));
            T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
            g = E1;
            E1 = D1;
            D1 = bit_rol(C1, 10);
            C1 = B1;
            B1 = T;
            T = safe_add(h, rmd160_f(79 - j, B2, C2, D2));
            T = safe_add(T, x[i + rmd160_r2[j]]);
            T = safe_add(T, rmd160_K2(j));
            T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
            h = E2;
            E2 = D2;
            D2 = bit_rol(C2, 10);
            C2 = B2;
            B2 = T
        }
        T = safe_add(c, safe_add(C1, D2));
        c = safe_add(d, safe_add(D1, E2));
        d = safe_add(e, safe_add(E1, h));
        e = safe_add(f, safe_add(g, B2));
        f = safe_add(b, safe_add(B1, C2));
        b = T
    }
    return [b, c, d, e, f]
}

function rmd160_f(j, x, y, z) {
    return (0 <= j && j <= 15) ? (x ^ y ^ z) : (16 <= j && j <= 31) ? (x & y) | (~x & z) : (32 <= j && j <= 47) ? (x | ~y) ^ z : (48 <= j && j <= 63) ? (x & z) | (y & ~z) : (64 <= j && j <= 79) ? x ^ (y | ~z) : "rmd160_f: j out of range"
}

function rmd160_K1(j) {
    return (0 <= j && j <= 15) ? 0x00000000 : (16 <= j && j <= 31) ? 0x5a827999 : (32 <= j && j <= 47) ? 0x6ed9eba1 : (48 <= j && j <= 63) ? 0x8f1bbcdc : (64 <= j && j <= 79) ? 0xa953fd4e : "rmd160_K1: j out of range"
}

function rmd160_K2(j) {
    return (0 <= j && j <= 15) ? 0x50a28be6 : (16 <= j && j <= 31) ? 0x5c4dd124 : (32 <= j && j <= 47) ? 0x6d703ef3 : (48 <= j && j <= 63) ? 0x7a6d76e9 : (64 <= j && j <= 79) ? 0x00000000 : "rmd160_K2: j out of range"
}

var rmd160_r1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
var rmd160_r2 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
var rmd160_s1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
var rmd160_s2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

function safe_add(x, y) {
    var a = (x & 0xFFFF) + (y & 0xFFFF);
    var b = (x >> 16) + (y >> 16) + (a >> 16);
    return (b << 16) | (a & 0xFFFF)
}

function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b))
}

function parseBigInt(a, r) {
    return new BigInteger(a, r)
}

function linebrk(s, n) {
    var a = "";
    var i = 0;
    while (i + n < s.length) {
        a += s.substring(i, i + n) + "\n";
        i += n
    }
    return a + s.substring(i, s.length)
}

function byte2Hex(b) {
    if (b < 0x10)
        return "0" + b.toString(16);
    else
        return b.toString(16)
}

function pkcs1pad2(s, n) {
    if (n < s.length + 11) {
        alert("Message too long for RSA");
        return null
    }
    var a = new Array();
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) {
            a[--n] = c
        } else if ((c > 127) && (c < 2048)) {
            a[--n] = (c & 63) | 128;
            a[--n] = (c >> 6) | 192
        } else {
            a[--n] = (c & 63) | 128;
            a[--n] = ((c >> 6) & 63) | 128;
            a[--n] = (c >> 12) | 224
        }
    }
    a[--n] = 0;
    var b = new SecureRandom();
    var x = new Array();
    while (n > 2) {
        x[0] = 0;
        while (x[0] == 0)
            b.nextBytes(x);
        a[--n] = x[0]
    }
    a[--n] = 2;
    a[--n] = 0;
    return new BigInteger(a)
}

function RSAKey() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null
}

function RSASetPublic(N, E) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N, 16);
        this.e = parseInt(E, 16)
    } else
        alert("Invalid RSA public key")
}

function RSADoPublic(x) {
    return x.modPowInt(this.e, this.n)
}

function RSAEncrypt(a) {
    var m = pkcs1pad2(a, (this.n.bitLength() + 7) >> 3);
    if (m == null)
        return null;
    var c = this.doPublic(m);
    if (c == null)
        return null;
    var h = c.toString(16);
    if ((h.length & 1) == 0)
        return h;
    else
        return "0" + h
}

RSAKey.prototype.doPublic = RSADoPublic;
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;

function _x509_pemToBase64(a) {
    var s = a;
    s = s.replace("-----BEGIN CERTIFICATE-----", "");
    s = s.replace("-----END CERTIFICATE-----", "");
    s = s.replace(/[ \n]+/g, "");
    return s
}

function _x509_pemToHex(a) {
    var b = _x509_pemToBase64(a);
    // var c = b64tohex(b);

    var c = certManager.Base64ToHex(b)+"";
    return c.toLowerCase();
}

function _x509_getHexTbsCertificateFromCert(a) {
    var b = ASN1HEX.getStartPosOfV_AtObj(a, 0);
    return b
}

function _x509_getSubjectPublicKeyInfoPosFromCertHex(b) {
    
    var c = ASN1HEX.getStartPosOfV_AtObj(b, 0);
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, c);
    if (a.length < 1)
        return -1;
    if (b.substring(a[0], a[0] + 10) == "a003020102") {
        if (a.length < 6)
            return -1;
        return a[6]
    } else {
        if (a.length < 5)
            return -1;
        return a[5]
    }
}

function _x509_getPublicKeyHexArrayFromCertHex(b) {
    
    var p = _x509_getSubjectPublicKeyPosFromCertHex(b);
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, p);
    if (a.length != 2)
        return [];
    var c = ASN1HEX.getHexOfV_AtObj(b, a[0]);
    var d = ASN1HEX.getHexOfV_AtObj(b, a[1]);
    if (c != null && d != null) {
        return [c, d]
    } else {
        return []
    }
}

function _x509_getPublicKeyHexArrayFromCertPEM(b) {
    var c = _x509_pemToHex(b);
    var a = _x509_getPublicKeyHexArrayFromCertHex(c);
    return a
}

function _x509_getSerialNumberHex() {
    return ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 1])
}

function _x509_getIssuerHex() {
    return ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 3])
}

function _x509_getIssuerString() {
    return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 3]))
}

function _x509_getSubjectHex() {
    return ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 5])
}

function _x509_getSubjectString() {
    return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 5]))
}

function _x509_getSignature() {
    var s = ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [2]);
    var k = s.substring(10, s.length);
    return k
}

function _x509_getCertInfo() {
    var s = ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0]);
    return s
}

function _x509_getNotBefore() {
    var s = ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 4, 0]);
    s = s.replace(/(..)/g, "%$1");
    s = decodeURIComponent(s);
    return s
}

function _x509_getNotAfter() {
    var s = ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 4, 1]);
    s = s.replace(/(..)/g, "%$1");
    s = decodeURIComponent(s);
    return s
}

_x509_DN_ATTRHEX = {
    "0603550406": "C",
    "060355040a": "O",
    "060355040b": "OU",
    "0603550403": "CN",
    "0603550405": "SN",
    "0603550408": "ST",
    "0603550407": "L"
};

function _x509_hex2dn(b) {
    var s = "";
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, 0);
    for (var i = 0; i < a.length; i++) {
        var c = ASN1HEX.getHexOfTLV_AtObj(b, a[i]);
        s = s + "/" + _x509_hex2rdn(c)
    }
    return s
}

function _x509_hex2rdn(a) {
    var b = ASN1HEX.getDecendantHexTLVByNthList(a, 0, [0, 0]);
    var c = ASN1HEX.getDecendantHexVByNthList(a, 0, [0, 1]);
    var d = "";
    try {
        d = _x509_DN_ATTRHEX[b]
    } catch (ex) {
        d = b
    }
    c = c.replace(/(..)/g, "%$1");
    var e = decodeURIComponent(c);
    return d + "=" + e
}

function _x509_readCertPEM(b) {
    var c = _x509_pemToHex(b);
    var a = _x509_getPublicKeyHexArrayFromCertHex(c);
    var d = new RSAKey();
    d.setPublic(a[0], a[1]);
    this.subjectPublicKeyRSA = d;
    this.subjectPublicKeyRSA_hN = a[0];
    this.subjectPublicKeyRSA_hE = a[1];
    this.hex = c
}

function _x509_readCertPEMWithoutRSAInit(b) {
    var c = _x509_pemToHex(b);
    var a = _x509_getPublicKeyHexArrayFromCertHex(c);
    this.subjectPublicKeyRSA.setPublic(a[0], a[1]);
    this.subjectPublicKeyRSA_hN = a[0];
    this.subjectPublicKeyRSA_hE = a[1];
    this.hex = c
}

function X509() {
    this.subjectPublicKeyRSA = null;
    this.subjectPublicKeyRSA_hN = null;
    this.subjectPublicKeyRSA_hE = null;
    this.hex = null
}

X509.prototype.readCertPEM = _x509_readCertPEM;
X509.prototype.readCertPEMWithoutRSAInit = _x509_readCertPEMWithoutRSAInit;
X509.prototype.getSerialNumberHex = _x509_getSerialNumberHex;
X509.prototype.getIssuerHex = _x509_getIssuerHex;
X509.prototype.getSubjectHex = _x509_getSubjectHex;
X509.prototype.getIssuerString = _x509_getIssuerString;
X509.prototype.getSubjectString = _x509_getSubjectString;
X509.prototype.getNotBefore = _x509_getNotBefore;
X509.prototype.getNotAfter = _x509_getNotAfter;
X509.prototype.getSignature = _x509_getSignature;
X509.prototype.getCertInfo = _x509_getCertInfo;

function _rsapem_pemToBase64(a) {
    var s = a;
    s = s.replace("-----BEGIN RSA PRIVATE KEY-----", "");
    s = s.replace("-----END RSA PRIVATE KEY-----", "");
    s = s.replace(/[ \n]+/g, "");
    return s
}

function _rsapem_getPosArrayOfChildrenFromHex(b) {
    var a = new Array();
    var c = ASN1HEX.getStartPosOfV_AtObj(b, 0);
    var d = ASN1HEX.getPosOfNextSibling_AtObj(b, c);
    var e = ASN1HEX.getPosOfNextSibling_AtObj(b, d);
    var f = ASN1HEX.getPosOfNextSibling_AtObj(b, e);
    var g = ASN1HEX.getPosOfNextSibling_AtObj(b, f);
    var h = ASN1HEX.getPosOfNextSibling_AtObj(b, g);
    var i = ASN1HEX.getPosOfNextSibling_AtObj(b, h);
    var j = ASN1HEX.getPosOfNextSibling_AtObj(b, i);
    var k = ASN1HEX.getPosOfNextSibling_AtObj(b, j);
    a.push(c, d, e, f, g, h, i, j, k);
    return a
}

function _rsapem_getHexValueArrayOfChildrenFromHex(b) {
    var c = _rsapem_getPosArrayOfChildrenFromHex(b);
    var v = ASN1HEX.getHexOfV_AtObj(b, c[0]);
    var n = ASN1HEX.getHexOfV_AtObj(b, c[1]);
    var e = ASN1HEX.getHexOfV_AtObj(b, c[2]);
    var d = ASN1HEX.getHexOfV_AtObj(b, c[3]);
    var p = ASN1HEX.getHexOfV_AtObj(b, c[4]);
    var q = ASN1HEX.getHexOfV_AtObj(b, c[5]);
    var f = ASN1HEX.getHexOfV_AtObj(b, c[6]);
    var g = ASN1HEX.getHexOfV_AtObj(b, c[7]);
    var h = ASN1HEX.getHexOfV_AtObj(b, c[8]);
    var a = new Array();
    a.push(v, n, e, d, p, q, f, g, h);
    return a
}

function _rsapem_readPrivateKeyFromPEMString(b) {
    var c = _rsapem_pemToBase64(b);
    var d = b64tohex(c);
    var a = _rsapem_getHexValueArrayOfChildrenFromHex(d);
    this.setPrivateEx(a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8])
}

RSAKey.prototype.readPrivateKeyFromPEMString = _rsapem_readPrivateKeyFromPEMString;
var _RSASIGN_DIHEAD = [];
_RSASIGN_DIHEAD['sha1'] = "3021300906052b0e03021a05000414";
_RSASIGN_DIHEAD['sha256'] = "3031300d060960864801650304020105000420";
_RSASIGN_DIHEAD['sha384'] = "3041300d060960864801650304020205000430";
_RSASIGN_DIHEAD['sha512'] = "3051300d060960864801650304020305000440";
_RSASIGN_DIHEAD['md2'] = "3020300c06082a864886f70d020205000410";
_RSASIGN_DIHEAD['md5'] = "3020300c06082a864886f70d020505000410";
_RSASIGN_DIHEAD['ripemd160'] = "3021300906052b2403020105000414";
var _RSASIGN_HASHHEXFUNC = [];
_RSASIGN_HASHHEXFUNC['sha1'] = function (s) {
    return hex_sha1(s)
}
;
_RSASIGN_HASHHEXFUNC['sha256'] = function (s) {
    return hex_sha256(s)
}
;
_RSASIGN_HASHHEXFUNC['sha512'] = function (s) {
    return hex_sha512(s)
}
;
_RSASIGN_HASHHEXFUNC['md5'] = function (s) {
    return hex_md5(s)
}
;
_RSASIGN_HASHHEXFUNC['ripemd160'] = function (s) {
    return hex_rmd160(s)
}
;
var _RE_HEXDECONLY = new RegExp("");
_RE_HEXDECONLY.compile("[^0-9a-f]", "gi");

function _rsasign_getHexPaddedDigestInfoForString(s, a, b) {
    var c = a / 4;
    var d = _RSASIGN_HASHHEXFUNC[b];
    var e = d(s);
    var f = "0001";
    var g = "00" + _RSASIGN_DIHEAD[b] + e;
    var h = "";
    var j = c - f.length - g.length;
    for (var i = 0; i < j; i += 2) {
        h += "ff"
    }
    sPaddedMessageHex = f + h + g;
    return sPaddedMessageHex
}

function _zeroPaddingOfSignature(a, b) {
    var s = "";
    var c = b / 4 - a.length;
    for (var i = 0; i < c; i++) {
        s = s + "0"
    }
    return s + a
}

function _rsasign_signString(s, a) {
    var b = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength(), a);
    var c = parseBigInt(b, 16);
    var d = this.doPrivate(c);
    var e = d.toString(16);
    return _zeroPaddingOfSignature(e, this.n.bitLength())
}

function _rsasign_signStringWithSHA1(s) {
    return _rsasign_signString(s, 'sha1')
}

function _rsasign_signStringWithSHA256(s) {
    return _rsasign_signString(s, 'sha256')
}

function _rsasign_getDecryptSignatureBI(a, b, c) {
    var d = new RSAKey();
    d.setPublic(b, c);
    var e = d.doPublic(a);
    return e
}

function _rsasign_getHexDigestInfoFromSig(a, b, c) {
    var d = _rsasign_getDecryptSignatureBI(a, b, c);
    var e = d.toString(16).replace(/^1f+00/, '');
    return e
}

function _rsasign_getAlgNameAndHashFromHexDisgestInfo(b) {
    for (var c in _RSASIGN_DIHEAD) {
        var d = _RSASIGN_DIHEAD[c];
        var e = d.length;
        if (b.substring(0, e) == d) {
            var a = [c, b.substring(e)];
            return a
        }
    }
    return []
}

function _rsasign_verifySignatureWithArgs(a, b, c, d) {
    var e = _rsasign_getHexDigestInfoFromSig(b, c, d);
    var f = _rsasign_getAlgNameAndHashFromHexDisgestInfo(e);
    if (f.length == 0)
        return false;
    var g = f[0];
    var h = f[1];
    var i = _RSASIGN_HASHHEXFUNC[g];
    var j = i(a);
    return (h == j)
}

function _rsasign_verifyHexSignatureForMessage(a, b) {
    var c = parseBigInt(a, 16);
    var d = _rsasign_verifySignatureWithArgs(b, c, this.n.toString(16), this.e.toString(16));
    return d
}

function _rsasign_verifyString(a, b) {
    b = b.replace(_RE_HEXDECONLY, '');
    if (b.length != this.n.bitLength() / 4)
        return 0;
    b = b.replace(/[ \n]+/g, "");
    var c = parseBigInt(b, 16);
    var d = this.doPublic(c);
    var e = d.toString(16).replace(/^1f+00/, '');
    var f = _rsasign_getAlgNameAndHashFromHexDisgestInfo(e);
    if (f.length == 0)
        return false;
    var g = f[0];
    var h = f[1];
    return (h == a)
}

function _rsasign_verifysha1msg(a, b) {
    b = b.replace(_RE_HEXDECONLY, '');
    if (b.length != this.n.bitLength() / 4)
        return 0;
    b = b.replace(/[ \n]+/g, "");
    var c = parseBigInt(b, 16);
    var d = this.doPublic(c);
    var e = d.toString(16).replace(/^1f+00/, '');
    var f = _rsasign_getAlgNameAndHashFromHexDisgestInfo(e);
    if (f.length == 0)
        return false;
    var g = f[1];
    return (g == a)
}

RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.signStringWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signStringWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.sign = _rsasign_signString;
RSAKey.prototype.signWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.verifyString = _rsasign_verifyString;
RSAKey.prototype.verifysha1msg = _rsasign_verifysha1msg;
RSAKey.prototype.verifyHexSignatureForMessage = _rsasign_verifyHexSignatureForMessage;
RSAKey.prototype.verify = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForByteArrayMessage = _rsasign_verifyHexSignatureForMessage;

function X9ECParameters(a, g, n, h) {
    this.curve = a;
    this.g = g;
    this.n = n;
    this.h = h
}

function x9getCurve() {
    return this.curve
}

function x9getG() {
    return this.g
}

function x9getN() {
    return this.n
}

function x9getH() {
    return this.h
}

X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;

function fromHex(s) {
    return new BigInteger(s, 16)
}

function secp128r1() {
    var p = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC");
    var b = fromHex("E87579C11079F43DD824993C2CEE5ED3");
    var n = fromHex("FFFFFFFE0000000075A30D1B9038A115");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "161FF7528B899B2D0C28607CA52C5B86" + "CF5AC8395BAFEB13C02DA292DDED7A83");
    return new X9ECParameters(c, G, n, h)
}

function secp160k1() {
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73");
    var a = BigInteger.ZERO;
    var b = fromHex("7");
    var n = fromHex("0100000000000000000001B8FA16DFAB9ACA16B6B3");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "3B4C382CE37AA192A4019E763036F4F5DD4D7EBB" + "938CF935318FDCED6BC28286531733C3F03C4FEE");
    return new X9ECParameters(c, G, n, h)
}

function secp160r1() {
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC");
    var b = fromHex("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45");
    var n = fromHex("0100000000000000000001F4C8F927AED3CA752257");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "4A96B5688EF573284664698968C38BB913CBFC82" + "23A628553168947D59DCC912042351377AC5FB32");
    return new X9ECParameters(c, G, n, h)
}

function secp192k1() {
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37");
    var a = BigInteger.ZERO;
    var b = fromHex("3");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D" + "9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D");
    return new X9ECParameters(c, G, n, h)
}

function secp192r1() {
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC");
    var b = fromHex("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012" + "07192B95FFC8DA78631011ED6B24CDD573F977A11E794811");
    return new X9ECParameters(c, G, n, h)
}

function secp224r1() {
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE");
    var b = fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21" + "BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34");
    return new X9ECParameters(c, G, n, h)
}

function secp256r1() {
    var p = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC");
    var b = fromHex("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B");
    var n = fromHex("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551");
    var h = BigInteger.ONE;
    var c = new ECCurveFp(p, a, b);
    var G = c.decodePointHex("04" + "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296" + "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5");
    return new X9ECParameters(c, G, n, h)
}

function getSECCurveByName(a) {
    if (a == "secp128r1")
        return secp128r1();
    if (a == "secp160k1")
        return secp160k1();
    if (a == "secp160r1")
        return secp160r1();
    if (a == "secp192k1")
        return secp192k1();
    if (a == "secp192r1")
        return secp192r1();
    if (a == "secp224r1")
        return secp224r1();
    if (a == "secp256r1")
        return secp256r1();
    return null
}

function sha1Hash(g) {
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    g += String.fromCharCode(0x80);
    var l = g.length / 4 + 2;
    var N = Math.ceil(l / 16);
    var M = new Array(N);
    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (var j = 0; j < 16; j++) {
            M[i][j] = (g.charCodeAt(i * 64 + j * 4) << 24) | (g.charCodeAt(i * 64 + j * 4 + 1) << 16) | (g.charCodeAt(i * 64 + j * 4 + 2) << 8) | (g.charCodeAt(i * 64 + j * 4 + 3))
        }
    }
    M[N - 1][14] = ((g.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((g.length - 1) * 8) & 0xffffffff;
    var h = 0x67452301;
    var k = 0xefcdab89;
    var m = 0x98badcfe;
    var n = 0x10325476;
    var o = 0xc3d2e1f0;
    var W = new Array(80);
    var a, b, c, d, e;
    for (var i = 0; i < N; i++) {
        for (var t = 0; t < 16; t++)
            W[t] = M[i][t];
        for (var t = 16; t < 80; t++)
            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
        a = h;
        b = k;
        c = m;
        d = n;
        e = o;
        for (var t = 0; t < 80; t++) {
            var s = Math.floor(t / 20);
            var T = (ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = ROTL(b, 30);
            b = a;
            a = T
        }
        h = (h + a) & 0xffffffff;
        k = (k + b) & 0xffffffff;
        m = (m + c) & 0xffffffff;
        n = (n + d) & 0xffffffff;
        o = (o + e) & 0xffffffff
    }
    return h.toHexStr() + k.toHexStr() + m.toHexStr() + n.toHexStr() + o.toHexStr()
}

function f(s, x, y, z) {
    switch (s) {
        case 0:
            return (x & y) ^ (~x & z);
        case 1:
            return x ^ y ^ z;
        case 2:
            return (x & y) ^ (x & z) ^ (y & z);
        case 3:
            return x ^ y ^ z
    }
}

function ROTL(x, n) {
    return (x << n) | (x >>> (32 - n))
}

Number.prototype.toHexStr = function () {
    var s = "", v;
    for (var i = 7; i >= 0; i--) {
        v = (this >>> (i * 4)) & 0xf;
        s += v.toString(16)
    }
    return s
}
;
sha1_oaep = new function () {
    var d = 64;
    var e = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    var f = e.length;
    this.hex = function (a) {
        return p(g(a))
    }
    ;
    this.dec = function (a) {
        return g(a)
    }
    ;
    this.bin = function (a) {
        return t(g(a))
    }
    ;
    var g = function (a) {
        var b = [];
        if (h(a))
            b = a;
        else if (k(a))
            b = s(a);
        else
            "unknown type";
        b = o(b);
        return m(b)
    };
    var h = function (a) {
        return a && a.constructor === [].constructor
    };
    var k = function (a) {
        return typeof (a) == typeof ("string")
    };
    var l = function (a, b) {
        return (a << b) | (a >>> (32 - b))
    };
    var m = function (a) {
        var b = [];
        var c = [];
        var i, j, tmp, x = [];
        for (j = 0; j < f; j++)
            b[j] = e[j];
        for (i = 0; i < a.length; i += d) {
            for (j = 0; j < f; j++)
                c[j] = b[j];
            x = r(a.slice(i, i + d));
            for (j = 16; j < 80; j++)
                x[j] = l(x[j - 3] ^ x[j - 8] ^ x[j - 14] ^ x[j - 16], 1);
            for (j = 0; j < 80; j++) {
                if (j < 20)
                    tmp = ((b[1] & b[2]) ^ (~b[1] & b[3])) + K[0];
                else if (j < 40)
                    tmp = (b[1] ^ b[2] ^ b[3]) + K[1];
                else if (j < 60)
                    tmp = ((b[1] & b[2]) ^ (b[1] & b[3]) ^ (b[2] & b[3])) + K[2];
                else
                    tmp = (b[1] ^ b[2] ^ b[3]) + K[3];
                tmp += l(b[0], 5) + x[j] + b[4];
                b[4] = b[3];
                b[3] = b[2];
                b[2] = l(b[1], 30);
                b[1] = b[0];
                b[0] = tmp
            }
            for (j = 0; j < f; j++)
                b[j] += c[j]
        }
        return q(b)
    };
    var o = function (a) {
        var b = a.length;
        var n = b;
        a[n++] = 0x80;
        while (n % d != 56)
            a[n++] = 0;
        b *= 8;
        return a.concat(0, 0, 0, 0, q([b]))
    };
    var p = function (a) {
        var i, hex = "";
        for (i = 0; i < a.length; i++)
            hex += (a[i] > 0xf ? "" : "0") + a[i].toString(16);
        return hex
    };
    var q = function (a) {
        var b = [];
        for (n = i = 0; i < a.length; i++) {
            b[n++] = (a[i] >>> 24) & 0xff;
            b[n++] = (a[i] >>> 16) & 0xff;
            b[n++] = (a[i] >>> 8) & 0xff;
            b[n++] = a[i] & 0xff
        }
        return b
    };
    var r = function (a) {
        var b = [];
        var i, n;
        for (n = i = 0; i < a.length; i += 4,
            n++)
            b[n] = (a[i] << 24) | (a[i + 1] << 16) | (a[i + 2] << 8) | a[i + 3];
        return b
    };
    var s = function (a) {
        var i, n, c, tmp = [];
        for (n = i = 0; i < a.length; i++) {
            c = a.charCodeAt(i);
            if (c <= 0xff)
                tmp[n++] = c;
            else {
                tmp[n++] = c >>> 8;
                tmp[n++] = c & 0xff
            }
        }
        return tmp
    };
    var t = function (a) {
        var i, tmp = "";
        for (i in a)
            tmp += String.fromCharCode(a[i]);
        return tmp
    };
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]
}
;
var hexcase = 0;
var b64pad = "";

function hex_sha1(s) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(s)))
}

function b64_sha1(s) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(s)))
}

function any_sha1(s, e) {
    return rstr2any(rstr_sha1(str2rstr_utf8(s)), e)
}

function hex_hmac_sha1(k, d) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function b64_hmac_sha1(k, d) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function any_hmac_sha1(k, d, e) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}

function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d"
}

function rstr_sha1(s) {
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8))
}

function rstr_hmac_sha1(a, b) {
    var c = rstr2binb(a);
    if (c.length > 16)
        c = binb_sha1(c, a.length * 8);
    var d = Array(16)
        , opad = Array(16);
    for (var i = 0; i < 16; i++) {
        d[i] = c[i] ^ 0x36363636;
        opad[i] = c[i] ^ 0x5C5C5C5C
    }
    var e = binb_sha1(d.concat(rstr2binb(b)), 512 + b.length * 8);
    return binb2rstr(binb_sha1(opad.concat(e), 512 + 160))
}

function rstr2hex(a) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var c = "";
    var x;
    for (var i = 0; i < a.length; i++) {
        x = a.charCodeAt(i);
        c += b.charAt((x >>> 4) & 0x0F) + b.charAt(x & 0x0F)
    }
    return c
}

function rstr2b64(a) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var c = "";
    var d = a.length;
    for (var i = 0; i < d; i += 3) {
        var f = (a.charCodeAt(i) << 16) | (i + 1 < d ? a.charCodeAt(i + 1) << 8 : 0) | (i + 2 < d ? a.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > a.length * 8)
                c += b64pad;
            else
                c += b.charAt((f >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return c
}

function rstr2any(a, b) {
    var c = b.length;
    var d = Array();
    var i, q, x, quotient;
    var e = Array(Math.ceil(a.length / 2));
    for (i = 0; i < e.length; i++) {
        e[i] = (a.charCodeAt(i * 2) << 8) | a.charCodeAt(i * 2 + 1)
    }
    while (e.length > 0) {
        quotient = Array();
        x = 0;
        for (i = 0; i < e.length; i++) {
            x = (x << 16) + e[i];
            q = Math.floor(x / c);
            x -= q * c;
            if (quotient.length > 0 || q > 0)
                quotient[quotient.length] = q
        }
        d[d.length] = x;
        e = quotient
    }
    var f = "";
    for (i = d.length - 1; i >= 0; i--)
        f += b.charAt(d[i]);
    var g = Math.ceil(a.length * 8 / (Math.log(b.length) / Math.log(2)));
    for (i = f.length; i < g; i++)
        f = b[0] + f;
    return f
}

function str2rstr_utf8(a) {
    var b = "";
    var i = -1;
    var x, y;
    while (++i < a.length) {
        x = a.charCodeAt(i);
        y = i + 1 < a.length ? a.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            b += String.fromCharCode(x);
        else if (x <= 0x7FF)
            b += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            b += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            b += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return b
}

function str2rstr_utf16le(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode(a.charCodeAt(i) & 0xFF, (a.charCodeAt(i) >>> 8) & 0xFF);
    return b
}

function str2rstr_utf16be(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode((a.charCodeAt(i) >>> 8) & 0xFF, a.charCodeAt(i) & 0xFF);
    return b
}

function rstr2binb(a) {
    var b = Array(a.length >> 2);
    for (var i = 0; i < b.length; i++)
        b[i] = 0;
    for (var i = 0; i < a.length * 8; i += 8)
        b[i >> 5] |= (a.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    return b
}

function binb2rstr(a) {
    var b = "";
    for (var i = 0; i < a.length * 32; i += 8)
        b += String.fromCharCode((a[i >> 5] >>> (24 - i % 32)) & 0xFF);
    return b
}

function binb_sha1(x, f) {
    x[f >> 5] |= 0x80 << (24 - f % 32);
    x[((f + 64 >> 9) << 4) + 15] = f;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var g = a;
        var h = b;
        var k = c;
        var l = d;
        var m = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16)
                w[j] = x[i + j];
            else
                w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t
        }
        a = safe_add(a, g);
        b = safe_add(b, h);
        c = safe_add(c, k);
        d = safe_add(d, l);
        e = safe_add(e, m)
    }
    return Array(a, b, c, d, e)
}

function sha1_ft(t, b, c, d) {
    if (t < 20)
        return (b & c) | ((~b) & d);
    if (t < 40)
        return b ^ c ^ d;
    if (t < 60)
        return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d
}

function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
}

function safe_add(x, y) {
    var a = (x & 0xFFFF) + (y & 0xFFFF);
    var b = (x >> 16) + (y >> 16) + (a >> 16);
    return (b << 16) | (a & 0xFFFF)
}

function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b))
}

var hexcase = 0;
var b64pad = "";

function hex_sha512(s) {
    return rstr2hex(rstr_sha512(str2rstr_utf8(s)))
}

function b64_sha512(s) {
    return rstr2b64(rstr_sha512(str2rstr_utf8(s)))
}

function any_sha512(s, e) {
    return rstr2any(rstr_sha512(str2rstr_utf8(s)), e)
}

function hex_hmac_sha512(k, d) {
    return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function b64_hmac_sha512(k, d) {
    return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function any_hmac_sha512(k, d, e) {
    return rstr2any(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}

function sha512_vm_test() {
    return hex_sha512("abc").toLowerCase() == "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a" + "2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
}

function rstr_sha512(s) {
    return binb2rstr(binb_sha512(rstr2binb(s), s.length * 8))
}

function rstr_hmac_sha512(a, b) {
    var c = rstr2binb(a);
    if (c.length > 32)
        c = binb_sha512(c, a.length * 8);
    var d = Array(32)
        , opad = Array(32);
    for (var i = 0; i < 32; i++) {
        d[i] = c[i] ^ 0x36363636;
        opad[i] = c[i] ^ 0x5C5C5C5C
    }
    var e = binb_sha512(d.concat(rstr2binb(b)), 1024 + b.length * 8);
    return binb2rstr(binb_sha512(opad.concat(e), 1024 + 512))
}

function rstr2hex(a) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var c = "";
    var x;
    for (var i = 0; i < a.length; i++) {
        x = a.charCodeAt(i);
        c += b.charAt((x >>> 4) & 0x0F) + b.charAt(x & 0x0F)
    }
    return c
}

function rstr2b64(a) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var c = "";
    var d = a.length;
    for (var i = 0; i < d; i += 3) {
        var f = (a.charCodeAt(i) << 16) | (i + 1 < d ? a.charCodeAt(i + 1) << 8 : 0) | (i + 2 < d ? a.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > a.length * 8)
                c += b64pad;
            else
                c += b.charAt((f >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return c
}

function rstr2any(a, b) {
    var c = b.length;
    var i, j, q, x, quotient;
    var d = Array(Math.ceil(a.length / 2));
    for (i = 0; i < d.length; i++) {
        d[i] = (a.charCodeAt(i * 2) << 8) | a.charCodeAt(i * 2 + 1)
    }
    var e = Math.ceil(a.length * 8 / (Math.log(b.length) / Math.log(2)));
    var f = Array(e);
    for (j = 0; j < e; j++) {
        quotient = Array();
        x = 0;
        for (i = 0; i < d.length; i++) {
            x = (x << 16) + d[i];
            q = Math.floor(x / c);
            x -= q * c;
            if (quotient.length > 0 || q > 0)
                quotient[quotient.length] = q
        }
        f[j] = x;
        d = quotient
    }
    var g = "";
    for (i = f.length - 1; i >= 0; i--)
        g += b.charAt(f[i]);
    return g
}

function str2rstr_utf8(a) {
    var b = "";
    var i = -1;
    var x, y;
    while (++i < a.length) {
        x = a.charCodeAt(i);
        y = i + 1 < a.length ? a.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            b += String.fromCharCode(x);
        else if (x <= 0x7FF)
            b += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            b += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            b += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return b
}

function str2rstr_utf16le(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode(a.charCodeAt(i) & 0xFF, (a.charCodeAt(i) >>> 8) & 0xFF);
    return b
}

function str2rstr_utf16be(a) {
    var b = "";
    for (var i = 0; i < a.length; i++)
        b += String.fromCharCode((a.charCodeAt(i) >>> 8) & 0xFF, a.charCodeAt(i) & 0xFF);
    return b
}

function rstr2binb(a) {
    var b = Array(a.length >> 2);
    for (var i = 0; i < b.length; i++)
        b[i] = 0;
    for (var i = 0; i < a.length * 8; i += 8)
        b[i >> 5] |= (a.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    return b
}

function binb2rstr(a) {
    var b = "";
    for (var i = 0; i < a.length * 32; i += 8)
        b += String.fromCharCode((a[i >> 5] >>> (24 - i % 32)) & 0xFF);
    return b
}

var sha512_k;

function binb_sha512(x, k) {
    if (sha512_k == undefined) {
        sha512_k = new Array(new int64(0x428a2f98, -685199838), new int64(0x71374491, 0x23ef65cd), new int64(-1245643825, -330482897), new int64(-373957723, -2121671748), new int64(0x3956c25b, -213338824), new int64(0x59f111f1, -1241133031), new int64(-1841331548, -1357295717), new int64(-1424204075, -630357736), new int64(-670586216, -1560083902), new int64(0x12835b01, 0x45706fbe), new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, -704662302), new int64(0x72be5d74, -226784913), new int64(-2132889090, 0x3b1696b1), new int64(-1680079193, 0x25c71235), new int64(-1046744716, -815192428), new int64(-459576895, -1628353838), new int64(-272742522, 0x384f25e3), new int64(0xfc19dc6, -1953704523), new int64(0x240ca1cc, 0x77ac9c65), new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483), new int64(0x5cb0a9dc, -1119749164), new int64(0x76f988da, -2096016459), new int64(-1740746414, -295247957), new int64(-1473132947, 0x2db43210), new int64(-1341970488, -1728372417), new int64(-1084653625, -1091629340), new int64(-958395405, 0x3da88fc2), new int64(-710438585, -1828018395), new int64(0x6ca6351, -536640913), new int64(0x14292967, 0xa0e6e70), new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926), new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, -1651133473), new int64(0x650a7354, -1951439906), new int64(0x766a0abb, 0x3c77b2a8), new int64(-2117940946, 0x47edaee6), new int64(-1838011259, 0x1482353b), new int64(-1564481375, 0x4cf10364), new int64(-1474664885, -1136513023), new int64(-1035236496, -789014639), new int64(-949202525, 0x654be30), new int64(-778901479, -688958952), new int64(-694614492, 0x5565a910), new int64(-200395387, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8), new int64(0x19a4c116, -1194143544), new int64(0x1e376c08, 0x5141ab53), new int64(0x2748774c, -544281703), new int64(0x34b0bcb5, -509917016), new int64(0x391c0cb3, -976659869), new int64(0x4ed8aa4a, -482243893), new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, -692930397), new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60), new int64(-2067236844, -1578062990), new int64(-1933114872, 0x1a6439ec), new int64(-1866530822, 0x23631e28), new int64(-1538233109, -561857047), new int64(-1090935817, -1295615723), new int64(-965641998, -479046869), new int64(-903397682, -366583396), new int64(-779700025, 0x21c0c207), new int64(-354779690, -840897762), new int64(-176337025, -294727304), new int64(0x6f067aa, 0x72176fba), new int64(0xa637dc5, -1563912026), new int64(0x113f9804, -1090974290), new int64(0x1b710b35, 0x131c471b), new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493), new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, -1676669620), new int64(0x4cc5d4be, -885112138), new int64(0x597f299c, -60457430), new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817))
    }
    var H = new Array(new int64(0x6a09e667, -205731576), new int64(-1150833019, -2067093701), new int64(0x3c6ef372, -23791573), new int64(-1521486534, 0x5f1d36f1), new int64(0x510e527f, -1377402159), new int64(-1694144372, 0x2b3e6c1f), new int64(0x1f83d9ab, -79577749), new int64(0x5be0cd19, 0x137e2179));
    var l = new int64(0, 0)
        , T2 = new int64(0, 0)
        , a = new int64(0, 0)
        , b = new int64(0, 0)
        , c = new int64(0, 0)
        , d = new int64(0, 0)
        , e = new int64(0, 0)
        , f = new int64(0, 0)
        , g = new int64(0, 0)
        , h = new int64(0, 0)
        , s0 = new int64(0, 0)
        , s1 = new int64(0, 0)
        , Ch = new int64(0, 0)
        , Maj = new int64(0, 0)
        , r1 = new int64(0, 0)
        , r2 = new int64(0, 0)
        , r3 = new int64(0, 0);
    var j, i;
    var W = new Array(80);
    for (i = 0; i < 80; i++)
        W[i] = new int64(0, 0);
    x[k >> 5] |= 0x80 << (24 - (k & 0x1f));
    x[((k + 128 >> 10) << 5) + 31] = k;
    for (i = 0; i < x.length; i += 32) {
        int64copy(a, H[0]);
        int64copy(b, H[1]);
        int64copy(c, H[2]);
        int64copy(d, H[3]);
        int64copy(e, H[4]);
        int64copy(f, H[5]);
        int64copy(g, H[6]);
        int64copy(h, H[7]);
        for (j = 0; j < 16; j++) {
            W[j].h = x[i + 2 * j];
            W[j].l = x[i + 2 * j + 1]
        }
        for (j = 16; j < 80; j++) {
            int64rrot(r1, W[j - 2], 19);
            int64revrrot(r2, W[j - 2], 29);
            int64shr(r3, W[j - 2], 6);
            s1.l = r1.l ^ r2.l ^ r3.l;
            s1.h = r1.h ^ r2.h ^ r3.h;
            int64rrot(r1, W[j - 15], 1);
            int64rrot(r2, W[j - 15], 8);
            int64shr(r3, W[j - 15], 7);
            s0.l = r1.l ^ r2.l ^ r3.l;
            s0.h = r1.h ^ r2.h ^ r3.h;
            int64add4(W[j], s1, W[j - 7], s0, W[j - 16])
        }
        for (j = 0; j < 80; j++) {
            Ch.l = (e.l & f.l) ^ (~e.l & g.l);
            Ch.h = (e.h & f.h) ^ (~e.h & g.h);
            int64rrot(r1, e, 14);
            int64rrot(r2, e, 18);
            int64revrrot(r3, e, 9);
            s1.l = r1.l ^ r2.l ^ r3.l;
            s1.h = r1.h ^ r2.h ^ r3.h;
            int64rrot(r1, a, 28);
            int64revrrot(r2, a, 2);
            int64revrrot(r3, a, 7);
            s0.l = r1.l ^ r2.l ^ r3.l;
            s0.h = r1.h ^ r2.h ^ r3.h;
            Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
            Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);
            int64add5(l, h, s1, Ch, sha512_k[j], W[j]);
            int64add(T2, s0, Maj);
            int64copy(h, g);
            int64copy(g, f);
            int64copy(f, e);
            int64add(e, d, l);
            int64copy(d, c);
            int64copy(c, b);
            int64copy(b, a);
            int64add(a, l, T2)
        }
        int64add(H[0], H[0], a);
        int64add(H[1], H[1], b);
        int64add(H[2], H[2], c);
        int64add(H[3], H[3], d);
        int64add(H[4], H[4], e);
        int64add(H[5], H[5], f);
        int64add(H[6], H[6], g);
        int64add(H[7], H[7], h)
    }
    var m = new Array(16);
    for (i = 0; i < 8; i++) {
        m[2 * i] = H[i].h;
        m[2 * i + 1] = H[i].l
    }
    return m
}

function int64(h, l) {
    this.h = h;
    this.l = l
}

function int64copy(a, b) {
    a.h = b.h;
    a.l = b.l
}

function int64rrot(a, x, b) {
    a.l = (x.l >>> b) | (x.h << (32 - b));
    a.h = (x.h >>> b) | (x.l << (32 - b))
}

function int64revrrot(a, x, b) {
    a.l = (x.h >>> b) | (x.l << (32 - b));
    a.h = (x.l >>> b) | (x.h << (32 - b))
}

function int64shr(a, x, b) {
    a.l = (x.l >>> b) | (x.h << (32 - b));
    a.h = (x.h >>> b)
}

function int64add(a, x, y) {
    var b = (x.l & 0xffff) + (y.l & 0xffff);
    var c = (x.l >>> 16) + (y.l >>> 16) + (b >>> 16);
    var d = (x.h & 0xffff) + (y.h & 0xffff) + (c >>> 16);
    var e = (x.h >>> 16) + (y.h >>> 16) + (d >>> 16);
    a.l = (b & 0xffff) | (c << 16);
    a.h = (d & 0xffff) | (e << 16)
}

function int64add4(e, a, b, c, d) {
    var f = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
    var g = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (f >>> 16);
    var h = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (g >>> 16);
    var i = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (h >>> 16);
    e.l = (f & 0xffff) | (g << 16);
    e.h = (h & 0xffff) | (i << 16)
}

function int64add5(f, a, b, c, d, e) {
    var g = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff);
    var h = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (g >>> 16);
    var i = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (h >>> 16);
    var j = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (i >>> 16);
    f.l = (g & 0xffff) | (h << 16);
    f.h = (i & 0xffff) | (j << 16)
}

function _x509_pemToBase64(a) {
    var s = a;
    s = s.replace("-----BEGIN CERTIFICATE-----", "");
    s = s.replace("-----END CERTIFICATE-----", "");
    s = s.replace(/[ \n]+/g, "");
    return s
}

// function _x509_pemToHex(a) {
//     var b = _x509_pemToBase64(a);
//     // var c = b64tohex(b);
//     // console.log("c : " + c);
//     // var c = certManager.Base64ToHex(b).toLowerCase();
//     // console.log("c : " + c);
//     var c = '3082035130820239a003020102020900e623097e30816249300d06092a864886f70d01010b05003067310b3009060355040613024b52311d301b060355040a131452616f6e53656375726520436f2e2c204c74642e311a3018060355040b13115175616c697479204173737572616e6365311d301b0603550403131452616f6e53656375726520436f2e2c204c74642e301e170d3134303532303031323932385a170d3234303531373031323932385a304d310b3009060355040613024b52311e301c060355040a13154c494720496e737572616e636520436f2e2c4c7464311e301c060355040313154c494720496e737572616e636520436f2e2c4c746430820122300d06092a864886f70d01010105000382010f003082010a02820101009b5226e46889b95079bb7aeefe4fc87fe92f7f50cf2ab977217705caa5b713d19c75e9ceaf3e6ae4d3b8de0ddf39bb601826313b9884c739eb4e55d35a21b87ee075f2861b0fd6f7428e25e13bb4cbf9aacafa1faf12bd041d39520535b37897c6845dcc8817c9fef2b89f18edbf458b003c88193f95c68793465c7b28ea8b236e73d671228ece15d0a338bf25a6bbe00516cfa36f064c785850e070cd94b9d0654d84ccb00b90f1a1724c98ddb71bd9934c2a07eab571413d792970983a782847d02d6924115adea12b57f6d591c8bffb7713ce31cc9d46a970b609074450b5a3e263e647695bf912a72b76be272b7dc1c3ed329316125cc3b0a6d3dc0188df0203010001a31a301830090603551d1304023000300b0603551d0f0404030205e0300d06092a864886f70d01010b050003820101004beffddbc721a18d63031d128b6df95d794679bcf000e2c30f7cc6d1b513657074c04ec45a837a299cc4b8cfb0211221fd12d7e5d1fb4effaf4459523bc03d5be416a5687a28b338d6d7e4c69bdff6459dd9ce3d7a2c023afbb43ab63cdbebacd37c90affd7b13907a3ec1e2c7dfe14dd4719c328f304f022b81852d31abaa60bc1fd51ac9985fa564ced9cd30bba3c7fb9d67b41e94acfd017730c817f2bd55506b213985c84506d7b9a7d598c6a0bc1f96d18a3a774715afdba3983f152a97e594db889fd39150131e62ff1aa219bddb2d634972ae6aede8c9ae08d402f77c43a81ed4862b01bf117fbfef95c2da2f65d8419c3b62af33b31c88b10b0432c0';
//     return c
// }

function _x509_getHexTbsCertificateFromCert(a) {
    var b = ASN1HEX.getStartPosOfV_AtObj(a, 0);
    return b
}

function _x509_getSubjectPublicKeyInfoPosFromCertHex(b) {
    
    var c = ASN1HEX.getStartPosOfV_AtObj(b, 0);
    
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, c);
    
    if (a.length < 1)
        return -1;
    if (b.substring(a[0], a[0] + 10) == "a003020102") {
        if (a.length < 6)
            return -1;
        return a[6]
    } else {
        if (a.length < 5)
            return -1;
        return a[5]
    }
}

function _x509_getSubjectPublicKeyPosFromCertHex(b) {
    var c = _x509_getSubjectPublicKeyInfoPosFromCertHex(b);
    
    if (c == -1)
        return -1;
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, c);
    
    if (a.length != 2)
        return -1;
    var d = a[1];
    if (b.substring(d, d + 2) != '03')
        return -1;
    var e = ASN1HEX.getStartPosOfV_AtObj(b, d);
    if (b.substring(e, e + 2) != '00')
        return -1;
    return e + 2
}

function _x509_getPublicKeyHexArrayFromCertHex(b) {

    var p = _x509_getSubjectPublicKeyPosFromCertHex(b);
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, p);

    if (a.length != 2)
        return [];
    var c = ASN1HEX.getHexOfV_AtObj(b, a[0]);
    var d = ASN1HEX.getHexOfV_AtObj(b, a[1]);
    if (c != null && d != null) {
        return [c, d]
    } else {
        return []
    }
}

function _x509_getPublicKeyHexArrayFromCertPEM(b) {
    var c = _x509_pemToHex(b);
    var a = _x509_getPublicKeyHexArrayFromCertHex(c);

    return a
}

function _x509_getSerialNumberHex() {
    return ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 1])
}

function _x509_getIssuerHex() {
    return ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 3])
}

function _x509_getIssuerString() {
    return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 3]))
}

function _x509_getSubjectHex() {
    return ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 5])
}

function _x509_getSubjectString() {
    return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 5]))
}

function _x509_getSignature() {
    var s = ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [2]);
    var k = s.substring(10, s.length);
    return k
}

function _x509_getCertInfo() {
    var s = ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0]);
    return s
}

function _x509_getNotBefore() {
    var s = ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 4, 0]);
    s = s.replace(/(..)/g, "%$1");
    s = decodeURIComponent(s);
    return s
}

function _x509_getNotAfter() {
    var s = ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 4, 1]);
    s = s.replace(/(..)/g, "%$1");
    s = decodeURIComponent(s);
    return s
}

_x509_DN_ATTRHEX = {
    "0603550406": "C",
    "060355040a": "O",
    "060355040b": "OU",
    "0603550403": "CN",
    "0603550405": "SN",
    "0603550408": "ST",
    "0603550407": "L"
};

function _x509_hex2dn(b) {
    var s = "";
    var a = ASN1HEX.getPosArrayOfChildren_AtObj(b, 0);
    for (var i = 0; i < a.length; i++) {
        var c = ASN1HEX.getHexOfTLV_AtObj(b, a[i]);
        s = s + "/" + _x509_hex2rdn(c)
    }
    return s
}

function _x509_hex2rdn(a) {
    var b = ASN1HEX.getDecendantHexTLVByNthList(a, 0, [0, 0]);
    var c = ASN1HEX.getDecendantHexVByNthList(a, 0, [0, 1]);
    var d = "";
    try {
        d = _x509_DN_ATTRHEX[b]
    } catch (ex) {
        d = b
    }
    c = c.replace(/(..)/g, "%$1");
    var e = decodeURIComponent(c);
    return d + "=" + e
}

function _x509_readCertPEM(b) {
    var c = _x509_pemToHex(b);
    var a = _x509_getPublicKeyHexArrayFromCertHex(c);
    var d = new RSAKey();
    d.setPublic(a[0], a[1]);
    this.subjectPublicKeyRSA = d;
    this.subjectPublicKeyRSA_hN = a[0];
    this.subjectPublicKeyRSA_hE = a[1];
    this.hex = c
}

function _x509_readCertPEMWithoutRSAInit(b) {
    var c = _x509_pemToHex(b);
    var a = _x509_getPublicKeyHexArrayFromCertHex(c);
    this.subjectPublicKeyRSA.setPublic(a[0], a[1]);
    this.subjectPublicKeyRSA_hN = a[0];
    this.subjectPublicKeyRSA_hE = a[1];
    this.hex = c
}

function X509() {
    this.subjectPublicKeyRSA = null;
    this.subjectPublicKeyRSA_hN = null;
    this.subjectPublicKeyRSA_hE = null;
    this.hex = null
}

X509.prototype.readCertPEM = _x509_readCertPEM;
X509.prototype.readCertPEMWithoutRSAInit = _x509_readCertPEMWithoutRSAInit;
X509.prototype.getSerialNumberHex = _x509_getSerialNumberHex;
X509.prototype.getIssuerHex = _x509_getIssuerHex;
X509.prototype.getSubjectHex = _x509_getSubjectHex;
X509.prototype.getIssuerString = _x509_getIssuerString;
X509.prototype.getSubjectString = _x509_getSubjectString;
X509.prototype.getNotBefore = _x509_getNotBefore;
X509.prototype.getNotAfter = _x509_getNotAfter;
X509.prototype.getSignature = _x509_getSignature;
X509.prototype.getCertInfo = _x509_getCertInfo;
var CryptoJS = CryptoJS || function (h, r) {
    var k = {}
        , l = k.lib = {}
        , n = function () {}
        , f = l.Base = {
        extend: function (a) {
            n.prototype = this;
            var b = new n;
            a && b.mixIn(a);
            b.hasOwnProperty("init") || (b.init = function () {
                    b.$super.init.apply(this, arguments)
                }
            );
            b.init.prototype = b;
            b.$super = this;
            return b
        },
        create: function () {
            var a = this.extend();
            a.init.apply(a, arguments);
            return a
        },
        init: function () {},
        mixIn: function (a) {
            for (var b in a)
                a.hasOwnProperty(b) && (this[b] = a[b]);
            a.hasOwnProperty("toString") && (this.toString = a.toString)
        },
        clone: function () {
            return this.init.prototype.extend(this)
        }
    }
        , j = l.WordArray = f.extend({
        init: function (a, b) {
            a = this.words = a || [];
            this.sigBytes = b != r ? b : 4 * a.length
        },
        toString: function (a) {
            return (a || s).stringify(this)
        },
        concat: function (a) {
            var b = this.words
                , d = a.words
                , c = this.sigBytes;
            a = a.sigBytes;
            this.clamp();
            if (c % 4)
                for (var e = 0; e < a; e++)
                    b[c + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((c + e) % 4);
            else if (65535 < d.length)
                for (e = 0; e < a; e += 4)
                    b[c + e >>> 2] = d[e >>> 2];
            else
                b.push.apply(b, d);
            this.sigBytes += a;
            return this
        },
        clamp: function () {
            var a = this.words
                , b = this.sigBytes;
            a[b >>> 2] &= 4294967295 << 32 - 8 * (b % 4);
            a.length = h.ceil(b / 4)
        },
        clone: function () {
            var a = f.clone.call(this);
            a.words = this.words.slice(0);
            return a
        },
        random: function (a) {
            for (var b = [], d = 0; d < a; d += 4)
                b.push(4294967296 * h.random() | 0);
            return new j.init(b, a)
        }
    })
        , m = k.enc = {}
        , s = m.Hex = {
        stringify: function (a) {
            var b = a.words;
            a = a.sigBytes;
            for (var d = [], c = 0; c < a; c++) {
                var e = b[c >>> 2] >>> 24 - 8 * (c % 4) & 255;
                d.push((e >>> 4).toString(16));
                d.push((e & 15).toString(16))
            }
            return d.join("")
        },
        parse: function (a) {
            for (var b = a.length, d = [], c = 0; c < b; c += 2)
                d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << 24 - 4 * (c % 8);
            return new j.init(d, b / 2)
        }
    }
        , p = m.Latin1 = {
        stringify: function (a) {
            var b = a.words;
            a = a.sigBytes;
            for (var d = [], c = 0; c < a; c++)
                d.push(String.fromCharCode(b[c >>> 2] >>> 24 - 8 * (c % 4) & 255));
            return d.join("")
        },
        parse: function (a) {
            for (var b = a.length, d = [], c = 0; c < b; c++)
                d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4);
            return new j.init(d, b)
        }
    }
        , t = m.Utf8 = {
        stringify: function (a) {
            try {
                return decodeURIComponent(escape(p.stringify(a)))
            } catch (b) {
                throw Error("Malformed UTF-8 data");
            }
        },
        parse: function (a) {
            return p.parse(unescape(encodeURIComponent(a)))
        }
    }
        , q = l.BufferedBlockAlgorithm = f.extend({
        reset: function () {
            this._data = new j.init;
            this._nDataBytes = 0
        },
        _append: function (a) {
            "string" == typeof a && (a = t.parse(a));
            this._data.concat(a);
            this._nDataBytes += a.sigBytes
        },
        _process: function (a) {
            var b = this._data
                , d = b.words
                , c = b.sigBytes
                , e = this.blockSize
                , f = c / (4 * e)
                , f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
            a = f * e;
            c = h.min(4 * a, c);
            if (a) {
                for (var g = 0; g < a; g += e)
                    this._doProcessBlock(d, g);
                g = d.splice(0, a);
                b.sigBytes -= c
            }
            return new j.init(g, c)
        },
        clone: function () {
            var a = f.clone.call(this);
            a._data = this._data.clone();
            return a
        },
        _minBufferSize: 0
    });
    l.Hasher = q.extend({
        cfg: f.extend(),
        init: function (a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function () {
            q.reset.call(this);
            this._doReset()
        },
        update: function (a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function (a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function (a) {
            return function (b, d) {
                return (new a.init(d)).finalize(b)
            }
        },
        _createHmacHelper: function (a) {
            return function (b, d) {
                return (new u.HMAC.init(a, d)).finalize(b)
            }
        }
    });
    var u = k.algo = {};
    return k
}(Math);
var CryptoJS = CryptoJS || function (h, s) {
    var f = {}
        , t = f.lib = {}
        , g = function () {
    }
        , j = t.Base = {
        extend: function (a) {
            g.prototype = this;
            var c = new g;
            a && c.mixIn(a);
            c.hasOwnProperty("init") || (c.init = function () {
                    c.$super.init.apply(this, arguments)
                }
            );
            c.init.prototype = c;
            c.$super = this;
            return c
        },
        create: function () {
            var a = this.extend();
            a.init.apply(a, arguments);
            return a
        },
        init: function () {
        },
        mixIn: function (a) {
            for (var c in a)
                a.hasOwnProperty(c) && (this[c] = a[c]);
            a.hasOwnProperty("toString") && (this.toString = a.toString)
        },
        clone: function () {
            return this.init.prototype.extend(this)
        }
    }
        , q = t.WordArray = j.extend({
        init: function (a, c) {
            a = this.words = a || [];
            this.sigBytes = c != s ? c : 4 * a.length
        },
        toString: function (a) {
            return (a || u).stringify(this)
        },
        concat: function (a) {
            var c = this.words
                , d = a.words
                , b = this.sigBytes;
            a = a.sigBytes;
            this.clamp();
            if (b % 4)
                for (var e = 0; e < a; e++)
                    c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
            else if (65535 < d.length)
                for (e = 0; e < a; e += 4)
                    c[b + e >>> 2] = d[e >>> 2];
            else
                c.push.apply(c, d);
            this.sigBytes += a;
            return this
        },
        clamp: function () {
            var a = this.words
                , c = this.sigBytes;
            a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);
            a.length = h.ceil(c / 4)
        },
        clone: function () {
            var a = j.clone.call(this);
            a.words = this.words.slice(0);
            return a
        },
        random: function (a) {
            for (var c = [], d = 0; d < a; d += 4)
                c.push(4294967296 * h.random() | 0);
            return new q.init(c, a)
        }
    })
        , v = f.enc = {}
        , u = v.Hex = {
        stringify: function (a) {
            var c = a.words;
            a = a.sigBytes;
            for (var d = [], b = 0; b < a; b++) {
                var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                d.push((e >>> 4).toString(16));
                d.push((e & 15).toString(16))
            }
            return d.join("")
        },
        parse: function (a) {
            for (var c = a.length, d = [], b = 0; b < c; b += 2)
                d[b >>> 3] |= parseInt(a.substr(b, 2), 16) << 24 - 4 * (b % 8);
            return new q.init(d, c / 2)
        }
    }
        , k = v.Latin1 = {
        stringify: function (a) {
            var c = a.words;
            a = a.sigBytes;
            for (var d = [], b = 0; b < a; b++)
                d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
            return d.join("")
        },
        parse: function (a) {
            for (var c = a.length, d = [], b = 0; b < c; b++)
                d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
            return new q.init(d, c)
        }
    }
        , l = v.Utf8 = {
        stringify: function (a) {
            try {
                return decodeURIComponent(escape(k.stringify(a)))
            } catch (c) {
                throw Error("Malformed UTF-8 data");
            }
        },
        parse: function (a) {
            return k.parse(unescape(encodeURIComponent(a)))
        }
    }
        , x = t.BufferedBlockAlgorithm = j.extend({
        reset: function () {
            this._data = new q.init;
            this._nDataBytes = 0
        },
        _append: function (a) {
            "string" == typeof a && (a = l.parse(a));
            this._data.concat(a);
            this._nDataBytes += a.sigBytes
        },
        _process: function (a) {
            var c = this._data
                , d = c.words
                , b = c.sigBytes
                , e = this.blockSize
                , f = b / (4 * e)
                , f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
            a = f * e;
            b = h.min(4 * a, b);
            if (a) {
                for (var m = 0; m < a; m += e)
                    this._doProcessBlock(d, m);
                m = d.splice(0, a);
                c.sigBytes -= b
            }
            return new q.init(m, b)
        },
        clone: function () {
            var a = j.clone.call(this);
            a._data = this._data.clone();
            return a
        },
        _minBufferSize: 0
    });
    t.Hasher = x.extend({
        cfg: j.extend(),
        init: function (a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function () {
            x.reset.call(this);
            this._doReset()
        },
        update: function (a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function (a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function (a) {
            return function (c, d) {
                return (new a.init(d)).finalize(c)
            }
        },
        _createHmacHelper: function (a) {
            return function (c, d) {
                return (new w.HMAC.init(a, d)).finalize(c)
            }
        }
    });
    var w = f.algo = {};
    return f
}(Math);
(function (h) {
        for (var s = CryptoJS, f = s.lib, t = f.WordArray, g = f.Hasher, f = s.algo, j = [], q = [], v = function (a) {
            return 4294967296 * (a - (a | 0)) | 0
        }, u = 2, k = 0; 64 > k;) {
            var l;
            a: {
                l = u;
                for (var x = h.sqrt(l), w = 2; w <= x; w++)
                    if (!(l % w)) {
                        l = !1;
                        break a
                    }
                l = !0
            }
            l && (8 > k && (j[k] = v(h.pow(u, 0.5))),
                q[k] = v(h.pow(u, 1 / 3)),
                k++);
            u++
        }
        var a = []
            , f = f.SHA256 = g.extend({
            _doReset: function () {
                this._hash = new t.init(j.slice(0))
            },
            _doProcessBlock: function (c, d) {
                for (var b = this._hash.words, e = b[0], f = b[1], m = b[2], h = b[3], p = b[4], j = b[5], k = b[6], l = b[7], n = 0; 64 > n; n++) {
                    if (16 > n)
                        a[n] = c[d + n] | 0;
                    else {
                        var r = a[n - 15]
                            , g = a[n - 2];
                        a[n] = ((r << 25 | r >>> 7) ^ (r << 14 | r >>> 18) ^ r >>> 3) + a[n - 7] + ((g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10) + a[n - 16]
                    }
                    r = l + ((p << 26 | p >>> 6) ^ (p << 21 | p >>> 11) ^ (p << 7 | p >>> 25)) + (p & j ^ ~p & k) + q[n] + a[n];
                    g = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & m ^ f & m);
                    l = k;
                    k = j;
                    j = p;
                    p = h + r | 0;
                    h = m;
                    m = f;
                    f = e;
                    e = r + g | 0
                }
                b[0] = b[0] + e | 0;
                b[1] = b[1] + f | 0;
                b[2] = b[2] + m | 0;
                b[3] = b[3] + h | 0;
                b[4] = b[4] + p | 0;
                b[5] = b[5] + j | 0;
                b[6] = b[6] + k | 0;
                b[7] = b[7] + l | 0
            },
            _doFinalize: function () {
                var a = this._data
                    , d = a.words
                    , b = 8 * this._nDataBytes
                    , e = 8 * a.sigBytes;
                d[e >>> 5] |= 128 << 24 - e % 32;
                d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
                d[(e + 64 >>> 9 << 4) + 15] = b;
                a.sigBytes = 4 * d.length;
                this._process();
                return this._hash
            },
            clone: function () {
                var a = g.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
        s.SHA256 = g._createHelper(f);
        s.HmacSHA256 = g._createHmacHelper(f)
    })(Math);
    (function() {
        var g = CryptoJS
          , l = g.lib
          , e = l.WordArray
          , d = l.Hasher
          , m = []
          , l = g.algo.SHA1 = d.extend({
            _doReset: function() {
                this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(d, e) {
                for (var b = this._hash.words, n = b[0], j = b[1], h = b[2], g = b[3], l = b[4], a = 0; 80 > a; a++) {
                    if (16 > a)
                        m[a] = d[e + a] | 0;
                    else {
                        var c = m[a - 3] ^ m[a - 8] ^ m[a - 14] ^ m[a - 16];
                        m[a] = c << 1 | c >>> 31
                    }
                    c = (n << 5 | n >>> 27) + l + m[a];
                    c = 20 > a ? c + ((j & h | ~j & g) + 1518500249) : 40 > a ? c + ((j ^ h ^ g) + 1859775393) : 60 > a ? c + ((j & h | j & g | h & g) - 1894007588) : c + ((j ^ h ^ g) - 899497514);
                    l = g;
                    g = h;
                    h = j << 30 | j >>> 2;
                    j = n;
                    n = c
                }
                b[0] = b[0] + n | 0;
                b[1] = b[1] + j | 0;
                b[2] = b[2] + h | 0;
                b[3] = b[3] + g | 0;
                b[4] = b[4] + l | 0
            },
            _doFinalize: function() {
                var d = this._data
                  , e = d.words
                  , b = 8 * this._nDataBytes
                  , g = 8 * d.sigBytes;
                e[g >>> 5] |= 128 << 24 - g % 32;
                e[(g + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);
                e[(g + 64 >>> 9 << 4) + 15] = b;
                d.sigBytes = 4 * e.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var e = d.clone.call(this);
                e._hash = this._hash.clone();
                return e
            }
        });
        g.SHA1 = d._createHelper(l);
        g.HmacSHA1 = d._createHmacHelper(l)
    }
    )();
(function() {
    var g = CryptoJS
      , l = g.enc.Utf8;
    g.algo.HMAC = g.lib.Base.extend({
        init: function(e, d) {
            e = this._hasher = new e.init;
            "string" == typeof d && (d = l.parse(d));
            var g = e.blockSize
              , k = 4 * g;
            d.sigBytes > k && (d = e.finalize(d));
            d.clamp();
            for (var p = this._oKey = d.clone(), b = this._iKey = d.clone(), n = p.words, j = b.words, h = 0; h < g; h++)
                n[h] ^= 1549556828,
                j[h] ^= 909522486;
            p.sigBytes = b.sigBytes = k;
            this.reset()
        },
        reset: function() {
            var e = this._hasher;
            e.reset();
            e.update(this._iKey)
        },
        update: function(e) {
            this._hasher.update(e);
            return this
        },
        finalize: function(e) {
            var d = this._hasher;
            e = d.finalize(e);
            d.reset();
            return d.finalize(this._oKey.clone().concat(e))
        }
    })
}
)();
var rng_state;
var rng_pool;
var rng_pptr;

function rng_seed_int(x) {
    rng_pool[rng_pptr++] ^= x & 255;
    rng_pool[rng_pptr++] ^= (x >> 8) & 255;
    rng_pool[rng_pptr++] ^= (x >> 16) & 255;
    rng_pool[rng_pptr++] ^= (x >> 24) & 255;
    if (rng_pptr >= rng_psize)
        rng_pptr -= rng_psize
}

function rng_seed_time() {
    rng_seed_int(new Date().getTime())
}

if (rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
//    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto.random) {
//        var z = window.crypto.random(32);
//        for (t = 0; t < z.length; ++t)
//            rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
//    }
    while (rng_pptr < rng_psize) {
        t = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t >>> 8;
        rng_pool[rng_pptr++] = t & 255
    }
    rng_pptr = 0;
    rng_seed_time()
}

function rng_get_byte() {
    if (rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
            rng_pool[rng_pptr] = 0;
        rng_pptr = 0
    }
    return rng_state.next()
}

function rng_get_bytes(a) {
    var i;
    for (i = 0; i < a.length; ++i)
        a[i] = rng_get_byte()
}

function SecureRandom() {
}

SecureRandom.prototype.nextBytes = rng_get_bytes;
