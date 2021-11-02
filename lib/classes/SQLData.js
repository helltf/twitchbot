class SQLData extends Array{
    print(){
        console.log(this)
    }
    first(){
        return this[0]
    }
    last(){
        return this[this.length-1]
    }
    isEmpty(){
        return this.length === 0
    }
}

module.exports.SQLData = SQLData