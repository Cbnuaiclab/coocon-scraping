/* jshint -W107 */
var moduleName = '__MODULE_NAME__';
var moduleVersion = '__MODULE_VERSION__';

var __CLASS_NAME__ = function () {
    //생성자
    console.log(moduleName + " __CLASS_NAME__ 생성자 호출");
    this.errorMsg = "";
    this.host = "__HOST_URL__";
    this.url = "";
    this.postData = "";
    this.userAgent = "{}";
    this.xgate_addr = "";
    this.bLogIn = false;
};

__CLASS_NAME__.prototype = Object.create(iSASObject.prototype);

__CLASS_NAME__.prototype.__JOB_NAME__ = function(aInput) {
    this.log(moduleName + " __CLASS_NAME__ __JOB_NAME__ 호출 [" + aInput + "][" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        
        // __Business_Logic__
        system.setStatus(IBXSTATE_LOGIN, 30);
        system.setStatus(IBXSTATE_EXECUTE, 50);
        system.setStatus(IBXSTATE_RESULT, 70);
        
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        // __DATA_EXTRACTION__
        
        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(moduleName + " __CLASS_NAME__ __JOB_NAME__ finally");
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