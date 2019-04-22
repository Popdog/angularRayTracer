import vec3 from './vec3';
import { HitRecord } from './hitable';
import { Ray } from './ray';
import { getRandomPointInUnitSphere } from '../components/ray-tracer/ray-tracer.component';

export class DiffuseLight {
    emittance: vec3;
    albedo: vec3;
    constructor(a?: vec3, e?: vec3) {
        this.albedo = a || new vec3();
        this.emittance = e || new vec3([1, 1, 1]);
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
        return this.emittance;
    }
}
