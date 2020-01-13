
// Barcode from order popup
// min pharmacode type barcode value is 1000 in this case and max is 131070
export default class Barcode{
    constructor(ordered,barcode){
        this.ordered = ordered;
        this.barcode = barcode;
    };
    randomBarcode(){
        this.barcode = Math.floor(Math.random() * 130071 - 1000);
        localStorage.setItem('barcode', barcode);
        localStorage.setItem('orderedOrNot', true);
    };
    getData(){
        this.barcode = localStorage.getItem('barcode');
        this.ordered = localStorage.getItem('orderedOrNot');
    };
}
