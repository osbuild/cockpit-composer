import React from 'react';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
import Home from '../../pages/home/index';

describe('<Home />', () => {
  test('Home page render', () => {
    const wrapper = shallow(<Home />);
    const nodeName = wrapper.name();
    const container = wrapper.first('div');

    expect(nodeName).toBe('Layout');
    expect(container.length).toBe(1);
  });

  test('calls componentDidMount() lifecycle method', () => {
    const componentDidMountSpy = spy(Home.prototype, 'componentDidMount');
    mount(<Home />);

    expect(componentDidMountSpy.calledOnce).toBe(true);

    componentDidMountSpy.restore();
  });
});
