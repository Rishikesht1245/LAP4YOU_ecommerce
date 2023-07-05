// 3rd chart doughNut 
const ctz = document.getElementById("myChart3");
let doughnutChart = new Chart(ctz, {
      type: "doughnut",
      data: {
        labels: ["In-Transit", "Delivered", "Cancelled" , "Returned", "Refunded"],
        datasets: [
          {
            label: "Order Status",
            data: [],

            backgroundColor: [
              "rgb(255, 205, 86,0.9)",
              "rgb(34,139,34,0.9)",
              "rgb(255,80,66,0.9)",
              "rgb(0, 0, 255, 0.9)",
              "rgb(230, 80, 255, 0.9)"
            ],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });




$.ajax({
      url:'/admin/dashboard',
      method : 'put',
      success : (res) => {
            var orderData = res.data.orderData;
            let totalOrders = [];
            let revenuePerMonth = [];
            let avgBillPerOrder = [];
            let productsPerMonth = [];
            orderData.forEach((order) => {
                  //order._id.month-1 will access to the index of array based on the month
                  totalOrders[order._id.month-1]=order.totalOrders;
                  revenuePerMonth[order._id.month-1]=order.revenue;
                  avgBillPerOrder[order._id.month-1]=order.avgBillPerOrder;
                  productsPerMonth[order._id.month-1]=order.totalProducts;
            });

            //initialisting Charts
            // bar chart for revenue and avg bill per order
            const ctx = document.getElementById("myChart");
            new Chart(ctx, {
                  type : 'bar',
                  data :{
                        labels: [   // x axis data 
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ],
                        datasets: [ // bar names here 2 bars 
                        {
                              label: "Revenue",
                              data: revenuePerMonth,
                              borderWidth: 1,
                              backgroundColor: "rgba(0, 128, 0, 0.2)", // Green background color with 0.2 opacity
                              borderColor: "rgb(0, 128, 0)", // Green border color

                        },
                        {
                              label: "Avg. Bill per Order",
                              data: avgBillPerOrder,
                              borderWidth: 1,
                              backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue background color with 0.2 opacity
                        borderColor: "rgb(54, 162, 235)", // Blue border color

                        },
                    ],
                  },
                  options: {
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      },
            });

            // second chart  orders and products sold bar chart
            const cty = document.getElementById("myChart2");
            new Chart(cty, {
              type: "bar",
              data: {
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                datasets: [
                  {
                    label: "Orders",
                    data: totalOrders,  // array which contains 12 elements corresponding to 12 months
                    borderWidth: 1,
                    backgroundColor:  "rgb(255,80,66,0.9)",
                    borderColor: "rgb(54, 162, 235)",
                  },
                  {
                    label: "Products sold",
                    data: productsPerMonth,
                    borderWidth: 1,
                    backgroundColor:   "rgb(34,139,34,0.9)",
                    borderColor: "rgb(75, 192, 192)",
                  },
                ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              },
            });

            doughnutChart.data.datasets[0].data = [res.data.inTransit, res.data.delivered, 
              res.data.cancelled, res.data.returnedOrders, res.data.refunded,];
    
              doughnutChart.update();
      }
});




  // ajax call for doughnut chart 
  function doughNut(period){
    console.log("dougnut front")
    $.ajax({
      url : '/admin/dashboard/' + period,
      method : 'put',
      success: (res)=> {
       
        doughnutChart.data.datasets[0].data = [res.data.inTransit, res.data.delivered, 
          res.data.cancelled, res.data.returnedOrders, res.data.refunded,];

          doughnutChart.update();
      }
    });
  }

// data table initialization
$(function () {
      $("#dataTable").DataTable({
        rowReorder: {
          selector: "td:nth-child(2)",
        },
        responsive: true,
      });
      new $.fn.dataTable.FixedHeader(table);
    });



// //downloading sales report in excel format using xlsx library
// function exportToExcel(type, fileName, dl) {
//       var element = document.getElementById('dataTable');
//       var wb = XLSX.utils.table_to_book(element, { sheet: "salesReport" });
//       return dl ?
//         XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
//         XLSX.writeFile(wb, fileName || ('MySheetName.' + (type || 'xlsx')));
//    }
    
