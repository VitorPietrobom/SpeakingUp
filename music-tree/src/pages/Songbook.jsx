// Songbook (4a): songs sorted by star-distance, not alphabet. Filter chips,
// grouped sections, dashed add-a-song row (manual entry + tagging existing stars).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TabBar from '../components/TabBar.jsx'
import Sheet from '../components/Sheet.jsx'
import { songDistance, songMissing } from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

function AddSongSheet({ sky, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [starIds, setStarIds] = useState([])
  return (
    <Sheet onClose={onClose}>
      <div className="overline">ADD A SONG</div>
      <div className="display" style={{ fontSize: 22 }}>What do you dream of playing?</div>
      <input
        className="addsong-input"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="addsong-input"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <div className="overline" style={{ fontSize: 10 }}>WHICH STARS DOES IT ASK OF YOU?</div>
      <div className="addsong-stars">
        {sky.stars.map((s) => {
          const sel = starIds.includes(s.id)
          return (
            <button
              key={s.id}
              className={`chip${sel ? ' chip--cyan' : ''}`}
              onClick={() => setStarIds((cur) => (sel ? cur.filter((id) => id !== s.id) : [...cur, s.id]))}
            >
              {s.name}
            </button>
          )
        })}
      </div>
      <button
        className="cta cta--gold"
        disabled={!title.trim() || starIds.length === 0}
        onClick={() => onAdd({ title: title.trim(), artist: artist.trim() || '—', starIds })}
      >
        Chart the path to it
      </button>
    </Sheet>
  )
}

export default function Songbook() {
  const { state, dispatch, sky, prog } = useSky()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('proximity')
  const [adding, setAdding] = useState(false)

  const customSongs = state.skies[sky.id]?.customSongs
  const allSongs = useMemo(() => [...sky.songs, ...(customSongs || [])], [sky, customSongs])

  const withDist = allSongs
    .map((song) => ({ song, dist: songDistance(sky, prog, song) }))
    .sort((a, b) => a.dist - b.dist)

  const playable = withDist.filter((x) => x.dist === 0)
  const oneAway = withDist.filter((x) => x.dist === 1)
  const further = withDist.filter((x) => x.dist >= 2)

  const shown = filter === 'playable' ? { playable, oneAway: [], further: [] }
    : filter === 'wishlist' ? { playable: [], oneAway: [], further: withDist.filter((x) => x.song.custom) }
    : { playable, oneAway, further }

  const missingName = (song) => {
    const miss = songMissing(sky, prog, song)
    const star = sky.stars.find((s) => s.id === miss[0])
    return star?.name || '—'
  }

  const viaName = (song) => {
    const miss = songMissing(sky, prog, song)
    const last = sky.stars.find((s) => s.id === miss[miss.length - 1])
    return last?.name || '—'
  }

  return (
    <div className="screen screen--tabs screen--songs starfield">
      <header className="pad songbook-head">
        <div className="display" style={{ fontSize: 26 }}>Songbook</div>
        <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--sub)' }}>
          {sky.name.split(' ')[0].toUpperCase()} · {allSongs.length} {sky.songNoun.toUpperCase()}
        </div>
      </header>

      <div className="pad" style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {[['proximity', 'By proximity'], ['playable', 'Playable now'], ['wishlist', 'Wishlist']].map(([id, label]) => (
          <button key={id} className={`chip${filter === id ? ' chip--pink' : ''}`} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      {shown.playable.length > 0 && (
        <section className="songbook-group pad">
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--gold)' }}>
            PLAYABLE NOW · {shown.playable.length}
          </div>
          {shown.playable.map(({ song }) => (
            <button key={song.id} className="row row--r14 row--gold" onClick={() => navigate(`/song/${song.id}`)}>
              <span className="song-thumb song-thumb--gold">♪</span>
              <span className="row-body">
                <span className="row-title" style={{ fontSize: 13.5 }}>{song.title}</span>
                <span className="row-sub">{song.artist} · {song.meta}</span>
              </span>
              <span style={{ fontSize: 11, color: 'var(--gold-dim)' }}>✦ all lit</span>
            </button>
          ))}
        </section>
      )}

      {shown.oneAway.length > 0 && (
        <section className="songbook-group pad">
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--cyan)' }}>
            ONE STAR AWAY · {shown.oneAway.length}
          </div>
          {shown.oneAway.map(({ song }) => (
            <button key={song.id} className="row row--r14 row--cyan" onClick={() => navigate(`/song/${song.id}`)}>
              <span className="song-thumb song-thumb--cyan">✦</span>
              <span className="row-body">
                <span className="row-title" style={{ fontSize: 13.5 }}>{song.title}</span>
                <span className="row-sub">
                  {song.artist} · needs <span style={{ color: 'var(--cyan)' }}>{missingName(song)}</span>
                  {song.estNote ? ` · ${song.estNote}` : ''}
                </span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>Path ›</span>
            </button>
          ))}
        </section>
      )}

      {shown.further.length > 0 && (
        <section className="songbook-group pad">
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--muted)' }}>FURTHER OUT</div>
          {shown.further.map(({ song, dist }) => (
            <button key={song.id} className="row row--r14 row--dim" style={{ opacity: 0.75 }} onClick={() => navigate(`/song/${song.id}`)}>
              <span className="song-thumb">♪</span>
              <span className="row-body">
                <span className="row-title" style={{ fontSize: 13.5, color: 'var(--sub)' }}>{song.title}</span>
                <span className="row-sub" style={{ color: 'var(--muted)' }}>
                  {song.artist} · {dist} stars away · via {viaName(song)}
                </span>
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{song.estNote || ''}</span>
            </button>
          ))}
        </section>
      )}

      <div className="pad" style={{ marginTop: 20 }}>
        <button className="row row--dashed" onClick={() => setAdding(true)}>
          <span style={{ fontSize: 16 }}>+</span>
          <span style={{ fontSize: 12.5 }}>Add a song you dream of playing — we’ll chart the path.</span>
        </button>
      </div>

      {adding && (
        <AddSongSheet
          sky={sky}
          onClose={() => setAdding(false)}
          onAdd={(song) => {
            dispatch({
              type: 'addSong',
              song: {
                id: `custom-${Date.now()}`,
                title: song.title,
                artist: song.artist,
                meta: 'your pick',
                requiredStarIds: song.starIds,
                custom: true,
              },
            })
            setAdding(false)
          }}
        />
      )}
      <TabBar />
    </div>
  )
}
