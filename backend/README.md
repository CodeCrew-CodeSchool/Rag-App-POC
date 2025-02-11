# Backend

The backend app setup is the same as the RAG app based on skeleton created in [this repo](https://github.com/CodeCrew-CodeSchool/RAG-Skeleton-App).

I made the following changes:

- Modified csv loading step to default to static csv file in project directory if no document is provided.
- Commented the mongodb connection
- Added CORS middleware to express app.

I sourced the Netflix data from [Kaggle](https://www.kaggle.com/datasets/harshitshankhdhar/imdb-dataset-of-top-1000-movies-and-tv-shows).

# Setup
Run the following in the terminal:

```bash
cd backend
```

```bash
npm i -y
```

```bash
touch .env
```

The .env file will need to contain the following variables.
Put your mongodb username and password after the '='.

```
    dbUsername=
    dbPwd=
    dbConnection=mongodb://localhost:27017/
```
The connection string here is local host, but you may also connect to an atlas cloud db.

# Start the app

Start the backend app by running:
```bash
npm run start
```

The app will start on localhost port 3000 by default.

TODO: 
- update this read me with full app set up
- link guide for mongodb setup
