import React from "react";
import PropTypes from "prop-types";
import { Gallery } from "@patternfly/react-core";
import { SourceCardModal } from "../Modal/SourceCardModal";

const SourcesTab = (props) => {
  return (
    <Gallery
      className="pf-u-p-lg"
      hasGutter
      maxWidths={{
        md: "280px",
        lg: "320px",
        "2xl": "400px",
      }}
    >
      {props.sources?.map((source) => (
        <SourceCardModal
          key={source.name}
          source={source}
          sourceNames={props.sourceNames}
          isEditable={!source.system}
        />
      ))}
      <SourceCardModal sourceNames={props.sourceNames} isAdd />
    </Gallery>
  );
};

SourcesTab.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.object),
  sourceNames: PropTypes.arrayOf(PropTypes.string),
};

export default SourcesTab;
