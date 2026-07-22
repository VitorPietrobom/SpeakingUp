// Seed content for Music Tree. Real graphs are data-driven — the layouts here
// echo the handoff mockups but any star/constellation/song shape works.
// Positions are in each sky's 390x520 world space (SkyGraph pans/zooms it).
// V1 seeds acoustic + drums; electric/banjo appear in onboarding as "soon".

const acoustic = {
  id: 'acoustic',
  name: 'Acoustic Guitar',
  numeral: 'SKY I',
  songNoun: 'songs',
  size: { w: 390, h: 520 },
  constellations: [
    { id: 'chords', name: 'CHORDS', x: 46, y: 492 },
    { id: 'rhythm', name: 'RHYTHM', x: 266, y: 492 },
    { id: 'scales', name: 'SCALES', x: 62, y: 300 },
    { id: 'fingerstyle', name: 'FINGERSTYLE', x: 258, y: 324 },
    { id: 'improvisation', name: 'IMPROVISATION', x: 148, y: 142 },
  ],
  stars: [
    {
      id: 'first-strums', name: 'First Strums', constellation: 'chords', order: 0,
      x: 48, y: 430, prereqIds: [],
      blurb: 'Basic down-strums in time. The first light in your sky.',
      difficulty: 1, est: '~3 days', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Strum open strings on a steady count of 4', required: true },
        { id: 'c2', text: 'Four bars of down-strums with no stops', required: true, target: 4, bpm: 60 },
      ],
      resources: [
        { type: 'youtube', title: 'Your very first strums', meta: 'YouTube · 6 min' },
      ],
    },
    {
      id: 'open-chords', name: 'Open Chords', constellation: 'chords', order: 1,
      x: 92, y: 462, prereqIds: ['first-strums'],
      blurb: 'G · C · D · Em · Am ringing clean.',
      difficulty: 2, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Play G · C · D · Em · Am — each rings clean', required: true },
        { id: 'c2', text: 'Ten G→C→D changes, no pauses, 70 BPM', required: true, target: 10, bpm: 70 },
      ],
      resources: [
        { type: 'youtube', title: 'The five open chords that matter', meta: 'YouTube · 9 min' },
        { type: 'pdf', title: 'Open chord shape sheet', meta: '1 page' },
      ],
    },
    {
      id: 'strumming-a', name: 'Strumming Pattern A', constellation: 'rhythm', order: 2,
      x: 262, y: 452, prereqIds: ['first-strums'],
      blurb: 'Down, down-up, up-down-up — the pattern behind half the songbook.',
      difficulty: 2, est: '~4 days', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Count the pattern out loud while strumming muted strings', required: true },
        { id: 'c2', text: 'Eight bars at 70 BPM without losing the pattern', required: true, target: 8, bpm: 70 },
      ],
      resources: [
        { type: 'youtube', title: 'The only strumming pattern you need first', meta: 'YouTube · 7 min' },
      ],
    },
    {
      id: 'chord-changes', name: 'Chord Changes', constellation: 'chords', order: 3,
      x: 134, y: 424, prereqIds: ['open-chords'],
      blurb: 'G→C→D twenty times, no pauses.',
      difficulty: 2, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'One-minute changes: G→C, count your score', required: true },
        { id: 'c2', text: 'G→C→D twenty times, no pauses', required: true, target: 20, bpm: 60 },
      ],
      resources: [
        { type: 'youtube', title: 'One-minute changes, explained', meta: 'YouTube · 8 min' },
      ],
    },
    {
      id: 'finger-strength', name: 'Finger Strength', constellation: 'chords', order: 4,
      x: 106, y: 382, prereqIds: ['first-strums'],
      blurb: 'Spider drills and fretting stamina for what comes next.',
      difficulty: 2, est: '~5 days', daily: '5 min / day',
      criteria: [
        { id: 'c1', text: 'Spider drill across four frets, both directions', required: true },
        { id: 'c2', text: 'Hold any fretted note 20s with a clean tone', required: true },
      ],
      resources: [],
    },
    {
      id: 'steady-eighths', name: 'Steady Eighths', constellation: 'rhythm', order: 5,
      x: 304, y: 424, prereqIds: ['strumming-a'],
      blurb: 'Locked-in eighth notes with a relaxed wrist.',
      difficulty: 2, est: '~4 days', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Sixteen bars of eighths with the metronome, no drift', required: true, target: 16, bpm: 80 },
      ],
      resources: [
        { type: 'youtube', title: 'Wrist, not elbow — eighth note feel', meta: 'YouTube · 5 min' },
      ],
    },
    {
      id: 'barre-chords', name: 'Barre Chords', constellation: 'chords', order: 6,
      x: 170, y: 392, prereqIds: ['chord-changes', 'finger-strength'],
      blurb: 'One finger, six strings. The star that opens the whole fretboard — every key, every position.',
      difficulty: 3, est: '~2 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'Hold F major 30s, all strings ringing', required: true },
        { id: 'c2', text: 'Bm and F♯m from the A shape', required: true },
        { id: 'c3', text: 'Switch C → F twenty times, clean, at 60 BPM', required: true, target: 20, bpm: 60 },
        { id: 'c4', text: 'Record one clean pass of the drill', required: false, recording: true },
      ],
      resources: [
        {
          type: 'youtube', title: 'The F chord, minus the pain', meta: 'YouTube · Justin · 12 min',
          chapters: [
            { at: '0:00', label: 'Why it hurts' },
            { at: '4:32', label: 'The roll trick' },
            { at: '8:10', label: 'The drill' },
          ],
        },
        { type: 'pdf', title: 'Shape chart — E & A forms', meta: '2 pages' },
        { type: 'note', title: 'My note: roll the index finger', meta: 'Personal note' },
      ],
    },
    {
      id: 'syncopation', name: 'Syncopation', constellation: 'rhythm', order: 7,
      x: 286, y: 386, prereqIds: ['steady-eighths'],
      blurb: 'Missing the beat on purpose — accents that make strumming breathe.',
      difficulty: 3, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Play the off-beat accent pattern over four chords', required: true },
        { id: 'c2', text: 'Eight bars syncopated at 80 BPM, steady', required: true, target: 8, bpm: 80 },
      ],
      resources: [
        { type: 'youtube', title: 'Syncopation for strummers', meta: 'YouTube · 10 min' },
      ],
    },
    {
      id: 'six-eight', name: '6/8 Strumming', constellation: 'rhythm', order: 8,
      x: 338, y: 462, prereqIds: ['steady-eighths'],
      blurb: 'The waltz-adjacent pulse behind Hallelujah and a hundred ballads.',
      difficulty: 3, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Count and strum 6/8 over one chord, 60 BPM', required: true, target: 8, bpm: 60 },
        { id: 'c2', text: 'Move it through a G–Em–C–D progression', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'Feel 6/8 in your elbow', meta: 'YouTube · 6 min' },
      ],
    },
    {
      id: 'capo-usage', name: 'Capo Usage', constellation: 'chords', order: 9,
      x: 210, y: 350, prereqIds: ['barre-chords'],
      blurb: 'Change keys without changing shapes — the shortcut the pros use shamelessly.',
      difficulty: 1, est: '~3 days', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Place the capo cleanly — no buzz on any string', required: true },
        { id: 'c2', text: 'Transpose a G-shape song to two other keys', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'Capo logic in 5 minutes', meta: 'YouTube · 5 min' },
      ],
    },
    {
      id: 'power-chords', name: 'Power Chords', constellation: 'chords', order: 10,
      x: 140, y: 338, prereqIds: ['barre-chords'],
      blurb: 'Two fingers, all the attitude.',
      difficulty: 2, est: '~4 days', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Root-5 shapes on E and A strings, muted cleanly', required: true },
        { id: 'c2', text: 'Eight-bar riff with shifts, 80 BPM', required: true, target: 8, bpm: 80 },
      ],
      resources: [],
    },
    {
      id: 'major-scale', name: 'Major Scale Positions', constellation: 'scales', order: 11,
      x: 66, y: 272, prereqIds: ['chord-changes'],
      blurb: 'The streetlight grid you improvise under.',
      difficulty: 2, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'One octave in open position, naming each note aloud', required: true },
        { id: 'c2', text: 'Ascend and descend without looking at your hand', required: true },
        { id: 'c3', text: 'Quarter notes at 60 BPM, one octave, no mistakes', required: true, target: 8, bpm: 60 },
      ],
      resources: [
        {
          type: 'article', title: 'Why the major scale is a map, not a drill', meta: 'Article · 6 min read',
          article: {
            overline: 'SCALES · THEORY',
            blocks: [
              { type: 'p', text: 'Every melody you have ever hummed lives somewhere on the major scale. Before your fingers learn the pattern, your ears already know it — which is why this star ignites faster than you expect.' },
              { type: 'quote', text: 'The scale is not the destination. It is the streetlight grid you improvise under.' },
              { type: 'p', text: 'Start with one octave in open position. Say the note names out loud as you play — slowly. Speed is criterion three; naming is criterion one.' },
              { type: 'diagram', title: 'ONE OCTAVE · OPEN POSITION', cells: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], caption: 'whole · whole · half · whole · whole · whole · half' },
              { type: 'p', text: 'Once the shape is under your fingers, the metronome enters. 60 BPM, quarter notes, no mistakes — ', highlight: 'that exact bar is this star’s ignition criterion', after: ', so everything you read here points at it.' },
            ],
          },
        },
        { type: 'youtube', title: 'Open position major scale, slowly', meta: 'YouTube · 8 min' },
      ],
    },
    {
      id: 'thumb-independence', name: 'Thumb Independence', constellation: 'fingerstyle', order: 12,
      x: 266, y: 296, prereqIds: ['open-chords'],
      blurb: 'Thumb keeps the pulse, fingers carry the melody.',
      difficulty: 3, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Alternating thumb bass over a held chord, 8 bars', required: true, target: 8, bpm: 60 },
        { id: 'c2', text: 'Add index-finger melody notes on top without losing the bass', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'Train your thumb to be a drummer', meta: 'YouTube · 11 min' },
      ],
    },
    {
      id: 'rhythm-2', name: 'Rhythm II', constellation: 'rhythm', order: 13,
      x: 330, y: 352, prereqIds: ['syncopation', 'capo-usage'],
      blurb: 'Dynamics, muting and pushes — rhythm that sounds like a record.',
      difficulty: 3, est: '~2 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'Palm-muted verse into open chorus, clean switch', required: true },
        { id: 'c2', text: 'Sixteen bars with accents and pushes at 90 BPM', required: true, target: 16, bpm: 90 },
      ],
      resources: [
        { type: 'youtube', title: 'Make one chord sound like a band', meta: 'YouTube · 13 min' },
      ],
    },
    {
      id: 'note-naming', name: 'Note Naming', constellation: 'scales', order: 14,
      x: 112, y: 244, prereqIds: ['major-scale'],
      blurb: 'Find any note on the neck inside three seconds.',
      difficulty: 2, est: '~1 week', daily: '5 min / day',
      criteria: [
        { id: 'c1', text: 'Name every note on the low E and A strings', required: true },
        { id: 'c2', text: 'Random-note drill: 10 notes in 30 seconds', required: true, target: 10 },
      ],
      resources: [],
    },
    {
      id: 'travis-picking', name: 'Travis Picking Basics', constellation: 'fingerstyle', order: 15,
      x: 312, y: 268, prereqIds: ['thumb-independence'],
      blurb: 'The rolling engine under Dust in the Wind.',
      difficulty: 4, est: '~2 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'The core roll on C, 8 bars steady', required: true, target: 8, bpm: 60 },
        { id: 'c2', text: 'Move the roll through C–Am–F–G', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'Travis picking from zero', meta: 'YouTube · 14 min' },
      ],
    },
    {
      id: 'scale-speed', name: 'Scale Speed', constellation: 'scales', order: 16,
      x: 156, y: 216, prereqIds: ['note-naming'],
      blurb: 'Clean first, fast second — earn each metronome notch.',
      difficulty: 3, est: '~2 weeks', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'One octave in eighths at 90 BPM, no mistakes', required: true, target: 8, bpm: 90 },
        { id: 'c2', text: 'Two octaves at 70 BPM, position shift included', required: true, target: 8, bpm: 70 },
      ],
      resources: [],
    },
    {
      id: 'pentatonic', name: 'Pentatonic Boxes', constellation: 'scales', order: 17,
      x: 94, y: 196, prereqIds: ['note-naming'],
      blurb: 'Five notes that always sound right.',
      difficulty: 3, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Box 1 ascending and descending, clean at 70 BPM', required: true, target: 8, bpm: 70 },
        { id: 'c2', text: 'Connect box 1 to box 2 without stopping', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'The box that unlocks solos', meta: 'YouTube · 9 min' },
      ],
    },
    {
      id: 'fingerstyle-1', name: 'Fingerstyle I', constellation: 'fingerstyle', order: 18,
      x: 294, y: 220, prereqIds: ['travis-picking'],
      blurb: 'Thumb keeps the pulse, fingers carry the melody. Melody, bass and harmony from one guitar.',
      difficulty: 4, est: '~3 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'Play a full fingerstyle arrangement of a simple melody', required: true },
        { id: 'c2', text: 'Keep bass steady while the melody syncopates, 8 bars', required: true, target: 8, bpm: 60 },
      ],
      resources: [
        { type: 'youtube', title: 'Your first real fingerstyle piece', meta: 'YouTube · 16 min' },
      ],
    },
    {
      id: 'harmonics', name: 'Natural Harmonics', constellation: 'fingerstyle', order: 19,
      x: 348, y: 238, prereqIds: ['fingerstyle-1'],
      blurb: 'Bell tones hiding above the 12th fret.',
      difficulty: 2, est: '~3 days', daily: '5 min / day',
      criteria: [
        { id: 'c1', text: 'Clear harmonics at frets 12, 7 and 5 on every string', required: true },
      ],
      resources: [],
    },
    {
      id: 'phrasing', name: 'Phrasing', constellation: 'improvisation', order: 20,
      x: 152, y: 86, prereqIds: ['pentatonic'],
      blurb: 'Say something — then stop. Solos are sentences.',
      difficulty: 4, est: '~2 weeks', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Four-bar phrases with deliberate space between them', required: true },
        { id: 'c2', text: 'End three phrases on the root, three on the third', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'Phrasing: talk, don’t type', meta: 'YouTube · 12 min' },
      ],
    },
    {
      id: 'improv-1', name: 'Improvisation I', constellation: 'improvisation', order: 21,
      x: 200, y: 56, prereqIds: ['phrasing'],
      blurb: 'The zenith of this sky: real-time melody over a backing track.',
      difficulty: 5, est: '~4 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'Solo over a 12-bar backing track without stopping', required: true },
        { id: 'c2', text: 'Quote the song’s melody once inside your solo', required: true },
      ],
      resources: [],
    },
    {
      id: 'call-response', name: 'Call & Response', constellation: 'improvisation', order: 22,
      x: 248, y: 92, prereqIds: ['phrasing'],
      blurb: 'Answer your own musical questions.',
      difficulty: 4, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Play a two-bar call and a two-bar answer, 8 rounds', required: true, target: 8 },
      ],
      resources: [],
    },
  ],
  songs: [
    {
      id: 'horse-no-name', title: 'Horse with No Name', artist: 'America',
      meta: '2 chords', requiredStarIds: ['open-chords'], estNote: '~2 days',
    },
    {
      id: 'knockin', title: 'Knockin’ on Heaven’s Door', artist: 'Dylan',
      meta: 'G C D Am', requiredStarIds: ['open-chords', 'chord-changes'], estNote: '~4 days',
    },
    {
      id: 'stand-by-me', title: 'Stand by Me', artist: 'Ben E. King',
      meta: 'G Em C D', requiredStarIds: ['open-chords', 'strumming-a'], estNote: '~4 days',
    },
    {
      id: 'wonderwall', title: 'Wonderwall', artist: 'Oasis',
      meta: 'Capo 2 · 87 BPM', requiredStarIds: ['open-chords', 'strumming-a', 'capo-usage', 'rhythm-2'],
      estNote: '~3 weeks at your pace', x: 330, y: 160,
    },
    {
      id: 'hallelujah', title: 'Hallelujah', artist: 'Cohen',
      meta: '6/8 · C G Am F', requiredStarIds: ['open-chords', 'six-eight'], estNote: '~1 week', x: 356, y: 330,
    },
    {
      id: 'free-fallin', title: 'Free Fallin’', artist: 'Tom Petty',
      meta: 'Capo 3', requiredStarIds: ['open-chords', 'strumming-a', 'capo-usage'], estNote: '~1 week',
    },
    {
      id: 'wish-you-were-here', title: 'Wish You Were Here', artist: 'Pink Floyd',
      meta: 'G Em7 A7sus4', requiredStarIds: ['open-chords', 'strumming-a', 'major-scale'], estNote: '~2 weeks',
    },
    {
      id: 'blackbird', title: 'Blackbird', artist: 'Beatles',
      meta: 'fingerstyle', requiredStarIds: ['chord-changes', 'fingerstyle-1'], estNote: '~5 wks', x: 60, y: 140,
    },
    {
      id: 'dust-wind', title: 'Dust in the Wind', artist: 'Kansas',
      meta: 'Travis picking', requiredStarIds: ['open-chords', 'travis-picking', 'fingerstyle-1'], estNote: '~7 wks',
    },
    {
      id: 'house-rising-sun', title: 'House of the Rising Sun', artist: 'The Animals',
      meta: '6/8 arpeggios', requiredStarIds: ['open-chords', 'six-eight', 'thumb-independence'], estNote: '~2 weeks',
    },
  ],
}

const drums = {
  id: 'drums',
  name: 'Drums',
  numeral: 'SKY II',
  songNoun: 'grooves',
  size: { w: 390, h: 520 },
  constellations: [
    { id: 'foundation', name: 'FOUNDATION', x: 60, y: 470 },
    { id: 'rudiments', name: 'RUDIMENTS', x: 240, y: 470 },
    { id: 'grooves', name: 'GROOVES', x: 90, y: 320 },
  ],
  stars: [
    {
      id: 'stick-grip', name: 'Stick Grip & Rebound', constellation: 'foundation', order: 0,
      x: 90, y: 430, prereqIds: [],
      blurb: 'Let the stick do half the work.',
      difficulty: 1, est: '~2 days', daily: '5 min / day',
      criteria: [
        { id: 'c1', text: 'Matched grip with a relaxed fulcrum, both hands', required: true },
        { id: 'c2', text: 'Free bounces: 8 even rebounds per hand', required: true, target: 8 },
      ],
      resources: [
        { type: 'youtube', title: 'Grip: the 80% of drumming nobody teaches', meta: 'YouTube · 7 min' },
      ],
    },
    {
      id: 'basic-beat', name: 'Basic Rock Beat', constellation: 'foundation', order: 1,
      x: 150, y: 390, prereqIds: ['stick-grip'],
      blurb: 'Kick, snare, hats — the sentence every song speaks.',
      difficulty: 1, est: '~4 days', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Eight bars of the money beat at 70 BPM', required: true, target: 8, bpm: 70 },
        { id: 'c2', text: 'Keep it steady while counting out loud', required: true },
      ],
      resources: [
        { type: 'youtube', title: 'The money beat', meta: 'YouTube · 6 min' },
      ],
    },
    {
      id: 'single-stroke', name: 'Single Stroke Roll', constellation: 'rudiments', order: 2,
      x: 250, y: 430, prereqIds: ['stick-grip'],
      blurb: 'R L R L — even, relaxed, forever.',
      difficulty: 2, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Sixteen clean singles at 80 BPM, even volume', required: true, target: 16, bpm: 80 },
      ],
      resources: [],
    },
    {
      id: 'double-stroke', name: 'Double Stroke Roll', constellation: 'rudiments', order: 3,
      x: 300, y: 390, prereqIds: ['single-stroke'],
      blurb: 'Two per hand, powered by rebound.',
      difficulty: 3, est: '~2 weeks', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'RRLL at 70 BPM, second note as loud as the first', required: true, target: 16, bpm: 70 },
      ],
      resources: [],
    },
    {
      id: 'paradiddle', name: 'Paradiddle', constellation: 'rudiments', order: 4,
      x: 330, y: 330, prereqIds: ['double-stroke'],
      blurb: 'RLRR LRLL — the rudiment that becomes fills.',
      difficulty: 3, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Eight bars of paradiddles at 70 BPM with accents', required: true, target: 8, bpm: 70 },
      ],
      resources: [
        { type: 'youtube', title: 'Paradiddles that groove', meta: 'YouTube · 8 min' },
      ],
    },
    {
      id: 'eighth-groove', name: 'Eighth-Note Grooves', constellation: 'grooves', order: 5,
      x: 140, y: 290, prereqIds: ['basic-beat', 'single-stroke'],
      blurb: 'Variations on the money beat — kick patterns that follow the bass.',
      difficulty: 2, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Four kick variations, 8 bars each, 80 BPM', required: true, target: 8, bpm: 80 },
      ],
      resources: [
        { type: 'youtube', title: 'Five grooves, one beat', meta: 'YouTube · 9 min' },
      ],
    },
    {
      id: 'hi-hat-work', name: 'Hi-Hat Work', constellation: 'grooves', order: 6,
      x: 90, y: 230, prereqIds: ['eighth-groove'],
      blurb: 'Open, closed, barked — the hat is your vocabulary.',
      difficulty: 3, est: '~1 week', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'Open-hat accents on the "and" of 4, 8 bars', required: true, target: 8, bpm: 80 },
      ],
      resources: [],
    },
    {
      id: 'sixteenth-groove', name: 'Sixteenth Grooves', constellation: 'grooves', order: 7,
      x: 190, y: 230, prereqIds: ['eighth-groove'],
      blurb: 'Double-time hands, half-time feel.',
      difficulty: 3, est: '~2 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'Sixteenth hats one-handed at 70 BPM, 8 bars', required: true, target: 8, bpm: 70 },
      ],
      resources: [],
    },
    {
      id: 'shuffle', name: 'The Shuffle', constellation: 'grooves', order: 8,
      x: 250, y: 250, prereqIds: ['eighth-groove'],
      blurb: 'Triplet swing — the feel you can’t fake.',
      difficulty: 4, est: '~2 weeks', daily: '15 min / day',
      criteria: [
        { id: 'c1', text: 'Basic shuffle at 80 BPM, 8 bars, ghost notes soft', required: true, target: 8, bpm: 80 },
      ],
      resources: [],
    },
    {
      id: 'fills-1', name: 'Fills I', constellation: 'grooves', order: 9,
      x: 300, y: 190, prereqIds: ['paradiddle', 'eighth-groove'],
      blurb: 'Get around the kit and land on 1.',
      difficulty: 3, est: '~2 weeks', daily: '10 min / day',
      criteria: [
        { id: 'c1', text: 'One-bar fill into the groove, landing on 1, 8 times', required: true, target: 8, bpm: 80 },
      ],
      resources: [],
    },
  ],
  songs: [
    {
      id: 'billie-jean', title: 'Billie Jean groove', artist: 'Michael Jackson',
      meta: '117 BPM', requiredStarIds: ['eighth-groove', 'hi-hat-work'], estNote: '~1 week',
    },
    {
      id: 'back-in-black', title: 'Back in Black', artist: 'AC/DC',
      meta: '94 BPM', requiredStarIds: ['eighth-groove', 'hi-hat-work'], estNote: '~1 week', x: 60, y: 150,
    },
    {
      id: 'come-together', title: 'Come Together', artist: 'Beatles',
      meta: 'tom groove', requiredStarIds: ['eighth-groove', 'sixteenth-groove'], estNote: '~2 weeks',
    },
    {
      id: 'rosanna', title: 'Rosanna shuffle', artist: 'Toto',
      meta: 'half-time shuffle', requiredStarIds: ['shuffle', 'fills-1'], estNote: '~4 wks', x: 330, y: 120,
    },
  ],
}

// Skies shown in onboarding but not seeded with content yet (schema supports them).
export const comingSoon = [
  { id: 'electric', name: 'Electric', starCount: 64, songCount: 41, songNoun: 'songs' },
  { id: 'banjo', name: 'Banjo', starCount: 39, songCount: 22, songNoun: 'songs' },
]

export const skies = [acoustic, drums]

export const skiesById = Object.fromEntries(skies.map((s) => [s.id, s]))

export function starsById(sky) {
  return Object.fromEntries(sky.stars.map((s) => [s.id, s]))
}
