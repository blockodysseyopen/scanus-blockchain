import {createHash} from 'crypto'

const hash = (v) => createHash('sha512').update(v).digest('hex');

const getPrefix = (familyName) => {
    //namespace
    let prefix = hash(familyName).substr(0, 6);
    return prefix;
}
const getAddress = (familyName, nameForAddr) => {
    let prefix = getPrefix(familyName);
    let gameAddress = hash(nameForAddr).slice(-64);
    return prefix + gameAddress;
}

module.exports = {
    getPrefix,
    getAddress
  }
