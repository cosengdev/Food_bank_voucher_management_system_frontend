'use client'
import { useState, useEffect } from 'react'
import { apiService } from '../../../lib/api'
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
  const [dateFrom, setDateFrom] = useState('2024-04-01')
  const [dateTo, setDateTo] = useState('2024-04-23')
  const [centre, setCentre] = useState('All centres')
  const [status, setStatus] = useState('All statuses')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchReport = async () => {
    try {
      setLoading(true)
      const res = await apiService.getReports({ dateFrom, dateTo, centre, status })
      setReportData(res)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const stats = reportData?.stats || { totalVouchers: 0, uniqueClients: 0, repeatVouchers: 0, cancellations: 0 }
  const rows = reportData?.rows || []

  return (
    <div>
      {/* Filters */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Generate report</div>
        <div className={styles.grid2}>
          <div className={styles.field}><label className={styles.label}>Date from</label><input type="date" className={styles.input} value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Date to</label><input type="date" className={styles.input} value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Centre</label>
            <select className={styles.input} value={centre} onChange={e => setCentre(e.target.value)}>
              <option>All centres</option><option>Peckham</option><option>Brixton</option>
            </select>
          </div>
          <div className={styles.field}><label className={styles.label}>Voucher status</label>
            <select className={styles.input} value={status} onChange={e => setStatus(e.target.value)}>
              <option>All statuses</option><option>Issued</option><option>Fulfilled</option><option>Cancelled</option>
            </select>
          </div>
        </div>
        <div className={styles.btnRow}>
          <button className={styles.btn} onClick={fetchReport}>View results</button>
          <button className={styles.btnPrimary} onClick={() => alert('Export logged.\nDownloading vouchers report CSV…')}>Export CSV</button>
          <button className={styles.btn} onClick={() => alert('Export logged.\nDownloading vouchers report XLSX…')}>Export XLSX</button>
        </div>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.stat}><div className={styles.statLabel}>Total vouchers</div><div className={styles.statVal}>{stats.totalVouchers}</div></div>
        <div className={styles.stat} style={{borderTopColor:'var(--green)'}}><div className={styles.statLabel}>Unique clients</div><div className={styles.statVal}>{stats.uniqueClients}</div></div>
        <div className={styles.stat} style={{borderTopColor:'#e85d26'}}><div className={styles.statLabel}>Repeat vouchers</div><div className={styles.statVal}>{stats.repeatVouchers}</div></div>
        <div className={styles.stat} style={{borderTopColor:'var(--red)'}}><div className={styles.statLabel}>Cancellations</div><div className={styles.statVal}>{stats.cancellations}</div></div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Results — {centre}</div>
        {loading ? (
          <div style={{padding:'20px',textAlign:'center',color:'var(--text-muted)'}}>Loading report results from API...</div>
        ) : (
          <table className={styles.tbl}>
            <thead><tr><th>Centre</th><th>Vouchers</th><th>Clients</th><th>Repeats</th><th>Collection</th><th>Delivery</th></tr></thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td><strong>{r.centre}</strong></td>
                  <td>{r.vouchers}</td>
                  <td>{r.clients}</td>
                  <td>{r.repeats}</td>
                  <td>{r.collection}</td>
                  <td>{r.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
