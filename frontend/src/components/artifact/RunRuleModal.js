import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Modal} from 'components/elements';

import artifactProps from '../../prop-types/artifact';
import StringField from "../builder/fields/StringField";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";

export default class RunRuleModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
// TODO: Create config file to store the default fhir server configuration
      //the "token_type" has a fixed value of "Bearer"
      fhirServer: {
        'fhirServer': 'http://3.21.182.6/omoponfhir-stu3/fhir',
        'accessToken': '12345',
        'scope': 'launch profile openid online_access user/*.*',
        'expiresIn': '300',
        'subject': '',
        'radio': "0"
      }
    };
  }

  handleCheckboxInputChange = (event) => {
    var fhirServer = this.state.fhirServer;
    fhirServer['radio'] = event.target.value;

    this.setState({fhirServer: fhirServer});
  }

  handleInputChange = (input) => {
    var fhirServer = this.state.fhirServer;
    fhirServer[Object.keys(input)[0]] = Object.values(input)[0];

    this.setState({fhirServer: fhirServer});
  }

  render() {
    const {showModal, closeModal, saveModal} = this.props;
    const {fhirServer} = this.state;

    return (
      <Modal
        title="Create Plan Definition"
        submitButtonText="Download"
        maxWidth="xl"
        handleShowModal={showModal}
        handleCloseModal={closeModal}
        handleSaveModal={() => saveModal(this.state)}>

        <div className="artifact-table__modal modal__content">
          <div className="artifact-form__edit">

            <h5>Select the recommendations to be used in the Plan Definition.</h5>
            <RadioGroup
              aria-label={"FHIR Server Configuration"}
              name={"radio"}
              value={this.state.fhirServer.radio}
              onChange={this.handleCheckboxInputChange}>
              <FormControlLabel control={<Radio/>} label={"Run rule using our FHIR server and synthetic data"}
                                value={"0"}/>
              <FormControlLabel control={<Radio/>} label={"Specify your own FHIR server configuration"} value={"1"}/>
            </RadioGroup>

            {fhirServer.radio > 0 ? (
              <div>
                <StringField
                  id={'fhirServer'}
                  name={'FHIR Server'}
                  value={this.state.fhirServer.fhirServer}
                  updateInstance={this.handleInputChange}
                />

                <StringField
                  id={'fhirServer'}
                  name={'Access Token'}
                  value={this.state.fhirServer.accessToken}
                  updateInstance={this.handleInputChange}
                />

                <StringField
                  id={'scope'}
                  name={'Scope'}
                  value={this.state.fhirServer.scope}
                  updateInstance={this.handleInputChange}
                />

                <StringField
                  id={'expiresIn'}
                  name={'Expires In'}
                  value={this.state.fhirServer.expiresIn}
                  updateInstance={this.handleInputChange}
                />

                <StringField
                  id={'subject'}
                  name={'Subject'}
                  value={this.state.fhirServer.subject}
                  updateInstance={this.handleInputChange}
                />
              </div>
            ) : (
              null
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

RunRuleModal.propTypes = {
  artifact: artifactProps,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveModal: PropTypes.func.isRequired,
};
