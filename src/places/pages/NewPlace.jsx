import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./PlaceForm.css";

const NewPlace = () => {
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [inputState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", inputState.inputs.title.value);
      formData.append("description", inputState.inputs.description.value);
      formData.append("address", inputState.inputs.address.value);
      formData.append("image", inputState.inputs.image.value); // image key will be used in backend to extract image file

      await sendRequest(
        import.meta.env.VITE_BACKEND_URL + "/places",
        "POST",
        {'Authorization': `Bearer ${auth.token}`},
        formData
      );
      console.log(inputState.inputs);
      history.push("/"); // Starting page
      // Redirect the user to a different page
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          center
          errorText="Please upload a valid image"
        />
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid title"
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid desciption (at least 5 characters)"
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!inputState.isValid}>
          Add Place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
