import { Hitable, HitRecord } from './hitable';
import { Ray } from './ray';

export class HitableList {
    list: Hitable[] = [];
    lights: Hitable[] = [];
    constructor(l?: Hitable[], lights?: Hitable[]) {
        this.list = l || [];
        this.lights = lights || [];
    }
    hit( r: Ray, tMin: number, tMax: number) {
        let tempRec: HitRecord = null;
        let closestSoFar = tMax;
        this.list.forEach(hitable => {
            const hitRec = hitable.hit(r, tMin, closestSoFar);
            if (hitRec) {
                tempRec = hitRec;
                closestSoFar = hitRec.t;
            }
        });
        return tempRec;
    }
    getHitable(r: Ray, tMin: number, tMax: number) {
        let tempHitable = null;
        let closestSoFar = tMax;
        this.list.forEach(hitable => {
            const hitRec = hitable.hit(r, tMin, closestSoFar);
            if (hitRec) {
                tempHitable = hitable;
                closestSoFar = hitRec.t;
            }
        });
        return tempHitable;
    }
}
