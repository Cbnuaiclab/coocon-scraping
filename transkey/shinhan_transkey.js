
//config
var transkey_url = '/sw/TouchEn/transkey';
var transkey_surl ='/serviceEndpoint/transkeyServlet';
var transkey_apiurl ='/transkey/api/';
var transkey_encDelimiter = ",";
var transkey_delimiter = '$';
var keyboardLayouts = ["qwerty", "number"];
var limitTime = "";
var encSessionKey = "";

var transkey = [];
var tk = null;
var tk_btn_arr = [];

function log(logMsg){
	console.log("iSASObject.Log(" + logMsg + "\")");
}

function initTranskey(){
	setMaxDigits(131);
	transkey.objs= new Array();
	tk = new Transkey();
	this.transSessionKey = function(operation){
		return tk.generateSessionKey(transkey_surl, operation);
	}
}

function TranskeyObj(id, name){

	this.id = id; // 암호화 필드
	this.name = (!name?id: name);
	this.keyboardType = "number"; // 주민번호 입력부분만 적용하니 numberMobile 고정으로 세팅
	this.keyTypeIndex = ""; // "l ","u ",""
	this.keyType = "single";
	this.useTranskey = true;
	this.fieldType = "password";
	this.allocationIndex = new GenKey().tk_getrnd_int();
	this.initTime = tk.initTime;
	this.keyIndex = tk.keyIndex;
	
	this.allocation = function(op){
		return getUrlPost(op, this, "single");
	};
	this.dummy;

	this.setUrl = function(op, dummy){
		if(dummy!=null)
			this.dummy=dummy;

		var url = getUrl(op, this, "single", this.dummy);
		return url;
	};

	function getUrl(op, o, keyType, dummy){

		return "op="			+ op
		+ "&name="				+ o.id
		+ "&keyType=" 			+ keyType
		+ "&keyboardType="		+ o.keyboardType
		+ "&fieldType="			+ o.fieldType
		+ "&inputName="			+ o.name
		+ "&parentKeyboard="	+ "false"
		+ "&transkeyUuid="		+ tk.transkeyUuid
		+ "&exE2E="				+ "false"
		+ "&TK_requestToken=" 	+ tk.TK_requestToken
		+ "&isCrt="				+ "false"
		+ "&allocationIndex="	+ o.allocationIndex
		+ "&keyIndex="			+ tk.keyIndex
		+ "&initTime="			+ tk.initTime
		+ "&talkBack="			+ "true"
		;
	}
	
	function getUrlPost(op, o, keyType, dummy){

		return "op="			+ op
		+ "&name="				+ o.id
		+ "&keyType=" 			+ keyType
		+ "&keyboardType="		+ o.keyboardType
		+ "&fieldType="			+ o.fieldType
		+ "&inputName="			+ o.name
		+ "&parentKeyboard="	+ "false"
		+ "&transkeyUuid="		+ tk.transkeyUuid
		+ "&exE2E="				+ "false"
		+ "&TK_requestToken=" 	+ tk.TK_requestToken
		+ "&isCrt="				+ "false"
		+ "&allocationIndex="	+ o.allocationIndex
		+ "&keyIndex="			+ tk.keyIndex
		+ "&initTime="			+ tk.initTime
		+ "&talkBack="			+ "true"
		;
	}	
}

function Transkey(){

	var sessionKey = [, , , , , , , , , , , , , , , ];
	var genKey = new GenKey();
	var genSessionKey = "";
	var useCert = "true";
	var cert_pub = "-----BEGIN CERTIFICATE-----MIIDXjCCAkagAwIBAgIJAO4t+//wr+k9MA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTIyMDkyMTAxNTYxMFoXDTQyMDkxNjAxNTYxMFowWjELMAkGA1UEBhMCS1IxEDAOBgNVBAoMB3NoaW5oYW4xOTA3BgNVBAMMMFQ9UCZEPTVCMjU5MjdDMDZGMDgyQjRBNDZFQTVFRjNGNDFCQ0ZEOEVGRkE0RDMmaDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKfHrAZXULtXwhmOX2YdfJxGlYH+7/vqEZ6ogDutA13ubiN6hPAuStzDEQWoW62OUzg1NGSH3+MZtrBsyIvX1RGFDaxnojVgL64yCtw0OQ4Ineq73IMiybmbK0Hctu6E3TkUQBy3IsUL7fnn/Wat8Rhq61pXOInNug716FRcBS7w2E5caHmwLdmj01jq/prm/+hLSGCrMqOVkSTe0DHUnTBeDQNi3uvUPXvzfMswcnofAKNHfGwqxoH6iIS+/qq96gjaJG3+hnU2FsHHNnrzYtOodGIcddFYBdUcJuaDd66ru3eMWmy+q++9i7E8E8bCr2jX9WeiYKSA1xyJXigcT88CAwEAAaMaMBgwCQYDVR0TBAIwADALBgNVHQ8EBAMCBeAwDQYJKoZIhvcNAQELBQADggEBAJ9LKj1EJvAh60leifSSAcwljKPX2lNCKqRhy60+A32iO/AujB8ednP8PWsBfTz5QbiuFegE6AxsIJPJldVs80/Unp8Vm2X7LqMNACLPsLpIW8WiAe83X7cLh5yKiLxvFl7A9lrW2TCXtILB4JLY3ZnHA2a72eLA4tjWzWIz47te+DdRAs4WvEMEfPO+6ho1v2qVGEBaaXBs4DAnnKM8NjhI4/vOEddQzJI+TgC8+ny/ecRmkUNAsxE7KOQUEApLYIl5s6rNlQiV07UGV72FxNOvFJ7IW/MM2BGySlkEbc/4be2EpLpBipqhKnr/hLFCKNCrx8BFoo7rZHRLr6aysFk=-----END CERTIFICATE-----";
	var cert_ca = "-----BEGIN CERTIFICATE-----MIIEHjCCAwagAwIBAgIJALcMNEp1tPYgMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTEzMDIwNzA5MDYyNVoXDTQzMDEzMTA5MDYyNVowZzELMAkGA1UEBhMCS1IxHTAbBgNVBAoTFFJhb25TZWN1cmUgQ28uLCBMdGQuMRowGAYDVQQLExFRdWFsaXR5IEFzc3VyYW5jZTEdMBsGA1UEAxMUUmFvblNlY3VyZSBDby4sIEx0ZC4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCqB0MsUuAi7pWVmRWaCS7kAactycMghmOM7RiMbmXyHmatXJbrtOlNrGH8Xl4fdkCJjyUE2829zQy+lTJ2O3Uo3Nn7zK3+3Um9nDQXN2tapambthOXs0aHjnRCtuLMOSPlAx06o0yHP1nOGaV7hfY9PyJjIVh9Lk/oFp5A+wsi0wiQ+INMDrm/6xZrooEY7/TLMnE4v+nr+cpIf3hSrvI1gGTykFtGCy2Le1huqaTKkE9K0CF/Sd8Kvebj6R+MhlieDXiMZXZD++pRmd4cAmGAmnGn4YdJMyh16TCccPjT60KkMv84uNVjXBvnar8ZlzRQSgIhwp1KkRiMErMbVWCnAgMBAAGjgcwwgckwHQYDVR0OBBYEFPzIDKwqK4PCklaP6Mq4YXdq8McyMIGZBgNVHSMEgZEwgY6AFPzIDKwqK4PCklaP6Mq4YXdq8McyoWukaTBnMQswCQYDVQQGEwJLUjEdMBsGA1UEChMUUmFvblNlY3VyZSBDby4sIEx0ZC4xGjAYBgNVBAsTEVF1YWxpdHkgQXNzdXJhbmNlMR0wGwYDVQQDExRSYW9uU2VjdXJlIENvLiwgTHRkLoIJALcMNEp1tPYgMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAHBRlEB4nu/gHwVFRzqbFOloR7aB0xIaMDykMWtovXHUQcTmmGyYQn0bMWaGVCD7SgRh1FisfciJzLP7f8OI5f7rA2tiBZD1PBtLMU7MytGIYlV/gcfWPbnqBVsKDm15AEUqH7ZahOm7np4d5Fr87r1bj2baXQPKSNd9yjh89fl6LthWLEQRYKKwhPYAA/QkeB2RE9MftmuOXJ6MnYyyx5xEZK2ofqwrRBvDmV/PjwdCSxhloiJVFHrp8lKPCsZywJ3v9IPpudjgBQ7SWqhDcPNo2diGB2dQ252g36K1H7u3aT9Xha33MFQXTTEDzVDhaXzaGk7X6T9v25dsOyOaLAo=-----END CERTIFICATE-----";

	rng = new SecureRandom();
	var mKey = new Array();
	mKey["qwerty"] = null;
	mKey["number"] = null;

	this.now = null;
	this.transkeyUuid = "";
	this.cert_pub = "";
	this.TK_requestToken = "";
	this.initTime = "";
	this.limitTime = "0";
	this.useSession = false;
	this.useGenKey = false;
	this.java_ver = 1.8; // defaule
	this.encrypted = "";
	this.keyIndex = "";
	this.crtPublicKey = "";

	this.getPKey = function(){

		// cert_pub 따로 설정인 경우
		if (tk.cert_pub){
			cert_pub = tk.cert_pub;
			cert_pub = StrReplace(cert_pub, '-----BEGIN CERTIFICATE-----', '');
			cert_pub = StrReplace(cert_pub, '-----END CERTIFICATE-----', '');
			cert_pub = '-----BEGIN CERTIFICATE-----' + cert_pub + '-----END CERTIFICATE-----';
		}

		var pKey = _x509_getPublicKeyHexArrayFromCertPEM(cert_pub);
		var PKey = new Array();

		PKey["n"] = pKey[0];
		PKey["k"] = 256; // length of n in bytes
		PKey["e"] = pKey[1];
		
		return PKey;
	};
	
	this.getCertPublicKey = function(){	
		return encodeURIComponent(this.crtPublicKey);
	};
	
	this.generateSessionKey = function(url, oper) {
		// if(genSessionKey.length>0)
		// 	return true;

		// var vCA =  verifyCA();		
		// if( vCA == false || vCA =="expired"){
		// 	if(vCA==false)
		// 		alert("transkey : CA 검증이 실패 하였습니다. 프로그램이 정상작동 하지 않을 수 있습니다.");
		// 	return false;
		// }

		var pKey = _x509_getPublicKeyHexArrayFromCertPEM(cert_pub);
		var PKey = new Array();

		PKey["n"] = pKey[0];
		PKey["k"] = 256; // length of n in bytes
		PKey["e"] = pKey[1];
		
		this.transkeyUuid = genKey.tk_sh1prng();

		genSessionKey = genKey.GenerateKey(128);	
		for(var i=0; i<16; i++)	{
			sessionKey[i] = Number("0x0" + genSessionKey.charAt(i));
		}

		encSessionKey = this.phpbb_encrypt2048(genSessionKey, PKey.k, PKey.e, PKey.n);
		var operation = "setSessionKey";
		if (oper) operation = oper;

		return ("op=" + operation + "&key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+"&TK_requestToken="+tk.TK_requestToken+ "&mode=common");
	};

	this.fillEncData = function(hiddenEnc){
		var valueLen = 6;
		var maxSize  = valueLen + genKey.tk_getrnd_int()%10;			

		var geo = "d 0 0";
		var HM; 
		for(var j = valueLen; j<maxSize; j++){	
			var encrypted = SeedEnc(geo);
			hiddenEnc += "$" + encrypted;
		}

		if (!tk.useSession){
			var PKey = this.getPKey();
			encSessionKey = this.phpbb_encrypt2048(genSessionKey, PKey.k, PKey.e, PKey.n);
		}

		if (tk.java_ver< 1.5)
			HM = CryptoJS.HmacSHA1(hiddenEnc, genSessionKey);
		else 
			HM = CryptoJS.HmacSHA256(hiddenEnc, genSessionKey);

		var transkeyEncObj = {};
		transkeyEncObj.hiddenEnc = hiddenEnc;
		transkeyEncObj.HM = HM;
		transkeyEncObj.seedKey = encSessionKey;
		return transkeyEncObj;
	};

	this.getEncData = function(x, y){
		var geo = "" + x + " " + y;
		return SeedEnc(geo);
	};

	this.getKey = function(type) {

		if(type == null || type == undefined){
			type = "number";
		}
		
		return mKey[type];
	};
	
	this.setMKey = function(str){
		if(str == null || str == undefined){
			return;
		}
		
		eval(StrGrab(str, '<!--', '//-->'));
		mKey["qwerty"] = qwerty;
		mKey["number"] = number;
	};
	
    function getRandomValue(range) {
       var ramdomNum = new GenKey().tk_getrnd_int() % range;
        return ramdomNum;
	}
	
	function SeedEnc(geo) {
		var iv = [0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x4b, 0x65, 0x79, 0x31, 0x30];
		var tsize = 64;
		var inData = new Array(tsize);		
		var outData = new Array(tsize);
		var roundKey = new Array(32);
		var i = 0; 
	  
		for(i=0; i<geo.length; i++)
		{			
			if(geo.charAt(i) == "l" || geo.charAt(i) == "u" || geo.charAt(i) == "d")
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
		
		if (!tk.useSession && tk.limitTime>0) {
			inData[i++] = 32;
			for(var k = 0 ; k<tk.initTime.length; k++)
			{
				if(tk.initTime.charAt(k) == "-")
					inData[i++] = Number(tk.initTime.charCodeAt(k));
				else
					inData[i++] = tk.initTime[k];
			}
		}
				
		inData[i++] = 32;
		inData[i++] = 101;
		
		for( ;i <tsize; i++){
			var rndInt = genKey.tk_getrnd_int();		
			inData[i] = rndInt % 100;
		}
		 
		Seed.SeedSetKey(roundKey, sessionKey);	
		Seed.SeedEncryptCbc(roundKey, iv, inData, tsize, outData);
		
		var encodedData = new Array(tsize);
		var encodedDataString = "";
	
		for(var k=0; k<tsize; k++)
		{
			if(transkey_encDelimiter == null)
				encodedData[k] = Number(outData[k]).toString(16);
			else
				encodedDataString += Number(outData[k]).toString(16)+transkey_encDelimiter;
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
	      //rng.nextBytes(temp);
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
		if(hexString.length==509)
			hexString = "0"+hexString;
		var len = hexString.length/2;

		var result = Array(len);
		for (var i = 0; i < len; i++)
			result[i] = parseInt(hexString.substring(2*i, 2*i+2),16);
		return result;
	}	

	// function makeHexToArrayByte(hexString)
	// {
	// 	var len = hexString.length/2;
	// 	var result = Array(len);
	// 	for (var i = 0; i < len; i++)
	// 	result[i] = parseInt(hexString.substring(2*i, 2*i+2),16);
	// 	return result;
	// }

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
