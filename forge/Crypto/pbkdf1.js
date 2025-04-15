/**
 * Password-Based Key-Derivation Function #2 implementation.
 * 
 * See RFC 2898 for details.
 * 
 * @author Dave Longley
 * 
 * Copyright (c) 2010-2013 Digital Bazaar, Inc.
 */
(function() {
	/* ########## Begin module implementation ########## */
	function initModule(forge) {

		var pkcs5 = forge.pkcs5 = forge.pkcs5 || {};

		var _nodejs = (typeof process !== 'undefined' && process.versions && process.versions.node);
		var crypto;
		if (_nodejs && !forge.disableNativeCode) {
			crypto = require('crypto');
		}

		/**
		 * Derives a key from a password.
		 * 
		 * @param p
		 *            the password as a binary-encoded string of bytes.
		 * @param s
		 *            the salt as a binary-encoded string of bytes.
		 * @param c
		 *            the iteration count, a positive integer.
		 * @param dkLen
		 *            the intended length, in bytes, of the derived key, (max:
		 *            2^32 - 1) * hash length of the PRF.
		 * @param [md]
		 *            the message digest (or algorithm identifier as a string)
		 *            to use in the PRF, defaults to SHA-1.
		 * @param [callback(err,
		 *            key)] presence triggers asynchronous version, called once
		 *            the operation completes.
		 * 
		 * @return the derived key, as a binary-encoded string of bytes, for the
		 *         synchronous version (if no callback is specified).
		 */
		forge.pbkdf1 = pkcs5.pbkdf1 = function(p, s, c, dkLen, md, callback) {
			if (typeof md === 'function') {
				callback = md;
				md = null;
			}

			// use native implementation if possible and not disabled, note that
			// some node versions only support SHA-1, others allow digest to be
			// changed
			if (_nodejs && !forge.disableNativeCode && crypto.pbkdf1
					&& (md === null || typeof md !== 'object')
					&& (crypto.pbkdf1Sync.length > 4 || (!md || md === 'sha1'))) {
				if (typeof md !== 'string') {
					// default prf to SHA-1
					md = 'sha1';
				}
				s = new Buffer(s, 'binary');
				if (!callback) {
					if (crypto.pbkdf1Sync.length === 4) {
						return crypto.pbkdf1Sync(p, s, c, dkLen).toString(
								'binary');
					}
					return crypto.pbkdf1Sync(p, s, c, dkLen, md).toString(
							'binary');
				}
				if (crypto.pbkdf1Sync.length === 4) {
					return crypto.pbkdf1(p, s, c, dkLen, function(err, key) {
						if (err) {
							return callback(err);
						}
						callback(null, key.toString('binary'));
					});
				}
				return crypto.pbkdf1(p, s, c, dkLen, md, function(err, key) {
					if (err) {
						return callback(err);
					}
					callback(null, key.toString('binary'));
				});
			}

			if (typeof md === 'undefined' || md === null) {
				// default prf to SHA-1
				md = forge.md.sha1.create();
			}
			if (typeof md === 'string') {
				if (!(md in forge.md.algorithms)) {
					throw new Error('Unknown hash algorithm: ' + md);
				}
				md = forge.md[md].create();
			}

			var hLen = md.digestLength;

			/*
			 * 1. If dkLen > (2^32 - 1) * hLen, output "derived key too long"
			 * and stop.
			 */
			if (dkLen > (0xFFFFFFFF * hLen)) {
				var err = new Error('Derived key is too long.');
				if (callback) {
					return callback(err);
				}
				throw err;
			}

			/*
			 * 2. Let len be the number of hLen-octet blocks in the derived key,
			 * rounding up, and let r be the number of octets in the last block:
			 * 
			 * len = CEIL(dkLen / hLen), r = dkLen - (len - 1) * hLen.
			 */
			var len = Math.ceil(dkLen / hLen);
			var r = dkLen - (len - 1) * hLen;

			var prf = forge.md.sha1.create();
			var dk = '';
			var xor, u_c, u_c1;

			// sync version
			if (!callback) {
				// PRF(P || S) (first iteration)
				prf.start();
				prf.update(p);
				prf.update(s);

				for (var i = 0; i < c - 1; i++) {
					u_c = prf.digest().getBytes();
					prf.start();
					prf.update(u_c);
				}

				dk = prf.digest().getBytes();

				/* 5. Output the derived key DK. */
				return dk;
			}

			// async version
			function outer() {
				prf.start();
				prf.update(p);
				prf.update(s);
				// xor = u_c1 = prf.digest().getBytes();

				// PRF(P, u_{c-1}) (other iterations)
				for (var i = 0; i < c - 1; i++) {
					u_c = prf.digest().getBytes();
					prf.start();
					prf.update(u_c);
				}

				dk = prf.digest().getBytes();

				// done
				return callback(null, dk);
			}
			outer();
		};
	} // end module implementation

	/* ########## Begin module wrapper ########## */
	var name = 'pbkdf1';
	if (typeof define !== 'function') {
		// NodeJS -> AMD
		if (typeof module === 'object' && module.exports) {
			var nodeJS = true;
			define = function(ids, factory) {
				factory(require, module);
			};
		} else {
			// <script>
			if (typeof forge === 'undefined') {
				forge = {};
			}
			return initModule(forge);
		}
	}
	// AMD
	var deps;
	var defineFunc = function(require, module) {
		module.exports = function(forge) {
//			var mods = deps.map(function(dep) {
//				return require(dep);
//			}).concat(initModule);
			
		    var mods = [];
		    for(key in deps){
		    	mods.push( require(deps[key]) );
		    }
		    mods = mods.concat(initModule);	  
			
			// handle circular dependencies
			forge = forge || {};
			forge.defined = forge.defined || {};
			if (forge.defined[name]) {
				return forge[name];
			}
			forge.defined[name] = true;
			for (var i = 0; i < mods.length; ++i) {
				mods[i](forge);
			}
			return forge[name];
		};
	};
	var tmpDefine = define;
	define = function(ids, factory) {
		deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
		if (nodeJS) {
			delete define;
			return tmpDefine.apply(null, Array.prototype.slice.call(arguments,
					0));
		}
		define = tmpDefine;
		return define.apply(null, Array.prototype.slice.call(arguments, 0));
	};
	define([ 'require', 'module', './hmac', './md', './util' ], function() {
		defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
	});
})();
