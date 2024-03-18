import { WwwAuthenticateHeader } from "./authenticate_header"
import { DockerImage } from "./docker_image"
import { RegistryCredentials } from "./registry_credentials"

async function authenticateOnRegistry(header: WwwAuthenticateHeader, credentials: RegistryCredentials | null): Promise<string> {
    const params = {
        "scope": header.scope,
        "grant_type": "password",
        "service": header.service,
        "client_id": "docker-image-exists-github-action",
        "access_type": "offline",
    }

    const paramsList = []
    for (const [key, value] of Object.entries(params)) {
        paramsList.push(`${key}=${encodeURIComponent(value)}`)
    }

    const requestUrl = `${header.realm}?${paramsList.join("&")}`
    const headers: any = {}
    if (credentials !== null) {
        headers["Authorization"] = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
    }
    const response = await fetch(requestUrl, {
        headers: headers,
    })


    if (response.status == 200) {
        const tokenData = await response.json() as any
        let accessToken = null
        if (tokenData.hasOwnProperty("token")) {
            accessToken = tokenData["token"]
        } else if (tokenData.hasOwnProperty("access_token")) {
            accessToken = tokenData["access_token"]
        } else {
            throw new Error("No Access_Token found in response body")
        }
        return accessToken
    } else if (response.status == 401) {
        //logging.error("Authentication failed: %d with %s", response.status, response.headers)
        throw new Error(`Error occurred: Unauthenticated: ${response.status}`)
    } if (response.status == 403) {
        //logging.error("Authorization failed: %d with %s", response.status, response.headers)
        throw new Error(`Error occurred: Unauthorized: ${response.status}`)
    } if (response.status == 404) {
        //logging.error("Nothing Found:  %d with %s", response.status, response.headers)
        throw new Error(`Error occurred: Nothing Found: ${response.status}`)
    }
    throw new Error(`Unexpected Status Code ${response.status}`)
}

async function existsOnDockerHub(image: DockerImage): Promise<boolean> {
    
    const url = `https://hub.docker.com/v2/repositories/${image.getDockerHubName()}/tags?page_size=10000`

    const response = await fetch(url)
    if (response.status === 404) {
        return false
    } else if (response.status != 200) {
        throw new Error(`Unexpected status: ${response.status} for url: ${url}`)
    }
    const body = (await response.json()) as any
    for (const tag of body["results"]) {
        if (tag["name"] == image.tag) {
            return true
        }
    }
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
        const headerValue = response.headers.get("Www-Authenticate")
        if (headerValue === null) {
            throw new Error("Www-Authenticate header does not exist")
        }
        const authenticateHeader = WwwAuthenticateHeader.parse(headerValue)
        accessToken = await authenticateOnRegistry(authenticateHeader, credentials)
        return existsOnRegistry(image, credentials, accessToken)
    } else if (response.status == 200) {
        return true
    } else if (response.status == 404) {
        return false
    }
    throw Error(`Unexpected status: ${response.status} for url ${requestUrl}`)
}

export class RegistryService{

    public async exists(image: DockerImage, credentials: RegistryCredentials | null = null) {
        if (image.registry === null) {
            return await existsOnDockerHub(image)
        }
        return existsOnRegistry(image, credentials)
    }
}