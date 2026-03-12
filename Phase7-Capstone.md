# Phase 7 — Capstone & Job Launch
## Weeks 27-30

**Focus:** Portfolio capstone project + Belgian job market targeting  
**Duration:** 4 weeks

---

## Phase Overview

Four weeks to go from "I've built a lot of things" to "I have one definitive project that demonstrates everything and I'm ready to interview."

Weeks 27-29 build the capstone. Week 30 is job launch — CV, LinkedIn, targeting Belgian companies, interview preparation.

---

## Weeks 27-29 — Capstone Project

### Choosing Your Project

The capstone should be something real — a recognizable problem that justifies your full stack. Generic CRUD apps don't impress. A well-chosen problem with a clear reason for each technology choice does.

**Option A: Internal Tools Platform (Recommended)**
A mini "internal tools" application for a fictional railway company. Features: employee schedule viewing, booking system (NestJS or .NET API), automated notifications (n8n), admin workflows (Windmill), Power Apps interface for non-technical staff. Maps directly to your NMBS/SNCB context — very easy to explain in interviews.

**Option B: Event Management Hub**
Extend your Event Booking API from Phase 5 into a complete product. Add a Power Apps mobile interface, n8n automation for reminders and notifications, Windmill deployment pipeline, Azure-hosted everything.

**Option C: Solve a Real NMBS/SNCB Problem**
If there's a real internal problem you can build a public demo version of (no sensitive data), this is the strongest option. Concrete domain expertise + real problem solved = the best interview story.

---

### Week 27 — Architecture & Sprint 1

**Goal:** Designed, scoped, first working pieces deployed.

#### Write the Architecture Document First

Before touching code, write this in your repo:

```markdown
# [Project Name] — Architecture

## Problem Statement
[What problem does this solve? Why does this problem exist?
Be specific — "I couldn't find X so I built Y" is a real answer.]

## Target Users
[Who uses this? What do they need to accomplish?]

## Why This Stack
- API: [NestJS / ASP.NET Core] because [reason]
- Database: PostgreSQL because [reason]
- Automation: n8n for [X], Windmill for [Y]
- Front-end: [Power Apps / React] because [reason]
- Cloud: Azure because [reason]

## System Components
[Simple diagram or bullet list of what talks to what]

## Data Model
[Key entities and relationships — a few sentences or simple table]

## API Endpoints
[High-level list — not full Swagger, just the shape]

## Automation Flows
[What triggers what. What does n8n handle vs Windmill?]

## Deployment Architecture
[What runs where — local dev, Azure, Docker]
```

**Why write this first?** Interviewers ask "walk me through your architecture." Having documented decisions shows engineering maturity. "I chose NestJS here because..." beats a shrug every time.

#### Week 27 Deliverables

- Architecture document committed to GitHub
- GitHub repo created, README written (even if incomplete)
- Database schema created and migrated
- Core entities and API skeleton in place (routes defined, services stubbed)
- GitHub Actions CI pipeline running (at minimum: build + test on push)

---

### Week 28 — Sprint 2: Core Features

**Goal:** The main functionality works end-to-end.

#### Focus on the Happy Path First

Get the main user journey working before adding edge cases:
- User can register and log in
- User can perform the primary action of your app
- Data persists correctly in PostgreSQL
- Basic error handling (not perfect, but nothing crashes)

#### Wire in n8n This Week

At least one meaningful n8n workflow connected to your API:
- Example: "When a booking is created → POST to n8n webhook → Discord notification"
- Export the workflow JSON to your repo (`/n8n-workflows/`)
- The webhook call should be non-blocking (don't fail if n8n is down)

```typescript
// Non-blocking n8n notification — the right pattern
this.httpService.post('http://localhost:5678/webhook/event-created', payload)
  .toPromise()
  .catch(err => this.logger.warn('n8n notification failed:', err.message));
// Request continues even if n8n is unreachable
```

#### Deploy Early

Deploy to Azure this week even if it's basic. Reasons:
- Forces you to deal with environment variables and config properly
- Gives you a live URL to share during the job search
- Avoids last-minute deployment problems in Week 29

#### Week 28 Deliverables

- Core features working end-to-end locally
- n8n workflow running and triggering on events
- Application deployed to Azure (even basic)
- Docker Compose file for local development

---

### Week 29 — Sprint 3: Polish & Documentation

**Goal:** Everything clean, documented, and demo-ready.

#### Code Quality

- TypeScript strict mode throughout — no `any` except where genuinely necessary
- Error handling covers unhappy paths (not found, validation failures, server errors)
- Input validation on all endpoints
- Consistent response format: `{ data, meta? }` for success, `{ status, message, errors? }` for errors
- No hardcoded secrets or connection strings

#### Add the Windmill Pipeline

Even a simple Windmill flow demonstrates the code-first automation story:
1. Call your Azure API health endpoint
2. Approval gate (you approve in the Windmill UI)
3. Post "deployment confirmed" to Discord

It doesn't need to actually deploy anything. It demonstrates that you understand enterprise workflow patterns with approval gates — that's what matters.

#### Power Platform Connection

One of these (whichever fits your project):
- Custom connector pointing to your API, used in a simple Power Apps screen
- PCF component embedded in a Power Apps canvas app
- Even a Power Automate flow calling your API is enough to demonstrate the connection

The goal: show that your traditional development work connects to the Power Platform ecosystem. That's the hybrid positioning made visible.

#### README — This Matters

```markdown
# [Project Name]

[One compelling paragraph: what this is, why it exists, who it's for.
Not a list of features — a reason to care.]

## Live Demo
- API: https://your-app.azurewebsites.net/swagger
- [Any other live URLs]

## Architecture
[Brief description or simple diagram of what talks to what]

## Tech Stack
| Layer | Technology |
|-------|------------|
| API | NestJS / ASP.NET Core |
| Database | PostgreSQL on Azure |
| Automation | n8n + Windmill |
| Platform | Power Apps + Custom Connector |
| CI/CD | GitHub Actions → Azure |

## Running Locally
[Clear steps — assume a developer who has never seen your repo.
Test these steps yourself before writing them.]

## What I Built and Why
[Honest 3-4 sentences about the interesting decisions you made
and the challenges you solved. Not a feature list.]
```

#### Record a Demo Video (Max 5 Minutes)

Show:
1. The application working (the main user journey)
2. An n8n workflow triggering from a real action
3. A brief look at the code structure
4. The Azure deployment URL working

Host it on YouTube (unlisted is fine) or as a GitHub repo video. Link it from the README. This becomes your primary job application asset alongside the live URL.

#### Week 29 Deliverables

- Everything deployed and working on Azure
- README complete with live URLs, architecture, and local setup
- Demo video recorded and linked
- Windmill pipeline documented
- Power Platform integration visible and working

---

## Week 30 — Job Launch

**Goal:** 10+ targeted applications submitted by end of week.

### Belgian Market Targeting

#### Company Types (by fit for your hybrid profile)

**Tier 1 — Best fit:**
- Belgian enterprise on Microsoft stack: ING, KBC, Belfius, Proximus, Engie, Infrabel
- Belgian government and parastatals: NMBS/SNCB peers, De Lijn, Belgian Post, federal agencies
- Microsoft partners: Avanade, Accenture, Capgemini, Sogeti, CTG, delaware

**Tier 2 — Strong fit:**
- Mid-size Belgian companies with Power Platform footprint looking to mature it
- Belgian subsidiaries of international companies running Microsoft ecosystem

**Why these specifically:** They already use Power Platform but have developers who can't extend it with code, and Power Platform specialists who can't write production code. You're the bridge — and that's a concrete value proposition, not a vague "I'm a full-stack developer."

#### Job Titles to Search

```
Full Stack Developer (.NET / TypeScript)
Software Developer Power Platform
Business Application Developer
Integration Developer
.NET Developer (Power Platform)
Microsoft Stack Developer
Low-Code Developer (ignore the "low-code" label — apply anyway)
```

#### Belgian Job Boards

- LinkedIn (primary — set location to Belgium, search in Dutch, French, and English)
- StepStone.be
- Jobat.be
- Indeed.be
- VDAB (Flemish — most relevant for Waregem area)

---

### CV Structure

**One page. In English (safe for all Belgian companies).**

```
Xavier DM
[Email] | [Phone] | [LinkedIn] | github.com/XavierDM | Waregem, Belgium

PROFESSIONAL SUMMARY
Hybrid developer combining TypeScript/C# backend development with Power Platform 
expertise. 5+ years in enterprise environments at NMBS/SNCB. Built production APIs 
deployed to Azure, automation workflows in n8n and Windmill, and PCF components 
extending Power Apps with custom TypeScript controls. Seeking a role that bridges 
traditional development with the Power Platform ecosystem.

TECHNICAL SKILLS
Languages:     TypeScript, JavaScript, C#
Frameworks:    NestJS, ASP.NET Core, Express
Databases:     PostgreSQL
Automation:    n8n, Windmill, Power Automate
Platform:      Power Apps, PCF, Custom Connectors
Cloud/DevOps:  Azure (App Service), Docker, GitHub Actions

PROJECTS
[Capstone Project] — github.com/XavierDM/[repo] | [live-url]
  [One line: what it is and why it exists]
  Stack: NestJS + PostgreSQL + n8n + Power Apps + Azure | CI/CD via GitHub Actions

Event Booking API — github.com/XavierDM/event-booking-api | [live-url]
  ASP.NET Core Web API, Entity Framework Core, JWT auth, deployed to Azure

Task Manager API — github.com/XavierDM/task-manager
  NestJS, TypeORM, PostgreSQL, Docker, Jest unit tests

EXPERIENCE
Power Platform Developer — NMBS/SNCB, Waregem     [start date – present]
  [Your actual responsibilities and achievements — be specific]
  [Example: "Built 12 Power Apps applications for operational teams, reducing manual
   data entry by approximately X hours/week"]

EDUCATION
[BeCode training — include it with dates]
[Any other relevant education]
```

**Format notes:**
- Use a simple, clean template — no heavy design, no columns
- PDF format for applications
- Name the file: `Xavier_DM_CV.pdf` (not `CV.pdf` — recruiters save dozens of CVs)

---

### LinkedIn Optimization

**Headline:**
`Full Stack Developer | TypeScript · C# · Power Platform | Belgium | Open to opportunities`

**About section (write in first person, ~150 words):**

Paragraph 1: What you do and your background — keep it concrete.
Paragraph 2: What makes you different — the hybrid stack, and specifically what that means in practice.
Paragraph 3: What you're looking for — location, role type, values.

**Featured section:** Link to your capstone GitHub repo and the live Azure URL.

**Activity — post once a week for the month before job hunting:**
- "Built a PCF component this week — here's what I learned about TypeScript in Power Apps"
- "n8n vs Windmill: when I use each and why"
- "Connected my ASP.NET Core API to Power Automate — the custom connector approach"

Short posts, concrete, technical but accessible. This warms up your profile before you apply — recruiters check your activity.

---

### Interview Preparation

#### Questions You Will Definitely Get

**"Walk me through your most complex project"**
Answer with your capstone: architecture decisions → interesting challenges → how you solved them → what you'd do differently. Have the GitHub URL and live demo ready to share during the call.

**"Explain dependency injection"**
NestJS and ASP.NET Core both inject dependencies into constructors rather than having classes create them. This makes unit testing easier (inject a mock repository instead of a real database) and makes it easy to swap implementations without changing the class that uses them.

**"What's the difference between n8n and Power Automate?"**
n8n is open-source, self-hosted, very code-friendly (JavaScript in code nodes), and doesn't require Microsoft licensing. Power Automate is Microsoft-native, deeply integrated with M365 and Dataverse, and better for organizations already in the Microsoft ecosystem. I use n8n for custom automation and Power Automate when the integration is Microsoft-to-Microsoft.

**"Why TypeScript over JavaScript?"**
Compile-time type checking catches bugs before they reach production. Better IDE support for refactoring in large codebases — rename a property and VS Code updates every reference. Makes code self-documenting through interfaces. For anything above a script, TypeScript is the right default.

**"How would you scale this system to handle 100x more users?"**
Be honest that you haven't operated at that scale, then reason through it: identify the likely bottleneck (usually the database), discuss horizontal scaling of the API layer, connection pooling, read replicas, caching for frequently-read data, and monitoring to find the actual bottleneck before optimizing. Measured reasoning beats confident bluffing.

**"Tell me about a time you had to learn something quickly"**
This curriculum is the answer. Pick a specific week where something was hard, explain how you worked through it, and what you built as a result.

#### Questions to Ask Them

- "What does your current Power Platform adoption look like, and where do you see it going?"
- "How does your team handle the gap between Power Platform and traditional development today?"
- "What does the CI/CD process look like for your .NET or Node applications?"
- "What would success look like in this role after 6 months?"

These questions signal that you're thinking about how to contribute, not just trying to get the job.

---

### Week 30 Deliverables

By end of week:
- 10+ applications submitted to targeted Belgian companies
- LinkedIn updated, About section written, Featured section set
- CV reviewed and finalized
- GitHub profile pinned repos set (your best 6)
- Capstone on Azure with working live URL everywhere

---

## Final Portfolio Summary

**GitHub pinned repos at graduation:**
1. Capstone project (the main event)
2. Event Booking API (ASP.NET Core + Azure + CI/CD)
3. Task Manager API (NestJS + Docker)
4. ts-utils (TypeScript utility library)
5. n8n-workflows (exported JSONs + README explaining each)
6. PCF DataGrid or database-design (your choice)

**Live URLs:**
- Capstone API Swagger
- Event Booking API Swagger
- Capstone front-end (if applicable)

**Total projects built during the curriculum:**
Phase 1: 3 projects | Phase 2: 2 projects | Phase 3: 4 automations + prototype
Phase 4: 2 APIs + integration | Phase 5: 3 projects | Phase 6: connectors + PCF + Windmill
Phase 7: Capstone

That's 15+ things you built. Most candidates have 2.

---

## The Positioning Statement

When someone asks "what do you do?" at the end of 30 weeks:

*"I'm a full-stack developer specializing in the Microsoft enterprise stack — TypeScript and C# on the backend, PostgreSQL, deployed to Azure. What makes me different from most developers is that I also work with Power Platform. I build the custom connectors that let Power Apps talk to real APIs, and I've built PCF components in TypeScript when Power Apps needs functionality it doesn't provide natively. Most developers or Power Platform specialists can do one side. I do both."*

That's the answer. That's what gets the interview.

Good luck, Xavier. 🚀
