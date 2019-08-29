// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACabcf6fc1ac45141da728ec1ff5cb1189';
const authToken = 'ce6ea871062c258e961c4953381d1e23';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Este es un mensaje de prueba',
     from: '+15202143363',
     to: '+51995566657'
   })
  .then(message => console.log(message.sid))
  .catch((error) => {
    logger.error('Algo ocurrio con twilio.' + error)
    console.log(error)
  });
