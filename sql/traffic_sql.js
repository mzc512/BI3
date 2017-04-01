/***
 * traffic amtount
 * //code by vember
 */

/*
    these sql used for traffic by time report
     */
const trafficDaily = `SELECT visit_dt, SUM(visit_pv) AS pv_num,
                              SUM(visit_ip) AS ip_num,SUM(visit_uv) AS uv_num,SUM(visit_ssn) AS ssn_num
                     FROM  visit_daily WHERE visit_dt BETWEEN ?  AND ?
                     GROUP BY visit_dt ORDER BY visit_dt`;
const trafficWeekly = `SELECT visit_dt, visit_pv,visit_ip,visit_uv,visit_ssn
                     FROM  visit_daily WHERE visit_dt BETWEEN ?  AND ? ORDER BY visit_dt`;
const trafficMonthly = `SELECT CONCAT(CONVERT(YEAR(visit_dt),CHAR),MONTH(visit_dt)) AS visit_month,
                               SUM(visit_pv) AS pv_num, SUM(visit_ip) AS ip_num,SUM(visit_uv) AS uv_num,SUM(visit_ssn) AS ssn_num
                     FROM  visit_daily WHERE YEAR(visit_dt) BETWEEN ? AND ?
                     GROUP BY visit_month`;

/*
 these sql used for traffic by time report
 */
const newActiveDaily = `SELECT visit_dt, SUM(visit_nuv) AS nuv_num,
                              SUM(visit_mau) AS mau_num
                     FROM  visit_daily WHERE visit_dt BETWEEN ?  AND ?
                     GROUP BY visit_dt ORDER BY visit_dt`;
const newActiveWeekly = `SELECT visit_dt, visit_nuv,visit_mau
                     FROM  visit_daily WHERE visit_dt BETWEEN ?  AND ? ORDER BY visit_dt`;
const newActiveMonthly = `SELECT CONCAT(DATE_FORMAT(t1.C_DATE,'%Y%m')) AS visit_month,
  SUM(COALESCE(t2.visit_nuv,0)) AS nuv_num,SUM(COALESCE(t2.visit_mau,0))  AS mau_num
                      FROM  csc_anasys.csc_calendar t1 LEFT OUTER JOIN csc_anasys.visit_daily t2
 ON t1.C_DATE = t2.visit_dt  WHERE DATE_FORMAT(t1.C_DATE,"%Y%m") BETWEEN ? AND ?
                     GROUP BY visit_month`;
const trafficSearchTop = `SELECT keyword,SUM(cnt) AS cnt_num FROM  visit_keyword WHERE dt BETWEEN ?  AND ? GROUP BY keyword ORDER BY cnt_num DESC`;
/*
    these sql is used for traffic page user report
 */
const trafficPage = `SELECT url, name FROM csc_operate.tbl_traffic_page WHERE del_flag = 1 AND type = ?  ORDER BY id DESC`;

module.exports = {
    trafficDaily:trafficDaily,
    trafficWeekly:trafficWeekly,
    trafficMonthly:trafficMonthly,
    newActiveDaily:newActiveDaily,
    newActiveWeekly:newActiveWeekly,
    newActiveMonthly:newActiveMonthly,
    trafficPage:trafficPage,
    trafficSearchTop:trafficSearchTop
};