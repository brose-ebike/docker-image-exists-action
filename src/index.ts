import * as core from '@actions/core';
import * as github from '@actions/github';
import { group } from 'console';
import fetch from 'node-fetch';
import { DockerImage } from './docker_image'
import { WwwAuthenticateHeader } from './authenticate_header'
import { RegistryService } from './registry_service';

async function main() {
    // Input
    const imageName = core.getInput('image');
    const registry = core.getInput('registry');
    const username = core.getInput('username');
    const password = core.getInput('password');
    // Business Logic Initialization
    const service = new RegistryService()
    // Parse image name and check registries
    let image = DockerImage.parse(imageName)
    if (image.registry === null && registry !== null){
        image.registry = registry
    }
    // Ensure the registry is handled correctly
    if (image.registry !== null && registry !== null && image.registry !== registry) {
        throw Error("Registry mismatch, the registry in the image name has to match the registry input")
    }
    // Create credentials object if available
    let credentials = null
    if (registry !== null && username !== null && password !== null){
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
