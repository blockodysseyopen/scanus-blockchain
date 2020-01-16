//TP에 매칭되는 family set : "product-info"
//product-info에 대한 payload format setting 및 서비스 로직 구현
import {CommonClient}from "./CommonClient";
import settings from '../config/trasactionConfig'
import DbHandler  from "../util/DbHandler";
const FAMILY_NAME = settings.transaction_argv.FAMILY_NAME_PRODUCT_INFO;
const FAMILY_VERSION = settings.transaction_argv.FAMILY_VERSION_PRODUCT_INFO;
const CREATOR_CODE = settings.creatorCode;
const exec = require('child_process').exec;
const { fileReaderForPI } = require('../util/fileReader');
const { resultHelper } = require('../util/helper');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

class ProductInfoClient extends CommonClient{
    constructor(){
        super(FAMILY_NAME, FAMILY_VERSION)
    }

    // override makePayload
    makePayload(req){
        let payload = {
            nameForAddress : req.body.nameForAddress
            ,productCode : req.body.productCode
            ,creatorCode : req.body.creatorCode
            ,action : req.body.action
            ,timeStamp : new Date().toLocaleString()
        }
        return payload
    }

    accept(req) {
        let payload = this.makePayload(req);
        super.send_transaction(payload,200);    
    }

    //state 값을 받아온 후
    //해당 data를 family set에 맞추어 decode 로직 override   
    async show(req){
        //const TPCheck =  await super.TPHealthCheck(); //대상 TP 죽어있는지 먼저 확인
        if(/*TPCheck*/1){
            const response = await super.getState(FAMILY_NAME,req.body.nameForAddress)
            const data = JSON.parse(Buffer.from(response.data, 'base64').toString());6
            console.log("======================");
            for(var key in data) {
                console.log('key:' + key + ' / ' + 'value:' + data[key]);
            }
            console.log("======================");
        return data[req.body.nameForAddress];
        }else{
            /* 예외처리 로직 작성 */
            return "TP died"
        }

        //return data[req.body.name];
    }


        
    async  productInfoCreate() {
        console.log('=== product-info-tp create start ===');

        let objectList = await fileReaderForPI();

        for (let i = 0; i < objectList.length; i++) {
            console.log('productCode ::: ' +  `${objectList[i].productCode}`+', productName ::: '+`${objectList[i].productName}` );
            
            let payload = {
                productCode: `${objectList[i].productCode}`,
                creatorCode: CREATOR_CODE,
            };
            payload.nameForAddress = `${payload.creatorCode}-${payload.productCode}`;
            payload.timeStamp = moment().format('YYYY.MM.DD - HH:mm:ss');
            const commonClient = new CommonClient(FAMILY_NAME, FAMILY_VERSION);
            let batchStatus = await commonClient.send_transaction(payload);
            let result =  resultHelper(batchStatus, payload);
            if (result){
               // DbHandler.insertProductInfo(payload);
            }

        }
        console.log('=== product-info-tp create end ===');
    }

    //추후 수정 케이스 고려하여 구현
    /*
    async  productInfoModify(n) {
        console.log('=== product-info-tp create start ===');
        for (let i = 0; i < n; i++) {
            let payload = {
                productCode: ``,
                creatorCode: 'guerbet',
                action: 'modify',
                productDetail: {
                    productName: ``,
                    productSubName: ``
                }
            };
            payload.nameForAddress = `${payload.creatorCode}-${payload.productCode}`;
            payload.timeStamp = moment().format('YYYY.MM.DD - HH:mm:ss');
            const commonClient = new CommonClient(VERSION, 'product-info', payload);
            
            let batchStatus = await commonClient.sendTransaction();
            
            resultHelper(batchStatus, payload);
        }
        console.log('=== product-info-tp create end ===');
    }
    */




}

module.exports = {ProductInfoClient};
