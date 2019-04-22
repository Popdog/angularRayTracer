import vec3 from './vec3';
import { HitRecord } from './hitable';
import { Ray } from './ray';
import { reflect, getRandomPointInUnitSphere } from '../components/ray-tracer/ray-tracer.component';

export class Metal {
    albedo: vec3;
    roughness: number;
    constructor(albedo?: vec3, roughness?: number) {
        this.albedo = albedo || new vec3();
        if (roughness) {
            roughness > 1 ? this.roughness = 0 : this.roughness = roughness;
        } else {
            this.roughness = 0;
        }
    }
    scatter(rayIn: Ray, record: HitRecord): HitRecord {
        const tempVector = new vec3();
        rayIn.direction.copy(tempVector);
        tempVector.normalize();
        const reflected = reflect(tempVector, record.normal);
        record.scattered = new Ray(record.p, reflected.add(getRandomPointInUnitSphere().scale(this.roughness)));
        record.attenuation = this.albedo;
        if (vec3.dot(record.scattered.direction, record.normal) > 0) {
            return record;
        } else {
            return null;
        }
    }
    emit(): vec3 {
        return new vec3();
    }
}
