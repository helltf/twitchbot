const SQLData = require("./SQLData").SQLData

class QueryBuilder{
    command
    constructor(currentQuery){
        this.command = currentQuery
    }

    async query (){
    let result = await hb.database.query(this.command)
    if(!result)
        return new SQLData()
      return new SQLData(...result)
   }

   static select(...value){
       value = value.join(", ")
      return new QueryBuilder(`SELECT ${value} `)
   }

   static delete(){
       return new QueryBuilder(`DELETE `)
   }

   static insert(table, ...rows){
       rows = rows.join(", ")
      return new QueryBuilder(`INSERT INTO ${table} (${rows}) `)
   }

   from(table){
       return new QueryBuilder(this.command.concat(`FROM ${table} `))
   }

   static update(table){
      return new QueryBuilder(`UPDATE ${table} `)
  }

  set(...valueList){
      let setValues = ""
      for(let [variable, value] of valueList){
          setValues = setValues.concat(variable.concat(` = '${value}'`)) + ", "
      }
      
      return new QueryBuilder(this.command.concat(`SET ${setValues.substring(0, setValues.length-2)} `))
  }

   where(variable, value){
       return new QueryBuilder(this.command.concat(`WHERE ${variable} = '${value}' `))
   }

   whereLike(variable, pattern){
      return new QueryBuilder(this.command.concat(`WHERE ${variable} LIKE '${pattern}'' `))
  }

  whereBelow(variable, value){
    return new QueryBuilder(this.command.concat(`WHERE ${variable} < '${value}'' `))
}

whereAbove(variable, value){
    return new QueryBuilder(this.command.concat(`WHERE ${variable} > '${value}'' `))
}

   whereNot(variable, value){
      return new QueryBuilder(this.command.concat(`WHERE NOT ${variable} = '${value}' `))
  }

  and(...list){
    let concatString = `AND (`
    list = list.map( data => {
        let [[key, value]] = Object.entries(data)
        return `${key} = '${hb.escape(value)}'`
    });

      return new QueryBuilder(this.command.concat(`${concatString} ${list.join(" OR ")})`))
  }
  andNot(variable, value){
    return new QueryBuilder(this.command.concat(`AND NOT ${variable} = '${value}' `))
}

  or(variable, value){
      return new QueryBuilder(this.command.concat(`OR ${variable} = '${value}' `))
  }

  values(...values){
      values = "'" + values.join(`','`)+"'"
      return new QueryBuilder(this.command.concat(`VALUES (${values}) `))
  }

  orderBy(variable, value){
      value = validOrderOperators.includes(value) ? value : "DESC"
      return new QueryBuilder(this.command.concat(`ORDER BY ${variable} ${value}`))
  }
  join(table, onVariableSelectTable,  onVariableJoinTable){
      return new QueryBuilder(this.command.concat(`JOIN ${table} ON ${onVariableSelectTable} = ${onVariableJoinTable} `))
  }
}

const validOrderOperators = ["ASC","DESC"]

module.exports.QueryBuilder = QueryBuilder