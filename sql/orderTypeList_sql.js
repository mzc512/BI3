/**
 /**
 * Created by Administrator on 2016/12/2.
 * payType     已付款品类
 * payorderTypeList  已付款品类列表
 * payCompany   已付款分公司
 * payCompanyList   已付款分公司行业列表

 * paymentIndustry  已付款行业
 */

const payType = `SELECT  cat_nm,SUM(order_cnt) AS orderNum , SUM(order_amt) AS orderPay FROM csc_anasys.classify_cnt_amt WHERE pay_dt BETWEEN ? AND ?
                        AND Brn_id='B008' GROUP BY cat_nm`;
const payorderTypeList = `SELECT cat_nm,Indry_Nm, SUM(order_cnt) AS orderNum , SUM(order_amt) AS orderPay FROM csc_anasys.classify_cnt_amt  WHERE pay_dt BETWEEN ? AND ?
                       AND Brn_Id='B008'  GROUP BY cat_nm,Indry_Nm`;
const payCompany = `SELECT brn_nm, SUM(order_cnt) AS orderNum , SUM(order_amt) AS orderPay FROM csc_anasys.classify_cnt_amt WHERE pay_dt BETWEEN ? AND ?
                         GROUP BY brn_nm`;
const payCompanyList = `SELECT brn_nm,indry_nm, SUM(order_cnt) AS orderNum , SUM(order_amt) AS orderPay FROM csc_anasys.classify_cnt_amt WHERE pay_dt BETWEEN ? AND ?
                         GROUP BY brn_nm,indry_nm`;
const paymentIndustry = `SELECT CASE WHEN indry_id IN ('I9999','I0008') THEN '其他' ELSE indry_nm
                         END indry_nm, SUM(order_cnt) orderNum, SUM(order_amt) orderPay FROM csc_anasys.classify_cnt_amt
                        WHERE pay_dt BETWEEN ? AND ? GROUP BY CASE WHEN indry_id IN ('I9999','I0008') THEN '其他' ELSE indry_nm END ;`;
//订单多维分析
const orderManyDim1 = `SELECT dim_flag,dim_code,dim_name FROM csc_anasys.orders_multi_dim_setup WHERE dim_flag = ? and status = '1' order by rank ;`;
const orderManyDim2 = `SELECT dim_flag,dim_code,dim_name FROM csc_anasys.orders_multi_dim_setup WHERE dim_flag = ? and status = '1' order by rank;`;
const orderGetCol1 = `SELECT dim_1 FROM csc_anasys.orders_multi_dim_setup WHERE dim_code = ? and status = '1';`;
const orderGetCol2 = `SELECT dim_1,dim_2 FROM csc_anasys.orders_multi_dim_setup WHERE dim_code = ? and status = '1';`;
const orderGetCol3 = `SELECT dim_1,dim_2 FROM csc_anasys.orders_multi_dim_setup WHERE dim_code = ? and status = '1';`;
const orderDetailsCancelled = `SELECT productName AS name,number AS num,price AS RMB FROM csc_anasys.orders_cancel_product WHERE orderid= ?;` ;
const orderDetailsCancelled1 = `SELECT t1.orderid,t1.totalMoney,t1.favourMoney,date_format(t1.createTime,'%Y-%m-%d %T') as createTime,
                                t1.source,t2.col_desc as payStatus,t1.payMoney,date_format(t1.paytime,'%Y-%m-%d %T') as paytime,
                                t1.transactionNo,t3.col_desc as paytool,t1.enterprise, t1.phone, t1.email,
                                t1.membername, t1.receiverName, t1.receiverMobile, t1.receiverTel
                                FROM csc_anasys.orders_cancel_dtl t1
                                left outer join csc_dim.csc_order_dim t2
                                on t1.paystatus = t2.col_code
                                and t2.dim_code = 'pay_status'
                                left outer join csc_dim.csc_order_dim t3
                                on t1.paytool = t3.col_code
                                and t3.dim_code = 'payType'
                                WHERE t1.orderid= ? ;`;
    module.exports = {
    payType:payType,
    payorderTypeList:payorderTypeList,
    payCompany:payCompany,
    payCompanyList:payCompanyList,
    paymentIndustry:paymentIndustry,
    orderManyDim1:orderManyDim1,
    orderManyDim2:orderManyDim2,
    orderGetCol1:orderGetCol1,
    orderGetCol2:orderGetCol2,
    orderGetCol3:orderGetCol3,
    orderDetailsCancelled:orderDetailsCancelled,
    orderDetailsCancelled1:orderDetailsCancelled1
};
