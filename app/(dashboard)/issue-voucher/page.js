'use client'

import { useState } from 'react'
import {
  mockClients, incomeOptions, referralOptions,
  dietaryOptions, repeatReasons, householdOptions, mockCentres,
} from '@/lib/mockData'
import styles from './issue-voucher.module.css'

const STEP_LABELS = ['Client', 'Referral', 'Repeat Check', 'Dietary', 'Collection', 'Review']

export default function IssueVoucherPage() {
  const [step, setStep] = useState(0)

  /* Step 1 */
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [newClient, setNewClient] = useState({ firstName: '', surname: '', address: '', postcode: '', yearOfBirth: '' })

  /* Step 2 */
  const [income, setIncome] = useState('')
  const [referrals, setReferrals] = useState([])
  const [household, setHousehold] = useState('')

  /* Step 3 */
  const [repeatReason, setRepeatReason] = useState('')
  const [repeatNotes, setRepeatNotes] = useState('')
  const [repeatConsent, setRepeatConsent] = useState(false)

  /* Step 4 */
  const [gdprConsent, setGdprConsent] = useState(false)
  const [dietary, setDietary] = useState([])

  /* Step 5 */
  const [collectionMethod, setCollectionMethod] = useState('collection')
  const [contactConsent, setContactConsent] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const client = selectedClient || (newClient.firstName ? { firstName: newClient.firstName, surname: newClient.surname, totalVouchers: 0 } : null)
  const clientName = client ? `${client.firstName} ${client.surname}` : ''
  const needsRepeatCheck = client && client.totalVouchers >= 3

  const filteredClients = search.length > 0
    ? mockClients.filter(c =>
        `${c.firstName} ${c.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        c.postcode.toLowerCase().includes(search.toLowerCase())
      )
    : mockClients

  function toggleReferral(r) {
    if (referrals.includes(r)) {
      setReferrals(referrals.filter(x => x !== r))
    } else if (referrals.length < 4) {
      setReferrals([...referrals, r])
    }
  }

  function toggleDietary(d) {
    if (dietary.includes(d)) {
      setDietary(dietary.filter(x => x !== d))
    } else {
      setDietary([...dietary, d])
    }
  }

  function next() {
    if (step === 2 && !needsRepeatCheck) {
      setStep(3)
    }
    if (step < 5) setStep(step + 1)
  }

  function back() {
    if (step === 3 && !needsRepeatCheck) {
      setStep(1)
    } else if (step > 0) {
      setStep(step - 1)
    }
  }

  const today = new Date()
  const expiry = new Date(today)
  expiry.setDate(expiry.getDate() + 7)
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className={styles.page}>

      {/* ── Step progress bar ── */}
      <div className={styles.steps}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} style={{ display: 'contents' }}>
            <div className={styles.step}>
              <div className={i < step ? styles.stepDotDone : i === step ? styles.stepDotActive : styles.stepDot}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={i === step ? styles.stepLabelActive : styles.stepLabel}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={i < step ? styles.stepLineDone : styles.stepLine} />
            )}
          </div>
        ))}
      </div>

      {/* ══════════════ STEP 1: Client Selection ══════════════ */}
      {step === 0 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Step 1 — Client Selection</div>

          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="Search by name or postcode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className={styles.btnPrimary} type="button">Search</button>
          </div>

          <div className={styles.clientList}>
            {filteredClients.map(c => (
              <div
                key={c.id}
                className={selectedClient?.id === c.id ? styles.clientCardActive : styles.clientCard}
                onClick={() => setSelectedClient(c)}
              >
                <div>
                  <div className={styles.clientName}>{c.firstName} {c.surname}</div>
                  <div className={styles.clientMeta}>{c.postcode} · {c.totalVouchers} voucher{c.totalVouchers !== 1 ? 's' : ''} · Last: {c.lastIssued}</div>
                </div>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />
          <div className={styles.dividerLabel}>Client not found? Create a new record</div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input className={styles.input} value={newClient.firstName} onChange={e => setNewClient({ ...newClient, firstName: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Surname</label>
              <input className={styles.input} value={newClient.surname} onChange={e => setNewClient({ ...newClient, surname: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Address</label>
              <input className={styles.input} value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Postcode</label>
              <input className={styles.input} value={newClient.postcode} onChange={e => setNewClient({ ...newClient, postcode: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year of birth (optional)</label>
              <input className={styles.input} value={newClient.yearOfBirth} onChange={e => setNewClient({ ...newClient, yearOfBirth: e.target.value })} />
            </div>
          </div>

          <div className={styles.btnRow}>
            <div />
            <button className={styles.btnPrimary} type="button" onClick={next} disabled={!client}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 2: Referral & Income ══════════════ */}
      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Step 2 — Referral &amp; Income</div>

          <div className={styles.infoBanner}>Selected client: {clientName}</div>

          <div className={styles.field}>
            <label className={styles.label}>Source of income</label>
            <select className={styles.select} value={income} onChange={e => setIncome(e.target.value)}>
              <option value="">Select...</option>
              {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Referral reasons</label>
            <div className={styles.tagMax}>Select up to 4 reasons</div>
            <div className={styles.tags}>
              {referralOptions.map(r => (
                <span
                  key={r}
                  className={referrals.includes(r) ? styles.tagActive : styles.tag}
                  onClick={() => toggleReferral(r)}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Household size</label>
            <select className={styles.select} value={household} onChange={e => setHousehold(e.target.value)}>
              <option value="">Select...</option>
              {householdOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.btn} type="button" onClick={back}>← Back</button>
            <button className={styles.btnPrimary} type="button" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 3: Repeat Voucher Check ══════════════ */}
      {step === 2 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Step 3 — Repeat Voucher Check</div>

          {needsRepeatCheck ? (
            <>
              <div className={styles.warnBanner}>
                ⚠ Repeat voucher flag: {clientName} has received {client.totalVouchers} vouchers in the last 6 months.
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Reason for repeat voucher</label>
                <select className={styles.select} value={repeatReason} onChange={e => setRepeatReason(e.target.value)}>
                  <option value="">Select reason...</option>
                  {repeatReasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Explanatory notes</label>
                <textarea
                  className={styles.textarea}
                  value={repeatNotes}
                  onChange={e => { if (e.target.value.length <= 500) setRepeatNotes(e.target.value) }}
                  placeholder="Provide context for this repeat issue..."
                />
                <div className={repeatNotes.length > 450 ? styles.charWarn : styles.charCount}>
                  {repeatNotes.length}/500
                </div>
              </div>

              <div className={styles.checkRow}>
                <input type="checkbox" checked={repeatConsent} onChange={e => setRepeatConsent(e.target.checked)} id="repeat-consent" />
                <label className={styles.checkLabel} htmlFor="repeat-consent">
                  I confirm that I have reviewed this client&apos;s voucher history and take responsibility for issuing a repeat voucher. This action will be recorded in the audit log.
                </label>
              </div>
            </>
          ) : (
            <div className={styles.infoBanner}>
              ✓ No repeat flag — {clientName} has {client?.totalVouchers || 0} voucher{client?.totalVouchers !== 1 ? 's' : ''} on record. No additional checks required.
            </div>
          )}

          <div className={styles.btnRow}>
            <button className={styles.btn} type="button" onClick={back}>← Back</button>
            <button className={styles.btnPrimary} type="button" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 4: Dietary Requirements ══════════════ */}
      {step === 3 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Step 4 — Dietary Requirements</div>

          <div className={styles.gdprBanner}>
            <strong>Special Category Data (GDPR Article 9)</strong><br />
            Dietary information may reveal religious beliefs or health conditions. This data is classified as special category data under UK GDPR. Explicit consent is required before recording.
          </div>

          <div className={styles.checkRow}>
            <input type="checkbox" checked={gdprConsent} onChange={e => setGdprConsent(e.target.checked)} id="gdpr-consent" />
            <label className={styles.checkLabel} htmlFor="gdpr-consent">
              The client has given explicit verbal consent for dietary requirements to be recorded for the purpose of providing appropriate food parcels.
            </label>
          </div>

          {gdprConsent && (
            <div className={styles.field}>
              <label className={styles.label}>Dietary requirements</label>
              <div className={styles.tags}>
                {dietaryOptions.map(d => (
                  <span
                    key={d}
                    className={dietary.includes(d) ? styles.tagActive : styles.tag}
                    onClick={() => toggleDietary(d)}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.btnRow}>
            <button className={styles.btn} type="button" onClick={back}>← Back</button>
            <button className={styles.btnPrimary} type="button" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 5: Collection Details ══════════════ */}
      {step === 4 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Step 5 — Collection Details</div>

          <div className={styles.field}>
            <label className={styles.label}>Collection method</label>
            <select className={styles.select} value={collectionMethod} onChange={e => setCollectionMethod(e.target.value)}>
              <option value="collection">Collection from centre</option>
              <option value="delivery">Home delivery</option>
            </select>
          </div>

          {collectionMethod === 'delivery' && (
            <div className={styles.warnBanner}>
              ⚠ Home delivery is subject to availability and may not be offered at all centres. Please confirm with the centre coordinator.
            </div>
          )}

          <div className={styles.checkRow}>
            <input type="checkbox" checked={contactConsent} onChange={e => setContactConsent(e.target.checked)} id="contact-consent" />
            <label className={styles.checkLabel} htmlFor="contact-consent">
              Client has consented to being contacted by phone or email regarding this voucher.
            </label>
          </div>

          {contactConsent && (
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Phone number</label>
                <input className={styles.input} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07..." />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="client@email.com" />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <textarea
              className={styles.textarea}
              value={notes}
              onChange={e => { if (e.target.value.length <= 250) setNotes(e.target.value) }}
              placeholder="Any additional notes for this voucher..."
            />
            <div className={notes.length > 200 ? styles.charWarn : styles.charCount}>
              {notes.length}/250
            </div>
            <div style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}>
              Do not record sensitive personal information here.
            </div>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.btn} type="button" onClick={back}>← Back</button>
            <button className={styles.btnPrimary} type="button" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 6: Review & Issue ══════════════ */}
      {step === 5 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Step 6 — Review &amp; Issue</div>

          <div className={styles.preview}>
            <div className={styles.previewTitle}>City of God Foodbank — Voucher</div>
            <div className={styles.previewRef}>COG-2024-0248</div>
            <div className={styles.previewGrid}>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Client</span>
                <span className={styles.previewValue}>{clientName || '—'}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Household</span>
                <span className={styles.previewValue}>{household || '—'}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Collection</span>
                <span className={styles.previewValue}>{collectionMethod === 'delivery' ? 'Home delivery' : 'Collection from centre'}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Issued by</span>
                <span className={styles.previewValue}>Jane Adeyemi</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Centre</span>
                <span className={styles.previewValue}>{mockCentres[0].address}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Opening times</span>
                <span className={styles.previewValue}>{mockCentres[0].openingTimes}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Issue date</span>
                <span className={styles.previewValue}>{fmt(today)}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>Expiry date</span>
                <span className={styles.previewValue}>{fmt(expiry)}</span>
              </div>
            </div>
          </div>

          <div className={styles.checklist}>
            <span>✓ Consent captured</span>
            <span>✓ Repeat reason recorded</span>
            <span>✓ Audit entry will be created</span>
          </div>

          <div className={styles.btnRow}>
            <div>
              <button className={styles.printBtn} type="button" onClick={() => window.print()}>🖨 Print</button>
              <button className={styles.btn} type="button" onClick={back}>← Back</button>
            </div>
            <button
              className={styles.btnPrimary}
              type="button"
              onClick={() => alert('Voucher COG-2024-0248 has been issued successfully and logged in the audit trail.')}
            >
              Confirm &amp; Issue Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
