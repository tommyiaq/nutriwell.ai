import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="nv-footer">
      <div className="nv-container nv-footer-container">
        <div className="nv-footer-content">
          {/* Brand Column */}
          <div className="nv-footer-column nv-footer-brand">
            <h3 className="nv-footer-logo">💚 {t('footer.brand')}</h3>
            <p className="nv-footer-description">{t('footer.description')}</p>
            <div className="nv-social-icons">
              <span className="nv-social-title">
                {t('footer.social.title')}
              </span>
              <div className="nv-social-links">
                <a
                  href="https://linkedin.com/company/nutriwell-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a
                  href="https://facebook.com/nutriwell.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a
                  href="https://instagram.com/nutriwell.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://youtube.com/@nutriwell-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="nv-footer-column">
            <h4 className="nv-footer-title">{t('footer.links.title')}</h4>
            <ul className="nv-footer-links">
              <li>
                <Link href="/">{t('footer.links.home')}</Link>
              </li>
              <li>
                <Link href="/#about">{t('footer.links.about')}</Link>
              </li>
              <li>
                <Link href="/#features">{t('footer.links.features')}</Link>
              </li>
              <li>
                <Link href="/#pricing">{t('footer.links.pricing')}</Link>
              </li>
              <li>
                <Link href="/chat">{t('footer.links.chat')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="nv-footer-column">
            <h4 className="nv-footer-title">{t('footer.contact.title')}</h4>
            <ul className="nv-footer-contact">
              <li>
                <i className="fas fa-envelope"></i>
                <a href={`mailto:${t('footer.contact.email')}`}>
                  {t('footer.contact.email')}
                </a>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <a href={`tel:${t('footer.contact.phone')}`}>
                  {t('footer.contact.phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="nv-footer-bottom">
          <div className="nv-footer-legal">
            <Link href="/privacy">{t('footer.links.privacy')}</Link>
            <Link href="/terms">{t('footer.links.terms')}</Link>
          </div>
          <div className="nv-footer-copyright">{t('footer.copyright')}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
