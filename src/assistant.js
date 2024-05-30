import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import OpenAI from "openai";

const OPENAPI_KEY = process.env.OPENAPI_KEY;
const ASSISTANT_ID = 'asst_TmdA3RxTazR2pjKX08mTHjeq';

const openai = new OpenAI({ apiKey: OPENAPI_KEY, });

const getFileURL = (file) => {
    const folderPath = './train-data/';
    const filePath = path.join(folderPath, file);

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    return { url: jsonData.url, title: jsonData.title };
}

// Parse Articles required JSON from zendesk
const writeArticleJSON = (fileName, data) => {
    try{
        const folderPath = './train-data/';
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }

        fs.writeFileSync(path.join(folderPath, fileName), JSON.stringify(data));
    } catch(e){
        console.log(e);
    }
};

const createArticlesJSON = () => {
    const directoryPath = './kb/';

    try {
        let fileCount = 0;
        // Read the directory contents
        const files = fs.readdirSync(directoryPath);
    
        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
    
            // Check if the file is indeed a file (and not a directory)
            if (fs.statSync(filePath).isFile()) {
                // Read the file synchronously
                const data = fs.readFileSync(filePath, 'utf8');
                console.log(`Contents of ${file}:`);
                if(typeof data === 'string'){
                    const jsonData = JSON.parse(data);
                    const articles  = jsonData.articles;
                    for(let article of articles){
                        const finalJSON = {
                            url: article.html_url,
                            body: article.body,
                            title: article.title,
                        }

                        writeArticleJSON(++fileCount + '-'+ article.title.replaceAll(' ', '-').replaceAll('/', '_')+ '.json', finalJSON);
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error reading the directory or files:', err);
    }
};

const getAssistant = async (...vectorStoreIds) => {
    const assistant = await openai.beta.assistants.create({
      name: "Hackerrank Knowledge Base Assistant",
      instructions: `You are expert on hackerrank's platform queries that a person asks generally. Use the knowledge base I am going to provide in json files format
      to answer questions about anything that I am going to ask. The json file format contains two keys one is url and other one is body. So the body is in html so 
      process that body. You are bounded by the knowledge base only. Answer the queries only in the scope of the vector store knowledge base I am providing you. 
      Don't go beyond or overwrite that because that is the most updated knowledge base we have. 
      Important: The output should be in html format starting form div tag not html tag so that i can render response directly to the website.`,
      model: "gpt-4o",
      tools: [{ type: "file_search" }],
    });

    console.log('------------------------------');
    console.log('Assistant Id - ', assistant.id);
    console.log('------------------------------');

    await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: vectorStoreIds } },
      });
    return assistant;
}

const createVectorStore = async () => {
      // Create a vector store including our two files.
    let vectorStore = await openai.beta.vectorStores.create({
        name: "Hackerrank Platform KB v1",
      });


    const directoryPath = './train-data/';

    // Read the directory contents
    const files = fs.readdirSync(directoryPath);

    let filePathsArr = [];
    for(let file of files){
        filePathsArr.push(path.join(directoryPath, file));
        // TODO: remove this to include the whole knowledge base
        // break;
    }

    const fileStreams = filePathsArr.map((path) =>
        fs.createReadStream(path),
      );
         
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams })

    console.log('------------------------------');
    console.log('Vector Store Id - ', vectorStore.id);
    console.log('------------------------------');
    return vectorStore.id;
}
 
const queryAssistant = async (question, threadId) => {
    // A user wants to attach a file to a specific message, let's upload it.
// const aapl10k = await openai.files.create({
//     file: fs.createReadStream("edgar/aapl-10k.pdf"),
//     purpose: "assistants",
//   });
  
    if(!threadId){
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
    }

  const threadMessages = await openai.beta.threads.messages.create(
    threadId,
    {
        role: "user",
        content: question + '  Output - The output should be in html format starting form div tag not html tag.',
    }
  );
  
  // The thread now has a vector store in its tool resources.
//   console.log(thread.tool_resources?.file_search);

    // const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    //     assistant_id: ASSISTANT_ID,
    // });

    let run = await openai.beta.threads.runs.createAndPoll(threadId, {
            assistant_id: ASSISTANT_ID,
        });
    
    const messages = await openai.beta.threads.messages.list(threadId, {
        run_id: run.id,
    });
    //Write a one line short descirption of last message.
    const response = {
        data: '',
        files: []
    };

    const message = messages.data[0];

    if (message.content[0].type === "text") {
        const { text } = message.content[0];
        const { annotations } = text;
        const citations = [];
    
        let index = 0;
        for (let annotation of annotations) {
            text.value = text.value.replace(annotation.text, "");
            // text.value = text.value.replace(annotation.text, "[" + index + "]");
            const { file_citation } = annotation;
            if (file_citation) {
                const citedFile = await openai.files.retrieve(file_citation.file_id);
                citations.push(citedFile.filename);
            }
            index++;
        }
    
        console.log(text.value);
        console.log(citations.join("\n"));
        response.data = text.value;
        const filesArr = [...new Set(citations)];
        response.files = filesArr.map(getFileURL);
    }
    console.log('----------------');
    console.log(response);
    console.log('----------------');

    return { threadId: threadId, response };
}
 
// main();
(async () => {
    // await createArticlesJSON();
    // await createVectorStore();
    await getAssistant('vs_yp8mZiNlgcF8kAmZwmjRYRza');
    // await queryAssistant('asst_QsQWuMLVEoRad9xhowBDvO4t', 'What is Email Alerts for Question Leakage?');
})();

// "vs_yi3g2bP1HkfUefSh2bZSW29a"
// asst_QsQWuMLVEoRad9xhowBDvO4t

// API
const app = express();
const port = 9000;

// Use the cors middleware
app.use(cors());

app.use(bodyParser.json());

app.post('/query', async (req, res) => {
    const { threadId = null, question } = req.body;
    const response = await queryAssistant(question, threadId);
    res.json(response);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});