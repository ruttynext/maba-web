import {React, useState, useEffect} from 'react';
import { Grid, GridColumn, getSelectedState} from "@progress/kendo-react-grid";
import HydraData from '../../../data/HydraData.json';
import { getter } from "@progress/kendo-react-common";

const DATA_ITEM_KEY = "HydraID";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

function HydraSelection(props) {

    const [selectedHidraState, setSelectedHidraState] = useState({});
    const [selectedHidra, setSelectedHidra] = useState({});


      const onSelectionHidraChange = (event) => {
       
        const newSelectedState = getSelectedState({
          event,
          selectedState: selectedHidraState,
          dataItemKey: DATA_ITEM_KEY,
        });
        setSelectedHidraState(newSelectedState);
      }; 

      useEffect(() => {
        if(selectedHidraState)
            setSelectedHidra(HydraData[0]);

        }, [selectedHidraState]);

    return (
         <div>
             <Grid
                 data={HydraData.map((item) => ({
                     ...item,
                     [SELECTED_FIELD]: selectedHidraState[idGetter(item)],
                   }))}
                 style={{width: "50%",}}
                 dataItemKey={DATA_ITEM_KEY}
                 selectedField={SELECTED_FIELD}
                 
                 selectable={{
                     enabled: true,
                     drag: false,
                     cell: false,
                     mode: "multiple",
                   }}
                 onSelectionChange={e=> (onSelectionHidraChange(e))}
                 onChange={e=> (console.log(e.value))}
                  >
                 <GridColumn field="HydraDegem" title="דגם הידרה" />
                 <GridColumn field="Comment" title="הערות" />
             </Grid>  
         </div>
    );
}

export default HydraSelection;