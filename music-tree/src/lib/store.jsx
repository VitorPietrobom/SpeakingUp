// App state: React context + reducer, persisted to localStorage (offline-first).
// All user progress lives here; static sky content comes from data/skies.js.
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { skiesById } from '../data/skies.js'
import {
  REVIEW_BASE_DAYS, emptyProg, requiredDone, withPrereqClosure,
  bumpStreak, countCompleted, pctIgnited, dateKey,
} from './engine.js'

const KEY = 'mt-state-v1'

const initial = {
  onboarded: false,
  currentSkyId: null,
  skies: {},          // { [skyId]: { chartedAt, stars: { [id]: rec }, watched: [] } }
  streak: { count: 0, last: null },
  minutesByDay: {},   // { 'y-m-d': minutes }
  session: null,      // { startedAt, skyId, items: [{kind, starId, label, status, note}] }
  lastSummary: null,  // snapshot rendered by the Summary screen
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial, ...JSON.parse(raw) }
  } catch { /* corrupted or unavailable storage — start fresh */ }
  return initial
}

// A star's stored record. state is only stored once the user acts on the
// star (derived states available/locked are never stored).
function blankRec() {
  return { state: 'in_progress', checked: {}, ignitedAt: null, verified: false, reviewInterval: REVIEW_BASE_DAYS, lastReviewAt: null }
}

function updateRec(state, starId, fn) {
  const skyId = state.currentSkyId
  const prog = state.skies[skyId] || emptyProg()
  const rec = { ...(prog.stars[starId] || blankRec()) }
  fn(rec)
  return {
    ...state,
    skies: { ...state.skies, [skyId]: { ...prog, stars: { ...prog.stars, [starId]: rec } } },
  }
}

function syncCheckState(sky, starId, rec) {
  const star = sky.stars.find((s) => s.id === starId)
  if (!star || rec.state === 'completed') return
  rec.state = requiredDone(star, rec) ? 'ready_for_eval' : 'in_progress'
}

function withSession(state, item) {
  const sky = skiesById[state.currentSkyId]
  const prog = state.skies[state.currentSkyId] || emptyProg()
  const session = state.session && dateKey(state.session.startedAt) === dateKey(Date.now())
    ? state.session
    : { startedAt: Date.now(), skyId: state.currentSkyId, items: [], pctStart: pctIgnited(sky, prog) }
  return { ...state, session: { ...session, items: [...session.items, item] } }
}

function reducer(state, action) {
  const sky = skiesById[state.currentSkyId]
  switch (action.type) {
    case 'chartSky': {
      const target = skiesById[action.skyId]
      const stars = {}
      const now = Date.now()
      for (const id of withPrereqClosure(target, action.preIgnitedIds || [])) {
        // Pre-ignited stars are completed but verified=false until the user
        // self-checks the criteria on the node page (SPEC: no extra state).
        stars[id] = { ...blankRec(), state: 'completed', ignitedAt: now, verified: false }
      }
      return {
        ...state,
        onboarded: true,
        currentSkyId: action.skyId,
        skies: { ...state.skies, [action.skyId]: { chartedAt: now, stars, watched: [] } },
      }
    }
    case 'switchSky':
      return { ...state, currentSkyId: action.skyId }
    case 'toggleCriterion':
      return updateRec(state, action.starId, (rec) => {
        rec.checked = { ...rec.checked, [action.critId]: !rec.checked[action.critId] }
        if (rec.state === 'completed') {
          // Verify-honestly flow for pre-ignited stars.
          const star = sky.stars.find((s) => s.id === action.starId)
          if (star && requiredDone(star, rec)) rec.verified = true
        } else {
          syncCheckState(sky, action.starId, rec)
        }
      })
    case 'sealCriterion': {
      const next = updateRec(state, action.starId, (rec) => {
        rec.checked = { ...rec.checked, [action.critId]: true }
        syncCheckState(sky, action.starId, rec)
      })
      return withSession(next, { kind: 'drill', starId: action.starId, status: 'sealed', note: action.note || '' })
    }
    case 'attachRecording':
      return updateRec(state, action.starId, (rec) => {
        rec.recorded = { duration: action.duration }
        const star = sky.stars.find((s) => s.id === action.starId)
        const critRec = star?.criteria.find((c) => c.recording)
        if (critRec) {
          rec.checked = { ...rec.checked, [critRec.id]: true }
          syncCheckState(sky, action.starId, rec)
        }
      })
    case 'ignite': {
      const next = updateRec(state, action.starId, (rec) => {
        rec.state = 'completed'
        rec.ignitedAt = Date.now()
        rec.verified = true
        rec.reviewInterval = REVIEW_BASE_DAYS
        rec.lastReviewAt = null
      })
      return withSession(next, { kind: 'ignite', starId: action.starId, status: 'ignited', note: action.feel || '' })
    }
    case 'demote':
      // Evaluation said "shaky" / "not yet" — back to in_progress.
      return updateRec(state, action.starId, (rec) => {
        if (rec.state === 'ready_for_eval') rec.state = 'in_progress'
      })
    case 'reviewPass': {
      const next = updateRec(state, action.starId, (rec) => {
        rec.lastReviewAt = Date.now()
        rec.reviewInterval = (rec.reviewInterval || REVIEW_BASE_DAYS) * 2
      })
      return withSession(next, { kind: 'review', starId: action.starId, status: 'kept' })
    }
    case 'reviewFail': {
      const next = updateRec(state, action.starId, (rec) => {
        rec.state = 'in_progress'
        rec.ignitedAt = null
        rec.lastReviewAt = null
        rec.reviewInterval = REVIEW_BASE_DAYS
        const checked = { ...rec.checked }
        for (const id of action.failedCritIds) delete checked[id]
        rec.checked = checked
      })
      return withSession(next, { kind: 'review', starId: action.starId, status: 'slipped' })
    }
    case 'markRead': {
      const next = updateRec(state, action.starId, (rec) => {
        rec.read = { ...(rec.read || {}), [action.resIdx]: true }
      })
      return withSession(next, { kind: 'read', starId: action.starId, status: 'done' })
    }
    case 'saveNote':
      return updateRec(state, action.starId, (rec) => {
        rec.note = action.text
      })
    case 'skipItem':
      return withSession(state, { kind: action.item.kind, starId: action.item.starId, status: 'skipped' })
    case 'addSong': {
      const prog = state.skies[state.currentSkyId] || emptyProg()
      return {
        ...state,
        skies: {
          ...state.skies,
          [state.currentSkyId]: { ...prog, customSongs: [...(prog.customSongs || []), action.song] },
        },
      }
    }
    case 'toggleWatch': {
      const prog = state.skies[state.currentSkyId] || emptyProg()
      const watched = prog.watched.includes(action.starId)
        ? prog.watched.filter((id) => id !== action.starId)
        : [...prog.watched, action.starId]
      return { ...state, skies: { ...state.skies, [state.currentSkyId]: { ...prog, watched } } }
    }
    case 'endSession': {
      if (!state.session) return state
      const now = Date.now()
      const minutes = Math.max(1, Math.round((now - state.session.startedAt) / 60000))
      const streak = bumpStreak(state.streak, now)
      const prog = state.skies[state.currentSkyId] || emptyProg()
      const summary = {
        at: now,
        minutes,
        skyId: state.currentSkyId,
        items: state.session.items,
        pctAfter: pctIgnited(sky, prog),
        pctBefore: state.session.pctStart ?? pctIgnited(sky, prog),
        ignitedAfter: countCompleted(sky, prog),
        streak: streak.count,
      }
      const day = dateKey(now)
      return {
        ...state,
        streak,
        session: null,
        lastSummary: summary,
        minutesByDay: { ...state.minutesByDay, [day]: (state.minutesByDay[day] || 0) + minutes },
      }
    }
    default:
      return state
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch { /* storage full/unavailable — app still works in memory */ }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  return useContext(StoreCtx)
}

// Convenience: current sky definition + its progress.
export function useSky() {
  const { state, dispatch } = useStore()
  const sky = skiesById[state.currentSkyId] || null
  const prog = (sky && state.skies[sky.id]) || emptyProg()
  return { state, dispatch, sky, prog }
}

// Minutes practiced in the current calendar week (Mon-based).
export function weekMinutes(minutesByDay, now = new Date()) {
  const d = new Date(now)
  const dow = (d.getDay() + 6) % 7
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - dow)
  let total = 0
  for (let i = 0; i < 7; i++) {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    total += minutesByDay[dateKey(day.getTime())] || 0
  }
  return total
}
