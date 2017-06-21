import jQuery from 'jquery';

global.$ = global.jQuery = jQuery;
require('bootstrap');
global.welderApiHost = 'localhost';
global.welderApiScheme = 'HTTP';

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
