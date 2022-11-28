function GetChartData(bars)
{
    const fullChart = [
        {from: 100, to: 99, x: 31.80},
        {from: 99, to: 90, x: 37.30},
        {from: 90, to: 50, x: 28.10},
        {from: 50, to: 0, x: 2.80}
    ];

    let groupedBars = [];

    for(let i; i < bars.length; i++) {
        let nlabel = fullChart[bars[i][0]].from.toString() + ' - ' + fullChart[bars[i][bars[i].length - 1]].to.toString();
        let nx = 0;
        for(let j; j < bars[i].length; j++) {
            nx += fullChart[bars[i][j]].x;
        }
        groupedBars.push({label: nlabel, x: nx});
    }

    return groupedBars;
}