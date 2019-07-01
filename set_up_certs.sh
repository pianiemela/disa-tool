#!/bin/bash

mkdir ./backend/samldata/

openssl req -x509 -new -newkey rsa:2048 -nodes -subj '/C=FI/ST=Helsinki/L=Helsinki/O=Hy/CN=Defa Dev' \
  -keyout ./backend/samldata/key.pem \
  -out ./backend/samldata/cert.pem -days 7300

openssl req -x509 -new -newkey rsa:2048 -nodes -subj '/C=FI/ST=Helsinki/L=Helsinki/O=Hy/CN=Defa IDP Dev' \
  -keyout ./idp/idp-private-key.pem \
  -out ./idp/idp-public-cert.pem -days 7300

cp ./idp/idp-public-cert.pem ./backend/samldata/
