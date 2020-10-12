import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import StyledSelect from '../../elements/StyledSelect';

const options = [
    {value: 'mg/d', label: 'mg/d'}
];

export default class Dose extends Component {
    handleChange = (selectedOption) => {
        this.props.updateAppliedModifier(this.props.index, {unit: selectedOption ? selectedOption.value : null});
    }

    render() {
        const valueId = _.uniqueId('value-');
        const unitId = _.uniqueId('unit-');

        return (
            <div className="dose">
                <label htmlFor={valueId}>
                    <input
                        id={valueId}
                        type="number"
                        name="value"
                        placeholder="value"
                        value={this.props.value || ''}
                        onChange={(event) => {
                            // eslint-disable-next-line max-len
                            this.props.updateAppliedModifier(this.props.index, {value: parseInt(event.target.value, 10)});
                        }}
                    />
                </label>

                <label htmlFor={unitId}>
                    <StyledSelect
                        className="Select"
                        name="unit"
                        aria-label="Unit Select"
                        id={unitId}
                        value={options.find(({value}) => value === this.props.unit)}
                        placeholder="select unit"
                        onChange={this.handleChange}
                        options={options}
                    />
                </label>
            </div>
        );
    }
}

Dose.propTypes = {
    index: PropTypes.number.isRequired,
    value: PropTypes.number,
    unit: PropTypes.string,
    updateAppliedModifier: PropTypes.func.isRequired
};