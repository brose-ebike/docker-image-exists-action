import { expect } from 'chai';
import 'mocha';
import { DockerImage } from './docker_image';
import exp from 'constants';

describe('GitHub job state', () => {

  // nginx
  // grafana/grafana
  // quay.io/argoproj/argocd
  // qua_y.io/argoproj/argocd

  // quay.io/argo/proj/argocd
  it('should convert success to 0', () => {
    const input = "quay.io/argoproj/argocd"
  
    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("quay.io")
    expect(result.name).to.equal("argoproj/argocd")
    expect(result.tag).to.equal("latest")    
  });
  
  // quay.io/argo/proj/argo/argocd
  it('should convert success to 0', () => {
    const input = "quay.io/argo/proj/argo/argocd"

    const result = DockerImage.parse(input);
    expect(result.registry).to.equal("quay.io")
    expect(result.name).to.equal("argo/proj/argo/argocd")
    expect(result.tag).to.equal("latest")    
  });

});