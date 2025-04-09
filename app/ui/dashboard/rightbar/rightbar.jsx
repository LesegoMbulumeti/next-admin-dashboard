"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from './rightbar.module.css';


const Rightbar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper functions
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Date checks
  const isToday = (date) => {
    const today = new Date();
    return today.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toDateString();
  };

  const isSelected = (date) => {
    return selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toDateString();
  };

  // Render calendar
  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(
        <Button
          key={`day-${i}`}
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 font-normal rounded-full",
            isToday(i) && "bg-accent text-accent-foreground",
            isSelected(i) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
        >
          {i}
        </Button>
      );
    }

    return days;
  };

  // Pie chart data

  const data = [
    { name: 'Pending', value: 400 },
    { name: 'Cancelled', value: 300 },
    { name: 'Done', value: 200 },
    
  ];
  
  const COLORS = ['#363062', '#D84040', '#6EACDA'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  

  return (
    <div className="flex flex-col gap-4">
      {/* Calendar Section */}
      <div className="rounded-md border shadow-sm w-[280px] p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm font-medium">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </div>
          
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-2 text-xs text-muted-foreground">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="h-8 w-8 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>

        {/* Selected date */}
        {selectedDate && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">Selected date</p>
            <p className="text-sm">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
        
      {/* Pie Chart Section */}
      <div className={styles.chartcontainer}>
      <h2 className={styles.title}>Latest Transactions Status</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Rightbar;