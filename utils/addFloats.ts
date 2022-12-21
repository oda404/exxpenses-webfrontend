import Decimal from "decimal.js";

export default function addFloats(f1: number, f2: number) {
    let x = new Decimal(f1);
    let y = new Decimal(f2);

    return x.add(y).toNumber();
}
