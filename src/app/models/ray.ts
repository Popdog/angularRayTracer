import vec3 from './vec3';

export class Ray {
    A: vec3;
    B: vec3;
    get origin() {
        return this.A;
    }
    get direction() {
        return this.B;
    }
    point_at_parameter(t: number): vec3 {
        const a = new vec3();
        this.A.copy(a);
        const b = new vec3();
        this.B.copy(b);
        b.scale(t);
        return a.add(b);
    }
    constructor(A?: vec3, B?: vec3) {
        this.A = A || new vec3();
        this.B = B || new vec3();
    }
}
