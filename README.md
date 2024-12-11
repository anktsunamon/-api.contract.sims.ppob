# api.contract.sims.ppob



## Getting started

Firstly clone this repo with this command

```
git clone https://gitlab.com/assignment4624450/api.contract.sims.ppob.git
```

After that, run this command to install all library

```
npm install
```

## Add and setup config files

Create new .env file on root folder, and type this

For local environtment:
```
ENVIRONMENT=DEVELOPMENT
```

For cloud environtment:
```
ENVIRONMENT=PRODUCTION
```

Change MySQL config on [custom-config.js] file

For local environtment:
```
environments.development = {
    port: 2800,
    envName: 'development',
    host: 'localhost',
    user: '#ChangewithUsernameOnYourDevice#', ==> change this part
    password: '#ChangewithPasswordOnYourDevice#', ==> change this part
    database: 'api.contract.sims.ppob',
    secret: secret,
    origin: 'http://localhost:2800'
};
```

For cloud environtment:
```
environments.production = {
    port: 2800,
    envName: 'production',
    host: 'localhost',
    user: '#ChangewithUsernameOnYourDevice#', ==> change this part
    password: '#ChangewithPasswordOnYourDevice#', ==> change this part
    database: 'api.contract.sims.ppob',
    secret: secret,
    origin: 'https://your-api-domain'
};
```

run the project with this command
```
npm run start
```

# Finish