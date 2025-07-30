export async function GET(request) {
  return Response.json({ message: 'Test MCP endpoint is working' });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ 
    received: body,
    message: 'POST request received' 
  });
}