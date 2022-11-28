import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Switch, FormControlLabel } from '@mui/material';
import GetChartData from './ChartData';
import './App.css';

let UbI = false;
let ChartGroups = [[0],[1],[2],[3]];

const App = () => {
  
  const [data, setData] = useState(GetChartData(ChartGroups));

  const applyUbi = (e) => {
    UbI = !UbI;

    if (UbI) {
      setData([
        {name: 'Top 1%', x: 31.80, y: 0.33},
        {name: '99 - 90%', x: 37.30, y: 3.00},
        {name: '90 - 50%', x: 28.10, y: 13.33},
        {name: 'Bottom 50%', x: 2.80, y: 16.67}
      ]);
    } else {
      setData([
        {name: 'Top 1%', x: 31.80, y: 0},
        {name: '99 - 90%', x: 37.30, y: 0},
        {name: '90 - 50%', x: 28.10, y: 0},
        {name: 'Bottom 50%', x: 2.80, y: 0}
      ]);
    }
  }
  
  function groupLastTwoBars() {
    ChartGroups = [[0],[1],[2 , 3]];
    setData(GetChartData(ChartGroups));
  }

  return (
    <>
      <FormControlLabel control ={<Switch  />} label="UBI" onChange={applyUbi}/>
      <BarChart width={400} height={400} data={data} barSize={40}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]}/>
        <CartesianGrid horizontal={true} vertical={false} />
        <Bar dataKey="x" stackId="a" fill="#4d79ff" />
        <Bar dataKey="y" stackId="a" fill="#ff3333" />
      </BarChart>
      <div className='mergeButtons'>
        <p className='mergeButton'>&gt;&gt;&gt;&gt;  &lt;&lt;&lt;&lt;</p>
        <p className='mergeButton'>&gt;&gt;&gt;&gt;  &lt;&lt;&lt;&lt;</p>
        <p className='mergeButton' onClick={groupLastTwoBars}>&gt;&gt;&gt;&gt;  &lt;&lt;&lt;&lt;</p>
      </div>
    </>)
}

export default App;
