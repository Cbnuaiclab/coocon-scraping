// 사업자등록신청 (Bisiness Registration Application)
PC조회발급서비스.prototype.사업자등록신청 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청 호출 [" + moduleVersion + "]");
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }
        this.chkStep3 = '';
        this.사업자등록신청_조회구분 = '';
        this.is임대차 = false;
        this.is사이버몰 = false;
        this.is서류송달 = false;
        this.기본정보 = {};
        this.임대차정보 = {};
        this.JsonResult = {};
        this.사업특성선택사항 = {};

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.storageData = {};
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        var input = aInput.Input;
        var 조회구분 = input.조회구분;

        if (!조회구분) {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_NOTENTER);
            return E_IBX_A124X1_INQUIRY_TYPE_NOTENTER;
        }

        // 1: 신규작성 
        // 2: 불러오기(작성 중인 신청서 불러오기)
        if (["1", "2"].indexOf(조회구분) < 0) {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
            return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
        }

        /*
        ** 로그인은 공통사항
        1. 신규작성: 특성입력조회 -> 특성입력 -> 정보입력조회 -> 정보 업데이트 필요시 정보입력조회 추가 호출 가능
        2. 불러오기
           1) 단순히 작성한 내용 불러오기(저장X): 정보입력조회 (입력구분 0000)
           2) 저장된 내용에서 정보 업데이트하기 : 정보입력조회 (입력구분 0000 이외) -> 정보 업데이트 필요시 정보입력조회 추가 호출 가능
              - 2) 항목의 경우 정보입력조회에 업데이트 한 정보이외에는 기존 정보 유지 
                ex) 입력구분 0100 입력 시 사업장소재지정보만 업데이트. 이외 내용은 기존 저장된 내용으로 유지
        */
        if (조회구분 == '2') {
            this.userAgent = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

            system.setStatus(IBXSTATE_ENTER, 50);
            this.url = '/permission.do?screenId=UTEABAAA59';
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log("session_1: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            system.setStatus(IBXSTATE_ENTER, 60);

            // 세션정보
            if (httpRequest.postWithUserAgent(this.userAgent, 'https://hometax.go.kr/token.do', "{}") == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("token: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            try {
                var JsonResult = JSON.parse(ResultStr);
            } catch (e) {
                this.log("exception_1:[" + e.message + "]");
                this.setError(E_IBX_SITE_INVALID);
                return E_IBX_SITE_INVALID;
            }

            system.setStatus(IBXSTATE_ENTER, 70);

            postData = {};
            postData.userClCd = JsonResult.userClCd;
            postData.ssoToken = JsonResult.ssoToken;
            postData.txaaAdmNo = JsonResult.txaaAdmNo;
            postData.popupYn = false;

            this.postData = JSON.stringify(postData);
            this.url = '/permission.do?screenId=UTEABAAA59&domain=hometax.go.kr';
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("session_2: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('권한이 없는 화면입니다') >= 0) {
                this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
                return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            PC조회발급서비스homeTaxSession.setSession(ResultStr);
            this.PC조회발급서비스homeTaxSession = PC조회발급서비스homeTaxSession;

            system.setStatus(IBXSTATE_ENTER, 75);

            this.url = '/wqAction.do?actionId=ATTABZAA001R01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
            postData = {};
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;
            postData.cvaId = '';
            postData.cvaKndCd = 'A2004';
            postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;
    
            this.postData = JSON.stringify(postData);
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('사업자등록신청_1 :: [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            try {
                JsonResult = JSON.parse(ResultStr).ntplBscInfrInqrDVO;
            } catch (e) {
                this.log("exception_2:[" + e.message + "]");
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }
            this.본인주소정보 = JsonResult;

            system.setStatus(IBXSTATE_EXECUTE, 80);

            this.url = '/wqAction.do?actionId=ATEABAAA006R06&screenId=UTEABAAA59&popupYn=false&realScreenId=';
            postData = {};
            postData.bmanRgtClCd = '01';    // 신청등록
            postData.cvaId = '';
            postData.cvaKndCd = 'A2004';
            postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;

            this.postData = JSON.stringify(postData);
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('사업자등록신청_2 :: [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }
            try {
                JsonResult = JSON.parse(ResultStr);
                var waitCvaIdList = JsonResult.waitCvaIdList;
            } catch (e) {
                this.log("exception_3:[" + e.message + "]");
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }

            // 저장된 내역이 없을 때
            if (!waitCvaIdList || waitCvaIdList == 0) {
                this.setError(I_IBX_RESULT_NOTPRESENT);
                return I_IBX_RESULT_NOTPRESENT;
            }

            this.JsonResult = JsonResult;
            this.chkStep3 = '3';
        }else{
            this.chkStep3 = '1';
        }
        this.사업자등록신청_조회구분 = 조회구분;

        system.setStatus(IBXSTATE_RESULT, 90);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_사업특성입력조회 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_사업특성입력조회 호출 [" + moduleVersion + "]");
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        // 사업자등록신청(조회구분 1) 호출 후 사용가능.
        if (this.chkStep3 != '1') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            this.iSASInOut.Output.ErrorMessage = "사업자등록신청 단계부터 재실행해 주십시오.";
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }

        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = aInput.Input;

        if (input.휴대전화번호) this.iSASInOut.Input.휴대전화번호 = input.휴대전화번호.replace(/./g, "*");
        if (input.사업장전화번호) this.iSASInOut.Input.사업장전화번호 = input.사업장전화번호.replace(/./g, "*");
        if (input.자택전화번호) this.iSASInOut.Input.자택전화번호 = input.자택전화번호.replace(/./g, "*");
        // if (input.전자메일주소) this.iSASInOut.Input.전자메일주소 = input.전자메일주소.replace(/./g, "*");

        if (!input.휴대전화번호 && !input.사업장전화번호 && !input.자택전화번호 && !input.전자메일주소) {
            this.setError(E_IBX_K2006X_PHONE_NUMBER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "휴대전화번호, 사업장전화번호, 자택전화번호, 전자메일주소 중 하나는 필수로 입력 해야 합니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_K2006X_PHONE_NUMBER_NOTENTER;
        }

        var 휴대전화번호 = '';
        var 사업장전화번호 = '';
        var 자택전화번호 = '';
        var 전자메일주소 = '';
        var 휴대전화번호_수신동의 = '';
        var 전자메일주소_수신동의 = '';

        if (input.휴대전화번호) {
            휴대전화번호 = sas.SecureData.create(input.휴대전화번호);
            if (휴대전화번호.isSecurData()) {
                this.log('휴대전화번호 SASSecurData 포맷!');
            } else {
                this.log('휴대전화번호 일반 포맷!');
            }
            if (isNaN(휴대전화번호.getPlainText()) || 휴대전화번호.getLength() < 7) {
                this.setError(E_IBX_K2006X_PHONE_NUMBER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 휴대전화번호 입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_K2006X_PHONE_NUMBER_INVALID;
            }
            if (!input.휴대전화번호_수신동의) {
                // 미입력 or "N", "Y" 수신동의
                input.휴대전화번호_수신동의 = 'N';
            }
            if (['N', 'Y'].indexOf(input.휴대전화번호_수신동의) < 0) {
                this.setError(E_IBX_SENSITIVE_INFO_USE_AGREEMENT_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 휴대전화번호_수신동의 입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_SENSITIVE_INFO_USE_AGREEMENT_INVALID;
            }
            휴대전화번호_수신동의 = input.휴대전화번호_수신동의;
        }
        if (input.사업장전화번호) {
            사업장전화번호 = sas.SecureData.create(input.사업장전화번호);
            if (사업장전화번호.isSecurData()) {
                this.log('사업장전화번호 SASSecurData 포맷!');
            } else {
                this.log('사업장전화번호 일반 포맷!');
            }
            if (isNaN(사업장전화번호.getPlainText()) || 사업장전화번호.getLength() < 7) {
                this.setError(E_IBX_K2006X_PHONE_NUMBER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업장전화번호 입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_K2006X_PHONE_NUMBER_INVALID;
            }
        }
        if (input.자택전화번호) {
            자택전화번호 = sas.SecureData.create(input.자택전화번호);
            if (자택전화번호.isSecurData()) {
                this.log('자택전화번호 SASSecurData 포맷!');
            } else {
                this.log('자택전화번호 일반 포맷!');
            }
            if (isNaN(자택전화번호.getPlainText()) || 자택전화번호.getLength() < 7) {
                this.setError(E_IBX_K2006X_PHONE_NUMBER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 자택전화번호 입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_K2006X_PHONE_NUMBER_INVALID;
            }
        }
        if (input.전자메일주소){
            if (!validateEmail(input.전자메일주소)) {
                this.setError(E_IBX_EMAIL_INVALID);
                this.iSASInOut.Output.ErrorMessage = "전자메일주소가 잘못되었습니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_EMAIL_INVALID;
            }

            전자메일주소 = input.전자메일주소;

            if (!input.전자메일주소_수신동의) {
                // 미입력 or "N", "Y" 수신동의
                input.전자메일주소_수신동의 = 'N';
            }
            if (['N', 'Y'].indexOf(input.전자메일주소_수신동의) < 0) {
                this.setError(E_IBX_SENSITIVE_INFO_USE_AGREEMENT_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 전자메일주소_수신동의 입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_SENSITIVE_INFO_USE_AGREEMENT_INVALID;
            }
            전자메일주소_수신동의 = input.전자메일주소_수신동의;
        }

        this.userAgent = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        system.setStatus(IBXSTATE_ENTER, 30);

        this.url = '/permission.do?screenId=UTEABAAA59';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("session_1: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        system.setStatus(IBXSTATE_EXECUTE, 50);

        // 세션정보
        if (httpRequest.postWithUserAgent(this.userAgent, 'https://hometax.go.kr/token.do', "{}") == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("token: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            var JsonResult = JSON.parse(ResultStr);
        } catch (e) {
            this.log("EXCEPTION_ERROR :: " + e.message);
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        system.setStatus(IBXSTATE_EXECUTE, 70);

        postData = {};
        postData.userClCd = JsonResult.userClCd;
        postData.ssoToken = JsonResult.ssoToken;
        postData.txaaAdmNo = JsonResult.txaaAdmNo;
        postData.popupYn = false;
        this.postData = JSON.stringify(postData);

        this.url = '/permission.do?screenId=UTEABAAA59&domain=hometax.go.kr';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_2: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('권한이 없는 화면입니다') >= 0) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            PC조회발급서비스homeTaxSession.setSession(ResultStr);
            this.PC조회발급서비스homeTaxSession = PC조회발급서비스homeTaxSession;
        } catch (e) {
            this.log("exception: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 1);
            return E_IBX_SITE_INVALID + 1;
        }

        system.setStatus(IBXSTATE_EXECUTE, 75);

        var todayDate = js_yyyy_mm_dd();
        this.url = "/_wpack_/ui/ab/a/a/UTEABAAA59.js?postfix=" + todayDate.substr(0, 4) + '_' + todayDate.substr(4, 2) + '_' + todayDate.substr(6, 2);
        if (!httpRequest.getWithUserAgent(this.userAgent, this.pdfHost1 + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('사업특성입력조회_UI : [' + ResultStr + ']');


        // JSON형식이지만 찾아가는 단계가 너무 복잡하여 Grab 처리
        // group244002: 선택사항table, group244046: 다음 버튼
        ResultStr = StrGrab(ResultStr, "'group244002'", "'group244046'");
        if (!ResultStr) {
            this.setError(E_IBX_SITE_INVALID + 1);
            return E_IBX_SITE_INVALID + 1;
        }

        system.setStatus(IBXSTATE_RESULT, 80);

        var 사업특성선택사항 = [];
        var idx = 0;
        while (true) {
            idx++;
            var ResultTemp = StrGrab(ResultStr, "'w2:textbox'", "'w2:textbox'", idx);
            if (!ResultTemp) {
                // 마지막...
                ResultTemp = StrGrab(ResultStr, "'w2:textbox'", '', idx);

                if (!ResultTemp) break;
            }

            var item = {};

            item.질문 = StrGrab(ResultTemp, "label:'", "'");
            item.질문 = StrTrim(StrGrab(item.질문, (idx + '.'), ''));

            var select1 = StrGrab(StrGrab(ResultTemp, "'xf:select1'", "}"), '{', '');

            item.코드 = StrGrab(select1, "id:'", "'");

            var selectedIndex = Number(StrGrab(select1, "selectedIndex:'", "'"));
            if (!IsCurrency(selectedIndex)) {
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }

            item.응답 = StrGrab(StrGrab(ResultTemp, "'xf:item'", '}', selectedIndex + 1), "cdata:'", "'");
            if (item.응답 == '예') { item.응답 = 'Y'; }
            else if (item.응답 == '아니오') { item.응답 = 'N'; }
            else {
                this.setError(E_IBX_SITE_INVALID + 3);
                return E_IBX_SITE_INVALID + 3;
            }

            if (!item.질문 || !item.코드 || !item.응답 || (item.응답 && item.응답 != 'Y' && item.응답 != 'N')) {
                this.log("사업자등록신청_사업특성입력조회 2F10:[" + JSON.stringify(item) + "]");
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }

            사업특성선택사항.push(item);
        }
        if (사업특성선택사항.length == 0) {
            this.setError(E_IBX_SITE_INVALID + 4);
            return E_IBX_SITE_INVALID + 4;
        }

        // 사업자등록신청_사업특성입력 입력값과 매칭하기 위해... 
        this.사업특성선택사항 = 사업특성선택사항;

        this.기본정보 = {};
        this.기본정보.휴대전화번호 = 휴대전화번호;
        this.기본정보.사업장전화번호 = 사업장전화번호;
        this.기본정보.자택전화번호 = 자택전화번호;
        this.기본정보.전자메일주소 = 전자메일주소;
        this.기본정보.휴대전화번호_수신동의 = 휴대전화번호_수신동의;
        this.기본정보.전자메일주소_수신동의 = 전자메일주소_수신동의;

        this.chkStep3 = '2';

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.사업특성선택사항 = 사업특성선택사항;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_사업특성입력조회 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_사업특성입력 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_사업특성입력 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        // 사업자등록신청_사업특성입력조회 호출 후, 사업자등록신청_사업특성입력 실행 가능
        if (this.chkStep3 != '2' && this.chkStep3 != '3') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            this.iSASInOut.Output.ErrorMessage = "사업자등록신청_사업특성입력조회단계부터 재실행해 주십시오.";
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }

        var input = dec(aInput.Input);
        var 사업특성선택사항 = input.사업특성선택사항;

        if (!사업특성선택사항) {
            this.setError(E_IBX_PARAMETER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "사업특성선택사항 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_NOTENTER;
        }
        if (!Array.isArray(사업특성선택사항)) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 사업특성선택사항입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        if (사업특성선택사항.length != this.사업특성선택사항.length) {
            this.log("사업자등록신청_사업특성입력조회결과의 길이와 입력값의 길이가 다름!");
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 사업특성선택사항입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }

        // 이전 step에서 만들어진 사업특성선택사항
        this.log("사업자등록신청_사업특성입력조회:[" + JSON.stringify(this.사업특성선택사항) + ']');

        this.is임대차 = false;
        this.is사이버몰 = false;
        this.is서류송달 = false;

        var isMaching = false;

        // 앞선 질문들에 매칭되는지 확인..
        for (var idx = 0; idx < 사업특성선택사항.length; idx++) {

            isMaching = false;

            var idxTemp = 사업특성선택사항[idx];

            if (!idxTemp.질문) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업특성선택사항 질문 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (!idxTemp.코드) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업특성선택사항 코드 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (!idxTemp.응답) {
                this.setError(E_IBX_T110X5_QUESTION_REPLY_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업특성선택사항 응답 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_T110X5_QUESTION_REPLY_NOTENTER;
            }
            if (idxTemp.응답 != 'Y' && idxTemp.응답 != 'N') {
                this.setError(E_IBX_T110X5_QUESTION_REPLY_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업특성선택사항 응답 입력값입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_T110X5_QUESTION_REPLY_INVALID;
            }

            for (var idy = 0; idy < this.사업특성선택사항.length; idy++) {

                if (this.사업특성선택사항.매칭) continue;

                var idyTemp = this.사업특성선택사항[idy];
                if (idxTemp.질문 == idyTemp.질문 && idxTemp.코드 == idyTemp.코드) {
                    isMaching = true;
                    this.사업특성선택사항[idy].매칭 = true;
                    break;
                }
            }
            if (!isMaching) {
                this.log('매칭 불가한 질문+코드');
                this.setError(E_IBX_T110X5_QUESTION_REPLY_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업특성선택사항 입력값입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_T110X5_QUESTION_REPLY_INVALID;
            }

            // 사업장(가게, 사무실 등)이 타인의 소유인가요?
            if (idxTemp.코드 == 'pfbPsenClCd' && idxTemp.응답 == 'Y') this.is임대차 = true;

            // 통신판매(전자상거래, 해외직구대행 등)를 하실건가요?
            if (idxTemp.코드 == 'cymlYn' && idxTemp.응답 == 'Y') this.is사이버몰 = true;

            // 국세관련 우편수령장소를 사업장이 아닌 다른 주소로 지정하시겠습니까?
            if (idxTemp.코드 == 'dcumDlvPlcAltYn' && idxTemp.응답 == 'Y') this.is서류송달 = true;

            // 3가지 문답 이외에는 조회불가
            if (idxTemp.코드 != 'pfbPsenClCd' && idxTemp.코드 != 'cymlYn' && idxTemp.코드 != 'dcumDlvPlcAltYn'
                && idxTemp.응답 == 'Y') {
                this.setError(E_IBX_SERVICE_INVALID);
                return E_IBX_SERVICE_INVALID;
            }
        }

        this.chkStep3 = '3';
        this.사업특성선택사항 = 사업특성선택사항;

        system.setStatus(IBXSTATE_RESULT, 80);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_사업특성입력 finally");
    }
}

PC조회발급서비스.prototype.주소목록조회 = function (aInput) {
    this.log("PC조회발급서비스 주소목록조회 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        var input = aInput.Input;
        var 구분 = input.구분;
        var 주소 = input.주소;
        var 번지 = input.번지;
        var 호 = input.호;
        var 지하여부 = input.지하여부;
        var 산여부 = input.산여부;

        if (!구분) {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_NOTENTER);
            return E_IBX_A124X1_INQUIRY_TYPE_NOTENTER;
        }
        if (구분 != '1' && 구분 != '2') {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
            return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
        }
        if (!주소) {
            this.setError(E_IBX_A97XX1_ADDRESS_NOTENTER);
            return E_IBX_A97XX1_ADDRESS_NOTENTER;
        }
        if (주소.length < 2) {
            this.setError(E_IBX_A97XX1_ADDRESS_INVALID);
            return E_IBX_A97XX1_ADDRESS_INVALID;
        }
        if (구분 == '1') {
            if (!지하여부) {
                지하여부 = "N";
            }
            if (["N", "Y"].indexOf(지하여부) < 0) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 지하여부니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
        }
        if (구분 == '2') {
            if (번지 && isNaN(번지)) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 번지입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (호 && isNaN(호)) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 호입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }

            if (!산여부) {
                산여부 = "N";
            }
            if (["N", "Y"].indexOf(산여부) < 0) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 산여부니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
        }

        this.userAgent = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        this.url = '/permission.do?screenId=UTECMAAA02';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("session_1: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            var msg = StrGrab(ResultStr, '"msg":"', '"');
            this.setError(E_IBX_UNKNOWN);
            if (msg) { this.iSASInOut.Output.ErrorMessage = msg; }
            return E_IBX_UNKNOWN;
        }

        // 세션정보
        if (httpRequest.postWithUserAgent(this.userAgent, 'https://hometax.go.kr/token.do', "{}") == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("token: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            var msg = StrGrab(ResultStr, '"msg":"', '"');
            this.setError(E_IBX_UNKNOWN);
            if (msg) { this.iSASInOut.Output.ErrorMessage = msg; }
            return E_IBX_UNKNOWN;
        }

        try {
            var JsonResult = JSON.parse(ResultStr);
        } catch (e) {
            this.log("EXCEPTION_ERROR :: " + e.message);
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        system.setStatus(IBXSTATE_EXECUTE, 50);

        this.url = '/permission.do?screenId=UTECMAAA02&domain=hometax.go.kr';
        postData = {};
        postData.userClCd = JsonResult.userClCd;
        postData.ssoToken = JsonResult.ssoToken;
        postData.txaaAdmNo = JsonResult.txaaAdmNo;
        postData.popupYn = false;
        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_2: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('권한이 없는 화면입니다') >= 0) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            var msg = StrGrab(ResultStr, '"msg":"', '"');
            this.setError(E_IBX_UNKNOWN);
            if (msg) { this.iSASInOut.Output.ErrorMessage = msg; }
            return E_IBX_UNKNOWN;
        }

        var roadNm = "";
        var bldPmnoAdr = "";
        var bldSnoAdr = "";

        if (구분 == "1") {
            var roadAdrs = 주소.split(' ');
            var bldNos = "";

            function fnSplit_bldNo(str) {
                var bldNoAarry = new Array();
                var tempStr = "";
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
                    // 숫자일 경우
                    if (tempStr.length == 5) {
                        // 건물본번 또는 건물부번의 길이가 5자가 넘어가는 경우
                        return null;
                    }
                    tempStr += str.charAt(i);
                    } else if (str.charAt(i) == "-") {
                    if (i == 0) {
                        // 첫번째 열부터 '-'는 오류 ex) -1234
                        return null;
                    } else if (i + 1 == str.length) {
                        // 마지막번째 '-'는 오류 ex) 1234-
                        return null;
                    } else if (bldNoAarry.length > 1) {
                        // 본번 ,부번이 이후의 번호는 오류 ex) 111-11-11
                        return null;
                    } else {
                        bldNoAarry[bldNoAarry.length] = tempStr; // 건물번호에 분리된 건물번호 입력 (건물본번 OR 건물부번)
                        tempStr = "";
                    }
                    } else {
                    // 숫자 또는 '-' 외 오류
                    return null;
                    }
                }
                if (tempStr != "") {
                    // 최종 조립된 본번 또는 부번을 배열에 담는다
                    bldNoAarry[bldNoAarry.length] = tempStr; // 건물번호에 분리된 건물번호 입력 (건물본번 OR 건물부번)
                    tempStr = "";
                }
                if (bldNoAarry.length > 2) {
                    return null;
                } else {
                    return bldNoAarry;
                }
            }

            if (roadAdrs.length == 2) {
                bldNos = fnSplit_bldNo(roadAdrs[1]);
            } else if (roadAdrs.length > 2) {
                this.setError(E_IBX_A97XX1_ADDRESS_INVALID);
                this.iSASInOut.Output.ErrorMessage = "도로명 또는 건물번호에 공백이 포함되어 있습니다.";
                return E_IBX_A97XX1_ADDRESS_INVALID;
            }

            if (roadAdrs.length > 1 && !bldNos) {
                this.setError(E_IBX_A97XX1_ADDRESS_INVALID);
                this.iSASInOut.Output.ErrorMessage = "도로명주소는 도로명(공백없이)만 입력 또는  도로명(공백없이) +  '건물본번(숫자 5자리 이하)-건물부번(숫자 5자리 이하)'또는 '건물본번(숫자 5자리 이하)' 형식으로 입력하여 주십시오.";
                return E_IBX_A97XX1_ADDRESS_INVALID;
            }

            roadNm = roadAdrs[0];
            bldPmnoAdr = (bldNos.length > 0 ? bldNos[0] : "");
            bldSnoAdr = (bldNos.length > 1 ? bldNos[1] : "");
        }

        // this.userAgent = '{"Content-Type":"application/json","Accept":"application/json","Referer":"https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=43&tm2lIdx=4306010000&tm3lIdx=4306010100"}';

        var 주소목록조회 = [];
        var pageNum = 1;
        while(true){
            system.setStatus(IBXSTATE_EXECUTE, 70);

            if (구분 == "1") { this.url = '/wqAction.do?actionId=ATECMAAA001R04&screenId=UTECMAAA02&popupYn=true&realScreenId='; }
            else { this.url = '/wqAction.do?actionId=ATECMAAA001R05&screenId=UTECMAAA02&popupYn=true&realScreenId='; }
            postData = {};
            postData.sidoCd = "";
            postData.sggCd = "";
            if (구분 == "1") { // 도로명
                postData.roadNm = roadNm;
                postData.roadNmCd = "";
                postData.bldPmnoAdr = bldPmnoAdr;
                postData.bldSnoAdr = bldSnoAdr;
                postData.undrBldYn = 지하여부;
            } else { // 지번
                postData.ymdgNm = 주소;
                postData.snadrYn = 산여부;
                postData.bunjAdr = (번지 ? 번지 : "");
                postData.hoAdr = (호 ? 호 : "");
            }
            postData.pageInfoVO = {};
            postData.pageInfoVO.totalCount = "0";
            postData.pageInfoVO.pageSize = "10";
            postData.pageInfoVO.pageNum = pageNum.toString();
            this.postData = JSON.stringify(postData);
            
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("주소목록조회_[" + pageNum + "]:[" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('권한이 없는 화면입니다') >= 0) {
                this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
                return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                var msg = StrGrab(ResultStr, '"msg":"', '"');
                this.setError(E_IBX_UNKNOWN);
                if (msg) { this.iSASInOut.Output.ErrorMessage = msg; }
                return E_IBX_UNKNOWN;
            }

            var adrCtlAdmDVOList, totalCount;
            try {
                adrCtlAdmDVOList = JSON.parse(ResultStr).adrCtlAdmDVOList;

                // 총건수
                totalCount = parseInt(JSON.parse(ResultStr).pageInfoVO.totalCount);
            } catch (e) {
                this.setError(E_IBX_SITE_INVALID);
                return E_IBX_SITE_INVALID;
            }

            // 내역없음
            if (totalCount == 0){
                this.setError(I_IBX_RESULT_NOTPRESENT);
                return I_IBX_RESULT_NOTPRESENT;
            }

            system.setStatus(IBXSTATE_RESULT, 80);

            var item = {};
            for (var idx = 0; idx < adrCtlAdmDVOList.length; idx++) {
                item = {};

                item.시군구 = _nullToEnpty(adrCtlAdmDVOList[idx].sggFrmyNm);

                도로명주소 = {};
                도로명주소.도로명 = _nullToEnpty(adrCtlAdmDVOList[idx].roadNm);
                도로명주소.건물번호 = _nullToEnpty(adrCtlAdmDVOList[idx].bldNo);
                도로명주소.건물명 = _nullToEnpty(adrCtlAdmDVOList[idx].bldNm);

                item.도로명주소 = 도로명주소;

                지번주소 = {};
                if (구분 == "2") { // 지번
                    지번주소.읍면동_가리 = _nullToEnpty(adrCtlAdmDVOList[idx].ymdgRdstNm);
                    지번주소.번지 = _nullToEnpty(adrCtlAdmDVOList[idx].bunjHoAdr);
                }
                item.지번주소 = 지번주소;
                item.관련지번 = _nullToEnpty(adrCtlAdmDVOList[idx].rltnLnmYn);

                item.주소정보 = JSON.stringify(adrCtlAdmDVOList[idx]);
                item.주소정보 = certManager.Base64Encode(item.주소정보);

                if (!item.시군구 || !도로명주소.도로명 || !도로명주소.건물번호 || (구분 == "2" && (!지번주소.읍면동_가리 || !지번주소.번지))) {
                    this.log("2F10_Error: ["+ JSON.stringify(item) +"]");
                    this.setError(E_IBX_RESULT_FAIL);
                    return E_IBX_RESULT_FAIL;
                }

                주소목록조회.push(item);
            }

            // 다음페이지 확인
            if ((pageNum*10) >= totalCount) break;

            pageNum++;
        }

        // this.chkStep3 = '1';

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.주소목록조회 = 주소목록조회;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 주소목록조회 finally");
    }
}

PC조회발급서비스.prototype.업종목록조회 = function (aInput) {
    this.log("PC조회발급서비스 업종목록조회 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // ===선행단계 (입력조회 ..) 없이 호출 가능==
        var input = dec(aInput.Input);
        var 조회구분 = input.조회구분;
        var 검색어 = input.검색어;

        if (!조회구분) {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_NOTENTER);
            return E_IBX_A124X1_INQUIRY_TYPE_NOTENTER;
        }

        // 1: 업종 키워드, 2: 업종코드
        if (["1", "2"].indexOf(조회구분) < 0) {
            this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
            return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
        }

        if (!검색어) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "검색어 미입력 입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }

        system.setStatus(IBXSTATE_ENTER, 40);

        var content_type = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        // 세션유지 통신
        this.url = '/token.do?query=';
        this.postData = '{}'
        if (httpRequest.postWithUserAgent(content_type, this.mainHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("업종목록조회_1:[" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"ssoToken":null') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var JsonResult;
        try {
            JsonResult = JSON.parse(ResultStr);
        } catch (e) {
            this.log("exception :: " + e.message);
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        system.setStatus(IBXSTATE_EXECUTE, 50);

        // 국세증명·사업자등록 세금관련 신청/신고 > 사업자등록 신청·정정·휴폐업 > 개인 사업자등록 신청 > 개인 사업자등록 신청 > 업종 선택 > 업종 입력/수정
        this.url = "/permission.do?screenId=UTERNAAZ78&domain=hometax.go.kr";
        postData = {};
        postData.userClCd = JsonResult.userClCd;
        postData.ssoToken = JsonResult.ssoToken;
        postData.txaaAdmNo = JsonResult.txaaAdmNo; // 세무대리인일 때 필요
        postData.popupYn = false;
        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(content_type, this.mainHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("업종목록조회_2:[" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        system.setStatus(IBXSTATE_EXECUTE, 60);

        // 국세증명·사업자등록 세금관련 신청/신고 > 사업자등록 신청·정정·휴폐업 > 개인 사업자등록 신청 > 개인 사업자등록 신청 > 업종 선택 > 업종 입력/수정
        this.url = "/permission.do?screenId=UTERNAAZ78";
        this.postData = "{}";
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('업종목록조회_3 : [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }        

        system.setStatus(IBXSTATE_EXECUTE, 70);

        // 당년
        var attrYr = js_yyyy_mm_dd().substr(0, 4);

        // 업종목록
        var 업종목록조회 = [];
        var item = {};
        var pageInfoVO, baseXpsrDVOList, ResultItem = '', totalCount = '';
        var idx = 0, pageNum = 0;

        // 사업분류목록
        var 산업분류목록 = [];
        var detailItem = {};
        var detailIdx = 0, detailPageNum = 0;
        var detailPageInfoVo, krStndIndsClCdDVOList, detailTotalCount, detailResultItem, schRslt;

        while(true){
            pageNum++;

            // 업종정보 조회
            this.url = "/wqAction.do?actionId=ATTRNZZZ001R01&screenId=UTERNAAZ78&popupYn=false&realScreenId=";
            var JsonData = {};
            JsonData.attrYr = attrYr;
            JsonData.tfbCd = (조회구분 != "1"? 검색어: "");
            JsonData.tfbNm = (조회구분 == "1"? 검색어: "");
            JsonData.selectMode = "L2";
            JsonData.pageInfoVO = {};
            JsonData.pageInfoVO.pageNum = "" + pageNum;
            JsonData.pageInfoVO.pageSize = "10";

            this.postData = JSON.stringify(JsonData);
            if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('업종목록조회_4_page['+ pageNum +'] : [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }

            // 내역없음
            if (ResultStr.indexOf('조회된 데이터가 없습니다') >= 0){
                if (pageNum == 1){
                    this.setError(I_IBX_RESULT_NOTPRESENT);
                    return I_IBX_RESULT_NOTPRESENT;
                } else {
                    // 다음페이지 더이상 없음
                    break;
                }
            }

            if (ResultStr.indexOf('조회가 완료되었습니다') < 0){
                this.setError(E_IBX_UNKNOWN);
                return E_IBX_UNKNOWN;
            }

            try {
                pageInfoVO = JSON.parse(ResultStr).pageInfoVO;
                baseXpsrDVOList = JSON.parse(ResultStr).baseXpsrDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            // 내역 총건수
            totalCount = parseInt(pageInfoVO.totalCount);
            // TODO: 내역이 없는 경우 추가
            if (totalCount == 0) {
                if (pageNum == 1){
                    this.setError(I_IBX_RESULT_NOTPRESENT);
                    return I_IBX_RESULT_NOTPRESENT;
                } else {
                    // 다음페이지 더이상 없음
                    break;
                }
            }

            system.setStatus(IBXSTATE_RESULT, 80);

            for (idx = 0; idx < baseXpsrDVOList.length; idx++){
                ResultItem = baseXpsrDVOList[idx];
    
                item = {};
                item.귀속년도 = _nullToEnpty(ResultItem.attrYr);
                item.업종코드 = _nullToEnpty(ResultItem.tfbCd);
                item.업태명 = _nullToEnpty(ResultItem.bcNm);
                item.세분류명 = _nullToEnpty(ResultItem.tfbDtcsNm);
                item.세세분류명 = _nullToEnpty(ResultItem.tfbDclsNm);
    
                item.적용범위및기준 = _nullToEnpty(ResultItem.applcBaseDcnt);
                item.적용범위및기준 = StrReplace(StrReplace(StrReplace(item.적용범위및기준, '\n', ''), '\t', ''), '\r', '');
                if (item.적용범위및기준){
                    item.적용범위및기준 = Special_Char_Replace(item.적용범위및기준);
                }

                // baseXpsrDVOList의 {…} 정보 base64 encode.
                item.업종정보 = JSON.stringify(ResultItem);
                item.업종정보 = certManager.Base64Encode(item.업종정보);

                if (!IsCurrency(item.귀속년도) || item.귀속년도.length != 4 ||
                    !item.업종코드 || 
                    !item.업태명 || 
                    !item.세분류명 || 
                    !item.세세분류명 || 
                    !item.적용범위및기준){

                    this.log("2F10_Error_1: ["+ JSON.stringify(item) +"]");
                    this.setError(E_IBX_RESULT_FAIL);
                    return E_IBX_RESULT_FAIL;
                }

                // 산업분류목록 결과처리
                // 업종별 산업분류 존재여부 확인을 위해 상세페이지 통신하여 "schRslt"값으로만 확인 가능
                // "LIST": 존재, 그외: 없음
                산업분류목록 = [];
                detailPageNum = 0;
                while(true){
                    detailPageNum++;

                    this.url = '/wqAction.do?actionId=ATTRNZZZ001R17&screenId=UTERNAAZ76&popupYn=true&realScreenId=';                    
                    var detailJsonData = {};
                    detailJsonData.attrYr = _nullToEnpty(ResultItem.attrYr);
                    detailJsonData.tfbCd = _nullToEnpty(ResultItem.tfbCd);
                    detailJsonData.bcNm = _nullToEnpty(ResultItem.bcNm);
                    detailJsonData.tfbDclsNm = _nullToEnpty(ResultItem.tfbDclsNm);
                    detailJsonData.selectMode = "L2";
                    detailJsonData.pageInfoVO = {};
                    detailJsonData.pageInfoVO.pageNum = "" + detailPageNum;
                    detailJsonData.pageInfoVO.pageSize = "10";
                    
                    this.postData = JSON.stringify(detailJsonData);
                    if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                        this.setError(E_IBX_FAILTOGETPAGE);
                        return E_IBX_FAILTOGETPAGE;
                    }
                    ResultStr = httpRequest.result;
                    this.log('업종목록조회_5_page['+ detailPageNum +'] : [' + ResultStr + ']');
                
                    if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                        ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                        this.bLogIn = false;
                        this.setError(E_IBX_SESSION_CLOSED);
                        return E_IBX_SESSION_CLOSED;
                    }
                    if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                        ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                        this.bLogIn = false;
                        this.setError(E_IBX_SERVICE_LOGOUT);
                        return E_IBX_SERVICE_LOGOUT;
                    }
                    if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
                        ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                        ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                        this.setError(E_IBX_SITE_INTERNAL);
                        return E_IBX_SITE_INTERNAL;
                    }

                    // 다음페이지 없음
                    if (ResultStr.indexOf('조회된 데이터가 없습니다') >= 0) break;

                    if (ResultStr.indexOf('조회가 완료되었습니다') < 0){
                        this.setError(E_IBX_UNKNOWN);
                        return E_IBX_UNKNOWN;
                    }
                
                    try {
                        schRslt = JSON.parse(ResultStr).schRslt;
                        detailPageInfoVo = JSON.parse(ResultStr).pageInfoVO;
                        krStndIndsClCdDVOList = JSON.parse(ResultStr).krStndIndsClCdDVOList;
                    } catch (e) {
                        this.log("exception :: " + e.message);
                        this.setError(E_IBX_SITE_INVALID + 2);
                        return E_IBX_SITE_INVALID + 2;
                    }

                    // 내역 총건수
                    detailTotalCount = parseInt(detailPageInfoVo.totalCount);
                    if (detailTotalCount == 0) break;

                    // 예외케이스 확인 필요
                    if (schRslt != 'LIST' && schRslt != 'VO' && schRslt != null){
                        this.log("schRslt 예외 케이스 확인 필요: ["+ JSON.stringify(item) +"]");
                        this.setError(E_IBX_SITE_INVALID_MASK);
                        return E_IBX_SITE_INVALID_MASK;
                    }

                    // "LIST"인 경우 내역 존재
                    if (schRslt != 'LIST') break;

                    for (detailIdx = 0; detailIdx < krStndIndsClCdDVOList.length; detailIdx++){
                        detailResultItem = krStndIndsClCdDVOList[detailIdx];
                        detailItem = {};

                        detailItem.산업분류코드 = _nullToEnpty(detailResultItem.krStndIndsClsfCd);
                        detailItem.산업분류명 = _nullToEnpty(detailResultItem.krStndIndsClsfNm);

                        detailItem.보기내용 = _nullToEnpty(detailResultItem.krStndIndsClsfXampCntn);
                        detailItem.보기내용 = StrReplace(StrReplace(StrReplace(detailItem.보기내용, '\n', ''), '\t', ''), '\r', '');
                        if (detailItem.보기내용){
                            detailItem.보기내용 = Special_Char_Replace(detailItem.보기내용);
                        }
        
                        // krStndIndsClCdDVOList {…} 정보 base64 encode.
                        detailItem.산업분류정보 = JSON.stringify(detailResultItem);
                        detailItem.산업분류정보 = certManager.Base64Encode(detailItem.산업분류정보);
        
                        if (!detailItem.산업분류코드 || 
                            !detailItem.산업분류명 || 
                            // !detailItem.보기내용 || 
                            !detailItem.산업분류정보){
        
                            this.log("2F10_Error_2: ["+ JSON.stringify(detailItem) +"]");
                            this.setError(E_IBX_RESULT_FAIL);
                            return E_IBX_RESULT_FAIL;
                        }

                        산업분류목록.push(detailItem);
                    }

                    //다음페이지
                    if ((detailPageNum*10) > parseInt(detailTotalCount)) break;
                }
    
                item.산업분류목록 = 산업분류목록;

                업종목록조회.push(item);
            }

            //다음페이지
            if ((pageNum*10) > parseInt(totalCount)) break;
        }

        if (업종목록조회.length == 0){
            this.setError(E_IBX_SITE_INVALID_MASK);
            return E_IBX_SITE_INVALID_MASK;
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.업종목록조회 = 업종목록조회;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 업종목록조회 finally");
    }
}

PC조회발급서비스.prototype.제출서류조회 = function (aInput) {
    this.log("PC조회발급서비스 제출서류조회 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // ===선행단계 (입력조회 ..) 없이 호출 가능==
        var input = dec(aInput.Input);
        var 업종정보 = input.업종정보;

        if (!업종정보) {
            this.setError(E_IBX_TRANS_TYPE_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_NOTENTER;
        }
        if (whatIsIt(업종정보) != 'Array') {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        if (업종정보.length == 0) {
            this.setError(E_IBX_TRANS_TYPE_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_NOTENTER;
        }

        var content_type = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        var 주업종, 주업종코드;
        var 부업종 = [];
        var 부업종코드 = [];
        var 제출서류조회 = [];

        var querryData = {};    // 업종등록
        querryData.bsafPtusCmnClsfCd = "14479";
        querryData.vldtStrtDt = '00010101';
        querryData.bmanTfbDVOList = [];

        var is주업종 = false;
        var bmanTfbDVOList = [];
        system.setStatus(IBXSTATE_EXECUTE, 60);

        for (var idx = 0; idx < 업종정보.length; idx++) {

            var IndusInfo = 업종정보[idx];

            if (!IndusInfo.구분) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (['주', '부'].indexOf(IndusInfo.구분) < 0) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (!IndusInfo.코드) {
                this.setError(E_IBX_BUSINESS_CODE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 코드 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_BUSINESS_CODE_NOTENTER;
            }
            if (IndusInfo.코드.length != 6) {
                this.setError(E_IBX_BUSINESS_CODE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 코드(" + IndusInfo.코드 + ")입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_BUSINESS_CODE_INVALID;
            }

            // 주업종은 하나만 등록가능
            if (is주업종 && IndusInfo.구분 == '주') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (IndusInfo.구분 == '주') is주업종 = true;

            // 당해년도
            var attrYr = js_yyyy_mm_dd().substr(0, 4);
            var attrYr = "2024";

            // 업종코드 검색1
            system.setStatus(IBXSTATE_EXECUTE, 65);
            this.url = "/wqAction.do?actionId=ATTRNZZZ001R01&screenId=UTERNAAZ78&popupYn=false&realScreenId=";
            var postData = {};
            postData.attrYr = attrYr;
            postData.tfbCd = IndusInfo.코드;
            postData.tfbNm = '';
            postData.selectMode = "L2";
            postData.pageInfoVO = {};
            postData.pageInfoVO.pageNum = "1";
            postData.pageInfoVO.pageSize = "10";

            this.postData = JSON.stringify(postData);
            if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log('업종코드 검색1 (' + IndusInfo.코드 + ') : ' + ResultStr);
                if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }

            // 업종코드 한 건만 오입력해도 전체 오류처리
            if (ResultStr.indexOf('조회된 데이터가 없습니다') >= 0){
                this.setError(E_IBX_BUSINESS_CODE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 코드(" + IndusInfo.코드 + ")입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_BUSINESS_CODE_INVALID;
            }

            if (ResultStr.indexOf('조회가 완료되었습니다') < 0){
                this.setError(E_IBX_UNKNOWN);
                return E_IBX_UNKNOWN;
            }
    
            var baseXpsrDVOList;
            try {
                baseXpsrDVOList = JSON.parse(ResultStr).baseXpsrDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID);
                return E_IBX_SITE_INVALID;
            }

            // 업종코드 검색2
            system.setStatus(IBXSTATE_EXECUTE, 70);
            this.url = '/wqAction.do?actionId=ATTRNZZZ001R17&screenId=UTEABAAP09&popupYn=true&realScreenId=';
            postData = {};
            postData.attrYr = attrYr;
            postData.tfbCd = baseXpsrDVOList[0].tfbCd;
            postData.bcNm = baseXpsrDVOList[0].bcNm;
            postData.tfbDclsNm = baseXpsrDVOList[0].tfbDclsNm;
            postData.buttonId = baseXpsrDVOList[0].buttonId;
            
            this.postData = JSON.stringify(postData);
            if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log('업종코드 검색2 (' + IndusInfo.코드 + ') : ' + ResultStr);

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }

            var krStndIndsClCdDVO, krStndIndsClCdDVOList;
            try {
                krStndIndsClCdDVO = JSON.parse(ResultStr).krStndIndsClCdDVO;
                krStndIndsClCdDVOList = JSON.parse(ResultStr).krStndIndsClCdDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            if (!krStndIndsClCdDVO) {
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }

            item = {};
            item.blank = "";
            item.chk = "";
            item.mtfbYn = (IndusInfo.구분 == '주' ? 'Y' : 'N');
            item.tfbCd = krStndIndsClCdDVO.tfbCd;
            item.bcNm = krStndIndsClCdDVO.krStndIndsClsfNm;
            item.itmNm = krStndIndsClCdDVO.krStndIndsLcsNm;
            item.krStndIndsClsfNm = '(' + krStndIndsClCdDVO.krStndIndsClsfCd + ') ' + krStndIndsClCdDVO.krStndIndsClsfNm;
            item.modifyBtnTfb = "수정";
            item.krStndIndsClsfCd = krStndIndsClCdDVO.krStndIndsClsfCd;
            item.applcBaseDcnt = baseXpsrDVOList[0].applcBaseDcnt;
            item.csmrOpstTfbYn = "";
            item.cshptDutyPblTfbYn = "";
            item.statusValue = "C";
           
            querryData.bmanTfbDVOList.push(item);
        }

        // 주업종 하나이상 필수 입력
        if (!is주업종) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "주업종은 필수로 선택해야합니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }

        // 업종등록 최종
        system.setStatus(IBXSTATE_EXECUTE, 75);
        this.url = '/wqAction.do?actionId=ATTABZAA001R15&screenId=UTEABAAP09&popupYn=true&realScreenId=';
        this.postData = JSON.stringify(querryData);
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('업종등록 최종 : ' + ResultStr);

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var bmanTfbDVOList;
        try {
            bmanTfbDVOList = JSON.parse(ResultStr).bmanTfbDVOList;
        } catch (e) {
            this.log("exception :: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 3);
            return E_IBX_SITE_INVALID + 3;
        }
        if (!bmanTfbDVOList) {
            this.setError(E_IBX_SITE_INVALID + 4);
            return E_IBX_SITE_INVALID + 4;
        }

        for (var i=0; i<bmanTfbDVOList.length; i++) {
            var bmanTfbDVO = bmanTfbDVOList[i];
            // 주업종 여부
            if (bmanTfbDVO.mtfbYn == 'Y') {
                주업종 = bmanTfbDVO.bcNm;
                주업종코드 = bmanTfbDVO.tfbCd;
            } else {
                부업종.push(bmanTfbDVO.bcNm);
                부업종코드.push(bmanTfbDVO.tfbCd);
            }
        }

        // 세션유지
        system.setStatus(IBXSTATE_EXECUTE, 80);
        this.url = '/permission.do?screenId=UTEABAAP10';
        this.postData = {};
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('세션유지 : ' + ResultStr);

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var querryData = {};    // 제출서류 확인
        querryData.bmanRgtClCd = "01";
        querryData.cvaId = '';
        querryData.cvaKndCd = 'A2004';
        querryData.removeWaitCvaYn = '';
        querryData.tin = StrGrab(ResultStr, '"tin":"', '"');
        querryData.isSt1Amd = false;
        querryData.ttiabcd005DVOList = [];

        for (var i = 0; i < bmanTfbDVOList.length; i++) {
            var item = {};
            item.blank = "";
            item.chk = "";
            item.mtfbYn = bmanTfbDVOList[i].mtfbYn;
            item.tfbCd = bmanTfbDVOList[i].tfbCd;
            item.bcNm = bmanTfbDVOList[i].bcNm;
            item.itmNm = bmanTfbDVOList[i].itmNm;
            item.csmrOpstTfbYn = "";
            item.cshptDutyPblTfbYn = "";
            item.krStndIndsClsfNm = '(' + bmanTfbDVOList[i].krStndIndsClsfCd + ') ' + bmanTfbDVOList[i].itmNm;
            item.cnfr = "";
            item.tfbCdBtnModify = "";
            item.krStndIndsClsfCd = bmanTfbDVOList[i].krStndIndsClsfCd;
            item.applcBaseDcnt = "";
            item.statusValue = "R";

            querryData.ttiabcd005DVOList.push(item);
        }

        // 제출서류 확인
        system.setStatus(IBXSTATE_EXECUTE, 85);
        this.url = '/wqAction.do?actionId=ATEABAAA008R07&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        
        this.postData = JSON.stringify(querryData);
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('제출서류 확인 : ' + ResultStr);

        var aprlBsAdmDVOList;
        try {
            aprlBsAdmDVOList = JSON.parse(ResultStr).aprlBsAdmDVOList;
        } catch (e) {
            this.log("exception :: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 5);
            return E_IBX_SITE_INVALID + 5;
        }
        if (!aprlBsAdmDVOList) {
            this.setError(E_IBX_SITE_INVALID + 6);
            return E_IBX_SITE_INVALID + 6;
        }
        if (aprlBsAdmDVOList.length == 0) {
            this.setError(E_IBX_BUSINESS_CODE_MISC);
            this.iSASInOut.Output.ErrorMessage = "해당 업종은 인·허가 사업의 업종이 아닙니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_BUSINESS_CODE_MISC;
        }

        system.setStatus(IBXSTATE_RESULT, 90);
        for (var i=0; i<aprlBsAdmDVOList.length; i++) {
            var aprlBsAdmDVO = aprlBsAdmDVOList[i];
            
            var item = {};
            item.업종코드 = aprlBsAdmDVO.aprlTfbCd;
            item.적용업종명 = aprlBsAdmDVO.aprlApplcTfbNm;
            item.구분 = aprlBsAdmDVO.aprlClNm;
            item.근거법령 = aprlBsAdmDVO.aprlBssStttNm;
            item.제출서류 = aprlBsAdmDVO.aprlSbmsDcumNm;
            item.접수기관 = aprlBsAdmDVO.aprlRcpnOrgnNm;
            item.민원사무명 = aprlBsAdmDVO.aprlCvaOwNm;
            item.비고 = aprlBsAdmDVO.aprlRmrkCntn;

            if (!item.업종코드 || !item.적용업종명 || !item.구분 || !item.근거법령 ||
                !item.제출서류 || !item.접수기관 || !item.민원사무명) {
                this.log('80002F10 : ' + JSON.stringify(item));
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
            제출서류조회.push(item);
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.주업종 = 주업종;
        this.iSASInOut.Output.Result.주업종코드 = 주업종코드;
        this.iSASInOut.Output.Result.부업종 = 부업종;
        this.iSASInOut.Output.Result.부업종코드 = 부업종코드;
        this.iSASInOut.Output.Result.제출서류조회 = 제출서류조회;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 제출서류조회 finally");
    }
}

PC조회발급서비스.prototype.공통코드목록조회 = function (aInput) {
    this.log("PC조회발급서비스 공통코드목록조회 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // ===선행단계 (입력조회 ..) 없이 호출 가능==
        var input = dec(aInput.Input);
        var 검색어 = input.검색어;

        system.setStatus(IBXSTATE_ENTER, 40);

        var content_type = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        // 세션유지 통신
        this.url = '/token.do?query=';
        this.postData = '{}'
        if (httpRequest.postWithUserAgent(content_type, this.mainHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("공통코드목록조회_1:[" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"ssoToken":null') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var JsonResult;
        try {
            JsonResult = JSON.parse(ResultStr);
        } catch (e) {
            this.log("exception :: " + e.message);
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        system.setStatus(IBXSTATE_EXECUTE, 50);

        // 국세증명·사업자등록 세금관련 신청/신고 > 사업자등록 신청·정정·휴폐업 > 개인 사업자등록 신청 > 업종 선택 > 업종 입력/수정
        this.url = "/permission.do?screenId=UTECMAAA06";
        this.postData = "{}";

        if (httpRequest.postWithUserAgent(content_type, this.mainHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("공통코드목록조회_2:[" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        system.setStatus(IBXSTATE_EXECUTE, 60);

        this.url = "/wqAction.do?actionId=ATTCMAAA004R02&screenId=UTECMAAA06&popupYn=true&realScreenId=";
        postData = {};
        postData.cmnClsfCd = "10089";
        postData.cmnClsfCdKrnNm = "";
        postData.strtCdVval = "";
        postData.endCdVval = "";
        postData.cdVvalKrnNm = "";
        postData.inqrBaseDd = "";
        postData.clCntn = "Y";
        postData.hrnkVvalSameYn = "";
        postData.inqrBaseDtUseYn = "";
        this.postData = JSON.stringify(postData);
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('공통코드목록조회_3 : [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 || 
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }        

        system.setStatus(IBXSTATE_EXECUTE, 70);
        var pageInfoVO, totalCount = '';
        var pageNum = 0;

        var 공통코드목록조회 = [];
        while (true) {
            pageNum++;

            this.url = "/wqAction.do?actionId=ATCCMAAA001R01&screenId=UTECMAAA06&popupYn=true&realScreenId=";
            postData = {};
            postData.cmnClsfCd = "10089";
            postData.cmnClsfCdKrnNm = "개별소비세과세구분코드";
            postData.strtCdVval = "";
            postData.endCdVval = "";
            postData.cdVvalKrnNm = 검색어;
            postData.inqrBaseDd = js_yyyy_mm_dd();
            postData.clCntn = "Y";
            postData.hrnkVvalSameYn = "";
            postData.inqrBaseDtUseYn = "";
            postData.pageInfoVO0 = {};
            postData.pageInfoVO0.pageNum = pageNum.toString();
            postData.pageInfoVO0.pageSize = "10";
            postData.pageInfoVO0.totalCount = "";
            this.postData = JSON.stringify(postData);
            if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('공통코드목록조회_4_' + pageNum.toString() + ' : [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }

            if (ResultStr.indexOf('조회된 데이터가 없습니다') >= 0) {
                if (pageNum == 1) {
                    // 내역이 없을리가 없음..
                    if (!검색어) {
                        this.setError(E_IBX_SITE_INVALID + 1);
                        return E_IBX_SITE_INVALID + 1;
                    } else {
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 검색어 입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }

                } else {
                    // 다음페이지 더이상 없음
                    break;
                }
            }

            try {
                pageInfoVO = JSON.parse(ResultStr).pageInfoVO0;
                var cmnCdAdmDVOList = JSON.parse(ResultStr).cmnCdAdmDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }

            totalCount = parseInt(pageInfoVO.totalCount);
            if (totalCount == 0) {
                if (pageNum == 1) {
                    if (!검색어) {
                        this.setError(E_IBX_SITE_INVALID + 3);
                        return E_IBX_SITE_INVALID + 3;
                    } else {
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 검색어 입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }
                } else {
                    // 다음페이지 더이상 없음
                    break;
                }
            }

            for (var idx = 0; idx < cmnCdAdmDVOList.length; idx++) {
                var ResultItem = cmnCdAdmDVOList[idx];

                var item = {};

                item.코드 = ResultItem.cdVval;
                item.코드명 = ResultItem.cdVvalAbrvNm;

                if (!item.코드 || !item.코드명) {
                    this.log("공통코드목록조회_2F10: [" + JSON.stringify(item) + "]");
                    this.setError(E_IBX_RESULT_FAIL);
                    return E_IBX_RESULT_FAIL;
                }

                공통코드목록조회.push(item);
            }

            //다음페이지
            if ((pageNum * 10) > parseInt(totalCount)) break;
        }


        if (공통코드목록조회.length == 0){
            this.setError(E_IBX_SITE_INVALID_MASK);
            return E_IBX_SITE_INVALID_MASK;
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.공통코드목록조회 = 공통코드목록조회;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 공통코드목록조회 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_정보입력조회_임대차 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_정보입력조회_임대차 호출 [" + moduleVersion + "]");
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        // 각 조회구분마다 선행처리 job이달라 오류메시지 처리가 모호하여 기본 오류메시지로 처리
        if (this.chkStep3 != '3' && this.chkStep3 != '4') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }
        if (!this.is임대차) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            this.iSASInOut.Output.ErrorMessage = "사업장(가게, 사무실 등)이 타인의 소유인가요?를 'Y'로 응답 시에 호출 가능합니다.";
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }

        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = aInput.Input;
        var 자가면적 = input.자가면적;
        var 임대차정보 = input.임대차정보;

        if (자가면적 && !IsCurrency(자가면적)) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 자가면적입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        // 사이트에서 13자리 초과 입력 불가
        if (자가면적.length > 13) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 자가면적입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        if (!임대차정보) {
            this.setError(E_IBX_PARAMETER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "임대차정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_NOTENTER;
        }
        if (whatIsIt(임대차정보) != 'Array') {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 임대차정보입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }

        var FlashError;
        var 타가면적 = 0;
        for (var i = 0; i < 임대차정보.length; i++) {
            var leaseInfo = 임대차정보[i];

            if (!leaseInfo.임대인구분) {
                this.setError(E_IBX_A124X1_INQUIRY_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "임대인구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A124X1_INQUIRY_TYPE_NOTENTER;
            }
            // 1: 주민등록번호, 2: 사업자등록번호, 3: 법인등록번호
            if (['1', '2', '3'].indexOf(leaseInfo.임대인구분) < 0) {
                this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 임대인구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
            }
            if (leaseInfo.임대인정보) this.iSASInOut.Input.임대차정보[i].임대인정보 = leaseInfo.임대인정보.replace(/./g, "*");
            if (leaseInfo.성명) this.iSASInOut.Input.임대차정보[i].성명 = leaseInfo.성명.replace(/./g, "*");
            
            // 임대인구분 입력값에 따라 (주민/사업자/법인) 오류 분리해야함.
            if (!leaseInfo.임대인정보) {
                if (leaseInfo.임대인구분 == '1') FlashError = E_IBX_REGNO_RESIDENT_NOTENTER;
                if (leaseInfo.임대인구분 == '2') FlashError = E_IBX_REGNO_COMPANY_NOTENTER;
                if (leaseInfo.임대인구분 == '3') FlashError = E_IBX_I10X11_CORP_REGIST_NO_NOTENTER;

                this.setError(FlashError);
                this.iSASInOut.Output.ErrorMessage = "임대인정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return FlashError;
            }
            if (!IsCurrency(leaseInfo.임대인정보)) {
                if (leaseInfo.임대인구분 == '1') FlashError = E_IBX_REGNO_RESIDENT_INVALID;
                if (leaseInfo.임대인구분 == '2') FlashError = E_IBX_REGNO_COMPANY_INVALID;
                if (leaseInfo.임대인구분 == '3') FlashError = E_IBX_I10X11_CORP_REGIST_NO_INVALID;

                this.setError(FlashError);
                this.iSASInOut.Output.ErrorMessage = "잘못된 임대인정보입니다. 확인 후 거래하시기 바랍니다.";
                return FlashError;
            }

            leaseInfo.임대인정보 = sas.SecureData.create(leaseInfo.임대인정보);
       
            //1. 암호화 되어 있을 경우
            if (leaseInfo.임대인정보.isSecurData()) {
                this.log('임대인정보 SASSecurData 포맷!');
            } else {
                this.log('임대인정보 일반 포맷!');
            }

            // 임대인구분 1: 주민등록번호 일 때 성명 필수
            if (leaseInfo.임대인구분 == '1' && !leaseInfo.성명) {
                this.setError(E_IBX_P00012_NAME_NOENTER);
                return E_IBX_P00012_NAME_NOENTER;
            }
            if (leaseInfo.성명) {
                leaseInfo.성명 = sas.SecureData.create(leaseInfo.성명);
                if (leaseInfo.성명.isSecurData()) {
                    this.log('성명 SASSecurData 포맷!');
                } else {
                    this.log('성명 일반 포맷!');
                }
            }
            if (!leaseInfo.부동산소재지) {
                this.setError(E_IBX_A97XX1_ADDRESS_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "부동산소재지 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A97XX1_ADDRESS_NOTENTER;
            }
            if (whatIsIt(leaseInfo.부동산소재지) != 'Object') {
                this.setError(E_IBX_P10001_ADDRESS_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 부동산소재지 입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_P10001_ADDRESS_INVALID;
            }
            if (!leaseInfo.부동산소재지.주소정보) {
                this.setError(E_IBX_A97XX1_ADDRESS_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "주소정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A97XX1_ADDRESS_NOTENTER;
            }
            
            try {
                var 주소정보i = JSON.parse(Base64.decode(leaseInfo.부동산소재지.주소정보));
                var 기타주소i = (leaseInfo.부동산소재지.기타주소 ? leaseInfo.부동산소재지.기타주소: "");
            } catch (e) {
                this.log("사업장소재지정보 주소정보 JSON파싱 실패(i): " + e.message);
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업장소재지정보 주소정보입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            // 사이트 기준 
            // 사업장 단체소재지와 동일한 주소여야하며
            // 동일한 주소의 임대차정보를 2건 이상 입력불가 하므로 오류처리
            if (i > 0) {
                for (var j = 0; j < 임대차정보.length; j++) {
                    if (i == j) continue;
                    try {
                        var 주소정보j = JSON.parse(Base64.decode(임대차정보[j].부동산소재지.주소정보));
                        var 기타주소j = (임대차정보[j].부동산소재지.기타주소 ? 임대차정보[j].부동산소재지.기타주소: "");
                    } catch (e) {
                        this.log("사업장소재지정보 주소정보 JSON파싱 실패(j): " + e.message);
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 사업장소재지정보 주소정보입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }

		            // 주소정보 및 기타주소 동일 시 오류 처리함.
		            if (주소정보i.cmTxhfOgzCd == 주소정보j.cmTxhfOgzCd &&
			            기타주소i == 기타주소j) {

			            this.setError(E_IBX_PARAMETER_INVALID);
			            this.iSASInOut.Output.ErrorMessage = "기등록(접수)된 임대차 목적물 소재지입니다.";
			            return E_IBX_PARAMETER_INVALID;
		            }
                }
            }
            if (!leaseInfo.계약일자) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "계약일자 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
            }
            if (leaseInfo.계약일자.length != 8 || isNaN(leaseInfo.계약일자)) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약일자입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_INVALID;
            }
            var tmpDate = new Date(leaseInfo.계약일자.substring(0, 4), parseInt(leaseInfo.계약일자.substring(4, 6)) - 1, leaseInfo.계약일자.substring(6, 8));
            if (tmpDate.yyyymmdd() != leaseInfo.계약일자) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약일자입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_INVALID;
            }
            // 계약일자 오늘 날짜 이후 불가
            if (parseInt(leaseInfo.계약일자) > parseInt(new Date().yyyymmdd())) {
                this.setError(E_IBX_ENUM_DATE_END_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약일자입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_END_INVALID;
            }    
            // 계약시작일&종료일은 미래날짜 가능
            if (!leaseInfo.계약시작일) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "계약시작일 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
            }
            if (leaseInfo.계약시작일.length != 8 || isNaN(leaseInfo.계약시작일)) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약시작일입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_INVALID;
            }
            tmpDate = new Date(leaseInfo.계약시작일.substring(0, 4), parseInt(leaseInfo.계약시작일.substring(4, 6)) - 1, leaseInfo.계약시작일.substring(6, 8));
            if (tmpDate.yyyymmdd() != leaseInfo.계약시작일) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약시작일입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_INVALID;
            }
            if (!leaseInfo.계약종료일) {
                this.setError(E_IBX_ENUM_DATE_END_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "계약종료일 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_END_NOTENTER;
            }
            if (leaseInfo.계약종료일.length != 8 || isNaN(leaseInfo.계약종료일)) {
                this.setError(E_IBX_ENUM_DATE_END_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약종료일입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_END_INVALID;
            }
            tmpDate = new Date(leaseInfo.계약종료일.substring(0, 4), parseInt(leaseInfo.계약종료일.substring(4, 6)) - 1, leaseInfo.계약종료일.substring(6, 8));
            if (tmpDate.yyyymmdd() != leaseInfo.계약종료일) {
                this.setError(E_IBX_ENUM_DATE_END_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 계약종료일입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_END_INVALID;
            }
            if (parseInt(leaseInfo.계약시작일) > parseInt(leaseInfo.계약종료일)) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_GREATTHENEND);
                return E_IBX_ENUM_DATE_BEGIN_GREATTHENEND;
            }
            if (leaseInfo.전세보증금 && !IsCurrency(leaseInfo.전세보증금)) {
                this.setError(E_IBX_PRODUCT_PRICE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 전세보증금입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PRODUCT_PRICE_INVALID;
            }
            if (leaseInfo.월세 && !IsCurrency(leaseInfo.월세)) {
                this.setError(E_IBX_PRODUCT_PRICE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 월세입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PRODUCT_PRICE_INVALID;
            }
            if (leaseInfo.임대인전화 && !IsCurrency(leaseInfo.임대인전화)) {
                this.setError(E_IBX_K2006X_PHONE_NUMBER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 임대인전화입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_K2006X_PHONE_NUMBER_INVALID;
            }
            if (!leaseInfo.면적) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "면적 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (!IsCurrency(leaseInfo.면적)) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 면적입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (leaseInfo.면적.length > 13) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 면적입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }

            system.setStatus(IBXSTATE_ENTER, 50);
            this.url = '/permission.do?screenId=UTEABAAA66';
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log("session_1: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('"errorMsg":"login"') > -1 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            try {
                var jsonStr = JSON.parse(ResultStr).resultMsg.sessionMap;
                var myTin = jsonStr.tin;
            } catch (e) {
                this.log("JSON ERROR 1 :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            system.setStatus(IBXSTATE_EXECUTE, 60);
            this.url = '/wqAction.do?actionId=ATEABZAA001K01&screenId=UTEABAAA66&popupYn=true&realScreenId=';
            var postData = {};
            postData.txprClsfCd = '0' + leaseInfo.임대인구분;
            postData.txprDscmNo = leaseInfo.임대인정보.getPlainText();
            postData.txprNm = (leaseInfo.임대인구분 == '1' ? leaseInfo.성명.getPlainText() : '');
            postData.txaaCheckYn = jsonStr.txaaYn;
            postData.cvaKndCd = "A2004";
            postData.txprNmMskYn = (leaseInfo.임대인구분 == '1' ? 'Y' : '');  // 납세자명 마스킹 여부

            this.postData = JSON.stringify(postData);
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("permission.do:[" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }

            try {
                var txprInfr = JSON.parse(ResultStr).txprInfr;
                var crpInfr = JSON.parse(ResultStr).crpInfr;
            } catch (e) {
                this.log("JSON ERROR 1 :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }

            // 개인일 때 데이터 검증
            if (leaseInfo.임대인구분 == '1') {

                if (leaseInfo.임대인정보.getLength() != 13) {
                    this.setError(E_IBX_REGNO_RESIDENT_INVALID);
                    return E_IBX_REGNO_RESIDENT_INVALID;
                }

                system.setStatus(IBXSTATE_EXECUTE, 70);
                this.url = '/wqAction.do?actionId=ATECMBEA001R01&screenId=UTEABAAA66';
                postData = {};
                postData.txprDscmNo = leaseInfo.임대인정보.getPlainText();
                postData.txprNm = leaseInfo.성명.getPlainText();
                postData.onlnBmanRstnClCd = '01';   // 임대차

                this.postData = JSON.stringify(postData);
                if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log("개인 임대인 검증:[" + ResultStr + "]");

                if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                    ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SESSION_CLOSED);
                    return E_IBX_SESSION_CLOSED;
                }
                if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                    ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SERVICE_LOGOUT);
                    return E_IBX_SERVICE_LOGOUT;
                }

                try {
                    jsonStr = JSON.parse(ResultStr);
                    var srvcStatCd = jsonStr.srvcStatCd;
                } catch (e) {
                    this.log("JSON ERROR 1 :: " + e.message);
                    this.setError(E_IBX_SITE_INVALID + 2);
                    return E_IBX_SITE_INVALID + 2;
                }
                if (srvcStatCd == 'X') {
                    this.setError(E_IBX_SERVICE_DENIED);
                    this.iSASInOut.Output.ErrorMessage = "연속 입력 오류로 인하여 서비스가 제한되었습니다. 현재 이용하는 서비스의 당일 이용이 불가하니 필요시에는 세무서로 방문해주세요. (다음날 다시 이용 가능합니다)";
                    return E_IBX_SERVICE_DENIED;
                }
                if (srvcStatCd != 'Y') {
                    this.setError(E_IBX_REGNO_RESIDENT_WRONG_USER);
                    this.iSASInOut.Output.ErrorMessage = "주민등록번호와 성명이 일치하지 않습니다." + srvcStatCd + "회 오류입니다.(개인정보보호를 위해) 연속해서 3회 오류 시,당일 해당서비스 이용이 제한됩니다.다음날 다시 이용하거나 세무서 방문하여 신청하시기 바랍니다.";
                    return E_IBX_REGNO_RESIDENT_WRONG_USER;
                }

                try {
                    if (myTin == txprInfr.tin) {
                        this.setError(E_RESULT_REGNO_TARGETREGNO_EQUAL);
                        this.iSASInOut.Output.ErrorMessage = "대표자와 임대인 정보가 동일합니다. 다시 확인해 주세요.";
                        return E_RESULT_REGNO_TARGETREGNO_EQUAL;
                    }
                } catch (e) {
                    this.log("JSON ERROR 1 :: " + e.message);
                    this.setError(E_IBX_SITE_INVALID + 3);
                    return E_IBX_SITE_INVALID + 3;
                }

            }
            if (!txprInfr) {
                if (leaseInfo.임대인구분 == '1') {
                    this.setError(E_IBX_SITE_INVALID + 4);
                    return E_IBX_SITE_INVALID + 4;
                } else {
                    if (leaseInfo.임대인구분 == '2') FlashError = E_IBX_REGNO_COMPANY_INVALID;
                    if (leaseInfo.임대인구분 == '3') FlashError = E_IBX_I10X11_CORP_REGIST_NO_INVALID;
                    this.setError(FlashError);
                    return FlashError;
                }
            }

            if (leaseInfo.임대인구분 == '1' || leaseInfo.임대인구분 == '2') {
                임대차정보[i].임대차Result = txprInfr;
            } else {
                임대차정보[i].임대차Result = txprInfr;
                임대차정보[i].임대차법인Result = crpInfr;
            }
            타가면적 += Number(leaseInfo.면적);
        }

        this.임대차정보 = {};
        this.임대차정보.자가면적 = 자가면적;
        this.임대차정보.타가면적 = 타가면적.toString();
        this.임대차정보.임대차정보 = 임대차정보;    // 입력값

        system.setStatus(IBXSTATE_RESULT, 90);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_정보입력조회_임대차 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_정보입력조회_사이버몰 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_정보입력조회_사이버몰 호출 [" + moduleVersion + "]");
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        // 각 조회구분마다 선행처리 job이달라 오류메시지 처리가 모호하여 기본 오류메시지로 처리
        if (this.chkStep3 != '3' && this.chkStep3 != '4') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }
        if (!this.is사이버몰) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            this.iSASInOut.Output.ErrorMessage = "통신판매(전자상거래, 해외직구대행 등)를 하실건가요?를 'Y'로 응답 시에 호출 가능합니다.";
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }

        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = aInput.Input;
        var 사이버몰정보 = input.사이버몰정보;
        if (!사이버몰정보) {
            this.setError(E_IBX_PARAMETER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "사이버몰정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_NOTENTER;
        }
        if (whatIsIt(사이버몰정보) != 'Array') {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 사이버몰정보입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        for (var i = 0; i < 사이버몰정보.length; i++) {
            var Cyml = 사이버몰정보[i];

            if (!Cyml.명칭) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사이버몰 명칭 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (!Cyml.도메인) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사이버몰 도메인 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }

            if ("http://www.".indexOf(Cyml.도메인) != -1 || "https://www.".indexOf(Cyml.도메인) != -1) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사이버몰정보 도메인입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }

            for (var j = 0; j < 사이버몰정보.length; j++) {
                if (i == j) continue;

                var CymlTemp = 사이버몰정보[j];

                if (Cyml.명칭 == CymlTemp.명칭) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "사이버몰 명칭이 중복됩니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
                if (Cyml.도메인 == CymlTemp.도메인) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "사이버몰 도메인이 중복됩니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
            }
        }

        this.사이버몰정보 = 사이버몰정보;

        system.setStatus(IBXSTATE_RESULT, 90);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_정보입력조회_사이버몰 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_정보입력조회_서류송달 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_정보입력조회_서류송달 호출 [" + moduleVersion + "]");
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        // 각 조회구분마다 선행처리 job이달라 오류메시지 처리가 모호하여 기본 오류메시지로 처리
        if (this.chkStep3 != '3' && this.chkStep3 != '4') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }
        if (!this.is서류송달) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            this.iSASInOut.Output.ErrorMessage = "국세관련 우편수령장소를 사업장이 아닌 다른 주소로 지정하시겠습니까?를 'Y'로 응답 시에 호출 가능합니다.";
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }

        this.서류송달정보 = [];
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = aInput.Input;
        var 서류송달정보 = input.서류송달정보;

        if (!서류송달정보) {
            this.setError(E_IBX_PARAMETER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "서류송달정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_NOTENTER;
        }
        if (whatIsIt(서류송달정보) != 'Array') {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 서류송달정보입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        // 사이트에서 한가지만 입력가능
        if (서류송달정보.length != 1) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 서류송달정보입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        for (var i = 0; i < 서류송달정보.length; i++) {
            var documentDelivery = 서류송달정보[i];

            if (!documentDelivery.구분) {
                this.setError(E_IBX_A124X1_INQUIRY_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A124X1_INQUIRY_TYPE_NOTENTER;
            }
            // 송달받을 장소
            // 1: 주민등록상주소, 2: 기타, 3: 해당없음
            if (['1', '2', '3'].indexOf(documentDelivery.구분) < 0) {
                this.setError(E_IBX_A124X1_INQUIRY_TYPE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A124X1_INQUIRY_TYPE_INVALID;
            }

            if (documentDelivery.구분 == '1') {
                if (!documentDelivery.주소자동이전여부) {
                    this.setError(E_IBX_PARAMETER_NOTENTER);
                    this.iSASInOut.Output.ErrorMessage = "주소자동이전여부 미입력입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_NOTENTER;
                }
                if (['Y', 'N'].indexOf(documentDelivery.주소자동이전여부) < 0) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 주소자동이전여부입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
            }
            if (documentDelivery.구분 == '2') {
                if (!documentDelivery.송달장소) {
                    this.setError(E_IBX_A97XX1_ADDRESS_NOTENTER);
                    this.iSASInOut.Output.ErrorMessage = "송달장소 미입력입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_A97XX1_ADDRESS_NOTENTER;
                }
                if (whatIsIt(documentDelivery.송달장소) != 'Object') {
                    this.setError(E_IBX_P10001_ADDRESS_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 송달장소입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_P10001_ADDRESS_INVALID;
                }
                try {
                    var 송달주소정보 = JSON.parse(Base64.decode(documentDelivery.송달장소.주소정보));
                } catch (e) {
                    this.log("서류송달정보 송달장소 JSON파싱 실패: " + e.message);
                    this.setError(E_IBX_P10001_ADDRESS_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 송달장소입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_P10001_ADDRESS_INVALID;
                }
            }
        }

        this.서류송달정보 = 서류송달정보;

        system.setStatus(IBXSTATE_RESULT, 90);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_정보입력조회_서류송달 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_정보입력조회 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_정보입력조회 호출 [" + moduleVersion + "]");
    try {
        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // 파일제출 변수 초기화 (제출서류 등록 후 최종제출없이 다른JOB호출하는 경우 최종제출에서 문제될 수 있어 초기화)
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;

        // 각 조회구분마다 선행처리 job이달라 오류메시지 처리가 모호하여 기본 오류메시지로 처리
        if (this.chkStep3 != '3' && this.chkStep3 != '4') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }

        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = dec(aInput.Input);
        var 입력구분 = input.입력구분;
        var 기본정보 = input.기본정보;
        var 사업장소재지정보 = input.사업장소재지정보;
        var 업종정보 = input.업종정보;
        var 사업자유형정보 = input.사업자유형정보;
        var 선택사항 = input.선택사항;

        /*  입력된 입력구분에 따라 내용 업데이트
            “1”: 선택 / “0”: 미선택
            0000 : 결과조회 (사이트에 저장된 결과 조회 or 임대/사이버/서류송달 수정한게 있으면 갱신)
            입력 자리수 XXXX (4자리)
             - 첫번째 자리수: 기본정보
             - 두번째 자리수: 사업장소재지정보
             - 세번째 자리수: 업종정보
             - 네번째 자리수: 사업자유형정보 
        */
        if (!입력구분) {
            this.setError(E_IBX_TRANS_TYPE_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "입력구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_NOTENTER;
        }
        if (입력구분.length != 4) {
            this.setError(E_IBX_TRANS_TYPE_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 입력구분입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_INVALID;
        }

        // 신규신청일때는 입력구분 1111이어야함 - 사이트에서 4가지 항목 필수
        if (this.사업자등록신청_조회구분 == '1') {
            // 이전 내역
            this.log("사업자등록신청_사업특성입력조회:[" + JSON.stringify(this.사업특성선택사항) + ']');
            if (입력구분 != '1111') {
                this.setError(E_IBX_TRANS_TYPE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 입력구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_TRANS_TYPE_INVALID;
            }
            // 신규신청인데 임대차 질문지 호출 안한 case
            if (this.is임대차 && Object.keys(this.임대차정보).length == 0) {
                this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
                this.iSASInOut.Output.ErrorMessage = "사업자등록신청_정보입력조회_임대차 단계부터 재실행해 주십시오.";
                return E_IBX_SERVICE_NEED_PREPROCESSING;
            }
            // 신규신청인데 사이버몰 질문지 호출 안한 case
            if (this.is사이버몰 && this.사이버몰정보.length == 0) {
                this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
                this.iSASInOut.Output.ErrorMessage = "사업자등록신청_정보입력조회_사이버몰 단계부터 재실행해 주십시오.";
                return E_IBX_SERVICE_NEED_PREPROCESSING;
            }
            // 신규신청인데 서류송달 질문지 호출 안한 case
            if (this.is서류송달 && this.서류송달정보.length == 0) {
                this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
                this.iSASInOut.Output.ErrorMessage = "사업자등록신청_정보입력조회_송달정보 단계부터 재실행해 주십시오.";
                return E_IBX_SERVICE_NEED_PREPROCESSING;
            }
        }

        // 임대차 정보 입력된 case
        if (Object.keys(this.임대차정보).length > 0) {
            this.log("정보입력조회_임대차:[" + JSON.stringify(this.임대차정보) + ']');
        }
        if (this.사이버몰정보.length > 0) {
            this.log("정보입력조회_사이버몰:[" + JSON.stringify(this.사이버몰정보) + ']');
        }
        if (this.서류송달정보.length > 0) {
            this.log("정보입력조회_서류송달정보:[" + JSON.stringify(this.서류송달정보) + ']');
        }

        var 기본정보flag = 입력구분.substr(0, 1);
        var 사업장소재지정보flag = 입력구분.substr(1, 1);
        var 업종정보flag = 입력구분.substr(2, 1);
        var 사업자유형정보flag = 입력구분.substr(3, 1);

        if (['0', '1'].indexOf(기본정보flag) < 0 ||
            ['0', '1'].indexOf(사업장소재지정보flag) < 0 ||
            ['0', '1'].indexOf(업종정보flag) < 0 ||
            ['0', '1'].indexOf(사업자유형정보flag) < 0) {
            this.setError(E_IBX_TRANS_TYPE_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 입력구분입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_INVALID;
        }

        if (기본정보flag == '1') {
            if (!기본정보) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "기본정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (whatIsIt(기본정보) != 'Object') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 기본정보입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (!기본정보.개업일자) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "기본정보 개업일자 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_NOTENTER;
            }
            if (!IsCurrency(기본정보.개업일자) || 기본정보.개업일자.length != 8) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 기본정보 개업일자입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_INVALID;
            }
            var tmpDate = new Date(기본정보.개업일자.substring(0, 4), parseInt(기본정보.개업일자.substring(4, 6)) - 1, 기본정보.개업일자.substring(6, 8));
            if (tmpDate.yyyymmdd() != 기본정보.개업일자) {
                this.setError(E_IBX_ENUM_DATE_BEGIN_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 기본정보 개업일자입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_ENUM_DATE_BEGIN_INVALID;
            }
        }
        if (사업장소재지정보flag == '1') {
            if (!사업장소재지정보) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업장소재지정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (whatIsIt(사업장소재지정보) != 'Object') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업장소재지정보입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (!사업장소재지정보.주소정보) {
                this.setError(E_IBX_A97XX1_ADDRESS_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업장소재지정보 주소정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_A97XX1_ADDRESS_NOTENTER;
            }
        }
        if (업종정보flag == '1') {
            if (!업종정보) {
                this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_TRANS_TYPE_NOTENTER;
            }
            if (whatIsIt(업종정보) != 'Array') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (업종정보.length == 0) {
                this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_TRANS_TYPE_NOTENTER;
            }
        }
        var 사업자유형정보_유형 = '', 간이과세포기신고여부 = '';
        if (사업자유형정보flag == '1') {
            if (!사업자유형정보) {
                this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업자유형정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_TRANS_TYPE_NOTENTER;
            }
            if (whatIsIt(사업자유형정보) != 'Object') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업자유형정보입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (!사업자유형정보.유형) {
                this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "사업자유형정보 유형 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_TRANS_TYPE_NOTENTER;
            }
            if (사업자유형정보.종교단체여부) {
                if (['여', '부'].indexOf(사업자유형정보.종교단체여부) < 0) {
                    this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 사업자유형정보 종교단체여부입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_TRANS_TYPE_NOTENTER;
                }
            }
            // 종교 관련 로직은 미개발
            if (사업자유형정보.유형 == '4' || 사업자유형정보.유형 == '5' || 사업자유형정보.종교단체여부 == '여') {
                this.setError(E_IBX_SERVICE_MISC);
                return E_IBX_SERVICE_MISC;
            }

            // 사이트 기준 쿼리
            if (사업자유형정보.유형 == '1') 사업자유형정보_유형 = '01';
            else if (사업자유형정보.유형 == '2') 사업자유형정보_유형 = '02';
            else if (사업자유형정보.유형 == '3') 사업자유형정보_유형 = '04';
            else if (사업자유형정보.유형 == '4') 사업자유형정보_유형 = '06';
            else if (사업자유형정보.유형 == '5') 사업자유형정보_유형 = '07';
            else{
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업자유형정보 유형입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }

            if (사업자유형정보.간이과세포기신고여부) {
                if (['여', '부'].indexOf(사업자유형정보.간이과세포기신고여부) < 0) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 사업자유형정보 간이과세포기신고여부입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
                if (사업자유형정보.간이과세포기신고여부 == '여') 간이과세포기신고여부 = 'Y';
                else 간이과세포기신고여부 = 'N';
            }
        }

        var 인허가사업여부 = "", 의제주류면허신청 = "", 개별소비세해당여부 = "";
        if (선택사항) {
            if (whatIsIt(선택사항) != 'Object') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 선택사항입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            // 미입력, 부: 부, 여: 여
            if (선택사항.인허가사업여부) {

                if (['여', '부'].indexOf(선택사항.인허가사업여부) < 0) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 선택사항 인허가사업여부입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
                if (선택사항.인허가사업여부 == '여') 인허가사업여부 = 'Y';
                else 인허가사업여부 = 'N';

            }
            // 1: 없음, 2: 의제판매업 일반소매, 3: 의제판매업 유흥음식점
            if (선택사항.의제주류면허신청) {
                if (['1', '2', '3'].indexOf(선택사항.의제주류면허신청) < 0) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 선택사항 의제주류면허신청입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }

                if (선택사항.의제주류면허신청 == '1'){
                    의제주류면허신청 = 'N'; // 미입력과 구분..
                }else if (선택사항.의제주류면허신청 == '2') {
                    의제주류면허신청 = '541';
                } else if (선택사항.의제주류면허신청 == '3') {
                    의제주류면허신청 = '542';
                }
            }

            if (선택사항.개별소비세해당여부) {
                // 개별소비세해당여부검증
                var pageInfoVO, totalCount = '';
                var pageNum = 0;

                var content_type = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';
                while (true) {
                    pageNum++;
        
                    this.url = "/wqAction.do?actionId=ATCCMAAA001R01&screenId=UTECMAAA06&popupYn=true&realScreenId=";

                    postData = {};
                    postData.cmnClsfCd = "10089";
                    postData.cmnClsfCdKrnNm = "개별소비세과세구분코드";
                    postData.strtCdVval = "";
                    postData.endCdVval = "";
                    postData.cdVvalKrnNm = "";
                    postData.inqrBaseDd = js_yyyy_mm_dd();
                    postData.clCntn = "Y";
                    postData.hrnkVvalSameYn = "";
                    postData.inqrBaseDtUseYn = "";
                    postData.pageInfoVO0 = {};
                    postData.pageInfoVO0.pageNum = pageNum.toString();
                    postData.pageInfoVO0.pageSize = "10";
                    postData.pageInfoVO0.totalCount = "";
                    this.postData = JSON.stringify(postData);
                    if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                        this.setError(E_IBX_FAILTOGETPAGE);
                        return E_IBX_FAILTOGETPAGE;
                    }
                    ResultStr = httpRequest.result;
                    this.log('코드검증_1_' + pageNum.toString() + ' : [' + ResultStr + ']');
        
                    if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                        ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                        this.bLogIn = false;
                        this.setError(E_IBX_SESSION_CLOSED);
                        return E_IBX_SESSION_CLOSED;
                    }
                    if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                        ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                        this.bLogIn = false;
                        this.setError(E_IBX_SERVICE_LOGOUT);
                        return E_IBX_SERVICE_LOGOUT;
                    }
                    if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                        ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                        ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                        this.setError(E_IBX_SITE_INTERNAL);
                        return E_IBX_SITE_INTERNAL;
                    }
        
                    if (ResultStr.indexOf('조회된 데이터가 없습니다') >= 0) {
                        if (pageNum == 1) {
                            this.setError(E_IBX_PARAMETER_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 선택사항 개별소비세해당여부 입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_PARAMETER_INVALID;
                        } else { break; }
                    }

                    try {
                        pageInfoVO = JSON.parse(ResultStr).pageInfoVO0;
                        var cmnCdAdmDVOList = JSON.parse(ResultStr).cmnCdAdmDVOList;
                    } catch (e) {
                        this.log("exception :: " + e.message);
                        this.setError(E_IBX_SITE_INVALID + 2);
                        return E_IBX_SITE_INVALID + 2;
                    }
        
                    totalCount = parseInt(pageInfoVO.totalCount);
                    if (totalCount == 0) {
                        if (pageNum == 1) {
                            this.setError(E_IBX_SITE_INVALID + 3);
                            return E_IBX_SITE_INVALID + 3;
                        } else { break; }
                    }
        
                    for (var idx = 0; idx < cmnCdAdmDVOList.length; idx++) {
                        var ResultItem = cmnCdAdmDVOList[idx];

                        if (선택사항.개별소비세해당여부 == ResultItem.cdVval) {
                            개별소비세해당여부 = 선택사항.개별소비세해당여부;
                            break;
                        }
                    }
        
                    //다음페이지 or 개별소비세해당여부 셋팅
                    if ((pageNum * 10) > parseInt(totalCount) || 개별소비세해당여부) break;
                }

                if (!개별소비세해당여부) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 선택사항 개별소비세해당여부 입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
            }
        }

        

        system.setStatus(IBXSTATE_ENTER, 30);
        var JsonResult;
        var postData = {};
        var 신청된정보 = {};
        var myInfo = {};

        // 조회구분 1: 신규작성: 바로 신청하기 페이지
        // 조회구분 2: 불러오기: 불러오기 -> 수정하기
        // 국세증명·사업자등록 세금관련 신청/신고 > 사업자등록 신청·정정·휴폐업 > 개인 사업자등록 신청 > 개인 사업자등록 신청
        if (this.사업자등록신청_조회구분 == '1') {
            system.setStatus(IBXSTATE_ENTER, 40);
            this.url = '/wqAction.do?actionId=ATTABZAA001R01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
            postData = {};
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;
            postData.cvaId = '';
            postData.cvaKndCd = 'A2004';
            postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;

            this.postData = JSON.stringify(postData);
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('정보입력조회(신규)_1 :: [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }
            try {
                myInfo = JSON.parse(ResultStr).ntplBscInfrInqrDVO;
                this.본인주소정보 = myInfo;
            } catch (e) {
                this.setError(E_IBX_SITE_INVALID + 5);
                return E_IBX_SITE_INVALID + 5;
            }
            system.setStatus(IBXSTATE_ENTER, 45);
            this.url = '/wqAction.do?actionId=ATEABAAA006R06&screenId=UTEABAAA59&popupYn=false&realScreenId=';
            postData = {};
            postData.bmanRgtClCd = '01';    // 신청등록
            postData.cvaId = '';
            postData.cvaKndCd = 'A2004';
            postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;

            this.postData = JSON.stringify(postData);
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('정보입력조회(신규)_2 :: [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            try {
                JsonResult = JSON.parse(ResultStr);
                var waitCvaIdList = JsonResult.waitCvaIdList;
            } catch (e) {
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            // 새로 신청하기
            var 업종tmp = '';
            var item = {};

            var querryData = {};    // 업종등록
            querryData.bsafPtusCmnClsfCd = "14479";
            querryData.vldtStrtDt = '00010101';
            querryData.bmanTfbDVOList = [];

            var is주업종 = false;
            var bmanTfbDVOList = [];
            system.setStatus(IBXSTATE_EXECUTE, 50);

            for (var idx = 0; idx < 업종정보.length; idx++) {

                var IndusInfo = 업종정보[idx];

                if (!IndusInfo.업종정보) {
                    this.setError(E_IBX_PARAMETER_NOTENTER);
                    this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_NOTENTER;
                }
                if (!IndusInfo.구분) {
                    this.setError(E_IBX_PARAMETER_NOTENTER);
                    this.iSASInOut.Output.ErrorMessage = "업종정보 구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_NOTENTER;
                }
                if (['주', '부'].indexOf(IndusInfo.구분) < 0) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }

                // 주업종은 하나만 등록가능
                if (is주업종 && IndusInfo.구분 == '주') {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
                if (IndusInfo.구분 == '주') is주업종 = true;

                try {
                    업종tmp = JSON.parse(Base64.decode(IndusInfo.업종정보));
                } catch (e) {
                    this.log("업종정보 입력값 JSON파싱 실패: " + e.message);
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }

                for (var idy = 0; idy < 업종정보.length; idy++) {
                    if (idx == idy) { continue; }

                    try {
                        업종idy = JSON.parse(Base64.decode(업종정보[idy].업종정보));
                    } catch (e) {
                        this.log("업종정보 입력값 JSON파싱 실패: " + e.message);
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }

                    // 업종코드가 같으면 X
                    // 사이트:  선택한 업종은 이미 주업종으로 되어 있습니다.\n등록된 업종을 부업종으로 변경하시겠습니까?\n(단, 주업종은 다시 등록하셔야합니다.)
                    //          선택한 업종은 이미 부업종으로 등록되어 있습니다.\n등록된 업종을 주업종으로 변경하시겠습니까?\n(단, 이전 주업종은 삭제됩니다.)
                    if (업종tmp.tfbCd == 업종idy.tfbCd) {
                        this.log("업종정보 중복 입력!");
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }
                }

                system.setStatus(IBXSTATE_EXECUTE, 55);
                this.url = '/wqAction.do?actionId=ATTRNZZZ001R17&screenId=UTEABAAP09&popupYn=true&realScreenId=';
                postData = {};
                postData.attrYr = 업종tmp.attrYr;
                postData.tfbCd = 업종tmp.tfbCd;
                postData.bcNm = 업종tmp.bcNm;
                postData.tfbDclsNm = 업종tmp.tfbDclsNm;
                postData.buttonId = 업종tmp.buttonId;

                this.postData = JSON.stringify(postData);
                if (!httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData)) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log('업종등록' + idx + ' : [' + ResultStr + ']');

                if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                    ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SESSION_CLOSED);
                    return E_IBX_SESSION_CLOSED;
                }
                if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                    ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SERVICE_LOGOUT);
                    return E_IBX_SERVICE_LOGOUT;
                }
                if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                    ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                    ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                    this.setError(E_IBX_SITE_INTERNAL);
                    return E_IBX_SITE_INTERNAL;
                }

                try {
                    var schRslt = JSON.parse(ResultStr).schRslt;
                    var krStndIndsClCdDVO = JSON.parse(ResultStr).krStndIndsClCdDVO;
                    var krStndIndsClCdDVOList = JSON.parse(ResultStr).krStndIndsClCdDVOList;
                } catch (e) {
                    this.log("exception :: " + e.message);
                    this.setError(E_IBX_SITE_INVALID);
                    return E_IBX_SITE_INVALID;
                }

                // "LIST"인 경우 내역 존재
                if (krStndIndsClCdDVOList && krStndIndsClCdDVOList.length > 0 && schRslt == 'LIST') {
                    // 일부 업종은 산업분류코드 선택 필요
                    if (!IndusInfo.산업분류코드) {
                        this.setError(E_IBX_BUSINESS_CODE_NOTENTER);
                        this.iSASInOut.Output.ErrorMessage = "산업분류코드 미입력입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_BUSINESS_CODE_NOTENTER;
                    }
                    for (var idy = 0; idy < krStndIndsClCdDVOList.length; idy++) {
                        if (IndusInfo.산업분류코드 == krStndIndsClCdDVOList[idy].krStndIndsClsfCd) {
                            krStndIndsClCdDVO = krStndIndsClCdDVOList[idy];
                        }
                    }
                    if (!krStndIndsClCdDVO) {
                        this.setError(E_IBX_BUSINESS_CODE_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 산업분류코드 입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_BUSINESS_CODE_INVALID;
                    }

                    item = {};
                    item.blank = "";
                    item.chk = "";
                    item.mtfbYn = (IndusInfo.구분 == '주' ? 'Y' : 'N');
                    item.tfbCd = krStndIndsClCdDVO.tfbCd;
                    item.bcNm = 업종tmp.bcNm;
                    item.itmNm = 업종tmp.tfbDclsNm;
                    item.krStndIndsClsfNm = '(' + krStndIndsClCdDVO.krStndIndsClsfCd + ') ' + krStndIndsClCdDVO.krStndIndsClsfNm;
                    item.modifyBtnTfb = "수정";
                    item.krStndIndsClsfCd = krStndIndsClCdDVO.krStndIndsClsfCd;
                    item.applcBaseDcnt = 업종tmp.applcBaseDcnt;
                    item.csmrOpstTfbYn = "";
                    item.cshptDutyPblTfbYn = "";
                    item.statusValue = "C";

                } else {
                    if (!krStndIndsClCdDVO) {
                        this.setError(E_IBX_SITE_INVALID + 1);
                        return E_IBX_SITE_INVALID + 1;
                    }
                    // 산업분류코드 필요없는데 입력된 케이스
                    if (IndusInfo.산업분류코드) {
                        this.setError(E_IBX_BUSINESS_CODE_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 산업분류코드 입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_BUSINESS_CODE_INVALID;
                    }
                    item = {};
                    item.blank = "";
                    item.chk = "";
                    item.mtfbYn = (IndusInfo.구분 == '주' ? 'Y' : 'N');
                    item.tfbCd = krStndIndsClCdDVO.tfbCd;
                    item.bcNm = krStndIndsClCdDVO.krStndIndsClsfNm;
                    item.itmNm = krStndIndsClCdDVO.krStndIndsLcsNm;
                    item.krStndIndsClsfNm = '(' + krStndIndsClCdDVO.krStndIndsClsfCd + ') ' + krStndIndsClCdDVO.krStndIndsClsfNm;
                    item.modifyBtnTfb = "수정";
                    item.krStndIndsClsfCd = krStndIndsClCdDVO.krStndIndsClsfCd;
                    item.applcBaseDcnt = 업종tmp.applcBaseDcnt;
                    item.csmrOpstTfbYn = "";
                    item.cshptDutyPblTfbYn = "";
                    item.statusValue = "C";

                }
               
                querryData.bmanTfbDVOList.push(item);
            }
            // 주업종 하나이상 필수 입력
            if (!is주업종) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "주업종은 필수로 선택해야합니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }

            system.setStatus(IBXSTATE_EXECUTE, 60);
            this.url = '/wqAction.do?actionId=ATTABZAA001R15&screenId=UTEABAAP09&popupYn=true&realScreenId=';
            this.postData = JSON.stringify(querryData);
            if (!httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('업종등록 최종 : [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            try {
                bmanTfbDVOList = JSON.parse(ResultStr).bmanTfbDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }
            if (!bmanTfbDVOList) {
                this.setError(E_IBX_SITE_INVALID + 3);
                return E_IBX_SITE_INVALID + 3;
            }

            system.setStatus(IBXSTATE_EXECUTE, 65);
            this.url = '/wqAction.do?actionId=ATEABZAA001R01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
            postData = {};

            // 진짜 신청
            var storageData = {};
            storageData.bmanRgtClCd = '01';
            storageData.cvaId = '';
            storageData.cvaKndCd = 'A2004';
            storageData.removeWaitCvaYn = 'Y';  // 기존 접수대기중인 민원 삭제 여부
            storageData.tin = this.PC조회발급서비스homeTaxSession.tin;
            storageData.isSt1Amd = false;

            storageData.waitCvaIdList = waitCvaIdList; // 기존 접수 대기중인 민원 (있어야 이전 이력 사라짐!)

            storageData.ttiabcm001DVO = {};
            storageData.ttiabcm001DVO.bmanRcatClCd = "01"; // 신청
            storageData.ttiabcm001DVO.mtrgAplnYn = "N";
            storageData.ttiabcm001DVO.bmanClCd = "";

            storageData.ttiabcm002DVO = {};
            storageData.ttiabcm002DVO.aprsCpamt = "";
            storageData.ttiabcm002DVO.beesDt = "";                      // 공동사업자
            storageData.ttiabcm002DVO.bmanRgtClCd = "01";               // 신청등록
            storageData.ttiabcm002DVO.cshptMrntJnngHopeYn = "N";
            storageData.ttiabcm002DVO.emplCnt = "";                     // 종업원수 (미지원)
            storageData.ttiabcm002DVO.gpBsYn = (인허가사업여부 ? 인허가사업여부 : 'N');  // 인허가사업 제출 목록 여부
            storageData.ttiabcm002DVO.invmAmt = "";                     // 출자금 (공동사업자)
            storageData.ttiabcm002DVO.jntBmanYn = "N";                  // 공동사업자
            storageData.ttiabcm002DVO.lfAlLcnTypeCd = StrReplace(의제주류면허신청, 'N', '');  // 의제주류면허신청
            storageData.ttiabcm002DVO.ofbDt = 기본정보.개업일자;
            storageData.ttiabcm002DVO.onsCpamt = "";                    // 자기자금
            if (Object.keys(this.임대차정보).length > 0) {
                storageData.ttiabcm002DVO.pfbAnhsSfl = this.임대차정보.타가면적;
                storageData.ttiabcm002DVO.pfbMhSfl = this.임대차정보.자가면적;
                storageData.ttiabcm002DVO.pfbPsenClCd = "02";   // 자가,타가
            } else {
                storageData.ttiabcm002DVO.pfbMhSfl = "";
                storageData.ttiabcm002DVO.pfbPsenClCd = "01";  // 자가,타가
            }
            storageData.ttiabcm002DVO.pfbTlcAltAgrYn = "";                        // 소재지자동이전여부
            storageData.ttiabcm002DVO.rprsTin = this.PC조회발급서비스homeTaxSession.tin;
            storageData.ttiabcm002DVO.scntxTxtnClCd = 개별소비세해당여부;  // 개별소비세해당여부
            storageData.ttiabcm002DVO.sptxnAbdnRtnYn = (간이과세포기신고여부 ? 간이과세포기신고여부 : 'N');  // 간이과세 포기 신고 여부
            storageData.ttiabcm002DVO.tnmNm = (기본정보.상호명 ? 기본정보.상호명 : '');
            storageData.ttiabcm002DVO.vatTxtpeCd = 사업자유형정보_유형;

            // 사업자유형정보는 flag되어있지만 유형미입력인 케이스
            // -> 유형이 기존에 저장되어있다면 괜찮음
            if (!bmanTfbDVOList || bmanTfbDVOList.length == 0) {
                this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_TRANS_TYPE_NOTENTER;
            }

            storageData.ttiabcd005DVOList = [];

            for (var idx = 0; idx < bmanTfbDVOList.length; idx++) {
                item = {};

                업종tmp = bmanTfbDVOList[idx];

                item.blank = "";
                item.chk = "";
                item.mtfbYn = 업종tmp.mtfbYn;
                item.tfbCd = 업종tmp.tfbCd;
                item.bcNm = 업종tmp.bcNm;
                item.itmNm = 업종tmp.itmNm;
                item.csmrOpstTfbYn = 업종tmp.csmrOpstTfbYn;
                item.cshptDutyPblTfbYn = 업종tmp.cshptDutyPblTfbYn;
                item.krStndIndsClsfNm = 업종tmp.krStndIndsClsfNm;
                item.cnfr = "";   // 제출서류
                item.tfbCdBtnModify = "";   // 수정
                item.krStndIndsClsfCd = 업종tmp.krStndIndsClsfCd;
                item.applcBaseDcnt = 업종tmp.applcBaseDcnt;
                item.statusValue = "R";

                storageData.ttiabcd005DVOList.push(item);
            }

            storageData.ttiabcd028DVOList = [];    // 비과세단체코드
            storageData.ttiabcl020DVOList = [];
            storageData.ttiabam0763DVO = [];

            try {
                var 주소정보tmp = JSON.parse(Base64.decode(사업장소재지정보.주소정보));
            } catch (e) {
                this.log("사업장소재지정보 주소정보 JSON파싱 실패: " + e.message);
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 사업장소재지정보 주소정보입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            var addText = sfCm_getAddrText(주소정보tmp);

            var 사업장소재지주소querry = {};
            사업장소재지주소querry.bldBlckAdr = (사업장소재지정보.건물명 ? 사업장소재지정보.건물명 : _nullToEnpty(주소정보tmp.bldNm));
            사업장소재지주소querry.bldDnadr = (사업장소재지정보.동 ? 사업장소재지정보.동 : '');
            사업장소재지주소querry.bldFlorAdr = (사업장소재지정보.층 ? 사업장소재지정보.층 : '');
            사업장소재지주소querry.bldHoAdr = (사업장소재지정보.호 ? 사업장소재지정보.호 : '');
            사업장소재지주소querry.etcDadr = (사업장소재지정보.기타주소 ? 사업장소재지정보.기타주소 : '');
            사업장소재지주소querry.roadBscAdr = addText.roadBscAdr;
            사업장소재지주소querry.ldCd = _nullToEnpty(주소정보tmp.ldCd);
            사업장소재지주소querry.radio0 = "1";   // 선택
            사업장소재지주소querry.sggFrmyNm = _nullToEnpty(주소정보tmp.sggFrmyNm);
            사업장소재지주소querry.ymdgRdstNm = _nullToEnpty(주소정보tmp.ymdgRdstNm); // 지번주소
            사업장소재지주소querry.bunjHoAdr = _nullToEnpty(주소정보tmp.bunjHoAdr);
            사업장소재지주소querry.rltnLnmYn = _nullToEnpty(주소정보tmp.rltnLnmYn);
            사업장소재지주소querry.roadNm = _nullToEnpty(주소정보tmp.roadNm);
            사업장소재지주소querry.bldNo = _nullToEnpty(주소정보tmp.bldNo);
            사업장소재지주소querry.roadNmCd = _nullToEnpty(주소정보tmp.roadNmCd);
            사업장소재지주소querry.ymdgSn = _nullToEnpty(주소정보tmp.ymdgSn);
            사업장소재지주소querry.bldPmnoAdr = _nullToEnpty(주소정보tmp.bldPmnoAdr);
            사업장소재지주소querry.bldSnoAdr = _nullToEnpty(주소정보tmp.bldSnoAdr);
            사업장소재지주소querry.undrBldClCd = _nullToEnpty(주소정보tmp.undrBldClCd);
            사업장소재지주소querry.spcaCd = _nullToEnpty(주소정보tmp.spcaCd);
            사업장소재지주소querry.snadrYn = _nullToEnpty(주소정보tmp.snadrYn);
            사업장소재지주소querry.bunjAdr = _nullToEnpty(주소정보tmp.bunjAdr);
            사업장소재지주소querry.hoAdr = _nullToEnpty(주소정보tmp.hoAdr);
            사업장소재지주소querry.sidoNm = _nullToEnpty(주소정보tmp.sidoNm);
            사업장소재지주소querry.sggNm = _nullToEnpty(주소정보tmp.sggNm);
            사업장소재지주소querry.ymdgNm = _nullToEnpty(주소정보tmp.ymdgNm);
            사업장소재지주소querry.rdstNm = _nullToEnpty(주소정보tmp.rdstNm);
            사업장소재지주소querry.sggZip = _nullToEnpty(주소정보tmp.sggZip);
            사업장소재지주소querry.ymdgZip = _nullToEnpty(주소정보tmp.ymdgZip);
            사업장소재지주소querry.ymdgClCd = _nullToEnpty(주소정보tmp.ymdgClCd);
            사업장소재지주소querry.cmThofOgzCd = _nullToEnpty(주소정보tmp.cmThofOgzCd);
            사업장소재지주소querry.cmTxhfOgzCd = _nullToEnpty(주소정보tmp.cmTxhfOgzCd);
            사업장소재지주소querry.cmTxhfOgzNm = _nullToEnpty(주소정보tmp.cmTxhfOgzNm);
            사업장소재지주소querry.roadNmCdYmdgNm = _nullToEnpty(주소정보tmp.roadNmCdYmdgNm);
            사업장소재지주소querry.statusValue = 'U';
            사업장소재지주소querry.drcInptAdrYn = 'N';
            사업장소재지주소querry.zip = _nullToEnpty(주소정보tmp.sggZip) + _nullToEnpty(주소정보tmp.ymdgZip);
            사업장소재지주소querry.name = 'UTECMAAA02';
            사업장소재지주소querry.popCalId = 'bmanAdr';
            사업장소재지주소querry.ldBscAdr = addText.ldBscAdr;

            var 임대차cmTxhfOgzCd = 사업장소재지주소querry.cmTxhfOgzCd;
            var 주소querry = {};
            if (Object.keys(this.임대차정보).length > 0) {
                for (var idxx = 0; idxx < this.임대차정보.임대차정보.length; idxx++) {
                    var 임대차tmp = this.임대차정보.임대차정보[idxx];
                    try {
                        var 주소정보tmp = JSON.parse(Base64.decode(임대차tmp.부동산소재지.주소정보));
                    } catch (e) {
                        this.log("임대차tmp 주소정보 JSON파싱 실패: " + e.message);
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 임대차 부동산소재지 주소정보입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }
                    var addText = sfCm_getAddrText(주소정보tmp);

                    var 임대차정보querry = {};
                    임대차정보querry.blank2 = "";
                    임대차정보querry.chk = "";
                    if (임대차tmp.임대인구분 == '1') {  // 개인
                        임대차정보querry.lsorRprsResno = 임대차tmp.임대차Result.txprDscmNoEncCntn;
                        임대차정보querry.rprsNm = 임대차tmp.임대차Result.txprNm;
                        임대차정보querry.lsorBmanNo = "";
                        임대차정보querry.lsorNtplTin = 임대차tmp.임대차Result.tin;
                        임대차정보querry.lsorBmanTin = "";
                        임대차정보querry.lsorCrpBmanYn = "";
                        임대차정보querry.lsorCrpTin = '';
                    } else if (임대차tmp.임대인구분 == '2') {//사업자등록
                        임대차정보querry.lsorRprsResno = "";
                        임대차정보querry.rprsNm = "";
                        임대차정보querry.lsorNtplTin = 임대차tmp.임대차Result.rprsTin;
                        임대차정보querry.lsorBmanNo = 임대차tmp.임대차Result.txprDscmNoEncCntn;
                        임대차정보querry.lsorTxprNm = 임대차tmp.임대차Result.txprNm;
                        임대차정보querry.lsorCrpNo = "";
                        임대차정보querry.lsorCrpBmanYn = (임대차tmp.임대차Result.bmanClCd == "05" ? "Y" : "N");    // 법인사업자여부
                        임대차정보querry.lsorBmanTin = 임대차tmp.임대차Result.tin;
                        임대차정보querry.lsorCrpTin = '';
                    } else {  //법인등록
                        임대차정보querry.lsorRprsResno = "";
                        임대차정보querry.rprsNm = "";
                        임대차정보querry.lsorBmanNo = "";
                        임대차정보querry.lsorTxprNm = "";
                        임대차정보querry.lsorBmanTin = "";
                        임대차정보querry.lsorCrpBmanYn = "Y";
                        임대차정보querry.lsorCrpNo = 임대차tmp.임대차Result.txprDscmNoEncCntn;
                        임대차정보querry.lsorNtplTin = 임대차tmp.임대차법인Result.rprsTin;
                        임대차정보querry.lsorCrpTin = 임대차tmp.임대차Result.tin;
                    }
                    임대차정보querry.lsorAdr = addText.roadBscAdr;
                    임대차정보querry.ctrDt = 임대차tmp.계약일자;
                    임대차정보querry.lsrnBtnModify = '';
                    임대차정보querry.ctrTermDt = '';
                    임대차정보querry.dfntDtNo = '';
                    임대차정보querry.lsorCnt = '';
                    임대차정보querry.ctrTermStrtDt = 임대차tmp.계약시작일;
                    임대차정보querry.ctrTermEndDt = 임대차tmp.계약종료일;
                    임대차정보querry.pfbSfl = 임대차tmp.면적;
                    임대차정보querry.lfamt = (임대차tmp.전세보증금 ? 임대차tmp.전세보증금 : '');
                    임대차정보querry.mmrAmt = (임대차tmp.월세 ? 임대차tmp.월세 : '');
                    임대차정보querry.dfntDtAplcd = '';
                    임대차정보querry.flpnApndYn = '';
                    임대차정보querry.tennBldTlcSn = '';
                    임대차정보querry.lsorTelnoEncCntn = (임대차tmp.임대인전화 ? 임대차tmp.임대인전화 : '');
                    임대차정보querry.lsrnTrtClCd = '';
                    임대차정보querry.lsrnAltDt = '';
                    임대차정보querry.statusValue = 'U';

                    storageData.ttiabcl020DVOList.push(임대차정보querry);

                    주소querry = {};
                    주소querry.statusValue = 'R';
                    주소querry.bldBlckAdr = (임대차tmp.부동산소재지.건물명 ? 임대차tmp.부동산소재지.건물명 : _nullToEnpty(주소정보tmp.bldNm));
                    주소querry.bldDnadr = (임대차tmp.부동산소재지.동 ? 임대차tmp.부동산소재지.동 : '');
                    주소querry.bldFlorAdr = (임대차tmp.부동산소재지.층 ? 임대차tmp.부동산소재지.층 : '');
                    주소querry.bldHoAdr = (임대차tmp.부동산소재지.호 ? 임대차tmp.부동산소재지.호 : '');
                    주소querry.etcDadr = (임대차tmp.부동산소재지.기타주소 ? 임대차tmp.부동산소재지.기타주소 : '');
                    주소querry.roadBscAdr = addText.roadBscAdr;
                    주소querry.ldCd = _nullToEnpty(주소정보tmp.ldCd);
                    주소querry.radio0 = "1";   // 선택
                    주소querry.sggFrmyNm = _nullToEnpty(주소정보tmp.sggFrmyNm);
                    주소querry.ymdgRdstNm = _nullToEnpty(주소정보tmp.ymdgRdstNm); // 지번주소
                    주소querry.bunjHoAdr = _nullToEnpty(주소정보tmp.bunjHoAdr);
                    주소querry.rltnLnmYn = _nullToEnpty(주소정보tmp.rltnLnmYn);
                    주소querry.roadNm = _nullToEnpty(주소정보tmp.roadNm);
                    주소querry.bldNo = _nullToEnpty(주소정보tmp.bldNo);
                    주소querry.roadNmCd = _nullToEnpty(주소정보tmp.roadNmCd);
                    주소querry.ymdgSn = _nullToEnpty(주소정보tmp.ymdgSn);
                    주소querry.bldPmnoAdr = _nullToEnpty(주소정보tmp.bldPmnoAdr);
                    주소querry.bldSnoAdr = _nullToEnpty(주소정보tmp.bldSnoAdr);
                    주소querry.undrBldClCd = _nullToEnpty(주소정보tmp.undrBldClCd);
                    주소querry.spcaCd = _nullToEnpty(주소정보tmp.spcaCd);
                    주소querry.snadrYn = _nullToEnpty(주소정보tmp.snadrYn);
                    주소querry.bunjAdr = _nullToEnpty(주소정보tmp.bunjAdr);
                    주소querry.hoAdr = _nullToEnpty(주소정보tmp.hoAdr);
                    주소querry.sidoNm = _nullToEnpty(주소정보tmp.sidoNm);
                    주소querry.sggNm = _nullToEnpty(주소정보tmp.sggNm);
                    주소querry.ymdgNm = _nullToEnpty(주소정보tmp.ymdgNm);
                    주소querry.rdstNm = _nullToEnpty(주소정보tmp.rdstNm);
                    주소querry.sggZip = _nullToEnpty(주소정보tmp.sggZip);
                    주소querry.ymdgZip = _nullToEnpty(주소정보tmp.ymdgZip);
                    주소querry.ymdgClCd = _nullToEnpty(주소정보tmp.ymdgClCd);
                    주소querry.cmThofOgzCd = _nullToEnpty(주소정보tmp.cmThofOgzCd);
                    주소querry.cmTxhfOgzCd = _nullToEnpty(주소정보tmp.cmTxhfOgzCd);
                    주소querry.cmTxhfOgzNm = _nullToEnpty(주소정보tmp.cmTxhfOgzNm);
                    주소querry.roadNmCdYmdgNm = _nullToEnpty(주소정보tmp.roadNmCdYmdgNm);
                    주소querry.statusValue = 'U';
                    주소querry.drcInptAdrYn = 'N';
                    주소querry.zip = _nullToEnpty(주소정보tmp.sggZip) + _nullToEnpty(주소정보tmp.ymdgZip);
                    주소querry.name = 'UTECMAAA02';
                    주소querry.popCalId = 'bmanAdr';
                    주소querry.ldBscAdr = addText.ldBscAdr;

                    // 사이트에서 오류처리 함
                    if (임대차cmTxhfOgzCd != 주소querry.cmTxhfOgzCd) {
                        this.setError(E_IBX_P10001_ADDRESS_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "사업장소재지와 임대차목적물소재지가 다릅니다.";
                        return E_IBX_P10001_ADDRESS_INVALID;
                    }
                    storageData.ttiabam0763DVO.push(주소querry);
                }
            }

            storageData.jntBmanDVOList = [];       // 공동사업자
            storageData.ttiabcd007DVOList = [];    // 사이버몰
            for (var idx = 0; idx < this.사이버몰정보.length; idx++) {
                item = {};

                item.blank1 = "";
                item.chk = "";
                item.cymlSn = (idx + 1).toString();
                item.cymlNm = this.사이버몰정보[idx].명칭;
                item.cymlDmanNm = this.사이버몰정보[idx].도메인;
                item.cymlBtnModify = "";
                item.statusValue = 'R';

                storageData.ttiabcd007DVOList.push(item);
            }
            storageData.ttiabcl032DVOList = [];    // 중기화물 사업자
            storageData.rnthSpcfAplnInfrDVOList = [];  // 임대주택명세
            storageData.ttiabcd005DVO = {};        // 업태

            storageData.ttiabcl022DVO = {};    // 유흥업소 관련..
            storageData.ttiabcl022DVO.mrymBsshPrmsClCd = 'ZZ'; // 유흥업소여부
            storageData.ttiabcl022DVO.mrymBsshPrmsGvfcCd = ''; // 허가관청
            storageData.ttiabcl022DVO.mrymBsshPrmsNo = '';     // 허가번호
            storageData.ttiabcl022DVO.mrymBsshPrmsSfl = '';    // 허가면적
            storageData.ttiabcl022DVO.searchLstAltDtm = '';    // 주소
            storageData.ttiabcl022DVO.statusValue = '';

            storageData.ttiabam0761DVO = 사업장소재지주소querry;   // 사업장소재지정보

            // 주소이전
            storageData.ttiabam0762DVO = {};
            if (this.서류송달정보.length > 0) {
                for (var idx = 0; idx < this.서류송달정보.length; idx++) {
                    var documentDelivery = this.서류송달정보[idx];

                    // 주민등록상주소
                    if (documentDelivery.구분 == '1') {
                        storageData.ttiabam0762DVO = this.본인주소정보;
                        storageData.ttiabam0762DVO.telno = '';
                        storageData.ttiabam0762DVO.txprDscmDtFmt = this.본인주소정보.hshrTxprDscmDt.substr(0, 4) + '-' + this.본인주소정보.hshrTxprDscmDt.substr(4, 2) + '-' + this.본인주소정보.hshrTxprDscmDt.substr(6, 2);
                        storageData.ttiabam0762DVO.rowCount = '1';
                        storageData.ttiabam0762DVO.eml = _nullToEnpty(this.본인주소정보.txprEml);
                        storageData.ttiabam0762DVO.sptxpTxivIsnClCd = '';
                        storageData.ttiabam0762DVO.radio0 = '';
                        storageData.ttiabam0762DVO.sggFrmyNm = '';
                        storageData.ttiabam0762DVO.bldNo = '';
                        storageData.ttiabam0762DVO.snadrYn = '';
                        storageData.ttiabam0762DVO.cmThofOgzCd = '';
                        storageData.ttiabam0762DVO.cmTxhfOgzNm = '';
                        storageData.ttiabam0762DVO.roadNmCdYmdgNm = '';
                        storageData.ttiabam0762DVO.drcInptAdrYn = '';
                        storageData.ttiabam0762DVO.name = '';
                        storageData.ttiabam0762DVO.popCalId = '';
                        // 기타
                    } else if (documentDelivery.구분 == '2') {
                        try {
                            var 송달주소정보 = JSON.parse(Base64.decode(documentDelivery.송달장소.주소정보));
                        } catch (e) {
                            this.log("서류송달정보 송달장소 JSON파싱 실패: " + e.message);
                            this.setError(E_IBX_P10001_ADDRESS_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 송달장소입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_P10001_ADDRESS_INVALID;
                        }
                        var add송달주소 = sfCm_getAddrText(송달주소정보);

                        storageData.ttiabam0762DVO.bldBlckAdr = (documentDelivery.송달장소.건물명 ? documentDelivery.송달장소.건물명 : _nullToEnpty(송달주소정보.bldNm));
                        storageData.ttiabam0762DVO.bldDnadr = (documentDelivery.송달장소.동 ? documentDelivery.송달장소.동 : '');
                        storageData.ttiabam0762DVO.bldFlorAdr = (documentDelivery.송달장소.층 ? documentDelivery.송달장소.층 : '');
                        storageData.ttiabam0762DVO.bldHoAdr = (documentDelivery.송달장소.호 ? documentDelivery.송달장소.호 : '');
                        storageData.ttiabam0762DVO.etcDadr = (documentDelivery.송달장소.기타주소 ? documentDelivery.송달장소.기타주소 : '');
                        storageData.ttiabam0762DVO.roadBscAdr = _nullToEnpty(add송달주소.roadBscAdr);
                        storageData.ttiabam0762DVO.ldBscAdr = _nullToEnpty(addText.ldBscAdr);
                        storageData.ttiabam0762DVO.tin = _nullToEnpty(송달주소정보.tin);
                        storageData.ttiabam0762DVO.sidoNm = _nullToEnpty(송달주소정보.sidoNm);
                        storageData.ttiabam0762DVO.sggZip = _nullToEnpty(송달주소정보.sggZip);
                        storageData.ttiabam0762DVO.bldSnoAdr = _nullToEnpty(송달주소정보.bldSnoAdr);
                        storageData.ttiabam0762DVO.bldPmnoAdr = _nullToEnpty(송달주소정보.bldPmnoAdr);
                        storageData.ttiabam0762DVO.statusValue = "U";
                        storageData.ttiabam0762DVO.sggNm = _nullToEnpty(송달주소정보.sggNm);
                        storageData.ttiabam0762DVO.ymdgNm = _nullToEnpty(송달주소정보.ymdgNm);
                        storageData.ttiabam0762DVO.roadNmCd = _nullToEnpty(송달주소정보.roadNmCd);
                        storageData.ttiabam0762DVO.bunjAdr = _nullToEnpty(송달주소정보.bunjAdr);
                        storageData.ttiabam0762DVO.ymdgClCd = _nullToEnpty(송달주소정보.ymdgClCd);
                        storageData.ttiabam0762DVO.cmTxhfOgzCd = _nullToEnpty(송달주소정보.cmTxhfOgzCd);
                        storageData.ttiabam0762DVO.ldCd = _nullToEnpty(송달주소정보.ldCd);
                        storageData.ttiabam0762DVO.roadNm = _nullToEnpty(송달주소정보.roadNm);
                        storageData.ttiabam0762DVO.radio0 = "1";
                        storageData.ttiabam0762DVO.sggFrmyNm = _nullToEnpty(송달주소정보.sggFrmyNm);
                        storageData.ttiabam0762DVO.bldNo = _nullToEnpty(송달주소정보.bldNo);
                        storageData.ttiabam0762DVO.snadrYn = _nullToEnpty(송달주소정보.snadrYn);
                        storageData.ttiabam0762DVO.cmThofOgzCd = _nullToEnpty(송달주소정보.cmThofOgzCd);
                        storageData.ttiabam0762DVO.cmTxhfOgzNm = _nullToEnpty(송달주소정보.cmTxhfOgzNm);
                        storageData.ttiabam0762DVO.drcInptAdr = "N";
                        storageData.ttiabam0762DVO.name = "UTECMAAA02";
                        storageData.ttiabam0762DVO.popCalId = "sendAdr";
                        // 해당없음
                    } else if (documentDelivery.구분 == '3') {
                        storageData.ttiabam0762DVO.bldBlckAdr = "";
                        storageData.ttiabam0762DVO.bldDnadr = "";
                        storageData.ttiabam0762DVO.bldFlorAdr = "";
                        storageData.ttiabam0762DVO.bldHoAdr = "";
                        storageData.ttiabam0762DVO.etcDadr = "";
                        storageData.ttiabam0762DVO.roadBscAdr = "";
                        storageData.ttiabam0762DVO.ldBscAdr = "";
                    }
                }
            } else {
                storageData.ttiabam0762DVO.bldBlckAdr = "";
                storageData.ttiabam0762DVO.bldDnadr = "";
                storageData.ttiabam0762DVO.bldFlorAdr = "";
                storageData.ttiabam0762DVO.bldHoAdr = "";
                storageData.ttiabam0762DVO.etcDadr = "";
                storageData.ttiabam0762DVO.roadBscAdr = "";
                storageData.ttiabam0762DVO.ldBscAdr = "";
            }

            // 사업설명
            storageData.ttiabcl027DVOList = [];

            // 수신동의여부
            storageData.bmanAplnCnoSVO = {};
            if (this.기본정보.사업장전화번호) {
                if (this.기본정보.사업장전화번호.getPlainTextWithRange(0, 2) == '02') {
                    storageData.bmanAplnCnoSVO.pfbTelno = this.기본정보.사업장전화번호.getPlainTextWithRange(0, 2) + ' ' + this.기본정보.사업장전화번호.getPlainTextWithRange(3, this.기본정보.사업장전화번호.getLength() - 2);
                } else {
                    storageData.bmanAplnCnoSVO.pfbTelno = this.기본정보.사업장전화번호.getPlainTextWithRange(0, 3) + ' ' + this.기본정보.사업장전화번호.getPlainTextWithRange(3, this.기본정보.사업장전화번호.getLength() - 3);
                }
            } else {
                storageData.bmanAplnCnoSVO.pfbTelno = "";  // 사업장전화번호
            }
            if (this.기본정보.자택전화번호) {
                if (this.기본정보.자택전화번호.getPlainTextWithRange(0, 2) == '02') {
                    storageData.bmanAplnCnoSVO.hmTelno = this.기본정보.자택전화번호.getPlainTextWithRange(0, 2) + ' ' + this.기본정보.자택전화번호.getPlainTextWithRange(3, this.기본정보.자택전화번호.getLength() - 2);
                } else {
                    storageData.bmanAplnCnoSVO.hmTelno = this.기본정보.자택전화번호.getPlainTextWithRange(0, 3) + ' ' + this.기본정보.자택전화번호.getPlainTextWithRange(3, this.기본정보.자택전화번호.getLength() - 3);
                }
            } else {
                storageData.bmanAplnCnoSVO.hmTelno = "";  // 자택전화번호
            }
            storageData.bmanAplnCnoSVO.mpno = (this.기본정보.휴대전화번호 ? this.기본정보.휴대전화번호.getPlainTextWithRange(0, 3) + ' ' + this.기본정보.휴대전화번호.getPlainTextWithRange(3, this.기본정보.휴대전화번호.getLength() - 3) : "");  // 휴대전화번호
            storageData.bmanAplnCnoSVO.faxno = "";
            storageData.bmanAplnCnoSVO.txaaMpno = "";
            storageData.bmanAplnCnoSVO.emlAdr = (this.기본정보.전자메일주소? this.기본정보.전자메일주소: "");
            storageData.bmanAplnCnoSVO.infrRcvnAgrYn = (this.기본정보.전자메일주소_수신동의 == "Y"? "Y": "N");; // 수신동의
            storageData.bmanAplnCnoSVO.mpInfrRcvnAgrYn = (this.기본정보.휴대전화번호_수신동의 == "Y"? "Y": "N"); // 수신동의
            storageData.bmanRcatBscMttrSVO = {};
            storageData.bmanRcatBscMttrSVO.txprNm = myInfo.txprNm;
            storageData.bmanRcatBscMttrSVO.resno = myInfo.txprDscmNoEncCntn;

            storageData.userReqInfoVO = {};
            storageData.txaaInfr = {}; // 수임여부
            storageData.ttiabcd015DVO = {};    // 송달장소
            if (this.서류송달정보.length > 0) {
                for (var i = 0; i < this.서류송달정보.length; i++) {
                    var documentDelivery = this.서류송달정보[i];

                    if (documentDelivery.구분 == '1') {
                        storageData.ttiabcd015DVO.dlvPlcAltAgrYn = documentDelivery.주소자동이전여부;
                        storageData.ttiabcd015DVO.dlvPlcClCd = "01";
                    } else if (documentDelivery.구분 == '2') {
                        storageData.ttiabcd015DVO.dlvPlcAltAgrYn = "";
                        storageData.ttiabcd015DVO.dlvPlcClCd = "99";
                    } else if (documentDelivery.구분 == '3') {
                        storageData.ttiabcd015DVO.dlvPlcAltAgrYn = "";
                        storageData.ttiabcd015DVO.dlvPlcClCd = "ZZ";
                    }
                }
            }else{
                storageData.ttiabcd015DVO.dlvPlcAltAgrYn = "";
                storageData.ttiabcd015DVO.dlvPlcClCd = "ZZ";   // 서류송달장소..
            }

            this.storageData = storageData;
        } else {

            var waitCvaIdList = this.JsonResult.waitCvaIdList;
            system.setStatus(IBXSTATE_ENTER, 35);
            this.url = '/wqAction.do?actionId=ATEABAAA008R01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
            postData = {};
            postData.bmanRgtClCd = '01';    // 신청등록
            postData.cvaId = waitCvaIdList[0].cvaId;
            postData.cvaKndCd = 'A2004';
            postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
            postData.tin = this.PC조회발급서비스homeTaxSession.tin;
            postData.isSt1Amd = false;

            this.postData = JSON.stringify(postData);
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log('정보입력조회(불러오기)_1 :: [' + ResultStr + ']');

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
                return E_IBX_UNKNOWN;
            }

            try {
                신청된정보 = JSON.parse(ResultStr);
            } catch (e) {
                this.setError(E_IBX_SITE_INVALID + 6);
                return E_IBX_SITE_INVALID + 6;
            }

            var bmanTfbDVOList = [];
            if (업종정보flag == '1') {
                // 새로 신청하기
                var 업종tmp = '';
                var item = {};

                var querryData = {};    // 업종등록
                querryData.bsafPtusCmnClsfCd = "14479";
                querryData.vldtStrtDt = '00010101';
                querryData.bmanTfbDVOList = [];

                var is주업종 = false;
                system.setStatus(IBXSTATE_EXECUTE, 50);

                for (var idx = 0; idx < 업종정보.length; idx++) {

                    var IndusInfo = 업종정보[idx];

                    if (!IndusInfo.업종정보) {
                        this.setError(E_IBX_PARAMETER_NOTENTER);
                        this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_NOTENTER;
                    }
                    if (!IndusInfo.구분) {
                        this.setError(E_IBX_PARAMETER_NOTENTER);
                        this.iSASInOut.Output.ErrorMessage = "업종정보 구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_NOTENTER;
                    }
                    if (['주', '부'].indexOf(IndusInfo.구분) < 0) {
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }

                    // 주업종은 하나만 등록가능
                    if (is주업종 && IndusInfo.구분 == '주') {
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }
                    if (IndusInfo.구분 == '주') is주업종 = true;

                    try {
                        업종tmp = JSON.parse(Base64.decode(IndusInfo.업종정보));
                    } catch (e) {
                        this.log("업종정보 입력값 JSON파싱 실패: " + e.message);
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }

                    for (var idy = 0; idy < 업종정보.length; idy++) {
                        if (idx == idy) { continue; }

                        try {
                            업종idy = JSON.parse(Base64.decode(업종정보[idy].업종정보));
                        } catch (e) {
                            this.log("업종정보 입력값 JSON파싱 실패: " + e.message);
                            this.setError(E_IBX_PARAMETER_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_PARAMETER_INVALID;
                        }

                        // 업종코드가 같으면 X
                        // 사이트:  선택한 업종은 이미 주업종으로 되어 있습니다.\n등록된 업종을 부업종으로 변경하시겠습니까?\n(단, 주업종은 다시 등록하셔야합니다.)
                        //          선택한 업종은 이미 부업종으로 등록되어 있습니다.\n등록된 업종을 주업종으로 변경하시겠습니까?\n(단, 이전 주업종은 삭제됩니다.)
                        if (업종tmp.tfbCd == 업종idy.tfbCd) {
                            this.log("업종정보 중복 입력!");
                            this.setError(E_IBX_PARAMETER_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_PARAMETER_INVALID;
                        }
                    }

                    system.setStatus(IBXSTATE_EXECUTE, 55);
                    this.url = '/wqAction.do?actionId=ATTRNZZZ001R17&screenId=UTEABAAP09&popupYn=true&realScreenId=';
                    postData = {};
                    postData.attrYr = 업종tmp.attrYr;
                    postData.tfbCd = 업종tmp.tfbCd;
                    postData.bcNm = 업종tmp.bcNm;
                    postData.tfbDclsNm = 업종tmp.tfbDclsNm;
                    postData.buttonId = 업종tmp.buttonId;

                    this.postData = JSON.stringify(postData);
                    if (!httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData)) {
                        this.setError(E_IBX_FAILTOGETPAGE);
                        return E_IBX_FAILTOGETPAGE;
                    }
                    ResultStr = httpRequest.result;
                    this.log('업종등록' + idx + ' : [' + ResultStr + ']');

                    if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                        ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                        this.bLogIn = false;
                        this.setError(E_IBX_SESSION_CLOSED);
                        return E_IBX_SESSION_CLOSED;
                    }
                    if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                        ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                        this.bLogIn = false;
                        this.setError(E_IBX_SERVICE_LOGOUT);
                        return E_IBX_SERVICE_LOGOUT;
                    }
                    if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                        ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                        ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                        this.setError(E_IBX_SITE_INTERNAL);
                        return E_IBX_SITE_INTERNAL;
                    }

                    try {
                        var krStndIndsClCdDVO = JSON.parse(ResultStr).krStndIndsClCdDVO;
                        var krStndIndsClCdDVOList = JSON.parse(ResultStr).krStndIndsClCdDVOList;
                    } catch (e) {
                        this.log("exception :: " + e.message);
                        this.setError(E_IBX_SITE_INVALID);
                        return E_IBX_SITE_INVALID;
                    }
                    if (krStndIndsClCdDVOList && krStndIndsClCdDVOList.length > 0) {

                        if (!krStndIndsClCdDVOList) {
                            this.setError(E_IBX_SITE_INVALID + 1);
                            return E_IBX_SITE_INVALID + 1;
                        }

                        // 일부 업종은 산업분류코드 선택 필요
                        if (!IndusInfo.산업분류코드) {
                            this.setError(E_IBX_BUSINESS_CODE_NOTENTER);
                            this.iSASInOut.Output.ErrorMessage = "산업분류코드 미입력입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_BUSINESS_CODE_NOTENTER;
                        }
                        for (var idy = 0; idy < krStndIndsClCdDVOList.length; idy++) {
                            if (IndusInfo.산업분류코드 == krStndIndsClCdDVOList[idy].krStndIndsClsfCd) {
                                krStndIndsClCdDVO = krStndIndsClCdDVOList[idy];
                                break;
                            }
                        }
                        if (!krStndIndsClCdDVO) {
                            this.setError(E_IBX_BUSINESS_CODE_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 산업분류코드 입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_BUSINESS_CODE_INVALID;
                        }

                        item = {};
                        item.blank = "";
                        item.chk = "";
                        item.mtfbYn = (IndusInfo.구분 == '주' ? 'Y' : 'N');
                        item.tfbCd = krStndIndsClCdDVO.tfbCd;
                        item.bcNm = 업종tmp.bcNm;
                        item.itmNm = 업종tmp.tfbDclsNm;
                        item.krStndIndsClsfNm = '(' + krStndIndsClCdDVO.krStndIndsClsfCd + ') ' + krStndIndsClCdDVO.krStndIndsClsfNm;
                        item.modifyBtnTfb = "수정";
                        item.krStndIndsClsfCd = krStndIndsClCdDVO.krStndIndsClsfCd;
                        item.applcBaseDcnt = 업종tmp.applcBaseDcnt;
                        item.csmrOpstTfbYn = "";
                        item.cshptDutyPblTfbYn = "";
                        item.statusValue = "C";

                    } else {

                        if (!krStndIndsClCdDVO) {
                            this.setError(E_IBX_SITE_INVALID + 1);
                            return E_IBX_SITE_INVALID + 1;
                        }

                        // 산업분류코드 필요없는데 입력된 케이스
                        if (IndusInfo.산업분류코드) {
                            this.setError(E_IBX_BUSINESS_CODE_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 산업분류코드 입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_BUSINESS_CODE_INVALID;
                        }

                        item = {};
                        item.blank = "";
                        item.chk = "";
                        item.mtfbYn = (IndusInfo.구분 == '주' ? 'Y' : 'N');
                        item.tfbCd = krStndIndsClCdDVO.tfbCd;
                        item.bcNm = krStndIndsClCdDVO.krStndIndsClsfNm;
                        item.itmNm = krStndIndsClCdDVO.krStndIndsLcsNm;
                        item.krStndIndsClsfNm = '(' + krStndIndsClCdDVO.krStndIndsClsfCd + ') ' + krStndIndsClCdDVO.krStndIndsClsfNm;
                        item.modifyBtnTfb = "수정";
                        item.krStndIndsClsfCd = krStndIndsClCdDVO.krStndIndsClsfCd;
                        item.applcBaseDcnt = 업종tmp.applcBaseDcnt;
                        item.csmrOpstTfbYn = "";
                        item.cshptDutyPblTfbYn = "";
                        item.statusValue = "C";

                    }
                   
                    querryData.bmanTfbDVOList.push(item);
                }
                // 주업종 하나이상 필수 입력
                if (!is주업종) {
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "주업종은 필수로 선택해야합니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }

                system.setStatus(IBXSTATE_EXECUTE, 60);
                this.url = '/wqAction.do?actionId=ATTABZAA001R15&screenId=UTEABAAP09&popupYn=true&realScreenId=';
                this.postData = JSON.stringify(querryData);
                if (!httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData)) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log('업종등록 최종 : [' + ResultStr + ']');

                if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                    ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SESSION_CLOSED);
                    return E_IBX_SESSION_CLOSED;
                }
                if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                    ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                    this.bLogIn = false;
                    this.setError(E_IBX_SERVICE_LOGOUT);
                    return E_IBX_SERVICE_LOGOUT;
                }
                if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                    ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                    ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                    this.setError(E_IBX_SITE_INTERNAL);
                    return E_IBX_SITE_INTERNAL;
                }
                try {
                    bmanTfbDVOList = JSON.parse(ResultStr).bmanTfbDVOList;
                } catch (e) {
                    this.log("exception :: " + e.message);
                    this.setError(E_IBX_SITE_INVALID + 2);
                    return E_IBX_SITE_INVALID + 2;
                }
                if (!bmanTfbDVOList) {
                    this.setError(E_IBX_SITE_INVALID + 3);
                    return E_IBX_SITE_INVALID + 3;
                }
            } else {
                bmanTfbDVOList = 신청된정보.bmanTfbDetailDVOList;
            }

            // 진짜 신청
            var storageData = {};
            storageData.bmanRgtClCd = '01';
            storageData.cvaId = '';
            storageData.cvaKndCd = 'A2004';
            storageData.removeWaitCvaYn = 'Y';  // 기존 접수대기중인 민원 삭제 여부
            storageData.tin = this.PC조회발급서비스homeTaxSession.tin;
            storageData.isSt1Amd = false;

            storageData.waitCvaIdList = waitCvaIdList; // 기존 접수 대기중인 민원 (있어야 이전 이력 사라짐!)

            storageData.ttiabcm001DVO = convertNumbersToStrings(신청된정보.ttiabcm001DVO);
            storageData.ttiabcm002DVO = convertNumbersToStrings(신청된정보.ttiabcm002DVO);
            if (Object.keys(this.임대차정보).length > 0) {
                storageData.ttiabcm002DVO.pfbAnhsSfl = this.임대차정보.타가면적;
                storageData.ttiabcm002DVO.pfbMhSfl = this.임대차정보.자가면적;
                storageData.ttiabcm002DVO.pfbPsenClCd = "02";  // 자가,타가
            }
            if (기본정보flag == '1') {
                storageData.ttiabcm002DVO.tnmNm = (기본정보.상호명 ? 기본정보.상호명 : '');
                storageData.ttiabcm002DVO.ofbDt = 기본정보.개업일자;
            }

            if (사업자유형정보flag == '1') {
                storageData.ttiabcm002DVO.vatTxtpeCd = 사업자유형정보_유형;

                // 사업자유형정보는 flag되어있지만 유형미입력인 케이스
                // -> 유형이 기존에 저장되어있다면 괜찮음
                if (!bmanTfbDVOList || bmanTfbDVOList.length == 0) {
                    this.setError(E_IBX_TRANS_TYPE_NOTENTER);
                    this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_TRANS_TYPE_NOTENTER;
                }
            } else {
                if (!신청된정보.ttiabcm002DVO.vatTxtpeCd) {
                    this.setError(E_IBX_SITE_INVALID + 3);
                    return E_IBX_SITE_INVALID + 3;
                }
                storageData.ttiabcm002DVO.vatTxtpeCd = 신청된정보.ttiabcm002DVO.vatTxtpeCd;
            }
            if (의제주류면허신청) storageData.ttiabcm002DVO.lfAlLcnTypeCd = StrReplace(의제주류면허신청, 'N', '');  // 의제주류면허신청
            if (인허가사업여부) storageData.ttiabcm002DVO.gpBsYn = 인허가사업여부;
            if (개별소비세해당여부) storageData.ttiabcm002DVO.scntxTxtnClCd = 개별소비세해당여부;
            if (간이과세포기신고여부) storageData.ttiabcm002DVO.sptxnAbdnRtnYn = 간이과세포기신고여부;

            storageData.ttiabcd005DVOList = [];

            for (var idx = 0; idx < bmanTfbDVOList.length; idx++) {
                item = {};

                업종tmp = bmanTfbDVOList[idx];

                item.blank = "";
                item.chk = "";
                item.mtfbYn = 업종tmp.mtfbYn;
                item.tfbCd = 업종tmp.tfbCd;
                item.bcNm = 업종tmp.bcNm;
                item.itmNm = 업종tmp.itmNm;
                item.csmrOpstTfbYn = 업종tmp.csmrOpstTfbYn;
                item.cshptDutyPblTfbYn = 업종tmp.cshptDutyPblTfbYn;
                item.krStndIndsClsfNm = 업종tmp.krStndIndsClsfNm;
                item.cnfr = "";   // 제출서류
                item.tfbCdBtnModify = "";   // 수정
                item.krStndIndsClsfCd = 업종tmp.krStndIndsClsfCd;
                item.applcBaseDcnt = 업종tmp.applcBaseDcnt;
                item.statusValue = "R";

                storageData.ttiabcd005DVOList.push(item);
            }

            storageData.ttiabcd028DVOList = [];    // 비과세단체코드 (신규신청 미지원)
            if (신청된정보.bmanXmtxOrgTfbDetailDVOList) {
                for (var i = 0; i < 신청된정보.bmanXmtxOrgTfbDetailDVOList.length; i++) {
                    item = {};

                    비과세tmp = 신청된정보.bmanXmtxOrgTfbDetailDVOList[idx];

                    item.blank = "";
                    item.chk = "";
                    item.mtfbYn = 비과세tmp.mtfbYn;
                    item.xmtxOrgTfbCd = 비과세tmp.xmtxOrgTfbCd;
                    item.xmtxOrgBcNm = 비과세tmp.xmtxOrgBcNm;
                    item.xmtxOrgItmNm = 비과세tmp.xmtxOrgItmNm;
                    item.krStndIndsClsfNm = 비과세tmp.krStndIndsClsfNm;
                    item.tfbCdBtnModify = "";   // 수정
                    item.krStndIndsClsfCd = 비과세tmp.krStndIndsClsfCd;
                    item.statusValue = "R";

                    storageData.ttiabcd028DVOList.push(item);
                }
            }

            storageData.ttiabcl020DVOList = [];
            storageData.ttiabam0763DVO = [];

            var 사업장소재지주소querry = {};
            사업장소재지주소querry.statusValue = 'U';
            var 건물명, 동, 층, 호, 기타주소;
            if (사업장소재지정보flag == '1') {
                try {
                    주소정보tmp = JSON.parse(Base64.decode(사업장소재지정보.주소정보));
                } catch (e) {
                    this.log("사업장소재지정보 주소정보 JSON파싱 실패: " + e.message);
                    this.setError(E_IBX_PARAMETER_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "잘못된 사업장소재지정보 주소정보입니다. 확인 후 거래하시기 바랍니다.";
                    return E_IBX_PARAMETER_INVALID;
                }
                var addText = sfCm_getAddrText(주소정보tmp);

                건물명 = (사업장소재지정보.건물명 ? 사업장소재지정보.건물명 : _nullToEnpty(주소정보tmp.bldNm));
                동 = (사업장소재지정보.동 ? 사업장소재지정보.동 : '');
                층 = (사업장소재지정보.층 ? 사업장소재지정보.층 : '');
                호 = (사업장소재지정보.호 ? 사업장소재지정보.호 : '');
                기타주소 = (사업장소재지정보.기타주소 ? 사업장소재지정보.기타주소 : '');
            } else {
                // 사업장 정보 불러오기
                if (!신청된정보.txprAbftAdrInqr1DVO) {
                    this.setError(E_IBX_SITE_INVALID + 3);
                    return E_IBX_SITE_INVALID + 3;
                }
                var 주소정보tmp = 신청된정보.txprAbftAdrInqr1DVO;
                var addText = sfCm_getAddrText(주소정보tmp);

                건물명 = 주소정보tmp.bldBlckAdr;
                동 = (주소정보tmp.bldDnadr ? 주소정보tmp.bldDnadr : '');
                층 = (주소정보tmp.bldFlorAdr ? 주소정보tmp.bldFlorAdr : '');
                호 = (주소정보tmp.bldHoAdr ? 주소정보tmp.bldHoAdr : '');
                기타주소 = (주소정보tmp.etcDadr ? 주소정보tmp.etcDadr : '');
            }
            사업장소재지주소querry.bldBlckAdr = 건물명;
            사업장소재지주소querry.bldDnadr = 동;
            사업장소재지주소querry.bldFlorAdr = 층;
            사업장소재지주소querry.bldHoAdr = 호;
            사업장소재지주소querry.etcDadr = 기타주소;
            사업장소재지주소querry.roadBscAdr = addText.roadBscAdr;
            사업장소재지주소querry.ldCd = _nullToEnpty(주소정보tmp.ldCd);
            사업장소재지주소querry.radio0 = "1";   // 선택
            사업장소재지주소querry.sggFrmyNm = _nullToEnpty(주소정보tmp.sggFrmyNm);
            사업장소재지주소querry.ymdgRdstNm = _nullToEnpty(주소정보tmp.ymdgRdstNm); // 지번주소
            사업장소재지주소querry.bunjHoAdr = _nullToEnpty(주소정보tmp.bunjHoAdr);
            사업장소재지주소querry.rltnLnmYn = _nullToEnpty(주소정보tmp.rltnLnmYn);
            사업장소재지주소querry.roadNm = _nullToEnpty(주소정보tmp.roadNm);
            사업장소재지주소querry.bldNo = _nullToEnpty(주소정보tmp.bldNo);
            사업장소재지주소querry.roadNmCd = _nullToEnpty(주소정보tmp.roadNmCd);
            사업장소재지주소querry.ymdgSn = _nullToEnpty(주소정보tmp.ymdgSn);
            사업장소재지주소querry.bldPmnoAdr = _nullToEnpty(주소정보tmp.bldPmnoAdr);
            사업장소재지주소querry.bldSnoAdr = _nullToEnpty(주소정보tmp.bldSnoAdr);
            사업장소재지주소querry.undrBldClCd = _nullToEnpty(주소정보tmp.undrBldClCd);
            사업장소재지주소querry.spcaCd = _nullToEnpty(주소정보tmp.spcaCd);
            사업장소재지주소querry.snadrYn = _nullToEnpty(주소정보tmp.snadrYn);
            사업장소재지주소querry.bunjAdr = _nullToEnpty(주소정보tmp.bunjAdr);
            사업장소재지주소querry.hoAdr = _nullToEnpty(주소정보tmp.hoAdr);
            사업장소재지주소querry.sidoNm = _nullToEnpty(주소정보tmp.sidoNm);
            사업장소재지주소querry.sggNm = _nullToEnpty(주소정보tmp.sggNm);
            사업장소재지주소querry.ymdgNm = _nullToEnpty(주소정보tmp.ymdgNm);
            사업장소재지주소querry.rdstNm = _nullToEnpty(주소정보tmp.rdstNm);
            사업장소재지주소querry.sggZip = _nullToEnpty(주소정보tmp.sggZip);
            사업장소재지주소querry.ymdgZip = _nullToEnpty(주소정보tmp.ymdgZip);
            사업장소재지주소querry.ymdgClCd = _nullToEnpty(주소정보tmp.ymdgClCd);
            사업장소재지주소querry.cmThofOgzCd = _nullToEnpty(주소정보tmp.cmThofOgzCd);
            사업장소재지주소querry.cmTxhfOgzCd = _nullToEnpty(주소정보tmp.cmTxhfOgzCd);
            사업장소재지주소querry.cmTxhfOgzNm = _nullToEnpty(주소정보tmp.cmTxhfOgzNm);
            사업장소재지주소querry.roadNmCdYmdgNm = _nullToEnpty(주소정보tmp.roadNmCdYmdgNm);
            사업장소재지주소querry.statusValue = 'U';
            사업장소재지주소querry.drcInptAdrYn = 'N';
            사업장소재지주소querry.zip = _nullToEnpty(주소정보tmp.sggZip) + _nullToEnpty(주소정보tmp.ymdgZip);
            사업장소재지주소querry.name = 'UTECMAAA02';
            사업장소재지주소querry.popCalId = 'bmanAdr';
            사업장소재지주소querry.ldBscAdr = addText.ldBscAdr;

            var 임대차cmTxhfOgzCd = 사업장소재지주소querry.cmTxhfOgzCd;
            var 주소querry = {};
            if (Object.keys(this.임대차정보).length > 0) {
                for (var idxx = 0; idxx < this.임대차정보.임대차정보.length; idxx++) {

                    var 임대차tmp = this.임대차정보.임대차정보[idxx];
                    try {
                        var 주소정보tmp = JSON.parse(Base64.decode(임대차tmp.부동산소재지.주소정보));
                    } catch (e) {
                        this.log("임대차tmp 주소정보 JSON파싱 실패: " + e.message);
                        this.setError(E_IBX_PARAMETER_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "잘못된 임대차 주소정보입니다. 확인 후 거래하시기 바랍니다.";
                        return E_IBX_PARAMETER_INVALID;
                    }
                    var addText = sfCm_getAddrText(주소정보tmp);

                    item = {};
                    item.blank2 = "";
                    item.chk = "";
                    if (임대차tmp.임대인구분 == '1') {  // 개인
                        item.lsorRprsResno = 임대차tmp.임대차Result.txprDscmNoEncCntn;
                        item.rprsNm = 임대차tmp.임대차Result.txprNm;
                        item.lsorBmanNo = "";
                        item.lsorNtplTin = 임대차tmp.임대차Result.tin;
                        item.lsorBmanTin = "";
                        item.lsorCrpBmanYn = "";
                        item.lsorCrpTin = '';
                    } else if (임대차tmp.임대인구분 == '2') {//사업자등록
                        item.lsorRprsResno = "";
                        item.rprsNm = "";
                        item.lsorNtplTin = "";
                        item.lsorBmanNo = 임대차tmp.임대차Result.txprDscmNoEncCntn;
                        item.lsorTxprNm = 임대차tmp.임대차Result.txprNm;
                        item.lsorCrpBmanYn = (임대차tmp.임대차Result.bmanClCd == "05" ? "Y" : "N");    // 법인사업자여부
                        item.lsorBmanTin = 임대차tmp.임대차Result.tin;
                        item.lsorCrpTin = '';
                    } else {  //법인등록
                        item.lsorRprsResno = "";
                        item.rprsNm = "";
                        item.lsorBmanNo = "";
                        item.lsorBmanTin = "";
                        item.lsorCrpBmanYn = "Y";
                        item.lsorCrpNo = 임대차tmp.임대차Result.txprDscmNoEncCntn;
                        item.lsorNtplTin = 임대차tmp.임대차법인Result.rprsTin;
                        item.lsorCrpTin = 임대차tmp.임대차Result.tin;
                    }
                    item.lsorAdr = addText.roadBscAdr;
                    item.ctrDt = 임대차tmp.계약일자;
                    item.lsrnBtnModify = '';
                    item.ctrTermDt = '';
                    item.dfntDtNo = '';
                    item.lsorCnt = '';
                    item.ctrTermStrtDt = 임대차tmp.계약시작일;
                    item.ctrTermEndDt = 임대차tmp.계약종료일;
                    item.pfbSfl = 임대차tmp.면적;
                    item.lfamt = (임대차tmp.전세보증금 ? 임대차tmp.전세보증금 : '');
                    item.mmrAmt = (임대차tmp.월세 ? 임대차tmp.월세 : '');
                    item.dfntDtAplcd = '';
                    item.flpnApndYn = '';
                    item.tennBldTlcSn = '';
                    item.lsorTelnoEncCntn = (임대차tmp.임대인전화 ? 임대차tmp.임대인전화 : '');
                    item.lsrnTrtClCd = '';
                    item.lsrnAltDt = '';
                    item.statusValue = 'U';

                    storageData.ttiabcl020DVOList.push(item);

                    주소querry = {};
                    주소querry.statusValue = 'R';
                    주소querry.bldBlckAdr = (임대차tmp.부동산소재지.건물명 ? 임대차tmp.부동산소재지.건물명 : _nullToEnpty(주소정보tmp.bldNm));
                    주소querry.bldDnadr = (임대차tmp.부동산소재지.동 ? 임대차tmp.부동산소재지.동 : '');
                    주소querry.bldFlorAdr = (임대차tmp.부동산소재지.층 ? 임대차tmp.부동산소재지.층 : '');
                    주소querry.bldHoAdr = (임대차tmp.부동산소재지.호 ? 임대차tmp.부동산소재지.호 : '');
                    주소querry.etcDadr = (임대차tmp.부동산소재지.기타주소 ? 임대차tmp.부동산소재지.기타주소 : '');
                    주소querry.roadBscAdr = addText.roadBscAdr;
                    주소querry.ldCd = _nullToEnpty(주소정보tmp.ldCd);
                    주소querry.radio0 = "1";   // 선택
                    주소querry.sggFrmyNm = _nullToEnpty(주소정보tmp.sggFrmyNm);
                    주소querry.ymdgRdstNm = _nullToEnpty(주소정보tmp.ymdgRdstNm); // 지번주소
                    주소querry.bunjHoAdr = _nullToEnpty(주소정보tmp.bunjHoAdr);
                    주소querry.rltnLnmYn = _nullToEnpty(주소정보tmp.rltnLnmYn);
                    주소querry.roadNm = _nullToEnpty(주소정보tmp.roadNm);
                    주소querry.bldNo = _nullToEnpty(주소정보tmp.bldNo);
                    주소querry.roadNmCd = _nullToEnpty(주소정보tmp.roadNmCd);
                    주소querry.ymdgSn = _nullToEnpty(주소정보tmp.ymdgSn);
                    주소querry.bldPmnoAdr = _nullToEnpty(주소정보tmp.bldPmnoAdr);
                    주소querry.bldSnoAdr = _nullToEnpty(주소정보tmp.bldSnoAdr);
                    주소querry.undrBldClCd = _nullToEnpty(주소정보tmp.undrBldClCd);
                    주소querry.spcaCd = _nullToEnpty(주소정보tmp.spcaCd);
                    주소querry.snadrYn = _nullToEnpty(주소정보tmp.snadrYn);
                    주소querry.bunjAdr = _nullToEnpty(주소정보tmp.bunjAdr);
                    주소querry.hoAdr = _nullToEnpty(주소정보tmp.hoAdr);
                    주소querry.sidoNm = _nullToEnpty(주소정보tmp.sidoNm);
                    주소querry.sggNm = _nullToEnpty(주소정보tmp.sggNm);
                    주소querry.ymdgNm = _nullToEnpty(주소정보tmp.ymdgNm);
                    주소querry.rdstNm = _nullToEnpty(주소정보tmp.rdstNm);
                    주소querry.sggZip = _nullToEnpty(주소정보tmp.sggZip);
                    주소querry.ymdgZip = _nullToEnpty(주소정보tmp.ymdgZip);
                    주소querry.ymdgClCd = _nullToEnpty(주소정보tmp.ymdgClCd);
                    주소querry.cmThofOgzCd = _nullToEnpty(주소정보tmp.cmThofOgzCd);
                    주소querry.cmTxhfOgzCd = _nullToEnpty(주소정보tmp.cmTxhfOgzCd);
                    주소querry.cmTxhfOgzNm = _nullToEnpty(주소정보tmp.cmTxhfOgzNm);
                    주소querry.roadNmCdYmdgNm = _nullToEnpty(주소정보tmp.roadNmCdYmdgNm);
                    주소querry.statusValue = 'U';
                    주소querry.drcInptAdrYn = 'N';
                    주소querry.zip = _nullToEnpty(주소정보tmp.sggZip) + _nullToEnpty(주소정보tmp.ymdgZip);
                    주소querry.name = 'UTECMAAA02';
                    주소querry.popCalId = 'bmanAdr';
                    주소querry.ldBscAdr = addText.ldBscAdr;

                    // 사이트에서 오류처리 함
                    if (임대차cmTxhfOgzCd != 주소querry.cmTxhfOgzCd) {
                        this.setError(E_IBX_P10001_ADDRESS_INVALID);
                        this.iSASInOut.Output.ErrorMessage = "사업장소재지와 임대차목적물소재지가 다릅니다.";
                        return E_IBX_P10001_ADDRESS_INVALID;
                    } 
                    storageData.ttiabam0763DVO.push(주소querry);
                }
            } else {
                if (신청된정보.lsrnBrkdDVOList) {
                    for (var idxx = 0; idxx < 신청된정보.lsrnBrkdDVOList.length; idxx++) {
                        var 임대차tmp = 신청된정보.lsrnBrkdDVOList[idxx];

                        item = {};
                        item.blank2 = "";
                        item.chk = "";
                        item.lsorBmanNo = 임대차tmp.lsorBmanNo;
                        item.lsorTxprNm = 임대차tmp.lsorTxprNm;
                        item.lsorCrpNo = 임대차tmp.lsorCrpNo;
                        item.lsorRprsResno = 임대차tmp.lsorRprsResno;
                        item.rprsNm = 임대차tmp.rprsNm;
                        item.lsorAdr = 임대차tmp.lsorAdr;
                        item.ctrDt = 임대차tmp.ctrDt;
                        item.lsrnBtnModify = 임대차tmp.lsrnBtnModify;
                        item.ctrTermDt = 임대차tmp.ctrTermDt;
                        item.lsrnBtnModify = '';
                        item.dfntDtNo = 임대차tmp.dfntDtNo;
                        item.lsorNtplTin = 임대차tmp.lsorNtplTin;
                        item.lsorBmanTin = 임대차tmp.lsorBmanTin;
                        item.lsorCrpTin = 임대차tmp.lsorCrpTin;
                        item.lsorCrpBmanYn = 임대차tmp.lsorCrpBmanYn;
                        item.lsorCnt = 임대차tmp.lsorCnt.toString();
                        item.ctrTermStrtDt = 임대차tmp.ctrTermStrtDt;
                        item.ctrTermEndDt = 임대차tmp.ctrTermEndDt;
                        item.pfbSfl = 임대차tmp.pfbSfl.toString();
                        item.lfamt = 임대차tmp.lfamt.toString();
                        item.mmrAmt = 임대차tmp.mmrAmt.toString();
                        item.dfntDtAplcd = 임대차tmp.dfntDtAplcd;
                        item.flpnApndYn = 임대차tmp.flpnApndYn;
                        item.tennBldTlcSn = 임대차tmp.tennBldTlcSn.toString();
                        item.lsorTelnoEncCntn = 임대차tmp.lsorTelnoEncCntn;
                        item.lsrnTrtClCd = 임대차tmp.lsrnTrtClCd;
                        item.lsrnAltDt = 임대차tmp.lsrnAltDt;
                        item.statusValue = 'U';

                        storageData.ttiabcl020DVOList.push(item);
                    }
                }
                if (신청된정보.txprAbftAdrInqrDVOList) {
                    for (var idx = 0; idx < 신청된정보.txprAbftAdrInqrDVOList.length; idx++) {

                        var 임대차주소tmp = 신청된정보.txprAbftAdrInqrDVOList[idx];

                        item = {};
                        item.sidoNm = 임대차주소tmp.sidoNm;
                        item.ldZip = 임대차주소tmp.ldZip;
                        item.bldAbsnLnmYn = 임대차주소tmp.bldAbsnLnmYn;
                        item.ymdgZip = 임대차주소tmp.ymdgZip;
                        item.roadDadr = 임대차주소tmp.roadDadr;
                        item.sggZip = 임대차주소tmp.sggZip;
                        item.bldSnoAdr = 임대차주소tmp.bldSnoAdr.toString();
                        item.ldAdr = 임대차주소tmp.ldAdr;
                        item.bldPmnoAdr = 임대차주소tmp.bldPmnoAdr.toString();
                        item.tongAdr = 임대차주소tmp.tongAdr.toString();
                        item.rpnAdr = 임대차주소tmp.rpnAdr;
                        item.statusValue = "R";
                        item.banAdr = 임대차주소tmp.banAdr.toString();
                        item.sggEnglNm = 임대차주소tmp.sggEnglNm;
                        item.zip = 임대차주소tmp.zip;
                        item.sidoCd = 임대차주소tmp.sidoCd;
                        item.ymdgEnglNm = 임대차주소tmp.ymdgEnglNm;
                        item.hoAdr = 임대차주소tmp.hoAdr;
                        item.adrId = 임대차주소tmp.adrId;
                        item.sggNm = 임대차주소tmp.sggNm;
                        item.ldBscAdr = 임대차주소tmp.ldBscAdr;
                        item.ymdgNm = 임대차주소tmp.ymdgNm;
                        item.spcaCd = 임대차주소tmp.spcaCd;
                        item.undrBldClCd = 임대차주소tmp.undrBldClCd;
                        item.roadNmCd = 임대차주소tmp.roadNmCd;
                        item.roadSidoNm = 임대차주소tmp.roadSidoNm;
                        item.roadYmdgZip = 임대차주소tmp.roadYmdgZip;
                        item.roadSggZip = 임대차주소tmp.roadSggZip;
                        item.ymdgSn = 임대차주소tmp.ymdgSn;
                        item.sggCd = 임대차주소tmp.sggCd;
                        item.ymdgCd = 임대차주소tmp.ymdgCd;
                        item.searchLstAltDtm = 임대차주소tmp.searchLstAltDtm;
                        item.roadBscAdr = 임대차주소tmp.roadBscAdr;
                        item.bunjAdr = 임대차주소tmp.bunjAdr.toString();
                        item.roadZip = 임대차주소tmp.roadZip;
                        item.ymdgClCd = 임대차주소tmp.ymdgClCd;
                        item.ldDadr = 임대차주소tmp.ldDadr;
                        item.englRoadNm = 임대차주소tmp.englRoadNm;
                        item.sidoEnglNm = 임대차주소tmp.sidoEnglNm;
                        item.roadAdr = 임대차주소tmp.roadAdr;
                        item.roadSggNm = 임대차주소tmp.roadSggNm;
                        item.roadYmdgNm = 임대차주소tmp.roadYmdgNm;
                        item.maceCd = 임대차주소tmp.maceCd;
                        item.cmTxhfOgzCd = 임대차주소tmp.cmTxhfOgzCd;
                        item.ldCd = 임대차주소tmp.ldCd;
                        item.useYn = 임대차주소tmp.useYn;
                        item.roadNm = 임대차주소tmp.roadNm;

                        // 사이트에서 오류처리 함
                        if (임대차cmTxhfOgzCd != item.cmTxhfOgzCd) {
                            this.setError(E_IBX_P10001_ADDRESS_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "사업장소재지와 임대차목적물소재지가 다릅니다.";
                            return E_IBX_P10001_ADDRESS_INVALID;
                        }
                        storageData.ttiabam0763DVO.push(item);
                    }
                }
            }

            storageData.jntBmanDVOList = [];       // 공동사업자 (신규 미개발)
            if (신청된정보.jntBmanDVOList) {
                for (var idxx = 0; idxx < 신청된정보.jntBmanDVOList.length; idxx++) {
                    var 공동사업자tmp = 신청된정보.jntBmanDVOList[idxx];

                    item = {};
                    item.blank3 = "";
                    item.chk = "";
                    item.txprRltCdNm = 공동사업자tmp.txprRltCdNm;
                    item.txprDscmNo = 공동사업자tmp.txprDscmNo;
                    item.fnm = 공동사업자tmp.fnm;
                    item.bmanEqtrt = Number(공동사업자tmp.bmanEqtrt).toString();
                    item.invtYn = 공동사업자tmp.invtYn;
                    item.jntBmanBtnModify = "";
                    item.txprRltCd = 공동사업자tmp.txprRltCd;
                    item.tin = 공동사업자tmp.tin;
                    item.lstAltDtm = "";
                    item.aprvYn = "";
                    item.statusValue = 'R';

                    storageData.jntBmanDVOList.push(item);
                }
            }

            storageData.ttiabcd007DVOList = [];    // 사이버몰
            if (this.사이버몰정보.length > 0) {
                for (var idx = 0; idx < this.사이버몰정보.length; idx++) {
                    item = {};

                    item.blank1 = "";
                    item.chk = "";
                    item.cymlSn = (idx + 1).toString();
                    item.cymlNm = this.사이버몰정보[idx].명칭;
                    item.cymlDmanNm = this.사이버몰정보[idx].도메인;
                    item.cymlBtnModify = "";
                    item.statusValue = 'R';

                    storageData.ttiabcd007DVOList.push(item);
                }
            } else if (신청된정보.ttiabcd007DVOList) {
                for (var idxx = 0; idxx < 신청된정보.ttiabcd007DVOList.length; idxx++) {
                    var 사이버몰tmp = 신청된정보.ttiabcd007DVOList[idxx];

                    item = {};
                    item.blank1 = "";
                    item.chk = "";
                    item.cymlSn = 사이버몰tmp.cymlSn.toString();
                    item.cymlNm = 사이버몰tmp.cymlNm;
                    item.cymlDmanNm = 사이버몰tmp.cymlDmanNm;
                    item.cymlBtnModify = "";
                    item.statusValue = 'R';

                    storageData.ttiabcd007DVOList.push(item);
                }
            }
            storageData.ttiabcl032DVOList = [];    // 중기화물 사업자
            if (신청된정보.ttiabcl032DVOList) {
                for (var idxx = 0; idxx < 신청된정보.ttiabcl032DVOList.length; idxx++) {
                    var 중기화물tmp = 신청된정보.ttiabcl032DVOList[idxx];

                    item = {};
                    item.chk = "";
                    item.vhclSn = 중기화물tmp.vhclSn.toString();
                    item.crno = 중기화물tmp.crno;
                    item.vino = 중기화물tmp.vino;
                    item.cymlBtnModify = "";
                    item.statusValue = 'R';

                    storageData.ttiabcl032DVOList.push(item);
                }
            }
            storageData.rnthSpcfAplnInfrDVOList = [];  // 임대주택명세
            if (storageData.rnthSpcfAplnInfrDVOList && storageData.rnthSpcfAplnInfrDVOList.length > 0) {
                // 페이지변경
            }
            storageData.ttiabcd005DVO = {};        // 업태

            storageData.ttiabcl022DVO = {};    // 유흥업소
            if (신청된정보.ttiabcl022DVO.mrymBsshPrmsClCd && 신청된정보.ttiabcl022DVO.mrymBsshPrmsClCd != 'ZZ') {
                storageData.ttiabcl022DVO.mrymBsshPrmsClCd = 신청된정보.ttiabcl022DVO.mrymBsshPrmsClCd;
                storageData.ttiabcl022DVO.mrymBsshPrmsGvfcCd = 신청된정보.ttiabcl022DVO.mrymBsshPrmsGvfcCd;
                storageData.ttiabcl022DVO.mrymBsshPrmsNo = 신청된정보.ttiabcl022DVO.mrymBsshPrmsNo;
                storageData.ttiabcl022DVO.mrymBsshPrmsSfl = Number(신청된정보.ttiabcl022DVO.mrymBsshPrmsSfl).toString();
                storageData.ttiabcl022DVO.searchLstAltDtm = 신청된정보.ttiabcl022DVO.searchLstAltDtm;
                storageData.ttiabcl022DVO.statusValue = "";

            } else {
                storageData.ttiabcl022DVO.mrymBsshPrmsClCd = 'ZZ'; // 유흥업소여부
                storageData.ttiabcl022DVO.mrymBsshPrmsGvfcCd = ''; // 허가관청
                storageData.ttiabcl022DVO.mrymBsshPrmsNo = '';     // 허가번호
                storageData.ttiabcl022DVO.mrymBsshPrmsSfl = '';    // 허가면적
                storageData.ttiabcl022DVO.searchLstAltDtm = '';    // 주소
                storageData.ttiabcl022DVO.statusValue = '';
            }

            
            storageData.ttiabam0761DVO = 사업장소재지주소querry;   // 사업장소재지정보

            // 서류송달
            storageData.ttiabam0762DVO = {};
            if (this.서류송달정보.length > 0) {
                for (var idx = 0; idx < this.서류송달정보.length; idx++) {
                    var documentDelivery = this.서류송달정보[idx];

                    // 주민등록상주소
                    if (documentDelivery.구분 == '1') {
                        storageData.ttiabam0762DVO = this.본인주소정보;
                        storageData.ttiabam0762DVO.telno = '';
                        storageData.ttiabam0762DVO.txprDscmDtFmt = this.본인주소정보.hshrTxprDscmDt.substr(0, 4) + '-' + this.본인주소정보.hshrTxprDscmDt.substr(4, 2) + '-' + this.본인주소정보.hshrTxprDscmDt.substr(6, 2);
                        storageData.ttiabam0762DVO.rowCount = '1';
                        storageData.ttiabam0762DVO.eml = _nullToEnpty(this.본인주소정보.txprEml);
                        storageData.ttiabam0762DVO.sptxpTxivIsnClCd = '';
                        storageData.ttiabam0762DVO.radio0 = '';
                        storageData.ttiabam0762DVO.sggFrmyNm = '';
                        storageData.ttiabam0762DVO.bldNo = '';
                        storageData.ttiabam0762DVO.snadrYn = '';
                        storageData.ttiabam0762DVO.cmThofOgzCd = '';
                        storageData.ttiabam0762DVO.cmTxhfOgzNm = '';
                        storageData.ttiabam0762DVO.roadNmCdYmdgNm = '';
                        storageData.ttiabam0762DVO.drcInptAdrYn = '';
                        storageData.ttiabam0762DVO.name = '';
                        storageData.ttiabam0762DVO.popCalId = '';
                        // 기타
                    } else if (documentDelivery.구분 == '2') {
                        try {
                            var 송달주소정보 = JSON.parse(Base64.decode(documentDelivery.송달장소.주소정보));
                        } catch (e) {
                            this.log("서류송달정보 송달장소 JSON파싱 실패: " + e.message);
                            this.setError(E_IBX_P10001_ADDRESS_INVALID);
                            this.iSASInOut.Output.ErrorMessage = "잘못된 송달장소입니다. 확인 후 거래하시기 바랍니다.";
                            return E_IBX_P10001_ADDRESS_INVALID;
                        }
                        var add송달주소 = sfCm_getAddrText(송달주소정보);

                        storageData.ttiabam0762DVO.bldBlckAdr = (documentDelivery.송달장소.건물명 ? documentDelivery.송달장소.건물명 : _nullToEnpty(송달주소정보.bldNm));
                        storageData.ttiabam0762DVO.bldDnadr = (documentDelivery.송달장소.동 ? documentDelivery.송달장소.동 : '');
                        storageData.ttiabam0762DVO.bldFlorAdr = (documentDelivery.송달장소.층 ? documentDelivery.송달장소.층 : '');
                        storageData.ttiabam0762DVO.bldHoAdr = (documentDelivery.송달장소.호 ? documentDelivery.송달장소.호 : '');
                        storageData.ttiabam0762DVO.etcDadr = (documentDelivery.송달장소.기타주소 ? documentDelivery.송달장소.기타주소 : '');
                        storageData.ttiabam0762DVO.roadBscAdr = _nullToEnpty(add송달주소.roadBscAdr);
                        storageData.ttiabam0762DVO.ldBscAdr = _nullToEnpty(addText.ldBscAdr);
                        storageData.ttiabam0762DVO.tin = _nullToEnpty(송달주소정보.tin);
                        storageData.ttiabam0762DVO.sidoNm = _nullToEnpty(송달주소정보.sidoNm);
                        storageData.ttiabam0762DVO.sggZip = _nullToEnpty(송달주소정보.sggZip);
                        storageData.ttiabam0762DVO.bldSnoAdr = _nullToEnpty(송달주소정보.bldSnoAdr);
                        storageData.ttiabam0762DVO.bldPmnoAdr = _nullToEnpty(송달주소정보.bldPmnoAdr);
                        storageData.ttiabam0762DVO.statusValue = "U";
                        storageData.ttiabam0762DVO.sggNm = _nullToEnpty(송달주소정보.sggNm);
                        storageData.ttiabam0762DVO.ymdgNm = _nullToEnpty(송달주소정보.ymdgNm);
                        storageData.ttiabam0762DVO.roadNmCd = _nullToEnpty(송달주소정보.roadNmCd);
                        storageData.ttiabam0762DVO.bunjAdr = _nullToEnpty(송달주소정보.bunjAdr);
                        storageData.ttiabam0762DVO.ymdgClCd = _nullToEnpty(송달주소정보.ymdgClCd);
                        storageData.ttiabam0762DVO.cmTxhfOgzCd = _nullToEnpty(송달주소정보.cmTxhfOgzCd);
                        storageData.ttiabam0762DVO.ldCd = _nullToEnpty(송달주소정보.ldCd);
                        storageData.ttiabam0762DVO.roadNm = _nullToEnpty(송달주소정보.roadNm);
                        storageData.ttiabam0762DVO.radio0 = "1";
                        storageData.ttiabam0762DVO.sggFrmyNm = _nullToEnpty(송달주소정보.sggFrmyNm);
                        storageData.ttiabam0762DVO.bldNo = _nullToEnpty(송달주소정보.bldNo);
                        storageData.ttiabam0762DVO.snadrYn = _nullToEnpty(송달주소정보.snadrYn);
                        storageData.ttiabam0762DVO.cmThofOgzCd = _nullToEnpty(송달주소정보.cmThofOgzCd);
                        storageData.ttiabam0762DVO.cmTxhfOgzNm = _nullToEnpty(송달주소정보.cmTxhfOgzNm);
                        storageData.ttiabam0762DVO.drcInptAdr = "N";
                        storageData.ttiabam0762DVO.name = "UTECMAAA02";
                        storageData.ttiabam0762DVO.popCalId = "sendAdr";
                        // 해당없음
                    } else if (documentDelivery.구분 == '3') {
                        storageData.ttiabam0762DVO.bldBlckAdr = "";
                        storageData.ttiabam0762DVO.bldDnadr = "";
                        storageData.ttiabam0762DVO.bldFlorAdr = "";
                        storageData.ttiabam0762DVO.bldHoAdr = "";
                        storageData.ttiabam0762DVO.etcDadr = "";
                        storageData.ttiabam0762DVO.roadBscAdr = "";
                        storageData.ttiabam0762DVO.ldBscAdr = "";
                    }
                }
            } else {
                if (신청된정보.txprAbftAdrInqr2DVO && 신청된정보.txprAbftAdrInqr2DVO.sidoNm) {
                    storageData.ttiabam0762DVO = 신청된정보.txprAbftAdrInqr2DVO;
                } else {
                    storageData.ttiabam0762DVO.bldBlckAdr = "";
                    storageData.ttiabam0762DVO.bldDnadr = "";
                    storageData.ttiabam0762DVO.bldFlorAdr = "";
                    storageData.ttiabam0762DVO.bldHoAdr = "";
                    storageData.ttiabam0762DVO.etcDadr = "";
                    storageData.ttiabam0762DVO.roadBscAdr = "";
                    storageData.ttiabam0762DVO.ldBscAdr = "";
                }
            }
            
            // 사업설명
            storageData.ttiabcl027DVOList = [];

            // 수신동의여부
            storageData.bmanAplnCnoSVO = {};
            if (this.사업자등록신청_조회구분 == '1') {
                if (this.기본정보.사업장전화번호) {
                    if (this.기본정보.사업장전화번호.getPlainTextWithRange(0, 2) == '02') {
                        storageData.bmanAplnCnoSVO.pfbTelno = this.기본정보.사업장전화번호.getPlainTextWithRange(0, 2) + ' ' + this.기본정보.사업장전화번호.getPlainTextWithRange(3, this.기본정보.사업장전화번호.getLength() - 2);
                    } else {
                        storageData.bmanAplnCnoSVO.pfbTelno = this.기본정보.사업장전화번호.getPlainTextWithRange(0, 3) + ' ' + this.기본정보.사업장전화번호.getPlainTextWithRange(3, this.기본정보.사업장전화번호.getLength() - 3);
                    }
                } else {
                    storageData.bmanAplnCnoSVO.pfbTelno = "";  // 사업장전화번호
                }
                if (this.기본정보.자택전화번호) {
                    if (this.기본정보.자택전화번호.getPlainTextWithRange(0, 2) == '02') {
                        storageData.bmanAplnCnoSVO.hmTelno = this.기본정보.자택전화번호.getPlainTextWithRange(0, 2) + ' ' + this.기본정보.자택전화번호.getPlainTextWithRange(3, this.기본정보.자택전화번호.getLength() - 2);
                    } else {
                        storageData.bmanAplnCnoSVO.hmTelno = this.기본정보.자택전화번호.getPlainTextWithRange(0, 3) + ' ' + this.기본정보.자택전화번호.getPlainTextWithRange(3, this.기본정보.자택전화번호.getLength() - 3);
                    }
                } else {
                    storageData.bmanAplnCnoSVO.hmTelno = "";  // 자택전화번호
                }
                storageData.bmanAplnCnoSVO.mpno = (this.기본정보.휴대전화번호 ? this.기본정보.휴대전화번호.getPlainTextWithRange(0, 3) + ' ' + this.기본정보.휴대전화번호.getPlainTextWithRange(3, this.기본정보.휴대전화번호.getLength() - 3) : "");  // 휴대전화번호
                storageData.bmanAplnCnoSVO.faxno = "";
                storageData.bmanAplnCnoSVO.txaaMpno = "";
                storageData.bmanAplnCnoSVO.emlAdr = (this.기본정보.전자메일주소? this.기본정보.전자메일주소: "");
                storageData.bmanAplnCnoSVO.infrRcvnAgrYn = (this.기본정보.전자메일주소_수신동의 == "Y"? "Y": "N");; // 수신동의
                storageData.bmanAplnCnoSVO.mpInfrRcvnAgrYn = (this.기본정보.휴대전화번호_수신동의 == "Y"? "Y": "N"); // 수신동의
            } else {
                // 사업장 정보 불러오기
                if (!신청된정보.bmanAplnCnoSVO) {
                    this.setError(E_IBX_SITE_INVALID + 3);
                    return E_IBX_SITE_INVALID + 3;
                }
                var 기본정보tmp = 신청된정보.bmanAplnCnoSVO;

                storageData.bmanAplnCnoSVO.pfbTelno = _nullToEnpty(기본정보tmp.pfbTelno);
                storageData.bmanAplnCnoSVO.hmTelno = _nullToEnpty(기본정보tmp.hmTelno);
                storageData.bmanAplnCnoSVO.mpno = _nullToEnpty(기본정보tmp.mpno);
                storageData.bmanAplnCnoSVO.faxno = _nullToEnpty(기본정보tmp.faxno);
                storageData.bmanAplnCnoSVO.txaaMpno = _nullToEnpty(기본정보tmp.txaaMpno);
                storageData.bmanAplnCnoSVO.emlAdr = _nullToEnpty(기본정보tmp.emlAdr);
                storageData.bmanAplnCnoSVO.infrRcvnAgrYn = _nullToEnpty(기본정보tmp.infrRcvnAgrYn);
                storageData.bmanAplnCnoSVO.mpInfrRcvnAgrYn = _nullToEnpty(기본정보tmp.mpInfrRcvnAgrYn);
            }

            storageData.bmanRcatBscMttrSVO = {};


            storageData.userReqInfoVO = {};
            storageData.txaaInfr = {}; 
            storageData.ttiabcd015DVO = {};    // 송달장소
            if (신청된정보.ttiabcd015DVO && 신청된정보.ttiabcd015DVO.dlvPlcClCd && 신청된정보.ttiabcd015DVO.dlvPlcClCd != 'ZZ') {
                storageData.ttiabcd015DVO = 신청된정보.ttiabcd015DVO;
            }
            if (this.서류송달정보.length > 0) {
                for (var i = 0; i < this.서류송달정보.length; i++) {
                    var documentDelivery = this.서류송달정보[i];

                    if (documentDelivery.구분 == '1') {
                        storageData.ttiabcd015DVO.dlvPlcAltAgrYn = documentDelivery.주소자동이전여부;
                        storageData.ttiabcd015DVO.dlvPlcClCd = "01";
                    } else if (documentDelivery.구분 == '2') {
                        storageData.ttiabcd015DVO.dlvPlcAltAgrYn = "";
                        storageData.ttiabcd015DVO.dlvPlcClCd = "99";
                    } else if (documentDelivery.구분 == '3') {
                        storageData.ttiabcd015DVO.dlvPlcAltAgrYn = "";
                        storageData.ttiabcd015DVO.dlvPlcClCd = "ZZ";
                    }
                }
            }
        }

        system.setStatus(IBXSTATE_EXECUTE, 70);
        this.url = '/wqAction.do?actionId=ATEABAAA008A01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        this.postData = JSON.stringify(storageData);
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('신청 완료 :: [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }
        this.userAgent = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        system.setStatus(IBXSTATE_EXECUTE, 75);
        this.url = '/permission.do?screenId=UTEABAAA59';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("session_1: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        // 세션정보
        if (httpRequest.postWithUserAgent(this.userAgent, 'https://hometax.go.kr/token.do', "{}") == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("token: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            JsonResult = JSON.parse(ResultStr);
        } catch (e) {
            this.log("EXCEPTION_ERROR :: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 4);
            return E_IBX_SITE_INVALID + 4;
        }

        postData = {};
        postData.userClCd = JsonResult.userClCd;
        postData.ssoToken = JsonResult.ssoToken;
        postData.txaaAdmNo = JsonResult.txaaAdmNo;
        postData.popupYn = false;

        this.postData = JSON.stringify(postData);
        this.url = '/permission.do?screenId=UTEABAAA59&domain=hometax.go.kr';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_2: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('권한이 없는 화면입니다') >= 0) {
            this.setError(E_IBX_CARD_MEMBER_NOT_AUTHORITY);
            return E_IBX_CARD_MEMBER_NOT_AUTHORITY;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        PC조회발급서비스homeTaxSession.setSession(ResultStr);
        this.PC조회발급서비스homeTaxSession = PC조회발급서비스homeTaxSession;

        system.setStatus(IBXSTATE_EXECUTE, 78);
        this.url = '/wqAction.do?actionId=ATTABZAA001R01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        postData = {};
        postData.tin = this.PC조회발급서비스homeTaxSession.tin;
        postData.cvaId = '';
        postData.cvaKndCd = 'A2004';
        postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
        postData.tin = this.PC조회발급서비스homeTaxSession.tin;

        this.postData = JSON.stringify(postData);
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('정보입력조회_1 :: [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        system.setStatus(IBXSTATE_EXECUTE, 79);

        this.url = '/wqAction.do?actionId=ATEABAAA006R06&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        postData = {};
        postData.bmanRgtClCd = '01';    // 신청등록
        postData.cvaId = '';
        postData.cvaKndCd = 'A2004';
        postData.removeWaitCvaYn = '';  // 기존 접수대기중인 민원 삭제 여부
        postData.tin = this.PC조회발급서비스homeTaxSession.tin;

        this.postData = JSON.stringify(postData);
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('정보입력조회_1 :: [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            JsonResult = JSON.parse(ResultStr);
            var waitCvaIdList = JsonResult.waitCvaIdList;
        } catch (e) {
            this.setError(E_IBX_SITE_INVALID + 6);
            return E_IBX_SITE_INVALID + 6;
        }

        system.setStatus(IBXSTATE_EXECUTE, 65);

        // 작성중인 신청서가 있습니다. 불러오시겠습니까? -> 확인
        // 저장된 신청서 없음
        if (!waitCvaIdList || waitCvaIdList == 0) {
            if (입력구분 != '0000') {    // 신청했는데 저장안됐을 경우
                this.setError(E_IBX_SITE_INVALID + 7);
                return E_IBX_SITE_INVALID + 7;
            } else {
                this.setError(I_IBX_RESULT_NOTPRESENT);
                return I_IBX_RESULT_NOTPRESENT;
            }
        }

        system.setStatus(IBXSTATE_EXECUTE, 80);
        this.url = '/wqAction.do?actionId=ATEABAAA008R01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        postData.cvaId = waitCvaIdList[0].cvaId;
        this.postData = JSON.stringify(postData);
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('정보입력조회(저장된 신청서) :: [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            resObj = JSON.parse(ResultStr);
            var ttiabcm002DVO = resObj.ttiabcm002DVO;   // 기본정보
            var txprAbftAdrInqr1DVO = resObj.txprAbftAdrInqr1DVO;   // 사업장소재지정보
            var bmanTfbDetailDVOList = resObj.bmanTfbDetailDVOList;  // 업종목록
            var bmanXmtxOrgTfbDetailDVOList = resObj.bmanXmtxOrgTfbDetailDVOList;   // 종교단체여부 (비과세단체코드)
            var lsrnBrkdDVOList = resObj.lsrnBrkdDVOList;   // 임대차
            var ttiabcd007DVOList = resObj.ttiabcd007DVOList;   // 사이버몰
        } catch (e) {
            this.log("exception: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 9);
            return E_IBX_SITE_INVALID + 9;
        }

        system.setStatus(IBXSTATE_RESULT, 85);

        var 정보입력조회 = {};
        정보입력조회.기본정보 = {};
        정보입력조회.사업장소재지정보 = {};
        정보입력조회.업종정보 = [];
        정보입력조회.사업자유형정보 = {};

        정보입력조회.기본정보.상호명 = _nullToEnpty(ttiabcm002DVO.tnmNm);
        정보입력조회.기본정보.개업일자 = _nullToEnpty(ttiabcm002DVO.ofbDt);

        정보입력조회.사업장소재지정보.우편번호 = _nullToEnpty(txprAbftAdrInqr1DVO.zip);
        정보입력조회.사업장소재지정보.도로명주소 = _nullToEnpty(txprAbftAdrInqr1DVO.roadBscAdr);
        정보입력조회.사업장소재지정보.지번주소 = _nullToEnpty(txprAbftAdrInqr1DVO.ldBscAdr);
        정보입력조회.사업장소재지정보.건물명 = _nullToEnpty(txprAbftAdrInqr1DVO.bldBlckAdr);
        정보입력조회.사업장소재지정보.동 = _nullToEnpty(txprAbftAdrInqr1DVO.bldDnadr);
        정보입력조회.사업장소재지정보.층 = _nullToEnpty(txprAbftAdrInqr1DVO.bldFlorAdr);
        정보입력조회.사업장소재지정보.호 = _nullToEnpty(txprAbftAdrInqr1DVO.bldHoAdr);
        정보입력조회.사업장소재지정보.기타주소 = _nullToEnpty(txprAbftAdrInqr1DVO.etcDadr);

        for (var idx = 0; idx < bmanTfbDetailDVOList.length; idx++) {

            var 업종tmp = bmanTfbDetailDVOList[idx];

            var item = {};
            var resultTmp = _nullToEnpty(업종tmp.mtfbYn);
            if (resultTmp == 'Y') { item.구분 = '주'; }
            else if (resultTmp == 'N') { item.구분 = '부'; }
            else {
                this.log("업종구분 예외:[" + 업종구분 + ']');
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }

            item.코드 = _nullToEnpty(업종tmp.tfbCd);
            item.업태명 = _nullToEnpty(업종tmp.bcNm);
            item.업종명 = _nullToEnpty(업종tmp.itmNm);

            resultTmp = _nullToEnpty(업종tmp.csmrOpstTfbYn);
            if (resultTmp == 'Y') { item.소비자상대업종 = '주'; }
            else if (resultTmp == 'N') { item.소비자상대업종 = '부'; }
            else {
                this.log("소비자상대업종 예외:[" + 소비자상대업종 + ']');
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }

            resultTmp = _nullToEnpty(업종tmp.cshptDutyPblTfbYn);
            if (resultTmp == 'Y') { item.현금영수증의무발행업종 = '주'; }
            else if (resultTmp == 'N') { item.현금영수증의무발행업종 = '부'; }
            else {
                this.log("현금영수증의무발행업종 예외:[" + 현금영수증의무발행업종 + ']');
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }

            item.산업분류코드 = _nullToEnpty(업종tmp.krStndIndsClsfNm);

            정보입력조회.업종정보.push(item);
        }

        resultTmp = _nullToEnpty(ttiabcm002DVO.vatTxtpeCd);
        if (resultTmp == '01') 정보입력조회.사업자유형정보.유형 = '1';    // 일반
        else if (resultTmp == '02') 정보입력조회.사업자유형정보.유형 = '2';   // 간이
        else if (resultTmp == '04') 정보입력조회.사업자유형정보.유형 = '3';   // 면세
        else if (resultTmp == '06') 정보입력조회.사업자유형정보.유형 = '4';  // 법인아닌 종교단체
        else if (resultTmp == '07') 정보입력조회.사업자유형정보.유형 = '5';    // 종교단체이외의 비사업자
        else {
            this.log("산업분류코드 예외:[" + resultTmp + ']');
            this.setError(E_IBX_RESULT_FAIL);
            return E_IBX_RESULT_FAIL;
        }

        if (bmanXmtxOrgTfbDetailDVOList && bmanXmtxOrgTfbDetailDVOList.length > 0) { 정보입력조회.사업자유형정보.종교단체여부 = '여'; }
        else { 정보입력조회.사업자유형정보.종교단체여부 = '부'; }

        정보입력조회.사업자유형정보.간이과세포기신고여부 = (ttiabcm002DVO.sptxnAbdnRtnYn == 'Y' ? "여" : "부");

        정보입력조회.임대차정보 = {};
        정보입력조회.임대차정보.자가면적 = "";
        정보입력조회.임대차정보.타가면적 = "";
        정보입력조회.임대차정보.임대차목록 = [];
        for (var idx = 0; idx < lsrnBrkdDVOList.length; idx++) {
            this.is임대차 = true;

            var lsrnBrkd = lsrnBrkdDVOList[idx];
            item = {};

            item.사업자등록번호 = (lsrnBrkd.lsorBmanNo ? lsrnBrkd.lsorBmanNo : '');
            item.상호 = (lsrnBrkd.lsorTxprNm ? lsrnBrkd.lsorTxprNm : '');
            item.법인등록번호 = (lsrnBrkd.lsorCrpNo ? lsrnBrkd.lsorCrpNo : '');
            item.주민등록번호 = (lsrnBrkd.lsorRprsResno ? lsrnBrkd.lsorRprsResno : '');
            item.성명 = (lsrnBrkd.rprsNm ? lsrnBrkd.rprsNm : '');
            item.임차부동산 = (lsrnBrkd.lsorAdr ? lsrnBrkd.lsorAdr : '');
            item.계약일자 = lsrnBrkd.lsrnAltDt;

            정보입력조회.임대차정보.임대차목록.push(item);
        }
        if (this.is임대차){
            정보입력조회.임대차정보.자가면적 = ttiabcm002DVO.pfbMhSfl.toString();
            정보입력조회.임대차정보.타가면적 = ttiabcm002DVO.pfbAnhsSfl.toString();    
        }

        정보입력조회.사이버몰정보 = [];
        for (var idx = 0; idx < ttiabcd007DVOList.length; idx++) {
            this.is사이버몰 = true;

            var ttiabcd007DVO = ttiabcd007DVOList[idx];

            item = {};

            item.명칭 = (ttiabcd007DVO.cymlNm ? ttiabcd007DVO.cymlNm : '');
            item.도메인 = (ttiabcd007DVO.cymlDmanNm ? ttiabcd007DVO.cymlDmanNm : '');

            if (!item.명칭 || !item.도메인) {
                this.log("사이버몰정보 2F10:[" + JSON.stringify(item) + ']');
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }

            정보입력조회.사이버몰정보.push(item);
        }

        정보입력조회.서류송달정보 = {};
        // ** "8번 문항"에서 Y를 체크하고 해당없음으로 신청을 하게 되면 사이트에서도 8번문항관련 서류송달 사라짐
        if (resObj.ttiabcd015DVO && resObj.ttiabcd015DVO.dlvPlcClCd) {
            if (resObj.ttiabcd015DVO.dlvPlcClCd == 'ZZ' && this.is서류송달) {
                정보입력조회.서류송달정보.구분 = '3';
                정보입력조회.서류송달정보.주소자동이전여부 = "";
            }
            if (resObj.ttiabcd015DVO.dlvPlcClCd == '01') {
                this.is서류송달 = true;
                정보입력조회.서류송달정보.구분 = '1';
                정보입력조회.서류송달정보.주소자동이전여부 = resObj.ttiabcd015DVO.dlvPlcAltAgrYn;
            }
            if (resObj.ttiabcd015DVO.dlvPlcClCd == '99') {
                this.is서류송달 = true;
                정보입력조회.서류송달정보.구분 = '2';
                정보입력조회.서류송달정보.주소자동이전여부 = "";
            }
            if (resObj.txprAbftAdrInqr2DVO) {
                정보입력조회.서류송달정보.우편번호 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.zip);
                정보입력조회.서류송달정보.도로명주소 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.roadBscAdr);
                정보입력조회.서류송달정보.지번주소 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.ldBscAdr);
                정보입력조회.서류송달정보.건물명 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.bldBlckAdr);
                정보입력조회.서류송달정보.동 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.bldDnadr);
                정보입력조회.서류송달정보.층 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.bldFlorAdr);
                정보입력조회.서류송달정보.호 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.bldHoAdr);
                정보입력조회.서류송달정보.기타주소 = _nullToEnpty(resObj.txprAbftAdrInqr2DVO.etcDadr);
            }
        } else if (this.is서류송달) {
            정보입력조회.서류송달정보.구분 = '3';
            정보입력조회.서류송달정보.주소자동이전여부 = "";
        }

        정보입력조회.선택사항 = {};
        정보입력조회.선택사항.인허가사업여부 = (ttiabcm002DVO.gpBsYn == 'Y' ? "여" : "부");
        정보입력조회.선택사항.의제주류면허신청 = "1";
        if (ttiabcm002DVO.lfAlLcnTypeCd == '541')  정보입력조회.선택사항.의제주류면허신청 = "2";
        else if (ttiabcm002DVO.lfAlLcnTypeCd == '542')  정보입력조회.선택사항.의제주류면허신청 = "3";

        // 해당없음 ZZ선택하고 다시 불러오면 개별소비세해당여부 공백 됨. 처음 신청했을 때만 셋팅
        정보입력조회.선택사항.개별소비세해당여부 = ttiabcm002DVO.scntxTxtnClCd;
        if (개별소비세해당여부 == 'ZZ' && ttiabcm002DVO.scntxTxtnClCd == '') 정보입력조회.선택사항.개별소비세해당여부 = 'ZZ';

        // 입력한게 잘 적용되었는지 확인..
        if (기본정보flag == '1') {
            if ((기본정보.상호명 && (기본정보.상호명 != 정보입력조회.기본정보.상호명)) ||
                기본정보.개업일자 != 정보입력조회.기본정보.개업일자) {
                this.log("기본정보 2F10:[" + JSON.stringify(기본정보) + ']');
                this.log("정보입력조회 기본정보 2F10:[" + JSON.stringify(정보입력조회.기본정보) + ']')
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
        }
        if (사업장소재지정보flag == '1') {
            if ((사업장소재지정보.건물명 && (사업장소재지정보.건물명 != 정보입력조회.사업장소재지정보.건물명)) ||
                (사업장소재지정보.동 && (사업장소재지정보.동 != 정보입력조회.사업장소재지정보.동)) ||
                (사업장소재지정보.층 && (사업장소재지정보.층 != 정보입력조회.사업장소재지정보.층)) ||
                (사업장소재지정보.호 && (사업장소재지정보.호 != 정보입력조회.사업장소재지정보.호))) {
                this.log("사업장소재지정보 2F10:[" + JSON.stringify(사업장소재지정보) + ']');
                this.log("정보입력조회 사업장소재지정보 2F10:[" + JSON.stringify(정보입력조회.사업장소재지정보) + ']');
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
        }
        if (업종정보flag == '1') {
            if (업종정보.length != 정보입력조회.업종정보.length) {
                this.log("업종정보 2F10:[" + JSON.stringify(업종정보) + ']');
                this.log("정보입력조회 업종정보 2F10:[" + JSON.stringify(정보입력조회.기본정보) + ']')
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
        }
        if (사업자유형정보flag == '1') {
            if (사업자유형정보.유형 && (사업자유형정보.유형 != 정보입력조회.사업자유형정보.유형) ||
                사업자유형정보.종교단체여부 && (사업자유형정보.종교단체여부 != 정보입력조회.사업자유형정보.종교단체여부) ||
                사업자유형정보.간이과세포기신고여부 && (사업자유형정보.간이과세포기신고여부 != 정보입력조회.사업자유형정보.간이과세포기신고여부)) {
                this.log("사업자유형정보 2F10:[" + JSON.stringify(사업자유형정보) + ']');
                this.log("정보입력조회 사업자유형정보 2F10:[" + JSON.stringify(정보입력조회.사업자유형정보) + ']');
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
        }
        if (Object.keys(this.임대차정보).length > 0) {
            if (this.임대차정보.임대차정보.length != 정보입력조회.임대차정보.임대차목록.length) {
                this.log("임대차정보 2F10:[" + JSON.stringify(this.임대차정보.임대차정보) + ']');
                this.log("정보입력조회 임대차정보 2F10:[" + JSON.stringify(정보입력조회.임대차정보.임대차목록) + ']')
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
            for (var idxx = 0; idxx < this.임대차정보.임대차정보.length; idxx++) {
                var 임대차tmp = this.임대차정보.임대차정보[idxx];
                if ((임대차tmp.임대인구분 == '1' && (임대차tmp.임대인정보.getPlainTextWithRange(0, 6) != 정보입력조회.임대차정보.임대차목록[idxx].주민등록번호.substr(0, 6))) ||
                    (임대차tmp.임대인구분 == '2' && (임대차tmp.임대인정보.getPlainText() != 정보입력조회.임대차정보.임대차목록[idxx].사업자등록번호)) ||
                    (임대차tmp.임대인구분 == '3' && (임대차tmp.임대인정보.getPlainText() != 정보입력조회.임대차정보.임대차목록[idxx].법인등록번호))) {
                    this.log("임대차정보 2F10_2:[" + JSON.stringify(this.임대차정보.임대차정보[idxx]) + ']');
                    this.log("정보입력조회 임대차정보 2F10_2:[" + JSON.stringify(정보입력조회.임대차정보.임대차목록[idxx]) + ']')
                    this.setError(E_IBX_RESULT_FAIL);
                    return E_IBX_RESULT_FAIL;
                }
            }
        }
        if ((인허가사업여부 && (선택사항.인허가사업여부 != 정보입력조회.선택사항.인허가사업여부)) ||
            (의제주류면허신청 && (선택사항.의제주류면허신청 != 정보입력조회.선택사항.의제주류면허신청)) ||
            (개별소비세해당여부 && (선택사항.개별소비세해당여부 != 정보입력조회.선택사항.개별소비세해당여부))) {
            this.log("선택사항 2F10:[" + JSON.stringify(선택사항) + ']');
            this.log("정보입력조회 선택사항 2F10:[" + JSON.stringify(정보입력조회.선택사항) + ']');
            this.setError(E_IBX_RESULT_FAIL);
            return E_IBX_RESULT_FAIL;
        }

        // 정상이면 이전에 저장한 값 그대로 다시 신청
        this.url = '/wqAction.do?actionId=ATEABAAA008A01&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        storageData.waitCvaIdList = waitCvaIdList;
        this.postData = JSON.stringify(storageData);
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('진짜 신청 완료 :: [' + ResultStr + ']');

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"사업자 유형이 유효하지 않습니다."') >= 0) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 사업자유형정보 유형입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg":"', '"');
            return E_IBX_UNKNOWN;
        }

        this.cvaId = StrGrab(ResultStr, '"cvaId":"', '"');
        
        // 최신 데이터로 갱신
        this.JsonResult = JsonResult;
        // 한번 신청 했으니 이제 불러오기 mod
        this.사업자등록신청_조회구분 = '2';
        // 신청한 데이터로 저장
        this.최종제출storage = resObj;

        this.임대차정보 = {};
        this.사이버몰정보 = [];
        this.서류송달정보 = [];

        this.chkStep3 = '3';
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = 정보입력조회;

        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_정보입력조회 finally");
    }
}

PC조회발급서비스.prototype.사업자등록신청_제출서류입력 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_제출서류입력 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }
        
        // 각 조회구분마다 선행처리 job이달라 오류메시지 처리가 모호하여 기본 오류메시지로 처리
        if (this.chkStep3 != '3' && this.chkStep3 != '4') {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }

        var input = dec(aInput.Input);
		var 제출서류 = input.제출서류;

        var 파일명 = 제출서류.파일명;
        var FileIndex = 제출서류.Index;
        
        if (!파일명) {
            this.setError(E_IBX_PARAMETER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "제출서류 파일명 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_NOTENTER;
        }
        if (!FileIndex) {
            this.setError(E_IBX_PARAMETER_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "제출서류 Index 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_NOTENTER;
        }

        // 사이트에서 제공되는 첨부가능 파일형식 : PDF 파일, 이미지 파일(JPG, PNG, GIF, TIF, BMP)
        if (파일명.toUpperCase().indexOf('.PDF') < 0 && 파일명.toUpperCase().indexOf('.JPG') < 0 && 파일명.toUpperCase().indexOf('.PNG') < 0 &&
            파일명.toUpperCase().indexOf('.GIF') < 0 && 파일명.toUpperCase().indexOf('.TIF') < 0 && 파일명.toUpperCase().indexOf('.BMP') < 0) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 제출서류 파일명입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
        }
        if (isNaN(FileIndex)) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 제출서류 Index입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }

        var req = {};
        req.파일명 = 파일명;
        req.Index = FileIndex;

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.CallBackfunc = 'ReadFile';
        this.iSASInOut.Output.Result.req = {};
        this.iSASInOut.Output.Result.req.API = 'ReadFile';
        this.iSASInOut.Output.Result.req.req = req;
        
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_제출서류입력 finally");
    }
}

PC조회발급서비스.prototype.ReadFile = function (aInput) {
    this.log("ReadFile :: input ::" + aInput);
    try {
        var input = dec(aInput.Input);
        this.log('ReadFile input:[' + JSON.stringify(input) + ']');

        var 파일명, 파일크기, BASE64데이터, 마지막제출;

        if (input.BASE64데이터) {
            var 파일명 = input.파일명;
            var 파일크기 = input.파일크기;
            var BASE64데이터 = input.BASE64데이터;
            var 마지막제출 = input.마지막제출.toUpperCase();

            // BASE64데이터 길이 이슈로 결과Input "***"처리
            if (input.BASE64데이터) this.iSASInOut.Input.BASE64데이터 = "***";

        } else { // 내부 클라우드서버에서만 사용
            var pdfUserAgent = '{"User-Agent":"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)","Content-Type":"application/json"}';

            마지막제출 = input.마지막제출;

            var URL = input.URL;
            var Query = input.Query;
            Query = JSON.stringify(Query);

            if (httpRequest.postWithUserAgent(pdfUserAgent, URL, Query) == false) {
                this.setError(E_IBX_FAILTOGETPAGE_MASK);
                return E_IBX_FAILTOGETPAGE_MASK;
            }
            this.log("PDF정보통신: [" + httpRequest.result + "]");

            try {
                var pdfData = JSON.parse(httpRequest.result);
                파일명 = pdfData.fileName;
                파일크기 = pdfData.size;
                BASE64데이터 = pdfData.base64;
            } catch (e) {
                this.log("JSON exception: " + e.message);
                this.setError(E_IBX_N00003_DOWNUP_CHECK_MESSAGE);
                return E_IBX_N00003_DOWNUP_CHECK_MESSAGE;
            }
        }

        if (!파일명 || !파일크기 || !BASE64데이터 || !마지막제출) {
            this.setError(E_IBX_KEY_P30101_ADD_FILE_NOTEXIST);
            return E_IBX_KEY_P30101_ADD_FILE_NOTEXIST;
        }
        if (isNaN(파일크기) || ["Y", "N"].indexOf(마지막제출) < 0) {
            this.setError(E_IBX_KEY_P30101_ADD_FILE_INVALID);
            return E_IBX_KEY_P30101_ADD_FILE_INVALID;
        }

		system.setStatus(IBXSTATE_EXECUTE, 50);
        
        var 파일제출Count = this.파일제출Count;
        this.log("파일제출Count: " + 파일제출Count);

        if (파일제출Count == 0) {  // 파일제출 첫호출
            this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0","Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

            this.url = '/permission.do?screenId=UTEABAAA76';
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log("session_1: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
                return E_IBX_UNKNOWN;
            }

            this.url = '/permission.do?realScreenId=UTECAAAZ06';
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("session_2: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
                return E_IBX_UNKNOWN;
            }

            system.setStatus(IBXSTATE_EXECUTE, 50);

            this.url = '/wqAction.do?actionId=ATECAABA001R06&screenId=UTECAAAZ06&popupYn=false&realScreenId=';
            postData = {};
            postData.cvaKndCd = "A2004";
            postData.cvaFrmlClCd = "01,02,03";
            this.postData = JSON.stringify(postData);

            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("제출서류입력_1: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
                return E_IBX_UNKNOWN;
            }

            /*
                홈택스 파일 업로드
                - makeEncryptParam : RaonKBase64인코딩 함수
                - makeDecryptReponseMessage : RaonKBase64디코딩 함수
            */

            this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8","Accept":"*/*"}';

            this.url = '/fileUploadDownloadNX.do?';
            this.param  = 'k00=' + RaonKBase64.makeEncryptParam('kc\fc21\vk14\fraonkupload.nts.xml.txt');
            this.param += '&=undefined';
            this.param += '&uploadTypeCd=01';
            this.param += '&onlineBatch=online';
            this.param += '&t=' + new Date().getTime();

            if (httpRequest.getWithUserAgent(this.userAgent, this.pdfHost1 + this.url + this.param) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("제출서류입력_2: [" + ResultStr + "]");

            if (ResultStr.indexOf('<RAONK>') < 0 ||
                ResultStr.indexOf('</RAONK>') < 0 ||
                ResultStr.indexOf('[OK]') < 0) {
                this.setError(E_IBX_SITE_INVALID);
                return E_IBX_SITE_INVALID;
            }

            this.url = '/sxec/kupload/upload_ecm.jsp?raonk=' + new Date().getTime();
            this.postData = 'k00=' + RaonKBase64.makeEncryptParam('kc\fc00\vk01\f0');

            if (httpRequest.postWithUserAgent(this.userAgent, this.sxswHost + this.url, this.postData) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("제출서류입력_3: [" + ResultStr + "]");

            if (ResultStr.indexOf('<RAONK>') < 0 ||
                ResultStr.indexOf('</RAONK>') < 0) {
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            this.url = '/permission.do?realScreenId=UTECMGAA07';
            if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("session_3: [" + ResultStr + "]");

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
                ResultStr.indexOf('"msg":-9403') >= 0 ||
                ResultStr.indexOf('"errorCd":-9403') >= 0 ||
                ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
                ResultStr.indexOf('"msg":-9404') >= 0 ||
                ResultStr.indexOf('"errorCd":-9404') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }
            if (ResultStr.indexOf('"result":"F"') >= 0) {
                this.setError(E_IBX_UNKNOWN);
                this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
                return E_IBX_UNKNOWN;
            }
    
            try {
                var resObj = JSON.parse(ResultStr);
                this.파일제출tin = resObj.resultMsg.sessionMap.tin;
            } catch (e) {
                this.log("JSON exception: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }
            this.log("tin: " + this.파일제출tin);
        }

        // 파일등록
        var guid = RaonKBase64.makeGuid();
        var subDir = new Date().yyyymmdd() + '/' + '0000004' + '/' + this.파일제출tin;

        this.userAgent = '{';
        this.userAgent += '"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",';
        this.userAgent += '"Accept":"*/*",';
        this.userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",';
        this.userAgent += '"Accept-Encoding":"gzip, deflate, br, zstd",';
        this.userAgent += '"Accept-Language":"ko,en;q=0.9,en-US;q=0.8",';
        this.userAgent += '"Referer":"https://hometax.go.kr/"';
        this.userAgent += '}';

        this.url = '/sxec/kupload/upload_ecm.jsp';
        var EncQuery  = 'kc\fc01\vk01\f0\vk05\f0\vk11\f1\v';
            EncQuery += 'k12\f' + guid + '\v';
            EncQuery += 'k13\f' + 파일크기 + '\v';
            EncQuery += 'k14\f' + 파일명 + '\v';
            EncQuery += 'k15\fREALFILENAME\v';
            EncQuery += 'k16\fi\v';
            EncQuery += 'k17\f' + subDir + '\v';
            EncQuery += 'k20\f' + 파일제출Count + (마지막제출 == "Y" ? 'z' : '') + '\v';
            EncQuery += 'k21\f\v';
        this.log("EncQuery1: " + EncQuery);

        this.postData  = 'k00=' + RaonKBase64.makeEncryptParam(EncQuery);

        if (httpRequest.postWithUserAgent(this.userAgent, this.sxswHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("제출서류입력_4[" + 파일제출Count + "]: [" + ResultStr + "]");

        if (ResultStr.indexOf('<RAONK>') < 0 ||
            ResultStr.indexOf('</RAONK>') < 0 ||
            ResultStr.indexOf('[OK]') < 0) {
            this.setError(E_IBX_SITE_INVALID + 3);
            return E_IBX_SITE_INVALID + 3;
        }

        var RAONK = StrGrab(StrGrab(ResultStr, '<RAONK>', '</RAONK>'), '[OK]', '');
        var RAONKDecryptData = RaonKBase64.makeDecryptReponseMessage(RAONK);

        this.userAgent = '{';
        this.userAgent += '"Content-Type":"multipart/form-data; boundary=----WebKitFormBoundaryjQPfmvFov7LUXmEX",';
        this.userAgent += '"Accept":"*/*",';
        this.userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",';
        this.userAgent += '"Accept-Encoding":"gzip, deflate, br, zstd",';
        this.userAgent += '"Accept-Language":"ko,en;q=0.9,en-US;q=0.8",';
        this.userAgent += '"Referer":"https://hometax.go.kr/"';
        this.userAgent += '}';

        EncQuery  = 'kc\fc02\vk01\f0\vk03\f0\vk05\f0\vk12\f';
        EncQuery += guid;
        EncQuery += '\vk19\f0\vk26\f';
        EncQuery += StrGrab(RAONKDecryptData, '', '\v');
        this.log("EncQuery2: " + EncQuery);

        if (RAONKDecryptData.indexOf('/data0.p/solme/innorix/') < 0) {
            this.setError(E_IBX_SITE_INVALID + 4);
            return E_IBX_SITE_INVALID + 4;
        }

        this.mergeFileList += StrGrab(RAONKDecryptData, '/data0.p/solme/innorix/', '.') + '.pdf;'; // 뒤 통신에선 이미지파일도 .PDF로 통신
        this.sxsdPath += StrGrab(RAONKDecryptData, '/data0.p/solme/innorix/', '') + ';';
        this.sxsdSize += StrGrab(RAONKDecryptData, '', '') + ';';

        if (RAONKDecryptData.toUpperCase().indexOf('.JPG') > -1 || RAONKDecryptData.toUpperCase().indexOf('.PNG') > -1 || RAONKDecryptData.toUpperCase().indexOf('.GIF') > -1 ||
            RAONKDecryptData.toUpperCase().indexOf('.TIF') > -1 || RAONKDecryptData.toUpperCase().indexOf('.BMP') > -1) {
            this.imagePath += StrGrab(RAONKDecryptData, '/data0.p/solme/innorix/', '') + ';';
        }

        this.url = '/sxec/kupload/upload_ecm.jsp?raonk=' + RaonKBase64.makeGuidTagName("urk_");

        sasHttpReqStream.clear();
        sasHttpReqStream.append('------WebKitFormBoundaryjQPfmvFov7LUXmEX\r\n');
        sasHttpReqStream.append('Content-Disposition: form-data; name="k00"\r\n');
        sasHttpReqStream.append('\r\n');
        sasHttpReqStream.append(RaonKBase64.makeEncryptParam(EncQuery));
        sasHttpReqStream.append('\r\n');
        sasHttpReqStream.append('------WebKitFormBoundaryjQPfmvFov7LUXmEX\r\n');
        sasHttpReqStream.append('Content-Disposition: form-data; name="Slice"; filename="blob"\r\n');
        sasHttpReqStream.append('Content-Type: application/octet-stream\r\n');
        sasHttpReqStream.append('\r\n');
        sasHttpReqStream.appendFromBase64(BASE64데이터);
        sasHttpReqStream.append('\r\n');
        sasHttpReqStream.append('------WebKitFormBoundaryjQPfmvFov7LUXmEX--');
        sasHttpReqStream.append('\r\n');

        if (httpRequest.postRequestStreamWithUserAgent(this.userAgent, this.sxswHost + this.url) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("제출서류입력_5[" + 파일제출Count + "]: [" + ResultStr + "]");

        if (ResultStr.indexOf('<RAONK>') < 0 ||
            ResultStr.indexOf('</RAONK>') < 0 ||
            ResultStr.indexOf('[OK]') < 0) {
            this.setError(E_IBX_SITE_INVALID + 5);
            return E_IBX_SITE_INVALID + 5;
        }

        this.userAgent = '{';
        this.userAgent += '"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",';
        this.userAgent += '"Accept":"*/*",';
        this.userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",';
        this.userAgent += '"Accept-Encoding":"gzip, deflate, br, zstd",';
        this.userAgent += '"Accept-Language":"ko,en;q=0.9,en-US;q=0.8",';
        this.userAgent += '"Referer":"https://hometax.go.kr/"';
        this.userAgent += '}';

        EncQuery  = 'kc\fc03\vk01\f0\vk12\f';
        EncQuery += guid + '\v';
        EncQuery += 'k14\f' + 파일명 + '\v';
        EncQuery += 'k15\fREALFILENAME\v';
        EncQuery += 'k16\fi\v';
        EncQuery += 'k17\f' + subDir + '\v';
        EncQuery += 'k20\f' + 파일제출Count + (마지막제출 == "Y" ? 'z' : '') + '\v';
        EncQuery += 'k21\f';
        this.log("EncQuery3: " + EncQuery);

        this.url = '/sxec/kupload/upload_ecm.jsp';
        this.postData  = 'k00=' + RaonKBase64.makeEncryptParam(EncQuery);

        if (httpRequest.postWithUserAgent(this.userAgent, this.sxswHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("제출서류입력_6[" + 파일제출Count + "]: [" + ResultStr + "]");

        if (ResultStr.indexOf('<RAONK>') < 0 ||
            ResultStr.indexOf('</RAONK>') < 0 ||
            ResultStr.indexOf('[OK]') < 0) {
            this.setError(E_IBX_SITE_INVALID + 6);
            return E_IBX_SITE_INVALID + 6;
        }

        this.파일제출Count++;
        
        this.subDir = subDir;
        if (마지막제출 == "Y") this.마지막제출호출여부 = true;

        var saveItem = {};
        saveItem.파일명 = 파일명;
        saveItem.파일크기 = 파일크기;

        this.SavedList.push(saveItem);

        this.log("this.파일제출Count : " + this.파일제출Count);

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.제출파일목록 = this.SavedList;

        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " ReadFile finally");
    }
};

PC조회발급서비스.prototype.사업자등록신청_최종제출 = function (aInput) {
    this.log("PC조회발급서비스 사업자등록신청_최종제출 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        // 제출서류입력이 1회이상 호출되었으나 마지막제출을 하지 않은 경우
        if (!this.마지막제출호출여부 && this.SavedList.length != 0) {
            this.setError(E_IBX_SERVICE_NEED_PREPROCESSING);
            return E_IBX_SERVICE_NEED_PREPROCESSING;
        }

        // 파일제출
        var storageData = this.최종제출storage; // 신청쿼리에 사용되는 신청정보
        this.log("storageData: " + JSON.stringify(storageData));

        if (!storageData) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        // 제출할 파일이 있을 경우(제출서류입력 1회이상 호출한 경우)
        if (this.SavedList.length != 0) {
            this.userAgent = '{';
            this.userAgent += '"Content-Type":"application/json;charset=utf-8",';
            this.userAgent += '"Accept":"*/*",';
            this.userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",';
            this.userAgent += '"Accept-Encoding":"gzip, deflate, br, zstd",';
            this.userAgent += '"Accept-Language":"ko,en;q=0.9,en-US;q=0.8",';
            this.userAgent += '"Referer":"https://hometax.go.kr/"';
            this.userAgent += '}';
            
            this.url = '/sxsd/v3/documents/magicNo?callback=callback';
            this.param  = '&path=' + httpRequest.URLEncode(httpRequest.URLEncode(this.sxsdPath, 'UTF-8'), 'UTF-8');
            this.param += '&fileSize=' + httpRequest.URLEncode(this.sxsdSize, 'UTF-8');
            this.param += '&_=' + new Date().getTime();

            if (httpRequest.getWithUserAgent(this.userAgent, this.sxswHost + this.url + this.param) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log("최종제출_1: [" + ResultStr + "]");

            var result = StrGrab(ResultStr, 'callback(', ');');
            try {
                var resObj = JSON.parse(result);

                // 제출파일 정상인지 오류처리
                //   DRM 체크 HTML 버전 호출.
                //   $.ajax({
                //     url: 'https://' + scwin.hostNmPre + 'sxsw.hometax.go.kr/sxsd/v3/documents/magicNo',
                //     type: 'GET',
                //     cache: false,
                //     dataType: 'jsonp',
                //     jsonpCallback: "callback",
                //     contentType: 'application/json; charset=utf-8',
                //     data: {
                //       'path': nxEncodeURI,
                //       'fileSize': str_nxFileSize
                //     },
                //     success: function (data, xhr) {
                //       //2018.12.11
                //       var data_resultList = data.data.result.split(';');
                //       var retVal = File.UploadFileInfo();
                //       for (var i = 0; i < data_resultList.length - 1; i++) {
                //         if (data_resultList[i] == "false") {
                //           $c.util.nts_hideBar($p);
                //           alert("정상적인 파일이 아니거나 DRM 적용된 파일은 선택할 수 없습니다.\n→ [ " + retVal[i][3] + " ]");
                //           return false;
                //         }
                //       }
                //       scwin.fn_nxCallbackHtmlDrmCheckNo(data.data);
                //     },
                //     error: function (xhr, ajaxOptions, thrownError) {
                //       alert(thrownError);
                //       $c.util.nts_hideBar($p);
                //     }
                //   });
                // };

                var path;
                var File_0 = [];
                var File_N = [];
                var FileFail = false;
                var retVal = resObj.data.path.split(';');
                var data_resultList = resObj.data.result.split(';');
                var fileSize_resultList = resObj.data.fileSize.split(';');
                for (var i = 0; i < data_resultList.length - 1; i++) {
                    if (data_resultList[i] == "false") {
                        FileFail = true;
                        path = retVal[i].split('/');
                        if (parseInt(fileSize_resultList[i]) <= 0){
                            File_0.push(path[3]);
                        } else {
                            File_N.push(path[3]);
                        }
                    }
                }
            } catch (e) {
                this.log("exception: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }
            if (resObj.result == "false") {
                this.log("magicNo Error");
                this.setError(E_IBX_P14101_REG_MISC);
                return E_IBX_P14101_REG_MISC;
            }

            if (FileFail == true){
                if (File_0.length > 0){
                    this.setError(E_IBX_KEY_P30101_ADD_FILE_NOTEXIST);
                    this.iSASInOut.Output.ErrorMessage = "정상적인 파일이 아니거나 DRM 적용된 파일은 선택할 수 없습니다. "+ JSON.stringify(File_0);
                    return E_IBX_KEY_P30101_ADD_FILE_NOTEXIST;
                }
                else if (File_N.length > 0){
                    this.setError(E_IBX_KEY_P30101_ADD_FILE_DISKOVER);
                    this.iSASInOut.Output.ErrorMessage = "정상적인 파일이 아니거나 DRM 적용된 파일은 선택할 수 없습니다. "+ JSON.stringify(File_N);
                    return E_IBX_KEY_P30101_ADD_FILE_DISKOVER;
                } else {
                    this.setError(E_IBX_KEY_P30101_ADD_FILE_INVALID);
                    this.iSASInOut.Output.ErrorMessage = "정상적인 파일이 아니거나 DRM 적용된 파일은 선택할 수 없습니다.";
                    return E_IBX_KEY_P30101_ADD_FILE_INVALID;
                }
            }

            if (this.imagePath) {
                this.url = '/sxsd/v3/documents/convert?callback=callback';
                this.param  = '&path=' + httpRequest.URLEncode(httpRequest.URLEncode(this.imagePath, 'UTF-8'), 'UTF-8');
                this.param += '&_=' + new Date().getTime();

                if (httpRequest.getWithUserAgent(this.userAgent, this.sxswHost + this.url + this.param) == false) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log("최종제출_이미지변환: [" + ResultStr + "]");
            }

            this.url = '/sxsd/v3/documents/password?callback=callback';
            this.param  = '&path=' + httpRequest.URLEncode(httpRequest.URLEncode(this.sxsdPath, 'UTF-8'), 'UTF-8');
            this.param += '&fileSize=' + httpRequest.URLEncode(this.sxsdSize, 'UTF-8');
            this.param += '&_=' + new Date().getTime();

            if (httpRequest.getWithUserAgent(this.userAgent, this.sxswHost + this.url + this.param) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("최종제출_2: [" + ResultStr + "]");
        } else {
            this.파일제출tin = this.PC조회발급서비스homeTaxSession.tin;
            this.subDir = new Date().yyyymmdd() + '/' + '0000004' + '/' + this.파일제출tin;
        }
        
        var resultData = fn_getBmanReg(storageData);
        if (resultData.errorCode != S_IBX_OK) {
            this.setError(resultData.errorCode);
            return resultData.errorCode;
        }
        resultData = resultData.result;
        this.log("resultData:[" + JSON.stringify(resultData) + "]");
        
        // 쪼개서 쿼리 보내고 있음.
        var chunks = encodeFieldParams(resultData, 1000);
        var dataKey = "";
        for (var idx = 0; idx < chunks.length; idx++) {
            this.log(JSON.stringify(chunks[idx]));

            this.url = "/sxsd/v3/documents/fg/field/info?callback=callback&splitInfo=";
            this.param = StrReplace(httpRequest.URLEncode(chunks[idx]), '=', '%3D');
            this.param = this.param + '&key=' + httpRequest.URLEncode(dataKey, 'UTF-8');
            this.param += '&_=' + new Date().getTime();
    
            if (httpRequest.getWithUserAgent(this.userAgent, this.sxswHost + this.url + this.param) == false) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            ResultStr = httpRequest.result;
            this.log("최종제출_접수" + (idx) + ": [" + ResultStr + "]");

            dataKey = StrGrab(ResultStr, '"key":"', '"');

            if (!dataKey) {
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }
        }

        var subFormCd = "";

        var isContent = false; //기타민원의견 존재유무
        var isCoOperators = false; //공동사업자 유무(신청 전용)
        var isPlaceServed = false; //송달주소 유무
        var isNewMajCond = false; //업종코드 존재유무(신청 전용)
        var isRnthCond = ""; //임대주택존재여부

        for (var i = 0; i < resultData.length; i++) {
            if (resultData[i]["fieldName"] == "DWS_CONTENT" && !nts_isNull(resultData[i]["fieldValue"])) {
                isContent = true;
            }
            if (resultData[i]["fieldName"] == "DWS_NEW_MAJ_COND" && !nts_isNull(resultData[i]["fieldValue"])) {
                isNewMajCond = true;
            }
            if (resultData[i]["fieldName"] == "DWS_CO_OPERATORS_SPEC_YN" && resultData[i]["fieldValue"] == "Y") {
                isCoOperators = true;
            } else if (resultData[i]["fieldName"] == "DWS_PLACE_SERVED_YN" && resultData[i]["fieldValue"] == "Y") {
                isPlaceServed = true;
            }

            /* 2020-12-01 임대주택 추가 1장 */
            if (resultData[i]["fieldName"] == "DWS_RNTH_GB_NM1" && !nts_isNull(resultData[i]["fieldValue"])) {
                isRnthCond = "E000007";
            }
            /* 2020-12-01 임대주택 추가 2장*/
            if (resultData[i]["fieldName"] == "DWS_RNTH_GB_NM8" && !nts_isNull(resultData[i]["fieldValue"])) {
                isRnthCond = "E000008";
            }
        }

        //기타민원의견 (E000001)
        if ((isCoOperators || isPlaceServed) && !isNewMajCond && !isContent) {
            subFormCd = "E000004";
        } else if (!isCoOperators && !isPlaceServed && (isNewMajCond || isContent)) {
            subFormCd = "E000001";
        } else if ((isCoOperators || isPlaceServed) && (isNewMajCond || isContent)) {
            subFormCd = "E000006";
        }

        // 예외케이스는 좀 봐야할 듯
        if (subFormCd != "E000001" && subFormCd != "E000006") {
            this.setError(E_IBX_SITE_INVALID + 3);
            return E_IBX_SITE_INVALID + 3;
        }


        this.url = '/sxsd/v3/documents/fg/merge?callback=callback';
        this.param  = '&formCd=I100400';
        this.param += '&subFormCd=' + subFormCd;
        this.param += '&mergeFileList=' + httpRequest.URLEncode(httpRequest.URLEncode(this.mergeFileList, 'UTF-8'), 'UTF-8');
        this.param += '&subDir=' + httpRequest.URLEncode(this.subDir, 'UTF-8');
        this.param += '&key=' + httpRequest.URLEncode(dataKey, 'UTF-8');
        this.param += '&_=' + new Date().getTime();

        if (httpRequest.getWithUserAgent(this.userAgent, this.sxswHost + this.url + this.param) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_6: [" + ResultStr + "]");

        if (ResultStr.indexOf('>500 Internal Server Error<') > -1) {
            this.setError(E_IBX_P14101_REG_MISC);
            return E_IBX_P14101_REG_MISC;
        }

        var pdfPathData = StrGrab(ResultStr, '"pdfPath":"', '"');
        var pdfPath = pdfPathData.split('/');

        this.userAgent = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        this.url = '/permission.do?screenId=UTEABAAA91';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_1: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/permission.do?realScreenId=UTECAAAZ06';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_2: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        system.setStatus(IBXSTATE_EXECUTE, 50);

        this.url = '/wqAction.do?actionId=ATECAABA001R06&screenId=UTECAAAZ06&popupYn=false&realScreenId=';
        postData = {};
        postData.cvaKndCd = "A2004";
        postData.cvaFrmlClCd = "01,02,03";
        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_7: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8","Accept":"*/*"}';

        this.url = '/fileUploadDownloadNX.do?';
        this.param  = 'k00=' + RaonKBase64.makeEncryptParam('kc\fc21\vk14\fraonkupload.nts.xml.txt');
        this.param += '&=undefined';
        this.param += '&uploadTypeCd=01';
        this.param += '&onlineBatch=online';
        this.param += '&t=' + new Date().getTime();

        if (httpRequest.getWithUserAgent(this.userAgent, this.pdfHost1 + this.url + this.param) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_8: [" + ResultStr + "]");

        if (ResultStr.indexOf('<RAONK>') < 0 ||
            ResultStr.indexOf('</RAONK>') < 0 ||
            ResultStr.indexOf('[OK]') < 0) {
            this.setError(E_IBX_SITE_INVALID + 4);
            return E_IBX_SITE_INVALID + 4;
        }

        this.url = '/sxec/kupload/upload_ecm.jsp?raonk=' + new Date().getTime();
        this.postData = 'k00=' + RaonKBase64.makeEncryptParam('kc\fc00\vk01\f0');

        if (httpRequest.postWithUserAgent(this.userAgent, this.sxswHost + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_9: [" + ResultStr + "]");

        if (ResultStr.indexOf('<RAONK>') < 0 ||
            ResultStr.indexOf('</RAONK>') < 0) {
            this.setError(E_IBX_SITE_INVALID + 5);
            return E_IBX_SITE_INVALID + 5;
        }

        this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0","Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        this.url = '/permission.do?realScreenId=UTECMGAA07';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_3: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/wqAction.do?actionId=ATTCMGAA001R03&screenId=UTECMGAA07&popupYn=false&realScreenId=';
        postData = {};
        postData.tin = this.파일제출tin;
        postData.schEcabId = "";
        postData.ecabRcdgBsafKndCd = "0000004";
        postData.bsafRfkClCd = "08";
        postData.bsafScrnId = "UTECAAAZ06";
        postData.bsafLnkId = new Date().yyyymmdd() + "UTECAAAZ06";
        postData.rltnEcabId = "";
        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_10: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0", "Accept":"*/*", "Referer":"https://hometax.go.kr/"}';
        
        this.url = '/sxsd/v3/documents/register/path?callback=callback';
        this.param  = '&path=' + httpRequest.URLEncode(pdfPathData, 'UTF-8');
        this.param += '&_=' + new Date().getTime();

        if (httpRequest.getWithUserAgent(this.userAgent, this.sxswHost + this.url + this.param) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_11: [" + ResultStr + "]");

        this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0","Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        this.url = '/permission.do?screenId=UTECMGAA13';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_4: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/wqAction.do?actionId=ATECMGAA001C03&screenId=UTECMGAA07&popupYn=false&realScreenId=';
        postData = {};
        postData.tin = this.파일제출tin;
        postData.ecabId = "";
        postData.memNo = "";
        postData.memNm = "";
        postData.txhfOgzCd = "320";
        postData.txhfOgzNm = "";
        postData.ssnId = "";
        postData.mdfYn = "N";
        postData.dutsCd = "CB01";
        postData.ecabRcdgBsafKndCd = "0000004";
        postData.ecabSrvrUpldFleSVO = [];
        
        var pdfItem = {};
        pdfItem.fleId = "";
        pdfItem.fleSubPth = pdfPath[0] + "/" + pdfPath[1] + "/" + pdfPath[2];
        pdfItem.fleNm = pdfPath[3];
        pdfItem.orcFleNm = pdfPath[3];
        pdfItem.statusValue = "C";

        postData.ecabSrvrUpldFleSVO.push(pdfItem);

        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_12: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('데이터 전송이 실패하였습니다') >= 0) {
            this.setError(E_IBX_P14101_REG_MISC);
            return E_IBX_P14101_REG_MISC;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            resObj = JSON.parse(ResultStr);
            var ecabId = resObj.ecabId;
            var memNo = resObj.memNo;
            var ssnId = resObj.ssnId;
            var ecabSrvrUpldFleSVO = resObj.ecabSrvrUpldFleSVO[0];
        } catch (e) {
            this.log("exception: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 6);
            return E_IBX_SITE_INVALID + 6;
        }

        this.url = '/wqAction.do?actionId=ATEABAAA006A06&screenId=UTEABAAA91&popupYn=true&realScreenId=';
        postData = {};
        postData.abftChrgDutsCd = "";
        postData.abftChrgTxhfOgzCd = "";
        postData.cvaId = this.cvaId;
        postData.ecabId = ecabId;
        postData.ecabBscDVOList = [];

        var ecabBscItem = {};
        ecabBscItem.chk = "";
        ecabBscItem.ecabId = ecabId;
        ecabBscItem.ecabStat = "C";
        ecabBscItem.ecabSkey = ssnId;
        ecabBscItem.tin = this.파일제출tin;
        ecabBscItem.ecabFleVrsnNm = "";
        ecabBscItem.ecabRcdgBsafKndCd = "0000004";
        ecabBscItem.bsafRfkClCd = "";
        ecabBscItem.bsafRcpnDt = "";
        ecabBscItem.bsafRfkNo1 = "";
        ecabBscItem.bsafRfkNo2 = "";
        ecabBscItem.bsafRfkNo3 = "";
        ecabBscItem.fleRgtDtm = "";
        ecabBscItem.lnkTrtClCd = "01";
        ecabBscItem.optrTxhfOgzCd = "320";
        ecabBscItem.optrDutsCd = "CB01";
        ecabBscItem.optrMemNo = memNo;
        ecabBscItem.ecabFlngOrdr = "1";
        ecabBscItem.searchLstAltDtm = "";
        ecabBscItem.ecabFleDetailId = "";
        ecabBscItem.ecabFleUuid = "";
        ecabBscItem.ecabFleOrdr = "";
        ecabBscItem.fleNm = "";
        ecabBscItem.fleClCd = "";
        ecabBscItem.pageCnt = "";
        ecabBscItem.pntmCertYn = "";
        ecabBscItem.pntmCertDtm = "";
        ecabBscItem.scanImgInfrCntn = "";
        ecabBscItem.orcFleUuid = "";
        ecabBscItem.orcFleNm = "";
        ecabBscItem.ecabFrmlSn = "";
        ecabBscItem.frmlPageNo = "";
        ecabBscItem.frmlCd = "";
        ecabBscItem.frmlNm = "";
        ecabBscItem.altDtm = "";
        ecabBscItem.rowSeq = "";
        ecabBscItem.strcDpth = "";
        ecabBscItem.sortNm = "";
        ecabBscItem.statusValue = "R";
        postData.ecabBscDVOList.push(ecabBscItem);

        postData.ecabFleDetailDVOList = [];

        var ecabFleDetail = {};
        ecabFleDetail.chk = "";
        ecabFleDetail.ecabId = ecabId;
        ecabFleDetail.ecabStat = "C";
        ecabFleDetail.ecabSkey = "";
        ecabFleDetail.tin = "";
        ecabFleDetail.ecabFleVrsnNm = "";
        ecabFleDetail.ecabRcdgBsafKndCd = "";
        ecabFleDetail.bsafRfkClCd = "";
        ecabFleDetail.bsafRcpnDt = "";
        ecabFleDetail.bsafRfkNo1 = "";
        ecabFleDetail.bsafRfkNo2 = "";
        ecabFleDetail.bsafRfkNo3 = "";
        ecabFleDetail.fleRgtDtm = "";
        ecabFleDetail.lnkTrtClCd = "";
        ecabFleDetail.optrTxhfOgzCd = "";
        ecabFleDetail.optrDutsCd = "";
        ecabFleDetail.optrMemNo = "";
        ecabFleDetail.ecabFlngOrdr = "";
        ecabFleDetail.searchLstAltDtm = "";
        ecabFleDetail.ecabFleDetailId = "";
        ecabFleDetail.ecabFleUuid = ecabSrvrUpldFleSVO.fleId;
        ecabFleDetail.ecabFleOrdr = "1";
        ecabFleDetail.fleNm = ecabSrvrUpldFleSVO.fleNm;
        ecabFleDetail.fleClCd = "";
        ecabFleDetail.pageCnt = "1";
        ecabFleDetail.pntmCertYn = "N";
        ecabFleDetail.pntmCertDtm = "";
        ecabFleDetail.scanImgInfrCntn = "";
        ecabFleDetail.orcFleUuid = "";
        ecabFleDetail.orcFleNm = "";
        ecabFleDetail.ecabFrmlSn = "";
        ecabFleDetail.frmlPageNo = "";
        ecabFleDetail.frmlCd = "";
        ecabFleDetail.frmlNm = "";
        ecabFleDetail.altDtm = "";
        ecabFleDetail.rowSeq = "";
        ecabFleDetail.strcDpth = "";
        ecabFleDetail.sortNm = "";
        ecabFleDetail.pubcUserNo = "";
        ecabFleDetail.statusValue = "R";
        postData.ecabFleDetailDVOList.push(ecabFleDetail);

        postData.ecabFrmlDetailDVOList = [];

        var ecabFrmlDetail = {};
        ecabFrmlDetail.chk = "";
        ecabFrmlDetail.ecabId = "";
        ecabFrmlDetail.ecabStat = "C";
        ecabFrmlDetail.ecabSkey = "";
        ecabFrmlDetail.tin = "";
        ecabFrmlDetail.ecabFleVrsnNm = "";
        ecabFrmlDetail.ecabRcdgBsafKndCd = "";
        ecabFrmlDetail.bsafRfkClCd = "";
        ecabFrmlDetail.bsafRcpnDt = "";
        ecabFrmlDetail.bsafRfkNo1 = "";
        ecabFrmlDetail.bsafRfkNo2 = "";
        ecabFrmlDetail.bsafRfkNo3 = "";
        ecabFrmlDetail.fleRgtDtm = "";
        ecabFrmlDetail.lnkTrtClCd = "";
        ecabFrmlDetail.optrTxhfOgzCd = "";
        ecabFrmlDetail.optrDutsCd = "";
        ecabFrmlDetail.optrMemNo = "";
        ecabFrmlDetail.ecabFlngOrdr = "";
        ecabFrmlDetail.searchLstAltDtm = "";
        ecabFrmlDetail.ecabFleDetailId = "";
        ecabFrmlDetail.ecabFleUuid = ecabSrvrUpldFleSVO.fleId;
        ecabFrmlDetail.ecabFleOrdr = "";
        ecabFrmlDetail.fleNm = "";
        ecabFrmlDetail.fleClCd = "";
        ecabFrmlDetail.pageCnt = "";
        ecabFrmlDetail.pntmCertYn = "";
        ecabFrmlDetail.pntmCertDtm = "";
        ecabFrmlDetail.scanImgInfrCntn = "";
        ecabFrmlDetail.orcFleUuid = "";
        ecabFrmlDetail.orcFleNm = "";
        ecabFrmlDetail.ecabFrmlSn = "";
        ecabFrmlDetail.frmlPageNo = "1";
        ecabFrmlDetail.frmlCd = "I100400";
        ecabFrmlDetail.frmlNm = "사업자등록 신청서(개인사업자용)";
        ecabFrmlDetail.altDtm = "";
        ecabFrmlDetail.rowSeq = "";
        ecabFrmlDetail.strcDpth = "";
        ecabFrmlDetail.sortNm = "";
        ecabFrmlDetail.pubcUserNo = "";
        ecabFrmlDetail.statusValue = "R";
        postData.ecabFrmlDetailDVOList.push(ecabFrmlDetail);

        postData.userReqInfoVO = {};
        postData.userReqInfoVO.uData = "";

        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_13: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/permission.do?screenId=UTECAABA01';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_5: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/wqAction.do?actionId=ATECAABA002R01&screenId=UTECAABA01&popupYn=false&realScreenId=';
        postData = {};
        postData.aplnEndDt = new Date().yyyymmdd();
        postData.aplnStrtDt = new Date().yyyymmdd();
        postData.aplnTin = this.파일제출tin;
        postData.cvaAgnRltCd = "";
        postData.cvaKndCd = "";
        postData.cvaKndNm = "";
        postData.cvaMateClCdChkYn = "Y";
        postData.hofcTin = "";
        postData.lnkClCd = "";
        postData.pubcClCd = "01";
        postData.rcpnWaitCvaKndCd = "A2001,A2002,A2004,C2001";
        postData.rprsTin = "";
        postData.tin = "";
        postData.txaaTin = "";
        postData.txprNo = "";
        postData.pageInfoVO = {};
        postData.pageInfoVO.pageNum = "1";
        postData.pageInfoVO.totalCount = "";
        postData.pageInfoVO.pageSize = "10";

        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_14: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            resObj = JSON.parse(ResultStr);
            var cvaTrtRsltLnkDVOList = resObj.cvaTrtRsltLnkDVOList[0]; // 최상단 신청내역 결과처리

            var 민원접수번호 = cvaTrtRsltLnkDVOList.rcatNo;
            var 민원사무명 = cvaTrtRsltLnkDVOList.cvaKndNm;
            var 접수일시 = cvaTrtRsltLnkDVOList.rcatDtm;
            var 처리상태 = cvaTrtRsltLnkDVOList.cvaTrtStatCdNm;

            var cvaId = cvaTrtRsltLnkDVOList.cvaId;
            var ecabId = cvaTrtRsltLnkDVOList.ecabId;
        } catch (e) {
            this.log("exception: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 7);
            return E_IBX_SITE_INVALID + 7;
        }

        if (!민원접수번호) {
            this.setError(E_IBX_SITE_INVALID_MASK);
            return E_IBX_SITE_INVALID_MASK;
        }
        if (처리상태 != '접수완료') {
            this.setError(E_IBX_P14101_REG_MISC);
            return E_IBX_P14101_REG_MISC;
        }

        this.url = '/permission.do?screenId=UTECAABA02';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_6: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/wqAction.do?actionId=ATECAABA002R02&screenId=UTECAABA02&popupYn=true&realScreenId=';
        postData = {};
        postData.cvaId = cvaId;
        postData.lnkClCd = "";

        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_15: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            resObj = JSON.parse(ResultStr);
            var cvaAplnRsltDetailLnkDVO = resObj.cvaAplnRsltDetailLnkDVO;

            var 처리기한 = cvaAplnRsltDetailLnkDVO.cvaTrtDdt;
            var 민원인주민_사업자번호 = cvaAplnRsltDetailLnkDVO.txprNo;
            var 민원인성명_상호 = cvaAplnRsltDetailLnkDVO.txprNm;
            var 신청인주인_사업자번호 = cvaAplnRsltDetailLnkDVO.aplcTxprNo;
            var 신청인성명_상호 = cvaAplnRsltDetailLnkDVO.aplcTxprNm;
            var 신청인관계 = cvaAplnRsltDetailLnkDVO.cvaAgnRltNm;
        } catch (e) {
            this.log("exception: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 8);
            return E_IBX_SITE_INVALID + 8;
        }

        this.url = '/permission.do?screenId=UTECMGAA12';
        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, '{}') == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("session_7: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        this.url = '/wqAction.do?actionId=ATTCMGAA001R03&screenId=UTECMGAA12&popupYn=false&realScreenId=';
        postData = {};
        postData.schEcabId = ecabId;

        this.postData = JSON.stringify(postData);

        if (httpRequest.postWithUserAgent(this.userAgent, this.pdfHost1 + this.url, this.postData) == false) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("최종제출_16: [" + ResultStr + "]");

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0 ||
            ResultStr.indexOf('"msg":-9403') >= 0 ||
            ResultStr.indexOf('"errorCd":-9403') >= 0 ||
            ResultStr.indexOf('세션정보가 존재하지 않습니다') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0 ||
            ResultStr.indexOf('"msg":-9404') >= 0 ||
            ResultStr.indexOf('"errorCd":-9404') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }
        if (ResultStr.indexOf('"result":"F"') >= 0) {
            this.setError(E_IBX_UNKNOWN);
            this.iSASInOut.Output.ErrorMessage = "" + StrGrab(ResultStr, '"msg"', '"');
            return E_IBX_UNKNOWN;
        }

        try {
            resObj = JSON.parse(ResultStr);
            var ecabFleDetailDVOList = resObj.ecabFleDetailDVOList[0]; // 최상단 신청내역 결과처리

            var PDFfleNm = ecabFleDetailDVOList.fleNm;
        } catch (e) {
            this.log("exception: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 9);
            return E_IBX_SITE_INVALID + 9;
        }

        var 민원신청결과상세조회 = [];

        var item = {};
        item.민원접수번호 = 민원접수번호;
        item.민원사무명 = 민원사무명;
        item.접수일시 = 접수일시;
        item.처리기한 = 처리기한;
        item.처리상태 = 처리상태;
        item.민원인주민_사업자번호 = 민원인주민_사업자번호;
        item.민원인성명_상호 = 민원인성명_상호;
        item.신청인주인_사업자번호 = 신청인주인_사업자번호;
        item.신청인성명_상호 = 신청인성명_상호;
        item.신청인관계 = 신청인관계;
        item.첨부문서 = [];
        var subItem = {};
        subItem.파일명 = PDFfleNm;
        item.첨부문서.push(subItem);

        민원신청결과상세조회.push(item);
        
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.민원신청결과상세조회 = 민원신청결과상세조회;

        // 제출 성공시 변수 초기화
        this.storageData = {};
        this.cvaId = '';
        this.파일제출Count = 0; 
        this.파일제출tin = '';
        this.subDir = '';
        this.mergeFileList = '';
        this.sxsdPath = '';
        this.sxsdSize = '';
        this.imagePath = '';
        this.SavedList = [];
        this.마지막제출호출여부 = false;
        this.최종제출storage = {};

        this.chkStep3 = '';

        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 사업자등록신청_최종제출 finally");
    }
}

PC조회발급서비스.prototype.제출서류조회 = function (aInput) {
    this.log("PC조회발급서비스 제출서류조회 호출 [" + moduleVersion + "]");
    try {
        system.setStatus(IBXSTATE_ENTER, 30);

        if (this.bLogIn != true) {
            this.log("로그인 후 실행해주세요.");
            this.setError(E_IBX_AFTER_LOGIN_SERVICE);
            return E_IBX_AFTER_LOGIN_SERVICE;
        }

        // ===선행단계 (입력조회 ..) 없이 호출 가능==
        var input = dec(aInput.Input);
        var 업종정보 = input.업종정보;

        if (!업종정보) {
            this.setError(E_IBX_TRANS_TYPE_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_NOTENTER;
        }
        if (whatIsIt(업종정보) != 'Array') {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }
        if (업종정보.length == 0) {
            this.setError(E_IBX_TRANS_TYPE_NOTENTER);
            this.iSASInOut.Output.ErrorMessage = "업종정보 미입력입니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_TRANS_TYPE_NOTENTER;
        }

        var content_type = '{"Content-Type":"application/json; charset=UTF-8","Accept":"application/json; charset=UTF-8"}';

        var 주업종, 주업종코드;
        var 부업종 = [];
        var 부업종코드 = [];
        var 제출서류조회 = [];

        var querryData = {};    // 업종등록
        querryData.bsafPtusCmnClsfCd = "14479";
        querryData.vldtStrtDt = '00010101';
        querryData.bmanTfbDVOList = [];

        var is주업종 = false;
        var bmanTfbDVOList = [];
        system.setStatus(IBXSTATE_EXECUTE, 60);

        for (var idx = 0; idx < 업종정보.length; idx++) {

            var IndusInfo = 업종정보[idx];

            if (!IndusInfo.구분) {
                this.setError(E_IBX_PARAMETER_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 구분 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_NOTENTER;
            }
            if (['주', '부'].indexOf(IndusInfo.구분) < 0) {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (!IndusInfo.코드) {
                this.setError(E_IBX_BUSINESS_CODE_NOTENTER);
                this.iSASInOut.Output.ErrorMessage = "업종정보 코드 미입력입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_BUSINESS_CODE_NOTENTER;
            }
            if (IndusInfo.코드.length != 6) {
                this.setError(E_IBX_BUSINESS_CODE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 코드(" + IndusInfo.코드 + ")입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_BUSINESS_CODE_INVALID;
            }

            // 주업종은 하나만 등록가능
            if (is주업종 && IndusInfo.구분 == '주') {
                this.setError(E_IBX_PARAMETER_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 구분입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_PARAMETER_INVALID;
            }
            if (IndusInfo.구분 == '주') is주업종 = true;

            // 당해년도
            var attrYr = js_yyyy_mm_dd().substr(0, 4);
            var attrYr = "2024";

            // 업종코드 검색1
            system.setStatus(IBXSTATE_EXECUTE, 65);
            this.url = "/wqAction.do?actionId=ATTRNZZZ001R01&screenId=UTERNAAZ78&popupYn=false&realScreenId=";
            var postData = {};
            postData.attrYr = attrYr;
            postData.tfbCd = IndusInfo.코드;
            postData.tfbNm = '';
            postData.selectMode = "L2";
            postData.pageInfoVO = {};
            postData.pageInfoVO.pageNum = "1";
            postData.pageInfoVO.pageSize = "10";

            this.postData = JSON.stringify(postData);
            if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log('업종코드 검색1 (' + IndusInfo.코드 + ') : ' + ResultStr);
                if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }

            // 업종코드 한 건만 오입력해도 전체 오류처리
            if (ResultStr.indexOf('조회된 데이터가 없습니다') >= 0){
                this.setError(E_IBX_BUSINESS_CODE_INVALID);
                this.iSASInOut.Output.ErrorMessage = "잘못된 업종정보 코드(" + IndusInfo.코드 + ")입니다. 확인 후 거래하시기 바랍니다.";
                return E_IBX_BUSINESS_CODE_INVALID;
            }

            if (ResultStr.indexOf('조회가 완료되었습니다') < 0){
                this.setError(E_IBX_UNKNOWN);
                return E_IBX_UNKNOWN;
            }
    
            var baseXpsrDVOList;
            try {
                baseXpsrDVOList = JSON.parse(ResultStr).baseXpsrDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID);
                return E_IBX_SITE_INVALID;
            }

            // 업종코드 검색2
            system.setStatus(IBXSTATE_EXECUTE, 70);
            this.url = '/wqAction.do?actionId=ATTRNZZZ001R17&screenId=UTEABAAP09&popupYn=true&realScreenId=';
            postData = {};
            postData.attrYr = attrYr;
            postData.tfbCd = baseXpsrDVOList[0].tfbCd;
            postData.bcNm = baseXpsrDVOList[0].bcNm;
            postData.tfbDclsNm = baseXpsrDVOList[0].tfbDclsNm;
            postData.buttonId = baseXpsrDVOList[0].buttonId;
            
            this.postData = JSON.stringify(postData);
            if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
                this.setError(E_IBX_FAILTOGETPAGE);
                return E_IBX_FAILTOGETPAGE;
            }
            var ResultStr = httpRequest.result;
            this.log('업종코드 검색2 (' + IndusInfo.코드 + ') : ' + ResultStr);

            if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SESSION_CLOSED);
                return E_IBX_SESSION_CLOSED;
            }
            if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
                ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
                this.bLogIn = false;
                this.setError(E_IBX_SERVICE_LOGOUT);
                return E_IBX_SERVICE_LOGOUT;
            }
            if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
                ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
                ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
                this.setError(E_IBX_SITE_INTERNAL);
                return E_IBX_SITE_INTERNAL;
            }

            var krStndIndsClCdDVO, krStndIndsClCdDVOList;
            try {
                krStndIndsClCdDVO = JSON.parse(ResultStr).krStndIndsClCdDVO;
                krStndIndsClCdDVOList = JSON.parse(ResultStr).krStndIndsClCdDVOList;
            } catch (e) {
                this.log("exception :: " + e.message);
                this.setError(E_IBX_SITE_INVALID + 1);
                return E_IBX_SITE_INVALID + 1;
            }

            if (!krStndIndsClCdDVO) {
                this.setError(E_IBX_SITE_INVALID + 2);
                return E_IBX_SITE_INVALID + 2;
            }

            item = {};
            item.blank = "";
            item.chk = "";
            item.mtfbYn = (IndusInfo.구분 == '주' ? 'Y' : 'N');
            item.tfbCd = krStndIndsClCdDVO.tfbCd;
            item.bcNm = krStndIndsClCdDVO.krStndIndsClsfNm;
            item.itmNm = krStndIndsClCdDVO.krStndIndsLcsNm;
            item.krStndIndsClsfNm = '(' + krStndIndsClCdDVO.krStndIndsClsfCd + ') ' + krStndIndsClCdDVO.krStndIndsClsfNm;
            item.modifyBtnTfb = "수정";
            item.krStndIndsClsfCd = krStndIndsClCdDVO.krStndIndsClsfCd;
            item.applcBaseDcnt = baseXpsrDVOList[0].applcBaseDcnt;
            item.csmrOpstTfbYn = "";
            item.cshptDutyPblTfbYn = "";
            item.statusValue = "C";
           
            querryData.bmanTfbDVOList.push(item);
        }

        // 주업종 하나이상 필수 입력
        if (!is주업종) {
            this.setError(E_IBX_PARAMETER_INVALID);
            this.iSASInOut.Output.ErrorMessage = "주업종은 필수로 선택해야합니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_PARAMETER_INVALID;
        }

        // 업종등록 최종
        system.setStatus(IBXSTATE_EXECUTE, 75);
        this.url = '/wqAction.do?actionId=ATTABZAA001R15&screenId=UTEABAAP09&popupYn=true&realScreenId=';
        this.postData = JSON.stringify(querryData);
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('업종등록 최종 : ' + ResultStr);

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var bmanTfbDVOList;
        try {
            bmanTfbDVOList = JSON.parse(ResultStr).bmanTfbDVOList;
        } catch (e) {
            this.log("exception :: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 3);
            return E_IBX_SITE_INVALID + 3;
        }
        if (!bmanTfbDVOList) {
            this.setError(E_IBX_SITE_INVALID + 4);
            return E_IBX_SITE_INVALID + 4;
        }

        for (var i=0; i<bmanTfbDVOList.length; i++) {
            var bmanTfbDVO = bmanTfbDVOList[i];
            // 주업종 여부
            if (bmanTfbDVO.mtfbYn == 'Y') {
                주업종 = bmanTfbDVO.bcNm;
                주업종코드 = bmanTfbDVO.tfbCd;
            } else {
                부업종.push(bmanTfbDVO.bcNm);
                부업종코드.push(bmanTfbDVO.tfbCd);
            }
        }

        // 세션유지
        system.setStatus(IBXSTATE_EXECUTE, 80);
        this.url = '/permission.do?screenId=UTEABAAP10';
        this.postData = {};
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('세션유지 : ' + ResultStr);

        if (ResultStr.indexOf('"msg":"-9403"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9403"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;
        }
        if (ResultStr.indexOf('"msg":"-9404"') >= 0 ||
            ResultStr.indexOf('"errorCd":"-9404"') >= 0) {
            this.bLogIn = false;
            this.setError(E_IBX_SERVICE_LOGOUT);
            return E_IBX_SERVICE_LOGOUT;
        }
        if (ResultStr.indexOf('307 Temporary Redirect') >= 0 ||
            ResultStr.indexOf('서비스 실행 중 오류가 발생하였습니다.') > -1 ||
            ResultStr.indexOf('데이터 처리 중 오류가 발생했습니다.') >= 0) {
            this.setError(E_IBX_SITE_INTERNAL);
            return E_IBX_SITE_INTERNAL;
        }

        var querryData = {};    // 제출서류 확인
        querryData.bmanRgtClCd = "01";
        querryData.cvaId = '';
        querryData.cvaKndCd = 'A2004';
        querryData.removeWaitCvaYn = '';
        querryData.tin = StrGrab(ResultStr, '"tin":"', '"');
        querryData.isSt1Amd = false;
        querryData.ttiabcd005DVOList = [];

        for (var i = 0; i < bmanTfbDVOList.length; i++) {
            var item = {};
            item.blank = "";
            item.chk = "";
            item.mtfbYn = bmanTfbDVOList[i].mtfbYn;
            item.tfbCd = bmanTfbDVOList[i].tfbCd;
            item.bcNm = bmanTfbDVOList[i].bcNm;
            item.itmNm = bmanTfbDVOList[i].itmNm;
            item.csmrOpstTfbYn = "";
            item.cshptDutyPblTfbYn = "";
            item.krStndIndsClsfNm = '(' + bmanTfbDVOList[i].krStndIndsClsfCd + ') ' + bmanTfbDVOList[i].itmNm;
            item.cnfr = "";
            item.tfbCdBtnModify = "";
            item.krStndIndsClsfCd = bmanTfbDVOList[i].krStndIndsClsfCd;
            item.applcBaseDcnt = "";
            item.statusValue = "R";

            querryData.ttiabcd005DVOList.push(item);
        }

        // 제출서류 확인
        system.setStatus(IBXSTATE_EXECUTE, 85);
        this.url = '/wqAction.do?actionId=ATEABAAA008R07&screenId=UTEABAAA59&popupYn=false&realScreenId=';
        
        this.postData = JSON.stringify(querryData);
        if (!httpRequest.postWithUserAgent(content_type, this.pdfHost1 + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log('제출서류 확인 : ' + ResultStr);

        var aprlBsAdmDVOList;
        try {
            aprlBsAdmDVOList = JSON.parse(ResultStr).aprlBsAdmDVOList;
        } catch (e) {
            this.log("exception :: " + e.message);
            this.setError(E_IBX_SITE_INVALID + 5);
            return E_IBX_SITE_INVALID + 5;
        }
        if (!aprlBsAdmDVOList) {
            this.setError(E_IBX_SITE_INVALID + 6);
            return E_IBX_SITE_INVALID + 6;
        }
        if (aprlBsAdmDVOList.length == 0) {
            this.setError(E_IBX_BUSINESS_CODE_MISC);
            this.iSASInOut.Output.ErrorMessage = "해당 업종은 인·허가 사업의 업종이 아닙니다. 확인 후 거래하시기 바랍니다.";
            return E_IBX_BUSINESS_CODE_MISC;
        }

        system.setStatus(IBXSTATE_RESULT, 90);
        for (var i=0; i<aprlBsAdmDVOList.length; i++) {
            var aprlBsAdmDVO = aprlBsAdmDVOList[i];
            
            var item = {};
            item.업종코드 = aprlBsAdmDVO.aprlTfbCd;
            item.적용업종명 = aprlBsAdmDVO.aprlApplcTfbNm;
            item.구분 = aprlBsAdmDVO.aprlClNm;
            item.근거법령 = aprlBsAdmDVO.aprlBssStttNm;
            item.제출서류 = aprlBsAdmDVO.aprlSbmsDcumNm;
            item.접수기관 = aprlBsAdmDVO.aprlRcpnOrgnNm;
            item.민원사무명 = aprlBsAdmDVO.aprlCvaOwNm;
            item.비고 = aprlBsAdmDVO.aprlRmrkCntn;

            if (!item.업종코드 || !item.적용업종명 || !item.구분 || !item.근거법령 ||
                !item.제출서류 || !item.접수기관 || !item.민원사무명) {
                this.log('80002F10 : ' + JSON.stringify(item));
                this.setError(E_IBX_RESULT_FAIL);
                return E_IBX_RESULT_FAIL;
            }
            제출서류조회.push(item);
        }

        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
        this.iSASInOut.Output.Result.주업종 = 주업종;
        this.iSASInOut.Output.Result.주업종코드 = 주업종코드;
        this.iSASInOut.Output.Result.부업종 = 부업종;
        this.iSASInOut.Output.Result.부업종코드 = 부업종코드;
        this.iSASInOut.Output.Result.제출서류조회 = 제출서류조회;
        return S_IBX_OK;

    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log("PC조회발급서비스 제출서류조회 finally");
    }
}

function sfCm_getAddrText(obj) {
    var ymdgNm = "";
    var sidoNm = "";
    var sggNm = "";
    var ymdgClCd = "";
    var roadYmdgNm = "";
    var roadSidoNm = "";
    var roadSggNm = "";
    var roadNm = "";
    var rdstNm = "";
    var spcaCd = "";
    var bldHoAdr = "";
    var bunjAdr = "0";
    var undrBldClCd = "";
    var bldPmnoAdr = "0";
    var bldSnoAdr = "0";
    var bldBlckAdr = "";
    var hoAdr = "0";
    var bldFlorAdr = "";
    var bldDnadr = "";
    if (obj.ymdgNm != "" && obj.ymdgNm != undefined && obj.ymdgNm != "undefined") {
        ymdgNm = obj.ymdgNm;
    }
    if (obj.sidoNm != "" && obj.sidoNm != undefined && obj.sidoNm != "undefined") {
        sidoNm = obj.sidoNm;
        roadSidoNm = obj.sidoNm;
    }
    if (obj.sggNm != "" && obj.sggNm != undefined && obj.sggNm != "undefined") {
        sggNm = obj.sggNm;
        roadSggNm = obj.sggNm;
    }
    if (obj.ymdgClCd != "" && obj.ymdgClCd != undefined && obj.ymdgClCd != "undefined") {
        ymdgClCd = obj.ymdgClCd;
    }
    if (obj.ymdgNm != "" && obj.ymdgNm != undefined && obj.ymdgNm != "undefined") {
        roadYmdgNm = obj.ymdgNm;
    }
    if (obj.roadNm != "" && obj.roadNm != undefined && obj.roadNm != "undefined") {
        roadNm = obj.roadNm;
    }
    if (obj.rdstNm != "" && obj.rdstNm != undefined && obj.rdstNm != "undefined") {
        rdstNm = obj.rdstNm;
    }
    if (obj.spcaCd != "" && obj.spcaCd != undefined && obj.spcaCd != "undefined") {
        spcaCd = obj.spcaCd;
    }
    if (obj.bldHo != "" && obj.bldHo != undefined && obj.bldHo != "undefined") {
        bldHoAdr = obj.bldHo;
    }
    if (obj.bunjAdr != "" && obj.bunjAdr != undefined && obj.bunjAdr != "undefined") {
        bunjAdr = obj.bunjAdr;
    }
    if (obj.undrBldClCd != "" && obj.undrBldClCd != undefined && obj.undrBldClCd != "undefined") {
        undrBldClCd = obj.undrBldClCd;
    }
    if (obj.bldPmnoAdr != "" && obj.bldPmnoAdr != undefined && obj.bldPmnoAdr != "undefined") {
        bldPmnoAdr = obj.bldPmnoAdr;
    }
    if (obj.bldSnoAdr != "" && obj.bldSnoAdr != undefined && obj.bldSnoAdr != "undefined") {
        bldSnoAdr = obj.bldSnoAdr;
    }
    if (obj.bldNm != "" && obj.bldNm != undefined && obj.bldNm != "undefined") {
        bldBlckAdr = obj.bldNm;
        bldBlckAdr = bldBlckAdr.replace(/"/gi, '');
        bldBlckAdr = bldBlckAdr.replace(/'/gi, '');
        obj.bldNm = bldBlckAdr;
    }
    if (obj.hoAdr != "" && obj.hoAdr != undefined && obj.hoAdr != "undefined") {
        hoAdr = obj.hoAdr;
    }
    if (obj.bldFlor != "" && obj.bldFlor != undefined && obj.bldFlor != "undefined") {
        bldFlorAdr = obj.bldFlor;
    }
    if (obj.bldDn != "" && obj.bldDn != undefined && obj.bldDn != "undefined") {
        bldDnadr = obj.bldDn;
    }

    //String etcDadr = txprAbftAdrInqrDVO.getEtcDadr();

    //리턴값
    var roadBscBscAdr = "";
    var roadBscBldAdr = "";
    var roadBscAdr = "";
    var roadDadr = "";
    var roadAdr = "";
    var ldAdr = "";
    var ldBscBscAdr = "";
    var ldBscBscBscAdr = "";
    var ldBscAdr = "";
    var ldDadr = "";
    var rpnAdr = "";

    //도로명 주소 기본
    //도로명주소표기법 : 시도 + 시군구 + 읍면 + 도로명 + 건물번호 + 상세주소(동/층/호) + 참고항목(법정동, 공동주택명)
    if (roadNm != "") {
        roadBscAdr += roadSidoNm;
        roadBscAdr += " ";
        roadBscAdr += roadSggNm;
        if (roadYmdgNm != "" && ymdgClCd == "01") {
            //읍면 구분
            roadBscAdr += " ";
            roadBscAdr += roadYmdgNm;
        }
        roadBscAdr += " ";
        roadBscAdr += roadNm;
        roadBscBscAdr = roadBscAdr;
        if (undrBldClCd != "") {
            if (undrBldClCd == "1") {
                roadBscAdr += " 지하";
                roadBscBldAdr += "지하";
            } else if (undrBldClCd == "2") {
                roadBscAdr += " 공중";
                roadBscBldAdr += "공중";
            }
        }
        if (bldPmnoAdr != "" && bldPmnoAdr != "0") {
            roadBscAdr += " ";
            roadBscAdr += bldPmnoAdr;
            roadBscBldAdr += " ";
            roadBscBldAdr += bldPmnoAdr;
        }
        if (bldSnoAdr != "" && bldSnoAdr != "0") {
            roadBscAdr += "-";
            roadBscAdr += bldSnoAdr;
            roadBscBldAdr += "-";
            roadBscBldAdr += bldPmnoAdr;
        }

        //도로명 상세주소
        if (bldDnadr != "" && bldDnadr != "0") {
            roadDadr += " ";
            roadDadr += bldDnadr;
            roadDadr += "동";
        }
        if (bldFlorAdr != "" && bldFlorAdr != "0") {
            roadDadr += " ";
            roadDadr += bldFlorAdr;
            roadDadr += "층";
        }
        if (bldHoAdr != "" && bldHoAdr != "0") {
            roadDadr += " ";
            roadDadr += bldHoAdr;
            roadDadr += "호";
        }
        //if(!NtsStringUtil.isNullEmpty(etcDadr)){
        //	roadDadr += (" ");
        //	roadDadr += (etcDadr);
        //}

        //참조사항
        var temp = "";
        if (roadYmdgNm != "" && ymdgClCd == "02" || roadYmdgNm != "" && roadYmdgNm.substring(roadYmdgNm.length - 1, roadYmdgNm.length) == "동") {
            temp += "(";
            temp += roadYmdgNm;
            if (bldBlckAdr != "") {
                temp += ", ";
                temp += bldBlckAdr;
            }
            temp += ")";
        } else if (bldBlckAdr != "") {
            temp += "(";
            temp += bldBlckAdr;
            temp += ")";
        }

        //도로명 풀주소
        roadAdr += roadBscAdr;
        if (roadDadr != "") {
            roadAdr += ", ";
            roadAdr += roadDadr;
        }
        roadDadr += temp;
        roadAdr += temp;
        rpnAdr = roadAdr;
    }
    if (sidoNm != "") {
        //법정동 주소 기본
        ldBscAdr += sidoNm;
        ldBscAdr += " ";
        ldBscAdr += sggNm;
        ldBscAdr += " ";
        ldBscAdr += ymdgNm;
        ldBscBscAdr = ldBscAdr;
        if (rdstNm != "") {
            ldBscAdr += " ";
            ldBscAdr += rdstNm;
            ldBscBscBscAdr += " ";
            ldBscBscBscAdr += rdstNm;
        }
        if (spcaCd != "" && spcaCd == "1") {
            ldBscAdr += " 산";
            ldBscBscBscAdr += " 산";
        }
        if (bunjAdr != "" && bunjAdr != "0") {
            ldBscAdr += " ";
            ldBscAdr += bunjAdr;
            ldBscBscBscAdr += " ";
            ldBscBscBscAdr += bunjAdr;
            if (hoAdr != "" && hoAdr != "0") {
                ldBscAdr += "-";
                ldBscAdr += hoAdr;
                ldBscBscBscAdr += "-";
                ldBscBscBscAdr += hoAdr;
            }
        } else {
            if (hoAdr != "" && hoAdr != "0") {
                ldBscAdr += " ";
                ldBscAdr += hoAdr;
                ldBscBscBscAdr += " ";
                ldBscBscBscAdr += hoAdr;
            }
        }

        //법정동상세주소
        if (bldBlckAdr != "") {
            ldDadr += bldBlckAdr;
        }
        if (bldDnadr != "" && bldDnadr != "0") {
            ldDadr += " ";
            ldDadr += bldDnadr;
            ldDadr += "동";
        }
        if (bldFlorAdr != "" && bldFlorAdr != "0") {
            ldDadr += " ";
            ldDadr += bldFlorAdr;
            ldDadr += "층";
        }
        if (bldHoAdr != "" && bldHoAdr != "0") {
            ldDadr += " ";
            ldDadr += bldHoAdr;
            ldDadr += "호 ";
        }
        //if(etcDadr != ""){
        //	ldDadr += " ";
        //	ldDadr += etcDadr;
        //}

        //법정동 풀주소
        ldAdr += ldBscAdr;
        if (ldDadr != "") {
            ldAdr += " ";
            ldAdr += ldDadr;
        }
        if (rpnAdr != "") {
            rpnAdr = ldAdr;
        }
    }

    var addText = JSON.parse('{"ldBscBscAdr" : "' + ldBscBscAdr + '","ldBscBscBscAdr" : "' + ldBscBscBscAdr + '","roadBscBscAdr" : "' + roadBscBscAdr + '","roadBscBldAdr" : "' + roadBscBldAdr + '","roadDadr" : "' + roadDadr + '","roadAdr" : "' + roadAdr + '","roadBscAdr" : "' + roadBscAdr + '","ldAdr" : "' + ldAdr + '","ldBscAdr" : "' + ldBscAdr + '","ldDadr" : "' + ldDadr + '","rpnAdr" : "' + rpnAdr + '"}');

    return addText;
};

// json value를 숫자 -> 문자로
function convertNumbersToStrings(data) {
    if (data === null) { // null 값을 빈 문자열로 변환
        return '';
    }
    if (typeof data == 'number') {
        return String(data); 
    }
    if (Array.isArray(data)) {
        return data.map(convertNumbersToStrings); 
    }
    if (typeof data == 'object' && data != null) {
        var result = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result[key] = convertNumbersToStrings(data[key]);
            }
        }
        return result;
    }
    return data; 
}

var RaonKBase64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _trans_unitDelimiter: "\x0B",
    _trans_unitAttributeDelimiter: "\f",
    encode: function (a) {
        var b = "",
            c, d, e, g, h, f, k = 0;
        for (a = RaonKBase64._utf8_encode(a); k < a.length;) c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), g = c >> 2, c = (c & 3) << 4 | d >> 4, h = (d & 15) << 2 | e >> 6, f = e & 63, isNaN(d) ? h = f = 64 : isNaN(e) && (f = 64), b = b + this._keyStr.charAt(g) + this._keyStr.charAt(c) + this._keyStr.charAt(h) + this._keyStr.charAt(f);
        return b
    },
    decode: function (a) {
        var b =
            "",
            c, d, e, g, h, f = 0;
        for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); f < a.length;) c = this._keyStr.indexOf(a.charAt(f++)), d = this._keyStr.indexOf(a.charAt(f++)), g = this._keyStr.indexOf(a.charAt(f++)), h = this._keyStr.indexOf(a.charAt(f++)), c = c << 2 | d >> 4, d = (d & 15) << 4 | g >> 2, e = (g & 3) << 6 | h, b += String.fromCharCode(c), 64 != g && (b += String.fromCharCode(d)), 64 != h && (b += String.fromCharCode(e));
        return b = RaonKBase64._utf8_decode(b)
    },
    _utf8_encode: function (a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : (127 < d && 2048 > d ? b += String.fromCharCode(d >> 6 | 192) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128)), b += String.fromCharCode(d & 63 | 128))
        }
        return b
    },
    _utf8_decode: function (a) {
        for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length;) d = a.charCodeAt(c), 128 > d ? (b += String.fromCharCode(d), c++) : 191 < d && 224 > d ? (c2 = a.charCodeAt(c + 1), b += String.fromCharCode((d & 31) << 6 | c2 & 63), c += 2) : (c2 = a.charCodeAt(c + 1), c3 = a.charCodeAt(c + 2), b += String.fromCharCode((d & 15) << 12 | (c2 & 63) << 6 | c3 & 63), c += 3);
        return b
    },
    makeGuidTagName: function(c) {
        var d = 0, a = (new Date).getTime().toString(32), e;
        for (e = 0; 5 > e; e++)
            a += Math.floor(65535 * Math.random()).toString(32);
        return (c || "o_") + a + (d++).toString(32)
    },
    makeGuid: function(a) {
        var d = function() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        }
          , d = (d() + d() + d() + d() + d() + d() + d() + d()).toLowerCase();
        void 0 != a && (d = a + "-" + d);
        return d
    },
    makeEncryptParam: function (a) {
        a = RaonKBase64.encode(a);
        a = RaonKBase64.insertAt(a, 8, "r");
        a = RaonKBase64.insertAt(a, 6, "a");
        a = RaonKBase64.insertAt(a, 9, "o");
        a = RaonKBase64.insertAt(a, 7, "n");
        a = RaonKBase64.insertAt(a, 8, "w");
        a = RaonKBase64.insertAt(a, 6, "i");
        a = RaonKBase64.insertAt(a, 9, "z");
        return a = a.replace(/[+]/g, "%2B")
    },
    makeDecryptReponseMessage: function (a) {
        var b = function (a, b) {
            var e = a.split("");
            e.splice(b, 1);
            return e = e.join("")
        };
        a = b(a, 9);
        a = b(a, 6);
        a = b(a, 8);
        a = b(a, 7);
        a = b(a, 9);
        a = b(a, 6);
        a = b(a, 8);
        return a = RaonKBase64.decode(a)
    },
    insertAt: function (a, b, c) {
        return String.prototype.insertAt ? a.insertAt(b, c) : a.substr(0, b) + c + a.substr(b)
    },
    parseDataFromServer: function(a) {
        if (a) {
            var d = a.toLowerCase().indexOf("<raonk>");
            -1 < d && (a = a.substring(d + 7));
            d = a.toLowerCase().indexOf("</raonk>");
            -1 < d && (a = a.substring(0, d))
        }
        return a
    }
};

iSASObject.prototype.Base64Decode = function(input) {
    function t_utf8_decode (utfText) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;

        while (i < utfText.length) {
            c = utfText.charCodeAt(i);

            if (c < 128) {
            string += String.fromCharCode(c);
            i++;
            } else if ((c > 191) && (c < 224)) {
            c2 = utfText.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
            } else {
            c2 = utfText.charCodeAt(i + 1);
            c3 = utfText.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
            }
        }
        return string;
    }

    var output = '';
    if (logManager.pltfName.indexOf("ANDROID") > -1) {
        output = certManager.Base64Decode(input);
    } else {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
    
        input = (input + "").replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
        while (i < input.length) {
    
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
    
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
    
            output = output + String.fromCharCode(chr1);
    
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
    
        output = t_utf8_decode(output);
    
    }
    return output;
};


function nts_fmtTaxpayerNo(value) {
    value = "" + value; // 문자열로 변환

    if (/^\d{10}$/.test(value)) {
        // 사업자등록번호: 10자리 → 000-00-00000
        return value.substr(0, 3) + '-' + value.substr(3, 2) + '-' + value.substr(5, 5);
    }

    if (/^\d{13}$/.test(value)) {
        // 주민등록번호: 13자리 → 000000-*******
        return value.substr(0, 6) + '-*******';
    }

    if (/^\d{6}(\*{7})$/.test(value)) {
        // 마스킹된 주민등록번호: 000000-*******
        return value.substr(0, 6) + '-*******';
    }

    return value; // 매칭되지 않으면 원본 반환
}

function nts_defaultString(sValue, dValue) {
    if (!sValue) {
        return dValue;
    } else {
        return sValue;
    }
};

function nts_fmtTelNo(value) {
    if (value == null) {
        value = "";
    }
    value = value.replace(/\s/g, "");
    value = value.replace(/[^\d]/g, "");
    value = value.replace(/(^02|^\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    return value;
};

/**
 * 주소팝업에서 리턴되는 obj와 DB컬럼명(camelcase)에 맞게 변환시킨다.
 * @param Object obj	주소값을 가진 Object
 * @param String flag	'1'(팝업의 리턴 값 -> DB컬럼명), '2'(DB컬럼명 -> 팝업의 리턴 값)
 * @return
 */
function nts_teab_changeAddrObj(obj, flag) {
    var rtnObj = JSON.parse(JSON.stringify(obj)); //JSON.parse(JSON.stringify(obj));	//obj copy
    if (flag == '1') {
        rtnObj["roadBscAdr"] = typeof rtnObj["roadNmAdr"] == "string" ? rtnObj["roadNmAdr"] : "";
        rtnObj["ldBscAdr"] = typeof rtnObj["lnmAdr"] == "string" ? rtnObj["lnmAdr"] : "";
        rtnObj["bldDnadr"] = typeof rtnObj["bldDn"] == "string" ? rtnObj["bldDn"] : "";
        rtnObj["bldFlorAdr"] = typeof rtnObj["bldFlor"] == "string" ? rtnObj["bldFlor"] : "";
        rtnObj["bldHoAdr"] = typeof rtnObj["bldHo"] == "string" ? rtnObj["bldHo"] : "";
        rtnObj["bldBlckAdr"] = typeof rtnObj["bldNm"] == "string" ? rtnObj["bldNm"] : "";
        rtnObj["etcDadr"] = typeof rtnObj["etcAdr"] == "string" ? rtnObj["etcAdr"] : "";

        //object key 삭제
        delete rtnObj["roadNmAdr"];
        delete rtnObj["lnmAdr"];
        delete rtnObj["bldDn"];
        delete rtnObj["bldFlor"];
        delete rtnObj["bldHo"];
        delete rtnObj["bldNm"];
        delete rtnObj["etcAdr"];
    } else {
        rtnObj["roadNmAdr"] = typeof rtnObj["roadBscAdr"] == "string" ? rtnObj["roadBscAdr"] : "";
        rtnObj["lnmAdr"] = typeof rtnObj["ldBscAdr"] == "string" ? rtnObj["ldBscAdr"] : "";
        rtnObj["bldDn"] = typeof rtnObj["bldDnadr"] == "string" ? rtnObj["bldDnadr"] : "";
        rtnObj["bldFlor"] = typeof rtnObj["bldFlorAdr"] == "string" ? rtnObj["bldFlorAdr"] : "";
        rtnObj["bldHo"] = typeof rtnObj["bldHoAdr"] == "string" ? rtnObj["bldHoAdr"] : "";
        rtnObj["bldNm"] = typeof rtnObj["bldBlckAdr"] == "string" ? rtnObj["bldBlckAdr"] : "";
        rtnObj["etcAdr"] = typeof rtnObj["etcDadr"] == "string" ? rtnObj["etcDadr"] : "";

        //object key 삭제
        delete rtnObj["roadBscAdr"];
        delete rtnObj["ldBscAdr"];
        delete rtnObj["bldDnadr"];
        delete rtnObj["bldFlorAdr"];
        delete rtnObj["bldHoAdr"];
        delete rtnObj["bldBlckAdr"];
        delete rtnObj["etcDadr"];
    }
    if (nts_isNull(rtnObj["roadNmCd"])) {
        //도로명 코드 필수 값
        rtnObj["roadNmCd"] = "";
    }
    return rtnObj;
};

/************************************
* 자기자본,타인자본용 포멧출력함수
************************************/
function ZeroNotViewAmt(value) {
    if ("0" == value || "0" == value.substr(0, 1)) {
        return "";
    } else {
        value = value.substr(0, 15);
        var reg = /(\d+)(\d{3})/;
        value = value + "";
        while (reg.test(value)) {
            value = value.replace(reg, '$1' + ',' + '$2');
        }
        return value;
    }
};

/**
* @method 
* @name  ZeroNotView
* @description  Zero 값을 '' 반환하는 함수
* @param  {String} value
* @returns  {String} result
* @hidden  N/A  
* @example  N/A  
*/
function ZeroNotView(value) {
    if ("0" == value || "0" == value.substr(0, 1)) {
        return "";
    } else {
        value = value.substr(0, 20);
        var reg = /(\d+)(\d{3})/;
        value = value + "";
        while (reg.test(value)) {
            value = value.replace(reg, '$1' + ',' + '$2');
        }
        return value;
    }
};


/**
 * @method
 * @name nts_cvtDateFormat
 * @description 입력된 날짜 String을 지정된 format으로 리턴<br>
 * 입력값은 숫자만 추출되며, 년월일시간분초 순으로 인식된다.<br>
 * 추출된 숫자는 4자리(yyyy) or 6자리(yyyyMM) or 8자리(yyyyMMdd) <br>
 *               or 10자리(yyyyMMddhh) or 12자리(yyyyMMddhhmm) or 14자리(yyyyMMddhhmmss) 이어야 한다.
 * @param {String} format Format Value
 * @param {String} sValue 체크할 Value
 * @returns String 포멧팅 된 문자열
 * @hidden N
 * @exception 
 * @example 
 */
function nts_cvtDateFormat(format, sValue) {
    if (nts_isNull(sValue)) {
        return sValue;
    } else {
        var testValue = "" + sValue;
        testValue = testValue.replace(/\D/g, "");
        if ("4,6,8,10,12,14".indexOf(testValue.length) >= 0 || testValue.length > 14) {
            var year, month, day, hour, min, sec;
            try {
                year = testValue.substring(0, 4);
                month = testValue.substring(4, 6);
                day = testValue.substring(6, 8);
                hour = testValue.substring(8, 10);
                min = testValue.substring(10, 12);
                sec = testValue.substring(12, 14);
            } catch (e) {
                console.log(e.message);
            }
            testValue = format.replace("yyyy", year).replace("MM", month).replace("dd", day).replace("hh", hour).replace("mm", min).replace("ss", sec);
            return testValue;
        } else {
            return sValue;
        }
    }
};


/************************************
* 사업자등록신청(개인) 전자서고 값 구하기
************************************/
function fn_getBmanReg(storageData) {

    console.log("최종신청 function");
    var bsafScrnId = "UTECAAAZ06";	// 다른 case일 경우 아래 쿼리 다 확인 필요 
    var dwsResid = storageData.bmanRcatBscMttrSVO.resno.substring(0, 6) + "-" + "*******";

    //연락처 관련 설정 //### W5수정
    var telno = _nullToEnpty(storageData.bmanAplnCnoSVO.pfbTelno);
    var telnoa = _nullToEnpty(storageData.bmanAplnCnoSVO.hmTelno);
    var phone = _nullToEnpty(storageData.bmanAplnCnoSVO.mpno);
    var faxno = _nullToEnpty(storageData.bmanAplnCnoSVO.faxno);
    var email = _nullToEnpty(storageData.bmanAplnCnoSVO.emlAdr);

    //var txaaTelno = window.opener.WebSquare.ModelUtil.getInstanceValue("screen/map[@id='txaaInfr']/telno;
    // var txaaMpnoValue = _nullToEnpty(storageData.bmanAplnCnoSVO.txaaMpno);

    var dwsAddrDetailObj = nts_teab_changeAddrObj(storageData.txprAbftAdrInqr1DVO, "2");
    if (!nts_isNull(storageData.txprAbftAdrInqr1DVO.roadBscAdr)) {
        dwsAddrDetailObj.searchMode = "R";
    } else {
        dwsAddrDetailObj.searchMode = "L";
    }
    if (dwsAddrDetailObj.sggNm == undefined) {
        dwsAddrDetailObj.sggNm = "";
    }
    var dwsAddrDetail = nts_getAddrText(dwsAddrDetailObj);

    // 주업종 관련 설정
    var mtfbCdVal = "";
    var bcNmVal = "";
    var itmNmVal = "";
    //CH1659932252303 (홈택스) 홈택스 과면세전환 3종 신규신청화면 개발 UTEABAAA86 추가
    // if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62' || bsafScrnId == "UTEABAAA86") {
    //     //grid에서 값을 뽑아올 경우
    //     if (storageData.bmanTfbDetailDVOList.length > 0) {
    //         //### W5수정
    //         mtfbCdVal = storageData.bmanTfbDetailDVOList[0].tfbCd; //주업종코드
    //         bcNmVal = storageData.bmanTfbDetailDVOList[0].bcNm; //주업태
    //         itmNmVal = storageData.bmanTfbDetailDVOList[0].itmNm; //주종목
    //     }
    // } else {
        bcNmVal = storageData.bmanTfbDetailDVOList[0].bcNm; //주업태
        itmNmVal = storageData.bmanTfbDetailDVOList[0].itmNm; //주종목
        mtfbCdVal = storageData.bmanTfbDetailDVOList[0].tfbCd; //주업종코드
    // }

    //부업종 관련 설정
    var guup = "";
    var gujo = "";
    var guupCd = "";
    var guupArr = new Array();
    var guupNm = "DWS_GUUP";
    var gujoNm = "DWS_GUJO";
    var guupCdNm = "DWS_GUUP_CD";
    //CH1659932252303 (홈택스) 홈택스 과면세전환 3종 신규신청화면 개발 UTEABAAA86 추가
    // if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62' || bsafScrnId == "UTEABAAA86") {
    //     //grid에서 값을 뽑아올 경우
    //     var dlt_grdStfbListCnt = $c.util.nts_isNull($p, storageData.bmanTfbDetailDVOList) ? 0 : storageData.bmanTfbDetailDVOList.getRowCount();
    //     if (dlt_grdStfbListCnt > 1) {
    //         var grdStfbList = storageData.bmanTfbDetailDVOList;
    //         var addCount = 0;
    //         guup = storageData.bmanTfbDetailDVOList[1].bcNm;
    //         gujo = storageData.bmanTfbDetailDVOList[1].itmNm;
    //         guupCd = storageData.bmanTfbDetailDVOList[1].tfbCd;
    //         for (var i = 1; i < grdStfbList.getRowCount(); i++) {
    //             guupArr.push({
    //                 fieldName: "DWS_NEW_MIN_COND" + i,
    //                 fieldValue: storageData.bmanTfbDetailDVOList.getCellData(i, "bcNm")
    //             });
    //             guupArr.push({
    //                 fieldName: "DWS_NEW_MIN_ITEM" + i,
    //                 fieldValue: storageData.bmanTfbDetailDVOList.getCellData(i, "itmNm")
    //             });
    //             guupArr.push({
    //                 fieldName: "DWS_NEW_MIN_BUSNO" + i,
    //                 fieldValue: storageData.bmanTfbDetailDVOList.getCellData(i, "tfbCd")
    //             });
    //             addCount++;
    //             if (addCount == 12) {
    //                 /* 2019-03-13 10개 -> 12개로 변경 */
    //                 break;
    //             }
    //         }
    //     }
    // } else {
    //vo에서 값을 뽑아올 경우
    var grdStfbList = storageData.bmanTfbDetailDVOList;
    if (grdStfbList.length > 1) {
        guup = storageData.bmanTfbDetailDVOList[1].bcNm;
        gujo = storageData.bmanTfbDetailDVOList[1].itmNm;
        guupCd = storageData.bmanTfbDetailDVOList[1].tfbCd;
        var addCount = 0;
        for (var i = 1; i < storageData.bmanTfbDetailDVOList.length; i++) {
            var xmlDoc = grdStfbList[i];
            guupArr.push({
                fieldName: "DWS_NEW_MIN_COND" + i,
                fieldValue: storageData.bmanTfbDetailDVOList[i].bcNm
            });
            guupArr.push({
                fieldName: "DWS_NEW_MIN_ITEM" + i,
                fieldValue: storageData.bmanTfbDetailDVOList[i].itmNm
            });
            guupArr.push({
                fieldName: "DWS_NEW_MIN_BUSNO" + i,
                fieldValue: storageData.bmanTfbDetailDVOList[i].tfbCd
            });
            addCount++;
            if (addCount == 12) {
                /* 2019-03-13 10개 -> 12개로 변경 */
                break;
            }
        }
    }
    // }

    //사이버몰 관련 설정
    var cyberMallNm = "";
    var cyberMallDomain = "";

    //CH1659932252303 (홈택스) 홈택스 과면세전환 3종 신규신청화면 개발 UTEABAAA86 추가
    // if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62' || bsafScrnId == "UTEABAAA86") {
    //     //grid에서 값을 뽑아올 경우
    //     var dlt_grdCymlListCnt = $c.util.nts_isNull($p, $c.util.nts_getOpener($p).dlt_grdCymlList) ? "0" : $c.util.nts_getOpener($p).dlt_grdCymlList.getTotalRow();
    //     if (dlt_grdCymlListCnt != 0) {
    //         cyberMallNm = $c.util.nts_getOpener($p).dlt_grdCymlList[0].cymlNm;
    //         cyberMallDomain = $c.util.nts_getOpener($p).dlt_grdCymlList[0].cymlDmanNm;
    //     }
    // } else {
    // 매핑이 잘못 되어 있어서 변경 - 2015.11.13. 이율경
    if (storageData.ttiabcd007DVOList && storageData.ttiabcd007DVOList.length > 0) {
        cyberMallNm = storageData.ttiabcd007DVOList[0].cymlNm;
        cyberMallDomain = storageData.ttiabcd007DVOList[0].cymlDmanNm;
    }
    // }

    // 공동 사업자
    var fnmDws = "DWS_CO_OPER_NM"; // 성명
    var txprDscmNoDws = "DWS_CO_OPER_RES_NO"; // 주민등록번호
    var bmanEqtrtDws = "DWS_CO_OPER_OWNERSHIP"; // 지분율
    var txprRltCdNmDws = "DWS_CO_OPER_RELAT"; // 관계
    var invtYnDws = "DWS_CO_OPER_INVM_YN"; //출자공동사업자여부

    var jntBmanArr = new Array();
    // if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62') {
    //     //grid에서 값을 뽑아올 경우
    //     var dlt_grdJntBmanListCnt = $c.util.nts_isNull($p, $c.util.nts_getOpener($p).dlt_grdJntBmanList) ? "0" : $c.util.nts_getOpener($p).dlt_grdJntBmanList.getTotalRow();
    //     if (dlt_grdJntBmanListCnt != 0) {
    //         var jntBmanList = $c.util.nts_getOpener($p).dlt_grdJntBmanList;
    //         for (var i = 0; i < jntBmanList.getRowCount(); i++) {
    //             var fnmVal = jntBmanList[i, "fnm;
    //         var txprDscmNoVal = jntBmanList[i, "txprDscmNo;
    //         var bmanEqtrtVal = jntBmanList[i, "bmanEqtrt;
    //         var txprRltCdNmVal = jntBmanList[i, "txprRltCdNm;
    //         var invtYnVal = jntBmanList[i, "invtYn") == "Y" ? "여" : "부";
    //             bmanEqtrtVal = bmanEqtrtVal.toFixed(4);
    //             jntBmanArr.push({
    //                 fieldName: fnmDws + (i + 1),
    //                 fieldValue: fnmVal
    //             });
    //             jntBmanArr.push({
    //                 fieldName: txprDscmNoDws + (i + 1),
    //                 fieldValue: $c.util.nts_fmtTaxpayerNo($p, txprDscmNoVal)
    //             });
    //             jntBmanArr.push({
    //                 fieldName: bmanEqtrtDws + (i + 1),
    //                 fieldValue: bmanEqtrtVal
    //             });
    //             jntBmanArr.push({
    //                 fieldName: txprRltCdNmDws + (i + 1),
    //                 fieldValue: txprRltCdNmVal
    //             });
    //             jntBmanArr.push({
    //                 fieldName: invtYnDws + (i + 1),
    //                 fieldValue: invtYnVal
    //             });
    //         }
    //     }
    // } else {
    //vo에서 값을 뽑아올 경우
    var jntBmanList = storageData.jntBmanDVOList;
    var jntBmanListCnt = (jntBmanList ? jntBmanList.length : 0);

    if (jntBmanListCnt > 0) {
        return {
            "errorCode": E_IBX_SERVICE_INVALID
        };
    }

    for (var i = 0; i < jntBmanListCnt; i++) {
        var fnmVal = jntBmanList[i].fnm;
        var txprDscmNoVal = jntBmanList[i].txprDscmNo;
        var bmanEqtrtVal = jntBmanList[i].bmanEqtrt;
        var txprRltCdNmVal = jntBmanList[i].txprRltCdNm;
        var invtYnVal = (jntBmanList[i].invtYn == "Y" ? "여" : "부");
        bmanEqtrtVal = bmanEqtrtVal.toFixed(4);
        jntBmanArr.push({
            fieldName: fnmDws + (i + 1),
            fieldValue: fnmVal
        });
        jntBmanArr.push({
            fieldName: txprDscmNoDws + (i + 1),
            fieldValue: nts_fmtTaxpayerNo(txprDscmNoVal)
        });
        jntBmanArr.push({
            fieldName: bmanEqtrtDws + (i + 1),
            fieldValue: bmanEqtrtVal
        });
        jntBmanArr.push({
            fieldName: txprRltCdNmDws + (i + 1),
            fieldValue: txprRltCdNmVal
        });
        jntBmanArr.push({
            fieldName: invtYnDws + (i + 1),
            fieldValue: invtYnVal
        });
    }
    // }

    /* 2020-11-24 임대주택 명세서 */
    //CH1659932252303 (홈택스) 홈택스 과면세전환 3종 신규신청화면 개발 UTEABAAA86 추가
    // if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62' || bsafScrnId == "UTEABAAA86") {
    //     //grid에서 값을 뽑아올 경우
    //     var rnthArrNew = new Array();
    //     var rnthNewCnt = 1;
    //     var rnthSpcfList = $c.util.nts_getOpener($p).dlt_grdRnthSpcist;
    //     var rnthSpcfListCnt = $c.util.nts_isNull($p, rnthSpcfList) ? "0" : rnthSpcfList.getTotalRow();
    //     for (var i = 0; i < rnthSpcfListCnt; i++) {
    //         var rnthAdrVal = rnthSpcfList.getCellData(i, "rnthAdr;
    //     var rnthKndClNmVal = rnthSpcfList.getCellData(i, "rnthKndClNm;
    //     var hsngKndNmVal = rnthSpcfList.getCellData(i, "hsngKndNm;
    //     var rnthEuSflSctnNmVal = rnthSpcfList.getCellData(i, "rnthEuSflSctnNm;
    //     var mlitRmlBsnoCntnVal = rnthSpcfList.getCellData(i, "mlitRmlBsnoCntn;
    //     rnthArrNew.push({
    //             fieldName: "DWS_RNTH_GB_NM" + rnthNewCnt,
    //             fieldValue: "신규"
    //         });
    //         rnthArrNew.push({
    //             fieldName: "DWS_RNTH_ADR" + rnthNewCnt,
    //             fieldValue: rnthAdrVal
    //         });
    //         rnthArrNew.push({
    //             fieldName: "DWS_RNTH_KND_CL_NM" + rnthNewCnt,
    //             fieldValue: rnthKndClNmVal
    //         });
    //         rnthArrNew.push({
    //             fieldName: "DWS_HSNG_KND_NM" + rnthNewCnt,
    //             fieldValue: hsngKndNmVal
    //         });
    //         rnthArrNew.push({
    //             fieldName: "DWS_RNTH_EU_SFL_SCTN_NM" + rnthNewCnt,
    //             fieldValue: rnthEuSflSctnNmVal
    //         });
    //         rnthArrNew.push({
    //             fieldName: "DWS_MLIT_RML_BSNO_CNTN" + rnthNewCnt,
    //             fieldValue: mlitRmlBsnoCntnVal
    //         });
    //         rnthNewCnt++;
    //     }
    // }

    // 서류 송달 장소
    var dwsPlaceServedObj = "";
    if (storageData.txprAbftAdrInqr2DVO) {
        dwsPlaceServedObj = nts_teab_changeAddrObj(storageData.txprAbftAdrInqr2DVO, "2");
    }
    if (storageData.txprAbftAdrInqr2DVO && !nts_isNull(storageData.txprAbftAdrInqr2DVO.roadBscAdr)) {
        dwsPlaceServedObj.searchMode = "R";
    } else {
        dwsPlaceServedObj.searchMode = "L";
    }
    if (dwsPlaceServedObj.sggNm == undefined) {
        dwsPlaceServedObj.sggNm = "";
    }
    var dwsPlaceServedDetail = nts_getAddrText(dwsPlaceServedObj);
    var dwsPlaceServedDetailYn = "N";
    if (!nts_isNull(dwsPlaceServedDetail)) {
        dwsPlaceServedDetailYn = "Y";
    }


    //임대차 설정
    var residOwnerNm = ""; //성명(법인명)
    var residOwnerid = ""; //사업자등록번호
    var residOwner = ""; //주민(법인)등록번호
    var residOwner1 = ""; //주민(법인)등록번호1
    var residOwner2 = ""; //주민(법인)등록번호2
    var ctrf = ""; //임대차계약기간
    var ctrt = ""; //임대차계약기간
    var guaran = ""; //보증금
    var monamt = ""; //월세

    //CH1659932252303 (홈택스) 홈택스 과면세전환 3종 신규신청화면 개발 UTEABAAA86 추가
    //     if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62' || bsafScrnId == "UTEABAAA86") {
    //         //grid에서 값을 뽑아올 경우
    //         var dlt_grdLsrnBrkdList = $c.util.nts_getOpener($p).dlt_grdLsrnBrkdList;
    //         var dlt_grdLsrnBrkdListCnt = $c.util.nts_isNull($p, dlt_grdLsrnBrkdList) ? "0" : dlt_grdLsrnBrkdList.getTotalRow();
    //         if (dlt_grdLsrnBrkdListCnt != 0) {
    //             if (!$c.util.nts_isNull($p, dlt_grdLsrnBrkdList[0].lsorBmanNo"))) {
    //             residOwnerNm = dlt_grdLsrnBrkdList[0].lsorTxprNm;
    //             residOwnerid = $c.util.nts_fmtTaxpayerNo($p, dlt_grdLsrnBrkdList[0].lsorBmanNo"));
    //         } else if (!$c.util.nts_isNull($p, dlt_grdLsrnBrkdList[0].lsorCrpNo"))) {
    //             residOwner = dlt_grdLsrnBrkdList[0].lsorCrpNo;
    //     } else {
    //         residOwner = dlt_grdLsrnBrkdList[0].lsorRprsResno;
    //         residOwnerNm = dlt_grdLsrnBrkdList[0].rprsNm;
    //     }
    //     if (!$c.util.nts_isNull($p, residOwner)) {
    //         residOwner1 = residOwner.substr(0, 6);
    //         residOwner2 = residOwner.substr(6);
    //     }
    //     ctrf = dlt_grdLsrnBrkdList[0].ctrTermStrtDt;
    //     ctrt = dlt_grdLsrnBrkdList[0].ctrTermEndDt;
    //     guaran = scwin.ZeroNotViewAmt(dlt_grdLsrnBrkdList[0].lfamt"));
    //         monamt = scwin.ZeroNotViewAmt(dlt_grdLsrnBrkdList[0].mmrAmt"));
    //     }
    // } else {
    // 임대차 (lsrnBrkdDVOList)
    var dlt_ttiabcl020DVOList = storageData.lsrnBrkdDVOList;
    if (dlt_ttiabcl020DVOList && dlt_ttiabcl020DVOList.length > 0){
        if (!nts_isNull(dlt_ttiabcl020DVOList[0].lsorBmanNo)) {
            residOwnerNm = dlt_ttiabcl020DVOList[0].lsorTxprNm;
            residOwnerid = dlt_ttiabcl020DVOList[0].lsorBmanNo;
        } else if (!nts_isNull(dlt_ttiabcl020DVOList[0].lsorCrpNo)) {
            residOwner = dlt_ttiabcl020DVOList[0].lsorCrpNo;
        } else {
            residOwner = dlt_ttiabcl020DVOList[0].lsorRprsResno;
            residOwnerNm = dlt_ttiabcl020DVOList[0].rprsNm;
        }
    
        if (!nts_isNull(residOwner)) {
            residOwner1 = residOwner.substring(0, 6);
            residOwner2 = residOwner.substring(6);
        }
        ctrf = dlt_ttiabcl020DVOList[0].ctrTermStrtDt;
        ctrt = dlt_ttiabcl020DVOList[0].ctrTermEndDt;
        guaran = ZeroNotViewAmt(dlt_ttiabcl020DVOList[0].lfamt + "");
        monamt = ZeroNotViewAmt(dlt_ttiabcl020DVOList[0].mmrAmt + "");
    }

    // }

    //허가 등 사업여부(차세대에서는 여부로만 받고 있어서, 서식 변경이 필요함)
    var inheoGb1 = "N"; //신고
    var inheoGb2 = "N"; //등록
    var inheoGb3 = "N"; //허가
    var inheoGb4 = "N"; //해당없음

    if (storageData.ttiabcm002DVO.gpBsYn == "N") {
        inheoGb4 = "Y";
    }
    if (storageData.ttiabcm002DVO.gpBsYn == "Y") {
        inheoGb1 = "Y";
    }

    //개별소비세 해당여부
    var scntxTxtnClCd = storageData.ttiabcm002DVO.scntxTxtnClCd;
    var donsmtxAssTpNmfc = "N"; //제조
    var donsmtxAssTpSle = "N"; //판매
    var donsmtxAssTpPlac = "N"; //입장
    var donsmtxAssTpEntert = "N"; //유흥

    if (scntxTxtnClCd == '01' || scntxTxtnClCd == '06') {
        donsmtxAssTpNmfc = "Y";
    }
    if (scntxTxtnClCd == '02' || scntxTxtnClCd == '06' || scntxTxtnClCd == '07' || scntxTxtnClCd == '08' || scntxTxtnClCd == '09') {
        donsmtxAssTpSle = "Y";
    }
    if (scntxTxtnClCd == '03' || scntxTxtnClCd == '05' || scntxTxtnClCd == '07' || scntxTxtnClCd == '09') {
        donsmtxAssTpPlac = "Y";
    }
    if (scntxTxtnClCd == '04' || scntxTxtnClCd == '05' || scntxTxtnClCd == '08' || scntxTxtnClCd == '09') {
        donsmtxAssTpEntert = "Y";
    }

    //주류면허신청여부
    var alcoholLicenreqYn = "N";
    if (storageData.ttiabcm002DVO.lfAlLcnTypeCd == "541" || storageData.ttiabcm002DVO.lfAlLcnTypeCd == "542") {
        alcoholLicenreqYn = "Y";
    }
    //간이과세적용신고여부
    var easetaxYn = "N";
    var dwsBusntp = "";
    var vatTxtpeCdVal = storageData.ttiabcm002DVO.vatTxtpeCd;
    if (vatTxtpeCdVal == "02") {
        easetaxYn = "Y";
    }
    if (vatTxtpeCdVal == "01") {
        dwsBusntp = "1";
    } else if (vatTxtpeCdVal == "02") {
        dwsBusntp = "2";
    } else if (vatTxtpeCdVal == "04") {
        dwsBusntp = "3";
    } else if (vatTxtpeCdVal == "06" || vatTxtpeCdVal == "07") {
        dwsBusntp = "4";
    }

    //양도자의 사업자등록번호
    var grnrBsnNo = "";
    // if (bsafScrnId == 'UTEABAAA62') {
    //     grnrBsnNo = $c.util.nts_fmtMaskingTaxpayerNo($p, storageData.search_s1.get("bsno"));
    // }

    var enlrDscCntn = " ";
    var dataList = storageData.ttiabcl027DVOList;
    var listCount = dataList.length;
    for (var idyy = 0; idyy < listCount; idyy++) {
        if (dataList[idyy].enlrDscClCd == "01") {
            enlrDscCntn = dataList[idyy].enlrDscCntn;
        }
    }
    var dwsContent = enlrDscCntn;

    /* 2019-03-06 창업자맨토링서비스 */
    var mtrgAplnYn = storageData.ttiabcm001DVO.mtrgAplnYn == "Y" ? "Y" : "N";

    /* 2019-03-13 수신동의 추가 */
    var smsRcvnAgrYn = (storageData.bmanAplnCnoSVO.mpInfrRcvnAgrYn == "Y" ? "Y" : "N");
    var emlRcvnAgrYn = (storageData.bmanAplnCnoSVO.infrRcvnAgrYn == "Y" ? "Y" : "N");

    /* 2020-03-06 간이과세포기신고 */
    var sptxnAbdnRtnYn = storageData.ttiabcm002DVO.sptxnAbdnRtnYn;
    /* 2020-03-06 주소이전시 사업장 소재지 자동이전 추가 */
    var pfbTlcAltAgrYn = storageData.ttiabcm002DVO.pfbTlcAltAgrYn;
    /* 2020-03-06 송달장소구분코드 */
    var dlvPlcClCd = storageData.ttiabcd015DVO.dlvPlcClCd;
    /* 2020-03-06 주소이전시 송달장소 관련 자동이전 추가 */
    var dlvPlcAltAgrYn = storageData.ttiabcd015DVO.dlvPlcAltAgrYn;

    var todayDate = js_yyyy_mm_dd();

    var result = [{
        fieldName: "DWS_TYPE",
        fieldValue: ""
    }, {
        fieldName: "DWS_SANGHO",
        fieldValue: storageData.ttiabcm002DVO.tnmNm
    }, {
        fieldName: "DWS_NM",
        fieldValue: storageData.bmanRcatBscMttrSVO.txprNm
    }, {
        fieldName: "DWS_RESID",
        fieldValue: dwsResid
    }, {
        fieldName: "DWS_ADDR_DETAIL",
        fieldValue: dwsAddrDetail
    }, {
        fieldName: "DWS_TELNO",
        fieldValue: telno
    }, {
        fieldName: "DWS_TELNOA",
        fieldValue: nts_defaultString(telnoa, "")
    }, {
        fieldName: "DWS_PHONE",
        fieldValue: nts_defaultString(nts_fmtTelNo(phone), "")
    }, {
        fieldName: "DWS_FAXNO",
        fieldValue: faxno
    }, {
        fieldName: "DWS_EMAIL",
        fieldValue: nts_defaultString(email, "")
    }, {
        fieldName: "DWS_NTS_Y",
        fieldValue: storageData.bmanAplnCnoSVO.infrRcvnAgrYn == "Y" ? "Y" : "N"
    }, {
        fieldName: "DWS_NTS_N",
        fieldValue: storageData.bmanAplnCnoSVO.infrRcvnAgrYn == "N" ? "Y" : "N"
    }, {
        fieldName: "DWS_MESSAGE01",
        fieldValue: ""
    }, {
        fieldName: "DWS_UP_NM",
        fieldValue: bcNmVal
    }, {
        fieldName: "DWS_JO",
        fieldValue: itmNmVal
    }, {
        fieldName: "DWS_JUUP",
        fieldValue: mtfbCdVal
    }, {
        fieldName: "DWS_NEW_MAJ_COND",
        fieldValue: bcNmVal
    }, {
        fieldName: "DWS_NEW_MAJ_ITEM",
        fieldValue: itmNmVal
    }, {
        fieldName: "DWS_NEW_MAJ_BUSNO",
        fieldValue: mtfbCdVal
    }, {
        fieldName: "DWS_GUUP",
        fieldValue: guup
    }, {
        fieldName: "DWS_GUJO",
        fieldValue: gujo
    }, {
        fieldName: "DWS_GUUP_CD",
        fieldValue: guupCd
    }, {
        fieldName: "DWS_NEW_MIN_COND",
        fieldValue: guup
    }, {
        fieldName: "DWS_NEW_MIN_ITEM",
        fieldValue: gujo
    }, {
        fieldName: "DWS_NEW_MIN_BUSNO",
        fieldValue: guupCd
    }, {
        fieldName: "DWS_RGST_OPEN_DT",
        fieldValue: storageData.ttiabcm002DVO.ofbDt
    }, {
        fieldName: "DWS_EMP_CNT",
        fieldValue: ZeroNotView(storageData.ttiabcm002DVO.emplCnt + "")
    }, {
        fieldName: "DWS_CYBER_MALL_NM",
        fieldValue: cyberMallNm
    }, {
        fieldName: "DWS_CYBER_MALL_DOMAIN",
        fieldValue: cyberMallDomain
    }, {
        fieldName: "DWS_AREA_BD_SELF",
        fieldValue: Number(storageData.ttiabcm002DVO.pfbMhSfl) + ""
    }, {
        fieldName: "DWS_AREA_BD_OTHER",
        fieldValue: Number(storageData.ttiabcm002DVO.pfbAnhsSfl) + ""
    }, {
        fieldName: "DWS_RESID_OWNER_NM",
        fieldValue: residOwnerNm
    }, {
        fieldName: "DWS_RESID_OWNERID",
        fieldValue: residOwnerid
    }, {
        fieldName: "DWS_RESID_OWNER1",
        fieldValue: residOwner1
    }, {
        fieldName: "DWS_RESID_OWNER2",
        fieldValue: residOwner2
    }, {
        fieldName: "DWS_CTRFR",
        fieldValue: ctrf
    }, {
        fieldName: "DWS_CTRTO",
        fieldValue: ctrt
    }, {
        fieldName: "DWS_GUARAN",
        fieldValue: guaran
    }, {
        fieldName: "DWS_MONAMT",
        fieldValue: monamt
    }, {
        fieldName: "DWS_INHEO_GB1",
        fieldValue: inheoGb1
    }, {
        fieldName: "DWS_INHEO_GB2",
        fieldValue: inheoGb2
    }, {
        fieldName: "DWS_INHEO_GB3",
        fieldValue: inheoGb3
    }, {
        fieldName: "DWS_INHEO_GB4",
        fieldValue: inheoGb4
    }, {
        fieldName: "DWS_ALCOHOL_LICENEQQ",
        fieldValue: ""
    }, {
        fieldName: "DWS_ALCOHOL_LICENREQ_YN",
        fieldValue: alcoholLicenreqYn
    }, {
        fieldName: "DWS_CONSMTX_ASS_TP_MNFC",
        fieldValue: donsmtxAssTpNmfc
    }, {
        fieldName: "DWS_CONSMTX_ASS_TP_SLE",
        fieldValue: donsmtxAssTpSle
    }, {
        fieldName: "DWS_CONSMTX_ASS_TP_PLAC",
        fieldValue: donsmtxAssTpPlac
    }, {
        fieldName: "DWS_CONSMTX_ASS_TP_ENTERT",
        fieldValue: donsmtxAssTpEntert
    }, {
        fieldName: "DWS_JABON",
        fieldValue: ZeroNotViewAmt(storageData.ttiabcm002DVO.onsCpamt + "")
    }, {
        fieldName: "DWS_TABON",
        fieldValue: ZeroNotViewAmt(storageData.ttiabcm002DVO.aprsCpamt + "")
    }, {
        fieldName: "DWS_BUSNTAX_YN",
        fieldValue: "N"
    }, {
        fieldName: "DWS_EASETAX_YN",
        fieldValue: easetaxYn
    }, {
        fieldName: "DWS_CONFTP_YN",
        fieldValue: "N"
    }, {
        fieldName: "DWS_CO_GB_YN",
        fieldValue: storageData.ttiabcm002DVO.jntBmanYn
    }, {
        fieldName: "DWS_ADDR_TP",
        fieldValue: (storageData.txprAbftAdrInqr2DVO && storageData.txprAbftAdrInqr2DVO.ldBscAdr != '' ? 'Y' : 'N')
    }, {
        fieldName: "DWS_GRNR_BSN_NO",
        fieldValue: grnrBsnNo
    }, {
        fieldName: "DWS_BUSNTP",
        fieldValue: dwsBusntp
    }, {
        // 세무대리 지원 X
        fieldName: "DWS_ENT_NM",
        fieldValue: storageData.bmanRcatBscMttrSVO.txprNm //nts_isNull(storageData.txaaInfr.tin) ? "" : storageData.bmanRcatBscMttrSVO.txprNm
    }, {
        fieldName: "DWS_RQSTR_NM",
        fieldValue: "" // nts_defaultString(storageData.txaaInfr.txprNm, "")
    }, {
        fieldName: "DWS_RQSTR_RESID",
        fieldValue: "" //nts_fmtTaxpayerNo(storageData.txaaInfr.txprDscmNoEncCntn)
    }, {
        fieldName: "DWS_RQSTR_TELNO",
        fieldValue: "" // nts_defaultString(txaaMpnoValue, "")
    }, {
        fieldName: "DWS_RQSTR_RELATE_NM",
        fieldValue: "" //nts_isNull(storageData.txaaInfr.tin) ? "" : "세무대리인"
    }, {
        // 세무대리 지원 X
        fieldName: "DWS_TXOFF_NM",
        fieldValue: ""
    }, {
        fieldName: "DWS_RTN_DT_YY",
        fieldValue: todayDate.substr(0, 4)
    }, {
        fieldName: "DWS_RTN_DT_MM",
        fieldValue: todayDate.substr(4, 2)
    }, {
        fieldName: "DWS_RTN_DT_DD",
        fieldValue: todayDate.substr(6, 2)
    }, {
        fieldName: "DWS_RTN_NM",
        fieldValue: storageData.bmanRcatBscMttrSVO.txprNm
    }, {
        fieldName: "DWS_RTN_RQSTR_NM",
        fieldValue: "" //nts_defaultString(storageData.txaaInfr.get("txprNm"), "") // 세무대리 지원 X
    }, {
        fieldName: "DWS_CONTENT",
        fieldValue: dwsContent
    }, {
        fieldName: "DWS_PLACE_SERVED_YN",
        fieldValue: dwsPlaceServedDetailYn
    }, {
        fieldName: "DWS_PLACE_SERVED_ADD",
        fieldValue: nts_defaultString(dwsPlaceServedDetail, "")
    }, {
        fieldName: "DWS_MTRG_APLN_YN",
        fieldValue: mtrgAplnYn
    }, {
        fieldName: "DWS_SMS_RCVN_AGR_YN",
        fieldValue: smsRcvnAgrYn
    }, {
        fieldName: "DWS_EML_RCVN_AGR_YN",
        fieldValue: emlRcvnAgrYn
    }, {
        fieldName: "DWS_SPTXN_ABDN_RTN_YN",
        fieldValue: sptxnAbdnRtnYn
    }, {
        fieldName: "DWS_PFB_TLC_ALT_AGR_YN",
        fieldValue: pfbTlcAltAgrYn
    }, {
        fieldName: "DWS_DLV_PLC_CL_CD",
        fieldValue: dlvPlcClCd
    }, {
        fieldName: "DWS_DLV_PLC_ALT_AGR_YN",
        fieldValue: dlvPlcAltAgrYn
    }, {
        fieldName: "DWS_NM_RNTH",
        fieldValue: storageData.bmanRcatBscMttrSVO.txprNm
    }, {
        fieldName: "DWS_RESID_RNTH",
        fieldValue: nts_fmtTaxpayerNo(storageData.bmanRcatBscMttrSVO.resno)
    }, {
        fieldName: "DWS_SANGHO_RNTH",
        fieldValue: ""
    }, {
        fieldName: "DWS_BUSNID_RNTH",
        fieldValue: ""
    }, {
        fieldName: "DWS_ADDR_DETAIL_RNTH",
        fieldValue: dwsAddrDetail
    }, {
        fieldName: "DWS_PHONE_RNTH",
        fieldValue: nts_defaultString(nts_fmtTelNo(phone), "")
    }
    ];

    // 공동사업자 영역 추가
    if (jntBmanArr.length > 0) {
        result.push({
            fieldName: "DWS_CO_OPERATORS_SPEC_YN",
            fieldValue: "Y"
        });
        result.push({
            fieldName: "DWS_INVESTMENT",
            fieldValue: ZeroNotViewAmt(storageData.ttiabcm002DVO.invmAmt)
        });
        result.push({
            fieldName: "DWS_ESTABL_DATE",
            fieldValue: nts_cvtDateFormat("yyyy-MM-dd", storageData.ttiabcm002DVO.beesDt)
        });
    }
    for (var i = 0; i < jntBmanArr.length; i++) {
        result.push(jntBmanArr[i]);
    }
    //부업종리스트 추가
    for (var i = 0; i < guupArr.length; i++) {
        result.push(guupArr[i]);
    }

    // // 임대주택 명세서
    // //CH1659932252303 (홈택스) 홈택스 과면세전환 3종 신규신청화면 개발 UTEABAAA86 추가
    // if (bsafScrnId == 'UTEABAAA60' || bsafScrnId == 'UTEABAAA62' || bsafScrnId == "UTEABAAA86") {
    //     //grid에서 값을 뽑아올 경우
    //     for (var i = 0; i < rnthArrNew.length; i++) {
    //         result.push(rnthArrNew[i]);
    //     }
    // }
    return {
        "errorCode": S_IBX_OK,
        "result": result
    };
}

// 데이터를 쪼개서 전송하는 함수
function encodeFieldParams(fields, maxLen) {
    var prefix = "nts";
    var chunks = [];
    var current = prefix;
    var i;

    for (i = 0; i < fields.length; i++) {
        var f = fields[i];
        var encoded = f.fieldName + "=" + httpRequest.URLEncode(f.fieldValue, "UTF-8") + ";";

        if ((current + encoded).length > maxLen) {
            chunks.push(current);
            current = prefix + encoded;
        } else {
            current += encoded;
        }
    }

    if (current.length > prefix.length) {
        chunks.push(current);
    }

    return chunks;
}


function nts_getAddrText(obj) {
    var addrText = "";
    if (obj.searchMode == "R" && !nts_isNull(obj.roadNmCd)) {
        //도로명주소 선택 후 팝업창을 완료한 경우
        //도로명주소표기법 : 시도 + 시군구 + 읍면 + 도로명 + 건물번호 + 상세주소(동/층/호) + 참고항목(법정동, 공동주택명)
        addrText = obj.sidoNm + " " + obj.sggNm;
        var ymdgNm = !nts_isNull(obj.roadNmCdYmdgNm) ? obj.roadNmCdYmdgNm : obj.ymdgNm;

        //읍면
        if (!nts_isNull(ymdgNm) && obj.ymdgClCd == "01") {
            addrText = addrText + " " + ymdgNm;
        }

        //도로명
        if (nts_isNull(obj.roadNm)) {
            obj.roadNm = "";
        }
        addrText = addrText + " " + obj.roadNm;

        //지하여부
        if (!nts_isNull(obj.undrBldClCd) && obj.undrBldClCd == "1") {
            addrText = addrText + " " + "지하";
        } else if (!nts_isNull(obj.undrBldClCd) && obj.undrBldClCd == "2") {
            addrText = addrText + " " + "공중";
        }

        //건물번호-본번
        if (!nts_isNull(obj.bldPmnoAdr) && obj.bldPmnoAdr != "0") {
            addrText = addrText + " " + obj.bldPmnoAdr;
        }

        //건물번호-부번
        if (!nts_isNull(obj.bldSnoAdr) && obj.bldSnoAdr != "0") {
            addrText = addrText + "-" + obj.bldSnoAdr;
        }
        var tEtcAdr = "";
        //상세주소(동/층/호) 
        if (!nts_isNull(obj.bldDn) && obj.bldDn != "0") {
            tEtcAdr = tEtcAdr + " " + obj.bldDn + "동";
        }
        if (!nts_isNull(obj.bldFlor) && obj.bldFlor != "0") {
            tEtcAdr = tEtcAdr + " " + obj.bldFlor + "층";
        }
        if (!nts_isNull(obj.bldHo) && obj.bldHo != "0") {
            tEtcAdr = tEtcAdr + " " + obj.bldHo + "호";
        }
        if (!nts_isNull(obj.etcAdr)) {
            tEtcAdr = tEtcAdr + " " + obj.etcAdr;
        }
        if (!nts_isNull(tEtcAdr)) {
            addrText = addrText + "," + tEtcAdr;
        }
        var dongYn = !nts_isNull(ymdgNm) && obj.ymdgClCd == "02" || ymdgNm.substr(ymdgNm.length - 1, 1) == "동" ? "Y" : "N";

        // 참고항목(읍면이 아닌 동일경우 또는 건물명이 있을 경우)
        if (dongYn == "Y" || !nts_isNull(obj.bldNm)) {
            addrText = addrText + "(";

            //읍면동의 동명이 있고 동일경우
            if (dongYn == "Y") {
                addrText = addrText + ymdgNm;
            }

            // 건물명이 있을 경우
            if (!nts_isNull(obj.bldNm)) {
                addrText = addrText + (dongYn == "Y" ? ", " : "") + obj.bldNm;
            }
            addrText = addrText + ")";
        }
    } else if (obj.searchMode == "L" || obj.searchMode == "B") {
        //법정동주소 선택 후 팝업창을 완료한 경우
        //법정동주소 표기법 : 시도 + 시군구 + 읍면동 + 번지 + 호 + 건물명 + 동 + 층 + 호  
        addrText = obj.sidoNm + " " + obj.sggNm + " " + obj.ymdgNm;
        if (!nts_isNull(obj.rdstNm)) {
            addrText = addrText + " " + obj.rdstNm;
        }
        if (!nts_isNull(obj.spcaCd) && obj.spcaCd == "1") {
            addrText = addrText + " " + "산";
        }
        if (!nts_isNull(obj.bunjAdr) && obj.bunjAdr != "0") {
            addrText = addrText + " " + obj.bunjAdr;
            if (!nts_isNull(obj.hoAdr) && obj.hoAdr != "0") {
                addrText = addrText + "-" + obj.hoAdr;
            }
        } else {
            if (!nts_isNull(obj.hoAdr) && obj.hoAdr != "0") {
                addrText = addrText + " " + obj.hoAdr;
            }
        }
        if (!nts_isNull(obj.bldNm)) {
            addrText = addrText + " " + obj.bldNm;
        }
        if (!nts_isNull(obj.bldDn) && obj.bldDn != "0") {
            addrText = addrText + " " + obj.bldDn + "동";
        }
        if (!nts_isNull(obj.bldFlor) && obj.bldFlor != "0") {
            addrText = addrText + " " + obj.bldFlor + "층";
        }
        if (!nts_isNull(obj.bldHo) && obj.bldHo != "0") {
            addrText = addrText + " " + obj.bldHo + "호";
        }
        if (!nts_isNull(obj.etcAdr)) {
            addrText = addrText + " " + obj.etcAdr;
        }
    }
    return addrText;
};