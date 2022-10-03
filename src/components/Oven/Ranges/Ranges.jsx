import  {React, useState} from 'react';
import { Input, NumericTextBox, Checkbox } from '@progress/kendo-react-inputs';
import { Grid, GridColumn} from "@progress/kendo-react-grid";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Label } from "@progress/kendo-react-labels";
import { ComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import { Window } from "@progress/kendo-react-dialogs";
import CalcalateRangesData from '../../../data/CalcalateRangesData.json';
import Referenceline from '../../../components/referenceline/referenceline';
import OvenRangeData from '../../../data/OvenRange.json';
import { GetFormatTime } from '../../../Utils';

const initialData2 = [
    { index: 1, timeStamp: "07/30/2019 01:01", "Channels" : [{"ChannelName": "T1", "Value": 2.52}, {"ChannelName": "T2", "Value": 4.41}]},
    { index: 2, timeStamp: "07/30/2019 01:02", "Channels" : [{"ChannelName": "T1", "Value": 17.79}, {"ChannelName": "T2", "Value": 120}]},
    { index: 3, timeStamp: "07/30/2019 01:03", "Channels" : [{"ChannelName": "T1", "Value": 2.94}, {"ChannelName": "T2", "Value": 1.79}]},
    { index: 4, timeStamp: "07/30/2019 01:04", "Channels" : [{"ChannelName": "T1", "Value": 140.12}, {"ChannelName": "T2", "Value": 27.41}]},
    { index: 5, timeStamp: "07/30/2019 01:05", "Channels" : [{"ChannelName": "T1", "Value": 14.58}, {"ChannelName": "T2", "Value": 144.3}]},
    { index: 6, timeStamp: "07/30/2019 01:06", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 140.79}]},
    { index: 7, timeStamp: "07/30/2019 01:07", "Channels" : [{"ChannelName": "T1", "Value": 2.52}, {"ChannelName": "T2", "Value": 4.41}]},
    { index: 8, timeStamp: "07/30/2019 01:08", "Channels" : [{"ChannelName": "T1", "Value": 17.79}, {"ChannelName": "T2", "Value": 4.3}]},
    { index: 9, timeStamp: "07/30/2019 01:09", "Channels" : [{"ChannelName": "T1", "Value": 2.94}, {"ChannelName": "T2", "Value": 1.79}]},
    { index: 10, timeStamp: "07/30/2019 01:10", "Channels" : [{"ChannelName": "T1", "Value": 54.12}, {"ChannelName": "T2", "Value": 27.41}]},
    { index: 11, timeStamp: "07/30/2019 01:11", "Channels" : [{"ChannelName": "T1", "Value": 14.58}, {"ChannelName": "T2", "Value": 144.3}]},
    { index: 12, timeStamp: "07/30/2019 01:12", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 13, timeStamp: "07/30/2019 01:13", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 14, timeStamp: "07/30/2019 01:14", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 15, timeStamp: "07/30/2019 01:15", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 16, timeStamp: "07/30/2019 01:16", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 17, timeStamp: "07/30/2019 01:17", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 18, timeStamp: "07/30/2019 01:18", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 19, timeStamp: "07/30/2019 01:19", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]},
    { index: 20, timeStamp: "07/30/2019 01:20", "Channels" : [{"ChannelName": "T1", "Value": 36.7}, {"ChannelName": "T2", "Value": 95.79}]}
];

const reverData = initialData2.map(item=> 
    {
        const container = {};
        container.index = item.index;
        container.timeStamp = new Date(item.timeStamp);
        container.timeStampToDisplay = GetFormatTime(new Date(item.timeStamp), true);
        item.Channels.map(channel => {
            container[channel.ChannelName] = channel.Value;
        });

        return container;
    });

const DeleteRange = (props) => {

    return (
      <td>
        <Button>מחיקה</Button>
      </td>
    );
  };

  const ReferanceLineContainer = (props) => {

    const [data, setData] = useState(reverData);
    const [areaInData , setAreaInData] = useState(null);
    const [ranges, setRanges] = useState([]);
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
      <> <br/>
       <Button onClick={(e) => openDialog(e)} >הרחב גרף</Button>
       <Referenceline ranges={ranges} updateRanges={setRanges} data={data} updateData={setData} width={700} height={290} 
          showRange={showRangeInDialoug} />
            {
                 visible && 
                (
                    <Window
                     title={areaInData ? (data[areaInData.indexTo].timeStampToDisplay + " - " + data[areaInData.indexFrom].timeStampToDisplay) : "גרף תנורים" }
                     onClose={closeDialoug}
                     initialHeight={630}
                     initialWidth={1400}
                     style={positionDialoug}
                    
                    >
                        <Referenceline ranges = {ranges} updateRanges= {setRanges} width={950} height={500} 
                        data={areaInData ? data.slice(areaInData.indexFrom, areaInData.indexTo) : data.slice()} 
                         updateData={setData}/>
                    </Window>
                )
            }
      </>
    );
  };  

function Ranges(props) {

    const MyDeleteRange = (props) => (
        <DeleteRange {...props}/>
      );

    return (
        <div className ='flexrow'>
        <div className='flexRightcolumnRanges'>

             <Button themeColor={"primary"}>תחום חדש</Button>
                            <div className='divGridRange'>
                                    <Grid
                                        data={OvenRangeData}>
                                        <GridColumn field="RangeName" title="שם"  />
                                        <GridColumn field="IntentionalValue" title="ערך מכוון" />
                                        <GridColumn field="Conclusion" title="מסקנה" />
                                        <GridColumn field="Range" title="מחיקה" cell={MyDeleteRange} />
                                    </Grid>
                            </div>
        </div>
        <div className='flexMiddlecolumnRanges'>
        <PanelBar>
            <PanelBarItem expanded={true} title="נתונים כללים בתחום">
                <div className='divPanelBarItem'>
                    <div className='flexControl'>
                            <div>
                                <Label>מסמך יחוס:</Label>    
                                <div className='flexControl'>
                                    <ComboBox></ComboBox>&nbsp;
                                    <Button themeColor={"primary"}>שינוי</Button>
                                </div>
                            </div>
                            <div>
                                <Label>מפרט כיול:</Label>    
                                <div className='flexControl'>
                                    <ComboBox></ComboBox>&nbsp;
                                    <Button themeColor={"primary"}>שינוי</Button>
                                </div>
                            </div>
                    </div>
                    <div className='flexControl'>
                            <div>
                                <Label>סוג הבקר:</Label>    
                                <ComboBox></ComboBox>
                            </div>
                            <div>
                                <Label>יצרן הבקר:</Label>    
                                <ComboBox></ComboBox>
                            </div>
                            <div>
                                <Label>דגם הבקר:</Label>    
                                <Input></Input>
                            </div>
                    </div>
                    <div>
                            <Label>תיאור תהליך הכיול:</Label>    
                            <div className='flexControl'>
                                <DropDownList style={{width: "70%", }}></DropDownList>&nbsp;
                                <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                            </div>
                    </div>
                </div>
            </PanelBarItem>
            <PanelBarItem title="הצגה גרפית של תחומים">
                <div className='divPanelBarItem'>
                    <div>
                        <ReferanceLineContainer/>
                    </div>
                </div>
            </PanelBarItem>
            <PanelBarItem expanded={true} title="הגדרת חישובים">
               <div className='divPanelBarItem'>
                <div className='flexControl'>
                            <div className='card'  style={{width:"21%",}}>
                                <div className='intentional-value'>
                                <div className='flexControl'> 
                                    <Checkbox></Checkbox>
                                    <Label>ערך מכוון:</Label>
                                </div>
                                <div>
                                    <Label>הבחנת הנבדק</Label>
                                    <Input></Input>
                                </div> 
                                <div>
                                    <Label>דרגת דיוק</Label>
                                    
                                    <div className='flexControl'>
                                        <div>
                                            <Input></Input>
                                            <Input></Input>
                                        </div>
                                        
                                        
                                        <Label> +- </Label> 
                                    <Input/>
                                    
                                    </div>
                                    
                                </div>
                                </div>
                            </div>
                            <div className='card'  style={{width:"15%",}}>
                                <div className='flexControl'> 
                                    <Checkbox></Checkbox>
                                    <Label>תצוגה:</Label>
                                </div>
                                <div>
                                <Label>הבחנה:</Label>
                                <Input></Input>
                                <Label>ערך:</Label>
                                <Input></Input>
                                </div>  
                            </div>
                            <div className='card' style={{width:"25%",}}>
                                <div className='flexControl'>
                                    <div>
                                        <Label>חישוב אי וודאות</Label>
                                        <ComboBox></ComboBox>
                                        <Label>אי וודאות</Label>
                                        <NumericTextBox/>
                                    </div>
                                    <div>
                                        <div className='flexControl'> 
                                            <Checkbox></Checkbox>
                                            <Label>יציבות</Label>
                                        </div>  
                                        <div className='flexControl'>        
                                            <ComboBox></ComboBox>
                                            <Label>+-</Label>
                                        </div>
                                        <div className='flexControl'> 
                                            <Checkbox></Checkbox>
                                            <Label>אחידות</Label>
                                        </div>
                                        <div className='flexControl'> 
                                            <NumericTextBox/>
                                            <Label>+-</Label>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                            <div className='card'  style={{width:"39%",}}>
                                <div className='flexControl'> 
                                    <div>
                                        <div className='flexControl'> 
                                            <Checkbox></Checkbox>
                                            <Label>זמן התייצבות:</Label>
                                        </div>
                                            <div className='flexControl'> 
                                                <Checkbox></Checkbox>
                                                <Label>חישוב אוטומטי</Label>
                                            </div>
                                            <NumericTextBox/>
                                            <br/>
                                            <div>
                                                <div className='flexControl'> 
                                                    <Checkbox></Checkbox>
                                                    <Label>Overshoot:</Label>
                                                </div>
                                                    <div className='flexControl'> 
                                                        <Checkbox></Checkbox>
                                                        <Label>חישוב אוטומטי</Label>
                                                    </div>
                                                    <NumericTextBox/>
                                            </div>
                                    </div>
                                    <div>
                                        <div className='flexControl'> 
                                            <Checkbox></Checkbox>
                                            <Label>זמן כיול</Label>
                                        </div>
                                        <div className='flexControl'> 
                                            <Checkbox></Checkbox>
                                            <Label>חישוב אוטומטי</Label>
                                        </div>
                                        <NumericTextBox/>
                                    </div>
                                
                                </div> 
                            </div>
                        </div>
               </div>
            </PanelBarItem>
            <PanelBarItem expanded={true} title="תוצאות כיול">
               <div className='divPanelBarItem'>
                <br/>
                    <div>
                            <Grid>
                                <GridColumn field="RangeName" title="ערך מכוון [K]"  />
                                <GridColumn field="IntentionalValue" title="ממוצע [K]" />
                                <GridColumn field="Conclusion" title="תצוגה [K]" />
                                <GridColumn field="RangeName" title="תיקון בקר [K]"  />
                                <GridColumn field="IntentionalValue" title="תיקון תצוגה [K]" />
                                <GridColumn field="Conclusion" title="Undershoot[K]"/>
                                <GridColumn field="IntentionalValue" title="זמן התייצבות" />
                                <GridColumn field="Conclusion" title="זמן כיול"/>
                            </Grid>
                    </div>
                    <br/>
                    <div className ='flexrow'>
                        <div className='flexRightGridRange'>
                            <Grid data={CalcalateRangesData}>
                                <GridColumn field="RagashNum" title="רגש"/>
                                <GridColumn field="MinValue" title="ערך מינימום[C]" />
                                <GridColumn field="MaxValue" title="ערך מקסימום [C]" />
                                <GridColumn field="AvarageValue" title="ממוצע[C]"  />
                                <GridColumn field="Accuracy" title="דיוק" />
                                <GridColumn field="Stability" title="יציבות"/>
                            </Grid>
                        </div>
                        <div className='flexLeftGridRange'>
                            <Label>הצגת ערוצים מבוטלים</Label>
                            <ComboBox></ComboBox>
                            <br/>
                            <Label>אפשרויות כיול</Label>
                            <ComboBox></ComboBox>
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