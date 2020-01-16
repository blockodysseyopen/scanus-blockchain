/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

import CreateKey from "../util/createKey";
import Transaction from "../util/Transaction";
import Batch from "../util/Batch";
import DbHandler  from "../util/DbHandler";
import RestApi from "../util/RestApi";
//const exec = require('child_process').exec;
const exec1 = require('await-exec')

import settings from '../config/trasactionConfig'
const SSH_HOST = settings.connetion.SSH_HOST;
const SSH_KEY = settings.connetion.SSH_KEY;

class CommonClient {
    constructor(familyName, familyVersion){
        this.familyName = familyName
        this.familyVersion = familyVersion
        this.createKey = new CreateKey();
        this.txn = new Transaction(this.createKey, familyName, familyVersion);
    }

    send_transaction(payload, wait){
        const txnHeader =  this.txn.getTransactionHeader(payload);
        const txns =  this.txn.getTransactions(txnHeader, payload);
        const txnIds = txns.map((t) => t.headerSignature)
        const res = new Batch(this.createKey).getBatches(txns);
        return RestApi.send_to_rest_api(res.batchListBytes)
        .then(()=>{
            return RestApi.get_status(res.batchIds,wait)
        .then((result)=>{
               if (result.data[0].status=="COMMITTED"){
                   DbHandler.insertTxn(txnIds, txnHeader, payload);
                   result.txnId = txnIds;
                   result.batchId = res.batchIds;
               }
               return result;
           })
        })
    }

    send_transaction_for_transit(payload, wait){
        const txnHeader =  this.txn.getTransactionHeader(payload);
        txnHeader.inputs.push(payload.actionDetail.ruleAddress);
        const txns =  this.txn.getTransactions(txnHeader, payload);
        const txnIds = txns.map((t) => t.headerSignature)
        const res = new Batch(this.createKey).getBatches(txns);
        return RestApi.send_to_rest_api(res.batchListBytes)
        .then(()=>{
            return RestApi.get_status(res.batchIds,wait)
        .then((result)=>{
               if (result.data[0].status=="COMMITTED"){
                   DbHandler.insertTxn(txnIds, txnHeader, payload);
                   result.txnId = txnIds;
                   result.batchId = res.batchIds;
                }
               return result;
           })
        })
    }

    //FamilyName과 nameForAddr로 현재 state 가져옴
    async getState(familyName, nameForAddr){
        return await RestApi.send_to_rest_api(null, familyName, nameForAddr)
    }


    //family name에 해당하는 TP 프로세스 STAT 확인.
    async TPHealthCheck(){
        //배포용
        //let str =  "ssh "+ SSH_HOST + " -i '" + SSH_KEY + "' ps aux | grep "+ this.familyName + "-tp";

        try{
            const { stdout, stderr } = await exec1(str);
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return 0
            }else {
                console.log(`stdout: ${stdout}`)
                return 1
            }
        }catch(error){
            console.log('error: ' + error)
            return 0;
        }
    }


}

module.exports = {CommonClient};
