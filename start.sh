#!/bin/bash

# Backend - Install Dependencies
cd backend
npm i -y

# Create env file
touch .env
{
    echo "dbUsername=''"
    echo "dbPwd=''"
    echo "dbConnection=mongodb://localhost:27017/"
} > .env


# Install frontend dependencies
cd ../frontend
npm i -y

# Return to main directory
cd ..

# Start both apps

BACKEND_START="npm run start"
FRONTEND_START="npm run dev"

cd ./backend && nohup $BACKEND_START  & cd .. &

cd ./frontend && nohup $FRONTEND_START &

wait

open http://localhost:5173/
