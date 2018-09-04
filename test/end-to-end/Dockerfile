FROM fedora:latest
LABEL maintainer="Xiaofeng Wang" \
      email="xiaofwan@redhat.com" \
      baseimage="Fedora:latest" \
      description="A welder-web end to end test runner container running on Fedora"

RUN dnf --setopt=deltarpm=0 --verbose install -y xclip nodejs && dnf clean all

RUN mkdir /end2end/
WORKDIR /end2end/

COPY . .
RUN npm install

CMD ["npm", "run", "test"]
