import './Footer.css'

export default function Footer() {
  return (
    <footer className="su-footer">
      <div className="su-wrap su-footer-bar">
        <span className="su-footer-logo">
          Speaking<span className="su-footer-accent"> UP</span>
        </span>
        <span className="su-footer-contact">speakingup.communication@gmail.com · © {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
