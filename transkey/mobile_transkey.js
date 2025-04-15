
//config
var transkey_url='/raonnx/transkey_mobile';
var transkey_surl ='/transkeyServlet.do';
var transkey_encDelimiter = ",";
var keyboardLayouts = ["qwertyMobile", "numberMobile"];

var transkey=[];
var mtk=null;
var tk_btn_arr=[];

function log(logMsg){
	console.log("iSASObject.Log(" + logMsg + "\")");
}

function initmTranskey(){
	setMaxDigits(131);
	transkey.objs= new Array();
	mtk = new mTranskey();
	this.transSessionKey = function(){
		return mtk.generateSessionKey(transkey_surl);
	}
}

function mTranskeyObj(id){

	this.id= (id?id:"jumin_2_3"); // 주민번호 7뒷자리
	this.name=(id?id:"jumin_2_3"); // 주민번호 7뒷자리
	this.keyboardType = "numberMobile"; // 주민번호 입력부분만 적용하니 numberMobile 고정으로 세팅
	this.keyTypeIndex=""; // "l ","u ",""
	this.keyType="single";
	this.useTranskey=true;
	this.fieldType="password";
	this.allocationIndex = new GenKey().tk_getrnd_int();
	
	this.allocation = function(){
		return getUrlPost("allocation", this, "");
	};
	this.dummy;

	this.setUrl = function(dummy){
		if(dummy!=null)
			this.dummy=dummy;

		var url = getUrl("getKey", this, "single", this.dummy);
		return url;
	};

	function getUrl(op, o, keyType, dummy){
		return "op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboardType+"&fieldType="
		+o.fieldType+"&inputName="+o.name+"&transkeyUuid="+mtk.transkeyUuid+"&TK_requestToken="+ mtk.TK_requestToken+"&dummy="+o.dummy;
	}
	
	function getUrlPost(op, o, keyType, dummy){
		return "op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboardType+"&fieldType="
		+o.fieldType+"&inputName="+o.name+"&transkeyUuid="+mtk.transkeyUuid+"&TK_requestToken="+mtk.TK_requestToken+"&dummy="+dummy +"&talkBack=true";
	}
	
}

function mTranskey(){

	var sessionKey = [, , , , , , , , , , , , , , , ];
	var genKey = new GenKey();
	var useCert = "true";
	// var cert_pub = "-----BEGIN CERTIFICATE-----MIIDYDCCAkigAwIBAgIJAO4t+//wr+aDMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTIwMDEyODAxMjYwMloXDTQwMDEyMzAxMjYwMlowXDELMAkGA1UEBhMCS1IxEjAQBgNVBAoMCWFwcGx5aG9tZTE5MDcGA1UEAwwwVD1QJkQ9RTM2RjM4NzY1MjA3MEIxQTI2RkQ5MkJFRTZFRDIwMzlDNzBDNzg1RSZoMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zFrOPvL9qXdeG6GUnd/ZEAEG1iIZw5riHHOyDMTignCOjEkptikb0NLuX+acwzLQ1jusCPaZcWLeDARVBfmRxPUnaafFw2mE7v7oJYB67DRmN5+ULCDMppPDH28ZcUGaajX39HtWc2OHbxT0obTEFd1PtvL7zCrcUKhPSky8vZAjoPvKwp0ZFb9Bc8DU8SO6HMLqXOaENTsIESUlOI9Igp2otx1kjmLjzc7Ns6EwPHesWkugu9MGPVSn7QztAegRk97/GUrW5yM0y8saCshFhrAGR1S2YMoxSAOmFuylZ/1/bj4Fw0GYUJwAoRzZfsiKNhpznOE+kgfjrTQ8gYGYQIDAQABoxowGDAJBgNVHRMEAjAAMAsGA1UdDwQEAwIF4DANBgkqhkiG9w0BAQsFAAOCAQEAIZhSrmK0jbY5WgIz9EhH2mszo7Xm9H6bXLu4NNdaJzzZC+5hzcn51AcOpx4s2jXJNLEOv8g8uCb5HDGFofSYU3cKDssGBsjUZPBB7X8Ikt0x5UqyvzZAji8FCqxZQW/o0fmARVTuqFra+ZIhPm6Hsf3jHQk0qB+685XOMxd30JVTuf/eN/Wk6MYH2gFxXDCF+R8bIdBF5+P+A9GZOM2ikSIuC8o5cIHQNJ4SSReu2vZQEj+mXV9cyoD6bpbMfVNYsNbeZsvtf/2CRewJUIx9DzMA6Xby57OhtD4kcEYGhnEdvTBxl0BhWwnn+20GBp77/WCx9bdQIwl50JIyUCKlrg==-----END CERTIFICATE-----";
	this.cert_pub = "";
	var cert_ca = "-----BEGIN CERTIFICATE-----MIIEHjCCAwagAwIBAgIJALcMNEp1tPYgMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTEzMDIwNzA5MDYyNVoXDTQzMDEzMTA5MDYyNVowZzELMAkGA1UEBhMCS1IxHTAbBgNVBAoTFFJhb25TZWN1cmUgQ28uLCBMdGQuMRowGAYDVQQLExFRdWFsaXR5IEFzc3VyYW5jZTEdMBsGA1UEAxMUUmFvblNlY3VyZSBDby4sIEx0ZC4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCqB0MsUuAi7pWVmRWaCS7kAactycMghmOM7RiMbmXyHmatXJbrtOlNrGH8Xl4fdkCJjyUE2829zQy+lTJ2O3Uo3Nn7zK3+3Um9nDQXN2tapambthOXs0aHjnRCtuLMOSPlAx06o0yHP1nOGaV7hfY9PyJjIVh9Lk/oFp5A+wsi0wiQ+INMDrm/6xZrooEY7/TLMnE4v+nr+cpIf3hSrvI1gGTykFtGCy2Le1huqaTKkE9K0CF/Sd8Kvebj6R+MhlieDXiMZXZD++pRmd4cAmGAmnGn4YdJMyh16TCccPjT60KkMv84uNVjXBvnar8ZlzRQSgIhwp1KkRiMErMbVWCnAgMBAAGjgcwwgckwHQYDVR0OBBYEFPzIDKwqK4PCklaP6Mq4YXdq8McyMIGZBgNVHSMEgZEwgY6AFPzIDKwqK4PCklaP6Mq4YXdq8McyoWukaTBnMQswCQYDVQQGEwJLUjEdMBsGA1UEChMUUmFvblNlY3VyZSBDby4sIEx0ZC4xGjAYBgNVBAsTEVF1YWxpdHkgQXNzdXJhbmNlMR0wGwYDVQQDExRSYW9uU2VjdXJlIENvLiwgTHRkLoIJALcMNEp1tPYgMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAHBRlEB4nu/gHwVFRzqbFOloR7aB0xIaMDykMWtovXHUQcTmmGyYQn0bMWaGVCD7SgRh1FisfciJzLP7f8OI5f7rA2tiBZD1PBtLMU7MytGIYlV/gcfWPbnqBVsKDm15AEUqH7ZahOm7np4d5Fr87r1bj2baXQPKSNd9yjh89fl6LthWLEQRYKKwhPYAA/QkeB2RE9MftmuOXJ6MnYyyx5xEZK2ofqwrRBvDmV/PjwdCSxhloiJVFHrp8lKPCsZywJ3v9IPpudjgBQ7SWqhDcPNo2diGB2dQ252g36K1H7u3aT9Xha33MFQXTTEDzVDhaXzaGk7X6T9v25dsOyOaLAo=-----END CERTIFICATE-----";

	rng = new SecureRandom();
	var mKey = new Array();
	mKey["qwertyMobile"] = null;
	mKey["numberMobile"] = null;

	this.now = null;
	this.transkeyUuid;
	this.TK_requestToken="";
	this.encrypted = "";

	var genSessionKey = "";
	
	this.getPKey = function(){
		var pKey = _x509_getPublicKeyHexArrayFromCertPEM(this.cert_pub);
		var PKey = new Array();

		PKey["n"] = pKey[0];
		PKey["k"] = 256; // length of n in bytes
		PKey["e"] = pKey[1];
		
		return PKey;
	};
	
	this.getCertPublicKey = function(){	
		return encodeURIComponent(this.crtPublicKey);
	};
	
	this.generateSessionKey = function(url) {
		
		// if(genSessionKey.length>0)
		// 	return true;
		
		// var vCA =  verifyCA();		
		// if( vCA == false || vCA =="expired"){
		// 	if(vCA==false)
		// 		alert("transkey : CA 검증이 실패 하였습니다. 프로그램이 정상작동 하지 않을 수 있습니다.");
		// 	return false;
		// }
		
		var pKey = _x509_getPublicKeyHexArrayFromCertPEM(this.cert_pub);
		var n = pKey[0];
		var k = 256; // length of n in bytes
		var e = pKey[1];
		
		this.transkeyUuid = genKey.tk_sh1prng();

		genSessionKey = genKey.GenerateKey(128);		
		for(var i=0; i<16; i++)	{
			sessionKey[i] = Number("0x0" + genSessionKey.charAt(i));
		}

		var encSessionKey = mtk.phpbb_encrypt2048(genSessionKey, k, e, n);		
		var operation = "setSessionKey";

		return ("op=" + operation + "&key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+"&TK_requestToken="+mtk.TK_requestToken+ "&mode=Mobile");
	};

	this.fillEncData = function(jumin2_encrypted){
		var valueLen = 7;
		var maxSize  = valueLen+genKey.tk_getrnd_int()%10;			
		
		var geo = "d 0 0";
		var hm_jumin2_encrypted; 
		console.log("jumin2_encrypted: ["+ jumin2_encrypted +"]");
		
		log("fillEncData maxSize: [" + maxSize + "]");
		for(var j=valueLen; j<maxSize; j++){	
			var encrypted = SeedEnc(geo);
			jumin2_encrypted += "$" + encrypted;
		}		
		hm_jumin2_encrypted = CryptoJS.HmacSHA256(jumin2_encrypted, genSessionKey);

		var sshObj = {};
		sshObj.jumin_2_3_encrypted    = jumin2_encrypted;
		sshObj.hm_jumin_2_3_encrypted = hm_jumin2_encrypted;
		return sshObj;
	};

	this.getEncData = function(x, y){
		var geo = "" + x + " " + y;
		return SeedEnc(geo);
	};

	this.getKey = function(type) {

		if(type == null || type == undefined){
			type = "numberMobile";
		}
		
		return mKey[type];
	};
	
	this.setMKey = function(str){
		if(str == null || str == undefined){
			return;
		}
		
		eval(StrGrab(str, '<!--', '//-->'));
		mKey["qwertyMobile"] = qwertyMobile;
		mKey["numberMobile"] = numberMobile;
	};
	
    function getRandomValue(range) {
       var ramdomNum = new GenKey().tk_getrnd_int() % range;
        return ramdomNum;
	}
	
	function SeedEnc(geo) {	
		var iv = [0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x4b, 0x65, 0x79, 0x31, 0x30];	// "MobileTransKey10"	  
		var inData = new Array(16);
		var outData = new Array(16);
		var roundKey = new Array(32);
	  
		for(var i=0; i<geo.length; i++)
		{			
			if(geo.charAt(i) == "l" || geo.charAt(i) == "u" || geo.charAt(i) == "s" || geo.charAt(i) == "d")
			{
				inData[i] = Number(geo.charCodeAt(i));
				continue;
			}
			else if(geo.charAt(i) == " ")
			{ 
				inData[i] = Number(geo.charCodeAt(i));
				continue;
			}
			inData[i] = Number(geo.charAt(i).toString(16));
		}
		inData[geo.length] = 32;		//" "
		inData[geo.length + 1] = 101;	//e
		var rndInt = genKey.tk_getrnd_int();
		inData[geo.length + 2] = rndInt % 100;

		Seed.SeedSetKey(roundKey, sessionKey);
		Seed.SeedEncryptCbc(roundKey, iv, inData, 16, outData);

		var encodedData = new Array(16);
		var encodedDataString = "";
		for(var i=0; i<16; i++)
		{
			if(transkey_encDelimiter == null)
				encodedData[i] = Number(outData[i]).toString(16);
			else
				encodedDataString += Number(outData[i]).toString(16)+transkey_encDelimiter;
		}

		if(transkey_encDelimiter == null)
			return encodedData;
		else
			return encodedDataString.substring(0, encodedDataString.length-1);
	}
	
	function Key() {
		this.name = "";
		
		this.npoints = 0;
		this.xpoints = new Array();
		this.ypoints = new Array();
		
		this.addPoint = function(x, y) {
			this.npoints++;
			this.xpoints.push(x);
			this.ypoints.push(y);
		};
		
		this.contains = function(x, y) {
			var startx = this.xpoints[0];
			var starty = this.ypoints[0];
			
			var endx = this.xpoints[2];
			var endy = this.ypoints[2];
			
			if ( startx < x && starty < y )
			{
				if ( endx > x && endy > y )
				{
					return 1;
				}
			}
			
			return 0;
		};
	}

	function pack(source)
	{
	   var temp = "";
	   for (var i = 0; i < source.length; i+=2)
	   {
	      temp+= String.fromCharCode(parseInt(source.substring(i, i + 2), 16));
	   }
	   return temp;
	}

	function char2hex(source)
	{
	   var hex = "";
	   for (var i = 0; i < source.length; i+=1)
	   {
	      temp = source[i].toString(16);
	      switch (temp.length)
	      {
	         case 1:
	            temp = "0" + temp;
	            break;
	         case 0:
	           temp = "00";
	      }
	      hex+= temp;
	   }
	   return hex;
	}

	function xor(a, b)
	{
	   var length = Math.min(a.length, b.length);
	   var temp = "";
	   for (var i = 0; i < length; i++)
	   {
	      temp+= String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
	   }
	   length = Math.max(a.length, b.length) - length;
	   for (var i = 0; i < length; i++)
	   {
	      temp+= "\x00";
	   }
	   return temp;
	}

	function mgf1(mgfSeed, maskLen)
	{
	   var t = "";
	   var hLen = 20;
	   var count = Math.ceil(maskLen / hLen);
	   for (var i = 0; i < count; i++)
	   {
	      var c = String.fromCharCode((i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF);
	      t+= pack(sha1Hash(mgfSeed + c));
	   }

	   return t.substring(0, maskLen);
	}

	function xorb(a, b) {
		var length = Math.min(a.length, b.length);
		var temp = "";
		for (var i = 0; i < length; i++) {
			temp += String.fromCharCode(a[i] ^ b[i]);
		}
		length = Math.max(a.length, b.length) - length;
		for (var i = 0; i < length; i++) {
			temp += "\x00";
		}
		return temp;
	}
	
	
	function strtobin(a) {
		var ret=new Uint8Array(a.length);
		
		for (var i = 0; i < a.length; i++) 
		{
			ret[i]= a.charCodeAt(i);
		}
		
		return ret;
	}
	
	function bytecopy(input,start,end) {
		
		var k = new Array(end-start); 
		for (var i = start,j=0; i < end; i++,j++) {
			k[j]=input[i];
		}
		return k;
		
	}
	
	function clear(input) {
		for (var i = 0; i < input.length; i++) {
			input[i]=0;
		}
	}
	
	this.rsaes_oaep_decrypt_key=function(m,d,n)
	{
		var _0x281f=["\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x6C\x65\x6E\x67\x74\x68","\x72\x73\x61\x65\x73\x5F\x6F\x61\x65\x70\x5F\x64\x65\x63\x72\x79\x70\x74","","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74"];var m=b64tohex(m);encoded_rsa= m[_0x281f[0]](0,512);encoded_enc= m[_0x281f[0]](512,m[_0x281f[1]]);d= this[_0x281f[2]](encoded_rsa,d,n);var k= new Array(16);var iv= new Array(16);for(var i=0;i< 16;i++){k[i]= d[i]};for(var i=16,j=0;i< 32;i++,j++){iv[j]= d[i]};var roundKey= new Array(32);Seed.SeedSetKey(roundKey,k);encoded_byte= makeHexToArrayByte(encoded_enc);var outData= new Array(encoded_byte[_0x281f[1]]);Seed.SeedDecryptCbc(roundKey,iv,encoded_byte,encoded_byte[_0x281f[1]],outData);dec= _0x281f[3];for(var i=0;i< outData[_0x281f[1]];i++){if(outData[i]== 0){break};dec+= String[_0x281f[4]](outData[i])};decBin=  new Array(dec[_0x281f[1]]);for(var i=0;i< dec[_0x281f[1]];i++){decBin[i]= dec[_0x281f[5]](i)};base64= char2Base64(decBin);clear(k);clear(iv);clear(decBin);return base64;
		
	};
	
	this.rsaes_oaep_decrypt = function(m, d, n) {
		
		var _0x2604=["\x30\x31\x30\x30\x30\x31","\x6D\x6F\x64\x50\x6F\x77","","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x6C\x65\x6E\x67\x74\x68","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74"];var _e= new BigInteger(_0x2604[0],16);var _d= new BigInteger(d,16);var _n= new BigInteger(n,16);mb=  new BigInteger(m,16);c= mb[_0x2604[1]](_d,_n);c= c.toString(16);EM= makeHexToArrayByte(c);maskedDB= _0x2604[2];maskedSeed= _0x2604[2];for(var i=0;i< 20;i++){maskedSeed+= String[_0x2604[3]](EM[i])};for(var i=0;i< EM[_0x2604[4]]- 20;i++){maskedDB+= String[_0x2604[3]](EM[20+ i])};seedMask= mgf1(maskedDB,20);seedMask1= strtobin(seedMask);seed= xor(maskedSeed,seedMask);seed1= strtobin(seed);dbMask= mgf1(seed,maskedDB[_0x2604[4]]);dbMask1= strtobin(dbMask);DB= xor(maskedDB,dbMask);DB1= strtobin(DB);var i=0;for(i= 20;i< DB[_0x2604[4]];i++){if(DB[_0x2604[5]](i)== 0x01){break}};i++;M=  new Uint8Array(DB[_0x2604[4]]- i);for(var j=0;j< DB[_0x2604[4]]- i;j++){M[j]= DB[_0x2604[5]](i+ j)};d= _0x2604[2];n= _0x2604[2];return M;

	};
	
	function rsaes_oaep_encrypt(m, n, k, e)
	{
	   var hLen = 20;
	   var mLen = m.length;
	   if (mLen > k - 2 * hLen - 2)
	   {
	   	//alert("too long");
	   }

	   var lHash = "\xda\x39\xa3\xee\x5e\x6b\x4b\x0d\x32\x55\xbf\xef\x95\x60\x18\x90\xaf\xd8\x07\x09"; // pack(sha1Hash(""))

	   var ps = "";
	   var temp = k - mLen - 2 * hLen - 2;
	   for (var i = 0; i < temp; i++)
	   {
	      ps+= "\x00";
	   }

	   var db = lHash + ps + "\x01" + m;
	   var seed = "";
	   for (var i = 0; i < hLen + 4; i+=4)
	   {
	      temp = new Array(4);
	      rng.nextBytes(temp);
	      seed+= String.fromCharCode(temp[0], temp[1], temp[2], temp[3]);
	   }
	   seed = seed.substring(4 - seed.length % 4);
	   var dbMask = mgf1(seed, k - hLen - 1);
	   var maskedDB = xor(db, dbMask);
	   var seedMask = mgf1(maskedDB, hLen);
	   var maskedSeed = xor(seed, seedMask);
	   var em = "\x00" + maskedSeed + maskedDB;

	   m = new Array();
	   for (i = 0; i < em.length; i++)
	   {
	      m[i] = em.charCodeAt(i);
	   }
	   m = new BigInteger(m, 256);
	   c = m.modPow(e, n);
	   c = c.toString(16);
	   if (c.length & 1)
	   {
	      c = "0" + c;
	   }

	   return c;
	}

	function pkcs7pad(plaintext)
	{
	   var pad = 16 - (plaintext.length & 15);
	   for (var i = 0; i < pad; i++)
	   {
	      plaintext+= String.fromCharCode(pad);
	   }
	   return plaintext;
	}

	function aes_encrypt(plaintext, key, iv)
	{
	   var ciphertext = new Array();
	   plaintext = pkcs7pad(plaintext);
	   key = new keyExpansion(key);
	   for (var i = 0; i < plaintext.length; i+=16)
	   {
	      var block = new Array(16);
	      for (var j = 0; j < 16; j++)
	      {
	         block[j] = plaintext.charCodeAt(i + j) ^ iv[j];
	      }
	      block = AESencrypt(block, key);
	      for (var j = 0; j < 16; j++)
	      {
	         iv[j] = block[j];
	      }
	      ciphertext = ciphertext.concat(block);
	   }
	   return ciphertext;
	}

	function phpbb_encrypt1024(plaintext)
	{
	   var temp = new Array(32);
	   rng.nextBytes(temp);
	   var iv = temp.slice(0, 16);
	   var key = "";
	   for (var i = 16; i < 32; i++) // eg. temp.slice(16, 32)
	   {
	      key+= String.fromCharCode(temp[i]);
	   }

	   var n = new BigInteger("00a52ebc98a9583a90b14d34c009d436996b590561224dd1f41bd262f17dbb70f0fe9d289e60a3c31f1f70a193ad93f0a77e9a491e91de9f9a7f1197d1ffadf6814b3e46d77903a8f687849662528cdc3ea5c7c8f3bdf8fb8d118f01441ce317bb969d8d35119d2d28c8c07cbcfb28919387bd8ee67174fb1c0b2d6b87dfa73f35", 16);
	   var k = 128; // length of n in bytes
	   var e = new BigInteger("010001", 16);

	   frm1.key1.value = rsaes_oaep_encrypt(plaintext, n, k, e);
	   frm1.iv1.value = char2hex(iv);
	   frm1.data1.value = char2hex(aes_encrypt(plaintext, key, iv));
	}


	this.phpbb_encrypt2048 = function(plaintext, k, e, n)
	{
	   var temp = new Array(32);
	   rng.nextBytes(temp);
	   var key = "";
	   for (var i = 16; i < 32; i++) // eg. temp.slice(16, 32)
	   {
	      key+= String.fromCharCode(temp[i]);
	   }

	   var _e = new BigInteger(e, 16);
	   var _n = new BigInteger(n, 16);
	   
	   var _rsaoen = "";
	   
	   while(_rsaoen.length<512){
			_rsaoen = rsaes_oaep_encrypt(plaintext, _n, k, _e);
			if(_rsaoen.length>511)
				break;
	   }
	   
	   return _rsaoen;
	};

	function makeHexToArrayByte(hexString)
	{
		var len = hexString.length/2;
		var result = Array(len);
		for (var i = 0; i < len; i++)
		result[i] = parseInt(hexString.substring(2*i, 2*i+2),16);
		return result;
	}

	function getTodayDate(){
		 var _date  = new Date();
		 var _year  = "" + _date.getFullYear();
		 var _month = "" + (_date.getMonth() + 1);
		 var _day   = "" + _date.getDate();

		 if( _month.length == 1 ) _month = "0" + _month;
		 if( ( _day.length ) == 1 ) _day = "0" + _day;

		 var tmp = "" + _year.substring(2, 4) + _month + _day;
		 return tmp;
	}
	
	// function verifyCA() 
	// {
	// 	var x509_pub = new X509();
	// 	x509_pub.readCertPEM(cert_pub);

	// 	var Signature = x509_pub.getSignature();
	// 	var CertInfo = x509_pub.getCertInfo();
	// 	var abCertInfo = CryptoJS.enc.Hex.parse(CertInfo);
	// 	var abHash =  CryptoJS.SHA256(abCertInfo).toString();
		
	// 	var x509_ca = new X509();
	// 	x509_ca.readCertPEM(cert_ca);

	// 	var isValid = x509_ca.subjectPublicKeyRSA.verifyString(abHash, Signature);
	// 	if (isValid) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }
}


function tk_contains(parent, child, deep){
    if (parent == child)
          return true;

    var items = parent.children;
    var count = items.length;

    for ( var i = 0; i < count; i++) {
          if (items[i] == child)
                 return true;
          if (deep == true && tk_contains(items[i], child, deep))
                 return true;
    }
    return false;
}
