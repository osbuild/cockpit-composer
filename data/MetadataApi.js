import constants from '../core/constants';

class MetadataApi {

  getData(api) {
    let p = new Promise((resolve, reject) => {
        fetch(api)
        .then(r => r.json())
        .then(data => {
          resolve(data);
        })
        .catch(e => {
            console.log("Failed to get " + api + e);
        });
    });
    return p;
  }

  getNames(components) {
    let names = "";
    components.map(i => {
      names = names === "" ? i.name : names + "," + i.name;
    });
    return names;
  }

  getAvailableBuilds(component) {
    // the user clicked Edit when viewing details of a Recipe component
    // a list of available builds are returned for displaying in the edit form
    let p = new Promise((resolve, reject) => {
      Promise.all([
        this.getData(constants.get_projects_info + component.name),
      ]).then((data) => {
        let builds = data[0].projects[0].builds;
        resolve(builds);
      })
      .catch(e => {
        console.log("Error getting component builds: " + e);
        reject();
      });
    });
    return p;
  }

  getMetadataComponent(component, build) {
    // if the user clicked View Details for an available component
    //    then build = "all" and all available builds are returned
    // if the user clicked Add in the sidebar to add the component to the recipe
    //    of if the user clicked the name of any component not available to add
    //    then build = ""

    // get metadata and dependencies for the component
    // bdcs-api v0.3.0 /modules/info looks like:
    // {"modules":[{"name":NAME, ..., "dependencies":[NEVRA, ...]}, ...]}
    let p = new Promise((resolve, reject) => {
      Promise.all([
        this.getData(constants.get_projects_info + component.name),
        this.getData(constants.get_modules_info + component.name)
      ]).then((data) => {
        if ((data[0].projects.length == 0) || (data[1].modules.length == 0)) {
            console.log("Error fetching metadata for " + component.name);
            return;
        }

        let componentData = data[1].modules[0];
        componentData.inRecipe = component.inRecipe;
        componentData.ui_type = component.ui_type;

        // The component's depsolved version may be in .dependencies
        let compNEVRA = componentData.dependencies.filter((obj) => obj.name === component.name);
        if (compNEVRA.length > 0) {
            compNEVRA = compNEVRA[0];
        } else {
            // Missing deps, construct a NEVRA from the build data
            let firstBuild = data[0].projects[0].builds[0];
            compNEVRA = {
                name: component.name,
                version: firstBuild.source.version,
                release: firstBuild.release,
                arch: firstBuild.arch,
                epoch: firstBuild.epoch
            };
        }

        componentData.version = compNEVRA.version;
        componentData.release = compNEVRA.release;
        componentData.arch = compNEVRA.arch;

        // if the user clicked View Details for an available component
        // then get the list of available builds
        let metadata = (build === "all") ? [componentData, data[0].projects[0].builds] : [componentData, []];
        resolve(metadata);
      }).catch(e => {
          console.log("getMetadataComponent: Error getting component: " + e);
          reject();
      });
    });
    return p;
  }

  updateComponentMetadata(components, data) {
    // for the list of components, add the data for additional metadata and return
    // getVersion = false when the version number is already known as in a recipe component
    // TODO - getVersion will most likely become obsolete when the api is refactored
    data.projects.map(i => {
      let index = components.map(component => {return component.name}).indexOf(i.name);
      components[index].summary = i.summary;
    });
    return components;
  }

  updateComponentDependencies (components, data) {
    data.modules.map(i => {
      let index = components.map(component => {return component.name}).indexOf(i.name);
      components[index].projects = i.projects;
    });
    return components;
  }

  updateRecipeDependencies(component) {
    if (component.projects.length > 0) {
      component.projects.map(i => {
        i.requiredBy = component.name;
        i.inRecipe = true;
        i.ui_type = component.ui_type;
      });
    };
    return component.projects;
  }

}

export default new MetadataApi();
