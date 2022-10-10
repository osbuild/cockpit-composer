import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";

const PackagesTable = (props) => {
  const intl = useIntl();

  const columnNames = {
    name: intl.formatMessage({ defaultMessage: "Name" }),
    version: intl.formatMessage({ defaultMessage: "Version" }),
    release: intl.formatMessage({ defaultMessage: "Release" }),
  };

  const onSort = () => props.setIsSortAscending(!props.isSortAscending);

  const sortByName = () => ({
    sortBy: {
      index: "Name",
      direction: props.isSortAscending ? "asc" : "desc",
      defaultDirection: "asc",
    },
    onSort,
    columnIndex: "Name",
  });

  return (
    <TableComposable variant="compact" aria-label="Packages table">
      <Thead>
        <Tr>
          <Th sort={sortByName()}>{columnNames.name}</Th>
          <Th>{columnNames.version}</Th>
          <Th>{columnNames.release}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.packages?.map((pack) => (
          <Tr key={pack.name}>
            <Td dataLabel={columnNames.name}>{pack.name}</Td>
            <Td dataLabel={columnNames.version}>{pack.version}</Td>
            <Td dataLabel={columnNames.release}>{pack.release}</Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

PackagesTable.propTypes = {
  packages: PropTypes.array,
  isSortAscending: PropTypes.bool,
  setIsSortAscending: PropTypes.func,
};

export default PackagesTable;
