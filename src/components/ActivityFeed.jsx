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

export default function ActivityFeed({ activityLog, users }) {
  // TODO (T-06): Wire the data. Right now this renders nothing.
  // Start here:
  //   const sorted = [...(activityLog ?? [])].sort(
  //     (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  //   )

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">Activity</div>

      {/* TODO (T-06): map sorted entries here */}
      {/* Each entry should look roughly like:
          <div key={entry.id} style={{ ... }}>
            <span style={{ color: 'var(--text-muted)' }}>{formattedTime}</span>
            {' '}<strong>{userName}</strong>{' '}{entry.action}
            {' '}<span style={{ color: 'var(--text-muted)' }}>{entry.workflow_id}</span>
          </div>
      */}

      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px' }}>
        T-06: Wire activity log data here. See component comments.
      </div>
    </div>
  )
}
