# LMS Scraping Workflow

## Workflow Overview

This document outlines the workflow used to create the LMS (Learning Management System) scraping module for Chungbuk National University.

## Step 1: Module Creation
- **Template Used**: `template/module_template.js`
- **Prompt Used**: `LMS prompt/prompt1.txt`
- **Action**: Created `LMS.js` by replacing placeholders in the template:
  - `__WEBSITE_NAME__` → LMS
  - `__MODULE_VERSION__` → 25.04.15.1
  - `__CLASS_NAME__` → NOTICE
  - `__JOB_NAME__` → NOTICE_LIST
  - `__HOST_URL__` → https://lms.chungbuk.ac.kr

## Step 2: Website Analysis
- **Tool Used**: Browser Action
- **Prompt Used**: `LMS prompt/prompt2.txt`
- **Actions**:
  1. Launched browser to LMS login page
  2. Logged in with provided credentials
  3. Navigated to announcements section
  4. Analyzed page structure and network requests

## Step 3: HTML Structure Extraction
- **Tool Used**: Firecrawl MCP
- **MCP Function**: `firecrawl_scrape`
- **Parameters**:
  ```json
  {
    "url": "https://lms.chungbuk.ac.kr/mod/ubboard/view.php?id=17",
    "formats": ["html"],
    "onlyMainContent": true,
    "waitFor": 5000
  }
  ```
- **Output**: Saved HTML structure to `html.txt`

## Step 4: Business Logic Implementation
- **Template Used**: `template/workflow_template.txt`
- **Reference File**: `iSASTypes.js` (for error handling)
- **Prompt Used**: `LMS prompt/prompt3.txt`
- **Actions**:
  1. Implemented login functionality
  2. Added navigation to announcements page
  3. Created HTML parsing logic
  4. Implemented error handling

## Step 5: Documentation
- Created README.md to document the workflow process

## Required Files
- **Templates**:
  - `template/module_template.js` - Base structure for the module
  - `template/workflow_template.txt` - Pattern for business logic implementation
  
- **Prompts**:
  - `LMS prompt/prompt1.txt` - Initial module creation instructions
  - `LMS prompt/prompt2.txt` - Website analysis instructions
  - `LMS prompt/prompt3.txt` - Business logic implementation instructions

- **MCP Tools**:
  - Firecrawl MCP - For web scraping and HTML extraction

- **Reference Files**:
  - `iSASTypes.js` - For error code definitions and handling
  - `html.txt` - Extracted HTML structure for reference

## Input/Output Format
- **Input**: Username and password for LMS authentication
- **Output**: Structured notice list data including titles, dates, and URLs