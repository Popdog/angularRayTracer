import { Component } from '@angular/core';
import vec3 from './models/vec3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // tslint:disable:variable-name
  title = 'angularRayTracer';
  minX = 278 - 300;
  maxX = 278 + 300;
  minY = 278 - 300;
  maxY = 278 + 300;
  minZ = -800;
  maxZ = 0;
  minSamples = 1;
  maxSamples = 1000;
  minDepth = 1;
  maxDepth = 100;
  samples = 10;
  depth = 10;
  useBoundingBox = false;
  visualizeBox = false;
  cameraPosition = new vec3([278, 278, -800]);
  minAperture = 0;
  maxAperture = 1.5;
  aperture = 0;
  minFocus = 100;
  maxFocus = 700;
  focus = 500;
  minFov = 20;
  maxFov = 100;
  fov = 40;
  option = 'spheres';
  showSphere2 = false;
  showSphere3 = false;
  set cameraX(x: number) {
    this.cameraPosition = new vec3([x, this.cameraY, this.cameraZ]);
  }
  get cameraX() {
    return this.cameraPosition.x;
  }
  set cameraY(y: number) {
    this.cameraPosition = new vec3([this.cameraX, y, this.cameraZ]);
  }
  get cameraY() {
    return this.cameraPosition.y;
  }
  set cameraZ(z: number) {
    this.cameraPosition = new vec3([this.cameraX, this.cameraY, z]);
  }
  get cameraZ() {
    return this.cameraPosition.z;
  }
  onChange(scene: string) {
    this.option = scene;
  }
}
