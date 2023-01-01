import {React,  useState, useEffect, useRef } from 'react'
import './CustomChart.css'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Text,
        ReferenceArea, ReferenceLine, Legend, ResponsiveContainer } from "recharts";
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from "@progress/kendo-react-labels";
import { GetFormatTime, getTime } from '../../Utils';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { ComboBox } from '@progress/kendo-react-dropdowns';
import moment from 'moment'


const ragashimData = [
 
    { yAxisId: "0", dataKey:"T1", stroke: "#8884d8",hide: false},
    { yAxisId: "1", dataKey:"T2", stroke: "#82ca9d",hide: false},
    { yAxisId: "2", dataKey:"T3", stroke: "#ca82af",hide: false}
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

  const MARGIN_LEFT = 67;
  const MARGIN_TOP = 5;
  const MARGIN_RIGHT = 5;
  const MARGIN_BOTTOM = 56;

function CustomChart(props) {

    const [ragashim, setRagashim] = useState(ragashimData);
    const [activeLimitLine, setActiveLimitLine] = useState("");
    const [sideLineActive, setSideLineActive] = useState("");
    const [showFullDateTime, setShowFullDateTime] = useState(true);
    const [showPrecisionLines, setShowPrecisionLines] = useState(false);
    const [refAreaStart, setRefAreaStart] = useState("");
    const [refAreaZoom, setRefAreaZoom] = useState("");
    const [refAreaEnd, setRefAreaEnd] = useState("");
    const [areaZoom , setAreaZoom] = useState(null);
    const [stateChart , setStateChart] = useState(stateChartEnum.normal);
    const [openDialogAddText, setOpenDialogAddText] = useState(false);
    const [textsInChart, setTextsInChart] = useState([]);
    const [textToAdd, setTextToAdd] = useState("");
    const [stabilizationLineNoDrop, setStabilizationLineNoDrop] = useState(false);
    const [selectedLimitKey, setSelectedLimitKey] = useState("");
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [selectedItem, setSelectedItem] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [displayTime, setDisplayTime] = useState("אמיתי");
    const [bottom, setBottom] = useState('dataMin');
    const [top, setTop] = useState('dataMax+1');
    const [left, setLeft] = useState('dataMin');
    const [right, setRight] = useState('dataMax+1');
    var currentStateChart = stateChartEnum.normal;
    
    const lineChart = useRef();
    const divChart = useRef();

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
            
          setAreaZoom({'x1': getValueByChartX(refAreaZoom.x1),'x2': getValueByChartX(refAreaZoom.x2),
                       'y1': Math.round(getValueByChartY(refAreaZoom.y1)), 'y2': Math.round(getValueByChartY(refAreaZoom.y2))}); 
          
          setRefAreaZoom("");

          break;
          case stateChartEnum.addArea: //In add area mode

              if(refAreaStart !== "" && refAreaEnd !== "" && refAreaStart !== refAreaEnd)
              { 
                
                var leftSideArea = refAreaStart.activeTooltipIndex < refAreaEnd.activeTooltipIndex ? refAreaStart : refAreaEnd;
                var rightSideArea = refAreaStart.activeTooltipIndex > refAreaEnd.activeTooltipIndex ? refAreaStart : refAreaEnd;
                
                if(stateChart === stateChartEnum.addArea)
                {
                  addNewLimit(leftSideArea.activeTooltipIndex, rightSideArea.activeTooltipIndex);
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
                  var leftIndex = Math.min(activeLimit.leftSide.activeTooltipIndex, activeLimit.rightSide.activeTooltipIndex);
                  var rightIndex = Math.max(activeLimit.leftSide.activeTooltipIndex, activeLimit.rightSide.activeTooltipIndex);
                  var dataValues2 = props.data.slice( leftIndex, rightIndex +1);  
                  
          
                  //Calculation of minimum and maximum dots between the limit lines
                  const maxObj = dataValues2.reduce((prev, current)=>  (prev.maxValue > current.maxValue) ? prev : current);
                  const minObj = dataValues2.reduce((prev, current)=>  (prev.minValue < current.minValue) ? prev : current);
                   
                  /**Updating the active limit with the minimum and maximum values, and the stabilization line that belonged to it*/
                  props.updateLimits(props.limits.map(range => (range.key === activeLimitLine ? 
                                    {...range, 'strokeWidthValue' : 2, 
                                               'maxPoint': {'timeStamp' : maxObj.timeStamp, 'value': maxObj.maxValue },
                                               'minPoint': {'timeStamp' : minObj.timeStamp, 'value': minObj.minValue },
                                               'leftSide': range.rightSide.activeTooltipIndex < range.leftSide.activeTooltipIndex ? range.rightSide : range.leftSide,
                                               'rightSide': range.leftSide.activeTooltipIndex > range.rightSide.activeTooltipIndex ? range.leftSide : range.rightSide,
                                                /**In case the limit time is less than the stabilization time line, then the stabilization line will be deleted */
                                               'stabilizationLine' : range.stabilizationLine !== null && e.activeLabel <= range.stabilizationLine.activeLabel ? null : range.stabilizationLine, 
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
    const RemoveLimit = (key)=>
    {
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
        
            let y_value =  getValueByChartY(e.chartY);
            let x_value =  getValueByChartX(e.chartX);
           

            setTextsInChart(textsInChart.map(item => (item.key === selectedItem.selectedKey ? 
                                            {...item, 
                                              'yValue': y_value,
                                              'xValue': x_value,
                                            } : item)));
             
            break;
          
          case stateChartEnum.zoomActive: //in zoom mode
           
              if(refAreaZoom !== "")
                {
                  var y1 = refAreaZoom.y1;
                  var y2 = e.chartY;
                  
                  if(e.chartY <= refAreaZoom.y1)
                  {
                    y1 = e.chartY;
                    y2 = refAreaZoom.y2;
                  }

                  var x1 = refAreaZoom.x1;
                  var x2 = e.chartX;
                  
                  if(e.chartX <= refAreaZoom.x1)
                  {
                     x1 = e.chartX;
                     x2 = refAreaZoom.x2;
                  }
                    setRefAreaZoom({x1: x1, y1: y1, x2: x2, y2: y2 });            
                }

          break;
          case stateChartEnum.addArea: //in add area mode
     
            if(refAreaStart !== "")
            {
               setRefAreaEnd({'activeTooltipIndex': e.activeTooltipIndex, 'activeLabel': e.activeLabel}); 
            }
            break;

          case stateChartEnum.moveLimitline: //in moving limit line 
 
            if(activeLimitLine !== "") 
            {
                const activePosition = {'activeTooltipIndex': e.activeTooltipIndex, 'activeLabel': e.activeLabel};
                props.updateLimits(props.limits.map(range => (range.key === activeLimitLine ?
                {
                      ...range, 
                    'leftSide' : sideLineActive === 'left' ? activePosition : range.leftSide,
                    'rightSide' : sideLineActive === 'right' ? activePosition : range.rightSide,     
                } : range)));
            }
          break;
          case stateChartEnum.addStabilizationTimeline: //in adding Stabilization Timeline   
           
          if(activeLimitLine !== "")
            {
                     //finding the limit that the selected stabilization line is located.
                    var activeLimit  = props.limits.find(item => (item.key ===  activeLimitLine));
                    
                    if(activeLimit)
                    {  
                         //the stabilization line can be only between it's limits 
                      if(activeLimit.leftSide.activeTooltipIndex > e.activeTooltipIndex )  
                      {
                          setStabilizationLineNoDrop(false);

                          props.updateLimits(props.limits.map(range => (range.key === activeLimitLine ? 
                                          {...range, 
                                           'stabilizationLine' : {'activeTooltipIndex': e.activeTooltipIndex, 'activeLabel': e.activeLabel},
                                          } : range)));                         
                      }                              
                      else
                      {
                         setStabilizationLineNoDrop(true); 
                      }
                    }
                
            }
          break;
          default:
        }  
    }

    const onMouseDownOnChart = (e) =>
    {  
  console.log("onMouseDownOnChart");
  console.log(e.chartX);
         if(!showMenu)
         {
         
           setAnchorPoint({ x: e.chartX, y: e.chartY });
         }
         
         if(stateChart === stateChartEnum.zoomActive)
         {
           setRefAreaZoom({x1: e.chartX, y1: e.chartY, x2: e.chartX, y2: e.chartY});
         }

         setRefAreaStart({'activeTooltipIndex': e.activeTooltipIndex, 'activeLabel': e.activeLabel});

         if(stateChart === stateChartEnum.normal
            && currentStateChart !== stateChartEnum.moveLimitline
            && currentStateChart !== stateChartEnum.addStabilizationTimeline)
             {
                setStateChart(stateChartEnum.addArea); 
             }
             
    }

    //event of adding new limit
     const addNewLimit = (indexFrom, indexTo) =>
     {

         //Finds the dots values are between the active limit lines.
         var dataValues = props.data.slice(indexFrom, indexTo + 1);
       
         //Calculation of minimum and maximum dots between the limit lines           
         const maxObj = dataValues.reduce((prev, current)=>  (prev.maxValue > current.maxValue) ? prev : current);
         const minObj = dataValues.reduce((prev, current)=>  (prev.minValue < current.minValue) ? prev : current);
     
         props.limits.push({'key': props.limits.length, 
                            'leftSide': {'activeTooltipIndex': indexFrom, 'activeLabel': dataValues[0].timeStamp},
                            'rightSide': {'activeTooltipIndex': indexTo, 'activeLabel': dataValues[dataValues.length - 1].timeStamp}, 
                            'strokeWidthValue': 2, 
                            'color': Math.random().toString(16).substr(-6),
                            'maxPoint': {'timeStamp' : maxObj.timeStamp, 'value': maxObj.maxValue },
                            'minPoint': {'timeStamp' : minObj.timeStamp, 'value': minObj.minValue },
                            'stabilizationLine' : null,
                            'includeInResults': false,
                            'name': ""});
          
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

  

    //Returns time duration in days/hours/minutes format between 2 dates.
    const getStabilizationTime = (endTime, stabilizationLine) =>
    {
        return "זמן התיצבות:" + moment(endTime - stabilizationLine).format('mm:ss');
    };
    
    //Creating custom chart points based on the point value
    const customDot = ({ key, cx, cy, payload, value, stroke, fill, r}) => 
    {
        var text = "";
    
        //Finds the limit that the current dot is on
        var limitFound  = props.limits.find(o => (o.leftSide.activeTooltipIndex <= payload.index -1 && o.rightSide.activeTooltipIndex >=  payload.index - 1));
        
        if(limitFound)
        { 
           //when the current dot is maximum value in the limit
           if(payload.timeStamp === limitFound.maxPoint.timeStamp && value === limitFound.maxPoint.value)
              text = "Max";
            
              //when the current dot is minimum value in the limit
           else if(payload.timeStamp === limitFound.minPoint.timeStamp && value === limitFound.minPoint.value)
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
            case stateChartEnum.moveLimitline:
              return "col-resize";
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

                props.updateLimits(props.limits.map(range => (range.key === selectedItem.selectedKey ? {...range, 
                  'stabilizationLine' : null
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
        textsInChart.push({'key': textsInChart.length, 'text': textToAdd, yValue: bottom, 'xValue':left});
        setTextsInChart(textsInChart.concat());
    
        setTextToAdd("");
        showOrHideDialogAddText();
    };
    
    //Adding a new stabilization line to limit
    const AddNewStabilizationTime = (limitKey) =>{
   
        var limit = props.limits.find(item => (item.key ===  limitKey));
        if(limit.stabilizationLine !== null) //Checks if there is already a stabilization line for current limit
           return;
  
        setSelectedLimitKey(limitKey);
        setStateChart(stateChartEnum.addStabilizationTimeline);
        setActiveLimitLine(limit.key); 
       
        //updates the limit with the new stabilization line.
        props.updateLimits(props.limits.map(range => (range.key === limitKey ? 
                          {...range, 
                            'stabilizationLine' : {'activeTooltipIndex': null, 'activeLabel': null},
                          } : range)));
         
    }
    
    const getFormatterTime =(tick)=>{
      if(displayTime === "אמיתי")
         return moment(tick).format("D/MM/yyyy HH:mm") 

      return moment(tick - props.data[0].timeStamp).format('mm:ss'); 
        
    }

    const getAxisXDomain = (values)=> {
     
     if(areaZoom)
     {
      setLeft(areaZoom.x1);
      setRight(areaZoom.x2);

      return [areaZoom.x1, areaZoom.x2];
     }
      setLeft(values[0]);
      setRight(values[1]);
      
      return [values[0], values[1]];
    }

    const getAxisYDomain = (values) => {
      
      if(areaZoom)
      {
        setTop(areaZoom.y1);
        setBottom(areaZoom.y2);
 
       return [areaZoom.y2, areaZoom.y1];
      }

      setTop(values[1] + 15);
      setBottom(values[0]);
     
      return [values[0], values[1] + 15];
    }
 

     const getPositionY =(val) =>{
  
      const y_range = top-bottom;
      let res = (((top-val) / y_range)*(lineChart.current.props.height - MARGIN_TOP - MARGIN_BOTTOM)) + MARGIN_TOP


           return res;
     }

     const getPositionX =(val) =>{
 
      const x_range = right - left;
      let res  = ((val* ((lineChart.current.props.width) - MARGIN_LEFT - MARGIN_RIGHT)) + (MARGIN_LEFT * x_range) - (left *  ((lineChart.current.props.width) - MARGIN_LEFT - MARGIN_RIGHT)))/x_range
     
      return res;
    };
    
    const getValueByChartY = (chartY) =>{

      const y_p = (chartY - MARGIN_TOP) / (lineChart.current.props.height - MARGIN_TOP - MARGIN_BOTTOM);
      return top - (y_p * (top - bottom));

    }

    const getValueByChartX = (chartX) =>{

      const xP = (chartX - MARGIN_LEFT) / ((lineChart.current.props.width) - MARGIN_LEFT - MARGIN_RIGHT);
      const x_range = right - left;
      return left + (xP * x_range);
      
    }

    const setIncludeInResults = (key, value) =>{

      props.updateLimits(props.limits.map(range => (range.key === key ? 
        {...range, 
        'includeInResults': value,
        } : range)));

    }
    
    const setLimitName = (key, value) =>{
      
      props.updateLimits(props.limits.map(range => (range.key === key ? 
        {...range, 
        'name': value,
        } : range)));
    }
 
    return (
            <div className="highlight-bar-charts" style={{ userSelect: "none",  }} ref={divChart}>
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
 
                    <Checkbox label={"הצג תאריך מלא"} onChange={(e) => setShowFullDateTime(e.value)} checked={showFullDateTime}></Checkbox>  &nbsp;
                    <Checkbox label={"הצג קווי דרגת דיוק"}  checked={showPrecisionLines} onChange={(e) => setShowPrecisionLines(e.value)}></Checkbox> &nbsp;&nbsp;
                    <ComboBox value={displayTime} data={["אמיתי", "יחסי"]} onChange={(e) => setDisplayTime(e.value)} style={{width: "120px"}}></ComboBox>

                </div>
                <div className='divLinechart'>
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart  style={{cursor : getCursor(),}} ref={lineChart}
                            data={props.data} 
                            onMouseDown={(e) => onMouseDownOnChart(e) }
                            onMouseMove={(e) => onMouseMoveOnChart(e, e.activeLabel, e.activeTooltipIndex)}
                            onMouseUp={(e) => onMouseUpFromChart(e)}>
                            <CartesianGrid strokeDasharray="3 3" points=''/>
                            <XAxis 
                              allowDataOverflow={true}       
                              dataKey="timeStamp"   
                              tickFormatter={getFormatterTime}
                              type = 'number' 
                              domain={getAxisXDomain} />
                            <YAxis
                               allowDataOverflow={true}
                               domain={getAxisYDomain} 
                               type="number"/>
                            <Tooltip labelFormatter={v => moment(v).format('HH:mm')} />
                            <Legend onClick={(e) => showOrHideLineFromChart(e)}  />  
                            {
                                 props.limits.map(({key, leftSide, rightSide, strokeWidthValue, color, stabilizationLine}, index) => 
                                 {
                                     return( 
                                        <>
                                             <ReferenceLine key={key + "1"} name={key} x= {leftSide.activeLabel} stroke={ color === null ? "red" : "#" + color} style={{cursor : "col-resize"}}
                                                            strokeWidth={strokeWidthValue} onMouseDown = {(e) => {clickOnLimit(key, 'left', true)} }/>
                                             <ReferenceLine key={key + "2"} name={key} x= {rightSide.activeLabel} stroke={ color === null ? "yellow" : "#" + color} style={{cursor : "col-resize"}}  
                                                            strokeWidth={strokeWidthValue} onMouseDown = {(e) => {clickOnLimit(key, 'right', true)} }/> 
                                             { //view stabilization Timelines
                                              stabilizationLine !== null &&
                                               <ReferenceLine key={"time_" + key} x= {stabilizationLine.activeLabel} stroke="blue" style={{cursor : "col-resize"}}
                                                onContextMenu={(e) => handleContextMenu(e, key, "stabilizationTime")} strokeWidth="2"
                                                onMouseDown = {(e) => {clickOnLimit(key, '', false)} }/>  
                                             }
                                              )                                      
                                        </>)
                                 })
                           }
                           
                    {
                      refAreaZoom && refAreaZoom.x2 !== 0 ? 
                      <rect width={Math.abs(refAreaZoom.x2 - refAreaZoom.x1)} height={Math.abs(refAreaZoom.y2 - refAreaZoom.y1)} 
                        style={{ fill: "#ccc", fillOpacity: "0.5", stroke: "none", strokeWidth: "1", }} y={refAreaZoom.y1} x={refAreaZoom.x1} /> : ""
                    }                 
                       
                           { // display to highlighted area in the chart
                              refAreaStart && refAreaEnd ? 
                              (
                                  <ReferenceArea
                                      x1={refAreaStart.activeLabel}
                                      x2={refAreaEnd.activeLabel}
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
                             //view the menu that open in chart.
                             showMenu ? getMenu() : ''
                           }
                          
                           { 
 
                              //view the all texts in chart                           
                               textsInChart.map(({ key, text, yValue, xValue }, index) =>
                               {
                                  return(
                                   <g>
                                    <Text x={getPositionX(xValue)} y={getPositionY(yValue)} fill="red" 
                                      onContextMenu={(e) => handleContextMenu(e, key, "text")}>{text}</Text>
                                   </g>
                                      
                                   
                                 );

                               })
                           }
                           {
                            showPrecisionLines ? 
                            <>
                                 <line name="0" x="1546383720000" stroke="green" stroke-width="0.5"
                                  fill="none" fill-opacity="1" x1={getPositionX(left)} y1={getPositionY(52)} x2={getPositionX(right)} y2={getPositionY(52)}></line>
                                 <line name="0" x="1546383720000" stroke="green" stroke-width="0.5"
                                  fill="none" fill-opacity="1" x1={getPositionX(left)} y1={getPositionY(120)} x2={getPositionX(right)} y2={getPositionY(120)}></line>
                            </>:""
                           }
                    </LineChart> 
                  </ResponsiveContainer> 
                  </div>      
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

    )
}


export default CustomChart;