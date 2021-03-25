var mysql = require('mysql');
const chalk = require("chalk")
require('dotenv').config();
const twitchdatabase = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

const connect = ()=>{
  twitchdatabase.connect(function(err) {
    if (err){
      console.log(`${chalk.hex("#3f888f").bold("[DATABASE]")} ${chalk.gray("[CONNECTION]")} ${chalk.red("[NOT SUCCESSFUL]")}`);
      throw err;
    } 
    console.log(`${chalk.hex("#3f888f").bold("[DATABASE]")} ${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`);
  });
}
/**
 * INSERT INTO database (keys) VALUES (values)
 * @param {*} database 
 * @param {*} keys 
 * @param {*} values 
 * @returns 
 */
const insert = (database,keys,values) =>{
  if(process.env.IS_RASPI==="false")return;
  let command = `INSERT INTO ${database} (${keys}) VALUES (${values})`
    return new Promise((resolve,reject)=>{
      twitchdatabase.query(command,(err,result)=>{
        if(err)console.log(err);
        resolve(result);
      })
    })
}
/**
 * SELECT keys FROM table 
 * @param {*} keys Return values
 * @param {*} table Databasetable
 * @returns the result of the query
 */
const select = (keys,table)=>{
  let command = `SELECT ${keys} FROM ${table}`
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(err,result)=>{
      if(err)console.log(err);
      if(result.length!=0){
        resolve(result)
      }else{
        resolve(undefined)
      }
    })
  })
}
/**
 * SELECT keys FROM table WHERE where = 'value'
 * @param {*} keys Return values
 * @param {*} table Databasetable
 * @param {*} where key
 * @param {*} value value of the key
 * @returns the result of the query
 */
const selectWhere = (keys,table,where,value)=>{
  let command = `SELECT ${keys} FROM ${table} WHERE ${where} = '${value}'`
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(err,result)=>{
      if(err)console.log(err);
      if(result.length!=0){
        resolve(result)
      }else{
        resolve(undefined)
      }
    })
  })
}
/**
 * UPDATE table SET set ='setvalue' WHERE where = 'value'
 * @param {*} table 
 * @param {*} set 
 * @param {*} setvalue 
 * @param {*} where 
 * @param {*} value 
 */
const updateWhere = (table,set,setvalue,where,value)=>{
  if(process.env.IS_RASPI==="false")return;
  let command= `UPDATE ${table} SET ${set} ='${setvalue}' WHERE ${where} = '${value}'`;
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(err,result)=>{
      if(err)console.log(err);
      if(result.length!=0){
        resolve(result)
      }else{
        resolve(undefined)
      }
    })
  })
}
const updateWhereMultipleSets = (table,set,where,value)=>{
  if(process.env.IS_RASPI==="false")return;
  let command= `UPDATE ${table} SET ${set} WHERE ${where} = '${value}'`;
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(err,result)=>{
      if(err)console.log(err);
      if(result.length!=0){
        resolve(result)
      }else{
        resolve(undefined)
      }
    })
  })
}
const remove = (table,where,value) =>{
  let command= `DELETE FROM ${table} WHERE ${where} = '${value}'`;
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(err,result)=>{
      if(err)console.log(err);
        resolve(result)
    })
  })
}
/**
 * SELECT keys FROM table JOIN jointable ON jointablevalue WHERE where = wherevalue
 * @param {*} keys 
 * @param {*} table 
 * @param {*} jointable 
 * @param {*} tablevalue 
 * @param {*} jointablevalue 
 * @param {*} where 
 * @param {*} wherevalue 
 * @returns 
 */
const selectJoin = (keys,table,jointable,tablevalue,jointablevalue,where,wherevalue)=>{
  let command = `SELECT ${keys} FROM ${table} JOIN ${jointable} ON ${tablevalue}=${jointablevalue} WHERE ${where} = '${wherevalue}'` 
  return new Promise((resolve,reject)=>{
  twitchdatabase.query(command,(err,result)=>{
    if(err)console.log(err);
    if(result.length!=0){
      resolve(result)
    }else{
      resolve(undefined)
    }
  })
})
}
const custom= (command)=>{
  command = command.replace(/\n/g,"")
  return new Promise((resolve,reject)=>{
  twitchdatabase.query(command,(err,result)=>{
    resolve(result)
  })
})
}
module.exports.remove=remove;
module.exports.updateWhereMultipleSets=updateWhereMultipleSets;
module.exports.select=select
module.exports.selectWhere=selectWhere
module.exports.updateWhere=updateWhere;
module.exports.connect=connect;
module.exports.insert=insert;
module.exports.selectJoin=selectJoin;
module.exports.custom=custom;