var CommonName = "commom.js";
console.log(CommonName + " 스크립트 호출됨.");
var CommonVersion = '2025.2.19.1';
console.log('Version: ' + CommonVersion);

/* common error code */

// successful
//S_IBX_OK                                   = 0x00000000;  // 성공
//S_IBX_TRANS_JUDGE_SUCCESS                  = 0x00000001;  // 이체심사 승인 완료
//S_IBX_TRANS_JUDGE_REFUSE                   = 0x00000002;  // 이체심사 거절 완료


// information code
//I_IBX_NOMORENEXTPAGE                       = 0x41110000;  // 다음페이지 없음(내부처리용)
//I_IBX_NOMOREPREVPAGE                       = 0x41120000;  // 이전 페이지 없음(내부처리용)
//I_IBX_DEPENDNEXTRESULT                     = 0x41130000;  // 다음 결과에 의존적인 처리 필요(내부처리용)

/**
 *  입력값이 NULL인지 체크
 */
cf_isNull = function(input) {
    if ($(input).val() == null || $(input).val().replace(/ /g, "") == "") {
        return true;
    }
    return false;
};

/**
 * @param str 
 * @param oldPattern 
 * @param newPattern
 */
cf_strReplace = function(str, oldPattern, newPattern) {
    return StrReplace(cf_null2void(str), cf_null2void(oldPattern), cf_null2void(newPattern));
};

/**
 *  문자열에서 좌우 공백제거
 */
cf_strTrim = function(str) {
    return StrTrim(cf_null2void(str));
};

/**
 * null이나 undefined 일경우 공백으로 응답 한다.
 * @param str 원문 
 * @returns {String} str
 */
cf_null2void = function(str, replacement) {
    if (str == null || str == undefined || str == "null" || str == "undefined") {
        if (replacement != null && replacement != undefined) {
            str = replacement;
        } else {
            str = "";
        }
    }
    return str;
};

/**
 * 입력값이 특정 문자(chars)만으로 되어있는지 체크
 * 특정 문자만 허용하려 할 때 사용
 * ex) if (!hasCharsOnly(form.blood,"ABO")) {
 *         alert("혈액형 필드에는 A,B,O 문자만 사용할 수 있습니다.");
 *     }
 */
cf_hasCharsOnly = function(str, chars) {
    for (var inx = 0; inx < str.length; inx++) {
        if (chars.indexOf(str.charAt(inx)) == -1)
            return false;
    }
    return true;
};

/**
 *  입력값에 숫자만 있는지 체크
 *  (번호 입력란 체크.
 *   금액입력란은 isNumComma를 사용해야 합니다.)
 */
cf_isNumber = function(str) {
    str = cf_strTrim(cf_null2void(str));
    if (str.length == 0) return false;
    var chars = "0123456789";
    return cf_hasCharsOnly(str, chars);
};


/**
 *  입력값이 숫자,콤마(,)로 되어있는지 체크
 *  (금액 입력란 체크)
 */
cf_isNumComma = function(str) {
    if (cf_strTrim(cf_null2void(str)).length == 0) return false;
    var chars = ",0123456789";
    if (!cf_hasCharsOnly(str, chars)) {
        return false;
    } else {
        return true;
    }
};


/**
 *  특수문자 여부 확인
 */
cf_isPeculChar = function(str) {
    var chars = cf_strTrim(str);
    if (chars.length == 0) {
        return true;
    } else {
        for (i = 0; i < chars.length; i++) {
            var a = chars.charCodeAt(i);
            if ((a > 32 && a < 48) || (a > 57 && a < 65) || (a > 90 && a < 97))
                return false;
        }
        return true;
    }
};

/**
 *  한글 포함 여부 확인
 */
cf_isHangul = function(str) {
    if (cf_strTrim(cf_null2void(str)).length == 0) return false;
    str = cf_null2void(str);
    for (var idx = 0; idx < str.length; idx++) {
        var c = escape(str.charAt(idx));
        if (c.indexOf("%u") == -1) {
            return false;
        }
    }
    return true;
};


/**
 * 외국인주민등록번호 체크
 */
cf_isValidFgnNo = function(arg) {
    var sum = 0;
    var odd = 0;
    var buf = new Array(13);

    for (i = 0; i < 13; i++) {
        buf[i] = parseInt(arg.charAt(i));
    }

    odd = buf[7] * 10 + buf[8];
    if (odd % 2 != 0) {
        return false;
    }

    if ((buf[11] != 6) && (buf[11] != 7) && (buf[11] != 8) && (buf[11] != 9)) {
        return false;
    }

    var multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    for (i = 0, sum = 0; i < 12; i++) {
        sum += (buf[i] *= multipliers[i]);
    }

    sum = 11 - (sum % 11);
    if (sum >= 10) {
        sum -= 10;
    }
    sum += 2;
    if (sum >= 10) {
        sum -= 10;
    }
    if (sum != buf[12]) {
        return false;
    } else {
        return true;
    }
};

/**
 *  조회 시작일과 종료일이 최근 n개월 안에 있는지 체크
 *  (2002.06.18)
 */
cf_isInRecentMonth = function(f_yy, f_mm, f_dd, t_yy, t_mm, t_dd, sys_date, term) {
    var t_date = new Date();
    var f_date = new Date();
    var s_date = new Date();
    var p_date = new Date();

    f_date.setYear(f_yy.options[f_yy.selectedIndex].value);
    f_date.setMonth(f_mm.options[f_mm.selectedIndex].value);
    f_date.setDate(f_dd.options[f_dd.selectedIndex].value);

    t_date.setYear(t_yy.options[t_yy.selectedIndex].value);
    t_date.setMonth(t_mm.options[t_mm.selectedIndex].value);
    t_date.setDate(t_dd.options[t_dd.selectedIndex].value);

    s_date.setYear(sys_date.substring(0, 4));
    s_date.setMonth(sys_date.substring(4, 6));
    s_date.setDate(sys_date.substring(6, 8));

    p_date.setYear(sys_date.substring(0, 4));
    p_date.setMonth(sys_date.substring(4, 6));
    p_date.setDate(sys_date.substring(6, 8));

    if (term == 0) {
        return false;
    }

    p_date.setMonth(p_date.getMonth() - term);

    var day = 1000 * 3600 * 24; //24시간

    var s_day_int1 = parseInt((s_date - f_date) / day, 10);
    alert(parseInt((s_date - f_date), 10));
    var s_day_int2 = parseInt((s_date - t_date) / day, 10);

    var p_day_int1 = parseInt((f_date - p_date) / day, 10);
    var p_day_int2 = parseInt((t_date - p_date) / day, 10);

    if ((p_day_int1 < 0) || (p_day_int2 < 0)) {
        return false;
    } else if ((s_day_int1 < 0) || (s_day_int2 < 0)) {
        return false;
    } else {
        return true;
    }
};

/**
 * 오늘이 무슨 요일이야?
 * ex) alert('오늘은 ' + getDayOfWeek() + '요일입니다.');
 */
cf_getDayOfWeek = function() {
    var now = new Date();
    var day = now.getDay(); //일요일=0,월요일=1,...,토요일=6
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    return week[day];
};


/**
 * 특정날짜의 요일을 구한다.
 */
cf_getDayOfWeek = function(time) {
    var now = toTimeObject(time);
    var day = now.getDay(); //일요일=0,월요일=1,...,토요일=6
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    return week[day];
};

/**
 *  반자를 전자로 변환
 */
cf_parseFull = function(HalfVal) {
    var FullChar = [
        "　", "！", "＂", "＃", "＄", "％", "＆", "＇", "（", //33~
        "）", "＊", "＋", "，", "－", "．", "／", "０", "１", "２", //41~
        "３", "４", "５", "６", "７", "８", "９", "：", "；", "＜", //51~
        "＝", "＞", "？", "＠", "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", //61~
        "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ", "Ｐ", //71~
        "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", //81~
        "［", "￦", "］", "＾", "＿", "｀", "Ａ", "Ｂ", "Ｃ", "Ｄ", //91~
        "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", //101~
        "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", //111~
        "Ｙ", "Ｚ", "｛", "｜", "｝", "～" //121~
    ];
    var stFinal = "";
    var ascii;
    for (i = 0; i < HalfVal.length; i++) {
        ascii = HalfVal.charCodeAt(i);
        if ((31 < ascii && ascii < 128)) {
            stFinal += FullChar[ascii - 32];
        } else {
            stFinal += HalfVal.charAt(i);
        }
    }
    return stFinal;
};

/**
 *  전자를 반자로 변환
 */
cf_parseHalf = function(FullVal) {
    var HalfChar = [
        " ", "!", "\"", "#", "$", "%", "&", "'", "(",
        ")", "*", "+", ",", "-", ".", "/", "0", "1", "2",
        "3", "4", "5", "6", "7", "8", "9", ":", ";", "<",
        "=", ">", "?", "@", "A", "B", "C", "D", "E", "F",
        "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
        "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d",
        "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
        "y", "z", "{", "|", "}", "~"
    ];
    var stFinal = "";
    var ascii;

    for (var i = 0; i < FullVal.length; i++) {
        ascii = FullVal.charCodeAt(i);
        if (65280 < ascii && ascii < 65375) {
            stFinal += HalfChar[ascii - 65280];
        } else if (12288 == ascii) {
            stFinal += HalfChar[ascii - 12288];
        } else if (65510 == ascii) {
            stFinal += HalfChar[60];
        } else {
            stFinal += FullVal.charAt(i);
        }
    }
    return stFinal;
};

/**
 *  e-mail체크
 */
cf_isEmailValid = function(str) {
    var email = str;
    var t = escape(email);
    if (t.match(/^(\w+)@(\w+)[.](\w+)$/ig) == null && t.match(/^(\w+)@(\w+)[.](\w+)[.](\w+)$/ig) == null) {
        return false;
    } else {
        return true;
    }
};


/**
 * 입력값이 사용자가 정의한 포맷 형식인지 체크
 * 자세한 format 형식은 자바스크립트의 'regular expression'을 참조
 */
cf_isValidFormat = function(str, format) {
    if (cf_strTrim(cf_null2void(str)).length == 0) return false;
    if (str.search(format) != -1) {
        return true; //올바른 포맷 형식
    }
    return false;
};


/**
 *  입력값이 숫자,dot(.)로 되어있는지 체크
 *  (금액 입력란 체크)
 */
cf_isNumDot = function(str) {
    var chars = ".0123456789";
    return cf_hasCharsOnly(str, chars);
};


/**
 *  입력값이 숫자,콤마(,)로 되어있는지 체크
 *  (금액 입력란 체크)
 */
cf_isNumXComma = function(str) {
    var chars = ",0123456789";
    if (!cf_hasCharsOnly(str, chars)) {
        return false;
    } else {
        return true;
    }
};

/**
 * 특정 길이만큼 문자열 자르기
 * @param str : 원본문자열
 * @param limit : 자를길이
 * @return : 특정길이만큼 자른 문자열+"..."
 */
cf_cutStr = function(str, limit) {
    var tmpStr = str;
    var byte_count = 0;
    var len = str.length;
    var dot = "";
    for (i = 0; i < len; i++) {
        byte_count += chr_byte(str.charAt(i));
        if (byte_count == limit - 1) {
            if (chr_byte(str.charAt(i + 1)) == 2) {
                tmpStr = str.substring(0, i + 1);
                dot = "...";
            } else {
                if (i + 2 != len) dot = "...";
                tmpStr = str.substring(0, i + 2);
            }
            break;
        } else if (byte_count == limit) {
            if (i + 1 != len) dot = "...";
            tmpStr = str.substring(0, i + 1);
            break;
        }
    }
    return tmpStr + dot;
};

/**
 * String문자 데이트형식으로 변경 뒤 리턴
 * arg : 8자리 날짜 값
 * @return Date
 */
cf_makeStrToDate = function(arg) {
    var argDate = arg.replace(/\/*\-*/gi, "");
    if (argDate.length == 8) {
        var yy = argDate.substr(0, 4);
        var mm = argDate.substr(4, 2);
        var dd = argDate.substr(6, 2);
        var make_date = new Date(yy + "/" + mm + "/" + dd);
        return make_date;
    } else {
        return argDate;
    }
};

/**
 *  오늘날짜만 구하기 
 */
cf_getToDay = function() {
    var currentTime = new Date();
    var year = currentTime.getFullYear() + "";
    var month = currentTime.getMonth() + 1 + "";
    var day = currentTime.getDate() + "";
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return year + month + day;
};

/**
 * 모든 특수문자 제거
 */
cf_getSpecialCharDel = function(str) {
    var strRtn = cf_null2void(str);
    return strRtn.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "");
};

/**
 * Object형을 string으로 변환하여 반환
 * @param obj
 * @returns
 */
cf_getString = function(obj) {
    var str = cf_null2void(obj);
    if (str == "") {
        return str;
    } else {
        return JSON.stringify("" + obj);

    }
};

/**
 * padString 인수로 길이 padLength만큼 str인수에 왼쪽 패딩하여 필요한만큼 반복한다
 * @param str
 * @param padLength
 * @param padString
 * @returns
 */
cf_lpad = function(str, padLength, padString) {
    if (cf_isNumber(cf_null2void(padLength))) {
        while (cf_strTrim(cf_null2void(str)).length < padLength) {
            str = cf_null2void(padString) + str;
        }
    }
    return str;
};

/**
 * padString 인수로 길이 padLength만큼 str인수에 오른쪽 패딩하여 필요한만큼 반복한다
 * @param str
 * @param padLength
 * @param padString
 * @returns
 */
cf_rpad = function(str, padLength, padString) {
    if (cf_isNumber(cf_null2void(padLength))) {
        while (cf_strTrim(cf_null2void(str)).length < padLength) {
            str += cf_null2void(padString);
        }
    }
    return str;
};

/**
 * type 금액자리수에 맞게 str인수에 "0"을 붙여준다.
 * @param str
 * @param type
 * @returns
 */
cf_getMoney = function(str, type) {
    if (cf_isNumber(cf_null2void(str))) {
        if (cf_null2void(type) == "천원") {
            str = cf_rpad(str, 4, "0");
        } else if (cf_null2void(type) == "만원") {
            str = cf_rpad(str, 5, "0");
        } else if (cf_null2void(type) == "십만원") {
            str = cf_rpad(str, 6, "0");
        } else if (cf_null2void(type) == "백만원") {
            str = cf_rpad(str, 7, "0");
        } else if (cf_null2void(type) == "천만원") {
            str = cf_rpad(str, 8, "0");
        } else if (cf_null2void(type) == "억원") {
            str = cf_rpad(str, 9, "0");
        } else {
            str = str;
        }
    }
    return str;
};

/**
 * type 금액에 따라 "0"을 붙여준다
 * @param str
 * @param type
 */
cf_appendZero = function(str, type) {

    if (cf_isNumber(cf_null2void(str))) {
        if (cf_null2void(type) == "천원") {
            str = cf_null2void(str) + "000";
        } else if (cf_null2void(type) == "만원") {
            str = cf_null2void(str) + "0000";
        } else if (cf_null2void(type) == "십만원") {
            str = cf_null2void(str) + "00000";
        } else if (cf_null2void(type) == "백만원") {
            str = cf_null2void(str) + "000000";
        } else if (cf_null2void(type) == "천만원") {
            str = cf_null2void(str) + "0000000";
        } else if (cf_null2void(type) == "억원") {
            str = cf_null2void(str) + "00000000";
        } else {
            str = str;
        }
    }
    return str;
};



/**
 * input의 job 유효성체크
 * @deprecated
 * @param aInput
 * @param aJobObj
 */
cf_excute = function(aInput) {
    try {
        iSASObj = JSON.parse(aInput);
        var errCode;
        var ClassName = iSASObj.Class;
        var ModuleName = iSASObj.Module;

        if (Failed(SetClassName(ClassName, ModuleName))) {
            iSASObj = setError(iSASObj, I_IBX_RESULT_MIXED_ALL);
        } else {
            obj.iSASInOut = "";
            OnExcute(0, JSON.stringify(iSASObj));
            console.log("####결과 테스트 [" + JSON.stringify(obj.iSASInOut) + "]");
            if (obj.iSASInOut != "")
                iSASObj = obj.iSASInOut;
        }
    } catch (e) {
        console.log("cf_excute exception:[" + e.message + "]");
    } finally {
        return JSON.stringify(iSASObj);
    }
};

/**
 * input값을 암호화한 dvcid 값을 반환한다.
 * @param aInput
 * @returns
 */
cf_getdvcid = function(aInput) {
    var str_dvc_id = "";
    try {
        str_dvc_id = logManager.dvcID;
    } catch (e) {
        console.log("cf_getdvcid exception:[" + e.message + "]");
    } finally {
        return cf_null2void(str_dvc_id);
    }
};

/**
 * input값을 인코딩하며 특수문자(,:;/=?&) 추가로 인코딩한다
 * 공백이 + 특수문자로 인코딩 될경우 %20으로 변환하여 준다.
 * @param aInput
 */
cf_encodeURIComponent = function(aInput) {
    var rtn = "";
    try {
        aInput = cf_null2void(aInput);
        aInput = aInput.replace(/\r?\n|\r|\t|-/g, "");
        rtn = encodeURIComponent(aInput).replace(/\+/g, '%20'); //  + 특수문자 처리
    } catch (e) {
        console.log("cf_encodeURIComponent exception:[" + e.message + "]");
    } finally {
        return rtn;
    }
};

/**
 * 한국 만나이 구하기
 * @param birth : 생년월일(YYYYMMDD)
 * @returns age
 */
cf_calcAge = function(birth) {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var age = "";

    var day = date.getDate();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    var monthDay = '' + month + day ; //add ''/ when month,day increase from 10

    try {

        birth = cf_strReplace(birth, '-', '');
        var birthdayy = birth.substr(0, 4);
        var birthdaymd = birth.substr(4, 4);
        age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
    } catch (e) {
        console.log("cf_calcAge exception:[" + e.message + "]");
    } finally {
        return age;
    }
};


/**
 * 부속품 감가상각한 현재가 구하기
 * @param inqType : 구분 "블랙박스", "네비게이션", "선루프", "알루미늄휠", "후방카메라", "기타부속품",  
 * @param arcTrmStrDt : 시작보험기간(YYYYMMDD)
 * @param purdateVal : 장착년월(YYYY)
 * @param amtVal : 구입가격
 * @returns priceObj : 감가상각금액
 * 
 */
cf_currentPrice = function(inqType, arcTrmStrDt, purdateVal, amtVal) {

    var depreciation = new Depreciation();
    if (cf_null2void(depreciation.getRule('etc')) == "") {
        depreciation.init();
    }

    // 블랙박스 감가상각
    //var arcTrmStrDt = $("#arcTrmStrDt").val().trim(); // 보험기간시작일자
    //var purdateVal; // 장치구입년월
    //var amtVal;     // 장치구입가
    var priceObj = ""; // 장치현재가
    var lowest = depreciation.getRule("etc"); // 감가상각 최저금액 룰

    try {
        if (inqType.indexOf("블랙박스") > -1) {
            lowest = depreciation.getRule('blackbox');
        } else {
            lowest = depreciation.getRule('etc');
        }

        purdateVal = purdateVal + "01";

        // 보험시작년월과 장착년월이 같으면 가입금액 그대로.
        if (purdateVal == arcTrmStrDt.substring(0, 6)) {
            result = amtVal;
        }

        var mm = depreciation.numberOfMonths(purdateVal, arcTrmStrDt);
        var rate = depreciation.calculate("", mm - 1);

        if (rate == undefined) {
            return;
        }
        var calcAmt = (amtVal * (rate / 100)) + "";

        //감가상각 최저금액 룰에 따른 계산
        lowest = depreciation.getRule('etc');
        if (Number(calcAmt) < Number(lowest)) {
            calcAmt = lowest;
            priceObj = calcAmt;
        } else {
            priceObj = calcAmt.substring(0, calcAmt.indexOf("."));
        }
    } catch (e) {
        console.log("cf_currentPrice exception:[" + e.message + "]");
    } finally {
        return priceObj;
    }

};

/**
 * 자동차보험 장착 부속품 감가상각 룰
 */
function Depreciation() {
    var k_data = []; //국내차량 승용/승합/화물, 외제차량 승합/화물 감가상각 테이블
    var f_data = []; //외제차량 승용 감가상각 테이블
    var mtcc_data = [];    //이륜차 감가상각 테이블
    //    var g_data = [];  //감가상각 최저금액
    var rule = {};
    /* ================ constant definitions ================ */

    /* ================ variable definitions ================ */

    /* ================ execution codes ================ */
    console.log('depreciation created.');

    init();

    /* ================ assign functions ================ */
    this.calculate = calculate;
    this.calculateFdata = calculateFdata;
    this.calculateMtcc = calculateMtcc;
    this.numberOfMonths = numberOfMonths;
    this.getRule = getRule;
    /* ================ function definitions ================ */
    function init() {
        load();
    }

    /**
     * 감가상각율 loading
     */
    function load() {
        //국내차량 승용/승합/화물, 외제차량 승합/화물 감가상각율 loading
        // 1년
        k_data.push("100.00");
        k_data.push("98.73");
        k_data.push("97.47");
        k_data.push("96.24");
        k_data.push("95.01");
        k_data.push("93.80");
        k_data.push("92.61");
        k_data.push("91.43");
        k_data.push("90.27");
        k_data.push("89.13");
        k_data.push("87.99");
        k_data.push("86.87");
        //2년
        k_data.push("85.77");
        k_data.push("84.68");
        k_data.push("83.60");
        k_data.push("82.54");
        k_data.push("81.49");
        k_data.push("80.46");
        k_data.push("79.43");
        k_data.push("78.42");
        k_data.push("77.43");
        k_data.push("76.44");
        k_data.push("75.47");
        k_data.push("74.51");

        k_data.push("73.56");
        k_data.push("72.63");
        k_data.push("71.71");
        k_data.push("70.79");
        k_data.push("69.89");
        k_data.push("69.01");
        k_data.push("68.13");
        k_data.push("67.26");
        k_data.push("66.41");
        k_data.push("65.56");
        k_data.push("64.73");
        k_data.push("63.91");

        k_data.push("63.10");
        k_data.push("62.29");
        k_data.push("61.50");
        k_data.push("60.72");
        k_data.push("59.95");
        k_data.push("59.19");
        k_data.push("58.43");
        k_data.push("57.69");
        k_data.push("56.96");
        k_data.push("56.23");
        k_data.push("55.52");
        k_data.push("54.81");

        k_data.push("54.12");
        k_data.push("53.43");
        k_data.push("52.75");
        k_data.push("52.08");
        k_data.push("51.42");
        k_data.push("50.76");
        k_data.push("50.12");
        k_data.push("49.48");
        k_data.push("48.85");
        k_data.push("48.23");
        k_data.push("47.67");
        k_data.push("47.01");

        k_data.push("46.42");
        k_data.push("45.83");
        k_data.push("45.24");
        k_data.push("44.67");
        k_data.push("44.10");
        k_data.push("43.54");
        k_data.push("42.99");
        k_data.push("42.44");
        k_data.push("41.90");
        k_data.push("41.37");
        k_data.push("40.84");
        k_data.push("40.32");

        k_data.push("39.81");
        k_data.push("39.30");
        k_data.push("38.81");
        k_data.push("38.31");
        k_data.push("37.82");
        k_data.push("37.34");
        k_data.push("36.87");
        k_data.push("36.40");
        k_data.push("35.94");
        k_data.push("35.48");
        k_data.push("35.03");
        k_data.push("34.59");

        k_data.push("34.15");
        k_data.push("33.71");
        k_data.push("33.28");
        k_data.push("32.86");
        k_data.push("32.44");
        k_data.push("32.03");
        k_data.push("31.62");
        k_data.push("31.22");
        k_data.push("30.82");
        k_data.push("30.43");
        k_data.push("30.05");
        k_data.push("29.66");

        k_data.push("29.29");
        k_data.push("28.91");
        k_data.push("28.55");
        k_data.push("28.18");
        k_data.push("27.83");
        k_data.push("27.47");
        k_data.push("27.12");
        k_data.push("26.78");
        k_data.push("26.44");
        k_data.push("26.10");
        k_data.push("25.77");
        k_data.push("25.44");

        k_data.push("25.12");
        k_data.push("24.80");
        k_data.push("24.48");
        k_data.push("24.17");
        k_data.push("23.87");
        k_data.push("23.56");
        k_data.push("23.26");
        k_data.push("22.97");
        k_data.push("22.68");
        k_data.push("22.39");
        k_data.push("22.10");
        k_data.push("21.82");

        k_data.push("21.54");
        k_data.push("21.27");
        k_data.push("21.00");
        k_data.push("20.73");
        k_data.push("20.47");
        k_data.push("20.21");
        k_data.push("19.95");
        k_data.push("19.70");
        k_data.push("19.45");
        k_data.push("19.20");
        k_data.push("18.96");
        k_data.push("18.72");

        k_data.push("18.48");
        k_data.push("18.24");
        k_data.push("18.01");
        k_data.push("17.78");
        k_data.push("17.56");
        k_data.push("17.33");
        k_data.push("17.11");
        k_data.push("16.90");
        k_data.push("16.68");
        k_data.push("16.47");
        k_data.push("16.26");
        k_data.push("16.05");

        k_data.push("15.85");
        k_data.push("15.65");
        k_data.push("15.45");
        k_data.push("15.25");
        k_data.push("15.06");
        k_data.push("14.87");
        k_data.push("14.68");
        k_data.push("14.49");
        k_data.push("14.31");
        k_data.push("14.13");
        k_data.push("13.95");
        k_data.push("13.77");

        k_data.push("13.59");
        k_data.push("13.42");
        k_data.push("13.25");
        k_data.push("13.08");
        k_data.push("12.92");
        k_data.push("12.75");
        k_data.push("12.59");
        k_data.push("12.43");
        k_data.push("12.27");
        k_data.push("12.12");
        k_data.push("11.96");
        k_data.push("11.81");

        k_data.push("11.66");
        k_data.push("11.51");
        k_data.push("11.36");
        k_data.push("11.22");
        k_data.push("11.08");
        k_data.push("10.94");
        k_data.push("10.80");
        k_data.push("10.66");
        k_data.push("10.53");
        k_data.push("10.39");
        k_data.push("10.26");
        k_data.push("10.13");

        k_data.push("10.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");
        k_data.push("0.00");

        //외제차량 승용 감가상각율 loading
        f_data.push("100.00");
        f_data.push("98.36");
        f_data.push("96.75");
        f_data.push("95.16");
        f_data.push("93.60");
        f_data.push("92.06");
        f_data.push("90.55");
        f_data.push("89.07");
        f_data.push("87.61");
        f_data.push("86.17");
        f_data.push("84.76");
        f_data.push("83.37");

        f_data.push("82.00");
        f_data.push("80.49");
        f_data.push("79.01");
        f_data.push("77.55");
        f_data.push("76.12");
        f_data.push("74.72");
        f_data.push("73.34");
        f_data.push("71.99");
        f_data.push("70.67");
        f_data.push("69.36");
        f_data.push("68.09");
        f_data.push("66.83");

        f_data.push("65.60");
        f_data.push("64.35");
        f_data.push("63.13");
        f_data.push("61.93");
        f_data.push("60.75");
        f_data.push("59.59");
        f_data.push("58.46");
        f_data.push("57.34");
        f_data.push("56.25");
        f_data.push("55.18");
        f_data.push("54.13");
        f_data.push("53.10");

        f_data.push("52.09");
        f_data.push("51.42");
        f_data.push("50.77");
        f_data.push("50.12");
        f_data.push("49.48");
        f_data.push("48.85");
        f_data.push("48.22");
        f_data.push("47.61");
        f_data.push("47.00");
        f_data.push("46.40");
        f_data.push("45.80");
        f_data.push("45.22");

        f_data.push("44.64");
        f_data.push("44.07");
        f_data.push("43.51");
        f_data.push("42.95");
        f_data.push("42.40");
        f_data.push("41.86");
        f_data.push("41.33");
        f_data.push("40.80");
        f_data.push("40.28");
        f_data.push("39.76");
        f_data.push("39.26");
        f_data.push("38.75");

        f_data.push("38.26");
        f_data.push("37.77");
        f_data.push("37.29");
        f_data.push("36.81");
        f_data.push("36.34");
        f_data.push("35.88");
        f_data.push("35.42");
        f_data.push("34.97");
        f_data.push("34.52");
        f_data.push("34.08");
        f_data.push("33.64");
        f_data.push("33.21");

        f_data.push("32.79");
        f_data.push("32.37");
        f_data.push("31.96");
        f_data.push("31.55");
        f_data.push("31.15");
        f_data.push("30.75");
        f_data.push("30.35");
        f_data.push("29.97");
        f_data.push("29.58");
        f_data.push("29.21");
        f_data.push("28.83");
        f_data.push("28.46");

        f_data.push("28.10");
        f_data.push("27.74");
        f_data.push("27.39");
        f_data.push("27.04");
        f_data.push("26.69");
        f_data.push("26.35");
        f_data.push("26.01");
        f_data.push("25.68");
        f_data.push("25.35");
        f_data.push("25.03");
        f_data.push("24.71");
        f_data.push("24.39");

        f_data.push("24.08");
        f_data.push("23.77");
        f_data.push("23.47");
        f_data.push("23.17");
        f_data.push("22.87");
        f_data.push("22.58");
        f_data.push("22.29");
        f_data.push("22.01");
        f_data.push("21.73");
        f_data.push("21.45");
        f_data.push("21.18");
        f_data.push("20.91");

        f_data.push("20.64");
        f_data.push("20.38");
        f_data.push("20.11");
        f_data.push("19.86");
        f_data.push("19.60");
        f_data.push("19.35");
        f_data.push("19.10");
        f_data.push("18.86");
        f_data.push("18.62");
        f_data.push("18.38");
        f_data.push("18.14");
        f_data.push("17.91");

        f_data.push("17.68");
        f_data.push("17.45");
        f_data.push("17.23");
        f_data.push("17.01");
        f_data.push("16.79");
        f_data.push("16.58");
        f_data.push("16.37");
        f_data.push("16.16");
        f_data.push("15.95");
        f_data.push("15.75");
        f_data.push("15.55");
        f_data.push("15.35");

        f_data.push("15.15");
        f_data.push("14.96");
        f_data.push("14.76");
        f_data.push("14.58");
        f_data.push("14.39");
        f_data.push("14.20");
        f_data.push("14.02");
        f_data.push("13.84");
        f_data.push("13.67");
        f_data.push("13.49");
        f_data.push("13.32");
        f_data.push("13.15");

        f_data.push("12.98");
        f_data.push("12.81");
        f_data.push("12.65");
        f_data.push("12.49");
        f_data.push("12.33");
        f_data.push("12.17");
        f_data.push("12.01");
        f_data.push("11.86");
        f_data.push("11.71");
        f_data.push("11.56");
        f_data.push("11.41");
        f_data.push("11.26");

        f_data.push("11.12");
        f_data.push("10.98");
        f_data.push("10.84");
        f_data.push("10.70");
        f_data.push("10.56");
        f_data.push("10.43");
        f_data.push("10.29");
        f_data.push("10.16");
        f_data.push("10.03");
        f_data.push("9.90");
        f_data.push("9.78");
        f_data.push("9.65");

        f_data.push("9.53");
        f_data.push("9.41");
        f_data.push("9.29");
        f_data.push("9.17");
        f_data.push("9.05");
        f_data.push("8.94");
        f_data.push("8.82");
        f_data.push("8.71");
        f_data.push("8.60");
        f_data.push("8.49");
        f_data.push("8.38");
        f_data.push("8.28");

        f_data.push("8.17");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");
        f_data.push("0.00");


        //이륜차 감가상각 테이블
        //1년
        mtcc_data.push("100.00");
        mtcc_data.push("96.85");
        mtcc_data.push("93.80");
        mtcc_data.push("90.85");
        mtcc_data.push("87.99");
        mtcc_data.push("85.22");
        mtcc_data.push("82.54");
        mtcc_data.push("79.94");
        mtcc_data.push("77.43");
        mtcc_data.push("74.99");
        mtcc_data.push("72.63");
        mtcc_data.push("70.34");

        //2년
        mtcc_data.push("68.13");
        mtcc_data.push("65.98");
        mtcc_data.push("63.91");
        mtcc_data.push("61.90");
        mtcc_data.push("59.95");
        mtcc_data.push("58.06");
        mtcc_data.push("56.23");
        mtcc_data.push("54.46");
        mtcc_data.push("52.75");
        mtcc_data.push("51.09");
        mtcc_data.push("49.48");
        mtcc_data.push("47.92");

        //3년
        mtcc_data.push("46.42");
        mtcc_data.push("44.95");
        mtcc_data.push("43.54");
        mtcc_data.push("42.17");
        mtcc_data.push("40.84");
        mtcc_data.push("39.56");
        mtcc_data.push("38.31");
        mtcc_data.push("37.11");
        mtcc_data.push("35.94");
        mtcc_data.push("34.81");
        mtcc_data.push("33.71");
        mtcc_data.push("32.65");

        //3년
        mtcc_data.push("31.62");
        mtcc_data.push("30.63");
        mtcc_data.push("29.66");
        mtcc_data.push("28.73");
        mtcc_data.push("27.83");
        mtcc_data.push("26.95");
        mtcc_data.push("26.10");
        mtcc_data.push("25.28");
        mtcc_data.push("24.48");
        mtcc_data.push("23.71");
        mtcc_data.push("22.97");
        mtcc_data.push("22.24");

        //4년
        mtcc_data.push("21.55");
        mtcc_data.push("20.87");
        mtcc_data.push("20.21");
        mtcc_data.push("19.57");
        mtcc_data.push("18.96");
        mtcc_data.push("18.36");
        mtcc_data.push("17.78");
        mtcc_data.push("17.22");
        mtcc_data.push("16.68");
        mtcc_data.push("16.16");
        mtcc_data.push("15.65");
        mtcc_data.push("15.15");

        //5년
        mtcc_data.push("14.68");
        mtcc_data.push("14.22");
        mtcc_data.push("13.77");
        mtcc_data.push("13.34");
        mtcc_data.push("12.92");
        mtcc_data.push("12.51");
        mtcc_data.push("12.12");
        mtcc_data.push("11.73");
        mtcc_data.push("11.36");
        mtcc_data.push("11.01");
        mtcc_data.push("10.66");
        mtcc_data.push("10.32");

        mtcc_data.push("10.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");
        mtcc_data.push("0.00");


        //감가상각 최저금액 룰 loading
        rule.abs = '5';
        rule.auto = '10';
        rule.mogen = '10';
        //rule.gps = '20';
        rule.blackbox = '2';
        rule.etc = '1';
    }

    function getRule(typ) {
        console.log("typ = " + rule[typ]);
        return rule[typ];
    }

    function calculate(typ, mm) {
        console.log("rate = " + k_data[mm]);

        if (k_data[mm]) {
            return k_data[mm];
        } else {
            return "0.00";
        }
    }

    function calculateFdata(mm) {
        console.log("rate = " + f_data[mm]);

        if (f_data[mm]) {
            return f_data[mm];
        } else {
            return "0.00";
        }
    }

    function calculateMtcc(mm){
        console.log("rate = " + mtcc_data[mm]);

        if(mtcc_data[mm]) {
            return mtcc_data[mm];
        }
        else {
            return "0.00";
        }
    }

    function numberOfMonths(startDate, endDate) {
        startYear = startDate.substring(0, 4);
        endYear = endDate.substring(0, 4);
        startMM = startDate.substring(4, 6);
        endMM = endDate.substring(4, 6);

        return (endYear - startYear) * 12 + (endMM - startMM) + 1;
    }
}

/**
 * 다이렉트자동차보험료 조회 input parameter 검증 함수
 * 보안키패드 복호화는 호출하는 함수에서 처리하고 해당 함수 호출
 * @param obj_org_input
 * @returns Object
 */
cf_carInsrnReqParamChk = function(job, obj_org_input) {
    var input = obj_org_input;
    try {
        if (job == "간편자동차보험료조회" || job == "test") {
            input.Input = cf_directMycarReqRaramChk(input);
            if(input.Input.error_code != S_IBX_OK) {
                return input;
            } else {
                var module = cf_strTrim(input.Module);
                input.Input.error_code = "";
                input.Input = cf_directCarInsrnReqParamChk(input);
            }
        } else if(job == "소유차량조회") {
            input.Input = cf_directMycarReqRaramChk(input);
        }
    } catch (e) {
        console.log("cf_carInsrnReqParamChk Exception : [" + e.message + "]");
    }
    return input;
};

/**
 * 간편자동차보험료조회 요청 input 유효성 검증
 * @param obj_org_input
 * @returns Object
 */
cf_directCarInsrnReqParamChk = function(obj_org_input) {
    
    var input = obj_org_input;
    input.error_code = "00000000";
    var 조회구분 = cf_strTrim(input.조회구분);
    var 차량번호 = cf_strTrim(input.차량번호);
    var 차대번호 = cf_strTrim(input.차대번호);
    var 시작보험기간 = cf_strTrim(input.시작보험기간);
    var 종료보험기간 = cf_strTrim(input.종료보험기간);
    var 생년월일 = cf_strTrim(input.생년월일);
    var 대물배상 = cf_strTrim(input.대물배상);
    var 무보험상해 = cf_strTrim(input.무보험상해);
    var 물적사고할증기준금액 = cf_strTrim(input.물적사고할증기준금액);
    var 긴급출동서비스 = cf_strTrim(input.긴급출동서비스);
    var 자가차량손해 = cf_strTrim(input.자가차량손해);
    var 연간주행거리 = cf_strTrim(input.연간주행거리);
    var 자기신체손해1 = cf_strTrim(input.자기신체손해1);
    var 자기신체손해2 = cf_strTrim(input.자기신체손해2);

    if (!input.차량정보) {
        input.error_code = E_IBX_OWNER_CAR_INFO_NOTENTER;
        return input;
    }
    var 차량코드 = cf_strTrim(input.차량정보.차량코드);
    var 차량종류 = cf_strTrim(input.차량정보.차량종류);
    var 등록년도 = cf_strReplace(cf_strReplace(cf_strTrim(input.차량정보.등록년도), "A", ""), "B", "");
    if (!cf_isNumber(등록년도)) {
        input.error_code = E_IBX_OWNER_CAR_INFO_INVALID;
        return input;
    }
    
    var 제조사 = cf_strTrim(input.차량정보.제조사);
    var 차명 = cf_strTrim(input.차량정보.차명);
    var 세부차명 = cf_strTrim(input.차량정보.세부차명);
    var 세부옵션 = cf_strTrim(input.차량정보.세부옵션);
    var 운전자한정 = cf_strTrim(input.운전자한정);
    var 증권이메일수령특약가입여부 = cf_strTrim(input.증권이메일수령특약가입여부);
    var 마일리지특약가입여부 = cf_strTrim(input.마일리지특약가입여부);
    var 블랙박스특약가입여부 = cf_strTrim(input.블랙박스특약가입여부);
    var 부속품장착여부 = cf_strTrim(input.부속품장착여부);
    var 자녀특약가입여부 = cf_strTrim(input.자녀특약가입여부);

    // 용도구분
    if (!input.조회구분) {
        input.error_code = E_IBX_P00XXX_PAY_TYPE_NOENTER;
        return input;
    }

    // 시작보험기간
    if (!input.시작보험기간) {
        input.error_code = E_IBX_CAR_INS_DATE_BEGIN_NOTENTER;
        return input;
    }
    if (!cf_isNumber(input.시작보험기간) || input.시작보험기간.length != 8 || !cf_isValidDate(input.시작보험기간) || (input.시작보험기간 < js_yyyy_mm_dd()) ) {
        input.error_code = E_IBX_CAR_INS_DATE_BEGIN_INVALID;
        return input;
    }
    // 종료보험기간
    if (!input.종료보험기간) {
        input.error_code = E_IBX_CAR_INS_DATE_END_NOTENTER;
        return input;
    }
    var chkStDt = (parseInt(input.시작보험기간.substr(0, 4)) + 1) + input.시작보험기간.substr(4, 4);

    if (!cf_isNumber(input.종료보험기간) || input.종료보험기간.length != 8 || !cf_isValidDate(input.종료보험기간) ||(input.종료보험기간 <= input.시작보험기간) || chkStDt != input.종료보험기간) {
        input.error_code = E_IBX_CAR_INS_DATE_END_INVALID;
        return input;
    }

    //생년월일
    if (!input.생년월일) {
        input.error_code = E_IBX_CAR_INS_OWNER_DOB_NOTENTER;
        return input;
    }

    if (input.생년월일.length != 8 || !cf_isNumber(input.생년월일) || !cf_isValidDate(input.생년월일)) {
        input.error_code = E_IBX_CAR_INS_OWNER_DOB_INVALID;
        return input;
    }

    if (!대물배상) {
        input.error_code = E_IBX_CAR_INS_REAL_CLAIM_NOTENTER;
        return input;
    }
    if (!무보험상해) {
        무보험상해 = cf_strTrim(input.무보험차상해);
        if (!무보험상해) {
            input.error_code = E_IBX_CAR_INS_UNINS_ACCIDENT_NOTENTER;
            return input;            
        }
    }
    if (!물적사고할증기준금액) {
        input.error_code = E_IBX_PHYSICAL_EXTRA_CHARGE_NOTENTER;
        return input;
    }
    if (!긴급출동서비스) {
        input.error_code = E_IBX_EMERGENCY_RESCUE_SERVICE_NOTENTER;
        return input;
    }
    if (!자가차량손해) {
        input.error_code = E_IBX_OWN_CAR_DAMAGE_NOTENTER;
        return input;
    }
    if(마일리지특약가입여부 == "Y"){
    	if (!연간주행거리) {
    		input.error_code = E_IBX_ANNUAL_MILEAGE_NOTENTER;
    		return input;
    		}
    	}
    if (!자기신체손해1) {
        input.error_code = E_IBX_OWN_PHYSICAL_ACCIDENT1_NOTENTER;
        return input;
    }
    if (!자기신체손해2) {
        input.error_code = E_IBX_OWN_PHYSICAL_ACCIDENT2_NOTENTER;
        return input;
    }

    if (!차량코드 || !차량종류 || !등록년도 || !제조사 || !차명 || !세부차명) {
        input.error_code = E_IBX_OWNER_CAR_INFO_NOTENTER;
        return input;
    }

    // "1":승용차, "2":승합차, "3":화물차
    if (차량종류 != "1" && 차량종류 != "2" && 차량종류 != "3") {
        input.error_code = E_IBX_OWNER_CAR_INFO_INVALID;
        return input;
    }
    
    if (!블랙박스특약가입여부) {
        블랙박스특약가입여부 = "N";
    }
    if (블랙박스특약가입여부.toUpperCase() == 'Y') {
        
        if (!input.블랙박스정보) {
            input.error_code = E_IBX_CAR_BLACK_BOX_INFO_NOTENTER;
            return input;
        }
        var 장착년도_블랙박스정보 = cf_strTrim(input.블랙박스정보.장착년도);
        var 구입가격_블랙박스정보 = cf_strTrim(input.블랙박스정보.구입가격);
        
        if (장착년도_블랙박스정보 == '') {
            input.error_code = E_IBX_CAR_BLACK_BOX_INFO_NOTENTER;
            return input;
        }
        if (!구입가격_블랙박스정보) {
            input.error_code = E_IBX_CAR_BLACK_BOX_INFO_NOTENTER;
            return input;
        }
        if (장착년도_블랙박스정보.length != 4 || !cf_isNumber(장착년도_블랙박스정보) || !cf_isNumber(구입가격_블랙박스정보) || parseInt(구입가격_블랙박스정보) < 9 || parseInt(구입가격_블랙박스정보) > 998) {
            input.error_code = E_IBX_CAR_BLACK_BOX_INFO_INVALID;
            return input;
        }
    }
    if (!부속품장착여부) {
        부속품장착여부 = "N";
    }
    if (부속품장착여부.toUpperCase() == 'Y') {
        // 네비게이션정보
        if (!input.네비게이션정보) {
            input.error_code = E_IBX_CAR_NAVIGATION_INFO_NOTENTER;
            return input;
        }
        var 장착년도_네비게이션정보 = cf_strTrim(input.네비게이션정보.장착년도);
        var 구입가격_네비게이션정보 = cf_strTrim(input.네비게이션정보.구입가격);
        if ((구입가격_네비게이션정보 != "" && 장착년도_네비게이션정보 == "") || (구입가격_네비게이션정보 == "" && 장착년도_네비게이션정보 != "")) {
            input.error_code = E_IBX_CAR_NAVIGATION_INFO_NOTENTER;
            return input;
        } else if (구입가격_네비게이션정보 != "" && 장착년도_네비게이션정보 != "") {
            if (장착년도_네비게이션정보.length != 4 || !cf_isNumber(장착년도_네비게이션정보) || !cf_isNumber(구입가격_네비게이션정보) || parseInt(구입가격_네비게이션정보, 0) < 9 || parseInt(구입가격_네비게이션정보, 0) > 998) {
                input.error_code = E_IBX_CAR_NAVIGATION_INFO_INVALID;
                return input;
            }
        }
        
        // 선루프정보
        if (!input.선루프정보) {
            input.error_code = E_IBX_CAR_SUN_ROOF_INFO_NOTENTER;
            return input;
        }
        var 장착년도_선루프정보 = cf_strTrim(input.선루프정보.장착년도);
        var 구입가격_선루프정보 = cf_strTrim(input.선루프정보.구입가격);
        if ((구입가격_선루프정보 != "" && 장착년도_선루프정보 == "") || (구입가격_선루프정보 == "" && 장착년도_선루프정보 != "")) {
            input.error_code = E_IBX_CAR_SUN_ROOF_INFO_NOTENTER;
            return input;
        } else if (구입가격_선루프정보 != "" && 장착년도_선루프정보 != "") {
            if (장착년도_선루프정보.length != 4 || !cf_isNumber(장착년도_선루프정보) || !cf_isNumber(구입가격_선루프정보) || parseInt(구입가격_선루프정보, 0) < 9 || parseInt(구입가격_선루프정보, 0) > 998) {
                input.error_code = E_IBX_CAR_SUN_ROOF_INFO_INVALID;
                return input;
            }
        }
        
        // 하이패스정보
        if (!input.하이패스정보) {
            input.error_code = E_IBX_CAR_HI_PASS_INFO_NOTENTER;
            return input;
        }
        var 장착년도_하이패스정보 = cf_strTrim(input.하이패스정보.장착년도);
        var 구입가격_하이패스정보 = cf_strTrim(input.하이패스정보.구입가격);
        if ((구입가격_하이패스정보 != "" && 장착년도_하이패스정보 == "") || (구입가격_하이패스정보 == "" && 장착년도_하이패스정보 != "")) {
            input.error_code = E_IBX_CAR_HI_PASS_INFO_NOTENTER;
            return input;
        } else if (구입가격_하이패스정보 != "" && 장착년도_하이패스정보 != "") {
            if (장착년도_하이패스정보.length != 4 || !cf_isNumber(장착년도_하이패스정보) || !cf_isNumber(구입가격_하이패스정보) || parseInt(구입가격_하이패스정보, 0) < 9 || parseInt(구입가격_하이패스정보, 0) > 998) {
                input.error_code = E_IBX_CAR_HI_PASS_INFO_INVALID;
                return input;
            }
        }
        
        // 알루미늄휠정보
        if (!input.알루미늄휠정보) {
            input.error_code = E_IBX_CAR_ALUMINUM_WHEEL_INFO_NOTENTER;
            return input;
        }
        var 장착년도_알루미늄휠정보 = cf_strTrim(input.알루미늄휠정보.장착년도);
        var 구입가격_알루미늄휠정보 = cf_strTrim(input.알루미늄휠정보.구입가격);
        if ((구입가격_알루미늄휠정보 != "" && 장착년도_알루미늄휠정보 == "") || (구입가격_알루미늄휠정보 == "" && 장착년도_알루미늄휠정보 != "")) {
            input.error_code = E_IBX_CAR_ALUMINUM_WHEEL_INFO_NOTENTER;
            return input;
        } else if (구입가격_알루미늄휠정보 != "" && 장착년도_알루미늄휠정보 != "") {
            if (장착년도_알루미늄휠정보.length != 4 || !cf_isNumber(장착년도_알루미늄휠정보) || !cf_isNumber(구입가격_알루미늄휠정보) || parseInt(구입가격_알루미늄휠정보, 0) < 9 || parseInt(구입가격_알루미늄휠정보, 0) > 998) {
                input.error_code = E_IBX_CAR_ALUMINUM_WHEEL_INFO_INVALID;
                return input;
            }
        }
        
        //후방카메라정보
        if (!input.후방카메라정보) {
            input.error_code = E_IBX_CAR_ALUMINUM_WHEEL_INFO_NOTENTER;
            return input;
        }
        var 장착년도_후방카메라정보 = cf_strTrim(input.후방카메라정보.장착년도);
        var 구입가격_후방카메라정보 = cf_strTrim(input.후방카메라정보.구입가격);
        if ((구입가격_후방카메라정보 != "" && 장착년도_후방카메라정보 == "") || (구입가격_후방카메라정보 == "" && 장착년도_후방카메라정보 != "")) {
            input.error_code = E_IBX_CAR_BACK_CAMERA_INFO_NOTENTER;
            return input;
        } else if (구입가격_후방카메라정보 != "" && 장착년도_후방카메라정보 != "") {
            if (장착년도_후방카메라정보.length != 4 || !cf_isNumber(장착년도_후방카메라정보) || !cf_isNumber(구입가격_후방카메라정보) || parseInt(구입가격_후방카메라정보, 0) < 9 || parseInt(구입가격_후방카메라정보, 0) > 998) {
                input.error_code = E_IBX_CAR_BACK_CAMERA_INFO_INVALID;
                return input;
            }
        }
        
        // 기타부속품
        if (!input.기타부속품) {
            input.error_code = E_IBX_CAR_OTHER_ACCESSORIES_INFO_NOTENTER;
            return input;
        }
        var 장착년도_기타부속품 = cf_strTrim(input.기타부속품.장착년도);
        var 구입가격_기타부속품 = cf_strTrim(input.기타부속품.구입가격);
        if ((구입가격_기타부속품 != "" && 장착년도_기타부속품 == "") || (구입가격_기타부속품 == "" && 장착년도_기타부속품 != "")) {
            input.error_code = E_IBX_CAR_OTHER_ACCESSORIES_INFO_NOTENTER;
            return input;
        } else if (구입가격_기타부속품 != "" && 장착년도_기타부속품 != "") {
            if (장착년도_기타부속품.length != 4 || !cf_isNumber(장착년도_기타부속품) || !cf_isNumber(구입가격_기타부속품) || parseInt(구입가격_기타부속품, 0) < 9 || parseInt(구입가격_기타부속품, 0) > 998) {
                input.error_code = E_IBX_CAR_OTHER_ACCESSORIES_INFO_INVALID;
                return input;
            }
        }
    }
    // 운전자한정
    if (!운전자한정) {
        input.error_code = E_IBX_DRIVER_STATE_RESTRICT_NOTENTER;
        return input;
    }

    // 지정운전자정보(운전자한정 "2", "4", "6"의 경우 필수 체크)
    if (운전자한정 == "2" || 운전자한정 == "4" || 운전자한정 == "6") {
        
        if (!input.지정운전자정보) {
            input.error_code = E_IBX_DESIGNATED_DRIVER_INFO_NOTENTER;
            return input;
        }
        var 이름_지정운전자정보 = cf_strTrim(input.지정운전자정보.이름);
        var 생년월일_지정운전자정보 = cf_strTrim(input.지정운전자정보.생년월일);
        var 성별_지정운전자정보 = cf_strTrim(input.지정운전자정보.성별);

        if (!이름_지정운전자정보 || !생년월일_지정운전자정보 || !성별_지정운전자정보) {
            input.error_code = E_IBX_DESIGNATED_DRIVER_INFO_NOTENTER;
            return input;
        }
        if (생년월일_지정운전자정보.length != 8 || !cf_isNumber(생년월일_지정운전자정보) || !cf_isValidDate(생년월일_지정운전자정보)) {
            input.error_code = E_IBX_DESIGNATED_DRIVER_INFO_INVALID;
            return input;
        }
        if (성별_지정운전자정보 != '남' && 성별_지정운전자정보 != '여') {
            input.error_code = E_IBX_DESIGNATED_DRIVER_INFO_INVALID;
            return input;
        }

    } else if (운전자한정 == "3") {
        if (!input.배우자정보) {
            input.error_code = E_IBX_SPOUSE_INFO_NOTENTER;
            return input;
        }
        var 이름_배우자정보 = cf_strTrim(input.배우자정보.이름);
        var 생년월일_배우자정보 = cf_strTrim(input.배우자정보.생년월일);
        
        if (!이름_배우자정보 || !생년월일_배우자정보) {
            input.error_code = E_IBX_SPOUSE_INFO_NOTENTER;
            return input;
        }
        if (생년월일_배우자정보.length != 8 || !cf_isNumber(생년월일_배우자정보) || !cf_isValidDate(생년월일_배우자정보)) {
            input.error_code = E_IBX_SPOUSE_INFO_INVALID;
            return input;
        }
    } else if (운전자한정 == "4" || 운전자한정 == "5" || 운전자한정 == "6" || 운전자한정 == "7" || 운전자한정 == "8") {
        if (!input.최소연령운전자정보) {
            input.error_code = E_IBX_YOUNGEST_DRIVER_INFO_NOTENTER;
            return input;
        }
        var 이름_최소연령운전자정보 = cf_strTrim(input.최소연령운전자정보.이름);
        var 생년월일_최소연령운전자정보 = cf_strTrim(input.최소연령운전자정보.생년월일);
        var 성별_최소연령운전자정보 = cf_strTrim(input.최소연령운전자정보.성별);
        
        if (!이름_최소연령운전자정보 || !생년월일_최소연령운전자정보 || !성별_최소연령운전자정보) {
            input.error_code = E_IBX_YOUNGEST_DRIVER_INFO_NOTENTER;
            return input;
        }
        if (생년월일_최소연령운전자정보.length != 8 || !cf_isNumber(생년월일_최소연령운전자정보) || !cf_isValidDate(생년월일_최소연령운전자정보)) {
            input.error_code = E_IBX_YOUNGEST_DRIVER_INFO_INVALID;
            return input;
        }
        if (성별_최소연령운전자정보 != '남' && 성별_최소연령운전자정보 != '여') {
            input.error_code = E_IBX_YOUNGEST_DRIVER_INFO_INVALID;
            return input;
        }
    }
    
    if(!자녀특약가입여부) {
        자녀특약가입여부 = "N";
    }
    
    //자녀정보
    if (자녀특약가입여부.toUpperCase() == 'Y') {
        if (!input.자녀정보) {
            input.error_code = E_IBX_CHILDREN_INFO_NOTENTER;
            return input;
        }
        var 생년월일_자녀정보 = cf_strTrim(input.자녀정보.생년월일);
        var 성별_자녀정보 = cf_strTrim(input.자녀정보.성별);    
        
        if (생년월일_자녀정보.length != 8 || !cf_isNumber(생년월일_자녀정보) || !cf_isValidDate(생년월일_자녀정보)) {
            input.error_code = E_IBX_CHILDREN_INFO_INVALID;
            return input;
        }
        if (성별_자녀정보 != '남' && 성별_자녀정보 != '여') {
            input.error_code = E_IBX_CHILDREN_INFO_INVALID;
            return input;
        }
    }

    return input;
    
};

/**
 * 다이렉트자동차보험 로그인 요청 input 검증
 * @param input
 * @returns Object 
 */
cf_directMycarReqRaramChk = function(obj_org_input) {
    
    var input = obj_org_input;
    var 조회구분 = cf_strTrim(input.조회구분);
    var 이름 = cf_strTrim(input.이름);
    var 주민등록번호 = cf_strTrim(input.주민등록번호);
    var 휴대폰번호 = cf_strTrim(input.휴대폰번호);
    input.error_code = "00000000";
    
    // 용도구분
    if (!조회구분) {
        input.error_code = E_IBX_P00XXX_PAY_TYPE_NOENTER;
        return input;
    }
    
    // 이름
    if (!이름) {
        input.error_code = E_IBX_P14101_OWNER_NOENTER;
        return input;
    }
    // 주민등록번호
    if (!주민등록번호) {
        input.error_code = E_IBX_REGNO_RESIDENT_NOTENTER;
        return input;
    }
    if (!isJuminValid(주민등록번호)) {
        input.error_code = E_IBX_REGNO_RESIDENT_INVALID;
        return input;
    }
    // 휴대폰번호
    if (!휴대폰번호) {
        input.error_code = E_IBX_CELLPHONE_NOTENTER;
        return input;
    }
    if (!cf_phnTelNumCheck(휴대폰번호)) {
        input.error_code = E_IBX_TELEPHONE_INVALID;
        return input;
    }
    var 인증서 = input.인증서;
    if (!인증서) {
        input.error_code = E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
        return input;
    }
    var certpath = cf_strTrim(input.인증서.이름);
    var password = cf_strTrim(input.인증서.비밀번호);
    
    if (!certpath) {
        input.error_code = E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER;
        return input;
    }
    if (!password) {
        input.error_code = E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER;
        return input;
    }
    if (!certManager.findCert(JSON.stringify(input.인증서))) {
        console.log("common 인증서를 찾을 수 없습니다.");
        input.error_code = E_IBX_CERTIFY_NOT_FOUND;
        return input;
    }
    if (!certManager.verifyPassword(password)) {
        console.log("common certManager.verifyPassword 실패");
        input.error_code = E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID;
        return input;
    }
    return input;
};

cf_isValidDate = function(dateString) {
    
    if (dateString == undefined || dateString == null) {
        return false;
    }
        
    if (dateString.length != 8 || !cf_isNumber(dateString)) {
        return false;
    }

    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12) {
        return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

/**
 * 폰번호 체크(필드ID 사용)
 * @param telno 휴대폰번호
 * @returns {Boolean}
 */
function cf_phnTelNumCheck(telno) {

    if (!cf_isNumber(telno)) {
        return false;
    }

    var tel1, tel2, tel3;
    if (telno.length == 10) {
        tel1 = telno.substr(0, 3);
        tel2 = telno.substr(3, 4);
        tel3 = telno.substr(7, 3);
    } else if (telno.length == 11) {
        tel1 = telno.substr(0, 3);
        tel2 = telno.substr(3, 4);
        tel3 = telno.substr(7, 4);
    } else {
        return false
    }

    if (tel1 != "010") {
        return true;
    }
    if (!cf_validHphnTelNo2(tel2)) {
        return false;
    }

    if (telno == "01020000000") {
        return false;
    }

    return true;
}

/**
 * 휴대폰 두번째자리 체크
 * @param telNo2Val 휴대폰 두번째 자리값
 * @returns
 */
function cf_validHphnTelNo2(telNo2Val) {
    try {
        var telNo2 = Number(telNo2Val);
    } catch (e) {
        return false;
    }

    return (telNo2 <= 1999 || telNo2 > 9999) ? false : true;
}

function cf_dec(aInput) {
    try {
        var rInput = JSON.parse("{}");

        for (i in aInput) {

            var key = i;
            var val = aInput[i];

            if (typeof val == 'object') {

                for (j in val) {
                    var subKey = j;
                    var subval = val[j];

                    if (typeof subval == 'object') {

                        for (k in subval) {
                            var subKey2 = k;
                            var subval2 = subval[k];
                            subval2 = Crypto.dec(subval2) + "";
                            subval[subKey2] = subval2;
                        }
                        rInput[key] = subval2;
                    } else {
                        subval = Crypto.dec(subval);
                        rInput[key] = subval + "";
                    }
                }
                rInput[key] = val;
            } else {
                val = Crypto.dec(val);
                rInput[key] = val + "";
            }
        }
        return rInput;
        
    } catch (e) {
        console.log("Crypto is undefined");
        return aInput;
    }
}

/**
 * 공공기관 간편인증 입력값 검증
 * @param obj_org_input
 * @returns Object
 */

function chkSimpleAuthParam (obj_org_input) {
    console.log('common.js/simpleAuthParamChk 호출![' + CommonVersion + ']');

    var input = obj_org_input;
	var retObj = {
        error_code		: S_IBX_OK,
		error_message	: "",
		telcoTycd		: ""
    };

    if (input.생년월일) { 
        if (typeof(input.생년월일) == "number") {
            input.생년월일 = input.생년월일.toString();
        }
    }
    if (!StrTrim(input.성명)) {
		retObj.error_code = E_IBX_P1100X_NAME_NOTENTER;
        return retObj;
    }
    if (!StrTrim(input.핸드폰번호)) {
		retObj.error_code = E_IBX_TELEPHONE_NOTENTER;
        return retObj;
    }
    if (isNaN(input.핸드폰번호) || input.핸드폰번호.length > 11) {
		retObj.error_code = E_IBX_TELEPHONE_INVALID;
        return retObj;
    }
    if (!StrTrim(input.생년월일)) {
		retObj.error_code = E_IBX_CAR_INS_OWNER_DOB_NOTENTER;
        return retObj;
    }
    // 사이트와 동일하게 정규표현식으로 입력값 확인
    var reg생년월일 = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
    if (isNaN(input.생년월일) || !reg생년월일.test(input.생년월일) || input.생년월일.length != 8) {
        retObj.error_code = E_IBX_CAR_INS_OWNER_DOB_INVALID;
        return retObj;
    }
    
    // 통신사 입력값 들어왔을 때만 검증 (사이트에서 일반통신사와 알뜰폰 구분이 없음)
    // "01" : SKT, "02" : KT, "03" :  LGU+
    if (input.로그인방식 == "PASS" || input.로그인방식 == 'NONMEMBER_PASS') {
        if (!input.통신사) { telcoTycd = ""; }
        else if (input.통신사 == "01") { telcoTycd = "S"; }
        else if (input.통신사 == "02") { telcoTycd = "K"; }
        else if (input.통신사 == "03") { telcoTycd = "L"; }
        else {
			retObj.error_code = E_IBX_PARAMETER_INVALID;
			retObj.error_message = "통신사를 잘못 입력하셨습니다. 확인 후 거래하시기 바랍니다.";
        	return retObj;
        }
    } else {
        telcoTycd = ""; 
    }

	retObj.telcoTycd = telcoTycd;

    return retObj;
};

/**
 * 공공기관 간편인증 TOKEN 발급
 * @param host
 * @param url
 * @returns Object
 */
function issueSimpleAuthToken (host, url) {
    console.log('common.js/issueSimpleAuthToken 호출![' + CommonVersion + ']');

	var retObj = {
        error_code		: S_IBX_OK,
		error_message	: "",
        token           : "",
        txId            : ""
    };

	var userAgent  = '{"Accept":"text/plain, */*; q=0.01",';
	userAgent += '"Content-Type":"application/json; charset=utf-8",';
	userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.118 Whale/2.11.126.23 Safari/537.36"}';

	if (httpRequest.postWithUserAgent(userAgent, host + url, '{"token":""}') == false) {
		retObj.error_code = E_IBX_FAILTOGETPAGE;
		return retObj;
	}
	console.log('IssueToken : ' + httpRequest.result);
    if (httpRequest.result.indexOf('>403 Forbidden<') > -1) {
        retObj.error_code = E_IBX_SERVICE_DENIED_4;
		return retObj;
    }

	var jsonResult;
	var token;
	var txId;
	try {
		jsonResult = JSON.parse(httpRequest.result);

		token = jsonResult.token.toString();
		txId = jsonResult.txId.toString();
		
		if (!token || !txId) {
			error_code = E_IBX_SITE_INVALID;
			return retObj;
		}
	} catch (error) {
		console.log('error.message[' + error.message + ']');
		retObj.error_code = E_IBX_SITE_INVALID + 1;
		return retObj;
	}
    retObj.token = token;
    retObj.txId = txId;

    return retObj;
};

/**
 * 공공기관 간편인증 Set Provider
 * @param host
 * @param url
 * @returns Object
 */
function setSimpleAuthProvider (host, url, obj_org_input) {
    console.log('common.js/setSimpleAuthProvider 호출![' + CommonVersion + ']');

    var input = obj_org_input;
	var retObj = {
        error_code		: S_IBX_OK,
		error_message	: "",
        provider        : "",
        provider_v      : ""
    };

	var provider;
    var 로그인방식 = input.로그인방식.toUpperCase();
	if (로그인방식.indexOf("PASS") > -1) {
		provider = "pass";
	} else if (로그인방식.indexOf("PAYCO") > -1) {
		provider = "payco";
	} else if (로그인방식.indexOf("KAKAO") > -1) {
		provider = "kakao";
	} else if (로그인방식.indexOf("SAMSUNG") > -1 || 로그인방식.indexOf('KICA') > -1) {
		provider = "kica";
	} else if (로그인방식.indexOf("KB") > -1 || 로그인방식.indexOf("KB_scheme") > -1) {
		provider = "kb";
	} else if (로그인방식.indexOf("TOSS") > -1) {
		provider = "toss";
	} else if (로그인방식.indexOf("SHINHAN") > -1) {
		provider = "shinhan";
	} else if (로그인방식.indexOf("NAVER") > -1) {
		provider = "naver";
	} else if (로그인방식.indexOf("NH") > -1) {
		provider = "nh";
    } else if (로그인방식.indexOf("HANA") > -1) {
		provider = "hana";
	} else if (로그인방식.indexOf("BANKSALAD") > -1) {
		provider = "banksalad";
	} else if (로그인방식.indexOf("WOORI") > -1) {
		provider = "woori";
	} else {
		retObj.error_code = E_IBX_CERTIFY_NOT_REGISTER;
        return retObj;
	}

    // get Provider List
    var userAgent  = '{"Accept":"text/plain, */*; q=0.01",';
	userAgent += '"Content-Type":"application/json; charset=utf-8",';
	userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.118 Whale/2.11.126.23 Safari/537.36"}';

	system.setStatus(IBXSTATE_LOGIN, 50);
	if (!httpRequest.getWithUserAgent(userAgent, host + url)) {
		retObj.error_code = E_IBX_FAILTOGETPAGE;
		return retObj;
	}
	console.log('get Provider List : ' + httpRequest.result);

	var provider_v;
	var provider_version;
	var jsonResult;
	try {
		jsonResult = JSON.parse(httpRequest.result);
		for (var i = 0; i < jsonResult.length; i++) {
			if (jsonResult[i].provider_id == provider) {
				provider_v = jsonResult[i].id;
				provider_version = jsonResult[i].version;
				break;
			}
		}
		if (!provider_v) {
			retObj.error_code = E_IBX_SITE_INVALID + 2;
			return retObj;
		}
	} catch (error) {
		console.log('error.message[' + error.message + ']');
		retObj.error_code = E_IBX_SITE_INVALID + 3;
		return retObj;
	}

    // /oacx/api/v1.0/provider/list(간편인증 기관 리스트)에 다른 기관의 id값은 "기관명_버전"형식으로 나오나
	// 신한인증서의 경우, "shinhan_prod"로 리턴되고 있어 provider값 직접 수정(쿼리에선 "shinhan_버전"으로 통신)
	// 사이트 수정되면 해당 로직 및 provider_version변수 제거 필요
	if (provider_v == 'shinhan_prod') provider_v = 'shinhan_' + provider_version;
	if (provider_v == 'nh_prod') provider_v = 'nh_' + provider_version;

    retObj.provider = provider;
    retObj.provider_v = provider_v;

    return retObj;
};

/**
* 공공기관 간편인증 프로세스
 * @param isNonMember 비회원 여부(true 비회원. false 회원)
 * @param host
 * @param url
 * @param obj_org_input
 * @param ssn_decode 쿼리에 base64Encode 미사용 여부 (true: 미사용, false: 사용)
 * @param phone_decode 쿼리에 base64Encode 미사용 여부 (true: 미사용, false: 사용)
 * @returns Object
 */
function requestSimpleAuth (isNonMember, host, url, obj_org_input, ssn_decode, phone_decode) {
    console.log('common.js/requestSimpleAuth 호출! [' + CommonVersion + ']');

    var input = obj_org_input;
    if (ssn_decode == undefined) ssn_decode = false;

    var isDecode = (ssn_decode == false ? false : true);
    var isPhDecode = (phone_decode == false ? false : true);

	var retObj = {
        error_code		: S_IBX_OK,
		error_message	: "",
        postResult      : "",
		reqTxId			: "",
        cxId            : "",
        ResultStr       : ""
    };

	// To request Auth(sending...)
	var userAgent = '{"Accept":"text/plain, */*; q=0.01",';
	userAgent += '"Content-Type":"application/json; charset=UTF-8",';
	userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.118 Whale/2.11.126.23 Safari/537.36"}';

	var postData = '{';
	postData +=     '"providerId": "'+ input.provider +'",';
	postData +=     '"isBirth": true,';
	postData +=     '"reqTxId": "",';
	postData +=     '"deeplinkUri": "",';
	postData +=     '"telcoTxid": "",';
	postData +=     '"provider": "'+ input.provider_v +'",';
	postData +=     '"token": "'+ input.token +'",';
	postData +=     '"txId": "'+ input.txId +'",';
	postData +=     '"cxId": "",';
	postData +=     '"appInfo": {';
	postData +=         '"code": "",';
	postData +=         '"path": "",';
	postData +=         '"type": ""';
	postData +=     '},';
	postData +=     '"userInfo": {';
	postData +=         '"isMember": false,';
	postData +=         '"name": "'+ certManager.Base64Encode(input.성명) +'",';
	postData +=         '"phone": "'+ input.핸드폰번호 +'",';
    if (isNonMember) {
        // 비회원 로그인 추가 쿼리
        if (!isPhDecode) {
            postData +=         '"phone1": "'+ certManager.Base64Encode(input.핸드폰번호.substr(0, 3)) +'",';
            postData +=         '"phone2": "'+ certManager.Base64Encode(input.핸드폰번호.substr(3, input.핸드폰번호.length - 3)) +'",';
        } else {
            postData +=         '"phone1": "'+ input.핸드폰번호.substr(0, 3) +'",';
            postData +=         '"phone2": "'+ input.핸드폰번호.substr(3, input.핸드폰번호.length - 3) +'",';
        }
        if (!isDecode) {
            postData +=         '"ssn1": "'+ certManager.Base64Encode((input.주민등록번호.getPlainText()).substr(0, 6)) +'",';
            postData +=         '"ssn2": "'+ certManager.Base64Encode((input.주민등록번호.getPlainText()).substr(6, (input.주민등록번호.getPlainText()).length)) +'",';
        } else {
            postData +=         '"ssn1": "'+ (input.주민등록번호.getPlainText()).substr(0, 6) +'",';
            postData +=         '"ssn2": "'+ (input.주민등록번호.getPlainText()).substr(6, (input.주민등록번호.getPlainText()).length) +'",';
        }
    }
	postData +=         '"birthday": "'+ (isNonMember ? '' : input.생년월일) +'",';
	// postData +=         '"birthday": "' + input.생년월일 + '",';
	postData +=         '"privacy": ' + (isNonMember? 1 : 0) + ',';
	postData +=         '"terms": ' + (isNonMember? 1 : 0) + ',';
	postData +=         '"policy3": 0,';
	postData +=         '"policy4": 1,';
	postData +=         '"telcoTycd": ' + (!input.telcoTycd ? 'null' : '"' + input.telcoTycd + '"') + ',';
	postData +=         '"access_token": "",';
	postData +=         '"token_type": "",';
	postData +=         '"state": ""';
	postData +=     '},';
	postData +=     '"deviceInfo": {';
	postData += 		 '"code": "' + (input.isKB_scheme ? 'MO' : 'PC') + '",';
	postData +=         '"browser": "WB",';
	postData +=         '"os": "'+ (input.isKB_scheme ? (logManager.pltfName.indexOf("iOS")  >= 0 ? 'IOS' : 'AOS') : '') +'"';
	postData +=     '},';
	postData +=     '"contentInfo": {';
	postData +=         '"signTarget": "",';
    if (isNonMember) {
        // 비회원 로그인 추가 쿼리
        postData +=         '"signTargetTycd": "nonce",';
    }
	postData +=         '"signType": "GOV_SIMPLE_AUTH",';
	postData +=         '"requestTitle": "",';
	postData +=         '"requestContents": ""';
	postData +=     '},';
	postData +=     '"providerOptionInfo": {';
	postData += 		 '"callbackUrl": "' + (input.isKB_scheme ? 'kakaotalk://me/talk_close' : '') + '",';
	postData +=         '"reqCSPhoneNo": "1",';
	postData +=         '"upmuGb": "",';
	postData +=         '"isUseTss": "Y",';
	postData += 		 '"isNotification": "' + (input.isKB_scheme ? 'N' : 'Y') + '",';
	postData +=         '"isPASSVerify": "Y",';
	postData +=         '"isUserAgreement": "Y"';
	postData +=     '},';
	postData +=     '"compareCI": ' + (isNonMember? true : false);
	if (isNonMember) {
        // 비회원 로그인 추가 쿼리
        postData +=         ',"useMdlSsn": true';
    }
    postData += '}';

	if (httpRequest.postWithUserAgent(userAgent, host + url, postData) == false) {
		retObj.error_code = E_IBX_FAILTOGETPAGE;
		return retObj;
	}
	var ResultStr = httpRequest.result;
	console.log('request Auth : ' + ResultStr);
    
    // KB_scheme에 사용
    retObj.ResultStr = ResultStr;

    //ios 한글 깨짐 확인
    var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (check.test(ResultStr)) {
        console.log("requestSimpleAuth(AND) : " + ResultStr);
    } else {
        ResultStr = httpRequest.GetResult('UTF-8');
        console.log("requestSimpleAuth(IOS) : " + ResultStr);
    }

    // HTML 엔티티 이름 > 표시 글자로 변경
    ResultStr = StrReplace(ResultStr, '&apos;', '\'');
    ResultStr = StrReplace(ResultStr, '&lsquo;', '‘');
    ResultStr = StrReplace(ResultStr, '&rsquo;', '’');
    ResultStr = StrReplace(ResultStr, '&nbsp;', ' ');
    ResultStr = StrReplace(ResultStr, '&nbsp', ' ');
    ResultStr = StrReplace(ResultStr, '<br>', ' ');
    ResultStr = StrReplace(ResultStr, '<br/>', ' ');
    ResultStr = StrReplace(ResultStr, '<p>', '');
    ResultStr = StrReplace(ResultStr, '</p>', '');
    ResultStr = StrReplace(ResultStr, '\\n', '');
    
    // KB 인증일 경우, 해당 메시지 출력되어 제거
    ResultStr = StrReplace(ResultStr, '<p class=‘sTxt’>', '');
    ResultStr = StrReplace(ResultStr, '<p class=‘cont’>', '');
    ResultStr = StrReplace(ResultStr, '<p class=‘sTxt bold’>', '');

	if (ResultStr.indexOf("OACX_SUCCESS") < 0) {
		// 페이코
        // ERROR CODE: 201
        // "clientMessage": "선택하신 인증서비스에 등록된 사용자가 아닙니다.<br/>선택하신 인증서비스에 가입 후 사용해주시기 바랍니다.",
        // "systemMessage": "Target is not exists",

        // 카카오
        // "clientMessage": "선택하신 인증서비스에 등록된 사용자가 아닙니다.<br/>선택하신 인증서비스에 가입 후 사용해주시기 바랍니다.",
        // "systemMessage": "본인 인증 정보를 찾을 수 없습니다.",

        // PASS
        // "clientMessage": "선택하신 인증서비스에 등록된 사용자가 아닙니다.<br/>선택하신 인증서비스에 가입 후 사용해주시기 바랍니다.",
        // "systemMessage": "PACPR",

        // 삼성패스
        // "clientMessage": "선택하신 인증서비스에 등록된 사용자가 아닙니다.<br/>선택하신 인증서비스에 가입 후 사용해주시기 바랍니다.",
        // "systemMessage": "CA서버로 부터 인증서 발급 내역이 없습니다.(602)",

        // KB
        // "clientMessage": "<p>입력하신 정보로 인증을 진행할 수<br>없습니다.</p><p class=&lsquo;sTxt&rsquo;>ERROR CODE:&nbsp;UCWB1750</p><p class=&lsquo;cont&rsquo;>사용자 정보(이름, 전화번호, 주민등록번호)를<br>확인 후 다시 시도하세요. 서비스에 가입하지<br>않으셨다면 가입 후 이용하시기 바랍니다.</p><p class=&lsquo;sTxt bold&rsquo;>국민은행&nbsp;고객센터:&nbsp;1588-9999</p>",
        // "resultCode": "UCWB1750",

        // NAVER
        // 입력하신 정보와 일치하는 네이버 사용자를 찾을 수 없습니다.<br/>네이버에서 회원가입 및 인증서 (재)발급 후 재시도 부탁 드립니다.
        // "systemMessage": "not_exist_user"

        // SHINHAN
        // "clientMessage": "입력하신 내용과 일치하는 인증서가 없습니다. 입력하신 내용이 맞다면 신한SOL에서 인증서를 (재)발급하신 뒤에 다시 거래하시기 바랍니다."
        // "systemMessage": "본인 인증 정보를 찾을 수 없습니다.",

        // TOSS
        // "clientMessage":"입력하신 정보로 인증을 진행할 수 없습니다.\n사용자 정보(이름, 생년월일, 주민번호, 휴대폰번호 등)를 확인 후 다시 시도하세요.\n인증서를 발급하지 않으셨다면 가입 후 이용하시기 바랍니다.\n토스 고객센터: 1599-4905"
        // "systemMessage":"토스에 가입된 유저가 아닙니다."

        // NH
        // "clientMessage": "NH모바일인증서를 발급하지 않으셨다면 발급 후 이용하시기 바랍니다(NH스마트뱅킹 앱).\u003cbr\u003e\u003cbr\u003e또는 사용자 정보(이름, 생년월일, 주민번호, 휴대폰번호 등)를 확인 후 다시 시도해 주시기 바랍니다.\u003cbr\u003e\u003cbr\u003e\u003ca href\u003d\"https://banking.nonghyup.com/servlet/content/ip/ca/ipca1183c.thtml\" target\u003d\"_blank\"\u003eFAQ바로가기\u003c/a\u003e\u003cbr\u003e\u003cbr\u003e농협은행 고객센터: 1588-2100",
        // "systemMessage": "Not Found Cust Info",

        // WOORI
        // "clientMessage": "입력하신 정보로 인증을 진행할 수 없습니다. 사용자정보(이름, 생년월일, 주민등록번호, 휴대폰번호 등)를 확인 후 다시 시도해주세요. 인증서를 발급하지 않으셨다면 우리WON뱅킹 앱에서 인증서를 발급 후 이용해주세요. \u003cbr\u003e\u003cbr\u003e\u003ca href\u003d\"https://won.wooribank.com/e/9dOtgVVp6Cb\" target\u003d\"_blank\"\u003eQR코드\u003c/a\u003e",
        // "systemMessage": "입력하신 정보로 인증을 진행할 수 없습니다. 사용자정보(이름, 생년월일, 주민등록번호, 휴대폰번호 등)를 확인 후 다시 시도해주세요. 인증서를 발급하지 않으셨다면 우리WON뱅킹 앱에서 인증서를 발급 후 이용해주세요. \u003cbr\u003e\u003cbr\u003e\u003ca href\u003d\"https://won.wooribank.com/e/9dOtgVVp6Cb\" target\u003d\"_blank\"\u003eQR코드\u003c/a\u003e",
		
		if (ResultStr.indexOf('phoneNo 값이 유효하지 않습니다.') > -1) {
			retObj.error_code = E_IBX_TELEPHONE_INVALID;
			return retObj;
		}

        if (ResultStr.indexOf('요청 Body 형식이 잘못되었습니다') > -1) {
			retObj.error_code = E_IBX_AUTHENTICATION_FAIL;
			return retObj;
		}
		
		var errMsg;
		var objResult;
		try {
			objResult = JSON.parse(ResultStr);
            errMsg = objResult.clientMessage.toString();
            if (!errMsg) errMsg = objResult.systemMessage.toString();
		} catch (error) {
			console.log('error.message[' + error.message + ']');
			retObj.error_code = E_IBX_SITE_INVALID + 4;
			return retObj;
		}
		console.log('errMsg : [' + errMsg + ']');

		if ((ResultStr.indexOf('사용자 정보(이름, 전화번호, 주민등록번호)를') > -1 && ResultStr.indexOf('확인 후 다시 시도하세요.') > -1) ||
            (ResultStr.indexOf('입력하신 정보와 일치하는 네이버 사용자를 찾을 수 없습니다') > -1 ) ||
            (ResultStr.indexOf('입력하신 내용과 일치하는 인증서가 없습니다') > -1) ||
            (ResultStr.indexOf('사용자 정보(이름, 생년월일, 주민번호, 휴대폰번호 등)를') > -1 && ResultStr.indexOf('확인 후 다시 시도') > -1)) { // "확인 후 다시 시도하세요." "확인 후 다시 시도해 주시기 바랍니다."
			retObj.error_code = E_IBX_NOT_MATCHED_USERINFO;
			retObj.error_message = errMsg;
			return retObj;
		}

		if (ResultStr.indexOf('선택하신 인증서비스에 등록된 사용자가 아닙니다') > -1 ||
            ResultStr.indexOf('입력하신 정보로 인증을 진행할 수 없습니다') > -1 ||
            ResultStr.indexOf('카카오톡 지갑에 가입하지 않으셨다면') > -1 ||
            ResultStr.indexOf('인증서가 없습니다') > -1 ||
			ResultStr.indexOf('인증서 생성 후 시도해 주십시오.') > -1) {
			retObj.error_code = E_IBX_AUTHENTICATION_NOT_MEMBER;
			return retObj;
		}

		if (ResultStr.indexOf('앱이 설치되지 않았거나, 인증서를 발급받지 않으셨습니다') > -1 ||
			ResultStr.indexOf('앱이 설치되지 않았거나') > -1 ||
            ResultStr.indexOf('앱이 설치되어 있지 않거나') > -1) {
			retObj.error_code = E_IBX_CERTIFY_UNKNOWN;
			retObj.error_message = '앱이 설치되지 않았거나, 인증서를 발급받지 않으셨습니다.';
			return retObj;
		}

		if (ResultStr.indexOf('내부 서버 오류입니다.') > -1 ||
		    ResultStr.indexOf('서비스 관리자에게 문의바랍니다.') > -1 ||
            ResultStr.indexOf('시스템 장애로 인하여 통신이 원활하지 않습니다') > -1) {
			retObj.error_code = E_IBX_SITE_INTERNAL;
			return retObj;
		}

		retObj.error_code = E_IBX_AUTHENTICATION_FAIL;
		retObj.error_message = StrReplace(objResult.clientMessage.toString(), '<br/>', '');
		return retObj;
	}

	var reqTxId, cxId;
	try {
		objResult = JSON.parse(ResultStr);
		reqTxId = objResult.reqTxId;
        cxId = objResult.cxId;

		// 전역변수 설정하여 JSON 실패해도 Log 남길 수 있음
		// 실패하면 undefined
		console.log("reqTxId: " + reqTxId);

		if (!reqTxId) {
			retObj.error_code = E_IBX_SITE_INVALID_MASK;
			return retObj;
		}

		postData  = '{';
		postData +=     '"providerId": "'+ input.provider +'",';
		postData +=     '"isBirth": true,';
		postData +=     '"reqTxId": "'+ objResult.reqTxId +'",';
		postData +=     '"deeplinkUri": "",';
        postData +=     '"naverAppSchemeUrl": "",';
		postData +=     '"telcoTxid": "",';
		postData +=     '"provider": "'+ input.provider_v +'",';
		postData +=     '"token": "'+ objResult.token +'",';
		postData +=     '"txId": "'+ objResult.reqTxId +'",';
		postData +=     '"cxId": "'+ objResult.cxId +'",';
		postData +=     '"appInfo": {';
		postData +=         '"code": "",';
		postData +=         '"path": "",';
		postData +=         '"type": ""';
		postData +=     '},';
		postData +=     '"userInfo": {';
		postData +=         '"isMember": false,';
		postData +=         '"name": "'+ certManager.Base64Encode(input.성명) +'",';
        postData +=         '"phone": "'+ input.핸드폰번호 +'",';
        if (isNonMember) {
            // 비회원 로그인 추가 쿼리
            if (!isPhDecode) {
                postData +=         '"phone1": "'+ certManager.Base64Encode(input.핸드폰번호.substr(0, 3)) +'",';
                postData +=         '"phone2": "'+ certManager.Base64Encode(input.핸드폰번호.substr(3, input.핸드폰번호.length - 3)) +'",';
            } else {
                postData +=         '"phone1": "'+ input.핸드폰번호.substr(0, 3) +'",';
                postData +=         '"phone2": "'+ input.핸드폰번호.substr(3, input.핸드폰번호.length - 3) +'",';
            }
            if (!isDecode) {
                postData +=         '"ssn1": "'+ certManager.Base64Encode((input.주민등록번호.getPlainText()).substr(0, 6)) +'",';
                postData +=         '"ssn2": "'+ certManager.Base64Encode((input.주민등록번호.getPlainText()).substr(6, (input.주민등록번호.getPlainText()).length)) +'",';
            } else {
                postData +=         '"ssn1": "'+ (input.주민등록번호.getPlainText()).substr(0, 6) +'",';
                postData +=         '"ssn2": "'+ (input.주민등록번호.getPlainText()).substr(6, (input.주민등록번호.getPlainText()).length) +'",';
            }
        }
        postData +=         '"birthday": "'+ (isNonMember ? '' : input.생년월일) +'",';
		// postData +=         '"birthday": "'+ input.생년월일 +'",';
		postData +=         '"privacy": ' + (isNonMember? 1 : 0) + ',';
	    postData +=         '"terms": ' + (isNonMember? 1 : 0) + ',';
		postData +=         '"policy3": 0,';
		postData +=         '"policy4": 1,';
		postData +=         '"telcoTycd": ' + (!input.telcoTycd? 'null' : '"' + input.telcoTycd + '"') + ',';
		postData +=         '"access_token": "",';
		postData +=         '"token_type": "",';
		postData +=         '"state": ""';
		postData +=     '},';
		postData +=     '"deviceInfo": {';
		postData += 		 '"code": "' + (input.isKB_scheme ? 'MO' : 'PC') + '",';
		postData +=         '"browser": "WB",';
		postData +=         '"os": "'+ (input.isKB_scheme ? (logManager.pltfName.indexOf("iOS") >= 0 ? 'IOS' : 'AOS') : '') +'"';
		postData +=     '},';
		postData +=     '"contentInfo": {';
		postData +=         '"signTarget": "",';
        if (isNonMember) {
            // 비회원 로그인 추가 쿼리
            postData +=         '"signTargetTycd": "nonce",';
        }
		postData +=         '"signType": "GOV_SIMPLE_AUTH",';
		postData +=         '"requestTitle": "",';
		postData +=         '"requestContents": ""';
		postData +=     '},';
		postData +=     '"providerOptionInfo": {';
		postData += 		 '"callbackUrl": "' + (input.isKB_scheme ? 'kakaotalk://me/talk_close' : '') + '",';
		postData +=         '"reqCSPhoneNo": "1",';
		postData +=         '"upmuGb": "",';
		postData +=         '"isUseTss": "Y",';
		postData += 		 '"isNotification": "' + (input.isKB_scheme ? 'N' : 'Y') + '",';
		postData +=         '"isPASSVerify": "Y",';
		postData +=         '"isUserAgreement": "Y"';
		postData +=     '},';
		postData +=     '"compareCI": ' + (isNonMember? true : false);
        if (isNonMember) {
            // 비회원 로그인 추가 쿼리
            postData +=         ',"useMdlSsn": true';
        }
		postData += '}';

		retObj.postResult = postData;
		retObj.reqTxId = reqTxId;
        retObj.cxId = cxId;
	} catch (e) {
		console.log(e.message);
		retObj.error_code = E_IBX_SITE_INVALID_MASK;
		return retObj;
	}

	return retObj;
};

/**
* 공공기관 간편인증 로그인 결과 확인
 * @param host
 * @param url
 * @param postResult
 * @returns Object
 */

function getSimpleAuthResult (host, url, postResult) {
    console.log('common.js/getSimpleAuthResult 호출![' + CommonVersion + ']');

	var retObj = {
        error_code		: S_IBX_OK,
		error_message	: "",
		token			: ""
    };

    userAgent = '{"Connection":"keep-alive",';
    userAgent += '"Accept":"text/plain, */*; q=0.01",';
    userAgent += '"Content-Type":"application/json; charset=UTF-8",';
    userAgent += '"X-Requested-With":"XMLHttpRequest",';
    userAgent += '"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.118 Whale/2.11.126.23 Safari/537.36"}';

    if (httpRequest.postWithUserAgent(userAgent, host + url, postResult) == false) {
		retObj.error_code = E_IBX_FAILTOGETPAGE;
        return retObj;
    }
    var ResultStr = httpRequest.result + '';
    console.log('getSimpleAuthResult : ' + ResultStr);

    // 토큰 유효 시간 만료.. (5분 넘으면 오류.)
    if (ResultStr.indexOf('토큰 유효 시간 만료') > -1 ||
        ResultStr.indexOf('"OACX_TOKEN_EXPIRED"') > -1) {
		retObj.error_code = E_IBX_AUTHENTICATION_TOKEN_VALIDITY_EXPIRED;
        return retObj;
    }
    if(ResultStr.indexOf('내부 서버 오류입니다.') > -1){
        retObj.error_code = E_IBX_SITE_INTERNAL;
        return retObj;
    }
    if(ResultStr.indexOf('주민번호가 유효하지 않습니다') > -1){
        retObj.error_code = E_IBX_REGNO_RESIDENT_INVALID;
        return retObj;
    }
    if (ResultStr.indexOf('"OACX_SUCCESS"') < 0) {
        console.log("모바일에서 인증을 실패하였습니다. 모바일에서 인증을 다시 해주세요.");
		retObj.error_code = E_IBX_NOT_SIGNED_AUTHENTICATION;
        return retObj;
    }

    // "token": ", "token":" 불안정으로 인하여 JSON 객체로 처리함
    // if (ResultStr.indexOf('"token":"') < 0) {
    // 	retObj.error_code = E_IBX_SITE_INVALID + 3;
    //     return retObj;
    // }

    try {
        var token = JSON.parse(ResultStr).token;
    } catch (e) {
        retObj.error_code = E_IBX_SITE_INVALID;
        return retObj;
    }

    if (!token) {
        retObj.error_code = E_IBX_SITE_INVALID + 1;
        return retObj;
    }

    retObj.token = token;
    retObj.ResultStr = ResultStr;

	return retObj;
};





