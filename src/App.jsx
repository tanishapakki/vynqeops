// App.jsx — updated for T-08 and T-09

import React, { useState, useCallback } from 'react'
import { useWorkflows } from './hooks/useWorkflows'
import FilterBar from './components/FilterBar'
import WorkflowCard from './components/WorkflowCard'
import DetailPanel from './components/DetailPanel'
import ActivityFeed from './components/ActivityFeed'
import ActionBar from './components/ActionBar'       // T-08
import SummaryModal from './components/SummaryModal'  // T-09
import Toast from './components/Toast'               // T-08 feedback

export default function App() {
    const { data, loading, error } = useWorkflows()

    const [activeFilter, setActiveFilter]       = useState('all')
    const [searchQuery, setSearchQuery]         = useState('')
    const [selectedWorkflow, setSelectedWorkflow] = useState(null)

    // T-08: action feedback
    const [toastMessage, setToastMessage] = useState(null)

    // T-09: AI summary modal
    const [showSummary, setShowSummary] = useState(false)

    if (loading) {
        return <div className="state-fullscreen">Loading…</div>
    }

    if (error) {
        return (
            <div className="state-fullscreen">
                Error: {error.message}
            </div>
        )
    }

    // ── Filtering ─────────────────────────────────────────────────────────
    const displayedWorkflows = (data?.workflows ?? []).filter(workflow => {
        const matchesFilter =
            activeFilter === 'all'
                ? true
                : workflow.status?.toLowerCase() === activeFilter

        const matchesSearch =
            workflow.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workflow.client_name?.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesFilter && matchesSearch
    })

    // ── T-09: open summary modal ──────────────────────────────────────────
    function handleSummarise() {
        setShowSummary(true)
    }

    // ── T-08: fire action from ActionBar or WorkflowCard quick-action ─────
    // In a real app this would call an API endpoint.
    // Here we show a toast and log — the plumbing is real, the side-effects are mocked.
    const handleAction = useCallback((workflow, actionKey, label) => {
        console.log(`[T-08] Action fired: ${actionKey} on ${workflow.id}`)
        setToastMessage(`${label} — ${workflow.id}`)
    }, [])

    function handleClose() {
        setSelectedWorkflow(null)
    }

    return (
        <div className="app-shell">

            {/* Top bar */}
            <header className="topbar">
                <div className="topbar-logo">
                    vynqe<span>ops</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginLeft: '24px' }}>
                    {['active', 'blocked', 'review'].map(s => {
                        const colours = {
                            active:  'var(--status-active)',
                            blocked: 'var(--status-blocked)',
                            review:  'var(--status-review)',
                        }
                        const count = displayedWorkflows.filter(
                            w => w.status?.toLowerCase() === s
                        ).length
                        return (
                            <span
                                key={s}
                                className="status-label"
                                style={{ color: colours[s], fontSize: '11px' }}
                            >
                <span className="status-dot" style={{ background: colours[s] }} />
                                {count} {s}
              </span>
                        )
                    })}
                </div>

                <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {data ? `${data.workflows.length} workflows loaded` : 'loading data…'}
                </div>
            </header>

            {/* Filter bar */}
            <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSummarise={handleSummarise}
            />

            {/* Main body */}
            <div className="main-body">
                <div className="content-area">

                    {/* Workflow grid */}
                    <div className="workflow-grid-container">
                        <div className="workflow-grid">
                            {displayedWorkflows.map(workflow => (
                                <WorkflowCard
                                    key={workflow.id}
                                    workflow={workflow}
                                    isSelected={selectedWorkflow?.id === workflow.id}
                                    onClick={setSelectedWorkflow}
                                    onAction={handleAction}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Activity feed */}
                    <ActivityFeed
                        activityLog={data?.activity_log}
                        users={data?.users}
                    />
                </div>

                {/* Detail panel */}
                <DetailPanel
                    workflow={selectedWorkflow}
                    users={data?.users}
                    onClose={handleClose}
                    onAction={handleAction}
                />
            </div>

            {/* T-08: Contextual action bar — renders when a workflow is selected */}
            <ActionBar
                workflow={selectedWorkflow}
                onAction={handleAction}
            />

            {/* T-08: Toast feedback */}
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />

            {/* T-09: AI summary modal */}
            {showSummary && (
                <SummaryModal
                    data={data}
                    onClose={() => setShowSummary(false)}
                />
            )}
        </div>
    )
}
