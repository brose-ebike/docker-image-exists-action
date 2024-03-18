import { expect } from 'chai';
import exp from 'constants';
import 'mocha';
import { DockerImage } from './docker_image';

describe('given different image lengths', () => {

  // nginx
  it('should check for single image name', () =>{
    const input = "nginx"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("library/nginx")
    expect(result.tag).to.equal("latest") 
  })
  // grafana/grafana
  it('should check for single image name with repository', () => {
    const input = "grafana/grafana"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("grafana/grafana")
    expect(result.tag).to.equal("latest")    
  });
  // grafana/grafana:v1.19.0
  it('should check for single image name with repository and version tag', () => {
    const input = "grafana/grafana:v1.19.0"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("grafana/grafana")
    expect(result.tag).to.equal("v1.19.0")    
  });
  // grafana/grafana:lastest
  it('should check for repo, image name and latest tag', () => {
    const input = "grafana/grafana:latest"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal(null)
    expect(result.name).to.equal("grafana/grafana")
    expect(result.tag).to.equal("latest")    
  });
  // quay.io/argoproj/argocd:v2.0.0
  it('should check for registry, repo, image name and version tag', () => {
    const input = "qua_y.io/argoproj/argocd:v2.0.0"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("qua_y.io")
    expect(result.name).to.equal("argoproj/argocd")
    expect(result.tag).to.equal("v2.0.0")    
  });

  // qua_y.io/argoproj/argocd:v2.0.0
  it('should check if registry can contain "_"', () => {
    const input = "qua_y.io/argoproj/argocd:v2.0.0"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("qua_y.io")
    expect(result.name).to.equal("argoproj/argocd")
    expect(result.tag).to.equal("v2.0.0")    
  });

  // quay.io/argo/proj/argocd
  it('should check if long imageName without version tag', () => {
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