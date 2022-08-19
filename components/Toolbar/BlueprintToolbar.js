import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  Select,
  SelectOption,
  SelectVariant,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarGroup,
  Button,
  SearchInput,
} from "@patternfly/react-core";
import { SortAlphaDownIcon, SortAlphaDownAltIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  filterName: {
    id: "toolbar.blueprint.filter.name",
    defaultMessage: "Name",
  },
  filterVersion: {
    id: "toolbar.blueprint.filter.version",
    defaultMessage: "Version",
  },
  filterRelease: {
    id: "toolbar.blueprint.filter.release",
    defaultMessage: "Release",
  },
  searchAria: {
    id: "toolbar.blueprint.search.aria",
    defaultMessage: "Blueprint search input",
  },
  filterAria: {
    id: "toolbar.blueprint.filter.aria",
    defaultMessage: "Blueprint filter select",
  },
  sortAsc: {
    id: "toolbar.blueprints.sort.asc",
    defaultMessage: "Sort blueprints ascending",
  },
  sortDesc: {
    id: "toolbar.blueprints.sort.desc",
    defaultMessage: "Sort blueprints descending",
  },
});

const BlueprintToolbar = (props) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Name");
  const [isFilterSelectOpen, setIsFilterSelectOpen] = useState(false);

  const onFilterSelectToggle = (isOpen) => {
    setIsFilterSelectOpen(isOpen);
  };

  const onSelectFilter = (_, selected) => {
    setSelectedFilter(selected);
    setIsFilterSelectOpen(false);
  };

  const onInputChange = (newValue) => {
    setInputValue(newValue);

    const filter = {
      // the filter key is saved as labelled with a capital letter
      key: selectedFilter.toLowerCase(),
      value: newValue,
    };
    props.filterAddValue(filter);
  };

  const filterOptions = [
    <SelectOption key="name" value={intl.formatMessage(messages.filterName)} />,
    <SelectOption key="version" value={intl.formatMessage(messages.filterVersion)} />,
    <SelectOption key="release" value={intl.formatMessage(messages.filterRelease)} />,
  ];

  const toolbarItems = (
    <ToolbarGroup variant="filter-group" alignment={{ default: "alignLeft" }}>
      <ToolbarItem>
        <Select
          variant={SelectVariant.single}
          aria-label={intl.formatMessage(messages.filterAria)}
          onToggle={onFilterSelectToggle}
          onSelect={onSelectFilter}
          selections={selectedFilter}
          isOpen={isFilterSelectOpen}
        >
          {filterOptions}
        </Select>
      </ToolbarItem>
      <ToolbarItem variant="search-filter">
        <SearchInput
          aria-label={intl.formatMessage(messages.searchAria)}
          onChange={onInputChange}
          value={inputValue}
          onClear={() => onInputChange("")}
        />
      </ToolbarItem>
      <ToolbarItem variant="icon-button-group">
        {(props.componentsSortValue === "DESC" && (
          <Button
            variant="plain"
            aria-label={intl.formatMessage(messages.sortAsc)}
            onClick={() => {
              props.componentsSortSetValue("ASC");
              props.dependenciesSortSetValue("ASC");
            }}
          >
            <SortAlphaDownIcon />
          </Button>
        )) ||
          (props.componentsSortValue === "ASC" && (
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.sortDesc)}
              onClick={() => {
                props.componentsSortSetValue("DESC");
                props.dependenciesSortSetValue("DESC");
              }}
            >
              <SortAlphaDownAltIcon />
            </Button>
          ))}
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <Toolbar>
      <ToolbarContent>{toolbarItems}</ToolbarContent>
    </Toolbar>
  );
};

BlueprintToolbar.propTypes = {
  filterAddValue: PropTypes.func,
  componentsSortSetValue: PropTypes.func,
  componentsSortValue: PropTypes.string,
  dependenciesSortSetValue: PropTypes.func,
};

export default BlueprintToolbar;
