<h1 align="center">Welcome to lazybin 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://www.gnu.org/licenses/gpl-3.0" target="_blank">
    <img alt="License: GNU General Public License" src="https://img.shields.io/badge/License-GNU General Public License-yellow.svg" />
  </a>
  <a href="https://twitter.com/xrvzero" target="_blank">
    <img alt="Twitter: xrvzero" src="https://img.shields.io/twitter/follow/xrvzero.svg?style=social" />
  </a>
</p>

> like pastebin but encrypted and for lazy people (-, - )…zzzZZZ

### 🏠 [Homepage / Demo](lazyb.in)

## How it works
Before the content of the paste is sent to the server it is encrypted using AES with a randomly generated key using the [sjcl.js](https://crypto.stanford.edu/sjcl/) library.

The url can then be sent to other people with the key included after the hash in the URI. The content is then decrypted again clientside in the readers browser.

This leads to the server not having direct access to the unencrypted content of the paste at any time.  
## Author

👤 **xrv0**

* Twitter: [@xrvzero](https://twitter.com/xrvzero)
* Github: [@xrv0](https://github.com/xrv0)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/xrv0/lazybin/issues).

## Show your support

Give a ⭐️ if this project helped you!

Donate Bitcoin: 1FVGKsksRt5DJ87tj1v3UEDivPphLze7Ea

Donate Ether: 0xC3cF8CDb45C03557a1ade85a41657cddB2A5Fc21
## 📝 License

Copyright © 2020 [xrv0](https://github.com/xrv0).<br />
This project is [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0) licensed.
