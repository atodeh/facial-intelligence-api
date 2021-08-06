const handleRegister = (req, res, db, bcrypt) => {
  const { email, password, name } = req.body; //destructuring
  const hashedPassword = bcrypt.hashSync(password);
  if (email.includes('@') && email.endsWith('.com') && name !== "" && password !== "") {
    db.transaction(trx => {
      trx.insert({
        hash: hashedPassword,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*') //returns all of the columns
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
      })
      .then(trx.commit) //we need to commit for the above to be added to database
      .catch(trx.rollback) //in case anything fails, we roll back the changes
    })
    .catch(error => res.status(400).json("user email is already registered"));
  } else {
    res.status(404).json('invalid information');
  }
}

module.exports = {
  handleRegister: handleRegister
};