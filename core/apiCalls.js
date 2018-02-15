import constants from './constants';
import BlueprintApi from '../data/BlueprintApi';
import MetadataApi from '../data/MetadataApi';
import utils from './utils';

export function createBlueprintApi(events, blueprint) {
  BlueprintApi.handleCreateBlueprint(events, blueprint);
}

export function fetchBlueprintContentsApi(blueprintName) {
  const blueprintContents = Promise.all([BlueprintApi.getBlueprint(blueprintName)])
    .then(data => {
      const blueprint = data[0];
      blueprint.id = blueprintName;
      return blueprint;
    })
    .catch(err => console.log(`Error in fetchModalBlueprintContents promise: ${err}`));
  return blueprintContents;
}

export function fetchWorkspaceBlueprintContentsApi(blueprintRaw) {
  const blueprintContents = Promise.all([BlueprintApi.getBlueprintWorkspace(blueprintRaw)])
    .then(data => {
      const blueprint = data[0];
      return blueprint;
    })
    .catch(err => console.log(`Error in fetchModalBlueprintContents promise: ${err}`));
  return blueprintContents;
}

export function fetchBlueprintInputsApi(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  const p = new Promise((resolve, reject) => {
      // /modules/list looks like:
      // {"modules":[{"name":"389-ds-base","group_type":"rpm"},{"name":"389-ds-base-libs","group_type":"rpm"}, ...]}
    utils.apiFetch(`${constants.get_modules_list + filter}?limit=${pageSize}&offset=${page}`)
      .then(data => {
        const total = data.total;
        let components = data.modules;
        const componentNames = MetadataApi.getNames(components);
        Promise.all([
          MetadataApi.getData(constants.get_projects_info + componentNames),
        ]).then((result) => {
          components = MetadataApi.updateInputMetadata(components, result[0], true);
          components.map(i => { i.ui_type = 'RPM'; return i; }); // eslint-disable-line no-param-reassign
          resolve([components, total]);
        }).catch(e => console.log(`Error getting blueprint metadata: ${e}`));
      })
      .catch(e => {
        console.log(`Failed to get inputs during blueprint edit: ${e}`);
        reject();
      });
  });
  return p;
}

export function fetchBlueprintNamesApi() {
  const blueprintNames = utils.apiFetch(constants.get_blueprints_list)
    .then(response => response.recipes);
  return blueprintNames;
}

export function fetchBlueprintInfoApi(blueprintName) {
  const blueprintFetch = utils.apiFetch(constants.get_blueprints_info + blueprintName)
    .then(blueprintdata => {
      if (blueprintdata.recipes.length > 0) {
        let blueprint = blueprintdata.recipes[0];
        blueprint.id = blueprintName;
        return blueprint;
      }
      return null;
    });
  return blueprintFetch;
}

export function fetchModalCreateImageTypesApi() {
  const imageTypes = utils.apiFetch(constants.get_image_types)
    .then(data => data.types)
    .catch(e => console.log(`Error getting component types: ${e}`));
  return imageTypes;
}

export function setBlueprintDescriptionApi(blueprint, description) {
  BlueprintApi.handleEditDescription(description);
}

export function deleteBlueprintApi(blueprint) {
  const deletedBlueprint = Promise.all([BlueprintApi.deleteBlueprint(blueprint)])
    .then(() => blueprint);
  return deletedBlueprint;
}

export function saveToWorkspaceApi(blueprint) {
  return utils.apiFetch(constants.post_blueprints_workspace, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blueprint),
  }, true);
}

export function fetchDiffWorkspaceApi(blueprintId) {
  const p = new Promise((resolve, reject) => {
    utils.apiFetch('/api/v0/blueprints/diff/' + blueprintId + '/NEWEST/WORKSPACE')
    .then(data => {
      resolve(data);
    })
    .catch(e => {
      console.log(`Error fetching diff: ${e}`);
      reject();
    });
  });
  return p;
}
