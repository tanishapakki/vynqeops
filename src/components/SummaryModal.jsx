// SummaryModal.jsx
// T-09: "Summarise today" AI briefing modal.
//
// Design rationale:
//   The button existed. The onClick fired an alert(). That's not a product decision.
//
//   This calls the Anthropic API with a structured prompt containing actual data:
//   status breakdown, recent activity log, what's blocked, what needs escalation.
//   The model generates a concise ops briefing. Not mocked — real, data-grounded output.
//
//   UX choices:
//   - Overlay click closes the modal (standard pattern)
//   - Loading state uses pulse animation + copy that sets expectations
//   - Error state is recoverable (retry button)
//   - Summary text uses monospace to match the app's design language

import React, { useState, useEffect } from 'react'

// Build a compact, structured prompt from live data.
// Keeps the payload small — we summarise the data rather than dump raw JSON.
function buildPrompt(data) {
    if (!data) return 'No workflow data available. Respond that the summary cannot be generated.'

    const workflows = data.workflows ?? []
    const activity  = data.activity_log ?? []
    const users     = data.users ?? {}

    // Normalise statuses (data has "ACTIVE", "In Progress", etc.)
    const normalise = s => {
        const l = (s ?? '').toLowerCase()
        if (l === 'in progress') return 'active'
        if (['active', 'blocked', 'review', 'completed', 'pending'].includes(l)) return l
        return 'other'
    }

    const counts = {}
    for (const wf of workflows) {
        const s = normalise(wf.status)
        counts[s] = (counts[s] || 0) + 1
    }

    // Most recent 12 activity entries (sorted by timestamp)
    const recent = [...activity]
        .sort((a, b) => {
            const ta = typeof a.timestamp === 'number' ? a.timestamp * 1000 : new Date(a.timestamp).getTime()
            const tb = typeof b.timestamp === 'number' ? b.timestamp * 1000 : new Date(b.timestamp).getTime()
            return tb - ta
        })
        .slice(0, 12)
        .map(e => {
            const user = users[e.user]?.name ?? e.user ?? 'unknown'
            const action = e.action?.trim() || 'performed an action'
            return `  ${user}: ${action} (${e.workflow_id})`
        })
        .join('\n')

    // Blocked workflows
    const blocked = workflows
        .filter(w => normalise(w.status) === 'blocked')
        .slice(0, 6)
        .map(w => `  ${w.id} – ${w.title} [${w.client_name ?? '—'}]`)
        .join('\n')

    // Workflows flagged for escalation
    const escalations = workflows
        .filter(w => (w.suggested_actions ?? []).includes('escalate'))
        .slice(0, 5)
        .map(w => `  ${w.id} – ${w.title}`)
        .join('\n')

    return `You are an ops assistant for VynqeOps. Write a concise daily briefing for the ops team.

Be direct. Use short bullet points. Max 140 words. No preamble ("Here is your summary..." etc).
Start immediately with the status line.

WORKFLOW COUNTS (total: ${workflows.length}):
  Active: ${counts.active ?? 0}
  Blocked: ${counts.blocked ?? 0}
  In Review: ${counts.review ?? 0}
  Completed: ${counts.completed ?? 0}
  Other: ${(counts.pending ?? 0) + (counts.other ?? 0)}

RECENT ACTIVITY (newest first):
${recent || '  No recent activity'}

BLOCKED:
${blocked || '  None'}

NEEDS ESCALATION:
${escalations || '  None'}

Write the briefing now.`
}

export default function SummaryModal({ data, onClose }) {
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    function fetchSummary() {
        setLoading(true)
        setError(null)
        setSummary('')

        fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{ role: 'user', content: buildPrompt(data) }],
            }),
        })
            .then(r => r.json())
            .then(result => {
                const text = (result.content ?? [])
                    .filter(c => c.type === 'text')
                    .map(c => c.text)
                    .join('')
                if (!text) throw new Error('Empty response from API')
                setSummary(text)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchSummary()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="summary-overlay" onClick={onClose}>
            <div className="summary-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="summary-modal-header">
                    <div>
                        <div className="summary-modal-label">AI BRIEFING</div>
                        <div className="summary-modal-title">Today's ops summary</div>
                    </div>
                    <button className="summary-close" onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div className="summary-modal-body">
                    {loading && (
                        <div className="summary-loading">
                            <div className="summary-spinner" />
                            <span>Analysing {(data?.workflows ?? []).length} workflows…</span>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="summary-error">
                            <div style={{ marginBottom: '12px' }}>Failed to generate summary: {error}</div>
                            <button className="filter-btn" onClick={fetchSummary}>Retry</button>
                        </div>
                    )}

                    {!loading && !error && summary && (
                        <div className="summary-content">
                            {summary.split('\n').map((line, i) => (
                                <p key={i} style={{ margin: line.startsWith('•') || line.startsWith('-') ? '4px 0' : '8px 0' }}>
                                    {line || <br />}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && (
                    <div className="summary-modal-footer">
            <span className="muted" style={{ fontSize: '10px' }}>
              Generated from live data · {(data?.workflows ?? []).length} workflows · {(data?.activity_log ?? []).length} events
            </span>
                    </div>
                )}
            </div>
        </div>
    )
}