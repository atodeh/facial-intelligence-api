const handleSignin = (req, res, db, bcrypt) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
    .then(data => {
      const isPasswordValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isPasswordValid) {
        db.select('*').from ('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
      } else {
        res.status(404).json('invalid password');
      }
    })
    .catch(error => res.status(400).json('email does not exist'))
}

module.exports = {
  handleSignin: handleSignin
};