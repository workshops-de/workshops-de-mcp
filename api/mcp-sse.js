import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Start the MCP server process
  const mcpPath = path.join(__dirname, '..', 'index.js');
  const mcp = spawn('node', [mcpPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'MCP Server verbunden' })}\n\n`);

  // Forward MCP stdout to SSE
  mcp.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      if (line.startsWith('{') || line.startsWith('[')) {
        res.write(`data: ${line}\n\n`);
      }
    });
  });

  // Forward MCP stderr to SSE
  mcp.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message && !message.includes('MCP Server läuft')) {
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
    }
  });

  // Handle MCP process exit
  mcp.on('close', (code) => {
    res.write(`data: ${JSON.stringify({ type: 'closed', code })}\n\n`);
    res.end();
  });

  // Handle client disconnect
  req.on('close', () => {
    mcp.kill();
  });

  // Keep alive
  const keepAlive = setInterval(() => {
    res.write(`: keepalive\n\n`);
  }, 30000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(keepAlive);
  });
} 