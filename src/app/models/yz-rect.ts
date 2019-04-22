import { Material } from './material';
import { Bounds, HitRecord } from './hitable';
import vec3 from './vec3';
import { Ray } from './ray';

export class YzRect {
    y0: number;
    y1: number;
    z0: number;
    z1: number;
    k: number;
    material: Material;
    get bounds(): Bounds {
        return {min: new vec3([this.k - 0.01, this.y0, this.z0]), max: new vec3([this.k + 0.01, this.y1, this.z1])};
    }
    constructor(y0?: number, y1?: number, z0?: number, z1?: number, k?: number, material?: Material) {
        this.y0 = y0 || -1;
        this.z0 = z0 || -1;
        this.y1 = y1 || 1;
        this.z1 = z1 || 1;
        this.k = k || 0;
        this.material = material;
    }
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        const t = (this.k - r.origin.x) / r.direction.x;
        if (t < tMin || t > tMax) {
            return null;
        }
        const y = r.origin.y + t * r.direction.y;
        const z = r.origin.z + t * r.direction.z;
        if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
            return null;
        }
        const record = new HitRecord();
        record.t = t;
        record.mat = this.material;
        record.normal = new vec3([1, 0 , 0]);
        record.p = r.point_at_parameter(t);
        return record;
    }
}
