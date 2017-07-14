import jQuery from 'jquery';

global.$ = global.jQuery = jQuery;
require('bootstrap');
global.welderApiHost = 'localhost';
global.welderApiScheme = 'HTTP';
global.welderApiRelative = false;
global.welderApiPort = 4000;

// <mockLocalStorage>
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
// </mockLocalStorage>
