import './globals.css'

export const metadata = {
  title: 'Workshops.DE MCP Server',
  description: 'MCP Server für Workshops.DE API - Zugriff auf Kurse, Trainer und Events',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
} 