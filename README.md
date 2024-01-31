## Full stack chat web application

Built with MERN stack. To install app run command `npm i` in root directory, client directory and server directory.

**Add in `.env` file in server directory:**<br>
Mongodb connection string in `.env` with variable name `MONGODB_CONNECT="your-string"`<br>
Front end origin (`127.0.0.1:3000` or other port) with variable name `FRONT_ORIGIN="http://127.0.0.1:3000"`<br>
Store secret for express-sessions middleware with variable name `STORE_SECRET="your-secret-string"`<br>
Port number to run server on (ex. 8080) with variable name `PORT_NMBR=8080`

To run app navigate to root directory and run command `npm run dev` to run frontend and backend in same terminal window with concurrently.

Change all `127.0.0.1` to your local ip address `(192.168.0.XX)` if you want to run the app on your home network.<br>

## Features:
- [x] Root package.json for concurrently running react and express
- [x] Mongoose set up  <br>
- [x] Client side routing with React Router  <br>
- [x] Account creation and authentication on login  <br>
- [x] Create authenticated routes  <br>
- [x] Socket connection <br>
- [x] Chat by emission <br>
- [x] Online users list <br>
- [x] Media queries<br>
- [x] Store message history in db and fetch on component load<br>
- [ ] Private rooms with password protection <br>
- [ ] More profile customization

