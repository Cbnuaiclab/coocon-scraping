function arc4random() {
  return Math.random() * 4294967296;
}


(function () {
  function initModule(sas) {
    console.log('init shttp module');
    try {
      var testbuf = new ArrayBuffer(4);
      var testbufView = new Uint8Array(testbuf);
    } catch (e) {
      Uint8Array = Packages.org.mozilla.javascript.typedarrays.NativeUint8Array;
      ArrayBuffer = Packages.org.mozilla.javascript.typedarrays.NativeArrayBuffer;
    }
    console.log('import forge modules');
    importForgeLibrary();

    var iniSafeSHTTPClass = sas.iniSafeSHTTP = sas.iniSafeSHTTP || {};

    function _iniSafeSHTTP() {
      console.log('_iniSafeSHTTP create');
      this.CryptoAlgorithmCode = '';
      this.CheckMsgIntegrity = '';
      this.CertAdvanceEnable = '';
      this.SignatureHashAlg = '';
      this.HandshakeCookie = '';
      this.PaddingModeCode = '';
      this.CipherModeCode = '';
      this.HashAlgorithm = 'default';
      this.SignatureAlg = '';
      this.MSCipherAlg = '';
      this.UserAgent = '';
      this._oldURL = '';
      this.result = '';
      this._HOST = '';
      this._URL = '';

      this.SecureSessionID = '';
      this.SecureSequence = '';
      this.SecureHeader = '';
      this.ScertX509 = '';
      this.SCert = '';

      //this.CheckMsgIntegrity = '';  // 중복 -juryu
      this.premaster = '';

      this.InitialVector = '';
      this.SecureKey = '';
      this.subkey = '';

      this.isDebugging = true;

      this.Last_Server_Time = '';
    }

    /**
     * shttpGet 통신 함수
     *
     * @name shttpGet
     * @param url: host + url 값
     * @return boolean 통신의 성공여부 true:false
     *
     */

    _iniSafeSHTTP.prototype.shttpGet = function (url, encode) {
      encode = encode || 'UTF-8';

      for (var idx = 0; idx < 2; idx++) {
        JSLog('shttpGet 호출 / count : ['+  idx +']');
        this.setHost(url);

        if (!this.isSession()) {
          JSLog('failed handshake');
          return false;
        }

        this.createSecureHeader();

        var param = this.getParam(url);
        var splitURL = url.split('?');
        JSLog('Encrypted param', param);

        param = (param && !(param === '')) ? splitURL[0] + '?GetData=' + param : splitURL[0];
        JSLog('param', param);

        this._URL = this.URLSetting(param);
        if(!httpRequest.getWithUserAgent(this.UserAgent, this._URL)) return false;

        this.createResultKey(httpRequest.getResponseHeaders());

        var response = httpRequest.result + '';

        if (response.indexOf("SFilter Error") >= 0) {
          this.shttpClear();
          continue;
        }

        response = response.replace(/[\r|\n]/g, '');
        JSLog('shttpGet response ', response);

        this.result = this.SHTTP_Decrypt(response, encode);
        return true;
      }
      return false;
    }

    /**
     * shttpPost 통신 함수
     *
     * @name shttpPost
     * @param url: host + url 값
     * @param postData: post 통신을 위한 post값
     * @return boolean 통신의 성공여부 true:false
     *
     */

    _iniSafeSHTTP.prototype.shttpPost = function (url, postData, encode) {
      encode = encode || "UTF-8";

      for (var idx = 0; idx < 2; idx++) {
        JSLog('shttpPost 호출 / count : ['+  idx +']');
        this.setHost(url);

        if (!this.isSession()) {
          JSLog('failed handshake');
          return false;
        }

        this.createSecureHeader();

        var param = this.getParam(url);
        var splitURL = url.split('?');

        param = (param && !(param === '')) ? splitURL[0] + '?GetData=' + param : splitURL[0];
        JSLog('SHTTP_POST', param);

        var _postData = httpRequest.URLEncodeAll(this.SHTTP_EncryptData(postData, 'UTF-8'), 'UTF-8');
        _postData = 'PostData=' + _postData;
        JSLog('_postData', _postData);

        this._URL = this.URLSetting(param);
        JSLog('UserAgent', this.UserAgent);

        if(!httpRequest.postWithUserAgent(this.UserAgent, param, _postData)) return false;

        this.createResultKey(httpRequest.getResponseHeaders());

        var response = httpRequest.result + '';

        JSLog('SHTTP_Post response', response);
        if (response.indexOf("SFilter Error") >= 0) {
          this.shttpClear();
          continue;
        }

        response = response.replace(/[\r|\n]/g, '');

        this.result = this.SHTTP_Decrypt(response, encode);
        return true;
      }
      return false;
    };

    _iniSafeSHTTP.prototype.log = function (msg) {
      console.log('iSASObject.Log(\"' + msg + '\")');
    };

    _iniSafeSHTTP.prototype.isSession = function () {
      JSLog('isSession 호출');

      if (this.SecureSessionID)
        return true;

      this.ReSession();

      this._URL = this.URLSetting('/shttp/handshake/req_env');

      if (!httpRequest.get(this._HOST + this._URL)) {
        JSLog('failed handshake');
        return false;
      }
      var response = httpRequest.result + '';
      response = httpRequest.URLDecode(response, 'UTF-8') + '';
      JSLog('response', response);

      var list = response.split('&');

      for (var idx = 0; idx < list.length; idx++) {
        var attributes = list[idx];
        this.setPropertyValue(
          StrGrab(attributes, '', '='),
          (StrGrab(attributes, '=', ''))
        );
      }

      const IniSafeSecureKey = this.MakeMasterSecret();
      JSLog('MakeMasterSecret', IniSafeSecureKey);

      var postData;
      if (this.CheckMsgIntegrity === '0') {
        postData = 'ms=' + httpRequest.URLEncodeAll(
          IniSafeSecureKey,
          'UTF-8'
        );
      } else {
        postData = 'ms=' + httpRequest.URLEncodeAll(
          IniSafeSecureKey,
          'UTF-8'
        ) + '&IntegrityEnable=1';
      }

      JSLog('IniSafeSecureKey', IniSafeSecureKey);
      JSLog('postData', postData);

      this._URL = this.URLSetting('/shttp/handshake/ms_share');
      if (!httpRequest.post(this._HOST + this._URL, postData)) {
        JSLog('failed handshake');
        return false;
      }

      response = httpRequest.result +'';
      response = response.replace(/[\r|\n]/g, '');
      JSLog('response', response);

      this.createResultKey(httpRequest.getResponseHeaders());

      // 2017.03.05 14:02 시작
      const oldCheckMsgIntegrity = this.CheckMsgIntegrity;

      this.CheckMsgIntegrity = '1';
      var decryptResponse= this.SHTTP_Decrypt(response, 'UTF-8');

      this.CheckMsgIntegrity = oldCheckMsgIntegrity;
      JSLog("SHTTP_Decrypt", decryptResponse);

      list = decryptResponse.split('&');
      for (var i = 0; i < list.length; i++) {
        var attributes = list[i];
        if (attributes.indexOf('SecureSequence') !== -1) {
          this.SecureSequence = StrGrab(attributes, '=', '');
          JSLog('Response SecureSequence', this.SecureSequence);
        } else if (attributes.indexOf('SecureSessionID') !== -1) {
          this.SecureSessionID = httpRequest.URLDecode(StrGrab(attributes, '=', ''));
        }
      }

      JSLog('SecureSequence', this.SecureSequence);
      JSLog('SecureSessionID', this.SecureSessionID);

      return (this.SecureSequence) ? true : false;
    };

    _iniSafeSHTTP.prototype.setPropertyValue = function (propName, propValue) {
      const attributeName = (propName + '').toLowerCase();

      JSLog('attribute name', attributeName);
      JSLog('attribute value', propValue);

      if (attributeName === 'servercert') {
        this.LoadCert(propValue);
      } else if (attributeName === 'cryptoalgorithmcode') {    //CryptoAlgorithmCode
        this.CryptoAlgorithmCode = propValue;
      } else if (attributeName === 'ciphermodecode') {         //CipherModeCode
        this.CipherModeCode = propValue;
      } else if (attributeName === 'paddingmodecode') {        //PaddingModeCode
        this.PaddingModeCode = propValue;
      } else if (attributeName === 'hashalgorithm') {          //HashAlgorithm
        this.HashAlgorithm = propValue;
      } else if (attributeName === 'handshakecookie') {        //HandshakeCookie
        this.HandshakeCookie = propValue;
      } else if (attributeName === 'certadvanceenable') {      //CertAdvanceEnable
        this.CertAdvanceEnable = propValue;
      } else if (attributeName === 'mscipheralg') {            //MSCipherAlg
        this.MSCipherAlg = propValue;
      } else if (attributeName === 'signaturealg') {           //SignatureAlg
        this.SignatureAlg = propValue;
      } else if (attributeName === 'signaturehashalg') {       //SignatureHashAlg=SHA1
        this.SignatureHashAlg = propValue;
      } else if (attributeName === 'checkmsgintegrity') {       //CheckMsgIntegrity
        this.CheckMsgIntegrity = propValue;
      }
    };

    _iniSafeSHTTP.prototype.shttpClear = function () {
      this.SCert = '';
      this.ScertX509 = '';
      this.SecureSessionID = '';
      this.SecureHeader = '';
    };

    _iniSafeSHTTP.prototype.clearKey = function () {
      this.subkey = '';
      this.SecureKey = '';
      this.InitialVector = '';
    };

    _iniSafeSHTTP.prototype.setHost = function (url) {
      var spliedUrl = url.split('/');
      this._HOST = spliedUrl[0] + '//' + spliedUrl[2]
      JSLog('this._HOST', this._HOST);
    };

    /**
     * @return {string}
     */
    _iniSafeSHTTP.prototype.SHTTP_Decrypt = function (encStr, encType) {
      var startPos = 20;
      var decodeDataLength = 0;
      var decodeData;
      var decData;
      var index = 0;
      var textDecoded;

      JSLog('CheckMsgIntegrity', this.CheckMsgIntegrity);
      JSLog('encStr', encStr);

      if (this.CheckMsgIntegrity === '0') {
        startPos = 0;
      }
      if (encStr === '') {
        return '';
      }

      if (certManager.SEED_CBC_Decrypt !== undefined) {
        // 기존방식 안드로이드 기준  sasapi_v2.0.8 버전 이후
        var k = asciiToHex(this.SecureKey, this.SecureKey.length);
        var i = asciiToHex(this.InitialVector, this.InitialVector.length);

        var hashLength = 0;

        if (this.HashAlgorithm === '01') hashLength = 16;
        else if (this.HashAlgorithm === '02' || this.HashAlgorithm === 'SHA1') hashLength = 20;

        decodeData = certManager.SEED_CBC_Decrypt(k, i, encStr, encType, hashLength);

        try {
          decodeDataLength = decodeData.length();
        } catch (e) {
          decodeDataLength = decodeData.length;
        }

        JSLog('decrypted Data', decodeData);

        /// dt export
        index = decodeData.indexOf('dt=');
        if (index !== -1) {
          startPos = index + 3;
          decData = decodeData.slice(startPos, decodeDataLength);
        }
        else{
          decData = decodeData;
        }

      } else {
        // 기존방식 안드로이드 기준 sasapi_v2.0.8 버전 이전
        var encData = forge.util.createBuffer(forge.util.decode64(encStr));

        if (encData.data.length === 0) {
          return '';
        }
        var decipher = forge.cipher.createDecipher('SEED-CBC', this.SecureKey);
        decipher.start({iv: this.InitialVector});
        decipher.update(encData);
        decipher.finish();
        decodeData = decipher.output.getBytes();
        decodeDataLength = decodeData.length;

        /// dt export
        index = decodeData.indexOf('dt=');
        if (index != -1) {
          startPos = index + 3;
        }

        if (startPos != 0) decData = decodeData.slice(startPos, decodeDataLength);
        else decData = decodeData;

        if (decodeData.indexOf('charset=euc-kr') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        } else if (decodeData.indexOf('encoding="EUC-KR"') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        } else if (decodeData.indexOf('encoding=\'UTF-8\'') > -1) {
          textDecoded = new TextDecoder("UTF-8").decode(decData.toBuffer());
          JSLog("UTF8 Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        }// SC은행 추가
        else if (decodeData.indexOf('DSPY_R') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        }// 하나은행 추가
        else if (decodeData.indexOf('<div id="hanaMainDiv">') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        } else if (decodeData.indexOf('<a href="#//HanaBank">') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        } else if (decodeData.indexOf('BIZ.CIQ0015.OUT.REC') > -1) {
          textDecoded = new TextDecoder("UTF-8").decode(decData.toBuffer());
          JSLog("UTF8 Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        } else if (decodeData.indexOf('errorMessage') > -1) {
          textDecoded = new TextDecoder("UTF-8").decode(decData.toBuffer());
          JSLog("UTF8 Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        } else if (decodeData.indexOf('<div class="error">') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        }
        else if (decodeData.indexOf('<div id="hanaBodyDiv">') > -1) {
          textDecoded = new TextDecoder("EUC-KR").decode(decData.toBuffer());
          JSLog("EUC-KR Decode", textDecoded);
          if (textDecoded) {
            decData = textDecoded;
          }
        }
      }

      JSLog('decrypted Data', decData);
      return decData;
    };

    /**
     * @return {string}
     */
    _iniSafeSHTTP.prototype.SHTTP_EncryptData = function (encStr, encType) {
      JSLog('SHTTP_EncryptData 호출');
      JSLog('encStr', encStr);

      this.ReCreateKey();

      var type = encType + ''.toUpperCase();
      var encData = encStr;
      var _encData;

      JSLog('SignatureHashAlg', this.SignatureHashAlg);
      JSLog('CheckMsgIntegrity', this.CheckMsgIntegrity);

      if (this.CheckMsgIntegrity && this.CheckMsgIntegrity === '1') {
        var hashed = hashAlgorithmTypes[this.SignatureHashAlg](encData);
        if (hashed.length === 0) {
          return '';
        }
        _encData = hashed + encData;
      } else {
        _encData = encData;
      }
      JSLog('_encData', _encData);

      return this._SHTTP_Encrypt(_encData);
    };

    _iniSafeSHTTP.prototype._SHTTP_Encrypt = function (str) {
      JSLog('_SHTTP_Encrypt 호출');

      var cipher = forge.cipher.createCipher('SEED-CBC', this.SecureKey);
      cipher.start({iv: this.InitialVector});
      cipher.update(forge.util.createBuffer(str));
      cipher.finish();

      var rtnStr = forge.util.encode64(cipher.output.bytes());

      JSLog('encrypted data', rtnStr);
      return rtnStr;
    };

    _iniSafeSHTTP.prototype.SHTTP_Encrypt = function (str, encType) {
      JSLog('SHTTP_Encrypt 호출');

      this.ReCreateKey();
      var type = encType + ''.toUpperCase();
      var encData;
      (type === 'EUC-KR') ? encData = encodeEucKr(str) : encData = encodeUtf8(str);

      JSLog('SHTTP_Encrypt str', str);
      JSLog('SHTTP_Encrypt encData', encData);

      return this._SHTTP_Encrypt(encData);
    };

    _iniSafeSHTTP.prototype.ReCreateKey = function () {
      JSLog('ReCreateKey 호출');

      var date = getFormattedTime();
      JSLog('ReCreateKey date', date);

      return this.CreateKey(this.Last_Server_Time);
    };

    _iniSafeSHTTP.prototype.createResultKey = function (responseHeaders) {
      JSLog('createResultKey 호출');

      var Server_Time = StrGrab(responseHeaders, '"Server-Time":"', '","');

      Server_Time = [Server_Time.slice(0, 14), '.', Server_Time.slice(14)].join('');
      Server_Time = [Server_Time.slice(0, 12), ':', Server_Time.slice(12)].join('');
      Server_Time = [Server_Time.slice(0, 10), ':', Server_Time.slice(10)].join('');
      Server_Time = [Server_Time.slice(0, 8), ' ', Server_Time.slice(8)].join('');
      Server_Time = [Server_Time.slice(0, 6), '-', Server_Time.slice(6)].join('');
      Server_Time = [Server_Time.slice(0, 4), '-', Server_Time.slice(4)].join('');

      JSLog('Server_Time', Server_Time);

      this.Last_Server_Time = Server_Time;
      this.CreateKey(Server_Time);

      return true;
    };

    /**
     * @return {boolean}
     */
    _iniSafeSHTTP.prototype.CreateKey = function (subKeyStr) {
      JSLog('CreateKey 호출');

      this.clearKey();
      var server = subKeyStr;
      var subKeyData = server.slice(0, 16);
      var copyLen = (server.length >= 16) ? 16 : server.length;

      JSLog('subKeyData', subKeyData);

      this.subkey = subKeyData;

      if (!this.HashAlgorithm) {
        return false;
      }

      var secretKey = this.subkey;
      for (var idx = 0; idx < copyLen; idx++) {
        secretKey += this.premaster.charAt(idx);
      }

      // SecureKey 생성
      var hashed = hashAlgorithmTypes[this.HashAlgorithm](secretKey);
      if (!hashed) {
        return false;
      }

      for (var idx = 0; idx < 16; idx++) {
        var hash = (hashed[idx].charCodeAt(0));
        var prem = (this.premaster[idx].charCodeAt(0));
        this.SecureKey += String.fromCharCode(hash ^ prem);
      }

      // IV 생성
      hashed = hashAlgorithmTypes[this.HashAlgorithm](this.SecureKey);

      if (!hashed) {
        return false;
      }

      for (var i = 0; i < 16; i++) {
        var hash = (hashed[i].charCodeAt(0));
        var subk = (this.subkey.charCodeAt(i));
        this.InitialVector += String.fromCharCode(hash ^ subk);
      }
      return true;
    };

    _iniSafeSHTTP.prototype.MakeMasterSecret = function () {
      JSLog('MakeMasterSecret 호출');
      JSLog('this.ScertX509 Length', this.ScertX509.length);

      if (!this.ScertX509) {
        JSLog('failed MakeSKData CertLoad!');
        return '';
      }

      return certManager.RSA_public_encrypt(this.ScertX509, this.premaster);
    };

    _iniSafeSHTTP.prototype.LoadCert = function (cert) {
      JSLog('LoadCert 호출');

      this.SCert = cert;
      this.SCert = this.SCert.replace('-----BEGIN CERTIFICATE-----', '');
      this.SCert = this.SCert.replace('-----END CERTIFICATE-----', '');
      this.SCert = this.SCert.replace(/[\r|\n]/g, '');

      this.ScertX509 = this.SCert;

      JSLog('this.ScertX509', this.ScertX509);
    };

    _iniSafeSHTTP.prototype.ReSession = function () {
      JSLog('ReSession 호출');
      this.premaster = generate_sessionkey(16);
    };

    _iniSafeSHTTP.prototype.getSecureSequence = function () {
      JSLog('getSecureSequence 호출');

      if (this.SecureSequence) {
        return parseInt(this.SecureSequence) + 1 + '';
      }
    };

    _iniSafeSHTTP.prototype.createSecureHeader = function () {
      JSLog('createSecureHeader 호출');

      var secureHeader = "{\"Accept-Language\": \"ko\","
        + '\"Content-Type\": \"application/x-www-form-urlencoded\",'
        + '\"Accept-Encoding\": \"securemsg\",'
        + '\"Secure-SessionID\": \"' + this.SecureSessionID + '\",';

      JSLog('secureHeader', secureHeader);

      var referer;
      if (this._oldURL) {
        referer= this._oldURL;
        referer= httpRequest.URLEncodeAll(this.SHTTP_Encrypt(referer, 'UTF-8'), 'UTF-8');
        JSLog('url', referer);
        secureHeader += '\"Encrypted-Referer\": \"' + referer + '\",';
      }
      // 20170310 작업시작
      var secureNumber = parseInt(this.SecureSequence) + 1;
      this.SecureSequence = secureNumber.toString();
      JSLog('SecureSequence', this.SecureSequence);

      var _SecureSequence = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(this.SecureSequence, 'UTF-8'), 'UTF-8');
      JSLog('SecureSequence', _SecureSequence);

      var macAddress = '000C298B5AFB';
      var _EncryptedClientMACAddressInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(macAddress, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Client-MAC-Address-Info', _EncryptedClientMACAddressInfo);

      var clientIP= '172.16.230.130';
      var _EncryptedClientIPAddressInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(clientIP, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Client-IP-Address-Info', _EncryptedClientIPAddressInfo);

      var gateWay= '172.16.230.2';
      var _EncryptedClientGatewayAddressInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(gateWay, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Client-Gateway-Address-Info', _EncryptedClientGatewayAddressInfo);

      var serial= '64E65AAF';
      var _EncryptedClientLogicalHDDSerialInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(serial, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Client-Logical-HDD-Serial-Info', _EncryptedClientLogicalHDDSerialInfo);

      var hdd = '00000000000000000001';
      var _EncryptedClientPysicalHDDSerialInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(hdd, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Client-Pysical-HDD-Serial-Info', _EncryptedClientPysicalHDDSerialInfo);

      var browserInfo= 'MSIE 8.0.6001.18702;';
      var _EncryptedBrowserInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(browserInfo, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Browser-Info', _EncryptedBrowserInfo);

      var clientNIC= 'xid+ObmDAJ1xyOV6EOf+SCNYn2AFCymhJnGKels73NxCiz0cznjZfhltqI6q84CnES9hnChoEpMRayWri0da2RfAYQ8pymQRFlDR5f/3bcP/JdG2EpW8n9ka6vjOuqVTrNWvdMo+G/CnvsnTolmTCk7twVziK3yeCP+OdG3aQ/quVIqyWJ2JiiZSK6rMaGU5YP0urhdnESYBnLh0myCVz21CS/QviDK88Uh1ESfihZqnRc0oiDPkMk9Ua7eM1DI+o31GG2S/+juD1msM3owKyj67xMu+vwgsZGf1ZZtwxlZNolbgwdCYT5z+upplxKSn8LvlM/UbMe2bEb4zqEQP80kfidCDTnsQ4P8CO8p66kWbcPJuOjhENXFt3Wf+oFn7QS8Agle8tHzPKYrUbsRoXoujTgbuTIeE+8TVL4T51SK0TN1u0YYXRr14jxE52Nbe';
      var _EncryptedClientNICInfo = httpRequest.URLEncodeAll(this.SHTTP_Encrypt(clientNIC, 'UTF-8'), 'UTF-8');
      JSLog('Encrypted-Client-NIC-Info', _EncryptedClientNICInfo);

      secureHeader += '\"Secure-Sequence\": \"' + _SecureSequence + '\",'
        + '\"Cipher-Parity\": \"0\",'
        + '\"Encrypted-Client-MAC-Address-Info\": \"' + _EncryptedClientMACAddressInfo + '\",'
        + '\"Encrypted-Client-IP-Address-Info\": \"' + _EncryptedClientIPAddressInfo + '\",'
        + '\"Encrypted-Client-Gateway-Address-Info\": \"' + _EncryptedClientGatewayAddressInfo + '\",'
        + '\"Encrypted-Client-Logical-HDD-Serial-Info\": \"' + _EncryptedClientLogicalHDDSerialInfo + '",'
        + '\"Encrypted-Client-Pysical-HDD-Serial-Info\": \"' + _EncryptedClientPysicalHDDSerialInfo + '",'
        + '\"Encrypted-Browser-Info\": \"' + _EncryptedBrowserInfo + '",'
        + '\"Encrypted-Client-NIC-Info\": \"' + _EncryptedClientNICInfo + '",'
        + '\"User-Agent\": \"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; EmbeddedWB 14.52 from: http://www.bsalsa.com/ EmbeddedWB 14.52; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 1.1.4322)\"}';

      JSLog('secureHeader', secureHeader);

      this.setUserAgent(secureHeader);

      return true;
    };

    _iniSafeSHTTP.prototype.setUserAgent = function (aCustomUserAgent) {
      JSLog('setUserAgent 호출');

      if (aCustomUserAgent.charAt(0) === '{') {
        this.UserAgent = aCustomUserAgent;
        return true;
      } else {
        this.setUserAgent('{\"User-Agent\":\"' + aCustomUserAgent + '\"}');
      }
    };

    _iniSafeSHTTP.prototype.getParam = function (url) {
      JSLog('getParam 호출');
      if (url.indexOf('?') > -1) {
        JSLog('getParam url', url);
        var param = url.split('?')[1];
        JSLog('param', param);
        return httpRequest.URLEncodeAll(this.SHTTP_EncryptData(param, 'EUC-KR'), 'EUC-KR');
      }
    };

    _iniSafeSHTTP.prototype.URLSetting = function (url) {
      JSLog('URLSetting 호출');
      if (url.indexOf(this._HOST) === -1) {
        this._oldURL = this._HOST + url;
      }
      this._oldURL = url;
      return url;
    };

    var hashAlgorithmTypes = {
      '01': md5f,
      '02': sha1f,
      'SHA1': sha1f,
      'default': md5f
    };

    function JSLog(logName, data) {
      (data) ? console.log('[shttp log] ' + logName + ' : ' + data) : console.log(logName);
    }

    function encodeUtf8(str) {
      return forge.util.encodeUtf8(str);
    }

    function encodeEucKr(str) {
      return forge.util.encodeEucKr(str);
    }

    function generate_sessionkey(len) {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = len;
      var randomString = '';
      for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
      }
      return randomString;
    }

    function asciiToHex(str) {
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

    function md5f(plain) {
      var hashed = forge.md.md5.create();
      hashed.update(plain);
      return hashed.digest().getBytes();
    }

    function sha1f(plain) {
      var hashed = forge.md.sha1.create();
      hashed.update(plain);
      return hashed.digest().getBytes();
    }

    function getFormattedTime() {
      var date = new Date();
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString();
      var dd = date.getDate().toString();
      var HH = date.getHours().toString();
      var MM = date.getMinutes().toString();
      var SS = date.getSeconds().toString();
      var SSS = date.getMilliseconds().toString();

      var res = yyyy + '-' + (mm[1] ? mm : '0' + mm[0]);
      res += '-' + (dd[1] ? dd : '0' + dd[0]);
      res += ' ' + (HH[1] ? HH : '0' + HH[0]);
      res += ':' + (MM[1] ? MM : '0' + MM[0]);
      res += ':' + (SS[1] ? SS : '0' + SS[0]);
      res += '.' + (SSS[1] ? SSS : '0' + SSS[0]);
      return res;

    }

    String.prototype.toBuffer = function () {
      var buf = new ArrayBuffer(this.length * 2); // 2 bytes for each char

      var bufView = new Uint8Array(buf, 0, this.length * 2);
      for (var i = 0, strLen = this.length; i < strLen; i++) {
        bufView[i] = this.charCodeAt(i);
      }
      return buf;
    };

    function importForgeLibrary() {
      system.include('forge/Crypto/forge');
      system.include('forge/Crypto/util');
      system.include('forge/Crypto/tls');
      system.include('forge/Crypto/cipherModes');
      system.include('forge/Crypto/cipher');
      system.include('forge/Crypto/aes');
      system.include('forge/Crypto/prng');
      system.include('forge/Crypto/md');
      system.include('forge/Crypto/sha1');
      system.include('forge/Crypto/md5');
      system.include('forge/Crypto/sha256');
      system.include('forge/Crypto/random');
      system.include('forge/Crypto/seed');
      system.include('sas/encoding-indexes');
      system.include('sas/encoding');
    }

    iniSafeSHTTPClass.create = function () {
      return new _iniSafeSHTTP();
    };

  }

  var name = 'iniSafeSHTTP';
  if (typeof define !== 'function') {
    // NodeJS -> AMD
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function (ids, factory) {
        factory(require, module);
      };
    } else {
      // <script>
      if (typeof sas === 'undefined') {
        sas = {};
      }
      return initModule(sas);
    }
  }
  // AMD
  var deps;
  var defineFunc = function (require, module) {
    module.exports = function (sas) {
      //    var mods = deps.map(function(dep) {
      //      return require(dep);
      //    }).concat(initModule);

      var mods = [];
      for (key in deps) {
        mods.push(require(deps[key]));
      }
      mods = mods.concat(initModule);

      // handle circular dependencies
      sas = sas || {};
      sas.defined = sas.defined || {};
      if (sas.defined[name]) {
        return sas[name];
      }
      sas.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](sas);
      }
      return sas[name];
    };
  };
  var tmpDefine = define;
  define = function (ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
})();
