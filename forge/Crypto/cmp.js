/**
 * Javascript implementation of ASN.1 validators for CMP.
 *
 * Copyright (c) 2012-2015 Initech, Inc.
 *
 * The ASN.1 representation of CMP is as follows
 * (see RFC #4210 for details, http://www.ietf.org/rfc/rfc4210.txt):
 *
 *
 *  PKIMessage ::= SEQUENCE {
         header           PKIHeader,
         body             PKIBody,
         protection   [0] PKIProtection OPTIONAL,
         extraCerts   [1] SEQUENCE SIZE (1..MAX) OF CMPCertificate
                          OPTIONAL
    }
    PKIMessages ::= SEQUENCE SIZE (1..MAX) OF PKIMessage

    PKIHeader ::= SEQUENCE {
         pvno                INTEGER     { cmp1999(1), cmp2000(2) },
         sender              GeneralName,
         recipient           GeneralName,
         messageTime     [0] GeneralizedTime         OPTIONAL,
         protectionAlg   [1] AlgorithmIdentifier     OPTIONAL,
         senderKID       [2] KeyIdentifier           OPTIONAL,
         recipKID        [3] KeyIdentifier           OPTIONAL,
         transactionID   [4] OCTET STRING            OPTIONAL,
         senderNonce     [5] OCTET STRING            OPTIONAL,
         recipNonce      [6] OCTET STRING            OPTIONAL,
         freeText        [7] PKIFreeText             OPTIONAL,
         generalInfo     [8] SEQUENCE SIZE (1..MAX) OF
                             InfoTypeAndValue     OPTIONAL
     }
     PKIFreeText ::= SEQUENCE SIZE (1..MAX) OF UTF8String
 InfoTypeAndValue ::= SEQUENCE {
         infoType               OBJECT IDENTIFIER,
         infoValue              ANY DEFINED BY infoType  OPTIONAL
     }

    PKIBody ::= CHOICE {
          ir       [0]  CertReqMessages,       --Initialization Req
          ip       [1]  CertRepMessage,        --Initialization Resp
          cr       [2]  CertReqMessages,       --Certification Req
          cp       [3]  CertRepMessage,        --Certification Resp
          p10cr    [4]  CertificationRequest,  --PKCS #10 Cert.  Req.
          popdecc  [5]  POPODecKeyChallContent --pop Challenge
          popdecr  [6]  POPODecKeyRespContent, --pop Response
          kur      [7]  CertReqMessages,       --Key Update Request
          kup      [8]  CertRepMessage,        --Key Update Response
          krr      [9]  CertReqMessages,       --Key Recovery Req
          krp      [10] KeyRecRepContent,      --Key Recovery Resp
          rr       [11] RevReqContent,         --Revocation Request
          rp       [12] RevRepContent,         --Revocation Response
          ccr      [13] CertReqMessages,       --Cross-Cert.  Request
          ccp      [14] CertRepMessage,        --Cross-Cert.  Resp
          ckuann   [15] CAKeyUpdAnnContent,    --CA Key Update Ann.
          cann     [16] CertAnnContent,        --Certificate Ann.
          rann     [17] RevAnnContent,         --Revocation Ann.
          crlann   [18] CRLAnnContent,         --CRL Announcement
          pkiconf  [19] PKIConfirmContent,     --Confirmation
          nested   [20] NestedMessageContent,  --Nested Message
          genm     [21] GenMsgContent,         --General Message
          genp     [22] GenRepContent,         --General Response
          error    [23] ErrorMsgContent,       --Error Message
          certConf [24] CertConfirmContent,    --Certificate confirm
          pollReq  [25] PollReqContent,        --Polling request
          pollRep  [26] PollRepContent         --Polling response
     }

 PKIProtection ::= BIT STRING

 PKIProtection 은 해당 메세지의 header 와 body 를 포함한 ProtectedPart 에 대해 DER 인코딩한 값을 MAC 하거나 서명한 값이다
 ProtectedPart 는 다음의 구조를 가진다

 ProtectedPart ::= SEQUENCE {
            header    PKIHeader,
            body      PKIBody
        }

 CMPCertificate ::= CHOICE {
         x509v3PKCert        Certificate
      }

 * RFC 4211
 CertReqMessages ::= SEQUENCE SIZE (1..MAX) OF CertReqMsg

 CertReqMsg ::= SEQUENCE {
      certReq   CertRequest,
      popo       ProofOfPossession  OPTIONAL,
      -- content depends upon key type
      regInfo   SEQUENCE SIZE(1..MAX) of AttributeTypeAndValue OPTIONAL
   }

 CertRequest ::= SEQUENCE {
      certReqId     INTEGER,        -- ID for matching request and reply
      certTemplate  CertTemplate, --Selected fields of cert to be issued
      controls      Controls OPTIONAL } -- Attributes affecting issuance

 CertTemplate ::= SEQUENCE {
      version      [0] Version               OPTIONAL,
      serialNumber [1] INTEGER               OPTIONAL,
      signingAlg   [2] AlgorithmIdentifier   OPTIONAL,
      issuer       [3] Name                  OPTIONAL,
      validity     [4] OptionalValidity      OPTIONAL,
      subject      [5] Name                  OPTIONAL,
      publicKey    [6] SubjectPublicKeyInfo  OPTIONAL,
      issuerUID    [7] UniqueIdentifier      OPTIONAL,
      subjectUID   [8] UniqueIdentifier      OPTIONAL,
      extensions   [9] Extensions            OPTIONAL }

 OptionalValidity ::= SEQUENCE {
      notBefore  [0] Time OPTIONAL,
      notAfter   [1] Time OPTIONAL } --at least one must be present

 Time ::= CHOICE {
      utcTime        UTCTime,
      generalTime    GeneralizedTime }
 * RFC 4211 여기 까지

  * RFC 3280
 SubjectPublicKeyInfo  ::=  SEQUENCE  {
        algorithm            AlgorithmIdentifier,
        subjectPublicKey     BIT STRING  }
 * 3280 여기까지

 CertRepMessage ::= SEQUENCE {
         caPubs       [1] SEQUENCE SIZE (1..MAX) OF CMPCertificate
                          OPTIONAL,
         response         SEQUENCE OF CertResponse
     }

 CertResponse ::= SEQUENCE {
         certReqId           INTEGER,
         -- to match this response with corresponding request (a value
         -- of -1 is to be used if certReqId is not specified in the
         -- corresponding request)
         status              PKIStatusInfo,
         certifiedKeyPair    CertifiedKeyPair    OPTIONAL,
         rspInfo             OCTET STRING        OPTIONAL
         -- analogous to the id-regInfo-utf8Pairs string defined
         -- for regInfo in CertReqMsg [CRMF]
     }

 CertifiedKeyPair ::= SEQUENCE {
         certOrEncCert       CertOrEncCert,
         privateKey      [0] EncryptedValue      OPTIONAL,
         -- see [CRMF] for comment on encoding
         publicationInfo [1] PKIPublicationInfo  OPTIONAL
     }

 CertOrEncCert ::= CHOICE {
         certificate     [0] CMPCertificate,
         encryptedCert   [1] EncryptedValue
     }

 PKIStatusInfo ::= SEQUENCE {
            status        PKIStatus,
            statusString  PKIFreeText     OPTIONAL,
            failInfo      PKIFailureInfo  OPTIONAL
        }

 PKIStatus ::= INTEGER {
         accepted                (0),
         -- you got exactly what you asked for
         grantedWithMods        (1),
         -- you got something like what you asked for; the
         -- requester is responsible for ascertaining the differences
         rejection              (2),
         -- you don't get it, more information elsewhere in the message
         waiting                (3),
         -- the request body part has not yet been processed; expect to
         -- hear more later (note: proper handling of this status
         -- response MAY use the polling req/rep PKIMessages specified
         -- in Section 5.3.22; alternatively, polling in the underlying
         -- transport layer MAY have some utility in this regard)
         revocationWarning      (4),
         -- this message contains a warning that a revocation is
         -- imminent
         revocationNotification (5),
         -- notification that a revocation has occurred
         keyUpdateWarning       (6)
         -- update already done for the oldCertId specified in
         -- CertReqMsg
     }

 PKIFailureInfo ::= BIT STRING {
     -- since we can fail in more than one way!
     -- More codes may be added in the future if/when required.
         badAlg              (0),
         -- unrecognized or unsupported Algorithm Identifier
         badMessageCheck     (1),
         -- integrity check failed (e.g., signature did not verify)
         badRequest          (2),
         -- transaction not permitted or supported
         badTime             (3),
         -- messageTime was not sufficiently close to the system time,
         -- as defined by local policy
         badCertId           (4),
         -- no certificate could be found matching the provided criteria
         badDataFormat       (5),
         -- the data submitted has the wrong format
         wrongAuthority      (6),
         -- the authority indicated in the request is different from the
         -- one creating the response token
         incorrectData       (7),
         -- the requester's data is incorrect (for notary services)
         missingTimeStamp    (8),
         -- when the timestamp is missing but should be there
         -- (by policy)
         badPOP              (9),
         -- the proof-of-possession failed
         certRevoked         (10),
            -- the certificate has already been revoked
         certConfirmed       (11),
            -- the certificate has already been confirmed
         wrongIntegrity      (12),
            -- invalid integrity, password based instead of signature or
            -- vice versa
         badRecipientNonce   (13),
            -- invalid recipient nonce, either missing or wrong value
         timeNotAvailable    (14),
            -- the TSA's time source is not available
         unacceptedPolicy    (15),
            -- the requested TSA policy is not supported by the TSA.
         unacceptedExtension (16),
            -- the requested extension is not supported by the TSA.
         addInfoNotAvailable (17),
            -- the additional information requested could not be
            -- understood or is not available
         badSenderNonce      (18),
            -- invalid sender nonce, either missing or wrong size
         badCertTemplate     (19),
            -- invalid cert. template or missing mandatory information
         signerNotTrusted    (20),
            -- signer of the message unknown or not trusted
         transactionIdInUse  (21),
            -- the transaction identifier is already in use
         unsupportedVersion  (22),
            -- the version of the message is not supported
         notAuthorized       (23),
            -- the sender was not authorized to make the preceding
            -- request or perform the preceding action
         systemUnavail       (24),
         -- the request cannot be handled due to system unavailability
         systemFailure       (25),
         -- the request cannot be handled due to system failure
         duplicateCertReq    (26)
         -- certificate cannot be issued because a duplicate
         -- certificate already exists
     }


 InfoTypeAndValue ::= SEQUENCE {
         infoType               OBJECT IDENTIFIER,
         infoValue              ANY DEFINED BY infoType  OPTIONAL
     }
 -- where {id-it} = {id-pkix 4} = {1 3 6 1 5 5 7 4}
 GenMsgContent ::= SEQUENCE OF InfoTypeAndValue

 -- Example InfoTypeAndValue contents include, but are not limited
 -- to, the following (un-comment in this ASN.1 module and use as
 -- appropriate for a given environment):
 --
 --   id-it-caProtEncCert    OBJECT IDENTIFIER ::= {id-it 1}
 --      CAProtEncCertValue      ::= CMPCertificate
 --   id-it-signKeyPairTypes OBJECT IDENTIFIER ::= {id-it 2}
 --      SignKeyPairTypesValue   ::= SEQUENCE OF AlgorithmIdentifier
 --   id-it-encKeyPairTypes  OBJECT IDENTIFIER ::= {id-it 3}
 --      EncKeyPairTypesValue    ::= SEQUENCE OF AlgorithmIdentifier
 --   id-it-preferredSymmAlg OBJECT IDENTIFIER ::= {id-it 4}
 --      PreferredSymmAlgValue   ::= AlgorithmIdentifier
 --   id-it-caKeyUpdateInfo  OBJECT IDENTIFIER ::= {id-it 5}
 --      CAKeyUpdateInfoValue    ::= CAKeyUpdAnnContent
 --   id-it-currentCRL       OBJECT IDENTIFIER ::= {id-it 6}
 --      CurrentCRLValue         ::= CertificateList

 ex)
 GenMsg:    {id-it 1}, < absent >
 GenRep:    {id-it 1}, Certificate | < absent >

 GenRepContent ::= SEQUENCE OF InfoTypeAndValue

 ErrorMsgContent ::= SEQUENCE {
         pKIStatusInfo          PKIStatusInfo,
         errorCode              INTEGER           OPTIONAL,
         -- implementation-specific error codes
         errorDetails           PKIFreeText       OPTIONAL
         -- implementation-specific error details
     }

 RevReqContent ::= SEQUENCE OF RevDetails

 RevDetails ::= SEQUENCE {
        certDetails         CertTemplate,
        crlEntryDetails     Extensions       OPTIONAL
    }

 RevRepContent ::= SEQUENCE {
         status        SEQUENCE SIZE (1..MAX) OF PKIStatusInfo,
         revCerts  [0] SEQUENCE SIZE (1..MAX) OF CertId OPTIONAL,
         crls      [1] SEQUENCE SIZE (1..MAX) OF CertificateList
                       OPTIONAL
     }

 CertId ::= SEQUENCE {
         issuer           GeneralName,
         serialNumber     INTEGER
     }

 PKIConfirmContent ::= NULL

 *

 *
 * ContentType ::= OBJECT IDENTIFIER
 *
 * EnvelopedData ::= SEQUENCE {
 *   version                    Version,
 *   recipientInfos             RecipientInfos,
 *   encryptedContentInfo       EncryptedContentInfo
 * }
 *
 * EncryptedData ::= SEQUENCE {
 *   version                    Version,
 *   encryptedContentInfo       EncryptedContentInfo
 * }
 *
 * id-signedData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 2 }
 *
 * SignedData ::= SEQUENCE {
 *   version           INTEGER,
 *   digestAlgorithms  DigestAlgorithmIdentifiers,
 *   contentInfo       ContentInfo,
 *   certificates      [0] IMPLICIT Certificates OPTIONAL,
 *   crls              [1] IMPLICIT CertificateRevocationLists OPTIONAL,
 *   signerInfos       SignerInfos
 * }
 *
 * SignerInfos ::= SET OF SignerInfo
 *
 * SignerInfo ::= SEQUENCE {
 *   version                    Version,
 *   issuerAndSerialNumber      IssuerAndSerialNumber,
 *   digestAlgorithm            DigestAlgorithmIdentifier,
 *   authenticatedAttributes    [0] IMPLICIT Attributes OPTIONAL,
 *   digestEncryptionAlgorithm  DigestEncryptionAlgorithmIdentifier,
 *   encryptedDigest            EncryptedDigest,
 *   unauthenticatedAttributes  [1] IMPLICIT Attributes OPTIONAL
 * }
 *
 * EncryptedDigest ::= OCTET STRING
 *
 * Attributes ::= SET OF Attribute
 *
 * Attribute ::= SEQUENCE {
 *   attrType    OBJECT IDENTIFIER,
 *   attrValues  SET OF AttributeValue
 * }
 *
 * AttributeValue ::= ANY
 *
 * Version ::= INTEGER
 *
 * RecipientInfos ::= SET OF RecipientInfo
 *
 * EncryptedContentInfo ::= SEQUENCE {
 *   contentType                 ContentType,
 *   contentEncryptionAlgorithm  ContentEncryptionAlgorithmIdentifier,
 *   encryptedContent       [0]  IMPLICIT EncryptedContent OPTIONAL
 * }
 *
 * ContentEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 *
 * The AlgorithmIdentifier contains an Object Identifier (OID) and parameters
 * for the algorithm, if any. In the case of AES and DES3, there is only one,
 * the IV.
 *
 * AlgorithmIdentifer ::= SEQUENCE {
 *    algorithm OBJECT IDENTIFIER,
 *    parameters ANY DEFINED BY algorithm OPTIONAL
 * }
 *
 * EncryptedContent ::= OCTET STRING
 *
 * RecipientInfo ::= SEQUENCE {
 *   version                     Version,
 *   issuerAndSerialNumber       IssuerAndSerialNumber,
 *   keyEncryptionAlgorithm      KeyEncryptionAlgorithmIdentifier,
 *   encryptedKey                EncryptedKey
 * }
 *
 * IssuerAndSerialNumber ::= SEQUENCE {
 *   issuer                      Name,
 *   serialNumber                CertificateSerialNumber
 * }
 *
 * CertificateSerialNumber ::= INTEGER
 *
 * KeyEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 *
 * EncryptedKey ::= OCTET STRING
 */
(function(fn){
    if (!fn.map) fn.map=function(f){var r=[];for(var i=0;i<this.length;i++)if(this[i]!==undefined)r[i]=f(this[i]);return r}
    if (!fn.filter) fn.filter=function(f){var r=[];for(var i=0;i<this.length;i++)if(this[i]!==undefined&&f(this[i]))r[i]=this[i];return r}
})(Array.prototype);

(function() {
/* ########## Begin module implementation ########## */
function initModule(forge) {

// shortcut for ASN.1 API
var asn1 = forge.asn1;

// shortcut for CMP API
var cmp = forge.cmp = forge.cmp || {};
forge.cmp = forge.cmp || {};
forge.cmp.asn1 = cmp;


//var _KeyPairRepository = (function(){
//	function createKeyPair(){
//		var state = forge.pki.rsa.createKeyPairGenerationState(2048, 0x10001);
//		var step = function() {
//			// run for 100 ms
//			if (!forge.pki.rsa.stepKeyPairGenerationState(state, 100)) {
//				setTimeout(step, 1);
//			} else {
//				alert("success");
//				// done, turn off progress indicator, use state.keys
//				var storage = sessionStorage.getItem("KEY_PAIR");
//				if (storage) {
//					storage = JSON.parse(storage);
//					storage.push(state.keys);
//					sessionStorage.setItem("KEY_PAIR", JSON.stringify(storage));
//				} else {
//					storage = [];
//					storage.push(state.keys);
//					sessionStorage.setItem("KEY_PAIR", JSON.stringify(storage));
//				}
//				//alert(storage.length);
//			}
//		};
//		// turn on progress indicator, schedule generation to run
//		setTimeout(step);
//	};
//	
//	var getKeyPair = function(){
//		var storage = sessionStorage.getItem("KEY_PAIR");
//		if (storage && storage.length>0) {
//			storage = JSON.parse(storage);
//			var keyPair = storage.pop();
//			
//			keyPair = {
//		        privateKey: forge.pki.rsa.setPrivateKey(
//		        					keyPair.privateKey.d, 
//		        					keyPair.privateKey.dP, 
//		        					keyPair.privateKey.dQ, 
//		        					keyPair.privateKey.e, 
//		        					keyPair.privateKey.n,
//		        					keyPair.privateKey.p, 
//		        					keyPair.privateKey.q,
//		        					keyPair.privateKey.qInv
//		        ),
//		          
//		        publicKey: forge.pki.rsa.setPublicKey(
//		        		keyPair.publicKey.e, keyPair.publicKey.n
//		        )
//		      };
//			
//			
//			sessionStorage.setItem("KEY_PAIR", JSON.stringify(storage));
//			return keyPair;
//		} else {
//			return forge.pki.rsa.generateKeyPair(2048);
//		}
//	};
//	
//	createKeyPair();
//	
//	return{
//		getKeyPair : getKeyPair
//	};
//}());








    var CertReqMessagesValidator = {
        name: 'CertReqMessages',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        value: [{
            name: 'CertReqMessages.CertReqMsg',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            optional: true,
            value: [{
                name: 'CertReqMessages.CertReqMsg.certReq',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                constructed: true,
                value: [{
                    name: 'CertReqMessages.CertReqMsg.certReq.certReqId',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.INTEGER,
                    constructed: false,
                    capture: 'CertReqMsgReqId'
                },{
                    name: 'CertReqMessages.CertReqMsg.certReq.certTemplate',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.SEQUENCE,
                    constructed: true,
                    value: [
                        {
                            name: 'CertReqMessages.CertReqMsg.certReq.certTemplate.SubjectPublicKeyInfo',
                            tagClass: asn1.Class.CONTEXT_SPECIFIC,
                            type: 6,
                            constructed: true,
                            value: [
                                {
                                    name: 'CertReqMessages.CertReqMsg.certReq.certTemplate.SubjectPublicKeyInfo.algorithm',
                                    tagClass: asn1.Class.UNIVERSAL,
                                    type: asn1.Type.OID,
                                    constructed: false,
                                    capture: 'CertReqMsgSubjectPublicKeyAlgorithm'
                                },{
                                    name: 'CertReqMessages.CertReqMsg.certReq.certTemplate.SubjectPublicKeyInfo.subjectPublicKey',
                                    tagClass: asn1.Class.UNIVERSAL,
                                    type: asn1.Type.BITSTRING,
                                    constructed: false,
                                    capture: 'CertReqMsgSubjectPublicKey'
                                }
                            ]
                        }]
                }]

            }]
        }]
    };

    /*
     PKIStatusInfo ::= SEQUENCE {
     status        PKIStatus,
     statusString  PKIFreeText     OPTIONAL,
     failInfo      PKIFailureInfo  OPTIONAL
     }

     PKIStatus ::= INTEGER {
     accepted               (0),
     grantedWithMods        (1),
     rejection              (2),
     waiting                (3),
     revocationWarning      (4),
     revocationNotification (5),
     keyUpdateWarning       (6)
     }
     */

    var PKIStatusInfoValidator = {
        name: 'PKIStatusInfo',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        optional: false,
        constructed: true,
        value: [{
            name: 'PKIStatusInfo.status',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            optional: false,
            constructed: false,
            capture: 'PKIStatusInfo_Status'
        },{
            name: 'PKIStatusInfo.PKIFreeText',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            optional: true,
            constructed: true,
            value: [
                {
                    name: 'PKIMessage.header.freeText.seq.text',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.UTF8,
                    constructed: false,
                    capture: 'PKIStatusInfo_statusString'
                }
            ]
        },{
            name: 'PKIStatusInfo.failInfo',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            optional: true,
            constructed: false,
            capture: 'PKIStatusInfo_failInfo'
        }]
    };

    var CertRepMessageValidator = {
        name: 'CertRepMessage',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        optional: false,
        constructed: true,
        value: [{
            name: 'CertRepMessage.caPubs',
            tagClass: asn1.Class.CONTEXT_SPECIFIC,
            type: 1,
            optional: true,
            constructed: true,
            value: [{
                name: 'CertRepMessage.caPubslist',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                constructed: true,
                captureAsn1: 'CertRepMsgCaPubsAsn'
            }]
        },{
            name: 'CertRepMessage.response',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
                name: 'CertRepMessage.response.CertResponse',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                constructed: true,
                value: [{
                    name: 'CertRepMessage.response.CertResponse.certReqId',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.INTEGER,
                    constructed: false,
                    capture: 'CertRepMsgCertReqId'
                },
                    PKIStatusInfoValidator,
                {
                    name: 'CertRepMessage.response.CertResponse.certifiedKeyPair',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.SEQUENCE,
                    optional: true,
                    constructed: true,
                    value: [{
                        name: 'CertRepMessage.response.CertResponse.certifiedKeyPair.certOrEncCert',
                        tagClass: asn1.Class.CONTEXT_SPECIFIC,
                        type: 0,
                        constructed: true,
                        value: [{
                            name: 'CertRepMessage.response.CertResponse.certifiedKeyPair.certOrEncCert.certificate',
                            tagClass: asn1.Class.UNIVERSAL,
                            type: asn1.Type.SEQUENCE,
                            constructed: true,
                            captureAsn1: 'CertRepMsgCertificate'
                        }]
                    }]
                },
                    {
                    name: 'CertRepMessage.response.CertResponse.rspInfo',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.OCTETSTRING,
                        optional: true,
                    constructed: false,
                    capture: 'CertRepMsgRspInfo'
                }]
            }]
        }]
    };

    /*
     KeyRecRepContent ::= SEQUENCE {
     status          PKIStatusInfo,
     newSigCert  [0] Certificate                   OPTIONAL,
     caCerts     [1] SEQUENCE SIZE (1..MAX) OF
     Certificate      OPTIONAL,
     keyPairHist [2] SEQUENCE SIZE (1..MAX) OF
     CertifiedKeyPair OPTIONAL
     }
     */
    var KeyRecRepContentValidator = {
        name: 'KeyRecRepContent',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [
            PKIStatusInfoValidator,
            {
                name: 'KeyRecRepContent.newSigCert',
                tagClass: asn1.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: true,
                optional: true,
                captureAsn1: 'newSigCert'
            },
            {
                name: 'KeyRecRepContent.caCerts',
                tagClass: asn1.Class.CONTEXT_SPECIFIC,
                type: 1,
                constructed: true,
                optional: true,
                captureAsn1: 'caCerts'
            },
            {
                name: 'KeyRecRepContent.keyPairHist',
                tagClass: asn1.Class.CONTEXT_SPECIFIC,
                type: 2,
                constructed: true,
                optional: true,
                captureAsn1: 'keyPairHist'
            }

        ]
    };

    var GenRepContentValidator = {
        name: 'GenRepContent',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: 'GenRepContent'
    };

    var InfoTypeAndValueValidator = {
        name: 'InfoTypeAndValue',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
            name: 'InfoTypeAndValue.infoType',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: 'InfoType'
        },{
            name: 'InfoTypeAndValue.infoValue',
            tagClass: asn1.Class.UNIVERSAL,
            optional: true,
            captureAsn1: 'InfoValueAsn'
        }]
    };

    var ErrorMsgContentValidator = {
        name: 'ErrorMsgContent',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [
            PKIStatusInfoValidator,
            {
                name: 'ErrorMsgContent.errorCode',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.INTEGER,
                optional: true,
                constructed: false,
                capture: 'errorCode'
            },
            {
                name: 'ErrorMsgContent.PKIFreeText',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                optional: true,
                constructed: true,
                value: [
                    {
                        name: 'ErrorMsgContent.PKIFreeText.errorDetails',
                        tagClass: asn1.Class.UNIVERSAL,
                        type: asn1.Type.UTF8,
                        constructed: false,
                        capture: 'errorDetails'
                    }
                ]
            }
        ]
    };


var PKIMessageValidator = {
  name: 'PKIMessage',
  tagClass: asn1.Class.UNIVERSAL,
  type: asn1.Type.SEQUENCE,
  constructed: true,
  value: [{
    name: 'PKIMessage.header',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: 'PKIMessage.header.pvno',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: 'PKIMsgPvno'
    }, {
      name: 'PKIMessage.header.sender1',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        capture: 'PKIMsgSender',
    }, {
        name: 'PKIMessage.header.sender4',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 4,
        optional: true,
        capture: 'PKIMsgSender',
        captureAsn1: 'PKIMsgSenderAsn'
    }, {
        name: 'PKIMessage.header.recipient1',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        capture: 'PKIMsgRecipient',
        captureAsn1: 'PKIMsgRecipientAsn'
    }, {
        name: 'PKIMessage.header.recipient4',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 4,
        optional: true,
        capture: 'PKIMsgRecipient',
        captureAsn1: 'PKIMsgRecipientAsn'
    }, {
        name: 'PKIMessage.header.messageTime',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.messageTime.time',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.GENERALIZEDTIME,
                constructed: false,
                optional: true,
                capture: 'PKIMsgTime'
            }
        ]
    }, {
        name: 'PKIMessage.header.protectionAlg',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.protectionAlg.AlgorithmIdentifier',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Class.SEQUENCE,
                constructed: true,
                optional: true,
                value: [{
                    name: 'PKIMessage.header.protectionAlg.AlgorithmIdentifier.algorithm',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.OID,
                    constructed: false,
                    capture: 'PKIMsgProtectionAlg'
                },{
                    name: 'PKIMessage.header.protectionAlg.AlgorithmIdentifier.parameters',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.SEQUENCE,
                    optional: true,
                    captureAsn1: 'PKIMsgProtectionAlgParam'
                }]
            }
        ]
    }, {
        name: 'PKIMessage.header.senderKID',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 2,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.senderKID.kid',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OCTETSTRING,
                constructed: false,
                capture: 'PKIMsgSenderKID'
            }
        ]
    }, {
        name: 'PKIMessage.header.recipKID',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 3,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.recipKID.kid',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OCTETSTRING,
                constructed: false,
                capture: 'PKIMsgRecipKID'
            }
        ]
    }, {
        name: 'PKIMessage.header.transactionID',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 4,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.transactionID.tid',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OCTETSTRING,
                constructed: false,
                capture: 'PKIMsgTransactionID'
            }
        ]
    }, {
        name: 'PKIMessage.header.senderNonce',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 5,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.senderNonce.snonce',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OCTETSTRING,
                constructed: false,
                capture: 'PKIMsgSenderNonce'
            }
        ]
    }, {
        name: 'PKIMessage.header.recipNonce',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 6,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.recipNonce.rnonce',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OCTETSTRING,
                constructed: false,
                capture: 'PKIMsgRecipNonce'
            }
        ]
    }, {
        name: 'PKIMessage.header.freeText',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 7,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.freeText.seq',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                constructed: true,
                value: [
                    {
                        name: 'PKIMessage.header.freeText.seq.text',
                        tagClass: asn1.Class.UNIVERSAL,
                        type: asn1.Type.UTF8,
                        constructed: false,
                        capture: 'PKIMsgFreeText'
                    }
                ]
            }
        ]
    }, {
        name: 'PKIMessage.header.generalInfo',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 8,
        optional: true,
        constructed: true,
        value: [
            {
                name: 'PKIMessage.header.generalInfo.InfoTypeAndValue',
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                constructed: true,
                value: [{
                    name: 'PKIMessage.header.generalInfo.InfoTypeAndValue.infoType',
                    tagClass: asn1.Class.UNIVERSAL,
                    type: asn1.Type.OID,
                    constructed: false,
                    capture: 'PKIMsgGeneralInfoType'
                },{
                    name: 'PKIMessage.header.generalInfo.InfoTypeAndValue.infoValue',
                    tagClass: asn1.Class.UNIVERSAL,
                    optional: true,
                    captureAsn1: 'PKIMsgGeneralInfoValueAsn'
                }]
            }
        ]
    }]
  },{
      name: 'PKIMessage.body (ir)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0, /* ir */
      optional: true,
      constructed: true,
      value: [
          CertReqMessagesValidator
      ]
  }, {
      name: 'PKIMessage.body (ip)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 1, /* ip */
      optional: true,
      constructed: true,
      value: [
          CertRepMessageValidator
      ]
  }, {
      name: 'PKIMessage.body (kur)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 7,
      optional: true,
      constructed: true,
      value: [
          CertReqMessagesValidator
      ]
  }, {
      name: 'PKIMessage.body (kup)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 8,
      optional: true,
      constructed: true,
      value: [
          CertRepMessageValidator
      ]
  }, {
      name: 'PKIMessage.body (krr)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 9,
      optional: true,
      constructed: true,
      value: [
          CertReqMessagesValidator
      ]
  }, {
      name: 'PKIMessage.body (krp)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 10,
      optional: true,
      constructed: true,
      value: [
          KeyRecRepContentValidator
      ]
  }, {
      name: 'PKIMessage.body (pkiconf)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 19,
      optional: true,
      constructed: true,
      value: [{
          //PKIConfirmContentValidator,
      }]
  }, {
      name: 'PKIMessage.body (genm)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 21,
      optional: true,
      constructed: true,
      value: [
          CertReqMessagesValidator
      ]
  }, {
      name: 'PKIMessage.body (genp)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 22,
      optional: true,
      constructed: true,
      value: [{
            //GenRepContentValidator
          name: 'GenRepContent',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: 'GenRepContent'
      }]
  }, {
      name: 'PKIMessage.body (error)',
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 23,
      optional: true,
      constructed: true,
      value: [
          ErrorMsgContentValidator
      ]
  }, {
    name: 'PKIMessage.protection',
    tagClass: asn1.Class.CONTEXT_SPECIFIC,
    type: 0,
    constructed: true,
    optional: true,
    value: [
      {
          name: 'PKIMessage.protection.PKIProtection',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.BITSTRING,
          constructed: false,
          capture: 'PKIMsgProtection'
      }
    ]
  }, {
    name: 'PKIMessage.extraCerts',
    tagClass: asn1.Class.CONTEXT_SPECIFIC,
    type: 1,
    optional: true,
    captureAsn1: 'extraCerts'
  }]
};

    cmp.signature = function(obj, privKey) {
        var tmp_obj = obj;

        /*
         ProtectedPart ::= SEQUENCE {
         header    PKIHeader,
         body      PKIBody
         }
         */
        // obj.value[2] 를 삭제 하고.. obj 를 der 로 변환 후.. desmac 수행
        if(tmp_obj.value.length > 2){
            tmp_obj.value.splice(2,tmp_obj.value.length -2);
        }
        var ProtectedPart = forge.asn1.toDer(tmp_obj);

        var hashObj = forge.md.sha256.create();
        hashObj.update(ProtectedPart.data);

        //var hashdata = hashObj.digest().getBytes();
        var protection = privKey.sign(hashObj);

        return protection;
    }

    cmp.etri_des_mac = function(obj, authKey) {
        var tmp_obj = obj;

        /*
         ProtectedPart ::= SEQUENCE {
         header    PKIHeader,
         body      PKIBody
         }
         */
        // obj.value[2] 를 삭제 하고.. obj 를 der 로 변환 후.. desmac 수행
        if(tmp_obj.value.length > 2){
            tmp_obj.value.splice(2,tmp_obj.value.length -2);
        }
        var ProtectedPart = forge.asn1.toDer(tmp_obj);

        /*
         todo.
         원래는 obj 에서 header 의 protectionAlg 을 뽑아서..
         해당 알고리즘 대로 protection 를 만들어야 하지만.. 우리 나라는 고정인지 몰겠지만.
         ETRI 가이드에 따라 아래 알고리즘을 고정 사용하고,
         아래와 같이 basekey 만들때 salt 와 ssk(인가코드) 의 순서도 좀 다름...
         protectionAlg : passwordBaseMac
         salt : aaaaabbbbb
         hash : sha1
         iter : 2
         mac alg : desMAC
         */

        /* ETRI:    basekey = "salt" || "ssk"  */
        /* RFC2511: basekey = "ssk"  || "salt" */
        var basekey = "aaaaabbbbb" + authKey;

        /* step1_key = h(h(basekey))
         step2_key = step1_key||h('1'||step1_key)'s 4byte
         h : sha1
         step1_key 20 byte 생성 되고
         3des 시에 24 byte 키가 필요 해서 step2 key 까지 만드는 것 같은데...
         실제 사용하는 알고리즘은 des-mac 이고.. des 라서... 8 byte 키만 있으면 된다

         주의) iniCrypto 에서는 알고리즘에 따라 입력으로 들어온 key 키 길이를 알아서 잘라서 사용 하지만
         여기 forge 에서는 키가 길면 그 긴키를 다 연산에 사용하면서.. 연산 결과가 틀리게 나오므로
         반드시 알고리즘에 맞게 키 길이를 조절해 줘야 한다......
         des : 8byte , 4des : 24byte
         */
        var md = forge.md.sha1.create();
        md.update(basekey);
        var h1 = md.digest().getBytes();
        var hex_h1 = forge.util.bytesToHex(h1);
        //forge.log.debug("ETRI protectionMAC step1 fir sha1 :" + hex_h1);
        md = forge.md.sha1.create();
        md.update(h1);
        var key = md.digest().getBytes();
        var hex_key = forge.util.bytesToHex(key);
        //forge.log.debug("ETRI protectionMAC step1 sec sha1:" + hex_key);


        /* 아래는 3des 인경우 키 길이 보정을 위해 필요 하다 여기서는 필요 없다 */
        /* ETRI: SHA-1's output is 20bytes. we need additional 4byte for DES-MAC*/
        /* 3des 시에 키 길이 24 바이트 맞추려고 하는 부분.
        md = forge.md.sha1.create();
        md.update("1" + key);
        var key2 = md.digest().getBytes();
        var hex_key2 = forge.util.bytesToHex(key2);
        //var bkey = key + key2[0] + key2[1] + key2[2] + key2[3];
        */
        var bkey = key[0] + key[1] + key[2] + key[3] +key[4] +key[5] +key[6] +key[7];

        var protection = forge.desmac.getMac(bkey, ProtectedPart);

        var hexprotect = protection.toHex();
        //forge.log.debug("ETRI protection:" + hexprotect);

        return protection.data;
    };

    cmp.pbm_hmac = function(content, ssk, salt, iter, hash) {
        var basekey = ssk + salt;
        /* RFC2511: basekey = "ssk"  || "salt" */

        var md = forge.md.sha1.create();
        for(i=0; i < iter; i++){
            md.update(basekey);
            basekey = md.digest().getBytes();
            md = forge.md.sha1.create();
        }
        // debug
        var hex_basekey = forge.util.bytesToHex(basekey);

        var hmac = forge.hmac.create();
        hmac.start('sha1', basekey);
        hmac.update(content.data);

        var protection = hmac.digest();

        var hexprotect = protection.toHex();
        //forge.log.debug("PBM HMac :" + hexprotect);

        return protection;
    };

/*
    cmp.genmFromPem = function(pem, computeHash, strict) {
        var msg = forge.pem.decode(pem)[0];

        if(msg.type !== 'CERTIFICATE' &&
            msg.type !== 'X509 CERTIFICATE' &&
            msg.type !== 'TRUSTED CERTIFICATE') {
            var error = new Error('Could not convert certificate from PEM; PEM header type ' +
                'is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
            error.headerType = msg.type;
            throw error;
        }
        if(msg.procType && msg.procType.type === 'ENCRYPTED') {
            throw new Error('Could not convert certificate from PEM; PEM is encrypted.');
        }

        // convert DER to ASN.1 object
        var obj = asn1.fromDer(msg.body, strict);

        return pki.certificateFromAsn1(obj, computeHash);
    };
*/
    cmp.genpFromAsn1 = function(obj) {
        // validate certificate and capture data
        var capture = {};
        var errors = [];
        if(!asn1.validate(obj, PKIMessageValidator, capture, errors)) {
            var error = new Error('Cannot read PKIMessage. ' +
                'ASN.1 object is not an PKIMessage.');
            error.errors = errors;
            throw error;
        }

        var genp = {};
        for (var ri = 0; capture.GenRepContent && ri < capture.GenRepContent.value.length; ++ri) {
            var oid = asn1.derToOid(capture.GenRepContent.value[ri].value[0].value);
            if (oid == '1.3.6.1.5.5.7.4.1') {
                genp.caProtEncCert = capture.GenRepContent.value[ri].value[1];
            }
            else if (oid == '1.2.410.200005.1.10.1') {
                genp.caCert = capture.GenRepContent.value[ri].value[1];
            }
        }
        genp.capture = capture;

        return genp;

    };

    cmp.ipFromAsn1 = function(obj) {
        // validate certificate and capture data
        var capture = {};
        var errors = [];
        if(!asn1.validate(obj, PKIMessageValidator, capture, errors)) {
            var error = new Error('Cannot read PKIMessage. ' +
                'ASN.1 object is not an PKIMessage.');
            error.errors = errors;
            throw error;
        }

        var ip = {};
        ip.capture = capture;
        if(capture.CertRepMsgCertificate) {
            ip.userCert = capture.CertRepMsgCertificate;
        }
        else if(capture.newSigCert) {
            ip.userCert = capture.newSigCert.value[0];
        }

        return ip;

    };

    cmp.makeHeader = function(ctx) {

        // reqCMD 및 msgType 및 CA 에 따른 값 설정

        /* SIGNGATE 인 경우 pvno 를 0 으로 설정 해야 함 */
        if(ctx.caname == "SIGNGATE"){
            ctx.pvno = 0;
        }
        else {
            ctx.pvno = 1;
        }

        /* protectionAlg (1) */
        if(ctx.reqCMD == "issue" || ctx.reqCMD == "reissue"){
            ctx.protectionAlg = "1.2.840.113533.7.66.13";
        }
        else if(ctx.reqCMD == "renew"){
            ctx.protectionAlg = "1.2.840.113549.1.1.11";
        }
        else {
            // error : unknown reqCMD
        }

        // 트랜잭션 내에서 변경 가능
        /* senderKID(2) 발급재발급은 참조 번호로 고정, 갱신시에는 genm 은 대상 인증서 시리얼, 그외 대상 인증서 subjectKID */
        if(ctx.reqCMD == "issue" || ctx.reqCMD == "reissue") {
            ctx.senderKID = ctx.refCode;
        }
        else if(ctx.reqCMD == "renew"){
            if(ctx.msgType == "genm"){
                ctx.senderKID = ctx.oldSerial;
                /* senderKID 에 인증서 시리얼을 CA 에 따라 정수 또는 hex 로 한다 함. 전자인증은 hexa 나머진 정수 */
                /* 근데 위에 내용이 달라졌다는 코멘트도 있어, 테스트 후에 확정 하자. */
                if(ctx.caname == "CROSSCERT")
                    ctx.senderKID = ctx.hexaSerial;
            }
            else if(ctx.msgType == "kur"){
                var subjectKeyId = ctx.signCert.getExtension('subjectKeyIdentifier');
                if(subjectKeyId) {
                    ctx.senderKID = forge.util.hexToBytes(subjectKeyId.subjectKeyIdentifier);
                }
            }
            // conf 는 kur 에 assign 한거 그대로 사용

        }

        /* recipKID(3) 발급 재발급 genm 은 "", ir/conf 는 caProtCert 의 subjectKID,
         갱신시에는 genm 은 대상 인증서의 subjectKID, 그외 caProtCert 의 subjectKID */
        if(ctx.msgType == "genm"){
            if(ctx.reqCMD == "issue" || ctx.reqCMD == "reissue"){
                ctx.recipKID = "";
            }
            else if(ctx.reqCMD == "renew"){
                var subjectKeyId = ctx.signCert.getExtension('subjectKeyIdentifier');
                if(subjectKeyId) {
                    ctx.recipKID = forge.util.hexToBytes(subjectKeyId.subjectKeyIdentifier);
                }
            }
        }
        else if(ctx.msgType == "ir" || ctx.msgType == "kur"){
            var caProtEncCert = forge.pki.certificateFromAsn1(ctx.genp.caProtEncCert);
            var subjectKeyId = caProtEncCert.getExtension('subjectKeyIdentifier');
            if(subjectKeyId) {
                ctx.recipKID = forge.util.hexToBytes(subjectKeyId.subjectKeyIdentifier);
            }
        }
        // conf 는 ir 에서 어사인된 값 그대로 사용

        /* transactionID(4) */
        if(ctx.msgType == "genm"){
            ctx.transactionID = forge.random.getBytes(16);
            //ctx.transactionID = forge.util.hexToBytes("EE195E99925CCBB575FAA070B415B1B1");
        }

        /* senderNonce(5) */
        /* SIGNGATE 는 128 byte 생성 해야 한다 */
        if(ctx.msgType == "genm"){
            if(ctx.canme == "SIGNGATE"){
                ctx.senderNonce = forge.random.getBytes(128);
            }
            else {
                ctx.senderNonce = forge.random.getBytes(16);
            }
            //ctx.senderNonce = forge.util.hexToBytes("59A9DEDA445329A086087F1B7B3A12B3");
        }


        /* recipNonce(6) 앞에 받은 메세지의 senderNonce */
        if(ctx.msgType == "genm"){
            ctx.recipNonce = "";
        }
        else if(ctx.msgType == "ir" || ctx.msgType == "kur"){
            if(ctx.genp.capture.PKIMsgSenderNonce){
                ctx.recipNonce = ctx.genp.capture.PKIMsgSenderNonce;
            }
        }
        else if(ctx.msgType == "conf" && ctx.recipNonce == ""){
            if(ctx.ip && ctx.ip.capture && ctx.ip.capture.PKIMsgSenderNonce){
                ctx.recipNonce = ctx.ip.capture.PKIMsgSenderNonce;
            }
            else if(ctx.kup && ctx.kup.capture && ctx.kup.capture.PKIMsgSenderNonce){
                ctx.recipNonce = ctx.kup.capture.PKIMsgSenderNonce;
            }
        }
        // conf 기존 값 유지..


        // header 생성
        var header = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);


        // pvno
        header.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(ctx.pvno).getBytes()));

        // sender
        if(ctx.reqCMD != "renew" && ctx.msgType == "genm"){
            if(ctx.caname == "SIGNKOREA") {
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, 'INI_NEW'));
            }
            else {
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }
        }
        else {
            header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
            ]));
        }

        // recipient
        if(ctx.reqCMD != "renew" && ctx.msgType == "genm"){
            if(ctx.caname == "SIGNGATE"){
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }
            else {
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                    asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
                ]));
            }
        }
        else {
            if(ctx.reqCMD == "renew" && (ctx.caname == "SIGNGATE" || ctx.caname == "SIGNKOREA")) {
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, 'INI_RENEW'));
            }
            else if(ctx.caname == "SIGNGATE" || ctx.caname == "SIGNKOREA"){
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }
            else {
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                    asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
                ]));
            }
        }


/*
        if(ctx.reqCMD != "renew" && ctx.msgType == "genm"){
            if(ctx.caname == "SIGNKOREA") {
                // sender
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, 'INI_NEW'));
            }
            else {
                // sender
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }

            if(ctx.caname == "SIGNGATE"){
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }
            else {
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                    asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
                ]));
            }


        }
        else if(ctx.reqCMD == "renew"){
            // sender
            header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
            ]));
            if(ctx.caname == "SIGNGATE") {
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, 'INI_RENEW'));
            }
            else if(ctx.caname == "SIGNKOREA"){
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, 'INI_RENEW'));
            }
            else {
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                    asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
                ]));
            }
        }
        else {
            // sender
            header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
            ]));
            if(ctx.caname == "SIGNGATE") {
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }
            else if(ctx.caname == "SIGNKOREA"){
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, false, ' '));
            }
            else {
                // recipient
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                    asn1.create(asn1.Class.UNIVERSAL, 48, false, '')
                ]));
            }
        }
        */

        // messageTime
        /* SIGNGATE 인 경우 생략 */
        var today = new Date();
        ctx.genmtime = today;
        
        header.value.push(
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(today))
                //asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, "20160521181914Z")
            ])
        );

        // protectionAlg (1)
        if(ctx.protectionAlg != ""){
            if(ctx.protectionAlg == "1.2.840.113549.1.1.11"){
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.2.840.113549.1.1.11").getBytes()),
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                    ])
                ]));

            }
            else if(ctx.protectionAlg == "1.2.840.113533.7.66.13"){
                header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.2.840.113533.7.66.13").getBytes()),
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, "aaaaabbbbb"),
                            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.3.14.3.2.26").getBytes()),
                                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                            ]),
                            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(2).getBytes()),
                            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.3.14.3.2.10").getBytes()),
                                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                            ])
                        ])
                    ])
                ]));
            }
        }

        /* 참조번호가 있으면 참조번호 , 없으면 */
        // senderKID
        header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ctx.senderKID)
            ])
        );

        // recipKID
        // genm : 갱신인 경우 갱신 대상 인증서의 subjectKeyIdentifier 를 , 발급재발급은 그냥 패스
        // ir, kur,  conf 에서는 genm 에서 받은 protEncCert 의 subjectKID 를..
        if (ctx.recipKID != "") {
            header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ctx.recipKID)
                ])
            );
        }

        /* SIGNGATE TID 생략 */
        if(ctx.caname != "SIGNGATE") {

            // transationID
            header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ctx.transactionID)
                ])
            );
        }

        // senderNonce
        header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 5, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ctx.senderNonce)
            ])
        );

        // recipNonce
        if (ctx.recipNonce != "") {
            header.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 6, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ctx.recipNonce)
                ])
            );
        }

        /* generalInfo [8] */
        /* 금융결제원 인증서 부정발급방지를 위해 PC정보를 IR, KUR 전송 시 header에 추가함. , 2010.06.03, jjh
        ==> 현재 pc cmp 에 해당 내용은 안보인다 현재는 없어도 되는건지... 원래부터 없어도 됐는지는 몰겠지만 없어도 된다
         [상세 설명]
         PC 정보 수집 내용은 CMP프로토콜의 IR 메시지의 PKIHeader의 generalInfo부분에 설정함
         - OID : 1.2.410.200005.1.4.1.1
         - value : 암호화된 PC 정보 수집 내용, type은 octetString
         PC 정보 수집 내용은 SEED_CBC 알고리즘을 이용하여 대칭키 암호화를 하여 저장함
         대칭키 암호화에 사용하는 대칭키는 인증서의 가상식별번호(VID)생성을 위한 random number를 sha256으로 Hash한 후
         값의 앞 16byte를 이용하고, Hash값의 뒤 16byte는 iv값으로 이용함
         */

        return header;
    };

    cmp.makegenm = function(ctx){

        // 21 Genm
        // caProtEncCert 요청
        if(ctx.caname == "SIGNGATE"){
            var body = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 21, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.3.6.1.5.5.7.4.1").getBytes())
                    ])
                ])
            ]);

            return body;
        }
        else {
            var body = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 21, true, [
                asn1.create(asn1.Class.UNIVERSAL, 48, true, [
                ])
            ]);

            return body;
        }
    };
    
    cmp.makeCertReqMsg = function(ctx) {

        /*
         CertRequest ::= SEQUENCE {
         certReqId     INTEGER,        -- ID for matching request and reply
         certTemplate  CertTemplate, --Selected fields of cert to be issued
         controls      Controls OPTIONAL } -- Attributes affecting issuance

         CertTemplate ::= SEQUENCE {
         version      [0] Version               OPTIONAL,
         serialNumber [1] INTEGER               OPTIONAL,
         signingAlg   [2] AlgorithmIdentifier   OPTIONAL,
         issuer       [3] Name                  OPTIONAL,
         validity     [4] OptionalValidity      OPTIONAL,
         subject      [5] Name                  OPTIONAL,
         publicKey    [6] SubjectPublicKeyInfo  OPTIONAL,
         issuerUID    [7] UniqueIdentifier      OPTIONAL,
         subjectUID   [8] UniqueIdentifier      OPTIONAL,
         extensions   [9] Extensions            OPTIONAL }
         */

        // SubjectPublicKeyInfo.subjectPublicKey BIT String
        //var pubkeyder = forge.util.decode64("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhg+E9uJKJdSJ23OHzuqkUgK4LDMNbJ4u/8gpYzmMhh2GIx6gI960N7UYh3tUqXkcWcNKuob57CDlBcrIkReYoSvC+AUDlj2plihzwlEtiELj2kMVHXSgZKTIBCdMt2Cnr3sT1zh/o9q8CCoIflxPMELkWkZ/1vBILsJX5fAMNckpeZGzOZTHa+hw8q05AM6WQq8f/iC459QhhLKMg8hOUfLJkO/bONCYP9oqn8Xwm6Y+Der8muCCrOHji8rH0gg6e8UI3hrt6V8B4BKU2jniQWkKmp/6BAqTnrrS1H//y2xEClprrg+KUj531hhEWSLrxexZMJ92Jj248UmuoS4ebQIDAQAB");
        //var pubkey = forge.asn1.fromDer(pubkeyder);

        var pubkey  = forge.pki.publicKeyToAsn1(ctx.rsakeys.publicKey);

        var certTemplate =  asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        var controls = '';
        if(ctx.reqCMD == "renew") {
            certTemplate.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 5, true, [
                forge.pki.distinguishedNameToAsn1(ctx.signCert.subject)
            ]));
            certTemplate.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 6, true, [
                pubkey.value[0],
                pubkey.value[1]
            ]));
        }
        else {
            certTemplate.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 6, true, [
                pubkey.value[0],
                pubkey.value[1]
            ]));
        }

        var certReq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
            certTemplate
        ]);

        if(ctx.reqCMD == "renew"){
            // controls
            certReq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.3.6.1.5.5.7.5.1.5").getBytes()),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                            forge.pki.distinguishedNameToAsn1(ctx.signCert.issuer)
                        ])                        ,
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(ctx.signCert.serialNumber))
                    ])
                ])
            ]));
        }

        /*
         CertReqMsg ::= SEQUENCE {
         certReq   CertRequest,
         popo       ProofOfPossession  OPTIONAL,
         -- content depends upon key type
         regInfo   SEQUENCE SIZE(1..MAX) of AttributeTypeAndValue OPTIONAL
         }

         */

        /*
         POPOSigningKey ::= SEQUENCE {
         poposkInput           [0] POPOSigningKeyInput OPTIONAL,
         algorithmIdentifier   AlgorithmIdentifier,
         signature             BIT STRING }
         -- The signature (using "algorithmIdentifier") is on the
         -- DER-encoded value of poposkInput.  NOTE: If the CertReqMsg
         -- certReq CertTemplate contains the subject and publicKey values,
         -- then poposkInput MUST be omitted and the signature MUST be
         -- computed over the DER-encoded value of CertReqMsg certReq.  If
         -- the CertReqMsg certReq CertTemplate does not contain both the
         -- public key and subject values (i.e., if it contains only one
         -- of these, or neither), then poposkInput MUST be present and
         -- MUST be signed.
         POPOSigningKeyInput ::= SEQUENCE {
         authInfo            CHOICE {
         sender              [0] GeneralName,
         -- used only if an authenticated identity has been
         -- established for the sender (e.g., a DN from a
         -- previously-issued and currently-valid certificate)
         publicKeyMAC        PKMACValue },
         -- used if no authenticated GeneralName currently exists for
         -- the sender; publicKeyMAC contains a password-based MAC
         -- on the DER-encoded value of publicKey
         publicKey           SubjectPublicKeyInfo }  -- from CertTemplate
         PKMACValue ::= SEQUENCE {
         algId  AlgorithmIdentifier,
         -- algorithm value shall be PasswordBasedMac {1 2 840 113533 7 66 13}
         -- parameter value is PBMParameter
         value  BIT STRING }
         */

        var publicKey = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            pubkey.value[0],
            pubkey.value[1]
        ]);
        var publicKeyDer = asn1.toDer(publicKey);
        var hex_der = forge.util.bytesToHex(publicKeyDer);
        // debug
        /* 294 byte
         30 82 01 22 30 0D 06 09 2A 86 48 86 F7 0D 01 01 01 05 00 03 82 01 0F 00 30 82 01 0A
         02 82 01 01 00 BC F0 57 E1 F1 3E A5 28 35 0E C1 46 63 6E F8 2E 8B 1D 9D 03 CA 49 63
         D8 8F E7 C6 8E C8 7C 7C 7D 18 65 C8 CF 4C C6 D6 8A 66 22 C6 67 27 8C F0 36 45 38 A6
         9A B6 AE 1A C9 0D A9 37 37 18 B4 39 07 E4 39 9A E1 BB E0 28 A6 61 7A C3 4A 41 51 DA
         0C DF C7 74 4C 18 74 4C FF 0D 66 3D 54 CC AA A8 63 8C B4 28 B4 31 1A 39 47 D0 55 BA
         C2 81 E7 AD 49 9B 15 18 F1 83 2B EF EB 3D 3A 23 2D 34 DA F6 70 59 28 DF 3A 4A 58 6A
         7C 6B 85 30 41 CA DE 76 0D EB 5B 4C 5F B6 7A B1 BA 01 EB 2F F3 3E 55 E7 BA 9E 88 66
         10 28 7B 5F 44 AC 94 83 2F B9 BE 5F 2F A9 3A 90 FC C8 89 6A A8 B2 EA 5F 73 F9 36 8A
         1F 46 82 B2 F6 05 32 6A 9E DC E0 21 AF D1 66 37 19 6F 45 2F A6 99 C2 F1 3A 0B 7A 8A
         06 75 B4 D9 CF AA 5B B5 24 B8 A9 6F CA 48 04 E4 EF 8D 68 11 FC E0 D6 E9 4E 5E 84 05
         EE F6 92 39 CD CA 1A 22 F5 02 03 01 00 01
         */

        // debug
        var randomSalt = forge.random.getBytes(16);

        //var randomSalt = forge.util.hexToBytes("27A99F3BA3FB3A44381CBF90312051A7");
        //var randomSalt = forge.util.decode64("BBDCDmc/b2YnUVQ+Rw9URyP1");

        var hmac = cmp.pbm_hmac(publicKeyDer, ctx.authKey, randomSalt, 1024, 'sha1');

        var publicKeyMAC = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.2.840.113533.7.66.13").getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, randomSalt),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.3.14.3.2.26").getBytes()),
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                    ]),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(1024).getBytes()),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.3.6.1.5.5.8.1.2").getBytes()),
                        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                    ])
                ])
            ]),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false,
                String.fromCharCode(0x00) + hmac.data)
        ]);



        var poposkInput = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            /* authInfo */
            /* 신규 가입자 등 사전에 인증되지 않은 가입자의 경우 사용
             가입자의 공개키의 DER 인코딩 값에 대해 password based MAC 설정
             */
            publicKeyMAC,
            /* publicKey */
            publicKey
        ]);

        var poposkInput2 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            /* authInfo */
            /* 신규 가입자 등 사전에 인증되지 않은 가입자의 경우 사용
             가입자의 공개키의 DER 인코딩 값에 대해 password based MAC 설정
             */
            publicKeyMAC,
            /* publicKey */
            publicKey
        ]);

        /*
         POPOSigningKey ::= SEQUENCE {
         poposkInput           [0] POPOSigningKeyInput OPTIONAL,
         algorithmIdentifier   AlgorithmIdentifier,
         signature             BIT STRING }
         */
        /*
         ProofOfPossession ::= CHOICE {
         raVerified        [0] NULL,
         -- used if the RA has already verified that the requester is in
         -- possession of the private key
         signature         [1] POPOSigningKey,
         keyEncipherment   [2] POPOPrivKey,
         keyAgreement      [3] POPOPrivKey }
         */

        // 서명은 poposkInput 을  DER 로 인코딩 하여 서명 .
        var poposkInputDer = forge.asn1.toDer(poposkInput);
        //var poposkInputDer = forge.util.decode64("MIIBfTBVMDwGCSqGSIb2fQdCDTAvBBDCDmc/b2YnUVQ+Rw9URyP1MAkGBSsOAwIaBQACAgQAMAwGCCsGAQUFCAECBQADFQDPiK9jDa4M90Rl7xY5LTKRGF76+jCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALXbV7fZyyLwW4546SvyxfU0t6pSaG79VHZF9y8IyknH6IUdEseqgnRWaIXACVEyuT2MwS42pdy21Pe4PEPeHSLH+Y6tAm4UB6D5PSnwU7SzQWZ2A0Gwk9saGqkUIPiONq1/BVRqC3LSKbSC+XWIrv0cWsKihl2CA7PWcv/crSl/lnBoSFJ+nEbepoXJ9NHoyVNywt9rjAqVaIh6fNwoEToDc1HzsvbIlqK4HJM10wa1RRUyjYgFrwu1QmX1PBwaxyhDgNFCUe+YaiZGyCApONiqV7jEbqAd5wI0oT8ELuCZ6EqVugQDhDSZbUP1AGFazUKAULJ34QUJ2xRJ87ozBqkCAwEAAQ==");
        var hex_p = forge.util.bytesToHex(poposkInputDer);
        /* 385
         30 82 01 7D 30 55 30 3C 06 09 2A 86 48 86 F6 7D 07 42 0D 30 2F 04 10 36 60 4F EA 2D
         C8 1B A0 28 CA BB 7C D3 42 5D C4 30 09 06 05 2B 0E 03 02 1A 05 00 02 02 04 00 30 0C
         06 08 2B 06 01 05 05 08 01 02 05 00 03 15 00 57 17 DF 48 1C 5C 6D D3 77 35 EC 99 55
         93 5E A7 36 88 7D 63 30 82 01 22 30 0D 06 09 2A 86 48 86 F7 0D 01 01 01 05 00 03 82
         01 0F 00 30 82 01 0A 02 82 01 01 00 BC F0 57 E1 F1 3E A5 28 35 0E C1 46 63 6E F8 2E
         8B 1D 9D 03 CA 49 63 D8 8F E7 C6 8E C8 7C 7C 7D 18 65 C8 CF 4C C6 D6 8A 66 22 C6 67
         27 8C F0 36 45 38 A6 9A B6 AE 1A C9 0D A9 37 37 18 B4 39 07 E4 39 9A E1 BB E0 28 A6
         61 7A C3 4A 41 51 DA 0C DF C7 74 4C 18 74 4C FF 0D 66 3D 54 CC AA A8 63 8C B4 28 B4
         31 1A 39 47 D0 55 BA C2 81 E7 AD 49 9B 15 18 F1 83 2B EF EB 3D 3A 23 2D 34 DA F6 70
         59 28 DF 3A 4A 58 6A 7C 6B 85 30 41 CA DE 76 0D EB 5B 4C 5F B6 7A B1 BA 01 EB 2F F3
         3E 55 E7 BA 9E 88 66 10 28 7B 5F 44 AC 94 83 2F B9 BE 5F 2F A9 3A 90 FC C8 89 6A A8
         B2 EA 5F 73 F9 36 8A 1F 46 82 B2 F6 05 32 6A 9E DC E0 21 AF D1 66 37 19 6F 45 2F A6
         99 C2 F1 3A 0B 7A 8A 06 75 B4 D9 CF AA 5B B5 24 B8 A9 6F CA 48 04 E4 EF 8D 68 11 FC
         E0 D6 E9 4E 5E 84 05 EE F6 92 39 CD CA 1A 22 F5 02 03 01 00 01
         */
        var hashObj = forge.md.sha256.create();
        hashObj.update(poposkInputDer.data);

        //var hashdata = hashObj.digest().getBytes();
        var sign = ctx.rsakeys.privateKey.sign(hashObj);
        var hex_sign = forge.util.bytesToHex(sign);
        //var sign = ctx.rsakeys.privateKey.sign(hashObj.digest().getBytes());
        //var sign = forge.util.decode64("KRDEG7K2x3dWigvtnnQURikln2zClWUVJ75xDmZfUFvmVRHiO2WYaoayd0W8tGC1Fqxq7ykOLDy6G1ppmovvxyarOdBfJBv/ZjOJPBesjxyjPXS9QLCo7U6xzA2OZtJFrDKULvD/R0HHrlPcSdyQo7gBoASyb2RxyNHRSZ+EOKxwYAaCxVnZsSCxl1EpTBo9epvkX1BwE1nkuzjuFL+x0+FhWQ8WUE9Ms4QcIg8OO95ikABo7YNdP5wl/nzDUqWolIxsSyWlNXNbLWzusH/VtXsIlIn5EdKP8WWWD0zdysqaHFni9GtzQls0XF51rAA5qraNKR9NMLgGmCDxOUWngA==");

        var hashObj2 = forge.md.sha256.create();
        hashObj2.update(poposkInputDer.data);
        var publickey = forge.pki.publicKeyFromAsn1(pubkey);
        var verified = publickey.verify(hashObj2.digest().bytes(), sign);
        //var verified = ctx.rsakeys.publicKey.verify(hashObj2.digest().bytes(), sign);
        // debug
        /* 257 sign
         00 B5 DB 57 B7 D9 CB 22 F0 5B 8E 78 E9 2B F2 C5
         F5 34 B7 AA 52 68 6E FD 54 76 45 F7 2F 08 CA 49
         C7 E8 85 1D 12 C7 AA 82 74 56 68 85 C0 09 51 32
         B9 3D 8C C1 2E 36 A5 DC B6 D4 F7 B8 3C 43 DE 1D
         22 C7 F9 8E AD 02 6E 14 07 A0 F9 3D 29 F0 53 B4
         B3 41 66 76 03 41 B0 93 DB 1A 1A A9 14 20 F8 8E
         36 AD 7F 05 54 6A 0B 72 D2 29 B4 82 F9 75 88 AE
         FD 1C 5A C2 A2 86 5D 82 03 B3 D6 72 FF DC AD 29
         7F 96 70 68 48 52 7E 9C 46 DE A6 85 C9 F4 D1 E8
         C9 53 72 C2 DF 6B 8C 0A 95 68 88 7A 7C DC 28 11
         3A 03 73 51 F3 B2 F6 C8 96 A2 B8 1C 93 35 D3 06
         B5 45 15 32 8D 88 05 AF 0B B5 42 65 F5 3C 1C 1A
         C7 28 43 80 D1 42 51 EF 98 6A 26 46 C8 20 29 38
         D8 AA 57 B8 C4 6E A0 1D E7 02 34 A1 3F 04 2E E0
         99 E8 4A 95 BA 04 03 84 34 99 6D 43 F5 00 61 5A
         CD 42 80 50 B2 77 E1 05 09 DB 14 49 F3 BA 33 06
         A9
        */
        /* result = ICMP_CRYPTO_signature_schemes(asym_key, ICL_RSASSA_PKCS1_15, hash_id, data, count, signdata, &signdata_len); */
        /* signature [1] */

        var popo = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
            poposkInput2,
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.2.840.113549.1.1.11").getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
            ]),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false,
                String.fromCharCode(0x00) + sign)
        ]);

        /*
         CertReqMsg ::= SEQUENCE {
         certReq   CertRequest,
         popo       ProofOfPossession  OPTIONAL,
         -- content depends upon key type
         regInfo   SEQUENCE SIZE(1..MAX) OF AttributeTypeAndValue OPTIONAL }
         */




        /*
         http://rootca.kisa.or.kr/kcac/down/TechSpec/1.5-Subscriber%20Identification%20Based%20on%20Virtual%20ID.pdf
         식별번호를 이용한 본인확인 기술규격

         virtualID은 6장 6.5에서 기술한 방식에 따라 계산된 값으로 DER 코딩된
         HashContent값을 2회 해쉬하여 계산한다.

         HashContent ::= SEQUENCE {
         idn PrintableString,
         randomNum BIT STRING
         }
         ․idn는 가입자 식별번호로서 일반적으로 주민등록번호 및 사업자 등록번호 등이
         될 수 있다. 가입자 식별번호는 ‘-’ 등과 같은 구분자를 제거한 상태의
         숫자열로만 구성되며 PrintableString으로 표현한다.
         ․randomNum는 160비트 이상의 길이를 가지는 안전한 임의의 난수이다.

         6.5 가상 식별정보 생성
         실제로 공인인증서에 포함될 식별번호 관련 정보를 다음과 같이 계산한다.
         VID = h(h(IDN, R))
         여기서 사용되는 해쉬 함수는 모두 동일한 해쉬함수를 사용한다.
         */


        var hashContentobj = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.PRINTABLESTRING, false, ctx.idn),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + ctx.vidRandom)
        ]);
        var hashContent = asn1.toDer(hashContentobj);
        var hex_h = forge.util.bytesToHex(hashContent);
        /* 30 26 13 0D 31 32 33 34 35 36 31 32 33 34 35 36 37 03 15 00 79 EA 75 68 A2 D3 77 66 04 E1 8B CD 3A 1B 1B 85 B7 DA 08 72 */

        var vidhash = forge.md.sha256.create();
        vidhash.update(hashContent.data);
        var h1 = vidhash.digest().getBytes();
        /* CD FF 7F 7C 20 B3 21 9B C8 CE 65 FE 46 1C F8 26 91 27 18 BF 0F 60 4C BB 6E 82 16 EA C9 56 4C 30 */
        vidhash = forge.md.sha256.create();
        vidhash.update(h1);
        var virtualID = vidhash.digest().getBytes();
        var hex_v = forge.util.bytesToHex(virtualID);
        /* 17 69 2C 8D D0 0E AD 33 79 1D E0 A6 4A 93 7C 60 79 96 34 C6 4A C5 6F A5 75 70 C0 E0 52 52 AB 35 */
        /*
         VID ::= SEQUENCE {
         hashAlg HashAlgorithm,
         virtualID [0] OCTET STRING }
         */
        var vidobj = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("2.16.840.1.101.3.4.2.1").getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
            ]),
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, virtualID)
            ])
        ]);

        /*
         EncryptContent ::= SEQUENCE {
         vid VID,
         randomNum BIT STRING }
         encryptedVID는 DER 인코딩된 EncryptContent 값을 공인인증기관의
         공개키로 암호화한 결과를 나타낸다.
         */

        var encryptContentobj = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            vidobj,
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + ctx.vidRandom)
        ]);

        var encrypteContent = asn1.toDer(encryptContentobj);
        var hex_en = forge.util.bytesToHex(encrypteContent);
        /* 30 4C 30 33 30 0D 06 09 60 86 48 01 65 03 04 02 01 05 00
                       30 0D 06096086480165030402010500
        A0 22 04 20 17 69 2C 8D D0 0E AD 33 79 1D E0 A6 4A 93 7C 60 79 96 34 C6 4A C5 6F A5 75 70 C0 E0 52 52
        AB 35 03 15 00 79 EA 75 68 A2 D3 77 66 04 E1 8B CD 3A 1B 1B 85 B7 DA 08 72  (78 byte) */

        /* SIGNGATE  는 caCert 사용하고 그외는 EncCert 사용 */
        var cacert = '';
        if(ctx.caname == "SIGNGATE" || ctx.caname == "SIGNKOREA"){
            cacert = forge.pki.certificateFromAsn1(ctx.genp.caProtEncCert);
        }
        else {
            cacert = forge.pki.certificateFromAsn1(ctx.genp.caCert);
        }


        /* sha1, pkcs1.5 */
        var eVID = cacert.publicKey.encrypt(encrypteContent.data, 'RSAES-PKCS1-V1_5');
        var hex_ev = forge.util.bytesToHex(eVID);
        /* 256 byte
         36 B9 D5 2B DD 14 F1 21 3D 14 50 4C 75 BC 02 0D 89 74 75 D6 0E C0 03 56 E9 FA 50 18
         29 6F DA 84 BB B0 B7 D5 BF 7B BF 1C 4B 5E EB E5 3C CA D5 B2 C2 15 44 93 E3 F7 2C DF
         72 19 DE 25 30 9A 47 AE 5F AA 3F 41 A7 D2 20 10 D8 5A B3 84 12 0A DB 9F 34 F1 7F D6
         94 DC B1 75 B8 8C A6 A5 BB 1E DD 44 62 BA B2 E3 88 C0 0B A3 E1 09 BF 20 42 81 91 31
         3C 4B 79 F8 F3 CC B6 0C 70 30 E1 52 F7 04 B0 31 27 EA AE 70 80 C8 57 E4 88 E9 29 7D
         2F 09 14 1A 21 4E FD 28 45 2D FC C7 17 0F 9C 1E BE DB 31 DB C5 4A F9 AD 9A F9 07 37
         9B E4 D1 C9 AF B8 75 B2 4A 0F 3F BC 57 19 5C B9 F8 03 17 1C C4 61 81 FA 66 F4 82 BB
         CB 19 62 F7 01 9C A3 48 F2 86 9F C5 B3 8A 0C E8 4A 07 7E 80 F5 39 3C 13 17 AE A5 0C
         61 33 79 45 68 F3 AA 6C 18 A7 01 47 70 BA A3 67 14 25 D5 B4 9C DA 9B 5A 8C C8 32 6E
         CD 60 FC D2
         */
        //var eVID = forge.util.decode64("XsackPX9a6SYppFSpwcqVZ1KMumrvZAzW/4ExAvnTXJE9PvXcY5KqaB+WuVJryne45Dvfp9BBrwUHTIlGJStlQetN43KDVTc/IIZgXGugosKxulQk9ukE6AwfhBJyTL5hDS3Vu+malj8RZ/KDCvnjfAadjQSsNKlFRsiXKMshN37TRKMmrPmJ++9YIKiWA1VvGlU1ZOY/pcxHsBJYfWMoQGHT/ciKaEA6GSQmN1H47sjf4IJhCyx9ZXaeoj2FpR4DCX9sioKa9+aigxmr7A8uQZhhhP9aFjEtOm6lfFZuf5GpUMqNpi9F8HK2p+D3OzKjDjV072j2SGIQCDRSNfSsA==");

        /* yessign km_cert serial : 4189973 */
        // Encrypted VID 1.2.410.200004.10.1.1.2
        /*
         EncryptedVID ::= SEQUENCE {
         version [0] INTEGER DEFAULT 0,
         vidHashAlg [1] VIDHashAlgorithm OPTIONAL,
         vidEncAlg [2] VIDEncryptionAlgorithm,
         certID [3] IssuerAndSerialNumber,
         encryptedVID [4] OCTET STRING }
         */
        var EncryptedVID = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            /* version [0] */
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes())
            ]),
            /* voidHashAlg [1] */
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("2.16.840.1.101.3.4.2.1").getBytes()),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                ]),
            ]),
            /* vidEncAlg [2] */
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.2.840.113549.1.1.1").getBytes()),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
                ]),
            ]),
            /* certID [3] */
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    forge.pki.distinguishedNameToAsn1(cacert.issuer),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
                        forge.util.hexToBytes(cacert.serialNumber))
                ])
            ]),
            /* encryptedVID [4] */
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, eVID)
            ])
        ]);

        var regInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer("1.2.410.200004.10.1.1.2").getBytes()),
                EncryptedVID
            ])
        ]);

        var body = asn1.create(asn1.Class.CONTEXT_SPECIFIC, ctx.msgTag, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    certReq,
                    popo,
                    regInfo
                ])
            ])
        ]);

        return body;
    };

    cmp.makeconf = function(ctx) {

        //obj.value[0] = header;

        var body = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 19, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
        ]);

        return body;
    };


    cmp.makePKIMsg = function(ctx, header, body, extraCerts) {
        // PKIMessage
        var obj = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            header,
            body
        ]);

        // protection 생성
        var protection = "";
        if (ctx.reqCMD == "issue" || ctx.reqCMD == "reissue")
            protection = cmp.etri_des_mac(obj, ctx.authKey);
        else if (ctx.reqCMD == 'renew') {
            protection = cmp.signature(obj, ctx.privateKey);
        }

        obj.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + protection)
        ]));

        if(extraCerts && extraCerts != ''){
            obj.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
                extraCerts
            ]));
        }

        return obj;
    };

    var xmlhttpRequest = function (url, postdata){
        try{
            // Mozilla/Safari
            var xmlhttp=null;
            if (window.XMLHttpRequest) {
                xmlhttp = new window.XMLHttpRequest();
            }else if (window.ActiveXObject) {
                // IE
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                if(xmlhttp == null) {
                    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
                }
            }

            xmlhttp.open("POST", url, false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            xmlhttp.send(postdata);

            if(xmlhttp.status == 200){
                return xmlhttp.responseText.trim();
            }else if(xmlhttp.status == 500){
                return new Error("함수 처리 오류 : " + xmlhttp.responseText);
            }else{
                throw xmlhttp.status;
            }
        }catch(e){
        	console.log(e);
        	throw e;
        }
    };

	var jsonAsyncRequest = function (getUrl, sendData, callback){

		try {
			J.ajax({
			    type: 'POST',
			    url: getUrl,
			    data: sendData,
			    dataType: 'text',
			    success: function(responseData) {
			    	callback(responseData.trim());
			    },
			    error: function (responseData, textStatus, errorThrown) {
			    	console.log(errorThrown);
			    	if(INI_ALERT){
			    		INI_ALERT(errorThrown, 'ERROR');	
			    	}else{
			    		alert(errorThrown);
			    	}
			    }
			});
		}catch (e){
			throw e;
		}
		
	};   

//    cmp.sendtoGW = function(ctx) {
//
//        var _header = cmp.makeHeader(ctx);
//        var _body = cmp.makegenm(ctx);
//        var _pkimsg  = cmp.makePKIMsg(ctx, genm_header, genm_body, renew_extraCerts);
//        var _der = asn1.toDer(_pkimsg);
//        // base64
//        var b64_pkimsg = forge.util.encode64(_der.data);
//        // send
//        var postdata = "type=0&msg="+encodeURIComponent(b64_pkimsg)+"&ip="+encodeURIComponent(ctx.caip)+"&port=" + ctx.caport;
//        var b64_rep = xmlhttpRequest(ctx.cmp_gw_url, postdata);
//        // receive
//        var rep_der = forge.util.decode64(b64_rep);
//        var rep_obj = forge.asn1.fromDer(rep_der, true);
//
//        return rep_obj;
//    };

    /*

     */
    cmp.requestCert = function(requestOpt, callback){
        var ctx = {};

        ctx.reqCMD = requestOpt.reqCMD || 'issue';

        // opt 를 ctx 에 복사 하는 과정에서
        // 전체를 루프 돌리면서 복사 하다보면.... ctx 의 값이 왜곡될 여지가 있어... 보안취약이 될 수도 있으므로 반드시 명시적으로 복사하자...
        if(ctx.reqCMD == "issue" || ctx.reqCMD == "reissue"){
            ctx.refCode = requestOpt.refCode;
            ctx.authKey = requestOpt.authKey;
        }else if(ctx.reqCMD == "renew"){

            if(requestOpt.signCert){
                ctx.signCert = requestOpt.signCert;
            }
            else if(requestOpt.signCertDer){
                ctx.signCert = forge.pki.certificateFromDer(requestOpt.signCertDer);
            }
            else if(requestOpt.signCertPem){
                ctx.signCert = forge.pki.certificateFromPem(requestOpt.signCertPem);
            }
            else {
                // error : opt must have signCert...
            }

            if(requestOpt.signCertDer){
                ctx.signCertDer = requestOpt.signCertDer;
            }
            else {
                var signCertObj = forge.pki.certificateToAsn1(ctx.signCert);
                ctx.signCertDer = forge.asn1.toDer(signCertObj);
            }

            var intSerial = parseInt(ctx.signCert.serialNumber, 16);
            ctx.oldSerial = intSerial.toString();
            ctx.hexaSerial = ctx.signCert.serialNumber;

            // 개인키 pem 태그 붙이기
			if(requestOpt.signPriPem.toString().indexOf('-----BEGIN ENCRYPTED PRIVATE KEY-----')<0){ // pem형식으로 Tag추가
				requestOpt.signPriPem = '-----BEGIN ENCRYPTED PRIVATE KEY-----\r\n' + requestOpt.signPriPem + '\r\n-----END ENCRYPTED PRIVATE KEY-----';
			}
            
            var p8Der = forge.pki.encryptedPrivateKeyFromPem(requestOpt.signPriPem);
            var decprivateKeyInfo = forge.pki.decryptPrivateKeyInfo( p8Der, requestOpt.passKey);
            ctx.privateKey = forge.pki.privateKeyFromAsn1(decprivateKeyInfo);
        }
        ctx.cmp_gw_url = requestOpt.cmp_gw_url;
        ctx.cmp_gw_url2 = requestOpt.cmp_gw_url2;

        ctx.caname = requestOpt.caname;
        /* #define KISA_IDN "1234561234567" */
        ctx.idn = "1234561234567";
        //ctx.idn = idn.replace(/[^0-9]/g,'');
        ctx.caip = requestOpt.caip;
        ctx.caport = requestOpt.caport;

        var renew_extraCerts = '';
        if(ctx.reqCMD == "renew"){
            renew_extraCerts = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                forge.asn1.fromDer(ctx.signCertDer, true)
            ]);
        }


        // make genm
        ctx.msgType = "genm";

        var genm_header = cmp.makeHeader(ctx);
        var genm_body = cmp.makegenm(ctx);
        var genm = cmp.makePKIMsg(ctx, genm_header, genm_body, renew_extraCerts);
        var genm_der = asn1.toDer(genm);
        // genm base64
        var b64_genm = forge.util.encode64(genm_der.data);
        // send genm
        var postdata = "type=0&msg="+encodeURIComponent(b64_genm)+"&ip="+encodeURIComponent(ctx.caip)+"&port=" + ctx.caport;
        
        
        function genmCallback(genp_rep){
        	
        	// callback 별도의 에러 처리
        	if(!genp_rep || (genp_rep.trim()<0) || (0<genp_rep.indexOf("[ERROR"))){
        		INI_ALERT("인증서 발급증 오류가 발생 하였습니다.<br>"+genp_rep , 'ERROR');
        		GINI_LoadingIndicatorStop()
        	}
        	
        	function irKurCallback(rep_rep){
        		
        		// callback 별도의 에러 처리
            	if(!rep_rep || (rep_rep.trim()<0) || (0<rep_rep.indexOf("[ERROR"))){
            		INI_ALERT("인증서 발급증 오류가 발생 하였습니다.<br>"+rep_rep , 'ERROR');
            		GINI_LoadingIndicatorStop()
            	}
            	
        		// receive ip
                var rep_der = forge.util.decode64(rep_rep);
                var rep_obj = forge.asn1.fromDer(rep_der, true);
                var rep = cmp.ipFromAsn1(rep_obj);
                var status = -1;
                var statusString = " ";

                if(rep.capture.PKIStatusInfo_Status !== undefined){
                    status = asn1.derToInteger(rep.capture.PKIStatusInfo_Status)
                }
                if(rep.capture.PKIStatusInfo_statusString !== undefined){
                    statusString = rep.capture.PKIStatusInfo_statusString;
                    var hex_Str = forge.util.bytesToHex(rep.capture.PKIStatusInfo_statusString);
                }


                if(status != 0){
                    issued.status = status;
                    issued.statusString = decodeURIComponent(encodeURIComponent(statusString));

                    callback(issued);
                } else {
                    issued.status = status;
                    issued.statusString = statusString;
                    //issued.passKey  = requestOpt.passKey || 'iniCMP12!@hello';
                    issued.passKey  = requestOpt.passNewKey || 'iniCMP12!@hello';
                    
                    // 발급된 인증서
                    issued.signCert = forge.pki.certificateFromAsn1(rep.userCert);
                    issued.signCertDer = forge.asn1.toDer(rep.userCert);
                    issued.signCertPem = forge.pki.certificateToPem(issued.signCert);

                    // 생성된 개인키
                    var privKey = ctx.rsakeys.privateKey;
                    privKey.vidRandom = ctx.vidRandom;
                    issued.signPriPem = forge.pki.encryptRsaPrivateKey(privKey, issued.passKey, {legacy: false, algorithm:'seed'});
                }
                callback(issued);
        	};
        	
        	// receive genp
            var genp_der = forge.util.decode64(genp_rep);
            var genp_obj = forge.asn1.fromDer(genp_der, true);

            //var genp_obj = cmp.sendtoGW(ctx);
            var genp = cmp.genpFromAsn1(genp_obj);
            ctx.genp = genp;

            var issued = {
                status: -1,
                statusString: ''
            };

            if(genp.capture.PKIStatusInfo_Status !== undefined){
                issued.status = asn1.derToInteger(genp.capture.PKIStatusInfo_Status);
                if(issued.status != 0) {
                    issued.statusString =  genp.capture.PKIStatusInfo_statusString;

                    callback(issued);
                }
            }

            // IR or KUR
            if(ctx.reqCMD == "issue" || ctx.reqCMD == "reissue"){
                if(ctx.caname == "SIGNGATE" && ctx.reqCMD == "reissue"){
                    ctx.msgType = "krr"
                    ctx.msgTag = 9;
                }
                else {
                    ctx.msgType = "ir";
                    ctx.msgTag = 0;
                }
            }
            else if(ctx.reqCMD == "renew"){
                ctx.msgType = "kur";
                ctx.msgTag = 7;
            }

            // rsa 키생성
            ctx.rsakeys = forge.pki.rsa.generateKeyPair(2048);
            //ctx.rsakeys = _KeyPairRepository.getKeyPair();
            // vidRandom 생성
            ctx.vidRandom = forge.random.getBytes(20);
            // vidRandom hardcode test 를 위해
            //ctx.vidRandom = forge.util.hexToBytes("66C5D5483BC7DC7902650B40BCCCCEEA6B20FA8B");

            var req_header = cmp.makeHeader(ctx);
            var req_body = cmp.makeCertReqMsg(ctx);
            var req = cmp.makePKIMsg(ctx, req_header, req_body,renew_extraCerts);
            var req_der = asn1.toDer(req);
            var req_der_hex = req_der.toHex();
            var b64_req = forge.util.encode64(req_der.data);

            // ir 값을 외부에서 생성해서 테스트 하고자 하는 경우 사용
            //b64_ir = "MIIGLTCBngIBAaQCMACkAjAAoBEYDzIwMTYwNTIyMDgyMDQ1WqE0MDIGCSqGSIb2fQdCDTAlBAphYWFhYWJiYmJiMAkGBSsOAwIaBQACAQIwCQYFKw4DAgoFAKIIBAY0MzE5NDOjFgQUcPp9g8NFHxSa7/AoPhOMXbsFC5SkEgQQtBs9GQ9xZnck4c0FtYubKaUSBBBAgg1XyXBjhX2azvPYxUQ1oIIFezCCBXcwggVzMIIBLQIBADCCASamggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC60duYClU+1tPJ4BHb5scziD3uZCki3l3gR4rHqIZbTKk0KbbxbULarAcX4doZ5h4LRBl0WaPi8ePtPIWDDqTPGKaezsR1a4dFTV0CKyzpbGkHc6+Re1DaNv1w9b77n7Kr9mep1JZkI0DTnCGF5E9fZ+fDyEx/Ty9d6Uaxvca/PZOAqwC8joM1DiOqPp9qtxyYlHwr0W1qE3Q25ZH/C9bnj61SJCqUozGeovFk2daiA+hW8cUXf6MJ3RqsQRsuk+WdM7K3uNPejZ4U7rqc+L3RjWdGP12Cmh9X+Rg7Dq5DKWjALp80oAgBnhhwXzwPM3gtaAU2fuKXv6SUGIKcg9PfAgMBAAGhggKVoIIBfTBVMDwGCSqGSIb2fQdCDTAvBBBbRFL6WsPGjUb+R8qewB07MAkGBSsOAwIaBQACAgQAMAwGCCsGAQUFCAECBQADFQBb9smSqxRw+TmfgMi44BZQbEVtDTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALrR25gKVT7W08ngEdvmxzOIPe5kKSLeXeBHiseohltMqTQptvFtQtqsBxfh2hnmHgtEGXRZo+Lx4+08hYMOpM8Ypp7OxHVrh0VNXQIrLOlsaQdzr5F7UNo2/XD1vvufsqv2Z6nUlmQjQNOcIYXkT19n58PITH9PL13pRrG9xr89k4CrALyOgzUOI6o+n2q3HJiUfCvRbWoTdDblkf8L1uePrVIkKpSjMZ6i8WTZ1qID6FbxxRd/owndGqxBGy6T5Z0zsre4096NnhTuupz4vdGNZ0Y/XYKaH1f5GDsOrkMpaMAunzSgCAGeGHBfPA8zeC1oBTZ+4pe/pJQYgpyD098CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAgRmPR+K9ByNNE576Up34dO0phlBsqIYAi1IB9HN7VKZQJRYMmb0lFq/i3Rz3YGavf//frbtcjniPvqnt1nBLcf/+zBiuH5GTGoSnEj37CZzjtknhozEjFxYSbsSju0MmyW7Spf8tv2LDB914RcAWxEduY8lJjmfmmVjecSE/rwH2/Y1tYdc1v5wKDMOS2ZaDnYoY7BfSDQDMouKm8QPR74G9RjzEpX3fQrdyDa/NuA/ms53QTBZIY+Iz2HtcZJ4h/Hzjoy8UFA0KwRrCSLh3LkH6oultwiCKyGrYkAi12Qh2f7LbFK/3Dz0/B7Vm7RRZZi1LO9cxfC7vS6wWu7/RlTCCAaUwggGhBgoqgxqMmkQKAQECMIIBkaADAgEAoQ8wDQYJYIZIAWUDBAIBBQCiDzANBgkqhkiG9w0BAQEFAKNgMF4wVzELMAkGA1UEBhMCa3IxEDAOBgNVBAoMB3llc3NpZ24xFTATBgNVBAsMDEFjY3JlZGl0ZWRDQTEfMB0GA1UEAwwWeWVzc2lnbkNBLVRlc3QgQ2xhc3MgMgIDP+8VpIIBBASCAQA47BkO4LmdP+C7c1fOJ5cCxpw35U084p3FoSv8sPoxn2QWQdpVhsJK5J4bRErK8+sRbfts2/RY6GIl0vr5BXG/RdWNOdGYDk0gvWg++w7KOIMEtY2+VmLmtCTe/XdYbrfCYCF0RHWzb+EgA1a1RpyQllIM68sD1brcv1I6ZepD/FSNcZ66PbnZVkvnDV1pPK02mpyDj2HyuHb9vyV+op+dvlievvDrK2XfklHsy19W0lC9sdG9KQZY0YBDnl/6qn4O7dRyX9MxiKg6q+lqBwE6Xli6/w0hkR6E1XeBKeNLzZh0of1InsPzlS8g5GQg5JTRVIFEpHlkZzIEPNJIhD53oAsDCQCeSQvd8+nevA==";
            // send ir
            //한개의 connection 에 genm, ir 을 모두 날려서 ip 를 받고자 하는 경우 아래 3줄을 풀고, 아래 2줄을 코멘트 처리 한다
            // 금결원 버그로 보이는데, genm , ir 를 각각 다른 connection 으로 날리는 경우,
            // genm 의 참조번호를 null 로 파싱하면서.. 한번 잘못 lock 이 걸리면 이후 모든 요청이 실패하는 문제가 생긴다
            // 이런경우, 아래와 같이 genm, genp 를 한개의 connect 에 동시에 날릴 수 있도록 하거나, 금결원 서버 재시작 하면 된다.
            // 중계 서버 모듈을 업데이트 하여, genm, ir 를 근본적으로 하나의 connect 로 처리할 수 있도록 개발하는게 좋겠다.
            // connect 를 세션에 넣고.. genm, ir, conf 까지 같은 connection 을 사용할 수 있도록 한다.
            // 이때 connection 을 끊지 않는 경우 금결원에서 또 lock 이 걸릴 수 있을 것 같은데..............
            // session 에 저장된 connection 을 갖고와서 GC 해주는 모듈이 별도 필요 할 수 있겠다.

            ctx.msgType = "conf";
            var conf_header = cmp.makeHeader(ctx);
            var conf_body = cmp.makeconf(ctx);
            var conf = cmp.makePKIMsg(ctx, conf_header, conf_body,renew_extraCerts);
            var conf_der = asn1.toDer(conf);
            var b64_conf = forge.util.encode64(conf_der.data);
            var postdata = "type=0&msg="+encodeURIComponent(b64_genm)
            				+"&msg2="+encodeURIComponent(b64_req)
            				+"&msg3="+encodeURIComponent(b64_conf)
            				+"&ip="+ctx.caip+"&port=" + ctx.caport;
            
            //var cmp_gw_url2 = 'http://127.0.0.1:8080/initech/html5/approve/CMP_GW3.jsp';
            
//            var rep_rep = xmlhttpRequest(ctx.cmp_gw_url2, postdata);
//            irKurCallback(rep_rep);
            jsonAsyncRequest(ctx.cmp_gw_url2, postdata, irKurCallback);
        };
        
//        var genp_rep = xmlhttpRequest(ctx.cmp_gw_url, postdata);
//        genmCallback(genp_rep);
        jsonAsyncRequest(ctx.cmp_gw_url, postdata, genmCallback);
    };

}; // end module implementation

/* ########## Begin module wrapper ########## */
	var name = 'cmpasn1';
	if (typeof define !== 'function') {
		// NodeJS -> AMD
		if (typeof module === 'object' && module.exports) {
			var nodeJS = true;
			define = function(ids, factory) {
				factory(require, module);
			};
		} else {
			// <script>
			if (typeof forge === 'undefined') {
				forge = {};
			}
			return initModule(forge);
		}
	}
	// AMD
	var deps;
	var defineFunc = function(require, module) {
		module.exports = function(forge) {
			var mods = deps.map(function(dep) {
				return require(dep);
			}).concat(initModule);
			// handle circular dependencies
			forge = forge || {};
			forge.defined = forge.defined || {};
			if (forge.defined[name]) {
				return forge[name];
			}
			forge.defined[name] = true;
			for (var i = 0; i < mods.length; ++i) {
				mods[i](forge);
			}
			return forge[name];
		};
	};
	
	var tmpDefine = define;
	define = function(ids, factory) {
		deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
		if (nodeJS) {
			delete define;
			return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
		}
		define = tmpDefine;
		return define.apply(null, Array.prototype.slice.call(arguments, 0));
	};
	define([ 
	         'require', 
	         'module', 
	         './asn1', 
	         './util', 
	         './rsa', 
	         './x509', 
	         './desmac'
	         ], function() {
		defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
	});
})();
