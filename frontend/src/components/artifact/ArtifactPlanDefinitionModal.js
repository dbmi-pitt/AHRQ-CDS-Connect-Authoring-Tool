// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import _ from 'lodash';
//
// import Modal from '../elements/Modal';
//
// import artifactProps from '../../prop-types/artifact';
//
//
// export default class ArtifactPlanDefinitionModal extends Component {
//
//   constructor(props) {
//     super(props);
//
//     const {artifact: artifact} = props;
//
//     this.state = {
//       pddiRecommendations: artifact ? artifact.pddiRecommendations : '',
//       recommendations: artifact ? artifact.recommendations : '',
//       planDefinitionRecommendations: artifact ? artifact.planDefinitionRecommendations : '',
//       planDefinition: artifact ? artifact.planDefinition : ''
//     };
//   }
//
//   onAfterOpen = () => {
//     this.setState({planDefinitionRecommendations: []});
//     this.setState({planDefinition: {}});
//   }
//
//   handleCheckboxInputChange = (event) => {
//     var checkedBoxes = document.querySelectorAll('input[name=' + event.target.name + ']:checked');
//     var planDefinitionRecommendations = [];
//     for (var i = 0; i < checkedBoxes.length; i++) {
//       if (checkedBoxes[i].checked) {
//         planDefinitionRecommendations.push(checkedBoxes[i].value);
//       }
//     }
//     this.setState({planDefinitionRecommendations: planDefinitionRecommendations});
//   }
//
//   handleInputChange = (event) => {
//     var planDefinition = this.state.planDefinition;
//     planDefinition[event.target.name] = event.target.value;
//
//     // var planDefinitionAttribute = "planDefinition." + event.target.name;
//     this.setState({planDefinition: planDefinition});
//   }
//
//   render() {
//     const {showModal, closeModal, saveModal} = this.props;
//     const {pddiRecommendations, recommendations} = this.state;
//
//     return (
//       <Modal
//         onAfterOpen={this.onAfterOpen}
//         modalTitle="Create Plan Definition"
//         modalId="plan-definition-modal"
//         modalTheme="light"
//         modalSubmitButtonText="Download"
//         handleShowModal={showModal}
//         handleCloseModal={closeModal}
//         handleSaveModal={() => saveModal(this.state)}>
//
//         <div className="artifact-table__modal modal__content">
//           <div className="artifact-form__edit">
//             <h5>Define the following fields for the Plan Definition.</h5>
//             <div className="artifact-form__inputs d-flex justify-content-start">
//               <div className='form__group p-2'>
//                 <div className='form__group p-2'>
//                   <label htmlFor="urlID">Plan Definition ID</label>
//                   <input id="urlID" required className='input__long' name='planDefinitionURL'
//                          type='text'
//                          onChange={this.handleInputChange}/>
//                 </div>
//
//                 <div className='form__group p-2'>
//                   <label htmlFor="libraryID">Library ID</label>
//                   <input id="libraryID" required className='input__long'
//                          name='planDefinitionLibraryURL' type='text'
//                          onChange={this.handleInputChange}/>
//                 </div>
//
//                 <div className='form__group p-2'>
//                   <label htmlFor="textID">Topic Text</label>
//                   <input id="textID" required className='input__long' name='planDefinitionTopicText'
//                          type='text'
//                          onChange={this.handleInputChange}/>
//                 </div>
//
//                 <div className='form__group p-2'>
//                   <label htmlFor="raTypeID">Related Artifact Type</label>
//                   <input id="raTypeID" required className='input__long' name='relatedArtifactType'
//                          type='text'
//                          onChange={this.handleInputChange}/>
//                 </div>
//
//                 <div className='form__group p-2'>
//                   <label htmlFor="raNameID">Related Artifact Name</label>
//                   <input id="raNameID" required className='input__long' name='relatedArtifactName'
//                          type='text'
//                          onChange={this.handleInputChange}/>
//                 </div>
//
//                 <div className='form__group p-2'>
//                   <label htmlFor="raURLID">Related Artifact URL</label>
//                   <input id="raURLID" required className='input__long' name='relatedArtifactURL'
//                          type='text'
//                          onChange={this.handleInputChange}/>
//                 </div>
//               </div>
//             </div>
//
//             <h5>Select the recommendations to be used in the Plan Definition.</h5>
//             <div className="artifact-form__inputs d-flex justify-content-start">
//               <div className='form__group p-2'>
//                 {pddiRecommendations.length >= 0 ? (
//
//                   pddiRecommendations.map((key, index) => {
//                     return (
//                       <div className='form__group p-2'>
//                         <input type="checkbox" id={"artifact-pddiRecommendations-" + index}
//                                name='artifact-pddiRecommendations'
//                                value={key.text} style={{marginRight: 10 + 'px'}}
//                                onChange={this.handleCheckboxInputChange}/>
//                         <label
//                           htmlFor={"artifact-pddiRecommendations-" + index}> {key.text}</label>
//
//                       </div>
//                     );
//                   })
//
//                 ) : (
//
//                   recommendations.map((key, index) => {
//                     return (
//                       <div className='form__group p-2'>
//                         <input type="checkbox" id={"artifact-recommendations-" + index}
//                                name='artifact-recommendations'
//                                value={key.text} style={{marginRight: 10 + 'px'}}
//                                onChange={this.handleCheckboxInputChange}/>
//                         <label
//                           htmlFor={"artifact-recommendations-" + index}> {key.text}</label>
//
//                       </div>
//                     );
//                   })
//
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     );
//   }
// }
//
// ArtifactPlanDefinitionModal.propTypes = {
//   artifact: artifactProps,
//   showModal: PropTypes.bool.isRequired,
//   closeModal: PropTypes.func.isRequired,
//   saveModal: PropTypes.func.isRequired,
// };
