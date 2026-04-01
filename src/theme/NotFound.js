import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useLocation } from '@docusaurus/router';

export default function NotFound() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    history.replace('/');
  }, [history]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '1.2rem',
      color: 'var(--ifm-color-emphasis-600)'
    }}>
      正在跳转到主页...
    </div>
  );
}
