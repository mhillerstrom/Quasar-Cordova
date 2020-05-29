const [leader, action, slug, empty] = '/Login/verify-signup/123456/'.split('/')

console.log(`leader=${leader}, action=${action}, slug=${slug}, empty=${empty}`)


const Tmp = function (name) {
  this.name = name
  this.count = ++Tmp.count
  console.log(`defined ${name} this.count=${this.count} Tmp.count=${Tmp.count}`)
}

Tmp.count = 0

Tmp.prototype.show = function () {
  console.log(`show ${this.name} this.count=${this.count} Tmp.count=${Tmp.count}`)
}

const Per = new Tmp('Per')
const Lis = new Tmp('Lis')
const Jesper = new Tmp('Jesper')

Per.show()
Lis.show()
Per.show()
Jesper.show()
