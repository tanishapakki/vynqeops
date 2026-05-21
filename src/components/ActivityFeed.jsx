// ActivityFeed.jsx
//
// T-06: Activity feed component.
//
// This is a SHELL. The container renders and the header shows,
// but nothing is displayed inside it.
//
// Candidate's job:
//   - Receive `activityLog` and `users` as props
//   - Sort entries newest first
//   - For each entry render: timestamp, user name (look up from users),
//     action text, and the workflow ID it belongs to
//   - Handle edge cases in the data:
//       - user: null (anonymous entries)
//       - action: "" (empty action string — wf_039)
//       - duplicate entries (act_022 and act_023 are identical)
//       - act_040 references wf_999 which doesn't exist in workflows
//
// The CSS for .activity-feed and .activity-feed-header is in global.css.
//
// Inline status colour — T-07: 4th copy of this logic. Extract to StatusBadge.

import React from 'react'

function formatDate(ts) {
    if (!ts) return '—'

    try {
        const d =
            typeof ts === 'number'
                ? new Date(ts * 1000)
                : new Date(ts)

        return d.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return '—'
    }
}

export default function ActivityFeed({
                                         activityLog,
                                         users,
                                     }) {
    // TODO (T-06): Wire the data. Right now this renders nothing.
    // Start here:
    //   const sorted = [...(activityLog ?? [])].sort(
    //     (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    //   )



    const sorted = [...(activityLog ?? [])]


        .sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime()
            const timeB = new Date(b.timestamp).getTime()

            return timeB - timeA
        })


    const seen = new Set()

    const deduped = sorted.filter(entry => {
        const key = [
            entry.timestamp,
            entry.user,
            entry.action,
            entry.workflow_id,
        ].join('|')

        if (seen.has(key)) {
            return false
        }

        seen.add(key)
        return true
    })

    return (
        <div className="activity-feed">
            <div className="activity-feed-header">
                Activity
            </div>

            {/* TODO (T-06): map sorted entries here */}
            {/* Each entry should look roughly like:
          <div key={entry.id} style={{ ... }}>
            <span style={{ color: 'var(--text-muted)' }}>{formattedTime}</span>
            {' '}<strong>{userName}</strong>{' '}{entry.action}
            {' '}<span style={{ color: 'var(--text-muted)' }}>{entry.workflow_id}</span>
          </div>
      */}

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    marginTop: '12px',
                }}
            >
                {deduped.length === 0 ? (
                    <div
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: '11px',
                        }}
                    >
                        No activity available
                    </div>
                ) : (
                    deduped.map(entry => {
                        /*
                          Handle edge case:
                          user: null

                          We show Anonymous instead of crashing.
                        */

                        const userName =
                            users?.[entry.user]?.name ??
                            'Anonymous'

                        /*
                          Handle edge case:
                          action: ""

                          Empty string looks broken in UI.
                        */

                        const action =
                            entry.action?.trim() ||
                            'performed an action'

                        /*
                          Handle edge case:
                          wf_999 may not exist.

                          We still render safely because
                          we only display the workflow id text.
                        */

                        const workflowId =
                            entry.workflow_id ??
                            'Unknown Workflow'

                        return (
                            <div
                                key={entry.id}
                                style={{
                                    paddingBottom: '12px',
                                    borderBottom:
                                        '1px solid var(--border)',
                                    fontSize: '11px',
                                    lineHeight: 1.7,
                                }}
                            >
                                {/* TIMESTAMP */}
                                <div
                                    style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '10px',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {formatDate(entry.timestamp)}
                                </div>

                                {/* ACTIVITY TEXT */}
                                <div>
                                    <strong>{userName}</strong>{' '}
                                    {action}
                                </div>

                                {/* WORKFLOW ID */}
                                <div
                                    style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '10px',
                                        marginTop: '2px',
                                    }}
                                >
                                    {workflowId}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}