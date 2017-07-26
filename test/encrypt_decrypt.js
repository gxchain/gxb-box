import {PrivateKey, Aes} from 'gxbjs'
import GXChainService from '../lib/services/GXChainService'

let private_key = PrivateKey.fromWif('');
let pubKey = private_key.toPublicKey().toPublicKeyString();

let encrypted = GXChainService.encrypt_params({
    name: '张三',
    idcard: '333301199012180000',
    photo: '6Ieq5ouN54WnYmFzZTY0'
}, private_key, pubKey)
console.log('encrypted:', encrypted);

let decrypted = GXChainService.decrypt_msg(encrypted, private_key, '');
console.log('decrypted:', decrypted);


