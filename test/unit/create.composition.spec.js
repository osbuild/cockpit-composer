import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import CreateComposition from '../../components/Modal/CreateComposition';

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

describe('CreateComposition', () => {
  let props;
  let shallowedCreateComposition;
  const createComposition = () => {
    if (!shallowedCreateComposition) {
      shallowedCreateComposition = shallow(
        <CreateComposition {...props} />
      );
    }
    return shallowedCreateComposition;
  };

  beforeEach(() => {
    props = {
      compositionTypes: typeList,
      blueprint: undefined,
      setNotifications: undefined,
    };
    shallowedCreateComposition = undefined;
  });

  test('always renders a div', () => {
    const divs = createComposition().find('div');

    expect(divs.length).toBeGreaterThan(0);
  });

  describe('the rendered div', () => {
    test('contains everything else that gets rendered', () => {
      const divs = createComposition().find('div');
      const wrappingDiv = divs.first();

      expect(wrappingDiv.children()).toEqual(createComposition().children());
    });
  });

  describe('props test', () => {
    test('should render correct Blueprint name passed by props', () => {
      const fakeBlueprintName = faker.lorem.words();
      props.blueprint = fakeBlueprintName;
      const divs = createComposition().find('.form-control-static');

      expect(divs.text()).toEqual(fakeBlueprintName);
    });

    test('setNofifications, passed by props, should be called by clicking Create button', () => {
      const setNotificationsSpy = jest.fn();
      props.setNotifications = setNotificationsSpy;

      const wrapper = createComposition();
      wrapper.find('.btn-primary').simulate('click');

      expect(setNotificationsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('state test', () => {
    test('should have a correct type render', () => {
      const wrapper = createComposition();
      const renderedType = wrapper.find('label[htmlFor="textInput-modal-markup"] + div select option');

      expect(renderedType).toHaveLength(13);
    });
  });
});
