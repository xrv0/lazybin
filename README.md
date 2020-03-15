<h1 align="center">Welcome to lazybin 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://www.gnu.org/licenses/gpl-3.0" target="_blank">
    <img alt="License: GNU General Public License" src="https://img.shields.io/badge/License-GNU General Public License-yellow.svg" />
  </a>

# lazybin

> lazybin is a minimialistic encrypted privacy focused pastebin for sharing code and text snippets.

### 🏠 [Demo](https://lazybin.wtf)

## Installation

Use the following commands to self-host your own version of lazybin on your server without the need of a database.

```bash
git clone https://github.com/xrv0/lazybin
npm i
npm run start-normal
```

## Installation on GCloud App Engine
You can use [Google App Engine](https://cloud.google.com/appengine) to run lazybin in an auto-scaling enviroment for free for a whole year. After your free-trail is expired hosting the service can still be very cheap depending on your traffic. 

### Create Storage Bucket
- **Open the Cloud Storage browser in the Google Cloud Console.** [Here](https://console.cloud.google.com/storage/browser?_ga=2.187604648.14309837.1584227312-1763718299.1584227312)
- **Click Create bucket to open the bucket creation form, choose a name and create one.**
    - ![alt text](https://cloud.google.com/storage/images/create-bucket.png
)
- **If you run into any errors check out [their documentation](https://cloud.google.com/storage/docs/creating-buckets)**

### Set up App Engine service
- **Open Cloud Shell**
    - ![alt text](https://i.ibb.co/Y7DjrT2/Bildschirmfoto-2020-03-15-um-00-22-03.png)
- **Enter the following commands**
```bash
git clone https://github.com/xrv0/lazybin
cd lazybin
sh appengine_deploy.sh

#When asked for your bucket name enter the one specified in the step above
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Feel free to check [issues page](https://github.com/xrv0/lazybin/issues).

## Author

👤 **xrv0**

* Twitter: [@xrvzero](https://twitter.com/xrvzero)
* Github: [@xrv0](https://github.com/xrv0)

## Show your support

Give a ⭐️ if this project helped you!

Donate Bitcoin: 1FVGKsksRt5DJ87tj1v3UEDivPphLze7Ea

Donate Ether: 0xC3cF8CDb45C03557a1ade85a41657cddB2A5Fc21
## 📝 License

Copyright © 2020 [xrv0](https://github.com/xrv0).<br />
This project is [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0) licensed.
