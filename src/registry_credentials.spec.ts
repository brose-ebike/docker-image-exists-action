import { expect } from 'chai';
import 'mocha';
import { RegistryCredentials } from './registry_credentials';

describe('given registry credentials have three properties', () => {

  it('should provide a constructor for them', () => {
    const registry = "test.example.com"
    const username = "admin"
    const password = "test123"

    const result = new RegistryCredentials(registry, username, password);
    expect(result.registry).to.equal(registry)
    expect(result.username).to.equal(username)
    expect(result.password).to.equal(password)
  })
});