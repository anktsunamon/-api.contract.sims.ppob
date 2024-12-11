require('dotenv').config();

const environments = {};
const secret = '[a-zA-Z0-9._]^+$4!5yN1T.!dfor4lphabeticalArroNvmer4l';

environments.development = {
    port: 2800,
    envName: 'development',
    host: 'localhost',
    user: 'syndIT',
    password: '!B6958kTa',
    database: 'api.contract.sims.ppob',
    secret: secret,
    databaseUrl: '',
    origin: 'http://localhost:2800'
};

environments.production = {
    port: 2800,
    envName: 'production',
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'mbAGnEYoDHNTLBAWlazwBYvlGAqxXILF',
    database: 'railway',
    secret: secret,
    databaseUrl: 'mysql://root:mbAGnEYoDHNTLBAWlazwBYvlGAqxXILF@junction.proxy.rlwy.net:36875/railway',
    origin: 'https://apicontractsimsppob-production.up.railway.app'
};

let env = process.env.ENVIRONMENT;
let currentEnvironment = env.toLowerCase();
let environmentToExport = typeof(environments[currentEnvironment]) == 'object'? environments[currentEnvironment]:environments.development;

module.exports = environmentToExport;