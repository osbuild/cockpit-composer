FROM fedora:latest
LABEL maintainer="Xiaofeng Wang" \
      email="xiaofwan@redhat.com" \
      baseimage="Fedora:latest" \
      description="A welder-web end to end test runner container running on Fedora"

RUN dnf --setopt=deltarpm=0 --verbose install -y gnupg tar xz curl tigervnc-server which xclip firefox java nodejs && dnf clean all

RUN mkdir /end2end/
WORKDIR /end2end/

RUN curl -L https://goo.gl/UzaKCo > selenium-server-standalone-3.11.0.jar && \
    curl -L https://github.com/mozilla/geckodriver/releases/download/v0.20.1/geckodriver-v0.20.1-linux64.tar.gz > geckodriver.tar.gz && \
    tar -xzvf geckodriver.tar.gz

ENV DISPLAY :1
## Do the things more likely to change below here. ##

# Update node dependencies only if they have changed
COPY ./package.json package.json
RUN npm install --only=production

# Copy the rest of the UI files over and compile them
COPY . .

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
