import React from 'react';
import { shallow, mount } from 'enzyme';
import RecipesPage from '../../pages/recipes/index';
import { Provider } from 'react-redux';

describe('Home page', () => {
  const mockCreateComposition = {
    compositionTypes: [{ name: 'qcow2', enabled: true }],
  };
  const mockState = {
    recipes: {
      present: [],
    },
    sort: { recipes: [] },
    modals: {
      createComposition: mockCreateComposition,
      createRecipe: { recipe: {} },
    },
  };
  const mockStore = { subscribe: () => null, dispatch: () => null, state: mockState, getState: () => mockState };

  test('Home page render', () => {
    const wrapper = shallow(<RecipesPage store={mockStore} recipes={mockState.recipes} />);
    const nodeName = wrapper.name();
    const container = wrapper.first('div');

    expect(nodeName).toBe('RecipesPage');
    expect(container.length).toBe(1);
  });

  test('calls componentDidMount() lifecycle method', () => {
    const componentDidMountSpy = jest.spyOn(RecipesPage.prototype, 'componentDidMount');
    mount(<Provider store={mockStore}><RecipesPage recipes={mockState.recipes} /></Provider>);

    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);

    componentDidMountSpy.mockRestore();
  });

  test('blank slate without recipes', () => {
    const component = mount(<Provider store={mockStore}><RecipesPage recipes={mockState.recipes} /></Provider>);
    const blankSlate = component.find('.blank-slate-pf');

    expect(blankSlate.text()).toContain('Create a recipe');
  });
});
