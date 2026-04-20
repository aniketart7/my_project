# 🩺 Pregnancy Fitness Tracker — Developer Spec
### App: Janani / Maa+Baby | Module: Health & Fitness Tracker
**Platforms:** iOS (Apple HealthKit) + Android (Google Fit / Samsung Health)
**Last updated:** April 2026

---

## 📌 Overview

Add a dedicated Fitness & Health Tracker module to the existing pregnancy app. This module syncs data from smartwatches and fitness apps (Apple Watch, Google Fit, Samsung Health, Fitbit, Garmin) and provides pregnancy-safe health monitoring, smart reminders, and doctor-friendly health reports.

> ⚠️ **Legal disclaimer to display in-app:**
> "This app provides general wellness guidance for healthy pregnancies only. It is not a substitute for medical advice. Always consult your OB/GYN for any health concerns."

---

## 🗂️ Feature Breakdown by Priority

### Legend
- ✅ MVP — Build in current sprint
- 🔶 V2 — Next sprint after launch
- 💎 Premium — Paid tier feature (₹299/month plan)

---

## 1. 💓 Vitals Monitoring

| Feature | Priority | Description | Alert Threshold |
|---|---|---|---|
| Heart rate (BPM) | ✅ MVP | Sync resting BPM from Apple Health / Google Fit. Show daily trend graph. | Alert if >140 BPM during exercise, or resting >100 BPM |
| Blood oxygen (SpO2) | ✅ MVP | Sync SpO2 % from Apple Watch / Galaxy Watch. Show weekly trend. | Alert if SpO2 < 95% |
| Blood pressure log | ✅ MVP | Manual entry or smartwatch sync. Systolic / Diastolic fields. | Flag if systolic >140 or diastolic >90 (pre-eclampsia risk) |
| Body temperature | 🔶 V2 | Wrist skin temperature from Apple Watch Ultra / Samsung Galaxy Watch. | Alert if >38°C (fever risk) |

**API references:**
- Apple HealthKit: `HKQuantityTypeIdentifierHeartRate`, `HKQuantityTypeIdentifierOxygenSaturation`, `HKQuantityTypeIdentifierBloodPressureSystolic`
- Google Fit: `TYPE_HEART_RATE_BPM`, `TYPE_BLOOD_PRESSURE` (via Health Connect API)

---

## 2. 🚶 Activity & Movement

| Feature | Priority | Description | Safe Target |
|---|---|---|---|
| Daily step counter | ✅ MVP | Sync steps from phone/watch. Show ring progress. | T1: 7,000 / T2: 8,000 / T3: 5,000 steps/day |
| Active minutes | ✅ MVP | Moderate activity minutes per day (WHO guideline: 150 min/week). | 21 min/day average |
| Safe exercise guide | ✅ MVP | In-app guide: recommended vs avoid exercises per trimester. Static content. | N/A |
| Calorie burn tracker | 🔶 V2 | Sync active calories from watch. Pair with pregnancy calorie intake needs. | T1: +0 kcal / T2: +340 kcal / T3: +450 kcal above baseline |

**Trimester exercise rules to implement:**
- T1: Light walking, yoga, swimming. Avoid heavy lifting, high-impact.
- T2: Continue T1. Add light strength. Avoid lying flat on back after 16 weeks.
- T3: Reduce intensity. Focus on pelvic floor, breathing, gentle stretching.

---

## 3. 😴 Sleep & Rest Tracking

| Feature | Priority | Description | Target |
|---|---|---|---|
| Sleep duration | ✅ MVP | Sync nightly sleep hours from Apple Health / Google Fit. Show 7-day chart. | 8–9 hours/night |
| Rest reminder | ✅ MVP | Push notification if step count is unusually high for the day. | Triggered if steps >120% of trimester target |
| Sleep quality score | 🔶 V2 | Deep/light/REM breakdown from watch. Show score 1–100. | — |
| Nap tracker | 🔶 V2 | Manual log. Suggest 20–30 min naps for T3 fatigue management. | — |

**Sleep position tips (show by trimester):**
- T1: Any position ok
- T2+: Encourage left-side sleeping (improves blood flow to baby)
- T3: Left-side sleeping strongly recommended. Add tip card in sleep section.

---

## 4. ⚖️ Weight & Nutrition Tracking

| Feature | Priority | Description | Notes |
|---|---|---|---|
| Weight gain tracker | ✅ MVP | Weekly manual entry. Plot against WHO-recommended gain curve by BMI category. | Underweight: 12.5–18kg / Normal: 11.5–16kg / Overweight: 7–11.5kg / Obese: 5–9kg |
| Water intake logger | ✅ MVP | Tap to add glasses/ml. Daily progress bar. | Target: 2.3L/day. Smartwatch activity alert triggers hydration nudge. |
| Meal logger | 🔶 V2 | Simple meal entry with macro view. Flag missing key nutrients by trimester. | Key nutrients: Folate (T1), Iron (T2), Calcium + DHA (T3) |
| Iron & Haemoglobin alerts | 💎 Premium | User enters Hb from blood report. App correlates with dietary iron intake. | Flag if Hb < 11g/dL (anaemia threshold in pregnancy) |

---

## 5. 🔔 Smart Reminders & Alerts

| Reminder | Priority | Schedule | Delivery |
|---|---|---|---|
| Prenatal vitamins | ✅ MVP | User sets time. Repeat daily. | Push + watch haptic |
| Folic acid (T1) | ✅ MVP | Morning reminder. Auto-disable after Week 12 unless user overrides. | Push notification |
| Iron tablet | ✅ MVP | User sets time. Avoid with tea/coffee — add tip in notification body. | Push notification |
| Calcium supplement | ✅ MVP | Evening reminder (separate from iron — do not take together). | Push notification |
| Doctor appointment | ✅ MVP | User sets date/time. Remind 24hr + 1hr before. Sync to phone calendar. | Push + calendar event |
| Kick count (fetal movement) | ✅ MVP | Daily reminder from Week 28. Opens kick counter in app. Target: 10 kicks in 2 hrs. | Push notification |
| Contraction timer | ✅ MVP | Manual trigger in T3. Records start/end. Shows frequency + duration. Alert if contractions <5 min apart for >1 hr. | In-app + push |
| Garbhasanskar (mantra/music) | ✅ MVP | User sets preferred time (default: 7pm). Opens today's mantra + music. | Push + watch haptic |
| Posture/stand reminder | 🔶 V2 | If stationary >45 min during waking hours. | Watch haptic |
| Hydration reminder | 🔶 V2 | Every 2 hours during active period (6am–8pm). Pauses if intake goal met. | Push notification |

**Reminder settings screen requirements:**
- Toggle on/off per reminder type
- Set custom time per reminder
- Snooze option (10 min / 30 min / 1 hour)
- Do Not Disturb window (user sets quiet hours)

---

## 6. 🏥 Health Advisor & Doctor Tools

| Feature | Priority | Description |
|---|---|---|
| Symptom checker | ✅ MVP | User selects symptoms from a list. App returns: Normal / Watch & wait / Seek care immediately. Rules-based logic by trimester. |
| Risk flag dashboard | ✅ MVP | Auto-generated flags from vitals: high BP, low SpO2, no fetal movement logged, extreme weight gain/loss. Show on home screen with severity badge. |
| Health report PDF | 💎 Premium | Weekly/monthly PDF summary: vitals trends, weight, sleep, activity, symptoms, scans. Shareable with doctor. Generate via PDFKit or server-side PDF. |
| Ask a Doctor (chat) | 💎 Premium | In-app messaging with verified OB/GYN. 24hr response SLA. Partner API: Practo, DocsApp, or MFine. |

**Symptom checker — rules to implement (sample):**

| Symptom | Trimester | Guidance |
|---|---|---|
| Mild nausea | T1 | Normal — eat small frequent meals |
| Heavy bleeding | Any | Seek care immediately — call doctor |
| No fetal movement >2hr | T3 | Seek care immediately |
| Mild back pain | T2/T3 | Normal — suggest yoga/warm compress |
| Severe headache + blurred vision | Any | Seek care immediately — possible pre-eclampsia |
| Light spotting | T1 | Watch & wait — mention at next visit |
| Shortness of breath (severe) | Any | Seek care immediately |

---

## 7. 🔗 Platform Integrations

| Platform | Priority | Data Points | Integration Method |
|---|---|---|---|
| Apple HealthKit (iOS) | ✅ MVP | Steps, HR, SpO2, sleep, weight, active minutes | HealthKit SDK — request permissions on first launch |
| Google Health Connect (Android) | ✅ MVP | Steps, HR, active minutes, sleep, weight | Health Connect API (replaces Google Fit SDK) |
| Samsung Health | 🔶 V2 | Steps, HR, stress score, sleep | Samsung Health SDK or via Health Connect bridge |
| Fitbit | 🔶 V2 | Steps, HR, sleep | Via Google Health Connect bridge (Fitbit syncs to it) |
| Garmin Connect | 🔶 V2 | Steps, HR, SpO2 | Garmin Connect IQ API |

**Permissions to request (iOS):**
```
HKQuantityTypeIdentifierStepCount
HKQuantityTypeIdentifierHeartRate
HKQuantityTypeIdentifierOxygenSaturation
HKQuantityTypeIdentifierBodyMass
HKQuantityTypeIdentifierBloodPressureSystolic
HKQuantityTypeIdentifierBloodPressureDiastolic
HKCategoryTypeIdentifierSleepAnalysis
HKQuantityTypeIdentifierActiveEnergyBurned
```

**Permissions to request (Android — Health Connect):**
```
android.permission.health.READ_HEART_RATE
android.permission.health.READ_STEPS
android.permission.health.READ_SLEEP
android.permission.health.READ_WEIGHT
android.permission.health.READ_OXYGEN_SATURATION
android.permission.health.READ_BLOOD_PRESSURE
android.permission.health.READ_ACTIVE_CALORIES_BURNED
```

---

## 8. 📱 UI Screens to Build

1. **Fitness Dashboard (Home tab)**
   - Today's summary: Steps ring, Heart rate, Sleep hours, Water intake
   - Risk flags banner (if any active)
   - Quick-add buttons: Water, Weight, Symptom, Kick count

2. **Vitals Detail Screen**
   - HR trend (7-day line chart)
   - SpO2 history
   - BP log list + chart
   - Weight gain curve (actual vs recommended)

3. **Activity Screen**
   - Steps progress bar (daily)
   - Active minutes weekly chart
   - Safe exercise guide (by trimester)

4. **Sleep Screen**
   - Last night summary
   - 7-day sleep chart
   - Sleep tips carousel (by trimester)

5. **Reminders Screen**
   - List of all active reminders with toggle + edit time
   - Add custom reminder button
   - DND window setting

6. **Symptom Checker Screen**
   - Multi-select symptom list (grouped by category)
   - Submit → Result card (Normal / Watch / Seek care)
   - Log history of past symptom checks

7. **Health Report Screen** *(Premium)*
   - Date range selector
   - Preview of report sections
   - Download PDF / Share with doctor button

---

## 9. 🛠️ Tech Stack Recommendations

| Layer | Recommendation |
|---|---|
| Frontend | React Native (works for both iOS + Android from one codebase) |
| Health data | `react-native-health` (iOS) + `react-native-health-connect` (Android) |
| Notifications | Firebase Cloud Messaging (FCM) for push; Notifee for local reminders |
| Charts | Victory Native or Recharts (for React Native) |
| PDF generation | `react-native-html-to-pdf` or server-side with Puppeteer |
| Backend | Node.js + Express (already on Replit) |
| Database | PostgreSQL or Firebase Firestore |
| Payments | Razorpay (India) for Premium subscription |

---

## 10. ✅ MVP Build Checklist

- [ ] Apple HealthKit integration + permission flow
- [ ] Google Health Connect integration + permission flow
- [ ] Fitness dashboard screen with 4 key metrics
- [ ] Heart rate sync + alert logic
- [ ] SpO2 sync + alert logic
- [ ] Blood pressure manual entry + pre-eclampsia flag
- [ ] Daily step counter with trimester-adjusted goal
- [ ] Sleep duration sync
- [ ] Weight gain tracker with WHO curve
- [ ] Water intake logger
- [ ] Medicine reminder system (folic acid, iron, calcium)
- [ ] Doctor appointment reminder + calendar sync
- [ ] Kick count tracker (Week 28+)
- [ ] Contraction timer (T3)
- [ ] Garbhasanskar daily reminder
- [ ] Symptom checker (rules-based, 20+ symptoms)
- [ ] Risk flag dashboard
- [ ] Disclaimer banner on module entry
- [ ] Reminder settings screen (toggle + time + DND)

---

*Spec prepared for Janani / Maa+Baby pregnancy app — April 2026*
*For questions, share this doc with your developer or paste into Replit AI assistant.*
