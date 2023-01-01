import {React, useState} from 'react';
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Grid, GridColumn, getSelectedState} from "@progress/kendo-react-grid";
import { useSelector, useDispatch } from 'react-redux';
import { reportsActions } from './../../store/reports-slice';

import ChannelsSelection from './ChannelsSelection/ChannelsSelection';
import { Button } from '@progress/kendo-react-buttons';
import { getter } from '@progress/kendo-react-common';
import { orderBy } from "@progress/kendo-data-query";


const DATA_ITEM_KEY = 'name';
const SELECTED_FIELD = 'selected';
const idGetter = getter(DATA_ITEM_KEY);
const initialSort = [
  {
    field: "serialNumber",
    dir: "asc",
  },
];

  const getChannelData = (listChannelsOfCurrentReport, listAllChannels) => {
 
    const arr = [];
    
    listChannelsOfCurrentReport.map((item) =>
    {
      const container = {};
     
      var hydraItem = listAllChannels.find((hydraItem) => hydraItem.id === item.hydraId)
      var channel = hydraItem.channels.find(code => code.name === item.name);
      console.log("channel");
      console.log(channel);
      container.hydraNumber = hydraItem.hydraNumber;
      container.name = item.name;   
      
   
      //container.reports = channel.reports;
      container.sensorValue = channel.sensorValue; 
      container.unitsNumber = channel.unitsNumber;
      container.serialNumber = item.serialNumber
      arr.push(container);
    }

    )
   return arr;

  }
  const DeleteItem = (props) => {

    return (
      <td>
        <Button>
            <span className='k-icon k-i-delete'></span>
        </Button>
      </td>
    );
  };
  
  /* Channels Selection */
function ChannelsSelectionToForm ({form}) {

  const listChannelsOfCurrentReport = useSelector((state) => state.reportsData.reportsDataList.find((item) =>item.id === form.id).channels);
  console.log(listChannelsOfCurrentReport);
  const listAllChannels = useSelector((state) => state.channelData.channelsData);
  console.log("listAllChannels");
  console.log(listAllChannels);
  var data = getChannelData(listChannelsOfCurrentReport, listAllChannels);
  console.log("datadata");
  console.log(data);
  const dispatch = useDispatch();
  
  const [selectedState, setSelectedState] = useState({});
  const [itemSelected, setItemSelected] = useState("");
 
  const [openCheannelsSelectionDialog, setOpenCheannelsSelectionDialog] = useState(false);

  const onSelectionChange = event => {
   
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY
    });
   
    setSelectedState(newSelectedState);
  };



  const gridWidth = 600;

  const setPercentage = (percentage) => {
    return Math.round(gridWidth / 100) * percentage;
  };


 const changeSerialNumber = (up) =>{
 
  if(up && itemSelected.serialNumber === 1)
  return;
 
  if(!up && itemSelected.serialNumber === data.length)
  return;

   var newSerialNumber = up ? itemSelected.serialNumber -1 : itemSelected.serialNumber +1
    dispatch(reportsActions.setChannelSerialNumber(
     {
     
         detailItem: {reportId : form.id,
                      hydraNumber: itemSelected.hydraNumber,
                      channelName: itemSelected.name,
                      serialNumber: itemSelected.serialNumber,
                      newSerialNumber: newSerialNumber} 
      }));

      setItemSelected(prevItem => ({
        ...prevItem,
        serialNumber: newSerialNumber
     }));

 };


const clicked = (event) => {

  setItemSelected(event.dataItem);

};

const getActiveButton = (up)=>
{
  switch(up)
  {
    case true:
      return !(itemSelected && itemSelected.serialNumber > 1);
    case false:
      return !(itemSelected && itemSelected.serialNumber <  data.length);
      default:
  }
 
}
const deleteChannelCell = (props) => {
  
  const removeChannel = () =>{

    dispatch(reportsActions.removeChannelFromReport(
      {
      
          detailItem: {reportId : form.id,
                       serialNumber: props.dataItem.serialNumber} 
       }));

     console.log(props.dataItem);
  }

  return(
    <td>
        <Button onClick={removeChannel}>
            <span className='k-icon k-i-delete'></span>
        </Button>
    </td>);

  };

  return (
    <div className='divChooseChannelsCol'>       
      <PanelBar>
        <PanelBarItem expanded={true} title="בחירת ערוצים">
          <div className='divPanelBarItem'>
            <div>
                <Button onClick={() => setOpenCheannelsSelectionDialog(true)}>בחירת ערוצים מאוגר נתונים</Button> &nbsp;
                <Button>הוספת ערוצים מתוך קובץ 
                    <span className={"k-icon k-i-excel"}></span>
                </Button> 
            </div>
             <br/>
            <div className='flex-container'>
              <div className='detailItem'>
                 <Button onClick={() => changeSerialNumber(true)} disabled={getActiveButton(true)}> 
                    <span className={"k-icon k-i-arrow-chevron-up"}></span> 
                  </Button> 
                  <Button onClick={() => changeSerialNumber(false)} disabled={getActiveButton(false)}> 
                    <span className={"k-icon k-i-arrow-chevron-down"}></span>
                  </Button>              
              </div>
              <div className='panel-grid-Channels'>
                  <Grid data={orderBy(data.map(item => ({
                            ...item,
                            [SELECTED_FIELD]: selectedState[idGetter(item)]
                          })), initialSort)} dataItemKey={DATA_ITEM_KEY} selectedField={SELECTED_FIELD} selectable={{}} onRowClick={clicked}  onSelectionChange={onSelectionChange}>
                      <GridColumn field="name" title="#"   width={setPercentage(10)}/>
                      <GridColumn field="unitsNumber" title="יחידות"  width={setPercentage(12)}/>
                      <GridColumn field="serialNumber" title="ערוץ" width={setPercentage(15)}/>  
                      {/* <GridColumn field="sensorValue" title="מס רגש"  width={setPercentage(15)}/>  */}
                      <GridColumn field="hydraNumber"  title="אוגר נתונים" width={setPercentage(16)}/>   
                      <GridColumn title="מחיקה" cell={deleteChannelCell} width={setPercentage(12)}/>        
                  </Grid>
              </div> 
            </div>    
          </div>
        </PanelBarItem>
      </PanelBar>
      {
          openCheannelsSelectionDialog && 
          <ChannelsSelection closeDialog={() => setOpenCheannelsSelectionDialog(false)} form={form}></ChannelsSelection>
      }
    </div>
  );
}

export default ChannelsSelectionToForm

