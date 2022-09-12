import React, { useEffect } from 'react';
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import EditFormSiteManagement from '../../components/EditFormSiteManagement/EditFormSiteManagement';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import './SiteManagement.css'
import { Loader } from "@progress/kendo-react-indicators";
import configData from "../../config.json";
import { Checkbox } from "@progress/kendo-react-inputs";


const EditCommandCell = (props) => {

  return (
    <td>
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
        onClick={() => props.enterEdit(props.dataItem, props.modeButton)}>
        {props.text}
      </button>
    </td>
  );
};

const CheckboxCell = (props) => {

  return (
    <td>
        <Checkbox defaultChecked={Boolean(props.dataItem.UserIsActive)} onClick={() => props.checActive(props.dataItem)} />
    </td>
  );
};

const EditMode = {
  "Edit": 1,
  "Insert": 2,
  "Delete": 3
};

function SiteManagement(props) {

  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({UserNumber: 20,});
  const [mode, setMode] = React.useState(EditMode.Edit);
  const [data, setData] = React.useState(null);

  const enterEdit = (item, modeButton) => {

    setMode(modeButton);

    switch(modeButton)
    {
      case EditMode.Edit:
        setOpenForm(true);
        setEditItem(item);
      break;

      case EditMode.Delete:
        let newData = data;
        var idx = newData.indexOf(item);
        if (idx !== -1) {
           newData.splice(idx, 1);
        }
        setData(newData);
      break;
      default:
        break;
    }
  };
 
  const checActive = (dataItem) => {
    
    let newData = data.map((item) => {
      if (dataItem.UserNumber === item.UserNumber) {
          item.UserIsActive = !dataItem.UserIsActive;
      }

      return item;
    });

    setData(newData);


  };

  //submit event of User edit dialog 
  const handleSubmit = (event) => {

    switch(mode)
    {
      case EditMode.Edit:
        let newData = data.map((item) => {
          if (event.UserNumber === item.UserNumber) {
            item = { ...event };
          }

          return item;
        });

       // axios.post(configData.SERVER_URL + 'AppUser/UpdateUser', event)
        setData(newData);
        break;

      case EditMode.Insert:

        //axios.post(configData.SERVER_URL + 'AppUser/AddAppUser', event)
          // setData(data.concat(event));

        break;
        default:
        break;
    }

    setOpenForm(false);

  };

  //cancel event of User edit dialog 
  const handleCancelEdit = () => {
    setOpenForm(false);
  };

  const MyEditCommandCell = (props) => (
    <EditCommandCell {...props} enterEdit={enterEdit} text="עריכה" modeButton={EditMode.Edit}/>
  );

  // const DeleteCommandCell = (props) => (
  //   <EditCommandCell {...props} enterEdit={enterEdit} text="מחיקה" modeButton={EditMode.Delete} />
  // );

   const MyCheckBoxCell = (props) => (
      <CheckboxCell {...props} checActive={checActive}/>
    );

    //Returns the list of users from the database
   useEffect(() => {

       async function fetchData() {

         const url = configData.SERVER_URL + `AppUser/GetAllUsers`;
         const response = await axios.get(url);
         return response;
       }

       fetchData().then((response)=> {
        console.log(response.data.AppUser);
             setData(response.data.AppUser);
        }).catch(err => console.log(err));

   }, []);

  // function AddNewUser()
  // {
  //   setOpenForm(true);
  //   setEditItem(null);
  //   setMode(EditMode.Insert);
  // }

  function SaveData()
  {
       axios.post(configData.SERVER_URL + 'AppUser/UpdateUser', data)
  }

    return (
      <Container className='p-siteManagement'>
       {data ?
        <div className="siteManagement-container">

        {/* <Button icon="k-i-plus" onClick={AddNewUser}>הוסף משתמש חדש + </Button> */}
         <React.Fragment>
          <Grid
            style={{
              height: "400px",
            }}
            data={data}>

            <Column field="UserNumber" title="ID" width="40px" className="product-name"/>
            <Column field="UserLogin" title="שם משתמש" width="250px" />
            <Column field="UserPassword" title="סיסמה" />
            <Column field="UserFullName" title="שם מלא" />
            <Column field="UserPhone" title="טלפון" />
            <Column field="UserAddress" title="כתובת" />
            <Column field="UserIsActive" cell={MyCheckBoxCell} title="משתמש פעיל" />  
            <Column cell={MyEditCommandCell} />
          </Grid>
          <div className='div-submit'>
               <button type={"submit"} className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onClick={SaveData} >שמור</button>
          </div>
          {openForm && (
            <EditFormSiteManagement
              cancelEdit={handleCancelEdit}
              onSubmit={handleSubmit}
              item={editItem}
            />
          )}
    </React.Fragment>
   
    </div> : <div className='div-spinner'><Loader size="large" type={"infinite-spinner"} /></div>  }
   
    </Container>
  );
};



export default SiteManagement;