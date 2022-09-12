import React from 'react';
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Dialog } from "@progress/kendo-react-dialogs";
import './EditFormSiteManagement.css'
import { MultiSelect } from "@progress/kendo-react-dropdowns";

function EditFormSiteManagement(props) {
  
  const classes = [
    "תנורים",
    "ולחות טמפרטורה",
    "מוצק",
    "נוזל",
    "מסה",
    "אלקטרוניקה",
    "לחץ וואקום",
    "מיקרו נפח",
  ];

  const ComBoBoxClasses = (props) => (
    <MultiSelect data={classes}/>
  );
    return (
      <div dir="rtl">
        <Dialog title={props.item ? `עריכה  ${props.item.UserNumber}` : `הוספת משתמש חדש`} onClose={props.cancelEdit}> 
        <Form dir="rtl"
          onSubmit={props.onSubmit}
          initialValues={props.item}
          render={(formRenderProps) => (
            <FormElement style={{
              maxWidth: 750,
              width: "100%",
              }}>
                
              <fieldset className={"k-form-fieldset"}>
              <div className="row">
              <div className="column" dir='rtl'>
                 <div className="mb-1" dir="rtl">
                        <Field
                            name={"UserLogin"}
                            component={Input}
                            label={"שם משתמש"}
                        />
                    </div>


                    <div className="mb-1" dir="rtl">
                        <Field
                            name={"UserPassword"}
                            component={Input}
                            label={"סיסמה"}
                        />
                    </div>
                    <div className="mb-3" dir="rtl">
                        <Field
                            name={"UserFullName"}
                            component={Input}
                            label={"שם מלא"}
                        />
                         </div>
                    
                    <div className="mb-3" dir="rtl">
                        <Field
                            name={"UserPhone"}
                            component={Input}
                            label={"טלפון"}
                        />
                    </div>
                    
                    
                    <div className="mb-3" dir="rtl">
                        <Field
                            name={"UserAddress"}
                            component={Input}
                            label={"כתובת"}
                        />
                    </div>
                    
                    </div>
                    <div className="column" dir='rtl'>
                    <div className="mb-3" dir="rtl">מחלקות 
                        <Field 
                            component={ComBoBoxClasses}
                            label={"מחלקות"}
                        />
                    </div>
                     </div> 
              </div>
              </fieldset>
              <div className="k-form-buttons" dir='ltr'>
                <button
                  type={"submit"}
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  disabled={!formRenderProps.allowSubmit}
                >
                {props.item ? "עדכון"  :"הוספה" }
                </button>
                <button
                  type={"submit"}
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                  onClick={props.cancelEdit}
                >
                  ביטול
                </button>
              </div>
            </FormElement>
          )}
        />
      </Dialog>
      </div>
    );
}

export default EditFormSiteManagement;