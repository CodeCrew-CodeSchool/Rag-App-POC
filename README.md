# Rag-App-POC


# Setup and Start

### Install Ollama 
Go to [Ollama.com](https://ollama.com) and install for your OS.

```bash
ollama pull nomic-embed-text
```

```bash
ollama pull llama3.2
```

```bash
ollama run llama3.2
```

Please view the frontend and backend README files linked below:

- [frontend](https://github.com/CodeCrew-CodeSchool/Rag-App-POC/blob/main/frontend/README.md)

- [backend](https://github.com/CodeCrew-CodeSchool/Rag-App-POC/blob/main/backend/README.md)

## Startup Shortcut
To start the app using the start.sh script, clone the repo, cd into RAG-APP-POC directory, and run the following commands in the terminal:

```bash
chmod +x start.sh && ./start.sh
```

Navigate to http://localhost:5173/ in your preferred browser and ask your IMDB chat agent a question.

In order for this script to run you will need:
- Node installed on your machine
- ollama 3.2 installed and running on your machine per instructions above

## Stop the Apps:
In the terminal, run:

```bash
kill $(lsof -t -i:5173) && kill $(lsof -t -i:3000)
```
