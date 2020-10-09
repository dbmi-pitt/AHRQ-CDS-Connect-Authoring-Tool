import axios from 'axios';
import Promise from 'promise';
import _ from 'lodash';

import * as types from './types';
import localModifiers from '../data/modifiers';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------------- GET MODIFIERS -------------------------------------- //

function requestModifiers() {
  return {
    type: types.MODIFIERS_REQUEST
  };
}

function loadModifiersSuccess(modifiers) {
  const modifierMap = _.keyBy(modifiers, 'id');
  const modifiersByInputType = {};

  modifiers.forEach((modifier) => {
    modifier.inputTypes.forEach((inputType) => {
      modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
    });
  });

  return {
    type: types.LOAD_MODIFIERS_SUCCESS,
    modifierMap,
    modifiersByInputType
  };
}

function loadModifiersFailure(error) {
  return {
    type: types.LOAD_MODIFIERS_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendModifiersRequest() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      try {
        const externalCqlList = getState().externalCQL.externalCqlList;
        const externalModifiers = [];
        externalCqlList.forEach(lib => {
          lib.details.functions.forEach(func => {
            // The ExternalModifier requires a functionName, libraryName,
            // and arguments field that is not on other modifiers. This is
            // needed for the sake of testing whether external CQL libraries
            // can be deleted or updated, by checking these details.
            if (func.operand.length >= 1) {
              const functionAndLibraryName = `${func.name} (from ${lib.name})`;
              const modifier = {
                id: functionAndLibraryName,
                type: 'ExternalModifier',
                name: functionAndLibraryName,
                inputTypes: func.calculatedInputTypes,
                returnType: func.calculatedReturnType,
                cqlTemplate: 'ExternalModifier',
                cqlLibraryFunction: `"${lib.name}"."${func.name}"`,
                values: { value: '' },
                functionName: func.name,
                libraryName: lib.name,
                arguments: func.operand
              };
              externalModifiers.push(modifier);
            }
          });
        });
        resolve(localModifiers.concat(externalModifiers));
      } catch (error) {
        reject(error);
      }
    });
  };
}

export function loadModifiers() {
  return (dispatch) => {
    dispatch(requestModifiers());

    return dispatch(sendModifiersRequest())
      .then(data => dispatch(loadModifiersSuccess(data)))
      .catch(error => dispatch(loadModifiersFailure(error)));
  };
}

// ------------------------- GET CONVERSION FUNCTIONS --------------------------------- //

function requestConversionFunctions() {
  return {
    type: types.CONVERSION_FUNCTIONS_REQUEST
  };
}

function loadConversionFunctionsSuccess(conversionFunctions) {
  return {
    type: types.LOAD_CONVERSION_FUNCTIONS_SUCCESS,
    conversionFunctions
  };
}

function loadConversionFunctionsFailure(error) {
  return {
    type: types.LOAD_CONVERSION_FUNCTIONS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendConversionFunctionsRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/config/conversions`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadConversionFunctions() {
  return (dispatch) => {
    dispatch(requestConversionFunctions());

    return sendConversionFunctionsRequest()
      .then(data => dispatch(loadConversionFunctionsSuccess(data)))
      .catch(error => dispatch(loadConversionFunctionsFailure(error)));
  };
}
