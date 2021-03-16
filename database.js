var mysql = require('mysql');
const chalk = require("chalk")
require('dotenv').config();
const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

const connect = ()=>{
  con.connect(function(err) {
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
  let command = `INSERT INTO ${database} (${keys}) VALUES (${values})`
    return new Promise((resolve,reject)=>{
      con.query(command,(err,result)=>{
        if(err)console.log(err);
        if(result.length!=0){
          resolve(result)
        }else{
          resolve(undefined)
        }
      })
    })
}
const query = (command) =>{
  return new Promise((resolve,reject)=>{
    con.query(command,(err,result)=>{
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
 * SELECT keys FROM table 
 * @param {*} keys Return values
 * @param {*} table Databasetable
 * @returns the result of the query
 */
const select = (keys,table)=>{
  let command = `SELECT ${keys} FROM ${table}`
  return new Promise((resolve,reject)=>{
    con.query(command,(err,result)=>{
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
    con.query(command,(err,result)=>{
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
  let command= `UPDATE ${table} SET ${set} ='${setvalue}' WHERE ${where} = '${value}'`;
  return new Promise((resolve,reject)=>{
    con.query(command,(err,result)=>{
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
  let command= `UPDATE ${table} SET ${set} WHERE ${where} = '${value}'`;
  return new Promise((resolve,reject)=>{
    con.query(command,(err,result)=>{
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
    con.query(command,(err,result)=>{
      if(err)console.log(err);
      if(result.length!=0){
        resolve(result)
      }else{
        resolve(undefined)
      }
    })
  })
}
module.exports.remove=remove;
module.exports.updateWhereMultipleSets=updateWhereMultipleSets;
module.exports.select=select
module.exports.selectWhere=selectWhere
module.exports.updateWhere=updateWhere;
module.exports.connect=connect;
module.exports.query=query;
module.exports.insert=insert;