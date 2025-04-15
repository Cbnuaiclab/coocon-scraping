try {
    //필요한거 로드
    system.include("common/CryptoJS");
} catch (e) {
    console.log("ntsReport e :[" + e.message + "]");
} 

function nts_encrypt(b) {
    var a = CryptoJS.PBKDF2('ACTIONID', CryptoJS.enc.Hex.parse('18b00b2fc5f0e0ee40447bba4dabc952'), {
        keySize: 128 / 32,
        iterations: 100
    });
    return CryptoJS.AES.encrypt(b, a, {
        iv: CryptoJS.enc.Hex.parse('4378110db6392f93e95d5159dabdee9b')
    }).toString()
}