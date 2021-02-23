import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Modal} from 'components/elements';

import {Checkbox, FormControlLabel, FormLabel} from "@material-ui/core";
import {Form, Formik, useField, useFormikContext} from "formik";
import {SelectField, TextField} from "../fields";
import {useDispatch} from "react-redux";
import {updateAndSaveArtifact} from "../../actions/artifacts";


function getInitialValue(artifactEditing, valueName, defaultValue, transformer = x => x) {
  if (!artifactEditing || artifactEditing[valueName] == null) return defaultValue;
  return transformer(artifactEditing[valueName]);
}

const useInitialValues = artifactEditing =>
  useMemo(
    () => ({
      planDefinitionTopicText: '',
      relatedArtifactType: 'documentation',
      relatedArtifactName: '',
      relatedArtifactURL: '',
      pddiRecommendations: getInitialValue(artifactEditing, 'pddiRecommendations', []),
      recommendations: getInitialValue(artifactEditing, 'recommendations', []),
      planDefinitionRecommendations: []
    }),
    [artifactEditing]
  );


const relatedArtifactTypes = [
  {value: 'documentation', label: 'documentation', id: 'documentation'},
  {value: 'justification', label: 'justification', id: 'justification'},
  {value: 'citation', label: 'citation', id: 'citation'},
  {value: 'predecessor', label: 'predecessor', id: 'predecessor'},
  {value: 'successor', label: 'successor', id: 'successor'},
  {value: 'derived-from', label: 'derived-from', id: 'derived-from'},
  {value: 'depends-on', label: 'depends-on', id: 'depends-on'},
  {value: 'composed-of', label: 'composed-of', id: 'composed-of'},
];

export const SelectGroupField = ({...props}) => {
  const {setFieldValue} = useFormikContext();
  const [field] = useField(props);

  return (
    <div className="field-group">
      <SelectField
        {...field}
        {...props}
        value={field.value}
        name={field.name}
        label={"Related Artifact Type"}
        onChange={val => {
          setFieldValue(field.name, val);
        }}
        options={relatedArtifactTypes}/>
    </div>
  );
};

export const CheckboxGroupField = ({...props}) => {
  const {setFieldValue} = useFormikContext();
  const [field] = useField(props);

  return (
    <FormControlLabel key={props.index}
                      control={<Checkbox
                        {...field}
                        {...props}
                        value={props.text}
                        name={field.name}
                        onChange={event => {
                          let checkedBoxes = document.querySelectorAll('input[name=' + event.target.name + ']:checked');
                          let planDefinitionRecommendations = [];
                          for (let i = 0; i < checkedBoxes.length; i++) {
                            if (checkedBoxes[i].checked) {
                              planDefinitionRecommendations.push(checkedBoxes[i].value);
                            }
                          }
                          setFieldValue(field.name, planDefinitionRecommendations);
                        }}
                      />}
                      label={props.text}
    />
  );
};

const ArtifactPlanDefinitonModalForm = memo(({setSubmitDisabled}) => {
  const {values, isValid} = useFormikContext();

  useEffect(() => setSubmitDisabled(!isValid), [isValid, setSubmitDisabled]);

  return (
    <Form>
      <FormLabel component="legend">Define the following fields for the Plan Definition</FormLabel>

      <TextField
        required={true}
        name={'planDefinitionTopicText'}
        label={'Topic Text'}
        placeholder={'Descriptive topics related to the content of the plan definition'}
      />

      <SelectGroupField name="relatedArtifactType"/>

      <TextField
        required={true}
        name={'relatedArtifactName'}
        label={'Related Artifact Display'}
        placeholder={'Brief description of the related artifact'}
      />

      <TextField
        required={true}
        name={'relatedArtifactURL'}
        label={'Related Artifact URL'}
        placeholder={'Where the artifact can be accessed'}
      />

      <FormLabel component="legend">Select the recommendations to be used in the Plan Definition</FormLabel>
      {values.pddiRecommendations.length > 0 ? (
        values.pddiRecommendations.map((element, index) => {
          return (
            <CheckboxGroupField
              text={element.text}
              index={index}
              name={"planDefinitionRecommendations"}
            />
          );
        })
      ) : (
        values.recommendations.map((element, index) => {
          return (
            <CheckboxGroupField
              text={element.text}
              index={index}
              name={"planDefinitionRecommendations"}
            />
          );
        })
      )
      }

    </Form>

  );
});

export default function ArtifactPlanDefinitionModal({artifactEditing, showModal, download, closeModal}) {
  const formRef = useRef();
  const dispatch = useDispatch();
  const initialValues = useInitialValues(artifactEditing);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleSaveModal = useCallback(() => {
    formRef.current.submitForm();
  }, [formRef]);

  const validate = useCallback(values => {
    const errors = {};
    if (values.planDefinitionTopicText === '') errors.planDefinitionTopicText = 'Required';
    if (values.relatedArtifactType === '') errors.relatedArtifactType = 'Required';
    if (values.relatedArtifactName === '') errors.relatedArtifactName = 'Required';
    if (values.relatedArtifactURL === '') errors.relatedArtifactURL = 'Required';

    return errors;
  }, []);

  const handleSubmit = useCallback(
    values => {
      const newValues = {
        ...values,
      };


      dispatch(updateAndSaveArtifact(artifactEditing, {planDefinition: newValues}));
      download();
    },
    [download, dispatch, artifactEditing]
  );


  return (
    <div className="element-modal">
      <Modal
        handleCloseModal={closeModal}
        handleSaveModal={handleSaveModal}
        handleShowModal={showModal}
        maxWidth="xl"
        submitButtonText={'Download'}
        submitDisabled={submitDisabled}
        title={'Run Rule Configuration'}
      >
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={validate}
          validateOnMount
        >
          <ArtifactPlanDefinitonModalForm setSubmitDisabled={setSubmitDisabled}/>
        </Formik>
      </Modal>
    </div>
  );
}

