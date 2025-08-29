import { NextRequest, NextResponse } from 'next/server';

interface WebhookData {
  email: string;
  productCategory: string;
  timestamp: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const webhookData: WebhookData = await request.json();
    
    // Validate required fields
    if (!webhookData.email || !webhookData.productCategory) {
      return NextResponse.json(
        { error: 'Missing required fields: email or productCategory' },
        { status: 400 }
      );
    }

    // Get Zapier webhook URL from environment variables
    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    
    if (!zapierWebhookUrl) {
      console.log('No Zapier webhook URL configured');
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook received but no Zapier URL configured' 
      });
    }

    // Prepare data for Zapier
    const zapierPayload = {
      // Standard fields Zapier expects
      email: webhookData.email,
      product_category: webhookData.productCategory,
      timestamp: webhookData.timestamp,
      source: webhookData.source,
      
      // Additional context for tracking
      event_type: 'prompt_discovery_started',
      user_agent: request.headers.get('user-agent') || 'Unknown',
      ip_address: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'Unknown',
      
      // Useful for segmentation
      request_id: `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      
      // Marketing/analytics fields
      utm_source: 'geo-x',
      utm_medium: 'web-app',
      utm_campaign: 'prompt-discovery',
      
      // Business context
      feature_used: 'GEO-X Prompt Discovery Engine',
      plan_type: 'free', // You can make this dynamic later
      
      // Zapier-friendly timestamp formats
      date_created: new Date(webhookData.timestamp).toISOString(),
      date_created_unix: Math.floor(new Date(webhookData.timestamp).getTime() / 1000),
      date_created_readable: new Date(webhookData.timestamp).toLocaleString()
    };

    // Send to Zapier webhook
    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ElevateAI-Webhook/1.0'
      },
      body: JSON.stringify(zapierPayload),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!zapierResponse.ok) {
      console.error('Zapier webhook failed:', zapierResponse.status, zapierResponse.statusText);
      // Don't return error - we don't want to block the main flow
    } else {
      console.log('Zapier webhook sent successfully');
    }

    // Optional: Store webhook data locally for backup/analytics
    try {
      // You could add database storage here if needed
      // const { supabase } = await import('@/lib/supabase');
      // await supabase.from('webhook_logs').insert({...zapierPayload});
    } catch (dbError) {
      console.log('Database logging failed:', dbError);
      // Don't return error
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      request_id: zapierPayload.request_id
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return success even on error - we don't want to block the main user flow
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received but processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}