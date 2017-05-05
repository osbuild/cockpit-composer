# A Fedora 25 End-To-End Automation Test Container
FROM weld/fedora:25
MAINTAINER Xiaofeng Wang <xiaofwan@redhat.com>

# Install xvfb to simulate framebuffer for nightmare.js
# Install electorn dependency
RUN dnf --setopt=deltarpm=0 --verbose install -y xorg-x11-server-Xvfb which libXScrnSaver \
clang dbus-devel gtk2-devel libnotify-devel libgnome-keyring-devel xorg-x11-server-utils \
libcap-devel cups-devel libXtst-devel alsa-lib-devel libXrandr-devel GConf2-devel nss-devel

RUN echo 'PATH=/usr/local/bin/:$PATH' >> /etc/bashrc

# Based on official node docker image
# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --keyserver pool.sks-keyservers.net --recv-keys "$key"; \
  done

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.9.1

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

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
