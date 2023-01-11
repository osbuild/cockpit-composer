// Copied from https://github.com/RedHatInsights/image-builder-frontend

const filesystemValidator = () => (fsc) => {
  if (!fsc) {
    return undefined;
  }

  let mpFreqs = {};
  for (const fs of fsc) {
    const mp = fs.mountpoint;
    if (mp in mpFreqs) {
      mpFreqs[mp]++;
    } else {
      mpFreqs[mp] = 1;
    }
  }

  let duplicates = [];
  for (const [k, v] of Object.entries(mpFreqs)) {
    if (v > 1) {
      duplicates.push(k);
    }
  }

  let root = mpFreqs["/"] >= 1;
  return duplicates.length === 0 && root
    ? undefined
    : {
        duplicates: duplicates === [] ? undefined : duplicates,
        root,
      };
};

export default filesystemValidator;
