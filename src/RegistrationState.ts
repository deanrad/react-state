import { useMemo, useReducer } from "react";
import { z } from "zod";
import { compose } from "./utility";
import { stateTransformReducer, StateTransformReducer } from "./StateTransform";

export enum FormState {
  Updating = "Updating",
  Validated = "Validated",
  Submitting = "Submitting",
  Submitted = "Submitted"
}

const nameRegex = /^\S{1,10}$/;

const formDataSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name can't be empty." })
    .max(10, { message: "First name can be no longer than 10 characters." })
    .regex(
      nameRegex,
      "First name can be no longer than 10 characters and must not contain whitespace."
    ),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name can't be empty." })
    .max(10, { message: "Last name can be no longer than 10 characters." })
    .regex(
      nameRegex,
      "Last name can be no longer than 10 characters and must not contain whitespace."
    ),
  email: z.string().email("Email is formatted incorrectly."),
  phone: z
    .string()
    .regex(
      /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/,
      "Phone number is improperly formatted."
    )
});

export type FormData = z.infer<typeof formDataSchema>;

const formDataKeysSchema = formDataSchema.keyof();

type FormDataKey = z.infer<typeof formDataKeysSchema>;

const formDataKeys = formDataKeysSchema.options;

type FormDataFieldType = FormData[keyof FormData];

export const isFormDataKey = (s: string): s is FormDataKey =>
  formDataKeys.includes(s as FormDataKey);

type ValidationKey = FormDataKey | "*";

export type ValidationErrors = Map<ValidationKey, string>;

export type State = {
  formState: FormState;
  formData: FormData;
  validationErrors: ValidationErrors;
};

const parseField = (
  fieldName: FormDataKey,
  fieldValue: FormDataFieldType
): string | undefined => {
  const parseResult = formDataSchema.shape[fieldName].safeParse(fieldValue);
  if (parseResult.success) {
    return;
  }

  return parseResult.error.format()._errors[0];
};

const inPermittedState = (
  requiredState: FormState,
  currentState: FormState,
  operationName: string
): boolean => {
  const inRequiredState = currentState === requiredState;
  if (!inRequiredState) {
    console.warn(`Invalid form state (${currentState}) for ${operationName}.`);
  }

  return inRequiredState;
};

const validateField =
  (fieldName: FormDataKey) =>
  (state: State): State => {
    const { formState, formData, validationErrors: previousErrors } = state;

    if (!inPermittedState(FormState.Updating, formState, "field validation")) {
      return state;
    }

    const error = parseField(fieldName, formData[fieldName]);
    if (previousErrors.get(fieldName) === error) {
      return state;
    }

    let validationErrors = new Map<ValidationKey, string>(previousErrors);
    if (error === undefined) {
      validationErrors.delete(fieldName);
    } else {
      validationErrors.set(fieldName, error);
    }
    return {
      ...state,
      validationErrors
    };
  };

const validateFormData = (state: State): State => {
  const { formState, formData } = state;

  if (!inPermittedState(FormState.Updating, formState, "form validation")) {
    return state;
  }

  const validationErrors: ValidationErrors = new Map<ValidationKey, string>();

  const parseResult = formDataSchema.safeParse(formData);
  if (parseResult.success) {
    return { ...state, formState: FormState.Validated, validationErrors };
  }

  const formattedErrors = parseResult.error.format();
  formDataKeys.forEach(key => {
    const firstError = formattedErrors[key]?._errors[0];
    if (firstError !== undefined) {
      validationErrors.set(key, firstError);
    }
  });

  return { ...state, validationErrors };
};

const updateField =
  (fieldName: FormDataKey, fieldValue: FormDataFieldType) =>
  (state: State): State => {
    if (
      !inPermittedState(FormState.Updating, state.formState, "field update")
    ) {
      return state;
    }

    const formData = {
      ...state.formData,
      [fieldName]:
        typeof fieldValue === "string" ? fieldValue.trim() : fieldValue
    };

    return { ...state, formData };
  };

const submissionSucceeded = (state: State): State => {
  if (
    !inPermittedState(
      FormState.Submitting,
      state.formState,
      "succeeding submission"
    )
  ) {
    return state;
  }

  return { ...state, formState: FormState.Submitted };
};

const submissionFailed = (state: State): State => {
  if (
    !inPermittedState(
      FormState.Submitting,
      state.formState,
      "failing submission"
    )
  ) {
    return state;
  }

  const validationErrors: ValidationErrors = new Map<ValidationKey, string>([["*", "Submission Failed..."]]);

  return { ...state, formState: FormState.Updating, validationErrors };
};

let simulateFailure = true;

const simulateSubmission = (_formData: FormData) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      if (simulateFailure) {
        reject();
      } else {
        resolve();
      }
      simulateFailure = !simulateFailure;
    }, 3000)
  );

const startSubmission =
  (succeeded: () => void, failed: () => void) =>
  (state: State): State => {
    if (!inPermittedState(FormState.Updating, state.formState, "submission")) {
      return state;
    }

    const postValidationState = validateFormData(state);
    if (postValidationState.formState !== FormState.Validated) {
      return postValidationState;
    }

    simulateSubmission(state.formData).then(succeeded).catch(failed);

    return { ...postValidationState, formState: FormState.Submitting };
  };

const initialState: State = {
  formState: FormState.Updating,
  formData: {
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  },
  validationErrors: new Map()
};

export type Actions = {
  updateField(fieldName: FormDataKey, fieldValue: string | boolean): void;
  validateField(fieldName: FormDataKey): void;
  submitFormData(): void;
};

export const useFormState = (): [State, Actions] => {
  const [state, dispatch] = useReducer<StateTransformReducer<State>>(
    stateTransformReducer,
    initialState
  );

  const actions = useMemo<Actions>(() => {
    const succeeded = () => dispatch(submissionSucceeded);
    const failed = () => dispatch(submissionFailed);
    return {
      updateField: compose(updateField, dispatch),
      validateField: compose(validateField, dispatch),
      submitFormData: () => dispatch(startSubmission(succeeded, failed))
    };
  }, []);

  return [state, actions];
};
