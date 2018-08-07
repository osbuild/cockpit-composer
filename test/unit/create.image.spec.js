import React from 'react';
import {IntlProvider} from 'react-intl';
import { shallow, mount } from 'enzyme';
import faker from 'faker';
import CreateImage from '../../components/Modal/CreateImage';
import { Provider } from 'react-redux';

describe('CreateImage', () => {
  const fakeBlueprintName = faker.lorem.words();
  const mockState = {
    composes: {
      composeList: [],
      queue: [],
      queueFetched: false,
      fetchingComposes: true,
      errorState: null,
    },
    modals: {
      createImage: {
        blueprint: {
          name: fakeBlueprintName,
        },
        imageTypes: [
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
        ],
        visible: true,
      },
    },
  };
  const typeList = mockState.modals.createImage.imageTypes;
  const createImage = mockState.modals.createImage;
  const mockStore = { subscribe: () => null, dispatch: () => null, state: mockState, getState: () => mockState };

  test('always renders a div', () => {
    const wrapper = shallow(
      <CreateImage
        store={mockStore}
        blueprint={createImage.blueprint}
        imageTypes={typeList}
        warningEmpty={createImage.warningEmpty}
        warningUnsaved={createImage.warningUnsaved}
      />
    );
    const container = wrapper.first('div');

    expect(container.length).toBeGreaterThan(0);
  });

  test('contains everything else that gets rendered', () => {
    const wrapper = shallow(
      <CreateImage
        store={mockStore}
        blueprint={createImage.blueprint}
        imageTypes={typeList}
        warningEmpty={createImage.warningEmpty}
        warningUnsaved={createImage.warningUnsaved}
      />
    );
    const divs = wrapper.find('div');
    const wrappingDiv = divs.first();

    expect(wrappingDiv.children()).toEqual(wrapper.children());
  });

  test('should render correct Blueprint name passed by props', () => {
    const component = mount(
      <Provider store={mockStore}>
        <IntlProvider locale='en'>
          <CreateImage
            store={mockStore}
            blueprint={createImage.blueprint}
            imageTypes={typeList}
            warningEmpty={createImage.warningEmpty}
            warningUnsaved={createImage.warningUnsaved}
          />
        </IntlProvider>
      </Provider>
    );
    const blueprintName = component.find('.form-control-static');

    expect(blueprintName.text()).toEqual(fakeBlueprintName);
  });

  test('setNofifications, passed by props, should be called by clicking Create button', () => {
    const setNotificationsSpy = jest.fn();
    const handleStartComposeSpy = jest.fn();
    const component = mount(
      <Provider store={mockStore}>
        <IntlProvider locale='en'>
          <CreateImage
            store={mockStore}
            blueprint={createImage.blueprint}
            imageTypes={typeList}
            warningEmpty={createImage.warningEmpty}
            warningUnsaved={createImage.warningUnsaved}
            setNotifications={setNotificationsSpy}
            handleStartCompose={handleStartComposeSpy}
          />
        </IntlProvider>
      </Provider>
    );

    component.find('.btn-primary').simulate('click');

    expect(setNotificationsSpy).toHaveBeenCalledTimes(1);
    expect(handleStartComposeSpy).toHaveBeenCalledTimes(1);
  });

  test('should have a correct type render', () => {
    const component = mount(
      <Provider store={mockStore}>
        <IntlProvider locale='en'>
          <CreateImage
            store={mockStore}
            blueprint={createImage.blueprint}
            imageTypes={typeList}
          />
        </IntlProvider>
      </Provider>
    );
    const renderedType = component.find('label[htmlFor="textInput-modal-markup"] + div select option');

    expect(renderedType).toHaveLength(13);
  });

});
