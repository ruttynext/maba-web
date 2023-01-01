import  {React, useState} from 'react';
import { Input, NumericTextBox, Checkbox } from '@progress/kendo-react-inputs';
import { Grid, GridColumn} from "@progress/kendo-react-grid";
import { PanelBar, PanelBarItem, Splitter } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Label } from "@progress/kendo-react-labels";
import { ComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import { Upload } from "@progress/kendo-react-upload";
import { Window } from "@progress/kendo-react-dialogs";
import CalcalateRangesData from '../../../data/CalcalateRangesData.json';
import CustomChart from '../../../components/CustomChart/CustomChart';
import OvenRangeData from '../../../data/OvenRange.json';
import { ListBox } from '@progress/kendo-react-listbox';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import ChannelMapping from '../ChannelMapping/ChannelMapping';
import LimitsDataInChart from './LimitsDataInChart';
import './Ranges.css'

const initialData2 = [
    { index: 1, timeStamp: "01/2/2019 01:00" , "Channels" : [{"ChannelName": "T1", "Value": 15}, {"ChannelName": "T2", "Value": 4.41}, {"ChannelName": "T3", "Value": 25}]},
    { index: 2, timeStamp:"01/02/2019 01:02"  , "Channels" : [{"ChannelName": "T1", "Value": 25.79}, {"ChannelName": "T2", "Value": 72}, {"ChannelName": "T3", "Value": 65}]},
    { index: 3, timeStamp: "01/02/2019 01:03"  , "Channels" : [{"ChannelName": "T1", "Value": 2.94}, {"ChannelName": "T2", "Value": 2}, {"ChannelName": "T3", "Value": 22}]},
     { index: 4, timeStamp: "01/02/2019 01:04"  , "Channels" : [{"ChannelName": "T1", "Value": 96.12}, {"ChannelName": "T2", "Value": 27.41}, {"ChannelName": "T3", "Value": 11}]},
     { index: 5, timeStamp: "01/02/2019 01:05", "Channels" : [{"ChannelName": "T1", "Value": 14.58}, {"ChannelName": "T2", "Value": 92.3}, {"ChannelName": "T3", "Value": 32}]},
     { index: 6, timeStamp: "01/02/2019 01:06", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 75.79}, {"ChannelName": "T3", "Value": 1}]},
     { index: 7, timeStamp: "01/02/2019 01:07", "Channels" : [{"ChannelName": "T1", "Value": 2.52}, {"ChannelName": "T2", "Value": 4.41}, {"ChannelName": "T3", "Value": 44}]},
     { index: 8, timeStamp: "01/02/2019 01:08", "Channels" : [{"ChannelName": "T1", "Value": 17.79}, {"ChannelName": "T2", "Value": 4.3}]},
     { index: 9, timeStamp: "01/02/2019 01:09", "Channels" : [{"ChannelName": "T1", "Value": 2.94}, {"ChannelName": "T2", "Value": 5}]},
     { index: 10, timeStamp: "01/02/2019 01:10", "Channels" : [{"ChannelName": "T1", "Value": 54.12}, {"ChannelName": "T2", "Value": 27.41}]},
     { index: 11, timeStamp: "01/02/2019 01:11", "Channels" : [{"ChannelName": "T1", "Value": 14.58}, {"ChannelName": "T2", "Value": 72.3}, {"ChannelName": "T3", "Value": 39}]},
     { index: 12, timeStamp: "01/02/2019 01:12", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}, {"ChannelName": "T3", "Value": 33}]},
     { index: 13, timeStamp: "01/02/2019 01:13", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
     { index: 14, timeStamp: "01/02/2019 01:14", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
     { index: 15, timeStamp: "01/02/2019 01:15", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 150}]},
     { index: 16, timeStamp: "01/02/2019 01:16", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
     { index: 17, timeStamp: "01/02/2019 01:17", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
     { index: 18, timeStamp: "01/02/2019 01:18", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
     { index: 19, timeStamp: "01/02/2019 01:19", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
     { index: 20, timeStamp: "01/02/2019 01:20", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]}
];

const reverData = initialData2.map(item=> 
    {
        const container = {};
        container.index = item.index;
        //container.timeStamp = new Date(item.timeStamp);
    
        container.timeStamp = new Date(item.timeStamp).getTime();
        let [bottom, top] = [item.Channels[0].Value, item.Channels[0].Value];
        item.Channels.map(channel => {
            container[channel.ChannelName] = channel.Value;

              if(channel.Value > top)
                 top = channel.Value;
              if(channel.Value < bottom) 
                 bottom = channel.Value;  
        });
        container.minValue = bottom;
        container.maxValue = top;

        return container;
    });

const DeleteRange = (props) => {

    return (
      <td>
        <Button>
            <span className='k-icon k-i-delete'></span>
        </Button>
      </td>
    );
  };
  
  

  const ReferanceLineContainer = (props) => {
   
    const getDefaultLimit = () =>
    {
         //Finds the dots values are between the active limit lines.
         var dataValues = data.slice(0, 2);
       
         //Calculation of minimum and maximum dots between the limit lines           
         const maxObj = dataValues.reduce((prev, current)=>  (prev.maxValue > current.maxValue) ? prev : current);
         const minObj = dataValues.reduce((prev, current)=>  (prev.minValue < current.minValue) ? prev : current);
    
        return [{'key': 0, 
                 'leftSide': {'activeTooltipIndex': 0, 'activeLabel': dataValues[0].timeStamp},
                 'rightSide': {'activeTooltipIndex': 1, 'activeLabel': dataValues[1].timeStamp}, 
                 'strokeWidthValue': 2,
                 'color': null, 
                 'maxPoint': {'timeStamp' : maxObj.timeStamp, 'value': maxObj.maxValue },
                 'minPoint': {'timeStamp' : minObj.timeStamp, 'value': minObj.minValue  },
                 'stabilizationLine' : null,
                 'includeInResults': true,
                 'name': "זמן כיול"}];
    };
    
    const [panes, setPanes] = useState([{size: "0%", collapsible: true,},{},]);
    
    const onChange = (event) => {
        setPanes(event.newState);
    }; 

    const [data, setData] = useState(reverData);
    const [precisionLines, sePrecisionLines] = useState({'topLimit': 15, bottonLimit:3});
    const [areaInData , setAreaInData] = useState(null);
    const [ranges, setRanges] = useState(getDefaultLimit);
    const [markes, setMarkes] = useState([]);
    const [visible, setVisible] = useState(false);
    const [positionDialoug, setPositionDialoug] = useState({});
   
    //Opening a dialog that displays the chart
    const openDialog = (e) => {
        setVisible(!visible);
        setPositionDialoug({marginTop: e.screenY, marginRight: e.screenX,});
      };
      
      //Close dialog
      const closeDialoug = (e) => {    
        setVisible(!visible);
        setAreaInData(null);
      };

      const showRangeInDialoug = (area) => {
        setAreaInData(area);  
        setVisible(true);
      }

    return (
      <div className='referance-Line-container'> 
       <Button onClick={(e) => openDialog(e)} >הרחב גרף</Button>&nbsp;
       <Checkbox>הצגת הגרף בדוח</Checkbox>
       <div className='c-reference-line'> 
        <div style={{width: "85%",}}>
            <Splitter style={{height: 520,}} panes={panes} onChange={onChange}>
                    <div>
                            <CustomChart limits={ranges} updateLimits={setRanges} 
                            markes={markes} updateMarkes={setMarkes} data={data} height={450} 
                            showRange={showRangeInDialoug} precisionLines = {precisionLines}/>
                    </div>
                     <div>
                            <CustomChart limits={ranges} updateLimits={setRanges} 
                            markes={markes} updateMarkes={setMarkes} data={data} height={450} 
                            showRange={showRangeInDialoug} precisionLines = {precisionLines}/>
                    </div> 
            </Splitter> 
        </div>
        <div style={{width: "15%",}}>
            <LimitsDataInChart limits={ranges} updateLimits={setRanges} data={data}/>
        </div>
        
      </div>
       
            {
                 visible && 
                (
                    <Window
                     //title={areaInData ? (data[areaInData.areaTo].timeStampToDisplay + " - " + data[areaInData.areaFrom].timeStampToDisplay) : "גרף תנורים" }
                     onClose={closeDialoug}
                     initialHeight={630}
                     initialWidth={1400}
                     style={positionDialoug}
                    >
                        <CustomChart limits={ranges} updateLimits={setRanges} height={500} maxValue={150}
                        data={areaInData ? data.slice(areaInData.areaFrom.activeTooltipIndex, areaInData.areaTo.activeTooltipIndex +1) : data.slice()}/>
                    </Window>
                )
            }
      </div>
    );
  };  

  const MyCustomItem = props => {
    let {
      dataItem,
      selected,
      ...others
    } = props;
    return <li {...others}>
          <div>
             <span style={{fontWeight: 'bold'}}>{props.dataItem.RangeName}</span>
            <br />
            <span>ערך מכוון: {props.dataItem.IntentionalValue}</span> <br />
            <span>מצב: {"לא עומד"}</span> <br />
            <span>קצב דגימה: {"3"}</span> <br />
            <Button><span className='k-icon k-i-delete'></span></Button><br />
            <span>________________________</span>
          </div>
        </li>;
  };

const SELECTED_FIELD = 'selected';

function Ranges(props) {

    const [rangeList, setRangeList] = useState(OvenRangeData);
    const [openChannelMapping, setOpenChannelMapping] = useState(false);
    
    const MyDeleteRange = (props) => (
        <DeleteRange {...props}/>
      );
    
    const showOrHideDialogChannelMapping = () =>
    {
        setOpenChannelMapping(!openChannelMapping);
    };

      const handleItemClick = (event) => {
        setRangeList(
            rangeList.map(item => {
            if (item.RangeId === event.dataItem.RangeId) {
                 item[SELECTED_FIELD] = !item[SELECTED_FIELD];
            } else  {
                 item[SELECTED_FIELD] = false;
            }
            return item;
          })
        );
      };

    return (
        <div className ='flexrow'>
        <div className='flexRightcolumnRanges'>
             <Button icon="plus" themeColor={"primary"}>תחום חדש</Button>
  
                <ListBox textField='RangeId' style={{height:'100%', width: '100%',}} 
                  data={rangeList} selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e)} item={MyCustomItem} />
                                    {/* <Grid
                                        data={OvenRangeData}>
                                        <GridColumn field="RangeName" title="שם"  />
                                        <GridColumn field="IntentionalValue" title="ערך מכוון" />
                                        <GridColumn field="Conclusion" title="מסקנה" />
                                        <GridColumn field="Range" title="מחיקה" cell={MyDeleteRange} />
                                    </Grid> */}
                
        </div>
        <div className='flexMiddlecolumnRanges'>
            <div className='div-detail-selected-range'>
                 <div className='detailItem' style={{width: "20%",}}>
                     <Label>שם תחום:</Label>
                     <ComboBox data={rangeList} textField={"RangeName"}></ComboBox>
                 </div> &nbsp;
                 <div className='detailItem' style={{width: "7%",}}>
                    <Label>מדידה:</Label>
                    <Input value={"טמפרטורה"}></Input>
                 </div>&nbsp;
                 <div className='detailItem' style={{width: "8%",}}>
                     <Label>יחידות:</Label>
                     <ComboBox data={["°C"]} value={"°C"}></ComboBox>
                 </div>&nbsp;
                 <div className='detailItem' style={{width: "15%",}}>
                     <Label>שיוך לחות:</Label>
                     <ComboBox data={rangeList} textField={"RangeName"}></ComboBox>
                 </div>
            </div>
            
        <PanelBar>
            <PanelBarItem title="נתונים כללים בתחום">
                <div className='divPanelBarItem2'>
                            <div className='detailItem'>
                                <Label>מסמך יחוס:</Label> 
                                <div className='flex-container'>            
                                     <ComboBox></ComboBox>&nbsp;
                                      <Button themeColor={"primary"}>הצג</Button>
                                </div>    
                            </div>
                            <div className='detailItem'>
                                <Label></Label>             
                                <Checkbox Value={true}>לפי דרישת לקוח?</Checkbox>&nbsp;   
                            </div>
                            <div className='detailItem'>
                                <Label>מפרט כיול:</Label>   
                                <div className='flex-container'>            
                                     <ComboBox></ComboBox>&nbsp;
                                      <Button themeColor={"primary"}>הצג</Button>
                                </div>    
                            </div>
                            <div className='detailItem'>
                                <Label>סוג הבקר:</Label>            
                                <ComboBox></ComboBox>
                            </div>    
                            <div className='detailItem'>
                                <Label>יצרן הבקר:</Label>    
                                <ComboBox></ComboBox>
                            </div> 
                            <div className='detailItem'>
                                <Label>דגם הבקר:</Label>    
                                <Input></Input>
                            </div>
                            <div className='detailItem'>    
                                <Label>מיפוי רגשים:</Label>  
                                <div className='flex-container'>
                                    <Input value={"הוגדר"} style={{background: "#90ee90", textAlign: "center", width: "70px"}}></Input>&nbsp;
                                    <Button themeColor={"primary"} onClick={showOrHideDialogChannelMapping}>עיצוב</Button>
                                </div>      
                            </div>
                            <div className='detailItem'>    
                                <Label>הוספת תמונה:</Label>  
                                <div className='flex-container'>
                                <Upload selectMessageUI={() => "צרף קבצים"} batch={false} multiple={true}
                                        defaultFiles={[]}
                                        showFileList={false}
                                        withCredentials={false}
                                        saveUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/save"}
                                        removeUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/remove"}/>  
                                </div>      
                            </div>
                            <div className='detailItem2'>                                   
                                    <Label>תיאור תהליך הכיול:</Label>     
                                    <div className='flex-container'>
                                       <DropDownList></DropDownList>&nbsp;
                                       <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                                    </div>      
                            </div> 
                            <div className='detailItem2'>                                   
                                    <Label>הערות בתחום:</Label>     
                                    <div className='flex-container'>
                                       <DropDownList></DropDownList>&nbsp;
                                       <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                                    </div>      
                            </div> 
                </div>
                {
                    openChannelMapping && (
                        <Dialog title={"מיפוי רגשים"} onClose={showOrHideDialogChannelMapping} >
                           <ChannelMapping></ChannelMapping>                                   
                          <DialogActionsBar>
                            <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={showOrHideDialogChannelMapping}>ביטול</button>
                            <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" >אישור</button>
                          </DialogActionsBar>
                        </Dialog>)
                }
            </PanelBarItem>
            <PanelBarItem expanded={true} title="הצגה גרפית של תחומים">
                <div className='divPanelBarItem'>
                     <ReferanceLineContainer/>      
                </div>
            </PanelBarItem>
            <PanelBarItem title="הגדרת חישובים">
               <div className='divPanelBarItem'>
               <div className='cards-container'>
               
                            <div className='card-content'>
                              
                                <div className='detailItem'>
                                   <Checkbox label={"ערך מכוון"}></Checkbox>
                                </div>
                                <div className='detailSubItem'>
                                    <div className='detailItem'>
                                        <Label>הבחנת הנבדק:</Label>
                                        <Input style={{width: "100px",}}></Input>
                                    </div> 
                                    
                                    <div className='detailItem'>
                                    <Label style={{textAlign: 'center',}}>ערך</Label>
                                        <div className='flex-container'>
                                        <div className='detailItem'>
                                                <Input style={{width: "100px",}}></Input>
                                                <Input style={{width: "100px",}}></Input>
                                        </div>
                                        <Label style={{paddingTop: '10%', }}> +- </Label> 
                                        <Input style={{width: "100px",}}></Input>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className='card-content'>

                                <div className='detailItem'>
                                   <Checkbox label={"תצוגה"}></Checkbox>
                                </div>
                                 <div className='detailSubItem'>  
                                        <div className='detailItem'>
                                            <Label>הבחנה:</Label>
                                            <Input style={{width: "80px",}}></Input>
                                        </div> 

                                        <div className='detailItem'>
                                            <Label>ערך:</Label>
                                            <Input style={{width: "80px",}}></Input>
                                        </div> 
                                </div> 
                            </div>
              
                
                            <div className='card-content'>
                             <div className='flex-container'>
                                    <div className='detailItem'>
                                        <Label>חישוב אי וודאות:</Label>
                                        <ComboBox data={["תקני"]} value={"תקני"} style={{width: "100px",}}></ComboBox>
                                    </div> 
                                    <div className='detailItem'>
                                        <Label></Label>
                                        <div className='flex-container'>
                                        <NumericTextBox style={{width: "80px",}}/> 
                                        <Label>+-</Label> 
                                        </div> 
                                    </div>     
                             </div>                                                    
                             <div className='flex-container'>
                                <div className='detailItem'>
                                    <Checkbox label={"יציבות"}></Checkbox>       
                                    <NumericTextBox style={{width: "100px",}}/>        
                                </div> 
                                <div className='detailItem'>
                                    <Checkbox label={"אחידות"}></Checkbox>        
                                    <NumericTextBox style={{width: "80px",}}/>        
                                </div> 
                            </div>
                               
                            </div>
                            <div className='card-content' >
                                <div className='detailItem'>
                                   <Checkbox>
                                      <label style={{fontWeight: 'bold', }}>זמן התייצבות</label>
                                   </Checkbox>
                                   <div className='detailSubItem'>
                                       <Checkbox label={"חישוב אוטומטי"}></Checkbox>&nbsp;
                                       <NumericTextBox  style={{width: "80px",}}/>
                                   </div> 
                                </div>


                                <div className='detailItem'>
                                   <Checkbox>
                                      <label style={{fontWeight: 'bold', }}>זמן כיול</label>
                                   </Checkbox>
                                   <div className='detailSubItem'>
                                       <Checkbox label={"חישוב אוטומטי"}></Checkbox>&nbsp;
                                       <NumericTextBox style={{width: "80px",}}/>
                                   </div> 
                                </div>
                                
                                <div className='detailItem'>
                                   <Checkbox>
                                      <label style={{fontWeight: 'bold', }}>Overshoot</label>
                                   </Checkbox>
                                   <div className='detailSubItem'>
                                       <Checkbox label={"חישוב אוטומטי"}></Checkbox>&nbsp;
                                       <NumericTextBox style={{width: "80px",}}/>
                                   </div> 
                                </div> 

                            </div>
                       
                    </div>
               </div>
            </PanelBarItem>
            <PanelBarItem title="תוצאות כיול">
               <div className='divPanelBarItem'>
                <br/>
                    <div>
                            <Grid>
                                <GridColumn field="RangeName" title="ערך מכוון [C]"  />
                                <GridColumn field="IntentionalValue" title="ממוצע [C]" />
                                <GridColumn field="Conclusion" title="תצוגה [C]" />
                                <GridColumn field="RangeName" title="תיקון בקר [C]"  />
                                <GridColumn field="IntentionalValue" title="תיקון תצוגה [C]" />
                                <GridColumn field="Conclusion" title="Undershoot[C]"/>
                                <GridColumn field="IntentionalValue" title="זמן התייצבות" />
                                <GridColumn field="Conclusion" title="זמן כיול"/>
                            </Grid>
                    </div>
                    <br/>
                    <div className ='flex-container'>
                        <div className='flexRightGridRange'>
                            <Grid data={CalcalateRangesData}>
                                <GridColumn field="RagashNum" title="רגש"/>
                                <GridColumn field="MinValue" title="ערך מינימום[C]" />
                                <GridColumn field="MaxValue" title="ערך מקסימום [C]" />
                                <GridColumn field="AvarageValue" title="ממוצע [C]"  />
                                <GridColumn field="Accuracy" title="דיוק" />
                                <GridColumn field="Stability" title="יציבות"/>
                            </Grid>
                        </div>
                        <div className='flexLeftGridRange'>
                            <Label>הצגת ערוצים מבוטלים</Label>
                            <ComboBox data={["להציג עם הערה","לא להציג בדוח"]}></ComboBox>
                            <br/>
                            <Label>אפשרויות כיול</Label>
                            <ComboBox data={[" דוח תוצאות","ללא מסקנות","קביעת מסקנות"]}></ComboBox>
                            <br/>
                            <Label>עמידת הפריט בתפריט הכיול</Label>
                            <div className='stateCalibrateDiv'>
                                לא עומד
                            </div>
                        </div>
                    </div>
                </div>
            </PanelBarItem>
        </PanelBar>                      
        </div>
    </div>
    );
}

export default Ranges;