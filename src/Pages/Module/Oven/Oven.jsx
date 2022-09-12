import {React, useState} from 'react';
import OvenForm from '../../../components/Oven/OvenForm';
import { MultiColumnComboBox } from '@progress/kendo-react-dropdowns';
import { certificates } from '../../../data/certificates';
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import OvenRangeData from '../../../data/OvenRange.json';
import './Oven.css'

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



    
function Oven(props) {
    const [ form, setForm ] = useState({});
    const [ certificate, SetCertificate ] = useState({});
    const [ range, SetRange ] = useState({});

      //To update the state of form
    const setField = (field, value) => {
        setForm({...form, [field]: value})
    }

  

  
    return (
      <div className = 'p-oven'>
        <div className ='row'>
           <div className='leftcolumn'>
           <div className='card'>
                    <h2>בחר תעודה</h2>
                    <MultiColumnComboBox
                        data={certificates}
                        columns={columns}
                        textField={"certificateNum"} onChange={e=> (SetCertificate(e.value))}/>
                        <div className='divRange'>
                              <h4>תחומים</h4>
                              <Button themeColor={"primary"}>תחום חדש</Button>
                              <div className='divGridRange'>
                                    <Grid
                                          data={OvenRangeData}
                                          onRowClick={e=> (SetRange(e.dataItem))}>
                                          <GridColumn field="RangeName" title="שם"  />
                                          <GridColumn field="IntentionalValue" title="ערך מכוון" />
                                          <GridColumn field="Conclusion" title="מסקנה" />
                                    </Grid>
                              </div>
                        </div>
                </div>  
            </div>
            <div className='rightcolumn'>
              <OvenForm range={range}></OvenForm>
            </div>


        </div>
        </div>
    );
}

export default Oven;