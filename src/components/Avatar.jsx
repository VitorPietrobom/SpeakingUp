import './Avatar.css'

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ photo, name, size }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.32) }
  if (photo) {
    return <img src={photo} alt={name} loading="lazy" className="su-avatar" style={style} />
  }
  return (
    <div className="su-avatar su-avatar-fallback" style={style}>
      {initialsOf(name)}
    </div>
  )
}
