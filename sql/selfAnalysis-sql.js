/***
 * mysql.js
 * //code by rain.xia xiashan17@163.com
 */



const getTableList =`SELECT TABLE_NAME  name,TABLE_COMMENT  title FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'csc_anasys' AND TABLE_NAME <> 'sys_account' `;

const getTableInfoByName =`SELECT TABLE_NAME tablename, COLUMN_NAME columnname, COLUMN_TYPE columntype, COLUMN_COMMENT
 columncomment FROM information_schema.columns WHERE TABLE_NAME =?`;



module.exports = {
    getTableList:getTableList,
    getTableInfoByName:getTableInfoByName
};