/* jshint -W061, -W082, -W014, -W004, -W038, -W100, -W107 */
var moduleName = '건강보험공단';
var moduleVersion = '2025.4.4.1';
console.log(moduleName + " 스크립트 호출됨.");
console.log('Version: ' + moduleVersion);
console.log('getPlatformName: ' + system.getPlatformName().toUpperCase());

function iSASObject() {
    console.log("iSASObject 생성자 호출");
    this.iSASInOut = {};
}

iSASObject.prototype.log = function (logMsg) {
    try {
        SASLog("iSASObject.Log(" + logMsg + "\")");
    } catch (e) {
        console.log("iSASObject.Log(" + logMsg + "\")");
    }
};

iSASObject.prototype.setError = function (errcode) {
    this.iSASInOut.Output = {};
    this.iSASInOut.Output.ErrorCode = errcode.toString(16).toUpperCase();
    //TODO: 에러 메시지 가져오는 부분...
    this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16));
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

    var changeresult = new TextDecoder('UTF-8').decode(output.toBuffer());
    return changeresult;

};

iSASObject.prototype.removeHTMLComment = function (aStr) {
    var strRmv = aStr;
    while (true) {
        var sTemp = StrGrab(strRmv, "<!--", "-->", 1);
        if (sTemp == "") break;

        strRmv = StrReplace(strRmv, "<!--" + sTemp + "-->", "");
    }

    return strRmv;
};

iSASObject.prototype.isPDF = function(checkResult){
    var isPDF = true;
    //html 기본 태그들로 검증
    if((checkResult.indexOf('<body') > -1 && checkResult.indexOf('</body') > -1) ||
     (checkResult.indexOf('<head') > -1 && checkResult.indexOf('</head') > -1) ||
     (checkResult.indexOf('<html') > -1 && checkResult.indexOf('</html') > -1) ){
         isPDF = false;
     }

     return isPDF;
};

var decodeHtmlEntity = function (str, obj) {
    var result = str.replace(new RegExp("&#(x?)([0-9]([a-zA-Z0-9]));", "g"), function (match, p1, p2, string) {
        //obj.log("match = " + match);
        //obj.log("p1 = " + p1);
        p2 = "%" + p2;
        //obj.log("p2 = " + p2);
        //obj.log("string = " + string);
        //alert(match);
        //alert(p1);    //x
        //alert(p2);    //2F
        //alert(string); //7
        //obj.log("p2 urldecode = " + String.fromCharCode(parseInt(p2,16)));
        //return hex2a(p2);

        return httpRequest.URLDecode(p2);
        //return String.fromCharCode(((p1 == 'x') ? parseInt(p2, 16) : p2));
    });

    return result;
};

// 2020.11.20 패딩값 삭제 함수 추가  
var removePadding = function (str) {
    if(!str){
        return "";
    }
    //안드로이드 모바일에서 한글깨짐으로 인해 한글이 포함되어 있으면 제외
    var kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    var isKor = kor.test(str);
    if(isKor){
        return str;
    }
    
    var arr = [];
    for (var i = 0, l = str.length; i < l; i++) {
        var hex = Number(str.charCodeAt(i)).toString(16);
        if (hex.length % 2 === 1) {
          hex = '0' + hex;
        }
        arr.push(hex);
    }
    var hexString = arr.join('');
    
    if(!hexString){
        return "";
    }
    
    var result = '';
    for (var i = 0; i < hexString.length; i += 2) {
        var text = hexString.substr(i, 2);
        if (text !== '00')
            result += String.fromCharCode(parseInt(text, 16));
    }
    return result;
};

function fnGraphLeft(gender, type, value) {
    //성별, 항목, 값
    console.log("gender:" + gender +" /  type:" + type +" /  value:" + value);

    var waistLeft;
    var result;

    if (type == "허리둘레(cm)") {

        if (gender == '1') {  //남
            waistLeft = Math.round((100 / 180) * value);
            if (waistLeft > 50) {
                result = "표준초과";
            } else {
                result = "정상";
            }
        } else {  //여
            if (waistLeft > 50) {
                result = "표준초과";
            } else {
                result = "정상";
            }
        }

    } else if (type == "체질량지수") {
        if (value < 18.5) {
            result = "경계(저체중)";
        } else if (value > 18.5 && value <= 25) {
            result = "표준";
        } else if (value > 25 && value <= 30) {
            result = "경계(과체중)";
        } else if (value > 30) {
            result = "질환의심(비만)";
        }

    } else if (type == "수축기혈압(mmHg)") {
        if (value <= 120) {
            result = "정상";
        } else if (value > 120 && value <= 140) {
            result = "경계";
        } else if (value > 140) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "이완기혈압(mmHg)") {
        if (value <= 80) {
            result = "정상";
        } else if (value > 80 && value <= 90) {
            result = "경계";
        } else if (value > 90) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "공복혈당(md/dL)" || type == "공복혈당(mg/dL)") {
        if (value <= 100) {
            result = "정상";
        } else if (value > 100 && value <= 126) {
            result = "경계";
        } else if (value > 126) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "총콜레스테롤(md/dL)" || type == "총콜레스테롤(mg/dL)") {
        if (value <= 200) {
            result = "정상";
        } else if (value > 200 && value <= 240) {
            result = "경계";
        } else if (value > 240) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "HDL콜레스테롤(mg/dL)") {
        if (value >= 60) {
            result = "정상";
        } else if (value >= 40 && value < 60) {
            result = "경계";
        } else if (value && value < 40) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "중성지방(mg/dL)") {
        if (value <= 150) {
            result = "정상";
        } else if (value > 150 && value <= 200) {
            result = "경계";
        } else if (value > 200) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "LDL콜레스테롤(mg/dL)") {
        if (value <= 130) {
            result = "정상";
        } else if (value > 130 && value <= 160) {
            result = "경계";
        } else if (value > 160) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "요단백") {
        if (value == null || value == "" || value == '1') {
            result = "정상";
        } else if (value == '2') {
            result = "경계";
        } else {
            result = "질환의심";
        }

    } else if (type == "혈청크레아티닌(mg/dL)") {
        if (value <= 1.5) {
            result = "정상";
        } else if (value >= 1.6) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "신사구체여과율 (e-GFR)" || type == "신사구체여과율(e-GFR)") {
        if (value >= 60) {
            result = "정상";
        } else if (value < 60) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "혈색소(d/dL)" || type == "혈색소(g/dL)") {
        if (gender == '1') {   //남
            if (value >= 13) {
                result = "정상";
            } else if (value >= 12 && value < 13) {
                result = "경계";
            } else if (value < 12) {
                result = "질환의심";
            } else {
                result = "정상";
            }
        } else {    //여
            if (value >= 12) {
                result = "정상";
            } else if (value >= 10 && value < 12) {
                result = "경계";
            } else if (value < 10) {
                result = "질환의심";
            } else {
                result = "정상";
            }
        }

    } else if (type == "AST(SGOP)(U/L)" || type == "AST(SGOT)(IU/L)") {
        if (value <= 41) {
            result = "정상";
        } else if (value > 41 && value <= 51) {
            result = "경계";
        } else if (value > 51) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "ALT(SFPT)(U/L)" || type == "ALT(SGPT)(IU/L)") {
        if (value <= 36) {
            result = "정상";
        } else if (value > 36 && value <= 46) {
            result = "경계";
        } else if (value > 47) {
            result = "질환의심";
        } else {
            result = "정상";
        }

    } else if (type == "감마지티피(U/L)") {
        if (gender == '2') {   //여
            if (value <= 36) {
                result = "정상";
            } else if (value > 36 && value <= 46) {
                result = "경계";
            } else if (value > 46) {
                result = "질환의심";
            } else {
                result = "정상";
            }
        } else {    //남
            if (value < 15) {
                result = "정상";
            } else if (value > 64 && value <= 78) {
                result = "경계";
            } else if (value > 78) {
                result = "질환의심";
            } else {
                result = "정상";
            }
        }
    } else {
        result = '';
    }

    return result;
}

function retrievePatchResult(idx, From, To){

    console.log("idx: " + idx);
    console.log("From: " + From);
    console.log("To: " + To);

    if(!From || !To){
        From = "-5";
        To = "0";
    }
    
    // 이전페이지
    if(idx == "1"){
        var sizeFr = From;
        var sizeTo = To;
        console.log("s from ~ to: " + sizeFr + ', ' + sizeTo);
        
        sizeFr *= 1;
        sizeTo *= 1;
        
        sizeFr += -5;
        sizeTo += -5;
        
        console.log("s from ~ to: " + sizeFr + ', ' + sizeTo);
        
        if(sizeFr < -10){
            console.log("과거 10년 이상은 조회할 수 없습니다.");
            return false;
        }

        return [sizeFr, sizeTo];
    
    // 다음페이지
    }else if(idx == "2"){
        
        var sizeFr = patchResult_Fr_Size;
        var sizeTo = patchResult_To_Size;
        
        console.log("s from ~ to: " + sizeFr + ', ' + sizeTo);
        
        sizeFr *= 1;
        sizeTo *= 1;
        
        sizeFr += 5;
        sizeTo += 5;
        
        console.log("s from ~ to: " + sizeFr + ', ' + sizeTo);
        
        if(sizeTo > 0){
            console.log("당해년도 이상은 조회할 수 없습니다.");
            return false;
        }

        return [sizeFr, sizeTo];
    }
}

var 민원신청조회 = function () {
    //생성자
    console.log("건강보험공단 민원신청조회 생성자 호출");
    this.errorMsg = "";
    this.host = "";
    this.url = "";
    this.param = "";
    this.postData = "";
    this.xgate_addr = "wwwwas.nhis.or.kr:443:8080";
    this.xgate_addr_sign = "si4n.nhis.or.kr:1443:8080";
    this.bLogIn = false;
    this.ResultStr = "";
    this.regNo1 = "";
    this.주민사업자번호 = "";
    //브라우저 인증서 방식
    this.IsWebCert = false;
    this.IsFinCert = false;

    this.생활습관설문내역 = "";

    // 간편인증에서 사용하는 변수
    this.issueToken = '';
    this.txId = '';
    this.simpleId = '';
    this.reqTxId = '';
    this.cxId = '';
    this.userName = '';
    this.userSsn = '';
    this.userPhone = '';
    this.telcoTycd = '';

    // netfunnel 통신에 필요한 헤더 추가
    this.userAgent = '{"Accept":"*/*",';
    this.userAgent += '"Connection":"keep-alive",';
    this.userAgent += '"Referer":"https://www.nhis.or.kr/",';
    this.userAgent += '"Content-type":"undefined",';
    this.userAgent += '"Accept-Language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",';
    this.userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",';
    this.userAgent += '"Accept-Encoding":"gzip, deflate, br"}';
    this.lastTime = 0;
    this.delayTimeSetting = 500;

    this.sleep = function (milliseconds) {
        if ((system.sleep + "") != "undefined") {
            console.log("*****system.sleep");
            system.sleep(milliseconds);
        } else {
            console.log("*****js.while sleep");
            var start = new Date().getTime();
            while (true) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        }
    };

    this.netfunnel = function(opcode){
        var nCount = 1;
        while(true){
            if(this.delayTimeSetting > 2000) this.delayTimeSetting = 2000;
            if(nCount++ > 10) {
                this.setError(E_IBX_FAILTOGETPAGE + 3);
                return E_IBX_FAILTOGETPAGE + 3;
            }

            if(this.lastTime != 0){
                var lTime = (new Date().getTime()) - this.lastTime;
                if(lTime < this.delayTimeSetting){
                    this.sleep(this.delayTimeSetting - lTime);
                }
            }

            this.lastTime = (new Date().getTime());
            if (opcode == '5004') {
                //this.sleep(3000);
                // netfunnel 통신에 필요한 헤더 추가
                this.userAgent = '{"Accept":"*/*",';
                // this.userAgent += '"Cookie":"",';
                //this.userAgent += '"Content-type":"undefined",';
                this.userAgent += '"Connection":"keep-alive",';
                this.userAgent += '"Accept-Language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",';
                this.userAgent += '"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",';
                this.userAgent += '"Referer":"https://www.nhis.or.kr/",';
                this.userAgent += '"Accept-Encoding":"gzip, deflate, br"}';

                //this.sleep(2000);
                this.url = 'https://netfunnel.nhis.or.kr/ts.wseq?opcode=5004' + 
                            '&key=' + this.netfunnelKey +
                            '&nfid=0&prefix=NetFunnel.gRtype=5004;&js=yes&' + this.lastTime.toString();
                if (httpRequest.getWithUserAgent(this.userAgent, this.url) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE + 2);
                    return E_IBX_FAILTOGETPAGE + 2;
                }
                var ResultStr = httpRequest.result + '';
                this.log('NetFunnel1_end : [' + ResultStr + ']');
                return ResultStr;
            } else if(opcode == '5101') {
                //this.sleep(3000);
                // netfunnel 통신에 필요한 헤더 추가
                this.userAgent = '{"Accept":"*/*",';
                // this.userAgent += '"Cookie":"",';
                //this.userAgent += '"Content-type":"undefined",';
                this.userAgent += '"Connection":"keep-alive",';
                this.userAgent += '"Accept-Language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",';
                this.userAgent += '"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",';
                this.userAgent += '"Referer":"https://www.nhis.or.kr/",';
                this.userAgent += '"Accept-Encoding":"gzip, deflate, br"}';

                if (httpRequest.getWithUserAgent(this.userAgent, "https://netfunnel.nhis.or.kr/ts.wseq?opcode=5101&nfid=0&prefix=NetFunnel.gRtype=5101;&sid=service_1&aid=act_26&js=yes&" + this.lastTime.toString()) == false) {
                    this.log("repeatCnt:::" + (nCount - 1).toString());
                    this.delayTimeSetting += 500;
                    continue;
                }
                var ResultStr = httpRequest.result + '';
                this.log('NetFunnel : [' + ResultStr + ']');
                // 해당 값을 가져와서 날려야 됨.
                var key = StrGrab(httpRequest.result, 'key=', '&');
                if(key == ''){
                    this.log("repeatCnt:::" + (nCount - 1).toString());
                    this.delayTimeSetting += 500;
                    continue;
                }
                return key;
            }
        }
    };
};

민원신청조회.prototype = Object.create(iSASObject.prototype);

민원신청조회.prototype.RemoveComment = function (aStr) {
    var strRmv = aStr;
    while (true) {
        var sTemp = StrGrab(strRmv, "<!--", "-->", 1);
        if (sTemp == "") break;

        strRmv = StrReplace(strRmv, "<!--" + sTemp + "-->", "");
    }

    return strRmv;
};


민원신청조회.prototype.onCertLogin = function (input, password) {
    console.log("민원신청조회 onCertLogin 호출[" + input + "]" + moduleVersion);

    system.setStatus(IBXSTATE_LOGIN, 30);

    var 인증서등록 = input.인증서등록;
    var 자동등록여부 = input.자동등록여부;

    if (!인증서등록) {
        인증서등록 = '1';
    }
    if (인증서등록 != '1' && 인증서등록 != '2') {
        this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
        return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
    }
    this.log("FINCERT_Input_1:" + certManager.Base64Encode(JSON.stringify(input)));
    var plain = '건강하십시오! 국민건강보험 본인인증서비스 입니다.';
    this.log('plain :' + plain);

    this.xgate_addr = "www.nhis.or.kr:51443:51444";
    this.host = 'https://www.nhis.or.kr';
    this.url = '/nhis/etc/personalLoginPage.do';
    if (httpRequest.get(this.host + this.url) == false) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
    }

    var s = '';
    s += '-----BEGIN CERTIFICATE-----\n';
    s += 'MIIDqzCCApOgAwIBAgICDU4wDQYJKoZIhvcNAQEFBQAwgZIxCzAJBgNVBAYTAktS\n';
    s += 'MR4wHAYDVQQKExVTb2Z0Zm9ydW0gQ29ycG9yYXRpb24xHjAcBgNVBAsTFVNlY3Vy\n';
    s += 'aXR5IFJORCBEaXZpc2lvbjEcMBoGA1UEAxMTU29mdGZvcnVtIFB1YmxpYyBDQTEl\n';
    s += 'MCMGCSqGSIb3DQEJARYWY2FtYXN0ZXJAc29mdGZvcnVtLmNvbTAeFw0xNzA1MTcw\n';
    s += 'NjA3MzJaFw0yMjA1MTYwNjA3MzJaMFgxCzAJBgNVBAYTAktSMQ0wCwYDVQQKDAR0\n';
    s += 'ZXN0MQ0wCwYDVQQLDAR0ZXN0MQ0wCwYDVQQDDAR0ZXN0MRwwGgYJKoZIhvcNAQkB\n';
    s += 'Fg10ZXN0QHRlc3QuY29tMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgF7b+1hk\n';
    s += 'S/PJzDAsLDBQp4n80xMknloopckKtz+43y4cmLLS9aqFS4Eir3F8hkKvrShCN2LH\n';
    s += '7eTQCX0r2mid8IaweJ6azOxeZ06KVEKOxquBGYRn4Y10bT2UU0PtxjqtZv0Ay2++\n';
    s += 'uybyI6Ggf2bpIeVtUjiWorZgkcHZfhiOLWUtAgMBAAGjgcgwgcUwHwYDVR0jBBgw\n';
    s += 'FoAULkmrJ4royK+XdTfei3S7JA4NJ18wHQYDVR0OBBYEFOH6c0HaTtXAih8BCl6M\n';
    s += '0YO3xnPiMAsGA1UdDwQEAwIEsDAMBgNVHRMBAf8EAjAAMGgGA1UdHwRhMF8wXaBb\n';
    s += 'oFmGV2xkYXA6Ly9sZGFwLnNvZnRmb3J1bS5jby5rcjozODkvY249c2Usbz1zb2Z0\n';
    s += 'Zm9ydW0sYz1rcj9jZXJ0aWZpY2F0ZVJldm9jYXRpb25saXN0O2JpbmFyeTANBgkq\n';
    s += 'hkiG9w0BAQUFAAOCAQEAEjbWxgm3/1Im34vrMXiZOQd0McKbyPn+0KcRjYz+dEUK\n';
    s += 'LV+sf8xt3e0Enre24HYLXVLATrjlgb7ilhcNimkHAS+ct5gRjnmcCEt3ENA/TIdS\n';
    s += 'exkXU92i9HM78YfAi1vPcwALk5f7LGquU0Q5kufSdtyvEm3ChP6JX8eOzbh9DhNu\n';
    s += 'KOSmotFOGA7GRR7HuyVro19phEEYyvi2zERZy0VFsyJK12zajB7yeoHuwnSfJs9v\n';
    s += 'okydmZNmAWiXy3edMip/H+xI0p3DqcUUqqGq/aW0cw8HDjPTtF+2aBgCviAC/RhS\n';
    s += 'Cy37oyBLmWd0F7U53C94D1ejvu/Co+uAhEUjCD44pw==\n';
    s += '-----END CERTIFICATE-----\n';
    s += '';

    var signedMsg, vidMsg;
    if (!XecureWeb.findCert(JSON.stringify(input.인증서))) {
        this.log("인증서를 찾을 수 없습니다.");
        this.setError(E_IBX_CERTIFY_NOT_FOUND);
        return E_IBX_CERTIFY_NOT_FOUND;
    } else {
        this.log("인증서 찾음.");
    }

    if (!XecureWeb.verifyPassword(password)) {
        this.log("XecureWeb.verifyPassword 실패");
        this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
        return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
    } else {
        this.log("XecureWeb.verifyPassword 성공");
    }

    signedMsg = XecureWeb.signDataCMS(this.xgate_addr_sign, plain, password);
    XecureWeb.envelopIdNum(this.xgate_addr, password, s, ""); // 주민등록번호 세팅 초기화 (80004102 서명문에 문제가 있습니다. \n입력하신 아이디와 인증서 정보가 일치하지 않습니다.)	
    vidMsg = XecureWeb.getVIDInfo();
    this.log("signedMsg3::::" + signedMsg);
    this.log("vidMsg3::::" + vidMsg);

    if ((!signedMsg) || (signedMsg == "전자서명에 실패했습니다.")) {
        this.log("인증서 비밀번호를 확인해 주시기 바랍니다.");
        this.setError(E_IBX_CERTIFY_UNKNOWN);
        return E_IBX_CERTIFY_UNKNOWN;
    }

    // signedMsg값으로 대체해서 사용 (연구소) - 사이트에서도 같은 값으로 보내주고 있음...
    if (vidMsg == "전자서명에 실패했습니다.") {
        this.log("인증서 비밀번호를 확인해 주시기 바랍니다.");
        this.setError(E_IBX_CERTIFY_UNKNOWN);
        return E_IBX_CERTIFY_UNKNOWN;
    }
    if (!vidMsg) { vidMsg = signedMsg; }

    var errorMessage = "";

    // 자동등록여부 Y인 경우, 로그인 시도 전 공인인증서 등록 우선 실행
    if (자동등록여부 == 'Y') {
        if (!input.주민사업자번호) {
            this.setError(E_IBX_REGNO_RESIDENT_NOTENTER);
            return E_IBX_REGNO_RESIDENT_NOTENTER;
        }

        //1. 암호화 되어 있을 경우 
        if (this.주민사업자번호.isSecurData()) {
            this.log('주민등록번호 SASSecurData 포맷!');
            if (isNaN(this.주민사업자번호.getPlainText()) || this.주민사업자번호.getLength() != 13) {
                this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                return E_IBX_REGNO_RESIDENT_INVALID;
            }
        } else {
            this.log('주민등록번호 일반 포맷!');
            if (isNaN(input.주민사업자번호) || input.주민사업자번호.length != 13) {
                this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                return E_IBX_REGNO_RESIDENT_INVALID;
            }
        }

        //java엔진에서 메모리상에 올라가 있는 개인정보를(인증서비밀번호, 주민등록번호 등) 제거하기 위해 임의의 replcae 호출부 추가
        "dummy".replace(/./g, "*");

        this.url = '/nhis/etc/regPersonalSignNew.do';
        this.postData = 'logintype=';
        this.postData += '&idn=';
        this.postData += '&signedMsg=' + httpRequest.URLEncodeAll(signedMsg, 'UTF-8');
        this.postData += '&vidMsg=' + httpRequest.URLEncodeAll(vidMsg, 'UTF-8');
        this.postData += '&burl=';
        this.postData += '&site=main';
        this.postData += '&plain=' + httpRequest.URLEncodeAll(plain, 'UTF-8');
        this.postData += '&userIdForAuth=' + this.주민사업자번호.getPlainText();
        this.postData += '&juminNo1=' + this.주민사업자번호.getPlainTextWithRange(0, 6);
        this.postData += '&juminNo2=' + this.주민사업자번호.getPlainTextWithRange(6, 7);

        this.log('postData :[' + this.postData + ']');
        if (httpRequest.post(this.host + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        this.log("NHIS 인증서등록 : [" + httpRequest.result + ']');
        ///////////// 인증서등록 오류 체크 ////////////////
        errorMessage = StrGrab(httpRequest.result, 'var msg = "', '";');
        if (errorMessage != "" && errorMessage != "null") {
            if (errorMessage.indexOf("이미 등록한 공동인증서입니다") > -1) {
                this.log("기등록 인증서. 로그인 페이지 이동");
            } else {
                if ((errorMessage.indexOf("존재하지 않는 주민등록번호 입니다.") > -1) ||
                    (errorMessage.indexOf("로그인 시 정보 조회 오류가 발생하였습니다.") > -1)) {
                    this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                    return E_IBX_REGNO_RESIDENT_INVALID;
                } else if (errorMessage.indexOf("입력하신 주민등록번호(사업자등록번호)가 일치하지 않습니다.") > -1 || errorMessage.indexOf('입력하신 아이디와 인증서 정보가 일치하지 않습니다') > -1) {
                    this.setError(E_IBX_LOGIN_REG_CERT_FAIL);
                    return E_IBX_LOGIN_REG_CERT_FAIL;
                } else if (errorMessage.indexOf('로그인 공인인증 검증 시 오류가 발생하였습니다') > -1) {
                    this.setError(E_IBX_CERTIFY_UNKNOWN); // 폐기된 인증서에서 제출시 발생
                    this.iSASInOut.Output.ErrorMessage = errorMessage;
                    return E_IBX_CERTIFY_UNKNOWN;
                } 
            }
        }
    }

    this.netfunnelKey = '';
    ResultStr = '';
    this.netfunnelKey = this.netfunnel("5101");
    if (Failed(this.netfunnelKey)) {
        return this.netfunnelKey;
    }

    var Headers = '{' +
                        '"User-Agent":"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",' +
                        '"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",' +
                        '"Accept-Encoding":"gzip, deflate, br",' +
                        '"Referer":"https://www.nhis.or.kr/nhis/etc/personalLoginPage.do",' +
                        '"Accept-Language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",' +
                        '"Content-Type":"application/x-www-form-urlencoded"}';

    // 사이트 
    // 사이트 쿼리상으로도 주민등록번호 그대로 노출되고 있어 암호화처리 굳이 추가는 안함..
    this.url = '/nhis/etc/personalSignLoginNew.do';

    this.postData = 'logintype=';
    this.postData += '&idn=';
    this.postData += '&signedMsg=' + httpRequest.URLEncodeAll(signedMsg, 'UTF-8');
    this.postData += '&vidMsg=' + httpRequest.URLEncodeAll(vidMsg, 'UTF-8');
    this.postData += '&burl=';
    this.postData += '&site=main';
    this.postData += '&plain=' + httpRequest.URLEncodeAll(plain, 'UTF-8');
    this.postData += '&userIdForAuth=';
    this.postData += '&ci=';
    this.postData += '&reqTxId=';
    this.postData += '&netfunnelKey=' + httpRequest.URLEncodeAll(this.netfunnelKey, 'UTF-8');
    this.postData += '&juminNo1=';
    this.postData += '&juminNo2=';
    this.postData += '&hidfrmId=trxTbwbla01VO';

    this.log('postData_Login :[' + this.postData + ']');
    // 재사용을 위한 변수
    var postData_origin = this.postData;
    if (httpRequest.postWithUserAgent(Headers, this.host + this.url, this.postData) == false) {
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
    }
    ResultStr = httpRequest.result;
    this.log("NHIS 로그인 : [" + ResultStr + ']');

    errorMessage = StrGrab(ResultStr, 'var msg = "', '";');
    this.log('errorMessage : [' + errorMessage + ']');
    this.log("FINCERT_Input_2:" + certManager.Base64Encode(JSON.stringify(input)));

    if (인증서등록 == '1') {
        // 인증서 등록 후 로그인 재시도
        if ((errorMessage.indexOf("인증서를 등록하신 후에 로그인해주세요") > -1)){

            if (!input.주민사업자번호) {
                this.setError(E_IBX_REGNO_RESIDENT_NOTENTER);
                return E_IBX_REGNO_RESIDENT_NOTENTER;
            }

            //1. 암호화 되어 있을 경우 
            if (this.주민사업자번호.isSecurData()) {
                this.log('주민등록번호 SASSecurData 포맷!');
                if (isNaN(this.주민사업자번호.getPlainText()) || this.주민사업자번호.getLength() != 13) {
                    this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                    return E_IBX_REGNO_RESIDENT_INVALID;
                }
            } else {
                this.log('주민등록번호 일반 포맷!');
                if (isNaN(input.주민사업자번호) || input.주민사업자번호.length != 13) {
                    this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                    return E_IBX_REGNO_RESIDENT_INVALID;
                }
            }

            //java엔진에서 메모리상에 올라가 있는 개인정보를(인증서비밀번호, 주민등록번호 등) 제거하기 위해 임의의 replcae 호출부 추가
            "dummy".replace(/./g, "*");

            this.url = '/nhis/etc/regPersonalSignNew.do';

            this.postData = 'logintype=';
            this.postData += '&idn=';
            this.postData += '&signedMsg=' + httpRequest.URLEncodeAll(signedMsg, 'UTF-8');
            this.postData += '&vidMsg=' + httpRequest.URLEncodeAll(vidMsg, 'UTF-8');
            this.postData += '&burl=';
            this.postData += '&site=main';
            this.postData += '&plain=' + httpRequest.URLEncodeAll(plain, 'UTF-8');
            this.postData += '&userIdForAuth=' + this.주민사업자번호.getPlainText();
            this.postData += '&juminNo1=' + this.주민사업자번호.getPlainTextWithRange(0, 6);
            this.postData += '&juminNo2=' + this.주민사업자번호.getPlainTextWithRange(6, 7);

            this.log('postData :[' + this.postData + ']');
            if (httpRequest.post(this.host + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            this.log("NHIS 인증서등록 : [" + httpRequest.result + ']');

            // 인증서 등록이 완료된 것은 로그인 재시도
            if (httpRequest.result.indexOf('>등록이 완료<') > -1) {
                // 사이트 
                // 사이트 쿼리상으로도 주민등록번호 그대로 노출되고 있어 암호화처리 굳이 추가는 안함..
                this.url = '/nhis/etc/personalSignLoginNew.do';

                if (httpRequest.post(this.host + this.url, postData_origin) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log("NHIS 로그인_2 : [" + ResultStr + ']');

                var errorMessage = StrGrab(ResultStr, 'var msg = "', '";"');
                this.log('errorMessage_2 : [' + errorMessage + ']');
            } else {

                this.log('인증서 등록 실패');

                var errorMessage = StrGrab(httpRequest.result, 'var msg = "', '";');
                this.log('errorMessage_3 : [' + errorMessage + ']');
            }
        }

        ///////////// 인증서등록 오류 체크 ////////////////
        if (errorMessage != "" && errorMessage != "null") {
            if ((errorMessage.indexOf("존재하지 않는 주민등록번호 입니다.") > -1) ||
                (errorMessage.indexOf("로그인 시 정보 조회 오류가 발생하였습니다.") > -1)) {
                this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                return E_IBX_REGNO_RESIDENT_INVALID;
            } else if (errorMessage.indexOf("입력하신 주민등록번호(사업자등록번호)가 일치하지 않습니다.") > -1 || errorMessage.indexOf('입력하신 아이디와 인증서 정보가 일치하지 않습니다') > -1) {
                this.setError(E_IBX_LOGIN_REG_CERT_FAIL);
                return E_IBX_LOGIN_REG_CERT_FAIL;
            } else if (errorMessage.indexOf('로그인 공인인증 검증 시 오류가 발생하였습니다') > -1) {
                this.setError(E_IBX_CERTIFY_UNKNOWN); // 폐기된 인증서에서 제출시 발생
                this.iSASInOut.Output.ErrorMessage = errorMessage;
                return E_IBX_CERTIFY_UNKNOWN;
            } 
        }
    }

    //공통 로그인 오류처리
    if (errorMessage != "" && errorMessage != "null") {
        if (errorMessage.indexOf("인증서를 등록하신 후에 로그인해주세요") > -1 ||
            errorMessage.indexOf("인증서로 로그인 하시기 바랍니다") > -1) {
            this.setError(E_IBX_CERTIFY_NOT_REGISTER);
            return E_IBX_CERTIFY_NOT_REGISTER;
        }
        if (errorMessage.indexOf("인증서가 폐기") > -1) {
            this.setError(E_IBX_CERTIFY_EXCEED_DATE);
            return E_IBX_CERTIFY_EXCEED_DATE;
        }else if(errorMessage.indexOf('사용자 정보를 저장하시겠습니까?') > -1){
            this.setError(E_IBX_NEED_CONNECT_SERVICE);
            return E_IBX_NEED_CONNECT_SERVICE;
        } else {
            this.log("알 수 없는 오류 : [" + errorMessage + "]");
            this.setError(E_IBX_CERTIFY_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = errorMessage;
            return E_IBX_CERTIFY_UNKNOWN;
        }
    }   
    
    if (ResultStr.indexOf('>시스템 장애가 발생하였습니다.<') > -1) {
        this.setError(E_IBX_SITE_INTERNAL);
        return E_IBX_SITE_INTERNAL;
    }

    if (ResultStr.indexOf('>로그아웃<') < 0) {
        this.setError(E_IBX_LOGIN_FAIL);
        return E_IBX_LOGIN_FAIL;
    }

    this.ResultStr = ResultStr;
    return S_IBX_OK;
};


민원신청조회.prototype.로그인 = function (aInput) {
    console.log("민원신청조회.NHIS 로그인 호출[" + aInput + "]" + moduleVersion);

    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = dec(aInput.Input);

        this.log('input.로그인방식 : ' + input.로그인방식);
        if (input.인증서 && input.인증서.비밀번호) this.iSASInOut.Input.인증서.비밀번호 = input.인증서.비밀번호.replace(/./g, "*");
        if (input.주민사업자번호) this.iSASInOut.Input.주민사업자번호 = input.주민사업자번호.replace(/./g, "*");

        // 미입력시 인증서
        if (!input.로그인방식) { input.로그인방식 = 'CERT'; }

        this.regNo1 = "";
        this.주민사업자번호 = "";
        try {
            this.주민사업자번호 = sas.SecureData.create(input.주민사업자번호 ? input.주민사업자번호 : "");
            if (this.주민사업자번호.isSecurData()) {
                this.log('주민사업자번호 SASSecurData 포맷!');
            } else {
                this.log('주민사업자번호 일반 포맷!');
            }
            
            if (this.주민사업자번호.getPlainText()) {
                this.log("this.주민사업자번호 is true!!!");
                this.regNo1 = (this.주민사업자번호 ? this.주민사업자번호 : '');
            } else {
                this.log("this.주민사업자번호 is false!!!");
            }
        } catch (e) {
            this.setError(E_IBX_FAILTOCOMFUNC);
            this.iSASInOut.Output.ErrorMessage = 'iSAS보안모듈 호출에 실패하였습니다.';
            return E_IBX_FAILTOCOMFUNC;
        }

        // 간편인증에서 사용하는 변수
        this.provider = "";
        this.simpleAuthentication = false;   // 간편인증 확인을 위한 변수

        //농협 redirect 추가
        this.host = 'https://www.nhis.or.kr/nhis/index.do';
        if (httpRequest.get(this.host) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log('nhis/index.do : [' + ResultStr + ']');

        if (ResultStr.indexOf("No backend server available for connection") > -1) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        if (input.로그인방식 == 'CERT') {
            // 인증서 로그인..

            if (!input.인증서) {
                this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
                return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
            }

            var certpath = input.인증서.이름;
            var password = removePadding(input.인증서.비밀번호);  

            if (!certpath && !input.인증서.인증서명) {
                this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
                return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
            }
            if (!password) {
                this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
                return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
            }

            rtn = this.onCertLogin(input, password);
            if (rtn != S_IBX_OK) {
                return rtn;
            }
            this.log("NHIS 로그인 S_IBK_OK");
        } else {
            this.log("알수 없는 로그인 타입");
            this.setError(E_IBX_LOGIN_TYPE_ERROR);
            return E_IBX_LOGIN_TYPE_ERROR;
        }

        this.bLogIn = true;
        this.log("this.bLogIn=" + this.bLogIn);

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
        this.log("민원신청조회.NHIS 로그인 호출 finally");
    }
};


민원신청조회.prototype.보안문자_음성듣기 = function (aInput) {
    this.log("민원신청조회 보안문자_음성듣기 호출[" + aInput + "]");
    system.setStatus(IBXSTATE_CHECKPARAM, 10);

    try {
        this.host = "https://www.nhis.or.kr";
        this.url = "/cms/CaptCha.jsp";
        if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }

        var Captcha = httpRequest.getB64Result() + "";
        this.log("Captcha :[" + Captcha + " ]");

        if (Captcha == '') {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        //2. Voice
        var ran = Math.random();
        this.url = "/cms/captcha/audio.do?lan=kor&rand=" + ran + "&agent=msie";
        if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }

        var VoiceCaptcha = httpRequest.getB64Result() + "";
        this.log("VoiceCaptcha :[" + VoiceCaptcha + " ]");

        var KoVoiceNumber = ["FCFEF7FEEFFEE9FED0FEBEFEA3FEA2FEB2FEB9FEB7FEB0FEA0FE9DFEA3FEABFEBAFEBEFEC3FEC8FEDCFEE8FEFEFE04000B000D001200",		//0
                                "F7FEF4FEFAFEFAFEF2FEE1FEE1FEEDFEF1FEE4FED7FEC7FEC8FED0FED1FECAFEC9FEC2FEB6FE95FE8FFEA6FEB6FEAEFE99FE7DFF7FFF",		//1
                                "6CFF7EFF9EFE9CFE85FE89FEBFFED9FEDFFED9FEEFFE09003B004B006900790092FF98FFAFFFBFFFC6FFBBFFBAFFCDFFE5FFD5FFA7FF",		//2
                                "FEF8FEFDFEFCFEFCFE06000E000F000800FAFEF6FEF8FEFBFE0000050014001D00250021000C000100FCFE00000F0016001B001B0019",		//3
                                "0020001B000F000D00130017001B001B001B001D00230024001A00130009000B0018001F002700270020001C00140010000A0009000B",		//4
                                "96FE8CFE8DFE98FE9BFE94FE90FE90FE94FE9DFEA6FEC0FECEFEE0FEE9FE00FF0A001D0026003C00430044004200490050005A005C00",		//5
                                "2A002D002B00280021001A000700FFFEF8FEFDFE08000A000200FFFEFEFE00FF01000000F7FEF2FEEBFEE8FEE1FEDFFEE2FEE7FEF0FE",		//6
                                "D8FECFFECEFEDBFEE3FEE2FED9FECEFECDFEC9FEC7FECCFED3FED7FECEFEBEFEBFFECDFED0FEC2FEB8FEB0FEB5FECAFED0FEC1FEB3FE",		//7
                                "FEF1FEF3FEF2FEEFFEEDFEF0FEF3FEEDFEDAFED8FEEBFEF5FEF1FEE6FED9FED9FED5FED1FED2FEDAFEDEFED4FEC7FED0FEECFEEDFECA",		//8
                                "2F0028002700260024001D001C00220025002300200023002A003B003E0034002C0025002700290027001F001D002300280028002400"];	//9

        VoiceCaptcha = certManager.Base64ToHex(VoiceCaptcha + "") + '';
        VoiceCaptcha = VoiceCaptcha.toUpperCase();
        this.log("VoiceCaptcha Hex :[" + VoiceCaptcha + " ]");
        var numbers_Find = [];
        var numbers_Map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var j = 0;
        for (var i = 0; i < KoVoiceNumber.length; i++) {
            var substr = VoiceCaptcha;
            var depth = 0;
            while (true) {
                var findIndex = substr.indexOf(KoVoiceNumber[i]);
                if (findIndex == -1) break;
                numbers_Find[j++] = { "value": i, "index": findIndex + depth };
                substr = substr.substr(findIndex + KoVoiceNumber[i].length);
                depth += findIndex + KoVoiceNumber[i].length;
            }
        }
        console.log("numbers_Find:[" + JSON.stringify(numbers_Find) + "]");
        //numbers_Find:[[{"value":2,"index":79516},{"value":2,"index":128916},{"value":2,"index":38292},{"value":3,"index":122682},{"value":4,"index":43586},{"value":9,"index":173448}]]

        numbers_Find.sort(function (a, b) {
            return parseInt(a.index) - parseInt(b.index);
        });

        console.log("numbers_Find Sort:[" + JSON.stringify(numbers_Find) + "]");

        var 보안문자 = '';
        for (i = 0; i < 6; i++) {
            보안문자 = 보안문자 + numbers_Find[i].value;
        }

        return 보안문자;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("민원신청조회 보안문자_음성듣기 finally");
    }
};

//html tag 제거 함수
민원신청조회.prototype.removeTags = function (str) {
    if (str === null || str === "") return '';
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
};

민원신청조회.prototype.removeSpace = function (aStr) {
    var sResult = "";
    var sChar1, sChar2;

    if (aStr.indexOf(" ") >= 0) {
        for (var i = 0; i < aStr.length; i++) {
            if (i == 0) {
                sChar1 = "";
            } else {
                sChar1 = aStr.charAt(i - 1);
            }

            sChar2 = aStr.charAt(i);

            if (((sChar1 == " ") && (sChar2 == " ")) ||
                ((sChar1 == undefined) && (sChar2 == undefined))) {
                continue;
            }

            sResult = sResult + sChar2;
        }
    } else {
        sResult = aStr;
    }

    return sResult;
};


민원신청조회.prototype.건강검진결과조회 = function (aInput) {
    this.log("건강보험공단 건강검진결과조회 호출[" + aInput + "] " + moduleVersion);
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        var input = dec(aInput.Input);
        var 보안문자 = input.보안문자;
        var 조회구분 = input.조회구분; // 미입력,1: 목록+상세, 2: 목록
        var 보안문자자동제출 = false; // N: 보안문자 호출, 미입력, Y: 자동제출(음성듣기 호출)

        if (!input.보안문자자동제출 || input.보안문자자동제출 == 'Y') {// 미입력, Y: 자동제출
            보안문자자동제출 = true;
        } else if (input.보안문자자동제출 == 'N') {
            보안문자자동제출 = false;
        } else {
            this.setError(E_IBX_RANDOM_DATA_MISC);
            this.iSASInOut.Output.ErrorMessage = "잘못된 보안문자자동제출 입니다. 확인 후 다시 거래하십시오.";
            return E_IBX_RANDOM_DATA_MISC;
        }

        if (보안문자자동제출) { // 보안문자 자동제출
            보안문자 = this.보안문자_음성듣기();
        } else { // 보안문자 수동제출
            if (this.bcapcha != true) {
                this.setError(E_IBX_W01101_SEARCH_VALUE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "건강검진결과조회 이전에 보안문자 api 호출이 필요합니다.";
                return E_IBX_W01101_SEARCH_VALUE_NOTENTER;
            }
            if (!보안문자) {
                this.setError(E_IBX_RANDOM_DATA_NOTENTER);
                return E_IBX_RANDOM_DATA_NOTENTER;
            }
            if (!IsCurrency(보안문자)) {
                this.setError(E_IBX_RANDOM_DATA_INVALID);
                return E_IBX_RANDOM_DATA_INVALID;
            }
        }

        if (조회구분 && 조회구분 != '1' && 조회구분 != '2') {
            this.setError(E_IBX_P00XXX_PAY_TYPE_INVALID);
            return E_IBX_P00XXX_PAY_TYPE_INVALID;
        }
        
        // 보안문자 제출
        system.setStatus(IBXSTATE_ENTER, 50);
        this.host = "https://www.nhis.or.kr";
        this.url = "/nhis/healthin/retrieveSecurityChrAhtc.do";
        this.postData = "authUrl=" + "%2Fnhis%2Fhealthin%2FretrieveHealthinCheckUpTargetResultPerson.do";
        this.postData += "&authName=" + "wbhaca02400";
        this.postData += "&captcha=" + 보안문자;

        if (httpRequest.post(this.host + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("ResultStr : [" + ResultStr + "]");

        system.setStatus(IBXSTATE_ENTER, 65);
        // 홈 > 건강iN > 나의건강관리 > 건강검진정보 > 건강검진 결과조회
        // 검진결과 목록
        this.url = "/nhis/healthin/retrieveHealthinCheckUpTargetResultPerson.do";
        if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var resultList = httpRequest.result;
        this.log("resultList : [" + resultList + "]");

        if (resultList.indexOf('>로그아웃') < 0 ||
            resultList.indexOf('해당 메뉴에 대한 접근권한이 없습니다. 로그인이 필요합니다.') > -1 ||
            resultList.indexOf('해당 메뉴에 대한 접근권한이 없습니다. 개인 로그인이 필요합니다') > -1) {
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }

        if (resultList.indexOf('건강검진결과가 존재하지 않습니다') > -1 ||
            resultList.indexOf('검색 결과가 존재하지 않습니다') > -1) {
            this.setError(I_IBX_RESULT_NOTPRESENT);
            return I_IBX_RESULT_NOTPRESENT;
        }

        if (resultList.indexOf("보안문자를 입력해주세요") > -1) {
            this.setError(E_IBX_RANDOM_DATA_INVALID);
            return E_IBX_RANDOM_DATA_INVALID;
        }

        system.setStatus(IBXSTATE_ENTER, 70);
        // 건강검진결과 한눈에 보기
        this.url = "/nhis/healthin/retrieveHealthinCheckUpTargetResultAllPerson.do";
        if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var Result2 = httpRequest.result;
        this.log("Result2 : [" + Result2 + "]");
       
        // 검진결과상세 처리에서 Grab진행
        if (Result2.indexOf('<tbody>') < 0) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        // 이전 년도 페이지 존재 유무
        var isPrevious = false;
        // 이전 년도 결과 저장
        var preResult = '';

        // 이전페이지 확인
        var nextPage = StrGrab(StrGrab(Result2, "<thead>", "</thead>"), 'title="이전 년도 보기"', '</a>');

        // 과거 데이터 존재
        if (nextPage.indexOf("javascript:retrievePatchResult('1')") > -1) {
            isPrevious = true;
                    
            var patchResult_Fr_Size = StrGrab(StrGrab(Result2, 'id="patchResult_Fr_Size"', '>'), 'value="', '"');
            var patchResult_To_Size = StrGrab(StrGrab(Result2, 'id="patchResult_To_Size"', '>'), 'value="', '"');
            if (!patchResult_Fr_Size || !patchResult_To_Size) {
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            // 이전페이지 함수 (사이트 로직)
            var nextResult = retrievePatchResult(1, patchResult_Fr_Size, patchResult_To_Size);
            this.log('nextResult_ ' + nextResult);

            // 건강검진결과 한눈에 보기(이전페이지)
            this.url = "/nhis/healthin/retrieveHealthinCheckUpTargetResultAllPerson.do";
            this.postData = "patchResult_Fr_Size="      + nextResult[0].toString();
            this.postData += "&patchResult_To_Size="    + nextResult[1].toString();
            if (httpRequest.post(this.host + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            preResult = httpRequest.result;
            this.log("preResult : [" + preResult + "]");
        }

        var 검진결과Result;
        var 검진결과목록 = [];
        var 검진Year = [];
        var i = 0;
        var item = {};
        var 년도Result = "";

        resultList = StrGrab(resultList, ">검진결과 목록<", ">건강상담</button>");
        if (!resultList) {
            this.setError(E_IBX_SITE_INVALID + 2);
            return E_IBX_SITE_INVALID + 2;
        }
        resultList = this.removeHTMLComment(resultList);
        resultList = resultList + '<li class="section row-gap-24';

        system.setStatus(IBXSTATE_EXECUTE, 75);
        while (true) {
            i++;
            검진결과Result = StrGrab(resultList, '<li class="section row-gap-24', '<li class="section row-gap-24', i);
            this.log("검진결과Result " + i + ": " + 검진결과Result);
            if (검진결과Result == "") break;

            item = {};

            item.검진종류 = StrTrim(StrGrab(StrGrab(검진결과Result, "<span", "</span>", 1), ">", ""));

            item.검진연도 = StrTrim(StrGrab(StrGrab(검진결과Result, "<span", "</span>", 2), ">", ""));

            item.검진일자 = StrTrim(StrGrab(StrGrab(검진결과Result, "<span", "</span>", 3), ">", ""));
            item.검진일자 = StrReplace(item.검진일자, "-", "");

            item.검진기관명 = StrTrim(StrGrab(StrGrab(검진결과Result, "<span", "</span>", 4), ">", ""));

            item.검진기관코드 = StrGrab(StrGrab(검진결과Result, 'goDtlRDPrint(', ');'), "'", "'", 15); // 빈값인 경우 있음
            if ((item.검진기관코드 !== '') && (item.검진기관코드.length != 8 || !IsCurrency(item.검진기관코드))) {
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }

            item.소견 = '';
            item.판정 = '';

            system.setStatus(IBXSTATE_EXECUTE, 80);
            var k = 0;
            // 이전년도 결과 존재 시 별도 년도에 대한 인덱스 저장 필요
            var preIndex = 0;
            var curIndex = 0;
            var isPrev = false;
            while (true) {
                k++;
                // 이전년도 결과 존재 시 이전 결과값 우선 저장
                if (isPrevious) {
                    // 이전 페이지 결과부터 년도 저장
                    if (!isPrev) {
                        년도Result = StrGrab(preResult, "<thead>", "</thead>");
                        preIndex++;
                    } else {
                        년도Result = StrGrab(Result2, "<thead>", "</thead>");
                        curIndex++;
                    }
                    년도Result = this.removeHTMLComment(년도Result);
                    년도Result = StrGrab(StrGrab(년도Result, ">단위<", ""), '<tr>', '</tr>');
                    if (!isPrev) {
                        년도Result = StrGrab(StrGrab(년도Result, "<th", "/th>", preIndex), ">", "<");
                    } else {
                        년도Result = StrGrab(StrGrab(년도Result, "<th", "/th>", curIndex), ">", "<");
                    }
                } else {
                    년도Result = StrGrab(Result2, "<thead>", "</thead>");
                    년도Result = this.removeHTMLComment(년도Result);
                    년도Result = StrGrab(StrGrab(년도Result, ">단위<", ""), '<tr>', '</tr>');
                    년도Result = StrGrab(StrGrab(년도Result, "<th", "/th>", k), ">", "<");
                }

                // 이전년도 존재하고 이전년도 페이지 인덱스 저장 안되어 있으면 저장 후 다음 페이지 조회
                if (isPrevious && 년도Result == "" && !isPrev) { 
                    // 검진Year 배열에 빈 값 들어가 감소 필요
                    k--;
                    isPrev = true;
                    continue;
                } else if (isPrevious && 년도Result == "" && isPrev) {
                // 다음페이지 조회 
                    break;
                } else if (년도Result == "") {
                // 기존 로직
                    break;
                }

                년도Result = StrReplace(년도Result, '년', '');

                검진Year[k - 1] = 년도Result;
            }

             //검진종류 "일반" 또는 "생애"일 경우만 판정, 소견 처리
            if (item.검진종류 == "일반" || item.검진종류 == "생애") {

                for (var idx = 0; idx < 검진Year.length; idx++) {
                    if (item.검진연도 == 검진Year[idx]) {
                        // 이전년도 결과 존재 시
                        if (isPrevious) {
                            var strBlock = StrGrab(preResult, ">판정<", "</tfoot>") + StrGrab(Result2, ">판정<", "</tfoot>");

                            item.판정 = StrGrab(StrGrab(strBlock, "popup1('", "</button>", idx + 1), '>', '');
    
                            item.소견 = StrGrab(StrGrab(strBlock, "popup1('", "</button>", idx + 1), ",'", '\')">').replace(/(?:\\\[rnt]|[\r\n\t]+)+/g, "");
                            item.소견 = StrTrim(item.소견);
                        } else {
                            var strBlock = StrGrab(Result2, ">판정<", "</tfoot>");
    
                            item.판정 = StrGrab(StrGrab(strBlock, "popup1('", "</button>", idx + 1), '>', '');
    
                            item.소견 = StrGrab(StrGrab(strBlock, "popup1('", "</button>", idx + 1), ",'", '\')">').replace(/(?:\\\[rnt]|[\r\n\t]+)+/g, "");
                            item.소견 = StrTrim(item.소견);
                        }

                    }
                    this.log('[' + item.검진일자 + '] item.판정 :' + item.판정 + ' / item.소견 :' + item.소견);

                    if (item.판정 == "정A") {
                        item.판정 = "정상A";
                    } else if (item.판정 == "정B") {
                        item.판정 = "정상B";
                    } else if (item.판정 == "주의") {
                        item.판정 = "건강주의";
                    } else if (item.판정 == "의심") {
                        item.판정 = "질환의심";
                    } else if (item.판정 == "고&middot;당") {
                        item.판정 = "고혈압, 당뇨병 질환의심";
                    } else if (item.판정 == "유질") {
                        item.판정 = "유질환자";
                    } else if (item.판정 == "일반") {
                        item.판정 = "일반질병";
                    } else if (item.판정 == "직업") {
                        item.판정 = "직업병";
                    } else if (item.판정 == "단순") {
                        item.판정 = "단순요양";
                    } else if (item.판정 == "휴무") {
                        item.판정 = "휴무요양";
                    }
                }
            }

            검진결과목록.push(item);
        }

        this.log("k::[" + k + "]");
        this.log("검진Year.length=" + 검진Year.length);
        // 이전 페이지 관련 인덱스
        this.log("preIndex::[" + preIndex + "]");
        this.log("curIndex::[" + curIndex + "]");

        if ((검진결과목록.length == 0)) {
            this.setError(E_IBX_SITE_INVALID_MASK);
            return E_IBX_SITE_INVALID_MASK;
        }
        
        if (조회구분 != '2') {
            var j = 0;
            var Result22 = "";
            var 한눈에보기Result = "";
            var 검진결과상세 = [];
    
            var 구분 = ["계측검사", "계측검사", "계측검사", "계측검사", "계측검사", "계측검사", "계측검사", "요검사",
                "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "혈액검사", "영상검사", "골다공증"
            ];
            var 목표질환 = ["비만", "비만", "비만", "비만", "시각이상", "청각이상", "고혈압", "신장질환",
                "빈혈", "당뇨병", "이상지질혈증", "이상지질혈증", "이상지질혈증", "이상지질혈증", "만성신장질환", "만성신장질환", "간장질환", "간장질환", "간장질환", "폐결핵흉부질환", "골다공증"
            ];
            var 검사항목 = ["신장", "체중", "허리둘레", "체질량지수", "시력(좌/우)", "청각(좌/우)", "혈압(최고/최저)", "요단백",
                "혈색소", "공복혈당", "총콜레스테롤", "고밀도(HDL) 콜레스테롤", "중성지방", "저밀도(LDL) 콜레스테롤", "혈청크레아티닌", "신사구체여과율(GFR)",
                "에이에스티(AST, SGOT)", "에이엘티(ALT, SGPT)", "감마지티피(y-GTP)", "폐결핵 흉부질환", "골다공증"
            ];
    
            // 전체 갯수
            var resultCount = 0;
            var tempTable = '';

            // 이전년도 결과 존재 시
            if (isPrevious) {
                Result22 = StrGrab(preResult, "<tbody>", "</tbody>") + StrGrab(Result2, "<tbody>", "</tbody>");
            } else {
                Result22 = StrGrab(Result2, "<tbody>", "</tbody>");
            }

            Result22 = this.removeHTMLComment(Result22);
            system.setStatus(IBXSTATE_EXECUTE, 80);
            while (true) {

                // 이전년도 결과 존재 시
                if (isPrevious) {
                    한눈에보기Result = StrGrab(Result22, ">" + 검사항목[j] + "<", "</tr>") +
                                        StrGrab(Result22, ">" + 검사항목[j] + "<", "</tr>", 2);
                } else {
                    한눈에보기Result = StrGrab(Result22, ">" + 검사항목[j] + "<", "</tr>");
                }
                this.log("한눈에보기Result_["+ k +"]" + 검사항목[j] + " : [" + 한눈에보기Result + "]");
                if (한눈에보기Result == "") break;

                한눈에보기Result = this.removeHTMLComment(한눈에보기Result);
    
                item = {};
    
                item.구분 = 구분[j];
    
                item.목표질환 = 목표질환[j];
    
                item.검사항목 = 검사항목[j];
    
                // 이전년도 결과 존재 시
                if (isPrevious) {
                    item.참고치_단위 = StrGrab(한눈에보기Result, "<td>", "</td>", preIndex);
                    if (item.참고치_단위.indexOf(" class='color promary'") > -1) {
                        item.참고치_단위 = StrGrab(한눈에보기Result, "<td>", "</td>", preIndex+1);
                    }
                } else {
                    item.참고치_단위 = StrGrab(한눈에보기Result, "<td>", "</td>", k);
                    if (item.참고치_단위.indexOf(" class='color promary'") > -1) {
                        item.참고치_단위 = StrGrab(한눈에보기Result, "<td>", "</td>", k+1);
                    }
                }

                // 2024.10.14
                // 기존 코드 검사항목이 골다공증일 경우 '참고치_단위'값 이전 내역 '수치'값으로 내려주고 있었으나 사이트 확인 시 골다공증 '참고치_단위' 내역 없는 것으로 확인되어 수정
                // if (item.검사항목 == "골다공증") {
                //     item.참고치_단위 = StrReplace(StrReplace(수치Item, "<span class='color-red'>", ""), "</span>", "");
                // }
                
                item.참고치_단위 = StrReplace(StrReplace(item.참고치_단위, "<span class='color-red'>", ""), "</span>", "");
                item.참고치_단위 = item.참고치_단위.replace(/(?:\\\[rnt]|[\r\n\t]+)+/g, "");
                item.참고치_단위 = StrTrim(item.참고치_단위);

                // 숫자일 경우에 결과 출력 확인 필요.
                if (item.참고치_단위 && !isNaN(item.참고치_단위)) {
                    this.log("결과검증_실패_1: " + JSON.stringify(item));
                    this.setError(E_IBX_RESULT_FAIL);
                    return E_IBX_RESULT_FAIL;
                }
                
                item.참고치_정상A = StrGrab(StrGrab(한눈에보기Result, ">정상(A)</", "/span>"), "<span>", "<");
    
                item.참고치_정상B = StrGrab(StrGrab(한눈에보기Result, ">정상(B)</", "/span>"), "<span>", "<");
    
                item.참고치_질환의심 = StrGrab(StrGrab(한눈에보기Result, ">질환의심", "/span>"), "<span>", "<");
    
                if (item.검사항목 == "골다공증") {
                    // 이전년도 결과 존재 시
                    if (isPrevious) {
                        한눈에보기Result = StrGrab(Result22, ">" + 검사항목[j] + "<", "</tr>", 2) +
                                            StrGrab(Result22, ">" + 검사항목[j] + "<", "</tr>", 4);
                    } else {
                        한눈에보기Result = StrGrab(Result22, ">" + 검사항목[j] + "<", "</tr>", 2);
                    }
                }
                
                system.setStatus(IBXSTATE_RESULT, 90);
    
                var 검진결과 = [];
                var preSelect = 0;
    
                for (idx = 0; idx < 검진Year.length; idx++) {
    
                    var subItem = {};
    
                    // 이전년도 결과 존재 시
                    if (isPrevious) {
                        tempTable = StrReplace(StrGrab(Result22, '<strong>검진일자</strong>', '<td colspan="2"'),"<td></td>", "")
                                    + StrReplace(StrGrab(Result22, '<strong>검진일자</strong>', '<td colspan="2"', 2),"<td></td>", "");
                        subItem.검진일자 = 검진Year[idx] + StrTrim(StrReplace(StrGrab(tempTable, "<td>", "</td>", idx + 1), "/", ""));
                    } else {
                        subItem.검진일자 = 검진Year[idx] + StrTrim(StrReplace(StrGrab(StrGrab(Result22, "<tr>", "</tr>"), "<td>", "</td>", idx + 2), "/", ""));
                    }
                    subItem.검진장소 = '';
    
                    // 이전년도 결과 존재 시
                    if (isPrevious) {
                        한눈에보기Result = this.removeHTMLComment(한눈에보기Result);
                        preSelect = k - 검진Year.length + idx;
                        if (preSelect >= preIndex) preSelect += 2;
                        subItem.수치 = StrTrim(StrGrab(한눈에보기Result, "<td>", "</td>", preSelect));
                    } else {
                        subItem.수치 = StrTrim(StrGrab(한눈에보기Result, "<td>", "</td>", k - 검진Year.length + idx));
                    }
                    subItem.수치 = this.removeTags(StrReplace(StrReplace(subItem.수치, "<span class='color-red'>", ""), "</span>", ""));

					//수치Item = subItem.수치;
                    
                    if (isNaN(subItem.검진일자) || subItem.검진일자.length != 8){
                        this.log("subItem.검진일자 :: " + subItem.검진일자);
                        this.setError(E_IBX_RESULT_FAIL);
                        return E_IBX_RESULT_FAIL;
                    }

                    검진결과.push(subItem);
                }
    
                item.검진결과 = 검진결과;
                

                검진결과상세.push(item);
    
                j++;
                resultCount++;
            } 
    
            if ((검진결과상세.length == 0)) {
                this.setError(E_IBX_SITE_INVALID_MASK);
                return E_IBX_SITE_INVALID_MASK;
            }

            this.log("검사항목[" + 검사항목.length + "]");
            this.log("검진결과상세[" + 검진결과상세.length + "]");
            if (검사항목.length != 검진결과상세.length) {
                this.log("결과검증 실패: " + JSON.stringify(검진결과상세));
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.검진결과목록 = 검진결과목록;
        if (조회구분 != '2') {
            this.iSASInOut.Output.Result.검진결과상세 = 검진결과상세;
        }

        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("민원신청조회.건강검진결과조회 finally");
    }
};


민원신청조회.prototype.검진정보조회 = function (aInput) {
    this.log(moduleName + " 민원신청조회 검진정보조회 (" + moduleVersion + ") 호출[" + aInput + "]");

    try {

        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        var input = dec(aInput.Input);
        var 검진종류 = input.검진종류;

        //미입력: 전체보기, 1: 검진결과만보기
        if (!검진종류) 검진종류 = '0';

        if (['0', '1'].indexOf(검진종류) < 0) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 검진종류입니다. 확인 후 다시 거래하십시오.";
            return E_IBX_PARAMETER_INVALID;
        }

        var pageIndex = 1;
        var 검진정보조회 = [];

        system.setStatus(IBXSTATE_ENTER, 50);
        // 홈 > 건강iN > 나의건강관리 > 나의검진현황 > 검진정보목록
        while (true) {
            var host = "https://www.nhis.or.kr";
            this.url = "/nhis/healthin/retrieveHealthinPresentConditionCheckUpList.do";
    
            if (검진종류 == '0' && pageIndex == 1) {
                if (httpRequest.get(this.host + this.url) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                var ResultStr = httpRequest.result;
                this.log("검진정보목록(전체보기) : [" + ResultStr + "]");
    
            } else if (검진종류 == '1' || (검진종류 == '0' && pageIndex > 1)) {
                this.postData = "pageIndex=" + (검진종류 == '1' ? '' : pageIndex);
                this.postData += "&searchType="  + (검진종류 == '1' ? '1' : '0');
                this.postData += "&manAge=";
                this.postData += "&writeYn=";
                this.postData += "&newQstFrDt=";
                this.postData += "&newQstStdDt=";
                this.postData += "&experience=" + (검진종류 == '1' ? 'N' : '');
                this.postData += "&goTap=" + (검진종류 == '1' ? '1' : '0');
    
                if (httpRequest.post(this.host + this.url, this.postData) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                var ResultStr = httpRequest.result;
                this.log("검진정보목록(검진결과만보기): [" + ResultStr + "]");
            }
    
            if (ResultStr.indexOf('건강iN 서비스 이용을 위해 서비스 이용등록이 필요합니다') > -1) {
                this.setError(E_IBX_NEED_CONNECT_SERVICE);
                return E_IBX_NEED_CONNECT_SERVICE;
            }
            if (ResultStr.indexOf('>로그아웃') < 0 ||
                ResultStr.indexOf('해당 메뉴에 대한 접근권한이 없습니다. 로그인이 필요합니다.') > -1) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }

            var pagination = StrGrab(ResultStr, '<div class="pagination">', '</form>');
    
            var table = StrGrab(StrGrab(ResultStr, 'data-title="진료 및 투약정보 상세 조회"', '</table>'), '<tbody>', '</tbody>');
            if (table == "") {
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }
    
            // 조회 가능한 내역 없음
            if (ResultStr.indexOf('>검색 결과가 존재하지 않습니다.<') > -1) {
                this.setError(I_IBX_RESULT_NOTPRESENT);
                return I_IBX_RESULT_NOTPRESENT;
            }
    
            var manAge = StrGrab(StrGrab(ResultStr, 'id="manAge', '/>'), 'value="', '"')
    
            var item = {};
            var subItem = {};
            var detailItem = {};
            var idx = 1;
            var ResultItem;
            var newQstFrDt, newQstStdDt;
    
            while (true) {
                ResultItem = StrGrab(table, '<tr>', '</tr>', idx++);
                if (ResultItem == "") break;
    
                newQstFrDt = StrGrab(StrGrab(ResultItem, 'id="qstFrDt_', '/>'), 'value="', '"');
                newQstStdDt = StrGrab(StrGrab(ResultItem, 'id="qstStdDt_', '/>'), 'value="', '"');
    
                system.setStatus(IBXSTATE_EXECUTE, 70);
                this.url = "/nhis/healthin/retrieveSelfHltInfoSummr.do";
                this.postData = "pageIndex=";
                this.postData += "&searchType=";
                this.postData += "&manAge=" + manAge;
                this.postData += "&writeYn=";
                this.postData += "&newQstFrDt=" + newQstFrDt;
                this.postData += "&newQstStdDt=" + newQstStdDt;
                this.postData += "&experience=";
                this.postData += "&goTap=" + 검진종류;
    
                if (httpRequest.post(this.host + this.url, this.postData) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                var ResultStr = httpRequest.result;
                this.log("검진정보조회 " + newQstFrDt + ": [" + ResultStr + "]");
    
                if (ResultStr.indexOf('>로그아웃') < 0 ||
                    ResultStr.indexOf('해당 메뉴에 대한 접근권한이 없습니다. 로그인이 필요합니다.') > -1) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SESSION_CLOSED);
                    return E_IBX_SESSION_CLOSED;
                }
    
                var gender = StrGrab(StrGrab(ResultStr, 'id="sexType"', '/>'), 'value="', '"');
                if (gender == '') {
                    this.setError(E_IBX_SITE_INVALID + 2);
                    return E_IBX_SITE_INVALID + 2;
                }
    
                ResultStr = ResultStr + '<div class="section row-gap-40';
    
                system.setStatus(IBXSTATE_RESULT, 90);
                item = {};
    
                item.검진종류 = StrTrim(StrGrab(ResultItem, '<td>', '<'));
                item.검진일자 = StrTrim(StrReplace(StrGrab(ResultItem, '<td>', '</td>', 2), '-', ''));
    
                var 검진정보 = [];
                var strBlock;
                var index = 2; // index 1: 생년월일, 성별
                while (true) {
                    strBlock = StrGrab(ResultStr, '<div class="section row-gap-40', '<div class="section row-gap-40', index++);
                    if (strBlock == "") break;
                    strBlock = strBlock + '<div class="section flex-col inside-24';
    
                    subItem = {};
                    subItem.구분 = StrTrim(StrGrab(StrGrab(strBlock, '<span', '</span>'), '>', ''));
                    if (subItem.구분 == '닫기') continue;
    
                    var 상세조회 = [];
                    var tr;
                    var keyValue = '';
                    var count = 1;
                    var height, weight;
                    while (true) {
                        tr = StrGrab(strBlock, '<div class="section flex-col inside-24', '<div class="section flex-col inside-24', count++);
                        if (tr == "") break;
    
                        detailItem = {};
    
                        var type = StrGrab(StrGrab(tr, '<span', '</span>', 1), '>', '');
                        type = StrTrim(StrReplace(type, '<br>', ''));
                        var value = StrReplace(StrTrim(StrGrab(StrGrab(tr, '<span', '</span>', 2), '>', '')), '-', '');
    
                        if (value == '음성') {
                            keyValue = '1';
                        } else if (value == '약약성(±)') {
                            keyValue = '2';
                        } else if (value == '양성(+1)') {
                            keyValue = '3';
                        } else if (value == '양성(+2)') {
                            keyValue = '4';
                        } else if (value == '양성(+3)') {
                            keyValue = '5';
                        } else if (value == '양성(+4)'){
                            keyValue = '6';
                        } else {
                            keyValue = value;
                        }
    
                        if (type == '신장(cm)') {
                            height = keyValue;
                        } else if (type == '체중(kg)') {
                            weight = keyValue;
                        } else if (type == '체질량지수') {
                            value = Math.round(weight / ((height / 100) * (height / 100)) * 10) / 10;
                            value = value.toString();
                            keyValue = value;
                        }
    
                        detailItem.항목 = type;
                        detailItem.값 = value;
                        detailItem.판정 = fnGraphLeft(gender, type, keyValue);
    
                        상세조회.push(detailItem);
                    }
    
                    subItem.상세조회 = 상세조회;
    
                    검진정보.push(subItem);
                }
    
                item.검진정보 = 검진정보;
    
                if (!item.검진종류 || !subItem.구분 || !detailItem.항목) {
                    this.log('80002F10 : ' + JSON.stringify(subItem));
                    this.setError(E_IBX_RESULT_FAIL);
                    return E_IBX_RESULT_FAIL;
                }
                if (!IsCurrency(item.검진일자)) {
                    this.log('80002470 : ' + JSON.stringify(item));
                    this.setError(E_IBX_CURRENCY_NOT_CONVERT);
                    return E_IBX_CURRENCY_NOT_CONVERT;
                }
    
                검진정보조회.push(item);
            }

            pageIndex++ ;
            if (pagination.indexOf('onclick="goPage('+ pageIndex +')') < 0) break;
        }
       
        //추후 문구로 내역없음 처리 추가 필요
        if (검진정보조회.length == 0) {
            this.setError(E_IBX_SITE_INVALID + 3);
            return E_IBX_SITE_INVALID + 3;
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.검진정보조회 = 검진정보조회;

        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("민원신청조회 검진정보조회 finally");
    }
};


민원신청조회.prototype.로그아웃 = function (aInput) {
    console.log("건강보험공단 민원신청조회 로그아웃 호출[" + moduleVersion + "][" + aInput + "]");

    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        system.setStatus(IBXSTATE_ENTER, 30);
        this.host = 'https://www.nhis.or.kr';
        this.url = '/nhis/etc/logout.do';

        if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE; 
        }
        var ResultStr = httpRequest.result;
        this.log('logout1 : ' + ResultStr);

        this.url = '/nhis/etc/personalLoginPage.do';

        if (httpRequest.get(this.host + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE; 
        }
        ResultStr = httpRequest.result;
        this.log('logout2 : ' + ResultStr);

        if (ResultStr.indexOf('>로그인 &lt; 회원서비스 &lt; 기타 | 국민건강보험<') < 0 &&
            ResultStr.indexOf('>로그인</a>') < 0) {
            this.setError(E_IBX_SERVICE_LOGOUT_FAIL);
            return E_IBX_SERVICE_LOGOUT_FAIL;
        }

        this.bLogIn = false;
        this.IsWebCert = false;
        this.IsFinCert = false;
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
        this.log("개인전자민원.로그아웃 finally");
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
        system.include("sas/encoding");
        system.include("common/common");
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
            iSASObj.Output.ErrorCode = '8000F111';
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
/* jshint +W061, +W082, +W014, +W004, +W038, +W100, +W107 */