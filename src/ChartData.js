function GetChartData(bars, UbI, UbIAmount)
{
    const fullChart = [
        {from: 100, to: 99, x: 31.80},
        {from: 99, to: 90, x: 37.30},
        {from: 90, to: 50, x: 28.10},
        {from: 50, to: 0, x: 2.80}
    ];

    let groupedBars = [];
    for(let i = 0; i < bars.length; i++) {
        let nlabel = fullChart[bars[i][0]].from.toString() + ' - ' + fullChart[bars[i][bars[i].length - 1]].to.toString();
        const size = fullChart[bars[i][0]].from - fullChart[bars[i][bars[i].length - 1]].to;
        const from = fullChart[bars[i][0]].from;
        const to = fullChart[bars[i][bars[i].length - 1]].to;

        let nx = 0;
        for(let j = 0; j < bars[i].length; j++) {
            nx += fullChart[bars[i][j]].x;
        }
        const singleBar = (bars[i].length === 1);
        let ubiForGroup = 0;
        if (UbI) {
            ubiForGroup = UbIAmount*size;
        }

        groupedBars.push({name: nlabel, from: from, to: to, x: nx, y: ubiForGroup, singleBar: singleBar});
    }

    return groupedBars;
}

export default GetChartData;
