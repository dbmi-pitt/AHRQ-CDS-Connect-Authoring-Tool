import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withGracefulUnmount from 'react-graceful-unmount';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import loadTemplates from '../actions/templates';
import loadValueSets from '../actions/value_sets';
import loadConversionFunctions from '../actions/modifiers';
import {
  setStatusMessage, downloadArtifact, saveArtifact, loadArtifact, updateArtifact, initializeArtifact,
  updateAndSaveArtifact, publishArtifact, clearArtifactValidationWarnings
} from '../actions/artifacts';
import {
  loginVSACUser, setVSACAuthStatus, searchVSACByKeyword, getVSDetails, validateCode, resetCodeValidation
} from '../actions/vsac';

import EditArtifactModal from '../components/artifact/EditArtifactModal';
import ConjunctionGroup from '../components/builder/ConjunctionGroup';
import Subpopulations from '../components/builder/Subpopulations';
import ErrorStatement from '../components/builder/ErrorStatement';
import Parameters from '../components/builder/Parameters';
import Recommendations from '../components/builder/Recommendations';
import RepoUploadModal from '../components/builder/RepoUploadModal';
import ELMErrorModal from '../components/builder/ELMErrorModal';
import BaseElements from '../components/builder/BaseElements';

import isBlankArtifact from '../utils/artifacts/isBlankArtifact';
import { findValueAtPath } from '../utils/find';

import artifactProps from '../prop-types/artifact';

// TODO: This is needed because the tree on this.state is not updated in time. Figure out a better way to handle this
let localTree;

export class Builder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditArtifactModal: false,
      showPublishModal: false,
      showELMErrorModal: false,
      activeTabIndex: 0,
      uniqueIdCounter: 0
    };
  }

  componentDidMount() {
    this.props.loadTemplates().then((result) => {
      // if there is a current artifact, load it, otherwise initialize new artifact
      if (this.props.match.params.id) {
        this.props.loadArtifact(this.props.match.params.id);
      } else {
        const operations = result.templates.find(template => template.name === 'Operations');
        const andTemplate = operations.entries.find(entry => entry.name === 'And');
        this.props.initializeArtifact(andTemplate);
      }
    });
    this.props.publishArtifact();
    this.props.loadConversionFunctions();
  }

  componentWillUnmount() {
    const { artifact } = this.props;

    if (!isBlankArtifact(artifact)) {
      this.handleSaveArtifact(artifact);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ showELMErrorModal: newProps.downloadedArtifact.elmErrors.length > 0 });
  }

  // ----------------------- TABS ------------------------------------------ //

  setActiveTab = (activeTabIndex) => {
    this.setState({ activeTabIndex });
  }

  // ----------------------- INSTANCES ------------------------------------- //

  getAllInstances = (treeName, treeInstance = null, uid = null) => {
    // if treeInstance is null, find and assign tree (only used recursively)
    if (treeInstance == null) {
      treeInstance = this.findTree(treeName, uid).tree; // eslint-disable-line no-param-reassign
    }

    return _.flatten((treeInstance.childInstances || []).map((instance) => {
      if (instance.childInstances) {
        return _.flatten([instance, this.getAllInstances(treeName, instance)]);
      }
      return instance;
    }));
  }

  addInstance = (treeName, instance, parentPath, uid = null, currentIndex, incomingTree) => {
    const treeData = this.findTree(treeName, uid);
    const tree = incomingTree || treeData.tree;
    const target = findValueAtPath(tree, parentPath).childInstances;
    const index = currentIndex !== undefined ? currentIndex : target.length;
    target.splice(index, 0, instance); // Insert instance at specific instance - only used for indenting now
    localTree = tree;
    this.setTree(treeName, treeData, tree);
  }

  addBaseElement = (instance, uid = null, incomingTree) => {
    const treeData = this.findTree('baseElements', uid);
    const tree = incomingTree || treeData.tree;
    tree.push(instance);
    this.setTree('baseElements', treeData, tree);
  }

  editInstance = (treeName, editedParams, path, editingConjunctionType = false, uid = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const target = findValueAtPath(tree, path);

    if (editingConjunctionType) {
      target.id = editedParams.id;
      target.name = editedParams.name;
    } else {
      // If only one parameter is being updated, it comes in as a single object. Put it into an array of objects.
      if (!Array.isArray(editedParams)) {
        editedParams = [editedParams]; // eslint-disable-line no-param-reassign
      }
      // Update each parameter attribute that needs updating. Then updated the full tree with changes.
      editedParams.forEach((editedParam) => {
        // function to retrieve relevant parameter
        const paramIndex = target.parameters.findIndex(param =>
          Object.prototype.hasOwnProperty.call(editedParam, param.id));

        // If an attribute was specified, update that one. Otherwise update the value attribute.
        if (editedParam.attributeToEdit) {
          target.parameters[paramIndex][editedParam.attributeToEdit] = editedParam[target.parameters[paramIndex].id];
        } else {
          target.parameters[paramIndex].value = editedParam[target.parameters[paramIndex].id];
        }
      });
    }

    this.setTree(treeName, treeData, tree);
  }

  deleteInstance = (treeName, path, elementsToAdd, uid = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const index = path.slice(-1);
    const target = findValueAtPath(tree, path.slice(0, path.length - 2));
    target.splice(index, 1); // remove item at index position

    this.setTree(treeName, treeData, tree);
    localTree = tree;

    // elementsToAdd is an array of elements to be readded when indenting or outdenting
    if (elementsToAdd) {
      elementsToAdd.forEach((element) => {
        this.addInstance(treeName, element.instance, element.path, uid, element.index, localTree);
      });
    }
  }

  // subpop_index is an optional parameter, for determing which tree within subpop we are referring to
  updateInstanceModifiers = (treeName, modifiers, path, subpopIndex) => {
    const tree = _.cloneDeep(this.props.artifact[treeName]);
    const valuePath = _.isNumber(subpopIndex) ? tree[subpopIndex] : tree;
    const target = findValueAtPath(valuePath, path);
    target.modifiers = modifiers;

    this.props.updateArtifact(this.props.artifact, { [treeName]: tree });
  }


  showELMErrorModal = () => {
    this.setState({ showELMErrorModal: true });
  }

  closeELMErrorModal = () => {
    this.setState({ showELMErrorModal: false });
    this.props.clearArtifactValidationWarnings();
  }

  // ----------------------- ARTIFACTS ------------------------------------- //

  openEditArtifactModal = () => {
    this.setState({ showEditArtifactModal: true });
  }

  closeEditArtifactModal = () => {
    this.setState({ showEditArtifactModal: false });
  }


  handleSaveArtifact = (artifactPropsChanged) => {
    this.props.updateAndSaveArtifact(this.props.artifact, artifactPropsChanged);
    this.closeEditArtifactModal(false);
  }

  // ----------------------- TREES ----------------------------------------- //

  // Identifies tree to modify whether state tree or tree in an array.
  findTree = (treeName, uid) => {
    const clonedTree = _.cloneDeep(this.props.artifact[treeName]);
    if (uid == null) { return { tree: clonedTree }; }

    const index = clonedTree.findIndex(sub => sub.uniqueId === uid);
    return { array: clonedTree, tree: clonedTree[index], index };
  }

  // Sets new tree based on if state tree or array tree
  setTree = (treeName, treeData, tree) => {
    if ('array' in treeData) {
      const index = treeData.index;
      treeData.array[index] = tree;
      this.props.updateArtifact(this.props.artifact, { [treeName]: treeData.array });
    } else {
      this.props.updateArtifact(this.props.artifact, { [treeName]: tree });
    }
  }

  // ----------------------------------------------------------------------- //

  incrementUniqueIdCounter = () => {
    this.setState({ uniqueIdCounter: this.state.uniqueIdCounter + 1 });
  }

  updateRecsSubpop = (newName, uniqueId) => {
    const recs = _.cloneDeep(this.props.artifact.recommendations);
    for (let i = 0; i < recs.length; i++) {
      const subpops = recs[i].subpopulations;
      for (let j = 0; j < subpops.length; j++) {
        if (subpops[j].uniqueId === uniqueId) {
          subpops[j].subpopulationName = newName;
        }
      }
    }
    this.setState({ recommendations: recs });
  }

  updateSubpopulations = (subpopulations, target = 'subpopulations') => {
    this.props.updateArtifact(this.props.artifact, { [target]: subpopulations });
  }

  updateRecommendations = (recommendations) => {
    this.props.updateArtifact(this.props.artifact, { recommendations });
  }

  updateParameters = (parameters) => {
    this.props.updateArtifact(this.props.artifact, { parameters });
  }

  updateErrorStatement = (errorStatement) => {
    this.props.updateArtifact(this.props.artifact, { errorStatement });
  }

  checkSubpopulationUsage = (uniqueId) => {
    for (let i = 0; i < this.props.artifact.recommendations.length; i++) {
      const subpops = this.props.artifact.recommendations[i].subpopulations;
      for (let j = 0; j < subpops.length; j++) {
        if (subpops[j].uniqueId === uniqueId) {
          return true;
        }
      }
    }
    return false;
  }

  togglePublishModal = () => {
    this.setState({ showPublishModal: !this.state.showPublishModal });
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConjunctionGroup = (treeName) => {
    const {
      artifact, templates, valueSets,
      vsacStatus, vsacStatusText, timeLastAuthenticated,
      isRetrievingDetails, vsacDetailsCodes, conversionFunctions,
      isValidatingCode, isValidCode, codeData
    } = this.props;
    const namedParameters = _.filter(artifact.parameters, p => (!_.isNull(p.name) && p.name.length));
    if (artifact && artifact[treeName].childInstances) {
      return (
        <ConjunctionGroup
          root={true}
          treeName={treeName}
          artifact={artifact}
          templates={templates}
          valueSets={valueSets}
          loadValueSets={this.props.loadValueSets}
          instance={artifact[treeName]}
          addInstance={this.addInstance}
          editInstance={this.editInstance}
          deleteInstance={this.deleteInstance}
          getAllInstances={this.getAllInstances}
          updateInstanceModifiers={this.updateInstanceModifiers}
          parameters={namedParameters}
          baseElements={artifact.baseElements}
          conversionFunctions={conversionFunctions}
          instanceNames={this.props.names}
          loginVSACUser={this.props.loginVSACUser}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          vsacStatus={vsacStatus}
          vsacStatusText={vsacStatusText}
          timeLastAuthenticated={timeLastAuthenticated}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={isRetrievingDetails}
          vsacDetailsCodes={vsacDetailsCodes}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          isValidatingCode={isValidatingCode}
          isValidCode={isValidCode}
          codeData={codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation} />
      );
    }

    return <div>Loading...</div>;
  }

  renderHeader() {
    const { statusMessage, artifact, publishEnabled } = this.props;
    const artifactName = artifact ? artifact.name : null;

    return (
      <header className="builder__header" aria-label="Workspace Header">
        <h2 className="builder__heading">
          <button aria-label="Edit" className="secondary-button" onClick={this.openEditArtifactModal}>
            <FontAwesome name="pencil" />
          </button>

          {artifactName}
        </h2>

        <div className="builder__buttonbar">
          <div className="builder__buttonbar-menu" aria-label="Workspace Menu">
            <button onClick={() => this.props.downloadArtifact(artifact)} className="secondary-button">
              <FontAwesome name="download" className="icon" />Download CQL
            </button>

            <button onClick={() => this.handleSaveArtifact(artifact)} className="secondary-button">
              <FontAwesome name="save" className="icon" />Save
            </button>

            { publishEnabled ?
              <button
                onClick={() => { this.handleSaveArtifact(artifact); this.togglePublishModal(); }}
                className="secondary-button">
                <FontAwesome name="align-right" className="icon" />Publish
              </button>
              : ''
            }
          </div>

          <div role="status" aria-live="assertive">{statusMessage}</div>
        </div>
      </header>
    );
  }

  render() {
    const { artifact, templates, conversionFunctions } = this.props;
    let namedParameters = [];
    if (artifact) {
      namedParameters = _.filter(artifact.parameters, p => (!_.isNull(p.name) && p.name.length));
    }

    if (artifact == null) {
      return (
        <div className="builder" id="maincontent">
          <div className="builder-wrapper">
            <em>Loading...</em>
          </div>
        </div>
      );
    }

    return (
      <div className="builder" id="maincontent">
        <div className="builder-wrapper">
          {this.renderHeader()}

          <section className="builder__canvas">
            <Tabs selectedIndex={this.state.activeTabIndex} onSelect={tabIndex => this.setActiveTab(tabIndex)}>
              <TabList aria-label="Workspace Tabs">
                <Tab>Inclusions</Tab>
                <Tab>Exclusions</Tab>
                <Tab>Subpopulations</Tab>
                <Tab>Base Elements</Tab>
                <Tab>Recommendations</Tab>
                <Tab>Parameters</Tab>
                <Tab>Handle Errors</Tab>
              </TabList>

              <div className="tab-panel-container">
                <TabPanel>
                  {this.renderConjunctionGroup('expTreeInclude')}
                </TabPanel>

                <TabPanel>
                  {this.renderConjunctionGroup('expTreeExclude')}
                </TabPanel>

                <TabPanel>
                  <Subpopulations
                    name={'subpopulations'}
                    artifact={artifact}
                    valueSets={this.props.valueSets}
                    loadValueSets={this.props.loadValueSets}
                    updateSubpopulations={this.updateSubpopulations}
                    parameters={namedParameters}
                    baseElements={artifact.baseElements}
                    addInstance={this.addInstance}
                    editInstance={this.editInstance}
                    updateInstanceModifiers={this.updateInstanceModifiers}
                    deleteInstance={this.deleteInstance}
                    getAllInstances={this.getAllInstances}
                    templates={templates}
                    checkSubpopulationUsage={this.checkSubpopulationUsage}
                    updateRecsSubpop={this.updateRecsSubpop}
                    conversionFunctions={conversionFunctions}
                    instanceNames={this.props.names}
                    loginVSACUser={this.props.loginVSACUser}
                    setVSACAuthStatus={this.props.setVSACAuthStatus}
                    vsacStatus={this.props.vsacStatus}
                    vsacStatusText={this.props.vsacStatusText}
                    timeLastAuthenticated={this.props.timeLastAuthenticated}
                    searchVSACByKeyword={this.props.searchVSACByKeyword}
                    isSearchingVSAC={this.props.isSearchingVSAC}
                    vsacSearchResults={this.props.vsacSearchResults}
                    vsacSearchCount={this.props.vsacSearchCount}
                    getVSDetails={this.props.getVSDetails}
                    isRetrievingDetails={this.props.isRetrievingDetails}
                    vsacDetailsCodes={this.props.vsacDetailsCodes}
                    vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                    isValidatingCode={this.props.isValidatingCode}
                    isValidCode={this.props.isValidCode}
                    codeData={this.props.codeData}
                    validateCode={this.props.validateCode}
                    resetCodeValidation={this.props.resetCodeValidation} />
                </TabPanel>

                <TabPanel>
                  <BaseElements
                    treeName='baseElements'
                    instance={artifact}
                    addBaseElement={this.addBaseElement}
                    loadValueSets={this.props.loadValueSets}
                    editInstance={this.editInstance}
                    updateInstanceModifiers={this.updateInstanceModifiers}
                    deleteInstance={this.deleteInstance}
                    templates={templates}
                    valueSets={this.props.valueSets}
                    conversionFunctions={conversionFunctions}
                    instanceNames={this.props.names}
                    baseElements={artifact.baseElements}
                    parameters={namedParameters}
                    loginVSACUser={this.props.loginVSACUser}
                    setVSACAuthStatus={this.props.setVSACAuthStatus}
                    vsacStatus={this.props.vsacStatus}
                    vsacStatusText={this.props.vsacStatusText}
                    timeLastAuthenticated={this.props.timeLastAuthenticated}
                    searchVSACByKeyword={this.props.searchVSACByKeyword}
                    isSearchingVSAC={this.props.isSearchingVSAC}
                    vsacSearchResults={this.props.vsacSearchResults}
                    vsacSearchCount={this.props.vsacSearchCount}
                    getVSDetails={this.props.getVSDetails}
                    isRetrievingDetails={this.props.isRetrievingDetails}
                    vsacDetailsCodes={this.props.vsacDetailsCodes}
                    vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                    isValidatingCode={this.props.isValidatingCode}
                    isValidCode={this.props.isValidCode}
                    codeData={this.props.codeData}
                    validateCode={this.props.validateCode}
                    resetCodeValidation={this.props.resetCodeValidation}
                    validateReturnType={false}/>
                </TabPanel>

                <TabPanel>
                  <Recommendations
                    artifact={artifact}
                    templates={templates}
                    updateRecommendations={this.updateRecommendations}
                    updateSubpopulations={this.updateSubpopulations}
                    setActiveTab={this.setActiveTab}
                    uniqueIdCounter={this.state.uniqueIdCounter}
                    incrementUniqueIdCounter={this.incrementUniqueIdCounter} />
                </TabPanel>

                <TabPanel>
                  <Parameters
                    parameters={this.props.artifact.parameters}
                    updateParameters={this.updateParameters}
                    instanceNames={this.props.names}
                    timeLastAuthenticated={this.props.timeLastAuthenticated}
                    vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                    loginVSACUser={this.props.loginVSACUser}
                    setVSACAuthStatus={this.props.setVSACAuthStatus}
                    vsacStatus={this.props.vsacStatus}
                    vsacStatusText={this.props.vsacStatusText}
                    isValidatingCode={this.props.isValidatingCode}
                    isValidCode={this.props.isValidCode}
                    codeData={this.props.codeData}
                    validateCode={this.props.validateCode}
                    resetCodeValidation={this.props.resetCodeValidation} />
                </TabPanel>

                <TabPanel>
                  <ErrorStatement
                    parameters={namedParameters}
                    subpopulations={this.props.artifact.subpopulations}
                    errorStatement={this.props.artifact.errorStatement}
                    updateErrorStatement={this.updateErrorStatement} />
                </TabPanel>

              </div>
            </Tabs>
          </section>
        </div>

        <RepoUploadModal
          artifact={artifact}
          showModal={this.state.showPublishModal}
          closeModal={this.togglePublishModal}
          version={artifact.version} />

        <EditArtifactModal
          artifactEditing={artifact}
          showModal={this.state.showEditArtifactModal}
          closeModal={this.closeEditArtifactModal}
          saveModal={this.handleSaveArtifact} />
        <ELMErrorModal
          isOpen={this.state.showELMErrorModal}
          closeModal={this.closeELMErrorModal}
          errors={this.props.downloadedArtifact.elmErrors}/>
      </div>
    );
  }
}

Builder.propTypes = {
  artifact: artifactProps,
  statusMessage: PropTypes.string,
  templates: PropTypes.array,
  loadTemplates: PropTypes.func.isRequired,
  loadValueSets: PropTypes.func.isRequired,
  loadArtifact: PropTypes.func.isRequired,
  initializeArtifact: PropTypes.func.isRequired,
  updateArtifact: PropTypes.func.isRequired,
  setStatusMessage: PropTypes.func.isRequired,
  downloadArtifact: PropTypes.func.isRequired,
  saveArtifact: PropTypes.func.isRequired,
  updateAndSaveArtifact: PropTypes.func.isRequired,
  conversionFunctions: PropTypes.array,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  names: PropTypes.array.isRequired,
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadTemplates,
    loadValueSets,
    loadArtifact,
    initializeArtifact,
    updateArtifact,
    setStatusMessage,
    downloadArtifact,
    saveArtifact,
    updateAndSaveArtifact,
    publishArtifact,
    loginVSACUser,
    setVSACAuthStatus,
    searchVSACByKeyword,
    getVSDetails,
    validateCode,
    resetCodeValidation,
    clearArtifactValidationWarnings,
    loadConversionFunctions
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    artifact: state.artifacts.artifact,
    downloadedArtifact: state.artifacts.downloadArtifact,
    statusMessage: state.artifacts.statusMessage,
    templates: state.templates.templates,
    valueSets: state.valueSets.valueSets,
    publishEnabled: state.artifacts.publishEnabled,
    names: state.artifacts.names,
    vsacStatus: state.vsac.authStatus,
    vsacStatusText: state.vsac.authStatusText,
    timeLastAuthenticated: state.vsac.timeLastAuthenticated,
    isSearchingVSAC: state.vsac.isSearchingVSAC,
    vsacSearchResults: state.vsac.searchResults,
    vsacSearchCount: state.vsac.searchCount,
    isRetrievingDetails: state.vsac.isRetrievingDetails,
    isValidatingCode: state.vsac.isValidatingCode,
    isValidCode: state.vsac.isValidCode,
    codeData: state.vsac.codeData,
    vsacDetailsCodes: state.vsac.detailsCodes,
    vsacFHIRCredentials: { username: state.vsac.username, password: state.vsac.password },
    conversionFunctions: state.modifiers.conversionFunctions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withGracefulUnmount(Builder));
