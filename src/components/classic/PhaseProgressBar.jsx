import React from 'react';

export function PhaseProgressBar({ phases, phaseIdx, questionIdx, onJump, answered, bookmarks }) {
  const total = phases.reduce((s, p) => s + p.questions.length, 0);

  return (
    <div
      role="navigation"
      aria-label="Question navigator"
      style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}
    >
      {phases.map((phase, pIdx) => {
        const offset = phases.slice(0, pIdx).reduce((s, p) => s + p.questions.length, 0);
        return (
          <React.Fragment key={pIdx}>
            {pIdx > 0 && (
              <span aria-hidden="true" style={{
                width: 1, height: 16, background: 'var(--border-hi)', margin: '0 2px',
              }} />
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
              {phase.questions.map((q, qIdx) => {
                const gIdx = offset + qIdx;
                const isCurrent = pIdx === phaseIdx && qIdx === questionIdx;
                const a = answered && q?.id ? answered[q.id] : null;
                const isAnswered = !!a;
                const wasCorrect = a && typeof a === 'object' && !Array.isArray(a) ? a.wasCorrect : null;
                const isBookmarked = !!(bookmarks && q?.id && bookmarks[q.id]);

                let cls = 'pspo-qtile';
                if (isCurrent) cls += ' is-current';
                else if (isAnswered && wasCorrect === true) cls += ' is-correct';
                else if (isAnswered && wasCorrect === false) cls += ' is-wrong';
                else if (isAnswered) cls += ' is-answered';
                if (isBookmarked) cls += ' is-bookmarked';

                const stateLabel = isAnswered
                  ? (wasCorrect === true ? 'answered correctly'
                     : wasCorrect === false ? 'answered incorrectly'
                     : 'answered')
                  : 'unanswered';
                const ariaLabel = `Go to question ${gIdx + 1} of ${total}, ${stateLabel}${isBookmarked ? ', bookmarked' : ''}${isCurrent ? ', current' : ''}`;

                return (
                  <button
                    key={qIdx}
                    type="button"
                    className={cls}
                    onClick={onJump ? () => onJump(pIdx, qIdx) : undefined}
                    aria-label={ariaLabel}
                    aria-current={isCurrent ? 'true' : undefined}
                  >
                    {gIdx + 1}
                  </button>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
