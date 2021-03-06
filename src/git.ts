import { exec, ExecOptions } from "child_process";
import logger from "./logger";

export interface CommitEntry {
    hash: string;
    line: string;
}

export function getUnmergedBranches(workspace : string) : Promise<string[]> {
    return new Promise((res,rej)=>{
        const cmd = 'GIT_SSH_COMMAND="ssh -i ./id_rsa" git --no-pager branch -r --no-merged development';
        logger.debug("getUnmergedBranches",{cmd,cwd:`workspaces/${workspace}`});
        promise_exec(cmd,{cwd:`workspaces/${workspace}`},rej,(stdout)=>{
            res(stdout.split(/\r?\n/).map(b=>b.trim()).filter(b=>b.length>0));
        });
    });
}

export function getMergedBranches(workspace : string, dest : string) : Promise<string[]> {
    return new Promise((res,rej)=>{
        const cmd = `GIT_SSH_COMMAND="ssh -i ./id_rsa" git --no-pager branch -r --merged ${dest}`;
        logger.debug("getMergedBranches",{cmd,cwd:`workspaces/${workspace}`});
        promise_exec(cmd,{cwd:`workspaces/${workspace}`},rej,(stdout)=>{
            res(stdout.split(/\r?\n/).map(b=>b.trim()).filter(b=>b.length>0));
        });
    });
}

export function getMergeBase(workspace : string, src : string, dest : string) : Promise<string> {
    return new Promise((res,rej)=>{
        const cmd = `GIT_SSH_COMMAND="ssh -i ./id_rsa" git merge-base ${dest} ${src}`;
        promise_exec(cmd,{cwd:`workspaces/${workspace}`},rej,res);
    });
}

// org = branch target was branched from
// target = branch to check
export function getFirstCommit(workspace : string, org : string, target : string) : Promise<CommitEntry> {
    return new Promise((res,rej)=>{
        const cmd = `GIT_SSH_COMMAND="ssh -i ./id_rsa" git log ${org}..${target} --oneline`;
        promise_exec(cmd,{cwd:`workspaces/${workspace}`},rej,(stdout)=>{
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
        promise_exec(cmd,{cwd:`workspaces/${workspace}`},rej,res);
    });
}

// cmd: command to run
// opt: options to pass to exec
// rej: rejection handler
// res: stdout handler if no error (res, or transform and res, or check error and rej, etc.)
function promise_exec(cmd: string, opt: ExecOptions, rej: (reason?: any) => void, func: (stdout: string) => void) {
    exec(cmd,opt, (error, stdout, stderr) => {
        if (error) {
            logger.debug(`error: ${error.message}`);
            return rej(error);
        }
        if (stderr) {
            logger.debug(`stderr: ${stderr}`);
            return rej(stderr);
        }
        logger.debug(`stdout: ${stdout}`);
        func(stdout);
    });
}