/* jshint -W107 */
var moduleVersion = "25.3.19.1";
var BankName = "국민은행";
console.log(BankName + " 스크립트 호출됨.");
console.log("Version: " + moduleVersion);

function iSASObject() {
    console.log("iSASObject 생성자 호출");
    this.iSASInOut = {};

    this.UID = '';
    this.AESKey = '';
    this.EncKey = '';
    this.KeyValue = '';
    this.KeyStr = '';

    this.LowerTempStr = '';
    this.imgBase64 = '';
}

iSASObject.prototype.log = function(logMsg) {
    try {
        SASLog("iSASObject.Log(" + logMsg + "\")");
    } catch (e) {
        console.log("iSASObject.Log(" + logMsg + "\")");
    }
};

iSASObject.prototype.setError = function(errcode) {
    this.iSASInOut.Output = {};
    this.iSASInOut.Output.ErrorCode = errcode.toString(16).toUpperCase();
    //TODO: 에러 메시지 가져오는 부분...
    this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16).toUpperCase());
};

///////////////////////////////////////////////////////////////////////////////
var 빠른조회 = function() {
    console.log(BankName + " 빠른조회 생성자 호출");
    this.errorMsg = "";
    this.host = "https://obank.kbstar.com";
    this.url = "";
    this.userAgent = "{}";
    this.param = "";
    this.postData = "";
    this.xgate_addr = "";
    this.bLogIn = false;
};

빠른조회.prototype = Object.create(iSASObject.prototype);

빠른조회.prototype.CheckResultOrder = function (aDataArray, aOrder) {
    this.log("빠른조회.prototype.CheckResultOrder");

    if (aDataArray.length <= 1) return S_IBX_OK;

    for (var i = 0; i < aDataArray.length; i++) {
        this.log("aDataArray[" + i + "].출금액:[" + aDataArray[i].출금액 + "]");
        this.log("aDataArray[" + i + "].입금액:[" + aDataArray[i].입금액 + "]");
        this.log("aDataArray[" + i + "].거래후잔액:[" + aDataArray[i].거래후잔액 + "]");

        //취소건 처리는 주석 처리되어 있어서 일단 처리 않함.
        /*
         if aDataArray[i, 3] <> '' then begin
         if aDataArray[i, 0] = '0' then begin
         if StrPos('-', aDataArray[i, 1]) = 0 then
         aDataArray[i, 1] := '-' + aDataArray[i, 1]
         end else if aDataArray[i, 1] = '0' then begin
         if StrPos('-', aDataArray[i, 0]) = 0 then
         aDataArray[i, 0] := '-' + aDataArray[i, 0];
         end;
         end;
         */
        // 입/출금액이 둘 다 0이 아니면 오류
        if ((aDataArray[i].출금액 != "0") && (aDataArray[i].입금액 != "0")) {
            return E_IBX_CURRENCY_NOT_CONVERT;
        }
    }

    try {
        var nCurr;
        // 최신
        if (aOrder == '0')
            nCurr = parseInt(aDataArray[0].거래후잔액) - parseInt(aDataArray[0].입금액) + parseInt(aDataArray[0].출금액);
        // 과거
        else
            nCurr = parseInt(aDataArray[0].거래후잔액) + parseInt(aDataArray[1].입금액) - parseInt(aDataArray[1].출금액);

        // 거래금액 계산 결과값과 잔액 다르면 오류
        if (parseInt(aDataArray[1].거래후잔액) != nCurr)
            return E_IBX_RESULT_ORDER_VERFY_FAIL;
    } catch (e) {
        this.log("빠른조회.prototype.CheckResultOrder exception:[" + e.message + "]");
        return E_IBX_RESULT_ORDER_VERFY_FAIL;
    }

    return S_IBX_OK;
};

빠른조회.prototype.빠른잔액조회 = function(aInput) {
    this.log(BankName + " 빠른조회 빠른잔액조회 호출 [" + aInput + "][" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        var input = dec(aInput.Input);
        if (input.계좌비밀번호) this.iSASInOut.Input.계좌비밀번호 = input.계좌비밀번호.replace(/./g, '*');
        if (input.주민사업자번호) this.iSASInOut.Input.주민사업자번호 = input.주민사업자번호.toString().replace(/./g, "*");

        var 계좌번호 = input.계좌번호;
        var 계좌비밀번호 = input.계좌비밀번호;
        var ID = input.ID;
        var 주민사업자번호 = input.주민사업자번호;
        var 통화 = input.통화 && input.통화.toUpperCase();

        // 통화
        if (!통화 || 통화 == 'KRW') 통화 = "";
        
        // 미입력 체크
        if (!ID && !주민사업자번호) {
            this.setError(E_IBX_USER_ACCOUNT_NOTENTER);
            return E_IBX_USER_ACCOUNT_NOTENTER;
        }

        // 8자리 입력 시 오류 없이 사용 (아이디 우선)
        if (!ID){
            if(주민사업자번호.length == 8){
                주민사업자번호 = 주민사업자번호.substr(2, 6);
            }
        }

        // 계좌번호 확인
        if (계좌번호 == "" || 계좌번호 == undefined) {
            this.setError(E_IBX_ACCOUNT_NO_NOTENTER);
            return E_IBX_ACCOUNT_NO_NOTENTER;
        }

        // 계좌번호 숫자/자리수 16자 이내 체크
        if (!/^\d{1,16}$/.test(계좌번호)) {
            this.setError(E_IBX_ACCOUNT_NO_INVALID);
            return E_IBX_ACCOUNT_NO_INVALID;
        }

        // 계좌비밀번호 확인
        if (계좌비밀번호 == "" || 계좌비밀번호 == undefined) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_NOTENTER);
            return E_IBX_ACCOUNT_PASSWORD_NOTENTER;
        }

        // 비밀번호 숫자 & 자리수 4자
        if (!/^\d{4}$/.test(계좌비밀번호)) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_INVALID);
            return E_IBX_ACCOUNT_PASSWORD_INVALID;
        }

        if (통화 && 통화.length != 3) {
            this.setError(E_IBX_CURRENCY_INVALID);
            return E_IBX_CURRENCY_INVALID;
        }

        system.setStatus(IBXSTATE_LOGIN, 30);
        this.url = "/quics?page=C025255&cc=b028364:b028702&QSL=F";
        if (!httpRequest.get(this.host + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("Login: [" + ResultStr + "]");

        if (ResultStr.indexOf('사용자가 많아 잠시 후 이용하여') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var 오늘날짜 = StrGrab(ResultStr, "getToday = \"", "\"");
        var tagName = StrGrab(ResultStr, "name='KEYPAD_TYPE_", "'");

        if (!오늘날짜 || !tagName) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        // Main > 계좌조회
        system.setStatus(IBXSTATE_LOGIN, 40);

        // 주민사업자번호 입력 시, 주민사업자번호로 조회
        this.postData = "KEYPAD_TYPE_" + tagName + "=" + StrGrab(ResultStr, "name='KEYPAD_TYPE_" + tagName + "' value=\"", "\"");
        this.postData += "&KEYPAD_HASH_" + tagName + "=";
        this.postData += "&KEYPAD_USEYN_" + tagName + "=" + StrGrab(ResultStr, "name='KEYPAD_USEYN_" + tagName + "' value=\"", "\"");
        this.postData += "&KEYPAD_INPUT_" + tagName + "=" + httpRequest.URLEncode(StrGrab(ResultStr, "name='KEYPAD_INPUT_" + tagName + "' value=\"", "\""), "UTF-8");
        this.postData += "&signed_msg=";
        this.postData += "&" + httpRequest.URLEncode("요청키", "UTF-8") + "=";
        this.postData += "&" + httpRequest.URLEncode("계좌번호", "UTF-8") + "=" + 계좌번호;
        this.postData += "&" + httpRequest.URLEncode("조회시작일자", "UTF-8") + "=" + 오늘날짜;
        this.postData += "&" + httpRequest.URLEncode("조회종료일", "UTF-8") + "=" + 오늘날짜;
        this.postData += "&" + httpRequest.URLEncode("빠른조회", "UTF-8") + "=" + "Y";
        this.postData += "&" + httpRequest.URLEncode("조회계좌", "UTF-8") + "=" + 계좌번호;
        this.postData += "&" + httpRequest.URLEncode("비밀번호", "UTF-8") + "=" + 계좌비밀번호;
        this.postData += '&' + httpRequest.URLEncodeAll('조회시작년') + '=' + 오늘날짜.substr(0, 4);
        this.postData += '&' + httpRequest.URLEncodeAll('조회시작월') + '=' + 오늘날짜.substr(4, 2);
        this.postData += '&' + httpRequest.URLEncodeAll('조회시작일') + '=' + 오늘날짜.substr(6, 2);
        this.postData += '&' + httpRequest.URLEncodeAll('조회끝년') + '=' + 오늘날짜.substr(0, 4);
        this.postData += '&' + httpRequest.URLEncodeAll('조회끝월') + '=' + 오늘날짜.substr(4, 2);
        this.postData += '&' + httpRequest.URLEncodeAll('조회끝일') + '=' + 오늘날짜.substr(6, 2);
        this.postData += "&" + httpRequest.URLEncode("조회구분", "UTF-8") + "=" + "2"; // 전체
        this.postData += "&" + httpRequest.URLEncode("응답방법", "UTF-8") + "=" + "2"; // 최근
  
        if (ID) {
            this.postData += "&" + httpRequest.URLEncode("고객ID", "UTF-8") + "=" + ID.toUpperCase();
            this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=";
            this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=" + ID.toUpperCase();
            this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "1";
        } else {
            this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=" + 주민사업자번호;
            this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=";
            this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "2";
        }

        if (계좌번호.length == 14) {
            if (계좌번호.substr(4, 2) == '68') {
                if (!통화) {
                    this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028795";
                } else {
                    this.url = "/quics?chgCompId=b028795&baseCompId=b028702&page=C025255&cc=b028702:b028795"; // 외화 계좌번호
                }
            } else if (계좌번호.substr(4, 3) == '497') {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b043371";
            } else {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028770";
            }
        } else if (계좌번호.length == 12) {
            if (계좌번호.substr(3, 2) == '42') {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028795";
            } else if (계좌번호.substr(3, 2) == '17') {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b043371";
            } else {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028770";
            }
        } else {
            this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028770";
        }

        if (!this.url) {
            this.setError(E_IBX_ACCOUNT_NO_INVALID);
            return E_IBX_ACCOUNT_NO_INVALID;
        }

        if (!httpRequest.post(this.host + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("result: [" + ResultStr + "]");

        // /*{
        //     "[계좌번호] 값은 필수항목 입니다" 오전 9시 이전 조회시 국민은행 사이트 장애로 재통신 로직 추가.
        //     재통신 후에도 동일한 오류 발생시 서버오류처리함(80002F30)
        // }*/
        // if (StrGrab(ResultStr, 'id="errCd">', '</').indexOf('CBN13000') >= 0) {
        //     if (!httpRequest.post(this.host + this.url, this.postData)) {
        //         this.setError(E_IBX_FAILTOGETPAGE);
        //         return E_IBX_FAILTOGETPAGE;
        //     }
        //     ResultStr = httpRequest.result;
        //     this.log("result_re: [" + ResultStr + "]");
        // }

        // // Error check
        // if (ResultStr.indexOf('조회가능한 예금종류가 아닙니다') >= 0) {
        //     this.setError(E_IBX_ACCOUNT_NO_WRITEONLY);
        //     return E_IBX_ACCOUNT_NO_WRITEONLY;
        // }

        // if ((ResultStr.indexOf("해당계좌는 빠른서비스 조회계좌로 등록되지않았습니다") >= 0) ||
        //     (ResultStr.indexOf("해당 계좌는 빠른조회 서비스 이용계좌로 등록되지 않았습니다") >= 0) ||
        //     (ResultStr.indexOf("빠른조회서비스 미등록 계좌입니다") >= 0) ||
        //     (ResultStr.indexOf("해당계좌는 빠른서비스 조회계좌 이미해지되었습니다") >= 0)) {
        //     this.setError(E_IBX_SERVICE_DENIED_2);
        //     return E_IBX_SERVICE_DENIED_2;
        // }
        // if ((ResultStr.indexOf("입력한 계좌번호는 존재하지") >= 0) ||
        //     (ResultStr.indexOf("계좌번호가일치하지않읍니다") >= 0) ||
        //     (ResultStr.indexOf("계좌번호가 일치하지 않습니다") >= 0) ||
        //     (ResultStr.indexOf("계좌번호 입력 오류입니다.") >= 0) ||
        //     (ResultStr.indexOf("계좌번호 오류입니다") >= 0) ||
        //     (ResultStr.indexOf("계좌번호가 빠른조회서비스에 등록되어 있지 않습니다") >= 0) ||
        //     (ResultStr.indexOf("이용이 불가능한 계좌이거나 메뉴선택이 잘못 되었습니다") >= 0) ||
        //     (ResultStr.indexOf("올바른 계좌번호를 입력하여 주십시오") >= 0) ||
        //     (ResultStr.indexOf("계좌번호 확인 후 거래하여") >= 0) ||
        //     (ResultStr.indexOf("계좌번호가 잘못 입력되었습니다") >= 0)) {
        //     this.setError(E_IBX_ACCOUNT_NO_INVALID);
        //     return E_IBX_ACCOUNT_NO_INVALID;
        // }

        // if (ResultStr.indexOf("이용이불가능한계좌") >= 0) {
        //     this.setError(E_IBX_USER_ACCOUNT_DENIED);
        //     return E_IBX_USER_ACCOUNT_DENIED;
        // }

        // if ((ResultStr.indexOf("본인의 주민등록번호 또는 사업자번호를 잘못입력하셨습니다") >= 0) ||
        //     (ResultStr.indexOf("계좌번호또는주민등록(사업자)번호가일치하지않습니다") >= 0) ||
        //     (ResultStr.indexOf("계좌번호 또는 주민등록(사업자)번호가 일치하지 않습니다") >= 0) ||
        //     (ResultStr.indexOf("주민번호 또는 사업자 번호를 정확히 입력하십시오") >= 0) || // 아이디 틀릴때에도 동일한 메세지 나옴
        //     (ResultStr.indexOf("주민등록번호가 다릅니다") >= 0) ||
        //     (ResultStr.indexOf("본인명의의 계좌만 조회 및 거래가 가능합니다") >= 0)) { // 계좌번호, 계좌비밀번호, 사업자번호 오류 시 동일한 오류 메세지
        //     this.setError(E_IBX_REGNO_RESIDENT_INVALID);
        //     return E_IBX_REGNO_RESIDENT_INVALID;
        // }

        // // 입력파라미터 오류(지금까지는 전부 아이디 오류였음)
        // if ((ResultStr.indexOf("[오류코드:Z491") >= 0) ||
        //     (ResultStr.indexOf("업무처리 오류입니다") >= 0)) {
        //     this.setError(E_IBX_USER_ACCOUNT_INVALID);
        //     return E_IBX_USER_ACCOUNT_INVALID;
        // }

        // if ((ResultStr.indexOf("고객아이디가 없거나") >= 0) ||
        //     (ResultStr.indexOf("해지된 사용자 ID입니다") >= 0) ||
        //     (ResultStr.indexOf("서브아이디로는 거래가 불가합니다") >= 0) ||
        //     (ResultStr.indexOf("로그인하신 ID가 유효하지 않습니다") >= 0) ||
        //     (ResultStr.indexOf("(UKFK0166)") >= 0) ||
        //     (ResultStr.indexOf("사용자ID를 확인하여 입력해 주십시오") >= 0) ||
        //     (ResultStr.indexOf("인터넷뱅킹ID는 영문과 숫자만 입력가능합니다.") >= 0) ||
        //     (ResultStr.indexOf("ID를 확인하여 입력해") >= 0)) {
        //     this.setError(E_IBX_KEY_ACCOUNT_INFO_2_INVALID);
        //     return E_IBX_KEY_ACCOUNT_INFO_2_INVALID;
        // }

        // if (ResultStr.indexOf("지연되고 있습니다.") >= 0) {
        //     this.setError(E_IBX_SERVICE_SERVERBUSY);
        //     return E_IBX_SERVICE_SERVERBUSY;
        // }

        // if ((ResultStr.indexOf("비밀번호 3회이상오류") >= 0) ||
        //     (ResultStr.indexOf("비밀번호 3회 오류입니다") >= 0)) {
        //     this.setError(E_IBX_ACCOUNT_PASSWORD_JUSTBEFOREDENY);
        //     return E_IBX_ACCOUNT_PASSWORD_JUSTBEFOREDENY;
        // }

        // if ((ResultStr.indexOf("회 오류입력되었습니다") >= 0) ||
        //     (ResultStr.indexOf("회 오류 입력되었습니다") >= 0) ||
        //     (ResultStr.indexOf("회 오류 입력 되었습니다") >= 0) ||
        //     (ResultStr.indexOf("비밀번호 1회오류 등록") >= 0) || 
        //     (ResultStr.indexOf("비밀번호 2회오류 등록") >= 0) ||
        //     (ResultStr.indexOf("계좌 비밀번호 1회오류 및 2회오류가 등록되었습니다") >= 0)) {
        //     this.setError(E_IBX_ACCOUNT_PASSWORD_INVALID);
        //     return E_IBX_ACCOUNT_PASSWORD_INVALID;
        // }

        // if ((ResultStr.indexOf("비밀번호 4회 이상 오류") >= 0) ||
        //     (ResultStr.indexOf("계좌 비밀번호가 4회 오류") >= 0)) {
        //     this.setError(E_IBX_ACCOUNT_PASSWORD_DENIED);
        //     return E_IBX_ACCOUNT_PASSWORD_DENIED;
        // }

        // if ((ResultStr.indexOf("서비스 장애 중 입니다.") >= 0) ||
        //     (ResultStr.indexOf("사용자가 많아 잠시 후 이용하") >= 0) ||
        //     (ResultStr.indexOf("은행 HOST쪽에 데이타 수신 오류입니다") >= 0) ||
        //     (ResultStr.indexOf("일자 전환 중 잠시 후 거래하여 주시기 바랍니다.") >= 0) ||
        //     (StrGrab(ResultStr, 'id="errCd">', '</').indexOf("CBN13000") >= 0)) {
        //     this.setError(E_IBX_SITE_INTERNAL);
        //     return E_IBX_SITE_INTERNAL;
        // }

        // if ((ResultStr.indexOf("(EMCITBC007)") >= 0) ||
        //     (ResultStr.indexOf("지금은 일자전환 및 거래제한으로 인해 잠시 동안 서비스가 불가합니다") >= 0) ||
        //     (ResultStr.indexOf("현재는 시스템 정기점검 작업 시간입니다") >= 0)) {
        //     this.setError(E_IBX_SERVICE_NOTIME);
        //     return E_IBX_SERVICE_NOTIME;
        // }

        // if ((ResultStr.indexOf("휴면계좌") >= 0) ||
        //     (ResultStr.indexOf("존재하지 않거나") >= 0)) {
        //     this.setError(E_IBX_ACCOUNT_NO_MISC);
        //     return E_IBX_ACCOUNT_NO_MISC;
        // }

        // if (ResultStr.indexOf('거래내역조회 신청이 불가능합니다') > -1) {
        //     this.setError(E_IBX_ACCOUNT_NO_MISC);
        //     this.iSASInOut.Output.ErrorMessage = "계좌번호가 올바르게 입력되었는지 확인해 주세요. CMS계좌, 증권통장, 중도금계좌, 아파트관리비통장, 가상계좌는 거래내역조회 신청이 불가능합니다.";
        //     return E_IBX_ACCOUNT_NO_MISC;
        // }

        // // 개인고객 & 로그인 패스워드 오류초과
        // if ((ResultStr.indexOf("사용자암호가 3회 입력오류") >= 0) ||
        //     (ResultStr.indexOf("사용자 암호가 3회 연속 오류") >= 0) ||
        //     (ResultStr.indexOf("사용자 암호 오류 해제 후") >= 0) ||
        //     (ResultStr.indexOf("사용자암호 3회 입력오류") >= 0)) {
        //     this.setError(E_IBX_USER_PASSWORD_DENIED);
        //     return E_IBX_USER_PASSWORD_DENIED;
        // }

        // if (ResultStr.indexOf("조회가능한 예금종류가 아닙니다.") >= 0) {
        //     this.setError(E_IBX_ACCOUNT_CLASS_INVALID);
        //     return E_IBX_ACCOUNT_CLASS_INVALID;
        // }

        // if (StrGrab(ResultStr, '<div id="errorDiv"', '">').indexOf('display:block') >= 0) {
        //     this.setError(E_IBX_UNKNOWN);
        //     return E_IBX_UNKNOWN;
        // }

        system.setStatus(IBXSTATE_RESULT, 80);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};

        this.iSASInOut.Output.Result.ResultStr = ResultStr;
        // 예금명
        this.iSASInOut.Output.Result.예금명 = StrGrab(StrGrab(ResultStr, ">계좌정보<", "</tr>"), "<td", "</td>");
        this.iSASInOut.Output.Result.예금명 = StrGrab(this.iSASInOut.Output.Result.예금명, ">", "");
        this.iSASInOut.Output.Result.예금명 = StrGrab(this.iSASInOut.Output.Result.예금명, "(", ")");
        this.iSASInOut.Output.Result.예금명 = StrTrim(this.iSASInOut.Output.Result.예금명);

        if (!this.iSASInOut.Output.Result.예금명) {
            this.setError(E_IBX_RESULT_FAIL);
            return E_IBX_RESULT_FAIL;
        }

        // 계좌번호
        this.iSASInOut.Output.Result.계좌번호 = 계좌번호;

        // 통화코드
        this.iSASInOut.Output.Result.통화코드 = "";
        
        if (통화) {
            var tbBlock = StrGrab(ResultStr, '>계좌정보<', '</tbody>');
            if (!tbBlock) {
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            var 통화코드 = '', Col_Block = '';
            var index = 1;
            var is통화 = false;
            while (true) {
                Col_Block = StrGrab(tbBlock, '<tr', '</tr>', index++);
                if (!Col_Block) break;

                통화코드 = StrGrab(StrGrab(StrGrab(Col_Block, '>통화코드<', '</td>'), '<td', ''), '>', '');
                통화코드 = 통화코드.replace(/[\s,]/g, ""); //Remove Space New Line and ,
                통화코드 = StrTrim(통화코드);
                if (통화코드 == 통화) {
                    is통화 = true;

                    // 통화코드
                    this.iSASInOut.Output.Result.통화코드 = 통화코드;

                    // 잔액
                    this.iSASInOut.Output.Result.잔액 = StrGrab(StrGrab(StrGrab(Col_Block, '>통화별금액<', '</td>'), '<td', ''), '>', '');
                    this.iSASInOut.Output.Result.잔액 = this.iSASInOut.Output.Result.잔액.replace(/[\s,]/g, ""); //Remove Space New Line and ,
                    this.iSASInOut.Output.Result.잔액 = StrTrim(this.iSASInOut.Output.Result.잔액);

                    // 출금가능액
                    this.iSASInOut.Output.Result.출금가능금액 = "";

                    if (!IsCurrency(this.iSASInOut.Output.Result.잔액)) {
                        this.setError(E_IBX_CURRENCY_NOT_CONVERT);
                        return E_IBX_CURRENCY_NOT_CONVERT;
                    }
                    break;
                }
            }

            // 통화 입력 오류검증
            if (!is통화) {
                this.setError(E_IBX_CURRENCY_INVALID);
                return E_IBX_CURRENCY_INVALID;
            }
        } else {

            // 잔액
            this.iSASInOut.Output.Result.잔액 = StrGrab(StrGrab(ResultStr, ">총잔액<", "</tr>"), "<td", "/td>");
            this.iSASInOut.Output.Result.잔액 = StrGrab(this.iSASInOut.Output.Result.잔액, ">", "<");
            this.iSASInOut.Output.Result.잔액 = this.iSASInOut.Output.Result.잔액.replace(/[\s,]/g, ""); //Remove Space New Line and ,
            this.iSASInOut.Output.Result.잔액 = StrTrim(this.iSASInOut.Output.Result.잔액);

            // 출금가능액
            this.iSASInOut.Output.Result.출금가능금액 = StrGrab(StrGrab(ResultStr, ">출금가능잔액<", "</tr>"), "<td", "/td>");
            this.iSASInOut.Output.Result.출금가능금액 = StrGrab(this.iSASInOut.Output.Result.출금가능금액, ">", "<");
            this.iSASInOut.Output.Result.출금가능금액 = this.iSASInOut.Output.Result.출금가능금액.replace(/[\s,]/g, ""); //Remove Space New Line and ,
            this.iSASInOut.Output.Result.출금가능금액 = StrTrim(this.iSASInOut.Output.Result.출금가능금액);

            if (!IsCurrency(this.iSASInOut.Output.Result.잔액) || !IsCurrency(this.iSASInOut.Output.Result.출금가능금액)) {
                this.setError(E_IBX_CURRENCY_NOT_CONVERT);
                return E_IBX_CURRENCY_NOT_CONVERT;
            }
        }

        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 빠른조회 빠른잔액조회 finally");
    }
};

빠른조회.prototype.빠른거래내역조회 = function(aInput) {
    this.log(BankName + " 빠른조회 빠른거래내역조회 호출 [" + aInput + "][" + moduleVersion + "]");
    var 거래Index = 0;
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        var input = dec(aInput.Input);
        if (input.계좌비밀번호) this.iSASInOut.Input.계좌비밀번호 = input.계좌비밀번호.replace(/./g, '*');
        if (input.주민사업자번호) this.iSASInOut.Input.주민사업자번호 = input.주민사업자번호.toString().replace(/./g, "*");

        var 계좌번호 = input.계좌번호;
        var 계좌비밀번호 = input.계좌비밀번호;
        var 조회시작일 = input.조회시작일;
        var 조회종료일 = input.조회종료일;
        var ID = input.ID;
        var 주민사업자번호 = input.주민사업자번호;

        var 통화 = input.통화 && input.통화.toUpperCase();
        if (!통화 || 통화 == 'KRW') 통화 = "";

        // 미입력 체크
        if (!ID && !주민사업자번호) {
            this.setError(E_IBX_USER_ACCOUNT_NOTENTER);
            return E_IBX_USER_ACCOUNT_NOTENTER;
        }

        // 8자리 입력 시 오류 없이 사용 (아이디 우선)
        if (!ID){
            if(주민사업자번호.length == 8){
                주민사업자번호 = 주민사업자번호.substr(2, 6);
            }
        }

        // 계좌번호 확인
        if (계좌번호 == "" || 계좌번호 == undefined) {
            this.setError(E_IBX_ACCOUNT_NO_NOTENTER);
            return E_IBX_ACCOUNT_NO_NOTENTER;
        }

        // 계좌번호 숫자/자리수 16자 이내 체크
        if (!/^\d{1,16}$/.test(계좌번호)) {
            this.setError(E_IBX_ACCOUNT_NO_INVALID);
            return E_IBX_ACCOUNT_NO_INVALID;
        }

        // 비밀번호 확인
        if (계좌비밀번호 == "" || 계좌비밀번호 == undefined) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_NOTENTER);
            return E_IBX_ACCOUNT_PASSWORD_NOTENTER;
        }

        // 비밀번호 숫자 & 자리수 4자
        if (!/^\d{4}$/.test(계좌비밀번호)) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_INVALID);
            return E_IBX_ACCOUNT_PASSWORD_INVALID;
        }

        // 날짜 확인
        if (조회시작일 == "") {
            this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
            return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
        }

        // 조회 시작일
        if (!/^\d{8}$/.test(조회시작일)) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
            return E_IBX_ENUM_DATE_BEGIN_INVALID;
        }
        // 조회 시작일 검증
        if (조회시작일 != (new Date(조회시작일.replace(/^(\d{4})(\d{2})(\d{2})$/, "$2/$3/$1")).yyyymmdd())) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
            return E_IBX_ENUM_DATE_BEGIN_INVALID;
        }

        if (조회종료일 == "") {
            this.setError(E_IBX_ENUM_DATE_END_NOTENTER);
            return E_IBX_ENUM_DATE_END_NOTENTER;
        }

        // 조회 종료일
        if (!/^\d{8}$/.test(조회종료일)) {
            this.setError(E_IBX_ENUM_DATE_END_INVALID);
            return E_IBX_ENUM_DATE_END_INVALID;
        }
        // 조회 종료일 검증
        if (조회종료일 != (new Date(조회종료일.replace(/^(\d{4})(\d{2})(\d{2})$/, "$2/$3/$1")).yyyymmdd())) {
            this.setError(E_IBX_ENUM_DATE_END_INVALID);
            return E_IBX_ENUM_DATE_END_INVALID;
        }

        // 조회기간오류
        if (조회시작일 > 조회종료일) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_GREATTHENEND);
            return E_IBX_ENUM_DATE_BEGIN_GREATTHENEND;
        }
        if (parseInt(조회종료일) > parseInt(new Date().yyyymmdd())) {
            this.setError(E_IBX_ENUM_DATE_END_FUTURE);
            return E_IBX_ENUM_DATE_END_FUTURE;
        }

        var 육개월전 = new Date();
        육개월전.setMonth(육개월전.getMonth() - 6);

        if (parseInt(조회시작일) < parseInt(육개월전.yyyymmdd())) {
            this.setError(E_IBX_ENUM_DATE_BEGIN_DENIED);
            return E_IBX_ENUM_DATE_BEGIN_DENIED;
        }

        if (통화 && 통화.length != 3) {
            this.setError(E_IBX_CURRENCY_INVALID);
            return E_IBX_CURRENCY_INVALID;
        }

        system.setStatus(IBXSTATE_LOGIN, 30);
        this.url = "/quics?page=C025255&cc=b028364:b028702&QSL=F";
        if (!httpRequest.get(this.host + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("Login: [" + ResultStr + "]");

        if (ResultStr.indexOf("사용자가 많아 잠시 후 이용하여") >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var tagName = StrGrab(ResultStr, "name='KEYPAD_TYPE_", "'");
        if (!tagName) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        // Main > 계좌조회
        system.setStatus(IBXSTATE_LOGIN, 40);

        // 주민사업자번호 입력 시, 주민사업자번호로 조회
        this.postData = "KEYPAD_TYPE_" + tagName + "=" + StrGrab(ResultStr, "name='KEYPAD_TYPE_" + tagName + "' value=\"", "\"");
        this.postData += "&KEYPAD_HASH_" + tagName + "=";
        this.postData += "&KEYPAD_USEYN_" + tagName + "=" + StrGrab(ResultStr, "name='KEYPAD_USEYN_" + tagName + "' value=\"", "\"");
        this.postData += "&KEYPAD_INPUT_" + tagName + "=" + httpRequest.URLEncode(StrGrab(ResultStr, "name='KEYPAD_INPUT_" + tagName + "' value=\"", "\""), "UTF-8");
        this.postData += "&signed_msg=";
        this.postData += "&" + httpRequest.URLEncode("요청키", "UTF-8") + "=";
        this.postData += "&" + httpRequest.URLEncode("계좌번호", "UTF-8") + "=" + 계좌번호;
        this.postData += "&" + httpRequest.URLEncode("조회시작일자", "UTF-8") + "=" + 조회시작일;
        this.postData += "&" + httpRequest.URLEncode("조회종료일", "UTF-8") + "=" + 조회종료일;
        this.postData += "&" + httpRequest.URLEncode("빠른조회", "UTF-8") + "=" + "Y";
        this.postData += "&" + httpRequest.URLEncode("조회계좌", "UTF-8") + "=" + 계좌번호;
        this.postData += "&" + httpRequest.URLEncode("비밀번호", "UTF-8") + "=" + 계좌비밀번호;
        this.postData += "&" + httpRequest.URLEncode("조회시작년", "UTF-8") + "=" + 조회시작일.substr(0, 4);
        this.postData += "&" + httpRequest.URLEncode("조회시작월", "UTF-8") + "=" + 조회시작일.substr(4, 2);
        this.postData += "&" + httpRequest.URLEncode("조회시작일", "UTF-8") + "=" + 조회시작일.substr(6, 2);
        this.postData += "&" + httpRequest.URLEncode("조회끝년", "UTF-8") + "=" + 조회종료일.substr(0, 4);
        this.postData += "&" + httpRequest.URLEncode("조회끝월", "UTF-8") + "=" + 조회종료일.substr(4, 2);
        this.postData += "&" + httpRequest.URLEncode("조회끝일", "UTF-8") + "=" + 조회종료일.substr(6, 2);
        this.postData += "&" + httpRequest.URLEncode("조회구분", "UTF-8") + "=" + "2"; // 전체
        this.postData += "&" + httpRequest.URLEncode("응답방법", "UTF-8") + "=" + "2"; // 최근
  
        if (ID) {
            this.postData += "&" + httpRequest.URLEncode("고객ID", "UTF-8") + "=" + ID.toUpperCase();
            this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=";
            this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=" + ID.toUpperCase();
            this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "1";
        } else {
            this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=" + 주민사업자번호;
            this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=";
            this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "2";
        }

        // ref: https://obank.kbstar.com/quics?page=C025255&cc=b028364:b028702&QSL=F
        var is외화 = false;
        if (계좌번호.length == 14) {
            if (계좌번호.substr(4, 2) == '68') {
                if (!통화) {
                    this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028795";
                } else {
                    is외화 = true;
                    this.url = "/quics?chgCompId=b028795&baseCompId=b028702&page=C025255&cc=b028702:b028795"; // 외화 계좌번호
                }
            } else if (계좌번호.substr(4, 3) == '497') {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b043371";
            } else {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028770";
            }
        } else if (계좌번호.length == 12) {
            if (계좌번호.substr(3, 2) == '42') {
                is외화 = true;
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028795"; // 외화 계좌번호
            } else if (계좌번호.substr(3, 2) == '17') {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b043371";
            } else {
                this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028770";
            }
        } else {
            this.url = "/quics?chgCompId=b028770&baseCompId=b028702&page=C025255&cc=b028702:b028770";
        }

        if (!this.url) {
            this.setError(E_IBX_ACCOUNT_NO_INVALID);
            return E_IBX_ACCOUNT_NO_INVALID;
        }

        if (통화 && !is외화) { // 통화 입력하는 경우 외화 통화만 지원함
            this.setError(E_IBX_CURRENCY_INVALID);
            return E_IBX_CURRENCY_INVALID;
        }

        if (!httpRequest.post(this.host + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("result: [" + ResultStr + "]");

        /*{
            "[계좌번호] 값은 필수항목 입니다" 오전 9시 이전 조회시 국민은행 사이트 장애로 재통신 로직 추가.
            재통신 후에도 동일한 오류 발생시 서버오류처리함(80002F30)
        }*/
        if (StrGrab(ResultStr, 'id="errCd">', '</').indexOf("CBN13000") >= 0) {
            if (!httpRequest.post(this.host + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("result_re: [" + ResultStr + "]");
        }

        // 오류 확인
        if (ResultStr.indexOf("조회하실 내역이 없습니다") >= 0) {
            this.setError(I_IBX_RESULT_NOTPRESENT);
            return I_IBX_RESULT_NOTPRESENT;
        }
        if (ResultStr.indexOf("조회가능한 예금종류가 아닙니다") >= 0) {
            this.setError(E_IBX_ACCOUNT_NO_WRITEONLY);
            return E_IBX_ACCOUNT_NO_WRITEONLY;
        }
        if ((ResultStr.indexOf("해당계좌는 빠른서비스 조회계좌로 등록되지않았습니다") >= 0) ||
            (ResultStr.indexOf("해당 계좌는 빠른조회 서비스 이용계좌로 등록되지 않았습니다") >= 0) ||
            (ResultStr.indexOf("빠른조회서비스 미등록 계좌입니다") >= 0) ||
            (ResultStr.indexOf("해당계좌는 빠른서비스 조회계좌 이미해지되었습니다") >= 0)) {
            this.setError(E_IBX_SERVICE_DENIED_2);
            return E_IBX_SERVICE_DENIED_2;
        }
        if ((ResultStr.indexOf("입력한 계좌번호는 존재하지") >= 0) ||
            (ResultStr.indexOf("계좌번호가일치하지않읍니다") >= 0) ||
            (ResultStr.indexOf("계좌번호가 일치하지 않습니다") >= 0) ||
            (ResultStr.indexOf("계좌번호가 빠른조회서비스에 등록되어 있지 않습니다") >= 0) ||
            (ResultStr.indexOf("이용이 불가능한 계좌이거나 메뉴선택이 잘못 되었습니다") >= 0) ||
            (ResultStr.indexOf("적립식원장이 존재하지 않습니다") >= 0) ||
            (ResultStr.indexOf("(UKHC6111)") >= 0) ||
            (ResultStr.indexOf("계좌번호 오류입니다") >= 0) ||
            (ResultStr.indexOf("계좌번호 입력 오류입니다.") >= 0) ||
            (ResultStr.indexOf("올바른 계좌번호를 입력하여 주십시오") >= 0) ||
            (ResultStr.indexOf("계좌번호가 잘못 입력되었습니다") >= 0)) {
            this.setError(E_IBX_ACCOUNT_NO_INVALID);
            return E_IBX_ACCOUNT_NO_INVALID;
        }
        if (ResultStr.indexOf("이용이불가능한계좌") >= 0) {
            this.setError(E_IBX_USER_ACCOUNT_DENIED);
            return E_IBX_USER_ACCOUNT_DENIED;
        }

        if ((ResultStr.indexOf("본인의 주민등록번호 또는 사업자번호를 잘못입력하셨습니다") >= 0) ||
            (ResultStr.indexOf("계좌번호또는주민등록(사업자)번호가일치하지않습니다") >= 0) ||
            (ResultStr.indexOf("계좌번호 또는 주민등록(사업자)번호가 일치하지 않습니다") >= 0) ||
            (ResultStr.indexOf("주민번호 또는 사업자 번호를 정확히 입력하십시오") >= 0) || // 아이디 틀릴때에도 동일한 메세지 나옴
            (ResultStr.indexOf("주민등록번호가 다릅니다") >= 0) ||
            (ResultStr.indexOf("본인명의의 계좌만 조회 및 거래가 가능합니다") >= 0)) { // 계좌번호, 계좌비밀번호, 사업자번호 오류 시 동일한 오류 메세지
            this.setError(E_IBX_REGNO_RESIDENT_INVALID);
            return E_IBX_REGNO_RESIDENT_INVALID;
        }

        // 입력파라미터 오류(지금까지는 전부 아이디 오류였음)
        if ((ResultStr.indexOf("[오류코드:Z491") >= 0) ||
            (ResultStr.indexOf("업무처리 오류입니다") >= 0)) {
            this.setError(E_IBX_USER_ACCOUNT_INVALID);
            return E_IBX_USER_ACCOUNT_INVALID;
        }
        if ((ResultStr.indexOf("고객아이디가 없거나") >= 0) ||
            (ResultStr.indexOf("해지된 사용자 ID입니다") >= 0) ||
            (ResultStr.indexOf("서브아이디로는 거래가 불가합니다") >= 0) ||
            (ResultStr.indexOf("로그인하신 ID가 유효하지 않습니다") >= 0) ||
            (ResultStr.indexOf("(UKFK0166)") >= 0) ||
            (ResultStr.indexOf("사용자ID를 확인하여 입력해 주십시오") >= 0) ||
            (ResultStr.indexOf("인터넷뱅킹ID는 영문과 숫자만 입력가능합니다.") >= 0)) {
            this.setError(E_IBX_KEY_ACCOUNT_INFO_2_INVALID);
            return E_IBX_KEY_ACCOUNT_INFO_2_INVALID;
        }
        if (ResultStr.indexOf("지연되고 있습니다.") >= 0) {
            this.setError(E_IBX_SERVICE_SERVERBUSY);
            return E_IBX_SERVICE_SERVERBUSY;
        }
        if ((ResultStr.indexOf("비밀번호 4회 이상 오류") >= 0) ||
            (ResultStr.indexOf("계좌 비밀번호가 4회 오류") >= 0)) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_DENIED);
            return E_IBX_ACCOUNT_PASSWORD_DENIED;
        }
        if ((ResultStr.indexOf("비밀번호 3회이상오류") >= 0) ||
            (ResultStr.indexOf("비밀번호 3회 오류입니다") >= 0)) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_JUSTBEFOREDENY);
            return E_IBX_ACCOUNT_PASSWORD_JUSTBEFOREDENY;
        }

        if ((ResultStr.indexOf("회 오류입력되었습니다") >= 0) ||
            (ResultStr.indexOf("회 오류 입력되었습니다") >= 0) ||
            (ResultStr.indexOf("회 오류 입력 되었습니다") >= 0) ||
            (ResultStr.indexOf("비밀번호 1회오류 등록") >= 0) || 
            (ResultStr.indexOf("비밀번호 2회오류 등록") >= 0) ||
            (ResultStr.indexOf("계좌 비밀번호 1회오류 및 2회오류가 등록되었습니다") >= 0)) {
            this.setError(E_IBX_ACCOUNT_PASSWORD_INVALID);
            return E_IBX_ACCOUNT_PASSWORD_INVALID;
        }

        if ((ResultStr.indexOf("서비스 장애 중 입니다.") >= 0) ||
            (ResultStr.indexOf("사용자가 많아 잠시 후 이용하여") >= 0) ||
            (ResultStr.indexOf("은행 HOST쪽에 데이타 수신 오류입니다") >= 0) ||
            (ResultStr.indexOf("일자 전환 중 잠시 후 거래하여 주시기 바랍니다.") >= 0) ||
            (ResultStr.indexOf("해당거래는 시스템 작업으로 인해 잠시 거래제한되었습니다.") >= 0) ||
            (StrGrab(ResultStr, 'id="errCd">', '</').indexOf("CBN13000") >= 0)) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        if ((ResultStr.indexOf("(EMCITBC007)") >= 0) ||
            (ResultStr.indexOf("지금은 일자전환 및 거래제한으로 인해 잠시 동안 서비스가 불가합니다") >= 0) ||
            (ResultStr.indexOf("현재는 시스템 정기점검 작업 시간입니다") >= 0)) {
            this.setError(E_IBX_SERVICE_NOTIME);
            return E_IBX_SERVICE_NOTIME;
        }

        if ((ResultStr.indexOf("휴면계좌") >= 0) ||
            (ResultStr.indexOf("존재하지 않거나") >= 0)) {
            this.setError(E_IBX_ACCOUNT_NO_MISC);
            return E_IBX_ACCOUNT_NO_MISC;
        }

        if (ResultStr.indexOf('거래내역조회 신청이 불가능합니다') > -1) {
            this.setError(E_IBX_ACCOUNT_NO_MISC);
            this.iSASInOut.Output.ErrorMessage = "계좌번호가 올바르게 입력되었는지 확인해 주세요. CMS계좌, 증권통장, 중도금계좌, 아파트관리비통장, 가상계좌는 거래내역조회 신청이 불가능합니다.";
            return E_IBX_ACCOUNT_NO_MISC;
        } 

        // 개인고객 & 로그인 패스워드 오류초과
        if ((ResultStr.indexOf("사용자암호가 3회 입력오류") >= 0) ||
            (ResultStr.indexOf("사용자암호 3회 입력오류") >= 0) ||
            (ResultStr.indexOf("사용자 암호가 3회 연속 오류") >= 0) ||
            (ResultStr.indexOf("사용자 암호 오류 해제 후") >= 0)) {
            this.setError(E_IBX_USER_PASSWORD_DENIED);
            return E_IBX_USER_PASSWORD_DENIED;
        }

        if (ResultStr.indexOf("조회가능한 예금종류가 아닙니다.") >= 0) {
            this.setError(E_IBX_ACCOUNT_CLASS_INVALID);
            return E_IBX_ACCOUNT_CLASS_INVALID;
        }

        if (ResultStr.indexOf("10분이 경과되어 고객님의 안전한 금융거래를 위해 자동 종료되었습니다") >= 0) {
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }

        if (StrGrab(ResultStr, '<div id="errorDiv"', '">').indexOf("display:block") >= 0) {
            this.setError(E_IBX_UNKNOWN);
            return E_IBX_UNKNOWN;
        }

        // 수시거래내역조회
        var 수시거래내역조회 = [];
        거래Index = 0;
        var subItem = {};
        var items = {};
        var resIndex = 1;
        var PageCount = 1;
        var resTemp = "";
        var 거래구분 = '';
        var is통화 = false;
        var HeaderBlock = '';
        var 내역정렬순서 = '0';
        var CheckResult = '';

        if (통화) {
            while (true) {
                // 계좌조회 페이지
                system.setStatus(IBXSTATE_RESULT, 70);

                // 헤더 오류체크
                HeaderBlock = StrGrab(ResultStr, ">거래일시<", "/thead>");
                HeaderBlock = StrReplace(HeaderBlock, "&nbsp;", "");
                if ((StrGrab(HeaderBlock, '<th', '/th>', 1).indexOf("거래구분") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 2).indexOf("통화코드") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 3).indexOf("외화금액") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 4).indexOf("잔액") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 5).indexOf("적요") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 6).indexOf("취소구분") < 0)) {
                    this.setError(E_IBX_SITE_INVALID + 1);
                    return E_IBX_SITE_INVALID + 1;
                }

                ResultBlock = StrGrab(StrGrab(ResultStr, '>취소구분<', '</table>'), '<tbody>', '</tbody>');
                if (!ResultBlock) {
                    this.setError(E_IBX_SITE_INVALID + 2);
                    return E_IBX_SITE_INVALID + 2;
                }

                var AmtArray = [];
                var AmtItem = {};
                resIndex = 1;
                while (true) {
                    resTemp = StrGrab(ResultBlock, "<tr", "</tr>", resIndex++);
                    if (!resTemp || resTemp.indexOf(">소계<") > -1) { break; }

                    items = {};

                    // 거래일자
                    items.거래일자 = StrGrab(StrGrab(resTemp, '<td', '/td>'), '>', '<');
                    items.거래일자 = StrReplace(items.거래일자, '.', '');
                    items.거래일자 = items.거래일자.replace(/\s/g, '');
                    items.거래일자 = StrTrim(items.거래일자);

                    // 거래시각
                    items.거래시각 = '';

                    // 통화코드
                    items.통화코드 = StrGrab(StrGrab(resTemp, '<td', '/td>', 3), '>', '<');
                    items.통화코드 = items.통화코드.replace(/\s/g, '');
                    items.통화코드 = StrTrim(items.통화코드);

                    if (items.통화코드 && (통화 != items.통화코드)) { continue; }
                    is통화 = true; 

                    거래구분 = StrGrab(StrGrab(resTemp, '<td', '/td>', 2), '>', '<');
                    거래구분 = 거래구분.replace(/\s/g, '');
                    거래구분 = StrTrim(거래구분);

                    // 출금액, 입금액
                    if (거래구분.indexOf('출금') > -1) {
                        items.출금액 = StrGrab(StrGrab(resTemp, '<td', '/td>', 4), '>', '<');
                        items.출금액 = StrReplace(items.출금액, ',', '');
                        items.출금액 = items.출금액.replace(/\s/g, '');
                        items.출금액 = StrTrim(items.출금액);

                        items.입금액 = '0';
                    } else if (거래구분.indexOf('입금') > -1) {
                        items.출금액 = '0';

                        items.입금액 = StrGrab(StrGrab(resTemp, '<td', '/td>', 4), '>', '<');
                        items.입금액 = StrReplace(items.입금액, ',', '');
                        items.입금액 = items.입금액.replace(/\s/g, '');
                        items.입금액 = StrTrim(items.입금액);
                    } else {
                        // 확인 필요
                        this.setError(E_IBX_SITE_INVALID + 3);
                        return E_IBX_SITE_INVALID + 3;
                    }

                    // 거래후잔액
                    items.거래후잔액 = StrGrab(StrGrab(resTemp, '<td', '/td>', 5), '>', '<');
                    items.거래후잔액 = StrReplace(items.거래후잔액, ',', '');
                    items.거래후잔액 = items.거래후잔액.replace(/\s/g, '');
                    items.거래후잔액 = StrTrim(items.거래후잔액);

                    // 잔액 없는 통화 입력되는 경우, 800032B1 (잘못된 통화)
                    if (!items.거래후잔액) {
                        this.setError(E_IBX_CURRENCY_INVALID);
                        return E_IBX_CURRENCY_INVALID;
                    }

                    // 기재사항1
                    items.기재사항1 = StrGrab(StrGrab(resTemp, '<td', '/td>', 6), '>', '<');
                    items.기재사항1 = items.기재사항1.replace(/\s/g, '');
                    items.기재사항1 = StrTrim(items.기재사항1);

                    // 기재사항2
                    items.기재사항2 = 거래구분;

                    // 거래수단1
                    items.거래수단1 = StrGrab(StrGrab(resTemp, '<td', '/td>', 7), '>', '<');
                    items.거래수단1 = items.거래수단1.replace(/\s/g, '');
                    items.거래수단1 = StrTrim(items.거래수단1);

                    // 거래수단2
                    items.거래수단2 = '';

                    // 계좌번호
                    items.계좌번호 = 계좌번호;

                    // Check Result;
                    if (!IsCurrency(items.거래일자) || items.거래일자.length != 8 || !items.통화코드 || !items.기재사항1) {
                        this.log("2F10_오류_1: " + JSON.stringify(items));
                        this.setError(E_IBX_RESULT_FAIL);
                        return E_IBX_RESULT_FAIL;
                    }

                    if (!IsCurrency(items.출금액) || !IsCurrency(items.입금액) || !IsCurrency(items.거래후잔액)) {
                        this.log("2470_오류_1: " + JSON.stringify(items));
                        this.setError(E_IBX_CURRENCY_NOT_CONVERT);
                        return E_IBX_CURRENCY_NOT_CONVERT;
                    }

                    if (JSON.stringify(subItem) == JSON.stringify(items)) {
                        this.setError(E_IBX_RESULT_VERFY_FAIL);
                        return E_IBX_RESULT_VERFY_FAIL;
                    } else {
                        subItem = items;
                    }

                    if (PageCount == 1 && resIndex < 8) {
                        AmtItem = {};
                        AmtItem.출금액 = items.출금액;
                        AmtItem.입금액 = items.입금액;
                        AmtItem.거래후잔액 = items.거래후잔액;
                        AmtArray.push(AmtItem);

                        CheckResult = this.CheckResultOrder(AmtArray, 내역정렬순서); // 0 최근거래순, 1 과거거래순
                        if (CheckResult != S_IBX_OK) {
                            this.setError(CheckResult);
                            return CheckResult;
                        }
                    }

                    수시거래내역조회[거래Index++] = items;
                }

                // 다음페이지***
                if ((ResultStr.indexOf('onclick="gotoNextPage();') >= 0) || (ResultStr.indexOf("onclick='gotoNextPage(\"\");") >= 0)) {
                    system.setStatus(IBXSTATE_PASERNEXT, 85);

                    PageCount++;

                    this.postData = 'lastReqTime=' + StrGrab(ResultStr, "name=\"lastReqTime\" value='", "'");
                    this.postData += '&signed_msg=';
                    this.postData += '&' + httpRequest.URLEncode('요청키') + '=';
                    this.postData += '&' + httpRequest.URLEncode('계좌번호') + '=' + 계좌번호;
                    this.postData += '&' + httpRequest.URLEncode('조회시작일자') + '=' + 조회시작일;
                    this.postData += '&' + httpRequest.URLEncode('조회종료일') + '=' + 조회종료일;
                    this.postData += '&' + httpRequest.URLEncode('빠른조회') + '=' + 'Y';
                    this.postData += '&s_pageKeyValue=';
                    this.postData += '&s_presentNum=' + PageCount.toString();
                    this.postData += '&' + httpRequest.URLEncode('다음거래년월일키') + '=' + StrGrab(ResultStr, 'var strNextYM   = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('다음거래일련번호키') + '=' + StrGrab(ResultStr, 'var strNextSeq  = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('이전다음거래년월일키') + '=' + StrGrab(ResultStr, 'var strBackKey1 = "', '"') + '%7C' + StrGrab(ResultStr, 'var strReqKey1  = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('이전다음거래일련번호키') + '=' + StrGrab(ResultStr, 'var strBackKey2 = "', '"') + '%7C' + StrGrab(ResultStr, 'var strReqKey2  = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('조회시작년') + '=' + 조회시작일.substr(0, 4);
                    this.postData += '&' + httpRequest.URLEncode('조회시작월') + '=' + 조회시작일.substr(4, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회시작일') + '=' + 조회시작일.substr(6, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회끝년') + '=' + 조회종료일.substr(0, 4);
                    this.postData += '&' + httpRequest.URLEncode('조회끝월') + '=' + 조회종료일.substr(4, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회끝일') + '=' + 조회종료일.substr(6, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회구분') + '=' + '2'; // 전체
                    this.postData += '&' + httpRequest.URLEncode('응답방법') + '=' + '2'; // 최근

                    if (ID) {
                        this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=";
                        this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=" + ID.toUpperCase();
                        this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "1";
                    } else {
                        this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=" + 주민사업자번호;
                        this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=";
                        this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "2";
                    }

                    if (!httpRequest.post(this.host + this.url, this.postData)) {
                        this.setError(E_IBX_FAILTOGETPAGE);
                        return E_IBX_FAILTOGETPAGE;
                    }
                    ResultStr = httpRequest.result;
                    this.log("ResultStr: [" + ResultStr + "]");

                    if (ResultStr.indexOf("사용자가 많아 잠시 후 이용하여") >= 0) {
                        this.setError(E_IBX_SITE_INTERNAL);
                        return E_IBX_SITE_INTERNAL;
                    }
                    if (ResultStr.indexOf("10분이 경과되어 고객님의 안전한 금융거래를 위해 자동 종료되었습니다") >= 0) {
                        this.setError(E_IBX_SESSION_CLOSED);
                        return E_IBX_SESSION_CLOSED;
                    }

                } else break;
            }
            // 통화 입력 오류검증
            if (!is통화) {
                this.setError(E_IBX_CURRENCY_INVALID);
                return E_IBX_CURRENCY_INVALID;
            }
        } else {
            while (true) {
                // 계좌조회 페이지
                system.setStatus(IBXSTATE_RESULT, 70);

                // 헤더 오류체크
                HeaderBlock = StrGrab(ResultStr, ">거래일시<", "/thead>");
                HeaderBlock = StrReplace(HeaderBlock, "&nbsp;", "");
                if ((StrGrab(HeaderBlock, '<th', '/th>', 1).indexOf("적요") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 2).indexOf("내통장표시내용") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 3).indexOf("출금금액") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 4).indexOf("입금금액") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 5).indexOf("잔액") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 6).indexOf("거래점") < 0) ||
                    (StrGrab(HeaderBlock, '<th', '/th>', 7).indexOf("구분") < 0)) {
                    this.setError(E_IBX_SITE_INVALID + 1);
                    return E_IBX_SITE_INVALID + 1;
                }

                ResultBlock = StrGrab(StrGrab(ResultStr, '>구분<', '</table>'), '<tbody>', '</tbody>');
                if (!ResultBlock) {
                    this.setError(E_IBX_SITE_INVALID + 2);
                    return E_IBX_SITE_INVALID + 2;
                }

                var AmtArray = [];
                var AmtItem = {};
                resIndex = 1;
                while (true) {
                    resTemp = StrGrab(ResultBlock, "<tr>", "</tr>", resIndex++); // Row
                    resTemp += StrGrab(ResultBlock, "<tr>", "</tr>", resIndex++); // Row
                    if (!(resTemp) || (resTemp.indexOf(">소계<") > 0)) {
                        break;
                    }

                    items = {};

                    // 거래일자
                    items.거래일자 = StrGrab(StrGrab(resTemp, '<td', '/td>'), '>', '<');
                    items.거래일자 = StrReplace(items.거래일자, '.', '');
                    items.거래일자 = items.거래일자.replace(/\s/g, '');
                    items.거래일자 = StrTrim(items.거래일자);

                    // 거래시각
                    items.거래시각 = StrGrab(StrGrab(resTemp, '<td', '/td>'), '/>', '<');
                    items.거래시각 = StrReplace(items.거래시각, ':', '');
                    items.거래시각 = items.거래시각.replace(/\s/g, '');
                    items.거래시각 = StrTrim(items.거래시각);

                    // 통화코드
                    items.통화코드 = '';

                    // 출금액
                    items.출금액 = StrGrab(StrGrab(resTemp, '<td', '/td>', 4), '>', '<');
                    items.출금액 = StrReplace(StrReplace(items.출금액, ',', ''), '　', '');
                    items.출금액 = items.출금액.replace(/\s/g, '');
                    items.출금액 = StrTrim(items.출금액);
                    if (items.출금액 == "") {
                        items.출금액 = '0';
                    }

                    // 입금액
                    items.입금액 = StrGrab(StrGrab(resTemp, '<td', '/td>', 5), '>', '<');
                    items.입금액 = StrReplace(StrReplace(items.입금액, ',', ''), '　', '');
                    items.입금액 = items.입금액.replace(/\s/g, '');
                    items.입금액 = StrTrim(items.입금액);
                    if (items.입금액 == "") {
                        items.입금액 = '0';
                    }

                    // 거래후잔액
                    items.거래후잔액 = StrGrab(StrGrab(resTemp, '<td', '/td>', 6), '>', '<');
                    items.거래후잔액 = StrReplace(StrReplace(items.거래후잔액, ',', ''), '　', '');
                    items.거래후잔액 = items.거래후잔액.replace(/\s/g, '');
                    items.거래후잔액 = StrTrim(items.거래후잔액);
                    if (items.거래후잔액 == "") {
                        items.거래후잔액 = '0';
                    }

                    // 기재사항1
                    // 내통장표시내용 항목에 값이 있으면 내통장표시내용으로 결과처리, 없으면 의뢰인/수취인항목 결과처리
                    items.기재사항1 = StrTrim(StrReplace(StrGrab(StrGrab(resTemp, '<td', 'td>', 3), '>', '</'), '&nbsp;', ''));
                    if (!items.기재사항1) {
                        items.기재사항1 = StrTrim(StrReplace(StrGrab(StrGrab(resTemp, '<td', 'td>', 9), '>', '</'), '&nbsp;', ''));
                    }
                    items.기재사항1 = StrReplace(items.기재사항1, '&amp;', '&');

                    // 기재사항2
                    items.기재사항2 = StrTrim(StrGrab(StrGrab(resTemp, '<td', '/td>', 8), '>', '<')).replace(/(?:\\\[rnt]|[\r\n\t\s\　]+)+/g, "");

                    // 거래수단1
                    items.거래수단1 = StrGrab(StrGrab(resTemp, '<td', '/td>', 7), '>', '<');
                    items.거래수단1 = StrReplace(items.거래수단1, '　', '');
                    items.거래수단1 = items.거래수단1.replace(/\s/g, '');
                    items.거래수단1 = StrTrim(items.거래수단1);

                    // 거래수단2
                    items.거래수단2 = StrGrab(StrGrab(resTemp, '<td', '/td>', 2), '>', '<');
                    items.거래수단2 = StrReplace(items.거래수단2, '&nbsp;', '');
                    items.거래수단2 = items.거래수단2.replace(/\s/g, '');
                    items.거래수단2 = StrTrim(items.거래수단2);

                    // 계좌번호
                    items.계좌번호 = 계좌번호;

                    // Check Result;
                    if (!IsCurrency(items.거래일자) || items.거래일자.length != 8 || (items.거래시각 && (!IsCurrency(items.거래시각) || items.거래시각.length != 6))) {
                        this.log("2F10_오류_2: " + JSON.stringify(items));
                        this.setError(E_IBX_RESULT_FAIL);
                        return E_IBX_RESULT_FAIL;
                    }

                    if (!IsCurrency(items.출금액) || !IsCurrency(items.입금액) || !IsCurrency(items.거래후잔액)) {
                        this.log("2470_오류_2: " + JSON.stringify(items));
                        this.setError(E_IBX_CURRENCY_NOT_CONVERT);
                        return E_IBX_CURRENCY_NOT_CONVERT;
                    }

                    if (JSON.stringify(subItem) == JSON.stringify(items)) {
                        this.setError(E_IBX_RESULT_VERFY_FAIL);
                        return E_IBX_RESULT_VERFY_FAIL;
                    } else {
                        subItem = items;
                    }

                    if (PageCount == 1 && resIndex < 8) {
                        AmtItem = {};
                        AmtItem.출금액 = items.출금액;
                        AmtItem.입금액 = items.입금액;
                        AmtItem.거래후잔액 = items.거래후잔액;
                        AmtArray.push(AmtItem);

                        CheckResult = this.CheckResultOrder(AmtArray, 내역정렬순서); // 0 최근거래순, 1 과거거래순
                        if (CheckResult != S_IBX_OK) {
                            this.setError(CheckResult);
                            return CheckResult;
                        }
                    }

                    수시거래내역조회[거래Index++] = items;
                }

                // 다음페이지***
                if ((ResultStr.indexOf('onclick="gotoNextPage();') >= 0) || (ResultStr.indexOf("onclick='gotoNextPage(\"\");") >= 0)) {
                    system.setStatus(IBXSTATE_PASERNEXT, 85);

                    PageCount++;

                    this.postData = 'lastReqTime=' + StrGrab(ResultStr, "name=\"lastReqTime\" value='", "'");
                    this.postData += '&signed_msg=';
                    this.postData += '&' + httpRequest.URLEncode('요청키') + '=';
                    this.postData += '&' + httpRequest.URLEncode('계좌번호') + '=' + 계좌번호;
                    this.postData += '&' + httpRequest.URLEncode('조회시작일자') + '=' + 조회시작일;
                    this.postData += '&' + httpRequest.URLEncode('조회종료일') + '=' + 조회종료일;
                    this.postData += '&' + httpRequest.URLEncode('빠른조회') + '=' + 'Y';
                    this.postData += '&s_pageKeyValue=';
                    this.postData += '&s_presentNum=' + PageCount.toString();
                    this.postData += '&' + httpRequest.URLEncode('다음거래년월일키') + '=' + StrGrab(ResultStr, 'var strNextYM   = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('다음거래일련번호키') + '=' + StrGrab(ResultStr, 'var strNextSeq  = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('이전다음거래년월일키') + '=' + StrGrab(ResultStr, 'var strBackKey1 = "', '"') + '%7C' + StrGrab(ResultStr, 'var strReqKey1  = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('이전다음거래일련번호키') + '=' + StrGrab(ResultStr, 'var strBackKey2 = "', '"') + '%7C' + StrGrab(ResultStr, 'var strReqKey2  = "', '"');
                    this.postData += '&' + httpRequest.URLEncode('조회시작년') + '=' + 조회시작일.substr(0, 4);
                    this.postData += '&' + httpRequest.URLEncode('조회시작월') + '=' + 조회시작일.substr(4, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회시작일') + '=' + 조회시작일.substr(6, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회끝년') + '=' + 조회종료일.substr(0, 4);
                    this.postData += '&' + httpRequest.URLEncode('조회끝월') + '=' + 조회종료일.substr(4, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회끝일') + '=' + 조회종료일.substr(6, 2);
                    this.postData += '&' + httpRequest.URLEncode('조회구분') + '=' + '2'; // 전체
                    this.postData += '&' + httpRequest.URLEncode('응답방법') + '=' + '2'; // 최근

                    if (ID) {
                        this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=";
                        this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=" + ID.toUpperCase();
                        this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "1";
                    } else {
                        this.postData += "&" + httpRequest.URLEncode("주민사업자번호", "UTF-8") + "=" + 주민사업자번호;
                        this.postData += "&" + httpRequest.URLEncode("고객식별번호", "UTF-8") + "=";
                        this.postData += "&" + httpRequest.URLEncode("검색구분", "UTF-8") + "=" + "2";
                    }

                    if (!httpRequest.post(this.host + this.url, this.postData)) {
                        this.setError(E_IBX_FAILTOGETPAGE);
                        return E_IBX_FAILTOGETPAGE;
                    }
                    ResultStr = httpRequest.result;
                    this.log("ResultStr: [" + ResultStr + "]");

                    if (ResultStr.indexOf("사용자가 많아 잠시 후 이용하여") >= 0) {
                        this.setError(E_IBX_SITE_INTERNAL);
                        return E_IBX_SITE_INTERNAL;
                    }
                    if (ResultStr.indexOf("10분이 경과되어 고객님의 안전한 금융거래를 위해 자동 종료되었습니다") >= 0) {
                        this.setError(E_IBX_SESSION_CLOSED);
                        return E_IBX_SESSION_CLOSED;
                    }

                } else break;
            }
        }
        if (수시거래내역조회.length == 0) {
            this.setError(I_IBX_RESULT_NOTPRESENT);
            return I_IBX_RESULT_NOTPRESENT;
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.내역정렬순서 = 내역정렬순서; // 0 최근거래순, 1 과거거래순
        this.iSASInOut.Output.Result.빠른거래내역조회 = 수시거래내역조회;
        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " 빠른조회 빠른거래내역조회 finally");
    }
};
///////////////////////////////////////////////////////////////////////////////////////////
//include 등등 필요한거 설정.
function OnInit() {
    console.log("OnInit()");
    try {
        //필요한거 로드
        // system.include("iSASTypes");
        // system.include("sas/sas");

        // 2021.02.08
        if (!system.include("iSASTypes")) {
            sleep(500);
            console.log('iSASTypes_Boolean : [' + system.include("iSASTypes") + ']');
        }
        if (!system.include("sas/sas")) {
            sleep(500);
            console.log('sas_Boolean : [' + system.include("sas/sas") + ']');
        }
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