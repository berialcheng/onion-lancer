var whiteList = [];

exports.login = function (username, password, remoteAddr) {
    if(this.auth(username, password)){
        if(!this.inWhiteList(remoteAddr)){
            this.addAddrToWhiteList(remoteAddr);
        }
        return true;
    }
    return false;
};

exports.auth = function(username, password){
    if(username == "onion" && password == "lancer"){
        return true;
    }
    return false;
};

exports.inWhiteList = function(remoteAddr){
    if(whiteList.filter(function(ip){return ip == remoteAddr}).length < 1) {
        return false;
    }
    return true;
};

exports.addAddrToWhiteList = function(remoteAddr){
    whiteList.push(remoteAddr);
};