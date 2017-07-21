import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import update from 'immutability-helper';
import Recommendation from './Recommendation';

class Recommendations extends Component {
  static propTypes = {
    updateRecommendations: PropTypes.func.isRequired,
    recommendations: PropTypes.array.isRequired,
    setActiveTab: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
    };
  }

  componentDidMount() {
    if (this.props.recommendations.length === 0) {
      this.addRecommendation();
    }
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value })
  }

  addRecommendation = () => {
    const newRec = {
      uid: _.uniqueId("rec-"),
      grade: 'A',
      subpopulations: [],
      text: '',
      rationale: ''
    }
    let newRecs = this.props.recommendations.concat([newRec])
    this.props.updateRecommendations({ recommendations: newRecs });
  }

  updateRecommendation = (uid, newValues) => {
    const index = this.props.recommendations.findIndex((rec) => rec.uid === uid);
    let newRecs = update(this.props.recommendations, {
      [index]: { $merge: newValues }
    });
    this.props.updateRecommendations({ recommendations: newRecs });
  }

  removeRecommendation = (uid) => {
    const index = this.props.recommendations.findIndex((rec) => rec.uid === uid);
    let newRecs = update(this.props.recommendations, {
      $splice: [[index, 1]]
    });
    this.props.updateRecommendations({ recommendations: newRecs });
  }

  render() {
    return (
      <div className="recommendations">
        {
          // TODO: Leaving this commented out for now in case we decide to go back to it
          /* {(this.props.recommendations && this.props.recommendations.length > 1)
          ? <p className="title is-5">
              Deliver
              <span className="field recommendations__mode">
               <span className="control">
                 <span className="select">
                   <select value={this.state.mode} onChange={this.handleModeChange} aria-label="Recommendation mode">
                     <option value='every'>every</option>
                     <option value='first'>first</option>
                   </select>
                 </span>
               </span>
              </span>
              recommendation
            </p>
          : null
        } */}

        {
          (this.props.recommendations && this.props.recommendations.length > 1)
          ? <p className="title is-5">Deliver every recommendation</p>
          : null
        }

        {this.props.recommendations && this.props.recommendations.map((rec) => {
          return (
            <Recommendation
              key={rec.uid}
              rec={rec}
              onUpdate={this.updateRecommendation}
              onRemove={this.removeRecommendation}
              recommendations={this.props.recommendations}
              updateRecommendations={this.props.updateRecommendations}
              subpopulations={this.props.subpopulations}
              setActiveTab={this.props.setActiveTab} />
          );
        })}
        <button className="button" onClick={this.addRecommendation}>
          Add new recommendation
        </button>
      </div>
    );
  }
}

export default Recommendations;
