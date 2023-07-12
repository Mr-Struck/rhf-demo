import { FieldErrors, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumber: string[];
  age: number;
  dob: Date;
};

export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumber: ["", ""],
      age: 0,
      dob: new Date(),
    },
    mode: "onBlur",
  });

  const { register, control, handleSubmit, formState, watch, reset } = form;
  const { errors, isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Submitted Successfully", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log(errors);
    toast.error("Check for errors", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 1000,
    });
  };

  return (
    <div>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter registered username"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "Username is Required",
              },
            })}
          />
          <p>{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter registered email ID"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email address is Required",
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (fieldName) => {
                  return (
                    fieldName !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlaskListed: (fieldname) => {
                  return (
                    !fieldname.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                emailAvailable: async (fieldname) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldname}`
                  );
                  const data = await response.json();
                  return data.length == 0 || "Email already exists";
                },
              },
            })}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            placeholder="Enter YouTube channel name"
            id="channel"
            {...register("channel", {
              required: {
                value: true,
                message: "Channel is Required",
              },
            })}
          />
          <p>{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            placeholder="Enter twitter username"
            id="twitter"
            {...register("social.twitter", {
              disabled: watch("channel") === "",
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            placeholder="Enter facebook username"
            id="facebook"
            {...register("social.facebook")}
          />
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="number"
            placeholder="Enter primary-phone number"
            id="primary-phone"
            {...register("phoneNumber.0", {
              required: {
                value: true,
                message: "Primary phone number is required",
              },
            })}
          />
          <p>{errors.phoneNumber?.[0]?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="number"
            placeholder="Enter secondary-phone number"
            id="secondary-phone"
            {...register("phoneNumber.1")}
          />
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="text"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is Required",
              },
              validate: {
                notEighteen: (fieldname) => {
                  return fieldname >= 18 || "Must be above 18 years";
                },
                notHundred: (fieldname) => {
                  return fieldname < 100 || "Must be below 100 years";
                },
              },
            })}
          />
          <p>{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date of Birth is Required",
              },
            })}
          />
          <p>{errors.dob?.message}</p>
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </form>
      <DevTool control={control} />
      <Toaster />
    </div>
  );
};
