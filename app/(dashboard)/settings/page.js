'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockStaff, mockCentres } from '@/lib/mockData'
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

export default function SettingsPage() {
  const router = useRouter()
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

  return (
    <div>
      {/* Two cards side by side */}
      <div className={styles.twoCol}>

        {/* Staff accounts */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Staff Accounts</div>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Centre</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td><span className={styles.bold}>{s.name}</span></td>
                  <td><span className={`${styles.pill} ${rolePill(s.role)}`}>{s.role}</span></td>
                  <td>{s.centre}</td>
                  <td><span className={`${styles.pill} ${statusPill(s.status)}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.btnPrimary} type="button" onClick={() => setModalOpen(true)}>
            + Invite user
          </button>
        </div>

        {/* Centres */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Centres</div>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>Centre</th>
                <th>Address</th>
                <th>Delivery</th>
                <th>Hours</th>
                <th>Staff</th>
              </tr>
            </thead>
            <tbody>
              {centres.map(c => (
                <tr key={c.id}>
                  <td><span className={styles.bold}>{c.name}</span></td>
                  <td>{c.address}</td>
                  <td>
                    <span className={`${styles.pill} ${c.delivery ? styles.pillGreen : styles.pillGray}`}>
                      {c.delivery ? 'Available' : 'Not available'}
                    </span>
                  </td>
                  <td>{c.openingTimes}</td>
                  <td>{c.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.btnPrimary} type="button" onClick={() => setCentreModalOpen(true)}>
            + Add centre
          </button>
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
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Invite Staff Member</div>
              <button className={styles.modalClose} onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input className={styles.input} value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input className={styles.input} type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <select className={styles.select} value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}>
                  <option value="">Select role...</option>
                  <option value="Centre Admin">Centre Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Read-only">Read-only</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Centre</label>
                <select className={styles.select} value={inviteForm.centre} onChange={e => setInviteForm({ ...inviteForm, centre: e.target.value })}>
                  <option value="">Select centre...</option>
                  {centres.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="All centres">All centres</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btn} type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className={styles.btnPrimary} type="button" onClick={handleInvite}>Send invite</button>
            </div>
          </div>
        </div>
      )}

      {/* Add centre modal */}
      {centreModalOpen && (
        <div className={styles.overlay} onClick={() => setCentreModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Add New Centre</div>
              <button className={styles.modalClose} onClick={() => setCentreModalOpen(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Centre name</label>
                <input 
                  className={styles.input} 
                  placeholder="e.g. Peckham Centre" 
                  value={centreForm.name} 
                  onChange={e => setCentreForm({ ...centreForm, name: e.target.value })} 
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Address</label>
                <input 
                  className={styles.input} 
                  placeholder="e.g. 42 Peckham High St, SE15" 
                  value={centreForm.address} 
                  onChange={e => setCentreForm({ ...centreForm, address: e.target.value })} 
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Delivery available</label>
                <select 
                  className={styles.select} 
                  value={centreForm.delivery} 
                  onChange={e => setCentreForm({ ...centreForm, delivery: e.target.value })}
                >
                  <option value="Yes">Yes, delivery available</option>
                  <option value="No">No delivery</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Opening times</label>
                <input 
                  className={styles.input} 
                  placeholder="e.g. Mon–Fri 9am–4pm" 
                  value={centreForm.openingTimes} 
                  onChange={e => setCentreForm({ ...centreForm, openingTimes: e.target.value })} 
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Staff count</label>
                <input 
                  className={styles.input} 
                  type="number" 
                  min="0"
                  value={centreForm.staff} 
                  onChange={e => setCentreForm({ ...centreForm, staff: e.target.value })} 
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btn} type="button" onClick={() => setCentreModalOpen(false)}>Cancel</button>
              <button className={styles.btnPrimary} type="button" onClick={handleAddCentre}>Add centre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
