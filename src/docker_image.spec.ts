import { expect } from 'chai';
import 'mocha';
import { DockerImage } from './docker_image';

describe('given different image names', () => {

  // nginx
  it('should parse name without slash', () =>{
    const input = "nginx"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("library/nginx")
    expect(result.tag).to.equal("latest") 
  })
  // grafana/grafana
  it('should parse name with one slash', () => {
    const input = "grafana/grafana"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("grafana/grafana")
    expect(result.tag).to.equal("latest")    
  });
  // grafana/grafana:v1.19.0
  it('should parse name with one slash and tag', () => {
    const input = "grafana/grafana:v1.19.0"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("grafana/grafana")
    expect(result.tag).to.equal("v1.19.0")    
  });
  // grafana/grafana:lastest
  it('should parse name with one slash and latest tag', () => {
    const input = "grafana/grafana:latest"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("grafana/grafana")
    expect(result.tag).to.equal("latest")    
  });
  // quay.io/argoproj/argocd:v2.0.0
  it('should parse name with two slashes and tag', () => {
    const input = "qua_y.io/argoproj/argocd:v2.0.0"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("qua_y.io")
    expect(result.name).to.equal("argoproj/argocd")
    expect(result.tag).to.equal("v2.0.0")    
  });

  // qua_y.io/argoproj/argocd:v2.0.0
  it('should parse name with two slashes, a tag and a registry name with underscore', () => {
    const input = "qua_y.io/argoproj/argocd:v2.0.0"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("qua_y.io")
    expect(result.name).to.equal("argoproj/argocd")
    expect(result.tag).to.equal("v2.0.0")    
  });

  // quay.io/argo/proj/argocd
  it('should parse name with two slashes', () => {
    const input = "quay.io/argoproj/argocd"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("quay.io")
    expect(result.name).to.equal("argoproj/argocd")
    expect(result.tag).to.equal("latest")    
  });
  
  // given too long image path
  // // quay.io/argo/proj/argo/argocd
  // it('given too long image path', () => {
  //   const input = "quay.io/argo/proj/argo/argocd"

  //   const result = DockerImage.parse(input);
  //   expect(result.registry).to.equal("quay.io")
  //   expect(result.name).to.equal("argo/proj/argo/argocd")
  //   expect(result.tag).to.equal("latest")    
  // });

});