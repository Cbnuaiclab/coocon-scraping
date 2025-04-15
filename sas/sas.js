/*******************************************************************************
 * sas.js module for sasLibaray .
 *
 * @author juryu
 *
 * Copyright 2017 COOCON, Inc.
 *******************************************************************************/
//var Factory =
(function() {
var name = 'sas';
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
      // set to true to disable native code if even it's available
      sas = {disableNativeCode: false};
    }
    return;
  }
}
// AMD
var deps;
var defineFunc = function(require, module) {
  module.exports = function(sas) {
//    var mods = deps.map(function(dep) {
//      return require(dep);
//    });
    var mods = [];
    for(key in deps){
        mods.push( require(deps[key]) );
    }
      
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
    return sas;
  };
  // set to true to disable native code if even it's available
  module.exports.disableNativeCode = false;
  module.exports(module.exports);
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
})();

/*******************************************************************************
 * SecureData.js module for sasLibaray .
 *
 * @author juryu
 *
 * Copyright 2019 COOCON, Inc.
 *******************************************************************************/

(function() {
  /* ########## Begin module implementation ########## */
  function initModule(sas) {
    /* SecureData API */
    var SecureDataClass = sas.SecureData = sas.SecureData || {};
    
    function _SecureData(aValue)
    {
        console.log("_SecureData create!!");
        this.secureValue = aValue + '';
    }

    // * 보안 키패드 추가 2019-10-02 begin
    _SecureData.prototype.isSupport = function () {
        //return (typeof SASSecurData_ !== 'undefined'); //Class 없는 경우 테스트 - juryu
        return (typeof SASSecurData !== 'undefined');    //Calss 있는 경우 테스트 - juryu
    }

    _SecureData.prototype.charAt = function (aIndex) {
        if(this.isSupport()) {
            if(aIndex >= SASSecurData.getLength(this.secureValue)){
                return NaN;
            }
            return SASSecurData.charAt(this.secureValue, aIndex);
        }  else {
            return this.secureValue[aIndex];
        }
    }
    
    _SecureData.prototype.getPlainText = function ()
    {
        if(this.isSupport()) return SASSecurData.getPlainText(this.secureValue);
        else                 return this.secureValue;
    }
    
    _SecureData.prototype.getPlainTextWithRange = function (startPos, length){
        if(this.isSupport()) return SASSecurData.getPlainTextWithRange(this.secureValue, startPos, length);
        else                 return this.secureValue.substr(startPos, length);
    }
    
    _SecureData.prototype.getSecurDataWithRange = function (startPos, length){
        if(this.isSecurData()) return new _SecureData(SASSecurData.getSecurDataWithRange(this.secureValue, startPos, length));
        else                   return new _SecureData(this.secureValue.substr(startPos, length));
    }

    _SecureData.prototype.isSecurData = function (){
        if(this.isSupport()) return SASSecurData.isSecurData(this.secureValue);
        else                 return false;
    }

    _SecureData.prototype.getLength = function (){
        if(this.isSupport()) return SASSecurData.getLength(this.secureValue);
        else                 return this.secureValue.length; 
    }

    SecureDataClass.create = function(aValue){
        return new _SecureData(aValue);
    };
  
  } // end module implementation
  
  /* ########## Begin module wrapper ########## */
  var name = 'SecureData';
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

  /* ########## Begin module wrapper ########## */
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
})();
  
/*******************************************************************************
 * Sessions.js module for sasLibaray .
 *
 * @author juryu
 *
 * Copyright 2019 COOCON, Inc.
 *******************************************************************************/

(function() {
  /* ########## Begin module implementation ########## */
  function initModule(sas) {
    /* SecureData API */
    function _Sessions()
    {
        console.log("_Sessions create!!");
        this.isFirstGet = true;
        this.sessionValue = {};
    }

    _Sessions.prototype.isSupport = function () {
        return (typeof SASSessions !== 'undefined');    //Calss 있는 경우 테스트 - juryu
    }

    _Sessions.prototype.set = function (name, value) {
        if(this.isSupport()) SASSessions.setValue(name, value);
        else                 this.sessionValue[name] = value;
    }
    
    _Sessions.prototype.get = function (name)
    {
      console.log("_Sessions.prototype.get");
        //테스트용 최초 한번 읽어올때 세션 공유해도 될까?? juryu - 2020-02-03
        if(this.isFirstGet){
          this.isFirstGet = false;
          this.sharedSession();
        }
        if(this.isSupport()) {
            console.log("_Sessions.prototype.get:[" + name + "]:[" + SASSessions.getValue(name) + "]");
            return SASSessions.getValue(name);
        } else {
            console.log("_Sessions.prototype.get:[" + name + "]:[" + this.sessionValue[name] + "]");
            return this.sessionValue[name];
        }
    }
    
    _Sessions.prototype.clear = function (){
        if(this.isSupport()) SASSessions.clear();
        else                 this.sessionValue = {};
    }
    
    _Sessions.prototype.sharedSession = function (){
        if(this.isSupport()) SASSessions.sharedSession();
        else                   ;// 아무것도 않함. 
    }

    _Sessions.prototype.isRoot = function (){
        if(this.isSupport()) return SASSessions.isRoot();
        else                 return true;
    }

    sas.Sessions = sas.Sessions || new _Sessions();

  } // end module implementation
  
  /* ########## Begin module wrapper ########## */
  var name = 'Sessions';
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
  
  /* ########## Begin module wrapper ########## */
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
})();

/*******************************************************************************
 * FinCert.js module for sasLibaray .
 *
 * @author 
 *
 * Copyright 2020 COOCON, Inc.
 *******************************************************************************/

(function() {
  /* ########## Begin module implementation ########## */
  function initModule(sas) {
    /* SecureData API */
    function _FinCert()
    {
        console.log("_FinCert create!!");
        this.req           = {};
        this.req.API       = "FIN_CERT";
        this.param         = {};
        this.param.info    = {"signType":"01"};
    }

    //PKCS#7 서명시간 미포함
    _FinCert.prototype.getP7XecureData = function (plain) {
        
        if(!Array.isArray(plain)){
            plain = [plain];
        }
        this.param.signFormat = {"type":"CMS","CMSInfo":{"ssn":"dummy"}};
        this.param.content    = {"plainText":{"plainTexts":plain}};
        //다른타입의 서명데이를 요청할 경우에는 개별모듈단에서 SignParam Array 에 담아 처리하자
        this.req.SignParam    = [this.param];
        return this.req;
    }
    
    //PKCS#7 서명시간, VID정보 미포함
    _FinCert.prototype.getP7XecureDataWithOutVidRandom = function (plain) {
        
        if(!Array.isArray(plain)){
            plain = [plain];
        }
        this.param.signFormat = {"type":"CMS"};
        this.param.content    = {"plainText":{"plainTexts":plain}};
        this.req.SignParam    = [this.param];
        return this.req;
    }

    //PKCS#7 서명시간 포함
    _FinCert.prototype.getP7Data = function (plain) {
        if(!Array.isArray(plain)){
            plain = [plain];
        }
        this.param.signFormat = {"type":"CMS","CMSInfo":{"ssn":"dummy","time":"CLIENT"}};
        this.param.content    = {"plainText":{"plainTexts":plain}};
        this.req.SignParam    = [this.param];
        return this.req;
    }
    
    //PKCS#7 서명시간 포함, VID정보를 미포함
    _FinCert.prototype.getP7DataWithOutVidRandom = function (plain) {
        if(!Array.isArray(plain)){
            plain = [plain];
        }
        this.param.signFormat = {"type":"CMS","CMSInfo":{"time":"CLIENT"}};
        this.param.content    = {"plainText":{"plainTexts":plain}};
        this.req.SignParam    = [this.param];
        return this.req;
    }
    
    //PKCS#1
    _FinCert.prototype.getP1Data = function (plain) {
        if(!Array.isArray(plain)){
            plain = [plain];
        }
        for(var i = 0; i < plain.length; i++){
            plain[i] = this.toBase64Url(certManager.Base64Encode(plain[i]));
        }
        
        this.param.signFormat = {"type":"PKCS1","PKCS1Info":{"includeR":true}};
        this.param.content    = {"binary":{"binaries":plain}};
        this.req.SignParam    = [this.param];
        return this.req;
    }
    
    _FinCert.prototype.parseRes = function (input) {
        
        if(!input.res){
            return input;
        }
        var res = [];
        
        var signedHex  = "";
        if(!Array.isArray(input.res)){
            input.res = [input.res];
        }
        
        for(var i = 0; i < input.res.length; i++){
            var obj = {};
            var signedVals = input.res[i].signedVals;
            if(!Array.isArray(signedVals)){
                signedVals = [signedVals];
            }
            
            for(var j = 0; j < signedVals.length; j++){
                signedVals[j] = this.fromBase64Url(signedVals[j]);
                signedHex = certManager.Base64ToHex(signedVals[j]).toUpperCase();
                //PKCS#7 타입의 서명값에 VidRandom이 포함되어 있는지 체크
                //OID 1.2.410.200005.1.10.1 -> 06092A831A8C9A45010A01
                if(signedHex.indexOf("06092A831A8C9A45010A01") > -1){
                    obj.vidRandom = certManager.HexToBase64(signedHex.substr(signedHex.length-40));
                }
            }
            obj.signedVals = signedVals;
            //PKCS#1 타입의 서명값에 인증서가 존재하면..
            if(input.res[i].certificate){
                obj.publicKey = input.res[i].certificate;
            }
            //PKCS#1 타입의 서명값에 VidRandom값이 존재하면.
            if(input.res[i].rValue){
                obj.vidRandom = this.fromBase64Url(input.res[i].rValue);
            }
            res.push(obj);
        }
        
        //PKCS#7 : {"signedVals":[aaa,bbb],"vidRandom":"AB...."}
        //PKCS#1 : {"signedVals":[aaa,bbb],"vidRandom":"AB....","publicKey":"MI...."}
        return res;
    }
    
    // Base64 url safe -> Base64
    _FinCert.prototype.fromBase64Url = function (str) {
        if(!str){
            return str;
        }
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        var pad = str.length % 4;
        if(pad) {
          if(pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
          }
          str += new Array(5-pad).join('=');
        }
        return str;
    }
    
    // Base64 -> Base64 url safe 
    _FinCert.prototype.toBase64Url = function (str) {
        if(!str){
            return str;
        }        
        return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+$/m, "")
    }
    
    sas.FinCert = sas.FinCert || new _FinCert();

  } // end module implementation
  
  /* ########## Begin module wrapper ########## */
  var name = 'FinCert';
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
  
  /* ########## Begin module wrapper ########## */
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
})();
