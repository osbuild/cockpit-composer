export const formTimestampLabel = (ts) => {
  // get Mon DD, YYYY format
  const ms = Math.round(ts * 1000);
  const date = new Date(ms);
  const options = { month: "short", day: "numeric", year: "numeric" };
  const tsDisplay = new Intl.DateTimeFormat("en-US", options).format(date);
  return tsDisplay;
};
