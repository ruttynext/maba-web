import {React, useState} from 'react';
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { ComboBox, MultiColumnComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import { Label } from "@progress/kendo-react-labels";
import { certificates } from '../../../data/certificates';
import { Button } from "@progress/kendo-react-buttons";
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import reportPdf from "./220837062.pdf";
import { Document, Page, pdfjs  } from 'react-pdf';
import ChannelsData from '../../../data/ChannelData.json';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { reportsActions } from '../../../store/reports-slice';
import './OvenTest3.css'
import OvenForm from '../../../components/Oven/OvenForm/OvenForm';
import ChannelsSelection from '../../../components/Oven/ChannelsSelection/ChannelsSelection';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

  const Title = (props) => {

    return (
      <div >
        <div style={{height: "5px", background: "#" + props.color,}}></div>
        <div>
              
        {props.content}
         <span className="k-spacer" /> 
        <span
          className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base k-icon-button"
          onClick={() => props.onTabRemove(props.content)}
        >
          <span />
          <span className="k-icon k-i-x" />
        </span>
      
      </div>
      </div>
    );
  };
  
  function OvenTest(props) {
    
    const listReports = useSelector((state) => state.reportsData.reportsDataList);

    const [ certificate, SetCertificate ] = useState({});
    const [ firstPage, SetFirstPage ] = useState(true);
    const [openCheannelsSelectionDialog, setOpenCheannelsSelectionDialog] = useState(false);
    const [selected, setSelected] = useState(0);
    const [openDialogAddReport, setOpenDialogAddReport] = useState(false);

    const dispatch = useDispatch();

     
    const handleIndexPage = (e) => {
        SetFirstPage(current => !current);
    };

    //tab click event
    const handleSelectTab = (e) => {
      
      console.log("handleSelectTab" + e.selected);
      //Click on create a new tab
      if(listReports.length === e.selected)
      {
         setOpenDialogAddReport(!openDialogAddReport);
      }

        setSelected(e.selected);
    };

    const createNewReport = ()=> {
    
      dispatch(reportsActions.addNewReport(
                 { item: { id: listReports.length,
                  formName:  "דוח " + (parseInt(listReports.length) + 1), 
                  color: Math.random().toString(16).substr(-6) } 
        }));
    
      setOpenDialogAddReport(!openDialogAddReport);
        
    }

    const showOrHideDialogAddReport = () =>
    {
         setOpenDialogAddReport(!openDialogAddReport);
    };

    //remove Tab event
    const removeTab = (tab) => {

      dispatch(reportsActions.removeReports({ formName: tab }));

    };

   
    return (
      <div style={{paddingRight: "15px",}}>
        {/* Menu of the top of the page  */}      
        <>
          <div className='flex-container'>
            <div className='detailItem'> 
                <Label>מס תעודה</Label> 
                <MultiColumnComboBox
                  data={certificates}
                  columns={columns}
                  textField={"certificateNum"} onChange={e=> (SetCertificate(e.value))}/>
            </div>
            {/* <div className='detailItem'>
                <Label>קצב דגימה (דקות):</Label>
                <NumericTextBox style={{width: "70%",}}/>
            </div> */}
            <Button onClick={() => setOpenCheannelsSelectionDialog(true)}>בחירת ערוצים מאוגר נתונים</Button> &nbsp;
            <Button className='nextOrPrevBtn' onClick={handleIndexPage}>{firstPage ? "הבא": "הקודם"}
                <span className={firstPage ? "k-icon k-i-arrow-chevron-left" : "k-icon k-i-arrow-chevron-right"}></span>
            </Button>
            <div className='viewCreateReport'>
                  <Button themeColor={"success"}>הנפק דוח</Button>
            </div>
          </div>
        </>
        {/* Display Report button*/}
        <DispalyReportContainer></DispalyReportContainer>   
          <div style={{paddingTop: "15px",}}>
            {firstPage ? 
              <>
                 {/* <HydraSelection></HydraSelection> */}
                
              </> :
              <>  
              {
                 listReports.length > 0 ?
                <TabStrip selected={selected} onSelect={handleSelectTab}>
                  { 
                    listReports.map((item, index) => 
                    {  
                        return(       
                            <TabStripTab title={<Title content={item.formName} onTabRemove={removeTab} color={item.color} />}>
                                  <OvenForm form={item}/>    
                            </TabStripTab>) 
                    })
                  }
                   
                   <TabStripTab title={"דוח חדש + "}/>
                   
                </TabStrip> : <Button onClick={showOrHideDialogAddReport}>דוח חדש</Button>
              }
              {
                  //view dialoug that add text new report
                  openDialogAddReport && (
                            <Dialog title={"דוח חדש"} onClose={showOrHideDialogAddReport} >
                               <div className='flex-container'>
                                <div  className='detailItem'>
                                    <Label>מס תעודה</Label> 
                                    <Input style={{width: "150px",}}/>
                                </div>
                                <div className='detailItem'>
                                    <Label>בחירת כלי המיועד לכיול</Label> 
                                    <div className='flex-container'>
                                        <DropDownList data={["מאזניים אנליטים אלקטרונים", "ככ", "גג", "דד"]} style={{width: "250px",}}></DropDownList>&nbsp;
                                        <Button  icon="plus" themeColor={"primary"}>הוספה</Button>
                                    </div>
                                    
                                </div>
                             
                                </div>    <br/>
                                <Label>אופן קבלת נתונים</Label> 
                                <div className='flex-container'>
                                    <ComboBox data={["הידרה", "ערוצים מתוך הקלטה שמורה/ אקסל/ הידרות אלחוטיות/ קובץ לוג "]} style={{width: "350px",}}></ComboBox>

                                </div>  
                                
                              <DialogActionsBar>
                                <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={showOrHideDialogAddReport}>ביטול</button>
                                <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={createNewReport}>אישור</button>
                              </DialogActionsBar>
                            </Dialog>
                          )
              }
              </>
            } 
       </div>
       {
          openCheannelsSelectionDialog && 
      
             <ChannelsSelection closeDialog={() => setOpenCheannelsSelectionDialog(false)}></ChannelsSelection>
         
       }
      </div>
    );
}

export default OvenTest;