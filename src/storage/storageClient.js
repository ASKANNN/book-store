 /**
 * Safe reading
 * @param {string} key
 * @returns{any|null}
 */

export function readJson(key){
    try{
        const raw = localStorage.getItem(key);
        if(!raw) return null;
        return JSON.parse(raw);
    }catch(e){
        //TODO add notification
        console.log(e.message);
        return null;
    }
}

/**
 * Safe writing
 * @param {string} key
 * @param{any} value
 */

export function writeJson(key, value){
    try{
        const raw = JSON.stringify(value);
        localStorage.setItem(key, raw);
    }catch(e){
        //TODO add notification
        console.log(e.message);
    }
}


/**
 * remove by key
 * @param {string} key
 *
 */
export function remove(key){
    try{
        localStorage.removeItem(key);
    }catch(e){
        console.log(e.message);
        //TODO add notification
    }
}