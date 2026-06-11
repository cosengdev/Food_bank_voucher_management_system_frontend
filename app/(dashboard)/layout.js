'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './layout.module.css'

const navItems = [
  {
    section: 'Main',
    links: [
      { label: 'Dashboard', href: '/dashboard', icon: '▦' },
      { label: 'Issue Voucher', href: '/issue-voucher', icon: '＋', badge: 'New' },
      { label: 'Clients', href: '/clients', icon: '👥' },
      { label: 'Vouchers', href: '/vouchers', icon: '🎫' },
    ]
  },
  {
    section: 'Data & Compliance',
    links: [
      { label: 'Reports & Exports', href: '/reports', icon: '📊' },
      { label: 'Audit Log', href: '/audit', icon: '🕐' },
    ]
  },
  {
    section: 'Admin',
    links: [
      { label: 'Settings & Users', href: '/settings', icon: '⚙' },
    ]
  }
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [centre, setCentre] = useState('Peckham Centre')

  function handleLogout() {
    // Clear any stored auth (expand as needed)
    localStorage.removeItem('token')
    sessionStorage.clear()
    router.push('/login')
  }

  return (
    <div className={styles.app}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          {/* <div className={styles.logoDot}></div> */}
          <div className={styles.logoText}>
            <div className={styles.logoName}>City of God Foodbank</div>
            <div className={styles.logoSub}>Voucher Management System</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((group) => (
            <div key={group.section} className={styles.navGroup}>
              <div className={styles.navSection}>{group.section}</div>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navItem} ${pathname === link.href ? styles.navItemActive : ''}`}
                >
                  <span className={styles.navIcon}>{link.icon}</span>
                  <span className={styles.navLabel}>{link.label}</span>
                  {link.badge && (
                    <span className={styles.navBadge}>{link.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userChip}>
            <div className={styles.avatar}>JA</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Jane Adeyemi</div>
              <div className={styles.userRole}>Centre Admin</div>
            </div>
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              title="Log out"
              id="logout-button"
            >
              ⤺
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>

        {/* TOPBAR */}
        <div className={styles.topbar}>
          <div className={styles.pageTitle} id="page-title">
            {navItems
              .flatMap(g => g.links)
              .find(l => l.href === pathname)?.label || 'Dashboard'}
          </div>
          <div className={styles.topbarRight}>
            <select
              className={styles.centreSelect}
              value={centre}
              onChange={(e) => setCentre(e.target.value)}
            >
              <option>Peckham Centre</option>
              <option>Brixton Centre</option>
              <option>All Centres</option>
            </select>
            <Link href="/issue-voucher" className={styles.btnPrimary}>
              + Issue Voucher
            </Link>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className={styles.content}>
          {children}
        </div>

      </div>
    </div>
  )
}