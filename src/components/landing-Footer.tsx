import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container f-grid">
        <div className="f-col">
          <div className="f-title">Prodotto</div>
          <Link href="#funzioni">Funzioni</Link>
          <Link href="#come-funziona">Come funziona</Link>
          <Link href="#prezzi">Prezzi</Link>
        </div>
        <div className="f-col">
          <div className="f-title">Risorse</div>
          <Link href="#">Blog</Link>
          <Link href="#">Linee guida</Link>
          <Link href="#">Supporto</Link>
        </div>
        <div className="f-col">
          <div className="f-title">Legale</div>
          <Link href="#">Privacy</Link>
          <Link href="#">Termini</Link>
          <Link href="#">Disclaimer</Link>
        </div>
        <div className="f-col">
          <div className="f-title">Contatti</div>
          <a href="mailto:hello@nutriwell.ai">hello@nutriwell.ai</a>
          <Link href="#">@nutriwell</Link>
        </div>
      </div>
      <div className="container fineprint">
        Non sostituisce un consulto medico. In caso di condizioni specifiche, rivolgiti al tuo medico.
      </div>
      
      {/* University Spinoff Section */}
      <div className="container university-section">
        <div className="university-content">
          <span>Sviluppato da  </span>
            <img 
            src="/images/yukai.svg" 
            alt="Logo yukai" 
            className="yukai-logo"
          />
          <span>Azienda </span>
          <img 
            src="/images/logo-spinoff.png" 
            alt="Logo spinoff" 
            className="spinoff-logo"
          />
          <span> dell'Università di Siena</span>
        </div>
      </div>
    </footer>
  );
}
