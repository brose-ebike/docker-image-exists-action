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