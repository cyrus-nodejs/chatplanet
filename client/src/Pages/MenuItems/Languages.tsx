import { useTranslation } from 'react-i18next';

const Languages = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string | undefined) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-5 flex flex-col">
    <h5 className="text-slate-500">{t('welcome')}</h5>
    <p className='text-slate-500'>{t('hello')}</p>

    <button onClick={() => changeLanguage('es')} className="bg-violet-600 text-white p-2 m-2">
      Español
    </button>
    <button onClick={() => changeLanguage('fr')} className="bg-violet-600 text-white p-2 m-2">
      Français
    </button>
    <button onClick={() => changeLanguage('en')} className="bg-violet-600 text-white p-2 m-2">
      English
    </button>
  </div>
  )
}

export default Languages