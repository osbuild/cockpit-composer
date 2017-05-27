// Functions working with BDCS API
const request = require('request-promise-native');
const pageConfig = require('../config');

module.exports = {
  // BDCS API + Web service checking
  serviceCheck: (done) => {
    const bdcsOptions = {
      method: 'GET',
      uri: `${pageConfig.api.uri}${pageConfig.api.test}`,
    };
    const webOptions = {
      method: 'GET',
      uri: pageConfig.root,
    };

    request(bdcsOptions)
      .then(() => {
        request(webOptions)
          .then(() => { done(); })
          .catch((error) => { done(error); });
      })
      .catch((error) => { done(error); });
  },

  // BDCS API checking
  apiCheck: (done) => {
    const options = {
      method: 'GET',
      uri: `${pageConfig.api.uri}${pageConfig.api.test}`,
    };

    request(options)
      .then(() => { done(); })
      .catch((error) => { done(error); });
  },

  // Web service checking
  webCheck: (done) => {
    const options = {
      method: 'GET',
      uri: pageConfig.root,
    };

    request(options)
      .then(() => { done(); })
      .catch((error) => { done(error); });
  },

  // Create a new recipe
  newRecipe: (body, done) => {
    const options = {
      method: 'POST',
      uri: `${pageConfig.api.uri}${pageConfig.api.newRecipe}`,
      json: true,
      body,
    };

    request(options)
      .then(() => { done(); })
      .catch((error) => { done(error); });
  },

  // Delete a recipe
  deleteRecipe: (recipeName, done) => {
    const options = {
      method: 'DELETE',
      uri: `${pageConfig.api.uri}${pageConfig.api.deleteRecipe}${recipeName}`,
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
