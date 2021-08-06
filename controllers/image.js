const Clarifai = require('clarifai'); //allows us to use installed clarifai API

//setting up clarifai API with my own personal API key
const app = new Clarifai.App({
  apiKey: '87478a6bf12d4a3db14659e06980bbd7'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(error => res.status(400).json('error')) //in case clarifai fails, an error is sent to the frontend along with a message
}

const handleImage = (req, res, db) => {
  const { id } = req.body; //destructuring
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries);
  })
  .catch(error => res.status(400).json('Unable to get entries'))
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};