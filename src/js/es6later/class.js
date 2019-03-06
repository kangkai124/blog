class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  toString () {
    return `(${this.x}, ${this.y})`
  }
}

console.log('typeof Point is \x1b[32m%s', typeof Point)
console.log(Point === Point.prototype.constructor)
