# Client Technical Brief — FeedbackPilot

**To:** Head of Customer Success  
**From:** Mahesh Ray, Forward Deployed Developer  
**Re:** AI-Powered Feedback Triage Tool — FeedbackPilot  
**Date:** March 2026

---

## What the Tool Does

Right now, your support team reads every incoming ticket manually just to figure out what it is — a bug, a billing question, something urgent. That process doesn't scale.

FeedbackPilot fixes that. When a customer submits a ticket through the web form, the tool automatically reads the message, understands what kind of issue it is, and assigns it a priority before any human even looks at it. Your team opens the admin dashboard and sees tickets already sorted — urgent ones at the top, low-priority ones at the bottom, each with a one-line summary so they know what they're dealing with at a glance.

No more triaging manually. The team can focus on actually resolving issues instead of categorizing them.

---

## How the AI Classification Works

When a ticket comes in, the message is sent to a large language model (the same type of AI behind tools like ChatGPT). I give the AI a specific set of instructions — what categories exist, what a priority score means, and exactly what format to respond in. The AI reads the customer's message, decides which category fits best (Bug Report, Feature Request, Billing Issue, General Question, or Urgent/Critical), writes a one-line summary, and gives a priority score from 1 (low) to 5 (critical). This all happens in the background within a couple of seconds of the ticket being submitted. The result gets saved alongside the original ticket in the database so your team always has both the raw message and the AI's read on it.

---

## Assumptions I Made

**1. One ticket = one issue.**  
I assumed each form submission covers a single problem. If a customer writes about three different things in one message, the AI will classify based on whichever issue feels most dominant. For now that's acceptable, but it's worth noting.

**2. The admin dashboard is internal-only.**  
I built authentication assuming only your team accesses the dashboard — not customers. So I kept auth simple (JWT-based) rather than building a full role management system. If you ever need multiple permission levels, that's a separate piece of work.

**3. AI output will be well-structured most of the time.**  
I engineered the prompt carefully so the AI returns a consistent, parseable format. I also added a fallback — if the AI returns something unexpected, the ticket still gets saved, just without the classification. No data is ever lost because of an AI failure.

---

## Known Limitation

The AI classifies based on the words in the message — it has no context about who the customer is, their account history, or whether they've raised the same issue before. So a repeat critical bug from a high-value client looks the same as a first-time question from a free-tier user.

**Mitigation:** In the next iteration, we can pass basic customer metadata (account tier, past ticket count) alongside the message. This gives the AI more context and improves prioritization accuracy significantly.

---

## Effort to Add Auto-Email Reply

Sending an automatic acknowledgement email to the ticket submitter when their ticket is received is straightforward to add. It would involve connecting a transactional email service (like Resend or Nodemailer with an SMTP provider), triggering the email after the ticket is saved, and writing a simple template. 

Realistic estimate: **4–6 hours** including testing and making sure the emails don't land in spam. No major architectural changes needed — it plugs into the existing submission flow cleanly.

---

*Built with Next.js, Express, MongoDB, and Groq (LLaMA 3.3 70B). Questions? I'm happy to walk through any part of this in a call.*