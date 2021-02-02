import React from 'react';

export default function AhrqHeader() {
  return (
    <div className="ahrq">
      <div role="main" className="container-fluid js-quickedit-main-content">
        <div className="row">
          <header
            id="primary-header"
            className="header row-side-margins mobile-row-side-margins"
            role="heading"
            aria-level="1"
          >
            <div className="col-md-12">
              <div className="primary-header-wrapper">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                    <div className="logo-ahrq">
                      <a href="https://ddi-cds.org/">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/logo-ddi-cds.png`}
                          alt="DDI-CDS: Drug-Drug Interaction Clinical Decision Support"
                        />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}
