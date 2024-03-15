export class DockerImage {
    public registry: string | null
    public name: string
    public tag: string


    constructor(registry: string | null, name: string, tag: string) {
        this.registry = registry
        this.name = name
        this.tag = tag
    }


    static parse(imageName: string): DockerImage {

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
            name = `${groups[0]}/${groups[1]}`
        } else if (groups.length === 3) {
            registry = `${groups[0]}`
            name = `${groups[1]}/${groups[2]}`
        } else if (groups.length === 4) {
            registry = `${groups[0]}`
            name = `${groups[1]}/${groups[2]}/${groups[3]}`
        } else if (groups.length === 5){
            registry = `${groups[0]}`
            name = `${groups[1]}/${groups[2]}/${groups[3]}/${groups[4]}`
        } else {
            throw Error(`Given image pattern (${imageNameWithoutTag}) is not a valid docker image name`)
        }

        return new DockerImage(registry, name, tag)
    }
}