import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import PDDIRecommendation from "./PDDIRecommendation";

export default class PDDIRecommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
    };
  }

  componentDidMount() {
    if (this.props.artifact.pddiRecommendations === 0) {
      this.addPDDIRecommendation();
    }
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value });
  }

  addPDDIRecommendation = () => {
    const newRec = {
      uid: `rec-${+new Date()}`, // eslint-disable-line no-plusplus
      grade: 'A',
      subpopulations: [],
      text: '',
      rationale: ''
    };
    const newRecs = this.props.artifact.pddiRecommendations.concat([newRec]);

    this.props.updatePDDIRecommendations(newRecs);
  }

  updatePDDIRecommendation = (uid, newValues) => {
    const index = this.props.artifact.pddiRecommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.artifact.pddiRecommendations, {
      [index]: { $merge: newValues }
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
          <PDDIRecommendation
            key={rec.uid}
            artifact={this.props.artifact}
            templates={this.props.templates}
            rec={rec}
            onUpdate={this.updatePDDIRecommendation}
            onRemove={this.removePDDIRecommendation}
            updatePDDIRecommendations={this.props.updatePDDIRecommendations}
            updateSubpopulations={this.props.updateSubpopulations}
            setActiveTab={this.props.setActiveTab}

          />
        ))}

        <button
          className="button primary-button"
          aria-label="New PDDI recommendation"
          onClick={this.addPDDIRecommendation}
        >
          New PDDI recommendation
        </button>
      </div>
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
