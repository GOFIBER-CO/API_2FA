
module.exports = class PagedModel {
    constructor(pageIndex, pageSize, totalPages, data, totalItem) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.data = data;
        this.totalItem = totalItem
    }
}