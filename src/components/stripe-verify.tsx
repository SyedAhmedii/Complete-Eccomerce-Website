'use client'

import Link from 'next/link'

export const Stripeverify = () => {
  return (
    <Link
      href="/stripe-verify"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: '4px',
        background: 'var(--theme-elevation-150)',
        color: 'var(--theme-text)',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 500,
        gap: '6px',
        border: '1px solid var(--theme-elevation-200)',
        transition: 'background 0.2s ease',
      }}
    >
      Verify Account
    </Link>
  )
}