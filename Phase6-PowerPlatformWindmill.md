# Phase 6 — Power Platform + Windmill
## Weeks 24-26

**Focus:** Custom connectors, PCF components, Windmill code-first automation  
**Duration:** 3 weeks | **Prerequisites:** All phases complete

---

## Phase Overview

Most developers reaching Phase 5 would stop. You continue into Power Platform because you already know it professionally — and now you can extend it with real code.

The combination: TypeScript/C# APIs + n8n automation + Power Platform integration + Windmill. Nobody else in most Belgian enterprise hiring pools has all four.

**Week 24:** Custom connectors — connect your APIs to Power Platform  
**Week 25:** PCF components — TypeScript code inside Power Apps  
**Week 26:** Windmill — code-first automation, and where it fits alongside n8n

---

## Week 24 — Power Platform Custom Connectors

**Goal:** Connect your NestJS and .NET APIs to Power Platform. Make your code accessible to Power Apps and Power Automate without anyone needing to understand REST APIs.

### What Custom Connectors Do

Power Platform connects to external services via connectors (SharePoint, Dataverse, GitHub, etc.). A custom connector lets you connect to **any** REST API — including the ones you built in Phases 4 and 5.

Once your connector exists, your API becomes a data source in Power Apps and an action in Power Automate — usable by anyone in your organization.

### Creating a Custom Connector from Swagger

Your NestJS API has Swagger at `/api`. Your .NET API has Swagger at `/swagger`. Export these specs and import them directly.

**In Power Platform:**
```
make.powerapps.com → Data → Custom Connectors → New Connector
→ Import an OpenAPI file
→ Upload your swagger.json
→ Power Platform reads all your endpoints automatically
```

**Configure authentication:**
```
Authentication Type: API Key
  Parameter label: Authorization
  Parameter name: Authorization
  Location: Header
```

**Test the connector:**
Power Platform has a built-in test panel. Hit each endpoint, verify data shapes. Fix any schema issues in your Swagger spec.

**Export Swagger from NestJS:**
```typescript
// In main.ts, add JSON export endpoint
const document = SwaggerModule.createDocument(app, config);
// Visit http://localhost:3000/api-json to download swagger.json
```

**Export Swagger from .NET:**
```
https://localhost:5001/swagger/v1/swagger.json
```

### Connector from Scratch (for APIs you don't control)

```yaml
# swagger.yaml
swagger: '2.0'
info:
  title: Event Booking API
  version: '1.0'
host: eventbooking-api-xavier.azurewebsites.net
basePath: /api
schemes: [https]
paths:
  /events:
    get:
      summary: Get all events
      operationId: GetEvents
      parameters:
        - name: page
          in: query
          type: integer
      responses:
        '200':
          description: Success
          schema:
            $ref: '#/definitions/PagedEvents'
```

### Use the Connector in Power Apps

```powerfx
// Load events into a collection
ClearCollect(
    colEvents,
    EventBookingAPI.GetEvents({ page: 1, limit: 20 })
);

// Create a booking from a selected gallery item
EventBookingAPI.CreateBooking(
    Gallery1.Selected.Id,
    { notes: TextInput1.Text }
);

// Filter locally after load
Filter(colEvents, StartsWith(Title, TextSearchBox.Text))
```

**The payoff:** Your TypeScript/C# code is now accessible to anyone in Power Platform. This is the hybrid developer value proposition made concrete — code that developers write, Power Platform that business users consume.

### Power Automate Integration

```
Flow: New Event Notification
Trigger: When a record is created in Dataverse (Event table)
  ↓
Action: Event Booking API - GetEvents (your custom connector)
  ↓
Condition: If event capacity < 10
  ↓
Action: Post to Teams channel
  ↓
Action: Create task in Planner for event manager
```

This flow uses your API as naturally as any Microsoft-provided connector.

---

### Week 24 Checkpoint

- Custom connector from your NestJS Swagger spec — tested and working
- Custom connector from your .NET Swagger spec — tested and working
- Simple Power Apps gallery using one of your connectors
- One Power Automate flow calling your custom connector

---

## Week 25 — PCF Components

**Goal:** Build TypeScript components that run inside Power Apps. The most technically demanding Power Platform skill.

### What PCF Is

PCF = PowerApps Component Framework. Build custom controls in TypeScript that embed inside Power Apps. Instead of being limited to what Power Apps provides natively, you build anything and embed it.

This is where your Phase 1 TypeScript and Phase 4 NestJS TypeScript experience becomes directly applicable to Power Platform.

**Use cases:**
- A proper data grid with 34 columns (the ServicesLegers problem — solved correctly)
- Custom charts
- Map components
- Any React component embedded in Power Apps

### Setup

```bash
npm install -g microsoft-powerapps-cli
pac --version

# Create PCF project
pac pcf init --namespace XavierDM --name DataGrid --template dataset
cd DataGrid
npm install
npm start   # Opens test harness in browser
```

**Project structure:**
```
DataGrid/
  DataGrid/
    index.ts                        ← Main component code
    ControlManifest.Input.xml       ← Defines inputs and properties
    css/DataGrid.css
  package.json
  tsconfig.json
```

### Building the Data Grid Component

This solves the ServicesLegers 34-column problem properly — a TypeScript component, not a workaround.

**ControlManifest.Input.xml:**
```xml
<manifest>
  <control namespace="XavierDM" constructor="DataGrid" version="1.0.0"
           display-name-key="DataGrid" description-key="DataGrid_Desc" control-type="standard">
    <property name="sampleDataSet" display-name-key="sampleDataSet"
              usage="bound" required="true" of-type-group="numbers" />
    <resources>
      <code path="index.ts" order="1" />
      <css path="css/DataGrid.css" order="1" />
    </resources>
  </control>
</manifest>
```

**index.ts:**
```typescript
import { IInputs, IOutputs } from './generated/ManifestTypes';

export class DataGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._context = context;
    this._container = container;
    this._container.className = 'xavier-data-grid-container';
    this.renderGrid();
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
    this.renderGrid();
  }

  private renderGrid(): void {
    const dataset = this._context.parameters.sampleDataSet;

    // Build table
    const table = document.createElement('table');
    table.className = 'xavier-data-grid';

    // Header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    dataset.columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.displayName;
      th.style.cursor = 'pointer';
      th.onclick = () => dataset.setSortingColumns([{ name: col.name, sortDirection: 0 }]);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Data rows
    const tbody = document.createElement('tbody');
    dataset.sortedRecordIds.forEach(recordId => {
      const row = document.createElement('tr');
      dataset.columns.forEach(col => {
        const td = document.createElement('td');
        const value = dataset.records[recordId].getValue(col.name);
        td.textContent = value?.toString() ?? '';
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    this._container.innerHTML = '';
    this._container.appendChild(table);
  }

  public getOutputs(): IOutputs { return {}; }
  public destroy(): void { this._container.innerHTML = ''; }
}
```

**CSS:**
```css
.xavier-data-grid-container { overflow-x: auto; font-family: 'Segoe UI', sans-serif; }
.xavier-data-grid { border-collapse: collapse; width: 100%; font-size: 13px; }
.xavier-data-grid th { background: #0078d4; color: white; padding: 8px 12px; text-align: left; }
.xavier-data-grid td { padding: 6px 12px; border-bottom: 1px solid #e1e1e1; }
.xavier-data-grid tr:hover td { background: #f3f9ff; }
```

**Test in harness:**
```bash
npm start
# Browser opens with test harness
# Add sample columns and data rows
# See your component render with real data
```

**Build and deploy:**
```bash
npm run build

# Create solution wrapper
pac solution init --publisher-name XavierDM --publisher-prefix xdm
pac solution add-reference --path ../DataGrid

# Deploy to your Power Platform dev environment
pac pcf push --publisher-prefix xdm
```

After deploying, your DataGrid component appears in the Power Apps component picker — insert it into any canvas app like any other control.

### PCF vs n8n — When to Use Which

For the ServicesLegers problem, you now have two solutions:

**n8n automation (Phase 3):**
- Pre-processes data into an 8-column summary for PowerApps
- Full 34-column Excel available on demand
- Works today, no PCF deployment rights needed
- Good when: data is large, users need Excel export, performance matters

**PCF component (this week):**
- Proper data grid with all 34 columns live in Power Apps
- Sortable, scrollable, no export needed
- Good when: users need to interact with all columns live
- Requires PCF deployment rights in your environment

Both are valid. Having both in your toolkit is what differentiates you.

---

### Week 25 Checkpoint

- PCF project running in test harness with real data
- DataGrid component deployed to development environment
- Can explain the PCF build → solution → deploy process
- Know when PCF is the right choice vs n8n automation

---

## Week 26 — Windmill: Code-First Automation

**Goal:** Understand Windmill's position vs n8n. Build a TypeScript flow with an approval gate.

### Windmill vs n8n — The Real Distinction

After Phase 3, you know n8n well. Here's where they genuinely differ:

```
n8n:
  Visual-first, code when needed
  Non-technical users can read workflows
  Fast to prototype
  Best for: integrations, notifications, data sync, ops automation

Windmill:
  Code-first, visual when helpful
  Scripts are TypeScript files in your Git repo
  Approval gates (human sign-off before continuing)
  Full audit trail
  Best for: developer pipelines, deployment workflows,
            anything needing version control + code review
```

In Belgian enterprise: n8n handles operational automation (data sync, notifications, file processing). Windmill handles developer automation (deployment pipelines, anything with compliance/audit requirements).

### Setup

```powershell
docker run -d `
  --name windmill `
  -p 8000:8000 `
  -v windmill_db:/tmp/windmill/db `
  ghcr.io/windmill-labs/windmill:main
```

Open: http://localhost:8000  
Login: admin@windmill.dev / changeme  
**Change password immediately.**

```powershell
docker stop windmill    # Stop
docker start windmill   # Start
docker logs windmill    # Check errors
```

### Your First TypeScript Script

```typescript
// In Windmill: Scripts → New Script → TypeScript

export async function main(
  username: string,
  token: string   // Will become a form field in Windmill's UI
) {
  const response = await fetch(
    `https://api.github.com/users/${username}`,
    { headers: { Authorization: `token ${token}`, 'User-Agent': 'Windmill' } }
  );

  if (!response.ok) throw new Error(`GitHub error: ${response.status}`);

  const user = await response.json();
  return {
    login: user.login,
    name: user.name,
    publicRepos: user.public_repos,
    followers: user.followers,
    fetchedAt: new Date().toISOString()
  };
}
```

**What Windmill does automatically:**
- Reads your function parameters → generates a UI form
- You test it by filling in the form — no webhook setup needed
- The script is version-controlled as a `.ts` file
- Results are logged with full audit trail

### Building a Flow

Flows chain scripts — same concept as n8n workflows but code-native:

```
Flow: Developer Report

Step 1: fetch_github_stats(username, token)
Step 2: fetch_recent_commits(username, days)
  Input: username from flow input (shared variable)
Step 3: format_report(stats, commits)
  Input: results from steps 1 and 2
Step 4: send_discord(webhook_url, message)
  Input: formatted report from step 3
```

In Windmill's flow editor, each step is a script you've already written. Outputs from one step become available as inputs to the next.

### Approval Gates

The feature that makes Windmill valuable in enterprise:

```
Deployment Pipeline Flow:

Step 1: run_tests()
  → Tests pass: continue
  → Tests fail: flow ends with error notification

Step 2: build_docker_image()

Step 3: [Approval Gate]
  → Sends notification to team lead (email/Slack/Teams)
  → Flow pauses indefinitely until approved or rejected
  → Optional: auto-reject after 2 hours
  → Approved: continue to deploy
  → Rejected: flow ends with rejection notification

Step 4: deploy_to_azure()   ← Only reached if step 3 approved

Step 5: notify_team()
```

In Windmill: Add step → Approval → configure approvers, timeout, and notification method.

This pattern is what enterprise DevOps teams pay for in tools like GitHub Actions Enterprise or Azure DevOps. Windmill is free and self-hosted.

### Secrets Management

```
Windmill: Settings → Variables → Add Variable (mark as Secret)

Name: github_token
Value: ghp_xxxxx
Secret: true (hidden in UI, not shown in logs)

# Use in scripts:
const token = Deno.env.get("github_token");
// or in the function signature, Windmill injects it automatically
```

### Git Sync

```
Windmill: Settings → Git Sync → Connect GitHub repo

Your scripts auto-sync to:
repo/
  scripts/
    fetch_github_stats.ts
    send_discord.ts
    format_report.ts
  flows/
    developer_report.yaml
    deployment_pipeline.yaml
```

Scripts become pull requests. Team reviews automation code the same way they review application code.

### Week 26 Project: Deployment Pipeline

Build a Windmill flow simulating a deployment pipeline for your Event Booking API:

1. **Script:** Health check — call your Azure API `/health` endpoint
2. **Script:** Run mock tests — return pass/fail based on input param
3. **Approval gate:** Requires your approval before continuing
4. **Script:** Post deployment summary to Discord
5. **Script:** Log deployment record to Google Sheets

This demonstrates: multi-step flows, approval gates (enterprise feature), integration with your Azure API from Phase 5, Discord from Phase 3, and Sheets from Phase 3. The whole hybrid stack in one workflow.

---

### Week 26 Checkpoint — Phase 6 Complete

- Custom connectors for both APIs working in Power Platform
- PCF DataGrid component deployed to dev environment
- Windmill running with 3+ scripts and 1 deployment pipeline flow
- Can clearly articulate n8n vs Windmill vs Power Automate use cases

**Power Automate Desktop (PAD):** When your PAD license is approved at NMBS/SNCB, the patterns from this phase apply directly. PAD desktop flows integrate with Power Automate cloud flows. Your custom connectors make your APIs available to PAD workflows. The learning curve will be minimal.

---

## The Full Hybrid Stack — Complete

At the end of Phase 6:

```
Languages:     TypeScript, JavaScript, C#
Frameworks:    Express, NestJS, ASP.NET Core
Databases:     PostgreSQL
Automation:    n8n (ops), Windmill (dev pipelines), Power Automate (Microsoft ecosystem)
Platform:      Power Apps, PCF, Custom Connectors
Cloud:         Azure (App Service)
DevOps:        Docker, GitHub Actions, Windmill pipelines
```

One person. All four layers. That's the differentiator.

**Next:** Phase7-Capstone.md
