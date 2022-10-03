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
        setPositionDialoug({marginTop: e.screenY, marginRight: e.screenX,});
      };

    return (
      <> <br/>
       <Button onClick={(e) => toggleDialog(e)} >הרחב גרף</Button>
       <Referenceline ranges = {ranges} updateRanges= {setRanges} width={700} height={290}/>
            {
                 visible && 
                (
                    <Window
                     title={"גרף תנורים"}
                     onClose={toggleDialog}
                     initialHeight={630}
                     initialWidth={1400}
                     style={positionDialoug}
                    
                    >
                        <Referenceline ranges = {ranges} updateRanges= {setRanges} width={950} height={500}/>
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