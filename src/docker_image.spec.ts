import { expect } from 'chai';
import 'mocha';
import { parse, DockerImage } from './index';
import exp from 'constants';

describe('GitHub job state', () => {

// nginx
// grafana/grafana
// quay.io/argoproj/argocd
// qua_y.io/argoproj/argocd
// quay.io/argo/proj/argocd
// quay.io/argo/proj/argo/argocd

  it('should convert success to 0', () => {
    const input = "quay.io/argoproj/argocd"

    const result = parse(input);
    expect(DockerImage.registry).to.equal("quay.io")
    expect(DockerImage.name).to.equal("argoproj/argocd")
    expect(DockerImage.tag).to.equal("latest")    
  });

});