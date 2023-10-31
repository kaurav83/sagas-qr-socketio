function sum(a, b) {
    return Number(a) + Number(b);
}

describe('sum function testing', () => {
    test('add 5:number to 15:number expect 20:number', () => {
        expect(sum(5, 15)).toBe(20);
    });
    
    test('add 2:string to 3:string expect 5:number', () => {
        expect(sum('2', '3')).toBe(5);
    });
    
    test('add 0.1:number to 0.2:number expect 0.3:number', () => {
        expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
    });
});