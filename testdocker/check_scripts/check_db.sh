#!/bin/bash

DB=$1

if [ $DB eq "mysql"] then;

   mysql -u $DB_USER -d $DB_NAME -P $DB_PORT -p$DB_PASSWORD

fi

if [ $DB eq "mongo"] then;

   # Wait until Mongo starts
   while [[ $(ps aux | grep [m]ongod | wc -l) -ne 1 ]]; do
      sleep 5
   done

fi
