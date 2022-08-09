import React, { useState } from "react";
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

const BlueprintToolbar = (props) => {
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

  // TODO: translate
  const filterOptions = [
    <SelectOption key="name" value="Name" />,
    <SelectOption key="version" value="Version" />,
    <SelectOption key="release" value="Release" />,
  ];

  const toolbarItems = (
    <ToolbarGroup variant="filter-group" alignment={{ default: "alignLeft" }}>
      <ToolbarItem>
        <Select
          variant={SelectVariant.single}
          aria-label="Select Input"
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
          aria-label="blueprints search input"
          onChange={onInputChange}
          value={inputValue}
          onClear={() => onInputChange("")}
        />
      </ToolbarItem>
      <ToolbarItem variant="icon-button-group">
        {(props.componentsSortValue === "DESC" && (
          <Button
            variant="plain"
            aria-label="sort ascending"
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
              aria-label="sort descending"
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
