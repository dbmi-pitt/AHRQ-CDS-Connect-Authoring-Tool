import React from 'react';

/* eslint-disable jsx-a11y/label-has-for */
const LabelModifier = props => (
  <div className="label-modifier form__group">
    <label>
      {props.name}
    </label>
  </div>
);

export default LabelModifier;
