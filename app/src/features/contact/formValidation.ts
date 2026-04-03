export interface ContactFormValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export type ContactFormField = keyof ContactFormValues;

export const initialContactFormValues: ContactFormValues = {
  name: "",
  email: "",
  projectType: "",
  message: ""
};

export function validateContactField(field: ContactFormField, value: string) {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      if (!trimmed) {
        return "Name is required";
      }
      if (trimmed.length < 2) {
        return "Name must be at least 2 characters";
      }
      if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
        return "Name can only contain letters and spaces";
      }
      return "";
    case "email":
      if (!trimmed) {
        return "Email is required";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Please enter a valid email address";
      }
      return "";
    case "projectType":
      if (!trimmed) {
        return "Please select a project type";
      }
      return "";
    case "message":
      if (!trimmed) {
        return "Message is required";
      }
      if (trimmed.length < 10) {
        return "Message must be at least 10 characters";
      }
      if (trimmed.length > 1000) {
        return "Message must not exceed 1000 characters";
      }
      return "";
    default:
      return "";
  }
}

export function validateContactForm(values: ContactFormValues) {
  return {
    name: validateContactField("name", values.name),
    email: validateContactField("email", values.email),
    projectType: validateContactField("projectType", values.projectType),
    message: validateContactField("message", values.message)
  };
}

