import {React,  useState } from 'react'

import './referenceline.css'

import {LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip,
        ReferenceArea, ReferenceLine, Legend } from "recharts";
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from "@progress/kendo-react-labels";
import { GetFormatTime, getTime } from '../../Utils';
import logo from './../../assets/images/LogoMaba.jpg'


const ragashimData = [
 
    { yAxisId: "1", dataKey:"T1", stroke: "#8884d8",hide: false},
    { yAxisId: "1", dataKey:"T2", stroke: "#82ca9d",hide: false}
];

// Creating enum object
const stateChartEnum = {
    normal: 0,
    zoomActive: 1,
    addLimit: 2
  };
  
function Referenceline(props) {
    const [ragashim, setRagashim] = useState(ragashimData);
    const [refLineActive, setRefLineActive] = useState("");
    const [sideLineActive, setSideLineActive] = useState("");
    const [showUnderShootLine, setShowUnderShootLine] = useState(true);
    const [showOverShootLine, setShowOverShootLine] = useState(true);
    const [showFullDateTime, setShowFullDateTime] = useState(true);
    const [refAreaLeft, setRefAreaLeft] = useState("");
    const [refAreaRight, setRefAreaRight] = useState("");
    const [areaZoom , setAreaZoom] = useState(null);
    const [stateChart , setStateChart] = useState(stateChartEnum.normal);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false); // hide menu


    // event of mouse leaves the chart
    const onMouseUpFromArea=(active, activeIndex)=> {
       
        switch(stateChart) //chart status
        {
            case stateChartEnum.zoomActive: //in zoom mode

                if(refAreaLeft !== "" && refAreaRight !== "")
                {    
                  const indexAreaLeft = props.data.findIndex(x => x.timeStampToDisplay === refAreaLeft);
                  const indexAreaRight = props.data.findIndex(x => x.timeStampToDisplay === refAreaRight);  
                  setAreaZoom({'indexFrom': indexAreaLeft, 'indexTo': indexAreaRight + 1});
 
                  setRefAreaLeft("");   
                  setRefAreaRight("");
                  setStateChart(stateChartEnum.normal); //resets the chart state 
                }
                break;

            case stateChartEnum.normal: //in normal mode

                if(refLineActive !== "")
                {
                    const currentTimeStamp = props.data[activeIndex].timeStamp;
                    props.updateRanges(props.ranges.map(range => (range.key === refLineActive ? {...range, 'timeStampLeft' : sideLineActive === 'left' ? currentTimeStamp : range.timeStampLeft,
                                      'sideLeftIndex' : sideLineActive === 'left' ? activeIndex : range.sideLeftIndex, 
                                      'timeStampRight' : sideLineActive === 'right' ? currentTimeStamp : range.timeStampRight, 
                                      'sideRightIndex' : sideLineActive === 'right' ? activeIndex : range.sideRightIndex, 'strokeWidthValue' : 2} : range)));
                    setRefLineActive("");
                    setSideLineActive("");
                }
                break;
            case stateChartEnum.addLimit: //in normal mode
             {
                setStateChart(stateChartEnum.normal); //resets the chart state 
            //     props.markes.push({'key': props.markes.length, 'timeStampLeft': firstTime, 'sideLeftIndex' : 0, 'timeStampRight': secTime, 
            //                 'sideRightIndex' : 1,'strokeWidthValue': 2, 'labelText' : '', 'rangeIsFixed': false});
            //  props.updateRanges(props.ranges.concat());
                break;
            }
            default:
        }      

    }
    
    //event of removing range
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
    
    //show/hide line from chart
    const shoeOrHideLineFromChart = (e)=>
    {    
       const newState = ragashim.map(obj => {
        if (obj.dataKey === e.dataKey) {
          return {...obj, hide: !obj.hide};
        }
          return obj;
      });
  
      setRagashim(newState);
    }
    
    //Mouse click event on the ReferenceLine =>to move the lines 
    const MoveReferanceLine = (key, side)=>
    {
        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'strokeWidthValue' : 1} : range)));
        setRefLineActive(key); 
        setSideLineActive(side);
    }
    
    //a mouse event moves on the chart
    const onMoveArea = (activeLabel, activeIndex)=>
    {  

        switch(stateChart) //chart status
        {
            case stateChartEnum.zoomActive: //in zoom mode
     
                if(refAreaLeft !== "")
                {
                  setRefAreaRight(activeLabel);
                }
                break

            case stateChartEnum.normal: //in normal mode
               
                if(refLineActive !== "")
                {
                   const currentTimeStamp = props.data[activeIndex].timeStamp;
                   props.updateRanges(props.ranges.map(range => (range.key === refLineActive ? {...range, 
                                      'timeStampLeft' : sideLineActive === 'left' ? currentTimeStamp : range.timeStampLeft,
                                      'timeStampRight' : sideLineActive === 'right' ? currentTimeStamp : range.timeStampRight} : range)));
                }
                break;
            case stateChartEnum.addLimit: //in add limit mode
     
                if(refAreaLeft !== "")
                {
                  setRefAreaRight(activeLabel);
                }
                break

            default:
        }  
    }


    const setArea = (activeLabel, activeIndex) =>
    {  
        setRefAreaLeft(activeLabel);
       
        if(stateChart ===  stateChartEnum.normal)
           setStateChart(stateChartEnum.addLimit)   
    }
    
    //event of adding new range
    const AddReferanceLine=()=>
    {
         var firstTime = props.data[0].timeStamp;
         var secTime = props.data[1].timeStamp;
    
         props.ranges.push({'key': props.ranges.length, 'timeStampLeft': firstTime, 'sideLeftIndex' : 0, 'timeStampRight': secTime, 
                            'sideRightIndex' : 1,'strokeWidthValue': 2, 'labelText' : '', 'rangeIsFixed': false});
         props.updateRanges(props.ranges.concat());  
    }
 
    //on clicking on the zoom button => resets the chart state to zoomActive
    const setZoomIn = () =>{
       setStateChart(stateChart !== stateChartEnum.zoomActive ? stateChartEnum.zoomActive : stateChartEnum.normal);
    };
    
    //resets the chart mode to normal from zoom mode.
    const setZoomout = () =>{
        setStateChart(stateChartEnum.normal);
        setAreaZoom(null);  
     };
    
    const SetLimit = (value, key) =>{
        props.updateRanges(props.ranges.map(range => (range.key === key ? {...range, 'rangeIsFixed': value, 
                                            'labelText' : value === true ? "p" + (key + 1) : ""} : range)));
    }
  
     //show full/partial dateTime.
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
 
   //Creating custom chart points based on the point value
  const customDot = ({ key, cx, cy, payload, value, stroke, fill, r }) => {

    return(
     <circle
         key={key}
         cx={cx}
         cy={cy}
         r={value === 27.41  ? 4 : r}
         stroke={stroke}
         fill={value === 27.41  ? "#000000" : fill}
         data-testid={payload.name}
         id={`dot_${payload.name}`}
       />)
    };

    const Menu = (event) => {
       // const { anchorPoint, show } = useContextMenu();
      console.log("Menu");
      console.log(anchorPoint.y);
      console.log(anchorPoint.x);

    //   const clickX = event.clientX;
    //   const clickY = event.clientY;
    //   const screenW = window.innerWidth;
    //   const screenH = window.innerHeight;
    //   const rootW = this.root.offsetWidth;
    //   const rootH = this.root.offsetHeight;
      
    //   const right = (screenW - clickX) > rootW;
    //   const left = !right;
    //   const top = (screenH - clickY) > rootH;
    //   const bottom = !top;

          return (
            //  <circle
            //                      key={"gggfd4"}
            //                     // cx={227.6315789473684}
                                
            //                      //cy={210.05578555890818}
            //                      r={20}
                               
            //                      fill={"#000000" }
            //                      style={{ left: 350.6315789473684, top: 450 }}
            //                  />
              <ul className="menu" style={{ left: 350.6315789473684 }}>
                 <li>Share to..</li>
                <li>Cut</li>
               <li>Copy</li>
               <li>Paste</li>
               <hr />
                <li>Refresh</li>
                <li>Exit</li>
              </ul> 
     
          );
       
        
      };
    
    //Returns the mouse cursor icon when moving over the chart according to the chart mode.
    const getCursor = () =>
    {
        switch(stateChart) 
        {
            case stateChartEnum.addLimit:
                return "grab";
            case stateChartEnum.zoomActive:
                return "zoom-in";
            default:
                return "";
        }  
      
    }

    const openMenu =(e)=>
    {
        console.log("openMenu");
        e.preventDefault();
        setAnchorPoint({ x: e.pageX, y: e.pageY });
        setShow(true);
    }

    return (
        <div className='c-reference-line'>
            <div className="highlight-bar-charts" style={{ userSelect: "none", width: "80%", }}>
                <br/>
                <div className='flexControl'>
                    <Button onClick={setZoomIn} style={{background : stateChart === stateChartEnum.zoomActive ? "#a5a5a5" : "",}}>
                        <span className={"k-icon k-i-zoom-in"}></span>
                    </Button> 
                    <Button onClick={setZoomout}>
                        <span className={"k-icon k-i-zoom-out"}></span>
                    </Button>
                    {/* <Checkbox onChange={(e) => (setShowUnderShootLine(e.value))} checked={showUnderShootLine}></Checkbox><Label>UnderShoot</Label>
                    <Checkbox onChange={(e) => (setShowOverShootLine(e.value))} checked={showOverShootLine}></Checkbox><Label>OverShoot</Label>  */}
                    <Checkbox onChange={(e) => (hundleFullDateTime(e.value))} checked={showFullDateTime}>תאריך מלא</Checkbox>
                </div>
                
                
               <div className='divRe' >
                    <LineChart width={props.width + 400} height={props.height} style={{cursor : getCursor()}}
                            data={areaZoom ? props.data.slice(areaZoom.indexFrom, areaZoom.indexTo) : props.data.slice()} 
                            onMouseDown={(e) => setArea(e.activeLabel) }
                            onMouseMove={(e) => onMoveArea(e.activeLabel, e.activeTooltipIndex)}
                            onMouseUp={(e) => onMouseUpFromArea(e.activeLabel, e.activeTooltipIndex) }
                            
                            >
                            <CartesianGrid strokeDasharray="3 3" points=''/>
                            <XAxis 
                              allowDataOverflow
                              dataKey="timeStampToDisplay"    
                              type='category'         
                            />
                            <YAxis
                               // allowDataOverflow
                                domain={['0', '500']}
                                type="number"
                                //yAxisId="1"
                            />
                            <Tooltip />
                               {/* <circle
                                key={"gggfd4"}
                                cx={227.6315789473684}
                                
                                cy={210.05578555890818}
                                r={10}
                               
                                fill={"#000000" }
                               
                            />   */}
                   {/* <svg
        x={290.6315789473684}
        y={210.05578555890818}
        width={20}
        height={20}
        fill="red"
        viewBox="0 0 1024 1024" 
      >*/}
        <polyline points="290.6315789473684,210.05578555890818" fill="none" stroke="#000" stroke-width="10" />

        {/* <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
     */} 
     {/* </svg>  */}

     {show ?  Menu() : ''}
                            <Legend onClick={(e) => shoeOrHideLineFromChart(e)}  />
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
                                                  //  onMouseDown={(e) => e.button === 2 ? console.log("right") : console.log("left")}
                                                    onContextMenu={(e) => openMenu(e) }
                                                   // onClick={(e) => console.log("hiii")}
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
                            {showOverShootLine ? <ReferenceLine y={81.79} label="OverShoot" stroke="green" /> : ''}
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
                                                    dot={customDot}/>)
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
                                    <div>   
                                        <Checkbox onChange={(e) => (setShowUnderShootLine(e.value))} checked={showUnderShootLine}></Checkbox><Label>UnderShoot</Label>
                                        <Checkbox onChange={(e) => (setShowOverShootLine(e.value))} checked={showOverShootLine}></Checkbox><Label>OverShoot</Label> 
                                     
                                        <div className='flexControls' key={"divRange2_" + index}>                                     
                                            <Checkbox key={"CheckSetLimit_" + index} onChange={(e) => (SetLimit(e.value, key))}></Checkbox>  &nbsp;    
                                            <Input key={"txtLabelText_" + index} value={labelText} onChange={(e) => SetLabelText(e.target.value, key)}/> &nbsp;
                                            <Button key={"btnRemoveRange_" + index} onClick={(e) => RemoveRange(key)}><span className="k-icon k-i-close"></span></Button>
                                            <Button key={"btnExpandChart_" + index} onClick={(e) => props.showRange({'indexFrom': sideLeftIndex, 'indexTo': sideRightIndex + 1})}><span className="k-icon k-i-full-screen"></span></Button>
                                        </div> 

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