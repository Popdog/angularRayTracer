import { Ray } from './ray';
import { HitRecord } from './hitable';
import vec3 from './vec3';

export interface Material {
    scatter(rayIn: Ray, record: HitRecord): HitRecord;
    emit(): vec3;
}
