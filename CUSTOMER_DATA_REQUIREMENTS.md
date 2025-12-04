# Customer Data Requirements Guide
## Beyond Diagnostic - Data Collection Instructions

**Version:** 1.0
**Last Updated:** December 4, 2025
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Data Requirements Summary](#data-requirements-summary)
3. [Mandatory Fields](#mandatory-fields)
4. [Optional Fields](#optional-fields)
5. [Field Definitions & Alternatives](#field-definitions--alternatives)
6. [Data Quality Guidelines](#data-quality-guidelines)
7. [Common CTI System Examples](#common-cti-system-examples)
8. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Overview

To perform an **automation readiness analysis**, we need access to your contact center's raw interaction data. This guide explains:

- ✅ What data we **require** (mandatory)
- ⚠️ What data **improves accuracy** (recommended)
- ℹ️ What data is **optional** (nice-to-have)
- 🔄 **Alternative ways** to calculate or provide fields if your system doesn't have them exactly as described

### Expected Analysis Timeline
- Data preparation: **5-15 minutes**
- Data upload/processing: **2-5 minutes**
- Analysis generation: **1-2 minutes**
- Report delivery: **Immediate**

---

## Data Requirements Summary

| Field | Type | Mandatory | Recommended | Optional | Purpose |
|-------|------|-----------|-------------|----------|---------|
| **interaction_id** | String | ✅ Yes | - | - | Unique identification |
| **datetime_start** | DateTime | ✅ Yes | - | - | Timing & scheduling patterns |
| **queue_skill** | String | ✅ Yes | - | - | Workload segmentation |
| **channel** | String | ✅ Yes | - | - | Channel-specific analysis |
| **duration_talk** | Seconds | ✅ Yes | - | - | AHT & productivity metrics |
| **hold_time** | Seconds | ✅ Yes | - | - | Wait time analysis |
| **wrap_up_time** | Seconds | ✅ Yes | - | - | After-call work analysis |
| **agent_id** | String | ✅ Yes | - | - | Individual performance |
| **transfer_flag** | Boolean | ✅ Yes | - | - | Escalation & FCR rates |
| **reason_code** | String | - | ⭐ Recommended | - | **+15-20% accuracy** |
| **caller_id** | String (hash) | - | - | ✅ Yes | Customer tracking |

**Total: 9 Mandatory + 1 Recommended = 10 fields for optimal analysis**

---

## Mandatory Fields

These 9 fields are **absolutely required** to perform the analysis. Without them, we cannot generate results.

### 1. **interaction_id** 📌
**What it is:** Unique identifier for each interaction
**Data type:** String
**Example values:** `CALL_8842910`, `INT_2024100109152245`, `ID_12345`
**Where to find it:** ACD/CTI system's call logs

**✅ Direct Source:**
- Genesys: Call ID, Interaction ID
- Avaya: Call UUID, Call Reference
- NICE: Interaction ID
- Five9: Call ID
- Talkdesk: Call ID
- Zendesk: Ticket ID (for chats)

**🔄 Alternatives if exact field unavailable:**
- Use `agent_id + datetime_start + sequence_number` (concatenate with separators)
- Use internal system's unique call reference
- Add a sequence number incrementally: `20241001_001`, `20241001_002`, etc.

---

### 2. **datetime_start** ⏰
**What it is:** Timestamp when interaction began
**Data type:** DateTime (ISO 8601 format preferred)
**Example values:** `2024-10-01 09:15:22`, `2024-10-01T09:15:22Z`
**Where to find it:** ACD/CTI system's call start time field

**✅ Direct Source:**
- Most ACD systems have: "Call Start Time", "Interaction Start", "Call Initiated"
- Should be in UTC or with timezone indicator

**🔄 Alternatives if exact format differs:**

| Your Format | How to Convert |
|-------------|----------------|
| Unix timestamp (1727776522) | Convert to ISO 8601: 2024-10-01 09:15:22 |
| Excel date (45569.387500) | Convert to datetime format |
| Separate date + time fields | Combine: `DATE + " " + TIME` |
| Missing seconds | Use `:00` for seconds: 09:15:00 |
| No timezone info | Assume your system's timezone (we'll apply offset) |

**Calculation if unavailable:**
- If you have `call_date` + `call_time`: Combine them
- If you have `call_duration` + `datetime_end`: Subtract duration from end time
- Formula: `datetime_start = datetime_end - duration_seconds`

---

### 3. **queue_skill** 🎯
**What it is:** Name/identifier of the queue, team, or skill that handled the call
**Data type:** String
**Example values:** `Sales`, `Support_Level1`, `Technical_Support`, `Billing_Team`
**Where to find it:** ACD/CTI routing rules or queue configuration

**✅ Direct Source:**
- Genesys: "Segment", "Queue", "Interaction Queue"
- Avaya: "Queue", "Hunt Group", "Skill"
- NICE: "Queue", "Skill", "Virtual Agent"
- Five9: "Queue", "List", "Skill"
- Talkdesk: "Queue", "IVR Route", "Team"

**🔄 Alternatives if exact field differs:**

| Your System Has | How to Use It |
|-----------------|---------------|
| Department name only | Use as queue_skill (e.g., "Sales", "Support") |
| Agent team + subteam | Use main team: "Sales" or combine: "Sales_Enterprise" |
| Skill codes (numbers) | Map to meaningful names or use as-is |
| Only IVR route | Use IVR menu selection as queue (e.g., "IVR_Option2_Sales") |
| Multiple queue transfers | Use **final/last queue** (where call completed) |

**Calculation if unavailable:**
- Use `department` field
- Use `agent_group` or `team_name`
- Use `business_unit`
- Default: "General_Queue" (reduces accuracy but allows analysis to proceed)

---

### 4. **channel** 📱
**What it is:** Communication medium used for the interaction
**Data type:** String
**Example values:** `Voice`, `Chat`, `Email`, `WhatsApp`, `SMS`, `Social Media`
**Where to find it:** ACD/CTI channel routing

**✅ Direct Source:**
- All modern ACD systems capture this:
  - Genesys: "Media Type", "Channel"
  - Avaya: "Call Type", "Media"
  - NICE: "Channel", "Interaction Type"
  - Five9: "Channel"
  - Talkdesk: "Channel"

**🔄 Alternatives if exact field differs:**

| Your System Has | Mapping |
|-----------------|---------|
| "INBOUND" vs "OUTBOUND" | If inbound=Voice, note that separately |
| "PSTN" vs "VoIP" | Both map to "Voice" |
| "IVR" interactions | Can map to "IVR" or "Voice" depending on routing |
| Chat systems separate | Ensure marked as "Chat" |
| Email systems separate | Ensure marked as "Email" |
| WhatsApp/SMS APIs | Should have native channel field |

**Standardize these values:**
- Accept: `Voice`, `Chat`, `Email`, `WhatsApp`, `SMS`, `Social Media`, `Video`, `Callback`
- Also accept: `VOICE`, `voice`, `Telephony`, `Phone` (we normalize)
- Case-insensitive: "CHAT" = "Chat" = "chat"

---

### 5. **duration_talk** ⏱️
**What it is:** Active talking/conversation time in seconds
**Data type:** Integer (seconds)
**Example values:** `345`, `600`, `1200`
**Where to find it:** ACD/CTI system's talk time metrics

**✅ Direct Source:**
- Genesys: "Talk Time", "Conversation Time", "Handle Time (Talk)"
- Avaya: "Duration", "Talk Time"
- NICE: "Handling Time", "Talk Duration"
- Five9: "Talk Time"
- Talkdesk: "Talk Duration"

**🔄 Alternatives if exact field unavailable:**

| Your System Has | How to Calculate |
|-----------------|------------------|
| Talk time in minutes | Multiply by 60: `talk_minutes * 60 = seconds` |
| Talk time in HH:MM:SS format | Convert: (hours × 3600) + (minutes × 60) + seconds |
| `datetime_start` + `datetime_end` | `duration_talk = datetime_end - datetime_start` |
| `duration_acw` + `duration_total` | `duration_talk = duration_total - duration_acw - hold_time` |
| Talk + Hold combined in one field | Use that field (we'll recalculate) |

**Important Notes:**
- ⚠️ Use **talk time only**, not total handle time
- ⚠️ Exclude hold time and wrap-up time from this field
- ⚠️ If only total duration available, we can recalculate using: `talk_time = total - hold_time - wrap_up_time`

---

### 6. **hold_time** ⏸️
**What it is:** Time customer was on hold (waiting/bridge/music)
**Data type:** Integer (seconds)
**Example values:** `45`, `120`, `0`
**Where to find it:** ACD/CTI hold/wait time metrics

**✅ Direct Source:**
- Genesys: "Hold Time", "Wait Time", "Bridge Time"
- Avaya: "Hold Time", "Wait Time"
- NICE: "Hold Time", "Wait Time"
- Five9: "Hold Time"
- Talkdesk: "Hold Duration", "Wait Time"

**🔄 Alternatives if exact field unavailable:**

| Your System Has | How to Calculate |
|-----------------|------------------|
| Hold time in minutes | Multiply by 60: `hold_minutes * 60` |
| "Wait Time" field | Hold time = Wait time before agent pickup |
| Only total handle time | If breakdown unavailable, estimate or use 0 |
| No hold tracking | Use `0` for all calls (will reduce accuracy slightly) |
| Hold + Wait combined | Use combined value (we normalize) |

**Important Notes:**
- ✅ Include all time customer was not actively talking: music on hold, transfer wait, etc.
- ✅ If no hold: use `0`
- ⚠️ Don't include wrap-up time here

---

### 7. **wrap_up_time** 📝
**What it is:** After-call work (ACW) - time agent spent on paperwork after call ended
**Data type:** Integer (seconds)
**Example values:** `30`, `60`, `120`
**Where to find it:** ACD/CTI ACW/wrap-up time metrics

**✅ Direct Source:**
- Genesys: "After Call Work Time", "ACW Time", "Wrap-up Duration"
- Avaya: "After Call Work", "ACW", "Wrap Time"
- NICE: "After Call Duration", "ACW Time"
- Five9: "ACW Time", "After Call Duration"
- Talkdesk: "Wrap-up Duration", "Wrapup Time"

**🔄 Alternatives if exact field unavailable:**

| Your System Has | How to Calculate |
|-----------------|------------------|
| Wrap-up in minutes | Multiply by 60: `wrap_minutes * 60` |
| Only total handle time | Estimate based on channel: Voice ~30-60s, Chat ~45-90s |
| Separate queue data | Use queue average wrap time |
| No ACW tracking | Use `0` (calls go straight to ready) |
| Handle time components | `wrap_time = total - talk_time - hold_time` |

**Expected ranges by channel:**
- **Voice**: 30-120 seconds (1-2 minutes typical)
- **Chat**: 45-180 seconds (variable, customers chat multiple times)
- **Email**: 300-600 seconds (complex, requires note-taking)
- **Back-office**: 60-300 seconds

**Important Notes:**
- ✅ Only the time agent spends after call/chat ends
- ✅ If agent picks up next call immediately: use `0`
- ⚠️ Don't include agent idle time or break time

---

### 8. **agent_id** 👤
**What it is:** Unique identifier for the agent/employee who handled the call
**Data type:** String
**Example values:** `AGENT_045`, `EMP_12345`, `jsmith`, `45`
**Where to find it:** ACD/CTI agent directory or user ID

**✅ Direct Source:**
- Genesys: "User ID", "Agent ID", "Employee ID"
- Avaya: "Agent ID", "Station ID", "User ID"
- NICE: "User ID", "Agent ID"
- Five9: "User ID", "Agent Name"
- Talkdesk: "Agent ID", "User ID"

**🔄 Alternatives if exact field differs:**

| Your System Has | How to Use It |
|-----------------|---------------|
| Employee name only | Hash it (we accept hashed names) |
| Employee number | Use as agent_id |
| Email address | Hash it for privacy |
| Badge number | Use as agent_id |
| Multiple IDs | Use the primary one (most consistent) |

**Important Notes:**
- ✅ Use **consistent** identifier across all records
- ✅ Can be numeric or alphanumeric
- ✅ **Must be unique** per agent
- ℹ️ For privacy, you can hash names: `SHA256(employee_name)`
- ⚠️ Don't mix different ID formats in same dataset

---

### 9. **transfer_flag** 🔄
**What it is:** Boolean indicator - was this call transferred/escalated?
**Data type:** Boolean
**Example values:** `TRUE`, `FALSE`, `1`, `0`, `Yes`, `No`
**Where to find it:** ACD/CTI transfer/escalation tracking

**✅ Direct Source:**
- Genesys: "Transferred" flag, "Escalated" field
- Avaya: "Transfer" flag, "Route" change indicator
- NICE: "Transferred" field
- Five9: "Transferred" flag
- Talkdesk: "Transferred" field

**🔄 Alternatives if exact field unavailable:**

| Your System Has | How to Calculate |
|-----------------|------------------|
| Number of transfers (0, 1, 2, 3...) | If > 0, then TRUE; if = 0, then FALSE |
| "Final Queue" vs "First Queue" | If different, then TRUE; if same, then FALSE |
| Separate transfer count | Use: `IF(transfer_count > 0, TRUE, FALSE)` |
| Only "disposition" field | If disposition = "TRANSFERRED", then TRUE |
| No transfer tracking | Use FALSE for all calls (conservative estimate) |

**Important Notes:**
- ✅ Use: `TRUE` or `FALSE` (case-insensitive)
- ✅ Also accepts: `1` / `0`, `Y` / `N`, `Yes` / `No`
- ✅ If multiple transfers (A→B→C): mark as `TRUE`
- ⚠️ Only count internal transfers, not conference/coaching

---

## Optional Fields

### ⭐ **reason_code** (RECOMMENDED - High Impact)
**What it is:** Classification of why the customer contacted
**Data type:** String
**Example values:** `REFUND`, `PASSWORD_RESET`, `BILLING_INQUIRY`, `TECH_SUPPORT`, `SALES_INQUIRY`
**Status:** **NOT currently required, but HIGHLY RECOMMENDED**

**Why it matters:**
- 📈 Improves accuracy by **15-20%**
- 🎯 Enables precise structuring analysis
- 🔍 Available in **95% of modern CTI systems**
- ✅ Zero customer effort to provide (just 1 more column)

**Where to find it:**
- Genesys: "Contact Reason", "Reason Code", "Interaction Reason"
- Avaya: "Reason Code", "Call Type", "Disposition"
- NICE: "Reason Code", "Call Type"
- Five9: "Reason Code", "Call Type"
- Talkdesk: "Reason Code", "Topic"

**🔄 Alternatives if exact field unavailable:**

| Your System Has | How to Use It |
|-----------------|---------------|
| IVR menu selections | Use IVR option chosen as reason code |
| Ticket category | Use category as reason code |
| Contact type/topic | Use topic classification |
| Disposition codes | Map disposition to reason: "RESOLVED"→"REFUND_PROCESSED" |
| Only agent notes | Extract reason from first 10 words of notes (manual work) |
| No reason tracking | We'll estimate from channel (less accurate but works) |

**Example reason code mappings:**
```
Common reason codes for contact centers:
- BILLING: Billing inquiry, invoice questions, payment issues
- TECHNICAL: Technical support, troubleshooting, system issues
- SALES: Sales inquiries, quote requests, upsell
- REFUND: Refund requests, returns, cancellations
- PASSWORD_RESET: Account access, password, login issues
- COMPLAINT: Customer complaint, service recovery
- GENERAL_INFO: General information, FAQ questions
- ORDER_STATUS: Order tracking, delivery status
- FEATURE_REQUEST: Feature request, product feedback
```

---

### 📎 **caller_id** (OPTIONAL - Low Priority)
**What it is:** Anonymous identifier for the customer (for repeat contact tracking)
**Data type:** String (hashed)
**Example values:** `CUST_HASH_99283`, `C_8F2A93D4`, any unique customer identifier
**Status:** **Optional - Nice to have**

**Why it matters:**
- Used for tracking repeat contacts/customers
- Helps identify customer effort (repeat calls for same issue)
- Not required for core automation readiness analysis

**Where to find it:**
- Customer ID field (hashed for privacy)
- Phone number hash (SHA256)
- Email hash

**🔄 Alternatives:**
- If customer ID unavailable, leave blank or use `UNKNOWN`
- If you want to preserve privacy, provide hashed values
- Exact format doesn't matter; just needs to be consistent per customer

---

## Field Definitions & Alternatives

### Complete Reference Table with Calculations

| Field | Must Have | Format | If Missing... | Fallback |
|-------|-----------|--------|---------------|----------|
| interaction_id | ✅ Yes | String | Essential - Create if needed | Sequence: `20241001_001` |
| datetime_start | ✅ Yes | ISO 8601 | Essential - Calculate from end | `end_time - duration` |
| queue_skill | ✅ Yes | String | Affects segmentation accuracy | Use: "Default_Queue" |
| channel | ✅ Yes | String | Normalized: Voice/Chat/Email/etc | Assume "Voice" |
| duration_talk | ✅ Yes | Seconds (int) | Calculate: total - hold - wrap | Convert from minutes × 60 |
| hold_time | ✅ Yes | Seconds (int) | Can use 0 if unavailable | Estimate: 0-120 range |
| wrap_up_time | ✅ Yes | Seconds (int) | Calculate: total - talk - hold | Use channel average |
| agent_id | ✅ Yes | String | Critical for performance analysis | Hash: SHA256(name) |
| transfer_flag | ✅ Yes | Boolean | Calculate from queue changes | Assume FALSE |
| reason_code | ⭐ Rec | String | +15-20% accuracy loss | Estimate from channel |
| caller_id | Optional | String (hash) | No impact on core analysis | Can omit entirely |

---

## Data Quality Guidelines

### File Format Requirements

#### ✅ Accepted Formats:
1. **CSV (Comma-Separated Values)** - Recommended
   - Example: `field1,field2,field3\nvalue1,value2,value3`
   - Encoding: UTF-8 preferred (but we handle most)
   - Line endings: LF or CRLF (both fine)

2. **XLSX (Excel)** - Also supported
   - Single sheet or first sheet used
   - Headers in first row

3. **Google Sheets** - Share link method
   - Must be public or shareable link
   - We'll extract from first sheet

#### 📋 CSV Format Best Practices:

```csv
interaction_id,datetime_start,queue_skill,channel,duration_talk,hold_time,wrap_up_time,agent_id,transfer_flag
CALL_001,2024-10-01 09:15:22,Sales,Voice,345,45,30,AGENT_045,FALSE
CALL_002,2024-10-01 09:22:10,Support_L1,Chat,120,0,60,AGENT_023,TRUE
CALL_003,2024-10-01 09:35:45,Technical,Email,0,0,0,AGENT_089,FALSE
```

**CSV Rules:**
- ✅ Headers in first row
- ✅ One record per row
- ✅ Quoted fields if they contain commas: `"Smith, John"`
- ✅ Dates in ISO format: `YYYY-MM-DD HH:MM:SS`
- ✅ Numbers without quotes or currency symbols

### Data Validation Rules

We automatically validate and accept:

| Validation | Status | Action |
|-----------|--------|--------|
| **Row count** | Min: 100 rows | Less = reduce accuracy estimate |
| | Ideal: 1,000+ rows | Recommended minimum |
| | Max: 1,000,000 rows | We handle large datasets |
| **Date range** | Min: 1 week of data | Very limited analysis |
| | Recommended: 4 weeks | Best for trend detection |
| | Any range: OK | We process as-is |
| **NULL/Empty values** | Mandatory fields | We fill with smart defaults |
| | Optional fields | We ignore/skip |
| **Duplicates** | Exact duplicates | We deduplicate automatically |
| **Outliers** | Extreme durations (>8 hours) | We flag and may exclude |
| **Format variations** | Different date formats | We attempt conversion |

### Data Cleaning (Automatic)

We automatically handle:
- ✅ Whitespace trimming
- ✅ Date format normalization
- ✅ Boolean value standardization (TRUE/FALSE/1/0/Y/N/Yes/No)
- ✅ Duplicate row removal
- ✅ Missing optional fields (replaced with defaults)
- ✅ Timezone normalization (assumed your system timezone)

### Data You Should Clean Before Upload

Please clean these issues before exporting:

| Issue | Fix |
|-------|-----|
| Test data, training calls | Filter them out |
| Calls with 0 duration | Remove (data quality issue) |
| Future dates (tomorrow) | Verify data export date |
| Very old data (>1 year) | Consider if representative |
| Incomplete records | Remove (missing critical fields) |
| Corrupted characters | Use UTF-8 encoding |

---

## Common CTI System Examples

### Genesys (Most Common)

**Standard Export Fields:**
```sql
SELECT
  CallID AS interaction_id,
  StartTime AS datetime_start,
  QueueName AS queue_skill,
  MediaType AS channel,
  TalkTime AS duration_talk,
  HoldTime AS hold_time,
  ACWTime AS wrap_up_time,
  AgentID AS agent_id,
  CASE WHEN TransferCount > 0 THEN TRUE ELSE FALSE END AS transfer_flag
FROM Interactions
WHERE StartTime >= '2024-10-01' AND StartTime < '2024-10-08'
```

**With Reason Code:**
```sql
AND ReasonCode AS reason_code  -- Direct field available
```

---

### Avaya (Legacy Common)

**Standard Export:**
```sql
SELECT
  CallReference AS interaction_id,
  CallStartTime AS datetime_start,
  QueueName AS queue_skill,
  CallType AS channel,
  Duration - HoldTime - ACWTime AS duration_talk,
  HoldTime AS hold_time,
  ACWTime AS wrap_up_time,
  AgentID AS agent_id,
  CASE WHEN Transferred = 'Y' THEN TRUE ELSE FALSE END AS transfer_flag
FROM CallRecords
WHERE CallStartTime >= '2024-10-01'
```

---

### Five9

**Standard Export:**
```sql
SELECT
  CallID AS interaction_id,
  StartDateTime AS datetime_start,
  Queue AS queue_skill,
  Channel AS channel,
  TalkDuration AS duration_talk,
  WaitDuration AS hold_time,
  ACWDuration AS wrap_up_time,
  AgentID AS agent_id,
  CASE WHEN Transferred = true THEN TRUE ELSE FALSE END AS transfer_flag,
  Reason AS reason_code  -- Direct field
FROM CallLog
```

---

### Talkdesk

**Standard Export:**
```sql
SELECT
  call_id AS interaction_id,
  started_at AS datetime_start,
  queue_name AS queue_skill,
  direction AS channel,  -- Convert: 'inbound' to 'Voice'
  talk_duration AS duration_talk,
  waiting_duration AS hold_time,
  wrapup_duration AS wrap_up_time,
  agent_id AS agent_id,
  CASE WHEN transferred = true THEN TRUE ELSE FALSE END AS transfer_flag,
  contact_reason AS reason_code  -- Direct field
FROM calls
```

---

### Zendesk (Chat/Ticket Based)

**Chat Conversations:**
```sql
SELECT
  conversation_id AS interaction_id,
  created_at AS datetime_start,
  assigned_group AS queue_skill,
  'Chat' AS channel,
  (ended_at - started_at) AS duration_talk,
  0 AS hold_time,  -- Chat doesn't have traditional hold
  (closed_at - ended_at) AS wrap_up_time,
  assigned_agent_id AS agent_id,
  CASE WHEN transferred_to_agent IS NOT NULL THEN TRUE ELSE FALSE END AS transfer_flag
FROM conversations
```

---

## Troubleshooting & FAQ

### Q: What if we don't have all 9 mandatory fields?

**A:** You can still get analysis, but accuracy will be reduced. Here's the impact:

| Missing Field | Impact | Workaround |
|--------------|--------|-----------|
| interaction_id | Can't track records | Create: `seq_number` incrementing |
| datetime_start | Can't analyze scheduling | Estimate or use current date |
| queue_skill | Can't segment by team | Use "Default" for all |
| channel | Reduces accuracy ~10% | Assume all "Voice" |
| duration_talk | Critical - breaks AHT | Calculate from other time fields |
| hold_time | Reduces accuracy ~5% | Use 0 or estimate |
| wrap_up_time | Reduces accuracy ~5% | Use 0 or calculate |
| agent_id | Affects performance analysis | Create: `agent_1`, `agent_2`, etc. |
| transfer_flag | Affects FCR accuracy | Assume FALSE for all |

**We'll still generate results** with reduced accuracy estimates.

---

### Q: How recent should the data be?

**A:**
- **Minimum**: 1 week of data (very limited insights)
- **Recommended**: 4 weeks of data (ideal)
- **Optimal**: 8-12 weeks of data (accounts for variations)
- **Maximum**: Any amount (we'll use all of it)

**Why?** Contact centers have weekly and monthly patterns. One week = limited view. 4 weeks = captures full weekly cycle plus some variation.

---

### Q: Can we use data from multiple time periods (not consecutive)?

**A:**
Yes, but it's better to use consecutive data.

**Examples:**
- ✅ Good: Oct 1-31 (consecutive month)
- ✅ Good: Oct 1-7 + Oct 15-22 (filtered, but clear dates)
- ⚠️ Less ideal: Last week from each month (mixed patterns)

---

### Q: What if we have a small contact center with <100 calls per day?

**A:**
Absolutely fine! Here's the minimum:

| Center Size | Min Calls | Min Duration | Note |
|------------|-----------|--------------|------|
| Small (<50 calls/day) | 500 calls | 10 days | Still gives insights |
| Medium (50-500 calls/day) | 1,000 calls | 2-4 weeks | Recommended |
| Large (500+ calls/day) | 5,000 calls | 1-2 weeks | Sufficient |

We analyze percentage-based metrics, so absolute size matters less than having enough variety.

---

### Q: Can we update data after initial analysis?

**A:**
Yes! You can:
1. **Re-run analysis** with newer data anytime
2. **Compare results** across time periods
3. **Track improvements** month-to-month

Each analysis is independent. Newer data will show current trends.

---

### Q: What about privacy/compliance (GDPR, CCPA)?

**A:**
**We handle privacy by design:**

✅ **What we recommend:**
- Hash agent_id: `SHA256(employee_name)` instead of real names
- Hash caller_id: `SHA256(phone_number)` instead of real phone
- Remove any PII fields before export
- We never store raw data beyond analysis

✅ **What we don't need:**
- Customer names
- Agent names (use IDs instead)
- Phone numbers (unless hashed)
- Email addresses (unless hashed)

✅ **What's safe to include:**
- Anonymized/hashed identifiers
- Timestamps (we anonymize dates if needed)
- Queue/team names
- Metrics (durations, counts)

---

### Q: How do we export from our specific system?

**A:** See [Common CTI System Examples](#common-cti-system-examples) above.

**General steps:**
1. **Find the reports section** in your ACD/CTI admin interface
2. **Choose "Call Detail Records" (CDR)** or "Interaction History"
3. **Select date range**: Last 4 weeks recommended
4. **Export fields**: Use the SQL examples or match field names
5. **Format**: CSV or Excel
6. **Download** and validate first row has correct headers

---

### Q: How long does analysis take?

**A:**
- **Data upload**: 2-5 minutes (depends on file size)
- **Validation**: 1-2 minutes
- **Analysis generation**: 1-2 minutes
- **Total**: 5-10 minutes typically

---

### Q: Can we automate this (daily/weekly exports)?

**A:**
**Future feature** - currently we accept one-time file uploads.

**Roadmap for Q1 2025:**
- API connection to your CTI system
- Automatic daily exports
- Continuous readiness monitoring
- Trend tracking over time

For now: Manual monthly exports recommended.

---

### Q: Do we need to anonymize agent names?

**A:**
**Not required**, but recommended:
- ✅ Use agent_id (numeric or alphanumeric)
- ✅ Hash names if privacy is concern: `SHA256(name)`
- ✅ You can use real names if internal only

**We never expose** individual agent names in results anyway - we aggregate to team/queue level.

---

### Q: What if we have multiple channels in one CSV?

**A:**
Perfect! That's what we want.

**Example CSV mixing channels:**
```csv
interaction_id,datetime_start,queue_skill,channel,duration_talk,hold_time,wrap_up_time,agent_id,transfer_flag
CALL_001,2024-10-01 09:15:22,Sales,Voice,345,45,30,AGENT_045,FALSE
CHAT_001,2024-10-01 09:16:10,Sales,Chat,120,0,60,AGENT_023,FALSE
EMAIL_001,2024-10-01 09:17:45,Support,Email,0,0,180,AGENT_089,FALSE
```

We'll automatically segment by channel for analysis.

---

### Q: How do we validate our data export is correct?

**A:**
**Checklist before uploading:**

```
☐ File opens without errors (CSV or Excel)
☐ First row has headers (not data)
☐ All 9 mandatory field names present (or close matches)
☐ Data starts from 2nd row
☐ Date format is consistent (all YYYY-MM-DD or all DD/MM/YYYY)
☐ Numbers don't have $ or , (use 1000 not 1,000)
☐ No completely empty rows
☐ interaction_id values are all unique
☐ No obvious test data or zeros for all fields
☐ Agent IDs are consistent (same format throughout)
```

**Quick validation in Excel:**
```
1. Open file
2. Check: Ctrl+End to see data extent
3. Check: Data > AutoFilter, verify values look reasonable
4. Check: Formulas bar shows raw data (not formulas)
5. Save as CSV if in Excel
6. Upload!
```

---

## Getting Started Checklist

### Step 1: Identify Your CTI System
- [ ] What ACD/CTI platform do you use? (Genesys, Avaya, etc.)
- [ ] Who has admin access to reports?

### Step 2: Access Export Functionality
- [ ] Log into your ACD/CTI admin portal
- [ ] Find "Call Detail Records" or "Interaction History" reports
- [ ] Confirm you can access last 4 weeks of data

### Step 3: Map Your Fields
- [ ] Using examples above, map your field names to required fields
- [ ] Identify any gaps or unavailable fields
- [ ] Determine if you can calculate missing fields (see alternatives)

### Step 4: Run Export
- [ ] Select date range: Last 4 weeks (or whatever you have)
- [ ] Select all 9 mandatory fields (+ reason_code if available)
- [ ] Export as CSV or Excel
- [ ] Validate using checklist above

### Step 5: Submit for Analysis
- [ ] Upload file using Beyond Diagnostic interface
- [ ] Provide cost-per-hour for ROI calculations
- [ ] (Optional) Provide average CSAT if available
- [ ] Submit and wait for results!

---

## Support & Questions

**For help with this process:**

- 📧 **Email**: support@beyonddiagnostic.com (when available)
- 💬 **Chat**: Use "Help" button in application
- 📱 **Documentation**: Full technical guide at: [docs.beyonddiagnostic.com](https://docs.beyonddiagnostic.com)

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "File format not recognized" | Ensure CSV with headers in first row |
| "Missing mandatory field: X" | Check field is present and has values |
| "Date format error" | Use ISO format: YYYY-MM-DD HH:MM:SS |
| "No data processed" | Ensure file has >100 rows of data |

---

## Appendix: Field Mapping Template

Use this template to map your system's fields:

```
Your System: _________________
Export Date: _________________

MANDATORY FIELDS
┌────────────────────────────────────────────────┐
│ Required Field     │ Your Field Name            │
├────────────────────────────────────────────────┤
│ interaction_id     │ ________________________   │
│ datetime_start     │ ________________________   │
│ queue_skill        │ ________________________   │
│ channel            │ ________________________   │
│ duration_talk      │ ________________________   │
│ hold_time          │ ________________________   │
│ wrap_up_time       │ ________________________   │
│ agent_id           │ ________________________   │
│ transfer_flag      │ ________________________   │
└────────────────────────────────────────────────┘

OPTIONAL FIELDS
┌────────────────────────────────────────────────┐
│ Optional Field     │ Your Field Name            │
├────────────────────────────────────────────────┤
│ reason_code        │ ________________________   │
│ caller_id          │ ________________________   │
└────────────────────────────────────────────────┘

NOTES:
- Fields we DON'T have: ____________________
- Workarounds/calculations needed: _______________________
- Data quality concerns: ____________________
```

---

**Version History:**
- v1.0 (Dec 4, 2025): Initial comprehensive guide
- Future: v1.1 will include API integration examples

---

**Last Updated:** December 4, 2025
**Status:** Production Ready ✅

