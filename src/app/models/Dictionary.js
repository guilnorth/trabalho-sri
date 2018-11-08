class Dictionary {

    constructor(id,login,senha){
        this._id = id;
        this._login = login;
        this._senha = senha;

    }

    returnObject(){
        return {id:this._id,login:this._login, senha:this._senha}
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get login() {
        return this._login;
    }

    set login(value) {
        this._login = value;
    }

    get senha() {
        return this._senha;
    }

    set senha(value) {
        this._senha = value;
    }
}
module.exports = Administrador;