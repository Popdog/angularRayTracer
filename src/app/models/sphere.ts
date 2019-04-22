import vec3 from './vec3';
import { Ray } from './ray';
import { HitRecord, Bounds } from './hitable';
import { Material } from './material';
import { Lambertian } from './lambertian';
import { getRandomPointInUnitSphere } from '../components/ray-tracer/ray-tracer.component';

export class Sphere {
    center: vec3;
    radius: number;
    material: Material;
    constructor(cen?: vec3, r?: number, mat?: Material) {
        this.center = cen ? cen : new vec3();
        this.radius = r ? r : 0;
        this.material = mat || new Lambertian();
    }
    hit(r: Ray, tMin: number, tMax: number): HitRecord {
        const oc = new vec3();
        r.origin.copy(oc);
        oc.subtract(this.center);
        const a = vec3.dot(r.direction, r.direction);
        const b = vec3.dot(oc, r.direction);
        const c = vec3.dot(oc, oc) - (this.radius * this.radius);
        const discriminant = (b * b) - (a * c);
        if (discriminant > 0) {
            let temp = (-b - Math.sqrt(b * b - a * c)) / a;
            if (temp < tMax && temp > tMin) {
                const rec = new HitRecord();
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = (vec3.difference(rec.p, this.center)).scale(1 / this.radius);
                rec.mat = this.material;
                return rec;
            }
            temp = (-b + Math.sqrt(b * b - a * c)) / a;
            if (temp < tMax && temp > tMin) {
                const rec = new HitRecord();
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = (vec3.difference(rec.p, this.center)).scale(1 / this.radius);
                rec.mat = this.material;
                return rec;
            }
        } else {
            return null;
        }
    }
    sample(): vec3 {
        const randPoint = getRandomPointInUnitSphere();
        const og = new vec3();
        this.center.copy(og);
        og.add(randPoint.scale(Math.abs(this.radius)));
        return og;
    }
    get bounds(): Bounds {
        const r = Math.abs(this.radius);
        // tslint:disable-next-line:max-line-length
        return ({min: new vec3([this.center.x - r, this.center.y - r, this.center.z - r]), max: new vec3([this.center.x + r, this.center.y + r, this.center.z + r])});
    }
}
