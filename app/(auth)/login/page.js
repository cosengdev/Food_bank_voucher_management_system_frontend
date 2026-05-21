'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setError('')
    // In this mock version, any credentials will redirect to the dashboard
    router.push('/dashboard')
  }

  return (
    <div className={styles.page}>

      {/* BACKGROUND */}
      <div className={styles.bg}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.bgCircle3}></div>
      </div>

      {/* TOP LOGO BAR */}
      <div className={styles.topbar}>
        <div className={styles.logoDot}></div>
        <span className={styles.logoName}>City of God Foodbank</span>
      </div>

      {/* CENTER CARD */}
      <div className={styles.center}>

        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>Staff Portal</p>
          <h1 className={styles.heroTitle}>Voucher Management System</h1>
          <p className={styles.heroSub}>
            Securely issue vouchers, manage clients, and track
            foodbank activity across all centres.
          </p>
        </div>

        <div className={styles.card}>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSub}>Log in to your staff account</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className={styles.toggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            <div className={styles.forgot}>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Log in
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>Having trouble? Contact your system administrator.</p>
          </div>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className={styles.bottombar}>
        For authorised staff and volunteers only. Not a public portal.
      </div>

    </div>
  )
}