const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'eb4214fc7bdc4ec295e34fecdc7e71e6'
});

const handleClarifai = (req, res) => {

    if (req.body.input.match(/\.(jpeg|jpg|gif|png)$/) === null) {
        return res.status(400).json("Invalid URL entered!")
    };

    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;

    return db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to update entries'))
};

module.exports = {
    handleImage,
    handleClarifai
};