import {React, useState} from 'react';
import {connect} from 'react-redux';
import { Checkbox, NumericTextBox } from '@progress/kendo-react-inputs';
import { Dialog , DialogActionsBar} from '@progress/kendo-react-dialogs';
import './ChannelsSelection.css'
import { useSelector, useDispatch } from 'react-redux';
import { channelsActions } from '../../../store/channel-slice';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { Label, Error } from '@progress/kendo-react-labels';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { TreeView, processTreeViewItems } from "@progress/kendo-react-treeview";

const sensorItems = [
  "123",
  "523",
  "111",
  "777",
  "888",
  "999",
  "456",
  "145",
];

const measurementType = [
  "טמפרטורה",
  "לחות",
  "לחץ"
];

const unitsType = [
  "°C",
  "°F"
];

const ItemSelected = ({id, selectItem, isSelect, activeChannel, listReports}) => {
  
  const isChannelActive = activeChannel === undefined ? false : true;

  return (
    <div className="cont-checkbox">
    <input className='inpu' type="checkbox" id={"myCheckbox-"+ id} onChange={(e) => selectItem(e.target.checked, id, isChannelActive)} checked={isSelect} />
    <label className='labe' for={"myCheckbox-"+ id}>
     
   { isChannelActive ?
    <> 
     <span className="cover-checkbox" style={{background: activeChannel.reports.length > 0 ?
       "#" + listReports.find((item) => item.id === activeChannel.reports[0]).color :"#ffc107",}}>
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span> 
    </>:""
  }
      <div className="info">{id}</div>
    </label>
  </div>
  );
};

const numbericField = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <NumericTextBox {...others} style={{width: "70px",}} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
      
    </div>
  );
};


const comboBoxField = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <ComboBox {...others}></ComboBox>
      {/* <NumericTextBox min={1} max={60} {...others} style={{width: "70px",}} /> */}
      {visited && validationMessage && <Error>{validationMessage}</Error>}
      
    </div>
  );
};

const createItemsSelectedArr = () =>{
  
  const tempArr = [];  
  for (let i = 1; i <= 60; i++)
  {
    tempArr.push({id : i, selected: false});
  }

  return tempArr;

}

function ChannelsSelectionByHydra({hydraNumber, channelsList}) {
  
  console.log("ChannelsSelectionByHydra");
  console.log(channelsList);
  const [ itemsSelected, setItemsSelected ] = useState(createItemsSelectedArr);
  const listReports = useSelector((state) => state.reportsData.reportsDataList);
  const [ sensorValue, setSensorValue ] = useState("");
  

  const dispatch = useDispatch();
  const [channelsMatrix, setChannelsMatrix] = useState({ x: 10, y: 6 });
 
  const selectItem = (value, id, isSetDetailsChannel) =>{
 

    if(isSetDetailsChannel)
    {
      dispatch(channelsActions.removeChannel({ channel: {id: id, hydraNumber: hydraNumber}},));
      return;
    }

    setItemsSelected(current =>
          current.map(obj => {
            if (obj.id === id) {
              return {...obj,  'selected' : value};
            }
            return obj;
          }),
        );

  };



   const generateChannelsSelection = () => {
    
    let contentRows = [];
    let content = [];
    let index = 0;

    itemsSelected.map(item => {
      
      const activeChannel = channelsList.find(
            (channelItem) => channelItem.name === item.id);
      
      content.push(<ItemSelected id={item.id} selectItem={selectItem} isSelect={item.selected} 
                          activeChannel={activeChannel} listReports = {listReports}/>);
      index = index + 1;
     
      if(index === channelsMatrix.x)
         {
           contentRows.push(<div className='cont-main'>{content}</div>);
           content = [];
           index= 0;
         }
    })

    if(content.length > 0)
        contentRows.push(<div  className='cont-main' key={index}>{content}</div>);
       
     return contentRows;
   };
  


  const submitSetSelectedItems = (dataItem) =>
  {
   
    dispatch(channelsActions.setChanneldata(
      { detailsChannel: { hydraNumber: hydraNumber, sensorValue: sensorValue, measurementType: dataItem.measurementType, 
                          unitsNumber: dataItem.unitsNumber, lowerLimit:  dataItem.lowerLimit, UpperLimit:  dataItem.UpperLimit},
        channelsArray: itemsSelected.filter(item => {
                        return item.selected === true;})
      },));

   
     //reset all items that selected.
     setItemsSelected(current =>
      current.map(obj => {
          return {...obj,  'selected' : false};  
      }),
    );

    //reset fields
    setSensorValue("");
    dataItem.measurementType = "";
    dataItem.unitsNumber = "";
    dataItem.lowerLimit = "";
    dataItem.UpperLimit = "";
  };


  const submitSelectedItems = (dataItem) => {
    
     if(dataItem.selectFrom > dataItem.selectTo)
        return;
 
     setItemsSelected(current =>
         current.map(obj => {
           if (obj.id >= dataItem.selectFrom && obj.id <= dataItem.selectTo) {
             return {...obj,  'selected' : true};
           }
           return obj;
         }),
     );

     //reset fields after submit.
     dataItem.selectFrom = "";
     dataItem.selectTo = "";

  }

 return(
  <div>
  <div className='flex-container'>
    <div className='flex-container'>
        <div className='detailItem'>
            <Label>מס אצווה</Label>
            <ComboBox data={sensorItems} style={{width: "120px",}} value={sensorValue} onChange={(e)=>setSensorValue(e.value)}></ComboBox> 
        </div>
        <div>
        {
          generateChannelsSelection()
        } 
        </div>
        <div>
            <Form
                onSubmit={submitSelectedItems}
                render={(formRenderProps) => (
                <FormElement>
                      <div className='detailItem'>
                          <Label>מ:</Label>
                          <Field name={"selectFrom"} component={numbericField} min={1} max={60}></Field>
                      </div>
                      <div className='detailItem'>
                          <Label>ל:</Label>
                          <Field name={"selectTo"} component={numbericField} min={1} max={60}></Field>
                      </div>
                      <button
                          type={"submit"}
                          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                          disabled={!formRenderProps.allowSubmit}>בחר</button>
                </FormElement>
                )}
              />
        </div>
     </div>        
  </div>
  <div>
  <Form
             onSubmit={submitSetSelectedItems}
             render={(formRenderProps) => (
             <FormElement>
      <div className='flex-container'>
          
          <div>
              <div>
                <Label>סוג מדידה</Label>
                <Field name={"measurementType"} component={comboBoxField} data={measurementType} style={{width: "190px",}}></Field> 
              </div>
              <div>
                <Label>יחידות</Label>
                <Field name={"unitsNumber"} component={comboBoxField} data={unitsType} style={{width: "120px",}}></Field> 
              </div>
              <div className='flex-container'>
                  <div>
                    <Label className='detailItem'>גבול עליון</Label>
                    <Field name={"lowerLimit"} component={numbericField}></Field>
                    
                  </div>
                  <div>
                    <Label className='detailItem'>גבול תחתון</Label>
                    <Field name={"UpperLimit"} component={numbericField}></Field>
                  </div>
              </div>
          </div> 
          </div>
          <br/>
          <button
                      type={"submit"}
                      className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                      disabled={!formRenderProps.allowSubmit}>Set</button>
             </FormElement>
            )}
          />
    </div>
  <div>
      {/* <Grid data={getData()}>
        
                   <GridColumn field="Name" title="שם" />
                   <GridColumn title="יחידות" cell={MyNumericTextBox} />
                   <GridColumn title="גבול עליון" cell={MyNumericTextBox}/> 
                   <GridColumn title="גבול תחתון" cell={MyNumericTextBox}/> 
                   <GridColumn title="ערוץ פעיל" cell={MyCheckBoxCell}/>   
               </Grid>  */}
  </div>
  </div>
 );
}



function ChannelsSelection(props) {

  const hydraList = useSelector((state) => state.channelData.channelsData);

  const [hydraSelected, setHydraSelected] = useState(0);
  const [itemSelect, setItemSelect] = useState(['0']);
  console.log(itemSelect);
  const dispatch = useDispatch();
  
  //* Fires when the expanding or collapsing of an item.
  const onExpandChange = (event) => {
 
      dispatch(channelsActions.expandedHydra(
        { 
          detailsHydra: { hydraNumber: event.item.hydraNumber, expanded: !event.item.expanded}
        },));

  };

  //* event that fires when an item is clicked or when Enter is pressed on a focused item.
  const selectedItem = (props) => {

     if(props.item.channels)
     {
        setItemSelect([props.itemHierarchicalIndex]);
        setHydraSelected(props.item.id);

        // dispatch(channelsActions.selectedHydra(
        //   { 
        //     detailsHydra: { hydraNumber: props.item.hydraNumber, selected: !props.item.selected}
        //   },));
     }
  }
  
   //* Returns the title of the item 
  const headerItem = (props) => {
       
      //* If the item is the parent, then returns hydraNumber value, and to childrens items returns channel name value.
      return (
         <>
            {props.item.channels ? props.item.hydraNumber : props.item.name}
         </>
      );
  };
   

    return (
      <>
        <Dialog title={'בחירת ערוצים מאוגר נתונים'} onClose={props.closeDialog}>  
          
             <div className='flex-container'>

                  <TreeView item={headerItem}
                   data={hydraList}
                   expandIcons={true} onItemClick={selectedItem} 
                   onExpandChange={onExpandChange} childrenField={"channels"} textField={"hydraNumber"} />

                 {
                  <ChannelsSelectionByHydra hydraNumber={hydraList[hydraSelected].hydraNumber} channelsList={hydraList[hydraSelected].channels}/> 
                 }  
              
               {/* <div>
                  <TabStrip selected={selected} onSelect={handleSelect}>
                      { 
                        hydraList.map((item, index) => 
                        {  
                            return(       
                                <TabStripTab title={item.hydraNumber}>
                                      <ChannelsSelectionByHydra hydraNumber={item.hydraNumber} channelsList={item.channels}/>    
                                </TabStripTab>) 
                        })
                      }  
                  </TabStrip>
              </div>  */}
              <div>

              </div>
            </div> 
         </Dialog>  
      </>   
    );

}

export default ChannelsSelection;
