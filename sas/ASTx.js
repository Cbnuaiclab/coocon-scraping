(function() {
  /* ########## Begin module implementation ########## */
  function initModule(sas) {
  
  /* ASTx API */
  var ASTxClass = sas.ASTx = sas.ASTx || {};
  
  function _ASTx()
  {
    console.log("_ASTx create!!");
    this.certStr = "";
    this.aesKey  = "";
  }
  // * 보안 키패드 추가 2017-09-11 begin
  
  _ASTx.prototype.generate_AESKey = function (len) {
              var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
              var string_length = len;
              var randomstring = '';
              for (var i = 0; i < string_length; i++) {
                  var rnum = Math.floor(Math.random() * chars.length);
                  randomstring += chars.substring(rnum, rnum + 1);
              }
              return randomstring;
          }
  
  
  _ASTx.prototype.isDigit = function(ch) {
    return "0" <= ch && "9" >= ch ? !0 : !1;
  }
  
  _ASTx.prototype.isAlpha = function(ch) {
        return "a" <= ch && "z" >= ch || "A" <= ch && "Z" >= ch ? !0 : !1
  }
  
  _ASTx.prototype.isSpecial = function(ch) {
        return "!" <= ch && "/" >= ch || ":" <= ch && "@" >= ch || "[" <= ch && "`" >= ch || "{" <= ch && "~" >= ch ? !0 : !1
  }
  
  _ASTx.prototype.indexOfKeyPad = function (keypad, ch)
  {
    for(var i=0;keypad.length;i++)
      if(keypad[i].key == ch)
        return parseInt(keypad[i].index);
  
    return -1;
  }
  
  _ASTx.prototype.getPads = function (plain, sec, p){
    // ASTx.AES128Decrypt 이 함수는 IV가 고정이라 못쓸지도..
    return "";
  }
  
  _ASTx.prototype.getSecretChas = function (kyes){
    var _resultStr = '';
    var aLength = kyes.length;
    for(var i=0;i<aLength;i++){
      if(this.isDigit(kyes.charAt(i))) _resultStr += '1';
      else if (this.isAlpha(kyes.charAt(i))) _resultStr += '*';
      else if (this.isSpecial(kyes.charAt(i))) _resultStr += '*';
    }
    return _resultStr;
  }
  
  _ASTx.prototype.getECHS = function (kyes, keytable){
    // 스패이스 없음.
    var keypad = [
      //소문자 숫자
      {key:"`", index:"63"},  {key:"1", index:"1"},   {key:"2", index:"2"},   {key:"3", index:"3"},   {key:"4", index:"4"},   {key:"5", index:"5"}, 
      {key:"6", index:"6"},   {key:"7", index:"7"},   {key:"8", index:"8"},   {key:"9", index:"9"},   {key:"0", index:"10"},  {key:"-", index:"64"},  {key:"=", index:"65"},
  
      {key:"q", index:"11"},  {key:"w", index:"12"},  {key:"e", index:"13"},  {key:"r", index:"14"},  {key:"t", index:"15"},  {key:"y", index:"16"},
      {key:"u", index:"17"},  {key:"i", index:"18"},  {key:"o", index:"19"},  {key:"p", index:"20"},  {key:"[", index:"66"},  {key:"]", index:"67"},  {key:"\\", index:"68"},
  
      {key:"a", index:"21"},  {key:"s", index:"22"},  {key:"d", index:"23"},  {key:"f", index:"24"},  {key:"g", index:"25"},  {key:"h", index:"26"},
      {key:"j", index:"27"},  {key:"k", index:"28"},  {key:"l", index:"29"},  {key:";", index:"69"},  {key:"'", index:"70"},  
  
      {key:"z", index:"30"},  {key:"x", index:"31"},  {key:"c", index:"32"},  {key:"v", index:"33"},  {key:"b", index:"34"},  {key:"n", index:"35"},
      {key:"m", index:"36"},  {key:",", index:"71"},  {key:".", index:"72"},  {key:"/", index:"73"},
  
      // 대문자 특문
      {key:"~", index:"74"},  {key:"!", index:"75"},  {key:"@", index:"76"},  {key:"#", index:"77"},  {key:"$", index:"78"},  {key:"%", index:"79"},
      {key:"^", index:"80"},  {key:"&", index:"81"},  {key:"*", index:"82"},  {key:"(", index:"83"},  {key:")", index:"84"},  {key:"_", index:"85"},  {key:"+", index:"86"},
  
      {key:"Q", index:"37"},  {key:"W", index:"38"},  {key:"E", index:"39"},  {key:"R", index:"40"},  {key:"T", index:"41"},  {key:"Y", index:"42"},
      {key:"U", index:"43"},  {key:"I", index:"44"},  {key:"O", index:"45"},  {key:"P", index:"46"},  {key:"{", index:"87"},  {key:"}", index:"88"},  {key:"|", index:"89"},
  
      {key:"A", index:"47"},  {key:"S", index:"48"},  {key:"D", index:"49"},  {key:"F", index:"50"},  {key:"G", index:"51"},  {key:"H", index:"52"},
      {key:"J", index:"53"},  {key:"K", index:"54"},  {key:"L", index:"55"},  {key:":", index:"90"},  {key:"\"", index:"91"}, 
  
      {key:"Z", index:"56"},  {key:"X", index:"57"},  {key:"C", index:"58"},  {key:"V", index:"59"},  {key:"B", index:"60"},  {key:"N", index:"61"},
      {key:"M", index:"62"},  {key:"<", index:"92"},  {key:">", index:"93"},  {key:"?", index:"94"}
    ];
  
    var index, resultStr;
    var aLength = kyes.length;
    resultStr = '';
    for(var i=0;i<aLength;i++){
      index = this.indexOfKeyPad(keypad, kyes.charAt(i));
      resultStr += keytable[index - 1] + '';
    }
    return resultStr;
  }
  
  // * 보안 키패드 추가 2017-09-11 end;
  _ASTx.prototype.log = function (logMsg)
  {
      console.log("iSASObject.Log(\"" + logMsg + "\")");
  }
  
  _ASTx.prototype.SetCert = function(certStr)
  {
    this.log("call!! _ASTx.prototype.SetCert");
  
    SaltEncoder.genEncodeTable(8);
    var SCert = SaltEncoder.DecodeString( certStr );
    if(SCert == "") return false;
    
    SCert = StrReplace(SCert, "-----BEGIN CERTIFICATE-----", "");
    SCert = StrReplace(SCert, "-----END CERTIFICATE-----", "");
    SCert = StrReplace(SCert, "\n", "");
  
    this.certStr = SCert;
    return true;
  }
  
  _ASTx.prototype.EncodeKey = function(key)
  {
    return certManager.RSA_public_encrypt(this.certStr, key);
  }
  
  _ASTx.prototype.setKey = function(length) {
    this.aesKey = SaltEncoder.GenRandomString(length);
    console.log('aeskey:' + this.aesKey);
  };
  
  //alg - 1 : aes123, 2: aes256   
  //str : 암호화할 데이터
  //mode : SaltEncoder Encode 여부 - 0 : encode X(hmc에서 사용) , 그외 : encode (aia에서 사용)
  _ASTx.prototype.GetEncData = function(alg, str, mode){
    this.log('call!! _ASTx.prototype.getE2EPassword');
    if(!this.aesKey) {
      return;
    }
  
    SaltEncoder.genEncodeTable(8);
  
    var encPassword = '';
    for (var i = 0; i < str.length; i++) {
  
      if (alg === '1') {
        encPassword += SaltEncoder.EncodeString(ASTx.AES128Encrypt(str.charAt(i), this.aesKey));
      } else {
        encPassword += SaltEncoder.EncodeString(ASTx.AES256Encrypt(str.charAt(i), this.aesKey));
      }
      if ((i + 1) < str.length){
        encPassword += '|'
      }
    }
    if(mode === "0" ){
      return encPassword;
    }
    
    return SaltEncoder.EncodeString(encPassword);
  }
  
  
  _ASTx.prototype.GetPCLog = function(uniqStr)
  {
    this.log("call!! _ASTx.prototype.GetPCLog");
    return "";
  }
  
  _ASTx.prototype.GetPCLog2 = function(uniqStr, alg, valg, logData, uTime)
  {
    this.log("call!! _ASTx.prototype.GetPCLog2");
  
    //1. AES Key Gen
    if (!this.aesKey) {
      this.aesKey = SaltEncoder.GenRandomString(32);
    }
      
    //2. Key Exchange Data
    //var EncKey = "enckeytestdata";  
    var EncKey = this.EncodeKey( this.aesKey );
  
    this.log("ASTx AESKey:[" + this.aesKey + "]");
    this.log("ASTx EncKey:[" + EncKey + "]");
  
    //3. PCLogData Gen
    var PCLogData = logData;
    this.log("PCLogData1:[" + PCLogData + "]");
      
    //4. uniq AES Enc
    var uniq;
    if(alg == 1) uniq = ASTx.AES128Encrypt(uniqStr, this.aesKey);
    else         uniq = ASTx.AES256Encrypt(uniqStr, this.aesKey);
  
    //5. PCLogData AES Enc
    var PCLogData;
    if(alg == 1) PCLogData = ASTx.AES128Encrypt(PCLogData, this.aesKey);
    else         PCLogData = ASTx.AES256Encrypt(PCLogData, this.aesKey);
      
    //6. SaltEncod & postData Gen
    var nSalt = Math.floor(100000 * Math.random());
    SaltEncoder.genEncodeTable( nSalt );
      
    uniq      = SaltEncoder.EncodeString( uniq );
    PCLogData = SaltEncoder.EncodeString( PCLogData );
      
    PCLogData = "salt=" + nSalt +
                "&ver=1" +
                "&alg=" + alg +
                "&valg=" + valg +
                "&norsa=0" + 
                "&noenc=0" +
                "&key=" + EncKey +
                "&uniq=" + uniq +
                "&utime=" + uTime +
                "&data=" + PCLogData; 
    this.log("PCLogData2:[" + PCLogData + "]");
    SaltEncoder.genEncodeTable(8);
    return SaltEncoder.EncodeString( PCLogData );
  }
  
  ASTxClass.create = function(){
    return new _ASTx();
  };
  
  } // end module implementation
  
  /* ########## Begin module wrapper ########## */
  var name = 'ASTx';
  if(typeof define !== 'function') {
    // NodeJS -> AMD
    if(typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      // <script>
      if(typeof sas === 'undefined') {
        sas = {};
      }
      return initModule(sas);
    }
  }
  // AMD
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(sas) {
  //    var mods = deps.map(function(dep) {
  //      return require(dep);
  //    }).concat(initModule);
      
      var mods = [];
      for(key in deps){
        mods.push( require(deps[key]) );
      }
      mods = mods.concat(initModule);
      
      // handle circular dependencies
      sas = sas || {};
      sas.defined = sas.defined || {};
      if(sas.defined[name]) {
        return sas[name];
      }
      sas.defined[name] = true;
      for(var i = 0; i < mods.length; ++i) {
        mods[i](sas);
      }
      return sas[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if(nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  // define(['require', 'module', './util', './oids'], function() {
  //   defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
  // });
  })();
  