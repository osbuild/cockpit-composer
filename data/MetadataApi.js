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

  getMetadataComponent(component, version) {
    // the user clicked Add in the sidebar to add the component to the recipe
    // or the user clicked View Details for an available component
    // or the user clicked the name of any component

    // get metadata and dependencies for the component
    let p = new Promise((resolve, reject) => {
      Promise.all([
          this.getData(constants.get_module_info + component.name),
          this.getData(constants.get_dependencies_list + component.name)
      ]).then((data) => {
        let newcomponent = data[1].modules[0];
        newcomponent.inRecipe = true;
        newcomponent.ui_type = component.ui_type;
        newcomponent.release = data[0].projects[0].builds[0].release;
        newcomponent.arch = data[0].projects[0].builds[0].arch;
        // if the user selected a version in the details view, then use that version
        if (version === undefined || version === "") {
          newcomponent.version = data[0].projects[0].builds[0].source.version;
        } else {
          newcomponent.version = version;
        }

        // get metadata and dependencies for the dependencies
        let dependencies = this.updateRecipeDependencies(newcomponent);
        if (dependencies.length === 0) {
          let metadata = [newcomponent, []];
          resolve(metadata);
        } else {
          let dependencyNames = this.getNames(dependencies);
          Promise.all([
              this.getData(constants.get_module_info + dependencyNames),
              this.getData(constants.get_dependencies_list + dependencyNames)
            ]).then((data) => {
            dependencies = this.updateComponentMetadata(dependencies, data[0], true);
            dependencies = this.updateComponentDependencies(dependencies, data[1]);
             // arbitrarily setting ui_type based on requiredBy component for now
            dependencies.map(i => {
              if (i.projects.length > 0 ){
                i.projects.map(i => { i.ui_type = component.ui_type });
              }
            });
            let metadata = [newcomponent, dependencies];
            resolve(metadata);

          }).catch(e => console.log('Error getting component dependencies metadata: ' + e));
        }
        })
        .catch(e => {
            console.log("Error getting component: " + e);
            reject();
        });
      }
    );
    return p;
  }

  updateComponentMetadata(components, data, getVersion) {
    // getVersion = false when the version number is already known
    data.projects.map(i => {
      let index = components.map(component => {return component.name}).indexOf(i.name);
      if (getVersion) {components[index].version = i.builds[0].source.version;}
      components[index].release = i.builds[0].release;
      components[index].arch = i.builds[0].arch;
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
