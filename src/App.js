import React, { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Switch, FormControlLabel, Slider, Box } from '@mui/material';
import GetChartData from './ChartData';
import { GiPerson } from "react-icons/gi";
import './App.css';

let UbI = false;
let ChartGroups = Array.from([[0, 1, 2, 3]]);

let ubiAmount = 0.0265;

const App = () => {
  const [data, setData] = useState(GetChartData(ChartGroups, UbI, ubiAmount));

  const applyUbi = (e) => {
    UbI = !UbI;

    setData(GetChartData(ChartGroups, UbI, ubiAmount));
  }

  const splitBar = (event) => {
    event.preventDefault();
    
    const i = parseInt(event.target.id);

    //delete first bar from clicked group
    const firstBar = ChartGroups[i].splice(0, 1);

    //insert first bar of the group before the clicked group
    ChartGroups.splice(i, 0, firstBar);
  
    setData(GetChartData(ChartGroups, UbI, ubiAmount));
  }
  
  const groupBars = (event) => {
    event.preventDefault();

    const i = parseInt(event.target.id);

    //save the next bar(group)
    const chartGroup = ChartGroups[i + 1];

    //remove the next bar(group) from the chart
    ChartGroups.splice(i + 1, 1);

    //add that next bar(group) to the selected bar(group)
    ChartGroups[i] = Array.from(ChartGroups[i]).concat(chartGroup);
    
    setData(GetChartData(ChartGroups, UbI, ubiAmount));
  }

  function getMergeButtons() {
    let buffer = [];
    for(let i = 0; i < data.length - 1; i++) {
      buffer.push(<p className='mergeButton' key={i} id={i} onClick={groupBars}>&gt;&gt;&gt;&gt;  &lt;&lt;&lt;&lt;</p>);
    }
    return buffer;
  }

  function getPersonGrid(bar) {
      let buffer = [];
      const size = bar.from - bar.to;
      let j = 0;
      let line = 0;
      for(let i = 0; i < 100; i++) {
        j += 1;
        let visible = 100 - i > bar.to && 100 - i <= bar.from;
        let icon = visible ? (<GiPerson size={12}/>) : (<GiPerson size={12} className="invisiblePerson"/>); 
        if (j === 10)
        {
          j = 0;
          buffer.push(<>{icon}<br key={"linebreak_" + line}/></>)
          line += 1;
        } else {
          buffer.push(icon)
        }
      }
      return buffer;
  }

  const changeAmount = (e) => {
    ubiAmount = e.target.value;
    setData(GetChartData(ChartGroups, UbI, ubiAmount));
  }

  function valueText(value) {
      const fullAmount = value * 452847.241;
      const amountText = "$" + fullAmount.toFixed(2).replace("^$(0|[1-9][0-9]{0,2})(,d{3})*(.d{1,2})?$");
      return amountText;
  }

  const marks = [
    {
      value: 0.0022,
      label: '$1,000',
    },
    {
      value: 0.0265,
      label: '$12,000',
    },
    {
      value: 0.1325,
      label: '$60,000',
    },
    {
      value: 0.33,
      label: '$150,000',
    }
  ];

  return (
    <div className='visualization'>
      <Box sx={{ width: 750 }}>
        <FormControlLabel control ={<Switch className="ubiSwitch" />} label="UBI" onChange={applyUbi}/>
        <Slider
          className="ubiSlider"
          aria-label="Always visible"
          valueLabelFormat={valueText}
          min={0}
          max={0.33}
          defaultValue={0.0265}
          step={null}
          marks={marks}
          valueLabelDisplay='auto'
          onChange={changeAmount}
        />
      </Box>
      <BarChart width={750} height={450} data={data} barSize={40}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]}/>
        <CartesianGrid horizontal={true} />
        <Bar dataKey="x" stackId="a">
          {data.map((item, index) => {
            if (item.singleBar) {
              return <Cell key={index} fill="#9a9cb8" />;
            } else {
              return <Cell key={index} fill="#4d79ff" id={index} onClick={splitBar} />;
            }
          })}
        </Bar>
        <Bar dataKey="y" stackId="a" fill="#ff3333"/>
      </BarChart>
      <div className='mergeButtons'>
        {
          getMergeButtons()
        }
      </div>
      <table className='personGrids'>
        <tbody>
        <tr>
        {
          data.map((bar) => {
            return (<td key={bar.name} className='personGrid'>{getPersonGrid(bar)}</td>)
          })
        }
        </tr>
        </tbody>
      </table>
    </div>)
}

export default App;
