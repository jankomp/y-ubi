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
        let nx = 0;
        for(let j = 0; j < bars[i].length; j++) {
            nx += fullChart[bars[i][j]].x;
        }
        const fillColor = (bars[i].length === 1) ? "#9a9cb8" : "#4d79ff";
        let ubiForGroup = 0;
        if (UbI) {
            ubiForGroup = UbIAmount*size;
        }

        groupedBars.push({name: nlabel, x: nx, y: ubiForGroup, fill: fillColor});
    }

    return groupedBars;
}

export default GetChartData;
