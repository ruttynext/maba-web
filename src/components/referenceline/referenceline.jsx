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
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from "@progress/kendo-react-labels";


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
    const [zoomInActive, setZoomInActive] = useState(false);
    const [showUnderShootLine, setShowUnderShootLine] = useState(true);
    const [showOverShootLine, setShowOverShootLine] = useState(true);

    const [refAreaLeft, setRefAreaLeft] = useState("");
    const [refAreaRight, setRefAreaRight] = useState("");
    
    //const [ranges, setRanges] = useState([]);

    function onMouseUpFromArea(active, activeIndex) {
       
        switch(zoomInActive) 
        {
            case true:
                if(refAreaLeft !== "" && refAreaRight !== "")
                {    
                  const indexAreaLeft = data.findIndex(x => x.timeStamp === refAreaLeft);
                  const indexAreaRight = data.findIndex(x => x.timeStamp === refAreaRight);  

                  setData(data.slice(indexAreaLeft, indexAreaRight + 1));  
                  setRefAreaLeft("");   
                  setRefAreaRight("");
                }
                break
            case false:
                if(refLineActive !== "")
                {
                    props.updateRanges(props.ranges.map(range => (range.key === refLineActive ? {...range, 'rangeLeft' : sideLineActive === 'left' ? active : range.rangeLeft,
                    'rangeRight' : sideLineActive === 'right' ? active : range.rangeRight, 'strokeWidthValue' : 2} : range)));
                    setRefLineActive("");
                    setSideLineActive("");
                }
                break;
            default:
        }      

    }

  

    function RemoveRange(key)
    {
        props.updateRanges(ranges =>
        props.ranges.filter(obj => {
          return obj.key !== key;
        }),
      );
    }

     function SetLabelText(value, key)
     {

        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'labelText' : value} : range)));
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
        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'strokeWidthValue' : 1} : range)));
        setRefLineActive(key); 
        setSideLineActive(side);
    }
   
    function onMoveArea(activeLabel, activeIndex)
    {  

        switch(zoomInActive) 
        {
            case true:
     
                if(refAreaLeft !== "")
                {
                  setRefAreaRight(activeLabel);
                }
                break
            case false:
                if(refLineActive !== "")
                {
                   props.updateRanges(props.ranges.map(range => (range.key === refLineActive ? {...range, 'rangeLeft' : sideLineActive === 'left' ? activeLabel : range.rangeLeft,
                   'rangeRight' : sideLineActive === 'right' ? activeLabel : range.rangeRight} : range)));
                }
                break;
            default:
        }  
    }
    
    function AddReferanceLine()
    {
        props.ranges.push({'key': props.ranges.length, 'rangeLeft': '01:01', 'rangeRight': '01:02', 'strokeWidthValue': 2, 'labelText' : '', 'rangeIsFixed': false});
        props.updateRanges(props.ranges.concat());  
    }


     const hundleZoomActive = () =>{

       setZoomInActive(current => !current);

       if(!!zoomInActive)
         setData(reverData.slice());

     };
     
     const SetLimit = (value, key) =>{
   
        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'rangeIsFixed': value, 
                                                      'labelText' : value === true ? "p" + (key + 1) : ""} : range)));
   }
    return (
        <div className='c-reference-line'>
            <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
                <br/>
                <div className='flexControl'>
                    <Button onClick={hundleZoomActive} style={{background : zoomInActive ? "#a5a5a5" : "",}}>
                        <span className={zoomInActive ? "k-icon k-i-zoom-out" : "k-icon k-i-zoom-in"}></span>
                    </Button>
                    <Checkbox onChange={(e) => (setShowUnderShootLine(e.value))} checked={showUnderShootLine}></Checkbox><Label>UnderShoot</Label>
                    <Checkbox onChange={(e) => (setShowOverShootLine(e.value))} checked={showOverShootLine}></Checkbox><Label>OverShoot</Label> 
                   
                </div>
                
                

                <LineChart width={props.width} height={props.height} style={{cursor : zoomInActive ? "zoom-in" : "",}}
                    data={data}
                     onMouseDown={(e) => zoomInActive ? setRefAreaLeft(e.activeLabel) : '' }
                     onMouseMove={(e) => onMoveArea(e.activeLabel, e.activeTooltipIndex)}
                     onMouseUp={(e) => onMouseUpFromArea(e.activeLabel, e.activeTooltipIndex) }
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timeStamp"
                    />
                    <YAxis
                         allowDataOverflow
                        domain={['0', '500']}
                        type="number"
                        //yAxisId="1"
                    />
                    <Tooltip />
                    <Legend onClick={(e) => toggleDataSeries(e)}  />
                    {
                             props.ranges.map(({key, rangeLeft, rangeRight, strokeWidthValue, labelText, rangeIsFixed }, index) => 
                             {
                                return(
                                    rangeIsFixed ?
                                    <>
                                      <ReferenceArea
                                            label={{ value: labelText, fill: 'black', position: 'insideTop'}}
                                            fill="white"                             
                                            x1={rangeLeft}
                                            x2={rangeRight}
                                            stroke="yellow"
                                            strokeWidth = "5"/>
                                    </> : 
                                    <>
                                      <ReferenceLine key={key + "1"} name={key} x= {rangeLeft} stroke="blue" strokeWidth={strokeWidthValue} 
                                         onMouseDown = {(e) => {MoveReferanceLine(key, 'left')} }/>
                                      <ReferenceLine key={key + "2"} name={key} x= {rangeRight} stroke="red"  strokeWidth={strokeWidthValue} 
                                         onMouseDown = {(e) => {MoveReferanceLine(key, 'right')} }/>
                                    </> 
                                )
                             })
                    }

                    {
                        refAreaLeft && refAreaRight ? (
                            <ReferenceArea
                                x1={refAreaLeft}
                                x2={refAreaRight}
                                strokeOpacity={0.3}
                            />
                        ) : null
                    }
                    {showOverShootLine ? <ReferenceLine y={100} label="OverShoot" stroke="green" /> : ''}
                    {showUnderShootLine ? <ReferenceLine y={20} label="UnderShoot" stroke="green" /> : ''}
                        {
                                ragashim.map(({ yAxisId, dataKey, stroke, hide }, index) => 
                                {
                                    return(
                                        <Line
                                            key={index}
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
                <Button onClick={AddReferanceLine} icon="plus">הוסף גבול</Button>   
                {
                    props.ranges.length > 0 ?
                    <div className='divDinamicRanges'>
                    {
                        props.ranges.map(({key, rangeLeft, rangeRight, labelText }, index) => {
                            return <div className='divControlsRange' key={"divRange_" + index}>
                                    {rangeLeft} - {rangeRight}
                                    <div className='flexControls' key={"divRange2_" + index}> 
                                        <Checkbox key={"CheckSetLimit_" + index} onChange={(e) => (SetLimit(e.value, key))}></Checkbox>  &nbsp;    
                                        <Input key={"txtLabelText_" + index} value={labelText} onChange={(e) => SetLabelText(e.target.value, key)}/> &nbsp;
                                        <Button key={"btnRemoveRange_" + index} onClick={(e) => RemoveRange(key)}><span className="k-icon k-i-close"></span></Button>
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