import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const userId = useParams().userId;

  useEffect(() => {
    //setLoadedPlaces(null);
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${VITE_BACKEND_URL}places/user/${userId}`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {
        if (
          err.message.includes(
            "Could not find places for the provided user id."
          )
        ) {
          setLoadedPlaces([]);
        }
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };
  let content;
  if (isLoading) {
    console.log("still loading");
    content = (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  } else if (!isLoading && loadedPlaces !== null && loadedPlaces.length === 0) {
    content = (
      <PlaceList
        isLoggedIn={auth.isLoggedIn}
        items={[]}
        onDeletePlace={placeDeletedHandler}
      />
    );
  } else if (!isLoading && loadedPlaces) {
    content = (
      <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
    );
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {content}
    </React.Fragment>
  );
};

export default UserPlaces;

//10:15pm 31/5/2025
//Also I like what was done here "setLoadedPlaces((prevPlaces) =>
//prevPlaces.filter((place) => place.id !== deletedPlaceId)
//);"
//After deleting rather than send a request to the server again we just deal with data to be reloaded from the client side

//11:06pm also notice how I brought in 'auth.isLoggedIn' to handle cases where we are loading places for to a user thats not logged in

