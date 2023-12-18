import {useTranslation} from 'react-i18next';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const NavBar = ({setPage, token}) => {
  const {t} = useTranslation();
  return (
    <Tabs>
      <Tab
        variant='secondary'
        onClick={() => setPage('authors')}
        title={t('nav-Authors')}
      ></Tab>
      {'  '}
      <Tab
        variant='secondary'
        onClick={() => setPage('books')}
        title={t('nav-Books')}
      ></Tab>
      {'  '}
      {token && (
        <Tab
          variant='secondary'
          onClick={() => setPage('add')}
          title={t('nav-Add-Books')}
        ></Tab>
      )}
      {token && (
        <Tab
          variant='secondary'
          onClick={() => setPage('recommendations')}
          title={t('nav-Recom')}
        ></Tab>
      )}
    </Tabs>
  );
};

export default NavBar;
