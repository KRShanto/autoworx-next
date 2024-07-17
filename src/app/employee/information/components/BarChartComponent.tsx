import React, { PureComponent } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Label  } from "recharts";

const data = [
  {
    category: "Category 1",
    jobs: 4000,
  },
  {
    category: "Category 2",
    jobs: 3000,
  },
  {
    category: "Category 3",
    jobs: 2000,
  },
  
];

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect x={x} y={y - 10} width={width} height={height} fill={fill} /> 
  );
};

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text x={x + width / 2} y={y - 15} fill="#66738C" textAnchor="middle" dy={-6}>
      {value}
    </text>
  );
};

interface BarChartComponentProps {
  height: number | string;
  title : string;
}
export default class Example extends PureComponent<BarChartComponentProps> {
  

  render() {
    return (
      <div style={{ width: "100%" }}>
          <h2 style={{  marginLeft: "35px" }}>{this.props.title}</h2> 
      <ResponsiveContainer width="90%" height={this.props.height}>
        <BarChart  data={data}
        margin={{
          top: 55,
          bottom: 5,
          
        }}
        >

        <XAxis dataKey="category"  />
        <YAxis tick={false}>
            <Label
              angle={-360}
              value="Number of Jobs"
              position="top"
              offset={20}
              style={{ textAnchor: 'middle', transform: 'translateX(20px)' }}
              
            >
              Jobs
            </Label>
          </YAxis>
        <Bar dataKey="jobs" fill="#03A7A2" shape={<CustomBar />} label={<CustomLabel />}>
        
      </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    );
  }
}
