# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-20

### Hinzugefügt
- Neues Tool `list_events` zum Abrufen aller kommenden Schulungen und Events
- Neues Tool `get_event` zum Abrufen von Event-Details anhand der Event-ID
- npm Paket-Konfiguration für Veröffentlichung als `@workshops.de/mcp`
- Unterstützung für `npx -y @workshops.de/mcp` Ausführung
- Erweiterte Dokumentation mit npm Installationsoptionen

### Geändert
- Paketname von `workshops-de-mcp` zu `@workshops.de/mcp`
- Erweiterte Metadaten in package.json (Repository, Homepage, etc.)

## [1.0.0] - 2024-12-20

### Hinzugefügt
- Initiale Version des MCP Servers
- Tool `list_courses` für alle verfügbaren Kurse
- Tool `get_course_events` für Events eines bestimmten Kurses
- Tool `list_trainers` für alle Trainer
- Tool `get_course_trainers` für Trainer eines bestimmten Kurses
- Vollständige Fehlerbehandlung
- Deutsche Dokumentation 