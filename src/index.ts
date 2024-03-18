import * as core from '@actions/core';
import * as github from '@actions/github';
import { DockerImage } from './docker_image';
import { RegistryService } from './registry_service';
import { RegistryCredentials } from './registry_credentials';
import { use } from 'chai';


function getInput(name: string): string | null {
    const value = core.getInput(name)
    if (value === null || value === "") {
        return null
    }
    return value
}

async function main() {
    // Input
    const imageName = getInput('image');
    const registry = getInput('registry');
    const username = getInput('username');
    const password = getInput('password');

    if(imageName === null){
        throw new Error("The Input 'image' is mandatory!")
    }

    // Business Logic Initialization
    const service = new RegistryService()
    // Parse image name and check registries
    let image = DockerImage.parse(imageName)
    if (image.registry === null && registry !== null) {
        image.registry = registry
    }
    // Ensure the registry is handled correctly
    if (image.registry !== null && registry !== null && image.registry !== registry) {
        throw Error("Registry mismatch, the registry in the image name has to match the registry input")
    }
    // Create credentials object if available
    let credentials = null
    if (registry !== null && username !== null && password !== null) {
        credentials = new RegistryCredentials(registry, username, password)
    }
    // Check if image exists
    let exists = await service.exists(image, credentials)
    // Return output
    core.setOutput('exists', exists)
}

main().catch((error) => {
    core.setFailed(error.message);
})
