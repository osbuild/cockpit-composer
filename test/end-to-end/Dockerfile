# A Fedora 25 End-To-End Automation Test Container
FROM welder/web-nodejs:latest
MAINTAINER Xiaofeng Wang <xiaofwan@redhat.com>

# Install xvfb to simulate framebuffer for nightmare.js
# Install electorn dependency
RUN dnf --setopt=deltarpm=0 --verbose install -y xorg-x11-server-Xvfb which libXScrnSaver \
clang dbus-devel gtk2-devel libnotify-devel libgnome-keyring-devel xorg-x11-server-utils \
libcap-devel cups-devel libXtst-devel alsa-lib-devel libXrandr-devel GConf2-devel nss-devel

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["xvfb-run", "-a", "-s", "-screen 0 1024x768x24", "npm", "run", "test"]

## Do the things more likely to change below here. ##

# Volumes for xUnit result file.
VOLUME /result

# Update node dependencies only if they have changed
COPY ./package.json /end2end/package.json
RUN cd /end2end/ && npm install --only=production

# Copy the rest of the UI files over and compile them
COPY . /end2end/
