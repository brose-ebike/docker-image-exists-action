export class WwwAuthenticateHeader {
    public realm: string
    public scope: string
    public service: string

    constructor(realm: string, scope: string, service: string) {
        this.realm = realm
        this.scope = scope
        this.service = service
    }

    static parse(value: string): WwwAuthenticateHeader {
        const realm = value.split('realm="')[1].split('"')[0]
        const service = value.split('service="')[1].split('"')[0]
        const scope = value.split('scope="')[1].split('"')[0]
        return new WwwAuthenticateHeader(realm, scope, service)
    }
}
