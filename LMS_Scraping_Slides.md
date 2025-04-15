# LMS Scraping Project Slide Deck

## Slide 1: Title Slide
**Title:** LMS Scraping Module Development
**Subtitle:** Automating Data Extraction from Chungbuk National University LMS
**Date:** April 15, 2025

---

## Slide 2: Project Overview
**Title:** Project Overview

- **Objective:** Develop a module to scrape notice list data from Chungbuk National University LMS
- **Target Data:** Announcements/notices from the LMS platform
- **Technology Stack:** JavaScript, iSAS framework, Firecrawl MCP
- **Development Approach:** Template-based module creation with custom business logic

---

## Slide 3: Development Workflow
**Title:** Development Workflow

1. Module Creation (Template-based)
2. Website Analysis (Browser-based)
3. HTML Structure Extraction (Firecrawl MCP)
4. Business Logic Implementation
5. Testing & Documentation

---

## Slide 4: Step 1 - Module Creation
**Title:** Step 1: Module Creation

- **Template Used:** `module_template.js`
- **Prompt Used:** Initial module creation instructions
- **Replacements Made:**
  - Website Name → LMS
  - Module Version → 25.04.15.1
  - Class Name → NOTICE
  - Job Name → NOTICE_LIST
  - Host URL → https://lms.chungbuk.ac.kr

---

## Slide 5: Step 2 - Website Analysis
**Title:** Step 2: Website Analysis

- **Approach:** Browser-based exploration
- **Process:**
  1. Launched browser to LMS login page
  2. Authenticated with test credentials
  3. Navigated to announcements section
  4. Analyzed page structure and network requests
- **Findings:**
  - Login form structure and required parameters
  - Announcements page layout and data structure
  - Network request patterns

---

## Slide 6: Step 3 - HTML Structure Extraction
**Title:** Step 3: HTML Structure Extraction

- **Tool Used:** Firecrawl MCP
- **Function:** `firecrawl_scrape`
- **Target URL:** https://lms.chungbuk.ac.kr/mod/ubboard/view.php?id=17
- **Extraction Parameters:**
  - Format: HTML
  - Main Content Only: True
  - Wait Time: 5000ms
- **Output:** Saved HTML structure to reference file

---

## Slide 7: Templates Used
**Title:** Templates Used

- **Module Template (`module_template.js`)**
  - Provides the overall structure and framework for the module
  - Contains standard functions, error handling, and module architecture
  - Ensures compatibility with the iSAS framework
  - Reduces development time by eliminating boilerplate code

- **Workflow Template (`workflow_template.txt`)**
  - Provides patterns for implementing authentication and navigation logic
  - Demonstrates proper HTTP request flow and session management
  - Includes standardized error handling for different scenarios
  - Shows the correct sequence of GET and POST requests

- **Data Extraction Template (`data_extraction_template.txt`)**
  - Provides patterns for extracting and cleaning data from HTML
  - Shows how to structure the output data
  - Demonstrates techniques for parsing HTML content
  - Includes data cleaning and normalization methods

---

## Slide 8: Why These Templates?
**Title:** Why These Templates?

- **Standardization**
  - Ensures consistent structure across all scraping modules
  - Maintains compatibility with existing systems
  - Follows proven patterns for web scraping

- **Efficiency**
  - Reduces development time by reusing established patterns
  - Eliminates the need to reinvent common solutions
  - Allows focus on site-specific logic rather than boilerplate

- **Reliability**
  - Uses proven techniques for authentication and data extraction
  - Includes robust error handling mechanisms
  - Ensures consistent output format

- **Maintainability**
  - Makes it easier to update as websites change
  - Provides clear separation of concerns
  - Facilitates code reuse across different scraping projects

---

## Slide 9: HTML Structure Analysis
**Title:** HTML Structure Analysis

- **Key Elements Identified:**
  - Notice list table structure
  - Pagination information
  - Notice attributes:
    - Number/ID
    - Title
    - URL
    - Date
    - View count
  - Total count and page information

---

## Slide 8: Step 4 - Business Logic Implementation
**Title:** Step 4: Business Logic Implementation

- **Template Used:** `workflow_template.txt`
- **Reference:** `iSASTypes.js` for error handling
- **Key Components Implemented:**
  1. Authentication logic
  2. Navigation to announcements page
  3. HTML parsing and data extraction
  4. Error handling and result formatting

---

## Slide 9: Authentication Implementation
**Title:** Authentication Implementation

```javascript
// Login process implementation
this.url = "/login/index.php";
if (!httpRequest.get(this.host + this.url)) {
    this.log("Failed to access login page");
    this.setError(E_IBX_FAILTOGETPAGE);
    return E_IBX_FAILTOGETPAGE;
}

// Prepare form data for login
this.postData = "";
this.postData += "username=" + httpRequest.URLEncode(username, "UTF-8");
this.postData += "&password=" + httpRequest.URLEncode(password, "UTF-8");
this.postData += "&logintoken=" + this.extractLoginToken(ResultStr);

// Send POST request to login
if (!httpRequest.post(this.host + this.url, this.postData, "application/x-www-form-urlencoded")) {
    this.log("Failed to submit login form");
    this.setError(E_IBX_FAILTOGETPAGE);
    return E_IBX_FAILTOGETPAGE;
}
```

---

## Slide 10: Data Extraction Implementation
**Title:** Data Extraction Implementation

```javascript
// Extract notice list data
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

// Extract notice items
var noticeRows = html.match(/<tr class="">([\s\S]*?)<\/tr>/g);
if (noticeRows) {
    for (var i = 0; i < noticeRows.length; i++) {
        // Extract notice details...
        result.items.push({
            Number: noticeNum,
            Title: title,
            URL: url,
            Date: date,
            ViewCount: viewCount
        });
    }
}
```

---

## Slide 11: Output Format
**Title:** Output Format

```json
{
  "ErrorCode": "00000000",
  "ErrorMessage": "",
  "Result": {
    "TotalCount": 31,
    "CurrentPage": 1,
    "TotalPages": 3,
    "Notices": [
      {
        "Number": "공지",
        "Title": "AI 기반 개인 맞춤형 학습지원시스템 안내",
        "URL": "https://lms.chungbuk.ac.kr/mod/ubboard/article.php?...",
        "Date": "2025-04-02",
        "ViewCount": "13342"
      },
      // Additional notice items...
    ]
  }
}
```

---

## Slide 12: Error Handling
**Title:** Error Handling

- **Error Codes Used:**
  - E_IBX_FAILTOGETPAGE: Failed to access a page
  - E_IBX_KEY_ACCOUNT_PASSWORD_2_INVALID: Invalid login credentials
  - Other standard error codes from iSASTypes.js

- **Error Handling Approach:**
  - Specific error codes for different failure scenarios
  - Detailed logging for troubleshooting
  - Graceful failure with informative error messages

---

## Slide 13: Testing & Validation
**Title:** Testing & Validation

- **Test Scenarios:**
  1. Successful login and data extraction
  2. Invalid credentials handling
  3. Network failure handling
  4. Empty result handling

- **Validation Methods:**
  - Manual verification of extracted data
  - Comparison with web interface data
  - Error case testing

---

## Slide 14: Challenges & Solutions
**Title:** Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Dynamic login token | Implemented regex extraction from login page |
| HTML structure parsing | Created robust regex patterns for data extraction |
| Error handling | Leveraged iSASTypes.js error code system |
| Authentication flow | Implemented step-by-step login process with validation |

---

## Slide 15: Future Improvements
**Title:** Future Improvements

- **Potential Enhancements:**
  - Support for pagination to retrieve all notices
  - Detailed notice content extraction
  - File attachment download capability
  - Caching mechanism for improved performance
  - More robust HTML parsing using DOM methods

---

## Slide 16: Conclusion
**Title:** Conclusion

- **Achievements:**
  - Successfully created LMS scraping module
  - Implemented robust authentication and data extraction
  - Structured output format for easy integration
  - Comprehensive error handling

- **Next Steps:**
  - Integration with larger systems
  - Ongoing maintenance for website structure changes
  - Feature enhancements based on user feedback

---

## Slide 17: Q&A
**Title:** Questions & Answers

Thank you for your attention!