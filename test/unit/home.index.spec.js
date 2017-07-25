import React from 'react';
import { shallow, mount } from 'enzyme';
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
    const componentDidMountSpy = jest.spyOn(Home.prototype, 'componentDidMount');
    mount(<Home />);

    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);

    componentDidMountSpy.mockRestore();
  });
});
