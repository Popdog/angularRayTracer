import vec3 from './vec3';
import { Ray } from './ray';
import { HitRecord } from './hitable';
import { getRandomPointInUnitSphere } from '../components/ray-tracer/ray-tracer.component';

export class Isotropic {
    albedo: vec3;
    constructor(albedo?: vec3) {
        this.albedo = albedo || new vec3([0.5, 0.5, 0.5]);
    }
    scatter(rayIn: Ray, record: HitRecord): HitRecord {
        record.scattered = new Ray(record.p, getRandomPointInUnitSphere());
        record.attenuation = this.albedo;
        return record;
    }
    emit(): vec3 {
        return new vec3();
    }
}
