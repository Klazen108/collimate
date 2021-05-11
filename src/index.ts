import express from "express";
import logger from "./logger";

import NodeCache from "node-cache";

import {getUnmergedBranches,getFirstCommit,getCommitDate} from "./git";

const app = express();
const port = 8080; // default port to listen


// define a route handler for the default home page
// app.get( "/", ( req, res ) => {
//     res.send( "Hello world!" );
// } );

const cache = new NodeCache({
    stdTTL: 60, maxKeys: 10
});

// function getOrGenerate(key: string, func: () => any) {
//     let value = cache.get(key);
//     if ( value == undefined ){
//         value = func();
//         cache.set(key, value);
//     }
//     return value;
// }

app.get( "/workspaces/:workspace", ( req, res ) => {
    const origin = "origin/development";
    const workspace = req.params.workspace;
    const cacheKey = `workspaces/${workspace}`;

    const value = cache.get(cacheKey);
    if (value != null) {
        logger.debug(`Answering ${workspace} from cache`);
        res.send(value);
        return;
    }

    getUnmergedBranches(workspace)
    .then(brchs=>{
        const promises = brchs.map(dest=>{
            return getFirstCommit(workspace,"origin/development",dest)
            .then(commit=>{
                return getCommitDate(workspace,commit.hash)
                .then(date => {
                    logger.debug(`${dest} was branched from ${origin} on ${date} in commit ${commit.line}`);
                    return {dest,origin,date,commit,success:true};
                })
                .catch(err=>{
                    logger.error("getCommitDate Error",err);
                    return {dest,err,success:false};
                });
            })
            .catch(err=>{
                logger.error("getFirstCommit Error",err);
                return {dest,err,success:false};
            });
        });
        Promise.all(promises).then((results) => {
            cache.set(cacheKey, results);
            res.send(results);
        })
    }).catch(err=>{
        if (err && err.code && err.code === "ENOENT") {
            // getUnmergedBranches returns ENOENT if we attempt to use a cwd that does not exist.
            res.status(404).send("Invalid workspace: "+workspace);
        } else {
            logger.error("getUnmergedBranches Error",err);
            res.status(500).send(err);
        }
    });
} );

app.use(express.static('public'))

// start the Express server
app.listen( port, () => {
    logger.info( `server started at http://localhost:${ port }` );
} );