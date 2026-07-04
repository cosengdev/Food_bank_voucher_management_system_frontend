'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '../../lib/api'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiService.login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setEmail('admin@cityofgodfoodbank.org')
    setPassword('Coseng_Voucher')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>City of God Foodbank</h1>
        <p className={styles.subtitle}>Sign in to Voucher Management System</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.org"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <button type="button" className={styles.btnDemo} onClick={fillAdminCredentials}>
          ⚡ Auto-fill Admin Credentials
        </button>
      </div>
    </div>
  )
}
