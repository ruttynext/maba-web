import {React, useState, useRef, useEffect} from 'react';
import { ComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import { Label } from "@progress/kendo-react-labels";
import { Input, NumericTextBox, Checkbox, TextArea } from '@progress/kendo-react-inputs';
import { Grid, GridColumn} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Calendar, DatePicker } from "@progress/kendo-react-dateinputs";
import { Popup } from "@progress/kendo-react-popup";
import { Document, Page, pdfjs  } from 'react-pdf';
import TemperuraData from '../../../data/temperura.json';
import './OvenForm.css'
import reportPdf from "./220837062.pdf";
//import HydraSelection from '../../../components/Oven/HydraSelection/HydraSelection';
import Ranges from '../../../components/Oven/Ranges/Ranges';
import SignWeb from '../../../components/SignForm/SignWeb';
import { Upload } from "@progress/kendo-react-upload";
import { DragDropContainer} from '../../../Utils/DraggableElementsHelper';

import ChannelsSelectionToForm from '../ChannelsSelectionToForm';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


 
  const CombboxCell = (props) => {

    return (
      <td>
        <ComboBox></ComboBox>
          
      </td>
    );
  };
  
  const RangeCell = (props) => {
    
    const [isDisplayFields, setIsDisplayFields] = useState(props.dataItem.Type === "טמפרטורה"? true : false);
    const [valueField1, setvalueFieldalueField1] = useState("");
    const [valueField2, setvalueFieldalueField2] = useState("");
    return (
      <td>
        <div className='flexControl'>
            <Checkbox value={isDisplayFields} onChange={(e)=>setIsDisplayFields(!isDisplayFields)}></Checkbox>
            <Input style={{width: "70px",}} disabled={!isDisplayFields} value={isDisplayFields ? valueField1 : ""} onChange={(e)=>setvalueFieldalueField1(e.value)}></Input>
            <Input style={{width: "70px",}} disabled={!isDisplayFields} value={isDisplayFields ? valueField2 : ""} onChange={(e)=>setvalueFieldalueField2(e.value)}></Input>
       </div>
      </td>
    );
  };
    


  
  /* Next Calibration Date control
    contains: combobox to select type format: 
        no - date is not enabled and will not be displayed in the report, month - Selection of date only, full date - Selection of full date. */
  const NextCalibrationDateContainer = (props) => {

    const TypesNextCalibrationDateItems = ["ללא", "חודש", "מלא"];
    const [ typeNextCalibrationDate, SetTypeNextCalibrationDate ] = useState(TypesNextCalibrationDateItems[2]);
    
   return (
    <div className='flex-container'>
        <ComboBox style={{width: "150px",}} 
              data={TypesNextCalibrationDateItems} 
              value={typeNextCalibrationDate}  
              onChange={(e) => (SetTypeNextCalibrationDate(e.value))}>                                    
        </ComboBox>&nbsp;
        <DatePicker 
            value={typeNextCalibrationDate !== TypesNextCalibrationDateItems[0] && new Date()} 
            disabled={typeNextCalibrationDate === TypesNextCalibrationDateItems[0]}
            format={typeNextCalibrationDate === TypesNextCalibrationDateItems[1] ? "MM/yyyy" : "dd/MM/yyyy"}
            calendar={typeNextCalibrationDate === TypesNextCalibrationDateItems[1] ? props => (
                    <Calendar
                        {...props}
                        style={{width: "30px",}}
                        // onChange={handleChange}
                        bottomView="year"
                        topView="decade"
                     />
            ) : ''}
        />  
    </div> 
   );
  };
  
  /* Customer Details */
  const CustomerDetailsContainer = () => {
    
    const [ customerAddress, SetCustomerAddress ] = useState("");
    const [ sameSiteAddress, SetSameSiteAddress ] = useState(true);
    const [ siteAddress, SetSiteAddress ] = useState("");
   
    return (
      <div className='divCustomerDetails'>
        <PanelBar>
          <PanelBarItem expanded={true} title="פרטי הלקוח">     
              <div className='divPanelBarItem2'>
                    <div className='detailItem'>
                        <Label>שם הלקוח:</Label>    
                        <ComboBox></ComboBox>
                    </div>
                    <div className='detailItem'>
                        <Label>כתובת הלקוח:</Label>    
                        <Input value={customerAddress}
                        onChange={(e)=>SetCustomerAddress(e.value)}></Input>
                    </div>
                    <div className='detailItem2'>                                  
                        <Label>כתובת האתר בו בוצע הכיול :</Label> 
                        <div className='flex-container'>
                            <Checkbox checked={sameSiteAddress}
                                      onChange={()=>SetSameSiteAddress(!sameSiteAddress)} label={" זהה לכתובת הלקוח?"}>
                            </Checkbox>&nbsp; 
                            <Input value={sameSiteAddress ? customerAddress : siteAddress}
                                      onChange={(e) => SetSiteAddress(e.value)}>
                            </Input>
                        </div>      
                    </div>                
              </div>        
          </PanelBarItem>
        </PanelBar>
      </div>
        
   );
  };
  
  /*  Details and signature of calibrate  */
  const CalibrateDetailsContainer = ({openSignForm, setOpenSignForm, calibratorSignature}) => {

  return (
     <div className='calibrate-Details'>
        <PanelBar>
            <PanelBarItem expanded={true} title="פרטי הכייל/מאשר">
                <div className='divPanelBarItem2'>
                    <div className='detailItem'>
                        <Label>שם העובד המכייל:</Label>    
                        <ComboBox></ComboBox>
                    </div>
                    <div className='detailItem'>
                        <Label></Label>
                        <div className='flex-container'>
                            <Button themeColor={"primary"} onClick={() => setOpenSignForm(true)}>חתימה</Button>&nbsp;
                            <div className='fieldImgSign'>
                                <img src={calibratorSignature ? "data:image/png;base64," + calibratorSignature : ''} className='img-sign' alt='' />
                            </div>                           
                        </div>    
                    </div>
                    <div className='flex-container'>
                          <div className='detailItem'>
                              <Label>שם מאשר התעודה:</Label>    
                              <ComboBox></ComboBox>
                          </div>
                          <div className='detailItem'>
                              <Label></Label>
                              <div className='flex-container'>
                                  <Button themeColor={"primary"} onClick={() =>setOpenSignForm(true)}>חתימה</Button>
                                  <Input></Input>
                              </div>    
                          </div>
                    </div>
                </div>   
            </PanelBarItem>
        </PanelBar>
     </div>      
    );
  };

  /* details of Environmental Conditions During Calibration  */
  const EnvironmentalConditionsDuringCalibrationContainer = () => {

    const [ showHumidity, SetShowHumidity ] = useState(false);  //לחות
    const [ showPressure, SetShowPressure ] = useState(false);  //לחץ
    
    return (
      <div className='divEnvironmentalconditions'>
        <PanelBar>
            <PanelBarItem expanded={true} title="תנאי סביבה בעת הכיול" selected={false}>                                  
                <div className='divPanelBarItem3'>
                  <div className='flex-container'>
                      <div className='detailItem'>
                          <Label>טמפרטורה:</Label>    
                          <ComboBox Date={["°C"]} value={"°C"}></ComboBox>
                      </div>
                      <div className='detailItem'>
                         <Label></Label> 
                         <div className='flex-container'>
                            <NumericTextBox style={{width: "70px",}}/>
                            <Label> +- </Label> 
                         </div>
                      </div>  
                       <div className='detailItem'>
                            <Label>טמפרטורה סביבה:</Label>
                            <NumericTextBox/>
                        </div>                          
                  </div>      

                  <div className='flex-container'>
                      <div className='detailItem'>
                          <Checkbox label={"לחות"} checked={showHumidity} onChange={() => SetShowHumidity(!showHumidity)}></Checkbox>   
                          <ComboBox disabled={!showHumidity}></ComboBox>&nbsp;
                      </div>
                      <div className='detailItem'>
                         <Label></Label> 
                         <div className='flex-container'>
                            <NumericTextBox style={{width: "70px",}} disabled={!showHumidity}/>
                            <Label> +- </Label> 
                         </div>
                      </div>  
                       <div className='detailItem'>
                            <Label>לחות סביבה:</Label>
                            <NumericTextBox disabled={!showHumidity}/>
                        </div>                         
                  </div> 
        
                  <div className='flex-container'>
                      <Checkbox label={"לחץ"} checked={showPressure} onChange={() => SetShowPressure(!showPressure)}></Checkbox>&nbsp;
                      <div className='detailItem'>
                          <Label>לחץ ברומטרי[mbar a]</Label>
                          <div className='flex-container'>
                              <NumericTextBox style={{width: "150px",}} disabled={!showPressure}/>&nbsp;
                              <Button themeColor={"primary"} disabled={!showPressure}>שינוי</Button>
                          </div> 
                      </div> 
                  </div>
                </div>     
            </PanelBarItem>
        </PanelBar>
    </div>      
   );
  };
  
  /* details of Calibration Ranges  */
  const CalibrationRangesContainer = (props) => {
   
    const CustomComboBoxCell = (props) => (
        <CombboxCell {...props}/>
    );

    const CustomRangeCell = (props) => {

      return(
        <RangeCell {...props}/>);
      };
      const gridWidth = 600;

      const setPercentage = (percentage) => {
        return Math.round(gridWidth / 100) * percentage;
      };
   return (
    <div className='divCalibrationAreas'>
      <PanelBar>
          <PanelBarItem expanded={true} title="תחומי כיול">
              <div className='divPanelBarItem'>
                  <div>
                      <Grid
                          data={TemperuraData}>
                              <GridColumn field="Type" title="סוג" width={setPercentage(20)}/>
                              <GridColumn field="MeasuringValue" title="ערך מדידה" cell={CustomComboBoxCell} width={setPercentage(20)}/>
                              <GridColumn field="Range" title="טווח מכשיר" cell={CustomRangeCell} width={setPercentage(30)} />  
                              <GridColumn field="Range" title="טווח כיול" cell={CustomRangeCell} width={setPercentage(30)}/>
                      </Grid>
                  </div>
              </div>
          </PanelBarItem>
      </PanelBar> 
    </div>  
   );
  };

  /* Device Details */
  const DeviceDetails = () => {
   
   return (
    <div className='divDeviceDetails'>
      <PanelBar>
        <PanelBarItem expanded={true} title="פרטי המכשיר המכוייל">
          <div className='divPanelBarItem2'>
            
                <div className='detailItem'>
                      <Label>זיהוי הפריט המכוייל:</Label>    
                      <ComboBox></ComboBox>
                  </div>
                  <div className='detailItem'>
                      <Label>תוצרת:</Label>    
                      <ComboBox></ComboBox>
                  </div>
                  <div className='detailItem'>
                      <Label>דגם:</Label>    
                      <Input></Input>
                  </div>
                  <div className='detailItem'>
                      <Label>מספר סידורי:</Label>    
                      <Input></Input>
                  </div>
                  <div className='detailItem'>    
                      <Checkbox label={"נפח"}></Checkbox>  
                      <div className='flex-container'>
                          <Input style={{width: "50px",}}></Input>&nbsp;
                          <Button themeColor={"primary"}>חישוב</Button>
                      </div>      
                  </div>
                  <div className='detailItem'>
                      <Label>תאריך כיול:</Label>    
                      <DatePicker style={{width: "30px",}} defaultValue={new Date()} format="dd/MM/yyyy"></DatePicker>
                  </div>
                  <div className='detailItem'>
                      <Label>תאריך כיול הבא:</Label>
                      <NextCalibrationDateContainer/> 
                  </div>
           
           
              <div className='detailItem'>                                   
                    <Label>הערות לדוח:</Label> 
                    <div className='flex-container'>
                        <DropDownList style={{width: "250px",}}></DropDownList>&nbsp;
                        <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                    </div>      
                </div>
                <div className='detailItem'>    
                    <Label>תיאור הפריט ומצבו:</Label> 
                    <div className='flex-container'>
                        <DropDownList style={{width: "250px",}}></DropDownList>&nbsp;
                        <Button icon="plus" themeColor={"primary"}>הוספה</Button>
                    </div>      
                </div>
           

             

          </div>
        </PanelBarItem>
      </PanelBar>

    </div>
   );
  };

  const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
  };

  /* container to display report draft */
  const DispalyReportContainer = () => {
    
    const [displayReport, setDisplayReport] = useState(false);
    const [file, setFile] = useState(reportPdf);
    const [numPages, setNumPages] = useState(null);

    const hundleDisplayReport = () =>{
      setDisplayReport(current => !current);

    };
      
    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
      setNumPages(nextNumPages);
    } 

    function loadError(error) {
      console.log(error.message);           
    }
    
  return (
    <>
    <div className='viewReport'>
          <div className='btnViewReport'>
              <Button onClick={hundleDisplayReport} themeColor={"info"}>
                   <span className={displayReport ? "k-icon k-i-arrow-60-down" : "k-icon k-i-arrow-60-up"}></span> 
                   {displayReport ? "הסתר דוח" : " הצג דוח"  }
              </Button>
          </div>
    </div> 
      {
          displayReport ? 
          <div className='viewReportDialoug'>
              <div>
                  <div className='Div-close-view-report-dialoug'>
                      <Button onClick={(e) => setDisplayReport(false)} themeColor={"info"}>
                        <span className="k-icon k-i-close"></span>
                       </Button>                     
                  </div>                    
                  <div>
                      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options} onLoadError={loadError} loading={<h1>טוען      </h1>}>
                              {Array.from(new Array(numPages), (el, index) => (
                              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                              ))}     
                      </Document>
                  </div>         
              </div>
        </div> : ""
      }
    </>
  );
  };


  /* returns array of elements to drag and drop */
  const generateElements = (openSignForm, setOpenSignForm, calibratorSignature, form) => {
  
    return(
      [
         {
           id: 0,
           elements: [
             {id: "0", content: <ChannelsSelectionToForm form={form}/>},
                     {id: "1", content: <DeviceDetails/>}]
         },
         {
           id: 1,
           elements: [{id: "2", content: <CustomerDetailsContainer/>},
                     {id: "3", content: <CalibrateDetailsContainer openSignForm={openSignForm} setOpenSignForm= {setOpenSignForm} calibratorSignature={calibratorSignature}/> }]
         },
        {
          id: 2,
          elements: [{id: "4", content: <CalibrationRangesContainer/>},
                    {id: "5", content: <EnvironmentalConditionsDuringCalibrationContainer/>}
                ]
        }
      ]);
  };

function OvenForm({form}) {

    const [openSignForm, setOpenSignForm] = useState(false);
    const [calibratorSignature, SetCalibratorSignature] = useState("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");
    const [elements, setElements] = useState(generateElements(openSignForm, setOpenSignForm, calibratorSignature, form));
    const [showPopUpReports, setShowPopUpReports] = useState(false);
    const [clickBtnOpenPopUp, setClickBtnOpenPopUp] = useState(false);
    const anchor = useRef(null);
    
    const openPopUpDisplayReport = () =>{
     
      if(!showPopUpReports)
         setClickBtnOpenPopUp(true);

      setShowPopUpReports(!showPopUpReports);
    }

    const sigImageCallback = (str) => {
      SetCalibratorSignature(str);
    };
    
    useEffect(() => {
      document.addEventListener("click", closePopUpDisplayReport); //On a left click event
      return () => {
        document.removeEventListener("click", closePopUpDisplayReport);
      };
    });

    const closePopUpDisplayReport =() =>{
      
      if(!clickBtnOpenPopUp && showPopUpReports)
         setShowPopUpReports(false);

      setClickBtnOpenPopUp(false);
    };

    return (
        <div style={{ width: "100%",}}>
            {/* Display Report button*/}
            
            <div className='viewCreateReport'>
                      <Button themeColor={"success"}>הנפק דוח</Button>
            </div>  
            <DispalyReportContainer></DispalyReportContainer> 
 
            <button icon="folder" onClick={openPopUpDisplayReport} ref={anchor} className={"k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"}>
                 הצגת דוחות קודמים
            </button> 
           
            <Popup show={showPopUpReports} popupClass={"popup-content"} anchor={anchor.current}>
                 <Button icon="pdf" themeColor={"primary"} fillMode="link">
                       <a href={reportPdf} target="_blank" rel="noreferrer">דווח 1 </a>
                  </Button>
                 <Button icon="pdf" themeColor={"primary"} fillMode="link">
                    <a href={reportPdf} target="_blank" rel="noreferrer">דוח 2</a>
                 </Button>  
            </Popup> 
              {/* container of all elements to drag and drop */}
             <DragDropContainer elements={elements} setElements={setElements} 
                style={{display: "flex", flexDirection : "column", margin: "5px 5px 5px 5px", width: "100%",}}>
              </DragDropContainer> 
              <br/>
              <div className='divRanges'>
                    <PanelBar>
                        <PanelBarItem expanded={true} title="תחומים">
                          <br/>
                          <Ranges></Ranges>
                        </PanelBarItem>
                    </PanelBar>
              </div> 
              <div className='calibrated-notes'>
                    <div className='detailItem'>                                   
                        <Label>הערות כייל:</Label>     
                          <div className='flex-container'>
                            <Checkbox></Checkbox>להציג&nbsp;בדוח  
                            &nbsp;
                            <TextArea></TextArea>
                          </div>      
                    </div> 
                    <div className='detailItem'> 
                       {/* Appendices -> Attaching documents to the report  */}
                          <Label>נספחים:</Label>
                          <Upload
                            selectMessageUI={() => "צרף קבצים"}
                            batch={false}
                            multiple={true}
                            defaultFiles={[]}
                            withCredentials={false}
                            saveUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/save"}
                            removeUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/remove"}
                          />  
                    </div>
              </div>
            
           {/* Opening a digital signature dialog */}
            {openSignForm && (
                 <SignWeb signData={calibratorSignature} parentCallback={ sigImageCallback } closeSignWeb={() =>setOpenSignForm(false)}></SignWeb>
         
          )} 
       </div>
    );
}

export default OvenForm