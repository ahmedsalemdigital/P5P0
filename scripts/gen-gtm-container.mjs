/* Generate the GTM container.json that wires every event documented in
 * ANALYTICS.md to GA4. Edit the constants below if the tracking plan
 * changes, then `npm run docs:gtm` to regenerate `.gtm/container.json`.
 * Import into GTM via Admin → Import Container → Merge → "Rename
 * conflicting tags, triggers, and variables".
 *
 * ─── Enum casing rule (the hard-learned part) ─────────────────────────
 * GTM's import-format deserializer treats certain `type` fields as
 * protobuf enums and rejects camelCase even though the REST API docs
 * spell them that way. Protobuf-enum fields need SCREAMING_SNAKE_CASE.
 * String-identifier fields stay lowercase. Map of fields:
 *
 *   ENUM (use SCREAMING_SNAKE_CASE):
 *     Parameter.type          → TEMPLATE | INTEGER | BOOLEAN | LIST | MAP
 *                               | TAG_REFERENCE | TRIGGER_REFERENCE
 *     Condition.type          → EQUALS | CONTAINS | MATCH_REGEX | …
 *     Trigger.type (EventType)→ CUSTOM_EVENT | PAGEVIEW | INIT | …
 *     Tag.tagFiringOption     → ONCE_PER_EVENT | UNLIMITED | ONCE_PER_LOAD
 *     BuiltInVariable.type    → EVENT | PAGE_URL | CLICK_ELEMENT | …
 *     Container.usageContext  → WEB | IOS | ANDROID | …
 *
 *   STRING IDENTIFIER (stays lowercase):
 *     Tag.type                → gaawe | googtag | html | …
 *     Variable.type           → v | c | j | gas | …
 *
 * If GTM rejects the import with "Error deserializing enum type [X]",
 * the offending field is in the ENUM column and needs uppercasing.
 * ──────────────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import path from 'node:path';

const CONTAINER_PUBLIC_ID = 'GTM-THK4XJZW';
const MEASUREMENT_ID = 'G-WB97T5NR8S';

// Per-event parameters. Keep in lockstep with ANALYTICS.md §1.
const EVENT_PARAMS = {
  page_view:          ['page_path', 'page_title', 'page_location'],
  theme_switch:       ['from', 'to'],
  concept_view:       ['concept_id', 'concept_label'],
  quiz_start:         ['mode', 'concept_id', 'concept_label', 'question_count'],
  quiz_complete:      ['mode', 'concept_id', 'concept_label', 'score_pct', 'correct_count', 'wrong_count', 'total_questions', 'time_used_sec', 'verdict'],
  quiz_pass:          ['mode', 'concept_id', 'concept_label', 'score_pct', 'correct_count', 'wrong_count', 'total_questions', 'time_used_sec', 'verdict'],
  mock_exam_complete: ['mode', 'concept_id', 'concept_label', 'score_pct', 'correct_count', 'wrong_count', 'total_questions', 'time_used_sec', 'verdict'],
  concept_mastered:   ['concept_id', 'concept_label'],
  achievement_unlocked: ['achievement_id', 'achievement_name'],
  quiz_abandon:       ['mode', 'concept_id', 'concept_label', 'question_count', 'answered_count'],
  question_answer:    ['question_id', 'concept_id', 'concept_label', 'mode', 'correct', 'question_type', 'difficulty', 'attempt_number'],
  question_bookmark:  ['question_id', 'concept_id', 'concept_label', 'bookmarked', 'mode'],
};

// User properties set via the set_user_properties event.
const USER_PROPERTIES = ['theme', 'concepts_mastered', 'total_progress_pct'];

// GA4's conventional "value" mirrors score_pct on these events.
const EVENTS_WITH_VALUE = new Set(['quiz_complete', 'quiz_pass', 'mock_exam_complete']);

// Unique data-layer keys we need to read (event params ∪ user properties).
const dlvKeys = Array.from(new Set([
  ...Object.values(EVENT_PARAMS).flat(),
  ...USER_PROPERTIES,
])).sort();

let nextId = 100;
const id = () => String(nextId++);

const variables = dlvKeys.map((p) => ({
  variableId: id(),
  name: `dlv_${p}`,
  type: 'v',
  parameter: [
    { type: 'INTEGER', key: 'dataLayerVersion', value: '2' },
    { type: 'BOOLEAN', key: 'setDefaultValue', value: 'false' },
    { type: 'TEMPLATE', key: 'name', value: p },
  ],
  fingerprint: '0',
}));

const dlvRef = (p) => `{{dlv_${p}}}`;

const triggers = [];
const allTriggerEvents = [...Object.keys(EVENT_PARAMS), 'set_user_properties'];
for (const eventName of allTriggerEvents) {
  triggers.push({
    triggerId: id(),
    name: `CE — ${eventName}`,
    type: 'CUSTOM_EVENT',
    customEventFilter: [
      {
        type: 'EQUALS',
        parameter: [
          { type: 'TEMPLATE', key: 'arg0', value: '{{_event}}' },
          { type: 'TEMPLATE', key: 'arg1', value: eventName },
        ],
      },
    ],
    fingerprint: '0',
  });
}
const triggerIdByEvent = Object.fromEntries(
  triggers.map((t) => [t.name.replace('CE — ', ''), t.triggerId]),
);

const tags = [];

// Google Tag base config — fires on Initialization (built-in trigger 2147479573).
tags.push({
  tagId: id(),
  name: 'GA4 — Google tag (base config)',
  type: 'googtag',
  parameter: [
    { type: 'TEMPLATE', key: 'tagId', value: MEASUREMENT_ID },
    {
      type: 'LIST',
      key: 'configSettingsTable',
      list: [
        {
          type: 'MAP',
          map: [
            { type: 'TEMPLATE', key: 'parameter', value: 'send_page_view' },
            { type: 'TEMPLATE', key: 'parameterValue', value: 'false' },
          ],
        },
      ],
    },
  ],
  firingTriggerId: ['2147479573'],
  tagFiringOption: 'ONCE_PER_EVENT',
  fingerprint: '0',
});

// One GA4 Event tag per app event.
for (const [eventName, params] of Object.entries(EVENT_PARAMS)) {
  const eventParameters = params.map((p) => ({
    type: 'MAP',
    map: [
      { type: 'TEMPLATE', key: 'name', value: p },
      { type: 'TEMPLATE', key: 'value', value: dlvRef(p) },
    ],
  }));
  if (EVENTS_WITH_VALUE.has(eventName)) {
    eventParameters.push({
      type: 'MAP',
      map: [
        { type: 'TEMPLATE', key: 'name', value: 'value' },
        { type: 'TEMPLATE', key: 'value', value: dlvRef('score_pct') },
      ],
    });
  }
  tags.push({
    tagId: id(),
    name: `GA4 — ${eventName}`,
    type: 'gaawe',
    parameter: [
      { type: 'TEMPLATE', key: 'eventName', value: eventName },
      { type: 'TEMPLATE', key: 'measurementIdOverride', value: MEASUREMENT_ID },
      { type: 'LIST', key: 'eventParameters', list: eventParameters },
    ],
    firingTriggerId: [triggerIdByEvent[eventName]],
    tagFiringOption: 'ONCE_PER_EVENT',
    fingerprint: '0',
  });
}

// Dedicated tag that maps user properties off set_user_properties events.
tags.push({
  tagId: id(),
  name: 'GA4 — set user properties',
  type: 'gaawe',
  parameter: [
    { type: 'TEMPLATE', key: 'eventName', value: 'set_user_properties' },
    { type: 'TEMPLATE', key: 'measurementIdOverride', value: MEASUREMENT_ID },
    {
      type: 'LIST',
      key: 'userProperties',
      list: USER_PROPERTIES.map((p) => ({
        type: 'MAP',
        map: [
          { type: 'TEMPLATE', key: 'name', value: p },
          { type: 'TEMPLATE', key: 'value', value: dlvRef(p) },
        ],
      })),
    },
  ],
  firingTriggerId: [triggerIdByEvent['set_user_properties']],
  tagFiringOption: 'ONCE_PER_EVENT',
  fingerprint: '0',
});

const container = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString(),
  containerVersion: {
    accountId: '0',
    containerId: '0',
    containerVersionId: '0',
    name: 'PSPO·I Trainer — analytics rollout',
    description: 'Auto-generated by scripts/gen-gtm-container.mjs. Do not edit by hand.',
    container: {
      accountId: '0',
      containerId: '0',
      name: 'PSPO·I Trainer',
      publicId: CONTAINER_PUBLIC_ID,
      usageContext: ['WEB'],
      fingerprint: '0',
    },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [
      { accountId: '0', containerId: '0', type: 'EVENT', name: 'Event' },
    ],
    fingerprint: '0',
  },
};

const out = path.resolve('.gtm/container.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(container, null, 2) + '\n');
console.log(`Wrote ${out}`);
console.log(`  variables: ${variables.length}`);
console.log(`  triggers:  ${triggers.length}`);
console.log(`  tags:      ${tags.length}`);
