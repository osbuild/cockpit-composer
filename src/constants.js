export const ImageTypeLabels = {
  alibaba: "Alibaba Cloud (.qcow2)",
  ami: "Amazon Web Services (.raw)",
  "iot-commit": "IoT Commit (.tar)",
  google: "Google Cloud Platform (.vhd)",
  "hyper-v": "Hyper-V (.vhd)",
  "live-iso": "Installer, suitable for USB and DVD (.iso)",
  tar: "Disk Archive (.tar)",
  openstack: "OpenStack (.qcow2)",
  "partitioned-disk": "Disk Image (.img)",
  oci: "Oracle Cloud Infrastructure (.qcow2)",
  qcow2: "QEMU Image (.qcow2)",
  "rhel-edge-commit": "RHEL for Edge Commit (.tar)",
  "rhel-edge-container": "RHEL for Edge Container (.tar)",
  "rhel-edge-installer": "RHEL for Edge Installer (.iso)",
  "edge-commit": "RHEL for Edge Commit (.tar)",
  "edge-container": "RHEL for Edge Container (.tar)",
  "edge-installer": "RHEL for Edge Installer (.iso)",
  "edge-raw-image": "RHEL for Edge Raw Image (.raw.xz)",
  "image-installer": "RHEL Installer (.iso)",
  "edge-simplified-installer": "RHEL for Edge Simplified Installer (.iso)",
  vhd: "Microsoft Azure (.vhd)",
  vmdk: "VMware VSphere (.vmdk)",
  ova: "VMware VSphere (.ova)",
  gce: "Google Cloud Platform (.tar.gz)",
};

export const UNIT_KIB = 1024 ** 1;
export const UNIT_MIB = 1024 ** 2;
export const UNIT_GIB = 1024 ** 3;

export const MountPointPrefixes = [
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

// copied from https://github.com/osbuild/images/blob/main/pkg/policies/policies.go
export const MountPointPrefixesPolicy = {
  "/": {},
  // /etc must be on the root filesystem
  "/etc": { Deny: true },
  // NB: any mountpoints under /usr are not supported by systemd fstab
  // generator in initram before the switch-root, so we don't allow them.
  "/usr": { Exact: true },
  // API filesystems
  "/sys": { Deny: true },
  "/proc": { Deny: true },
  "/dev": { Deny: true },
  "/run": { Deny: true },
  // not allowed due to merged-usr
  "/bin": { Deny: true },
  "/sbin": { Deny: true },
  "/lib": { Deny: true },
  "/lib64": { Deny: true },
  // used by ext filesystems
  "/lost+found": { Deny: true },
  // used by EFI
  "/boot/efi": { Deny: true },
  // used by systemd / ostree
  "/sysroot": { Deny: true },
  // symlink to ../run which is on tmpfs
  "/var/run": { Deny: true },
  // symlink to ../run/lock which is on tmpfs
  "/var/lock": { Deny: true },
};
