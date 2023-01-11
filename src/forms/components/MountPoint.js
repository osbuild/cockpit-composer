import React, { useEffect, useState } from "react";

import {
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
} from "@patternfly/react-core";
import PropTypes from "prop-types";

const MountPoint = ({ ...props }) => {
  // check '/' last!
  const validPrefixes = [
    "/app",
    "/boot",
    "/data",
    "/home",
    "/opt",
    "/srv",
    "/tmp",
    "/usr",
    "/usr/local",
    "/var",
    "/",
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [prefix, setPrefix] = useState("/");
  const [suffix, setSuffix] = useState("");

  // split
  useEffect(() => {
    for (let p of validPrefixes) {
      if (props.mountpoint.startsWith(p)) {
        setPrefix(p);
        setSuffix(props.mountpoint.substring(p.length));
        return;
      }
    }
  }, []);

  useEffect(() => {
    let suf = suffix;
    let mp = prefix;
    if (suf) {
      if (mp !== "/" && suf[0] !== "/") {
        suf = "/" + suf;
      }

      mp += suf;
    }

    props.onChange(mp);
  }, [prefix, suffix]);

  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onSelect = (event, selection) => {
    setPrefix(selection);
    setIsOpen(false);
  };

  return (
    <>
      <Select
        className="pf-u-w-50"
        isOpen={isOpen}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={prefix}
        variant={SelectVariant.single}
      >
        {validPrefixes.map((pfx, index) => {
          return <SelectOption key={index} value={pfx} />;
        })}
      </Select>
      {prefix !== "/" && (
        <TextInput
          className="pf-u-w-50"
          type="text"
          value={suffix}
          onChange={(v) => setSuffix(v)}
        />
      )}
    </>
  );
};

MountPoint.propTypes = {
  mountpoint: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MountPoint;
