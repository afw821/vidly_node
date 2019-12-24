  
var StateManager = {
    _data:{},
    SetData: function (key, value) {
        this._data[key] = value
    },
    GetData: function (key){
        return this._data[key]
    }
}