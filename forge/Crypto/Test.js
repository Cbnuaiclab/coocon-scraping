var BankName = "크레딧포유";
console.log(BankName + " 스크립트 호출됨.");


function iSASObject() {
    console.log("iSASObject 생성자 호출");
    this.iSASInOut = {};
}

iSASObject.prototype.log = function (logMsg) {
    console.log("iSASObject.Log(" + logMsg + "\")");
}

iSASObject.prototype.setError = function (errcode) {
    this.iSASInOut.Output = {};
    this.iSASInOut.Output.ErrorCode = errcode.toString(16);
    //TODO: 에러 메시지 가져오는 부분...
    this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16));
}

iSASObject.prototype.checkError = function () {
    this.errorMsg = StrGrab(httpRequest.result, "\"errMsg\":\"", "\",\"");
    if (this.errorMsg != "") {
        this.log("Juryu ErrorLog [" + this.errorMsg + "]");
        return true;
    } else {
        return false;
    }
}

var 내보험다보여 = function () {
    //생성자
    console.log(BankName + " 내보험다보여 생성자 호출");
    this.errorMsg = "";
    this.host = "";
    this.url = "";
    this.param = "";
    this.postData = "";
    this.xgate_addr = "ins.credit4u.or.kr:443";//"ins.credit4u.or.kr:443";
    this.userAgent = "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\"}";

    this.성명 = "";
    this.휴대폰인증_통신사 = "";
    this.내외국인_구분 = "";   // 1 : 남 , 2 : 여
    this.성별 = "";
    this.생년월일 = "";
    this.휴대폰번호 = "";

    this.CAPTCHA = "";
    this.LoginStep = "";
    //	this.LoginTimer;
    this.bLogin = false;

}

function escape_url(url) {
    var i;
    var ch;
    var out = '';
    var url_string = '';

    url_string = String(url);

    for (i = 0; i < url_string.length; i++) {
        ch = url_string.charAt(i);
        if (ch == ' ') out += '%20';
        else if (ch == '%') out += '%25';
        else if (ch == '&') out += '%26';
        else if (ch == '+') out += '%2B';
        else if (ch == '=') out += '%3D';
        else if (ch == '?') out += '%3F';
        else out += ch;
    }
    return out;
}

function fn_xecureMakeAction(qs, pathStr) {
    return "p=" + httpRequest.URLEncodeAll(XecureWeb.blockEnc(this.xgate_addr, pathStr, qs, "POST"), "UTF-8")
        + "&q=" + escape_url(XecureWeb.blockEnc(this.xgate_addr, pathStr, "", "GET"));
}
function fn_xecureMakeQdata(pathStr) {
    return escape_url(XecureWeb.blockEnc(this.xgate_addr, pathStr, "", "GET"));
}

내보험다보여.prototype = Object.create(iSASObject.prototype);


function _attributeToAsn1(attr) {
    var value;
    var asn1 = forge.asn1;
    
    // TODO: generalize to support more attributes
    if(attr.type === forge.pki.oids.contentType) {
        value = forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.OID, false,
                            forge.asn1.oidToDer(attr.value).getBytes());
    } else if(attr.type === forge.pki.oids.messageDigest) {
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false,
                            attr.value.bytes());
    } else if(attr.type === forge.pki.oids.signingTime) {
        /* Note per RFC 2985: Dates between 1 January 1950 and 31 December 2049
         (inclusive) MUST be encoded as UTCTime. Any dates with year values
         before 1950 or after 2049 MUST be encoded as GeneralizedTime. [Further,]
         UTCTime values MUST be expressed in Greenwich Mean Time (Zulu) and MUST
         include seconds (i.e., times are YYMMDDHHMMSSZ), even where the
         number of seconds is zero.  Midnight (GMT) must be represented as
         "YYMMDD000000Z". */
        // TODO: make these module-level constants
        var jan_1_1950 = new Date('Jan 1, 1950 00:00:00Z');
        var jan_1_2050 = new Date('Jan 1, 2050 00:00:00Z');
        var date = attr.value;
        if(typeof date === 'string') {
            // try to parse date
            var timestamp = Date.parse(date.replace(/-/g, '/'));
            if(!isNaN(timestamp)) {
                date = new Date(timestamp);
            } else if(date.length === 13) {
                // YYMMDDHHMMSSZ (13 chars for UTCTime)
                date = asn1.utcTimeToDate(date);
            } else {
                // assume generalized time
                date = asn1.generalizedTimeToDate(date);
            }
        }
        
        if(date >= jan_1_1950 && date < jan_1_2050) {
            value = asn1.create(
                                asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false,
                                asn1.dateToUtcTime(date));
        } else {
            value = asn1.create(
                                asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false,
                                asn1.dateToGeneralizedTime(date));
        }
    } else if(attr.type === forge.pki.oids['initech-encrypted-random']) {
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false,
                            attr.value);
        console.log("만들려구 한거.. :[" + value + "]");
    }
    
    // TODO: expose as common API call
    // create a RelativeDistinguishedName set
    // each value in the set is an AttributeTypeAndValue first
    // containing the type (an OID) and second the value
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                                                                        // AttributeType
                                                                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
                                                                                    asn1.oidToDer(attr.type).getBytes()),
                                                                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
                                                                                                                                // AttributeValue
                                                                                                                                value
                                                                                                                                ])
                                                                        ]);
}




//TODO:
내보험다보여.prototype.본인인증_1 = function (aInput) {
    this.log(BankName + " 내보험다보여 본인인증_1 호출[" + aInput + "]");

    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        

        system.include("forgeCrypto_forge");

        system.include("forgeCrypto_cipherModes");
        system.include("forgeCrypto_cipher");
        system.include("forgeCrypto_tls");
        system.include("forgeCrypto_util");
        
        system.include("forgeCrypto_aes");
        system.include("forgeCrypto_aesCipherSuites");
        system.include("forgeCrypto_asn1");
        system.include("forgeCrypto_cmp");
        system.include("forgeCrypto_debug");
        system.include("forgeCrypto_des");
        system.include("forgeCrypto_desmac");
        system.include("forgeCrypto_hmac");
        system.include("forgeCrypto_jsbn");
        system.include("forgeCrypto_kem");
        system.include("forgeCrypto_log");
        system.include("forgeCrypto_md");
        system.include("forgeCrypto_md5");
        system.include("forgeCrypto_mgf");
        system.include("forgeCrypto_mgf1");
        system.include("forgeCrypto_oids");
        system.include("forgeCrypto_pbe");
        system.include("forgeCrypto_pbkdf1");
        system.include("forgeCrypto_pbkdf2");
        system.include("forgeCrypto_pem");
        system.include("forgeCrypto_pkcs1");
        system.include("forgeCrypto_pkcs7");
        system.include("forgeCrypto_pkcs7asn1");
        system.include("forgeCrypto_pkcs12");
        system.include("forgeCrypto_pki");
        system.include("forgeCrypto_prime");
        system.include("forgeCrypto_prng");
        system.include("forgeCrypto_pss");
        system.include("forgeCrypto_rc2");
        system.include("forgeCrypto_rsa");
        system.include("forgeCrypto_seed");
        system.include("forgeCrypto_sha1");
        system.include("forgeCrypto_sha256");
        system.include("forgeCrypto_sha512");
        system.include("forgeCrypto_ssh");
        system.include("forgeCrypto_task");
        system.include("forgeCrypto_x509");
        system.include("forgeCrypto_random");

//        system.include("forge");
//        system.include("seed");

        
        this.log("test 1");
        //-----BEGIN PKCS7-----
        //-----END PKCS7-----
        var pemStr = '-----BEGIN PKCS7-----MIIHXgYJKoZIhvcNAQcCoIIHTzCCB0sCAQExDzANBglghkgBZQMEAgEFADApBgkqhkiG9w0BBwGgHAQaU29tZSBjb250ZW50IHRvIGJlIHNpZ25lZC6gggWBMIIFfTCCBGWgAwIBAgIEBhJjvzANBgkqhkiG9w0BAQsFADBQMQswCQYDVQQGEwJLUjESMBAGA1UECgwJU2lnbktvcmVhMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFjAUBgNVBAMMDVNpZ25Lb3JlYSBDQTIwHhcNMTYwMjE3MDcwMDQ4WhcNMTcwMjE3MTQ1OTU5WjBwMQswCQYDVQQGEwJLUjESMBAGA1UECgwJU2lnbktvcmVhMREwDwYDVQQLDAhwZXJzb25hbDEMMAoGA1UECwwDU0hCMSwwKgYDVQQDDCPsnbTsnYDtmJwoKTAwODgwMTMyMDE1MDIxNzQ4ODAwMDUwOTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL02QwRBOo4rdUDqNoAkHMexub7O6z1GTLm7hRhG3nbNseAyP7qWaYpvXQOM4oBBZN7wkEyH5Y/eyaqzA3itJTvD63Vv/KQ7JrwYZ97Y5sKXEw9Trqm9cnbU/j1NjEyNDQOtLI/OKxUsS1VmwCMrXkBIrR87jp/0wPL1F7+bGW6qNmyE5GEWMixrMENLsWdQFBQLMm0/Dg2cxSGHUguU1Mw+hUJ9VG9XhVCdWYvcotPgN/d/vpvNFSeOwadetR7LL9hUPk2p7myQw/quInle/4t9LwUjJlkxT+OI6sjHtkIeCnNmfjzzyD3Ax4hoNW4n96OiqqRA+vF+c+zGh7jb2zMCAwEAAaOCAj0wggI5MIGPBgNVHSMEgYcwgYSAFCeWlr7zhNxZAWIkI+IYe9NBjS1CoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEWMBQGA1UEAwwNS0lTQSBSb290Q0EgNIICEAIwHQYDVR0OBBYEFP6ZeyW6Er16Pd4hhxzRn4tTHNX+MA4GA1UdDwEB/wQEAwIGwDB5BgNVHSABAf8EbzBtMGsGCiqDGoyaRAUBAQUwXTAtBggrBgEFBQcCARYhaHR0cDovL3d3dy5zaWdua29yZWEuY29tL2Nwcy5odG1sMCwGCCsGAQUFBwICMCAeHsd0ACDHeMmdwRyylAAgrPXHeMd4yZ3BHMeFssiy5DBoBgNVHREEYTBfoF0GCSqDGoyaRAoBAaBQME4MCeydtOydgO2YnDBBMD8GCiqDGoyaRAoBAQEwMTALBglghkgBZQMEAgGgIgQgJkO8moY/s5yWg6/3DF7MLt/ozBot8TkBYfKVUziv7i0wWgYDVR0fBFMwUTBPoE2gS4ZJbGRhcDovL2Rpci5zaWdua29yZWEuY29tOjM4OS9vdT1kcDRwOTQxNyxvdT1BY2NyZWRpdGVkQ0Esbz1TaWduS29yZWEsYz1LUjA1BggrBgEFBQcBAQQpMCcwJQYIKwYBBQUHMAGGGWh0dHA6Ly9vY3NwLnNpZ25rb3JlYS5jb20wDQYJKoZIhvcNAQELBQADggEBAB3ntPCxn36EtxNzuqMP9Lks8wnl1PKd/dAtRu/Y/eD9xy7cLw0YHsSFQrSjOEJ4UH826mAuXcIhoZE9LMA2I2KzBFYtGiDv3S03tA/5nRMurrd9a6+k2tDbdg4u+GGVcNHy6spRy6dQEofv8DeIBXjTIn0AKExnmq4gjuNwcfj7e1+VweDAlj/NdYr9urFYjNUwhC4dDTkGvx97FkrYJZOuOYTtjqQaS6G/I1+lFkukf9mFmdXBWz338y63f7IxeA59tultDsjEVcIiQBNE5fHjy2PguuPhDpy7zUl8UJsS3dEOkVViWhQ/GjdCFITDAL3Dlgg4SdQldjWvCibfFJAxggGDMIIBfwIBATBYMFAxCzAJBgNVBAYTAktSMRIwEAYDVQQKDAlTaWduS29yZWExFTATBgNVBAsMDEFjY3JlZGl0ZWRDQTEWMBQGA1UEAwwNU2lnbktvcmVhIENBMgIEBhJjvzANBglghkgBZQMEAgEFADANBgkqhkiG9w0BAQEFAASCAQAdd9GHcR6BKJn9bqxe+DgL9V/ZPGEGZON28sxuh3HpIw6yWDsWIvf3etDU1gdtikRuBjwtMmZnnVIzqcvyb2AyPDUBCEMTd9pZx47WGPFJhBBSJYrM118uf601R45XleS9fZ+unJ7bkabmQjgzj5QJFxHg/mBFfld02OIHNmo+vGiXoMhs+T9yqm+5GsASqnZr6dXxAysDOHU7gAMP1TwHUkdEgg3Urp4Qk91gi0JhVdWCHhxeXlL4MXoK2KETpsGGIXDqbSXYGsRLYPs28j1II68TRVI68gjINaZFDJxZFzQ4fsyYr0zdGT4pl3kUj6bZNRjGprPCwhyXBT1z/Rks-----END PKCS7-----';
        var pem = forge.pkcs7.messageFromPem(pemStr);
        //var p7 = forge.pkcs7.createSignedData();
        //var pem = p7.messageFromPem(pemStr);
        var pem_asn1 = pem.toAsn1();
        
        //1.3.6.1.4.1.7150.3.1      forge.pki.oids['initech-encrypted-random']
        var A = [{
                 type: forge.pki.oids["initech-encrypted-random"]
                 }];
        A.value = "VID_RANDOM";
        this.log("A:[" + A + "]");
        
        var attrsAsn1 = forge.asn1.create(forge.asn1.Class.CONTEXT_SPECIFIC, 1, true, []);
        var unauthenticatedAttributes = A || [];
        for(var i = 0; i < unauthenticatedAttributes.length; ++i) {
            var attr = unauthenticatedAttributes[i];
            attr.value = "VID_RANDOM";
            var attrsAsn2 = _attributeToAsn1(attr);
            this.log("attrsAsn2:[" + attrsAsn2 + "]");
            attrsAsn1.value.push( attrsAsn2 );
        }

//        var attrsAsn2 = _attributeToAsn1(A);
//        attrsAsn1.value.push(attrsAsn2);
        
        pem_asn1.value.push(attrsAsn1);
        
        pem = forge.pkcs7.messageFromAsn1(pem_asn1);
        var outputMsg = StrReplace(forge.pkcs7.messageToPem(pem), "\n", "");
        outputMsg = StrReplace(outputMsg, "\r", "");
        this.log("output:[" + outputMsg + "]");
        
        if(StrReplace(pemStr, "\n", "") == outputMsg){
            this.log("왜 안바뀌냐.. -_-");
        }
        
        
        
        return;

/*
        // generate a random key and IV
        // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
        var someBytes = 32;
        var key = forge.random.getBytesSync(16);
        var iv = forge.random.getBytesSync(16);
        
        // alternatively, generate a password-based 16-byte key
        // var salt = forge.random.getBytesSync(128);
        // var key = forge.pkcs5.pbkdf2('password', salt, numIterations, 16);
 
        // encrypt some bytes using CBC mode
        // (other modes include: ECB, CFB, OFB, CTR, and GCM)
        // Note: CBC and ECB modes use PKCS#7 padding as default
        var cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(someBytes));
        cipher.finish();
        var encrypted = cipher.output;
        // outputs encrypted hex
        console.log('encrypted : ' + encrypted.toHex());
        
        // decrypt some bytes using CBC mode
        // (other modes include: CFB, OFB, CTR, and GCM)
        var decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({ iv: iv });
        decipher.update(encrypted);
        decipher.finish();
        // outputs decrypted hex
        console.log('decrypted : ' + decipher.output.toHex());
        
        // encrypt some bytes using GCM mode
        var cipher = forge.cipher.createCipher('AES-GCM', key);
        cipher.start({
                     iv: iv, // should be a 12-byte binary-encoded string or byte buffer
                     additionalData: 'binary-encoded string', // optional
                     tagLength: 128 // optional, defaults to 128 bits
                     });
        cipher.update(forge.util.createBuffer(someBytes));
        cipher.finish();
        var encrypted = cipher.output;
        var tag = cipher.mode.tag;
        // outputs encrypted hex
        console.log(encrypted.toHex());
        // outputs authentication tag
        console.log(tag.toHex());
        
        // decrypt some bytes using GCM mode
        var decipher = forge.cipher.createDecipher('AES-GCM', key);
        decipher.start({
                       iv: iv,
                       additionalData: 'binary-encoded string', // optional
                       tagLength: 128, // optional, defaults to 128 bits
                       tag: tag // authentication tag from encryption
                       });
        decipher.update(encrypted);
        var pass = decipher.finish();
        // pass is false if there was a failure (eg: authentication tag didn't match)
        if (pass) {
            // outputs decrypted hex
            console.log(decipher.output.toHex());
        }
        
        var md = forge.md.sha1.create();
        md.update('The quick brown fox jumps over the lazy dog');
        console.log('SHA-1 digest : ' + md.digest().toHex());
        
        md = forge.md.sha256.create();
        md.update('The quick brown fox jumps over the lazy dog');
        console.log('SHA-256 digest : ' + md.digest().toHex());
        
        md = forge.md.md5.create();
        md.update('The quick brown fox jumps over the lazy dog');
        console.log('md5 digest : ' + md.digest().toHex());

        //pkcs7 test /////////////////////////////////////////////////

        var _pem = {
        p7:
            '-----BEGIN PKCS7-----\r\n' +
            'MIICTgYJKoZIhvcNAQcDoIICPzCCAjsCAQAxggHGMIIBwgIBADCBqTCBmzELMAkG\r\n' +
            'A1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25pYTEQMA4GA1UEBwwHQW5zYmFjaDEV\r\n' +
            'MBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYDVQQLDAlHZWllcmxlaW4xFjAUBgNV\r\n' +
            'BAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG9w0BCQEWFHN0ZXNpZUBicm9rZW5w\r\n' +
            'aXBlLmRlAgkA1FQcQNg14vMwDQYJKoZIhvcNAQEBBQAEggEAJhWQz5SniCd1w3A8\r\n' +
            'uKVZEfc8Tp21I7FMfFqou+UOVsZCq7kcEa9uv2DIj3o7zD8wbLK1fuyFi4SJxTwx\r\n' +
            'kR0a6V4bbonIpXPPJ1f615dc4LydAi2tv5w14LJ1Js5XCgGVnkAmQHDaW3EHXB7X\r\n' +
            'T4w9PR3+tcS/5YAnWaM6Es38zCKHd7TnHpuakplIkwSK9rBFAyA1g/IyTPI+ktrE\r\n' +
            'EHcVuJcz/7eTlF6wJEa2HL8F1TVWuL0p/0GsJP/8y0MYGdCdtr+TIVo//3YGhoBl\r\n' +
            'N4tnheFT/jRAzfCZtflDdgAukW24CekrJ1sG2M42p5cKQ5rGFQtzNy/n8EjtUutO\r\n' +
            'HD5YITBsBgkqhkiG9w0BBwEwHQYJYIZIAWUDBAEqBBBmlpfy3WrYj3uWW7+xNEiH\r\n' +
            'gEAm2mfSF5xFPLEqqFkvKTM4w8PfhnF0ehmfQNApvoWQRQanNWLCT+Q9GHx6DCFj\r\n' +
            'TUHl+53x88BrCl1E7FhYPs92\r\n' +
            '-----END PKCS7-----\r\n',
        certificate:
            '-----BEGIN CERTIFICATE-----\r\n' +
            'MIIDtDCCApwCCQDUVBxA2DXi8zANBgkqhkiG9w0BAQUFADCBmzELMAkGA1UEBhMC\r\n' +
            'REUxEjAQBgNVBAgMCUZyYW5jb25pYTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UE\r\n' +
            'CgwMU3RlZmFuIFNpZWdsMRIwEAYDVQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdl\r\n' +
            'aWVybGVpbiBERVYxIzAhBgkqhkiG9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRl\r\n' +
            'MB4XDTEyMDMxODIyNTc0M1oXDTEzMDMxODIyNTc0M1owgZsxCzAJBgNVBAYTAkRF\r\n' +
            'MRIwEAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNVBAoM\r\n' +
            'DFN0ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1HZWll\r\n' +
            'cmxlaW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5kZTCC\r\n' +
            'ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMsAbQ4fWevHqP1K1y/ewpMS\r\n' +
            '3vYovBto7IsKBq0v3NmC2kPf3NhyaSKfjOOS5uAPONLffLck+iGdOLLFia6OSpM6\r\n' +
            '0tyQIV9lHoRh7fOEYORab0Z+aBUZcEGT9yotBOraX1YbKc5f9XO+80eG4XYvb5ua\r\n' +
            '1NHrxWqe4w2p3zGJCKO+wHpvGkbKz0nfu36jwWz5aihfHi9hp/xs8mfH86mIKiD7\r\n' +
            'f2X2KeZ1PK9RvppA0X3lLb2VLOqMt+FHWicyZ/wjhQZ4oW55ln2yYJUQ+adlgaYn\r\n' +
            'PrtnsxmbTxM+99oF0F2/HmGrNs8nLZSva1Vy+hmjmWz6/O8ZxhiIj7oBRqYcAocC\r\n' +
            'AwEAATANBgkqhkiG9w0BAQUFAAOCAQEAvfvtu31GFBO5+mFjPAoR4BlzKq/H3EPO\r\n' +
            'qS8cm/TjHgDRALwSnwKYCFs/bXqE4iOTD6otV4TusX3EPbqL2vzZQEcZn6paU/oZ\r\n' +
            'ZVXwQqMqY5tf2teQiNxqxNmSIEPRHOr2QVBVIx2YF4Po89KGUqJ9u/3/10lDqRwp\r\n' +
            'sReijr5UKv5aygEcnwcW8+Ne4rTx934UDsutKG20dr5trZfWQRVS9fS9CFwJehEX\r\n' +
            'HAMUc/0++80NhfQthmWZWlWM1R3dr4TrIPtWdn5z0MtGeDvqBk7HjGrhcVS6kAsy\r\n' +
            'Z9y/lfLPjBuxlQAHztEJCWgI4TW3/RLhgfg2gI1noM2n84Cdmisfkg==\r\n' +
            '-----END CERTIFICATE-----\r\n',
        privateKey:
            '-----BEGIN RSA PRIVATE KEY-----\r\n' +
            'MIIEowIBAAKCAQEAywBtDh9Z68eo/UrXL97CkxLe9ii8G2jsiwoGrS/c2YLaQ9/c\r\n' +
            '2HJpIp+M45Lm4A840t98tyT6IZ04ssWJro5KkzrS3JAhX2UehGHt84Rg5FpvRn5o\r\n' +
            'FRlwQZP3Ki0E6tpfVhspzl/1c77zR4bhdi9vm5rU0evFap7jDanfMYkIo77Aem8a\r\n' +
            'RsrPSd+7fqPBbPlqKF8eL2Gn/GzyZ8fzqYgqIPt/ZfYp5nU8r1G+mkDRfeUtvZUs\r\n' +
            '6oy34UdaJzJn/COFBnihbnmWfbJglRD5p2WBpic+u2ezGZtPEz732gXQXb8eYas2\r\n' +
            'zyctlK9rVXL6GaOZbPr87xnGGIiPugFGphwChwIDAQABAoIBAAjMA+3QvfzRsikH\r\n' +
            'zTtt09C7yJ2yNjSZ32ZHEPMAV/m1CfBXCyL2EkhF0b0q6IZdIoFA3g6xs4UxYvuc\r\n' +
            'Q9Mkp2ap7elQ9aFEqIXkGIOtAOXkZV4QrEH90DeHSfax7LygqfD5TF59Gg3iAHjh\r\n' +
            'B3Qvqg58LyzJosx0BjLZYaqr3Yv67GkqyflpF/roPGdClHpahAi5PBkHiNhNTAUU\r\n' +
            'LJRGvMegXGZkUKgGMAiGCk0N96OZwrinMKO6YKGdtgwVWC2wbJY0trElaiwXozSt\r\n' +
            'NmP6KTQp94C7rcVO6v1lZiOfhBe5Kc8QHUU+GYydgdjqm6Rdow/yLHOALAVtXSeb\r\n' +
            'U+tPfcECgYEA6Qi+qF+gtPincEDBxRtoKwAlRkALt8kly8bYiGcUmd116k/5bmPw\r\n' +
            'd0tBUOQbqRa1obYC88goOVzp9LInAcBSSrexhVaPAF4nrkwYXMOq+76MiH17WUfQ\r\n' +
            'MgVM2IB48PBjNk1s3Crj6j1cxxkctqmCnVaI9HlU2PPZ3xjaklfv/NsCgYEA3wH8\r\n' +
            'mehUhiAp7vuhd+hfomFw74cqgHC9v0saiYGckpMafh9MJGc4U5GrN1kYeb/CFkSx\r\n' +
            '1hOytD3YBKoaKKoYagaMQcjxf6HnEF0f/5OiQkUQpWmgC9lNnE4XTWjnwqaTS5L9\r\n' +
            'D+H50SiI3VjHymGXTRJeKpAIwV74AxxrnVofqsUCgYAwmL1B2adm9g/c7fQ6yatg\r\n' +
            'hEhBrSuEaTMzmsUfNPfr2m4zrffjWH4WMqBtYRSPn4fDMHTPJ+eThtfXSqutxtCi\r\n' +
            'ekpP9ywdNIVr6LyP49Ita6Bc+mYVyU8Wj1pmL+yIumjGM0FHbL5Y4/EMKCV/xjvR\r\n' +
            '2fD3orHaCIhf6QvzxtjqTwKBgFm6UemXKlMhI94tTsWRMNGEBU3LA9XUBvSuAkpr\r\n' +
            'ZRUwrQssCpXnFinBxbMqXQe3mR8emrM5D8En1P/jdU0BS3t1kP9zG4AwI2lZHuPV\r\n' +
            'ggbKBS2Y9zVtRKXsYcHawM13+nIA/WNjmAGJHrB45UJPy/HNvye+9lbfoEiYKdCR\r\n' +
            'D4bFAoGBAIm9jcZkIwLa9kLAWH995YYYSGRY4KC29XZr2io2mog+BAjhFt1sqebt\r\n' +
            'R8sRHNiIP2mcUECMOcaS+tcayi+8KTHWxIEed9qDmFu6XBbePfe/L6yxPSagcixH\r\n' +
            'BK0KuK/fgTPvZCmIs8hUIC+AxhXKnqn4fIWoO54xLsALc0gEjs2d\r\n' +
            '-----END RSA PRIVATE KEY-----\r\n',
        encryptedData:
            '-----BEGIN PKCS7-----\r\n' +
            'MIGHBgkqhkiG9w0BBwagejB4AgEAMHMGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQI\r\n' +
            'upMFou5X3DWAUAqObuHSlewM0ZtHzWk9MAmtYb7MSb//OBMKVfLCdbmrS5BpKm9J\r\n' +
            'gzwiDR5Od7xgfkqasLS2lOdKAvJ5jZjjTpAyrjBKpShqK9gtXDuO0zH+\r\n' +
            '-----END PKCS7-----\r\n',
        p7IndefiniteLength:
            '-----BEGIN PKCS7-----\r\n' +
            'MIAGCSqGSIb3DQEHA6CAMIACAQAxggHGMIIBwgIBADCBqTCBmzELMAkGA1UEBhMC\r\n' +
            'REUxEjAQBgNVBAgMCUZyYW5jb25pYTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UE\r\n' +
            'CgwMU3RlZmFuIFNpZWdsMRIwEAYDVQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdl\r\n' +
            'aWVybGVpbiBERVYxIzAhBgkqhkiG9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRl\r\n' +
            'AgkA1FQcQNg14vMwDQYJKoZIhvcNAQEBBQAEggEAlWCH+E25c4jfff+m0eAxxMmE\r\n' +
            'WWaftdsk4ZpAVAr7HsvxJ35bj1mhwTh7rBTg929JBKt6ZaQ4I800jCNxD2O40V6z\r\n' +
            'lB7JNRqzgBwfeuU2nV6FB7v1984NBi1jQx6EfxOcusE6RL/63HqJdFbmq3Tl55gF\r\n' +
            'dm3JdjmHbCXqwPhuwOXU4yhkpV1RJcrYhPLe3OrLAH7ZfoE0nPJPOX9HPTZ6ReES\r\n' +
            'NToS7I9D9k7rCa8fAP7pgjO96GJGBtCHG1VXB9NX4w+xRDbgVPOeHXqqxwZhqpW2\r\n' +
            'usBU4+B+MnFLjquOPoySXFfdJFwTP61TPClUdyIne5FFP6EYf98mdtnkjxHo1TCA\r\n' +
            'BgkqhkiG9w0BBwEwFAYIKoZIhvcNAwcECFNtpqBmU3M9oIAESM+yyQLkreETS0Kc\r\n' +
            'o01yl6dqqNBczH5FNTK88ypz38/jzjo47+DURlvGzjHJibiDsCz9KyiVmgbRrtvH\r\n' +
            '08rfnMbrU+grCkkx9wQI1GnLrYhr87oAAAAAAAAAAAAA\r\n' +
            '-----END PKCS7-----\r\n',
        p73des:
            '-----BEGIN PKCS7-----\r\n' +
            'MIICTQYJKoZIhvcNAQcDoIICPjCCAjoCAQAxggHGMIIBwgIBADCBqTCBmzELMAkG\r\n' +
            'A1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25pYTEQMA4GA1UEBwwHQW5zYmFjaDEV\r\n' +
            'MBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYDVQQLDAlHZWllcmxlaW4xFjAUBgNV\r\n' +
            'BAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG9w0BCQEWFHN0ZXNpZUBicm9rZW5w\r\n' +
            'aXBlLmRlAgkA1FQcQNg14vMwDQYJKoZIhvcNAQEBBQAEggEAS6K+sQvdKcK6YafJ\r\n' +
            'maDPjBzyjf5jtBgVrFgBXTCRIp/Z2zAXa70skfxhbwTgmilYTacA7jPGRrnLmvBc\r\n' +
            'BjhyCKM3dRUyYgh1K1ka0w1prvLmRk6Onf5df1ZQn3AJMIujJZcCOhbV1ByLInve\r\n' +
            'xn02KNHstGmdHM/JGyPCp+iYGprhUozVSpNCKS+R33EbsT0sAxamfqdAblT9+5Qj\r\n' +
            '4CABvW11a1clPV7STwBbAKbZaLs8mDeoWP0yHvBtJ7qzZdSgJJA2oU7SDv4icwEe\r\n' +
            'Ahccbe2HWkLRw8G5YG9XcWx5PnQQhhnXMxkLoSMIYxItyL/cRORbpDohd+otAo66\r\n' +
            'WLH1ODBrBgkqhkiG9w0BBwEwFAYIKoZIhvcNAwcECD5EWJMv1fd7gEj1w3WM1KsM\r\n' +
            'L8GDk9JoqA8t9v3oXCT0nAMXoNpHZMnv+0UHHVljlSXBTQxwUP5VMY/ddquJ5O3N\r\n' +
            'rDEqqJuHB+KPIsW1kxrdplU=\r\n' +
            '-----END PKCS7-----\r\n',
        degenerateP7:
            '-----BEGIN PKCS7-----\r\n' +
            'MIID4wYJKoZIhvcNAQcCoIID1DCCA9ACAQExADALBgkqhkiG9w0BBwGgggO4MIID\r\n' +
            'tDCCApwCCQDUVBxA2DXi8zANBgkqhkiG9w0BAQUFADCBmzELMAkGA1UEBhMCREUx\r\n' +
            'EjAQBgNVBAgMCUZyYW5jb25pYTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UECgwM\r\n' +
            'U3RlZmFuIFNpZWdsMRIwEAYDVQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdlaWVy\r\n' +
            'bGVpbiBERVYxIzAhBgkqhkiG9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRlMB4X\r\n' +
            'DTEyMDMxODIyNTc0M1oXDTEzMDMxODIyNTc0M1owgZsxCzAJBgNVBAYTAkRFMRIw\r\n' +
            'EAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNVBAoMDFN0\r\n' +
            'ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1HZWllcmxl\r\n' +
            'aW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5kZTCCASIw\r\n' +
            'DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMsAbQ4fWevHqP1K1y/ewpMS3vYo\r\n' +
            'vBto7IsKBq0v3NmC2kPf3NhyaSKfjOOS5uAPONLffLck+iGdOLLFia6OSpM60tyQ\r\n' +
            'IV9lHoRh7fOEYORab0Z+aBUZcEGT9yotBOraX1YbKc5f9XO+80eG4XYvb5ua1NHr\r\n' +
            'xWqe4w2p3zGJCKO+wHpvGkbKz0nfu36jwWz5aihfHi9hp/xs8mfH86mIKiD7f2X2\r\n' +
            'KeZ1PK9RvppA0X3lLb2VLOqMt+FHWicyZ/wjhQZ4oW55ln2yYJUQ+adlgaYnPrtn\r\n' +
            'sxmbTxM+99oF0F2/HmGrNs8nLZSva1Vy+hmjmWz6/O8ZxhiIj7oBRqYcAocCAwEA\r\n' +
            'ATANBgkqhkiG9w0BAQUFAAOCAQEAvfvtu31GFBO5+mFjPAoR4BlzKq/H3EPOqS8c\r\n' +
            'm/TjHgDRALwSnwKYCFs/bXqE4iOTD6otV4TusX3EPbqL2vzZQEcZn6paU/oZZVXw\r\n' +
            'QqMqY5tf2teQiNxqxNmSIEPRHOr2QVBVIx2YF4Po89KGUqJ9u/3/10lDqRwpsRei\r\n' +
            'jr5UKv5aygEcnwcW8+Ne4rTx934UDsutKG20dr5trZfWQRVS9fS9CFwJehEXHAMU\r\n' +
            'c/0++80NhfQthmWZWlWM1R3dr4TrIPtWdn5z0MtGeDvqBk7HjGrhcVS6kAsyZ9y/\r\n' +
            'lfLPjBuxlQAHztEJCWgI4TW3/RLhgfg2gI1noM2n84CdmisfkjEA\r\n' +
            '-----END PKCS7-----\r\n',
        signedDataNoAttrs:
            '-----BEGIN PKCS7-----\r\n' +
            'MIIF2gYJKoZIhvcNAQcCoIIFyzCCBccCAQExDzANBglghkgBZQMEAgEFADAcBgkq\r\n' +
            'hkiG9w0BBwGgDwQNVG8gYmUgc2lnbmVkLqCCA7gwggO0MIICnAIJANRUHEDYNeLz\r\n' +
            'MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJERTESMBAGA1UECAwJRnJhbmNv\r\n' +
            'bmlhMRAwDgYDVQQHDAdBbnNiYWNoMRUwEwYDVQQKDAxTdGVmYW4gU2llZ2wxEjAQ\r\n' +
            'BgNVBAsMCUdlaWVybGVpbjEWMBQGA1UEAwwNR2VpZXJsZWluIERFVjEjMCEGCSqG\r\n' +
            'SIb3DQEJARYUc3Rlc2llQGJyb2tlbnBpcGUuZGUwHhcNMTIwMzE4MjI1NzQzWhcN\r\n' +
            'MTMwMzE4MjI1NzQzWjCBmzELMAkGA1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25p\r\n' +
            'YTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYD\r\n' +
            'VQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG\r\n' +
            '9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRlMIIBIjANBgkqhkiG9w0BAQEFAAOC\r\n' +
            'AQ8AMIIBCgKCAQEAywBtDh9Z68eo/UrXL97CkxLe9ii8G2jsiwoGrS/c2YLaQ9/c\r\n' +
            '2HJpIp+M45Lm4A840t98tyT6IZ04ssWJro5KkzrS3JAhX2UehGHt84Rg5FpvRn5o\r\n' +
            'FRlwQZP3Ki0E6tpfVhspzl/1c77zR4bhdi9vm5rU0evFap7jDanfMYkIo77Aem8a\r\n' +
            'RsrPSd+7fqPBbPlqKF8eL2Gn/GzyZ8fzqYgqIPt/ZfYp5nU8r1G+mkDRfeUtvZUs\r\n' +
            '6oy34UdaJzJn/COFBnihbnmWfbJglRD5p2WBpic+u2ezGZtPEz732gXQXb8eYas2\r\n' +
            'zyctlK9rVXL6GaOZbPr87xnGGIiPugFGphwChwIDAQABMA0GCSqGSIb3DQEBBQUA\r\n' +
            'A4IBAQC9++27fUYUE7n6YWM8ChHgGXMqr8fcQ86pLxyb9OMeANEAvBKfApgIWz9t\r\n' +
            'eoTiI5MPqi1XhO6xfcQ9uova/NlARxmfqlpT+hllVfBCoypjm1/a15CI3GrE2ZIg\r\n' +
            'Q9Ec6vZBUFUjHZgXg+jz0oZSon27/f/XSUOpHCmxF6KOvlQq/lrKARyfBxbz417i\r\n' +
            'tPH3fhQOy60obbR2vm2tl9ZBFVL19L0IXAl6ERccAxRz/T77zQ2F9C2GZZlaVYzV\r\n' +
            'Hd2vhOsg+1Z2fnPQy0Z4O+oGTseMauFxVLqQCzJn3L+V8s+MG7GVAAfO0QkJaAjh\r\n' +
            'Nbf9EuGB+DaAjWegzafzgJ2aKx+SMYIB1TCCAdECAQEwgakwgZsxCzAJBgNVBAYT\r\n' +
            'AkRFMRIwEAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNV\r\n' +
            'BAoMDFN0ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1H\r\n' +
            'ZWllcmxlaW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5k\r\n' +
            'ZQIJANRUHEDYNeLzMA0GCWCGSAFlAwQCAQUAMA0GCSqGSIb3DQEBAQUABIIBACkZ\r\n' +
            'SgO2Q15+6W3/vGCwaYCxKN0l9+OgPIRxiVIhzm0Sgb71iHaC+FByrTdtsy2PJPmG\r\n' +
            '0+cYX0Wd70ghScxAYJXnHEVZN/G/yEI6hLNY21j77IZeCS2XnZakZihRNMfmHxCZ\r\n' +
            '4lKiAyYkK6fvtAgPPt9wqw/EMcyp4CisNSeNVQq9nPDXojgbglGTV1z+x8Q1kIWA\r\n' +
            '2L46xrlAQ5sGRulP47zweS07mSooEjqx/xCs9kK+MYGukLiBCWq79ixdfTb4XpYj\r\n' +
            '0pRXsBgGNbe1FClekomqKBeeuTfBgyKd+HhabcCNc6Q7kZBfBU9T0JUFhPj5ut39\r\n' +
            'JYiOgKdXRs1MdQqnl0Q=\r\n' +
            '-----END PKCS7-----\r\n',
        signedDataWithAttrs1949GeneralizedTime:
            '-----BEGIN PKCS7-----\r\n' +
            'MIIGRwYJKoZIhvcNAQcCoIIGODCCBjQCAQExDzANBglghkgBZQMEAgEFADAcBgkq\r\n' +
            'hkiG9w0BBwGgDwQNVG8gYmUgc2lnbmVkLqCCA7gwggO0MIICnAIJANRUHEDYNeLz\r\n' +
            'MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJERTESMBAGA1UECAwJRnJhbmNv\r\n' +
            'bmlhMRAwDgYDVQQHDAdBbnNiYWNoMRUwEwYDVQQKDAxTdGVmYW4gU2llZ2wxEjAQ\r\n' +
            'BgNVBAsMCUdlaWVybGVpbjEWMBQGA1UEAwwNR2VpZXJsZWluIERFVjEjMCEGCSqG\r\n' +
            'SIb3DQEJARYUc3Rlc2llQGJyb2tlbnBpcGUuZGUwHhcNMTIwMzE4MjI1NzQzWhcN\r\n' +
            'MTMwMzE4MjI1NzQzWjCBmzELMAkGA1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25p\r\n' +
            'YTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYD\r\n' +
            'VQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG\r\n' +
            '9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRlMIIBIjANBgkqhkiG9w0BAQEFAAOC\r\n' +
            'AQ8AMIIBCgKCAQEAywBtDh9Z68eo/UrXL97CkxLe9ii8G2jsiwoGrS/c2YLaQ9/c\r\n' +
            '2HJpIp+M45Lm4A840t98tyT6IZ04ssWJro5KkzrS3JAhX2UehGHt84Rg5FpvRn5o\r\n' +
            'FRlwQZP3Ki0E6tpfVhspzl/1c77zR4bhdi9vm5rU0evFap7jDanfMYkIo77Aem8a\r\n' +
            'RsrPSd+7fqPBbPlqKF8eL2Gn/GzyZ8fzqYgqIPt/ZfYp5nU8r1G+mkDRfeUtvZUs\r\n' +
            '6oy34UdaJzJn/COFBnihbnmWfbJglRD5p2WBpic+u2ezGZtPEz732gXQXb8eYas2\r\n' +
            'zyctlK9rVXL6GaOZbPr87xnGGIiPugFGphwChwIDAQABMA0GCSqGSIb3DQEBBQUA\r\n' +
            'A4IBAQC9++27fUYUE7n6YWM8ChHgGXMqr8fcQ86pLxyb9OMeANEAvBKfApgIWz9t\r\n' +
            'eoTiI5MPqi1XhO6xfcQ9uova/NlARxmfqlpT+hllVfBCoypjm1/a15CI3GrE2ZIg\r\n' +
            'Q9Ec6vZBUFUjHZgXg+jz0oZSon27/f/XSUOpHCmxF6KOvlQq/lrKARyfBxbz417i\r\n' +
            'tPH3fhQOy60obbR2vm2tl9ZBFVL19L0IXAl6ERccAxRz/T77zQ2F9C2GZZlaVYzV\r\n' +
            'Hd2vhOsg+1Z2fnPQy0Z4O+oGTseMauFxVLqQCzJn3L+V8s+MG7GVAAfO0QkJaAjh\r\n' +
            'Nbf9EuGB+DaAjWegzafzgJ2aKx+SMYICQjCCAj4CAQEwgakwgZsxCzAJBgNVBAYT\r\n' +
            'AkRFMRIwEAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNV\r\n' +
            'BAoMDFN0ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1H\r\n' +
            'ZWllcmxlaW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5k\r\n' +
            'ZQIJANRUHEDYNeLzMA0GCWCGSAFlAwQCAQUAoGswGAYJKoZIhvcNAQkDMQsGCSqG\r\n' +
            'SIb3DQEHATAvBgkqhkiG9w0BCQQxIgQgL/TDBQ+1LmkIk4u0TacbQj6GvXtVN5Sr\r\n' +
            'LFvTa+Sr82MwHgYJKoZIhvcNAQkFMREYDzE5NDkxMjMxMjM1OTU5WjANBgkqhkiG\r\n' +
            '9w0BAQEFAASCAQCNB13woMM5xYY5B0k/2dDF1flyAs5JaahqXSIH04ea+qgyFkgZ\r\n' +
            'uRoialeVzXXXpSPmpgEubQimFMYFslle9Ozpu6ECrXtw53wWm1GAlj8T6w50lKyd\r\n' +
            '6Ip/wclO/lPIB9qk7Ki3kN+ISBWXSgUMTTo94IdyZH3lbBqW3xsak1FM6STrGiUS\r\n' +
            'CoinmPKajIbIQBUORZ9eF9qN5erdpKwYNMB43yLle5jNGIeq6ztbL9en9boFp04q\r\n' +
            'PU+/ZeNY2QJhnoGQVYfHkK+8X6/ZKX1fRnca2L+DUUb9g7Tc0oeW5zwB3wzIEpTN\r\n' +
            'JxV3HaZ/Jvfnx9uH9wpFYg5yFX6PBLxlHarf\r\n' +
            '-----END PKCS7-----\r\n',
        signedDataWithAttrs1950UTCTime:
            '-----BEGIN PKCS7-----\r\n' +
            'MIIGRQYJKoZIhvcNAQcCoIIGNjCCBjICAQExDzANBglghkgBZQMEAgEFADAcBgkq\r\n' +
            'hkiG9w0BBwGgDwQNVG8gYmUgc2lnbmVkLqCCA7gwggO0MIICnAIJANRUHEDYNeLz\r\n' +
            'MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJERTESMBAGA1UECAwJRnJhbmNv\r\n' +
            'bmlhMRAwDgYDVQQHDAdBbnNiYWNoMRUwEwYDVQQKDAxTdGVmYW4gU2llZ2wxEjAQ\r\n' +
            'BgNVBAsMCUdlaWVybGVpbjEWMBQGA1UEAwwNR2VpZXJsZWluIERFVjEjMCEGCSqG\r\n' +
            'SIb3DQEJARYUc3Rlc2llQGJyb2tlbnBpcGUuZGUwHhcNMTIwMzE4MjI1NzQzWhcN\r\n' +
            'MTMwMzE4MjI1NzQzWjCBmzELMAkGA1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25p\r\n' +
            'YTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYD\r\n' +
            'VQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG\r\n' +
            '9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRlMIIBIjANBgkqhkiG9w0BAQEFAAOC\r\n' +
            'AQ8AMIIBCgKCAQEAywBtDh9Z68eo/UrXL97CkxLe9ii8G2jsiwoGrS/c2YLaQ9/c\r\n' +
            '2HJpIp+M45Lm4A840t98tyT6IZ04ssWJro5KkzrS3JAhX2UehGHt84Rg5FpvRn5o\r\n' +
            'FRlwQZP3Ki0E6tpfVhspzl/1c77zR4bhdi9vm5rU0evFap7jDanfMYkIo77Aem8a\r\n' +
            'RsrPSd+7fqPBbPlqKF8eL2Gn/GzyZ8fzqYgqIPt/ZfYp5nU8r1G+mkDRfeUtvZUs\r\n' +
            '6oy34UdaJzJn/COFBnihbnmWfbJglRD5p2WBpic+u2ezGZtPEz732gXQXb8eYas2\r\n' +
            'zyctlK9rVXL6GaOZbPr87xnGGIiPugFGphwChwIDAQABMA0GCSqGSIb3DQEBBQUA\r\n' +
            'A4IBAQC9++27fUYUE7n6YWM8ChHgGXMqr8fcQ86pLxyb9OMeANEAvBKfApgIWz9t\r\n' +
            'eoTiI5MPqi1XhO6xfcQ9uova/NlARxmfqlpT+hllVfBCoypjm1/a15CI3GrE2ZIg\r\n' +
            'Q9Ec6vZBUFUjHZgXg+jz0oZSon27/f/XSUOpHCmxF6KOvlQq/lrKARyfBxbz417i\r\n' +
            'tPH3fhQOy60obbR2vm2tl9ZBFVL19L0IXAl6ERccAxRz/T77zQ2F9C2GZZlaVYzV\r\n' +
            'Hd2vhOsg+1Z2fnPQy0Z4O+oGTseMauFxVLqQCzJn3L+V8s+MG7GVAAfO0QkJaAjh\r\n' +
            'Nbf9EuGB+DaAjWegzafzgJ2aKx+SMYICQDCCAjwCAQEwgakwgZsxCzAJBgNVBAYT\r\n' +
            'AkRFMRIwEAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNV\r\n' +
            'BAoMDFN0ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1H\r\n' +
            'ZWllcmxlaW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5k\r\n' +
            'ZQIJANRUHEDYNeLzMA0GCWCGSAFlAwQCAQUAoGkwGAYJKoZIhvcNAQkDMQsGCSqG\r\n' +
            'SIb3DQEHATAvBgkqhkiG9w0BCQQxIgQgL/TDBQ+1LmkIk4u0TacbQj6GvXtVN5Sr\r\n' +
            'LFvTa+Sr82MwHAYJKoZIhvcNAQkFMQ8XDTUwMDEwMTAwMDAwMFowDQYJKoZIhvcN\r\n' +
            'AQEBBQAEggEAAXj+K+xWholoBHW+ur8MZ+L35IzBPpl+TwuyxuHQ0ex9euSjyhD7\r\n' +
            'TWCuiQmq8NtWB1k6l5a3h1RmBZqpCdkLqRXlhtk3EwNI4/bqy/KJD1QA3SrxXug7\r\n' +
            '0AcMSPZqz9mj1IgU2OB/p3hnjK4KC0YO0dVWooyv28vrW/3JOy2Lgb3/yyuHChNL\r\n' +
            'ff8E2MPiJx8901oYFJ+A/5nqb/3Q4ZS6zXWV65GWmCzWFHVNT9Jx88gAB96Y+KCT\r\n' +
            'XyGjH28wwB1GzskEZ0oMNCtzqZ9RXvllYQoVkzvLluBfQiuiU97G4ys6B4nOTNi2\r\n' +
            'gwbBcDl+50dPc2TncPe0uPfHgo5/Pr2ckA==\r\n' +
            '-----END PKCS7-----\r\n',
        signedDataWithAttrs2049UTCTime:
            '-----BEGIN PKCS7-----\r\n' +
            'MIIGRQYJKoZIhvcNAQcCoIIGNjCCBjICAQExDzANBglghkgBZQMEAgEFADAcBgkq\r\n' +
            'hkiG9w0BBwGgDwQNVG8gYmUgc2lnbmVkLqCCA7gwggO0MIICnAIJANRUHEDYNeLz\r\n' +
            'MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJERTESMBAGA1UECAwJRnJhbmNv\r\n' +
            'bmlhMRAwDgYDVQQHDAdBbnNiYWNoMRUwEwYDVQQKDAxTdGVmYW4gU2llZ2wxEjAQ\r\n' +
            'BgNVBAsMCUdlaWVybGVpbjEWMBQGA1UEAwwNR2VpZXJsZWluIERFVjEjMCEGCSqG\r\n' +
            'SIb3DQEJARYUc3Rlc2llQGJyb2tlbnBpcGUuZGUwHhcNMTIwMzE4MjI1NzQzWhcN\r\n' +
            'MTMwMzE4MjI1NzQzWjCBmzELMAkGA1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25p\r\n' +
            'YTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYD\r\n' +
            'VQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG\r\n' +
            '9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRlMIIBIjANBgkqhkiG9w0BAQEFAAOC\r\n' +
            'AQ8AMIIBCgKCAQEAywBtDh9Z68eo/UrXL97CkxLe9ii8G2jsiwoGrS/c2YLaQ9/c\r\n' +
            '2HJpIp+M45Lm4A840t98tyT6IZ04ssWJro5KkzrS3JAhX2UehGHt84Rg5FpvRn5o\r\n' +
            'FRlwQZP3Ki0E6tpfVhspzl/1c77zR4bhdi9vm5rU0evFap7jDanfMYkIo77Aem8a\r\n' +
            'RsrPSd+7fqPBbPlqKF8eL2Gn/GzyZ8fzqYgqIPt/ZfYp5nU8r1G+mkDRfeUtvZUs\r\n' +
            '6oy34UdaJzJn/COFBnihbnmWfbJglRD5p2WBpic+u2ezGZtPEz732gXQXb8eYas2\r\n' +
            'zyctlK9rVXL6GaOZbPr87xnGGIiPugFGphwChwIDAQABMA0GCSqGSIb3DQEBBQUA\r\n' +
            'A4IBAQC9++27fUYUE7n6YWM8ChHgGXMqr8fcQ86pLxyb9OMeANEAvBKfApgIWz9t\r\n' +
            'eoTiI5MPqi1XhO6xfcQ9uova/NlARxmfqlpT+hllVfBCoypjm1/a15CI3GrE2ZIg\r\n' +
            'Q9Ec6vZBUFUjHZgXg+jz0oZSon27/f/XSUOpHCmxF6KOvlQq/lrKARyfBxbz417i\r\n' +
            'tPH3fhQOy60obbR2vm2tl9ZBFVL19L0IXAl6ERccAxRz/T77zQ2F9C2GZZlaVYzV\r\n' +
            'Hd2vhOsg+1Z2fnPQy0Z4O+oGTseMauFxVLqQCzJn3L+V8s+MG7GVAAfO0QkJaAjh\r\n' +
            'Nbf9EuGB+DaAjWegzafzgJ2aKx+SMYICQDCCAjwCAQEwgakwgZsxCzAJBgNVBAYT\r\n' +
            'AkRFMRIwEAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNV\r\n' +
            'BAoMDFN0ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1H\r\n' +
            'ZWllcmxlaW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5k\r\n' +
            'ZQIJANRUHEDYNeLzMA0GCWCGSAFlAwQCAQUAoGkwGAYJKoZIhvcNAQkDMQsGCSqG\r\n' +
            'SIb3DQEHATAvBgkqhkiG9w0BCQQxIgQgL/TDBQ+1LmkIk4u0TacbQj6GvXtVN5Sr\r\n' +
            'LFvTa+Sr82MwHAYJKoZIhvcNAQkFMQ8XDTQ5MTIzMTIzNTk1OVowDQYJKoZIhvcN\r\n' +
            'AQEBBQAEggEAaia2iz9VIHbHbOpzDZwRIW3//qPs4eENkXmPYNkERBFx/OH6JRRg\r\n' +
            '/ZvPbP+QIMJVIQsg2o/G3wWv9xJT9RGZatDrTJiIaYyFaBaxBjKXkhwJ+wOOe9+p\r\n' +
            '1mg6sKFlItvwPjVXGUOLb3R1eIBEAMpSiDz7Z3OOT+P4X32Vo1ZyWNA6MHDzxMLi\r\n' +
            'FaRytBJNfJJrjGBu0bqht8NFZxc3gqh7Jf19+FKRe8vOZ2cr+0iFRotc/CYvJ71E\r\n' +
            'R0JQEccTTc3t+UZXLy0rfJP4UAEWofcqrYhVB1ZR/xfx5LbGd89FvuxOYwnh0Ikh\r\n' +
            'KkKsXLPyzevGPB1i5PCtiI/Tbuwa7fBrgQ==\r\n' +
            '-----END PKCS7-----\r\n',
        signedDataWithAttrs2050GeneralizedTime:
            '-----BEGIN PKCS7-----\r\n' +
            'MIIGRwYJKoZIhvcNAQcCoIIGODCCBjQCAQExDzANBglghkgBZQMEAgEFADAcBgkq\r\n' +
            'hkiG9w0BBwGgDwQNVG8gYmUgc2lnbmVkLqCCA7gwggO0MIICnAIJANRUHEDYNeLz\r\n' +
            'MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJERTESMBAGA1UECAwJRnJhbmNv\r\n' +
            'bmlhMRAwDgYDVQQHDAdBbnNiYWNoMRUwEwYDVQQKDAxTdGVmYW4gU2llZ2wxEjAQ\r\n' +
            'BgNVBAsMCUdlaWVybGVpbjEWMBQGA1UEAwwNR2VpZXJsZWluIERFVjEjMCEGCSqG\r\n' +
            'SIb3DQEJARYUc3Rlc2llQGJyb2tlbnBpcGUuZGUwHhcNMTIwMzE4MjI1NzQzWhcN\r\n' +
            'MTMwMzE4MjI1NzQzWjCBmzELMAkGA1UEBhMCREUxEjAQBgNVBAgMCUZyYW5jb25p\r\n' +
            'YTEQMA4GA1UEBwwHQW5zYmFjaDEVMBMGA1UECgwMU3RlZmFuIFNpZWdsMRIwEAYD\r\n' +
            'VQQLDAlHZWllcmxlaW4xFjAUBgNVBAMMDUdlaWVybGVpbiBERVYxIzAhBgkqhkiG\r\n' +
            '9w0BCQEWFHN0ZXNpZUBicm9rZW5waXBlLmRlMIIBIjANBgkqhkiG9w0BAQEFAAOC\r\n' +
            'AQ8AMIIBCgKCAQEAywBtDh9Z68eo/UrXL97CkxLe9ii8G2jsiwoGrS/c2YLaQ9/c\r\n' +
            '2HJpIp+M45Lm4A840t98tyT6IZ04ssWJro5KkzrS3JAhX2UehGHt84Rg5FpvRn5o\r\n' +
            'FRlwQZP3Ki0E6tpfVhspzl/1c77zR4bhdi9vm5rU0evFap7jDanfMYkIo77Aem8a\r\n' +
            'RsrPSd+7fqPBbPlqKF8eL2Gn/GzyZ8fzqYgqIPt/ZfYp5nU8r1G+mkDRfeUtvZUs\r\n' +
            '6oy34UdaJzJn/COFBnihbnmWfbJglRD5p2WBpic+u2ezGZtPEz732gXQXb8eYas2\r\n' +
            'zyctlK9rVXL6GaOZbPr87xnGGIiPugFGphwChwIDAQABMA0GCSqGSIb3DQEBBQUA\r\n' +
            'A4IBAQC9++27fUYUE7n6YWM8ChHgGXMqr8fcQ86pLxyb9OMeANEAvBKfApgIWz9t\r\n' +
            'eoTiI5MPqi1XhO6xfcQ9uova/NlARxmfqlpT+hllVfBCoypjm1/a15CI3GrE2ZIg\r\n' +
            'Q9Ec6vZBUFUjHZgXg+jz0oZSon27/f/XSUOpHCmxF6KOvlQq/lrKARyfBxbz417i\r\n' +
            'tPH3fhQOy60obbR2vm2tl9ZBFVL19L0IXAl6ERccAxRz/T77zQ2F9C2GZZlaVYzV\r\n' +
            'Hd2vhOsg+1Z2fnPQy0Z4O+oGTseMauFxVLqQCzJn3L+V8s+MG7GVAAfO0QkJaAjh\r\n' +
            'Nbf9EuGB+DaAjWegzafzgJ2aKx+SMYICQjCCAj4CAQEwgakwgZsxCzAJBgNVBAYT\r\n' +
            'AkRFMRIwEAYDVQQIDAlGcmFuY29uaWExEDAOBgNVBAcMB0Fuc2JhY2gxFTATBgNV\r\n' +
            'BAoMDFN0ZWZhbiBTaWVnbDESMBAGA1UECwwJR2VpZXJsZWluMRYwFAYDVQQDDA1H\r\n' +
            'ZWllcmxlaW4gREVWMSMwIQYJKoZIhvcNAQkBFhRzdGVzaWVAYnJva2VucGlwZS5k\r\n' +
            'ZQIJANRUHEDYNeLzMA0GCWCGSAFlAwQCAQUAoGswGAYJKoZIhvcNAQkDMQsGCSqG\r\n' +
            'SIb3DQEHATAvBgkqhkiG9w0BCQQxIgQgL/TDBQ+1LmkIk4u0TacbQj6GvXtVN5Sr\r\n' +
            'LFvTa+Sr82MwHgYJKoZIhvcNAQkFMREYDzIwNTAwMTAxMDAwMDAwWjANBgkqhkiG\r\n' +
            '9w0BAQEFAASCAQB3OuKksiL1NjHq0qxkr6Cv/YmqSLbGebTDdHu0yIaN/E2OGXJh\r\n' +
            'ccJ/9xbTutsGQjpqsmb2ZoWlO095vKkmw1qK5V1mi9qtfV/Y7wsho41iCq1c4t4r\r\n' +
            'F5Jn+uOZS7sN61u/sR5rTD/JWCvQtfgMSuqzI0jo0D1wWzsTKl2MtK/K0hUB8Ehf\r\n' +
            'acWHh2FyjHm7XLmEGgX0eqq2ZQTn5+oUzQYBzf6JXP6S+8X7AIszRu5d+dYHHC2y\r\n' +
            'BNYbqBj3IQlM6XzmlHL39TuETQznWwN1VMfmW2rUniKmpwnOQynlOaFTd06Fxll3\r\n' +
            'f0ah+JXCk6Rr7eVY0VptmG7S7CyZIjc5MkMw\r\n' +
            '-----END PKCS7-----\r\n'
        };
        
        var p7 = forge.pkcs7.messageFromPem(_pem.p7);
        this.log("p7.type                   :[" + p7.type + "]");
        this.log("PKI.oids.envelopedData    :[" + forge.pki.oids.envelopedData + "]");
        this.log("p7.version                :[" + p7.version + "]");
        this.log("p7.recipients.length      :[" + p7.recipients.length + "]");
        this.log("p7.recipients[0].version  :[" + p7.recipients[0].version + "]");
        this.log(":[" + p7.recipients[0].serialNumber + "]");

        //
        this.log("*** Test converted RDN, which is constructed of seven parts. ***");
        this.log("p7.recipients[0].issuer.length    :[" + p7.recipients[0].issuer.length + "]");
        this.log("p7.recipients[0].issuer[0].type   :[" + p7.recipients[0].issuer[0].type + "]");
        this.log("p7.recipients[0].issuer[0].value  :[" + p7.recipients[0].issuer[0].value + "]");
        this.log("p7.recipients[0].issuer[1].type   :[" + p7.recipients[0].issuer[1].type + "]");
        this.log("p7.recipients[0].issuer[1].value  :[" + p7.recipients[0].issuer[1].value + "]");
        this.log("p7.recipients[0].issuer[2].type   :[" + p7.recipients[0].issuer[2].type + "]");
        this.log("p7.recipients[0].issuer[2].value  :[" + p7.recipients[0].issuer[2].value + "]");
        this.log("p7.recipients[0].issuer[3].type   :[" + p7.recipients[0].issuer[3].type + "]");
        this.log("p7.recipients[0].issuer[3].value  :[" + p7.recipients[0].issuer[3].value + "]");
        this.log("p7.recipients[0].issuer[4].type   :[" + p7.recipients[0].issuer[4].type + "]");
        this.log("p7.recipients[0].issuer[4].value  :[" + p7.recipients[0].issuer[4].value + "]");
        this.log("p7.recipients[0].issuer[5].type   :[" + p7.recipients[0].issuer[5].type + "]");
        this.log("p7.recipients[0].issuer[5].value  :[" + p7.recipients[0].issuer[5].value + "]");
        this.log("p7.recipients[0].issuer[6].type   :[" + p7.recipients[0].issuer[6].type + "]");
        this.log("p7.recipients[0].issuer[6].value  :[" + p7.recipients[0].issuer[6].value + "]");
        
        this.log("p7.recipients[0].encryptedContent.algorithm:[" + p7.recipients[0].encryptedContent.algorithm + "]");
        this.log("PKI.oids.rsaEncryption                     :[" + forge.pki.oids.rsaEncryption + "]");
        this.log("p7.recipients[0].encryptedContent.content.length_1:[" + p7.recipients[0].encryptedContent.content.length + "]");
        
        this.log("p7.encryptedContent.algorithm:[" + p7.encryptedContent.algorithm + "]");
        this.log("PKI.oids['aes256-CBC']:[" + forge.pki.oids['aes256-CBC'] + "]");
        this.log("p7.encryptedContent.parameter.data.length:[" + p7.encryptedContent.parameter.data.length + "]");
        //pkcs7 test /////////////////////////////////////////////////

        //should import indefinite length message from PEM
        this.log("*** should import indefinite length message from PEM ***");
        p7 = forge.pkcs7.messageFromPem(_pem.p7IndefiniteLength);
        this.log("p7.type:[" + p7.type + "]");
        this.log("PKI.oids.envelopedData:[" + forge.pki.oids.envelopedData + "]");
        this.log("p7.encryptedContent.parameter.toHex():[" + p7.encryptedContent.parameter.toHex() + "]");
        this.log("p7.encryptedContent.content.length():[" + p7.encryptedContent.content.length() + "]");

        
        //should find recipient by serial number
        this.log("*** should find recipient by serial number ***");
        p7 = forge.pkcs7.messageFromPem(_pem.p7);
        var cert = forge.pki.certificateFromPem(_pem.certificate);

        var ri = p7.findRecipient(cert);
        this.log("ri.serialNumber:[" + ri.serialNumber + "]");
        
        // modify certificate so it doesn't match recipient any more
        cert.serialNumber = '1234567890abcdef42';
        ri = p7.findRecipient(cert);
        this.log("ri:[" + ri + "]");

/ *
        //should aes-decrypt message
        this.log("*** should aes-decrypt message ***");
        p7 = forge.pkcs7.messageFromPem(_pem.p7);
        var privateKey = forge.pki.privateKeyFromPem(_pem.privateKey);
        p7.decrypt(p7.recipients[0], privateKey);
        
        // symmetric key must be 32 bytes long (AES 256 key)
        this.log("p7.encryptedContent.key.data.length:[" + p7.encryptedContent.key.data.length + "]");
        this.log("p7.content:[" + p7.content + "]");

        

        //should 3des-decrypt message
        this.log("*** should 3des-decrypt message ***");
        p7 = forge.pkcs7.messageFromPem(_pem.p73des);
        privateKey = forge.pki.privateKeyFromPem(_pem.privateKey);
        p7.decrypt(p7.recipients[0], privateKey);
        
        // symmetric key must be 24 bytes long (DES3 key)
        this.log("p7.encryptedContent.key.data.length:[" + p7.encryptedContent.key.data.length + "]");
        this.log("p7.content:[" + p7.content + "]");
* /
        
        //should add a recipient
        this.log("*** should add a recipient ***");
        p7 = forge.pkcs7.createEnvelopedData();
        
        // initially there should be no recipients
        this.log("p7.recipients.length:[" + p7.recipients.length + "]");
        
        var cert = forge.pki.certificateFromPem(_pem.certificate);
        p7.addRecipient(cert);
        
        this.log("p7.recipients.length:[" + p7.recipients.length + "]");
        this.log("p7.recipients[0].serialNumber:[" + p7.recipients[0].serialNumber + "]");
        this.log("cert.serialNumber:[" + cert.serialNumber + "]");
        this.log("p7.recipients[0].issuer:[" + p7.recipients[0].issuer + "]");
        this.log("cert.subject.attributes:[" + cert.subject.attributes + "]");
        this.log("p7.recipients[0].encryptedContent.key:[" + p7.recipients[0].encryptedContent.key + "]");
        this.log("cert.publicKey:[" + cert.publicKey + "]");
        
/ *
        //should aes-encrypt a message
        this.log("*** should aes-encrypt a message ***");
        p7 = forge.pkcs7.createEnvelopedData();
        var cert = forge.pki.certificateFromPem(_pem.certificate);
        var privateKey = forge.pki.privateKeyFromPem(_pem.privateKey);
        
        p7.addRecipient(cert);
        p7.content = forge.util.createBuffer('Just a little test');
        
        // pre-condition, PKCS#7 module should default to AES-256-CBC
        this.log("p7.encryptedContent.algorithm:[" + p7.encryptedContent.algorithm + "]");
        this.log("PKI.oids['aes256-CBC']:[" + forge.pki.oids['aes256-CBC'] +"]");
        p7.encrypt();
        
        // since we did not provide a key, a random key should have been created
        // automatically, AES256 requires 32 bytes of key material
        this.log("p7.encryptedContent.key.data.length:[" + p7.encryptedContent.key.data.length + "]");
        
        // furthermore an IV must be generated, AES256 has 16 byte IV
        this.log("p7.encryptedContent.parameter.data.length:[" + p7.encryptedContent.parameter.data.length + "]");
        
        // content is 18 bytes long, AES has 16 byte blocksize,
        // with padding that makes 32 bytes
        this.log("p7.encryptedContent.content.data.length:[" + p7.encryptedContent.content.data.length + "]");
        
        // RSA encryption should yield 256 bytes
        this.log("p7.recipients[0].encryptedContent.content.length_2:[" + p7.recipients[0].encryptedContent.content.length + "]");
        
        // rewind Key & IV
        p7.encryptedContent.key.read = 0;
        p7.encryptedContent.parameter.read = 0;
        
        // decryption of the asym. encrypted data should reveal the symmetric key
        var decryptedKey = privateKey.decrypt(p7.recipients[0].encryptedContent.content);
        this.log("decryptedKey:[" + decryptedKey + "]");
        this.log("p7.encryptedContent.key.data:[" + p7.encryptedContent.key.data + "]");
        
        // decryption of sym. encrypted data should reveal the content
        var ciph = forge.aes.createDecryptionCipher(decryptedKey);
        ciph.start(p7.encryptedContent.parameter);
        ciph.update(p7.encryptedContent.content);
        ciph.finish();
        this.log("ciph.output:[" + ciph.output + "]");
// * //
        //should 3des-ede-encrypt a message
        this.log("*** should 3des-ede-encrypt a message ****");
        var p7 = forge.pkcs7.createEnvelopedData();
        var cert = forge.pki.certificateFromPem(_pem.certificate);
        var privateKey = forge.pki.privateKeyFromPem(_pem.privateKey);
        
        p7.addRecipient(cert);
        p7.content = forge.util.createBuffer('Just a little test');
        p7.encryptedContent.algorithm = forge.pki.oids['des-EDE3-CBC'];
        p7.encrypt();
        
        // since we did not provide a key, a random key should have been created
        // automatically, 3DES-EDE requires 24 bytes of key material
        this.log("p7.encryptedContent.key.data.length:[" + p7.encryptedContent.key.data.length + "]");
        
        // furthermore an IV must be generated, DES3 has 8 byte IV
        this.log("p7.encryptedContent.parameter.data.length:[" + p7.encryptedContent.parameter.data.length + "]");
        
        // content is 18 bytes long, DES has 8 byte blocksize,
        // with padding that makes 24 bytes
        this.log("p7.encryptedContent.content.data.length:[" + p7.encryptedContent.content.data.length + "]");
        
        // RSA encryption should yield 256 bytes
        this.log("p7.recipients[0].encryptedContent.content.length_3:[" + p7.recipients[0].encryptedContent.content.length + "]");
        
        // rewind Key & IV
        p7.encryptedContent.key.read = 0;
        p7.encryptedContent.parameter.read = 0;
        
        // decryption of the asym. encrypted data should reveal the symmetric key
        var decryptedKey = privateKey.decrypt(
                                              p7.recipients[0].encryptedContent.content);
        this.log("decryptedKey:[" + decryptedKey + "]");
        this.log("p7.encryptedContent.key.data:[" + p7.encryptedContent.key.data + "]");
        
        // decryption of sym. encrypted data should reveal the content
        var ciph = forge.des.createDecryptionCipher(decryptedKey);
        ciph.start(p7.encryptedContent.parameter);
        ciph.update(p7.encryptedContent.content);
        ciph.finish();
        this.log("ciph.output:[" + ciph.output + "]");
// * /

        //should export message to PEM
        this.log("*** should export message to PEM ***");
        var p7 = forge.pkcs7.createEnvelopedData();
        p7.addRecipient(forge.pki.certificateFromPem(_pem.certificate));
        p7.content = forge.util.createBuffer('Just a little test');
        p7.encrypt();
        
        var pem = forge.pkcs7.messageToPem(p7);
        
        // convert back from PEM to new PKCS#7 object, decrypt, and test
        p7 = forge.pkcs7.messageFromPem(pem);
        p7.decrypt(p7.recipients[0], forge.pki.privateKeyFromPem(_pem.privateKey));
        this.log("p7.content:[" + p7.content + "]");
        //ASSERT.equal(p7.content, 'Just a little test');

        
        //should decrypt encrypted data from PEM
        var result = '1f8b08000000000000000b2e494d4bcc5308ce4c4dcfd15130b0b430d4b7343732b03437d05170cc2b4e4a4cced051b034343532d25170492d2d294ecec849cc4b0100bf52f02437000000';
        var key = 'b96e4a4c0a3555d31e1b295647cc5cfe74081918cb7f797b';
        key = forge.util.createBuffer(forge.util.hexToBytes(key));
        
            var p7 = forge.pkcs7.messageFromPem(_pem.encryptedData);
            this.log("p7.type:[" + p7.type + "]");
            this.log("forge.pki.oids.encryptedData:[" + forge.pki.oids.encryptedData + "]");
            this.log("p7.encryptedContent.algorithm:[" + p7.encryptedContent.algorithm + "]");
            this.log("PKI.oids['des-EDE3-CBC']:[" + PKI.oids['des-EDE3-CBC'] + "]");
            this.log("p7.encryptedContent.parameter.toHex():[" + p7.encryptedContent.parameter.toHex() + "]");
            this.log("p7.encryptedContent.content.length():[" + p7.encryptedContent.content.length() + "]");
        
            p7.decrypt(key);
            this.log("p7.content.toHex():[" + p7.content.toHex() + "]");
        
        //should create a degenerate PKCS#7 certificate container
        var p7 = forge.pkcs7.createSignedData();
        p7.addCertificate(_pem.certificate);
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.degenerateP7:[" + _pem.degenerateP7 + "]");
* /
        
        //should create PKCS#7 SignedData with no attributes
        this.log("*** should create PKCS#7 SignedData with no attributes ***");
        var p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer('To be signed.', 'utf8');
        p7.addCertificate(_pem.certificate);
        p7.addSigner({
                     key: forge.pki.privateKeyFromPem(_pem.privateKey),
                     certificate: _pem.certificate,
                     digestAlgorithm: forge.pki.oids.sha256
                     });
        p7.sign();
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.signedDataNoAttrs:[" + _pem.signedDataNoAttrs + "]");
        
        
        //should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using GeneralizedTime (1949)
        var p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer('To be signed.', 'utf8');
        p7.addCertificate(_pem.certificate);
        p7.addSigner({
                     key: forge.pki.privateKeyFromPem(_pem.privateKey),
                     certificate: _pem.certificate,
                     digestAlgorithm: forge.pki.oids.sha256,
                     authenticatedAttributes: [{
                                               type: forge.pki.oids.contentType,
                                               value: forge.pki.oids.data
                                               }, {
                                               type: forge.pki.oids.messageDigest
                                               // value will be auto-populated at signing time
                                               }, {
                                               type: forge.pki.oids.signingTime,
                                               // will be encoded as generalized time because it's before 1950
                                               value: new Date('1949-12-31T23:59:59Z')
                                               }]
                     });
        p7.sign();
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.signedDataWithAttrs1949GeneralizedTime:[" + _pem.signedDataWithAttrs1949GeneralizedTime + "]");

        
        //should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using UTCTime (1950)
        this.log("*** should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using UTCTime (1950) ***");
        var p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer('To be signed.', 'utf8');
        p7.addCertificate(_pem.certificate);
        p7.addSigner({
                     key: forge.pki.privateKeyFromPem(_pem.privateKey),
                     certificate: _pem.certificate,
                     digestAlgorithm: forge.pki.oids.sha256,
                     authenticatedAttributes: [{
                                               type: forge.pki.oids.contentType,
                                               value: forge.pki.oids.data
                                               }, {
                                               type: forge.pki.oids.messageDigest
                                               // value will be auto-populated at signing time
                                               }, {
                                               type: forge.pki.oids.signingTime,
                                               // will be encoded as UTC time because it's >= 1950
                                               value: new Date('1950-01-01T00:00:00Z')
                                               }]
                     });
        p7.sign();
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.signedDataWithAttrs1950UTCTime:[" + _pem.signedDataWithAttrs1950UTCTime + "]");

        
        //should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using UTCTime (2049)
        this.log("*** should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using UTCTime (2049) ***");
        var p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer('To be signed.', 'utf8');
        p7.addCertificate(_pem.certificate);
        p7.addSigner({
                     key: forge.pki.privateKeyFromPem(_pem.privateKey),
                     certificate: _pem.certificate,
                     digestAlgorithm: forge.pki.oids.sha256,
                     authenticatedAttributes: [{
                                               type: forge.pki.oids.contentType,
                                               value: forge.pki.oids.data
                                               }, {
                                               type: forge.pki.oids.messageDigest
                                               // value will be auto-populated at signing time
                                               }, {
                                               type: forge.pki.oids.signingTime,
                                               // will be encoded as generalized time because it's before 2050
                                               value: new Date('2049-12-31T23:59:59Z')
                                               }]
                     });
        p7.sign();
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.signedDataWithAttrs2049UTCTime:[" + _pem.signedDataWithAttrs2049UTCTime + "]");


        
        //should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using GeneralizedTime (2050)
        this.log("*** should create PKCS#7 SignedData with content-type, message-digest, and signing-time attributes using GeneralizedTime (2050) ***");
        var p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer('To be signed.', 'utf8');
        p7.addCertificate(_pem.certificate);
        p7.addSigner({
                     key: forge.pki.privateKeyFromPem(_pem.privateKey),
                     certificate: _pem.certificate,
                     digestAlgorithm: forge.pki.oids.sha256,
                     authenticatedAttributes: [{
                                               type: forge.pki.oids.contentType,
                                               value: forge.pki.oids.data
                                               }, {
                                               type: forge.pki.oids.messageDigest
                                               // value will be auto-populated at signing time
                                               }, {
                                               type: forge.pki.oids.signingTime,
                                               // will be encoded as UTC time because it's >= 2050
                                               value: new Date('2050-01-01T00:00:00Z')
                                               }]
                     });
        p7.sign();
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.signedDataWithAttrs2050GeneralizedTime:[" + _pem.signedDataWithAttrs2050GeneralizedTime + "]");


        
        //should create PKCS#7 SignedData with PEM-encoded private key
        var p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer('To be signed.', 'utf8');
        p7.addCertificate(_pem.certificate);
        p7.addSigner({
                     key: _pem.privateKey,
                     certificate: _pem.certificate,
                     digestAlgorithm: forge.pki.oids.sha256,
                     authenticatedAttributes: [{
                                               type: forge.pki.oids.contentType,
                                               value: forge.pki.oids.data
                                               }, {
                                               type: forge.pki.oids.messageDigest
                                               // value will be auto-populated at signing time
                                               }, {
                                               type: forge.pki.oids.signingTime,
                                               // will be encoded as generalized time because it's before 1950
                                               value: new Date('1949-12-31T23:59:59Z')
                                               }]
                     });
        p7.sign();
        var pem = forge.pkcs7.messageToPem(p7);
        this.log("pem:[" + pem + "]");
        this.log("_pem.signedDataWithAttrs1949GeneralizedTime:[" + _pem.signedDataWithAttrs1949GeneralizedTime + "]");

        
        
        //
        //var seed = new SEED();
        //seed.initModule(forge);
        //this.log("seed:[" + seed + "]");
        this.log("forge.seed:[" + forge.seed + "]");
        
        //var signingTime = "170123102722Z";
        var rmd = forge.md.sha256.create();
        rmd.start();
        //console.log("signingTime3:[" + signingTime.value + "]");
        //var ct = asn1.dateToUtcTime(signingTime.value);
        //var ct = forge.util.createBuffer(_attributeToAsn1(rEncryptTime).value);
        ct = "170123102722Z";
        console.log("signingTime4:[" + ct + "]");
        rmd.update(ct);
        
        var key;
        for (var i = 0; i <2; i++) {
            key = rmd.digest().getBytes();
            rmd.start();
            rmd.update(key);
        }
        key = rmd.digest().getBytes();
        var iv = key.substr(16, 32);
        key = key.substr(0, 16);
        
        var cipher = forge.seed.createEncryptionCipher(key);
        cipher.start(iv);
        //var r = forge.util.createBuffer(signer.key.vidRandom);
        var r = forge.util.createBuffer("testSeed");
        cipher.update(r);
        if(cipher.finish()) {
            this.log("bytesToHex:[" + forge.util.bytesToHex(cipher.output.bytes()) + "]");
            //this.log("cipher.output.base64:[" + forge.util.decode64(cipher.output.bytes()) + "]");
            //this.log("cipher.output.bytes:[" + cipher.output.bytes() + "]");
        }
 */
        
/*
        this.log("test 2");
        //var msg = forge.pem.decode(pemStr)[0];
        //msg.contentInfo = pem.toAsn1;
        pem.sign();
        var msg = pem;
        this.log("test 3:[" + msg + "]");
        this.log("test 3:[" + msg.contentInfo + "]");
        //var mds = pem.addDigestAlgorithmIds();
//        function addDigestAlgorithmIds() {
            var mds = {};
            
            for(var i = 0; i < msg.signers.length; ++i) {
                var signer = msg.signers[i];
                var oid = signer.digestAlgorithm;
                if(!(oid in mds)) {
                    // content digest
                    mds[oid] = forge.md[forge.pki.oids[oid]].create();
                }
                if(signer.authenticatedAttributes.length === 0) {
                    // no custom attributes to digest; use content message digest
                    signer.md = mds[oid];
                } else {
                    // custom attributes to be digested; use own message digest
                    // TODO: optimize to just copy message digest state if that
                    // feature is ever supported with message digests
                    signer.md = forge.md[forge.pki.oids[oid]].create();
                }
            }
            
            // add unique digest algorithm identifiers
            msg.digestAlgorithmIdentifiers = [];
            for(var oid in mds) {
                msg.digestAlgorithmIdentifiers.push(
                                                    // AlgorithmIdentifier
                                                    forge.asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                                                                                                                 // algorithm
                                                                                                                 forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.OID, false,
                                                                                                                             forge.asn1.oidToDer(oid).getBytes()),
                                                                                                                 // parameters (null)
                                                                                                                 forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.NULL, false, '')
                                                                                                                 ]));
            }
            
//            return mds;
//        }
        
        //function addSignerInfos(mds) {
            // Note: ContentInfo is a SEQUENCE with 2 values, second value is
            // the content field and is optional for a ContentInfo but required here
            // since signers are present
            if(msg.contentInfo.value.length < 2) {
                throw new Error(
                                'Could not sign PKCS#7 message; there is no content to sign.');
            }
            
            // get ContentInfo content type
            var contentType = forge.asn1.derToOid(msg.contentInfo.value[0].value);
            
            // get ContentInfo content
            var content = msg.contentInfo.value[1];
            // skip [0] EXPLICIT content wrapper
            content = content.value[0];
            
            // serialize content
            var bytes = forge.asn1.toDer(content);
            
            // skip identifier and length per RFC 2315 9.3
            // skip identifier (1 byte)
            bytes.getByte();
            // read and discard length bytes
            forge.asn1.getBerValueLength(bytes);
            bytes = bytes.getBytes();
            
            // digest content DER value bytes
            for(var oid in mds) {
                mds[oid].start().update(bytes);
            }
            
            // sign content
            var signingTime = new Date();
            this.log("*** sign content ***");
            this.log("msg.signers.length:[" + msg.signers.length + "]");
            for(var i = 0; i < msg.signers.length; ++i) {
                this.log("msg.signers:[" + i + "][" + msg.signers[i] + "]");
                var signer = msg.signers[i];
                
                if(signer.authenticatedAttributes.length === 0) {
                    // if ContentInfo content type is not "Data", then
                    // authenticatedAttributes must be present per RFC 2315
                    if(contentType !== forge.pki.oids.data) {
                        throw new Error(
                                        'Invalid signer; authenticatedAttributes must be present ' +
                                        'when the ContentInfo content type is not PKCS#7 Data.');
                    }
                } else {
                    // process authenticated attributes
                    // [0] IMPLICIT
                    signer.authenticatedAttributesAsn1 = forge.asn1.create(
                                                                     forge.asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
                    
                    // per RFC 2315, attributes are to be digested using a SET container
                    // not the above [0] IMPLICIT container
                    var attrsAsn1 = forge.asn1.create(
                                                forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SET, true, []);
                    
                    for(var ai = 0; ai < signer.authenticatedAttributes.length; ++ai) {
                        var attr = signer.authenticatedAttributes[ai];
                        if(attr.type === forge.pki.oids.messageDigest) {
                            // use content message digest as value
                            attr.value = mds[signer.digestAlgorithm].digest();
                        } else if(attr.type === forge.pki.oids.signingTime) {
                            // auto-populate signing time if not already set
                            if(!attr.value) {
                                attr.value = signingTime;
                            }
                            // for make encrypt vid random
                            console.log("signingTime1:[" + signingTime + "]");
                            signingTime = attr;
                            console.log("signingTime2:[" + signingTime + "]");
                        }
                        
                        // convert to ASN.1 and push onto Attributes SET (for signing) and
                        // onto authenticatedAttributesAsn1 to complete SignedData ASN.1
                        // TODO: optimize away duplication
                        attrsAsn1.value.push(_attributeToAsn1(attr));
                        signer.authenticatedAttributesAsn1.value.push(_attributeToAsn1(attr));
                    }
                    
                    // DER-serialize and digest SET OF attributes only
                    bytes = forge.asn1.toDer(attrsAsn1).getBytes();
                    signer.md.start().update(bytes);
                }
                
                // sign digest
                if(signer.signatureAlgorithm === forge.pki.oids.rsaEncryption) {
                    signer.signature = signer.key.sign(signer.md, 'RSASSA-PKCS1-V1_5');
                } else if (signer.signatureAlgorithm === forge.pki.oids['RSASSA-PSS']) {
                    var pss = forge.pss.create({
                                               md: forge.md.sha256.create(),
                                               mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
                                               saltLength: 32
                                               });
                    
                    signer.signature = signer.key.sign(signer.md, pss);
                }
                
                // process unauthenticated attributes
                this.log("initech-encrypted-random:[" + forge.pki.oids['initech-encrypted-random'] + "]");
                for(var bi = 0; bi < signer.unauthenticatedAttributes.length; ++bi) {
                    var attr = signer.unauthenticatedAttributes[bi];
                    if(attr.type === forge.pki.oids['initech-encrypted-random']) {
                        var rmd = forge.md.sha256.create();
                        rmd.start();
                        console.log("signingTime3:[" + signingTime.value + "]");            
                        var ct = forge.asn1.dateToUtcTime(signingTime.value);
                        //var ct = forge.util.createBuffer(_attributeToAsn1(rEncryptTime).value);
                        console.log("signingTime4:[" + ct + "]");            
                        rmd.update(ct);
                        
                        var key;
                        for (var i = 0; i <2; i++) {
                            key = rmd.digest().getBytes();
                            rmd.start();
                            rmd.update(key);
                        }
                        key = rmd.digest().getBytes();
                        var iv = key.substr(16, 32);
                        key = key.substr(0, 16);
                        
                        var cipher = forge.seed.createEncryptionCipher(key);
                        cipher.start(iv);
                        //var r = forge.util.createBuffer(signer.key.vidRandom);
                        var r = forge.util.createBuffer("testVidRandom");
                        cipher.update(r);
                        if(cipher.finish()) {
                            signer.unauthenticatedAttributes[bi].value = cipher.output.bytes();
                        }
                    }
                }
            }
            
            // add signer info
            msg.signerInfos = _signersToAsn1(msg.signers);
        
            this.log("output:[" + forge.pkcs7.messageToPem(pem) + "]");
        //}
*/
        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 내보험다보여 본인인증_1 finally");
    }
}


내보험다보여.prototype.본인인증_2 = function (aInput) {
    this.log(BankName + " 내보험다보여 본인인증_2 호출");

    try {

        return S_IBX_OK;

    } catch (e) {
        this.LoginStep = "1";
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    }
    finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 내보험다보여 본인인증_2 finally");
    }
}

내보험다보여.prototype.본인인증_3 = function (aInput) {
    this.log(BankName + " 내보험다보여 본인인증_3 호출");
    try {

        return S_IBX_OK;

    } catch (e) {
        this.LoginStep = "1";
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;

    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 내보험다보여 본인인증_3 finally");
    }
}

내보험다보여.prototype.계약현황 = function (aInput) {
    console.log("내보험다보여 계약현황 실행[" + aInput + "]");

    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        return S_IBX_OK;
    }
    catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    }
    finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 내보험다보여 계약현황 finally");
    }
}

/*
내보험다보여.prototype.정액형보장
    변수선언부


    flow
         *  1. 계약내용 조회
         *  while ( tr ) {
         *      ...(계약내용)
         *
         *      계약상세 페이지 수 만큼 조회
         *      while ( pageIndex < 3 ) {
         *          ...(계약상셰내용)
         *      }
         *
         *  }
         *  2. 분석통계명
         *  ...
         *  3. 분석통계
         *  ...
         * return
*/
내보험다보여.prototype.정액형보장 = function (aInput) {
    console.log("내보험다보여 정액형보장 실행[" + aInput + "]");

    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        return S_IBX_OK;
    }
    catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    }
    finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 내보험다보여 정액형보장 finally");
    }
}

내보험다보여.prototype.실손형보장 = function (aInput) {
    this.log(BankName + " 내보험다보여 실손형보장 호출");

    try {


        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 실손형보장 finally");
    }

}


///////////////////////////////////////////////////////////////////////////////////////////
//include 등등 필요한거 설정.
function OnInit() {
    console.log("OnInit()");
    var result;
    try {
        //필요한거 로드
        system.include("iSASTypes");
        system.setStatus(IBXSTATE_BEGIN, 0);
        result = S_IBX_OK;
    } catch (e) {
        result = E_IBX_UNKNOWN;
        console.log("Exception OnInit:[" + e.message + "]");
    } finally {
        return result;
    }
}


function Execute(aInput) {

    console.log("Execute[" + aInput + "]");
    try {
        var res = OnInit();
        if (Failed(res)) {
            //초기화 오류나면 빠져나감.
            return res;
        }

        //console.log("서버에서 가져온 에러 메시지 : " + getCooconErrMsg(E_IBX_SITE_INVALID));
        //return;

        iSASObj = JSON.parse(aInput);
        var errCode;
        var ClassName = iSASObj.Class;
        var ModuleName = iSASObj.Module;

        if (Failed(SetClassName(ClassName, ModuleName))) {
            //setErrorAll(I_IBX_RESULT_MIXED_ALL);
            iSASObj = setError(iSASObj, I_IBX_RESULT_MIXED_ALL);
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
