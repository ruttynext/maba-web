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
import { GetFormatTime, getTime } from '../../Utils';





const ragashimData = [
 
    { yAxisId: "1", dataKey:"T1", stroke: "#8884d8",hide: false},
    { yAxisId: "1", dataKey:"T2", stroke: "#82ca9d",hide: false}
];

function Referenceline(props) {
    const [ragashim, setRagashim] = useState(ragashimData);
    const [refLineActive, setRefLineActive] = useState("");
    const [sideLineActive, setSideLineActive] = useState("");
    const [zoomInActive, setZoomInActive] = useState(false);
    const [showUnderShootLine, setShowUnderShootLine] = useState(true);
    const [showOverShootLine, setShowOverShootLine] = useState(true);
    const [showFullDateTime, setShowFullDateTime] = useState(true);
    
    const [refAreaLeft, setRefAreaLeft] = useState("");
    const [refAreaRight, setRefAreaRight] = useState("");
    const [areaZoom , setAreaZoom] = useState(null);

    const onMouseUpFromArea=(active, activeIndex)=> {
       
        switch(zoomInActive) 
        {
            case true:
                if(refAreaLeft !== "" && refAreaRight !== "")
                {    
                  const indexAreaLeft = props.data.findIndex(x => x.timeStampToDisplay === refAreaLeft);
                  const indexAreaRight = props.data.findIndex(x => x.timeStampToDisplay === refAreaRight);  
                  setAreaZoom({'indexFrom': indexAreaLeft, 'indexTo': indexAreaRight + 1});
 
                  setRefAreaLeft("");   
                  setRefAreaRight("");
                }
                break
            case false:
                if(refLineActive !== "")
                {
                    const currentTimeStamp = props.data[activeIndex].timeStamp;
                    props.updateRanges(props.ranges.map(range => (range.key === refLineActive ? {...range, 'timeStampLeft' : sideLineActive === 'left' ? currentTimeStamp : range.timeStampLeft,
                    'sideLeftIndex' : sideLineActive === 'left' ? activeIndex : range.sideLeftIndex, 'timeStampRight' : sideLineActive === 'right' ? currentTimeStamp : range.timeStampRight, 
                    'sideRightIndex' : sideLineActive === 'right' ? activeIndex : range.sideRightIndex, 'strokeWidthValue' : 2} : range)));
                    setRefLineActive("");
                    setSideLineActive("");
                }
                break;
            default:
        }      

    }

  

    const RemoveRange = (key)=>
    {
        props.updateRanges(ranges =>
        props.ranges.filter(obj => {
          return obj.key !== key;
        }),
      );
    }

    const SetLabelText = (value, key)=>
     {

        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'labelText' : value} : range)));
     }

    const toggleDataSeries = (e)=>
    {    
       const newState = ragashim.map(obj => {
        if (obj.dataKey === e.dataKey) {
          return {...obj, hide: !obj.hide};
        }
          return obj;
      });
  
      setRagashim(newState);
    }

    const MoveReferanceLine = (key, side)=>
    {
        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'strokeWidthValue' : 1} : range)));
        setRefLineActive(key); 
        setSideLineActive(side);
    }
   
    const onMoveArea = (activeLabel, activeIndex)=>
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
                   const currentTimeStamp = props.data[activeIndex].timeStamp;
                   props.updateRanges(props.ranges.map(range => (range.key === refLineActive ? {...range, 
                                      'timeStampLeft' : sideLineActive === 'left' ? currentTimeStamp : range.timeStampLeft,
                                      'timeStampRight' : sideLineActive === 'right' ? currentTimeStamp : range.timeStampRight} : range)));
                }
                break;
            default:
        }  
    }
  
    const AddReferanceLine=()=>
    {
        var firstTime = props.data[0].timeStamp;
        var secTime = props.data[1].timeStamp;
    
        props.ranges.push({'key': props.ranges.length, 'timeStampLeft': firstTime, 'sideLeftIndex' : 0, 'timeStampRight': secTime, 
                           'sideRightIndex' : 1,'strokeWidthValue': 2, 'labelText' : '', 'rangeIsFixed': false});
        props.updateRanges(props.ranges.concat());  
    }

    const hundleZoomActive = () =>{

       setZoomInActive(current => !current);

       if(!!zoomInActive)
         setAreaZoom(null);

    };
     
    const SetLimit = (value, key) =>{
        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'rangeIsFixed': value, 
                                            'labelText' : value === true ? "p" + (key + 1) : ""} : range)));
    }

    const hundleFullDateTime = (val) =>{
    setShowFullDateTime(val);

    props.updateData(props.data.map(item => ({...item, 'timeStampToDisplay':  GetFormatTime(item.timeStamp, val)} )));

    };

    //Returns time duration in days/hours/minutes format between 2 dates.
    const getDurationRange=(startTime, endTime)=>{
        let days, hours, minutes, secs;
        var strDuration = "";
        [days, hours, minutes, secs] = getTime(startTime, endTime);
        if(days > 0)
          strDuration = days +" ימים"; 
        if(hours > 0)
          strDuration += " " + hours + " שעות";
        if(minutes > 0)
          strDuration += " " + minutes + " דקות";

          return strDuration;
    };

    return (
        <div className='c-reference-line'>
            <div className="highlight-bar-charts" style={{ userSelect: "none", width: "80%", }}>
                <br/>
                <div className='flexControl'>
                    <Button onClick={hundleZoomActive} style={{background : zoomInActive ? "#a5a5a5" : "",}}>
                        <span className={zoomInActive ? "k-icon k-i-zoom-out" : "k-icon k-i-zoom-in"}></span>
                    </Button>
                    <Checkbox onChange={(e) => (setShowUnderShootLine(e.value))} checked={showUnderShootLine}></Checkbox><Label>UnderShoot</Label>
                    <Checkbox onChange={(e) => (setShowOverShootLine(e.value))} checked={showOverShootLine}></Checkbox><Label>OverShoot</Label> 
                    <Checkbox onChange={(e) => (hundleFullDateTime(e.value))} checked={showFullDateTime}>תאריך מלא</Checkbox>
                </div>
                
                
               <div className='divRe' >
                    <LineChart width={props.width + 400} height={props.height} style={{cursor : zoomInActive ? "zoom-in" : "",}}
                            data={areaZoom ? props.data.slice(areaZoom.indexFrom, areaZoom.indexTo) : props.data.slice()} 
                            onMouseDown={(e) => zoomInActive ? setRefAreaLeft(e.activeLabel) : '' }
                            onMouseMove={(e) => onMoveArea(e.activeLabel, e.activeTooltipIndex)}
                            onMouseUp={(e) => onMouseUpFromArea(e.activeLabel, e.activeTooltipIndex) }
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timeStampToDisplay"             
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
                                    props.ranges.map(({key, timeStampLeft, timeStampRight, strokeWidthValue, labelText, rangeIsFixed }, index) => 
                                    {
                                       return(
                                            rangeIsFixed ?
                                            <>
                                              <ReferenceArea
                                                    label={{ value: labelText, fill: 'black', position: 'insideTop'}}
                                                    fill="white"                             
                                                    x1={GetFormatTime(timeStampLeft, showFullDateTime)}
                                                    x2={GetFormatTime(timeStampRight, showFullDateTime)}
                                                    stroke="yellow"
                                                    strokeWidth = "5"/>
                                            </> : 
                                            <>
                                              <ReferenceLine key={key + "1"} name={key} x= {GetFormatTime(timeStampLeft, showFullDateTime)} stroke="blue" strokeWidth={strokeWidthValue} 
                                                 onMouseDown = {(e) => {MoveReferanceLine(key, 'left')} }/>
                                              <ReferenceLine key={key + "2"} name={key} x= {GetFormatTime(timeStampRight, showFullDateTime)} stroke="red"  strokeWidth={strokeWidthValue} 
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
                            {showOverShootLine ? <ReferenceLine y={100} x={"07/30/2019 01:07"} label="OverShoot" stroke="green" /> : ''}
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
                
            </div>
           
            <div style={{ width: "20%", height:"100%" }}>
                <Button onClick={AddReferanceLine} icon="plus">הוסף גבול</Button>   
                {
                     props.ranges.length > 0 ?
                     <div className='divDinamicRanges'>
                     {
                         props.ranges.map(({key, timeStampLeft, sideLeftIndex, timeStampRight, sideRightIndex, labelText }, index) => {
                             return <div className='divControlsRange' key={"divRange_" + index}>
                                     { GetFormatTime(timeStampRight, showFullDateTime) } - { GetFormatTime(timeStampLeft, showFullDateTime) } <br/>
                                    
                                     {//time duration
                                       getDurationRange(timeStampRight, timeStampLeft) 
                                     }
                                     <div className='flexControls' key={"divRange2_" + index}> 
                                         <Checkbox key={"CheckSetLimit_" + index} onChange={(e) => (SetLimit(e.value, key))}></Checkbox>  &nbsp;    
                                         <Input key={"txtLabelText_" + index} value={labelText} onChange={(e) => SetLabelText(e.target.value, key)}/> &nbsp;
                                         <Button key={"btnRemoveRange_" + index} onClick={(e) => RemoveRange(key)}><span className="k-icon k-i-close"></span></Button>
                                         <Button key={"btnExpandChart_" + index} onClick={(e) => props.showRange({'indexFrom': sideLeftIndex, 'indexTo': sideRightIndex + 1})}><span className="k-icon k-i-full-screen"></span></Button>
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