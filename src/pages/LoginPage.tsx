import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { Salad } from 'lucide-react'
import { useLogin } from '@/hooks/useLogin'
import { Form, Input } from 'antd'

/* ---------- Character Config ---------- */
interface EyePos { leftPct: number; topPct: number }
interface CharConfig {
  id: string
  color: string
  width: number
  height: number
  left: number
  bottom: number
  zIndex: number
  blinks: boolean
  hasMouth: boolean
  domeTop: boolean
  pupilOnly: boolean
  eyes: [EyePos, EyePos]
  eyeBallSize: number
  pupilSize: number
  borderRadius?: string
}

const CHARACTERS: CharConfig[] = [
  {
    id: 'char-1',
    color: '#0D9488',
    width: 180,
    height: 400,
    left: 30,
    bottom: 0,
    zIndex: 1,
    blinks: true,
    hasMouth: false,
    domeTop: true,
    pupilOnly: false,
    eyes: [{ leftPct: 28, topPct: 32 }, { leftPct: 58, topPct: 32 }],
    eyeBallSize: 16,
    pupilSize: 6,
    borderRadius: '90px 90px 0 0',
  },
  {
    id: 'char-2',
    color: '#115E59',
    width: 120,
    height: 310,
    left: 140,
    bottom: 0,
    zIndex: 2,
    blinks: true,
    hasMouth: false,
    domeTop: true,
    pupilOnly: false,
    eyes: [{ leftPct: 25, topPct: 34 }, { leftPct: 60, topPct: 34 }],
    eyeBallSize: 14,
    pupilSize: 6,
    borderRadius: '60px 60px 0 0',
  },
  {
    id: 'char-3',
    color: '#F59E0B',
    width: 220,
    height: 190,
    left: 200,
    bottom: 0,
    zIndex: 3,
    blinks: false,
    hasMouth: false,
    domeTop: true,
    pupilOnly: true,
    eyes: [{ leftPct: 28, topPct: 36 }, { leftPct: 58, topPct: 36 }],
    eyeBallSize: 0,
    pupilSize: 9,
    borderRadius: '110px 110px 0 0',
  },
  {
    id: 'char-4',
    color: '#FBBF24',
    width: 130,
    height: 220,
    left: 360,
    bottom: 0,
    zIndex: 4,
    blinks: false,
    hasMouth: true,
    domeTop: true,
    pupilOnly: true,
    eyes: [{ leftPct: 24, topPct: 38 }, { leftPct: 58, topPct: 38 }],
    eyeBallSize: 0,
    pupilSize: 8,
    borderRadius: '65px 65px 0 0',
  },
]

/* ---------- SVG Icons ---------- */
const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

/* ---------- Anim State (minimal — only flags, all positions computed per frame) ---------- */
interface AnimState {
  cursorX: number
  cursorY: number
  passwordVisible: boolean
  hasPasswordValue: boolean
  isFocused: boolean
  purpleBlink: boolean
  blackBlink: boolean
  purplePeeking: boolean
  lookingAtEachOther: boolean
}

/* ---------- Component ---------- */
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const { login } = useLogin()
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const s = useRef<AnimState>({
    cursorX: 0, cursorY: 0,
    passwordVisible: false, hasPasswordValue: false, isFocused: false,
    purpleBlink: false, blackBlink: false, purplePeeking: false,
    lookingAtEachOther: false,
  })

  const MAX_PUPIL_DIST = [5, 4, 5, 5] // max pupil travel per char

  /* ---------- Animation Loop ---------- */
  useEffect(() => {
    const $ = <T extends HTMLElement>(sel: string) =>
      Array.from(containerRef.current?.querySelectorAll<T>(sel) ?? [])

    // Native DOM focus/blur — bypass Ant Design synthetic event wrapper
    const handleNativeFocus = () => {
      s.current.isFocused = true
      s.current.lookingAtEachOther = true
      setTimeout(() => { s.current.lookingAtEachOther = false }, 800)
    }
    const handleNativeBlur = () => { s.current.isFocused = false }

    // Wire up after mount — native listeners, no React synthetic issue
    const inputs = containerRef.current?.querySelectorAll<HTMLElement>('input')
    inputs?.forEach(inp => {
      inp.addEventListener('focus', handleNativeFocus)
      inp.addEventListener('blur', handleNativeBlur)
    })

    function eyePupilOffset(el: HTMLElement, maxDist: number, forceX?: number, forceY?: number) {
      if (forceX !== undefined && forceY !== undefined) return { x: forceX, y: forceY }
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = s.current.cursorX - cx
      const dy = s.current.cursorY - cy
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist)
      const angle = Math.atan2(dy, dx)
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
    }

    function calcPos(el: HTMLElement) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 3
      const dx = s.current.cursorX - cx
      const dy = s.current.cursorY - cy
      return {
        faceX: Math.max(-15, Math.min(15, dx / 20)),
        faceY: Math.max(-10, Math.min(10, dy / 30)),
        bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
      }
    }

    // Pupil-only (orange/yellow): apply offset directly to data-pupil
    function setPupilOnly(el: HTMLElement, maxDist: number, forceX?: number, forceY?: number) {
      const o = eyePupilOffset(el, maxDist, forceX, forceY)
      el.style.transform = `translate(${o.x}px, ${o.y}px)`
    }

    // Eyeball pupil: apply offset to .pupil inside the eyeball
    function setPupil(eyeEl: HTMLElement, maxDist: number, forceX?: number, forceY?: number) {
      const pupil = eyeEl.querySelector<HTMLElement>('.pupil')
      const o = eyePupilOffset(eyeEl, maxDist, forceX, forceY)
      if (pupil) pupil.style.transform = `translate(${o.x}px, ${o.y}px)`
    }

    function animate() {
      const state = s.current
      const isHiding = state.hasPasswordValue && !state.passwordVisible
      const isShowingPw = state.hasPasswordValue && state.passwordVisible

      const bodies = $<HTMLElement>('[data-body]')

      bodies.forEach((body, idx) => {
        const pos = calcPos(body)

        // ---- Body transform ----
        let skew = pos.bodySkew
        let translateX = 0
        let heightScale = 1

        if (isHiding) {
          if (idx === 0) { skew = -6; translateX = -14 }
          else if (idx === 1) { skew = pos.bodySkew * 1.5 }
        } else if (isShowingPw) {
          skew = 0
        } else if (state.lookingAtEachOther && idx === 1) {
          skew = 10; translateX = 20
        }

        // Char-1 mirror: tilt left instead of right to avoid eye overlap with char-2
        if (idx === 0 && !isHiding) {
          skew = -skew
          translateX = -translateX
        }

        body.style.transform = `skewX(${skew}deg) translateX(${translateX}px) scaleY(${heightScale})`

        // Peeking: push char 0 above char 1 so overlapping doesn't block eyes
        const zOrig = [1, 2, 3, 4][idx]
        body.style.zIndex = (idx === 0 && isShowingPw && state.purplePeeking) ? '5' : String(zOrig)

        // ---- Eye-wrap position ----
        const eyewrap = body.querySelector<HTMLElement>('[data-eyewrap]')
        if (!eyewrap) return

        let ex = pos.faceX
        let ey = pos.faceY

        if (state.isFocused) {
          // Input focused — stop tracking cursor. Characters look at form area.
          if (isShowingPw) {
            // Password visible: all look down at password field
            const pwLookPos = [
              { x: -20, y: 20 },
              { x: -10, y: 12 },
              { x: 0, y: 30 },
              { x: -10, y: 18 },
            ][idx]
            ex = pwLookPos.x; ey = pwLookPos.y
            // Purple peeking: sneaks a glance
            if (idx === 0 && state.purplePeeking) { ex = 4; ey = 5 }
          } else {
            // Password hidden: slight downward look toward input area
            ex = -8; ey = Math.max(ey, 14)
          }
        } else if (state.lookingAtEachOther) {
          if (idx === 0) { ex = -30; ey = 10 }
          else if (idx === 1) { ex = 22; ey = 5 }
        }

        eyewrap.style.transform = `translate(${ex}px, ${ey}px)`

        // ---- Pupils ----
        const eyes = body.querySelectorAll<HTMLElement>('[data-eye]')
        const maxPupil = MAX_PUPIL_DIST[idx]

        if (idx === 0 || idx === 1) {
          // Eyeball chars: set pupil inside each eye
          let fx: number | undefined, fy: number | undefined
          if (idx === 0 && isShowingPw && state.purplePeeking) { fx = 4; fy = 5 }
          else if (idx === 0 && isShowingPw) { fx = -4; fy = -4 }
          else if (idx === 1 && isShowingPw) { fx = -4; fy = -4 }
          eyes.forEach(eye => setPupil(eye, maxPupil, fx, fy))

          // Blink: eyeball height
          const isBlink = (idx === 0 && state.purpleBlink) || (idx === 1 && state.blackBlink)
          const eyeballs = body.querySelectorAll<HTMLElement>('[data-eyeball]')
          const originalSize = [16, 14][idx] // purple=16, black=14
          eyeballs.forEach(eb => {
            eb.style.height = isBlink ? '2px' : `${originalSize}px`
          })
        } else {
          // Pupil-only chars
          let fx: number | undefined, fy: number | undefined
          if (isShowingPw) { fx = -5; fy = -4 }
          eyes.forEach(eye => setPupilOnly(eye, maxPupil, fx, fy))
        }

        // ---- Mouth (char 3) ----
        if (idx === 3) {
          const mouth = body.querySelector<HTMLElement>('[data-mouth]')
          if (mouth) {
            const o = eyePupilOffset(mouth, 60)
            const mw = 50 + Math.abs(o.y * 0.5)
            mouth.style.width = `${Math.min(mw, 85)}px`
          }
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    // ---- Blink schedulers ----
    function scheduleBlink(setter: (v: boolean) => void) {
      const delay = 3000 + Math.random() * 4000
      setTimeout(() => {
        setter(true)
        setTimeout(() => {
          setter(false)
          scheduleBlink(setter)
        }, 150)
      }, delay)
    }
    scheduleBlink((v: boolean) => { s.current.purpleBlink = v })
    scheduleBlink((v: boolean) => { s.current.blackBlink = v })

    // ---- Peek scheduler (re-checks every 1s when conditions met) ----
    const peekInterval = window.setInterval(() => {
      if (s.current.hasPasswordValue && s.current.passwordVisible && !s.current.purplePeeking) {
        const delay = 2000 + Math.random() * 3000
        setTimeout(() => {
          if (s.current.hasPasswordValue && s.current.passwordVisible) {
            s.current.purplePeeking = true
            setTimeout(() => { s.current.purplePeeking = false }, 800)
          }
        }, delay)
      }
    }, 1000)

    rafRef.current = requestAnimationFrame(animate)
    // Clean up native listeners
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(peekInterval)
      inputs?.forEach(inp => {
        inp.removeEventListener('focus', handleNativeFocus)
        inp.removeEventListener('blur', handleNativeBlur)
      })
    }
  }, [])

  /* ---------- Event Handlers ---------- */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    s.current.cursorX = e.clientX
    s.current.cursorY = e.clientY
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPasswordValue(val)
    s.current.hasPasswordValue = val.length > 0
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(prev => {
      s.current.passwordVisible = !prev
      return !prev
    })
  }, [])

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    const success = await login(values.username, values.password)
    setLoading(false)
    if (success) navigate('/')
  }

  /* ---------- Render Character ---------- */
  const renderCharacter = (char: CharConfig, idx: number) => {
    const eyeSpacing = char.eyes[1].leftPct - char.eyes[0].leftPct // % gap between eyes
    const eyeSize = char.eyeBallSize || char.pupilSize + 4
    const gapPx = eyeSpacing * char.width / 100 // pixel gap between eye centers
    const wrapW = gapPx + eyeSize
    const eyewrapTransition = idx < 2
      ? 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'all 0.2s ease-out'

    return (
      <div
        key={char.id}
        data-body
        style={{
          position: 'absolute',
          bottom: char.bottom,
          left: char.left,
          width: char.width,
          height: char.height,
          zIndex: char.zIndex,
          transformOrigin: 'bottom center',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          background: char.color,
          borderRadius: char.borderRadius,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Eye-wrap — position at center of first eye, contains both eyes */}
          <div
            data-eyewrap
            style={{
              position: 'absolute',
              left: `${char.eyes[0].leftPct}%`,
              top: `${char.eyes[0].topPct}%`,
              width: wrapW,
              height: eyeSize,
              transition: eyewrapTransition,
            }}
          >
            {char.eyes.map((_eye, ei) => (
              <div
                key={ei}
                data-eye
                style={{
                  position: 'absolute',
                  left: ei === 0 ? 0 : gapPx,
                  top: 0,
                  width: eyeSize,
                  height: eyeSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!char.pupilOnly && (
                  <div
                    data-eyeball
                    style={{
                      width: char.eyeBallSize,
                      height: char.eyeBallSize,
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      transition: 'height 0.15s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="pupil"
                      style={{
                        width: char.pupilSize,
                        height: char.pupilSize,
                        borderRadius: '50%',
                        background: '#1A1815',
                        willChange: 'transform',
                      }}
                    />
                  </div>
                )}

                {char.pupilOnly && (
                  <div
                    className="pupil"
                    style={{
                      width: char.pupilSize,
                      height: char.pupilSize,
                      borderRadius: '50%',
                      background: '#1A1815',
                      willChange: 'transform',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mouth (char 3) */}
          {char.hasMouth && (
            <div
              data-mouth
              style={{
                position: 'absolute',
                bottom: '26%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 50,
                height: 4,
                background: '#92400E',
                borderRadius: 2,
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#F8F6F2',
        overflow: 'hidden',
      }}
    >
      {/* ======== Left Panel: Characters ======== */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0D9488, #0F766E, #0A5C56)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px 1px, transparent 1px 40px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px 1px, transparent 1px 40px)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Blurred orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-8%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.10)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-8%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Character container */}
        <div style={{
          position: 'relative',
          width: 500,
          height: 420,
          zIndex: 1,
          marginBottom: 0,
        }}>
          {CHARACTERS.map((char, idx) => renderCharacter(char, idx))}
        </div>
      </div>

      {/* ======== Right Panel: Form ======== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        position: 'relative',
      }}>
        <div style={{
          width: 400,
          padding: 40,
          animation: 'formEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <style>{`
            @keyframes formEntrance {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
            }
            @keyframes logoPop {
              0% { transform: scale(1); }
              40% { transform: scale(1.15); }
              100% { transform: scale(1); }
            }
            @keyframes inputGlow {
              0% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.2); }
              70% { box-shadow: 0 0 0 6px rgba(13, 148, 136, 0); }
              100% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0); }
            }
            @keyframes shakeNope {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-4px); }
              40% { transform: translateX(4px); }
              60% { transform: translateX(-3px); }
              80% { transform: translateX(2px); }
            }
          `}</style>

          {/* Logo — custom SVG mark */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              className="login-logo"
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                cursor: 'default',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.12) rotate(-8deg)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(13, 148, 136, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)'
              }}
            >
              <Salad size={28} strokeWidth={1.5} />
            </div>
            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#1A1815',
              marginBottom: 6,
              letterSpacing: '-0.02em',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              欢迎回来！
            </h1>
          </div>

          {/* Form */}
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#A39D93' }} />}
                placeholder="用户名"
                style={{
                  background: '#FAF8F5',
                  borderRadius: 8,
                  height: 48,
                  fontSize: 15,
                  border: '1px solid #E6E1D9',
                  transition: 'border-color 0.25s ease, box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onFocus={e => {
                  e.currentTarget.style.transform = 'scale(1.01)'
                  e.currentTarget.style.borderColor = '#0D9488'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 148, 136, 0.12)'
                  e.currentTarget.style.animation = 'inputGlow 1s ease-out'
                }}
                onBlur={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = '#E6E1D9'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.animation = 'none'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <div style={{ position: 'relative' }}>
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="密码"
                  prefix={<LockOutlined style={{ color: '#A39D93' }} />}
                  value={passwordValue}
                  onChange={handlePasswordChange}
                  style={{
                    background: '#FAF8F5',
                    borderRadius: 8,
                    height: 48,
                    fontSize: 15,
                    border: '1px solid #E6E1D9',
                    paddingRight: 44,
                    transition: 'border-color 0.25s ease, box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.transform = 'scale(1.01)'
                    e.currentTarget.style.borderColor = '#0D9488'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 148, 136, 0.12)'
                    e.currentTarget.style.animation = 'inputGlow 1s ease-out'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.borderColor = '#E6E1D9'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.animation = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A39D93',
                  }}
                  aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
                >
                  {passwordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              {/* Q弹登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 48,
                  borderRadius: 9999,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
                  overflow: 'hidden',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'scale(0.97)'
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
              >
                <span
                  className="btn-text"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 1,
                    transform: 'translateX(0)',
                  }}
                  onMouseEnter={e => {
                    const t = e.currentTarget
                    t.style.opacity = '0'
                    t.style.transform = 'translateX(48px)'
                  }}
                  onMouseLeave={e => {
                    const t = e.currentTarget
                    t.style.opacity = '1'
                    t.style.transform = 'translateX(0)'
                  }}
                >
                  {loading ? '登录中...' : '登录'}
                </span>

                {/* Slide-in overlay */}
                <span
                  className="btn-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: '#1A1815',
                    color: '#fff',
                    borderRadius: 9999,
                    fontSize: 15,
                    fontWeight: 600,
                    opacity: 0,
                    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
                >
                  {loading ? '登录中...' : '进入系统'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

/* ---------- Inline icons (local) ---------- */
const LockOutlined = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
