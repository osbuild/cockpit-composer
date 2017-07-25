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
      recipe: undefined,
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
    test('should render correct Recipe name passed by props', () => {
      const fakeRecipeName = faker.lorem.words();
      props.recipe = fakeRecipeName;
      const divs = createComposition().find('.form-control-static');

      expect(divs.text()).toEqual(fakeRecipeName);
    });

    test('setNofifications, passed by props, should be called by clicking Create button', () => {
      const setNotificationsSpy = jest.fn();
      props.setNotifications = setNotificationsSpy;

      const wrapper = createComposition();
      wrapper.find('.btn-primary').simulate('click');

      expect(setNotificationsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('lifecyle test', () => {
    test('calls componentWillMount() lifecycle method', () => {
      const componentWillMountSpy = jest.spyOn(CreateComposition.prototype, 'componentWillMount');
      createComposition();

      expect(componentWillMountSpy).toHaveBeenCalledTimes(1);

      componentWillMountSpy.mockRestore();
    });
  });

  describe('class property function test', () => {
    test('calls getComptypes() method', () => {
      const getComptypesSpy = jest.spyOn(CreateComposition.prototype, 'getComptypes');
      createComposition();

      expect(getComptypesSpy).toHaveBeenCalledTimes(1);

      getComptypesSpy.mockRestore();
    });
  });

  describe('state test', () => {
    test('should have a correct type render', () => {
      const wrapper = createComposition();
      wrapper.setState({ comptypes: typeList });
      const renderedType = wrapper.find('label[htmlFor="textInput-modal-markup"] + div select option');

      expect(renderedType).toHaveLength(13);
    });
  });
});
