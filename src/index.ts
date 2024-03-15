import * as core from '@actions/core';
import * as github from '@actions/github';
import fetch from 'node-fetch';

class DockerImage{
    public registry: string | null = ""
    public name: string = ""
    public tag: string = ""

    constructor(registry: string | null, name: string, tag: string){
        this.registry = registry
        this.name = name
        this.tag = tag
    }
}

function parse(imageName: string): DockerImage{
    // TODO parse parts of the image
    return new DockerImage(null, imageName, "latest")
}

async function main() {
    // Input
    const imageName = core.getInput('image');
    const registry = core.getInput('registry');
    const username = core.getInput('username');
    const password = core.getInput('password');
    // Parse image name and check registries
    let image = parse(imageName)
    if (image.registry !== null && registry !== null && image.registry !== registry){
        throw Error("Registry mismatch, the registry in the image name has to match the registry input")
    }
    // Check if image exists
    let exists = false // TODO check if the image exists
    // Return output
    core.setOutput('exists', exists)
}
main().catch((error) => {
    core.setFailed(error.message);
})