/***
 * user register amtount
 * //code by vember
 */

/*
    these sql used for register user report
     */
const reguster_menber_dist1 = `SELECT t1.province AS c1, SUM(t1.cnt) as cnt FROM csc_anasys.user_register_area_src t1
            inner join csc_anasys.city_lng_lat t2 on t1.province = t2.pro_name and t1.city = t2.city_name
        WHERE t1.reg_dt BETWEEN ? AND ?  GROUP BY t1.province  ORDER BY t1.province`;

const reguster_menber_dist2 = `SELECT t1.city as c1, SUM(t1.cnt) as cnt FROM csc_anasys.user_register_area_src t1
            inner join csc_anasys.city_lng_lat t2 on t1.province = t2.pro_name and t1.city = t2.city_name
        WHERE t1.reg_dt BETWEEN ? AND ?  AND t1.province = ? GROUP BY t1.city ORDER BY t1.city`;

const reguster_menber_dist3 = `SELECT t1.province AS c1, SUM(t1.cnt) as cnt FROM csc_anasys.user_login_area t1
            inner join csc_anasys.city_lng_lat t2 on t1.province = t2.pro_name and t1.city = t2.city_name
        WHERE t1.login_dt BETWEEN ? AND ?  GROUP BY t1.province  ORDER BY t1.province`;

const reguster_menber_dist4 = `SELECT t1.city as c1, SUM(t1.cnt) as cnt FROM csc_anasys.user_login_area t1
            inner join csc_anasys.city_lng_lat t2 on t1.province = t2.pro_name and t1.city = t2.city_name
        WHERE t1.login_dt BETWEEN ? AND ?  AND t1.province = ? GROUP BY t1.city ORDER BY t1.city`;


const regUserDaily = `SELECT Reg_Dt, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE Reg_Dt BETWEEN ?  AND ?
                     GROUP BY Reg_Dt ORDER BY Reg_Dt`;
const regUserWeekly = `SELECT  YEAR(Reg_Dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Reg_Dt,1,4),'-01-01'))=1 THEN WEEK(Reg_Dt) ELSE  WEEK(Reg_Dt)+1 END AS
                        Reg_Week, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE Reg_Dt BETWEEN ?  AND ?
                     GROUP BY year, Reg_Week ORDER BY year, Reg_Week`;
const regUserMonthly = `SELECT DATE_FORMAT(Reg_Dt,'%Y%m') AS Reg_Month, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE DATE_FORMAT(Reg_Dt,'%Y%m') BETWEEN ? AND ?
                     GROUP BY Reg_Month ORDER BY Reg_Month`;
const regUserQuarterly = `SELECT  CONCAT(CONVERT(YEAR(Reg_Dt),char), QUARTER(Reg_Dt)) AS Reg_Quarter, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                         FROM  reg_usr_cnt_day WHERE YEAR(Reg_Dt) BETWEEN ? AND ?
                         GROUP BY Reg_Quarter ORDER BY Reg_Quarter`;
const regUserYearly = `SELECT  YEAR(Reg_Dt) AS Reg_Year, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE YEAR(Reg_Dt) BETWEEN ?  AND ?
                     GROUP BY Reg_Year ORDER BY Reg_Year`;

/*
 these sql used for login user report
    */

const loginUserDaily = `SELECT logon_dt AS Login_Dt, COUNT(usr_id) AS Usr_Cnt ,SUM(CASE WHEN TYPE='Y' THEN 1 ELSE 0 END) AS Ent_Usr_Cnt
                        FROM
                        (
                        SELECT DISTINCT logon_dt, usr_id, TYPE
                        FROM loginuser_cnt_day
                        WHERE logon_dt BETWEEN ? AND ?
                        ) t
                        GROUP BY Login_Dt ORDER BY Login_Dt`;
const loginUserWeekly = `SELECT t1.year AS year, t1.Logon_Week AS Login_Week, t1.Usr_Cnt AS Usr_Cnt, COALESCE(t2.Ent_Usr_Cnt,0) AS Ent_Usr_Cnt
             FROM(SELECT YEAR(logon_dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(logon_dt,1,4),'-01-01'))=1 THEN WEEK(logon_dt) ELSE  WEEK(logon_dt)+1 END
						AS Logon_Week, COUNT(DISTINCT usr_id) Usr_Cnt FROM loginuser_cnt_day WHERE logon_dt BETWEEN ?  AND ?
                         GROUP BY year, Logon_Week ) t1
                     LEFT OUTER JOIN
                        (SELECT YEAR(logon_dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(logon_dt,1,4),'-01-01'))=1 THEN WEEK(logon_dt) ELSE  WEEK(logon_dt)+1 END
 AS Logon_Week, COUNT(DISTINCT usr_id) Ent_Usr_Cnt   FROM loginuser_cnt_day
                     WHERE logon_dt BETWEEN ?  AND ?
                        AND TYPE = ?
                    GROUP BY year, Logon_Week
                       ) t2
                       ON t1.Logon_Week = t2.Logon_Week AND t1.year = t2.year
                     ORDER BY year, Login_Week;`;
const loginUserMonthly = `SELECT t1.Logon_Month AS Login_Month, t1.Usr_Cnt AS Usr_Cnt, COALESCE(t2.Ent_Usr_Cnt,0) AS Ent_Usr_Cnt
                        FROM
                        (
                        SELECT DATE_FORMAT(t1.C_DATE,'%Y%m') AS Logon_Month, COUNT(DISTINCT usr_id) Usr_Cnt
                        FROM csc_anasys.csc_calendar t1
                        LEFT OUTER JOIN loginuser_cnt_day t2
                        ON t1.C_DATE = t2.Logon_Dt
                        WHERE DATE_FORMAT(t1.C_DATE,'%Y%m') BETWEEN ? AND ?
                        GROUP BY Logon_Month
                        ) t1
                        LEFT OUTER JOIN
                        (
                        SELECT DATE_FORMAT(logon_dt,'%Y%m') AS Logon_Month, COUNT(DISTINCT usr_id) Ent_Usr_Cnt
                        FROM loginuser_cnt_day
                        WHERE DATE_FORMAT(logon_dt,'%Y%m') BETWEEN ? AND ?
                        AND TYPE = ?
                        GROUP BY Logon_Month
                        ) t2
                        ON t1.Logon_Month = t2.Logon_Month
                        ORDER BY Login_Month`;
const loginUserQuarterly = `SELECT t1.Logon_Quarter AS Login_Quarter, t1.Usr_Cnt AS Usr_Cnt, COALESCE(t2.Ent_Usr_Cnt,0) AS Ent_Usr_Cnt
                        FROM
                        (
                        SELECT CONCAT(CONVERT(YEAR(logon_dt),CHAR),QUARTER(logon_dt)) AS Logon_Quarter, COUNT(DISTINCT usr_id) Usr_Cnt
                        FROM loginuser_cnt_day
                        WHERE YEAR(logon_dt) BETWEEN ? AND ?
                        GROUP BY Logon_Quarter
                        ) t1
                        LEFT OUTER JOIN
                        (
                        SELECT CONCAT(CONVERT(YEAR(logon_dt),CHAR),QUARTER(logon_dt)) AS Logon_Quarter, COUNT(DISTINCT usr_id) Ent_Usr_Cnt
                        FROM loginuser_cnt_day
                        WHERE YEAR(logon_dt) BETWEEN ? AND ?
                        AND TYPE = ?
                        GROUP BY Logon_Quarter
                        ) t2
                        ON t1.Logon_Quarter = t2.Logon_Quarter
                        ORDER BY Login_Quarter`;
const loginUserYearly = `SELECT t1.Logon_Year AS Login_Year, t1.Usr_Cnt AS Usr_Cnt, COALESCE(t2.Ent_Usr_Cnt,0) AS Ent_Usr_Cnt
                        FROM
                        (
                        SELECT YEAR(logon_dt) AS Logon_Year, COUNT(DISTINCT usr_id) Usr_Cnt
                        FROM loginuser_cnt_day
                        WHERE YEAR(logon_dt) BETWEEN ? AND ?
                        GROUP BY Logon_Year
                        ) t1
                        LEFT OUTER JOIN
                        (
                        SELECT YEAR(logon_dt) AS Logon_Year, COUNT(DISTINCT usr_id) Ent_Usr_Cnt
                        FROM loginuser_cnt_day
                        WHERE YEAR(logon_dt) BETWEEN ? AND ?
                        AND TYPE = ?
                        GROUP BY Logon_Year
                        ) t2
                        ON t1.Logon_Year = t2.Logon_Year
                        ORDER BY Login_Year`;

/**
 * 新增/活跃用户数
 */
const userNewActiveDaily = `SELECT Reg_Dt, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE Reg_Dt BETWEEN ?  AND ?
                     GROUP BY Reg_Dt ORDER BY Reg_Dt`;
const userNewActiveWeekly = `SELECT WEEK(Reg_Dt)+1 AS Reg_Week, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE Reg_Dt BETWEEN ?  AND ?
                     GROUP BY Reg_Week ORDER BY Reg_Week`;
const userNewActiveMonthly = `SELECT CONCAT(CONVERT(YEAR(Reg_Dt),CHAR),MONTH(Reg_Dt)) AS Reg_Month, SUM(Reg_Num) AS Reg_Num, SUM(Ent_Reg_Num) AS Ent_Reg_Num,SUM(Nor_Reg_Num) AS Nor_Reg_Num
                     FROM  reg_usr_cnt_day WHERE YEAR(Reg_Dt) BETWEEN ? AND ?
                     GROUP BY Reg_Month ORDER BY Reg_Month`;
/*
    these sql is used for active user report
 */

/* member industry */
const memberDim1 = `SELECT stat_ind, dim_cd, dim_nm FROM csc_dim.csc_member_dim WHERE stat_ind = ? and sts_ind = '1' order by rank ;`;
const memberDim2 = `SELECT stat_ind, dim_cd, dim_nm FROM csc_dim.csc_member_dim WHERE stat_ind = ? and sts_ind = '1' order by rank;`;

const memberGetCol1 = `SELECT Dim_C1 as dim_1 FROM csc_dim.csc_member_dim WHERE Dim_Cd = ? and Sts_Ind = '1';`;
const memberGetCol2 = `SELECT Dim_C1 as dim_1,Dim_C2 as dim_2 FROM csc_dim.csc_member_dim WHERE Dim_Cd = ? and Sts_Ind = '1';`;
const memberGetCol3 = `SELECT Dim_C1 as dim_1,Dim_C2 as dim_2 FROM csc_dim.csc_member_dim WHERE Dim_Cd = ? and Sts_Ind = '1';`;

module.exports = {
    reguster_menber_dist1:reguster_menber_dist1,
    reguster_menber_dist2:reguster_menber_dist2,
    reguster_menber_dist3:reguster_menber_dist3,
    reguster_menber_dist4:reguster_menber_dist4,
    regUserDaily:regUserDaily,
    regUserWeekly:regUserWeekly,
    regUserMonthly:regUserMonthly,
    regUserQuarterly:regUserQuarterly,
    regUserYearly:regUserYearly,
    loginUserDaily: loginUserDaily,
    loginUserWeekly:loginUserWeekly,
    loginUserMonthly:loginUserMonthly,
    loginUserQuarterly:loginUserQuarterly,
    loginUserYearly:loginUserYearly,
    userNewActiveDaily:userNewActiveDaily,
    userNewActiveWeekly:userNewActiveWeekly,
    userNewActiveMonthly:userNewActiveMonthly,
    memberDim1:memberDim1,
    memberDim2:memberDim2,
    memberGetCol1:memberGetCol1,
    memberGetCol2:memberGetCol2,
    memberGetCol3:memberGetCol3
};