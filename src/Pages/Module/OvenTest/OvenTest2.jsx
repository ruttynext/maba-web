import {React, useState} from 'react';
import { ComboBox, MultiColumnComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import { certificates } from '../../../data/certificates';
import { Label } from "@progress/kendo-react-labels";
import { Input, NumericTextBox, Checkbox } from '@progress/kendo-react-inputs';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { DatePicker } from "@progress/kendo-react-dateinputs";


// Core viewer
import { Viewer } from '@react-pdf-viewer/core';

import CalcalateRangesData from '../../../data/CalcalateRangesData.json';
import ChannelsData from '../../../data/channelsData.json';
import TemperuraData from '../../../data/temperura.json';
import OvenRangeData from '../../../data/OvenRange.json';
import HydraData from '../../../data/HydraData.json';
import './OvenTest2.css'
import Referenceline from '../../../components/referenceline/referenceline';
import { Container } from 'react-bootstrap';

const columns = [
    {
      field: "certificateNum",
      header: "מס התעודה",
      width: "100px",
    },
    {
      field: "identifyCalibratedItem",
      header: "זיהוי הפריט המכוייל",
      width: "300px",
    },
    {
      field: "serialNo",
      header: "מס סידורי",
      width: "300px",
    },
  ];

  const CheckboxCell = (props) => {

    return (
      <td>
          <Checkbox defaultChecked={Boolean(props.dataItem.Active)} />
      </td>
    );
  };

  const CombboxCell = (props) => {

    return (
      <td>
        <ComboBox></ComboBox>
          
      </td>
    );
  };
  
  const RangeCell = (props) => {

    return (
      <td>
        <div className='flexControl'>
       <Checkbox></Checkbox>
       <Input></Input>
       <Input></Input>
       </div>
      </td>
    );
  };
  
  const DeleteRange = (props) => {

    return (
      <td>
        <Button>מחיקה</Button>
      </td>
    );
  };

function OvenTest(props) {

    const [ certificate, SetCertificate ] = useState({});

    const MyCheckBoxCell = (props) => (
        <CheckboxCell {...props}/>
      );

      const MyComboBoxCell = (props) => (
        <CombboxCell {...props}/>
      );

      const MyRangeCell = (props) => (
        <RangeCell {...props}/>
      );
      
      const MyDeleteRange = (props) => (
        <DeleteRange {...props}/>
      );
     
      const [selected, setSelected] = useState(1);

      const handleSelect = (e) => {
        setSelected(e.selected);
      };

    return (
        <>
         <div className='flexControl'>
                <div > 
                    <Label>מס תעודה</Label> 
                    <MultiColumnComboBox
                                data={certificates}
                                columns={columns}
                                textField={"certificateNum"} onChange={e=> (SetCertificate(e.value))}/>
                </div>
                <div> 
                    <Label>הידרה:</Label>    
                    <Input></Input>
                </div>
          </div>
          <div className='tabStripDiv'>
          <TabStrip selected={selected} onSelect={handleSelect}>
            <TabStripTab title="טאב 1">
                <div>
                <Grid
                    data={HydraData}
                    style={{width: "50%",}}>
                    <GridColumn field="HydraDegem" title="דגם הידרה" />
                    <GridColumn field="Comment" title="הערות" />
                    </Grid>  
                </div>
                <Button className='nextBtn'>הבא</Button>
        </TabStripTab>
        <TabStripTab title="הגדרות כלליות">
            <Container>
                <div className="container-channels">
                   <h5>בחירת ערוצים</h5>
                </div>
                <div className='flexControl'>
                  <Grid data={ChannelsData} >
                    <GridColumn field="Id" title="#" />
                    <GridColumn field="Units" title="יחידות" />
                    <GridColumn field="MabaNum" title="מס מבא" />
                    <GridColumn field="Ragash" title="רגש" />
                    <GridColumn field="channel" title="ערוץ" />
                    <GridColumn field="Active" title="ערוץ פעיל" cell={MyCheckBoxCell}/>  

                    </Grid>
                    <div className='arrowsChannels'>
                            <Button icon='arrow-60-up'></Button> 
                            <Button icon='arrow-60-down'></Button>
                    </div>
                    
                </div>
                <div className='flexrow'>
                        <div className='flexcolumn'>
                            <div className="container-channels">
                            <h5>פרטי הלקוח</h5>
                            </div>
                            <div className='flexControl'>
                                <div>
                                    <Label>שם הלקוח:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                                <div>
                                    <Label>כתובת הלקוח:</Label>    
                                    <Input></Input>
                                </div>
                            </div>
                            <div>
                                <Label>כתובת האתר בו בוצע הכיול :</Label>    
                                <Input></Input>
                            </div>
                        </div>
                        <div className='flexcolumn'>
                            <div className="container-channels">
                                <h5>פרטי הכייל/מאשר</h5>
                            </div>
                            <div className='flexControl'>
                                <div>
                                    <Label>שם העובד המכייל:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                                <div >
                                    <Label>חתימה:</Label>    
                                    <div className='flexControl'>
                                        <Input></Input>&nbsp;
                                        <Button themeColor={"primary"}>חתימה</Button>
                                    </div>
                                </div>
                            </div>
                            <div className='flexControl'>
                                <div>
                                    <Label>שם מאשר התעודה:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                                <div>
                                    <Label>חתימת מאשר התעודה:</Label>    
                                    <div className='flexControl'>
                                        <Input></Input>&nbsp; 
                                        <Button themeColor={"primary"}>חתימה</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                
                    <div className="container-channels">
                          <h5>פרטי המכשיר המכוייל</h5>
                    </div>
                    <div className='flexrow'>
                        <div className='flexcolumn'>
                            <div className='flexControl'>
                                <div>
                                    <Label>זיהוי הפריט המכוייל:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                                <div>
                                    <Label>תוצרת:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                            </div>
                            <div className='flexControl'>
                                <div>
                                    <Label>דגם:</Label>    
                                    <Input></Input>
                                </div>
                                <div>
                                    <Label>מספר סידורי:</Label>    
                                    <Input></Input>
                                </div>
                            </div>
                        
                            <div className='flexControl'>
                                <div>
                                        <div className='flexControl'>
                                            <Checkbox></Checkbox>  
                                            <Label>נפח:</Label> 
                                        </div> 
                                        <div className='flexControl'>
                                            <Input style={{width: "50%",}}></Input>&nbsp; 
                                            <Button themeColor={"primary"} >חישוב</Button>
                                        </div>
                                </div> 
                                <div>
                                        <Label>מיפוי רגשים:</Label> 
                                        <div className='flexControl'>
                                            <Input style={{width: "50%",}}></Input>   
                                            <Button themeColor={"primary"} >עיצוב</Button>
                                        </div>
                                </div>                                  
                            </div>
                        </div>
                        <div className='flexcolumn'>
                            <div>
                                <Label>תיאור הפריט ומצבו:</Label> 
                                <div className='flexControl'>    
                                    <DropDownList></DropDownList> &nbsp;
                                    <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                                </div>
                            </div>
                            <div>
                                <Label>הערות לדוח:</Label> 
                                <div className='flexControl'>    
                                    <DropDownList></DropDownList> &nbsp;
                                    <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                                </div>
                            </div>
                            <div className='flexControl'>
                                <div>
                                    <Label>תאריך כיול:</Label> 
                                    <DatePicker></DatePicker> 
                                </div>
                                <div>
                                    <Label>תאריך כיול הבא:</Label> 
                                    <DatePicker></DatePicker> 
                                </div>
                            </div>
                            
                        </div>

                </div>



                <div className='flexrow'>
                        <div className='flexRightTemperturacolumn'>
                            <div className="container-channels">
                                <h5>תחומי כיול</h5>
                            </div>
                            <div className='divTemperura'>
                            <Grid
                                data={TemperuraData}>
                                    <GridColumn field="Type" title="סוג" width={"100px"}/>
                                    <GridColumn field="MeasuringValue" title="ערך מדידה" cell={MyComboBoxCell} width={"100px"}/>
                                    <GridColumn field="Range" title="טווח מכשיר" cell={MyRangeCell} />  
                                    <GridColumn field="Range" title="טווח כיול" cell={MyRangeCell} />
                            </Grid>
                            </div>
                        </div>
                        <div className='flexLeftTemperturacolumn'>
                            <div className="container-channels">
                                <h5>תנאי סביבה בעת הכיול:</h5>
                            </div>
                            <div className='flexControl'>                 
                                <div>
                                    <Label>טמפרטורה:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                                <div>
                                    <Label>טמפרטורה סביבה:</Label>  
                                    <div className='flexControl'>
                                        <NumericTextBox style={{width: "50%",}}/>
                                        <Label> +- </Label> 
                                        <NumericTextBox style={{width: "50%",}}/>
                                    </div>
                                </div>
                            </div>
                            <div className='flexControl'>                 
                                <div>
                                    <Label>לחות:</Label>    
                                    <ComboBox></ComboBox>
                                </div>
                                <div>
                                    <Label>הצג</Label>  
                                
                                    <div className='flexControl'>
                                    <Checkbox></Checkbox>
                                        <NumericTextBox style={{width: "50%",}}/>
                                        <Label> +- </Label> 
                                        <NumericTextBox style={{width: "50%",}}/>
                                    </div>
                                </div>
                        </div>
                        <div className='flexControl'>                 
                                <div>
                                    <Label>לחץ:</Label>       
                                </div>
                                <div>
                                    <Label>הצג</Label> 
                                    <Checkbox></Checkbox> 
                                </div>
                                <div>
                                <Label>לחץ ברומטרי[mbar a]</Label> 
                                    <div className='flexControl'> 
                                        <NumericTextBox style={{width: "50%",}}/>&nbsp;
                                        <Button themeColor={"primary"}>שינוי</Button>
                                    </div>
                                </div>
                        </div>
                        </div>
                </div>

                </Container>
            {/* <div className='flexcolumn'>

            </div> */}
         </TabStripTab>
         <TabStripTab title="תחומים">
                <div className ='flexrow'>
                    <div className='flexRightcolumn'>
                        <div>
                            
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
                    </div>
                    <div className='flexMiddlecolumn'>
                        <div className="container-channels">
                            <h5>נתונים כללים בתחום</h5>
                        </div>
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
                                    <DropDownList style={{width: "70%",}}></DropDownList>&nbsp;
                                    <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                                </div>
                        </div>
                        <div className="container-channels">
                            <h5>הגדרת חישובים</h5>
                        </div>
                        <div>
                            <Button>הרחב גרף</Button>
                            <Referenceline/>
                        </div>
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
                    {/* <div className='flexcolumn'>
                        <Viewer fileUrl='../../../assets/2208370-6 (1).pdf'/>
                    </div> */}

                </div>
         </TabStripTab>
        </TabStrip>
        </div>

       </>
    );
}

export default OvenTest;