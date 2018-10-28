# Voting Backend

Backend for the Voting Information App

## Installation

### Mac
1. Get [Docker installed](https://store.docker.com/search?type=edition&offering=community)
2. Switch __*postgres/Dockerfile.template*__ to __*postgres/Dockerfile*__ & alter the secrets for your project
3. Switch __*config.template.js*__ to __*config.js*__ & alter the secrets for your project
    - Ask developer for or make your own password hash for first user in __*postgres/schema.sql*__
4. npm run schema:test
5. Run ```docker-compose up``` on your terminal for it to build and run, along with auto-magically re-building when you change the code

### Windows
Sorry that Windows is not UNIX, so we cant do docker :(
1. https://github.com/nodejs/node-gyp#on-windows ( install the visual studio build tools with c++ & also install python2.7 )
2. Switch __*postgres/Dockerfile.template*__ to __*postgres/Dockerfile*__ & alter the secrets for your project
3. Switch __*config.template.js*__ to __*config.js*__ & alter the secrets for your project
    - Ask developer for or make your own password hash for first user in __*postgres/schema.sql*__
4. npm run schema:test & run postgres/schema.sql into your database ( Dont commit secrets to schema.sql! )
5. install postgres https://www.postgresql.org/download/
6. add postgres as a localhost host in C:\Windows\system32\drivers\etc\hosts
7. npm install
8. npm run start:dev

## TODO:

### API for Frontend
I essentially need to start building out the frontend, in order to find out what I need for the API calls, as the structure is now built for all of the API calls.

### Performance
I might not be using promises properly for the db queries or just nodejs code in general.

### Security
 * Keep using JWT or something more traditional for auth
 * [Security Questions & 2Factor](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Design_password_storage_assuming_eventual_compromise)
 * [Forget Password](https://www.owasp.org/index.php/Forgot_Password_Cheat_Sheet)
