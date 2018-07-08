import React from 'react';
import { shallow, mount } from 'enzyme';
import BlueprintsPage from '../../pages/blueprints/index';
import { Provider } from 'react-redux';

describe('Home page', () => {
  const mockCreateImage = {
    imageTypes: [{ name: 'qcow2', enabled: true }],
  };
  const mockState = {
    blueprints: {
      errorState: null,
      fetchingBlueprints: false,
      blueprintList: [],
    },
    sort: {
      blueprints: {
        key: 'name',
        value: 'DESC',
      },
    },
    filter: {
      blueprints: {
        filterValues: [],
        filterTypes: [
          {
            id: 'name',
            title: 'Name',
            placeholder: 'Filter by Name',
            filterType: 'text'
          }
        ],
        defaultFilterType: 'name'
      },
    },
    modals: {
      createImage: mockCreateImage,
      createBlueprint: { blueprint: {} },
    },
  };
  const mockStore = { subscribe: () => null, dispatch: () => null, state: mockState, getState: () => mockState };

  test('Home page render', () => {
    const wrapper = shallow(<BlueprintsPage store={mockStore} blueprints={mockState.blueprints.blueprintList} />);
    const nodeName = wrapper.name();
    const container = wrapper.first('div');

    expect(nodeName).toBe('BlueprintsPage');
    expect(container.length).toBe(1);
  });

  test('calls componentDidMount() lifecycle method', () => {
    const componentDidMountSpy = jest.spyOn(BlueprintsPage.prototype, 'componentDidMount');
    mount(<Provider store={mockStore}><BlueprintsPage blueprints={mockState.blueprints.blueprintList} /></Provider>);

    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);

    componentDidMountSpy.mockRestore();
  });

  test('blank slate without blueprints', () => {
    const component = mount(
      <Provider store={mockStore}><BlueprintsPage blueprints={mockState.blueprints.blueprintList} /></Provider>
    );
    const blankSlate = component.find('.blank-slate-pf');

    expect(blankSlate.text()).toContain('Create a blueprint');
  });
});
