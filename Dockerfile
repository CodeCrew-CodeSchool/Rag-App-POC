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

RUN cd /app/backend && npm install -y --verbose &

RUN touch .env && \
    echo "dbUsername=''" >> .env && \
    echo "dbPwd=''" >> .env && \
    echo "dbConnection=mongodb://localhost:27017/" >> .env

RUN cd /app/frontend && npm install -y --verbose &

EXPOSE 3000 5173 11434

VOLUME /root/.ollama

# Override ENTRYPOINT to start all processes
ENTRYPOINT ["/bin/sh", "-c", "echo 'Starting apps...' && \
    ollama run llama3.2 & \
    cd /app/backend && npm start & \
    cd /app/frontend && npm run dev & "]
