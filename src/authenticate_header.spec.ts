import { expect } from 'chai';
import 'mocha';
import { WwwAuthenticateHeader } from './authenticate_header';

describe('given a valid authenticate header value', () => {
    it('should be parsed', () =>{
      const input = 'Bearer realm="https://ghcr.io/token",service="ghcr.io",scope="repository:runatlantis/atlantis:pull"'
    
      const result = WwwAuthenticateHeader.parse(input);
      expect(result.realm).to.equal("https://ghcr.io/token")
      expect(result.scope).to.equal("repository:runatlantis/atlantis:pull")
      expect(result.service).to.equal("ghcr.io") 
    })
})
