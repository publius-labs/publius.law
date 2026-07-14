# Publius Website Updates Plan

## ⚠️ IMPORTANT NOTE
The HTML files in `/Users/edka/www/Publius/` appear to be **compiled/built files** (minified, single-line HTML from a React/TanStack Router build). 

**To make these changes, you need to:**
1. Edit the **source files** (likely `.tsx`, `.jsx`, or similar in a `src/` directory)
2. Rebuild the project to generate new HTML files

**Please provide the location of your source files before proceeding.**

---

## 📋 UPDATES ORGANIZED BY PRIORITY

### 🔴 **PRIORITY 1: Critical/Compliance Fixes**

#### SOC 2 Compliance Statement (Multiple Locations)
**Current:** "SOC 2 compliant cloud hosting"  
**Change to:** "On-premise deployment or cloud hosting (SOC 2 in progress)"

**Locations:**
- [ ] **Homepage** (`index.html`) - Features section, card #02 "Secure Infrastructure"
- [ ] **About page** (`about/index.html`) - Values section, card #02 "Security & Trust"

---

### 🟡 **PRIORITY 2: Core Messaging (ICP Alignment)**

#### Global: "Small and Midsize Firms" → "Solo and Small Litigation Firms"

**Locations to update:**

**Meta Tags (ALL PAGES):**
- [ ] Meta description tags
- [ ] Meta og:description tags

**Homepage (`index.html`):**
- [ ] Hero meta description: "Built for small and midsize firms."
- [ ] Meta og:description: "AI-powered legal technology for small and midsize law firms."
- [ ] "Built for Small Firms" section heading
- [ ] Footer text: "AI-powered legal technology built for small and midsize firms."

**About Page (`about/index.html`):**
- [ ] Meta tags (description and og:description)
- [ ] Footer text

**Practice Areas Page (`practice/index.html`):**
- [ ] Meta description
- [ ] Body copy: "for the practice areas small and midsize firms run every day"

**All Other Pages:**
- [ ] Footer text (appears site-wide)

---

### 🟢 **PRIORITY 3: Specific Content Updates**

#### Homepage (`index.html`)

**Section: Hero/Subhead**
- [ ] Current: "The tools the largest firms use, made accessible to practices of every size."
- [ ] Change to: "The tools the largest firms use, made accessible to solo and small litigation firms (up to 10 attorneys)."

**Section: Stats/Metrics**
- [ ] **Stat 1:** "40+ Hours saved per case" → "60+ Hours saved per attorney per month"
- [ ] **Stat 2:** "80% Cost vs. traditional discovery"  
  **Options:**
  - Add a source citation
  - Replace with: "25× lower cost than generic AI tools"
  - Remove entirely
  - [ ] **Decision needed from user**
- [ ] **Stat 3:** "1 wk Time to deployment" → "Guided onboarding" (remove the "1 wk" figure)

**Section: Trusted By**
- [ ] Current: "Trusted by attorneys at M.C. Law Group"
- [ ] Change to: "Design partner: M.C. Law Group" **OR** "In pilot with M.C. Law Group"
- [ ] **Decision needed: which phrasing?**

**Section: Demo Block**
- [ ] Add label "Illustrative example" near "Matter — Henderson v. Riverside Industries"
- [ ] **Implementation:** Small text label or badge

---

#### Practice Areas Page (`practice/index.html`)

**Current Practice Areas Listed:**
1. Family Law
2. Immigration
3. Criminal Defense
4. Estate Planning & Probate
5. Employment Law
6. Litigation

**Required Actions:**
- [ ] **Remove or reposition:** "Estate Planning & Probate" (not in investor docs)
- [ ] **Remove or reposition:** "Litigation" (not in investor docs)
- [ ] **Add:** "Bankruptcy" (if in investor materials)
- [ ] **Verify final canonical list with user**

**Recommended Final List (per user's ICP):**
- Family Law (core)
- Immigration (core)
- Criminal Defense (core)
- Employment (adjacent)
- Bankruptcy (adjacent - if included)

**Meta Description Update:**
- [ ] Current: "…family law, immigration law, criminal defense, estate planning, employment law, and litigation practices…"
- [ ] Update to match final locked practice area list

---

#### About Page (`about/index.html`)

**Section: Values - Security & Trust Card**
- [ ] Current: "SOC 2 compliant cloud hosting and on-premise deployment"
- [ ] Change to: "cloud hosting and on-premise deployment, with SOC 2 readiness in progress"

**General Note:**
- "Empowering small firms with enterprise tools" - **Keep as-is**
- "the same firepower as the largest firms" (appears twice) - **Keep as-is** (acceptable framing)
- "We're not here to replace attorneys" - **Keep as-is** (no site change needed, but note internal conflict with investor "AI-enabled law firm" story)

---

## 📝 IMPLEMENTATION CHECKLIST

### Step 1: Locate Source Files
- [ ] Find React/JSX/TSX source files (likely in `src/` or `app/` directory)
- [ ] Identify component files for:
  - Header/Navigation
  - Footer
  - Homepage sections
  - About page sections
  - Practice areas page

### Step 2: Global Changes (Footer Component)
- [ ] Update footer text in footer component/file
- [ ] Should appear across all pages once rebuilt

### Step 3: Meta Tags
- [ ] Update meta tags in each page's head section or layout file
- [ ] Ensure og:description tags are updated alongside description tags

### Step 4: Page-Specific Content
- [ ] Homepage hero and stats
- [ ] Homepage demo block label
- [ ] About page values section
- [ ] Practice areas list and descriptions

### Step 5: Build & Deploy
- [ ] Run build command (e.g., `npm run build`, `yarn build`, etc.)
- [ ] Test all pages locally
- [ ] Deploy updated files

---

## 🎯 TEXT REPLACEMENTS SUMMARY

### Global Find & Replace (All Files)

| Find | Replace |
|------|---------|
| `small and midsize firms` | `solo and small litigation firms` |
| `small and midsize law firms` | `solo and small litigation firms` |
| `SOC 2 compliant cloud hosting` | `On-premise deployment or cloud hosting (SOC 2 in progress)` |
| `SOC 2 compliant cloud hosting and on-premise deployment` | `cloud hosting and on-premise deployment, with SOC 2 readiness in progress` |

### Page-Specific Replacements

**Homepage:**
- `40+` (in stats section) → `60+`
- `Hours saved per case` → `Hours saved per attorney per month`
- `80%` stat → **[Decision needed]**
- `Cost vs. traditional discovery` → **[Decision needed or remove]**
- `1 wk` → Remove text
- `Time to deployment` → `Guided onboarding`
- `practices of every size` → `solo and small litigation firms (up to 10 attorneys)`
- `Trusted by attorneys at` → `Design partner:` OR `In pilot with`

---

## ❓ DECISIONS NEEDED FROM USER

1. **"80% Cost vs. traditional discovery" stat:**
   - Option A: Add source citation
   - Option B: Replace with "25× lower cost than generic AI tools"
   - Option C: Remove entirely
   - **Which option do you prefer?**

2. **M.C. Law Group phrasing:**
   - Option A: "Design partner: M.C. Law Group"
   - Option B: "In pilot with M.C. Law Group"
   - **Which phrasing do you prefer?**

3. **Practice Areas:**
   - Confirm final list of practice areas to keep
   - Should Bankruptcy be added?
   - What happens to Estate Planning & Probate and Litigation pages? (Remove entirely or keep with different positioning?)

4. **Source Files Location:**
   - **Where are your source files located?** (e.g., `/src/`, `/app/`, etc.)
   - What build command do you use? (e.g., `npm run build`)

---

## 📊 AFFECTED FILES (Built/Output Files)

These files will be regenerated after source changes:
- `/index.html` - Homepage
- `/about/index.html` - About page
- `/practice/index.html` - Practice areas overview
- `/practice/family-law/index.html`
- `/practice/immigration-law/index.html`
- `/practice/criminal-defense/index.html`
- `/practice/employment-law/index.html`
- `/practice/estate-planning/index.html` - **May need removal**
- `/practice/litigation/index.html` - **May need removal**
- `/process/index.html` - Process page (check for messaging)
- `/contact/index.html` - Contact page (check for messaging)
- `/demo/index.html` - Demo page (check for messaging)

**All pages with footer will be affected by footer text change.**

---

## ✅ NEXT STEPS

1. **User provides:**
   - Source files location
   - Answers to decision questions above
   
2. **Agent executes:**
   - Find and update all source files
   - Test changes locally if possible
   - Provide build command for user to run
   
3. **User completes:**
   - Run build command
   - Deploy updated files to production

---

**Created:** Sunday, Jan 12, 2026  
**Status:** Awaiting user input on source file location and decisions
