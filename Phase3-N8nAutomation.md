# Phase 3 — n8n Automation
## Weeks 9-11

**Focus:** Docker fundamentals, n8n automation, real workplace applications  
**Duration:** 3 weeks | **OS:** Windows primary

---

## Phase Overview

This phase produces something immediately useful at NMBS/SNCB. While PAD approval is pending, n8n fills the automation gap — and since it runs in Docker on your local machine, it doesn't need IT approval to learn with.

Week 9: Docker + first automations. Week 10: Scheduled workflows + API data. Week 11: File processing + ServicesLegers prototype.

**By end of phase:**
- 6+ working automations
- Working ServicesLegers prototype to show stakeholders
- IT presentation deck ready
- Docker knowledge that feeds directly into Phase 4

---

## Week 9 — Docker & First Automations

**Goal:** Docker running, n8n running, first webhook automation working by end of Day 1.

### Saturday Morning: Docker & n8n Setup (2hrs)

**Install Docker Desktop:**
1. Download from docker.com/products/docker-desktop
2. Run installer — accept defaults
3. Enable WSL 2 when prompted (required for Windows)
4. Restart when asked
5. Open Docker Desktop — wait for whale icon in system tray to be solid

```powershell
docker --version
docker ps   # Should show empty table — Docker is working
```

**If WSL 2 error:**
```powershell
# Run PowerShell as Administrator
wsl --install
# Restart computer, then retry
```

**Start n8n (persistent — always use this command):**
```powershell
docker run -d `
  --name n8n `
  --restart unless-stopped `
  -p 5678:5678 `
  -v n8n_data:/home/node/.n8n `
  n8nio/n8n
```

Flags explained:
```
-d                        = Run in background
--name n8n                = Name it 'n8n'
--restart unless-stopped  = Auto-restart on reboot
-p 5678:5678              = Your port 5678 → container port 5678
-v n8n_data:/home/...     = Named volume — data persists even if container removed
```

Open: http://localhost:5678 — create your account (local only).

**Docker commands you'll use regularly:**
```powershell
docker ps                  # List running containers
docker stop n8n            # Stop n8n
docker start n8n           # Start n8n again
docker logs n8n            # See what n8n is doing
docker logs n8n --tail 50  # Last 50 lines
```

---

### Saturday Afternoon: First Automation — GitHub to Discord (2hrs)

**Setup Discord webhook (10 min):**
1. Discord → Create server "Automation Testing"
2. Server Settings → Integrations → Webhooks → New Webhook
3. Name "GitHub Bot" → copy webhook URL → save it

**Build the workflow in n8n:**

New Workflow → name it "GitHub → Discord"

**Node 1: Webhook Trigger**
- Add → Webhook
- HTTP Method: POST, Path: `github-push`
- Click "Listen for Test Event"

URL is now: `http://localhost:5678/webhook/github-push`

**Node 2: Code — Extract & Format**
```javascript
const data = $input.all()[0].json;

const pusher = data.pusher?.name ?? 'Unknown';
const repoName = data.repository?.name ?? 'Unknown';
const repoUrl = data.repository?.html_url ?? '';
const commits = data.commits ?? [];
const branch = data.ref?.split('/').pop() ?? 'unknown';

const message = {
  username: "GitHub Bot",
  embeds: [{
    title: `🚀 Push to ${repoName}`,
    url: repoUrl,
    color: 5814783,
    fields: [
      { name: "Branch", value: branch, inline: true },
      { name: "Commits", value: String(commits.length), inline: true },
      { name: "Author", value: pusher, inline: true }
    ],
    description: commits.slice(0, 5).map(c => `• ${c.message.substring(0, 60)}`).join('\n') || 'No commits',
    timestamp: new Date().toISOString()
  }]
};

return [{ json: message }];
```

**Node 3: HTTP Request → Discord**
- Method: POST, URL: your Discord webhook URL
- Body Content Type: JSON, Body: `{{ $json }}`

**Test manually:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/github-push" `
  -Method POST -ContentType "application/json" `
  -Body '{"pusher":{"name":"Xavier"},"repository":{"name":"test-repo","html_url":"https://github.com/XavierDM"},"ref":"refs/heads/main","commits":[{"message":"feat: add user auth"}]}'
```

Discord message should appear.

**Add error handling — IF node before Code node:**
- Value 1: `{{ $json.commits }}`, Operation: "is not empty"
- True path → Code node, False path → Stop and Error node

**ngrok — expose localhost for real GitHub webhooks:**
```powershell
npm install -g ngrok
ngrok config add-authtoken YOUR_TOKEN   # Get from ngrok.com dashboard
ngrok http 5678
# Copy: https://abc123.ngrok-free.app
```

GitHub repo → Settings → Webhooks → Add:
- Payload URL: `https://abc123.ngrok-free.app/webhook/github-push`
- Content type: application/json, Event: Just the push event

---

### Sunday: Enhancements (3hrs)

**Branch-based routing:**
```javascript
const branch = data.ref?.split('/').pop() ?? 'unknown';
// Two Discord webhooks: one for main, one for dev branches
const webhookUrl = branch === 'main'
  ? 'YOUR_PRODUCTION_DISCORD_WEBHOOK'
  : 'YOUR_DEV_DISCORD_WEBHOOK';

return [{ json: { webhookUrl, message } }];
// HTTP Request node URL: {{ $json.webhookUrl }}
```

**Log to Google Sheets:** After Discord node, add Google Sheets node (Append Row) — connect Google account via OAuth.

**Pick one challenge:**
1. Only notify if commit message contains "feat:" or "fix:"
2. Daily 6pm summary of all pushes (Schedule Trigger + data from Google Sheets)
3. Emoji by commit type: 🐛 fix, ✨ feat, 📝 docs

---

## Week 10 — Scheduled Workflows & API Data

**Goal:** Automate recurring data collection. Move from reactive (webhooks) to proactive (scheduled).

### Schedule Trigger

```
Add → Schedule Trigger
Cron expressions:
0 9 * * 1-5   = 9am Monday-Friday
0 8 * * *     = Every day at 8am
*/30 * * * *  = Every 30 minutes
```

### HTTP Request Node — Fetching from APIs

- Method: GET, URL: the API endpoint
- Authentication: Header Auth → Name: Authorization, Value: Bearer YOUR_TOKEN

### Project: Daily GitHub Stats Dashboard

```
Schedule (9am daily)
  → HTTP Request: GET https://api.github.com/users/XavierDM
  → HTTP Request: GET https://api.github.com/users/XavierDM/repos
  → Code: Process and summarize
  → Google Sheets: Append row to dashboard
  → Discord: Post morning summary
```

**Code node:**
```javascript
const userData = $node["Fetch User"].json;
const repos = $node["Fetch Repos"].json;

const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
const mostStarred = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

return [{
  json: {
    date: new Date().toISOString().split('T')[0],
    publicRepos: userData.public_repos,
    followers: userData.followers,
    totalStars,
    languages: languages.join(', '),
    mostStarredRepo: mostStarred?.name ?? 'none'
  }
}];
```

### Data Transformation Patterns

```javascript
// Merge data from two nodes
const users = $node["Fetch Users"].json;
const orders = $node["Fetch Orders"].json;

const usersWithOrders = users.map(user => {
  const userOrders = orders.filter(o => o.userId === user.id);
  return {
    ...user,
    orderCount: userOrders.length,
    totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0)
  };
});

return [{ json: { users: usersWithOrders } }];
```

### Weekend: Morning Briefing Workflow

Runs 8am weekdays, Discord message with:
- Weather in Waregem (OpenWeatherMap free API — openweathermap.org/api)
- GitHub notification count
- A quote (quotable.io — no auth)

```javascript
const weather = $node["Weather"].json;
const quote = $node["Quote"].json;

const icons = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Snow: '❄️' };
const icon = icons[weather.weather[0].main] || '🌤️';
const temp = Math.round(weather.main.temp);

return [{ json: { content:
  `**Good morning!** ☕\n\n` +
  `${icon} **Waregem:** ${temp}°C, ${weather.weather[0].description}\n\n` +
  `> *"${quote.content}"*\n> — ${quote.author}`
}}];
```

---

## Week 11 — File Processing & ServicesLegers Prototype

**Goal:** Handle Excel/CSV files. Build the ServicesLegers prototype. This is the phase's main deliverable.

### The ServicesLegers Problem

34-column table in PowerApps = painful (PowerApps is mobile-first, performs poorly with wide tables).

**The automation solution:** Pre-process the 34-column data, create a clean 8-column summary for PowerApps, make the full 34-column export available on demand via scheduled automation.

### Excel Processing in n8n

n8n includes the `xlsx` library in Code nodes — no installation needed.

```javascript
// Write Excel file
const XLSX = require('xlsx');
const items = $input.all();
const data = items.map(item => item.json);

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Data');

const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

return [{
  binary: { data: buffer },
  json: { fileName: `report-${new Date().toISOString().split('T')[0]}.xlsx` }
}];
```

**CSV cleaning:**
```javascript
const items = $input.all();
const cleaned = items.map(item => {
  const row = item.json;
  return { json: {
    name: row.name?.trim() ?? '',
    date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
    amount: parseFloat(String(row.amount ?? '0').replace(/[€$,]/g, '')),
    status: row.status?.toLowerCase().trim() ?? 'unknown'
  }};
});

// Remove duplicates by key
const seen = new Set();
const unique = cleaned.filter(item => {
  const key = item.json.name + item.json.date;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
return unique;
```

### ServicesLegers Workflow

**Architecture:**
```
[Schedule — hourly]
  → [Read source data]
  → [Code: Extract 8-column summary]
  → [Split parallel]
      ├── [Save summary → SharePoint/Google Sheets]
      └── [Generate 34-column Excel]
              → [Upload to SharePoint/Google Drive]
              → [Discord notification with link]
```

**8-column extraction:**
```javascript
const items = $input.all();

const summaryRows = items.map(item => {
  const row = item.json;
  return { json: {
    AgentName: `${row.FirstName ?? ''} ${row.LastName ?? ''}`.trim(),
    PeriodStatus: row.Status ?? 'Unknown',
    StartDate: row.StartDate ? new Date(row.StartDate).toLocaleDateString('fr-BE') : '',
    EndDate: row.EndDate ? new Date(row.EndDate).toLocaleDateString('fr-BE') : '',
    DaysInPeriod: calculateWorkdays(row.StartDate, row.EndDate),
    ApprovalStatus: row.ApprovalStatus ?? 'Pending',
    Manager: row.ManagerName ?? '',
    LastUpdated: new Date().toLocaleDateString('fr-BE')
  }};
});

return summaryRows;

function calculateWorkdays(start, end) {
  if (!start || !end) return 0;
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    if (current.getDay() !== 0 && current.getDay() !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}
```

### Weekend: Prototype Demo + IT Presentation

**Saturday:** Polish the prototype with dummy data. Record a 2-minute screen capture showing:
- Source Excel with 34 columns
- Workflow running in n8n
- Clean 8-column summary in Google Sheets
- Full Excel in Drive/SharePoint

**Sunday:** Build the IT presentation (adapt from Week8-PortfolioPresentation.md):
1. The problem (34 columns in PowerApps = painful)
2. Three options evaluated
3. Recommendation: automation hybrid
4. Live prototype demo
5. Pilot proposal (3 months, test server, your ownership)
6. Success metrics

---

### Week 11 Checkpoint — Phase 3 Complete

- Docker confident (start/stop, understand volumes)
- 6+ n8n workflows built and tested
- ServicesLegers prototype end-to-end
- IT presentation ready
- All workflow JSONs exported and committed to GitHub

---

## n8n Quick Reference

**Access specific nodes:**
```javascript
$node["Node Name"].json      // Single item
$node["Node Name"].all()     // Multiple items
```

**Return multiple items:**
```javascript
return [
  { json: { id: 1, name: 'First' } },
  { json: { id: 2, name: 'Second' } }
];
```

**Dates (Belgian format):**
```javascript
new Date().toISOString()                   // 2025-03-12T09:00:00.000Z
new Date().toLocaleDateString('fr-BE')     // 12/03/2025
```

**Safe property access:**
```javascript
const name = data?.user?.profile?.name ?? 'Unknown';
```

**Manage n8n:**
```powershell
docker stop n8n    # Stop
docker start n8n   # Start
docker logs n8n    # Check errors

# Update n8n (workflows safe in volume)
docker stop n8n && docker rm n8n
docker pull n8nio/n8n
docker run -d --name n8n --restart unless-stopped -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

**Export workflows:** Open workflow → ⋮ → Download → commit JSON to GitHub

---

**Next:** Phase4-NestJS.md — back to coding, but now with automation context.
