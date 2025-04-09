"use client";
import {  Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./chart.module.css";

const data = [
    {
      name: "Mon",
      visit: 4200, 
      click: 1400,
      
    },
    {
        name: "Tue",
        visit: 3000,
        click: 2500,
    },
    {
        name: "Wed",
        visit: 2500,
        click: 1100,
    },
    {
        name: "Thurs",
        visit: 1000,
        click: 400,
    },
    {
        name: "Fri",
        visit: 5500,
        click: 4000,
    },
    {
        name: "Sat",
        visit: 2100,
        click: 300,
    },
   
  ];
  
const Chart = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
        
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{background:"#151c2c",border:"none"}}/>
          <Legend />
          <Line
            type="monotone"
            dataKey="visit"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="click"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
