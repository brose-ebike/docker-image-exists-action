import * as core from '@actions/core';
import * as github from '@actions/github';
import { group } from 'console';
import fetch from 'node-fetch';



class RegistryCredentials {
    public registry: string
    public username: string
    public password: string

    constructor(registry: string, username: string, password: string) {
        this.registry = registry
        this.username = username
        this.password = password
    }
}

class WwwAuthenticateHeader {
    public realm: string
    public scope: string
    public service: string

    constructor(realm: string, scope: string, service: string) {
        this.realm = realm
        this.scope = scope
        this.service = service
    }

    let groups = imageNameWithoutTag.match(pattern)

    if (groups === null) {
        throw Error("Given image pattern is not a valid docker image name")
    } else if (groups.length === 1) {
        name = `library/${groups[0]}`
    } else if (groups.length === 2) {
        name = `${groups[0]}/${groups[1]}`
    } else if (groups.length === 3) {
        registry = `${groups[0]}`
        name = `${groups[1]}/${groups[2]}`
    } else if (groups.length === 4) {
        registry = `${groups[0]}`
        name = `${groups[1]}/${groups[2]}/${groups[3]}`
    } else if (groups.length > 5){
        registry = `${groups[0]}`
        name = `${groups[1]}/${groups[2]}/${groups[3]}/${groups[4]}`
    } else {
        throw Error(`Given image pattern (${imageNameWithoutTag}) is not a valid docker image name`)
    }

    return new DockerImage(registry, name, tag)
    static parse(value: string): WwwAuthenticateHeader {
        const realm = value.split('realm="')[1].split('"')[0]
        const service = value.split('service="')[1].split('"')[0]
        const scope = value.split('scope="')[1].split('"')[0]
        return new WwwAuthenticateHeader(realm, scope, service)
    }
}



async function existsOnDockerHub(image: DockerImage): Promise<boolean> {
    // Query with public docker hub api
    return false
}

async function existsOnRegistry(image: DockerImage, credentials: RegistryCredentials | null, accessToken: string | null = null): Promise<boolean> {
    const requestUrl = `https://${image.registry}/v2/${image.name}/manifests/${image.tag}`

    // depending on the registry it my helps adding the write accept header :)
    // https://github.com/goharbor/harbor/issues/16075
    let headers: any = {
        "Accept": "application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json",
    }
    if (accessToken !== null) {
        headers["Authorization"] = `Bearer ${accessToken}`
    }
    const response = await fetch(requestUrl, {
        headers: headers
    })
    if (response.status == 401 && accessToken === null) {
        const authenticateHeader = WwwAuthenticateHeader.parse(response)
        accessToken = self._authenticate_on_registry(registry, header_value)
        return existsOnRegistry(image, credentials, accessToken)
    } else if (response.status == 200) {
        return true
    } else if (response.status == 404) {
        return false
    }
    throw Error(`Unexpected status: ${response.status} for url ${requestUrl}`)
}

async function exists(image: DockerImage, credentials: RegistryCredentials | null): Promise<boolean> {
    if (image.registry === null) {
        return await existsOnDockerHub(image)
    }
    return existsOnRegistry(image, credentials)
}

async function main() {
    // Input
    const imageName = core.getInput('image');
    const registry = core.getInput('registry');
    const username = core.getInput('username');
    const password = core.getInput('password');
    // Parse image name and check registries
    let image = parse(imageName)
    if (image.registry !== null && registry !== null && image.registry !== registry) {
        throw Error("Registry mismatch, the registry in the image name has to match the registry input")
    }
    // Check if image exist s
    let exists = false // TODO check if the image exists
    // Return output
    core.setOutput('exists', exists)
}
main().catch((error) => {
    core.setFailed(error.message);
})

// class WwwAuthenticateHeader:
// def __init__(self, realm: str, scope: str, service: str) -> None:
// self.realm = realm
// self.scope = scope
// self.service = service

// @classmethod
// def parse(cls, response):
// authenticate = response.headers["Www-Authenticate"]
// realm = authenticate.split('realm="')[1].split('"')[0]
// service = authenticate.split('service="')[1].split('"')[0]
// scope = authenticate.split('scope="')[1].split('"')[0]
// return WwwAuthenticateHeader(realm, scope, service)


// authenticate_at_registry
//___________________________
// def _authenticate_on_registry(self, registry: str, authentication_header: WwwAuthenticateHeader) -> str:
// params = {
//     "scope": authentication_header.scope,
//     "grant_type": "password",
//     "service": authentication_header.service,
//     "client_id": "lennybot",
//     "access_type": "offline",
// }

// url = f"{authentication_header.realm}?{urlencode(params)}"

// if registry in self._container_config.registries.keys():
//     registry_data = self._container_config.registries[registry]
//     username = registry_data.username
//     password = registry_data.password
//     if "<REDACTED>" in [username, password]:
//         logging.warning(
//             "Either username or password contain '<REDACTED>' and probably have not been overwritten"
//         )
//     response = requests.get(url, auth=(username, password))
// else:
//     logging.debug("Registry not found in config")
//     response = requests.get(url)

// if response.status_code == 200:
//     token_data = response.json()

//     access_token = None
//     if "token" in token_data.keys():
//         access_token = token_data.get("token")
//     elif "access_token" in token_data.keys():
//         access_token = token_data.get("access_token")
//     else:
//         raise Exception("No Access_Token found in response body")

//     return str(access_token)

// if response.status_code == 401:
//     logging.error("Authentication failed: %d with %s", response.status_code, response.headers)
//     raise Exception("Error occurred: Unauthenticated: ", response.status_code)

// if response.status_code == 403:
//     logging.error("Authorization failed: %d with %s", response.status_code, response.headers)
//     raise Exception("Error occurred: Unauthorization: ", response.status_code)

// if response.status_code == 404:
//     logging.error("Nothing Found:  %d with %s", response.status_code, response.headers)
//     raise Exception("Error occurred: Nothing Found: ", response.status_code)

// raise Exception("Unexpected Status Code", response.status_code)

// exists_on_dockerhub
// _________________________________
// def _exists_on_docker_hub(self, image: DockerImage):
// """
// Checks if the given Docker file exists on DockerHub
// """
// url = f"https://hub.docker.com/v2/repositories/{image._name}/tags?page_size=10000"
// response = requests.get(url)
// if response.status_code != 200:
//     raise Exception(f"Unexpected status: {response.status_code} for url: {url}")

// for tag in response.json()["results"]:
//     if tag["name"] == image._tag:
//         return True
// return False

// exists_on_registry
//_______________________________________
// def _exists_on_registry(self, image: DockerImage, access_token: Optional[str] = None) -> bool:
// """
// Checks if the given Docker file exists on that perticular registry.
// Also authenticated requests are handled within this function by providing an access token.
// """
// if image._registry is None:
//     raise Exception("registry must be set and not be None")

// request_url = f"https://{image._registry}/v2/{image._name}/manifests/{image._tag}"

// # depending on the registry it my helps adding the write accept header :)
// # https://github.com/goharbor/harbor/issues/16075
// headers = {
//     "Accept": "application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json",
// }
// if access_token is not None:
//     headers["Authorization"] = f"Bearer {access_token}"
// response = requests.get(request_url, headers=headers)

// if response.status_code == 401 and access_token is None:
//     registry = image._registry
//     header_value = WwwAuthenticateHeader.parse(response)
//     access_token = self._authenticate_on_registry(registry, header_value)

//     return self._exists_on_registry(image, access_token)
// if response.status_code == 200:
//     return True
// if response.status_code == 404:
//     return False
// raise Exception(f"Unexpected status: {response.status_code} for url {request_url}")
