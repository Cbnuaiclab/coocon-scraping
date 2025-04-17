/* jshint -W107 */
var moduleName = 'MIS';
var moduleVersion = '25.04.15.1';
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

var NOTICE = function () {
    //생성자
    console.log(moduleName + " NOTICE 생성자 호출");
    this.errorMsg = "";
    this.host = "https://mis.chungbuk.ac.kr";
    this.url = "";
    this.postData = "";
    this.userAgent = '{"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.122 Whale/3.16.138.27 Safari/537.36",';
    this.userAgent += '"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",';
    this.userAgent += '"Accept-Encoding": "gzip, deflate, br",';
    this.userAgent += '"Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,ko;q=0.7,ja;q=0.6"}';
    this.xgate_addr = "";
    this.bLogIn = false;
};

NOTICE.prototype = Object.create(iSASObject.prototype);

NOTICE.prototype.NOTICE_LIST = function (aInput) {
    this.log(moduleName + " NOTICE NOTICE_LIST 호출 [" + aInput + "][" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        // Business Logic Implementation
        var input = dec(aInput);

        var Headers = '{' +
            '"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",' +
            '"Accept": "*/*",' +
            '"Accept-Language": "en-US,en;q=0.9,ko;q=0.8",' +
            '"X-Requested-With": "XMLHttpRequest",' +
            '"Referer": "https://mis.chungbuk.ac.kr/?pg_idx=61",' +
            '"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}';

        // Step 1: Set up the URL for the notice list page
        this.url = "/?pg_idx=7";
        this.log("Notice List URL: [" + this.host + this.url + "]");
        postData = "pg_idx=7&bidx=3&id=mis_news&cate=&pidx=&str=&page=&mode=list"
        // Step 2: Send GET request to fetch the page
        system.setStatus(IBXSTATE_LOGIN, 30);
        if (!httpRequest.postWithUserAgent(Headers, "https://mis.chungbuk.ac.kr/module/board/_main.php", postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }

        // Step 3: Process the response
        system.setStatus(IBXSTATE_EXECUTE, 50);
        ResultStr = httpRequest.result;
        this.log("Notice Page Content Length: [" + ResultStr + "]");

        // Step 4: Parse the HTML to extract notice list
        system.setStatus(IBXSTATE_EXECUTE, 50);

        // __DATA_EXTRACTION__
        // Prepare the output
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};

        // Extract basic information
        this.iSASInOut.Output.Result.url = this.host + this.url;
        this.iSASInOut.Output.Result.ResultStr = httpRequest.URLEncodeAll(ResultStr);
        this.iSASInOut.Output.Result.timestamp = new Date().toISOString();

        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(moduleName + " NOTICE NOTICE_LIST finally");
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