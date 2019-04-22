import { Material } from './material';
import { Bounds, HitRecord } from './hitable';
import vec3 from './vec3';
import { Ray } from './ray';

export class XzRect {
    x0: number;
    x1: number;
    z0: number;
    z1: number;
    k: number;
    material: Material;
    get bounds(): Bounds {
        return {min: new vec3([this.x0, this.k - 0.001, this.z0]), max: new vec3([this.x1, this.k + 0.01, this.z1])};
    }
    constructor(x0?: number, x1?: number, z0?: number, z1?: number, k?: number, material?: Material) {
        this.x0 = x0 || -1;
        this.z0 = z0 || -1;
        this.x1 = x1 || 1;
        this.z1 = z1 || 1;
        this.k = k || 0;
        this.material = material;
    }
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        const t = (this.k - r.origin.y) / r.direction.y;
        if (t < tMin || t > tMax) {
            return null;
        }
        const x = r.origin.x + t * r.direction.x;
        const z = r.origin.z + t * r.direction.z;
        if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
            return null;
        }
        const record = new HitRecord();
        record.t = t;
        record.mat = this.material;
        record.normal = new vec3([0, 1 , 0]);
        record.p = r.point_at_parameter(t);
        return record;
    }
}
