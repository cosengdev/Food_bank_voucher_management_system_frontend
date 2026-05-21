'use client'

import Link from 'next/link'
import { mockDashboardStats, mockVouchers } from '@/lib/mockData'
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
  return (
    <div>

      {/* ── Stat cards ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard} id="stat-vouchers">
          <span className={styles.statLabel}>Vouchers This Month</span>
          <span className={styles.statValue}>{mockDashboardStats.vouchersThisMonth}</span>
          <span className={styles.statSub}>
            <span className={styles.statUp}>↑</span> {mockDashboardStats.vouchersChange}
          </span>
        </div>
        <div className={styles.statCard} id="stat-clients">
          <span className={styles.statLabel}>Unique Clients</span>
          <span className={styles.statValue}>{mockDashboardStats.uniqueClients}</span>
          <span className={styles.statSub}>
            <span className={styles.statUp}>↑</span> {mockDashboardStats.clientsChange}
          </span>
        </div>
        <div className={styles.statCard} id="stat-repeat">
          <span className={styles.statLabel}>Repeat Vouchers</span>
          <span className={styles.statValue}>{mockDashboardStats.repeatVouchers}</span>
          <span className={styles.statSub}>
            <span className={styles.statDown}>⚠</span> {mockDashboardStats.repeatChange}
          </span>
        </div>
        <div className={styles.statCard} id="stat-split">
          <span className={styles.statLabel}>Collection / Delivery</span>
          <span className={styles.statValue}>{mockDashboardStats.collectionSplit}</span>
          <span className={styles.statSub}>split this month</span>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className={styles.chartsRow}>

        {/* Bar chart */}
        <div className={styles.card} id="chart-weekly">
          <div className={styles.cardTitle}>Vouchers Issued</div>
          <div className={styles.cardSub}>Last 7 days</div>
          <div className={styles.barChart}>
            {mockDashboardStats.weeklyData.map(d => (
              <div key={d.day} className={styles.barGroup}>
                <div className={styles.barWrap}>
                  <div
                    className={styles.bar}
                    style={{ height: `${(d.count / maxBar) * 100}%` }}
                  >
                    <span className={styles.barVal}>{d.count}</span>
                  </div>
                </div>
                <span className={styles.barDay}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral reasons */}
        <div className={styles.card} id="chart-referrals">
          <div className={styles.cardTitle}>Top Referral Reasons</div>
          <div className={styles.cardSub}>This month</div>
          <div className={styles.hBarList}>
            {mockDashboardStats.referralReasons.map((r, i) => (
              <div key={r.reason} className={styles.hBarRow}>
                <div className={styles.hBarHead}>
                  <span className={styles.hBarLabel}>{r.reason}</span>
                  <span className={styles.hBarCount}>{r.count}</span>
                </div>
                <div className={styles.hBarTrack}>
                  <div
                    className={styles.hBarFill}
                    style={{
                      width: `${(r.count / maxReason) * 100}%`,
                      background: barColors[i % barColors.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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
            {recentVouchers.map(v => (
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
  )
}