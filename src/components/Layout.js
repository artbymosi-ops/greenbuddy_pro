// src/components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="wrap">
      <header className="header">
        <div className="brand">
          <Link href="/">Greenbuddy</Link>
        </div>

        {/* Navigácia v hlavičke */}
        <nav className="nav">
          <Link href="/plants">Pflanzen</Link>
          <Link href="/calendar">Kalender</Link>
          <Link href="/diary">Tagebuch</Link>
          <Link href="/forum">Forum</Link>
          <Link href="/chat">AI-Chat</Link>
        </nav>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        © {new Date().getFullYear()} Greenbuddy
      </footer>
    </div>
  );
}
