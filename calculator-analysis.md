# Calculator Formula Analysis

## ISSUES FOUND:

### ❌ Issue 1: "Monthly admin hours saved" - Inconsistent days
**Current:** `dailyHours × 30` (uses 30 calendar days)
**Should be:** `dailyHours × 22` (use 22 working days to be consistent)
**Reason:** Should align with working days since this represents work hours saved

### ❌ Issue 2: "Total cost for staff processing" - Shows DAILY not MONTHLY
**Current:** `hourlyRate × billableStaff × dailyHours` (DAILY cost)
**Should be:** `hourlyRate × billableStaff × dailyHours × 22` (MONTHLY cost)
**Reason:** Should show monthly total to compare with monthly Publius cost

### ❌ Issue 3: "Cost per document per staff" - Inconsistent days  
**Current:** `monthlyCost ÷ (documentsPerHour × dailyHours × 30)`
**Should be:** `monthlyCost ÷ (documentsPerHour × dailyHours × 22)`
**Reason:** Should use 22 working days to match other calculations

---

## CORRECT FORMULAS:

### ✅ 1. Estimated Monthly Labor Cost
```javascript
billableStaff × dailyHours × hourlyRate × 22
```
**Purpose:** Total monthly cost of staff working billable hours
**Logic:** (staff × hours/day × rate/hour × 22 days) = monthly labor cost

### ✅ 2. Monthly Admin Hours Saved (NEEDS FIX)
**Current:** `dailyHours × 30`
**Fixed:** `dailyHours × 22`
**Purpose:** Hours per month that Publius saves
**Logic:** hours/day × 22 working days = monthly hours saved

### ✅ 3. Your Documents Processed
```javascript
documentsPerHour × dailyHours × 22
```
**Purpose:** Monthly documents staff can process
**Logic:** (docs/hour × hours/day × 22 days) = monthly staff output

### ✅ 4. Publius Documents Processed
```javascript
publiusDocsAmount × 30
```
**Purpose:** Monthly Publius capacity (flat subscription limit)
**Logic:** Solo=5/day, Firm=20/day, Litigator=50/day × 30 days
**Note:** Uses 30 days because it's subscription capacity, not work-dependent

### ✅ 5. Total Documents Processed
```javascript
userMonthlyDocuments + publiusMonthlyDocuments
```
**Purpose:** Combined monthly capacity
**Logic:** Staff output + Publius capacity

### ✅ 6. Labor Cost Per Document
```javascript
hourlyRate ÷ documentsPerHour
```
**Purpose:** Cost for staff to process one document
**Logic:** ($/hour) ÷ (docs/hour) = $/doc

### ❌ 7. Total Cost for Staff Processing (NEEDS FIX)
**Current:** `hourlyRate × billableStaff × dailyHours` (DAILY)
**Fixed:** `hourlyRate × billableStaff × dailyHours × 22` (MONTHLY)
**Purpose:** Monthly total cost for staff processing
**Logic:** staff × hours/day × rate/hour × 22 days = monthly cost

### ✅ 8. Total Cost for Publius Processing
```javascript
monthlyCost
```
**Purpose:** Monthly subscription cost
**Logic:** Flat subscription fee (Solo=$199, Firm=$399, Litigator=$599)

### ✅ 9. Cost Per Document (Publius)
```javascript
monthlyCost ÷ totalMonthlyDocuments
```
**Purpose:** Publius cost per document across all documents
**Logic:** subscription cost ÷ total output = cost efficiency

### ❌ 10. Cost Per Document Per Staff (NEEDS FIX)
**Current:** `monthlyCost ÷ (documentsPerHour × dailyHours × 30)`
**Fixed:** `monthlyCost ÷ (documentsPerHour × dailyHours × 22)`
**Purpose:** Publius cost per document relative to one staff's output
**Logic:** subscription ÷ (one staff's monthly output) = cost per doc per staff

### ✅ 11. Monthly Cost of Publius
```javascript
monthlyCost
```
**Purpose:** Display selected tier price
**Logic:** Simple display of subscription cost

### ✅ 12. Return on Investment
```javascript
revenueIncrease ÷ monthlyCost
```
**Purpose:** ROI ratio
**Logic:** (monthly labor cost ÷ Publius cost) = ROI multiplier

---

## SUMMARY OF FIXES NEEDED:

1. **Monthly admin hours saved:** Change from 30 to 22 days
2. **Total cost for staff processing:** Multiply by 22 to get monthly total
3. **Cost per document per staff:** Change from 30 to 22 days

## CONSISTENCY RULES:

- **Use 22 working days** for: Staff work calculations (labor hours, documents processed, costs)
- **Use 30 calendar days** for: Publius capacity (subscription-based, not work-dependent)
