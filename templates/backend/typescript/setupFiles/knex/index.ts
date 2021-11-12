//Entrypoint of the backend api

import {app} from "@config";
import {config} from 'dotenv';
config()
const port = process.env.API_PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on Port ${port}`);
});