### MOAC Microchain Demo 
## One Button MicroChain creation



To install in moac.io box

$ git clone https://github.com/biajee/microchaindemo.git

 or

$ git pull
$ sudo chown moac:root .meteor/ -R
$ meteor build ./output
$ cd output
$ tar -zxf microchaindemo.tar.gz
$ cd bundle/programs/server
$ npm install
$ export PORT=3000
$ meteor npm install --save @babel/runtime
$ cd ../..
$ export ROOT_URL="https://moac.io"
$ node main.js