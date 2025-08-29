interface GrokSearchResult {
  type: 'web' | 'twitter' | 'ex';
  title: string;
  url: string;
  snippet: string;
  author?: string;
  date?: string;
  profile_image?: string;
  verified?: boolean;
  engagement?: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
}

interface GrokResponse {
  response: string;
  sources: GrokSearchResult[];
  raw_response?: unknown;
}

interface GrokChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokChatRequest {
  messages: GrokChatMessage[];
  max_sources?: number;
  enable_web_search?: boolean;
  enable_ex_search?: boolean;
  enable_twitter_search?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export class GrokService {
  private apiKey: string;
  private baseUrl = 'https://api.x.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(request: GrokChatRequest): Promise<GrokResponse> {
    try {
      const requestBody = {
        model: 'grok-2-1212',
        messages: request.messages,
        max_tokens: request.max_tokens || 3000,
        temperature: request.temperature || 0.8,
        stream: false,
        // Grok has built-in search capabilities - no explicit tools needed
        // Additional parameters for better responses
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Grok API error response:', errorText);
        throw new Error(`Grok API error: HTTP ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Extract the main response
      const mainResponse = data.choices?.[0]?.message?.content || 'I apologize, but I cannot provide a response right now.';
      
      // Extract sources from tool calls or metadata
      const sources = this.extractSources(data);

      return {
        response: mainResponse,
        sources,
        raw_response: data
      };

    } catch (error) {
      console.error('Grok service error:', error);
      throw error;
    }
  }

  private extractSources(data: unknown): GrokSearchResult[] {
    const sources: GrokSearchResult[] = [];

    // Extract sources from tool calls - Grok live_search format
    if (data && typeof data === 'object' && 'choices' in data) {
      const choices = (data as { choices?: unknown[] }).choices;
      if (Array.isArray(choices) && choices[0] && typeof choices[0] === 'object' && 'message' in choices[0]) {
        const message = (choices[0] as { message?: { tool_calls?: unknown[] } }).message;
        if (message?.tool_calls && Array.isArray(message.tool_calls)) {
          for (const toolCall of message.tool_calls) {
            if (toolCall && typeof toolCall === 'object' && 'type' in toolCall && toolCall.type === 'live_search') {
              const functionData = (toolCall as { function?: { arguments?: string } }).function;
              if (functionData?.arguments) {
                try {
                  const searchResults = JSON.parse(functionData.arguments);
                  
                  // Handle web results
                  if (searchResults.web_results && Array.isArray(searchResults.web_results)) {
                    for (const result of searchResults.web_results) {
                      if (result && typeof result === 'object') {
                        sources.push({
                          type: 'web',
                          title: result.title || 'Web Result',
                          url: result.url || result.link || '',
                          snippet: result.snippet || result.description || result.content || '',
                          date: result.date || result.published_date
                        });
                      }
                    }
                  }
                  
                  // Handle social/X results
                  if (searchResults.social_results || searchResults.x_results) {
                    const socialResults = searchResults.social_results || searchResults.x_results;
                    if (Array.isArray(socialResults)) {
                      for (const result of socialResults) {
                        if (result && typeof result === 'object') {
                          sources.push({
                            type: result.platform === 'twitter' || result.platform === 'x' ? 'twitter' : 'ex',
                            title: (result.text || result.content || '').substring(0, 100) + '...' || 'Social Post',
                            url: result.url || result.permalink || '',
                            snippet: result.text || result.content || '',
                            author: result.username || result.author,
                            date: result.created_at || result.date,
                            profile_image: result.profile_image_url || result.avatar,
                            verified: result.verified,
                            engagement: result.engagement || {
                              likes: result.like_count || result.favorites,
                              retweets: result.retweet_count || result.shares,
                              replies: result.reply_count || result.comments
                            }
                          });
                        }
                      }
                    }
                  }
                } catch (parseError) {
                  console.warn('Error parsing search results:', parseError);
                }
              }
            }
          }
        }
      }
    }

    // Alternative extraction from direct response metadata
    if (sources.length === 0 && data && typeof data === 'object') {
      // Check for sources in various possible locations in the response
      const dataObj = data as Record<string, unknown>;
      const possibleSources = dataObj.sources || dataObj.search_results || dataObj.references || [];
      
      if (Array.isArray(possibleSources)) {
        for (const source of possibleSources) {
          if (source && typeof source === 'object') {
            const sourceObj = source as Record<string, unknown>;
            sources.push({
              type: sourceObj.type === 'social' || sourceObj.platform === 'twitter' ? 'twitter' : 'web',
              title: sourceObj.title as string || sourceObj.name as string || 'Source',
              url: sourceObj.url as string || sourceObj.link as string || '',
              snippet: sourceObj.snippet as string || sourceObj.description as string || sourceObj.content as string || '',
              author: sourceObj.author as string || sourceObj.username as string,
              date: sourceObj.date as string || sourceObj.created_at as string
            });
          }
        }
      }
    }

    return sources.slice(0, 40); // Allow up to 40 total sources (from both web and social)
  }

  // Helper method to create a properly formatted chat request
  static createChatRequest(
    systemPrompt: string,
    userMessage: string,
    chatHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
    options: {
      maxSources?: number;
      enableWebSearch?: boolean;
      enableTwitterSearch?: boolean;
      temperature?: number;
    } = {}
  ): GrokChatRequest {
    const messages: GrokChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    return {
      messages,
      max_sources: options.maxSources || 20,
      enable_web_search: options.enableWebSearch !== false,
      enable_ex_search: true, // Always enable Ex (X) search
      enable_twitter_search: options.enableTwitterSearch !== false,
      temperature: options.temperature || 0.8,
      max_tokens: 2000
    };
  }
}

export default GrokService;