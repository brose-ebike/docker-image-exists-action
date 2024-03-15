import * as core from '@actions/core';
import * as github from '@actions/github';
import fetch from 'node-fetch';



async function main() {
    // Input
    const image = core.getInput('image');
    const registry = core.getInput('registry');
    const username = core.getInput('username');
    const password = core.getInput('password');
    // Check image
    let exists = false // TODO check if the image exists
    // Return output
    core.setOutput('exists', exists)
}
main().catch((error) => {
    core.setFailed(error.message);
})