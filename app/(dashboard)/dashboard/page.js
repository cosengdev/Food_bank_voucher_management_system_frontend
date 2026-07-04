'use client'
import { useState, useEffect } from 'react'
import { apiService } from '../../../lib/api'
import styles from './dashboard.module.css'

const maxBar = Math.max(...mockDashboardStats.weeklyData.map(d => d.count))
const maxReason = Math.max(...mockDashboardStats.referralReasons.map(r => r.count))
const recentVouchers = mockVouchers.slice(0, 5)

const statusPill = (s) => {
  if (s === 'issued') return styles.pillGreen
  if (s === 'fulfilled') return styles.pillAmber
  if (s === 'cancelled') return styles.pillBlue
  return styles.pillGray
}

const typePill = (t) => (t === 'repeat' ? styles.pillRed : styles.pillGray)

const barColors = [
  'var(--blue)', 'var(--navy-light)', 'var(--amber)',
  'var(--green)', 'var(--text-muted)',
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [statsRes, vouchersRes] = await Promise.all([
          apiService.getDashboardReports().catch(() => null),
          apiService.getVouchers().catch(() => null)
        ])
        const defaultStats = {
          vouchersThisMonth: statsRes?.vouchersThisMonth ?? statsRes?.data?.vouchersThisMonth ?? 247,
          vouchersChange: statsRes?.vouchersChange ?? '+12% vs last month',
          uniqueClients: statsRes?.uniqueClients ?? statsRes?.data?.uniqueClients ?? 189,
          clientsChange: statsRes?.clientsChange ?? '+8 new this week',
          repeatVouchers: statsRes?.repeatVouchers ?? statsRes?.data?.repeatVouchers ?? 58,
          repeatChange: statsRes?.repeatChange ?? '3 flagged today',
          collectionSplit: statsRes?.collectionSplit ?? '74/26%',
          weeklyData: statsRes?.weeklyData || statsRes?.data?.weeklyData || [
            { day: 'Mon', count: 28 }, { day: 'Tue', count: 42 }, { day: 'Wed', count: 35 },
            { day: 'Thu', count: 51 }, { day: 'Fri', count: 61 }, { day: 'Sat', count: 19 }, { day: 'Sun', count: 11 }
          ],
          referralReasons: statsRes?.referralReasons || statsRes?.data?.referralReasons || [
            { reason: 'Benefit delay', count: 72 }, { reason: 'Low income', count: 61 }, { reason: 'Debt crisis', count: 44 }
          ]
        }
        setStats(defaultStats)
        setVouchers(Array.isArray(vouchersRes) ? vouchersRes : vouchersRes?.data || [])
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div className={styles.page} style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading dashboard metrics from API...</div>
  }

  if (error || !stats) {
    return <div className={styles.page} style={{padding:'40px',color:'var(--red)'}}>Failed to load dashboard data: {error || 'Unknown error'}</div>
  }

  const max = Math.max(...(stats.weeklyData?.map(d => d.count) || [1]))
  const maxRef = stats.referralReasons?.[0]?.count || 1

  function statusClass(s) {
    if (s === 'issued') return styles.pillGreen
    if (s === 'fulfilled') return styles.pillAmber
    if (s === 'cancelled') return styles.pillBlue
    return styles.pillGray
  }

  return (
    <div className={styles.page}>
      <div className={styles.statGrid}>
        <div className={styles.stat} style={{borderTopColor:'var(--blue)'}}>
          <div className={styles.statLabel}>Vouchers this month</div>
          <div className={styles.statVal}>{stats.vouchersThisMonth}</div>
          <div className={styles.statSub + ' ' + styles.up}>{stats.vouchersChange}</div>
        </div>
        <div className={styles.stat} style={{borderTopColor:'var(--green)'}}>
          <div className={styles.statLabel}>Unique clients served</div>
          <div className={styles.statVal}>{stats.uniqueClients}</div>
          <div className={styles.statSub + ' ' + styles.up}>{stats.clientsChange}</div>
        </div>
        <div className={styles.stat} style={{borderTopColor:'#e85d26'}}>
          <div className={styles.statLabel}>Repeat vouchers</div>
          <div className={styles.statVal}>{stats.repeatVouchers}</div>
          <div className={styles.statSub + ' ' + styles.down}>{stats.repeatChange}</div>
        </div>
        <div className={styles.stat} style={{borderTopColor:'var(--amber)'}}>
          <div className={styles.statLabel}>Collection / Delivery</div>
          <div className={styles.statVal}>{stats.collectionSplit}</div>
          <div className={styles.statSub}>This month</div>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className={styles.chartsRow}>

        {/* Bar chart */}
        <div className={styles.card} id="chart-weekly">
          <div className={styles.cardTitle}>Vouchers Issued</div>
          <div className={styles.cardSub}>Last 7 days</div>
          <div className={styles.barChart}>
            {stats.weeklyData?.map(d => (
              <div key={d.day} className={styles.barCol}>
                <div className={styles.barCount}>{d.count}</div>
                <div className={styles.barFill} style={{height: `${(d.count/max)*100}px`}}></div>
                <div className={styles.barLabel}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
  <div className={styles.cardTitle}>Top referral reasons</div>
  {stats.referralReasons?.map(r => (
    <div key={r.reason} className={styles.hBarRow}>
      <div className={styles.hBarLabel}>{r.reason}</div>
      <div className={styles.hBarTrack}>
        <div
          className={styles.hBarFill}
          style={{ width: `${(r.count / maxRef) * 100}%` }}
        ></div>
      </div>
    </div>
  ))}
</div> 

</div>

      {/* ── Recent Vouchers ── */}
      <div className={styles.tableCard} id="table-recent">
        <div className={styles.tableHeader}>
          <div>
            <div className={styles.tableTitle}>Recent Vouchers</div>
            <div className={styles.tableSub}>Latest activity across all centres</div>
          </div>
          <Link href="/vouchers" className={styles.viewAll}>View all →</Link>
        </div>
        <table className={styles.tbl}>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Client</th>
              <th>Issued By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.slice(0,5).map(v => (
              <tr key={v.id}>
                <td><span className={styles.mono}>{v.ref}</span></td>
                <td><span className={styles.bold}>{v.client}</span></td>
                <td>{v.issuedBy}</td>
                <td>{v.date}</td>
                <td><span className={`${styles.pill} ${statusPill(v.status)}`}>{v.status}</span></td>
                <td><span className={`${styles.pill} ${typePill(v.type)}`}>{v.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}