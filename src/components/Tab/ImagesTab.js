import React from "react";
import PropTypes from "prop-types";

import ImageTable from "../Table/ImageTable";

const ImagesTab = ({ images }) => {
  // destructure and restructure array to not sort the store from the table
  const cloneImages = [...images];
  return (
    <div className="pf-u-p-lg">
      <ImageTable images={cloneImages} />
    </div>
  );
};

ImagesTab.propTypes = {
  images: PropTypes.array,
};

export default ImagesTab;
