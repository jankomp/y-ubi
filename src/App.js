import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Switch, FormControlLabel } from '@mui/material';
import './App.css';

const App = () => {
  const data = [
      {name: 'Top 1%', x: 31.80, y: 0.33},
      {name: '99 - 90%', x: 37.30, y: 3.00},
      {name: '90 - 50%', x: 28.10, y: 13.33},
      {name: 'Bottom 50%', x: 2.80, y: 16.67}
  ];

  return (
    <>
      <FormControlLabel control ={<Switch  />} label="UBI" />
      <BarChart width={500} height={500} data={data} >
          
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid horizontal={true} vertical={false} />
          <Bar dataKey="x" stackId="a" fill="#4d79ff" />
          <Bar dataKey="y" stackId="a" fill="#ff3333" />
        </BarChart>
    </>)
}

export default App;
