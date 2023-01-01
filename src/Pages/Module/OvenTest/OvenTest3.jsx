import {React, useState} from 'react';
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Label } from "@progress/kendo-react-labels";
import { certificates } from '../../../data/certificates';
import { Button } from "@progress/kendo-react-buttons";
import { Input } from '@progress/kendo-react-inputs';
import ChannelsData from '../../../data/ChannelData.json';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { reportsActions } from '../../../store/reports-slice';
import './OvenTest3.css'
import OvenForm from '../../../components/Oven/OvenForm/OvenForm';
import SelectingDataSourceOfChannels from '../../../components/Oven/SelectingDataSourceOfChannels/SelectingDataSourceOfChannels';
import { ComboBox } from '@progress/kendo-react-dropdowns';

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
    const [existingReportsList, setExistingReportsList] = useState(["דוח חדש"]);
    const [ certificate, SetCertificate ] = useState({});
    const [ firstPage, SetFirstPage ] = useState(true);
 
    const [selected, setSelected] = useState(0);
    const [openDialogAddReport, setOpenDialogAddReport] = useState(false);
    const dispatch = useDispatch();

     
    const handleIndexPage = (e) => {
       
      if(firstPage && listReports.length === 0)
         showOrHideDialogAddReport();
 
        SetFirstPage(current => !current);
    };

    //tab click event
    const handleSelectTab = (e) => {
      
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
      <div style={{paddingRight: "15px", width: "100%",}} >
        {/* Menu of the top of the page  */}      
       
         
          <div style={{paddingTop: "15px", width: "100%",}}>
            <div className='flex-container'>
                { firstPage && 
                  <>
                     <SelectingDataSourceOfChannels></SelectingDataSourceOfChannels>
                  </>
                  }
                  <div>
                       <Button className='nextOrPrevBtn' onClick={handleIndexPage}>{firstPage ? "הבא": "הקודם"}
                           <span className={firstPage ? "k-icon k-i-arrow-chevron-left" : "k-icon k-i-arrow-chevron-right"}></span>
                       </Button> 
                  </div>
                  
            </div>
            <br/>
 
           {!firstPage &&
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
                                    <Label>
                                         מס תעודה<span className="required-field">*</span>
                                    </Label> 
                                    <Input style={{width: "150px",}}/>
                                </div>
                                <div className='detailItem'>
                                    <Label>בחירת דוח:</Label> 
                                    <ComboBox data={existingReportsList} style={{width: "150px",}} value={existingReportsList[0]}></ComboBox>&nbsp;
                                </div>
                                <div className='detailItem'>
                                    <Label>בחירת כלי המיועד לכיול<span className="required-field">*</span></Label> 
                                    <ComboBox data={["מאזניים אנליטים אלקטרונים", "ככ", "גג", "דד"]} allowCustom={true} style={{width: "250px",}}></ComboBox>&nbsp;
                                </div>
                             
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
  
       
      </div>
    );
}

export default OvenTest;