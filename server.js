const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No fle uploaded.' });
  }

  const { file } = req.files;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, error => {
    if (error) {
      return res.status(500).send(error);
    }

    return res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => console.log('Server started...'));
