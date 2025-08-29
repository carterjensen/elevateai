import { NextResponse } from 'next/server';

export async function GET() {
  // Check for Grok API key first (primary)
  const grokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  // Try Grok first
  if (grokKey && grokKey !== 'your_grok_api_key_here') {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${grokKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-2-1212',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        }),
      });

      if (response.ok) {
        return NextResponse.json({ 
          status: 'connected', 
          message: 'Grok AI is connected with enhanced search capabilities',
          service: 'grok',
          features: [
            'Web Search (20 sources max)',
            'X (Twitter) Search (20 sources max)', 
            'Real-time data',
            'Social media insights'
          ]
        });
      } else {
        const errorText = await response.text();
        console.error('Grok connection failed with status:', response.status, 'Response:', errorText);
      }
    } catch (error) {
      console.error('Grok test failed:', error);
    }
  }
  
  // Fallback to OpenAI
  if (!openaiKey || openaiKey === 'your_openai_api_key_here') {
    return NextResponse.json({ 
      status: 'disconnected', 
      message: 'No API keys configured' 
    });
  }

  try {
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
        message: 'OpenAI is connected (fallback mode)',
        service: 'openai',
        features: ['Standard chat responses']
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
      message: 'Failed to connect to any AI service' 
    });
  }
}