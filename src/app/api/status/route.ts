import { NextResponse } from 'next/server';

export async function GET() {
  const grokKey = process.env.GROK_API_KEY;
  
  if (!grokKey || grokKey === 'your_grok_api_key_here') {
    return NextResponse.json({ 
      status: 'disconnected', 
      message: 'Grok API key not configured' 
    });
  }

  try {
    // Test connection with a simple request
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ 
        status: 'connected', 
        message: 'Grok AI is connected and ready' 
      });
    } else {
      const errorText = await response.text();
      console.error('Grok status error:', errorText);
      
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorObj = JSON.parse(errorText);
        errorMessage = errorObj.error?.message || errorObj.message || errorText;
      } catch {
        errorMessage = errorText || 'Unknown error';
      }
      
      return NextResponse.json({ 
        status: 'error', 
        message: `Connection error: ${errorMessage}` 
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to Grok AI' 
    });
  }
}