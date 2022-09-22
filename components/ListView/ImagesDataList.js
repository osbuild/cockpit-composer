import React from "react";
import PropTypes from "prop-types";
import { DataList } from "@patternfly/react-core";

const ImagesDataList = (props) => (
  <DataList
    aria-label={props.ariaLabel}
    className="cc-c-tree-view"
    data-list="images"
  >
    {props.children}
  </DataList>
);

ImagesDataList.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
};

ImagesDataList.defaultProps = {
  ariaLabel: "",
  children: React.createElement("div"),
};

export default ImagesDataList;
