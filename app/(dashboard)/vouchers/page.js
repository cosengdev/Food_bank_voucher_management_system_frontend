'use client'
import { useState, useEffect } from 'react'
import { apiService } from '../../../lib/api'
import styles from './vouchers.module.css'

import { mockVouchers } from '../../../lib/mockData'

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorNotice, setErrorNotice] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [centreFilter, setCentreFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const fetchVouchers = async () => {
    try {
      setLoading(true)
      setErrorNotice(null)
      const res = await apiService.getVouchers({ search, status, centre })
      const list = Array.isArray(res) ? res : res?.data || []
      setVouchers(list)
    } catch (err) {
      console.warn('Backend vouchers endpoint error (500), using local fallback:', err.message)
      setErrorNotice('Railway backend returned server error (500). Showing fallback vouchers list.')
      // Filter mock vouchers as fallback
      const filteredMock = mockVouchers.filter(v => {
        const matchSearch = v.ref.toLowerCase().includes(search.toLowerCase()) || v.client.toLowerCase().includes(search.toLowerCase())
        const matchStatus = status === 'all' || v.status === status
        const matchCentre = centre === 'all' || v.centre.toLowerCase() === centre.toLowerCase()
        return matchSearch && matchStatus && matchCentre
      })
      setVouchers(filteredMock)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [search, status, centre])

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      if (newStatus === 'fulfilled') {
        await apiService.fulfillVoucher(id)
      } else if (newStatus === 'cancelled') {
        await apiService.cancelVoucher(id, 'Cancelled by user')
      } else {
        await apiService.updateVoucher(id, { status: newStatus })
      }
      fetchVouchers()
    } catch (err) {
      alert('Failed to update voucher status: ' + err.message)
    }
  }

  const statusClass = { issued: styles.pillGreen, fulfilled: styles.pillAmber, cancelled: styles.pillBlue }

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
        <button className={styles.btn} onClick={fetchVouchers}>Filter</button>
      </div>
      <div className={styles.resultCount}>
        {loading ? 'Loading vouchers from API...' : `Showing ${vouchers.length} voucher${vouchers.length !== 1 ? 's' : ''}`}
      </div>
      {errorNotice && (
        <div style={{background:'#fffeb3',border:'1px solid #ffd700',color:'#8a6d3b',padding:'10px 14px',borderRadius:'6px',fontSize:'13px',marginBottom:'16px'}}>
          ⚠️ {errorNotice}
        </div>
      )}
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
            {vouchers.map(v => (
              <tr key={v.id} style={{display:'contents'}}>
                <tr onClick={() => setExpanded(expanded === v.id ? null : v.id)} style={{cursor:'pointer'}}>
                  <td className={styles.mono}>{v.ref}</td>
                  <td><strong>{v.client}</strong></td>
                  <td>{v.centre}</td>
                  <td>{v.issuedBy}</td>
                  <td>{v.date}</td>
                  <td><span className={`${styles.pill} ${statusClass[v.status] || styles.pillGray}`}>{v.status}</span></td>
                  <td><span className={`${styles.pill} ${v.type === 'repeat' ? styles.pillRed : styles.pillGray}`}>{v.type}</span></td>
                </tr>
              ]
              if (isExpanded) {
                rows.push(
                  <tr key={`${v.id}-detail`} className={styles.detailRow}>
                    <td colSpan={7}>
                      <div className={styles.expandContent}>
                        <div><span className={styles.expandLabel}>Full reference:</span> {v.ref}</div>
                        <div><span className={styles.expandLabel}>Client:</span> {v.client}</div>
                        <div><span className={styles.expandLabel}>Centre:</span> {v.centre}</div>
                        <div><span className={styles.expandLabel}>Issued by:</span> {v.issuedBy}</div>
                        <div className={styles.expandActions}>
                          <button className={styles.btn} onClick={() => handleStatusUpdate(v.id, 'fulfilled')}>Mark fulfilled</button>
                          <button className={styles.btnDanger} onClick={() => handleStatusUpdate(v.id, 'cancelled')}>Cancel voucher</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
