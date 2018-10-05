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
    .catch(err => console.log(`Error in fetchBlueprintContents promise: ${err}`));
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
        console.log('Failed to get inputs during blueprint edit', e);
        reject();
      });
  });
  return p;
}

export function fetchBlueprintNamesApi() {
  const blueprintNames = utils.apiFetch(constants.get_blueprints_list)
    .then(response => response.blueprints);
  return blueprintNames;
}

export function fetchBlueprintInfoApi(blueprintName) {
  const blueprintFetch = utils.apiFetch(constants.get_blueprints_info + blueprintName)
    .then(blueprintdata => {
      if (blueprintdata.blueprints.length > 0) {
        let blueprint = blueprintdata.blueprints[0];
        blueprint.changed = blueprintdata.changes[0].changed;
        blueprint.id = blueprintName;
        return blueprint;
      }
      return null;
    });
  return blueprintFetch;
}

export function fetchModalCreateImageTypesApi() {
  const imageTypeLabels = {
    'ami': 'Amazon Machine Image Disk (.ami)',
    'ext4-filesystem': 'Ext4 File System Image (.img)',
    'live-iso': 'Live Bootable ISO (.iso)',
    'partitioned-disk': 'Raw Partitioned Disk Image (.img)',
    'qcow2': 'QEMU QCOW2 Image (.qcow2)',
    'tar': 'TAR Archive (.tar)',
    'vhd': 'Azure Disk Image (.vhd)',
    'vmdk': 'VMware Virtual Machine Disk (.vmdk)'
  };
  const imageTypes = utils.apiFetch(constants.get_image_types)
    .then(data => data.types.map(type => {
      return Object.assign({}, type,
        {label: imageTypeLabels[type.name] || type.name}
      );
    }))
    .catch(e => console.log('Error getting component types', e));
  return imageTypes;
}

export function setBlueprintDescriptionApi(blueprint, description) {
  BlueprintApi.handleEditDescription(blueprint, description);
}

export function deleteBlueprintApi(blueprint) {
  const deletedBlueprint = Promise.all([BlueprintApi.deleteBlueprint(blueprint)])
    .then(() => blueprint);
  return deletedBlueprint;
}

export function deleteWorkspaceApi(blueprintId) {
  return utils.apiFetch(constants.delete_workspace + blueprintId, {
    method: 'DELETE',
  }, true)
  .catch (e => console.log('Error deleting workspace', e));
}

export function commitToWorkspaceApi(blueprint) {
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
      console.log('Error fetching diff', e);
      reject();
    });
  });
  return p;
}

export function depsolveComponentsApi(packages) {
  const p = new Promise((resolve, reject) => {
    const packageNames = packages.map(item => item.name);
    let dependencies = [];
    if (packageNames.length > 0) {
      utils.apiFetch(constants.get_projects_deps + packageNames)
        .then(depData => {
          // bdcs-api v0.3.0 includes module (component) and dependency NEVRAs
          // tagging all dependencies a "RPM" for now
          dependencies = BlueprintApi.setType(depData.projects, 'RPM');
          resolve(dependencies);
        })
        .catch(e => {
          console.log('getBlueprint: Error getting component and dependency metadata', e);
          reject();
        });
    } else {
      resolve(dependencies);
    }
  });
  return p;
}

export function fetchSourceInfoApi(sourceName) {
  const sourceFetch = utils.apiFetch(constants.get_sources_info + sourceName)
    .then(sourceData => {
      if (sourceData) {
        return sourceData;
      }
      return null;
    }).catch(e => {
      console.log('Error fetching sources', e);
    });
  return sourceFetch;
}

export function startComposeApi(blueprintName, composeType) {
  const requestBody = {
    blueprint_name: blueprintName,
    compose_type: composeType,
    branch: "master"
  };
  return utils.apiFetch(constants.post_compose_start, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }, true)
  .then(data => JSON.parse(data))
  .catch(e => console.log('Error starting compose', e));
}

export function cancelComposeApi(compose) {
  return utils.apiFetch(constants.cancel_compose + compose, {
    method: 'DELETE',
  }, true)
  .catch (e => console.log('Error canceling compose', e));
}

export function deleteComposeApi(compose) {
  return utils.apiFetch(constants.delete_compose + compose, {
    method: 'DELETE',
  }, true)
  .catch (e => console.log('Error deleting compose', e));
}

export function fetchImageStatusApi(uuid) {
  return utils.apiFetch(constants.get_image_status + uuid)
  .then(data => data)
  .catch(e => console.log('Error fetching image status', e));
}

export function fetchComposeQueueApi() {
  return utils.apiFetch(constants.get_compose_queue)
  .then(data => data.new.concat(data.run))
  .catch(e => console.log('Error fetching queued composes', e));
}

export function fetchComposeFinishedApi() {
  return utils.apiFetch(constants.get_compose_finished)
  .then(data => data.finished)
  .catch(e => console.log('Error fetching finished composes', e));
}

export function fetchComposeFailedApi() {
  return utils.apiFetch(constants.get_compose_failed)
  .then(data => data.failed)
  .catch(e => console.log('Error fetching failed composes', e));
}
