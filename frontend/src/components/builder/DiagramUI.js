import React, { PureComponent } from 'react';
import { enableRipple } from '@syncfusion/ej2-base';
import { SymbolPalette, Diagram } from './DiagramComponents';
import { Modal } from 'components/elements';
import '../../styles/components/builder/fonticons.css';

enableRipple(true);

let diagramInstance;

export default class DiagramUI extends PureComponent {
  state = {
    showElementModal: false,
    shapeType: '',
    elementModalTitle: ''
  };

  handleSetDiagramInstance = diagram => {
    diagramInstance = diagram;
  };

  handleDoubleClick = args => {
    if (args.source.shape && args.source.shape.properties.shape) {
      let type = args.source.shape.properties.shape;
      switch (type) {
        case 'Terminator':
          this.setState({ elementModalTitle: 'Define Inclusion Element' });
          break;
        case 'Process':
          this.setState({ elementModalTitle: 'Define Exclusion Element' });
          break;
        case 'Decision':
          this.setState({ elementModalTitle: 'Define Decision Element' });
          break;
        case 'PaperTap':
          this.setState({ elementModalTitle: 'Define Recommendation Element' });
          break;
        default:
          this.setState({ elementModalTitle: '' });
      }

      this.setState({ showElementModal: true, shapeType: type });
    }
  };

  handleCloseModal = () => {
    this.setState({ showElementModal: false, shapeType: '' });
  };

  handleOnChange = args => {
    if (args.type === 'Removal') {
      let type = args.element.shape.properties.shape;
      switch (type) {
        case 'Terminator':
          this.props.artifact.expTreeInclude.childInstances = [];
          break;
        case 'Process':
          this.props.artifact.expTreeExclude.childInstances = [];
          break;
        case 'Decision':
          this.props.artifact.subpopulations[2].childInstances = [];
          break;
        case 'PaperTap':
          this.props.artifact.recommendations = [];
          break;
        default:
      }
    }

    this.props.artifact.diagram = diagramInstance.saveDiagram();
  };

  rendereComplete() {
    if (this.props.artifact.diagram) {
      diagramInstance.loadDiagram(this.props.artifact.diagram);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.rendereComplete();
    });
  }

  render() {
    if (diagramInstance) {
      if (this.props.artifact.diagram) {
        diagramInstance.loadDiagram(this.props.artifact.diagram);
      } else {
        diagramInstance.clear();
      }
    }

    return (
      <div className="card-group card-group__top">
        <div className="card-element" style={{ padding: 20 }}>
          <div className="control-pane">
            <div className="control-section">
              <div style={{ width: '100%' }}>
                <div className="sb-mobile-palette-bar">
                  <div
                    id="palette-icon"
                    style={{ float: 'right', role: 'button' }}
                    className="e-ddb-icons1 e-toggle-palette"
                  ></div>
                </div>
                <div id="palette-space" className="sb-mobile-palette">
                  <SymbolPalette />
                </div>
                <div id="diagram-space" className="sb-mobile-diagram">
                  <Diagram
                    onDoubleClick={this.handleDoubleClick}
                    onChange={this.handleOnChange}
                    onSetDiagramInstance={this.handleSetDiagramInstance}
                  />
                </div>
              </div>
            </div>
          </div>
          <Modal
            title={this.state.elementModalTitle}
            theme="light"
            maxWidth="md"
            handleShowModal={this.state.showElementModal}
            handleCloseModal={this.handleCloseModal}
            hideSubmitButton={true}
          >
            {this.state.shapeType === 'Terminator' && this.props.inclusionElements}
            {this.state.shapeType === 'Process' && this.props.exclusionElements}
            {this.state.shapeType === 'Decision' && this.props.subpopulationElements}
            {this.state.shapeType === 'PaperTap' && this.props.recommendationElements}
          </Modal>
        </div>
      </div>
    );
  }
}
