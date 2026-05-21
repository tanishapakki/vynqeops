// Toast.jsx
import React, { useEffect } from 'react'

export default function Toast({ message, onDismiss }) {
    useEffect(() => {
        if (!message) return
        const timer = setTimeout(onDismiss, 3000)
        return () => clearTimeout(timer)
    }, [message, onDismiss])

    if (!message) return null

    return (
        <div className="toast" role="alert">
            <span className="toast-check">✓</span>
            {message}
        </div>
    )
}
