/**
 * Created by Administrator on 2016/12/8.
 */
/*
 *  新老用户占比 供应采购商占比 sql
* newolduser            日新老用户占比
* newolduserweekly      周新老用户占比
* newoldusermothly      月新老用户占比
* newolduseryearly      年新老用户占比
* newolduserjidu        季度新老用户占比
* supplierbuyer         日供应采购商占比
* supplierbuyerweekly   周供应采购商占比
* supplierbuyermothly   月供应采购商占比
* supplierbuyeryearly   年供应采购商占比
* supplierbuyerjidu     季供应采购商占比
*
* */

const newolduser='SELECT login_dt, SUM(new_cnt) AS new_cnt, SUM(old_cnt) AS old_cnt, new_cnt FROM csc_anasys.user_new_old_cnt WHERE login_dt BETWEEN ? AND ? GROUP BY login_dt';
const newolduserweekly=`SELECT YEAR(Login_Dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Login_Dt,1,4),'-01-01'))=1 THEN WEEK(Login_Dt) ELSE  WEEK(Login_Dt)+1 END  AS Reg_Week, SUM(New_Cnt) AS new_cnt, SUM(Old_Cnt) AS old_cnt FROM  csc_anasys.user_new_old_cnt WHERE Login_Dt BETWEEN ? AND ? GROUP BY year, Reg_Week ORDER BY year,Reg_Week`;
const newoldusermothly='SELECT DATE_FORMAT(Login_Dt,"%Y%m") AS Reg_Month, SUM(new_cnt) AS new_cnt, SUM(old_cnt) AS old_cnt FROM csc_anasys.user_new_old_cnt WHERE DATE_FORMAT(Login_Dt,"%Y%m") BETWEEN ? AND ? GROUP BY Reg_Month ORDER BY Reg_Month';
const newolduseryearly='SELECT YEAR(Login_Dt) AS Reg_Year, SUM(new_cnt) AS new_cnt, SUM(old_cnt) AS old_cnt FROM csc_anasys.user_new_old_cnt WHERE YEAR(Login_Dt) BETWEEN ? AND ? GROUP BY Reg_Year ORDER BY Reg_Year';
const newolduserjidu='SELECT  CONCAT(CONVERT(YEAR(Login_Dt),char), QUARTER(Login_Dt)) AS Reg_Quarter,SUM(New_Cnt) AS new_cnt, SUM(Old_Cnt) AS old_cnt FROM   csc_anasys.user_new_old_cnt WHERE YEAR(Login_Dt) BETWEEN ? AND ? GROUP BY Reg_Quarter ORDER BY Reg_Quarter';

const supplierbuyer='SELECT login_dt, SUM(nor_cnt) AS nor_cnt, SUM(ent_cnt) AS ent_cnt, ent_cnt FROM csc_anasys.user_nor_ent_cnt WHERE login_dt BETWEEN  ?  AND ? GROUP BY login_dt';
const supplierbuyerweekly=`SELECT YEAR(Login_Dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Login_Dt,1,4),'-01-01'))=1 THEN WEEK(Login_Dt) ELSE  WEEK(Login_Dt)+1 END AS Reg_Week,  SUM(nor_cnt) AS nor_cnt, SUM(ent_cnt) AS ent_cnt FROM csc_anasys.user_nor_ent_cnt WHERE Login_Dt BETWEEN ? AND ? GROUP BY year, Reg_Week ORDER BY year, Reg_Week`;
const supplierbuyermothly='SELECT DATE_FORMAT(Login_Dt,"%Y%m") AS Reg_Month,  SUM(nor_cnt) AS nor_cnt, SUM(ent_cnt) AS ent_cnt FROM csc_anasys.user_nor_ent_cnt WHERE DATE_FORMAT(Login_Dt,"%Y%m") BETWEEN ? AND ? GROUP BY Reg_Month ORDER BY Reg_Month';
const supplierbuyeryearly='SELECT YEAR(Login_Dt) AS Reg_Year, SUM(nor_cnt) AS nor_cnt, SUM(ent_cnt) AS ent_cnt FROM csc_anasys.user_nor_ent_cnt WHERE YEAR(Login_Dt) BETWEEN ? AND ? GROUP BY Reg_Year ORDER BY Reg_Year';
const supplierbuyerjidu='SELECT  CONCAT(CONVERT(YEAR(Login_Dt),char), QUARTER(Login_Dt)) AS Reg_Quarter,SUM(Nor_Cnt) AS nor_cnt, SUM(Ent_Cnt) AS ent_cnt FROM csc_anasys.user_nor_ent_cnt WHERE YEAR(Login_Dt) BETWEEN ? AND ? GROUP BY Reg_Quarter ORDER BY Reg_Quarter';
 module.exports={
     newolduser:newolduser,
     newolduserweekly:newolduserweekly,
     newoldusermothly:newoldusermothly,
     newolduseryearly:newolduseryearly,
     newolduserjidu:newolduserjidu,
     supplierbuyer:supplierbuyer,
     supplierbuyerweekly:supplierbuyerweekly,
     supplierbuyermothly:supplierbuyermothly,
     supplierbuyeryearly:supplierbuyeryearly,
     supplierbuyerjidu:supplierbuyerjidu
 };