import Header from '../components/Header';
import {useTranslations} from 'next-intl';

const Home = () => {
  const t = useTranslations('home');
  
  return (
    <div>
      <Header />
      <main className="nv-main-container">
        <h2>{t('welcome')}</h2>
        <p>{t('description')}</p>
      </main>
    </div>
  );
};

export default Home;