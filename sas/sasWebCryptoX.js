(function () {
  function initModule(sas) {

    var webCryptoXClass = sas.webCryptoX = sas.webCryptoX || {};

    function _webCryptoX() {
      console.log('_webCryptoX create');
      
      this.seedKey = "",
      this.seedIv  = "",
      this.rsaKey  = "",
      this.keyType = "",
      this.seedEncrypted = "";
      this.isSupport = true; //네이티브 엔진 지원여부 
      
      //네이티브 엔진으로 사용하는 클래스 및 함수지원 여부 확인
      //미지원 시 스크립트로만 동작할 수 있게 플래그 설정
      if(typeof WebCryptX === 'undefined' || typeof WebCryptX.envelopedData === 'undefined' || typeof WebCryptX.getCryptData === 'undefined'
          || typeof WebCryptX.encrypt === 'undefined' || typeof WebCryptX.decrypt === 'undefined' ){
          this.isSupport = false;
          console.log('_webCryptoX importForgeLibrary');
          importForgeLibrary();
      }
      
    }

    /**
     * 랜덤 스트링 gen
     * @param size : 길이
     */
    _webCryptoX.prototype.randomString = function (size) {
        var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var rnd = '';

        for (var i = 0; i < size; i++) {
            var ranNum = this.genNumber(0, table.length - 1);
            rnd += table.charAt(ranNum);
        }
        return rnd;
    }, 
    _webCryptoX.prototype.genNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, 
    
    /**
     * ascii -> hexString
     */
    _webCryptoX.prototype.ascii2hex = function (str ) {
        if (typeof str !== 'string') {
            return '';
        }

        var arr = [];
        for (var i = 0, l = str.length; i < l; i++) {
            var hex = Number(str.charCodeAt(i)).toString(16);
            if (hex.length % 2 === 1) {
                hex = '0' + hex;
            }
            arr.push(hex);
        }
        return arr.join('');
    }, 
    
    _webCryptoX.prototype.doPublic = function (pubKey) {
        if(!pubKey){
            return false;
        }
        
        pubKey = pubKey.replace(/-----BEGIN PUBLIC KEY-----/g, "");
        pubKey = pubKey.replace(/-----END PUBLIC KEY-----/g, "");
        pubKey = pubKey.replace(/-----BEGIN CERTIFICATE-----/g, "");
        pubKey = pubKey.replace(/-----END CERTIFICATE-----/g, "");
        pubKey = pubKey.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
        
        var resultJson = {};
        var pubKeyHex = certManager.Base64ToHex(pubKey);
        var rsaKey = "";
        
        if (pubKeyHex.indexOf("02818100") > -1) {
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
    }, 
    

    /** script 기반으로 된 seed 암호화 시 한글깨짐 현상으로 인해 CryptoJS.enc.CP949 를 사용하여 hex로 변환처리
     */
    _webCryptoX.prototype.plainToHex = function(plainText) {
        
        var hexString = "";
        var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글체크
        
        //한글 포함 시 
        if(check.test(plainText)){
            
            //한글자씩 체크하여 변환한다.
            for(var i = 0; i < plainText.length; i++){
                var str = plainText[i];
                
                if(check.test(str)){
                    str = CryptoJS.enc.CP949.parse(str);
                }else {
                    str = this.ascii2hex(str)
                }
                hexString += str;
                
            }
            
        }
        //한글 미포함 시 
        else {
            hexString = this.ascii2hex(plainText);
        }
        
        return hexString;
        
    },
    
    _webCryptoX.prototype.encrypt = function(plainText, charset) {
        return this.EncodeCrypt(this.seedEncrypt(plainText, charset));
    },
    
    _webCryptoX.prototype.seedEncrypt = function(plainText, charset) {
        
        if(!plainText){
            return "";
        }
        if(!charset){
            charset = "UTF-8";
        }
        
        /** native call
         */
        if(this.isSupport){
//            console.log("WebCryptoX seedEncrypt native call");
            return WebCryptX.encrypt(plainText, charset);
        }
        
        /** script call
         */
//        console.log("WebCryptoX seedEncrypt script call");
        if (this.seedKey === '' || this.seedIv === '' || typeof plainText !== 'string') {
            return '';
        }
        
        var key   = CryptoJS.enc.Hex.parse(this.ascii2hex(this.seedKey));
        var iv    = CryptoJS.enc.Hex.parse(this.ascii2hex(this.seedIv));
        var plain = CryptoJS.enc.Hex.parse(this.plainToHex(plainText));
        
        var encrypted = CryptoJS.SEED.encrypt(plain, key, {iv:iv, mode:CryptoJS.mode.CBC}).ciphertext.toString();
        
        return certManager.HexToBase64(encrypted);
        
        //certManager.SEED_CBC_Encrypt 함수에 charset받는 인자가 없어서 CryptoJS.SEED 사용 
//        return certManager.SEED_CBC_Encrypt(this.ascii2hex(this.seedKey), this.ascii2hex(this.seedIv), plainText);
        
    },

    _webCryptoX.prototype.decrypt = function(encryptedData, charset) {
      
        if(!encryptedData){
            return "";
        }
        
        encryptedData = this.DecodeCrypt(encryptedData);
        
        /** native call
         */
        if(this.isSupport){
//            console.log("WebCryptoX seedDecrypt native call");
            return WebCryptX.decrypt(encryptedData, charset);
        }
        
        if (this.seedKey === '' || this.seedIv === '' || typeof encryptedData !== 'string') {
            return '';
        }
        if(!charset){
            charset = "UTF-8";
        }
        return certManager.SEED_CBC_Decrypt(this.ascii2hex(this.seedKey), this.ascii2hex(this.seedIv), encryptedData, charset, 0);
    },
    
    _webCryptoX.prototype.getCryptData = function() {
        
        if(!this.seedEncrypted){
            return "";
        }
        return this.EncodeCrypt(this.seedEncrypted);
    },
    
    _webCryptoX.prototype.decode64 = function(input) {

        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

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
        
    },
    
    _webCryptoX.prototype.EncodeCrypt = function(data) {
        return data.replace(/\//g, '_').replace(/\=/g, '-').replace(/\+/g, '*');
    },
    
    _webCryptoX.prototype.DecodeCrypt = function(data) {
        return data.replace(/\_/g, '/').replace(/\-/g, '=').replace(/\*/g, '+');
    },
    

    /**
     * @name shttpPost
     * @param serverCert
     * @param sessNo
     * @return pkcs#7 envelopedData
     *
     */
    _webCryptoX.prototype.envelopedData = function (serverCert, sessNo) {
      
        if(!serverCert || !sessNo){
            return "";
        }
        var envelopedData = ""; 
        
        /** native call
         */
        if(this.isSupport){
//            console.log("WebCryptoX envelopedData native call");
            envelopedData = WebCryptX.envelopedData(serverCert, sessNo);
//            console.log("WebCryptoX envelopedData : " + envelopedData);
            this.seedEncrypted = WebCryptX.getCryptData();
            return this.EncodeCrypt(envelopedData);
        }
        
        /** script call
         */ 
//        console.log("WebCryptoX envelopedData script call");
        //seed key, iv 생성
        this.seedKey = this.randomString(16);
        this.seedIv  = this.randomString(16);
        
        this.seedEncrypted = this.seedEncrypt(sessNo);
        
//        console.log("WebCryptoX envelopedData sessNo : " + sessNo);
//        console.log("WebCryptoX envelopedData this.seedKey : " + this.seedKey);
//        console.log("WebCryptoX envelopedData this.seedIv : " + this.seedIv);
//        console.log("WebCryptoX envelopedData this.seedEncrypted : " + this.seedEncrypted);
        
        
        /* make enveloped start */
        var asn1  = forge.asn1;
        var pki   = forge.pki;
        var pkcs7 = forge.pkcs7;
        
        this.doPublic(serverCert);
        
        var mod = new forge.jsbn.BigInteger(this.rsaKey, 16);
        var exponent = new forge.jsbn.BigInteger(this.keyType, 16);
        
        var rsa = forge.pki.rsa;
        var publicKey = rsa.setPublicKey(mod, exponent);
        var buf = forge.util.createBuffer(this.seedKey, 'utf8');

        var encrypted = publicKey.encrypt(this.seedKey, 'RSA-OAEP', {
            md: forge.md.sha1.create(),
            mgf1: {
              md: forge.md.sha1.create()
            }
          });
        
        // create a p7 enveloped message
        var p7 = pkcs7.createEnvelopedData();
        // add a recipient
        serverCertPem = "-----BEGIN CERTIFICATE-----"+serverCert+"-----END CERTIFICATE-----";
        var cert = pki.certificateFromPem(serverCertPem);
        p7.addRecipient(cert);
        
        //RSAES-OAEP
        p7.recipients[0].encryptedContent.algorithm = "1.2.840.113549.1.1.7";
        p7.recipients[0].encryptedContent.content = encrypted;
            
        //pkcs#7
        p7.encryptedContent.algorithm = "1.2.410.200004.1.4";
        p7.encryptedContent.parameter = forge.util.createBuffer(this.seedIv);
        p7.encryptedContent.content = forge.util.createBuffer(this.decode64(this.seedEncrypted));
        
        var envelopedData = pkcs7.messageToPem(p7, 64, true);
        envelopedData = envelopedData.replace(/-----BEGIN PKCS7-----/g, "");
        envelopedData = envelopedData.replace(/-----END PKCS7-----/g, "");
        envelopedData = envelopedData.replace(/\n/g, "").replace(/\r/g, "");
        
//        console.log("WebCryptoX envelopedData : " + envelopedData);

        return this.EncodeCrypt(envelopedData);
    };

    function importForgeLibrary() {
        system.include('forge/Crypto/merge_forge');
        system.include('forge/Crypto/pkcs7');
        system.include("sas/seed");
        system.include('forge/Crypto/enc-cp949');
    }

    webCryptoXClass.create = function () {
      return new _webCryptoX();
    };

  }

  var name = 'webCryptoX';
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
