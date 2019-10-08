import React from "react";
import PropTypes from "prop-types";
import { DataList } from "@patternfly/react-core";
import ComponentsDataListItem from "./ComponentsDataListItem";

const DependencyListView = props => {
  const {
    ariaLabel,
    listItems,
    handleRemoveComponent,
    handleComponentDetails,
    noEditComponent,
    fetchDetails,
    componentDetailsParent
  } = props;
  return (
    <DataList aria-label={ariaLabel} className="cc-m-nowrap-on-xl">
      {listItems.map(listItem => (
        <ComponentsDataListItem
          listItem={listItem}
          key={listItem.name}
          handleRemoveComponent={handleRemoveComponent}
          handleComponentDetails={handleComponentDetails}
          noEditComponent={noEditComponent}
          fetchDetails={fetchDetails}
          componentDetailsParent={componentDetailsParent}
        />
      ))}
    </DataList>
  );
};

DependencyListView.propTypes = {
  listItems: PropTypes.arrayOf(PropTypes.object),
  noEditComponent: PropTypes.bool,
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  componentDetailsParent: PropTypes.shape({
    active: PropTypes.bool,
    group_type: PropTypes.string,
    inBlueprint: PropTypes.bool,
    name: PropTypes.string,
    release: PropTypes.string,
    releaseSelected: PropTypes.string,
    summary: PropTypes.string,
    ui_type: PropTypes.string,
    userSelected: PropTypes.bool,
    version: PropTypes.string,
    versionSelected: PropTypes.string
  }),
  fetchDetails: PropTypes.func,
  ariaLabel: PropTypes.string
};

DependencyListView.defaultProps = {
  listItems: [],
  noEditComponent: true,
  handleComponentDetails: function() {},
  handleRemoveComponent: function() {},
  componentDetailsParent: {},
  fetchDetails: function() {},
  ariaLabel: ""
};

export default DependencyListView;
