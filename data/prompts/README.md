# ElevateAI Prompts Directory

This directory contains all the editable prompt files for the ElevateAI system. You can modify these files directly to customize how the AI modules behave.

## 📁 Directory Structure

```
data/prompts/
├── brand-chat/
│   ├── system-prompt.md          # Main brand chat system instructions
│   └── personas/                 # Individual persona files
│       ├── millennial-professional.md
│       ├── gen-z-student.md
│       ├── gen-x-parent.md
│       └── baby-boomer-retiree.md
├── ad-critic/
│   ├── system-prompt.md          # Ad analysis instructions
│   └── output-template.json      # Required JSON structure (DO NOT EDIT)
├── legal-lens/
│   ├── system-prompt.md          # Legal compliance analysis
│   └── output-template.json      # Required JSON structure (DO NOT EDIT)
└── geo-x/
    ├── system-prompt.md          # GEO-X system instructions
    ├── user-prompt-template.md   # User prompt template
    └── output-template.json      # Required JSON structure (DO NOT EDIT)
```

## ✅ Safe to Edit (Customize AI Behavior)

### Brand Chat
- **`brand-chat/system-prompt.md`** - Controls how personas respond to brand questions
- **`brand-chat/personas/*.md`** - Individual persona characteristics and behaviors

### Ad Critic  
- **`ad-critic/system-prompt.md`** - Controls ad analysis criteria and approach

### Legal Lens
- **`legal-lens/system-prompt.md`** - Controls legal compliance analysis approach

### GEO-X
- **`geo-x/system-prompt.md`** - Controls prompt discovery system behavior
- **`geo-x/user-prompt-template.md`** - Template for user prompt generation

## ⚠️ DO NOT EDIT (System Requirements)

### Output Templates
- **`*/output-template.json`** - These define required JSON structures for the UI
- Editing these files may break the user interface
- Only modify if you understand the corresponding UI components

## 🔧 Template Variables

Many prompt files use template variables that get replaced at runtime:

### Brand Chat Variables
- `{{persona_name}}` - Name of the persona
- `{{persona_description}}` - Persona description  
- `{{brand_name}}` - Brand name
- `{{brand_description}}` - Brand description
- `{{brand_tone}}` - Brand tone/voice

### GEO-X Variables
- `{{PRODUCT_CATEGORY}}` - Product category being analyzed
- `{{INDUSTRY_CONTEXT}}` - Industry context
- `{{TARGET_AUDIENCE}}` - Target audience
- `{{VALUE_PROPS}}` - Value propositions
- `{{COMPETITORS}}` - Competitor information

### Ad Critic Variables
- `{{brand_name}}` - Brand name
- `{{brand_industry}}` - Brand industry
- `{{brand_description}}` - Brand description
- `{{brand_tone}}` - Brand tone
- `{{brand_values}}` - Brand values
- `{{target_demographics}}` - Target demographics
- `{{demographic_ids_scores}}` - Demographic scoring structure

### Legal Lens Variables
- `{{legal_rules_context}}` - Active legal rules for analysis

## 📝 Adding New Personas

To add a new persona to Brand Chat:

1. Create a new `.md` file in `brand-chat/personas/` 
2. Use the filename as the persona ID (e.g., `tech-entrepreneur.md`)
3. Follow the structure of existing persona files
4. The system will automatically load the persona when referenced

## 🚀 Best Practices

1. **Test Changes Gradually** - Make small edits and test before major changes
2. **Keep Backups** - Save copies of working prompts before modifications
3. **Use Clear Language** - AI responds better to specific, clear instructions
4. **Maintain Consistency** - Keep similar formatting across related prompts
5. **Document Changes** - Note what modifications you made and why

## 🔄 How It Works

1. **Runtime Loading** - Prompts are loaded from files when APIs are called
2. **Template Replacement** - Variables get replaced with actual values
3. **Fallback System** - If files can't be loaded, hardcoded fallbacks are used
4. **Hot Reload** - Changes take effect immediately without restarting the server

## 🆘 Troubleshooting

If something breaks after editing prompts:

1. Check the server logs for file loading errors
2. Verify template variable syntax is correct
3. Ensure file permissions allow reading
4. Restore from backup if needed
5. Check that JSON output templates weren't accidentally modified

The system is designed to be resilient - if custom prompts fail to load, it will fall back to working defaults.