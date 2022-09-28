import {React, useState} from 'react';
import { ComboBox, MultiColumnComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import { certificates } from '../../../data/certificates';
import { Label } from "@progress/kendo-react-labels";
import { Input, NumericTextBox, Checkbox } from '@progress/kendo-react-inputs';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Window } from "@progress/kendo-react-dialogs";
import CalcalateRangesData from '../../../data/CalcalateRangesData.json';
import ChannelsData from '../../../data/channelsData.json';
import TemperuraData from '../../../data/temperura.json';
import OvenRangeData from '../../../data/OvenRange.json';
import HydraData from '../../../data/HydraData.json';
import './OvenTest3.css'
import Referenceline from '../../../components/referenceline/referenceline';
import SignWeb from '../../../components/SignForm/SignWeb';

import ReportOvenImage from "./ReportOvenImage.PNG";
//import { Document, Page } from 'react-pdf';

// Core viewer



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
  
  const ReferanceLineContainer = (props) => {
    const [ranges, setRanges] = useState([]);
    const [visible, setVisible] = useState(false);
    const [positionDialoug, setPositionDialoug] = useState({});
   
    const toggleDialog = (e) => {
        setVisible(!visible);
        console.log(e.screenY);
        console.log(e.screenX);
        setPositionDialoug({marginTop: e.screenY, marginRight: e.screenX,});
      };

    return (
      <> <br/>
       <Button onClick={(e) => toggleDialog(e)} >הרחב גרף</Button>
        <Referenceline ranges = {ranges} updateRanges= {setRanges} width={700} height={290}/>
            {visible && 
            (
                <Window
                title={"גרף תנורים"}
                onClose={toggleDialog}
                initialHeight={630}
                initialWidth={1150}
                style={positionDialoug}
                
                >
                  <Referenceline ranges = {ranges} updateRanges= {setRanges} width={950} height={500}/>
                </Window>
            )
            }
      </>
    );
  };

    const DispalyReportContainer = (props) => {
        const [displayReport, setDisplayReport] = useState(false);
        
        const hundleDisplayReport = () =>{
            setDisplayReport(current => !current);

          };
        
    return (
      <>
       <div className='viewReport'>
            <div className='btnViewReport'>
                <Button onClick={hundleDisplayReport} themeColor={"info"}><span className={displayReport ? "k-icon k-i-arrow-60-down" : "k-icon k-i-arrow-60-up"}></span> 
                {displayReport ? "הסתר דוח" : " הצג דוח"  }</Button>
             </div>
       </div> 
        {
            displayReport ? 
            <div className='viewReportDialoug'>
                <div>
                    <div className='Div-close-view-report-dialoug'>
                        <Button onClick={(e) => setDisplayReport(false)} themeColor={"info"}><span className="k-icon k-i-close"></span></Button>                     
                    </div>
                    <img src={ReportOvenImage}/> 
                </div>
           </div> : ""
        }
      </>
    );
  };

function OvenTest(props) {

    const [ certificate, SetCertificate ] = useState({});
    const [ firstPage, SetFirstPage ] = useState(true);
    const [calibratorSignature, SetCalibratorSignature] = useState("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");
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


      const handleIndexPage = (e) => {
        SetFirstPage(current => !current);
      };
      const [openSignForm, setOpenSignForm] = useState(false);
      const handleCancelSignForm = () => {
        setOpenSignForm(false);
      };
  
      const OpenSignForm = () =>{
        setOpenSignForm(true);
      }
  
      function SigImageCallback1(str) {
        SetCalibratorSignature(str);
      }
 
    return (
        <>
         <div className='divPanelBarItem'>
            <div className='flexControl'>
                    <div> 
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
                <Button className='nextOrPrevBtn' onClick={handleIndexPage}>{firstPage ? "הבא": "הקודם"}
                        <span className={firstPage ? "k-icon k-i-arrow-chevron-left" : "k-icon k-i-arrow-chevron-right"}></span>
                </Button> 
                <div className='viewCreateReport'>
                       <Button themeColor={"success"}>הנפק דוח</Button>
                </div>
            </div>
          </div>
             {/* Display Report button*/}
           <DispalyReportContainer></DispalyReportContainer>   

           {
             firstPage ?
                <div className='divPanelBarItem'>
                   <br/>
                    <div>
                        <Grid
                            data={HydraData}
                            style={{width: "50%",}}>
                            <GridColumn field="HydraDegem" title="דגם הידרה" />
                            <GridColumn field="Comment" title="הערות" />
                        </Grid>  
                    </div>
              </div> :
     
            <div className='tabStripDiv'>
            <div className='flexrow'>
           
                 {/* channel selection div */}
                <div className='divChooseChannelsCol'>       
                    <PanelBar>
                        <PanelBarItem expanded={true} title="בחירת ערוצים">
                             <div className='divPanelBarItem'>
                                <div className='flexControl'>
                                        <Grid data={ChannelsData} >
                                            <GridColumn field="Id" title="#" />
                                            <GridColumn field="Units" title="יחידות" />
                                            <GridColumn field="MabaNum" title="מס מבא" />
                                            <GridColumn field="Ragash" title="רגש" />
                                            <GridColumn field="channel" title="ערוץ" />
                                            <GridColumn field="Active" title="ערוץ פעיל" cell={MyCheckBoxCell}/>  

                                            </Grid>
                                            <div>
                                                    <Button icon='arrow-60-up'></Button> 
                                                    <Button icon='arrow-60-down'></Button>
                                            </div>
                                        
                                    </div>
                                </div>
                        </PanelBarItem>
                    </PanelBar>
                </div>
                
                {/* Device details div */}
                <div className='divDeviceDetails'>
                    <PanelBar>
                        <PanelBarItem expanded={true} title="פרטי המכשיר המכוייל">
                         <div className='divPanelBarItem'>
                            <div className='flexrow'>
                                    <div>
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
                                                        <Input></Input>&nbsp; 
                                                        <Button themeColor={"primary"} >חישוב</Button>
                                                    </div>
                                            </div> 
                                            <div>
                                                    <Label>מיפוי רגשים:</Label> 
                                                    <div className='flexControl'>
                                                        <Input ></Input>   
                                                        <Button themeColor={"primary"} >עיצוב</Button>
                                                    </div>
                                            </div>                                  
                                        </div>
                                    </div>
                                    <div>
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
                          </div>
                        </PanelBarItem>
                </PanelBar>
                </div>
            </div><br/>
                <div className='flexrow'>
                    <div className='flexcolumn'>

                        {/*costumer details div */}
                        <PanelBar>
                          <PanelBarItem expanded={true} title="פרטי הלקוח">
                            <div className='divPanelBarItem'>
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
                                </div><br/>
                            </div>
                          </PanelBarItem>
                       </PanelBar>
                  </div>
                
                  <div className='flexcolumn'>  
                  {/* Calibration details Div */}
                    <PanelBar>
                        <PanelBarItem expanded={true} title="פרטי הכייל/מאשר">
                            <div className='divPanelBarItem'>
                                <div className='flexControl'>
                                        <div>
                                            <Label>שם העובד המכייל:</Label>    
                                            <ComboBox></ComboBox>
                                        </div>
                                        <div>
                                            <Label>חתימה:</Label>
                                             <div className='flexrow'>
                                                    <div className='flexcolumn'>
                                                       <Button themeColor={"primary"} onClick={OpenSignForm}>חתימה</Button>
                                                    </div>
                                                    <div className='flexcolumn'>
                                                      <img src={calibratorSignature ? "data:image/png;base64," + calibratorSignature : ''} className='img-sign' alt='' /> &nbsp;
                                                   </div>   
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
                        </PanelBarItem>
                    </PanelBar>
                            

                  </div>
                </div><br/>
                
                <div className='flexrow'>
                    {/* Calibration areas */}
                        <div className='divCalibrationAreas'>
                            <PanelBar>
                                <PanelBarItem expanded={true} title="תחומי כיול">
                                    <div className='divPanelBarItem'>
                                        <div>
                                            <Grid
                                                data={TemperuraData}>
                                                    <GridColumn field="Type" title="סוג" width={"100px"}/>
                                                    <GridColumn field="MeasuringValue" title="ערך מדידה" cell={MyComboBoxCell} width={"100px"}/>
                                                    <GridColumn field="Range" title="טווח מכשיר" cell={MyRangeCell} />  
                                                    <GridColumn field="Range" title="טווח כיול" cell={MyRangeCell} />
                                            </Grid>
                                        </div>
                                    </div>
                                </PanelBarItem>
                            </PanelBar>
                          
                        </div>

                        {/* Environmental conditions during calibration */}
                        <div className='divEnvironmentalconditions'>
                            <PanelBar>
                                <PanelBarItem expanded={true} title="תנאי סביבה בעת הכיול" selected={false}>
                                    <div className='divPanelBarItem'>
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
                            </PanelBarItem>
                          </PanelBar>
                       </div>
                </div>
                <br/>
                <div className='divRanges'>
                    <PanelBar>
                        <PanelBarItem expanded={true} title="תחומים">
                          <br/>
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
                        </PanelBarItem>
                    </PanelBar>
                 </div>
                </div>
              }  
           {/* Opening a digital signature dialog */}
           {openSignForm && (
                 <SignWeb signData={calibratorSignature} parentCallback={ SigImageCallback1 } closeSignWeb={handleCancelSignForm}  ></SignWeb>
         
          )}
        
        
       </>
    );
}

export default OvenTest;