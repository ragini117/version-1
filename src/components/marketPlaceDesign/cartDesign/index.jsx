import { useDispatch, useSelector } from "react-redux";
import styles from "./cartDesign.module.css";
import { getCardData } from "@/redux/actions/marketPageAction";
import { useEffect, useState } from "react";
import { apiUrl } from "../../../../environment";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const dispatch = useDispatch();
  const [totalDeodPrice, setTotalDeodPrice] = useState("");
  const [totalUSDTPrice, setTotalUSDTPrice] = useState("");
  const { marketPageReducer } = useSelector((res) => res);

  const allcardData = marketPageReducer?.cartData?.cart?.cartItems;
  const cardData = Array.isArray(allcardData) ? allcardData : [allcardData];

  const handleRemoveAsset = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/cart/delete-cart-items`, {
        data: { assetId: id },
      });
      toast.success(response.data.message);
      dispatch(getCardData());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (marketPageReducer.checkRemove) {
      console.log("removeCard Data", marketPageReducer.message);
      dispatch(getCardData());
    }
  }, [marketPageReducer]);

  useEffect(() => {
    let sumDeod = 0;
    let sumUSDT = 0;
    cardData?.forEach((value) => {
      sumDeod += parseFloat(value?.price);
      sumUSDT += parseFloat(value?.price);
    });
    setTotalDeodPrice(sumDeod);
    setTotalUSDTPrice(sumUSDT);
  }, [cardData]);

  useEffect(() => {
    dispatch(getCardData());
  }, []);
  console.log("cardData", cardData);
  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className={`${styles.shopping_cart_heading}`}>
              <h2>Shopping Cart</h2>
              <p>BSC Network</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 col-12">
            <div className={`table-responsive ${styles.cart_box}`}>
              <table className={`table table-border ${styles.table_cart}`}>
                <tbody>
                  {cardData &&
                    cardData?.map((value, key) => {
                      return (
                        <tr>
                          <td>
                            <div className={` ${styles.cart_box1}`}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  defaultValue
                                  id="flexCheckDefault"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className={`${styles.cart_box1}`}>
                              <img
                                src={`${apiUrl}${"/asset/getImages?imageName="}${
                                  value?.imageUrl[0]
                                }&pathName=${value?.imagePath}`}
                                alt="img"
                              />
                            </div>
                          </td>
                          <td>
                            <div className={`${styles.cart_box1}`}>
                              <p>
                                {value?.category === "City"
                                  ? value?.nameOfCity
                                  : value?.category === "Model"
                                  ? value?.modelName
                                  : value?.category === "Props"
                                  ? value?.propName
                                  : value?.nameOfNft}
                              </p>
                              <p>{value?.category}</p>
                            </div>
                          </td>
                          <td>
                            <div className={`${styles.cart_box2}`}>
                              <img src="/assets/deod.png" alt="" />
                              <p>@Decentrawood</p>
                            </div>
                          </td>

                          <td>
                            <div className={`${styles.cart_box3}`}>
                              <div className={` ${styles.deod_price}`}>
                                <img src="/assets/deod.png" alt="" />
                                <p>{value?.price}</p>
                              </div>
                              <p>{value?.price} USD</p>
                            </div>
                          </td>

                          <td>
                            <div
                              className={`${styles.cart_box3}`}
                              onClick={() => handleRemoveAsset(value.assetsId)}
                            >
                              <div className={` ${styles.delete_box}`}>
                                <i className="fa-solid fa-trash-can"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4 col-12">
            <div className={`${styles.order_price}`}>
              <h3>Total Cart</h3>

              <div className={`${styles.order_price2}`}>
                <div className={`${styles.cart_box3}`}>
                  <div className={` ${styles.deod_price}`}>
                    <img src="/assets/deod.png" alt="" />
                    <p>{(+totalDeodPrice)?.toFixed(2)}</p>
                  </div>
                  <p>{(+totalUSDTPrice)?.toFixed(2)} USD</p>
                </div>
                <button className={`btn ${styles.buy_btn}`}>Buy Now</button>
              </div>
            </div>
          </div>

          {/* <table></table> */}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};
export default page;
