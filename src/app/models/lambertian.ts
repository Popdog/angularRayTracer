import vec3 from './vec3';
import { HitRecord } from './hitable';
import { Ray } from './ray';
import { getRandomPointInUnitSphere } from '../components/ray-tracer/ray-tracer.component';

export class Lambertian {
    albedo: vec3;
    constructor(albedo?: vec3) {
        this.albedo = albedo || new vec3();
    }
    scatter(rayIn: Ray, record: HitRecord): HitRecord {
        const target = new vec3();
        record.p.copy(target);
        target.add(record.normal);
        target.add(getRandomPointInUnitSphere());
        record.scattered = new Ray(record.p, vec3.difference(target, record.p));
        record.attenuation = this.albedo;
        return record;
    }
    emit(): vec3 {
        return new vec3();
    }
}
