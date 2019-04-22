import { Ray } from './ray';
import { HitRecord } from './hitable';
import vec3 from './vec3';
import { reflect, refract, schlick } from '../components/ray-tracer/ray-tracer.component';

export class Dielectric {
    refIdx: number;
    constructor(idx?: number) {
        this.refIdx = idx || 1;
    }
    scatter(rayIn: Ray, record: HitRecord): HitRecord {
        const outwardNormal = new vec3();
        const reflected = reflect(rayIn.direction, record.normal);
        let niOverT = 0;
        record.attenuation = new vec3([1, 1, 1]);
        let refracted: vec3;
        let reflectProb = 0;
        let cosine = 0;
        if (vec3.dot(rayIn.direction, record.normal) > 0) {
            record.normal.copy(outwardNormal);
            outwardNormal.scale(-1);
            niOverT = this.refIdx;
            cosine = this.refIdx * vec3.dot(rayIn.direction, record.normal) / rayIn.direction.length();
        } else {
            record.normal.copy(outwardNormal);
            niOverT = 1 / this.refIdx;
            cosine = -vec3.dot(rayIn.direction, record.normal) / rayIn.direction.length();
        }
        refracted = refract(rayIn.direction, outwardNormal, niOverT);
        if (refracted) {
            reflectProb = schlick(cosine, this.refIdx);
        } else {
            record.scattered = new Ray(record.p, reflected);
            reflectProb = 1;
        }
        if (Math.random() < reflectProb) {
            record.scattered = new Ray(record.p, reflected);
        } else {
            record.scattered = new Ray(record.p, refracted);
        }
        return record;
    }
    emit(): vec3 {
        return new vec3();
    }
}
