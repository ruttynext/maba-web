import {React, useState} from 'react';
import { Grid, GridColumn} from "@progress/kendo-react-grid";
import ChannelsData from '../../../data/channelsData.json';
import { Checkbox } from '@progress/kendo-react-inputs';

  const CheckboxCell = (props) => {

    return (
      <td>
          <Checkbox defaultChecked={Boolean(props.dataItem.Active)} />
      </td>
    );
  };

function ChannelsSelection(props) {

    const [channelsData, setChannelsData] = useState(ChannelsData);

    const MyCheckBoxCell = (props) => (
        <CheckboxCell {...props}/>
      );
      
    return (
    <div className='flexControl'>
        
                    <Grid data={channelsData}>
                            <GridColumn field="Id" title="#" />
                            <GridColumn field="Units" title="יחידות" />
                            <GridColumn field="MabaNum" title="מס מבא" />
                            <GridColumn field="Ragash" title="רגש" />
                            <GridColumn field="channel" title="ערוץ" />
                            <GridColumn field="Active" title="ערוץ פעיל" cell={MyCheckBoxCell}/>  

                    </Grid>   
                                               
     </div>
       
    );
}

export default ChannelsSelection;