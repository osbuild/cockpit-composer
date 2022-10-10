import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem,
  Pagination,
} from "@patternfly/react-core";

const PackagesToolbar = (props) => {
  const intl = useIntl();

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup alignment={{ default: "alignLeft" }}>
          <ToolbarItem variant="search-filter">
            <SearchInput
              aria-label={intl.formatMessage({
                defaultMessage: "Blueprints search input",
              })}
              onChange={props.onInputChange}
              value={props.inputValue}
              onClear={() => props.onInputChange("")}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <ToggleGroup
              aria-label={intl.formatMessage({
                defaultMessage: "Toggle which package list to show",
              })}
            >
              <ToggleGroupItem
                text={intl.formatMessage({
                  defaultMessage: "Additional",
                })}
                buttonId="additional"
                isSelected={props.toggle === "additional"}
                onChange={props.onToggleClick}
              />
              <ToggleGroupItem
                text={intl.formatMessage({
                  defaultMessage: "All",
                })}
                buttonId="all"
                isSelected={props.toggle === "all"}
                onChange={props.onToggleClick}
              />
            </ToggleGroup>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant="pagination">
          <Pagination
            itemCount={props.itemCount}
            perPage={props.perPage}
            page={props.page}
            onSetPage={props.onSetPage}
            onPerPageSelect={props.onPerPageSelect}
            variant="top"
            isCompact
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

PackagesToolbar.propTypes = {
  blueprintNames: PropTypes.arrayOf(PropTypes.string),
  filterValue: PropTypes.string,
  setFilterValue: PropTypes.func,
  isSortAscending: PropTypes.bool,
  setIsSortAscending: PropTypes.func,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.string,
  onToggleClick: PropTypes.func,
  toggle: PropTypes.string,
  itemCount: PropTypes.number,
  perPage: PropTypes.number,
  page: PropTypes.number,
  onSetPage: PropTypes.func,
  onPerPageSelect: PropTypes.func,
};

export default PackagesToolbar;
