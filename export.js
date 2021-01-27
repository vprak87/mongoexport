
const { MongoClient } = require("mongodb");
const fs = require('fs');
const parseSchema = require('mongodb-schema');

/*------ db connection properties --------*/
const database = 'perspective_10_08_2020';
const user = 'local_test';
const pass = 'local_test_123#';
const url = 'localhost:27017';

/*------------------------------------------*/

let directory = "./exports";
//let collections = ['hmgglcodemasters'];
let collections = ['users',
    'webapitokens',
    'autosequences',
    'hoteldashboardcalculations',
    'hotelbudgetdashboardcalculations',
    'accountingtoolemailogs',
    'accountingtoolmasters',
    'accountingtoolmasterproperties',
    'accountingtoolproperties',
    'adphotelmasters',
    'auditlogs',
    'boardcastmessages',
    'boardcastmessagelogs',
    'cashdescriptionmappings',
    'catagories',
    'categorydescriptionmappings',
    'cities',
    'contactsupport_logs',
    'countries',
    'createowntablemappings',
    'createowntablemappingsgroups',
    'createowntablemappingsgroupdetails',
    'createowntablemappingmasters',
    'customersupportattachments',
    'dailydatahotelmappings',
    'dashboardcollapsedhotelgroups',
    'dashboardsettings',
    'departments',
    'dynamicshotelmappings',
    'emailconfigurations',
    'emailconfigurationdays',
    'emailconfigurationotherrecipients',
    'emailconfigurationreports',
    'emailconfigurationschedules',
    'emailescalationconfigurations',
    'emailescalationnotificationlogs',
    'emailnotifications',
    'emailpdfreportcolumnmasters',
    'emailreportlogs',
    'emailreportlogs_mirrors',
    'emailuserhoteltokens',
    'errorlogs',
    'events',
    'expenseformconfigurations',
    'failedemaillists',
    'fbpagehotelmappings',
    'foodnbeveragerevenues',
    'glcodehotelrevenues',
    'glcodemasters',
    'googleplacehotelmappings',
    'hotelaccountingtoolpropertymappings',
    'hotelaragings',
    'hotelavendraalerts',
    'hotelavendraalertdetails',
    'hotelavendraalertgroups',
    'hotelavendraalertinsights',
    'hotelavendraalertinsightlevels',
    'hotelavendraalertinsighttypes',
    'hotelavendraalertnonmfddetaildatas',
    'hotelavendraalertsubgroups',
    'hotelbudgets',
    'hotelbudgetexpenseforms',
    'hotelcalculationlogtables',
    'hotelcashdashboardcalculations',
    'hotelcomments',
    'hoteleffectivenesscalculations',
    'hoteleffectivenessmappings',
    'hotelexternaldatas',
    'hotelgmloginmappings',
    'hotelgroups',
    'hotelgroupxrefs',
    'hotelgsses',
    'hotelguestledgers',
    'hotelqcreports',
    'hotelqcreportglcodes',
    'hotelrevenues',
    'hotelroomstatuses',
    'hotelroomstatusdashboardcalculations',
    'hotels',
    'hotelservices',
    'hotelsourcetitles',
    'hotelweatherdatas',
    'hramastertables',
    'imagesiloconfigs',
    'importlogs',
    'labordatahotelmappings',
    'm3mastertables',
    'missingdatesmasters',
    'organisationcredentials',
    'otainsightapidataorganisations',
    'otainsighthotelmappings',
    'pdfcolumnsortconfigs',
    'pdfgroupcategories',
    'pickupreports',
    'pmsmappings',
    'pmsmappingmasters',
    'pmsmasters',
    'qbdescriptionmappings',
    'qboaccesstokens',
    'questionmasters',
    'quickbookscompanyfilehotelmappings',
    'quickbooksdesktopexpensedatatobill_logs',
    'quickbooksdesktopmappings',
    'revenuemasters',
    'revenuemaster_logs',
    'revenuetransactions',
    'revenuetransaction_logs',
    'revinateapidataorganisations',
    'revinatehoteldatas',
    'revinatehotelmappings',
    'roleaccesses',
    'rolebasedpermissions',
    'roles',
    'securityhashs',
    'settingsbygroups',
    'sorthotelbygroups',
    'starmonthreports',
    'starreports',
    'states',
    'strrevparweekreports',
    'stradrmonthreports',
    'strcompsets',
    'stroccmonthreports',
    'strrevparmonthreports',
    'stroccweekreports',
    'stradrweekreports',
    'systempermisions',
    'tripadvisorhotelmappings',
    'trustyousurveyreportdatas',
    'userbasedpermissions',
    'userhotelgroupxrefs',
    'userhotelxrefs',
    'userroleaccesses',
    'vendors',
    'yelphotelmappings',
    'templatemarsters',
    'templatemastermappings',
    'personalviews',
    'kpimarsters',
    'graphmarsters',
    'customkpis',
    'pnlcustomizeraw',
    'pnlmonthlycolorder',
    'createpropertydashboardtablemappings',
    'propertychartconfig',
    'screenshotschedulers',
    'operaoutoforderbyreasonreports',
    'mdoglcodemasters',
    'hmgglcodemaster',
    'mdoglcodehmgmappings',
    'createpnltablemappings',
    'hotelexpensedashboardcalculations'
];
const limit = 20000 //max number of documents per collection, to be exported
const reverse = false;

//const uri = `mongodb://${user}:${pass}@${url}/${database}`;
//const uri = `mongodb://remote_dev:8Z0gPBVWz2iz8yjh@myp-shard-00-00-zjri4.mongodb.net:27017,myp-shard-00-01-zjri4.mongodb.net:27017,myp-shard-00-02-zjri4.mongodb.net:27017/perspective_10_08_2020?ssl=true&replicaSet=MYP-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1`
const uri = `mongodb://remote_dev:8Z0gPBVWz2iz8yjh@myp-shard-00-00-zjri4.mongodb.net:27017,myp-shard-00-01-zjri4.mongodb.net:27017,myp-shard-00-02-zjri4.mongodb.net:27017/perspective_10_08_2020?ssl=true&replicaSet=MYP-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1`
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
            result = collection.find({});
            if(reverse)
                result = result.sort({_id:-1})

            result = result.limit(limit);
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