'use client'

import { useState } from 'react'
import { mockVouchers } from '@/lib/mockData'
import styles from './vouchers.module.css'

const statusPill = (s) => {
  if (s === 'issued') return { cls: styles.pillGreen, label: 'Issued' }
  if (s === 'fulfilled') return { cls: styles.pillAmber, label: 'Fulfilled' }
  if (s === 'cancelled') return { cls: styles.pillBlue, label: 'Cancelled' }
  return { cls: styles.pillGray, label: s }
}

const typePill = (t) => {
  if (t === 'repeat') return { cls: styles.pillRed, label: 'Repeat' }
  return { cls: styles.pillGray, label: 'Standard' }
}

export default function VouchersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [centreFilter, setCentreFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = mockVouchers.filter(v => {
    const matchSearch = search.length === 0 ||
      v.ref.toLowerCase().includes(search.toLowerCase()) ||
      v.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    const matchCentre = centreFilter === 'all' || v.centre.toLowerCase() === centreFilter.toLowerCase()
    return matchSearch && matchStatus && matchCentre
  })

  return (
    <div>
      {/* Filters */}
      <div className={styles.filterRow}>
        <input
          className={styles.input}
          placeholder="Search by reference or client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="issued">Issued</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className={styles.select} value={centreFilter} onChange={e => setCentreFilter(e.target.value)}>
          <option value="all">All centres</option>
          <option value="Peckham">Peckham</option>
          <option value="Brixton">Brixton</option>
        </select>
        <button className={styles.btnPrimary} type="button">Filter</button>
      </div>

      <div className={styles.resultCount}>Showing {filtered.length} voucher{filtered.length !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div className={styles.card}>
        <table className={styles.tbl}>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Client</th>
              <th>Centre</th>
              <th>Issued By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.flatMap(v => {
              const sp = statusPill(v.status)
              const tp = typePill(v.type)
              const isExpanded = expanded === v.id
              const rows = [
                <tr key={v.id} onClick={() => setExpanded(isExpanded ? null : v.id)}>
                  <td><span className={styles.mono}>{v.ref}</span></td>
                  <td><span className={styles.bold}>{v.client}</span></td>
                  <td>{v.centre}</td>
                  <td>{v.issuedBy}</td>
                  <td>{v.date}</td>
                  <td><span className={`${styles.pill} ${sp.cls}`}>{sp.label}</span></td>
                  <td><span className={`${styles.pill} ${tp.cls}`}>{tp.label}</span></td>
                </tr>
              ]
              if (isExpanded) {
                rows.push(
                  <tr key={`${v.id}-detail`} className={styles.detailRow}>
                    <td colSpan={7}>
                      <div className={styles.detailInner}>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Reference</span>
                          <span className={styles.detailValue}>{v.ref}</span>
                        </div>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Client</span>
                          <span className={styles.detailValue}>{v.client}</span>
                        </div>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Centre</span>
                          <span className={styles.detailValue}>{v.centre}</span>
                        </div>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Issued By</span>
                          <span className={styles.detailValue}>{v.issuedBy}</span>
                        </div>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Date</span>
                          <span className={styles.detailValue}>{v.date}</span>
                        </div>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Status</span>
                          <span className={styles.detailValue}>{sp.label}</span>
                        </div>
                        <div className={styles.detailCol}>
                          <span className={styles.detailLabel}>Type</span>
                          <span className={styles.detailValue}>{tp.label}</span>
                        </div>
                        <div className={styles.detailActions}>
                          {v.status === 'issued' && (
                            <>
                              <button className={styles.btnGreen} type="button" onClick={(e) => { e.stopPropagation(); alert(`${v.ref} marked as fulfilled.`) }}>✓ Mark fulfilled</button>
                              <button className={styles.btnRed} type="button" onClick={(e) => { e.stopPropagation(); alert(`${v.ref} has been cancelled.`) }}>✕ Cancel voucher</button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              }
              return rows
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
