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
import {
  AngleDoubleLeftIcon,
  AngleLeftIcon,
  AngleDoubleRightIcon,
  AngleRightIcon,
} from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import * as api from "../../api";

const messages = defineMessages({
  availablePackages: {
    id: "wizard.packages.availablePackages",
    defaultMessage: "Available packages",
  },
  chosenPackages: {
    id: "wizard.packages.chosenPackages",
    defaultMessage: "Chosen packages",
  },
  searchPackages: {
    id: "wizard.packages.searchPackages",
    defaultMessage: "Search for a package",
  },
  noPackagesAdded: {
    id: "wizard.packages.noPackagesAdded",
    defaultMessage: "No packages added",
  },
  availablePackagesSearch: {
    id: "wizard.packages.availablePackagesSearch",
    defaultMessage: "Search button for available packages",
  },
  clearAvailablePackagesSearch: {
    id: "wizard.packages.clearAvailablePackagesSearch",
    defaultMessage: "Clear available packages search",
  },
  noPackagesFound: {
    id: "wizard.packages.noPackagesFound",
    defaultMessage: "No packages found",
  },
  searchAbove: {
    id: "wizard.packages.searchAbove",
    defaultMessage: "Search above to add additional{br}packages to your image",
  },
  loadingAdditionalPackages: {
    id: "wizard.packages.loadingAdditionalPackages",
    defaultMessage: "Loading additional packages...",
  },
  loadAdditionalPackages: {
    id: "wizard.packages.loadAdditionalPackages",
    defaultMessage: "Load additional packages",
  },
  selectorControls: {
    id: "wizard.packages.selectorControls",
    defaultMessage: "Selector controls",
  },
  addSelected: {
    id: "wizard.packages.addSelected",
    defaultMessage: "Add selected",
  },
  addAll: {
    id: "wizard.packages.addAll",
    defaultMessage: "Add all",
  },
  removeAll: {
    id: "wizard.packages.removeAll",
    defaultMessage: "Remove all",
  },
  removeSelected: {
    id: "wizard.packages.removeSelected",
    defaultMessage: "Remove selected",
  },
  clearChosenPackagesSearch: {
    id: "wizard.packages.clearChosenPackagesSearch",
    defaultMessage: "Clear chosen packages search",
  },
});

const Packages = ({ ...props }) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const intl = useIntl();
  const [packagesSearchName, setPackagesSearchName] = useState(undefined);
  const [filterAvailable, setFilterAvailable] = useState(undefined);
  const [filterChosen, setFilterChosen] = useState(undefined);
  const [packagesAvailable, setPackagesAvailable] = useState([]);
  const [packagesAvailableFound, setPackagesAvailableFound] = useState(true);
  const [packagesAvailableLoading, setPackagesAvailableLoading] =
    useState(false);
  const [packagesChosen, setPackagesChosen] = useState([]);
  const [packagesChosenFound, setPackagesChosenFound] = useState(true);
  const [packagesChosenLoading, setPackagesChosenLoading] = useState(false);
  const [focus, setFocus] = useState("");
  const [totalPackagesAvailable, setTotalPackagesAvailable] =
    useState(undefined);
  const [packagesAvailablePage, setPackagesAvailablePage] = useState(1);
  const [packagesAvailablePerPage, setPackagesAvailablePerPage] = useState(100);
  const [
    additionalPackagesAvailableLoading,
    setAdditionalPackagesAvailableLoading,
  ] = useState(false);

  // this effect only triggers on mount
  useEffect(() => {
    const fetchPackagesChosen = async (packages) => {
      setPackagesChosenLoading(true);
      const packageInfo = await api.getComponentInfo(packages);
      const selectedPackages = packageInfo.map((pkg) => ({
        name: pkg.name,
        summary: pkg.summary,
      }));
      setPackagesChosenSorted(selectedPackages);
      setPackagesChosenLoading(false);
    };

    const packages = getState()?.values["selected-packages"];

    packages?.length && fetchPackagesChosen(packages);
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
    const sortResults = packageList.sort(
      alphabeticalComparator(filterAvailable)
    );
    setPackagesAvailable(sortResults);
  };

  const setPackagesChosenSorted = (packageList) => {
    const sortResults = packageList.sort(searchResultsComparator(filterChosen));
    setPackagesChosen(sortResults);
  };

  // filter the packages by name
  const filterPackagesAvailable = (packageList) => {
    // Get the selected/chosen packages from the form state rather than packagesChosen
    // because setPackagesChosen has an async function call, and therefore packagesChosen
    // may not be ready yet.
    const selectedPackages = getState()?.values["selected-packages"];

    return packageList.filter((availablePackage) => {
      // returns true if no packages in the available or chosen list have the same name
      return selectedPackages
        ? !selectedPackages.some(
            (selectedPackage) => availablePackage.name === selectedPackage
          )
        : true;
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
    const { packages, total } = await api.getPackages(
      packagesSearchName,
      newPage,
      packagesAvailablePerPage
    );
    setTotalPackagesAvailable(total);
    setAdditionalPackagesAvailableLoading(false);
    setPackagesAvailableSorted(
      [...packagesAvailable, ...packages],
      packagesSearchName
    );
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
    setPackagesAvailableFound(
      areFound(filterAvailable, updatedPackagesAvailable)
    );
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
        pack.name.includes(filterAvailable)
          ? newPackagesAvailable.push(pack)
          : null;
        return false;
      }

      return true;
    });

    const updatedPackagesAvailable = [
      ...newPackagesAvailable,
      ...packagesAvailable,
    ];

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
    const updatedPackagesChosen = packagesChosen.filter(
      (pack) => pack.isHidden
    );

    const newPackagesAvailable =
      filterAvailable === undefined
        ? []
        : packagesChosen
            .filter(
              (pack) => !pack.isHidden && pack.name.includes(filterAvailable)
            )
            .map((pack) => {
              return { ...pack, selected: false };
            });

    const updatedPackagesAvailable = [
      ...newPackagesAvailable,
      ...packagesAvailable,
    ];

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
        title={intl.formatMessage(messages.availablePackages)}
        searchInput={
          <SearchInput
            placeholder={intl.formatMessage(messages.searchPackages)}
            data-testid="search-available-pkgs-input"
            value={packagesSearchName}
            ref={firstInputElement}
            onFocus={() => setFocus("available")}
            onBlur={() => setFocus("")}
            onChange={(val) => setPackagesSearchName(val)}
            submitSearchButtonLabel={intl.formatMessage(
              messages.availablePackagesSearch
            )}
            onSearch={handlePackagesAvailableSearch}
            resetButtonLabel={intl.formatMessage(
              messages.clearAvailablePackagesSearch
            )}
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
                intl.formatMessage(messages.noPackagesFound)
              ) : (
                <FormattedMessage
                  {...messages.searchAbove}
                  values={{ br: <br /> }}
                />
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
              {totalPackagesAvailable >
              packagesAvailablePage * packagesAvailablePerPage ? (
                <DualListSelectorListItem onOptionSelect={() => ({})}>
                  <Bullseye>
                    <Button
                      variant="tertiary"
                      onClick={fetchMorePackagesAvailable}
                      isLoading={additionalPackagesAvailableLoading}
                    >
                      {additionalPackagesAvailableLoading
                        ? intl.formatMessage(messages.loadingAdditionalPackages)
                        : intl.formatMessage(messages.loadAdditionalPackages)}
                    </Button>
                  </Bullseye>
                </DualListSelectorListItem>
              ) : null}
            </>
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
      <DualListSelectorControlsWrapper
        aria-label={intl.formatMessage(messages.selectorControls)}
      >
        <DualListSelectorControl
          isDisabled={!packagesAvailable.some((option) => option.selected)}
          onClick={() => moveSelectedToChosen()}
          aria-label={intl.formatMessage(messages.addSelected)}
          tooltipContent={intl.formatMessage(messages.addSelected)}
        >
          <AngleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={!packagesAvailable.length}
          onClick={() => moveAllToChosen()}
          aria-label={intl.formatMessage(messages.addAll)}
          tooltipContent={intl.formatMessage(messages.addAll)}
        >
          <AngleDoubleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={!packagesChosen.length || !packagesChosenFound}
          onClick={() => moveAllToAvailable()}
          aria-label={intl.formatMessage(messages.removeAll)}
          tooltipContent={intl.formatMessage(messages.removeAll)}
        >
          <AngleDoubleLeftIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          onClick={() => moveSelectedToAvailable()}
          isDisabled={
            !packagesChosen.some((option) => option.selected) ||
            !packagesChosenFound
          }
          aria-label={intl.formatMessage(messages.removeSelected)}
          tooltipContent={intl.formatMessage(messages.removeSelected)}
        >
          <AngleLeftIcon />
        </DualListSelectorControl>
      </DualListSelectorControlsWrapper>
      <DualListSelectorPane
        title={intl.formatMessage(messages.chosenPackages)}
        searchInput={
          <SearchInput
            placeholder={intl.formatMessage(messages.searchPackages)}
            data-testid="search-chosen-pkgs-input"
            value={filterChosen}
            onFocus={() => setFocus("chosen")}
            onBlur={() => setFocus("")}
            onChange={(val) => handlePackagesChosenSearch(val)}
            resetButtonLabel={intl.formatMessage(
              messages.clearChosenPackagesSearch
            )}
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
            <p className="pf-u-text-align-center pf-u-mt-md">
              No packages added
            </p>
          ) : !packagesChosenFound ? (
            <p className="pf-u-text-align-center pf-u-mt-md">
              No packages found
            </p>
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
                    <span className="pf-c-dual-list-selector__item-text">
                      {pack.name}
                    </span>
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
  defaultArch: PropTypes.string,
};

export default Packages;
