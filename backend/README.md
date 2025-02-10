Follow the RAG app setup based on skeleton created in this repo:
https://github.com/CodeCrew-CodeSchool/RAG-Skeleton-App

Modified the mongodb connection code
Added CORS to the express app to enable requests from the front-end app.

Added Data Source: https://www.kaggle.com/datasets/anandshaw2001/netflix-movies-and-tv-shows


env file will need the following variables:
dbUsername
dbPwd
dbConnection

setup:
cd backend
npm i -y

start the backend app using:
npm run start

it will start on part 3000 by default

TODO: 
- update this read me with full app set up
- link guide for mongodb setup