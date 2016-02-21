# moneypot-btcimport
Moneypot Bitcoin Address Import Tool

INSTALL

Clone this Repo

Do a 'npm install' to install all dependencies

RUN

'node app.js', You will be asked a starting index, and an ending index. This refers to the Index of an address when derived from the Master Private Key.

Note: After the import, it will rescan the blockchain for any transactions. During this time, your Bitcoin client may appear unresponsive. Please wait for the rescan to finish.

CONFIGURATIONS

Open app.js and edit the follwing configurations with yours.

host : ''

port : 0

user : ''

pass : ''

var masterxpriv = '' Master Private Key

LICENSE

Read LICENSE file.
