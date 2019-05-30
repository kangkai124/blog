# JavaScript 的精确计算

由 [每天一道题，早日 BAT](https://github.com/kangkai124/blog/issues/12) 第 6 题引发的深入学习，感谢 [大佬博客](https://github.com/camsong/blog/issues/9)。

JavaScript 中所有数字包括整数和小数都只有一种类型 — `Number`,它的实现遵循 [IEEE 754](http://grouper.ieee.org/groups/754/) 标准，使用 64 位固定长度来表示，也就是标准的 double 双精度浮点数。

这样的存储结构**优点**是可以归一化处理整数和小数，节省存储空间。

64位比特又可分为三个部分：

- 符号位S：第 1 位是正负数符号位（sign），0代表正数，1代表负数
- 指数位E：中间的 11 位存储指数（exponent），用来表示次方数
- 尾数位M：最后的 52 位是尾数（mantissa），超出的部分**自动进一舍零**（划重点）

[![js-number](https://user-images.githubusercontent.com/17745492/55932586-dca41c00-5c5c-11e9-8e29-2530a404e01b.png)](https://user-images.githubusercontent.com/17745492/55932586-dca41c00-5c5c-11e9-8e29-2530a404e01b.png)

[![image](https://user-images.githubusercontent.com/17745492/55933455-eaa76c00-5c5f-11e9-8243-75268b68b92a.png)](https://user-images.githubusercontent.com/17745492/55933455-eaa76c00-5c5f-11e9-8243-75268b68b92a.png)
因为二进制的科学计数法，小数点前一位只能是 `1`，因此只取小数点后面的数作为 M 省略。

**例1 4.5**

`4.5` 转为二进制是 `100.1` （[十进制转二进制](https://www.cnblogs.com/xkfz007/articles/2590472.html)）

科学计数法表示是 `1.001 * 2 ^ 2`

```
4.5` = `1 * 2 ^ 2 * 1.001
```

所以 `4.5` 最终表示为**（S=0，E=1025，M=001）**，没有丢精度

[![image](https://user-images.githubusercontent.com/17745492/55934272-a4074100-5c62-11e9-8334-0b3c3ea06d1e.png)](https://user-images.githubusercontent.com/17745492/55934272-a4074100-5c62-11e9-8334-0b3c3ea06d1e.png)

这里是一个[在线转换工具](http://www.binaryconvert.com/result_double.html?decimal=052046053)

**例2 0.1**

`0.1` 转为二进制是 `0.00011001100110011`(0011循环)

科学计数法表示是 `1.1001100110011... * 2 ^ -4`

注意，转为 64 位比特存储时，由于 M 只有 52 位，所以无限循环的部分最后会有**舍入**

[![image](https://user-images.githubusercontent.com/17745492/55944250-cc029e80-5c7a-11e9-90bf-b6a5ac9871e0.png)](https://user-images.githubusercontent.com/17745492/55944250-cc029e80-5c7a-11e9-90bf-b6a5ac9871e0.png)

```
0.1` = `1 * 2 ^ -4 * 1.1001100110011001100110011001100110011001100110011010
```

所以 `0.1` 最终表示为**（S=0，E=1019，M=1001100110011001100110011001100110011001100110011010`）**，转换为十进制后为`0.100000000000000005551115123126`，丢失了精度。

**例3 0.1+0.2 = 0.30000000000000004**

`0.1` + `0.2` 都转为二进制后再运算

```
0.00011001100110011001100110011001100110011001100110011010 +
0.0011001100110011001100110011001100110011001100110011010 =
0.0100110011001100110011001100110011001100110011001100111
```

转为十进制正好是 `0.30000000000000004`。



```js
/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */

/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num: number, precision = 12): number {
  return +parseFloat(num.toPrecision(precision));
}

/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num: number): number {
  // Get digit length of e
  const eSplit = num.toString().split(/[eE]/);
  const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
  return len > 0 ? len : 0;
}

/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num: number): number {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? strip(num * Math.pow(10, dLen)) : num;
}

/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num: number) {
  if (_boundaryCheckingState) {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
    }
  }
}

/**
 * 精确乘法
 */
function times(num1: number, num2: number, ...others: number[]): number {
  if (others.length > 0) {
    return times(times(num1, num2), others[0], ...others.slice(1));
  }
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const leftValue = num1Changed * num2Changed;

  checkBoundary(leftValue);

  return leftValue / Math.pow(10, baseNum);
}

/**
 * 精确加法
 */
function plus(num1: number, num2: number, ...others: number[]): number {
  if (others.length > 0) {
    return plus(plus(num1, num2), others[0], ...others.slice(1));
  }
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

/**
 * 精确减法
 */
function minus(num1: number, num2: number, ...others: number[]): number {
  if (others.length > 0) {
    return minus(minus(num1, num2), others[0], ...others.slice(1));
  }
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}

/**
 * 精确除法
 */
function divide(num1: number, num2: number, ...others: number[]): number {
  if (others.length > 0) {
    return divide(divide(num1, num2), others[0], ...others.slice(1));
  }
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  checkBoundary(num1Changed);
  checkBoundary(num2Changed);
  return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
}

/**
 * 四舍五入
 */
function round(num: number, ratio: number): number {
  const base = Math.pow(10, ratio);
  return divide(Math.round(times(num, base)), base);
}

let _boundaryCheckingState = true;
/**
 * 是否进行边界检查，默认开启
 * @param flag 标记开关，true 为开启，false 为关闭，默认为 true
 */
function enableBoundaryChecking(flag = true) {
  _boundaryCheckingState = flag;
}
export { strip, plus, minus, times, divide, round, digitLength, float2Fixed, enableBoundaryChecking };
export default { strip, plus, minus, times, divide, round, digitLength, float2Fixed, enableBoundaryChecking };
```

