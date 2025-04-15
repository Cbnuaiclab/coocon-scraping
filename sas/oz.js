/**
 * OZViewer JS
 *
 * 작성자 : 김인권
 * 작성일 : 2018.03.02 (efamily 증명서 추가)
 * 수정일 : 2018.03.12 (kbinsure 보험 증명서 추가)
 * 수정일 : 2018.05.08 (대법원 사이트 개편으로 인한 수정)
 *
 * OZViewer 통신 JS
 *
 *
 * efamily.js
 *
 * var eFamilyScout = ozViewer.eFamilyScout.create();
 * var 가족관계증명서 = eFamilyScout.getFamilyRelationCertificate(inputData);
 *
 * OZViewer 서버와의 통신은 octect stream 으로 데이터를 주고 받으며,
 * Response 데이터를 String 으로 강제 변환해보면 쓰레기 값들이 텍스트 중간중간에 존재한다.
 * 이를 제거하기 위해, Response 데이터를 초기 Base64 형태로 받고, 이를 풀어
 * 문자(영어, 숫자, (특문-*\n), 한글)을 제외한 쓰레기 값들을 지운다.
 *
 * 위와 같은 이유에 따라 Base64 함수를 엔진에서 제공할 예정이였으나, iOS에서는 string 데이터에 쓰레기 값이 있으면
 * 데이터가 null로 반환되어지는 현상으로 인해 iOS에서는 Javascript에서 Base64 디코딩을 진행하며,
 * Android에서는 Javascript에서 Base64 디코딩을 진행할 경우, 길이에 따라 Rhino 엔진에서 Stack overflow를
 * 뱉어낼 가능성이 있기 때문에, 엔진에서 certManager.Base64Decode 함수를 제공하여 Base64 디코딩을 진행한다.
 *
 *
 * ------------------------------------------------------------------------------------------
 *
 * kbinsure.js
 *
 * var kbCertificate = ozViewer.kbinsure.create();
 * var 보험증권 = kbCertificate.getCertificateFromReportName(reportName, xmlData)
 */

/**
 *
 * @returns {
 *            {_encodedData: string,
 *              ozBase64: {
 *                decode: ozBase64.decode,
 *                encode: ozBase64.encode,
 *                _base64: {
 *                  _keyStr: string,
 *                  encode: ozBase64._base64.encode,
 *                  decode: ozBase64._base64.decode,
 *                  _utf8_encode: ozBase64._base64._utf8_encode,
 *                  _utf8_decode: ozBase64._base64._utf8_decode
 *                }
 *              },
 *              getAttributes: getAttributes,
 *              makePostData: makePostData,
 *              makePostData2: makePostData2,
 *              makePostData3: makePostData3,
 *              makePostData4: makePostData4,
 *              _setAttributes: _setAttributes,
 *              _hexPadding: _hexPadding,
 *              _setString: _setString,
 *              _setInt32: _setInt32,
 *              _setInt: _setInt,
 *              _setBoolean: _setBoolean,
 *              _getVersion: _getVersion,
 *              _getTag: _getTag,
 *              _getAttribute: _getAttribute,
 *              _hex2ascii: _hex2ascii,
 *              _ascii2hex: _ascii2hex
 *            }
 *          }
 * @private
 */
function _ozUtils() {
  return {
    _encodedData: '',

    // public
    ozBase64: {
      decode: function (b64Data) {
        if (certManager.Base64Decode) {
          return String(certManager.Base64Decode(b64Data));
        } else {
          return this._base64.decode(b64Data);
        }
      },
      encode: function (data) {
        if (certManager.Base64Encode) {
          return String(certManager.Base64Encode(data));
        } else {
          return this._base64.encode(data);
        }
      },
      _base64: {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;

          input = this._utf8_encode(input);

          while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }

            output = output +
              this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
              this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

          }

          return output;
        },

        // public method for decoding
        decode: function (input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;

          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

          while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

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

          output = this._utf8_decode(output);

          return output;
        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
          string = string.replace(/\r\n/g, "\n");
          var utfText = "";

          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
              utfText += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
              utfText += String.fromCharCode((c >> 6) | 192);
              utfText += String.fromCharCode((c & 63) | 128);
            } else {
              utfText += String.fromCharCode((c >> 12) | 224);
              utfText += String.fromCharCode(((c >> 6) & 63) | 128);
              utfText += String.fromCharCode((c & 63) | 128);
            }
          }

          return utfText;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utfText) {
          var string = "";
          var i = 0;
          var c = 0;
          var c1 = 0;
          var c2 = 0;
          var c3 = 0;

          while (i < utfText.length) {
            c = utfText.charCodeAt(i);

            if (c < 128) {
              string += String.fromCharCode(c);
              i++;
            } else if ((c > 191) && (c < 224)) {
              c2 = utfText.charCodeAt(i + 1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
            } else {
              c2 = utfText.charCodeAt(i + 1);
              c3 = utfText.charCodeAt(i + 2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
            }
          }
          return string;
        }
      },
    },

    getAttributes: function (data) {
      this._encodedData = String(data);

      const version = this._getVersion();
      console.log('버전 정보 : ' + version);

      const tag = this._getTag();
      console.log('태그 정보 : ' + tag);

      return this._getAttribute();
    },

    makePostData: function (version, tag, attribute) {
      const hexVersion = this._setInt32(10001);
      const hexTag = this._setString(tag);
      const hexTagLength = this._setInt32(tag.length);
      const hexAttribute = this._setAttributes(attribute);

      var hexPostData = hexVersion + hexTagLength + hexTag + hexAttribute;

      hexPostData += this._setInt32((hexPostData.length / 4) - 1);

      return hexPostData;
    },

    makePostData2: function (version, tag, attribute, ozrFileName) {
      const hexVersion = this._setInt32(10001);
      const hexTag = this._setString(tag);
      const hexTagLength = this._setInt32(tag.length);
      const hexAttribute = this._setAttributes(attribute);

      var hexPostData = hexVersion + hexTagLength + hexTag + hexAttribute;

      hexPostData += this._setBoolean(true);
      hexPostData += this._setInt(1);
      hexPostData += this._setInt32(ozrFileName.length);
      hexPostData += this._setString(ozrFileName);
      hexPostData += '000000000000';
      hexPostData += this._setBoolean(true);
      hexPostData += '00';

      return hexPostData;
    },

    makePostData3: function (version, tag, attribute, odiFileName) {
      const hexVersion = this._setInt32(10001);
      const hexTag = this._setString(tag);
      const hexTagLength = this._setInt32(tag.length);
      const hexAttribute = this._setAttributes(attribute);

      var hexPostData = hexVersion + hexTagLength + hexTag + hexAttribute;

      hexPostData += this._setBoolean(true);
      hexPostData += this._setInt(1);

      hexPostData += this._setInt32(odiFileName.length);
      hexPostData += this._setString(odiFileName);
      hexPostData += '000000000000';
      hexPostData += this._setBoolean(true);
      hexPostData += '01';

      return hexPostData;
    },

    makePostData4: function (version, tag, attribute, postDataObject, odiFileName) {
      const hexVersion = this._setInt32(10001);
      const hexTag = this._setString(tag);
      const hexTagLength = this._setInt32(tag.length);
      const hexAttribute = this._setAttributes(attribute);

      var hexPostData = hexVersion + hexTagLength + hexTag + hexAttribute;

      hexPostData += this._setInt32(380);
      hexPostData += this._setInt32(odiFileName.length);
      hexPostData += this._setString(odiFileName);
      hexPostData += this._setInt32(10000);

      var data = '/pt';
      hexPostData += this._setInt32(data.length);
      hexPostData += this._setString(data);
      hexPostData += '0000';

      hexPostData += this._setAttributes(postDataObject);
      hexPostData += this._setInt32(3);
      hexPostData += this._setInt32(33);
      hexPostData += this._setInt32(17);
      hexPostData += '0000000000000000';

      return hexPostData;
    },

    hexToStr: function (hex) {
      var hex = hex.toString() + '$';//force conversion
      var str = '';
      var subHexValue = '';

      while (true) {
        //hex데이터 길이 가변으로인한 처리
        subHexValue = StrGrab(hex, '$', '$');
        if(subHexValue == '') break;
        //console.log('testKIS_HEX:$' + subHexValue);
        str += String.fromCharCode(parseInt(subHexValue, 16));

        //속도향상 위해서 짜르기.
        hex = hex.substr(subHexValue.length + 1);
      }  
      return str;
    },
    strToHex: function (str) {
      var hex = '';
      var tempHex = '';
      for(var i=0;i<str.length;i++) {
        tempHex = '' + str.charCodeAt(i).toString(16);
        if (tempHex.length == 1)
          tempHex = '0' + tempHex;
        hex += '$' + tempHex;
      }
      return hex;
    },

    //private
    _setAttributes: function (obj) {
      if (typeof obj !== 'object') {
        return;
      }

      var hexAttribute = this._setInt32(Object.keys(obj).length);

      for (var properties in obj) {
        hexAttribute += this._setInt32(properties.length);
        hexAttribute += this._setString(properties);
        hexAttribute += this._setInt32(obj[properties].length);
        hexAttribute += this._setString(obj[properties]);
      }

      return hexAttribute;
    },

    _hexPadding: function (data) {
      if (data.length === 1) {
        return data = '0' + data;
      }
      return data.toUpperCase();
    },

    _setString: function (data) {
      var hexString = '';
      for (var i = 0; i < data.length; i++) {
        var c = (data.charCodeAt(i));

        var d1 = this._hexPadding(((c >>> 8) & 255).toString(16));
        var d2 = this._hexPadding(((c >>> 0) & 255).toString(16));

        hexString += d1;
        hexString += d2;
      }
      return hexString;
    },

    _setInt32: function (data) {
      if (typeof data !== 'number'){
        return;
      }

      var hexString = data.toString(16);

      if (hexString.length === 1) hexString = '0000000' + hexString;
      else if (hexString.length === 2) hexString = '000000' + hexString;
      else if (hexString.length === 3) hexString = '00000' + hexString;
      else if (hexString.length === 4) hexString = '0000' + hexString;

      return hexString.toUpperCase();
    },

    _setInt: function (data) {
      if (typeof data !== 'number'){
        return;
      }

      var hexString = data.toString(16);

      if (hexString.length === 1) hexString = '00000000000' + hexString;
      else if (hexString.length === 2) hexString = '0000000000' + hexString;
      else if (hexString.length === 3) hexString = '000000000' + hexString;
      else if (hexString.length === 4) hexString = '00000000' + hexString;

      return hexString.toUpperCase();
    },

    _setBoolean: function (data) {
      if (typeof data !== 'boolean')
        return;

      if (data){
        return '000001';
      } else {
        return '0000';
      }
    },

    _getVersion: function () {
      const version = parseInt(this._encodedData.substr(0, 8), 16);
      this._encodedData = this._encodedData.substr(8, this._encodedData.length - 8);

      return version;
    },

    _getTag: function () {
      const length = parseInt(this._encodedData.substr(0, 8), 16) * 4;
      const tag = this._hex2ascii(this._encodedData.substr(8, length));

      this._encodedData = this._encodedData.substr(8 + length, this._encodedData.length - 8 + length);

      return tag;
    },

    _getAttribute: function () {
      const length = parseInt(this._encodedData.substr(0, 8), 16);
      this._encodedData = this._encodedData.substr(8, this._encodedData.length - 8);

      console.log('오브젝트 속성 개수 : ' + length);

      var attributeObject = {};

      for (var idx = 0; idx < length; idx++) {
        var sp = 0;
        var ep = 8;
        var hexLen = this._encodedData.substr(sp, ep);
        var len = parseInt(hexLen, 16) * 4;

        sp = ep;
        ep = len;
        var hexAttName = this._encodedData.substr(sp, ep);

        sp += ep;
        ep = 8;
        var attName = this._hex2ascii(hexAttName);
        hexLen = this._encodedData.substr(sp, ep);
        len = parseInt(hexLen, 16) * 4;

        sp += ep;
        ep = len;
        var hexAttValue = this._encodedData.substr(sp, ep);

        sp += ep;
        ep = hexAttValue.length;
        var attValue = this._hex2ascii(hexAttValue);

        this._encodedData = this._encodedData.substr(sp, this._encodedData.length - sp + ep);
        attributeObject[attName] = attValue;

      }
      return attributeObject;
    },

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
  };
}

/**
 *
 * @returns {
 *            {
 *              getFamilyRelationCertificate: getFamilyRelationCertificate,
 *              getMarriageRelationCertificate: getMarriageRelationCertificate,
 *              _ozeFamilyScoutRequest: _ozeFamilyScoutRequest,
 *              _hostUrl: string,
 *              _agent: string,
 *              _tagObject: {
 *                tag1: string,
 *                tag2: string,
 *                tag3: string,
 *                tag4: string
 *              },
 *              _familyRelationFiles: {
 *                file1: string,
 *                file2: string,
 *                file3: string
 *              },
 *              _marriageRelationFiles: {
 *                file1: string,
 *                file2: string,
 *                file3: string
 *              }
 *            }
 *          }
 * @private
 */
function _ozEFamilyScout() {
  return {
    getMyRelationCertificate: function (postDataObject) {
      console.log('기본증명서 일반 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._myRelaRelationFiles);
    },

    getMyRelationCertificate2: function (postDataObject) {
      console.log('기본증명서 상세 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._myRelaRelationFiles2);
    },

    getParentalRelationCertificate: function (postDataObject) {
      console.log('친권후견기본증명서 특정 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._parentalRelationFiles);
    },

    getFamilyRelationCertificate: function (postDataObject) {
      console.log('가족관계증명서 일반 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._familyRelationFiles);
    },

    getFamilyRelationCertificate2: function (postDataObject) {
      console.log('가족관계증명서 상세 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._familyRelationFiles2);
    },

    getMarriageRelationCertificate: function (postDataObject) {
      console.log('혼인관계증명서 일반 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._marriageRelationFiles);
    },

    getMarriageRelationCertificate2: function (postDataObject) {
      console.log('혼인관계증명서 상세 시작');
      return this._ozeFamilyScoutRequest(postDataObject, this._marriageRelationFiles2);
    },

    //기존 로직사용을 위한 변수 useRegexp, 해당 값 1일때 수정 된 버전 사용. defalut는 기존 방식.
    _ozeFamilyScoutRequest: function (postDataObject, fileObject) {
      var postData;
      var response;
      const util = _ozUtils();
      var version = 10001;

      var attribute = {
        un: 'guest',
        p: 'guest',
        s: '-1905',
        // cv: '20140527',
        cv: '20110224',
        t: '',
        i: '',
        o: '',
        z: '',
        j: '',
        d: '-1',
        r: '1',
        rv: '1',
        xi: '',
        xm: '',
        xh: ''
      };

      postData = util.makePostData(version, this._tagObject.tag1, attribute);

      if (!httpRequest.postWithUserAgent(this._agent, this._hostUrl, postData)) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
      }
      response = certManager.Base64ToHex(httpRequest.getB64Result());


      const obj = util.getAttributes(response);

      attribute.s = obj.s || 'dotimestamp';
      attribute.d = obj.d;

      postData = util.makePostData2(version, this._tagObject.tag2, attribute, fileObject.file1);
      if (!httpRequest.postWithUserAgent(this._agent, this._hostUrl, postData)) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
      }

      postData = util.makePostData3(version, this._tagObject.tag3, attribute, fileObject.file2);
      if (!httpRequest.postWithUserAgent(this._agent, this._hostUrl, postData)) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
      }

      postData = util.makePostData4(version, this._tagObject.tag4, attribute, postDataObject, fileObject.file3);
      if (!httpRequest.postWithUserAgent(this._agent, this._hostUrl, postData)) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
      }
      /**
       * oz 통신은 데이터들을 octet stream 으로 받기 때문에, 일반적으로 result를 사용하면 데이터가 안나오거나 깨질 수 있다.
       * 따라서, response 값을 base64 형태로 받아, 이를 javascript 딴에서 decode 해야 데이터를 확인 가능하다.
       */
      response = util.ozBase64.decode(httpRequest.getB64Result());

      response = util.strToHex(response);
      //손실없는 데이터를 보기 위한 로그
      console.log( 'ozHexValue:' + response );
      response = util.hexToStr(StrReplace(response, '$00', ''));
		
      return response;
    },

    _hostUrl: 'http://efamily.scourt.go.kr/ozserver70/server',

    _agent: '{' +
    '"Connection": "keep-alive",' +
    '"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Mobile Safari/537.36",' +
    '"Content-Type": "application/octet-stream"' +
    '"Accept": "*/*"' +
    '"Accept-Encoding": "gzip, deflate"' +
    '"Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"' +
    '}',

    _tagObject: {
      tag1: 'oz.framework.cp.message.repository.OZRepositoryRequestUserLogin',
      tag2: 'oz.framework.cp.message.repositoryex.OZRepositoryRequestItem',
      tag3: 'oz.framework.cp.message.repositoryex.OZRepositoryRequestItem',
      tag4: 'oz.framework.cp.message.FrameworkRequestDataModule',
    },

    _myRelaRelationFiles: {
      file1: '/pt/PtBscCertPc.ozr',
      file2: '/pt/PtBscCertPc.odi',
      file3: 'PtBscCertPc.odi',
    },

    _myRelaRelationFiles2: {
      file1: '/pt/PtBscCertAc.ozr',
      file2: '/pt/PtBscCertAc.odi',
      file3: 'PtBscCertAc.odi',
    },

    _parentalRelationFiles: {
      file1: '/pt/PtBscCertPcuc.ozr',
      file2: '/pt/PtBscCertPcuc.odi',
      file3: 'PtBscCertPcuc.odi',
    },

    _familyRelationFiles: {
      file1: '/pt/PtFmyrltCertPc.ozr',
      file2: '/pt/PtFmyrltCertPc.odi',
      file3: 'PtFmyrltCertPc.odi',
    },

    _familyRelationFiles2: {
      file1: '/pt/PtFmyrltCertAc.ozr',
      file2: '/pt/PtFmyrltCertAc.odi',
      file3: 'PtFmyrltCertAc.odi',
    },

    _marriageRelationFiles: {
      file1: '/pt/PtMrgRltCertPc.ozr',
      file2: '/pt/PtMrgRltCertPc.odi',
      file3: 'PtMrgRltCertPc.odi',
    },

    _marriageRelationFiles2: {
      file1: '/pt/PtMrgRltCertAc.ozr',
      file2: '/pt/PtMrgRltCertAc.odi',
      file3: 'PtMrgRltCertAc.odi',
    }
  };
}

/**
 * _ozKBInsure
 * @returns {
 *            {
 *              getCertificateFromReportName: getCertificateFromReportName
 *            }
 *          }
 * @private
 */
function _ozKBInsure() {
  return {
    getCertificateFromReportName: function (reportName, xmlData) {
      const data = reportName.split('/');
      const oidName = data[2].split('.')[0];

      const postData = 'ozserverexport=true' +
        '&filename=kbinsure.svg' +
        '&connection.dataFromServer=false' +
        '&connection.formfromserver=true' +
        '&exportview=true' +
        '&export.format=svg' +
        '&export.largebundle=true' +
        '&viewer.childcount=0' +
        '&global.concatpage=true' +
        '&viewer.fontdpi=auto' +
        '&insert_tag=' +
        '&connection.reportname=' + httpRequest.URLEncodeAll(reportName, 'UTF-8') +
        '&odi.odinames=' + oidName +
        '&odi.' + oidName + '.pcount=1' +
        '&odi.' + oidName + '.args1=' + httpRequest.URLEncodeAll(xmlData) +
        '&odi.' + oidName + '.usescheduleddata=ozp%3A%2F%2F%2FOzSdmMakerApplet_lig_serverbind.js';

      try {
        console.log('setReadTimeout : 180000');
        httpRequest.setReadTimeout(180000); // 최신버전만 aos 2.3.6 이상 
      } catch(e) {
        console.log('setReadTimeout Error : ' + e.message);
      }

      if (!httpRequest.post('https://ozeussvg.kbinsure.co.kr/oz/serverbind_exportSVG.jsp', postData)) {
        //this.setError(E_IBX_FAILTOGETPAGE);
        return false;
      }
      return httpRequest.GetResult("UTF-8");
    },
  }
}

/**
 * wrapping functions as ozViewer
 * @type {
 *         {
 *           eFamilyScout: {
 *             create: ozViewer.eFamilyScout.create
 *           },
 *           kbinsure: {
 *             create: ozViewer.kbinsure.create
 *           }
 *         }
 *       }
 */
const ozViewer = {
  eFamilyScout: {
    create: function () {
      return _ozEFamilyScout();
    }
  },

  kbinsure: {
    create: function () {
      return _ozKBInsure();
    }
  },
};
