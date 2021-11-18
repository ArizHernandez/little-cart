import { uiActions } from "./ui";
import { cartActions } from "./cart";

const url = "https://react-http-ar-default-rtdb.firebaseio.com/cart.json";

export const fetchData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();

      dispatch(
        cartActions.replaceCart({
          totalQuantity: cartData.totalQuantity || 0,
          items: cartData.items || [],
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: err.message,
        })
      );
    }
  };
};

export const sentCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Loading...",
        message: "Sending Cart Data.",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          totalQuantity: cart.totalQuantity,
          items: cart.items,
        }),
      });

      if (!response.ok) {
        throw new Error("Sending cart data failed");
      }
    };

    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent Cart data successfully!",
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: err.message,
        })
      );
    }
  };
};
