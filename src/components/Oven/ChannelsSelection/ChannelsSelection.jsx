import {React, useState} from 'react';

import { Dialog } from '@progress/kendo-react-dialogs';
import './ChannelsSelection.css'
import { useSelector, useDispatch } from 'react-redux';
import { channelsActions } from '../../../store/channel-slice';
import { reportsActions } from '../../../store/reports-slice';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { Label, Error } from '@progress/kendo-react-labels';
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { TreeView } from "@progress/kendo-react-treeview";
import {  NumericTextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
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

const ItemSelected = ({id, selectItem, isSelect, activeChannel}) => {
  
  const isChannelActive = activeChannel === undefined ? false : true;

  return (
    <div className="cont-checkbox">
    <input className='inpu' type="checkbox" id={"myCheckbox-"+ id} onChange={(e) => selectItem(e.target.checked, id, isChannelActive)} checked={isSelect} />
    <label className='labe' for={"myCheckbox-"+ id}>
     
   { isChannelActive ?
    <> 
     <span className="cover-checkbox" style={{background: "#" + activeChannel.color,}}>
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span> 
    </> : ""
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

const createItemsSelectedArr = (channelsAmount) =>{
  
  const tempArr = [];  
  for (let i = 1; i <= channelsAmount; i++)
  {
    tempArr.push({id : i, selected: false});
  }

  return tempArr;

}

// const getChannelsActive = (listReports) =>{
 
//   listReports.map((item) => {
//      arr.push(item.)
//   })
//    const arr = [];

// }

function ChannelsSelectionByHydra({hydraObj, form}) {
  
  
  const [ itemsSelected, setItemsSelected ] = useState(createItemsSelectedArr(hydraObj.channelsAmount));
  const listReports = useSelector((state) => state.reportsData.reportsDataList);
 // const [channelsActive, setChannelsActive ] = useState(getChannelsActive(listReports));

  const dispatch = useDispatch();
  const [channelsMatrix, setChannelsMatrix] = useState({ x: 10, y: 6 });
 
  const selectItem = (value, id, isSetDetailsChannel) =>{

    if(isSetDetailsChannel)
    { 
      //dispatch(channelsActions.removeChannel({ channel: {id: id, hydraNumber: hydraObj.hydraNumber}},));
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
      
    const activeChannel = listReports.find((reportItem) => reportItem.channels.some(code => code.hydraId ===  hydraObj.id && code.name === item.id));
   
      content.push(<ItemSelected id={item.id} selectItem={selectItem} isSelect={item.selected} activeChannel={activeChannel}  />);
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
   console.log("submitSetSelectedItems");
   console.log(dataItem);
    dispatch(channelsActions.setChanneldata(
    { detailsChannel: { hydraNumber: hydraObj.hydraNumber, sensorValue: dataItem.sensorValue, measurementType: dataItem.measurementType, 
                          unitsNumber: dataItem.unitsNumber, lowerLimit:  dataItem.lowerLimit, UpperLimit:  dataItem.UpperLimit},
      
      channelsArray: itemsSelected.filter(item => {
                        return item.selected === true;})
    },));
    
    dispatch(reportsActions.addChannelsToReport(
    { 
          details: {hydraNumber: hydraObj.id, reportId: form.id},
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
    dataItem.sensorValue = "";
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
                 <div className='flex-container'>
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
                  </div>
                </FormElement>
                )}
            />
            <Button>בחר הכל</Button>&nbsp;
            <Button>בטל הכל</Button>
        </div>
     </div>        
  </div>
  <div>
  <Form
             onSubmit={submitSetSelectedItems}
             render={(formRenderProps) => (
             <FormElement>
                 <div  className='flex-container'>
                    <div className='detailItem'>
                        <Label>מס אצווה</Label>
                        <Field name={"sensorValue"} component={comboBoxField} data={sensorItems} style={{width: "190px",}}></Field> 
                        {/* <ComboBox data={sensorItems} style={{width: "120px",}} value={sensorValue} onChange={(e)=>setSensorValue(e.value)}></ComboBox>  */}
                    </div>
                  <div style={{marginRight: "30px",}}>
                      <div className='flex-container'>
                            <div className='detailItem'>
                              <Label>סוג מדידה</Label>
                              <Field name={"measurementType"} component={comboBoxField} data={measurementType} style={{width: "190px",}}></Field> 
                            </div>
                            <div className='detailItem'>
                              <Label>יחידות</Label>
                              <Field name={"unitsNumber"} component={comboBoxField} data={unitsType} style={{width: "120px",}}></Field> 
                            </div>
                        </div>
                        <div className='flex-container'>
                                <div className='detailItem'>
                                  <Label className='detailItem'>גבול עליון</Label>
                                  <Field name={"lowerLimit"} component={numbericField}></Field>
                                  
                                </div>
                                <div className='detailItem'>
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
                      disabled={!formRenderProps.allowSubmit}>החל</button>
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
 
  const dispatch = useDispatch();
  
  //* Fires when the expanding or collapsing of an item.
  const onExpandChange = (event) => {
 
      dispatch(channelsActions.expandedHydra(
        { 
          detailsHydra: { hydraNumber: event.item.hydraNumber, expanded: !event.item.expanded}
        },));

  };

  //* event that fires when an item is clicked or when Enter is pressed on a focused item.
  const selectedItem = (event) => {

     if(event.item.channels)
     {
        setItemSelect([event.itemHierarchicalIndex]);
        setHydraSelected(event.item.id);

        // dispatch(channelsActions.selectedHydra(
        //   { 
        //     detailsHydra: { hydraNumber: props.item.hydraNumber, selected: !props.item.selected}
        //   },));
     }
  }
  
   //* Returns the title of the item 
  const headerItem = (event) => {
       
      //* If the item is the parent, then returns hydraNumber value, and to childrens items returns channel name value.
      return (
         <>
            {event.item.channels ? event.item.hydraNumber : event.item.name}
         </>
      );
  };
   

    return (
      <>
        <Dialog title={'בחירת ערוצים מאוגר נתונים'} onClose={props.closeDialog}>  
          
             <div className='flex-container'>
                 <div className='div-details-hydra'>
                      <TreeView item={headerItem}
                        data={hydraList}
                        expandIcons={true} onItemClick={selectedItem} 
                        onExpandChange={onExpandChange} childrenField={"channels"} textField={"hydraNumber"} />
                 </div>
                  

                 {
                  <ChannelsSelectionByHydra hydraObj={hydraList[hydraSelected]} form={props.form}/> 
                 }  
              <div>

              </div>
            </div> 
         </Dialog>  
      </>   
    );

}

export default ChannelsSelection;
