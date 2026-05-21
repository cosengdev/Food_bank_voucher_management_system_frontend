'use client'

import { useState } from 'react'
import { mockAuditLog } from '@/lib/mockData'
import styles from './audit.module.css'

const dotClass = (type) => {
  switch (type) {
    case 'auth': return styles.dotAuth
    case 'voucher': return styles.dotVoucher
    case 'consent': return styles.dotConsent
    case 'export': return styles.dotExport
    case 'client': return styles.dotClient
    case 'cancel': return styles.dotCancel
    default: return styles.dotAuth
  }
}

const actionTypes = [
  { value: 'all', label: 'All actions' },
  { value: 'auth', label: 'Login / Logout' },
  { value: 'voucher', label: 'Voucher issued' },
  { value: 'client', label: 'Client created' },
  { value: 'consent', label: 'Consent captured' },
  { value: 'export', label: 'Data export' },
]

const users = [
  { value: 'all', label: 'All users' },
  { value: 'J. Adeyemi', label: 'J. Adeyemi' },
  { value: 'D. Williams', label: 'D. Williams' },
  { value: 'T. Obi', label: 'T. Obi' },
]

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')

  const filtered = mockAuditLog.filter(e => {
    const matchSearch = search.length === 0 ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.detail.toLowerCase().includes(search.toLowerCase())
    const matchAction = actionFilter === 'all' || e.type === actionFilter
    const matchUser = userFilter === 'all' || e.user === userFilter
    return matchSearch && matchAction && matchUser
  })

  return (
    <div>
      {/* Filters */}
      <div className={styles.filterRow}>
        <input
          className={styles.input}
          placeholder="Search audit log..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.select} value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          {actionTypes.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
        <select className={styles.select} value={userFilter} onChange={e => setUserFilter(e.target.value)}>
          {users.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.resultCount}>Showing {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'}</div>

      {/* Audit entries */}
      <div className={styles.card}>
        <div className={styles.entryList}>
          {filtered.map(e => (
            <div key={e.id} className={styles.entry}>
              <div className={dotClass(e.type)} />
              <div className={styles.entryBody}>
                <div className={styles.entryTop}>
                  <span className={styles.entryTime}>{e.time}</span>
                  <span className={styles.entryAction}>{e.action}</span>
                </div>
                <div className={styles.entryDetail}>{e.detail}</div>
                <div className={styles.entryMeta}>{e.user} · {e.centre}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={styles.entry}>
              <div className={styles.entryBody}>
                <div className={styles.entryDetail}>No audit entries match your filters.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
