import React from 'react';
import { SymbolPaletteComponent, DiagramComponent, Node } from '@syncfusion/ej2-react-diagrams';
import { SampleBase } from './SampleBase';
import { Modal } from 'components/elements';
import '../../styles/components/builder/fonticons.css';

// initialize the flowshapes for the symbol palatte
let flowshapes = [
  {
    id: 'Inclusions',
    shape: { type: 'Flow', shape: 'Terminator' },
    annotations: [{ content: 'Inclusion Element' }]
  },
  {
    id: 'Exclusions',
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{ content: 'Exclusion Element' }]
  },
  {
    id: 'Subpopulations',
    shape: { type: 'Flow', shape: 'Decision' },
    annotations: [{ content: 'Subpopulation Element' }]
  },
  {
    id: 'Recommentations',
    shape: { type: 'Flow', shape: 'PaperTap' },
    annotations: [{ content: 'Recommentation Element' }]
  }
];

// initialize connector symbols for the symbol palette
let connectorSymbols = [
  {
    id: 'And',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 100, y: 0 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#000000', fill: '#000000' }
    },
    style: { strokeWidth: 3, strokeColor: '#000000' }
  },
  {
    id: 'Or',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 100, y: 0 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#757575', fill: '#757575' }
    },
    style: { strokeWidth: 3, strokeColor: '#757575' }
  },
  {
    id: 'Yes',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 100, y: 0 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#239b56', fill: '#239b56' }
    },
    style: { strokeWidth: 3, strokeColor: '#239b56' }
  },
  {
    id: 'No',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 100, y: 0 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#ff3333', fill: '#ff3333' }
    },
    style: { strokeWidth: 3, strokeColor: '#ff3333' }
  }
];

// initialize gridlines
let gridlines = {
  lineColor: '#e0e0e0',
  lineIntervals: [
    1,
    9,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75
  ]
};

function getPorts(obj) {
  let ports = [
    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
    { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
  ];
  return ports;
}

let isMobile;
function addEvents() {
  isMobile = window.matchMedia('(max-width:550px)').matches;
  if (isMobile) {
    let paletteIcon = document.getElementById('palette-icon');
    if (paletteIcon) {
      //   paletteIcon.addEventListener("click", openPalette, false);
    }
  }
}

let diagramInstance;

export default class DiagramUI extends SampleBase {
  state = {
    showElementModal: false,
    shapeType: '',
    elementModalTitle: ''
  };

  openElementModal = args => {
    let type = args.source.properties.shape.properties.shape;
    switch (type) {
      case 'Terminator':
        this.setState({ elementModalTitle: 'Define Inclusion Elements' });
        break;
      case 'Process':
        this.setState({ elementModalTitle: 'Define Exclusion Elements' });
        break;
      case 'Decision':
        this.setState({ elementModalTitle: 'Define Subpopulation Elements' });
        break;
      case 'PaperTap':
        this.setState({ elementModalTitle: 'Define Recommendation Elements' });
        break;
      default:
        this.setState({ elementModalTitle: '' });
    }

    this.setState({ showElementModal: true, shapeType: type });
  };

  closeElementModal = () => {
    this.setState({ showElementModal: false, shapeType: '' });
  };

  rendereComplete() {
    addEvents();
    diagramInstance.fitToPage();
  }

  render() {
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
                  <SymbolPaletteComponent
                    id="symbolpalette"
                    expandMode="Multiple"
                    palettes={[
                      {
                        id: 'flow',
                        expanded: true,
                        symbols: flowshapes,
                        iconCss: 'e-diagram-icons1 e-diagram-flow',
                        title: 'Elements'
                      },
                      {
                        id: 'connectors',
                        expanded: true,
                        symbols: connectorSymbols,
                        iconCss: 'e-diagram-icons1 e-diagram-connector',
                        title: 'Relationships'
                      }
                    ]}
                    width={'125px'}
                    height={'700px'}
                    symbolHeight={60}
                    symbolWidth={100}
                    getNodeDefaults={symbol => {
                      if (symbol.id === 'Inclusions' || symbol.id === 'Exclusions') {
                        symbol.width = 80;
                        symbol.height = 40;
                      } else if (symbol.id === 'Subpopulations' || symbol.id === 'Recommentations') {
                        symbol.width = 50;
                        symbol.height = 40;
                      } else {
                        symbol.width = 50;
                        symbol.height = 50;
                      }
                      symbol.style.strokeColor = '#757575';
                    }}
                    symbolMargin={{ left: 15, right: 15, top: 15, bottom: 15 }}
                    getSymbolInfo={symbol => {
                      return { fit: true };
                    }}
                  />
                </div>
                <div id="diagram-space" className="sb-mobile-diagram">
                  <DiagramComponent
                    id="diagram"
                    ref={diagram => (diagramInstance = diagram)}
                    width={'100%'}
                    height={'700px'}
                    snapSettings={{
                      horizontalGridlines: gridlines,
                      verticalGridlines: gridlines
                    }}
                    getNodeDefaults={node => {
                      let obj = {};
                      if (obj.width === undefined) {
                        obj.width = 145;
                      } else {
                        let ratio = 100 / obj.width;
                        obj.width = 100;
                        obj.height *= ratio;
                      }
                      obj.style = { fill: '#357BD2', strokeColor: 'white' };
                      obj.annotations = [{ style: { color: '#000000', fill: 'transparent' } }];
                      //Set ports
                      obj.ports = getPorts(node);
                      return obj;
                    }} //Sets the default values of a connector
                    getConnectorDefaults={obj => {
                      if (obj.id.indexOf('connector') !== -1) {
                        obj.type = 'Orthogonal';
                        obj.targetDecorator = {
                          shape: 'Arrow',
                          width: 10,
                          height: 10
                        };
                      }
                    }}
                    //Sets the Node style for DragEnter element.
                    dragEnter={args => {
                      let obj = args.element;
                      if (obj instanceof Node) {
                        let oWidth = obj.width;
                        let oHeight = obj.height;
                        let ratio = 100 / obj.width;
                        obj.width = 150;
                        obj.height *= ratio;
                        obj.offsetX += (obj.width - oWidth) / 2;
                        obj.offsetY += (obj.height - oHeight) / 2;
                        obj.style = { fill: '#D5EDED', strokeColor: '#7DCFC9', strokeWidth: 1 };
                      }
                    }}
                    doubleClick={this.openElementModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title={this.state.elementModalTitle}
          theme="light"
          maxWidth="md"
          handleShowModal={this.state.showElementModal}
          handleCloseModal={this.closeElementModal}
          hideSubmitButton={true}
        >
          {this.state.shapeType === 'Terminator' && this.props.inclusionElements}
          {this.state.shapeType === 'Process' && this.props.exclusionElements}
          {this.state.shapeType === 'Decision' && this.props.subpopulationElements}
          {this.state.shapeType === 'PaperTap' && this.props.recommendationElements}
        </Modal>
      </div>
    );
  }
}
