# Workshops.DE MCP Server

Ein MCP (Model Context Protocol) Server für die Workshops.DE API, der es KI-Assistenten ermöglicht, auf Kursinformationen, Events und Trainer-Daten zuzugreifen.

## Funktionen

Der MCP Server stellt folgende Tools zur Verfügung:

- **list_courses**: Zeigt alle verfügbaren Kurse an
- **get_course_events**: Zeigt Events/Termine für einen bestimmten Kurs
- **list_trainers**: Zeigt alle Trainer an
- **get_course_trainers**: Zeigt Trainer für einen bestimmten Kurs
- **list_events**: Zeigt alle kommenden Events/Schulungen an
- **get_event**: Zeigt Details zu einem bestimmten Event anhand der Event-ID

## Installation

1. Repository klonen oder Dateien herunterladen:
```bash
git clone <repository-url>
cd workshops-de-mcp
```

2. Dependencies installieren:
```bash
npm install
```

## Verwendung

### Mit Claude Desktop

1. Öffne die Claude Desktop Konfigurationsdatei:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Füge den MCP Server zur Konfiguration hinzu:
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