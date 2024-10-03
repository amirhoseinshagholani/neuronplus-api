import crypto from 'crypto';
import md5 from 'md5';

export default function generateSecretKey(length=64){
    console.log(crypto.randomBytes(length).toString('hex'));
};
generateSecretKey();
