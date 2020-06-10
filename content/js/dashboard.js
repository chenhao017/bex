/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 64.46153846153847, "KoPercent": 35.53846153846154};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6184615384615385, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.23, 500, 1500, "/home-web/assetBex"], "isController": false}, {"data": [0.02, 500, 1500, "开仓 /home-web/imitateCfd/apply "], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/unlockRecord "], "isController": false}, {"data": [0.02, 500, 1500, "平仓 /home-web/imitateCfd/unwind "], "isController": false}, {"data": [0.0, 500, 1500, "撤销委托  /home-web/imitateCfd/cancle/order"], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/sys/clock "], "isController": false}, {"data": [0.26, 500, 1500, "/home-web/cfd/unwind/list "], "isController": false}, {"data": [0.86, 500, 1500, "/home-web/point/account "], "isController": false}, {"data": [0.34, 500, 1500, "/home-web/banner/list?lang=zh_CN&r=1591692132734&type=BEX "], "isController": false}, {"data": [0.04, 500, 1500, "止盈止损修改  /home-web/imitateCfd/modifyLoseAndProfit"], "isController": false}, {"data": [0.13, 500, 1500, "/home-web/trade/userInfor  "], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/getAwards "], "isController": false}, {"data": [0.3, 500, 1500, "/home-web/imitateCfd/trade/userInfor "], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/account/recharge/record "], "isController": false}, {"data": [0.94, 500, 1500, "平仓记录 /home-web/imitateCfd/unwind/list "], "isController": false}, {"data": [1.0, 500, 1500, "最新成交 /home-web/cfd/trade/record "], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/account/withdraw/record "], "isController": false}, {"data": [1.0, 500, 1500, "委托记录-全部 /home-web/imitateCfd/limit/list "], "isController": false}, {"data": [1.0, 500, 1500, "委托记录-委托中 /home-web/imitateCfd/limit/list "], "isController": false}, {"data": [1.0, 500, 1500, "委托记录-已完成 /home-web/imitateCfd/limit/list "], "isController": false}, {"data": [0.2, 500, 1500, "/home-web/cfd/currency "], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/futures/balance?lang=zh_CN&r=1591698803314 "], "isController": false}, {"data": [1.0, 500, 1500, "委托记录-已撤单 /home-web/imitateCfd/limit/list "], "isController": false}, {"data": [1.0, 500, 1500, "/home-web/point/logs "], "isController": false}, {"data": [0.72, 500, 1500, "我的持仓 /home-web/imitateCfd/myPositions "], "isController": false}, {"data": [0.02, 500, 1500, "限价交易 /home-web/imitateCfd/apply"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 462, 35.53846153846154, 151.9169230769231, 45, 5623, 253.9000000000001, 660.8000000000002, 840.97, 118.94958367645714, 99.26097924672888, 71.36939278525026], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["/home-web/assetBex", 50, 27, 54.0, 450.64, 121, 843, 832.3, 835.0, 843.0, 59.1016548463357, 62.01287307919622, 36.01507092198582], "isController": false}, {"data": ["开仓 /home-web/imitateCfd/apply ", 50, 49, 98.0, 79.63999999999999, 54, 153, 92.0, 125.89999999999999, 153.0, 326.79738562091507, 213.8799530228758, 223.7157883986928], "isController": false}, {"data": ["/home-web/unlockRecord ", 50, 0, 0.0, 63.48000000000001, 48, 110, 74.0, 75.0, 110.0, 442.4778761061947, 279.1413163716814, 234.202157079646], "isController": false}, {"data": ["平仓 /home-web/imitateCfd/unwind ", 50, 49, 98.0, 82.94, 51, 160, 157.6, 159.45, 160.0, 301.20481927710847, 195.9125564759036, 176.53426204819277], "isController": false}, {"data": ["撤销委托  /home-web/imitateCfd/cancle/order", 50, 50, 100.0, 100.94, 62, 170, 129.9, 147.64999999999984, 170.0, 294.11764705882354, 190.60776654411762, 174.34512867647058], "isController": false}, {"data": ["/home-web/sys/clock ", 50, 0, 0.0, 58.86000000000001, 45, 72, 69.9, 71.0, 72.0, 657.8947368421053, 431.1009457236842, 376.4905427631579], "isController": false}, {"data": ["/home-web/cfd/unwind/list ", 50, 37, 74.0, 113.08000000000001, 54, 186, 158.7, 162.0, 186.0, 264.55026455026456, 233.64645337301587, 160.69361772486772], "isController": false}, {"data": ["/home-web/point/account ", 50, 7, 14.0, 76.61999999999999, 51, 96, 92.9, 95.0, 96.0, 515.4639175257731, 398.91067976804123, 273.33682345360825], "isController": false}, {"data": ["/home-web/banner/list?lang=zh_CN&r=1591692132734&type=BEX ", 50, 33, 66.0, 136.73999999999995, 56, 193, 189.8, 191.45, 193.0, 257.73195876288656, 163.92155283505153, 145.22591817010309], "isController": false}, {"data": ["止盈止损修改  /home-web/imitateCfd/modifyLoseAndProfit", 50, 48, 96.0, 107.74000000000002, 57, 204, 164.8, 166.0, 204.0, 242.71844660194176, 154.9415958737864, 152.685072815534], "isController": false}, {"data": ["/home-web/trade/userInfor  ", 50, 37, 74.0, 409.69999999999993, 159, 756, 662.8, 722.7999999999998, 756.0, 65.96306068601584, 58.078413588390504, 36.395634069920845], "isController": false}, {"data": ["/home-web/getAwards ", 50, 0, 0.0, 65.52, 50, 116, 74.9, 115.44999999999999, 116.0, 420.16806722689074, 265.0669642857143, 250.2954306722689], "isController": false}, {"data": ["/home-web/imitateCfd/trade/userInfor ", 50, 19, 38.0, 833.7600000000002, 528, 5623, 847.9, 853.45, 5623.0, 8.887308922858159, 10.59967811277995, 5.233444609847138], "isController": false}, {"data": ["/home-web/account/recharge/record ", 50, 0, 0.0, 62.46, 48, 111, 70.0, 88.54999999999984, 111.0, 413.22314049586777, 260.6856921487603, 255.8432334710744], "isController": false}, {"data": ["平仓记录 /home-web/imitateCfd/unwind/list ", 50, 3, 6.0, 206.95999999999998, 125, 253, 247.0, 251.0, 253.0, 196.078431372549, 221.5265012254902, 121.0171568627451], "isController": false}, {"data": ["最新成交 /home-web/cfd/trade/record ", 50, 0, 0.0, 91.41999999999999, 51, 125, 118.9, 121.89999999999999, 125.0, 387.59689922480624, 615.4614825581396, 228.62160852713177], "isController": false}, {"data": ["/home-web/account/withdraw/record ", 50, 0, 0.0, 62.94, 47, 120, 73.0, 76.35, 120.0, 406.5040650406504, 256.4469004065041, 250.49225101626016], "isController": false}, {"data": ["委托记录-全部 /home-web/imitateCfd/limit/list ", 50, 0, 0.0, 77.04000000000002, 47, 162, 93.0, 123.0, 162.0, 304.8780487804878, 319.16920731707313, 192.33517530487805], "isController": false}, {"data": ["委托记录-委托中 /home-web/imitateCfd/limit/list ", 50, 0, 0.0, 73.88000000000001, 50, 121, 87.9, 119.44999999999999, 121.0, 400.0, 394.140625, 257.03125], "isController": false}, {"data": ["委托记录-已完成 /home-web/imitateCfd/limit/list ", 50, 0, 0.0, 67.14000000000001, 46, 119, 76.9, 116.0, 119.0, 420.16806722689074, 265.0669642857143, 268.7598476890756], "isController": false}, {"data": ["/home-web/cfd/currency ", 50, 40, 80.0, 109.74, 57, 233, 187.49999999999997, 193.45, 233.0, 213.67521367521366, 166.9754941239316, 122.9049813034188], "isController": false}, {"data": ["/home-web/futures/balance?lang=zh_CN&r=1591698803314 ", 50, 0, 0.0, 149.2, 95, 189, 181.0, 185.79999999999998, 189.0, 240.3846153846154, 154.9353966346154, 134.27734375], "isController": false}, {"data": ["委托记录-已撤单 /home-web/imitateCfd/limit/list ", 50, 0, 0.0, 80.37999999999995, 49, 134, 130.9, 133.45, 134.0, 367.64705882352945, 378.41796875, 235.16486672794116], "isController": false}, {"data": ["/home-web/point/logs ", 50, 0, 0.0, 69.8, 48, 115, 85.9, 88.44999999999999, 115.0, 427.3504273504273, 421.9250801282051, 225.3605769230769], "isController": false}, {"data": ["我的持仓 /home-web/imitateCfd/myPositions ", 50, 14, 28.0, 236.06, 102, 288, 282.7, 286.34999999999997, 288.0, 172.41379310344828, 178.125, 106.41163793103449], "isController": false}, {"data": ["限价交易 /home-web/imitateCfd/apply", 50, 49, 98.0, 83.16, 53, 157, 106.0, 146.89999999999998, 157.0, 316.45569620253167, 207.1116000791139, 216.94521360759492], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \/\u6210\u529F\/", 462, 100.0, 35.53846153846154], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 462, "Test failed: text expected to contain \/\u6210\u529F\/", 462, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/home-web/assetBex", 50, 27, "Test failed: text expected to contain \/\u6210\u529F\/", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["开仓 /home-web/imitateCfd/apply ", 50, 49, "Test failed: text expected to contain \/\u6210\u529F\/", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["平仓 /home-web/imitateCfd/unwind ", 50, 49, "Test failed: text expected to contain \/\u6210\u529F\/", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["撤销委托  /home-web/imitateCfd/cancle/order", 50, 50, "Test failed: text expected to contain \/\u6210\u529F\/", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["/home-web/cfd/unwind/list ", 50, 37, "Test failed: text expected to contain \/\u6210\u529F\/", 37, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/home-web/point/account ", 50, 7, "Test failed: text expected to contain \/\u6210\u529F\/", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/home-web/banner/list?lang=zh_CN&r=1591692132734&type=BEX ", 50, 33, "Test failed: text expected to contain \/\u6210\u529F\/", 33, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["止盈止损修改  /home-web/imitateCfd/modifyLoseAndProfit", 50, 48, "Test failed: text expected to contain \/\u6210\u529F\/", 48, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/home-web/trade/userInfor  ", 50, 37, "Test failed: text expected to contain \/\u6210\u529F\/", 37, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["/home-web/imitateCfd/trade/userInfor ", 50, 19, "Test failed: text expected to contain \/\u6210\u529F\/", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["平仓记录 /home-web/imitateCfd/unwind/list ", 50, 3, "Test failed: text expected to contain \/\u6210\u529F\/", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/home-web/cfd/currency ", 50, 40, "Test failed: text expected to contain \/\u6210\u529F\/", 40, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["我的持仓 /home-web/imitateCfd/myPositions ", 50, 14, "Test failed: text expected to contain \/\u6210\u529F\/", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["限价交易 /home-web/imitateCfd/apply", 50, 49, "Test failed: text expected to contain \/\u6210\u529F\/", 49, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
