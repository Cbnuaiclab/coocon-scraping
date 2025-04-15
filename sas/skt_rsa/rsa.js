// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
//    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else{
    //alert("Invalid RSA public key");
    console.log("*** skt/rsa.js  Invalid RSA public key *** ");
  }
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// RSAEncryptOAEP 암호화 함수 추가 Start
function RSAEncryptOAEP(f, e, b){
    f = parseHexStringToString(f);
    var a = oaep_pad(f, (this.n.bitLength() + 7) >> 3, e, b);
    if (a == null) {
        return null
    }
    var g = this.doPublic(a);
    if (g == null) {
        return null
    }
    var d = g.toString(16);
    if ((d.length & 1) == 0) {
        return d
    } else {
        return "0" + d
    }
}

function oaep_pad (q, a) {
    var b = "sha256";
    var l = 32;
    var tempString = "";
    var f = function(i) {
        if (i === null) {
            return false;
        }
        var hashHex = "";
        if (i == "") {
            hashHex = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        } else {
            hashHex = certManager.hashFromHex("SHA256", parseToHexString(i));
        }
        return parseHexStringToString(hashHex);
    }
    if (q.length + 2 * l + 2 > a) {
        //throw "Message too long for RSA"
        return false;        
    }
    var k = "", e;
    for (e = 0; e < a - q.length - 2 * l - 2; e += 1) {
        k += "\x00"
    }
    var h = f("") + k + "\x01" + q;
    var random = Number(Math.floor((new Date()).getTime() /1000)) + "";
    random = certManager.Hash("SHA256", random);
    random = random.substring(0,32);
    var secureRandom = parseToHexArray(random);
    var g = secureRandom;
    var j = oaep_mgf1_arr(g, h.length, f);
    var p = [];
    for (e = 0; e < h.length; e += 1) {
        p[e] = h.charCodeAt(e) ^ j.charCodeAt(e)
    }
    var m = oaep_mgf1_arr(p, g.length, f);
    var d = [0];
    for (e = 0; e < g.length; e += 1) {
        d[e + 1] = g[e] ^ m.charCodeAt(e)
    }
    return new BigInteger(d.concat(p))
}
function oaep_mgf1_arr (c, a, e) {
    var b = "" , d = 0;
    while (b.length < a) {
        b += e(String.fromCharCode.apply(String, c.concat([(d & 4278190080) >> 24, (d & 16711680) >> 16, (d & 65280) >> 8, d & 255])));
        d += 1
    }
    return b
}
function parseByteToHexString(arr) { 
    var result = "";
    for (i in arr) {
        var str = arr[i].toString(16).toUpperCase(); //Number(arr[i].charCodeAt(0)).toString(16);
        
        str = str.length == 0 ? "00" :
              str.length == 1 ? "0" + str : 
              str.length == 2 ? str :
              str.substring(str.length-2, str.length);
        result += str;
    }
    return result;
}

function parseToHexString(str) { 
    var arr = parseToHexArray(str);
    return parseByteToHexString(arr);
}

function parseToHexArray(str) {
    var result = [];
    for (i=0; i<str.length; i++) { 
        result.push(str.charCodeAt(i));
    }
    return result;
}
    
function parseHexStringToString (str) { 
    var result = "";
    while (str.length >= 2) { 
        result += String.fromCharCode(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }

    return result;
}
//RSAEncryptOAEP 암호화 함수 추가 End


// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.encryptOAEP = RSAEncryptOAEP;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

