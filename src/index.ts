import express from "express";
import logger from "./logger";

import {getUnmergedBranches,getFirstCommit,getCommitDate} from "./git";

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

const origin = "origin/development";
const workspace = "{input your workspace here}";
getUnmergedBranches(workspace)
.then(res=>{
    res.forEach(dest=>{
        getFirstCommit(workspace,"origin/development",dest)
        .then(commit=>{
            getCommitDate(workspace,commit.hash)
            .then(date => {
                logger.info(`${dest} was branched from ${origin} on ${date} in commit ${commit.line}`);
            })
            .catch(err=>logger.error("getCommitDate Error",err));
        })
        .catch(err=>logger.error("getFirstCommit Error",err));
    });
}).catch(err=>logger.error("getUnmergedBranches Error",err));

// start the Express server
app.listen( port, () => {
    logger.info( `server started at http://localhost:${ port }` );
} );