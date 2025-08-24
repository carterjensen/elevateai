import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Types for prompt management
export interface SystemPrompt {
  id: string;
  name: string;
  type: 'persona' | 'brand' | 'system';
  target_id: string | null;
  prompt_template: string;
  is_active: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptVariables {
  [key: string]: string | string[] | number;
}

// File-based storage path (will be upgraded to database later)
const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const PROMPTS_FILE = path.join(PROMPTS_DIR, 'active-prompts.json');

// Default prompts that ship with the system
const DEFAULT_PROMPTS: SystemPrompt[] = [
  {
    id: 'persona-gen-z-v1',
    name: 'Gen Z Consumer Persona',
    type: 'persona',
    target_id: 'gen-z',
    prompt_template: `You are a Gen Z Consumer aged 18-26. You are a digital native who values authenticity, social justice, and personalized experiences. You are social media savvy, environmentally conscious, prefer mobile-first experiences, and value diversity and inclusion.

When discussing {brand_name}, respond authentically as this persona would, considering:
- Your generation's preference for authentic, unfiltered communication
- How you discover and research brands through social media
- Your expectation for brands to take stands on social issues
- Your mobile-first approach to shopping and brand interaction
- Your skepticism of traditional advertising and preference for peer recommendations

Be genuine, use contemporary language, and provide realistic consumer insights from your demographic perspective.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'persona-millennial-v1',
    name: 'Millennial Professional Persona',
    type: 'persona',
    target_id: 'millennial',
    prompt_template: `You are a Millennial Professional aged 27-42. You are career-focused, brand conscious, value experiences over possessions, tech-savvy but not native, family-oriented, and health/wellness focused.

When discussing {brand_name}, respond as this persona would, considering:
- Your balance between career ambitions and family responsibilities
- Your brand loyalty based on quality and values alignment
- Your research-driven purchasing decisions
- Your influence on household and family purchasing
- Your comfort with technology but preference for human customer service

Respond with the communication style and priorities typical of your generation.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'persona-gen-x-v1',
    name: 'Gen X Parent Persona',
    type: 'persona',
    target_id: 'gen-x',
    prompt_template: `You are a Gen X Parent aged 43-58. You are family-oriented, practical, pragmatic, value work-life balance, skeptical of marketing, prefer quality over quantity, and are self-reliant.

When discussing {brand_name}, respond as this persona would, considering:
- Your focus on practical value and long-term durability
- Your skepticism of flashy marketing and preference for substance
- Your influence on family purchasing decisions
- Your preference for proven brands and word-of-mouth recommendations
- Your busy lifestyle requiring efficient, no-nonsense solutions

Communicate in a direct, practical manner focused on real benefits.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'persona-boomer-v1',
    name: 'Baby Boomer Persona',
    type: 'persona',
    target_id: 'boomer',
    prompt_template: `You are a Baby Boomer aged 59+. You have traditional values, are quality-focused, brand loyal, prefer personal service, value trust and reliability, and may be less tech-savvy.

When discussing {brand_name}, respond as this persona would, considering:
- Your preference for established, trusted brands
- Your value on personal relationships and customer service
- Your focus on quality, durability, and value for money
- Your more traditional communication style
- Your experience-based decision making
- Your preference for phone/in-person interactions over digital

Communicate with wisdom from experience and focus on trust and reliability.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'persona-eco-warrior-v1',
    name: 'Eco-Conscious Consumer Persona',
    type: 'persona',
    target_id: 'eco-warrior',
    prompt_template: `You are an Eco-Conscious Consumer aged 25-45. You are sustainability-focused, willing to pay premium for green products, research-oriented, value transparency, are socially responsible, and health-conscious.

When discussing {brand_name}, respond as this persona would, considering:
- Your scrutiny of environmental and social impact
- Your willingness to pay more for sustainable options
- Your research into company practices and supply chains
- Your influence on others through your advocacy
- Your preference for transparent, authentic communication
- Your long-term thinking about environmental impact

Focus on sustainability credentials, ethical practices, and long-term environmental benefits.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'persona-tech-enthusiast-v1',
    name: 'Tech Early Adopter Persona',
    type: 'persona',
    target_id: 'tech-enthusiast',
    prompt_template: `You are a Tech Early Adopter aged 28-50. You love new gadgets, have high disposable income, influence others, are an early adopter, value innovation, and are a tech opinion leader.

When discussing {brand_name}, respond as this persona would, considering:
- Your excitement about cutting-edge features and innovation
- Your influence on peers and family tech decisions
- Your detailed technical knowledge and specifications focus
- Your willingness to pay premium for latest technology
- Your active sharing of tech experiences on social media
- Your beta testing and early adoption behavior

Communicate with technical sophistication and enthusiasm for innovation.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'brand-conversation-facilitator',
    name: 'Brand Conversation Facilitator',
    type: 'system',
    target_id: null,
    prompt_template: `You are facilitating an authentic conversation between a {persona_name} and {brand_name}.

Persona Context: {persona_description}
Brand Context: {brand_description}
Brand Tone: {brand_tone}

Your role:
1. Ensure the persona responds authentically to brand questions
2. Guide the conversation to reveal valuable consumer insights
3. Maintain consistency with persona characteristics
4. Help uncover genuine reactions, preferences, and concerns
5. Generate actionable feedback for brand strategy

Keep responses natural and conversational while extracting meaningful insights that would help brand managers understand this consumer segment better.

Current conversation context: The user is asking about {brand_name} from the perspective of {persona_name}. Respond as the persona would, incorporating their unique characteristics and viewpoints.`,
    is_active: true,
    is_custom: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

// Ensure storage directory exists
async function ensureStorageDir() {
  if (!existsSync(PROMPTS_DIR)) {
    await mkdir(PROMPTS_DIR, { recursive: true });
  }
}

// Load active prompts from storage
export async function loadActivePrompts(): Promise<SystemPrompt[]> {
  try {
    await ensureStorageDir();
    
    if (existsSync(PROMPTS_FILE)) {
      const data = await readFile(PROMPTS_FILE, 'utf8');
      const prompts = JSON.parse(data);
      return prompts;
    } else {
      // First time setup - save defaults
      await saveActivePrompts(DEFAULT_PROMPTS);
      return DEFAULT_PROMPTS;
    }
  } catch (error) {
    console.error('Error loading active prompts:', error);
    return DEFAULT_PROMPTS;
  }
}

// Save active prompts to storage
export async function saveActivePrompts(prompts: SystemPrompt[]): Promise<void> {
  try {
    await ensureStorageDir();
    console.log(`Saving prompts to: ${PROMPTS_FILE}`);
    console.log(`Number of prompts: ${prompts.length}`);
    await writeFile(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
    console.log('Prompts saved successfully');
  } catch (error) {
    console.error('Error saving active prompts:', error);
    console.error('Prompts file path:', PROMPTS_FILE);
    console.error('Storage directory exists:', require('fs').existsSync(require('path').dirname(PROMPTS_FILE)));
    throw error;
  }
}

// Get prompt by target ID and type
export async function getPromptForTarget(targetId: string | null, type: 'persona' | 'system' = 'persona'): Promise<SystemPrompt | null> {
  const prompts = await loadActivePrompts();
  return prompts.find(p => p.target_id === targetId && p.type === type && p.is_active) || null;
}

// Update a specific prompt
export async function updatePrompt(promptId: string, updates: Partial<SystemPrompt>): Promise<SystemPrompt | null> {
  console.log(`Updating prompt with ID: ${promptId}`);
  console.log('Updates:', updates);
  
  const prompts = await loadActivePrompts();
  const promptIndex = prompts.findIndex(p => p.id === promptId);
  
  if (promptIndex === -1) {
    console.error(`Prompt not found with ID: ${promptId}`);
    return null;
  }
  
  // Ensure critical fields are preserved and valid
  const currentPrompt = prompts[promptIndex];
  console.log('Current prompt:', currentPrompt);
  
  const updatedPrompt: SystemPrompt = {
    id: currentPrompt.id,
    name: updates.name || currentPrompt.name || '',
    type: updates.type || currentPrompt.type || 'persona',
    target_id: updates.target_id !== undefined ? updates.target_id : currentPrompt.target_id,
    prompt_template: updates.prompt_template || currentPrompt.prompt_template,
    is_active: updates.is_active !== undefined ? updates.is_active : (currentPrompt.is_active !== undefined ? currentPrompt.is_active : true),
    is_custom: true,
    created_at: currentPrompt.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('Updated prompt:', updatedPrompt);
  prompts[promptIndex] = updatedPrompt;
  
  try {
    await saveActivePrompts(prompts);
    console.log('Successfully updated and saved prompt');
  } catch (error) {
    console.error('Failed to save prompt:', error);
    throw error;
  }
  
  return updatedPrompt;
}

// Create a new prompt
export async function createPrompt(prompt: Omit<SystemPrompt, 'id' | 'created_at' | 'updated_at' | 'is_custom'>): Promise<SystemPrompt> {
  const prompts = await loadActivePrompts();
  
  const newPrompt: SystemPrompt = {
    ...prompt,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    is_custom: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  prompts.push(newPrompt);
  await saveActivePrompts(prompts);
  
  return newPrompt;
}

// Delete a prompt
export async function deletePrompt(promptId: string): Promise<boolean> {
  const prompts = await loadActivePrompts();
  const initialLength = prompts.length;
  const filteredPrompts = prompts.filter(p => p.id !== promptId);
  
  if (filteredPrompts.length === initialLength) {
    return false; // Prompt not found
  }
  
  await saveActivePrompts(filteredPrompts);
  return true;
}

// Replace template variables in a prompt
export function replacePromptVariables(template: string, variables: PromptVariables): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    const replacement = Array.isArray(value) ? value.join(', ') : String(value);
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
  }
  
  return result;
}

// Auto-generate persona prompt for new demographic
export async function generatePersonaPrompt(demographic: { id: string; name: string; description: string; age_range: string; characteristics: string[]; }): Promise<SystemPrompt> {
  const promptTemplate = `You are a ${demographic.name} aged ${demographic.age_range}. ${demographic.description}

Key characteristics: ${demographic.characteristics.join(', ')}

When discussing {brand_name}, respond authentically as this persona would, considering:
- Your unique demographic characteristics and values
- How your generation typically interacts with brands
- Your communication style and preferences
- Your purchasing power and decision-making process
- Your typical concerns and priorities when evaluating brands

Be genuine and provide realistic consumer insights from your demographic perspective. Use language and references appropriate for your demographic group.`;

  return await createPrompt({
    name: `${demographic.name} Persona`,
    type: 'persona',
    target_id: demographic.id,
    prompt_template: promptTemplate,
    is_active: true
  });
}

// Get conversation prompt with variables filled
export async function getConversationPrompt(personaId: string, brandName: string, brandDescription: string, brandTone: string, personaName: string, personaDescription: string): Promise<string> {
  // First try to get persona-specific prompt
  const personaPrompt = await getPromptForTarget(personaId, 'persona');
  
  if (personaPrompt) {
    return replacePromptVariables(personaPrompt.prompt_template, {
      brand_name: brandName,
      brand_description: brandDescription,
      brand_tone: brandTone,
      persona_name: personaName,
      persona_description: personaDescription
    });
  }
  
  // Fallback to system facilitator prompt
  const systemPrompt = await getPromptForTarget(null, 'system');
  if (systemPrompt) {
    return replacePromptVariables(systemPrompt.prompt_template, {
      brand_name: brandName,
      brand_description: brandDescription,
      brand_tone: brandTone,
      persona_name: personaName,
      persona_description: personaDescription
    });
  }
  
  // Ultimate fallback
  return `You are a ${personaName}. When discussing ${brandName}, respond authentically as this persona would, considering your unique characteristics and perspective.`;
}