import { expect } from 'chai';
import 'mocha';
import { RegistryService } from './registry_service';
import { DockerImage } from './docker_image';

describe('testing the registry service', () => {

  it('nginx exists on docker hub registry with library/nginx', async () =>{
    const service = new RegistryService()
    const image = new DockerImage(null, "nginx", "latest")
    const exists = await service.exists(image)

    expect(exists).to.be.true
  })

  it('grafana/grafana exists on docker hub registry without credentials', async () =>{
    const service = new RegistryService()
    const image = new DockerImage(null, "grafana/grafana", "latest")
    const exists = await service.exists(image)

    expect(exists).to.be.true
  })

  it('grofono/grofono does not exists on docker hub registry', async () =>{
    const service = new RegistryService()
    const image = new DockerImage(null, "grofono/grofono", "1.0.0")
    const exists = await service.exists(image)

    expect(exists).to.be.false
  })

  it('argocd exists on quay.io registry', async () =>{
    const service = new RegistryService()
    const image = new DockerImage("quay.io", "argoproj/argocd", "latest")
    const exists = await service.exists(image)

    expect(exists).to.be.true
  }).timeout(5000)
  
  it('argocd "missing" tag does not exists', async () =>{
    const service = new RegistryService()
    const image = new DockerImage("quay.io", "argoproj/argocd", "missing")
    const exists = await service.exists(image)

    expect(exists).to.be.false
  }).timeout(5000)
  
  it('atlantis existst on ghcr', async () =>{
    const service = new RegistryService()
    const image = new DockerImage("ghcr.io", "runatlantis/atlantis", "v0.27.2")
    const exists = await service.exists(image)

    expect(exists).to.be.true
  }).timeout(5000)

})
