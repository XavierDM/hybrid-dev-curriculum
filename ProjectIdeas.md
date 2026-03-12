# Project Ideas
## 50+ Automation & Development Projects for After the Curriculum

Organized by phase and complexity. All buildable with the stack you learned.

---

## n8n Automation Ideas

### Beginner (Phase 3 Level)

**1. GitHub Activity Digest**
Weekly summary of your GitHub activity — commits, PRs, issues. Posted to Discord every Monday morning.

**2. Weather-Based Wardrobe Reminder**
Check weather in Waregem each morning. If rain > 50% → Discord notification to grab an umbrella.

**3. LinkedIn Job Alert**
Search LinkedIn or StepStone for new Belgian developer job postings. Daily digest to Discord or email.

**4. Train Status Monitor**
Use iRail API to check your commute trains. If delays > 10 min → send notification before you leave.

**5. New GitHub Repo Tracker**
Monitor GitHub for new repos tagged with "power-platform", "nestjs", "belgium". Weekly digest of interesting new projects.

**6. Hacker News Filter**
Fetch Hacker News top stories daily, filter for TypeScript/C#/.NET/Power Platform topics, post to Discord.

**7. Exchange Rate Alert**
Monitor EUR/USD or EUR/GBP. Alert via Discord when rate crosses a threshold.

**8. OpenStreetMap Coffee Finder**
Query nearby coffee shops in Waregem via Nominatim. Useful for "where should I work from today" decisions.

**9. Daily News Briefing (Belgian)**
Aggregate news from Belgian sources via NewsAPI. Morning Discord briefing with 5 headlines in English/Dutch.

**10. API Health Monitor**
Every 15 minutes, call the health endpoints of your portfolio APIs. Alert to Discord if any are down.

---

### Intermediate (NestJS/Power Platform Knowledge Required)

**11. NMBS Train Delay Dashboard**
iRail API → process departure data for your regular stations → Google Sheets dashboard with delay trends over time.

**12. GitHub PR Review Reminder**
When a PR is open for >24 hours without review, post a reminder to a Discord channel. Useful for small teams.

**13. Automated CV Sender**
Given a list of job postings (from CSV or Airtable), schedule personalized follow-up emails after X days of no response.

**14. Portfolio API Uptime Report**
Weekly report showing uptime %, response times, and error rates for all your Azure-deployed APIs. Emailed as HTML.

**15. Dataverse Change Notifier**
When a Power Platform Dataverse record changes (trigger via Power Automate webhook → n8n), notify relevant team via Teams/Discord.

**16. Code Review Stats Tracker**
GitHub API → track your PR review activity, comments given, time to merge. Weekly GitHub-style activity report.

**17. Belgian Holiday Schedule**
Public Belgian holiday API + your work calendar → alert when a long weekend is coming up 2 weeks in advance.

**18. Steam Wishlist Price Alert**
Steam API → monitor your wishlist games → alert when any goes on sale >50% off.

**19. Job Application Tracker**
Airtable as the database. n8n automation: when status changes to "Interview" → create calendar event. When "Offer" → send celebration Discord message.

**20. Auto-Backup n8n Workflows**
Every Sunday, export all n8n workflow JSONs via API and commit them to a GitHub backup repo.

---

### Advanced (Full Stack + Automation)

**21. Personal Finance Dashboard**
Manual transaction input (API or CSV import) → categorize with AI → monthly spending report posted as Discord embed with spending breakdown.

**22. Real-Time Train Connection Suggester**
iRail API → given your home station and destination → n8n scheduled check → notification when the best connection departs in 20 min.

**23. Meeting Prep Bot**
Before calendar events, fetch recent LinkedIn updates, news, and GitHub activity for meeting attendees. Summary in Discord 30 min before meeting.

**24. Belgian Job Market Tracker**
Scrape StepStone/Jobat/LinkedIn for Power Platform + developer job postings weekly. Track over time in PostgreSQL. Charts showing market demand trends.

**25. Power Platform Usage Analytics**
If you have admin access — pull Power Platform usage data, process in n8n, build a management dashboard showing which apps are actually used.

---

## TypeScript / NestJS Project Ideas

**26. Personal API Gateway**
A NestJS API that aggregates data from multiple services you use (GitHub, OpenWeatherMap, iRail) into a single clean API. Your own personal API layer.

**27. CLI Tool (TypeScript)**
Build a command-line tool that does something useful — batch file renaming, quick calculations, train schedule lookup. Publish to npm.

**28. Webhook Router**
A NestJS service that receives webhooks from various sources and routes them to the right handler. Like a personal mini-Zapier backend.

**29. URL Shortener**
NestJS + PostgreSQL. Custom short URLs, click tracking, expiry dates. Deploy to Azure.

**30. File Converter API**
NestJS API that accepts uploaded files (CSV, JSON, XLSX) and converts between formats. Useful as a real utility.

**31. Text Processing API**
NestJS API for common text operations — word count, reading time estimate, extract URLs, clean formatting. Could serve a browser extension.

**32. Bookmark Manager API**
Save, tag, and search bookmarks. NestJS + PostgreSQL + full-text search. Better than browser bookmarks.

**33. Daily Question API**
API that returns a daily coding challenge or question. Schedule-based rotation from a PostgreSQL table of questions.

**34. Changelog Generator**
NestJS API that takes a GitHub repo + date range and generates a formatted changelog from commit messages following conventional commits.

**35. Personal Metrics API**
Track personal goals (books read, workouts, habits). Simple NestJS + PostgreSQL. No fancy front-end needed — just an API you call from n8n or a script.

---

## C# / ASP.NET Core Project Ideas

**36. Document Converter**
ASP.NET Core API that converts DOCX to PDF, or merges PDFs. Using open-source libraries. Practical tool with actual use.

**37. Image Optimization API**
Resize, compress, and convert images. ASP.NET Core + ImageSharp library.

**38. Simple CMS Backend**
ASP.NET Core + EF Core for managing articles, categories, and media. Deploy to Azure. Front-end via Power Apps or simple HTML.

**39. Invoice Generator**
Given order data via API, generate a professional PDF invoice using a .NET PDF library. Return as download.

**40. Cron Job Manager**
ASP.NET Core API to register, trigger, and monitor background jobs using Hangfire. Dashboard for monitoring job status.

---

## Power Platform Project Ideas

**41. Employee Onboarding App**
Power Apps + Dataverse. New employee submits info → Power Automate creates accounts → n8n sends welcome Discord → manager gets checklist in Teams.

**42. IT Equipment Request**
Power Apps form → approval workflow in Power Automate → auto-email to IT → status tracking in the app.

**43. Expense Report Tracker**
Power Apps for expense submission → your custom API (NestJS or .NET) validates and processes → Dataverse stores → Power BI dashboard.

**44. Meeting Room Booking**
Canvas app for booking meeting rooms → your API for room availability → sync with Exchange calendar.

**45. PCF Signature Component**
TypeScript PCF component that provides a signature capture pad inside Power Apps. Useful for mobile field workers.

**46. PCF Advanced Chart**
Embed Chart.js or Recharts inside Power Apps via PCF when the built-in charts aren't enough.

**47. PCF QR Code Generator**
TypeScript PCF component that generates QR codes from text input within Power Apps.

**48. Custom Connector: Belgian Gov APIs**
Build connectors for Belgian open data APIs (BOSA, Statbel) so they're usable in Power Automate flows without code.

---

## Windmill Project Ideas

**49. Automated Database Backup**
Windmill flow: dump PostgreSQL database → compress → upload to Azure Blob Storage → notify. Runs nightly, requires human approval to restore.

**50. Dependency Audit Pipeline**
Windmill flow: check npm audit and dotnet list package --vulnerable for all your repos → generate report → approval gate → create GitHub issues for critical vulnerabilities.

**51. Portfolio Performance Test**
Windmill flow: run load tests against your Azure APIs → compare results to baseline → approval gate before marking release as "good" → post results to Discord.

**52. Weekly Cleanup Pipeline**
Windmill flow: delete old Docker images → prune unused volumes → clear old n8n execution logs → approval gate before running on production systems.

---

## Capstone-Worthy Projects (If You Want Something Bigger After Phase 7)

**53. NMBS/SNCB Internal Tools Demo**
Full stack: NestJS or .NET API + PostgreSQL + n8n automation + Power Apps front-end + Windmill deployment pipeline. A complete internal tools platform for a fictional railway division. Everything deployed to Azure.

**54. Belgian Jobs Intelligence Platform**
Scrape job boards weekly → store in PostgreSQL → analyze trends (TypeScript/Python NLP) → Power Apps dashboard showing market demand for different skills → n8n weekly digest report.

**55. Personal Knowledge Base**
NestJS API + PostgreSQL full-text search + Notion API integration. Capture notes via API, search everything, surface related content. Your second brain, self-hosted.

---

## Picking a Project

Good questions to ask before starting:

1. **Will you actually use it?** Projects you use yourself get finished.
2. **Is the scope achievable in a weekend?** Start small — a working MVP beats a grand unfinished vision.
3. **Does it showcase a specific skill?** Each side project should be identifiable as demonstrating something.
4. **Can you explain why you built it?** "I needed X and nothing did exactly that" is a real answer interviewers respect.

The iRail train delay tracker is worth specifically calling out — it shows NMBS/SNCB domain knowledge + automation skills + API integration in one project, and it's something you could realistically use yourself every workday.
