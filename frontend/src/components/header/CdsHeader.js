import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';


import { Login, Logout } from 'components/auth';
import darkTheme from 'styles/theme';

const CdsHeader = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <ThemeProvider theme={darkTheme}>
      <header className="cds-header">
        <div className="cds-header__cdsbanner">
          <div className="cds-header__cdsbanner-wrapper">
            <div className="cds-header__cdsbanner-text">
              <a href="/" alt="home">
                <div className="text-top">Patient-centered Outcomes Research</div>
                <div className="text-bottom">Drug-Drug Interaction Clinical Decision Support Authoring</div>
              </a>
            </div>

            <div className="cds-header__cdsbanner-auth">

              {isAuthenticated ? <Logout /> : <Login />}
            </div>
          </div>
        </div>
      </header>
    </ThemeProvider>
  );
};

export default CdsHeader;
