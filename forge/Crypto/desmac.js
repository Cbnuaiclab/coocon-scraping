/**
 *
 * Copyright (c) 2010-2012 Initech, Inc. All rights reserved.
 */
(function() {
    /* ########## Begin module implementation ########## */
    function initModule(forge) {

        /* DESMAC API */
        var desmac = forge.desmac = forge.desmac || {};


        desmac.getMac = function(key, input) {

            var iv = forge.util.createBuffer(8);
            //iv.fillWithByte(0x00, 8);
            iv.setAt(0,'0x00');
            iv.setAt(1,'0x00');
            iv.setAt(2,'0x00');
            iv.setAt(3,'0x00');
            iv.setAt(4,'0x00');
            iv.setAt(5,'0x00');
            iv.setAt(6,'0x00');
            iv.setAt(7,'0x00');

            //var iv = [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00];
            //var key = [0xAB,0xD9,0x85,0xBA,0xD4,0x76,0x57,0x37];
            //key = forge.util.createBuffer(key);



            var i, j;
            var in_point = 0;
            var inLen = input.length();
            var remainLen = inLen % 8;

            var out_tmp;
            var in_tmp = forge.util.createBuffer();

            if(inLen >= 8) {
                j = 8
            }
            else {
                j = inLen;
            }
            for(i=0; i < j ; i++){
                in_tmp.setAt(i,input.at(in_point));
                in_point++;
            }
            inLen -= j;

            while(inLen >= 0) {
                var padlen = 0;

                var hex_in_tmp = in_tmp.toHex();
                var hex_key = forge.util.bytesToHex(key);
                var hex_iv = iv.toHex();

                var cipher = forge.cipher.createCipher("DES-CBC", key);
                cipher.mode.pad = false;
                cipher.mode.unpad = false;
                cipher.start({iv: iv.copy()});
                //cipher.start({iv:iv});

                cipher.update(in_tmp.copy());
                cipher.finish();

                var hex_out = cipher.output.toHex();
                out_tmp = forge.util.createBuffer();
                out_tmp.putBuffer(cipher.output);

                var hex_out_tmp = out_tmp.toHex();
                if(inLen >= 8) {
                    j = 8
                }
                else {
                    j = inLen;
                }
                if(j==0) {
                    if(remainLen) break;
                    else remainLen = !remainLen;
                }

                for(i=0; i < j ; i++){
                    in_tmp.setAt(i,(out_tmp.at(i) ^ input.at(in_point)));
                    in_point++;
                }
                for(; i < 8; i++){
                    in_tmp.setAt(i,out_tmp.at(i));
                }
                inLen -= j;
            }

            var output = forge.util.createBuffer();
            output.putBuffer(out_tmp);

            return output;
        };


    } // end module implementation

    /* ########## Begin module wrapper ########## */
    var name = 'desmac';
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
                forge = {};
            }
            return initModule(forge);
        }
    }
// AMD
    var deps;
    var defineFunc = function(require, module) {
        module.exports = function(forge) {
            var mods = deps.map(function(dep) {
                return require(dep);
            }).concat(initModule);
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
            return forge[name];
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
    define(['require', 'module', './util', './des'], function() {
        defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    });
})();
