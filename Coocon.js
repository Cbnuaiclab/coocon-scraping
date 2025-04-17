/* jshint -W107 */
var moduleName = 'Coocon';
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

var CASE = function () {
    //생성자
    console.log(moduleName + " CASE 생성자 호출");
    this.errorMsg = "";
    this.host = "https://www.coocon.net";
    this.url = "";
    this.postData = "";
    this.userAgent = "{}";
    this.xgate_addr = "";
    this.bLogIn = false;
};

CASE.prototype = Object.create(iSASObject.prototype);

CASE.prototype.CASE_LIST = function(aInput) {
    this.log(moduleName + " CASE CASE_LIST 호출 [" + aInput + "][" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        
        var input = dec(aInput);
        
        // SCENARIO 2: IF LOGIN IS NOT NEEDED
        
        // Step 1: Directly access the target page
        system.setStatus(IBXSTATE_EXECUTE, 50);
        this.url = "/main_1002_01.act?CATG_SRNO=KOR_001_101_000";
        if (!httpRequest.get(this.host + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        
        // Step 2: Process the result
        system.setStatus(IBXSTATE_RESULT, 70);
        var ResultStr = httpRequest.result;
        this.log("Target Page Content: [" + ResultStr.substring(0, 200) + "...]");
        
        // Extract API product information
        var apiProducts = [];
        
        // Parse the HTML content to extract API product information
        // This is a simplified extraction based on the HTML structure
        var productElements = ResultStr.match(/<li name="li_list">([\s\S]*?)<\/li>/g);
        
        if (productElements && productElements.length > 0) {
            for (var i = 0; i < productElements.length; i++) {
                var element = productElements[i];
                
                // Extract product name
                var nameMatch = element.match(/<h4>(.*?)<\/h4>/);
                var name = nameMatch ? nameMatch[1].trim() : "";
                
                // Extract product description
                var descMatch = element.match(/<p>([\s\S]*?)<\/p>/);
                var description = descMatch ? descMatch[1].replace(/<br>/g, " ").trim() : "";
                
                if (name) {
                    apiProducts.push({
                        name: name,
                        description: description
                    });
                }
            }
        }
        
        // If no products were found in the specific format, try an alternative approach
        if (apiProducts.length === 0) {
            var powerProducts = ResultStr.match(/<div class="listBx_text">([\s\S]*?)<\/div>/g);
            
            if (powerProducts && powerProducts.length > 0) {
                for (var j = 0; j < powerProducts.length; j++) {
                    var powerElement = powerProducts[j];
                    
                    // Extract product name
                    var powerNameMatch = powerElement.match(/<h4>([\s\S]*?)<\/h4>/);
                    var powerName = powerNameMatch ? powerNameMatch[1].replace(/<br>/g, " ").trim() : "";
                    
                    // Extract product description
                    var powerDescMatch = powerElement.match(/<p>([\s\S]*?)<\/p>/);
                    var powerDesc = powerDescMatch ? powerDescMatch[1].replace(/<br>/g, " ").trim() : "";
                    
                    if (powerName) {
                        apiProducts.push({
                            name: powerName,
                            description: powerDesc
                        });
                    }
                }
            }
        }
        
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {
            totalCount: apiProducts.length,
            products: apiProducts
        };
        
        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(moduleName + " CASE CASE_LIST finally");
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