export const displayBarcode = (barcode,barcodeW,barcodeH) => {
    JsBarcode("#barcode", `${barcode}`, {
        format: "pharmacode",
        lineColor: "#0aa",
        value: '12345999',
        width: `${barcodeW}`,
        height: `${barcodeH}`,
        displayValue: false,
        background: 'transparent',
    });
};