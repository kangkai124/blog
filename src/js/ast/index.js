const {
  tokenizer,
  parser,
  transformer,
  codeGenerator,
  compiler
} = require('./the-super-tiny-compiler')

const input = '(add 1 2)(substract 4 2)'

const tokens = tokenizer(input)
const ast = parser(tokens)
const newAst = transformer(ast)
const output1 = codeGenerator(newAst)

const output2 = compiler(input)

console.log(output1 === output2)
