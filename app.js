/*
 DO NOT REMOVE
 The MIT License (MIT)

 Copyright (c) [2016] [John Paul Sayo aka unibtc]

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var bitcoin = require('bitcoin');
var prompt = require('prompt');
var bitcoinjs = require('bitcoinjs-lib');
var masterxpriv;
var count = 0;
var lock = false;
//bitcoin-rpc configurations
var btcconfig = {
    host: "",
    port: ,
    user: "",
    pass: "",
    timeout: 30000
};
var bclient = new bitcoin.Client(btcconfig);
//end configurations

// Starting Tool
//check configurations
if (masterxpriv = '') {
    onErr("Master Priv key is not set");
    return false;
}
if (btcconfig.host == '' || btcconfig.port == 0 || btcconfig.user == '' || btcconfig.pass == '') {
    onErr("Check Bitcoin-rpc configuration");
    return false;
}

masterxpriv = ""; // master extended private key
//Starting..
console.log("Welcome!Address Importing tool. This tool is use to import bitcoin addresses using their index and your master private key to your bitcoin client. This script is licensed under the MIT license. Please read the LICENSE.txt file for more information");
console.log("------------------------------------");
console.log("Please make sure you have setup the correct bitcoin rpc configurations.");
console.log("Please check the current configurations:");
console.log("Master Priv Key:", masterxpriv);
console.log("Bitcoin RPC info:", btcconfig);
console.log("------------------------------------");
console.log("If the configurations are correct, continue below, if not, close this script and edit the configurations.");
console.log("------------------------------------");
prompt.start();
prompt.get(['start_index', 'end_index'], function (err, result) {
    if (err) {
        return onErr(err);
    }
    console.log("Your wallet current balance is", balance());
    console.log('Importing tool will use the following variables');
    //noinspection JSUnresolvedVariable
    console.log(' Starting Index is: ' + result.start_index);
    //noinspection JSUnresolvedVariable
    console.log(' Ending Index is: ' + result.end_index);
    console.log(' Processing.... ');
    //noinspection JSUnresolvedVariable

    checkdb(result.start_index, result.end_index);
});
function onErr(err) {
    console.log(err);
    return 1;
}
function checkdb(sidx, eidx) {
    var sidx = parseInt(sidx);
    console.log("Doing 100 per batch " + sidx + " -> " + parseInt(sidx+50))
    if(sidx < eidx){
        lock = true;
            batch(parseInt(sidx),parseInt(eidx));
    }else {
        console.log("Index exceeded, Importing last index and rescanning..")
        var hdNode = bitcoinjs.HDNode.fromBase58(masterxpriv);
        var priv = hdNode.derive(eidx).keyPair.toWIF();
        bclient.importPrivKey(priv, function (err) {
            if (err) return console.log(err + "index # "+ind);
            console.log("Successfully imported,Client will now rescan the blockchain.. Thank you for using me -uni")
            lock = false;
            return false;
        })

    }

}

function batch(s,o){
    var resp = [];
    intarray(s,s+50,resp);
    startimport(resp,s,o);
}

function startimport(resp,s,o) {
    var resplen = resp.length;
    //console.log("Length",resplen);
    imp(0, resplen, resp,s,o);

}
function imp(i, z, resp,s,o) {
    var currbal = balance();
    if (i < z) {
        console.log("Index#", resp[i].id);
        var addrinfo = deriveaddr(resp[i].id,i);

        //console.log(addrinfo);
       //importprivkey(addrinfo.privkey);

        imp(i + 1, z, resp,s,o);
    } else {
        var timer = setInterval(function(){
            if(lock == false){
            console.log("nextBatch");
            s = parseInt(s);
            checkdb(parseInt(s+50),parseInt(o));
            clearInterval(timer);
            }
        },1000)

        /*
        console.log("--------------------------------");
        console.log("Current Balance is:", currbal);
        console.log("Importing of " + z + " addresses is almost complete. Importing the last address now, Please wait while Bitcoin client is rescanning the blockchain ");
        var lastaddrinfo = deriveaddr(resp[z-1].id);
        bclient.importPrivKey(lastaddrinfo.privkey,"",false, function (err) {
            if (err) return console.log(err);
            console.log("Importing the last private key of" + lastaddrinfo.privkey + " is completed");
            console.log("Thank you for using me. -uni");
        })*/

    }
}
function deriveaddr(ind,i) {
    console.log("Deriving from Index", ind);
    var hdNode = bitcoinjs.HDNode.fromBase58(masterxpriv);
    var addr = hdNode.derive(ind).keyPair.getAddress().toString();
    var priv = hdNode.derive(ind).keyPair.toWIF();
    setTimeout(function(){
        bclient.importPrivKey(priv, "", false, function (err) {
            if (err) return console.log(err + "index # "+ind);
            console.log("#"+i+" Importing of " + priv + " with and index of "+ ind +" is completed");
            if(i >= 49){
                lock = false;}
            return {
                address: addr,
                privkey: priv
            };
        })
    },500)


}
function importprivkey(priv) {
    //importing of private key without rescan
    //noinspection JSUnresolvedFunction
    count = count +1;
    bclient.importPrivKey(priv, "", false, function (err) {
        if (err) return console.log(err);
        console.log("#"+count+" Importing of " + priv + " is completed");
    })

}
function intarray(x,y,arrind){
    var newarr = arrind;
    if (x < y){
     //   console.log("pushing",x);
        newarr.push({id:x});
        x = Math.floor(x+1);
        intarray(x,y,newarr);
    }else{
        //console.log("end");
        return newarr;
    }
}

function balance() {
    //noinspection JSUnresolvedFunction
    bclient.getBalance('*', 0, function (err, balance) {
        if (err) return console.log(err);
        return balance;

    });
}



