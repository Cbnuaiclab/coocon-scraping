/* jshint -W107 */
var moduleName = 'LMS';
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
    this.host = "https://lms.chungbuk.ac.kr";
    this.url = "";
    this.postData = "";
    this.userAgent = "{}";
    this.xgate_addr = "";
    this.bLogIn = false;
};

NOTICE.prototype = Object.create(iSASObject.prototype);

NOTICE.prototype.NOTICE_LIST = function(aInput) {
    this.log(moduleName + " NOTICE NOTICE_LIST 호출 [" + aInput + "][" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        
        // Business Logic Implementation
        var input = dec(aInput);
        
        var username = input.username;  // LMS 학번/교번
        var password = input.password;  // LMS 비밀번호
        
        this.log("Login credentials - Username: [" + username + "]");
        
        // Step 1: Navigate to the login page
        this.url = "/login/index.php";
        if (!httpRequest.get(this.host + this.url)) {
            this.log("Failed to access login page");
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        
        var ResultStr = httpRequest.result;
        this.log("Login Page URL: [" + this.host + this.url + "]");
        this.log("Login Page Content Length: [" + ResultStr.length + "]");
        
        // Step 2: Prepare form data for login POST request
        this.postData = "";
        this.postData += "username=" + httpRequest.URLEncode(username, "UTF-8");
        this.postData += "&password=" + httpRequest.URLEncode(password, "UTF-8");
        this.postData += "&logintoken=" + this.extractLoginToken(ResultStr);
        
        // Step 3: Send POST request to login
        system.setStatus(IBXSTATE_LOGIN, 30);
        if (!httpRequest.post(this.host + this.url, this.postData, "application/x-www-form-urlencoded")) {
            this.log("Failed to submit login form");
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        
        // Check if login was successful
        ResultStr = httpRequest.result;
        if (ResultStr.indexOf("로그인 실패") > -1 || ResultStr.indexOf("Invalid login") > -1) {
            this.log("Login failed - Invalid credentials");
            this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_2_INVALID);
            return E_IBX_KEY_ACCOUNT_PASSWORD_2_INVALID;
        }
        
        // Step 4: Navigate to the announcements page
        system.setStatus(IBXSTATE_EXECUTE, 50);
        this.url = "/mod/ubboard/view.php?id=17";
        if (!httpRequest.get(this.host + this.url)) {
            this.log("Failed to access announcements page");
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        
        ResultStr = httpRequest.result;
        this.log("Announcements Page URL: [" + this.host + this.url + "]");
        this.log("Announcements Page Content Length: [" + ResultStr.length + "]");
        
        // Step 5: Extract notice list data
        system.setStatus(IBXSTATE_RESULT, 70);
        var noticeList = this.extractNoticeList(ResultStr);
        
        // Step 6: Prepare output
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {
            TotalCount: noticeList.totalCount,
            CurrentPage: noticeList.currentPage,
            TotalPages: noticeList.totalPages,
            Notices: noticeList.items
        };
        
        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(moduleName + " NOTICE NOTICE_LIST finally");
    }
    
    // Helper method to extract login token from login page
}

// Helper method to extract login token from login page
NOTICE.prototype.extractLoginToken = function(html) {
    var token = "";
    var tokenMatch = html.match(/name="logintoken" value="([^"]+)"/);
    if (tokenMatch && tokenMatch.length > 1) {
        token = tokenMatch[1];
    }
    this.log("Extracted login token: [" + token + "]");
    return token;
};

// Helper method to extract notice list from announcements page
NOTICE.prototype.extractNoticeList = function(html) {
    var result = {
        totalCount: 0,
        currentPage: 1,
        totalPages: 1,
        items: []
    };
    
    // Extract total count
    var totalCountMatch = html.match(/Total Count : <span class="text-warning">(\d+)<\/span>/);
    if (totalCountMatch && totalCountMatch.length > 1) {
        result.totalCount = parseInt(totalCountMatch[1]);
    }
    
    // Extract pagination info
    var paginationMatch = html.match(/Total Page : <span class="text-success">(\d+) \/ (\d+)<\/span>/);
    if (paginationMatch && paginationMatch.length > 2) {
        result.currentPage = parseInt(paginationMatch[1]);
        result.totalPages = parseInt(paginationMatch[2]);
    }
    
    // Extract notice items
    var noticeRows = html.match(/<tr class="">([\s\S]*?)<\/tr>/g);
    if (noticeRows) {
        for (var i = 0; i < noticeRows.length; i++) {
            var row = noticeRows[i];
            
            // Extract notice number
            var noticeNum = "";
            var numMatch = row.match(/<td class="text-center t-number">\s*(\d+|<img[^>]*alt="notice"[^>]*>)\s*<\/td>/);
            if (numMatch && numMatch.length > 1) {
                noticeNum = numMatch[1].indexOf("<img") > -1 ? "공지" : numMatch[1];
            }
            
            // Extract notice title
            var title = "";
            var titleMatch = row.match(/<td class="t-subject">[^<]*<a[^>]*>\s*([\s\S]*?)\s*<\/a>/);
            if (titleMatch && titleMatch.length > 1) {
                title = titleMatch[1].trim();
            }
            
            // Extract notice URL
            var url = "";
            var urlMatch = row.match(/<a href="([^"]+)"/);
            if (urlMatch && urlMatch.length > 1) {
                url = urlMatch[1];
            }
            
            // Extract date
            var date = "";
            var dateMatch = row.match(/<td class="text-center t-date"><span[^>]*>([^<]+)<\/span><\/td>/);
            if (dateMatch && dateMatch.length > 1) {
                date = dateMatch[1];
            }
            
            // Extract view count
            var viewCount = "";
            var viewMatch = row.match(/<td class="text-center t-viewcount">\s*([\d,]+)\s*<\/td>/);
            if (viewMatch && viewMatch.length > 1) {
                viewCount = viewMatch[1];
            }
            
            // Add to items array
            if (title) {
                result.items.push({
                    Number: noticeNum,
                    Title: title,
                    URL: url,
                    Date: date,
                    ViewCount: viewCount
                });
            }
        }
    }
    
    return result;
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