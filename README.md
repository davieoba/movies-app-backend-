# movies-app-backend-
This is the backend for the movies app to be used as a learning resource and for my personal portfolio

# scripts and setup
`npm start`


- [ ] install node_modules and dependencies run `npm install` from the root directory.
- [ ] load dev-data, navigate to the '/dev-data' from the root folder `$ cd dev-data `
```
backend
|
|
|___ app.js
|
|
|___ /dev-data
|       import-devData.js
|       movies-data.json
|
|___ controllers
|      ...
|
|
...
```
- [ ] in the `/dev-data` folder run the code `node import-devData.js --import `  --> to import the development data
- [ ] also to delete the development data run `node import-devData.js --delete` 
- [ ] also create the .env file from the contents of .env.example (it doesn't have to be the same thing) but the dotenv package is configured to see the .env file
