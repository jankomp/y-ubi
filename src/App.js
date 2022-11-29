import React, { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Switch, FormControlLabel } from '@mui/material';
import GetChartData from './ChartData';
import './App.css';

let UbI = false;
let ChartGroups = Array.from([[0],[1],[2],[3]]);

const ubiAmount = 0.33;

const App = () => {
  
  const [data, setData] = useState(GetChartData(ChartGroups, UbI, ubiAmount));

  const applyUbi = (e) => {
    UbI = !UbI;

    setData(GetChartData(ChartGroups, UbI, ubiAmount));
  }
  
  const groupBars = (event) => {
    event.preventDefault();

    const i = parseInt(event.target.id);

    const chartGroup = ChartGroups[i + 1];

    ChartGroups.splice(i + 1, 1);


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

  return (
    <>
      <FormControlLabel control ={<Switch className="ubiSwitch" />} label="UBI" onChange={applyUbi}/>
      <BarChart width={400} height={400} data={data} barSize={40}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]}/>
        <CartesianGrid horizontal={true} vertical={false} />
        <Bar dataKey="x" stackId="a">
          {data.map((item, index) => {
            return <Cell key={index} fill={item.color} />;
          })}
        </Bar>
        <Bar dataKey="y" stackId="a" fill="#ff3333" fillRule='inherit' />
      </BarChart>
      <div className='mergeButtons'>
        {
          getMergeButtons()
        }
      </div>
    </>)
}

export default App;
