console.log("load xmlhttprequest.js !!!");

var XMLHttpRequest = XMLHttpRequest || function() 
{
	this.readyState = 0;//property 
	this.status = 0;
	this.response ="";
	this.responseText ="";
	this.responseType = "";
	this.responseURL ="";
	this.responseXML = "";
	this.status = 0;
	this.statusText ="";
	this.timeout =0;
	this.upload ="";
	this.withCredentials = false;
	
	
	this.method = "GET";
	this.url = "";
	this.async = false;
	this.username = "";
	this.password = "";


	this.DONE =0 ;
	this.HEADERS_RECEIVED = 0 ;
	this.LOADING = 0 ;
	this.OPENED = 0 ;
	this.UNSENT = 0 ;
}

//console.log("load xmlhttprequest2 :[" + XMLHttpRequest + "]");

try{
	//Method
	XMLHttpRequest.prototype.abort = function(){
		//이미 전송된 요청을 중지합니다.
		var msg="juryu CALL::XMLHttpRequest.prototype.abort\n";
		console.log(msg); 
	}


	XMLHttpRequest.prototype.getAllResponseHeaders = function(){
		//모든 응답 헤더를 CRLF (en-US) 로 구분한 문자열로 반환합니다. 응답을 받지 않은 경우 null 입니다.
		var msg="juryu CALL::XMLHttpRequest.prototype.getAllResponseHeaders";
		console.log(msg); 
		return null;
	}

	XMLHttpRequest.prototype.getResponseHeader = function(name){
		//지정한 헤더의 텍스트를 갖는 문자열을 반환합니다. 응답을 아직 받지 못했거나 응답에 헤더가 존재하지 않을 경우 null 입니다.
		var msg="juryu CALL::XMLHttpRequest.prototype.getResponseHeader(" + name + ")\n"; 
		console.log(msg); 
		return null;
	}

	XMLHttpRequest.prototype.open = function(method, url, async, username, password){
		
		console.log("juryu CALL::XMLHttpRequest Function open::");
/*
		console.log("method: "+method);
		console.log("url: "+url);
		console.log("async: "+async);
		console.log("username: "+username);
		console.log("password: "+password);
*/
		
		this.method = method;
		this.url = url;
		this.async = async;
		this.username = username;
		this.password = password;
		
		//요청을 초기화합니다. 이 메소드는 네이티브 코드로부터의 요청을 초기화하기 위해 JavaScript 코드에 의해 사용됩니다. 대신 openRequest() 를 사용하세요.
		//N/A
		var msg="juryu CALL::XMLHttpRequest.prototype.open\\n\\";
		console.log(msg); 
	}

	XMLHttpRequest.prototype.overrideMimeType = function(mime){
		//서버에의해 반환된 MIME 타입을 오버라이드합니다.
		var msg="juryu CALL::XMLHttpRequest.prototype.overrideMimeType(" + mime + ")\\n\\"; 
		console.log(msg); 
	}

	XMLHttpRequest.prototype.send = function(body){
		console.log("CALL !! XMLHttpRequest.prototype.send = function(body)");
		if(this.url.indexOf("/TSPD/") < 0) return;
		setTimeout(this.dosend(body), 1);
	}

	XMLHttpRequest.prototype.dosend = function(body){
		//요청을 보냅니다. 요청이 비동기인 경우(기본값), 이 메소드는 요청이 보내진 즉시 반환합니다.
		//N/A
		var msg="juryu CALL::XMLHttpRequest.prototype.send::[" + this.url + "](" + body + ")\\n\\";
		console.log(msg); 

        if(this.url.indexOf("/TSPD/") < 0) return;
            // ---------------------------
        this.host = "https://ibank.agribank.com.vn";
	    
        console.log("this.host: "+this.host);
        console.log("url: " + this.url);
        console.log("This is agribank_test");
        console.log("this.aCookie1[: "+ httpRequest.getCookie() + "]");
        console.log("this.aCookie2[: "+ document.cookie + "]");

        this.header = {};
        this.header["sec-ch-ua-mobile"] = "?0";
        this.header["User-Agent"]       = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36";
        this.header["Accept"]           = "*/*";
        this.header["Sec-Fetch-Site"] = "same-origin";
        this.header["Sec-Fetch-Mode"] = "cors";
        this.header["Sec-Fetch-Dest"] = "empty";
        this.header["Referer"] = "https://ibank.agribank.com.vn/ibank/index.jsp";
        this.header["Accept-Encoding"] = "gzip, deflate, br";
        this.header["Accept-Language"] = "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7";
        this.header["Connection"] = "keepalive";
        //this.header["Cookie"] = httpRequest.getCookie() + '; ' + document.cookie;
        this.header["Cookie"] = document.cookie;

        this.header = JSON.stringify(this.header);

        console.log("userAgent: " + this.header)

		if(this.url.indexOf("/TSPD/")>-1){
			if (!httpRequest.getWithUserAgent(this.header, this.host + this.url)) {
				console.log("Fail to XMLHttpRequest!: " + this.host + this.url)
				console.log(httpRequest.result);
				return E_IBX_FAILTOGETPAGE;
			}
		}
		
		console.log("XMLHttpRequest.prototype.send")
		console.log("XMLHttpRequest.prototype.send method: "+this.method)
		console.log("XMLHttpRequest.prototype.send url: "+this.url)
		console.log("XMLHttpRequest.prototype.send async: "+this.async)
		console.log("XMLHttpRequest.prototype.send user: "+this.username)
		console.log("XMLHttpRequest.prototype.send pass: "+this.password)

		console.log('Done! Status[' + httpRequest.getStatusCode() + '] result:[' + httpRequest.result + ']');
		this.responseText = httpRequest.result;
		//this.responseText = "200818f51a14071800095c3aa5803b6a6e8bd25da63978a49594424662edd4900af80008cd8da4b6ab200037aa99743bad07400690016099b65c355e0810e88283f98f9a3b162328455b2f086e14917008c800759f1b80fb1fb0164bb1b1bd6017405d82a2ca9203b49902f485c4415c548ec7e5212dcf006448a951375fcee8c81a046e9b8b45ac1ab595788d55816248f6fc919689d9ec5f47987ae583fd987a20c71c8cfae5d5b2c5d829a768895b980f2f7a81096fd18511aba252601aea4a71bc594e53a702bead61970e3a722c297032d54ff201d11278f46bd27baff894c1491743f5660a526cfe6fd3ba3b4558f2408d28dc0d3f57730f777792a02c921ed16eb9672484fbb852ad7875a941c22c450d093d6141d29d6e";
		this.readyState = 4;
		console.log("XMLHttpRequest.prototype.this.onreadystatechange:[" + this.onreadystatechange + "]");
		
		if(this.onreadystatechange){
			console.log("CALL!! XMLHttpRequest.prototype.this.onreadystatechange");
			this.onreadystatechange();
		}
	}

	XMLHttpRequest.prototype.setRequestHeader = function(name, value){
		//HTTP 요청 헤더의 값을 설정합니다. open() 후, send() 전에 setRequestHeader() 를 호출해야합니다.
		var msg="juryu CALL::XMLHttpRequest.prototype.setRequestHeader([" + name + "], [" + value + ")\\n\\";
		console.log(msg); 
	}

	XMLHttpRequest.prototype.setonreadystatechange = function(value){
		var msg="juryu CALL::XMLHttpRequest.prototype.setonreadystatechange([" + value + "])";
		console.log(msg); 

		this.doreadystatechange = value;
	}

	XMLHttpRequest.prototype.getonreadystatechange = function(){
		var msg="juryu CALL::XMLHttpRequest.prototype.getonreadystatechange()";
		console.log(msg); 

		return this.doreadystatechange;
	}

	XMLHttpRequest.prototype.GetResult = function(){
		return this.resultStr;
	}

	//Property
	//readyState 어트리뷰트가 변경될때마다 호출되는 event handler 입니다.
	Object.defineProperties(XMLHttpRequest, {
		"onreadystatechange": { get: function(){ console.log("XMLHttpRequest::onreadystatechange::getter");	return this.getonreadystatechange(); } },
							    set: function(value){ console.log("XMLHttpRequest::onreadystatechange::setter");	this.setonreadystatechange(value); }
	});

	Object.defineProperties(XMLHttpRequest, { 
			"readyState": {get: function(){ /*요청의 상태를 unsigned short 로 반환합니다.*/ return 4; } }
	});

	//응답 엔티티 바디를 갖는하는 XMLHttpRequest.responseType (en-US) 의 값에 따라 ArrayBuffer, Blob, Document, JavaScript 객체, 또는 DOMString 을 반환합니다.
	Object.defineProperties(XMLHttpRequest, {
		"response": { get: function () { return this.GetResult(); } }
	});

	//요청에 대한 응답을 텍스트로 갖는 DOMString 을 반환합니다. 요청이 성공하지 못했거나 아직 전송되지 않았을 경우 null 을 반환합니다.
	Object.defineProperties(XMLHttpRequest, {
		"responseText": { get: function () { return this.GetResult(); } }
	});

	//XMLHttpRequest.responseType (en-US)
	//응답 타입을 정의하는 열거형 값입니다.

	//XMLHttpRequest.responseURL (en-US) Read only
	//응답의 연속된 URL 을 반환합니다. URL 이 null 인 경우 빈 문자열을 반환합니다.

	//XMLHttpRequest.responseXML (en-US) Read only
	//요청에 대한 응답을 갖는 Document 를 반환합니다. 요청이 성공하지 못했거나, 아직 전송되지 않았거나, XML 또는 HTML 로 파싱할 수 없는 경우 null 을 반환합니다. workers 에서는 사용이 불가합니다.

	//요청의 응답 상태를 갖는 unsigned short 를 반환합니다.
	Object.defineProperties(XMLHttpRequest, {
		"status": { get: function () { return 200; } }
	});

	//HTTP 서버에 의해 반환된 응답 문자열을 갖는 DOMString 을 반환합니다. XMLHTTPRequest.status (en-US) 와는 다르게, 응답 메시지의 전체 텍스트를 갖습니다(예, "200 OK").
	//노트: HTTP/2 명세(8.1.2.4 Response Pseudo-Header Fields)에 따르면, HTTP/2 는 HTTP/1.1 상태 라인에 포함된 버전이나 원인 문구를 전달하는 방법을 정의하지 않습니다.
	Object.defineProperties(XMLHttpRequest, {
		"statusText": { get: function () { return "200 OK"; } }
	});

	//XMLHttpRequest.timeout
	//요청이 자동으로 종료될때까지 걸린 시간을 밀리초 단위로 나타내는 unsigned long 입니다.
	//XMLHttpRequestEventTarget.ontimeout
	//요청 시간 초과때마다 호출되는 event handler 입니다.
	//XMLHttpRequest.upload Read only
	//업로드 과정을 나타내는 XMLHttpRequestUpload 입니다.
	//XMLHttpRequest.withCredentials (en-US)
	//사이트 간 Access-Control 요청이 쿠키나 인증 헤더와 같은 자격 증명을 사용해야하는지 여부를 나타내는 Boolean 입니다.
}catch(e){
	var msg="exception while XMLHttpRequest script:\\n\\t" + e.message + "\\n" + e.stack; 
	console.log(msg); 
	//throw Error(msg);
}


/*
class XMLHttpRequest{
   
    constructor(name){//  생성자

        this.readyState = 0;//property 
        this.status = 0;
        this.response ="";
        this.responseText ="";
        this.responseType = "";
        this.responseURL ="";
        this.responseXML = "";
        this.status = 0;
        this.statusText ="";
        this.timeout =0;
        this.upload ="";
        this.withCredentials = false;


        this.DONE =0 ;
        this.HEADERS_RECEIVED = 0 ;
        this.LOADING = 0 ;
        this.OPENED = 0 ;
        this.UNSENT = 0 ;

    }

    onerror(test, ev) {

    }
    onload(test, ev){

    }
    onloadend(test, ev){

    }
    onloadstart(test, ev){

    }
    onprogress(test, ev){}
    ontimeout(test, ev){}
    
    onreadystatechange(req, ev){
        console.log("jjw XMLHttpRequest Function onreadystatechange")
        return "";
    }

    abort(){
        console.log("jjw XMLHttpRequest Function abort")

    }
    getAllResponseHeaders(){
        console.log("jjw XMLHttpRequest Function getAllResponseHeaders")
        return "string";
    }
    getResponseHeader(name){
        console.log("jjw XMLHttpRequest Function getResponseHeader")
        return "string";

    }
    open(method, url, async, username, password){
        console.log("jjw XMLHttpRequest Function open")
        console.log("method: "+method);
        console.log("url: "+url);
        console.log("async: "+async);
        console.log("username: "+username);
        console.log("password: "+password);
        

    }
    //**
    // * Acts as if the `Content-Type` header value for response is mime. (It does not actually change the header though.)
    // *
    // * Throws an "InvalidStateError" DOMException if state is loading or done.
    // * /
    overrideMimeType(mime){
        console.log("jjw XMLHttpRequest Function overrideMimeType")

    }
    //**
    // * Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
    // *
    // * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
    // * /
    send(body){
        console.log("jjw XMLHttpRequest Function send")
        console.log("body: "+body)

    }
    //**
    // * Combines a header in author request headers.
    // *
    // * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
    // *
    // * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
    // * /
    setRequestHeader(name, value){
        console.log("jjw XMLHttpRequest Function setRequestHeader")

    }
    addEventListener(param1,param2,param3 ){
        console.log("jjw XMLHttpRequest Function addEventListener")

    }
    removeEventListener(param1,param2,param3){
        console.log("jjw XMLHttpRequest Function removeEventListener")

    }
    dispatchEvent(event){
        console.log("jjw XMLHttpRequest Function dispatchEvent")

    }
}
*/