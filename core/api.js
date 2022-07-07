import * as composer from "./composer";

function flattenInputs(response) {
  // duplicate inputs exist when more than one build is available
  // flatten duplicate inputs to a single item
  const previousInputs = {};
  const flattened = response.filter((item) => {
    const build = {
      version: item.builds[0].source.version,
      release: item.builds[0].release,
    };
    if (previousInputs.hasOwnProperty(item.name)) {
      // update the previousInput object with this item"s version/release
      // to make the default version/release the latest
      previousInputs[item.name] = Object.assign(previousInputs[item.name], build);
      // and remove this item from the list
      return false;
    }
    delete item.builds;
    item = Object.assign(item, build);

    previousInputs[item.name] = item;
    return true;
  });
  return flattened;
}

async function getPackages(filter, selectedInputPage, pageSize) {
  try {
    const wildcardsUsed = filter.includes("*");
    const regex = / +|, +/g;
    let filterValue = filter.replace(regex, ",");
    const regexStrip = /(^,+)|(,+$)/g;
    filterValue = filterValue.replace(regexStrip, "");
    filterValue = wildcardsUsed ? filterValue : `*${filterValue}*`.replace(/,/g, "*,*");
    // page is displayed in UI starting from 1 but api starts from 0
    const pageIndex = selectedInputPage - 1;
    const response = await composer.listModules(filterValue, pageIndex, pageSize);
    const inputNames = response.modules.map((input) => input.name).join(",");
    const inputs = await composer.getComponentInfo(inputNames);
    const packages = flattenInputs(inputs).map((input) => {
      const inputData = {
        name: input.name,
        summary: input.summary,
      };
      return inputData;
    });
    return { packages, total: response.total };
  } catch (error) {
    console.log("Error in fetchInputsSaga", error);
  }
}

export default { getPackages };
