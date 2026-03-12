export default class Vector2 {
    public constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public x: number;
    public y: number;

    public static fromAnyVector(inputVector: {x:number, y:number}){
        return new Vector2(inputVector.x, inputVector.y);
    }

    public add(v: Vector2 | number) {
        if(typeof v === "number") return new Vector2(this.x + v, this.y + v);
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    public multiply(v: Vector2 | number) {
        if(typeof v === "number") return new Vector2(this.x * v, this.y * v);
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    public diff(v: Vector2 | number) {
        if(typeof v === "number") return new Vector2(this.x - v, this.y - v);
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    public magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public normalize() {
        const mag = this.magnitude();
        if(mag === 0) return new Vector2(0,0);
        return new Vector2(this.x/mag, this.y/mag);
    }

    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    public rotate(rad: number): Vector2 {
        return new Vector2(
            this.x * Math.cos(rad) - this.y * Math.sin(rad),
            this.y * Math.cos(rad) + this.x * Math.sin(rad)
        )
    }
}
