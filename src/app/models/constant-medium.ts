import { Hitable, HitRecord } from './hitable';
import { Material } from './material';
import { Ray } from './ray';
import vec3 from './vec3';

export class ConstantMedium {
    density: number;
    boundary: Hitable;
    phaseFunction: Material;
    constructor(density?: number, boundary?: Hitable, phaseFunction?: Material) {
        this.density = density || 1;
        this.boundary = boundary;
        this.phaseFunction = phaseFunction;
    }
    get bounds() {
        return this.boundary.bounds;
    }
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        const db = (Math.random() < 0.0001);
        const record1 = this.boundary.hit(r, -999999, 999999);
        if (record1) {
            const record2 = this.boundary.hit(r, record1.t + 0.001, 999999);
            if (record2) {
                if (record1.t < tMin) {
                    record1.t = tMin;
                }
                if (record2.t > tMax) {
                    record2.t = tMax;
                }
                if (record1.t >= record2.t) {
                    return null;
                }
                if (record1.t < 0) {
                    record1.t = 0;
                }
                const distanceInsideBoundary = (record2.t - record1.t) * r.direction.length();
                const hitDistance = -(1 / this.density) * Math.log(Math.random());
                if (hitDistance < distanceInsideBoundary) {
                    const record = new HitRecord();
                    record.t = record1.t + (hitDistance / r.direction.length());
                    record.p = r.point_at_parameter(record.t);
                    record.normal = new vec3([1, 0, 0]);
                    record.mat = this.phaseFunction;
                    return record;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    // hit(r: Ray, tMin: number, tMax: number): HitRecord;
    // sample(): vec3;
}
