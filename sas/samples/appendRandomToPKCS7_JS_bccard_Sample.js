/* jshint -W061, -W004 */
var moduleVersion = '20.8.27.1';
var BankName = "비씨카드";
console.log(BankName + " 스크립트 호출됨.");
console.log('Version: ' + moduleVersion);

function iSASObject() {
	console.log("iSASObject 생성자 호출");
	this.iSASInOut = {};

	this.UID = '';
	this.AESKey = '';
	this.EncKey = '';
	this.KeyValue = '';
	this.KeyStr = '';

	this.LowerTempStr = '';
	this.imgBase64 = '';
}

// Base64Decoding 함수
iSASObject.prototype.Base64decode = function (input) {
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = (input + "").replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }

    return output;
};

// AES키값 생성 함수
iSASObject.prototype.genKey = function() {
	this.AESKey = this.hH(this.mL(32));
};

// AES키값 생성에 필요한 함수 1 (랜덤 값 생성인듯)
iSASObject.prototype.mL = function(d) {
    var c;
    var b = new Array(d);
    for (c = 0; c < d; c++) {
        b[c] = Math.round(Math.random() * 255);
    }
    return b;
};

// AES키값 생성에 필요한 함수 2(...)
iSASObject.prototype.hH = function(c) {
    var b = "";
    if (!c) {
        return;
    }
    for (var d = 0; d < c.length; d++) {
        b += ((c[d] < 16) ? "0" : "") + c[d].toString(16);
    }
    return b;
};

// 해당 비밀번호를 dumpPassword로 변환하는 함수.
iSASObject.prototype.makeDumpPassword = function (ainput) {
	var OutResult = '';

	var idx = 0;
	var ch;
	while (idx < ainput.length) {
		ch = ainput[idx++];

		// 소문자
		if((ch >= 'a') && (ch <= 'z')){
			OutResult += "a";
		// 대문자
		}else if((ch >= 'A') && (ch <= 'Z')){
			OutResult += "A";
		// 숫자
		}else if((ch >= '0') && (ch <= '9')){
			if (this.host.indexOf("isson") > 0)	OutResult += "1";
			else OutResult += "0";
		// 특수문자
		}else{
			OutResult += "_";
		}
	}

	return OutResult;
};

iSASObject.prototype.log = function (logMsg) {
	try {
		SASLog("iSASObject.Log(" + logMsg + "\")");
	} catch (e) {
		console.log("iSASObject.Log(" + logMsg + "\")");
	}
};

iSASObject.prototype.log2 = function (logMsg) {
    var Startlog = 0;
    var Templog = 0;
    var Endlog = logMsg.length;
    var logTemp = '';

    while (true) {
        Templog = Endlog - Startlog;
        if ((Templog) == 0) { 
            break;
        } else if ((Templog) < 1000) {
            logTemp = logMsg.substr(Startlog, Templog);
        } else if ((Templog) >= 1000) {
            logTemp = logMsg.substr(Startlog, 1000);
        }
        
        console.log("iSASObject.Log(" + logTemp + "\")");
        if (Templog < 1000) break;
        Startlog += 1000;
    }
};

iSASObject.prototype.setError = function (errcode) {
	this.iSASInOut.Output = {};
	this.iSASInOut.Output.ErrorCode = errcode.toString(16).toUpperCase();
	//TODO: 에러 메시지 가져오는 부분...
	this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16).toUpperCase());
};

iSASObject.prototype.checkError = function () {
	this.errorMsg = StrGrab(httpRequest.result, "\"errMsg\":\"", "\",\"");
	if (this.errorMsg != "") {
		this.log("Juryu ErrorLog [" + this.errorMsg + "]");
		return true;
	} else {
		return false;
	}
};

    /**
    *
    *  Secure Hash Algorithm (SHA256)
    *  http://www.webtoolkit.info/
    *
    *  Original code by Angel Marin, Paul Johnston.
    *
    **/
var chrsz   = 8;

function str2binb (str) {
	var bin = Array();
	var mask = (1 << chrsz) - 1;
	for(var i = 0; i < str.length * chrsz; i += chrsz) {
		bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
	}
	return bin;
}

function binb2hex (binarray) {
	var hex_tab = "0123456789abcdef";
	var str = "";
	for(var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
		hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
	}
	return str;
}

	
iSASObject.prototype.SHA256 = function(s, s_length){
      
	var chrsz   = 8;
	var hexcase = 0;
  
	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
  
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
  
	function core_sha256 (m, l) {
		 
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
			0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
			0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
			0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
			0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
			0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
			0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
			0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
			0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
			0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
			0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 
				   0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
  
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
  
		for ( var i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
  
			for ( var j = 0; j<64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
  
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
  
				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
  
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
  
	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}
  
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
  
		for (var n = 0; n < string.length; n++) {
  
			var c = string.charCodeAt(n);
  
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
  
		}
  
		return utftext;
	}
  
	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}
  
	//s = Utf8Encode(s);
	//return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
	return core_sha256(s, s_length);
}

var 개인카드 = function () {
	//생성자
	console.log(BankName + " 개인카드 생성자 호출");
	this.errorMsg = "";
	this.host = "https://www.bccard.com";
	this.url = "";
	this.param = "";
	this.postData = "";
	this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"," +
					"\"Content-Type\":\"application/x-www-form-urlencoded\"}";
	this.TimeURL = "http://isson.bccard.com/initech/extension/common/tools/Time.jsp";
	//	this.LoginTimer;
	this.bLogIn = false;
	this.isNext = false;
	this.tempInput = "";
	this.resData = "";
	this.UserName = "";
};

개인카드.prototype = Object.create(iSASObject.prototype);


/*
 * 
 */

개인카드.prototype.replayAttack = function (hexx) {
    
}

개인카드.prototype.appendRandomToPKCS7 = function (signed, appendData) {
    
    var tempSignData = signed;
    var replayAttack = appendData;

    
    var index = 0;
    var length = replayAttack.length/2;
    
    tempSignData = this.putLengthToBuf(tempSignData, index + 2, this.getLengthFromBuf(tempSignData, index + 2) + length);
    
    this.log("tempSignData1 : " + tempSignData);
    
    
    
    
    
    index += 4;
    
    index += 2 + parseInt(tempSignData.substr((index + 1)*2, 2),16);
    
    this.log("tempSignData2 index2 : " + index);
    
    tempSignData = this.putLengthToBuf(tempSignData, index + 2, this.getLengthFromBuf(tempSignData, index + 2) + length);
    
    
    this.log("tempSignData2 : " + tempSignData);
    
    index += 4;
    
    tempSignData = this.putLengthToBuf(tempSignData, index + 2, this.getLengthFromBuf(tempSignData, index + 2) + length);
    
    index += 4;
    
    while (true) {
        var tmp = tempSignData.substr(index*2, 2);
        var tmp2 = tempSignData.substr((index*2)+2, 2);
        if (tmp == "02") {
            // '02'는 Integer임
            // 뒤의 4바이트를 넘기면 됨
            index += (1 + 4);
        } else if ((tmp == "30") && (tmp2 == "82")) {
            // '3082'는 뒤에 2바이트가 길이
            index += 4 + this.getLengthFromBuf(tempSignData, index + 2);
        } else if (tmp == "30") {
            // '30'은 SEQUENCE임
            // 뒤의 한바이트가 길이임으로 포함해서 넘기면 됨
            index += 2 + parseInt(tmp2, 16);
        } else if ((tmp == "A0") && (tmp2 == "82")) {
            // 'A082'는 뒤에 2바이트가 길이
            index += 4 + this.getLengthFromBuf(tempSignData, index + 2);
        } else if ((tmp == "31") && (tmp2 == "82")) {
            // 우리가 기다리던 값
            break;
        } else{
            this.log('tempSignData return : ' + tempSignData);
            return null;
        }
    }
    
    
    
    tempSignData = this.putLengthToBuf(tempSignData, index + 2, this.getLengthFromBuf(tempSignData, index + 2) + length);
    
    index += 4;
    
    tempSignData = this.putLengthToBuf(tempSignData, index + 2, this.getLengthFromBuf(tempSignData, index + 2) + length);
    
    index += 4;
    
    
    tempSignData += replayAttack;
    
    return tempSignData;
    
    
}

개인카드.prototype.hex2ascii = function (hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var text = hex.substr(i, 2);
        if (text !== '00')
          str += String.fromCharCode(parseInt(text, 16));
    }
    return str;
}

개인카드.prototype.ascii2hex = function (str) {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i++) {
        var hex = Number(str.charCodeAt(i)).toString(16);
        if (hex.length % 2 === 1) {
          hex = '0' + hex;
        }
        arr.push(hex);
    }
    return arr.join('');
}

개인카드.prototype.putLengthToBuf = function(str, index, length){
    
    index = index*2;
    
    var a = length.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    
    this.log("putLengthToBuf index  : " + index/2);
    this.log("putLengthToBuf length : " + length);
    
    var front = str.substr(0, index);
    
    var back  = str.substring(index + a.length);
    
    this.log("result : " + front + a + back);
    
    this.log("=-================================")
    
    return front + a.toUpperCase() + back;
}

개인카드.prototype.getLengthFromBuf = function(str, index){
    
    index = index*2;
    
    return parseInt(str.substr(index, 2*2), 16);
}

// UID, AESKey, EncKey 세팅처리하는 함수.
개인카드.prototype.initKeyPad = function(aHost) {

	//1. UID Gen
	var g = Math.floor(Math.random() * 99) + 1;
	this.UID = (new Date().getTime()).toString();
	this.UID = this.UID + g;
	this.log("UID:[" + this.UID + "]");
	this.log("UID:[" + this.UID + "]");

	this.host = aHost;
	if (this.host.indexOf("isson") > 0) {
		this.url = '/3rd/inca/jsp/nppfs.keypad.jsp';
	} else {
		// 법인용이라 현재 미사용
		// 법인 사이트 변경 시 통합 필요 (2020.08.27)
		// this.url = '/app/corp/pluginfree/jsp/nppfs.keypad.jsp';
	}

	//"m=p&u=001475730384949"
	var postData = "m=p&u=" + this.UID;
	if (httpRequest.post(this.host + this.url, postData) == false){
		return 'Fail';
	}

	this.log("-vkPad1:[" + httpRequest.result + "]");

	var p = httpRequest.result;
	this.genKey();
	p = StrTrim(p) + "";
	var pubKey;
    if (p.length > 64) {
        var r = p.substring(0, 64);
        var v = p.substring(64);
        this.log("p.encKey:[" + r + "]");
        this.log("p.encData:[" + v + "]");

        r = certManager.HexToBase64(r);
        v = certManager.HexToBase64(v);
        pubKey = certManager.AES_ECB_Decrypt(v, r);
        this.log("publicKey:[" + pubKey + "]");
    }

    this.log("AESKey:[" + this.AESKey + "]");

	this.EncKey = certManager.RSA_public_encrypt(pubKey, this.AESKey);
	this.EncKey = certManager.Base64ToHex(this.EncKey);
	this.log("EncKey:[" + this.EncKey + "]");		

	// 실제 Keypad관련 데이터들이 있는 페이지.
	if (this.host.indexOf("isson") > 0) {
		postData = 'm=e&u=' + this.UID + '&ev=v4&d=nppfs-keypad-div&jv=1.13.0&t=b' + 
		'&at=r&st=l&dp=hide&ut=f&f=dcbe64bd77162a9d1&i=password' +
		'&w=1117&h=853&ar=true' +
		'&ip=https%3A%2F%2Fisson.bccard.com%2F3rd%2Finca%2Fjsp%2Fnppfs.keypad.jsp';
	} else {
		// 법인용이라 현재 미사용
		// 법인 사이트 변경 시 통합 필요 (2020.08.27)
		// postData = 'm=e&d=nppfs-keypad-div&t=b&at=r&st=l&dp=hide&ut=t&ui=keyboard&ta=false' +
		// '&to=%2Fpluginfree%2Ficon%2Ficon_mouse_on.gif' +
		// '&tf=%2Fpluginfree%2Ficon%2Ficon_mouse_off.gif' +
		// '&f=form1&i=login_password&il=20&w=1920&h=1254&ip=%2Fapp%2Fcorp%2Fpluginfree%2Fjsp%2Fnppfs.keypad.jsp';
	}

	if (httpRequest.post(this.host + this.url, postData) == false){
		return 'Fail';
	}
	this.log('headerStr===' + httpRequest.headerStr);
	this.log("-vkPad2:[" + httpRequest.result + "]");

	return httpRequest.result;
};

// KeyPad에 해당하는 secuString값을 가져와서 세팅하는 함수.
개인카드.prototype.setvkPad = function(aInput){
    var JsonInput;
    try{
        JsonInput = JSON.parse(aInput);
    } catch(e) {
        return "Fail";
    }

    // JsonInput.items[0] => 소문자
    // JsonInput.items[1] => 대문자
    // JsonInput.items[2] => 특수문자

	var strTemp = '';
	var idx = 0;

	var LowerStr = '', UpperStr = '', NumberStr = '', SpecialStr = '', SpaceStr = '';
	this.KeyStr = '';

    // 스페이스바
    SpaceStr = StrGrab(JsonInput.items[0].buttons[41].action, 'data:', ':');
	// qwertyuiopasdfghjklzxcvbnm
    // 위치 고정
	for (idx = 0; idx < JsonInput.items[0].buttons.length; idx++) {
        strTemp = JsonInput.items[0].buttons[idx].action;
		if (!StrGrab(strTemp, "data:", ":a")) continue;	

		LowerStr += StrGrab(strTemp, "data:", ":a") + '|';
    }
	if (LowerStr == '') return "Fail";

	// QWERTYUIOPASDFGHJKLZXCVBNM
	// 위치 고정
	for (idx = 0; idx < JsonInput.items[1].buttons.length; idx++) {
		strTemp = JsonInput.items[1].buttons[idx].action;
        if (!StrGrab(strTemp, "data:", ":A")) continue;	

		UpperStr += StrGrab(strTemp, "data:", ":A") + '|';
    }
	if (UpperStr == '') return "Fail";

	// !@#$%^&*()-_=+\|{}[];:'",.<>$~`!@#/?
	// 위치 고정
	for (idx = 0; idx < JsonInput.items[2].buttons.length; idx++) {
		strTemp = JsonInput.items[2].buttons[idx].action;
		if (!StrGrab(strTemp, "data:", ":_")) continue;

		// 공백 제외
		if (JsonInput.items[2].buttons[idx].label != '공백') SpecialStr += StrGrab(strTemp, "data:", ":_") + '|';
    }
	if (SpecialStr == '') return "Fail";
	this.log("SpecialStr::" + SpecialStr);

    // 1 ~ 0
    // 위치 고정
	for (idx = 0; idx < JsonInput.items[0].buttons.length; idx++) {
        strTemp = JsonInput.items[0].buttons[idx].action;
		if (!StrGrab(strTemp, "data:", ":1")) continue;	

		NumberStr += StrGrab(strTemp, "data:", ":1") + '|';
    }
	if (NumberStr == '') return "Fail";

	this.KeyStr = LowerStr + UpperStr + SpecialStr + NumberStr + SpaceStr;
    this.KeyStr = this.KeyStr.split('|');
    
    return JsonInput;
};

개인카드.prototype.makePassWord = function (aPassWord) {
	// KeyValue 초기화
	this.KeyValue = '';

	// KeyValue 세팅
	this.KeyValue = 'qwertyuiop';
	this.KeyValue += 'asdfghjkl';
	this.KeyValue += 'zxcvbnm';
	this.KeyValue += 'QWERTYUIOP';
	this.KeyValue += 'ASDFGHJKL';
	this.KeyValue += 'ZXCVBNM';

	// 특수문자 처리..
	var specArr = '!z@z#z$z%z^z&z*z(z)z-z_z=z+z\\z|z{z}z[z]z;z:z\'z"z,z.z<z>z$z~z`z!z@z#z/z?';
	specArr = specArr.split("z");
	for (var i = 0; i < specArr.length; i++) this.KeyValue += specArr[i];

	// 숫자 처리..
	this.KeyValue += '1234567890';
	this.KeyValue += ' ';

	this.log("KeyValue:[" + this.KeyValue + "]");

	var idx = 0;
	var findTemp = '';
	var enc = '';
	var base64enc = '';
	var findidx = 0;
	// KESKey값 Base64로 변환
	var AESKey = certManager.HexToBase64(this.AESKey);

	// 처리 시작.
	while (idx < aPassWord.length) {
		// 변환하려는 Key값 위치값 얻기.
		// ex) aPassWord[idx++]가 p인 경우, findidx = 9
		findidx = this.KeyValue.indexOf(aPassWord[idx++]);
		// this.log("aPassWord::" + aPassWord[idx - 1]);

		// 위치에 해당하는 secuStr값을 가져옴.
		findTemp = this.KeyStr[findidx];
		// this.log("findTemp::" + findTemp);

		// 암호화 처리.
		enc = certManager.AES_ECB_Encrypt(findTemp, AESKey);

		// 암호화된 값 세팅.
		base64enc += certManager.Base64ToHex(enc);
	}

	this.log('base64enc:["' + base64enc + '"]');
	return base64enc;
};

// 해당 비밀번호를 dumpPassword로 변환하는 함수.
개인카드.prototype.makeDumpPassword = function (ainput) {
	var OutResult = '';

	var idx = 0;
	var ch;
	while (idx < ainput.length) {
		ch = ainput[idx++];

		// 소문자
		if((ch >= 'a') && (ch <= 'z')){
			OutResult += "a";
		// 대문자
		}else if((ch >= 'A') && (ch <= 'Z')){
			OutResult += "A";
		// 숫자
		}else if((ch >= '0') && (ch <= '9')){
			if (this.host.indexOf("isson") > 0)	OutResult += "1";
			else OutResult += "0";
		// 특수문자
		}else{
			OutResult += "_";
		}
	}

	return OutResult;
};

개인카드.prototype.아이디찾기 = function (aInput) {
	this.log(BankName + " 개인카드 아이디찾기 호출[" + aInput + "]");
	try {
		this.isNext = false;

		system.setStatus(IBXSTATE_CHECKPARAM, 30);
		var input = dec(aInput.Input);
		var 인증수단 = input.인증수단;
		var 성명 = input.성명;
		var 주민등록번호 = input.주민등록번호;
		var 휴대폰인증통신사 = input.휴대폰인증통신사;
		var 휴대폰번호 = input.휴대폰번호;
		if (input.주민등록번호) this.iSASInOut.Input.주민등록번호 = input.주민등록번호.replace(/./g, '*');
		if (input.휴대폰번호) this.iSASInOut.Input.휴대폰번호 = input.휴대폰번호.replace(/./g, '*');

		if (!인증수단) {
			this.setError(E_IBX_VERIFICATION_TYPE_NOTENTER);
			return E_IBX_VERIFICATION_TYPE_NOTENTER;
		}
		if (인증수단 == "MOBILE") {
			if (!성명) {
				this.setError(E_IBX_P00012_NAME_NOENTER);
				return E_IBX_P00012_NAME_NOENTER;
			}
			if (!주민등록번호) {
				this.setError(E_IBX_REGNO_RESIDENT_NOTENTER);
				return E_IBX_REGNO_RESIDENT_NOTENTER;
			}
			if (!휴대폰인증통신사) {
				this.setError(E_IBX_W01101_SEARCH_VALUE_NOTENTER);
				this.iSASInOut.Output.ErrorMessage = '휴대폰인증통신사 미입력입니다.';
				return E_IBX_W01101_SEARCH_VALUE_NOTENTER;
			}
			if (!휴대폰번호) {
				this.setError(E_IBX_CELLPHONE_NOTENTER);
				return E_IBX_CELLPHONE_NOTENTER;
			}
			if (성명.length < 2) {
				this.setError(E_IBX_P1100X_NAME_INVALID);
				return E_IBX_P1100X_NAME_INVALID;
			}
			if (!IsCurrency(주민등록번호) || (주민등록번호.length != 13)) {
				this.setError(E_IBX_REGNO_RESIDENT_INVALID);
				return E_IBX_REGNO_RESIDENT_INVALID;
			}

			if (휴대폰인증통신사 == "01") { // SKT
				휴대폰인증통신사 = "1";
			} else if (휴대폰인증통신사 == "02") { // KT
				휴대폰인증통신사 = "2";
			} else if (휴대폰인증통신사 == "03") { // LGU+
				휴대폰인증통신사 = "3";
			} else if (휴대폰인증통신사 == "11") { // SKT알뜰폰
				휴대폰인증통신사 = "5";
			} else if (휴대폰인증통신사 == "12") { // KT알뜰폰
				휴대폰인증통신사 = "6";
			} else if (휴대폰인증통신사 == "13") { // LGU+알뜰폰
				휴대폰인증통신사 = "7";
			} else {
				this.setError(E_IBX_PARAMETER_INVALID);
				this.iSASInOut.Output.ErrorMessage = "휴대폰인증통신사를 잘못 입력하셨습니다.";
				return E_IBX_PARAMETER_INVALID;
			}
			if (!IsCurrency(휴대폰번호) || (휴대폰번호.length != 10 && 휴대폰번호.length != 11)) {
				this.setError(E_IBX_TELEPHONE_INVALID);
				this.iSASInOut.Output.ErrorMessage = "휴대폰번호를 잘못 입력하셨습니다.";
				return E_IBX_TELEPHONE_INVALID;
			}
		} else {
			this.setError(E_IBX_VERIFICATION_TYPE_INVALID);
			return E_IBX_VERIFICATION_TYPE_INVALID;
		}
		

		// 통합회원 > 아이디찾기
		system.setStatus(IBXSTATE_ENTER, 50);

		this.host = "https://www.bccard.com";
		this.url = "/app/card/SearchAmemberIdMembcActn.do";
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("아이디찾기-1:[" + httpRequest.result + "]");
		ResultStr = httpRequest.result;


		// 휴대폰인증 인증번호 전송
		system.setStatus(IBXSTATE_EXECUTE, 80);
		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		this.userAgent += "}";	

		this.url = "/app/card/SendSMSCertActn.do";
		this.postData = "retKey=json";
		this.postData += "&__E2E_RESULT__=";
		this.postData += "&__E2E_UNIQUE__=";
		this.postData += "&mobile_tel_no2__E2E__=";
		this.postData += "&__E2E_KEYPAD__=";
		this.postData += "&certType=sms2";
		this.postData += "&menuType=id_search";
		this.postData += "&certStep=1";
		this.postData += "&socid=" + 주민등록번호.substr(0, 7) + "000000";
		this.postData += "&cert_inst_type=";
		this.postData += "&password=";
		this.postData += "&name=" + httpRequest.URLEncodeAll(성명, "UTF-8");
		this.postData += "&juminNo1=" + 주민등록번호.substr(0, 6);
		this.postData += "&juminNo2=" + 주민등록번호.substr(6, 1);
		this.postData += "&agreeAll=on";
		this.postData += "&agree01=on";
		this.postData += "&agree02=on";
		this.postData += "&agree03=on";
		this.postData += "&agree04=on";
		this.postData += "&mobile_code=" + 휴대폰인증통신사;
		this.postData += "&mobile_ddd_no=" + 휴대폰번호.substr(0, 3);
		this.postData += "&mobile_tel_no1=" + 휴대폰번호.substr(3, 4);
		this.postData += "&mobile_tel_no2=" + 휴대폰번호.substr(7, 4);
		this.postData += "&auth_no=";
		this.postData += "&res_seq=";


		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("아이디찾기-2:[" + httpRequest.result + "]");
		ResultStr = httpRequest.result;

		var rtn_code = StrGrab(ResultStr, '"rtn_code":"', '"');
		var snd_rtn = StrGrab(ResultStr, '"snd_rtn":"', '"');

		if (rtn_code == "0") {
			if (snd_rtn == "0000") {
				this.isNext = true;
				this.tempInput = input;
				this.resData = ResultStr;

				this.iSASInOut.Output = {};
				this.iSASInOut.Output.ErrorCode = "00000000";
				this.iSASInOut.Output.ErrorMessage = "";
				this.iSASInOut.Output.Result = {};
				return S_IBX_OK;
			}else if (snd_rtn == "0001") {
				this.setError(E_IBX_TELEPHONE_INVALID);
				this.iSASInOut.Output.ErrorMessage = "SMS인증은 본인의 휴대전화를 이용해서만 가능합니다.";
				return E_IBX_TELEPHONE_INVALID;
			} else {
				if (snd_rtn == "0011" || snd_rtn == "0012") {
					this.setError(E_IBX_PARAMETER_INVALID);
					this.iSASInOut.Output.ErrorMessage = "유효하지 않은 인증정보입니다.";
					return E_IBX_PARAMETER_INVALID;
				} else if (snd_rtn == "0013" || snd_rtn == "0014" || snd_rtn == "0015" || snd_rtn == "0016" || snd_rtn == "0017") {
					this.setError(E_IBX_UNKNOWN);
					this.iSASInOut.Output.ErrorMessage = "암복호화 처리 오류입니다.";
					return E_IBX_UNKNOWN;
				} else if (snd_rtn == "0018") {
					this.setError(E_IBX_SITE_INTERNAL);
					this.iSASInOut.Output.ErrorMessage = "이통사 통신오류입니다.";
					return E_IBX_SITE_INTERNAL;
				} else if (snd_rtn == "0020" || snd_rtn == "0021" || snd_rtn == "0022") {
					this.setError(E_IBX_PARAMETER_INVALID);
					this.iSASInOut.Output.ErrorMessage = "유효하지 않은 제휴사 코드입니다.";
					return E_IBX_PARAMETER_INVALID;
				} else if (snd_rtn == "0031" || snd_rtn == "0032" || snd_rtn == "0033" || snd_rtn == "0034") {
					this.setError(E_IBX_UNKNOWN);
					this.iSASInOut.Output.ErrorMessage = "인증번호 확인실패입니다.";
					return E_IBX_UNKNOWN;
				} else {
					this.setError(E_IBX_UNKNOWN);
					this.iSASInOut.Output.ErrorMessage = "SMS 전송 중 오류가 발생하였습니다.";
					return E_IBX_UNKNOWN;
				}
			}
		} else {
			if (rtn_code == "-7" || rtn_code == "-8") {
				this.setError(E_IBX_SITE_INTERNAL);
				this.iSASInOut.Output.ErrorMessage = "SMS 전송 중 통신 장애가 발생하였습니다.";
				return E_IBX_SITE_INTERNAL;
			} else if (rtn_code == "-9" || rtn_code == "-10") {
				this.setError(E_IBX_PARAMETER_INVALID);
				this.iSASInOut.Output.ErrorMessage = "입력하신 정보가 잘못되었습니다.";
				return E_IBX_PARAMETER_INVALID;
			} else if (rtn_code == "SESSION_ERROR") {
				this.setError(E_IBX_SESSION_CLOSED);
				this.iSASInOut.Output.ErrorMessage = "고객님께서 회원 정보를 인증 받으신 후 너무 오랜 시간이 경과되었습니다.";
				return E_IBX_SESSION_CLOSED;
			} else if (rtn_code == "PluginFreeException") {
				this.setError(E_IBX_UNKNOWN);
				this.iSASInOut.Output.ErrorMessage = "E2E 검증 오류가 발생하였습니다.";
				return E_IBX_UNKNOWN;
			} else if (rtn_code == "EXCEPTION") {
				this.setError(E_IBX_UNKNOWN);
				this.iSASInOut.Output.ErrorMessage = "SMS 인증데이터 작성 중 시스템 오류가 발생하였습니다.";
				return E_IBX_UNKNOWN;
			} else {
				this.setError(E_IBX_UNKNOWN);
				return E_IBX_UNKNOWN;	
			}
		}
	} catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 개인카드 아이디찾기 finally");
    }
};

개인카드.prototype.아이디찾기2 = function (aInput) {
	this.log(BankName + " 개인카드 아이디찾기2 호출[" + aInput + "]");
	try {
		if (!this.isNext) {
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);
			this.iSASInOut.Output.ErrorMessage = "아이디찾기 후 실행해 주십시오.";
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

		system.setStatus(IBXSTATE_CHECKPARAM, 30);
        var input = dec(aInput.Input);
        var 휴대폰인증번호 = input.휴대폰인증번호;

        if (!휴대폰인증번호) {
			this.setError(E_IBX_PARAMETER_INVALID);
			this.iSASInOut.Output.ErrorMessage = "휴대폰인증번호 미입력입니다.";
            return E_IBX_PARAMETER_INVALID;
		}
		if (!IsCurrency(휴대폰인증번호) || 휴대폰인증번호.length != 6) {
			this.setError(E_IBX_PARAMETER_INVALID);
			this.iSASInOut.Output.ErrorMessage = "잘못된 휴대폰인증번호입니다.";
            return E_IBX_PARAMETER_INVALID;
		}

		// 인증번호 확인
		system.setStatus(IBXSTATE_EXECUTE, 50);
		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		this.userAgent += "}";	

		this.url = "/app/card/SendSMSCheckActn.do";
		this.postData = "retKey=json";
		this.postData += "&__E2E_RESULT__=";
		this.postData += "&__E2E_UNIQUE__=";
		this.postData += "&mobile_tel_no2__E2E__=";
		this.postData += "&__E2E_KEYPAD__=";
		this.postData += "&certType=sms2";
		this.postData += "&menuType=id_search";
		this.postData += "&certStep=1";
		this.postData += "&socid=" + this.tempInput.주민등록번호.substr(0, 7) + "000000";
		this.postData += "&cert_inst_type=" + StrGrab(this.resData, '"cert_inst_type":"', '"');
		this.postData += "&password=";
		this.postData += "&name=" + httpRequest.URLEncodeAll(this.tempInput.성명, "UTF-8");
		this.postData += "&juminNo1=" + this.tempInput.주민등록번호.substr(0, 6);
		this.postData += "&juminNo2=" + this.tempInput.주민등록번호.substr(6, 1);
		this.postData += "&agreeAll=on";
		this.postData += "&agree01=on";
		this.postData += "&agree02=on";
		this.postData += "&agree03=on";
		this.postData += "&agree04=on";
		this.postData += "&mobile_code=" + this.tempInput.휴대폰인증통신사;
		this.postData += "&mobile_ddd_no=" + this.tempInput.휴대폰번호.substr(0, 3);
		this.postData += "&mobile_tel_no1=" + this.tempInput.휴대폰번호.substr(3, 4);
		this.postData += "&mobile_tel_no2=" + this.tempInput.휴대폰번호.substr(7, 4);
		this.postData += "&auth_no=" + 휴대폰인증번호;
		this.postData += "&res_seq=" + StrGrab(this.resData, '"res_seq":"', '"');

		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("아이디찾기2-1:[" + httpRequest.result + "]");
		ResultStr = httpRequest.result;

		var rtn_code = StrGrab(ResultStr, '"rtn_code":"', '"');
		if (rtn_code != "1") {
			if (rtn_code == "9") {
				this.setError(E_IBX_TELEPHONE_INVALID);
				this.iSASInOut.Output.ErrorMessage = "본인 명의의 휴대폰으로 인증하셔야 합니다.";
				return E_IBX_TELEPHONE_INVALID;
			} else {
				this.setError(E_IBX_INSURANCE_NUMBER_INVALID);
				this.iSASInOut.Output.ErrorMessage = "인증번호가 맞지 않습니다.";
				return E_IBX_INSURANCE_NUMBER_INVALID;
			}
		}

		// 아이디 찾기
		system.setStatus(IBXSTATE_EXECUTE, 80);
		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"text/html, application/xhtml+xml, image/jxr, */*\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded\"";
		this.userAgent += "}";	

		this.url = "/app/card/SearchAmemberId02MembcActn.do?site=bccard";
		this.postData = "__E2E_KEYPAD__=";
		this.postData += "&__E2E_UNIQUE__=";
		this.postData += "&INIpluginData=";
		this.postData += "&cert_key=ipin";
		this.postData += "&cert_type=ipin";
		this.postData += "&certGubun=id_search";
		this.postData += "&certStep=1";
		this.postData += "&cert_menu_name=";
		this.postData += "&cert_key=";
		this.postData += "&ipin_enc_data=";
		this.postData += "&socid=";
		this.postData += "&site=bccard";

		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("아이디찾기2-2:[" + httpRequest.result + "]");
		ResultStr = httpRequest.result;
		
		var 아이디 = StrGrab(StrGrab(ResultStr, "회원님의 아이디는", "입니다"), '">', '</');
		if (!아이디) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.아이디 = 아이디;
	} catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 개인카드 아이디찾기2 finally");
    }
};

개인카드.prototype.onIDLogin = function (aUserID, aUserPassword) {
	system.setStatus(IBXSTATE_LOGIN, 35);

	this.host = "http://www.bccard.com";
	this.url = '/app/card/SsoLoginLink.do';
	if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	this.log("-Login1:[" + httpRequest.result + "]");
	var ResultStr = httpRequest.result;

	// /3rd/openIdPasswordSignin.jsp?UURL=https%3A%2F%2Fisson
	var HostSrv = StrGrab(ResultStr, '/3rd/openIdPasswordSignin.jsp?UURL=http%3A%2F%2F', '.');
	if (!HostSrv) HostSrv = StrGrab(ResultStr, '/3rd/openIdPasswordSignin.jsp?UURL=https%3A%2F%2F', '.');
	this.log("HostSrv===" + HostSrv);
	if (!HostSrv) {
		this.setError(E_IBX_SITE_INVALID);
		return E_IBX_SITE_INVALID;
	}

	var vkPad = this.initKeyPad('http://isson.bccard.com');
	if (vkPad == 'Fail'){
		this.setError(E_IBX_SITE_INVALID + 1);
		return E_IBX_SITE_INVALID + 1;		
	}

	// 암호화된 KeyPad값 가져오기.
	var ModifyPass = '';
	var JsonReturn = this.setvkPad(vkPad);
	if (JsonReturn == 'Fail'){
		this.setError(E_IBX_SITE_INVALID + 1);
		return E_IBX_SITE_INVALID + 1;		
	}

	ModifyPass = this.makePassWord(aUserPassword.getPlainText());

	// Dump Password값 생성.
	var dumpPass = '';
	dumpPass = this.makeDumpPassword(aUserPassword.getPlainText());

	system.setStatus(IBXSTATE_LOGIN, 40);

	var agent_header = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",' +
		             '"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",' +
					 '"Content-Type":"application/x-www-form-urlencoded",' +
					 '"Accept-Language":"ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4",' +
					 '"Accept-Encoding":"gzip, deflate",' +
					 '"Referer":"http://isson.bccard.com/3rd/openSigninFormPage.jsp?' + StrGrab(ResultStr, 'action="/3rd/openIdPasswordSignin.jsp?', '"') + '"}';

	this.host = 'https://' + HostSrv + '.bccard.com';
	this.url = '/3rd/openIdPasswordSignin.jsp';
	this.url += '?' + StrGrab(ResultStr, 'action="/3rd/openIdPasswordSignin.jsp?', '"');
	this.log("url===" + this.url);

	this.postData = '__E2E_KEYPAD__=' + this.EncKey.toLowerCase() +
		'&__E2E_UNIQUE__=' + this.UID +
		'&' + JsonReturn.info.inputs.hash + '=' + ModifyPass.toLowerCase() + 
		'&' + JsonReturn.info.inputs.info + '=' + JsonReturn.info.dynamic[1].v +
		'&' + JsonReturn.info.inputs.useyn + '=' + 'Y' +
		'&UURL=' + httpRequest.URLEncodeAll(StrGrab(StrGrab(ResultStr, 'name="UURL"', '>'), 'value="', '"'), 'UTF-8') + // name=UURL => name="UURL"
		'&NONCE=' + httpRequest.URLEncodeAll(StrReplace(StrReplace(StrGrab(StrGrab(ResultStr, 'name="NONCE"', '>'), 'value="', '"'), '\n', ''), '\r', ''), 'UTF-8') + // name=NONCE => name="NONCE"
		'&userid=' + httpRequest.URLEncodeAll(aUserID, 'UTF-8') +        //사용자 아이디
		'&password=' + httpRequest.URLEncodeAll(dumpPass, 'UTF-8')  	 //변환된 사용자 비밀번호
		;
	this.log("postData:[" + this.postData + "]");

	if (httpRequest.postWithUserAgent(agent_header, this.host + this.url, this.postData) == false){
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	ResultStr = httpRequest.result;
	this.log("-Login2:[" + ResultStr + "]");

	//비밀번호
	if (ResultStr.indexOf("인터넷 회원으로 등록되어 있지 않습니다") > -1) {
		this.setError(E_IBX_KEY_ACCOUNT_INFO_2_INVALID);
		return E_IBX_KEY_ACCOUNT_INFO_2_INVALID;
	}
	if (ResultStr.indexOf("아이디,비밀번호 정보가 일치하지 않습니다") > -1) {
		this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_2_INVALID);
		return E_IBX_KEY_ACCOUNT_PASSWORD_2_INVALID;
	}
	if (ResultStr.indexOf("비밀번호 입력 오류 횟 수가 초과되었습니다") > -1) {
		this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_2_DENIED);
		return E_IBX_KEY_ACCOUNT_PASSWORD_2_DENIED;
	}
	if (ResultStr.indexOf("BC카드를 모두 탈회하신 경우") > -1) {
		this.setError(E_IBX_USER_ACCOUNT_DENIED);
		return E_IBX_USER_ACCOUNT_DENIED;
	}
	if ((ResultStr.indexOf("죄송합니다.잘못된 접근입니다") > -1) || (ResultStr.indexOf("죄송합니다.URL에 직접 접근하는 것은 허용되지 않습니다") > -1)) {
		this.setError(E_IBX_LOGIN_FAIL);
		return E_IBX_LOGIN_FAIL;
	}

	this.host = 'https://' + HostSrv + '.bccard.com';
	this.url = '/nls3/fcs';

	this.postData  = 'cmd=' + StrGrab(ResultStr, 'name="cmd" value="', '">');
	this.postData += '&userid=' + httpRequest.URLEncodeAll(StrGrab(ResultStr, 'name="userid" value="', '">'));   // 사용자아이디
	this.postData += '&enuserid=' + StrGrab(ResultStr, 'name="enuserid" value="', '"');   //
	this.postData += '&toa=' + StrGrab(ResultStr, 'name="toa" value="', '">');
	this.postData += '&userip=' + httpRequest.URLEncodeAll(StrGrab(ResultStr, 'name="userip" value="', '">'));
	this.postData += '&nonce=' + httpRequest.URLEncodeAll(StrGrab(ResultStr, 'name="nonce" value="', '">'));
	this.postData += '&signature=' + httpRequest.URLEncodeAll(StrGrab(ResultStr, 'name="signature" value="', '">'));
	this.postData += '&certificate=' + httpRequest.URLEncodeAll(StrGrab(ResultStr, 'name="certificate" value="', '">'));
	this.postData += '&verifyEncrypte=' + httpRequest.URLEncodeAll(StrGrab(ResultStr, 'name="verifyEncrypte" value="', '"'));

	this.log("this.postData = " + this.postData);

	if (httpRequest.postWithUserAgent(agent_header, this.host + this.url, this.postData) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	this.log("-Login3:[" + httpRequest.result + "]");

	this.host = "https://www.bccard.com";
	this.url = "/app/card/MyBcSubIndex.do";
	//    this.url = "/app/card/MainActn.do";

	if (httpRequest.getWithUserAgent(agent_header, this.host + this.url) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	resBlock = httpRequest.result;
	this.log("aaaaaaaa==" + resBlock);

	if (resBlock.indexOf("회원님은 현재 BC카드 미소지회원이십니다") > -1 ) {
		this.setError(E_IBX_CARD_NOT_FOUND );
		return E_IBX_CARD_NOT_FOUND ;
	}
	if (resBlock.indexOf("아이디,비밀번호 정보가 일치하지 않습니다") > -1) {
		this.setError(E_IBX_KEY_ACCOUNT_INFO_2_INVALID);
		return E_IBX_KEY_ACCOUNT_INFO_2_INVALID;
	}
	if (resBlock.indexOf("비밀번호 입력 오류 횟 수가 초과되었습니다") > -1) {
		this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_2_DENIED);
		return E_IBX_KEY_ACCOUNT_PASSWORD_2_DENIED;
	}
	if (resBlock.indexOf("로그인 대기 시간을 초과하여 로그인 할 수 없습니다") > -1) {
		this.setError(E_IBX_SESSION_REMAINED);
		return E_IBX_SESSION_REMAINED;
	}
	if (resBlock.indexOf(">죄송합니다.<") > -1) {	//아이디 앞, 뒤에 공백 들어갔을 경우 
		this.setError(E_IBX_LOGIN_FAIL);
		return E_IBX_LOGIN_FAIL;
	}
	// 실제 로그인 여부 확인.
	if (resBlock.indexOf('>로그아웃<') < 0 &&
		resBlock.indexOf('/app/card/view/login/logout.jsp') < 0) {
		this.setError(E_IBX_LOGIN_FAIL);
		return E_IBX_LOGIN_FAIL;
	}

	// 사용자이름 처리 위해 회원정보변경 페이지 조회
	this.url = "/app/card/MemberInfoViewActn.do";

	if (httpRequest.getWithUserAgent(agent_header, this.host + this.url) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	ResultStr = httpRequest.result;
	this.log('회원정보변경 페이지 : [' + ResultStr + ']');
	//세션체크함수
	sessionChk = this.세션체크함수(ResultStr);

	if (ResultStr.indexOf(">웹회원정보 보기<") < 0) {
		this.setError(E_IBX_SITE_INVALID);
		return E_IBX_SITE_INVALID;
	}

	ResultStr = StrGrab(ResultStr, ">웹회원정보 보기<", "</table>");
	ResultStr = StrGrab(ResultStr, "<tbody>", "</tbody>");
	this.UserName = StrGrab(StrGrab(ResultStr, "<td", "</td>"), ">", "");
	return S_IBX_OK;
};

개인카드.prototype.인증서등록 = function (aInput) {
	this.log(BankName + " 개인카드 인증서등록 호출[" + aInput + "]");

	try {

		// 쿠키 초기화.
		this.host = "https://www.bccard.com";
		httpRequest.clearCookie("bccard.com");

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);

        if (input.주민등록번호) this.iSASInOut.Input.주민등록번호 = input.주민등록번호.replace(/./g, '*');
        if (input.인증서 && input.인증서.비밀번호) this.iSASInOut.Input.인증서.비밀번호 = input.인증서.비밀번호.replace(/./g, '*');

        var certpath = input.인증서.이름;

        if (!certpath) {
            this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
            return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
        }
        if (!input.인증서.비밀번호) {
            this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
            return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
        }
        if (!input.주민등록번호) {
            this.setError(E_IBX_REGNO_RESIDENT_NOTENTER);
            return E_IBX_REGNO_RESIDENT_NOTENTER;
        }

		// 메모리에서 검출되지 않게 반드시 이렇게 써야함
        var 주민등록번호 = sas.SecureData.create(input.주민등록번호);
        if (주민등록번호.isSecurData()) {
			this.log('주민등록번호 SASSecurData 포맷!');
            if (!IsCurrency(주민등록번호.getPlainText()) ||주민등록번호.getLength() != 13) {
                this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                return E_IBX_REGNO_RESIDENT_INVALID;
            }
        } else {
			this.log('주민등록번호 일반 포맷!');
			if (isJuminValid(StrTrim(input.주민등록번호)) == false) {
                this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                return E_IBX_REGNO_RESIDENT_INVALID;
            }
        }

        var password = sas.SecureData.create(input.인증서.비밀번호);
        if (password.isSecurData()) {
            this.log('사용자비밀번호 SASSecurData 포맷!');
        } else {
            this.log('사용자비밀번호 일반 포맷!');
        }

		this.url = "/initech/extension/crosswebex6.js";
		var ResultStr;
		var SCert;
	
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("-인증서등록0:[" + httpRequest.result + "]");
		ResultStr = httpRequest.result;
	
		if (ResultStr.indexOf('SCert +=') < 0) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
	
		var resBlock = StrGrab(ResultStr, 'var SCert;', '//2048 Real-CA', 1);
		this.log("resBlock = " + resBlock);
	
		eval(resBlock);
		this.log("SCert:[" + SCert + "]");
	
		certManager.LoadCert(SCert);		

		// 공인인증서 등록 페이지..
		this.url = "/app/card/CertRegInputActn.do";
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var ResultStr = httpRequest.result;
		this.log("인증서등록1: [" + ResultStr + "]");

		if (!certManager.findCert(JSON.stringify(input.인증서))) {
			this.log("인증서를 찾을 수 없습니다.");
			this.setError(E_IBX_CERTIFY_NOT_FOUND);
			return E_IBX_CERTIFY_NOT_FOUND;
		} else {
			this.log("인증서 찾음.");
		}
	
		if (!certManager.verifyPassword(password.getPlainText())) {
			this.log("certManager.verifyPassword 실패");
			this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
			return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
		} else {
			this.log("certManager.verifyPassword 성공");
		}

		//Keypad
		var zeroStr = "";
		while(zeroStr.length < 15){
			zeroStr += "0";
		}
		this.UID = (new Date().getTime()).toString();
		this.UID = zeroStr.substring(0, 15 - this.UID.length) + this.UID;
	
		this.log("UID:[" + this.UID + "]");
		
		this.host = "http://isson.bccard.com";
		this.url = '/app/card/inca/jsp/nppfs.keypad.jsp';
		var postData = "m=p&u=" + this.UID;
		if (httpRequest.post(this.host + this.url, postData) == false){
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("-vkPad1:[" + httpRequest.result + "]");

		var p = httpRequest.result;
		this.genKey();
		p = StrTrim(p) + "";
		var pubKey;
		if (p.length > 64) {
			var r = p.substring(0, 64);
			var v = p.substring(64);
			this.log("p.encKey:[" + r + "]");
			this.log("p.encData:[" + v + "]");

			r = certManager.HexToBase64(r);
			v = certManager.HexToBase64(v);
			pubKey = certManager.AES_ECB_Decrypt(v, r);
			this.log("publicKey:[" + pubKey + "]");
		}

		this.log("AESKey:[" + this.AESKey + "]");

		this.EncKey = certManager.RSA_public_encrypt(pubKey, this.AESKey);
		this.EncKey = certManager.Base64ToHex(this.EncKey);
		this.log("EncKey:[" + this.EncKey + "]");	
		postData = 'm=e&d=nppfs-keypad-div&t=p&at=r&st=l&dp=hide&ut=t&ui=v_keypad_toggle1&ta=false' + 
				   '&to=%2Fpluginfree%2Ficon%2Ficon_mouse_on.gif&tf=%2Fpluginfree%2Ficon%2Ficon_mouse_off.gif' + 
				   '&f=sendform&i=registcode2&il=7&tx=default&w=1870&h=970&ip=https%3A%2F%2Fwww.bccard.com%2Fapp' +
				   '%2Fcard%2Finca%2Fjsp%2Fnppfs.keypad.jsp';	
		if (httpRequest.post(this.host + this.url, postData) == false){
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log('headerStr===' + httpRequest.headerStr);
		this.log("-vkPad2:[" + httpRequest.result + "]");

		var vkPad = httpRequest.result + '';
		this.log('vkPad value = [' + vkPad + ']');
		if (!vkPad) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;		
		}
		
		var vkMap = StrGrab(vkPad, 'L.u8d(L.h2b("', '"));'); // Hex로 처리된 Base64데이터값.
		var kpdNm = StrTrim(StrGrab(vkPad, 'var kpd =', ';')); // KeyPad값

		var urlTemp = '';

		urlTemp = StrGrab(vkPad, 'Img").src = "', '";');
		this.log('keypad img url = ' + urlTemp);

		if (httpRequest.get(urlTemp) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.imgBase64 = httpRequest.getB64Result();
		this.log('keypad imgBase64 = ' + this.imgBase64);

		if(!this.imgBase64){
			this.setError(E_IBX_SITE_INVALID + 2);
			return E_IBX_SITE_INVALID + 2;
		}

		var nw = StrGrab(vkPad, 'this.nw = "', '";');
		var Ux = StrGrab(vkPad, 'this.Ux = "', '";');
		var jM = StrGrab(vkPad, 'this.jM = "', '";');
		var jMValue = StrGrab(vkPad, 'kpd.jM, value : "', '"');

		if(!nw || !Ux || !jM || !jMValue){
			this.setError(E_IBX_SITE_INVALID + 3);
			return E_IBX_SITE_INVALID + 3;
		}

		// 암호화된 KeyPad값 가져오기.
		var mapStr = certManager.HexDecode(vkMap);
		if (mapStr.indexOf('nppfs-div-keypad') < 0) {
			mapStr = this.Base64decode(mapStr);
		}
		this.log('mapStr:["' + mapStr + '"]');

		//키패드 값영역
		this.LowerTempStr = StrGrab(mapStr, "Img'>", "</map>");
		this.KeyStr = [];
		var idx = 0;
		var strTemp = '';
		var i = 0;

		//키패드 값 저장
		while(true){
			idx++;
			strTemp = StrGrab(this.LowerTempStr, kpdNm + ".put('",  "',", idx);
			if (strTemp == '') break;
			this.KeyStr.push(strTemp);
		}

		try {
			SASImage.setImageFromBase64(this.imgBase64);
		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_LIBRARY_UPDATE);
			return E_IBX_LIBRARY_UPDATE;
		}		

		this.KeyValue = '1234';
		// 이미지를 순서대로 저장
		var coordsM = [];
		var coords = '';

		//숫자 이미지들의 픽셀당 RGB값
		var numberTable = [
			// 5
			'$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$141$148$164$139$146$162$136$143$157$132$138$153$128$134$149$124$130$143$121$127$141$124$130$145$130$136$152$125$132$147$116$122$136$117$123$137$126$133$149$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$136$142$157$120$126$139$106$112$124$124$128$135$143$146$152$139$142$147$180$181$184$180$181$183$185$187$190$116$122$136$140$144$153$219$220$221$200$200$202$113$117$129$123$130$145$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$123$129$142$220$221$222$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$219$220$221$112$118$131$147$150$158$255$255$255$255$255$255$229$229$230$116$121$132$125$132$149$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$229$229$230$200$201$202$179$180$183$247$247$247$247$247$247$140$143$149$123$129$144$117$123$138$151$153$158$219$220$221$255$255$255$161$163$167$119$126$141$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$134$136$140$108$114$126$101$105$113$255$255$255$210$210$212$106$112$124$133$140$156$132$139$155$117$123$137$134$136$141$255$255$255$179$180$183$115$121$136$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$142$144$150$125$132$146$145$148$155$255$255$255$238$238$239$100$106$117$130$136$152$131$138$154$117$123$137$146$148$151$255$255$255$179$180$183$115$121$136$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$142$144$150$127$134$149$115$120$130$255$255$255$255$255$255$168$169$172$119$123$132$97$102$114$136$139$144$229$229$230$255$255$255$161$162$167$119$126$141$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$119$125$138$219$220$221$255$255$255$146$149$155$131$138$153$119$126$139$190$191$193$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$238$238$239$115$120$131$125$132$149$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$129$135$149$168$171$176$185$186$189$137$141$151$135$142$157$134$140$156$112$118$130$181$182$185$238$238$239$255$255$255$255$255$255$255$255$255$200$200$202$112$117$127$122$129$144$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$139$146$160$130$137$152$127$134$148$134$140$155$138$145$161$138$145$161$134$141$155$122$128$142$110$116$129$104$110$122$103$108$121$106$111$124$115$121$135$126$133$149$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148',
			// 7
			'$144$151$166$143$150$166$143$150$165$142$149$165$129$135$149$168$171$176$186$188$191$123$129$142$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$119$125$138$219$220$221$255$255$255$111$116$128$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$106$112$123$139$146$162$138$145$161$138$145$160$137$144$160$134$141$157$127$134$149$118$124$139$111$117$130$106$112$124$106$112$125$116$122$136$125$132$149$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$106$112$123$139$146$162$137$144$160$131$138$152$119$125$139$104$110$122$141$143$149$179$180$182$219$220$221$238$238$239$255$255$255$183$185$188$118$124$140$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$106$111$122$133$140$155$118$124$138$122$125$133$190$191$193$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$183$185$188$118$124$140$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$94$99$109$116$120$131$190$191$193$255$255$255$255$255$255$247$247$247$210$210$212$169$170$173$140$143$149$110$114$125$104$110$123$116$122$136$125$132$149$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$133$135$139$238$238$239$255$255$255$229$229$230$160$162$165$101$107$118$113$119$132$120$126$141$126$133$148$130$137$153$132$139$156$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$116$122$134$219$220$221$255$255$255$255$255$255$247$247$247$170$171$174$106$112$123$124$131$145$133$140$155$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$121$127$140$219$220$221$255$255$255$229$229$230$120$124$132$121$127$141$135$141$156$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$132$139$153$143$147$156$146$149$156$123$127$138$129$136$151$137$144$160$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148',
			// 8
			'$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$139$146$162$130$137$151$118$125$137$112$118$130$115$121$134$125$132$145$131$138$153$124$130$145$108$113$126$133$136$144$143$146$153$104$110$122$119$126$141$128$135$151$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$141$147$162$125$131$145$144$147$153$210$211$212$247$247$247$210$210$212$172$174$177$102$107$119$151$153$158$238$238$239$255$255$255$255$255$255$247$247$247$161$163$168$116$123$137$128$135$152$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$133$140$154$134$138$145$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$168$169$172$247$247$247$255$255$255$238$238$239$247$247$247$255$255$255$247$247$247$122$126$135$124$131$147$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$123$129$142$200$201$203$255$255$255$210$211$212$125$128$134$146$148$152$229$229$230$255$255$255$255$255$255$134$136$141$100$105$118$104$109$117$210$210$212$255$255$255$170$172$175$118$124$140$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$117$123$135$219$220$221$247$247$247$104$109$117$125$132$146$115$121$134$157$158$162$255$255$255$210$210$212$106$112$124$132$139$155$122$129$143$124$126$132$255$255$255$179$180$182$115$121$136$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$117$123$135$219$220$221$255$255$255$115$119$125$122$128$142$112$118$131$157$158$162$255$255$255$219$220$221$104$109$121$130$137$153$120$127$141$148$149$154$255$255$255$179$180$182$115$121$136$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$124$130$143$200$201$203$255$255$255$219$220$221$146$148$152$157$158$162$247$247$247$255$255$255$255$255$255$156$158$161$96$101$113$115$119$125$210$210$212$255$255$255$171$172$176$118$125$140$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$134$141$155$125$129$138$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$145$147$150$238$238$239$255$255$255$247$247$247$255$255$255$255$255$255$247$247$247$112$117$127$125$132$148$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$141$148$163$128$134$149$136$139$147$200$201$202$219$220$221$200$201$202$143$146$152$110$115$128$132$136$143$219$220$221$255$255$255$255$255$255$238$238$239$130$134$141$120$127$141$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$140$147$162$132$138$153$122$128$141$116$122$135$119$126$139$129$135$149$134$140$156$127$133$148$112$118$131$125$128$138$124$128$136$108$114$127$122$129$144$130$137$152$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148',
			// 9
			'$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$138$145$160$125$131$145$117$123$133$151$154$159$181$182$185$160$162$166$133$136$144$112$118$131$128$135$150$134$141$158$134$141$157$130$137$153$127$134$150$128$135$151$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$140$147$162$122$128$142$162$163$167$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$219$220$221$116$121$132$128$135$151$130$137$152$125$131$142$149$152$160$125$130$142$126$133$149$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$132$138$152$143$146$152$255$255$255$255$255$255$247$247$247$200$201$202$229$229$230$255$255$255$255$255$255$200$200$202$116$122$136$127$134$149$166$168$173$255$255$255$152$155$161$120$127$143$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$121$128$140$210$211$212$255$255$255$179$181$183$101$106$118$113$119$132$109$115$127$110$114$121$255$255$255$255$255$255$106$111$124$129$136$151$106$110$120$255$255$255$179$181$183$116$122$137$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$117$123$135$219$220$221$247$247$247$107$111$119$132$138$153$138$145$161$137$144$159$111$117$129$200$201$202$255$255$255$103$109$121$127$133$148$116$119$127$255$255$255$178$180$182$114$120$135$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$118$124$137$219$220$221$255$255$255$137$140$144$123$130$144$136$143$159$135$142$156$106$111$123$219$220$221$247$247$247$101$106$119$107$112$125$200$200$202$255$255$255$180$181$184$117$123$138$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$126$133$146$181$182$185$255$255$255$229$229$230$138$140$145$101$106$118$99$104$115$157$158$162$255$255$255$189$190$192$106$110$116$179$180$182$255$255$255$255$255$255$121$125$133$123$130$146$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$137$143$158$119$125$135$229$229$230$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$160$162$166$116$122$136$128$135$152$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$132$139$154$120$125$136$171$172$175$219$220$221$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$238$238$239$210$210$212$141$144$150$115$121$135$128$135$151$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$141$148$164$135$142$158$126$132$146$115$120$133$107$113$125$105$111$122$105$110$122$104$109$121$104$110$122$107$113$126$114$120$134$124$130$145$130$137$154$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148',
			// 0
			'$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$140$147$163$132$139$154$119$125$138$105$111$122$134$137$144$142$144$150$141$144$150$141$144$149$142$144$150$122$125$135$105$110$122$115$122$135$126$133$149$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$141$148$163$129$135$150$125$128$137$210$211$212$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$247$247$247$200$200$202$113$118$129$124$131$146$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$134$141$155$126$130$139$247$247$247$255$255$255$255$255$255$219$220$221$219$220$221$219$220$221$219$220$221$219$220$221$229$229$230$255$255$255$255$255$255$229$229$230$105$111$123$126$133$150$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$124$130$143$200$201$203$255$255$255$190$191$193$97$103$113$111$117$130$113$119$131$112$118$131$112$118$130$111$117$129$107$112$125$103$107$116$219$220$221$255$255$255$161$163$167$120$126$142$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$117$123$135$219$220$221$255$255$255$119$122$129$131$138$153$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$119$125$140$146$148$151$255$255$255$179$180$183$115$121$136$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$117$123$135$219$220$221$255$255$255$116$119$127$129$136$151$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$133$140$157$117$123$137$156$158$161$255$255$255$179$180$183$115$121$136$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$124$131$144$200$201$203$255$255$255$210$211$212$105$110$118$104$110$121$105$111$122$105$110$122$104$109$121$103$109$121$101$106$118$112$115$122$238$238$239$255$255$255$161$163$167$120$126$142$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$136$142$157$116$121$131$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$229$229$230$105$111$123$126$133$150$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$131$138$152$116$120$130$200$201$202$238$238$239$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$238$238$239$179$181$183$115$120$132$124$131$146$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148$144$151$166$143$150$166$143$150$165$142$149$165$142$149$164$141$148$164$134$140$156$122$128$141$111$117$129$106$112$124$105$111$122$105$110$122$104$109$121$103$109$121$104$109$122$109$114$127$118$124$138$127$134$150$131$138$154$129$136$153$128$135$152$126$133$150$125$132$149$124$131$148'
		];

		// 5, 7, 8, 9, 0 좌표값 가져오기
		for(idx = 0; idx < 11; idx ++){
			if ((idx < 5) || (idx == 6)) continue;

			coords = StrGrab(this.LowerTempStr, "data-coords='", "'", idx);
			coordsM[i++] = coords;
		}

		var rgbIdentity = '';
		for (i = 0; i < coordsM.length; i++){
			rgbIdentity = '';
			var x1 = '', x2 = '', y1 = '', y2 = '';
			x1 = parseInt(StrGrab(coordsM[i], '', ',')); 		// 시작 x점
			y1 = parseInt(StrGrab(coordsM[i], ',', ',', 1)); // 시작 y점
			x2 = parseInt(StrGrab(coordsM[i], ',', ',', 2)); // 끝 x점
			y2 = parseInt(StrGrab(coordsM[i], ',', '', 3));  // 끝 y점
			// 해당 좌표 RGB값 추출..
			for (var x = Number(x1) + 12; x < Number(x2) - 12; x++) {
				for (var y = Number(y1) + 5; y < Number(y2) - 5; y++) {
					rgbIdentity += SASImage.getPixel(x, y);
				}
			}

			this.log('rgb :[' + rgbIdentity + ']');

			// 찾은 RGB identity에 해당하는 String값으로 세팅.
			for (var j = 0; j < 5; j++) {
				if (rgbIdentity == numberTable[j]){
					this.log(this.KeyValue);
					if (j == 0){
						this.KeyValue += '5';
						break;
					} else if (j == 1){
						this.KeyValue += '7';
						break;
					} else if (j == 2){
						this.KeyValue += '8';
						break;
					} else if (j == 3){
						this.KeyValue += '9';
						break;
					} else if (j == 4){
						this.KeyValue += '0';
						break;
					} 
				}
			}			
		}

		if (this.KeyValue.length > 9) {
			this.setError(E_IBX_SITE_INVALID + 4);
			return E_IBX_SITE_INVALID + 4;
		}

		//1234XXXXX >> 1234X6XXXX
		this.KeyValue = this.KeyValue.substr(0, 5) + '6' + this.KeyValue.substr(5);
		this.log('KeyValue sequence : [' + this.KeyValue + ']');
		
		var AESKey = certManager.HexToBase64(this.AESKey);

		//입력 값에 대한 키패드 값 매칭 시작
		var ModifyJumin = 주민등록번호.getPlainTextWithRange(6, 7);
		var findIdx = 0;
		var findTemp = '';
		var base64enc = '';
		var tempBase64enc = '';
		for(idx = 0; idx < ModifyJumin.length; idx++){
			// 변환하려는 Key값 위치값 얻기
			findIdx = this.KeyValue.indexOf(ModifyJumin[idx]);

			// 위치에 해당하는 secuStr값을 가져옴.
			findTemp = this.KeyStr[findIdx];

			// 암호화 처리
			var enc = certManager.AES_ECB_Encrypt(findTemp, AESKey);

			// 암호화된 값.
			tempBase64enc = certManager.Base64ToHex(enc);

			this.log(ModifyJumin[idx] + ' to base64enc = [' + tempBase64enc + ']');

			base64enc += tempBase64enc;
		}

		this.log('base64enc:[' + base64enc + ']');
		
		// 입력된 주민등록 뒷자리 길이만큼 Dump 값(1 고정) 생성
		var dumpJumin = '';
		for(idx = 0; idx < ModifyJumin.length; idx++){
			dumpJumin += '1';
		}

		ModifyJumin = base64enc;

		// PluginData에 넣을 Value
		var postTemp  = "__E2E_RESULT__=";
			postTemp += "&__E2E_UNIQUE__=" + this.UID;
			postTemp += "&registcode2__E2E__=";
			postTemp += "&__E2E_KEYPAD__=" + this.EncKey.toLowerCase();
			postTemp += '&' + nw + '=' + ModifyJumin.toLowerCase();
			postTemp += '&__KI_' + jM + '=' + jMValue;
			postTemp += '&' + Ux + '=' + 'Y';
			postTemp += "&gubun=inq"; // inq: 기등록 조회, reg: 등록, upd: 갱신
			postTemp += "&registcode1=" + 주민등록번호.getPlainTextWithRange(0, 6);
			postTemp += "&registcode2=" + dumpJumin;

		this.log("postTemp: [" + postTemp + "]");

		var InpugData = '';
		InpugData = certManager.MakeINIpluginData(11, postTemp, password.getPlainText(), "https://www.bccard.com/app/card/view/initech/plugin/tools/Random.jsp");
		this.log("InpugData: [" + InpugData + "]");

		this.postData  = "retKey=json";
		this.postData += "&__E2E_RESULT__=";
		this.postData += "&__E2E_UNIQUE__=";
		this.postData += "&__E2E_KEYPAD__=";
		this.postData += "&INIpluginData=" + httpRequest.URLEncodeAll(InpugData);
		this.postData += "&gubun=inq"; // inq: 기등록 조회, reg: 등록, upd: 갱신
		this.postData += "&registcode1=";
		this.postData += "&registcode2=";
		
		this.log("postData: [" + this.postData + "]");
	
		this.url = "/app/card/CertRegActn.do";
		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
	
		ResultStr = httpRequest.result;
		this.log("인증서등록2 [" + ResultStr + "]");

		if (ResultStr.indexOf('죄송합니다') > -1) {
			// 오류가 발생한 경우..
			if (ResultStr.indexOf("인증 받으신 공인인증서는 본인의 공인인증서가 아닙니다") >= 0) {
				this.setError(E_IBX_LOGIN_REG_CERT_FAIL);
				return E_IBX_LOGIN_REG_CERT_FAIL;
			} else if (ResultStr.indexOf("인증받으신 인증서는 현재 유효한 인증서가 아닙니다") >= 0) {
				this.setError(E_IBX_CERTIFY_UNKNOWN);
				this.iSASInOut.Output.ErrorMessage = "인증받으신 인증서는 현재 유효한 인증서가 아닙니다. 발급기관을 통하여 다시한번 확인해 주십시오.";
				return E_IBX_CERTIFY_UNKNOWN;
			} else if (ResultStr.indexOf("공인인증서 또는 ISP가 유효하지 않거나") >= 0) {
				this.setError(E_IBX_CERTIFY_UNKNOWN);
				this.iSASInOut.Output.ErrorMessage = "공인인증서 또는 ISP가 유효하지 않거나, 인증기관과의 통신 중 문제가 생겼을 수 있습니다. 다른 인증방법을 이용하시거나 잠시 후 다시 이용해주세요.";
				return E_IBX_CERTIFY_UNKNOWN;
			} else {
				this.log("인증서 및 주민등록번호 검증 실패");
				this.setError(E_IBX_UNKNOWN);
				return E_IBX_UNKNOWN;
			}

		} else if (ResultStr.indexOf('"REGSTATUS"') > -1) { // 기등록 인증서가 있는 경우에 나오는 페이지.
			if (ResultStr.indexOf('"REGSTATUS":["1"]') > -1) { // 등록된 인증서가 만료된 경우로 인증서 제출 후, 갱신 버튼이 보임.
				this.log("이미 등록하였지만, 인증서 갱신이 필요한 계정");

				// 이 경우에는 업데이트를 처리하여, 인증서를 갱신하도록 처리.
				// 업데이트 통신!
				postTemp  = "__E2E_RESULT__=";
				postTemp  = "__E2E_RESULT__=";
				postTemp += "&__E2E_UNIQUE__=" + this.UID;
				postTemp += "&registcode2__E2E__=";
				postTemp += "&__E2E_KEYPAD__=" + this.EncKey.toLowerCase();
				postTemp += '&' + nw + '=' + ModifyJumin.toLowerCase();
				postTemp += '&__KI_' + jM + '=' + jMValue;
				postTemp += '&' + Ux + '=' + 'Y';
				postTemp += "&gubun=upd"; // inq: 기등록 조회, reg: 등록, upd: 갱신
				postTemp += "&registcode1=" + 주민등록번호.getPlainTextWithRange(0, 6);
				postTemp += "&registcode2=" + dumpJumin;
		
				this.log("postTemp: [" + postTemp + "]");
		
				InpugData = certManager.MakeINIpluginData(11, postTemp, password.getPlainText(), "https://www.bccard.com/app/card/view/initech/plugin/tools/Random.jsp");
				this.log("InpugData: [" + InpugData + "]");
		
				this.postData  = "retKey=json";
				this.postData += "&__E2E_RESULT__=";
				this.postData += "&__E2E_UNIQUE__=";
				this.postData += "&__E2E_KEYPAD__=";
				this.postData += "&INIpluginData=" + httpRequest.URLEncodeAll(InpugData);
				this.postData += "&gubun=upd"; // inq: 기등록 조회, reg: 등록, upd: 갱신
				this.postData += "&registcode1=";
				this.postData += "&registcode2=";

				this.log("postData: [" + this.postData + "]");
	
				this.url = "/app/card/CertRegActn.do";
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
					//		if(httpRequest.get(this.host + this.url) == false){
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
			
				ResultStr = httpRequest.result;
				this.log("인증서등록3 [" + ResultStr + "]");

				if (ResultStr.indexOf('"REGSTATUS":["2"]') < 0) {
					this.log("인증서등록 실패");
					this.setError(E_IBX_UNKNOWN);
					return E_IBX_UNKNOWN;
				}
			} else if (ResultStr.indexOf('"REGSTATUS":["2"]') > -1) { // 등록된 인증서가 유효한 경우로 인증서 제출 후, 갱신 버튼이 없음.
				// 네이버 요청으로 이미 등록된 인증서로 메시지가 나오는 경우에도 정상으로 처리.
				// 2020.01.15, ykk9096
				this.log("이미 등록하된 인증서");
				// this.setError(E_IBX_INSURANCE_REGISTERED_CERT);
				// return E_IBX_INSURANCE_REGISTERED_CERT;
			} else {
				this.log("기등록 인증서가 있으나, 케이스가 확인이 되지 않음.");
				this.setError(E_IBX_UNKNOWN);
				return E_IBX_UNKNOWN;
			}
		} else if (ResultStr.indexOf('{}') > -1) { // 현재 인증서 미등록인 경우
			this.log("인증서 처음 등록인 경우");

			// 이 경우에는 인증서를 등록하도록 처리.
			postTemp  = "__E2E_RESULT__=";
			postTemp += "&__E2E_UNIQUE__=" + this.UID;
			postTemp += "&registcode2__E2E__=";
			postTemp += "&__E2E_KEYPAD__=" + this.EncKey.toLowerCase();
			postTemp += '&' + nw + '=' + ModifyJumin.toLowerCase();
			postTemp += '&__KI_' + jM + '=' + jMValue;
			postTemp += '&' + Ux + '=' + 'Y';
			postTemp += "&gubun=reg"; // inq: 기등록 조회, reg: 등록, upd: 갱신
			postTemp += "&registcode1=" + 주민등록번호.getPlainTextWithRange(0, 6);
			postTemp += "&registcode2=" + dumpJumin;
			
			this.log("postTemp: [" + postTemp + "]");
	
			InpugData = certManager.MakeINIpluginData(11, postTemp, password.getPlainText(), "https://www.bccard.com/app/card/view/initech/plugin/tools/Random.jsp");
	
			this.postData  = "retKey=json";
			this.postData += "&__E2E_RESULT__=";
			this.postData += "&__E2E_UNIQUE__=";
			this.postData += "&__E2E_KEYPAD__=";
			this.postData += "&INIpluginData=" + httpRequest.URLEncodeAll(InpugData);
			this.postData += "&gubun=reg"; // inq: 기등록 조회, reg: 등록, upd: 갱신
			this.postData += "&registcode1=";
			this.postData += "&registcode2=";

			this.log("postData: [" + this.postData + "]");

			this.url = "/app/card/CertRegActn.do";
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				//		if(httpRequest.get(this.host + this.url) == false){
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
		
			ResultStr = httpRequest.result;
			this.log("인증서등록3 [" + ResultStr + "]");

			if (ResultStr.indexOf('"REGSTATUS":["2"]') < 0) {
				this.log("인증서등록 실패");
				this.setError(E_IBX_UNKNOWN);
				return E_IBX_UNKNOWN;
			}

		} else { // 확인이 안된 경우
			this.log("인증서등록 실패");
			this.setError(E_IBX_UNKNOWN);
			return E_IBX_UNKNOWN;
		}

		this.log("인증서등록 S_IBK_OK");

		// 결과 처리
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		return S_IBX_OK;
	} catch (e) {
		//
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 개인카드 인증서등록 finally");
	}
};


개인카드.prototype.onCertLogin = function (input, password) {
	var certpath = input.인증서.이름;
	system.setStatus(IBXSTATE_LOGIN, 35);

	this.host = "http://www.bccard.com";
	this.url = '/app/card/SsoLoginLink.do';
	if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	this.log("-Login1:[" + httpRequest.result + "]");
	var ResultStr = httpRequest.result;

	var HostSrv = StrGrab(ResultStr, '/3rd/openIdPasswordSignin.jsp?UURL=http%3A%2F%2F', '.');
	if (!HostSrv) HostSrv = StrGrab(ResultStr, '/3rd/openIdPasswordSignin.jsp?UURL=https%3A%2F%2F', '.');
	this.log("HostSrv===" + HostSrv);
	if (!HostSrv) {
		this.setError(E_IBX_SITE_INVALID);
		return E_IBX_SITE_INVALID;
	}

	var vkPad = this.initKeyPad('http://isson.bccard.com');
	if (vkPad == 'Fail'){
		this.setError(E_IBX_SITE_INVALID + 1);
		return E_IBX_SITE_INVALID + 1;		
	}

	if (!certManager.findCert(JSON.stringify(input.인증서))) {
		this.log("인증서를 찾을 수 없습니다.");
		this.setError(E_IBX_CERTIFY_NOT_FOUND);
		return E_IBX_CERTIFY_NOT_FOUND;
	} else {
		this.log("인증서 찾음.");
	}

	if (!certManager.verifyPassword(password)) {
		this.log("certManager.verifyPassword 실패");
		this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
		return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
	} else {
		this.log("certManager.verifyPassword 성공");
	}
	
	//20200828 ReplayAttack 통신 추가 
    this.url = 'https://isson.bccard.com/3rd/initech/crossweb/extension/common/tools/RpSync.jsp';
    if (httpRequest.getWithUserAgent(this.userAgent, this.url) == false) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
    }
    
    ResultStr = httpRequest.result;
	if (!ResultStr.match("rawstime://")) {
	    //TODO: 에러 처리 추가 필요
	    //통신 시 내려오는 데이터
	    //rawstime://MTU5ODU5ODMwM19CN0RGMTg5QTk5MTg0NENFMDRBNjVGODZGRTdGRTFFOTdGRjRFQzQwQzY1Mjk3N0E5ODkzNzgxMzg0RTMzN0FG
	}
	
	rawstime = ResultStr.split("rawstime://");
	rawstime = rawstime[1].replace(/[^A-Za-z0-9\+\/\=]/g, "");
	rawstime = this.Base64decode(rawstime);
	rawstime = rawstime.substring(rawstime.indexOf("_")+1);
	
	//sign 데이터 생성
	var tempSignData = certManager.SignData("login", password)+"";
	//base64 to hesString
	tempSignData = certManager.Base64ToHex(tempSignData).toUpperCase();
	
	var vidRandom = certManager.getEncryptedVidRandom(sysDateTime, password);
    vidRandom = certManager.Base64ToHex(vidRandom).toUpperCase();
    //vidRandom 앞부분에 고정값 추가
    vidRandom = "A18192302F06092B06010401B76E030131220420" + vidRandom;

    tempSignData = this.appendRandomToPKCS7(tempSignData, vidRandom);
    
    //seed 키 유도 시작
    var sysDateTime = tempSignData.substr(tempSignData.indexOf("301C06092A864886F70D010905310F170D")+34, 26);
    sysDateTime = this.hex2ascii(sysDateTime);
    
    //sysDateTime -> sha-256 3회
    var _hash = this.SHA256(str2binb(sysDateTime), sysDateTime.length * 8)
    console.log('SHA256:[' + binb2hex(_hash) + '][' + _hash.length + ']');
    _hash = this.SHA256(_hash, 32 * 8);
    console.log('SHA256:[' + binb2hex(_hash) + '][' + _hash.length + ']');
    _hash = this.SHA256(_hash, 32 * 8);
    console.log('SHA256:[' + binb2hex(_hash) + '][' + _hash.length + ']');
    
    _hash = binb2hex(_hash).toUpperCase();
  
    var hexKey = _hash.substring(0, 32);
    var hexIv  = _hash.substring(32);
    var replayAttack = certManager.SEED_CBC_Encrypt(hexKey, hexIv, rawstime);
    replayAttack = certManager.Base64ToHex(replayAttack);
  
    this.log("replayAttack : " + certManager.Base64ToHex(replayAttack));
    
    replayAttack = "305F06092B06010401B76E040131520450" + replayAttack;
	
    tempSignData = this.appendRandomToPKCS7(tempSignData, replayAttack);
    
    tempSignData = certManager.HexToBase64(tempSignData);
    
    this.log('tempSignData end : ' + tempSignData);
    
    var cutLen = 64;
    var PKCS7SignedData = "";
    // 서명데이 개행문자 처리
    while (true) {
        if(PKCS7SignedData === "") {
            cutLen = 128;
        }
        if(tempSignData.length < cutLen) {
            PKCS7SignedData += httpRequest.URLEncodeAll(tempSignData, "UTF-8");
            break;
        }
        PKCS7SignedData += httpRequest.URLEncodeAll(tempSignData.substring(0, cutLen), "UTF-8") + "%0D%0A";
        tempSignData = tempSignData.substring(cutLen);
    }
	
    this.log("PKCS7SignedData : " + PKCS7SignedData);

	this.host = 'https://' + HostSrv + '.bccard.com';
	this.url = "/nls3/openCookieSignin.jsp?FORM=777&RTOA=1&UURL=https://www.bccard.com:443/app/card/SsoLoginSave.do";
	if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
		//if(httpRequest.get(this.host + this.url) == false){
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	//signDataWithVID
	
	var resBlock = httpRequest.result;
	this.log("httpRequest.result[" + resBlock + "]");

	var agent_header = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",' +
		             '"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",' +
					 '"Content-Type":"application/x-www-form-urlencoded",' +
					 '"Accept-Language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",' +
					 '"Accept-Encoding":"gzip, deflate, br"' +
					 '}';

	this.postData  = '__E2E_KEYPAD__=' 		+ this.EncKey.toLowerCase();
	this.postData += '&__E2E_UNIQUE__='      + this.UID;
	this.postData += "&PKCS7SignedData=" 	+ PKCS7SignedData;
	this.postData += "&INIpluginData=";
	this.postData += "&UURL=" 				+ httpRequest.URLEncodeAll(StrGrab(StrGrab(StrGrab(resBlock, '<!-- 공인인증 로그인 -->', '<!--// 공인인증 로그인 -->'), 'name="UURL"', '>'), 'value="', '"'));
	this.postData += "&NONCE=" 				+ httpRequest.URLEncodeAll(StrGrab(StrGrab(StrGrab(resBlock, '<!-- 공인인증 로그인 -->', '<!--// 공인인증 로그인 -->'), 'name="NONCE"', '>'), 'value="', '"'));

	this.url = "/3rd/openDemo3rdParty.jsp";
	this.url += '?' + StrGrab(resBlock, 'action="/3rd/openDemo3rdParty.jsp?', '"');
	this.log("url===" + this.url);

	if (httpRequest.postWithUserAgent(agent_header, this.host + this.url, this.postData) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	resBlock = httpRequest.result;
	this.log("resBlock[" + resBlock + "]");

	if (resBlock.indexOf("name=\"Sendform\"") > -1) {
		this.url = "/nls3/fcs";
		this.postData = "cmd=" + StrGrab(StrGrab(resBlock, "cmd", ">"), "value=\"", "\"");
		this.postData += "&userid=" + httpRequest.URLEncodeAll(StrGrab(StrGrab(resBlock, "userid", ">"), "value=\"", "\""));
		//this.postData += "&enuserid=" + httpRequest.URLEncodeAll(StrGrab(resBlock, "enuserid value=\"", "\""));
		this.postData += "&toa=" + StrGrab(StrGrab(resBlock, "toa", ">"), "value=\"", "\"");
		this.postData += "&userip=" + httpRequest.URLEncodeAll(StrGrab(StrGrab(resBlock, "userip", ">"), "value=\"", "\""));
		this.postData += "&nonce=" + httpRequest.URLEncodeAll(StrGrab(StrGrab(resBlock, "nonce", ">"), "value=\"", "\""));
		this.postData += "&signature=" + httpRequest.URLEncodeAll(StrGrab(StrGrab(resBlock, "signature", ">"), "value=\"", "\""));
		this.postData += "&certificate=" + httpRequest.URLEncodeAll(StrGrab(StrGrab(resBlock, "certificate", ">"), "value=\"", "\""));
		this.postData += "&verifyEncrypte=" + httpRequest.URLEncodeAll(StrGrab(StrGrab(resBlock, "verifyEncrypte", ">"), "value=\"", "\""));

		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			//		if(httpRequest.get(this.host + this.url) == false){
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		resBlock = httpRequest.result;
		this.log("resBlock[" + resBlock + "]");
	}

	if (resBlock.indexOf("죄송합니다.") > -1 && resBlock.indexOf("인증서 등록이 되어") > -1) {
		this.setError(E_IBX_CERTIFY_NOT_REGISTER);
		return E_IBX_CERTIFY_NOT_REGISTER;
	}
	else if (resBlock.indexOf("죄송합니다.취소 또는 데이타 생성 실패입니다") > -1) {
		this.setError(E_IBX_LOGIN_FAIL);
		return E_IBX_LOGIN_FAIL;
	}
	if (resBlock.indexOf("인터넷 회원으로 등록되어 있지 않습니다.") > -1) {
		this.setError(E_IBX_CUSTOMER_IS_NOT_MEMBER);
		return E_IBX_CUSTOMER_IS_NOT_MEMBER;
	}
	if (resBlock.indexOf("<div id=\"errorPage3\">") > -1) {
		this.setError(E_IBX_CERTIFY_NOT_MUTUALINTERLOCK);
		return E_IBX_CERTIFY_NOT_MUTUALINTERLOCK;
	}

	this.host = "https://www.bccard.com";
	this.url = "/app/card/MyBcSubIndex.do";
	if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
		//		if(httpRequest.get(this.host + this.url) == false){
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	resBlock = httpRequest.result;
	this.log("resBlockFinal[" + resBlock + "]");

	if (resBlock.indexOf("회원님은 현재 BC카드 미소지회원이십니다") > -1 ) {
		this.setError(E_IBX_CARD_NOT_FOUND );
		return E_IBX_CARD_NOT_FOUND ;
	}
	if (resBlock.indexOf("로그인 대기 시간을 초과하여 로그인 할 수 없습니다") > -1) {
		this.setError(E_IBX_SESSION_REMAINED);
		return E_IBX_SESSION_REMAINED;
	}
	// 실제 로그인 여부 확인.
	if (resBlock.indexOf('>로그아웃<') < 0 &&
		resBlock.indexOf('/app/card/view/login/logout.jsp') < 0) {
		this.setError(E_IBX_LOGIN_FAIL);
		return E_IBX_LOGIN_FAIL;
	}

	return S_IBX_OK;
};

//세션만료 오류 검증 함수
개인카드.prototype.firstSession = function() {

	this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
	this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
	this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
	this.userAgent += "}";	

	if (httpRequest.postWithUserAgent(this.userAgent, 'https://www.bccard.com/app/card/MainActn.do', "") == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	// 새벽 점검 오류처리
	// 사이트 장애 오류처리 (일시적인 시스템 오류가 발생하였습니다. 잠시 후 다시 이용하여 주시기 바랍니다.)
	if ((httpRequest.result.indexOf('No backend server available for connection') > -1) || 
		(httpRequest.result.indexOf('일시적인 시스템 오류가 발생하였습니다.') > -1)) {
		this.setError(E_IBX_SITE_INTERNAL);
		return E_IBX_SITE_INTERNAL;
	}

	if ((httpRequest.result.indexOf('중복로그인 안내') > -1) ||
		(httpRequest.result.indexOf('같은 아이디로 다른 기기에서 로그인이 된 경우 발생합니다') > -1) ||
		(httpRequest.result.indexOf('동일ID 로그인 접속시도로 강제 로그아웃되었습니다.') > -1) ){
		this.bLogIn = false;
		this.setError(E_IBX_SERVICE_LOGOUT);
		return E_IBX_SERVICE_LOGOUT;
	}

	if ((httpRequest.result.indexOf('로그인</a') > -1) ||
		(httpRequest.result.indexOf('고객님의 정보보호를 위해 안전하게 로그아웃 되었습니다') > -1) ||
		(httpRequest.result.indexOf('https://www.bccard.com/app/card/SsoLoginSave.do') > -1) ){
		this.bLogIn = false;
		this.setError(E_IBX_AFTER_LOGIN_SERVICE);
		return E_IBX_AFTER_LOGIN_SERVICE;
	}

	return S_IBX_OK;
};

개인카드.prototype.세션체크함수 = function(ResultStr) {
    // 새벽 점검 오류처리
	// 사이트 장애 오류처리 (일시적인 시스템 오류가 발생하였습니다. 잠시 후 다시 이용하여 주시기 바랍니다.)
    if ((httpRequest.result.indexOf('No backend server available for connection') > -1) ||
        (httpRequest.result.indexOf('일시적인 시스템 오류가 발생하였습니다.') > -1)) {
		this.setError(E_IBX_SITE_INTERNAL);
		return E_IBX_SITE_INTERNAL;
	}

	if ((ResultStr.indexOf('중복로그인 안내') > -1) ||
		(ResultStr.indexOf('같은 아이디로 다른 기기에서 로그인이 된 경우 발생합니다') > -1) ||
		(ResultStr.indexOf('동일ID 로그인 접속시도로 강제 로그아웃되었습니다.') > -1) ){
		this.bLogIn = false;
		this.setError(E_IBX_SERVICE_LOGOUT);		
		return E_IBX_SERVICE_LOGOUT;
	}

	if ((ResultStr.indexOf('로그인</a') > -1) ||
		(ResultStr.indexOf('고객님의 정보보호를 위해 안전하게 로그아웃 되었습니다') > -1) ||
		(ResultStr.indexOf('https://www.bccard.com/app/card/SsoLoginSave.do') > -1) ){
		this.bLogIn = false;
		this.setError(E_IBX_SESSION_CLOSED);
		return E_IBX_SESSION_CLOSED;
	}

	if (ResultStr.indexOf('>인증선택<') > -1){
		this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
		return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
	}

	return S_IBX_OK;
};

//schType = in : 국내 , out : 국외
개인카드.prototype.승인내역조회함수 = function(조회시작일, 조회종료일, schType, Result, 카드리스트, bankSelect, 조회구분) {

	var reduceSpace = function(aStr) {
		var outStr;
		var TempStr = aStr;
		while (true) {
			if (TempStr.indexOf('  ') > 0) TempStr = StrReplace(TempStr, '  ', ' ');
			else break;
		}
		outStr = TempStr;

		return outStr;
	};

	this.url = "/app/card/ApproveActn.do";

	var 승인내역PostData = "";
	var 승인내역Agent = "";

	var key_type = "INIT";
	var ispgubun = "";
	var next_key = "";

	var cnt = 0;

	while (true) {
		system.setStatus(IBXSTATE_EXECUTE, 60);

		승인내역PostData = "retKey="			+ "json";
		승인내역PostData += "&INIpluginData="	+ "";
		승인내역PostData += "&salgubun="		+ "1";
		승인내역PostData += "&ispgubun="		+ ispgubun;
		승인내역PostData += "&ra="				+ "custom_date";
		승인내역PostData += "&next_key="		+ next_key;
		승인내역PostData += "&pageCount="		+ "0";
		승인내역PostData += "&currViewRows="	+ "Y";
		승인내역PostData += "&fromDate="		+ 조회시작일;	//조회 시작일
		승인내역PostData += "&toDate="			+ 조회종료일;	//조회 종료일
		승인내역PostData += "&BankList="		+ "";
		승인내역PostData += "&comparator="		+ 조회시작일;
		승인내역PostData += "&key_type="		+ key_type;
		승인내역PostData += "&bankSelect="		+ bankSelect;
		승인내역PostData += "&cardIdx="			+ "";
		승인내역PostData += "&area_clss="		+ schType	//in : 국내 , out : 국외
		;

		this.log("postData = " + 승인내역PostData);

		승인내역Agent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		승인내역Agent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
		승인내역Agent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		승인내역Agent += ",\"JSON-HTTP\":\"json\"";
		승인내역Agent += ",\"Referer\":\"https://www.bccard.com/app/card/ApproveActn.do\"";
		승인내역Agent += ",\"X-Requested-With\":\"XMLHttpRequest\"";
		승인내역Agent += ",\"Accept-Encoding\":\"gzip, deflate, br\"";
		승인내역Agent += "}";

		if (httpRequest.postWithUserAgent(승인내역Agent, this.host + this.url, 승인내역PostData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result + "";
		this.log("승인내역조회함수_" + schType + "_1: ["+ resBlock +"]");

		if (cnt == 100) break;
		cnt++;
		
		//세션체크함수
		var sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if (resBlock.indexOf('최근 9개월 동안의 이용내역만 조회가 가능합니다') > 0) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_DENIED);
            return E_IBX_ENUM_DATE_BEGIN_DENIED;
		}

		if (schType == 'in') {
			this.log("국내이용내역 = " + resBlock);
			if (resBlock.indexOf("JtData_010net") == -1) {
				break;
			}

			// 승인내역조회 결과를 있음 경우
			if (!Result.국내승인금액합계) {
				Result.국내승인금액합계 = StrTrim(StrReplace(StrGrab(resBlock, '"totalMoney":"', '"'), ',', ''));

				// 결과를 체크
				if (!(IsCurrency(Result.국내승인금액합계))) {
					this.setError(E_IBX_CURRENCY_NOT_CONVERT);
					return E_IBX_CURRENCY_NOT_CONVERT;
				}
			}
	
			var 국내이용내역OBJ;
			try {
				국내이용내역OBJ = JSON.parse(resBlock);
				this.log("국내이용내역 JSON = " + resBlock);
			} catch (e) {

				// JSON 변환 실패하는 경우 재통신로직 추가.(사이트에서 간헐적으로 오류발생함.)
				if (httpRequest.postWithUserAgent(승인내역Agent, this.host + this.url, 승인내역PostData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				resBlock = httpRequest.result + "";
				this.log("승인내역조회함수_" + schType + "_1_re: ["+ resBlock +"]");

				//세션체크함수
				var sessionChk = this.세션체크함수(resBlock);
				if (sessionChk != S_IBX_OK) { return; }

				try {
					국내이용내역OBJ = JSON.parse(resBlock);
					this.log("국내이용내역 JSON_re = " + resBlock);

				} catch(e) {
					this.log("국내이용내역 JSON 변환 실패");
					this.setError(E_IBX_SITE_INVALID);
					return E_IBX_SITE_INVALID;
				}
			}
	
			if (국내이용내역OBJ && 국내이용내역OBJ.JtData_010net) {
				system.setStatus(IBXSTATE_EXECUTE, 70);
				var 국내배열 = 국내이용내역OBJ.JtData_010net;
	
				var len = 국내배열.length;
	
				var idx = 0;
	
				for (; idx < len; idx++) {
	
					var item2 = 국내배열[idx];
	
					var 승인일자 = item2.mmdd;
					this.log("승인일자 : " + 승인일자);
	
					// 승인일자가 공백일 경우 출력하지 않는다. by 김인권
					if (승인일자 == "") {
						this.log("승인일자 is blank");
						continue;
					}
					승인일자 = 승인일자.split("<br>");
	
					var 승인시간 = StrReplace(승인일자[1], ":", "");
	
					승인일자 = StrReplace(승인일자[0], ".", "");
	
					var 승인번호 = item2.authNo;
	
					var 카드종류 = "";
	
					var 카드번호 = StrReplace(item2.cardNo_1, "-", "");
	
					카드리스트[item2.cardNo] = 카드번호;
	
					var 가맹점명 = reduceSpace(item2.merNm);
					var 승인금액 = StrReplace(item2.authAmt, ",", "");
					var 취소일자 = "";
	
					var 매입상태 = item2.acceptClss;
	
					var IsPartCancel = false;
					var 부분취소금액 = '';
					if (매입상태.indexOf("취소") > -1) {
						try {
							취소일자 = StrReplace(item2.cnclDate, ".", "");
						} catch (e) {
							취소일자 = 승인일자;
						}
						if (매입상태.indexOf("부분") > -1) { 부분취소금액 = StrReplace(item2.partSaleCnclAmt, ",", ""); IsPartCancel = true; }
					}
	
					var 결제예정일 = StrReplace(StrReplace(item2.req_date, ".", ""), "-", "");
	
					var 매출종류 = item2.saleDv;
	
					if (매출종류.indexOf("일시") > -1) {
						매출종류 = "1";
					} else if (매출종류.indexOf("현금") > -1) {
						매출종류 = "3";
					} else {						 
						매출종류 = "2";
					}
	
					var 할부기간 = item2.authInsTrm + "";
	
					//60 이라면 포인트로 결제한 것이기 때문에 할부가 아님
					if (할부기간 == "60") {
						할부기간 = "";
					}
	
					할부기간 = StrReplace(할부기간, "P", "");
	
					var 국내외구분 = "1";
					var 통화코드 = "";
	
					var 가맹점코드 = item2.merNo;
					var 가맹점사업자번호 = "";
					var 가맹점업종 = "";
					var 가맹점전화번호;
					var 가맹점주소;
					var 가맹점대표자명;
					var 부가세;
	
					//[2019.04.12] SK플래닛 요청으로, 거래내역 목록에서만 결과처리 하도록 처리
					if (조회구분 == 'S') {
						가맹점사업자번호 = "";
						가맹점업종 = ""; 
						가맹점전화번호 = '';
						가맹점주소 = '';
						가맹점대표자명 = '';
						부가세 = '';

					} else{
						var 매출전표URL = "/app/card/ChainInfoViewActn.do?memMgmtNo="+ 가맹점코드 +"&submallName=";
						if (httpRequest.post(this.host + 매출전표URL, "") == false) {
						}
		
						var 매출전표결과1 = httpRequest.result;
						//세션체크함수
						sessionChk = this.세션체크함수(매출전표결과1);

						if (sessionChk != S_IBX_OK) {
							return;
						}
						//obj.log("매출전표결과1=" + 매출전표결과1);
		
						if (매출전표결과1.indexOf("알 수 없는 오류 발생") > -1){
							가맹점사업자번호 = "";
							가맹점업종 = ""; 
							가맹점전화번호 = '';
							가맹점주소 = '';
							가맹점대표자명 = '';
							continue;
						}else{
							가맹점사업자번호 = StrReplace(StrGrab(매출전표결과1, ">사업자등록번호 : ", "<"), "-", "");
							가맹점업종 = StrGrab(매출전표결과1, ">업종 : ", "<");
							가맹점전화번호 = StrReplace(StrGrab(매출전표결과1, ">전화번호 : ", "<"), '-', '');
							가맹점주소 = StrTrim(StrGrab(매출전표결과1, ">대표주소 : ", "<"));
							가맹점대표자명 = StrTrim(StrGrab(매출전표결과1, ">대표자명 : ", "<"));
						}

						부가세 = StrReplace(StrReplace(item2.vatAmt, ".", ""), ",", "");
					}
	
					var item = {};
					
					item.승인일자 = 승인일자;
					item.승인시간 = 승인시간;
					item.승인번호 = 승인번호;
					item.카드종류 = 카드종류;
					item.카드번호 = 카드번호;
					item.가맹점명 = 가맹점명;
					item.매출종류 = 매출종류;
					item.할부기간 = 할부기간;
					item.승인금액 = 승인금액;

					// 부분취소는 두번 처리 필요.(정상, 취소)
					if (IsPartCancel) {
						item.취소년월일 = '';
					} else {
						item.취소년월일 = 취소일자;
					}

					item.결제예정일 = 결제예정일;
					item.가맹점사업자번호 = 가맹점사업자번호;
					item.가맹점코드 = 가맹점코드;
					item.가맹점업종 = 가맹점업종;
					item.통화코드 = 통화코드;
					item.국내외구분 = 국내외구분;
					item.가맹점전화번호 = 가맹점전화번호;
					item.가맹점주소 = 가맹점주소;
					item.가맹점대표자명 = 가맹점대표자명;
					item.매입상태 = 매입상태;
					item.부가세 = 부가세;
	
					Result.승인내역조회.push(item);

					if (IsPartCancel) {
						item = {};
						item.승인일자 = 승인일자;
						item.승인시간 = 승인시간;
						item.승인번호 = 승인번호;
						item.카드종류 = 카드종류;
						item.카드번호 = 카드번호;
						item.가맹점명 = 가맹점명;
						item.매출종류 = 매출종류;
						item.할부기간 = 할부기간;
						item.승인금액 = 부분취소금액;
						item.취소년월일 = 취소일자;
						item.결제예정일 = 결제예정일;
						item.가맹점사업자번호 = 가맹점사업자번호;
						item.가맹점코드 = 가맹점코드;
						item.가맹점업종 = 가맹점업종;
						item.통화코드 = 통화코드;
						item.국내외구분 = 국내외구분;
						item.가맹점전화번호 = 가맹점전화번호;
						item.가맹점주소 = 가맹점주소;
						item.가맹점대표자명 = 가맹점대표자명;
						item.매입상태 = 매입상태;
						item.부가세 = 부가세;

						Result.승인내역조회.push(item);

						IsPartCancel = false;
					}
				}
	
				ispgubun = 국내이용내역OBJ.ispgubun;
				key_type = "NEXT";
				next_key = 국내이용내역OBJ.next_key;
	
				this.log("ispgubun = " + ispgubun);
				this.log("next_key = " + next_key);
	
				if (next_key == "") break;
			}
			else {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
	
				//break;
			}
		} else {
			this.log("해외이용내역 = " + resBlock);

			if (resBlock.indexOf("JtData_010net") == -1) {
				break;
			}

			// 승인내역조회 결과를 있음 경우
			if (!Result.해외승인금액합계) {
				Result.해외승인금액합계 = StrTrim(StrReplace(StrGrab(resBlock, '"allUsdAuthAmt":"', '"'), ',', ''));

				// 결과를 체크
				if (!(IsCurrency(Result.해외승인금액합계))) {
					this.setError(E_IBX_CURRENCY_NOT_CONVERT);
					return E_IBX_CURRENCY_NOT_CONVERT;
				}
			}
	
			system.setStatus(IBXSTATE_EXECUTE, 75);
			
			var 해외이용내역OBJ;
			try {
				해외이용내역OBJ = JSON.parse(resBlock);
				this.log("해외이용내역 JSON = " + resBlock);
			} catch (e) {				
				// JSON 변환 실패하는 경우 재통신로직 추가.(사이트에서 간헐적으로 오류발생함.)
				if (httpRequest.postWithUserAgent(승인내역Agent, this.host + this.url, 승인내역PostData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				resBlock = httpRequest.result + "";
				this.log("승인내역조회함수_" + schType + "_1_re: ["+ resBlock +"]");
				//세션체크함수
				var sessionChk = this.세션체크함수(resBlock);
				if (sessionChk != S_IBX_OK) { return; }

				try {
					해외이용내역OBJ = JSON.parse(resBlock);
					this.log("해외이용내역 JSON_re = " + resBlock);

				} catch(e) {
					this.log("해외이용내역 JSON 변환 실패");
					this.setError(E_IBX_SITE_INVALID);
					return E_IBX_SITE_INVALID;
				}
			}
	
			if (해외이용내역OBJ && 해외이용내역OBJ.JtData_010net) {
	
				var 해외배열 = 해외이용내역OBJ.JtData_010net;
	
				var len = 해외배열.length;
	
				var idx = 0;
	
				for (; idx < len; idx++) {
	
					var item2 = 해외배열[idx];
	
					var 승인일자 = StrReplace(item2.authDtm, ".", "");

					// 승인일자가 공백일 경우 출력하지 않는다. by 김인권
					if (승인일자 == "") {
						this.log("승인일자 is blank");
						continue;
					}
	
					var 승인시간 = StrReplace(item2.outAuthNo, ":", "");
	
					var 승인번호 = item2.outTaoAuthNo;
	
					var 카드종류 = "";//item2.fml_ret8;
	
					var 카드번호 = StrReplace(item2.authNo_1, "-", "");
	
					카드리스트[item2.fml_ret5] = 카드번호;

					var 가맹점명 = reduceSpace(item2.tmpMerNm);
					var 승인금액 = StrTrim(StrReplace(reduceSpace(item2.authInsTrm), ",", "")); // 미화금액
					try {
						var 취소일자 = StrReplace(item2.cnclDate, ".", "");
					} catch (e) {
						var 취소일자 = 승인일자;
					}
		
					var 결제예정일 = '';
	
					var 매출종류 = item2.cardNo;
	
					if (매출종류.indexOf("일시") > -1) {
						매출종류 = "1";
					}
					else {
						매출종류 = "2";
					}
					var 할부기간 = ""; // 확인 안됨
					var 국내외구분 = "2";
					var 통화코드 = "USD";
					var 가맹점코드 = ""; // 확인 안됨
					var 가맹점사업자번호 = "";
					var 가맹점업종 = "";
					var 가맹점대표자명 = "";
		
					var item = {};
	
					item.승인일자 = 승인일자;
					item.승인시간 = 승인시간;
					item.승인번호 = 승인번호;
					item.카드종류 = 카드종류;
					item.카드번호 = 카드번호;
					item.가맹점명 = 가맹점명;
					item.매출종류 = 매출종류;
					item.할부기간 = 할부기간;
					item.승인금액 = 승인금액;
					item.취소년월일 = 취소일자;
					item.결제예정일 = 결제예정일;
					item.가맹점사업자번호 = 가맹점사업자번호;
					item.가맹점코드 = 가맹점코드;
					item.가맹점업종 = 가맹점업종;
					item.통화코드 = 통화코드;
					item.국내외구분 = 국내외구분;
					item.가맹점전화번호 = '';
					item.가맹점주소 = '';
					item.가맹점대표자명 = 가맹점대표자명;
					item.매입상태 = '';
					item.부가세 = '';
	
					Result.승인내역조회.push(item);
				}
	
				ispgubun = 해외이용내역OBJ.ispgubun;
				key_type = "NEXT";
				next_key = 해외이용내역OBJ.next_key;
	
				this.log("ispgubun = " + ispgubun);
				this.log("next_key = " + next_key);
	
				if (next_key == "") break;
			}
			else {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
	
				//break;
			}
		}
	}

	return S_IBX_OK;
};

개인카드.prototype.발급사selectbox조회 = function(발급사selectBox, 결제일) {
	this.url = "/app/card/BillpActn.do";

	this.postData = "";

	this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
	this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
	this.userAgent += "}";

	if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	var resBlock = httpRequest.result + "";
	//세션체크함수
	var sessionChk = this.세션체크함수(resBlock);

	if (sessionChk != S_IBX_OK) {
		return;
	}

	this.log("청구페이지 내용 = " + resBlock);

	if (resBlock == "") {
		this.setError(E_IBX_SITE_INVALID);
		return E_IBX_SITE_INVALID;
	}

	if (resBlock.indexOf("이용대금명세서가 존재하지 않습니다.") > -1) {
		return S_IBX_OK;
	}

	var selectBox = findTagGrapHtml(resBlock, "select", "id", "selBank");
	if (selectBox == "") {
		this.setError(E_IBX_SITE_INVALID);
		return E_IBX_SITE_INVALID;
	}

	var idx = 1;
	while (true) {
		var optionVal = StrGrab(selectBox, "<option value=\"", "\"", idx);
		var optionTxt = StrTrim(StrGrab(selectBox, "\"" + optionVal + "\">", "</"));

		if (optionVal == "" || idx == 100) break;

		idx++;

		var optionArray = optionVal.split("|");

		if (optionArray[1].indexOf(결제일) > -1) {
			this.log("발급사selectBox::" + optionVal + "|" + optionTxt);
			발급사selectBox.push(optionVal + "|" + optionTxt);
		}
	}

	return S_IBX_OK;
};

//TODO:
개인카드.prototype.로그인 = function (aInput) {
	this.log(BankName + " 개인카드 로그인 호출[" + aInput + "]");
	this.UserName = "";

	try {

		this.host = "https://www.bccard.com";
		this.url = "/app/card/LogOut.do";

		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		httpRequest.clearCookie("bccard.com");

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
        if (input.사용자비밀번호) this.iSASInOut.Input.사용자비밀번호 = input.사용자비밀번호.replace(/./g, '*');
        if (input.인증서 && input.인증서.비밀번호) this.iSASInOut.Input.인증서.비밀번호 = input.인증서.비밀번호.replace(/./g, '*');		

		this.log("로그인방식:[" + input.로그인방식 + "]");
		var rtn;
		if (input.로그인방식 == "ID") {
			this.log("아이디/비밀번호 로그인");
			var userID = input.사용자아이디;
			// 사용자 비밀번호를 아래처럼 저장하면, 메모리에서 검출됩니다. (절대 안됨)
			// var userPWD = input.사용자비밀번호;

			if (!StrTrim(input.사용자비밀번호)) {
				this.setError(E_IBX_USER_PASSWORD_NOTENTER);
				return E_IBX_USER_PASSWORD_NOTENTER;
			}
			if (!StrTrim(userID)) {
				this.setError(E_IBX_USER_ACCOUNT_NOTENTER);
				return E_IBX_USER_ACCOUNT_NOTENTER;
			}

			//아이디 앞, 뒤에 공백있을 경우 오류 발생 
			if (userID != StrTrim(userID)) {
				this.setError(E_IBX_KEY_ACCOUNT_INFO_2_INVALID);
				return E_IBX_KEY_ACCOUNT_INFO_2_INVALID;
			}

			// 메모리에서 검출되지 않게 반드시 이렇게 써야함
			var userPWD = sas.SecureData.create(input.사용자비밀번호);
			if (userPWD.isSecurData()) {
				this.log('사용자비밀번호 SASSecurData 포맷!');
			} else {
				this.log('사용자비밀번호 일반 포맷!');
			}

			rtn = this.onIDLogin(userID, userPWD);
			if (rtn != S_IBX_OK) {
				return rtn;
			}

		} else if (input.로그인방식 == "CERT") {
			this.log("인증서 로그인");
			var certpath = input.인증서.이름;
			var password = input.인증서.비밀번호;

			if (!password) {
				this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
				return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
			}
			if (!certpath) {
				// PC 모듈 전환용 
				if (!input.인증서.인증서명){
					this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
					return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
				}
			}

			rtn = this.onCertLogin(input, password);
			if (rtn != S_IBX_OK) {
				return rtn;
			}

		} else {
			this.log("알수 없는 로그인 타입");
			this.setError(E_IBX_LOGIN_TYPE_ERROR);
			return E_IBX_LOGIN_TYPE_ERROR;
		}


		this.log("로그인 S_IBK_OK");
		this.bLogIn = true;

		// 결과 처리
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.사용자이름 = this.UserName;
		return S_IBX_OK;
	} catch (e) {
		//
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 개인카드 로그인 finally");
	}
};

개인카드.prototype.보유카드조회함수 = function(schUrl, 보유카드조회) {

	var userAgent = "";

	userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
	userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
	userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
	userAgent += "}";

	//쿠키 셋팅을 하기 위한 선 조회
	if (httpRequest.postWithUserAgent(userAgent, this.host + schUrl, "") == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	var resBlock = httpRequest.result + "";

	//세션체크함수
	var sessionChk = this.세션체크함수(resBlock);

	if (sessionChk != S_IBX_OK) {
		return;
	}
	if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
		this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
		return E_IBX_USER_PASSWORD_LONGTIMEUSE;
	}
	//로그인
	if (resBlock.indexOf("SsoLoginSave.do") > -1) {
		this.setError(E_IBX_SESSION_CLOSED);
		return E_IBX_SESSION_CLOSED;
	}

	var postData = "retKey=json";

	userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
	userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
	userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
	userAgent += ",\"JSON-HTTP\":\"json\"";
	userAgent += "}";

	this.log("postData = " + postData);

	if (httpRequest.postWithUserAgent(userAgent, this.host + schUrl, postData) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	this.log("보유카드조회_결과:[" + httpRequest.result + "]");
	
	//세션체크함수
	sessionChk = this.세션체크함수(httpRequest.result);

	if (sessionChk != S_IBX_OK) {
		return;
	}

	var rslt = JSON.parse(httpRequest.result);

	if (rslt) {

		if (rslt.rsList) {

			var rsList = rslt.rsList;
			var len = rsList.length;
			var idx = 0;

			for (; idx < len; idx++) {

				var temp = rsList[idx];

				if ((this.host == "https://www.bccard.com") && (temp.card_state != '정상') && (temp.card_state != '기타')) continue;

				var item = {};
				item.카드명 = StrTrim(temp.card_name);
				item.카드번호 = StrReplace(temp.cardNo, "-", "");
				item.결제월 = "";
				item.결제일 = "";
				item.당월결제액 = "0";
				item.회원사 = StrTrim(temp.bank_name);

				보유카드조회.push(item);
			}
		}
	} else {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	return S_IBX_OK;
};

개인카드.prototype.청구내역상세조회 = function(optionArray) {
	// 청구내역 상세 조회 함수.
	this.url = "/app/card/BillpActn.do";

	//03|20160725|03123956560|030892|
	this.postData = "retKey=json";
	this.postData += "&searchBankCode=" + optionArray[0];
	this.postData += "&searchSettleDate=" + optionArray[1];
	this.postData += "&searchMemberNo=" + optionArray[3];
	this.postData += "&billUnitNo=" + optionArray[4];

	this.log("this.postData : " + this.postData);

	this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
	this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
	this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
	this.userAgent += ",\"JSON-HTTP\":\"json\"";
	this.userAgent += "}";

	if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	this.log("청구내역상세조회" + httpRequest.result);
	//세션체크함수
	var sessionChk = this.세션체크함수(httpRequest.result);

	if (sessionChk != S_IBX_OK) {
		return;
	}

	return S_IBX_OK;
};

개인카드.prototype.보유카드조회 = function (aInput) {
	this.log(BankName + " 보유카드조회 호출");

	try {

		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		//신용카드목록 가져오기
		system.setStatus(IBXSTATE_ENTER, 30);
		this.host = "https://www.bccard.com";

		var 보유카드조회 = [];

		var rslt = this.보유카드조회함수("/app/card/IssueinquiryActn.do", 보유카드조회);
		if (rslt != S_IBX_OK) {
			return;
		}

		rslt = this.보유카드조회함수("/app/card/IssueinquiryCheckActn.do", 보유카드조회);
		if (rslt != S_IBX_OK) {
			return;
		}		

		if (보유카드조회.length > 0) {
			this.iSASInOut.Output.Result.보유카드조회 = 보유카드조회;
		} else {
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		//결제일 찾기는 청구내역페이지의 발급사 select box 의 내용을 가져온다.
		system.setStatus(IBXSTATE_RESULT, 90);
		var 발급사selectBox = [];

		this.발급사selectbox조회(발급사selectBox, "");

		var arrayTemp = [];
		var idx = 0;
		var optionArray;
		var retunResult;
		// 각 회원사의 최근 결제액만 가져오기 위하여 아래와 같이 처리..
		while (true) {
			if (!발급사selectBox[idx]) break;
			if (idx == 0) {
			// 첫 데이터는 바로 청구내역 상세조회하여 결제액 저장.
				optionArray = 발급사selectBox[idx].split("|");
				if (this.청구내역상세조회(optionArray) != S_IBX_OK) return;
	
				// 월청구금액
				var 결제액 = StrGrab(httpRequest.result, '"totalAmount":"', '"');
				if (!결제액) 결제액 = '0';

				arrayTemp.push(발급사selectBox[idx] + "|" + 결제액);
			} else {
				// 다음 데이터부터는 비교하여 동일한 회원사면 제외
				var FindData = false;
				var compare1 = StrGrab((발급사selectBox[idx].split("|"))[5], '', '(결제일');
				for (var selecIdx = 0; selecIdx < arrayTemp.length; selecIdx++) {
					var compare2 = StrGrab((arrayTemp[selecIdx].split("|"))[5], '', '(결제일');
					
					if (compare2 == compare1) { FindData = true; break; }
				}
				if (!FindData) {
				// 새로 추가된 데이터인 경우에만 상세조회 시작.
					optionArray = 발급사selectBox[idx].split("|");
					if (this.청구내역상세조회(optionArray) != S_IBX_OK) return;
		
					// 월청구금액
					var 결제액 = StrGrab(httpRequest.result, '"totalAmount":"', '"');
					// if (!결제액) 결제액 = '0';

					arrayTemp.push(발급사selectBox[idx] + "|" + 결제액);
				}
			}
			idx++;
		}

		var len = 보유카드조회.length;	
		var len2 = arrayTemp.length;

		for (idx = 0; idx < len; idx++) {

			var 카드 = 보유카드조회[idx];
			var 회원사 = 카드.회원사;

			for (var ij = 0; ij < len2; ij++) {
				var temp2 = arrayTemp[ij];
				if (temp2.indexOf(회원사) > -1) {
					this.log("Select_Data : " + temp2);

					var tempSplit = temp2.split("|");
					카드.결제월 = tempSplit[1].substr(0, 6);
					카드.결제일 = tempSplit[1].substr(6, 2);

					카드.당월결제액 = tempSplit[6];
					break;
				}
			}
		}

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 보유카드조회 finally");
	}
};

개인카드.prototype.승인내역 = function (aInput) {
	this.log(BankName + " 승인내역 호출");

	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 조회시작일 = input.조회시작일;
		var 조회종료일 = input.조회종료일;

		if (!조회시작일) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
			return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
		}
		if (!IsCurrency(조회시작일) || 조회시작일.length != 8) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
			return E_IBX_ENUM_DATE_BEGIN_INVALID;
		}
        var tmpDate = new Date(조회시작일.substring(0, 4), parseInt(조회시작일.substring(4, 6)) - 1, 조회시작일.substring(6, 8));
        if (tmpDate.yyyymmdd() != 조회시작일) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
            return E_IBX_ENUM_DATE_BEGIN_INVALID;
        }
		if (!조회종료일) {
			this.setError(E_IBX_ENUM_DATE_END_NOTENTER);
			return E_IBX_ENUM_DATE_END_NOTENTER;
		}
		if (!IsCurrency(조회종료일) || 조회종료일.length != 8) {
			this.setError(E_IBX_ENUM_DATE_END_INVALID);
			return E_IBX_ENUM_DATE_END_INVALID;
		}
        tmpDate = new Date(조회종료일.substring(0, 4), parseInt(조회종료일.substring(4, 6)) - 1, 조회종료일.substring(6, 8));
        if (tmpDate.yyyymmdd() != 조회종료일) {
            this.setError(E_IBX_ENUM_DATE_END_INVALID);
            return E_IBX_ENUM_DATE_END_INVALID;
        }
		if (parseInt(조회시작일) > parseInt(조회종료일)) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_GREATTHENEND);
			return E_IBX_ENUM_DATE_BEGIN_GREATTHENEND;
		}
        if (parseInt(조회시작일) > parseInt(new Date().yyyymmdd())) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_FUTURE);
            return E_IBX_ENUM_DATE_BEGIN_FUTURE;
        }
        if (parseInt(조회종료일) > parseInt(new Date().yyyymmdd())) {
            this.setError(E_IBX_ENUM_DATE_END_FUTURE);
            return E_IBX_ENUM_DATE_END_FUTURE;
		}
	
		system.setStatus(IBXSTATE_ENTER, 50);
		var Result = {};
			Result.승인금액합계 = "";
			Result.국내승인금액합계 = "";
			Result.해외승인금액합계 = "";
			Result.내역정렬순서 = "0";
			Result.승인내역조회 = [];

		this.host = "https://www.bccard.com";
		this.url = "/app/card/ApproveActn.do";

		var 카드리스트 = {};
		var 승인내역PostData = "";
		var 승인내역Agent = "";

		승인내역Agent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		승인내역Agent += ",\"Accept\":\"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\"";
		승인내역Agent += "}";

		if (httpRequest.postWithUserAgent(승인내역Agent, this.host + this.url, 승인내역PostData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("승인내역조회: " + httpRequest.result);

		//세션체크함수
		sessionChk = this.세션체크함수(httpRequest.result);
		if (sessionChk != S_IBX_OK) {
			return;
		}

		if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
			this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
			return E_IBX_USER_PASSWORD_LONGTIMEUSE;
		}
		if (httpRequest.result.indexOf("이용약관을 확인하시고 이용에 차질 없으시길 바랍니다") > -1 || httpRequest.result.indexOf(">통합 컨텐츠몰 이용약관<") > -1) {
			this.setError(E_IBX_CUSTOMER_NOT_AGREEMENT);
			return E_IBX_CUSTOMER_NOT_AGREEMENT;
		}

		var BankCodeCheck = true;
		var bankSelect = "000";

		var 회원사 = input.회원사;
		if (회원사) {			
			if (회원사.indexOf(':') > -1){
				회원사 = StrGrab(회원사, '', ':');
			}

			// 회원사 코드값 스크랩
			var BankCode = StrGrab(httpRequest.result, '<select ', '</select>');
			var idx = 2;

			while (true) {
				if (StrGrab(BankCode, '<option ', '</option>', idx) == "") break;

				var BankValue = StrGrab(StrGrab(BankCode, '<option ', '</option>', idx), '>', '');
				// 회원사 확인
				if (회원사.indexOf(BankValue) > -1) {
					bankSelect = StrGrab(BankCode, '<option value="', '"', idx);
					BankCodeCheck = true;
					break;
				} else {
					BankCodeCheck = false;
					idx++;
				}
			}
		}

		if (!BankCodeCheck) {
			this.setError(E_IBX_CARD_MEMBER_INVALID);
			return E_IBX_CARD_MEMBER_INVALID;
		}

		// 회원사와 동일하게 처리
		var BankCodeCheck = true;
		var 구분 = input.구분; // ex) "농협은행:011" 또는 "농협은행"
		if (구분) {
			if (구분.indexOf(':') > -1){
				구분 = StrGrab(구분, '', ':');
			}

			// 구분 코드값 스크랩
			var BankCode = StrGrab(httpRequest.result, '<select ', '</select>');
			var idx = 2;

			while (true) {
				if (StrGrab(BankCode, '<option ', '</option>', idx) == "") break;

				var BankValue = StrGrab(StrGrab(BankCode, '<option ', '</option>', idx), '>', '');
				// 구분 확인
				if (구분.indexOf(BankValue) > -1) {
					bankSelect = StrGrab(BankCode, '<option value="', '"', idx);
					BankCodeCheck = true;
					break;
				} else {
					BankCodeCheck = false;
					idx++;
				}
			}
		}
		if (!BankCodeCheck) {
			this.setError(E_IBX_CARD_MEMBER_INVALID);
			return E_IBX_CARD_MEMBER_INVALID;
		}
		if (회원사 && 구분) {
			// 구분 != 회원사 경우, 결과 없음 또는 잘못된 카드 회원사명
			if (회원사 != 구분) {
				this.setError(E_IBX_CARD_MEMBER_INVALID);
				return E_IBX_CARD_MEMBER_INVALID;
			}
		}

		// 국내
		var 국내rslt = this.승인내역조회함수(조회시작일, 조회종료일, "in", Result, 카드리스트, bankSelect, input.조회구분);
		if (국내rslt != S_IBX_OK) {
			return;
		}

		// 국외
		// 최대 구간을 5번을 나누어서 조회하도록 로직 변경.
		// ykk9096, 2019.09.30
		var 최근2개월, 최근4개월, 최근6개월, 최근8개월;
		var 실제조회시작 = '', 실제조회종료 = '';
		var 국외rslt;
		var setbreak = false; // 더 이상 조회 하지 않음.
		tmpDate = new Date(조회종료일.substring(0, 4), parseInt(조회종료일.substring(4, 6)) - 1, 조회종료일.substring(6, 8));
		tmpDate.setMonth(tmpDate.getMonth() - 2);
		if (parseInt(조회시작일) < parseInt(tmpDate.yyyymmdd())) {
			this.log('-조회기간2개월 초과');

			for (var searchLoop = 0; searchLoop < 5; searchLoop++) {
				this.log('searchLoop::' + searchLoop);
				if (setbreak) break;
				var d = new Date();
				// 2개월 이내: 최근2개월 ~ 조회종료일
				if (searchLoop == 0) {
					d.setMonth(d.getMonth() - 2);
					var 최근2개월 = d.yyyymmdd();
	
					if (parseInt(조회시작일) >= parseInt(최근2개월) &&
						parseInt(조회종료일) >= parseInt(최근2개월)) {
						실제조회시작 = 조회시작일; 실제조회종료 = 조회종료일;
						setbreak = true;
					} else if (parseInt(조회시작일) < parseInt(최근2개월) &&
								parseInt(조회종료일) >= parseInt(최근2개월)) {
						실제조회시작 = 최근2개월; 실제조회종료 = 조회종료일;
					} else if (parseInt(조회시작일) < parseInt(최근2개월) &&
								parseInt(조회종료일) < parseInt(최근2개월))
						continue;
	
					국외rslt = this.승인내역조회함수(실제조회시작, 실제조회종료, "out", Result, 카드리스트, bankSelect, input.조회구분);
	
				// 2개월 ~ 4개월: 최근4개월 ~ 최근2개월
				} else if (searchLoop == 1) {
					d.setMonth(d.getMonth() - 4);
					var 최근4개월 = d.yyyymmdd();
					if (parseInt(조회종료일) >= parseInt(최근2개월)) {
						d = new Date();
						d.setMonth(d.getMonth() - 2);
						d.setDate(d.getDate() - 1);
						실제조회종료 = d.yyyymmdd();
						if (parseInt(조회시작일) < parseInt(최근4개월)) {
							실제조회시작 = 최근4개월;
						} else if (parseInt(조회시작일) >= parseInt(최근4개월)) {
							실제조회시작 = 조회시작일;
							setbreak = true;
						}
					} else if (parseInt(조회종료일) < parseInt(최근2개월)) {
						if (parseInt(조회종료일) < parseInt(최근4개월)) continue;
	
						실제조회종료 = 조회종료일;
						if (parseInt(조회시작일) < parseInt(최근4개월)) {
							실제조회시작 = 최근4개월; 
						} else if (parseInt(조회시작일) >= parseInt(최근4개월)) {
							실제조회시작 = 조회시작일;
							setbreak = true;
						}
					}
	
					국외rslt = this.승인내역조회함수(실제조회시작, 실제조회종료, "out", Result, 카드리스트, bankSelect, input.조회구분);
	
				// 4개월 ~ 6개월: 최근6개월 ~ 최근4개월
				} else if (searchLoop == 2) {
					d.setMonth(d.getMonth() - 6);
					var 최근6개월 = d.yyyymmdd();
	
					if (parseInt(조회종료일) >= parseInt(최근4개월)) {
						d = new Date();
						d.setMonth(d.getMonth() - 4);
						d.setDate(d.getDate() - 1);
						실제조회종료 = d.yyyymmdd();
	
						if (parseInt(조회시작일) < parseInt(최근6개월)) {
							실제조회시작 = 최근6개월;
						} else if (parseInt(조회시작일) >= parseInt(최근6개월)) {
							실제조회시작 = 조회시작일;
							setbreak = true;
						}
					} else if (parseInt(조회종료일) < parseInt(최근4개월)) {
						if (parseInt(조회종료일) < parseInt(최근6개월)) continue;
	
						실제조회종료 = 조회종료일;
						if (parseInt(조회시작일) < parseInt(최근6개월)) {
							실제조회시작 = 최근6개월; 
						} else if (parseInt(조회시작일) >= parseInt(최근6개월)) {
							실제조회시작 = 조회시작일;
							setbreak = true;
						}
					}
	
					국외rslt = this.승인내역조회함수(실제조회시작, 실제조회종료, "out", Result, 카드리스트, bankSelect, input.조회구분);
	
				// 6개월 ~ 8개월: 최근8개월 ~ 최근6개월
				} else if (searchLoop == 3) {
					d.setMonth(d.getMonth() - 8);
					var 최근8개월 = d.yyyymmdd();
	
					if (parseInt(조회종료일) >= parseInt(최근6개월)) {
						d = new Date();
						d.setMonth(d.getMonth() - 6);
						d.setDate(d.getDate() - 1);
						실제조회종료 = d.yyyymmdd();
	
						if (parseInt(조회시작일) < parseInt(최근6개월)) {
							실제조회시작 = 최근8개월;
						} else if (parseInt(조회시작일) >= parseInt(최근6개월)) {
							실제조회시작 = 조회시작일;
							setbreak = true;
						}
					} else if (parseInt(조회종료일) < parseInt(최근6개월)) {
						if (parseInt(조회종료일) < parseInt(최근8개월)) continue;
	
						실제조회종료 = 조회종료일;
						if (parseInt(조회시작일) < parseInt(최근8개월)) {
							실제조회시작 = 최근8개월; 
						} else if (parseInt(조회시작일) >= parseInt(최근8개월)) {
							실제조회시작 = 조회시작일;
							setbreak = true;
						}
					}
	
					국외rslt = this.승인내역조회함수(실제조회시작, 실제조회종료, "out", Result, 카드리스트, bankSelect, input.조회구분);
	
				// 9개월이하: 최근9개월 ~ 최근8개월
				// 최근9개월은 사이트 계산식과 동일한 일자로 계산.
				} else {
					if (parseInt(조회종료일) >= parseInt(최근8개월)) {
						d = new Date();
						d.setMonth(d.getMonth() - 8);
						d.setDate(d.getDate() - 1);
						실제조회종료 = d.yyyymmdd();
					} else if (parseInt(조회종료일) < parseInt(최근8개월)) {
						실제조회종료 = 조회종료일;
					}
					실제조회시작 = 조회시작일;
					setbreak = true;
	
					국외rslt = this.승인내역조회함수(실제조회시작, 실제조회종료, "out", Result, 카드리스트, bankSelect, input.조회구분);
				}
	
				if (국외rslt != S_IBX_OK) {
					return;
				}
			}
		} else {
			this.log('-조회기간2개월 이내');
			국외rslt = this.승인내역조회함수(조회시작일, 조회종료일, "out", Result, 카드리스트, bankSelect, input.조회구분);
			if (국외rslt != S_IBX_OK) {
				return;
			}
		}

		if (Result.승인내역조회.length == 0) {
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result = Result;

		//정열
		Result.승인내역조회.sort(function (a, b) {
			var A승인일자시간 = a.승인일자 + a.승인시간;
			var B승인일자시간 = b.승인일자 + b.승인시간;
			return A승인일자시간 > B승인일자시간 ? -1 : A승인일자시간 < B승인일자시간 ? 1 : 0;
		});
		return S_IBX_OK;
	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 승인내역 finally");
	}
};

개인카드.prototype.청구내역 = function (aInput) {
	this.log(BankName + " 청구내역 호출");

	try {

		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 결제일 = input.결제일;
		var thisMonth = 결제일;
		// 입력값 "회원사"에서 "구분"으로 변경됨 20190801
		var 구분 = input.구분;

		if (!구분) {
			구분 = input.회원사;
		}

		if (구분 == 'KB국민은행') 구분 = 'KB국민카드';

		if (!thisMonth) {
			thisMonth = js_yyyy_mm_dd();
		}
		thisMonth = thisMonth.substr(0, 6);
		
		if ( !IsCurrency(thisMonth) || thisMonth.length != 6 ||
			thisMonth.indexOf('.') > -1 || thisMonth.indexOf('-') > -1) {
			this.setError(E_IBX_DATE_BILL_INVALID);
			return E_IBX_DATE_BILL_INVALID;
		}
		var tmpDate = new Date(thisMonth.substring(0,4), parseInt(thisMonth.substring(4,6)) - 1, 1);
		if (tmpDate.yyyymmdd().substr(0, 6) != thisMonth) {
			this.setError(E_IBX_DATE_BILL_INVALID);
			return E_IBX_DATE_BILL_INVALID;
		}
		
		system.setStatus(IBXSTATE_ENTER, 30);		
		var BankCode;
		var res구분;
		var UseBankCode = false;

		var 회원사코드, 회원사명;
		if (구분) {
			
			// ex) "농협은행:011" 또는 "NH농협카드"(2020.02.20 수정 전 카드목록 구분값.)		
			if (구분.indexOf(':') > -1 ){
				// 청구내역은 회원사코드 사용..
				UseBankCode = true;
				회원사코드 = 구분.substr(-3);
				회원사명 = StrGrab(구분, '', ':' + 회원사코드);
				if (회원사코드 == ""){
					this.setError(E_IBX_CARD_MEMBER_INVALID);
					return E_IBX_CARD_MEMBER_INVALID;
				}	

			} else {
				// 기존 사용자는 기존 입력되는 값으로 처리되도록..
				회원사코드 = '';
				회원사명 = 구분;
			}
			this.log("회원사명: " + 회원사명);
			this.log("회원사코드: " + 회원사코드);

					

			system.setStatus(IBXSTATE_ENTER, 33);
			// 월별명세서조회/재수신>이용대금명세서>카드이용조회			
			this.url = '/app/card/BillpMonthActn.do';
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "") == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}

			//세션체크함수
			sessionChk = this.세션체크함수(httpRequest.result);
			if (sessionChk != S_IBX_OK) {
				return;
			}
			if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
				this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
				return E_IBX_USER_PASSWORD_LONGTIMEUSE;
			}
			
			if (httpRequest.result.indexOf('일시적인 시스템 오류가 발생하였습니다') > -1) {
				this.url = '/app/card/BillpActn.do';
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "") == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}				

				sessionChk = this.세션체크함수(httpRequest.result);
				if (sessionChk != S_IBX_OK) {
					return;
				}
			}

			var 청구은행코드 = StrGrab(httpRequest.result, 'name="bankList"', '</select>');	
			this.log("청구은행코드: " + 청구은행코드);

			// 입력된 카드가 청구페이지에 없으면 '0' 결과처리			
			if ( 청구은행코드.indexOf( UseBankCode ? '"' + 회원사코드 + '|' : 회원사명) == -1 ) {
				 
				var 청구내역조회 = [];
				var item = {};

				item.카드번호 = '0';
				item.카드종류 = '0';

				item.결제일 = '0';
				item.출금예정일 = '0';
				item.이용일자 = '0';
				item.가맹점명 = '0';
				item.할부개월 = '0';
				item.입금회차 = '0';

				item.이용대금 = '0';
				item.청구금액 = '0';
				item.수수료 = '0';
				item.결제후잔액 = '0';
				item.가맹점사업자번호 = '0';
				item.가맹점업종 = '0';
				item.가맹점전화번호 = '0';
				item.가맹점주소 = '0';
				item.가맹점대표자명 = '0';
				item.회원사 = input.구분;
				item.청구내역포인트 = '0';
				item.구분 = input.구분;

				청구내역조회.push(item);
				this.iSASInOut.Output.Result.내역정렬순서 = "0";
				this.iSASInOut.Output.Result.월청구금액 = '0';

				this.iSASInOut.Output.Result.청구내역조회 = 청구내역조회;
				return;			
			}

			// 입력받은 회원사의 해당 결제월 명세서 유무 확인 및 매칭
			var TempStr;
			var i = 0;

			while (true) {
				i++;
				//<option value="020|0001|1900015">우리카드(0001)</option>
				TempStr = StrGrab(청구은행코드, '<option', '</option>', i);
				if (!TempStr) break;

				if (UseBankCode){
					if (TempStr.indexOf('"' + 회원사코드 + '|') > -1) {
						BankCode = 회원사코드;
						break;
					}
				} else {
					if (TempStr.indexOf(회원사명) > -1) {
						BankCode = StrGrab(TempStr, 'value="', '|');
						break;
					}
				}						
			}		
			if (!BankCode){
				setError(E_IBX_SITE_INVALID); 
				return E_IBX_SITE_INVALID;
			}

		}

		//주1) 카드번호 결과처리를 위해... (suhyeonban92 2019.06.11)
		//As-is. 
		//1. 결제월 기준(지난달 1일 부터 결제월 마지막 일까지)으로 승인내역조회 한다.
		//2. 승인내역조회에서 카드코드와 카드번호 매칭.
		//3. 청구내역조회에서 조회가능한 카드코드(ex. C573, V005)와 2번의 카드코드 매칭하여 카드번호 스크랩.
		//이 경우, 승인내역조회 기간동안 해당 카드의 내역이 없는 경우, 청구내역에 있어도 결과처리 안되는 오류 발생. (ex. 할부건, 포인트 결제건))

		//To-be. 
		//1. 보유카드조회 페이지에서 조회가능한 (신용/체크)카드번호 스크랩
		//2. 청구내역에서 조회가능한 카드코드는 브랜드명(B,G,C,M,V,J)+카드번호(뒤3자리) 로 구성되어 있음.
		//3. 청구내역에서 조회가능한 카드코드의 카드번호와 보유카드조회 카드번호 매칭하여, 카드번호 스크랩.
		
		
		// 보유카드목록조회 
		// 신용카드
		this.url = "/app/card/IssueinquiryActn.do";		
		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "retKey=json") == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("main1: ["+ httpRequest.result +"]");

		//세션체크함수
		sessionChk = this.세션체크함수(httpRequest.result);
		if (sessionChk != S_IBX_OK) { return; }

		if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
			this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
			return E_IBX_USER_PASSWORD_LONGTIMEUSE;
		}

		var ResultStr = httpRequest.result;
		var 보유카드OBJ;
		try {
			보유카드OBJ = JSON.parse(ResultStr);
			보유카드OBJ = 보유카드OBJ.rsList;		

		} catch (e) {
			
			// JSON 변환 실패하는 경우 재통신로직 추가.(사이트에서 간헐적으로 오류발생함.)
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "retKey=json") == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			this.log("main1_re: ["+ httpRequest.result +"]");
			sessionChk = this.세션체크함수(httpRequest.result);
			if (sessionChk != S_IBX_OK) { return; }

			ResultStr = httpRequest.result;

			try {
				보유카드OBJ = JSON.parse(ResultStr);
				보유카드OBJ = 보유카드OBJ.rsList;

			} catch(e) {
				this.log("신용카드 보유카드OBJ JSON 변환 실패");
				this.setError(E_IBX_SITE_INVALID);
				return E_IBX_SITE_INVALID;
			}
		}

		var 보유카드리스트 = [];		
		for(var i = 0; i < 보유카드OBJ.length; i++){		
			보유카드리스트.push((보유카드OBJ[i]));
		}
		
		// 체크카드
		this.url = "/app/card/IssueinquiryCheckActn.do";
		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "retKey=json") == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		this.log("main2: ["+ httpRequest.result +"]");

		//세션체크함수
		sessionChk = this.세션체크함수(httpRequest.result);

		if (sessionChk != S_IBX_OK) {
			return;
		}		

		ResultStr = httpRequest.result;
		try {			
			보유카드OBJ = JSON.parse(ResultStr);
			보유카드OBJ = 보유카드OBJ.rsList;

		} catch (e) {
			// JSON 변환 실패하는 경우 재통신로직 추가.(사이트에서 간헐적으로 오류발생함.)			
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "retKey=json") == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			this.log("main2_re: ["+ httpRequest.result +"]");
			//세션체크함수
			sessionChk = this.세션체크함수(httpRequest.result);
			if (sessionChk != S_IBX_OK) { return; }		
			ResultStr = httpRequest.result;
			
			try {
				보유카드OBJ = JSON.parse(ResultStr);
				보유카드OBJ = 보유카드OBJ.rsList;

			} catch(e) {
				this.log("체크카드 보유카드OBJ JSON 변환 실패");
				this.setError(E_IBX_SITE_INVALID);
				return E_IBX_SITE_INVALID;
			}

		}

		for(var i = 0; i < 보유카드OBJ.length; i++){		
			보유카드리스트.push(보유카드OBJ[i]);
		}
		this.log("보유카드리스트: [ " + JSON.stringify(보유카드리스트) +"]");
		
		if (보유카드리스트.length == 0){
			this.setError(E_IBX_SITE_INVALID + 1);
			return E_IBX_SITE_INVALID + 1;
		}

		//발급사 목록 조회
		this.url = "/app/card/BillpActn.do";
		this.postData = "";
		var resBlock = "";

		//청구월 조회 및 발급사 목록 조회
		var 발급사selectBox = [];

		this.발급사selectbox조회(발급사selectBox, thisMonth);		

		var len = 발급사selectBox.length;
		
		if (len == 0) {
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		//청구내역 조회 시작
		var 청구내역조회 = [];
		var idx = 0;
		var 월청구금액 = [];
		var 결제계좌은행;
		var 결제계좌번호;
		var sum = 0;

		var item = {};
		for (idx = 0; idx < len; idx++) {
			system.setStatus(IBXSTATE_EXECUTE, 80);
			var tempObj = 발급사selectBox[idx];

			res구분 = StrGrab(tempObj, '|', '(', 5) + ':' + StrGrab(tempObj, '', '|');
			
			var optionArray = tempObj.split("|");
			if (this.청구내역상세조회(optionArray) != S_IBX_OK) return;

			resBlock = httpRequest.result + "";
			this.log('청구내역 resBlock : ' + resBlock);

			var 청구내역OBJ;
			try {
				청구내역OBJ = JSON.parse(resBlock);
			} catch (e) {

				// JSON 변환 실패하는 경우 재통신로직 추가.(사이트에서 간헐적으로 오류발생함.)
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				resBlock = httpRequest.result + "";
				this.log('청구내역 resBlock_re : ' + resBlock);

				//세션체크함수
				var sessionChk = this.세션체크함수(resBlock);
				if (sessionChk != S_IBX_OK) { return; }

				try {
					청구내역OBJ = JSON.parse(resBlock);

				} catch(e) {
					this.log("청구내역 resBlock JSON 변환 실패");
					this.setError(E_IBX_SITE_INVALID);
					return E_IBX_SITE_INVALID;
				}				
			}
			
			if (구분){				
				if (청구내역OBJ.searchBankCode == BankCode){
					if(!청구내역OBJ.settleAccno){
						this.setError(E_IBX_SITE_INVALID + 2);
						return E_IBX_SITE_INVALID + 2;
					} else {
						결제계좌번호 = StrReplace(청구내역OBJ.settleAccno, '-', '');
					}
					if (!StrReplace(청구내역OBJ.acctBankNm, '-', '')) {
						if (!StrReplace(청구내역OBJ.settleBank, '-', '')) {
							this.setError(E_IBX_SITE_INVALID + 3);
							return E_IBX_SITE_INVALID + 3;
						} else {
							결제계좌은행 = 청구내역OBJ.settleBank;
							if (결제계좌은행.indexOf('(')) 결제계좌은행 = StrTrim(StrGrab(결제계좌은행, '', '('));
						}
					} else {
						결제계좌은행 = StrReplace(청구내역OBJ.acctBankNm, '-', '');
					}
				}else{
					continue;
				} 
			}else{
				결제계좌은행 = '';
				결제계좌번호 = '';
			}

			// 월청구금액
        	월청구금액.push(청구내역OBJ.totalAmount);
			this.log("월청구금액==" + 월청구금액);

			if (청구내역OBJ) {	
				// 전월미결제액은 청구내역OBJ.detailList에 내역 출력 안됨
				if (청구내역OBJ.notPAmount != '0') { // notPAmount 값이 0이 아닌 경우 화면에 출력됨
					item.카드번호 = "";
					item.카드종류 = "";

					item.결제일 = optionArray[1];
					item.출금예정일 = optionArray[1].substring(0, 4) + StrReplace(StrReplace(StrReplace(청구내역OBJ.viewPayDay, "월", ""), "일", ""), " ", "");
					item.이용일자 = "";
					item.가맹점명 = "전월미결제액";
					item.할부개월 = "";
					item.입금회차 = "";

					item.이용대금 = "";
					item.청구금액 = 청구내역OBJ.notPAmount;
					item.수수료 = 청구내역OBJ.notPAmount;
					item.결제후잔액 = "";
					item.가맹점사업자번호 = "";
					item.가맹점업종 = "";
					item.가맹점전화번호 = "";
					item.가맹점주소 = "";
					item.가맹점대표자명 = "";
					item.회원사 = StrReplace(청구내역OBJ.settleBank, ' ', '');
					item.청구내역포인트 = "";
					item.구분 = StrReplace(res구분, ' ', '');

					청구내역조회.push(item);
				}

				if (청구내역OBJ.detailList && 청구내역OBJ.detailList.length > 0) {

					var 카드Type = parseInt(청구내역OBJ.searchBankCode);
					if (카드Type == 3) {			//IBK기업은행
						카드Type = "IBK 기업은행 BC카드";
					} else if (카드Type == 6)  {	//KB국민은행
						카드Type = "KB 국민 BC카드";
					} else if (카드Type == 11 || 카드Type == 12 || 카드Type == 13 || 카드Type == 14) {	//농협중앙회, 농협(조합)), 농협 농촌사랑
						카드Type = "NH 농협 BC카드";
					} else if (카드Type == 21) {	//신한은행
						카드Type = "신한 BC카드";
					} else if (카드Type == 22 || 카드Type == 24 || 카드Type == 20) {	//우리카드(상업), 우리카드(한일), 우리카드
						카드Type = "우리 BC카드";
					} else if (카드Type == 23) {	//SC제일은행
						카드Type = "SC제일은행 BC카드";
					} else if (카드Type == 25 || 카드Type == 33 || 카드Type == 81) {	//하나은행, 하나은행(구하나), 하나비자
						카드Type = "하나 BC카드";
					} else if (카드Type == 31) {	//대구은행
						카드Type = "DGB 대구은행 BC카드";
					} else if (카드Type == 32) {	//부산은행
						카드Type = "BNK부산은행 BC카드";
					} else if (카드Type == 36) {	//씨티은행
						카드Type = "씨티은행 BC카드";
					} else if (카드Type == 39) {	//경남은행
						카드Type = "BNK경남은행 BC카드";
					} else {								//그 외엔 BC카드
						카드Type = "바로 BC카드";
					}
					var ListObj = 청구내역OBJ.detailList;
                    var len2 = ListObj.length;

					var i = 0;
					var j = 0;
					var k = 0;
					var 카드번호2 = "";
					for (i = 0; i < len2; i++) {
						var temp = ListObj[i];						
						var 카드종류 = 카드Type + temp.RETVAL13;						

						//주1
						for (j = 0; j < 보유카드리스트.length; j++){	
							if( (보유카드리스트[j].cardNo.substring(16) == temp.RETVAL13.substring(1, 4)) &&
						 		(보유카드리스트[j].card_state == '정상')){
								카드번호2 = StrReplace(보유카드리스트[j].cardNo, '-', '');
								this.log("카드번호2_정상: " + 카드번호2);
								break;
							}							
						}

						// 정상인 카드번호 없는 경우, 그외 케이스(신규/미등록, 장기미사용...)에서 매칭.
						if (카드번호2 == ''){							
							for (; k < 보유카드리스트.length; k++){								
								if( (보유카드리스트[k].cardNo.substring(16) == temp.RETVAL13.substring(1, 4))){
									카드번호2 = StrReplace(보유카드리스트[k].cardNo, '-', '');
									this.log("카드번호2: " + 카드번호2);
									break;
								}								
							}
						}

						if (카드번호2 == ''){
							// 보유카드내역에서 카드번호 확인 안되는 경우, 청구내역에 보여지는 카드번호 출력.
							// ex. 카드번호 재발급 받은 경우, 과거 카드번호는 조회안됨.
							카드번호2 = '*************' + temp.RETVAL13.substr(1);
						}
						
						

						var 가맹점명 = temp.RETVAL4;

						var 결제일 = optionArray[1];
						//사이트에 출금예정일 년도 나오지 않아 결제일 년도랑 같게 처리
						var 출금예정일 = 결제일.substring(0, 4) + StrReplace(StrReplace(StrReplace(청구내역OBJ.viewPayDay, "월", ""), "일", ""), " ", "");	
						var 이용일자 = StrReplace(temp.RETVAL3, ".", "");
						var 할부개월 = StrReplace(temp.RETVAL5, "P", "");
						var 입금회차 = StrReplace(temp.RETVAL6, "P", "");
						var 이용대금 = StrTrim(StrReplace(temp.RETVAL7, ",", ""));
						var 청구금액 = StrTrim(StrReplace(temp.RETVAL8, ",", ""));
						var 수수료 = StrTrim(StrReplace(temp.RETVAL9, ",", ""));
						var 결제후잔액 = StrTrim(StrReplace(temp.RETVAL24, ",", ""));
						var 청구내역포인트 = StrTrim(StrReplace(temp.TOP, ",", ""));

						var 가맹점사업자번호 = "";
						var 가맹점업종 = "";
						var 가맹점전화번호 = "";
						var 가맹점주소 = "";
						var 가맹점대표자명 = "";

						var 가맹점코드 = temp.RETVAL11;

						if (input.조회구분 != 'S') {
							
							// 해외건 가맹점코드 없음.
							if (가맹점코드) {
								var 매출전표URL = "/app/card/ChainInfoViewActn.do?memMgmtNo=" + 가맹점코드;

								system.setStatus(IBXSTATE_EXECUTE, 85);
								if (httpRequest.post(this.host + 매출전표URL, "") == false) {
								}
								
								//세션체크함수
								sessionChk = this.세션체크함수(httpRequest.result);

								if (sessionChk != S_IBX_OK) {
									return;
								}
								var 매출전표결과 = httpRequest.result;

								if (매출전표결과.indexOf("알 수 없는 오류 발생") > -1) {
									continue;
								} else {
									가맹점사업자번호 = StrReplace(StrGrab(매출전표결과, ">사업자등록번호 : ", "<"), "-", "");
									가맹점업종 = StrGrab(매출전표결과, ">업종 : ", "<");
									가맹점전화번호 = StrReplace(StrGrab(매출전표결과, ">전화번호 : ", "<"), '-', '');
									가맹점주소 = StrTrim(StrGrab(매출전표결과, ">대표주소 : ", "<"));
									가맹점대표자명 = StrTrim(StrGrab(매출전표결과, ">대표자명 : ", "<"));
								}
							}
						}

						item = {};

						item.카드번호 = 카드번호2;
						item.카드종류 = 카드종류;

						item.결제일 = 결제일;
						item.출금예정일 = 출금예정일;
						item.이용일자 = 이용일자;
						item.가맹점명 = 가맹점명;
						item.할부개월 = 할부개월;
						item.입금회차 = 입금회차;

						item.이용대금 = 이용대금;
						item.청구금액 = 청구금액;
						item.수수료 = 수수료;
						item.결제후잔액 = 결제후잔액;
						item.가맹점사업자번호 = 가맹점사업자번호;
						item.가맹점업종 = 가맹점업종;
						item.가맹점전화번호 = 가맹점전화번호;
						item.가맹점주소 = 가맹점주소;
						item.가맹점대표자명 = 가맹점대표자명;
						item.회원사 = StrReplace(청구내역OBJ.settleBank, ' ', '');
						item.청구내역포인트 = 청구내역포인트;
						item.구분 = StrReplace(res구분, ' ', '');

						if (!(IsCurrency(item.이용대금) || IsCurrency(item.청구금액) || IsCurrency(item.수수료) ||
							IsCurrency(item.결제후잔액))) {
		                    this.setError(E_IBX_CURRENCY_NOT_CONVERT);
		                    return E_IBX_CURRENCY_NOT_CONVERT;
		                }
						청구내역조회.push(item);
					}
				}
			}			
			else {
				this.setError(E_IBX_SITE_INVALID + 4);
				return E_IBX_SITE_INVALID + 4;
			}
		}

		if (청구내역조회.length == 0) {
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		// 동일일자의 내역에 대해 내역 출력 순서로 내려오지 않음
		// 사이트대로 결과 처리하고 reverse로 적용해야 함.
		// (sort 적용하면 절대 안됨)
		청구내역조회 = 청구내역조회.reverse();

		// 청구내역조회.sort(function (a, b) {
		// 	return a.이용일자 > b.이용일자 ? -1 : a.이용일자 < b.이용일자 ? 1 : 0;
		// });

		for(var i=0; i < 월청구금액.length; i++){
		    sum += parseInt(월청구금액[i]);
		}
		if (sum == "") {
			sum = "0";
		}
		this.log("totalAmount==" + sum);

		if (!(IsCurrency(sum))) {
            this.setError(E_IBX_CURRENCY_NOT_CONVERT);
            return E_IBX_CURRENCY_NOT_CONVERT;
        }

		this.iSASInOut.Output.Result.내역정렬순서 = "0";
		this.iSASInOut.Output.Result.월청구금액 = sum.toString();

		if(결제계좌번호){
			if(결제계좌번호.indexOf('별도표시') > -1){
				결제계좌은행 ='';
				결제계좌번호 = '';
			}
		}

		this.iSASInOut.Output.Result.결제계좌은행 = 결제계좌은행;
		this.iSASInOut.Output.Result.결제계좌번호 = 결제계좌번호;
		this.iSASInOut.Output.Result.청구내역조회 = 청구내역조회;

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 청구내역 finally");
	}
};

개인카드.prototype.해외청구내역 = function (aInput) {
	this.log(BankName + ' 개인 해외청구내역 호출 ');

	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		var input = dec(aInput.Input);
		var resultObj;
		var ResultStr;

		var 조회시작일 = input.조회시작일;
		var 조회종료일 = input.조회종료일;
		var 기준일 = new Date().yyyymmdd();

		if (!조회시작일) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
			return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
		}
		if (!조회종료일) {
			this.setError(E_IBX_ENUM_DATE_END_NOTENTER);
			return E_IBX_ENUM_DATE_END_NOTENTER;
		}
		if ((조회시작일.length != 8) || isNaN(조회시작일)) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
			return E_IBX_ENUM_DATE_BEGIN_INVALID;
		}
		var tmpDate = new Date(조회시작일.substring(0,4), parseInt(조회시작일.substring(4,6)) - 1, 조회시작일.substring(6,8));
		if ( tmpDate.yyyymmdd() != 조회시작일 ){
			this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
			return E_IBX_ENUM_DATE_BEGIN_INVALID;
		}
		if ((조회종료일.length != 8) || isNaN(조회종료일)) {
			this.setError(E_IBX_ENUM_DATE_END_INVALID);
			return E_IBX_ENUM_DATE_END_INVALID;
		}
		var tmpDate = new Date(조회종료일.substring(0,4), parseInt(조회종료일.substring(4,6)) - 1, 조회종료일.substring(6,8));
		if ( tmpDate.yyyymmdd() != 조회종료일 ){
			this.setError(E_IBX_ENUM_DATE_END_INVALID);
			return E_IBX_ENUM_DATE_END_INVALID;
		}
		if (parseInt(조회시작일) > parseInt(조회종료일)) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_GREATTHENEND);
			return E_IBX_ENUM_DATE_BEGIN_GREATTHENEND;
		}
		if (parseInt(조회시작일) > parseInt(new Date().yyyymmdd())) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_FUTURE);
			return E_IBX_ENUM_DATE_BEGIN_FUTURE;
		}
		if (parseInt(조회종료일) > parseInt(new Date().yyyymmdd())) {
			this.setError(E_IBX_ENUM_DATE_END_FUTURE);
			return E_IBX_ENUM_DATE_END_FUTURE;
		}
		
		//지금 날짜로부터 1년전 같은 월의 1일까지 조회가능
		var tmpDate = new Date();
		tmpDate.setFullYear( tmpDate.getFullYear() - 1);
		tmpDate.setDate(1);
		if (parseInt(tmpDate.yyyymmdd()) > parseInt(조회시작일)) {
			this.setError(E_IBX_ENUM_DATE_END_DENIED);
			return E_IBX_ENUM_DATE_END_DENIED;
		}
		
		//해외청구내역 타겟 페이지 이동
		//카드이용조회 > 승인내역조회 > 해외이용내역
		this.url = '/app/card/AbroadActn.do';

		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
		var ResultStr = httpRequest.result;
		
		//세션체크함수
		sessionChk = this.세션체크함수(ResultStr);

		if (sessionChk != S_IBX_OK) {
			return;
		}
		this.log("ResultStr::" + ResultStr);

		if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
			this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
			return E_IBX_USER_PASSWORD_LONGTIMEUSE;
		}
		if(ResultStr.indexOf('<legend>해외이용내역 조회 양식</legend>') < 0){
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		var fromYear = 조회시작일.substring(0, 4);
		var fromMonth = 조회시작일.substring(4, 6);
		var fromDay = 조회시작일.substring(6);
		var toYear = 조회종료일.substring(0, 4);
		var toMonth = 조회종료일.substring(4, 6);
		var toDay = 조회종료일.substring(6);
		var next_key = 조회시작일 + '00000000';
		var key_type = 'INIT';

		var 해외청구내역 = [];
		var item;

		//next_key가 있으면 계속 반복
		while(ResultStr){

			this.postData = 'retKey=json';
			this.postData += '&__E2E_RESULT__=';
			this.postData += '&__E2E_UNIQUE__=';
			this.postData += '&__E2E_KEYPAD__=';
			this.postData += '&key_type=' + key_type;
			this.postData += '&next_key=' + next_key;
			this.postData += '&comparator=' + 조회시작일;
			this.postData += '&fromYYYY=' + fromYear;
			this.postData += '&fromMM=' + fromMonth;
			this.postData += '&fromDD=' + fromDay;
			this.postData += '&toYYYY=' + toYear;
			this.postData += '&toMM=' + toMonth;
			this.postData += '&toDD=' + toDay;
			this.postData += '&bankSelect=';
			this.postData += '&payMethod=1';
			this.postData += '&ra=custom_date';
			this.postData += '&fromDate=' + fromYear + '-' + fromMonth + '-' + fromDay;
			this.postData += '&toDate=' + toYear + '-' + toMonth + '-' + toDay;
			this.postData += '&excelKey=';
			this.postData += '&retKey=';
			this.postData += '&bankSelect1=';	
			this.postData += '&selMon=0';
			this.postData += '&inqPeriod=2';
			this.postData += '&fromDate1=' + fromYear + '-' + fromMonth + '-' + fromDay;
			this.postData += '&toDate1=' + toYear + '-' + toMonth + '-' + toDay;
			this.postData += '&payMethod1=1';

			//첫목록조회만 key_type = 'INIT' 그다음부터 'NEXT'
			if(key_type == 'INIT'){
				key_type = 'NEXT';
			}

			this.url = "/app/card/AbroadActn.do";
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}

			ResultStr = httpRequest.result + '';

			this.log('httpResponse return resultObj: [' + ResultStr + ']');
			
			//세션체크함수
			sessionChk = this.세션체크함수(httpRequest.result);

			if (sessionChk != S_IBX_OK) {
				return;
			}	

			if (ResultStr.indexOf('일시적인 시스템 오류가 발생하였습니다') > -1) {
				this.url = '/app/card/BillpActn.do';
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "") == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
			}		
			
			if(ResultStr.indexOf('next_key') < 0){
				this.setError(E_IBX_SITE_INVALID);
				return E_IBX_SITE_INVALID;
			}

			resultObj = JSON.parse(ResultStr);

			if(!resultObj.returnList) break;

			next_key = resultObj.next_key;

			//매출전표 URL
			this.url = "/app/card/ApproveSaleSlipActn.do";

			this.log('JSON 리턴 배열 타입 : [ ' + typeof(resultObj.returnList)+ ']');
			this.log('JSON 리턴 배열길이 : [ ' + resultObj.returnList.length + ']');
			//해외이용내역 받아온 JSON리스트 개수만큼 반복하며 매출전표 조회
			for(var i = 0; i < resultObj.returnList.length; i++){
				item = {};

				this.log('returnList item' + JSON.stringify(resultObj.returnList[i]));

				//이전 응답의 결과값을 Query 입력 값으로 넣어 매출전표로 출력 
				this.postData = '?';
				this.postData += 'type=out';
				this.postData += '&brndDv='		+ httpRequest.URLEncodeAll(resultObj.returnList[i].cardNoV4.substring(0, 1));
				this.postData += '&cardNo_1=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].cardNo);
				this.postData += '&rcvDate=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].rcvDate);
				this.postData += '&authDtm=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].saleDate);
				this.postData += '&trnxAmt=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].loclAmt);
				this.postData += '&wonRcvAmt=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].sumList);
				this.postData += '&taoAuthNo=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].useNo);
				this.postData += '&tmpMerNm=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].abMerNm);
				this.postData += '&merNm=' 		+ httpRequest.URLEncodeAll(resultObj.returnList[i].loclTrnsCrncNo);
				this.postData += '&country=' 	+ httpRequest.URLEncodeAll(resultObj.returnList[i].abCtyNm);

				if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url + this.postData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}

				var ResultStr = httpRequest.result;
				this.log("ResultStr::" + ResultStr);

				//세션체크함수
				sessionChk = this.세션체크함수(httpRequest.result);

				if (sessionChk != S_IBX_OK) {
					return;
				}

				if(ResultStr.indexOf('>카드매출전표<') < 0){
					this.setError(E_IBX_SITE_INVALID + 1);
					return E_IBX_SITE_INVALID + 1;
				}

				if (ResultStr.indexOf('일시적인 시스템 오류가 발생하였습니다') > -1) {
					this.url = '/app/card/BillpActn.do';
					if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, "") == false) {
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}	
					
					//세션체크함수
					sessionChk = this.세션체크함수(httpRequest.result);

					if (sessionChk != S_IBX_OK) {
						return;
					}
				}

				item.카드번호 = StrReplace(resultObj.returnList[i].cardNo, '-', '');
				item.카드종류 = StrGrab(ResultStr, 'class="desc01">', '</p>');
				item.카드종류 = StrReplace(item.카드종류, "\t", '');
				item.카드종류 = StrReplace(item.카드종류, "\r", '');
				item.카드종류 = StrReplace(item.카드종류, "\n", '');
				item.카드종류 = StrTrim(item.카드종류);
				
				item.이용일자 = StrReplace(resultObj.returnList[i].rcvDate, '.', '');
				item.매입일자 = StrReplace(resultObj.returnList[i].saleDate, '.', '');
				item.결제일자 = '';
				item.가맹점명 = resultObj.returnList[i].abMerNm;
				item.할부개월 = '';
				item.입금회차 = '';
				item.이용_금액 = StrReplace(resultObj.returnList[i].loclAmt, ',', '');
				item.이용_통화코드 = resultObj.returnList[i].natnNm;
				if (item.이용_통화코드 == "Won") { item.이용_통화코드 = "KRW"; }
				else if (item.이용_통화코드 == "U.S.Dollar") { item.이용_통화코드 = "USD"; }
				else if (item.이용_통화코드 == "Yen") { item.이용_통화코드 = "JPY"; }
				// else if (item.이용_통화코드 == "링기트") { item.이용_통화코드 = "MYR"; }
				// else if (item.이용_통화코드 == "바트") { item.이용_통화코드 = "THB"; }
				// else if (item.이용_통화코드 == "동") { item.이용_통화코드 = "VND"; }
				else {
					// 다른 통화코드 처리 필요
					this.setError(E_IBX_SITE_INVALID + 3);
					return E_IBX_SITE_INVALID + 3;
				}
				item.접수_금액 = '';
				item.접수_통화코드 = '';
				item.환율 = '';
				item.청구금액 = StrReplace(resultObj.returnList[i].sumList, ',', '');
				item.수수료 = '';
				item.결제후잔액 = '';
				item.승인번호 = resultObj.returnList[i].useNo;

				if(item.이용일자.length != 8 || item.매입일자.length != 8 || isNaN(item.이용일자) || isNaN(item.매입일자)){
					this.setError(E_IBX_SITE_INVALID + 2);
					return E_IBX_SITE_INVALID + 2;
				}

				if (!(IsCurrency(item.이용_금액) || IsCurrency(item.청구금액))) {
		            this.setError(E_IBX_CURRENCY_NOT_CONVERT);
		            return E_IBX_CURRENCY_NOT_CONVERT;
		        }

				해외청구내역.push(item);
			}
			this.log('next_key:[' + next_key + ']');
			
			//Response한 JSON 항목중 next_key값이 없으면 다음페이지 X
			if (next_key == "") break;
		}

		if(해외청구내역.length == 0){
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		this.iSASInOut.Output.Result.내역정렬순서 = "1";
		this.iSASInOut.Output.Result.해외청구내역 = 해외청구내역;

	}catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 해외청구내역 finally");
	}

};

개인카드.prototype.이용한도조회 = function (aInput) { 
	this.log(BankName + " 이용한도조회 호출");

	try {

		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		var input = dec(aInput.Input);

		if (input.카드번호) input.카드번호 = StrReplace(input.카드번호, '-', '');
		else input.카드번호 = '';

        var 회원사 = input.회원사;
		var 구분 = input.구분;
		var 회원사코드, 회원사명;
		if (회원사) {
			// ex) "농협은행:011" 또는 "농협은행"(2020.02.20 수정 전 카드목록 구분값.)
			// 한도조회는 회원사명으로 구분..			
			if (회원사.indexOf(':') > -1 ){
				회원사코드 = 회원사.substr(-3);
				회원사명 = StrGrab(회원사, '', ':' + 회원사코드);
			
			} else {
				if (회원사.indexOf('(') > 0) { 회원사 = StrGrab(회원사, '', '('); }
				회원사코드 = '';
				회원사명 = 회원사;

			}			
			this.log("회원사코드: " + 회원사코드);
			this.log("회원사명: " + 회원사명);
			
			if (회원사명 == ""){
				this.setError(E_IBX_CARD_MEMBER_INVALID);
				return E_IBX_CARD_MEMBER_INVALID;
			}
        }

		// 회원사와 동일하게 처리
		var 구분코드, 구분명;
        if (구분) {
            if (구분.indexOf(':') > -1 ){
				구분코드 = 구분.substr(-3);
				구분명 = StrGrab(구분, '', ':' + 구분코드);
			
			} else {
				if (구분.indexOf('(') > 0) { 구분 = StrGrab(구분, '', '('); }
				구분코드 = '';
				구분명 = 구분;

			}			
			this.log("구분코드: " + 구분코드);
			this.log("구분명: " + 구분명);
			
			if (구분명 == ""){
				this.setError(E_IBX_CARD_MEMBER_INVALID);
				return E_IBX_CARD_MEMBER_INVALID;
			}
        }

		system.setStatus(IBXSTATE_ENTER, 30);
		this.host = "https://www.bccard.com";

		this.url = "/app/card/LimitpInquiryActn.do";

		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		this.userAgent += "}";

		//쿠키 셋팅을 하기 위한 선 조회
		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}

		var resBlock = httpRequest.result + "";

		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}
		if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
			this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
			return E_IBX_USER_PASSWORD_LONGTIMEUSE;
		}

		this.postData = "retKey=json&member_code=";

		this.log("1단 post = " + this.postData);

		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		this.userAgent += ",\"JSON-HTTP\":\"json\"";
		this.userAgent += "}";

		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}

		resBlock = httpRequest.result + "";

		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if (resBlock.indexOf("returnList") == -1) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		if (resBlock.indexOf('"msg":"해당 회원이 아닙니다') >= 0) {
			this.setError(E_IBX_CARD_NOT_FOUND);
			return E_IBX_CARD_NOT_FOUND;
		}
		if (회원사 && resBlock.indexOf(회원사명) < 0) {
			this.setError(E_IBX_CARD_MEMBER_INVALID);
			return E_IBX_CARD_MEMBER_INVALID;
        }
        if (구분 && resBlock.indexOf(구분명) < 0) {
			this.setError(E_IBX_CARD_MEMBER_INVALID);
			return E_IBX_CARD_MEMBER_INVALID;
		}

		system.setStatus(IBXSTATE_RESULT, 90);
		this.log("이용한도조회 = " + resBlock);

	

		var resltObj = JSON.parse(resBlock);
		this.log('resltObj : ' + JSON.stringify(resltObj));

		if (resltObj && resltObj.returnList) {
			var 카드사용_한도금액 = 0;
			var 카드사용한도_잔여금액 = 0;
			var 카드사용한도_사용금액 = 0;

			var 일시불_한도금액 = 0;
			var 일시불_사용금액 = 0;
			var 일시불_한도잔여금액 = 0;

			var 할부_한도금액 = 0;
			var 할부_사용금액 = 0;
			var 할부_한도잔여금액 = 0;

			var 현금서비스_한도금액 = 0;
			var 현금서비스_사용금액 = 0;
			var 현금서비스_한도잔여금액 = 0;
			var 카드종류 = "";

			var list = resltObj.returnList;

			var len = list.length;

			var 한도조회 = [];
			var found회원사 = false;
			var idx = 0;


			for (; idx < len; idx++) {
				var temp = list[idx];
				this.log('temp : ' + JSON.stringify(temp));

				// 한도 조회 오류 예외처리 추가 by 김인권
				if (temp.errorKey == "Y") {
					this.log("Error Key : " + temp.errorKey);
					this.log("Error Message : " + temp.msg);
					continue;
				}
				var item = {};

				카드종류 = temp.mbNm;			
				this.log('카드종류 : ' + 카드종류);		

				//카드 이용한도
				카드사용_한도금액 = parseInt(StrReplace(temp.cdhdCslLimAmtTm1, ",", ""));
				카드사용한도_사용금액 = parseInt(StrReplace(temp.cdhdDnfCslAauthAmt, ",", ""));
				카드사용한도_잔여금액 = parseInt(StrReplace(temp.cdhdDnfCslLimBlcAmt, ",", ""));


				일시불_한도금액 = parseInt(StrReplace(temp.cdhdCslLimAmtTm1, ",", ""));
				일시불_사용금액 = parseInt(StrReplace(temp.cdhdDnfCslAauthAmt, ",", ""));
				일시불_한도잔여금액 = parseInt(StrReplace(temp.cdhdDnfCslLimBlcAmt, ",", ""));


				할부_한도금액 = parseInt(StrReplace(temp.cdhdCslLimAmtTm1, ",", ""));
				할부_사용금액 = parseInt(StrReplace(temp.cdhdDnfCslAauthAmt, ",", ""));
				할부_한도잔여금액 = parseInt(StrReplace(temp.cdhdDnfCslLimBlcAmt, ",", ""));

				현금서비스_한도금액 = parseInt(StrReplace(temp.cdhdCshsLimAmt, ",", ""));
				현금서비스_사용금액 = parseInt(StrReplace(temp.cdhdCshsAauthAmt, ",", ""));
				현금서비스_한도잔여금액 = parseInt(StrReplace(temp.cdhdCshsLimBlcAmt, ",", ""));

				this.log('카드사용_한도금액 : ' + 카드사용_한도금액);

				item.카드종류 = 카드종류;
				item.카드사용_한도금액 = 카드사용_한도금액 + "";
				item.카드사용한도_사용금액 = 카드사용한도_사용금액 + "";
				item.카드사용한도_잔여금액 = 카드사용한도_잔여금액 + "";
				item.일시불_한도금액 = 일시불_한도금액 + "";
				item.일시불_사용금액 = 일시불_사용금액 + "";
				item.일시불_한도잔여금액 = 일시불_한도잔여금액 + "";
				item.할부_한도금액 = 할부_한도금액 + "";
				item.할부_사용금액 = 할부_사용금액 + "";
				item.할부_한도잔여금액 = 할부_한도잔여금액 + "";
				item.현금서비스_한도금액 = 현금서비스_한도금액 + "";
				item.현금서비스_사용금액 = 현금서비스_사용금액 + "";
				item.현금서비스_한도잔여금액 = 현금서비스_한도잔여금액 + "";
				item.해외_한도금액 = "";
				item.해외_사용금액 = "";
				item.해외_한도잔여금액 = "";
				item.통화코드 = "";
				item.회원사 = "";
				item.구분 = "";

				if (!회원사 && !구분){
					item.회원사 = StrReplace(카드종류, ' ', '');
					item.구분 = StrReplace(카드종류, ' ', '');
					found회원사 = true;

				} else {										
					if (회원사 && 카드종류.indexOf(회원사명) == -1) { continue; }
					if (구분 && 카드종류.indexOf(구분명) == -1 ) { continue; }

					found회원사 = true;					
					item.회원사 = 회원사 ? 회원사 : '';
					item.구분 = 구분 ? 구분 : '';							

				}

				item.카드번호 = input.카드번호;				
				한도조회.push(item);

			}

			if (!found회원사) {
				this.setError(E_IBX_CARD_SCRAP_INFO_INVALID);
				return E_IBX_CARD_SCRAP_INFO_INVALID;
			}

            
			this.iSASInOut.Output.Result.한도조회 = 한도조회;
		}

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 이용한도조회 finally");
	}
};

개인카드.prototype.실적충족내역 = function (aInput) {
	this.log(BankName + " 실적충족내역 호출");
	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		
		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 조회년월 = input.조회년월;
		var thisMonth = 조회년월;
		var Tempdate = '';
		if (!조회년월) {
			thisMonth = js_yyyy_mm_dd();
			thisMonth = thisMonth.substr(0, 6);
			Tempdate = thisMonth;
		}else{
			//오류 체크(ex: 00001, 201900)
			thisMonth = thisMonth.substr(0, 6);
			
			if (isNaN(thisMonth) || thisMonth.length != 6 ) {
				this.setError(E_IBX_E100X1_YEAR_MONTH_NO_INVALID);
				return E_IBX_E100X1_YEAR_MONTH_NO_INVALID;
			}
			Tempdate = thisMonth;
			var tmpDate = new Date(thisMonth.substring(0,4), parseInt(thisMonth.substring(4,6)) - 1);
			if (tmpDate.yyyymmdd().substr(0, 6) != thisMonth ){
				this.setError(E_IBX_E100X1_YEAR_MONTH_NO_INVALID);
				return E_IBX_E100X1_YEAR_MONTH_NO_INVALID;
			}
			//기준일자를 입력된 조회년월 + '1' 로 설정해주세요. (현재 2019년07월이면, 20190801로 셋팅)
			var yyyymmstr = new Date(thisMonth.substring(0,4), parseInt(thisMonth.substring(4,6)));
			thisMonth = yyyymmstr.yyyymmdd().substr(0, 6);
		}
		
		system.setStatus(IBXSTATE_ENTER, 30);	

		// 카드이용조회 => 실적충족현황 
		this.url = '/app/card/RcdAchvPcdActn.do';
		if (httpRequest.get(this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var ResultStr = httpRequest.result;
		this.log("실적충족현황_페이지: ["+ ResultStr +"]");

		//세션체크함수
		sessionChk = this.세션체크함수(ResultStr);

		if (sessionChk != S_IBX_OK) {
			return;
		}
		if (httpRequest.result.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
			this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
			return E_IBX_USER_PASSWORD_LONGTIMEUSE;
		}
		if(ResultStr.indexOf('>카드실적현황<') < 0){
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		// 기준일자는 6개월 이전부터 다음달까지만 선택 가능합니다.
		var enableBgnDate = StrGrab(ResultStr,'enableBgnDate = parseInt("', '")');
		var enableEndDate = StrGrab(ResultStr,'enableEndDate = parseInt("', '")');
		if(enableBgnDate && enableEndDate){
			var BgnDate = parseInt(enableBgnDate);
			var EndDate = parseInt(enableEndDate);
		
			if(parseInt(thisMonth + '01') < BgnDate || parseInt(thisMonth + '01') > EndDate){
				this.setError(E_IBX_E100X1_YEAR_MONTH_NO_INVALID);
				return E_IBX_E100X1_YEAR_MONTH_NO_INVALID;
			}
		}
		    
		// 카드 정보
		this.header = '{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",';
		this.header += '"Accept":"application/json, text/javascript, */*; q=0.01",';
		this.header += '"JSON-HTTP":"json",';
		this.header += '"X-Requested-With":"XMLHttpRequest",';
		this.header += '"Accept-Language":"ko-KR",';
		this.header += '"Accept-Encoding":"gzip, deflate",';
		this.header += '"User-Agent":"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"}';

		this.url = "/app/card/RcdAchvPcdActn.do";
		if (httpRequest.postWithUserAgent(this.header, this.host + this.url, "retKey=cardInfo") == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		ResultStr = httpRequest.result;
		this.log("cardInfo: ["+ ResultStr +"]");

		//세션체크함수
		sessionChk = this.세션체크함수(ResultStr);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		var cardInfo;
		try{
			cardInfo = JSON.parse(ResultStr) || '';
		}catch(e){
			this.log('ErrorMessage:['+e.message+']');
			this.setError(E_IBX_SITE_INVALID + 1);
			return E_IBX_SITE_INVALID + 1;
		}

		if(cardInfo == ''){
			this.setError(E_IBX_SITE_INVALID + 2);
			return E_IBX_SITE_INVALID + 2;
		}
		
		if(!cardInfo.hasOwnProperty('cardList')){
			this.setError(E_IBX_SITE_INVALID + 3);
			return E_IBX_SITE_INVALID + 3;
		}

		var 실적충족내역 = [];
		
		if(cardInfo.cardList.length == 0){
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		// 결과처리
		for(var i = 0; i < cardInfo.cardList.length; i++){
			var item = {};
			var 실적충족상세 = [];
			var Noresult = false;
			item.기준년월 = Tempdate;
			item.카드명	 = cardInfo.cardList[i].joinName;
			item.카드번호 = '';	
			item.카드이미지URL= '';	
			
			if(cardInfo.cardList[i].cardIdx && item.기준년월){

				// 실적충족현황 페이지 조회 
				this.url = '/app/card/RcdAchvPcdActn.do';
				this.postData = 'retKey='    + 'recod';
				this.postData += '&cardIdx=' + cardInfo.cardList[i].cardIdx;
				this.postData += '&inqDate=' + thisMonth + '01';

				if (!httpRequest.postWithUserAgent(this.header, this.host + this.url, this.postData)) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				ResultStr = httpRequest.result;
				this.log('실적충족현황_조회' + ResultStr + ']');
				
				//세션체크함수
				sessionChk = this.세션체크함수(ResultStr);

				if (sessionChk != S_IBX_OK) {
					return;
				}

				if(ResultStr.indexOf('[SYSTEM_ERROR]')>-1 || ResultStr.indexOf('일시적인 시스템 오류가 발생하였습니다')>-1){
					Noresult = true;
				}

				var searchListData;
				try{
					searchListData = JSON.parse(ResultStr) || '';
				}catch(e){
					this.log('ErrorMessage:['+e.message+']');
					this.setError(E_IBX_SITE_INVALID + 4);
					return E_IBX_SITE_INVALID + 4;
				}

				if(searchListData.hasOwnProperty('searchList')){
					if(searchListData.searchList.length > 0){
						for(var j = 0; j < searchListData.searchList.length; j++){

							var subItem = {};

							//서비스명
							subItem.서비스명 = searchListData.searchList[j].recodeRet2.toString();

							//실적시작일자 
							subItem.실적시작일자 = '';

							//실적종료일자 
							subItem.실적종료일자 = '';

							//기준금액
							subItem.기준금액 = searchListData.searchList[j].recodeRet12.toString();

							//이용금액 
							subItem.이용금액 = searchListData.searchList[j].recodeRet13.toString();

							//부족금액 
							subItem.부족금액 = searchListData.searchList[j].recodeRet14.toString();

							//적용구간 
							subItem.적용구간 = '';

							//충족여부 
							subItem.충족여부 = '';

							if (!IsCurrency(subItem.기준금액) || !IsCurrency(subItem.이용금액) ||
								!IsCurrency(subItem.부족금액) ||  subItem.서비스명 == "")
							{
								this.setError(E_IBX_CURRENCY_NOT_CONVERT);
								return E_IBX_CURRENCY_NOT_CONVERT; 
							}
							실적충족상세.push(subItem);
						}
					}
				}else{
					Noresult = true;
				}
			}
			if(!Noresult){
				item.실적충족상세 = 실적충족상세;
				실적충족내역.push(item);
			}
		}

		if(실적충족내역.length == 0){
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;	
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.실적충족내역 = 실적충족내역;

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 실적충족내역 finally");
	}
};

개인카드.prototype.포인트조회 = function (aInput) {
    this.log(BankName + " 개인카드 포인트조회 호출[" + aInput + "]");
    try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

        system.setStatus(IBXSTATE_CHECKPARAM, 10);

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

        // 포인트/마일리지 조회>포인트조회>나의혜택조회
  		this.url = '/app/card/SearchInfoAcnt.do';

        if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("ResultStr::" + ResultStr);
		
		//세션체크함수
		sessionChk = this.세션체크함수(ResultStr);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if (ResultStr.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
			this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
			return E_IBX_USER_PASSWORD_LONGTIMEUSE;
		}

        if (ResultStr.indexOf("선택하신 서비스는 BC카드를 소지하신 고객님께서만 이용이 가능하며") >= 0 || 
        	ResultStr.indexOf("BC카드 일반 회원으로 등록되어 있어 해당 서비스를 이용하실 수 없습니다") >= 0 ||
        	ResultStr.indexOf("만일 고객님께서 BC카드를 소지하고 있으시다면") >= 0 ||
        	ResultStr.indexOf("아래 회원 전환 버튼을 클릭하시어 회원정보를 변경하십시오") >= 0) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }

		system.setStatus(IBXSTATE_EXECUTE, 70);

        // 포인트 테이블
  		var ResultBlock = StrGrab(ResultStr, '>포인트/마일리지 조회</h2>', '"tabType01">');

  		if(ResultBlock == ""){
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        var 포인트내역 = [];
		   // 보유 포인트 없을 때
		var item = {};
	  	if (ResultBlock.indexOf('보유하신 포인트/마일리지가 없습니다') >= 0) {
	  		item = {};
	    	item.보유포인트 = '0';
	    	포인트내역.push(item);

		} else {
			var index = 1;
			var i = 1;
			var strBuf = StrGrab(ResultBlock, '"pointDl">', '</dl>', index);
			var strTemp = StrGrab(ResultBlock, '<li>', '</li>', i);
		    while (strBuf != "") {
		    	item = {};
				
				if(strBuf != ""){
					// 포인트/마일리지명
					item.포인트구분 = StrTrim(StrGrab(strBuf, '<dt>', '</dt>'));

					// 누적현황
					item.보유포인트 = StrGrab(StrGrab(strBuf, '<dd>', '</dd>'), '"><em>', '</em>');
					item.보유포인트 = StrTrim(StrReplace(item.보유포인트, ',', ''));

					
				}
				
				if (!(IsCurrency(item.보유포인트))) {
					this.setError(E_IBX_CURRENCY_NOT_CONVERT);
					return E_IBX_CURRENCY_NOT_CONVERT;
				}

		    	index++;
				strBuf = StrGrab(ResultBlock, '"pointDl">', '</dl>', index);
				포인트내역.push(item);
			}
			while (strTemp != "") {
				item = {};
				
				if(StrGrab(strTemp, 'alliancePoint">', '</').indexOf('P')>-1){
					// 포인트/마일리지명
					item.포인트구분 = StrTrim(StrGrab(strTemp, 'allianceTit">', '</'));

					// 누적현황
					item.보유포인트 = StrReplace(StrGrab(strTemp, 'alliancePoint">', '</'), 'P', '');
					item.보유포인트 = StrTrim(StrReplace(item.보유포인트, ',', ''));
					
					if (!(IsCurrency(item.보유포인트))) {
						this.setError(E_IBX_CURRENCY_NOT_CONVERT);
						return E_IBX_CURRENCY_NOT_CONVERT;
					}
					포인트내역.push(item);
				}
		    	i++;
				strTemp = StrGrab(ResultBlock, '<li>', '</li>', i);
			}
			
	  	}

	 	if (포인트내역.length == 0) {
	 		this.setError(I_IBX_RESULT_NOTPRESENT);
	 		return I_IBX_RESULT_NOTPRESENT;
	 	}

        // 결과 처리
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.포인트내역 = 포인트내역;

        return S_IBX_OK;
    } catch (e) {
        //
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 개인카드 포인트조회 finally");
    }
};

개인카드.prototype.카드목록조회 = function (aInput) {
    this.log(BankName + " 카드목록조회 호출[" + aInput + "]");    
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);            
            return E_IBX_AFTER_LOGIN_SERVICE;
		}
		
		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		var input = dec(aInput.Input);
		// 타겟페이지 다름
		// 2: 결제예정금액 그외: 한눈에보기
		var 결제일구분 = input.결제일구분;
		
		system.setStatus(IBXSTATE_ENTER, 30);

		var ResultStr = ''; 
		var item = {};
		var detailURL = '';
		var imgURL = '';
		var 보유카드 = [];		
		for(var urlIndex=0; urlIndex<2; urlIndex++){
			if (urlIndex == 0)			
				this.url = '/app/card/IssueinquiryActn.do';//마이BC > 카드정보 > 나의보유카드 > 보유카드 > 신용카드
			else
				this.url = '/app/card/IssueinquiryCheckActn.do';//마이BC > 카드정보 > 나의보유카드 > 보유카드 > 체크카드

			this.postData = 'retKey=json';
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("카드목록조회1_" + urlIndex + ":[" + ResultStr + ']');

			//세션체크함수
			sessionChk = this.세션체크함수(ResultStr);

			if (sessionChk != S_IBX_OK) {
				return;
			}

			if (ResultStr.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
				this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
				return E_IBX_USER_PASSWORD_LONGTIMEUSE;
			}
			
			if (ResultStr.indexOf('선택하신 서비스는 BC카드를 소지하신 고객님께서만 이용이 가능하며') >= 0 ||
				ResultStr.indexOf('회원으로 등록되어 있어 해당 서비스를 이용하실 수 없습니다') >= 0) {
				this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
				return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
			}

			if (ResultStr.indexOf('"rsList"') < 0 ) {
				this.setError(E_IBX_SITE_INVALID);
				return E_IBX_SITE_INVALID;
			}

			var ResultData = JSON.parse(ResultStr);
			ResultData = ResultData.rsList;

			//결과처리
			for(var index=0; index<ResultData.length; index++){
				item = {};

				// 결제일구분 2: 네이버사용				
				// 상태 케이스 추가하는 경우, "결제예정금액" job도 같이 수정 필요합니다.
				if (결제일구분 == '2') {
					if (ResultData[index].card_state != '정상' && ResultData[index].card_state != '장기미사용' && 
						ResultData[index].card_state != '신규/미등록' && ResultData[index].card_state != '휴면정지' &&  
						ResultData[index].card_state != '기타') continue;
				}
				
				item.카드명 = ResultData[index].card_name;
				item.카드번호 = StrReplace(ResultData[index].cardNo, '-', '');
				item.구분 = StrReplace((ResultData[index].bank_name + ':' + ResultData[index].bank_no), ' ', '');
				//결과검증
				if (isNaN(StrReplace(item.카드번호, '*', '')) || (!item.카드명) ) {
					this.setError(E_IBX_CURRENCY_NOT_CONVERT);
					return E_IBX_CURRENCY_NOT_CONVERT;
				}

				if(input.조회구분 == 1){
					detailURL = ResultData[index].cardGdsNo;
					this.url = '/app/card/SecedeActnStep3.do';
					this.url += '?cardNo=' + detailURL;
					//카드명 클릭 > 카드 정보 안내
					if(httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false){
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					this.log('Detail httpResponse : [' + httpRequest.result + ']');

					var sessionChk = this.세션체크함수(httpRequest.result);
					if (sessionChk != S_IBX_OK) { return; }

					ResultStr = httpRequest.result + '';
					ResultStr = StrGrab(StrGrab(ResultStr, '<div class="cardImgBox">', '</div>'), '<img', '/>');
					imgURL = StrGrab(ResultStr, ' src="', '"');

					if(!imgURL){
						this.setError(E_IBX_SITE_INVALID + 4);
						return E_IBX_SITE_INVALID + 4;
					}

					//이미지 데이터 통신
					if(httpRequest.get(this.host + imgURL) == false){
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					this.log('카드이미지 BASE64 Value : [' + httpRequest.getB64Result() + ']');

					if(httpRequest.getB64Result()){
						item.카드이미지 = httpRequest.getB64Result() + '';
					}
					
					//카드 이미지 조회 오류 발생한 경우 빈값으로 처리
                    if (httpRequest.result.indexOf('<!doctype') >= 0 || httpRequest.result.indexOf('<!DOCTYPE') >= 0  ){
                        item.카드이미지 = item.카드이미지 = '';
                    }
				}

				보유카드.push(item);
			}

		}

		//카드 없을 시, 내역없음 반환
		if (보유카드.length == 0){
			this.setError(I_IBX_RESULT_NOTPRESENT);
            return I_IBX_RESULT_NOTPRESENT;
		}

		system.setStatus(IBXSTATE_EXECUTE, 60);
		
		var 결제정보 = [];
		if (결제일구분 == '2') {
			// HOME> MY BC> 카드이용조회> 이용대금명세서> 결제 예정금액
			this.url = '/app/card/PaymentActn.do';
			if (httpRequest.get(this.host + this.url) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			var ResultStr = httpRequest.result;
			this.log("결제예정금액: [" + ResultStr + "]");

			//세션체크함수
			var sessionChk = this.세션체크함수(ResultStr);
	
			if (sessionChk != S_IBX_OK) {
				return;
			}
			if (ResultStr.indexOf('결제예정금액은 해당 은행으로 문의하여 주시기 바랍니다') == -1) {
				ResultStr = StrGrab(StrGrab(ResultStr, '<caption>결제예정금액</', '</table>'), '<tbody>', '</tbody>');
				
				var i = 0;
				var resItem;
				while (true){
					i++;
					item = {};
					resItem = StrGrab(ResultStr, '<tr>', '</tr>', i);
					if (resItem == '') { break; }
					
					item.결제일 = StrTrim(StrReplace(StrGrab(StrGrab(resItem, '<td', '/td>', 3), '>', '<'), '.', ''));
					item.결제예정액 = StrTrim(StrReplace(StrGrab(StrGrab(resItem, '<td', '/td>', 4), '>', '원<'), ',', ''));
					// 농협은행:011
					item.구분 = StrGrab(StrGrab(resItem, '<td', '/td>'), '>', '<') + ':' + StrGrab(StrGrab(StrGrab(resItem, '<td', '/td>', 5), 'list_submit(', ')'), "'", "'", 3);
						
					if (item.구분 == ''){
						this.setError(E_IBX_RESULT_FAIL);
						return E_IBX_RESULT_FAIL;
					}
					if (!IsCurrency(item.결제예정액) ||
						isNaN(item.결제일) || (item.결제일.length != 8)) {
						this.setError(E_IBX_CURRENCY_NOT_CONVERT);
						return E_IBX_CURRENCY_NOT_CONVERT;
					}					
					결제정보.push(item);	
				}

				// 결제정보 없는 보유카드에 대한 결과처리..
				for (var i = 0; i < 보유카드.length; i++) {
					item = {};
					if (JSON.stringify(결제정보).indexOf(보유카드[i].구분) > -1 ){continue;}			
					item.결제일 = '';				
					item.결제예정액 = '';
					item.구분 = 보유카드[i].구분;
					if (item.구분 == ''){
						this.setError(E_IBX_RESULT_FAIL);
						return E_IBX_RESULT_FAIL;
					}

					결제정보.push(item);
				}
			} else {
				
				item = {};
				item.결제일 = '';
				item.결제예정액 = '0';
				item.구분 = '';	
				결제정보.push(item);
			}

		} else {
			// 마이BC > 한눈에보기
			this.url = '/app/card/MyBcSubIndex.do';
			if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("한눈에보기-1:[" + ResultStr + ']');

			//세션체크함수
			var sessionChk = this.세션체크함수(ResultStr);
			if (sessionChk != S_IBX_OK) {
				return;
			}

			system.setStatus(IBXSTATE_EXECUTE, 70);
			this.url = '/app/card/MyBcCardUseAmt.do';
			this.postData = 'retKey=' + 'json';
			this.postData += '&requestDate=';

			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("한눈에보기-2:[" + ResultStr + ']');

			//세션체크함수
			var sessionChk = this.세션체크함수(ResultStr);
			if (sessionChk != S_IBX_OK) {
				return;
			}

			var jsonData, bankListNames, bankListCodes;
			try { 
				// bankListNames : ["하나카드","농협은행","우리카드"]
				// bankListCodes : ["025","011","020"]
				jsonData = JSON.parse(ResultStr);
				bankListNames = jsonData.bankListNames;
				bankListCodes = jsonData.bankListCodes;
				
				this.log("bankListNames: " + JSON.stringify(bankListNames));
				this.log("bankListCodes: " + JSON.stringify(bankListCodes));

			} catch (e){
				this.setError(E_IBX_SITE_INVALID + 1);
				return E_IBX_SITE_INVALID + 1;
			}

					
			//결제정보 존재하지 않으면 공백처리
			if (ResultStr.indexOf('"cardUseAmtList":[]') > -1)
			{
				item = {};
				item.결제일 = '';
				item.결제예정액 = '0';
				item.구분 = '';	
				결제정보.push(item);	
			}
			else {
				
				// 결제정보 있는 카드에 대한 결과처리..
				for (var i = 0; i < jsonData.cardUseAmtList.length; i++) {
					var item = {};
					item.결제일 = jsonData.cardUseAmtList[i].date;
					item.결제일 = StrReplace(item.결제일, '결제일', '');
					item.결제일 = StrTrim(StrReplace(item.결제일, '.', ''));
					
					item.결제예정액 = StrReplace(jsonData.cardUseAmtList[i].amt, ',', '');

					item.구분 = '';
					// mbNo랑 bankListCodes 매칭해서, 구분값으로 bankListNames + ':' + bankListCodes 반환.
					/* 서비스별로 매칭되는 구분값이 다른 케이스 있어 결과처리 변경.
					ex, 농협BC카드는 한도, 결제예정금액 에서는 "농협은행"으로 구분 출력되고 (C1)
					청구내역에서는 "NH농협카드"로 출력하고 있음.(C2)

					수정전 jsonData.cardUseAmtList[i].mbNm는 C2 케이스로, 한도나 결제예정금액에서는 구분 매칭안되는 현상 확인.
					C1 케이스는 bankListNames(농협은행)으로 C2 케이스는 bankListCodes(011, 012 등)로 매칭할 수 있도록 로직 수정. */			

					
					var mbNo = jsonData.cardUseAmtList[i].mbNo;				
					this.log('mbNo: ' + mbNo);
					for (var j =0; j < jsonData.bankListCodes.length; j++){
						if (mbNo == '050'){
							// BC발급사카드아닌 BC바로카드의 경우 발급사 매칭 불가로 예외처리함.
							// 비씨카드:050
							item.구분 = StrReplace((jsonData.cardUseAmtList[i].mbNm + ':' + mbNo), ' ', '');
							break;
						}

						if (jsonData.bankListCodes[j] == mbNo) { 
							item.구분 = StrReplace((jsonData.bankListNames[j] + ':' +  mbNo), ' ', '');

							if (jsonData.bankListNames[j] == ''){
								this.setError(E_IBX_RESULT_FAIL);
								return E_IBX_RESULT_FAIL;
							}

							//jsonData.bankListNames[j] = '';
							break; 
						}
					}
					// "bankListCodes"에는 "mbNo"가없고 "bankListNames"에는 "mbNm"가 없습니다.
					if (item.구분 == ''){
						item.구분 = StrReplace((jsonData.cardUseAmtList[i].mbNm  + ':' +  mbNo), ' ', '');
					}

					if (item.구분 == ''){
						this.setError(E_IBX_RESULT_FAIL);
						return E_IBX_RESULT_FAIL;
					}

					if (!IsCurrency(item.결제예정액) ||
						isNaN(item.결제일) || (item.결제일.length != 8)) {
						this.setError(E_IBX_CURRENCY_NOT_CONVERT);
						return E_IBX_CURRENCY_NOT_CONVERT;
					}
					결제정보.push(item);
				}

				// 결제정보 없는 보유카드에 대한 결과처리..
				for (var i = 0; i < bankListNames.length; i++) {

					var checkBankName = JSON.stringify(결제정보);
					this.log('checkBankName: ' + checkBankName);

					item = {};
					if (bankListNames[i] == ''){continue;}
					if (checkBankName.indexOf(bankListNames[i]) > -1){continue;}		
					item.결제일 = '';				
					item.결제예정액 = '';
					item.구분 = StrReplace((bankListNames[i] + ':' + bankListCodes[i]), ' ', '');

					if ( bankListCodes[i] == ""){
						this.setError(E_IBX_RESULT_FAIL);
						return E_IBX_RESULT_FAIL;
					}	
					결제정보.push(item);
				}
			}	
		}

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.결제정보 = 결제정보;
        this.iSASInOut.Output.Result.보유카드 = 보유카드;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
    }
};

개인카드.prototype.결제예정금액 = function (aInput) {
    this.log(BankName + " 결제예정금액 호출[" + aInput + "]");    
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);            
            return E_IBX_AFTER_LOGIN_SERVICE;
		}
		var input = dec(aInput.Input);
		var 구분 = input.구분;
		var res구분;

		var 회원사코드, 회원사명;
		if (구분){
			// ex) "농협은행:011" 또는 "농협은행"(2020.02.20 수정 전 카드목록 구분값.)
			// 결제예정금액은 회원사명으로 구분.
			if (구분.indexOf(':') > -1 ){
				회원사코드 = 구분.substr(-3);
				회원사명 = StrGrab(구분, '', ':' + 회원사코드);
			
			} else {
				회원사코드 = '';
				회원사명 = 구분;

			}	
			this.log("회원사명: " + 회원사명);
			this.log("회원사코드: " + 회원사코드);

			if (회원사명 == ""){
				this.setError(E_IBX_CARD_MEMBER_INVALID);
				return E_IBX_CARD_MEMBER_INVALID;
			}
		}

		system.setStatus(IBXSTATE_ENTER, 30);
		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		// 카드목록조회
		var 보유카드 = [];	 
		var cardList = {};
		var index = 0;
		for(var urlIndex=0; urlIndex<2; urlIndex++){
			if (urlIndex == 0)
				this.url = '/app/card/IssueinquiryActn.do';//마이BC > 카드이용관리 > 보유카드내역 > 보유카드 > 신용카드
			else
				this.url = '/app/card/IssueinquiryCheckActn.do';//마이BC > 카드이용관리 > 보유카드내역 > 보유카드 > 체크카드

			this.postData = 'retKey=json';
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("카드목록조회1_" + urlIndex + ":[" + ResultStr + ']');

			//세션체크함수
			sessionChk = this.세션체크함수(ResultStr);

			if (sessionChk != S_IBX_OK) {
				return;
			}

			if (ResultStr.indexOf('/app/card/view/membc/member/join/pop_pwd.jsp') >= 0 ) {
				this.setError(E_IBX_USER_PASSWORD_LONGTIMEUSE);
				return E_IBX_USER_PASSWORD_LONGTIMEUSE;
			}
			if (ResultStr.indexOf('"rsList"') < 0 ) {
				this.setError(E_IBX_SITE_INVALID);
				return E_IBX_SITE_INVALID;
			}

			var ResultData = JSON.parse(ResultStr);
			ResultData = ResultData.rsList;

			//결과처리
			for(index = 0; index < ResultData.length; index++){
				cardList = {};

                // 신규/미등록 카드여도 결제예정금액 출력되는 케이스 있음.
				// 장기미사용 카드는 재검토 필요
				if (ResultData[index].card_state != '정상' && ResultData[index].card_state != '신규/미등록' && 
					ResultData[index].card_state != '기타' && ResultData[index].card_state != '휴면정지' ) continue;


				cardList.카드명 = ResultData[index].card_name;
				this.log("보유카드명 : " + cardList.카드명);
				cardList.카드번호 = StrReplace(ResultData[index].cardNo, '-', '');
				cardList.구분 = StrReplace((ResultData[index].bank_name + ':' + ResultData[index].bank_no), ' ', '');
				this.log("보유카드구분 : " + cardList.구분);
				
				//결과검증
				if (isNaN(StrReplace(cardList.카드번호, '*', '')) || (!cardList.카드명) ) {
					this.setError(E_IBX_CURRENCY_NOT_CONVERT);
					return E_IBX_CURRENCY_NOT_CONVERT;
				}
				보유카드.push(cardList);
			}
		}
		var 카드보유여부 = true;
		if (input.구분) {
			카드보유여부 = false;
			for (index = 0; index < 보유카드.length; index++) {
				this.log('index : ' + index);
				this.log('input.구분 : ' + input.구분);
				this.log("보유카드구분 : " + 보유카드[index].구분);
				if (input.구분 == 보유카드[index].구분) {

					카드보유여부 = true;
					break;
				}
			}
		}
		
		if (!카드보유여부) {
			this.setError(E_IBX_CARD_MEMBER_INVALID);
			return E_IBX_CARD_MEMBER_INVALID;
		}

		system.setStatus(IBXSTATE_EXECUTE, 50);
		// HOME> MY BC> 카드이용조회> 이용대금명세서> 결제 예정금액
		this.url = '/app/card/PaymentActn.do';

		if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
		this.log("발급사: [" + ResultStr + "]");
		
		//세션체크함수
		var sessionChk = this.세션체크함수(ResultStr);

		if (sessionChk != S_IBX_OK) {
			return;
		}
		
		if (ResultStr.indexOf('결제예정금액은 해당 은행으로 문의하여 주시기 바랍니다') > -1) {
			this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
			return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
		}
		if (ResultStr.indexOf('고객님께서는 결제예정금액이 없습니다.') >= 0) {
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}
		if (ResultStr.indexOf('>결제예정금액</caption') < 0) {
			this.setError(E_IBX_SITE_INVALID + 1);
			return E_IBX_SITE_INVALID + 1;
		}

		// 발급은행 선택
		var ResBlock = StrGrab(ResultStr, '>보유카드 선택</caption>', '</table');
		ResBlock = StrGrab(ResBlock, 'id="bankselect"', '</select');
		var bankselect = '', option = '', i = 1;

		if (ResBlock.indexOf('<option') < 0) {
			this.setError(E_IBX_SITE_INVALID + 2);
			return E_IBX_SITE_INVALID + 2;
		}

		while (true) {
			//<option value='200000200038' selected>농협은행(결제일 2020.03.16)</option>
			option = StrGrab(ResBlock, '<option', '</option', i++);
			if (option == '') {break;}
			this.log('회원사 : ' + 회원사명);

			if (구분) {
				if (option.indexOf('>' + 회원사명 + '(')  > -1) {
					bankselect = StrGrab(option,  "value='", "'");
					res구분 = 구분;
					break;
				}
			} else {
				if (option.indexOf('selected') > -1) {
					bankselect = StrGrab(option,  "value='", "'"); 
					res구분 = StrGrab(option, '>', '(');
					break;
				}
			}
		}

		if (!bankselect) {
			if (구분 && 카드보유여부) {
				this.setError(I_IBX_RESULT_NOTPRESENT);
				return I_IBX_RESULT_NOTPRESENT;
			} else {
				this.setError(E_IBX_SITE_INVALID + 3);
				return E_IBX_SITE_INVALID + 3;
			}
		}

		system.setStatus(IBXSTATE_RESULT, 70);
		// 결과 페이지
		this.url = '/app/card/PaymentActn.do';

		this.postData  = "retKey=" + "json";
		this.postData += "&INIpluginData=" + "";
		this.postData += "&bankselect=" + bankselect;

		if (httpRequest.post(this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		ResultStr = httpRequest.result;
		this.log("결과 페이지: ["+ ResultStr +"]");

		var sessionChk = this.세션체크함수(ResultStr);
		if (sessionChk != S_IBX_OK) { return; }
		
		if (ResultStr.indexOf('"totalList":') < 0) {
			this.setError(E_IBX_SITE_INVALID + 4);
			return E_IBX_SITE_INVALID + 4;
		}
		
		ResultStr = JSON.parse(ResultStr);

		var 결제예정금액 = [];
		var payDate = ResultStr.payDate;
		var 합계 = ResultStr.sum_all.toString();
		합계 = StrReplace(합계, ',', '');
		var totalList = ResultStr.totalList;

		system.setStatus(IBXSTATE_RESULT, 80);
		for (var i = 0; i < totalList.length; i++) {
			var item = {};
			// 이용일
			item.이용일 = totalList[i].saleDate;
			item.이용일 = StrReplace(item.이용일, '.', '');

			// 결제일
			item.결제일 = StrReplace(payDate, '.', '');

			// 이용카드
			item.이용카드 = totalList[i].cardNo;

			// 이용가맹점
			item.이용가맹점 = totalList[i].merNm;

			// 이용금액
			item.이용금액 = totalList[i].useAmt;
			item.이용금액 = StrReplace(item.이용금액, ',', '');
			
			// 할인금액
			item.할인금액 = '';

			// 청구금액
			item.청구금액 = totalList[i].bilAmt;
			item.청구금액 = StrReplace(item.청구금액, ',', '');

			// 청구회차
			item.청구회차 = totalList[i].bilPnNum;

			// 잔여회차
			item.잔여회차 = '';

			// 청구원금
			item.청구원금 = '';

			// 수수료
			item.수수료 = totalList[i].feeAmt;
			item.수수료 = StrReplace(item.수수료, ',', '');

			// 연체료
			item.연체료 = '';

			// 잔여원금
			item.잔여원금 = totalList[i].remainingAmt;
			item.잔여원금 = StrReplace(item.잔여원금, ',', '');

			// 매출구분
			item.매출구분 = '';

			// 환율
			item.환율 = '';

			// 할부개월
			item.할부개월 = totalList[i].insMmNum;

			// 취소금액
			item.취소금액 = '';

			// 구분
			item.구분 = StrReplace(res구분, ' ', '');

			if (!IsCurrency(item.이용일) || !IsCurrency(item.결제일) || 
				!IsCurrency(item.수수료) || !IsCurrency(item.이용금액) ||
				!IsCurrency(item.청구금액) || !IsCurrency(item.청구회차) ||
				!IsCurrency(item.잔여원금) || !IsCurrency(item.할부개월))
			{
				this.setError(E_IBX_CURRENCY_NOT_CONVERT);
				return E_IBX_CURRENCY_NOT_CONVERT;
			}

			if ( item.구분 == ''){
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL; 
			}
			
			결제예정금액.push(item);
		}

		if (결제예정금액.length == 0) {
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.내역정렬순서 = "1";
		this.iSASInOut.Output.Result.합계 = 합계;
        this.iSASInOut.Output.Result.결제예정금액 = 결제예정금액;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 결제예정금액 finally");
    }
};

개인카드.prototype.로그아웃 = function (aInput) {
	this.log(BankName + " 로그아웃 호출[" + aInput + "]");

	try {
		system.setStatus(IBXSTATE_CHECKPARAM, 10);

		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}
		/*
			리다이렉트 되면서 쿠키가 세팅이 되어야 하는데 안되어서 무한루핑에 빠지는 듯.
		*/
		//		httpRequest.clearCookie("bccard.com");

		this.host = "https://www.bccard.com";
		this.url = "/app/card/view/login/logout.jsp";

		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		if (httpRequest.result.indexOf('<a href="/app/card/SsoLoginLink.do" class="login">로그인</') < 0) {
            this.setError(E_IBX_SERVICE_LOGOUT_FAIL);
            return E_IBX_SERVICE_LOGOUT_FAIL;			
		}

		this.bLogIn = false;

		httpRequest.clearCookie("bccard.com");
		this.log("로그아웃 S_IBK_OK");

		// 결과 처리
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		return S_IBX_OK;

	} catch (e) {
		//
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 로그아웃 finally");
	}
};

///////////////////////////////////////////////////////////////////////////////////////////
// 비씨카드 법인카드

var 법인카드 = function () {
	// 생성자
	console.log(BankName + " 법인카드 생성자 호출");
	this.errorMsg = "";
	this.host = "https://wisebiz.bccard.com";
	this.url = "";
	this.param = "";
	this.postData = "";
	this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"}";
	this.TimeURL = "https://wisebiz.bccard.com/app/corp/view/initech/plugin/tools/Random.jsp";
	this.bLogIn = false;
};

법인카드.prototype = Object.create(iSASObject.prototype);

// UID, AESKey, EncKey 세팅처리하는 함수.
법인카드.prototype.initKeyPad = function(aHost) {

	//1. UID Gen
	var zeroStr = "";
	while(zeroStr.length < 15)
		zeroStr += "0";

	this.UID = (new Date().getTime()).toString();
	this.UID = zeroStr.substring(0, 15 - this.UID.length) + this.UID;

	this.log("UID:[" + this.UID + "]");

	this.host = aHost;
	if (this.host.indexOf("isson") > 0) {
		this.url = '/3rd/inca/jsp/nppfs.keypad.jsp';
	} else {
		this.url = '/app/corp/pluginfree/jsp/nppfs.keypad.jsp';
	}

	//"m=p&u=001475730384949"
	var postData = "m=p&u=" + this.UID;
	if (httpRequest.post(this.host + this.url, postData) == false){
		return 'Fail';
	}

	this.log("-vkPad1:[" + httpRequest.result + "]");

	var p = httpRequest.result;
	this.genKey();
	p = StrTrim(p) + "";
	var pubKey;
    if (p.length > 64) {
        var r = p.substring(0, 64);
        var v = p.substring(64);
        this.log("p.encKey:[" + r + "]");
        this.log("p.encData:[" + v + "]");

        r = certManager.HexToBase64(r);
        v = certManager.HexToBase64(v);
        pubKey = certManager.AES_ECB_Decrypt(v, r);
        this.log("publicKey:[" + pubKey + "]");
    }

    this.log("AESKey:[" + this.AESKey + "]");

	this.EncKey = certManager.RSA_public_encrypt(pubKey, this.AESKey);
	this.EncKey = certManager.Base64ToHex(this.EncKey);
	this.log("EncKey:[" + this.EncKey + "]");		

	// 실제 Keypad관련 데이터들이 있는 페이지.
	if (this.host.indexOf("isson") > 0) {
		postData = 'm=e&d=nppfs-keypad-div&t=b&at=r&st=l&dp=hide&ut=t&ui=v_keypad_toggle1&ta=false' +
		'&to=https%3A%2F%2Fwww.bccard.com%2Fimages%2Findividual%2F2016%2Fmembership%2Fbtn_keypad.gif' + 
		'&tf=https%3A%2F%2Fwww.bccard.com%2Fimages%2Findividual%2F2016%2Fmembership%2Fbtn_keypad2.gif' + 
		'&f=login&i=password&w=1903&h=962&ip=%2F3rd%2Finca%2Fjsp%2Fnppfs.keypad.jsp';
	} else {
		postData = 'm=e&d=nppfs-keypad-div&t=b&at=r&st=l&dp=hide&ut=t&ui=keyboard&ta=false' +
		'&to=%2Fpluginfree%2Ficon%2Ficon_mouse_on.gif' +
		'&tf=%2Fpluginfree%2Ficon%2Ficon_mouse_off.gif' +
		'&f=form1&i=login_password&il=20&w=1920&h=1254&ip=%2Fapp%2Fcorp%2Fpluginfree%2Fjsp%2Fnppfs.keypad.jsp';
	}

	if (httpRequest.post(this.host + this.url, postData) == false){
		return 'Fail';
	}
	this.log('headerStr===' + httpRequest.headerStr);
	this.log("-vkPad2:[" + httpRequest.result + "]");

	return httpRequest.result;
};

// 이미지 가져오는 통신
법인카드.prototype.getImgData = function(InputData) {
	var urlTemp = '';

	var idx = 0;
	this.imgBase64 = '';
	while(true){
		++idx;
		urlTemp = StrGrab(InputData, 'Img' + idx +'").attr("src", "', '");');
		if (!urlTemp)
			urlTemp = StrGrab(InputData, 'Img' + idx +'").src = "', '";');

		if (!urlTemp) break;

		if (httpRequest.get(this.host + urlTemp) == false) return false;

		// 이미지 처리를 위해 임시 저장.
		if (idx == 1) {
			this.imgBase64 = httpRequest.getB64Result();
		}
	}

	if (!this.imgBase64) return false;

	var idx = 0;
	while(true){
		++idx;
		if (this.host.indexOf('isson') > 0) {
			urlTemp = StrGrab(InputData, 'Img' + idx +'-preview").src = "', '";');
		} else {
			urlTemp = StrGrab(InputData, 'Img' + idx +'-preview").attr("src", "', '");');
		}
		if (urlTemp == '') break;

		if (httpRequest.get(this.host + urlTemp) == false) return false;
	}	

	return true;
};

// KeyPad에 해당하는 secuString값을 가져와서 세팅하는 함수.
법인카드.prototype.setvkPad = function(aInput, keyPadName){

	var mapStr = certManager.HexDecode(aInput);
	if (mapStr.indexOf('nppfs-div-keypad') < 0) {
		mapStr = this.Base64decode(mapStr);
	}
	// var mapStr = '';	Aos 낮은 버전 오류
	// for (var i = 0; i < aInput.length; i += 2) {
	// 	mapStr += String.fromCharCode(parseInt(aInput.substr(i, 2), 16));
	// }	
	this.log('mapStr:["' + mapStr + '"]');

	// 이미지 처리를 위해 임시 저장.
	this.LowerTempStr = StrGrab(mapStr, "Img1'>", "</map>");

	var strTemp = '';
	var idx = 0;

	var LowerStr = '', UpperStr = '', NumberStr = '', SpecialStr = '', SpaceStr = '';
	this.KeyStr = '';

	// 스페이스바
	SpaceStr = StrGrab(StrGrab(StrGrab(mapStr, '<map ', '/map>', 1), keyPadName + '.put(', ');'), "'", "'");
	// qwertyuiopasdfghjklzxcvbnm
	// 위치 고정
	idx = 0;
	while (true) {
		strTemp = StrGrab(StrGrab(mapStr, '<map ', '/map>', 1), keyPadName + '.put(', ');', ++idx);

		if ( strTemp == '') break;
		if ( strTemp.indexOf(",'a'") < 0 ) continue;	

		LowerStr += StrGrab(strTemp, "'", "'") + '|';
	}

	// QWERTYUIOPASDFGHJKLZXCVBNM
	// 위치 고정
	idx = 0;
	while (true) {
		strTemp = StrGrab(StrGrab(mapStr, '<map ', '/map>', 2), keyPadName + '.put(', ');', ++idx);

		if ( strTemp == '') break;
		if ( strTemp.indexOf(",'A'") < 0 ) continue;

		UpperStr += StrGrab(strTemp, "'", "'") + '|';
	}

	// -_=+\|{}[];:'",.<>$~`!@#/?!@#$%^&*()
	// 위치 고정
	idx = 0;
	while (true) {
		strTemp = StrGrab(StrGrab(mapStr, '<map ', '/map>', 3), keyPadName + '.put(', ');', ++idx);

		if ( strTemp == '') break;
		if (( strTemp.indexOf(",'_'") < 0 ) || ( strTemp.indexOf(SpaceStr) > -1 ) ) continue; // 스페이스바도 특수문자로 인식이 되어, 스페이스바는 제외.

		SpecialStr += StrGrab(strTemp, "'", "'") + '|';
	}

	// 0 ~ 9
	// 1,2,3,4,6은 고정. 5,7,8,9,0은 위치가 바뀜(가짓수 120가지)
	// 우선 다 가져온 다음 이미지를 확인하여 배열처리.
	idx = 0;
	while (true) {
		strTemp = StrGrab(StrGrab(mapStr, '<map ', '/map>', 1), keyPadName + '.put(', ');', ++idx);

		if ( strTemp == '') break;
		if ( strTemp.indexOf(", '0'") < 0 ) continue;

		NumberStr += StrGrab(strTemp, "'", "'") + '|';
	}

	this.KeyStr = LowerStr + UpperStr + SpecialStr + NumberStr + SpaceStr;
	this.KeyStr = this.KeyStr.split('|');
};

// 위치 값 가져오기
법인카드.prototype.getNumberlocation = function () {
	var coordsM = [];
	var coords = '';
	var idx = 0;
	var i = 0;

	// 랜덤으로 생성되는 숫자 키패드 RGB값
	var numberTable = [
		// 5
		'$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$139$146$162$136$143$157$132$138$153$128$134$149$124$130$143$121$127$141$124$130$145$130$136$152$125$132$147$116$122$136$117$123$137$126$133$149$131$138$154$129$136$153$128$135$152$142$149$165$136$142$157$120$126$139$106$112$124$124$128$135$143$146$152$139$142$147$180$181$184$180$181$183$185$187$190$116$122$136$140$144$153$219$220$221$200$200$202$113$117$129$123$130$145$129$136$153$128$135$152$142$149$165$123$129$142$220$221$222$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$219$220$221$112$118$131$147$150$158$255$255$255$255$255$255$229$229$230$116$121$132$125$132$149$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$229$229$230$200$201$202$179$180$183$247$247$247$247$247$247$140$143$149$123$129$144$117$123$138$151$153$158$219$220$221$255$255$255$161$163$167$119$126$141$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$134$136$140$108$114$126$101$105$113$255$255$255$210$210$212$106$112$124$133$140$156$132$139$155$117$123$137$134$136$141$255$255$255$179$180$183$115$121$136$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$142$144$150$125$132$146$145$148$155$255$255$255$238$238$239$100$106$117$130$136$152$131$138$154$117$123$137$146$148$151$255$255$255$179$180$183$115$121$136$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$142$144$150$127$134$149$115$120$130$255$255$255$255$255$255$168$169$172$119$123$132$97$102$114$136$139$144$229$229$230$255$255$255$161$162$167$119$126$141$128$135$152$142$149$165$119$125$138$219$220$221$255$255$255$146$149$155$131$138$153$119$126$139$190$191$193$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$238$238$239$115$120$131$125$132$149$128$135$152$142$149$165$129$135$149$168$171$176$185$186$189$137$141$151$135$142$157$134$140$156$112$118$130$181$182$185$238$238$239$255$255$255$255$255$255$255$255$255$200$200$202$112$117$127$122$129$144$129$136$153$128$135$152$142$149$165$139$146$160$130$137$152$127$134$148$134$140$155$138$145$161$138$145$161$134$141$155$122$128$142$110$116$129$104$110$122$103$108$121$106$111$124$115$121$135$126$133$149$131$138$154$129$136$153$128$135$152',
		// 7
		'$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$139$146$160$130$137$152$128$135$149$136$143$157$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$129$135$149$168$171$176$186$188$191$123$129$142$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$119$125$138$219$220$221$255$255$255$111$116$128$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$106$112$123$139$146$162$138$145$161$138$145$160$137$144$160$134$141$157$127$134$149$118$124$139$111$117$130$106$112$124$106$112$125$116$122$136$125$132$149$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$106$112$123$139$146$162$137$144$160$131$138$152$119$125$139$104$110$122$141$143$149$179$180$182$219$220$221$238$238$239$255$255$255$183$185$188$118$124$140$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$106$111$122$133$140$155$118$124$138$122$125$133$190$191$193$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$183$185$188$118$124$140$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$94$99$109$116$120$131$190$191$193$255$255$255$255$255$255$247$247$247$210$210$212$169$170$173$140$143$149$110$114$125$104$110$123$116$122$136$125$132$149$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$133$135$139$238$238$239$255$255$255$229$229$230$160$162$165$101$107$118$113$119$132$120$126$141$126$133$148$130$137$153$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$116$122$134$219$220$221$255$255$255$255$255$255$247$247$247$170$171$174$106$112$123$124$131$145$133$140$155$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$121$127$140$219$220$221$255$255$255$229$229$230$120$124$132$121$127$141$135$141$156$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$132$139$153$143$147$156$146$149$156$123$127$138$129$136$151$137$144$160$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$141$147$162$136$142$158$134$140$156$137$144$158$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152',
		// 8
		'$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$134$141$156$129$136$152$129$135$151$131$138$154$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$139$146$162$130$137$151$118$125$137$112$118$130$115$121$134$125$132$145$131$138$153$124$130$145$108$113$126$133$136$144$143$146$153$104$110$122$119$126$141$128$135$151$129$136$153$128$135$152$142$149$165$141$147$162$125$131$145$144$147$153$210$211$212$247$247$247$210$210$212$172$174$177$102$107$119$151$153$158$238$238$239$255$255$255$255$255$255$247$247$247$161$163$168$116$123$137$128$135$152$128$135$152$142$149$165$133$140$154$134$138$145$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$168$169$172$247$247$247$255$255$255$238$238$239$247$247$247$255$255$255$247$247$247$122$126$135$124$131$147$128$135$152$142$149$165$123$129$142$200$201$203$255$255$255$210$211$212$125$128$134$146$148$152$229$229$230$255$255$255$255$255$255$134$136$141$100$105$118$104$109$117$210$210$212$255$255$255$170$172$175$118$124$140$128$135$152$142$149$165$117$123$135$219$220$221$247$247$247$104$109$117$125$132$146$115$121$134$157$158$162$255$255$255$210$210$212$106$112$124$132$139$155$122$129$143$124$126$132$255$255$255$179$180$182$115$121$136$128$135$152$142$149$165$117$123$135$219$220$221$255$255$255$115$119$125$122$128$142$112$118$131$157$158$162$255$255$255$219$220$221$104$109$121$130$137$153$120$127$141$148$149$154$255$255$255$179$180$182$115$121$136$128$135$152$142$149$165$124$130$143$200$201$203$255$255$255$219$220$221$146$148$152$157$158$162$247$247$247$255$255$255$255$255$255$156$158$161$96$101$113$115$119$125$210$210$212$255$255$255$171$172$176$118$125$140$128$135$152$142$149$165$134$141$155$125$129$138$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$145$147$150$238$238$239$255$255$255$247$247$247$255$255$255$255$255$255$247$247$247$112$117$127$125$132$148$128$135$152$142$149$165$141$148$163$128$134$149$136$139$147$200$201$202$219$220$221$200$201$202$143$146$152$110$115$128$132$136$143$219$220$221$255$255$255$255$255$255$238$238$239$130$134$141$120$127$141$129$136$153$128$135$152$142$149$165$142$149$164$140$147$162$132$138$153$122$128$141$116$122$135$119$126$139$129$135$149$134$140$156$127$133$148$112$118$131$125$128$138$124$128$136$108$114$127$122$129$144$130$137$152$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$134$141$157$131$138$154$131$138$154$132$139$155$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152',
		// 9
		'$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$136$143$158$129$136$151$124$131$145$126$133$146$131$138$153$135$142$157$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$138$145$160$125$131$145$117$123$133$151$154$159$181$182$185$160$162$166$133$136$144$112$118$131$128$135$150$134$141$158$134$141$157$130$137$153$127$134$150$128$135$151$129$136$153$128$135$152$142$149$165$140$147$162$122$128$142$162$163$167$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$219$220$221$116$121$132$128$135$151$130$137$152$125$131$142$149$152$160$125$130$142$126$133$149$128$135$152$142$149$165$132$138$152$143$146$152$255$255$255$255$255$255$247$247$247$200$201$202$229$229$230$255$255$255$255$255$255$200$200$202$116$122$136$127$134$149$166$168$173$255$255$255$152$155$161$120$127$143$128$135$152$142$149$165$121$128$140$210$211$212$255$255$255$179$181$183$101$106$118$113$119$132$109$115$127$110$114$121$255$255$255$255$255$255$106$111$124$129$136$151$106$110$120$255$255$255$179$181$183$116$122$137$128$135$152$142$149$165$117$123$135$219$220$221$247$247$247$107$111$119$132$138$153$138$145$161$137$144$159$111$117$129$200$201$202$255$255$255$103$109$121$127$133$148$116$119$127$255$255$255$178$180$182$114$120$135$128$135$152$142$149$165$118$124$137$219$220$221$255$255$255$137$140$144$123$130$144$136$143$159$135$142$156$106$111$123$219$220$221$247$247$247$101$106$119$107$112$125$200$200$202$255$255$255$180$181$184$117$123$138$128$135$152$142$149$165$126$133$146$181$182$185$255$255$255$229$229$230$138$140$145$101$106$118$99$104$115$157$158$162$255$255$255$189$190$192$106$110$116$179$180$182$255$255$255$255$255$255$121$125$133$123$130$146$128$135$152$142$149$165$137$143$158$119$125$135$229$229$230$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$160$162$166$116$122$136$128$135$152$128$135$152$142$149$165$142$149$164$132$139$154$120$125$136$171$172$175$219$220$221$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$238$238$239$210$210$212$141$144$150$115$121$135$128$135$151$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$135$142$158$126$132$146$115$120$133$107$113$125$105$111$122$105$110$122$104$109$121$104$110$122$107$113$126$114$120$134$124$130$145$130$137$154$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152',
		// 0
		'$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$138$145$160$133$140$155$130$137$151$129$135$150$128$135$149$128$135$150$130$137$153$133$140$156$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$140$147$163$132$139$154$119$125$138$105$111$122$134$137$144$142$144$150$141$144$150$141$144$149$142$144$150$122$125$135$105$110$122$115$122$135$126$133$149$131$138$154$129$136$153$128$135$152$142$149$165$141$148$163$129$135$150$125$128$137$210$211$212$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$247$247$247$200$200$202$113$118$129$124$131$146$129$136$153$128$135$152$142$149$165$134$141$155$126$130$139$247$247$247$255$255$255$255$255$255$219$220$221$219$220$221$219$220$221$219$220$221$219$220$221$229$229$230$255$255$255$255$255$255$229$229$230$105$111$123$126$133$150$128$135$152$142$149$165$124$130$143$200$201$203$255$255$255$190$191$193$97$103$113$111$117$130$113$119$131$112$118$131$112$118$130$111$117$129$107$112$125$103$107$116$219$220$221$255$255$255$161$163$167$120$126$142$128$135$152$142$149$165$117$123$135$219$220$221$255$255$255$119$122$129$131$138$153$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$119$125$140$146$148$151$255$255$255$179$180$183$115$121$136$128$135$152$142$149$165$117$123$135$219$220$221$255$255$255$116$119$127$129$136$151$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$133$140$157$117$123$137$156$158$161$255$255$255$179$180$183$115$121$136$128$135$152$142$149$165$124$131$144$200$201$203$255$255$255$210$211$212$105$110$118$104$110$121$105$111$122$105$110$122$104$109$121$103$109$121$101$106$118$112$115$122$238$238$239$255$255$255$161$163$167$120$126$142$128$135$152$142$149$165$136$142$157$116$121$131$247$247$247$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$229$229$230$105$111$123$126$133$150$128$135$152$142$149$165$142$149$164$131$138$152$116$120$130$200$201$202$238$238$239$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$255$238$238$239$179$181$183$115$120$132$124$131$146$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$134$140$156$122$128$141$111$117$129$106$112$124$105$111$122$105$110$122$104$109$121$103$109$121$104$109$122$109$114$127$118$124$138$127$134$150$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152$142$149$165$142$149$164$141$148$164$140$147$163$140$147$162$139$146$162$138$145$161$138$145$160$137$144$160$136$143$159$135$142$158$134$141$158$134$141$157$133$140$156$132$139$156$131$138$154$129$136$153$128$135$152'
	];

	// 5, 7, 8, 9, 0 좌표값 가져오기
	while(true){
		idx++;
		if ( (idx < 39) || (idx == 40)) continue;
		if (idx == 45) break;

		coords = StrGrab(this.LowerTempStr, "data-coords='", "'", idx);
		coordsM[i++] = coords;
	}

	var TempNumberLoc = '';
	for (i = 0; i < coordsM.length; i++) { // 5, 7, 8, 9, 0 data[] loop
		var rgbIdentity = '';
		var x1 = '', x2 = '', y1 = '', y2 = '';
		x1 = parseInt(StrGrab(coordsM[i], '', ','));  // 시작 x점
		y1 = parseInt(StrGrab(coordsM[i], ',', ',', 1)); // 시작 y점
		x2 = parseInt(StrGrab(coordsM[i], ',', ',', 2)); // 끝 x점
		y2 = parseInt(StrGrab(coordsM[i], ',', '', 3));  // 끝 y점

		// 해당 좌표 RGB값 추출..
        for (var x = Number(x1)+15; x < Number(x2)-15; x++) {
            for (var y = Number(y1) + 8; y < Number(y2)-8; y++) {
				rgbIdentity += SASImage.getPixel(x, y);
				this.log('xyz:' + x + ',' + y + ',' + rgbIdentity.length);
            }
        }

		// 찾은 RGB identity에 해당하는 String값으로 세팅.
        for (var j = 0; j < 5; j++) {
            if (rgbIdentity.indexOf(numberTable[j]) > -1) {
                if (j < 5) {
					if (j.toString() == '0') TempNumberLoc += '5';
					else if (j.toString() == '1') TempNumberLoc += '7';
					else if (j.toString() == '2') TempNumberLoc += '8';
					else if (j.toString() == '3') TempNumberLoc += '9';
					else if (j.toString() == '4') TempNumberLoc += '0';
                }
            }
        }
	} // 5, 7, 8, 9, 0 data[] loop end
	
	// 마지막으로 6을 세팅하자.
	var NumberLocation = '';
	for(i = 0; i < 5; i++) {
		NumberLocation += TempNumberLoc[i];
		if (i == 0) NumberLocation += '6';
	}

	return NumberLocation;
};

법인카드.prototype.makePassWord = function (aPassWord) {
	// KeyValue 초기화
	this.KeyValue = '';

	// KeyValue 세팅
	this.KeyValue = 'qwertyuiop';
	this.KeyValue += 'asdfghjkl';
	this.KeyValue += 'zxcvbnm';
	this.KeyValue += 'QWERTYUIOP';
	this.KeyValue += 'ASDFGHJKL';
	this.KeyValue += 'ZXCVBNM';

	// 특수문자 처리..
	var specArr  = '-z_z=z+z\\z|z{z}z[z]z;z:z\'z"z,z.z<z>z$z~z`z!z@z#z/z?z!z@z#z$z%z^z&z*z(z)';
	specArr = specArr.split("z");
	for(var i = 0; i < specArr.length; i++ ) this.KeyValue += specArr[i];

	// 숫자 처리..
	this.KeyValue += '1234';
	this.KeyValue += this.getNumberlocation();  // 이미지 처리(5,7,8,9,0 숫자 랜덤으로 위치 배열됨)
	this.KeyValue += ' ';

	this.log("KeyValue:[" + this.KeyValue + "]");

	var idx = 0;
	var findTemp = '';
	var enc = '';
	var base64enc = '';
	var findidx = 0;
	// KESKey값 Base64로 변환
	var AESKey = certManager.HexToBase64(this.AESKey);

	// 처리 시작.
	while (idx < aPassWord.length) {
		// 변환하려는 Key값 위치값 얻기.
		// ex) aPassWord[idx++]가 p인 경우, findidx = 9
		findidx = this.KeyValue.indexOf(aPassWord[idx++]);

		// 위치에 해당하는 secuStr값을 가져옴.
		findTemp = this.KeyStr[findidx];

		// 암호화 처리.
		enc = certManager.AES_ECB_Encrypt(findTemp, AESKey);

		// 암호화된 값 세팅.
		base64enc += certManager.Base64ToHex(enc);
	}

	this.log('base64enc:["' + base64enc + '"]');
	return base64enc;
};

법인카드.prototype.HeaderUserAgent = function (Type) {
	if (Type == 1) {
		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"text/html, application/xhtml+xml, */*\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		this.userAgent += ",\"Accept-Encoding\":\"gzip, deflate\"";
		this.userAgent += "}";
	} else if (Type == 2) {
		this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
		this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
		this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
		this.userAgent += ",\"Accept-Encoding\":\"gzip, deflate\"";
		this.userAgent += ",\"X-Requested-With\":\"XMLHttpRequest\"";
		this.userAgent += ",\"Host\":\"wisebiz.bccard.com\"";
		this.userAgent += "}";
	}
};

법인카드.prototype.onIDLogin = function (aUserID, aUserPassword) {
	// Login Proccess
	system.setStatus(IBXSTATE_LOGIN, 30);

	var vkPad = this.initKeyPad('https://wisebiz.bccard.com');
	if (vkPad == 'Fail') {
		this.setError(E_IBX_SITE_INVALID + 1);
		return E_IBX_SITE_INVALID + 1;
	}

	var vkMap = StrGrab(vkPad, 'L.u8d(L.h2b("', '"));'); // Hex로 처리된 Base64데이터값.
	var kpdNm = StrTrim(StrGrab(vkPad, 'var kpd =', ';')); // KeyPad값

	// 이미지 데이터를 가져오는 통신
	if (!this.getImgData(vkPad)) {
		this.setError(E_IBX_SITE_INVALID + 2);
		return E_IBX_SITE_INVALID + 2;
	}

	// 암호화된 KeyPad값 가져오기.
	var ModifyPass = '';
	this.setvkPad(vkMap, kpdNm);

	try {
		SASImage.setImageFromBase64(this.imgBase64);
	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_LIBRARY_UPDATE);
		return E_IBX_LIBRARY_UPDATE;
	}
	ModifyPass = this.makePassWord(aUserPassword.getPlainText());

	// Dump Password값 생성.
	var dumpPass = '';
	dumpPass = this.makeDumpPassword(aUserPassword.getPlainText());

	var nw = StrGrab(vkPad, 'this.nw = "', '"');
	var Ux = StrGrab(vkPad, 'this.Ux = "', '"');
	var PassE2E = StrGrab(vkPad, 'kpd.jM, value : "', '"');

	this.url = '/app/corp/LoginActn.corp';
	this.postData = '__E2E_RESULT__=';
	this.postData += '&__E2E_UNIQUE__=' + this.UID;
	this.postData += '&login_password__E2E__=';
	this.postData += '&__E2E_KEYPAD__=' + this.EncKey.toLowerCase();
	this.postData += '&' + nw + '=' + ModifyPass.toLowerCase();
	this.postData += '&' + '__KI_login_password' + '=' + PassE2E;
	this.postData += '&' + Ux + '=' + 'Y';
	this.postData += '&mode=' + 'KEYCRYPT';
	this.postData += '&isUseTTS=' + 'N';
	this.postData += '&INIpluginData=';
	this.postData += '&cert_clss=2';
	this.postData += '&access_mode=' + '1';
	this.postData += '&reURL=';
	this.postData += '&cp_nm=';
	this.postData += '&event_cd=';
	this.postData += '&actionKey=';
	this.postData += '&login_account=' + httpRequest.URLEncodeAll(aUserID);
	this.postData += '&login_password=' + httpRequest.URLEncodeAll(dumpPass);

	return S_IBX_OK;
};

법인카드.prototype.onCertLogin = function (input, password) {

	system.setStatus(IBXSTATE_LOGIN, 30);

	this.host = "https://wisebiz.bccard.com";
	this.url = "/initech/extension/crosswebex6.js";
	var ResultStr;
	var SCert;

	if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	this.log("-Login1:[" + httpRequest.result + "]");
	ResultStr = httpRequest.result;

	if (ResultStr.indexOf('SCert +=') < 0) {
		this.setError(E_IBX_FAILTOGETPAGE + 1);
		return E_IBX_FAILTOGETPAGE + 1;
	}

	var resBlock = StrGrab(ResultStr, 'var SCert;', '//2048 Real-CA', 1);
	this.log("resBlock = " + resBlock);

	eval(resBlock);
	this.log("SCert:[" + SCert + "]");

	certManager.LoadCert(SCert);

	system.setStatus(IBXSTATE_LOGIN, 35);

	if (!certManager.findCert(JSON.stringify(input.인증서))) {
		this.log("인증서를 찾을 수 없습니다.");
		this.setError(E_IBX_CERTIFY_NOT_FOUND);
		return E_IBX_CERTIFY_NOT_FOUND;
	} else {
		this.log("인증서 찾음.");
	}

	if (!certManager.verifyPassword(password)) {
		this.log("certManager.verifyPassword 실패");
		this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
		return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
	} else {
		this.log("certManager.verifyPassword 성공");
	}


	this.url = "/app/corp/LoginActn.corp";

	this.postData = "__E2E_RESULT__=";
	this.postData += "&__E2E_UNIQUE__=";
	this.postData += "&login_password__E2E__=";
	this.postData += "&__E2E_KEYPAD__=";
	this.postData += "&__KH_d509ccfdeca4=";
	this.postData += "&__KI_login_password=";
	this.postData += "&__KU_d509ccfdeca4=";
	this.postData += "&mode=";
	this.postData += "&isUseTTS=N";
	this.postData += "&INIpluginData=";
	this.postData += "&cert_clss=2";
	this.postData += "&access_mode=2";
	this.postData += "&reURL=";
	this.postData += "&cp_nm=";
	this.postData += "&event_cd=";
	this.postData += "&actionKey=";
	this.postData += "&login_account=";
	this.postData += "&login_password=";

	var inipluginData = certManager.MakeINIpluginData(11, this.postData, password, this.TimeURL);

	inipluginData = '&INIpluginData=' + httpRequest.URLEncodeAll(inipluginData);

	// 인증서 로그인 Query
	this.postData = StrReplace(this.postData, '&INIpluginData=', inipluginData);

	this.log("this.postData=" + this.postData);

	return S_IBX_OK;
};

법인카드.prototype.AccountFormat = function (Str) {
	if (Str == null || Str == "") { return ""; }
	var res = "";
	var num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	var array = Str.split('');

	for (var i = 0; i < Str.length; i++) {
		var c = 1;
		for (var j = 0; j < num.length; j++) {

			if (array[i] == num[j]) {
				res += "0"; c = 0; break;
			}
		}
		if (c != 0) {
			res += array[i].replace("*", "x");
		}
	}
	return res;
};

법인카드.prototype.IsvalidDate = function (dates) {
	var b = true;
	var num = "0123456789";
	var array = dates.split('');

	try {
		if (dates.length != 8) b = false;
		for (var i = 0; i < dates.length; i++) {
			if (num.indexOf(array[i]) < 0) { b = false; }
		}
	
		var yyyy = Number(dates.substr(0, 4));
		var mm = Number(dates.substr(4, 2));
		var dd = Number(dates.substr(6, 2));

		// 월, 일 오류 처리..
		if (mm > 12 || mm <= 0) b = false;
		if (dd <= 0) b = false;

		if (mm != 2) { // 나머지 월 처리..
			if ((mm == 1) && (dd > 31)) b = false;
			else if ((mm == 3) && (dd > 31)) b = false;
			else if ((mm == 4) && (dd > 30)) b = false;
			else if ((mm == 5) && (dd > 31)) b = false;
			else if ((mm == 6) && (dd > 30)) b = false;
			else if ((mm == 7) && (dd > 31)) b = false;
			else if ((mm == 8) && (dd > 31)) b = false;
			else if ((mm == 9) && (dd > 30)) b = false;
			else if ((mm == 10) && (dd > 31)) b = false;
			else if ((mm == 11) && (dd > 30)) b = false;
			else if ((mm == 12) && (dd > 31)) b = false;
			else return true;
		} else { // 2월 처리..
			if (yyyy % 4 == 0) {
				if (yyyy % 100 == 0) {
					if (yyyy % 400 == 0) {
						if ((mm == 2) && (dd <= 0 || dd > 29)) b = false;
					} else {
						if ((mm == 2) && (dd <= 0 || dd > 28)) b = false;
					}
				} else {
					if ((mm == 2) && (dd <= 0 || dd > 29)) b = false;
				}
			} else {
				if ((mm == 2) && (dd <= 0 || dd > 28)) b = false;
			}
		}

	} catch(e) {
		b = false;
		this.log("Exceptions::" + e);
		return b;
	} finally {
		return b;
	}
};

법인카드.prototype.CheckInvalidCard = function (cardNumer, highstrno) {
	// Find 카드번호
	this.url = "/app/corp/ComCardListInqActn.corp?formGubun=reqConForm";
	this.HeaderUserAgent(1);
	if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	var ResultStr = httpRequest.result;
	this.log("카드번호 페이지: [" + ResultStr + "]");

	if (ResultStr.indexOf(">카드번호</th>") < 0) {
		this.setError(E_IBX_SITE_INVALID);
		return E_IBX_SITE_INVALID;
	}

	system.setStatus(IBXSTATE_EXECUTE, 65);

	if (highstrno == ""){
		highstrno = "all";
	}

	this.url = '/app/corp/ComCardListInqActn.corp';
	this.postData  = 'gubun=' + 'AJAX';
	this.postData += '&pageNo=' + '1';
	this.postData += '&fcdno1=';
	this.postData += '&fcdno2=';
	this.postData += '&fcdno3=';
	this.postData += '&fcdno4=';
	this.postData += '&fcdnoE=';
	this.postData += '&tabSel=' + 'tab1';
	this.postData += '&mb_no=' + 'all';
	this.postData += '&high_str_no=' + highstrno;
	this.postData += '&str_no=' + 'all';
	this.postData += '&card_no1=' + cardNumer.substring(0, 4);
	this.postData += '&card_no2=' + cardNumer.substring(4, 8);
	this.postData += '&card_no3=' + cardNumer.substring(8, 12);
	this.postData += '&card_no4=' + cardNumer.substring(12, 16);
	this.postData += '&eCard_no3=';
	this.postData += '&card_cry_clss=' + 'all';
	this.postData += '&card_status=' + 'all';
	this.postData += '&card_cry_hgnm=';
	this.HeaderUserAgent(2);
	if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}
	var ResultStr = httpRequest.result;
	this.log("카드번호 결과 : [" + ResultStr + "]");

	if (ResultStr.indexOf("조회 결과가 없습니다") > -1) {
		this.setError(E_IBX_CARD_NO_INVALID);
		return E_IBX_CARD_NO_INVALID;
	}

	return S_IBX_OK;
};

//세션만료 오류 검증 함수
법인카드.prototype.firstSession = function() {

	this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"";
	this.userAgent += ",\"Accept\":\"application/json, text/javascript, */*; q=0.01\"";
	this.userAgent += ",\"Content-Type\":\"application/x-www-form-urlencoded; charset=UTF-8\"";
	this.userAgent += "}";	

	if (httpRequest.postWithUserAgent(this.userAgent, 'https://wisebiz.bccard.com/app/corp/Intro.corp', "") == false) {
		this.setError(E_IBX_FAILTOGETPAGE);
		return E_IBX_FAILTOGETPAGE;
	}

	if ((httpRequest.result.indexOf('중복로그인 안내') > -1) ||
		(httpRequest.result.indexOf('같은 아이디로 다른 기기에서 로그인이 된 경우 발생합니다') > -1) ||
		(httpRequest.result.indexOf('동일ID 로그인 접속시도로 강제 로그아웃되었습니다.') > -1) ){
		this.setError(E_IBX_SERVICE_LOGOUT);
		this.bLogIn = false;
		return E_IBX_SERVICE_LOGOUT;
	}

	if ((httpRequest.result.indexOf('로그인</a') > -1) ||
		(httpRequest.result.indexOf('고객님의 정보보호를 위해 안전하게 로그아웃 되었습니다') > -1) ||
		(httpRequest.result.indexOf('https://www.bccard.com/app/card/SsoLoginSave.do') > -1) ){
		this.setError(E_IBX_AFTER_LOGIN_SERVICE);
		return E_IBX_AFTER_LOGIN_SERVICE;
	}

	return S_IBX_OK;
};

법인카드.prototype.세션체크함수 = function(ResultStr) {

	if ((ResultStr.indexOf('중복로그인 안내') > -1) ||
		(ResultStr.indexOf('같은 아이디로 다른 기기에서 로그인이 된 경우 발생합니다') > -1) ||
		(ResultStr.indexOf('동일ID 로그인 접속시도로 강제 로그아웃되었습니다.') > -1) ){
		this.bLogIn = false;
		this.setError(E_IBX_SERVICE_LOGOUT);		
		return E_IBX_SERVICE_LOGOUT;
	}

	if ((ResultStr.indexOf('로그인</a') > -1) ||
		(ResultStr.indexOf('고객님의 정보보호를 위해 안전하게 로그아웃 되었습니다') > -1) ||
		(ResultStr.indexOf('https://www.bccard.com/app/card/SsoLoginSave.do') > -1) ){
		this.setError(E_IBX_SESSION_CLOSED);
		return E_IBX_SESSION_CLOSED;
	}

	return S_IBX_OK;
};

//TODO:
법인카드.prototype.로그인 = function (aInput) {
	this.log(BankName + " 법인카드 로그인 호출[" + aInput + "]");

	try {
		this.url = "/app/corp/LogoutActn.corp";
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		httpRequest.clearCookie("bccard.com");

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		if (input.사용자비밀번호) this.iSASInOut.Input.사용자비밀번호 = input.사용자비밀번호.replace(/./g, '*');
		if (input.인증서 && input.인증서.비밀번호) this.iSASInOut.Input.인증서.비밀번호 = input.인증서.비밀번호.replace(/./g, '*');

		this.log("로그인방식:[" + input.로그인방식 + "]");
		if (input.로그인방식 == "ID") {
			this.log("아이디/비밀번호 로그인");
			var userID = input.사용자아이디;

			if (!StrTrim(userID)) {
				this.setError(E_IBX_USER_ACCOUNT_NOTENTER);
				return E_IBX_USER_ACCOUNT_NOTENTER;
			}

			if (!StrTrim(input.사용자비밀번호)) {
				this.setError(E_IBX_USER_PASSWORD_NOTENTER);
				return E_IBX_USER_PASSWORD_NOTENTER;
			}
			//아이디 앞, 뒤에 공백있을 경우 오류 발생 
			if (userID != StrTrim(userID)) {
				this.setError(E_IBX_USER_ACCOUNT_INVALID);
				return E_IBX_USER_ACCOUNT_INVALID;
			}
			// SASSecureData 적용
			var userPWD = sas.SecureData.create(input.사용자비밀번호);
			if (userPWD.isSecurData()) {
				this.log('사용자비밀번호 SASSecurData 포맷!');
			} else {
				this.log('사용자비밀번호 일반 포맷!');
			}
			rtn = this.onIDLogin(userID, userPWD);
			if (rtn != S_IBX_OK) {
				return rtn;
			}

		} else if (input.로그인방식 == "CERT") {
			this.log("인증서 로그인");
			var certpath = input.인증서.이름;
			var password = input.인증서.비밀번호;

			if (!password) {
				this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
				return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
			}
			if (!certpath) {
				// PC 모듈 전환용 
				if (!input.인증서.인증서명) {
					this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
					return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
				}
			}

			rtn = this.onCertLogin(input, password);
			if (rtn != S_IBX_OK) {
				return rtn;
			}

		} else {
			this.log("알수 없는 로그인 타입");
			this.setError(E_IBX_LOGIN_TYPE_ERROR);
			return E_IBX_LOGIN_TYPE_ERROR;
		}

		if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result;
		this.log("Login1:[" + resBlock + "]");

		if (resBlock.indexOf("아이디 또는 비밀번호를 잘못 입력 하셨습니다") > -1) {
			this.setError(E_IBX_USER_ACCOUNT_INVALID_2);
			return E_IBX_USER_ACCOUNT_INVALID_2;
		} else if (resBlock.indexOf("비밀번호를 5번 이상 틀렸으므로 로그인을 하실 수 없습니다") > -1) {
			this.setError(E_IBX_USER_PASSWORD_DENIED);
			return E_IBX_USER_PASSWORD_DENIED;
		} else if (resBlock.indexOf("소지하고 계신 아이디와 패스워드를 입력하여 주십시요") > -1 ||
			resBlock.indexOf("회원 등록을 하지 않으셨거나 ID 또는 비밀번호가 틀립니다") > -1 ||
			resBlock.indexOf("회원정보를 찾을 수 없습니다") > -1 ||
			resBlock.indexOf("회원을 찾을 수 없습니다") > -1 ||
			resBlock.indexOf("비밀번호를 잘못 입력 하셨습니다") > -1) {
			this.setError(E_IBX_USER_PASSWORD_INVALID);
			return E_IBX_USER_PASSWORD_INVALID;
		} else if (resBlock.indexOf("존재하지 않는 아이디입니다") > -1) {
			this.setError(E_IBX_USER_ACCOUNT_INVALID);
			return E_IBX_USER_ACCOUNT_INVALID;
		} else if (resBlock.indexOf("등록되지 않은 인증서 입니다") > -1 ||
			resBlock.indexOf("인증서 등록후 로그인 해주세요") > -1 ||
			resBlock.indexOf("공인인증서를 등록 후 이용해 주시기 바랍니다") > -1 ||
			resBlock.indexOf("messageKey = \"USER__NOTREGIST\"") > -1) {
			this.setError(E_IBX_CERTIFY_NOT_REGISTER);
			return E_IBX_CERTIFY_NOT_REGISTER;
		} else if (resBlock.indexOf("입력하신 ID는 장기 미사용에 따라 비밀번호 재설정 후 로그인이 가능합니다") > -1 ||
			resBlock.indexOf("입력하신 아이디는 장기 미사용에 따라") > -1 ||
			resBlock.indexOf("밀번호 재설정 후</strong> 로그인이 가능합니다.") > -1) {
			this.setError(E_IBX_CUSTOMER_LONG_UNUSED);
			return E_IBX_CUSTOMER_LONG_UNUSED;
		} else if (resBlock.indexOf("사업자용 공인인증서만 이용이 가능합니다") > -1) {
			this.setError(E_IBX_CUSTOMER_CLASS_INVALID);
			return E_IBX_CUSTOMER_CLASS_INVALID;
		} else if (resBlock.indexOf("비씨카드 인터넷 시스템 접속 한계 초과") > -1) {
			this.setError(E_IBX_SERVICE_SERVERBUSY);
			return E_IBX_SERVICE_SERVERBUSY;
		} else if (resBlock.indexOf("서비스 요청중에 에러가 발생했습니다") > -1 ||
			resBlock.indexOf("서비스 요청중에 시스템에 장애가") > -1) {
			this.setError(E_IBX_SITE_INTERNAL);
			return E_IBX_SITE_INTERNAL;
		} else if (resBlock.indexOf("<title>Error</title>") > -1 ||
			resBlock.indexOf("시스템 오류입니다") > -1) {
			this.setError(E_IBX_UNKNOWN);
			return E_IBX_UNKNOWN;
		}

		this.url = "/app/corp/Intro.corp";
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}

		resBlock = httpRequest.result;
		this.log("resBlockFinal[" + resBlock + "]");

		if (resBlock.indexOf("span>로그아웃</span") == -1) {
			this.setError(E_IBX_LOGIN_FAIL);
			return E_IBX_LOGIN_FAIL;
		}

		this.log("로그인 S_IBK_OK");
		this.bLogIn = true;

		// 결과 처리
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		return S_IBX_OK;
	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 법인카드 로그인 finally");
	}
};

법인카드.prototype.보유카드조회 = function (aInput) {
	this.log(BankName + " 보유카드조회 호출");
	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		//firstSession Check
		var sessionChk = this.firstSession();
		if (sessionChk != S_IBX_OK) {
			return;
		}

		var input = dec(aInput.Input);
        var 조회구분 = input.조회구분;            
		if (조회구분) 조회구분 = 조회구분.toUpperCase();

        if ( 조회구분 && ( 조회구분 != 'F') )
        {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
            return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
        } 

		// 카드이용조회 > 카드정보조회
		system.setStatus(IBXSTATE_EXECUTE, 60);

		this.url = "/app/corp/HoldCardInqActn.corp";
		this.HeaderUserAgent(1);
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result;
		this.log("카드정보조회: [" + resBlock + "]");
		
		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if ((resBlock.indexOf('code":9999') >= 0) ||
			(resBlock.indexOf('세션이 만료 되었습니다. 로그인 화면으로 이동합니다') >= 0) ||
			(resBlock.indexOf('loginF.submit();') >= 0)) {
			this.setError(E_IBX_SESSION_CLOSED);
			return E_IBX_SESSION_CLOSED;
		}
		if (resBlock.indexOf(">조회기준<") < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		var 보유카드조회 = [];
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.계정권한 = '';
		this.iSASInOut.Output.Result.보유카드조회 = 보유카드조회;

		try {
			this.url = '/app/corp/HoldCardInqActn.corp';
			this.postData  = 'src_gunun=' + 'all';
			this.postData += '&mb_no=' + 'all';
			this.postData += '&high_str_no=' + StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"');
			this.postData += '&str_no=' + 'all';
			this.postData += '&card_no1=';
			this.postData += '&card_no2=';
			this.postData += '&card_no3=';
			this.postData += '&card_no4=';
			this.postData += '&eUpdCard_no3=';
			this.postData += '&str_data=';
			this.postData += '&str_clss=' + StrGrab(StrGrab(resBlock, 'name="str_clss"', '>'), 'value="', '"');
			this.postData += '&str_self=' + StrGrab(StrGrab(resBlock, 'name="str_self"', '>'), 'value="', '"');
			this.postData += '&down=' + 'N';
			this.postData += '&down_type=';
			this.postData += '&sel_code_clss=';
			this.postData += '&sel_code_id=';
			this.postData += '&bef_code_id=';
			this.postData += '&gubun=';
			this.postData += '&intro_yn=';
			this.postData += '&card_no=';
			this.postData += '&key_type=';
			this.postData += '&auto_search=' + 'Y';


			if (조회구분 != 'F'){
				// 사이트 화면상 처리 시작.
				var totCnt = 0;
				var page = 0;
				var olditem = {};

				for (var countPages = 1; true; countPages++) {

					system.setStatus(IBXSTATE_EXECUTE, 70);
					
					var sQuery = this.postData;
					sQuery += '&page_no=' + countPages;
					sQuery += '&download_yn=';
					sQuery += '&download_type=';

					this.HeaderUserAgent(2);
					if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, sQuery) == false) {
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					var strBuff = httpRequest.result;
					page = StrGrab(strBuff, 'TOTALPAGE\\":', ',');
					this.log("보유카드조회 결과 " + countPages + ": [" + strBuff + "]");

					//세션체크함수
					sessionChk = this.세션체크함수(strBuff);

					if (sessionChk != S_IBX_OK) {
						return;
					}

					if (strBuff.indexOf("success\":true") < 0) {
						this.setError(E_IBX_SITE_INVALID + 1);
						return E_IBX_SITE_INVALID + 1;
					}
					if (StrGrab(strBuff, '"TOTAL\\":', ',') == "0") {
						this.setError(I_IBX_RESULT_NOTPRESENT);
						return I_IBX_RESULT_NOTPRESENT;
					}

					// Change to Json File	           
					strBuff = StrGrab(strBuff, 'fnDrawGrid(', ');');
					strBuff = StrReplace(strBuff, '\\', '');
					this.log("jsonObj 결과  " + countPages + ": [" + strBuff + "]");

					var jsonObj;
					try {
						jsonObj = JSON.parse(strBuff);
					} catch (e) {
						this.setError(E_IBX_SITE_INVALID + 2);
						return E_IBX_SITE_INVALID + 2;
					}

					// 보유카드조회 결과 처리
					system.setStatus(IBXSTATE_RESULT, 80);

					for (var i = 0; i < jsonObj.data.length; i++) {
						var item = jsonObj.data[i];
						var subItem = {};

						subItem.카드명 = StrTrim(item.AFFI_FIRM_NM);

						subItem.회원사 = StrTrim(item.RPRS_MBK_NO_C);						

						subItem.카드번호 = StrReplace(StrReplace(item.CARD_NO_M, "-", ""), '*', '');

						subItem.결제일 = StrTrim(StrReplace(item.BK_ACCT_DATE, '일', ''));
						if ((subItem.결제일 < 10) && (subItem.결제일 >= 0)) {
							subItem.결제일 = "0" + subItem.결제일;
						}

						subItem.당월결제액 = "";

						subItem.카드번호형식 = this.AccountFormat(StrReplace(item.CARD_NO_M, "-", ""));						

						subItem.부서코드 = StrTrim(item.DEPT_NM);
						if (subItem.부서코드.indexOf('(') > -1) { subItem.부서코드 = StrGrab(subItem.부서코드, '', '('); }

						if (!subItem.부서코드) {
							this.setError(E_IBX_RESULT_FAIL);
							return E_IBX_RESULT_FAIL;
						}
						if (!IsCurrency(subItem.카드번호)) {
							this.setError(E_IBX_CURRENCY_NOT_CONVERT);
							return E_IBX_CURRENCY_NOT_CONVERT;
						}
						if (JSON.stringify(olditem) == JSON.stringify(subItem)) { // 중복결과 검증..
							this.setError(E_IBX_RESULT_VERFY_FAIL);
							return E_IBX_RESULT_VERFY_FAIL;
						} else {
							olditem = subItem;
						}
						보유카드조회[totCnt++] = subItem;
					}
					if (countPages >= page) { break; }

				}
			} else {
				//파일 다운로드 처리 시작
				system.setStatus(IBXSTATE_EXECUTE, 72);
					
				var sQuery = this.postData;
				sQuery += '&page_no=' + '1';
				sQuery += '&download_yn=' + 'Y';
				sQuery += '&download_type=' + 'excel'; // excel: .xls파일 , text: .txt파일

				this.HeaderUserAgent(1);
				this.log('testKIS' + this.userAgent);
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, sQuery) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				this.log('conResult_Zip_B64:[' + httpRequest.getB64Result() + ']');

				if( SASArchive.setZipFromBase64(httpRequest.getB64Result()) ){
					console.log("setZipFromBase64:[True]");
				}else{
					console.log("setZipFromBase64:[False]");
				}
				//1. SASArchive.setZipFromURL(const aUrlStr: string): Boolean;
				//2. SASArchive.clear;
			
				var aFileName = '', j;
				var sep = '\t';
				//3. SASArchive.getFileCount(): Integer;
				for(var i=0;i<SASArchive.getFileCount();i++){
					//4. SASArchive.getFileName(const aFileIndex: Integer): string;
					aFileName = SASArchive.getFileName(i);
					console.log("aFileName:[" + i + "][" + aFileName + "]");
					//5. SASArchive.findFile(const aFileName: string): Integer;
					j = SASArchive.findFile( aFileName );
					console.log("findFile:[" + j + "]");
				}
			
				//엑셀같은 파일명을 레퍼런스 링크로 사용하는 경우는 파일명이 더 유리함.
				//6. SASArchive.getTextFile(const aFileName: string; const aCharSet: string = 'UTF-8'): string;
				// if(aFileName != ''){
				//     var TestFile = SASArchive.getTextFile( aFileName );
				//     //var TestFile = SASArchive.getTextFile( aFileName, 'EUC-KR' );
				//     console.log("TestFile:[" + TestFile + "]");
				// }
			
				//JS객체개 내려오는게 더 좋긴 한데 현재 구조로는 애매함. -_-;;
				//7. SASArchive.sendToExcel(const aFileName: string): Boolean;
				if((aFileName != '') && SASArchive.sendToExcel(aFileName)){
					SASExcel.setWorkSheetIndex( 0 );
					for(var k=0;k < SASExcel.getWorkSheetCount();k++){
						this.log("WorkSheetName[" + k + "]:[" + SASExcel.getWorkSheetName(k) + "]");
					}
					
					var strRow;
					for(var nRow=0;nRow<SASExcel.getRowCount();nRow++){
						strRow = '';
						for(var nCol=0;nCol<SASExcel.getColCount();nCol++){
							strRow += SASExcel.getCelsText(nCol, nRow) + "\t";						
						}
						this.log("[" + nRow + "]" + strRow);

						if ( nRow>0 )
						{
							system.setStatus(IBXSTATE_RESULT, 82);
							var olditem = {};
							var subItem = {};
							
							subItem.카드명 = StrTrim(StrGrab(strRow, sep, sep, 2));
							
							subItem.회원사 = StrTrim(StrGrab(strRow, sep, sep, 1));
							
							subItem.카드번호 = StrTrim(StrReplace(StrGrab(strRow, sep, sep, 3), '-', ''));
							
							subItem.결제일 = '';
							
							subItem.당월결제액 = '';
							
							subItem.카드번호형식 = this.AccountFormat(subItem.카드번호);
							
							subItem.부서코드 = StrTrim(StrGrab(strRow, '', sep));
							if (subItem.부서코드.indexOf('(') > -1) subItem.부서코드 = StrGrab(subItem.부서코드, '', '(');

							if (!subItem.부서코드) {
								this.setError(E_IBX_RESULT_FAIL);
								return E_IBX_RESULT_FAIL;
							}

							if (!IsCurrency(subItem.카드번호)) {
								this.setError(E_IBX_CURRENCY_NOT_CONVERT);
								return E_IBX_CURRENCY_NOT_CONVERT;
							}
							
							if (JSON.stringify(olditem) == JSON.stringify(subItem)) { // 중복결과 검증..
								this.setError(E_IBX_RESULT_VERFY_FAIL);
								return E_IBX_RESULT_VERFY_FAIL;
							} else {
								olditem = subItem;
							}
							
							보유카드조회.push(subItem);

						}
					}
				}
				//8. SASArchive.getB64File(const aFileName: string): string;
				//console.log("getB64File:[" + SASArchive.getB64File( aFileName ) + "]");
				

			}

			if (보유카드조회.length == 0) {
				this.setError(I_IBX_RESULT_NOTPRESENT);
				return I_IBX_RESULT_NOTPRESENT;
			}
		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_SITE_INVALID + 3);
			return E_IBX_SITE_INVALID + 3;
		}
		return S_IBX_OK;

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 보유카드조회 finally");
	}
};

법인카드.prototype.승인내역 = function (aInput) {
	this.log(BankName + " 승인내역 호출");
	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 조회구분 = input.조회구분;
		var 카드번호 = input.카드번호;
		var 조회시작일 = input.조회시작일;
		var 조회종료일 = input.조회종료일;

		if (!조회구분) {
			this.setError(E_IBX_CARD_SCRAP_INFO_NOTENTER);
			return E_IBX_CARD_SCRAP_INFO_NOTENTER;
		}
		if (조회구분 != "1" && 조회구분 != "2") {
			this.setError(E_IBX_CARD_SCRAP_INFO_INVALID);
			return E_IBX_CARD_SCRAP_INFO_INVALID;
		}
		if (조회구분 == "2") {
			if (!카드번호) {
				this.setError(E_IBX_CARD_NO_NOTENTER);
				return E_IBX_CARD_NO_NOTENTER;
			}
			if (!IsCurrency(카드번호) || 카드번호.length != 16) {
				this.setError(E_IBX_CARD_NO_INVALID);
				return E_IBX_CARD_NO_INVALID;
			}
		}
		// 조회시작일 미입력
		if (!조회시작일) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
			return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
		}
		// 조회종료일 미입력
		if (!조회종료일) {
			this.setError(E_IBX_ENUM_DATE_END_NOTENTER);
			return E_IBX_ENUM_DATE_END_NOTENTER;
		}
		// 조회시작일은 숫자 / 8자리
		if (!this.IsvalidDate(조회시작일) || 조회시작일.length != 8) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
			return E_IBX_ENUM_DATE_BEGIN_INVALID;
		}
		// 조회종료일은 숫자 / 8자리
		if (!this.IsvalidDate(조회종료일) || 조회종료일.length != 8) {
			this.setError(E_IBX_ENUM_DATE_END_INVALID);
			return E_IBX_ENUM_DATE_END_INVALID;
		}
		// 미래의 날자의 조회 종료일
		if (parseInt(조회종료일) > parseInt(new Date().yyyymmdd())) {
			this.setError(E_IBX_ENUM_DATE_END_FUTURE);
			return E_IBX_ENUM_DATE_END_FUTURE;
		}
		// 미래의 날자의 조회 종료일
		if (parseInt(조회시작일) > parseInt(조회종료일)) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_GREATTHENEND);
			return E_IBX_ENUM_DATE_BEGIN_GREATTHENEND;
		}

		// 카드이용조회 > 승인내역조회
		system.setStatus(IBXSTATE_EXECUTE, 60);

		this.url = "/app/corp/UseAuthInqActn.corp";
		this.HeaderUserAgent(1);
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result;
		this.log("승인내역: [" + resBlock + "]");

		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if ((resBlock.indexOf('code":9999') >= 0) ||
			(resBlock.indexOf('세션이 만료 되었습니다. 로그인 화면으로 이동합니다') >= 0) ||
			(resBlock.indexOf('loginF.submit();') >= 0)) {
			this.setError(E_IBX_SESSION_CLOSED);
			return E_IBX_SESSION_CLOSED;
		}
		if (resBlock.indexOf("<h1>승인내역조회</h1>") < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}


		var 승인내역조회 = [];
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.내역정렬순서 = "0";
		this.iSASInOut.Output.Result.승인내역조회 = 승인내역조회;

		// 승인내역조회 결과
		system.setStatus(IBXSTATE_RESULT, 70);

		try {
			var totCnt = 0;
			var page = 0;
			var olditem = {};

			var src_gunun = "all";
			var card_no1 = "";
			var card_no2 = "";
			var card_no3 = "";
			var card_no4 = "";

			if (조회구분 == "2") {
				src_gunun = "cardNo";
				card_no1 = 카드번호.substr(0, 4);
				card_no2 = 카드번호.substr(4, 4);
				card_no3 = 카드번호.substr(8, 4);
				card_no4 = 카드번호.substr(12, 4);

				var cardNo = this.CheckInvalidCard(카드번호, StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"'));
				if (cardNo != S_IBX_OK) {
					return cardNo;
				}
			}

			for (var countPages = 1; true; countPages++) {
				system.setStatus(IBXSTATE_EXECUTE, 75);

				this.url = '/app/corp/UseAuthInqActn.corp';
				this.postData  = 'currMonth=';
				this.postData += '&print_yn=N';
				this.postData += '&nextYn=N';
				this.postData += '&src_gunun=' + src_gunun;
				this.postData += '&mb_no=all';
				this.postData += '&high_str_no=' + StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"');
				this.postData += '&str_no=all';
				this.postData += '&card_no1=' + card_no1;
				this.postData += '&card_no2=' + card_no2;
				this.postData += '&card_no3=' + card_no3;
				this.postData += '&card_no4=' + card_no4;
				this.postData += '&eUpdCard_no3=';
				this.postData += '&str_data=';
				this.postData += '&str_clss=' + StrGrab(StrGrab(resBlock, 'name="str_clss"', '>'), 'value="', '"');
				this.postData += '&str_self=' + StrGrab(StrGrab(resBlock, 'name="str_self"', '>'), 'value="', '"');
				this.postData += '&view_type=table';
				this.postData += '&start_page=1';
				this.postData += '&end_page=1';
				this.postData += '&page_no=' + countPages;
				this.postData += '&nextPage=';
				this.postData += '&command=';
				this.postData += '&download_yn=N';
				this.postData += '&key_type=INIT';
				this.postData += '&use_type=';
				this.postData += '&use_clss=all';
				this.postData += '&card_clss=0';
				this.postData += '&card_status=all';
				this.postData += '&use_term=other';
				this.postData += '&start_date=' + 조회시작일.substr(0, 4) + '.' + 조회시작일.substr(4, 2) + '.' + 조회시작일.substr(6, 2);
				this.postData += '&end_date=' + 조회종료일.substr(0, 4) + '.' + 조회종료일.substr(4, 2) + '.' + 조회종료일.substr(6, 2);
				this.postData += '&con_clss=define';
				this.HeaderUserAgent(2);
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				var strBuff = httpRequest.result;
				page = StrGrab(strBuff, '"cntVal":"', '",');
				this.log("승인내역조회 결과 " + countPages + ": [" + strBuff + "]");

				//세션체크함수
				sessionChk = this.세션체크함수(strBuff);

				if (sessionChk != S_IBX_OK) {
					return;
				}

                if (strBuff.indexOf('조회기간을 확인하여 주십시오.') >= 0) {
                    this.setError(E_IBX_ENUM_DATE_BEGIN_DENIED);
                    return E_IBX_ENUM_DATE_BEGIN_DENIED;
                }
				if (page == "0") {
					this.setError(I_IBX_RESULT_NOTPRESENT);
					return I_IBX_RESULT_NOTPRESENT;
				}
				if (strBuff.indexOf("서비스 요청중에 시스템에 장애가 발생") >= 0) {
					this.setError(E_IBX_SERVICE_SERVERBUSY);
					return E_IBX_SERVICE_SERVERBUSY;
				}
				if (strBuff.indexOf("success\":true") < 0 || page == "") {
					this.setError(E_IBX_SITE_INVALID + 2);
					return E_IBX_SITE_INVALID + 2;
				}

				// Cut Block Result
				strBuff = StrGrab(strBuff, 'fnDrawGrid(', ');');
				strBuff = StrReplace(strBuff, '\\', '');

				// Check Column in table 
				var jsonObjHead;
				var headerStr = '{"data":' + StrGrab(strBuff, '{"data":', ']}', 1) + ']}';
				this.log("headerStr 결과  " + countPages + ": [" + headerStr + "]");

				try {
					jsonObjHead = JSON.parse(headerStr);
				} catch (e) {
					this.setError(E_IBX_SITE_INVALID + 3);
					return E_IBX_SITE_INVALID + 3;
				}

				var countHeader = [];
				for (var i = 0; i < jsonObjHead.data.length; i++) {
					var item = jsonObjHead.data[i];
					if (item.필드한글명 == '승인일자') { countHeader[0] = 1; }
					else if (item.필드한글명 == '승인시간') { countHeader[1] = 1; }
					else if (item.필드한글명 == '승인번호') { countHeader[2] = 1; }
					else if (item.필드한글명 == '카드종류') { countHeader[3] = 1; }
					else if (item.필드한글명 == '카드번호') { countHeader[4] = 1; }
					else if (item.필드한글명 == '가맹점명') { countHeader[5] = 1; }
					else if (item.필드한글명 == '매출종류') { countHeader[6] = 1; }
					else if (item.필드한글명 == '할부기간') { countHeader[7] = 1; }
					else if (item.필드한글명 == '승인금액(원화)') { countHeader[8] = 1; }
					else if (item.필드한글명 == '승인금액(외화)') { countHeader[9] = 1; }
					else if (item.필드한글명 == '가맹점사업자번호') { countHeader[10] = 1; }
					else if (item.필드한글명 == '가맹점번호') { countHeader[11] = 1; }
					else if (item.필드한글명 == '가맹점업종') { countHeader[12] = 1; }
					else if (item.필드한글명 == '국내외사용구분') { countHeader[13] = 1; }
				}
				for (var i = 0; i < 14; i++) {
					if (countHeader[i] != 1) {
						this.setError(E_IBX_CARD_TABLE_CHECK);
						return E_IBX_CARD_TABLE_CHECK;
					}
				}

				// Result
				system.setStatus(IBXSTATE_RESULT, 90);
				strBuff = StrGrab(strBuff, 'data":[', ']}', 2);
				this.log("strBuff 결과  " + countPages + ": [" + strBuff + "]");

				for (var i = 1; true; i++) {
					var item = StrGrab(strBuff, '{', '}', i);
					var subItem = {};

					if (item == "") { break; }
				
					subItem.승인일자 = StrReplace(StrGrab(item, '승인일자":"', '"'), '-', '');

					subItem.승인시간 = StrReplace(StrGrab(item, '승인시간":"', '"'), ':', '');
					if ((subItem.승인시간).length == 4) {
						subItem.승인시간 = subItem.승인시간 + '00';
					}

					subItem.승인번호 = StrGrab(item, '승인번호":"', '"').trim();

					subItem.카드종류 = StrGrab(item, '카드종류":"', '"').trim();

					subItem.카드번호 = StrGrab(item, '카드번호":"', '"');
					subItem.카드번호 = StrReplace(subItem.카드번호, '-', '');
					subItem.카드번호 = StrReplace(subItem.카드번호, '*', '').trim();

					subItem.가맹점명 = StrGrab(item, '가맹점명":"', '"').trim();

					subItem.매출종류 = StrGrab(item, '매출종류":"', '"');
					if ((subItem.매출종류).indexOf("일시불") > -1) {
						subItem.매출종류 = "1";
					} else if ((subItem.매출종류).indexOf("할부") > -1) {
						subItem.매출종류 = "2";
					} else if ((subItem.매출종류).indexOf("현금서비스") > -1) {
						subItem.매출종류 = "3";
					} else {
						subItem.매출종류 = "";
					}

					subItem.할부기간 = StrGrab(item, '할부기간":"', '"').trim();

					if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
						subItem.승인금액 = StrGrab(item, '승인금액(원화)":"', '"').trim();
						subItem.승인금액 = StrReplace(subItem.승인금액, ',', '');
					} else {
						subItem.승인금액 = StrGrab(item, '승인금액(외화)":"', '"').trim();
						subItem.승인금액 = StrReplace(subItem.승인금액, ',', '');
					}

					if (StrGrab(item, '매출종류":"', '"').indexOf("취소") > -1) {
						subItem.취소년월일 = subItem.승인일자;
					} else {
						subItem.취소년월일 = "";
					}

					subItem.결제예정일 = "";

					if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
						subItem.가맹점사업자번호 = StrReplace(StrGrab(item, '가맹점사업자번호":"', '"'), '-', '');
						subItem.가맹점코드 = StrGrab(item, '가맹점번호":"', '"').trim();
						subItem.가맹점업종 = StrGrab(item, '가맹점업종":"', '"').trim();
					} else {
						subItem.가맹점사업자번호 = "";
						subItem.가맹점코드 = "";
						subItem.가맹점업종 = "";
					}


					if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
						subItem.국내외구분 = "1";
					} else {
						subItem.국내외구분 = "2";
						subItem.통화코드 = "USD";
					}

					subItem.카드번호형식 = StrReplace(StrGrab(item, '카드번호":"', '"'), '-', '');
					subItem.카드번호형식 = this.AccountFormat(subItem.카드번호형식);

					// 필수값 아님(회계양식출력)
					subItem.가맹점전화번호 = StrTrim(StrReplace(StrReplace(StrReplace(StrGrab(item, '가맹점전화번호":"', '"'), '-', ''), '(', ''), ')', ''));
					subItem.가맹점주소 = StrTrim(StrGrab(item, '가맹점주소1":"', '"')) + ' ' + StrTrim(StrGrab(item, '가맹점주소2":"', '"'));				
					subItem.가맹점대표자명 = StrGrab(item, '가맹점대표자명":"', '"').trim();

					if (!IsCurrency(subItem.카드번호)) {
						this.setError(E_IBX_CURRENCY_NOT_CONVERT);
						return E_IBX_CURRENCY_NOT_CONVERT;
					}
					// 정렬순서 검증...
					if ((i > 0) && (i < 3)) {
						if (parseInt(olditem.승인시간승인시간 + olditem.승인시간) < parseInt(item.승인일자 + item.승인시간)) {
							this.setError(E_IBX_RESULT_ORDER_VERFY_FAIL);
							return E_IBX_RESULT_ORDER_VERFY_FAIL;
						}
					}
					// 중복결과 검증..
					if (JSON.stringify(olditem) == JSON.stringify(subItem)) {
						this.setError(E_IBX_RESULT_VERFY_FAIL);
						return E_IBX_RESULT_VERFY_FAIL;
					} else {
						olditem = subItem;
					}

					승인내역조회[totCnt++] = subItem;
				}
				if (countPages * 15 >= page) { break; }

			}
			if (승인내역조회 == "") {
				this.setError(I_IBX_RESULT_NOTPRESENT);
				return I_IBX_RESULT_NOTPRESENT;
			}

		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_SITE_INVALID + 4);
			return E_IBX_SITE_INVALID + 4;
		}
		return S_IBX_OK;
	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 승인내역 finally");
	}
};

법인카드.prototype.청구내역 = function (aInput) {
	this.log(BankName + " 청구내역 호출");

	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 조회구분 = input.조회구분;
		var 카드번호 = input.카드번호;
		// 보유카드조회 출력 사용.
		var 부서코드 = input.부서코드;
		var 결제일 = input.결제일;
		var 월청구금액;

		if (!조회구분) {
			this.setError(E_IBX_CARD_SCRAP_INFO_NOTENTER);
			return E_IBX_CARD_SCRAP_INFO_NOTENTER;
		}
		if (조회구분 != "1" && 조회구분 != "2") {
			this.setError(E_IBX_CARD_SCRAP_INFO_INVALID);
			return E_IBX_CARD_SCRAP_INFO_INVALID;
		}
		if (!결제일) {
			this.setError(E_IBX_DATE_PAYMENT_NOTENTER);
			return E_IBX_DATE_PAYMENT_NOTENTER;
		}
		if (조회구분 == "1") {
			if (!부서코드) {
				this.setError(E_IBX_CARD_POST_NOTENTER);
				return E_IBX_CARD_POST_NOTENTER;
			}
			if (!IsCurrency(부서코드)) {
				this.setError(E_IBX_CARD_POST_INVALID);
				return E_IBX_CARD_POST_INVALID;
			}
			if (!this.IsvalidDate(결제일 + '01') || 결제일.length != 6) {
				this.setError(E_IBX_DATE_PAYMENT_INVALID);
				return E_IBX_DATE_PAYMENT_INVALID;
			}
			if (parseInt(결제일 + '01') > parseInt(new Date().yyyymmdd())) {
				this.setError(E_IBX_DATE_PAYMENT_FUTURE);
				return E_IBX_DATE_PAYMENT_FUTURE;
			}
		}
		if (조회구분 == "2") {
			if (!카드번호) {
				this.setError(E_IBX_CARD_NO_NOTENTER);
				return E_IBX_CARD_NO_NOTENTER;
			}
			if (!IsCurrency(카드번호) || 카드번호.length != 16) {
				this.setError(E_IBX_CARD_NO_INVALID);
				return E_IBX_CARD_NO_INVALID;
			}
			if (!this.IsvalidDate(결제일) || 결제일.length != 8) {
				this.setError(E_IBX_DATE_PAYMENT_INVALID);
				return E_IBX_DATE_PAYMENT_INVALID;
			}
			if (parseInt(결제일) > parseInt(new Date().yyyymmdd())) {
				this.setError(E_IBX_DATE_PAYMENT_FUTURE);
				return E_IBX_DATE_PAYMENT_FUTURE;
			}
		}

		// My Account > 이용대금명세서
		system.setStatus(IBXSTATE_EXECUTE, 60);

		this.url = "/app/corp/UseReqSttlInqActn.corp";
		this.HeaderUserAgent(1);
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result;
		this.log("청구내역 1: [" + resBlock + "]");
		
		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}
		
		if ((resBlock.indexOf('code":9999') >= 0) ||
			(resBlock.indexOf('세션이 만료 되었습니다. 로그인 화면으로 이동합니다') >= 0) ||
			(resBlock.indexOf('loginF.submit();') >= 0)) {
			this.setError(E_IBX_SESSION_CLOSED);
			return E_IBX_SESSION_CLOSED;
		}
		if (resBlock.indexOf("<h1>청구명세서조회</h1>") < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		// 부서코드 & 카드번호
		var rep_mb_nm = "";
		var rep_mb_no = "";
		var dept_req_date = "";
		var req_day = "";
		var 결제일자 = "";
		var card_search = "";
		var con_clss = "";
		var card_no1 = "";
		var card_no2 = "";
		var card_no3 = "";
		var card_no4 = "";

		try {
			if (조회구분 == "1") {
				card_search = "N";
				con_clss = "std&view_clss=payment";
				카드번호 = "";
				req_day = 'all';

				// Find 부서코드
				for (var countPages = 1; true; countPages++) {
					system.setStatus(IBXSTATE_EXECUTE, 65);

					this.url = '/app/corp/UseReqCardListInqActn.corp';
					this.postData  = 'gubun=';
					this.postData += '&print_yn=' + 'N';
					this.postData += '&cardcnt=' + StrGrab(StrGrab(resBlock, 'name="cardcnt"', '>'), 'value="', '"');
					this.postData += '&code_clss=' + StrGrab(StrGrab(resBlock, 'name="code_clss"', '>'), 'value="', '"');
					this.postData += '&rep_mb_nm=';
					this.postData += '&rep_mb_no=';
					this.postData += '&bk_mb_no=';
					this.postData += '&dept_nm=';
					this.postData += '&bk_br_no=';
					this.postData += '&acct_no=';
					this.postData += '&req_date=' + 결제일.substring(0, 6);
					this.postData += '&card_no=';
					this.postData += '&card_search=' + 'N';
					this.postData += '&page_no=' + countPages;
					this.postData += '&dept_req_date=';
					this.postData += '&download_yn=' + 'N';
					this.postData += '&download_type=';
					this.postData += '&download_gubun=';
					this.postData += '&req_year=' + 결제일.substring(0, 4);
					this.postData += '&req_month=' + 결제일.substring(4, 6);
					this.postData += '&req_day=' + req_day;
					this.postData += '&card_no1=';
					this.postData += '&card_no2=';
					this.postData += '&card_no3=';
					this.postData += '&card_no4=';
					this.postData += '&eUpdCard_no3=';
					this.postData += '&con_clss=' + 'std';
					this.postData += '&view_clss=' + 'payment';
					this.postData += '&layer_con_clss=' + 'std';
					this.HeaderUserAgent(2);
					if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					var ResultStr = httpRequest.result;
					this.log("부서코드 결과 " + countPages + ": [" + ResultStr + "]");

					//세션체크함수
					sessionChk = this.세션체크함수(ResultStr);

					if (sessionChk != S_IBX_OK) {
						return;
					}

					if (ResultStr.indexOf("회원사회원번호") < 0) {
						this.setError(E_IBX_SITE_INVALID + 1);
						return E_IBX_SITE_INVALID + 1;
					}

					ResultStr = StrGrab(ResultStr, 'fnDrawGrid(', ');');
					ResultStr = StrReplace(ResultStr, '\\', '');

					// 수시입출 구분을 위해 html parsing 으로 변경
					var jsonObj;
					try {
						jsonObj = JSON.parse(ResultStr);
					} catch (e) {
						this.setError(E_IBX_SITE_INVALID + 2);
						return E_IBX_SITE_INVALID + 2;
					}
					this.log("부서코드 jsonObj 결과" + countPages + ": [" + ResultStr + "]");

					if (ResultStr == "{}" && countPages == 1) {
						this.setError(I_IBX_RESULT_NOTPRESENT);
						return I_IBX_RESULT_NOTPRESENT;
					}
					if (ResultStr == "{}" || ResultStr == "") {
						break;
					}

					for (var i = 0; i < jsonObj.data.length; i++) {
						var item = jsonObj.data[i];
						if (부서코드 == item.회원사회원번호) {
							rep_mb_nm = item.결제은행;
							rep_mb_no = item.회원사회원번호;
							dept_req_date = item.REQ_DATE;
							결제일자 = item.결제일자;
							결제일자 = StrReplace(결제일자, '.', '');
							결제일자 = 결제일자.substring(4, 6);
							break;
						}
					}
					if (rep_mb_no != "") { break; }
					break; // no next page for testing
				}
				if (rep_mb_no == "") {
					this.setError(E_IBX_CARD_POST_INVALID);
					return E_IBX_CARD_POST_INVALID;
				}

			} else if (조회구분 == "2") {
				req_day = 결제일.substring(6, 8);
				card_search = "Y";
				con_clss = "define";
				결제일자 = "";
				card_no1 = 카드번호.substring(0, 4);
				card_no2 = 카드번호.substring(4, 8);
				card_no3 = 카드번호.substring(8, 12);
				card_no4 = 카드번호.substring(12, 16);

				var cardNo = this.CheckInvalidCard(카드번호, StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"'));
				if (cardNo != S_IBX_OK) {
					return cardNo;
				}
			}

		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_SITE_INVALID + 3);
			return E_IBX_SITE_INVALID + 3;
		}

		var 청구내역조회 = [];

		try {
			var totCnt = 0;
			var totalData = 0;

			// 청구내역 결과
			for (var countPages = 1; true; countPages++) {

				system.setStatus(IBXSTATE_EXECUTE, 70);

				this.url = '/app/corp/UseReqSttlInqActn.corp';
				this.postData  = 'gubun=';
				this.postData += '&print_yn=' + 'N';
				this.postData += '&cardcnt=' + StrGrab(StrGrab(resBlock, 'name="cardcnt"', '>'), 'value="', '"');
				this.postData += '&code_clss=' + StrGrab(StrGrab(resBlock, 'name="code_clss"', '>'), 'value="', '"');
				this.postData += '&rep_mb_nm=' + httpRequest.URLEncodeAll(rep_mb_nm, "UTF-8");
				this.postData += '&rep_mb_no=' + rep_mb_no;
				this.postData += '&bk_mb_no=';
				this.postData += '&dept_nm=';
				this.postData += '&bk_br_no=';
				this.postData += '&acct_no=';
				this.postData += '&req_date=' + 결제일.substring(0, 6);
				this.postData += '&card_no=' + 카드번호;
				this.postData += '&card_search=' + card_search;
				this.postData += '&page_no=' + countPages;
				this.postData += '&dept_req_date=' + dept_req_date;
				this.postData += '&download_yn=' + 'N';
				this.postData += '&download_type=';
				this.postData += '&download_gubun=';
				this.postData += '&req_year=' + 결제일.substring(0, 4);
				this.postData += '&req_month=' + 결제일.substring(4, 6);
				this.postData += '&req_day=' + req_day;
				this.postData += '&card_no1=' + card_no1;
				this.postData += '&card_no2=' + card_no2;
				this.postData += '&card_no3=' + card_no3;
				this.postData += '&card_no4=' + card_no4;
				this.postData += '&eUpdCard_no3=';
				this.postData += '&con_clss=' + con_clss;
				this.postData += '&layer_con_clss=' + 'define';
				this.HeaderUserAgent(2);
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				var ResultStr = httpRequest.result;
				totalData = StrGrab(ResultStr, '"cnt":"', '"');
				this.log("청구내역 결과 " + countPages + ": [" + ResultStr + "]");

				//세션체크함수
				sessionChk = this.세션체크함수(ResultStr);

				if (sessionChk != S_IBX_OK) {
					return;
				}

				if (ResultStr.indexOf("useReqData") < 0) {
					this.setError(E_IBX_SITE_INVALID + 4);
					return E_IBX_SITE_INVALID + 4;
				}
				if (totalData == 0) {
					this.setError(I_IBX_RESULT_NOTPRESENT);
					return I_IBX_RESULT_NOTPRESENT;
				}

				// 수시입출 구분을 위해 html parsing 으로 변경
				var jsonObj;
				var jsonObjHead;
				var headerStr;
				try {
					jsonObj = JSON.parse(ResultStr).contents;
					headerStr = '{"data":' + StrGrab(jsonObj, '{"data":', ']}', 1) + ']}';
					ResultStr = '{"data":' + StrGrab(jsonObj, '{"data":', ']}', 2) + ']}';
					jsonObjHead = JSON.parse(headerStr);
					jsonObj = JSON.parse(ResultStr);
				} catch (e) {
					this.setError(E_IBX_SITE_INVALID + 5);
					return E_IBX_SITE_INVALID + 5;
				}
				this.log("jsonObjHead 결과  " + countPages + ": [" + headerStr + "]");
				this.log("jsonObj 결과  " + countPages + ": [" + ResultStr + "]");

				// Check Column in table
				var countHeader = [];
				for (var i = 0; i < jsonObjHead.data.length; i++) {
					var item = jsonObjHead.data[i];
					if (item.필드한글명 == '카드번호') { countHeader[0] = 1; }
					else if (item.필드한글명 == '승인일자') { countHeader[1] = 1; }
					else if (item.필드한글명 == '가맹점명') { countHeader[2] = 1; }
					else if (item.필드한글명 == '할부기간') { countHeader[3] = 1; }
					else if (item.필드한글명 == '할부회차') { countHeader[4] = 1; }
					else if (item.필드한글명 == '청구금액') { countHeader[5] = 1; }
					else if (item.필드한글명 == '청구수수료') { countHeader[6] = 1; }
					else if (item.필드한글명 == '가맹점사업자번호') { countHeader[7] = 1; }
					else if (item.필드한글명 == '가맹점업종') { countHeader[8] = 1; }
				}
				for (var i = 0; i < 9; i++) {
					if (countHeader[i] != 1) {
						this.setError(E_IBX_CARD_TABLE_CHECK);
						return E_IBX_CARD_TABLE_CHECK;
					}
				}

				// Result
				system.setStatus(IBXSTATE_RESULT, 90);
				for (var i = 0; i < jsonObj.data.length; i++) {
					var item = jsonObj.data[i];
					var subItem = {};

					// 월청구금액
	    			월청구금액 = item.TOT_AMT;
					if (월청구금액 == "") {
						월청구금액 = "0";
					}
					if (!(IsCurrency(월청구금액))) {
						this.setError(E_IBX_CURRENCY_NOT_CONVERT);
						return E_IBX_CURRENCY_NOT_CONVERT;
					}

					subItem.카드번호 = StrReplace(item.카드번호, "-", "");
					subItem.카드번호 = StrReplace(subItem.카드번호, '*', '');

					subItem.카드종류 = "";

					subItem.결제일 = 결제일자;

					subItem.이용일자 = StrReplace(item.승인일자, "-", "");

					subItem.가맹점명 = item.가맹점명.trim();

					subItem.할부개월 = item.할부기간.trim();

					subItem.입금회차 = item.할부회차.trim();

					subItem.이용대금 = "";

					subItem.청구금액 = item.청구금액.trim();
					subItem.청구금액 = StrReplace(subItem.청구금액, ",", "");

					subItem.수수료 = item.청구수수료.trim();
					subItem.수수료 = StrReplace(subItem.수수료, ",", "");

					subItem.결제후잔액 = "";

					subItem.가맹점사업자번호 = item.가맹점사업자번호.trim();
					subItem.가맹점사업자번호 = StrReplace(subItem.가맹점사업자번호, "-", "");

					subItem.가맹점업종 = item.가맹점업종.trim();

					subItem.카드번호형식 = this.AccountFormat(StrReplace(item.카드번호, "-", ""));

					// 필수값 아님(회계양식출력)
					subItem.가맹점전화번호 = StrTrim(StrReplace(StrReplace(StrReplace(item.가맹점전화번호, '-', ''), '(', ''), ')', ''));
					subItem.가맹점주소 = StrTrim(item.가맹점주소1) + ' ' + StrTrim(item.가맹점주소2);
					subItem.가맹점대표자명 = StrTrim(item.가맹점대표자명);

					if (!(IsCurrency(subItem.이용대금) || IsCurrency(subItem.청구금액) || IsCurrency(subItem.수수료) ||
						IsCurrency(subItem.결제후잔액) || IsCurrency(월청구금액))) {
	                    this.setError(E_IBX_CURRENCY_NOT_CONVERT);
	                    return E_IBX_CURRENCY_NOT_CONVERT;
	                }
					청구내역조회[totCnt++] = subItem;

				}
				if (countPages * 10 >= totalData) { break; }
			}
			if (청구내역조회 == "") {
				this.setError(I_IBX_RESULT_NOTPRESENT);
				return I_IBX_RESULT_NOTPRESENT;
			}

		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_SITE_INVALID + 6);
			return E_IBX_SITE_INVALID + 6;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.내역정렬순서 = "0";
		this.iSASInOut.Output.Result.월청구금액 = 월청구금액;
		this.iSASInOut.Output.Result.청구내역조회 = 청구내역조회;
		return S_IBX_OK;

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	}
	finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 청구내역 finally");
	}
};

법인카드.prototype.이용한도조회 = function (aInput) {
	this.log(BankName + " 이용한도조회 호출");

	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 조회구분 = input.조회구분;
		var 카드번호 = input.카드번호;

		if (조회구분 != "" && 조회구분 != "2") {
			this.setError(E_IBX_CARD_SCRAP_INFO_INVALID);
			return E_IBX_CARD_SCRAP_INFO_INVALID;
		}

		if (!카드번호) {
			this.setError(E_IBX_CARD_NO_NOTENTER);
			return E_IBX_CARD_NO_NOTENTER;
		}
		if (!IsCurrency(카드번호) || 카드번호.length != 16) {
			this.setError(E_IBX_CARD_NO_INVALID);
			return E_IBX_CARD_NO_INVALID;
		}

		// My Account > 한도관리 > 개별 한도
		system.setStatus(IBXSTATE_EXECUTE, 60);

		this.url = "/app/corp/HoldCardInqActn.corp";
		this.HeaderUserAgent(1);
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result;
		this.log("이용한도조회: [" + resBlock + "]");

		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if ((resBlock.indexOf('code":9999') >= 0) ||
			(resBlock.indexOf('세션이 만료 되었습니다. 로그인 화면으로 이동합니다') >= 0) ||
			(resBlock.indexOf('loginF.submit();') >= 0)) {
			this.setError(E_IBX_SESSION_CLOSED);
			return E_IBX_SESSION_CLOSED;
		}
		if (resBlock.indexOf(">조회기준<") < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		var 한도조회 = [];
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.한도조회 = 한도조회;

		// 이용한도조회 결과
		system.setStatus(IBXSTATE_RESULT, 80);

		try {
			var totCnt = 0;
			var page = 0;
			var olditem = {};

			var src_gunun = "all";
			var card_no1 = "";
			var card_no2 = "";
			var card_no3 = "";
			var card_no4 = "";

			//if (조회구분 == "2"){
			src_gunun = "cardNo";
			card_no1 = 카드번호.substring(0, 4);
			card_no2 = 카드번호.substring(4, 8);
			card_no3 = 카드번호.substring(8, 12);
			card_no4 = 카드번호.substring(12, 16);

			var cardNo = this.CheckInvalidCard(카드번호, StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"'));
			if (cardNo != S_IBX_OK) {
				return cardNo;
			}
			//}

			for (var countPages = 1; true; countPages++) {
				system.setStatus(IBXSTATE_EXECUTE, 70);

				this.url = '/app/corp/HoldCardInqActn.corp';
				this.postData  = 'src_gunun=' + src_gunun;
				this.postData += '&mb_no=' + 'all';
				this.postData += '&high_str_no=' + StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"');
				this.postData += '&str_no=' + 'all';
				this.postData += '&card_no1=' + card_no1;
				this.postData += '&card_no2=' + card_no2;
				this.postData += '&card_no3=' + card_no3;
				this.postData += '&card_no4=' + card_no4;
				this.postData += '&eUpdCard_no3=';
				this.postData += '&str_data=';
				this.postData += '&str_clss=' + '2';
				this.postData += '&str_self=' + StrGrab(StrGrab(resBlock, 'name="str_self"', '>'), 'value="', '"');
				this.postData += '&download_yn=';
				this.postData += '&down=' + 'N';
				this.postData += '&down_type=';
				this.postData += '&sel_code_clss=';
				this.postData += '&sel_code_id=';
				this.postData += '&bef_code_id=';
				this.postData += '&gubun=';
				this.postData += '&intro_yn=';
				this.postData += '&card_no=';
				this.postData += '&page_no=' + countPages;
				this.postData += '&download_type=';
				this.postData += '&key_type=';
				this.postData += '&auto_search=' + 'Y';
				this.HeaderUserAgent(2);
				if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
					this.setError(E_IBX_FAILTOGETPAGE);
					return E_IBX_FAILTOGETPAGE;
				}
				var strBuff = httpRequest.result;
				page = StrGrab(strBuff, 'TOTALPAGE\\":', ',');
				this.log("이용한도조회 결과 " + countPages + ": [" + strBuff + "]");

				//세션체크함수
				sessionChk = this.세션체크함수(strBuff);

				if (sessionChk != S_IBX_OK) {
					return;
				}

				if (strBuff.indexOf("success\":true") < 0) {
					this.setError(E_IBX_SITE_INVALID + 2);
					return E_IBX_SITE_INVALID + 2;
				}
				if (StrGrab(strBuff, '"TOTAL\\":', ',') == "0") {
					this.setError(I_IBX_RESULT_NOTPRESENT);
					return I_IBX_RESULT_NOTPRESENT;
				}

				for (var i = 1; true; i++) {
					system.setStatus(IBXSTATE_EXECUTE, 80);
					var subItem = {};
					var item = StrGrab(strBuff, '<form id=\\"holdFrm', '<\\/form>', i);
					this.log("item 결과  " + i + ": [" + item + "]");

					if (item == "") { break; }

					this.url = '/app/corp/HoldCardLimitDetailInqActn.corp';
					this.postData  = 'card_no1=' + StrGrab(StrGrab(item, 'name=\\"card_no1\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&card_no2=' + StrGrab(StrGrab(item, 'name=\\"card_no2\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&eUpdCard_no3=' + StrGrab(StrGrab(item, 'name=\\"eUpdCard_no3\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&card_no4=' + StrGrab(StrGrab(item, 'name=\\"card_no4\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&bef_card_no=' + StrGrab(StrGrab(item, 'name=\\"bef_card_no\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&src_gunun=' + StrGrab(StrGrab(item, 'name=\\"src_gunun\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&bk_acct_date=' + httpRequest.URLEncodeAll(StrGrab(StrGrab(item, 'name=\\"bk_acct_date\\"', '>'), 'value=\\"', '\\"'), "UTF-8");
					this.postData += '&bk_acct_nm=' + httpRequest.URLEncodeAll(StrGrab(StrGrab(item, 'name=\\"bk_acct_nm\\"', '>'), 'value=\\"', '\\"'), "UTF-8");
					this.postData += '&mb_no=' + StrGrab(StrGrab(item, 'name=\\"mb_no\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&vald_lim=' + StrGrab(StrGrab(item, 'name=\\"vald_lim\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&card_reg_date=' + StrGrab(StrGrab(item, 'name=\\"card_reg_date\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&aplc_clss=' + httpRequest.URLEncodeAll(StrGrab(StrGrab(item, 'name=\\"aplc_clss\\"', '>'), 'value=\\"', '\\"'), "UTF-8");
					this.postData += '&eCard_no=' + StrGrab(StrGrab(item, 'name=\\"eCard_no\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&limitchage=' + StrGrab(StrGrab(item, 'name=\\"limitchage\\"', '>'), 'value=\\"', '\\"');
					this.postData += '&rep_mb_no=' + StrGrab(StrGrab(item, 'name=\\"rep_mb_no\\"', '>'), 'value=\\"', '\\"');
					this.HeaderUserAgent(1);
					if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					var res = httpRequest.result;

					if (res.indexOf("카드한도 조회/변경") < 0) {
						this.setError(E_IBX_SITE_INVALID + 3);
						return E_IBX_SITE_INVALID + 3;
					}

					subItem.카드번호 = StrGrab(res, '카드번호</th>', '</tr>');
					subItem.카드번호 = StrGrab(subItem.카드번호, '">', '<');
					subItem.카드번호 = StrReplace(subItem.카드번호, "-", "");
					subItem.카드번호 = StrReplace(subItem.카드번호, '*', '');

					subItem.카드종류 = "";

					subItem.카드사용_한도금액 = StrGrab(res, 'id="limitChgAmtData1">', '</span');
					subItem.카드사용_한도금액 = StrReplace(subItem.카드사용_한도금액, '원', '');
					subItem.카드사용_한도금액 = StrReplace(subItem.카드사용_한도금액, ',', '');
					subItem.카드사용_한도금액 = subItem.카드사용_한도금액.trim();

					subItem.카드사용한도_사용금액 = StrGrab(res, '이용한 금액</th>', '</tr>', 2);
					subItem.카드사용한도_사용금액 = StrGrab(subItem.카드사용한도_사용금액, 'class="ar">', '</td>');
					subItem.카드사용한도_사용금액 = StrReplace(subItem.카드사용한도_사용금액, '원', '');
					subItem.카드사용한도_사용금액 = StrReplace(subItem.카드사용한도_사용금액, ',', '');
					subItem.카드사용한도_사용금액 = subItem.카드사용한도_사용금액.trim();

					subItem.카드사용한도_잔여금액 = StrGrab(res, 'id="limitChgAmtData2">', '</span>');
					subItem.카드사용한도_잔여금액 = StrReplace(subItem.카드사용한도_잔여금액, '원', '');
					subItem.카드사용한도_잔여금액 = StrReplace(subItem.카드사용한도_잔여금액, ',', '');
					subItem.카드사용한도_잔여금액 = subItem.카드사용한도_잔여금액.trim();

					subItem.일시불_한도금액 = "";

					subItem.일시불_사용금액 = "";

					subItem.일시불_한도잔여금액 = "";

					subItem.할부_한도금액 = "";

					subItem.할부_사용금액 = "";

					subItem.할부_한도잔여금액 = "";

					subItem.해외_한도금액 = "";

					subItem.해외_사용금액 = "";

					subItem.해외_한도잔여금액 = "";

					subItem.현금서비스_한도금액 = "";

					subItem.현금서비스_사용금액 = "";

					subItem.현금서비스_한도잔여금액 = "";

					subItem.통화코드 = "";

					subItem.카드번호형식 = StrGrab(res, '카드번호</th>', '</tr>');
					subItem.카드번호형식 = StrGrab(subItem.카드번호형식, '">', '<');
					subItem.카드번호형식 = StrReplace(subItem.카드번호형식, "-", "");
					subItem.카드번호형식 = this.AccountFormat(subItem.카드번호형식);

					if (!IsCurrency(subItem.카드번호)) {
						this.setError(E_IBX_CURRENCY_NOT_CONVERT);
						return E_IBX_CURRENCY_NOT_CONVERT;
					}
					// 중복결과 검증..
					if (JSON.stringify(olditem) == JSON.stringify(subItem)) {
						this.setError(E_IBX_RESULT_VERFY_FAIL);
						return E_IBX_RESULT_VERFY_FAIL;
					} else {
						olditem = subItem;
					}
					한도조회[totCnt++] = subItem;
				}
				if (countPages >= page) { break; }

			}
			if (한도조회 == "") {
				this.setError(I_IBX_RESULT_NOTPRESENT);
				return I_IBX_RESULT_NOTPRESENT;
			}

		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_SITE_INVALID + 4);
			return E_IBX_SITE_INVALID + 4;
		}
		return S_IBX_OK;

	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	}
	finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 이용한도조회 finally");
	}
};

법인카드.prototype.이용내역 = function (aInput) {
	this.log(BankName + " 이용내역 호출");
	try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		//firstSession Check
		var sessionChk = this.firstSession();

		if (sessionChk != S_IBX_OK) {
			return;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		var 조회구분 = input.조회구분;
		var 카드번호 = input.카드번호;
		var 조회시작일 = input.조회시작일;
		var 조회종료일 = input.조회종료일;

		if (!조회구분) {
			this.setError(E_IBX_CARD_SCRAP_INFO_NOTENTER);
			return E_IBX_CARD_SCRAP_INFO_NOTENTER;
		}
		if (조회구분 != "1" && 조회구분 != "2") {
			this.setError(E_IBX_CARD_SCRAP_INFO_INVALID);
			return E_IBX_CARD_SCRAP_INFO_INVALID;
		}
		if (조회구분 == "2") {
			if (!카드번호) {
				this.setError(E_IBX_CARD_NO_NOTENTER);
				return E_IBX_CARD_NO_NOTENTER;
			}
			if (!IsCurrency(카드번호) || 카드번호.length != 16) {
				this.setError(E_IBX_CARD_NO_INVALID);
				return E_IBX_CARD_NO_INVALID;
			}
		}
		// 조회시작일 미입력
		if (!조회시작일) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
			return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
		}
		// 조회시작일은 숫자 / 8자리
		if (!this.IsvalidDate(조회시작일) || 조회시작일.length != 8) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
			return E_IBX_ENUM_DATE_BEGIN_INVALID;
		}
        var tmpDate = new Date(조회시작일.substring(0,4), parseInt(조회시작일.substring(4,6)) - 1, 조회시작일.substring(6,8));
        if ( tmpDate.yyyymmdd() != 조회시작일 ){
            this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
            return E_IBX_ENUM_DATE_BEGIN_INVALID;
		}
		// 조회종료일 미입력
		if (!조회종료일) {
			this.setError(E_IBX_ENUM_DATE_END_NOTENTER);
			return E_IBX_ENUM_DATE_END_NOTENTER;
		}
		// 조회종료일은 숫자 / 8자리
		if (!this.IsvalidDate(조회종료일) || 조회종료일.length != 8) {
			this.setError(E_IBX_ENUM_DATE_END_INVALID);
			return E_IBX_ENUM_DATE_END_INVALID;
		}
        tmpDate = new Date(조회종료일.substring(0,4), parseInt(조회종료일.substring(4,6)) - 1, 조회종료일.substring(6,8));
        if ( tmpDate.yyyymmdd() != 조회종료일 ){
            this.setError(E_IBX_ENUM_DATE_END_INVALID);
            return E_IBX_ENUM_DATE_END_INVALID;
        }
		// 미래의 날자의 조회 종료일
		if (parseInt(조회시작일) > parseInt(조회종료일)) {
			this.setError(E_IBX_ENUM_DATE_BEGIN_GREATTHENEND);
			return E_IBX_ENUM_DATE_BEGIN_GREATTHENEND;
		}
		// 미래의 날자의 조회 종료일
		if (parseInt(조회종료일) > parseInt(new Date().yyyymmdd())) {
			this.setError(E_IBX_ENUM_DATE_END_FUTURE);
			return E_IBX_ENUM_DATE_END_FUTURE;
		}
		// 최대 조회가능 기간 1개월단위
		tmpDate = new Date(조회종료일.substring(0,4), parseInt(조회종료일.substring(4,6)) - 1, 조회종료일.substring(6,8));
		tmpDate.setMonth( tmpDate.getMonth() - 1);
		if (parseInt(tmpDate.yyyymmdd()) > parseInt(조회시작일)) {
			this.setError(E_IBX_ENUM_DATE_END_DENIED);
			return E_IBX_ENUM_DATE_END_DENIED;
		}

		// 카드이용조회 > 이용내역조회
		system.setStatus(IBXSTATE_EXECUTE, 60);

		this.url = "/app/corp/UseSaleInqActn.corp";
		this.HeaderUserAgent(1);
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var resBlock = httpRequest.result;
		this.log("이용내역: [" + resBlock + "]");

		//세션체크함수
		sessionChk = this.세션체크함수(resBlock);

		if (sessionChk != S_IBX_OK) {
			return;
		}

		if ((resBlock.indexOf('code":9999') >= 0) ||
			(resBlock.indexOf('세션이 만료 되었습니다. 로그인 화면으로 이동합니다') >= 0) ||
			(resBlock.indexOf('loginF.submit();') >= 0)) {
			this.setError(E_IBX_SESSION_CLOSED);
			return E_IBX_SESSION_CLOSED;
		}
		if (resBlock.indexOf("<h1>전체이용내역</h1>") < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		var 이용내역조회 = [];
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.내역정렬순서 = "0";
		this.iSASInOut.Output.Result.이용내역조회 = 이용내역조회;

		// 이용내역조회 결과
		system.setStatus(IBXSTATE_RESULT, 70);

		try {
			var totCnt = 0;
			var src_gunun = "all";
			var card_no1 = "";
			var card_no2 = "";
			var card_no3 = "";
			var card_no4 = "";

			if (조회구분 == "2") {
				src_gunun = "cardNo";
				card_no1 = 카드번호.substr(0, 4);
				card_no2 = 카드번호.substr(4, 4);
				card_no3 = 카드번호.substr(8, 4);
				card_no4 = 카드번호.substr(12, 4);

				var cardNo = this.CheckInvalidCard(카드번호, StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"'));
				if (cardNo != S_IBX_OK) {
					return cardNo;
				}
			}

			for (var loopcnt = 0; loopcnt < 2; loopcnt++) {
				var use_clss = '';
				if (loopcnt == 0) use_clss = 'native';
				else				use_clss = 'foreign';

				for (var countPages = 1; true; countPages++) {
					system.setStatus(IBXSTATE_EXECUTE, 75);

					this.url = '/app/corp/UseSaleInqActn.corp';
					this.postData  = 'memclss=' + StrGrab(StrGrab(resBlock, 'name="memclss"', '>'), 'value="', '"');
					this.postData += '&gubun=';
					this.postData += '&mb_no=' + 'all';
					this.postData += '&high_str_no=' + StrGrab(StrGrab(resBlock, 'name="high_str_no"', '>'), 'value="', '"');
					this.postData += '&eUpdCard_no3=';
					this.postData += '&str_data=';
					this.postData += '&str_clss=' + StrGrab(StrGrab(resBlock, 'name="str_clss"', '>'), 'value="', '"');
					this.postData += '&str_self=' + StrGrab(StrGrab(resBlock, 'name="str_self"', '>'), 'value="', '"');
					this.postData += '&view_type=table';
					this.postData += '&start_page=';
					this.postData += '&end_page=';
					this.postData += '&page_no=' + countPages;
					this.postData += '&sel_code_clss=';
					this.postData += '&sel_code_id=';
					this.postData += '&bef_code_id=';
					this.postData += '&key_type=';
					this.postData += '&next_key=';
					this.postData += '&intro_yn=' 	+ 'N';
					this.postData += '&currMonth=';
					this.postData += '&nextYn='		+ 'N';
					this.postData += '&top_title='	+ 'null';
					this.postData += '&download_yn=';
					this.postData += '&download_type=';
					this.postData += '&use_clss=' + use_clss; // 국내: native, 해외: foreign
					this.postData += '&card_clss=0';
					this.postData += '&card_status=all';
					this.postData += '&use_term=month';
					this.postData += '&start_date=' + 조회시작일.substr(0, 4) + '.' + 조회시작일.substr(4, 2) + '.' + 조회시작일.substr(6, 2);
					this.postData += '&end_date=' + 조회종료일.substr(0, 4) + '.' + 조회종료일.substr(4, 2) + '.' + 조회종료일.substr(6, 2);
					this.postData += '&con_clss=define';
					this.postData += '&src_gunun=' + src_gunun;
					this.postData += '&card_no1=' + card_no1;
					this.postData += '&card_no2=' + card_no2;
					this.postData += '&card_no3=' + card_no3;
					this.postData += '&card_no4=' + card_no4;
					this.HeaderUserAgent(2);
					if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					var strBuff = httpRequest.result;
					this.log("이용내역조회 결과_" + use_clss + '_' + countPages + "_: [" + strBuff + "]");

					//세션체크함수
					sessionChk = this.세션체크함수(strBuff);

					if (sessionChk != S_IBX_OK) {
						return;
					}

					if (strBuff.indexOf('"rows":0,') > 0) break;
					if (strBuff.indexOf("자료처리량이 많아 대용량 정보제공 화면으로 이동합니다") >= 0) {
						this.setError(E_IBX_ENUM_DATE_BEGIN_DENIED);
						return E_IBX_ENUM_DATE_BEGIN_DENIED;
					}
					if (strBuff.indexOf("서비스 요청중에 시스템에 장애가 발생") >= 0) {
						this.setError(E_IBX_SERVICE_SERVERBUSY);
						return E_IBX_SERVICE_SERVERBUSY;
					}
					if (strBuff.indexOf("alt=\\\"다음\\\">") < 0 || strBuff.indexOf("alt=\\\"맨마지막\\\">") < 0) {
						this.setError(E_IBX_SITE_INVALID + 2);
						return E_IBX_SITE_INVALID + 2;
					}

					// jshint -W107
					var LastPageNo = StrGrab(StrGrab(strBuff, 'alt=\\\"다음\\\">', 'alt=\\\"맨마지막\\\">'), 'javascript:search_Sale_check_1(', ')');
					this.log('LastPageNo::' + LastPageNo);
					// jshint +W107

					// Cut Block Result
					strBuff = StrGrab(strBuff, 'fnDrawGrid(', ');');
					strBuff = StrReplace(strBuff, '\\', '');

					// Check Column in table 
					var jsonObjHead;
					var headerStr = '{"data":' + StrGrab(strBuff, '{"data":', ']}', 1) + ']}';
					this.log("headerStr 결과  " + countPages + ": [" + headerStr + "]");

					try {
						jsonObjHead = JSON.parse(headerStr);
					} catch (e) {
						this.setError(E_IBX_SITE_INVALID + 3);
						return E_IBX_SITE_INVALID + 3;
					}

					var countHeader = [];
					var i = 0;
					var item = {};
					if (use_clss == 'native') {
						for (i = 0; i < jsonObjHead.data.length; i++) {
							item = jsonObjHead.data[i];
							if (item.필드한글명 == '승인일자') { countHeader[0] = 1; }
							else if (item.필드한글명 == '승인시간') { countHeader[1] = 1; }
							else if (item.필드한글명 == '승인번호') { countHeader[2] = 1; }
							else if (item.필드한글명 == '회원사명') { countHeader[3] = 1; }
							else if (item.필드한글명 == '카드번호') { countHeader[4] = 1; }
							else if (item.필드한글명 == '가맹점명') { countHeader[5] = 1; }
							else if (item.필드한글명 == '할부기간') { countHeader[6] = 1; }
							else if (item.필드한글명 == '거래금액(원화)') { countHeader[7] = 1; }
							else if (item.필드한글명 == '가맹점사업자번호') { countHeader[8] = 1; }
							else if (item.필드한글명 == '가맹점주소1') { countHeader[9] = 1; }
							else if (item.필드한글명 == '가맹점주소2') { countHeader[10] = 1; }
							else if (item.필드한글명 == '가맹점대표자명') { countHeader[11] = 1; }
							else if (item.필드한글명 == '가맹점전화번호') { countHeader[12] = 1; }
							else if (item.필드한글명 == '매입일자') { countHeader[13] = 1; }
						}
						for (i = 0; i < 14; i++) {
							if (countHeader[i] != 1) {
								this.setError(E_IBX_CARD_TABLE_CHECK);
								return E_IBX_CARD_TABLE_CHECK;
							}
						}
					} else {
						for (i = 0; i < jsonObjHead.data.length; i++) {
							item = jsonObjHead.data[i];
							if (item.필드한글명 == '승인일자') { countHeader[0] = 1; }
							else if (item.필드한글명 == '승인번호') { countHeader[1] = 1; }
							else if (item.필드한글명 == '회원사명') { countHeader[2] = 1; }
							else if (item.필드한글명 == '카드번호') { countHeader[3] = 1; }
							else if (item.필드한글명 == '가맹점명') { countHeader[4] = 1; }
							else if (item.필드한글명 == '매출종류') { countHeader[5] = 1; }
							else if (item.필드한글명 == '할부기간') { countHeader[6] = 1; }
							else if (item.필드한글명 == '매입금액(원화)') { countHeader[7] = 1; }
							else if (item.필드한글명 == '매입일자') { countHeader[8] = 1; }
							else if (item.필드한글명 == '승인금액(외화)') { countHeader[9] = 1; }
							else if (item.필드한글명 == '청구금액') { countHeader[10] = 1; }
							else if (item.필드한글명 == '청구수수료') { countHeader[11] = 1; }
							else if (item.필드한글명 == '거래금액(외화)') { countHeader[12] = 1; }
							else if (item.필드한글명 == '외화거래국가명') { countHeader[13] = 1; }
							else if (item.필드한글명 == '외화거래국가코드') { countHeader[14] = 1; }
							else if (item.필드한글명 == '외화거래도시명') { countHeader[15] = 1; }
						}
						for (i = 0; i < 16; i++) {
							if (countHeader[i] != 1) {
								this.setError(E_IBX_CARD_TABLE_CHECK);
								return E_IBX_CARD_TABLE_CHECK;
							}
						}
					}


					// Result
					system.setStatus(IBXSTATE_RESULT, 90);
					strBuff = StrGrab(strBuff, 'data":[', ']}', 2);
					this.log("strBuff 결과  " + countPages + ": [" + strBuff + "]");

					for (var i = 1; true; i++) {
						var item = StrGrab(strBuff, '{', '}', i);
						var subItem = {};

						if (item == "") { break; }
					
						subItem.승인일자 = StrReplace(StrGrab(item, '승인일자":"', '"'), '-', '').trim();
						subItem.승인시간 = StrReplace(StrGrab(item, '승인시간":"', '"'), ':', '').trim();
						if ((subItem.승인시간) && (subItem.승인시간.length == 4)) {
							subItem.승인시간 = subItem.승인시간 + '00';
						}
						subItem.승인번호 = StrGrab(item, '승인번호":"', '"').trim();
						subItem.카드종류 = '';
						subItem.회원사 = StrGrab(item, '회원사명":"', '"').trim();
						subItem.카드번호 = StrGrab(item, '카드번호":"', '"');
						subItem.카드번호 = StrReplace(subItem.카드번호, '-', '');
						subItem.카드번호 = StrReplace(subItem.카드번호, '*', '').trim();
						subItem.가맹점명 = StrGrab(item, '가맹점명":"', '"').trim();

						// 실제론 값이 있으나,
						// 로컬이랑 결과 맞추기 위해서 결과 처리 제외.
						subItem.매출종류 = StrGrab(item, '매출종류":"', '"');
						if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") < 0) {
							if ((subItem.매출종류).indexOf("일시불") > -1) {
								subItem.매출종류 = "1";
							} else if ((subItem.매출종류).indexOf("할부") > -1) {
								subItem.매출종류 = "2";
							} else if ((subItem.매출종류).indexOf("현금서비스") > -1) {
								subItem.매출종류 = "3";
							} else {
								subItem.매출종류 = "";
							}
						} else {
							subItem.매출종류 = '';
						}

						subItem.할부기간 = StrGrab(item, '할부기간":"', '"').trim();
						if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
							subItem.승인금액 = StrGrab(item, '거래금액(원화)":"', '"').trim();
							subItem.승인금액 = StrReplace(subItem.승인금액, ',', '');
						} else {
							subItem.승인금액 = StrGrab(item, '매입금액(원화)":"', '"').trim();
							subItem.승인금액 = StrReplace(subItem.승인금액, ',', '');
						}

						subItem.매입여부 = '';
						subItem.취소년월일 = "";
						subItem.부서명 = "";
						subItem.은행명 = "";

						if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
							subItem.가맹점사업자번호 = StrReplace(StrGrab(item, '가맹점사업자번호":"', '"'), '-', '');
							subItem.가맹점코드 = StrGrab(item, '가맹점번호":"', '"').trim();
							subItem.가맹점업종 = StrGrab(item, '가맹점업종":"', '"').trim();
						} else {
							subItem.가맹점사업자번호 = "";
							subItem.가맹점코드 = "";
							subItem.가맹점업종 = "";
						}

						if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
							subItem.통화코드 = "KRW";
							subItem.국내외구분 = "1";
						} else {
							subItem.통화코드 = "";
							subItem.국내외구분 = "2";
						}

						subItem.카드번호형식 = StrReplace(StrGrab(item, '카드번호":"', '"'), '-', '');
						subItem.카드번호형식 = this.AccountFormat(subItem.카드번호형식);

						if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") > -1) {
							subItem.가맹점전화번호 = StrTrim(StrReplace(StrReplace(StrReplace(StrGrab(item, '가맹점전화번호":"', '"'), '-', ''), '(', ''), ')', ''));
							subItem.가맹점주소 = StrTrim(StrGrab(item, '가맹점주소1":"', '"')) + ' ' + StrTrim(StrGrab(item, '가맹점주소2":"', '"'));
							subItem.가맹점대표자명 = StrGrab(item, '가맹점대표자명":"', '"').trim();
						} else {
							subItem.가맹점전화번호 = '';
							subItem.가맹점주소 = '';
							subItem.가맹점대표자명 = '';
						}

						subItem.매입일자 = StrReplace(StrGrab(item, '매입일자":"', '"'), '-', '');

						if (StrGrab(item, '국내외사용구분":"', '"').indexOf("국내") < 0) {
							subItem.승인금액_외화 = StrGrab(item, '승인금액(외화)":"', '"').trim();
							subItem.승인금액_외화 = StrReplace(subItem.승인금액_외화, ',', '');
							subItem.청구금액 = StrGrab(item, '청구금액":"', '"').trim();
							subItem.청구금액 = StrReplace(subItem.청구금액, ',', '');
							subItem.청구수수료 = StrGrab(item, '청구수수료":"', '"').trim();
							subItem.청구수수료 = StrReplace(subItem.청구수수료, ',', '');
							subItem.현지금액 = StrGrab(item, '거래금액(외화)":"', '"').trim();
							subItem.현지금액 = StrReplace(subItem.현지금액, ',', '');
							subItem.외화거래국가명 = StrGrab(item, '외화거래국가명":"', '"').trim();
							subItem.외화거래일환율 = '';
							subItem.외화거래국가코드 = StrGrab(item, '외화거래국가코드":"', '"').trim();
							subItem.외화거래도시명 = StrGrab(item, '외화거래도시명":"', '"').trim();
						} else {
							subItem.승인금액_외화 = '';
							subItem.청구금액 = '';
							subItem.청구수수료 = '';
							subItem.현지금액 = '';
							subItem.외화거래국가명 = '';
							subItem.외화거래일환율 = '';
							subItem.외화거래국가코드 = '';
							subItem.외화거래도시명 = '';
						}

						if (!IsCurrency(subItem.승인일자) || !IsCurrency(subItem.승인금액) ||
							!IsCurrency(subItem.매입일자) || !IsCurrency(subItem.카드번호)) {
							this.setError(E_IBX_CURRENCY_NOT_CONVERT);
							return E_IBX_CURRENCY_NOT_CONVERT;
						}

						이용내역조회[totCnt++] = subItem;
					}

					if (countPages >= Number(LastPageNo)) break;
				}
			}

			if (이용내역조회.length == 0) {
				this.setError(I_IBX_RESULT_NOTPRESENT);
				return I_IBX_RESULT_NOTPRESENT;
			}

		} catch (e) {
			this.log("exception " + e.message);
			this.setError(E_IBX_SITE_INVALID + 4);
			return E_IBX_SITE_INVALID + 4;
		}
		return S_IBX_OK;
	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 이용내역 finally");
	}
};

법인카드.prototype.로그아웃 = function (aInput) {
	this.log(BankName + " 로그아웃 호출[" + aInput + "]");

	try {
		system.setStatus(IBXSTATE_CHECKPARAM, 10);

		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);			
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		this.url = "/app/corp/LogoutActn.corp";
		this.HeaderUserAgent(1);
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		if (httpRequest.result.indexOf('<a href="/app/corp/ComLoginActn.corp">로그인</a>') < 0) {
			setError(E_IBX_SERVICE_LOGOUT_FAIL);
			return E_IBX_SERVICE_LOGOUT_FAIL;
		}

		this.bLogIn = false;

		httpRequest.clearCookie("bccard.com");
		this.log("로그아웃 S_IBK_OK");		

		// 결과 처리
		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		return S_IBX_OK;

	} catch (e) {
		//
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 로그아웃 finally");
	}
};

var 가맹점 = function () {
	//생성자
	console.log(BankName + " 개인카드 생성자 호출");
	this.host = "https://www.bccard.com";
	this.url = "";
	this.postData = "";
	this.userAgent = '';

};

가맹점.prototype = Object.create(iSASObject.prototype);

가맹점.prototype.가맹점번호조회 = function (aInput) {
	this.log(BankName + " 가맹점번호조회 호출");
	try {
		system.setStatus(IBXSTATE_CHECKPARAM, 10);

		var input = dec(aInput.Input);
		var 사업자등록번호 = input.사업자등록번호;		

		if (사업자등록번호) {
			if (typeof 사업자등록번호 != 'string'){
				this.setError(E_IBX_REGNO_COMPANY_INVALID);
				return E_IBX_REGNO_COMPANY_INVALID;
			}
			this.iSASInOut.Input.사업자등록번호 = input.사업자등록번호.replace(/./g, '*');
		} else {
			this.setError(E_IBX_REGNO_COMPANY_NOTENTER);
			return E_IBX_REGNO_COMPANY_NOTENTER;			
		}
		
		if (isNaN(사업자등록번호) || 사업자등록번호.length != 10){
			this.setError(E_IBX_REGNO_COMPANY_INVALID);
			return E_IBX_REGNO_COMPANY_INVALID;
		}

		system.setStatus(IBXSTATE_ENTER, 30);

		this.userAgent = '{"User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",';
		this.userAgent += '"Accept": "application/json, text/javascript, */*; q=0.01",';
		this.userAgent += '"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}';
		
		//고객센터 > 간편조회 > 가맹점 번호 조회
		this.url = '/app/merchant/StoreNoInqActn.do';
		
		this.postData = 'step='			+ '2';
		this.postData += '&nextKey='	+ '';
		this.postData += '&nextFlag='	+ 'true'; //false: hide addList(); true: showaddList();
		this.postData += '&result_size='+ '';
		this.postData += '&keyType='	+ '';
		this.postData += '&firstPageYN='+ 'Y';
		this.postData += '&bizregno1='	+ 사업자등록번호.substring(0, 3);
		this.postData += '&bizregno2='	+ 사업자등록번호.substring(3, 5);
		this.postData += '&bizregno3='	+ 사업자등록번호.substring(5, 10);

		if (!httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData)) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var ResultStr = httpRequest.result;
		this.log('ResultStr:[' + ResultStr + ']');

		if (ResultStr.indexOf('>죄송합니다<') >= 0 || ResultStr.indexOf('>전문 오류<') >= 0 ||
			ResultStr.indexOf('가맹점 정보가 없습니다') > -1){
			this.setError(E_IBX_REGNO_COMPANY_INVALID);
			return E_IBX_REGNO_COMPANY_INVALID;
		}

		ResultStr = StrReplace(ResultStr, "\\r", "");
        ResultStr = StrReplace(ResultStr, "\\t", "");
        ResultStr = StrReplace(ResultStr, "\\n", "");
        ResultStr = StrReplace(ResultStr, '\\"', '"');
		this.log("가맹점번호조회_결과: [" + ResultStr + "]");

		// Table of Result
		var resTable =  StrGrab(ResultStr, '<table', '/table>');
		var tHeader = StrGrab(resTable, '<thead>', '/thead>');
		if ((StrGrab(tHeader, '<th ', '/th>', 1).indexOf('가입일자') < -1) ||
			(StrGrab(tHeader, '<th ', '/th>', 2).indexOf('가맹점번호') < -1) ||
			(StrGrab(tHeader, '<th ', '/th>', 3).indexOf('가맹점명') < -1) ||
			(StrGrab(tHeader, '<th ', '/th>', 4).indexOf('해지일자') < -1)){			
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}
		resTable =  StrGrab(resTable, '<tbody', '/tbody>');
		if(resTable == ''){
			this.setError(E_IBX_SITE_INVALID + 1);
			return E_IBX_SITE_INVALID + 1;
		}
		this.log("resTable: [" + resTable + "]");

		system.setStatus(IBXSTATE_RESULT, 80);

		var 가맹점번호조회 = [];
		for (var i = 1; true; i++){

			var resRow = StrGrab(resTable, '<tr>', '/tr>', i);
			if(resRow == ''){break;}

			var item = {};

			item.가입일자 = StrTrim(StrGrab(StrGrab(resRow, '<td', '/td>', 1), '>', '<'));
			item.가입일자 = StrReplace(item.가입일자,'.','');
	
			item.가맹점번호 = StrTrim(StrGrab(StrGrab(resRow, '<td', '/td>', 2), '>', '<'));

			item.가맹점명 = StrTrim(StrGrab(StrGrab(resRow, '<td', '/td>', 3), '>', '<'));
			
			item.해지일자 = StrTrim(StrGrab(StrGrab(resRow, '<td', '/td>',4), '>', '<'));
			item.해지일자 = StrReplace(item.해지일자,'.','');

			item.가맹점종류 = '';
			item.가맹점소재지 = '';
			item.대표자명 = '';
			item.상태 =  '';
			item.법인여부 = '';

			if (isNaN(item.가맹점번호) || isNaN(item.가입일자)) {
				this.setError(E_IBX_RESULT_FAIL);
				return E_IBX_RESULT_FAIL;
			}

			가맹점번호조회.push(item);
		}
		
		if (가맹점번호조회.length == 0){
			this.setError(I_IBX_RESULT_NOTPRESENT);
			return I_IBX_RESULT_NOTPRESENT;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.가맹점번호조회 = 가맹점번호조회;

		return S_IBX_OK;
	} catch (e) {
		this.log("exception " + e.message);
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	}
	finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 가맹점번호조회 finally");
	}
};

///////////////////////////////////////////////////////////////////////////////////////////
//include 등등 필요한거 설정.
function OnInit() {
    console.log("OnInit()");
    try {
        //필요한거 로드
        system.include("iSASTypes");
        system.include("sas/sas");
        system.setStatus(IBXSTATE_BEGIN, 0);
    } catch (e) {
        console.log("Exception OnInit:[" + e.message + "]");
    } finally {
    }
}

function Execute(aInput) {
    console.log("Execute[" + aInput + "]");
    try {
        console.log("Init Default Error");
        iSASObj = JSON.parse(aInput);
        iSASObj.Output = {};
        iSASObj.Output.ErrorCode = '8000F110';
        iSASObj.Output.ErrorMessage = "해당 모듈을 실행하는데 실패 했습니다.";

        OnInit();

        iSASObj = JSON.parse(aInput);
        var ClassName = iSASObj.Class;
        var ModuleName = iSASObj.Module;
        if (Failed(SetClassName(ClassName, ModuleName))) {
            iSASObj.Output = {};
            iSASObj.Output.ErrorCode = E_IBX_FAILTOSETCLASS.toString(16).toUpperCase(); // or '800033E0';
            iSASObj.Output.ErrorMessage = "Class명과 Job명을 확인해주시기 바랍니다.";
        } else {
            obj.iSASInOut = "";
            OnExcute(0, JSON.stringify(iSASObj));

            console.log("결과 테스트 [" + obj.iSASInOut + "]");

            if (obj.iSASInOut != "")
                iSASObj = obj.iSASInOut;
        }
    } catch (e) {
        console.log("exception:[" + e.message + "]");
    } finally {
        return JSON.stringify(iSASObj);
    }
}
/* jshint +W061, +W004 */