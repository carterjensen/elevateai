import { NextResponse } from 'next/server';

export async function GET() {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey || openaiKey === 'your_openai_api_key_here') {
    return NextResponse.json({ 
      status: 'disconnected', 
      message: 'OpenAI API key not configured' 
    });
  }

  try {
    // Test connection with a simple request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ 
        status: 'connected', 
        message: 'OpenAI is connected and ready' 
      });
    } else {
      const errorText = await response.text();
      console.error('OpenAI status error:', errorText);
      
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
  } catch {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to OpenAI' 
    });
  }
}