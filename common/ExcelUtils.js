const ExcelJS = require('exceljs');
const ExcelHeader = require('../interfaces/excel');
const dayjs = require('dayjs');
const fs = require('fs');
async function exportExcel(response, fileName, sheetName,headers, rows) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
       // 添加表头
    worksheet.addRow(headers.map(head => head.value));

    // 添加数据
    rows.forEach(row => {
        worksheet.addRow(headers.map((head) => {
        const type = head.type || 'custom';
        switch(type) {
            //objectId类型
            case 'objectId':
                const objectId = row[head.key];
                return objectId.toString()
            // 普通类型
            case 'custom':
                return row[head.key];
            // 日期类型
            case 'date': 
                const value = row[head.key];
                if(!value) return '';
                if(typeof value ==='string' || typeof value ==='object') {
                    try {
                        return dayjs(value).format('YYYY-MM-DD hh:mm:ss');
                    } catch(e) {
                        return value;
                    }
                }
                break;
            // 嵌套子对象
            case 'child':
                const keys = head.key.split('.');
                if(keys.length > 1) {
                    const child = keys.reduce((prev, curr) => {
                        return prev[curr];
                    }, row);
                    return child;
                }
                return '';
            // 枚举
            case 'enum': 
                const enumValue = row[head.key];
                const enumObj = head.enum || {};
                if(!enumValue ||!enumObj) return '';
                return enumObj[enumValue];
            default: 
                return row[head.key];
        }
        }));
    });

    // 设置响应头
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);

    // 保存文件
    const buffer = await workbook.xlsx.writeBuffer(fileName);

    // 可以选择将文件存储到指定位置，或者直接返回给客户端
    // fs.renameSync(fileName, '/Users/zxz/Downloads/users.xlsx');
    response.send(buffer)
}

module.exports = {
    exportExcel: exportExcel
}