import React from 'react';
import ExternalModifier from '../ExternalModifier';
import { render } from '../../../../utils/test-utils';

describe('<ExternalModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalModifier
        name="external"
        arguments={[]}
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('renders the name', () => {
    const { container } = renderComponent({ name: 'external modifier test' });

    expect(container).toHaveTextContent('external modifier test');
  });
});
