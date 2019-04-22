import { HitableList } from './hitable-list';
import { Bounds, HitRecord } from './hitable';
import { Ray } from './ray';

export class BoundingBox {
    bounds: Bounds;
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        let txMin = (this.bounds.min.x - r.origin.x) / r.direction.x;
        let tyMin = (this.bounds.min.y - r.origin.y) / r.direction.y;
        let tzMin = (this.bounds.min.z - r.origin.z) / r.direction.z;

        let txMax = (this.bounds.max.x - r.origin.x) / r.direction.x;
        let tyMax = (this.bounds.max.y - r.origin.y) / r.direction.y;
        let tzMax = (this.bounds.max.z - r.origin.z) / r.direction.z;

        if (txMin > txMax) {
            const tempMin = txMin;
            txMin = txMax;
            txMax = tempMin;
        }

        if (tyMin > tyMax) {
            const tempMin = tyMin;
            tyMin = tyMax;
            tyMax = tempMin;
        }

        if (tzMin > tzMax) {
            const tempMin = tzMin;
            tzMin = tzMax;
            tzMax = tempMin;
        }

        const min = Math.max(txMin, tyMin, tzMin);
        const max = Math.min(txMax, tyMax, tzMax);

        if (min > max || (min < tMin && max < tMin)) {
            return null;
        } else {
            return new HitRecord();
        }
    }
    constructor(world: HitableList) {
        this.bounds = {min: null, max: null};
        world.list.forEach(hitable => {
            const b = hitable.bounds;
            if (!this.bounds.min) {
                this.bounds.min = b.min;
            } else {
                if (b.min.x < this.bounds.min.x) {
                    this.bounds.min.x = b.min.x;
                }
                if (b.min.y < this.bounds.min.y) {
                    this.bounds.min.y = b.min.y;
                }
                if (b.min.z < this.bounds.min.z) {
                    this.bounds.min.z = b.min.z;
                }
            }
            if (!this.bounds.max) {
                this.bounds.max = b.max;
            } else {
                if (b.max.x > this.bounds.max.x) {
                    this.bounds.max.x = b.max.x;
                }
                if (b.max.y > this.bounds.max.y) {
                    this.bounds.max.y = b.max.y;
                }
                if (b.max.z > this.bounds.max.z) {
                    this.bounds.max.z = b.max.z;
                }
            }
        });
    }
}
