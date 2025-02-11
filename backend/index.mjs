//.mjs Javascript files are able to be run in Node JS and utilize the import/export syntax.
//Normally, .js files have to require/export to share functionality between multiple files
//Import LLM Tools Libraries
import { JsonLoader, RAGApplicationBuilder} from '@llm-tools/embedjs';
import { Ollama, OllamaEmbeddings } from '@llm-tools/embedjs-ollama';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { PdfLoader } from '@llm-tools/embedjs-loader-pdf';
import { CsvLoader } from '@llm-tools/embedjs-loader-csv';
import { MongoDb } from '@llm-tools/embedjs-mongodb';
import { HNSWDb } from '@llm-tools/embedjs-hnswlib';
import cors from 'cors'; // Import CORS to enable RAG app to take requests from front-end

//Express Library builds the HTTP Server
import express from "express";
//MongoDB library for connecting to a Database to store Vectors 
import { MongoClient } from 'mongodb';
//dotenv enables the app to read environment variables
import dotenv from 'dotenv';
//This loads the .env file and system environment variables into process.env
dotenv.config();

//Assign the .env values to variables we can use
const dbuser = process.env.dbUsername; //database username
const dbpwd = process.env.dbPwd; //database password
const dbconn = process.env.dbConnection || ""; //database connection string

//Uncomment the following line to help debug any .env issues
// console.log(`debug\n${dbuser}\n${dbpwd}\n${dbconn}`);

//create an express app and set the port number for it to 3000
const app = express();
const port = 3000;
//enable to app to send/receive json
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const local = true; // if false, it will call the Azure Link, which is pretty slow

const llamaURL = local ? "http://127.0.0.1:11434" : "https://llama.delightfulwater-6fda5743.centralus.azurecontainerapps.io/"

//Initialize the EmbedJS RAG object
const ragApplication = await new RAGApplicationBuilder()
.setModel(new Ollama({ modelName: "llama3.2", baseUrl: llamaURL }))
.setEmbeddingModel(new OllamaEmbeddings({ model: 'nomic-embed-text', baseUrl: llamaURL }))
.setVectorDatabase(new HNSWDb())
.build();

const greetings = "Hello, I'm your LLaMa Assistant!";
console.log(greetings);

//Express Routes
app.get("/", async (req, res) => {
    res.send(greetings);
});

app.post('/ask', async (req, res) => {

    /*
    This POST route takes in input with the following schema:
    {
        "query": "How ",
        "sources": [{
            "type": "",
            "link": "data OR http..."
        }]
    } 
    */
    
    //console.log(req.body); //uncomment for debugging purposes
    console.log('thank you, let me review the resources you provided');
    
    //This loads in a variety of resources. Docs: https://llm-tools.mintlify.app/components/data-sources/overview
    req.body.sources.forEach(async (source) => {
        if (source.type == 'pdf') {
            await ragApplication.addLoader(new PdfLoader({ filePathOrUrl: source.link }))
            
        } else if (source.type == 'web') {
            await ragApplication.addLoader(new WebLoader({ urlOrContent: source.link }))

        } else if (source.type == 'csv') {

            
            await ragApplication.addLoader(new CsvLoader({

                // Ternary operator will check if a csv path/link is provided. If not, it will default to the netflix.csv in repo
                filePathOrUrl: source.link ? source.link : "./imdb_top_1000.csv"
            }))

        } else if (source.type == 'database') {
            
            //Create a connection to your mongo DB database
            // Configure this connection using your .env file
            let client = new MongoClient(dbconn);
            await client.connect();
            console.log('Connected successfully to database server');

            //specify database
            const db = client.db('IMDB1000'); 

            //specify collection
            const collection = db.collection('imdb1000'); 

            //Select all data in the collection, store in memory as an array
            const results = await collection.find().toArray(); //aggregate([{$sort: { CREATION_DATE: -1 }}]).limit(20).toArray();

            // Add your data array to your RAG app using JsonLoader
            await ragApplication.addLoader(new JsonLoader({object: results}));

            console.log(`${source.type} resource loaded`);
            //console.log(results);
        }
    });
    console.log('now let me process this, one moment please...');
    //Ask the AI model your question
    const result = await ragApplication.query(req.body.query);
    //Send the results back
    res.send(result);
})
//start the application
  app.listen(port, () => {
    console.log(`Listening @ http://localhost:${port} ...`);
  });
