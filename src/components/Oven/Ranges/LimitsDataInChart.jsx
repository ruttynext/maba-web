import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { ComboBox } from '@progress/kendo-react-dropdowns'
import { Checkbox } from '@progress/kendo-react-inputs';
import { Label } from "@progress/kendo-react-labels";
import moment from 'moment'

function LimitsDataInChart(props) {

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

    
    //Returns time duration in days/hours/minutes format between 2 dates.
    const getStabilizationTime = (endTime, stabilizationLine) =>{

        return "זמן התיצבות:" + moment(endTime - stabilizationLine).format('mm:ss');
    };
 
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
    };
    
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
    
    //Adding a new stabilization line to limit
    const AddNewStabilizationTime = (limitKey) =>{
   
        var limit = props.limits.find(item => (item.key ===  limitKey));
        if(limit.stabilizationLine !== null) //Checks if there is already a stabilization line for current limit
           return;
  //check!!!!!
        // // // setSelectedLimitKey(limitKey);
        // // // setStateChart(stateChartEnum.addStabilizationTimeline);
        // // // setActiveLimitLine(limit.key); 
       
        //updates the limit with the new stabilization line.
        props.updateLimits(props.limits.map(range => (range.key === limitKey ? 
                          {...range, 
                            'stabilizationLine' : {'activeTooltipIndex': null, 'activeLabel': null},
                          } : range)));
         
    };

    return (
        <div style={{ width: "100%", height:"100%" }}>
                <Button icon="plus" onClick={(e)=> addNewLimit(0,1)}>הוסף גבול</Button>   
                {
                     props.limits.length > 0 ?
                     <div className='divDinamicLimits'>
                     {
                          props.limits.map(({key, leftSide, rightSide, stabilizationLine, color, includeInResults, name }, index) => 
                             {
                              return <div className='divControlsRange' key={"divRange_" + index}>
                                 <div className='flex-container'>
                                      <div style={{height: "8px", width: "8px", background: key === 0 ? "yellow" : "#" + color}}></div>
                                      <div style={{height: "8px", width: "8px", background: key === 0 ? "red" : "#" + color}}></div>
                                      
                                      
                                          {
                                          // shows the start time and end time of the limit 
                                          }
                                          <span style={{ fontWeight: 'bold'}}>{ moment(rightSide.activeLabel).format('HH:mm')} - {moment(leftSide.activeLabel).format('HH:mm')}</span>
                                  </div>
                                  <div> 
                                         {   //shows the time duration of the limit
                                            moment(rightSide.activeLabel - leftSide.activeLabel).format('mm:ss')
                                         }
                                       </div>
                                       <div> 
                                         {   //shows the time duration of stabilization time line
                                           stabilizationLine !== null && getStabilizationTime(leftSide.activeLabel, stabilizationLine.activeLabel)  
                                         }
                                       </div>
                                       <Checkbox checked={includeInResults} onChange={(e)=> setIncludeInResults(key, e.value)}>להציג בטבלת התוצאות</Checkbox>   
                                     <div style={{marginRight: "15px"}}> 
                                       <div className='flex-container'>
                                        <ComboBox data={["זמן כיול"]} value={name} allowCustom={true} onChange={(e) => setLimitName(key, e.value)}></ComboBox>&nbsp;   
                                       </div>  
                                    
                                       
                                       <div className='flex-container' key={"divRange2_" + index}>  
                                                                     
                                             <Button key={"btnRemoveLimit_" + index} onClick={(e) => RemoveLimit(key)} disabled={key === 0}>
                                                 <span className="k-icon k-i-delete"></span>
                                             </Button> &nbsp;
                                             <Button key={"btnExpandChart_" + index} onClick={(e) => 
                                                    props.showRange({'areaFrom': {activeTooltipIndex: leftSide.activeTooltipIndex, activeLabel: leftSide.activeLabel },
                                                                     'areaTo': {activeTooltipIndex: rightSide.activeTooltipIndex, activeLabel: rightSide.activeLabel}})}>
                                                 <span className="k-icon k-i-full-screen"></span>
                                             </Button> &nbsp;
                                             {/* <Button onClick={(e) => AddNewStabilizationTime(key)} 
                                                 style={{background : (stateChart === stateChartEnum.addStabilizationTimeline && selectedLimitKey === key) ? "#a5a5a5" : "",}}>קו התייצבות 
                                            </Button> */}
                                       </div> 
                                       <Label>------------------------------</Label>

                                     </div>
                                  </div>
                             })
                     } 
                     </div>:""  
                }      
       </div> 
    );
}

export default LimitsDataInChart;