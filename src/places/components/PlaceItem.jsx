import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const placeId = props.id;

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    console.log("Deleting..");
    setConfirmModal(false);
    try {
      await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/places/${placeId}`,
        "DELETE", {
          "Authorization": `Bearer ${auth.token}`
        }
      );
      props.onDelete(placeId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        header="Are you sure ?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
        onCancel={cancelDeleteHandler}
      >
        <p>
          Do you want to proceed and delete this place ? PLease note that it
          can't be undone thereafter
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner />}
          <div className="place-item__image">
            <img src={import.meta.env.VITE_ASSET_URL + `/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
