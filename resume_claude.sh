#!/bin/bash
# Wait until 1:05 PM then launch Claude Code with the remaining tasks
cd /Users/dongraham/Desktop/peer-pathway-project

claude --print "Read CLAUDE.md for full context. Your MCP connections to Notion, Attio, ClickUp, Stripe, and Supabase are configured. Complete the remaining tasks:

1. NOTION: Create a master page called 'EarlyEdge OS'. Import all 7 files from sops/ as sub-pages with formatting preserved. Then create pages for: Spring Week Conversion Webinar Strategy, Uthman Speaker Sourcing Playbook, and Spring Week Marketing Draft Posts (see CLAUDE.md for full content specs).

2. CLICKUP: Create a Space called 'EarlyEdge' with 3 Lists: 'Spring Week Webinar' (10 tasks), 'Systems Migration' (7 tasks), and 'Content Pipeline' (6 tasks). See CLAUDE.md for the exact task names.

3. STRIPE: Create 4 products for the Spring Week Webinar: Part 1 Only (£15), Part 2 Only (£15), Bundle (£29), Premium (£49). Get the payment links and update them in src/data/springWeekData.ts replacing the placeholder links.

4. VERIFY: Use Attio MCP to confirm both pipelines exist and ~692 contacts imported. Use Supabase MCP to confirm edge functions reference Loops API.

Execute everything without asking questions."
