import crypto from 'crypto';

export default function generateSecretKey(length=64){
    console.log(crypto.randomBytes(length).toString('hex'));
};

generateSecretKey();