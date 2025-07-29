# Veröffentlichung auf npm

## Voraussetzungen

1. npm Account erstellen auf https://www.npmjs.com/
2. Organisation "@workshops.de" auf npm erstellen (falls noch nicht vorhanden)
3. In den npm Account einloggen:
   ```bash
   npm login
   ```

## Veröffentlichungsprozess

### 1. Version erhöhen
```bash
# Für Patch-Release (1.1.0 -> 1.1.1)
npm version patch

# Für Minor-Release (1.1.0 -> 1.2.0)
npm version minor

# Für Major-Release (1.1.0 -> 2.0.0)
npm version major
```

### 2. Testen vor der Veröffentlichung
```bash
# Lokal testen
npm start

# Pack erstellen und prüfen
npm pack --dry-run
```

### 3. Veröffentlichen
```bash
# Auf npm veröffentlichen
npm publish

# Bei ersten Veröffentlichung eines scoped packages:
npm publish --access public
```

### 4. Verifizieren
```bash
# Prüfen ob das Paket verfügbar ist
npm view @workshops.de/mcp

# Mit npx testen
npx -y @workshops.de/mcp
```

## Wichtige Hinweise

- Das `publishConfig` in package.json stellt sicher, dass das Paket öffentlich ist
- Die `bin` Konfiguration ermöglicht die Ausführung mit npx
- Der Shebang `#!/usr/bin/env node` in index.js ist wichtig für die Ausführbarkeit

## Nach der Veröffentlichung

1. Git Tag erstellen:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

2. Release auf GitHub erstellen (optional)

3. README Badge aktualisiert sich automatisch 