import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Modal} from 'components/elements';

import artifactProps from '../../prop-types/artifact';
import StringField from "../builder/fields/StringField";

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
        // 'planDefinitionLibraryURL': '',
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
        // 'planDefinitionLibraryURL': '',
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
    const {showModal, closeModal, saveModal} = this.props;
    const {pddiRecommendations, recommendations} = this.state;

    return (
      <Modal
        onAfterOpen={this.onAfterOpen}
        title="Create Plan Definition"
        submitButtonText="Download"
        maxWidth="xl"
        handleShowModal={showModal}
        handleCloseModal={closeModal}
        handleSaveModal={() => saveModal(this.state)}>

        <div>
          <h5>Define the following fields for the Plan Definition.</h5>

          <StringField
            id={'planDefinitionURL'}
            name={'Plan Definition URL'}
            value={this.state.planDefinition.planDefinitionURL}
            updateInstance={this.handleInputChange}
          />
          {/*<StringField*/}
          {/*  id={'planDefinitionLibraryURL'}*/}
          {/*  name={'Library ID'}*/}
          {/*  value={this.state.planDefinition.planDefinitionLibraryURL}*/}
          {/*  updateInstance={this.handleInputChange}*/}
          {/*/>*/}

          <StringField
            id={'planDefinitionTopicText'}
            name={'Topic Text'}
            value={this.state.planDefinition.planDefinitionTopicText}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'relatedArtifactType'}
            name={'Related Artifact Type'}
            value={this.state.planDefinition.relatedArtifactType}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'relatedArtifactName'}
            name={'Related Artifact Name'}
            value={this.state.planDefinition.relatedArtifactName}
            updateInstance={this.handleInputChange}
          />

          <StringField
            id={'relatedArtifactURL'}
            name={'Related Artifact URL'}
            value={this.state.planDefinition.relatedArtifactURL}
            updateInstance={this.handleInputChange}
          />
        </div>

        <div className="artifact-table__modal modal__content">
          <div className="artifact-form__edit">

            <h5>Select the recommendations to be used in the Plan Definition.</h5>
            <div className="artifact-form__inputs d-flex justify-content-start">
              <div className='form__group p-2'>
                {pddiRecommendations.length >= 0 ? (
                  pddiRecommendations.map((key, index) => {
                    return (
                      <div className='form__group p-2'>
                        <input type="checkbox" id={"artifact-pddiRecommendations-" + index}
                               name='artifact-pddiRecommendations'
                               value={key.text} style={{marginRight: 10 + 'px'}}
                               onChange={this.handleCheckboxInputChange}/>
                        <label
                          htmlFor={"artifact-pddiRecommendations-" + index}> {key.text}</label>

                      </div>
                    );
                  })

                ) : (

                  recommendations.map((key, index) => {
                    return (
                      <div className='form__group p-2'>
                        <input type="checkbox" id={"artifact-recommendations-" + index}
                               name='artifact-recommendations'
                               value={key.text} style={{marginRight: 10 + 'px'}}
                               onChange={this.handleCheckboxInputChange}/>
                        <label
                          htmlFor={"artifact-recommendations-" + index}> {key.text}</label>

                      </div>
                    )
                      ;
                  })

                )}
              </div>
            </div>
          </div>
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
