import { exec } from "child_process";
import logger from "./logger";

export interface CommitEntry {
    hash: string;
    line: string;
}

export function getUnmergedBranches(workspace : string) : Promise<string[]> {
    return new Promise((res,rej)=>{
        const cmd = 'GIT_SSH_COMMAND="ssh -i ./id_rsa" git --no-pager branch -r --no-merged development';

        logger.debug("getUnmergedBranches",{cmd,cwd:`workspaces/${workspace}`});

        exec(cmd, {cwd:`workspaces/${workspace}`}, (error, stdout, stderr) => {
            if (error) {
                logger.debug(`error: ${error.message}`);
                return rej(error);
            }
            if (stderr) {
                logger.debug(`stderr: ${stderr}`);
                return rej(stderr);
            }
            logger.debug(`stdout: ${stdout}`);
            res(stdout.split(/\r?\n/).map(b=>b.trim()).filter(b=>b.length>0));
        });
    });
}

export function getMergeBase(workspace : string, src : string, dest : string) : Promise<string> {
    return new Promise((res,rej)=>{
        const cmd = `GIT_SSH_COMMAND="ssh -i ./id_rsa" git merge-base ${dest} ${src}`;

        exec(cmd, {cwd:`workspaces/${workspace}`}, (error, stdout, stderr) => {
            if (error) {
                logger.debug(`error: ${error.message}`);
                return rej(error);
            }
            if (stderr) {
                logger.debug(`stderr: ${stderr}`);
                return rej(stderr);
            }
            logger.debug(`stdout: ${stdout}`);
            res(stdout);
        });
    });
}

// org = branch target was branched from
// target = branch to check
export function getFirstCommit(workspace : string, org : string, target : string) : Promise<CommitEntry> {
    return new Promise((res,rej)=>{
        const cmd = `GIT_SSH_COMMAND="ssh -i ./id_rsa" git log ${org}..${target} --oneline`;

        exec(cmd, {cwd:`workspaces/${workspace}`}, (error, stdout, stderr) => {
            if (error) {
                logger.debug(`error: ${error.message}`);
                return rej(error);
            }
            if (stderr) {
                logger.debug(`stderr: ${stderr}`);
                return rej(stderr);
            }
            logger.debug(`stdout: ${stdout}`);
            const lines = stdout.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length > 0);
            const line = lines[lines.length-1]

            const match = /^([\S]+)\s.*$/g.exec(line);
            if (!match) rej("Unparseable response: "+line);
            const hash = match[1];

            res({hash,line}); // return the last line
        });
    });
}

export function getCommitDate(workspace : string, commitHash : string) : Promise<string> {
    return new Promise((res,rej)=>{
        const cmd = `GIT_SSH_COMMAND="ssh -i ./id_rsa" git show -s --format=%ci ${commitHash}`;

        exec(cmd, {cwd:`workspaces/${workspace}`}, (error, stdout, stderr) => {
            if (error) {
                logger.debug(`error: ${error.message}`);
                return rej(error);
            }
            if (stderr) {
                logger.debug(`stderr: ${stderr}`);
                return rej(stderr);
            }
            logger.debug(`stdout: ${stdout}`);
            res(stdout); // return the last line
        });
    });
}