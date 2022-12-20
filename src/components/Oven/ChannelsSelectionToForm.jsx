import {React, useState} from 'react';
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Grid, GridColumn} from "@progress/kendo-react-grid";
import { Checkbox, NumericTextBox } from '@progress/kendo-react-inputs';
import { useSelector, useDispatch } from 'react-redux';
import { channelsActions } from './../../store/channel-slice';
import { Button } from '@progress/kendo-react-buttons';
import { DragAndDrop } from "@progress/kendo-react-common";
import { DraggableRow  } from './../../Utils/DraggableRow';
import { DragHandleCell  } from './../../Utils/DragHandleCell';

export const ReorderContext = React.createContext({
  reorder: () => {},
  dragStart: () => {},
});

  const GetChannel = (channelsData)=>{
   
    const arr = [];
    channelsData.map((item) => {
      if(item.channels.length > 0)
      {
        
            item.channels.map((chanel) => {
              const container = {};
              container.hydraNumber = item.hydraNumber;
              container.name = chanel.name;   
              container.reports = chanel.reports;
              container.sensorValue = chanel.sensorValue; 
              container.unitsNumber = chanel.unitsNumber;

              arr.push(container);
      })
       
    }
         });

         return arr;

  }

 
  /* Channels Selection */
function ChannelsSelectionToForm ({form}) {
 
  var channelsData = GetChannel(useSelector((state) => state.channelData.channelsData))
  const dispatch = useDispatch();
  ///
  const [activeItem, setActiveItem] = React.useState(null);
  const reorder = (dataItem, direction) => {
    
    if (activeItem === dataItem) {
      return;
    }
    let reorderedData = channelsData.slice();
    let prevIndex = reorderedData.findIndex((p) => p === activeItem);
    let nextIndex = reorderedData.findIndex((p) => p === dataItem);
    reorderedData.splice(prevIndex, 1);
    reorderedData.splice(
      Math.max(nextIndex + (direction === "before" ? -1 : 0), 0),
      0,
      activeItem || reorderedData[0]
    );
    //setGridData(reorderedData);

    dispatch(channelsActions.reorderedData(
      { 
        reorderedData: reorderedData
      }));
    
  };

  const dragStart = (dataItem) => {
    setActiveItem(dataItem);
  };
  ///


  /* custom control to checkbox in cell in grid */
  const MyCheckBoxCell = (props) => {
    

    const channelInReport = channelsData.find((hydraItem) => hydraItem.hydraNumber === props.dataItem.hydraNumber && hydraItem.name === props.dataItem.name)
    .reports;
    console.log("channelInReport");
     console.log(channelInReport);
      var chann = undefined; 
     if(channelInReport !== undefined && channelInReport.length > 0)
         chann =  channelInReport.includes(form.id);

      return (
          <td>
              <Checkbox checked={chann === undefined || chann === false ? false : true} onChange={(e) => setActiveChannel(e.value, props.dataItem.name, props.dataItem.hydraNumber)} />
          </td>
        );
    
  };

  const setActiveChannel = (value, name, hydraNumber) =>{
    console.log("setActiveChannel");
    console.log(value);
    console.log(name);
    console.log(hydraNumber);
    dispatch(channelsActions.setChannelToReport(
            { item: { id: name,
                      hydraNumber: hydraNumber, 
                      report: form.id } 
            }));


  };
  const gridWidth = 600;

  const setPercentage = (percentage) => {
    return Math.round(gridWidth / 100) * percentage;
  };

  const CategoryCell = (props) => {

    if(props.dataItem["channels"].length > props.dataIndex)
    {  
     
       if(props.field === "hydraNumber")
         return <td>{props.dataItem["hydraNumber"]}</td>;

       const category = props.dataItem["channels"][props.dataIndex];     

       return <td>{category[props.field]}</td>;
    }
   
   
 };

     return (
       <div className='divChooseChannelsCol'>       
           <PanelBar>
             <PanelBarItem expanded={true} title="בחירת ערוצים">
                 <div className='divPanelBarItem'>
                 <Button>הוספת ערוצים מתוך קובץ 
                        <span className={"k-icon k-i-excel"}></span>
                    </Button> 
                    <ReorderContext.Provider
      value={{
        reorder: reorder,
        dragStart: dragStart,
      }}
    >
                     <DragAndDrop>
                        <Grid data={channelsData}
          dataItemKey={"name"}
          rowRender={(row, rowProps) => (
            <DraggableRow elementProps={row.props} {...rowProps} />
          )}
        >                   <GridColumn title="" width="80px" cell={DragHandleCell} />
                            <GridColumn field="name" title="שם"   width={setPercentage(10)}/>
                            <GridColumn field="unitsNumber" title="יחידות"  width={setPercentage(15)}/>
                            <GridColumn field="sensorValue" title="מס רגש"  width={setPercentage(15)}/> 
                            <GridColumn field="name" title="רגש"  width={setPercentage(10)}/>
                            <GridColumn field="name" title="ערוץ"  width={setPercentage(10)}/> 
                            <GridColumn field="hydraNumber"  title="אוגר נתונים" width={setPercentage(20)}/>    
                            <GridColumn title="ערוץ פעיל" cell={MyCheckBoxCell} width={setPercentage(15)}/>    
                      </Grid>  
                     </DragAndDrop> 
                     </ReorderContext.Provider> 
                 </div>
             </PanelBarItem>
           </PanelBar>
       </div>
     );
}

export default ChannelsSelectionToForm

