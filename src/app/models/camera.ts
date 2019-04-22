import vec3 from './vec3';
import { Ray } from './ray';
import { getRandomPointInUnitCircle } from '../components/ray-tracer/ray-tracer.component';

export class Camera {
    lowerLeftCorner: vec3;
    horizontal: vec3;
    vertical: vec3;
    origin: vec3;
    lensRadius: number;
    u: vec3;
    v: vec3;
    w: vec3;
    constructor(lookFrom: vec3, lookAt: vec3, up: vec3, fov: number, aspect: number, aperture: number, focusDistance: number) {
        this.lensRadius = aperture / 2;
        const theta = Math.PI * fov / 180;
        const halfHeight = Math.tan(theta / 2);
        const halfWidth = aspect * halfHeight;
        this.origin = lookFrom;
        this.w = (vec3.difference(lookFrom, lookAt)).normalize();
        this.u = (vec3.cross(up, this.w)).normalize();
        this.v = (vec3.cross(this.w, this.u)).normalize();
        this.lowerLeftCorner = new vec3();
        const uScale = new vec3();
        const vScale = new vec3();
        const wScale = new vec3();
        this.u.copy(uScale);
        this.v.copy(vScale);
        this.w.copy(wScale);
        this.origin.copy(this.lowerLeftCorner);
        this.lowerLeftCorner.subtract(uScale.scale(halfWidth * focusDistance));
        this.lowerLeftCorner.subtract(vScale.scale(halfHeight * focusDistance));
        this.lowerLeftCorner.subtract(wScale.scale(focusDistance));
        this.u.copy(uScale);
        this.v.copy(vScale);
        this.horizontal = uScale.scale(2 * halfWidth * focusDistance);
        this.vertical = vScale.scale(2 * halfHeight * focusDistance);
    }
    getRay(s: number, t: number) {
        const rd = getRandomPointInUnitCircle();
        rd.scale(this.lensRadius);
        const uScale = new vec3();
        this.u.copy(uScale);
        uScale.scale(rd.x);
        const vScale = new vec3();
        this.v.copy(vScale);
        vScale.scale(rd.y);
        const offset = vec3.sum(uScale, vScale);
        const og = vec3.sum(this.origin, offset);
        const d = new vec3();
        this.lowerLeftCorner.copy(d);
        const hVec = new vec3();
        this.horizontal.copy(hVec);
        hVec.scale(s);
        const vVec = new vec3();
        this.vertical.copy(vVec);
        vVec.scale(t);
        d.add(hVec);
        d.add(vVec);
        d.subtract(og);
        return new Ray(og, d);
    }
}
