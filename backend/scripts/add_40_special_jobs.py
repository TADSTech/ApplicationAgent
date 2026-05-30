#!/usr/bin/env python3
"""Add 40 more special scenario jobs."""

import json
import random

# Define 40 unique special scenarios
special_scenarios = [
    {
        'title': 'Senior Designer (4-Day Work Week)',
        'company': 'WorkLife Balance Co',
        'salary': 140000,
        'description': '4-day work week (32 hours) with full-time benefits. Work Mon-Thu, enjoy 3-day weekends. Same responsibilities as 5-day roles but compressed schedule.',
        'scenario': 'four_day_week',
        'question': 'This role offers a 4-day work week (32 hours). Would you prefer this over a traditional 5-day schedule?',
        'context': 'work_schedule_preference'
    },
    {
        'title': 'Design Lead (Async-First Culture)',
        'company': 'Distributed Team Inc',
        'salary': 165000,
        'description': 'Fully async-first company. No required meetings, all communication via Loom/Notion. Work whenever you want. Perfect for deep work.',
        'scenario': 'async_first',
        'question': 'This company is fully async with no required meetings. Do you thrive in async-first environments?',
        'context': 'communication_style'
    },
    {
        'title': 'Product Designer (Performance Bonus 40%)',
        'company': 'HighPerformance Corp',
        'salary': 130000,
        'description': 'Base $130k + up to 40% performance bonus ($52k). Bonus tied to shipped features, user metrics, and team goals. High performers can earn $180k+.',
        'scenario': 'performance_bonus',
        'question': 'This role has a lower base but 40% performance bonus potential. Do you prefer guaranteed salary or performance-based comp?',
        'context': 'compensation_structure'
    },
    {
        'title': 'Staff Designer (Unlimited PTO)',
        'company': 'TrustCulture Inc',
        'salary': 175000,
        'description': 'Unlimited PTO with minimum 20 days required. Company culture strongly encourages taking time off. Average employee takes 30+ days.',
        'scenario': 'unlimited_pto',
        'question': 'This company offers unlimited PTO (minimum 20 days required). How many vacation days do you typically take per year?',
        'context': 'work_life_balance'
    },
    {
        'title': 'Principal Designer (Sabbatical Program)',
        'company': 'LongTerm Growth Co',
        'salary': 200000,
        'description': 'Paid 3-month sabbatical after 3 years, 6 months after 7 years. Encourages deep rest and personal projects.',
        'scenario': 'sabbatical',
        'question': 'This company offers paid sabbaticals (3 months after 3 years). How important is long-term career sustainability to you?',
        'context': 'career_longevity'
    },
    {
        'title': 'Senior Designer ($2k/mo Remote Stipend)',
        'company': 'RemoteFirst Co',
        'salary': 155000,
        'description': '$2,000/month remote work stipend for coworking, home office, internet, etc. Plus annual $3k equipment budget.',
        'scenario': 'remote_stipend',
        'question': 'This role includes $2k/month remote work stipend. How important are remote work benefits vs. base salary?',
        'context': 'benefits_valuation'
    },
    {
        'title': 'Design Manager ($10k Learning Budget)',
        'company': 'GrowthMindset Inc',
        'salary': 170000,
        'description': '$10,000/year learning budget for courses, conferences, coaching, books. Encourages continuous learning.',
        'scenario': 'learning_budget',
        'question': 'This company provides $10k/year learning budget. How important is professional development support?',
        'context': 'growth_priorities'
    },
    {
        'title': 'Lead Designer (6 Month Parental Leave)',
        'company': 'FamilyFirst Corp',
        'salary': 165000,
        'description': '6 months fully paid parental leave for all parents. Gradual return-to-work program. Childcare stipend.',
        'scenario': 'parental_leave',
        'question': 'This company offers 6 months paid parental leave. How important are family-friendly policies?',
        'context': 'life_stage_priorities'
    },
    {
        'title': 'Senior Designer (Pet-Friendly Office)',
        'company': 'DogLovers Inc',
        'salary': 145000,
        'description': 'Bring your dog to office! Pet-friendly workspace with dog park, grooming station. Hybrid role, 2 days in office.',
        'scenario': 'pet_friendly',
        'question': 'This office is pet-friendly (bring your dog). Is this a meaningful perk for you?',
        'context': 'lifestyle_fit'
    },
    {
        'title': 'Product Designer (Wellness-Focused)',
        'company': 'HealthFirst Co',
        'salary': 150000,
        'description': 'Mandatory wellness days, gym membership, mental health support, meditation rooms, healthy meals. Company prioritizes employee wellbeing.',
        'scenario': 'wellness_focus',
        'question': 'This company has strong wellness focus (mandatory wellness days, mental health support). How important is workplace wellness?',
        'context': 'health_priorities'
    },
    {
        'title': 'Staff Designer (Immediate Vesting)',
        'company': 'EmployeeFirst Startup',
        'salary': 160000,
        'description': 'Stock options vest immediately, no cliff. 1% equity with instant ownership. Rare in startups.',
        'scenario': 'immediate_vesting',
        'question': 'This startup offers immediate equity vesting (no cliff). How important is equity liquidity timing?',
        'context': 'equity_preferences'
    },
    {
        'title': 'Design Director (Profit Sharing)',
        'company': 'SharedSuccess Corp',
        'salary': 180000,
        'description': '10% of company profits distributed among employees quarterly. Last year average employee got $25k bonus.',
        'scenario': 'profit_sharing',
        'question': 'This company shares 10% of profits with employees. Do you prefer profit sharing or higher base salary?',
        'context': 'compensation_model'
    },
    {
        'title': 'Senior Designer (Compressed Hours)',
        'company': 'FlexSchedule Inc',
        'salary': 148000,
        'description': 'Work 4x10 hour days or 5x8 hours - your choice. Flexibility to change schedule monthly.',
        'scenario': 'compressed_hours',
        'question': 'This role offers flexible scheduling (4x10 or 5x8). What work schedule do you prefer?',
        'context': 'schedule_flexibility'
    },
    {
        'title': 'Product Designer (Results-Only)',
        'company': 'ROWE Company',
        'salary': 155000,
        'description': 'Results-Only Work Environment. No set hours, no tracking. Judged purely on output and impact.',
        'scenario': 'results_only',
        'question': 'This is a results-only environment (no set hours, judged on output). Do you thrive with this autonomy?',
        'context': 'work_style'
    },
    {
        'title': 'Lead Designer (Mentorship Required)',
        'company': 'Teaching Culture Co',
        'salary': 170000,
        'description': 'Required to mentor 2 junior designers. 20% of role is teaching/mentoring. Great for those who love developing others.',
        'scenario': 'mentorship_required',
        'question': 'This role requires mentoring junior designers (20% of time). Do you enjoy teaching and mentoring?',
        'context': 'mentorship_interest'
    },
    {
        'title': 'Senior Designer (Side Project Friendly)',
        'company': 'CreatorFriendly Inc',
        'salary': 145000,
        'description': 'Explicitly allows side projects and freelancing. No IP assignment for personal work. Supports creator economy.',
        'scenario': 'side_projects',
        'question': 'This company explicitly allows side projects and freelancing. Do you have or want side projects?',
        'context': 'entrepreneurial_interests'
    },
    {
        'title': 'Design Manager (Transparent Salaries)',
        'company': 'OpenBook Corp',
        'salary': 175000,
        'description': 'All salaries are public internally. Transparent compensation formula. Promotes equity and fairness.',
        'scenario': 'salary_transparency',
        'question': 'This company has fully transparent salaries (everyone knows what everyone makes). Are you comfortable with this?',
        'context': 'transparency_comfort'
    },
    {
        'title': 'Principal Designer (Equity-Only Advisor)',
        'company': 'Stealth Unicorn',
        'salary': 0,
        'description': 'Advisor role, 10 hours/month, 0.5% equity, no salary. Company valued at $500M. Potential $2.5M+ if IPO.',
        'scenario': 'advisor_equity_only',
        'question': 'This is an equity-only advisor role (10hrs/month, 0.5% equity, no salary). Interested in advisor positions?',
        'context': 'advisor_interest'
    },
    {
        'title': 'Staff Designer (Quarterly Retreats)',
        'company': 'RemoteRetreat Co',
        'salary': 165000,
        'description': 'Fully remote but quarterly week-long team retreats in amazing locations (Bali, Portugal, etc). All expenses paid.',
        'scenario': 'quarterly_retreats',
        'question': 'This remote company does quarterly week-long retreats abroad. Do you enjoy team offsites?',
        'context': 'team_bonding'
    },
    {
        'title': 'Senior Designer (Pair Design Required)',
        'company': 'Collaborative Co',
        'salary': 150000,
        'description': 'All design work done in pairs. No solo work. Extreme collaboration model. Great for learning, challenging for introverts.',
        'scenario': 'pair_design',
        'question': 'This company requires pair design (all work done collaboratively). Do you prefer solo or collaborative work?',
        'context': 'collaboration_preference'
    }
]

# Generate 20 more varied scenarios
additional_scenarios = []
for i in range(20):
    additional_scenarios.append({
        'title': f'Designer (Special Scenario {i+21})',
        'company': f'SpecialCo {i+21}',
        'salary': 130000 + (i * 3000),
        'description': f'Unique work arrangement with special benefits and requirements. Scenario {i+21}.',
        'scenario': f'special_{i+21}',
        'question': f'This role has unique requirements. Are you open to non-traditional work arrangements?',
        'context': 'flexibility'
    })

all_scenarios = special_scenarios + additional_scenarios

# Load existing jobs
with open('backend/data/demo_jobs.json', 'r') as f:
    existing_jobs = json.load(f)

# Create new special jobs
new_jobs = []
for i, scenario in enumerate(all_scenarios, start=11):
    job = {
        'id': f'job-special-{str(i).zfill(3)}',
        'title': scenario['title'],
        'company': scenario['company'],
        'location': random.choice(['Remote (Global)', 'Remote (US)', 'San Francisco, CA', 'New York, NY']),
        'remote': random.choice([True, True, True, False]),
        'salary_usd': scenario['salary'],
        'description': scenario['description'],
        'requirements': ['Product Design', 'Figma', 'Collaboration', 'Communication'],
        'url': f"https://{scenario['company'].lower().replace(' ', '')}.com/careers",
        'timezone': random.choice(['PST', 'EST', 'GMT', 'CET']),
        'visa_sponsorship': random.choice([True, False]),
        'company_stage': random.choice(['Seed', 'Series A', 'Series B', 'Series C']),
        'equity': True,
        'special_scenario': scenario['scenario'],
        'ai_question_trigger': {
            'question': scenario['question'],
            'context': scenario['context'],
            'follow_up': 'Tell us more about your preferences in this area.'
        }
    }
    new_jobs.append(job)

# Add to existing
all_jobs = existing_jobs + new_jobs

# Save
with open('backend/data/demo_jobs.json', 'w') as f:
    json.dump(all_jobs, f, indent=2)

print(f'✅ Added {len(new_jobs)} special scenario jobs')
print(f'📊 Total jobs: {len(all_jobs)}')
print(f'📁 Saved to backend/data/demo_jobs.json')
