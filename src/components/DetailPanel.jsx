import React, { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'

function formatDate(ts) {
    if (!ts) return '—'

    try {
        const d =
            typeof ts === 'number'
                ? new Date(ts * 1000)
                : new Date(ts)

        return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    } catch {
        return '—'
    }
}

export default function DetailPanel({
                                        workflow,
                                        users,
                                        onClose
                                    }) {
    const [notes, setNotes] = useState('')

    useEffect(() => {
        setNotes(workflow?.notes ?? '')
    }, [workflow])

    if (!workflow) {
        return (
            <div className="detail-panel">
                <div className="detail-panel-empty">
                    Select a workflow
                    <br />
                    to see details
                </div>
            </div>
        )
    }


    const progressVal = Math.max(
        0,
        Math.min(100, Number(workflow.progress) || 0)
    )

    const history = Array.isArray(workflow.history)
        ? workflow.history
        : []

    return (
        <div className="detail-panel">
            {/* HEADER */}
            <div
                style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: '10px',
                                color: 'var(--text-muted)',
                                marginBottom: '4px',
                            }}
                        >
                            {workflow.id}
                        </div>

                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: 1.3,
                            }}
                        >
                            {workflow.title ?? 'Untitled Workflow'}
                        </div>

                        <div
                            style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                            }}
                        >
                            {workflow.client_name ?? 'No client'}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >

                    </button>
                </div>

                {/* STATUS */}
                <div style={{ marginTop: '12px' }}>
                    <StatusBadge status={workflow.status} />
                </div>

            </div>

            {/* CONTENT */}
            <div
                style={{
                    padding: '20px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                {/* ASSIGNEE */}
                <div>
                    <div className="muted">Assignee</div>

                    <div style={{ marginTop: '6px' }}>
                        {workflow.assignee?.name ?? 'Unassigned'}
                    </div>
                </div>

                {/* DATES */}
                <div>
                    <div className="muted">Last Updated</div>

                    <div style={{ marginTop: '6px' }}>
                        {formatDate(workflow.updated_at)}
                    </div>
                </div>

                <div>
                    <div className="muted">Due Date</div>

                    <div style={{ marginTop: '6px' }}>
                        {formatDate(workflow.due_date)}
                    </div>
                </div>

                {/* PROGRESS */}
                <div>
                    <div className="muted">Progress</div>

                    <div
                        className="progress-bar-wrap"
                        style={{ marginTop: '8px' }}
                    >
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${progressVal}%`,
                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginTop: '6px',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {progressVal}%
                    </div>
                </div>

                {/* HISTORY */}
                <div>
                    <div className="muted">History</div>

                    <div
                        style={{
                            marginTop: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        {history.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)' }}>
                                No history available
                            </div>
                        ) : (
                            history.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        borderLeft: '2px solid var(--border)',
                                        paddingLeft: '12px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {users?.[item.user]?.name ?? item.user} {item.action}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '10px',
                                            color: 'var(--text-muted)',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {formatDate(item.timestamp)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* NOTES */}
                <div>
                    <div className="muted">Notes</div>

                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Add notes..."
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            marginTop: '10px',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            padding: '12px',
                            borderRadius: '8px',
                            resize: 'vertical',
                        }}
                    />
                </div>

                {/* SUGGESTED ACTIONS */}
                <div>
                    <div className="muted">Suggested Actions</div>

                    <div
                        style={{
                            marginTop: '10px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                        }}
                    >
                        {(workflow.suggested_actions ?? []).map(action => (
                            <button
                                key={action}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: '999px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface-2)',
                                    color: 'var(--text-primary)',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}