import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Modal} from 'components/elements';

import artifactProps from '../../prop-types/artifact';
import StringField from "../builder/fields/StringField";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel} from "@material-ui/core";

export default class ArtifactPlanDefinitionModal extends Component {

  constructor(props) {
    super(props);

    const {artifact: artifact} = this.props;

    this.state = {
      pddiRecommendations: artifact ? artifact.pddiRecommendations : '',
      recommendations: artifact ? artifact.recommendations : '',
      planDefinitionRecommendations: artifact ? artifact.planDefinitionRecommendations : '',
      planDefinition: {
        'planDefinitionURL': '',
        'planDefinitionTopicText': '',
        'relatedArtifactType': '',
        'relatedArtifactName': '',
        'relatedArtifactURL': ''
      }
    };
  }

  onAfterOpen = () => {
    this.setState({planDefinitionRecommendations: []});
    this.setState({
      planDefinition: {
        'planDefinitionURL': '',
        'planDefinitionTopicText': '',
        'relatedArtifactType': '',
        'relatedArtifactName': '',
        'relatedArtifactURL': ''
      }
    });
  }

  handleCheckboxInputChange = (event) => {
    var checkedBoxes = document.querySelectorAll('input[name=' + event.target.name + ']:checked');
    var planDefinitionRecommendations = [];
    for (var i = 0; i < checkedBoxes.length; i++) {
      if (checkedBoxes[i].checked) {
        planDefinitionRecommendations.push(checkedBoxes[i].value);
      }
    }
    this.setState({planDefinitionRecommendations: planDefinitionRecommendations});
  }

  handleInputChange = (input) => {
    var planDefinition = this.state.planDefinition;
    planDefinition[Object.keys(input)[0]] = Object.values(input)[0];

    this.setState({planDefinition: planDefinition});
  }

  render() {
    const {showModal, closeModal, saveModal, title, submitText} = this.props;
    const {pddiRecommendations, recommendations} = this.state;

    return (
      <Modal
        onAfterOpen={this.onAfterOpen}
        title={title}
        submitButtonText={submitText}
        maxWidth="xl"
        handleShowModal={showModal}
        handleCloseModal={closeModal}
        handleSaveModal={() => saveModal(this.state)}>

        <div>
          <FormLabel component="legend">Define the following fields for the Plan Definition</FormLabel>

          <StringField
            id={'planDefinitionURL'}
            name={'Plan Definition URL'}
            placeholder={'Canonical identifier for this plan definition'}
            value={this.state.planDefinition.planDefinitionURL}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'planDefinitionTopicText'}
            name={'Topic Text'}
            placeholder={'Descriptive topics related to the content of the plan definition'}
            value={this.state.planDefinition.planDefinitionTopicText}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'relatedArtifactType'}
            name={'Related Artifact Type'}
            placeholder={'documentation | justification | citation | predecessor ' +
            '| successor | derived-from | depends-on | composed-of'}
            value={this.state.planDefinition.relatedArtifactType}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'relatedArtifactName'}
            name={'Related Artifact Display'}
            placeholder={'Brief description of the related artifact'}
            value={this.state.planDefinition.relatedArtifactName}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'relatedArtifactURL'}
            name={'Related Artifact URL'}
            placeholder={'Where the artifact can be accessed'}
            value={this.state.planDefinition.relatedArtifactURL}
            updateInstance={this.handleInputChange}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">Select the recommendations to be used in the Plan Definition</FormLabel>
            <FormGroup>
              {pddiRecommendations.length > 0 ? (
                pddiRecommendations.map((element, index) => {
                  return (
                    <FormControlLabel key={index}
                                      control={<Checkbox onChange={this.handleCheckboxInputChange} value={element.text}
                                                         id={"artifact-pddiRecommendations-" + index}
                                                         name="artifact-recommendations"/>}
                                      label={element.text}
                    />
                  );
                })
              ) : (
                recommendations.map((element, index) => {
                  return (
                    <FormControlLabel key={index}
                                      control={<Checkbox onChange={this.handleCheckboxInputChange} value={element.text}
                                                         id={"artifact-pddiRecommendations-" + index}
                                                         name="artifact-recommendations"/>}
                                      label={element.text}
                    />
                  );
                })
              )
              }
            </FormGroup>
          </FormControl>
        </div>
      </Modal>
    );
  }
}

ArtifactPlanDefinitionModal.propTypes = {
  artifact: artifactProps,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveModal: PropTypes.func.isRequired,
};
