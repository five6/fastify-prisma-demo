class ExcelHeader {
    constructor(key, value, type, enums) {
        this.key = key;
        this.value = value;
        this.type = type;
        this.enums = enums;
    }
}
module.exports = {
    ExcelHeader: ExcelHeader,
}