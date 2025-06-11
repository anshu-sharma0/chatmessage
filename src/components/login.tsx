import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const typeToYup = (type: string) => {
  switch (type) {
    case 'email':
      return yup.string().email('Enter a valid email').required('Email is required');
    case 'password':
      return yup.string().min(4, 'Password must be at least 4 characters').required('Password is required');
    case 'number':
      return yup
        .number()
        .typeError('Must be a number')
        .required('Number is required');
    case 'tel':
      return yup.string().matches(/^[0-9+\-\s()]+$/, 'Enter a valid phone number').required('Phone number is required');
    case 'date':
      return yup.date().typeError('Enter a valid date').required('Date is required');
    case 'text':
    default:
      return yup.string().required(`The ${type} field is required`).nullable();
  }
};

const buildUserSchema = (users: typeof usersData) => {
  if (!users || users.length === 0) {
    return yup.object({
      users: yup.array().required('Users array is required'),
    });
  }

  // Create a dynamic schema object for each user's fields
  const userFieldSchema = users[0].fields.reduce((acc, field) => {
    acc[field.name] = typeToYup(field.name);
    return acc;
  }, {} as Record<string, yup.AnySchema>);

  return yup.object({
    users: yup.array().of(
      yup.object(userFieldSchema)
    ).required('Users array is required'),
  });
};

// Sample data with various input types
const usersData = [
  {
    fields: [
      { name: "email", value: "user@user.com", type: "email" },
      { name: "password", value: "abcd", type: "password" },
      { name: "phone", value: "+1234567890", type: "tel" },
      { name: "birthdate", value: "", type: "date" },
      { name: "radio", value: "", type: "radio" },
    ],
  },
  {
    fields: [
      { name: "email", value: "test@test.com", type: "email" },
      { name: "password", value: "1234", type: "password" },
      {name: "vikram", type: "month"}
    ],
  },
  {
    fields: [
      { name: "email", value: "xyz@abc.com", type: "email" },
      { name: "password", value: "password", type: "password" },
    ],
  },
];

// Generate schema dynamically
const userSchema = buildUserSchema(usersData);
type FormData = yup.InferType<typeof userSchema>;

// Build default values dynamically
const defaultValues: FormData = {
  users: usersData.map((u) => {
    const obj: any = {};
    u.fields.forEach((f) => {
      obj[f.name] = f.value ?? "";
    });
    return obj;
  }),
};

const Login = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    console.log({ user, isAuthenticated, isLoading });
  }, [user, isAuthenticated, isLoading]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form submitted:", data);
    fetch("http://localhost:5000/api/auth/form-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  // Helper function to get appropriate placeholder text
  const getPlaceholder = (fieldName: string, fieldType: string) => {
    switch (fieldType) {
      case 'email':
        return 'Enter your email';
      case 'password':
        return 'Enter your password';
      case 'number':
        return 'Enter a number';
      case 'tel':
        return 'Enter phone number';
      case 'date':
        return 'Select date';
      default:
        return `Enter ${fieldName}`;
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Dynamic Form Validation
        </h2>

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit, (formErrors) => {
            console.log("Validation errors:", formErrors);
          })}
        >
          {usersData.map((userObj, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                User {idx + 1}
              </h3>

              <div className="grid gap-4">
                {userObj.fields.map((field, fieldIdx) => {
                  const userErrors = errors?.users?.[idx];
                  const error = userErrors ? userErrors[field.name] : null;
                  return (
                    <div key={fieldIdx} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-600 capitalize">
                        {field.name} ({field.type})
                      </label>

                      <input
                        type={field.type}
                        placeholder={getPlaceholder(field.name, field.type)}
                        {...register(`users.${idx}.${field.name}` as const, {
                          valueAsNumber: field.type === "number" ? true : undefined,
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${error
                            ? "border-red-500 focus:ring-red-400 bg-red-50"
                            : "border-gray-300 focus:ring-blue-400 bg-white hover:border-gray-400"
                          }`}
                      />

                      {error && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span>⚠️</span>
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-6 py-3 rounded-lg flex-1 text-white font-medium transition-colors"
            >
              Submit Form
            </button>
            <button
              type="button"
              onClick={() => logout({ returnTo: window.location.origin })}
              className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 px-6 py-3 rounded-lg flex-1 text-white font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;