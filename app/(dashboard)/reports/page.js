'use client'

import { useState } from 'react'
import { mockDashboardStats } from '@/lib/mockData'
import styles from './reports.module.css'

const centreBreakdown = [
  { centre: 'Peckham Centre', vouchers: 156, clients: 112, repeats: 38, collection: 120, delivery: 36 },
  { centre: 'Brixton Centre', vouchers: 91, clients: 77, repeats: 20, collection: 63, delivery: 28 },
]

const totals = centreBreakdown.reduce((acc, r) => ({
  vouchers: acc.vouchers + r.vouchers,
  clients: acc.clients + r.clients,
  repeats: acc.repeats + r.repeats,
  collection: acc.collection + r.collection,
  delivery: acc.delivery + r.delivery,
}), { vouchers: 0, clients: 0, repeats: 0, collection: 0, delivery: 0 })

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [centre, setCentre] = useState('all')
  const [status, setStatus] = useState('all')

  function handleExport(format) {
    alert(`Export logged. Downloading ${format.toUpperCase()} report...`)
  }

  return (
    <div>
      {/* Filters */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Filters</div>
        <div className={styles.filterGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Date from</label>
            <input className={styles.input} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Date to</label>
            <input className={styles.input} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Centre</label>
            <select className={styles.select} value={centre} onChange={e => setCentre(e.target.value)}>
              <option value="all">All centres</option>
              <option value="peckham">Peckham</option>
              <option value="brixton">Brixton</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select className={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="issued">Issued</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className={styles.btnRow}>
          <button className={styles.btnPrimary} type="button">View results</button>
          <button className={styles.btnGreen} type="button" onClick={() => handleExport('csv')}>📄 Export CSV</button>
          <button className={styles.btnGreen} type="button" onClick={() => handleExport('xlsx')}>📊 Export XLSX</button>
        </div>
      </div>

      {/* Summary stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Vouchers</span>
          <span className={styles.statValue}>{mockDashboardStats.vouchersThisMonth}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Unique Clients</span>
          <span className={styles.statValue}>{mockDashboardStats.uniqueClients}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Repeat Vouchers</span>
          <span className={styles.statValue}>{mockDashboardStats.repeatVouchers}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Cancellations</span>
          <span className={styles.statValue}>12</span>
        </div>
      </div>

      {/* Results table */}
      <div className={styles.tableCard}>
        <table className={styles.tbl}>
          <thead>
            <tr>
              <th>Centre</th>
              <th>Vouchers</th>
              <th>Clients</th>
              <th>Repeats</th>
              <th>Collection</th>
              <th>Delivery</th>
            </tr>
          </thead>
          <tbody>
            {centreBreakdown.map(r => (
              <tr key={r.centre}>
                <td><span className={styles.bold}>{r.centre}</span></td>
                <td>{r.vouchers}</td>
                <td>{r.clients}</td>
                <td>{r.repeats}</td>
                <td>{r.collection}</td>
                <td>{r.delivery}</td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td>Total</td>
              <td>{totals.vouchers}</td>
              <td>{totals.clients}</td>
              <td>{totals.repeats}</td>
              <td>{totals.collection}</td>
              <td>{totals.delivery}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
