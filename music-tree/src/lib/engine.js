// Pure derivation logic for the star state machine, brightness decay,
// session queue and song proximity. Everything here takes (sky, prog) —
// sky = static definition from data/skies.js, prog = persisted user progress
// for that sky ({ stars: { [id]: rec }, watched: [] }).
//
// Star states (SPEC.md): locked → available → in_progress → ready_for_eval
// → completed → fading → (review pass: completed | fail: in_progress).
// "fading" is not stored — it's completed with brightness < 80.

export const DAY = 86400000
export const DECAY_DAYS = 45
export const BRIGHTNESS_FLOOR = 60
export const FADING_BELOW = 80
export const REVIEW_BASE_DAYS = 12

export const emptyProg = () => ({ stars: {}, watched: [] })

export function recOf(prog, starId) {
  return prog.stars[starId] || null
}

export function stateOf(sky, prog, starId) {
  const rec = recOf(prog, starId)
  if (rec?.state) return rec.state
  const star = sky.stars.find((s) => s.id === starId)
  if (!star) return 'locked'
  const open = star.prereqIds.every((id) => recOf(prog, id)?.state === 'completed')
  return open ? 'available' : 'locked'
}

export function brightnessOf(rec, now = Date.now()) {
  if (!rec || rec.state !== 'completed') return null
  const anchor = rec.lastReviewAt || rec.ignitedAt || now
  const t = Math.min(1, Math.max(0, (now - anchor) / (DECAY_DAYS * DAY)))
  return Math.round(100 - (100 - BRIGHTNESS_FLOOR) * t)
}

export function isFading(rec, now = Date.now()) {
  const b = brightnessOf(rec, now)
  return b !== null && b < FADING_BELOW
}

export function reviewDue(rec, now = Date.now()) {
  if (!rec || rec.state !== 'completed') return false
  const anchor = rec.lastReviewAt || rec.ignitedAt
  const interval = rec.reviewInterval || REVIEW_BASE_DAYS
  return now - anchor >= interval * DAY
}

export function daysSinceIgnited(rec, now = Date.now()) {
  if (!rec?.ignitedAt) return 0
  return Math.max(0, Math.floor((now - rec.ignitedAt) / DAY))
}

export function countCompleted(sky, prog) {
  return sky.stars.filter((s) => stateOf(sky, prog, s.id) === 'completed').length
}

export function pctIgnited(sky, prog) {
  return Math.round((countCompleted(sky, prog) / sky.stars.length) * 100)
}

export function availableStars(sky, prog) {
  return sky.stars.filter((s) => {
    const st = stateOf(sky, prog, s.id)
    return st === 'available' || st === 'in_progress' || st === 'ready_for_eval'
  })
}

// The single suggested "next star" — the only one that pulses in the sky.
// Prefer a star already in flight (in_progress / ready_for_eval), then the
// lowest-order available one.
export function suggestedNext(sky, prog) {
  const inFlight = sky.stars
    .filter((s) => ['in_progress', 'ready_for_eval'].includes(stateOf(sky, prog, s.id)))
    .sort((a, b) => a.order - b.order)
  if (inFlight.length) return inFlight[0]
  const avail = sky.stars
    .filter((s) => stateOf(sky, prog, s.id) === 'available')
    .sort((a, b) => a.order - b.order)
  return avail[0] || null
}

export function fadingStars(sky, prog, now = Date.now()) {
  return sky.stars
    .filter((s) => isFading(recOf(prog, s.id), now))
    .sort((a, b) => brightnessOf(recOf(prog, a.id), now) - brightnessOf(recOf(prog, b.id), now))
}

export function nextCriterion(star, rec) {
  return star.criteria.find((c) => c.required && !rec?.checked?.[c.id]) || null
}

export function requiredDone(star, rec) {
  return star.criteria.filter((c) => c.required).every((c) => rec?.checked?.[c.id])
}

export function checkedCount(star, rec) {
  return star.criteria.filter((c) => rec?.checked?.[c.id]).length
}

// Session queue: due reviews (max 2) → active star's next criterion /
// evaluation → suggested next star. Items: { kind, starId, label, sub, min }.
export function buildQueue(sky, prog, now = Date.now()) {
  const items = []
  const due = sky.stars
    .filter((s) => reviewDue(recOf(prog, s.id), now) || isFading(recOf(prog, s.id), now))
    .sort((a, b) => brightnessOf(recOf(prog, a.id), now) - brightnessOf(recOf(prog, b.id), now))
    .slice(0, 2)
  for (const s of due) {
    items.push({
      kind: 'review', starId: s.id, label: s.name,
      sub: `ignited ${daysSinceIgnited(recOf(prog, s.id), now)} days ago`, min: 5,
    })
  }
  const next = suggestedNext(sky, prog)
  if (next) {
    const st = stateOf(sky, prog, next.id)
    const rec = recOf(prog, next.id)
    if (st === 'ready_for_eval') {
      items.push({ kind: 'evaluate', starId: next.id, label: next.name, sub: 'all criteria met — final honest look', min: 5 })
    } else if (st === 'in_progress') {
      const crit = nextCriterion(next, rec)
      const idx = next.criteria.indexOf(crit)
      items.push({
        kind: 'drill', starId: next.id, label: `${next.name} — drill ${idx + 1}`,
        sub: `${crit ? crit.text : ''} · criterion ${idx + 1} of ${next.criteria.length}`,
        min: 15,
      })
    } else {
      items.push({ kind: 'start', starId: next.id, label: next.name, sub: `new star · ${next.est}`, min: 15 })
    }
  }
  return items
}

// Songs -----------------------------------------------------------------

export function songMissing(sky, prog, song) {
  return song.requiredStarIds.filter((id) => stateOf(sky, prog, id) !== 'completed')
}

export function songDistance(sky, prog, song) {
  return songMissing(sky, prog, song).length
}

export function songsUnlockedBy(sky, starId) {
  return sky.songs.filter((song) => song.requiredStarIds.includes(starId))
}

// Stars that a completed `starId` helps unlock (it appears in their prereqs).
export function starsUnlockedBy(sky, starId) {
  return sky.stars.filter((s) => s.prereqIds.includes(starId))
}

// After igniting starId: stars that are now available because of it.
export function newlyAvailable(sky, prog, starId) {
  return starsUnlockedBy(sky, starId).filter((s) => stateOf(sky, prog, s.id) === 'available')
}

// Songs that include starId and are still not playable (they "moved closer").
export function songsMovedCloser(sky, prog, starId) {
  return songsUnlockedBy(sky, starId).filter((song) => songDistance(sky, prog, song) > 0)
}

// The topological path of not-yet-completed stars leading to a locked star.
export function pathTo(sky, prog, starId) {
  const seen = new Set()
  const orderOut = []
  const visit = (id) => {
    if (seen.has(id)) return
    seen.add(id)
    const star = sky.stars.find((s) => s.id === id)
    if (!star) return
    for (const p of star.prereqIds) visit(p)
    if (stateOf(sky, prog, id) !== 'completed') orderOut.push(star)
  }
  visit(starId)
  return orderOut.filter((s) => s.id !== starId)
}

// Closure of a set of star ids plus all their prerequisites (for onboarding
// pre-ignition — lighting a star implies its foundations are lit too).
export function withPrereqClosure(sky, ids) {
  const out = new Set()
  const visit = (id) => {
    if (out.has(id)) return
    out.add(id)
    const star = sky.stars.find((s) => s.id === id)
    if (star) star.prereqIds.forEach(visit)
  }
  ids.forEach(visit)
  return [...out]
}

// Streak ----------------------------------------------------------------

export function dateKey(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function daysBetweenDates(aTs, bTs) {
  const a = new Date(aTs); a.setHours(0, 0, 0, 0)
  const b = new Date(bTs); b.setHours(0, 0, 0, 0)
  return Math.round((b - a) / DAY)
}

// Missing one day pauses the streak; missing 2+ resets it.
export function bumpStreak(streak, now = Date.now()) {
  if (!streak.last) return { count: 1, last: now }
  const gap = daysBetweenDates(streak.last, now)
  if (gap === 0) return { ...streak, last: now }
  if (gap <= 2) return { count: streak.count + 1, last: now }
  return { count: 1, last: now }
}

export function streakStatus(streak, now = Date.now()) {
  if (!streak.last) return 'none'
  const gap = daysBetweenDates(streak.last, now)
  if (gap <= 1) return 'active'
  if (gap === 2) return 'paused'
  return 'broken'
}

export function greeting(now = new Date()) {
  const h = now.getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
