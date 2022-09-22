import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarGroup,
  Button,
  SearchInput,
} from "@patternfly/react-core";
import {
  SortAlphaDownIcon,
  SortAlphaDownAltIcon,
} from "@patternfly/react-icons";

import CreateBlueprint from "../Modal/CreateBlueprint";
import ManageSources from "../Modal/ManageSources";

const messages = defineMessages({
  searchAria: {
    id: "toolbar.blueprints.search.aria",
    defaultMessage: "Blueprints search input",
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

const BlueprintsToolbar = (props) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState("");

  const onInputChange = (newValue) => {
    setInputValue(newValue);

    const filter = {
      key: "name",
      value: newValue,
    };
    props.filterAddValue(filter);
  };

  const toolbarItems = (
    <>
      <ToolbarGroup alignment={{ default: "alignLeft" }}>
        <ToolbarItem variant="search-filter">
          <SearchInput
            aria-label="Blueprints search input"
            onChange={onInputChange}
            value={inputValue}
            onClear={() => onInputChange("")}
          />
        </ToolbarItem>
        <ToolbarItem variant="icon-button-group">
          {(props.sortValue === "DESC" && (
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.sortAsc)}
              onClick={() => props.sortSetValue("ASC")}
            >
              <SortAlphaDownIcon />
            </Button>
          )) ||
            (props.sortValue === "ASC" && (
              <Button
                variant="plain"
                aria-label={intl.formatMessage(messages.sortDesc)}
                onClick={() => props.sortSetValue("DESC")}
              >
                <SortAlphaDownAltIcon />
              </Button>
            ))}
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup
        variant="button-group"
        alignment={{ default: "alignRight" }}
      >
        <ToolbarItem>
          <CreateBlueprint
            blueprintNames={props.blueprintNames}
            disabled={props.errorState}
          />
        </ToolbarItem>
        <ToolbarItem>
          <ManageSources
            manageSources={props.manageSources}
            disabled={props.errorState}
          />
        </ToolbarItem>
      </ToolbarGroup>
    </>
  );

  return (
    <Toolbar>
      <ToolbarContent>{toolbarItems}</ToolbarContent>
    </Toolbar>
  );
};

BlueprintsToolbar.propTypes = {
  blueprintNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortSetValue: PropTypes.func,
  errorState: PropTypes.bool,
  sortValue: PropTypes.string,
  manageSources: PropTypes.shape({
    fetchingSources: PropTypes.bool,
    sources: PropTypes.objectOf(PropTypes.object),
    error: PropTypes.object,
  }),
  filterAddValue: PropTypes.func,
};

export default BlueprintsToolbar;
