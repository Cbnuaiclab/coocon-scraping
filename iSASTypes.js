/* common error code */
/* jshint -W009, -W020, -W061, -W088, -W104 */

// successful
const S_IBX_OK                                   = 0x00000000;  // 성공
const S_IBX_TRANS_JUDGE_SUCCESS                  = 0x00000001;  // 이체심사 승인 완료
const S_IBX_TRANS_JUDGE_REFUSE                   = 0x00000002;  // 이체심사 거절 완료


// information code
const I_IBX_NOMORENEXTPAGE                       = 0x41110000;  // 다음페이지 없음(내부처리용)
const I_IBX_NOMOREPREVPAGE                       = 0x41120000;  // 이전 페이지 없음(내부처리용)
const I_IBX_DEPENDNEXTRESULT                     = 0x41130000;  // 다음 결과에 의존적인 처리 필요(내부처리용)


const I_IBX_RESULT_NOTPRESENT                    = 0x42110000;  // 결과 없음    (대법원 대국민서비스, 경매정보: 존재하지 않는 사건도 $42110000)
// 제거(42110001)
//const I_IBX_CONTENTS_NOTPRESENT                  = 0x42110001;  // 결과 항목없음(대법원 사건명에 따라 항목 자체가 없는 경우를 구분하기 위해 사용)
const I_IBX_RESULT_NEEDVERIFICATION              = 0x42120000;  // 결과 확인 필요
const I_IBX_RESULT_EXECUTE_ERROR                 = 0x42120001;  // 성공이나 후처리중 오류 발생
const I_IBX_RESULT_NEEDDETAILERROR               = 0x42120002;  // 이체 등록에 실패하였습니다. 건별 오류 내용 확인 후 다시 거래하시기 바랍니다.
// 일정 수 이상의 데이터를 보유한 고객의 경우 CSV데이터 취득이 불가능
const I_IBX_RESULT_PARTIAL_COUNT_OVER            = 0x42120003;  // 사이트에서 출력 가능한 내역 건수를 초과하는 데이터가 존재합니다.
const I_IBX_RESULT_REMIT_CHECK_NEED              = 0x42120004;  // 이체가 승인되었지만 사이트에서 결과 확인이 필요합니다.

const I_IBX_RESULT_MIXED_DISPOSITNINSTALLMENT    = 0x42120011;  // 수시입출금/정기예적금 구분 불가능
const I_IBX_RESULT_MIXED_DISPOSITNLOAN           = 0x42120101;
  // 수시입출금/대출금 구분 불가능
const I_IBX_RESULT_MIXED_INSTALLMENTNLOAN        = 0x42120110;  // 정기예적금/대출금 구분 불가능
const I_IBX_RESULT_MIXED_ALL                     = 0x42120111;  // 모두 구분 불가능
const I_IBX_SEARCH_TARGET_INVALID                = 0x42120200;  // 보험료 고지/납부 대상이 아닙니다. 확인 후 다시 거래하시기 바랍니다.
const I_IBX_SEARCH_NOT_TARGET                    = 0x42120201;  // 대상자가 아닙니다. 확인 후 다시 거래하시기 바랍니다.
const I_IBX_VIOLATED_BUILD_RESULT                = 0x42120202;  // 위반건축물 입니다. 결과 사용에 참고 바랍니다.

// 로그아웃 서비스 존재하지 않을경우
const I_IBX_NO_LOGOUTSERVICE                     = 0x42130000;  // 해당 기관의 경우 로그아웃 기능이 존재하지 않습니다. 확인 후 다시 이용하시기 바랍니다.



// system error
const E_IBX_LIBRARY_UPDATE                       = 0x8000A000; // 최신 라이브러리로 업데이트가 필요합니다.

const E_IBX_UNKNOWN                              = 0x8000FFFF;  // 알 수 없는 오류

const E_IBX_NOTENOUGHMEMORY                      = 0x8000F100;  // 메모리 부족
const E_IBX_TIMEOUT                              = 0x8000F101;  // 시간 초과
const E_IBX_FORCECANCEL                          = 0x8000F102;  // 강제 취소
const E_IBX_FILENOTFOUND                         = 0x8000F103;  // 스크래핑모듈 파일없음

// 주의!  스크래핑엔진 사용 요류코드
// 주의!  8000F104 ~ 8000F107는 스크래핑 모듈에서 사용 불가
const E_IBX_FAILTOCREATEPROCESS                  = 0x8000F104;  // 스크래핑모듈 실행실패
const E_IBX_INVALID_CODESIGN                     = 0x8000F105;  // 스크래핑모듈의 전자서명 확인에 실패하였습니다.

//엔진 오류코드
//  1.기본 오류
//    "80000001", "요청전문(JSON)형식이 잘못되었습니다."
//    "80000002", "지원하지 않는 ios 버젼입니다." / "SASManager Context를 세팅 하지 않았습니다."
//  2.업데이트 서버 접속 실패
//    "80001000", "서비스에 연결할 수 없습니다. 인터넷 연결을 확인하고 다시 시도해주십시오."
//  3.업데이트 서버 접속 성공, 업데이트 실패 - Module API 업데이트 실패(Include API 없을 경우도 포함)
//    "8000F103", "해당 모듈이 존재하지 않습니다. 해당 거래의 지원여부를 확인하여 주십시오."
//  4.실행 실패 - Include API 업데이트 실패 포함(모듈 업데이트 시 업데이트 서버에 정상적으로 로드되지 않으 경우)
//    "8000F104", "해당 모듈을 실행하는데 실패하였습니다." <- 모든 예외 상황 포함
//    "8000F105",
//    "8000F106",
//    "8000F107",

const E_IBX_FAILTOPROCESS                        = 0x8000F110;  // 해당 모듈을 실행하는데 실패하였습니다. 잠시 후 다시 이용하시기 바랍니다.
const E_IBX_FAILTOSETCLASS                       = 0x8000F111;  // Class명과 Job명을 확인해주시기 바랍니다.

const E_IBX_FAILTOINITCOM                        = 0x8000E000;  // 보안 모듈 초기화 실패
const E_IBX_FAILTOCOMFUNC                        = 0x8000E100;  // 보안 메소드 호출 실패 시작
const E_IBX_FAILTOCOMFUNC_MASK                   = 0x8000E1FF;  // 보안 메소드 호출 실패 끝

const E_IBX_FAILTOGETPAGE                        = 0x8000E200;  // http 호출 실패/서버 응답 없음 시작
const E_IBX_FAILTOGETPAGE_MASK                   = 0x8000E2FF;  // http 호출 실패/서버 응답 없음 끝
const E_IBX_FAILTTOSETCOOKIEL                    = 0x8000E301;  // http cookie 설정 실패
const E_IBX_FAILTTOGETCOOKIEL                    = 0x8000E302;  // http cookie 설정 실패

const E_IBX_ENV_USEONLY_PC                       = 0x8000E310;  // 모바일 환경(핫스팟 또는 테더링, Egg)은 지원되지 않습니다. PC 환경에서 이용해주시기 바랍니다.

const E_IBX_FAILTOAOS_UNKNOWN                    = 0x8000E400;  // AosSDK 오류 Begin
const E_IBX_FAILTOAOSFORMAT                      = 0x8000E401;  // AosSDK ParamFlags 오류
const E_IBX_FAILTOAOSFILEEXISTS                  = 0x8000E403;  // AosSDK FileExists 오류
const E_IBX_FAILTOAOSCHECK                       = 0x8000E404;  // AosSDK Check 오류
const E_IBX_FAILTOAOSUPDATE                      = 0x8000E405;  // AosSDK Update 오류
const E_IBX_FAILTOAOSINIT                        = 0x8000E411;  // AosSDK Init 오류
const E_IBX_FAILTOAOSINIT_MASK                   = 0x8000E41F;  // AosSDK Init 오류 Mask
const E_IBX_FAILTOAOSUNINIT                      = 0x8000E421;  // AosSDK Uninit 오류
const E_IBX_FAILTOAOSUNINIT_MASK                 = 0x8000E42F;  // AosSDK Uninit 오류 Mask
const E_IBX_FAILTOAOS_MASK                       = 0x8000E4FF;  // AosSDK 오류 Mask


const E_IBX_FAILTOVVHD_UNKNOWN                   = 0x8000E500;  // VVHD 오류 Begin
const E_IBX_FAILTOVVHD_GETVER                    = 0x8000E501;  // VVHD 버전확인 실패
const E_IBX_FAILTOVVHD_INSTALL                   = 0x8000E502;  // VVHD INSTALL 실패
const E_IBX_FAILTOVVHD_ISINSTALLED               = 0x8000E503;  // VVHD ISINSTALLED 실패
const E_IBX_FAILTOVVHD_UNINSTALL                 = 0x8000E504;  // VVHD UNINSTALL 실패
const E_IBX_FAILTOVVHD_CONNECT                   = 0x8000E505;  // VVHD CONNECT 실패
const E_IBX_FAILTOVVHD_DISCONNECT                = 0x8000E506;  // VVHD DISCONNECT 실패
const E_IBX_FAILTOVVHD_WRITEREPORT               = 0x8000E507;  // VVHD WRITEREPORT 실패
const E_IBX_FAILTOVVHD_FOUND                     = 0x8000E508;  // VVHD 설치된 드러이버 검색 실패
const E_IBX_FAILTOVVHD_LOAD                      = 0x8000E510;  // VVHD Load 실패
const E_IBX_FAILTOVVHD_LOAD_MASK                 = 0x8000E51F;  // VVHD Load 실패 Mask
const E_IBX_FAILTOVVHD_UNLOAD                    = 0x8000E520;  // VVHD Unload 실패
const E_IBX_FAILTOVVHD_UNLOAD_MASK               = 0x8000E52F;  // VVHD Unload 실패 Mask
const E_IBX_FAILTOVVHD_INIT                      = 0x8000E530;  // VVHD init 오류
//     = 연산을 위한 내부 메모리 할당에 실패한 경우
// + 1 = 입력된(제공된) 메모리버퍼의 크기가 충분하지 않을 경우
// + 2 = VvhdConnect 함수의 인자로 입력된 라이선스 키의 길이가 유효하지 않은 경우(라이선스 키 길이는 16-byte 의 배수)
// + 3 = VvhdConnect 함수의 인자로 입력된 라이선스 키의 첫 번째 구성요소 타입이 잘못된 경우 라이선스 키의 첫 번째 구성요소는 반드시 header 타입이 되어야 한다
// + 4 = VvhdConnect 함수의 인자로 입력된 라이선스 키의 길이정보가 헤더에 기록되 있는 정보와 일치하지 않는 경우
// + 5 = VvhdConnect 함수의 인자로 입력된 라이선스 키의 해쉬정보가 일치하지 않는 경우
const E_IBX_FAILTOVVHD_INIT_MASK                 = 0x8000E53F;  // VVHD init 오류 Mask
const E_IBX_FAILTOVVHD_UNINIT                    = 0x8000E540;  // VVHD Uninit 오류
const E_IBX_FAILTOVVHD_UNINIT_MASK               = 0x8000E54F;  // VVHD Uninit 오류 Mask
const E_IBX_FAILTOVVHD_API                       = 0x8000E550;  // VVHD API 호출 실패
// + 1 = VvhdConnect API 호출 시 시스템 장치 열거(SetupDiGetClassDevs)를 위한 SetupAPI 실패
// + 2 = VvhdConnect API 호출 시 장치 인터페이스 상세 정보 획득(SetupDiGetDeviceInterfaceDetail)을 위한 SetupAPI 실패
// + 3 = VvhdConnect API 호출 시 장치 인터페이스 열기(CreateFile)에 실패
// + 4 = HID 인터페이스를 발견했으나 찾고자 하는 대상이 아닌 경우
// + 5 = 지원되지 않는 타입의 장치를 제어하고자 시도한 경우
// + 6 = 지원되지 않는 API를 호출한 경우
const E_IBX_FAILTOVVHD_API_MASK                  = 0x8000E55F;  // VVHD API 호출 실패
const E_IBX_FAILTOVVHD_PARAMETER                 = 0x8000E560;  // VVHD 파라미터 입력 오류
const E_IBX_FAILTOVVHD_PARAMETER_MASK            = 0x8000E56F;  // VVHD 파라미터 입력 오류 Mask
const E_IBX_FAILTOVVHD_RESULT                    = 0x8000E570;  // VVHD 입력 오류 (가상키보드 드라이브 입력에 문제가 발생했습니다. 다시 시도해주시기 바랍니다.)
const E_IBX_FAILTOVVHD_RESULT_MASK               = 0x8000E57F;  // VVHD 입력 오류 Mask
const E_IBX_FAILTOVVHD_MASK                      = 0x8000E5FF;  // VVHD 오류 Mask

const E_IBX_FAILTOSCK_UNKNOWN                    = 0x8000E600;  // 키보드 보안 관련 오류 (키보드보안 관련 확인이 필요합니다.)

const E_IBX_ERRORINAPPLICATION                   = 0x80002100;  // 응용 프로그램 에러 영역 시작
const E_IBX_ERRORINAPPLICATION_MASK              = 0x800021FF;  // 응용 프로그램 에러 영역 끝
const E_IBX_SERVICE_TOBE_APPLIED                 = 0x80002121;  // 요청하신 거래는 향후 적용예정이며 자세한 사항은 고객센터로 문의하시기 바랍니다.

const E_IBX_RESULT_FAIL                          = 0x80002F10;  // 결과 실패
const E_IBX_RESULT_OMISSION                      = 0x80002F11;  // 원본데이터(웹사이트) 누락
const E_IBX_RESULT_VERFY_FAIL                    = 0x80002F12;  // 결과 검증 실패
const E_IBX_RESULT_ORDER_VERFY_FAIL              = 0x80002F13;  // 결과 검증 실패(거래 순서)
const E_IBX_SESSION_CLOSED                       = 0x80002F20;  // 세션 종료
const E_IBX_SESSION_REMAINED                     = 0x80002F21;  // 이전 세션 미종료
const E_IBX_SITE_RESPONSE_TIME_OUT               = 0x80002F22;  // 입금 은행 또는 연계 기관 거래 응답시간 초과입니다.
const E_IBX_SITE_INTERNAL                        = 0x80002F30;  // 서버측 에러
const E_IBX_SITE_INVALID                         = 0x80002F31;  // 사이트 변경(페이지 변경) 시작
const E_IBX_SITE_INVALID_MASK                    = 0x80002F3F;  // 사이트 변경(페이지 변경) 끝



// 인증서 자동제출시 사용되는 상수
// 모들을 위하여 임의적인 수정 금지. 변경시 반드시 iHook.iBx 도 같이 업데이트 되어야 함.
const S_IHOOK_OK                         = 0x00000000;            // iHook 관련 성공
const E_IHOOK_UNKNOWN                    = 0x8000FFFF;       // iHook 관련 에러

const E_IHOOK_FAILTOINSTALLTHOOK         = 0x8000F000;  // 훅 설치 실패
const E_IHOOK_FAILTOUNINSTALLHOOK        = 0x8000F001;  // 훅 해제 실패
const E_IHOOK_WAITFORTIMEOUT             = 0x8000F002;  //

const E_IHOOK_INVALID_PINNO              = 0x8000F010;  // 잘못된 핀번호

const E_IHOOK_INVALID_CERTNAME           = 0x8000F020;  // 잘못된 인증서 이름
const E_IHOOK_INVALID_CERTEXPDATE        = 0x8000F021;  // 잘못된 인증서 만료일자
const E_IHOOK_INVALID_CERTORG            = 0x8000F022;  // 잘못된 인증서 발급기관
const E_IHOOK_INVALID_CERTPASSWORD       = 0x8000F023;  // 잘못된 인증서 비밀번호

const E_IHOOK_INVALID_HSM                = 0x8000F030;  // 잘못된 HSM 매체

const I_IHOOK_TYPE_SETITEMSTATE          = 0x20001000;
const I_IHOOK_TYPE_SHOWWINDOW            = 0x20001001;
const I_IHOOK_TYPE_STI_USB               = 0x20001002;
const I_IHOOK_TYPE_XECURE_USB            = 0x20001003;
const I_IHOOK_TYPE_INISAFE_SMART         = 0x20001004;
const I_IHOOK_TYPE_XECURE_HSM            = 0x20001005;
const I_IHOOK_TYPE_INISAFE_HSM           = 0x20001006;
const I_IHOOK_TYPE_SUBMIT                = 0x2000100F;
const I_IHOOK_TYPE_SETITEMSTATE_CHN      = 0x20001007;
const I_IHOOK_TYPE_SHOWWINDOW_CHN        = 0x20001008;
const I_IHOOK_TYPE_HTTP_CERT             = 0x20001009;
const I_IHOOK_TYPE_KB_OPEN               = 0x2000100A;
const I_IHOOK_TYPE_FORCE_SUBMIT          = 0x2000100B;
const I_IHOOK_TYPE_TIMER                 = 0x2000100C;

const I_IHOOK_TYPE_HSM_INISAFE1          = 0x20001010;  // 수협, 농협, 신한, 하나, 씨티, 경남등 일반적인 INISAFE
//        보안토큰 -> HSM 선택 ->
const I_IHOOK_TYPE_HSM_INISAFE2          = 0x20001011;  // 산업 : 저장토큰 -> 보안토큰 -> HSM 선택 ->
const I_IHOOK_TYPE_HSM_MOASIGN           = 0x20001020;  // 대구 : 보안토큰 -> HSM 선택 -> 확인하고 PIN 번호 입력창이 따로뜸
const I_IHOOK_TYPE_HSM_XECUREWEB         = 0x20001030;  // XecureWeb

const I_IHOOK_SCOPE_THREAD               = 0x20002000;
const I_IHOOK_SCOPE_GLOBAL               = 0x20002001;

const I_IHOOK_FLAG_LISTVIEW_SEL_PT       = 0x00000001;
const I_IHOOK_FLAG_LISTVIEW_SEL_COMMA    = 0x00000002;
const I_IHOOK_FLAG_LISTVIEW_SEL_BRACKETS = 0x00000004;
const I_IHOOK_FLAG_LISTVIEW_SEL_KEYBOARD = 0x00001000;
const I_IHOOK_FLAG_EDIT_CHAR_CONTROL     = 0x00000008;
const I_IHOOK_FLAG_SAMSUNGFIRE           = 0x00000010;
const I_IHOOK_FLAG_NO_REMOVABLE          = 0x00000020;
const I_IHOOK_FLAG_EVENT_CONTROL         = 0x00000040;
const I_IHOOK_FLAG_THREAD_CONTROL        = 0x00000080;
const I_IHOOK_FLAG_CHN_SELECT            = 0x00000100;
const I_IHOOK_FLAG_CHN_SUBMIT            = 0x00000200;
const I_IHOOK_FLAG_HSM_SELECT            = 0x00000400;
const I_IHOOK_FLAG_LISTVIEW_SEL_EX       = 0x00000800;

/* server-side error code : 표준 */

// key parameter error
const E_IBX_KEY_ACCOUNT_INFO_1_NOTENTER                   = 0x80004000;  // 계정 정보 1 미입력
const E_IBX_KEY_ACCOUNT_INFO_1_INVALID                    = 0x80004001;  // 잘못된 계정 정보 1(인증서명, USB Pin 번호)
const E_IBX_KEY_ACCOUNT_INFO_1_DENIED                     = 0x80004002;  // 제한된 계정 정보 1(인증서명, USB Pin 번호)
const E_IBX_KEY_ACCOUNT_INFO_1_MISC                       = 0x80004003;  // 계정 정보 1 기타오류
const E_IBX_KEY_ACCOUNT_INFO_1_NOTINSERT                  = 0x80004004;  // USB Key 연결되지 않았습니다.
const E_IBX_KEY_ACCOUNT_INFO_1_NOMATCH                    = 0x80004005;  // 본인확인에 실패하였습니다. 신청자의 인증서인지 확인하시기 바랍니다.

const E_IBX_KEY_ACCOUNT_INFO_2_NOTENTER                   = 0x80004010;  // 계정 정보 2(사용자명-ID) 미입력
const E_IBX_KEY_ACCOUNT_INFO_2_INVALID                    = 0x80004011;  // 잘못된 계정 정보 2(사용자명-ID)
const E_IBX_KEY_ACCOUNT_INFO_2_DENIED                     = 0x80004012;  // 제한된 계정 정보 2(사용자명-ID)
const E_IBX_KEY_ACCOUNT_INFO_2_MISC                       = 0x80004013;  // 계정 정보 2(사용자명-ID) 기타오류
const E_IBX_KEY_ACCOUNT_INFO_2_INVALID_2                  = 0x80004014;  // 잘못된 계정 정보 2(ID 포함한 계정정보)
const E_IBX_KEY_ACCOUNT_INFO_2_DIGIT_EXCEED               = 0x80004019;  // 사이트에서 허용한 계정 ID 자릿수를 초과했습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오

const E_IBX_KEY_ACCOUNT_INFO_AUX_1_NOTENTER               = 0x80004020;  // 계정 부가 정보 1(인증기관명) 미입력
const E_IBX_KEY_ACCOUNT_INFO_AUX_1_INVALID                = 0x80004021;  // 잘못된 계정 부가 정보 1(인증기관명)
const E_IBX_KEY_ACCOUNT_INFO_AUX_1_DENIED                 = 0x80004022;  // 제한된 계정 부가 정보 1(인증기관명)
const E_IBX_KEY_ACCOUNT_INFO_AUX_1_MISC                   = 0x80004023;  // 계정 부가 정보 1(인증기관명) 기타오류

const E_IBX_KEY_ACCOUNT_INFO_AUX_2_NOTENTER               = 0x80004030;  // 계정 부가 정보 2(민증서 만료일) 미입력
const E_IBX_KEY_ACCOUNT_INFO_AUX_2_INVALID                = 0x80004031;  // 잘못된 계정 부가 정보 2(민증서 만료일)
const E_IBX_KEY_ACCOUNT_INFO_AUX_2_DENIED                 = 0x80004032;  // 제한된 계정 부가 정보 2(민증서 만료일)
const E_IBX_KEY_ACCOUNT_INFO_AUX_2_MISC                   = 0x80004033;  // 계정 부가 정보 2(민증서 만료일) 기타오류

const E_IBX_KEY_ACCOUNT_PASSWORD_1_NOTENTER               = 0x80004040;  // 계정 비밀번호 1(인증서 비밀번호) 미입력
const E_IBX_KEY_ACCOUNT_PASSWORD_1_INVALID                = 0x80004041;  // 잘못된 계정 비밀번호 1(인증서 비밀번호)
const E_IBX_KEY_ACCOUNT_PASSWORD_1_JUSTBEFOREDENY         = 0x80004042;  // 제한직전 계정 비밀번호 1
const E_IBX_KEY_ACCOUNT_PASSWORD_1_DENIED                 = 0x80004043;  // 제한된 계정 비밀번호 1(인증서 비밀번호)
const E_IBX_KEY_ACCOUNT_PASSWORD_1_MISC                   = 0x80004044;  // 계정 비밀번호 1(인증서 비밀번호) 기타오류

const E_IBX_KEY_ACCOUNT_PASSWORD_2_NOTENTER               = 0x80004050;  // 계정 비밀번호 2(사용자 비밀번호) 미입력
const E_IBX_KEY_ACCOUNT_PASSWORD_2_INVALID                = 0x80004051;  // 잘못된 계정 비밀번호 2(사용자 비밀번호)
const E_IBX_KEY_ACCOUNT_PASSWORD_2_JUSTBEFOREDENY         = 0x80004052;  // 제한직전 계정 비밀번호 2
const E_IBX_KEY_ACCOUNT_PASSWORD_2_DENIED                 = 0x80004053;  // 제한된 계정 비밀번호 2(사용자 비밀번호)
const E_IBX_KEY_ACCOUNT_PASSWORD_2_MISC                   = 0x80004054;  // 계정 비밀번호 2(사용자 비밀번호) 기타오류
const E_IBX_KEY_ACCOUNT_PASSWORD_2_OTP                    = 0x80004055;  // 계정 비밀번호 또는 OTP 오류
const E_IBX_KEY_ACCOUNT_PASSWORD_2_DENIED_SPECIAL_CHAR    = 0x80004056;  // 계정 비밀번호 2(사용자 비밀번호)에 제한된 특수문자 입력
const E_IBX_KEY_ACCOUNT_PASSWORD_2_DIGIT_EXCEED           = 0x80004057;  // 사이트에서 허용한 계정 비밀번호 자릿수를 초과했습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오
const E_IBX_KEY_ACCOUNT_PASSWORD_2_TEMP_PW_USER           = 0x80004058;  // 임시비밀번호 사용자 입니다. 해당 기관 홈페이지에서 등록 후 다시 이용하시기 바랍니다.

const E_IBX_CERTIFY_NOT_FOUND                    = 0x80004100;  // 인증서를 찾을수 없음
const E_IBX_CERTIFY_PASSWORD_INVALID             = 0x80004101;  // 인증서 비밀번호 오류
const E_IBX_CERTIFY_UNKNOWN                      = 0x80004102;  // 인증서관련 알수없는 오류
const E_IBX_CERTIFY_EXCEED_MAXNUM                = 0x80004103;  // 처리가능한 인증서 갯수 초과 오류
const E_IBX_CERTIFY_EXCEED_DATE                  = 0x80004104;  // 만료된 인증서
const E_IBX_CERTIFY_ALREADY_REGISTER             = 0x80004105;  // 해당 인증서는 고객님의 다른 이용자에 이미 등록되어있습니다.인증서는 반드시 이용자별로 등록하셔야 합니다.
const E_IBX_CERTIFY_INITIALIZATION_FAIL          = 0x80004106;  // 인증서창 초기화 실패
const E_IBX_CERTIFY_NOT_REGISTER                 = 0x80004107;  // (타기관)인증서가 등록되지 않음
const E_IBX_CERTIFY_CANCEL_REGISTER              = 0x80004108;  // 인증서 제출 취소

const E_IBX_CERTIFY_USBKEY_DISCORD               = 0x80004109;  // USB-KEY의 인증서가 관리자의 인증서와 일치하지 않습니다
const E_IBX_CERTIFY_DISCORD                      = 0x80004110;  // 제출하신 인증서 정보와 은행에 등록된 인증서 정보가 일치하지 않습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CERTIFY_DISUSE                       = 0x80004111;  // 제출하신 인증서는 폐기된 인증서 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CERTIFY_NOT_MUTUALINTERLOCK          = 0x80004112;  // 상호연동이 불가능한 인증서입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOGIN_FAIL                           = 0x80004113;  // 로그인 실패하였습니다. 해당 기관에서 인증서 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOGIN_TYPE_ERROR                     = 0x80004114;  // 해당 기관에 등록된 로그인 방식과 일치하지 않습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOGIN_REG_CERT_FAIL                  = 0x80004115;  // 인증서의 주민번호와 입력고객의 주민번호가 일치하지 않습니다.
const E_IBX_BROWSERVERSION_INVALID               = 0x80004116;  // 지원하지 않는 브라우저 버전입니다.
const E_IBX_CERTIFY_DUE_EXCEED_DATE              = 0x80004117;  // 제출하신 인증서는 만료 예정인 인증서입니다. 해당기관에서 인증서 갱신 후 다시 거래하시기 바랍니다.
const E_IBX_LOGIN_EXCEED                         = 0x80004118;  // 일일 로그인 허용횟수 초과입니다. 더이상 당일 조회가 불가합니다.
const E_IBX_LOGIN_NONE_SERVICE                   = 0x80004119;  // 해당 서비스에서 지원하지 않는 로그인 방식입니다.
const E_IBX_CERTIFY_TAX_ONLY                     = 0x80004121;  // 전자세금계산서용 인증서로 서비스 불가합니다. 금융 또는 범용 인증서로 거래해 주세요.
const E_IBX_LOGIN_SLEEP_ACCOUNT                  = 0x80004122;  // 휴면 계정입니다. 사이트 확인하시기 바랍니다.
const E_IBX_LOGIN_ID_ONLY                        = 0x80004123;  // 복수ID를 보유하신 경우 공인인증서 로그인이 불가능합니다. ID 로그인하시기 바랍니다.
const E_IBX_INSURANCE_ID_UNAVAILABLE             = 0x80004124;  // 사용할 수 없는 아이디 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INSURANCE_NUMBER_INVALID             = 0x80004126;  // 유효한 인증번호가 아닙니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_AFTER_LOGIN_SERVICE                  = 0x80004128;  // 로그인 후 이용 가능한 서비스 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOGIN_COOPERATION_CODE_INVALID       = 0x80004129;  // 잘못된 로그인정보 (협력사코드 또는 아이디 또는 비밀번호)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_MEMBER_NEED_APP_LOGIN                = 0x80004130;  // 모바일 앱 최초 로그인 필요한 사용자
const E_IBX_LOGIN_RESTRICTED_DUE_AUTH_FAILED     = 0x80004131;  // 반복된 인증 실패로 로그인이 제한됩니다. 당일 조회가 불가합니다.

// 간편인증
const E_IBX_NOT_SIGNED_AUTHENTICATION                   = 0x80004132;  // 서명되지 않았습니다. 휴대폰에서 인증 메시지를 확인후 인증을 진행해주세요. 인증 요청이 오지 않았다면 간편인증 화면을 닫고 다시 실행 부탁드립니다.
const E_IBX_AUTHENTICATION_TOKEN_VALIDITY_EXPIRED       = 0x80004133;  // 간편인증 화면을 닫고 다시 실행 부탁드립니다. 사유 : 토큰 유효 시간 만료
const E_IBX_AUTHENTICATION_FAIL                         = 0x80004134;  // 간편인증 실패하였습니다. 해당 기관에서 확인 후 다시 거래하시기 바랍니다.
const E_IBX_AUTHENTICATION_NOT_MEMBER                   = 0x80004135;  // 선택하신 간편인증서비스에 등록된 사용자가 아닙니다. 선택하신 인증서비스 가입 후 사용해주시기 바랍니다.

const E_IBX_SERVICE_NOTIME                       = 0x80002E10;  // 서비스 시간외
const E_IBX_SERVICE_INVALID                      = 0x80002E11;  // 이용불가능 서비스
const E_IBX_SERVICE_SERVERBUSY                   = 0x80002E12;  // 서버 폭주
const E_IBX_SERVICE_DENIED                       = 0x80002E13;  // 제한된 서비스
const E_IBX_SERVICE_MISC                         = 0x80002E14;  // 서비스 기타 오류
const E_IBX_SERVICE_INVALID_2                    = 0x80002E15;  // 간편조회 되지않음
// 에러 메세지 : [빠른조회서비스가 제공되지 않은 은행입니다. 인증서조회를 실행하십시오.]
const E_IBX_SERVICE_DENIED_2                     = 0x80002E16;  // 간편조회는 서비스하나 인터넷뱅킹/ 영업점에서 등록이 필요한 경우
                                                                // 해당 계좌는 빠른서비스 조회계좌로 등록되지 않았습니다. 해당 은행에서 빠른 서비스 조회계좌로 등록 후 거래 하십시오.
// 에러 메세지 : []
const E_IBX_SERVICE_TIME_LIMIT                   = 0x80002E17;  // 제일은행 빠른조회시 한번 조회 한 후 30초 이내에 조회불가함.
// [빠른조회시 한번 조회 한 후 30초 이내에 조회 할 수 없습니다. 잠시 후 다시 실행 하여 주시기 바랍니다. ]
// [30초 이내에 동일한 계좌를 연속 조회 할 수 없습니다. 잠시 후 다시 실행 하여 주시기 바랍니다.         ]
const E_IBX_SERVICE_FOREIGN_DENIED               = 0x80002E18;  // 해외에서의 이용이 차단되어 있습니다. 확인 후 다시 거래하십시오.
const E_IBX_SERVICE_HOLIDAY_DENIED               = 0x80002E19;  // 명절 거래 제한
const E_IBX_SERVICE_RESULT_NOTPRESENT_DENIED     = 0x80002E20;  // 우체국 빠른조회시 최근 3개월간 거래내역이 없을 경우 잔액조회가 되지 않음.
// [해당내역이 존재하지 않습니다. 최근 거래내역이 없을 경우 해당 사이트에서 정보를 제공하지 않습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오.]
const E_IBX_SERVICE_LOGOUT                       = 0x80002E21;  // 중복로그인으로 로그아웃 처리 되었습니다. 잠시 후 다시 실행하여 주시기 바랍니다.
const E_IBX_SERVICE_USER_INVALID                 = 0x80002E22;  // 서비스 가능하지 않은 사용자입니다. 개인/기업 사용자 확인 후 다시 거래하십시오.
const E_IBX_SERVICE_COMMITEMENT_NOTREGISTERED    = 0x80002E23;  // 약정 정보가 없습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오
const E_IBX_SERVICE_DENIED_IN_REMOTE             = 0x80002E24;  // 원격프로그램이 탐지되었습니다. 원격프로그램을 종료후 거래를 이용 해 주시기 바랍니다.
const E_IBX_SERVICE_DENIED_4                     = 0x80002E25;  // 비정상적인 접속으로 해당 사이트의 보안정책에 의해 차단되었습니다.

const E_IBX_SERVICE_DENIED_DATE                  = 0x80002E26;  // 가입다음날부터 이용하실 수 있습니다. 확인 후 다시 거래하십시오.
const E_IBX_SERVICE_TIME_LIMIT_2                 = 0x80002E27;  // 홈택스 사업자등록상태조회시 한번 조회 한 후 5초 이내에 조회불가함.
// [5초 후 부터 조회 가능합니다. 잠시 후 다시 실행 하여 주시기 바랍니다. ]

const E_IBX_SERVICE_CUSTOMER_INFO_CHANGE 		 = 0x80002E28;  // 고객정보 변경이 필요한 사용자 입니다. 해당 기관 홈페이지 로그인하여 확인 후 다시 거래하십시오.
const E_IBX_SERVICE_ACCOUNT_INVALID              = 0x80002E29;  // 관리자계정으로 로그인시도 하였습니다. 이용자계정으로 다시 거래하십시오.
const E_IBX_SERVICE_NOTICE_CHECK_NEED            = 0x80002E30;  // 홈페이지 공지사항의 확인이 필요합니다. 해당 기관 홈페이지에 접속하셔서 확인 후 다시 거래하십시오.
const E_IBX_SERVICE_REGISTER_NEED                = 0x80002E31;  // 본서비스를 이용하기 위해서는 연계하는 기관의 서비스 개시 절차가 필요합니다. 절차에 대해서는 해당금융기관 사이트에서 확인하시기 바랍니다.
const E_IBX_SERVICE_DENIED_NET_SECURITY          = 0x80002E32;  // 사용자 내부 방화벽 또는 보안프로그램으로 인하여 통신이 차단되고 있습니다. 내부 방화벽 또는 보안프로그램 상태 확인 후 다시 진행바랍니다.
const E_IBX_SERVICE_CDD_CHECK_NEED               = 0x80002E33;  // 고객확인제도(CDD) 재이행주기가 도래했습니다. 해당 기관 홈페이지에 접속하셔서 고객확인(KYC) 후 거래해 주십시오
const E_IBX_SERVICE_NEED_PREPROCESSING           = 0x80002E34;  // 선행처리가 필요한 서비스 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_SERVICE_AlREADY_SIGNED               = 0x80002E35;  // 선행된 인증이 있습니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_SERVICE_TIME_LIMIT_3                 = 0x80002E37;   // 1분이내에 동일한 인증서 로그인을 할 수 없습니다. 잠시 후 다시 실행 하여 주시기 바랍니다.
const E_IBX_SERVICE_TIME_LIMIT_4                 = 0x80002E38;   // 반복적인 호출은 시스템에 부하를 줄 수 있습니다. 60초 뒤에 다시 시도하세요.

const E_IBX_SERVICE_LOGOUT_FAIL                  = 0x80002E40;  // 로그아웃 실패하였습니다. 해당 기관 홈페이지에 접속하셔서 로그아웃 후 다시 거래하십시오.
const E_IBX_SERVICE_DENIED_5                     = 0x80002E41;  //해당 사이트가 자동 로그인에 의한 접근으로부터 보호되고 있습니다. 나중에 다시 시도해주십시오.
const E_IBX_SERVICE_DENIED_6                     = 0x80002E42;  //해당 사이트가 자동 로그인에 의한 접근으로부터 보호되고 있습니다. 나중에 다시 시도해주십시오.
const E_IBX_SERVICE_DENIED_7                     = 0x80002E43;  // 자동 입력 방지 문자 입력이 필요합니다. 해당 사이트에서 확인 후 이용하시기 바랍니다.

// common parameter error
const E_IBX_USER_ACCOUNT_NOTENTER                = 0x80002210;  // 사용자 계정 미입력
const E_IBX_USER_ACCOUNT_INVALID                 = 0x80002211;  // 잘못된 사용자 계정
const E_IBX_USER_ACCOUNT_DENIED                  = 0x80002212;  // 제한된 사용자 계정
const E_IBX_USER_ACCOUNT_MISC                    = 0x80002213;  // 사용자 계정 기타 오류
const E_IBX_USER_ACCOUNT_INVALID_2               = 0x80002214;  // 아이디 또는 패스워드가 정확하지 않습니다. 확인 후 다시 거래하십시오
const E_IBX_USER_ACCOUNT_ID_NOTREGISTERED        = 0x80002215;  // 입력한 아이디가 존재하지 않습니다.

const E_IBX_CUSTOMER_ID_NOTENTER                 = 0x80002216;  // 고객번호 미입력
const E_IBX_CUSTOMER_ID_INVALID                  = 0x80002217;  // 잘못된 고객번호
const E_IBX_CUSTOMER_ID_DENIED                   = 0x80002218;  // 제한된 고객번호
const E_IBX_CUSTOMER_ID_MISC                     = 0x80002219;  // 고객번호 기타 오류
const E_IBX_CUSTOMER_ID_MERGE                    = 0x80004015;  // 아이디 통합이 필요합니다. 해당 기관 홈페이지 로그인하여 확인 후 다시 거래하십시오.
const E_IBX_CUSTOMER_IS_NOT_MEMBER               = 0x80004016;  // 웹회원에 가입되어 있지 않은 고객님 입니다. 해당 사이트에 방문하여 회원가입 후 다시 거래하시기 바랍니다.
const E_IBX_MEMBER_ALREADY_REGISTER              = 0x80004017;  // 이미 가입된 회원입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_MEMBER_REGISTER_FAIL                 = 0x80004018;  // 회원가입에 실패하였습니다. 확인 후 거래하시기 바랍니다.


const E_IBX_USER_PASSWORD_NOTENTER               = 0x80002220;  // 사용자 비밀번호 미입력
const E_IBX_USER_PASSWORD_INVALID                = 0x80002221;  // 잘못된 사용자 비밀번호
const E_IBX_USER_PASSWORD_DENIED                 = 0x80002222;  // 제한된 사용자 비밀번호
const E_IBX_USER_PASSWORD_JUSTBEFOREDENY         = 0x80002223;  // 제한직전 사용자 비밀번호
const E_IBX_USER_PASSWORD_EXPIRED                = 0x80002224;  // 만료된 사용자 비밀번호
const E_IBX_USER_PASSWORD_MISC                   = 0x80002225;  // 사용자 비밀번호 기타 오류
const E_IBX_USER_PASSWORD_CONFIRM                = 0x80002226;  // 웹비밀번호 오류입니다. 해당 사이트에 방문하여 아이디 로그인 확인 후 거래하시기 바랍니다.
const E_IBX_USER_PASSWORD_LONGTIMEUSE            = 0x80002227;  // 장기간 같은 비밀번호 사용으로 인하여 발생하는 오류입니다. 패스워드 변경 후 다시 거래하시기 바랍니다.

const E_IBX_REGNO_RESIDENT_NOTENTER              = 0x80002230;  // 주민등록번호 미입력
const E_IBX_REGNO_RESIDENT_INVALID               = 0x80002231;  // 잘못된 주민등록번호
const E_IBX_REGNO_RESIDENT_DENIED                = 0x80002232;  // 제한된 주민등록번호
const E_IBX_REGNO_RESIDENTMISC                   = 0x80002233;  // 주민등록번호 기타 오류
const E_IBX_REGNO_RESIDENT_WRONG_USER            = 0x80002234;  // 주민등록번호와 이름이 다릅니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_REGNO_RESIDENT_WRONG_ACCNO   		   = 0x80002235;  // 잘못된 주민등록번호(사업자번호) 또는 계좌번호입니다. 확인 후 다시 거래하시기 바랍니다.

const E_RESULT_REGNO_TARGETREGNO_EQUAL           = 0x80002240;  // 조회자와 조회대상 사업자번호가 동일

const E_IBX_REGNO_COMPANY_NOTENTER               = 0x80002250;  // 사업자등록번호 미입력
const E_IBX_REGNO_COMPANY_INVALID                = 0x80002251;  // 잘못된 사업자등록번호
const E_IBX_REGNO_COMPANY_DENIED                 = 0x80002252;  // 제한된 사업자등록번호
const E_IBX_REGNO_COMPANY_MISC                   = 0x80002253;  // 사업자등록번호 기타 오류
const E_RESULT_TARGETREGNO_COMPANY_NOTENTER      = 0x80002254;  // 조회대상 사업자번호 미입력
const E_RESULT_TARGETREGNO_COMPANY_INVALID       = 0x80002255;  // 잘못된 조회대상 사업자번호
const E_RESULT_TARGETREGNO_COMPANY_CLOSED        = 0x80002256;  // 페업된 조회대상 사업자번호
const E_IBX_P00014_MINWON_NOT_AUTHORITY          = 0x80002257;  // 개인면세사업자만 신청 가능합니다. (법인 면세사업자, 일반 과세사업자 신청불가합니다. 사업자등록번호를 확인하시기 바랍니다.
const E_IBX_REGISTERED_BUSINESS_OWNER            = 0x80002258;  // 이미 등록된 수임사업자 정보입니다. 해당 사이트에서 확인 후 거래하시기 바랍니다.
const E_IBX_TARGETREGNO_COMPANY_MISC             = 0x80002259;  // 서비스 가능하지 않은 조회대상 사업자번호입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_BRANCH_REGNO_COMPANY_NOTENTER        = 0x80002260;  // 지사사업자번호 미입력
const E_IBX_BRANCH_REGNO_COMPANY_INVALID         = 0x80002261;  // 잘못된 지사사업자번호
const E_IBX_BRANCH_REGNO_COMPANY_DENIED          = 0x80002262;  // 제한된 지사사업자번호
const E_IBX_BRANCH_REGNO_COMPANY_MISC            = 0x80002263;  // 지사사업자번호 기타오류

const E_IBX_BRANCH_INFO_NOTENTER	               = 0x80002264;  // Branch를 입력하지 않으셨습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_BRANCH_INFO_INVALID		           = 0x80002265;  // 잘못된 Branch 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_BRANCH_INFO_MISC			           = 0x80002266;  // Branch 관련 알 수 없는 오류입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_ENUM_DATE_BEGIN_NOTENTER             = 0x80002310;  // 조회 시작일 미입력
const E_IBX_ENUM_DATE_BEGIN_INVALID              = 0x80002311;  // 잘못된 조회 시작일
const E_IBX_ENUM_DATE_BEGIN_DENIED               = 0x80002312;  // 서비스되지 않는 조회 시작일(기간)
const E_IBX_ENUM_DATE_BEGIN_GREATTHENEND         = 0x80002313;  // 종료일보다 이후의 조회 시작일
const E_IBX_ENUM_DATE_BEGIN_FUTURE               = 0x80002314;  // 미래의 날자의 조회 시작일
const E_IBX_ENUM_DATE_BEGIN_MISC                 = 0x80002315;  // 조회 시작일 기타 오류

const E_IBX_ENUM_DATE_END_NOTENTER               = 0x80002320;  // 조회 종료일 미입력
const E_IBX_ENUM_DATE_END_INVALID                = 0x80002321;  // 잘못된 조회 종료일
const E_IBX_ENUM_DATE_END_DENIED                 = 0x80002322;  // 서비스되지 않는 조회 종료일(기간)
const E_IBX_ENUM_DATE_END_LESSTHENBEGIN          = 0x80002323;  // 시작일보다 이전의 조회 종료일
const E_IBX_ENUM_DATE_END_FUTURE                 = 0x80002324;  // 미래의 날자의 조회 종료일
const E_IBX_ENUM_DATE_END_MISC                   = 0x80002325;  // 조회 종료일 기타 오류

const E_IBX_ENUM_DATE_YEAR_NOTENTER              = 0x80002330;  // 조회년도 미입력
const E_IBX_ENUM_DATE_YEAR_INVALID               = 0x80002331;  // 잘못된 조회년도
const E_IBX_ENUM_DATE_YEAR_DENIED                = 0x80002332;  // 서비스되지 않는 조회년도
const E_IBX_ENUM_DATE_YEAR_MISC                  = 0x80002333;  // 조회년도 기타 오류

const E_IBX_ENUM_BASIC_DATE_NOTENTER             = 0x80002334;  // 조회기준 정보 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ENUM_BASIC_DATE_INVALID              = 0x80002335;  // 잘못된 조회기준 정보입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_ENUM_DATE_SEASON_NOTENTER            = 0x80002336;  // 조회분기 미입력
const E_IBX_ENUM_DATE_SEASON_INVALID             = 0x80002337;  // 잘못된 조회분기
const E_IBX_ENUM_DATE_SEASON_DENIED              = 0x80002338;  // 서비스되지 않는 조회분기

const E_IBX_DATE_ANEW_NOTENTER                   = 0x80002350;  // 신규일자 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DATE_ANEW_INVALID                    = 0x80002351;  // 잘못된 신규일자입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DATE_ANEW_DENIED                     = 0x80002352;  // 서비스되지 않는 신규일자입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DATE_ANEW_FUTURE                     = 0x80002353;  // 미래의 날자의 신규일자입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DATE_ANEW_MISC                       = 0x80002354;  // 신규일자 기타 오류입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_EXP_DATE_NOTENTER                    = 0x80002355;  // 만료일자 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EXP_DATE_INVALID                     = 0x80002356;  // 잘못된 만료일자입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_ACCOUNT_NAME_NOTENTER                = 0x80002400;  // 계좌명 미입력
const E_IBX_ACCOUNT_NAME_INVALID                 = 0x80002401;  // 잘못된 계좌명
const E_IBX_ACCOUNT_NAME_DENIED                  = 0x80002402;  // 제한된 계좌명
const E_IBX_ACCOUNT_NAME_MISC                    = 0x80002403;  // 계좌명 기타 오류

const E_IBX_ACCOUNT_NO_NOTENTER                  = 0x80002410;  // 계좌번호 미입력
const E_IBX_ACCOUNT_NO_INVALID                   = 0x80002411;  // 잘못된 계좌번호
const E_IBX_ACCOUNT_NO_DENIED                    = 0x80002412;  // 제한된 계좌번호
const E_IBX_ACCOUNT_NO_NOTREGISTERED             = 0x80002413;  // 미등록 계좌번호
const E_IBX_ACCOUNT_NO_READONLY                  = 0x80002414;  // 출금 전용/조회만가능 계좌번호
const E_IBX_ACCOUNT_NO_WRITEONLY                 = 0x80002415;  // 입금 전용/조회불가능 계좌번호
const E_IBX_ACCOUNT_NO_MISC                      = 0x80002416;  // 계좌번호 기타 오류
const E_IBX_ACCOUNT_NO_CANCEL                    = 0x80002417;  // 해지된 계좌입니다. 확인 후 다시 거래하시기 바랍니다

const E_IBX_ACCOUNT_FEENO_NOTENTER               = 0x80002418;  // 수수료계좌번호 미입력
const E_IBX_ACCOUNT_FEENO_INVALID                = 0x80002419;  // 잘못된 수수료계좌번호

const E_IBX_ACCOUNT_PASSWORD_NOTENTER            = 0x80002420;  // 계좌 비밀번호 미입력
const E_IBX_ACCOUNT_PASSWORD_INVALID             = 0x80002421;  // 잘못된 계좌 비밀번호
const E_IBX_ACCOUNT_PASSWORD_DENIED              = 0x80002422;  // 제한된 계좌 비밀번호
const E_IBX_ACCOUNT_PASSWORD_JUSTBEFOREDENY      = 0x80002423;  // 제한직전 계좌 비밀번호
const E_IBX_ACCOUNT_PASSWORD_EXPIRED             = 0x80002424;  // 만료된 계좌 비밀번호
const E_IBX_ACCOUNT_PASSWORD_MISC                = 0x80002425;  // 계좌 비밀번호 기타 오류

const E_IBX_ACCOUNT_FEEPASSWORD_NOTENTER         = 0x80002426;  // 수수료계좌비밀번호 미입력
const E_IBX_ACCOUNT_FEEPASSWORD_INVALID          = 0x80002427;  // 잘못된 수수료계좌비밀번호
const E_IBX_ACCOUNT_REQUIRED_FEE                 = 0x80002428;  // 수수료 발생계좌입니다. 해당 사이트에서 확인 후 거래하시기 바랍니다.

const E_IBX_ACCOUNT_CLASS_NOTENTER               = 0x80002430;  // 계좌 분류 미입력
const E_IBX_ACCOUNT_CLASS_INVALID                = 0x80002431;  // 잘못된 계좌 분류
const E_IBX_ACCOUNT_CLASS_MISC                   = 0x80002432;  // 계좌 분류 기타 오류

const E_IBX_ACCOUNT_PROCESSDATE_ONLY             = 0x80002433;  // 기산일 기준 조회가 불가능한 계좌입니다. 확인 후 다시 거래하시기 바랍니다.
//  const E_IBX_SCRAPING_TYPE_NOTENTER               = 0x80002440;  // 스크래핑구분 미입력
//  const E_IBX_SCRAPING_TYPE_INVALID                = 0x80002441;  // 잘못된 스크래핑구분 값
const E_IBX_ACCOUNT_NO_INVALID2                  = 0x80002434;   // 해당 자료가 없습니다. 해지계좌/전자통장/휴면계좌/이지론계좌일 경우 조회되지 않습니다.
const E_IBX_ACCOUNT_RESULT_NOTPRESENT            = 0x80002435;  // 조회 가능한 계좌번호가 존재하지 않습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_SECURITY_CARD_NOT_CHOOSE              = 0x80002450;  // 보안카드 미선택
const E_IBX_SECURITY_OTP_NOT_CHOOSE               = 0x80002451;  // 해당 아이디에 등록된 보안 매체가 없습니다. 확인 후 다시 거래하십시오.


const E_IBX_COOPERATIVE_NO_INVALID                = 0x80002460;  // 거래를 할 수 없는 금고입니다. 합병된 금고의 경우 출금계좌를 다시 등록 후 이용하십시오

const E_IBX_CURRENCY_NOT_CONVERT                  = 0x80002470;  // 결과값을 금액으로 변환하는 과정에서 오류가 발생하였습니다. 확인 후 다시 이용하십시오.
const E_IBX_RESULT_LENGTH_OVER                    = 0x80002471;  // 결과값 처리 가능한 길이를 초과하였습니다.
const E_IBX_RESULT_COUNT_OVER                     = 0x80002472;  // 사이트에서 제공하는 결과처리 횟수를 초과하였습니다. 기간 조정 후 다시 거래하시기 바랍니다.
const E_IBX_RESULT_CURRENCY_ERROR                 = 0x80002473;  // 사이트에서 금액관련 오류가 발생하였습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오.
const E_IBX_RESULT_COUNT_OVERMUCH                 = 0x80002474; // 검색결과가 너무 많습니다. 조회정보 확인 후 다시 조회하시기 바랍니다.

const E_IBX_ACCOUNT_EXT1_NOTENTER                 = 0x80002480;  // 계좌번호 확장 미입력 - 실행번호를 입력하지 않으셨습니다. 확인 후 다시 거래하십시오.
const E_IBX_ACCOUNT_EXT1_INVALID                  = 0x80002481;  // 잘못된 계좌번호 확장 - 잘못된 실행번호 입니다. 확인 후 다시 거래하십시오.
const E_IBX_ACCOUNT_EXT1_MISC                     = 0x80002482;  // 계좌번호 확장 기타 오류 - 실행번호 관련 기타오류 입니다. 확인 후 다시 거래하십시오.
const E_IBX_ACCOUNT_DORMANCY                      = 0x80002483;  // 이 계좌는 휴먼계좌입니다. 확인 후 다시 거래하십시오.

const E_IBX_INQUIRY_PASSWORD_NOTENTER	          = 0x80002490;  // 조회용 비밀번호 미입력
const E_IBX_INQUIRY_PASSWORD_INVALID	          = 0x80002491;  // 잘못된 조회용 비밀번호
const E_IBX_INQUIRY_PASSWORD_DENIED	              = 0x80002492;  // 제한된 조회용 비밀번호
const E_IBX_INQUIRY_PASSWORD_JUSTBEFOREDENY	      = 0x80002493;  // 제한직전 조회용 비밀번호
const E_IBX_INQUIRY_PASSWORD_EXPIRED	          = 0x80002494;  // 만료된 조회용 비밀번호
const E_IBX_INQUIRY_PASSWORD_MISC	              = 0x80002495;  // 조회용 비밀번호 기타 오류

const E_IBX_LOAN_NUMBER_NOTENTER                  = 0x80002500;  // 대출번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOAN_NUMBER_INVALID                   = 0x80002501;  // 잘못된 대출번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOAN_NUMBER_MISC                      = 0x80002502;  // 대출번호 기타 오류입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_LOAN_INFO_NOTENTER                    = 0x80002510;  // 대출정보 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_LOAN_INFO_INVALID                     = 0x80002511;  // 잘못된 대출정보입니다. 확인 후 다시 거래하시기 바랍니다.


/* server-side error code : remit */

const E_IBX_CUSTOMER_CLASS_NOTENTER              = 0x80003110;  // 고객 구분 미입력
const E_IBX_CUSTOMER_CLASS_INVALID               = 0x80003111;  // 잘못된 고객 구분
const E_IBX_CUSTOMER_CLASS_MISC                  = 0x80003112;  // 고객 구분 기타 오류
const E_IBX_CUSTOMER_LONG_UNUSED                 = 0x80003113;  // 장기 미사용 고객입니다. 해당 사이트에서 확인 후 거래하시기 바랍니다.

const E_IBX_CUSTOMER_COMMITEMENT_NOTREGISTERED   = 0x80003114;  // 약정 정보가 없습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오
const E_IBX_CUSTOMER_NOT_AGREEMENT               = 0x80003115;  // 약관동의를 하지 않은 사용자입니다.
const E_IBX_CUSTOMER_NOT_MEMBER                  = 0x80003116;  // 사용(조회)가능등급 아님(본인 명의로 이동전화를 등록한 회원 이상 사용 가능)
const E_IBX_CUSTOMER_PERSON_CHECK                = 0x80003117;  // 본인확인 필요
const E_IBX_CUSTOMER_MOBILE_CHECK                = 0x80003118;  // 판매자 휴대폰 인증이 되지 않았습니다. 해당 사이트에서 인증 처리 후 조회하시기 바랍니다.
const E_IBX_CUSTOMER_MOBILE_CHECK_EXPIRED        = 0x80003119;  // 연락처 갱신이 되지 않았습니다. 해당 사이트에서 갱신 후 조회하시기 바랍니다.
const E_IBX_CUSTOMER_MOBILE_AUTHENTICATION_CHECK = 0x80003139;  // 추가 보안 인증 오류입니다. 모바일 앱에서 웹 로그인 잠금을 해제해 주세요.

const E_IBX_REMIT_NOT_APPROVAL_LINE              = 0x80003120;  // 설정된 결재선이 없습니다.
const E_IBX_REMIT_NOT_APPROVAL_ONLY              = 0x80003121;  // 단독 실행 할수 없는 결재선 입니다.
const E_IBX_REMIT_NOT_APPROVAL_AUTHORITY         = 0x80003122;  // 승인권자가 아닙니다.
const E_IBX_REMIT_NOT_AUTHORITY                  = 0x80003123;  // 이체권한이 없습니다.
const E_IBX_REMIT_NOT_APPROVAL_AMOUNT            = 0x80003124;  // 미승인 입금 또는 승인 금액 불일치 오류입니다.
const E_IBX_REMIT_APPROVAL_AMOUNT_DENIED         = 0x80003125;  // 결재자의 이체한도 초과 이체금액
const E_IBX_REMIT_NOT_APPROVAL_DOUBT             = 0x80003126;  // 비인가된 사용자의 거래로 의심되오니 해당 사이트에서 확인 후 이용하시기 바랍니다

const E_IBX_REMIT_DELAY_ACCOUNT                  = 0x80003127;  // 지연이체 신청 계정입니다.
const E_IBX_REMIT_DELAY_ACCOUNT_NO               = 0x80003128;  // 지연이체 신청 계좌입니다.

/*
    // 오류코드 중복이며, 사용하지 않아 삭제 처리함 (2013.08.01)
const E_IBX_CUSTOMER_ADD_NOTENTER                = 0x80003124;  // 시내외 구분코드 미입력
const E_IBX_CUSTOMER_ADD_INVALID                 = 0x80003125;  // 잘못된 시내외 구분코드
const E_IBX_CUSTOMER_ADD_MISC                    = 0x80003126;  // 시내외 구분코드 기타 오류
*/

const E_IBX_REMIT_SHORT_TIME                     = 0x80003130;  // 5분 이내에는 동일한 계좌로의 송금이 불가능합니다.
const E_IBX_REMIT_OVER_NUMBER                    = 0x80003131;  // 최대 이체 가능한 건수가 초과되었습니다.
const E_IBX_REMIT_PREEXECUTE_ERROR               = 0x80003132;  // 선행처리 오류로 인해 이체가 중단되었습니다. 확인 후 다시 거래하십시오.
const E_IBX_EXIST_SAME_REMIT_TRANSACTION         = 0x80003133;  // 승인되지 않은 동일한 이체거래건이 존재합니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_REMIT_NOT_REGISTER_PC                = 0x80003135;  // 이용PC지정 서비스에 등록된 PC가 아닙니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_NOT_APD_CTF                    = 0x80003136;  // 추가인증이 필요합니다. 해당 사이트에서 확인 후 이용하시기 바랍니다
const E_IBX_REMIT_ACCOUNT_BY_OTR                 = 0x80003137;  // 보안서비스 등록되어 전자금융거래 제한된 상태입니다. 등록된 스마트폰에서 확인 후 이용하시기 바랍니다.
const E_IBX_REMIT_AUTHEN_FAIL                    = 0x80003138;  // 인증에 실패하였습니다. 해당 기관에서 확인 후 다시 거래하시기 바랍니다.

const E_IBX_REMIT_BANK_NOTENTER                  = 0x80003210;  // 이체 은행 미입력
const E_IBX_REMIT_BANK_INVALID                   = 0x80003211;  // 잘못된 이체 은행
const E_IBX_REMIT_BANK_DENIED                    = 0x80003212;  // 서비스되지않는 이체 은행
const E_IBX_REMIT_BANK_MISC                      = 0x80003213;  // 이체 은행 기타 오류

const E_IBX_REMIT_ACCOUNT_NOTENTER               = 0x80003220;  // 입금 계좌번호 미입력
const E_IBX_REMIT_ACCOUNT_INVALID                = 0x80003221;  // 잘못된 입금 계좌번호
const E_IBX_REMIT_ACCOUNT_DENIED                 = 0x80003222;  // 제한된 입금 계좌번호
const E_IBX_REMIT_ACCOUNT_NOTREGISTERED          = 0x80003223;  // 미등록 입금 계좌번호
const E_IBX_REMIT_ACCOUNT_READONLY               = 0x80003224;  // 출금 전용/조회만가능 이체 계좌번호
const E_IBX_REMIT_ACCOUNT_WRITEONLY              = 0x80003225;  // 입금 전용/조회불가능 이체 계좌번호
const E_IBX_REMIT_ACCOUNT_MISC                   = 0x80003226;  // 입금 계좌번호 기타 오류
const E_IBX_REMIT_ACCOUNT_REGISTER               = 0x80003227;  // 계좌정보 입력되지 않은 계좌번호 기타 오류

const E_IBX_REMIT_PASSWORD_NOTENTER              = 0x80003230;  // 이체 비밀번호 미입력
const E_IBX_REMIT_PASSWORD_INVALID               = 0x80003231;  // 잘못된 이체 비밀번호
const E_IBX_REMIT_PASSWORD_DENIED                = 0x80003232;  // 제한된 이체 비밀번호
const E_IBX_REMIT_PASSWORD_JUSTBEFOREDENY        = 0x80003233;  // 제한직전 이체 비밀번호
const E_IBX_REMIT_PASSWORD_EXPIRED               = 0x80003234;  // 만료된 이체 비밀번호
const E_IBX_REMIT_PASSWORD_MISC                  = 0x80003235;  // 이체 비밀번호 기타 오류
const E_IBX_REMIT_PASSWORD_REGISTRATION          = 0x80003236;  // 해당 은행사이트에 방문하여 이체 비밀번호 등록 후 거래하시기 바랍니다.

const E_IBX_REMIT_AMOUNT_NOTENTER                = 0x80003240;  // 이체 금액 미입력
const E_IBX_REMIT_AMOUNT_INVALID                 = 0x80003241;  // 잘못된 이체 금액
const E_IBX_REMIT_AMOUNT_DENIED                  = 0x80003242;  // 잔액/이체한도 초과 이체 금액
const E_IBX_REMIT_AMOUNT_MISC                    = 0x80003243;  // 이체 금액 기타 오류
const E_IBX_REMIT_AMOUNT_CHECK                   = 0x80003244;  // 출금계좌에 미결제(현금화 되지않은) 타행수표가 포함되어 있어 출금계좌의 잔액이 부족합니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_AMOUNT_DIFFER                  = 0x80003245;  // 입력 받은 이체 금액과 이체 결과 페이지의 이체 금액이 다릅니다. 이체결과를 확인하시기 바랍니다.

const E_IBX_REMIT_AMOUNT_SUM_NOTENTER            = 0x80003246;  // 동일 출금은행의 이체합계 금액 미입력(다계좌이체)
const E_IBX_REMIT_AMOUNT_SUM_DIFFER              = 0x80003247;  // 동일 출금은행의 이체합계 금액 다름(다계좌이체)
const E_IBX_REMIT_AMOUNT_OVER_100MILLION         = 0x80003248;  // 10억 이상 이체시 이체금액 초과

const E_IBX_REMIT_DESC_NOTENTER                  = 0x80003250;  // 보내는 사람 미입력
const E_IBX_REMIT_DESC_INVALID                   = 0x80003251;  // 잘못된 보내는 사람(특수문자)
const E_IBX_REMIT_DESC_TOOLONG                   = 0x80003252;  // 보내는 사람 최대길이 초과
const E_IBX_REMIT_DESC_MISC                      = 0x80003253;  // 보내는 사람 기타 오류

const E_IBX_RECEIVER_DESC_NAME                   = 0x80003254;  // 받는 사람 미입력
const E_IBX_RECEIVER_DESC_INVALID                = 0x80003255;  // 잘못된 받는 사람(특수문자)
const E_IBX_RECEIVER_DESC_TOOLONG                = 0x80003256;  // 받는 사람 최대길이 초과
const E_IBX_RECEIVER_DESC_MISC                   = 0x80003257;  // 받는 사람 기타 오류

const E_IBX_REMIT_CMS_NOTENTER                   = 0x80003260;  // 이체 CMS 코드 미입력
const E_IBX_REMIT_CMS_INVALID                    = 0x80003261;  // 잘못된 이체 CMS 코드
const E_IBX_REMIT_CMS_DENIED                     = 0x80003262;  // 정지된(문제있는) 이체 CMS 코드
const E_IBX_REMIT_CMS_MISC                       = 0x80003263;  // 이체 CMS 코드 기타 오류

const E_IBX_REMIT_OTP_NOTENTER                   = 0x80003270;  // 보안카드번호(또는 OTP번호)를 입력하지 않으셨습니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_OTP_INVALID                    = 0x80003271;  // 잘못된 보안카드번호(또는 OTP번호) 입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_OTP_DENIED                     = 0x80003272;  // 제한된 보안카드번호(또는 OTP번호)입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_OTP_JUSTBEFOREDENY             = 0x80003273;  // 보안카드번호(또는 OTP번호) 오류입니다. 보안카드번호(또는 OTP번호)를 한번 더 틀리시면 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_REMIT_OTP_MISC                       = 0x80003274;  // 보안카드번호(또는 OTP번호) 관련 오류 입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_OTP_CHANGE                     = 0x80003275;  // 이체거래시 OTP 사용이 의무화 되었습니다.해당은행(인터넷뱅킹)에 문의 하셔서 조치 후 거래하십시오.
                                                                // (보안카드 -> OTP 전환대상 서비스)
const E_IBX_REMIT_OTP_SAME_NUMBER                = 0x80003276;  // 동일한 OTP번호를 입력하셨습니다. OTP번호를 변경후 재시도 하십시오.
const E_IBX_REMIT_OTP_PIN_NOTENTER               = 0x80003277;  // RSA PIN NUMBER 미입력
const E_IBX_REMIT_OTP_TIME_CHECK                 = 0x80003278;  // OTP시간보정등록 거래를 하십시오
const E_IBX_REMIT_OTP_SN_NOTENTER                = 0x8000327A;  // OTP 일련번호 미입력
const E_IBX_REMIT_OTP_SN_INVALID                 = 0x8000327B;  // 잘못된 OTP 일련번호
const E_IBX_REMIT_OTP_DISUSE                     = 0x8000327C;  // 폐기된 OTP
const E_IBX_REMIT_OTP_MERGE                      = 0x8000327D;  // 보안매체(보안카드 또는 OTP) 통합이 필요합니다. 해당 사이트에서 확인 후 이용하시기 바랍니다

const E_IBX_REMIT_TELEPHONE_NOTENTER             = 0x80003280;  // 장애시 연락처 미입력
const E_IBX_REMIT_TELEPHONE_INVALID              = 0x80003281;  // 잘못된 장애시 연락처
const E_IBX_REMIT_TELEPHONE_MISC                 = 0x80003282;  // 장애시 연락처 기타 오류

const E_IBX_REMIT_APPROVALNO_NOTENTER            = 0x800032A0;  // 승인 비밀번호 미입력
const E_IBX_REMIT_APPROVALNO_INVALID             = 0x800032A1;  // 잘못된 승인 비밀번호
const E_IBX_REMIT_APPROVALNO_DENIED              = 0x800032A2;  // 제한된 승인 비밀번호
const E_IBX_REMIT_APPROVALNO_JUSTBEFOREDENY      = 0x800032A3;  // 제한직전 승인 비밀번호
const E_IBX_REMIT_APPROVALNO_EXPIRED             = 0x800032A4;  // 만료된 승인 비밀번호
const E_IBX_REMIT_APPROVALNO_MISC                = 0x800032A5;  // 승인 비밀번호 기타 오류

const E_IBX_CURRENCY_NOTENTER                    = 0x800032B0;  // 통화 미입력
const E_IBX_CURRENCY_INVALID                     = 0x800032B1;  // 잘못된 통화
const E_IBX_CURRENCY_DENIED                      = 0x800032B2;  // 제한된(없는) 통화
const E_IBX_CURRENCY_MISC                        = 0x800032B3;  // 통화 관련 기타 오류

const E_IBX_REGISTER_FAST_ACCOUNT                = 0x800032B5;  // 등록되지 않은 빠른계좌 (등록요망)
const E_IBX_FAST_ACCOUNT_NOT_FOUND               = 0x800032B6;  // 등록된 빠른계좌가 없습니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_TYPE_NOTENTER                        = 0x800032C0;  // 이체유형 미입력
const E_IBX_TYPE_INVALID                         = 0x800032C1;  // 잘못된 이체유형
const E_IBX_TYPE_DENIED                          = 0x800032C2;  // 제한된(없는) 이체유형
const E_IBX_TYPE_MISC                            = 0x800032C3;  // 이체유형 관련 기타 오류

const E_IBX_USE_NOTENTER                         = 0x800032D0;  // 이체용도 미입력
const E_IBX_USE_INVALID                          = 0x800032D1;  // 잘못된 이체용도
const E_IBX_USE_DENIED                           = 0x800032D2;  // 제한된(없는) 이체용도
const E_IBX_USE_MISC                             = 0x800032D3;  // 이체용도 관련 기타 오류

const E_IBX_SEND_AMOUNT_NOTENTER                 = 0x800032E0;  // 송금금액 미입력 입니다. 확인 후 다시 거래하십시오.
const E_IBX_SEND_AMOUNT_INVALID                  = 0x800032E1;  // 잘못된 송금금액 입니다. 확인 후 다시 거래하십시오.
const E_IBX_SEND_AMOUNT_MISC                     = 0x800032E2;  // 송금금액 관련 기타 오류 입니다. 확인 후 다시 거래하십시오.

const E_IBX_DESC_INVALID                         = 0x80002440;  // 잘못된 적요
//  const E_IBX_ACCTORCUR_INVALID                    = 0x800032B4;  // 계좌번호 + 통화 오류(어느 쪽인지 알 수 없음)

const E_IBX_REMIT_USER_PASSWORD_NOTENTER                  = 0x80003310;  // 이용자비밀번호를 입력하지 않으셨습니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_USER_PASSWORD_INVALID                   = 0x80003311;  // 잘못된 이용자비밀번호입니다. 오류횟수 초과 시 거래가 불가하오니 반드시 확인하십시오.
const E_IBX_REMIT_USER_PASSWORD_DENIED                    = 0x80003312;  // 이용자비밀번호 오류횟수 초과입니다.
const E_IBX_REMIT_USER_PASSWORD_JUSTBEFOREDENY            = 0x80003313;  // 이용자비밀번호 오류입니다. 이용자비밀번호를 한번 더 틀리시면 이용자비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_REMIT_USER_PASSWORD_MISC                      = 0x80003314;  // 이용자 비밀번호 기타오류입니다.



const E_IBX_REMIT_DETAIL_NOTENTER                = 0x80003321;  // 지급상세정보 미입력
const E_IBX_REMIT_NOT_NOTENTERE                  = 0x80003322;  // 비고란 미입력

const E_IBX_RECEIVER_NOTENTER                    = 0x80003330;  // 받는사람(입금) 계좌유형 미입력
const E_IBX_RECEIVER_INVALID                     = 0x80003331;  // 잘못된 받는사람(입금) 계좌유형
const E_IBX_RECEIVER_DENIED                      = 0x80003332;  // 제한된(없는) 받는사람(입금) 계좌유형
const E_IBX_RECEIVER_MISC                        = 0x80003333;  // 받는사람(입금) 계좌유형 관련 기타 오류

const E_IBX_REMIT_AREA_NOTENTER                  = 0x80003340;  // 입금 계좌지역 미입력
const E_IBX_REMIT_AREA_INVALID                   = 0x80003341;  // 잘못된 입금 계좌지역
const E_IBX_REMIT_AREA_DENIED                    = 0x80003342;  // 제한된(없는) 입금 계좌지역
const E_IBX_REMIT_AREA_MISC                      = 0x80003343;  // 입금 계좌지역 관련 기타 오류

const E_IBX_REMIT_BRANCH_NOTENTER                = 0x80003350;  // 입금 계좌지점명 미입력
const E_IBX_REMIT_BRANCH_INVALID                 = 0x80003351;  // 잘못된 입금 계좌지점명
const E_IBX_REMIT_BRANCH_DENIED                  = 0x80003352;  // 제한된(없는) 입금 계좌지점명
const E_IBX_REMIT_BRANCH_MISC                    = 0x80003353;  // 입금 계좌지점명 관련 기타 오류
const E_IBX_REMIT_BRANCH_NOTREGISTERED           = 0x80003354;  // 미등록 입금 계좌지점명

const E_IBX_TRANS_STATE_NOTENTER                 = 0x80003360;  // 거래상태명 미입력
const E_IBX_TRANS_STATE_INVALID                  = 0x80003361;  // 잘못된 거래상태
const E_IBX_TRANS_STATE_MISC                     = 0x80003362;  // 거래상태 관련 기타 오류

const E_IBX_COMPANY_NAME_NOTENTER                = 0x80003370;  // 기업명 미입력
const E_IBX_COMPANY_NAME_INVALID                 = 0x80003371;  // 잘못된 기업명
const E_IBX_COMPANY_NAME_MISC                    = 0x80003372;  // 기업명 관련 기타 오류

const E_IBX_TRANS_TYPE_NOTENTER                  = 0x80003380;  // 거래구분 미입력
const E_IBX_TRANS_TYPE_INVALID                   = 0x80003381;  // 잘못된 거래구분
const E_IBX_TRANS_TYPE_MISC                      = 0x80003382;  // 거래구분 관련 기타 오류

const E_IBX_RANDOM_DATA_NOTENTER                 = 0x80003390;  // RandomData 미입력
const E_IBX_RANDOM_DATA_INVALID                  = 0x80003391;  // 잘못된 RandomData
const E_IBX_RANDOM_DATA_MISC                     = 0x80003392;  // RandomData 관련 기타 오류

const E_IBX_REMIT_NAME_NOTENTER                  = 0x800033A0;  // 수취인 미입력
const E_IBX_REMIT_NAME_INVALID                   = 0x800033A1;  // 잘못된 수취인
const E_IBX_REMIT_NAME_MISC                      = 0x800033A2;  // 수취인 관련 기타 오류

const E_IBX_REMIT_TELPHONE_NOTENTER              = 0x800033A5;  // 수취인 연락처 미입력
const E_IBX_REMIT_TELPHONE_INVALID               = 0x800033A6;  // 잘못된 수취인 연락처
const E_IBX_REMIT_TELPHONE_MISC                  = 0x800033A7;  // 수취인 연락처 관련 기타 오류

const E_IBX_REMIT_COMPANY_NAME_NOTENTER          = 0x800033B0;  // 입금기업명 미입력
const E_IBX_REMIT_COMPANY_NAME_INVALID           = 0x800033B1;  // 잘못된 입금기업명
const E_IBX_REMIT_COMPANY_NAME_MISC              = 0x800033B2;  // 입금기업명 관련 기타 오류

const E_IBX_REMIT_APPROVAL_LINE_NOTENTER          = 0x800033B6;  // 결재선 미입력
const E_IBX_REMIT_APPROVAL_LINE_INVALID           = 0x800033B7;  // 잘못된 결재선
const E_IBX_REMIT_APPROVAL_LINE_DENIED            = 0x800033B8;  // 지원하지 않는 결재선
const E_IBX_REMIT_APPROVAL_LINE_MISC              = 0x800033B9;  // 결재선 관련 기타 오류

const E_IBX_TRANS_JUDGE_TYPE_NOTENTER            = 0x800033C1;  // 이체심사 구분 미입력
const E_IBX_TRANS_JUDGE_TYPE_INVALID             = 0x800033C2;  // 잘못된 이체심사 구분
const E_IBX_TRANS_JUDGE_TYPE_MISC                = 0x800033C3;  // 이체심사 구분 관련 기타 오류
const E_IBX_TRANS_JUDGE_FAIL                     = 0x800033C4;  // 이체심사실패, 확인 후 거래하시기 바랍니다.

const E_IBX_TRANS_JUDGE_FAIL_REASON_NOTENTER     = 0x800033C6;  // 이체심사 거절 사유 미입력
const E_IBX_TRANS_JUDGE_FAIL_REASON_INVALID      = 0x800033C7;  // 잘못된 이체심사 거절 사유
const E_IBX_TRANS_JUDGE_FAIL_REASON_LEN_OVER      = 0x800033C8;  // 이체심사 거절 사유 처리 가능한 길이 초과
const E_IBX_TRANS_JUDGE_FAIL_REASON_MISC         = 0x800033C9;  // 이체심사 거절 사유 관련 기타 오류

const E_IBX_SERIAL_NUMBER_NOTENTER               = 0x800033D1;  // 증빙번호 미입력
const E_IBX_SERIAL_NUMBER_INVALID                = 0x800033D2;  // 잘못된 증빙번호
const E_IBX_SERIAL_NUMBER_MISC                   = 0x800033D3;  // 증빙번호 관련 기타 오류

const E_IBX_PARAMETER_INVALID                    = 0x800033E0;  // 잘못된 입력값
const E_IBX_REMIT_INFO_INVALID                   = 0x800033E1;  // 등록되지 않은 입금정보(입금계좌번호, 입금계좌기업명, 입금계좌 지점명 중 오류)
const E_IBX_PARAMETER_NOTENTER                   = 0x800033E2;  // 추가정보 미입력 입니다. 확인 후 거래하시기 바랍니다.


const E_IBX_ORDER_NO_NOTENTER                    = 0x800033F1;  // OrderNo 미입력
const E_IBX_ORDER_NO_INVALID                     = 0x800033F2;  // 잘못된 OrderNo
const E_IBX_ORDER_NO_MISC                        = 0x800033F3;  // OrderNo 관련 기타 오류

const E_IBX_INSTITUTION_CODE_NOTENTER            = 0x80003400;  // 기관코드 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_INSTITUTION_CODE_INVALID             = 0x80003401;  // 잘못된 기관코드입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_BUSINESS_CODE_NOTENTER               = 0x80003410;  // 주업종코드 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_BUSINESS_CODE_INVALID                = 0x80003411;  // 잘못된 주업종코드입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_BUSINESS_CODE_DENIED                 = 0x80003412;  // 제한된 주업종코드입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_BUSINESS_CODE_MISC                   = 0x80003413;  // 주업종코드 기타오류입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_BUSINESS_CODE_REGISTERED             = 0x80003414;  // 이미 등록된 주업종코드입니다. 확인 후 거래하시기 바랍니다.

/* server-side error code : credit card */

const E_IBX_DATE_PAYMENT_NOTENTER                = 0x80003510;  // 결제일 미입력
const E_IBX_DATE_PAYMENT_INVALID                 = 0x80003511;  // 잘못된 결제일
const E_IBX_DATE_PAYMENT_DENIED                  = 0x80003512;  // 문제있는 결제일(내역을 조회할 수 없는 결제일)
const E_IBX_DATE_PAYMENT_FUTURE                  = 0x80003513;  // 결제일 기타 오류 - 미래의 날자
const E_IBX_DATE_PAYMENT_MISC                    = 0x80003514;  // 결제일 기타 오류

const E_IBX_DATE_BILL_NOTENTER                   = 0x80003520;  // 청구년월 미입력입니다. 확인 후 다시 거래하십시오.
const E_IBX_DATE_BILL_INVALID                    = 0x80003521;  // 잘못된 청구년월입니다. 확인 후 다시 거래하십시오.
const E_IBX_DATE_BILL_DENIED                     = 0x80003522;  // 해당 기관에서 서비스하는 조회 기간을 초과하였습니다. 청구년월을 확인 후 다시 거래하십시오.
// {문제있는 청구년월(내역을 조회할 수 없는 청구년월)} 기관에 따라 최대 6개월 이전의 내역을 조회하려고 한 경우
const E_IBX_DATE_BILL_MISC                       = 0x80003523;  // 청구년월 기타 오류입니다. 확인 후 다시 거래하십시오.

const E_IBX_CARD_NO_NOTENTER                     = 0x80003600;  // 카드 번호 미입력
const E_IBX_CARD_NO_INVALID                      = 0x80003601;  // 잘못된 카드 번호
const E_IBX_CARD_NO_DENIED                       = 0x80003602;  // 정지된(문제있는) 카드 번호
const E_IBX_CARD_NO_NOTREGISTERED                = 0x80003603;  // 카드 번호 기타 오류 - 미등록
const E_IBX_CARD_NO_READONLY                     = 0x80003604;  // 카드 번호 기타 오류 - 조회만 가능
const E_IBX_CARD_NO_MISC                         = 0x80003605;  // 카드 번호 기타 오류
const E_IBX_CARD_NOT_FOUND                       = 0x80003606;  // 발급된 카드가 없습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오.
const E_IBX_CARD_NO_SERVICE                      = 0x80003607;  // 직불형카드 조회 서비스는 제공하지 않습니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오.
const E_IBX_NOT_EQUAL_CARD_CUSTOMER_NO           = 0x80003608;  // 카드소속 법인고객번호이(가) 입력된 법인고객번호와(과) 다릅니다.
const E_IBX_CARD_TABLE_CHECK                     = 0x80003609;  // 비씨카드 회계양식디자인 항목이 누락되었습니다. 자세한 사항은 고객센터로 문의하시기 바랍니다.

const E_IBX_CARD_PASSWORD_NOTENTER               = 0x80003610;  // 카드 비밀번호 미입력
const E_IBX_CARD_PASSWORD_INVALID                = 0x80003611;  // 잘못된 카드 비밀번호
const E_IBX_CARD_PASSWORD_DENIED                 = 0x80003612;  // 제한된 카드 비밀번호
const E_IBX_CARD_PASSWORD_JUSTBEFOREDENY         = 0x80003613;  // 카드 비밀번호 기타 오류 - 제한직전
const E_IBX_CARD_PASSWORD_MISC                   = 0x80003614;  // 카드 비밀번호 기타 오류

const E_IBX_CARD_DESC_NOTENTER                   = 0x80003620;  // 카드명 미입력
const E_IBX_CARD_DESC_INVALID                    = 0x80003621;  // 잘못된 카드명
const E_IBX_CARD_DESC_DENIED                     = 0x80003622;  // 제한된(서비스되지 않는) 카드명
const E_IBX_CARD_DESC_MISC                       = 0x80003623;  // 카드명 기타 오류

const E_IBX_CARD_CVC_NOTENTER                    = 0x80003630;  // 카드 CVC 코드 미입력
const E_IBX_CARD_CVC_INVALID                     = 0x80003631;  // 잘못된 카드 CVC 코드
const E_IBX_CARD_CVC_DENIED                      = 0x80003632;  // 제한된 카드 CVC 코드
const E_IBX_CARD_CVC_MISC                        = 0x80003633;  // 카드 CVC 코드 기타 오류

const E_IBX_CARD_VALIDITY_NOTENTER               = 0x80003640;  // 카드 유효기간 미입력
const E_IBX_CARD_VALIDITY_INVALID                = 0x80003641;  // 잘못된 카드 유효기간
const E_IBX_CARD_VALIDITY_DENIED                 = 0x80003642;  // 제한된(만료된) 카드 유효기간
const E_IBX_CARD_VALIDITY_MISC                   = 0x80003643;  // 카드 유효기간 기타 오류

const E_IBX_CARD_NO_CVC_PASSWORD_INVALID         = 0x80003648;  // 잘못된 카드번호 또는 카드 CVC 또는 카드 비밀번호 오류
const E_IBX_CARD_CVC_VALIDITY_INVALID            = 0x80003649;  // 잘못된 카드 CVC 또는 유효기간 오류

const E_IBX_CARD_OFFICE_NOTENTER                 = 0x80003650;  // 카드 부서명 미입력
const E_IBX_CARD_OFFICE_INVALID                  = 0x80003651;  // 잘못된 카드 부서명
const E_IBX_CARD_OFFICE_DENIED                   = 0x80003652;  // 제한된 카드 부서명
const E_IBX_CARD_OFFICE_MISC                     = 0x80003653;  // 카드 부서명 기타 오류
const E_IBX_CARD_POST_NOTENTER                   = 0x80003654;  // 카드 부서코드 미입력
const E_IBX_CARD_POST_INVALID                    = 0x80003655;  // 잘못된 카드 부서코드

const E_IBX_CARD_PURCHASE_DATE_NOTENTER          = 0x80003660;  // 매입일 미입력
const E_IBX_CARD_PURCHASE_DATE_INVALID           = 0x80003661;  // 잘못된 매입일
const E_IBX_CARD_PURCHASE_DATE_DENIED            = 0x80003662;  // 제한된 매입일
const E_IBX_CARD_PURCHASE_DATE_MISC              = 0x80003663;  // 매입일 기타 오류

const E_IBX_CARD_BRANCH_NO_NOTENTER              = 0x80003670;  // 가맹점번호 미입력
const E_IBX_CARD_BRANCH_NO_INVALID               = 0x80003671;  // 잘못된 가맹점번호
const E_IBX_CARD_BRANCH_NO_DENIED                = 0x80003672;  // 제한된 가맹점번호
const E_IBX_CARD_BRANCH_NO_MISC                  = 0x80003673;  // 가맹점번호 기타 오류

const E_IBX_CARD_BRANCH_RATE_NOTENTER            = 0x80003680;  // 가맹점수수료율 미입력
const E_IBX_CARD_BRANCH_RATE_INVALID             = 0x80003681;  // 잘못된 가맹점수수료율
const E_IBX_CARD_BRANCH_RATE_DENIED              = 0x80003682;  // 제한된 가맹점수수료율
const E_IBX_CARD_BRANCH_RATE_MISC                = 0x80003683;  // 가맹점수수료율 기타 오류

const E_IBX_CARD_MEMBER_NOTENTER                 = 0x80003690;  // 카드 회원사명 미입력(BC카드만 해당)
const E_IBX_CARD_MEMBER_INVALID                  = 0x80003691;  // 잘못된 카드 회원사명
const E_IBX_CARD_MEMBER_DENIED                   = 0x80003692;  // 제한된 카드 회원사명
const E_IBX_CARD_MEMBER_MISC                     = 0x80003693;  // 카드 회원사명 기타 오류
const E_IBX_CARD_MEMBER_MERGE                    = 0x80003694;  // 고객님은 인터넷ID 통합 대상입니다. 홈페이지 방문하셔서 ID 통합 하신 후 다시 거래하십시오.

const E_IBX_CARD_SCRAP_INFO_NOTENTER             = 0x80003700;  // 카드조회 구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CARD_SCRAP_INFO_INVALID              = 0x80003701;  // 잘못된 카드조회 구분입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_SITE_TYPE_NOTENTER                   = 0x80003702;  // 사이트 구분 미입력입니다. 확인후 다시 거래하시기 바랍니다.
const E_IBX_SITE_TYPE_INVALID                    = 0x80003703;  // 잘못된 사이트 구분입니다. 확인후 다시 거래하시기 바랍니다.

const E_IBX_CARD_MEMBER_GUBUN_NOTENTER           = 0x80003710;  // 회원구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CARD_MEMBER_GUBUN_INVALID            = 0x80003711;  // 잘못된 회원구분 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CARD_MEMBER_NOT_AUTHORITY            = 0x80003720;  // 조회 권한이 없는 사용자입니다. 사이트 확인하시기 바랍니다.

const E_IBX_CHECK_BIRTH_YEAR_DENIED              = 0x80003721; // 확인 가능한 출생연도X 요일제 안내 참고
const E_IBX_ONLY_HOUSEHOLDER_SEARCH              = 0x80003722; // 공인인증서 보유한 세대주만 조회할 수 있습니다.

const E_IBX_CARD_GROUP_NUM_NOTENTER	           = 0x80003731;  // 그룹번호 미입력
const E_IBX_CARD_GROUP_NUM_INVALID	           = 0x80003732;  // 잘못된 그룹번호
const E_IBX_CARD_GROUP_NUM_MISC	               = 0x80003733;  // 그룹번호 기타 오류

// 현대글로비스
const E_IBX_CONTRACTOR_NOTENTER                           = 0x80003800;  	// 계약자명을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_CONTRACT_NUMBER_NOTENTER                      = 0x80003810; 	// 계약번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_CAR_BEFORE_TAKEOVER                 	      = 0x80003820;  	// 고객님께서 문의하신 차량은 탁송사에서 인수 전입니다. 차량 인수 후 조회 가능합니다

// iBASE Ex 대체 상세조회 에러
const E_IBX_A110X1_ACCOUNT_NO_NOTENTER                    = 0x80004060;  // 상세, 거래내역조회 대상 계좌번호 미입력
const E_IBX_A110X1_ACCOUNT_NO_INVALID                     = 0x80004061;  // 잘못된 상세, 거래내역조회 대상 계좌번호
const E_IBX_A110X1_ACCOUNT_NO_DENIED                      = 0x80004062;  // 제한된 상세, 거래내역조회 대상 계좌번호
const E_IBX_A110X1_ACCOUNT_NO_MISC                        = 0x80004063;  // 상세, 거래내역조회 대상 계좌번호 기타오류

const E_IBX_A110X1_ACCOUNT_PASSWORD_NOTENTER              = 0x80004070;  // 계좌 비밀번호 미입력
const E_IBX_A110X1_ACCOUNT_PASSWORD_INVALID               = 0x80004071;  // 잘못된 계좌 비밀번호
const E_IBX_A110X1_ACCOUNT_PASSWORD_JUSTBEFOREDENY        = 0x80004072;  // 제한직전 계좌 비밀번호
const E_IBX_A110X1_ACCOUNT_PASSWORD_DENIED                = 0x80004073;  // 제한된 계좌 비밀번호
const E_IBX_A110X1_ACCOUNT_PASSWORD_MISC                  = 0x80004074;  // 계좌 비밀번호 기타오류

const E_IBX_A110X1_CURRENCY_NOTENTER                      = 0x80004080;  // 계좌번호 통화 미입력
const E_IBX_A110X1_CURRENCY_INVALID                       = 0x80004081;  // 잘못된 계좌번호 통화
const E_IBX_A110X1_CURRENCY_DENIED                        = 0x80004082;  // 제한된 계좌번호 통화
const E_IBX_A110X1_CURRENCY_MISC                          = 0x80004083;  // 계좌번호 통화 기타오류

// iBASE Ex 대체 거래내역 에러
const E_IBX_A120X1_ACCOUNT_NO_NOTENTER                    = 0x80004090;  // 미입력
const E_IBX_A120X1_ACCOUNT_NO_INVALID                     = 0x80004091;  // 잘못된 입력
const E_IBX_A120X1_ACCOUNT_NO_DENIED                      = 0x80004092;  // 제한된 입력
const E_IBX_A120X1_ACCOUNT_NO_MISC                        = 0x80004093;  // 기타오류

const E_IBX_A120X1_ACCOUNT_PASSWORD_NOTENTER              = 0x800040A0;  // 미입력
const E_IBX_A120X1_ACCOUNT_PASSWORD_INVALID               = 0x800040A1;  // 잘못된 입력
const E_IBX_A120X1_ACCOUNT_PASSWORD_JUSTBEFOREDENY        = 0x800040A2;  // 제한직전 입력
const E_IBX_A120X1_ACCOUNT_PASSWORD_DENIED                = 0x800040A3;  // 제한된 입력
const E_IBX_A120X1_ACCOUNT_PASSWORD_MISC                  = 0x800040A4;  // 기타오류

const E_IBX_A120X1_CURRENCY_NOTENTER                      = 0x800040B0;  // 미입력
const E_IBX_A120X1_CURRENCY_INVALID                       = 0x800040B1;  // 잘못된 입력
const E_IBX_A120X1_CURRENCY_DENIED                        = 0x800040B2;  // 제한된 입력
const E_IBX_A120X1_CURRENCY_MISC                          = 0x800040B3;  // 기타오류

/*
    //오류코드 중복으로 제거합니다.  80002310 부터 조회일 관련 오류코드 사용하시기 바랍니다.  2010.02.09 leech

    const E_IBX_A120X1_ENUM_DATE_BEGIN_NOTENTER               = 0x800040C0;  // 미입력
    const E_IBX_A120X1_ENUM_DATE_BEGIN_INVALID                = 0x800040C1;  // 잘못된 입력
    const E_IBX_A120X1_ENUM_DATE_BEGIN_DENIED                 = 0x800040C2;  // 제한된 입력
    const E_IBX_A120X1_ENUM_DATE_BEGIN_MISC                   = 0x800040C3;  // 기타오류

    const E_IBX_A120X1_ENUM_DATE_END_NOTENTER                 = 0x800040D0;  // 미입력
    const E_IBX_A120X1_ENUM_DATE_END_INVALID                  = 0x800040D1;  // 잘못된 입력
    const E_IBX_A120X1_ENUM_DATE_END_DENIED                   = 0x800040D2;  // 제한된 입력
    const E_IBX_A120X1_ENUM_DATE_END_MISC                     = 0x800040D3;  // 기타오류
*/

const E_IBX_A120X1_BANKING_TYPE_NOTENTER                  = 0x800040E0;  // 미입력
const E_IBX_A120X1_BANKING_TYPE_INVALID                   = 0x800040E1;  // 잘못된 입력
const E_IBX_A120X1_BANKING_TYPE_DENIED                    = 0x800040E2;  // 제한된 입력
const E_IBX_A120X1_BANKING_TYPE_MISC                      = 0x800040E3;  // 기타오류

const E_IBX_A120X1_RESULT_OUTOFSIZE                       = 0x800040F0;  // 뱅킹 내 지원가능 결과량 초과

const E_IBX_A124X1_INQUIRY_TYPE_NOTENTER                  = 0x80004200;  // 조회구분 미입력
const E_IBX_A124X1_INQUIRY_TYPE_INVALID                   = 0x80004201;  // 잘못된 조회구분
const E_IBX_A124X1_INQUIRY_TYPE_MISC                      = 0x80004202;  // 조회구분 기타오류

const E_IBX_PROD_TYPE_NOTENTER                            = 0x80004203;  // 상품구분 미입력
const E_IBX_PROD_TYPE_INVALID                             = 0x80004204;  // 잘못된 상품구분
const E_IBX_PROD_TYPE_MISC                                = 0x80004205;  // 상품구분 기타오류

const E_IBX_T121X8_SHOPPING_MALL_GUBUN_NOTENTER           = 0x80004300;  // 쇼핑몰구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_T121X8_SHOPPING_MALL_GUBUN_INVALID            = 0x80004301;  // 잘못된 쇼핑몰구분입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_T121X8_SHOPPING_MALL_GUBUN_MISC               = 0x80004302;  // 쇼핑몰구분 기타오류입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_SHOPPER_DISCONTINUE_SALE_1                    = 0x80004303;  // 판매 불가능 상태 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_SHOPPER_DISCONTINUE_SALE_2                    = 0x80004304;  // 브랜드 카탈로그가 아닙니다. 확인 후 거래하시기 바랍니다.

const E_IBX_T121X8_DATA_REQUEST                           = 0x80004310;  // 해당 조회조건에 내역 요청이 접수되었습니다. 내일 오전 10시 이후에 다시 거래하십시오.
const E_IBX_T121X8_DATA_TRANSACTION                       = 0x80004311;  // 해당 조회조건에 내역 요청 접수 후 처리중입니다. 나중에 다시 시도해주십시오.

// iBASE Ex 대체 증권 잔액(B11001 & B11002)
const E_IBX_B1100X_ACCOUNT_NO_NOTENTER                    = 0x80005000;  // 미입력
const E_IBX_B1100X_ACCOUNT_NO_INVALID                     = 0x80005001;  // 잘못된 입력
const E_IBX_B1100X_ACCOUNT_NO_DENIED                      = 0x80005002;  // 제한된 입력
const E_IBX_B1100X_ACCOUNT_NO_MISC                        = 0x80005003;  // 기타오류

const E_IBX_B1100X_ACCOUNT_PASSWORD_NOTENTER              = 0x80005010;  // 미입력
const E_IBX_B1100X_ACCOUNT_PASSWORD_INVALID               = 0x80005011;  // 잘못된 입력
const E_IBX_B1100X_ACCOUNT_PASSWORD_JUSTBEFOREDENY        = 0x80005012;  // 제한직전 입력
const E_IBX_B1100X_ACCOUNT_PASSWORD_DENIED                = 0x80005013;  // 제한된 입력
const E_IBX_B1100X_ACCOUNT_PASSWORD_MISC                  = 0x80005014;  // 기타오류

// iBASE Ex 대체 증권 거래내역(B12001 & B12002)
const E_IBX_B1200X_ACCOUNT_NO_NOTENTER                    = 0x80005100;  // 미입력
const E_IBX_B1200X_ACCOUNT_NO_INVALID                     = 0x80005101;  // 잘못된 입력
const E_IBX_B1200X_ACCOUNT_NO_DENIED                      = 0x80005102;  // 제한된 입력
const E_IBX_B1200X_ACCOUNT_NO_MISC                        = 0x80005103;  // 기타오류

const E_IBX_B1200X_ACCOUNT_PASSWORD_NOTENTER              = 0x80005110;  // 미입력
const E_IBX_B1200X_ACCOUNT_PASSWORD_INVALID               = 0x80005111;  // 잘못된 입력
const E_IBX_B1200X_ACCOUNT_PASSWORD_JUSTBEFOREDENY        = 0x80005112;  // 제한직전 입력
const E_IBX_B1200X_ACCOUNT_PASSWORD_DENIED                = 0x80005113;  // 제한된 입력
const E_IBX_B1200X_ACCOUNT_PASSWORD_MISC                  = 0x80005114;  // 기타오류

/*
    //오류코드 중복으로 제거합니다.  80002310 부터 조회일 관련 오류코드 사용하시기 바랍니다.  2010.02.09 leech

    const E_IBX_B1200X_ENUM_DATE_BEGIN_NOTENTER               = 0x80005120;  // 미입력
    const E_IBX_B1200X_ENUM_DATE_BEGIN_INVALID                = 0x80005121;  // 잘못된 입력
    const E_IBX_B1200X_ENUM_DATE_BEGIN_DENIED                 = 0x80005122;  // 제한된 입력
    const E_IBX_B1200X_ENUM_DATE_BEGIN_MISC                   = 0x80005123;  // 기타오류

    const E_IBX_B1200X_ENUM_DATE_END_NOTENTER                 = 0x80005130;  // 미입력
    const E_IBX_B1200X_ENUM_DATE_END_INVALID                  = 0x80005131;  // 잘못된 입력
    const E_IBX_B1200X_ENUM_DATE_END_DENIED                   = 0x80005132;  // 제한된 입력
    const E_IBX_B1200X_ENUM_DATE_END_MISC                     = 0x80005133;  // 기타오류
*/

const E_IBX_B1200X_FUND_STANDARD_PRICE_NOINFO             = 0x80005140;  // 펀드기준가격 정보가 존재하지 않습니다.


/* server-side error code : check */

const E_IBX_PUBLISHING_BANK_NOTENTER                      = 0x80003920;  // 발행은행 미입력
const E_IBX_PUBLISHING_BANK_INVALID                       = 0x80003921;  // 잘못된 발행은행
const E_IBX_PUBLISHING_BANK_DENIED                        = 0x80003922;  // 제한된 발행은행
const E_IBX_PUBLISHING_BANK_MISC                          = 0x80003923;  // 발행은행 기타 오류

const E_IBX_CHECK_NUMBER_NOTENTER                         = 0x80003930;  // 수표번호 미입력
const E_IBX_CHECK_NUMBER_INVALID                          = 0x80003931;  // 잘못된 수표번호
const E_IBX_CHECK_NUMBER_DENIED                           = 0x80003932;  // 제한된 수표번호
const E_IBX_CHECK_NUMBER_MISC                             = 0x80003933;  // 수표번호 기타 오류

const E_IBX_PUBLISHING_CODE_NOTENTER                      = 0x80003940;  // 발행점코드 미입력
const E_IBX_PUBLISHING_CODE_INVALID                       = 0x80003941;  // 잘못된 발행점코드
const E_IBX_PUBLISHING_CODE_DENIED                        = 0x80003942;  // 제한된 발행점코드
const E_IBX_PUBLISHING_CODE_MISC                          = 0x80003943;  // 발행점코드 기타 오류

const E_IBX_CHECK_KIND_NOTENTER                           = 0x80003950;  // 수표권종 미입력
const E_IBX_CHECK_KIND_INVALID                            = 0x80003951;  // 잘못된 수표권종
const E_IBX_CHECK_KIND_DENIED                             = 0x80003952;  // 제한된 수표권종
const E_IBX_CHECK_KIND_MISC                               = 0x80003953;  // 수표권종 기타 오류

const E_IBX_CHECK_AMOUNT_NOTENTER                         = 0x80003960;  // 수표금액 미입력
const E_IBX_CHECK_AMOUNT_INVALID                          = 0x80003961;  // 잘못된 수표금액
const E_IBX_CHECK_AMOUNT_DENIED                           = 0x80003962;  // 제한된 수표금액
const E_IBX_CHECK_AMOUNT_MISC                             = 0x80003963;  // 수표금액 기타 오류

// 네이버쇼핑
const E_IBX_PRODUCT_PRICE_NOTENTER                        = 0x80003965;  // 금액 미입력
const E_IBX_PRODUCT_PRICE_INVALID                         = 0x80003966;  // 잘못된 금액
const E_IBX_PRODUCT_PRICE_MISC                            = 0x80003967;  // 금액관련 기타 오류

const E_IBX_PUBLISHING_DATE_NOTENTER                      = 0x80003970;  // 발행일자 미입력
const E_IBX_PUBLISHING_DATE_INVALID                       = 0x80003971;  // 잘못된 발행일자
const E_IBX_PUBLISHING_DATE_DENIED                        = 0x80003972;  // 제한된 발행일자
const E_IBX_PUBLISHING_DATE_MISC                          = 0x80003973;  // 발행일자 기타 오류

const E_IBX_CHECK_ACCOUNT_NO_NOTENTER                     = 0x80003980;  // 수표계좌번호 미입력
const E_IBX_CHECK_ACCOUNT_NO_INVALID                      = 0x80003981;  // 잘못된 수표계좌번호
const E_IBX_CHECK_ACCOUNT_NO_DENIED                       = 0x80003982;  // 제한된 수표계좌번호
const E_IBX_CHECK_ACCOUNT_NO_MISC                         = 0x80003983;  // 수표계좌번호 기타 오류

// 지로 수납내역조회
const E_IBX_RECEIVE_DATE_NOENTER                          = 0x80003990;  // 입금일자 미입력
const E_IBX_RECEIVE_DATE_INVALID                          = 0x80003991;  // 잘못된 입금일자
const E_IBX_RECEIVE_DATE_MISC                             = 0x80003992;  // 입금일자 기타오류

/* server-side error code : B2B */
// A121X4 B2B매출내역(할인가능액)조회
const E_IBX_A121X4_GOODS_TYPE_NOTENTER                    = 0x80006100;  // 상품타입 미입력
const E_IBX_A121X4_GOODS_TYPE_INVALID                     = 0x80006101;  // 잘못된 상품타입
const E_IBX_A121X4_GOODS_TYPE_DENIED                      = 0x80006102;  // 제한된 상품타입
const E_IBX_A121X4_GOODS_TYPE_MICS                        = 0x80006103;  // 상품타입 기타오류

const E_IBX_A121X4_ENTERPRISE_NAME_NOTENTER               = 0x80006110;  // 업체명 미입력
const E_IBX_A121X4_ENTERPRISE_NAME_INVALID                = 0x80006111;  // 잘못된 업체명
const E_IBX_A121X4_ENTERPRISE_NAME_DENIED                 = 0x80006112;  // 제한된 업체명
const E_IBX_A121X4_ENTERPRISE_NAME_MICS                   = 0x80006113;  // 업체명 기타오류

/*
    //오류코드 중복으로 제거합니다.  80002310 부터 조회일 관련 오류코드 사용하시기 바랍니다.  2010.02.09 leech

    const E_IBX_A121X4_ENUM_DATE_BEGIN_NOTENTER               = 0x80006120;  // 조회시작일자 미입력
    const E_IBX_A121X4_ENUM_DATE_BEGIN_INVALID                = 0x80006121;  // 잘못된 조회시작일자
    const E_IBX_A121X4_ENUM_DATE_BEGIN_DENIED                 = 0x80006122;  // 제한된 조회시작일자
    const E_IBX_A121X4_ENUM_DATE_BEGIN_MICS                   = 0x80006123;  // 조회시작일자 기타오류

    const E_IBX_A121X4_ENUM_DATE_END_NOTENTER                 = 0x80006130;  // 조회종료일자 미입력
    const E_IBX_A121X4_ENUM_DATE_END_INVALID                  = 0x80006131;  // 잘못된 조회종료일자
    const E_IBX_A121X4_ENUM_DATE_END_DENIED                   = 0x80006132;  // 제한된 조회종료일자
    const E_IBX_A121X4_ENUM_DATE_END_MICS                     = 0x80006133;  // 조회시작일자 기타오류
*/

const E_IBX_A121X4_SUB_REGNO_RESIDENT_NOTENTER            = 0x80006140;  // 부사업자번호 미입력
const E_IBX_A121X4_SUB_REGNO_RESIDENT_INVALID             = 0x80006141;  // 잘못된 부사업자번호
const E_IBX_A121X4_SUB_REGNO_RESIDENT_DENIED              = 0x80006142;  // 제한된 부사업자번호
const E_IBX_A121X4_SUB_REGNO_RESIDENT_MICS                = 0x80006143;  // 부사업자번호 기타오류

const E_IBX_A121X4_REGNO_RESIDENT_NOTENTER                = 0x80006150;  // 주사업자번호 미입력
const E_IBX_A121X4_REGNO_RESIDENT_INVALID                 = 0x80006151;  // 잘못된 주사업자번호
const E_IBX_A121X4_REGNO_RESIDENT_DENIED                  = 0x80006152;  // 제한된 주사업자번호
const E_IBX_A121X4_REGNO_RESIDENT_MICS                    = 0x80006153;  // 주사업자번호 기타오류

const E_IBX_A121X4_REGNO_RESIDENT_CODE_NOTENTER           = 0x80006154;  // 업체코드 미입력
const E_IBX_A121X4_REGNO_RESIDENT_CODE_INVALID            = 0x80006155;  // 잘못된 업체코드
const E_IBX_A121X4_REGNO_RESIDENT_CODE_DENIED             = 0x80006156;  // 제한된 업체코드
const E_IBX_A121X4_REGNO_RESIDENT_CODE_MICS               = 0x80006157;  // 업체코드 기타오류

// A125X4 B2B 결제대상조회
const E_IBX_A125X4_CUSTOMER_NO_NOTENTER                   = 0x80006160;  // 회원번호 미입력
const E_IBX_A125X4_CUSTOMER_NO_INVALID                    = 0x80006161;  // 잘못된 회원번호
const E_IBX_A125X4_CUSTOMER_NO_DENIED                     = 0x80006162;  // 제한된 회원번호
const E_IBX_A125X4_CUSTOMER_NO_MICS                       = 0x80006163;  // 회원번호 기타오류

const E_IBX_A125X4_CONTRACT_NO_NOTENTER                   = 0x80006180;  // 회원번호 미입력
const E_IBX_A125X4_CONTRACT_NO_INVALID                    = 0x80006181;  // 잘못된 회원번호
const E_IBX_A125X4_CONTRACT_NO_DENIED                     = 0x80006182;  // 제한된 회원번호
const E_IBX_A125X4_CONTRACT_NO_MICS                       = 0x80006183;  // 회원번호 기타오류

// A127X4 B2B 매출등록 결과대상조회
const E_IBX_A127X4_CUSTOMER_NO_NOTENTER                   = 0x80006170;  // 회원번호 미입력
const E_IBX_A127X4_CUSTOMER_NO_INVALID                    = 0x80006171;  // 잘못된 회원번호
const E_IBX_A127X4_CUSTOMER_NO_DENIED                     = 0x80006172;  // 제한된 회원번호
const E_IBX_A127X4_CUSTOMER_NO_MICS                       = 0x80006173;  // 회원번호 기타오류

// A122X5 B2B 받을어음 내역조회
const E_IBX_A122X5_TRUST_ACCOUNT_NO_NOTENTER              = 0x80006200;  // 수탁계좌번호 미입력
const E_IBX_A122X5_TRUST_ACCOUNT_NO_INVALID               = 0x80006201;  // 잘못된 수탁계좌번호
const E_IBX_A122X5_TRUST_ACCOUNT_NO_DENIED                = 0x80006202;  // 제한된 수탁계좌번호
const E_IBX_A122X5_TRUST_ACCOUNT_NO_MICS                  = 0x80006203;  // 수탁계좌번호 기타오류

const E_IBX_A122X5_TRUST_BANK_NOTENTER                    = 0x80006205;  // 수탁은행 미입력
const E_IBX_A122X5_TRUST_BANK_INVALID                     = 0x80006206;  // 잘못된 수탁은행
const E_IBX_A122X5_TRUST_BANK_DENIED                      = 0x80006207;  // 제한된 수탁은행
const E_IBX_A122X5_TRUST_BANK_MICS                        = 0x80006208;  // 수탁은행 기타오류

/*
    //오류코드 중복으로 제거합니다.  80002310 부터 조회일 관련 오류코드 사용하시기 바랍니다.  2010.02.09 leech

    const E_IBX_A122X5_ENUM_DATE_BEGIN_NOTENTER               = 0x80006220;  // 조회시작일자 미입력
    const E_IBX_A122X5_ENUM_DATE_BEGIN_INVALID                = 0x80006221;  // 잘못된 조회시작일자
    const E_IBX_A122X5_ENUM_DATE_BEGIN_DENIED                 = 0x80006222;  // 제한된 조회시작일자
    const E_IBX_A122X5_ENUM_DATE_BEGIN_MICS                   = 0x80006223;  // 조회시작일자 기타오류

    const E_IBX_A122X5_ENUM_DATE_END_NOTENTER                 = 0x80006230;  // 조회종료일자 미입력
    const E_IBX_A122X5_ENUM_DATE_END_INVALID                  = 0x80006231;  // 잘못된 조회종료일자
    const E_IBX_A122X5_ENUM_DATE_END_DENIED                   = 0x80006232;  // 제한된 조회종료일자
    const E_IBX_A122X5_ENUM_DATE_END_MICS                     = 0x80006233;  // 조회종료일자 기타오류
*/

// A113X5 B2B 발행어음 잔액조회
const E_IBX_A113X5_ACCOUNT_NO_NOTENTER                    = 0x80006300;  // 계좌번호 미입력
const E_IBX_A113X5_ACCOUNT_NO_INVALID                     = 0x80006301;  // 잘못된 계좌번호
const E_IBX_A113X5_ACCOUNT_NO_DENIED                      = 0x80006302;  // 제한된 계좌번호
const E_IBX_A113X5_ACCOUNT_NO_MICS                        = 0x80006303;  // 계좌번호 기타오류

const E_IBX_A113X5_ACCOUNT_PASSWORD_NOTENTER              = 0x80006310;  // 계좌비밀번호 미입력
const E_IBX_A113X5_ACCOUNT_PASSWORD_INVALID               = 0x80006311;  // 잘못된 계좌비밀번호
const E_IBX_A113X5_ACCOUNT_PASSWORD_DENIED                = 0x80006312;  // 제한된 계좌비밀번호
const E_IBX_A113X5_ACCOUNT_PASSWORD_MICS                  = 0x80006313;  // 계좌비밀번호 기타오류

const E_IBX_A113X5_REGNO_RESIDENT_NOTENTER                = 0x80006320;  // 사업자번호 미입력
const E_IBX_A113X5_REGNO_RESIDENT_INVALID                 = 0x80006321;  // 잘못된 사업자번호
const E_IBX_A113X5_REGNO_RESIDENT_DENIED                  = 0x80006322;  // 제한된 사업자번호
const E_IBX_A113X5_REGNO_RESIDENT_MICS                    = 0x80006323;  // 사업자번호 기타오류

// A123X5 B2B 발행어음 내역조회
const E_IBX_A123X5_ACCOUNT_NO_NOTENTER                    = 0x80006350;  // 계좌번호 미입력
const E_IBX_A123X5_ACCOUNT_NO_INVALID                     = 0x80006351;  // 잘못된 계좌번호
const E_IBX_A123X5_ACCOUNT_NO_DENIED                      = 0x80006352;  // 제한된 계좌번호
const E_IBX_A123X5_ACCOUNT_NO_MICS                        = 0x80006353;  // 계좌번호 기타오류

const E_IBX_A123X5_ACCOUNT_PASSWORD_NOTENTER              = 0x80006360;  // 계좌비밀번호 미입력
const E_IBX_A123X5_ACCOUNT_PASSWORD_INVALID               = 0x80006361;  // 잘못된 계좌비밀번호
const E_IBX_A123X5_ACCOUNT_PASSWORD_DENIED                = 0x80006362;  // 제한된 계좌비밀번호
const E_IBX_A123X5_ACCOUNT_PASSWORD_MICS                  = 0x80006363;  // 계좌비밀번호 기타오류

const E_IBX_A123X5_REGNO_RESIDENT_NOTENTER                = 0x80006370;  // 사업자번호 미입력
const E_IBX_A123X5_REGNO_RESIDENT_INVALID                 = 0x80006371;  // 잘못된 사업자번호
const E_IBX_A123X5_REGNO_RESIDENT_DENIED                  = 0x80006372;  // 제한된 사업자번호
const E_IBX_A123X5_REGNO_RESIDENT_MICS                    = 0x80006373;  // 사업자번호 기타오류

const E_IBX_PAY_DUE_DATE_NOTENTER                         = 0x80006380;  // 납입예정일 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_PAY_DUE_DATE_INVALID                          = 0x80006381;  // 주기별 금리 변동계좌인 경우 선납이 되지 않습니다. 납입예정일 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INTEREST_UNIT_NOTENTER                        = 0x80006382;  // 이자계산단위 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INTEREST_UNIT_INVALID                         = 0x80006382;  // 잘못된 이자계산단위 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INTEREST_UNIT_DENIED                          = 0x80006383;  // 일시상환 일계산 상환방법은 회분 입력불가합니다. 이자계산단위 확인 후 다시 거래하시기 바랍니다.

/*
    //오류코드 중복으로 제거합니다.  80002310 부터 조회일 관련 오류코드 사용하시기 바랍니다.  2010.02.09 leech

    const E_IBX_A123X5_ENUM_DATE_BEGIN_NOTENTER               = 0x80006380;  // 조회시작일자 미입력
    const E_IBX_A123X5_ENUM_DATE_BEGIN_INVALID                = 0x80006381;  // 잘못된 조회시작일자
    const E_IBX_A123X5_ENUM_DATE_BEGIN_DENIED                 = 0x80006382;  // 제한된 조회시작일자
    const E_IBX_A123X5_ENUM_DATE_BEGIN_MICS                   = 0x80006383;  // 조회시작일자 기타오류

    const E_IBX_A123X5_ENUM_DATE_END_NOTENTER                 = 0x80006390;  // 조회종료일자 미입력
    const E_IBX_A123X5_ENUM_DATE_END_INVALID                  = 0x80006391;  // 잘못된 조회종료일자
    const E_IBX_A123X5_ENUM_DATE_END_DENIED                   = 0x80006392;  // 제한된 조회종료일자
    const E_IBX_A123X5_ENUM_DATE_END_MICS                     = 0x80006393;  // 조회종료일자 기타오류
*/

// A300X0 신용장발행내역 조회
const E_IBX_BRANCH_NAME_NOTENTER                          = 0x80006400;  // 영업점 미입력
const E_IBX_BRANCH_NAME_INVALID                           = 0x80006401;  // 잘못된 영업점
const E_IBX_BRANCH_NAME_MISC                              = 0x80006402;  // 영업점 기타오류
const E_IBX_BRANCH_NAME_EQUAL                             = 0x80006403;  // 동일한 가맹점 그룹명이 있습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_LC_NUMBER_NOTENTER                            = 0x80006410;  // 신용장번호 미입력
const E_IBX_LC_NUMBER_INVALID                             = 0x80006411;  // 잘못된 신용장번호
const E_IBX_LC_NUMBER_MISC                                = 0x80006412;  // 신용장번호 기타오류

// 본지사 계좌목록/거래내역조회
const E_IBX_BRANCH_NM_NOTENTER                            = 0x80006500;  // 지사업체명 미입력
const E_IBX_BRANCH_NM_INVALID                             = 0x80006501;  // 잘못된 지사업체명
const E_IBX_BRANCH_NM_DENIED                              = 0x80006502;  // 제한된 지사업체명
const E_IBX_BRANCH_NM_MISC                                = 0x80006503;  // 지사업체명 기타오류

const E_IBX_BRANCH_CD_NOTENTER                            = 0x80006510;  // 지사코드 미입력
const E_IBX_BRANCH_CD_INVALID                             = 0x80006511;  // 잘못된 지사코드
const E_IBX_BRANCH_CD_DENIED                              = 0x80006512;  // 제한된 지사코드
const E_IBX_BRANCH_CD_MISC                                = 0x80006513;  // 지사코드 기타오류

// 핀테크API 제3자정보제공동의
const E_IBX_FIN_URL_NOTENTER                              = 0x80006600; // 핀테크URL를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_URL_INVALID                               = 0x80006601; // 핀테크URL가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACCOUNT_NO_ALREADY_REGISTER               = 0x80006610;	// 이미 핀-어카운트가 발급된 계좌번호입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_EMAIL_NOTENTER                                = 0x80006620;	// 이메일을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_EMAIL_INVALID                                 = 0x80006621;	// 이메일이 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ISCD_NOTENTER                             = 0x80006630;	// 핀테크기관코드를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ISCD_INVALID                              = 0x80006631;	// 핀테크기관코드가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ISCD_DENIED                               = 0x80006632;	// 제한된 핀테크기관코드입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ISCD_NOTREGISTERED                        = 0x80006633;	// 미등록 핀테크기관코드입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ISCD_MISC                                 = 0x80006634;	// 핀테크기관코드 기타오류입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_APSNO_NOTENTER                            = 0x80006640;	// 핀테크앱일련번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_APSNO_INVALID                             = 0x80006641;	// 핀테크앱일련번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_APSNO_DENIED                              = 0x80006642;	// 제한된 핀테크앱일련번호 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_APSNO_NOTREGISTERED                       = 0x80006643;	// 미등록 핀테크앱일련번호 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_APSNO_MISC                                = 0x80006644;	// 핀테크앱일련번호 기타오류입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_DMND_TRDS_NOTENTER                        = 0x80006650;	// 요청거래구분을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_DMND_TRDS_INVALID                         = 0x80006651;	// 요청거래구분이 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACNO_NOTENTER                             = 0x80006660;	// 핀-어카운트번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACNO_INVALID                              = 0x80006661;	// 핀-어카운트번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACNO_DENIED                               = 0x80006662;	// 제한된 핀-어카운트번호 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACNO_NOTREGISTERED                        = 0x80006663;	// 미등록 핀-어카운트번호 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACNO_MISC                                 = 0x80006664;	// 핀-어카운트번호 기타오류입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ATHR_TCKT_NOTENTER                        = 0x80006670;	// 권한확인티켓을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ATHR_TCKT_INVALID                         = 0x80006671;	// 권한확인티켓이 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ATHR_TCKT_DENIED                          = 0x80006672;	// 제한된 권한확인티켓 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ATHR_TCKT_NOTREGISTERED                   = 0x80006673;	// 미등록 권한확인티켓 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ATHR_TCKT_MISC                            = 0x80006674;	// 권한확인티켓 기타오류입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FIN_ACNO_FAIL                                 = 0x80006675;	// 입력하신 계좌번호가 등록된 핀-어카운트의 계좌번호와 상이합니다.
const E_IBX_FIN_SERVER_REG_FAIL                           = 0x80006676;	// (NH 오픈플랫폼)전자서명 등록 중 오류가 발생하였습니다.
const E_IBX_FIN_ONLY_FOR_ACNO                             = 0x80006677;	// 본 화면은 핀-어카운트(공인인증서)를 위한 화면입니다.

// E100X1 백화점 대금지급 내역조회
const E_IBX_E100X1_YEAR_MONTH_NO_NOTENTER                 = 0x80007010;  // 조회년월 미입력
const E_IBX_E100X1_YEAR_MONTH_NO_INVALID                  = 0x80007011;  // 잘못된 조회년월
const E_IBX_E100X1_YEAR_MONTH_NO_DENIED                   = 0x80007012;  // 제한된 조회년월
const E_IBX_E100X1_YEAR_MONTH_NO_MISC                     = 0x80007013;  // 조회년월 기타오류

const E_IBX_E100X1_CUST_CODE_NO_NOTENTER                  = 0x80007020;  // 회원코드 미입력
const E_IBX_E100X1_CUST_CODE_NO_INVALID                   = 0x80007021;  // 잘못된 회원코드
const E_IBX_E100X1_CUST_CODE_NO_DENIED                    = 0x80007022;  // 제한된 회원코드
const E_IBX_E100X1_CUST_CODE_NO_MISC                      = 0x80007023;  // 회원코드 기타오류

const E_IBX_E100X1_COMPANY_ID_NOTENTER                    = 0x80007030;  // 회사ID 미입력
const E_IBX_E100X1_COMPANY_ID_INVALID                     = 0x80007031;  // 잘못된 회사ID
const E_IBX_E100X1_COMPANY_ID_DENIED                      = 0x80007032;  // 제한된 회사ID
const E_IBX_E100X1_COMPANY_ID_MISC                        = 0x80007033;  // 회사ID 기타오류

const E_IBX_E21001_STORE_NOTENTER                         = 0x80007034;  // 점포 미입력
const E_IBX_E21001_STORE_INVALID                          = 0x80007035;  // 잘못된 점포
const E_IBX_E21001_BRAND_NOTENTER                         = 0x80007036;  // 브랜드 미입력
const E_IBX_E21001_BRAND_INVALID                          = 0x80007037;  // 잘못된 브랜드
const E_IBX_E21001_PRODUCT_CODE_NOTENTER                  = 0x80007038;  // 품번 미입력
const E_IBX_E21001_PRODUCT_CODE_INVALID                   = 0x80007039;  // 잘못된 품번

// G100X1 통신사 조회
const E_IBX_G100X1_PSWD_CHANGE                            = 0x80007110;  //홈페이지 방문하여 비밀번호 변경 요망(비밀번호 사용 기간 초과)

// 국세청 현금영수증
const E_IBX_K10XXX_SEARCH_DENY                            = 0x80007120;  // 분기별 거래 건수가 3,000건 초과되면 조회할 수 없습니다. 관할 세무서를 방문하여 대상자료를 다운받으시기 바랍니다.

// 국세청 사업자등록상태조회
const E_IBX_K00002_AGREEMENT_DATE_NOTENTER                = 0x80007130;  // 동의받은날짜 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K00002_AGREEMENT_DATE_INVALID                 = 0x80007131;  // 잘못된 동의받은날짜입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K00002_SEARCH_PURPOSE_NOTENTER                = 0x80007132;  // 조회목적 미입력입니다. 확인 후 다시 거래하시기 바랍니다.

// 홈택스 소득금액증명원 조회
const E_IBX_K2006X_ISSUE_TYPE_NOTENTER                    = 0x80007140;  // 발급유형 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_ISSUE_TYPE_INVALID                     = 0x80007141;  // 잘못된 발급유형 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_PHONE_NUMBER_NOTENTER                  = 0x80007142;  // 전화번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_PHONE_NUMBER_INVALID                   = 0x80007143;  // 잘못된 전화번호 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_CERTIFICATE_TYPE_NOTENTER              = 0x80007144;  // 증명구분 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_CERTIFICATE_TYPE_INVALID               = 0x80007145;  // 잘못된 증명구분 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_USES_NOTENTER                          = 0x80007146;  // 사용용도 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_USES_INVALID                           = 0x80007147;  // 잘못된 사용용도 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_RECEPTION_NOTENTER                     = 0x80007148;  // 제출처 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K2006X_RECEPTION_INVALID                      = 0x80007149;  // 잘못된 제출처 입니다. 확인 후 다시 거래하시기 바랍니다.

// 홈택스 민원증명원본발급
const E_IBX_K20202_ISSUE_NUMBER_NOTENTER                  = 0x80007150;  // 발급번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20202_ISSUE_NUMBER_INVALID                   = 0x80007151;  // 잘못된 발급번호 입니다. 확인 후 다시 거래하시기 바랍니다.

// 홈택스 민원증명 통합조회
const E_IBX_K20100_OPEN_DATE_NOTENTER                     = 0x80007160;  // 발급희망개업일자 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20100_OPEN_DATE_INVALID                      = 0x80007161;  // 잘못된 발급희망개업일자 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20100_INCOME_TYPE_NOTENTER                   = 0x80007162;  // 소득구분 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20100_INCOME_TYPE_INVALID                    = 0x80007163;  // 잘못된 소득구분 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20100_ISSUE_NO_INVALID                       = 0x80007164;  // 처리(발급)불가 민원 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20100_COMPANY_CLOSED                         = 0x80007165;  // 계속사업자가 아닙니다. 사업자번호 상태 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K20100_ISSUE_DOC_INVALID                      = 0x80007166;  // 민원 문서생성 중 오류가 발생했습니다. 확인 후 다시 거래하시기 바랍니다.

  // 홈택스 세금신고결과상세조회
const E_IBX_K10115_RECEIVE_NO_NOTENTER                    = 0x80007170;  // 접수번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10115_RECEIVE_NO_INVALID                     = 0x80007171;  // 잘못된 접수번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10115_REPORT_DOCUMENT_NOTENTER               = 0x80007172;  // 신고서류 종류 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10115_REPORT_DOCUMENT_INVALID                = 0x80007173;  // 잘못된 신고서류 종류입니다. 확인 후 다시 거래하시기 바랍니다.

// 홈택스 수임사업자기본사항
const E_IBX_RECRUITMENTDATA_NOTREGISTERED                 = 0x80007180;  // 수임자료를 확인하세요. 미등록 또는 미동의시에 조회가 불가능합니다.

// 국세청 전자세금 계산서
const E_IBX_K10XXX_TAX_AGENT_PASSWORD_NOTENTER            = 0x800071FC;  // 세무대리인 관리 비밀번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAX_AGENT_PASSWORD_INVALID             = 0x800071FD;  // 잘못된 세무대리인 관리 비밀번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_CLASS_NOTENTER                         = 0x800071FE;  // 분류 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_CLASS_INVALID                          = 0x800071FF;  // 잘못된 분류 입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_K105X4_SEARCH_DENY                            = 0x80007200;  // 1000건 이상은 조회할 수 없습니다. 대량 조회를 원하는 경우 세무서를 방문해주시기 바랍니다.
const E_IBX_K105X5_APPROVAL_CODE_NOTENTER                 = 0x80007201;  // 승인번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K105X5_APPROVAL_CODE_INVALID                  = 0x80007202;  // 잘못된 승인번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAX_AGENT_NO_NOTENTER                  = 0x80007203;  // 세무대리인 관리번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAX_AGENT_NO_INVALID                   = 0x80007204;  // 잘못된 세무대리인 관리번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAXPAYER_REGNO_NOTENTER                = 0x80007205;  // 납세자 사업자번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAXPAYER_REGNO_INVALID                 = 0x80007206;  // 잘못된 납세자 사업자번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_PROVIDER_REGNO_NOTENTER                = 0x80007207;  // 공급자 사업자등록번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_RECEIVER_REGNO_NOTENTER                = 0x80007208;  // 공급받는자 사업자등록번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_DATE_NOTENTER                          = 0x80007209;  // 작성일자 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_PROVIDE_AMOUNT_NOTENTER                = 0x8000720A;  // 공급가액 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_PROVIDER_REGNO_INVALID                 = 0x8000720B;  // 잘못된 공급자 사업자등록번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_RECEIVER_REGNO_INVALID                 = 0x8000720C;  // 잘못된 공급받는자 사업자등록번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAX_CODE_NOTENTER                      = 0x8000720D;  // 세금계산서 코드 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_TAX_CODE_INVALID                       = 0x8000720E;  // 잘못된 세금계산서 코드 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_DATE_INVALID                           = 0x80007215;  // 잘못된 작성일자 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_PROVIDE_AMOUNT_INVALID                 = 0x80007216;  // 잘못된 공급가액 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_OPERATOR_TYPE_NOTENTER                 = 0x80007217;  // 사업자권한 전환구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10XXX_OPERATOR_TYPE_INVALID                  = 0x80007218;  // 잘못된 사업자권한 전환구분 입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_K10403_REGNO_JUMIN_NOTENTER                   = 0x8000720F;  // 사업자번호나 주민번호를 입력하지 않았습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K10403_REGNO_JUMIN_INVALID                    = 0x80007213;  // 입력하신 사업자번호나 주민번호 오류입니다. 확인 후 다시 거래하시기 바랍니다.

// 관세청 UNI-PASS 수출이행 내역조회
const E_IBX_K00003_EXPORT_NOTIFY_NO_NOTENTER              = 0x80007210;  // 수출신고번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K00003_EXPORT_NOTIFY_NO_INVALID               = 0x80007211;  // 잘못된 수출신고번호 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K00004_EXPORT_CAR_BODY_NO_NOTENTER            = 0x80007212;  // 차대번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K00004_EXPORT_CAR_BODY_NO_INVALID         	  = 0x80007214;  // 잘못된 차대번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_K00004_EXPORT_CAR_BODY_NOTFOUND        	      = 0x80007219;  // 조회 불가능한 차대번호입니다. 확인 후 다시 거래하시기 바랍니다.

// SCM서비스
const E_IBX_EX0001_CERTKEY_NOTENTER                       = 0x80007220;  // 인증키 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX0001_CERTKEY_INVALID                        = 0x80007221;  // 잘못된 인증키입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX0001_AUTHEN_NUMBER_INVALID                  = 0x80007222;  // 인증번호가 일치하지 않습니다.
const E_IBX_EX0001_PHONE_ACCOUNT_INFO_NOMATCH             = 0x80007223;  // 휴대폰본인확인에 실패하였습니다. 다시 시도해 주십시오.

const E_IBX_EX0001_CENTERKEY_NOTENTER                     = 0x80007225;  // 거래처코드 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX0001_CENTERKEY_INVALID                      = 0x80007226;  // 잘못된 거래처코드입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_EX0001_ENTERPRISE_NAME_NOTENTER               = 0x80007230;  // 유통업체명 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX0001_ENTERPRISE_NAME_INVALID                = 0x80007231;  // 잘못된 유통업체명입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_EX0001_VENDOR_NOTENTER                        = 0x80007240;  // 협력업체명 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX0001_VENDOR_INVALID                         = 0x80007241;  // 잘못된 협력업체명입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX001_BATCH_DOWNLOAD                          = 0x80007242;  // 파일다운로드가 신청되었습니다. 잠시 후 납품정보 다운로드 신청확인에서 조회하시기 바랍니다.
const E_IBX_EX001_DUPLICATE_BATCH_DOWNLOAD                = 0x80007243;  // 기존 신청내역이 있습니다. 신청내역 확인후 다시 조회하시기 바랍니다.
const E_IBX_EX001_DOWNLOAD_TRANSACTION                    = 0x80007244;  // 신청된 내역이 처리중입니다. 잠시 후 다시 조회하시기 바랍니다.
const E_IBX_EX001_SEARCH_FAIL                             = 0x80007245;  // 조건에 맞는 데이터를 찾지 못하였습니다. 확인 후 다시 조회하시기 바랍니다.

/*
    //오류코드 중복으로 제거합니다.  80004200, 80004201 조회구분 관련 오류코드 사용하시기 바랍니다.  2014.01.23 boram
    const E_IBX_EX0001_SEARCH_INFO_NOTENTER                   = 0x80007250;  // 조회구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
    const E_IBX_EX0001_SEARCH_INFO_INVALID                    = 0x80007251;  // 잘못된 조회구분입니다. 확인 후 다시 거래하시기 바랍니다.
*/
const E_IBX_EX0001_UNIT_INFO_NOTENTER                     = 0x80007252;  // 회계단위정보 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EX0001_UNIT_INFO_INVALID                      = 0x80007253;  // 잘못된 회계단위정보입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_M10001_CUSTOMER_NO_PASSWORD_INVALID           = 0x80007310; //회원번호 또는 비밀번호가 정확하지 않습니다. 확인 후 다시 거래하십시오.

/* server-side error code : VAN */

// V100X1 VAN서비스 승인내역조회
const E_IBX_VAN_PURCHASE_NAME_NOTENTER                    = 0x80007510;  // 매입사 미입력
const E_IBX_VAN_PURCHASE_NAME_INVALID                     = 0x80007511;  // 잘못된 매입사
const E_IBX_VAN_PURCHASE_NAME_DENIED                      = 0x80007512;  // 제한된 매입사
const E_IBX_VAN_PURCHASE_NAME_MISC                        = 0x80007513;  // 매입사 기타오류

/* server-side error code : iBIZD */
// 영업일 계산 모듈 iBIZD
const E_IBX_IBIZD_LOAD_FAIL                               = 0x80007610;  //영업일 계산 모듈 로드 실패
const E_IBX_IBIZD_INVALID_DATE                            = 0x80007620;  //잘못된 영업일
const E_IBX_IBIZD_DATA_NOTFOUND                           = 0x80007630;  //영업일 데이타 파일 없음

// 전화이용요금(청구내역조회)
const E_IBX_DATE_DEMAND_NOTENTER                          = 0x80007710; // 청구월 미입력
const E_IBX_DATE_DEMAND_INVALID                           = 0x80007711; // 잘못된 청구월
const E_IBX_DATE_DEMAND_MISC                              = 0x80007712; // 청구월 기타오류

const E_IBX_TELEPHONE_NOTENTER                            = 0x80007810; // 전화번호 미입력
const E_IBX_TELEPHONE_INVALID                             = 0x80007811; // 잘못된 전화번호
const E_IBX_TELEPHONE_MISC                                = 0x80007812; // 전화번호 기타오류

/* server-side error code : eXchange */
const E_IBX_EXCHANGE_NOTICE_TIME_NOTENTER                 = 0x80008100;  // 고시회차 미입력
const E_IBX_EXCHANGE_NOTICE_TIME_INVALID                  = 0x80008101;  // 잘못된 고시회차
const E_IBX_EXCHANGE_NOTICE_TIME_DENIED                   = 0x80008102;  // 제한된 고시회차
const E_IBX_EXCHANGE_NOTICE_TIME_MISC                     = 0x80008103;  // 고시회차 기타오류

//B23000 기준가격조회
const E_IBX_B23000_FUND_NM_NOTENTER                       = 0x80008210;  // 펀드명 미입력
const E_IBX_B23000_FUND_NM_INVALID                        = 0x80008211;  // 잘못된 펀드명
const E_IBX_B23000_FUND_NM_MISC                           = 0x80008212;  // 펀드명 기타오류

//D10006 가맹점 매출내역조회
const E_IBX_D10006_DOWNLOAD_REQUEST                       = 0x80008310;  // 해당 카드사 매출내역 상세조회 다운로드가 접수되었습니다.(30분에서 1시간 후 다시 조회하시기 바랍니다.)
const E_IBX_D10006_DOWNLOAD_TRANSACTION                   = 0x80008311;  // 해당 카드사 매출내역 상세조회 다운로드 접수 후 처리중입니다.(30분에서 1시간 후 다시 조회하시기 바랍니다.)

// 전자상거래 관련 오류(공통)
const E_IBX_SALE_NUM_NOTENTER                             = 0x80008500;  // 주문번호 미입력
const E_IBX_SALE_NUM_INVALID                              = 0x80008501;  // 주문번호 검색 오류

const E_IBX_SALE_NUM_DETAIL_NOTENTER                      = 0x80008400;  // 주문상세번호 미입력
const E_IBX_SALE_NUM_DETAIL_INVALID                       = 0x80008401;  // 잘못된 주문상세번호

const E_IBX_SETTLEMENT_DATE_NOTENTER                      = 0x80008600;  // 결제일 미입력
const E_IBX_SETTLEMENT_DATE_INVALID                       = 0x80008601;  // 잘못된 결제일

const E_IBX_SALE_DATE_NOTENTER                            = 0x80008700;  // 주문일 미입력
const E_IBX_SALE_DATE_INVALID                             = 0x80008701;  // 잘못된 주문일

const E_IBX_COOPERATION1_NOTENTER                         = 0x80008800;  // 협력사명1 미입력
const E_IBX_COOPERATION1_INVALID                          = 0x80008801;  // 잘못된 협력사명1

const E_IBX_COOPERATION2_NOTENTER                         = 0x80008900;  // 협력사명2 미입력
const E_IBX_COOPERATION2_INVALID                          = 0x80008901;  // 잘못된 협력사명2

const E_IBX_COOPERATION3_NOTENTER                         = 0x80009000;  // 협력사명3 미입력
const E_IBX_COOPERATION3_INVALID                          = 0x80009001;  // 잘못된 협력사명3

const E_IBX_COOPERATION4_NOTENTER                         = 0x80009100;  // 협력사명4 미입력
const E_IBX_COOPERATION4_INVALID                          = 0x80009101;  // 잘못된 협력사명4

const E_IBX_BUNCH_CODE_NOTENTER                           = 0x80009105;  // 묶음배송코드 미입력
const E_IBX_BUNCH_CODE_INVALID                            = 0x80009106;  // 잘못된 묶음배송코드

const E_IBX_COOPERATION_CODE_NOTENTER                     = 0x80009110;  // 협력사코드 미입력
const E_IBX_COOPERATION_CODE_INVALID                      = 0x80009111;  // 잘못된 협력사코드

// T200X4 배송요청
const E_IBX_T200X4_DELIVERY_DATE_NOTENTER                 = 0x80009200;  // 배송일자 미입력
const E_IBX_T200X4_DELIVERY_DATE_INVALID                  = 0x80009201;  // 잘못된 배송일자

const E_IBX_T200X4_DELIVERY_NAME_NOTENTER                 = 0x80009300;  // 택배사 미입력
const E_IBX_T200X4_DELIVERY_NAME_INVALID                  = 0x80009301;  // 잘못된 택배사

const E_IBX_T200X4_INVOICE_NOTENTER                       = 0x80009400;  // 송장번호 미입력
const E_IBX_T200X4_INVOICE_INVALID                        = 0x80009401;  // 잘못된 송장번호
const E_IBX_T200X4_INVOICE_REGISTERED                     = 0x80009402;  // 이미 등록된 송장번호 입니다. 확인 후 다시 조회하시기 바랍니다.

const E_IBX_T200X4_ITEM_CHOICE                            = 0x80009410;  // 발송할 항목 미선택
const E_IBX_T200X4_OVERSEAS                               = 0x80009411;  // 해외배송처리는 해당 사이트에 로그인하셔서 처리해주시기 바랍니다.

// T110X5 Q&A답변등록
const E_IBX_T110X5_QUESTION_NUM_NOTENTER                  = 0x80009500;  // 문의번호 미입력
const E_IBX_T110X5_QUESTION_NUM_INVALID                   = 0x80009501;  // 잘못된 문의번호

const E_IBX_T110X5_QUESTION_DATE_NOTENTER                 = 0x80009600;  // 접수일시 미입력
const E_IBX_T110X5_QUESTION_DATE_INVALID                  = 0x80009601;  // 잘못된 접수일시

const E_IBX_T110X5_CUSTOMER_NAME_ID_NOTENTER              = 0x80009700;  // 고객명/ID 미입력
const E_IBX_T110X5_CUSTOMER_NAME_ID_INVALID               = 0x80009701;  // 잘못된 고객명/ID

const E_IBX_T110X5_QUESTION_TITLE_NOTENTER                = 0x80009800;  // 제목 미입력
const E_IBX_T110X5_QUESTION_TITLE_INVALID                 = 0x80009801;  // 잘못된 제목

const E_IBX_T110X5_QUESTION_REPLY_NOTENTER                = 0x80009900;  // 답변 미입력
const E_IBX_T110X5_QUESTION_REPLY_INVALID                 = 0x80009901;  // 잘못된 답변
const E_IBX_T110X5_QUESTION_REPLY_EDIT_DENY               = 0x80009902;  // 답변 수정불가
const E_IBX_T110X5_QUESTION_REPLY_ADD_DENY                = 0x80009903;  // 추가답변은 2회까지만 가능
const E_IBX_T110X5_QUESTION_REPLY_EMAILSTRING_DENY        = 0x80009904;  // 직거래 피해를 방지하기 위하여 문의게시판에서의 이메일 주소 및 홈페이지 관련 문구 (COM, @, WWW. net, 네이버, 야후 등) 기재는 금지되어 있습니다.

  // 보험사 법인보험
const E_IBX_I10X11_CORP_REGIST_NO_NOTENTER                = 0x80007080;  // 법인등록번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_I10X11_CORP_REGIST_NO_INVALID                 = 0x80007081;  // 잘못된 법인등록번호입니다. 확인 후 다시 거래하시기 바랍니다.

// I10101 보험사 가입특약사항조회
const E_IBX_I10101_INSURANCE_NO_NOTENTER                  = 0x80007100;  // 증권번호 미입력
const E_IBX_I10101_INSURANCE_NAME_NOTENTER                = 0x80007101;  // 상품명 미입력
const E_IBX_I10101_INSURED_NOTENTER                       = 0x80007102;  // 피보험자 미입력
const E_IBX_I10101_INSURANCE_INFO_INVALID                 = 0x80007103;  // 잘못된 보험계약정보
const E_IBX_I10101_INSURANCE_INFO_INVALID2                = 0x80007105;  // 해지된 보험계약정보
const E_IBX_I10101_INSURANCE_NO_INVALID                   = 0x80007104;  // 잘못된 증권번호


// T121X8 게시판 상세조회
const E_IBX_T121X8_KEY_VALUE_NOTENTER                     = 0x80009910;  // 목록 키값 미입력
const E_IBX_T121X8_KEY_VALUE_INVALID                      = 0x80009911;  // 잘못된 목록 키값

const E_IBX_T121X8_SAVE_FILENAME_NOTENTER                 = 0x80009A10;  // 저장 파일명 미입력
const E_IBX_T121X8_SAVE_PATH_NOTENTER                     = 0x80009A11;  // 저장경로 미입력
const E_IBX_T121X8_SAVE_TYPE_NOTENTER                     = 0x80009A12;  // 저장구분 미입력

// T120X6 정산내역 조회
const E_IBX_T120X6_ADJUSTED_DEGREE_NOTENTER               = 0x80009A20;  // 정산차수 미입력
const E_IBX_T120X6_ADJUSTED_DEGREE_INVALID                = 0x80009A21;  // 잘못된 정산차수

// S1X00X 경제통계 서비스
const E_IBX_S1600X_KIND_NOENTER                           = 0x8000AA01;  // 종류 미입력
const E_IBX_S1600X_KIND_INVALID                           = 0x8000AA02;  // 잘못된 종류

const E_IBX_S1600X_NAME_KIND_NOENTER                      = 0x8000AB01;  // 종류명 미입력
const E_IBX_S1600X_NAME_KIND_INVALID                      = 0x8000AB02;  // 잘못된 종류명

const E_IBX_S1600X_VALUATION_NOENTER                      = 0x8000AC01;  // 적용대상/채권신용/평가등급 미입력
const E_IBX_S1600X_VALUATION_INVALID                      = 0x8000AC02;  // 잘못된 적용대상/채권신용/평가등급

const E_IBX_S1600X_EARNING_RATE_NOENTER                   = 0x8000AD01;  // 수익률 기간 미입력
const E_IBX_S1600X_EARNING_RATE_INVALID                   = 0x8000AD02;  // 잘못된 수익률 기간

//S30101 주식 종합정보 조회
const E_IBX_S30101_ITEM_CODE_NOENTER                      = 0x8000AE01;  // 종목 코드 미입력
const E_IBX_S30101_ITEM_CODE_INVALID                      = 0x8000AE02;  // 잘못된 종목 코드

// 개인정보서비스

// P00012 전자민원G4C 주민등록표열람
const E_IBX_P00012_NAME_NOENTER                           = 0x8000B001;  // 성명을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00012_NAME_INVALID                           = 0x8000B002;  // 열람대상자 성명과 신청인 성명이 동일하지 않습니다. 열람대상자 본인만 신청하세요
const E_IBX_P00012_RESIDENT_BASIC_ADDR1_NOENTER           = 0x8000B003;  // 주민등록상 기본주소를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00012_RESIDENT_BASIC_ADDR1_INVALID           = 0x8000B004;  // 주민등록상 기본주소가 잘못 입력되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00012_RESIDENT_BASIC_ADDR2_NOENTER           = 0x8000B005;  // 주민등록상 기본주소 '일반/산' 중 택일 바랍니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00012_RESIDENT_BASIC_ADDR2_INVALID           = 0x8000B006;  // 주민등록상 기본주소 '일반/산' 중 택일 바랍니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00012_RESIDENT_BASIC_ADDR3_NOENTER           = 0x8000B007;  // 주민등록상 기본주소 '호'를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00012_PROCESS_STATE_RECEIVE                  = 0x8000B010;  // 처리기관 연계가 원활하지 않아 주민등록표의 열람신청이 접수 상태입니다. 최대 1시간까지 접수로 표시될 수 있으니 잠시 후에 거래하시기 바랍니다.
const E_IBX_P00012_STATE_IN_PROGRESS                      = 0x8000B013;  // 진행중인 서비스 신청이 존재합니다. 신규 신청이 불가능합니다.

// P00000 전자민원G4C 주소검색
const E_IBX_P00000_AREA_NAME_NOENTER                      = 0x8000B011;  // 읍(면/동)을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00000_AREA_NAME_INVALID                      = 0x8000B012;  // 잘못된 읍(면/동)을 입력하셨습니다. 확인 후 거래하시기 바랍니다.

// P00X30 국민연금관리공단_소득공제용 납부확인서
const E_IBX_P00X30_JOIN_CLASS_NOENTER                     = 0x8000B020;  // 가입종별을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00X30_JOIN_CLASS_INVALID                     = 0x8000B021;  // 잘못된 가입종별을 입력하셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00X30_ISSUE_TYPE_NOENTER                     = 0x8000B022;  // 발급용도를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00X30_ISSUE_TYPE_INVALID                     = 0x8000B023;  // 잘못된 발급용도를 입력하셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P0000X_ADDITIONAL_ID_NOENTER	                = 0x8000B030;  // 추가 ID 미입력
const E_IBX_P0000X_ADDITIONAL_ID_INVALID	                = 0x8000B031;  // 잘못된 추가 ID

// P00XXX 국민건강보험
const E_IBX_P00XXX_PAY_TYPE_NOENTER                       = 0x8000B100;  // 조회구분 미입력
const E_IBX_P00XXX_PAY_TYPE_INVALID                       = 0x8000B101;  // 잘못된 조회구분

// 나의검진형황 관련
const E_IBX_SERVICE_ALREADY_CONNECTED                     = 0x8000B120; // 나의검진현황 서비스가 이미 연동되어 있습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_NEED_CONNECT_SERVICE                          = 0x8000B121; // 건강iN 검진현황서비스 사용자 연동이 필요합니다. 확인 후 거래하시기 바랍니다.
const E_IBX_NOT_MATCHED_USERINFO                          = 0x8000B122; // 사용자 정보가 불일치 합니다. 확인 후 거래하시기 바랍니다.
const E_IBX_NEED_TO_DO_SURVEY_STEP                        = 0x8000B123; // 현재 건강정보 입력 후 생활습관설문을 진행 하시기 바랍니다.
const E_IBX_NOT_TO_DO_SURVEY_STEP                         = 0x8000B124; // 설문을 작성하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_CANT_CALCULATE_PREDICTION_RISK                = 0x8000B125; // 예측 위험도를 계산할 수 없습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_NOT_AGE_TO_SEARCH                             = 0x8000B126; // 조회 가능한 나이가 아닙니다. 확인 후 거래하시기 바랍니다.
const E_IBX_SENSITIVE_INFO_USE_AGREEMENT_YN               = 0x8000B127; // 민감정보 수집 동의 미입력 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_SENSITIVE_INFO_USE_NOT_AGREEMENT              = 0x8000B128; // 나의 건강현황 서비스제공을 위한 민감정보 수집 및 이용에 동의 하지 않으셨습니다.
const E_IBX_SENSITIVE_INFO_USE_AGREEMENT_INVALID          = 0x8000B129; // 잘못된 민감정보 수집 동의 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_HEALTH_INSURANCE_CARD_NOT_REGISTER            = 0x8000B130; // 건강보험증이 등록되지 않아 서비스 이용이 불가능 합니다. 확인 후 거래하시기 바랍니다.
const E_IBX_CHILDREN_INFO_NOT_REGISTER                    = 0x8000B131; // 등록된 자녀가 없습니다. 자녀 등록 후 이용해 주세요.

// P00023 민원24 등초본 제3자 발급
const E_IBX_P00023_SERVICE_NOTENTER                       = 0x8000B210;  // 민원사무구분을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00023_SERVICE_INVALID                        = 0x8000B211;  // 잘못된 민원사무구분을 입력하셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P00023_RECEIVER_ID_NOTENTER                   = 0x8000B212;  // 수신인아이디를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00023_RECEIVER_ID_INVALID                    = 0x8000B213;  // 잘못된 수신인아이디를 입력하셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P00023_RECEIVER_NAME_NOTENTER                 = 0x8000B214;  // 수신인성명을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00023_RECEIVER_NAME_INVALID                  = 0x8000B215;  // 잘못된 수신인성명을 입력하셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P00023_RECEIVER_TEL_NOTENTER                  = 0x8000B216;  // 수신인연락처를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00023_RECEIVER_TEL_INVALID                   = 0x8000B217;  // 잘못된 수신인연락처를 입력하셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P00023_ID_WRONG_USER                          = 0x8000B218;  // 수신자 아이디와 이름이 일치하지 않습니다.
const E_IBX_P00023_ID_WRONG_TEL                           = 0x8000B219;  // 입력하신 수신인 연락처가 아이디에 등록된 연락처와 일치하지 않습니다.
const E_IBX_P00023_SERVICE_DENIED                         = 0x8000B220;  // 개인(외국인) 신청할 수 없는 민원유형입니다
const E_IBX_P00023_REQUEST_DENIED                         = 0x8000B221;  // 개인정보 보호를 위해 5회 이상 틀린 정보를 입력하신 경우 당일 신청이 불가합니다.

// P00222 국민건강보험 요양원 - 수진자 자격 조회
const E_IBX_P00222_INCORRECT_INFOMATION                   = 0x8000B110;  // 입력된 정보 (주민번호/성명)가 잘못 되었습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P00222_NOT_EXIST_REQUIREMENT                  = 0x8000B111;  // 건강보험에 취득중인 자격이 존재하지 않습니다. 확인 후 다시 거래하시기 바랍니다.

// P00014 민원24 지방세
const E_IBX_P00014_MINWON_REQ_FAIL                        = 0x8000B300;  // 신청 주소 정보가 상이하여 민원 신청에 실패했습니다. 정확히 확인하여 다시 거래하시기 바랍니다.
const E_IBX_P00014_MINWON_NONPAYMENT_EXIST                = 0x8000B310;  // 신청인(납세자)에 체납 건이 있습니다. 확인 후 다시 거래하시기 바랍니다.

// P00015 정부24 국가유공자확인
const E_IBX_P00015_PATRIOTISM_NO_NOTENTER                 = 0x8000B330;  // 보훈번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P00015_PATRIOTISM_NO_INVALID                  = 0x8000B331;  // 잘못된 보훈번호를 입력하셨습니다. 확인 후 거래하시기 바랍니다.

// 통합연금포털
const E_IBX_FUTURE_PENSION_AMOUNT_NOTENTER                = 0x8000B400;  // 미래가치예상연금액 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_FUTURE_PENSION_AMOUNT_INVALID                 = 0x8000B401;  // 잘못된 미래가치예상연금액입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_LAST_3MONTH_AVG_WAGE_NOTENTER                 = 0x8000B402;  // 최근3개월월평균임금 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_LAST_3MONTH_AVG_WAGE_INVALID                  = 0x8000B403;  // 잘못된 최근3개월월평균임금입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ANNUAL_BONUS_NOTENTER                         = 0x8000B404;  // 연간상여금 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ANNUAL_BONUS_INVALID                          = 0x8000B405;  // 잘못된 연간상여금입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_WORK_JOINT_YEAR_MONTH_NOTENTER                = 0x8000B406;  // 현직장입사년월 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_WORK_JOINT_YEAR_MONTH_INVALID                 = 0x8000B407;  // 잘못된 현직장입사년월입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_RETIREMENT_YEAR_MONTH_NOTENTER                = 0x8000B408;  // 예상퇴직년월 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_RETIREMENT_YEAR_MONTH_INVALID                 = 0x8000B409;  // 잘못된 예상퇴직년월입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_WAGE_INCREASE_RATE_NOTENTER         = 0x8000B410;  // 예상임금인상률 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_WAGE_INCREASE_REATE_INVALID         = 0x8000B411;  // 잘못된 예상임금인상률입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_RETIREMENT_WAGE_EARNING_RATE_NOTENTER         = 0x8000B412;  // 퇴직후연금수익률 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_RETIREMENT_WAGE_EARNING_RATE_INVALID          = 0x8000B413;  // 잘못된 퇴직후연금수익률입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_STANDARD_CONSUMPTION_NOTENTER                 = 0x8000B414;  // 소비기준 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_STANDARD_CONSUMPTION_INVALID                  = 0x8000B415;  // 잘못된 소비기준입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_LIFE_EXPECTANCY_NOTENTER            = 0x8000B416;  // 예상기대수명 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_LIFE_EXPECTANCY_INVALID             = 0x8000B417;  // 잘못된 예상기대수명입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_EARNING_RATE_NOTENTER               = 0x8000B418;  // 기대수익률 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_EARNING_RATE_INVALID                = 0x8000B419;  // 잘못된 기대수익률입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_INFLATION_RATE_NOTENTER                       = 0x8000B420;  // 물가상승률 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_INFLATION_RATE_INVALID                        = 0x8000B421;  // 잘못된 물가상승률입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_HOLDING_ASSET_NOTENTER                        = 0x8000B422;  // 보유자산 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_HOLDING_ASSET_INVALID                         = 0x8000B423;  // 잘못된 보유자산입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ASSET_ESTIMATED_EARNING_RATE_NOTENTER         = 0x8000B424;  // 보유자산의 기대수익율 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ASSET_ESTIMATED_EARNING_RATE_INVALID          = 0x8000B425;  // 잘못된 보유자산의 기대수익율입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_ENTIRE_AGE_NOTENTER                 = 0x8000B426;  // 예상은퇴연령 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_ESTIMATED_ENTIRE_AGE_INVALID                  = 0x8000B427;  // 잘못된 예상은퇴연령입니다. 확인 후 거래하시기 바랍니다.

// 정부24 민원신청
const E_IBX_MINWON_REG_TOTALCNT_OVER                      = 0x8000B500;  // 민원바구니의 민원수가 50건을 초과하였습니다. 원활한 민원처리를 위하여 민원바구니에서 먼저 결제하신후 다시 신청하여 주시기 바랍니다.
const E_IBX_N00003_DOWNUP_CHECK_MESSAGE                   = 0x8000C001;  // 다운로드 또는 업로드 중 오류가 발생하였습니다. 확인 후 다시 거래하시기 바랍니다. 시작
const E_IBX_N00003_DOWNUP_CHECK_MESSAGE_MASK              = 0x8000C00F;  // 다운로드 또는 업로드 중 오류가 발생하였습니다. 확인 후 다시 거래하시기 바랍니다. 끝
const E_IBX_P00014_MINWON_RESULT_FAIL                     = 0x8000B320;  // 과세내역이 없습니다. 확인 후 거래하시기 바랍니다.

// P21001 진위여부조회(신분증)
const E_IBX_P21001_DRIVE_NO_NOTENTER                      = 0x8000C010;  // 면허번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_DRIVE_NO_INVALID                       = 0x8000C011;  // 면허번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_DATE_NOTENTER                    = 0x8000C012;  // 발급일자를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_DATE_INVALID                     = 0x8000C013;  // 발급일자가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_NO_NOTENTER                      = 0x8000C014;  // 문서(발급)번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_NO_INVALID                       = 0x8000C015;  // 문서(발급)번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_ORG_NOTENTER                     = 0x8000C016;  // 발급기관(사이트)가 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_ORG_INVALID                      = 0x8000C017;  // 발급기관(사이트)가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_REGION_NOTENTER                  = 0x8000C018;  // 발급기관(시군구)을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_REGION_INVALID                   = 0x8000C019;  // 발급기관(시군구)가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_ISSUE_NO_DENIED                        = 0x8000C020;  // 일일 입력 오류횟수(5회) 초과입니다. 더이상 당일 조회가 불가합니다.
const E_IBX_P21001_ISSUE_DATE_DENIED                      = 0x8000C021;  // 서비스 되지 않는 발급일자입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_FOREIGNER_REGNO_NOTENTER               = 0x8000C022;  // 외국인등록번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_FOREIGNER_REGNO_INVALID                = 0x8000C023;  // 외국인등록번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_SECURE_NO_NOTENTER                     = 0x8000C024;  // 암호일련번호(식별번호)를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_SECURE_NO_INVALID                      = 0x8000C025;  // 암호일련번호(식별번호)가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_RESULT_REASON_FAIL                     = 0x8000C026;  // 불일치, 결과검증(불일치 사유)에 실패했습니다. 주민등록증 입력정보 확인 후 다시 거래하십시오.
const E_IBX_P21001_DRIVE_NO_DATA                          = 0x8000C027;  // 면허정보가 없습니다. 확인 후 조회하시기 바랍니다.
const E_IBX_P21001_SECURE_NO_MISC                         = 0x8000C028;  // 암호일련번호(식별번호) 기타 오류입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_FOREIGNER_REASON_FAIL                  = 0x8000C029;  // 결과검증에 실패했습니다. 외국인등록증 입력정보 확인 후 다시 거래하십시오.
const E_IBX_P21001_PARAMETER_REASON_FAIL                  = 0x8000C030;  // 결과검증에 실패했습니다. 진위확인 입력정보 확인 후 다시 거래하십시오.
const E_IBX_P21001_PASSPORT_NO_NOTENTER                   = 0x8000C031;  // 여권번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21001_PASSPORT_NO_INVALID                    = 0x8000C032;  // 여권번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.


// P21004 진위여부조회(인터넷발급문서)
const E_IBX_P21004_NOT_EXIST_DOC                          = 0x8000C040;  // 해당 문서가 존재하지 않습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21004_NOT_SERVICE_DOC                        = 0x8000C041;  // 열람기간이 지난 문서입니다. 확인 후 거래하시기 바랍니다.

// P02001 건강보험 납부확인서
const E_IBX_P02001_LANG_NOENTER                           = 0x8000C050;  // 언어 구분을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_LANG_INVALID                           = 0x8000C051;  // 잘못된 언어 구분을 입력하셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_DETAIL_NOENTER                         = 0x8000C052;  // 세부 보험 값을 선택하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_DETAIL_INVALID                         = 0x8000C053;  // 잘못된 세부 보험 값을 선택하셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_WORK_GB_NOENTER                        = 0x8000C054;  // 확인서 선택 값을 선택하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_WORK_GB_INVALID                        = 0x8000C055;  // 잘못된 확인서 선택 값을 입력하셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_DATE_DENIED                            = 0x8000C056;  // 잘못된 조회 기간입니다. 조회 시작 및 종료 년도가 같아야 합니다.
const E_IBX_P02001_FAX_NO_NOENTER                         = 0x8000C057;  // 팩스 번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P02001_FAX_NO_INVALID                         = 0x8000C058;  // 잘못된 팩스 번호를 입력하셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P21014_ISSUE_WORK_GB_OPTION_NOENTER           = 0x8000C060;  // 발급문서 선택 값을 선택하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21014_ISSUE_WORK_GB_OPTION_INVALID           = 0x8000C061;  // 잘못된 발급문서 선택 값을 입력하셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21014_BUSINESS_PLACE_NUM_NOENTER             = 0x8000C062;  // 사업장관리번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P21014_BUSINESS_PLACE_NUM_INVALID             = 0x8000C063;  // 잘못된 사업장관리번호를 입력하셨습니다. 확인 후 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                              보육정보서비스                                 //
/////////////////////////////////////////////////////////////////////////////////
// U10001 아동목록조회
const E_IBX_U10001_ENROLLMENT_YN_NOENTER                  = 0x8000D001;  // 재학여부정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10001_ENROLLMENT_YN_INVALID                  = 0x8000D002;  // 재학여부정보가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10001_SUPPORT_YEAR_NOENTER                   = 0x8000D003;  // 지원년도를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10001_SUPPORT_YEAR_INVALID                   = 0x8000D004;  // 자원년도가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10001_ADMISSION_DATE_NOENTER                 = 0x8000D005;  // 입학일자를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10001_ADMISSION_DATE_INVALID                 = 0x8000D006;  // 입학일자가 잘못되었습니다. 확인 후 거래하시기 바랍니다.

// U10003 보육교직원목록조회
const E_IBX_U10002_APPOINTMENT_DATE_NOENTER               = 0x8000D007;  // 임용일자를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10002_APPOINTMENT_DATE_INVALID               = 0x8000D008;  // 임용일자가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10002_APPOINTMENT_STATE_NOENTER              = 0x8000D009;  // 임용상태를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_U10002_APPOINTMENT_STATE_INVALID              = 0x8000D010;  // 임용상태가 잘못되었습니다. 확인 후 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                                   온나라                                    //
/////////////////////////////////////////////////////////////////////////////////
// J10001 부동산 법인정보 서비스
const E_IBX_J10001_SACRAP_INFO_NOTENTER                   = 0x8000C101; // 조회구분 미입력 오류입니다.
const E_IBX_J10001_INVALID_SCRAP_INFO                     = 0x8000C102; // 잘못된 조회구분값입니다.

const E_IBX_J10001_SEARCH_GUBUN_NOTENTER                  = 0x8000C103; // 주택구분 미입력 오류입니다.
const E_IBX_J10001_INVALID_SEARCH_GUBUN                   = 0x8000C104; // 잘못된 주택구분 입니다.

const E_IBX_J10001_INVALID_AREA                           = 0x8000C105; // 잘못된 지역_시도명입니다.
const E_IBX_J10001_DONG_CODE_NOTENTER                     = 0x8000C106; // 지역_읍면동(리)코드 미입력 오류입니다.
const E_IBX_J10001_INVALID_DONG_CODE                      = 0x8000C107; // 잘못된 지역_읍면동(리)코드 입니다.
const E_IBX_J10001_BUBN_CODE_NOTENTER                     = 0x8000C108; // 지번항목 미입력입니다.
const E_IBX_J10001_INVALID_BUBN_CODE                      = 0x8000C109; // 잘못된 지번항목입니다.

const E_IBX_J10001_TRADE_TYPE_NOTENTER                    = 0x8000C110; // 매매구분 미입력 오류입니다.
const E_IBX_J10001_INVALID_TRADE_TYPE                     = 0x8000C111; // 잘못된 매매구분 입니다.

const E_IBX_J10001_BUILD_DONG_NOTENTER                    = 0x8000C120; // 동 미입력
const E_IBX_J10001_INVALID_BUILD_DONG                     = 0x8000C121; // 잘못된 동 입력

const E_IBX_J10001_BUILD_HO_NOTENTER                      = 0x8000C130; // 호 미입력
const E_IBX_J10001_INVALID_BUILD_HO                       = 0x8000C131; // 잘못된 호 입력


/////////////////////////////////////////////////////////////////////////////////
//                            일사편리 부동산정보시스템                          //
/////////////////////////////////////////////////////////////////////////////////
const E_IBX_P10001_STREET_NAME_INVALID    = 0x8000C132; // 잘못된 도로명 정보 입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_STREET_NO_INVALID      = 0x8000C133; // 잘못된 도로명 건물번호 정보 입니다. 확인 후 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                                 대국민서비스                                //
/////////////////////////////////////////////////////////////////////////////////
// 사건/경매검색
const E_IBX_PUBLIC_COURT_NOENTER                          = 0x8000C201; // 법원명 미입력
const E_IBX_PUBLIC_INVALID_COURT                          = 0x8000C202; // 잘못된 법원명

const E_IBX_PUBLIC_CASE_YEAR_NOENTER                      = 0x8000C211; // 사건년도 미입력
const E_IBX_PUBLIC_INVALID_CASE_YEAR                      = 0x8000C212; // 잘못된 사건년도

const E_IBX_PUBLIC_CASE_TYPE_NOENTER                      = 0x8000C221; // 사건구분 미입력
const E_IBX_PUBLIC_INVALID_CASE_TYPE                      = 0x8000C222; // 잘못된 사건구분

const E_IBX_PUBLIC_CASE_NO_NOENTER                        = 0x8000C231; // 사건번호 미입력
const E_IBX_PUBLIC_INVALID_CASE_NO                        = 0x8000C232; // 잘못된 사건번호
const E_IBX_PUBLIC_INVALID_CASE_WEEK                      = 0x8000C233; // 2주가 경과된 사건에 한하여 정보가 제공 됩니다.

const E_IBX_PUBLIC_PARTIES_NAME_NOENTER                   = 0x8000C241; // 당사자(채권자명) 미입력
const E_IBX_PUBLIC_INVALID_PARTIES_NAME                   = 0x8000C242; // 잘못된 당사자(채권자명)

// 회생/파산
const E_IBX_PUBLIC_TASK_TYPE_NOTENTER                    = 0x8000C251;	// 업무구분을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_PUBLIC_TASK_TYPE_INVALID   	                = 0x8000C252;	// 업무구분이 잘못되었습니다. 확인 후 거래하시기 바랍니다.

// 나의 동산집행정보
const E_IBX_P2010X_BANK_NAME_NOTENTER                     = 0x8000C271; // 은행 이름 미입력
const E_IBX_P2010X_BANK_NAME_INVALID                      = 0x8000C272; // 잘못된 은행 이름
/////////////////////////////////////////////////////////////////////////////////
//                              국토교통부(KISCON)                             //
/////////////////////////////////////////////////////////////////////////////////
// P2000X 건설업체정보
const E_IBX_P2000X_SEARCH_TYPE_NOTENTER	                  = 0x8000C301;	// 조회구분 미입력
const E_IBX_P2000X_SEARCH_TYPE_INVALID                    = 0x8000C302;	// 잘못된 조회구분

const E_IBX_P2000X_AREA_NOTENTER                          = 0x8000C311;	// 지역_시도 미입력
const E_IBX_P2000X_AREA_INVALID                           = 0x8000C312;	// 잘못된 지역_시도

const E_IBX_P2000X_AREA_DETAIL_NOTENTER	                  = 0x8000C321;	// 지역_시군구 미입력
const E_IBX_P2000X_AREA_DETAIL_INVALID                    = 0x8000C322;	// 잘못된 지역_시군구

const E_IBX_P2000X_COMPANY_CODE_NOTENTER                  = 0x8000C331;	// 업체코드 미입력
const E_IBX_P2000X_COMPANY_CODE_INVALID                   = 0x8000C332;	// 잘못된 업체코드

const E_IBX_P2000X_DATE_YEAR_NOTENTER                     = 0x8000C341;	// 조회년도 미입력
const E_IBX_P2000X_DATE_YEAR_INVALID                      = 0x8000C342;	// 잘못된 조회년도

const E_IBX_P2000X_GONGSA_KIND_NOTENTER	                  = 0x8000C351;	// 공사종류_주공종 미입력
const E_IBX_P2000X_GONGSA_KIND_INVALID	                  = 0x8000C352;	// 잘못된 공사종류_주공종

const E_IBX_P2000X_GONGSA_DEKIND_NOTENTER                 = 0x8000C361;	// 공사종류_세부공종 미입력
const E_IBX_P2000X_GONGSA_DEKIND_INVALID                  = 0x8000C362;	// 잘못된 공사종류_세부공종

const E_IBX_P2000X_COMPANY_NAME_NOTENTER                  = 0x8000C371;	// 상호 미입력
const E_IBX_P2000X_COMPANY_NAME_INVALID	                  = 0x8000C372;	// 잘못된 상호
const E_IBX_P2000X_COMPANY_RESIDENT_NAME_INVALID          = 0x8000C373;	// 잘못된 상호 또는 사업자명

const E_IBX_P2000X_RESIDENT_NAME_NOTENTER                 = 0x8000C381;	// 사업자명 미입력
const E_IBX_P2000X_RESIDENT_NAME_INVALID   	              = 0x8000C382;	// 잘못된 사업자명


/////////////////////////////////////////////////////////////////////////////////
//                              특허청                                         //
/////////////////////////////////////////////////////////////////////////////////
// P1100X 특허로 출원인/대리인 코드조회
const E_IBX_P1100X_NAME_NOTENTER                    = 0x8000C390;	// 성명을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P1100X_NAME_INVALID   	                = 0x8000C391;	// 성명이 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P1100X_ENG_NAME_NOTENTER                = 0x8000C392;	// 영문 성명을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P1100X_ENG_NAME_INVALID   	            = 0x8000C393;	// 영문 성명이 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P1100X_SEARCH_DATE_NOTENTER             = 0x8000C394;	// 조회정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_NAME_NOTREGISTERED                      = 0x8000C395;	// 등록하지 않은 이름입니다. 확인 후 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                           인터넷 등기소                                       //
/////////////////////////////////////////////////////////////////////////////////
// P10001 부동산 등기부등본 조회
const E_IBX_P10001_REAL_ESTATE_GUBUN_NOTENTER     = 0x8000C400;	// 부동산 구분값을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REAL_ESTATE_GUBUN_INVALID      = 0x8000C401;	// 부동산 구분값이 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REGION_1_NOTENTER              = 0x8000C402;	// 시/도 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REGION_2_NOTENTER              = 0x8000C403;	// 리/동 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REGION_3_NOTENTER              = 0x8000C404;	// 지번 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_BUILDING_NAME_NOTENTER         = 0x8000C405;	// 건물명칭 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_BUILDING_NO_NOTENTER           = 0x8000C406;	// 동, 호 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_STREET_REGION_NOTENTER         = 0x8000C407;	// 시/군/구 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_STREET_NAME_NOTENTER           = 0x8000C408;	// 도로명 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_STREET_NO_NOTENTER             = 0x8000C409;	// 도로명 건물번호 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REAL_ESTATE_NO_NOTENTER        = 0x8000C410;	// 부동산 고유번호 정보를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_SEARCH_INFO_CHECK              = 0x8000C411;	// 지번, 건물명칭중 한가지 값만 입력되어야 합니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REGISTER_OFFICE_NO_NOTENTER    = 0x8000C412;	// 등기소를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_CORPORATE_GUBUN_NOTENTER       = 0x8000C413;	// 법인구분을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_COMPANY_NAME_NOTENTER          = 0x8000C414;	// 상호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_COMPANY_NAME_INVALID           = 0x8000C415;	// 상호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REGISTER_NO_NOTENTER           = 0x8000C416;	// 등기번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REGISTER_NO_INVALID            = 0x8000C417;	// 등기번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_RECORD_NO_NOTENTER             = 0x8000C418;	// 등록번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_RECORD_NO_INVALID              = 0x8000C419;	// 등록번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_ADDRESS_INVALID                = 0x8000C423;	// 잘못된 주소입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_REAL_ESTATE_INVALID            = 0x8000C424;	// 잘못된 부동산 고유번호입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P10001_ADDRESS_CHECK                  = 0x8000C429;	// 검색결과가 많아 소재지번 확인이 어려울 수 있습니다. 주소정보 추가 입력 후 거래하시기 바랍니다.

// P22011 법인등기부등본 열람
const E_IBX_P12011_PREPAID_NO_NOTENTER            = 0x8000C430;  // 선불전자지급수단 번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_NO_INVALID             = 0x8000C431;  // 잘못된 선불전자지급수단 번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_PASSWORD_NOTENTER      = 0x8000C433;  // 선불전자지급수단 비밀번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_PASSWORD_INVALID       = 0x8000C434;  // 잘못된 선불전자지급수단 비밀번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_AMOUNT_NOTENTER        = 0x8000C436;  // 선불전자지급수단 금액 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_AMOUNT_INVALID         = 0x8000C437;  // 잘못된 선불전자지급수단 금액입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_AMOUNT_DENIED          = 0x8000C438;  // 선불전자지급수단 잔액이 부족 합니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_AMOUNT_DUPLICATE       = 0x8000C439;  // 선불전자지급수단 중복 결제 건입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPAID_AMOUNT_MISC            = 0x8000C440;  // 선불전자지급수단 금액 기타 오류입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_TYPE_NOTENTER                  = 0x8000C441;  // 등기기록 유형 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_TYPE_INVALID                   = 0x8000C442;  // 잘못된 등기기록 유형입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_TYPE_DENIED                    = 0x8000C443;  // 조회 불가능한 등기기록 유형입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_HOLDER_NOTENTER                = 0x8000C444;  // 명의인명 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_HOLDER_INVALID                 = 0x8000C445;  // 잘못된 명의인명입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22011_REGISTER_ERASE_NOTENTER        = 0x8000C446;  // 주말여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22011_RECORD_GUBUN_NOTENTER          = 0x8000C447;  // 등기기록구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22011_RECORD_GUBUN_INVALID           = 0x8000C448;  // 잘못된 등기기록구분입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22011_RESISTER_NO_VIEW_NOTENTER      = 0x8000C449;  // 등록번호공개여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22011_RESISTER_NO_VIEW_INVALID       = 0x8000C450;  // 잘못된 등록번호공개여부입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_SUMMARY_DENIED                 = 0x8000C451;	// 요약사용이 불가능한 등기기록 유형입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_NOT_EXIST_PROPRIETOR           = 0x8000C452;	// 유효한 명의인이 존재하지 않습니다. 등기유형을 변경하여 조회하시기 바랍니다.
const E_IBX_P12011_READ_TYPE_INVALID              = 0x8000C453;	// 잘못된 열람구분입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22031_OPENTYPE_NOTENTER              = 0x8000C454;	// 공개방식선택 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P22031_OPENTYPE_INVALID               = 0x8000C455;	// 잘못된 공개방식선택입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12002_SEARCH_LIMITED                 = 0x8000C456;	// 연속으로 검색 가능한 횟수 초과로 검색이 제한된 상태입니다. 해당 기관 홈페이지에 접속하셔서 확인 후 거래해 주십시오.
const E_IBX_P12011_DENIED_REAL_ESTATE             = 0x8000C457;	// 제한된 부동산 고유번호입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_P12011_PREPROCESSING_NOW              = 0x8000C458;	// 현재 인터넷에서 처리중인 전자민원캐시입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_SELECTED_DATE_NO_TENANT               = 0x8000C470;	// 선택하신 확정일자에 입력하신 임차인 정보가 없습니다. 확인 후 다시 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                           보험개발원(카히스토리)                            //
/////////////////////////////////////////////////////////////////////////////////
// P13001  사고이력조회
const E_IBX_P13001_CAR_NUM_NOTENTER       = 0x8000C420;	// 차량번호를 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P13001_CAR_NUM_INVALID        = 0x8000C421;	// 차량번호가 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P13001_POINT_DENIED           = 0x8000C422; // 포인트가 부족합니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P13001_SELF_PAYMENT_UNUSED    = 0x8000C425; // 포인트 자동결제 미사용 중 이십니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P13001_CAFE_NOTREGISTERED     = 0x8000C426; // 가입된 동호회가 없습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P13001_CAFE_NAME_NOTENTER     = 0x8000C427;	// 동호회명을 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P13001_CAFE_NAME_INVALID      = 0x8000C428; // 잘못된 동호회명입니다. 확인 후 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                           자동차 민원( ecar)                                //
/////////////////////////////////////////////////////////////////////////////////
const E_IBX_P14101_WORKTYPE_NOENTER       = 0x8000C500; // 신청구분 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_WORKTYPE_INVALID       = 0x8000C501;	// 신청구분  잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_REGNO_NOENTER          = 0x8000C502; // 신청자 주민번호 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_REGNAME_NOENTER        = 0x8000C503; // 신청자 성명 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_OWNER_NOENTER          = 0x8000C504;	// 소유주 이름 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P14101_CAR_NOT_FOUND          = 0x8000C505;	// 입력하신 정보와 일치하는 차량이 없습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_LOCATION_DISCORD       = 0x8000C506;	// 자동차 사용본거지가 일치하지 않습니다. 도로명주소일 경우 법정동까지 일치하는지 확인하여야 합니다.
const E_IBX_P14101_OWNER_NO_DISCORD       = 0x8000C507; // 소유자 주민(법인/사업자)등록번호가 일치하지 않습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_OWNER_NAME_DISCORD     = 0x8000C508;	// 소유자 성명(명칭)이 일치하지 않습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_REG_FAIL               = 0x8000C509;	// 서명문 검증실패로 민원 신청에 실패했습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_REG_MISC               = 0x8000C50A;	// 민원 신청에 실패했습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14101_OWNER_VERIFY_MISC      = 0x8000C50B; // 소유자 검증에 실패 했습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14201_CAR_NUM_CHANGE         = 0x8000C50C; // 번호변경 차량으로 소유자정보가 맞지 않습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14201_SHORT_INTERVAL         = 0x8000C50D; // 요청 간격이 너무 짧습니다.\n\n잠시 후 다시 신청 해 주시기 바랍니다.

const E_IBX_P14201_ADDR_TYPE_NOENTER      = 0x8000C510; // 소유자 주소구분(행정동/도로명 주소) 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14201_ADDR_TYPE_INVALID      = 0x8000C511; // 소유자 주소구분 잘못되었습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14201_ADDR_NOENTER           = 0x8000C512; // 소유자 주소 입력하지 않으셨습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P14201_ADDR_NOTPRESENT        = 0x8000C513; // 소유자 주소 조회되지 않습니다. 확인 후 거래하시기 바랍니다.
const E_IBX_P14201_ADDR_INVALID           = 0x8000C514; // 소유자 주소 상이하여 소유자 검증에 실패 했습니다. 확인 후 거래하시기 바랍니다.

const E_IBX_P14X01_RESULT_VERIFY_FAIL     = 0x8000C520; // 결과검증 실패(접수번호 누락) 했습니다. 확인 후 재조회 하시기 바랍니다.
const E_IBX_P14X01_CAR_NUM_DISCORD        = 0x8000C521; // 결과검증 실패(차량번호 상이) 했습니다. 확인 후 재조회 하시기 바랍니다.

const E_IBX_P14X01_FILE_NOT_EXISTS        = 0x8000C522; // 출력물 저장에 실패했습니다. 확인 후 재조회 하시기 바랍니다.
const E_IBX_P14X01_FILE_YN_INVALID        = 0x8000C523; // 출력물 저장여부 구분 잘못 선택했습니다. 확인 후 거래 하시기 바랍니다.

const E_IBX_P14X01_WORKTYPE_DISCORD       = 0x8000C525; // 저당 내역이 없어 자동차등록원부(을부)를 발급할 수 없는 차량입니다.

const E_IBX_P14X01_FILE_ACCESS_ERROR      = 0x8000C526; // 출력물 파일이 정상적이지 않습니다. 확인 후 재조회 하시기 바랍니다.

const E_IBX_P14001_PAGE_IDX_INVALID       = 0x8000C531; // 잘못된 페이지번호 입니다.

/////////////////////////////////////////////////////////////////////////////////
//                           자동차car365                                      //
/////////////////////////////////////////////////////////////////////////////////
const E_IBX_CAR_NOT_FOUND          = 0x8000C536;	// 조회하신 차량은 매매상품용으로 확인 되지 않은 차량입니다.

////////////////////////////////////////////////////////////////////////////////
//                       실시간통합연구비관리시스템(RCMS)                     //
////////////////////////////////////////////////////////////////////////////////
const E_IBX_P101XX_PROJECT_SEQNO_NOENTER  = 0x8000C540; // 과제일련번호 미입력입니다.
const E_IBX_P101XX_PROJECT_SEQNO_INVALID  = 0x8000C541; // 잘못된 과제일련번호입니다.

/////////////////////////////////////////////////////////////////////////////////
//                          기타 조회서비스                                    //
/////////////////////////////////////////////////////////////////////////////////

//신용평가정보 조회서비스
const E_IBX_W0120X_SACRAP_INFO_NOTENTER     = 0x8000C601; // 조회구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W0120X_SCRAP_INFO_INVALID       = 0x8000C602; // 잘못된 조회구분입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_W0120X_SEARCH_TYPE_NOTENTER	  = 0x8000C603;	// 종류 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W0120X_SEARCH_TYPE_INVALID      = 0x8000C604;	// 잘못된 종류입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_W0120X_SEARCH_RANGE_NOTENTER	  = 0x8000C605;	// 조회범위 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W0120X_SEARCH_RANGE_INVALID     = 0x8000C606;	// 잘못된 조회범위입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_W0120X_ISSUE_COMPANY_NOTENTER	  = 0x8000C607;	// 발행회사 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W0120X_ISSUE_COMPANY_INVALID    = 0x8000C608;	// 잘못된 발행회사입니다. 확인 후 다시 거래하시기 바랍니다.

//기업정보 조회서비스
const E_IBX_W01101_CORPORATE_CODE_NOTENTER  = 0x8000C614;	// 기업코드 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W01101_CORPORATE_CODE_INVALID	  = 0x8000C615;	// 잘못된 기업코드입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_W01101_SEARCH_VALUE_NOTENTER    = 0x8000C616;	// 조회값 미입력입니다. 확인 후 다시 거래하시기 바랍니다.

//방송 프로그램정보  조회서비스
const E_IBX_W11001_PROGRAM_NAME_NOTENTER    = 0x8000C621;	// 방송 프로그램명 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W11001_CHANNEL_NAME_NOTENTER    = 0x8000C622; // 방송 채널명 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W11001_PROGRAM_INFO_INVALID	  = 0x8000C623;	// 방송 프로그램명 또는 방송 채널명이 잘못 입력되었습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W11001_REQ_TYPE_NOTENTER 	      = 0x8000C624;	// 요청 구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_W11001_REQ_TYPE_INVALID		  = 0x8000C625; // 잘못된 요청 구분 입력입니다. 확인 후 다시 거래하시기 바랍니다.

// 전자소송
const E_IBX_KEY_P30101_SA_NM_NOTENTER          = 0x8000D200;  // 사건명 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SA_NM_INVALID           = 0x8000D201;  // 잘못된 사건명입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CHUNG_GBN_NOTENTER      = 0x8000D210;  // 청구구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CHUNG_GBN_INVALID       = 0x8000D211;  // 잘못된 청구구분입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_JAESAN_GBN_NOTENTER     = 0x8000D020;  // 소가구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_JAESAN_GBN_INVALID      = 0x8000D021;  // 잘못된 소가구분입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SOGA_AMT_NOTENTER       = 0x8000D030;  // 소가 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SOGA_AMT_INVALID        = 0x8000D031;  // 잘못된 소가입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_BUB_CD_NOTENTER         = 0x8000D040;  // 법원 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_BUB_CD_INVALID          = 0x8000D041;  // 잘못된 법원입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_PAY_METHOD_NOTENTER     = 0x8000D050;  // 납부방식 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_PAY_METHOD_INVALID      = 0x8000D051;  // 잘못된 납부방식입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_RETURN_BANK_NOTENTER    = 0x8000D060;  // 환급계좌 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_RETURN_BANK_INVALID     = 0x8000D061;  // 잘못된 환급계좌입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_RETURN_ACCT_NOTENTER    = 0x8000D070;  // 환급계좌미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_RETURN_ACCT_INVALID     = 0x8000D071;  // 잘못된 환급계좌입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_RETURN_HOLDER_NOTENTER  = 0x8000D080;  // 환급계좌 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_RETURN_HOLDER_INVALID   = 0x8000D081;  // 잘못된 환급계좌입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_BANK_NOTENTER           = 0x8000D090;  // 환급계좌 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_BANK_INVALID            = 0x8000D091;  // 잘못된 환급계좌입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_MEAN_NOTENTER           = 0x8000D100;  // 청구취지 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_MEAN_INVALID            = 0x8000D101;  // 잘못된 청구취지입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CAUSE_NOTENTER          = 0x8000D110;  // 청구원인 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CAUSE_INVALID           = 0x8000D111;  // 잘못된 청구원인입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_KEY_P30101_ING_GUBN_NOTENTER       = 0x8000D120;  // 피고인 인격구분 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_DS_NM_NOTENTER          = 0x8000D130;  // 피고인 이름     미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ZIP_NOTENTER            = 0x8000D140;  // 피고인 우편번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ADDR_NOTENTER           = 0x8000D150;  // 피고인 주소     미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_NATION_NOTENTER         = 0x8000D170;  // 피고인  국적    미입력입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_KEY_P30101_SEOJ_FILE_NOTENTER      = 0x8000D180;  // 입증파일 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SEOJ_FILE_INVALID       = 0x8000D181;  // 잘못된 소명파일 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SEOJ_FILE_NOTEXIST      = 0x8000D182;  // 소명파일이 없거나 0Byte 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SEOJ_FILE_DISKOVER      = 0x8000D183;  // 소명파일 용량초과입니다. 작성중 서류에 등록된 문서를 제출 및 삭재해 주시기 바랍니다.
const E_IBX_KEY_P30101_ADD_FILE_NOTENTER       = 0x8000D190;  // 첨부파일 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ADD_FILE_INVALID        = 0x8000D191;  // 잘못된 첨부파일 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ADD_FILE_NOTEXIST       = 0x8000D192;  // 첨부파일 없거나 0Byte 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ADD_FILE_DISKOVER       = 0x8000D193;  // 첨부파일 용량초과입니다. 작성중 서류에 등록된 문서를 제출 및 삭재해 주시기 바랍니다.

const E_IBX_KEY_P30101_CARD_COMP_NOTENTER      = 0x8000D220;  // 카드사 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CARD_COMP_INVALID       = 0x8000D221;  // 잘못된 카드사 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CARD_PW_NOTENTER        = 0x8000D222;  // 카드 비밀번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CARD_PW_INVALID         = 0x8000D223;  // 잘못된 카드 비밀번호 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ATTCH_NAME_NOTENTER     = 0x8000D224;  // 첨부 서류명 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ATTCH_NAME_INVALID      = 0x8000D225;  // 잘못된 첨부 서류명 입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_KEY_P30101_CHUNG_AMT_NOTENTER      = 0x8000D300;  // 청구금액 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CHUNG_AMT_INVALID       = 0x8000D301;  // 잘못된 청구금액  입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CHUNG_CD_NOTENTER       = 0x8000D310;  // 청구금액 단위코드 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_CHUNG_CD_INVALID        = 0x8000D311;  // 잘못된 청구금액 단위코드 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_WON_COST_NOTENTER       = 0x8000D320;  // 원화환산금액 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_WON_COST_INVALID        = 0x8000D321;  // 잘못된 원화환산금액 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_P_SAVER_NOTENTER        = 0x8000D330;  // 피보전권리 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_P_SAVER_INVALID         = 0x8000D331;  // 잘못된 피보전권리 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_P_SAVERCD_NOTENTER      = 0x8000D340;  // 피보전권리유형 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_P_SAVERCD_INVALID       = 0x8000D341;  // 잘못된 피보전권리유형 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SUBMIT_CD_NOTENTER      = 0x8000D350;  // 제출방식 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SUBMIT_CD_INVALID       = 0x8000D351;  // 잘못된 제출방식 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_SERIALNO_NOTENTER       = 0x8000D360;  // 등기고유번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ISSUE_NO_NOTENTER       = 0x8000D370;  // 발급확인번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_MOK_ADDR_NOTENTER       = 0x8000D380;  // 지분또는소유권이외의권리 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_ESTATE_GB_NOTENTER      = 0x8000D390;  // 부동산 종류 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_REP_ADDR_NOTENTER       = 0x8000D400;  // 대표소재지 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_JIMOK_NOTENTER          = 0x8000D410;  // 지목내역 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_STATE_CD_NOTENTER       = 0x8000D420;  // 시도코드 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_STATE_CD_INVALID        = 0x8000D421;  // 잘못된 시도코드 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_LICENSE_TAX_NOTENTER    = 0x8000D430;  // 등록면허세 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_LICENSE_TAX_INVALID     = 0x8000D431;  // 잘못된 등록면허세 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_EDU_TAX_NOTENTER        = 0x8000D440;  // 교육세 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_EDU_TAX_INVALID         = 0x8000D441;  // 잘못된 교육세 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_PAY_NO_NOTENTER         = 0x8000D450;  // 납부번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_KEY_P30101_PAY_NO_INVALID          = 0x8000D451;  // 잘못된 납부번호 입니다. 확인 후 다시 거래하시기 바랍니다.


const E_IBX_P30101_FILE_VERIFY_INVALID                = 0x8000D501;  // 파일 전자서명에 실패했습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INSURANCE_NOT_JOIN                        = 0x8000D502;  // 가입한 보험이 없는 보험사입니다. 확인 후 등록하시기 바랍니다.
const E_IBX_INSURANCE_REGISTERED_CERT                 = 0x8000D503;  // 이미 등록된 인증서입니다.
const E_IBX_INSURANCE_JOIN_FIRST                      = 0x8000D504;  // 보험사 회원가입이나 인증서 등록 후 사용하시기 바랍니다.
const E_IBX_INSURANCE_EMAIL_DUP                       = 0x8000D505;  // 중복된 이메일 정보입니다.
const E_IBX_INSURANCE_ID_DUP                          = 0x8000D506;  // 중복된 아이디 정보입니다.

const E_IBX_CAR_INS_DATE_BEGIN_NOTENTER               = 0x8000D820;  //보험기간시작일 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_DATE_BEGIN_INVALID                = 0x8000D821;  //잘못된 보험기간시작일입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_DATE_END_NOTENTER                 = 0x8000D822;  //보험기간종료일 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_DATE_END_INVALID                  = 0x8000D823;  //잘못된 보험기간종료일입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_OWNER_DOB_NOTENTER                = 0x8000D824;  //생년월일 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_OWNER_DOB_INVALID                 = 0x8000D825;  //잘못된 생년월일입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_REAL_CLAIM_NOTENTER               = 0x8000D826;  //대물배상 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_REAL_CLAIM_INVALID                = 0x8000D827;  //잘못된 대물배상 생년월일입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_UNINS_ACCIDENT_NOTENTER           = 0x8000D828;  //무보험차상해 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_UNINS_ACCIDENT_INVALID            = 0x8000D829;  //잘못된 무보험차상해입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_PHYSICAL_EXTRA_CHARGE_NOTENTER            = 0x8000D830;  //물적사고 할증기준금액 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_PHYSICAL_EXTRA_CHARGE_INVALID             = 0x8000D831;  //잘못된 물적사고 할증기준금액입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EMERGENCY_RESCUE_SERVICE_NOTENTER         = 0x8000D832;  //긴급출동서비스 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_EMERGENCY_RESCUE_SERVICE_INVALID          = 0x8000D833;  //잘못된 긴급출동서비스입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWN_CAR_DAMAGE_NOTENTER                   = 0x8000D834;  //자가차량손해 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWN_CAR_DAMAGE_INVALID                    = 0x8000D835;  //잘못된 자가차량손해입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_ANNUAL_MILEAGE_NOTENTER                   = 0x8000D836;  //연간주행거리 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_ANNUAL_MILEAGE_INVALID                    = 0x8000D837;  //잘못된 연간주행거리입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWN_PHYSICAL_ACCIDENT1_NOTENTER           = 0x8000D838;  //자기신체손해1 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWN_PHYSICAL_ACCIDENT1_INVALID            = 0x8000D839;  //잘못된 자기신체손해1 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWN_PHYSICAL_ACCIDENT2_NOTENTER           = 0x8000D840;  //자기신체손해2 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWN_PHYSICAL_ACCIDENT2_INVALID            = 0x8000D841;  //잘못된 자기신체손해2 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWNER_CAR_INFO_NOTENTER                   = 0x8000D842;  //차량정보 (차량코드 또는 차량종류 또는 등록년도) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_OWNER_CAR_INFO_INVALID                    = 0x8000D843;  //잘못된 차량정보 (차량코드 또는 차량종류 또는 등록년도)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_BLACK_BOX_INFO_NOTENTER               = 0x8000D844;  //블랙박스정보 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_BLACK_BOX_INFO_INVALID                = 0x8000D845;  //잘못된 블랙박스정보 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_NAVIGATION_INFO_NOTENTER              = 0x8000D846;  //네비게이션정보 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_NAVIGATION_INFO_INVALID               = 0x8000D847;  //잘못된 네비게이션정보 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_SUN_ROOF_INFO_NOTENTER                = 0x8000D848;  //선루프정보 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_SUN_ROOF_INFO_INVALID                 = 0x8000D849;  //잘못된 선루프정보 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_HI_PASS_INFO_NOTENTER                 = 0x8000D850;  //하이패스정보 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_HI_PASS_INFO_INVALID                  = 0x8000D851;  //잘못된 하이패스정보 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_ALUMINUM_WHEEL_INFO_NOTENTER          = 0x8000D852;  //알루미늄휠정보 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_ALUMINUM_WHEEL_INFO_INVALID           = 0x8000D853;  //잘못된 알루미늄휠정보 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_BACK_CAMERA_INFO_NOTENTER             = 0x8000D854;  //후방카메라정보 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_BACK_CAMERA_INFO_INVALID              = 0x8000D855;  //잘못된 후방카메라정보 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_OTHER_ACCESSORIES_INFO_NOTENTER       = 0x8000D856;  //기타부속품 (장착년도 또는 구입가격) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_OTHER_ACCESSORIES_INFO_INVALID        = 0x8000D857;  //잘못된 기타부속품 (장착년도 또는 구입가격)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DRIVER_STATE_RESTRICT_NOTENTER            = 0x8000D858;  //운전자한정 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DRIVER_STATE_RESTRICT_INVALID             = 0x8000D859;  //잘못된 운전자한정입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DESIGNATED_DRIVER_INFO_NOTENTER           = 0x8000D860;  //지정운전자장보 (이름 또는 생년월일 또는 성별) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DESIGNATED_DRIVER_INFO_INVALID            = 0x8000D861;  //잘못된 지정운전자장보 (이름 또는 생년월일 또는 성별)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_SPOUSE_INFO_NOTENTER                      = 0x8000D862;  //배우자정보 (이름 또는 생년월일) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_SPOUSE_INFO_INVALID                       = 0x8000D863;  //잘못된 배우자정보 (이름 또는 생년월일)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_YOUNGEST_DRIVER_INFO_NOTENTER             = 0x8000D864;  //최소연령운전자정보 (이름 또는 생년월일 또는 성별) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_YOUNGEST_DRIVER_INFO_INVALID              = 0x8000D865;  //잘못된 최소연령운전자정보 (이름 또는 생년월일 또는 성별)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CHILDREN_INFO_NOTENTER                    = 0x8000D866;  //자녀정보 (이름 또는 생년월일) 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CHILDREN_INFO_INVALID                     = 0x8000D867;  //잘못된 자녀정보 (이름 또는 생년월일)입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_STOCK_INSURED_RECIEPT_BY_MAIL_YN_NOTENTER = 0x8000D868;  //증권이메일수령특약가입여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_STOCK_INSURED_RECIEPT_BY_MAIL_YN_INVALID  = 0x8000D869;  //잘못된 증권이메일수령특약가입여부입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_MILEAGE_INSUREDS_YN_NOTENTER              = 0x8000D870;  //마일리지특약가입여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_MILEAGE_INSUREDS_YN_INVALID               = 0x8000D871;  //잘못된 마일리지특약가입여부입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_BLACK_BOX_INSUREDS_YN_NOTENTER            = 0x8000D872;  //블랙박스특약가입여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_BLACK_BOX_INSUREDS_YN_INVALID             = 0x8000D873;  //잘못된 블랙박스특약가입여부입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_ACCESSORY_FITMENT_YN_NOTENTER             = 0x8000D874;  //부속품장착여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_ACCESSORY_FITMENT_YN_INVALID              = 0x8000D875;  //잘못된 부속품장착여부입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CHILDREN_INSUREDS_YN_NOTENTER             = 0x8000D876;  //자녀특약가입여부 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CHILDREN_INSUREDS_YN_INVALID              = 0x8000D877;  //잘못된 자녀특약가입여부입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_DRIVER_STATE_RESTRICT_DENIED      		  = 0x8000D878;  //요청하신 차량에 운전자한정 옵션은 조회 할 수 없습니다. 운전자한정 옵션을 확인하시기 바랍니다.
const E_IBX_EMERGENCY_RESCUE_SERVICE_DENIED    		  = 0x8000D879;  //요청하신 차량은 긴급출동서비스 가입 불가합니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_REAL_CLAIM_DENIED 				  = 0x8000D880;  //요청하신 차량에 대물배상 옵션은 가입 불가합니다. 다른 대물배상 옵션을 선택 하시기 바랍니다.
const E_IBX_OWN_PHYSICAL_ACCIDENT2_DENIED 			  = 0x8000D881;  //요청하신 차량에 자기신체손해2 옵션은 가입 불가합니다. 다른 자기신체손해2 옵션을 선택 하시기 바랍니다.
const E_IBX_OWN_CAR_DAMAGE_DENIED	                  = 0x8000D882;  //요청하신 차량은 자가차량손해 가입 불가합니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CAR_INS_UNINS_ACCIDENT_DENIED             = 0x8000D883;  //요청하신 차량은 무보험차상해 가입 불가합니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INQUIRY_CAR_INFO_DENIED			          = 0x8000D884;  //보험료 조회가 불가능한 차량입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_INQUIRY_REQ_INFO_DENIED			          = 0x8000D885;  //요청하신 조건은 보험료 조회 불가 합니다. 보험사 콜센터를 통해 조회 하시기 바랍니다.
const E_IBX_CELLPHONE_NOTENTER                        = 0x8000D886;  //휴대폰번호 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_SPECIAL_CONTRACT_DENIED                   = 0x8000D887;  //요청하신 차량은 특약 가입이 불가합니다. 확인 후 다시 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                   대법원 가적관계등록부									   //
/////////////////////////////////////////////////////////////////////////////////
const E_IBX_COURT_ADD_INFO_GUBUN_NOTENTER  		  = 0x8000D800;  // 추가정보구분 미입력
const E_IBX_COURT_ADD_INFO_GUBUN_INVALID          = 0x8000D801;  // 잘못된 추가정보구분
const E_IBX_COURT_ADD_INFO_NOTENTER               = 0x8000D802;  // 추가정보 미입력
const E_IBX_COURT_ADD_INFO_INVALID         		  = 0x8000D803;  // 잘못된 추가정보
const E_IBX_COURT_ISSUER_TYPE_NOTENTER            = 0x8000D804;  // 발급대상자 미입력
const E_IBX_COURT_ISSUER_TYPE_INVALID             = 0x8000D805;  // 잘못된 발급대상자
const E_IBX_COURT_ISSUER_NAME_NOTENTER            = 0x8000D806;  // 발급대상자_성명 미입력
const E_IBX_COURT_ISSUER_NAME_INVALID             = 0x8000D807;  // 잘못된 발급대상자_성명
const E_IBX_COURT_ISSUER_REGNO_NOTENTER           = 0x8000D808;  // 발급대상자_주민등록번호 미입력
const E_IBX_COURT_ISSUER_REGNO_INVALID            = 0x8000D809;  // 잘못된 발급대상자_주민등록번호
const E_IBX_COURT_CERTIFY_TYPE_NOTENTER           = 0x8000D810;  // 증명서종류 미입력
const E_IBX_COURT_CERTIFY_TYPE_INVALID            = 0x8000D811;  // 잘못된 증명서종류
const E_IBX_COURT_REGNO_VIEW_TYPE_NOTENTER        = 0x8000D812;  // 주민등록번호공개여부 미입력
const E_IBX_COURT_REGNO_VIEW_TYPE_INVALID         = 0x8000D813;  // 잘못된 주민등록번호공개여부
const E_IBX_COURT_ISSUE_REQ_FAIL		          = 0x8000D814;  // 신청정보가 상이하여 열람/발급 신청에 실패


/////////////////////////////////////////////////////////////////////////////////
//                                 sERP 가입                                   //
/////////////////////////////////////////////////////////////////////////////////
const E_IBX_A97XX1_TERMS_AGREE_NOTENTER           = 0x8000D601;  // 약관동의 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_TERMS_AGREE_INVALID            = 0x8000D602;  // 잘못된 약관동의 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_BUSINESS_CATEGORY_NOTENTER     = 0x8000D611;  // 업태 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_BUSINESS_CATEGORY_INVALID      = 0x8000D612;  // 잘못된 업태 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_BUSINESS_TYPE_NOTENTER         = 0x8000D621;  // 종목(업종) 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_BUSINESS_TYPE_INVALID          = 0x8000D622;  // 잘못된 종목(업종) 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_OWNER_NAME_NOTENTER            = 0x8000D631;  // 대표자명 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_OWNER_NAME_INVALID             = 0x8000D632;  // 잘못된 대표자명 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_CHARGE_NAME_NOTENTER           = 0x8000D641;  // 업무담당자 성명 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_CHARGE_NAME_INVALID            = 0x8000D642;  // 잘못된 업무담당자 성명 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_POST_CODE_NOTENTER             = 0x8000D651;  // 우편번호 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_POST_CODE_INVALID              = 0x8000D652;  // 잘못된 우편번호 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADDRESS_NOTENTER               = 0x8000D661;  // 주소 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADDRESS_INVALID                = 0x8000D662;  // 잘못된 주소 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_DETAIL_ADDRESS_NOTENTER        = 0x8000D663;  // 상세주소 미입력입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_A97XX1_DETAIL_ADDRESS_INVALID         = 0x8000D664;  // 잘못된 상세주소입니다. 확인 후 거래하시기 바랍니다.
const E_IBX_A97XX1_PAYMENT_TYPE_NOTENTER          = 0x8000D671;  // 결제구분 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_PAYMENT_TYPE_INVALID           = 0x8000D672;  // 잘못된 결제구분 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADVICE_STORE_TYPE_NOTENTER     = 0x8000D681;  // 권유영업점 조회구분 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADVICE_STORE_TYPE_INVALID      = 0x8000D682;  // 잘못된 권유영업점 조회구분 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADVICE_STORE_INFO_NOTENTER     = 0x8000D691;  // 권유영업점 정보 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADVICE_STORE_INFO_INVALID      = 0x8000D692;  // 잘못된 권유영업점 정보 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADVICE_PERSON_INFO_NOTENTER    = 0x8000D693;  // 권유직원 정보 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_ADVICE_PERSON_INFO_INVALID     = 0x8000D694;  // 잘못된 권유직원 정보 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_PRODUCT_NAME_NOTENTER          = 0x8000D701;  // 가입상품 정보 미입력 입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A97XX1_PRODUCT_NAME_INVALID           = 0x8000D702;  // 잘못된 가입상품 정보 입니다. 확인 후 다시 거래하시기 바랍니다.


/////////////////////////////////////////////////////////////////////////////////
//                                국민은행 부동산                              //
/////////////////////////////////////////////////////////////////////////////////
// 국민은행 부동산 시세정보조회
const E_IBX_A9700X_APARTMENT_INFO_NOTENTER        = 0x8000C140;  // 단지 정보를 입력하지 않으셨습니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_A9700X_APARTMENT_INFO_INVALID         = 0x8000C141;  // 잘못된 단지 정보를 입력하셨습니다. 확인 후 다시 거래하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                            글로벌 모듈		                               //
/////////////////////////////////////////////////////////////////////////////////

// 서비스 관련 오류(11~99)
const E_IBX_LOGIN_INFO_INVALID	                   	        = 0x80010011;	// 입력하신 로그인 정보 중 잘못 입력하신 항목이 있습니다. 확인해주십시오.
const E_IBX_SERVICE_HOLIDAYS_DENIED	               		    = 0x80010012;	// 휴일 거래 제한
const E_IBX_VIP_ACCESS_TIME_OUT	                   	        = 0x80010013;	// VIP Access를 이용한 작업시간이 초과하였습니다. 다시 거래하시기 바랍니다.
const E_IBX_CARD_USING_CHECK_NEED                           = 0x80010014;	// 카드 부정사용 방지를 위한 카드 사용확인이 필요합니다. 사이트에서 확인 후 다시 이용하시기 바랍니다.
const E_IBX_SYSTEM_MAINTENANCE                              = 0x80010015;	// 시스템 점검 중입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ADD_AUTH_NOT_SUPPORTED                          = 0x80010016;	// 해당 서비스에서 지원하지 않는 추가인증 방법을 이용하고 계십니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_LOGIN_TIME_LIMIT                                = 0x80010017;	// 연속된 로그인 오류로 인하여 현재 로그인 할 수 없습니다. 잠시후 다시 시도해 주세요.
const E_IBX_EMAIL_REGISTER_NEED                             = 0x80010018;	// 이메일 등록이 필요한 계정입니다. 해당 사이트에서 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_EMAIL_CHECK_NEED                                = 0x80010019;	// 사이트에 등록된 이메일 확인 절차가 필요합니다. 사이트에서 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_CHARGE_COUNTING_IN_PROGRESS                     = 0x80010020;	// 현재 청구금액 집계가 진행 중 입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_ACCOUNT_SETTINGS_NEED                           = 0x80010021;	// 계정 설정 또는 등록 정보 확인이 필요한 계정입니다. 해당 사이트에서 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_DETAILS_OF_REFLECTION                           = 0x80010022;	// 해당 기관에서 거래 내역 반영 처리 중입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TEMPORARY_ERROR                                 = 0x80010023;   // 해당 기관에서 일시적인 오류가 발생했습니다. 잠시 후 다시 이용하시기 바랍니다.
const E_IBX_LOGIN_INFO_DENIED                               = 0x80010024;   // 로그인 정보 오류 횟수 초과로 로그인할 수 없습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_DATA_NOT_SUPPORTED                              = 0x80010025;   // 해당 서비스에서 지원하지 않는 데이터가 존재합니다. 확인 후 다시 이용하시기 바랍니다. (상품 다른 JOB 호출용)
const E_IBX_ACCOUNT_NOT_SUPPORTED                           = 0x80010026;   // 해당 서비스에서 지원하지 않는 계정입니다. 확인 후 다시 이용하시기 바랍니다. (PC 이용 불가능 계정)
const E_IBX_APP_AUTH_TIMEOUT                                = 0x80010027;   // 앱 인증을 시간내에 실시하지 않아 타임아웃이 발생 하였습니다. 다시 거래하시기 바랍니다.
const E_IBX_CONTRACT_DETAILS_CHECK_NEED                     = 0x80010028;   // 계약내용의 확인이 필요한 계정입니다. 사이트에서 확인 후 다시 이용하시기 바랍니다.

// 쿠콘 서버 관련 오류 (ACB, TD, 한미은행)
const E_IBX_COOCON_SERVER_INVALID                           = 0x80012F30;   // 내부 서버 오류 입니다. 계속 발생 시 고객센터 문의 부탁 드립니다.

// 입/출력데이터 관련 오류
const E_IBX_AUTH_VERIFICATION_NEED                   		= 0x80010100;	// 질문답변인증(추가인증) 등록이 필요합니다. 해당 사이트에서 등록 후 다시 이용하시기 바랍니다.
const E_IBX_AUTH_VERIFICATIONN_NOTENTER              		= 0x80010101;	// 질문답변인증(추가인증)에 대한 답변을 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_AUTH_VERIFICATION_INVALID                		= 0x80010102;	// 질문답변인증(추가인증)에 대한 답변을 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_AUTH_VERIFICATION_DENIED                 		= 0x80010103;	// 질문답변인증(추가인증)이 제한되어 해당 서비스를 이용할 수 없습니다. 해당 사이트에 문의해주세요.
const E_IBX_AUTH_VERIFICATION_DENIED_2               		= 0x80010104;	// 질문답변인증(추가인증)에 의한 본인 확인의 실패 횟수가 규정 횟수를 초과화여 로그인할 수 없습니다.
const E_IBX_AUTH_VERIFICATION_MISC                   		= 0x80010105;	// 질문답변인증(추가인증) 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_AUTH_VERIFICATION_DENIED_SPECIAL_CHAR           = 0x80010106;	// 질문답변인증(추가인증)에 제한된 특수문자가 입력되었습니다. 확인 후 다시 이용하시기 바랍니다.


const E_IBX_ADDITIONAL_PASSWORD_LOGIN_NEED           		= 0x80010110;	// 추가비밀번호 인증이 필요합니다. 해당 사이트에서 인증 후 다시 이용하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_LOGIN_NOTENTER       		= 0x80010111;	// 추가비밀번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_LOGIN_INVALID        		= 0x80010112;	// 추가비밀번호를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_LOGIN_DENIED         		= 0x80010113;	// 추가비밀번호가 제한되어 해당 서비스를 이용할 수 없습니다. 해당 사이트에 문의해주세요.
const E_IBX_ADDITIONAL_PASSWORD_LOGIN_JUSTBEFOREDENY 		= 0x80010114;	// 추가비밀번호 오류입니다. 한번 더 틀리시면 비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_LOGIN_MISC           		= 0x80010115;	// 추가비밀번호 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.

// 조회용 비밀번호 (암증번호)
const E_IBX_ADDITIONAL_PASSWORD_NUMBER_NEED          		= 0x80010120;	// 조회용 비밀번호가 필요합니다. 해당 사이트에서 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_NUMBER_NOTENTER      		= 0x80010121;	// 조회용 비밀번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_NUMBER_INVALID       		= 0x80010122;	// 조회용 비밀번호를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_NUMBER_DENIED        		= 0x80010123;	// 조회용 비밀번호가 제한되어 해당 서비스를 이용할 수 없습니다. 해당사이트에 문의해주세요.
const E_IBX_ADDITIONAL_PASSWORD_NUMBER_JUSTBEFOREDENY		= 0x80010124;	// 조회용 비밀번호 오류입니다. 한번 더 틀리시면 비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_ADDITIONAL_PASSWORD_NUMBER_MISC          		= 0x80010125;	// 조회용 비밀번호 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.

// SAISON, UC에만 사용
const E_IBX_ONE_TIME_TOKEN_NOTENTER	               		    = 0x80010130;	// One Time Token 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_TOKEN_INVALID	               		    = 0x80010131;	// 잘못된 One Time Token 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_TOKEN_EXPIRED	               		    = 0x80010132;	// 만료된 One Time Token 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_TOKEN_MISC	                   	        = 0x80010133;	// One Time Token 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

// OTP
const E_IBX_ONE_TIME_PASSWORD_NOTENTER	           	        = 0x80010140;	// OTP 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_PASSWORD_INVALID	               		= 0x80010141;	// 잘못된 OTP 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_PASSWORD_DENIED	               		= 0x80010142;	// 제한된 OTP 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_PASSWORD_MISC	               		    = 0x80010143;	// OTP 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_PASSWORD_CANCEL	             		= 0x80010144;	// OTP 입력을 취소(중지)하였습니다. 확인하신 후 다시 이용하시기 바랍니다.

// OTP_CARD
const E_IBX_VARIABLE_PASSWORD_NOTENTER	           	        = 0x80010150;	// 보안카드번호 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_VARIABLE_PASSWORD_INVALID	               		= 0x80010151;	// 잘못된 보안카드번호 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_VARIABLE_PASSWORD_DENIED	               		= 0x80010152;	// 제한된 보안카드번호 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_VARIABLE_PASSWORD_MISC	               		    = 0x80010153;	// 보안카드번호 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

// CAPTCHA
const E_IBX_CAPTCHA_NOTENTER	           	                = 0x80010170;	// 이미지문자(CAPTCHA) 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_CAPTCHA_INVALID	               		            = 0x80010171;	// 잘못된 이미지문자(CAPTCHA) 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_CAPTCHA_DENIED	               		            = 0x80010172;	// 제한된 이미지문자(CAPTCHA) 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_CAPTCHA_MISC	               		            = 0x80010173;	// 이미지문자(CAPTCHA) 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_INST_CODE_NOTENTER                              = 0x80010200;   // 기관코드 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_INST_CODE_INVALID                               = 0x80010201;   // 잘못된 기관코드입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_INST_CODE_MISC                                  = 0x80010202;   // 기관코드 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

// 로그인 시 추가 입력되는 정보
const E_IBX_BIRTYDAY_LOGIN_NOTENTER                  		= 0x80010203;	// 생일을 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_BIRTYDAY_LOGIN_INVALID                          = 0x80010204;   // 잘못된 생일입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_PHONENUM_LOGIN_NOTENTER          		        = 0x80010205;	// 전화번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_PHONENUM_LOGIN_INVALID         		            = 0x80010206;	// 잘못된 전화번호입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_BIRTHDAy_PHONENUM_LOGIN_NOTENTER           		= 0x80010207;	// 생일 또는 전화번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_COUNTRY_CODE_NOTENTER                           = 0x80010208;   // 국가코드 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_COUNTRY_CODE_INVALID                            = 0x80010209;   // 잘못된 국가코드입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_COUNTRY_CODE_MISC                               = 0x8001020A;   // 국가코드 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

// 이체 관련 오류
const E_IBX_REMIT_FEE_METHOD_NOENTER                        = 0x80010210;   // 이체 수수료 납부방식을 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_REMIT_FEE_METHOD_INVALID                        = 0x80010211;   // 이체 수수료 납부방식을 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_REMIT_FEE_NOENTER                               = 0x80010212;   // 이체 수수료를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_REMIT_FEE_INVALID                               = 0x80010213;   // 이체 수수료를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_REMIT_BANK_CODE_NOENTER                         = 0x80010220;   // 입금은행 코드를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_REMIT_BANK_CODE_INVALID                         = 0x80010221;   // 입금은행 코드를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_REMIT_BRANCH_CODE_NOENTER                       = 0x80010222;   // 입금지점 코드를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_REMIT_BRANCH_CODE_INVALID                       = 0x80010223;   // 입금지점 코드를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_REMIT_INFO_NOT_EXIST 						    = 0x80010224;   // 입금에 필요한 정보 등록이 필요합니다. 해당 사이트에서 등록 후 다시 이용하시기 바랍니다.

const E_IBX_USE_SAVED_REMIT_INFO_NOENTER 					= 0x80010225;   // 등록된 입금정보 사용여부를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_USE_SAVED_REMIT_INFO_INVALID 					= 0x80010226;   // 등록된 입금정보 사용여부를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_TRANS_DATE_NOTENTER                             = 0x80010230;   // 이체실행일을 입력하지 않았습니다.확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANS_DATE_INVALID                              = 0x80010231;   // 이체실행일을 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANS_DATE_DENIED                               = 0x80010232;   // 서비스되지 않는 이체실행일을 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANS_DATE_MISC                                 = 0x80010233;   // 이체실행일 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_TRANS_PASSWORD_NOTENTER                         = 0x80010240;   // 이체 비밀번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANS_PASSWORD_INVALID                          = 0x80010241;   // 이체 비밀번호를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANS_PASSWORD_DENIED                           = 0x80010242;   // 이체 비밀번호가 제한되어 해당 서비스를 이용할 수 없습니다. 해당사이트에 문의해주세요.
const E_IBX_TRANS_PASSWORD_JUSTBEFOREDENY                   = 0x80010243;   // 이체 비밀번호 오류입니다. 한번 더 틀리시면 비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_TRANS_PASSWORD_MISC                             = 0x80010244;   // 이체 비밀번호 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_CONFIRM_PASSWORD_NOTENTER                       = 0x80010250;   // 확인 비밀번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_CONFIRM_PASSWORD_INVALID                        = 0x80010251;   // 확인 비밀번호를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_CONFIRM_PASSWORD_DENIED                         = 0x80010252;   // 확인 비밀번호가 제한되어 해당 서비스를 이용할 수 없습니다. 해당사이트에 문의해주세요.
const E_IBX_CONFIRM_PASSWORD_JUSTBEFOREDENY                 = 0x80010253;   // 확인 비밀번호 오류입니다. 한번 더 틀리시면 비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_CONFIRM_PASSWORD_MISC                           = 0x80010254;   // 확인 비밀번호 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_ACCOUNT_ADMIN_NO_NOTENTER                       = 0x80010260;   // 계좌관리번호 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ACCOUNT_ADMIN_NO_INVALID                        = 0x80010261;   // 잘못된 계좌관리번호 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ACCOUNT_ADMIN_NO_MISC                           = 0x80010262;   // 계좌관리번호 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_USING_YEAR_MONTH_NOTENTER                       = 0x80010270;  // 이용년월 미입력입니다. 확인 후 다시 거래하십시오.
const E_IBX_USING_YEAR_MONTH_INVALID                        = 0x80010271;  // 잘못된 이용년월입니다. 확인 후 다시 거래하십시오.
const E_IBX_USING_YEAR_MONTH_DENIED                         = 0x80010272;  // 해당 기관에서 서비스하는 조회 기간을 초과하였습니다. 이용년월을 확인 후 다시 거래하십시오.
const E_IBX_USING_YEAR_MONTH_MISC                           = 0x80010273;  // 이용년월 기타 오류입니다. 확인 후 다시 거래하십시오.

const E_IBX_PIN_NOTENTER                                    = 0x80010280;   // PIN을 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_PIN_INVALID                                     = 0x80010281;   // PIN을 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_PIN_DENIED                                      = 0x80010282;   // PIN이 제한되어 해당 서비스를 이용할 수 없습니다. 해당사이트에 문의해주세요.
const E_IBX_PIN_JUSTBEFOREDENY                              = 0x80010283;   // PIN 오류입니다. 한번 더 틀리시면 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_PIN_MISC                                        = 0x80010284;   // PIN 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_PIN_AND_PASSWORD_NOENTER                        = 0x80010285;   // 비밀번호와 PIN 둘 중 하나의 입력이 필요합니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_LOGIN_TYPE_NOTENTER                             = 0x80010290;   // 로그인 방식을 입력하지 않으셨습니다.

const E_IBX_DATE_BILL_NOT_EXIST                             = 0x800102A0;   // 조회가능한 청구년월이 없습니다. 확인 후 다시 거래하십시오.
const E_IBX_DATE_BILL_NOT_SUPPORTED                         = 0x800102A1;   // 해당 서비스에서 지원하지 않는 청구년월 데이터가 존재합니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_INQUERY_MONTH_NOTENTER                          = 0x80010310;   // 해당기관에서 조회가능한 개월수를 입력하지 않으셨습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_INQUERY_MONTH_INVALID                           = 0x80010311;   // 잘못된 조회 개월수를 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_INQUERY_MONTH_DENIED                            = 0x80010312;   // 해당기관에서 조회가능한 개월수를 초과하였습니다. 확인 후 다시 이용하시기 바랍니다.

const E_IBX_CARD_TYPE_INFO_NOTENTER                         = 0x80010320;   // 카드타입 미입력입니다. 확인 후 다시 거래하시기 바랍니다.
const E_IBX_CARD_TYPE_INFO_INVALID                          = 0x80010321;   // 잘못된 카드타입 입니다. 확인 후 다시 거래하시기 바랍니다.

const E_IBX_2ND_PASSWORD_NOTENTER       	            	= 0x80010330;	// 제 2 비밀번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_2ND_PASSWORD_INVALID        	            	= 0x80010331;	// 제 2 비밀번호를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_2ND_PASSWORD_DENIED         	            	= 0x80010332;	// 제 2 비밀번호가 제한되어 해당 서비스를 이용할 수 없습니다. 해당 사이트에 문의해주세요.
const E_IBX_2ND_PASSWORD_JUSTBEFOREDENY 	            	= 0x80010333;	// 제 2 비밀번호 오류입니다. 한번 더 틀리시면 비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_2ND_PASSWORD_MISC           	            	= 0x80010334;	// 제 2 비밀번호 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.

// EMAIL_URL
const E_IBX_ONE_TIME_URL_NOTENTER	           	            = 0x80010340;	// One Time URL 미입력입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_URL_INVALID	               		    = 0x80010341;	// 잘못된 One Time URL 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_URL_DENIED	               		        = 0x80010342;	// 제한된 One Time URL 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_ONE_TIME_URL_MISC	               		        = 0x80010343;	// One Time URL 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_LOCAL_AREA_TYPE_NOTENTER	                    = 0x80010350;   // 시내외구분 미입력입니다. 확인 후 다시 거래하십시오.
const E_IBX_LOCAL_AREA_TYPE_INVALID	                        = 0x80010351;   // 잘못된 시내외구분 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_LOCAL_AREA_TYPE_DENIED	                        = 0x80010352;   // 제한된 시내외구분 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_LOCAL_AREA_TYPE_MISC	                        = 0x80010353;   // 시내외구분 기타 오류입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_OTP_TYPE_NOTENTER	                            = 0x80010360;   // OTP 유형 미입력입니다. 확인 후 다시 거래하십시오.
const E_IBX_OTP_TYPE_INVALID	                            = 0x80010361;   // 잘못된 OTP 유형 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_OTP_TYPE_NONE_SERVICE	                        = 0x80010362;   // 해당 서비스에서 지원하지 않는 OTP 유형입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_REMIT_ADDRESS_NOTENTER                          = 0x80010370;  // 수취인 주소 미입력
const E_IBX_REMIT_ADDRESS_INVALID                           = 0x80010371;  // 잘못된 수취인 주소
const E_IBX_REMIT_ADDRESS_MISC                              = 0x80010372;  // 수취인 주소 관련 기타 오류

const E_IBX_REMIT_NAME_REFERENCE_NOTENTER                   = 0x80010374;  // 수취인 참조명 미입력 입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_NAME_REFERENCE_INVALID                    = 0x80010375;  // 잘못된 수취인 참조명 입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMIT_NAME_REFERENCE_MISC                       = 0x80010376;  // 수취인 참조명 관련 기타 오류 입니다. 확인 후 다시 거래하십시오.

const E_IBX_REMITTER_NATIONALITY_NOTENTER                   = 0x80010380;  // 송금인 국적 미입력 입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMITTER_NATIONALITY_INVALID                    = 0x80010381;  // 잘못된 송금인 국적 입니다. 확인 후 다시 거래하십시오.
const E_IBX_REMITTER_NATIONALITY_MISC                       = 0x80010382;  // 송금인 국적 관련 기타 오류 입니다. 확인 후 다시 거래하십시오.

const E_IBX_VERIFICATION_TYPE_NOTENTER	                    = 0x80010390;   // 인증 유형 미입력입니다. 확인 후 다시 거래하십시오.
const E_IBX_VERIFICATION_TYPE_INVALID	                    = 0x80010391;   // 잘못된 인증 유형 입니다. 확인하신 후 다시 이용하시기 바랍니다.
const E_IBX_VERIFICATION_TYPE_NONE_SERVICE	                = 0x80010392;   // 해당 서비스에서 지원하지 않는 인증 유형 입니다. 확인하신 후 다시 이용하시기 바랍니다.

const E_IBX_RECENT_TRANS_FLAG_NOTENTER                      = 0x800103A0;  // 최근 내역 조회구분 미입력 입니다. 확인 후 다시 거래하십시오.
const E_IBX_RECENT_TRANS_FLAG_INVALID                       = 0x800103A1;  // 잘못된 최근 내역 조회구분 입니다. 확인 후 다시 거래하십시오.
const E_IBX_RECENT_TRANS_FLAG_MISC                          = 0x800103A2;  // 최근 내역 조회구분 관련 기타 오류 입니다. 확인 후 다시 거래하십시오.

const E_IBX_USING_EQUIPMENT_NAME_NOTENTER	                = 0x80010400;   // 이용단말기명을 입력하지 않으셨습니다. 확인 후 다시 거래하십시오.
const E_IBX_USING_EQUIPMENT_NAME_INVALID	                = 0x80010401;   // 이용단말기명을 잘못 입력하셨습니다. 확인 후 다시 거래하십시오.

const E_IBX_NBRS_ID_NOTENTER	                            = 0x80010410;   // NBRS ID를 입력하지 않으셨습니다. 확인 후 다시 거래하십시오.
const E_IBX_NBRS_ID_INVALID	                                = 0x80010411;   // NBRS ID를 잘못 입력하셨습니다. 확인 후 다시 거래하십시오.

const E_IBX_TRANSACTION_PASSWORD_NOTENTER                   = 0x80010420;   // 거래 비밀번호를 입력하지 않았습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANSACTION_PASSWORD_INVALID                    = 0x80010421;   // 거래 비밀번호를 잘못 입력하였습니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANSACTION_PASSWORD_DENIED                     = 0x80010422;   // 거래 비밀번호가 제한되어 해당 서비스를 이용할 수 없습니다. 해당사이트에 문의해주세요.
const E_IBX_TRANSACTION_PASSWORD_JUSTBEFOREDENY             = 0x80010423;   // 거래 비밀번호 오류입니다. 한번 더 틀리시면 비밀번호 오류횟수 초과이오니 주의하시기 바랍니다.
const E_IBX_TRANSACTION_PASSWORD_MISC                       = 0x80010424;   // 거래 비밀번호 기타 오류입니다. 확인 후 다시 이용하시기 바랍니다.
const E_IBX_TRANSACTION_PASSWORD_TEMP                       = 0x80010425;   // 임시 거래 비밀번호 사용자 입니다. 해당 기관 홈페이지에서 등록 후 다시 이용하시기 바랍니다.

/////////////////////////////////////////////////////////////////////////////////
//                                   IBXSTATE                                  //
/////////////////////////////////////////////////////////////////////////////////

const IBXSTATE_BEGIN      = 0x00000001;   // OO 작업을 준비 중입니다(통신/보안 모듈을 생성 중입니다)
const IBXSTATE_CHECKPARAM = 0x00000002;   // 입력값의 오류를 확인 중입니다.
const IBXSTATE_LOGIN      = 0x00000003;   // 로그인 중입니다.
const IBXSTATE_ENTER      = 0x00000004;   // 해당 페이지로 이동 중입니다.
const IBXSTATE_EXECUTE    = 0x00000005;   // OO 작업을 실행 중입니다.
const IBXSTATE_PASER      = 0x00000006;   // 결과를 처리 중입니다.
const IBXSTATE_PASERNEXT  = 0x00000007;   // 다음 결과를 처리 중입니다.
const IBXSTATE_RESULT     = 0x00000008;   // 처리된 결과의 무결성을 점검 중입니다.
const IBXSTATE_ERROR      = 0x00000009;   // 에러 코드를 처리 중입니다.
const IBXSTATE_DONE       = 0x0000000A;   // 작업을 완료 중입니다.

/* extended status */
const IBXSTATE_INDERROR   = 0x0000000B;   // 반복 작업용
const IBXSTATE_CRITICAL   = 0x0000000C;   // 이체 마지막 단계 판별용


/////////////////////////////////////////////////////////////////////////////////
//                             공통 Base                                        //
/////////////////////////////////////////////////////////////////////////////////


function h2b(d) {
    var ht = "0123456789abcdef";
    var rs = new Array();
    var j = 0;
    for (var i = 0; i < d.length; i += 2) {
        var ch1 = ht.indexOf(d.charAt(i));
        var ch2 = ht.indexOf(d.charAt(i + 1));
        var b1 = (ch1 << 4) | ch2;
        rs[j++] = String.fromCharCode(b1);
    }
    return rs.join('');
}

function u8d(utftext) {
    var string = "";
    var i = 0;
    var c = 0;
    var c1 = 0;
    var c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) <<
                6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}

function sHtmlDecode(str){
    return str.replace(/&#(\d+);/g, function(match, dec) {
	    return String.fromCharCode(dec);
	});
}

String.prototype.hex2bin = function()
{
   var i = 0, len = this.length, result = "";

   //Converting the hex string into an escaped string, so if the hex string is "a2b320", it will become "%a2%b3%20"
   for(; i < len; i+=2)
      result += '%' + this.substr(i, 2);

   return unescape(result);
};


Date.prototype.yyyymmdd = function()
{
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();

    return yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]);
};

Date.prototype.yyyymmddhhmmss = function()
{
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var MM = this.getMinutes().toString();
    var SS = this.getSeconds().toString();
    var res = yyyy + (mm[1] ? mm : '0'+mm[0]);
        res += (dd[1] ? dd : '0'+dd[0]);
        res += (HH[1] ? HH : '0'+HH[0]);
        res += (MM[1] ? MM : '0'+MM[0]);
        res += (SS[1] ? SS : '0'+SS[0]);
    return res;

};

Date.prototype.hhmmsss = function()
{
    var HH = this.getHours().toString();
    var MM = this.getMinutes().toString();
    var SS = this.getSeconds().toString();
    var SSS = this.getMilliseconds().toString();
    var res = '';

    res += (HH[1] ? HH : '0'+HH[0]);
    res += (MM[1] ? MM : '0'+MM[0]);
    res += (SS[1] ? SS : '0'+SS[0]);

    if(SSS.length == 3) res += SSS;
    else if(SSS.length == 2) res += '0' + SSS;
    else if(SSS.length == 1) res += '00' + SSS;
    return res;

};

var origParseInt = parseInt;
parseInt = function(str, radix){
    try{
        if(radix != undefined) return origParseInt(str, radix);
        else return origParseInt(str, 10);
    }catch (e){
        return origParseInt(str);
    }
};


function IsCurrency(s) {
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || isNaN(s)) return false;
    return true;
}

function StrReplace(str, oldPattern, newPattern)
{
    // oldPattern : null, '', undefined 체크 추가 20190718 - 우만석
    if(!oldPattern){
        return str + "";
    }
	if (str.indexOf(oldPattern) >= 0){
		return str.split(oldPattern).join(newPattern);
	} else {
		return str + "";
	}
}

function StrTrim(str)
{
    if( str == null || str == undefined) {
        return str;
    } else {
        return str.trim();
    }
}
// 20170712 수정 전 Strgrab 함수
// function StrGrab(str, prefix, surfix, aIndex)
// {
//     if(str == "") return "";

//     var count;

//     if(aIndex == undefined) count = 1;
//     else count = aIndex;

//     var start, end;

//     for(var i = 0;i < count;i++){
//         if(prefix == ""){
//             start = 0;
//         }else{
//             start = str.indexOf(prefix);
//             //찾았으면...
//             if(start >= 0)
//                 start += prefix.length;
//             else return "";
//         }
//         //right trim
//         str = str.substr(start);

//         if(start == 0) break;
//     }

//     if(surfix == ""){
//         return str;
//     }else{
//         end = str.indexOf(surfix);
//         //찾았으면..
//         if(end >= 0){
//             return str.substr(0, end);
//         }else return "";
//     }
// }

// 20170712 수정 후 Strgrab 함수
function StrGrab(str, prefix, surfix, aIndex)
{
    if(str == "") return "";

    var count;

    if(aIndex == undefined) count = 1;
    else count = aIndex;

    var start, end, idx;

    idx = 0;

    for(var i = 0;i < count;i++){
        if(prefix == ""){
            start = 0;
        }else{
            start = str.indexOf(prefix, idx);
            //찾았으면...
            if(start >= 0)
                start += prefix.length;
            else return "";
        }
        //right trim
        //str = str.substr(start);
        idx=start;

        if(start == 0) break;
    }

    if(surfix == ""){
        return str.substr(idx);
    }else{
        end = str.indexOf(surfix,idx);
        //찾았으면..
        if(end >= 0){
            return str.substr(idx, end-idx);
        }else return "";
    }
}

function ClearCookie(host){
	try{
		httpRequest.clearCookie(host);
		return true;
	}catch(e){
		return false;
	}
}

function dec(aInput){
    console.log("dec_start");
    aInput = aInput || {};
    if(typeof Crypto === 'undefined' || typeof Crypto.dec === 'undefined'){
        console.log("Crypto is undefined");
        return aInput;
    }
    try{
        for (var key in aInput) {
            var val = aInput[key];
            if (val && typeof val === "object") {
                dec(aInput[key]);
            } else {
                aInput[key] = Crypto.dec(val)+"";
            }
        }
//        console.log("aInput: " + JSON.stringify(aInput));
        console.log("dec_end");
        return aInput;

    }catch(e){
        console.log("Crypto exception [" + e.message + "]");
        return aInput;
    }
}
// function dec(aInput){
// 	try{
// 		var rInput = JSON.parse("{}");
// 		for (i in aInput){
// 			var key = i;
// 			var val = aInput[i];

// 			if (typeof val == 'object') {
// 				for (j in val){
// 					var subKey = j;
// 					var subval = val[j];
// 					subval = Crypto.dec(subval)+"";
// 					val[subKey] = subval;
// 				}
// 				rInput[key] = val;

// 			} else {
// 				val = Crypto.dec(val);
// 				rInput[key] = val+"";
// 			}
// 		}
// 		return rInput;

// 	}catch(e){
// 		console.log("Crypto is undefined");
// 		return aInput;
// 	}
// }

//전역 변수
var obj = null;
var iSASClassName = "";
var iSASModuleName = "";
var iSASObj;
var logManager = {};

//juryu 2018-11-01 LINE 관련 국가간 통신 배제용 오류 코드 통신 여부 플레그
var IsCooconErrMsg = true;

///////////////////////////// error msg ////////////////////////////
//https://sgw.coocon.co.kr/sol/gateway/scrap_errcd.jsp?JSONData={"API_KEY":"TEST","API_ID":"0000","ERR_CD":"","ERR_MSG":"","LANG_TYPE":"0"}
function getCooconErrMsg(errCode)
{
    if(IsCooconErrMsg != true){
        // 무조건 빈 문자열
        return "";
    }else{
        errCode = errCode.toString(16).toUpperCase();
        console.log("called getCooconErrMsg");
        var API_KEY = "TEST";
        var API_ID  = "0000";
        var LANG_TYPE = '0';    // 오류 메시지 언어 구분 - "0": 한국어, "1": 영어, "2": 일본어, "3": 중국어

        // 글로벌인 경우 ErrorLang 무조건 입력 필요 (미정의 또는 빈값인 경우 한국어 메세지 출력)
        if ((obj.iSASInOut.ErrorLang !== undefined && obj.iSASInOut.ErrorLang !== null && StrTrim(obj.iSASInOut.ErrorLang) !== '')) {
            console.log("obj.iSASInOut.ErrorLang: [" + obj.iSASInOut.ErrorLang + "]");
            if (obj.iSASInOut.ErrorLang == 'KOR') {
                LANG_TYPE = '0'; // 한국어
            } else if (obj.iSASInOut.ErrorLang == 'JPN') {
                LANG_TYPE = '2'; // 일본어
            } else if (obj.iSASInOut.ErrorLang == 'ZHO') {
                LANG_TYPE = '3'; // 중국어
            } else {
                LANG_TYPE = '1'; // 그 외 영어
            }
        }
        console.log("LANG_TYPE: " + LANG_TYPE);

        // 42110000 통신 제외 (2020.03.24) // 80004100, 80002F20, 80002E21, 80004107 (2020.07.20)
        if (errCode == '42110000') {
            if (LANG_TYPE == '1')
                return 'Transaction results do not exist.(No transaction statement is found upon enquiring transaction statement.)';
            else if (LANG_TYPE == '2')
                return '照会結果がありません。(取引明細がありません。)';
            else if (LANG_TYPE == '3')
                return '交易结果不存在。（交易历史记录查询时没有交易记录）';
            else
                return '조회 결과가 없습니다.(거래내역조회 시 거래내역 없음)';
        } else if (errCode == '80004100') {
            if (LANG_TYPE == '1')
                return 'not found Digital certification. Please check and try again.';
            else if (LANG_TYPE == '2')
                return '証明書が見つかりません。ご確認のうえ、もう一度お取引ください。';
            else if (LANG_TYPE == '3')
                return '找不到认证书，请检查后再试。';
            else
                return '인증서를 찾을 수 없습니다. 확인 후 다시 거래하십시오.';
        } else if (errCode == '80002F20') {
            if (LANG_TYPE == '1')
                return 'The transaction failed, since the session with the financial institution terminated. Please try again later.';
            else if (LANG_TYPE == '2')
                return '当該金融機関のセッションがタイムアウトし、お取引に失敗しました。しばらくたってからお取引ください。';
            else if (LANG_TYPE == '3')
                return '由于网银会话超时而中断，查询失败，请再试一次。';
            else
                return '해당 기관의 세션이 종료되어 거래에 실패하였습니다. 잠시 후 다시 거래하십시오.';
        } else if (errCode == '80002E21') {
            if (LANG_TYPE == '1')
                return 'You were logged out due to duplicate login. Please execute again after a while.';
            else if (LANG_TYPE == '2')
                return '重複ログインによりログアウトしました。しばらくたってからご利用ください。';
            else if (LANG_TYPE == '3')
                return '由于重复登录已被退出。请稍候再试。';
            else
                return '중복로그인으로 로그아웃 처리 되었습니다. 잠시 후 다시 실행하여 주시기 바랍니다.';
        } else if (errCode == '80004107') {
            if (LANG_TYPE == '1')
                return 'DC (of other institution)has not been registered. Please visit corresponding website and register the DC (of other institution).';
            else if (LANG_TYPE == '2')
                return '（他の機関）認証書が登録されていません。当該サイトで認証書の登録後にご利用ください。';
            else if (LANG_TYPE == '3')
                return '（他机构）认证书没有登录，请访问相关网站，登录（他机构）认证书后再使用。';
            else
                return '(타기관)인증서가 등록되지 않았습니다. 해당 사이트 방문하시어 (타기관)인증서 등록 후 이용해 주시기 바랍니다.';
        } else {
            //전체 가져오는 부분
            //var url = "https://sgw.coocon.co.kr/sol/gateway/scrap_errcd.jsp?JSONData={\"API_KEY\":\"" + API_KEY + "\",\"API_ID\":\"" + API_ID + "\",\"ERR_CD\":\"\",\"ERR_MSG\":\"\",\"LANG_TYPE\":\"0\"}";
            //특정 오류 코드에 대한 오류 메시지 가져오는 부분
            var url = "https://isas.coocon.co.kr:8443/sol/gateway/scrap_errcd.jsp?" + "JSONData=" + httpRequest.URLEncode("{\"API_KEY\":\"" + API_KEY + "\",\"API_ID\":\"" + API_ID + "\",\"ERR_CD\":\"" + errCode + "\",\"ERR_MSG\":\"\",\"LANG_TYPE\":\"" + LANG_TYPE + "\"}");
            console.log("getCooconErrMsg url[" + "https://sgw.coocon.co.kr/sol/gateway/scrap_errcd.jsp?JSONData={\"API_KEY\":\"" + API_KEY + "\",\"API_ID\":\"" + API_ID + "\",\"ERR_CD\":\"" + errCode + "\",\"ERR_MSG\":\"\",\"LANG_TYPE\":\"" + LANG_TYPE + "\"}" + "]");
            if(httpRequest.get(url) == false){
                return "오류메시지 확인에 실패했습니다. 잠시 후 다시 실행 하여 주시기 바랍니다";  //서버오류
            }

            var resObj;
            //    resObj = {"ERR_MSG":"조회한 내용이 없습니다.","TOTAL_COUNT":"0","ERR_CD":"00000000","RESP_DATA":[]};
            //    resObj = {"ERR_MSG":"정상 조회 되었습니다.","TOTAL_COUNT":"1","ERR_CD":"00000000","RESP_DATA":[{"ERR_CD_ED":"80002F31","ERR_MSG":"해당 기관의 관련 페이지 변경으로 거래에 실패하였습니다. 잠시 후 다시 거래하십시오.","ERR_CD_ST":"80002F31","SS_STOP":"N","RE_RUN":"N"}]}
            resObj = JSON.parse(httpRequest.result);
            if(resObj.ERR_MSG == "정상 조회 되었습니다."){
                var respData = resObj.RESP_DATA;
                respData = respData[0];
                return respData.ERR_MSG;
            }else{
                return "오류메시지 확인에 실패했습니다. 잠시 후 다시 실행 하여 주시기 바랍니다"; //알수 없는 오류메시지
            }
        }
    }
}
///////////////////////////// error msg ////////////////////////////


function setError(jobObj, errcode){
    jobObj.Output = {};
    jobObj.Output.ErrorCode = errcode.toString(16).toUpperCase();
    jobObj.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16));

    return jobObj;
}

/*
function setErrorAll(errcode)
{
    for(var i=0;i<iSASObj.Jobs.length;i++){
        iSASObj.Jobs[i] = setError(iSASObj.Jobs[i], errcode);
    }
    return iSASObj;
}
*/

function SetClassName(aClassName, aModuleName)
{
    console.log("SetClassName(" + aClassName + ")");
    var result = E_IBX_UNKNOWN;
    try{
        if((iSASModuleName != aModuleName) || (iSASClassName != aClassName)){
            iSASClassName = aClassName;
            iSASModuleName = aModuleName;
            var execStr = "obj = new " + iSASClassName + "();";
            eval(execStr);
        }
        result = S_IBX_OK;
    }catch(e){
        console.log("Exception SetClassName:[" + e.message + "]");
    }finally{
        return result;
    }
}

//공통 인풋, 로그인 정보 받아서 처리.
function OnLogin(aLoginInfo)
{
    console.log("OnLogin(" + aLoginInfo + ")");
    var result = E_IBX_UNKNOWN;
    try{
        result = obj.onLogin(aLoginInfo);
    }catch(e){
        console.log("Exception OnLogin:[" + e.message + "]");
    }finally{
        return result;
    }
}

function SASLog(logMsg)
{
    if(logManager == {})
        console.log(logMsg);
    else
        logManager.log(logMsg);
}

//모듈로그처리용
var CheckObjForSendLog = {};
CheckObjForSendLog.isLogin = true;
CheckObjForSendLog.scrtName = "";
CheckObjForSendLog.clsName = "";
CheckObjForSendLog.jobName = [];
CheckObjForSendLog.ErrorCode = [];
//CustomErrorCode


var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;

function whatIsIt(object) {
    if (object === null) {
        return "null";
    }
    else if (object === undefined) {
        return "undefined";
    }
    else if (object.constructor === stringConstructor) {
        return "String";
    }
    else if (object.constructor === arrayConstructor) {
        return "Array";
    }
    else if (object.constructor === objectConstructor) {
        return "Object";
    }
    else {
        return "don't know";
    }
}

//JobObj받아서 처리.
function OnExcute(index, aJobObj)
{
    console.log("OnExcute([" + index + "], [" + aJobObj + "])");
    //juryu - LogManager 사용.
    console.log('LogManager Init Start');
    initLogManager(aJobObj);	//juryu - Comment
    console.log('LogManager Init End');

    var result = E_IBX_UNKNOWN;
    try{
		var _Input = JSON.parse(aJobObj);
		var currentLen = 0;
		var _IsMultiMode = whatIsIt(_Input.InputArray) == "Array";

		while(true){
			if((_IsMultiMode == true) && (_Input.InputArray.length >= currentLen))
				obj.iSASInOut = _Input.InputArray[currentLen++];
			else if(_IsMultiMode == false)
				obj.iSASInOut = _Input;

			//에멘탈 서비스 막기
	        //if(logManager.pltfName = "_SAS_CONFIG_PLATFORM_MAC" && logManager.libVrs == "2.6.7"){
			var pltfName_ = system.getPlatformName().toUpperCase();
			var libVrs_ = system.getLibraryVersion();
			if(pltfName_ == "_SAS_CONFIG_PLATFORM_LINUX" && libVrs_ == "2.5.7"){
			//if(logManager.pltfName == "_SAS_CONFIG_PLATFORM_MAC" && logManager.libVrs == "2.6.7"){
				obj.iSASInOut.Output = {};
				obj.iSASInOut.Output.ErrorCode = '80002F13';
				obj.iSASInOut.Output.ErrorMessage = "결과 검증에 실패했습니다. 고객센터로 문의하시기 바랍니다.";
			//	throw Error(obj.iSASInOut.Output.ErrorMessage);
			}
			else {

				var job = obj.iSASInOut.Job;
				var execStr = "obj." + job + "(" + JSON.stringify(obj.iSASInOut) + ");";
				console.log("Execute syntax:[" + JSON.stringify(execStr) + "]");
				eval(execStr);
			}

            // 오류 시 dvcID 확인 필요하다는 요청으로 인해 추가 (보맵)
            try{
                if(logManager != {})
               // obj.iSASInOut.Output.API_SEQ = logManager.dvcID;
                 obj.iSASInOut.API_SEQ = logManager.dvcID;
            }catch(e){
				// 읭? 왜 setproperty 오류 ?
            }

            // (로컬 스크래핑) 네이버 요청 로그인 외 로그인 실패 오류시 오류코드 변경(2019-06-26 wtkwon) 2019-08-23 제거
            var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
            if (_Input.Job && check.test(_Input.Job) && _Input.Job.indexOf('로그인') < 0 && obj.iSASInOut.Output.ErrorCode == '80004113') {
                obj.iSASInOut.Output.ErrorCode = '80004128';
                try {
                    if (!obj.iSASInOut.Output.ErrorMessage || obj.iSASInOut.Output.ErrorMessage.indexOf('로그인 실패하였습니다') > -1)
                        obj.iSASInOut.Output.ErrorMessage = '로그인 후 이용 가능한 서비스 입니다. 확인 후 다시 거래하시기 바랍니다.';
                }catch(e){
                    obj.iSASInOut.Output.ErrorMessage = '로그인 후 이용 가능한 서비스 입니다. 확인 후 다시 거래하시기 바랍니다.';
                }
            }

			//juryu - 무조건 호출하면된다.
			try{
				if(obj.iSASInOut.Output.ErrorCode != "00000000" ||
				(obj.iSASInOut.Module == "HomeTax" && obj.iSASInOut.Job.indexOf("전자세금계산서") > -1))
				//if(obj.iSASInOut.Output.ErrorCode != "00000000")
				{
					console.log("Types.OnExcute 결과 테스트 [" + JSON.stringify(obj.iSASInOut) + "]");
					if(logManager != {})
						logManager.sendErrorLog(obj.iSASInOut.Output.ErrorCode, obj.iSASInOut.Output.ErrorMessage);
				}
			}catch(e){

			}
			if(_IsMultiMode == false) break;
			if(_Input.InputArray.length <= currentLen) break;

			// JURYU COMMNET - 2018-07-24
			// 2개의 거래만 입력 된다고 하면,
			// 1번 거래는 선행 거래이므로 오류시 종료.
			// 2번 거래는 마지막 거래이므로 오류든 아니든 종료.
			if(obj.iSASInOut.Output.ErrorCode != "00000000") break;
		}

        result = S_IBX_OK;
    }catch(e){
        console.log("Exception OnExcute:[" + e.message + "]");
        // 요청한 job이 없을 경우 오류 메세지 처리
        if (JSON.stringify(e.message).indexOf("Cannot find function") > 0 || JSON.stringify(e.message).indexOf("is not a function") > 0 || JSON.stringify(e.message).indexOf("Unexpected identifier") > 0) {
            obj.iSASInOut = setError(obj.iSASInOut, 0x80002121);//요청하신 거래는 향후 적용예정이며 자세한 사항은 고객센터로 문의하시기 바랍니다.
            obj.iSASInOut.Output.ErrorMessage = "Job명을 확인해주시기 바랍니다.";
        } else {  // 알 수 없는 오류 처리
            obj.iSASInOut = setError(obj.iSASInOut, E_IBX_UNKNOWN);
        }

        //juryu - 무조건 호출하면된다.
        if(logManager != {}){
            logManager.sendErrorLog(E_IBX_UNKNOWN + "", "Exception OnExcute:[" + e.message + "]");
        }
    }finally{
        //juryu - 무조건 호출하면된다.
        var outdata = "";
        try{outdata = JSON.stringify(obj.iSASInOut.Output); }catch(e){}
        if(logManager != {}){
            if((logManager.sendDebugLog + "") != "undefined")
                logManager.sendDebugLog(outdata);
        }
        //금융인증서 콜백API호출 시 Input에 담겨있는 전자서명 관련 데이터 삭제 후 응답을 준다 20201209
        if(obj.iSASInOut.Input && obj.iSASInOut.Input.res){
            delete obj.iSASInOut.Input.res;
        }
        return result;
    }
}

function Succeeded(Status)
{
    return (Status & 0x80000000) == 0;
}

function Failed(Status)
{
    return (Status & 0x80000000) != 0;
}


function js_yyyy_mm_dd_hh_mm_ss () {
  var now = new Date();
  var year = "" + now.getFullYear();
  var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + month  + day  + hour  + minute +  second;
}

function js_yyyy_mm_dd () {
  var now = new Date();
  var year = "" + now.getFullYear();
  var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  return year + month  + day;
}


function null2void(_instance , custom_value){
    var instance = _instance;
    if( custom_value == null ) custom_value = "";
    if( instance == "undefined" || instance == null || instance == "null" || instance == "" || instance == undefined){
        return custom_value;
    }
    return instance;
}

function findTagGrap(textData , findTag, aIndex){

  var count=1;

  var idx = 1;

  if(aIndex == undefined) idx = 1;
  else idx = aIndex;

  var start = -1;

  while(count<=idx){
    start = textData.indexOf("<"+findTag,start);

    if(start>-1){
      start = textData.indexOf(">",start)+1;
    }
    count++;
  }

  if(start==-1){
    return "";
  }

  var end = textData.indexOf("</"+findTag+">",start);

  return textData.substring(start,end);
}

function findTagGrapHtml(textData,findTag,findAttr,findAttrValue){
  var count=1;

  var idx = 1;

  var start = -1;
  var end = -1;

  var tempGrapTagData = "";

  while(true){
    start = textData.indexOf("<"+findTag,start);

    if(start==-1){
      tempGrapTagData = "";
      break;
    }
    if(start>-1){
      end = textData.indexOf(">",start);
    }

    tempGrapTagData = textData.substring(start,end);
    idx = start;
    start = end+1;

    if(tempGrapTagData=="" || count==100){
      //this.log("AAAA = " + tempGrapTagData + " , " + count);
      break;
    }

    if(tempGrapTagData.indexOf(findAttr)>-1 && tempGrapTagData.indexOf(findAttrValue)>-1){
      end = textData.indexOf("</"+findTag+">",idx);
      tempGrapTagData = textData.substring(idx,end);
      break;
    }

    count++;
  }
  return tempGrapTagData;
}

function findInputGrapVaule(textData,findAttr,findAttrValue){
  var count=1;

  var idx = 1;

  var start = -1;
  var end = -1;

  var tempGrapTagData = "";

  while(true){
    start = textData.indexOf("<input",start);

    if(start==-1){
      tempGrapTagData = "";
      break;
    }
    if(start>-1){
      end = textData.indexOf(">",start);
      var tempEnd = textData.indexOf("/>",start);
      if(end-1==tempEnd){
        end = tempEnd;
      }
    }

    tempGrapTagData = textData.substring(start,end);
    idx = start;
    start = end+1;

    if(tempGrapTagData=="" || count==100){

      //console.log("AAAA = " + tempGrapTagData + " , " + count);
      break;
    }

    console.log("tempGrapTagData = " + tempGrapTagData);

    if(tempGrapTagData.indexOf(findAttr+"=")>-1 && tempGrapTagData.indexOf(findAttrValue)>-1){
      start = tempGrapTagData.indexOf("value");
      console.log("start1 = " + start);
      var substart = tempGrapTagData.indexOf("\"",start+1);

      if(substart==-1){
        substart = tempGrapTagData.indexOf("'",start+1);
      }

      if(substart>-1){
        substart = substart+1;

        console.log("start2 = " + substart);
        //start = tempGrapTagData.indexOf("\"",start+1);
        end = tempGrapTagData.indexOf("\"",substart+1);

        if(end==-1){
          end = tempGrapTagData.indexOf("'",substart+1);
        }

        //console.log("end = " + end);
        tempGrapTagData = tempGrapTagData.substring(substart,end);
      }

      break;
    }

    count++;
  }
  return tempGrapTagData;
}

function Special_Char_Replace(str){
	var tempStr = StrReplace(str,"&amp;","&");
	tempStr = StrReplace(str,"&nbsp;"," ");
	tempStr = StrReplace(str,"&lt;","<");
	tempStr = StrReplace(str,"&gt;",">");

	return tempStr;
}

function logSend(postData){
  try{
    httpRequest.post("http://b2bccstm.webcash.co.kr/b2bccstm/comm/b2bc_log_test.jsp", "logdata="+certManager.Base64Encode(httpRequest.URLEncodeAll(postData,"utf-8")) );
  }catch(e){}
}


function GetCardNoType(cardNo){
    var cardType = "";

    for(idx = 0; idx < cardNo.length ; idx++){

        if (!isNaN(Number(cardNo[idx]))){
            cardType += "0";
        }else if ((cardNo[idx] == "-") || (cardNo[idx] == " ")) {
            continue;
        }else{
            cardType += "x";
        }
    }
    return cardType;
}

//juryu 2018-11-01 일본 Line 프로젝트 관련 건은 무조건 스킵한다.
function DoinitLogManager(aInput)
{
    try{
        system.include("LogManager");
        logManager = new LogManager(aInput);
    }catch(e){
    	console.log("initLogManager exception:[" + e.message + "]");
        logManager = {};
    }
}

//juryu 2018-11-01 일본 Line 프로젝트 관련 건은 무조건 스킵한다.
function initLogManager(aInput)
{
    try{
        //juryu 2018-11-01 일본 Line 프로젝트 관련 건은 무조건 스킵한다.
        // "LineCommon":{
        //     "Company":"LINE",
        //     "Tr_seq":"fa060039-b03a-490a-861e-06653754a70e"
        //     ,"UserAgent":"LINEPlanner" //옵션
        // }
        IsCooconErrMsg = true;

        // UserAgent 처리 추가 기본값으로 되돌려놓는다. -juryu 2019-03-22
        if(!!httpRequest.setDefaultUserAgent){
            httpRequest.setDefaultUserAgent( "" );
        }

        var _Input = JSON.parse(aInput);

        if(!_Input.hasOwnProperty('LineCommon')){
            return DoinitLogManager(aInput);
		}

        if(whatIsIt(_Input.LineCommon) != "Object"){
            return DoinitLogManager(aInput);
		}

        //UserAgent 처리 추가 -juryu 2019-03-22
        if(_Input.LineCommon.hasOwnProperty('UserAgent') && (!!httpRequest.setDefaultUserAgent)){
            console.log("Change Default User Agent: [" + _Input.LineCommon.UserAgent + "]");
            httpRequest.setDefaultUserAgent( _Input.LineCommon.UserAgent );
        }

        if(!_Input.LineCommon.hasOwnProperty('Company')){
            return DoinitLogManager(aInput);
		}

        if((_Input.LineCommon.Company + '').toUpperCase() != 'LINE'){
            return DoinitLogManager(aInput);
		}

        //일본(LINE)이면 에러 메시지 통신도 배제한다.
		logManager = {};
        IsCooconErrMsg = false;
    }catch(e){
    	console.log("initLogManager exception:[" + e.message + "]");
        logManager = {};
    }
}


/*******************************************************
*  기능      :  주민번호 체크                          *
*  parameter :  String                                 *
*  return    :  Void                                   *
********************************************************/
function isJuminValid(juminNo) {
	var strJumin = juminNo.replace("-", "");
	var checkBit = new Array(2,3,4,5,6,7,8,9,2,3,4,5);
	var num7  = strJumin.charAt(6);
	var num13 = strJumin.charAt(12);
	var total = 0;

	if (strJumin.length == 13 ) {
		for (i=0; i<checkBit.length; i++) { // 주민번호 12자리를 키값을 곱하여 합산한다.
			total += strJumin.charAt(i)*checkBit[i];
		}

		// 외국인 구분 체크
		if (num7 == 0 || num7 == 9) { // 내국인 ( 1800년대 9: 남자, 0:여자)
			total = (11-(total%11)) % 10;
		}
		else if (num7 > 4) {  // 외국인 ( 1900년대 5:남자 6:여자  2000년대 7:남자, 8:여자)
			total = (13-(total%11)) % 10;
		}
		else { // 내국인 ( 1900년대 1:남자 2:여자  2000년대 3:남자, 4:여자)
			total = (11-(total%11)) % 10;
		}

		if(total != num13) {
		return false;
		}
		return true;
	} else{
		return false;
	}
}

/*******************************************************
* 기능 : 각 금융기관별 주민번호/사업자번호 구분 *
aRegNo : 주민사업자번호, aBankCD : BankName
********************************************************/

function CheckRegNo(aRegNo, aBankCD) {

    var asBankCD = ['산업', '기업', '국민', '수협', '농협', '우리', 'sc', '씨티', '대구', '부산', '광주', '제주', '전북', '경남', '새마을', '신협', '산림', '우체국', 'KEB하나', '신한','케이뱅크'];
    var anPibCnt = [6, 6, 0, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 8, 6, 0, 6, 6, 6, 0, 6];
    var anBizCnt = [10, -7, 0, -5, 10, -5, -5, 10, 0, -5, 10, -5, -5, 10, 10, 0, 10, 6, -5, 0, -7];

    var nRegLen = 0;
    var nRegCnt = 0;
    var CPMAX = 13;
    var CBMAX = 10;
    var TmpRst = '';

    var bisPib = false;
    var Result = S_IBX_OK;
    console.log("Result1:[" + Result + "]");

    // 주민등록번호/사업자번호 공백, '-' 제거
    aRegNo = StrReplace(aRegNo, ' ', '');
    aRegNo = StrReplace(aRegNo, '-', '');

    // 주민등록번호/사업자번호 길이 체크
    nRegLen = String(aRegNo).length;

    // // 개인기업구분(1:개인 / 2,그외:기업(기본값))
    // if (aCstClass == '1') {
    //     bisPib = true;
    // } else if (aCstClass == '2') {
    //     bisPib = false;
    // } else {
        for (var i = 0; i < asBankCD.length; i++) {
            if (aBankCD == asBankCD[i]) {
                nRegCnt = anPibCnt[i];
                break;
            }
        }

        if (nRegLen == Math.abs(nRegCnt)) {
            bisPib = true;
        } else {
            // 경남은행 주민번호 '19' + 앞6자리 하드코딩
            if (aBankCD == '경남' && nRegLen == 6) {
                aRegNo = '19' + aRegNo;
                //console.log("aRegNo=" + nRegLen);
                bisPib = true;
            } else {
                bisPib = false;
            }
        }
    //}

    // 개인-주민번호 13자리 입력하면 오류
    if (nRegLen == CPMAX) {
        Result = E_IBX_REGNO_RESIDENTMISC;
    }

    for (i = 0; i < asBankCD.length; i++) {
        if (aBankCD == asBankCD[i]) {
            if (bisPib) {
                nRegCnt = anPibCnt[i];
            } else {
                nRegCnt = anBizCnt[i];
            }
            break;
        }
    }

    console.log("nRegCnt=" + nRegCnt);

    // 입력체크를 하지 않는 경우 통과
    if (nRegCnt == 0) {
        Result = S_IBX_OK;
        return {
            Result: Result,
            aRegNo: aRegNo
        };
    }

    // 주민등록번호/사업자번호 오류코드 리턴
    if (nRegLen == 0) {
        if (bisPib) {
            Result = E_IBX_REGNO_RESIDENT_NOTENTER;
        } else {
            Result = E_IBX_REGNO_COMPANY_NOTENTER;
        }
    } else {
        if (bisPib) {
            TmpRst = E_IBX_REGNO_RESIDENT_INVALID;
        } else {
            TmpRst = E_IBX_REGNO_COMPANY_INVALID;
        }
    }

    // 기업-사업자번호 10자리 입력 : 자릿수대로 자르고 그렇지 않으면 그대로 보냄.
    if (bisPib) {
        aRegNo = aRegNo.substr(0, nRegCnt);
    } else if (!bisPib && (nRegLen = CBMAX)) {
        if (nRegCnt > 0) {
            aRegNo = aRegNo.substring(0, nRegCnt);
        }
        else {
            aRegNo = aRegNo.substring(aRegNo.length, aRegNo.length + nRegCnt);
        }
    }

    console.log("Result2:[" + Result + "]");

    return {
        Result: Result,
        aRegNo: aRegNo
    };

}

String.prototype.toBuffer = function () {

    var buf = new ArrayBuffer(this.length * 2); // 2 bytes for each char

    var bufView = new Uint8Array(buf, 0, this.length * 2);
    for (var i = 0, strLen = this.length; i < strLen; i++) {
        bufView[i] = this.charCodeAt(i);
    }
    return buf;
};

/**
 * 날짜의 월,일 받을 때 한자리 입력하면 두자리
 */
function toTwoByteMD(inputMD) {
    var varMD  = inputMD;
    if (("" + varMD).length == 1) {
    	varMD = "0"+ varMD;
    }
    return ("" + varMD);
}

/**
 * 유효한 월(月)인지 체크
 */
function isValidMonth(mm) {
    var m = parseInt(mm,10);
    return (m >= 1 && m <= 12);
}

/**
 * 유효한 일(日)인지 체크
 */
function isValidDay(yyyy, mm, dd) {
    var m = parseInt(mm,10) - 1;
    var d = parseInt(dd,10);

    var end = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
        end[1] = 29;
    }

    return (d >= 1 && d <= end[m]);
}

/**
 * 유효한 날짜 형식인지 체크
 */
function isValidYMD(iyear, imonth, iday) {

    var year  = iyear;
    var month = imonth;
    var day = iday;

    if (parseInt(year,10) >= 1900  && isValidMonth(month) &&
        isValidDay(year,month,day)) {
        return true;
    }
    return false;
}

/**
 * (성명)입력값 한글인지 체크
 */
function isHangul(str) {
    str = null2void(str);
    for(var idx=0;idx < str.length;idx++) {
        var c = escape(str.charAt(idx));
        if (c.indexOf("%u") == -1) {
            return false;
        }
    }
    return true;
}

function bitwiseOR(v1, v2) {
    var hi = 0x80000000;
    var low = 0x7fffffff;
    var hi1 = ~~(v1 / hi);
    var hi2 = ~~(v2 / hi);
    var low1 = v1 & low;
    var low2 = v2 & low;
    var h = hi1 | hi2;
    var l = low1 | low2;
    return h*hi + l;
}

/**
 * Sleep 함수
 */
function sleep (milliseconds) {
    var start = new Date().getTime();
    while (true) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

/**
 * ECMAScript 6th 지원 안되는 function override
 */
if(!String.prototype.includes){
    String.prototype.includes = function(input) {
        var str = this.toString();
        var str2 = null2void(input, "").toString();
        var is_rtn = false;
        if (str.indexOf(str2) > -1) {
            is_rtn = true;
        }
        return is_rtn;
    };
}

/* jshint +W009, +W020, +W061, +W088, +W104 */