import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  TableComposable,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
} from "@patternfly/react-table";
import CreateImageWizard from "../Wizard/CreateImageWizard";
import DeleteBlueprint from "../Modal/DeleteBlueprint";
import ExportBlueprint from "../Modal/ExportBlueprint";
import { formTimestampLabel } from "../../helpers";

const getNumberOfAssociatedImages = (images, blueprint) => {
  return images.filter((image) => image.blueprint === blueprint.name).length;
};

const getLatestCreationDate = (images, blueprint) => {
  const imagesByBlueprint = images.filter(
    (image) => image.blueprint === blueprint.name
  );
  if (imagesByBlueprint.length > 0) {
    const latestTimestamp = Math.max(
      ...imagesByBlueprint.map((image) => image.job_created)
    );
    return formTimestampLabel(latestTimestamp);
  } else {
    return "-";
  }
};

const BlueprintTable = (props) => {
  const intl = useIntl();

  return (
    <TableComposable
      aria-label={intl.formatMessage({ defaultMessage: "Blueprints table" })}
      variant="compact"
    >
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Version</Th>
          <Th>Last image created</Th>
          <Th>Images built</Th>
          <Th>Packages</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.blueprints.map((blueprint) => (
          <Tr key={blueprint.name} data-testid={blueprint.name}>
            <Td>
              <Link to={`/${blueprint.name}`}>{blueprint.name}</Link>
            </Td>
            <Td>{blueprint.version}</Td>
            <Td>{getLatestCreationDate(props.images, blueprint)}</Td>
            <Td>{getNumberOfAssociatedImages(props.images, blueprint)}</Td>
            <Td>{blueprint?.packages.length}</Td>
            <Td modifier="fitContent">
              <CreateImageWizard blueprint={blueprint} />
            </Td>
            <Td modifier="fitContent">
              <ExportBlueprint blueprint={blueprint} />
            </Td>
            <Td modifier="fitContent">
              <DeleteBlueprint blueprint={blueprint} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

BlueprintTable.propTypes = {
  blueprints: PropTypes.array,
  images: PropTypes.array,
};

export default BlueprintTable;
