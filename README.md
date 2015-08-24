![OfficeMapper Logo](https://raw.githubusercontent.com/lental/office-mapper/master/static/images/logo.png)
#OfficeMapper
THE interactive, editable map for multi-office companies

## Prerequisites
This project requires:

* Go
* MySQL
* Access to Ooyala-private repositories.  These dependencies can be removed, however it's not configured as such out of the box

## To run

1. `Git submodule update --init` to get all of the google dependencies
2. `./database-schema/init` to initialize your database
3. `./bin/office-mapper` to start it up
