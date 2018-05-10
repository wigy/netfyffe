import app from './App';

const port = process.env.PORT || 9003;

app.listen(port, (err: Error) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`Server is listening on ${port}`);
})