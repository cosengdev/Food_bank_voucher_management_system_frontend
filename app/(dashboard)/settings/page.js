'use client'
import { useState, useEffect } from 'react'
import { apiService } from '../../../lib/api'
import styles from './settings.module.css'

const rolePill = (role) => {
  if (role === 'Super Admin') return styles.pillNavy
  if (role === 'Centre Admin') return styles.pillGreen
  if (role === 'Read-only') return styles.pillAmber
  return styles.pillGray
}

const statusPill = (s) => (s === 'active' ? styles.pillGreen : styles.pillRed)

const permissions = [
  { action: 'Issue vouchers',         superAdmin: true, centreAdmin: true, staff: true, volunteer: true, readOnly: false },
  { action: 'Manage client records',  superAdmin: true, centreAdmin: true, staff: true, volunteer: false, readOnly: false },
  { action: 'View reports',           superAdmin: true, centreAdmin: true, staff: false, volunteer: false, readOnly: true },
  { action: 'Export data',            superAdmin: true, centreAdmin: true, staff: false, volunteer: false, readOnly: false },
  { action: 'Manage users',           superAdmin: true, centreAdmin: true, staff: false, volunteer: false, readOnly: false },
  { action: 'View audit log',         superAdmin: true, centreAdmin: true, staff: false, volunteer: false, readOnly: true },
  { action: 'System configuration',   superAdmin: true, centreAdmin: false, staff: false, volunteer: false, readOnly: false },
]

const roleClass = { 'Centre Admin': 'pillBlue', 'Staff': 'pillGray', 'Volunteer': 'pillGray', 'Read-only': 'pillAmber', 'Super Admin': 'pillNavy', 'super_admin': 'pillNavy' }

export default function SettingsPage() {
  const [staff, setStaff] = useState([])
  const [centres, setCentres] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: '', centre: '' })
  const [staff, setStaff] = useState(mockStaff)
  const [centres, setCentres] = useState(mockCentres)
  
  const [centreModalOpen, setCentreModalOpen] = useState(false)
  const [centreForm, setCentreForm] = useState({ name: '', address: '', delivery: 'Yes', openingTimes: '', staff: '0' })

  function handleLogout() {
    localStorage.removeItem('token')
    sessionStorage.clear()
    router.push('/login')
  }

  function handleInvite() {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.role || !inviteForm.centre) {
      alert('Please fill in all fields.')
      return
    }
    const newStaff = {
      id: staff.length + 1,
      name: inviteForm.name,
      role: inviteForm.role,
      centre: inviteForm.centre,
      status: 'active'
    }
    setStaff([...staff, newStaff])
    setModalOpen(false)
    setInviteForm({ name: '', email: '', role: '', centre: '' })
  }

  function handleAddCentre() {
    if (!centreForm.name || !centreForm.address || !centreForm.openingTimes) {
      alert('Please fill in all fields.')
      return
    }
    const newCentre = {
      id: centres.length + 1,
      name: centreForm.name,
      address: centreForm.address,
      delivery: centreForm.delivery === 'Yes',
      openingTimes: centreForm.openingTimes,
      staff: parseInt(centreForm.staff, 10) || 0
    }
    setCentres([...centres, newCentre])
    setCentreModalOpen(false)
    setCentreForm({ name: '', address: '', delivery: 'Yes', openingTimes: '', staff: '0' })
  }

  // Invite user form
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Centre Admin')
  const [inviteCentre, setInviteCentre] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadSettingsData = async () => {
    try {
      setLoading(true)
      const [usersRes, centresRes] = await Promise.all([
        apiService.getUsers(),
        apiService.getCentres()
      ])
      setStaff(usersRes.data || [])
      setCentres(centresRes.data || [])
    } catch (err) {
      console.error('Failed to load settings data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettingsData()
  }, [])

  const handleInviteUser = async (e) => {
    e?.preventDefault()
    try {
      setSubmitting(true)
      await apiService.inviteUser({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        centre: inviteCentre,
      })
      alert('Invite sent successfully!')
      setModalOpen(false)
      setInviteName('')
      setInviteEmail('')
      loadSettingsData()
    } catch (err) {
      alert('Failed to send invite: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Two cards side by side */}
      <div className={styles.twoCol}>

        {/* Staff accounts */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Staff & user accounts</div>
          {loading ? (
            <div style={{padding:'20px',textAlign:'center',color:'var(--text-muted)'}}>Loading staff...</div>
          ) : (
            <table className={styles.tbl}>
              <thead><tr><th>Name</th><th>Role</th><th>Centre</th><th>Status</th></tr></thead>
              <tbody>
                {staff.map((s, idx) => (
                  <tr key={s.id || idx}>
                    <td><strong>{s.name || s.first_name + ' ' + s.last_name || s.email}</strong></td>
                    <td><span className={`${styles.pill} ${styles[roleClass[s.role]] || styles.pillGray}`}>{s.role}</span></td>
                    <td>{s.centre || 'All centres'}</td>
                    <td><span className={`${styles.pill} ${styles.pillGreen}`}>{s.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className={styles.btnPrimary} style={{marginTop:'14px'}} onClick={() => setModalOpen(true)}>+ Invite user</button>
        </div>

        {/* Centres */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Foodbank centres</div>
          {loading ? (
            <div style={{padding:'20px',textAlign:'center',color:'var(--text-muted)'}}>Loading centres...</div>
          ) : (
            <table className={styles.tbl}>
              <thead><tr><th>Centre</th><th>Address</th><th>Delivery</th><th>Staff</th></tr></thead>
              <tbody>
                {centres.map((c, idx) => (
                  <tr key={c.id || idx}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{fontSize:'12px',color:'var(--text-muted)'}}>{c.address}</td>
                    <td><span className={`${styles.pill} ${c.delivery ? styles.pillGreen : styles.pillGray}`}>{c.delivery ? 'Available' : 'Not available'}</span></td>
                    <td>{c.staff || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className={styles.btnPrimary} style={{marginTop:'14px'}}>+ Add centre</button>
        </div>
      </div>

      {/* Role permissions table */}
      <div className={styles.cardFull}>
        <div className={styles.cardTitle}>Role Permissions</div>
        <table className={styles.permTbl}>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Super Admin</th>
              <th>Centre Admin</th>
              <th>Staff</th>
              <th>Volunteer</th>
              <th>Read-only</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map(p => (
              <tr key={p.action}>
                <td>{p.action}</td>
                <td><span className={p.superAdmin ? styles.checkYes : styles.checkNo}>{p.superAdmin ? '✅' : '❌'}</span></td>
                <td><span className={p.centreAdmin ? styles.checkYes : styles.checkNo}>{p.centreAdmin ? '✅' : '❌'}</span></td>
                <td><span className={p.staff ? styles.checkYes : styles.checkNo}>{p.staff ? '✅' : '❌'}</span></td>
                <td><span className={p.volunteer ? styles.checkYes : styles.checkNo}>{p.volunteer ? '✅' : '❌'}</span></td>
                <td><span className={p.readOnly ? styles.checkYes : styles.checkNo}>{p.readOnly ? '✅' : '❌'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log out button */}
      <div className={styles.logoutRow}>
        <button
          className={styles.btnLogout}
          onClick={handleLogout}
          id="settings-logout-button"
        >
          Log out
        </button>
      </div>

      {/* Invite user modal */}
      {modalOpen && (
        <>
          <div className={styles.overlay} onClick={() => setModalOpen(false)}></div>
          <form className={styles.modal} onSubmit={handleInviteUser}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Invite Staff Member</div>
              <button type="button" className={styles.closeBtn} onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className={styles.field}><label className={styles.label}>Full name</label><input className={styles.input} value={inviteName} onChange={e => setInviteName(e.target.value)} required /></div>
            <div className={styles.field}><label className={styles.label}>Email address</label><input type="email" className={styles.input} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required /></div>
            <div className={styles.field}><label className={styles.label}>Role</label>
              <select className={styles.input} value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                <option>Centre Admin</option>
                <option>Staff</option>
                <option>Volunteer</option>
                <option>Read-only</option>
              </select>
            </div>
            <div className={styles.field}><label className={styles.label}>Assign to centre</label>
              <select className={styles.input} value={inviteCentre} onChange={e => setInviteCentre(e.target.value)}>
                {centres.map((c, idx) => <option key={c.id || idx}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btn} onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send invite'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
