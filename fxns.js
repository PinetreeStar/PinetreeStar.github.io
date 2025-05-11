function binarySearch(arr, target){
    let l = 0;
    let r = arr.length-1;
    let m = Math.floor((l + r) / 2);
    while (l < r){
        if (target == arr[m]){
            return m;
        }
        if (target < arr[m]){
            r = m-1;
        }else{
            l = m+1;
        }
        m = Math.floor((l + r) / 2);
    }
    if (target == arr[l]){
        return l;
    }
    return (target == arr[r]) ? r : -1;
}

function rand(min, max, includeMax = false){
    if (includeMax){
        return Math.floor(Math.rand() * ((max - min) + 1)) + min;
    }
    return Math.floor(Math.rand() * (max - min)) + min;
}

function setCookie(cname, cvalue, expire = 30){
    let d = new Date();
    d.setTime(d.getTime() + (expire * 1000 * 60 * 60 * 24));
    document.cookie = (cname + "=" + cvalue + ";expires=" + d.toUTCString + ";path=/");
}

function getCookie(cname){
    cname += "=";
    let decoded = document.cookie.split(";");
    for (let i in decoded){
        while (decoded[i].charAt(0) == " "){
            decoded[i] = decoded[i].substring(1);
        }
        if (decoded[i].indexOf(cname) == 0){
            return decoded[i].substring(cname.length);
        }
    }
    return "No cookie found";
}