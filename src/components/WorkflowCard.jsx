// WorkflowCard.jsx
// T-08 additions:
//   - Quick-action button: surfaces the first suggested_action directly on the card.
//     Click fires the action without opening the detail panel (stopPropagation).
//   - Urgency indicator: cards with 'escalate' in suggested_actions get a red left
//     border; 'mark_blocked' gets yellow. Lets ops staff triage at a glance.
//   - onAction prop wired through from App.jsx

import React from 'react'
import StatusBadge from './StatusBadge'

// Human-readable label for the primary quick action shown on the card.
// Only the most visible actions are labelled here — rare ones fall back to key.
const QUICK_ACTION_LABELS = {
    send_update:     'Send update',
    escalate:        'Escalate',
    request_review:  'Request review',
    mark_blocked:    'Mark blocked',
    archive:         'Archive',
    assign_owner:    'Assign owner',
    reassign:        'Reassign',
    clarify_owner:   'Clarify owner',
    flag_data_issue: 'Flag issue',
}

function formatDate(ts) {
    if (!ts) return '—'
    try {
        const d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts)
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    } catch {
        return '—'
    }
}

// Derive urgency from suggested_actions — used for the card's left border colour.
function getUrgency(actions) {
    if (!actions?.length) return null
    if (actions.includes('escalate')) return 'high'
    if (actions.includes('mark_blocked') || actions.includes('flag_data_issue')) return 'medium'
    return null
}

export default function WorkflowCard({ workflow, isSelected, onClick, onAction }) {
    const assigneeName = workflow.assignee?.name ?? 'Unassigned'
    const tags         = Array.isArray(workflow.tags) ? workflow.tags : []
    const progressVal  = Math.min(100, Number(workflow.progress) || 0)

    const suggestedActions = workflow.suggested_actions ?? []
    const primaryAction    = suggestedActions[0] ?? null
    const urgency          = getUrgency(suggestedActions)

    const urgencyBorder = {
        high:   '2px solid var(--status-blocked)',
        medium: '2px solid var(--status-review)',
    }

    return (
        <div
            className={`workflow-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(workflow)}
            style={urgency ? { borderLeft: urgencyBorder[urgency] } : undefined}
        >
            {/* Header row: ID + status badge */}
            <div className="card-header">
                <span className="card-id">{workflow.id}</span>
                <StatusBadge status={workflow.status} />
            </div>

            {/* Title + client */}
            <div>
                <div className="card-title">{workflow.title}</div>
                <div className="card-client">{workflow.client_name}</div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-wrap">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progressVal}%` }}
                />
            </div>

            {/* Assignee + progress number */}
            <div className="card-meta">
                <div className="card-assignee">
                    <div className="avatar">
                        {workflow.assignee?.avatar ?? '?'}
                    </div>
                    {assigneeName}
                </div>
                <span className="muted" style={{ fontSize: '10px' }}>
          {progressVal}%
        </span>
            </div>

            {/* Tags */}
            <div className="tags">
                {tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            {/* Footer: last updated + T-08 quick action */}
            <div className="card-footer">
        <span className="card-updated">
          updated {formatDate(workflow.updated_at)}
        </span>

                {/* T-08: Quick-action button — fires action without opening detail panel */}
                {primaryAction && onAction && (
                    <button
                        className="card-quick-action"
                        title={QUICK_ACTION_LABELS[primaryAction] ?? primaryAction}
                        onClick={e => {
                            e.stopPropagation() // don't select the card
                            onAction(workflow, primaryAction, QUICK_ACTION_LABELS[primaryAction] ?? primaryAction)
                        }}
                    >
                        {QUICK_ACTION_LABELS[primaryAction] ?? primaryAction}
                    </button>
                )}
            </div>
        </div>
    )
}
