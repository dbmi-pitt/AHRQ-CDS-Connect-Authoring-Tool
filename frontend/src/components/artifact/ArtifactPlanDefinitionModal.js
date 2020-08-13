import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Modal from '../elements/Modal';

import artifactProps from '../../prop-types/artifact';


export default class ArtifactPlanDefinitionModal extends Component {

    constructor(props) {
        super(props);

        const {artifact: artifact} = props;

        this.state = {
            pddiRecommendations: artifact ? artifact.pddiRecommendations : '',
            recommendations: artifact ? artifact.recommendations : '',
            planDefinitionRecommendations: artifact ? artifact.planDefinitionRecommendations : ''
        };
    }

    onAfterOpen = () => {
        this.setState({planDefinitionRecommendations: []});
    }

    handleInputChange = (event) => {
        var checkedBoxes = document.querySelectorAll('input[name=' + event.target.name + ']:checked');
        var planDefinitionRecommendations = [];
        for (var i = 0; i < checkedBoxes.length; i++) {
            if (checkedBoxes[i].checked) {
                planDefinitionRecommendations.push(checkedBoxes[i].value);
            }
        }
        this.setState({planDefinitionRecommendations: planDefinitionRecommendations});
    }

    render() {
        const {onAfterOpen, showModal, closeModal, saveModal, artifact} = this.props;
        const {pddiRecommendations, recommendations, planDefinitionRecommendations} = this.state;

        return (
            <Modal
                onAfterOpen={this.onAfterOpen}
                modalTitle="Create Plan Definition"
                modalId="plan-definition-modal"
                modalTheme="light"
                modalSubmitButtonText="Download"
                handleShowModal={showModal}
                handleCloseModal={closeModal}
                handleSaveModal={() => saveModal(this.state)}>

                <div className="artifact-table__modal modal__content">
                    <div className="artifact-form__edit">
                        <h5>Please select the recommendations to be used in the Plan Definition.</h5>
                        <div className="artifact-form__inputs d-flex justify-content-start">
                            <div className='form__group p-2'>
                                {pddiRecommendations.length >= 0 ? (

                                    pddiRecommendations.map((key, index) => {
                                        return (
                                            <div className='form__group p-2'>
                                                <input type="checkbox" id={"artifact-pddiRecommendations-" + index}
                                                       name='artifact-pddiRecommendations'
                                                       value={key.text} style={{marginRight: 10 + 'px'}}
                                                       onChange={this.handleInputChange}/>
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
                                                       onChange={this.handleInputChange}/>
                                                <label
                                                    htmlFor={"artifact-recommendations-" + index}> {key.text}</label>

                                            </div>
                                        );
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
