import {randomBytes,createHmac} from 'crypto';

export function hashPassword(password,salt=undefined){
    if(!salt){
        salt=randomBytes(254).toString('hex');
    }
    const hashedPassword=createHmac('sha256',salt).update(password).digest('hex');
    return {salt,hashedPassword};
}
