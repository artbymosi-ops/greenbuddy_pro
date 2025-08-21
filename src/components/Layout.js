import Head from "next/head";
import Header from "@/components/Header";

export default function Layout({ title, children }) {
  const page = title ? `${title} • Greenbuddy` : "Greenbuddy";
  return (
    <>
      <Head>
        <title>{page}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* prémiové fonty */}
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,700&display=swap" rel="stylesheet"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container page">{children}</main>
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} Greenbuddy</div>
      </footer>
    </>
  );
    }
