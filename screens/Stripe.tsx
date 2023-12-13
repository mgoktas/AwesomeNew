// import { PlatformPay, PlatformPayButton, confirmPlatformPayPayment, isPlatformPaySupported } from '@stripe/stripe-react-native';
// import { useEffect, useState } from 'react';
// import { Alert, View } from 'react-native';

import { PlatformPay, PlatformPayButton, isPlatformPaySupported, useStripe } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { Alert, Button, View } from "react-native";
import { Screen } from "react-native-screens";
import { API_URL, API_URLtest } from "../components/Data";

// export const PaymentScreen = () => {
//   const [isApplePaySupported, setIsApplePaySupported] = useState(false);

//   useEffect(() => {
//     (async function () {
//       setIsApplePaySupported(await isPlatformPaySupported());
//     })();
//   }, [isPlatformPaySupported]);

//     // ...
//     const fetchPaymentIntentClientSecret = async () => {
//       const response = await fetch(`${API_URL}/create-payment-intent`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           some: 'value',
//         }),
//       });
//       const { clientSecret } = await response.json();
  
//       return clientSecret;
//     };
//         // ...
//     const pay = async () => {
//         const clientSecret = await fetchPaymentIntentClientSecret()
//         const { error } = await confirmPlatformPayPayment(
//         clientSecret,
//         {
//             applePay: {
//             cartItems: [
//                 {
//                 label: 'Example item name',
//                 amount: '14.00',
//                 paymentType: PlatformPay.PaymentType.Immediate,
//                 },
//                 {
//                 label: 'Total',
//                 amount: '12.75',
//                 paymentType: PlatformPay.PaymentType.Immediate,
//                 },
//             ],
//             merchantCountryCode: 'US',
//             currencyCode: 'USD',
//             requiredShippingAddressFields: [
//                 PlatformPay.ContactField.PostalAddress,
//             ],
//             requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
//             },
//         }
//         );
//         if (error) {
//         // handle error
//         } else {
//         Alert.alert('Success', 'Check the logs for payment intent details.');
//         }
//     };

//   // ...

//   return (
//     <View>
//       {isApplePaySupported && (
//         <PlatformPayButton
//           onPress={pay}
//           type={PlatformPay.ButtonType.Order}
//           appearance={PlatformPay.ButtonStyle.Black}
//           borderRadius={4}
//           style={{
//             width: '100%',
//             height: 50,
//           }}
//         />
//       )}
//     </View>
//   );
// }

// export default PaymentScreen

export default function CheckoutScreen() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [isApplePaySupported, setIsApplePaySupported] = useState(false);


  useEffect(() => {
    (async function () {
      setIsApplePaySupported(await isPlatformPaySupported());
    })();
  }, [isPlatformPaySupported]);

  
    const fetchPaymentSheetParams = async () => {
      // const response = await fetch(`${API_URLtest}/payment-sheet`, {
      const response = await fetch(`${API_URLtest}/create-checkout-session?priceId=price_1OGDO2EYzAPwGPE1sx7e0bOP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      const { paymentIntent, ephemeralKey, customer, amount} = await response.json();
  

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };
  
    const initializePaymentSheet = async () => {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = await fetchPaymentSheetParams();
  
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Will Doro Inc..",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: '',
        },
        returnURL: 'http://will-doro-ff47e2266450.herokuapp.com/success?email=email'
      });
      if (!error) {
        setLoading(true);
      }
    };
    
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
    
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          Alert.alert('Success', 'Your order is confirmed!');
        }
      };

    useEffect(() => {
      initializePaymentSheet();
    }, []);

    return (
            <View>
              {isApplePaySupported && (
                <PlatformPayButton
                  onPress={openPaymentSheet}
                  type={PlatformPay.ButtonType.Order}
                  appearance={PlatformPay.ButtonStyle.Black}
                  borderRadius={4}
                  style={{
                    width: '100%',
                    height: 50,
                  }}
                />
              )}
            </View>
          );
  }