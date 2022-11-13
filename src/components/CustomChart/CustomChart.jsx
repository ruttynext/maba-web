import {React,  useState, useEffect } from 'react'
import './CustomChart.css'
import {LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip,
        ReferenceArea, ReferenceLine, Legend } from "recharts";
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from "@progress/kendo-react-labels";
import { GetFormatTime, getTime } from '../../Utils';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";


const ragashimData = [
 
    { yAxisId: "1", dataKey:"T1", stroke: "#8884d8",hide: false},
    { yAxisId: "1", dataKey:"T2", stroke: "#82ca9d",hide: false}
];

//Customization for dots in the chart
const CustomNormalDot = ({ key, cx, cy, payload, stroke, fill, r}) => {

  return (
    <circle key={key} cx={cx} cy={cy} r={r} stroke={stroke} fill={fill} data-testid={payload.name} id={`dot_${payload.name}`}/>
  );
};

//Customization for minimum/maximum dots
const CustomDotMin = ({ key, cx, cy, payload, stroke, fill, r, text}) => {

  var cyPosition = cy - 22;   //Position of the shape that view the minimum/maximum dots

  return (
    <g>
        <line x1={cx}  y1={cyPosition + 10} x2={cx} y2={cyPosition + 20} style={{stroke: "rgba(0, 0, 0, 0.5)", strokeWidth: "2",}}/>
        <circle cx={cx} cy={cyPosition}  r={10} stroke="rgba(0, 0, 0, 0.5)" strokeWidth="1" fill="rgba(0, 0, 0, 0.5)"></circle>
    
        <text style={{font:"400 10px sans-serif", whiteSpace: "pre",}} x={cx-10} y={cyPosition + 3} 
              stroke="none" fill="#fff" fillOpacity="1">{text}</text>
        { 
         <CustomNormalDot key={key} cx={cx} cy={cy} payload={payload} stroke={stroke} fill={fill} r={r}/>    
        }
    </g>
  );
};


// Enum for the all special states in the chart
const stateChartEnum = {
    normal: 0,//רגיל
    zoomActive: 1,//מצב זום
    addArea: 2,//הוספת תת גבול צהוב
    openMenu: 3,//פתיחת תפריט
    moveLimitline: 4,//הוזזת קווי גבולות
    addText: 5, //הוספת טקסט
    addStabilizationTime: 6, //זמן התייצבות
  };

function CustomChart(props) {

    const [ragashim, setRagashim] = useState(ragashimData);
    const [activeLimitLine, setActiveLimitLine] = useState("");
    const [sideLineActive, setSideLineActive] = useState("");
    const [showFullDateTime, setShowFullDateTime] = useState(true);
    const [refAreaStart, setRefAreaStart] = useState("");
    const [refAreaEnd, setRefAreaEnd] = useState("");
    const [areaZoom , setAreaZoom] = useState(null);
    const [stateChart , setStateChart] = useState(stateChartEnum.normal);
    const [openDialogAddText, setOpenDialogAddText] = useState(false);
    const [textsInChart, setTextsInChart] = useState([]);
    const [stabilizationTimelines, setStabilizationTimelines] = useState([]);
    const [textToAdd, setTextToAdd] = useState("");
    const [stabilizationLineNoDrop, setStabilizationLineNoDrop] = useState(false);
    const [selectedLimitKey, setSelectedLimitKey] = useState("");
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [selectedItem, setSelectedItem] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    var currentStateChart = stateChartEnum.normal;

    useEffect(() => {
      document.addEventListener("click", handleClick); //On a left click event
      return () => {
        document.removeEventListener("click", handleClick);
      };
    });

    //In the screen click event
    const handleClick = ()=>{
      setShowMenu(false); //Closing the menu
    }

    //Opening a dropdown menu In the right-click event on objects in the chart
    const handleContextMenu = (event, key, typeSelected) => { 
      event.preventDefault();
      const selectedKey = parseInt(key);
      setSelectedItem({"typeSelected": typeSelected, "selectedKey": selectedKey});
      setShowMenu(true);  
    };
    
    // event of mouse leaves the chart
    const onMouseUpFromChart = (e) => {

      switch(stateChart) //chart status
      {
          case stateChartEnum.zoomActive: //In zoom mode
          case stateChartEnum.addArea: //In add area mode

              if(refAreaStart !== "" && refAreaEnd !== "" && refAreaStart !== refAreaEnd)
              { 
                let indexStartArea = props.data.findIndex(x => x.timeStampToDisplay === refAreaStart);
                let indexEndArea = props.data.findIndex(x => x.timeStampToDisplay === refAreaEnd);                  
                
                let indexLeft = indexStartArea < indexEndArea ? indexStartArea : indexEndArea;
                let indexRigh = indexStartArea > indexEndArea ? indexStartArea : indexEndArea;
                
                if(stateChart === stateChartEnum.addArea)
                {
                  let timeStampLeftSide = props.data[indexLeft].timeStamp;
                  let timeStampRightSide = props.data[indexRigh].timeStamp;
                  
                  //updates list of limits.
                  props.limits.push({'key': props.limits.length, 
                                     'timeStampLeft': timeStampLeftSide, 
                                     'leftIndex' : indexLeft, 
                                     'timeStampRight': timeStampRightSide, 
                                     'rightIndex' : indexRigh,
                                     'strokeWidthValue': 2, 
                                     'isArea': true});
              
                   props.updateLimits(props.limits.concat());
                }
                else //In zoom mode.
                {
                  setAreaZoom({'indexFrom': indexLeft, 'indexTo': indexRigh + 1});               
                }                
              }  
           
              setRefAreaStart(""); //reset start area.   
              setRefAreaEnd("");   //reset end area. 
            
              break;
          case stateChartEnum.moveLimitline: //In the state of moving the limit lines
              
             if(activeLimitLine !== "")
             {    
                    var activeLimit  = props.limits.find(item => (item.key ===  activeLimitLine)); //finds the active limit in list of limits.

                    //Finds the dots values are between the active limit lines.
                    var dataValues = (props.data.filter(o => (o.index >= (activeLimit.leftIndex + 1) && o.index <= (activeLimit.rightIndex + 1))));
                    
                    //Calculation of minimum and maximum dots between the limit lines
                    const maxObj = dataValues.reduce((prev, current)=> ((Math.max(prev.T1, prev.T2) >= Math.max(current.T1, current.T2)) ? prev : current), 0) 
                    const minObj = dataValues.reduce((prev, current)=> ((Math.min(prev.T1, prev.T2) <= Math.min(current.T1, current.T2)) ? prev : current), 0) 

                    //Updating the active limit with the minimum and maximum values
                    props.updateLimits(props.limits.map(range => (range.key === activeLimitLine ? 
                                      {...range, 'strokeWidthValue' : 2, 
                                                 'maxPoint': {'index' : maxObj.index, 'value': Math.max(maxObj.T1, maxObj.T2) },
                                                 'minPoint': {'index' : minObj.index, 'value': Math.min(minObj.T1, minObj.T2) }
                                      } : range)));
                    setSideLineActive("");               
              }

          break;
          default:
      }    
      setActiveLimitLine(""); //resets active limit line.
      setStateChart(stateChartEnum.normal); //resets the chart state. 
    }

    //event of removing limit
    const RemoveLimit = (key, stabilizationLineKey)=>
    {
      //removes the stabilization line of deleted limit
      setStabilizationTimelines(item =>
          stabilizationTimelines.filter(obj => {
              return obj.key !== stabilizationLineKey;
                }),);
      
       //removes the limit from the list of limits
      props.updateLimits(ranges =>
          props.limits.filter(obj => {
              return obj.key !== key;
            }),
          );
    }
    
    //show/hide line from chart
    const showOrHideLineFromChart = (e)=>
    {    
       const newState = ragashim.map(obj => {
          if (obj.dataKey === e.dataKey) {
              return {...obj, hide: !obj.hide};
          }
              return obj;
          });
      
          setRagashim(newState);
    }
    
    //Mouse click event on the limit Line.
    const clickOnLimit = ( key, side, isLimitLine)=>
    {
       if(isLimitLine)
       {
          currentStateChart = stateChartEnum.moveLimitline; // updates the chart state to moving limit line mode.
          setStateChart(stateChartEnum.moveLimitline);
          props.updateLimits(props.limits.map(range => (range.key === key ? {...range, 'strokeWidthValue' : 1} : range)));//Change the stroke width

          setSideLineActive(side); //updates the side of limit that selected.
       }
       else  // in add Stabilization Time mode.
       {
         currentStateChart = stateChartEnum.addStabilizationTimeline; // updates the chart state to adding Stabilization Time line mode.
         setStateChart(stateChartEnum.addStabilizationTimeline);        
       }
       
       setActiveLimitLine(key); //updates active limit to the line that selected.
    };
    
    //a mouse event moves on the chart
    const onMouseMoveOnChart = (e, activeLabel, activeIndex)=>
    {  

        switch(stateChart) //chart status
        {
          case stateChartEnum.addText: 
            //setAnchorPoint({ x: e.chartX, y: e.chartY });
  
            setTextsInChart(textsInChart.map(item => (item.key === selectedItem.selectedKey ? 
                                            {...item, 
                                              'anchorPointX' : e.chartX,
                                              'anchorPointY' : e.chartY} : item)));
             
            break;
          
          case stateChartEnum.zoomActive: //in zoom mode
          case stateChartEnum.addArea: //in add area mode
     
            if(refAreaStart !== "")
            {
               setRefAreaEnd(activeLabel);
            }
            break;

          case stateChartEnum.moveLimitline: //in moving limit line 
          case stateChartEnum.addStabilizationTimeline: //in adding Stabilization Timeline   
            
            if(activeLimitLine !== "")
            {
                const currentTimeStamp = props.data[activeIndex].timeStamp;
               
                if(stateChart === stateChartEnum.moveLimitline)//in moving limit line 
                {
                    props.updateLimits(props.limits.map(range => (range.key === activeLimitLine ?
                    {...range, 
                        'timeStampLeft' : sideLineActive === 'left' ? currentTimeStamp : range.timeStampLeft,
                        'leftIndex' : sideLineActive === 'left' ? activeIndex : range.leftIndex, 
                        'pointXLeft' : sideLineActive === 'left' ? e.chartX : range.pointXLeft,
                        'timeStampRight' : sideLineActive === 'right' ? currentTimeStamp : range.timeStampRight, 
                        'rightIndex' : sideLineActive === 'right' ? activeIndex : range.rightIndex,
                        'pointXRight' : sideLineActive === 'right' ? e.chartX : range.pointXRight, 
                    } : range)));
                }
                else  //in adding Stabilization Timeline.
                {
                     //finding the limit that the selected stabilization line is located.
                    var activeLimit  = props.limits.find(item => (item.StabilizationLineKey ===  activeLimitLine));
                    
                    if(activeLimit)
                    {  
                         //the stabilization line can be only between it's limits 
                      if(activeLimit.leftIndex < activeIndex && activeLimit.rightIndex > activeIndex)  
                      {
                        setStabilizationLineNoDrop(false);
                        setStabilizationTimelines(stabilizationTimelines.map(item => (item.key === activeLimitLine ? 
                                                 {...item,
                                                  'time': currentTimeStamp, 
                                                  'timeIndex' : activeIndex
                                                 } : item )));
                      }                              
                      else
                      {
                         setStabilizationLineNoDrop(true); 
                      }
                    }
                }
            }
          break;
          default:
        }  
    }

    const onMouseDownOnChart = (e , activeLabel) =>
    {  
        if(!showMenu)
        {
          setAnchorPoint({ x: e.chartX, y: e.chartY });
        }
           
        setRefAreaStart(activeLabel);

        if(stateChart === stateChartEnum.normal
           && currentStateChart !== stateChartEnum.moveLimitline
           && currentStateChart !== stateChartEnum.addStabilizationTimeline)
            {
               setStateChart(stateChartEnum.addArea); 
            }
             
    }

     //event of adding new limit
    const AddLimit = () => ////////////////////check pointXLeft and pointXRight
    {

           //Finds the dots values are between the active limit lines.
        var dataValues = props.data.filter(o => (o.index >= 1 && o.index <= 2 ));
          
        //Calculation of minimum and maximum dots between the limit lines           
        const maxObj = dataValues.reduce((prev, current)=> ( (Math.max(prev.T1, prev.T2) >= Math.max(current.T1, current.T2)) ? prev : current),0) //returns object
        const minObj = dataValues.reduce((prev, current)=> ( (Math.min(prev.T1, prev.T2) <= Math.min(current.T1, current.T2)) ? prev : current),0) //returns object
 
        var firstTime = props.data[0].timeStamp;
        var secTime = props.data[1].timeStamp;
     
        props.limits.push({'key': props.limits.length, 
                            'timeStampLeft': firstTime,
                            'leftIndex' : 0, 'timeStampRight': secTime, 
                            'rightIndex' : 1, 'pointXLeft' :65, 
                            'pointXRight': 119.21052631578948, 'strokeWidthValue': 2,
                            'isArea': false, 'viewOverShoot' :false, 
                            'viewUnderShoot': false, 
                            'maxPoint': {'index' : maxObj.index, 'value': Math.max(maxObj.T1, maxObj.T2) },
                            'minPoint': {'index' : minObj.index, 'value': Math.min(minObj.T1, minObj.T2) },
                            'StabilizationLineKey' : null});
          
        props.updateLimits(props.limits.concat());  
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

    //show full/partial dateTime.
    const hundleFullDateTime = (val) =>{

        setShowFullDateTime(val);
        props.updateData(props.data.map(item => ({...item, 'timeStampToDisplay':  GetFormatTime(item.timeStamp, val)} )));

    };

    //Returns time duration in days/hours/minutes format between 2 dates.
    const getDurationLimit = (startTime, endTime) =>
    {
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
    const customDot = ({ key, cx, cy, payload, value, stroke, fill, r}) => 
    {
 
        // if(props.limits.length === 0)
        // return
        // (
        //   <CustomNormalDot key={key} cx={cx} cy={cy} payload={payload} stroke={stroke} fill={fill} r={r}/>     
        // );

        var text = "";
      
        //Finds the limit that the current dot is on
        var limitFound  = props.limits.find(o => (o.pointXLeft <= cx &&  o.pointXRight >= cx ));

        if(limitFound)
        {
           //when the current dot is maximum value in the limit
           if(payload.index === limitFound.maxPoint.index && value === limitFound.maxPoint.value)
              text = "Max";
            
              //when the current dot is minimum value in the limit
           else if(payload.index === limitFound.minPoint.index && value === limitFound.minPoint.value)
              text = "Min"; 
        }
    
        return(
          text !== "" ? 
            <CustomDotMin key={key} cx={cx} cy={cy} payload={payload} stroke={stroke} fill={fill} r={r} text={text}/> :
            <CustomNormalDot key={key} cx={cx} cy={cy} payload={payload} stroke={stroke} fill={fill} r={r}/>     

        )
    };

    //Returns the mouse cursor icon when moving over the chart by the chart mode.
    const getCursor = () =>
    {
        switch(stateChart) 
        {
            case stateChartEnum.addArea:
              return "grab";
            case stateChartEnum.zoomActive:
              return "zoom-in";
            case stateChartEnum.addStabilizationTimeline:
              if(stabilizationLineNoDrop)
                  return "no-drop";
              return "col-resize";
            case stateChartEnum.addText:
              return "move"
            default:
              return "";
        }  
    };
    
    //In the event of deleting item in chart
    const deleteItem = (e) => {

        switch(selectedItem.typeSelected) 
        {
            case "limit":
                props.updateLimits(ranges =>
                    props.limits.filter(obj => {
                      return obj.key !== selectedItem.selectedKey;
              }),
              );
            break;

            case "text":
              setTextsInChart(item =>
                textsInChart.filter(obj => {
                    return obj.key !== selectedItem.selectedKey;
              }),);
            break;
            
            case "stabilizationTime":
                setStabilizationTimelines(item =>
                  stabilizationTimelines.filter(obj => {
                      return obj.key !== selectedItem.selectedKey;
                }),);
              
                props.updateLimits(props.limits.map(range => (range.StabilizationLineKey === selectedItem.selectedKey ? {...range, 
                  'StabilizationLineKey' : null
                  } : range)));
              
            break;
            default:
        } 
        
        setSelectedItem({});//resets the selected item
        setShowMenu(false); //close menu

    };

    //on clicking on the item move button.
    const moveItem = () => 
    {
      
        switch(selectedItem.typeSelected) 
        {
            case "limit":
              break;
            case "text":
              setStateChart(stateChartEnum.addText);
              break;
            case "stabilizationTime":
              setStateChart(stateChartEnum.addStabilizationTimeline);
              break;
            default:
        } 
         
    };
    
    //Building dropdown menu with a buttons to delete and move items. 
    const getMenu = () =>
    {

        return(  
        <g>
            {/*Button to delete item */}
            <rect r="10" x={anchorPoint.x} y={anchorPoint.y}    
              width="20" height="20" onClick={deleteItem} style={{fill:"white", stroke:"black", }} /> 
            
            <svg onClick={deleteItem} width="20" height="20" fill="currentColor" className="bi bi-trash" 
                viewBox="0 0 16 16" x={anchorPoint.x} y={anchorPoint.y} >                  
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
             </svg>

            {/*Button to move an item */}
            <rect r="10" x={anchorPoint.x + 20} y={anchorPoint.y} width="20" height="20" onClick={moveItem}
              style={{fill:"white", stroke:"black", }} /> 
            
            <svg onClick={moveItem} width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 256 256" 
                x={anchorPoint.x + 20} y={anchorPoint.y} >
                <path d="M168,112V100a20,20,0,0,0-40,0V36a20,20,0,0,0-40,0V157.3l-21.9-38a20,20,0,0,0-34.7,20C64,208,83.8,232,128,232a80,80,0,0,0,80-80V112a20,20,0,0,0-40,0Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>            
                  </svg>
        </g>)  
    };
    
    //* show/hide dialoug that add text to chart
    const showOrHideDialogAddText = () =>
    {
        setOpenDialogAddText(!openDialogAddText);
    };

    //on submit event of dialog for adding text to chart.
    const AddTextToChart = () =>
    {
        setStateChart(stateChartEnum.addText);
        setSelectedItem({"typeSelected": "text", "selectedKey": textsInChart.length});
        textsInChart.push({'key': textsInChart.length, 'text': textToAdd, 'anchorPointX' : 0, 'anchorPointY': 0});
        setTextsInChart(textsInChart.concat());
    
        setTextToAdd("");
        showOrHideDialogAddText();
    };
    
    //Adding a new stabilization line to limit
    const AddNewStabilizationTime = (limitKey) =>{
   
        var limit  = props.limits.find(item => (item.key ===  limitKey));
        if(limit.StabilizationLineKey !== null) //Checks if there is already a stabilization line for current limit
           return;
  
        setSelectedLimitKey(limitKey);
        setStateChart(stateChartEnum.addStabilizationTimeline);
      
        var key = stabilizationTimelines.length;
        stabilizationTimelines.push({'key': key, 'timeIndex' : null});
        setStabilizationTimelines(stabilizationTimelines.concat());
        setActiveLimitLine(key); 
       
        //updates the limit with the new stabilization line.
        props.updateLimits(props.limits.map(range => (range.key === limitKey ? 
                          {...range, 
                           'StabilizationLineKey' : key
                          } : range)));
         
    }
    //creates under/over shoot to limit
    const getOverAndUnderShoot = (viewUnderShoot, viewOverShoot, pointX1, pointX2) =>
    {
        const overShootValue = 81.79;
        const underShootValue = 41.79;

        var heightChart = props.height - 60;
        var unitsInChart = props.maxValue;
        var unitsVale = heightChart / unitsInChart;
        var resoultOverShoot = (unitsVale * (unitsInChart - overShootValue)) + 7;
        var resoultUnderShoot = (unitsVale * (unitsInChart - underShootValue)) + 7;
        var positionText = (pointX1 + pointX2) /2;
      
        return(
          <>
            {
              viewOverShoot ? 
                <g className="recharts-layer recharts-reference-line">
                  <line y={50} x1={pointX1} x2={pointX2} stroke="green" fill="none" fillOpacity="1" strokeWidth="1" y1={resoultOverShoot} y2={resoultOverShoot}
                        className="recharts-reference-line-line"></line>
                  <text offset="5" x={positionText} y={resoultOverShoot} className="recharts-text recharts-label" text-anchor="middle">
                          <tspan x={positionText} dy="0.355em">OverShoot</tspan>
                  </text>
                </g> : ''
            }
            {
              viewUnderShoot ? 
                <g className="recharts-layer recharts-reference-line">
                  <line y={50} x1={pointX1+2} x2={pointX2+2} stroke="green" fill="none" fillOpacity="1" strokeWidth="1" y1={resoultUnderShoot} y2={resoultUnderShoot}
                      className="recharts-reference-line-line"></line>
                  <text offset="5" x={positionText} y={resoultUnderShoot} className="recharts-text recharts-label" text-anchor="middle">
                      <tspan x={positionText} dy="0.355em">UnderShoot</tspan>
                  </text>
                </g>: ''
            }
          </>
        )
      
    };
    

    const SetOverAndUnderShoot = (key, type, value)=>
    {
        switch(type)  
        {
          case "viewOverShoot":
            props.updateLimits(props.limits.map(range => (range.key === key ? {...range, 
                              'viewOverShoot' : value,} : range)));
            break;
          case "viewUnderShoot":
            props.updateLimits(props.limits.map(range => (range.key === key ? {...range, 
                              'viewUnderShoot' : value,} : range)));
            break;
          default:
        }
    };

    return (
        <div className='c-reference-line'>     
            <div className="highlight-bar-charts" style={{ userSelect: "none", width: "80%", }}>
                <br/>
                <div className='flex-container'>
                    <Button onClick={setZoomIn} style={{background : stateChart === stateChartEnum.zoomActive ? "#a5a5a5" : "",}}>
                        <span className={"k-icon k-i-zoom-in"}></span>
                    </Button> &nbsp;
                    <Button onClick={setZoomout}>
                        <span className={"k-icon k-i-zoom-out"}></span>
                    </Button> &nbsp; &nbsp;
                    <Button onClick={showOrHideDialogAddText} style={{background : stateChart === stateChartEnum.addText ? "#a5a5a5" : "",}}>
                           <span className="k-icon k-i-edit-tools"></span>
                    </Button>  &nbsp;  &nbsp;
 
                    <Checkbox label={"הצג תאריך מלא"} onChange={(e) => (hundleFullDateTime(e.value))} checked={showFullDateTime}></Checkbox>    
                </div>
                
                
               <div className='divLinechart' >
                    <LineChart width={props.width + 400} height={props.height} style={{cursor : getCursor()}}
                            data={areaZoom ? props.data.slice(areaZoom.indexFrom, areaZoom.indexTo) : props.data.slice()} 
                            onMouseDown={(e) => onMouseDownOnChart(e, e.activeLabel) }
                            onMouseMove={(e) => onMouseMoveOnChart(e, e.activeLabel, e.activeTooltipIndex)}
                            onMouseUp={(e) => onMouseUpFromChart(e)}>
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
                            <Legend onClick={(e) => showOrHideLineFromChart(e)}  />
                            {
                                props.limits.map(({key, timeStampLeft, timeStampRight, strokeWidthValue, isArea, pointXLeft, pointXRight, 
                                                  viewUnderShoot, viewOverShoot }, index) => 
                                {
                                    return(
                                      isArea ?
                                        <>
                                            <ReferenceArea
                                                // label={{ value: "", fill: 'black', position: 'insideTop'}}
                                                    fill="white"                             
                                                    x1={GetFormatTime(timeStampLeft, showFullDateTime)}
                                                    x2={GetFormatTime(timeStampRight, showFullDateTime)}
                                                    stroke="yellow"
                                                    onContextMenu={(e) => handleContextMenu(e, key, "limit") }
                                                    strokeWidth = "5"/>
                                        </> : 
                                        <>
                                            <ReferenceLine key={key + "1"} name={key} x= {GetFormatTime(timeStampLeft, showFullDateTime)} stroke="blue" 
                                                           strokeWidth={strokeWidthValue} onMouseDown = {(e) => {clickOnLimit(key, 'left', true)} }/>
                                            <ReferenceLine key={key + "2"} name={key} x= {GetFormatTime(timeStampRight, showFullDateTime)} stroke="red"  
                                                           strokeWidth={strokeWidthValue} onMouseDown = {(e) => {clickOnLimit(key, 'right', true)} }/>
                                                
                                            {  //show under/Over shoot
                                              getOverAndUnderShoot(viewUnderShoot, viewOverShoot, pointXLeft, pointXRight)
                                            }
                                             
                                        </>)
                                })
                           }
                           { // display to highlighted area in the chart
                              refAreaStart && refAreaEnd ? 
                              (
                                  <ReferenceArea
                                      x1={refAreaStart}
                                      x2={refAreaEnd}
                                      strokeOpacity={0.3}
                                  />
                              ) : null
                           }
                           {
                              //view line of all ragashim
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
                           {
                               //view stabilization Timelines    
                              stabilizationTimelines.map(({ key, time, timeIndex}, index) => 
                              {
                                     
                                  return( timeIndex !== null ?
                                         <ReferenceLine key={"time_" + key} name={key} x= {GetFormatTime(time, showFullDateTime)} stroke="orange"
                                          onContextMenu={(e) => handleContextMenu(e, key, "stabilizationTime")} strokeWidth="2"
                                          onMouseDown = {(e) => {clickOnLimit(key, '', false)} }/> : '')
                              })
                                  
                           }
                           {
                             //view the menu that open in chart.
                             showMenu ? getMenu() : ''
                           }
                           {   
                              //view the all texts in chart                           
                              textsInChart.map(({ key, text, anchorPointX, anchorPointY }, index) =>
                              {
                                return(
                                  <g>
                                    <text x={anchorPointX} y={anchorPointY} fill="red" 
                                    onContextMenu={(e) => handleContextMenu(e, key, "text")}>{text}</text>
                                  </g>
                                )

                              })
                           }
                    </LineChart>
                    {
                      //view dialoug that add text to chart
                      openDialogAddText && (
                            <Dialog title={"הוסף טקסט"} onClose={showOrHideDialogAddText}>
                              <Input value={textToAdd} onChange={(e) => setTextToAdd(e.value)}></Input>
                              <DialogActionsBar>
                                <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={showOrHideDialogAddText}>ביטול</button>
                                <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={AddTextToChart}>אישור</button>
                              </DialogActionsBar>
                            </Dialog>
                          )
                    }
               </div>
                
            </div>{/* div end chart */}
           
            <div style={{ width: "20%", height:"100%" }}>
                <Button onClick={AddLimit} icon="plus">הוסף גבול</Button>   
                {
                     props.limits.length > 0 ?
                     <div className='divDinamicLimits'>
                     {
                         props.limits.map(({key, timeStampLeft, leftIndex, timeStampRight, rightIndex,  isArea, viewUnderShoot, 
                                            viewOverShoot, StabilizationLineKey }, index) => 
                            {
                             return isArea ? '' : <div className='divControlsRange' key={"divRange_" + index}>
                                                           {/* shows the start time and end time of the limit */}
                                     { GetFormatTime(timeStampRight, showFullDateTime) } - { GetFormatTime(timeStampLeft, showFullDateTime) } <br/>
                                    
                                     {//shows the time duration of the limit
                                       getDurationLimit(timeStampRight, timeStampLeft)  
                                     }
                                    <div style={{marginRight: "15px"}}>   
                                        <Checkbox label={"UnderShoot"} onChange={(e) => (SetOverAndUnderShoot(key, "viewUnderShoot", e.value))}
                                                  checked={viewUnderShoot}></Checkbox>&nbsp;
                                        <Checkbox label={"OverShoot"} onChange={(e) => (SetOverAndUnderShoot(key, "viewOverShoot", e.value))} 
                                                  checked={viewOverShoot}></Checkbox>
                                        <div className='flex-container' key={"divRange2_" + index}>                                     
                                            <Button key={"btnRemoveLimit_" + index} onClick={(e) => RemoveLimit(key, StabilizationLineKey)}>
                                                 <span className="k-icon k-i-delete"></span>
                                            </Button>&nbsp;
                                            <Button key={"btnExpandChart_" + index} onClick={(e) => props.showRange({'indexFrom': leftIndex, 'indexTo': rightIndex + 1})}>
                                                   <span className="k-icon k-i-full-screen"></span>
                                            </Button>&nbsp;
                                            <Button onClick={(e) => AddNewStabilizationTime(key)} 
                                                style={{background : (stateChart === stateChartEnum.addStabilizationTimeline && selectedLimitKey === key) ? "#a5a5a5" : "",}}>קו התייצבות 
                                            </Button>
                                        </div> 
                                      <Label>------------------------------</Label>

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


export default CustomChart;