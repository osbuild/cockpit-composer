import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import CreateImage from '../../components/Modal/CreateImage';

const typeList = [
  { name: 'ami', enabled: true },
  { name: 'disk-image', enabled: false },
  { name: 'fs-image', enabled: false },
  { name: 'iso', enabled: true },
  { name: 'live-ostree', enabled: false },
  { name: 'live-pxe', enabled: false },
  { name: 'oci', enabled: false },
  { name: 'ostree', enabled: true },
  { name: 'qcow2', enabled: true },
  { name: 'tar', enabled: false },
  { name: 'vagrant', enabled: false },
  { name: 'vhdx', enabled: true },
  { name: 'vmdk', enabled: false },
];

jest.mock('../../core/utils', () => ({ apiFetch: jest.fn().mockImplementation(() => {
  const p = new Promise((resolve, reject) => {
    resolve({
      types: typeList,
    });
    reject(new Error('fail'));
  });
  return p;
}),
}));

describe('CreateImage', () => {
  const createImage = (props) => {
    return shallow(
      <CreateImage {...Object.assign({ imageTypes: typeList }, props)} />
    );
  };

  test('always renders a div', () => {
    const divs = createImage().find('div');

    expect(divs.length).toBeGreaterThan(0);
  });

  describe('the rendered div', () => {
    test('contains everything else that gets rendered', () => {
      const wrapper = createImage();
      const divs = wrapper.find('div');
      const wrappingDiv = divs.first();

      expect(wrappingDiv.children()).toEqual(wrapper.children());
    });
  });

  describe('props test', () => {
    test('should render correct Blueprint name passed by props', () => {
      const fakeBlueprintName = faker.lorem.words();
      const wrapper = createImage({ blueprint: fakeBlueprintName });

      const divs = wrapper.find('.form-control-static');

      expect(divs.text()).toEqual(fakeBlueprintName);
    });

    test('setNofifications, passed by props, should be called by clicking Create button', () => {
      const setNotificationsSpy = jest.fn();
      const handleStartComposeSpy = jest.fn();

      const wrapper = createImage({
        setNotifications: setNotificationsSpy,
        handleStartCompose: handleStartComposeSpy
      });

      wrapper.find('.btn-primary').simulate('click');

      expect(setNotificationsSpy).toHaveBeenCalledTimes(1);
      expect(handleStartComposeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('state test', () => {
    test('should have a correct type render', () => {
      const wrapper = createImage();
      const renderedType = wrapper.find('label[htmlFor="textInput-modal-markup"] + div select option');

      expect(renderedType).toHaveLength(13);
    });
  });
});
