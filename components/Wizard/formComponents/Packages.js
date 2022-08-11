import React, { useState, useRef, useEffect, useCallback } from "react";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import PropTypes from "prop-types";
import {
  Bullseye,
  Button,
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
  SearchInput,
  Spinner,
  TextContent,
} from "@patternfly/react-core";
import { AngleDoubleLeftIcon, AngleLeftIcon, AngleDoubleRightIcon, AngleRightIcon } from "@patternfly/react-icons";
import api from "../../../core/api";
import * as composer from "../../../core/composer";

const Packages = ({ defaultArch, ...props }) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const [packagesSearchName, setPackagesSearchName] = useState(undefined);
  const [filterAvailable, setFilterAvailable] = useState(undefined);
  const [filterChosen, setFilterChosen] = useState(undefined);
  const [packagesAvailable, setPackagesAvailable] = useState([]);
  const [packagesAvailableFound, setPackagesAvailableFound] = useState(true);
  const [packagesAvailableLoading, setPackagesAvailableLoading] = useState(false);
  const [packagesChosen, setPackagesChosen] = useState([]);
  const [packagesChosenFound, setPackagesChosenFound] = useState(true);
  const [packagesChosenLoading, setPackagesChosenLoading] = useState(false);
  const [focus, setFocus] = useState("");
  const [totalPackagesAvailable, setTotalPackagesAvailable] = useState(undefined);
  const [packagesAvailablePage, setPackagesAvailablePage] = useState(1);
  const [packagesAvailablePerPage, setPackagesAvailablePerPage] = useState(100);
  const [additionalPackagesAvailableLoading, setAdditionalPackagesAvailableLoading] = useState(false);

  // this effect only triggers on mount
  useEffect(() => {
    const fetchPackagesChosenFromBlueprint = async () => {
      setPackagesChosenLoading(true);
      const result = await composer.depsolveBlueprint(props.blueprintName);
      const blueprint = result.blueprints[0].blueprint;
      const blueprintPackages = blueprint.packages;
      const packageNames = blueprintPackages.map((pkg) => pkg.name);
      if (packageNames?.length) {
        const packageInfo = await composer.getComponentInfo(packageNames);
        const selectedPackages = packageInfo.map((pkg) => ({ name: pkg.name, summary: pkg.summary }));
        change(
          input.name,
          selectedPackages.map((pkg) => pkg.name)
        );
        setPackagesChosenSorted(selectedPackages);
      } else {
        change(input.name, []);
      }
      setPackagesChosenLoading(false);
    };

    const fetchPackagesChosenFromFormState = async (packages) => {
      if (packages?.length) {
        setPackagesChosenLoading(true);
        const packageInfo = await composer.getComponentInfo(packages);
        const selectedPackages = packageInfo.map((pkg) => ({ name: pkg.name, summary: pkg.summary }));
        setPackagesChosenSorted(selectedPackages);
        setPackagesChosenLoading(false);
      }
    };

    const packages = getState()?.values["selected-packages"];

    if (packages) {
      // Non-initial visit to Packages step, package list is stored in form state
      fetchPackagesChosenFromFormState(packages);
    } else {
      // Initial visit to Packages step, fetch packages from the blueprint and store in form state
      fetchPackagesChosenFromBlueprint();
    }
  }, []);

  const searchResultsComparator = useCallback((searchTerm) => {
    return (a, b) => {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();

      // check exact match first
      if (a === searchTerm) {
        return -1;
      }

      if (b === searchTerm) {
        return 1;
      }

      // check for packages that start with the search term
      if (a.startsWith(searchTerm) && !b.startsWith(searchTerm)) {
        return -1;
      }

      if (b.startsWith(searchTerm) && !a.startsWith(searchTerm)) {
        return 1;
      }

      // if both (or neither) start with the search term
      // sort alphabetically
      if (a < b) {
        return -1;
      }

      if (b < a) {
        return 1;
      }

      return 0;
    };
  });

  // This comparator should match the results from the composer API call
  const alphabeticalComparator = useCallback(() => {
    return (a, b) => {
      a = a.name;
      b = b.name;

      // sort alphabetically
      if (a < b) {
        return -1;
      }

      if (b < a) {
        return 1;
      }

      return 0;
    };
  });

  const setPackagesAvailableSorted = (packageList) => {
    const sortResults = packageList.sort(alphabeticalComparator(filterAvailable));
    setPackagesAvailable(sortResults);
  };

  const setPackagesChosenSorted = (packageList) => {
    const sortResults = packageList.sort(searchResultsComparator(filterChosen));
    setPackagesChosen(sortResults);
  };

  // filter the packages by name
  const filterPackagesAvailable = (packageList) => {
    return packageList.filter((availablePackage) => {
      // returns true if no packages in the available or chosen list have the same name
      return !packagesChosen.some((chosenPackage) => availablePackage.name === chosenPackage.name);
    });
  };

  const getAllPackages = async () => {
    try {
      setPackagesAvailableLoading(true);
      const { packages, total } = await api.getPackages(
        packagesSearchName,
        packagesAvailablePage,
        packagesAvailablePerPage
      );
      setTotalPackagesAvailable(total);
      return packages;
    } catch (error) {
      console.log("Failed to fetch packages", error);
    } finally {
      setPackagesAvailableLoading(false);
    }
  };

  const fetchMorePackagesAvailable = async () => {
    const newPage = packagesAvailablePage + 1;
    setAdditionalPackagesAvailableLoading(true);
    const { packages, total } = await api.getPackages(packagesSearchName, newPage, packagesAvailablePerPage);
    setTotalPackagesAvailable(total);
    setAdditionalPackagesAvailableLoading(false);
    setPackagesAvailableSorted([...packagesAvailable, ...packages], packagesSearchName);
    setPackagesAvailablePage(newPage);
  };

  // call api to list available packages
  const handlePackagesAvailableSearch = async () => {
    setFilterAvailable(packagesSearchName);

    setPackagesAvailablePage(1);

    const packageList = await getAllPackages();
    if (packageList) {
      const packagesAvailableFiltered = filterPackagesAvailable(packageList);
      setPackagesAvailableSorted(packagesAvailableFiltered, packagesSearchName);
      setPackagesAvailableFound(!!packagesAvailableFiltered.length);
    } else {
      setPackagesAvailable([]);
      setPackagesAvailableFound(false);
    }
  };

  // filter displayed selected packages
  const handlePackagesChosenSearch = (val) => {
    let found = false;
    const filteredPackagesChosen = packagesChosen.map((pack) => {
      if (!pack.name.includes(val)) {
        pack.isHidden = true;
      } else {
        pack.isHidden = false;
        found = true;
      }

      return pack;
    });

    setFilterChosen(val);
    setPackagesChosenFound(found);
    setPackagesChosenSorted(filteredPackagesChosen);
  };

  const keydownHandler = (event) => {
    if (event.key === "Enter") {
      if (focus === "available") {
        event.stopPropagation();
        handlePackagesAvailableSearch();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler, true);

    return () => {
      document.removeEventListener("keydown", keydownHandler, true);
    };
  });

  const areFound = (filter, packageList) => {
    if (filter === undefined) {
      return true;
    }
    if (packageList.some((pack) => pack.name.includes(filter))) {
      return true;
    }
    return false;
  };

  const isHidden = (filter, pack) => !!(filter && !pack.name.includes(filter));

  const updateState = (updatedPackagesAvailable, updatedPackagesChosen) => {
    setPackagesChosenSorted(updatedPackagesChosen);
    setPackagesAvailableSorted(updatedPackagesAvailable);
    setPackagesAvailableFound(areFound(filterAvailable, updatedPackagesAvailable));
    setPackagesChosenFound(areFound(filterChosen, updatedPackagesChosen));
    // set the steps field to the current chosen packages list
    change(
      input.name,
      updatedPackagesChosen.map((pkg) => pkg.name)
    );
  };

  const moveSelectedToChosen = () => {
    const newPackagesChosen = [];

    const updatedPackagesAvailable = packagesAvailable.filter((pack) => {
      if (pack.selected) {
        pack.selected = false;
        pack.isHidden = isHidden(filterChosen, pack);
        newPackagesChosen.push(pack);
        return false;
      }

      return true;
    });

    const updatedPackagesChosen = [...newPackagesChosen, ...packagesChosen];

    updateState(updatedPackagesAvailable, updatedPackagesChosen);
  };

  const moveSelectedToAvailable = () => {
    const newPackagesAvailable = [];

    const updatedPackagesChosen = packagesChosen.filter((pack) => {
      if (pack.selected) {
        pack.selected = false;
        pack.isHidden = false;
        pack.name.includes(filterAvailable) ? newPackagesAvailable.push(pack) : null;
        return false;
      }

      return true;
    });

    const updatedPackagesAvailable = [...newPackagesAvailable, ...packagesAvailable];

    updateState(updatedPackagesAvailable, updatedPackagesChosen);
  };

  const moveAllToChosen = () => {
    const newPackagesChosen = packagesAvailable.map((pack) => {
      return {
        ...pack,
        selected: false,
        isHidden: isHidden(filterChosen, pack),
      };
    });

    const updatedPackagesAvailable = [];
    const updatedPackagesChosen = [...newPackagesChosen, ...packagesChosen];

    updateState(updatedPackagesAvailable, updatedPackagesChosen);
  };

  const moveAllToAvailable = () => {
    const updatedPackagesChosen = packagesChosen.filter((pack) => pack.isHidden);

    const newPackagesAvailable =
      filterAvailable === undefined
        ? []
        : packagesChosen
            .filter((pack) => !pack.isHidden && pack.name.includes(filterAvailable))
            .map((pack) => {
              return { ...pack, selected: false };
            });

    const updatedPackagesAvailable = [...newPackagesAvailable, ...packagesAvailable];

    updateState(updatedPackagesAvailable, updatedPackagesChosen);
  };

  const onOptionSelect = (event, index, isChosen) => {
    if (isChosen) {
      const newChosen = [...packagesChosen];
      newChosen[index].selected = !packagesChosen[index].selected;
      setPackagesChosenSorted(newChosen);
    } else {
      const newAvailable = [...packagesAvailable];
      newAvailable[index].selected = !packagesAvailable[index].selected;
      setPackagesAvailableSorted(newAvailable);
    }
  };

  const firstInputElement = useRef(null);

  useEffect(() => {
    firstInputElement.current?.focus();
  }, []);

  const handleClearAvailableSearch = () => {
    setPackagesSearchName(undefined);
    setFilterAvailable(undefined);
    setPackagesAvailable([]);
    setPackagesAvailableFound(true);
    setTotalPackagesAvailable(undefined);
    setPackagesAvailablePage(1);
    setPackagesAvailablePerPage(100);
    setAdditionalPackagesAvailableLoading(false);
  };

  const handleClearChosenSearch = () => {
    setFilterChosen(undefined);
    setPackagesChosenSorted(
      packagesChosen.map((pack) => {
        return { ...pack, isHidden: false };
      })
    );
    setPackagesChosenFound(true);
  };

  return (
    <DualListSelector>
      <DualListSelectorPane
        title="Available packages"
        searchInput={
          <SearchInput
            placeholder="Search for a package"
            data-testid="search-available-pkgs-input"
            value={packagesSearchName}
            ref={firstInputElement}
            onFocus={() => setFocus("available")}
            onBlur={() => setFocus("")}
            onChange={(val) => setPackagesSearchName(val)}
            submitSearchButtonLabel="Search button for available packages"
            onSearch={handlePackagesAvailableSearch}
            resetButtonLabel="Clear available packages search"
            onClear={handleClearAvailableSearch}
          />
        }
      >
        <DualListSelectorList data-testid="available-pkgs-list">
          {packagesAvailableLoading ? (
            <Bullseye className="pf-u-mt-md">
              <Spinner size="lg" />
            </Bullseye>
          ) : !packagesAvailable.length ? (
            <p className="pf-u-text-align-center pf-u-mt-md">
              {!packagesAvailableFound ? (
                "No packages found"
              ) : (
                <>
                  Search above to add additional
                  <br />
                  packages to your image
                </>
              )}
            </p>
          ) : (
            <>
              {packagesAvailable.map((pack, index) => {
                return !pack.isHidden ? (
                  <DualListSelectorListItem
                    data-testid={pack.name}
                    key={pack.name}
                    isSelected={pack.selected}
                    onOptionSelect={(e) => onOptionSelect(e, index, false)}
                  >
                    <TextContent>
                      <span>{pack.name}</span>
                      <small>{pack.summary}</small>
                    </TextContent>
                  </DualListSelectorListItem>
                ) : null;
              })}
              {totalPackagesAvailable > packagesAvailablePage * packagesAvailablePerPage ? (
                <DualListSelectorListItem onOptionSelect={() => ({})}>
                  <Bullseye>
                    <Button
                      variant="tertiary"
                      onClick={fetchMorePackagesAvailable}
                      isLoading={additionalPackagesAvailableLoading}
                    >
                      {additionalPackagesAvailableLoading
                        ? "Loading additional packages..."
                        : "Load additional packages"}
                    </Button>
                  </Bullseye>
                </DualListSelectorListItem>
              ) : null}
            </>
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
      <DualListSelectorControlsWrapper aria-label="Selector controls">
        <DualListSelectorControl
          isDisabled={!packagesAvailable.some((option) => option.selected)}
          onClick={() => moveSelectedToChosen()}
          aria-label="Add selected"
          tooltipContent="Add selected"
        >
          <AngleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={!packagesAvailable.length}
          onClick={() => moveAllToChosen()}
          aria-label="Add all"
          tooltipContent="Add all"
        >
          <AngleDoubleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={!packagesChosen.length || !packagesChosenFound}
          onClick={() => moveAllToAvailable()}
          aria-label="Remove all"
          tooltipContent="Remove all"
        >
          <AngleDoubleLeftIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          onClick={() => moveSelectedToAvailable()}
          isDisabled={!packagesChosen.some((option) => option.selected) || !packagesChosenFound}
          aria-label="Remove selected"
          tooltipContent="Remove selected"
        >
          <AngleLeftIcon />
        </DualListSelectorControl>
      </DualListSelectorControlsWrapper>
      <DualListSelectorPane
        title="Chosen packages"
        searchInput={
          <SearchInput
            placeholder="Search for a package"
            data-testid="search-chosen-pkgs-input"
            value={filterChosen}
            onFocus={() => setFocus("chosen")}
            onBlur={() => setFocus("")}
            onChange={(val) => handlePackagesChosenSearch(val)}
            resetButtonLabel="Clear chosen packages search"
            onClear={handleClearChosenSearch}
          />
        }
        isChosen
      >
        <DualListSelectorList data-testid="chosen-pkgs-list">
          {packagesChosenLoading ? (
            <Bullseye className="pf-u-mt-md">
              <Spinner size="lg" />
            </Bullseye>
          ) : !packagesChosen.length ? (
            <p className="pf-u-text-align-center pf-u-mt-md">No packages added</p>
          ) : !packagesChosenFound ? (
            <p className="pf-u-text-align-center pf-u-mt-md">No packages found</p>
          ) : (
            packagesChosen.map((pack, index) => {
              return !pack.isHidden ? (
                <DualListSelectorListItem
                  data-testid={pack.name}
                  key={pack.name}
                  isSelected={pack.selected}
                  onOptionSelect={(e) => onOptionSelect(e, index, true)}
                >
                  <TextContent>
                    <span className="pf-c-dual-list-selector__item-text">{pack.name}</span>
                    <small>{pack.summary}</small>
                  </TextContent>
                </DualListSelectorListItem>
              ) : null;
            })
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
    </DualListSelector>
  );
};

Packages.propTypes = {
  blueprintName: PropTypes.string,
  defaultArch: PropTypes.string,
};

export default Packages;
