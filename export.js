
const { MongoClient } = require("mongodb");
const fs = require('fs');
const parseSchema = require('mongodb-schema');

/*------ db connection properties --------*/

const database = 'local_mdo';
const user = 'local_test';
const pass = 'local_test_123#';
const url = 'localhost:27017';

/*------------------------------------------*/

let directory = "./exports";
let collections = ['test', 'test1'];

let limit = 10 //max number of documents per collection, to be exported

const uri = `mongodb://${user}:${pass}@${url}/${database}`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function colelctionExport() {

    try {
        
        directory = directory+"_"+new Date().getTime();

        if (!fs.existsSync(directory)) 
            fs.mkdirSync(directory);

        await client.connect();
        const db = client.db(database);

        for await (collect_name of collections) {
            collection = db.collection(collect_name);
            result = collection.find({}).limit(limit);
            data = await result.toArray();

            if (data) {
                if (data.length > 0) {

                    //schema
                    parseSchema(data, {
                        storeValues: false,
                    }, function (err, schema) {

                        if (!err) {

                            schema = JSON.stringify(schema);

                            fs.writeFile(`${directory}/${collect_name}_schema.json`, schema, 'utf8', (err) => {
                                if (err) {
                                    console.log(`Error generating schema info for collection ${collect_name}: ${err}`);
                                } else {
                                    console.log(`Generated schema info for  ${collect_name}`);
                                }
                            });

                        } else {
                            console.log(`Error generating schema info for collection ${collect_name}: ${err}`);
                        }

                    });

                    //data export
                    data = JSON.stringify(data);
                  
                    fs.writeFile(`${directory}/${collect_name}.json`, data, 'utf8', (err) => {
                        if (err) {
                            console.log(`Error exporting JSON for collection ${collect_name}: ${err}`);
                        } else {
                            console.log(`Exported collection JSON for ${collect_name}`);
                        }
                    });


                } else {
                    console.log(`Empty collection : ${collect_name}`);
                }
            }

        }//end of for await



    } finally {

        await client.close();

    }
}
colelctionExport().catch(console.dir);