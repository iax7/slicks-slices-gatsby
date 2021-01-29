import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import formatMoney from './formatMoney';
import calculateOrderTotal from './calculateOrderTotal';
import calculatePizzaPrice from './calculatePizzaPrice';

export default function usePizza({ pizzas, values }) {
  // 1. Create some state to hold our order
  //  We got rid of this line because we moved useState up to the provider
  //   const [order, setOrder] = useState([]);
  //  Now we access both our state and our updater function (setOrder) via context
  const [order, setOrder] = useContext(OrderContext);

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. make a function add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }

  // 3. Make a function remove things from order
  function removeFromOrder(index) {
    setOrder([
      // everything before the item
      ...order.slice(0, index),
      // eveything after the item index
      ...order.slice(index + 1),
    ]);
  }

  // 4. Send this data the a serverless function when they check out
  //    this is the function that is run when someone submits the form
  async function submitOrder(e) {
    e.preventDefault(); // avoid sending through url params
    setLoading(true);
    setError(null);
    setMessage(null);

    // gather all the data
    const body = {
      order: order.map((item) => {
        const pizza = pizzas.find((p) => p.id === item.id);
        return {
          ...item,
          name: pizza.name,
          thumbnail: pizza.image.asset.fluid.src,
          price: formatMoney(calculatePizzaPrice(pizza.price, item.size)),
        };
      }),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    };

    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const text = JSON.parse(await res.text());

    // Check if everything worked
    if (res.status >= 400 && res.status < 600) {
      setLoading(false); // turn off loading
      setError(text.message);
    } else {
      // worked!
      setLoading(false); // turn off loading
      setMessage('Success! Come on down for your pizza');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}
