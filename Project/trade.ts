import { KiteConnect } from "kiteconnect";
const apiKey = "";
//const apiSecret = "e70zzqof0w4lu37yn1kr9uydp8vzb34c";
//const requestToken = "I7dTX2IQPGPyEdxPItqbTcqgxrL0v6On";

let accessToken=""; //expire in a day

const kc = new KiteConnect({ api_key: apiKey });

console.log(kc.getLoginURL());
kc.setAccessToken(accessToken);

export async function placeOrder(tradingsymbol: string, quantity: number, type:"BUY" | "SELL") {
  try {
    
     await kc.placeOrder("regular",{
     exchange: "NSE",
     tradingsymbol,
     transaction_type: type,
     quantity,
     product: "CNC",
     order_type: "MARKET",
     //price: 5,
   });
 } catch (err) {
   console.error(err);
 }
}

export async function getPositions() {
  const holdings = await kc.getPositions();
  let allHoldings = "";
  holdings.net.forEach(holding => {
    allHoldings += `stock: ${holding.tradingsymbol}, qty:${holding.quantity}, currentPrice:${holding.last_price}\n`;
  });
  return allHoldings;
}


// It is used to generate the session token for the user. It is used to authenticate the user and get the access token.
// It is used to get the access token for the user. It is used to authenticate the user and get the access token.

/*async function init(){
  try{
     await generateSession()
     
  } catch(err){
       console.error(err);
  }
}

async function generateSession() {
  try{
    const response = await kc.generateSession(requestToken, apiSecret);
    console.log("Access Token: ", response.access_token);
    kc.setAccessToken(response.access_token);
    console.log("session genrate ", response);
  } catch(err){
    console.error("Error generating session: ", err);
  }
}

async function getProfile() {
  try {
    const profile = await kc.getProfile();
    console.log("Profile: ", profile);
  } catch (err) {
    console.error("Error fetching profile: ", err);
  }
}

init();
getProfile(); 
generateSession(); */
