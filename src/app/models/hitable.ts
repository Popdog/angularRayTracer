import vec3 from './vec3';
import { Ray } from './ray';
import { Material } from './material';
import { Lambertian } from './lambertian';

export interface Hitable {
    bounds: Bounds;
    hit(r: Ray, tMin: number, tMax: number): HitRecord;
    // sample(): vec3;
}

export class HitRecord {
    t: number;
    p: vec3;
    normal: vec3;
    mat: Material;
    attenuation: vec3;
    scattered: Ray;
    constructor(t?: number, p?: vec3, normal?: vec3, mat?: Material, attenuation?: vec3, scattered?: Ray) {
        this.t = t || 0;
        this.p = p || new vec3();
        this.normal = normal || new vec3();
        this.mat = mat || new Lambertian();
        this.attenuation = attenuation || new vec3();
        this.scattered = scattered || new Ray();
    }
}

export interface Bounds {
    min: vec3;
    max: vec3;
}
