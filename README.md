# @workshops.de/mcp

Ein MCP (Model Context Protocol) Server für die Workshops.DE API, der es KI-Assistenten ermöglicht, auf Kursinformationen, Events und Trainer-Daten zuzugreifen.

[![npm version](https://img.shields.io/npm/v/@workshops.de/mcp.svg)](https://www.npmjs.com/package/@workshops.de/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Funktionen

Der MCP Server stellt folgende Tools zur Verfügung:

- **list_courses**: Zeigt alle verfügbaren Kurse an
- **get_course_events**: Zeigt Events/Termine für einen bestimmten Kurs
- **list_trainers**: Zeigt alle Trainer an
- **get_course_trainers**: Zeigt Trainer für einen bestimmten Kurs
- **list_events**: Zeigt alle kommenden Events/Schulungen an
- **get_event**: Zeigt Details zu einem bestimmten Event anhand der Event-ID

## Installation

### Option 1: Vercel Deployment (empfohlen für Web-Zugriff)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/workshops-de/mcp-server)

Nutze Vercels native MCP-Unterstützung für optimale Performance. Siehe [VERCEL-README.md](./VERCEL-README.md) für Details.

### Option 2: Direkt mit npx verwenden (für lokale Nutzung)
```bash
# Keine Installation nötig, direkt ausführen:
npx -y @workshops.de/mcp
```

### Option 3: Global via npm installieren
```bash
npm install -g @workshops.de/mcp
```

### Option 4: Aus dem Quellcode
```bash
git clone https://github.com/workshops-de/mcp-server
cd mcp-server
npm install
```

## Verwendung

### Mit Vercel Deployment

Wenn du den Server auf Vercel deployed hast:

**Für Cursor:**
```json
{
  "mcpServers": {
    "workshops-de": {
      "url": "https://deine-app.vercel.app/api/mcp"
    }
  }
}
```

**Für Claude Desktop:**
```json
{
  "mcpServers": {
    "workshops-de": {
      "url": "https://deine-app.vercel.app/api/mcp",
      "transport": "http"
    }
  }
}
```

### Mit lokalem MCP Server (Claude Desktop)

1. Öffne die Claude Desktop Konfigurationsdatei:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Füge den MCP Server zur Konfiguration hinzu:

**Option A: Mit npx (empfohlen)**
```json
{
  "mcpServers": {
    "workshops-de": {
      "command": "npx",
      "args": ["-y", "@workshops.de/mcp"]
    }
  }
}
```

**Option B: Mit global installiertem Paket**
```json
{
  "mcpServers": {
    "workshops-de": {
      "command": "workshops-de-mcp"
    }
  }
}
```

**Option C: Mit lokalem Pfad**
```json
{
  "mcpServers": {
    "workshops-de": {
      "command": "node",
      "args": ["/pfad/zu/workshops-de-mcp/index.js"]
    }
  }
}
```

3. Claude Desktop neustarten

### Standalone testen

Du kannst den Server auch direkt testen:

```bash
# Mit npx (keine Installation nötig)
npx -y @workshops.de/mcp

# Oder wenn lokal installiert
npm start
```

## Beispiel-Verwendung in Claude

Nach der Installation kannst du in Claude folgende Befehle verwenden:

- "Zeige mir alle verfügbaren Kurse von Workshops.DE"
- "Welche Events gibt es für den Kurs [KURS-ID]?"
- "Liste alle Trainer auf"
- "Wer sind die Trainer für den Kurs [KURS-ID]?"
- "Zeige mir alle kommenden Schulungen/Events"
- "Zeige mir Details zum Event [EVENT-ID]"

## MCP Endpoint

Der Server ist über folgenden Endpoint erreichbar:

**JSON-RPC 2.0**: `https://workshops-de-mcp.vercel.app/api/mcp`

Der Server verwendet das offizielle [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) für die Tool-Verwaltung und Anfrage-Verarbeitung, mit einer Standard JSON-RPC 2.0 Schnittstelle für optimale Kompatibilität mit Claude und anderen MCP Clients.

## API Endpunkte

Der Server nutzt folgende Workshops.DE API Endpunkte:

- `GET https://workshops.de/api/course/` - Alle Kurse
- `GET https://workshops.de/api/course/{kursid}/events` - Events für einen Kurs
- `GET https://workshops.de/api/trainers/` - Alle Trainer
- `GET https://workshops.de/api/course/{kursid}/trainers` - Trainer für einen Kurs
- `GET https://workshops.de/api/events` - Alle kommenden Events
- `GET https://workshops.de/api/events/{eventid}` - Details zu einem bestimmten Event (⚠️ möglicherweise nicht verfügbar)

## Entwicklung

### Projektstruktur

```
workshops-de-mcp/
├── index.js        # Haupt-Server-Datei
├── package.json    # NPM Konfiguration
└── README.md       # Diese Datei
```

### Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK für die Server-Implementierung
- `axios` - HTTP Client für API-Anfragen

## Fehlerbehandlung

Der Server behandelt verschiedene Fehlertypen:

- API-Fehler (4xx, 5xx Status Codes)
- Netzwerkfehler
- Fehlende Parameter
- Unbekannte Tools

Alle Fehler werden mit hilfreichen Fehlermeldungen zurückgegeben.

## Lizenz

MIT 