'use client'

import { useState } from 'react'
import { mockClients } from '@/lib/mockData'
import styles from './clients.module.css'

const FLAGS = ['all', 'normal', 'repeat', 'review']
const flagLabels = { all: 'All', normal: 'Normal', repeat: 'Repeat flagged', review: 'Review needed' }
const flagPill = (f) => {
  if (f === 'repeat') return { cls: styles.pillRed, label: 'Repeat flagged' }
  if (f === 'review') return { cls: styles.pillAmber, label: 'Review needed' }
  return { cls: styles.pillGreen, label: 'Normal' }
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [flagFilter, setFlagFilter] = useState('all')
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelClient, setPanelClient] = useState(null)
  const [form, setForm] = useState({ firstName: '', surname: '', address: '', postcode: '', yearOfBirth: '' })

  const filtered = mockClients.filter(c => {
    const matchSearch = search.length === 0 ||
      `${c.firstName} ${c.surname}`.toLowerCase().includes(search.toLowerCase()) ||
      c.postcode.toLowerCase().includes(search.toLowerCase())
    const matchFlag = flagFilter === 'all' || c.flag === flagFilter
    return matchSearch && matchFlag
  })

  function openNew() {
    setPanelClient(null)
    setForm({ firstName: '', surname: '', address: '', postcode: '', yearOfBirth: '' })
    setPanelOpen(true)
  }

  function openEdit(c) {
    setPanelClient(c)
    setForm({ firstName: c.firstName, surname: c.surname, address: '', postcode: c.postcode, yearOfBirth: c.yearOfBirth || '' })
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setPanelClient(null)
  }

  return (
    <div>
      {/* Top row */}
      <div className={styles.topRow}>
        <input
          className={styles.input}
          placeholder="Search by name or postcode..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles.btn} type="button">Search</button>
        <button className={styles.btnPrimary} type="button" onClick={openNew}>+ New client</button>
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

      <div className={styles.resultCount}>Showing {filtered.length} client{filtered.length !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div className={styles.card}>
        <table className={styles.tbl}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Postcode</th>
              <th>Year of Birth</th>
              <th>Total Vouchers</th>
              <th>Last Issued</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const fp = flagPill(c.flag)
              return (
                <tr key={c.id} onClick={() => openEdit(c)}>
                  <td><span className={styles.bold}>{c.firstName} {c.surname}</span></td>
                  <td>{c.postcode}</td>
                  <td>{c.yearOfBirth || '—'}</td>
                  <td>{c.totalVouchers}</td>
                  <td>{c.lastIssued}</td>
                  <td><span className={`${styles.pill} ${fp.cls}`}>{fp.label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Side panel */}
      {panelOpen && (
        <>
          <div className={styles.overlay} onClick={closePanel} />
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>{panelClient ? 'Edit Client' : 'New Client'}</div>
              <button className={styles.panelClose} onClick={closePanel}>×</button>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.field}>
                <label className={styles.label}>First name</label>
                <input className={styles.input} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Surname</label>
                <input className={styles.input} value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Address</label>
                <input className={styles.input} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Postcode</label>
                <input className={styles.input} value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Year of birth (optional)</label>
                <input className={styles.input} value={form.yearOfBirth} onChange={e => setForm({ ...form, yearOfBirth: e.target.value })} />
              </div>
            </div>
            <div className={styles.panelFooter}>
              <button className={styles.btnPrimary} type="button" onClick={() => { alert('Client saved.'); closePanel() }}>
                {panelClient ? 'Update Client' : 'Save Client'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
