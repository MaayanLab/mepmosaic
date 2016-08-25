FROM debian:stable

RUN apt-get update

# General installs
RUN apt-get -y install python \
    python-dev \
    python-pip \
    python-setuptools \
    nginx uwsgi-core

# Python installs
RUN apt-get update && apt-get install -y \
	python \
	python-dev \
	python-pip \
	python-setuptools

# pip installs
RUN pip install -Iv Flask==0.10.1 \
    uwsgi \
    pyyaml

EXPOSE 80

ADD . /app

CMD /app/boot.sh
