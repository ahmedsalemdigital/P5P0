import React, { useState, useEffect, useMemo, useRef } from 'react';
import ArcadeShell, { ARCADE_STYLE } from './ArcadeShell.jsx';

const THEME_KEY = 'pspo-theme';
function loadTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'classic' || t === 'arcade' ? t : 'arcade';
  } catch { return 'arcade'; }
}
function saveTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch {} }

/* ──────────────────────────────────────────────────────────────────────────
   PSPO I Trainer — grounded in the 2020 Scrum Guide
   Single-file React artifact. Persistent progress via window.storage.
   Personalized wrong-answer feedback via Anthropic API in artifacts.
   ────────────────────────────────────────────────────────────────────────── */

export const CONCEPTS = [
  { id: 'scrum_theory',         label: 'Scrum Theory',            subtitle: 'Empiricism, values, pillars' },
  { id: 'scrum_team',           label: 'Scrum Team',              subtitle: 'Composition & self-management' },
  { id: 'product_owner',        label: 'Product Owner',           subtitle: 'Accountabilities & authority' },
  { id: 'scrum_master',         label: 'Scrum Master',            subtitle: 'Service & true leadership' },
  { id: 'developers',           label: 'Developers',              subtitle: 'Role & responsibilities' },
  { id: 'product_backlog',      label: 'Product Backlog',         subtitle: 'Ordering, refinement, transparency' },
  { id: 'sprint_backlog',       label: 'Sprint Backlog',          subtitle: 'Ownership & emergence' },
  { id: 'events',               label: 'Events',                  subtitle: 'Sprint, Planning, Daily, Review, Retro' },
  { id: 'artifacts_commitments',label: 'Artifacts & Commitments', subtitle: 'Product Goal, Sprint Goal, DoD' },
  { id: 'scaling',              label: 'Scaling & Scenarios',     subtitle: 'Multi-team patterns' },
];

export const LESSONS = {
  scrum_theory: {
    intro: `Before you learn what a Product Owner does or how Sprint Planning works, you need to understand why Scrum exists. Every rule in Scrum — the tiny timeboxes, the fixed events, the stubborn refusal to plan far ahead — comes from one belief: product development is complex, and complexity doesn't yield to detailed upfront plans. Plan too far and reality embarrasses you. Plan too little and you wander. Scrum is the minimum viable structure for learning your way through complexity.`,
    sections: [
      {
        heading: 'Empiricism vs defined process',
        body: `There are two ways to manage work. A defined process assumes you know enough upfront to specify exactly what will happen. Write a recipe, follow it, get the expected cake. This works when inputs, processes, and outputs are predictable — manufacturing a car part, for instance.

An empirical process assumes you don't know enough. You try things, observe, adjust. Empiricism is how scientists work, how startups iterate, and how Scrum approaches product development.

Scrum takes a firm position: product development is complex. You don't know what users want until they try it. You don't know what will work technically until you build it. Pretending otherwise — via multi-year roadmaps, rigid scope, locked-in plans — doesn't eliminate uncertainty. It hides it.`,
        example: {
          title: 'Recipe vs forecast',
          body: `A chocolate chip cookie recipe is a defined process: same inputs, same output. You don't need weekly reviews of the recipe because there's nothing to inspect.

Weather forecasting is empirical. Meteorologists run models, compare them to reality, update the models, run them again. They don't "decide" what the weather will be — they observe, inspect, and adapt. That's Scrum's world.`
        }
      },
      {
        heading: 'The three pillars',
        body: `Empiricism in Scrum sits on three pillars, and the order matters.

Transparency — the work and process must be visible to those responsible for outcomes. If the Product Backlog is opaque, if the Increment isn't real, if people guess at progress, you have nothing honest to inspect.

Inspection — artifacts and progress toward goals must be checked frequently to catch problems early. Inspection only works if transparency is real. Inspecting vague status updates teaches you nothing.

Adaptation — when inspection reveals drift or failure, the process, work, or product must be adjusted. You can only adapt what you inspected, and you can only inspect what was transparent.

It's a causal chain. Break the first link and the whole chain collapses. This is why "we have daily standups" without real transparency produces no Scrum benefit — the ritual is there but the mechanism isn't.`
      },
      {
        heading: 'The five values',
        body: `Pillars describe what Scrum teams do. Values describe how. Without them, the mechanics are hollow ritual.

Commitment: the team commits to achieving the Sprint Goal and to each other.
Focus: everyone focuses on the Sprint's work and the team's goals.
Openness: the team is honest about progress, challenges, even uncomfortable truths.
Respect: members respect each other as capable, independent professionals.
Courage: courage to do the right thing and work on tough problems — including telling the truth about bad news.

Values aren't decoration. Without courage, no one admits the Sprint is in trouble. Without openness, inspection finds nothing. Without respect, self-management devolves into dysfunction. The pillars can only stand if the values hold.`
      }
    ],
    visual: `<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px;margin:0 auto;display:block"><defs><marker id="ar1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e8a838"/></marker></defs><rect x="10" y="60" width="110" height="100" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><rect x="155" y="60" width="110" height="100" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><rect x="300" y="60" width="110" height="100" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="65" y="50" text-anchor="middle" fill="#e8a838" font-size="10" font-family="JetBrains Mono, monospace" letter-spacing="1.2">TRANSPARENCY</text><text x="210" y="50" text-anchor="middle" fill="#e8a838" font-size="10" font-family="JetBrains Mono, monospace" letter-spacing="1.2">INSPECTION</text><text x="355" y="50" text-anchor="middle" fill="#e8a838" font-size="10" font-family="JetBrains Mono, monospace" letter-spacing="1.2">ADAPTATION</text><text x="65" y="115" text-anchor="middle" fill="currentColor" font-size="16" font-family="Fraunces, serif" font-style="italic" opacity="0.75">see it</text><text x="210" y="115" text-anchor="middle" fill="currentColor" font-size="16" font-family="Fraunces, serif" font-style="italic" opacity="0.75">check it</text><text x="355" y="115" text-anchor="middle" fill="currentColor" font-size="16" font-family="Fraunces, serif" font-style="italic" opacity="0.75">change it</text><text x="65" y="145" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.45">(make it visible)</text><text x="210" y="145" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.45">(inspect regularly)</text><text x="355" y="145" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.45">(adjust course)</text><path d="M 122 110 L 153 110" stroke="#e8a838" stroke-width="1.5" fill="none" marker-end="url(#ar1)"/><path d="M 267 110 L 298 110" stroke="#e8a838" stroke-width="1.5" fill="none" marker-end="url(#ar1)"/><path d="M 355 162 Q 210 195 65 162" stroke="#e8a838" stroke-width="1" fill="none" stroke-dasharray="3 3" opacity="0.5" marker-end="url(#ar1)"/><text x="210" y="190" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.5" font-family="JetBrains Mono, monospace" letter-spacing="1">loop continues</text></svg>`,
    mnemonics: [
      { label: 'T.I.A.', text: 'The three pillars, in causal order. Transparency → Inspection → Adaptation.' },
      { label: 'F.O.C.R.C.', text: 'The five values. Focus, Openness, Commitment, Respect, Courage.' }
    ],
    tips: [
      'On the exam, "framework" is the correct word for Scrum. Never "methodology," "process," or "best practice."',
      'If a question asks what\'s broken when adaptation fails, look one step back: inspection probably isn\'t real. And if inspection isn\'t real, transparency is missing.',
      'The 2020 Scrum Guide added "lean thinking" as a foundation alongside empiricism. Both point to the same conclusion: keep the framework minimal, cut waste.',
      'Pillars describe the process (Transparency, Inspection, Adaptation). Values describe the team (Commitment, Focus, Openness, Respect, Courage). Don\'t mix them up — common trap.'
    ],
    keyPoints: [
      'Three pillars: Transparency, Inspection, Adaptation — in that order. You can\'t adapt what you can\'t inspect, and you can\'t inspect what isn\'t transparent.',
      'Five values: Commitment, Focus, Openness, Respect, Courage.',
      'Scrum is a framework, not a methodology. It is purposefully incomplete.',
      'Each element serves a specific purpose. Changing or removing parts obscures problems and reduces Scrum\'s benefits.'
    ],
    traps: [
      'Scrum is often mis-described as a methodology or a process. The Scrum Guide explicitly calls it a framework.',
      '"Inspection" is sometimes confused with "Commitment" as a pillar — it is not. Commitment is a value.',
      'Empirical process control predates Scrum; Scrum applies it. Don\'t confuse "Scrum is based on empiricism" with "Scrum invented empiricism."'
    ]
  },
  scrum_team: {
    intro: `The Scrum Team is the atomic unit of Scrum. Everything in the framework — the events, the artifacts, the commitments — exists to make this unit effective. Understanding what a Scrum Team is, and crucially what it isn't, prevents most of the exam's "role" traps.`,
    sections: [
      {
        heading: 'What the Scrum Team is',
        body: `A Scrum Team is one Product Owner, one Scrum Master, and Developers — together, as a single unit. Ten or fewer people total. No sub-teams. No internal hierarchies.

The 2020 Scrum Guide made a deliberate shift: it stopped calling these "roles" and started calling them "accountabilities." The difference matters. A role describes what you do. An accountability describes what you own the outcome of. A Product Owner doesn't do all the product work — they're accountable for the value of it. A Scrum Master doesn't run the team — they're accountable for the team's effectiveness at Scrum.

The Scrum Team focuses on one objective at a time: the Product Goal. Not three parallel initiatives. Not a portfolio of priorities. One goal.`
      },
      {
        heading: 'Cross-functional: the team, not the person',
        body: `Cross-functional is probably the single most misunderstood term in Scrum. It does not mean every Developer is a full-stack expert who can design, code, and test. It means the team collectively has every skill needed to create a valuable Increment each Sprint — without waiting for external specialists.

If your team needs a database expert and the only one in the company is three departments away, and you can't complete a Sprint without them, your team isn't cross-functional. That dependency is precisely what cross-functionality is supposed to eliminate.`,
        example: {
          title: 'The restaurant analogy',
          body: `A good restaurant kitchen is cross-functional. It has a chef, line cooks, a dishwasher, a pastry person. No single person does everything. But the kitchen, as a unit, can take a raw order and produce a finished dish without calling another kitchen for help.

If the dessert menu requires calling the café next door every time someone orders cake, the kitchen isn't cross-functional for desserts. Same idea for a Scrum Team: the unit must be able to deliver end-to-end.`
        }
      },
      {
        heading: 'Self-managing: what it is and isn\'t',
        body: `Self-management means the team decides internally who does what, when, and how. No one outside the team assigns tasks to Developers. No manager tells the Scrum Master how to coach. The Product Owner decides what's on the Product Backlog without anyone overruling them.

Self-management is NOT:
• Skipping Scrum events because the team doesn't feel like doing them today.
• Ignoring the Definition of Done because it's inconvenient.
• Choosing your own Sprint length of six weeks.

Self-management operates within the Scrum framework, not above it. The events, the artifacts, the timeboxes — those are the framework. Inside that framework, the team is sovereign.`
      },
      {
        heading: 'Why "10 or fewer"',
        body: `The Scrum Guide says the Scrum Team is "typically 10 or fewer people." It removed the old "3–9 Developers" rule in 2020. The constraint is about communication: as teams grow, communication paths grow combinatorially. A 10-person team has 45 potential conversation pairs; a 15-person team has 105.

Smaller teams communicate more. They also self-manage better. When membership must change — and sometimes it must — expect a short-term productivity drop while the team re-forms. Frequent rotation is expensive.`
      }
    ],
    mnemonics: [
      { label: 'P.O. · S.M. · Devs', text: 'The three accountabilities. One Product Owner. One Scrum Master. Everyone else is a Developer — regardless of specialty.' },
      { label: '1 goal · 1 team · ≤10 people', text: 'The three numbers to memorize.' }
    ],
    tips: [
      'If an exam question lists "Testers," "Architects," or "Business Analysts" as separate team members, it\'s testing whether you know the 2020 Scrum Guide eliminated sub-titles. They\'re all Developers.',
      'Can the PO also be a Developer? Yes. The Scrum Guide doesn\'t prohibit it. What matters is clarity of accountability.',
      'When a question asks about team formation ("divide 100 people into teams"), the correct answer almost always involves self-organization — not manager assignment.',
      'Cross-functional ≠ every individual has all skills. It means the Developers collectively have all the development skills needed.'
    ],
    keyPoints: [
      'Accountabilities (not "roles"): Product Owner, Scrum Master, Developers.',
      'Cross-functional: collectively has all skills to create value each Sprint.',
      'Self-managing: internally decides who does what, when, and how.',
      'The whole Scrum Team is accountable for creating a valuable, useful Increment every Sprint.'
    ],
    traps: [
      'Cross-functional means the TEAM has the skills — not every person. A Developer doesn\'t need to be a full-stack dev + tester + designer.',
      'Self-management ≠ deciding which Scrum events to skip. All events are required.',
      'The PO can be a Developer at the same time. Not forbidden.',
      'Membership changes should be rare; changes cause short-term productivity drops.'
    ]
  },
  product_owner: {
    intro: `The Product Owner is the most commonly misunderstood accountability in Scrum — and the one you need to understand most deeply because it's the role you're preparing to take. On paper, the job is simple: maximize value. In practice, that single sentence hides a hundred judgment calls about what value means, whose value counts, and how to trade competing priorities.`,
    sections: [
      {
        heading: 'One person. Accountable for value.',
        body: `The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team. Notice three words: one, accountable, and value.

One: the PO is a single person, not a committee, not a rotating seat. Why? Decision latency. Committees can't make fast trade-offs. When the Developers hit a surprise mid-Sprint and need a clarification in twenty minutes, a single accountable person can answer. A committee can't.

Accountable: not "does the work," but "owns the outcome." The PO can delegate writing Product Backlog items, running refinement sessions, even ordering parts of the Backlog — but they stay accountable if things go wrong.

Value: not scope, not features, not velocity. Value is outcome for users, customers, and the business. Shipping ten features that nobody uses produces zero value. Shipping one feature that moves a key metric produces all the value.`
      },
      {
        heading: 'What the PO actually does',
        body: `The Scrum Guide lists four responsibilities the PO owns:

1. Developing and explicitly communicating the Product Goal — the long-term objective that unifies Sprints.
2. Creating and clearly communicating Product Backlog items — so the Developers know what and why.
3. Ordering Product Backlog items — reflecting the team's best current understanding of value, risk, and dependencies.
4. Ensuring the Product Backlog is transparent, visible, and understood — everyone working on or with the product can see what's coming.

The PO may delegate the doing of any of these. What they cannot delegate is the accountability. If the Product Backlog is a mess, that's on the PO, even if someone else wrote the items.`,
        example: {
          title: 'A day-in-the-life',
          body: `Morning: PO reviews usage metrics from yesterday's release. Two features are performing below hypothesis. Notes them for the next Sprint Review discussion.

Late morning: 30-minute working session with a few Developers on an upcoming Backlog item. They think the original scope is too big. PO agrees to split it into three items, re-orders the Backlog.

Afternoon: stakeholder call with the finance team about a compliance deadline. PO takes the input, weighs it against existing priorities, doesn't promise a fixed date.

Late afternoon: quick sync with user research on three interview recordings. PO identifies a new pain point worth investigating, drafts a spike as a Backlog item.

Notice what isn't on this list: assigning tasks to Developers, tracking hours, chairing status meetings. That's not the job.`
        }
      },
      {
        heading: 'Value is not velocity',
        body: `Velocity measures how much the team outputs per Sprint. Value measures whether that output matters. The two are loosely correlated at best.

A team can double its velocity by loosening the Definition of Done. Same features ship, more bugs ship with them, users churn. Velocity up, value down.

A team can halve its velocity by working on a hard research spike that unlocks a huge subsequent capability. Velocity down, value up.

The exam will test this. Any question that frames "increasing velocity" as a PO goal is probably a trap. The PO optimizes for value — customer satisfaction, revenue impact, adoption, cost reduction — whichever dimension actually drives the product forward.`
      },
      {
        heading: 'Not a Project Manager. Not a Requirements Collector.',
        body: `The PO is frequently confused with two older roles: Project Manager and Business Analyst. Understanding the differences is critical.

A Project Manager owns schedule, scope, and budget — the triple constraint. They optimize for delivering a defined thing by a defined date.

A Business Analyst gathers requirements from stakeholders and translates them into specs. They're a conduit between business and development.

The PO is neither. They own value. They can kill features that would hit the schedule but not deliver. They can change direction based on learning. They can say no to stakeholders whose requests don't align with the Product Goal. The PO has authority over what the product becomes — and the accountability for whether it works.`
      }
    ],
    mnemonics: [
      { label: 'O.A.V.', text: 'One person. Accountable. for Value. The three anchors of the PO accountability.' },
      { label: '4 things (PBM)', text: 'Product Backlog Management, per the Scrum Guide: (1) develop and communicate the Product Goal, (2) create and communicate PB items, (3) order PB items, (4) ensure the PB is transparent, visible, and understood. The PO may delegate doing these; accountability stays.' }
    ],
    tips: [
      'When a question lists "delegation" as a PO action, remember: they delegate the work, never the accountability.',
      'The PO does NOT write the Definition of Done, estimate items, or own the Sprint Backlog. These are common distractor answers.',
      'The PO must attend the Sprint Retrospective — they\'re a Scrum Team member. Daily Scrum attendance is only when they\'re actively working on Sprint Backlog items.',
      'Only the PO can cancel a Sprint, and only when the Sprint Goal becomes obsolete. Not when the team falls behind. Not when a stakeholder changes their mind.',
      'For the PO to succeed, the organization must respect their decisions. If leadership routinely overrides the PO, that\'s an organizational impediment — not a PO failure.'
    ],
    keyPoints: [
      'Develops and explicitly communicates the Product Goal.',
      'Creates and clearly communicates Product Backlog items.',
      'Orders Product Backlog items.',
      'Ensures the Product Backlog is transparent, visible, and understood.',
      'The PO may delegate the above work but remains accountable.',
      'For the PO to succeed, the entire organization must respect their decisions.'
    ],
    traps: [
      'The PO does NOT own the Definition of Done — the Scrum Team does, or the organization provides it.',
      'The PO does NOT estimate Product Backlog items — the Developers do.',
      'Value ≠ velocity. Velocity increases never indicate product value increases.',
      'Not a Project Manager. No authority to assign tasks, track hours, or manage Developers.',
      'Required to attend the Sprint Retrospective (as a Scrum Team member).'
    ]
  },
  scrum_master: {
    intro: `The Scrum Master is the accountability people most often get wrong in practice. Half the organizations that adopt Scrum hire Scrum Masters who function like Project Managers or team secretaries — scheduling meetings, tracking tasks, reporting status. None of that is the job. The real Scrum Master is a coach, a teacher, and a patient remover of obstacles who often works in the background.`,
    sections: [
      {
        heading: 'True leader who serves',
        body: `The 2020 Scrum Guide uses a specific phrase: "true leaders who serve." This is Robert Greenleaf's servant leadership reframed for Scrum — leadership exercised through enabling others, not through commanding them.

A Scrum Master doesn't assign work. They help the team self-manage well. They don't run Scrum events. They ensure events happen, are useful, and stay within timebox. They don't decide priorities. They coach the PO on techniques for doing that well.

The accountability is: establishing Scrum and the Scrum Team's effectiveness. Both parts matter. Establishing Scrum means teaching the framework, defending it from erosion, helping the organization understand it. Team effectiveness means the team actually improves over time — not just follows ceremonies.`
      },
      {
        heading: 'Three directions of service',
        body: `The Scrum Master serves in three directions:

Serving the Scrum Team: coaching on self-management and cross-functionality. Helping focus on high-value Increments that meet the Definition of Done. Removing impediments. Ensuring events happen productively.

Serving the Product Owner: finding techniques for effective Product Goal definition and Product Backlog management. Helping the team understand clear, concise Product Backlog items. Teaching empirical product planning in complex environments.

Serving the organization: leading, training, and coaching in Scrum adoption. Planning and advising Scrum implementations. Helping employees and stakeholders understand and enact an empirical approach.

These three directions are equal. A Scrum Master who only serves the team — ignoring organizational impediments, leaving the PO to struggle — is only doing a third of the job.`
      },
      {
        heading: 'What a good Scrum Master day looks like',
        body: `Early morning: Scrum Master notices the team's Daily Scrum has drifted into status reporting for three days running. Jots a note to raise it at the Retrospective — not to correct it directly, but to help the team notice and choose.

Mid-morning: catches the PO struggling with stakeholder pressure to cram more into the Sprint. Has a 15-minute one-on-one, not to argue against the stakeholders, but to help the PO articulate the value trade-off.

Midday: a manager from another department asks the Scrum Master to "make the team work on this urgent thing." Scrum Master doesn't comply and doesn't argue. Redirects the manager to the PO and explains how the Backlog works.

Afternoon: facilitates a working session where the Developers are deciding how to break up a large item. Says very little. Asks two good questions at key moments.

Late afternoon: a Developer mentions a recurring tooling problem that costs the team an hour each Sprint. Scrum Master takes it as an impediment, spends the next day working on getting the team access to a better tool.`,
        example: {
          title: 'What a bad Scrum Master day looks like',
          body: `Scrum Master runs the Daily Scrum — dictating who speaks when, asking each Developer the "three questions," and flagging items for the Product Owner.

They send weekly status reports to management with per-Developer task completion.

They tell a Developer who's struggling on a PBI to "switch with" another Developer who has capacity.

They escalate team disagreements to management rather than coaching the team through them.

Every one of these behaviors violates Scrum. The Scrum Master isn't there to run the team. They're there to help the team run itself.`
        }
      },
      {
        heading: 'What the Scrum Master cannot do',
        body: `Some boundaries are sharp. The Scrum Master cannot:

Cancel a Sprint — only the Product Owner can, and only when the Sprint Goal becomes obsolete.
Assign work to Developers — that's self-management territory.
Own the Sprint Backlog — the Developers own it.
Modify the Product Backlog — that's the PO's accountability.
Decide which Scrum events the team will use — all events are required by the framework.

The Scrum Master's authority comes from coaching, teaching, and facilitating, not from positional power over any artifact or decision.`
      }
    ],
    mnemonics: [
      { label: 'Team · PO · Org', text: 'The three directions of service. Always all three — not just the team.' },
      { label: 'Facilitate, don\'t run', text: 'The Scrum Master ensures events happen; they do not run them.' }
    ],
    tips: [
      'If a question describes the Scrum Master scheduling meetings, writing status reports, or assigning tasks, it\'s testing whether you recognize the Project Manager anti-pattern.',
      'The Scrum Master is not required to attend the Daily Scrum. Only Developers are. The SM may attend if asked to facilitate.',
      'When a question asks "what should the SM do about X," the answer usually involves coaching, teaching, or facilitating — rarely taking direct action or issuing directives.',
      'The Scrum Master serves the organization too. Questions involving external stakeholders or managers often have "coach them on Scrum" as the correct answer.'
    ],
    keyPoints: [
      'Serves the Scrum Team: coaches self-management and cross-functionality, helps focus on high-value Increments that meet the DoD, removes impediments.',
      'Serves the PO: finding techniques for effective Product Goal definition & Product Backlog management; helping the team understand clear, concise Product Backlog items.',
      'Serves the organization: leading, training, and coaching in Scrum adoption; planning and advising Scrum implementations.',
      'Ensures all Scrum events take place, are positive, productive, and within timebox.'
    ],
    traps: [
      'The Scrum Master is NOT a Project Manager, manager of the team, or administrative assistant.',
      'The Scrum Master does NOT assign tasks, run the Daily Scrum, or own the Sprint Backlog.',
      'Only the PO can cancel a Sprint — the Scrum Master cannot.',
      'Attendance at Daily Scrum is not required for the SM; only Developers are required.'
    ]
  },
  developers: {
    intro: `In the 2020 Scrum Guide, the old "Development Team" became "the Developers" — and all internal sub-titles (Tester, Architect, Business Analyst, Designer) disappeared. This wasn't a cosmetic change. It was a deliberate push against the anti-pattern where teams silo by specialty inside a single Scrum Team, creating mini-dependencies that destroy cross-functionality.`,
    sections: [
      {
        heading: 'Who the Developers are',
        body: `Developers are the people committed to creating any aspect of a usable Increment each Sprint. "Any aspect" is the key phrase. A UX designer on a Scrum Team is a Developer. A database person is a Developer. A person running automated tests is a Developer. They all contribute to the Increment.

The 2020 change matters because the old language — "Development Team" — subtly excluded the PO and SM from "the team" in people's minds, even though the Scrum Guide always said otherwise. And the old sub-titles encouraged people to say things like "that's not my job, I'm the Tester" — which is exactly what cross-functionality is supposed to prevent.`
      },
      {
        heading: 'What Developers own',
        body: `Developers are accountable for:

Creating a plan for the Sprint — the Sprint Backlog. They decide what work to select and how to structure it.
Instilling quality by adhering to the Definition of Done. Quality is a Developer responsibility, embedded in their work, not outsourced to a separate QA team.
Adapting their plan each day toward the Sprint Goal. The Sprint Backlog is not a static contract — it evolves as the Developers learn.
Holding each other accountable as professionals. Peer accountability, not managerial oversight.

Notice: no one assigns tasks to Developers. Not the SM, not the PO, not a manager. Developers select, plan, and execute the work themselves.`,
        example: {
          title: 'The no-tester team',
          body: `A team used to have a dedicated Tester. Under Scrum, the Tester is now a Developer — same person, different framing. On Monday they still mostly test. But on Tuesday, a story needs backend work and the two backend Developers are blocked. The former Tester pairs with one of them to help unblock, and writes automated integration tests alongside the code.

That's cross-functionality in action. The former Tester isn't suddenly a full-stack backend engineer, but the team collectively has the skills to get unstuck without waiting.`
        }
      },
      {
        heading: 'Self-management within Developers',
        body: `Self-management inside the Developers group has concrete shapes:

Who picks up which item during Sprint Planning is a team decision, not a PO assignment.
How the work gets broken down into tasks is the Developers' call, not something imposed from outside.
What the Daily Scrum looks like — the format, who starts, what gets discussed — is the Developers' decision, within the 15-minute timebox and the inspect-and-adapt purpose.
When a Developer is stuck or struggling, the team figures out how to help. No one gets assigned "help Alice" by a manager.
If a Developer is disrupting team effectiveness, the Scrum Team — not the Scrum Master alone — handles it.

The team is a unit. Its decisions come from within.`
      },
      {
        heading: 'Sustainable pace',
        body: `The Agile Manifesto — which Scrum predates but aligns with — says agile processes promote sustainable development at a constant pace indefinitely. Scrum itself doesn't prescribe hours, but the underlying principle is: don't burn out.

If your team is consistently working 60-hour weeks to meet Sprint forecasts, you're either forecasting too much or using velocity as pressure. Both are anti-patterns. A team that averages 40 productive hours for a year outproduces one that burns at 60 hours for two months and then falls apart.`
      }
    ],
    mnemonics: [
      { label: 'Plan · Quality · Adapt · Peer', text: 'The four Developer accountabilities from the Scrum Guide.' },
      { label: 'No titles', text: 'Tester, Architect, Designer, BA — all are Developers. Say it enough that the exam traps stop fooling you.' }
    ],
    tips: [
      'If an exam question mentions a "Tester" or "QA" on a Scrum Team, it\'s testing whether you know those aren\'t Scrum roles. All are Developers.',
      'Who estimates? The Developers. Who selects items for the Sprint? The Developers (in collaboration with the PO). Who owns the Sprint Backlog? The Developers. If in doubt, it\'s usually the Developers for anything about execution.',
      'Only the Developers are required at the Daily Scrum. Not the SM, not the PO (unless they\'re actively working on a Sprint Backlog item).',
      'A Developer struggling with an item should collaborate — first with the PO for clarification, then with fellow Developers. Escalating to the Scrum Master is usually wrong.'
    ],
    keyPoints: [
      '"Developers" is the 2020 term — no more "Development Team," no sub-titles like Tester, Architect, etc.',
      'The Developers select Product Backlog items for the Sprint.',
      'The Developers create and own the Sprint Backlog.',
      'The Developers estimate Product Backlog items.'
    ],
    traps: [
      'There is no "Tester" or "QA" role in Scrum. Testing is a skill the team collectively needs.',
      'Developers are self-managing — no one (not SM, not PO) assigns them tasks.',
      'If a Developer is disrupting the team, the Scrum Team handles it. Not the Scrum Master alone.'
    ]
  },
  product_backlog: {
    intro: `If the Product Owner is Scrum's most misunderstood role, the Product Backlog is its most misunderstood artifact. People imagine a giant requirements document, a signed-off scope list, or a static roadmap. It's none of those. The Product Backlog is a living, ordered, emergent list — and the word "emergent" is doing most of the work.`,
    sections: [
      {
        heading: 'Emergent and ordered',
        body: `The Scrum Guide's definition: the Product Backlog is an emergent, ordered list of what is needed to improve the product. Both adjectives matter.

Emergent: the Backlog evolves as the team and organization learn. A new user pain point surfaces in research → new item. A security risk is discovered → new item. An assumption was wrong → affected items change or disappear. The Backlog is never "complete" and is never frozen.

Ordered: the items are in a deliberate sequence. Not prioritized (priorities allow ties). Not categorized (categories don't produce sequence). Ordered — there is a first, a second, a third. The PO is accountable for that sequence.

The Backlog is also the single source of work for the Scrum Team. Anything the team is working on that isn't in the Backlog is a transparency problem.`
      },
      {
        heading: 'What\'s in an item',
        body: `The 2020 Scrum Guide names three attributes for Product Backlog items:

Description — what is this and why does it matter?
Order — where does it sit relative to other items?
Size — how big is it? This is what the Developers estimate.

Teams often add more — value, acceptance criteria, links, owner, etc. — but those are team techniques, not Scrum requirements. The Scrum Guide does not prescribe user stories, acceptance criteria, story points, MoSCoW priorities, T-shirt sizing, or any other specific technique. Teams use these because they work — not because Scrum requires them.

A concrete item might be one paragraph or a detailed document. Higher-order items (near the top) are smaller and clearer. Lower-order items (near the bottom) are larger and vaguer. That's fine. Detailing something you won't start for six months is usually wasted effort — you'll learn things between now and then that change it.`
      },
      {
        heading: 'Refinement: the gradient',
        body: `Refinement is the act of adding detail, order, and size to Backlog items — usually making them smaller and clearer as they move toward the top. It's an ongoing activity, not a formal event. The 2020 Scrum Guide doesn't prescribe a specific time budget for it.

Refinement happens inside the Sprint. The whole Scrum Team can participate — Developers often estimate and split items, the PO clarifies intent and ordering, the SM facilitates when useful.

There is no such thing as a "Definition of Ready" in the Scrum Guide. Some teams use one as a technique to avoid pulling half-baked items into a Sprint. Fine, if it works. But don't let it become a gate that blocks collaboration or justifies PO/Developer silos.`,
        example: {
          title: 'Shopping list with horizon',
          body: `Think of your weekly grocery list. The items for tomorrow's dinner are specific: "2 red onions, 500g ground beef, fresh basil."

Items for next week are vaguer: "something for the kids' lunches."

Items for a month from now are barely there: "restock pantry staples."

A Product Backlog is similar. The top is sharp and small. The bottom is fuzzy and big. As items approach the top, they get refined — broken up, detailed, estimated. Detailing the bottom of the list is mostly wasted work.`
        }
      },
      {
        heading: 'Ordering — the PO\'s judgment call',
        body: `The Scrum Guide lists example factors for ordering: value, risk, priority, dependencies. That list is not exhaustive. The PO orders based on whatever best helps the team achieve the Product Goal and maximize value.

Common factors in practice:
Value — expected impact on users or business metrics.
Risk — items that resolve big unknowns early are often pulled up, even if their direct value is modest.
Dependencies — an item that blocks several others may need to come first even when its own value is low.
Cost — among items of similar value, cheaper ones often go first.
Learning potential — items that validate an important assumption can be worth prioritizing.

There's no formula. There's no universal "correct" order. Ordering is the PO's professional judgment, exercised continuously as new information arrives.`
      }
    ],
    mnemonics: [
      { label: 'D.O.S.', text: 'Description, Order, Size — the three PBI attributes the 2020 Scrum Guide names. Teams often add more (value, acceptance criteria) as a technique; only these three are in the Guide.' },
      { label: '1 product = 1 Backlog', text: 'No matter how many teams. No "per-team backlog" ever exists in Scrum.' }
    ],
    tips: [
      'If an exam question asks about a "Definition of Ready," the answer is almost always that it\'s not a Scrum concept.',
      'The Product Backlog is never baselined. If a question implies a frozen or approved Backlog, something is wrong in that framing.',
      'Ordering is a PO decision, delegable but not transferable in accountability. If Developers or stakeholders "decide the order," it\'s a trap.',
      'There is no Sprint 0 for "building the initial Backlog." The Backlog exists as soon as anyone starts thinking about the product; a first Sprint starts when there\'s enough at the top to plan from.',
      'All product work — features, fixes, non-functional requirements, documentation — belongs on the one Product Backlog. Separate backlogs for "technical" or "bug" work destroy transparency.'
    ],
    keyPoints: [
      'Attributes of a Product Backlog item per the 2020 Scrum Guide: description, order, and size.',
      'The Developers who will do the work size the items.',
      'Refinement is an ongoing activity, not a formal event. No specific time budget is prescribed.',
      'The Product Owner is accountable for ordering. Ordering considers value, risk, dependencies, and more.',
      'Higher-order items are clearer and more detailed than lower-order items.'
    ],
    traps: [
      'One product = one Product Backlog, even with multiple teams.',
      'There is no "Definition of Ready" in the 2020 Scrum Guide.',
      'The Product Backlog is NEVER baselined — it\'s always evolving.',
      'Value points, story points, MoSCoW — none of these are prescribed by Scrum.',
      'A first Sprint can start before the Product Backlog is "complete." It never will be.'
    ]
  },
  sprint_backlog: {
    intro: `The Sprint Backlog is often described as "the Developers' to-do list for the Sprint." That's close but misses the structure. The Sprint Backlog has three deliberate parts — why, what, and how — and understanding all three is essential for the exam and for real practice.`,
    sections: [
      {
        heading: 'The three parts',
        body: `The Sprint Backlog is composed of:

Sprint Goal — the single objective for the Sprint. The why. Crafted during Sprint Planning. The Sprint's commitment.
Selected Product Backlog items — what the Developers forecast they can deliver this Sprint.
An actionable plan for delivering the Increment — the how. Usually visible as tasks, sub-items, or a board of work.

All three matter. The Sprint Goal keeps the team focused when scope needs to flex. The selected items anchor the forecast. The plan makes the work visible and adaptable.`
      },
      {
        heading: 'Owned by the Developers',
        body: `The Sprint Backlog belongs to the Developers. They create it. They update it. They decide how to structure it. The PO doesn't control it. The Scrum Master doesn't own it. Managers can't modify it.

If something needs to change mid-Sprint — an item is bigger than expected, a dependency emerges, new learning arrives — the Developers renegotiate scope with the PO through collaboration. This is not scope creep. This is how empiricism is supposed to work.

What the Developers cannot do unilaterally: change the Sprint Goal, remove scope that would defeat the Goal, or alter the Definition of Done mid-Sprint.`
      },
      {
        heading: 'Emergence in action',
        body: `At Sprint Planning, the Sprint Backlog isn't fully defined. The Developers don't need to know every task they'll perform on day 14. They need enough to start Sprint day 1 with confidence and a plan good enough to generate the forecast.

As the Sprint progresses, the plan evolves. New tasks emerge as the Developers learn. Work gets broken down further. Dead-end approaches get abandoned. This is all normal.

The Daily Scrum is partly for this: the Developers inspect progress toward the Sprint Goal and adapt the Sprint Backlog. If day 3 reveals a task that's ten times bigger than expected, the plan changes — and possibly, the scope discussion with the PO begins.`,
        example: {
          title: 'A real Sprint\'s arc',
          body: `Sprint Planning, day 1. Team forecasts 8 items, sets a Sprint Goal ("enable self-service password reset for customers"). Sprint Backlog has the 8 items and a rough plan breaking each into 2-4 tasks.

Day 3, Daily Scrum. Developers realize item #5 depends on a third-party API that's currently down. They replan: swap item #5 for a smaller item from the Backlog top that also serves the Sprint Goal. PO present for five minutes to confirm.

Day 7, Daily Scrum. Item #2 turned out simpler than expected; Developers pull in an extra from the Backlog.

Day 10 (Sprint end). Eight items done, goal met, one swapped-in bonus also done. Sprint Backlog looks nothing like what it did on day 1 — and that's exactly right.`
        }
      },
      {
        heading: 'Including improvements',
        body: `The 2020 Scrum Guide softened an old rule. The pre-2020 Guide required the Sprint Backlog to include at least one high-priority improvement from the previous Retrospective. The 2020 Guide instead says improvements may be added to the Sprint Backlog.

The principle is unchanged: continuous improvement is work. If improvements aren\'t scheduled in, they don\'t happen. Putting them on the Sprint Backlog gives them the same visibility as feature work. But whether they must appear there is no longer mandated.`
      }
    ],
    mnemonics: [
      { label: 'Why · What · How', text: 'The Sprint Goal (why), selected items (what), plan (how). All three together = the Sprint Backlog.' }
    ],
    tips: [
      'The Sprint Backlog is owned by the Developers. Not the Scrum Team, not the PO. Just the Developers. This distinction shows up on the exam.',
      'Scope can be renegotiated with the PO mid-Sprint. The Sprint Goal cannot (except for Sprint cancellation, which only the PO can trigger).',
      'The Sprint Backlog is not fully defined at Sprint Planning — enough to start, not everything.',
      'If a question frames the Sprint Backlog as a frozen commitment that can\'t change, that\'s the wrong framing.'
    ],
    keyPoints: [
      'Owned exclusively by the Developers.',
      'Updated throughout the Sprint as more is learned.',
      'May include at least one improvement identified in the previous Sprint Retrospective. The 2020 Guide softened this from a requirement to a recommendation.'
    ],
    traps: [
      'The PO does not own and cannot modify the Sprint Backlog. Scope renegotiation with the PO is done through collaboration, not unilateral action.',
      'The Sprint Backlog is not fully defined at Sprint Planning — it emerges.',
      'Scope may be clarified and renegotiated with the PO as more is learned. This is not scope creep — it\'s adaptation.'
    ]
  },
  events: {
    intro: `Scrum has five events. Understanding each event's purpose — not just its name or timebox — is the difference between doing Scrum and ritualizing it. Every event exists to inspect or adapt something. Skip the purpose and you're left with ceremony.`,
    sections: [
      {
        heading: 'The Sprint: the container',
        body: `The Sprint is the heartbeat of Scrum and contains all other events. It's one month or less, fixed length, with a Sprint Goal. A new Sprint starts immediately after the previous one concludes — there's no gap, no "Sprint break," no planning week between.

The Sprint's purpose: create a usable Increment. Every Sprint must produce at least one Increment meeting the Definition of Done. Multiple Increments in a Sprint are allowed (and often healthy — release when ready, not when the Sprint is over).

Only the Product Owner can cancel a Sprint, and only when the Sprint Goal becomes obsolete. Falling behind doesn't qualify. A stakeholder changing their mind doesn't qualify. Only: "the goal we set no longer makes sense."`
      },
      {
        heading: 'Sprint Planning: Why → What → How',
        body: `Max 8 hours for a one-month Sprint. Proportionally less for shorter Sprints (2h for a one-week Sprint is typical).

Sprint Planning answers three questions in order:

Why is this Sprint valuable? The Scrum Team discusses the Product Goal and agrees on a Sprint Goal that serves it. This is the Sprint's single objective.
What can be Done this Sprint? The Developers, in collaboration with the PO, select Product Backlog items they can realistically complete given the Sprint Goal and their capacity.
How will the work be done? The Developers break down selected items into a plan — tasks, design decisions, who will pair with whom. This part often continues past the event boundary as more emerges.

Notice: the Sprint Goal is crafted during Sprint Planning, not brought into it. The PO comes in with business context and priorities; the Sprint Goal is co-created.`
      },
      {
        heading: 'Daily Scrum: inspect, plan forward',
        body: `15 minutes. Every working day. Same time, same place. For the Developers, though the PO and SM may attend.

The Daily Scrum is not a status meeting. Status reporting is a transparency mechanism aimed at people outside the team. The Daily Scrum is for the Developers themselves to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as needed.

The 2020 Scrum Guide removed the old "three questions" format (what I did, what I'll do, impediments). Teams are free to run the Daily Scrum however serves them, as long as it inspects progress toward the Sprint Goal and produces an updated plan.

If the Daily Scrum has drifted into round-robin status updates, that's a Retrospective topic.`
      },
      {
        heading: 'Sprint Review: not a demo, not a gate',
        body: `Max 4 hours for a one-month Sprint. The Scrum Team meets with stakeholders to inspect the Increment and discuss what to do next.

Common misconception: the Sprint Review is a "demo" or "formal approval meeting." It isn't. The Scrum Guide explicitly describes it as a working session. The Increment is inspected. Stakeholders provide feedback. The Product Backlog is adapted based on what was learned — new items appear, existing items change or disappear.

Who attends: the Scrum Team, plus stakeholders invited by the Product Owner. The Scrum Guide doesn't dictate exactly who — the PO decides whom to invite to make the Review productive. In practice, invite stakeholders whose feedback matters for the next Sprint's work.`
      },
      {
        heading: 'Sprint Retrospective: focus on the team',
        body: `Max 3 hours for a one-month Sprint. The Scrum Team inspects itself — individuals, interactions, processes, tools, Definition of Done — and identifies improvements.

Where other events focus primarily on the product (Planning, Review) or the Sprint Backlog (Daily Scrum), the Retrospective centers on the team itself. What went well. What didn\'t. What to change. The Definition of Done is also inspected here, since it governs the Increment\'s quality.

Stakeholders aren\'t typically invited. The Retrospective is a safe space for the team to be honest about itself. The team may invite others when it serves a specific purpose, but the default is Scrum Team only.

Outcomes should be actionable. At least one improvement item ideally moves into the next Sprint Backlog so the change actually gets worked on. If improvement items pile up without action, the Retrospective is failing.`
      }
    ],
    visual: `<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:640px;margin:0 auto;display:block"><defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e8a838"/></marker></defs><rect x="40" y="60" width="560" height="100" fill="none" stroke="#e8a838" stroke-width="1.5" opacity="0.6"/><text x="320" y="48" text-anchor="middle" fill="#e8a838" font-size="11" font-family="JetBrains Mono, monospace" letter-spacing="1.5">SPRINT (≤ 1 MONTH)</text><rect x="50" y="70" width="60" height="40" fill="currentColor" opacity="0.15"/><text x="80" y="95" text-anchor="middle" fill="currentColor" font-size="10" font-family="JetBrains Mono, monospace">PLAN</text><text x="80" y="128" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.5" font-family="JetBrains Mono, monospace">≤8h</text><line x1="130" y1="75" x2="130" y2="155" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.4"/><circle cx="180" cy="90" r="4" fill="#e8a838"/><circle cx="230" cy="90" r="4" fill="#e8a838"/><circle cx="280" cy="90" r="4" fill="#e8a838"/><circle cx="330" cy="90" r="4" fill="#e8a838"/><circle cx="380" cy="90" r="4" fill="#e8a838"/><circle cx="430" cy="90" r="4" fill="#e8a838"/><text x="305" y="128" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Daily Scrum · 15 min each</text><rect x="475" y="70" width="55" height="40" fill="currentColor" opacity="0.15"/><text x="502" y="95" text-anchor="middle" fill="currentColor" font-size="10" font-family="JetBrains Mono, monospace">REVIEW</text><text x="502" y="128" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.5" font-family="JetBrains Mono, monospace">≤4h</text><rect x="535" y="70" width="55" height="40" fill="currentColor" opacity="0.15"/><text x="562" y="95" text-anchor="middle" fill="currentColor" font-size="10" font-family="JetBrains Mono, monospace">RETRO</text><text x="562" y="128" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.5" font-family="JetBrains Mono, monospace">≤3h</text><path d="M 600 185 L 625 185 L 625 90 L 620 90" stroke="#e8a838" stroke-width="1.2" fill="none" stroke-dasharray="3 3" opacity="0.6" marker-end="url(#ar2)"/><text x="40" y="190" fill="currentColor" font-size="10" opacity="0.55" font-family="JetBrains Mono, monospace">GOAL:</text><text x="80" y="190" fill="currentColor" font-size="10" opacity="0.75" font-family="Fraunces, serif" font-style="italic">Produce at least one usable Increment meeting the DoD.</text><text x="40" y="210" fill="currentColor" font-size="9" opacity="0.45" font-family="JetBrains Mono, monospace">NEXT SPRINT: starts immediately after Retro. No gap.</text></svg>`,
    mnemonics: [
      { label: '1 · 15 · 3 · 4 · 8', text: 'Max timeboxes for a one-month Sprint. Sprint = 1 month, Daily = 15 min, Retro = 3h, Review = 4h, Planning = 8h.' },
      { label: 'Why · What · How', text: 'Sprint Planning, in that order.' },
      { label: 'Inspect-adapt pairs', text: 'Daily Scrum inspects the Sprint Backlog. Sprint Review inspects the Increment. Retrospective inspects the team.' }
    ],
    tips: [
      'A new Sprint starts immediately after the previous one ends. No gap. If a question implies a week between Sprints, it\'s wrong.',
      'Only the PO can cancel a Sprint, and only when the Sprint Goal becomes obsolete. "The team is behind" is never a valid reason.',
      'The Sprint Review is a working session, not a formal gate or demo. "Formal meeting" is a trap word.',
      'Stakeholders attend the Sprint Review. They do not attend the Retrospective (unless the team specifically invites them).',
      'Timeboxes are maximums. A two-hour Retrospective is fine if the team is done. Shorter is not a failure.',
      'There is no Sprint 0, Release Sprint, or Hardening Sprint in Scrum.'
    ],
    keyPoints: [
      'Sprint: max 1 month. Contains all other events. A new Sprint starts immediately after the previous concludes.',
      'Sprint Planning: max 8 hours for a one-month Sprint. Addresses why (Sprint Goal), what (selected PBIs), how (plan).',
      'Daily Scrum: 15 minutes, for the Developers. Same time, same place, every working day of the Sprint.',
      'Sprint Review: max 4 hours for a one-month Sprint. Working session with stakeholders to inspect the Increment and adapt the Product Backlog. NOT a formal gate.',
      'Sprint Retrospective: max 3 hours for a one-month Sprint. Scrum Team plans ways to increase quality and effectiveness.',
      'Only the Product Owner can cancel a Sprint, and only when the Sprint Goal becomes obsolete.'
    ],
    traps: [
      'Daily Scrum has no mandated format. The "three questions" are no longer prescribed in the 2020 Scrum Guide.',
      'The Sprint Review is not a "formal" demo or approval meeting — it\'s a working session.',
      'Stakeholders attend the Sprint Review (not the Retrospective, unless the team invites).',
      'No "Sprint 0." No "hardening Sprint." No "release Sprint." All Sprints produce Increments.',
      'Timeboxes are maximums, not targets. Shorter is fine.'
    ]
  },
  artifacts_commitments: {
    intro: `The 2020 Scrum Guide introduced one of its most important changes: pairing each artifact with a commitment. Before 2020, artifacts existed somewhat abstractly. After 2020, each artifact has an anchor — a commitment that gives it purpose and direction. This pairing is exam-critical and conceptually central.`,
    sections: [
      {
        heading: 'Three artifacts, three commitments',
        body: `Scrum has three artifacts: Product Backlog, Sprint Backlog, Increment. Each gets a commitment:

Product Backlog → Product Goal. The long-term objective that unifies Sprints.
Sprint Backlog → Sprint Goal. The single objective for one Sprint.
Increment → Definition of Done. The quality standard that makes an Increment real.

Why pair them? Because an artifact without a commitment is just data. The Product Backlog without a Product Goal is a list of stuff. The Sprint Backlog without a Sprint Goal is a to-do list. The Increment without a Definition of Done is a claim.

Commitments are what make artifacts meaningful for inspection and adaptation. You can't inspect "progress toward nothing." You inspect progress toward a Sprint Goal, toward a Product Goal, against the Definition of Done.`
      },
      {
        heading: 'Product Goal',
        body: `The Product Goal is the Scrum Team's long-term objective. It describes a future state of the product worth aiming at. The Scrum Team focuses on one Product Goal at a time.

It lives in the Product Backlog — it's not a separate artifact. The Product Backlog emerges to define what will fulfill the Product Goal.

When one Product Goal is achieved (or abandoned because the world changed), a new one is set. A Product Goal doesn't have to be "ship feature X" — it could be "reduce customer onboarding time to under five minutes" or "reach product-market fit in this segment."`
      },
      {
        heading: 'Sprint Goal',
        body: `The Sprint Goal is the single objective for the Sprint. It's created during Sprint Planning by the Scrum Team. It gives coherence to the Sprint — a reason the selected items belong together.

The Sprint Goal is committed. The selected Product Backlog items are forecast, not committed. This distinction is important: if during the Sprint the team learns that a different combination of items would better serve the Sprint Goal, they can renegotiate items with the PO. What doesn't change without Sprint cancellation: the Goal itself.

A good Sprint Goal is concrete enough that you can tell whether you've met it. "Make progress on feature X" is weak. "Ship self-service password reset to 10% of users" is strong.`
      },
      {
        heading: 'Definition of Done',
        body: `The Definition of Done is the quality standard for the Increment. An item isn't "done" because a Developer feels finished or a PO approves — it's done because it meets the DoD. This is how Scrum enforces quality as a contract, not a matter of opinion.

Who creates the DoD? The organization, if there is an organizational standard. Otherwise the Scrum Team creates one appropriate for the product. The team can add more stringent criteria to an organizational DoD but cannot loosen it.

When multiple teams work on the same product, they share one Definition of Done. Otherwise Increments can't combine into a coherent whole.

The DoD shouldn't change mid-Sprint — that would invalidate work already done under the old standard. Change it in the Retrospective.

If an item doesn't meet the DoD at Sprint end, it's not part of the Increment. It goes back to the Product Backlog for the PO to decide what to do with it.`
      },
      {
        heading: 'The Increment',
        body: `An Increment is a concrete stepping stone toward the Product Goal. Each Increment is additive to prior Increments, thoroughly verified, and usable. Multiple Increments may be created in a Sprint.

"Usable" is strong language. The Increment must be in a state where the PO could release it — whether they actually release it is a separate decision.

The Sprint Review presents the Increment to stakeholders for inspection. But an Increment can be presented only if it meets the Definition of Done. This is why the DoD is structural, not optional.`
      }
    ],
    visual: `<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px;margin:0 auto;display:block"><defs><marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e8a838"/></marker></defs><rect x="20" y="30" width="160" height="70" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="100" y="60" text-anchor="middle" fill="currentColor" font-size="14" font-family="Fraunces, serif" font-weight="500">Product Backlog</text><text x="100" y="82" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.55" font-family="JetBrains Mono, monospace">what can be done</text><path d="M 180 65 L 370 65" stroke="#e8a838" stroke-width="1.5" fill="none" marker-end="url(#ar3)" stroke-dasharray="4 3"/><text x="275" y="58" text-anchor="middle" fill="#e8a838" font-size="10" font-family="JetBrains Mono, monospace" letter-spacing="1.5">COMMITS TO</text><rect x="370" y="30" width="170" height="70" fill="none" stroke="#e8a838" stroke-width="1.5"/><text x="455" y="60" text-anchor="middle" fill="#e8a838" font-size="14" font-family="Fraunces, serif" font-weight="500">Product Goal</text><text x="455" y="82" text-anchor="middle" fill="#e8a838" font-size="10" opacity="0.75" font-family="JetBrains Mono, monospace">long-term direction</text><rect x="20" y="115" width="160" height="70" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="100" y="145" text-anchor="middle" fill="currentColor" font-size="14" font-family="Fraunces, serif" font-weight="500">Sprint Backlog</text><text x="100" y="167" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.55" font-family="JetBrains Mono, monospace">plan for this Sprint</text><path d="M 180 150 L 370 150" stroke="#e8a838" stroke-width="1.5" fill="none" marker-end="url(#ar3)" stroke-dasharray="4 3"/><text x="275" y="143" text-anchor="middle" fill="#e8a838" font-size="10" font-family="JetBrains Mono, monospace" letter-spacing="1.5">COMMITS TO</text><rect x="370" y="115" width="170" height="70" fill="none" stroke="#e8a838" stroke-width="1.5"/><text x="455" y="145" text-anchor="middle" fill="#e8a838" font-size="14" font-family="Fraunces, serif" font-weight="500">Sprint Goal</text><text x="455" y="167" text-anchor="middle" fill="#e8a838" font-size="10" opacity="0.75" font-family="JetBrains Mono, monospace">single Sprint objective</text><rect x="20" y="200" width="160" height="50" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="100" y="222" text-anchor="middle" fill="currentColor" font-size="14" font-family="Fraunces, serif" font-weight="500">Increment</text><text x="100" y="240" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.55" font-family="JetBrains Mono, monospace">usable result</text><path d="M 180 225 L 370 225" stroke="#e8a838" stroke-width="1.5" fill="none" marker-end="url(#ar3)" stroke-dasharray="4 3"/><text x="275" y="218" text-anchor="middle" fill="#e8a838" font-size="10" font-family="JetBrains Mono, monospace" letter-spacing="1.5">COMMITS TO</text><rect x="370" y="200" width="170" height="50" fill="none" stroke="#e8a838" stroke-width="1.5"/><text x="455" y="222" text-anchor="middle" fill="#e8a838" font-size="14" font-family="Fraunces, serif" font-weight="500">Definition of Done</text><text x="455" y="240" text-anchor="middle" fill="#e8a838" font-size="10" opacity="0.75" font-family="JetBrains Mono, monospace">quality floor</text></svg>`,
    mnemonics: [
      { label: 'PB·PG · SB·SG · I·DoD', text: 'Product Backlog + Product Goal. Sprint Backlog + Sprint Goal. Increment + Definition of Done.' },
      { label: 'Committed vs Forecast', text: 'The Sprint GOAL is committed. The selected ITEMS are forecast. Items can flex; Goal cannot.' }
    ],
    tips: [
      'Memorize the three pairings cold. At least one exam question will test them directly.',
      'The Product Goal lives IN the Product Backlog. It\'s not a separate artifact.',
      'Multiple Increments can exist in a single Sprint. The 2020 Guide added this explicitly.',
      'The DoD belongs to the Scrum Team (or the organization). The PO does not own it.',
      'If an item doesn\'t meet the DoD, it\'s not Done. Back to the Product Backlog, no partial credit.',
      'The DoD cannot be changed mid-Sprint — that would invalidate prior work. Retrospective is the place to adjust it.'
    ],
    keyPoints: [
      'Product Goal: the long-term objective for the Scrum Team. One goal at a time. In the Product Backlog.',
      'Sprint Goal: the single objective for the Sprint. Created during Sprint Planning, added to the Sprint Backlog.',
      'Definition of Done: a formal description of the state of the Increment when it meets the quality measures required for the product. Shared by all teams working on the same product.',
      'An Increment is a concrete stepping stone toward the Product Goal. Each Increment is additive to prior Increments, thoroughly verified, and usable. Multiple Increments may be created in a Sprint.'
    ],
    traps: [
      'The Sprint Goal is committed to by the Developers, but the PBIs selected are not — selection may be renegotiated.',
      'If the organization has a DoD, the Scrum Team must follow it as a minimum and can add more stringent criteria.',
      'The Increment must meet the DoD — if it doesn\'t, it can\'t be released and can\'t be presented at Sprint Review.',
      'The Product Goal lives in the Product Backlog. It\'s not a separate artifact.'
    ]
  },
  scaling: {
    intro: `Scaling Scrum — running multiple Scrum Teams on one product — is where many organizations misapply the framework. The rules are simpler than people expect: scaling doesn't multiply the artifacts or accountabilities. It multiplies teams around one product, one backlog, one PO, one DoD. Understanding these invariants will handle almost every scaling question on the exam.`,
    sections: [
      {
        heading: 'The invariants',
        body: `When N Scrum Teams work on the same product, these remain singular:

One Product Owner — regardless of team count.
One Product Backlog — everything everyone is building for this product.
One Product Goal — the shared long-term objective.
One Definition of Done — otherwise Increments can't combine.

These remain per-team:

N Sprint Backlogs — each team has its own plan.
N Sprint Goals — each team commits to its own Sprint objective (ideally aligned with the Product Goal).
1–N Scrum Masters — often one per team, but one person can serve multiple teams.

Also: each Sprint, every team's work should integrate into a combined, usable Increment. If Team A's work and Team B's work can't merge and run together by end-of-Sprint, the "Increment" is a fiction.`
      },
      {
        heading: 'Why not N Product Backlogs',
        body: `The temptation in scaling is to give each team its own mini-backlog: "Team A handles mobile, Team B handles backend, Team C handles payments." This seems tidy. It's an anti-pattern.

Separate backlogs hide dependencies. When mobile needs something from backend, that request lives somewhere — either in Team A's backlog (invisible to Team B), Team B's backlog (disconnected from user value), or a shared spreadsheet nobody updates. All three fail transparency.

One backlog exposes dependencies. When an item requires work from multiple teams, that's visible. The PO and the teams can structure the work to reduce those dependencies — which is the real goal.`,
        example: {
          title: 'The six-team launch',
          body: `Six teams. One product. One PO. One Product Backlog.

At PB refinement, teams notice that five Backlog items depend on a shared data service that only one team has touched. Instead of accepting the dependency, the teams propose restructuring: two items can be redesigned to not need the service, two others can be done by any team if they add some shared utilities first.

That restructuring — breaking the work so teams can operate independently — is the correct response to multi-team dependencies. Not "assign a coordinator." Not "give each team its own backlog." Restructure the work.`
        }
      },
      {
        heading: 'Cross-team coordination',
        body: `When multiple teams work on one product, they must coordinate. In Scrum, coordination is the teams' responsibility — they self-manage across boundaries just as they self-manage within their own borders.

No "Lead Team." No "Chief PO" with veto authority over sub-POs (there are no sub-POs). No external coordinator assigned by management. The teams figure out how to work together.

Practical patterns teams use: joint refinement sessions, Scrum of Scrums (brief cross-team sync), shared communication channels, joint Sprint Reviews. All of these are techniques — none is prescribed by Scrum.`
      },
      {
        heading: 'The estimation normalization trap',
        body: `A common scaling mistake: "Let's normalize story points across teams so we can compare performance."

This misunderstands estimation. Story points are a team's relative measure of complexity for its own work. Team A's 5-point item and Team B's 5-point item represent entirely different things, and that's fine — because story points aren't meant to be compared across teams.

Normalizing breaks the purpose of estimation (helping the team forecast) and introduces cross-team comparison (which isn't in Scrum and typically corrupts the estimation behavior). If leadership wants cross-team visibility, that's via Increments shipped and value delivered — not story points.`
      }
    ],
    visual: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px;margin:0 auto;display:block"><rect x="210" y="20" width="110" height="45" fill="none" stroke="#e8a838" stroke-width="1.5"/><text x="265" y="42" text-anchor="middle" fill="#e8a838" font-size="12" font-family="Fraunces, serif">1 PO</text><text x="265" y="58" text-anchor="middle" fill="#e8a838" font-size="9" opacity="0.75" font-family="JetBrains Mono, monospace">one per product</text><rect x="210" y="80" width="110" height="45" fill="none" stroke="#e8a838" stroke-width="1.5"/><text x="265" y="102" text-anchor="middle" fill="#e8a838" font-size="12" font-family="Fraunces, serif">1 Backlog</text><text x="265" y="118" text-anchor="middle" fill="#e8a838" font-size="9" opacity="0.75" font-family="JetBrains Mono, monospace">single source of work</text><line x1="265" y1="125" x2="110" y2="175" stroke="currentColor" stroke-width="0.8" opacity="0.4"/><line x1="265" y1="125" x2="265" y2="175" stroke="currentColor" stroke-width="0.8" opacity="0.4"/><line x1="265" y1="125" x2="420" y2="175" stroke="currentColor" stroke-width="0.8" opacity="0.4"/><rect x="60" y="175" width="100" height="60" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="110" y="197" text-anchor="middle" fill="currentColor" font-size="12" font-family="Fraunces, serif">Team A</text><text x="110" y="215" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Sprint Backlog</text><text x="110" y="227" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Sprint Goal</text><rect x="215" y="175" width="100" height="60" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="265" y="197" text-anchor="middle" fill="currentColor" font-size="12" font-family="Fraunces, serif">Team B</text><text x="265" y="215" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Sprint Backlog</text><text x="265" y="227" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Sprint Goal</text><rect x="370" y="175" width="100" height="60" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><text x="420" y="197" text-anchor="middle" fill="currentColor" font-size="12" font-family="Fraunces, serif">Team C</text><text x="420" y="215" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Sprint Backlog</text><text x="420" y="227" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.55" font-family="JetBrains Mono, monospace">Sprint Goal</text><text x="260" y="254" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.55" font-family="JetBrains Mono, monospace" letter-spacing="1">shared Definition of Done across all teams</text></svg>`,
    mnemonics: [
      { label: '1 · 1 · 1 · 1', text: 'One Product → one PO, one Backlog, one Product Goal, one DoD.' },
      { label: 'N · N · 1–N', text: 'N Sprint Backlogs, N Sprint Goals, 1 to N Scrum Masters.' }
    ],
    tips: [
      'If any exam answer suggests separate Product Backlogs per team or multiple POs for one product, it\'s wrong.',
      'Cross-team coordination is self-managed by the teams. "Assign a coordinator" or "Lead Developer" answers are traps.',
      'Don\'t normalize estimates across teams. Each team\'s sizes are relative to itself.',
      'When dependencies between teams are the problem, the answer is usually to restructure the work — not to add coordination overhead.',
      'All teams on the same product share the same Definition of Done. Each team can add stricter criteria for itself but can\'t loosen the shared standard.'
    ],
    keyPoints: [
      'One product = one Product Backlog + one Product Owner, regardless of team count.',
      'Each Scrum Team has its own Sprint Backlog and Sprint Goal.',
      'Increments from multiple teams should integrate every Sprint so the combined result is usable.',
      'Coordination between teams is the teams\' responsibility — they self-manage across the boundary.'
    ],
    traps: [
      'Do NOT normalize estimates across teams. Estimation is relative to the team doing the work.',
      'No separate Product Backlogs per team. No separate Product Owners per team for the same product.',
      'No "Lead Developer" as a single point of contact — that violates self-management.',
      'Self-management refers to how the team does its work (who does what, when, and how) — not team formation. The Scrum Guide doesn\'t prohibit organizations from staffing teams.'
    ]
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   QUESTION BANK — curated from Ditectrev PSPO I, reconciled with 2020 Scrum Guide.
   Each question has: id, concept, type, selectCount, question, options, correct,
   explanation (general), and optional distractors (why each wrong option is wrong).
   ────────────────────────────────────────────────────────────────────────── */

export const QUESTIONS = [
  // ═══════════ SCRUM THEORY ═══════════
  {
    id: 'st1', concept: 'scrum_theory', type: 'single',
    q: 'Which statement best describes Scrum?',
    options: [
      { id: 'a', t: 'A defined and predictive process that conforms to the principles of Scientific Management.' },
      { id: 'b', t: 'A framework to generate value through adaptive solutions for complex problems.' },
      { id: 'c', t: 'A cookbook that defines best practices for software development.' },
      { id: 'd', t: 'A complete methodology that defines how to develop software.' },
    ],
    correct: ['b'],
    explanation: 'This is the opening definition from the 2020 Scrum Guide. Scrum is a framework — purposefully incomplete — not a methodology or prescribed process.',
    distractors: {
      a: 'Scrum is empirical, not defined/predictive. Scientific Management (Taylorism) assumes the work is predictable, which is exactly what Scrum doesn\'t.',
      c: 'Scrum does not prescribe practices. Engineering practices are the team\'s choice.',
      d: 'Scrum is deliberately incomplete. It\'s a framework, and calling it "complete" or "methodology" is a common exam trap.',
    },
  },
  {
    id: 'st2', concept: 'scrum_theory', type: 'multi', selectCount: 3,
    q: 'Which three of the following are true about Scrum?',
    options: [
      { id: 'a', t: 'Scrum is a framework for developing and sustaining complex products.' },
      { id: 'b', t: 'Scrum is a methodology where you can pick and choose which parts work for your environment.' },
      { id: 'c', t: 'Scrum implements self-management by replacing Project Managers with Scrum Masters.' },
      { id: 'd', t: 'Each component of Scrum serves a specific purpose and is essential to Scrum\'s success.' },
      { id: 'e', t: 'Scrum is based on empiricism and lean thinking.' },
    ],
    correct: ['a', 'd', 'e'],
    explanation: 'The Scrum Guide opens by calling Scrum a lightweight framework. It is founded on empiricism and lean thinking. Each element is purposeful — removing any piece obscures problems.',
  },
  {
    id: 'st3', concept: 'scrum_theory', type: 'single',
    q: 'Which of the following is a Scrum Value?',
    options: [
      { id: 'a', t: 'Creativity' },
      { id: 'b', t: 'Inspection' },
      { id: 'c', t: 'Adaptation' },
      { id: 'd', t: 'Focus' },
    ],
    correct: ['d'],
    explanation: 'The five Scrum Values are Commitment, Focus, Openness, Respect, and Courage. Inspection and Adaptation are pillars, not values.',
  },
  {
    id: 'st4', concept: 'scrum_theory', type: 'multi', selectCount: 5,
    q: 'Which of the following are Scrum Values?',
    options: [
      { id: 'a', t: 'Respect' },
      { id: 'b', t: 'Focus' },
      { id: 'c', t: 'Inspection' },
      { id: 'd', t: 'Collaboration' },
      { id: 'e', t: 'Commitment' },
      { id: 'f', t: 'Maximize Value' },
      { id: 'g', t: 'Courage' },
      { id: 'h', t: 'Openness' },
    ],
    correct: ['a', 'b', 'e', 'g', 'h'],
    explanation: 'The five values are Commitment, Focus, Openness, Respect, Courage. Inspection is a pillar. "Collaboration" and "Maximize Value" are not values despite being important concepts.',
  },
  {
    id: 'st5', concept: 'scrum_theory', type: 'single',
    q: 'Which of the following best describes the Scrum Pillar "Transparency"?',
    options: [
      { id: 'a', t: 'The whole process should be visible to everyone.' },
      { id: 'b', t: 'The process should be visible to the key stakeholders.' },
      { id: 'c', t: 'Significant aspects of the process must be visible to those responsible for the outcome.' },
    ],
    correct: ['c'],
    explanation: 'The Scrum Guide defines transparency as significant aspects of the process being visible to those responsible for the outcome. "Everyone" is too broad; "key stakeholders only" is too narrow.',
  },
  {
    id: 'st6', concept: 'scrum_theory', type: 'tf',
    q: 'Scrum can only be used to develop products, not to maintain/sustain existing ones.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Scrum is for complex work of any kind — development, maintenance, sustaining, research, operations. Anywhere empiricism helps.',
  },
  {
    id: 'st7', concept: 'scrum_theory', type: 'single',
    q: 'How do timeboxes help the Scrum Team validate assumptions, adapt, and maximize value?',
    options: [
      { id: 'a', t: 'Timeboxes ensure a Sprint doesn\'t stop until all testing is done and work is verified by the PO.' },
      { id: 'b', t: 'Timeboxes assure the PO that Developers will finish all Sprint Backlog work by the end of the Sprint.' },
      { id: 'c', t: 'Timeboxes help minimize risk by creating regular opportunities to validate assumptions using feedback from users and the market; allowing teams to inspect progress toward the Product Goal and decide whether to pivot or persevere.' },
      { id: 'd', t: 'At the end of each Sprint, a detailed report with all test cases and test results is available.' },
    ],
    correct: ['c'],
    explanation: 'Timeboxes are inspection-and-adaptation opportunities. They create cadence for validated learning. They don\'t guarantee completion.',
  },
  {
    id: 'st8', concept: 'scrum_theory', type: 'single',
    q: 'An organization has decided to adopt Scrum, but management wants to change the terminology to fit with terminology already used. What will likely happen?',
    options: [
      { id: 'a', t: 'Without a new vocabulary as a reminder of the change, very little change may actually happen.' },
      { id: 'b', t: 'The organization may not understand what has changed and the benefits of Scrum may be lost.' },
      { id: 'c', t: 'Management may feel less anxious.' },
      { id: 'd', t: 'All of the above.' },
    ],
    correct: ['d'],
    explanation: 'Tailoring terminology is a common anti-pattern. It comforts management but disguises the change, and organizations often revert to old habits with Scrum labels on top.',
  },

  // ═══════════ SCRUM TEAM ═══════════
  {
    id: 'stm1', concept: 'scrum_team', type: 'single',
    q: 'What does it mean for a Scrum Team to be cross-functional?',
    options: [
      { id: 'a', t: 'Developers work closely with external business analysts, architects, developers, and testers who are not on the team.' },
      { id: 'b', t: 'The Scrum Team includes skilled individuals who together have all the skills necessary to create value each Sprint.' },
      { id: 'c', t: 'The Scrum Team is a virtual team drawing from separate teams of business analysts, architects, developers, and testers.' },
      { id: 'd', t: 'The Scrum Team includes not only developers but also BAs, architects, and testers.' },
    ],
    correct: ['b'],
    explanation: 'Cross-functional refers to the team collectively — not to individuals being full-stack experts, and not to a virtual team pulling from silos.',
    distractors: {
      a: 'If core work requires outsiders, the team isn\'t cross-functional.',
      c: 'A virtual team from silos is the opposite of a cohesive Scrum Team.',
      d: 'Listing job titles contradicts the 2020 Scrum Guide, which eliminated sub-role titles within Developers.',
    },
  },
  {
    id: 'stm2', concept: 'scrum_team', type: 'tf',
    q: 'Cross-functional teams are optimized to work on one component or layer of a system only.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Cross-functional means end-to-end capability. Component teams are the opposite pattern and create dependencies.',
  },
  {
    id: 'stm3', concept: 'scrum_team', type: 'single',
    q: 'How many Developers are in a Scrum Team?',
    options: [
      { id: 'a', t: '3 to 10' },
      { id: 'b', t: '1 to 9' },
      { id: 'c', t: '3 to 9' },
      { id: 'd', t: 'The Scrum Guide states the Scrum Team is typically 10 or fewer people total.' },
    ],
    correct: ['d'],
    explanation: 'The 2020 Scrum Guide removed the 3–9 Developer rule. It states the Scrum Team is typically 10 or fewer people total — no hard minimum on Developers.',
  },
  {
    id: 'stm4', concept: 'scrum_team', type: 'multi', selectCount: 3,
    q: 'What are three benefits of self-management?',
    options: [
      { id: 'a', t: 'Increased self-accountability' },
      { id: 'b', t: 'Increased rule compliance' },
      { id: 'c', t: 'Increased creativity' },
      { id: 'd', t: 'Increased commitment' },
      { id: 'e', t: 'Increased accuracy of estimates' },
    ],
    correct: ['a', 'c', 'd'],
    explanation: 'Self-management increases ownership (accountability, commitment) and unlocks creativity. It doesn\'t make estimates more accurate, and compliance is not a Scrum goal.',
  },
  {
    id: 'stm5', concept: 'scrum_team', type: 'tf',
    q: 'Self-management means the team can decide which Scrum events are needed.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Self-management covers who/when/how of work — not whether to follow the Scrum framework. All events are required.',
  },
  {
    id: 'stm6', concept: 'scrum_team', type: 'tf',
    q: 'It is not allowed for the Product Owner to be a Developer (part of the Developers) at the same time.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Scrum Guide does not prohibit this. What matters is that the accountabilities are clear, not that they\'re held by different people.',
  },
  {
    id: 'stm7', concept: 'scrum_team', type: 'single',
    q: 'How often should Scrum Team membership change?',
    options: [
      { id: 'a', t: 'Every Sprint to promote shared learning.' },
      { id: 'b', t: 'As needed, with no special allowance for changes in productivity.' },
      { id: 'c', t: 'Never, it reduces productivity.' },
      { id: 'd', t: 'As needed, while taking into account a short-term reduction in productivity.' },
    ],
    correct: ['d'],
    explanation: 'Membership changes cause productivity drops while the team re-forms. Change when needed, but expect the cost.',
  },

  // ═══════════ PRODUCT OWNER ═══════════
  {
    id: 'po1', concept: 'product_owner', type: 'single',
    q: 'What is the Product Owner accountable for in Scrum?',
    options: [
      { id: 'a', t: 'Refining the top-level Product Backlog items until they are ready to be handed over to the Scrum Team.' },
      { id: 'b', t: 'Describing an Increment at Sprint Planning and making sure the Developers deliver it by the end of the Sprint.' },
      { id: 'c', t: 'Writing the User Stories so they are comprehensive enough for stakeholders.' },
      { id: 'd', t: 'Maximizing the value of the product resulting from the work of the Scrum Team.' },
    ],
    correct: ['d'],
    explanation: 'Word-for-word from the 2020 Scrum Guide. Everything else is activity-level; "maximize value" is the accountability.',
  },
  {
    id: 'po2', concept: 'product_owner', type: 'single',
    q: 'Which description best fits the role of the Product Owner?',
    options: [
      { id: 'a', t: 'Chief Business Analyst' },
      { id: 'b', t: 'Requirements Collector' },
      { id: 'c', t: 'Project Manager 2.0' },
      { id: 'd', t: 'Scope Protector' },
      { id: 'e', t: 'Value Maximizer' },
    ],
    correct: ['e'],
    explanation: 'The PO maximizes value. They\'re not a BA, a PM, or a scope gate.',
  },
  {
    id: 'po3', concept: 'product_owner', type: 'tf',
    q: 'A Product Owner is essentially the same thing as a traditional Project Manager.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'POs own product value and outcomes; PMs typically own scope, schedule, and cost. Different accountability, different authority.',
  },
  {
    id: 'po4', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'Which can be delegated to others, while the Product Owner remains accountable?',
    options: [
      { id: 'a', t: 'Attending the Sprint Review' },
      { id: 'b', t: 'Ordering Product Backlog items' },
      { id: 'c', t: 'Developing and communicating the Product Goal' },
      { id: 'd', t: 'Attending the Sprint Retrospective' },
    ],
    correct: ['b', 'c'],
    explanation: 'The Scrum Guide explicitly says the PO may delegate these work items but remains accountable. Event attendance as a Scrum Team member is not delegable.',
  },
  {
    id: 'po5', concept: 'product_owner', type: 'single',
    q: 'Who has the final decision about the order of items in the Product Backlog?',
    options: [
      { id: 'a', t: 'The Scrum Team' },
      { id: 'b', t: 'The Product Owner' },
      { id: 'c', t: 'The Scrum Master' },
      { id: 'd', t: 'The Stakeholders' },
    ],
    correct: ['b'],
    explanation: 'The PO is accountable for ordering. Others may influence; the PO decides.',
  },
  {
    id: 'po6', concept: 'product_owner', type: 'single',
    q: 'What is the responsibility of the Product Owner in crafting the Sprint Goal?',
    options: [
      { id: 'a', t: 'The PO has no responsibility in it. This is the Developers\' responsibility.' },
      { id: 'b', t: 'The PO defines the scope for a Sprint and therefore the Sprint Goal.' },
      { id: 'c', t: 'The PO should not come to Sprint Planning without a clearly defined Sprint Goal.' },
      { id: 'd', t: 'The PO comes to Sprint Planning with a business objective in mind and works with the Developers to craft the Sprint Goal.' },
      { id: 'e', t: 'The PO must work with stakeholders to set each Sprint\'s Goal.' },
    ],
    correct: ['d'],
    explanation: 'The whole Scrum Team crafts the Sprint Goal during Sprint Planning. The PO brings the business context.',
  },
  {
    id: 'po7', concept: 'product_owner', type: 'single',
    q: 'How much time must a Product Owner spend with the Developers?',
    options: [
      { id: 'a', t: 'As much time as the Developers ask the Product Owner to be present.' },
      { id: 'b', t: '100%.' },
      { id: 'c', t: 'Enough so that the Product Owner is confident the Increment will meet the intended value.' },
      { id: 'd', t: '40%, or more if the stakeholders agree.' },
    ],
    correct: ['c'],
    explanation: 'The Scrum Guide doesn\'t prescribe a percentage. "Enough to ensure value" is the pragmatic principle.',
  },
  {
    id: 'po8', concept: 'product_owner', type: 'single',
    q: 'Does the PO being held accountable for product value mean the Product Owner has final say over the Definition of Done?',
    options: [
      { id: 'a', t: 'Yes, the Product Owner decides the Definition of Done. The Developers may be consulted.' },
      { id: 'b', t: 'No, the Scrum Team decides the Definition of Done. The Product Owner is just one member of the Scrum Team.' },
    ],
    correct: ['b'],
    explanation: 'If the organization doesn\'t impose a DoD, the Scrum Team creates one appropriate for the product. The PO does not own it alone.',
  },
  {
    id: 'po9', concept: 'product_owner', type: 'tf',
    q: 'A Product Owner should measure product value by the increase in the team\'s velocity.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Velocity measures output, not value. A team can ship more and deliver less. Value is measured by customer outcomes, satisfaction, and business impact.',
  },
  {
    id: 'po10', concept: 'product_owner', type: 'single',
    q: 'When should the Product Owner update the project plan?',
    options: [
      { id: 'a', t: 'The Product Backlog is the plan in Scrum. It is updated as new information and insights emerge.' },
      { id: 'b', t: 'The project plan must be updated prior to the Sprint Retrospective.' },
      { id: 'c', t: 'Before the Sprint Planning to know how much work will have to be done in the Sprint.' },
      { id: 'd', t: 'After the Daily Scrum to ensure an accurate daily overview of project progress.' },
    ],
    correct: ['a'],
    explanation: 'Scrum has no separate "project plan." The Product Backlog is the plan for product work.',
  },
  {
    id: 'po11', concept: 'product_owner', type: 'single',
    q: 'What phrases best describe the relationship of the Product Owner and the Developers?',
    options: [
      { id: 'a', t: 'They work apart as much as possible to keep business and technology concerns separated.' },
      { id: 'b', t: 'They collaborate often so the Developers build Increments keeping end-user and stakeholder concerns in mind; and so the PO can make informed trade-offs between effort and value.' },
      { id: 'c', t: 'They share no more than the Sprint Planning and the Sprint Review.' },
      { id: 'd', t: 'The PO should be with the Developers full-time to grow deep understanding of the technology being used.' },
    ],
    correct: ['b'],
    explanation: 'The PO-Developer relationship is a continuous collaboration on value and feasibility.',
  },
  {
    id: 'po12', concept: 'product_owner', type: 'single',
    q: 'A Product Owner is entitled to postpone the start of a new Sprint after the conclusion of a previous Sprint for the following reason:',
    options: [
      { id: 'a', t: 'The Quality Assurance department needs more time to make the previous Increment complete.' },
      { id: 'b', t: 'The stakeholders are not happy with the value produced in the previous Sprint.' },
      { id: 'c', t: 'There is no acceptable reason. A new Sprint starts immediately after the conclusion of the previous Sprint.' },
      { id: 'd', t: 'The Product Owner has not identified a Sprint Goal.' },
      { id: 'e', t: 'Not enough Product Backlog Items are ready.' },
    ],
    correct: ['c'],
    explanation: 'A new Sprint starts immediately after the previous one concludes. No gap is allowed.',
  },
  {
    id: 'po13', concept: 'product_owner', type: 'single',
    q: 'In order to make investment decisions, the Product Owner is likely to look at the Total Cost of Ownership (TCO). What costs will a PO take into account?',
    options: [
      { id: 'a', t: 'The accumulated cost over the earned value of the product.' },
      { id: 'b', t: 'The money spent on development and delivery of the product.' },
      { id: 'c', t: 'All investments required to conceive, develop, operate and maintain the product.' },
    ],
    correct: ['c'],
    explanation: 'TCO includes the full lifecycle: conception, development, operations, support, maintenance, and eventual sunset.',
  },

  // ═══════════ SCRUM MASTER ═══════════
  {
    id: 'sm1', concept: 'scrum_master', type: 'tf',
    q: 'A Scrum Master fulfills the same role as a traditional Project Manager.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Scrum Master is a true leader who serves. They don\'t assign work, own scope, or manage the team as direct reports.',
  },
  {
    id: 'sm2', concept: 'scrum_master', type: 'multi', selectCount: 2,
    q: 'What are the two primary ways a Scrum Master helps a Scrum Team work at its highest level of productivity?',
    options: [
      { id: 'a', t: 'By ensuring the meetings start and end at the proper time.' },
      { id: 'b', t: 'By facilitating Scrum Team decisions.' },
      { id: 'c', t: 'By keeping high value features high in the Product Backlog.' },
      { id: 'd', t: 'By removing impediments that hinder the Scrum Team.' },
    ],
    correct: ['b', 'd'],
    explanation: 'Facilitation and impediment removal are core SM services. Timekeeping is incidental; backlog ordering is the PO\'s job.',
  },
  {
    id: 'sm3', concept: 'scrum_master', type: 'multi', selectCount: 2,
    q: 'Which two services are expected from a Scrum Master to a Product Owner?',
    options: [
      { id: 'a', t: 'The Scrum Master helps the Product Owner find techniques for effective Product Backlog management.' },
      { id: 'b', t: 'The Scrum Master helps the Product Owner do the documentation.' },
      { id: 'c', t: 'The Scrum Master removes impediments for the Scrum Team (including the Product Owner).' },
      { id: 'd', t: 'The Scrum Master acts as a "middleman" between the Product Owner and the Developers.' },
    ],
    correct: ['a', 'c'],
    explanation: 'The SM helps the PO with techniques and removes impediments. The SM is never a middleman — that violates direct collaboration.',
  },
  {
    id: 'sm4', concept: 'scrum_master', type: 'single',
    q: 'The IT manager asks the Scrum Team for a status report describing the progress throughout the Sprint. The Scrum Team asks the Scrum Master for advice. The Scrum Master should:',
    options: [
      { id: 'a', t: 'Create and deliver the report to the manager personally.' },
      { id: 'b', t: 'Tell the Developers to figure it out themselves.' },
      { id: 'c', t: 'Tell the Developers to fit the report into the Sprint Backlog.' },
      { id: 'd', t: 'Talk to the IT manager and explain that progress in Scrum comes from inspecting an Increment at the Sprint Review.' },
      { id: 'e', t: 'Ask the Product Owner to send the manager the report.' },
    ],
    correct: ['d'],
    explanation: 'The SM serves the organization by coaching on Scrum. Redirecting the manager to inspect the Increment is the right move.',
  },
  {
    id: 'sm5', concept: 'scrum_master', type: 'single',
    q: 'When is it allowed for a Scrum Master to cancel a Sprint?',
    options: [
      { id: 'a', t: 'When the Sprint Goal is obsolete.' },
      { id: 'b', t: 'When the Developers ask the Scrum Master to do so.' },
      { id: 'c', t: 'The Scrum Master does not have the authority to do this.' },
    ],
    correct: ['c'],
    explanation: 'Only the Product Owner can cancel a Sprint. The trigger is the Sprint Goal becoming obsolete.',
  },
  {
    id: 'sm6', concept: 'scrum_master', type: 'tf',
    q: 'The Scrum Master can decide which Scrum Events are required in the Scrum project.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'All Scrum events are required by the framework. Nobody — including the SM — can opt out of events and still be doing Scrum.',
  },

  // ═══════════ DEVELOPERS ═══════════
  {
    id: 'dev1', concept: 'developers', type: 'single',
    q: 'Who is accountable for managing the progress of work during a Sprint?',
    options: [
      { id: 'a', t: 'The Product Owner' },
      { id: 'b', t: 'The Developers' },
      { id: 'c', t: 'The Project Manager' },
      { id: 'd', t: 'The Scrum Master' },
    ],
    correct: ['b'],
    explanation: 'The Developers adapt their plan daily and manage their own progress toward the Sprint Goal.',
  },
  {
    id: 'dev2', concept: 'developers', type: 'single',
    q: 'Who creates a Product Backlog item\'s estimate?',
    options: [
      { id: 'a', t: 'The Scrum Master' },
      { id: 'b', t: 'The Product Owner with input from the Developers' },
      { id: 'c', t: 'The Developers after clarifying requirements with the Product Owner' },
      { id: 'd', t: 'The most senior people in the organization, including architects and SMEs' },
      { id: 'e', t: 'The Developers, alone' },
    ],
    correct: ['c'],
    explanation: 'The people who will do the work estimate. Estimation is a collaboration: PO clarifies intent, Developers size the work.',
  },
  {
    id: 'dev3', concept: 'developers', type: 'single',
    q: 'What is the main role of a QA in Scrum?',
    options: [
      { id: 'a', t: 'Support to have less technical debt.' },
      { id: 'b', t: 'Support the Testers in the process.' },
      { id: 'c', t: 'There are no QAs in Scrum.' },
    ],
    correct: ['c'],
    explanation: 'Scrum has no separate QA or Tester role. Quality is a team capability delivered through the Definition of Done.',
  },
  {
    id: 'dev4', concept: 'developers', type: 'multi', selectCount: 2,
    q: 'Which two responsibilities of Testers in a Scrum Team?',
    options: [
      { id: 'a', t: 'Tracking quality metrics' },
      { id: 'b', t: 'Scrum has no "Tester" role' },
      { id: 'c', t: 'Verifying the work of programmers' },
      { id: 'd', t: 'The Developers are responsible for quality' },
      { id: 'e', t: 'Finding bugs' },
    ],
    correct: ['b', 'd'],
    explanation: 'There are no Testers in Scrum — only Developers. The team owns quality collectively.',
  },
  {
    id: 'dev5', concept: 'developers', type: 'single',
    q: 'A new Developer is having continuing conflicts with existing members, impacting delivery. If necessary, who is responsible for removing the Developer from the Scrum Team?',
    options: [
      { id: 'a', t: 'The hiring manager is responsible, they hired the Developer.' },
      { id: 'b', t: 'The Product Owner is responsible, they control the ROI.' },
      { id: 'c', t: 'The Scrum Team is responsible.' },
      { id: 'd', t: 'The Scrum Master is responsible, they remove impediments.' },
    ],
    correct: ['c'],
    explanation: 'The Scrum Team is self-managing, including around membership composition when necessary.',
  },
  {
    id: 'dev6', concept: 'developers', type: 'single',
    q: 'How should the Developers react when they realize they have overcommitted in a Sprint?',
    options: [
      { id: 'a', t: 'They should collaborate with the Product Owner and decide together how to adjust the Sprint Backlog.' },
      { id: 'b', t: 'They should ask the Scrum Master to cancel the Sprint.' },
      { id: 'c', t: 'They should keep this information to themselves until the next Sprint Review.' },
    ],
    correct: ['a'],
    explanation: 'Scope is renegotiated with the PO as more is learned. Hiding the issue harms transparency.',
  },

  // ═══════════ PRODUCT BACKLOG ═══════════
  {
    id: 'pb1', concept: 'product_backlog', type: 'single',
    q: 'What is a Product Backlog?',
    options: [
      { id: 'a', t: 'A detailed list of functionalities from which the Developers draw items, complemented by a separate Technology Backlog managed by the Developers.' },
      { id: 'b', t: 'The Product Backlog is an emergent, ordered list of what is needed to improve the product.' },
      { id: 'c', t: 'A list of references to Use Case documents stored in a central repository.' },
      { id: 'd', t: 'A formally approved list of requirements to be implemented over a set period.' },
    ],
    correct: ['b'],
    explanation: 'Direct from the 2020 Scrum Guide. "Emergent" and "ordered" are the key words.',
  },
  {
    id: 'pb2', concept: 'product_backlog', type: 'multi', selectCount: 3,
    q: 'A Product Backlog is:',
    options: [
      { id: 'a', t: 'Managed by the Product Owner' },
      { id: 'b', t: 'Only visible to the Product Owner and stakeholders' },
      { id: 'c', t: 'An exhaustive list of upfront approved requirements to be implemented' },
      { id: 'd', t: 'Ordered based on priority, value, dependencies, and risk' },
      { id: 'e', t: 'An inventory of things to be done for the Product' },
    ],
    correct: ['a', 'd', 'e'],
    explanation: 'The PO manages it, it\'s ordered considering multiple factors, and it\'s a list of work for the product. It is NOT exhaustive, NOT approved upfront, and NOT private.',
  },
  {
    id: 'pb3', concept: 'product_backlog', type: 'tf',
    q: 'The Product Owner should have the entire Product Backlog documented in detail before the first Sprint can start.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Product Backlog is never "complete." A first Sprint needs enough at the top to plan from — that\'s it.',
  },
  {
    id: 'pb4', concept: 'product_backlog', type: 'single',
    q: 'When can the Product Backlog be updated?',
    options: [
      { id: 'a', t: 'Never, unless agreed to by the change request.' },
      { id: 'b', t: 'At any time when done by the Product Owner or a delegate.' },
      { id: 'c', t: 'Only after a Sprint Review if agreed to by the stakeholders.' },
      { id: 'd', t: 'Only during Product Backlog Refinement sessions if the PO is present.' },
    ],
    correct: ['b'],
    explanation: 'The Product Backlog is living. The PO can update at any time; they may delegate the work but remain accountable.',
  },
  {
    id: 'pb5', concept: 'product_backlog', type: 'single',
    q: 'Which is NOT a valid consideration when ordering a Product Backlog?',
    options: [
      { id: 'a', t: 'Risk' },
      { id: 'b', t: 'Tools and techniques' },
      { id: 'c', t: 'Importance to customers' },
      { id: 'd', t: 'Alignment with business strategy and goals' },
      { id: 'e', t: 'Dependencies on other Product Backlog Items' },
    ],
    correct: ['b'],
    explanation: 'Tooling is an implementation detail, not a valid ordering criterion. Risk, customer importance, strategic alignment, and dependencies all matter.',
  },
  {
    id: 'pb6', concept: 'product_backlog', type: 'single',
    q: 'The Product Owner manages the Product Backlog. Who is accountable for estimating the effort to complete Product Backlog items?',
    options: [
      { id: 'a', t: 'The Developers' },
      { id: 'b', t: 'The PMO' },
      { id: 'c', t: 'The Product Owner' },
    ],
    correct: ['a'],
    explanation: 'The people who do the work estimate the work. The PO is accountable for the Backlog; the Developers are accountable for sizing.',
  },
  {
    id: 'pb7', concept: 'product_backlog', type: 'multi', selectCount: 2,
    q: 'If Product Backlog Refinement is needed, when is the ideal time and who should participate?',
    options: [
      { id: 'a', t: 'Business analysts do this 1-2 Sprints ahead of the development Sprints.' },
      { id: 'b', t: 'The PO must do this as essential work in Sprint 0.' },
      { id: 'c', t: 'The Scrum Team on an ongoing basis, defining Product Backlog Items into smaller more precise items that are ready for selection.' },
      { id: 'd', t: 'The Scrum Team during the current Sprint, if they have been unable during preceding Sprints to define Product Backlog Items with enough precision to begin work.' },
      { id: 'e', t: 'The PO takes the time between Sprints to complete refinement.' },
    ],
    correct: ['c', 'd'],
    explanation: 'Refinement is ongoing Scrum Team work — not a separate team, not a separate Sprint, and not just the PO.',
  },
  {
    id: 'pb8', concept: 'product_backlog', type: 'multi', selectCount: 2,
    q: 'Which two measures ensure that the Product Backlog is transparent?',
    options: [
      { id: 'a', t: 'The Product Backlog is managed using a web-based tool.' },
      { id: 'b', t: 'The Product Backlog is available to all stakeholders.' },
      { id: 'c', t: 'The Product Backlog is ordered.' },
      { id: 'd', t: 'Each Product Backlog Item has a MoSCoW priority.' },
      { id: 'e', t: 'The Product Backlog only has work for the next 2 Sprints.' },
    ],
    correct: ['b', 'c'],
    explanation: 'Availability and ordering create transparency. The tooling and prioritization technique don\'t matter; horizon length isn\'t a rule.',
  },
  {
    id: 'pb9', concept: 'product_backlog', type: 'tf',
    q: 'The Product Owner must write all Product Backlog Items (user stories, requirements, etc.) before handing them over to the Scrum Team.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The PO is accountable for clarity, but the work can be done by anyone. User stories are one optional format; the Scrum Guide doesn\'t mandate them.',
  },
  {
    id: 'pb10', concept: 'product_backlog', type: 'single',
    q: 'Who is accountable for clearly expressing Product Backlog Items?',
    options: [
      { id: 'a', t: 'The Developers' },
      { id: 'b', t: 'The Business Analyst who represents the Product Owner' },
      { id: 'c', t: 'The Scrum Master' },
      { id: 'd', t: 'The Product Owner' },
    ],
    correct: ['d'],
    explanation: 'Clarity of Product Backlog items is part of the PO\'s Product Backlog management accountability.',
  },
  {
    id: 'pb11', concept: 'product_backlog', type: 'tf',
    q: 'The Definition of Ready is defined by the Product Owner.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The 2020 Scrum Guide does not include a "Definition of Ready." Teams may use one as a technique, but it\'s not prescribed.',
  },

  // ═══════════ SPRINT BACKLOG ═══════════
  {
    id: 'sb1', concept: 'sprint_backlog', type: 'single',
    q: 'Who owns the Sprint Backlog?',
    options: [
      { id: 'a', t: 'The Product Owner' },
      { id: 'b', t: 'The Scrum Team' },
      { id: 'c', t: 'The Developers' },
      { id: 'd', t: 'The Scrum Master' },
    ],
    correct: ['c'],
    explanation: 'The Sprint Backlog belongs to the Developers — by them, for them.',
  },
  {
    id: 'sb2', concept: 'sprint_backlog', type: 'tf',
    q: 'The Sprint Backlog is a result of Sprint Planning, and it includes the Sprint Goal.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'The Sprint Backlog = Sprint Goal (why) + selected Product Backlog Items (what) + plan (how).',
  },
  {
    id: 'sb3', concept: 'sprint_backlog', type: 'single',
    q: 'During a Sprint, when is new work or further decomposition of work added to the Sprint Backlog?',
    options: [
      { id: 'a', t: 'When the Product Owner identifies new work.' },
      { id: 'b', t: 'When the Scrum Master has time to enter it.' },
      { id: 'c', t: 'As soon as possible after it is identified.' },
      { id: 'd', t: 'During the Daily Scrum after the Developers approve it.' },
    ],
    correct: ['c'],
    explanation: 'The Sprint Backlog is updated in real time by the Developers as they learn.',
  },
  {
    id: 'sb4', concept: 'sprint_backlog', type: 'single',
    q: 'How much of the Sprint Backlog must be defined during the Sprint Planning event?',
    options: [
      { id: 'a', t: 'Just enough to understand design and architectural implications.' },
      { id: 'b', t: 'Just enough tasks for the Scrum Master to be confident in the Developers\' understanding of the Sprint.' },
      { id: 'c', t: 'The entire Sprint Backlog must be identified and estimated by the end of Sprint Planning.' },
      { id: 'd', t: 'Enough so the Developers can create their forecast of what work they can do.' },
    ],
    correct: ['d'],
    explanation: 'Enough to forecast — the rest emerges during the Sprint.',
  },
  {
    id: 'sb5', concept: 'sprint_backlog', type: 'tf',
    q: 'The Sprint Backlog content is emerging during the Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Emergence is explicit in the Scrum Guide. As more is learned, the plan adapts.',
  },

  // ═══════════ EVENTS ═══════════
  {
    id: 'ev1', concept: 'events', type: 'multi', selectCount: 3,
    q: 'Which three of the following are timeboxed events in Scrum?',
    options: [
      { id: 'a', t: 'Sprint 0' },
      { id: 'b', t: 'Release Retrospective' },
      { id: 'c', t: 'Sprint Retrospective' },
      { id: 'd', t: 'Daily Scrum' },
      { id: 'e', t: 'Sprint Planning' },
      { id: 'f', t: 'Release Planning' },
      { id: 'g', t: 'Sprint Testing' },
    ],
    correct: ['c', 'd', 'e'],
    explanation: 'Sprint Retrospective, Daily Scrum, and Sprint Planning are real Scrum events. The others don\'t exist in the Scrum Guide.',
  },
  {
    id: 'ev2', concept: 'events', type: 'single',
    q: 'Who starts the Daily Scrum?',
    options: [
      { id: 'a', t: 'The person who has the token.' },
      { id: 'b', t: 'Whoever the Developers decide should start.' },
      { id: 'c', t: 'The person coming in last.' },
      { id: 'd', t: 'The Product Owner.' },
      { id: 'e', t: 'The Scrum Master.' },
    ],
    correct: ['b'],
    explanation: 'The Daily Scrum is the Developers\' event. They self-manage how it runs, including who starts.',
  },
  {
    id: 'ev3', concept: 'events', type: 'single',
    q: 'Who is required to attend the Daily Scrum?',
    options: [
      { id: 'a', t: 'The Product Owner' },
      { id: 'b', t: 'The Project Lead' },
      { id: 'c', t: 'The Developers' },
      { id: 'd', t: 'The Scrum Master' },
    ],
    correct: ['c'],
    explanation: 'Only the Developers are required. The PO and SM may attend if they are actively working on Sprint Backlog items.',
  },
  {
    id: 'ev4', concept: 'events', type: 'single',
    q: 'When does the next Sprint begin?',
    options: [
      { id: 'a', t: 'The Monday following the Sprint Review.' },
      { id: 'b', t: 'Immediately after the conclusion of the previous Sprint.' },
      { id: 'c', t: 'Immediately following the next Sprint Planning.' },
      { id: 'd', t: 'When the Product Owner is ready.' },
    ],
    correct: ['b'],
    explanation: 'No gap between Sprints. The next one starts the moment the previous one concludes.',
  },
  {
    id: 'ev5', concept: 'events', type: 'single',
    q: 'What is the timebox for the Sprint Planning event?',
    options: [
      { id: 'a', t: 'Whenever it is done.' },
      { id: 'b', t: 'Monthly.' },
      { id: 'c', t: '4 hours for a one-month Sprint.' },
      { id: 'd', t: '8 hours for a one-month Sprint.' },
    ],
    correct: ['d'],
    explanation: 'Sprint Planning is timeboxed to a maximum of 8 hours for a one-month Sprint — less for shorter Sprints.',
  },
  {
    id: 'ev6', concept: 'events', type: 'tf',
    q: 'Sprint Reviews are an opportunity to collect stakeholder feedback.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'The Sprint Review is a working session between the Scrum Team and stakeholders to inspect the Increment and adapt the Backlog.',
  },
  {
    id: 'ev7', concept: 'events', type: 'tf',
    q: 'The Sprint Review is considered a "formal meeting."',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Scrum Guide explicitly describes the Sprint Review as a working session, not a formal meeting.',
  },
  {
    id: 'ev8', concept: 'events', type: 'single',
    q: 'Which statement best describes the Sprint Review?',
    options: [
      { id: 'a', t: 'A mechanism to control the Developers\' activities during a Sprint.' },
      { id: 'b', t: 'Used to congratulate Developers if they complete their forecast or to punish them if they fail.' },
      { id: 'c', t: 'When the Scrum Team and stakeholders inspect the outcome of a Sprint and figure out what to do next.' },
      { id: 'd', t: 'A demo at the end of the Sprint for everyone in the organization to check on the work done.' },
    ],
    correct: ['c'],
    explanation: 'Inspect + adapt: review the Increment, discuss what happened, and adapt the Product Backlog together.',
  },
  {
    id: 'ev9', concept: 'events', type: 'single',
    q: 'When can a Sprint be cancelled?',
    options: [
      { id: 'a', t: 'When the Sprint Goal becomes obsolete.' },
      { id: 'b', t: 'When the Developers ask the Product Owner to do it.' },
      { id: 'c', t: 'When the Business Analyst asks the Product Owner to do it.' },
      { id: 'd', t: 'When the Sprint Goal becomes obsolete and no items are "Done" yet.' },
    ],
    correct: ['a'],
    explanation: 'Obsolescence of the Sprint Goal is the only valid reason. Only the PO can decide.',
  },
  {
    id: 'ev10', concept: 'events', type: 'single',
    q: 'Which questions does Sprint Planning answer?',
    options: [
      { id: 'a', t: 'What can be delivered in the Increment resulting from the upcoming Sprint?' },
      { id: 'b', t: 'Who will do which Sprint Backlog item?' },
      { id: 'c', t: 'How will the work needed to deliver the Increment be achieved?' },
      { id: 'd', t: 'Why is this Sprint valuable, what can be done, and how will the chosen work get done.' },
    ],
    correct: ['d'],
    explanation: 'The 2020 Guide frames Sprint Planning as Why / What / How — in that order. Task assignment is never prescribed.',
  },
  {
    id: 'ev11', concept: 'events', type: 'single',
    q: 'How much time is required after a Sprint to prepare for the next Sprint?',
    options: [
      { id: 'a', t: 'The break between Sprints is timeboxed to one week for a one-month Sprint.' },
      { id: 'b', t: 'Enough time for the requirements for the next Sprint to be determined and documented.' },
      { id: 'c', t: 'Enough time for the Developers to finish testing from the last Sprint.' },
      { id: 'd', t: 'None. A new Sprint starts immediately following the end of the previous Sprint.' },
    ],
    correct: ['d'],
    explanation: 'Zero gap. This is a frequent exam trap.',
  },
  {
    id: 'ev12', concept: 'events', type: 'multi', selectCount: 3,
    q: 'Which three of the following are feedback loops in Scrum?',
    options: [
      { id: 'a', t: 'Release Planning' },
      { id: 'b', t: 'Refinement Meeting' },
      { id: 'c', t: 'Sprint Retrospective' },
      { id: 'd', t: 'Sprint Review' },
      { id: 'e', t: 'Daily Scrum' },
    ],
    correct: ['c', 'd', 'e'],
    explanation: 'The three inspect-and-adapt events tied to artifacts: Daily Scrum (Sprint Backlog), Sprint Review (Increment/Product Backlog), Retrospective (the Scrum Team itself).',
  },

  // ═══════════ ARTIFACTS & COMMITMENTS ═══════════
  {
    id: 'ac1', concept: 'artifacts_commitments', type: 'single',
    q: 'Who creates the Definition of Done?',
    options: [
      { id: 'a', t: 'The Product Owner' },
      { id: 'b', t: 'The Scrum Master' },
      { id: 'c', t: 'The organization (or the Scrum Team if none is available from the organization)' },
      { id: 'd', t: 'The Scrum Team, in a collaborative effort where the result is the common denominator of all members\' definitions' },
    ],
    correct: ['c'],
    explanation: 'If the organization has a DoD as a standard, the Scrum Team uses it (and can add stricter criteria). Otherwise, the Scrum Team creates one.',
  },
  {
    id: 'ac2', concept: 'artifacts_commitments', type: 'multi', selectCount: 3,
    q: 'Which three phrases best describe the purpose of a Definition of Done?',
    options: [
      { id: 'a', t: 'It tracks the percentage complete of a Product Backlog Item.' },
      { id: 'b', t: 'It defines what it takes for an Increment to be ready for release.' },
      { id: 'c', t: 'It creates transparency over the work inspected at the Sprint Review.' },
      { id: 'd', t: 'It guides the Developers in creating a forecast at the Sprint Planning.' },
      { id: 'e', t: 'It provides a template for elements that need to be included in the documentation.' },
      { id: 'f', t: 'It controls whether the Developers have performed their tasks.' },
    ],
    correct: ['b', 'c', 'd'],
    explanation: 'The DoD sets releasability, creates transparency, and informs Sprint Planning forecasts. It is not a percentage tracker or a task auditor.',
  },
  {
    id: 'ac3', concept: 'artifacts_commitments', type: 'single',
    q: 'When is it most appropriate for a Scrum Team to change the Definition of Done?',
    options: [
      { id: 'a', t: 'Prior to starting a new project.' },
      { id: 'b', t: 'During the Sprint Retrospective.' },
      { id: 'c', t: 'During Product Backlog Refinement.' },
      { id: 'd', t: 'During Sprint Planning.' },
    ],
    correct: ['b'],
    explanation: 'The Retrospective is where the team inspects and adapts how they work — including the DoD.',
  },
  {
    id: 'ac4', concept: 'artifacts_commitments', type: 'single',
    q: 'Who does the work to make sure Product Backlog Items conform to the Definition of Done?',
    options: [
      { id: 'a', t: 'The Quality Assurance Team' },
      { id: 'b', t: 'The Scrum Master' },
      { id: 'c', t: 'The Product Owner' },
      { id: 'd', t: 'The Developers' },
      { id: 'e', t: 'The Scrum Team' },
    ],
    correct: ['d'],
    explanation: 'The Developers instill quality by adhering to the DoD.',
  },
  {
    id: 'ac5', concept: 'artifacts_commitments', type: 'multi', selectCount: 2,
    q: 'At the end of a Sprint, a Product Backlog Item does not meet the Definition of Done. What two things should happen?',
    options: [
      { id: 'a', t: 'Do not include the item in the Increment this Sprint.' },
      { id: 'b', t: 'Put it on the Product Backlog for the Product Owner to decide what to do with it.' },
      { id: 'c', t: 'If stakeholders agree, the Product Owner can accept it and release it to users.' },
      { id: 'd', t: 'Review the item, add the done part to velocity and create a Story for the remaining work.' },
    ],
    correct: ['a', 'b'],
    explanation: 'Not Done = not in the Increment. Back to the Product Backlog for the PO to decide. Never released partially.',
  },
  {
    id: 'ac6', concept: 'artifacts_commitments', type: 'tf',
    q: 'The Definition of Done shouldn\'t be changed in the middle of the Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Mid-Sprint changes to the DoD would invalidate work already done against the old DoD. Change it at the Retrospective.',
  },
  {
    id: 'ac7', concept: 'artifacts_commitments', type: 'single',
    q: 'For the purpose of transparency, when does Scrum say a valuable and useful Increment must be available?',
    options: [
      { id: 'a', t: 'Every 3 Sprints' },
      { id: 'b', t: 'When the Product Owner asks to create one' },
      { id: 'c', t: 'After the Acceptance Testing phase' },
      { id: 'd', t: 'At the end of every Sprint (or more frequently)' },
      { id: 'e', t: 'Before the Release Sprint' },
    ],
    correct: ['d'],
    explanation: 'Each Sprint produces at least one usable Increment. Multiple Increments in a Sprint are allowed.',
  },
  {
    id: 'ac8', concept: 'artifacts_commitments', type: 'multi', selectCount: 3,
    q: 'What are three advantages of a Product Owner sharing a clearly defined Product Goal with the Scrum Team?',
    options: [
      { id: 'a', t: 'It helps the Scrum Team keep focus and weigh decisions against the Product Goal.' },
      { id: 'b', t: 'It helps the Developers estimate the date the Product Backlog will be complete.' },
      { id: 'c', t: 'It is easier to inspect Incremental progress at the Sprint Review.' },
      { id: 'd', t: 'It is not mandatory in Scrum. There is no real advantage.' },
      { id: 'e', t: 'It provides a good overall direction so Sprints feel less like isolated pieces of work.' },
    ],
    correct: ['a', 'c', 'e'],
    explanation: 'The Product Goal is the team\'s compass: focus, continuity between Sprints, and a reference point for Sprint Review discussions.',
  },

  // ═══════════ SCALING ═══════════
  {
    id: 'sc1', concept: 'scaling', type: 'multi', selectCount: 2,
    q: 'Which two statements are correct when four teams are working on one single product?',
    options: [
      { id: 'a', t: 'There can be only one Product Owner.' },
      { id: 'b', t: 'There can be only one Product Backlog.' },
      { id: 'c', t: 'There can be 4 Product Owners.' },
      { id: 'd', t: 'There can be 4 Product Backlogs.' },
    ],
    correct: ['a', 'b'],
    explanation: 'One product = one PO + one Product Backlog. No exceptions.',
  },
  {
    id: 'sc2', concept: 'scaling', type: 'tf',
    q: 'When two Scrum Teams are working on the same product, you should normalize their estimations to be able to compare their performance.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Estimation is relative to the team doing the work. Comparing teams by normalized estimates is an anti-pattern.',
  },
  {
    id: 'sc3', concept: 'scaling', type: 'single',
    q: 'Five new Scrum Teams have been created to build one product. A few Developers on one team ask the Scrum Master who will coordinate the work with the other teams. What should the Scrum Master do?',
    options: [
      { id: 'a', t: 'Collect Sprint tasks and merge into a consolidated plan for the entire Sprint.' },
      { id: 'b', t: 'Teach them that it is their responsibility to work with the other teams to create an integrated Increment.' },
      { id: 'c', t: 'Teach the Product Owner to work with the Lead Developer on ordering Product Backlog to avoid overlap.' },
      { id: 'd', t: 'Visit the five teams each day to inspect that their Sprint Backlogs are aligned.' },
    ],
    correct: ['b'],
    explanation: 'Cross-team coordination is self-managed by the teams. The SM coaches toward this, not substitutes for it.',
  },
  {
    id: 'sc4', concept: 'scaling', type: 'single',
    q: 'When multiple Scrum Teams are working on the same product, should all of their Increments be integrated every Sprint?',
    options: [
      { id: 'a', t: 'Yes, but only for Scrum Teams whose work has dependencies.' },
      { id: 'b', t: 'Yes, in order to accurately inspect what is done.' },
      { id: 'c', t: 'No, that\'s far too hard and must be done in a hardening Sprint.' },
      { id: 'd', t: 'No, each Scrum Team stands alone.' },
    ],
    correct: ['b'],
    explanation: 'Every Sprint, every team, integrated. Otherwise you can\'t inspect a true Increment.',
  },
  {
    id: 'sc5', concept: 'scaling', type: 'single',
    q: 'Six teams new to Scrum will build one product. You\'ve gathered requirements into an early Product Backlog. How would you minimize dependencies between the Scrum Teams?',
    options: [
      { id: 'a', t: 'You work with the Developers on how to best analyze and break apart the work.' },
      { id: 'b', t: 'You divide Product Backlog items among six Product Owners.' },
      { id: 'c', t: 'You create an independent Product Backlog per Scrum Team.' },
      { id: 'd', t: 'You identify dependencies and re-order the Product Backlog for the other five Product Owners.' },
      { id: 'e', t: 'You raise this as an impediment with the Scrum Master.' },
    ],
    correct: ['a'],
    explanation: 'Structure the work, not the teams. Splitting the Backlog or assigning separate POs violates the "one product, one Backlog, one PO" rule.',
  },

  // ═══════════ SCRUM THEORY — additional ═══════════
  {
    id: 'st9', concept: 'scrum_theory', type: 'single',
    q: 'What does it mean to say that an event has a timebox?',
    options: [
      { id: 'a', t: 'The event must take at least a minimum amount of time.' },
      { id: 'b', t: 'The event must happen at a set time.' },
      { id: 'c', t: 'The event can take no more than a maximum amount of time.' },
      { id: 'd', t: 'The event must happen by a given time.' },
    ],
    correct: ['c'],
    explanation: 'A timebox is a maximum, not a target. An event can and should end early once its purpose is achieved.',
  },
  {
    id: 'st10', concept: 'scrum_theory', type: 'multi', selectCount: 2,
    q: 'Which two contribute the most to the Scrum Value "Focus"?',
    options: [
      { id: 'a', t: 'Having a Burn-Down Chart.' },
      { id: 'b', t: 'Having a Sprint Goal.' },
      { id: 'c', t: 'Using Story Points.' },
      { id: 'd', t: 'Having time-boxed events.' },
    ],
    correct: ['b', 'd'],
    explanation: 'A Sprint Goal gives the team one thing to optimize for. Timeboxes create the cadence that prevents endless scope. Story points and burn-downs are optional techniques.',
  },
  {
    id: 'st11', concept: 'scrum_theory', type: 'multi', selectCount: 3,
    q: 'What are the three pillars of empirical process control in Scrum?',
    options: [
      { id: 'a', t: 'Transparency' },
      { id: 'b', t: 'Commitment' },
      { id: 'c', t: 'Inspection' },
      { id: 'd', t: 'Courage' },
      { id: 'e', t: 'Adaptation' },
      { id: 'f', t: 'Focus' },
    ],
    correct: ['a', 'c', 'e'],
    explanation: 'Transparency, Inspection, Adaptation. Commitment, Courage, and Focus are Scrum Values — a different concept.',
  },
  {
    id: 'st12', concept: 'scrum_theory', type: 'single',
    q: 'What should happen when the Scrum Team discovers an aspect of their product or process lacks transparency?',
    options: [
      { id: 'a', t: 'They must cancel the Sprint and restart with a clean slate.' },
      { id: 'b', t: 'They adapt immediately to restore transparency; without it, inspection becomes misleading and adaptation produces faulty results.' },
      { id: 'c', t: 'They wait until the next Sprint Retrospective to discuss it.' },
      { id: 'd', t: 'They escalate it to the Product Owner, who decides whether to address it.' },
    ],
    correct: ['b'],
    explanation: 'The 2020 Scrum Guide explicitly states: without transparency, inspection is misleading, and adaptation based on that inspection produces problems.',
  },
  {
    id: 'st13', concept: 'scrum_theory', type: 'tf',
    q: 'Scrum is founded on empiricism and lean thinking.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'The 2020 Scrum Guide added "lean thinking" as a foundation alongside empiricism. Lean reduces waste and focuses on essentials.',
  },
  {
    id: 'st14', concept: 'scrum_theory', type: 'single',
    q: 'What is the heart of Scrum?',
    options: [
      { id: 'a', t: 'The Daily Scrum.' },
      { id: 'b', t: 'The Sprint.' },
      { id: 'c', t: 'The Product Backlog.' },
      { id: 'd', t: 'The Scrum Master role.' },
    ],
    correct: ['b'],
    explanation: 'The Scrum Guide calls the Sprint the "heartbeat" of Scrum — it contains all other events and produces the Increment.',
  },

  // ═══════════ SCRUM TEAM — additional ═══════════
  {
    id: 'stm8', concept: 'scrum_team', type: 'multi', selectCount: 3,
    q: 'Who is on the Scrum Team?',
    options: [
      { id: 'a', t: 'The Scrum Master.' },
      { id: 'b', t: 'The Product Owner.' },
      { id: 'c', t: 'The Developers.' },
      { id: 'd', t: 'The Stakeholders.' },
      { id: 'e', t: 'The Project Manager.' },
    ],
    correct: ['a', 'b', 'c'],
    explanation: 'The Scrum Team is one Scrum Master, one Product Owner, and Developers. Stakeholders are outside the team. There is no Project Manager in Scrum.',
  },
  {
    id: 'stm9', concept: 'scrum_team', type: 'tf',
    q: 'Every Scrum Team must have a Product Owner and a Scrum Master.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Both accountabilities are required for a valid Scrum Team. Their effectiveness directly affects outcomes.',
  },
  {
    id: 'stm10', concept: 'scrum_team', type: 'tf',
    q: 'The Product Owner is not part of the Scrum Team.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The PO is one of the three accountabilities on the Scrum Team. Common confusion from older frameworks where the "team" meant developers only.',
  },
  {
    id: 'stm11', concept: 'scrum_team', type: 'tf',
    q: 'The Scrum Team is accountable for creating a valuable Increment every Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Word-for-word from the 2020 Scrum Guide. The whole team — not just Developers — shares this accountability.',
  },
  {
    id: 'stm12', concept: 'scrum_team', type: 'tf',
    q: 'The Scrum Team is accountable for releasing the most valuable product.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Scrum Team is accountable for creating a valuable Increment. Release decisions are a Product Owner call and depend on business context.',
  },
  {
    id: 'stm13', concept: 'scrum_team', type: 'single',
    q: 'What tactic should a Scrum Master use to divide a group of 100 people into multiple Scrum Teams?',
    options: [
      { id: 'a', t: 'Ask the people to divide themselves into teams.' },
      { id: 'b', t: 'Create teams based on their skills across multiple layers (database, UI, etc.).' },
      { id: 'c', t: 'Ask the Product Owner to assign people to teams.' },
    ],
    correct: ['a'],
    explanation: 'Self-organization extends to team formation. Component-based splits create dependencies; top-down assignment contradicts self-management.',
  },
  {
    id: 'stm14', concept: 'scrum_team', type: 'multi', selectCount: 2,
    q: 'Which two ways of creating Scrum Teams are consistent with Scrum\'s values?',
    options: [
      { id: 'a', t: 'Existing teams propose how they would like to go about organizing into the new structure.' },
      { id: 'b', t: 'Bring all people together and let them organize into Scrum Teams.' },
      { id: 'c', t: 'Managers personally re-assign current subordinates to new teams.' },
      { id: 'd', t: 'The chief Product Owner determines the new team structure and assignments.' },
      { id: 'e', t: 'Managers collaborate to assign individuals into specific teams.' },
    ],
    correct: ['a', 'b'],
    explanation: 'Both options have the people involved doing the organizing. Manager-assigned teams violate self-management.',
  },
  {
    id: 'stm15', concept: 'scrum_team', type: 'single',
    q: 'You are the Scrum Master of a new product requiring 45 people. What is a good first question to suggest the group considers when forming teams?',
    options: [
      { id: 'a', t: 'What is the right mixture of senior and junior people on each team?' },
      { id: 'b', t: 'How will we make sure all teams have the right amount of expertise?' },
      { id: 'c', t: 'Who are the subject matter experts on each team?' },
      { id: 'd', t: 'Who are going to be the team leads?' },
    ],
    correct: ['b'],
    explanation: 'Cross-functional capability is the precondition for valuable Increments. Hierarchy questions ("team leads," "senior/junior mix") miss the point of self-management.',
  },
  {
    id: 'stm16', concept: 'scrum_team', type: 'single',
    q: 'What is the Scrum Team\'s focus, according to the 2020 Scrum Guide?',
    options: [
      { id: 'a', t: 'Multiple initiatives balanced across the Sprint.' },
      { id: 'b', t: 'One objective at a time — the Product Goal.' },
      { id: 'c', t: 'Whatever the stakeholders prioritize most recently.' },
      { id: 'd', t: 'Velocity improvements across Sprints.' },
    ],
    correct: ['b'],
    explanation: 'The 2020 Scrum Guide is explicit: the Scrum Team focuses on one Product Goal at a time.',
  },

  // ═══════════ PRODUCT OWNER — additional ═══════════
  {
    id: 'po14', concept: 'product_owner', type: 'tf',
    q: 'During the Sprint Review, the stakeholder\'s role is to reorder the Product Backlog.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Only the Product Owner orders the Product Backlog. Stakeholders provide input and feedback at the Sprint Review; they do not decide ordering.',
  },
  {
    id: 'po15', concept: 'product_owner', type: 'tf',
    q: 'The Sprint Review is the only time at which stakeholder feedback is taken into account.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Stakeholder feedback can happen anytime. The Sprint Review is a dedicated point, not the only one.',
  },
  {
    id: 'po16', concept: 'product_owner', type: 'tf',
    q: 'The value delivered by a product can only be determined by revenue.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Value includes customer satisfaction, impact, adoption, cost reduction, risk mitigation, and many other factors — revenue is one lens.',
  },
  {
    id: 'po17', concept: 'product_owner', type: 'multi', selectCount: 3,
    q: 'Why is it important that there is only one Product Owner per product?',
    options: [
      { id: 'a', t: 'The Scrum Team always knows who determines the order of the Product Backlog.' },
      { id: 'b', t: 'The Scrum Master knows who acts as their backup while on vacation.' },
      { id: 'c', t: 'It is clear who is accountable for the ultimate value of the product.' },
      { id: 'd', t: 'It would confuse the stakeholders if they had to work with more than one person.' },
      { id: 'e', t: 'It helps avoid barriers to effective communication and rapid decision-making.' },
    ],
    correct: ['a', 'c', 'e'],
    explanation: 'Single ownership creates clear accountability, clear ordering authority, and fast decisions. "Confusing stakeholders" and "Scrum Master backup" aren\'t the reasons.',
  },
  {
    id: 'po18', concept: 'product_owner', type: 'multi', selectCount: 3,
    q: 'What three things might a Scrum Product Owner focus on to ensure the product delivers value?',
    options: [
      { id: 'a', t: 'Minimizing changes to project scope.' },
      { id: 'b', t: 'How much of the product\'s functionality is being used.' },
      { id: 'c', t: 'How quickly or easily the product can be absorbed and used by customers.' },
      { id: 'd', t: 'Direct customer feedback.' },
      { id: 'e', t: 'Velocity is increasing over time.' },
    ],
    correct: ['b', 'c', 'd'],
    explanation: 'Usage data, adoption ease, and direct feedback all inform value decisions. Minimizing scope change contradicts agility; velocity doesn\'t measure value.',
  },
  {
    id: 'po19', concept: 'product_owner', type: 'single',
    q: 'How often should customer satisfaction be measured?',
    options: [
      { id: 'a', t: 'Quarterly.' },
      { id: 'b', t: 'Annually.' },
      { id: 'c', t: 'Daily.' },
      { id: 'd', t: 'Frequently.' },
    ],
    correct: ['d'],
    explanation: 'Frequent feedback is the principle — the specific interval depends on product context. Calendar-based gates lose signal.',
  },
  {
    id: 'po20', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'Why would you expect a Product Owner to care that the Scrum Team adheres to its Definition of Done?',
    options: [
      { id: 'a', t: 'To be able to punish the team when they do not meet their velocity goal for the Sprint.' },
      { id: 'b', t: 'The Product Owner should not care about the Definition of Done, it is the Scrum Team\'s responsibility.' },
      { id: 'c', t: 'The Definition of Done can affect the product\'s total cost of ownership.' },
      { id: 'd', t: 'To have complete transparency into what has been done at the end of each Sprint.' },
      { id: 'e', t: 'To forecast the team\'s productivity over time.' },
    ],
    correct: ['c', 'd'],
    explanation: 'A weak DoD creates hidden technical debt (increasing TCO) and obscures what\'s actually releasable. Both directly affect PO decisions.',
  },
  {
    id: 'po21', concept: 'product_owner', type: 'multi', selectCount: 3,
    q: 'A product\'s success is measured by:',
    options: [
      { id: 'a', t: 'The impact on customer satisfaction.' },
      { id: 'b', t: 'The impact on cost.' },
      { id: 'c', t: 'The impact on my boss\'s mood.' },
      { id: 'd', t: 'The delivery of upfront-defined scope compared to the upfront-planned time.' },
      { id: 'e', t: 'The impact on my performance rating.' },
      { id: 'f', t: 'The impact on revenue.' },
    ],
    correct: ['a', 'b', 'f'],
    explanation: 'Customer outcomes, cost, and revenue are objective outcome measures. Scope-vs-plan is output, not outcome. Personal impact isn\'t product success.',
  },
  {
    id: 'po22', concept: 'product_owner', type: 'tf',
    q: 'Dependencies could influence how the Product Owner orders Product Backlog Items.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Ordering considers value, risk, dependencies, and more. Dependencies can force a specific sequence even when other factors suggest otherwise.',
  },
  {
    id: 'po23', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'Which metrics help a Product Owner determine if a product is delivering value?',
    options: [
      { id: 'a', t: 'Velocity.' },
      { id: 'b', t: 'Productivity.' },
      { id: 'c', t: 'Time to market.' },
      { id: 'd', t: 'Customer satisfaction.' },
      { id: 'e', t: 'Percentage of scope implemented.' },
    ],
    correct: ['c', 'd'],
    explanation: 'Time-to-market and customer satisfaction are outcome/value metrics. Velocity and productivity are output metrics. Scope-percent is a plan-conformance metric.',
  },
  {
    id: 'po24', concept: 'product_owner', type: 'tf',
    q: 'All planned work for the Product done by the Scrum Team must originate from the Product Backlog.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'The Product Backlog is the single source of work for the Scrum Team. If it\'s not on the Backlog, the Scrum Team shouldn\'t be working on it.',
  },
  {
    id: 'po25', concept: 'product_owner', type: 'single',
    q: 'What typically happens if the Product Backlog is not sufficiently clear at Sprint Planning?',
    options: [
      { id: 'a', t: 'The Product Owner should select the Sprint Goal for the Scrum Team so work can begin.' },
      { id: 'b', t: 'The Developers will find it difficult to create a Sprint forecast they are confident they can meet.' },
      { id: 'c', t: 'Nothing in particular.' },
      { id: 'd', t: 'The Scrum Master should not allow this to happen. Look for a new Scrum Master and restart the Sprint.' },
      { id: 'e', t: 'Sprint Planning is cancelled so refinement can be done first.' },
    ],
    correct: ['b'],
    explanation: 'Unclear Product Backlog → low-confidence forecast. The Sprint still happens; the team works with what they have, and refinement improves over time.',
  },
  {
    id: 'po26', concept: 'product_owner', type: 'single',
    q: 'What might indicate to a Product Owner that she needs to work more with the Scrum Team?',
    options: [
      { id: 'a', t: 'People leave the Scrum Team.' },
      { id: 'b', t: 'She is not working fulltime with the Scrum Team.' },
      { id: 'c', t: 'The acceptance criteria do not appear to be complete.' },
      { id: 'd', t: 'The Increment presented at the Sprint Review does not reflect what she thought she had asked for.' },
    ],
    correct: ['d'],
    explanation: 'Gap between expectation and delivered Increment = signal that clarification during the Sprint is insufficient. The PO-Developer collaboration is the lever.',
  },
  {
    id: 'po27', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'What are two effective ways for a Scrum Team to ensure security concerns are satisfied?',
    options: [
      { id: 'a', t: 'Delegate the work to the security department.' },
      { id: 'b', t: 'Postpone the work until a specialist can perform a security audit and create a list of security-related Product Backlog Items.' },
      { id: 'c', t: 'Add security concerns to the Definition of Done.' },
      { id: 'd', t: 'Add a Sprint to specifically resolve all security concerns.' },
      { id: 'e', t: 'Have the Scrum Team create Product Backlog Items for each concern.' },
    ],
    correct: ['c', 'e'],
    explanation: 'Embed security in the DoD (so every Increment is secure by default) and surface specific concerns as Backlog items. Outsourcing, postponing, or a dedicated Sprint all defer quality.',
  },
  {
    id: 'po28', concept: 'product_owner', type: 'single',
    q: 'The Developers ask their Product Owner to re-order the Product Backlog. The team is waiting for an external supplier and without the component there won\'t be enough work next Sprint. As the Scrum Master, what advice would you give?',
    options: [
      { id: 'a', t: 'Tell the PO that the Product Backlog should be ordered to maximize utilization of the Developers.' },
      { id: 'b', t: 'Tell the PO to re-order the Product Backlog so the external-component work can be planned in a separate Sprint.' },
      { id: 'c', t: 'Remind the PO that their primary concern is the flow of value reflected in the ordering of the Product Backlog.' },
    ],
    correct: ['c'],
    explanation: 'Ordering optimizes for value, not developer utilization. Reshaping the Backlog for team idleness is an anti-pattern the SM should name.',
  },
  {
    id: 'po29', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'A Project Manager working with your Scrum Team has raised concerns about progress and money spent. What are the two best responses?',
    options: [
      { id: 'a', t: 'Show the Earned Value Analysis (EVA) report.' },
      { id: 'b', t: 'Scrum does not have Project Managers, so disregard their concerns.' },
      { id: 'c', t: 'Promote transparency by sharing the Product Backlog and ensuring the Project Manager has access.' },
      { id: 'd', t: 'Share the last stakeholder briefing document prepared by the Product Owner.' },
      { id: 'e', t: 'Have a discussion with the Project Manager, share current impediments and forecast for the Sprint.' },
    ],
    correct: ['c', 'e'],
    explanation: 'Transparency + conversation. Address concerns directly using Scrum\'s real artifacts, rather than manufacturing legacy reports or dismissing the person.',
  },
  {
    id: 'po30', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'What is a Product Owner typically responsible for during a Sprint?',
    options: [
      { id: 'a', t: 'Nothing.' },
      { id: 'b', t: 'Working with the Scrum Team on Product Backlog Refinement.' },
      { id: 'c', t: 'Attending every Daily Scrum to answer questions about the Sprint Backlog items.' },
      { id: 'd', t: 'Updating the work plan for the Developers on a daily basis.' },
      { id: 'e', t: 'Collaborating with stakeholders, users and customers.' },
      { id: 'f', t: 'Creating financial reporting upon the spent hours reported by the Developers.' },
    ],
    correct: ['b', 'e'],
    explanation: 'Two PO mainstays during the Sprint: refinement with the team, and stakeholder collaboration. The PO doesn\'t assign Developer tasks or attend every Daily.',
  },
  {
    id: 'po31', concept: 'product_owner', type: 'tf',
    q: 'Product Owners must specify complete acceptance criteria for a Product Backlog Item before the Developers can select the item in Sprint Planning.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Scrum Guide doesn\'t require acceptance criteria. Items should be clear enough to select; the Scrum Team decides what "clear enough" means.',
  },
  {
    id: 'po32', concept: 'product_owner', type: 'single',
    q: 'What should Developers do if the Product Owner is unavailable?',
    options: [
      { id: 'a', t: 'Wait until the Product Owner is available again.' },
      { id: 'b', t: 'Management should assign a substitute Product Owner to fill in.' },
      { id: 'c', t: 'Ask the Product Owner\'s manager to decide in the PO\'s absence.' },
      { id: 'd', t: 'Within the Sprint, the Developers make the best decisions possible to assure progress towards the Sprint Goal, re-aligning with the PO once they are available.' },
    ],
    correct: ['d'],
    explanation: 'Self-management includes making the best decisions with what you have. Paralysis isn\'t an option; neither is swapping in a substitute PO.',
  },
  {
    id: 'po33', concept: 'product_owner', type: 'single',
    q: 'What is the principal value of releasing an Increment?',
    options: [
      { id: 'a', t: 'To learn about the Scrum Team\'s productivity.' },
      { id: 'b', t: 'To validate assumptions made when developing the product.' },
      { id: 'c', t: 'To learn about the forecast of functionality that was developed.' },
    ],
    correct: ['b'],
    explanation: 'Releases are learning events. Every release tests hypotheses about what users want and how they\'ll use it.',
  },
  {
    id: 'po34', concept: 'product_owner', type: 'single',
    q: 'What best describes the relationship of the Product Owner and the stakeholders?',
    options: [
      { id: 'a', t: 'The PO provides acceptance forms at the Sprint Review to record formal agreement over delivered software.' },
      { id: 'b', t: 'The PO actively asks for stakeholder input and expectations to incorporate into the Product Backlog.' },
      { id: 'c', t: 'The PO has the final call over requirements and should involve stakeholders as little as possible.' },
      { id: 'd', t: 'The PO rates the User Stories as provided by the stakeholders.' },
    ],
    correct: ['b'],
    explanation: 'The PO engages stakeholders continuously. Formal signoffs are a waterfall pattern; minimizing stakeholder contact defeats the point of product ownership.',
  },
  {
    id: 'po35', concept: 'product_owner', type: 'single',
    q: 'Is the Product Owner required to be present at the Sprint Retrospective?',
    options: [
      { id: 'a', t: 'No. The Retrospective is an opportunity for the Developers to improve.' },
      { id: 'b', t: 'Optional. Attendance is only required when the Product Owner is invited by the Scrum Master.' },
      { id: 'c', t: 'Mandatory. The Retrospective is for the Scrum Team to assess and improve itself.' },
    ],
    correct: ['c'],
    explanation: 'The PO is part of the Scrum Team. The Retrospective is for the whole team to inspect and adapt — PO participation is required.',
  },
  {
    id: 'po36', concept: 'product_owner', type: 'single',
    q: 'What is the Product Owner responsible for during the Sprint Retrospective?',
    options: [
      { id: 'a', t: 'Participating as a Scrum Team member.' },
      { id: 'b', t: 'The Product Owner should not take part in Sprint Retrospective.' },
      { id: 'c', t: 'Capturing requirements for the Product Backlog.' },
      { id: 'd', t: 'Summarizing and reporting discussions to stakeholders they represent.' },
    ],
    correct: ['a'],
    explanation: 'The PO participates as a peer. The Retrospective isn\'t a requirements-gathering event or a stakeholder debrief.',
  },
  {
    id: 'po37', concept: 'product_owner', type: 'single',
    q: 'The Developers find out during the Sprint that they are not likely to build everything they forecast. What would you expect a Product Owner to do?',
    options: [
      { id: 'a', t: 'Cancel the Sprint.' },
      { id: 'b', t: 'Skip Product Backlog Refinement activities.' },
      { id: 'c', t: 'Change the Sprint Goal.' },
      { id: 'd', t: 'Re-negotiate the selected Product Backlog Items with the Developers.' },
      { id: 'e', t: 'Inform management that more resources are needed.' },
    ],
    correct: ['d'],
    explanation: 'Scope renegotiation during the Sprint is normal — that\'s how Scrum adapts to learning. The Sprint Goal stays; the PBI set inside it flexes.',
  },
  {
    id: 'po38', concept: 'product_owner', type: 'single',
    q: 'What is the main reason for the Product Owner to be part of the Daily Scrum?',
    options: [
      { id: 'a', t: 'It is not required for the Product Owner to participate.' },
      { id: 'b', t: 'To assign the Developers the daily tasks.' },
      { id: 'c', t: 'To track the progress of the Project.' },
    ],
    correct: ['a'],
    explanation: 'The Daily Scrum is for Developers. The PO may attend if actively working on Sprint Backlog items, but attendance is never required.',
  },
  {
    id: 'po39', concept: 'product_owner', type: 'tf',
    q: 'The Product Owner makes sure the Developers select enough from the Product Backlog for a Sprint to satisfy the stakeholders.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Developers decide how much they can realistically commit to. The PO influences priority and value, never scope-cramming.',
  },
  {
    id: 'po40', concept: 'product_owner', type: 'tf',
    q: 'The Product Owner has to maximize value — more features always bring more value, therefore the Product Owner has to maximize the number of features in a Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'More features ≠ more value. Often the highest-value choice is doing less. Feature-cramming undermines quality and focus.',
  },
  {
    id: 'po41', concept: 'product_owner', type: 'single',
    q: 'Yes or No: The Product Owner can ask a Developer to order the Product Backlog Items instead of him/her — is that okay?',
    options: [{ id: 'yes', t: 'Yes' }, { id: 'no', t: 'No' }],
    correct: ['yes'],
    explanation: 'The PO may delegate the work of ordering but remains accountable for it. Delegation is not abdication.',
  },

  // ═══════════ SCRUM MASTER — additional ═══════════
  {
    id: 'sm7', concept: 'scrum_master', type: 'tf',
    q: 'The Scrum Master can decide which Scrum Artifacts are required in the Scrum project.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'All three Scrum artifacts (Product Backlog, Sprint Backlog, Increment) are required. Nobody can opt out and still claim Scrum.',
  },
  {
    id: 'sm8', concept: 'scrum_master', type: 'single',
    q: 'The collaboration between Developers and PO is very important. Which is the LEAST productive way for the Scrum Master to improve it?',
    options: [
      { id: 'a', t: 'The Scrum Master should act as a go-between for them.' },
      { id: 'b', t: 'The Scrum Master should teach them techniques to improve it.' },
      { id: 'c', t: 'The Scrum Master should suggest new collaboration tools.' },
    ],
    correct: ['a'],
    explanation: 'A go-between creates a communication bottleneck and breaks direct collaboration. Coaching and tooling are legitimate; playing messenger is not.',
  },
  {
    id: 'sm9', concept: 'scrum_master', type: 'multi', selectCount: 2,
    q: 'Which two are reasons for the Scrum Master to attend the Daily Scrum?',
    options: [
      { id: 'a', t: 'To be able to track the Sprint progress.' },
      { id: 'b', t: 'It is not necessary for the Scrum Master to attend the meeting.' },
      { id: 'c', t: 'To support the Product Owner.' },
      { id: 'd', t: 'The Developers have asked the Scrum Master to facilitate the Daily Scrum.' },
    ],
    correct: ['b', 'd'],
    explanation: 'Attendance isn\'t required. If asked by the Developers, the SM may facilitate. "Tracking progress" and "supporting the PO" aren\'t legitimate reasons for SM presence.',
  },
  {
    id: 'sm10', concept: 'scrum_master', type: 'single',
    q: 'A Scrum Master is working with a Scrum Team that has Developers in different physical locations. The Developers have much to do logistically before the Daily Scrum. What action should the SM take?',
    options: [
      { id: 'a', t: 'Set up the meeting and tell the team that\'s how it will be done.' },
      { id: 'b', t: 'Allow the Developers to self-manage and determine for themselves what to do.' },
      { id: 'c', t: 'Inform management and ask them to solve it.' },
      { id: 'd', t: 'Ask the Developers to alternate who is responsible for meeting setup.' },
    ],
    correct: ['b'],
    explanation: 'Self-management extends to logistics. The SM may coach but doesn\'t prescribe how the Daily runs.',
  },
  {
    id: 'sm11', concept: 'scrum_master', type: 'single',
    q: 'What should a Scrum Master do to start a project?',
    options: [
      { id: 'a', t: 'Ask the Lead Developer to explain the IT architecture.' },
      { id: 'b', t: 'Ask the Developers to introduce themselves to each other and tell about their skills and background.' },
      { id: 'c', t: 'Ensure that all team members have a first ticket assigned to them.' },
    ],
    correct: ['b'],
    explanation: 'Team formation starts with people understanding each other. There is no "Lead Developer," and assigning tickets contradicts self-management.',
  },
  {
    id: 'sm12', concept: 'scrum_master', type: 'single',
    q: 'The Scrum Master observes the PO is struggling with ordering the Product Backlog. What is an appropriate SM action?',
    options: [
      { id: 'a', t: 'Present the PO with an ordered Product Backlog to use.' },
      { id: 'b', t: 'Suggest that the Developers order the Product Backlog to be sure it\'s feasible.' },
      { id: 'c', t: 'Offer the PO help in understanding that the goal of ordering is to maximize value.' },
      { id: 'd', t: 'Encourage the PO to work with the Developers to see which items are fastest to implement.' },
      { id: 'e', t: 'Suggest extending the Sprint so the PO has more time.' },
    ],
    correct: ['c'],
    explanation: 'The SM serves the PO by teaching the purpose behind ordering — value maximization. They don\'t order for the PO or redirect the task to Developers.',
  },
  {
    id: 'sm13', concept: 'scrum_master', type: 'multi', selectCount: 2,
    q: 'A stakeholder is unhappy with product quality. What are two good options for the Scrum Master?',
    options: [
      { id: 'a', t: 'Explain to the PO that it is up to the Developers to decide on acceptable quality standards.' },
      { id: 'b', t: 'Encourage the PO to put quality specifications on the Product Backlog and express the stakeholder\'s concern to the Developers.' },
      { id: 'c', t: 'Coach the PO on how to talk with the Developers about this concern.' },
      { id: 'd', t: 'Bring the concern to the Testers to improve how the product is verified.' },
      { id: 'e', t: 'Wait to bring this up until the Sprint Retrospective.' },
    ],
    correct: ['b', 'c'],
    explanation: 'Surface the concern (Backlog) and coach the PO to address it (conversation). Quality isn\'t solely a Developer decision, and there are no "Testers" in Scrum.',
  },
  {
    id: 'sm14', concept: 'scrum_master', type: 'multi', selectCount: 2,
    q: 'The Scrum Team lacks tools and environment to fully complete each selected PBI. What should the Scrum Master do?',
    options: [
      { id: 'a', t: 'Encourage the PO to accept partially done Increments until the situation improves.' },
      { id: 'b', t: 'Have the Scrum Team establish a Definition of Done that is actually possible given current circumstances.' },
      { id: 'c', t: 'Declare the Scrum Team not ready for Scrum.' },
      { id: 'd', t: 'Refocus the current Sprint on establishing the team\'s environment instead of delivering.' },
      { id: 'e', t: 'Coach the Scrum Team to improve its skills, tools, and environment over time and adjust the Definition of Done accordingly.' },
    ],
    correct: ['b', 'e'],
    explanation: 'Be honest about what Done actually means now, and improve the environment over time so DoD can strengthen. Don\'t fake completion or block the team.',
  },
  {
    id: 'sm15', concept: 'scrum_master', type: 'multi', selectCount: 2,
    q: 'The Developers propose moving the Daily Scrum to only Tuesdays and Thursdays. What are two appropriate responses for the Scrum Master?',
    options: [
      { id: 'a', t: 'Consider the request and decide on which days the Daily Scrum should occur.' },
      { id: 'b', t: 'Coach the team on why the Daily Scrum is important as a daily inspect-and-adapt opportunity.' },
      { id: 'c', t: 'Acknowledge and support the self-managing team\'s decision.' },
      { id: 'd', t: 'Have the Developers vote.' },
      { id: 'e', t: 'Learn why the Developers want this and work with them to improve the outcome of the Daily Scrum.' },
    ],
    correct: ['b', 'e'],
    explanation: 'The Daily Scrum is daily by definition — it\'s not negotiable. Coach the team and dig into the underlying problem that\'s making them want to skip it.',
  },

  // ═══════════ DEVELOPERS — additional ═══════════
  {
    id: 'dev7', concept: 'developers', type: 'single',
    q: 'What is the perfect number of hours a Developer should work in a week?',
    options: [
      { id: 'a', t: 'As long as it is needed.' },
      { id: 'b', t: 'A maximum of 40 hours per week.' },
      { id: 'c', t: 'It is required to work at a constant, sustainable pace.' },
      { id: 'd', t: 'Between 40 and 60 hours per week.' },
    ],
    correct: ['c'],
    explanation: 'Agile principles call for a sustainable, constant pace. Specific hours aren\'t mandated by Scrum.',
  },
  {
    id: 'dev8', concept: 'developers', type: 'multi', selectCount: 2,
    q: 'Which two statements about the Developers are correct?',
    options: [
      { id: 'a', t: 'The Developers are self-managing.' },
      { id: 'b', t: 'The Developers are not allowed to help the Product Owner manage the Product Backlog.' },
      { id: 'c', t: 'The Developers decide when to do the next release.' },
      { id: 'd', t: 'The Developers own the Sprint Backlog.' },
    ],
    correct: ['a', 'd'],
    explanation: 'Developers self-manage and own the Sprint Backlog. They can help with Backlog work (the PO may delegate). Release timing is the PO\'s decision.',
  },
  {
    id: 'dev9', concept: 'developers', type: 'single',
    q: 'The Developers have trouble understanding a Sprint Backlog item. What should they do?',
    options: [
      { id: 'a', t: 'Ask the Scrum Master to explain it to them.' },
      { id: 'b', t: 'Don\'t touch the item until the Sprint Review to discuss it with the PO again.' },
      { id: 'c', t: 'Collaborate with the Product Owner immediately to receive a better understanding.' },
    ],
    correct: ['c'],
    explanation: 'Direct PO-Developer collaboration. The SM isn\'t the source of Product Backlog knowledge; waiting until the Review wastes the Sprint.',
  },
  {
    id: 'dev10', concept: 'developers', type: 'single',
    q: 'What kind of testing should be done during the Sprint?',
    options: [
      { id: 'a', t: 'Test Driven Development.' },
      { id: 'b', t: 'Acceptance Tests.' },
      { id: 'c', t: 'Unit Tests.' },
      { id: 'd', t: 'All kinds of test required to create a working Increment.' },
    ],
    correct: ['d'],
    explanation: 'If testing is needed to reach the DoD, it happens in the Sprint. No deferred "test phase," no "hardening Sprint."',
  },
  {
    id: 'dev11', concept: 'developers', type: 'single',
    q: 'Developers are self-managing. Which of the following do they manage?',
    options: [
      { id: 'a', t: 'Product Backlog ordering.' },
      { id: 'b', t: 'When to release, based on its progress.' },
      { id: 'c', t: 'Sprint Backlog.' },
      { id: 'd', t: 'Stakeholders for the Sprint Review.' },
      { id: 'e', t: 'Sprint length.' },
    ],
    correct: ['c'],
    explanation: 'Developers manage the Sprint Backlog. Ordering, releasing, stakeholder invites, and Sprint length are PO or team-level decisions.',
  },
  {
    id: 'dev12', concept: 'developers', type: 'single',
    q: 'When the Developers determine they can\'t finish the complete forecast, who needs to be present when reviewing and adjusting the Sprint work?',
    options: [
      { id: 'a', t: 'The Scrum Master and the Developers.' },
      { id: 'b', t: 'The Product Owner and all stakeholders.' },
      { id: 'c', t: 'The Product Owner and the Developers.' },
      { id: 'd', t: 'The Scrum Master, Project Manager and the Developers.' },
    ],
    correct: ['c'],
    explanation: 'Scope renegotiation is PO-Developer collaboration. The SM may facilitate but isn\'t required; stakeholders aren\'t involved.',
  },
  {
    id: 'dev13', concept: 'developers', type: 'tf',
    q: 'Only the Developers are influencing the Definition of Done, no one else.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The organization may impose a minimum DoD. The whole Scrum Team (including PO and SM) contributes. Developers don\'t own it alone.',
  },
  {
    id: 'dev14', concept: 'developers', type: 'single',
    q: 'As the Developers start work during the Sprint, they realize they have selected too much work to finish the Sprint. What should they do?',
    options: [
      { id: 'a', t: 'Inform the Product Owner at the Sprint Review, but prior to the demonstration.' },
      { id: 'b', t: 'Find another Scrum Team to give the excess work to.' },
      { id: 'c', t: 'Reduce the Definition of Done and get all PBIs done by the new definition.' },
      { id: 'd', t: 'As soon as possible in the Sprint, work with the Product Owner to remove some work or Product Backlog Items.' },
    ],
    correct: ['d'],
    explanation: 'Early transparency with the PO. Never reduce DoD mid-Sprint; never dump work on other teams; never hide the problem until Review.',
  },
  {
    id: 'dev15', concept: 'developers', type: 'single',
    q: 'Who creates the plan (Sprint Backlog) for how selected Product Backlog items will be turned into an Increment?',
    options: [
      { id: 'a', t: 'The Product Owner.' },
      { id: 'b', t: 'The Scrum Master.' },
      { id: 'c', t: 'The Developers.' },
      { id: 'd', t: 'The Scrum Team collectively.' },
    ],
    correct: ['c'],
    explanation: 'The Developers plan the "how." The Sprint Goal (why) and selected items (what) involve the whole team; the plan is Developer-owned.',
  },

  // ═══════════ PRODUCT BACKLOG — additional ═══════════
  {
    id: 'pb12', concept: 'product_backlog', type: 'single',
    q: 'A new Product Owner asks where to put stability requirements, performance requirements, documentation, and fixes. Are all of these acceptable on a Product Backlog?',
    options: [
      { id: 'a', t: 'Yes, they all belong on the Product Backlog. The Product Backlog is the single source of truth for all work for the product.' },
      { id: 'b', t: 'No, the Product Backlog is a tool for user features. Other requirements should be managed separately by the Developers.' },
    ],
    correct: ['a'],
    explanation: 'Everything the Scrum Team needs to work on lives in the Product Backlog. Splitting by type creates parallel backlogs and destroys transparency.',
  },
  {
    id: 'pb13', concept: 'product_backlog', type: 'single',
    q: 'What variables should a Product Owner consider when ordering the Product Backlog?',
    options: [
      { id: 'a', t: 'Development cohesion as indicated by the Developers.' },
      { id: 'b', t: 'The availability of resources and skills for implementation.' },
      { id: 'c', t: 'Lowest development cost to maximize ROI.' },
      { id: 'd', t: 'Effort first, then value.' },
      { id: 'e', t: 'Anything that informs the team to achieve the product\'s goals and optimize value delivered.' },
    ],
    correct: ['e'],
    explanation: 'Any relevant factor. The Scrum Guide doesn\'t prescribe a recipe — the PO uses judgment informed by goals and value.',
  },
  {
    id: 'pb14', concept: 'product_backlog', type: 'single',
    q: 'It is mandatory for the Product Owner to monitor and share Product Backlog progress by using which method?',
    options: [
      { id: 'a', t: 'A Product or Release burn-down chart.' },
      { id: 'b', t: 'A Value burn-up chart.' },
      { id: 'c', t: 'A Gantt Chart.' },
      { id: 'd', t: 'Any practice based on trends of work completed and upcoming work.' },
      { id: 'e', t: 'A Sprint Review acceptance report.' },
    ],
    correct: ['d'],
    explanation: 'No specific method is mandated. Burn-down, burn-up, cumulative flow — all are options, not requirements.',
  },
  {
    id: 'pb15', concept: 'product_backlog', type: 'single',
    q: 'How important is it for a Product Owner to order Product Backlog items by using value points?',
    options: [
      { id: 'a', t: 'Calculating value points is predictive and conflicts with empiricism; therefore not acceptable.' },
      { id: 'b', t: 'Value points are the ultimate way to predict the value the product will provide.' },
      { id: 'c', t: 'The PO may order using value points or select another technique — the decision is up to them.' },
    ],
    correct: ['c'],
    explanation: 'Value points are one technique. The PO chooses whatever works. Scrum doesn\'t mandate or forbid it.',
  },
  {
    id: 'pb16', concept: 'product_backlog', type: 'multi', selectCount: 2,
    q: 'Which of the following practices might help the Product Owner minimize waste in developing and sustaining the Product Backlog?',
    options: [
      { id: 'a', t: 'Avoid distracting the Scrum Team by maintaining newly gathered items in a separate Product Backlog until fully understood.' },
      { id: 'b', t: 'Only fully describe Product Backlog items when it seems likely they will be implemented.' },
      { id: 'c', t: 'Hand off ownership of the Product Backlog to someone else.' },
      { id: 'd', t: 'Remove items from the Product Backlog that have not been addressed in a long time.' },
    ],
    correct: ['b', 'd'],
    explanation: 'Detail late (just-in-time refinement) and prune stale items. Parallel backlogs destroy transparency; handing off ownership violates accountability.',
  },
  {
    id: 'pb17', concept: 'product_backlog', type: 'tf',
    q: 'The Product Backlog should have just enough detail.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Items near the top are more detailed; items further out are coarse. Detailing everything upfront is waste.',
  },
  {
    id: 'pb18', concept: 'product_backlog', type: 'tf',
    q: 'The Product Backlog is baselined before Sprint 0.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'There is no Sprint 0. The Product Backlog is emergent — never baselined.',
  },
  {
    id: 'pb19', concept: 'product_backlog', type: 'tf',
    q: 'All items in the Product Backlog have usually the same size.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Higher-order items are smaller and more detailed; lower-order items are larger and vague. Size variance is normal.',
  },
  {
    id: 'pb20', concept: 'product_backlog', type: 'tf',
    q: 'Does a Product Backlog Item have an item "Owner"?',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Product Owner is accountable for the whole Backlog. Individual items don\'t have individual owners.',
  },
  {
    id: 'pb21', concept: 'product_backlog', type: 'single',
    q: 'Based on which criteria should the Product Owner order the Product Backlog Items?',
    options: [
      { id: 'a', t: 'Based on size.' },
      { id: 'b', t: 'Based on value.' },
      { id: 'c', t: 'Based on risk.' },
      { id: 'd', t: 'Based on whatever factors best help achieve goals and maximize value — value, risk, priority, dependencies, and more.' },
    ],
    correct: ['d'],
    explanation: 'The Scrum Guide lists these as examples, not as a fixed recipe. Context drives the PO\'s judgment.',
  },
  {
    id: 'pb22', concept: 'product_backlog', type: 'single',
    q: 'Which statement describes best how the Product Backlog is impacted by changes in the product environment?',
    options: [
      { id: 'a', t: 'The Product Backlog should always follow the PO\'s plan and should not reflect changes at all.' },
      { id: 'b', t: 'The Product Backlog should be high-level and therefore tolerate such changes.' },
      { id: 'c', t: 'The Product Backlog should evolve and reflect environment changes.' },
    ],
    correct: ['c'],
    explanation: 'Emergence is a core property. The Backlog adapts to what the team learns about the market, users, and the product itself.',
  },
  {
    id: 'pb23', concept: 'product_backlog', type: 'tf',
    q: 'The Product Owner can nominate a "Lead Developer" as a single point of contact.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'No titles within Developers. Appointing a Lead Developer violates self-management and flat team structure.',
  },
  {
    id: 'pb24', concept: 'product_backlog', type: 'tf',
    q: 'A Product Owner with multiple teams working on one product should maintain separate Product Backlogs for each team.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'One product = one Backlog. Separate Backlogs create coordination overhead and hide dependencies.',
  },
  {
    id: 'pb25', concept: 'product_backlog', type: 'single',
    q: 'Scrum requires that the Product Owner must use which of the following items?',
    options: [
      { id: 'a', t: 'Burndown chart.' },
      { id: 'b', t: 'Feature burn-up.' },
      { id: 'c', t: 'Critical Path Analysis.' },
      { id: 'd', t: 'Project Gantt Chart.' },
      { id: 'e', t: 'None of the above.' },
    ],
    correct: ['e'],
    explanation: 'Scrum doesn\'t mandate any specific tracking artifact. The PO picks whatever enables transparency.',
  },
  {
    id: 'pb26', concept: 'product_backlog', type: 'multi', selectCount: 2,
    q: 'Which statements about the Product Backlog are correct?',
    options: [
      { id: 'a', t: 'The Product Backlog contains only items that are completely refined.' },
      { id: 'b', t: 'In the Product Backlog, items at the top are usually larger and less detailed than items at the bottom.' },
      { id: 'c', t: 'The Product Backlog is never baselined.' },
      { id: 'd', t: 'The Product Owner is accountable for the Product Backlog.' },
    ],
    correct: ['c', 'd'],
    explanation: 'Never baselined + PO-accountable = the two key facts. Option A reverses refinement (lower-order items are less refined, not all items). Option B reverses the gradient — top items are SMALLER and MORE detailed, not larger and vague.',
  },

  // ═══════════ SPRINT BACKLOG — additional ═══════════
  {
    id: 'sb6', concept: 'sprint_backlog', type: 'tf',
    q: 'When n Scrum teams are working on a product, there are n Sprint Backlogs but only 1 Product Backlog.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'Each team has its own Sprint Backlog (and Sprint Goal). One Product Backlog for the shared product.',
  },
  {
    id: 'sb7', concept: 'sprint_backlog', type: 'single',
    q: 'Which statement is correct about the Sprint Backlog?',
    options: [
      { id: 'a', t: 'It doesn\'t need to have detail.' },
      { id: 'b', t: 'It has just enough detail.' },
      { id: 'c', t: 'It has all the details.' },
    ],
    correct: ['b'],
    explanation: 'Enough to create the forecast and start — the rest emerges during the Sprint.',
  },
  {
    id: 'sb8', concept: 'sprint_backlog', type: 'multi', selectCount: 2,
    q: 'Which two are typical Daily Scrum outcomes?',
    options: [
      { id: 'a', t: 'The team is clear on the next steps toward the Sprint Goal.' },
      { id: 'b', t: 'The tasks are assigned to the developer.' },
      { id: 'c', t: 'Impediments identified by the Scrum Master.' },
      { id: 'd', t: 'An updated Sprint Backlog.' },
    ],
    correct: ['a', 'd'],
    explanation: 'Clear next steps + an updated plan (Sprint Backlog) are the two real outcomes. Nobody assigns Developer tasks; the Scrum Master isn\'t the impediment-finder.',
  },
  {
    id: 'sb9', concept: 'sprint_backlog', type: 'multi', selectCount: 2,
    q: 'Which are indications that a Product Backlog item is ready for development?',
    options: [
      { id: 'a', t: 'The item is refined and small enough to fit in one Sprint.' },
      { id: 'b', t: 'All stakeholders have agreed to prioritize it.' },
      { id: 'c', t: 'The item is estimated (e.g. in Story Points).' },
      { id: 'd', t: 'The item is smaller than 15 Story Points.' },
    ],
    correct: ['a', 'c'],
    explanation: 'Small enough for a Sprint + sized. Stakeholder votes and arbitrary point thresholds aren\'t part of the Scrum Guide.',
  },
  {
    id: 'sb10', concept: 'sprint_backlog', type: 'single',
    q: 'Which of the following should not be changed during a Sprint?',
    options: [
      { id: 'a', t: 'Product Backlog.' },
      { id: 'b', t: 'Definition of Done.' },
      { id: 'c', t: 'The Sprint Backlog.' },
    ],
    correct: ['b'],
    explanation: 'DoD mid-Sprint changes would invalidate work done against the previous DoD. Product Backlog and Sprint Backlog both evolve during a Sprint.',
  },

  // ═══════════ EVENTS — additional ═══════════
  {
    id: 'ev13', concept: 'events', type: 'single',
    q: 'Which are appropriate topics for discussion in a Sprint Retrospective?',
    options: [
      { id: 'a', t: 'Definition of Done.' },
      { id: 'b', t: 'How the Scrum Team does its work.' },
      { id: 'c', t: 'Team relations.' },
      { id: 'd', t: 'All of the above.' },
      { id: 'e', t: 'Arranging the Sprint Backlog for the next Sprint.' },
    ],
    correct: ['d'],
    explanation: 'The Retrospective covers individuals, interactions, processes, tools, and the DoD. Sprint Backlog work is for Sprint Planning.',
  },
  {
    id: 'ev14', concept: 'events', type: 'tf',
    q: 'The Product Owner makes sure the correct stakeholders are invited to the Sprint Retrospective. They might have important instructions for team improvements.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Retrospective is for the Scrum Team — it\'s where the team inspects itself and plans improvements. The Scrum Guide describes it as a Scrum Team event, not a stakeholder-inclusive one. The PO is part of the team and attends, but arranging stakeholder attendance is not their role. The team itself can invite others when useful, but that\'s unusual.',
  },
  {
    id: 'ev15', concept: 'events', type: 'tf',
    q: 'A high-performance Scrum Team ensures that each Increment is complete by running a Release Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'No "Release Sprint." Every Sprint produces a releasable Increment. Release Sprints signal incomplete DoD.',
  },
  {
    id: 'ev16', concept: 'events', type: 'tf',
    q: 'An Increment must be released to customers or users at the end of each Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'The Increment must be usable and potentially releasable — but the PO decides when to release. Usable ≠ released.',
  },
  {
    id: 'ev17', concept: 'events', type: 'tf',
    q: 'Following Scrum, there can be a maximum of one release per Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Multiple Increments can be created and released in a single Sprint. The PO releases whenever value is ready to deliver.',
  },
  {
    id: 'ev18', concept: 'events', type: 'multi', selectCount: 3,
    q: 'What would be three key concerns if the Daily Scrum frequency were lowered to every two or three days?',
    options: [
      { id: 'a', t: 'The Scrum Master loses the ability to update the Gantt Chart properly.' },
      { id: 'b', t: 'Too much work is spent updating the Scrum board before the meeting.' },
      { id: 'c', t: 'Opportunities to inspect and adapt the Sprint Backlog are lost.' },
      { id: 'd', t: 'The Product Owner cannot accurately report progress to the stakeholders.' },
      { id: 'e', t: 'Impediments are raised and resolved more slowly.' },
      { id: 'f', t: 'The Sprint Backlog may become inaccurate.' },
    ],
    correct: ['c', 'e', 'f'],
    explanation: 'Less frequent inspection = slower adaptation, slower impediment resolution, staler plan. The Gantt and stakeholder reporting are red herrings.',
  },
  {
    id: 'ev19', concept: 'events', type: 'single',
    q: 'Why do the Developers need a Sprint Goal?',
    options: [
      { id: 'a', t: 'The Developers are more focused with a common yet specific goal.' },
      { id: 'b', t: 'Sprint Goals are not valuable. Everything is known from the Product Backlog.' },
      { id: 'c', t: 'A Sprint Goal only gives purpose to Sprint 0.' },
      { id: 'd', t: 'Sprint Goal ensures that all PBIs selected are implemented.' },
    ],
    correct: ['a'],
    explanation: 'The Sprint Goal is the coherence mechanism. It keeps the team focused on one thing when scope needs to flex.',
  },
  {
    id: 'ev20', concept: 'events', type: 'single',
    q: 'Which topics should be discussed in the Sprint Review?',
    options: [
      { id: 'a', t: 'The Scrum process, and how it was used during the Sprint.' },
      { id: 'b', t: 'Coding and engineering practices.' },
      { id: 'c', t: 'The product Increment and what\'s next.' },
      { id: 'd', t: 'All of the above.' },
    ],
    correct: ['c'],
    explanation: 'The Review inspects the Increment and adapts the Product Backlog. Process and engineering practice discussions belong to the Retrospective.',
  },
  {
    id: 'ev21', concept: 'events', type: 'single',
    q: 'What happens if the Scrum Team cannot complete its work by the end of the Sprint?',
    options: [
      { id: 'a', t: 'The Sprint length is unchanged and the Scrum Team continuously learns and adapts.' },
      { id: 'b', t: 'The Sprint is extended temporarily. Lessons are taken to ensure it does not happen again.' },
      { id: 'c', t: 'The Sprint is extended and future Sprints use this new duration.' },
    ],
    correct: ['a'],
    explanation: 'Sprints never extend. Whatever isn\'t Done returns to the Product Backlog. The team learns and adjusts in the next Sprint.',
  },
  {
    id: 'ev22', concept: 'events', type: 'single',
    q: 'How much work is required of the Developers to complete a Product Backlog Item selected during Sprint Planning?',
    options: [
      { id: 'a', t: 'As much as they can fit into the Sprint, with remaining work deferred to the next Sprint.' },
      { id: 'b', t: 'As much as is required to meet the Scrum Team\'s Definition of Done.' },
      { id: 'c', t: 'All development work and at least some testing.' },
      { id: 'd', t: 'A proportional amount of time on analysis, design, development, and testing.' },
    ],
    correct: ['b'],
    explanation: 'Done is the standard. If an item doesn\'t meet DoD, it\'s not complete — full stop.',
  },
  {
    id: 'ev23', concept: 'events', type: 'multi', selectCount: 2,
    q: 'As Sprint Planning progresses, the Developers realize the workload may exceed their capacity. Which two are valid actions?',
    options: [
      { id: 'a', t: 'Recruit additional Developers before the work can begin.' },
      { id: 'b', t: 'The Developers ensure that the Scrum Team is aware, start the Sprint, and monitor progress.' },
      { id: 'c', t: 'The Developers work overtime during this Sprint.' },
      { id: 'd', t: 'Cancel the Sprint.' },
      { id: 'e', t: 'Remove or change selected Product Backlog Items.' },
    ],
    correct: ['b', 'e'],
    explanation: 'Be transparent and start, or renegotiate scope. Never solve capacity with overtime or headcount, and don\'t cancel over estimation worries.',
  },
  {
    id: 'ev24', concept: 'events', type: 'single',
    q: 'When must the Product Owner be present at the Daily Scrum?',
    options: [
      { id: 'a', t: 'When they need to represent the stakeholders\' point of view.' },
      { id: 'b', t: 'When the Scrum Master asks them to attend.' },
      { id: 'c', t: 'When there are impediments to discuss.' },
      { id: 'd', t: 'When the Product Owner is actively working on items from the Sprint Backlog.' },
    ],
    correct: ['d'],
    explanation: 'The PO attends as a Developer when actively working on Sprint Backlog items — otherwise not required.',
  },
  {
    id: 'ev25', concept: 'events', type: 'single',
    q: 'How is management external to the Scrum Team involved in the Daily Scrum?',
    options: [
      { id: 'a', t: 'The Product Owner represents their opinions.' },
      { id: 'b', t: 'Managers are not required at the Daily Scrum.' },
      { id: 'c', t: 'The Scrum Master speaks on their behalf.' },
      { id: 'd', t: 'Management gives an update at the start of each Daily Scrum.' },
    ],
    correct: ['b'],
    explanation: 'The Daily Scrum is a Developer event. External management has no place in it.',
  },
  {
    id: 'ev26', concept: 'events', type: 'single',
    q: 'During the Sprint Retrospective, a Scrum Team identifies several high-priority process improvements. Which statement is most accurate?',
    options: [
      { id: 'a', t: 'The Scrum Team may add the items to the Sprint Backlog for the next Sprint.' },
      { id: 'b', t: 'The Scrum Team should choose at least one high-priority process improvement to place in the Product Backlog.' },
      { id: 'c', t: 'The Scrum Team should decline to add a process improvement to the Sprint Backlog when things are running smoothly.' },
      { id: 'd', t: 'The Scrum Master selects the most important improvement and places it in the Sprint Backlog.' },
    ],
    correct: ['a'],
    explanation: 'The 2020 Scrum Guide says the most impactful improvements are addressed as soon as possible — typically in the next Sprint Backlog.',
  },
  {
    id: 'ev27', concept: 'events', type: 'single',
    q: 'Which Scrum Event can be compared to the use of a "lessons learned meeting"?',
    options: [
      { id: 'a', t: 'The Sprint Review.' },
      { id: 'b', t: 'The Daily Scrum.' },
      { id: 'c', t: 'The Sprint Retrospective.' },
      { id: 'd', t: 'The Sprint Planning.' },
    ],
    correct: ['c'],
    explanation: 'The Retrospective is where the team reflects and plans improvements — the Scrum analog of "lessons learned," but recurring and tied to action.',
  },
  {
    id: 'ev28', concept: 'events', type: 'single',
    q: 'What is the Sprint Retrospective\'s timebox for a one-month Sprint?',
    options: [
      { id: 'a', t: 'A maximum of 1 hour.' },
      { id: 'b', t: 'A maximum of 3 hours.' },
      { id: 'c', t: 'A maximum of 4 hours.' },
      { id: 'd', t: 'A maximum of 8 hours.' },
    ],
    correct: ['b'],
    explanation: 'Retrospective: 3 hours for a one-month Sprint. Review: 4 hours. Planning: 8 hours. Daily: 15 minutes.',
  },
  {
    id: 'ev29', concept: 'events', type: 'single',
    q: 'What is the Sprint Review\'s timebox for a one-month Sprint?',
    options: [
      { id: 'a', t: 'A maximum of 2 hours.' },
      { id: 'b', t: 'A maximum of 3 hours.' },
      { id: 'c', t: 'A maximum of 4 hours.' },
      { id: 'd', t: 'A maximum of 8 hours.' },
    ],
    correct: ['c'],
    explanation: 'Sprint Review: 4 hours for one-month Sprints. Proportionally less for shorter Sprints.',
  },
  {
    id: 'ev30', concept: 'events', type: 'single',
    q: 'What is the maximum duration of a Sprint?',
    options: [
      { id: 'a', t: '1 week.' },
      { id: 'b', t: '2 weeks.' },
      { id: 'c', t: '1 month.' },
      { id: 'd', t: '3 months.' },
    ],
    correct: ['c'],
    explanation: 'Sprints are one month or less. Shorter Sprints are common; longer ones are not allowed.',
  },
  {
    id: 'ev31', concept: 'events', type: 'single',
    q: 'To create focus, which of the following are most important to have ready when Sprint Planning begins?',
    options: [
      { id: 'a', t: 'A fully refined Product Backlog.' },
      { id: 'b', t: 'A Product Backlog with the most important items ready for discussion, and a Product Goal communicated by the Product Owner.' },
      { id: 'c', t: 'A Product Backlog with the most important items ready for discussion, and formal budget approval.' },
      { id: 'd', t: 'A clear and non-negotiable Sprint Goal.' },
    ],
    correct: ['b'],
    explanation: 'Sprint Planning needs ready items and the Product Goal for context. The Sprint Goal is crafted during Planning, not before.',
  },
  {
    id: 'ev32', concept: 'events', type: 'multi', selectCount: 2,
    q: 'Which two things should the Scrum Team do during the first Sprint?',
    options: [
      { id: 'a', t: 'Make up a plan for the rest of the project.' },
      { id: 'b', t: 'Create at least one valuable, useful Increment.' },
      { id: 'c', t: 'Build at least one piece of valuable functionality.' },
      { id: 'd', t: 'Define the major product features and a release plan architecture.' },
      { id: 'e', t: 'Analyze, describe, and document the requirements for subsequent Sprints.' },
    ],
    correct: ['b', 'c'],
    explanation: 'Every Sprint — including the first — produces an Increment. No Sprint 0 for up-front analysis or architecture.',
  },
  {
    id: 'ev33', concept: 'events', type: 'single',
    q: 'What typically happens between the end of a Sprint Retrospective and the start of the next Sprint Planning?',
    options: [
      { id: 'a', t: 'User Story grooming.' },
      { id: 'b', t: 'Nothing — the next Sprint begins immediately.' },
      { id: 'c', t: 'Product Backlog Refinement.' },
    ],
    correct: ['b'],
    explanation: 'Zero gap. The new Sprint begins immediately. Refinement is ongoing inside the Sprint, not a between-Sprint activity.',
  },

  // ═══════════ ARTIFACTS & COMMITMENTS — additional ═══════════
  {
    id: 'ac9', concept: 'artifacts_commitments', type: 'tf',
    q: 'The Definition of Done increases transparency and is used by the Developers to forecast how many items can be picked from the Product Backlog.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'A shared DoD lets Developers assess whether they can deliver something truly Done within a Sprint — it directly informs the forecast.',
  },
  {
    id: 'ac10', concept: 'artifacts_commitments', type: 'multi', selectCount: 2,
    q: 'Which two statements explain why the Definition of Done is important to the Product Owner?',
    options: [
      { id: 'a', t: 'It identifies undone work that can be addressed in a separate Sprint.' },
      { id: 'b', t: 'It establishes the expected quality of the Increment reviewed at the Sprint Review.' },
      { id: 'c', t: 'It creates transparency regarding progress within the Scrum Team.' },
      { id: 'd', t: 'It helps the Product Owner track the open work during a Sprint.' },
    ],
    correct: ['b', 'c'],
    explanation: 'The DoD defines what "ready to release" means and makes true progress visible — both critical to the PO\'s value decisions.',
  },
  {
    id: 'ac11', concept: 'artifacts_commitments', type: 'single',
    q: 'If the Product Owner has concerns about the Definition of Done — what should the Product Owner do?',
    options: [
      { id: 'a', t: 'The Product Owner should discuss the Definition of Done with the Developers.' },
      { id: 'b', t: 'The Product Owner should change the Definition of Done.' },
      { id: 'c', t: 'The Product Owner should ask the Scrum Master to change the Definition of Done.' },
    ],
    correct: ['a'],
    explanation: 'The PO participates in the DoD conversation as a Scrum Team member. They don\'t unilaterally change it.',
  },
  {
    id: 'ac12', concept: 'artifacts_commitments', type: 'single',
    q: 'When is a Product Backlog item considered "Done"?',
    options: [
      { id: 'a', t: 'When the Product Owner declares it to be "Done".' },
      { id: 'b', t: 'When the Developers agree that it is "Done".' },
      { id: 'c', t: 'When it meets the Definition of Done and is potentially releasable.' },
    ],
    correct: ['c'],
    explanation: 'Done is objective, defined by the DoD. Not "I feel it\'s done" or a PO blessing.',
  },
  {
    id: 'ac13', concept: 'artifacts_commitments', type: 'multi', selectCount: 2,
    q: 'What two things best help the Product Owner manage the value of a product?',
    options: [
      { id: 'a', t: 'Devising a formula for a neutral calculation of value.' },
      { id: 'b', t: 'Setting value on individual Product Backlog Items using Value Poker.' },
      { id: 'c', t: 'The order of the Product Backlog.' },
      { id: 'd', t: 'Validating assumptions of value through frequent releases.' },
    ],
    correct: ['c', 'd'],
    explanation: 'Ordering reflects value judgments; frequent releases validate them. Formulas and "Value Poker" are not Scrum concepts.',
  },
  {
    id: 'ac14', concept: 'artifacts_commitments', type: 'multi', selectCount: 2,
    q: 'Which of the following statements about technical debt are correct?',
    options: [
      { id: 'a', t: 'If you have a high level of technical debt, it could lead to false assumptions about the current state of the system.' },
      { id: 'b', t: 'If you have technical debt, no further features should be developed until the debt is fixed.' },
      { id: 'c', t: 'It creates uncertainty — as more features are added, more problems occur.' },
      { id: 'd', t: 'It is the Product Owner\'s task to take it into account during release planning.' },
    ],
    correct: ['a', 'c'],
    explanation: 'Debt creates opacity and compounding uncertainty. But it\'s the whole team\'s concern (not solely the PO\'s), and halting feature work isn\'t the required response.',
  },
  {
    id: 'ac15', concept: 'artifacts_commitments', type: 'multi', selectCount: 3,
    q: 'What can be done to reduce technical debt?',
    options: [
      { id: 'a', t: 'Improve the Definition of Done.' },
      { id: 'b', t: 'Include external QA.' },
      { id: 'c', t: 'Have hardening Sprints.' },
      { id: 'd', t: 'Pay down debt continuously within Sprints as part of the work.' },
      { id: 'e', t: 'Make debt visible on the Product Backlog.' },
    ],
    correct: ['a', 'd', 'e'],
    explanation: 'Stronger DoD prevents new debt; continuous paydown shrinks existing debt; visibility enables PO prioritization. Hardening Sprints and outsourced QA are anti-patterns.',
  },
  {
    id: 'ac16', concept: 'artifacts_commitments', type: 'tf',
    q: 'The Definition of Ready shows the team when Product Backlog Items are ready to be selected for the Sprint Backlog.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'No Definition of Ready exists in the 2020 Scrum Guide. Teams may use it as a technique but it\'s not prescribed.',
  },
  {
    id: 'ac17', concept: 'artifacts_commitments', type: 'single',
    q: 'Which commitment is associated with the Product Backlog?',
    options: [
      { id: 'a', t: 'Definition of Done.' },
      { id: 'b', t: 'Sprint Goal.' },
      { id: 'c', t: 'Product Goal.' },
      { id: 'd', t: 'Acceptance Criteria.' },
    ],
    correct: ['c'],
    explanation: 'The 2020 Scrum Guide introduced commitments for each artifact: Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → Definition of Done.',
  },
  {
    id: 'ac18', concept: 'artifacts_commitments', type: 'single',
    q: 'Which commitment is associated with the Sprint Backlog?',
    options: [
      { id: 'a', t: 'Product Goal.' },
      { id: 'b', t: 'Sprint Goal.' },
      { id: 'c', t: 'Definition of Done.' },
      { id: 'd', t: 'Definition of Ready.' },
    ],
    correct: ['b'],
    explanation: 'Sprint Backlog → Sprint Goal. The Sprint Goal is the commitment that makes the Sprint Backlog meaningful.',
  },
  {
    id: 'ac19', concept: 'artifacts_commitments', type: 'single',
    q: 'Which commitment is associated with the Increment?',
    options: [
      { id: 'a', t: 'Product Goal.' },
      { id: 'b', t: 'Sprint Goal.' },
      { id: 'c', t: 'Definition of Done.' },
      { id: 'd', t: 'Acceptance Criteria.' },
    ],
    correct: ['c'],
    explanation: 'Increment → Definition of Done. Without the DoD, an Increment has no clear standard.',
  },
  {
    id: 'ac20', concept: 'artifacts_commitments', type: 'tf',
    q: 'Multiple Increments may be created within a single Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'The 2020 Scrum Guide explicitly allows multiple Increments per Sprint. Each meeting the DoD and additive to prior ones.',
  },

  // ═══════════ SCALING — additional ═══════════
  {
    id: 'sc6', concept: 'scaling', type: 'tf',
    q: 'When n Scrum teams are working on a product, there should always be only 1 Product Owner but 1-n Scrum Masters.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'One PO per product. Each team has its own Scrum Master (though one person could serve multiple teams).',
  },
  {
    id: 'sc7', concept: 'scaling', type: 'tf',
    q: 'When 3 products are developed using Scrum, there can be only a single Product Owner for all products.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Each product needs its own PO. One person could theoretically fill multiple PO roles, but each product has its own PO accountability.',
  },
  {
    id: 'sc8', concept: 'scaling', type: 'tf',
    q: 'Two Scrum Teams working on the same product must share the same Definition of Done.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'One product = one DoD, shared across all teams contributing to it. Otherwise Increments can\'t combine into a coherent whole.',
  },
  {
    id: 'sc9', concept: 'scaling', type: 'single',
    q: 'When multiple Scrum Teams work on the same product, how should cross-team coordination happen?',
    options: [
      { id: 'a', t: 'A dedicated coordination manager assigned by the organization.' },
      { id: 'b', t: 'The Scrum Masters take turns coordinating across teams.' },
      { id: 'c', t: 'The teams self-manage their coordination through direct collaboration.' },
      { id: 'd', t: 'The single Product Owner coordinates all dependencies.' },
    ],
    correct: ['c'],
    explanation: 'Self-management extends across team boundaries. Teams coordinate directly — no external coordinator, no PO-as-traffic-cop.',
  },
  {
    id: 'sc10', concept: 'scaling', type: 'tf',
    q: 'When multiple Scrum Teams work on the same product, they should still have only one Product Goal.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: 'One product means one Product Goal — the long-term objective shared by all teams building that product.',
  },

  // ═══════════ GAP COVERAGE — concepts the PDF mentions but my bank didn't fully cover ═══════════
  {
    id: 'st15', concept: 'scrum_theory', type: 'single',
    q: 'The Cone of Uncertainty can be used to do what?',
    options: [
      { id: 'a', t: 'Determine the length of the next Sprint.' },
      { id: 'b', t: 'Determine the cost of a project before it begins.' },
      { id: 'c', t: 'Determine whether to cut quality, similar to the Iron Triangle of project management.' },
      { id: 'd', t: 'Illustrate that as a project forecast lengthens, it is increasingly less certain.' },
    ],
    correct: ['d'],
    explanation: 'The Cone of Uncertainty is a visualization showing that estimates far in the future carry much higher uncertainty than near-term ones. It\'s not prescribed by Scrum, but it supports why detailed upfront planning is wasteful.',
  },
  {
    id: 'st16', concept: 'scrum_theory', type: 'tf',
    q: 'More velocity means more value.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Velocity measures output (story points completed), not outcome. A team can ship more and deliver less. This is one of the most common anti-patterns in Scrum adoption.',
  },
  {
    id: 'pb27', concept: 'product_backlog', type: 'multi', selectCount: 2,
    q: 'What are two effective ways for the Scrum Team to make non-functional requirements visible?',
    options: [
      { id: 'a', t: 'Run integration and regression tests before the end of the Sprint and capture open work for the next Sprint\'s Sprint Backlog.' },
      { id: 'b', t: 'Add them to the Product Backlog to ensure transparency.' },
      { id: 'c', t: 'Put them on a separate list on the Scrum board, available for all to see.' },
      { id: 'd', t: 'Add them to the Definition of Done so the work is taken care of every Sprint.' },
    ],
    correct: ['b', 'd'],
    explanation: 'Non-functional requirements belong in two places: on the Product Backlog (for specific needs that can be ordered and refined) and in the DoD (for standards that apply to every Increment — performance, security, accessibility).',
  },
  {
    id: 'pb28', concept: 'product_backlog', type: 'single',
    q: 'How should a Scrum Team deal with non-functional requirements?',
    options: [
      { id: 'a', t: 'Make sure every Increment meets them.' },
      { id: 'b', t: 'Handle them in a separate "hardening" Sprint at the end.' },
      { id: 'c', t: 'Add a special non-functional requirements team to verify them.' },
      { id: 'd', t: 'Assign them to the Scrum Master to track.' },
    ],
    correct: ['a'],
    explanation: 'Every Increment must be usable, which means NFRs are met every Sprint. Deferring them to a hardening Sprint means your Increments weren\'t really usable — you had hidden debt.',
  },
  {
    id: 'po44', concept: 'product_owner', type: 'single',
    q: 'What is the accountability of the Product Owner during Sprint 0?',
    options: [
      { id: 'a', t: 'Build out the initial Product Backlog and architecture runway.' },
      { id: 'b', t: 'Assemble the team and establish the Definition of Done.' },
      { id: 'c', t: 'There is no Sprint 0 in Scrum.' },
      { id: 'd', t: 'Align with stakeholders on scope and deadlines.' },
    ],
    correct: ['c'],
    explanation: 'Sprint 0 is not a Scrum concept. Every Sprint must produce a valuable, usable Increment — including the first. "Sprint 0" as a setup phase is an anti-pattern imported from phased methodologies.',
  },
  {
    id: 'po45', concept: 'product_owner', type: 'single',
    q: 'The satisfaction of which stakeholder is the most important?',
    options: [
      { id: 'a', t: 'The customer.' },
      { id: 'b', t: 'The Product Owner.' },
      { id: 'c', t: 'It depends on context — there is no universal hierarchy of stakeholder importance.' },
      { id: 'd', t: 'The CEO.' },
    ],
    correct: ['c'],
    explanation: 'Scrum doesn\'t rank stakeholders. The PO balances competing interests based on what maximizes product value. Pretending one group always wins is a simplification exam-writers love to trap with.',
  },
  {
    id: 'po46', concept: 'product_owner', type: 'single',
    q: 'How does an organization know that a product built using Scrum is successful?',
    options: [
      { id: 'a', t: 'The team consistently meets its velocity forecast.' },
      { id: 'b', t: 'All Product Backlog items get done before the deadline.' },
      { id: 'c', t: 'The product delivers value — measured through customer outcomes, adoption, revenue, or whatever the organization has defined as success.' },
      { id: 'd', t: 'The Definition of Done is never compromised.' },
    ],
    correct: ['c'],
    explanation: 'Success is about outcomes, not outputs. Velocity, scope completion, and process adherence are means — not the measure.',
  },
  {
    id: 'po47', concept: 'product_owner', type: 'single',
    q: 'How is budgeting done in a Scrum project?',
    options: [
      { id: 'a', t: 'Scrum prescribes a specific budgeting approach based on Sprint count.' },
      { id: 'b', t: 'The Product Owner approves budgets at each Sprint Review.' },
      { id: 'c', t: 'Scrum does not prescribe a budgeting approach — the organization decides based on its context.' },
      { id: 'd', t: 'Budgeting is done upfront based on a detailed Product Backlog estimate.' },
    ],
    correct: ['c'],
    explanation: 'Scrum is silent on budgeting. Many organizations use incremental, time-boxed funding (per Sprint or per quarter) to align with empirical control, but this is a choice, not a rule.',
  },
  {
    id: 'po48', concept: 'product_owner', type: 'single',
    q: 'Which of the following is correct about the Product Vision in Scrum?',
    options: [
      { id: 'a', t: 'Product Vision is a formal Scrum artifact, maintained separately from the Product Backlog.' },
      { id: 'b', t: 'Product Vision and Product Goal are synonymous in the 2020 Scrum Guide.' },
      { id: 'c', t: 'Product Vision is not defined in the 2020 Scrum Guide — the Product Goal is the closest equivalent.' },
      { id: 'd', t: 'Product Vision replaces the Product Goal in the 2020 Scrum Guide.' },
    ],
    correct: ['c'],
    explanation: 'The 2020 Scrum Guide introduced the Product Goal but did not formalize "Product Vision." Many teams still use a vision statement as a useful practice — it\'s just not a Scrum element.',
  },
  {
    id: 'po49', concept: 'product_owner', type: 'multi', selectCount: 2,
    q: 'In the middle of the Sprint, the customer decides that there are two new features she wants. The Product Owner could:',
    options: [
      { id: 'a', t: 'Cancel the Sprint immediately to add the new features.' },
      { id: 'b', t: 'Add the new features to the Product Backlog for a future Sprint.' },
      { id: 'c', t: 'Work with the Developers to assess whether the new features can replace existing Sprint Backlog items, given the Sprint Goal is not affected.' },
      { id: 'd', t: 'Secretly add the features to the Sprint Backlog without telling the Developers.' },
      { id: 'e', t: 'Tell the customer Scrum doesn\'t allow changes mid-Sprint.' },
    ],
    correct: ['b', 'c'],
    explanation: 'New work goes to the Backlog. If swapping items doesn\'t jeopardize the Sprint Goal, the PO can negotiate with the Developers. Cancellation is reserved for obsolete Sprint Goals; secret changes destroy transparency.',
  },
  {
    id: 'po50', concept: 'product_owner', type: 'single',
    q: 'The Product Owner is not available and cannot answer the Developers\' questions before Sprint Planning. The Developers feel a high level of uncertainty to make a reliable forecast. What should the team do?',
    options: [
      { id: 'a', t: 'Postpone the Sprint until the PO is available.' },
      { id: 'b', t: 'Proceed with Sprint Planning using the best information available, and adjust during the Sprint once the PO returns.' },
      { id: 'c', t: 'Ask the Scrum Master to act as Product Owner.' },
      { id: 'd', t: 'Skip Sprint Planning and start working.' },
    ],
    correct: ['b'],
    explanation: 'Sprints run on cadence. The team works with what they have and adapts when the PO returns. Postponement, substitution, and skipping events are all anti-patterns.',
  },
  {
    id: 'dev16', concept: 'developers', type: 'single',
    q: 'When does a Developer become accountable for the value of a Product Backlog Item selected for the Sprint?',
    options: [
      { id: 'a', t: 'When the Developer starts working on it.' },
      { id: 'b', t: 'When the Developer volunteers to take it on.' },
      { id: 'c', t: 'Never — the Product Owner is accountable for value; Developers are accountable for the work.' },
      { id: 'd', t: 'When the Scrum Master assigns it.' },
    ],
    correct: ['c'],
    explanation: 'Accountability for value belongs to the Product Owner. Developers are accountable for a usable Increment that meets the DoD. This split is fundamental to Scrum.',
  },
  {
    id: 'dev17', concept: 'developers', type: 'single',
    q: 'What does a burn-down chart measure in a project?',
    options: [
      { id: 'a', t: 'The amount of value delivered so far.' },
      { id: 'b', t: 'The amount of work remaining over time.' },
      { id: 'c', t: 'The number of hours worked by each Developer.' },
      { id: 'd', t: 'The velocity of the Scrum Team.' },
    ],
    correct: ['b'],
    explanation: 'A burn-down shows remaining work trending toward zero. Scrum doesn\'t require burn-down charts — they\'re one of several optional techniques for showing progress.',
  },
  {
    id: 'stm17', concept: 'scrum_team', type: 'single',
    q: 'What may happen if the Scrum Team\'s composition changes during the project?',
    options: [
      { id: 'a', t: 'Productivity increases immediately thanks to new perspectives.' },
      { id: 'b', t: 'There is no impact; Developers are interchangeable.' },
      { id: 'c', t: 'A short-term reduction in productivity, as the team re-forms and redistributes knowledge.' },
      { id: 'd', t: 'The project must be restarted from scratch.' },
    ],
    correct: ['c'],
    explanation: 'Team changes cost productivity in the short term. Sometimes it\'s worth it, but the cost is real. This is why "rotating people across teams" as a default practice is counterproductive.',
  },
  {
    id: 'ev34', concept: 'events', type: 'tf',
    q: 'Sprint Planning is time-boxed to a maximum of eight hours for a one-month Sprint.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['true'],
    explanation: '8h for Planning, 4h for Review, 3h for Retro, 15min for Daily — all for a one-month Sprint. Shorter Sprints get proportionally smaller timeboxes.',
  },
  {
    id: 'ev35', concept: 'events', type: 'single',
    q: 'Which of the following are required by Scrum?',
    options: [
      { id: 'a', t: 'Daily Scrum, burndown chart, Definition of Ready.' },
      { id: 'b', t: 'Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective — all five events including the Sprint itself.' },
      { id: 'c', t: 'User stories, story points, velocity tracking.' },
      { id: 'd', t: 'Release Sprint, Sprint 0, hardening Sprint.' },
    ],
    correct: ['b'],
    explanation: 'The five events (Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective) are required. Burndown, user stories, velocity, Definition of Ready — all optional techniques.',
  },
  {
    id: 'ac21', concept: 'artifacts_commitments', type: 'tf',
    q: 'Two Scrum Teams working on the same product must share the same Definition of Ready.',
    options: [{ id: 'true', t: 'True' }, { id: 'false', t: 'False' }],
    correct: ['false'],
    explanation: 'Definition of Ready isn\'t a Scrum concept at all, so the question is a trap. Teams may use a DoR as a technique, but there\'s no Scrum requirement for one — shared or otherwise. Only the DoD must be shared across teams on the same product.',
  },

  // ═══════════ BRUTAL-DIFFICULTY VARIANTS — weasel words, inverse framings, "primary/best/first" discriminators ═══════════
  // These mirror the adversarial phrasing style of the real PSPO I exam.

  {
    id: 'b_po1', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'What is the Product Owner\'s PRIMARY responsibility?',
    options: [
      { id: 'a', t: 'Clearly communicating Product Backlog items to the Developers.' },
      { id: 'b', t: 'Ordering the Product Backlog.' },
      { id: 'c', t: 'Maximizing the value of the product resulting from the work of the Scrum Team.' },
      { id: 'd', t: 'Developing and communicating the Product Goal.' },
    ],
    correct: ['c'],
    explanation: 'All four are PO activities. But "maximizing value" is the accountability — the overarching responsibility. The others are specific Product Backlog management tasks that support the accountability. On the exam, "primary" usually points to the accountability, not the activity.',
    distractors: {
      a: 'Clear communication of PBIs is one of four responsibilities under Product Backlog management — not the primary accountability.',
      b: 'Ordering is one of four Product Backlog management responsibilities. Important, but not the overarching accountability.',
      d: 'Developing the Product Goal is one of four PB management responsibilities. Not the primary accountability.',
    },
  },
  {
    id: 'b_po2', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'A stakeholder demands that a new feature be added to the current Sprint mid-way through. The feature aligns with the Sprint Goal. What should the Product Owner do FIRST?',
    options: [
      { id: 'a', t: 'Add the feature to the top of the Product Backlog for the next Sprint.' },
      { id: 'b', t: 'Work with the Developers to assess whether scope can be renegotiated without jeopardizing the Sprint Goal.' },
      { id: 'c', t: 'Accept the request and inform the Developers that a new item has been added to the Sprint.' },
      { id: 'd', t: 'Cancel the Sprint so the new work can be planned properly.' },
    ],
    correct: ['b'],
    explanation: 'All four are things a PO might do in some scenario. "FIRST" is the discriminator. Because the feature aligns with the Sprint Goal, in-Sprint renegotiation with the Developers is on the table — but the first step is the conversation, not the decision. The PO cannot unilaterally add work to the Sprint Backlog (that\'s the Developers\' artifact).',
    distractors: {
      a: 'This is safe but skips the renegotiation option. Since the feature aligns with the Sprint Goal, collaborating first is better than deferring automatically.',
      c: 'The PO cannot add items to the Sprint Backlog directly — that\'s the Developers\' artifact. Collaboration is required.',
      d: 'Cancellation is only warranted when the Sprint Goal becomes obsolete. This scenario does not describe that.',
    },
  },
  {
    id: 'b_po3', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'Which of the following is LEAST likely to indicate that a Product Owner is succeeding in their accountability?',
    options: [
      { id: 'a', t: 'The team\'s velocity has steadily increased over the last five Sprints.' },
      { id: 'b', t: 'Customer satisfaction scores are trending upward after recent releases.' },
      { id: 'c', t: 'Stakeholders report that the Product Backlog is transparent and they understand what\'s coming.' },
      { id: 'd', t: 'The Developers report confidence in each Sprint\'s forecast because Backlog items are clear.' },
    ],
    correct: ['a'],
    explanation: 'LEAST likely = find the weakest signal. Velocity increase measures OUTPUT, not VALUE. A PO maximizes value, not velocity. The other three all point to value-adjacent outcomes. This is the classic "velocity is not value" trap in discriminator form.',
  },
  {
    id: 'b_po4', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'A Product Owner is unavailable for two weeks. During this time, which of the following is the BEST action for the Scrum Team?',
    options: [
      { id: 'a', t: 'Pause all Sprint work until the Product Owner returns to avoid making wrong decisions.' },
      { id: 'b', t: 'Ask management to appoint a temporary Product Owner for the period.' },
      { id: 'c', t: 'Continue Sprints as planned; Developers make the best decisions they can toward the Sprint Goal and align with the Product Owner when available.' },
      { id: 'd', t: 'The Scrum Master assumes Product Owner responsibilities temporarily.' },
    ],
    correct: ['c'],
    explanation: 'Sprints run on cadence. Self-managing teams make decisions with available information. "BEST" points to the option that preserves both Scrum\'s cadence and the team\'s self-management.',
    distractors: {
      a: 'Pausing violates Sprint cadence. Empirical process requires continuing with available information.',
      b: 'Temporary POs create unclear accountability. The accountable PO remains accountable; others may temporarily help make decisions but don\'t inherit the role.',
      d: 'The SM cannot own PO decisions — the two accountabilities are distinct.',
    },
  },
  {
    id: 'b_po5', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'Which statement about the Product Owner is ALWAYS true?',
    options: [
      { id: 'a', t: 'The Product Owner writes all Product Backlog items personally.' },
      { id: 'b', t: 'The Product Owner has authority to overrule Developer estimates.' },
      { id: 'c', t: 'The Product Owner is one person, not a committee.' },
      { id: 'd', t: 'The Product Owner attends every Daily Scrum.' },
    ],
    correct: ['c'],
    explanation: '"ALWAYS" is the weasel word. Only one of these is always true. A, B, and D are each sometimes-true-sometimes-false depending on context or outright wrong. The PO being one person, not a committee, is a hard rule in the Scrum Guide.',
    distractors: {
      a: 'The PO can delegate the writing; they remain accountable for clarity.',
      b: 'Estimates belong to the Developers. The PO has no overrule authority.',
      d: 'Daily Scrum attendance is never required for the PO — only Developers.',
    },
  },
  {
    id: 'b_po6', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'The Developers consistently push back on the Product Owner\'s ordering of the Product Backlog, arguing technical concerns should drive ordering. Which is the MOST appropriate response?',
    options: [
      { id: 'a', t: 'The Product Owner should defer to the Developers on ordering because they understand technical complexity.' },
      { id: 'b', t: 'The Product Owner orders the Product Backlog; they consider Developer input, including technical concerns, but make the final call based on value.' },
      { id: 'c', t: 'The Scrum Master should mediate the dispute and propose a compromise ordering.' },
      { id: 'd', t: 'The Product Owner should split ordering with the Developers 50/50 to respect self-management.' },
    ],
    correct: ['b'],
    explanation: 'Ordering is the PO\'s accountability. Developer input matters — but input and authority are different things. "MOST appropriate" points to the option that preserves clear accountability without ignoring collaboration.',
  },
  {
    id: 'b_sm1', concept: 'scrum_master', type: 'single', difficulty: 'brutal',
    q: 'All of the following are Scrum Master responsibilities EXCEPT:',
    options: [
      { id: 'a', t: 'Coaching the team in self-management and cross-functionality.' },
      { id: 'b', t: 'Ensuring all Scrum events take place and are productive.' },
      { id: 'c', t: 'Assigning tasks to Developers to optimize team efficiency.' },
      { id: 'd', t: 'Helping the Product Owner find techniques for effective Product Backlog management.' },
    ],
    correct: ['c'],
    explanation: 'EXCEPT = find the wrong one. Assigning tasks to Developers violates self-management. The other three are in the Scrum Guide\'s list of SM responsibilities almost word-for-word.',
  },
  {
    id: 'b_sm2', concept: 'scrum_master', type: 'single', difficulty: 'brutal',
    q: 'A new Scrum Master observes that the Daily Scrum consistently runs long, averaging 30 minutes. What should they do FIRST?',
    options: [
      { id: 'a', t: 'Take over facilitation to enforce the 15-minute timebox.' },
      { id: 'b', t: 'Raise the issue at the next Sprint Retrospective for the team to discuss.' },
      { id: 'c', t: 'Observe further to understand why the Daily Scrum is running long before intervening.' },
      { id: 'd', t: 'Explain the 15-minute timebox to the Developers and ask them how they want to address it.' },
    ],
    correct: ['d'],
    explanation: '"FIRST" = immediate next step. All four are defensible, but the best-first-move combines education (the timebox is a rule) with self-management (the team decides how to fix it). A is too interventionist; B defers too long; C observes but doesn\'t act.',
    distractors: {
      a: 'Taking over facilitation violates self-management and positions the SM as running the event.',
      b: 'The Retro is the right venue for process issues, but waiting two weeks when the issue is daily is too slow.',
      c: 'Observation alone doesn\'t fulfill the SM\'s teaching responsibility for the framework.',
    },
  },
  {
    id: 'b_sm3', concept: 'scrum_master', type: 'single', difficulty: 'brutal',
    q: 'Which of the following is the LEAST appropriate response by a Scrum Master when the Developers ask them to facilitate a complex technical discussion?',
    options: [
      { id: 'a', t: 'Facilitate the conversation while staying neutral on technical content.' },
      { id: 'b', t: 'Decline, noting that technical decisions belong to the Developers alone.' },
      { id: 'c', t: 'Make the technical decision on the team\'s behalf to save time.' },
      { id: 'd', t: 'Help the team identify a facilitation technique they can use themselves.' },
    ],
    correct: ['c'],
    explanation: 'LEAST appropriate. The SM may facilitate (a) without deciding technical content. Declining (b) is valid. Coaching self-facilitation (d) is also valid. Making the decision violates self-management.',
  },
  {
    id: 'b_sm4', concept: 'scrum_master', type: 'single', difficulty: 'brutal',
    q: 'Which is TYPICALLY the BEST way for a Scrum Master to resolve a persistent conflict between two Developers?',
    options: [
      { id: 'a', t: 'Escalate the conflict to the Developers\' functional manager.' },
      { id: 'b', t: 'Mediate a conversation and propose a resolution both can accept.' },
      { id: 'c', t: 'Coach the Developers on techniques for resolving the conflict themselves, intervening directly only if necessary.' },
      { id: 'd', t: 'Ask the Product Owner to address it since it is affecting Sprint outcomes.' },
    ],
    correct: ['c'],
    explanation: '"TYPICALLY the BEST" rules out both the most interventionist and the most hands-off options. Self-management is the default; direct intervention is a fallback. B is too heavy-handed on first attempt; A and D transfer the problem.',
  },
  {
    id: 'b_dev1', concept: 'developers', type: 'single', difficulty: 'brutal',
    q: 'A Developer on a Scrum Team primarily works on database administration. During Sprint Planning, she notices that no database work is required for the upcoming Sprint. What is the MOST appropriate response?',
    options: [
      { id: 'a', t: 'She should not select any items for this Sprint, since no database work applies.' },
      { id: 'b', t: 'She should pair with other Developers on items outside her specialty to support the Sprint Goal.' },
      { id: 'c', t: 'She should ask the Product Owner to add database work to the Sprint Backlog.' },
      { id: 'd', t: 'She should use the Sprint for personal training in a new database technology.' },
    ],
    correct: ['b'],
    explanation: 'Cross-functionality means the TEAM collectively has all skills. Developers aren\'t locked to specialties — they support the Sprint Goal. The other options either idle the Developer (a, d) or distort the Backlog (c).',
  },
  {
    id: 'b_dev2', concept: 'developers', type: 'single', difficulty: 'brutal',
    q: 'Per the 2020 Scrum Guide, who is accountable for creating a valuable, useful Increment every Sprint?',
    options: [
      { id: 'a', t: 'The Product Owner, who determines what is valuable.' },
      { id: 'b', t: 'The Scrum Master, who ensures quality practices are followed.' },
      { id: 'c', t: 'The Developers, who adhere to the Definition of Done.' },
      { id: 'd', t: 'The entire Scrum Team.' },
    ],
    correct: ['d'],
    explanation: 'Direct from the 2020 Scrum Guide: "The entire Scrum Team is accountable for creating a valuable, useful Increment every Sprint." The Developers INSTILL quality by adhering to the DoD — that is their specific responsibility. But accountability for the Increment itself belongs to the whole Scrum Team. This distinction is a classic exam trap: people pattern-match to "Developers do the work" and miss that accountability is collective.',
    distractors: {
      a: 'The PO determines value but is not solely accountable for the Increment\'s existence.',
      b: 'The SM ensures Scrum is used well but has no accountability for the Increment.',
      c: 'Developers INSTILL quality (via the DoD) — that is a specific responsibility. But accountability for a valuable, useful Increment is the whole Scrum Team\'s. Confusing "instills quality" with "is accountable for the Increment" is the exact trap the exam sets.',
    },
  },
  {
    id: 'b_dev3', concept: 'developers', type: 'single', difficulty: 'brutal',
    q: 'Which of the following is NOT a responsibility of the Developers per the 2020 Scrum Guide?',
    options: [
      { id: 'a', t: 'Creating a plan for the Sprint, the Sprint Backlog.' },
      { id: 'b', t: 'Instilling quality by adhering to a Definition of Done.' },
      { id: 'c', t: 'Ordering the Product Backlog to optimize value delivery.' },
      { id: 'd', t: 'Holding each other accountable as professionals.' },
    ],
    correct: ['c'],
    explanation: 'NOT = find the wrong one. Ordering the PB is the Product Owner\'s accountability. The other three are word-for-word Developer responsibilities in the Scrum Guide.',
  },
  {
    id: 'b_pb1', concept: 'product_backlog', type: 'single', difficulty: 'brutal',
    q: 'The Product Backlog is BEST described as:',
    options: [
      { id: 'a', t: 'A prioritized list of requirements for the product.' },
      { id: 'b', t: 'An emergent, ordered list of what is needed to improve the product.' },
      { id: 'c', t: 'A comprehensive document of all product features to be delivered.' },
      { id: 'd', t: 'A roadmap showing when each product feature will be released.' },
    ],
    correct: ['b'],
    explanation: '"BEST" = match the Scrum Guide\'s exact language. "Emergent, ordered" is the 2020 Guide\'s phrasing. "Prioritized" (a) is wrong — ordering is more specific than prioritization. "Comprehensive document" (c) contradicts emergence. "Roadmap with dates" (d) contradicts both emergence and ordering.',
    distractors: {
      a: 'Prioritized allows ties; ordered does not. The Scrum Guide says ordered, not prioritized.',
      c: 'A "comprehensive document" implies completeness — the Product Backlog is never complete.',
      d: 'A dated roadmap implies a fixed future; the Backlog is emergent.',
    },
  },
  {
    id: 'b_pb2', concept: 'product_backlog', type: 'single', difficulty: 'brutal',
    q: 'All of the following are considerations for ordering the Product Backlog EXCEPT:',
    options: [
      { id: 'a', t: 'Value the items will bring to users or the business.' },
      { id: 'b', t: 'Risks that earlier work would retire.' },
      { id: 'c', t: 'The preferred technology stack of the Developers.' },
      { id: 'd', t: 'Dependencies between items.' },
    ],
    correct: ['c'],
    explanation: 'EXCEPT = find what doesn\'t belong. Technology preferences of the Developers don\'t drive ordering. Value, risk, and dependencies are all valid (and Scrum Guide-mentioned) considerations.',
  },
  {
    id: 'b_pb3', concept: 'product_backlog', type: 'single', difficulty: 'brutal',
    q: 'Which statement about Product Backlog refinement is MOST accurate according to the 2020 Scrum Guide?',
    options: [
      { id: 'a', t: 'Refinement is a mandatory Scrum event conducted weekly.' },
      { id: 'b', t: 'Refinement is an ongoing activity, not a formal Scrum event.' },
      { id: 'c', t: 'Refinement is performed exclusively by the Product Owner between Sprints.' },
      { id: 'd', t: 'Refinement produces a Definition of Ready that gates Sprint Planning.' },
    ],
    correct: ['b'],
    explanation: '"MOST accurate" vs the Scrum Guide. Refinement is explicitly not an event — it\'s an ongoing activity. A frames it as an event; C narrows it to the PO alone (wrong — the whole team refines); D introduces Definition of Ready which isn\'t a Scrum concept.',
  },
  {
    id: 'b_pb4', concept: 'product_backlog', type: 'single', difficulty: 'brutal',
    q: 'The Product Owner is accountable for the Product Backlog. This means the Product Owner is responsible for:',
    options: [
      { id: 'a', t: 'Personally writing every Product Backlog item in detail before Sprint Planning.' },
      { id: 'b', t: 'Approving Developer estimates on each item before ordering.' },
      { id: 'c', t: 'The effectiveness of Product Backlog management; they may delegate the work but remain accountable.' },
      { id: 'd', t: 'Presenting the Product Backlog at every Sprint Review for stakeholder approval.' },
    ],
    correct: ['c'],
    explanation: 'The distinction between "accountable" and "does the work" is exam-critical. The PO delegates freely; accountability stays. The other options conflate doing the work with owning the outcome.',
  },
  // END BRUTAL CHUNK 1

  {
    id: 'b_ev1', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'Which is the PRIMARY purpose of the Daily Scrum?',
    options: [
      { id: 'a', t: 'To report status to the Scrum Master and Product Owner.' },
      { id: 'b', t: 'To coordinate work between Developers and identify blockers.' },
      { id: 'c', t: 'To inspect progress toward the Sprint Goal and adapt the Sprint Backlog.' },
      { id: 'd', t: 'To ensure every Developer is aware of what the others are doing.' },
    ],
    correct: ['c'],
    explanation: '"PRIMARY" = Scrum Guide\'s stated purpose. Inspect-and-adapt toward the Sprint Goal is the exact purpose. The other options describe side effects (coordination, awareness) or anti-patterns (status reporting).',
    distractors: {
      a: 'Status reporting is an anti-pattern. The Daily Scrum is for the Developers, not for reporting to others.',
      b: 'Coordination happens, but it\'s an effect — not the purpose. The purpose is inspection toward the Sprint Goal.',
      d: 'Awareness is a side effect. The purpose is adapting the plan, not sharing information.',
    },
  },
  {
    id: 'b_ev2', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'The Sprint Review is BEST described as:',
    options: [
      { id: 'a', t: 'A formal meeting where stakeholders approve or reject the Increment.' },
      { id: 'b', t: 'A demonstration of completed work to all company stakeholders.' },
      { id: 'c', t: 'A working session to inspect the outcome of the Sprint and determine future adaptations.' },
      { id: 'd', t: 'A project status meeting with the Scrum Master and Product Owner.' },
    ],
    correct: ['c'],
    explanation: '"BEST" = Scrum Guide\'s language. "Working session" is the exact 2020 Scrum Guide framing. A ("formal meeting," "approve/reject") is the waterfall framing; B ("demonstration") sounds right but isn\'t what the Guide says; D is irrelevant.',
  },
  {
    id: 'b_ev3', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'All of the following are prescribed Scrum events EXCEPT:',
    options: [
      { id: 'a', t: 'Sprint Planning.' },
      { id: 'b', t: 'Sprint Retrospective.' },
      { id: 'c', t: 'Product Backlog Refinement.' },
      { id: 'd', t: 'Sprint Review.' },
    ],
    correct: ['c'],
    explanation: 'EXCEPT = find what doesn\'t belong. The five Scrum events are Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective. Product Backlog Refinement is an ongoing activity, not an event.',
  },
  {
    id: 'b_ev4', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'Under which condition MAY a Sprint be cancelled?',
    options: [
      { id: 'a', t: 'When the Scrum Team falls behind on the forecast.' },
      { id: 'b', t: 'When stakeholders change their requirements significantly.' },
      { id: 'c', t: 'When the Sprint Goal becomes obsolete.' },
      { id: 'd', t: 'When the Definition of Done cannot be met for selected items.' },
    ],
    correct: ['c'],
    explanation: 'Only when the Sprint Goal becomes obsolete — this is the sole condition in the Scrum Guide. Falling behind, stakeholder changes, and DoD issues are all handled through renegotiation, not cancellation.',
  },
  {
    id: 'b_ev5', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'The Sprint Goal is MOST accurately described as:',
    options: [
      { id: 'a', t: 'A list of items the Developers commit to completing in the Sprint.' },
      { id: 'b', t: 'The single objective for the Sprint, committed to by the Developers.' },
      { id: 'c', t: 'A summary of stakeholder expectations for the Sprint.' },
      { id: 'd', t: 'A target set by the Product Owner for what value will be delivered.' },
    ],
    correct: ['b'],
    explanation: 'Single objective, Developer-committed. A confuses items (forecast) with the Goal (committed). C frames it as stakeholder-driven. D frames it as PO-imposed — it\'s co-created by the whole Scrum Team.',
  },
  {
    id: 'b_ev6', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'Which of the following is the LEAST likely topic for a Sprint Retrospective?',
    options: [
      { id: 'a', t: 'How well the team applied the Definition of Done last Sprint.' },
      { id: 'b', t: 'Specific feature acceptance criteria for the next Sprint.' },
      { id: 'c', t: 'Relationships and interactions among team members.' },
      { id: 'd', t: 'Tools and processes used during the Sprint.' },
    ],
    correct: ['b'],
    explanation: 'LEAST likely = feature acceptance criteria belong in refinement or Sprint Planning, not the Retrospective. The Retro is about the team — individuals, interactions, processes, tools, DoD.',
  },
  {
    id: 'b_ev7', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'Which of the following statements about Sprint Planning is NOT true?',
    options: [
      { id: 'a', t: 'Sprint Planning is timeboxed to a maximum of eight hours for a one-month Sprint.' },
      { id: 'b', t: 'The Product Owner arrives at Sprint Planning with a fully defined Sprint Goal.' },
      { id: 'c', t: 'The Developers select items from the Product Backlog for the Sprint.' },
      { id: 'd', t: 'Sprint Planning addresses why the Sprint is valuable, what can be done, and how.' },
    ],
    correct: ['b'],
    explanation: 'NOT = find the false one. The Sprint Goal is CRAFTED during Sprint Planning, not brought to it by the PO. The PO brings business context; the Goal is co-created.',
  },
  {
    id: 'b_ac1', concept: 'artifacts_commitments', type: 'single', difficulty: 'brutal',
    q: 'Which of the following is MOST accurate about the Definition of Done?',
    options: [
      { id: 'a', t: 'The Product Owner defines it to ensure quality expectations are met.' },
      { id: 'b', t: 'It is a formal description of the state of the Increment when it meets the required quality measures.' },
      { id: 'c', t: 'It lists acceptance criteria for each Product Backlog item.' },
      { id: 'd', t: 'It is a checklist of tests the Developers must run before releasing.' },
    ],
    correct: ['b'],
    explanation: '"MOST accurate" = match the Scrum Guide. B is the exact definition. A wrongly attributes it to the PO. C confuses it with per-item acceptance criteria. D narrows it to just tests.',
  },
  {
    id: 'b_ac2', concept: 'artifacts_commitments', type: 'single', difficulty: 'brutal',
    q: 'Which commitment is associated with the Sprint Backlog?',
    options: [
      { id: 'a', t: 'Product Goal.' },
      { id: 'b', t: 'Definition of Done.' },
      { id: 'c', t: 'Sprint Goal.' },
      { id: 'd', t: 'Definition of Ready.' },
    ],
    correct: ['c'],
    explanation: 'Memorize the three pairings: Product Backlog → Product Goal; Sprint Backlog → Sprint Goal; Increment → Definition of Done. Definition of Ready is not a Scrum concept.',
  },
  {
    id: 'b_ac3', concept: 'artifacts_commitments', type: 'single', difficulty: 'brutal',
    q: 'When during a Sprint is it MOST appropriate to change the Definition of Done?',
    options: [
      { id: 'a', t: 'During Sprint Planning, as the team forecasts.' },
      { id: 'b', t: 'During the Daily Scrum, if needed.' },
      { id: 'c', t: 'During the Sprint Retrospective.' },
      { id: 'd', t: 'When the Product Owner requests it.' },
    ],
    correct: ['c'],
    explanation: 'The Retrospective. Changing DoD mid-Sprint would invalidate work already completed against the prior DoD. "MOST appropriate" points to the venue for process adjustment.',
  },
  {
    id: 'b_ac4', concept: 'artifacts_commitments', type: 'single', difficulty: 'brutal',
    q: 'Which statement about the Increment is ALWAYS true?',
    options: [
      { id: 'a', t: 'An Increment is released to customers at the end of every Sprint.' },
      { id: 'b', t: 'An Increment must meet the Definition of Done to be usable.' },
      { id: 'c', t: 'Only one Increment may exist per Sprint.' },
      { id: 'd', t: 'The Product Owner personally verifies each Increment before it is presented.' },
    ],
    correct: ['b'],
    explanation: '"ALWAYS true" — DoD compliance is the universal requirement. A confuses usable with released (release is a PO decision). C is false (multiple Increments per Sprint are allowed). D is false (DoD compliance, not PO verification, gates the Increment).',
  },
  {
    id: 'b_sb1', concept: 'sprint_backlog', type: 'single', difficulty: 'brutal',
    q: 'The Sprint Backlog is MOST accurately characterized as:',
    options: [
      { id: 'a', t: 'A fixed plan of tasks committed to at Sprint Planning.' },
      { id: 'b', t: 'A real-time, emergent plan composed of the Sprint Goal, selected items, and how to deliver them.' },
      { id: 'c', t: 'A list of features the Product Owner requires by Sprint end.' },
      { id: 'd', t: 'A task board visible to the Scrum Team and stakeholders.' },
    ],
    correct: ['b'],
    explanation: '"MOST accurately" = Scrum Guide\'s language. "Real-time, emergent" + three parts (Goal, selected items, plan). A treats it as fixed; C attributes it to the PO; D describes a visualization tool, not the artifact itself.',
  },
  {
    id: 'b_sb2', concept: 'sprint_backlog', type: 'single', difficulty: 'brutal',
    q: 'Who has authority to update the Sprint Backlog during a Sprint?',
    options: [
      { id: 'a', t: 'Only the Product Owner, with Developer input.' },
      { id: 'b', t: 'The Scrum Master, when impediments arise.' },
      { id: 'c', t: 'The Developers — they own the Sprint Backlog.' },
      { id: 'd', t: 'Anyone on the Scrum Team, as long as the Sprint Goal is preserved.' },
    ],
    correct: ['c'],
    explanation: 'The Developers own the Sprint Backlog exclusively. D sounds democratic but is wrong — the PO and SM don\'t have direct authority to modify it. Negotiation with the PO happens through collaboration, not unilateral update.',
  },
  {
    id: 'b_sc1', concept: 'scaling', type: 'single', difficulty: 'brutal',
    q: 'When six Scrum Teams work on a single product, which statement is TRUE?',
    options: [
      { id: 'a', t: 'Each team has its own Product Owner who coordinates with a Chief Product Owner.' },
      { id: 'b', t: 'The teams share one Product Backlog and one Product Owner.' },
      { id: 'c', t: 'Each team maintains its own Product Backlog aligned to a shared Product Vision.' },
      { id: 'd', t: 'Teams should normalize estimates so management can compare performance.' },
    ],
    correct: ['b'],
    explanation: 'One product = one PO, one Backlog. No matter how many teams. A introduces a "Chief PO" (not Scrum). C fragments the Backlog (anti-pattern). D normalizes estimates (anti-pattern).',
  },
  {
    id: 'b_sc2', concept: 'scaling', type: 'single', difficulty: 'brutal',
    q: 'Which of the following is LEAST compatible with Scrum when scaling to multiple teams?',
    options: [
      { id: 'a', t: 'Multiple teams integrating their work into a combined Increment each Sprint.' },
      { id: 'b', t: 'Teams self-managing their cross-team coordination.' },
      { id: 'c', t: 'Assigning a dedicated Integration Manager to oversee cross-team dependencies.' },
      { id: 'd', t: 'Sharing one Definition of Done across all teams working on the product.' },
    ],
    correct: ['c'],
    explanation: 'LEAST compatible = anti-pattern. "Integration Manager" imposes external coordination and violates self-management. The other three are all core Scrum scaling patterns.',
  },
  {
    id: 'b_st1', concept: 'scrum_theory', type: 'single', difficulty: 'brutal',
    q: 'Scrum is BEST characterized as:',
    options: [
      { id: 'a', t: 'A methodology for iterative software development.' },
      { id: 'b', t: 'A lightweight framework for generating value through adaptive solutions to complex problems.' },
      { id: 'c', t: 'A process for managing product development with predefined practices.' },
      { id: 'd', t: 'A set of best practices for Agile teams.' },
    ],
    correct: ['b'],
    explanation: '"BEST" = the Scrum Guide\'s opening definition. "Framework" (not methodology, process, or best practices). "Adaptive solutions to complex problems" (not just software, not just iteration).',
  },
  {
    id: 'b_st2', concept: 'scrum_theory', type: 'single', difficulty: 'brutal',
    q: 'Which is NOT one of the three pillars of empiricism in Scrum?',
    options: [
      { id: 'a', t: 'Transparency.' },
      { id: 'b', t: 'Commitment.' },
      { id: 'c', t: 'Inspection.' },
      { id: 'd', t: 'Adaptation.' },
    ],
    correct: ['b'],
    explanation: 'The three pillars are Transparency, Inspection, Adaptation. Commitment is a VALUE, not a pillar. The exam loves to swap these.',
  },
  {
    id: 'b_stm1', concept: 'scrum_team', type: 'single', difficulty: 'brutal',
    q: 'Which statement about Scrum Team size is MOST consistent with the 2020 Scrum Guide?',
    options: [
      { id: 'a', t: 'A Scrum Team must have 3 to 9 Developers plus a Product Owner and Scrum Master.' },
      { id: 'b', t: 'A Scrum Team typically has 10 or fewer people total.' },
      { id: 'c', t: 'A Scrum Team should have exactly 7 members, plus or minus 2.' },
      { id: 'd', t: 'A Scrum Team must have at least 5 people to be effective.' },
    ],
    correct: ['b'],
    explanation: 'The 2020 Scrum Guide removed the old "3 to 9 Developers" rule and replaced it with "typically 10 or fewer people" total. Pre-2020 study materials still often cite the old rule — this is a common trap.',
  },
  {
    id: 'b_stm2', concept: 'scrum_team', type: 'single', difficulty: 'brutal',
    q: 'All of the following are true about the Scrum Team EXCEPT:',
    options: [
      { id: 'a', t: 'It is cross-functional, with all skills necessary to create value each Sprint.' },
      { id: 'b', t: 'It is self-managing and internally decides who does what, when, and how.' },
      { id: 'c', t: 'It consists of sub-teams organized by technical specialty.' },
      { id: 'd', t: 'It focuses on one objective at a time — the Product Goal.' },
    ],
    correct: ['c'],
    explanation: 'EXCEPT = find the false statement. The Scrum Guide explicitly rules out sub-teams and hierarchies within a Scrum Team. The other three are core characteristics.',
  },
  {
    id: 'b_po7', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'A stakeholder insists that a specific Product Backlog item be completed by a fixed date. What is the MOST appropriate Product Owner response?',
    options: [
      { id: 'a', t: 'Commit to the date and ensure the Developers prioritize the item.' },
      { id: 'b', t: 'Explain that the Developers decide Sprint scope and defer to them.' },
      { id: 'c', t: 'Discuss the stakeholder\'s goal, communicate the trade-offs, and make an informed ordering decision.' },
      { id: 'd', t: 'Refuse the request since fixed dates conflict with empirical planning.' },
    ],
    correct: ['c'],
    explanation: 'PO accountability = value maximization through informed trade-offs. A abdicates value judgment to the stakeholder. B abdicates to Developers. D is ideologically pure but unhelpful. C is the real PO behavior: understand the need, weigh it, decide.',
  },
  {
    id: 'b_pb5', concept: 'product_backlog', type: 'single', difficulty: 'brutal',
    q: 'Which statement about Product Backlog items is MOST accurate?',
    options: [
      { id: 'a', t: 'All items must have acceptance criteria before Sprint Planning.' },
      { id: 'b', t: 'Items selected for a Sprint must be small enough to fit within that Sprint.' },
      { id: 'c', t: 'All items must be estimated in story points.' },
      { id: 'd', t: 'Items at the bottom of the Product Backlog must be as detailed as those at the top.' },
    ],
    correct: ['b'],
    explanation: '"MOST accurate" = match the Scrum Guide. Items selected for a Sprint should be small enough to fit. A (acceptance criteria mandate) and C (story points mandate) introduce non-Scrum requirements. D reverses the correct gradient (top items are more detailed).',
  },
  {
    id: 'b_sm5', concept: 'scrum_master', type: 'single', difficulty: 'brutal',
    q: 'A manager outside the Scrum Team asks the Scrum Master for a weekly status report on individual Developer progress. What should the Scrum Master do?',
    options: [
      { id: 'a', t: 'Create the report to maintain good relationships with stakeholders.' },
      { id: 'b', t: 'Ask the Developers to provide the information, then compile the report.' },
      { id: 'c', t: 'Coach the manager on how Scrum provides transparency via the Increment and Product Backlog.' },
      { id: 'd', t: 'Redirect the manager to the Product Owner who handles stakeholder communication.' },
    ],
    correct: ['c'],
    explanation: 'The Scrum Master serves the organization by teaching Scrum. Coaching the manager on where real transparency lives (the Increment, the Backlog) is the right move. A and B comply with anti-patterns. D passes the buck without addressing the misunderstanding.',
  },
  {
    id: 'b_ev8', concept: 'events', type: 'single', difficulty: 'brutal',
    q: 'Which statement about the Daily Scrum is NOT true according to the 2020 Scrum Guide?',
    options: [
      { id: 'a', t: 'It is for the Developers.' },
      { id: 'b', t: 'It is timeboxed to 15 minutes.' },
      { id: 'c', t: 'Developers must answer three questions: what they did, what they will do, and any impediments.' },
      { id: 'd', t: 'It takes place every working day of the Sprint.' },
    ],
    correct: ['c'],
    explanation: 'NOT = find the false statement. The 2020 Scrum Guide REMOVED the "three questions" format. Teams are free to structure the Daily Scrum however serves them, as long as it inspects progress toward the Sprint Goal.',
  },
  {
    id: 'b_po8', concept: 'product_owner', type: 'single', difficulty: 'brutal',
    q: 'Which of the following does the Product Owner ALWAYS do?',
    options: [
      { id: 'a', t: 'Personally writes every Product Backlog item.' },
      { id: 'b', t: 'Attends every Daily Scrum.' },
      { id: 'c', t: 'Remains accountable for Product Backlog management regardless of delegation.' },
      { id: 'd', t: 'Approves every item completed by the Developers.' },
    ],
    correct: ['c'],
    explanation: '"ALWAYS" = the universal truth. A may be delegated. B only when actively working on Sprint Backlog items. D isn\'t a PO responsibility (the DoD governs completion). Accountability is the one thing that never moves.',
  },
  {
    id: 'b_dev4', concept: 'developers', type: 'single', difficulty: 'brutal',
    q: 'Which statement about estimation is MOST consistent with Scrum?',
    options: [
      { id: 'a', t: 'The Product Owner estimates items to enable release planning.' },
      { id: 'b', t: 'The Scrum Master facilitates estimation using Planning Poker.' },
      { id: 'c', t: 'The Developers estimate the size of Product Backlog items.' },
      { id: 'd', t: 'Estimates are normalized across teams for cross-team comparison.' },
    ],
    correct: ['c'],
    explanation: 'Who does the work estimates the work. The Scrum Guide is explicit: Developers size items. A wrongly attributes estimation to the PO. B adds Planning Poker (one technique, not prescribed). D introduces cross-team normalization (anti-pattern).',
  },

  // ═══════════ SCENARIO QUESTIONS — multi-paragraph judgment calls where all options look plausible ═══════════
  // These test applied judgment, not recall. The correct answer upholds Scrum values (servant leadership,
  // self-management, transparency, empiricism) — often the option that feels LEAST decisive.

  {
    id: 's_po1', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are the Product Owner for a fintech mobile app. A senior executive from your organization's compliance department has contacted you directly, insisting that a specific regulatory-reporting feature be added to the current Sprint, which has three days remaining. The feature is real, the regulatory deadline is six weeks away, and the compliance director has escalated to your VP.

The current Sprint Goal is "enable two-factor authentication for new customer signups." The Developers are on track to meet it. Adding the compliance feature now would require replacing about 30% of the current Sprint Backlog.`,
    q: 'What is the MOST appropriate response?',
    options: [
      { id: 'a', t: 'Accept the compliance request and work with the Developers to replace the current Sprint Backlog items — regulatory deadlines are non-negotiable.' },
      { id: 'b', t: 'Add the compliance feature to the top of the Product Backlog for the next Sprint, and discuss the trade-off transparently with the compliance director and VP.' },
      { id: 'c', t: 'Split the difference: keep the 2FA Sprint Goal but add the compliance feature as an additional scope item for this Sprint.' },
      { id: 'd', t: 'Ask the Scrum Master to explain to the compliance director that the Sprint Goal cannot change mid-Sprint.' },
    ],
    correct: ['b'],
    explanation: 'Six weeks is plenty of runway for the next Sprint. Replacing 30% of the current Sprint would jeopardize the Sprint Goal already committed to. The PO\'s job here is to maximize value across BOTH objectives — which means keeping the 2FA Sprint intact while queuing the compliance feature for the next Sprint, and owning the stakeholder communication personally. Option A sacrifices a committed Sprint Goal unnecessarily. Option C overloads the Sprint (stuffing two goals into one). Option D delegates stakeholder management to the SM — not their job.',
    distractors: {
      a: 'The regulatory deadline is six weeks out; the current Sprint ends in three days. There\'s no actual emergency justifying scrapping a committed Sprint Goal.',
      c: 'Two goals in one Sprint is not focus — it\'s overloading. Sprint Goals are single objectives for a reason.',
      d: 'Stakeholder communication is PO accountability. Pushing it to the SM is an abdication and also misses the opportunity to educate the stakeholder on how Scrum handles urgent requests.',
    },
  },

  {
    id: 's_sm1', concept: 'scrum_master', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master for a team of 7 Developers. Over the last three Sprints, you've noticed that two senior Developers dominate the Daily Scrum and Sprint Planning conversations. The other five, mostly less experienced, have gradually stopped contributing — they answer when asked direct questions but rarely volunteer ideas.

At yesterday's Sprint Review, a stakeholder remarked that the team "seems to have lost its energy." The Product Owner has separately asked you whether the team is performing as well as it could.`,
    q: 'What is the BEST action?',
    options: [
      { id: 'a', t: 'At the next Daily Scrum, set a rule that each Developer must speak in turn to ensure equal participation.' },
      { id: 'b', t: 'Have private conversations with the two senior Developers and ask them to create space for others.' },
      { id: 'c', t: 'Raise the pattern at the next Sprint Retrospective without naming individuals, and let the team decide how to address it.' },
      { id: 'd', t: 'Ask the Product Owner to have a conversation with the team about participation during Sprint Planning.' },
    ],
    correct: ['c'],
    explanation: 'This is a self-management opportunity, not a coaching failure to fix directly. The Retrospective is the designed venue for team dynamics. By raising the pattern (without names) and letting the team own the response, you strengthen self-management. Option A imposes structure from outside — violates self-management. Option B goes behind the team\'s back and treats the two seniors as the "problem" rather than a team dynamic. Option D transfers the work to the PO, who doesn\'t own team dynamics.',
    distractors: {
      a: 'Mandating a speaking order imposes process from outside the team. It may fix the symptom but undermines the self-management muscle you want to build.',
      b: 'Private one-on-ones can sometimes be right, but here the pattern is a team dynamic that the team should notice and address collectively.',
      d: 'The PO doesn\'t own team dynamics — that\'s Scrum Master territory, and within that, a self-managing team territory.',
    },
  },

  {
    id: 's_po2', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are the Product Owner. During today's Daily Scrum (which you attended because you were working on a Sprint Backlog item), one of the Developers mentioned they have been blocked for two days waiting for clarification on a user story. You had provided what you thought was a sufficient description during Sprint Planning.

After the Daily Scrum, you check the item and realize the Developer has been working on a related but incorrect interpretation for nearly two days.`,
    q: 'What should you do FIRST?',
    options: [
      { id: 'a', t: 'Sit down with the Developer now to clarify the intent and help them re-plan the work.' },
      { id: 'b', t: 'Raise the issue at the next Sprint Retrospective so the team can improve clarification practices.' },
      { id: 'c', t: 'Rewrite the Product Backlog item with more detail and ask the Developer to restart.' },
      { id: 'd', t: 'Ask the Scrum Master to investigate why the Developer didn\'t reach out for clarification sooner.' },
    ],
    correct: ['a'],
    explanation: '"FIRST" = immediate. The Developer has been on the wrong path for two days; two more days of delay to wait for a Retrospective isn\'t acceptable. Direct PO-Developer collaboration is the Scrum pattern. Option B defers a fixable problem. Option C treats it as a documentation problem when it\'s a conversation problem. Option D blames the Developer instead of taking PO ownership of clarity.',
  },

  {
    id: 's_sm2', concept: 'scrum_master', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master for a team that has been working together for six months. The Product Owner has started, over the last two Sprints, to attend Daily Scrums and assign specific items to individual Developers — sometimes reorganizing the Sprint Backlog during the Daily itself.

The Developers haven't objected, but you sense passive disengagement. Two Developers have privately mentioned they feel "micromanaged." The Product Owner believes they are being helpful and responsive.`,
    q: 'Which is the BEST course of action?',
    options: [
      { id: 'a', t: 'Intervene during the next Daily Scrum when the PO starts assigning work, reminding them that the Sprint Backlog belongs to the Developers.' },
      { id: 'b', t: 'Have a private, coaching conversation with the PO about the Developer accountabilities and the purpose of the Daily Scrum.' },
      { id: 'c', t: 'Raise the issue in the next Sprint Retrospective so the whole Scrum Team can discuss it openly.' },
      { id: 'd', t: 'Ask the two disengaged Developers to raise their concerns directly with the Product Owner.' },
    ],
    correct: ['b'],
    explanation: 'Serving the PO includes coaching them when their behavior violates Scrum — done privately, in a way that educates rather than publicly corrects. Option A is correct on substance but embarrasses the PO in front of the team. Option C is OK but delays fixing a daily problem to a biweekly event; also risks the Developers feeling exposed. Option D pushes the coaching work onto the Developers, who may not have the skills or standing to redirect the PO.',
  },

  {
    id: 's_po3', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are the Product Owner for a SaaS product. The product has been live for 18 months. Your current Product Goal is "become the default choice for mid-market accounting teams in the DACH region." You've built steady traction.

A major enterprise prospect (10x your current average deal size) has offered to sign a $2M contract if you can deliver three enterprise-specific features within four months. The features don't align with your Product Goal — they target a different market segment — but the revenue would be transformative.

Your CEO is enthusiastic. Your sales team is already drafting the contract.`,
    q: 'What is the MOST appropriate PO response?',
    options: [
      { id: 'a', t: 'Accept the contract and pivot the Product Backlog to prioritize the enterprise features — revenue is the ultimate measure of product value.' },
      { id: 'b', t: 'Decline to add the features, protecting the current Product Goal — consistency matters more than individual deals.' },
      { id: 'c', t: 'Have an explicit conversation with the CEO and sales team about the trade-off: either the current Product Goal changes (to include enterprise) or the opportunity passes. Then make the decision transparent and own it.' },
      { id: 'd', t: 'Accept the contract but set the Product Goal aside temporarily while the enterprise work is delivered, resuming the mid-market focus afterward.' },
    ],
    correct: ['c'],
    explanation: 'The PO\'s job is value-maximization, but also transparency and informed trade-offs. This scenario isn\'t "accept or decline" — it\'s "we cannot serve two Product Goals at once; which one do we pursue, and what do we give up." Making the trade-off explicit, collecting the organization\'s input, and then owning the decision is the PO behavior. Option A treats revenue as the only value. Option B protects process but may sacrifice a better opportunity. Option D pretends the Product Goal can be "paused" — it can\'t; Scrum Teams focus on one goal at a time.',
    distractors: {
      a: 'Revenue is a value dimension, but not the only one. Single-deal revenue from a non-target market segment may actually hurt long-term product value.',
      b: 'Protecting the Product Goal absolutely can be right, but refusing without exploring the trade-off is abdication of judgment.',
      d: 'You cannot pause a Product Goal. One goal at a time means either you commit to a new one or you commit to the existing one — pretending to do both is the anti-pattern.',
    },
  },

  {
    id: 's_dev1', concept: 'developers', type: 'single', difficulty: 'scenario',
    context: `Your Scrum Team is in the middle of a Sprint. You are a Developer. During implementation, you discover that a Product Backlog Item you're working on will require approximately three times more effort than originally estimated due to a technical complexity nobody anticipated. You still think you can deliver the Sprint Goal, but one or two other items in the Sprint Backlog will likely slip.

The Product Owner is currently in a stakeholder meeting and not available for the next few hours.`,
    q: 'What is the BEST immediate action?',
    options: [
      { id: 'a', t: 'Wait until the Product Owner is available, then raise the issue privately.' },
      { id: 'b', t: 'Raise it at tomorrow\'s Daily Scrum so the whole Scrum Team can discuss.' },
      { id: 'c', t: 'Update the Sprint Backlog to reflect the new estimate and discuss with the other Developers; flag it for the PO as soon as they\'re available.' },
      { id: 'd', t: 'Descope the at-risk items yourself and focus on what\'s essential for the Sprint Goal.' },
    ],
    correct: ['c'],
    explanation: 'The Sprint Backlog belongs to the Developers and updates as they learn. Making the new information visible on the Sprint Backlog (transparency) and syncing with fellow Developers (self-management) should happen immediately. The PO conversation happens as soon as possible — not "wait days." Option A delays visibility. Option B waits until the Daily. Option D makes a unilateral scope decision that properly belongs to the PO-Developers collaboration.',
  },

  {
    id: 's_sm3', concept: 'scrum_master', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master for a new Scrum Team that has completed three Sprints. The Developers are competent but have never worked in Scrum. They treat the Sprint Goal as optional guidance — three times now, they've ended Sprints with most items done but the Sprint Goal unmet.

The Product Owner, who is experienced in Scrum, is frustrated. The Developers are frustrated that the PO keeps "fixating on the Sprint Goal when we got most of the work done."`,
    q: 'Which is the BEST first intervention?',
    options: [
      { id: 'a', t: 'Run a focused coaching session with the Developers on why the Sprint Goal is the commitment and why item completion is secondary.' },
      { id: 'b', t: 'Facilitate a joint conversation between the Developers and the Product Owner about what the Sprint Goal means and how Sprints are evaluated.' },
      { id: 'c', t: 'At the next Sprint Planning, insist the Developers articulate how each selected item serves the Sprint Goal before they can finalize the forecast.' },
      { id: 'd', t: 'Let the pattern continue for another Sprint, then raise it in the Retrospective for the team to address.' },
    ],
    correct: ['b'],
    explanation: 'The Developers and PO have different mental models of "success." Teaching one side (a) leaves the other unaligned. Imposing structure (c) addresses the symptom, not the misunderstanding. Waiting (d) lets the pattern calcify. A joint coaching conversation addresses both sides together and builds shared understanding.',
  },

  {
    id: 's_po4', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are a new Product Owner, three months into the role, for a team you inherited. The Product Backlog has 340 items, many of them small bugs and minor enhancements accumulated over two years. Product Backlog Refinement sessions spend most of their time on small items because stakeholders keep asking about them.

Strategic items — the ones that could move the product meaningfully forward — are in the bottom third of the Backlog and never get refined.`,
    q: 'What should you do?',
    options: [
      { id: 'a', t: 'Close all bug-tracking items older than six months to clean up the Backlog.' },
      { id: 'b', t: 'Re-order the Backlog to put strategic items at the top, and communicate the shift to stakeholders.' },
      { id: 'c', t: 'Keep the current ordering but allocate refinement time by category: half to strategic, half to bugs/enhancements.' },
      { id: 'd', t: 'Split the Backlog into a "strategic" backlog and a "maintenance" backlog so each gets appropriate attention.' },
    ],
    correct: ['b'],
    explanation: 'Ordering is the PO\'s accountability and the main tool for directing attention. If strategic items are being ignored, the Backlog\'s order is wrong — fix that first, and stakeholder conversations will follow the new ordering. Option A is a maintenance cleanup but doesn\'t fix ordering. Option C splits refinement time but leaves the ordering that\'s causing the problem. Option D creates separate backlogs — a Scrum anti-pattern that hides dependencies and fragments value discussions.',
    distractors: {
      a: 'Closing old bugs is fine housekeeping but doesn\'t address why strategic work is at the bottom.',
      c: 'Time-allocating refinement to match broken ordering just entrenches the problem.',
      d: 'Two backlogs for one product violates a core Scrum rule. This is a frequent exam trap when teams struggle with a large backlog.',
    },
  },

  {
    id: 's_sm4', concept: 'scrum_master', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master. A manager from another department has emailed you asking for a "quarterly productivity report" with per-Developer metrics: story points completed, tickets closed, hours tracked. The manager wants this for performance review purposes.

This has never been requested before. The Developers don't track hours. Story points are used internally but never compared between individuals.`,
    q: 'What is the BEST response?',
    options: [
      { id: 'a', t: 'Compile the report using best-available data — you want to maintain good relationships with stakeholders outside the team.' },
      { id: 'b', t: 'Respond that Scrum doesn\'t measure individual Developer productivity and decline to provide the report.' },
      { id: 'c', t: 'Meet with the manager to understand what they\'re actually trying to learn, then coach them on how Scrum provides transparency at the team level (via the Increment and Product Backlog).' },
      { id: 'd', t: 'Forward the request to the Product Owner since it concerns output measurement.' },
    ],
    correct: ['c'],
    explanation: 'Scrum Master serving the organization = educating, not enforcing. The manager has a legitimate underlying need (performance visibility) but is asking for the wrong thing (individual metrics that would distort Scrum behavior). The response that serves both Scrum AND the manager is: understand the real need, then teach them where real visibility lives. Option A enables the anti-pattern. Option B is technically correct but unhelpful. Option D passes the buck.',
  },

  {
    id: 's_dev2', concept: 'developers', type: 'single', difficulty: 'scenario',
    context: `You are on a Scrum Team where one Developer, hired two months ago, has been consistently missing commitments they make to themselves during Sprint Planning. Items they say they'll complete by day 5 aren't done until day 9. They don't raise impediments. When pressed, they claim everything is "on track."

The Sprint Goal is being met because other Developers pick up the slack. Morale on the team is starting to suffer. You are a fellow Developer — not the Scrum Master.`,
    q: 'What is the MOST appropriate action?',
    options: [
      { id: 'a', t: 'Tell the Scrum Master and let them handle the performance issue.' },
      { id: 'b', t: 'Escalate to the Developer\'s hiring manager since you suspect a capability problem.' },
      { id: 'c', t: 'Have a direct, honest conversation with the Developer — peer accountability is part of the Developer role.' },
      { id: 'd', t: 'Raise it at the next Sprint Retrospective so the team can address it collectively.' },
    ],
    correct: ['c'],
    explanation: 'The 2020 Scrum Guide names peer accountability as a Developer responsibility: Developers "hold each other accountable as professionals." Option A defers to the SM what is properly a Developer-to-Developer responsibility. Option B escalates outside the team. Option D is also valid but slower — for repeated behavior affecting the team, direct conversation first is professional practice. If direct conversation doesn\'t work, then the Retro is the next step.',
  },

  {
    id: 's_po5', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are the Product Owner. The Developers have proposed spending the next Sprint entirely on technical debt reduction — no new features, no customer-visible changes. Their argument: accumulated debt has slowed the team's ability to deliver over the last six months, and without a focused cleanup Sprint, future Sprints will continue to slow.

Your biggest stakeholder is pressuring you for a customer-facing feature in the next two weeks.`,
    q: 'What is the BEST response?',
    options: [
      { id: 'a', t: 'Accept the Developers\' proposal — they understand the technical reality and a dedicated Sprint is the efficient solution.' },
      { id: 'b', t: 'Decline the dedicated Sprint and instead add technical debt items to the Product Backlog to be ordered alongside feature work.' },
      { id: 'c', t: 'Negotiate a compromise: half the Sprint on debt, half on the stakeholder feature.' },
      { id: 'd', t: 'Accept the dedicated Sprint but only if the Developers can prove the time savings quantitatively.' },
    ],
    correct: ['b'],
    explanation: 'Technical debt is real work that affects product value. It belongs in the Product Backlog like everything else, where the PO can weigh it against features based on value and risk. A dedicated "cleanup Sprint" is a mild anti-pattern — it defers integration of quality thinking into ongoing work. Option A abdicates ordering authority. Option C stuffs two objectives into one Sprint. Option D treats technical judgment as something requiring proof, which damages trust.',
    distractors: {
      a: 'Accepting a full "cleanup Sprint" gives up your ordering accountability. Better: treat debt items as first-class Backlog items.',
      c: 'Two objectives in one Sprint = no Sprint Goal focus. Don\'t negotiate the structure; negotiate the Backlog order.',
      d: 'Demanding quantitative proof on a judgment call from people closer to the code is a trust-breaker. Better to discuss the specific items.',
    },
  },

  {
    id: 's_ev1', concept: 'events', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master. At the Sprint Review, a senior stakeholder is visibly unhappy with the Increment. They start questioning the Developers about technical choices, then pivot to criticizing the Product Owner's prioritization. The conversation grows tense. Other stakeholders look uncomfortable.

The Sprint Review is timeboxed at four hours and you're 90 minutes in.`,
    q: 'What should you do?',
    options: [
      { id: 'a', t: 'Step in and redirect: remind the room that Sprint Review is a working session to inspect the Increment and adapt the Product Backlog, not a blame session.' },
      { id: 'b', t: 'Let the conversation play out — stakeholder feedback, even uncomfortable feedback, is valuable and the PO can handle it.' },
      { id: 'c', t: 'End the Sprint Review early; ask the PO to meet with the unhappy stakeholder separately to address specific concerns.' },
      { id: 'd', t: 'Ask the PO if they want you to intervene, then act based on their answer.' },
    ],
    correct: ['a'],
    explanation: 'The SM ensures events are positive and productive. That includes intervening when an event derails. The intervention isn\'t about silencing the stakeholder — it\'s about redirecting the conversation to the event\'s actual purpose (inspect Increment, adapt Backlog), which includes the valid concerns. Option B lets the event become unproductive. Option C ends a valid Sprint Review prematurely. Option D asks permission for something the SM is accountable for.',
  },

  {
    id: 's_sm5', concept: 'scrum_master', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master for a team that has asked, as a team, to stop holding the Daily Scrum. Their reasoning: they're all co-located in the same room, talk constantly throughout the day, and feel the 15-minute Daily is redundant. They are self-managing well, are hitting Sprint Goals, and the Product Owner is satisfied.`,
    q: 'What should you do?',
    options: [
      { id: 'a', t: 'Agree to their proposal — a self-managing team that communicates constantly may not need the formal event.' },
      { id: 'b', t: 'Explain that the Daily Scrum is a required Scrum event and cannot be removed, then explore with the team what\'s making it feel redundant.' },
      { id: 'c', t: 'Reduce the Daily Scrum to three times a week as a compromise.' },
      { id: 'd', t: 'Let the team trial removing the Daily for one Sprint and see what happens.' },
    ],
    correct: ['b'],
    explanation: 'All five Scrum events are required by the framework. A team cannot "opt out" of one because they don\'t find value in it today — but the SM should absolutely explore WHY it feels redundant, because that\'s useful signal about how the event is being run. Option A violates the framework. Options C and D also modify the framework to accommodate team preference. The right move: hold the line on the rule AND coach the team on making the event valuable.',
  },

  {
    id: 's_po6', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are a Product Owner. Your organization has introduced an OKR framework. Leadership wants the Product Goal reframed as a set of OKRs, with the Product Backlog "mapped" to specific Key Results. They want quarterly reviews of Scrum Team OKR progress.

Your Scrum Team has been performing well under Scrum for a year. You can see both upsides (clearer outcome focus) and risks (OKR cadences and the Sprint cadence may conflict).`,
    q: 'What is the BEST response?',
    options: [
      { id: 'a', t: 'Reject the OKR overlay — Scrum already provides the necessary focus and adding frameworks causes friction.' },
      { id: 'b', t: 'Accept fully — OKRs align product work with organizational strategy and you should integrate them.' },
      { id: 'c', t: 'Engage with leadership on how OKRs can complement rather than replace Scrum: the Product Goal can be expressed as an Objective, Key Results can inform Backlog ordering, but Scrum\'s cadence and artifacts stay intact.' },
      { id: 'd', t: 'Defer the decision to the Scrum Master, who is responsible for the team\'s framework adoption.' },
    ],
    correct: ['c'],
    explanation: 'Scrum is a framework, purposefully incomplete. It can coexist with other frameworks (OKRs, strategic planning, portfolio management) if the overlay doesn\'t break Scrum\'s core mechanisms. The PO\'s job is to engage with this integration thoughtfully — not reject it wholesale, not accept it uncritically, not defer it. Option A is ideologically pure but unhelpful. Option B accepts without considering what breaks. Option D defers PO work to the SM.',
  },

  {
    id: 's_dev3', concept: 'developers', type: 'single', difficulty: 'scenario',
    context: `You are a Developer. During the current Sprint, you discover that a seemingly small Product Backlog Item you're implementing has architectural implications — the "right" way to build it requires a larger refactor that would span multiple Sprints. The "quick" way works but will create significant technical debt.

The item is the last one required to meet the Sprint Goal. The Sprint ends in two days.`,
    q: 'What should you do?',
    options: [
      { id: 'a', t: 'Implement the quick version to meet the Sprint Goal; raise the refactor as a Product Backlog item for the Product Owner to consider.' },
      { id: 'b', t: 'Implement the refactor in full, even if it means missing the Sprint Goal — quality is non-negotiable.' },
      { id: 'c', t: 'Bring the trade-off to the Product Owner and the other Developers immediately; collectively decide whether to accept the debt or renegotiate the Sprint.' },
      { id: 'd', t: 'Implement a partial refactor that gets most of the benefit without blowing the Sprint.' },
    ],
    correct: ['c'],
    explanation: 'Transparency first. This is exactly the kind of decision that needs visibility — not because the Developer can\'t handle it, but because the trade-off affects product value (PO concern) and future Sprints (team concern). Option A unilaterally accepts technical debt — not the Developer\'s call alone. Option B unilaterally rejects the Sprint Goal — also not the Developer\'s call. Option D makes a design compromise without input.',
  },

  {
    id: 's_ac1', concept: 'artifacts_commitments', type: 'single', difficulty: 'scenario',
    context: `Your Scrum Team has been working together for eight months. The current Definition of Done includes: unit tests written, code reviewed, integration tests passing, security scan clean, documentation updated. At the last Retrospective, the Developers proposed removing "documentation updated" from the DoD, arguing that documentation "is rarely read and always falls out of date."

The Product Owner is uncertain. You are the Scrum Master.`,
    q: 'Which is the BEST facilitation approach?',
    options: [
      { id: 'a', t: 'Support the Developers — the DoD belongs to them and they should be empowered to refine it.' },
      { id: 'b', t: 'Defer to the Product Owner\'s judgment since they represent stakeholder interests.' },
      { id: 'c', t: 'Facilitate a conversation focused on the underlying question: what does "Done" mean for our Increment to be usable by stakeholders, and does documentation serve that?' },
      { id: 'd', t: 'Recommend keeping the DoD as-is for now and re-evaluating in three months when more data is available.' },
    ],
    correct: ['c'],
    explanation: 'The DoD belongs to the Scrum Team (not just Developers, and not just the PO) — unless an organizational DoD imposes a minimum. The SM\'s role is facilitating the Team\'s decision, not making it. Option A gets the ownership wrong (team, not Developers alone). Option B gets it wrong the other direction. Option D delays without addressing the real question.',
    distractors: {
      a: 'The Developers own the Sprint Backlog, but the Definition of Done is the whole Scrum Team\'s — PO included.',
      b: 'The PO doesn\'t own the DoD alone either. The Scrum Team owns it collectively.',
      d: 'Delaying the decision doesn\'t help. Facilitate the conversation now — that\'s what the Retrospective is for.',
    },
  },

  {
    id: 's_sc1', concept: 'scaling', type: 'single', difficulty: 'scenario',
    context: `Your organization has three Scrum Teams working on a single product, sharing one Product Owner, one Product Backlog, and one Definition of Done. The teams have different Sprint schedules — Team A is on two-week Sprints, Team B on three-week Sprints, Team C on one-month Sprints.

Integration across teams has become a nightmare. Increments from different teams don't combine cleanly, and the Sprint Reviews are chaotic because teams are at different points in their cycles.`,
    q: 'What is the MOST effective change?',
    options: [
      { id: 'a', t: 'Align all three teams to the same Sprint length and the same Sprint start/end dates.' },
      { id: 'b', t: 'Allow each team to keep its Sprint length but assign an integration team to reconcile Increments.' },
      { id: 'c', t: 'Split the Product Backlog into three team-specific backlogs so each team can operate more independently.' },
      { id: 'd', t: 'Keep the current structure but have the teams hold joint Sprint Reviews at the end of each calendar month.' },
    ],
    correct: ['a'],
    explanation: 'Multiple teams on one product need the same cadence so Increments can integrate each Sprint. Different Sprint lengths force artificial coordination overhead. Option B adds an anti-pattern (integration team — violates self-management and doesn\'t fix the root issue). Option C splits the Backlog (anti-pattern). Option D leaves the real problem unsolved.',
  },

  {
    id: 's_po7', concept: 'product_owner', type: 'single', difficulty: 'scenario',
    context: `You are the Product Owner. Your CEO has asked you for a detailed 12-month feature roadmap with quarterly milestones so they can present it to the board of directors next month. They want specific features committed to specific quarters.

Your Product Backlog has roughly six months of well-refined items at the top and increasingly vague items below. The product is still early enough that user feedback often changes direction.`,
    q: 'What should you do?',
    options: [
      { id: 'a', t: 'Produce the roadmap as requested — the CEO has legitimate authority and board commitments are necessary for funding.' },
      { id: 'b', t: 'Refuse to produce a detailed roadmap — Scrum is empirical and cannot commit to features 12 months out.' },
      { id: 'c', t: 'Produce a directional roadmap that shows current Product Goal, near-term likely work, and longer-term themes without committing to specific features in specific quarters. Discuss with the CEO what they actually need for the board.' },
      { id: 'd', t: 'Produce the detailed roadmap but add extensive caveats about why commitments are likely to change.' },
    ],
    correct: ['c'],
    explanation: 'The CEO has a real need (board confidence) that deserves a real response. But committing to specific features 12 months out is both dishonest (you don\'t know) and counter to empiricism. The PO\'s job is to produce what supports value-creation while being honest about uncertainty. Option A fakes certainty. Option B refuses to engage. Option D is dishonest theater. Option C gives real value while respecting what Scrum actually knows.',
  },

  {
    id: 's_ev2', concept: 'events', type: 'single', difficulty: 'scenario',
    context: `You are the Product Owner. It's the end of a Sprint, and the Developers come to you during the Sprint Review with a completed Increment — but three Product Backlog items that were forecast at Sprint Planning are not Done. The Developers explain that unexpected technical complexity consumed more time than expected.

A key stakeholder attending the Review asks, pointedly, why the team "failed to deliver what they committed to."`,
    q: 'What is the BEST response?',
    options: [
      { id: 'a', t: 'Acknowledge the miss and apologize on behalf of the team; commit to doing better next Sprint.' },
      { id: 'b', t: 'Correct the stakeholder: the Sprint Goal — not the item list — is the commitment, and the Sprint Goal was met.' },
      { id: 'c', t: 'Explain that the Developers forecast what they believe they can complete, but forecasts are not commitments; discuss the learning this Sprint surfaced and how it will inform the Product Backlog.' },
      { id: 'd', t: 'Defer to the Scrum Master to explain Scrum principles to the stakeholder.' },
    ],
    correct: ['c'],
    explanation: 'This is a teaching moment done tactfully. The stakeholder\'s framing is wrong (items aren\'t committed to), but correcting them bluntly (option B) is defensive. Apologizing (option A) accepts a false premise. Deferring (option D) abdicates PO responsibility. Option C explains the distinction AND redirects to what the Sprint Review is actually for — inspecting what was learned and adapting the Backlog.',
  },

  {
    id: 's_sm6', concept: 'scrum_master', type: 'single', difficulty: 'scenario',
    context: `You are the Scrum Master. Your Product Owner has been in the role for four years and is well-regarded. Over the last two Sprints, you've observed that the PO has been making product decisions without consulting the Developers — specifically, changing item priorities mid-Sprint without conversation, adding new items to the Sprint Backlog themselves, and publicly reversing Developer-proposed splits of items.

The Developers haven't formally complained. They've started being less engaged at Sprint Planning.`,
    q: 'What is the BEST first action?',
    options: [
      { id: 'a', t: 'Raise the pattern at the next Sprint Retrospective so the whole team can address it openly.' },
      { id: 'b', t: 'Have a private coaching conversation with the PO about the Developer accountabilities and their impact on engagement.' },
      { id: 'c', t: 'Talk to the Developers first to understand their perspective before approaching the PO.' },
      { id: 'd', t: 'Let the pattern continue for another Sprint to gather more evidence before intervening.' },
    ],
    correct: ['b'],
    explanation: 'The pattern is specific to the PO\'s behavior crossing into Developer territory. Private coaching is the SM\'s primary tool for that kind of misstep. Raising it in the Retro (option A) puts the PO on the spot publicly. Talking to Developers first (option C) is investigative but delays action; also risks appearing to build a case. Waiting (option D) lets the pattern entrench.',
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   STATE + PERSISTENCE
   ────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'pspo-progress-v1';

const DEFAULT_PROGRESS = {
  questions: {}, // qid -> { attempts, correctCount, wrongCount, lastSeenAt, nextReviewAt }
  totalAnswered: 0,
  totalCorrect: 0,
  sessionsCompleted: 0,
  bookmarks: {}, // qid -> true
};

function loadProgress() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(s);
    if (!parsed.bookmarks) parsed.bookmarks = {};
    return parsed;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

export function masteryForConcept(progress, conceptId) {
  const qs = QUESTIONS.filter((q) => q.concept === conceptId);
  let weightedAnswered = 0;
  let weightedCorrect = 0;
  let weightedCoverage = 0;
  let weightedTotal = 0;
  // Hard stats (brutal + scenario) tracked separately for the "mastered" gate
  let hardAnswered = 0;
  let hardCorrect = 0;
  let hardCount = 0;
  for (const q of qs) {
    const isHard = q.difficulty === 'brutal' || q.difficulty === 'scenario';
    const weight = isHard ? 1.5 : 1;
    weightedTotal += weight;
    const p = progress.questions[q.id];
    if (isHard) hardCount++;
    if (!p) continue;
    weightedAnswered += (p.attempts || 0) * weight;
    weightedCorrect += (p.correctCount || 0) * weight;
    if ((p.correctCount || 0) > 0) weightedCoverage += weight;
    if (isHard) {
      hardAnswered += p.attempts || 0;
      hardCorrect += p.correctCount || 0;
    }
  }
  const coverage = weightedTotal > 0 ? weightedCoverage / weightedTotal : 0;
  const accuracy = weightedAnswered > 0 ? weightedCorrect / weightedAnswered : 0;
  const hardAccuracy = hardAnswered > 0 ? hardCorrect / hardAnswered : 0;
  // Raw counts for display
  let totalAnswered = 0, totalCorrect = 0, uniqueCorrect = 0;
  for (const q of qs) {
    const p = progress.questions[q.id];
    if (!p) continue;
    totalAnswered += p.attempts || 0;
    totalCorrect += p.correctCount || 0;
    if ((p.correctCount || 0) > 0) uniqueCorrect++;
  }
  let level = 'unseen';
  if (totalAnswered === 0) level = 'unseen';
  // Mastered requires hard (brutal + scenario) accuracy too
  else if (coverage >= 0.8 && accuracy >= 0.85 && (hardCount === 0 || hardAccuracy >= 0.8)) level = 'mastered';
  else if (coverage >= 0.5 && accuracy >= 0.6) level = 'practicing';
  else level = 'learning';
  return { level, coverage, accuracy, totalAnswered, totalCorrect, uniqueCorrect, questionCount: qs.length, brutalCount: hardCount, brutalAnswered: hardAnswered, brutalAccuracy: hardAccuracy };
}

export function arraysEqualAsSet(a, b) {
  if (a.length !== b.length) return false;
  const as = new Set(a);
  for (const x of b) if (!as.has(x)) return false;
  return true;
}

/* ──────────────────────────────────────────────────────────────────────────
   STYLE INJECTION
   ────────────────────────────────────────────────────────────────────────── */

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Press+Start+2P&display=swap');

.pspo-root {
  --bg: #0e0c0a;
  --surface: #17140f;
  --surface-hi: #1f1b15;
  --surface-on: #2a2620;
  --border: #2a2620;
  --border-hi: #3d362c;
  --text: #e8e1d3;
  --text-dim: #8a8275;
  --text-faint: #5c564c;
  --accent: #e8a838;
  --accent-dim: #b88428;
  --accent-soft: rgba(232, 168, 56, 0.12);
  --correct: #8bb38b;
  --correct-soft: rgba(139, 179, 139, 0.12);
  --wrong: #d18585;
  --wrong-soft: rgba(209, 133, 133, 0.12);
  --font-display: 'Fraunces', 'Georgia', serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Menlo', monospace;

  font-family: var(--font-body);
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  line-height: 1.5;
  font-size: 15px;
}

.pspo-root * { box-sizing: border-box; }

.pspo-root .display { font-family: var(--font-display); font-optical-sizing: auto; }
.pspo-root .mono { font-family: var(--font-mono); letter-spacing: 0.02em; }

.pspo-root button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: transparent;
  color: inherit;
  padding: 0;
}

.pspo-root .grainy {
  background-image:
    radial-gradient(1200px 600px at 90% -10%, rgba(232, 168, 56, 0.06), transparent 60%),
    radial-gradient(800px 400px at 5% 110%, rgba(232, 168, 56, 0.04), transparent 60%);
}

.pspo-root .rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
}

.pspo-root .chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 2px;
  background: var(--surface);
}

.pspo-root .chip.accent { color: var(--accent); border-color: var(--accent-dim); background: var(--accent-soft); }
.pspo-root .chip.correct { color: var(--correct); border-color: var(--correct); background: var(--correct-soft); }
.pspo-root .chip.wrong { color: var(--wrong); border-color: var(--wrong); background: var(--wrong-soft); }

.pspo-root .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text);
  border: 1px solid var(--border-hi);
  background: var(--surface);
  transition: all 0.12s ease;
}
.pspo-root .btn:hover:not(:disabled) { background: var(--surface-hi); border-color: var(--accent-dim); }
.pspo-root .btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pspo-root .btn.primary { background: var(--accent); color: #1a1409; border-color: var(--accent); font-weight: 600; }
.pspo-root .btn.primary:hover:not(:disabled) { background: #f2b44a; border-color: #f2b44a; }
.pspo-root .btn.ghost { border-color: var(--border); color: var(--text-dim); }
.pspo-root .btn.ghost:hover:not(:disabled) { color: var(--text); border-color: var(--border-hi); }

.pspo-root .option-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 15px;
  line-height: 1.5;
  transition: all 0.12s ease;
  position: relative;
}
.pspo-root .option-btn:hover:not(:disabled) { border-color: var(--border-hi); background: var(--surface-hi); }
.pspo-root .option-btn.selected { border-color: var(--accent); background: var(--accent-soft); }
.pspo-root .option-btn.correct { border-color: var(--correct); background: var(--correct-soft); }
.pspo-root .option-btn.wrong { border-color: var(--wrong); background: var(--wrong-soft); }
.pspo-root .option-btn:disabled { cursor: default; }

.pspo-root .option-letter {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  display: inline-block;
  width: 20px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.pspo-root .option-btn.selected .option-letter { color: var(--accent); }
.pspo-root .option-btn.correct .option-letter { color: var(--correct); }
.pspo-root .option-btn.wrong .option-letter { color: var(--wrong); }

.pspo-root .concept-card {
  padding: 22px 24px 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  transition: all 0.15s ease;
  text-align: left;
  width: 100%;
  display: block;
  position: relative;
  overflow: hidden;
}
.pspo-root .concept-card:hover { border-color: var(--accent-dim); background: var(--surface-hi); transform: translateY(-1px); }
.pspo-root .concept-card::after {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--mastery-color, var(--border));
}

.pspo-root .tick {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-hi);
  display: inline-block;
}
.pspo-root .tick.filled { background: var(--accent); }

.pspo-root .numeric {
  font-family: var(--font-display);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.pspo-root .fade-in { animation: pspoFade 0.3s ease; }
@keyframes pspoFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.pspo-root .dim { color: var(--text-dim); }
.pspo-root .faint { color: var(--text-faint); }
.pspo-root .accent { color: var(--accent); }

.pspo-root .card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 28px;
}

.pspo-root .container-max { max-width: 820px; margin: 0 auto; padding: 32px 24px 80px; }

/* Theme toggle — styled to match the arcade theme it switches to */
.pspo-root .theme-toggle-classic {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
  padding: 9px 14px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #00ff41;
  background: #000;
  border: 2px solid #00ff41;
  border-radius: 0;
  cursor: pointer;
  transition: transform 0.1s, background 0.12s, color 0.12s;
  animation: themePulseArcade 2s ease-in-out infinite;
  box-shadow:
    0 0 0 0 rgba(0,255,65,0.6),
    inset 0 0 8px rgba(0,255,65,0.2);
}
.pspo-root .theme-toggle-classic:hover {
  background: #00ff41;
  color: #000;
  transform: translateY(-1px);
}
.pspo-root .theme-toggle-classic:active { transform: translateY(1px); }
.pspo-root .theme-toggle-classic .theme-toggle-icon {
  display: inline-block;
  animation: themeSpin 4s linear infinite, themeGlitchIcon 11s infinite;
}
@keyframes themePulseArcade {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,65,0.6), inset 0 0 8px rgba(0,255,65,0.2); }
  50%      { box-shadow: 0 0 0 10px rgba(0,255,65,0), inset 0 0 8px rgba(0,255,65,0.2); }
}
@keyframes themeSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* Brief, rare glitch — about 250ms every 11s */
@keyframes themeGlitchIcon {
  0%, 97%, 100% { text-shadow: none; filter: none; }
  97.5%         { text-shadow: 1px 0 rgba(255,68,170,0.55), -1px 0 rgba(68,221,255,0.55); filter: brightness(1.1); }
  98%           { text-shadow: -1px 0 rgba(255,68,170,0.55), 1px 0 rgba(68,221,255,0.55); }
  98.8%         { text-shadow: 1px 0 rgba(255,68,170,0.4), -1px 0 rgba(68,221,255,0.4); }
}

@media (max-width: 640px) {
  .pspo-root { font-size: 14px; }
  .pspo-root .container-max { padding: 20px 16px 60px; }
  .pspo-root .card { padding: 20px; }
  .pspo-root .btn { padding: 10px 16px; font-size: 11px; }
}

.pspo-dot {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 3px;
  transition: background 0.15s;
}
.pspo-dot:hover {
  background: var(--surface-hi);
}
.pspo-dot[data-tip]:hover::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface-on);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 4px;
  border: 1px solid var(--border-hi);
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  letter-spacing: 0.05em;
}
`;

/* ──────────────────────────────────────────────────────────────────────────
   COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

function MasteryDots({ coverage, questionCount }) {
  const filled = Math.round(coverage * 5);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`tick ${i < filled ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

function PhaseProgressBar({ phases, phaseIdx, questionIdx, onJump, answered, bookmarks, uniform }) {
  const phaseColor = (phase) => {
    if (uniform) return 'var(--correct)';
    const d = phase.questions[0]?.difficulty;
    if (d === 'brutal') return 'var(--wrong)';
    if (d === 'scenario') return 'var(--accent)';
    return 'var(--correct)';
  };

  const shapeStyle = (phase, qIdx, pIdx) => {
    const d = phase.questions[0]?.difficulty;
    const isCurrent = pIdx === phaseIdx;
    const isNow = isCurrent && qIdx === questionIdx;
    const qid = phase.questions[qIdx]?.id;
    const isAnswered = !!(answered && qid && answered[qid]);
    const isBookmarked = !!(bookmarks && qid && bookmarks[qid]);
    const color = isBookmarked ? '#ff8c1a' : phaseColor(phase);
    const size = isNow ? 11 : 8;
    const base = {
      width: size, height: size,
      background: color,
      opacity: isNow ? 1 : isAnswered ? 0.85 : isBookmarked ? 0.85 : 0.32,
      transition: 'width 0.15s, height 0.15s, opacity 0.15s',
      boxShadow: isNow ? `0 0 0 3px ${color}50` : 'none',
    };
    if (isBookmarked) return { ...base, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 70%, 0% 100%)' };
    if (uniform) return { ...base, borderRadius: '50%' };
    if (d === 'scenario') return { ...base, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' };
    if (d === 'brutal') return { ...base, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
    return { ...base, borderRadius: '50%' };
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
      {phases.map((phase, pIdx) => {
        const offset = phases.slice(0, pIdx).reduce((s, p) => s + p.questions.length, 0);
        return (
          <React.Fragment key={pIdx}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {phase.questions.map((_, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  className="pspo-dot"
                  data-tip={`Q${offset + qIdx + 1}`}
                  onClick={onJump ? () => onJump(pIdx, qIdx) : undefined}
                  aria-label={`Go to question ${offset + qIdx + 1}`}
                >
                  <div style={shapeStyle(phase, qIdx, pIdx)} />
                </button>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Header({ stats, onNav, currentView, onToggleTheme }) {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      <button onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'baseline', gap: 12, textAlign: 'left' }}>
        <span className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>PSPO<span className="accent" style={{ fontStyle: 'italic' }}>·I</span></span>
        <span className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trainer</span>
      </button>
      <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[
          ['home', 'Concepts'],
          ['review', 'Review'],
          ['stats', 'Stats'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="mono"
            style={{
              padding: '6px 12px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: currentView === id ? 'var(--accent)' : 'var(--text-dim)',
              border: `1px solid ${currentView === id ? 'var(--accent-dim)' : 'transparent'}`,
              background: currentView === id ? 'var(--accent-soft)' : 'transparent',
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={onToggleTheme}
          className="theme-toggle-classic"
          title="Switch to arcade theme"
          aria-label="Switch to arcade theme"
        >
          <span className="theme-toggle-icon">◉</span>
          <span>ARCADE</span>
        </button>
      </nav>
    </header>
  );
}

function HomeView({ progress, onPickConcept, onStartReview, onStartQuick, onStartMock }) {
  const wrongQueueSize = useMemo(() => {
    return Object.entries(progress.questions).filter(([, p]) => {
      const latestWrong = (p.wrongCount || 0) > (p.correctCount || 0);
      return latestWrong || ((p.wrongCount || 0) > 0 && (p.correctCount || 0) < 2);
    }).length;
  }, [progress]);

  const overallAccuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : null;

  return (
    <div className="container-max fade-in">
      <section style={{ marginBottom: 48 }}>
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          2020 Scrum Guide · {QUESTIONS.length} questions · {CONCEPTS.length} concepts
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(34px, 6vw, 52px)', lineHeight: 1.05, margin: '0 0 20px', fontWeight: 500, letterSpacing: '-0.02em' }}>
          Master PSPO I
        </h1>
        <p className="dim" style={{ fontSize: 17, maxWidth: 560, margin: 0, lineHeight: 1.55 }}>
          A focused study engine for the PSPO I exam. Concept lessons, distractor-level feedback on wrong answers, and spaced review of what you miss.
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={onStartQuick}>Quick Quiz · 10 random</button>
          <button className="btn" onClick={onStartMock} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            ◉ Mock Exam · 80 Qs · 60 min
          </button>
          {wrongQueueSize > 0 && (
            <button className="btn" onClick={onStartReview}>
              Review Queue · <span style={{ color: 'var(--accent)' }}>{wrongQueueSize}</span>
            </button>
          )}
          {overallAccuracy !== null && (
            <div className="mono dim" style={{ fontSize: 11, alignSelf: 'center', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              Overall accuracy · <span className="numeric" style={{ color: 'var(--text)' }}>{overallAccuracy}%</span>
            </div>
          )}
        </div>
        <p className="mono faint" style={{ fontSize: 10, letterSpacing: '0.12em', marginTop: 14, maxWidth: 540, lineHeight: 1.5 }}>
          MOCK EXAM simulates the real PSPO I conditions: 80 questions in 60 minutes, no feedback until the end, 85% to pass (68/80). Best used after you've worked through the concept lessons and feel ready to pressure-test yourself.
        </p>
      </section>

      <div className="rule" style={{ margin: '32px 0 40px' }} />

      <section>
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Concepts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {CONCEPTS.map((c, i) => {
            const m = masteryForConcept(progress, c.id);
            const masteryColor =
              m.level === 'mastered' ? 'var(--correct)' :
              m.level === 'practicing' ? 'var(--accent)' :
              m.level === 'learning' ? 'var(--accent-dim)' :
              'var(--border-hi)';
            return (
              <button
                key={c.id}
                className="concept-card"
                style={{ '--mastery-color': masteryColor }}
                onClick={() => onPickConcept(c.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span className="mono faint" style={{ fontSize: 10, letterSpacing: '0.16em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: masteryColor }}>
                    {m.level}
                  </span>
                </div>
                <div className="display" style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.01em' }}>
                  {c.label}
                </div>
                <div className="dim" style={{ fontSize: 13, marginBottom: 14 }}>
                  {c.subtitle}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MasteryDots coverage={m.coverage} questionCount={m.questionCount} />
                  <span className="mono" style={{
                    fontSize: 10, letterSpacing: '0.1em',
                    color: m.uniqueCorrect === m.questionCount && m.questionCount > 0 ? 'var(--correct)' : m.uniqueCorrect > 0 ? 'var(--text-dim)' : 'var(--text-faint)',
                  }}>
                    <span style={{ color: m.uniqueCorrect > 0 ? 'var(--text)' : undefined }}>{m.uniqueCorrect}</span>
                    {' / '}{m.questionCount} correct
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="rule" style={{ margin: '48px 0 24px' }} />
      <p className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Disclaimer</p>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-faint)', maxWidth: 640, margin: 0 }}>
        PSPO·I Trainer is an independent study tool not affiliated with, endorsed by, or officially associated with Scrum.org or any of its subsidiaries. Use of this application does not guarantee success on the Professional Scrum Product Owner I (PSPO I) assessment, nor does it confer any certification or credential. The PSPO I is an official Scrum.org assessment — candidates are encouraged to study the 2020 Scrum Guide and consult all official learning resources available at{' '}
        <span style={{ color: 'var(--text-dim)' }}>scrum.org</span> before attempting the assessment.
      </p>
    </div>
  );
}

function LessonView({ conceptId, onStart, onBack }) {
  const concept = CONCEPTS.find((c) => c.id === conceptId);
  const lesson = LESSONS[conceptId];
  const questionCount = QUESTIONS.filter((q) => q.concept === conceptId).length;

  return (
    <div className="container-max fade-in">
      <button className="btn ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Back</button>

      <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
        Lesson · {concept.subtitle}
      </div>
      <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, margin: '0 0 28px', fontWeight: 500, letterSpacing: '-0.02em' }}>
        {concept.label}
      </h1>

      {/* Opening framing */}
      {lesson.intro && (
        <div className="display" style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 36px', color: 'var(--text)', fontWeight: 400, maxWidth: 680 }}>
          {lesson.intro}
        </div>
      )}

      {/* Visual diagram (if present) */}
      {lesson.visual && (
        <div style={{ margin: '0 0 40px', padding: '28px 20px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}
             dangerouslySetInnerHTML={{ __html: lesson.visual }} />
      )}

      {/* Teaching sections */}
      {lesson.sections && lesson.sections.map((s, i) => (
        <section key={i} style={{ marginBottom: 40 }}>
          <div className="mono accent" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
            § {String(i + 1).padStart(2, '0')}
          </div>
          <h2 className="display" style={{ fontSize: 24, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            {s.heading}
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text)', whiteSpace: 'pre-wrap', maxWidth: 680 }}>
            {s.body}
          </div>
          {s.example && (
            <div style={{ marginTop: 20, padding: '18px 22px', background: 'var(--accent-soft)', borderLeft: '3px solid var(--accent)', maxWidth: 680 }}>
              <div className="mono accent" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>
                Example · {s.example.title}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {s.example.body}
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Mnemonics */}
      {lesson.mnemonics && lesson.mnemonics.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
            Mnemonics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {lesson.mnemonics.map((m, i) => (
              <div key={i} style={{ padding: '16px 18px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="mono accent" style={{ fontSize: 13, letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-dim)' }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      {lesson.tips && lesson.tips.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14, color: 'var(--accent)' }}>
            ✦ Exam tips
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lesson.tips.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, paddingLeft: 4 }}>
                <span className="accent" style={{ fontSize: 13, paddingTop: 2 }}>→</span>
                <span style={{ lineHeight: 1.6, fontSize: 14 }}>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rule" style={{ margin: '8px 0 32px' }} />

      {/* Key points — condensed summary */}
      <section style={{ marginBottom: 32 }}>
        <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>Key points to remember</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lesson.keyPoints.map((pt, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, paddingLeft: 4 }}>
              <span className="mono faint" style={{ fontSize: 11, paddingTop: 3, letterSpacing: '0.08em' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ lineHeight: 1.55, fontSize: 14 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Traps */}
      <section style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14, color: 'var(--wrong)' }}>⚠ Exam traps</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lesson.traps.map((t, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                borderLeft: '2px solid var(--wrong)',
                background: 'var(--wrong-soft)',
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      <div className="rule" style={{ margin: '8px 0 24px' }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn primary" onClick={onStart}>Start Quiz · {questionCount} Qs →</button>
        <span className="mono faint" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
          You can leave any time — progress is saved
        </span>
      </div>
    </div>
  );
}

export function defangBrutalQuestion(text) {
  return text.replace(/\b[A-Z]{3,}\b/g, (w) => w.toLowerCase());
}

function QuizView({ questions: questionsProp, phases, progress, onComplete, onBack, mode, conceptId, onToggleBookmark, qsess, setQsess }) {
  // Persistent state lives in qsess (lifted to App so theme toggle preserves quiz progress).
  // Wrapper setters keep the rest of the component's call sites unchanged.
  const phaseIdx = qsess.phaseIdx;
  const idx = qsess.idx;
  const sessionCorrect = qsess.sessionCorrect;
  const sessionWrong = qsess.sessionWrong;
  const finished = qsess.finished;
  const mockAnswers = qsess.mockAnswers;
  const sessionAnswers = qsess.sessionAnswers;
  const mockBookmarks = qsess.mockBookmarks;
  const mockTimeLeft = qsess.mockTimeLeft;
  const setPhaseIdx = (v) => setQsess((s) => ({ ...s, phaseIdx: typeof v === 'function' ? v(s.phaseIdx) : v }));
  const setIdx = (v) => setQsess((s) => ({ ...s, idx: typeof v === 'function' ? v(s.idx) : v }));
  const setSessionCorrect = (v) => setQsess((s) => ({ ...s, sessionCorrect: typeof v === 'function' ? v(s.sessionCorrect) : v }));
  const setSessionWrong = (v) => setQsess((s) => ({ ...s, sessionWrong: typeof v === 'function' ? v(s.sessionWrong) : v }));
  const setFinished = (v) => setQsess((s) => ({ ...s, finished: typeof v === 'function' ? v(s.finished) : v }));
  const setMockAnswers = (v) => setQsess((s) => ({ ...s, mockAnswers: typeof v === 'function' ? v(s.mockAnswers) : v }));
  const setSessionAnswers = (v) => setQsess((s) => ({ ...s, sessionAnswers: typeof v === 'function' ? v(s.sessionAnswers) : v }));
  const setMockBookmarks = (v) => setQsess((s) => ({ ...s, mockBookmarks: typeof v === 'function' ? v(s.mockBookmarks) : v }));

  // Derive active question list from phases or direct prop
  const questions = phases ? phases[phaseIdx].questions : (questionsProp || []);

  // Ephemeral per-question UI state — local; resets on theme toggle, which is fine
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const isMock = mode === 'mock';
  const effectiveBookmarks = isMock ? mockBookmarks : (progress.bookmarks || {});

  function handleToggleBookmark(qid) {
    if (isMock) {
      setMockBookmarks((prev) => {
        const next = { ...prev };
        if (next[qid]) delete next[qid]; else next[qid] = true;
        return next;
      });
    } else if (onToggleBookmark) {
      onToggleBookmark(qid);
    }
  }

  // Timer tick — decrements shared mockTimeLeft so it survives theme toggles
  useEffect(() => {
    if (!isMock || finished) return;
    const interval = setInterval(() => {
      setQsess((s) => ({ ...s, mockTimeLeft: Math.max(0, s.mockTimeLeft - 1) }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMock, finished, setQsess]);

  useEffect(() => {
    if (isMock && mockTimeLeft === 0 && !finished) {
      finalizeMockExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTimeLeft, isMock, finished]);

  function finalizeMockExam() {
    // Score every question
    let correct = 0;
    let wrong = 0;
    for (const qq of questions) {
      const ans = mockAnswers[qq.id];
      if (ans && arraysEqualAsSet(ans, qq.correct)) {
        correct++;
        onComplete(qq.id, true);
      } else {
        wrong++;
        // Only record as wrong if they attempted it; unanswered still counts as wrong on real exam
        onComplete(qq.id, false);
      }
    }
    setSessionCorrect(correct);
    setSessionWrong(wrong);
    setFinished(true);
  }

  const q = questions[idx];

  if (finished) {
    const total = sessionCorrect + sessionWrong;
    const pct = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0;
    const passBar = isMock ? 85 : 85;
    let verdict, verdictColor;
    if (pct >= 95) {
      verdict = 'Perfect Score';
      verdictColor = 'var(--correct)';
    } else if (pct >= passBar) {
      verdict = 'Pass';
      verdictColor = 'var(--correct)';
    } else if (pct >= 70) {
      verdict = 'Almost There';
      verdictColor = 'var(--accent)';
    } else {
      verdict = 'Fail';
      verdictColor = 'var(--wrong)';
    }
    return (
      <div className="container-max fade-in">
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          {isMock ? '◉ Mock Exam · Results' : 'Quiz · Results'}
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.02em', color: verdictColor }}>
          {verdict}
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
          <div className="numeric" style={{ fontSize: 64, lineHeight: 1, color: verdictColor }}>{pct}%</div>
          <div className="mono dim" style={{ fontSize: 13, letterSpacing: '0.1em' }}>
            {sessionCorrect} / {total} correct
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={onBack}>Done</button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="container-max fade-in">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 28, marginBottom: 12 }}>No questions in this set.</div>
          <button className="btn" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  const selectCount = q.selectCount || (q.type === 'multi' ? q.correct.length : 1);
  const canSubmit = selected.length === selectCount;

  function toggleOption(optId) {
    if (revealed && !isMock) return;
    let newSelected;
    if (selectCount === 1) {
      newSelected = [optId];
    } else {
      newSelected = selected.includes(optId)
        ? selected.filter((x) => x !== optId)
        : selected.length < selectCount ? [...selected, optId] : selected;
    }
    setSelected(newSelected);
    // In mock mode, save answer to the map on every change
    if (isMock) {
      setMockAnswers((prev) => ({ ...prev, [q.id]: newSelected }));
    }
  }

  function loadStateForQuestion(targetQ) {
    if (isMock) {
      setSelected(mockAnswers[targetQ.id] || []);
      setRevealed(false);
      setWasCorrect(null);
    } else {
      const saved = sessionAnswers[targetQ.id];
      if (saved) {
        setSelected(saved.selected);
        setRevealed(true);
        setWasCorrect(saved.wasCorrect);
      } else {
        setSelected([]);
        setRevealed(false);
        setWasCorrect(null);
      }
    }
  }

  async function submit() {
    if (!canSubmit || revealed) return;
    const correct = arraysEqualAsSet(selected, q.correct);
    setWasCorrect(correct);
    setRevealed(true);
    if (!sessionAnswers[q.id]) {
      if (correct) setSessionCorrect((x) => x + 1); else setSessionWrong((x) => x + 1);
      onComplete(q.id, correct);
    }
    setSessionAnswers((prev) => ({ ...prev, [q.id]: { selected, wasCorrect: correct } }));
  }

  function isAtFirst() {
    return idx === 0 && (!phases || phaseIdx === 0);
  }
  function isAtLast() {
    return idx + 1 >= questions.length && (!phases || phaseIdx === phases.length - 1);
  }

  function next() {
    if (idx + 1 >= questions.length) {
      if (isMock) {
        setConfirmSubmit(true);
        return;
      }
      if (phases && phaseIdx < phases.length - 1) {
        const nextPhaseQ = phases[phaseIdx + 1].questions[0];
        setPhaseIdx(phaseIdx + 1);
        setIdx(0);
        loadStateForQuestion(nextPhaseQ);
        return;
      }
      setFinished(true);
      return;
    }
    setIdx(idx + 1);
    loadStateForQuestion(questions[idx + 1]);
  }

  function prev() {
    if (idx === 0) {
      if (phases && phaseIdx > 0) {
        const prevPhase = phases[phaseIdx - 1];
        const lastIdx = prevPhase.questions.length - 1;
        setPhaseIdx(phaseIdx - 1);
        setIdx(lastIdx);
        loadStateForQuestion(prevPhase.questions[lastIdx]);
      }
      return;
    }
    setIdx(idx - 1);
    loadStateForQuestion(questions[idx - 1]);
  }

  function jumpToPhase(targetPhaseIdx, targetQIdx) {
    if (phases) {
      if (targetPhaseIdx !== phaseIdx) setPhaseIdx(targetPhaseIdx);
      const target = phases[targetPhaseIdx].questions[targetQIdx];
      setIdx(targetQIdx);
      loadStateForQuestion(target);
    } else {
      setIdx(targetQIdx);
      loadStateForQuestion(questions[targetQIdx]);
    }
  }

  // Mock-exam confirm-submit interstitial
  if (isMock && confirmSubmit) {
    const answered = Object.keys(mockAnswers).length;
    const unanswered = questions.length - answered;
    const timeMin = Math.floor(mockTimeLeft / 60);
    const timeSec = mockTimeLeft % 60;
    return (
      <div className="container-max fade-in">
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          ◉ Mock Exam · Submit
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          Ready to submit?
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32, maxWidth: 560 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Answered</div>
            <div className="numeric" style={{ fontSize: 36, color: 'var(--text)' }}>{answered}</div>
            <div className="mono faint" style={{ fontSize: 11, marginTop: 4 }}>/ {questions.length}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Unanswered</div>
            <div className="numeric" style={{ fontSize: 36, color: unanswered > 0 ? 'var(--wrong)' : 'var(--text-dim)' }}>{unanswered}</div>
            <div className="mono faint" style={{ fontSize: 11, marginTop: 4 }}>count as wrong</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Time left</div>
            <div className="numeric" style={{ fontSize: 36, color: 'var(--accent)' }}>{timeMin}:{String(timeSec).padStart(2, '0')}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 560, color: 'var(--text-dim)', marginBottom: 24 }}>
          Submitting will score your exam against the 85% pass bar. You won't be able to change answers after this.
          {unanswered > 0 && ` You still have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'} — they'll count as wrong.`}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={finalizeMockExam}>Submit Exam</button>
          <button className="btn ghost" onClick={() => setConfirmSubmit(false)}>Go back</button>
        </div>
      </div>
    );
  }

  // Mock-exam timer formatting
  const mockTimeMin = Math.floor(mockTimeLeft / 60);
  const mockTimeSec = mockTimeLeft % 60;
  const timerWarning = isMock && mockTimeLeft < 10 * 60; // Last 10 minutes
  const timerCritical = isMock && mockTimeLeft < 5 * 60; // Last 5 minutes
  const answeredCount = isMock ? Object.keys(mockAnswers).length : 0;

  return (
    <div className="container-max fade-in" key={q.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <button className="btn ghost" onClick={() => onBack(false)}>{isMock ? '← Abandon' : '← Exit'}</button>
        {isMock ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
              <span className="numeric" style={{ color: 'var(--text)' }}>{String(idx + 1).padStart(2, '0')}</span>
              <span> / {String(questions.length).padStart(2, '0')}</span>
              <span style={{ margin: '0 12px' }}>·</span>
              <span className="numeric" style={{ color: 'var(--accent)' }}>{answeredCount}</span>
              <span> answered</span>
            </div>
            <div style={{
              padding: '6px 14px',
              border: `1px solid ${timerCritical ? 'var(--wrong)' : timerWarning ? 'var(--accent)' : 'var(--border-hi)'}`,
              background: timerCritical ? 'var(--wrong-soft)' : timerWarning ? 'var(--accent-soft)' : 'transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: timerCritical ? 'var(--wrong)' : timerWarning ? 'var(--accent)' : 'var(--text)',
            }}>
              ⏱ {mockTimeMin}:{String(mockTimeSec).padStart(2, '0')}
            </div>
          </div>
        ) : (
          <div className="mono faint" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
            {phases && (
              <>
                <span style={{ color: 'var(--accent)' }}>Phase {phaseIdx + 1}/{phases.length}</span>
                <span style={{ margin: '0 10px' }}>·</span>
              </>
            )}
            {phases ? (
              <>
                <span className="numeric" style={{ color: 'var(--text)' }}>{String(phases.slice(0, phaseIdx).reduce((s, p) => s + p.questions.length, 0) + idx + 1).padStart(2, '0')}</span>
                <span> / {String(phases.reduce((s, p) => s + p.questions.length, 0)).padStart(2, '0')}</span>
              </>
            ) : (
              <>
                <span className="numeric" style={{ color: 'var(--text)' }}>{String(idx + 1).padStart(2, '0')}</span>
                <span> / {String(questions.length).padStart(2, '0')}</span>
              </>
            )}
            <span style={{ margin: '0 12px' }}>·</span>
            <span style={{ color: 'var(--correct)' }}>{sessionCorrect}</span>
            <span> correct</span>
          </div>
        )}
      </div>

      <PhaseProgressBar
        phases={phases || [{ name: 'All', questions }]}
        phaseIdx={phases ? phaseIdx : 0}
        questionIdx={idx}
        onJump={jumpToPhase}
        answered={isMock ? mockAnswers : sessionAnswers}
        bookmarks={effectiveBookmarks}
        uniform={!phases}
      />

      {!isMock && (
        <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          {CONCEPTS.find((c) => c.id === q.concept)?.label}
          {q.difficulty === 'brutal' && (
            <>
              <span style={{ margin: '0 10px' }}>·</span>
              <span style={{ color: 'var(--wrong)', letterSpacing: '0.2em' }}>◆ BRUTAL</span>
            </>
          )}
          {q.difficulty === 'scenario' && (
            <>
              <span style={{ margin: '0 10px' }}>·</span>
              <span style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}>◆ SCENARIO</span>
            </>
          )}
        </div>
      )}

      {q.context && (
        <div style={{
          padding: '18px 22px',
          marginBottom: 24,
          background: 'var(--surface)',
          borderLeft: '3px solid var(--accent)',
          fontSize: 14.5,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          opacity: 0.92,
        }}>
          {q.context}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, margin: '0 0 18px' }}>
        <h2 className="display" style={{ fontSize: 'clamp(22px, 3.2vw, 28px)', lineHeight: 1.35, fontWeight: 500, margin: 0, letterSpacing: '-0.01em', flex: 1 }}>
          {q.difficulty === 'brutal' ? defangBrutalQuestion(q.q) : q.q}
        </h2>
        {(onToggleBookmark || isMock) && (() => {
          const bookmarked = !!effectiveBookmarks[q.id];
          return (
            <button
              type="button"
              onClick={() => handleToggleBookmark(q.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this question'}
              title={bookmarked ? 'Bookmarked — click to remove' : 'Bookmark this question'}
              style={{
                marginTop: 4,
                padding: 6,
                lineHeight: 0,
                color: bookmarked ? '#ff8c1a' : 'var(--text-faint)',
                transition: 'color 0.15s, transform 0.15s',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
                <path
                  d="M3 1.5h14a1 1 0 0 1 1 1v18l-8-5.5-8 5.5v-18a1 1 0 0 1 1-1z"
                  fill={bookmarked ? '#ff8c1a' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })()}
      </div>

      <div style={{
        display: 'inline-block',
        marginBottom: 20,
        padding: '5px 12px',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        border: '1px solid var(--accent-dim)',
        background: 'var(--accent-soft)',
      }}>
        {q.type === 'tf'
          ? 'Choose true or false'
          : selectCount === 1
            ? 'Select 1 answer'
            : `Select ${selectCount} answers`}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          const isCorrectOpt = q.correct.includes(opt.id);
          let cls = 'option-btn';
          if (revealed) {
            if (isCorrectOpt) cls += ' correct';
            else if (isSelected) cls += ' wrong';
          } else if (isSelected) {
            cls += ' selected';
          }
          const letter = q.type === 'tf' ? opt.id.toUpperCase() : String.fromCharCode(65 + i);
          return (
            <button
              key={opt.id}
              className={cls}
              onClick={() => toggleOption(opt.id)}
              disabled={revealed}
            >
              <span className="option-letter">{letter}</span>
              <span style={{ marginLeft: 8 }}>{opt.t}</span>
            </button>
          );
        })}
      </div>

      {isMock ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={prev} disabled={idx === 0}>
            ← Previous
          </button>
          {idx + 1 < questions.length ? (
            <button className="btn primary" onClick={next}>
              Next →
            </button>
          ) : (
            <button className="btn primary" onClick={() => setConfirmSubmit(true)} style={{ borderColor: 'var(--accent)', color: 'var(--bg)', background: 'var(--accent)' }}>
              Submit Exam
            </button>
          )}
          <button className="btn ghost" onClick={() => setConfirmSubmit(true)} style={{ marginLeft: 'auto' }}>
            Submit early
          </button>
          {selectCount > 1 && (
            <span className="mono faint" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
              Selected {selected.length} / {selectCount}
            </span>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={prev} disabled={isAtFirst()}>
            ← Previous
          </button>
          {!revealed && (
            <button className="btn primary" onClick={submit} disabled={!canSubmit}>
              Submit
            </button>
          )}
          <button className="btn primary" onClick={next}>
            {isAtLast() ? 'Finish' : 'Next →'}
          </button>
          {selectCount > 1 && !revealed && (
            <span className="mono faint" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
              Selected {selected.length} / {selectCount}
            </span>
          )}
        </div>
      )}

      {revealed && !isMock && (
        <div className="fade-in" style={{ marginTop: 24 }}>
          <div className={`chip ${wasCorrect ? 'correct' : 'wrong'}`} style={{ marginBottom: 14 }}>
            {wasCorrect ? '✓ Correct' : '✗ Not quite'}
          </div>

          <div className="card" style={{ borderLeft: `3px solid ${wasCorrect ? 'var(--correct)' : 'var(--wrong)'}` }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
              Explanation
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{q.explanation}</p>

            {!wasCorrect && q.distractors && (
              <>
                <div className="rule" style={{ margin: '18px 0' }} />
                <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
                  Why the other options mislead
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(q.distractors).map(([optId, note]) => {
                    const opt = q.options.find((o) => o.id === optId);
                    const i = q.options.indexOf(opt);
                    const letter = q.type === 'tf' ? optId.toUpperCase() : String.fromCharCode(65 + i);
                    return (
                      <li key={optId} style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                        <span className="mono faint" style={{ fontSize: 11, fontWeight: 600 }}>{letter}</span>
                        <span style={{ color: 'var(--text-dim)', lineHeight: 1.55 }}>{note}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsView({ progress, onBack, onReset }) {
  const allQids = QUESTIONS.map((q) => q.id);
  const seen = allQids.filter((id) => progress.questions[id]).length;
  const masteredQs = allQids.filter((id) => {
    const p = progress.questions[id];
    return p && (p.correctCount || 0) >= 2 && (p.correctCount || 0) > (p.wrongCount || 0);
  }).length;
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resetTimer = useRef(null);

  function handleResetClick() {
    if (confirmingReset) {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      setConfirmingReset(false);
      onReset();
    } else {
      setConfirmingReset(true);
      resetTimer.current = setTimeout(() => setConfirmingReset(false), 4000);
    }
  }

  useEffect(() => {
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  return (
    <div className="container-max fade-in">
      <button className="btn ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Back</button>

      <h1 className="display" style={{ fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 500, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Your progress</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          ['Questions seen', `${seen} / ${allQids.length}`],
          ['Questions mastered', `${masteredQs} / ${allQids.length}`],
          ['Total answered', progress.totalAnswered],
          ['Overall accuracy', progress.totalAnswered > 0 ? `${Math.round((progress.totalCorrect / progress.totalAnswered) * 100)}%` : '—'],
        ].map(([label, val]) => (
          <div key={label} className="card" style={{ padding: 20 }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>{label}</div>
            <div className="numeric" style={{ fontSize: 32, lineHeight: 1 }}>{val}</div>
          </div>
        ))}
      </div>

      <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Concept breakdown</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CONCEPTS.map((c) => {
          const m = masteryForConcept(progress, c.id);
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 17, fontWeight: 500 }}>{c.label}</div>
                <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  {m.level} · {m.totalAnswered} answered
                </div>
              </div>
              <div style={{ width: 140, height: 4, background: 'var(--border)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${Math.round(m.coverage * 100)}%`, background: 'var(--accent)' }} />
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-dim)', minWidth: 40, textAlign: 'right' }}>
                {m.totalAnswered > 0 ? `${Math.round(m.accuracy * 100)}%` : '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rule" style={{ margin: '32px 0 20px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div className="mono faint" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Danger zone</div>
        <button
          className="btn"
          onClick={handleResetClick}
          style={{
            borderColor: confirmingReset ? 'var(--wrong)' : 'var(--border)',
            color: confirmingReset ? 'var(--wrong)' : 'var(--text-dim)',
            background: confirmingReset ? 'var(--wrong-soft)' : 'var(--surface)',
          }}
        >
          {confirmingReset ? 'Click again to confirm reset' : 'Reset all progress'}
        </button>
        {confirmingReset && (
          <div className="mono faint fade-in" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
            This will clear all mastery and answer history
          </div>
        )}
      </div>

      <div className="mono faint" style={{ fontSize: 10, letterSpacing: '0.14em', textAlign: 'center' }}>
        Progress stored in this browser · not synced
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   APP ROOT
   ────────────────────────────────────────────────────────────────────────── */

// Default quiz-session shape used by both QuizView (classic) and QuizScreen (arcade).
// Lifted into App so theme toggles preserve mid-quiz progress.
const FRESH_QSESS = {
  idx: 0,
  phaseIdx: 0,
  finished: false,
  sessionCorrect: 0,
  sessionWrong: 0,
  score: 0,                // arcade displays this; 10pts/correct
  mockAnswers: {},         // qid -> selected[] (mock — deferred scoring)
  sessionAnswers: {},      // qid -> { selected, wasCorrect } (non-mock — immediate feedback)
  mockBookmarks: {},       // qid -> bool (mock-attempt scoped)
  mockTimeLeft: 60 * 60,   // mock exam timer (seconds)
  phaseTransition: false,  // concept-quiz inter-phase splash (arcade)
};

export default function App() {
  const [view, setView] = useState('home');
  const [activeConcept, setActiveConcept] = useState(null);
  const [quizSet, setQuizSet] = useState(null);
  const [quizPhases, setQuizPhases] = useState(null);
  const [quizMode, setQuizMode] = useState('mixed');
  const [qsess, setQsess] = useState(FRESH_QSESS);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState('arcade');

  function resetQsess(extra = {}) {
    setQsess({ ...FRESH_QSESS, ...extra });
  }

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setTheme(loadTheme());
    setLoaded(true);
  }, []);

  function switchTheme() {
    setTheme((t) => {
      const next = t === 'arcade' ? 'classic' : 'arcade';
      saveTheme(next);
      return next;
    });
    // Remap views that only exist in one theme so the user lands on a sensible screen
    if (view === 'title') setView('home');     // arcade-only → classic equivalent
    if (view === 'results') setView('home');   // arcade-only → quiz already finalized
  }

  function updateAnswer(qid, correct) {
    setProgress((prev) => {
      const prevQ = prev.questions[qid] || { attempts: 0, correctCount: 0, wrongCount: 0 };
      const newQ = {
        attempts: (prevQ.attempts || 0) + 1,
        correctCount: (prevQ.correctCount || 0) + (correct ? 1 : 0),
        wrongCount: (prevQ.wrongCount || 0) + (correct ? 0 : 1),
        lastSeenAt: Date.now(),
      };
      const next = {
        ...prev,
        questions: { ...prev.questions, [qid]: newQ },
        totalAnswered: (prev.totalAnswered || 0) + 1,
        totalCorrect: (prev.totalCorrect || 0) + (correct ? 1 : 0),
      };
      saveProgress(next);
      return next;
    });
  }

  function resetProgress() {
    const fresh = { ...DEFAULT_PROGRESS, questions: {}, bookmarks: {} };
    setProgress(fresh);
    saveProgress(fresh);
  }

  function toggleBookmark(qid) {
    setProgress((prev) => {
      const prevBookmarks = prev.bookmarks || {};
      const nextBookmarks = { ...prevBookmarks };
      if (nextBookmarks[qid]) delete nextBookmarks[qid];
      else nextBookmarks[qid] = true;
      const next = { ...prev, bookmarks: nextBookmarks };
      saveProgress(next);
      return next;
    });
  }

  function pickConcept(conceptId) {
    setActiveConcept(conceptId);
    setView('lesson');
  }

  function startQuizForConcept(conceptId) {
    const qs = QUESTIONS.filter((q) => q.concept === conceptId);
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const phases = [
      {
        name: 'Core Questions',
        subtitle: 'Recall and comprehension',
        questions: shuffle(qs.filter((q) => !q.difficulty)),
      },
      {
        name: 'Scenario Questions',
        subtitle: 'Applied judgment in context',
        questions: shuffle(qs.filter((q) => q.difficulty === 'scenario')),
      },
      {
        name: 'Brutal Questions',
        subtitle: 'Adversarial phrasing — no capitalization hints',
        questions: shuffle(qs.filter((q) => q.difficulty === 'brutal')),
      },
    ].filter((p) => p.questions.length > 0);
    setQuizSet(null);
    setQuizPhases(phases);
    setQuizMode('concept');
    resetQsess();
    setView('quiz');
  }

  function startQuickQuiz() {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizSet(shuffled);
    setActiveConcept(null);
    setQuizMode('mixed');
    resetQsess();
    setView('quiz');
  }

  function startMockExam() {
    // 80 questions drawn to reflect the real PSPO I weighting —
    // mostly standard difficulty with a realistic mix of harder phrasings.
    const standards = QUESTIONS.filter((q) => !q.difficulty);
    const brutals = QUESTIONS.filter((q) => q.difficulty === 'brutal');
    const scenarios = QUESTIONS.filter((q) => q.difficulty === 'scenario');
    const shuffledStd = [...standards].sort(() => Math.random() - 0.5);
    const shuffledBrutal = [...brutals].sort(() => Math.random() - 0.5);
    const shuffledScenario = [...scenarios].sort(() => Math.random() - 0.5);
    // Target mix: ~55 standard, ~15 brutal, ~10 scenario (reflecting real exam difficulty distribution)
    const picked = [
      ...shuffledStd.slice(0, 55),
      ...shuffledBrutal.slice(0, 15),
      ...shuffledScenario.slice(0, 10),
    ].sort(() => Math.random() - 0.5);
    setQuizSet(picked);
    setActiveConcept(null);
    setQuizMode('mock');
    resetQsess();
    setView('quiz');
  }

  function startReview() {
    const queue = Object.entries(progress.questions)
      .filter(([, p]) => {
        const wrong = p.wrongCount || 0;
        const right = p.correctCount || 0;
        return wrong > right || (wrong > 0 && right < 2);
      })
      .map(([qid]) => QUESTIONS.find((q) => q.id === qid))
      .filter(Boolean);

    if (queue.length === 0) {
      setView('home');
      return;
    }
    setQuizSet(queue.sort(() => Math.random() - 0.5));
    setActiveConcept(null);
    setQuizMode('review');
    resetQsess();
    setView('quiz');
  }

  function exitQuiz() {
    setView('home');
    setQuizSet(null);
    setQuizPhases(null);
    setActiveConcept(null);
    setQuizMode('mixed');
    resetQsess();
  }

  if (!loaded) {
    return (
      <div className="pspo-root grainy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <style>{STYLE}</style>
        <div className="mono faint" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading…</div>
      </div>
    );
  }

  if (theme === 'arcade') {
    return (
      <>
        <style>{ARCADE_STYLE}</style>
        <ArcadeShell
          view={view}
          activeConcept={activeConcept}
          quizPhases={quizPhases}
          quizQuestions={quizSet}
          quizMode={quizMode}
          qsess={qsess}
          setQsess={setQsess}
          progress={progress}
          onAnswer={updateAnswer}
          onToggleBookmark={toggleBookmark}
          onSwitchTheme={switchTheme}
          onPickConcept={pickConcept}
          onStartConceptQuiz={startQuizForConcept}
          onStartQuickQuiz={startQuickQuiz}
          onStartMockExam={startMockExam}
          onStartReview={startReview}
          onSetView={setView}
          onExitQuiz={exitQuiz}
        />
      </>
    );
  }

  return (
    <div className="pspo-root grainy">
      <style>{STYLE}</style>
      <Header
        stats={progress}
        onNav={(v) => { setView(v); setActiveConcept(null); setQuizSet(null); }}
        currentView={view}
        onToggleTheme={switchTheme}
      />

      {view === 'home' && (
        <HomeView
          progress={progress}
          onPickConcept={pickConcept}
          onStartReview={startReview}
          onStartQuick={startQuickQuiz}
          onStartMock={startMockExam}
        />
      )}

      {view === 'lesson' && activeConcept && (
        <LessonView
          conceptId={activeConcept}
          onStart={() => startQuizForConcept(activeConcept)}
          onBack={exitQuiz}
        />
      )}

      {view === 'quiz' && (quizSet || quizPhases) && (
        <QuizView
          questions={quizSet}
          phases={quizPhases}
          progress={progress}
          onComplete={updateAnswer}
          onBack={exitQuiz}
          mode={quizMode}
          conceptId={activeConcept}
          onToggleBookmark={toggleBookmark}
          qsess={qsess}
          setQsess={setQsess}
        />
      )}

      {view === 'review' && (
        <div className="container-max fade-in">
          <h1 className="display" style={{ fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.02em' }}>Review queue</h1>
          <p className="dim" style={{ fontSize: 16, maxWidth: 540, marginTop: 0 }}>
            Questions you've answered incorrectly, or haven't yet answered correctly twice. Closer to real mastery than one-shot accuracy.
          </p>
          <button className="btn primary" onClick={startReview} style={{ marginTop: 16 }}>Start Review →</button>
        </div>
      )}

      {view === 'stats' && <StatsView progress={progress} onBack={() => setView('home')} onReset={resetProgress} />}
    </div>
  );
}
