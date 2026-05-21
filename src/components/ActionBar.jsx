// ActionBar.jsx
// T-08: Contextual action bar for the selected workflow.
//
// Design rationale:
//   Before this, suggested_actions existed in the data but were buried in the
//   detail panel as inert pill buttons. Acting on a workflow required:
//     (1) click card → (2) scroll detail panel → (3) find actions → (4) click → (5) nothing happens
//
//   This collapses that to a single click, surfaced at the bottom of the viewport
//   where the eye naturally rests after scanning the grid.
//
//   The bar only appears when a workflow is selected, so it doesn't clutter the
//   default state. Actions are labelled in plain English (not the snake_case keys
//   stored in data). Urgency-class actions (escalate, mark_blocked) get a
//   distinct visual treatment.

import React from 'react'

// Human-readable labels + visual weight for each action type.
// "urgent" actions get a highlighted style.
const ACTION_META = {
    send_update:     { label: 'Send Update',      icon: '↑',  urgent: false },
    escalate:        { label: 'Escalate',         icon: '⚑',  urgent: true  },
    request_review:  { label: 'Request Review',   icon: '◎',  urgent: false },
    mark_blocked:    { label: 'Mark Blocked',     icon: '⊘',  urgent: true  },
    archive:         { label: 'Archive',          icon: '⊡',  urgent: false },
    assign_owner:    { label: 'Assign Owner',     icon: '⊕',  urgent: false },
    reassign:        { label: 'Reassign',         icon: '⇄',  urgent: false },
    clarify_owner:   { label: 'Clarify Owner',    icon: '?',  urgent: false },
    flag_data_issue: { label: 'Flag Data Issue',  icon: '⚠',  urgent: true  },
}

export default function ActionBar({ workflow, onAction }) {
    if (!workflow) return null

    const actions = workflow.suggested_actions ?? []
    if (actions.length === 0) return null

    return (
        <div className="action-bar">
            <div className="action-bar-context">
                <span className="action-bar-id">{workflow.id}</span>
                <span className="action-bar-title">{workflow.title}</span>
                <span className="action-bar-client">{workflow.client_name}</span>
            </div>

            <div className="action-bar-divider" />

            <div className="action-bar-actions">
                {actions.map(actionKey => {
                    const meta = ACTION_META[actionKey] ?? { label: actionKey, icon: '▶', urgent: false }
                    return (
                        <button
                            key={actionKey}
                            className={`action-btn ${meta.urgent ? 'action-btn--urgent' : ''}`}
                            onClick={() => onAction(workflow, actionKey, meta.label)}
                            title={meta.label}
                        >
                            <span className="action-btn-icon">{meta.icon}</span>
                            {meta.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
