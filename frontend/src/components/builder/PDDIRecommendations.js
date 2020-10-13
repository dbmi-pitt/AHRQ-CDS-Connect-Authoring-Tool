import React, {Component} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import PDDIRecommendation from "./PDDIRecommendation";
import Modal from "../elements/Modal";
import Recommendation from "./Recommendation";

const UP = -1;
const DOWN = 1;

export default class PDDIRecommendations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'every',
            showConfirmDeleteModal: false,

        };
    }

    componentDidMount() {
        if (this.props.artifact.pddiRecommendations === 0) {
            this.addPDDIRecommendation();
        }
    }

    handleModeChange = (event) => {
        this.setState({mode: event.target.value});
    }

    handleMove = (uid, direction) => {
        const {recommendations} = this.props.artifact;
        const position = recommendations.findIndex(index => index.uid === uid);
        if (position < 0) {
            throw new Error("Given recommendation not found.");
        } else if (
            (direction === UP && position === 0)
            || (direction === DOWN && position === recommendations.length - 1)) {
            return; // canot move outside of array
        }

        const recommendation = recommendations[position]; // save recommendation for later
        const newRecommendations = recommendations.filter(rec => rec.uid !== uid); // remove recommendation from array
        newRecommendations.splice(position + direction, 0, recommendation);

        this.props.updateRecommendations(newRecommendations);

        // will run after updated recommendatons rerender
        setTimeout(() => {
            document.getElementById(uid).scrollIntoView({behavior: 'smooth'});
        });
    }

    addPDDIRecommendation = () => {
        const newRec = {
            uid: `rec-${+new Date()}`, // eslint-disable-line no-plusplus
            grade: 'A',
            subpopulations: [],
            text: '',
            rationale: '',
            comment: ''

        };
        const newRecs = this.props.artifact.pddiRecommendations.concat([newRec]);

        this.props.updatePDDIRecommendations(newRecs);
    }

    updatePDDIRecommendation = (uid, newValues) => {
        const index = this.props.artifact.pddiRecommendations.findIndex(rec => rec.uid === uid);
        const newRecs = update(this.props.artifact.pddiRecommendations, {
            [index]: {$merge: newValues}
        });
        this.props.updatePDDIRecommendations(newRecs);
    }

    removePDDIRecommendation = (uid) => {
        const index = this.props.artifact.pddiRecommendations.findIndex(rec => rec.uid === uid);
        const newRecs = update(this.props.artifact.pddiRecommendations, {
            $splice: [[index, 1]]
        });
        this.props.updatePDDIRecommendations(newRecs);
    }

    render() {
        return (
            <div className="pddiRecommendations">
                {/*
          // TODO: Leaving this commented out for now in case we decide to go back to it
          (this.props.artifact.recommendations && this.props.artifact.recommendations.length > 1) &&
          <div className="recommendations__deliver-text">
            Deliver
            <span className="field recommendations__mode">
              <span className="control">
                <span className="select">
                  <select
                    value={this.state.mode}
                    onBlur={this.handleModeChange}
                    title="Recommendation mode"
                    aria-label="Recommendation mode">
                    <option value='every'>every</option>
                    <option value='first'>first</option>
                  </select>
                </span>
              </span>
            </span>
            recommendation
          </div>
        */}

                {this.props.artifact.pddiRecommendations && this.props.artifact.pddiRecommendations.length > 1 &&
                <div className="pddiRecommendations__deliver-text">Deliver first recommendation</div>
                }

                {this.props.artifact.pddiRecommendations && this.props.artifact.pddiRecommendations.map(rec => (
                    <div id={rec.uid} key={rec.uid}>
                        <PDDIRecommendation
                            key={rec.uid}
                            artifact={this.props.artifact}
                            templates={this.props.templates}
                            rec={rec}
                            onUpdate={this.updatePDDIRecommendation}
                            onRemove={() => this.openConfirmDeleteModal(rec.uid)}
                            onMoveRecUp={() => this.handleMove(rec.uid, UP)}
                            onMoveRecDown={() => this.handleMove(rec.uid, DOWN)}
                            updatePDDIRecommendations={this.props.updatePDDIRecommendations}
                            updateSubpopulations={this.props.updateSubpopulations}
                            setActiveTab={this.props.setActiveTab}

                        />
                    </div>
                ))}

                <button
                    className="button primary-button"
                    aria-label="New PDDI recommendation"
                    onClick={this.addPDDIRecommendation}
                >
                    New PDDI recommendation
                </button>
                {this.renderConfirmDeleteModal()}
            </div>
        );
    }

    //DELETE MODAL
    openConfirmDeleteModal = (uid) => {
        this.setState({showConfirmDeleteModal: true, recommendationToDelete: uid});
    }

    closeConfirmDeleteModal = () => {
        this.setState({showConfirmDeleteModal: false});
    }

    handleDeleteRecommendation = (uid) => {
        this.removePDDIRecommendation(this.state.recommendationToDelete);
        this.closeConfirmDeleteModal();
    }

    renderConfirmDeleteModal() {

        return (
            <Modal
                modalTitle="Delete Recommendation"
                modalId="confirm-delete-modal"
                modalTheme="light"
                modalSubmitButtonText="Delete"
                handleShowModal={this.state.showConfirmDeleteModal}
                handleCloseModal={this.closeConfirmDeleteModal}
                handleSaveModal={this.handleDeleteRecommendation}>

                <div className="delete-external-cql-library-confirmation-modal modal__content">
                    <h5>Are you sure you want to permanently delete the PDDIRecommendation?</h5>
                </div>
            </Modal>
        );
    }
}

PDDIRecommendations.propTypes = {
    artifact: PropTypes.object.isRequired,
    templates: PropTypes.array.isRequired,
    updatePDDIRecommendations: PropTypes.func.isRequired,
    updateSubpopulations: PropTypes.func.isRequired,
    setActiveTab: PropTypes.func.isRequired
};
