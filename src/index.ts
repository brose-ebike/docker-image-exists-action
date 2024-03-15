import * as core from '@actions/core';
import * as github from '@actions/github';
import fetch from 'node-fetch';

class DockerImage {
    public registry: string | null
    public name: string
    public tag: string


    constructor(registry: string | null, name: string, tag: string) {
        this.registry = registry
        this.name = name
        this.tag = tag
    }
}

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

function parse(imageName: string): DockerImage {

    const pattern = /(?:([\-\_\.\w]+)$)|(?:([\-\_\.\w]+)\/([\-\_\.\w]+)$)|(?:([\-\.A-z0-9]+)\/([\-\_\.\w]+)\/([\-\_\.\w]+)$)|(?:([\-\.A-z0-9]+)\/([\-\_\.\w]+)\/([\-\_\.\w]+)\/([\-\_\.\w]+)$)/mg;

    let registry = null
    let name = ""
    let tag = "latest"

    let imageNameWithoutTag = imageName
    if (imageName.includes(":")) {
        let parts = imageName.split(":", 2)
        imageNameWithoutTag = parts[0]
        tag = parts[1]
    }

    let groups = imageNameWithoutTag.match(pattern)

    if (groups === null) {
        throw Error("Given image pattern is not a valid docker image name")
    } else if (groups.length === 1) {
        name = `library/${groups[0]}`
    } else if (groups.length === 2) {
        name = `${groups[1]}/${groups[2]}`
    } else if (groups.length === 4) {
        name = `${groups[3]}/${groups[4]}/$groups[5]{groups[5]}`
    } else if (groups.length > 5){
            name = `${groups[6]}/${groups[7]}/${groups[8]}/${groups[9]}`
    } else {
        throw Error(`Given image pattern (${imageNameWithoutTag}) is not a valid docker image name`)
    }








    return new DockerImage(null, imageName, "latest")
}

async function authenticateOnRegistry(registry: string, credentials: RegistryCredentials | null): string {
    // TODO authenticate on registry
    return "token-token-token"
}

async function existsOnDockerHub(image: DockerImage): boolean {
    // Query with public docker hub api
    return false
}

async function existsOnRegistry(image: DockerImage, accessToken: str | null): boolean {
    const request_url = `https://${image.registry}/v2/${image.name}/manifests/${image.tag}`

    // depending on the registry it my helps adding the write accept header :)
    // https://github.com/goharbor/harbor/issues/16075
    headers = {
        "Accept": "application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json",
    }
    if (access_token !== null){
        headers["Authorization"] = `Bearer ${access_token}`
    }
    const response = await fe tch("")
    // TODO parse response correctly
    return false
}


async function exists(image: DockerImage, credentials: RegistryCredential | null): boolean {
    if (image.registry === null){
        return await existsOnDockerHub(image, crecdentials)
    } 

    let accessToken = null
    if (credentials !== null){
        accessToken = await authenticateOnRegistry(image.registry, credentials)
    }
    
    return existsOnRegistry(image, accessToken)
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


// parse_image
//_____________________________________
// def _parse_image(self):
// """
// Parse function to return a docker image is correct by syntax
// """
// if ":" not in self._image_pattern:
//     raise Exception("Image pattern does not contain a tag seperator")

// image_name = self._image_pattern.split(":")[0]
// image_tag = self._image_pattern.split(":")[1].replace("{{version}}", self.target_version)

// match = re.match(PATTERN, image_name)
// if match is None:
//     raise Exception(f"Given image pattern is not a valid docker image name {image_name}")
// logging.debug("regex matched following pattern: " + match.group(0))
// if match.group(1) is not None:
//     logging.debug("regex matched following pattern: " + match.group(1))
//     return DockerImage(None, "library/" + match.group(1), image_tag)
// if match.group(2) is not None:
//     logging.debug("regex matched following pattern: " + match.group(2) + "/" + match.group(3) + " " + image_tag)
//     return DockerImage(None, match.group(2) + "/" + match.group(3), image_tag)
// if match.group(4) is not None:
//     logging.debug(
//         "regex matched following pattern: "
//         + match.group(4)
//         + "/"
//         + match.group(5)
//         + "/"
//         + match.group(6)
//         + " "
//         + image_tag
//     )
//     return DockerImage(match.group(4), match.group(5) + "/" + match.group(6), image_tag)
// return DockerImage(match.group(7), match.group(8) + "/" + match.group(9) + "/" + match.group(10), image_tag)

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
