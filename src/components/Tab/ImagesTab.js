import React from "react";
import PropTypes from "prop-types";

import ImageTable from "../Table/ImageTable";
import ImagesEmpty from "../EmptyStates/ImagesEmpty";

const ImagesTab = ({ images, blueprint }) => {
  // destructure and restructure array to not sort the store from the table
  const cloneImages = [...images];
  return (
    <div className="pf-u-p-lg">
      {cloneImages.length === 0 && <ImagesEmpty blueprint={blueprint} />}
      {cloneImages.length > 0 && (
        <ImageTable blueprint={blueprint} images={cloneImages} />
      )}
    </div>
  );
};

ImagesTab.propTypes = {
  images: PropTypes.array,
  blueprint: PropTypes.object,
};

export default ImagesTab;
