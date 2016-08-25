FROM debian:stable
RUN mkdir -p /MEPmosaic

# General installs
RUN apt-get update && apt-get install -y \
	apache2 \
	apache2-prefork-dev \
	libapache2-mod-wsgi

# Python installs
RUN apt-get update && apt-get install -y \
	python \
	python-dev \
	python-pip \
	python-setuptools

# pip installs
RUN pip install -Iv Flask==0.10.1
RUN pip install pyyaml

# RUN pip install \
# 	numpy \
# 	cython

EXPOSE 5000
 
ADD . /MEPmosaic

WORKDIR /MEPmosaic
CMD ./MEPmosaic.py
