import jQuery from "jquery";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-15";

Enzyme.configure({ adapter: new Adapter() });

global.$ = global.jQuery = jQuery;
require("bootstrap");

global.welderApiHost = "localhost";
global.welderApiScheme = "HTTP";
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
    }
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock
});
// </mockLocalStorage>
