import { Hitable, HitRecord } from './hitable';
import { Ray } from './ray';

export class FlipNormals {
    hitable: Hitable;
    get bounds() {
        return this.hitable.bounds;
    }
    constructor(hitable: Hitable) {
        this.hitable = hitable;
    }
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        const record: HitRecord = this.hitable.hit(r, tMin, tMax);
        if (record) {
            record.normal.scale(-1);
            return record;
        } else {
            return null;
        }
    }
}
