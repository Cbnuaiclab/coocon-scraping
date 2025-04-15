var BankName = "이성택 테스트";
console.log(BankName+ " 스크립트 호출됨.");


function iSASObject()
{
    console.log("iSASObject 생성자 호출");
    this.iSASInOut = {};
}
   

iSASObject.prototype.log = function (logMsg)
{
    console.log("iSASObject.Log(" + logMsg + "\")");
}

iSASObject.prototype.setError = function (errcode)
{
    this.iSASInOut.Output = {};
    this.iSASInOut.Output.ErrorCode = errcode.toString(16);
    //TODO: 에러 메시지 가져오는 부분...
    this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16));
}

iSASObject.prototype.checkError = function ()
{
    this.errorMsg = StrGrab(httpRequest.result, "\"errMsg\":\"", "\",\"");
    if(this.errorMsg != ""){
        this.log("Juryu ErrorLog [" + this.errorMsg + "]");
        return true;
    }else{
        return false;
    }
}

var 테스트 = function()
{
    //생성자
    console.log(BankName+ " 테스트 생성자 호출");
    this.errorMsg       = "";      
    this.host           = "";
    this.url            = "";
    this.param          = "";
    this.postData       = "";
	this.bLogIn = false;
}
테스트.prototype = Object.create(iSASObject.prototype);

테스트.prototype.주민등록번호제크 = function(주민등록번호){

	function AddSignValue2(data, name, value){
		if(data!="") data += "&";
		data += name;
		data += "=";
		data += value;
		return data;
	}
	var error = false;
	var data = "";
		data = AddSignValue2(data, "주민등록번호", 주민등록번호);

	var data01 = data.substring(7,13);

	var nYear = data01.substring(0,2);
	var nMondth = data01.substring(2,4);
	var nDay = data01.substring(4,6);
	
	if(data.length!=20){
		error = true;
	}

	if (isNaN(data01)){
		error = true;
	}

	if (data01.length!=6 ||  nMondth<1 || nMondth>12 || nDay<1 || nDay>31) {
		error = true;
	}
	return error;
} 

테스트.prototype.onCertLogin = function (input, password){
   
    var 주민등록번호 = input.주민등록번호;
    var certpath = input.인증서.이름;
    
    // 주민등록번호 미입력
    if(주민등록번호 == ""){
        this.setError(E_IBX_REGNO_RESIDENT_NOTENTER);
        return E_IBX_REGNO_RESIDENT_NOTENTER;
    } 
    
    // 주민등록번호 숫자 
    if(!IsCurrency(주민등록번호)){
        this.setError(E_IBX_REGNO_RESIDENT_INVALID);
        return E_IBX_REGNO_RESIDENT_INVALID;
    }
    
    if (this.주민등록번호제크(주민등록번호)){
    	this.setError(E_IBX_REGNO_RESIDENT_INVALID);
        return E_IBX_REGNO_RESIDENT_INVALID;
    }
    
    if(password == ""){
        this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
        return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
    }

    if(certpath == ""){
        this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
        return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
    }

    system.setStatus(IBXSTATE_LOGIN, 30);

    this.url  = "/myp/cybMypBasic.do";
    if(httpRequest.get(this.host + this.url) == false){
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
    }
    
    //nonce
    this.url  = "/wizvera/delfino/svc/delfino_nonce.jsp";
  
    if(httpRequest.get(this.host + this.url) == false){
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
    }

    //여기서 nonce 얻는다.
    var nonce = StrTrim(httpRequest.result);   
    
    // 로그인 시도 
    this.url  = "/hlp/cybHlpLoginResult.do";

    nonce = "login=certLogin"
          + "&delfinoNonce=" + httpRequest.URLEncodeAll(nonce, "UTF-8")
          + "&__CERT_STORE_MEDIA_TYPE=LOCAL_DISK";

    var PKCS7;
    ////////////////////////////////////////////////////////////////////////
    if( !certManager.findCert( JSON.stringify(input.인증서) ) ){
        this.log("인증서를 찾을 수 없습니다.");
        this.setError(E_IBX_CERTIFY_NOT_FOUND);
        return E_IBX_CERTIFY_NOT_FOUND;
    }else{
        this.log("인증서 찾음.");
    }

    if(!certManager.verifyPassword(password)){
        this.log("certManager.verifyPassword 실패");
        this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
        return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
    }else{
        this.log("certManager.verifyPassword 성공");
    }

    PKCS7 = certManager.SignData(nonce, password);
    var VID_RANDOM = certManager.getVidRandom(password);
    
    if(PKCS7 == ""){
        this.log("error:[" + certManager.errorMsg + "]");
        this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID);
        return E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
    }else{
        this.log("signedData:[" + PKCS7 + "]");
    }
        
    this.postData = "PKCS7SignedData=" + httpRequest.URLEncodeAll(PKCS7, "UTF-8"); 
	this.postData +='&VID_RANDOM='+  httpRequest.URLEncodeAll(VID_RANDOM, "UTF-8");
	this.postData +='&idn=' + 주민등록번호;
	
    if(httpRequest.post(this.host + this.url, this.postData) == false){
        this.setError(E_IBX_FAILTOGETPAGE);
        return E_IBX_FAILTOGETPAGE;
    }
    this.log("새마을금고 로그인 결과 :[" + httpRequest.result + "]");

    var resStr = httpRequest.result;
     
    //에러처리 
    if(resStr.indexOf("만료된 인증서입니다") >= 0){
       this.setError(E_IBX_CERTIFY_EXCEED_DATE);
       return E_IBX_CERTIFY_EXCEED_DATE;
    }
    
    if(resStr.indexOf("본인확인에 실패했습니다.") >= 0){
       this.setError(E_IBX_REGNO_RESIDENT_WRONG_USER);
       return E_IBX_REGNO_RESIDENT_WRONG_USER;
    }
    
    if(resStr.indexOf("해당 자료가 없읍니다")>0){
        this.setError(I_IBX_RESULT_NOTPRESENT);
        return I_IBX_RESULT_NOTPRESENT;
     }
   
  
    if(resStr.indexOf("로그아웃") <0)
    {
       this.setError(E_IBX_LOGIN_FAIL);
       return E_IBX_LOGIN_FAIL;
    } 
   
    return S_IBX_OK;
}

//TODO:
테스트.prototype.로그인 = function (aInput)
{
    this.log(BankName+ " 테스트 로그인 호출[" + aInput + "]");

    try{
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        var input = dec(aInput.Input);

        if(input.로그인방식 == "CERT"){
            this.log("인증서 로그인");
            var certpath = input.인증서.이름;
            var password = input.인증서.비밀번호;
            input.인증서.비밀번호 = "********";    //비밀번호 제거
            this.iSASInOut.Input.인증서.비밀번호 = '********';

            if(password == ""){
                this.setError(E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER);
                return E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
            }

            if(certpath == ""){
                this.setError(E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER);
                return E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
            }

            var rtn = this.onCertLogin(input, password);
            if(rtn != S_IBX_OK){
                return rtn;
            }

        }else{
            this.log("알수 없는 로그인 타입");
            this.setError(E_IBX_LOGIN_TYPE_ERROR);
            return E_IBX_LOGIN_TYPE_ERROR;
        }

        this.log("로그인 S_IBK_OK");
		this.bLogIn = true;

        // 결과 처리
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};

        return S_IBX_OK;
    }catch(e){
        //
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    }finally{
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 테스트 로그인 finally");
    }
}

테스트.prototype.계약내용조회 = function ()
{
	this.log(BankName+ " 계약내용조회 호출");

	try{
		if(this.bLogIn != true){
            this.log("로그인 후 실행해주세요.");
            this.errorMsg = "로그인 후 실행해 주십시오.";
            this.setError(E_IBX_LOGIN_FAIL);
            return E_IBX_LOGIN_FAIL;
		}
	
        system.setStatus(IBXSTATE_EXECUTE, 70);
       
        this.url = '/ics/cybIcsAccount.do';
        this.postData ='';
        if(httpRequest.post(this.host + this.url, this.postData) == false){
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        this.log("새마을금고 계약내용조회 결과 :[" + httpRequest.result + "]");

        var resStr = httpRequest.result;
        if(resStr.indexOf('>로그인 입력폼<')>0){
        	this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;	
        }
        
        var strtemp = StrGrab(resStr, '<tbody>', '</tbody>'); 
         
        var 보험계약내용조회 = [];
        var str_상품명, str_증권번호,str_공제기간, str_계약일자, str_만기일자, str_보험료;
        var str_납입기간, str_납입주기,str_최종납입월, str_납입횟수, str_계약상태, str_피보험자;
        var str_납입보험료, str_담당컨설턴트, str_지점명, str_해지환급금;
        var i= 0;
        while(true){
        	
        	var item = {};
        	
        	var acct = StrGrab(strtemp, '<tr>', '</tr>', ++i); 
        	if(acct.indexOf('class="view-layer"')<0){break;}
        	if(acct == ""){break;} 	
        	
        	str_상품명 = StrGrab(acct, '<td', '</td>');
        	str_상품명 = StrGrab(str_상품명, '>', '<br>', 2);
        	str_상품명 = StrTrim(str_상품명);
        	
        	str_증권번호 = StrGrab(acct, '<td', '</td>'); 
        	str_증권번호 = StrGrab(str_증권번호, '<br>', '</a>');
        	str_증권번호 = StrReplace(str_증권번호, '-', '');
        	str_증권번호 = StrTrim(str_증권번호);	
        	
        	str_공제기간 = StrGrab(acct, '<td', '</td>',3); 
        	
        	str_계약일자 = StrGrab(str_공제기간, '>', '~');
        	str_계약일자 = StrReplace(str_계약일자, '.', '');
        	str_계약일자 = StrTrim(str_계약일자);	
        	
        	str_만기일자 = StrGrab(str_공제기간, '~', '');
        	str_만기일자 = StrReplace(str_만기일자, '.', '');
        	str_만기일자 = StrTrim(str_만기일자);	
        	
        	str_보험료 = StrGrab(acct, '<td', '</td>',4); 
        	str_보험료 = StrGrab(str_보험료, '>', '');
        	str_보험료 = StrReplace(str_보험료, ',', '');
        	str_보험료 = StrReplace(str_보험료, '원', '');
        	str_보험료 = StrTrim(str_보험료);	
        	
        	str_계약상태 = StrGrab(acct, '<td', '/td>',7); 
        	str_계약상태 = StrGrab(str_계약상태, '">', '<');
        	str_계약상태 = StrTrim(str_계약상태);	
        	
        	this.url = '/ics/cybIcsBasicInfo.do';
            this.postData ='searchVal=search&prdtMaidNo=' + str_증권번호 ;
            if(httpRequest.post(this.host + this.url, this.postData) == false){
                 this.setError(E_IBX_FAILTOGETPAGE);
                 return E_IBX_FAILTOGETPAGE;
            }
            this.log("새마을금고 계약내용조회 결과 :[" + httpRequest.result + "]");
             
            var resStr_block = httpRequest.result;
          
            str_납입기간 = StrGrab(resStr_block, '>납입기간<', '</td>'); 
            str_납입기간 = StrGrab(str_납입기간, '<td>', ''); 
            str_납입기간 = StrTrim(str_납입기간);
            
            str_납입주기 = StrGrab(resStr_block, '>납입방법<', '</td>'); 
            str_납입주기 = StrGrab(str_납입주기, '<td>', ''); 
            str_납입주기 = StrTrim(str_납입주기);
            
            str_최종납입월 = StrGrab(resStr_block, '>최종납입년월<', '</td>'); 
            str_최종납입월 = StrGrab(str_최종납입월, '<td>', ''); 
            str_최종납입월 = StrReplace(str_최종납입월, '.', '');
            str_최종납입월 = StrTrim(str_최종납입월);
            
            str_납입횟수 = StrGrab(resStr_block, '>납입회차<', '</td>');
            str_납입횟수 = StrGrab(str_납입횟수, '<td>', '/'); 
            str_납입횟수 = StrTrim(str_납입횟수);	
            	 
            str_피보험자 = StrGrab(resStr_block, '>피공제자<', '</td>'); 
            str_피보험자 = StrGrab(str_피보험자, '<strong>', '<'); 
            str_피보험자 = StrTrim(str_피보험자);
            
            str_납입보험료 = StrGrab(resStr_block, '>총납입공제료<', '</td>');
            str_납입보험료 = StrGrab(str_납입보험료, '<span>', '<'); 
            str_납입보험료 = StrReplace(str_납입보험료, ',', '');
            str_납입보험료 = StrReplace(str_납입보험료, '원', '');
            str_납입보험료 = StrTrim(str_납입보험료);
            
            str_담당컨설턴트 = StrGrab(resStr_block, '>이름<', '</td>');
            str_담당컨설턴트 = StrGrab(str_담당컨설턴트, '<td>', ''); 
            str_담당컨설턴트 = StrTrim(str_담당컨설턴트);
            
            str_지점명 = StrGrab(resStr_block, '>지점<', '</td>');
            str_지점명 = StrGrab(str_지점명, '<td>', ''); 
            str_지점명 = StrTrim(str_지점명); 
            if(str_증권번호 != ""){
	            this.url = '/ics/cybIcsSurrender.do';
	            this.postData = 'pagecode=L0223&reqcode=&productName=';
	            if(httpRequest.post(this.host + this.url, this.postData) == false){
	                 this.setError(E_IBX_FAILTOGETPAGE);
	                 return E_IBX_FAILTOGETPAGE;
	            }
	            this.log("새마을금고 계약내용조회 결과 :[" + httpRequest.result + "]");
	             
	            var resblock = httpRequest.result;
	            var tempblock = StrGrab(resblock, '<tbody', '</tbody>'); 
	            var str_증권번호_1, str_상품명_1; 
	            var k = 0;
	            while(true){
	            	var str_buf = StrGrab(tempblock, '<tr', '</tr>', ++k);
	            	if(tempblock.indexOf('class="view-layer"')<0){break;}
	            	if (str_buf == ""){break;}
	            	
	            	this.log("#### stLee 계약내역_html=>"+str_buf);
	            	
	            	str_증권번호_1 = StrGrab(str_buf, '<td', '</td>');
	            	str_증권번호_1 = StrGrab(str_증권번호_1, '<br />', '');
	            	str_증권번호_1 = StrReplace(str_증권번호_1, '-', '');
	            	str_증권번호_1 = StrTrim(str_증권번호_1); 
	            	
	            	str_상품명_1 = StrGrab(str_buf, '<td', '</td>');
	            	str_상품명_1 = StrGrab(str_상품명_1, '">', '<br');
	            	str_상품명_1 = StrTrim(str_상품명_1);
	            	
	            	
	            	str_해지환급금 = StrGrab(str_buf, '<td', '</td>', 6);
	            	str_해지환급금 = StrGrab(str_해지환급금, '<span>', '<');
	            	str_해지환급금 = StrReplace(str_해지환급금, ',', '');
	            	str_해지환급금 = StrReplace(str_해지환급금, '원', '');
	            	str_해지환급금 = StrTrim(str_해지환급금); 
	            	
	            	if (str_증권번호_1 == str_증권번호 && str_상품명_1 == str_상품명){break;}
	            }
            }
            
            item.증권번호 = str_증권번호; 
            item.상품명 = str_상품명;  
            item.계약일자 = str_계약일자;
            item.만기일자 = str_만기일자; 
             
            item.납입기간 = str_납입기간; 
            item.납입주기 = str_납입주기;  
            item.최종납입월 = str_최종납입월;
            item.납입횟수 = str_납입횟수; 
            
            item.잔여횟수 = '';           
            item.계약상태 = str_계약상태; 
            item.피보험자 = str_피보험자; 
            
            item.종피보험자 = '';  
            item.계약금액 = '';
            item.보험료 = str_보험료; 
            item.납입보험료 = str_납입보험료;
            
            item.해지환급금 = str_해지환급금;
            
            item.이체일자 = '';  
            item.예금주 = '';
            item.은행명 = '';  
            item.계좌번호 = '';
            item.보험계약대출가능금액 = '';  
            item.정상대출이율 = '';
            item.기대출금액 = ''; 
            
            item.담당컨설턴트 = str_담당컨설턴트;
            item.지점명 = str_지점명; 
            
            item.휴대폰번호 = '';
            
            보험계약내용조회.push(item);   
        }
       
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.보험계약내용조회 = 보험계약내용조회;

	}catch(e){
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
	}
	finally{
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 계약내용조회  finally");
	}
}

테스트.prototype.가입특약사항조회 = function (aInput)
{
	this.log(BankName+ " 가입특약사항조회 호출");

	try{
		if(this.bLogIn != true){
            this.log("로그인 후 실행해주세요.");
            this.errorMsg = "로그인 후 실행해 주십시오.";
            this.setError(E_IBX_LOGIN_FAIL);
            return E_IBX_LOGIN_FAIL;
		}
		
		var input = dec(aInput.Input);
		var 증권번호 = input.증권번호;
		    증권번호 = StrTrim(증권번호);
		var 상품명 = input.상품명;
		    상품명 = StrTrim(상품명);
		var 피보험자 = input.피보험자;
		    피보험자 = StrTrim(피보험자);
		    
		if(증권번호 == ""){
		    this.setError(E_IBX_I10101_INSURANCE_NO_NOTENTER); 
		    return E_IBX_I10101_INSURANCE_NO_NOTENTER;
		}
		
		if(상품명 == ""){
	        this.setError(E_IBX_I10101_INSURANCE_NAME_NOTENTER); 
	        return E_IBX_I10101_INSURANCE_NAME_NOTENTER;
    	}
		
		if(피보험자 == ""){
	        this.setError(E_IBX_I10101_INSURED_NOTENTER); 
	        return E_IBX_I10101_INSURED_NOTENTER;
	    }
		
	    if(!IsCurrency(증권번호)){
	        this.setError(E_IBX_I10101_INSURANCE_INFO_INVALID); 
	        return E_IBX_I10101_INSURANCE_INFO_INVALID;
	    }
		
        system.setStatus(IBXSTATE_EXECUTE, 70);
       
        //사이버창구 > 계약내용조회 > 가입내용조회 
        this.url = '/ics/cybIcsAccount.do';
        
        this.postData ='';
        if(httpRequest.post(this.host + this.url, this.postData) == false){
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        this.log("새마을금고 가입특약사항조회 결과 :[" + httpRequest.result + "]");

        var resStr = httpRequest.result;
       
        if(resStr.indexOf('>로그인 입력폼<')>0){
        	this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;	
        }
        
        var strtemp = StrGrab(resStr, '<tbody>', '</tbody>'); 
        var str_피보험자, str_상품명, str_증권번호;
        var i= 0;
       
        while(true){
        	
        	var acct = StrGrab(strtemp, '<tr>', '</tr>', ++i); 
        	if(acct == ""){break;} 
        	
        	str_상품명 = StrGrab(acct, '<td', '</td>');
        	str_상품명 = StrGrab(str_상품명, '>', '<br>', 2);
        	str_상품명 = StrTrim(str_상품명);
        	
        	str_증권번호 = StrGrab(acct, '<td', '</td>'); 
        	str_증권번호 = StrGrab(str_증권번호, '<br>', '</a>');
        	str_증권번호 = StrReplace(str_증권번호, '-', '');
        	str_증권번호 = StrTrim(str_증권번호);
            
        	str_피보험자 = StrGrab(acct, '<td', '</td>', 2);
        	str_피보험자 = StrGrab(str_피보험자, '>', '');
        	str_피보험자 = StrTrim(str_피보험자);
        	
        	if (str_상품명 == 상품명 && str_증권번호 == 증권번호 && str_피보험자 == 피보험자){break;}	
        }
        if(acct == ""){
        	this.setError(E_IBX_I10101_INSURANCE_INFO_INVALID); 
 	        return E_IBX_I10101_INSURANCE_INFO_INVALID;
        }
        
        // 가입내용조회 > 가입내역
        this.url = '/ics/cybIcsRegHistory.do';
        this.postData ='searchVal=search&prdtMaidNo=' + 증권번호 ;
        if(httpRequest.post(this.host + this.url, this.postData) == false){
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        this.log("새마을금고 가입특약사항조회 결과 :[" + httpRequest.result + "]");
        
        var resStr = httpRequest.result;
        var strblock = StrGrab(resStr, '<tbody>', '</tbody>');
        var 가입특약사항 = [];
        var j = 0;
        while(true){
        
        	var item= {};
        	resBuf = StrGrab(strblock, '<tr', '</tr>', ++j);
        	if(resBuf == ""){break;} 
        	
        	item.주보험및특약명 = StrGrab(resBuf, '<th', '</th>');
        	item.주보험및특약명 = StrGrab(item.주보험및특약명, '>', '');
        	item.주보험및특약명 = StrTrim(item.주보험및특약명);

        	item.가입금액 = StrGrab(resBuf, '<td>', '</td>');
        	item.가입금액 = StrReplace(item.가입금액, ' ', '');
        	item.가입금액 = StrReplace(item.가입금액, '원', '');
        	item.가입금액 = StrReplace(item.가입금액, '만', '0000');
        	item.가입금액 = StrTrim(item.가입금액);

        	item.보험료 = StrGrab(resBuf, '<td>', '</td>', 4);
        	item.보험료 = StrReplace(item.보험료, '원', '');
        	item.보험료 = StrReplace(item.보험료, ',', '');
        	item.보험료 = StrTrim(item.보험료);

        	item.보험기간 = StrGrab(resBuf, '<td>', '</td>', 2);
        	item.보험기간 = StrTrim(item.보험기간);

        	item.납입기간 = StrGrab(resBuf, '<td>', '</td>', 3);
        	item.납입기간 = StrTrim(item.납입기간);
        	
        	가입특약사항.push(item);
        }
        
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.가입특약사항 = 가입특약사항;

	}catch(e){
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
	}
	finally{
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 테스트  finally");
	}

}

테스트.prototype.보장내용조회 = function (aInput)
{
	this.log(BankName+ " 보장내용조회 호출");

	try{
		if(this.bLogIn != true){
            this.log("로그인 후 실행해주세요.");
            this.errorMsg = "로그인 후 실행해 주십시오.";
            this.setError(E_IBX_LOGIN_FAIL);
            return E_IBX_LOGIN_FAIL;
		}
		var input = dec(aInput.Input);
		var 증권번호 = input.증권번호;
		    증권번호 = StrTrim(증권번호);
		var 상품명 = input.상품명;
		    상품명 = StrTrim(상품명);
		var 피보험자 = input.피보험자;
		    피보험자 = StrTrim(피보험자);
		
		if(증권번호 == ""){
		        this.setError(E_IBX_I10101_INSURANCE_NO_NOTENTER); 
		        return E_IBX_I10101_INSURANCE_NO_NOTENTER;
		}
		
		if(상품명 == ""){
	        this.setError(E_IBX_I10101_INSURANCE_NAME_NOTENTER); 
	        return E_IBX_I10101_INSURANCE_NAME_NOTENTER;
    	}
		
		if(피보험자 == ""){
	        this.setError(E_IBX_I10101_INSURED_NOTENTER); 
	        return E_IBX_I10101_INSURED_NOTENTER;
	    }
		
	    if(!IsCurrency(증권번호)){
	        this.setError(E_IBX_I10101_INSURANCE_INFO_INVALID); 
	        return E_IBX_I10101_INSURANCE_INFO_INVALID;
	    }
		
        system.setStatus(IBXSTATE_EXECUTE, 70);
        
        //보험간편서비스 > 계약사항조회 > 상세조회
        this.url = '/ics/cybIcsAccount.do';
        
        this.postData ='';
        if(httpRequest.post(this.host + this.url, this.postData) == false){
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        this.log("새마을금고 보장내용조회 결과 :[" + httpRequest.result + "]");

        var resStr = httpRequest.result;
        if(resStr.indexOf('>로그인 입력폼<')>0){
        	this.setError(E_IBX_SESSION_CLOSED);
            return E_IBX_SESSION_CLOSED;	
        }
        
        var strtemp = StrGrab(resStr, '<tbody>', '</tbody>'); 
        var str_피보험자, str_상품명, str_증권번호;
        var i= 0;
       
        while(true){
        	
        	var acct = StrGrab(strtemp, '<tr>', '</tr>', ++i); 
        	if(acct == ""){break;} 
        	
        	str_상품명 = StrGrab(acct, '<td', '</td>');
        	str_상품명 = StrGrab(str_상품명, '>', '<br>', 2);
        	str_상품명 = StrTrim(str_상품명);
        	
        	str_증권번호 = StrGrab(acct, '<td', '</td>'); 
        	str_증권번호 = StrGrab(str_증권번호, '<br>', '</a>');
        	str_증권번호 = StrReplace(str_증권번호, '-', '');
        	str_증권번호 = StrTrim(str_증권번호);
            
        	str_피보험자 = StrGrab(acct, '<td', '</td>', 2);
        	str_피보험자 = StrGrab(str_피보험자, '>', '');
        	str_피보험자 = StrTrim(str_피보험자);
        	
        	if (str_상품명 == 상품명 && str_증권번호 == 증권번호 && str_피보험자 == 피보험자){break;}	
        }
        if(acct == ""){
        	this.setError(E_IBX_I10101_INSURANCE_INFO_INVALID); 
 	        return E_IBX_I10101_INSURANCE_INFO_INVALID;
        }
        
        //상세조회 > 보장내용
        this.url = '/ics/cybIcsGuaranteesEntry.do';
        this.postData ='searchVal=search&prdtMaidNo='+증권번호;
        if(httpRequest.post(this.host + this.url, this.postData) == false){
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        this.log("새마을금고 보장내용조회 결과 :[" + httpRequest.result + "]");
        
        var resStr = httpRequest.result;
        var strblock = StrGrab(resStr, '<div class="box-clause1">', '</div>');
        strblock = StrReplace(strblock, '\n', '');
        strblock = StrReplace(strblock, '\t', '');
        strblock = strblock.replace(/\"/g, '\'');
      
        var 보장내용 = [];
        보장내용.push(strblock);
      
        
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};
		this.iSASInOut.Output.Result.보장내용 = 보장내용;

	}catch(e){
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
	}
	finally{
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 보장내용조회  finally");
	}
}

테스트.prototype.로그아웃 = function (aInput)
{
    this.log(BankName+ " 테스트 로그아웃 호출[" + aInput + "]");

    try{
        system.setStatus(IBXSTATE_CHECKPARAM, 10);

        this.url  = "/logout.do";
        if(httpRequest.get(this.host + this.url) == false){
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }

        this.bLogIn = false;

        // 결과 처리
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = {};

        return S_IBX_OK;
    }catch(e){
        //
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    }finally{
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 테스트 로그아웃 finally");
    }
}


테스트.prototype.공통함수 = function (aInput)
{
    this.log(BankName+ " 테스트 공통합수 호출[" + aInput + "]");
    
    var dvcid = cf_getdvcid(aInput);
    //this.log("#### stLee dvcid["+dvcid+"]");
    
    try{
        system.setStatus(IBXSTATE_CHECKPARAM, 10);
        
        /*
        var str1 = undefined;
        var str2 = null;
        this.log("## null, undefined 공백처리 및 대체문자 치환  ["+cf_null2void(str1)+"]["+cf_null2void(str2, "aaa")+"]");
        
        var str3 = "aaBBccDDeeFF";
        this.log("## cf_strReplace ["+str3+"]["+cf_strReplace(cf_strReplace(str3, "BB", "bb"), "FF", "ff")+"]");
        */
        //this.log("#### stLee ["+Base64._utf8_encode("<title>º¸Ce°e¾a´eAa ½AA≫ - Step1.A¶E¸</title>")+"]")
        
        var inqType     = "블랙박스";
        var arcTrmStrDt = "20180426";
        var purdateVal  = "2013";
        var amtVal      = "100";
        var result = cf_currentPrice(inqType, arcTrmStrDt, purdateVal, amtVal);
        this.log("#### 부속품 현재가 ["+result+"]");
        
        return S_IBX_OK;
    }catch(e){
        //
        this.log("exception " + e.message);
    }finally{
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName+ " 테스트 공통합수 finally");
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
//include 등등 필요한거 설정.
function OnInit()
{
    console.log("OnInit()");
    var result;
    try{
        //필요한거 로드
        system.include("iSASTypes");
        //system.include("common/depreciation");
        system.include("common/common");
        system.setStatus(IBXSTATE_BEGIN, 0);
        result = S_IBX_OK;
    }catch(e){
        result = E_IBX_UNKNOWN;
        console.log("Exception OnInit:[" + e.message + "]");
    }finally{
        return result;
    }
}


function Execute(aInput) {
    console.log("Execute[" + aInput + "]");
    try {
        var res = OnInit();
        if (Failed(res)) {
            //초기화 오류나면 빠져나감.
            return res;
        }
        
        iSASObj = cf_excute(aInput);
        
    } catch (e) {
        console.log("exception:[" + e.message + "]");
    } finally {
        return iSASObj;
    }
}