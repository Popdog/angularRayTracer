import { Component, ViewChild, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import vec3 from 'src/app/models/vec3';
import { Ray } from 'src/app/models/ray';
import { Hitable, HitRecord } from 'src/app/models/hitable';
import { Sphere } from 'src/app/models/sphere';
import { HitableList } from 'src/app/models/hitable-list';
import { Camera } from 'src/app/models/camera';
import { Metal } from 'src/app/models/metal';
import { Lambertian } from 'src/app/models/lambertian';
import { Dielectric } from 'src/app/models/dielectric';
import { BoundingBox } from 'src/app/models/bounding-box';
import { DiffuseLight } from 'src/app/models/diffuse-light';
import { XyRect } from 'src/app/models/xy-rect';
import { Meta } from '@angular/platform-browser';
import { YzRect } from 'src/app/models/yz-rect';
import { FlipNormals } from 'src/app/models/flip-normals';
import { XzRect } from 'src/app/models/xz-rect';
import { ConstantMedium } from 'src/app/models/constant-medium';
import { Isotropic } from 'src/app/models/isotropic';
// tslint:disable:variable-name
@Component({
  selector: 'app-ray-tracer',
  templateUrl: './ray-tracer.component.html',
  styleUrls: ['./ray-tracer.component.scss']
})
export class RayTracerComponent implements AfterViewInit {
  timer: any;
  canvasWidth = 1000;
  canvasHeight = 500;
  boundingBox: BoundingBox = null;
  hide = false;
  _option = 'spheres';
  @Input() set option(scene: string) {
    this._option = scene;
    this.updateDetected();
  }
  get option() {
    return this._option;
  }
  _showSphere2 = false;
  @Input() set showSphere2(show: boolean) {
    this._showSphere2 = show;
    this.updateDetected();
  }
  get showSphere2() {
    return this._showSphere2;
  }
  _showSphere3 = false;
  @Input() set showSphere3(show: boolean) {
    this._showSphere3 = show;
    this.updateDetected();
  }
  get showSphere3() {
    return this._showSphere3;
  }

  _useBoundingBox = false;
  @Input() set useBoundingBox(use: boolean) {
    this._useBoundingBox = use;
    this.updateDetected();
  }
  get useBoundingBox() {
    return this._useBoundingBox;
  }

  _visualiseBox = false;
  @Input() set visualizeBox(v: boolean) {
    this._visualiseBox = v;
    this.updateDetected();
  }
  get visualizeBox() {
    return this._visualiseBox;
  }

  _maxDepth = 10;
  @Input() set maxDepth(d: number) {
    this._maxDepth = d;
    this.updateDetected();
  }
  get maxDepth() {
    return this._maxDepth;
  }
  _lookfrom = new vec3([278, 278, -800]);
  @Input() set lookFrom(l: vec3) {
    if (l) {
      l.copy(this._lookfrom);
      this.updateDetected();
    }
  }
  get lookFrom() {
    return this._lookfrom;
  }

  _lookat = new vec3([278, 278, 0]);
  @Input() set lookAt(l: vec3) {
    if (l) {
      l.copy(this._lookat);
      this.updateDetected();
    }
  }
  get lookAt() {
    return this._lookat;
  }

  _up = new vec3([0, 1, 0]);
  @Input() set up(u: vec3) {
    if (u) {
      u.copy(this._up);
      this.updateDetected();
    }
  }
  get up() {
    return this._up;
  }

  _fov = 40;
  @Input() set fov(f: number) {
    this._fov = f;
    this.updateDetected();
  }
  get fov() {
    return this._fov;
  }

  _aspect = 2;
  @Input() set aspect(a: number) {
    this._aspect = a;
    this.updateDetected();
  }
  get aspect() {
    return this._aspect;
  }

  w = 250;
  set width(width: number) {
    this.w = width;
    this.updateDetected();
  }
  get width() {
    return this.w;
  }
  h = 125;
  set height(height: number) {
    this.h = height;
    this.updateDetected();
  }
  get height() {
    return this.h;
  }
  ns = 10;
  @Input() set numSamples(n: number) {
    this.ns = n;
    this.updateDetected();
  }
  get numSamples() {
    return this.ns;
  }
  _aperture = 0;
  @Input() set aperture(a: number) {
    this._aperture = a;
    this.updateDetected();
  }
  get aperture() {
    return this._aperture;
  }

  _focus = 500;
  @Input() set focus(f: number) {
    this._focus = f;
    this.updateDetected();
  }
  get focus() {
    return this._focus;
  }
  rectColor = '#FF0000';
  context: CanvasRenderingContext2D;
  @ViewChild('canvas') c: any;

  constructor(private changeDetector: ChangeDetectorRef) { }

  getSky(r: Ray): vec3 {
    const normalizedDirection = new vec3();
    r.direction.copy(normalizedDirection);
    normalizedDirection.normalize();
    const t = 0.5 * (normalizedDirection.y + 1);
    const whiteVector = new vec3([1, 1, 1]);
    whiteVector.scale(1 - t);
    const blueVector = new vec3([0.5, 0.7, 1]);
    blueVector.scale(t);
    return whiteVector.add(blueVector);
  }

  color(r: Ray, world: HitableList, depth: number): vec3 {
    const record: HitRecord = world.hit(r, 0.001, 9999999);
    if (record) {
      const materialRec = record.mat.scatter(r, record);
      const emitted = record.mat.emit();
      if (materialRec && depth < this.maxDepth) {
        return vec3.sum(emitted, this.color(materialRec.scattered, world, depth + 1)).multiply(materialRec.attenuation);
      } else {
        return emitted;
      }
    } else {
      if (this.option === 'cornellBox') {
        return new vec3();
      } else {
        return this.getSky(r);
      }
    }
  }

  ngAfterViewInit() {
    const canvas = this.c.nativeElement;
    this.context = canvas.getContext('2d');
    setTimeout(() => {
      this.render();
    }, 50);
  }

  updateDetected() {
    this.hide = true;
    this.changeDetector.detectChanges();
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.render();
    }, 500);
  }

  render() {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);
    const list: Hitable[] = [];
    const lights: Hitable[] = [];
    // tslint:disable-next-line:max-line-length
    const cam = new Camera(this.lookFrom, this.lookAt, this.up, this.fov, this.width / this.height, this.aperture, this.focus);
    const green = new Lambertian(new vec3([0.12, 0.45, 0.15]));
    const red = new Lambertian(new vec3([0.65, 0.05, 0.05]));
    const white = new Lambertian(new vec3([0.73, 0.73, 0.73]));
    const light = new DiffuseLight(new vec3([0.50, 0.50, 0.50]), new vec3([15, 15, 15]));
    const metal = new Metal(new vec3([0.65, 0.05, 0.05]), 0.2);
    const dielectric = new Dielectric(1.2);
    const dullMetal = new Metal(new vec3([0.05, 0.05, 0.65]), 0.8);
    const smokeMat = new Isotropic(new vec3([0.5, 0.5, 0.5]));
    const smokeSphere = new ConstantMedium(0.01, new Sphere(new vec3([200, 350, 0]), 100, smokeMat), white);
    if (this.option === 'cornellBox') {
      list.push(new FlipNormals(new YzRect(0, 555, 0, 555, 555, green)));
      list.push(new YzRect(0, 555, 0, 555, 0, red));
      list.push(new XzRect(200, 400, 200, 400, 554, light));
      list.push(new FlipNormals(new XzRect(0, 555, 0, 555, 555, white)));
      list.push(new XzRect(0, 555, 0, 555, 0, white));
      list.push(new FlipNormals(new XyRect(0, 555, 0, 555, 555, white)));
      list.push(new Sphere(new vec3([150, 150, 300]), 150, metal));
      if (this.showSphere2) {
        list.push(smokeSphere);
      }
      if ( this.showSphere3) {
        list.push(new Sphere(new vec3([400, 100, 250]), -100, dielectric));
      }
    } else {
      list.push(smokeSphere);
      // list.push(new Sphere(new vec3([400, 400, 200]), 150, dullMetal));
      if (this.showSphere2) {
        list.push(new Sphere(new vec3([150, 150, 200]), 150, metal));
      }
      if (this.showSphere3) {
        list.push(new Sphere(new vec3([400, 100, 250]), -100, dielectric));
      }
    }

    const world = new HitableList(list, lights);
    if (this.useBoundingBox) {
      this.boundingBox = new BoundingBox(world);
    }
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        const col = new vec3();
        // Hit bounding box
        let boundingHit: HitRecord = null;
        const testU = i / this.width;
        const testV = j / this.height;
        const testR = cam.getRay(testU, testV);
        if (this.useBoundingBox) {
          boundingHit = this.boundingBox.hit(testR, 0.001, 999999);
        }
        if (!this.useBoundingBox || boundingHit) {
          for (let s = 0; s < this.numSamples; s++) {
            const u = (i + Math.random() - 0.5) / this.width;
            const v = (j + Math.random() - 0.5) / this.height;
            const r = cam.getRay(u, v);
            col.add(this.color(r, world, 0));
          }
          col.scale(1 / this.numSamples);
        } else {
          if (this.visualizeBox) {
            const visualizationColor = new vec3([0.8, 0.1, 0.1]);
            visualizationColor.copy(col);
          } else {
            if (this.option === 'cornellBox') {
              col.x = 0;
              col.y = 0;
              col.z = 0;
            } else {
              const skyColor = this.getSky(testR);
              skyColor.copy(col);
            }
          }
        }
        const ir = 255.99 * col.x;
        const ig = 255.99 * col.y;
        const ib = 255.99 * col.z;
        ctx.fillStyle = 'rgb(' + ir + ',' + ig + ',' + ib + ')';
        ctx.fillRect(i, this.height - (j + 1), 1, 1);
      }
    }
    this.hide = false;
  }

}

export function getRandomPointInUnitSphere(): vec3 {
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random());
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const x = r * sinPhi * cosTheta;
  const y = r * sinPhi * sinTheta;
  const z = r * cosPhi;
  return new vec3([x, y, z]);
}

export function reflect(vec: vec3, norm: vec3) {
  const v = new vec3();
  vec.copy(v);
  const n = new vec3();
  norm.copy(n);
  return vec3.difference(v, n.scale(2 * vec3.dot(v, n)));
}

export function refract(vec: vec3, norm: vec3, niOverNt: number): vec3 {
  const v = new vec3();
  vec.copy(v);
  const n = new vec3();
  norm.copy(n);
  const uv = new vec3();
  v.copy(uv);
  uv.normalize();
  const dt = vec3.dot(uv, n);
  const discriminant = 1 - ((niOverNt * niOverNt) * (1 - (dt * dt)));
  if (discriminant > 0) {
    const tempN = new vec3();
    n.copy(tempN);
    const refracted = vec3.difference(uv, tempN.scale(dt));
    refracted.scale(niOverNt);
    refracted.subtract(n.scale(Math.sqrt(discriminant)));
    return refracted;
  } else {
    return null;
  }
}

export function schlick(cosine: number, refIdx: number) {
  let r0 = (1 - refIdx) / (1 + refIdx);
  r0 = r0 * r0;
  return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
}

export function getRandomPointInUnitCircle() {
  let theta: number;
  let r: number;

  const a = 2 * Math.random() - 1;
  const b = 2 * Math.random() - 1;

  if (a === 0 && b === 0) {
    return new vec3();
  }

  if (Math.abs(a) > Math.abs(b)) {
    r = a;
    theta = (Math.PI / 4) * (b / a);
  } else {
    r = b;
    theta = (Math.PI / 2) - ((Math.PI / 4) * (a / b));
  }
  return new vec3([r * Math.cos(theta), r * Math.sin(theta), 0]);
}
