import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Modal} from 'components/elements';

import artifactProps from '../../prop-types/artifact';
import StringField from "../builder/fields/StringField";
import {FormControlLabel, FormLabel, Radio, RadioGroup, Grid} from "@material-ui/core";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
        'radio': '0',
        'startDate': new Date(),
        'endDate':  new Date()
      }
    };
  }

  handleRadioInputChange = (event) => {
    var fhirServer = this.state.fhirServer;
    fhirServer['radio'] = event.target.value;

    if (event.target.name == 'default') {
      fhirServer['fhirServer'] = 'http://3.21.182.6/omoponfhir-stu3/fhir';
      fhirServer['accessToken'] = '12345';
      fhirServer['scope'] = 'launch profile openid online_access user/*.*';
      fhirServer['expiresIn'] = '300';
      fhirServer['subject'] = '';
    } else {
      fhirServer['fhirServer'] = '';
      fhirServer['accessToken'] = '';
      fhirServer['scope'] = '';
      fhirServer['expiresIn'] = '';
      fhirServer['subject'] = '';
    }

    this.setState({fhirServer: fhirServer});
  }

  handleDateChange = (id, date) => {
    var fhirServer = this.state.fhirServer;
    fhirServer[id] = date;

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
        title="Run Rule"
        submitButtonText="Download"
        maxWidth="xl"
        handleShowModal={showModal}
        handleCloseModal={closeModal}
        handleSaveModal={() => saveModal(this.state)}>

        <FormLabel component="legend">FHIR server configuration</FormLabel>
        <RadioGroup
          aria-label={"FHIR Server Configuration"}
          name={"radio"}
          value={this.state.fhirServer.radio}
          onChange={this.handleRadioInputChange}>
          <FormControlLabel control={<Radio/>} name="default"
                            label={"Run rule using our FHIR server and synthetic data"}
                            value={"0"}/>
          <FormControlLabel control={<Radio/>} name="custom"
                            label={"Specify your own FHIR server configuration"}
                            value={"1"}/>
        </RadioGroup>

        {fhirServer.radio > 0 ? (
          <div>
            <StringField
              id={'fhirServer'}
              name={'FHIR Server'}
              placeholder={'The base URL of the CDS Client\'s FHIR server'}
              value={this.state.fhirServer.fhirServer}
              updateInstance={this.handleInputChange}
            />

            <StringField
              id={'fhirServer'}
              name={'Access Token'}
              placeholder={'The OAuth 2.0 access token that provides access to the FHIR server'}
              value={this.state.fhirServer.accessToken}
              updateInstance={this.handleInputChange}
            />

            <StringField
              id={'scope'}
              name={'Scope'}
              value={this.state.fhirServer.scope}
              placeholder={'The scopes the access token grants the CDS Service'}
              updateInstance={this.handleInputChange}
            />

            <StringField
              id={'expiresIn'}
              name={'Expires In'}
              placeholder={'The lifetime in seconds of the access token.'}
              value={this.state.fhirServer.expiresIn}
              updateInstance={this.handleInputChange}
            />

            <StringField
              id={'subject'}
              name={'Subject'}
              value={this.state.fhirServer.subject}
              placeholder={'The OAuth 2.0 client identifier of the CDS Service'}
              updateInstance={this.handleInputChange}
            />
          </div>
        ) : (
          null
        )}

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <FormLabel component="legend">Set period to run rule over</FormLabel>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              name="startDate"
              id="startDate"
              label="Start Date"
              value={this.state.fhirServer.startDate}
              onChange={event => this.handleDateChange("startDate", event)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />

            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              name="endDate"
              id="endDate"
              label="End Date"
              value={this.state.fhirServer.endDate}
              onChange={event => this.handleDateChange("endDate", event)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>

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
