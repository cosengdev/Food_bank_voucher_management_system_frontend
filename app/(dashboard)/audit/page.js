'use client'
import { useState, useEffect } from 'react'
import { apiService } from '../../../lib/api'
import styles from './audit.module.css'

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
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [user, setUser] = useState('all')

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await apiService.getAuditLogs({ search, type, user })
      setAuditLogs(res.data || [])
    } catch (err) {
      console.error('Failed to fetch audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [search, type, user])

  const dotColor = { auth:'#64748b', voucher:'var(--blue)', consent:'var(--green)', export:'var(--amber)', client:'var(--navy)', cancel:'var(--red)' }

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
        <select className={styles.select} value={type} onChange={e => setType(e.target.value)}>
          {actionTypes.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
        <select className={styles.select} value={user} onChange={e => setUser(e.target.value)}>
          {users.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.resultCount}>Showing {auditLogs.length} entr{auditLogs.length !== 1 ? 'ies' : 'y'}</div>

      {/* Audit entries */}
      <div className={styles.card}>
        {loading ? (
          <div style={{padding:'30px',textAlign:'center',color:'var(--text-muted)'}}>Loading audit log from API...</div>
        ) : auditLogs.length === 0 ? (
          <div style={{padding:'30px',textAlign:'center',color:'var(--text-muted)'}}>No audit records found.</div>
        ) : (
          auditLogs.map(e => (
            <div key={e.id} className={styles.entry}>
              <div className={styles.dot} style={{background: dotColor[e.type] || 'var(--blue)'}}></div>
              <div className={styles.time}>{e.time}</div>
              <div className={styles.body}>
                <div className={styles.action}>{e.action}</div>
                <div className={styles.detail}>{e.detail}</div>
                <div className={styles.meta}>{e.user} · {e.centre}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}