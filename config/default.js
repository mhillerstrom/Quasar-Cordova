/* eslint-disable quotes */
/* eslint-disable quote-props */
const isTest = process.env.ENV === 'test'

const dbUrl = isTest ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL

const getValue = function (val, def) {
  try {
    // eslint-disable-next-line no-eval
    val = eval(val)
  } catch (e) {}
  // console.log(`getValue: val=${val}, typeof val = ${typeof val}, def=${def}, typeof def = ${typeof def}`);
  return (typeof val !== typeof def) ? def : val
}

module.exports = {
  "appName": getValue(process.env.APPNAME, 'MyApp'),
  "host": getValue(process.env.HOST, 'localhost'),
  "port": getValue(process.env.PORT, 8081),
  "clientPort": getValue(process.env.CLIENTPORT, 8081),
  "protocol": getValue(process.env.PROTOCOL, 'http'),
  "public": "../www/",
  "src": "../server/",
  "complaint_email": getValue(process.env.COMPLAINT_EMAIL, "x@y.z"),
  "GMAIL": getValue(process.env.GMAIL, "x@y.z"),
  "GMAIL_PASSWORD": getValue(process.env.GMAIL_PASSWORD, "dummy"),
  "EMAIL_VALIDATION": getValue(process.env.EMAIL_VALIDATION, true),
  "SUPPRESS_EMAIL": getValue(process.env.SUPPRESS_EMAIL, false),
  "SEND_TEST_EMAIL": getValue(process.env.SEND_TEST_EMAIL, true),
  "paginate": {
    "default": 20,
    "max": 50
  },
  "clientCookie": getValue(process.env.COOKIE, "feathers-jwt"),
  "authentication": {
    "secret": "ecb62ba7ff41cda072349b0ac1105fff090f54fd85576a9ff5072bf0ff45f440f5041267b393b205235ea9bead9cc338efd654565c3106560657617771b89253353101f50099b9a8b1260fc7a8c612c47aa0cecc7a3b3f230d649b4f04ee32d462572b8c1b7f4bc46d5be9be2626c3aacc29326ca02c91c0f6c9f80298895cc9bf032c3b97c6c310e282160041cedaab8e0fa759d049b55f2d62dd1c20ff66baa3a28701d1b72d5f7a519d4fa3e1128c48154f45eb2687d7dd0f2059b9d91a646442f5e647c82a5467c3a5dc5f8a12fd2e9f9eba5178cb9dd35b2be7683e478742ae9c08a16699f60031d9319690d7b2b7b59cd811ac14da7f05fb639b9186f4",
    "authStrategies": [
      "jwt",
      "local"
    ],
    "strategies": [
      "jwt",
      "local"
    ],
    "path": "/authentication",
    "entity": "user",
    "service": "users",
    "jwtOptions": {
      "header": {
        "typ": "access"
      },
      "audience": "https://" + getValue(process.env.HOST, 'localhost'),
      "issuer": getValue(process.env.ISSUER, "myapp"),
      "algorithm": "HS256",
      "expiresIn": "1d"
    },
    "local": {
      "entity": "user",
      "service": "users",
      "usernameField": "email",
      "passwordField": "password"
    },
    "oauth": {
      "redirect": "/",
      "auth0": {
        "key": "<auth0 oauth key>",
        "secret": "<auth0 oauth secret>",
        "subdomain": "<auth0 subdomain>"
      },
      "google": {
        "key": "<google oauth key>",
        "secret": "<google oauth secret>",
        "scope": [
          "email",
          "profile",
          "openid"
        ]
      },
      "facebook": {
        "key": "<facebook oauth key>",
        "secret": "<facebook oauth secret>"
      },
      "github": {
        "key": "<github oauth key>",
        "secret": "<github oauth secret>"
      }
    },
    "cookie": {
      "enabled": true,
      "name": getValue(process.env.COOKIE, "feathers-jwt"),
      "httpOnly": false,
      "secure": false
    }
  },
  "mongodb": `${dbUrl}`
}
