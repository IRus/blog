#!/bin/bash

echo "== clean [public] folder"
rm -rf ./public

echo "== build with hugo"
hugo

echo "== chown [ruslan] folder as [rick]."
ssh rick@188.166.39.173 -t "sudo chown rick:rick -R /home/rick/nginx/files/ibragimov.by/ruslan"

echo "== rsync [public] folder"
rsync -r --perms --delete-after ./public/ rick@188.166.39.173:/home/rick/nginx/files/ibragimov.by/ruslan

echo "== chown [ruslan] folder as [www-data]."
ssh rick@188.166.39.173 -t "sudo chown www-data:www-data -R /home/rick/nginx/files/ibragimov.by/ruslan"
