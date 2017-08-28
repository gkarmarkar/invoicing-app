# Invoicing App

## setup

### Env
node 6.9 or higher

### Steps

* install mongodb
* run mongo server `mongod --dbpath tmpdata/db` (make sure you create the folder tmpdata/db before running this command)
* git clone https://github.com/gkarmarkar/invoicing-app
* cd invoicing-app
* run `npm install`
* run `npm run watch`
* open new terminal and from project folder run `npm start`
* visit http://localhost:3000/invoice to access the website

#### API Information
* Create invoice api -
	* Method: POST
	* Endpoint: http://localhost:3000/api/v1/invoice/create

* Type ahead api -
	* Method: GET
	* Endpoint: 
	http://localhost:3000/api/v1/invoice/get?merchantEmail=merchant2@carservice.com&helperText=customer2	
	
* Postman Collection for the apis:
https://www.getpostman.com/collections/7c9ae043abe440caa53d