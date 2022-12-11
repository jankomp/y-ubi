import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Switch, FormControlLabel, Slider, Box, Typography } from '@mui/material';
import GetChartData from './ChartData';
import { GiPerson } from "react-icons/gi";

import './App.css';
import moneyImg from './res/money.png';
import moneyBag from './res/moneybag.png';
import vat from './res/vat.png';
import gov from './res/gov.png';
import industry from './res/industry.png';
import stock from './res/stock.png';
import tax from './res/tax.png';


let UbI = false;
let ChartGroups = Array.from([[0, 1, 2, 3]]);

let ubiAmount = 0.0265;

let moneyStart = {x: 750, y: 500};
const moneySteps = 50;
let vectors = [];

const App = () => {
  const [data, setData] = useState(GetChartData(ChartGroups, UbI, ubiAmount));
  const [moneyPos, setMoneyPos] = useState([]);

  const switchStyle = {
    borderRadius: 2,
    "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
      backgroundColor: "#ff3C3C",
      color: "#ff3333"
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#ff3333"
    },
    "&:hover .MuiSwitch-switchBase": {
      color: "#ff3333"
    }
  }

  const applyUbi = async(e) => {
    UbI = !UbI;
    if(UbI) {
      await animation();
    }
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
      buffer.push(<p className='mergeButton' key={i} id={i} onClick={groupBars}>&gt;&gt;&gt;&gt;&gt;  &lt;&lt;&lt;&lt;&lt;</p>);
    }
    return buffer;
  }

  function getPersonGrid(bar) {
      let buffer = [];

      let j = 0;
      let line = 0;
      for(let i = 0; i < 100; i++) {
        j += 1;
        let visible = 100 - i > bar.to && 100 - i <= bar.from;
        let icon = visible ?
          (<GiPerson size={12} className="person" key={"person_" + i} id={"person_" + i}/>) :
          (<GiPerson size={12} className="invisiblePerson" key={"invisiblePerson_" + i} id={"invisiblePerson_" + i}/>); 
        
        if (j === 10)
        {
          j = 0;
          buffer.push(<>{icon}<br key={"linebreak_" + line} className="lineBreak"/></>)
          line += 1;
        } else {
          buffer.push(icon);
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

  function getMoney() {
    let moneyBuffer = [];
    for(let i = 0; i < 100; i++) {
      let x, y;
      if (moneyPos.length > i) {
        x = moneyPos[i].x;
        y = moneyPos[i].y;
      } else {
        x = moneyStart.x;
        y = moneyStart.y;
        moneyPos.push({x: moneyStart.x, y: moneyStart.y});
      }
      const mTransform = 'translate(' + x + 'px, ' + y + 'px)';
      moneyBuffer.push(<img src={moneyImg} alt="wad of money" key={"money_" + i} id={i} style={{position:'absolute', transform: mTransform, width: '1%'}}/>)
    }
    return moneyBuffer;
  }

  function findAnimationVectors() {
    vectors = [];
    let goal, direction;
    for(let i = 0; i < 100; i++) {
      let clientRect = document.getElementById("person_" + i).getBoundingClientRect();
      const x = clientRect.x - clientRect.width;
      const y = clientRect.y;

      goal = {x: x, y: y};
      
      direction = {x: (goal.x - moneyStart.x) / moneySteps, y: (goal.y - moneyStart.y) / moneySteps};
      vectors.push(direction);
    }
  }

  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  async function animation() {
    findAnimationVectors();
    //coins fly to person icons
    for(let i = 0; i < moneySteps; i++) {
      const sleepUntil = Date.now() + 20;
      setMoneyPos(moneyPos.map((item) => ({x: item.x + i*vectors[moneyPos.indexOf(item)].x, y: item.y + i*vectors[moneyPos.indexOf(item)].y})));

      const sleepFor = sleepUntil - Date.now();
      if (sleepFor > 0) {
        await sleep(sleepFor);
      }
    }
    await sleep(250)

    //coins fly straight up
    for(let i = 0; i < 10; i++) {
      const sleepUntil = Date.now() + 20;
      setMoneyPos(moneyPos.map((item) => ({x: item.x + (moneySteps-1)*vectors[moneyPos.indexOf(item)].x, y: item.y + (moneySteps-1)*vectors[moneyPos.indexOf(item)].y - i*7})));

      const sleepFor = sleepUntil - Date.now();
      if (sleepFor > 0) {
        await sleep(sleepFor);
      }
    }
    setMoneyPos([]);
  }

  return (
    <div className='visualization'>
      {getMoney()}
      <img src={moneyBag} alt="moneybag" style={{position:'absolute', transform: 'translate(700px, 455px)', width: '150px'}}/>
      <img src={gov} alt="vat" style={{position:'absolute', transform: 'translate(935px, 493px)', width: '110px'}}/>
      <img src={stock} alt="vat" style={{position:'absolute', transform: 'translate(1150px, 478px)', width: '130px'}}/>
      <img src={industry} alt="vat" style={{position:'absolute', transform: 'translate(1040px, 469px)', width: '140px'}}/>
      <img src={tax} alt="vat" style={{position:'absolute', transform: 'translate(875px, 475px)', width: '80px'}}/>
      <img src={vat} alt="vat" style={{position:'absolute', transform: 'translate(1000px, 445px)', width: '80px'}}/>
      <div className='barChart'>
        <BarChart width={550} height={450} data={data} barSize={40}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]}/>
          <CartesianGrid horizontal={true} vertical={false}/>
          <Bar dataKey="x" stackId="a">
            {data.map((item, index) => {
              if (item.singleBar) {
                return <Cell key={index} fill="#9a9cb8" />;
              } else {
                return <Cell key={index} fill="#4d79ff" id={index} className="clickableBar" onClick={splitBar} />;
              }
            })}
          </Bar>
          <Bar dataKey="y" stackId="a" fill="#ff3333"/>
        </BarChart>
      </div>
      <h1 className="title">Why ubi?</h1>
      <p className="description">The bar chart shows the total wealth of the US population in the first quarter of 2022 in percent.
        Click on blue bars to have them split up into two groups of wealthier and poorer people (from left to right).
        When you click on the arrows at the bottom of two neighboring bars they can be merged together again.<br/>
        If you click the UBI switch a one-time payment of the same amount for every US citizen is calculated and the effect is shown on the graph.
        Use the slider to choose a different amount.
      </p>
      <div className='ubiControls'>
        <Box sx={{ width: 700 }}>
        <FormControlLabel control ={<Switch sx={switchStyle}/>} label={<Typography variant="h5">ubi</Typography>} onChange={applyUbi}/>
        <Slider
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
      </div>
      <div className='mergeButtons'>
        {
          getMergeButtons()
        }
      </div>
      <div className='personGrids'>
        {
          data.map((bar) => {
            return (<div key={bar.name} className='personGrid'>{getPersonGrid(bar)}</div>)
          })
        }
      </div>
    </div>)
}

export default App;
