import {React,  useState } from 'react'
import './referenceline.css'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceArea,
    ResponsiveContainer,
    ReferenceLine,Legend
} from "recharts";
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
const colors= ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 
'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 
'silver', 'teal', 'white', 'yellow'];
const initialData = [
    { timeStamp: "01:00", T1: 100.11, T2: 100 },
    { timeStamp: "01:01", T1: 28.37,T2: 120 },
    { timeStamp: "01:02", T1: 40.37, T2: 150 },
    { timeStamp: "01:03", T1: 28.16, T2: 180 },
    { timeStamp: "01:04", T1: 28.29, T2: 200 },
    { timeStamp: "01:05", T1: 28, T2: 499 },
    { timeStamp: "01:06", T1: 28.53, T2: 50 },
    { timeStamp: "01:07", T1: 28.52, T2: 100 },
    { timeStamp: "01:08", T1: 28.79, T2: 200 },
    { timeStamp: "01:09", T1: 28.94, T2: 222 },
    { timeStamp: "01:10", T1: 28.3, T2: 210 },
    { timeStamp: "01:11", T1: 28.41, T2: 300 },
    { timeStamp: "01:12", T1: 90.37, T2: 50 },
    { timeStamp: "01:13", T1: 28, T2: 190 },
    { timeStamp: "01:14", T1: 28, T2: 300 },
    { timeStamp: "01:15", T1: 28, T2: 400 },
    { timeStamp: "01:16", T1: 3, T2: 200 },
    { timeStamp: "01:17", T1: 2, T2: 50 },
    { timeStamp: "01:18", T1: 3, T2: 100 },
    { timeStamp: "01:19", T1: 7, T2: 100 }
];
const initialData2 = [
    { index: 1, timeStamp: "01:01", "Channels" : [{"ChannelName": "T1", "Value": 2.52},{"ChannelName": "T2", "Value": 4.41}]},
    { index: 2, timeStamp: "01:02", "Channels" : [{"ChannelName": "T1", "Value": 17.79},{"ChannelName": "T2", "Value": 120}]},
    { index: 3, timeStamp: "01:03", "Channels" : [{"ChannelName": "T1", "Value": 2.94},{"ChannelName": "T2", "Value": 1.79}]},
    { index: 4, timeStamp: "01:04", "Channels" : [{"ChannelName": "T1", "Value": 140.12},{"ChannelName": "T2", "Value": 27.41}]},
    { index: 5, timeStamp: "01:05", "Channels" : [{"ChannelName": "T1", "Value": 14.58},{"ChannelName": "T2", "Value": 144.3}]},
    { index: 6, timeStamp: "01:06", "Channels" : [{"ChannelName": "T1", "Value": 36.7},{"ChannelName": "T2", "Value": 140.79}]},
    { index: 7, timeStamp: "01:07", "Channels" : [{"ChannelName": "T1", "Value": 2.52},{"ChannelName": "T2", "Value": 4.41}]},
    { index: 8, timeStamp: "01:08", "Channels" : [{"ChannelName": "T1", "Value": 17.79},{"ChannelName": "T2", "Value": 4.3}]},
    { index: 9, timeStamp: "01:09", "Channels" : [{"ChannelName": "T1", "Value": 2.94},{"ChannelName": "T2", "Value": 1.79}]},
    { index: 10, timeStamp: "01:10", "Channels" : [{"ChannelName": "T1", "Value": 54.12},{"ChannelName": "T2", "Value": 27.41}]},
    { index: 11, timeStamp: "01:11", "Channels" : [{"ChannelName": "T1", "Value": 14.58},{"ChannelName": "T2", "Value": 144.3}]},
    { index: 12, timeStamp: "01:12", "Channels" : [{"ChannelName": "T1", "Value": 36.7},{"ChannelName": "T2", "Value": 95.79}]}
];
const reverData = initialData2.map(item=> 
    {
        const container = {};
        container.index = item.index;
        container.timeStamp = item.timeStamp;
        item.Channels.map(channel => {
            container[channel.ChannelName] = channel.Value;
        });

        return container;
    });
const ragashimData = [
 
    { yAxisId: "1", dataKey:"T1", stroke: "#8884d8",hide: false},
    { yAxisId: "1", dataKey:"T2", stroke: "#82ca9d",hide: false}
];

function Referenceline(props) {
    const [data, setData] = useState(reverData);
    const [ragashim, setRagashim] = useState(ragashimData);
    const [refLineActive, setRefLineActive] = useState("");
    const [sideLineActive, setSideLineActive] = useState("");
   
    const [refAreaLeft, setRefAreaLeft] = useState("");
    const [refAreaRight, setRefAreaRight] = useState("");
    
    const [ranges, setRanges] = useState([])
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    function handleClick() {
        setDisplayColorPicker(!displayColorPicker);
      }
    
      function handleClose() 
      {
        setDisplayColorPicker(false);
      }

    function onMouseUpFromArea(active, activeIndex) {
        console.log("onMouseUpFromArea00");
        console.log(refAreaLeft);
        console.log(refAreaRight);
        if(refLineActive !== "")
        {
            console.log("onMouseUpFromArea11");
            setRanges(ranges.map(range => (range.key === refLineActive ? {...range, 'rangeLeft' : sideLineActive === 'left' ? active : range.rangeLeft,
            'rangeRight' : sideLineActive === 'right' ? active : range.rangeRight, 'strokeWidthValue' : 3} : range)));
            setRefLineActive("");
            setSideLineActive("");
            return;

        }

       
        if(refAreaLeft !== "" && refAreaRight !== "")
        {
           // console.log("onMouseUpFromArea22");
           // console.log(refAreaLeft  + "  " + refAreaRight);
            //const indexleft = data.map((d) => { return d.timeStamp === refAreaLeft ?  d : ''} );
            //console.log(data[indexleft]);
            
            setData(data.slice(refAreaLeft, refAreaRight +1));
             console.log(data);
        }

    }

    function zoom()
    {
       
    }

    function RemoveRange(key)
    {
       setRanges(ranges =>
          ranges.filter(obj => {
          return obj.key !== key;
        }),
      );
    }

     function SetLabelText(value, key)
     {

        setRanges(ranges.map(range => (range.key === key ? {...range, 'labelText' : value} : range)));
     }

    function toggleDataSeries(e)
    {    
       const newState = ragashim.map(obj => {
        if (obj.dataKey === e.dataKey) {
          return {...obj, hide: !obj.hide};
        }
          return obj;
      });
  
      setRagashim(newState);
    }

    function MoveReferanceLine(key, side)
    {
        setRanges(ranges.map(range => (range.key === key ? {...range, 'strokeWidthValue' : 1} : range)));
        setRefLineActive(key); 
        setSideLineActive(side);
    }
   
    function onMoveArea(activeLabel, activeIndex)
    {  
        if(!(refLineActive !== ""))
        {
             if(refAreaLeft !== "")
             {
               setRefAreaRight(activeIndex);
              
             } 
             return;
        }
        
        setRanges(ranges.map(range => (range.key === refLineActive ? {...range, 'rangeLeft' : sideLineActive === 'left' ? activeLabel : range.rangeLeft,
                                                                    'rangeRight' : sideLineActive === 'right' ? activeLabel : range.rangeRight} : range)));
    }
    
    function AddReferanceLine()
    {
        let color = colors[Math.floor(Math.random() * colors.length)];
        ranges.push({'key': ranges.length, 'rangeLeft': '01:01', 'rangeRight': '01:02', 'strokeWidthValue': 3, 'labelText' : '', 'color' :  color});
        setRanges(ranges.concat());  
    }

    
     function onMouseDownLine(activeLabel, activeIndex)
     {
        console.log(activeIndex);
        setRefAreaLeft(activeIndex);
     }
     
     function ZoomOut()
     {
        setData(reverData.slice());
     }
    return (
        <div className='c-reference-line'>
            <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
                <br/>
                <Button onClick={ZoomOut}>Zoom Out</Button>
                <LineChart width={700} height={290}
                    data={data}
                     onMouseDown={(e) => onMouseDownLine(e.activeLabel, e.activeTooltipIndex) }
                     onMouseMove={(e) => onMoveArea(e.activeLabel, e.activeTooltipIndex)}
                     onMouseUp={(e) => onMouseUpFromArea(e.activeLabel, e.activeTooltipIndex) }
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timeStamp"
                    />
                    <YAxis
                        domain={['0', '500']}
                        type="number"
                        //yAxisId="1"
                    />
                    <Tooltip />
                    <Legend onClick={(e) => toggleDataSeries(e)}  />
                    {
                            ranges.map(({key, rangeLeft, rangeRight, strokeWidthValue, labelText, color }, index) => {
                                return(
                                <>
                                    <ReferenceLine key={key + "1"} name={key} x= {rangeLeft} stroke={color} label={labelText} strokeWidth={strokeWidthValue} 
                                      onMouseDown = {(e) => {MoveReferanceLine(key, 'left')} }
                                    />
                                    <ReferenceLine key={key + "2"} name={key} x= {rangeRight} stroke={color}  strokeWidth={strokeWidthValue} 
                                     onMouseDown = {(e) => {MoveReferanceLine(key, 'right')} }
                                    />
                                </>   )
                            })
                    }
                    <ReferenceLine y={100} label="Overshoot" stroke="red" />
                    {
                            ragashim.map(({ yAxisId, dataKey, stroke, hide }, index) => {
                                return(
                                    <Line
                                    //yAxisId= {yAxisId}
                                    type="monotone"
                                    dataKey={dataKey}
                                    stroke={stroke}
                                    animationDuration={300}
                                    hide={hide}
                                />)
                            })
                    }
                </LineChart>
            </div>
           
            <div>
                <Button onClick={AddReferanceLine}>הוסף גבול</Button>   
                {
                    ranges.length > 0 ?
                    <div className='divDinamicRanges'>
                    {
                        ranges.map(({key, rangeLeft, rangeRight, labelText }) => {
                            return <div>
                                    {rangeLeft} - {rangeRight}
                                    <div className='flexControls'>
                                        <Input Value={labelText} onChange={(e) => SetLabelText(e.target.value, key)}/>
                                        <Button onClick={(e) => RemoveRange(key)}>הסר</Button>
                                    </div> 
                                    
                                </div>
                        })
                    }
                    </div> : ""
                }         
            </div>   


      </div>

    )
}

export default Referenceline;