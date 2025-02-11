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


# Start Ollama and both apps

OLLAMA_START="run ollama3.2"
BACKEND_START="npm run start"
FRONTEND_START="npm run dev"

nohup $OLLAMA_START &

cd ./backend && nohup $BACKEND_START  & cd .. &

cd ./frontend && nohup $FRONTEND_START && wait &
