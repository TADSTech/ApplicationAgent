#!/usr/bin/env python3
"""Generate special scenario jobs that trigger AI questions."""

import json
import os

# Special scenario jobs that should trigger questions
special_jobs = [
    {
        "id": "job-special-001",
        "title": "Senior Product Designer (Late Night Shift)",
        "company": "Silicon Valley Startup",
        "location": "Remote (US Pacific Time)",
        "remote": True,
        "salary_usd": 195000,
        "description": "Join our fast-paced startup as a Senior Product Designer. IMPORTANT: This role requires working 9 AM - 5 PM Pacific Time (6 PM - 2 AM WAT). We're building the future of fintech and need someone who can collaborate in real-time with our SF-based team.",
        "requirements": ["Figma", "Design Systems", "Fintech Experience", "Real-time Collaboration"],
        "url": "https://svstartup.com/careers/senior-product-designer",
        "timezone": "PST",
        "visa_sponsorship": True,
        "company_stage": "Series A",
        "equity": True,
        "special_scenario": "late_night_shift",
        "ai_question_trigger": {
            "question": "This role requires working 6 PM - 2 AM WAT to align with US Pacific hours. Are you comfortable with late-night shifts?",
            "context": "timezone_compatibility",
            "follow_up": "Would you consider late-night roles if the compensation was significantly higher?"
        }
    },
    {
        "id": "job-special-002",
        "title": "Lead UX Designer (Relocation Required)",
        "company": "TechCorp Berlin",
        "location": "Berlin, Germany (On-site)",
        "remote": False,
        "salary_usd": 145000,
        "description": "Lead UX Designer role at our Berlin headquarters. Full relocation package included: visa sponsorship, moving costs, housing assistance for first 3 months, and German language classes. Must be willing to relocate within 3 months of offer acceptance.",
        "requirements": ["UX Design", "Team Leadership", "German (nice to have)", "Relocation Flexibility"],
        "url": "https://techcorpberlin.com/careers/lead-ux-designer",
        "timezone": "CET",
        "visa_sponsorship": True,
        "company_stage": "Series C",
        "equity": False,
        "special_scenario": "relocation_required",
        "ai_question_trigger": {
            "question": "This role requires relocating to Berlin, Germany. Are you open to international relocation?",
            "context": "relocation_willingness",
            "follow_up": "What factors are most important to you when considering relocation? (e.g., family, cost of living, career growth)"
        }
    },
    {
        "id": "job-special-003",
        "title": "Principal Designer (Equity-Heavy Compensation)",
        "company": "Stealth Startup",
        "location": "Remote (Global)",
        "remote": True,
        "salary_usd": 120000,
        "description": "Join us as Principal Designer at a stealth-mode startup backed by top-tier VCs. Base salary is $120k, but total compensation package is $300k+ with significant equity (0.5-1.0%). We're pre-Series A and looking for someone who believes in our vision and wants to build something from the ground up.",
        "requirements": ["Product Design", "Startup Experience", "0-to-1 Building", "Equity Mindset"],
        "url": "https://stealthstartup.com/careers/principal-designer",
        "timezone": "PST",
        "visa_sponsorship": False,
        "company_stage": "Seed",
        "equity": True,
        "special_scenario": "equity_heavy",
        "ai_question_trigger": {
            "question": "This role offers lower base salary ($120k) but significant equity (0.5-1.0%). How important is equity vs. base salary to you?",
            "context": "compensation_structure",
            "follow_up": "Would you consider a 30-40% lower base salary for substantial equity in a high-growth startup?"
        }
    },
    {
        "id": "job-special-004",
        "title": "Design Manager (Hybrid - 3 Days Office)",
        "company": "Enterprise Corp",
        "location": "New York, NY (Hybrid)",
        "remote": False,
        "salary_usd": 185000,
        "description": "Design Manager role at a Fortune 500 company. Hybrid model: 3 days in Manhattan office, 2 days remote. Must be able to commute to NYC office. Leading a team of 8 designers working on enterprise software products.",
        "requirements": ["Design Leadership", "Enterprise Software", "Team Management", "NYC Commutable"],
        "url": "https://enterprisecorp.com/careers/design-manager",
        "timezone": "EST",
        "visa_sponsorship": True,
        "company_stage": "Public",
        "equity": False,
        "special_scenario": "hybrid_onsite",
        "ai_question_trigger": {
            "question": "This role requires being in the NYC office 3 days per week. Are you open to hybrid roles that require regular office presence?",
            "context": "work_location_flexibility",
            "follow_up": "If you're not currently in NYC, would you consider relocating for the right opportunity?"
        }
    },
    {
        "id": "job-special-005",
        "title": "Senior Designer (Contract - 6 Month)",
        "company": "FastGrowth Inc",
        "location": "Remote (US)",
        "remote": True,
        "salary_usd": 95,  # hourly rate
        "description": "6-month contract role (with potential to convert to full-time) for a Senior Designer. $95/hour, approximately $15,000/month. Working on a major product redesign. Contract includes no benefits but offers flexibility and high hourly rate.",
        "requirements": ["Product Design", "Rapid Prototyping", "Stakeholder Management", "Contract Experience"],
        "url": "https://fastgrowthinc.com/careers/senior-designer-contract",
        "timezone": "EST",
        "visa_sponsorship": False,
        "company_stage": "Series B",
        "equity": False,
        "special_scenario": "contract_role",
        "ai_question_trigger": {
            "question": "This is a 6-month contract role with no benefits. Are you open to contract positions?",
            "context": "employment_type",
            "follow_up": "What's your preference: stable full-time roles or higher-paying contract work?"
        }
    },
    {
        "id": "job-special-006",
        "title": "Staff Designer (Crypto/Web3 Focus)",
        "company": "BlockChain Ventures",
        "location": "Remote (Global)",
        "remote": True,
        "salary_usd": 210000,
        "description": "Staff Designer for our Web3 platform. Must have deep understanding of crypto, DeFi, and blockchain UX patterns. Part of compensation can be in company tokens. Working on cutting-edge decentralized applications.",
        "requirements": ["Web3 UX", "Crypto Knowledge", "DeFi Experience", "Blockchain Understanding"],
        "url": "https://blockchainventures.com/careers/staff-designer",
        "timezone": "GMT",
        "visa_sponsorship": True,
        "company_stage": "Series A",
        "equity": True,
        "special_scenario": "specialized_domain",
        "ai_question_trigger": {
            "question": "This role requires deep Web3/crypto experience. Do you have experience in blockchain/crypto UX?",
            "context": "domain_expertise",
            "follow_up": "Are you interested in transitioning into Web3/crypto if you don't have direct experience?"
        }
    },
    {
        "id": "job-special-007",
        "title": "Design Director (Management Heavy)",
        "company": "Scale Corp",
        "location": "San Francisco, CA",
        "remote": True,
        "salary_usd": 240000,
        "description": "Design Director managing a team of 15 designers across 3 product lines. 80% management, 20% hands-on design. Looking for someone who loves mentoring, process building, and strategic thinking more than pixel-pushing.",
        "requirements": ["Design Leadership", "Team Building", "Strategy", "Mentorship", "Process Design"],
        "url": "https://scalecorp.com/careers/design-director",
        "timezone": "PST",
        "visa_sponsorship": True,
        "company_stage": "Series D",
        "equity": True,
        "special_scenario": "management_heavy",
        "ai_question_trigger": {
            "question": "This role is 80% management, 20% hands-on design. Do you prefer management or individual contributor roles?",
            "context": "career_path",
            "follow_up": "What's your ideal balance between hands-on design work and people management?"
        }
    },
    {
        "id": "job-special-008",
        "title": "Product Designer (Early Stage Startup - High Risk/Reward)",
        "company": "Stealth Mode Co",
        "location": "Remote (Global)",
        "remote": True,
        "salary_usd": 100000,
        "description": "First design hire at a pre-seed startup. Founders are ex-Google/Meta. $100k base + 2% equity. High risk, high reward. You'll shape the entire product and design culture. Looking for someone entrepreneurial who thrives in ambiguity.",
        "requirements": ["0-to-1 Experience", "Entrepreneurial Mindset", "Full-stack Design", "Ambiguity Tolerance"],
        "url": "https://stealthmodeco.com/careers/product-designer",
        "timezone": "PST",
        "visa_sponsorship": False,
        "company_stage": "Pre-seed",
        "equity": True,
        "special_scenario": "early_stage_risk",
        "ai_question_trigger": {
            "question": "This is a pre-seed startup (high risk, high reward). What's your risk tolerance for early-stage startups?",
            "context": "risk_tolerance",
            "follow_up": "Would you trade job security for potentially life-changing equity?"
        }
    },
    {
        "id": "job-special-009",
        "title": "Senior Designer (Non-Profit - Mission Driven)",
        "company": "Global Health Initiative",
        "location": "Remote (Global)",
        "remote": True,
        "salary_usd": 85000,
        "description": "Senior Designer for a non-profit working on global health challenges. Lower salary than market rate but incredibly meaningful work. Design products that directly impact millions of lives in developing countries. Flexible hours, great work-life balance.",
        "requirements": ["Product Design", "Social Impact", "Healthcare UX", "Mission Alignment"],
        "url": "https://globalhealthinitiative.org/careers/senior-designer",
        "timezone": "EST",
        "visa_sponsorship": True,
        "company_stage": "Non-profit",
        "equity": False,
        "special_scenario": "mission_driven",
        "ai_question_trigger": {
            "question": "This non-profit role offers below-market salary but high social impact. How important is mission-driven work vs. compensation?",
            "context": "values_alignment",
            "follow_up": "What causes or missions are you most passionate about?"
        }
    },
    {
        "id": "job-special-010",
        "title": "Design Lead (Travel Required - 40%)",
        "company": "Global Consulting Firm",
        "location": "London, UK",
        "remote": False,
        "salary_usd": 175000,
        "description": "Design Lead for our consulting practice. Role requires 40% travel to client sites across Europe and occasionally US. Expenses covered, premium travel arrangements. Great for someone who loves variety and meeting new people.",
        "requirements": ["Design Leadership", "Client Management", "Travel Flexibility", "Consulting Experience"],
        "url": "https://globalconsulting.com/careers/design-lead",
        "timezone": "GMT",
        "visa_sponsorship": True,
        "company_stage": "Public",
        "equity": False,
        "special_scenario": "travel_heavy",
        "ai_question_trigger": {
            "question": "This role requires 40% travel (roughly 2 weeks per month). Are you comfortable with frequent business travel?",
            "context": "travel_willingness",
            "follow_up": "What's your maximum acceptable travel percentage?"
        }
    }
]

# Ensure data directory exists
os.makedirs('backend/data', exist_ok=True)

# Load existing jobs
with open('backend/data/demo_jobs.json', 'r') as f:
    existing_jobs = json.load(f)

# Add special jobs
all_jobs = existing_jobs + special_jobs

# Write back
with open('backend/data/demo_jobs.json', 'w') as f:
    json.dump(all_jobs, f, indent=2)

print(f'✅ Added {len(special_jobs)} special scenario jobs')
print(f'📊 Total jobs: {len(all_jobs)}')
print(f'📁 Saved to backend/data/demo_jobs.json')

# Also create a separate file for just special scenarios for reference
with open('backend/data/special_scenario_jobs.json', 'w') as f:
    json.dump(special_jobs, f, indent=2)

print(f'📋 Special scenarios saved separately to backend/data/special_scenario_jobs.json')
