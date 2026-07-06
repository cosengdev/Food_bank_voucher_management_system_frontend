'use client'
import { useState, useEffect } from 'react'
import { apiService } from '../../../lib/api'
import styles from './clients.module.css'

const FLAGS = ['all', 'normal', 'repeat', 'review']
const flagLabels = { all: 'All', normal: 'Normal', repeat: 'Repeat flagged', review: 'Review needed' }
const flagPill = (f) => {
  if (f === 'repeat') return { cls: styles.pillRed, label: 'Repeat flagged' }
  if (f === 'review') return { cls: styles.pillAmber, label: 'Review needed' }
  return { cls: styles.pillGreen, label: 'Normal' }
}

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [flagFilter, setFlagFilter] = useState('all')
  const [panelOpen, setPanelOpen] = useState(false)

  // New Client form state
  const [newFirstName, setNewFirstName] = useState('')
  const [newSurname, setNewSurname] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newPostcode, setNewPostcode] = useState('')
  const [newYob, setNewYob] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const res = await apiService.getClients({ search, flag: flagFilter })
      setClients(res.data || [])
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [search, flagFilter])

  const handleCreateClient = async (e) => {
    e.preventDefault()
    if (!newFirstName || !newSurname || !newPostcode) {
      alert('Please fill in required fields (*)')
      return
    }
    try {
      setSubmitting(true)
      await apiService.createClient({
        firstName: newFirstName,
        surname: newSurname,
        address: newAddress,
        postcode: newPostcode,
        yearOfBirth: newYob,
      })
      setPanelOpen(false)
      setNewFirstName('')
      setNewSurname('')
      setNewAddress('')
      setNewPostcode('')
      setNewYob('')
      fetchClients()
    } catch (err) {
      alert('Failed to create client: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <input className={styles.input} placeholder="Search by name or postcode…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className={styles.btn} onClick={fetchClients}>Search</button>
        <button className={styles.btnPrimary} onClick={() => setPanelOpen(true)}>+ New client</button>
      </div>

      {/* Filter pills */}
      <div className={styles.filterPills}>
        {FLAGS.map(f => (
          <span
            key={f}
            className={flagFilter === f ? styles.filterPillActive : styles.filterPill}
            onClick={() => setFlagFilter(f)}
          >
            {flagLabels[f]}
          </span>
        ))}
      </div>

      <div className={styles.resultCount}>Showing {clients.length} client{clients.length !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div className={styles.card}>
        {loading ? (
          <div style={{padding:'30px',textAlign:'center',color:'var(--text-muted)'}}>Loading clients from API...</div>
        ) : (
          <table className={styles.tbl}>
            <thead><tr><th>Name</th><th>Postcode</th><th>Year of birth</th><th>Total vouchers</th><th>Last issued</th><th>Flag</th></tr></thead>
            <tbody>
              {clients.map(c => {
                const pill = flagPill(c.flag)
                return (
                  <tr key={c.id} style={{cursor:'pointer'}}>
                    <td><strong>{c.firstName} {c.surname}</strong></td>
                    <td>{c.postcode}</td>
                    <td>{c.yearOfBirth || '—'}</td>
                    <td>{c.totalVouchers}</td>
                    <td>{c.lastIssued}</td>
                    <td><span className={`${styles.pill} ${pill.cls}`}>{pill.label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Side panel */}
      {panelOpen && (
        <>
          <div className={styles.overlay} onClick={() => setPanelOpen(false)}></div>
          <form className={styles.panel} onSubmit={handleCreateClient}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>New Client</div>
              <button type="button" className={styles.closeBtn} onClick={() => setPanelOpen(false)}>×</button>
            </div>
            <div className={styles.field}><label className={styles.label}>First name *</label><input className={styles.input} value={newFirstName} onChange={e => setNewFirstName(e.target.value)} required /></div>
            <div className={styles.field}><label className={styles.label}>Surname *</label><input className={styles.input} value={newSurname} onChange={e => setNewSurname(e.target.value)} required /></div>
            <div className={styles.field}><label className={styles.label}>Address</label><input className={styles.input} value={newAddress} onChange={e => setNewAddress(e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Postcode *</label><input className={styles.input} value={newPostcode} onChange={e => setNewPostcode(e.target.value)} required /></div>
            <div className={styles.field}><label className={styles.label}>Year of birth <span className={styles.hint}>(optional)</span></label><input className={styles.input} type="number" value={newYob} onChange={e => setNewYob(e.target.value)} /></div>
            <button type="submit" className={styles.btnPrimary} style={{width:'100%',marginTop:'8px'}} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save client'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}