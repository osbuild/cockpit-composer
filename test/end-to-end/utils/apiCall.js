// Functions working with BDCS API
const request = require('request-promise-native');
const pageConfig = require('../config');

module.exports = {
  // BDCS API + Web service checking
  serviceCheck: () => {
    const bdcsOptions = {
      method: 'GET',
      uri: `${pageConfig.api.uri}${pageConfig.api.test}`,
    };
    const webOptions = {
      method: 'GET',
      uri: pageConfig.root,
    };

    return Promise.all([request(bdcsOptions), request(webOptions)]);
  },

  // Create a new blueprint
  newBlueprint: (body, done) => {
    const options = {
      method: 'POST',
      uri: `${pageConfig.api.uri}${pageConfig.api.newBlueprint}`,
      json: true,
      body,
    };

    request(options)
      .then(() => { done(); })
      .catch((error) => { done(error); });
  },

  // Delete a blueprint
  deleteBlueprint: (blueprintName, done) => {
    const options = {
      method: 'DELETE',
      uri: `${pageConfig.api.uri}${pageConfig.api.deleteBlueprint}${blueprintName}`,
      json: true,
    };

    request(options)
      .then(() => { done(); })
      .catch((error) => { done(error); });
  },

  // Get module info
  moduleInfo: (moduleName, callback, done) => {
    const options = {
      method: 'GET',
      uri: `${pageConfig.api.uri}${pageConfig.api.moduleInfo}${moduleName}`,
      json: true,
    };

    request(options)
      .then((resp) => {
        callback(resp.modules);
      })
      .catch((error) => { done(error); });
  },
};
