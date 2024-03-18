import { expect } from 'chai';
import 'mocha';
import { WwwAuthenticateHeader } from './authenticate_header';

describe('given a valid authenticate header value', () => {

    it('should be parsed', () =>{
      const input = "nginx"
    
      const result = WwwAuthenticateHeader.parse(input);
      expect(result.realm).to.equal(null)
      expect(result.scope).to.equal("library/nginx")
      expect(result.service).to.equal("latest") 
    })
})

describe('given an invalid authenticate header value', () => {

    it('should not be parsed', () =>{
      const input = "nginx"
    
      const result = WwwAuthenticateHeader.parse(input);
      expect(result.realm).to.equal(null)
      expect(result.scope).to.equal("library/nginx")
      expect(result.service).to.equal("latest") 
    })
})