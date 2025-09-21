import React, { useState, useContext } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }

    setIsLoginMode((prevMode) => {
      return !prevMode;
    });
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/users/login`,
          "POST",
          {
            "Content-Type": "application/json",
          },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );
        console.log(responseData);
        // This has to be done before auth.login or else you would be changing state of a component that doesn't exist.
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData(); // Built into browser
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value) // Key of image, backend will extract image file from key image
        
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/users/signup`,
          "POST",
          {},
          formData // Fetch API automatically sets headers
        );

        console.log(responseData); // This has to be done before auth.login or else you would be changing state of a component that doesn't exist.
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  {
    error && <p style={{ color: "red" }}>Error state: {error}</p>;
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} errorText='Invalid file picked'/>}
          <Input
            id="email"
            label="E-Mail"
            element="input"
            type="email"
            onInput={inputHandler}
            errorText="Please enter a valid Email"
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input
            id="password"
            label="Password"
            element="input"
            type="password"
            onInput={inputHandler}
            errorText="Please enter a valid password (Min. length 5 characters)"
            validators={[VALIDATOR_MINLENGTH(5)]}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "SignUp"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLoginMode ? "SignUp" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
