/**
 *
 * MagicLineMBX.js
 * 작성자 : 김인권
 * 작성일 : 2018.10.08.
 *
 *
 * 객체생성
 * - var magicLineMBX = MagicLineMBX.create()
 *
 * 사용법
 * - magicLine.cipher.decrypt('암호화된데이터', '문자인코딩 타입');
 * - magicLine.login('서버인증서','암호화데이터','인증서비밀번호','문자인코딩 타입');
 *
 * @type {{create: (function(): {cipher, login, util})}}
 */

var MagicLineMBX = {
  create: function () {
    return new _magicLineMBX();
  }
};

function _magicLineMBX() {
  return {
//  e4b4ab0223df74cd00a876dac70b593ede849b0edb49feaf6f6b0cd71afc73a2
    cipher: {
      _encryptKeySet: {
        key: '52dcd540a2e4cce9e649b9533fecf301',
        iv: '31323334353637383930313233343536'
      },

      _decryptKeySet: {
        key: '9d170c4a2cf88488476717fd69ce8f09',
        iv: '31323334353637383930313233343536'
      },
      encrypt: function (plain) {
        // TODO: plain + sha256 을 Seed Encrypt 해야하나, hex 인풋을 받는 seed encrypt 가 없다.
        var hexPlain = plain + SASUtils.Hash.sha256(plain);
        return certManager.SEED_CBC_Encrypt(this._encryptKeySet.key, this._encryptKeySet.iv, hexPlain);
      },
      //TODO: seed decrypt 고정키 함수
      decrypt: function (encryptedData, charset) {
        var replacedData = encryptedData.replace('<MagicLine:ENCRYTPED_DATA>', '');
        replacedData = replacedData.replace('</MagicLine:ENCRYTPED_DATA>', '');

        var hexData = certManager.Base64ToHex(replacedData) + '';
        hexData = hexData.substring(14, hexData.length);

        var data = certManager.HexToBase64(hexData);
        return certManager.SEED_CBC_Decrypt(this._decryptKeySet.key, this._decryptKeySet.iv, data, charset, 0, 32);
      }
    },
    //TODO: envelopedData 대치 함수
    login: function (serverCert, plain, password, charset) {
      var encryptedData = certManager.SignDataGPKI(serverCert, plain, password, charset);
      return StrReplace(encryptedData,"gpki:ENCRYPTED DATA", "MagicLine:ENCRYTPED_DATA");
    },

    util: {
      _hex2ascii: function (hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
          var text = hex.substr(i, 2);
          if (text !== '00')
            str += String.fromCharCode(parseInt(text, 16));
        }
        return str;
      },

      _ascii2hex: function (str) {
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
    }
  }
}

