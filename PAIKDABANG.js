/* jshint -W107 */
var moduleName = 'PAIKDABANG';
var moduleVersion = '25.04.17.1';
console.log(moduleName + " 스크립트 호출됨.");
console.log('Version: ' + moduleVersion);

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
    this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16).toUpperCase());
};

var COFFEE = function () {
    //생성자
    console.log(moduleName + " COFFEE 생성자 호출");
    this.errorMsg = "";
    this.host = "https://paikdabang.com";
    this.url = "";
    this.postData = "";
    this.userAgent = "{}";
    this.xgate_addr = "";
    this.bLogIn = false;
};

COFFEE.prototype = Object.create(iSASObject.prototype);

COFFEE.prototype.COFFEE_LIST = function(aInput) {
    this.log(moduleName + " COFFEE COFFEE_LIST 호출 [" + aInput + "][" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        
        // Step 1: Directly access the target page
        system.setStatus(IBXSTATE_EXECUTE, 50);
        this.url = "/menu/menu_coffee/";
        if (!httpRequest.get(this.host + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        
        var ResultStr = httpRequest.result;
        this.log("Coffee Menu Page URL: [" + this.host + this.url + "]");
        this.log("Coffee Menu Page Content: [" + ResultStr.substring(0, 200) + "...]");
        
        // Check if the page was loaded successfully
        if (ResultStr.indexOf("커피") === -1) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }
        
        // Step 2: Process the result
        system.setStatus(IBXSTATE_RESULT, 70);
        
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        
        // Extract coffee menu information
        this.iSASInOut.Output.Result.url = this.host + this.url;
        this.iSASInOut.Output.Result.coffeeList = [];
        
        // Find all coffee menu items
        var menuItems = ResultStr.split('<p class="menu_tit">');
        
        // Skip the first item as it's before the first menu_tit
        for (var i = 1; i < menuItems.length; i++) {
            var coffeeName = StrGrab(menuItems[i], "", "</p>");
            
            // Clean the coffee name
            coffeeName = StrTrim(coffeeName);
            
            // Add to the coffee list if not empty
            if (coffeeName) {
                this.iSASInOut.Output.Result.coffeeList.push({
                    name: coffeeName
                });
            }
        }
        
        // Log the number of coffee items found
        this.log("Coffee items found: " + this.iSASInOut.Output.Result.coffeeList.length);
        
        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(moduleName + " COFFEE COFFEE_LIST finally");
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
/* jshint +W107 */