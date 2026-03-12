# Tool Setup Guide
## Windows-First Installation Reference

**All instructions are for Windows. Linux notes included where relevant as secondary option.**

---

## Core Development Tools

### Node.js
- Download LTS version from nodejs.org
- Run installer, accept defaults
- Verify: `node --version` and `npm --version`
- Recommended: Use nvm-windows to manage multiple Node versions
  - Download from github.com/coreybutler/nvm-windows

### VS Code
- Download from code.visualstudio.com
- Run installer

**Extensions — install all of these:**
```
ESLint
Prettier - Code formatter
TypeScript Hero (auto-imports)
REST Client (test APIs in VS Code)
GitLens
SQLTools
SQLTools PostgreSQL/Cockroach Driver
Docker
C# Dev Kit
PowerShell
```

**VS Code settings for this curriculum (settings.json):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp"
  },
  "editor.tabSize": 2,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

### Git
- Download from git-scm.com — use Git for Windows
- During install: select "Use Visual Studio Code as default editor"
- Verify: `git --version`

**Git configuration:**
```bash
git config --global user.name "Xavier DM"
git config --global user.email "your@email.com"
git config --global init.defaultBranch main
```

---

## Database Tools

### PostgreSQL 18
- Already installed (verified earlier in curriculum)
- Connect via PowerShell: `psql -U postgres`

**pgAdmin:**
- Download from pgadmin.org
- Connect to: localhost:5432, user: postgres

**VS Code SQLTools:** Connect directly from VS Code:
- SQLTools → Add New Connection → PostgreSQL
- Host: localhost, Port: 5432, User: postgres

---

## Docker Desktop

### Installation
1. Download from docker.com/products/docker-desktop
2. Run installer — accept defaults
3. **Enable WSL 2 when prompted** (required)
4. Restart when asked
5. Open Docker Desktop (whale icon appears in system tray when ready)

**Verify:**
```powershell
docker --version
docker ps  # Should show empty table
```

**If WSL 2 error:**
```powershell
# Run PowerShell as Administrator
wsl --install
# Restart computer, then retry Docker Desktop
```

**Linux note:** `sudo apt install docker.io && sudo usermod -aG docker $USER` then logout/login.

### Essential Docker Commands
```powershell
docker ps                    # List running containers
docker ps -a                 # List all containers (including stopped)
docker stop container_name   # Stop a container
docker start container_name  # Start a stopped container
docker rm container_name     # Remove a container
docker logs container_name   # View container output
docker logs container_name --tail 50  # Last 50 lines

# Images
docker images                # List downloaded images
docker pull image_name       # Download an image
docker rmi image_name        # Remove an image

# Volumes (where persistent data lives)
docker volume ls             # List volumes
docker volume rm volume_name # Delete a volume (WARNING: deletes data)
```

---

## n8n

### Start n8n (persistent — use this always)
```powershell
docker run -d `
  --name n8n `
  --restart unless-stopped `
  -p 5678:5678 `
  -v n8n_data:/home/node/.n8n `
  n8nio/n8n
```

Open: http://localhost:5678

### Manage n8n
```powershell
docker stop n8n    # Stop
docker start n8n   # Start again
docker logs n8n    # Check for errors
```

### Update n8n
```powershell
docker stop n8n
docker rm n8n
docker pull n8nio/n8n
docker run -d --name n8n --restart unless-stopped -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
# Your workflows are safe — they're in the n8n_data volume
```

### Backup n8n Workflows
- In n8n: open workflow → ⋮ → Download (saves as JSON)
- Commit JSON files to GitHub — version control for automations

### npm alternative (no Docker needed)
```powershell
npm install -g n8n
n8n  # Starts on http://localhost:5678
```
Data stored in `C:\Users\YourName\.n8n\`

---

## Windmill

### Start Windmill
```powershell
docker run -d `
  --name windmill `
  -p 8000:8000 `
  -v windmill_db:/tmp/windmill/db `
  ghcr.io/windmill-labs/windmill:main
```

Open: http://localhost:8000

**First login:**
- Email: admin@windmill.dev
- Password: changeme
- **Change password immediately after first login**

### Manage Windmill
```powershell
docker stop windmill
docker start windmill
docker logs windmill
```

### Update Windmill
```powershell
docker stop windmill
docker rm windmill
docker pull ghcr.io/windmill-labs/windmill:main
docker run -d --name windmill -p 8000:8000 -v windmill_db:/tmp/windmill/db ghcr.io/windmill-labs/windmill:main
```

---

## ngrok (Expose localhost for webhooks)

### Installation
```powershell
npm install -g ngrok
```

### Setup
1. Create free account at ngrok.com
2. Copy your authtoken from the dashboard
3. `ngrok config add-authtoken YOUR_TOKEN`

### Usage
```powershell
# Expose n8n to the internet (for GitHub webhooks etc.)
ngrok http 5678

# You'll see:
# Forwarding  https://abc123.ngrok-free.app -> http://localhost:5678
# Use the https URL as your webhook URL
```

**Note:** Free tier gives you 1 agent and a new URL each time you restart ngrok. For testing this is fine.

---

## .NET 9

Already installed. Verify:
```powershell
dotnet --version  # Should show 9.x.x
```

**Entity Framework CLI tools:**
```powershell
dotnet tool install --global dotnet-ef
dotnet ef --version  # Verify
```

**NestJS CLI:**
```powershell
npm install -g @nestjs/cli
nest --version  # Verify
```

---

## Azure CLI

### Installation
```powershell
winget install Microsoft.AzureCLI
# Or download from learn.microsoft.com/cli/azure/install-azure-cli
```

### Basic usage
```powershell
az login                          # Opens browser login
az account show                   # Show current subscription
az group list                     # List resource groups
az webapp list --output table     # List web apps
```

---

## PowerApps CLI (for PCF development)

```powershell
npm install -g microsoft-powerapps-cli
pac --version  # Verify

# Login to Power Platform
pac auth create --url https://org.crm.dynamics.com
```

---

## Running Everything Together

When you're in Phase 6+ and need everything running:

```powershell
# Start all containers
docker start n8n windmill

# Start ngrok if you need webhooks from the internet
ngrok http 5678

# Verify everything is up
docker ps
```

**Ports in use:**
```
3000  = NestJS API
5001  = ASP.NET Core API (HTTPS)
5432  = PostgreSQL
5678  = n8n
8000  = Windmill
```

---

## Troubleshooting

**Port already in use:**
```powershell
# Find what's using a port
netstat -ano | findstr :5678
# Kill by PID
taskkill /PID [pid] /F
```

**Docker won't start:**
- Make sure Docker Desktop is fully started (wait for whale icon to be solid)
- Check Windows Virtualization is enabled in BIOS
- Check Hyper-V: Control Panel → Programs → Turn Windows features on/off → Hyper-V

**n8n workflows gone:**
- This happens if you ran n8n without the `-v n8n_data:/home/node/.n8n` volume flag
- Always use the persistent startup command above

**PostgreSQL connection refused:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*
# Start if stopped
Start-Service postgresql-x64-18
```

**ngrok "tunnel session failed":**
- You may have another ngrok session running
- Close all other terminals with ngrok running
- Free tier: only 1 simultaneous tunnel

---

## Quick Start Checklist

Run this at the start of each learning session:

```powershell
# Check what's running
docker ps

# Start what you need for today's phase
docker start n8n          # Phase 3 and beyond
docker start windmill     # Phase 6 only

# Verify your databases
psql -U postgres -c "\l"  # List databases

# Check .NET tools
dotnet --version
dotnet ef --version
```

Everything ready. Start coding.
