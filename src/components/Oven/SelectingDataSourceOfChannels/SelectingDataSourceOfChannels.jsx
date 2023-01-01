import React from 'react';
import { useSelector} from 'react-redux';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { Label } from "@progress/kendo-react-labels";
import {  Checkbox, Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { Card, CardTitle, CardSubtitle, CardActions } from '@progress/kendo-react-layout';
import { ListView } from '@progress/kendo-react-listview';
import { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import './SelectingDataSourceOfChannels.css'

const DataHydraItem = props => {
    let item = props.dataItem;
    const [samplingRate, setSamplingRate] = useState(3);
    const [activeHydra, setActiveHydra] = useState(item.active);

    return <Card 
     style={{padding: '15px 15px',border: 'none',borderBottom: '1px solid rgba(0,0,0,0.12)',}} 
     //orientation='horizontal' className='d-flex justify-content-between'
       >
          <div className='k-vbox k-column'>
            <div style={{padding: '0 8px', marginRight: '3rem'}}>
              <CardTitle style={{fontSize: 18, fontWeight:"bold",}}>
                <Checkbox value={activeHydra} onChange={(e) => setActiveHydra(e.value) }></Checkbox> {item.hydraNumber}
              </CardTitle>
              <CardSubtitle  style={{fontSize: 16}}>
                <div >
                    <div className="col-40">
                       <Label>תאריך כיול:</Label>
                    </div>
                    <div className="col-60">
                        <Input value={item.calibrationDate} style={{ textAlign: "center", width: "120px",}}></Input>
                    </div>
                </div>
                 <div>
                    <div className="col-40">
                       <Label>תקף עד:</Label>
                    </div>
                    <div className="col-60">
                        <Input value={item.calibrationDate} style={{ textAlign: "center", width: "120px",}}></Input>
                    </div>
                </div>
                <div>
                    <div className="col-40">
                         <Label>סטטוס:</Label>
                    </div>
                    <div className="col-60">
                         <Input value={item.status} style={{background: "#90ee90", textAlign: "center", width: "70px"}}></Input>
                    </div>
                </div>
                <div>
                    <div className="col-40">
                         <Label>קצב דגימה:</Label>
                    </div>
                    <div className="col-60">
                         <NumericTextBox value={samplingRate} onChange={(e) =>setSamplingRate(e.value)} style={{width: "90px", textAlign: "center",}}/>
                    </div>
                </div> 
              </CardSubtitle>
            </div>
             {/* <CardActions  style={{padding: 5, marginRight: "200px",}}>
                
            </CardActions>  */}
          </div>
     
        </Card>;
  };
  
function SelectingDataSourceOfChannels(props) {

  const [typesSourceChannels, setTypesSourceChannels] = useState(["הידרה", "מדג'טק","קארטסנס","גרנט"]);
  const [sourceChannelsValue, setSourceChannelsValue] = useState("");
  const hydraList = useSelector((state) => state.channelData.channelsData);

  const startHydraScan = () =>{
   
  }

    return (
        <div>
          <div className='flex-container'>
              <div className='detailItem'> 
                      <Label>מקור נתונים:</Label> 
                      <ComboBox value={sourceChannelsValue} data={typesSourceChannels} onChange={(e) => setSourceChannelsValue(e.value) } 
                                style={{width: "350px",}}>
                      </ComboBox>                      
              </div>
               
          </div>
          <div className='load-hydra-active'>   
            {
                sourceChannelsValue === typesSourceChannels[0] && 
                <div className='flex-container'>
                  <ListView data={hydraList} item={DataHydraItem}/>
                  <div> 
                      <Button icon="play" themeColor={"primary"} style={{width: "250px,"}} onClick={startHydraScan}>הפעל</Button>
                  </div> 
                
                </div>
            } 
          </div> 
        </div>
    );
}

export default SelectingDataSourceOfChannels;