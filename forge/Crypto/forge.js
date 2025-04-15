/**
 * Node.js module for Forge.
 *
 * @author Dave Longley
 *
 * Copyright 2011-2014 Digital Bazaar, Inc.
 */
//var Factory =
(function() {
var name = 'forge';
if(typeof define !== 'function') {
  // NodeJS -> AMD
  if(typeof module === 'object' && module.exports) {
    var nodeJS = true;
    define = function(ids, factory) {
      factory(require, module);
    };
  } else {
    // <script>
    if(typeof forge === 'undefined') {
      // set to true to disable native code if even it's available
      forge = {disableNativeCode: false};
    }
    return;
  }
}
// AMD
var deps;
var defineFunc = function(require, module) {
  module.exports = function(forge) {
//    var mods = deps.map(function(dep) {
//      return require(dep);
//    });
    var mods = [];
    for(key in deps){
    	mods.push( require(deps[key]) );
    }
	  
    // handle circular dependencies
    forge = forge || {};
    forge.defined = forge.defined || {};
    if(forge.defined[name]) {
      return forge[name];
    }
    forge.defined[name] = true;
    for(var i = 0; i < mods.length; ++i) {
      mods[i](forge);
    }
    return forge;
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
define([
  'require',
  'module',
  'forgeCrypto/aes',
  'forgeCrypto/aesCipherSuites',
  'forgeCrypto/asn1',
  'forgeCrypto/cipher',
  'forgeCrypto/cipherModes',
  'forgeCrypto/debug',
  'forgeCrypto/des',
  'forgeCrypto/hmac',
  'forgeCrypto/kem',
  'forgeCrypto/log',
  'forgeCrypto/md',
  'forgeCrypto/mgf1',
  'forgeCrypto/pbkdf2',
  'forgeCrypto/pem',
  'forgeCrypto/pkcs7',
  'forgeCrypto/pkcs1',
  'forgeCrypto/pkcs12',
  'forgeCrypto/pki',
  'forgeCrypto/prime',
  'forgeCrypto/prng',
  'forgeCrypto/pss',
  'forgeCrypto/random',
  'forgeCrypto/rc2',
  'forgeCrypto/ssh',
  'forgeCrypto/task',
  'forgeCrypto/tls',
  'forgeCrypto/util',
  'forgeCrypto/pbkdf1',
  'forgeCrypto/seed',
  'forgeCrypto/cmp',
  'forgeCrypto/desmac'
], function() {
  defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
});
})();
