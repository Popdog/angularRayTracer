import { Material } from './material';
import { HitRecord, Bounds } from './hitable';
import { Ray } from './ray';
import vec3 from './vec3';

export class XyRect {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    k: number;
    material: Material;
    get bounds(): Bounds {
        return {min: new vec3([this.x0, this.y0, this.k - 0.001]), max: new vec3([this.x1, this.y1, this.k + 0.01])};
    }
    constructor(x0?: number, x1?: number, y0?: number, y1?: number, k?: number, material?: Material) {
        this.x0 = x0 || -1;
        this.y0 = y0 || -1;
        this.x1 = x1 || 1;
        this.y1 = y1 || 1;
        this.k = k || 0;
        this.material = material;
    }
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        const t = (this.k - r.origin.z) / r.direction.z;
        if (t < tMin || t > tMax) {
            return null;
        }
        const x = r.origin.x + t * r.direction.x;
        const y = r.origin.y + t * r.direction.y;
        if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
            return null;
        }
        const record = new HitRecord();
        record.t = t;
        record.mat = this.material;
        record.normal = new vec3([0, 0 , 1]);
        record.p = r.point_at_parameter(t);
        return record;
    }
}
