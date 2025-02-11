# syntax=docker/dockerfile:1
FROM ollama/ollama

# Install git, curl, yarn
RUN apt-get update && apt-get install -y \
    git \
    curl \
    yarn \
    && rm -rf /var/lib/apt/lists/*

# Install Node Version Manager and Node

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

WORKDIR /app

RUN git clone https://github.com/CodeCrew-CodeSchool/Rag-App-POC.git

COPY . /app

RUN cd /app/backend && npm install -y --verbose

RUN touch .env && \
    echo "dbUsername=''" >> .env && \
    echo "dbPwd=''" >> .env && \
    echo "dbConnection=mongodb://localhost:27017/" >> .env

RUN cd /app/frontend && npm install -y --verbose

RUN ollama pull llama3.2

EXPOSE 3000 5173 11434

VOLUME /root/.ollama

# Override ENTRYPOINT to start all processes
ENTRYPOINT ["/bin/sh", "-c", "echo 'Starting apps...' && \
    ollama serve & \
    sleep 2 && \
    echo 'Preloading llama3.2 model...' && \
    ollama run llama3.2 -m && \
    cd /app/backend && npm start & \
    cd /app/frontend && npm run dev & \
    wait && echo 'All apps have started successfully!'"]
