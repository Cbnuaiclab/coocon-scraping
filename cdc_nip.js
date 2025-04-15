var BankName = "예방접종도우미";
var moduleVersion = '24.12.12.1';
console.log(BankName + " 스크립트 호출됨.");
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
	this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16));
};

iSASObject.prototype.checkError = function () {
	this.errorMsg = StrGrab(httpRequest.result, "\"errMsg\":\"", "\",\"");
	if (this.errorMsg != "") {
		this.log("Juryu ErrorLog [" + this.errorMsg + "]");
		return true;
	} else {
		return false;
	}
};

function EscapeSymbol(AStr) {
	var Result = "";
	    for(i = 0; i < AStr.length; i++) {
	      switch (AStr[i]) {
	          case "!": Result = Result + "%21"; break; 
	          case "@": Result = Result + "%40"; break;
	          case "#": Result = Result + "%23"; break;
	          case "$": Result = Result + "%24"; break;
	          case "%": Result = Result + "%25"; break;
	          case "^": Result = Result + "%5E"; break;
	          case "&": Result = Result + "%26"; break;
	          case "(": Result = Result + "%28"; break;
	          case ")": Result = Result + "%29"; break;
	          case "+": Result = Result + "%2B"; break;
	          case "=": Result = Result + "%3D"; break;
			  case "?": Result = Result + "%3F"; break;
	          case "/": Result = Result + "%2F"; break;
	          case ";": Result = Result + "%3B"; break;
	          default: Result = Result + AStr[i];
	      }
	    }
	    return Result;
}

var decodeHtmlEntity = function(str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};


var 개인전자민원 = function () {
	//생성자
	console.log(BankName + " 개인전자민원 생성자 호출");
	this.errorMsg = "";
	this.host = "https://nip.kdca.go.kr";
	this.url = "";
	this.postData = "";
	this.userAgent  = '{"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.122 Whale/3.16.138.27 Safari/537.36",';
	this.userAgent += '"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",';
	this.userAgent += '"Accept-Encoding": "gzip, deflate, br",';
	this.userAgent += '"Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,ko;q=0.7,ja;q=0.6"}';
	this.xgate_addr = "nip.kdca.go.kr:51443:51444";

	this.bLogIn = false;
};

개인전자민원.prototype = Object.create(iSASObject.prototype);

개인전자민원.prototype.errorChk = function (rsltObj) {
	if (rsltObj.indexOf('>로그인</a>') > -1) {
		this.setError(E_IBX_SESSION_CLOSED);
		this.bLogIn = false;
		return E_IBX_SESSION_CLOSED;
	}

	return S_IBX_OK;
}

개인전자민원.prototype.로그인 = function (aInput) {
	this.log(BankName + " 개인전자민원 로그인 호출[" + moduleVersion + "][" + aInput + "]");

	httpRequest.clearCookie('');

	try {
		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		if (input.비밀번호) this.iSASInOut.Input.비밀번호 = input.비밀번호.replace(/./g, '*');
		if (input.인증서 && input.인증서.비밀번호) this.iSASInOut.Input.인증서.비밀번호 = input.인증서.비밀번호.replace(/./g, "*");
		if (input.휴대폰번호) this.iSASInOut.Input.휴대폰번호 = input.휴대폰번호.replace(/./g, '*');

		if (input.로그인방식) {
			if (input.로그인방식 != "CERT" && input.로그인방식 != "ID" && input.로그인방식 != "KAKAO" &&
				input.로그인방식 != "NAVER" && input.로그인방식 != "TOSS" && input.로그인방식 != "PASS") {
				this.log("알수 없는 로그인 타입");
				this.setError(E_IBX_LOGIN_TYPE_ERROR);
				return E_IBX_LOGIN_TYPE_ERROR;
			}
		}
		
		this.url = '/irhp/goLogin.do';
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var ResultStr = httpRequest.result;
		this.log("로그인1: [" + ResultStr + "]");

		if (ResultStr.indexOf('action="/irhp/goLogin.do"') < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		var loginSignFrm = StrGrab(ResultStr, 'id="loginSignFrm"', '</form>');
		var _csrf = StrGrab(StrGrab(loginSignFrm, '"_csrf"', '>'), 'value="', '"');
		var menuLv = StrGrab(StrGrab(loginSignFrm, '"menuLv"', '>'), 'value="', '"');
		var menuCd = StrGrab(StrGrab(loginSignFrm, '"menuCd"', '>'), 'value="', '"');
		if (!_csrf || !menuLv || !menuCd) {
			this.setError(E_IBX_SITE_INVALID + 1);
			return E_IBX_SITE_INVALID + 1;
		}

        this.log("로그인방식:[" + input.로그인방식 + "]");
		if (input.로그인방식 == "KAKAO" || input.로그인방식 == "NAVER" || input.로그인방식 == "TOSS" || input.로그인방식 == "PASS") {
			this.log("간편인증 로그인");

			var 이름 = input.이름;
			var 생년월일 = input.생년월일;
			var 휴대폰번호 = input.휴대폰번호;

			if (!이름) {
				this.setError(E_IBX_P1100X_NAME_NOTENTER);
				this.iSASInOut.Output.ErrorMessage = '이름 미입력입니다. 확인 후 거래하시기 바랍니다.';
				return E_IBX_P1100X_NAME_NOTENTER;
			}

			if (!생년월일) {
				this.setError(E_IBX_CAR_INS_OWNER_DOB_NOTENTER);
				return E_IBX_CAR_INS_OWNER_DOB_NOTENTER;
			} else if (isNaN(생년월일) || 생년월일.length != 8) {
				this.setError(E_IBX_CAR_INS_OWNER_DOB_INVALID);
				return E_IBX_CAR_INS_OWNER_DOB_INVALID;
			}
			var tmpDate = new Date(input.생년월일.substring(0, 4), parseInt(input.생년월일.substring(4, 6)) - 1, input.생년월일.substring(6, 8));
			if (tmpDate.yyyymmdd() != input.생년월일) {
				this.setError(E_IBX_CAR_INS_OWNER_DOB_INVALID);
				return E_IBX_CAR_INS_OWNER_DOB_INVALID;
			}

			if (!휴대폰번호) {
				this.setError(E_IBX_TELEPHONE_NOTENTER);
				this.iSASInOut.Output.ErrorMessage = '휴대폰번호 미입력입니다. 확인 후 거래하시기 바랍니다.';
				return E_IBX_TELEPHONE_NOTENTER;
			} else if (isNaN(휴대폰번호) || 휴대폰번호.length < 10 ||  휴대폰번호.length > 11) {
				this.setError(E_IBX_TELEPHONE_INVALID);
				this.iSASInOut.Output.ErrorMessage = '잘못된 휴대폰번호입니다. 확인 후 거래하시기 바랍니다.';
				return E_IBX_TELEPHONE_INVALID;
			}

			this._csrf = _csrf;
			this.menuCd = menuCd;
			this.menuLv = menuLv;

			system.setStatus(IBXSTATE_ENTER, 40);
			this.url = '/irhp/anysign_yessn/interface/simpleSign4PCInterface.js';
			if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log('로그인-간편인증1:[' + ResultStr + ']');

			var paramBlock, serviceProvider, mode;
			if (input.로그인방식 == "KAKAO") {
				paramBlock = (StrGrab(ResultStr, 'kakaoTalkInfo : {', '}') || StrGrab(ResultStr, 'kakaoTalkInfo: {', '}'));
				if (!paramBlock) {
					this.setError(E_IBX_SITE_INVALID + 2);
					return E_IBX_SITE_INVALID + 2;
				}

				mode = (StrGrab(paramBlock, 'mode : "', '"') || StrGrab(paramBlock, 'mode: "', '"'));  // K1110 (간편 인증) | K3510 (단일 전자서명) | K3511 (단일/다중 전자서명)
				if (mode == 'K1110') {
					serviceProvider = 'kakaotalk';
					this.url = '/irhp/anysign_yessn/SimpleSign/module/kakaoTalkIdentityReq.jsp';
					this.nextUrl = '/irhp/anysign_yessn/SimpleSign/module/kakaoTalkIdentityRes.jsp';
				 }
				else if (mode == 'K3510') {
					serviceProvider = 'kakaoTalk_3510';
					this.url = '/irhp/anysign_yessn/SimpleSign/module/kakaoTalkK3510Req.jsp';
					this.nextUrl = '/irhp/anysign_yessn/SimpleSign/module/kakaoTalkK3510Res.jsp';
				} else if (mode == 'K3511') {
					serviceProvider = 'kakaotalk_new';
					this.url = '/irhp/anysign_yessn/SimpleSign/module/kakaoTalkSignReq.jsp';
					this.nextUrl = '/irhp/anysign_yessn/SimpleSign/module/kakaoTalkSignRes.jsp';
				} else {
					this.setError(E_IBX_SITE_INVALID + 3);
					return E_IBX_SITE_INVALID + 3;
				}

				this.postData = 'serviceKey=' + 'undefined';
				this.postData += '&encVersion=' + (StrGrab(paramBlock, 'encVersion: ', ',') || StrGrab(paramBlock, 'encVersion : ', ','));
				this.postData += '&userName=' + 이름;
				this.postData += '&birthday=' + 생년월일;
				this.postData += '&phoneNo=' + 휴대폰번호;
				this.postData += '&gender=';
				this.postData += '&orgCode=' + (StrGrab(paramBlock, 'requestOrgName : "', '"') || StrGrab(paramBlock, 'requestOrgName: "', '"'));
				this.postData += '&csPhoneNo=' + 'undefined';
				this.postData += '&title=' + (StrGrab(paramBlock, 'requestSignTitle : "', '"') || StrGrab(paramBlock, 'requestSignTitle: "', '"'));
				this.postData += '&serviceProvider=' + serviceProvider;
				this.postData += '&encrypted=' + (StrGrab(paramBlock, 'encrypted : ', ',') || StrGrab(paramBlock, 'encrypted: ', ','));
				this.postData += '&plain=' + '예방접종도우미 로그인';
			} else if (input.로그인방식 == "NAVER") {
				serviceProvider = 'naver';
				paramBlock = (StrGrab(ResultStr, 'naverInfo : {', '}') || StrGrab(ResultStr, 'naverInfo: {', '}'));
				if (!paramBlock) {
					this.setError(E_IBX_SITE_INVALID + 4);
					return E_IBX_SITE_INVALID + 4;
				}
				 
				this.url = '/irhp/anysign_yessn/SimpleSign/module/naverSignReqV2.jsp';
				this.nextUrl = '/irhp/anysign_yessn/SimpleSign/module/naverSignResV2.jsp';

				this.postData  = 'serviceProvider=' + serviceProvider;
				this.postData += '&mode=' + (StrGrab(paramBlock, 'mode : "', '"') || StrGrab(paramBlock, 'mode: "', '"'));
				this.postData += '&userName=' + 이름;
				this.postData += '&birthday=' + 생년월일;
				this.postData += '&phoneNo=' + 휴대폰번호;
				this.postData += '&gender=';
				this.postData += '&plain=' + '예방접종도우미 로그인';
				this.postData += '&csPhoneNo=' + (StrGrab(paramBlock, 'callCenterNo : "', '"') || StrGrab(paramBlock, 'callCenterNo: "', '"'));
				this.postData += '&deviceBrowser=' + (StrGrab(paramBlock, 'deviceBrowser : "', '"') || StrGrab(paramBlock, 'deviceBrowser: "', '"'));
				this.postData += '&deviceCode='  + (StrGrab(paramBlock, 'deviceCode : "', '"') || StrGrab(paramBlock, 'deviceCode: "', '"'));
			} else if (input.로그인방식 == "TOSS") {
				serviceProvider = 'toss';
				paramBlock = (StrGrab(ResultStr, 'tossInfo : {', '}') || StrGrab(ResultStr, 'tossInfo: {', '}'));
				if (!paramBlock) {
					this.setError(E_IBX_SITE_INVALID + 5);
					return E_IBX_SITE_INVALID + 5;
				}

				this.url = '/irhp/anysign_yessn/SimpleSign/module/tossSignReq.jsp';
				this.nextUrl = '/irhp/anysign_yessn/SimpleSign/module/tossSignRes.jsp';

				this.postData  = 'serviceProvider=' + serviceProvider;
				this.postData += '&mode=' + '1';
				this.postData += '&userName=' + 이름;
				this.postData += '&birthday=' + 생년월일;
				this.postData += '&phoneNo=' + 휴대폰번호;
				this.postData += '&gender=';
				this.postData += '&title=' + (StrGrab(paramBlock, 'signTitle : "', '"') || StrGrab(paramBlock, 'signTitle: "', '"'));
				this.postData += '&plain=' + '예방접종도우미 로그인';
			} else if (input.로그인방식 == "PASS") {
				serviceProvider = 'pass';
				paramBlock = (StrGrab(ResultStr, 'passInfo : {', '}') || StrGrab(ResultStr, 'passInfo: {', '}'));
				if (!paramBlock) {
					this.setError(E_IBX_SITE_INVALID + 6);
					return E_IBX_SITE_INVALID + 6;
				}

				this.url = '/irhp/anysign_yessn/SimpleSign/module/passSignReq.jsp';
				this.nextUrl = '/irhp/anysign_yessn/SimpleSign/module/passSignRes.jsp';

				this.postData  = 'serviceProvider=' + serviceProvider;
				this.postData += '&csPhoneNo=' + (StrGrab(paramBlock, 'callCenterNo : "', '"') || StrGrab(paramBlock, 'callCenterNo: "', '"'));
				this.postData += '&userName=' + 이름;
				this.postData += '&birthday=' + 생년월일;
				this.postData += '&phoneNo=' + 휴대폰번호;
				this.postData += '&gender=';
				this.postData += '&title=' + (StrGrab(paramBlock, 'reqTitle : "', '"') || StrGrab(paramBlock, 'reqTitle: "', '"'));
				this.postData += '&content=' + (StrGrab(paramBlock, 'reqContent : "', '"') || StrGrab(paramBlock, 'reqContent: "', '"'));
				this.postData += '&signTargetTycd=' + (StrGrab(paramBlock, 'signTargetTycd : "', '"') || StrGrab(paramBlock, 'signTargetTycd: "', '"'));
				this.postData += '&plain=' + '예방접종도우미 로그인';
			} else {
				this.setError(E_IBX_CERTIFY_NOT_REGISTER);
				return E_IBX_CERTIFY_NOT_REGISTER;
			}

			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("로그인-간편인증2: [" + ResultStr + "]");
			
			var jsonRes = JSON.parse(ResultStr);
			var res, responseData;
			if (input.로그인방식 == 'KAKAO') {
				res = jsonRes.responseCode + '';
				responseData = jsonRes.responseData;

				if (res != '200') {
					if (responseData.indexOf('name not matched') > -1) {
						this.setError(E_IBX_P1100X_NAME_INVALID);
						this.iSASInOut.Output.ErrorMessage = '잘못된 이름입니다. 확인 후 거래하시기 바랍니다.';
						return E_IBX_P1100X_NAME_INVALID
					} else if (responseData.indexOf('birthday not matched') > -1) {
						this.setError(E_IBX_CAR_INS_OWNER_DOB_INVALID);
						return E_IBX_CAR_INS_OWNER_DOB_INVALID
					} else if (responseData.indexOf('Not found kakao auth info') > -1 || responseData.indexOf('Invalid phone number format') > -1) {
						this.setError(E_IBX_TELEPHONE_INVALID);
						this.iSASInOut.Output.ErrorMessage = '잘못된 휴대폰번호입니다. 확인 후 거래하시기 바랍니다.';
						return E_IBX_TELEPHONE_INVALID;
					} else {
						this.setError(E_IBX_NOT_MATCHED_USERINFO);
						this.iSASInOut.Output.ErrorMessage = responseData;
						return E_IBX_NOT_MATCHED_USERINFO
					}
				}
				
				if (!jsonRes.txId || !jsonRes.envUserInfo) {
					this.setError(E_IBX_SITE_INVALID + 7);
					return E_IBX_SITE_INVALID + 7;
				}
				
				this.postData = 'serviceKey=undefined';
				this.postData += '&txId=' + jsonRes.txId;
				this.postData += '&envUserInfo=' + jsonRes.envUserInfo;
				this.postData += '&serviceProvider=' + serviceProvider;
			} else if (input.로그인방식 == 'NAVER') {
				res = jsonRes.rtnMsg;
				if (res == 'not_exist_user' || res != 'success') {
					this.setError(E_IBX_NOT_MATCHED_USERINFO);
					return E_IBX_NOT_MATCHED_USERINFO
				}

				if (!jsonRes.txId || !jsonRes.envUserInfo) {
					this.setError(E_IBX_SITE_INVALID + 8);
					return E_IBX_SITE_INVALID + 8;
				}

				this.postData = 'serviceProvider=' + serviceProvider;
				this.postData += '&txId=' + jsonRes.txId;
				this.postData += '&envUserInfo=' + jsonRes.envUserInfo;
			} else if (input.로그인방식 == 'TOSS') {
				res = jsonRes.resultType;
				if (res == 'FAIL' || res != 'SUCCESS') {
					this.setError(E_IBX_NOT_MATCHED_USERINFO);
					this.iSASInOut.Output.ErrorMessage = StrGrab(ResultStr, '"errorReason":"', '"');
					return E_IBX_NOT_MATCHED_USERINFO
				}

				if (!jsonRes.accessToken || !jsonRes.txId || !jsonRes.envUserInfo) {
					this.setError(E_IBX_SITE_INVALID + 9);
					return E_IBX_SITE_INVALID + 9;
				}

				this.postData = 'serviceProvider=' + serviceProvider;
				this.postData += '&accessToken=' + jsonRes.accessToken;
				this.postData += '&txId=' + jsonRes.txId;
				this.postData += '&envUserInfo=' + jsonRes.envUserInfo;
			} else if (input.로그인방식 == 'PASS') {
				res = jsonRes.errorCd;
				if (res) {
					this.setError(E_IBX_NOT_MATCHED_USERINFO);
					this.iSASInOut.Output.ErrorMessage = StrGrab(ResultStr, '"errorMessage":"', '"');
					return E_IBX_NOT_MATCHED_USERINFO
				}

				if (!jsonRes.envUserInfo || !jsonRes.reqTxId || !jsonRes.certTxId) {
					this.setError(E_IBX_SITE_INVALID + 10);
					return E_IBX_SITE_INVALID + 10;
				}

				this.postData = 'serviceProvider=' + serviceProvider;
				this.postData += '&envUserInfo=' + jsonRes.envUserInfo;
				this.postData += '&userName=' + 이름;
				this.postData += '&birthday=' + 생년월일;
				this.postData += '&phoneNo=' + 휴대폰번호;
				this.postData += '&txId=' + jsonRes.reqTxId;
				this.postData += '&certTxId=' + jsonRes.certTxId;

				// PASS 인증시 앱에서 네트워크 관련 메세지 뜨며 인증이 정상적으로 인증되지 않는경우 앱 재설치, 인증서 재발급 후 진행
			}

			this.iSASInOut.Output = {};
			this.iSASInOut.Output.ErrorCode = "00000000";
			this.iSASInOut.Output.ErrorMessage = "";
			this.iSASInOut.Output.Result = {};
			this.iSASInOut.Output.Result.CallBackfunc = 'OTP';
			this.iSASInOut.Output.Result.req = {};
			this.iSASInOut.Output.Result.req.API = 'OTP';

			this.iSASInOut.Output.Result.req.req = [];
			this.iSASInOut.Output.Result.req.req.push({ "Title": "Step.1", "Code": "인증 요청 메시지를 보냈습니다." });
			this.iSASInOut.Output.Result.req.req.push({ "Title": "Step.2", "Code": "인증 완료 후, 하단의 인증완료 클릭" });

			return S_IBX_OK;
		} else if (input.로그인방식 == "CERT") {
			this.log("인증서 로그인");

			if (!input.인증서.이름 && !input.인증서.인증서명) {
				this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
				return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
			}
	
			if (!input.인증서.비밀번호) {
				this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
				return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
			}

			if (!XecureWeb.findCert(JSON.stringify(input.인증서))) {
				this.log("인증서를 찾을 수 없습니다.");
				this.setError(E_IBX_CERTIFY_NOT_FOUND);
				return E_IBX_CERTIFY_NOT_FOUND;
			} else {
				this.log("인증서 찾음.");
			}
			if (!XecureWeb.verifyPassword(input.인증서.비밀번호)) {
				this.log("XecureWeb.verifyPassword 실패");
				this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
				return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
			} else {
				this.log("XecureWeb.verifyPassword 성공");
			}

			var s = "var s = '';" + StrGrab(ResultStr, "var s = '';", "s += '';");
			
			eval(s);
			this.log("srvcert:[" + s + "]");

			if (s == "") {
				this.setError(E_IBX_SITE_INVALID + 11);
				return E_IBX_SITE_INVALID + 11;
			}

			var signed_msg = XecureWeb.signDataCMS(this.xgate_addr, 'Login', input.인증서.비밀번호);
			XecureWeb.envelopIdNum(this.xgate_addr, input.인증서.비밀번호, s);
			var vid_msg = XecureWeb.getVIDInfo();

			this.log("SIGNED:[" + signed_msg + "]");
			this.log("vid_msg:[" + vid_msg + "]");
			if (!signed_msg || !vid_msg) {
				this.setError(E_IBX_CERTIFY_UNKNOWN);
				return E_IBX_CERTIFY_UNKNOWN;
			}

			this.url = '/irhp/goSignLogin.do';
			this.postData = 'menuLv=' + menuLv;
			this.postData += '&menuCd=' + menuCd;
			this.postData += '&_csrf=' + _csrf;
			this.postData += '&signed_orgMsg=' + signed_msg;
			this.postData += '&vid_orgMsg=' + vid_msg;
			this.postData += '&_csrf=' + _csrf;
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("로그인2_Cert: [" + ResultStr + "]");

			if (ResultStr.indexOf('<strong>재동의</strong>') > 0) {
				this.setError(E_IBX_CUSTOMER_NOT_AGREEMENT);
				return E_IBX_CUSTOMER_NOT_AGREEMENT;
			}

			if (ResultStr.indexOf('인증서가 폐기되었습니다') > -1) {
				this.setError(E_IBX_CERTIFY_DISUSE);
				return E_IBX_CERTIFY_DISUSE;
			}

			if (ResultStr.indexOf("인증서의 유효기간이 지났습니다") > -1) {
				this.setError(E_IBX_CERTIFY_EXCEED_DATE);
				return E_IBX_CERTIFY_EXCEED_DATE;
			}

        } else if (!input.로그인방식 || input.로그인방식 == "ID") {
			this.log("아이디 로그인");

			var userID = input.아이디;
			if (!input.비밀번호) {
				this.setError(E_IBX_USER_PASSWORD_NOTENTER);
				return E_IBX_USER_PASSWORD_NOTENTER;
			}
			if (!userID) {
				this.setError(E_IBX_USER_ACCOUNT_NOTENTER);
				return E_IBX_USER_ACCOUNT_NOTENTER;
			}
	
			var password = sas.SecureData.create(input.비밀번호);
			if (password.isSecurData()) {
				this.log('비밀번호 SASSecurData 포맷!');
			} else {
				this.log('비밀번호 일반 포맷!');
			}

			this.url = '/irhp/goMemberLogin.do';
			this.postData  = 'menuLv='       	+ menuLv;
			this.postData += '&menuCd='      	+ menuCd;
			this.postData += '&_csrf='    	 	+ _csrf;
			this.postData += '&userPswdFlag=Y';
			this.postData += '&xkKeypadType=P';
			this.postData += '&xksessionid=';
			this.postData += '&xksectoken=';
			this.postData += '&xkindexed=';
			this.postData += '&userId='      	+ userID;
			this.postData += '&userPswd='    	+ EscapeSymbol(password.getPlainText());
			this.postData += '&xkKeypadUse=N';
			this.postData += '&_csrf='    	 	+ _csrf;
			
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("로그인2: [" + ResultStr + "]");
		}
		if (ResultStr.indexOf('비밀번호 5회 이상 입력 오류로 계정이 잠금상태입니다') >= 0) {
			this.setError(E_IBX_USER_ACCOUNT_DENIED);
			return E_IBX_USER_ACCOUNT_DENIED;
		}

		var sERRmsg = StrGrab(ResultStr, 'var sERRmsg = "', '";');
		if (sERRmsg.indexOf('아아디 또는 비밀번호를 확인해주세요') > -1) {
			this.setError(E_IBX_USER_ACCOUNT_INVALID_2);
			return E_IBX_USER_ACCOUNT_INVALID_2;
		}

		// 2022 10 05 (ID password error exceed 5 times)
		// var sERRmsg = "※ 비밀번호 오류 횟수가 5회를 초과하여 아이디/비밀번호 찾기 페이지로 전환됩니다.";
		if (ResultStr.indexOf('아이디/비밀번호를 확인해주세요.') >= 0 ||
		    (sERRmsg && sERRmsg.indexOf('비밀번호 오류 횟수가') > -1)) {
			if (ResultStr.indexOf('(1회/5회)') >= 0 ||
				ResultStr.indexOf('(2회/5회)') >= 0 ||
				ResultStr.indexOf('(3회/5회)') >= 0 ||
				ResultStr.indexOf('1회를 초과하여') > -1 ||
				ResultStr.indexOf('2회를 초과하여') > -1 ||
				ResultStr.indexOf('3회를 초과하여') > -1) {
				this.setError(E_IBX_USER_PASSWORD_INVALID);
				return E_IBX_USER_PASSWORD_INVALID;				
			} else if (ResultStr.indexOf('(4회/5회)') >= 0 || sERRmsg.indexOf('4회를 초과하여') > -1) {
				this.setError(E_IBX_USER_PASSWORD_JUSTBEFOREDENY);
				return E_IBX_USER_PASSWORD_JUSTBEFOREDENY;
			} else if (sERRmsg.indexOf('5회를 초과하여') > -1) {
				this.setError(E_IBX_USER_PASSWORD_DENIED);
				return E_IBX_USER_PASSWORD_DENIED;
			} else {
				this.setError(E_IBX_USER_ACCOUNT_INVALID_2);
				return E_IBX_USER_ACCOUNT_INVALID_2;
			}
		}
		if (ResultStr.indexOf('해당 인증서로 등록된 아이디가 존재하지 않습니다') >= 0) {
			this.setError(E_IBX_CERTIFY_NOT_REGISTER);
			return E_IBX_CERTIFY_NOT_REGISTER;
		}
		if (ResultStr.indexOf('>회원 비밀번호 변경<') > -1) {
			this.url = '/irgd/index.do'; // 비밀번호 나중에 변경하기(건너뛰면 안됨)
			if (httpRequest.get(this.host + this.url) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("로그인2-1: [" + ResultStr + "]");
		}
		if (ResultStr.indexOf('/irhp/goLogout.do') < 0) {
			this.setError(E_IBX_LOGIN_FAIL);
			return E_IBX_LOGIN_FAIL;
		}

		this.bLogIn = true;
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
		this.log(BankName + " 개인전자민원 로그인 finally");
	}
};


개인전자민원.prototype.본인예방접종내역조회 = function (aInput) {
	this.log(BankName + " 개인전자민원 본인예방접종내역조회 호출[" + moduleVersion + "][" + aInput + "]");

	try {
		if (this.bLogIn != true) {
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

		system.setStatus(IBXSTATE_CHECKPARAM, 10);
		var input = dec(aInput.Input);
		if (input.주민등록번호) this.iSASInOut.Input.주민등록번호 = input.주민등록번호.replace(/./g, '*');

		var 이름 = input.이름;
		var 주민등록번호 = input.주민등록번호;

		if (주민등록번호) {
			if (isNaN(주민등록번호) || 주민등록번호.length != 7) {
				this.setError(E_IBX_REGNO_RESIDENT_INVALID);
				return E_IBX_REGNO_RESIDENT_INVALID;
			}
		}
		
		system.setStatus(IBXSTATE_ENTER, 30);

		// 예방접종 관리 > 본인 예방접종 관리 > 본인 예방접종 내역조회
		this.url = '/irhp/mngm/goVcntMngm.do?menuLv=3&menuCd=321';
		if (httpRequest.getWithUserAgent(this.userAgent, this.host + this.url) == false) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var ResultStr = httpRequest.result;
		this.log("본인예방접종내역조회_1: [" + ResultStr + "]");

		var rst = this.errorChk(ResultStr);
		if (rst != S_IBX_OK) {
            return rst;
        }
		
		if (ResultStr.indexOf('회원님의 주민등록번호가 등록되어 있지 않습니다') > -1 ) {
			this.setError(E_IBX_REGNO_RESIDENTMISC);
			this.iSASInOut.Output.ErrorMessage = '회원님의 주민등록번호가 등록되어 있지 않습니다. 확인 후 다시 조회해주시기 바랍니다.';
			return E_IBX_REGNO_RESIDENTMISC;
		}
		if (ResultStr.indexOf('>예방접종내역<') < 0) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}
		if (StrGrab(ResultStr, '>예방접종내역<', '</table>', 1).indexOf('조회된 내역이 없습니다')> -1) {
			this.setError(E_IBX_USER_ACCOUNT_MISC);
			this.iSASInOut.Output.ErrorMessage = '등록된 정보가 없습니다. 확인 후 다시 조회해주시기 바랍니다.';
			return E_IBX_USER_ACCOUNT_MISC;
		}
		var csrf = StrGrab(StrGrab(StrGrab(ResultStr, 'id="VcntViewForm"', '</form>'), 'id="_csrf"', '>'), 'value="', '"');
		if (!csrf) {
			this.setError(E_IBX_SITE_INVALID + 1);
			return E_IBX_SITE_INVALID + 1;
		}

		var 예방접종목록 = [];
		var index = 1;
		var list  = StrGrab(StrGrab(ResultStr, '>예방접종내역<', '</table>'), '<tbody', '</tbody>');

		var data = '';
		var nameCheck = false;
		while (true) {
			data = StrGrab(list, '<tr', '</tr>', index++);
			if (!data) break;
			if (data.indexOf('조회된 내역이 없습니다') > -1) continue;

			if (이름) {
				// 이름 입력받은 경우 체크
				if (StrTrim(이름) != StrTrim(StrGrab(StrGrab(data, '<td', '</', 3), '>', ''))) continue;
				nameCheck = true;
			}

			if (주민등록번호) {
				if (주민등록번호 == StrReplace(StrGrab(StrGrab(data, '<td', '</', 2), '>', ''), '-', '').trim().substr(0, 7)) {
					예방접종목록.push(StrGrab(StrGrab(data, '<td', '</td>', 5), "fnGoVcntDtls('", "'"));
					break;
				} else {
					if (!이름) {
						this.setError(E_IBX_REGNO_RESIDENT_INVALID);
						return E_IBX_REGNO_RESIDENT_INVALID;
					}
				}
			} else { // 이름 미입력시 전체 조회
				예방접종목록.push(StrGrab(StrGrab(data, '<td', '</td>', 5), "fnGoVcntDtls('", "'"));
				if (이름) break;
			}
		}

		if (이름 && !nameCheck) {
			this.setError(E_IBX_P1100X_NAME_INVALID);
			return E_IBX_P1100X_NAME_INVALID;
		}
		if (예방접종목록.length == 0) {
			if (이름) {
				this.setError(E_IBX_REGNO_RESIDENT_INVALID);
				return E_IBX_REGNO_RESIDENT_INVALID;
			} else {
				this.setError(E_IBX_SITE_INVALID + 2);
				return E_IBX_SITE_INVALID + 2;
			}
		}

		var 본인예방접종내역조회 = [];
		var item = {};
		var contentType  = '{"X-CSRF-TOKEN": "' + csrf + '",';
			contentType += '"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.122 Whale/3.16.138.27 Safari/537.36",';
			contentType += '"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",';
			contentType += '"Accept": "application/json, text/javascript, */*; q=0.01",';
			contentType += '"X-Requested-With": "XMLHttpRequest",';
			contentType += '"Accept-Encoding": "gzip, deflate, br",';
			contentType += '"Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,ko;q=0.7,ja;q=0.6"}';
	
		for (var count = 0; count < 예방접종목록.length; count++) {
		
			system.setStatus(IBXSTATE_EXECUTE, 50);
						
			this.postData  = 'menuLv=3';
			this.postData += '&menuCd=321';
			this.postData += '&_csrf=' + csrf; 
			this.postData += '&patnum=' + 예방접종목록[count];
			this.postData += '&_csrf=' + csrf; 

			// 예방접종내역보기
			this.url = '/irhp/mngm/goPatVaccHist.do';
			if (httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData) == false) {
				this.setError(E_IBX_FAILTOGETPAGE);
				return E_IBX_FAILTOGETPAGE;
			}
			ResultStr = httpRequest.result;
			this.log("본인예방접종내역조회_2: [" + ResultStr + "]");

			rst = this.errorChk(ResultStr);
			if (rst != S_IBX_OK) {
				return rst;
			}

			var ResultBlock = StrGrab(ResultStr, '차수에 대한 정보</caption>', '</table>');
			if (ResultBlock == "") {
				ResultBlock = StrGrab(ResultStr, 'class="data-vaccine"', '</table>');
			}
			if (StrGrab(ResultBlock, '<tbody', '</tbody>') == "" ||
				ResultBlock.indexOf('>대상감염병<') < 0 || 
				ResultBlock.indexOf('>백신종류 및 방법<') < 0
				) {
				this.setError(E_IBX_SITE_INVALID + 4);
				return E_IBX_SITE_INVALID + 4;
			}
			ResultBlock = StrGrab(ResultBlock, '<tbody', '</tbody>');

			item = {};
			if (이름) {
				item.이름 = 이름;
			} else {
				item.이름 = StrGrab(ResultStr, '>이름</strong> : ', '</');
				if (!item.이름) { item.이름 = StrGrab(ResultStr, '>이름  : ', '</'); }
			}
				
			item.주민등록번호 = StrReplace(StrReplace(StrGrab(ResultStr, '>주민등록번호</strong> : ', '</'), '-', ''), ' ', '');
			if (!item.주민등록번호) {
				item.주민등록번호 = StrReplace(StrReplace(StrGrab(ResultStr, '>주민등록번호 : ', '</'), '-', ''), ' ', '');
			}

			if (!item.이름 || !item.주민등록번호) {
				this.log("item error : " + JSON.stringify(item));
				this.setError(E_IBX_RESULT_FAIL);
				return E_IBX_RESULT_FAIL;
			}
			
			var 예방접종내역상세 = [];
			var 상세item = {};
			var ResultData = '';
			var 대상감염병 = '';
			var dataCheck = false;
			index = 1;
			while (true) {
				ResultData = StrGrab(ResultBlock, '<tr', '</tr>', index++);
				if (!ResultData) break;

				// when class="value-disease" & class="value-vaccin" is not exist the td is empty then skip
				if ((ResultData.indexOf('<td class="value-disease"') < 0) && (ResultData.indexOf('<td class="value-vaccin"') < 0)) { continue; }

				상세item = {};
				
				if (ResultData.indexOf('<td class="value-disease') > -1) {
					상세item.대상감염병 = StrGrab(StrGrab(ResultData, '<td', '</'), '>', '');
					상세item.접종명 = StrTrim(StrGrab(StrGrab(ResultData, '<td', '</', 2), '>', ''));
				} else {
					if ((ResultData.indexOf('javascript:fnOpenPopup(') > 0) && (ResultData.indexOf('rowspan') == -1) || (ResultData.indexOf('class="value-vaccin') > 0)) { 
						상세item.대상감염병 = 대상감염병; 
						상세item.접종명 = StrTrim(StrGrab(StrGrab(ResultData, '<td', '</'), '>', ''));						
					} 
				}

				if (상세item.접종명.indexOf('<a') > -1) {
					상세item.접종명 = StrGrab(상세item.접종명, '', '<a');
				}

				상세item.접종명 = StrTrim(StrReplace(decodeHtmlEntity(상세item.접종명), '<br/>', ''));
				
				대상감염병 = 상세item.대상감염병;

				var 백신종류및방법 = [];
				var subItem = {};
				var subIndex = 3;
				var tdStr = '';
				var dgmSeq = '',
					patnum = '',
					vcncd = '',
					vcntme = '';

				dataCheck = false;
				if ((ResultData.indexOf('javascript:fnOpenPopup(') > 0) && (ResultData.indexOf('rowspan') == -1)) subIndex = 2;
				while (true) {
					// 상세팝업
					tdStr = StrGrab(ResultData, '<td', '</td>', subIndex++);
					if (!tdStr) break;
					if ((tdStr.indexOf('background:#f3f3f3;') > -1) || (tdStr.indexOf('javascript:fnOpenPopup(') < 0)) { continue; }
				
					system.setStatus(IBXSTATE_EXECUTE, 70);

					dgmSeq = StrGrab(tdStr, "javascript:fnOpenPopup('", "'");
					patnum = StrGrab(tdStr, "'", "'", 3);
					vcncd = StrGrab(tdStr, "'", "'", 5);
					vcntme = StrGrab(tdStr, "'", "'", 7);

					// required for inquiry detail result: if empty skip
					// 본인접종인경우 dgmSeq 값 없음.
					if (!patnum || !vcncd || !vcntme) { continue; }

					this.postData  = 'dgmSeq=' + dgmSeq;
					this.postData += '&patnum=' + patnum;
					this.postData += '&vcncd=' + vcncd;
					this.postData += '&vcntme=' + vcntme;

					this.url = "/irhp/getPtnInfoVcnDtl.json";
					if (httpRequest.postWithUserAgent(contentType, this.host + this.url, this.postData) == false) {
						this.setError(E_IBX_FAILTOGETPAGE);
						return E_IBX_FAILTOGETPAGE;
					}
					var detResultStr = httpRequest.result;
					this.log("본인예방접종내역조회_3: [" + detResultStr + "]");

					rst = this.errorChk(detResultStr);
					if (rst != S_IBX_OK) {
						return rst;
					}

					try {
						var detResultJson = JSON.parse(detResultStr).ptntInfoVcnDtl;
						for (var idx = 0; idx < detResultJson.length; idx++) {
							subItem = {};
							subItem.접종명 = detResultJson[idx].vcnNm; 
							subItem.접종차수 = detResultJson[idx].vcntmenam ? StrReplace(detResultJson[idx].vcntmenam, '.', '') : '';
							subItem.접종일자 = detResultJson[idx].vcndte ? StrReplace(detResultJson[idx].vcndte, '.', '') : '';
							subItem.접종기관 = detResultJson[idx].patorgnam ? detResultJson[idx].patorgnam : '';
							subItem.백신명 = detResultJson[idx].vacnam ? detResultJson[idx].vacnam : '';
							subItem.제조사 = detResultJson[idx].mannam ? detResultJson[idx].mannam : '';
							subItem.로트번호 = detResultJson[idx].lotnum ? detResultJson[idx].lotnum : '';

							if (!subItem.접종명) {
								this.setError(E_IBX_RESULT_FAIL);
								return E_IBX_RESULT_FAIL;
							}

							백신종류및방법.push(subItem);
						}
						dataCheck = true;
					} catch (e) {
						this.log("detail_json error [" + e.message + "]");
						this.setError(E_IBX_SITE_INVALID + 5);
						return E_IBX_SITE_INVALID + 5;
					}
				}

				// 백신종류및방법 array는 상세조회가능할때만 처리합니다. 
				if (!dataCheck) { // 접종한 백신이 없는 경우 접종명만 결과처리함.
					// subItem = {};
					// subItem.접종명 = StrReplace(StrGrab(StrGrab(ResultData, '<td', '<', 2), '>', ''), '&nbsp;', '');
					// if (!subItem.접종명) subItem.접종명 = StrGrab(StrGrab(ResultData, '<td', '<'), '>', '');
					// subItem.접종명 = decodeHtmlEntity(StrTrim(subItem.접종명));
					// subItem.접종차수 = '';
					// subItem.접종일자 = '';
					// subItem.접종기관 = '';
					// subItem.백신명 = '';
					// subItem.제조사 = '';
					// subItem.로트번호 = '';

					// if (!subItem.접종명) {
					// 	this.log("subItem error : " + JSON.stringify(subItem));
					// 	this.setError(E_IBX_RESULT_FAIL);
					// 	return E_IBX_RESULT_FAIL;
					// }

					// 백신종류및방법.push(subItem);
				}

				상세item.백신종류및방법 = 백신종류및방법;
				예방접종내역상세.push(상세item);
			}
			item.예방접종내역상세 = 예방접종내역상세;
			본인예방접종내역조회.push(item);
		}

		if (본인예방접종내역조회.length == 0) {
			this.setError(E_IBX_SITE_INVALID + 6);
			return E_IBX_SITE_INVALID + 6;
		}

		this.iSASInOut.Output = {};
		this.iSASInOut.Output.ErrorCode = "00000000";
		this.iSASInOut.Output.ErrorMessage = "";
		this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.본인예방접종내역조회 = 본인예방접종내역조회;

		return S_IBX_OK;
	} catch (e) {		
		this.log("exception " + e.message);		
		this.setError(E_IBX_UNKNOWN);
		return E_IBX_UNKNOWN;
	} finally {
		system.setStatus(IBXSTATE_DONE, 100);
		this.log(BankName + " 개인전자민원 본인예방접종내역조회 finally");
	}
};

개인전자민원.prototype.로그아웃 = function (aInput) {
    this.log(BankName+ " 개인전자민원 로그아웃 호출[" + moduleVersion + "][" + aInput + "]");
    try {
		if (this.bLogIn != true) {
			this.log("로그인 후 실행해주세요.");
			this.setError(E_IBX_AFTER_LOGIN_SERVICE);
			this.iSASInOut.Output.ErrorMessage = "로그인 후 실행해 주십시오.";
			return E_IBX_AFTER_LOGIN_SERVICE;
		}

        system.setStatus(IBXSTATE_CHECKPARAM, 10);

		this.url = '/irhp/goMainInfo.do';
		if (!httpRequest.getWithUserAgent(this.userAgent, this.host + this.url)) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		var ResultStr = httpRequest.result;
		this.log('goMainInfo.do :: ' + ResultStr);

		if (this.errorChk(ResultStr) != S_IBX_OK) {
            return;
        }

		var csrf = StrGrab(StrGrab(StrGrab(ResultStr, 'id="logoutForm"', '</form>'), 'name="_csrf"', '>'), 'value="', '"');
		if (!csrf) {
			this.setError(E_IBX_SITE_INVALID);
			return E_IBX_SITE_INVALID;
		}

		this.url = '/irhp/goLogout.do';
		this.postData = '_csrf=' + csrf;
		if (!httpRequest.postWithUserAgent(this.userAgent, this.host + this.url, this.postData)) {
			this.setError(E_IBX_FAILTOGETPAGE);
			return E_IBX_FAILTOGETPAGE;
		}
		ResultStr = httpRequest.result;
		this.log('goLogout.do :: ' + ResultStr);

		if (ResultStr.indexOf('>로그인</a>') < 0) {
			this.setError(E_IBX_SERVICE_LOGOUT_FAIL);
			return E_IBX_SERVICE_LOGOUT_FAIL;
		}

		this.bLogIn = false;

        // 결과 처리
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};

        return S_IBX_OK;
    } catch(e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 개인전자민원 로그아웃 finally");
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
    } catch(e) {
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