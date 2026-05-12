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
      { label: 'C.F.O.R.C.', text: 'The five values. Commitment, Focus, Openness, Respect, Courage — the Scrum Guide\'s canonical order.' }
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
      },
      {
        heading: 'Stakeholders: working with them, not for them',
        body: `Stakeholders are everyone outside the Scrum Team with an interest in the product — users, customers, sponsors, compliance, sales, support, leadership. They are not part of the Scrum Team, but the PO works with them constantly.

The PO's job is to take stakeholder input, weigh it against the Product Goal, and make ordering decisions. Not every stakeholder request becomes a Backlog item. Not every "urgent" request is actually urgent. A PO who says yes to everything has no Product Goal — they have a list of demands sorted by who shouted last.

Key principles:

Continuous engagement, not formal gates. Stakeholder feedback flows in throughout the Sprint and at the Sprint Review. There are no approval ceremonies — only inspection and adaptation, the same as everywhere else in Scrum.

The PO owns the relationship. The Scrum Master doesn't shield the team from stakeholders by acting as a gatekeeper; the PO faces them directly. The SM coaches stakeholders on Scrum when their behavior conflicts with it, but communication itself sits with the PO.

The Sprint Review is the formal inspection point, not an approval ceremony. Stakeholders attend, inspect the Increment, give feedback, and discuss what to do next. They don't "sign off" — there is no sign-off in Scrum. The Product Backlog is adapted based on what was learned.

Transparency over politics. The Product Backlog should be visible and understandable to anyone who asks. Hiding it (or maintaining a "real" backlog separately from a "shown" one) destroys trust and corrupts ordering.

Ordering authority stays with the PO. Stakeholders can lobby, suggest, complain — but they don't reorder the Backlog. If the organization routinely overrides PO ordering, that's an organizational impediment, not a PO failure. Coaching leadership on this is part of the Scrum Master's "serving the organization" accountability.`,
        example: {
          title: 'The escalating stakeholder',
          body: `A senior stakeholder pushes the PO to add a feature mid-Sprint, citing a "critical customer." The PO has three healthy moves:

(1) Ask what outcome the stakeholder is trying to achieve. Often the requested feature isn't the only path, and the real outcome can be served differently.

(2) Make the trade-off explicit. Adding this means displacing what — and is the stakeholder willing to own that decision in front of the team whose Sprint Goal is being scrapped?

(3) Default to "next Sprint, not this one." Mid-Sprint scope swaps should be rare. The Product Backlog is the queue; the next Sprint Planning is the venue.

What the PO does NOT do: silently accept, escalate to the SM, or quietly add it to the Sprint Backlog and ask Developers to absorb it.`
        }
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
      'For the PO to succeed, the organization must respect their decisions. If leadership routinely overrides the PO, that\'s an organizational impediment — not a PO failure.',
      'Stakeholder engagement is the PO\'s job, not the SM\'s. The SM coaches stakeholders on Scrum; the PO has the conversations about what to build and when.',
      'There is no "sign-off" in Scrum. Stakeholders inspect the Increment at the Sprint Review and give feedback. The PO decides what changes in the Product Backlog as a result.',
      'When competing stakeholder demands collide, the PO\'s tool is the Product Goal. Items that serve it move up; items that don\'t, regardless of how loudly they\'re requested, do not.'
    ],
    keyPoints: [
      'Develops and explicitly communicates the Product Goal.',
      'Creates and clearly communicates Product Backlog items.',
      'Orders Product Backlog items.',
      'Ensures the Product Backlog is transparent, visible, and understood.',
      'The PO may delegate the above work but remains accountable.',
      'For the PO to succeed, the entire organization must respect their decisions.',
      'Engages stakeholders continuously — gathering input, communicating trade-offs, making ordering decisions transparent.'
    ],
    traps: [
      'The PO does NOT own the Definition of Done — the Scrum Team does, or the organization provides it.',
      'The PO does NOT estimate Product Backlog items — the Developers do.',
      'Value ≠ velocity. Velocity increases never indicate product value increases.',
      'Not a Project Manager. No authority to assign tasks, track hours, or manage Developers.',
      'Required to attend the Sprint Retrospective (as a Scrum Team member).',
      'The Sprint Review is not a sign-off or approval gate. There is no "stakeholder acceptance" in Scrum.',
      'The PO does NOT shield the team from stakeholders, and the SM is not a stakeholder gatekeeper. Direct PO-stakeholder communication is the norm.'
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
      'Three parts: the Sprint Goal (why), the selected Product Backlog items (what), and an actionable plan for delivering the Increment (how).',
      'Owned exclusively by the Developers — created at Sprint Planning, updated throughout the Sprint as more is learned.',
      'The Sprint Goal is committed; the selected items are a forecast (scope can flex through PO collaboration, the Goal cannot without Sprint cancellation).',
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
      },
      {
        heading: 'Usable vs released — a critical distinction',
        body: `These two often get confused, and the exam tests the difference. They are not the same thing.

Usable means the Increment meets the Definition of Done. It is in a state where it could be released — quality is verified, the work is complete by the team's standard. This is the framework's structural requirement: every Increment, every Sprint, must be usable.

Released means the Increment has actually been delivered to users — deployed, shipped, made available. This is a Product Owner decision, governed by business considerations: market timing, regulatory windows, customer readiness, marketing, support capacity, batch size, and risk.

The relationship between them: an Increment must be usable to be released, but it does not need to be released to be a valid Increment. The Scrum Team produces usability; the PO chooses release timing.

Two practical consequences:

(1) Multiple Increments per Sprint are not only allowed — they're encouraged. Release when it makes sense to release, not when the Sprint happens to end. A team producing five usable Increments mid-Sprint and releasing three of them on day 4, day 7, and day 9 is doing Scrum correctly.

(2) "Done" is not "released." A team that ships every Increment and a team that ships none can both be doing Scrum correctly — what matters is that every Increment meets the DoD, not that every Increment goes to production.`,
        example: {
          title: 'When usable doesn\'t mean released',
          body: `A regulated healthcare product. Every Sprint produces a usable Increment that passes all internal verification (DoD met). But releases are gated by external audits that happen quarterly.

Between audits, the team continues producing usable Increments — accumulating value internally, integrating with prior work, ready to release the moment the audit clears. That's correct Scrum.

The wrong pattern: treating "we can't release yet" as a reason to skip the Definition of Done or defer integration. The Increment must remain usable each Sprint regardless of release cadence — otherwise the team loses the ability to release on demand when the window opens.`
        }
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
      'The DoD cannot be changed mid-Sprint — that would invalidate prior work. Retrospective is the place to adjust it.',
      'Usable ≠ released. The Scrum Team produces usable Increments every Sprint; the PO decides when to release.'
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
      'The Product Goal lives in the Product Backlog. It\'s not a separate artifact.',
      'A Sprint that produces no released Increment can still be a valid Scrum Sprint — provided a usable Increment was created. Release timing is a PO decision based on business context.'
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
  evidence_based_management: {
    intro: `Scrum is empirical: inspect and adapt. But what do you inspect? Output? Activity? Effort? None of those measure value. Evidence-Based Management (EBM) is the framework Scrum.org built to give Product Owners a disciplined way to measure value and steer toward it. It is to product management what empiricism is to process: a refusal to mistake activity for outcome.`,
    sections: [
      {
        heading: 'Why measure value, not output',
        body: `Most product organizations measure what's easy: features shipped, stories closed, velocity, hours logged. These are output metrics — they tell you the team is busy. They don't tell you whether the product is succeeding.

EBM starts from a different question: what is the product producing for users, customers, and the business? Real outcomes. Real evidence. Then it asks: what is the product capable of producing that it isn't producing yet? The gap between those two — the opportunity — is what a Product Owner is paid to close.

This framing matters because empirical product management requires empirical data. You can't inspect "feels good." You can't adapt based on "stakeholders seem happy." EBM defines the categories of evidence and the kinds of measures that make value transparent enough to actually inspect.`
      },
      {
        heading: 'The four Key Value Areas (KVAs)',
        body: `EBM organizes value measurement into four Key Value Areas. Memorize them — they are the EBM equivalent of pillars-and-values in Scrum theory.

Current Value (CV) — what value does the product deliver to users and the organization today? Customer satisfaction, employee satisfaction, revenue per employee, product cost ratio. CV answers "is this product worth having right now?"

Unrealized Value (UV) — what additional value could the product deliver if its full potential were captured? Market share, customer satisfaction gap, untapped customer segments. UV answers "what value is on the table that we haven't captured?"

Ability to Innovate (A2I) — how effectively can the team deliver new capability? Technical debt, defect trends, time spent on production support, version compatibility. A2I answers "can we keep changing the product, or has it ossified?"

Time-to-Market (T2M) — how quickly can the organization learn and respond? Release frequency, cycle time, lead time, time-to-learn, time-to-fix. T2M answers "how fast can we test a hypothesis and act on the result?"

The four together: CV and UV describe the value position (what the product is worth and what it could be worth). A2I and T2M describe the value-delivery capability (the team's ability to capture UV and protect CV).`,
        example: {
          title: 'When two of the four conflict',
          body: `A product has very high Current Value (paying customers love it, revenue is strong). But Ability to Innovate is collapsing — technical debt has grown so heavy that any change risks breaking something else. Time-to-Market is also degrading.

A PO measuring only CV would feel great. EBM forces the question: how long can high CV last when A2I is gone? Probably not long. Competitors will out-iterate; a major change in user need will arrive and the team won't be able to respond.

The intervention isn't more features. It's investing in A2I — paying down debt, restoring delivery capability, recovering Time-to-Market. Short-term CV may dip slightly; long-term CV survives.

EBM exists precisely so a PO can have this conversation with leadership using evidence, not intuition.`
        }
      },
      {
        heading: 'Key Value Measures (KVMs)',
        body: `Each KVA is measured through Key Value Measures — concrete metrics the team picks based on its product and context. EBM doesn't prescribe a fixed set; it provides categories and example measures.

Common examples by KVA (these are the official measures from Scrum.org's EBM Guide):

Current Value: revenue per employee, product cost ratio, employee satisfaction, customer satisfaction (NPS / CSAT), customer usage index.

Unrealized Value: market share, customer or user satisfaction gap (gap between desired and current experience), product/service gap (gap between current and desired value provided by the product).

Ability to Innovate: innovation rate (effort going to new value vs. maintenance), defect trends, on-product index (fraction of team time actually spent on the product vs. other work), installed version index (how many product versions are running across the install base), technical debt indicators, production incident trends, active product index (the proportion of the product\'s code or features actually being used).

Time-to-Market: build and integration frequency, release frequency, release stabilization period, mean time to repair (MTTR), customer cycle time, lead time, time to learn (idea → validated user feedback).

A team typically picks 1–3 measures per KVA — enough for signal, not so many that nobody looks at them. The measures should drive decisions, not just decorate dashboards.`
      },
      {
        heading: 'EBM as a feedback loop',
        body: `EBM isn't a one-time measurement exercise. It's a continuous cycle, parallel to Scrum's empiricism cycle:

(1) Set a strategic goal — typically tied to closing a gap in one of the KVAs (e.g., "reduce customer satisfaction gap from 30 points to 10 points").

(2) Pick intermediate goals and KVMs that signal progress toward it.

(3) Run experiments (Sprints, features, releases) aimed at moving those measures.

(4) Inspect the measures. Did the intervention work?

(5) Adapt: continue, change, or stop.

This is the same shape as Sprint inspect-and-adapt, but at the product-strategy level. EBM measures answer: "Is the Product Goal still the right Product Goal? Is the Backlog ordering still the right ordering?"

For PSPO·I, the depth required is: know the four KVAs, what each measures, the difference between value and output, and how EBM supports a PO's accountability for maximizing value.`
      },
      {
        heading: 'What EBM is not',
        body: `EBM is not a prescribed set of metrics. The Scrum Guide doesn't require it; Scrum.org publishes EBM as a complementary framework. A team is not "doing EBM wrong" because they don't measure NPS — they're doing it wrong if they don't measure value at all.

EBM is not output measurement dressed up. Counting story points completed is not Current Value. Tracking velocity is not Time-to-Market. The point of EBM is to break the habit of confusing activity with outcome — using EBM categories as fancy labels for the same old output metrics misses the point entirely.

EBM is not a one-time audit. The categories matter because they create a structured ongoing inspection. A PO running EBM picks measures, sets goals, makes hypotheses, inspects results, and adapts — every Sprint, every release, every quarter.`
      }
    ],
    mnemonics: [
      { label: 'C.U.A.T.', text: 'The four KVAs in order. Current Value, Unrealized Value, Ability to Innovate, Time-to-Market.' },
      { label: 'Today vs Tomorrow · Capability', text: 'CV and UV describe value (today vs. potential). A2I and T2M describe capability to deliver it.' },
      { label: 'Outcome > Output', text: 'EBM is the discipline of measuring outcome. Output (velocity, hours, features) is what you produce; outcome is what users and the business actually get.' }
    ],
    tips: [
      'On the exam, "EBM" or "Evidence-Based Management" will appear with one or more of the four KVAs. Know the names cold.',
      'If a question lists "velocity" or "story points completed" as a value measure, it\'s a trap. Those are output, not outcome.',
      'Current Value asks about TODAY. Unrealized Value asks about the GAP between today and potential. Don\'t conflate them.',
      'Time-to-Market is about LEARNING speed (how fast the team can test a hypothesis and adapt), not just deployment speed.',
      'Ability to Innovate often surfaces in scenario questions as "the team can\'t respond to changes anymore" — that\'s an A2I problem, almost always rooted in unmanaged technical debt or process drag.',
      'EBM is the PO\'s strategic toolkit; it complements Scrum rather than replacing any of it. Scrum still runs Sprint-to-Sprint; EBM measures the product\'s direction.'
    ],
    keyPoints: [
      'Evidence-Based Management is Scrum.org\'s complementary framework for measuring product value and steering toward it empirically.',
      'Four Key Value Areas (KVAs): Current Value, Unrealized Value, Ability to Innovate, Time-to-Market.',
      'Each KVA is measured by Key Value Measures (KVMs) — concrete metrics the team chooses for its context.',
      'CV and UV describe the value position; A2I and T2M describe the team\'s capability to capture value.',
      'EBM separates outcome (what users and the business get) from output (what the team produces).',
      'It supports the Product Owner\'s accountability for maximizing value by giving evidence to inspect and adapt against.'
    ],
    traps: [
      'Velocity, story points, and hours logged are output metrics — not EBM measures.',
      'EBM is not prescribed by the Scrum Guide. It\'s a Scrum.org complementary framework.',
      'Current Value ≠ Unrealized Value. CV is what the product delivers TODAY; UV is the GAP between today and full potential.',
      'Time-to-Market includes how fast the team can LEARN (test a hypothesis and adapt), not just how fast it can deploy code.',
      'Picking many measures is not the goal. A few measures that actually drive decisions beat a dashboard nobody acts on.',
      'EBM is continuous, not a one-time audit. The point is to inspect and adapt the product\'s direction over time.'
    ]
  },
};
