const orderCLTN = require('../models/users/order');
const moment = require('moment');
const excelJS = require('exceljs');

exports.download = async (req, res) => {
      try {
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Roport");
        worksheet.columns = [
          { header: "S No.", key: "s_no" },
          { header: "Order ID", key: "_id", width: 30 },
          { header: "Ordered On", key: "date", width: 20 },
          { header: "User", key: "user" , width: 20},
          { header: "Payment", key: "modeOfPayment" },
          { header: "Delivery", key: "orderStatus", width: 20 },
          { header: "Quantity", key: "item" },
          { header: "BIll Amount", key: "finalPrice", width: 15 },
          { header: "Revenue", key: "reportPrice" , width: 15},
        ];
        let counter = 1; //couter for SI.No
        let total = 0; // total value of all Orders
        let reportPrice = 0;
        // dates for from filer
        const fromDate = new Date(req.query.fromDate);
        const toDate = new Date(req.query.toDate);
        const saledata = await orderCLTN
          .find({
            orderedOn : {
              $gte: fromDate,
              $lte: toDate,
            },
          })
          .populate({ path: "customer", select: "name" });
          
        saledata.forEach((sale, i) => {
          const date = moment(sale.orderedOn).format("lll");
          const orderID = sale._id.toString();
          const status = () => {
            if (sale.delivered === true) {
              return moment(sale.deliveredOn).format("lll");
            } else if (sale.delivered === false) {
              return sale.status;
            }
          };
          reportPrice += sale.finalPrice;
          sale.reportPrice = reportPrice;
          sale.date = date;
          sale._id = orderID;
          sale.s_no = counter;
          sale.orderStatus = status();
          sale.user = sale.customer.name;
          sale.item = sale.totalQuantity;
          //adding row inside for Each loop
          worksheet.addRow(sale);
          counter++;
          total += sale.price;
        });
        //styling
        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });
    worksheet.getColumn(9).eachCell((cell)=> {
        cell.font = { color: { argb: '990000' },bold: true }
    
    });

    // setting headers
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
        );
      
        // content disposition is used to set the file name and how browser treats it. here attachment refers to downloadable file
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=LAP4YOU_eCommerce_SalesReport.xlsx`
        );
      
        // writing the workbook to the response object
        return workbook.xlsx.write(res).then(() => {
          res.status(200);
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    