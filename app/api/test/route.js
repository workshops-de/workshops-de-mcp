export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  return Response.json({ 
    message: 'Test API route works!',
    timestamp: new Date().toISOString(),
    url: request.url
  });
}