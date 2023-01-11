import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import {
  Button,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarGroup,
  SearchInput,
} from "@patternfly/react-core";
import {
  SortAlphaDownIcon,
  SortAlphaDownAltIcon,
} from "@patternfly/react-icons";

const BlueprintToolbar = (props) => {
  const intl = useIntl();
  const onInputChange = (newValue) => props.setFilterValue(newValue);
  const setSortDirection = () =>
    props.setIsSortAscending(!props.isSortAscending);

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup alignment={{ default: "alignLeft" }}>
          <ToolbarItem variant="search-filter">
            <SearchInput
              aria-label={intl.formatMessage({
                defaultMessage: "Blueprints search input",
              })}
              onChange={onInputChange}
              value={props.filterValue}
              onClear={() => onInputChange("")}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="plain"
              onClick={setSortDirection}
              id="button-sort-blueprints"
            >
              {props.isSortAscending ? (
                <SortAlphaDownIcon />
              ) : (
                <SortAlphaDownAltIcon />
              )}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

BlueprintToolbar.propTypes = {
  blueprintNames: PropTypes.arrayOf(PropTypes.string),
  filterValue: PropTypes.string,
  setFilterValue: PropTypes.func,
  isSortAscending: PropTypes.bool,
  setIsSortAscending: PropTypes.func,
};

export default BlueprintToolbar;
