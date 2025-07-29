---
title: "Claude lernt deine API kennen: MCP Server entwickeln und auf npm veröffentlichen"
description: "Wie ich Claude beibrachte, mit unserer Workshops.DE API zu plaudern – und wie du das auch kannst! Ein unterhaltsamer Deep-Dive in die Welt der MCP Server mit praktischen Beispielen und einer Prise Humor."
author: "Robin Böhm"
date: "2024-12-20"
tags: ["MCP", "Claude", "AI", "npm", "Node.js", "API", "Tutorial"]
category: "Künstliche Intelligenz"
---

# Claude lernt deine API kennen: MCP Server entwickeln und auf npm veröffentlichen

**Oder: Wie ich aufhörte, mir Sorgen zu machen und lernte, Claude mit meiner API sprechen zu lassen**

Stell dir vor, du sitzt mit deinem KI-Assistenten Claude in einem Café und möchtest ihm aktuelle Informationen zu den Workshops.de Kursen. "Hey Claude," sagst du, "welche Angular-Kurse bieten wir denn nächsten Monat an?" Claude nippt an seinem virtuellen Kaffee und antwortet: "Tut mir leid, aber ich habe keinen Zugriff auf eure aktuellen Kursdaten. Mein Wissen endet irgendwann 2024."

Frustrierend, oder? Genau dieses Problem löst das **Model Context Protocol (MCP)** – und heute zeige ich dir, wie du Claude beibringst, mit deinen APIs zu sprechen. Am Ende dieses Artikels wirst du nicht nur verstehen, was MCP ist, sondern auch deinen eigenen MCP Server auf npm veröffentlicht haben.

## Was ist das Model Context Protocol (MCP)?

Stell dir MCP als USB-C Port für KI-Systeme vor. So wie du mit einem USB-C Kabel praktisch jedes moderne Gerät anschließen kannst – von der externen Festplatte bis zum Monitor – ermöglicht MCP es Claude, sich mit beliebigen Datenquellen zu verbinden.

MCP ist ein offener Standard von Anthropic, der es KI-Assistenten ermöglicht, sicher und kontrolliert auf externe Tools und Datenquellen zuzugreifen. Mit MCP kann sehr schnell ein Tool mit einem spezifischen Kontext angeschlossen werden, was dem KI-System direkt die Möglichkeit bietet, mit diesem zu interagieren. Ein Stecker rein, und schon kann Claude mit deiner API, Datenbank oder jedem anderen Service kommunizieren.

### Die Superkräfte von MCP (oder: Warum du das unbedingt brauchst)

#### 🚀 **Echtzeitdaten statt Steinzeit-Wissen**
Claude's Trainingsdaten sind wie eine Enzyklopädie – beeindruckend, aber nicht gerade tagesaktuell. Mit MCP bekommt Claude Zugriff auf deine Live-Daten. "Welcher Workshop findet morgen statt?" – Boom, Claude weiß es!

#### 🔒 **Sicherheit first (Claude ist kein Spion)**
Du gibst Claude nur Zugriff auf das, was er wirklich braucht. Es ist wie ein Backstage-Pass für genau die Bereiche, die relevant sind – nicht für die ganze Arena.

#### ♻️ **Write once, use everywhere**
Einmal einen MCP Server schreiben, und jeder Claude-Nutzer kann davon profitieren. Es ist wie eine App im App Store, nur für KI-Assistenten.

#### 🎯 **Standards sind sexy**
Okay, vielleicht nicht sexy, aber definitiv praktisch. Ein einheitliches Protokoll bedeutet, dass dein Server mit jeder MCP-kompatiblen KI funktioniert. Zukunftssicher? Check!

## Unser Praxisbeispiel: Der Workshops.DE MCP Server

Zeit für etwas Praxis! Bei [Workshops.DE](https://workshops.de) hatten wir ein Problem: Unser Support-Team verbrachte gefühlt die Hälfte des Tages damit, Fragen wie "Wann ist der nächste Angular-Kurs?" oder "Wer ist der Trainer für Docker?" zu beantworten. Die Informationen waren alle da – in unserer API. Aber Claude konnte nicht darauf zugreifen.

Also dachte ich mir: "Was wäre, wenn Claude einfach selbst nachschauen könnte?" Spoiler Alert: Er kann es jetzt! 🎉

### Die Werkzeugkiste, die wir Claude gegeben haben

Stell dir vor, wir haben Claude einen Werkzeugkasten gegeben, und darin sind sechs spezialisierte Tools:

#### 🔧 **Tool 1: list_courses** - Der Kurs-Scanner
"Claude, zeig mir alle Kurse!" – Und Claude rattert dir die komplette Liste runter, von Angular bis Vue.js.

#### 🔨 **Tool 2: get_course_events** - Der Termin-Finder
"Wann findet der nächste React-Kurs statt?" – Claude schaut nach und sagt dir nicht nur wann, sondern auch wo und mit wem.

#### 👥 **Tool 3: list_trainers** - Das Trainer-Verzeichnis
"Wer sind eure Trainer?" – Claude kennt sie alle persönlich (naja, digital persönlich).

#### 🎯 **Tool 4: get_course_trainers** - Der Kurs-Trainer-Matcher
"Wer unterrichtet TypeScript?" – Claude weiß genau, welcher Experte für welchen Kurs zuständig ist.

#### 📅 **Tool 5: list_events** - Der Event-Kalender
"Was läuft denn so in den nächsten Monaten?" – Claude hat den kompletten Überblick über alle kommenden Schulungen.

#### 🔍 **Tool 6: get_event** - Die Event-Lupe
"Erzähl mir mehr über Event XY!" – Claude liefert dir alle Details, die du brauchst.

Jedes dieser Tools ist wie ein spezialisierter Mitarbeiter, der genau eine Aufgabe perfekt beherrscht. Zusammen bilden sie ein Dream-Team!

## Schritt 1: Das Fundament legen (oder: Wie alles begann)

Okay, genug Theorie – lass uns die Ärmel hochkrempeln! Die Reise beginnt, wie so oft im Leben eines Entwicklers, mit einem leeren Ordner und großen Träumen.

```bash
mkdir workshops-de-mcp
cd workshops-de-mcp
npm init -y
```

An diesem Punkt ist unser Projekt wie ein frisch bezogenes Apartment – leer, aber voller Potenzial. Der `npm init -y` Befehl ist dabei wie der übereifrige Makler, der einfach "Ja" zu allem sagt und uns eine Standard-`package.json` hinterlässt.

### Die Zutaten für unseren MCP-Cocktail

Jeder gute Koch weiß: Die richtigen Zutaten sind entscheidend. Für unseren MCP Server brauchen wir genau zwei Hauptzutaten:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4",  // Das Gehirn der Operation
    "axios": "^1.7.9"                        // Der Bote, der mit APIs spricht
  }
}
```

#### 🧠 **@modelcontextprotocol/sdk** - Das Gehirn
Das ist Anthropics offizielles SDK. Es kümmert sich um die ganze MCP-Magie: Protokoll-Handling, Nachrichtenaustausch, und all die langweiligen Details, die du nicht selbst implementieren willst. Trust me, du willst sie nicht selbst implementieren.

#### 📮 **axios** - Der zuverlässige Postbote
Axios ist wie der Postbote, der bei Wind und Wetter deine HTTP-Requests ausliefert. Klar, könntest du auch `fetch` nehmen, aber Axios hat diese netten Features wie automatisches JSON-Parsing und bessere Fehlerbehandlung. Und wer mag schon Fehler? Niemand.

Ein schnelles `npm install` später, und wir haben alles, was wir brauchen.

## Schritt 2: Claude's Gehirn verdrahten (Der MCP Server Code)

Zeit, Leben in unseren Server zu hauchen. Ein MCP Server ist wie ein gut organisiertes Restaurant: Es gibt die Küche (Server), die Speisekarte (Tool-Definitionen) und die Kellner (Handler). Lass uns das Stück für Stück aufbauen.

### 1. Die Geburtsstunde unseres Servers

```javascript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: '@workshops.de/mcp',
    version: '1.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
```

Lass mich das dekodieren:

#### 🎯 **Die Shebang-Zeile** (`#!/usr/bin/env node`)
Diese mysteriöse erste Zeile ist wie ein Zauberstab, der deiner Datei sagt: "Du bist jetzt ausführbar!" Ohne sie würde dein Server später bei `npx` nur verwirrt herumstehen.

#### 📡 **StdioServerTransport** - Die Kommunikationsschnittstelle
Das ist der Kanal, über den Claude und dein Server plaudern. Sie sprechen über "Standard Input/Output" miteinander – wie zwei Dosen, die mit einer Schnur verbunden sind, nur digitaler.

#### 🏷️ **Name und Version**
Dein Server braucht eine Identität! Der Name wird später wichtig für npm, und die Version... nun ja, ohne Version ist es wie ein Buch ohne Seitenzahlen.

#### 💪 **Capabilities**
Hier sagen wir Claude: "Hey, wir haben Tools für dich!" Es ist wie ein Werkzeugkasten, den wir ankündigen, aber noch nicht geöffnet haben.

### 2. Die Speisekarte schreiben (Tool-Definitionen)

Jetzt kommt der spaßige Teil! Wir erstellen quasi eine Speisekarte für Claude. Jedes Tool ist wie ein Gericht, das wir anbieten, komplett mit Beschreibung und Zutaten (Parameter).

```javascript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_courses',
        description: 'Zeigt alle verfügbaren Kurse von Workshops.DE an',
        inputSchema: {
          type: 'object',
          properties: {},  // Keine Parameter nötig - einfach bestellen!
        },
      },
      {
        name: 'get_course_events',
        description: 'Zeigt alle Events/Termine für einen bestimmten Kurs an',
        inputSchema: {
          type: 'object',
          properties: {
            courseId: {
              type: 'string',
              description: 'Die ID des Kurses',
            },
          },
          required: ['courseId'],  // Pflichtangabe, wie "mit oder ohne Zwiebeln?"
        },
      },
      // Weitere Tools...
    ],
  };
});
```

**Pro-Tipp aus der Praxis:** Die Beschreibungen sind SUPER wichtig! Claude liest diese und entscheidet basierend darauf, welches Tool er verwenden soll. Schreib sie so, als würdest du einem neuen Kollegen erklären, was das Tool macht. 

Ich habe anfangs Beschreibungen wie "get courses" geschrieben. Claude war verwirrt. Jetzt schreibe ich "Zeigt alle verfügbaren Kurse von Workshops.DE an" – viel besser! Claude ist schlau, aber er ist kein Gedankenleser.

#### Die Anatomie einer Tool-Definition

```javascript
{
  name: 'get_course_events',           // Der technische Name (kebab-case ist hip)
  description: 'Was das Tool macht',   // Claude's Entscheidungsgrundlage
  inputSchema: {                       // Das JSON-Schema für Parameter
    type: 'object',
    properties: {
      courseId: {
        type: 'string',
        description: 'Hilf Claude zu verstehen, was er hier eingeben soll',
      },
    },
    required: ['courseId'],            // Ohne das geht's nicht!
  },
}
```

Es ist wie ein Rezept: Name des Gerichts, Beschreibung, Zutatenliste, und welche Zutaten unverzichtbar sind.

### 3. Die Kellner instruieren (Tool-Handler implementieren)

Okay, wir haben die Speisekarte – jetzt brauchen wir Kellner, die die Bestellungen auch ausführen! Die Tool-Handler sind das Herzstück deines Servers. Hier passiert die echte Magie.

```javascript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Der große Switch – wie ein Kellner, der Bestellungen sortiert
  try {
    switch (name) {
      case 'list_courses': {
        // "Eine Portion 'Alle Kurse', kommt sofort!"
        const response = await axios.get(`${BASE_URL}/course/`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }
      
      case 'get_course_events': {
        const { courseId } = args;
        
        // Erst mal checken: Hat der Gast überhaupt gesagt, welchen Kurs er meint?
        if (!courseId) {
          throw new Error('courseId ist erforderlich – ich bin gut, aber kein Gedankenleser!');
        }
        
        // "Events für Kurs XY? Bin schon unterwegs zur Küche!"
        const response = await axios.get(`${BASE_URL}/course/${courseId}/events`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }
      // Weitere Handler...
    }
  } catch (error) {
    // Ups, was ist schiefgelaufen? Zeit für Schadensbegrenzung!
    return {
      content: [
        {
          type: 'text',
          text: `Fehler: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});
```

**Was hier wirklich passiert:**

1. **Request empfangen**: Claude sagt "Ich hätte gerne die Kursliste"
2. **Parameter auspacken**: Wir schauen, was genau bestellt wurde
3. **API anrufen**: Unser axios-Postbote rennt los zur API
4. **Antwort formatieren**: Die Daten hübsch als JSON verpacken
5. **Zurück zu Claude**: "Hier, bitteschön!"

#### 🎭 Die Kunst des Error Handlings

Fehler sind wie ungebetene Gäste auf einer Party – sie tauchen immer auf, wenn man sie am wenigsten erwartet. Aber ein guter Gastgeber (bzw. Server) weiß damit umzugehen:

```javascript
if (!courseId) {
  throw new Error('courseId ist erforderlich');
}
```

Das ist wie wenn ein Kellner fragt: "Welchen Wein hätten Sie gerne?" und der Gast antwortet: "Ja." 

Nicht sehr hilfreich, oder? Deshalb prüfen wir die Parameter und geben Claude eine klare Rückmeldung, was fehlt.

## Schritt 3: Wenn's mal kracht (Professionelle Fehlerbehandlung)

Murphy's Law gilt auch in der Programmierung: Was schiefgehen kann, wird schiefgehen. Aber keine Panik! Mit einer guten Fehlerbehandlung verwandeln wir Katastrophen in kleine Hürden.

```javascript
catch (error) {
  let errorMessage = 'Ein Fehler ist aufgetreten';
  
  // Der Fehler-Detektiv ermittelt
  if (error.response) {
    // Fall 1: Die API hat geantwortet, aber sie ist nicht glücklich
    errorMessage = `API Fehler: ${error.response.status} - ${error.response.statusText}`;
    if (error.response.data) {
      errorMessage += `\nDetails: ${JSON.stringify(error.response.data)}`;
    }
  } else if (error.request) {
    // Fall 2: Die Nachricht kam nie an (Internetausfall? API down?)
    errorMessage = 'Keine Antwort vom Server erhalten';
  } else {
    // Fall 3: Irgendwas anderes ist explodiert
    errorMessage = error.message || errorMessage;
  }

  return {
    content: [{
      type: 'text',
      text: `Fehler: ${errorMessage}`,
    }],
    isError: true,
  };
}
```

**Die drei Arten von Fehlern (eine Taxonomie des Scheiterns):**

### 🚨 **Response-Fehler** (Die API mag uns nicht)
```
API Fehler: 404 - Not Found
Details: {"message": "Kurs nicht gefunden"}
```
Das ist wie wenn du im Restaurant etwas bestellst, was nicht auf der Karte steht. Der Koch (API) sagt: "Nö, haben wir nicht."

### 📡 **Request-Fehler** (Houston, wir haben ein Problem)
```
Keine Antwort vom Server erhalten
```
Die Verbindung ist weg. Wie wenn du im Restaurant sitzt, bestellst, aber der Kellner ist verschwunden. Awkward.

### 💥 **Sonstige Fehler** (Die mysteriösen Unbekannten)
```
Cannot read property 'data' of undefined
```
Die gefürchteten JavaScript-Fehler. Wie wenn du im Restaurant die Speisekarte öffnest und sie explodiert. Niemand weiß warum.

**Pro-Tipp:** Immer spezifische Fehlermeldungen zurückgeben! Claude kann dann dem Nutzer sagen: "Die API ist gerade nicht erreichbar" statt nur "Error". Nutzer lieben Kontext, genau wie guten Kaffee.

## Schritt 4: Ready for Takeoff (npm-Vorbereitung)

Dein Server funktioniert lokal? Großartig! Aber was nützt das beste Restaurant, wenn niemand den Weg dorthin findet? Zeit, deinen Server der Welt zu präsentieren – via npm!

### Die package.json auf Steroide

Unsere bescheidene `package.json` bekommt jetzt ein ernsthaftes Upgrade. Es ist wie der Unterschied zwischen einem Praktikanten-Ausweis und einer CEO-Visitenkarte:

```json
{
  "name": "@workshops.de/mcp",              // Unser schicker Namespace
  "version": "1.1.0",                       // Semantic Versioning FTW!
  "description": "MCP Server für Workshops.DE API - Claude lernt unsere Kurse kennen",
  "main": "index.js",                       // Die Hauptattraktion
  "type": "module",                         // Wir sind modern, wir nutzen ES Modules
  "bin": {
    "workshops-de-mcp": "./index.js"        // Der magische npx-Enabler
  },
  "publishConfig": {
    "access": "public"                      // Sharing is caring
  },
  "engines": {
    "node": ">=16.0.0"                     // Sorry, Node 12, du bist zu alt
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/workshops-de/mcp-server"
  },
  "keywords": [
    "mcp", "claude", "ai", "workshops"      // SEO für npm
  ],
  "author": "Dein Name (oder deine Firma)",
  "license": "MIT"                          // Freiheit für alle!
}
```

**Die geheimen Zutaten erklärt:**

#### 🏷️ **Scoped Package Name** (`@workshops.de/mcp`)
Das `@` macht dein Package schick! Es ist wie eine eigene Marke auf npm. Außerdem verhindert es Namenskollisionen. Niemand kann jetzt einfach ein "workshops.de" Package erstellen und Verwirrung stiften.

#### 🎯 **Das bin-Feld** (Der npx-Zaubertrick)
```json
"bin": {
  "workshops-de-mcp": "./index.js"
}
```
Das ist der Grund, warum später `npx @workshops.de/mcp` funktioniert! Ohne das würde npx nur verwirrt die Schultern zucken.

#### 🌍 **publishConfig** (Teilen macht Freude)
Scoped Packages sind standardmäßig privat. Mit `"access": "public"` sagst du npm: "Hey, das ist für alle da!"

#### 🚀 **engines** (Keine Oldtimer erlaubt)
Node.js 16+ only! Warum? Weil wir moderne Features nutzen und nicht in der Steinzeit leben wollen.

## Schritt 5: Der große Moment (Ab auf npm!)

Du hast es bis hierher geschafft! Dein Server läuft, die package.json ist konfiguriert, und die .npmignore filtert die richtigen Dateien. Zeit für die Veröffentlichung!

### 1. Der npm-Login (Dein Backstage-Pass)

Zuerst musst du dich bei npm anmelden. Falls du noch keinen Account hast, schnell auf [npmjs.com](https://npmjs.com) einen erstellen. Kostet nichts, außer 2 Minuten deiner Zeit.

```bash
npm login
```

npm wird dich nach Username, Passwort und E-Mail fragen. Und dann noch nach einem OTP-Code, falls du 2FA aktiviert hast (was du haben solltest – Sicherheit first!).

**Mögliche Stolperfalle:** Wenn du in einer Firma arbeitest, nutzt ihr vielleicht eine private npm Registry. Stelle sicher, dass du auf die öffentliche npmjs.com Registry zeigst:

```bash
npm config set registry https://registry.npmjs.org/
```

### 2. Die Generalprobe (Safety first!)

Bevor wir live gehen, machen wir einen Testlauf. Das ist wie die Generalprobe vor der Premiere:

```bash
npm pack --dry-run
```

Das zeigt dir genau, welche Dateien in dein Package wandern. Überprüfe die Liste! Sollte so aussehen:

```
npm notice 📦  @workshops.de/mcp@1.1.0
npm notice === Tarball Contents ===
npm notice 1.2kB  README.md
npm notice 5.8kB  index.js
npm notice 796B   package.json
npm notice 1.1kB  LICENSE
npm notice === Tarball Details ===
npm notice name:          @workshops.de/mcp
npm notice version:       1.1.0
npm notice filename:      workshops.de-mcp-1.1.0.tgz
npm notice package size:  4.8 kB
npm notice unpacked size: 14.0 kB
```

Sieht gut aus? Keine 100MB node_modules dabei? Perfekt!

### 3. Showtime! (Die Veröffentlichung)

Tief durchatmen. Hier kommt der magische Moment:

```bash
npm publish --access public
```

Das `--access public` ist wichtig für scoped packages! Ohne das würde npm denken, du willst ein privates Package veröffentlichen (was Geld kostet).

**Was jetzt passiert:**
1. npm packt deine Dateien zusammen
2. Lädt sie auf die npm Registry hoch
3. Macht dein Package weltweit verfügbar
4. Du bist offiziell ein npm-Autor! 🎉

### 4. Der Realitäts-Check

Hat es geklappt? Lass uns nachschauen:

```bash
# Info über dein Package abrufen
npm view @workshops.de/mcp

# Die ultimative Probe - funktioniert npx?
npx -y @workshops.de/mcp
```

Wenn du "Workshops.DE MCP Server läuft..." siehst, herzlichen Glückwunsch! 🥳

### 5. Die Siegesrunde

Jetzt kannst du auf [npmjs.com/package/@workshops.de/mcp](https://npmjs.com/package/@workshops.de/mcp) gehen und dein Package in seiner ganzen Pracht bewundern. Die Download-Zahlen sind anfangs bei 0, aber hey, jeder fängt mal klein an!

**Pro-Tipps für npm-Helden:**

- **Version Bumping**: Für Updates nutze `npm version patch/minor/major`
- **README ist King**: Ein gutes README auf npm ist wie ein gutes Schaufenster
- **Tags nutzen**: `npm publish --tag beta` für Vorabversionen
- **2FA aktivieren**: Sicherheit geht vor!

## Schritt 6: Claude trifft Server (Die Desktop Integration)

Dein Server ist auf npm – fantastisch! Aber wie bringen wir Claude dazu, ihn zu nutzen? Zeit für das große Kennenlernen!

### Die Claude Desktop Konfiguration (Das erste Date)

Claude Desktop speichert seine Konfiguration in einer JSON-Datei. Je nach Betriebssystem findest du sie hier:

**macOS** (im versteckten Library-Ordner):
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows** (in AppData, auch gerne versteckt):
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux** (für die 3 Leute, die Claude auf Linux nutzen 😉):
```bash
~/.config/Claude/claude_desktop_config.json
```

### Die magische Konfiguration

Öffne die Datei in deinem Lieblings-Editor und füge deinen Server hinzu:

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

**Was passiert hier?**
- `"workshops-de"`: Ein beliebiger Name für deinen Server (erscheint in Claude)
- `"command": "npx"`: Der Befehl zum Starten
- `"args": ["-y", "@workshops.de/mcp"]`: Die Argumente (`-y` = yes to all)

### Der npx-Zauber (Warum es so genial ist)

Die Kombination aus npm und npx ist wie Uber für Code:

1. **Keine Installation nötig**: npx lädt das Package on-demand
2. **Immer aktuell**: Bei jedem Start wird die neueste Version geladen
3. **Kein Versions-Chaos**: Nutzer müssen sich nie um Updates kümmern
4. **Plattformunabhängig**: Funktioniert überall, wo Node.js läuft

### Der erste Test (Moment der Wahrheit)

1. **Speichere** die Konfiguration
2. **Starte Claude Desktop neu** (wichtig!)
3. **Öffne einen neuen Chat**
4. **Frage Claude** nach deinen Workshops

```
Du: "Welche Angular-Kurse bietet Workshops.DE an?"

Claude: "Lass mich das für dich nachschauen... 
[Nutzt im Hintergrund list_courses]
Hier sind die aktuellen Angular-Kurse..."
```

Wenn Claude antwortet und dabei deine echten Kursdaten nutzt – BINGO! 🎯

### Troubleshooting (Wenn's nicht klappt)

**Claude findet den Server nicht?**
- Prüfe die JSON-Syntax (fehlendes Komma = Game Over)
- Ist Node.js installiert? (`node --version`)
- Claude Desktop wirklich neugestartet?

**Server startet, aber keine Tools?**
- Check die Server-Logs in Claude's Developer Tools
- Stimmt der Package-Name?
- Firewall/Antivirus blockiert vielleicht?

**Pro-Tipp**: Claude Desktop hat Developer Tools! `Cmd+Option+I` (Mac) oder `Ctrl+Shift+I` (Windows) – super für Debugging!

## Praktische Anwendung (Claude in Action)

Lass uns mal schauen, wie das Ganze in der Praxis aussieht. Hier ein paar echte Konversationen zwischen mir und Claude, nachdem der MCP Server installiert war:

### Beispiel 1: Der Kurs-Finder

```
Ich: "Hey Claude, ich suche einen TypeScript-Kurs. Was habt ihr da im Angebot?"

Claude: "Lass mich mal in unserem Kurskatalog nachschauen... 
[🔧 Nutzt list_courses Tool]

Ich habe mehrere TypeScript-Kurse gefunden:

1. **Angular & TypeScript Intensiv-Schulung**
   - 6 Tage intensives Training
   - Nächster Termin: 30. Juli 2025
   - Remote verfügbar
   - Preis: 1.679 €

2. **React & TypeScript Intensiv-Schulung**
   - 6 Tage mit Fokus auf React + TypeScript
   - Nächster Termin: 6. August 2025
   - Auch remote
   - Preis: 1.679 €

Welcher Ansatz interessiert dich mehr - Angular oder React?"
```

### Beispiel 2: Der Termin-Scout

```
Ich: "Gibt es im September irgendwelche Schulungen in Berlin?"

Claude: "Ich schaue mal nach Präsenz-Schulungen in Berlin im September...
[📅 Nutzt list_events Tool]
[🔍 Filtert nach Location und Datum]

Für September in Berlin habe ich folgende Schulungen gefunden:

1. **Vue.js & TypeScript** (10.-12. September)
   - 3 Tage Intensivkurs
   - GLS Campus Berlin
   - Mit Sebastian Springer

2. **Docker Grundlagen** (25.-26. September)
   - 2 Tage kompakt
   - Auch in Berlin-Mitte
   - Hands-on Workshop

Soll ich dir mehr Details zu einer der Schulungen geben?"
```

### Beispiel 3: Der Trainer-Check

```
Ich: "Wer unterrichtet eigentlich die Angular-Kurse?"

Claude: "Ich schaue mal nach unseren Angular-Trainern...
[👥 Nutzt get_course_trainers mit courseId 'angular-typescript']

Unsere Angular-Kurse werden von mehreren erfahrenen Trainern geleitet:

- **David Müllerchen**: Juli-Termin, bekannt für praxisnahe Beispiele
- **Andreas Tennert**: Dezember-Termin, Angular-Experte der ersten Stunde
- **Michael Berger**: Spezialisiert auf Angular Advanced

Alle Trainer sind aktive Entwickler mit jahrelanger Projekt- und Schulungserfahrung. 
Möchtest du mehr über einen bestimmten Trainer erfahren?"
```

### Behind the Scenes

Was Claude hier macht, ist beeindruckend elegant:

1. **Natürliche Sprache → Tool-Auswahl**: Claude versteht "TypeScript-Kurs" und wählt `list_courses`
2. **Intelligentes Filtern**: Bei "September in Berlin" nutzt er `list_events` und filtert selbstständig
3. **Kontext-Verständnis**: Er merkt sich, worüber ihr sprecht und bietet relevante Follow-ups

Das Beste? Der Nutzer merkt gar nicht, dass im Hintergrund API-Calls laufen. Es fühlt sich an, als hätte Claude das Wissen einfach parat.

## Fazit: Die Zukunft ist vernetzt (und Claude ist dabei)

Vom leeren Ordner zum veröffentlichten npm-Package, von "Claude kennt meine API nicht" zu "Claude ist mein neuer API-Experte" – wir haben gemeinsam einen kompletten MCP Server entwickelt. 

Was wir hier gebaut haben, ist mehr als nur ein technisches Spielzeug. Es ist ein Glimpse in die Zukunft der Software-Entwicklung, wo KI-Assistenten nahtlos mit unseren Systemen interagieren. Stell dir vor:

- **Dein Customer Support** beantwortet Fragen mit Live-Daten
- **Deine Entwickler** fragen Claude nach dem Status ihrer Deployments
- **Dein Sales-Team** lässt sich von Claude die neuesten Zahlen präsentieren
- **Deine Dokumentation** wird durch Claude lebendig und interaktiv

### Was haben wir gelernt?

1. **MCP ist mächtiger als es aussieht**: Mit ein paar hundert Zeilen Code haben wir Claude eine komplett neue Fähigkeit gegeben
2. **npm + npx = Magic**: Die Kombination macht Distribution und Updates zum Kinderspiel
3. **Standards rocken**: Dank MCP funktioniert unser Server mit jeder kompatiblen KI
4. **Die Community wartet**: Es gibt noch so viele APIs, die auf ihre MCP-Server warten!

### Ideen für deine eigenen MCP-Abenteuer

Jetzt wo du weißt, wie's geht, hier ein paar Inspirationen für deine eigenen Projekte:

#### 🗄️ **Der Database-Whisperer**
```javascript
tools: ['query_users', 'get_statistics', 'check_system_health']
// "Claude, wie viele neue User hatten wir letzte Woche?"
```

#### 🚀 **Der DevOps-Butler**
```javascript
tools: ['check_deployment', 'view_logs', 'rollback_version']
// "Claude, ist das Production-Deployment durchgelaufen?"
```

#### 📊 **Der Analytics-Guru**
```javascript
tools: ['get_conversion_rate', 'compare_periods', 'forecast_revenue']
// "Claude, wie entwickelt sich unser Q4 im Vergleich zum Vorjahr?"
```

#### 📚 **Der Docs-Navigator**
```javascript
tools: ['search_documentation', 'find_examples', 'explain_concept']
// "Claude, zeig mir Beispiele für React Hooks in unserer Doku"
```

#### 🎮 **Der Gaming-Assistant**
```javascript
tools: ['check_server_status', 'get_player_stats', 'find_teammates']
// "Claude, sind die EU-Server online?"
```

### Die MCP-Revolution hat gerade erst begonnen

Was wir heute gebaut haben, ist erst der Anfang. MCP ist noch jung, die Community wächst, und die Möglichkeiten sind endlos. In ein paar Jahren werden wir zurückschauen und sagen: "Weißt du noch, als KI-Assistenten keine APIs konnten?"

### Action Time! 🚀

1. **Probier's aus**: Installiere den [@workshops.de/mcp](https://www.npmjs.com/package/@workshops.de/mcp) Server und spiel damit
2. **Bau was Eigenes**: Nimm den Code als Template und connecte deine eigene API
3. **Share the Love**: Veröffentliche deinen Server auf npm
4. **Join the Community**: Tausch dich mit anderen MCP-Entwicklern aus

### Ein persönliches Wort zum Schluss

Als ich anfing, diesen MCP Server zu entwickeln, dachte ich: "Nettes Feature, mal schauen was draus wird." Jetzt, ein paar Wochen später, kann ich mir Claude ohne MCP gar nicht mehr vorstellen. Es ist wie der Unterschied zwischen einem Smartphone ohne und mit Internet – theoretisch nutzbar, aber das volle Potenzial entfaltet sich erst mit der Verbindung zur Außenwelt.

Also, worauf wartest du noch? Deine APIs warten darauf, mit Claude zu plaudern. Und wer weiß – vielleicht ist dein MCP Server der nächste, der auf der npm-Trending-Page landet!

**Happy Coding & Keep Building! 🎯**

---

### Bereits verfügbare MCP Server

Die MCP-Community wächst rasant! Hier einige spannende Server, die bereits verfügbar sind:

- **🗂️ Google Drive** - Durchsuche und verwalte deine Google Drive Dateien direkt aus Claude
- **📝 Notion** - Greife auf deine Notion-Datenbanken und Seiten zu
- **🎯 Jira** - Verwalte Issues, erstelle Tickets und tracke Projekte
- **🎨 Canva** - Erstelle und bearbeite Designs direkt aus der Konversation
- **🎵 Spotify (lokal)** - Steuere deine lokale Spotify-Instanz
- **📊 Airtable** - Arbeite mit deinen Airtable-Datenbanken
- **💾 SQLite** - Führe SQL-Queries auf lokalen Datenbanken aus
- **🔍 Elasticsearch** - Durchsuche deine Elasticsearch-Indizes

Und viele mehr! Die Liste wächst täglich, da immer mehr Entwickler ihre eigenen MCP Server erstellen und teilen.

### Ressourcen & Links

- 📦 **[Der fertige MCP Server auf npm](https://www.npmjs.com/package/@workshops.de/mcp)**
- 🐙 **[Source Code auf GitHub](https://github.com/workshops-de/mcp-server)**
- 📚 **[Offizielle MCP Dokumentation](https://modelcontextprotocol.io)**
- 🎓 **[Workshops.DE - Lerne mehr über KI & Entwicklung](https://workshops.de)**
- 🌐 **[MCP Server Registry](https://github.com/punkpeye/awesome-mcp-servers)** - Liste aller verfügbaren Server