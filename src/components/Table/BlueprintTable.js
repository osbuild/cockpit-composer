import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { TableComposable, Tr, Tbody, Td } from "@patternfly/react-table";
import CreateImageWizard from "../Wizard/CreateImageWizard";
import DeleteBlueprint from "../Modal/DeleteBlueprint";

const BlueprintTable = (props) => {
  const intl = useIntl();
  return (
    <TableComposable
      aria-label={intl.formatMessage({ defaultMessage: "Blueprints table" })}
    >
      <Tbody>
        {props.blueprints.map((blueprint) => (
          <Tr key={blueprint.name} data-testid={blueprint.name}>
            <Td>
              <Link to={`/${blueprint.name}`}>{blueprint.name}</Link>
            </Td>
            <Td modifier="fitContent">
              <CreateImageWizard blueprint={blueprint} />
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
};

export default BlueprintTable;
