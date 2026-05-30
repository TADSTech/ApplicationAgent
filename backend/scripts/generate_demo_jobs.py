#!/usr/bin/env python3
"""Generate 150 demo jobs for JobJockey demo mode."""

import json
import random
import os

companies = [
    ('NeoLedger', 'Series B', 'Fintech'), ('Axiom Data', 'Series C', 'Data Analytics'),
    ('Silvera', 'Series B', 'Payments'), ('Quantix', 'Series A', 'Trading'),
    ('Linear', 'Series B', 'Productivity'), ('Stripe', 'Public', 'Payments'),
    ('Notion', 'Series C', 'Productivity'), ('Shopify', 'Public', 'E-commerce'),
    ('Framer', 'Series A', 'Design Tools'), ('Figma', 'Acquired', 'Design Tools'),
    ('Vercel', 'Series C', 'Infrastructure'), ('Supabase', 'Series B', 'Database'),
    ('Clerk', 'Series A', 'Auth'), ('Resend', 'Seed', 'Email'),
    ('Railway', 'Series A', 'Infrastructure'), ('Fly.io', 'Series B', 'Infrastructure'),
    ('Planetscale', 'Series B', 'Database'), ('Neon', 'Series A', 'Database'),
    ('Convex', 'Series A', 'Backend'), ('Inngest', 'Seed', 'Workflows'),
    ('Temporal', 'Series B', 'Workflows'), ('Retool', 'Series B', 'Internal Tools'),
    ('Airtable', 'Series D', 'Database'), ('Coda', 'Series C', 'Productivity'),
    ('Miro', 'Series C', 'Collaboration'), ('Loom', 'Acquired', 'Video'),
    ('Pitch', 'Series B', 'Presentations'), ('Gamma', 'Series A', 'Presentations'),
    ('Canva', 'Series F', 'Design'), ('Webflow', 'Series C', 'Web Design'),
    ('Spline', 'Seed', '3D Design'), ('Rive', 'Series A', 'Animation'),
    ('Zeplin', 'Series B', 'Design Handoff'), ('Abstract', 'Series B', 'Version Control'),
    ('Maze', 'Series B', 'User Testing'), ('Hotjar', 'Series B', 'Analytics'),
    ('Amplitude', 'Public', 'Analytics'), ('Mixpanel', 'Series C', 'Analytics'),
    ('Segment', 'Acquired', 'CDP'), ('Rudderstack', 'Series B', 'CDP'),
    ('PostHog', 'Series B', 'Product Analytics'), ('June', 'Seed', 'Analytics'),
    ('Koala', 'Seed', 'Analytics'), ('Statsig', 'Series B', 'Experimentation'),
    ('LaunchDarkly', 'Series D', 'Feature Flags'), ('Split', 'Series C', 'Experimentation'),
    ('Optimizely', 'Series E', 'Experimentation'), ('VWO', 'Series C', 'A/B Testing'),
    ('Heap', 'Series C', 'Analytics'), ('Pendo', 'Series D', 'Product Analytics')
]

roles = [
    ('Senior Product Designer', 140000, 220000, ['Figma', 'Prototyping', 'User Research', 'Design Systems']),
    ('Lead UX Designer', 160000, 240000, ['UX Research', 'Interaction Design', 'Usability Testing', 'Wireframing']),
    ('Product Design Manager', 150000, 230000, ['Leadership', 'Strategy', 'Team Management', 'Stakeholder Management']),
    ('Staff Product Designer', 180000, 280000, ['Product Strategy', 'Design Leadership', 'Mentorship', 'Vision']),
    ('Principal Designer', 200000, 320000, ['Design Strategy', 'Leadership', 'Innovation', 'Cross-functional']),
    ('Design Systems Engineer', 130000, 200000, ['React', 'TypeScript', 'Design Tokens', 'Component Libraries']),
    ('UX Researcher', 120000, 180000, ['Qualitative Research', 'Quantitative Analysis', 'User Interviews', 'Surveys']),
    ('Senior UX Researcher', 150000, 220000, ['Research Strategy', 'Mixed Methods', 'Stakeholder Management', 'Synthesis']),
    ('Interaction Designer', 110000, 170000, ['Animation', 'Micro-interactions', 'Prototyping', 'Motion Design']),
    ('Visual Designer', 100000, 160000, ['Visual Design', 'Branding', 'Illustration', 'Typography']),
    ('Brand Designer', 105000, 165000, ['Brand Strategy', 'Visual Identity', 'Marketing Design', 'Illustration']),
    ('UI Designer', 95000, 150000, ['UI Design', 'Visual Design', 'Figma', 'Responsive Design']),
    ('Product Designer', 120000, 190000, ['Product Design', 'User Flows', 'Prototyping', 'Collaboration']),
    ('Senior UI/UX Designer', 130000, 200000, ['UI/UX Design', 'Prototyping', 'User Testing', 'Design Systems']),
    ('Design Lead', 170000, 260000, ['Design Leadership', 'Team Management', 'Strategy', 'Mentorship']),
    ('Head of Design', 200000, 350000, ['Design Strategy', 'Leadership', 'Hiring', 'Vision']),
    ('VP of Design', 250000, 450000, ['Executive Leadership', 'Strategy', 'Org Building', 'Vision']),
    ('Frontend Designer', 110000, 175000, ['HTML/CSS', 'JavaScript', 'React', 'Design Implementation']),
    ('Design Engineer', 130000, 210000, ['React', 'TypeScript', 'Design Systems', 'Animation']),
    ('Creative Technologist', 125000, 195000, ['Creative Coding', 'WebGL', 'Three.js', 'Prototyping'])
]

locations = [
    ('San Francisco, CA', 'PST', True), ('New York, NY', 'EST', True),
    ('Austin, TX', 'CST', True), ('Seattle, WA', 'PST', True),
    ('Boston, MA', 'EST', True), ('Los Angeles, CA', 'PST', True),
    ('Chicago, IL', 'CST', True), ('Denver, CO', 'MST', True),
    ('London, UK', 'GMT', True), ('Amsterdam, Netherlands', 'CET', True),
    ('Berlin, Germany', 'CET', True), ('Paris, France', 'CET', True),
    ('Remote (US)', 'PST', False), ('Remote (Europe)', 'GMT', False),
    ('Remote (Global)', 'GMT', False), ('Toronto, Canada', 'EST', True),
    ('Vancouver, Canada', 'PST', True), ('Dublin, Ireland', 'GMT', True),
    ('Barcelona, Spain', 'CET', True), ('Lisbon, Portugal', 'GMT', True)
]

jobs = []
for i in range(150):
    company, stage, industry = random.choice(companies)
    role, min_sal, max_sal, skills = random.choice(roles)
    location, tz, onsite = random.choice(locations)
    
    salary = random.randint(min_sal, max_sal)
    remote = random.choice([True, True, True, False]) if onsite else True
    visa = random.choice([True, False, False])
    equity = stage in ['Seed', 'Series A', 'Series B', 'Series C']
    
    company_slug = company.lower().replace(' ', '').replace('.', '')
    role_slug = role.lower().replace(' ', '-')
    
    jobs.append({
        'id': f'job-{str(i+1).zfill(3)}',
        'title': role,
        'company': company,
        'location': location,
        'remote': remote,
        'salary_usd': salary,
        'description': f'{role} at {company} working on {industry.lower()} products. Join a {stage} company building the future of {industry.lower()}.',
        'requirements': skills,
        'url': f'https://{company_slug}.com/careers/{role_slug}',
        'timezone': tz,
        'visa_sponsorship': visa,
        'company_stage': stage,
        'equity': equity
    })

# Ensure data directory exists
os.makedirs('backend/data', exist_ok=True)

# Write to file
with open('backend/data/demo_jobs.json', 'w') as f:
    json.dump(jobs, f, indent=2)

print(f'✅ Generated {len(jobs)} demo jobs')
print(f'📁 Saved to backend/data/demo_jobs.json')
