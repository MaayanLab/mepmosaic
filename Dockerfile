FROM debian:stable

RUN apt-get update

RUN apt-get -y install python \
    python-dev \
    python-pip \
    python-setuptools \
    nginx \
    uwsgi-core

# pip installs
RUN pip install -Iv Flask==0.10.1 \
    uwsgi \
    pyyaml

EXPOSE 80

ADD . /app

CMD /app/boot.sh
