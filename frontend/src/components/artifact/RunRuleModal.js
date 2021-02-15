import React, {memo, useState, useCallback, useEffect, useRef} from 'react';

import {Modal} from 'components/elements';
import {DateRangeField, SelectField, TextField} from 'components/fields';
import {useDispatch} from 'react-redux';

import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl
} from "@material-ui/core";
import {Form, Formik, useField, useFormikContext} from "formik";
import {formatISO} from "date-fns";
import {updateAndSaveArtifact} from "../../actions/artifacts";


const initialValues =
  {
    fhirServer: 'http://3.21.182.6/omoponfhir-stu3/fhir',
    accessToken: '12345',
    scope: 'launch profile openid online_access user/*.*',
    expiresIn: '300',
    subject: 'patient',
    effectivePeriod: {
      start: new Date(),
      end: new Date()
    },
    fhirVersion: '3.0.0',
    radio: "0"
  };

const fhirOptions = [
  {value: '1.0.1', label: 'FHIR® DSTU2', id: 'dstu2'},
  {value: '3.0.0', label: 'FHIR® STU3', id: 'stu3'},
  {value: '4.0.0', label: 'FHIR® R4', id: 'r4'},
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
        label={"FHIR Version"}
        onChange={val => {
          setFieldValue(field.name, val);
        }}
        options={fhirOptions}/>
    </div>
  );
};

export const RadioGroupField = ({...props}) => {
  const {setFieldValue} = useFormikContext();
  const [field] = useField(props);
  return (
    <RadioGroup
      {...field}
      {...props}
      aria-label={"FHIR Server Configuration"}
      value={field.value}
      name={field.name}
      onChange={event => {
        setFieldValue(field.name, event.target.value);

        if (event.target.name === 'default') {
          setFieldValue('fhirServer', 'http://3.21.182.6/omoponfhir-stu3/fhir');
          setFieldValue('accessToken', '12345');
          setFieldValue('scope', 'launch profile openid online_access user/*.*');
          setFieldValue('expiresIn', '300');
          setFieldValue('subject', '');
        } else {
          setFieldValue('fhirServer', '');
          setFieldValue('accessToken', '');
          setFieldValue('scope', '');
          setFieldValue('expiresIn', '');
          setFieldValue('subject', '');
        }
      }}>
      <FormControlLabel control={<Radio/>} name={'default'}
                        label={"Run rule using our FHIR server and synthetic data"}
                        value={"0"}/>
      <FormControlLabel control={<Radio/>} name={'custom'}
                        label={"Specify your own FHIR server configuration"}
                        value={"1"}/>
    </RadioGroup>
  );
};

function dateToStringTransform(value) {
  if (value == null) return value;
  return formatISO(value);
}

const RunRuleModalForm = memo(({setSubmitDisabled}) => {
  const {errors, values, isValid} = useFormikContext();

  useEffect(() => setSubmitDisabled(!isValid), [isValid, setSubmitDisabled]);

  return (
    <Form>
      <FormLabel component="legend">FHIR server configuration</FormLabel>

      <FormControl component="fieldset">
        <RadioGroupField name="radio"/>
      </FormControl>

      {values.radio > 0 ? (
        <div>
          <TextField
            required={true}
            name={'fhirServer'}
            label={'FHIR Server'}
            placeholder={'The base URL of the CDS Client\'s FHIR server'}
          />

          <TextField
            required={true}
            name={'accessToken'}
            label={'Access Token'}
            placeholder={'The OAuth 2.0 access token that provides access to the FHIR server'}
          />

          <TextField
            required={true}
            name={'scope'}
            label={'Scope'}
            placeholder={'The scopes the access token grants the CDS Service'}
          />

          <TextField
            required={true}
            name={'expiresIn'}
            label={'Expires In'}
            placeholder={'The lifetime in seconds of the access token.'}
          />

          <TextField
            required={true}
            name={'subject'}
            label={'Subject'}
            placeholder={'The OAuth 2.0 client identifier of the CDS Service'}
          />

          <SelectGroupField name="fhirVersion"/>
        </div>
      ) : (
        null
      )}

      <DateRangeField
        name={"effectivePeriod"}
        label={"Run rule over period"}
        helperText={errors.effectivePeriod}
      />
    </Form>
  );
});

export default function RunRuleModal({artifactEditing, showModal, showNextModal, closeModal}) {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleSaveModal = useCallback(() => {
    formRef.current.submitForm();
  }, [formRef]);

  const validate = useCallback(values => {
    const errors = {};
    if (values.fhirServer === '') errors.fhirServer = 'Required';
    if (values.accessToken === '') errors.accessToken = 'Required';
    if (values.scope === '') errors.scope = 'Required';
    if (values.expiresIn === '') errors.expiresIn = 'Required';
    if (values.subject === '') errors.subject = 'Required';

    if (dateToStringTransform(values.effectivePeriod.start) > dateToStringTransform(values.effectivePeriod.end)) {
      errors.effectivePeriod = 'Start date must be before end date';

    }

    return errors;
  }, []);

  const handleSubmit = useCallback(
    values => {
      const newValues = {
        ...values,
        startDate: dateToStringTransform(values.effectivePeriod.start),
        endDate: dateToStringTransform(values.effectivePeriod.end)
      };


      dispatch(updateAndSaveArtifact(artifactEditing, {fhirServer: newValues}));
      showNextModal();
    },
    [showNextModal, dispatch, artifactEditing]
  );


  return (
    <div className="element-modal">
      <Modal
        handleCloseModal={closeModal}
        handleSaveModal={handleSaveModal}
        handleShowModal={showModal}
        maxWidth="xl"
        submitButtonText={'Next'}
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
          <RunRuleModalForm setSubmitDisabled={setSubmitDisabled}/>
        </Formik>
      </Modal>
    </div>
  );
}
