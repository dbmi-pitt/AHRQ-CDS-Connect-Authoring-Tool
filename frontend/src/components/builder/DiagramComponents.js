import { SymbolPaletteComponent, DiagramComponent, Node } from '@syncfusion/ej2-react-diagrams';

// initialize the flowshapes for the symbol palatte
const flowshapes = [
  {
    id: 'Inclusion',
    shape: { type: 'Flow', shape: 'Terminator' },
    annotations: [{ content: 'Inclusion Element' }]
  },
  {
    id: 'Exclusion',
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{ content: 'Exclusion Element' }]
  },
  {
    id: 'Decision',
    shape: { type: 'Flow', shape: 'Decision' },
    annotations: [{ content: 'Decision Element' }]
  },
  {
    id: 'Recommentation',
    shape: { type: 'Flow', shape: 'PaperTap' },
    annotations: [{ content: 'Recommentation Element' }]
  }
];

// initialize connector symbols for the symbol palette
const connectorSymbols = [
  {
    id: 'And',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 100, y: 0 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#000000', fill: '#000000' }
    },
    style: { strokeWidth: 3, strokeColor: '#000000' },
    annotations: [{ content: 'And', style: { fill: 'white' } }]
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
    style: { strokeWidth: 3, strokeColor: '#757575' },
    annotations: [{ content: 'Or', style: { fill: 'white' } }]
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
    style: { strokeWidth: 3, strokeColor: '#239b56' },
    annotations: [{ content: 'Yes', style: { fill: 'white' } }]
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
    style: { strokeWidth: 3, strokeColor: '#ff3333' },
    annotations: [{ content: 'No', style: { fill: 'white' } }]
  }
];

// initialize gridlines
const gridlines = {
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

const ports = [
  { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
  { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
  { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
  { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
];

export const SymbolPalette = () => {
  return (
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
        if (symbol.id === 'Inclusion' || symbol.id === 'Exclusion') {
          symbol.width = 80;
          symbol.height = 40;
        } else if (symbol.id === 'Decision' || symbol.id === 'Recommentation') {
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
  );
};

export const Diagram = ({ onDoubleClick, onChange, onSetDiagramInstance, diagram }) => {
  return (
    <DiagramComponent
      id="diagram"
      ref={onSetDiagramInstance}
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
        obj.ports = ports;
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
      doubleClick={onDoubleClick}
      collectionChange={onChange}
      rotateChange={onChange}
      positionChange={onChange}
      sizeChange={onChange}
      connectionChange={onChange}
    />
  );
};
