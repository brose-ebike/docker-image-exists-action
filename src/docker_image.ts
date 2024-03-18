export class DockerImage {
    
    public registry: string | null
    public name: string
    public tag: string


    constructor(registry: string | null, name: string, tag: string) {
        this.registry = registry
        this.name = name
        this.tag = tag
    }

    getDockerHubName() {
        if(!this.name.includes("/")){
            return `library/${this.name}`
        }
        return this.name
    }

    static parse(imageName: string): DockerImage {

        const pattern = /(?:^([\-\_\.\w]+)$)|(?:^([\-\_\.\w]+)\/([\-\_\.\w]+)$)|(?:^([\-\.A-z0-9]+)\/([\-\_\.\w]+)\/([\-\_\.\w]+)$)|(?:^([\-\.A-z0-9]+)\/([\-\_\.\w]+)\/([\-\_\.\w]+)\/([\-\_\.\w]+)$)/m;

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
            throw Error(`Given image pattern (${imageNameWithoutTag}) is not a valid docker image name`)
        } else if (groups[1] != null) {
            name = `library/${groups[1]}`
        } else if (groups[2] != null) {
            name = `${groups[2]}/${groups[3]}`
        } else if (groups[4] != null) {
            registry = groups[4]
            name = `${groups[5]}/${groups[6]}`
        } else if (groups[7] != null) {
            registry = groups[7]
            name = `${groups[8]}/${groups[9]}/${groups[10]}`
        } else {
            throw Error(`Given image pattern (${imageNameWithoutTag}) is not a valid docker image name`)
        }

        return new DockerImage(registry, name, tag)
    }
}