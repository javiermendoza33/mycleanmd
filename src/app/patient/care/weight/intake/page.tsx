'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CONDITIONS = [
  'None of these',
  'Prediabetes',
  'Metabolic syndrome',
  'Type 2 diabetes',
  'Dyslipidemia',
  'Hypertension',
  'Cardiovascular disease',
  'Nonalcoholic fatty liver disease',
  'Polycystic ovary syndrome (PCOS)',
  'Female infertility',
  'Male hypogonadism',
  'Obstructive sleep apnea',
  'Asthma/reactive airway disease',
  'Osteoarthritis',
  'Urinary stress incontinence',
  'Gastroesophageal reflux disease',
  'Depression',
]

const MEDICATIONS = [
  'Ozempic (semaglutide)',
  'Wegovy (semaglutide)',
  'Mounjaro (tirzepatide)',
  'Zepbound (tirzepatide)',
  'Phentermine',
  'Contrave',
  'Qsymia',
  'Other',
]

const NAVY = '#1E2B5E'
const BORDER = '#E5E7EB'
const MUTED = '#9CA3AF'
const TOTAL = 12

export default function WeightIntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [timeline, setTimeline] = useState('')
  const [conditions, setConditions] = useState<string[]>([])
  const [prevMeds, setPrevMeds] = useState<string | null>(null)
  const [medications, setMedications] = useState<string[]>([])
  const [payment, setPayment] = useState('')
  const [saving, setSaving] = useState(false)

  const totalInches = (parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0)
  const bmiRaw = totalInches > 0 && currentWeight
    ? (parseInt(currentWeight) / (totalInches * totalInches)) * 703
    : null
  const bmi = bmiRaw ? bmiRaw.toFixed(1) : null
  const bmiNum = bmiRaw ?? 0
  const toLose = Math.max(0, parseInt(currentWeight || '0') - parseInt(goalWeight || '0'))

  const bmiCategory =
    bmiNum < 18.5 ? 'Underweight' :
    bmiNum < 25   ? 'Healthy weight' :
    bmiNum < 30   ? 'Overweight' : 'Obese'
  const bmiColor =
    bmiNum < 18.5 ? '#F59E0B' :
    bmiNum < 25   ? '#10B981' :
    bmiNum < 30   ? '#F97316' : '#EF4444'
  const bmiThumbPct = Math.min(98, Math.max(2, ((bmiNum - 15) / 28) * 100))

  // ── Personalized projection calculator ──────────────────────────────────────
  const calc = useMemo(() => {
    const cw = parseInt(currentWeight || '0')
    const gw = parseInt(goalWeight || '0')
    if (!cw) return null

    // Base monthly loss rate (GLP-1 avg: ~1.7% per month)
    let monthlyRate = 0.017

    // Timeline modifier
    if (timeline === 'fast') monthlyRate = 0.022
    else if (timeline === 'steady') monthlyRate = 0.013

    // Previous GLP-1 tolerance → slightly slower initial response
    if (prevMeds === 'Yes') monthlyRate *= 0.93

    // Conditions that improve GLP-1 response
    const highResponse = ['Prediabetes', 'Type 2 diabetes', 'Metabolic syndrome', 'Polycystic ovary syndrome (PCOS)']
    if (conditions.some(c => highResponse.includes(c))) monthlyRate *= 1.07

    // Compute monthly weights over 12 months
    const monthlyWeights: number[] = [cw]
    for (let m = 1; m <= 12; m++) {
      monthlyWeights.push(Math.round(monthlyWeights[m - 1] * (1 - monthlyRate)))
    }

    const proj6mo = monthlyWeights[6]
    const loss6mo = cw - proj6mo
    const weeklyLbs = Math.round((cw * monthlyRate / 4.33) * 10) / 10

    // Months to reach goal weight
    let monthsToGoal = 0
    if (gw > 0 && gw < cw) {
      for (let m = 1; m <= 48; m++) {
        if (monthlyWeights[m] !== undefined) {
          if (monthlyWeights[m] <= gw) { monthsToGoal = m; break }
        } else {
          const extraMonths = m - 12
          const wAtM = monthlyWeights[12] * Math.pow(1 - monthlyRate, extraMonths)
          if (wAtM <= gw) { monthsToGoal = m; break }
        }
      }
    }

    // Label for timeline choice
    const timelineLabel =
      timeline === 'fast' ? 'Accelerated' :
      timeline === 'steady' ? 'Steady & sustainable' : 'Provider-guided'

    return { proj6mo, loss6mo, weeklyLbs, monthlyWeights, monthsToGoal, timelineLabel }
  }, [currentWeight, goalWeight, timeline, prevMeds, conditions])

  // SVG chart helpers (step 9)
  const chartPoints = useMemo(() => {
    if (!calc) return []
    const cw = parseInt(currentWeight || '0')
    const months = calc.monthlyWeights.slice(0, 7)
    const minW = Math.min(...months) - 2
    const maxW = Math.max(...months) + 2
    const pL = 64, pT = 24, plotW = 460, plotH = 170
    return months.map((w, i) => ({
      x: pL + (i / 6) * plotW,
      y: pT + (1 - (w - minW) / (maxW - minW)) * plotH,
      w,
    }))
  }, [calc, currentWeight])

  function smoothPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
  }

  const progress = Math.round(((step - 1) / (TOTAL - 1)) * 100)

  function goNext() {
    if (step === 6 && prevMeds === 'No') { setStep(8); return }
    setStep(s => s + 1)
  }
  function goBack() {
    if (step === 1) { router.push('/patient/care/weight'); return }
    if (step === 8 && prevMeds === 'No') { setStep(6); return }
    setStep(s => s - 1)
  }

  function toggleCondition(c: string) {
    if (c === 'None of these') { setConditions(['None of these']); return }
    setConditions(prev => {
      const filtered = prev.filter(x => x !== 'None of these')
      return filtered.includes(c) ? filtered.filter(x => x !== c) : [...filtered, c]
    })
  }
  function toggleMed(m: string) {
    setMedications(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  const inputStyle = (active: boolean): React.CSSProperties => ({
    width: '100%', padding: '18px 20px', fontSize: 22, fontWeight: 500, color: NAVY,
    border: `2px solid ${active ? NAVY : BORDER}`, borderRadius: 16, outline: 'none',
    boxSizing: 'border-box',
  })
  const nextBtn = (enabled: boolean): React.CSSProperties => ({
    width: '100%', padding: '18px', fontSize: 16, fontWeight: 600,
    background: enabled ? NAVY : '#E5E7EB', color: enabled ? '#fff' : MUTED,
    border: 'none', borderRadius: 100, cursor: enabled ? 'pointer' : 'not-allowed',
  })
  const cardBtn = (selected: boolean): React.CSSProperties => ({
    width: '100%', padding: '20px 24px', marginBottom: 12, textAlign: 'left',
    background: selected ? `${NAVY}0A` : '#fff',
    border: `1.5px solid ${selected ? NAVY : BORDER}`,
    borderRadius: 16, cursor: 'pointer',
  })
  const checkBox = (selected: boolean): React.CSSProperties => ({
    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
    border: `2px solid ${selected ? NAVY : '#D1D5DB'}`,
    background: selected ? NAVY : '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 20, borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: MUTED, padding: '4px 8px', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: NAVY, borderRadius: 100, transition: 'width 0.35s ease' }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, letterSpacing: -0.3 }}>
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Care</span>MD
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '56px 32px 80px', maxWidth: 580, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Step 1 — Height */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 40 }}>What is your height?</h1>
            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 8 }}>Feet</label>
                <input type="number" min={3} max={8} placeholder="5" value={heightFt}
                  onChange={e => setHeightFt(e.target.value)} style={inputStyle(!!heightFt)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 8 }}>Inches</label>
                <input type="number" min={0} max={11} placeholder="8" value={heightIn}
                  onChange={e => setHeightIn(e.target.value)} style={inputStyle(!!heightIn)} />
              </div>
            </div>
            <button onClick={goNext} disabled={!heightFt || !heightIn} style={nextBtn(!!(heightFt && heightIn))}>Next</button>
          </div>
        )}

        {/* Step 2 — Current weight */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 40 }}>What is your current weight?</h1>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 8 }}>Pounds (lbs)</label>
            <input type="number" min={80} max={700} placeholder="185" value={currentWeight}
              onChange={e => setCurrentWeight(e.target.value)} style={{ ...inputStyle(!!currentWeight), marginBottom: bmi ? 8 : 40 }} />
            {bmi && <p style={{ fontSize: 13, color: MUTED, marginBottom: 40 }}>Your BMI: <strong style={{ color: NAVY }}>{bmi}</strong></p>}
            <button onClick={goNext} disabled={!currentWeight} style={nextBtn(!!currentWeight)}>Next</button>
          </div>
        )}

        {/* Step 3 — Goal weight */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 8 }}>What is your goal weight?</h1>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 40 }}>Even losing 5–10% of your weight has significant health benefits.</p>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 8 }}>Pounds (lbs)</label>
            <input type="number" min={80} max={500} placeholder="155" value={goalWeight}
              onChange={e => setGoalWeight(e.target.value)}
              style={{ ...inputStyle(!!goalWeight), marginBottom: goalWeight && currentWeight ? 8 : 40 }} />
            {goalWeight && currentWeight && (
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 40 }}>
                Goal: lose <strong style={{ color: NAVY }}>{toLose} lbs</strong>
              </p>
            )}
            <button onClick={goNext} disabled={!goalWeight} style={nextBtn(!!goalWeight)}>Next</button>
          </div>
        )}

        {/* Step 4 — Timeline */}
        {step === 4 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 8 }}>What&apos;s your timeline?</h1>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 40 }}>This helps us recommend the right program intensity.</p>
            {[
              { value: 'fast', label: 'As fast as possible', sub: 'Maximum support from day one' },
              { value: 'steady', label: 'Slow and steady', sub: '1–2 lbs per week, sustainable pace' },
              { value: 'flexible', label: "I'm flexible", sub: 'Let my provider recommend a plan' },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setTimeline(opt.value); setTimeout(goNext, 220) }} style={cardBtn(timeline === opt.value)}>
                <div style={{ fontSize: 16, fontWeight: 600, color: NAVY }}>{opt.label}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 5 — Health conditions */}
        {step === 5 && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: NAVY, lineHeight: 1.35, marginBottom: 8 }}>
              Do you currently have, or have a history of, any of the following conditions?
            </h1>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 28 }}>Select all that apply.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {CONDITIONS.map(c => {
                const sel = conditions.includes(c)
                return (
                  <button key={c} onClick={() => toggleCondition(c)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', background: sel ? `${NAVY}0A` : '#fff', border: `1.5px solid ${sel ? NAVY : BORDER}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
                    <div style={checkBox(sel)}>
                      {sel && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 15, color: NAVY, fontWeight: sel ? 500 : 400 }}>{c}</span>
                  </button>
                )
              })}
            </div>
            <button onClick={goNext} disabled={conditions.length === 0} style={{ ...nextBtn(conditions.length > 0), position: 'sticky', bottom: 24 }}>Next</button>
          </div>
        )}

        {/* Step 6 — Previous meds Yes/No */}
        {step === 6 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.35, marginBottom: 48 }}>
              Have you taken any weight loss medication(s) within the past 6 months?
            </h1>
            {['Yes', 'No'].map(opt => (
              <button key={opt} onClick={() => { setPrevMeds(opt); setTimeout(() => opt === 'No' ? setStep(8) : setStep(7), 220) }}
                style={{ ...cardBtn(prevMeds === opt), display: 'block', fontSize: 17, fontWeight: 500, color: NAVY, textAlign: 'center', padding: '22px' }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Step 7 — Which medications */}
        {step === 7 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.35, marginBottom: 8 }}>Which medication(s) have you taken?</h1>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 28 }}>Select all that apply.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {MEDICATIONS.map(m => {
                const sel = medications.includes(m)
                return (
                  <button key={m} onClick={() => toggleMed(m)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', background: sel ? `${NAVY}0A` : '#fff', border: `1.5px solid ${sel ? NAVY : BORDER}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
                    <div style={checkBox(sel)}>
                      {sel && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 15, color: NAVY, fontWeight: sel ? 500 : 400 }}>{m}</span>
                  </button>
                )
              })}
            </div>
            <button onClick={goNext} disabled={medications.length === 0} style={{ ...nextBtn(medications.length > 0), position: 'sticky', bottom: 24 }}>Next</button>
          </div>
        )}

        {/* Step 8 — BMI visualization */}
        {step === 8 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 8 }}>
              Your BMI is <span style={{ color: bmiColor }}>{bmi}</span>
            </h1>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 48 }}>This helps your doctor confirm safe dosing ranges.</p>

            {/* Summary row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              {[
                { label: 'Height', value: `${heightFt}′ ${heightIn}″` },
                { label: 'Weight', value: `${currentWeight} lbs` },
                { label: 'Category', value: bmiCategory },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, padding: '16px 14px', background: '#F9FAFB', border: `1px solid ${BORDER}`, borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* BMI bar */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span>Underweight</span><span>Healthy</span><span>Overweight</span><span>Obese</span>
              </div>
              <div style={{ position: 'relative', height: 10, borderRadius: 100, background: 'linear-gradient(to right, #FCD34D 0%, #4ADE80 28%, #4ADE80 45%, #FB923C 62%, #EF4444 100%)' }}>
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                  left: `${bmiThumbPct}%`,
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#fff', border: `3px solid ${NAVY}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 18, fontSize: 15, color: MUTED }}>
                Your BMI: <strong style={{ color: NAVY, fontSize: 18 }}>{bmi}</strong>
              </div>
            </div>

            <button onClick={goNext} style={nextBtn(true)}>Next</button>
          </div>
        )}

        {/* Step 9 — personalized 6-month projection chart */}
        {step === 9 && calc && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 8 }}>
              In six months, you could lose{' '}
              <span style={{ color: '#10B981' }}>{calc.loss6mo} lbs.</span>
            </h1>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 40 }}>
              Based on your {calc.timelineLabel.toLowerCase()} timeline
              {prevMeds === 'Yes' ? ', medication history' : ''}
              {conditions.length > 0 && conditions[0] !== 'None of these' ? ', and health profile' : ''}.
            </p>

            {/* Dynamic chart */}
            <div style={{ overflowX: 'auto', marginBottom: 24 }}>
              <svg width={544} height={218} style={{ display: 'block', maxWidth: '100%' }}>
                {/* Dashed top & bottom ref lines */}
                <line x1={64} y1={chartPoints[0]?.y ?? 24} x2={532} y2={chartPoints[0]?.y ?? 24}
                  stroke={BORDER} strokeWidth={1.5} strokeDasharray="5 4" />
                <line x1={64} y1={chartPoints[6]?.y ?? 194} x2={532} y2={chartPoints[6]?.y ?? 194}
                  stroke={BORDER} strokeWidth={1.5} strokeDasharray="5 4" />

                {/* Weight axis labels */}
                <text x={58} y={(chartPoints[0]?.y ?? 24) + 4} textAnchor="end" fontSize={12}
                  fontWeight="600" fill={NAVY} fontFamily="Inter, sans-serif">
                  {currentWeight} lbs
                </text>
                <text x={58} y={(chartPoints[6]?.y ?? 194) + 4} textAnchor="end" fontSize={12}
                  fontWeight="600" fill={NAVY} fontFamily="Inter, sans-serif">
                  {calc.proj6mo} lbs
                </text>

                {/* Smooth curve through monthly waypoints */}
                {chartPoints.length >= 2 && (
                  <path d={smoothPath(chartPoints)} fill="none" stroke="#6B81D4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Goal weight dashed line (if within chart range) */}
                {(() => {
                  const gw = parseInt(goalWeight || '0')
                  const cw = parseInt(currentWeight || '0')
                  const minW = Math.min(...(calc?.monthlyWeights.slice(0, 7) ?? [cw])) - 2
                  const maxW = cw + 2
                  if (gw > 0 && gw < cw) {
                    const gy = 24 + (1 - (gw - minW) / (maxW - minW)) * 170
                    const clampY = Math.min(194, Math.max(24, gy))
                    return (
                      <>
                        <line x1={64} y1={clampY} x2={532} y2={clampY}
                          stroke="#10B981" strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
                        <text x={536} y={clampY + 4} fontSize={10} fill="#10B981" fontFamily="Inter, sans-serif">Goal</text>
                      </>
                    )
                  }
                  return null
                })()}

                {/* Endpoint dots */}
                {chartPoints.length >= 7 && (
                  <>
                    <circle cx={chartPoints[0].x} cy={chartPoints[0].y} r={6} fill="#6B81D4" />
                    <circle cx={chartPoints[6].x} cy={chartPoints[6].y} r={6} fill="#6B81D4" />
                  </>
                )}

                {/* Month labels */}
                {['Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                  <text key={m} x={64 + (460 / 6) * i} y={210} textAnchor="middle"
                    fontSize={12} fill={MUTED} fontFamily="Inter, sans-serif">{m}</text>
                ))}
              </svg>
            </div>

            {/* Personalized stats row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              {[
                { label: 'Weekly avg loss', value: `~${calc.weeklyLbs} lbs/wk` },
                { label: '6-month target', value: `${calc.proj6mo} lbs` },
                ...(calc.monthsToGoal > 0
                  ? [{ label: 'Time to your goal', value: `~${calc.monthsToGoal} months` }]
                  : [{ label: 'Program', value: calc.timelineLabel }]
                ),
              ].map(item => (
                <div key={item.label} style={{ flex: 1, padding: '14px 10px', background: '#F9FAFB', border: `1px solid ${BORDER}`, borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{item.label}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, marginBottom: 36 }}>
              Projection based on your timeline, health profile, and clinical averages. Individual results vary.
            </p>

            <button onClick={goNext} style={nextBtn(true)}>Next</button>
          </div>
        )}

        {/* Step 10 — Ready to start */}
        {step === 10 && calc && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 8 }}>
              Your plan is ready.
            </h1>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.65, marginBottom: 40 }}>
              We&apos;ll match you with a provider and a {calc.timelineLabel.toLowerCase()} medication plan.
              In six months, you could lose <strong style={{ color: NAVY }}>{calc.loss6mo} lbs</strong>
              {calc.monthsToGoal > 0 ? ` — reaching your goal of ${goalWeight} lbs in ~${calc.monthsToGoal} months.` : '.'}
            </p>

            {/* What happens next */}
            <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 14 }}>What happens next</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
              {[
                'Meet with a board-certified provider online.',
                'Start your personalized care plan & medication.',
                'Unlimited support every step of the way.',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', border: `1px solid ${BORDER}`, borderRadius: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${NAVY}12`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: NAVY, fontStyle: 'italic' }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: NAVY }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Trust stats */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              {[
                { stat: '50k+', label: 'Members helped' },
                { stat: '10.2%', label: 'Avg body weight lost' },
                { stat: '4.8★', label: 'Member satisfaction' },
              ].map(item => (
                <div key={item.stat} style={{ flex: 1, padding: '18px 12px', background: '#F9FAFB', borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.stat}</div>
                  <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={{ padding: '20px 24px', background: '#F9FAFB', borderRadius: 16, marginBottom: 40, borderLeft: `3px solid ${NAVY}` }}>
              <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.7, marginBottom: 10, fontStyle: 'italic' }}>
                &ldquo;I felt heard and supported every step of the way. Down 27 lbs in 5 months.&rdquo;
              </p>
              <span style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>— Kristina F., The Labo Clinic member</span>
            </div>

            {/* How membership works */}
            <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 14 }}>How the membership works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
              {[
                { icon: '🩺', title: 'The Labo Clinic Membership', sub: 'Provider visits and unlimited messaging' },
                { icon: '💊', title: 'Medication orders', sub: 'Billed separately; approval required' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', border: `1px solid ${BORDER}`, borderRadius: 14 }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: MUTED }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={goNext} style={nextBtn(true)}>Choose a plan →</button>
          </div>
        )}

        {/* Step 11 — Payment */}
        {step === 11 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.35, marginBottom: 8 }}>How would you like to pay?</h1>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 40 }}>We accept most major insurance plans and offer affordable self-pay options.</p>
            {[
              { value: 'insurance', label: 'Use my insurance', sub: "We'll verify your coverage before your first visit" },
              { value: 'selfpay', label: 'Self-pay — $199/month', sub: 'Includes provider visits, medication & coaching' },
              { value: 'unsure', label: "I'm not sure yet", sub: "We'll help you choose the best option" },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setPayment(opt.value); setTimeout(goNext, 220) }} style={cardBtn(payment === opt.value)}>
                <div style={{ fontSize: 16, fontWeight: 600, color: NAVY }}>{opt.label}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 12 — Plan reveal */}
        {step === 12 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 12 }}>You&apos;re a great fit!</h1>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 48, maxWidth: 440, margin: '0 auto 48px' }}>
              Based on your responses, you qualify for our GLP-1 weight loss program. A licensed provider will review your intake and reach out within 24 hours.
            </p>
            <div style={{ background: '#F9FAFB', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 32px', textAlign: 'left', marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20 }}>Your personalized plan</h2>
              {[
                { label: 'Current weight', value: `${currentWeight} lbs` },
                { label: 'Goal weight', value: `${goalWeight} lbs` },
                { label: 'To lose', value: `${toLose} lbs` },
                { label: '6-month projection', value: calc ? `−${calc.loss6mo} lbs` : '—' },
                { label: 'Weekly avg loss', value: calc ? `~${calc.weeklyLbs} lbs/wk` : '—' },
                { label: 'Timeline', value: calc?.timelineLabel ?? '—' },
                { label: 'Program', value: 'GLP-1 (Semaglutide or Tirzepatide)' },
                { label: 'Next step', value: 'Provider consultation' },
              ].map((r, i, arr) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <span style={{ fontSize: 14, color: MUTED }}>{r.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{r.value}</span>
                </div>
              ))}
            </div>
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true)
                const weightAnswers = {
                  height: `${heightFt}ft ${heightIn}in`,
                  current_weight_lbs: currentWeight,
                  goal_weight_lbs: goalWeight,
                  timeline,
                  conditions,
                  prev_weight_loss_meds: prevMeds,
                  medications,
                  payment_preference: payment,
                  bmi: bmi,
                  projected_6mo_loss_lbs: calc?.loss6mo,
                }
                try {
                  const res = await fetch('/api/intake/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ careType: 'weight', answers: weightAnswers }),
                  })
                  if (!res.ok) {
                    const { error } = await res.json()
                    console.error('Weight intake save failed:', error)
                  } else {
                    const supabase = createClient()
                    const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                      const { data: profile } = await supabase
                        .from('profiles').select('full_name, email').eq('id', user.id).single()
                      fetch('/api/emails/intake', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          patientName: profile?.full_name ?? '',
                          patientEmail: profile?.email ?? user.email ?? '',
                          careType: 'weight',
                          answers: weightAnswers,
                        }),
                      })
                    }
                  }
                } catch (err) {
                  console.error('Weight intake save error:', err)
                } finally {
                  router.push('/patient/care/weight')
                }
              }}
              style={{ width: '100%', padding: '18px', background: NAVY, color: '#fff', border: 'none', borderRadius: 100, fontSize: 16, fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Go to my weight care plan →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
