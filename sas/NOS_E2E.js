var NOS_E2E = function() {
    
    this.serverKey  = "75908D6897DC69F57BC8480A8D251DBC1487C74723194C949473B3F99DFD2358";
    this.serverIv   = "";
    this.clientKey  = "";
    this.E2E_RESULT = "";
    this.dummy      = "";
    this.rsaKey     = null;
    this.keyType    = null;

}

NOS_E2E.prototype.importLibrary = function() {
    
    try {
        system.include("sas/skt_rsa/jsbn");
        system.include("sas/skt_rsa/rsa");
        system.include("sas/skt_rsa/prng4");
        system.include("sas/skt_rsa/rng");
    } catch (e) {
        console.log("Exception importLibrary : [" + e.message + "]");
        return false;
    }
    return true;
    
}


NOS_E2E.prototype.init = function (encryptedCert){
    
    //라이브러리 include
    if(!this.importLibrary()){
        return false;
    }
    
    this.serverIv = encryptedCert.substring(0,32);
    encryptedCert = encryptedCert.substring(32);
    var pubKey    = certManager.ARIADecryptWithHex(1, 1, encryptedCert, this.serverKey, this.serverIv);
    var serverSecureKey = pubKey.substring(0,64);
    
    if(!this.doPublic(pubKey)){
        return false;
    }
    
    // RSA 암호화 시작
    var rsa = new RSAKey();
    rsa.setPublic(this.rsaKey, this.keyType);
    
    var clientRandom = Number(Math.floor((new Date()).getTime() /1000)) + "";
    clientRandom = certManager.Hash("SHA256", clientRandom);
    
    this.E2E_RESULT = rsa.encryptOAEP(clientRandom);
    
    // __E2E__ 암호화 키
    var saltKey = this.makeSalt(serverSecureKey);
    var encryptSourceKey = saltKey + clientRandom;
    this.clientKey = this.makeKey(encryptSourceKey);
    
}

//고정으로 설정된 서버키가 아닐 경우에만 사용
NOS_E2E.prototype.setServerKey = function(serverKey){
    this.serverKey = serverKey;
}

NOS_E2E.prototype.doPublic = function (pubKey){
    
    if(!pubKey){
        return false;
    }
    
    pubKey = StrGrab(pubKey, "-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----");
    pubKey = pubKey.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
    
    var resultJson = {};
    var pubKeyHex = certManager.Base64ToHex(pubKey);
    var rsaKey = ""
    if (rsaKey.indexOf("02818100") > -1) {
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
    
}

NOS_E2E.prototype.makeSalt = function (str){
    str = parseHexStringToString(str);
    var br = parseToHexArray(str);
    var len = br.length;
    var brNew = [];
    for (var i = 0; i < br.length; i++) {
        var brint = br[i] & 255;
        brNew[i] = br[Math.abs(brint%len)]

    }
    return parseByteToHexString(brNew);
}

NOS_E2E.prototype.makeKey = function (str){
    var key = str;
    for (var i = 0; i < 256; i++) {
        key = certManager.hashFromHex("SHA256", key).toUpperCase();
    }
    return key;
}

NOS_E2E.prototype._E2E_Encrypt = function (plain){
    var result = "";
    this.dummy = "";
    for(var i = 0; i < plain.length; i++){
        var char = plain[i];
        var random = Number(Math.floor((new Date()).getTime() /1000)) + "";
        var randomKey = certManager.Hash("SHA256", random); 
        randomKey = randomKey.substring(0,32);
      
        var encrypted = randomKey + certManager.ARIAEncryptWithHex(1, 1, char, this.clientKey, randomKey)
        result += encrypted.toLowerCase();
        if(isNaN(char)){
            this.dummy += "a";
        } else {
            this.dummy += "1";
        }
    }
    return result;
}
