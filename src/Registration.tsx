import React, { ChangeEvent, FC, FocusEvent, FormEvent } from "react";
import {
  FormState,
  isFormDataKey,
  useFormState as useRegistrationState
} from "./RegistrationState";

const validationErrorClass = "validationError";

export const Registration: FC = () => {
  const [
    { formState, formData: registrationData, validationErrors },
    { updateField, validateField, submitFormData: submitRegistrationData }
  ] = useRegistrationState();

  const handleFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submitRegistrationData();
  };

  const handleFieldChanged = ({
    target: { name, type, checked, value }
  }: ChangeEvent<HTMLInputElement>) => {
    if (isFormDataKey(name)) {
      updateField(name, type === "checkbox" ? checked : value);
    }
  };

  const handleFieldBlur = ({
    target: { name }
  }: FocusEvent<HTMLInputElement>) => {
    if (isFormDataKey(name)) {
      validateField(name);
    }
  };

  if (formState === FormState.Submitted) {
    return <h2>Registration Complete!</h2>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={handleFormSubmission}>
          <fieldset disabled={formState !== FormState.Updating}>
            <label htmlFor="firstName">Name</label>
            <input
              className={
                validationErrors.has("firstName") ? validationErrorClass : ""
              }
              type="text"
              placeholder="First name"
              id="firstName"
              name="firstName"
              value={registrationData.firstName}
              onChange={handleFieldChanged}
              onBlur={handleFieldBlur}
            />
            <p
              className={
                validationErrors.has("firstName") ? validationErrorClass : ""
              }
            >
              {validationErrors.get("firstName")}
            </p>

            <input
              className={
                validationErrors.has("lastName") ? validationErrorClass : ""
              }
              type="text"
              placeholder="Last name"
              id="lastName"
              name="lastName"
              value={registrationData.lastName}
              onChange={handleFieldChanged}
              onBlur={handleFieldBlur}
            />
            <p
              className={
                validationErrors.has("lastName") ? validationErrorClass : ""
              }
            >
              {validationErrors.get("lastName")}
            </p>

            <label htmlFor="email">Email</label>
            <input
              className={
                validationErrors.has("email") ? validationErrorClass : ""
              }
              type="email"
              placeholder="sample@xyz.com"
              id="email"
              name="email"
              value={registrationData.email}
              onChange={handleFieldChanged}
              onBlur={handleFieldBlur}
            />
            <p
              className={
                validationErrors.has("email") ? validationErrorClass : ""
              }
            >
              {validationErrors.get("email")}
            </p>

            <label htmlFor="phone">Contact phone number</label>
            <input
              className={
                validationErrors.has("phone") ? validationErrorClass : ""
              }
              type="tel"
              id="phone"
              name="phone"
              placeholder="(213) 555-1580"
              value={registrationData.phone}
              onChange={handleFieldChanged}
              onBlur={handleFieldBlur}
            />
            <p
              className={
                validationErrors.has("phone") ? validationErrorClass : ""
              }
            >
              {validationErrors.get("phone")}
            </p>

            <div>
              <input
                disabled={formState !== FormState.Updating}
                type="submit"
                id="submitButton"
                name="submitButton"
                value="Register"
              />
              <p
                className={
                  validationErrors.has("*") ? validationErrorClass : ""
                }
              >
                {validationErrors.get("*")}
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};
